const boardEl = document.getElementById('board');
const turnIndicatorEl = document.getElementById('turn-indicator');
const statusTextEl = document.getElementById('status-text');
const moveCounterEl = document.getElementById('move-counter');
const selectionLabelEl = document.getElementById('selection-label');
const whiteCapturesEl = document.getElementById('white-captures');
const blackCapturesEl = document.getElementById('black-captures');
const lastMoveEl = document.getElementById('last-move');
const moveHistoryEl = document.getElementById('move-history');
const rankingListEl = document.getElementById('ranking-list');
const modeLabelEl = document.getElementById('mode-label');
const roomInfoEl = document.getElementById('room-info');
const modeSelectEl = document.getElementById('mode-select');
const newGameBtn = document.getElementById('new-game-btn');
const pauseGameBtn = document.getElementById('pause-game-btn');
const restartGameBtn = document.getElementById('restart-game-btn');
const flipBoardBtn = document.getElementById('flip-board-btn');
const resetViewBtn = document.getElementById('reset-view-btn');
const onlineCreateBtn = document.getElementById('online-create-btn');
const onlineJoinBtn = document.getElementById('online-join-btn');
const coordsTopEl = document.getElementById('coords-top');
const coordsBottomEl = document.getElementById('coords-bottom');
const coordsLeftEl = document.getElementById('coords-left');
const coordsRightEl = document.getElementById('coords-right');
const volumeSliderEl = document.getElementById('volume-slider');
const audioStateEl = document.getElementById('audio-state');
const commandFromEl = document.getElementById('command-from');
const commandToEl = document.getElementById('command-to');
const aiLevelEl = document.getElementById('ai-level');
const pieceThemeEl = document.getElementById('piece-theme');
const pieceColorsEl = document.getElementById('piece-colors');
const boardThemeEl = document.getElementById('board-theme');
const whiteTimerEl = document.getElementById('white-timer');
const blackTimerEl = document.getElementById('black-timer');
const boardWrapEl = document.querySelector('.board-wrap');
const aiLevelSpotEl = document.getElementById('ai-level-spot');

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const PIECE_NAMES = {
  p: 'Peón',
  r: 'Torre',
  n: 'Caballo',
  b: 'Alfil',
  q: 'Reina',
  k: 'Rey',
};

const PIECE_SETS = {
  retro: {
    white: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
    black: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' },
  },
  humano: {
    white: { p: '👷🏻‍♂️', r: '🏰', n: '🏇🏻', b: '🫅🏻', q: '👸🏼', k: '🤴🏽' },
    black: { p: '👷🏿‍♂️', r: '🏰', n: '🏇🏿', b: '🫅🏿', q: '👸🏿', k: '🤴🏿' },
  },
  cyborg: {
    white: { p: '🤖', r: '🗼', n: '🦄🪽', b: '📡', q: '🗽', k: '👑' },
    black: { p: '🤖', r: '🗼', n: '🦄🪽', b: '📡', q: '🗽', k: '👑' },
  },
};

let state = null;
let selected = null;
let legalMoves = [];
let flipped = false;
let mode = 'local';
let roomCode = null;
let pollTimer = null;
let audioCtx = null;
let masterGain = null;
let volume = 1;
let aiLevel = 3;
let pieceTheme = 'humano';
let pieceColorTheme = 'original';
let boardTheme = 'classic';
let whiteTimeLeft = 600;
let blackTimeLeft = 600;
let gameTimer = null;
let isPaused = false;

function createInitialBoard() { return [['br','bn','bb','bq','bk','bb','bn','br'],['bp','bp','bp','bp','bp','bp','bp','bp'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],['wp','wp','wp','wp','wp','wp','wp','wp'],['wr','wn','wb','wq','wk','wb','wn','wr']]; }
function createState() { return { board: createInitialBoard(), turn: 'w', moveNumber: 1, history: [], captured: { w: [], b: [] }, lastMove: null, status: 'EN CURSO' }; }
const clone = (b) => b.map((r) => [...r]);
const inBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
const algebraic = (r, c) => `${FILES[c]}${8 - r}`;

