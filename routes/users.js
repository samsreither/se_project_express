const router = require("express").Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');

// import validation middleware
const {
  validateUpdateProfileBody,
} = require('../middlewares/validation');

// route to get current user's data (requires authorization)
router.get('/me', getCurrentUser);
router.patch('/me', validateUpdateProfileBody, updateProfile);

module.exports = router;