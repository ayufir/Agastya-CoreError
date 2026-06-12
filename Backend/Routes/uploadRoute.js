const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadImage } = require("../config/imageUploader");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/", upload.array("files"), async (req, res) => {
  try {
    const uploadedResults = await Promise.all(
      req.files.map((file) => uploadImage(file))
    );

    const urls = uploadedResults.map((result) => result.url);

    res.json({ success: true, urls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