function parseSquare(input) {
  if (!input) return null;
  const txt = input.trim().toLowerCase();
  if (!/^[a-h][1-8]$/.test(txt)) return null;
  const file = FILES.indexOf(txt[0]);
  const rank = Number(txt[1]);
  return { row: 8 - rank, col: file };
}

function resetGame() {
  state = createState();
  selected = null;
  legalMoves = [];
  whiteTimeLeft = 600;
  blackTimeLeft = 600;
  isPaused = false;
  startTimerLoop();
  renderCoordinates();
  render();
}

function ensureAudioContext() {
  if (!window.AudioContext && !window.webkitAudioContext) return false;
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return true;
}

function playTone(frequency, duration = 0.12, type = 'sine', delay = 0) {
  if (!ensureAudioContext() || !masterGain || volume === 0) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const startAt = audioCtx.currentTime + delay;
  const endAt = startAt + duration;
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.32, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, endAt);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(startAt);
  osc.stop(endAt);
}

function playMoveSound(isCapture, status) {
  if (status.includes('JAQUE MATE')) {
    playTone(196, 0.14, 'triangle');
    playTone(146.8, 0.18, 'triangle', 0.14);
    return;
  }
  if (status === 'JAQUE') {
    playTone(659.25, 0.08, 'square');
    playTone(783.99, 0.08, 'square', 0.09);
    return;
  }
  if (isCapture) {
    playTone(220, 0.08, 'sawtooth');
    playTone(164.81, 0.1, 'sawtooth', 0.08);
    return;
  }
  playTone(523.25, 0.08, 'triangle');
  playTone(659.25, 0.08, 'triangle', 0.07);
}

function updateVolumeUI() {
  if (!volumeSliderEl || !audioStateEl) return;
  const pct = Math.round(volume * 100);
  volumeSliderEl.value = String(pct);
  volumeSliderEl.style.setProperty('--volume-fill', `${pct}%`);
  audioStateEl.textContent = pct === 0 ? '🔇 Sonido inactivo (0%)' : `🔊 Sonido activo (${pct}%)`;
}

function formatClock(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function renderClocks() {
  if (whiteTimerEl) whiteTimerEl.textContent = formatClock(Math.max(0, whiteTimeLeft));
  if (blackTimerEl) blackTimerEl.textContent = formatClock(Math.max(0, blackTimeLeft));
}

function stopTimerLoop() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
}

function evaluateGameStatus() {
  const check = isKingInCheck(state.board, state.turn);
  const active = hasAny(state.board, state.turn);
  state.status = check && !active ? `JAQUE MATE · ${state.turn === 'w' ? 'NEGRAS' : 'BLANCAS'} GANAN` : check ? 'JAQUE' : !active ? 'TABLAS' : 'EN CURSO';
  if (check && state.turn === 'w' && !active) state.status = 'JAQUE MATE · NEGRAS GANAN';
  return { check, active };
}

function tickGameClock() {
  if (!state || isPaused || (state.status !== 'EN CURSO' && state.status !== 'JAQUE')) return;
  if (state.turn === 'w') whiteTimeLeft -= 1;
  else blackTimeLeft -= 1;

  if (whiteTimeLeft <= 0) {
    whiteTimeLeft = 0;
    state.status = 'TIEMPO AGOTADO · NEGRAS GANAN';
    stopTimerLoop();
  }
  if (blackTimeLeft <= 0) {
    blackTimeLeft = 0;
    state.status = 'TIEMPO AGOTADO · BLANCAS GANAN';
    stopTimerLoop();
  }
  render();
}

function startTimerLoop() {
  stopTimerLoop();
  gameTimer = setInterval(tickGameClock, 1000);
  renderClocks();
}


function formatClock(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function renderClocks() {
  if (whiteTimerEl) whiteTimerEl.textContent = formatClock(Math.max(0, whiteTimeLeft));
  if (blackTimerEl) blackTimerEl.textContent = formatClock(Math.max(0, blackTimeLeft));
}

function stopTimerLoop() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
}

