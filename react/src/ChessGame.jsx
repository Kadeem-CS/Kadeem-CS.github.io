
import React, { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [fenHistory, setFenHistory] = useState([game.fen()]);
  const [step, setStep] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState(null);

  function makeMove(move) {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    if (!result) return false;

    setGame(gameCopy);
    const newHistory = fenHistory.slice(0, step + 1);
    newHistory.push(gameCopy.fen());
    setFenHistory(newHistory);
    setStep(newHistory.length - 1);

    setSelectedSquare(null);
    return true;
  }

  function onDrop(source, target) {
    return makeMove({ from: source, to: target, promotion: "q" });
  }

  function undo() {
    if (step === 0) return;
    const newStep = step - 1;
    const gameCopy = new Chess(fenHistory[newStep]);
    setGame(gameCopy);
    setStep(newStep);
  }

  function redo() {
    if (step === fenHistory.length - 1) return;
    const newStep = step + 1;
    const gameCopy = new Chess(fenHistory[newStep]);
    setGame(gameCopy);
    setStep(newStep);
  }

  function getLegalSquares(square) {
    const moves = game.moves({ square, verbose: true });
    const styles = {};
    moves.forEach((m) => {
      styles[m.to] = {
        background:
          "radial-gradient(circle, rgba(0,0,0,0.4) 25%, transparent 26%)",
      };
    });
    return styles;
  }

  const customSquareStyles = selectedSquare
    ? getLegalSquares(selectedSquare)
    : {};

  return (
    <div className="game-container">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        onSquareClick={(square) => setSelectedSquare(square)}
        customSquareStyles={customSquareStyles}
        boardWidth={420}
      />

      <div className="side-panel">
        <div className="status">
          {game.isCheckmate() && "✅ Checkmate"}
          {game.isStalemate() && "🤝 Stalemate"}
          {game.inCheck() && "⚠ Check"}
        </div>

        <div className="buttons">
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>
        </div>

        <div className="history">
          <h3>Moves</h3>
          <ol>
            {game.history().map((move, i) => (
              <li key={i}>{move}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
