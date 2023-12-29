/**
 * Inbox router
 */

//external imports
const express = require("express");
const router = express.Router();

//internal imports
const inboxController = require("../controller/inboxController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");



//login page
router.get("/", decorateHtmlResponse("Inbox Page"), inboxController.getInbox);

//exports
module.exports = router;
