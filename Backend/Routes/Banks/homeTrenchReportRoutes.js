const express = require("express");
const router = express.Router();
const homeTrenchReportController = require("../../controllers/Banks/homeTrenchReportCtrl");

// Create a new Home Trench Report
router.post("/", homeTrenchReportController.createHomeTrenchReport);

// Get all Home Trench Reports
router.get("/", homeTrenchReportController.getAllHomeTrenchReports);

// Get a single Home Trench Report by ID
router.get("/:id", homeTrenchReportController.getHomeTrenchReportById);

// Update a Home Trench Report by ID
router.put("/:id", homeTrenchReportController.updateHomeTrenchReport);

// Delete a Home Trench Report by ID
router.delete("/:id", homeTrenchReportController.deleteHomeTrenchReport);

router.put("/remove-image/:id", homeTrenchReportController.deleteImageFromValuationReport);
router.put("/remove-document/:id", homeTrenchReportController.deleteDocumentFromReport);


module.exports = router;
