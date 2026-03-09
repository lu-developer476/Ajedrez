import json
import os
import random
import string
import subprocess
from copy import deepcopy

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .models import MatchRecord, PlayerRating


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

    moves = _all_legal_moves(board, color)
    if not moves:
        return None

    try:
        subprocess.run([stockfish_bin, 'quit'], capture_output=True, text=True, timeout=1)
        return random.choice(moves)
    except Exception:
        return None


@require_http_methods(['POST'])
@csrf_exempt
def ai_move(request):
    data = _payload(request)
    board = data.get('board') or _initial_board()
    color = data.get('color', 'b')

    move = _try_stockfish_move(board, color)
    engine = 'stockfish' if move else 'fallback'
    if not move:
        legal = _all_legal_moves(board, color)
        if not legal:
            return JsonResponse({'status': 'end', 'message': 'Sin jugadas legales'}, status=200)
        move = random.choice(legal)

    return JsonResponse({'status': 'ok', 'engine': engine, 'move': move})


@require_http_methods(['POST'])
@csrf_exempt
def submit_result(request):
    data = _payload(request)
    name = (data.get('name') or '').strip()
    outcome = data.get('outcome')
    if not name or outcome not in {'win', 'loss', 'draw'}:
        return JsonResponse({'status': 'error', 'message': 'Datos inválidos'}, status=400)

    player, _ = PlayerRating.objects.get_or_create(name=name)
    if outcome == 'win':
        player.wins += 1
        player.rating += 15
    elif outcome == 'loss':
        player.losses += 1
        player.rating = max(800, player.rating - 12)
    else:
        player.draws += 1
        player.rating += 2
    player.save()

    return JsonResponse({'status': 'ok', 'rating': player.rating})


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
        'quick_mates': ['Mate del loco', 'Mate del pastor', 'Mate de Legal'],
        'openings': ['Italiana', 'Siciliana', 'Defensa Francesa', 'Gambito de Dama'],
        'special_moves': ['Enroque corto', 'Enroque largo', 'Captura al paso', 'Promoción'],
        'tactics': ['Clavada', 'Doble ataque', 'Desviación', 'Rayos X'],
    })
