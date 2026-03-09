const boardEl = document.getElementById('board');
const turnIndicatorEl = document.getElementById('turn-indicator');
const statusTextEl = document.getElementById('status-text');
const moveCounterEl = document.getElementById('move-counter');
const selectionLabelEl = document.getElementById('selection-label');
const whiteCapturesEl = document.getElementById('white-captures');
const blackCapturesEl = document.getElementById('black-captures');
const checkAlertEl = document.getElementById('check-alert');
const lastMoveEl = document.getElementById('last-move');
const moveHistoryEl = document.getElementById('move-history');
const newGameBtn = document.getElementById('new-game-btn');
const flipBoardBtn = document.getElementById('flip-board-btn');
const resetViewBtn = document.getElementById('reset-view-btn');
const coordsTopEl = document.getElementById('coords-top');
const coordsBottomEl = document.getElementById('coords-bottom');
const coordsLeftEl = document.getElementById('coords-left');
const coordsRightEl = document.getElementById('coords-right');

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];
const PIECES = {
  wp: '♙', wr: '♖', wn: '♘', wb: '♗', wq: '♕', wk: '♔',
  bp: '♟', br: '♜', bn: '♞', bb: '♝', bq: '♛', bk: '♚',
};

let state = null;
let selected = null;
let legalMoves = [];
let flipped = false;

function createInitialBoard() {
  return [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
  ];
}

function createState() {
  return {
    board: createInitialBoard(),
    turn: 'w',
    moveNumber: 1,
    selected: null,
    history: [],
    captured: { w: [], b: [] },
    lastMove: null,
    status: 'EN CURSO',
  };
}

function resetGame() {
  state = createState();
  selected = null;
  legalMoves = [];
  renderCoordinates();
  render();
}

function renderCoordinates() {
  const files = flipped ? [...FILES].reverse() : FILES;
  const ranks = flipped ? ['1','2','3','4','5','6','7','8'] : RANKS;
  coordsTopEl.innerHTML = files.map((f) => `<span>${f}</span>`).join('');
  coordsBottomEl.innerHTML = files.map((f) => `<span>${f}</span>`).join('');
  coordsLeftEl.innerHTML = ranks.map((r) => `<span>${r}</span>`).join('');
  coordsRightEl.innerHTML = ranks.map((r) => `<span>${r}</span>`).join('');
}

function render() {
  boardEl.innerHTML = '';
  const displayRows = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];
  const displayCols = flipped ? [...Array(8).keys()].reverse() : [...Array(8).keys()];

  for (const row of displayRows) {
    for (const col of displayCols) {
      const square = document.createElement('button');
      square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
      square.dataset.row = row;
      square.dataset.col = col;
      square.setAttribute('aria-label', algebraic(row, col));

      if (selected && selected.row === row && selected.col === col) {
        square.classList.add('selected');
      }

      const move = legalMoves.find((item) => item.row === row && item.col === col);
      if (move) {
        square.classList.add(move.capture ? 'capture' : 'legal');
      }

      const piece = state.board[row][col];
      if (piece) {
        const pieceEl = document.createElement('span');
        pieceEl.className = `piece ${piece[0] === 'w' ? 'white' : 'black'}`;
        pieceEl.textContent = PIECES[piece];
        square.appendChild(pieceEl);
      }

      if (isKingInCheckSquare(row, col)) {
        square.classList.add('in-check');
      }

      square.addEventListener('click', () => handleSquareClick(row, col));
      boardEl.appendChild(square);
    }
  }

  turnIndicatorEl.textContent = state.turn === 'w' ? 'Blancas' : 'Negras';
  statusTextEl.textContent = state.status;
  moveCounterEl.textContent = state.moveNumber;
  selectionLabelEl.textContent = selected ? algebraic(selected.row, selected.col) : '---';
  whiteCapturesEl.textContent = state.captured.w.length;
  blackCapturesEl.textContent = state.captured.b.length;
  lastMoveEl.textContent = state.lastMove || '---';

  const checkColor = getCheckColor(state.board);
  checkAlertEl.textContent = checkColor === 'w' ? 'BLANCAS' : checkColor === 'b' ? 'NEGRAS' : 'NINGUNO';

  moveHistoryEl.innerHTML = state.history.length
    ? state.history.map((move) => `<li>${move}</li>`).join('')
    : '<li>Sin movimientos aún.</li>';
}

