// models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  player1Id: {
    type: String,
    required: true
  },
  player2Id: {
    type: String,
    default: null
  },
  gameMode: {
    type: String, // 'ai' или 'online'
    required: true
  },
  boardState: {
    type: [[Object]], // 8x8 двумерный массив для игрового поля
    required: true
  },
  currentPlayer: {
    type: String, // 'player1' или 'player2'
    required: true
  },
  moves: [{
    from: [Number], // [row, col]
    to: [Number],   // [row, col]
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  winner: {
    type: String,
    default: null
  },
  status: {
    type: String, // 'waiting', 'active', 'finished'
    default: 'waiting'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Обновляем время при каждом изменении
gameSchema.pre('save', function(next) {
  this.updatedAt = Date.now;
  next();
});

module.exports = mongoose.model('Game', gameSchema);