const NO_PERMISSION = 403;

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NO_PERMISSION;
  }
}

module.exports = ForbiddenError;