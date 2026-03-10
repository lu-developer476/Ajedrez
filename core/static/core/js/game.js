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
const analysisAccuracyEl = document.getElementById('analysis-accuracy');
const analysisBestEl = document.getElementById('analysis-best');
const analysisInaccuracyEl = document.getElementById('analysis-inaccuracy');
const analysisMistakeEl = document.getElementById('analysis-mistake');
const analysisBlunderEl = document.getElementById('analysis-blunder');
const advantageHistoryEl = document.getElementById('advantage-history');
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
const fontThemeEl = document.getElementById('font-theme');
const fontColorsEl = document.getElementById('font-colors');
const coordinateStyleEl = document.getElementById('coordinate-style');
const moveAnimationEl = document.getElementById('move-animation');
const captureAnimationEl = document.getElementById('capture-animation');
const whiteTimerEl = document.getElementById('white-timer');
const blackTimerEl = document.getElementById('black-timer');
const boardWrapEl = document.querySelector('.board-wrap');
const openTutorialPanelBtnEl = document.getElementById('open-tutorial-panel-btn');
const openVariationsBtnEl = document.getElementById('open-variations-btn');
const toggleAllVariationsBtnEl = document.getElementById('toggle-all-variations-btn');
const variationsSummaryEl = document.getElementById('variations-summary');
const toggleAttacksBtnEl = document.getElementById('toggle-attacks-btn');
const togglePromotionAnimationBtnEl = document.getElementById('toggle-promotion-animation-btn');
const toggleCheckAnimationBtnEl = document.getElementById('toggle-check-animation-btn');
const toggleLastMoveAnimationBtnEl = document.getElementById('toggle-last-move-animation-btn');
const toggleAudioBtnEl = document.getElementById('toggle-audio-btn');
const gameShellEl = document.querySelector('.game-shell');
const lightCellDotEl = document.getElementById('light-cell-dot');
const darkCellDotEl = document.getElementById('dark-cell-dot');
const authStatusEl = document.getElementById('auth-status');
const authUsernameEl = document.getElementById('auth-username');
const authEmailEl = document.getElementById('auth-email');
const authPasswordEl = document.getElementById('auth-password');
const avatarUrlEl = document.getElementById('avatar-url');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const saveProfileBtn = document.getElementById('save-profile-btn');
const userStatsListEl = document.getElementById('user-stats-list');
const eloAInputEl = document.getElementById('elo-a-input');
const eloBInputEl = document.getElementById('elo-b-input');
const eloResultEl = document.getElementById('elo-result');
const eloARatingEl = document.getElementById('elo-a-rating');
const eloBRatingEl = document.getElementById('elo-b-rating');
const eloAfterEl = document.getElementById('elo-after');

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const PIECE_NAMES = {
  p: 'Peón',
  r: 'Torre',
  n: 'Caballo',
  b: 'Alfil',
  q: 'Reina',
  k: 'Rey',
};


const TRAINING_VARIATIONS = [
  'apertura italiana',
  'apertura siciliana',
  'apertura francesa',
  'gambito de dama',
  'ruy lópez',
  'táctica clavada',
  'táctica doble ataque',
  'táctica descubierta',
  'táctica desviación',
  'táctica rayos x',
];

const OPENING_BOOK = [
  {
    name: 'Siciliana Najdorf',
    sequence: ['d2d3'],
  },
];

const TUTORIAL_ITEMS = [
  { title: 'Reglas', text: 'Jaque, jaque mate, tablas, enroque corto/largo, captura al paso, promoción y ahogado.' },
  { title: 'Movimientos especiales', text: 'Enroque: movés Rey y Torre en una sola jugada si no se movieron y no hay jaque en el camino. Captura en passant: un peón puede capturar al paso justo después de un avance doble rival.' },
  { title: 'Peón', text: 'Avanza 1 casilla (o 2 desde inicio), captura en diagonal y puede promocionar al llegar al final. Jugada ejemplo: e2 → e4 (avance doble inicial).' },
  { title: 'Torre', text: 'Se mueve en líneas rectas (filas y columnas) todas las casillas libres. Jugada ejemplo: a1 → a4.' },
  { title: 'Alfil', text: 'Se mueve en diagonales, tantas casillas como estén disponibles. Jugada ejemplo: c1 → g5.' },
  { title: 'Caballo', text: 'Movimiento en L y puede saltar piezas. Jugada ejemplo: g1 → f3.' },
  { title: 'Dama', text: 'Combina movimientos de torre y alfil, con gran alcance. Jugada ejemplo: d1 → h5.' },
  { title: 'Rey', text: 'Avanza una casilla en cualquier dirección y puede enrocarse. Jugada ejemplo: e1 → g1 (enroque corto).' },
  { title: 'Apertura italiana', text: 'Plan clásico de desarrollo rápido: e4, Cf3 y Ac4 para presionar f7 y dominar el centro.' },
  { title: 'Apertura siciliana', text: 'Respuesta combativa a 1.e4 con ...c5; busca desequilibrar desde temprano y jugar por contragolpe.' },
  { title: 'Apertura francesa', text: 'Tras 1.e4 e6, las negras preparan ...d5 con estructura sólida y juego estratégico.' },
  { title: 'Gambito de dama', text: 'Con 1.d4 d5 2.c4, blancas ofrecen peón para ganar espacio central y actividad.' },
  { title: 'Ruy López', text: '1.e4 e5 2.Cf3 Cc6 3.Ab5: presión sobre c6/e5 y lucha posicional muy rica.' },
  { title: 'Táctica clavada', text: 'Inmovilizás una pieza porque al moverse deja expuesta una pieza más valiosa detrás.' },
  { title: 'Táctica doble ataque', text: 'Una sola jugada amenaza dos objetivos al mismo tiempo, forzando concesiones.' },
  { title: 'Táctica descubierta', text: 'Movés una pieza y habilitás el ataque de otra que estaba "tapada".' },
  { title: 'Táctica desviación', text: 'Forzás a una pieza rival a abandonar una casilla clave para luego explotar la debilidad.' },
  { title: 'Táctica rayos X', text: 'Una pieza ataca a través de otra alineada en la misma línea o diagonal para generar amenazas ocultas.' },
];