function evaluateGameStatus() {
  const check = isKingInCheck(state.board, state.turn);
  const active = hasAny(state.board, state.turn);
  state.status = check && !active ? `JAQUE MATE · ${state.turn === 'w' ? 'NEGRAS' : 'BLANCAS'} GANAN` : check ? 'JAQUE' : !active ? 'TABLAS' : 'EN CURSO';
  if (check && state.turn === 'w' && !active) state.status = 'JAQUE MATE · NEGRAS GANAN';
  return { check, active };
}

function tickGameClock() {
  if (!state || isPaused || state.status !== 'EN CURSO' && state.status !== 'JAQUE') return;
  if (state.turn === 'w') whiteTimeLeft -= 1;
  else blackTimeLeft -= 1;

  if (whiteTimeLeft <= 0) {
    whiteTimeLeft = 0;
    state.status = 'TIEMPO AGOTADO · NEGRAS GANAN';
    stopTimerLoop();
  }
  if (blackTimeLeft <= 0) {
    blackTimeLeft = 0;
    state.status = 'TIEMPO AGOTADO · BLANCAS GANAN';
    stopTimerLoop();
  }
  render();
}

function startTimerLoop() {
  stopTimerLoop();
  gameTimer = setInterval(tickGameClock, 1000);
  renderClocks();
}

function renderCoordinates() {
  const files = flipped ? [...FILES].reverse() : FILES;
  const ranks = flipped ? ['1','2','3','4','5','6','7','8'] : ['8','7','6','5','4','3','2','1'];
  coordsTopEl.innerHTML = files.map((f) => `<span>${f}</span>`).join('');
  coordsBottomEl.innerHTML = coordsTopEl.innerHTML;
  coordsLeftEl.innerHTML = ranks.map((r) => `<span>${r}</span>`).join('');
  coordsRightEl.innerHTML = coordsLeftEl.innerHTML;
}

function applyBoardTheme() {
  boardEl.classList.remove('board-theme-classic', 'board-theme-minimalista', 'board-theme-vidrio', 'board-theme-ecologista', 'board-theme-futurista');
  boardEl.classList.add(`board-theme-${boardTheme}`);
  if (!boardWrapEl) return;
  boardWrapEl.classList.remove('board-shell-theme-classic', 'board-shell-theme-minimalista', 'board-shell-theme-vidrio', 'board-shell-theme-ecologista', 'board-shell-theme-futurista');
  boardWrapEl.classList.add(`board-shell-theme-${boardTheme}`);
}

function getPieceSymbol(pieceSet, piece, side) {
  if (pieceSet?.white && pieceSet?.black) return (side === 'w' ? pieceSet.white[piece] : pieceSet.black[piece]) || '·';
  return pieceSet?.[piece] || '·';
}

function applyPieceColorTheme() {
  boardEl.classList.remove('piece-color-original', 'piece-color-moderno', 'piece-color-staunton', 'piece-color-digital', 'piece-color-cyberpunk');
  boardEl.classList.add(`piece-color-${pieceColorTheme}`);
}

