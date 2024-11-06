const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config')
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");


// Get /users
const getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" })
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  console.log("Request body:", req.body);

  // check if all required fields are provided
  if (!email || !password || !name) {
    return res.status(BAD_REQUEST).send({ message: "Missing required fields: email, password, or name"});
  }

  // check if email already exists
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        // if email already exists, return a 409 conflict
        return res.status(409).send({ message: 'Email already in use'});
      }
      // hash the password
      return bcrypt.hash(password, 10)
    })
    .then((hashedPassword) =>
      User.create({
        name,
        avatar,
        email,
        password: hashedPassword,
      })
    )
    .then((user) => {
      // convert user document to a plain object and remove password field
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      return res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res.status(409).send({ message: "Email already exists"});
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message })
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
      });
    };

const login = (req, res) => {
  const { email, password} = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: "Email and password are required"});
  }

  // verify email and password
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Incorrect email or password' });
      }

      // compare password with stored hash
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).send({ message: 'Incorrect email or password' });
          }

          // generate a JWT token
          const token = jwt.sign({ _id: user._id}, JWT_SECRET, {
            expiresIn: '7d',
          });

          // send token in response body
          return res.send({ token });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: 'Server error' });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id; // get user ID from token payload

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }

      // return user data without password
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: 'Server error' });
    })
}

// update current user's profile
const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  // find the user by ID and update name and avatar
  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true } // ensure validation is run and return updated document
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'User not found' })
      }
      // remove password before returning updated user
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: 'Invalid data' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Server error'});
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
  getUser,
  login,
  getCurrentUser,
  updateProfile
};