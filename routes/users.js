const router = require("express").Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');
const auth = require('../middlewares/auth');

// route to get current user's data (requires authorization)
router.get('/me',auth,getCurrentUser);
router.patch('/me', auth, updateProfile);

module.exports = router;