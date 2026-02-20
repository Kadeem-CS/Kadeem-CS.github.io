// These variables come from main.js
// render.js must NOT redeclare them
// It simply uses them


function render() {
  boardEl.innerHTML = "";
  statusEl.textContent = gameOver
    ? statusEl.textContent
    : `Turn: ${turn === "w" ? "White" : "Black"}`;

  const status = getGameStatus(boardState, turn);
  if (status === "check") statusEl.textContent += " — Check!";
  if (status === "checkmate") {
    statusEl.textContent = `${turn === "w" ? "Black" : "White"} wins by checkmate`;
    gameOver = true;
  }
  if (status === "stalemate") {
    statusEl.textContent = "Stalemate — Draw";
    gameOver = true;
  }

  for (let r=0; r<8; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";

    for (let c=0; c<8; c++) {
      const squareEl = document.createElement("div");
      const isLight = (r + c) % 2 === 0;
      squareEl.className = "square " + (isLight ? "light" : "dark");
      squareEl.dataset.row = r;
      squareEl.dataset.col = c;

if (selected && selected[0] === r && selected[1] === c) {
  squareEl.classList.add("selected");
}

if (legalMoves.some(([lr, lc]) => lr === r && lc === c)) {
  squareEl.classList.add("legal");
}

      
      const piece = boardState[r][c];
      if (piece) {
        squareEl.textContent = PIECES[piece.color + piece.type];
        enableDrag(squareEl, r, c);
      }

      squareEl.addEventListener("click", onSquareClick);

      rowEl.appendChild(squareEl);
    }

    boardEl.appendChild(rowEl);
  }
}
