const router = require("express").Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');

// route to get current user's data (requires authorization)
router.get('/me', getCurrentUser);
router.patch('/me', updateProfile);

module.exports = router;