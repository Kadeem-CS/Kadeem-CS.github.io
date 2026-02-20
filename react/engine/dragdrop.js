let dragging = null;

function enableDrag(squareEl, r, c) {
  squareEl.draggable = true;

  squareEl.addEventListener("dragstart", () => {
    dragging = [r, c];
  });

  squareEl.addEventListener("dragend", () => {
    dragging = null;
  });
}

boardEl.addEventListener("dragover", e => e.preventDefault());

boardEl.addEventListener("drop", e => {
  if (!dragging) return;

  const rect = boardEl.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const r = Math.floor(y / 64);
  const c = Math.floor(x / 64);

  const legal = getLegalMoves(boardState, dragging);
  if (legal.some(([lr,lc]) => lr===r && lc===c)) {
    applyMove(dragging, [r,c]);
  }

  dragging = null;
});