const PIECE_SETS = {
  retro: {
    white: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
    black: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' },
  },
  humano: {
    white: { p: '👷🏻‍♂️', r: '🏰', n: '🏇', b: '🫅🏻', q: '👸🏼', k: '🤴🏻' },
    black: { p: '👷🏿‍♂️', r: '🏰', n: '🏇🏿', b: '🫅🏽', q: '👸🏿', k: '🤴🏾' },
  },
  cyborg: {
    white: { p: '🤖', r: '🗼', n: '🦄‍🪽', b: '🗽', q: '⚜️', k: '🔱' },
    black: { p: '🤖', r: '🗼', n: '🦄‍🪽', b: '🗽', q: '⚜️', k: '🔱' },
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
let aiLevel = 1;
let pieceTheme = 'retro';
let pieceColorTheme = 'original';
let boardTheme = 'classic';
let fontTheme = 'rajdhani';
let fontColorTheme = 'default';
let whiteTimeLeft = 600;
let blackTimeLeft = 600;
let gameTimer = null;
let isPaused = false;
let audioEnabled = true;
let showAttackedSquares = false;
let coordinateStyle = 'clasico';
let moveAnimationStyle = 'instantanea';
let captureAnimationStyle = 'desvanecimiento';
let enablePromotionAnimation = false;
let enableCheckAnimation = false;
let enableLastMoveAnimation = false;
let highlightLastMove = null;
let activeVariations = new Set(TRAINING_VARIATIONS);
let waitingStartColor = false;

const ELO_K_FACTOR = 32;

function expectedScore(playerRating, opponentRating) {
  return 1 / (1 + 10 ** ((opponentRating - playerRating) / 400));
}

function calculateEloDelta(playerRating, opponentRating, score) {
  return Math.round(ELO_K_FACTOR * (score - expectedScore(playerRating, opponentRating)));
}

function renderEloPreview() {
  if (!eloAInputEl || !eloBInputEl || !eloResultEl || !eloAfterEl) return;
  const ratingA = Number(eloAInputEl.value) || 1450;
  const ratingB = Number(eloBInputEl.value) || 1320;
  let scoreA = 1;
  if (eloResultEl.value === 'draw') scoreA = 0.5;
  if (eloResultEl.value === 'b_win') scoreA = 0;
  const deltaA = calculateEloDelta(ratingA, ratingB, scoreA);
  const deltaB = calculateEloDelta(ratingB, ratingA, 1 - scoreA);
  if (eloARatingEl) eloARatingEl.textContent = String(ratingA);
  if (eloBRatingEl) eloBRatingEl.textContent = String(ratingB);
  eloAfterEl.textContent = `Después de la partida: ${deltaA >= 0 ? '+' : ''}${deltaA} | ${deltaB >= 0 ? '+' : ''}${deltaB}`;
}

function createInitialBoard() { return [['br','bn','bb','bq','bk','bb','bn','br'],['bp','bp','bp','bp','bp','bp','bp','bp'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],['wp','wp','wp','wp','wp','wp','wp','wp'],['wr','wn','wb','wq','wk','wb','wn','wr']]; }
function createState() {
  return {
    board: createInitialBoard(),
    turn: 'w',
    moveNumber: 1,
    history: [],
    captured: { w: [], b: [] },
    lastMove: null,
    status: 'EN CURSO',
    captureFX: null,
    promotionFX: null,
    castlingRights: {
      w: { short: true, long: true },
      b: { short: true, long: true },
    },
    openingMoves: [],
    openingName: null,
    moveEvaluations: [],
    advantageHistory: [],
    analysis: null,
    lastMoveQuality: null,
  };
}
const clone = (b) => b.map((r) => [...r]);
const inBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
const algebraic = (r, c) => `${FILES[c]}${8 - r}`;

function detectOpening(openingMoves) {
  const matching = OPENING_BOOK.filter((line) => line.sequence.every((mv, idx) => openingMoves[idx] === mv));
  if (!matching.length) return null;
  return matching.sort((a, b) => b.sequence.length - a.sequence.length)[0].name;
}

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
  highlightLastMove = null;
  state.lastMoveQuality = null;
  if (waitingStartColor) stopTimerLoop();
  else startTimerLoop();
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
  if (!audioEnabled || !ensureAudioContext() || !masterGain || volume === 0) return;
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
  audioStateEl.textContent = !audioEnabled || pct === 0 ? `🔇 Sonido inactivo (${pct}%)` : `🔊 Sonido activo (${pct}%)`;
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
  const active = hasAny(state.board, state.turn, state);
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
  const active = hasAny(state.board, state.turn, state);
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
  if (!boardWrapEl) return;
  boardWrapEl.classList.remove('coordinate-style-clasico', 'coordinate-style-minimalista', 'coordinate-style-integrado', 'coordinate-style-futurista', 'coordinate-style-entrenamiento');
  boardWrapEl.classList.add(`coordinate-style-${coordinateStyle}`);
}


const BOARD_THEME_PREVIEWS = {
  classic: { light: 'linear-gradient(135deg, #eedbc3, #d9b88f)', dark: 'linear-gradient(135deg, #8f5b35, #5f351c)' },
  minimalista: { light: 'linear-gradient(145deg, #ffffff, #d8d8d8)', dark: 'linear-gradient(145deg, #2f2f2f, #0d0d0d)' },
  vidrio: { light: 'linear-gradient(135deg, rgba(224,245,255,0.65), rgba(255,255,255,0.3))', dark: 'linear-gradient(135deg, rgba(107,170,196,0.45), rgba(24,65,86,0.5))' },
  ecologista: { light: 'linear-gradient(145deg, #d4efcb, #9ccc88)', dark: 'linear-gradient(145deg, #4c7d3f, #234f21)' },
  futurista: { light: 'linear-gradient(145deg, #d4f8ff, #8ad8ff)', dark: 'linear-gradient(145deg, #10213a, #050d1f)' },
};

function updateBoardLegendDots() {
  const preview = BOARD_THEME_PREVIEWS[boardTheme] || BOARD_THEME_PREVIEWS.classic;
  if (lightCellDotEl) lightCellDotEl.style.background = preview.light;
  if (darkCellDotEl) darkCellDotEl.style.background = preview.dark;
}

function applyFontTheme() {
  if (!gameShellEl) return;
  gameShellEl.classList.remove('font-theme-rajdhani', 'font-theme-orbitron', 'font-theme-cinzel');
  gameShellEl.classList.add(`font-theme-${fontTheme}`);
}

function applyFontColorTheme() {
  if (!gameShellEl) return;
  gameShellEl.classList.remove('font-color-default', 'font-color-warm', 'font-color-ice', 'font-color-neon');
  gameShellEl.classList.add(`font-color-${fontColorTheme}`);
}

function applyBoardTheme() {
  boardEl.classList.remove('board-theme-classic', 'board-theme-minimalista', 'board-theme-vidrio', 'board-theme-ecologista', 'board-theme-futurista');
  boardEl.classList.add(`board-theme-${boardTheme}`);
  if (!boardWrapEl) return;
  boardWrapEl.classList.remove('board-shell-theme-classic', 'board-shell-theme-minimalista', 'board-shell-theme-vidrio', 'board-shell-theme-ecologista', 'board-shell-theme-futurista');
  boardWrapEl.classList.add(`board-shell-theme-${boardTheme}`);
  updateBoardLegendDots();
}

function getPieceSymbol(pieceSet, piece, side) {
  if (pieceSet?.white && pieceSet?.black) return (side === 'w' ? pieceSet.white[piece] : pieceSet.black[piece]) || '·';
  return pieceSet?.[piece] || '·';
}

function applyPieceColorTheme() {
  boardEl.classList.remove('piece-color-original', 'piece-color-moderno', 'piece-color-staunton', 'piece-color-digital', 'piece-color-cyberpunk');
  boardEl.classList.add(`piece-color-${pieceColorTheme}`);
}


function collectAttackedSquares(board, color) {
  const attacked = new Set();
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      if (board[r][c]?.[0] !== color) continue;
      for (const m of getPseudoMoves(board, r, c)) {
        attacked.add(`${m.row},${m.col}`);
      }
    }
  }
  return attacked;
}

