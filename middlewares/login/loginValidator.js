//external imports
const { check, validationResult } = require("express-validator");

//validation of login field
const doLoginValidators = [
  check("username")
    .isLength({
      min: 1,
    })
    .withMessage("Email or Mobile number is required"),
  check("password")
    .isLength({
      min: 1,
    })
    .withMessage("Password is required"),
];

const doLoginValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped(errors);

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: mappedErrors,
    });
  }
};

//exports neccessary modules
module.exports = {
  doLoginValidators,
  doLoginValidationHandler,
};
