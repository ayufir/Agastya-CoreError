const express = require("express");
const router = express.Router();
const {
  assignCase,
  getAssignedCasesByUser,
  raiseQuery,
} = require("../controllers/assignCaseCtrl");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/assign", protect, assignCase); // Admin
router.get("/my-cases", protect, getAssignedCasesByUser); // FO/TM/RTM
router.post("/query/:caseId", protect, raiseQuery); // FO/TM/RTM

module.exports = router;
