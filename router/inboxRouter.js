/**
 * Inbox router
 */

//external imports
const express = require("express");
const router = express.Router();

//internal imports
const {
  getInbox,
  searchUsers,
  addConversation,
  sendMessages,
  getMessages
} = require("../controller/inboxController");
const attachmentUpload = require("../middlewares/inbox/attachmentUpload");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const { checkLogin } = require("../middlewares/common/checkLogin");

//gets inbox page
router.get("/", decorateHtmlResponse("Inbox Page"), checkLogin, getInbox);

//search for user on inbox page
router.post("/search", checkLogin, searchUsers);

//add conversation
router.post("/conversation", checkLogin, addConversation);

//get all message
router.get('/message/:conversation_id', checkLogin, getMessages)

//send message
router.post("/message", checkLogin, attachmentUpload, sendMessages);

//exports
module.exports = router;

