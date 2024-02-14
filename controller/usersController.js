//external imports
const bcrypt = require("bcrypt");
const path = require("path");
const { unlink } = require("fs");

//internal imports
const PeopleModel = require("../models/People");

//get users page
async function getUsers(req, res, next) {
  try {
    const users = await PeopleModel.find({});
    res.render("users", {
      users: users,
    });
  } catch (err) {
    next(err);
  }
}

//add user
async function addUser(req, res, next) {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files && req.files.length > 0) {
    newUser = new PeopleModel({
      ...req.body,
      avatar: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new PeopleModel({
      ...req.body,
      password: hashedPassword,
    });
  }

  try {
    const result = await PeopleModel.create(newUser);
    res.status(200).json({
      message: "User added successfully",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured",
        },
      },
    });
  }
}

//remove user
async function removeUser(req, res, next) {
  try {
    let id = req.params.id;
    const user = await PeopleModel.findByIdAndDelete({ _id: id });

    //remove user avatar if any
    if (user.avatar) {
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }
    res.status(200).json({
      message: "User removed successfully",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user",
        },
      },
    });
  }
}

module.exports = {
  getUsers,
  addUser,
  removeUser,
};
