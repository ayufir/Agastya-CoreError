const express = require("express");
const router = express.Router();
const homeTrenchReportController = require("../../controllers/Banks/homeTrenchReportCtrl");
const { protect } = require("../../middleware/authMiddleware");

// Create a new Home Trench Report
router.post("/", protect, homeTrenchReportController.createHomeTrenchReport);

// Get all Home Trench Reports
router.get("/", protect, homeTrenchReportController.getAllHomeTrenchReports);

// Get a single Home Trench Report by ID
router.get("/:id", protect, homeTrenchReportController.getHomeTrenchReportById);

// Update a Home Trench Report by ID
router.put("/:id", protect, homeTrenchReportController.updateHomeTrenchReport);

// Delete a Home Trench Report by ID
router.delete("/:id", protect, homeTrenchReportController.deleteHomeTrenchReport);

router.put("/remove-image/:id", homeTrenchReportController.deleteImageFromValuationReport);
router.put("/remove-document/:id", homeTrenchReportController.deleteDocumentFromReport);

module.exports = router;
