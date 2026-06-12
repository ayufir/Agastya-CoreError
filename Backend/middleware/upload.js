const multer = require("multer");
const path = require("path");

// Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// const fileFilter = (req, file, cb) => {
//   // const allowedMimeTypes = [
//   //   // Images
//   //   "image/jpeg", // .jpg, .jpeg, .jpe, .jif
//   //   "image/png", // .png
//   //   "image/gif", // .gif
//   //   "image/heic", // .heic
//   //   "image/tiff", // .tif, .tiff
//   //   "image/webp", // .webp
//   //   "image/bmp", // .bmp

//   //   // Documents
//   //   "application/pdf",
//   //   "application/msword", // .doc
//   //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
//   //   "application/vnd.ms-excel", // .xls
//   //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
//   //   "application/vnd.ms-powerpoint", // .ppt
//   //   "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx

//   //   // Text
//   //   "text/plain",
//   // ];

//   const allowedMimeTypes = [
//     // Images
//     "image/jpeg", // .jpg, .jpeg, .jpe, .jif
//     "image/png", // .png
//     "image/gif", // .gif
//     "image/heic", // .heic
//     "image/heif", // .heif, .hif
//     "image/tiff", // .tif, .tiff
//     "image/webp", // .webp
//     "image/bmp", // .bmp

//     // Documents
//     "application/pdf",
//     "application/msword", // .doc
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
//     "application/vnd.ms-excel", // .xls
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
//     "application/vnd.ms-powerpoint", // .ppt
//     "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx

//     // Text
//     "text/plain",
//   ];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Unsupported file type!"), false);
//   }
// };

const upload = multer({ storage: storage });

module.exports = upload;
