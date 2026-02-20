let history = [];
let future = [];

function saveState() {
  history.push(cloneBoard(boardState));
  future = [];
}

function undo() {
  if (history.length === 0) return;
  future.push(cloneBoard(boardState));
  boardState = history.pop();
  turn = turn === "w" ? "b" : "w";
  render();
}

function redo() {
  if (future.length === 0) return;
  history.push(cloneBoard(boardState));
  boardState = future.pop();
  turn = turn === "w" ? "b" : "w";
  render();
}
