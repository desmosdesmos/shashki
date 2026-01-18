// frontend/src/components/CheckersBoard.jsx
import React from 'react';

const CheckersBoard = ({ board, selectedPiece, validMoves, onClick }) => {
  const isSquareSelected = (row, col) => {
    return selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
  };

  const isValidMove = (row, col) => {
    return validMoves.some(([r, c]) => r === row && c === col);
  };

  const getSquareClass = (row, col) => {
    let classes = ['square'];
    if ((row + col) % 2 === 0) {
      classes.push('light-square');
    } else {
      classes.push('dark-square');
    }
    
    if (isSquareSelected(row, col)) {
      classes.push('selected');
    }
    
    if (isValidMove(row, col)) {
      classes.push('valid-move');
    }
    
    return classes.join(' ');
  };

  return (
    <div className="checkers-board">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={getSquareClass(rowIndex, colIndex)}
            onClick={() => onClick(rowIndex, colIndex)}
          >
            {piece && (
              <div
                className={`piece player${piece.player === 'player1' ? 1 : 2} ${
                  piece.type === 'king' ? 'king' : ''
                }`}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CheckersBoard;