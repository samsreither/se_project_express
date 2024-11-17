const router = require('express').Router();
const clothingItems = require('./clothingItems');
const users = require('./users');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { getItems } = require('../controllers/clothingItems');
const { validateUserBody, validateLoginBody } = require('../middlewares/validation');
const NotFoundError = require('../utils/NotFoundError');

// routes for signing up and signing in
router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateLoginBody, login);

router.get('/items', getItems); // GET /items does not require authorization

router.use(auth); // all routes below require authorization

// routes for items and users
router.use('/items', clothingItems); // POST/PUT/DELETE routes are protected
router.use('/users', users);

// handle unknown routes
router.use((req, res, next) => {
  next(new NotFoundError('Router not found'));
});

module.exports = router;