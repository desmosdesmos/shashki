const express = require('express');
const { getUserById, createUser } = require('../controllers/userController');
const router = express.Router();

router.route('/:id').get(getUserById);
router.route('/').post(createUser);

module.exports = router;