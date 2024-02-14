//external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

//internal imports
const PeopleModel = require("../models/People");

//render login page
function getLogin(req, res, next) {
  res.render("index");
}

async function login(req, res, next) {
  try {
    //finds which user matches email or mobile on the username field
    const user = await PeopleModel.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    if (user && user._id) {
      //compare password
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      //checks if the password is valid
      if (isValidPassword) {
        const userObject = {
          userid: user._id,
          username: user.name,
          email: user.email, 
          avatar: user.avatar || null,
          role: user.role || "user",
        };

        //assign jwt
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRATION,
        });

        //set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRATION,
          httpOnly: true,
          signed: true,
        });

        //sets loggedin user in local indetifier
        res.locals.loggedInUser = userObject;

        //takes the loggedin user to the inbox page
        res.redirect("inbox");

        // res.json("login success");
      } else {
        throw createError("Login failed. Please try again");
      }
    } else {
      throw createError("Login failed. Please try again");
    }
  } catch (err) {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

function logout(req, res, next) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("Logged Out");
}

//exports module
module.exports = {
  getLogin,
  login,
  logout,
};
