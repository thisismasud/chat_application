//external imports
const express = require("express");
const router = express.Router();

//internal imports
const { getLogin, login, logout } = require("../controller/loginController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const {
  doLoginValidators,
  doLoginValidationHandler,
} = require("../middlewares/login/loginValidator");
const { redirectLogin } = require("../middlewares/common/checkLogin");

//login page
router.get("/", decorateHtmlResponse("Login page"), redirectLogin, getLogin);

//request for login
router.post(
  "/",
  decorateHtmlResponse("Login Page"),
  doLoginValidators,
  doLoginValidationHandler,
  login
);

//request for logout
router.delete("/", logout);

//exports
module.exports = router;
