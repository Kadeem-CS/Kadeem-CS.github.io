import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [history, setHistory] = useState([]);
  const [orientation, setOrientation] = useState("white");
  const [optionSquares, setOptionSquares] = useState({});
  const [captured, setCaptured] = useState([]);

  function safeGameMutate(modify) {
    const update = new Chess(game.fen());
    modify(update);
    setGame(update);
  }

  // Highlight moves
  function onSquareClick(square) {
    const moves = game.moves({
      square: square,
      verbose: true
    });

    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }

    const newSquares = {};
    moves.map(move => {
      newSquares[move.to] = {
        background:
          "radial-gradient(circle, rgba(0,0,0,.2) 25%, transparent 25%)",
        borderRadius: "50%"
      };
      return move;
    });

    setOptionSquares(newSquares);
  }

  // Make move
  function onPieceDrop(sourceSquare, targetSquare) {
    let move = null;

    safeGameMutate(game => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q"
      });
    });

    if (move === null) return false;

    setHistory(game.history());

    if (move.captured) {
      setCaptured(prev => [...prev, move.captured]);
    }

    setTimeout(makeRandomMove, 500);
    return true;
  }

  // AI random move
  function makeRandomMove() {
    const moves = game.moves();
    if (moves.length === 0) return;

    const move = moves[Math.floor(Math.random() * moves.length)];

    safeGameMutate(game => {
      game.move(move);
    });

    setHistory(game.history());
  }

  // Undo
  function undoMove() {
    safeGameMutate(game => {
      game.undo();
    });
    setHistory(game.history());
  }

  // Reset
  function resetGame() {
    setGame(new Chess());
    setHistory([]);
    setCaptured([]);
    setOptionSquares({});
  }

  // Flip board
  function flipBoard() {
    setOrientation(orientation === "white" ? "black" : "white");
  }

  // Check / Checkmate detection
  useEffect(() => {
    if (game.isCheckmate()) {
      alert("Checkmate!");
    } else if (game.isCheck()) {
      console.log("Check!");
    }
  }, [game]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div>
        <h2>React Chess Enhanced</h2>
        <h3>Turn: {game.turn() === "w" ? "White" : "Black"}</h3>

        <button onClick={resetGame}>Reset</button>
        <button onClick={undoMove}>Undo</button>
        <button onClick={flipBoard}>Flip</button>

        <Chessboard
          position={game.fen()}
          onPieceDrop={onPieceDrop}
          onSquareClick={onSquareClick}
          boardOrientation={orientation}
          customSquareStyles={optionSquares}
          animationDuration={200}
        />
      </div>

      <div>
        <h3>Move History</h3>
        {history.map((move, i) => (
          <div key={i}>{move}</div>
        ))}

        <h3>Captured Pieces</h3>
        <div>{captured.join(" ")}</div>
      </div>
    </div>
  );
}