function render() {
  boardEl.innerHTML = '';
  applyBoardTheme();
  applyPieceColorTheme();
  const pieceSet = PIECE_SETS[pieceTheme] || PIECE_SETS.humano;
  const rows = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];
  const cols = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];

  for (const row of rows) for (const col of cols) {
    const sq = document.createElement('button');
    sq.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
    if (selected?.row === row && selected?.col === col) sq.classList.add('selected');
    const m = legalMoves.find((x) => x.row === row && x.col === col);
    if (m) sq.classList.add(m.capture ? 'capture' : 'legal');
    const p = state.board[row][col];
    if (p) {
      const sp = document.createElement('span');
      const sideLabel = p[0] === 'w' ? 'Blancas' : 'Negras';
      const pieceLabel = PIECE_NAMES[p[1]] || 'Ficha';
      sq.dataset.pieceName = `${pieceLabel} · ${sideLabel}`;
      sq.setAttribute('aria-label', `${pieceLabel} ${sideLabel} en ${algebraic(row, col)}`);
      sp.className = `piece ${p[0] === 'w' ? 'white' : 'black'} theme-${pieceTheme}`;
      sp.textContent = getPieceSymbol(pieceSet, p[1], p[0]);
      sq.appendChild(sp);
    }
    sq.onclick = () => clickSquare(row, col);
    boardEl.appendChild(sq);
  }

  turnIndicatorEl.textContent = state.turn === 'w' ? 'Blancas' : 'Negras';
  statusTextEl.textContent = state.status;
  moveCounterEl.textContent = state.moveNumber;
  selectionLabelEl.textContent = selected ? algebraic(selected.row, selected.col) : '---';
  whiteCapturesEl.textContent = state.captured.w.length;
  blackCapturesEl.textContent = state.captured.b.length;
  lastMoveEl.textContent = state.lastMove || '---';
  moveHistoryEl.innerHTML = state.history.length ? state.history.map((m) => `<li>${m}</li>`).join('') : '<li>Sin movimientos aún.</li>';
  modeLabelEl.textContent = mode === 'ai' ? `Jugador vs IA · Nivel ${aiLevel}` : mode === 'online' ? `Online (${roomCode || 'sin sala'})` : 'Local 1v1';
  renderClocks();
  if (aiLevelEl) aiLevelEl.style.display = mode === 'ai' ? 'block' : 'none';
  if (aiLevelSpotEl) {
    const txt = aiLevelEl?.options?.[aiLevelEl.selectedIndex]?.textContent || `IA Nivel ${aiLevel}`;
    aiLevelSpotEl.textContent = txt.replace('IA Nivel ', 'IA Nivel ');
  }
  if (pauseGameBtn) pauseGameBtn.textContent = isPaused ? 'Reanudar' : 'Pausar';
  if (isPaused) statusTextEl.textContent = 'PAUSADA';
}

function pushIfValid(board, moves, row, col, tr, tc) { if (!inBounds(tr, tc)) return; const p = board[row][col]; const t = board[tr][tc]; if (!t) moves.push({ row: tr, col: tc, capture: false }); else if (t[0] !== p[0]) moves.push({ row: tr, col: tc, capture: true }); }
function getPseudoMoves(board, row, col) { const p = board[row][col]; if (!p) return []; const c = p[0], e = c === 'w' ? 'b' : 'w', t = p[1], moves = [];
  if (t === 'p') { const d = c === 'w' ? -1 : 1, s = c === 'w' ? 6 : 1, n = row + d; if (inBounds(n, col) && !board[n][col]) { moves.push({ row: n, col, capture: false }); const j = row + 2 * d; if (row === s && !board[j][col]) moves.push({ row: j, col, capture: false }); } for (const dc of [-1,1]) { const nc = col + dc; if (inBounds(n, nc) && board[n][nc] && board[n][nc][0] === e) moves.push({ row: n, col: nc, capture: true }); } }
  if (t === 'n') for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) pushIfValid(board, moves, row, col, row + dr, col + dc);
  if (['b','r','q'].includes(t)) { const d=[]; if (['b','q'].includes(t)) d.push([-1,-1],[-1,1],[1,-1],[1,1]); if (['r','q'].includes(t)) d.push([-1,0],[1,0],[0,-1],[0,1]); for (const [dr,dc] of d) { let r = row + dr, c2 = col + dc; while (inBounds(r, c2)) { const tar = board[r][c2]; if (!tar) moves.push({ row: r, col: c2, capture: false }); else { if (tar[0] !== c) moves.push({ row: r, col: c2, capture: true }); break; } r += dr; c2 += dc; } } }
  if (t === 'k') for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++) if (dr||dc) pushIfValid(board,moves,row,col,row+dr,col+dc);
  return moves; }
