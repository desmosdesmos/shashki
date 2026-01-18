// frontend/src/utils/ai.js
// Алгоритм ИИ для игры в шашки

// Оценочная функция для позиции на доске
const evaluatePosition = (board, player) => {
  let score = 0;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        // Основная ценность - количество фигур
        if (piece.player === player) {
          score += piece.type === 'man' ? 10 : 20; // шашка = 10, дамка = 20
        } else {
          score -= piece.type === 'man' ? 10 : 20;
        }
        
        // Позиционная оценка - центральные клетки более ценные
        if (piece.player === player) {
          if ((row === 2 || row === 3 || row === 4 || row === 5) && 
              (col === 2 || col === 3 || col === 4 || col === 5)) {
            score += 2; // центральные клетки
          }
          
          // Крайние ряды для обычных шашек менее желательны
          if (piece.type === 'man') {
            if (row === 0 || row === 7) {
              score -= 1;
            }
          }
        } else {
          if ((row === 2 || row === 3 || row === 4 || row === 5) && 
              (col === 2 || col === 3 || col === 4 || col === 5)) {
            score -= 2;
          }
          
          if (piece.type === 'man') {
            if (row === 0 || row === 7) {
              score += 1;
            }
          }
        }
      }
    }
  }
  
  return score;
};

// Генерация всех возможных ходов для игрока
const getAllPossibleMoves = (board, player) => {
  const moves = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.player === player) {
        // Находим возможные ходы для этой фигуры
        const pieceMoves = getPossibleMovesForPiece(board, row, col);
        for (const move of pieceMoves) {
          moves.push({
            from: [row, col],
            to: move
          });
        }
      }
    }
  }
  
  return moves;
};

// Получение возможных ходов для конкретной фигуры
const getPossibleMovesForPiece = (board, fromRow, fromCol) => {
  const piece = board[fromRow][fromCol];
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
    const newRow = fromRow + dRow;
    const newCol = fromCol + dCol;
    
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && !board[newRow][newCol]) {
      moves.push([newRow, newCol]);
    }
    
    // Проверяем возможность взятия
    const jumpRow = fromRow + dRow * 2;
    const jumpCol = fromCol + dCol * 2;
    
    if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8) {
      const middlePiece = board[fromRow + dRow][fromCol + dCol];
      if (middlePiece && middlePiece.player !== piece.player && !board[jumpRow][jumpCol]) {
        moves.push([jumpRow, jumpCol]);
      }
    }
  }
  
  return moves;
};

// Клонирование доски
const cloneBoard = (board) => {
  return board.map(row => [...row]);
};

// Выполнение хода на доске
const makeMove = (board, fromRow, fromCol, toRow, toCol) => {
  const newBoard = cloneBoard(board);
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
  
  return newBoard;
};

// Минимакс алгоритм
const minimax = (board, depth, isMaximizing, player, alpha, beta) => {
  if (depth === 0) {
    return evaluatePosition(board, player);
  }
  
  const moves = getAllPossibleMoves(board, isMaximizing ? player : (player === 'player1' ? 'player2' : 'player1'));
  
  if (moves.length === 0) {
    // Нет возможных ходов
    if (isMaximizing) {
      return -Infinity; // Поражение для максимизирующего игрока
    } else {
      return Infinity; // Победа для минимизирующего игрока
    }
  }
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const [fromRow, fromCol] = move.from;
      const [toRow, toCol] = move.to;
      const newBoard = makeMove(board, fromRow, fromCol, toRow, toCol);
      const evaluation = minimax(newBoard, depth - 1, false, player, alpha, beta);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break; // Альфа-бета отсечение
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const [fromRow, fromCol] = move.from;
      const [toRow, toCol] = move.to;
      const newBoard = makeMove(board, fromRow, fromCol, toRow, toCol);
      const evaluation = minimax(newBoard, depth - 1, true, player, alpha, beta);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break; // Альфа-бета отсечение
      }
    }
    return minEval;
  }
};

// Выбор лучшего хода для ИИ
export const getBestMove = (board, player, difficulty = 'medium') => {
  const moves = getAllPossibleMoves(board, player);
  
  if (moves.length === 0) {
    return null;
  }
  
  // Определяем глубину поиска в зависимости от сложности
  let depth;
  switch (difficulty) {
    case 'easy':
      depth = 2;
      break;
    case 'medium':
      depth = 4;
      break;
    case 'hard':
      depth = 6;
      break;
    default:
      depth = 4;
  }
  
  let bestMove = moves[0];
  let bestValue = -Infinity;
  
  for (const move of moves) {
    const [fromRow, fromCol] = move.from;
    const [toRow, toCol] = move.to;
    const newBoard = makeMove(board, fromRow, fromCol, toRow, toCol);
    const value = minimax(newBoard, depth - 1, false, player, -Infinity, Infinity);
    
    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
  }
  
  return bestMove;
};