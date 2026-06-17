const express = require("express");

const {
  addNote,
  getNotesByCase,
  allCaseByUserId,
  allNotes,
  uploadNoteImage,
} = require("../controllers/noteCtrl");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// uploadNoteImage multer middleware runs before addNote so req.file is available
router.post("/", protect, uploadNoteImage, addNote);

router.get("/all", protect, allCaseByUserId);
router.get("/get", protect, allNotes);
router.get("/:caseId", protect, getNotesByCase);

module.exports = router;
