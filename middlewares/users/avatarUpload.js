//internal imports
const uploader = require("../../utilities/singleUploader");

//This is a middleware created to handle the file upload process

function avatarUpload(req, res, next) {
  const upload = uploader(
    "avatars",
    ["image/png", "image/jpeg", "image/jpg"],
    1000000,
    "Only .jpg, .jpeg and .png files are allowed"
  );

  //call the middleware function
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = avatarUpload;
