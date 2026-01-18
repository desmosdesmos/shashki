// frontend/src/components/GameControls.jsx
import React from 'react';

const GameControls = ({ onReset, gameMode, onGameModeChange, aiDifficulty, onDifficultyChange }) => {
  return (
    <div className="game-controls">
      <button className="btn btn-primary" onClick={onReset}>
        Новая игра
      </button>
      <div className="mode-selector">
        <label>
          <input
            type="radio"
            name="gameMode"
            value="ai"
            checked={gameMode === 'ai'}
            onChange={() => onGameModeChange('ai')}
          />
          Против ИИ
        </label>
        <label>
          <input
            type="radio"
            name="gameMode"
            value="online"
            checked={gameMode === 'online'}
            onChange={() => onGameModeChange('online')}
          />
          Онлайн-игра
        </label>
      </div>
      {gameMode === 'ai' && (
        <div className="difficulty-selector">
          <label>Уровень сложности ИИ: </label>
          <select value={aiDifficulty} onChange={(e) => onDifficultyChange(e.target.value)}>
            <option value="easy">Легкий</option>
            <option value="medium">Средний</option>
            <option value="hard">Сложный</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default GameControls;