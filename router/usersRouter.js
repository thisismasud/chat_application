/**
 * Users router
 */

//external imports
const express = require("express");
const router = express.Router();

//internal imports
const usersController = require("../controller/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");

//login page
router.get("/", decorateHtmlResponse("Users page"), usersController.getUsers);

//exports
module.exports = router;
