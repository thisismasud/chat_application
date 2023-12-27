const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const app = express();

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
app.use(express.static(path.join(__dirname, "public")));

//parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

//start server
app.listen(process.env.PORT, () =>
  console.log("> Server is up and running on port : " + process.env.PORT)
);
