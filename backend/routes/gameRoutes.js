const express = require('express');
const { createGame, getGame, makeMove } = require('../controllers/gameController');
const router = express.Router();

router.route('/').post(createGame);
router.route('/:id').get(getGame).put(makeMove);

module.exports = router;