function handleSquareClick(row, col) {
  if (state.status.includes('JAQUE MATE')) return;
  const piece = state.board[row][col];

  if (selected) {
    const chosenMove = legalMoves.find((move) => move.row === row && move.col === col);
    if (chosenMove) {
      makeMove(selected.row, selected.col, row, col, chosenMove);
      return;
    }

    if (piece && piece[0] === state.turn) {
      selectSquare(row, col);
      return;
    }

    clearSelection();
    render();
    return;
  }

  if (piece && piece[0] === state.turn) {
    selectSquare(row, col);
  }
}

function selectSquare(row, col) {
  selected = { row, col };
  legalMoves = getLegalMoves(state.board, row, col, true);
  render();
}

function clearSelection() {
  selected = null;
  legalMoves = [];
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function algebraic(row, col) {
  return `${FILES[col]}${8 - row}`;
}

function inBounds(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function getPseudoMoves(board, row, col) {
  const piece = board[row][col];
  if (!piece) return [];
  const color = piece[0];
  const type = piece[1];
  const moves = [];
  const enemy = color === 'w' ? 'b' : 'w';

  if (type === 'p') {
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    const nextRow = row + dir;
    if (inBounds(nextRow, col) && !board[nextRow][col]) {
      moves.push({ row: nextRow, col, capture: false });
      const jumpRow = row + dir * 2;
      if (row === startRow && !board[jumpRow][col]) {
        moves.push({ row: jumpRow, col, capture: false });
      }
    }

    for (const deltaCol of [-1, 1]) {
      const targetCol = col + deltaCol;
      if (!inBounds(nextRow, targetCol)) continue;
      const target = board[nextRow][targetCol];
      if (target && target[0] === enemy) {
        moves.push({ row: nextRow, col: targetCol, capture: true });
      }
    }
  }

  if (type === 'n') {
    const jumps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for (const [dr, dc] of jumps) {
      pushIfValid(board, moves, row, col, row + dr, col + dc);
    }
  }

  if (type === 'b' || type === 'r' || type === 'q') {
    const directions = [];
    if (type === 'b' || type === 'q') directions.push([-1,-1],[-1,1],[1,-1],[1,1]);
    if (type === 'r' || type === 'q') directions.push([-1,0],[1,0],[0,-1],[0,1]);
    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      while (inBounds(r, c)) {
        const target = board[r][c];
        if (!target) {
          moves.push({ row: r, col: c, capture: false });
        } else {
          if (target[0] !== color) {
            moves.push({ row: r, col: c, capture: true });
          }
          break;
        }
        r += dr;
        c += dc;
      }
    }
  }

  if (type === 'k') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        pushIfValid(board, moves, row, col, row + dr, col + dc);
      }
    }
  }

  return moves;
}

function pushIfValid(board, moves, row, col, targetRow, targetCol) {
  if (!inBounds(targetRow, targetCol)) return;
  const piece = board[row][col];
  const target = board[targetRow][targetCol];
  if (!target) {
    moves.push({ row: targetRow, col: targetCol, capture: false });
  } else if (target[0] !== piece[0]) {
    moves.push({ row: targetRow, col: targetCol, capture: true });
  }
}

