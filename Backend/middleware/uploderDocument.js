const multer = require("multer");
const path = require("path");

// Storage setup: saves to 'uploads/documents/'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/documents/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Allowed document types
// const allowedMimeTypes = [
//   "application/pdf",
//   "application/msword", // .doc
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
// ];

// // File filter
// const fileFilter = (req, file, cb) => {
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
//   }
// };

// // Optional: size limit (e.g., 5MB)
// const limits = {
//   fileSize: 5 * 1024 * 1024, // 5MB
// };

const uploadDocuments = multer({
  storage,
});

module.exports = uploadDocuments;
