const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { name, avatar } = req.body;

  // Create a new User instance
  const user = new User({ name, avatar });

  try {
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      // Handle validation errors specifically
      return res.status(BAD_REQUEST).json({ message: "Invalid data passed for user creation" });
    }
    // Handle any other errors
    res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
  }
};

// Get a user by ID
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.status = NOT_FOUND;
      throw error;
    })
    .then(user => res.json(user))
    .catch(err => {
      console.error(err);
      if (err.status === NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      return res.status(SERVER_ERROR).json({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
};