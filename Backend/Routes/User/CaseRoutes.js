// routes/caseRoutes.js
const express = require("express");
const router = express.Router();

const {
  assignCase,
  updateCaseStatus,
  getCasesByRole,
  getCaseById,
  acceptCase,
  declineCase,
  getAllAssignedCases,
  getPendingCases,
  deleteCase,
  finalUpdate,
  getFinalSubmittedCases,
  getCancelledCases,
  unassignCase,
  getOutOfTATCases,
  getSummaryData,
  deleteImageFromCase,
  changeAssign
} = require("../../controllers/User/CaseAsignCtrl");

const { protect, restrictTo } = require("../../middleware/authMiddleware");

// Create a case
// router.post("/", protect, restrictTo("Coordinator", "Admin"), createCase);

router.get("/summary-data", protect, getSummaryData);

// routes/caseRoutes.js
router.get("/out-of-tat", protect, getOutOfTATCases);

// Assign case to Field Officer
router.put("/assign", protect, restrictTo("Coordinator", "Admin", "SuperAdmin", "TechnicalManager", "RegionalManager", "Accountant"), assignCase);

// Update case status (Visited, Reviewed, Approved etc.)
router.put("/status", protect, updateCaseStatus);

// Get all cases based on user role
router.get("/", protect, getCasesByRole);

//Get Assigned Case
router.get("/assigned", protect, getAllAssignedCases);
router.put("/change-assignment", protect, changeAssign);

router.get("/pending", protect, getPendingCases);

router.get("/cancelled", protect, getCancelledCases);

router.get("/total-submit-data", protect, getFinalSubmittedCases);

router.put("/remove-image/:id", deleteImageFromCase); //! delete image

router.put("/unassign-case/:caseId", protect, unassignCase);

router.put("/final-update/:id", protect, finalUpdate);

router.put("/accept/:id", protect, acceptCase);

router.put("/decline/:id", protect, declineCase);

router.get("/:id", protect, getCaseById);

router.delete("/:id", protect, deleteCase);

// Get single case

module.exports = router;