function applyPromotion(board, row, col, preferred = 'q') {
  const p = board[row][col];
  if (!p || p[1] !== 'p') return;
  if ((p[0] === 'w' && row === 0) || (p[0] === 'b' && row === 7)) {
    const valid = ['q', 'r', 'b', 'n'];
    board[row][col] = `${p[0]}${valid.includes(preferred) ? preferred : 'q'}`;
  }
}
function locateKing(board, color) { for (let r=0;r<8;r++) for (let c=0;c<8;c++) if (board[r][c]===`${color}k`) return {r,c}; return null; }
function isKingInCheck(board, color) { const k = locateKing(board, color); if (!k) return false; const e = color === 'w' ? 'b' : 'w'; for (let r=0;r<8;r++) for (let c=0;c<8;c++) if (board[r][c]?.[0]===e && getPseudoMoves(board, r, c).some((m)=>m.row===k.r&&m.col===k.c)) return true; return false; }
function getLegalMoves(board, row, col) {
  return getPseudoMoves(board, row, col).filter((m) => {
    const b = clone(board);
    const movingPiece = b[row][col];
    b[m.row][m.col] = movingPiece;
    b[row][col] = null;
    applyPromotion(b, m.row, m.col, 'q');
    return !isKingInCheck(b, movingPiece[0]);
  });
}
function hasAny(board, color) { for (let r=0;r<8;r++) for (let c=0;c<8;c++) if (board[r][c]?.[0]===color && getLegalMoves(board, r, c).length) return true; return false; }

function closeCyberModal() {
  const backdrop = document.querySelector('.cyber-modal-backdrop');
  if (backdrop) backdrop.remove();
}

function openCyberPrompt({ title, message, defaultValue = '' }) {
  return new Promise((resolve) => {
    closeCyberModal();
    const backdrop = document.createElement('div');
    backdrop.className = 'cyber-modal-backdrop';
    backdrop.innerHTML = `
      <div class="cyber-modal panel-glow" role="dialog" aria-modal="true">
        <h3>${title}</h3>
        <p>${message}</p>
        <input class="cyber-modal-input" type="text" value="${defaultValue}">
        <div class="cyber-modal-actions">
          <button type="button" class="btn secondary" data-act="cancel">Cancelar</button>
          <button type="button" class="btn primary" data-act="ok">Aceptar</button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    const input = backdrop.querySelector('.cyber-modal-input');
    const finalize = (value) => { closeCyberModal(); resolve(value); };
    backdrop.querySelector('[data-act="cancel"]').onclick = () => finalize(null);
    backdrop.querySelector('[data-act="ok"]').onclick = () => finalize(input.value.trim());
    backdrop.addEventListener('click', (ev) => { if (ev.target === backdrop) finalize(null); });
    backdrop.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') finalize(null);
      if (ev.key === 'Enter') finalize(input.value.trim());
    });
    input.focus();
    input.select();
  });
}

function openCyberConfirm(message) {
  return new Promise((resolve) => {
    closeCyberModal();
    const backdrop = document.createElement('div');
    backdrop.className = 'cyber-modal-backdrop';
    backdrop.innerHTML = `
      <div class="cyber-modal panel-glow" role="dialog" aria-modal="true">
        <h3>Confirmación</h3>
        <p>${message}</p>
        <div class="cyber-modal-actions">
          <button type="button" class="btn secondary" data-act="cancel">Cancelar</button>
          <button type="button" class="btn danger" data-act="ok">Confirmar</button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    const finalize = (value) => { closeCyberModal(); resolve(value); };
    backdrop.querySelector('[data-act="cancel"]').onclick = () => finalize(false);
    backdrop.querySelector('[data-act="ok"]').onclick = () => finalize(true);
    backdrop.addEventListener('click', (ev) => { if (ev.target === backdrop) finalize(false); });
  });
}



