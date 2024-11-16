const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const NO_PERMISSION = 403;
const CONFLICT_ERROR = 409;
const UNAUTHORIZED = 401;
const OK_RESPONSE = 200;
const OK_CREATE = 201;

// custom error classes
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NO_PERMISSION;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}


module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  NO_PERMISSION,
  OK_RESPONSE,
  OK_CREATE,
  CONFLICT_ERROR,
  UNAUTHORIZED,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  UnauthorizedError
};