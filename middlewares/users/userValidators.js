/**
 * Title: User information validation handler
 * Description: There are two middleware 1. addUservalidators, which one validates if the information provided by a new user is valid or not, in this case we used express-validator.
 * Express Validator github Documentation: https://github.com/validatorjs/validator.js
 * Author: Masud Parvez
 */

//external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

//internal imports
const PeopleModel = require("../../models/People");

//this addUserValidators gets validated and sanitizes data of following fields: name, email, mobile, password
const addUserValidators = [
  //validates name
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is Required")
    .isAlpha("en-US", { ignore: "-" })
    .withMessage("Name must not contain anything other than Alphabet")
    .trim(),

  //validates email
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const alreadyExistUserData = await PeopleModel.findOne({
          email: value,
        });
        if (alreadyExistUserData) {
          throw createError("Email address already exists");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),

  //validates mobile number
  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Mobile number must be a Bangladeshi number")
    .custom(async (value) => {
      try {
        const alreadyExistUserData = await PeopleModel.findOne({
          mobile: value,
        });
        if (alreadyExistUserData) {
          throw createError("Mobile number already exists");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),

  //validates password
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long and should contain at lease 1 uppercase, 1 lowercase, 1 number and 1 symbol"
    ),
];

//This middleware (addUserValidationHandler) is responsible to catch any error happend in addUserValidators middleware. If there is an error, it will delete the uploaded avatar file.
const addUserValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped(errors);

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    if (req.files && req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../../public/uploads/avatars/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    } else {
      res.status(500).json({
        errors: mappedErrors,
      });
    }
  }
};

//exports neccessary modules
module.exports = {
  addUserValidators,
  addUserValidationHandler,
};