function openPromotionSelector(color) {
  return new Promise((resolve) => {
    closeCyberModal();
    const options = [
      { key: 'q', label: 'Reina' },
      { key: 'r', label: 'Torre' },
      { key: 'b', label: 'Alfil' },
      { key: 'n', label: 'Caballo' },
    ];
    const backdrop = document.createElement('div');
    backdrop.className = 'cyber-modal-backdrop';
    backdrop.innerHTML = `
      <div class="cyber-modal panel-glow" role="dialog" aria-modal="true">
        <h3>Promoción de peón</h3>
        <p>${color === 'w' ? 'Blancas' : 'Negras'}: elegí la pieza para promocionar.</p>
        <div class="cyber-modal-actions">
          ${options.map((opt) => `<button type="button" class="btn secondary" data-piece="${opt.key}">${opt.label}</button>`).join('')}
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    backdrop.querySelectorAll('[data-piece]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const piece = btn.getAttribute('data-piece') || 'q';
        closeCyberModal();
        resolve(piece);
      });
    });
  });
}

function clickSquare(row, col) {
  evaluateGameStatus();
  if (isPaused || state.status.includes('JAQUE MATE') || state.status.includes('TIEMPO AGOTADO')) return;
  const piece = state.board[row][col];
  if (selected) {
    const chosen = legalMoves.find((m) => m.row === row && m.col === col);
    if (chosen) return makeMove(selected.row, selected.col, row, col, null);
    if (piece && piece[0] === state.turn) return selectSquare(row, col);
    selected = null;
    legalMoves = [];
    return render();
  }
  if (piece && piece[0] === state.turn) selectSquare(row, col);
}

function selectSquare(row, col) {
  selected = { row, col };
  legalMoves = getLegalMoves(state.board, row, col);
  render();
}

async function makeMove(fr, fc, tr, tc, promotionChoice = null) {
  const piece = state.board[fr][fc], target = state.board[tr][tc];
  if (piece?.[1] === 'p' && ((piece[0] === 'w' && tr === 0) || (piece[0] === 'b' && tr === 7)) && !promotionChoice) {
    promotionChoice = await openPromotionSelector(piece[0]);
  }
  state.board[tr][tc] = piece;
  state.board[fr][fc] = null;
  applyPromotion(state.board, tr, tc, promotionChoice);
  if (target) state.captured[piece[0]].push(target);
  const sideText = piece[0] === 'w' ? 'Blancas' : 'Negras';
  const pieceName = PIECE_NAMES[piece[1]] || 'Ficha';
  state.history.unshift(`${sideText}: ${pieceName} ${state.moveNumber}. ${algebraic(fr, fc)} → ${algebraic(tr, tc)}`);
  state.lastMove = `${algebraic(fr, fc)} → ${algebraic(tr, tc)}`;
  state.turn = state.turn === 'w' ? 'b' : 'w';
  state.moveNumber += 1;
  selected = null;
  legalMoves = [];
  evaluateGameStatus();
  playMoveSound(Boolean(target), state.status);
  render();
  if (mode === 'online' && roomCode) await syncOnline();
  if (mode === 'ai' && state.turn === 'b' && (state.status === 'EN CURSO' || state.status === 'JAQUE')) await playAi();
}

async function playAi() {
  const res = await fetch('/api/ai-move/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ board: state.board, color: 'b', difficulty: aiLevel }),
  });
  const data = await res.json();
  if (data.status !== 'ok') return;
  await makeMove(data.move.from.row, data.move.from.col, data.move.to.row, data.move.to.col, null);
}

async function loadRanking() {
  if (!rankingListEl) return;
  const res = await fetch('/api/ranking/');
  const data = await res.json();
  rankingListEl.innerHTML = (data.results || []).map((p) => `<li>${p.name}: ${p.rating} (${p.wins}W/${p.losses}L/${p.draws}D)</li>`).join('') || '<li>Sin ranking todavía.</li>';
}

async function syncOnline() {
  await fetch(`/api/match/${roomCode}/update/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game_state: state, moves_count: state.moveNumber, result: state.status }),
  });
}

async function pollOnline() {
  if (!roomCode) return;
  const res = await fetch(`/api/match/${roomCode}/`);
  const data = await res.json();
  if (data?.game_state?.moveNumber && data.game_state.moveNumber > state.moveNumber) {
    state = data.game_state;
    render();
  }
}

async function executeCoordinateMove() {
  const from = parseSquare(commandFromEl?.value || '');
  const to = parseSquare(commandToEl?.value || '');
  if (!from || !to) return;
  const piece = state.board[from.row][from.col];
  if (!piece || piece[0] !== state.turn) return;
  const moves = getLegalMoves(state.board, from.row, from.col);
  const chosen = moves.find((m) => m.row === to.row && m.col === to.col);
  if (!chosen) return;
  if (isPaused || state.status.includes('JAQUE MATE') || state.status.includes('TIEMPO AGOTADO')) return;
  await makeMove(from.row, from.col, to.row, to.col, null);
  commandFromEl.value = '';
  commandToEl.value = '';
}