function updateVariationUI() {
  if (variationsSummaryEl) variationsSummaryEl.textContent = `${activeVariations.size}/${TRAINING_VARIATIONS.length} activas`;
  if (toggleAllVariationsBtnEl) {
    toggleAllVariationsBtnEl.textContent = activeVariations.size === TRAINING_VARIATIONS.length ? 'Desactivar todas' : 'Activar todas';
  }
  if (toggleAttacksBtnEl) toggleAttacksBtnEl.textContent = `Casillas atacadas: ${showAttackedSquares ? 'ON' : 'OFF'}`;
  if (togglePromotionAnimationBtnEl) togglePromotionAnimationBtnEl.textContent = `Animación promoción: ${enablePromotionAnimation ? 'ON' : 'OFF'}`;
  if (toggleCheckAnimationBtnEl) toggleCheckAnimationBtnEl.textContent = `Animación jaque: ${enableCheckAnimation ? 'ON' : 'OFF'}`;
  if (toggleLastMoveAnimationBtnEl) toggleLastMoveAnimationBtnEl.textContent = `Animación última jugada: ${enableLastMoveAnimation ? 'ON' : 'OFF'}`;
  if (toggleAudioBtnEl) toggleAudioBtnEl.textContent = `Audio: ${audioEnabled ? 'ON' : 'OFF'}`;
}

async function openTutorialModal() {
  const backdrop = openCyberModal({
    title: 'Tutorial',
    className: 'cyber-modal-centered',
    body: `<div class="tutorial-list">${TUTORIAL_ITEMS.map((item) => `<p><span>${item.title}:</span> ${item.text}</p>`).join('')}</div>`,
    actions: '<button type="button" class="btn primary" data-act="ok">Entendido</button>',
  });
  backdrop.querySelector('[data-act="ok"]').onclick = () => closeCyberModal();
  backdrop.addEventListener('click', (ev) => { if (ev.target === backdrop) closeCyberModal(); });
}


function openPauseModal() {
  return new Promise((resolve) => {
    const backdrop = openCyberModal({
      title: 'Partida en pausa',
      className: 'cyber-modal-centered',
      body: '<p>El juego está detenido. Presioná "Reanudar" para continuar.</p>',
      actions: '<button type="button" class="btn primary" data-act="resume">Reanudar</button>',
    });
    const finish = () => {
      closeCyberModal();
      resolve(true);
    };
    const resumeBtn = backdrop.querySelector('[data-act="resume"]');
    if (resumeBtn) resumeBtn.onclick = finish;
    backdrop.addEventListener('click', (ev) => { if (ev.target === backdrop) finish(); });
  });
}

async function configureVariations() {
  const current = TRAINING_VARIATIONS.map((name) => `${activeVariations.has(name) ? '✅' : '⬜'} ${name}`).join('\n');
  const answer = await openCyberPrompt({
    title: 'Elegir jugadas activas',
    message: `Escribí nombres separados por coma. Vacío = mantener actual.\n\nDisponibles:\n${TRAINING_VARIATIONS.join(', ')}\n\nActual:\n${current}`,
    defaultValue: Array.from(activeVariations).join(', '),
  });
  if (answer === null || !answer.trim()) return;
  const selected = answer.split(',').map((v) => v.trim().toLowerCase()).filter(Boolean);
  activeVariations = new Set(TRAINING_VARIATIONS.filter((name) => selected.includes(name)));
  updateVariationUI();
}


function formatAdvantageScore(score) {
  const normalized = Number.isFinite(score) ? score : 0;
  const side = normalized >= 0 ? 'White' : 'Black';
  return `${side} +${Math.abs(normalized).toFixed(1)}`;
}

function calculateMaterialBalance(board) {
  let white = 0;
  let black = 0;
  for (const row of board) {
    for (const piece of row) {
      if (!piece) continue;
      const value = pieceValue(piece);
      if (piece[0] === 'w') white += value;
      else black += value;
    }
  }
  return (white - black) / 100;
}

function renderAdvantageHistory() {
  if (!advantageHistoryEl) return;
  const entries = (state.advantageHistory || []).slice(0, 20);
  if (!entries.length) {
    advantageHistoryEl.innerHTML = '<span class="advantage-empty">Sin datos de ventaja aún.</span>';
    return;
  }

  advantageHistoryEl.innerHTML = entries
    .map((score) => {
      const sideClass = score >= 0 ? 'white' : 'black';
      return `<span class="advantage-chip ${sideClass}">${formatAdvantageScore(score)}</span>`;
    })
    .join('<span class="advantage-divider" aria-hidden="true">|</span>');
}

