const router = require('express').Router();
const clothingItems = require('./clothingItems');
const users = require('./users');
const { createUser, login } = require('../controllers/users');
const { NOT_FOUND } = require("../utils/errors");
const auth = require('../middlewares/auth');

// routes for signing up and signing in
router.post('/signup', createUser);
router.post('/signin', login);

router.get('/items', clothingItems); // GET /items does not require authorization

router.use(auth); // all routes below require authorization

// routes for items and users
router.use('/items', clothingItems); // POST/PUT/DELETE routes are protected
router.use('/users', users);

// handle unknown routes
router.use((req, res) => {
  res.status(NOT_FOUND).send({message: 'Router not found'})
})

module.exports = router;