//external imports
const createError = require("http-errors");

//internal imports
const PeopleModel = require("../models/People");
const ConversationModel = require("../models/conversation");
const MessageModel = require("../models/message");

//neccessary utilities - internal imports
const escape = require("../utilities/escape");

//get inbox page
async function getInbox(req, res, next) {
  try {
    const conversation = await ConversationModel.find({
      $or: [
        { "creator.id": req.user.userid },
        { "participant.id": req.user.userid },
      ],
    }).sort("-createdAt");;
    res.locals.data = conversation;
    res.render("inbox");
  } catch (err) {
    next(err);
  }
}

//search for user
async function searchUsers(req, res, next) {
  const user = req.body.user;
  const searchQuery = user.replace("+88", "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

  try {
    if (searchQuery !== "") {
      const users = await PeopleModel.find(
        {
          $or: [
            {
              name: name_search_regex,
            },
            {
              mobile: mobile_search_regex,
            },
            {
              email: email_search_regex,
            },
          ],
        },
        "name avatar"
      );
      res.json(users);
    } else {
      throw createError(
        "You must provide a name or a email or a mobile number"
      );
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

//add conversation  after search
async function addConversation(req, res, next) {
  try {
    const newConversation = new ConversationModel({
      creator: {
        id: req.user.userid,
        name: req.user.username,
        avatar: req.user.avatar || null,
      },
      participant: {
        id: req.body.id,
        name: req.body.participant,
        avatar: req.body.avatar || null,
      },
    });

    const result = await ConversationModel.create(newConversation);
    res.status(200).json({
      msg: "Conversation created successfully",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Couldn't create conversation",
        },
      },
    });
  }
}

//get messages from database
async function getMessages(req, res, next) {
  try {
    const messages = await MessageModel.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = await ConversationModel.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error",
        },
      },
    });
  }
}

async function sendMessages(req, res, next) {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      //save text/message in database
      let attachments = null;

      if (req.files && req.files.length > 0) {
        attachments = [];

        req.files.forEach((file) => {
          attachments.push(file.filename);
        });
      }

      const newMessage = new MessageModel({
        text: req.body.message,
        attachment: attachments,
        sender: {
          id: req.user.userid,
          name: req.user.username,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });

      const result = await MessageModel.create(newMessage);

      //emit socket event
      global.io.emit("new_message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: req.user.userid,
            name: req.user.username,
            avatar: req.user.avatar || null,
          },
          message: req.body.message,
          attachment: attachments,
          date_time: result.date_time,
        },
      });
      res.status(200).json({
        message: "Successfull",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        errors: {
          common: err.message,
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: "Text message or attachment is required",
      },
    });
  }
}

//exports module
module.exports = {
  getInbox,
  searchUsers,
  addConversation,
  sendMessages,
  getMessages,
};
