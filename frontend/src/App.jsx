// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import CheckersBoard from './components/CheckersBoard';
import GameControls from './components/GameControls';
import GameInfo from './components/GameInfo';
import InviteSection from './components/InviteSection';
import { initializeTGWebApp, expandApp } from './utils/tgIntegration';
import { getBestMove } from './utils/ai';

const App = () => {
  const [gameState, setGameState] = useState({
    board: [],
    currentPlayer: 'player1',
    selectedPiece: null,
    validMoves: [],
    gameStatus: 'waiting', // 'waiting', 'active', 'finished'
    winner: null,
    player1: { name: 'Player 1', score: 0 },
    player2: { name: 'AI/Player 2', score: 0 }
  });

  const [gameMode, setGameMode] = useState('ai'); // 'ai' или 'online'
  const [aiDifficulty, setAiDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
  const [roomId, setRoomId] = useState(null);
  const [isTgReady, setIsTgReady] = useState(false);

  // Инициализация Telegram Web App
  useEffect(() => {
    initializeTGWebApp();

    // Если мы в Telegram Web App, ждем готовности
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      setIsTgReady(true);

      // Устанавливаем цвет фона
      document.body.style.backgroundColor = '#f0f0f0';

      // Расширяем приложение на весь экран
      setTimeout(expandApp, 500);
    } else {
      setIsTgReady(true); // Если не в TG, просто помечаем как готовое
    }
  }, []);

  // Инициализация доски
  useEffect(() => {
    if (isTgReady) {
      resetGame();
    }
  }, [isTgReady]);

  const resetGame = () => {
    // Инициализация стандартного положения шашек
    const newBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Расставляем черные шашки (игрок 1)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          newBoard[row][col] = { type: 'man', player: 'player1' };
        }
      }
    }
    
    // Расставляем белые шашки (игрок 2)
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          newBoard[row][col] = { type: 'man', player: 'player2' };
        }
      }
    }
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: 'player1',
      selectedPiece: null,
      validMoves: [],
      gameStatus: 'active',
      winner: null
    }));
  };

  const selectPiece = (row, col) => {
    // Проверяем, есть ли фигура в выбранной клетке
    const piece = gameState.board[row][col];
    if (!piece || piece.player !== gameState.currentPlayer) {
      return;
    }

    // Находим возможные ходы для выбранной фигуры
    const moves = calculateValidMoves(row, col, gameState.board);
    
    setGameState(prev => ({
      ...prev,
      selectedPiece: { row, col },
      validMoves: moves
    }));
  };

  const movePiece = (fromRow, fromCol, toRow, toCol) => {
    const newBoard = gameState.board.map(r => [...r]);
    const piece = newBoard[fromRow][fromCol];
    
    // Перемещаем фигуру
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    
    // Проверяем возможность взятия
    const rowDiff = Math.abs(toRow - fromRow);
    if (rowDiff === 2) {
      // Находим и удаляем взятую фигуру
      const middleRow = (fromRow + toRow) / 2;
      const middleCol = (fromCol + toCol) / 2;
      newBoard[middleRow][middleCol] = null;
    }
    
    // Превращение в дамку
    if (piece.type === 'man') {
      if ((piece.player === 'player1' && toRow === 7) ||
          (piece.player === 'player2' && toRow === 0)) {
        newBoard[toRow][toCol].type = 'king';
      }
    }
    
    // Меняем текущего игрока
    const nextPlayer = gameState.currentPlayer === 'player1' ? 'player2' : 'player1';
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedPiece: null,
      validMoves: []
    }));
    
    // Если режим игры с ИИ и следующий игрок - ИИ, делаем ход за ИИ
    if (gameMode === 'ai' && nextPlayer === 'player2') {
      setTimeout(makeAIMove, 500);
    }
  };

  const calculateValidMoves = (row, col, board) => {
    const piece = board[row][col];
    if (!piece) return [];
    
    const moves = [];
    const directions = [];
    
    // Определяем направления движения в зависимости от типа фигуры
    if (piece.type === 'man') {
      const direction = piece.player === 'player1' ? 1 : -1;
      directions.push([direction, -1], [direction, 1]); // Только вперед
    } else if (piece.type === 'king') {
      // Дамка может двигаться во всех диагональных направлениях
      directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
    }
    
    // Проверяем каждый возможный ход
    for (const [dRow, dCol] of directions) {
      // Проверяем обычный ход на одну клетку
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && !board[newRow][newCol]) {
        moves.push([newRow, newCol]);
      }
      
      // Проверяем возможность взятия
      const jumpRow = row + dRow * 2;
      const jumpCol = col + dCol * 2;
      
      if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8) {
        const middlePiece = board[row + dRow][col + dCol];
        if (middlePiece && middlePiece.player !== piece.player && !board[jumpRow][jumpCol]) {
          moves.push([jumpRow, jumpCol]);
        }
      }
    }
    
    return moves;
  };

  const makeAIMove = () => {
    // Используем продвинутый ИИ для выбора лучшего хода
    const bestMove = getBestMove(gameState.board, 'player2', aiDifficulty);

    if (bestMove) {
      const [fromRow, fromCol] = bestMove.from;
      const [toRow, toCol] = bestMove.to;
      movePiece(fromRow, fromCol, toRow, toCol);
    } else {
      // Если нет допустимых ходов, игра заканчивается
      setGameState(prev => ({
        ...prev,
        gameStatus: 'finished',
        winner: 'player1' // Предполагаем, что игрок 1 побеждает
      }));
    }
  };

  const handleSquareClick = (row, col) => {
    if (gameState.gameStatus !== 'active') return;
    
    // Если кликнули на клетку с допустимым ходом
    const isValidMove = gameState.validMoves.some(([r, c]) => r === row && c === col);
    if (isValidMove && gameState.selectedPiece) {
      movePiece(gameState.selectedPiece.row, gameState.selectedPiece.col, row, col);
      return;
    }
    
    // Если кликнули на другую фигуру того же игрока
    const piece = gameState.board[row][col];
    if (piece && piece.player === gameState.currentPlayer) {
      selectPiece(row, col);
      return;
    }
    
    // Снимаем выделение, если кликнули мимо
    if (gameState.selectedPiece) {
      setGameState(prev => ({
        ...prev,
        selectedPiece: null,
        validMoves: []
      }));
    }
  };

  // Показываем сообщение о загрузке, пока не готово
  if (!isTgReady) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0'
      }}>
        <p>Загрузка приложения...</p>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">Шашки</h1>
        <p className="game-status">
          {gameState.gameStatus === 'active'
            ? `Ход: ${gameState.currentPlayer === 'player1' ? gameState.player1.name : gameState.player2.name}`
            : gameState.gameStatus === 'finished'
              ? `Победитель: ${gameState.winner === 'player1' ? gameState.player1.name : gameState.player2.name}`
              : 'Ожидание начала игры'}
        </p>
      </div>

      <CheckersBoard
        board={gameState.board}
        selectedPiece={gameState.selectedPiece}
        validMoves={gameState.validMoves}
        onClick={handleSquareClick}
      />

      <GameControls
        onReset={resetGame}
        gameMode={gameMode}
        onGameModeChange={setGameMode}
        aiDifficulty={aiDifficulty}
        onDifficultyChange={setAiDifficulty}
      />

      <GameInfo
        player1={gameState.player1}
        player2={gameState.player2}
        currentPlayer={gameState.currentPlayer}
      />

      {gameMode === 'online' && (
        <InviteSection roomId={roomId} />
      )}
    </div>
  );
};

export default App;