function pieceValue(piece) {
  if (!piece) return 0;
  const values = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
  return values[piece[1]] || 0;
}

function scoreMove(board, move, color, context = state) {
  const from = move.from;
  const to = move.to;
  const moving = board[from.row][from.col];
  if (!moving) return -99999;

  const next = clone(board);
  let captured = next[to.row][to.col];

  if (to.special === 'en-passant') {
    const capturedRow = moving[0] === 'w' ? to.row + 1 : to.row - 1;
    captured = next[capturedRow][to.col];
    next[capturedRow][to.col] = null;
  }

  next[to.row][to.col] = moving;
  next[from.row][from.col] = null;

  if (to.special === 'castle-short') {
    next[from.row][5] = next[from.row][7];
    next[from.row][7] = null;
  }
  if (to.special === 'castle-long') {
    next[from.row][3] = next[from.row][0];
    next[from.row][0] = null;
  }

  const promotionPiece = to.promotion || 'q';
  applyPromotion(next, to.row, to.col, promotionPiece);

  let score = 0;
  if (captured) score += pieceValue(captured) - Math.floor(pieceValue(moving) / 10);

  const centerDistance = Math.abs(3.5 - to.row) + Math.abs(3.5 - to.col);
  score += Math.round((7 - centerDistance) * 2);

  if (moving[1] === 'p') {
    score += (moving[0] === 'w' ? (6 - to.row) : (to.row - 1)) * 3;
  }

  const enemy = color === 'w' ? 'b' : 'w';
  if (isKingInCheck(next, enemy)) score += 35;
  if (isKingInCheck(next, color)) score -= 45;

  const replyMoves = getAllLegalMovesForColor(next, enemy, context);
  if (!replyMoves.length && isKingInCheck(next, enemy)) score += 10000;

  return score;
}

function evaluateMoveQuality(boardBefore, executedMove, color, context = state) {
  const legal = getAllLegalMovesForColor(boardBefore, color, context);
  if (!legal.length) return null;

  const scored = legal.map((mv) => ({ move: mv, score: scoreMove(boardBefore, mv, color, context) }));
  scored.sort((a, b) => b.score - a.score);

  const chosenScore = scoreMove(boardBefore, executedMove, color, context);
  const bestScore = scored[0].score;
  const diff = bestScore - chosenScore;

  let grade = 'best';
  if (diff >= 140) grade = 'blunder';
  else if (diff >= 80) grade = 'mistake';
  else if (diff >= 35) grade = 'inaccuracy';

  return {
    color,
    grade,
    diff,
    bestScore,
    chosenScore,
    move: executedMove,
  };
}

function buildPostGameAnalysis() {
  const evals = state.moveEvaluations || [];
  if (!evals.length) {
    state.analysis = null;
    return;
  }

  const summary = { best: 0, inaccuracy: 0, mistake: 0, blunder: 0 };
  let points = 0;

  evals.forEach((entry) => {
    summary[entry.grade] += 1;
    if (entry.grade === 'best') points += 1;
    if (entry.grade === 'inaccuracy') points += 0.65;
    if (entry.grade === 'mistake') points += 0.35;
  });

  state.analysis = {
    ...summary,
    total: evals.length,
    accuracy: Math.round((points / evals.length) * 100),
  };
}

function renderPostGameAnalysis() {
  if (!analysisAccuracyEl || !analysisBestEl || !analysisInaccuracyEl || !analysisMistakeEl || !analysisBlunderEl) return;

  const data = state.analysis;
  if (!data) {
    analysisAccuracyEl.textContent = '--%';
    analysisBestEl.textContent = '0';
    analysisInaccuracyEl.textContent = '0';
    analysisMistakeEl.textContent = '0';
    analysisBlunderEl.textContent = '0';
    return;
  }

  analysisAccuracyEl.textContent = `${data.accuracy}%`;
  analysisBestEl.textContent = String(data.best);
  analysisInaccuracyEl.textContent = String(data.inaccuracy);
  analysisMistakeEl.textContent = String(data.mistake);
  analysisBlunderEl.textContent = String(data.blunder);
}


