const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { uploadDocuments } = require("../controllers/uploadController");

const router = express.Router();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) =>
        cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ POST – handle file upload
router.post("/upload", upload.array("files"), uploadDocuments);



module.exports = router;