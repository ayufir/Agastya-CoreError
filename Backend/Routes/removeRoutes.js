const express = require("express");
const router = express.Router();
const { deleteUploadedFile } = require("../controllers/deleteFileController");

router.delete("/delete-file", deleteUploadedFile);

module.exports = router;
