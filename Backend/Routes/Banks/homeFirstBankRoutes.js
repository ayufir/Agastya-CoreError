const express = require("express");
const router = express.Router();
const homeFirstBank = require("../../controllers/Banks/homeFirstBankCtrl");
const { protect } = require("../../middleware/authMiddleware");

// Create a new valuation report
router.post("/", protect, homeFirstBank.createValuationReport);

// Get all valuation reports
router.get("/", protect, homeFirstBank.getAllValuationReports);

router.put("/unassign/:id", homeFirstBank.unassignFieldOfficer);

router.put("/remove-image/:id", homeFirstBank.deleteImageFromValuationReport);

// ... existing routes
router.put("/remove-document/:id", homeFirstBank.deleteDocumentFromValuationReport);

// Get a single valuation report by ID
router.get("/:id", homeFirstBank.getValuationReportById);

router.put("/:id", protect, homeFirstBank.updateValuationReportById);

module.exports = router;




// api/first-bank
