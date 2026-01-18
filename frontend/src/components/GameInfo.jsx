// frontend/src/components/GameInfo.jsx
import React from 'react';

const GameInfo = ({ player1, player2, currentPlayer }) => {
  return (
    <div className="game-info">
      <div className="players-info">
        <div className={`player ${currentPlayer === 'player1' ? 'current' : ''}`}>
          <strong>{player1.name}</strong>: {player1.score} очков
        </div>
        <div className={`player ${currentPlayer === 'player2' ? 'current' : ''}`}>
          <strong>{player2.name}</strong>: {player2.score} очков
        </div>
      </div>
      <div className="rules">
        <h3>Правила игры:</h3>
        <ul>
          <li>Шашки ходят по диагонали на одну клетку вперед</li>
          <li>Дамки могут ходить на любое количество клеток по диагонали</li>
          <li>Взятие обязательно - если есть возможность побить фигуру противника, нужно это сделать</li>
          <li>При достижении последней линии шашка становится дамкой</li>
        </ul>
      </div>
    </div>
  );
};

export default GameInfo;