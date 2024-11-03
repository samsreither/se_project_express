const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { PORT = 3001 } = process.env;
app.use(express.json());

// import routers
const usersRouter = require("./routes/users");
const mainRouter = require("./routes/index");
const clothingItemsRoutes = require("./routes/clothingItems");

// connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// route handlers
app.use("/users", usersRouter);
app.use("/clothingItems", clothingItemsRoutes);
app.use("/index", mainRouter);

// handle non-existent routes
app.use(notFoundHandler);

// global error handler
app.use(errorHandler);

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
