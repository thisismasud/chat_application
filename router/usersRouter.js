/**
 * Users router
 */

//external imports
const express = require("express");
const router = express.Router();

//internal imports
const {
  getUsers,
  addUser,
  removeUser,
} = require("../controller/usersController");

const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUpload");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/users/userValidators");
const { checkLogin } = require("../middlewares/common/checkLogin");

//get users page
router.get("/", decorateHtmlResponse("Users page"), checkLogin, getUsers);

//add user
router.post(
  "/",
  checkLogin,
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);

//delete user
router.delete("/:id", checkLogin, removeUser);

//exports
module.exports = router;
