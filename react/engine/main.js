let boardState = createInitialBoard();
let turn = "w";
let selected = null;
let legalMoves = [];
let gameOver = false;

function applyMove(from, to) {
  saveState();

  boardState = makeMove(boardState, from, to);
  selected = null;
  legalMoves = [];
  turn = turn === "w" ? "b" : "w";

  render();

  if (!gameOver && aiEnabled && turn === "b") {
    setTimeout(aiMove, 300);
  }
}

function onSquareClick(e) {
  if (gameOver) return;

  const r = parseInt(e.currentTarget.dataset.row);
  const c = parseInt(e.currentTarget.dataset.col);
  const piece = boardState[r][c];

  if (selected) {
    const isLegal = legalMoves.some(([lr,lc]) => lr===r && lc===c);
    if (isLegal) {
      applyMove(selected, [r,c]);
      return;
    }
    selected = null;
    legalMoves = [];
    render();
    return;
  }

  if (piece && piece.color === turn) {
    selected = [r,c];
    legalMoves = getLegalMoves(boardState, [r,c]);
    render();
  }
}

let aiEnabled = false;

document.getElementById("aiBtn").onclick = () => {
  aiEnabled = !aiEnabled;
  document.getElementById("aiBtn").textContent =
    aiEnabled ? "AI: ON" : "AI: OFF";
};

document.getElementById("undoBtn").onclick = undo;
document.getElementById("redoBtn").onclick = redo;

document.getElementById("newGameBtn").onclick = () => {
  boardState = createInitialBoard();
  history = [];
  future = [];
  turn = "w";
  selected = null;
  legalMoves = [];
  gameOver = false;
  render();
};

render();
