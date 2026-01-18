// controllers/userController.js
const User = require('../models/User');

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName } = req.body;
    
    // Проверяем, существует ли уже пользователь
    let user = await User.findOne({ telegramId });
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Создаем нового пользователя
    user = new User({
      telegramId,
      username,
      firstName,
      lastName
    });
    
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserById,
  createUser
};