function render() {
  boardEl.innerHTML = '';
  applyBoardTheme();
  applyPieceColorTheme();
  applyFontTheme();
  applyFontColorTheme();
  const pieceSet = PIECE_SETS[pieceTheme] || PIECE_SETS.retro;
  const rows = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];
  const cols = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];
  const whiteAttacked = showAttackedSquares ? collectAttackedSquares(state.board, 'w') : new Set();
  const blackAttacked = showAttackedSquares ? collectAttackedSquares(state.board, 'b') : new Set();
  const kingInCheck = state.status === 'JAQUE' || state.status.includes('JAQUE MATE') ? locateKing(state.board, state.turn) : null;

  for (const row of rows) for (const col of cols) {
    const sq = document.createElement('button');
    sq.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
    sq.dataset.square = algebraic(row, col);
    if (selected?.row === row && selected?.col === col) sq.classList.add('selected');
    const m = legalMoves.find((x) => x.row === row && x.col === col);
    if (m) sq.classList.add(m.capture ? 'capture' : 'legal');
    if (enableLastMoveAnimation && highlightLastMove && (highlightLastMove.from.row === row && highlightLastMove.from.col === col || highlightLastMove.to.row === row && highlightLastMove.to.col === col)) sq.classList.add('last-move');
    if (state.lastMoveQuality && highlightLastMove && highlightLastMove.to.row === row && highlightLastMove.to.col === col) {
      sq.classList.add(`quality-${state.lastMoveQuality}`);
    }
    if (showAttackedSquares) {
      if (whiteAttacked.has(`${row},${col}`)) sq.classList.add('attacked-by-white');
      if (blackAttacked.has(`${row},${col}`)) sq.classList.add('attacked-by-black');
    }
    if (enableCheckAnimation && kingInCheck && kingInCheck.r === row && kingInCheck.c === col) sq.classList.add('in-check');
    if (state.promotionFX && state.promotionFX.row === row && state.promotionFX.col === col) sq.classList.add('promotion-flash');
    if (state.captureFX && state.captureFX.row === row && state.captureFX.col === col) {
      sq.classList.add(`capture-${captureAnimationStyle}`);
      if (state.captureFX.piece === 'n') sq.classList.add('capture-knight-leap');
    }
    const p = state.board[row][col];
    if (p) {
      const sp = document.createElement('span');
      const sideLabel = p[0] === 'w' ? 'BLANCAS' : 'NEGRAS';
      const pieceLabel = PIECE_NAMES[p[1]] || 'Ficha';
      sq.dataset.pieceName = `${pieceLabel} · ${sideLabel}`;
      sq.setAttribute('aria-label', `${pieceLabel} ${sideLabel} en ${algebraic(row, col)}`);
      sp.className = `piece ${p[0] === 'w' ? 'white' : 'black'} theme-${pieceTheme}`;
      sp.dataset.pieceType = p[1];
      if (moveAnimationStyle === 'deslizante') sp.classList.add('animated-piece');
      sp.textContent = getPieceSymbol(pieceSet, p[1], p[0]);
      sq.appendChild(sp);
    }
    if (coordinateStyle === 'integrado') {
      const coord = document.createElement('span');
      coord.className = 'integrated-coordinate';
      coord.style.color = 'var(--text)';
      if (col === 0) coord.textContent = String(8 - row);
      else if (row === 7) coord.textContent = FILES[col];
      if (coord.textContent) sq.appendChild(coord);
    }
    sq.onclick = () => clickSquare(row, col);
    boardEl.appendChild(sq);
  }

  turnIndicatorEl.textContent = state.turn === 'w' ? 'BLANCAS' : 'NEGRAS';
  statusTextEl.textContent = state.status;
  moveCounterEl.textContent = state.moveNumber;
  selectionLabelEl.textContent = selected ? algebraic(selected.row, selected.col) : '---';
  whiteCapturesEl.textContent = state.captured.w.length;
  blackCapturesEl.textContent = state.captured.b.length;
  lastMoveEl.textContent = state.lastMove || '---';
  moveHistoryEl.innerHTML = state.history.length ? state.history.map((m) => `<li>${m}</li>`).join('') : '<li>Sin movimientos aún.</li>';
  renderAdvantageHistory();
  modeLabelEl.textContent = mode === 'ai' ? `Jugador vs IA · Nivel ${aiLevel}` : mode === 'online' ? `Online (${roomCode || 'sin sala'})` : 'Local 1v1';
  renderClocks();
  if (aiLevelEl) aiLevelEl.style.display = mode === 'ai' ? 'block' : 'none';
  updateVariationUI();
  if (pauseGameBtn) pauseGameBtn.textContent = isPaused ? 'Reanudar' : 'Pausar';
  if (isPaused) statusTextEl.textContent = 'EN PAUSA';
  renderPostGameAnalysis();
}

function pushIfValid(board, moves, row, col, tr, tc) {
  if (!inBounds(tr, tc)) return;
  const p = board[row][col];
  const t = board[tr][tc];
  if (!t) moves.push({ row: tr, col: tc, capture: false, special: null });
  else if (t[0] !== p[0]) moves.push({ row: tr, col: tc, capture: true, special: null });
}

function canCastle(board, row, col, side, color, rights) {
  if (!rights?.[color]?.[side]) return false;
  if (isKingInCheck(board, color)) return false;
  const enemy = color === 'w' ? 'b' : 'w';
  const rookCol = side === 'short' ? 7 : 0;
  const kingPath = side === 'short' ? [5, 6] : [3, 2];
  const emptyCols = side === 'short' ? [5, 6] : [1, 2, 3];
  const rook = board[row][rookCol];
  if (rook !== `${color}r`) return false;
  for (const file of emptyCols) if (board[row][file]) return false;
  const attacked = collectAttackedSquares(board, enemy);
  for (const file of [col, ...kingPath]) if (attacked.has(`${row},${file}`)) return false;
  return true;
}

function getPseudoMoves(board, row, col, context = {}) {
  const p = board[row][col];
  if (!p) return [];
  const c = p[0];
  const e = c === 'w' ? 'b' : 'w';
  const t = p[1];
  const moves = [];
  const enPassantTarget = context.enPassantTarget;
  const castlingRights = context.castlingRights;

  if (t === 'p') {
    const d = c === 'w' ? -1 : 1;
    const s = c === 'w' ? 6 : 1;
    const n = row + d;
    if (inBounds(n, col) && !board[n][col]) {
      moves.push({ row: n, col, capture: false, special: null });
      const j = row + 2 * d;
      if (row === s && !board[j][col]) moves.push({ row: j, col, capture: false, special: null });
    }
    for (const dc of [-1, 1]) {
      const nc = col + dc;
      if (!inBounds(n, nc)) continue;
      if (board[n][nc] && board[n][nc][0] === e) {
        moves.push({ row: n, col: nc, capture: true, special: null });
      } else if (enPassantTarget && enPassantTarget.row === n && enPassantTarget.col === nc) {
        moves.push({ row: n, col: nc, capture: true, special: 'en-passant' });
      }
    }
  }

  if (t === 'n') for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) pushIfValid(board, moves, row, col, row + dr, col + dc);

  if (['b', 'r', 'q'].includes(t)) {
    const d = [];
    if (['b', 'q'].includes(t)) d.push([-1,-1],[-1,1],[1,-1],[1,1]);
    if (['r', 'q'].includes(t)) d.push([-1,0],[1,0],[0,-1],[0,1]);
    for (const [dr, dc] of d) {
      let r = row + dr;
      let c2 = col + dc;
      while (inBounds(r, c2)) {
        const tar = board[r][c2];
        if (!tar) moves.push({ row: r, col: c2, capture: false, special: null });
        else {
          if (tar[0] !== c) moves.push({ row: r, col: c2, capture: true, special: null });
          break;
        }
        r += dr;
        c2 += dc;
      }
    }
  }

  if (t === 'k') {
    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (dr || dc) pushIfValid(board, moves, row, col, row + dr, col + dc);
      }
    }
    if (castlingRights) {
      if (canCastle(board, row, col, 'short', c, castlingRights)) moves.push({ row, col: col + 2, capture: false, special: 'castle-short' });
      if (canCastle(board, row, col, 'long', c, castlingRights)) moves.push({ row, col: col - 2, capture: false, special: 'castle-long' });
    }
  }

  return moves;
}

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
function getLegalMoves(board, row, col, context = {}) {
  return getPseudoMoves(board, row, col, context).filter((m) => {
    const b = clone(board);
    const movingPiece = b[row][col];
    b[m.row][m.col] = movingPiece;
    b[row][col] = null;

    if (m.special === 'en-passant') {
      const capturedRow = movingPiece[0] === 'w' ? m.row + 1 : m.row - 1;
      b[capturedRow][m.col] = null;
    }

    if (m.special === 'castle-short') {
      b[row][5] = b[row][7];
      b[row][7] = null;
    }

    if (m.special === 'castle-long') {
      b[row][3] = b[row][0];
      b[row][0] = null;
    }

    applyPromotion(b, m.row, m.col, 'q');
    return !isKingInCheck(b, movingPiece[0]);
  });
}

