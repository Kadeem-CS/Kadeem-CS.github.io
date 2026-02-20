const PIECES = {
  wP: "♙", wR: "♖", wN: "♘", wB: "♗", wQ: "♕", wK: "♔",
  bP: "♟", bR: "♜", bN: "♞", bB: "♝", bQ: "♛", bK: "♚",
};

function createInitialBoard() {
  const empty = Array(8).fill(null);
  const board = [];
  board.push([
    { type: "R", color: "b" },
    { type: "N", color: "b" },
    { type: "B", color: "b" },
    { type: "Q", color: "b" },
    { type: "K", color: "b" },
    { type: "B", color: "b" },
    { type: "N", color: "b" },
    { type: "R", color: "b" },
  ]);
  board.push(Array(8).fill({ type: "P", color: "b" }));
  for (let i = 0; i < 4; i++) board.push([...empty]);
  board.push(Array(8).fill({ type: "P", color: "w" }));
  board.push([
    { type: "R", color: "w" },
    { type: "N", color: "w" },
    { type: "B", color: "w" },
    { type: "Q", color: "w" },
    { type: "K", color: "w" },
    { type: "B", color: "w" },
    { type: "N", color: "w" },
    { type: "R", color: "w" },
  ]);
  return board;
}

let boardState = createInitialBoard();
let turn = "w";
let selected = null;
let legalMoves = [];

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const newGameBtn = document.getElementById("newGameBtn");

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function generateMoves(board, from) {
  const [fr, fc] = from;
  const piece = board[fr][fc];
  if (!piece) return [];
  const { type, color } = piece;
  const moves = [];
  const dir = color === "w" ? -1 : 1;

  const add = (r, c, captureOnly = false) => {
    if (!inBounds(r, c)) return;
    const target = board[r][c];
    if (target) {
      if (target.color !== color) moves.push([r, c]);
    } else if (!captureOnly) {
      moves.push([r, c]);
    }
  };

  if (type === "P") {
    const nr = fr + dir;
    if (inBounds(nr, fc) && !board[nr][fc]) moves.push([nr, fc]);
    add(fr + dir, fc - 1, true);
    add(fr + dir, fc + 1, true);
  } else if (type === "N") {
    const deltas = [
      [2,1],[2,-1],[-2,1],[-2,-1],
      [1,2],[1,-2],[-1,2],[-1,-2]
    ];
    deltas.forEach(([dr,dc]) => add(fr+dr, fc+dc));
  } else if (type === "B" || type === "R" || type === "Q") {
    const dirs = [];
    if (type === "B" || type === "Q") {
      dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
    }
    if (type === "R" || type === "Q") {
      dirs.push([1,0],[-1,0],[0,1],[0,-1]);
    }
    dirs.forEach(([dr,dc]) => {
      let r = fr + dr, c = fc + dc;
      while (inBounds(r,c)) {
        const target = board[r][c];
        if (!target) {
          moves.push([r,c]);
        } else {
          if (target.color !== color) moves.push([r,c]);
          break;
        }
        r += dr; c += dc;
      }
    });
  } else if (type === "K") {
    for (let dr=-1; dr<=1; dr++) {
      for (let dc=-1; dc<=1; dc++) {
        if (dr===0 && dc===0) continue;
        add(fr+dr, fc+dc);
      }
    }
  }

  return moves;
}

function render() {
  boardEl.innerHTML = "";
  statusEl.textContent = `Turn: ${turn === "w" ? "White" : "Black"}`;

  for (let r = 0; r < 8; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";

    for (let c = 0; c < 8; c++) {
      const squareEl = document.createElement("div");
      const isLight = (r + c) % 2 === 0;
      squareEl.className = "square " + (isLight ? "light" : "dark");
      squareEl.dataset.row = r;
      squareEl.dataset.col = c;

      if (selected && selected[0] === r && selected[1] === c) {
        squareEl.classList.add("selected");
      }

      if (legalMoves.some(([mr, mc]) => mr === r && mc === c)) {
        squareEl.classList.add("legal");
      }

      const piece = boardState[r][c];
      if (piece) {
        squareEl.textContent = PIECES[piece.color + piece.type];
      }

      squareEl.addEventListener("click", onSquareClick);
      rowEl.appendChild(squareEl);
    }

    boardEl.appendChild(rowEl);
  }
}

function onSquareClick(e) {
  const r = parseInt(e.currentTarget.dataset.row, 10);
  const c = parseInt(e.currentTarget.dataset.col, 10);
  const piece = boardState[r][c];

  if (selected) {
    const [sr, sc] = selected;
    const isLegal = legalMoves.some(([mr, mc]) => mr === r && mc === c);

    if (isLegal) {
      boardState[r][c] = boardState[sr][sc];
      boardState[sr][sc] = null;
      selected = null;
      legalMoves = [];
      turn = turn === "w" ? "b" : "w";
      render();
      return;
    }

    selected = null;
    legalMoves = [];
    render();
    return;
  }

  if (piece && piece.color === turn) {
    selected = [r, c];
    legalMoves = generateMoves(boardState, [r, c]);
    render();
  }
}

newGameBtn.addEventListener("click", () => {
  boardState = createInitialBoard();
  turn = "w";
  selected = null;
  legalMoves = [];
  render();
});

render();
