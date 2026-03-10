import json
import os
import random
import string
from copy import deepcopy

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .models import MatchRecord, PlayerRating


DEFAULT_ELO_K = 32


def _expected_score(player_rating, opponent_rating):
    return 1 / (1 + 10 ** ((opponent_rating - player_rating) / 400))


def _elo_delta(player_rating, opponent_rating, score, k_factor=DEFAULT_ELO_K):
    expected = _expected_score(player_rating, opponent_rating)
    return round(k_factor * (score - expected))


def index(request):
    return render(request, 'core/index.html')


def health(request):
    return JsonResponse({
        'status': 'ok',
        'game': 'Cyborg Chess Edition',
        'timestamp': now().isoformat(),
    })


def _payload(request):
    try:
        return json.loads(request.body.decode('utf-8') or '{}')
    except json.JSONDecodeError:
        return {}




def _serialize_user(user):
    stats = user.stats
    profile = user.profile
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'avatar_url': profile.avatar_url,
        'stats': {
            'games_played': stats.games_played,
            'wins': stats.wins,
            'losses': stats.losses,
            'draws': stats.draws,
            'rating': stats.rating,
            'best_victory': stats.best_victory,
        }
    }


@require_http_methods(['POST'])
@csrf_exempt
def register_user(request):
    data = _payload(request)
    username = (data.get('username') or '').strip()
    email = (data.get('email') or '').strip()
    password = data.get('password') or ''

    if len(username) < 3 or len(password) < 6:
        return JsonResponse({'status': 'error', 'message': 'Usuario o contraseña inválidos'}, status=400)
    if User.objects.filter(username__iexact=username).exists():
        return JsonResponse({'status': 'error', 'message': 'El usuario ya existe'}, status=409)

    user = User.objects.create_user(username=username, email=email, password=password)
    login(request, user)
    return JsonResponse({'status': 'ok', 'user': _serialize_user(user)}, status=201)


@require_http_methods(['POST'])
@csrf_exempt
def login_user(request):
    data = _payload(request)
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    user = authenticate(request, username=username, password=password)
    if not user:
        return JsonResponse({'status': 'error', 'message': 'Credenciales inválidas'}, status=401)

    login(request, user)
    return JsonResponse({'status': 'ok', 'user': _serialize_user(user)})


@require_http_methods(['POST'])
@csrf_exempt
def logout_user(request):
    logout(request)
    return JsonResponse({'status': 'ok'})


@require_GET
def user_profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'No autenticado'}, status=401)
    return JsonResponse({'status': 'ok', 'user': _serialize_user(request.user)})


@require_http_methods(['POST'])
@csrf_exempt
def update_user_profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'No autenticado'}, status=401)

    data = _payload(request)
    avatar_url = (data.get('avatar_url') or '').strip()
    best_victory = (data.get('best_victory') or '').strip()

    if avatar_url:
        request.user.profile.avatar_url = avatar_url
        request.user.profile.save(update_fields=['avatar_url'])

    if best_victory:
        request.user.stats.best_victory = best_victory[:120]
        request.user.stats.save(update_fields=['best_victory', 'updated_at'])

    return JsonResponse({'status': 'ok', 'user': _serialize_user(request.user)})


@require_http_methods(['POST'])
@csrf_exempt
def submit_user_result(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'No autenticado'}, status=401)

    data = _payload(request)
    outcome = data.get('outcome')
    best_victory = (data.get('best_victory') or '').strip()
    opponent_rating = int(data.get('opponent_rating') or 1200)

    if outcome not in {'win', 'loss', 'draw'}:
        return JsonResponse({'status': 'error', 'message': 'Resultado inválido'}, status=400)

    stats = request.user.stats
    stats.games_played += 1
    score = 0.5
    if outcome == 'win':
        stats.wins += 1
        score = 1
        if best_victory:
            stats.best_victory = best_victory[:120]
    elif outcome == 'loss':
        stats.losses += 1
        score = 0
    else:
        stats.draws += 1

    stats.rating = max(800, stats.rating + _elo_delta(stats.rating, opponent_rating, score))

    stats.save()

    return JsonResponse({'status': 'ok', 'stats': _serialize_user(request.user)['stats']})

