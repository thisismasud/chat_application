/**
 * Title: Chat Application
 * Description: This is the index page, it contains and controll all the imports, connection, middlewares.
 * Author: Masud Parvez
 */

//expternal imports
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

//internal imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorhandler");
const loginRouter = require("./router/loginRouter");
const inboxRouter = require("./router/inboxRouter");
const usersRouter = require("./router/usersRouter");

const app = express();
require("dotenv").config();

//datbase connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("> Connected to database..."))
  .catch((err) =>
    console.log(`> Error while connecting to mongoDB : ${err.message}`)
  );

//request parses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//sets view engine
app.set("view engine", "ejs");

//sets static folder
app.use(express.static(path.join(__dirname, "public"))); //it sets up middleware to serve static files from the "public" directory

//parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

//routing setup
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

//404 not found handler
app.use(notFoundHandler);

//common error handler
app.use(errorHandler);

//start server
app.listen(process.env.PORT, () =>
  console.log("> Server is up and running on port : " + process.env.PORT)
);
