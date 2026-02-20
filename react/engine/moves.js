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
  }

  if (type === "N") {
    const deltas = [
      [2,1],[2,-1],[-2,1],[-2,-1],
      [1,2],[1,-2],[-1,2],[-1,-2]
    ];
    deltas.forEach(([dr,dc]) => add(fr+dr, fc+dc));
  }

  if (type === "B" || type === "R" || type === "Q") {
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
  }

  if (type === "K") {
    for (let dr=-1; dr<=1; dr++) {
      for (let dc=-1; dc<=1; dc++) {
        if (dr===0 && dc===0) continue;
        add(fr+dr, fc+dc);
      }
    }
  }

  return moves;
}
