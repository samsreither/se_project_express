const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config')
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, OK_RESPONSE, OK_CREATE, CONFLICT_ERROR, UNAUTHORIZED, BadRequestError, ConflictError, UnauthorizedError, NotFoundError } = require("../utils/errors");

// POST /users
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // check if all required fields are provided
  if (!email || !password || !name) {
    return next(new BadRequestError("Missing required fields: email, password, or name"));
  }

  // check if email already exists
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        // if email already exists, return a 409 conflict here
        throw new ConflictError("Email already in use");
      }
      // hash the password
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      return User.create({
        name,
        avatar,
        email,
        password: hashedPassword,
      });
    })
    .then((user) => {
      // convert user document to a plain object and remove password field
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return res.status(OK_CREATE).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      next(err);
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
        throw new UnauthorizedError("Incorrect email or password");
      }

      // compare password with stored hash
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            throw new UnauthorizedError("Incorrect email or password")
          }

          // generate a JWT token
          const token = jwt.sign({ _id: user._id}, JWT_SECRET, {
            expiresIn: '7d',
          });

          // send token in response body
          return res.send({ token });
        });
    })
    .catch(next);
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id; // get user ID from token payload

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }

      // return user data without password
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      return res.status(OK_RESPONSE).send(userWithoutPassword);
    })
    .catch(next);
}

// update current user's profile
const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  console.log('req.body',req.body);
  const userId = req.user._id;

  // find the user by ID and update name and avatar
  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true } // ensure validation is run and return updated document
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      // remove password before returning updated user
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      return res.status(OK_RESPONSE).send(userWithoutPassword);
    })
    .catch(next);
}

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile
};