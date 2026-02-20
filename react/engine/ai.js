function getAllMoves(board, color) {
  const moves = [];

  for (let r=0; r<8; r++) {
    for (let c=0; c<8; c++) {
      const p = board[r][c];
      if (p && p.color === color) {
        const legal = getLegalMoves(board, [r,c]);
        legal.forEach(move => moves.push({ from:[r,c], to:move }));
      }
    }
  }

  return moves;
}

function aiMove() {
  const moves = getAllMoves(boardState, "b");
  if (moves.length === 0) return;

  const choice = moves[Math.floor(Math.random() * moves.length)];
  applyMove(choice.from, choice.to);
}
