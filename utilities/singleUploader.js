//external imports
const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

//this function has been called on users/avataUpload.js file
function uploader(
  subfolder_path,
  allowed_file_types,
  max_file_size,
  error_msg
) {
  //file upload folder
  const UPLOAD_FOLDER = `${__dirname}/../public/uploads/${subfolder_path}`;

  //defines the storage
  const storage = multer.diskStorage({
    //defines the destination
    destination: (req, file, cb) => {
      cb(null, UPLOAD_FOLDER);
    },
    //defines what should be the filename of the uploaded file
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") + Date.now();

      //joins filename with extension
      cb(null, filename + fileExt);
    },
  });

  //prepare the final upload object
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, createError(error_msg));
      }
    },
  });
  return upload;
}

//module exports
module.exports = uploader;
