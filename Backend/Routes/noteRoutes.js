const express = require("express");

const {
  addNote,
  getNotesByCase,
  allCaseByUserId,
  allNotes,
} = require("../controllers/noteCtrl");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", protect, addNote);

router.get("/all", protect, allCaseByUserId);
router.get("/get", protect, allNotes);
router.get("/:caseId", protect, getNotesByCase);

module.exports = router;
