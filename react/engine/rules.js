function findKing(board, color) {
  for (let r=0; r<8; r++) {
    for (let c=0; c<8; c++) {
      const p = board[r][c];
      if (p && p.type === "K" && p.color === color) return [r,c];
    }
  }
  return null;
}

function isSquareAttacked(board, square, byColor) {
  const [kr, kc] = square;

  for (let r=0; r<8; r++) {
    for (let c=0; c<8; c++) {
      const p = board[r][c];
      if (p && p.color === byColor) {
        const moves = generateMoves(board, [r,c]);
        if (moves.some(([mr,mc]) => mr===kr && mc===kc)) return true;
      }
    }
  }
  return false;
}

function makeMove(board, from, to) {
  const newBoard = cloneBoard(board);
  const [fr, fc] = from;
  const [tr, tc] = to;
  newBoard[tr][tc] = newBoard[fr][fc];
  newBoard[fr][fc] = null;
  return newBoard;
}

function getLegalMoves(board, from) {
  const piece = board[from[0]][from[1]];
  if (!piece) return [];

  const pseudo = generateMoves(board, from);
  const legal = [];

  for (const move of pseudo) {
    const newBoard = makeMove(board, from, move);
    const kingPos = findKing(newBoard, piece.color);
    if (!isSquareAttacked(newBoard, kingPos, piece.color === "w" ? "b" : "w")) {
      legal.push(move);
    }
  }

  return legal;
}

function getGameStatus(board, turn) {
  const kingPos = findKing(board, turn);
  const inCheck = isSquareAttacked(board, kingPos, turn === "w" ? "b" : "w");

  let hasMoves = false;
  for (let r=0; r<8; r++) {
    for (let c=0; c<8; c++) {
      const p = board[r][c];
      if (p && p.color === turn) {
        if (getLegalMoves(board, [r,c]).length > 0) {
          hasMoves = true;
          break;
        }
      }
    }
  }

  if (!hasMoves) {
    return inCheck ? "checkmate" : "stalemate";
  }

  return inCheck ? "check" : "normal";
}