function hasAny(board, color, context = {}) {
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      if (board[r][c]?.[0] === color && getLegalMoves(board, r, c, context).length) return true;
    }
  }
  return false;
}

function closeCyberModal() {
  const backdrop = document.querySelector('.cyber-modal-backdrop');
  if (backdrop) backdrop.remove();
}

function openCyberModal({ title, body = '', actions = '', className = '' }) {
  closeCyberModal();
  const backdrop = document.createElement('div');
  backdrop.className = 'cyber-modal-backdrop';
  backdrop.innerHTML = `
    <div class="cyber-modal panel-glow ${className}" role="dialog" aria-modal="true">
      <h3>${title}</h3>
      ${body}
      <div class="cyber-modal-actions">${actions}</div>
    </div>`;
  document.body.appendChild(backdrop);
  return backdrop;
}

function openCyberPrompt({ title, message, defaultValue = '' }) {
  return new Promise((resolve) => {
    const backdrop = openCyberModal({
      title,
      body: `<p>${message}</p><input class="cyber-modal-input" type="text" value="${defaultValue}">`,
      actions: `
        <button type="button" class="btn secondary" data-act="cancel">Cancelar</button>
        <button type="button" class="btn primary" data-act="ok">Aceptar</button>`,
    });
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
    const backdrop = openCyberModal({
      title: 'Confirmación',
      body: `<p>${message}</p>`,
      actions: `
        <button type="button" class="btn secondary" data-act="cancel">Cancelar</button>
        <button type="button" class="btn danger" data-act="ok">Confirmar</button>`,
    });
    const finalize = (value) => { closeCyberModal(); resolve(value); };
    backdrop.querySelector('[data-act="cancel"]').onclick = () => finalize(false);
    backdrop.querySelector('[data-act="ok"]').onclick = () => finalize(true);
    backdrop.addEventListener('click', (ev) => { if (ev.target === backdrop) finalize(false); });
  });
}

function openConfigNotice(title, message) {
  return new Promise((resolve) => {
    const backdrop = openCyberModal({
      title,
      className: 'cyber-modal-centered',
      body: `<p>${message}</p>`,
      actions: '<button type="button" class="btn primary" data-act="ok">Entendido</button>',
    });
    const finish = () => { closeCyberModal(); resolve(true); };
    backdrop.querySelector('[data-act="ok"]').onclick = finish;
    backdrop.addEventListener('click', (ev) => { if (ev.target === backdrop) finish(); });
  });
}

async function resetMatchWithConfigNotice() {
  waitingStartColor = true;
  resetGame();
  beginMatchFlow();
}

