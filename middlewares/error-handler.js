// handle errors in a centralized way
function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500; // default code if no status code specified
  const message = err.message || "An unexpected error occurred";

  // send error response w/ status code and message
  res.status(statusCode).json({ message });
}

module.exports = errorHandler;