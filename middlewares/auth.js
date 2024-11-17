const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const UnauthorizedError = require('../utils/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // check if authorization header exists and starts with "Bearer "
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization required');
  }

  // extract token from authorization header
  const token = authorization.replace("Bearer ", "");

  try {
    // verify the token and attach payload to request object
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // attach payload to req.user
    return next(); // move to next middleware or route handler
  } catch (err) {
    // send 401 unauthorized response if verification fails
    throw new UnauthorizedError('Invalid token');
  }
};

module.exports = auth;