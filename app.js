//-- Get env values
require("dotenv").config();

//-- Express / Middlewares
const express = require("express");
const app = express();
app.use(express.json());

//-- Routes
const wordsRouter = require("./routes/wordRoutes");
const userRouter = require("./routes/userRoutes");
app.use("/api/v1/words", wordsRouter);
app.use("/api/v1/users", userRouter);

//-- Connect to database
const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, { dbName: "WordsAPI" })
  .then(console.log("Connected to database successfully ✅"));

//-- Global Error Handler
const globalErrorHandler = require("./errors/globalErrorHandler");
app.use(globalErrorHandler);

//-- Server Starts
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening to the port ${port} ♨️`);
});
