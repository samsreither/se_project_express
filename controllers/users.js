const User = require('../models/user');
const mongoose = require("mongoose");

// Get /users
const getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: err.message })
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  // if (!name || name.length <2) {
  //   return res.status(400).send({message: "Name must be at least 2 characters long"})
  // }

  User.create({ name, avatar })
  .then((user) => res.status(201).send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      res.status(400).send({ message: err.message })
    } else {
      res.status(500).send({ message: err.message })
    }
  });
}

// GET /users - returns all users
const getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({message: "Invalid user ID format"});
  }

  User.findById(userId)
  .then((user) => {
    if (!user) {
      return res.status(404).send({message: "User not found." });
    }
    res.status(200).send(user);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send({ message: err.message });
  });
}

module.exports = {
  getUsers,
  createUser,
  getUser
};