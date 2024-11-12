const winston = require('winston');
const expressWinston = require('express-winston');

// Define a custom message format
const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, meta, timestamp }) =>
    `${timestamp} ${level}: ${meta && meta.error ? meta.error.stack : message}`
  )
);

// Request logger: logs incoming requests
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: 'request.log',
      format: winston.format.json(),
    }),
  ],
});

// Error logger: logs errors encountered in the application
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};