def _gen_room_code(length=8):
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(random.choices(alphabet, k=length))


def _piece_color(piece):
    return piece[0] if piece else None


def _in_bounds(r, c):
    return 0 <= r < 8 and 0 <= c < 8


def _initial_board():
    return [
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        [None, None, None, None, None, None, None, None],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
    ]


def _pseudo_moves(board, row, col):
    piece = board[row][col]
    if not piece:
        return []
    color = piece[0]
    enemy = 'b' if color == 'w' else 'w'
    kind = piece[1]
    moves = []

    def add_if_valid(r, c):
        if not _in_bounds(r, c):
            return
        target = board[r][c]
        if not target:
            moves.append({'row': r, 'col': c, 'capture': False})
        elif target[0] != color:
            moves.append({'row': r, 'col': c, 'capture': True})

    if kind == 'p':
        direction = -1 if color == 'w' else 1
        start = 6 if color == 'w' else 1
        nr = row + direction
        if _in_bounds(nr, col) and not board[nr][col]:
            moves.append({'row': nr, 'col': col, 'capture': False})
            jump = row + 2 * direction
            if row == start and not board[jump][col]:
                moves.append({'row': jump, 'col': col, 'capture': False})
        for dc in (-1, 1):
            nc = col + dc
            if _in_bounds(nr, nc) and board[nr][nc] and board[nr][nc][0] == enemy:
                moves.append({'row': nr, 'col': nc, 'capture': True})

    if kind == 'n':
        for dr, dc in [(-2, -1), (-2, 1), (-1, -2), (-1, 2), (1, -2), (1, 2), (2, -1), (2, 1)]:
            add_if_valid(row + dr, col + dc)

    if kind in {'b', 'r', 'q'}:
        directions = []
        if kind in {'b', 'q'}:
            directions += [(-1, -1), (-1, 1), (1, -1), (1, 1)]
        if kind in {'r', 'q'}:
            directions += [(-1, 0), (1, 0), (0, -1), (0, 1)]
        for dr, dc in directions:
            r, c = row + dr, col + dc
            while _in_bounds(r, c):
                target = board[r][c]
                if not target:
                    moves.append({'row': r, 'col': c, 'capture': False})
                else:
                    if target[0] != color:
                        moves.append({'row': r, 'col': c, 'capture': True})
                    break
                r += dr
                c += dc

    if kind == 'k':
        for dr in range(-1, 2):
            for dc in range(-1, 2):
                if dr == 0 and dc == 0:
                    continue
                add_if_valid(row + dr, col + dc)

    return moves


def _find_king(board, color):
    for r in range(8):
        for c in range(8):
            if board[r][c] == f'{color}k':
                return r, c
    return None


def _in_check(board, color):
    king = _find_king(board, color)
    if not king:
        return False
    enemy = 'b' if color == 'w' else 'w'
    kr, kc = king
    for r in range(8):
        for c in range(8):
            if board[r][c] and board[r][c][0] == enemy:
                if any(m['row'] == kr and m['col'] == kc for m in _pseudo_moves(board, r, c)):
                    return True
    return False


def _apply_promotion(board, row, col, promote_to='q'):
    piece = board[row][col]
    if not piece or piece[1] != 'p':
        return
    if (piece[0] == 'w' and row == 0) or (piece[0] == 'b' and row == 7):
        board[row][col] = f"{piece[0]}{promote_to}"


def _legal_moves(board, row, col):
    piece = board[row][col]
    if not piece:
        return []
    result = []
    for mv in _pseudo_moves(board, row, col):
        nb = deepcopy(board)
        nb[mv['row']][mv['col']] = nb[row][col]
        nb[row][col] = None
        _apply_promotion(nb, mv['row'], mv['col'])
        if not _in_check(nb, piece[0]):
            result.append(mv)
    return result


