const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const { errors } = require('celebrate');
const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");

const { PORT = 3001 } = process.env;
const app = express();

// connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(requestLogger); // before all routes so every incoming request is logged
app.use("/", mainRouter);

app.use(errorLogger); // after routes but before error handlers to log errors that occur

// celebrate error handler
app.use(errors());

// centralized error-handling middleware
app.use(errorHandler);

// start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
