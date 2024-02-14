//internal imports
const uploader = require("../../utilities/multipleUploader");

//This is a middleware created to handle the file upload process

function attachmentUpload(req, res, next) {
  const upload = uploader(
    "attachments",
    ["image/png", "image/jpeg", "image/jpg"],
    1000000,
    2,
    "Only .jpg, .jpeg and .png files are allowed"
  );

  //call the middleware function
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          attachment: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = attachmentUpload;