function openPromotionSelector(color) {
  return new Promise((resolve) => {
    const options = [
      { key: 'q', label: 'Reina' },
      { key: 'r', label: 'Torre' },
      { key: 'b', label: 'Alfil' },
      { key: 'n', label: 'Caballo' },
    ];
    const backdrop = openCyberModal({
      title: 'Promoción de peón',
      body: `<p>${color === 'w' ? 'BLANCAS' : 'NEGRAS'}: elegí la pieza para promocionar.</p>`,
      actions: options.map((opt) => `<button type="button" class="btn secondary" data-piece="${opt.key}">${opt.label}</button>`).join(''),
    });
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
  if (waitingStartColor || isPaused || state.status.includes('JAQUE MATE') || state.status.includes('TIEMPO AGOTADO')) return;
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
  legalMoves = getLegalMoves(state.board, row, col, state);
  render();
}

async function makeMove(fr, fc, tr, tc, promotionChoice = null) {
  const piece = state.board[fr][fc];
  let target = state.board[tr][tc];
  const legalMove = getLegalMoves(state.board, fr, fc, state).find((m) => m.row === tr && m.col === tc);
  if (!piece || !legalMove) return;
  const boardBeforeMove = clone(state.board);

  const isPromotionMove = piece[1] === 'p' && ((piece[0] === 'w' && tr === 0) || (piece[0] === 'b' && tr === 7));
  if (isPromotionMove && !promotionChoice) promotionChoice = await openPromotionSelector(piece[0]);

  if (legalMove.special === 'en-passant') {
    const capturedRow = piece[0] === 'w' ? tr + 1 : tr - 1;
    target = state.board[capturedRow][tc];
    state.board[capturedRow][tc] = null;
  }

  state.board[tr][tc] = piece;
  state.board[fr][fc] = null;

  if (legalMove.special === 'castle-short') {
    state.board[tr][5] = state.board[tr][7];
    state.board[tr][7] = null;
  }
  if (legalMove.special === 'castle-long') {
    state.board[tr][3] = state.board[tr][0];
    state.board[tr][0] = null;
  }

  applyPromotion(state.board, tr, tc, promotionChoice);
  state.promotionFX = isPromotionMove && enablePromotionAnimation ? { row: tr, col: tc } : null;

  if (target) {
    state.captured[piece[0]].push(target);
    state.captureFX = { row: tr, col: tc, piece: piece[1] };
  } else {
    state.captureFX = null;
  }

  if (piece[1] === 'k') {
    state.castlingRights[piece[0]].short = false;
    state.castlingRights[piece[0]].long = false;
  }
  if (piece[1] === 'r') {
    if (fr === 7 && fc === 0) state.castlingRights.w.long = false;
    if (fr === 7 && fc === 7) state.castlingRights.w.short = false;
    if (fr === 0 && fc === 0) state.castlingRights.b.long = false;
    if (fr === 0 && fc === 7) state.castlingRights.b.short = false;
  }
  if (target?.[1] === 'r') {
    if (tr === 7 && tc === 0) state.castlingRights.w.long = false;
    if (tr === 7 && tc === 7) state.castlingRights.w.short = false;
    if (tr === 0 && tc === 0) state.castlingRights.b.long = false;
    if (tr === 0 && tc === 7) state.castlingRights.b.short = false;
  }

  if (piece[1] === 'p' && Math.abs(tr - fr) === 2) {
    state.enPassantTarget = { row: (fr + tr) / 2, col: fc };
  } else {
    state.enPassantTarget = null;
  }

  const sideText = piece[0] === 'w' ? 'BLANCAS' : 'NEGRAS';
  const pieceName = PIECE_NAMES[piece[1]] || 'Ficha';
  const fromSq = algebraic(fr, fc);
  const toSq = algebraic(tr, tc);
  const openingMove = `${fromSq}${toSq}`;
  const analyzedMove = { from: { row: fr, col: fc }, to: { row: tr, col: tc, special: legalMove.special, promotion: promotionChoice || 'q' } };
  const quality = evaluateMoveQuality(boardBeforeMove, analyzedMove, piece[0], state);
  if (quality) {
    state.moveEvaluations.unshift(quality);
    state.lastMoveQuality = quality.grade;
  }
  const advantageScore = calculateMaterialBalance(state.board);
  state.advantageHistory.unshift(advantageScore);
  state.openingMoves.push(openingMove);
  state.openingName = detectOpening(state.openingMoves);
  const moveText = target
    ? `${sideText}: ${pieceName} x ${toSq} → ${pieceName.toLowerCase()} captura en ${toSq}`
    : `${sideText}: ${pieceName} ${state.moveNumber}. ${fromSq} → ${toSq}${state.openingName ? ` jugando una ${state.openingName}` : ''}`;
  state.history.unshift(moveText);
  state.lastMove = `${fromSq} → ${toSq}`;
  highlightLastMove = { from: { row: fr, col: fc }, to: { row: tr, col: tc } };
  state.turn = state.turn === 'w' ? 'b' : 'w';
  state.moveNumber += 1;
  selected = null;
  legalMoves = [];
  evaluateGameStatus();
  if (state.status !== 'EN CURSO' && state.status !== 'JAQUE') buildPostGameAnalysis();
  else state.analysis = null;
  playMoveSound(Boolean(target), state.status);
  render();
  if (mode === 'online' && roomCode) await syncOnline();
  if (mode === 'ai' && state.turn === 'b' && (state.status === 'EN CURSO' || state.status === 'JAQUE')) await playAi();
}

async function playAi() {
  const fallbackMove = () => {
    const legal = getAllLegalMovesForColor(state.board, 'b', state);
    if (!legal.length) return null;
    return legal[Math.floor(Math.random() * legal.length)];
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('/api/ai-move/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board: state.board, color: 'b', difficulty: aiLevel }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const data = await res.json();
    const chosen = data.status === 'ok' && data.move ? data.move : fallbackMove();
    if (!chosen) return;
    await makeMove(chosen.from.row, chosen.from.col, chosen.to.row, chosen.to.col, null);
  } catch (err) {
    const chosen = fallbackMove();
    if (!chosen) return;
    await makeMove(chosen.from.row, chosen.from.col, chosen.to.row, chosen.to.col, null);
  }
}

async function loadRanking() {
  if (!rankingListEl) return;
  const res = await fetch('/api/ranking/');
  const data = await res.json();
  rankingListEl.innerHTML = (data.results || []).map((p) => `<li>${p.name}: ${p.rating} (${p.wins}W/${p.losses}L/${p.draws}D)</li>`).join('') || '<li>Sin ranking todavía.</li>';
}


let currentUser = null;

function renderUserStats(user) {
  if (!authStatusEl || !userStatsListEl) return;
  if (!user) {
    authStatusEl.textContent = 'No autenticado';
    userStatsListEl.innerHTML = '<li>Iniciá sesión para ver estadísticas.</li>';
    return;
  }
  authStatusEl.textContent = `Sesión activa: ${user.username}`;
  if (avatarUrlEl && user.avatar_url) avatarUrlEl.value = user.avatar_url;
  const stats = user.stats || {};
  userStatsListEl.innerHTML = [
    `Partidas jugadas: ${stats.games_played ?? 0}`,
    `Victorias: ${stats.wins ?? 0}`,
    `Derrotas: ${stats.losses ?? 0}`,
    `Empates: ${stats.draws ?? 0}`,
    `Rating: ${stats.rating ?? 1200}`,
    `Mejor victoria: ${stats.best_victory || 'Sin registrar'}`,
  ].map((item) => `<li>${item}</li>`).join('');
}

async function loadProfile() {
  try {
    const res = await fetch('/api/auth/profile/');
    const data = await res.json();
    currentUser = data.status === 'ok' ? data.user : null;
  } catch (err) {
    currentUser = null;
  }
  renderUserStats(currentUser);
}

async function authRequest(url, payload = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
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
  if (!from || !to || waitingStartColor) return;
  const piece = state.board[from.row][from.col];
  if (!piece || piece[0] !== state.turn) return;
  const moves = getLegalMoves(state.board, from.row, from.col, state);
  const chosen = moves.find((m) => m.row === to.row && m.col === to.col);
  if (!chosen) return;
  if (waitingStartColor || isPaused || state.status.includes('JAQUE MATE') || state.status.includes('TIEMPO AGOTADO')) return;
  await makeMove(from.row, from.col, to.row, to.col, null);
  commandFromEl.value = '';
  commandToEl.value = '';
}

function setInitialBoardTurn() {
  state.turn = 'w';
  state.moveNumber = 1;
}

function askStartColor() {
  return openConfigNotice(
    'Regla oficial aplicada',
    'En ajedrez, las BLANCAS siempre inician la partida. El juego arrancará automáticamente con BLANCAS.'
  ).then(() => 'w');
}

function getAllLegalMovesForColor(board, color, context = state) {
  const moves = [];
  for (let r = 0; r < 8; r += 1) for (let c = 0; c < 8; c += 1) {
    const piece = board[r][c];
    if (!piece || piece[0] !== color) continue;
    const legal = getLegalMoves(board, r, c, context);
    legal.forEach((mv) => moves.push({ from: { row: r, col: c }, to: mv }));
  }
  return moves;
}

async function beginMatchFlow() {
  await askStartColor();
  setInitialBoardTurn();
  waitingStartColor = false;
  startTimerLoop();
  render();
}

modeSelectEl.onchange = () => {
  mode = modeSelectEl.value;
  if (mode === 'ai' && aiLevelEl) {
    aiLevelEl.value = '1';
    aiLevel = 1;
  }
  render();
  if (pollTimer) clearInterval(pollTimer);
  if (mode === 'online' && roomCode) pollTimer = setInterval(pollOnline, 2000);
};
if (aiLevelEl) {
  aiLevelEl.onchange = async () => {
    aiLevel = Number(aiLevelEl.value) || 1;
    render();
    if (mode === 'ai') {
      await resetMatchWithConfigNotice();
    }
  };
}
if (pieceThemeEl) pieceThemeEl.onchange = () => { pieceTheme = pieceThemeEl.value || 'retro'; render(); };
if (pieceColorsEl) pieceColorsEl.onchange = () => { pieceColorTheme = pieceColorsEl.value || 'original'; render(); };
if (boardThemeEl) boardThemeEl.onchange = () => { boardTheme = boardThemeEl.value || 'classic'; render(); };
if (fontThemeEl) fontThemeEl.onchange = () => { fontTheme = fontThemeEl.value || 'rajdhani'; render(); };
if (fontColorsEl) fontColorsEl.onchange = () => { fontColorTheme = fontColorsEl.value || 'default'; render(); };
if (coordinateStyleEl) coordinateStyleEl.onchange = () => { coordinateStyle = coordinateStyleEl.value || 'clasico'; renderCoordinates(); render(); };
if (moveAnimationEl) moveAnimationEl.onchange = () => { moveAnimationStyle = moveAnimationEl.value || 'instantanea'; render(); };
if (captureAnimationEl) captureAnimationEl.onchange = () => { captureAnimationStyle = captureAnimationEl.value || 'desvanecimiento'; render(); };

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
  if (shouldReset) {
    await resetMatchWithConfigNotice();
  }
};

if (restartGameBtn) {
  restartGameBtn.onclick = async () => {
    const shouldReset = await openCyberConfirm('¿Reiniciar partida y volver al estado inicial?');
    if (shouldReset) {
      await resetMatchWithConfigNotice();
    }
  };
}

if (pauseGameBtn) {
  pauseGameBtn.onclick = async () => {
    if (isPaused) {
      isPaused = false;
      render();
      return;
    }
    isPaused = true;
    render();
    await openPauseModal();
    isPaused = false;
    render();
  };
}
flipBoardBtn.onclick = () => { flipped = !flipped; renderCoordinates(); render(); };
resetViewBtn.onclick = () => {
  selected = null;
  legalMoves = [];
  highlightLastMove = null;
  state.lastMoveQuality = null;
  if (commandFromEl) commandFromEl.value = '';
  if (commandToEl) commandToEl.value = '';
  render();
};


if (openTutorialPanelBtnEl) openTutorialPanelBtnEl.onclick = () => openTutorialModal();
if (openVariationsBtnEl) openVariationsBtnEl.onclick = () => configureVariations();
const variationButtons = [
  [toggleAllVariationsBtnEl, () => {
    activeVariations = activeVariations.size === TRAINING_VARIATIONS.length ? new Set() : new Set(TRAINING_VARIATIONS);
    updateVariationUI();
  }],
  [toggleAttacksBtnEl, () => { showAttackedSquares = !showAttackedSquares; render(); }],
  [togglePromotionAnimationBtnEl, () => { enablePromotionAnimation = !enablePromotionAnimation; render(); }],
  [toggleCheckAnimationBtnEl, () => { enableCheckAnimation = !enableCheckAnimation; render(); }],
  [toggleLastMoveAnimationBtnEl, () => { enableLastMoveAnimation = !enableLastMoveAnimation; render(); }],
];
variationButtons.forEach(([btn, handler]) => {
  if (!btn) return;
  btn.onclick = handler;
});
if (toggleAudioBtnEl) {
  toggleAudioBtnEl.onclick = () => {
    audioEnabled = !audioEnabled;
    if (!audioEnabled) volume = 0;
    else if (volume === 0) volume = 1;
    if (masterGain) masterGain.gain.value = volume;
    updateVolumeUI();
    updateVariationUI();
  };
}

if (registerBtn) {
  registerBtn.onclick = async () => {
    const data = await authRequest('/api/auth/register/', {
      username: authUsernameEl?.value || '',
      email: authEmailEl?.value || '',
      password: authPasswordEl?.value || '',
    });
    if (data.status === 'ok') {
      currentUser = data.user;
      renderUserStats(currentUser);
    }
  };
}
if (loginBtn) {
  loginBtn.onclick = async () => {
    const data = await authRequest('/api/auth/login/', {
      username: authUsernameEl?.value || '',
      password: authPasswordEl?.value || '',
    });
    if (data.status === 'ok') {
      currentUser = data.user;
      renderUserStats(currentUser);
    }
  };
}
if (logoutBtn) {
  logoutBtn.onclick = async () => {
    await authRequest('/api/auth/logout/');
    currentUser = null;
    renderUserStats(null);
  };
}
if (saveProfileBtn) {
  saveProfileBtn.onclick = async () => {
    const data = await authRequest('/api/auth/profile/update/', {
      avatar_url: avatarUrlEl?.value || '',
    });
    if (data.status === 'ok') {
      currentUser = data.user;
      renderUserStats(currentUser);
    }
  };
}

if (volumeSliderEl) {
  volumeSliderEl.oninput = () => {
    volume = Number(volumeSliderEl.value) / 100;
    audioEnabled = volume > 0;
    if (masterGain) masterGain.gain.value = volume;
    updateVolumeUI();
    updateVariationUI();
    ensureAudioContext();
  };
  volumeSliderEl.addEventListener('pointerdown', ensureAudioContext);
  volumeSliderEl.addEventListener('touchstart', ensureAudioContext, { passive: true });
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

if (eloAInputEl) eloAInputEl.addEventListener('input', renderEloPreview);
if (eloBInputEl) eloBInputEl.addEventListener('input', renderEloPreview);
if (eloResultEl) eloResultEl.addEventListener('change', renderEloPreview);

updateVolumeUI();
updateVariationUI();
updateBoardLegendDots();
renderEloPreview();
resetGame();
loadRanking();
loadProfile();


['click', 'touchstart', 'keydown', 'pointerdown'].forEach((evt) => {
  document.addEventListener(evt, ensureAudioContext, { once: true });
});