modeSelectEl.onchange = () => {
  mode = modeSelectEl.value;
  render();
  if (pollTimer) clearInterval(pollTimer);
  if (mode === 'online' && roomCode) pollTimer = setInterval(pollOnline, 2000);
};
if (aiLevelEl) aiLevelEl.onchange = () => { aiLevel = Number(aiLevelEl.value) || 3; render(); };
if (pieceThemeEl) pieceThemeEl.onchange = () => { pieceTheme = pieceThemeEl.value || 'humano'; render(); };
if (pieceColorsEl) pieceColorsEl.onchange = () => { pieceColorTheme = pieceColorsEl.value || 'original'; render(); };
if (boardThemeEl) boardThemeEl.onchange = () => { boardTheme = boardThemeEl.value || 'classic'; render(); };

onlineCreateBtn.onclick = async () => {
  const player = await openCyberPrompt({ title: 'Crear sala', message: 'Ingresá tu alias de jugador', defaultValue: 'White' });
  if (player === null) return;
  const r = await fetch('/api/match/create/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ white_player: player || 'White' }),
  });
  const d = await r.json();
  roomCode = d.room_code;
  roomInfoEl.innerHTML = `<span>Sala:</span> ${roomCode}`;
  mode = 'online';
  modeSelectEl.value = 'online';
  render();
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(pollOnline, 2000);
  await syncOnline();
};

onlineJoinBtn.onclick = async () => {
  const codeInput = await openCyberPrompt({ title: 'Unirse a sala', message: 'Ingresá el código de la sala', defaultValue: '' });
  const code = (codeInput || '').toUpperCase();
  if (!code) return;
  const player = await openCyberPrompt({ title: 'Identidad', message: 'Ingresá tu alias de jugador', defaultValue: 'Black' });
  if (player === null) return;
  await fetch(`/api/match/${code}/join/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player_name: player || 'Black' }),
  });
  roomCode = code;
  mode = 'online';
  modeSelectEl.value = 'online';
  await pollOnline();
  roomInfoEl.innerHTML = `<span>Sala:</span> ${roomCode}`;
  render();
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(pollOnline, 2000);
};

newGameBtn.onclick = async () => {
  const shouldReset = await openCyberConfirm('¿Iniciar una nueva partida?');
  if (shouldReset) resetGame();
};

if (restartGameBtn) {
  restartGameBtn.onclick = async () => {
    const shouldReset = await openCyberConfirm('¿Reiniciar partida y volver al estado inicial?');
    if (shouldReset) resetGame();
  };
}

if (pauseGameBtn) {
  pauseGameBtn.onclick = () => {
    isPaused = !isPaused;
    render();
  };
}
flipBoardBtn.onclick = () => { flipped = !flipped; renderCoordinates(); render(); };
resetViewBtn.onclick = () => { selected = null; legalMoves = []; render(); };

if (volumeSliderEl) {
  volumeSliderEl.oninput = () => {
    volume = Number(volumeSliderEl.value) / 100;
    if (masterGain) masterGain.gain.value = volume;
    updateVolumeUI();
    ensureAudioContext();
  };
  volumeSliderEl.addEventListener('pointerdown', ensureAudioContext);
  volumeSliderEl.addEventListener('keydown', ensureAudioContext);
}

if (commandFromEl && commandToEl) {
  const normalize = (el) => {
    el.value = (el.value || '').toLowerCase().replace(/[^a-h1-8]/g, '').slice(0, 2);
  };
  commandFromEl.addEventListener('input', () => normalize(commandFromEl));
  commandToEl.addEventListener('input', () => normalize(commandToEl));
  commandFromEl.addEventListener('keydown', async (ev) => {
    if (ev.key === 'Enter') { ev.preventDefault(); await executeCoordinateMove(); }
  });
  commandToEl.addEventListener('keydown', async (ev) => {
    if (ev.key === 'Enter') { ev.preventDefault(); await executeCoordinateMove(); }
  });
}

updateVolumeUI();
resetGame();
loadRanking();
