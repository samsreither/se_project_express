const mongoose = require("mongoose");
const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");


// Get /users
const getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" })
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
  .then((user) => res.status(201).send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      res.status(BAD_REQUEST).send({ message: err.message })
    } else {
      res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" })
    }
  });
}

// GET /users - returns all users
const getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(BAD_REQUEST).send({message: "Invalid user ID format"});
  }

  return User.findById(userId)
  .then((user) => {
    if (!user) {
      return res.status(NOT_FOUND).send({message: "User not found." });
    }
    return res.status(200).send(user);
  })
  .catch((err) => {
    console.error(err);
    return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
  });
}

module.exports = {
  getUsers,
  createUser,
  getUser
};