// controllers/gameController.js
const Game = require('../models/Game');

const createGame = async (req, res) => {
  try {
    const { player1Id, gameMode } = req.body;
    
    // Создаем новую игру
    const game = new Game({
      player1Id,
      gameMode, // 'ai' или 'online'
      boardState: initializeBoard(),
      currentPlayer: 'player1',
      status: 'waiting'
    });
    
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const makeMove = async (req, res) => {
  try {
    const { from, to } = req.body;
    const gameId = req.params.id;
    
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Проверяем, допустим ли ход
    if (!isValidMove(game.boardState, from, to, game.currentPlayer)) {
      return res.status(400).json({ message: 'Invalid move' });
    }
    
    // Выполняем ход
    const newBoardState = makeMoveOnBoard(game.boardState, from, to);
    
    // Обновляем состояние игры
    game.boardState = newBoardState;
    game.currentPlayer = game.currentPlayer === 'player1' ? 'player2' : 'player1';
    
    // Проверяем, завершена ли игра
    if (isGameOver(newBoardState, game.currentPlayer)) {
      game.status = 'finished';
      game.winner = game.currentPlayer === 'player1' ? 'player2' : 'player1';
    }
    
    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Вспомогательные функции
function initializeBoard() {
  // Инициализация стандартного положения шашек
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Расставляем черные шашки (игрок 1)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { type: 'man', player: 'player1' };
      }
    }
  }
  
  // Расставляем белые шашки (игрок 2)
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { type: 'man', player: 'player2' };
      }
    }
  }
  
  return board;
}

function isValidMove(board, from, to, currentPlayer) {
  // Проверка корректности хода
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  
  // Проверяем, что ячейки существуют
  if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7 ||
      toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
    return false;
  }
  
  // Проверяем, что в начальной ячейке есть фигура
  const piece = board[fromRow][fromCol];
  if (!piece || piece.player !== currentPlayer) {
    return false;
  }
  
  // Проверяем, что конечная ячейка пуста
  if (board[toRow][toCol]) {
    return false;
  }
  
  // Проверяем, что ход по диагонали
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);
  
  if (rowDiff !== colDiff) {
    return false;
  }
  
  // Проверяем, что расстояние соответствует типу фигуры
  if (piece.type === 'man') {
    // Обычная шашка может двигаться только на одну клетку вперед (для своего игрока)
    const direction = piece.player === 'player1' ? 1 : -1;
    
    if (rowDiff === 1 && toRow === fromRow + direction) {
      return true;
    }
    
    // Проверяем возможность взятия
    if (rowDiff === 2) {
      const middleRow = (fromRow + toRow) / 2;
      const middleCol = (fromCol + toCol) / 2;
      
      // Проверяем, есть ли противник в середине
      if (board[middleRow][middleCol] && board[middleRow][middleCol].player !== currentPlayer) {
        return true;
      }
    }
  } else if (piece.type === 'king') {
    // Дамка может двигаться на любое расстояние по диагонали
    // Но только если путь свободен
    const rowDir = toRow > fromRow ? 1 : -1;
    const colDir = toCol > fromCol ? 1 : -1;
    
    let r = fromRow + rowDir;
    let c = fromCol + colDir;
    
    // Подсчитываем количество фигур на пути
    let opponentPieces = [];
    while (r !== toRow && c !== toCol) {
      if (board[r][c]) {
        if (board[r][c].player === currentPlayer) {
          return false; // Нельзя перепрыгивать через свои фигуры
        } else {
          opponentPieces.push([r, c]);
        }
      }
      r += rowDir;
      c += colDir;
    }
    
    // При движении на несколько клеток возможно только взятие всех фигур на пути
    if (opponentPieces.length > 0) {
      // Для простоты разрешаем только один ход с взятием
      return opponentPieces.length === 1;
    }
    
    return true;
  }
  
  return false;
}

function makeMoveOnBoard(board, from, to) {
  const newBoard = board.map(row => [...row]);
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  
  // Перемещаем фигуру
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = null;
  
  // Проверяем возможность взятия
  const rowDiff = Math.abs(toRow - fromRow);
  if (rowDiff === 2 || (newBoard[toRow][toCol].type === 'king' && rowDiff > 2)) {
    // Находим и удаляем взятую фигуру
    const middleRow = (fromRow + toRow) / 2;
    const middleCol = (fromCol + toCol) / 2;
    newBoard[middleRow][middleCol] = null;
  }
  
  // Превращение в дамку
  if (newBoard[toRow][toCol].type === 'man') {
    if ((newBoard[toRow][toCol].player === 'player1' && toRow === 7) ||
        (newBoard[toRow][toCol].player === 'player2' && toRow === 0)) {
      newBoard[toRow][toCol].type = 'king';
    }
  }
  
  return newBoard;
}

function isGameOver(board, currentPlayer) {
  // Проверяем, остались ли у игрока фигуры
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] && board[row][col].player === currentPlayer) {
        // Если у игрока есть хотя бы одна фигура, проверим, может ли он сделать ход
        // Это упрощенная проверка - в реальном приложении нужно проверять все возможные ходы
        return false;
      }
    }
  }
  return true;
}

module.exports = {
  createGame,
  getGame,
  makeMove
};