def _piece_value(piece):
    if not piece:
        return 0
    return {'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000}.get(piece[1], 0)


def _piece_square_bonus(piece, row, col):
    if not piece:
        return 0
    kind = piece[1]
    color = piece[0]
    oriented_row = row if color == 'w' else 7 - row

    center_weight = max(0, 3 - abs(3.5 - row)) + max(0, 3 - abs(3.5 - col))
    if kind == 'p':
        return int((6 - oriented_row) * 8 + center_weight * 2)
    if kind == 'n':
        return int(center_weight * 8)
    if kind == 'b':
        return int(center_weight * 6)
    if kind == 'r':
        return int((7 - oriented_row) * 2 + center_weight * 2)
    if kind == 'q':
        return int(center_weight * 3)
    if kind == 'k':
        return int(-center_weight * 4 if oriented_row > 1 else center_weight * 2)
    return 0


def _evaluate_board(board, color):
    score = 0
    enemy = 'b' if color == 'w' else 'w'

    for r in range(8):
        for c in range(8):
            piece = board[r][c]
            if not piece:
                continue
            value = _piece_value(piece) + _piece_square_bonus(piece, r, c)
            score += value if piece[0] == color else -value

    if _in_check(board, enemy):
        score += 40
    if _in_check(board, color):
        score -= 40
    return score


def _apply_move(board, move):
    nb = deepcopy(board)
    fr = move['from']
    to = move['to']
    nb[to['row']][to['col']] = nb[fr['row']][fr['col']]
    nb[fr['row']][fr['col']] = None
    _apply_promotion(nb, to['row'], to['col'])
    return nb


def _ordered_moves(board, color):
    legal = _all_legal_moves(board, color)
    enemy = 'b' if color == 'w' else 'w'

    def move_score(mv):
        fr = mv['from']
        to = mv['to']
        moving_piece = board[fr['row']][fr['col']]
        target = board[to['row']][to['col']]
        score = 0
        if target:
            score += _piece_value(target) - (_piece_value(moving_piece) // 12)
        if abs(to['row'] - fr['row']) == 2 and moving_piece and moving_piece[1] == 'p':
            score += 12
        nb = _apply_move(board, mv)
        if _in_check(nb, enemy):
            score += 35
        return score

    return sorted(legal, key=move_score, reverse=True)


def _minimax(board, root_color, to_move, depth, alpha, beta):
    legal = _ordered_moves(board, to_move)
    enemy = 'b' if to_move == 'w' else 'w'

    if depth == 0 or not legal:
        if not legal:
            if _in_check(board, to_move):
                return (-10**9 if to_move == root_color else 10**9), None
            return 0, None
        return _evaluate_board(board, root_color), None

    maximizing = to_move == root_color
    best_move = None

    if maximizing:
        best_score = -10**12
        for mv in legal:
            nb = _apply_move(board, mv)
            score, _ = _minimax(nb, root_color, enemy, depth - 1, alpha, beta)
            if score > best_score:
                best_score, best_move = score, mv
            alpha = max(alpha, best_score)
            if beta <= alpha:
                break
        return best_score, best_move

    best_score = 10**12
    for mv in legal:
        nb = _apply_move(board, mv)
        score, _ = _minimax(nb, root_color, enemy, depth - 1, alpha, beta)
        if score < best_score:
            best_score, best_move = score, mv
        beta = min(beta, best_score)
        if beta <= alpha:
            break
    return best_score, best_move


def _pick_move_for_difficulty(board, color, difficulty):
    level = max(1, min(5, int(difficulty or 3)))
    depth_by_level = {1: 1, 2: 1, 3: 2, 4: 2, 5: 2}
    legal = _ordered_moves(board, color)
    if not legal:
        return None

    if level == 1:
        pool = legal[: max(2, min(8, len(legal)))]
        return random.choice(pool)

    if level == 2:
        top_count = max(2, len(legal) // 2)
        pool = legal[:top_count]
        _, candidate = _minimax(board, color, color, depth_by_level[level], -10**12, 10**12)
        return candidate if candidate in pool and random.random() > 0.2 else random.choice(pool)

    _, best_move = _minimax(board, color, color, depth_by_level[level], -10**12, 10**12)
    if not best_move:
        return legal[0]

    if level == 3 and len(legal) > 2 and random.random() < 0.1:
        return random.choice(legal[:3])

    return best_move


def _all_legal_moves(board, color):
    all_moves = []
    for r in range(8):
        for c in range(8):
            if _piece_color(board[r][c]) == color:
                for mv in _legal_moves(board, r, c):
                    all_moves.append({'from': {'row': r, 'col': c}, 'to': mv})
    return all_moves


def _try_stockfish_move(board, color):
    stockfish_bin = os.getenv('STOCKFISH_BINARY', '').strip()
    if not stockfish_bin:
        return None
    return None


@require_http_methods(['POST'])
@csrf_exempt
def ai_move(request):
    data = _payload(request)
    board = data.get('board') or _initial_board()
    color = data.get('color', 'b')
    difficulty = int(data.get('difficulty') or 3)

    move = _try_stockfish_move(board, color) if difficulty >= 5 else None
    engine = 'stockfish' if move else 'fallback'
    if not move:
        move = _pick_move_for_difficulty(board, color, difficulty)
        if not move:
            return JsonResponse({'status': 'end', 'message': 'Sin jugadas legales'}, status=200)

    return JsonResponse({'status': 'ok', 'engine': engine, 'move': move})


@require_http_methods(['POST'])
@csrf_exempt
def submit_result(request):
    data = _payload(request)
    name = (data.get('name') or '').strip()
    outcome = data.get('outcome')
    opponent_name = (data.get('opponent_name') or '').strip()
    opponent_rating = int(data.get('opponent_rating') or 1200)
    if not name or outcome not in {'win', 'loss', 'draw'}:
        return JsonResponse({'status': 'error', 'message': 'Datos inválidos'}, status=400)

    player, _ = PlayerRating.objects.get_or_create(name=name)
    player_start_rating = player.rating
    score = 0.5
    if outcome == 'win':
        player.wins += 1
        score = 1
    elif outcome == 'loss':
        player.losses += 1
        score = 0
    else:
        player.draws += 1

    delta = _elo_delta(player_start_rating, opponent_rating, score)
    player.rating = max(800, player_start_rating + delta)
    player.save()

    response = {'status': 'ok', 'rating': player.rating, 'delta': delta}

    if opponent_name:
        opponent, _ = PlayerRating.objects.get_or_create(name=opponent_name, defaults={'rating': opponent_rating})
        opponent_start_rating = opponent.rating
        opponent_score = 1 - score
        opponent_delta = _elo_delta(opponent_start_rating, player_start_rating, opponent_score)
        opponent.rating = max(800, opponent_start_rating + opponent_delta)
        if outcome == 'win':
            opponent.losses += 1
        elif outcome == 'loss':
            opponent.wins += 1
        else:
            opponent.draws += 1
        opponent.save()
        response['opponent'] = {
            'name': opponent.name,
            'rating': opponent.rating,
            'delta': opponent_delta,
        }

    return JsonResponse(response)


@require_GET
def ranking(request):
    rows = PlayerRating.objects.all()[:20]
    return JsonResponse({
        'status': 'ok',
        'results': [
            {
                'name': r.name,
                'rating': r.rating,
                'wins': r.wins,
                'losses': r.losses,
                'draws': r.draws,
            }
            for r in rows
        ]
    })


@require_http_methods(['POST'])
@csrf_exempt
def create_online_match(request):
    data = _payload(request)
    room_code = _gen_room_code()
    while MatchRecord.objects.filter(room_code=room_code).exists():
        room_code = _gen_room_code()

    match = MatchRecord.objects.create(
        room_code=room_code,
        white_player=(data.get('white_player') or 'White')[:30],
        black_player='Waiting...',
        mode='online',
        game_state={'board': _initial_board(), 'turn': 'w', 'history': [], 'status': 'EN CURSO'},
    )
    return JsonResponse({'status': 'ok', 'room_code': match.room_code, 'match_id': match.id}, status=201)


@require_http_methods(['POST'])
@csrf_exempt
def join_online_match(request, room_code):
    match = get_object_or_404(MatchRecord, room_code=room_code)
    data = _payload(request)
    if match.black_player == 'Waiting...':
        match.black_player = (data.get('player_name') or 'Black')[:30]
        match.save(update_fields=['black_player', 'updated_at'])
    return JsonResponse({'status': 'ok', 'room_code': room_code, 'black_player': match.black_player})


@require_GET
def get_online_match(request, room_code):
    match = get_object_or_404(MatchRecord, room_code=room_code)
    return JsonResponse({
        'status': 'ok',
        'room_code': room_code,
        'white_player': match.white_player,
        'black_player': match.black_player,
        'result': match.result,
        'moves_count': match.moves_count,
        'game_state': match.game_state,
        'updated_at': match.updated_at.isoformat(),
    })


@require_http_methods(['POST'])
@csrf_exempt
def update_online_match(request, room_code):
    match = get_object_or_404(MatchRecord, room_code=room_code)
    data = _payload(request)
    game_state = data.get('game_state') or {}
    match.game_state = game_state
    match.moves_count = int(data.get('moves_count') or 0)
    match.result = data.get('result') or 'in_progress'
    match.save(update_fields=['game_state', 'moves_count', 'result', 'updated_at'])
    return JsonResponse({'status': 'ok'})


@require_GET
def chess_plays(request):
    return JsonResponse({
        'status': 'ok',
        'quick_mates': ['Mate del loco', 'Mate del pastor', 'Mate de Legal', 'Mate de Boden'],
        'training_mode': {
            'mate_in_1': [
                'Mate de pasillo',
                'Mate en la esquina con dama',
                'Mate con sacrificio en h7',
            ],
            'mate_in_2': [
                'Mate del pastor (ataque a f7)',
                'Patrón de Anastasia',
                'Red de mate con dama + alfil',
            ],
            'mate_in_3': [
                'Patrón Boden en 3',
                'Ataque doble con jaque descubierto',
                'Desviación + red de mate',
            ],
            'mate_in_4': [
                'Ataque de minoría y red final',
                'Dominación de casillas oscuras',
                'Línea forzada con sacrificio de calidad',
            ],
            'mate_in_5': [
                'Combinación de atracción y bloqueo',
                'Despeje de columna y mate en primera',
                'Secuencia forzada de jaques',
            ],
            'win_material': [
                'Ganar dama por clavada absoluta',
                'Tenedor de caballo a rey y dama',
                'Desviación de defensor para capturar torre',
                'Sobrecarga de pieza defensora',
                'Rayos X sobre pieza mayor',
            ],
            'endgames': [
                'Rey y peón vs rey (oposición)',
                'Torre activa en final de torres',
                'Triangulación con reyes',
            ],
        },
        'openings': ['Italiana', 'Siciliana', 'Defensa Francesa', 'Gambito de Dama', 'Ruy López', 'Caro-Kann'],
        'piece_moves': {
            'peon': '1 casilla al frente (2 desde inicio), captura en diagonal, captura al paso, promoción en octava/fila primera',
            'torre': 'cualquier número de casillas en líneas rectas (horizontal/vertical)',
            'caballo': 'movimiento en L (2+1), salta piezas',
            'alfil': 'cualquier número de casillas en diagonales',
            'dama': 'combina torre + alfil',
            'rey': '1 casilla en cualquier dirección + enroque corto/largo',
        },
        'special_moves': ['Enroque corto', 'Enroque largo', 'Captura al paso', 'Promoción', 'Ahogado', 'Tablas por repetición'],
        'tactics': ['Clavada', 'Doble ataque', 'Desviación', 'Rayos X', 'Ataque descubierto', 'Atracción'],
    })
