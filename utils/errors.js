const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error(err.stack);

  // Set the response status and send the error message
  res.status(err.status || 500).send({
      message: err.message || "Internal Server Error",
  });
};

// Middleware to handle 404 - Not Found
const notFoundHandler = (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};