const express = require("express");
const mongoose = require("mongoose");

const mainRouter = require("./routes/index");

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

// middleware to mock user ID to every request
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // replace this with your test user's _id
  };
  next();
});

app.use(express.json());
app.use("/", mainRouter);

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("This is working")
});
