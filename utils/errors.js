const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).send({
      message: err.message || "Internal Server Error",
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
};

module.exports = {
  errorHandler,
  notFoundHandler,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
};