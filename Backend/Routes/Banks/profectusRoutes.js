const express = require("express");
const router = express.Router();
const bankReportController = require("../../controllers/Banks/profectusController");

// Create a new Bank Report
router.post("/create", bankReportController.createReport);

// Get all Bank Reports (if needed)
router.get("/", bankReportController.getAllReports);

// Get a Bank Report by ID
router.get("/:id", bankReportController.getReportById);

// Update a Bank Report by ID
router.put("/:id", bankReportController.updateReport);

module.exports = router;