function getLegalMoves(board, row, col, validateCheck = true) {
  const piece = board[row][col];
  if (!piece) return [];
  const pseudoMoves = getPseudoMoves(board, row, col);
  if (!validateCheck) return pseudoMoves;

  return pseudoMoves.filter((move) => {
    const nextBoard = cloneBoard(board);
    nextBoard[move.row][move.col] = nextBoard[row][col];
    nextBoard[row][col] = null;
    applyPromotion(nextBoard, move.row, move.col);
    return !isKingInCheck(nextBoard, piece[0]);
  });
}

function applyPromotion(board, row, col) {
  const piece = board[row][col];
  if (!piece || piece[1] !== 'p') return;
  if ((piece[0] === 'w' && row === 0) || (piece[0] === 'b' && row === 7)) {
    board[row][col] = `${piece[0]}q`;
  }
}

function locateKing(board, color) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === `${color}k`) return { row, col };
    }
  }
  return null;
}

function isKingInCheck(board, color) {
  const king = locateKing(board, color);
  if (!king) return false;
  const enemy = color === 'w' ? 'b' : 'w';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece[0] === enemy) {
        const moves = getPseudoMoves(board, row, col);
        if (moves.some((move) => move.row === king.row && move.col === king.col)) {
          return true;
        }
      }
    }
  }
  return false;
}

function getCheckColor(board) {
  if (isKingInCheck(board, 'w')) return 'w';
  if (isKingInCheck(board, 'b')) return 'b';
  return null;
}

function isKingInCheckSquare(row, col) {
  const piece = state.board[row][col];
  if (!piece || piece[1] !== 'k') return false;
  return isKingInCheck(state.board, piece[0]);
}

function hasAnyLegalMove(board, color) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece[0] === color && getLegalMoves(board, row, col, true).length) {
        return true;
      }
    }
  }
  return false;
}

function makeMove(fromRow, fromCol, toRow, toCol, moveData) {
  const piece = state.board[fromRow][fromCol];
  const target = state.board[toRow][toCol];
  const pieceName = pieceNameInSpanish(piece);
  const moveText = `${state.moveNumber}. ${pieceName} ${algebraic(fromRow, fromCol)} → ${algebraic(toRow, toCol)}`;

  if (target) {
    state.captured[piece[0]].push(target);
  }

  state.board[toRow][toCol] = piece;
  state.board[fromRow][fromCol] = null;
  applyPromotion(state.board, toRow, toCol);

  if (piece[1] === 'p' && (toRow === 0 || toRow === 7)) {
    state.history.unshift(`${moveText} = promoción a Reina`);
  } else if (target) {
    state.history.unshift(`${moveText} x ${pieceNameInSpanish(target)}`);
  } else {
    state.history.unshift(moveText);
  }

  state.lastMove = `${algebraic(fromRow, fromCol)} → ${algebraic(toRow, toCol)}`;
  state.turn = state.turn === 'w' ? 'b' : 'w';
  state.moveNumber += 1;

  const checkColor = getCheckColor(state.board);
  const activePlayerHasMoves = hasAnyLegalMove(state.board, state.turn);

  if (checkColor === state.turn && !activePlayerHasMoves) {
    state.status = `JAQUE MATE · ${state.turn === 'w' ? 'NEGRAS GANAN' : 'BLANCAS GANAN'}`;
  } else if (checkColor === state.turn) {
    state.status = `JAQUE A ${state.turn === 'w' ? 'BLANCAS' : 'NEGRAS'}`;
  } else if (!activePlayerHasMoves) {
    state.status = 'TABLAS';
  } else {
    state.status = 'EN CURSO';
  }

  clearSelection();
  render();
}

function pieceNameInSpanish(piece) {
  const names = { p: 'Peón', r: 'Torre', n: 'Caballo', b: 'Alfil', q: 'Reina', k: 'Rey' };
  return names[piece[1]] || 'Pieza';
}

newGameBtn.addEventListener('click', resetGame);
flipBoardBtn.addEventListener('click', () => {
  flipped = !flipped;
  renderCoordinates();
  render();
});
resetViewBtn.addEventListener('click', () => {
  clearSelection();
  render();
});

resetGame();
