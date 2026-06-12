const express = require("express");
const router = express.Router();
const dmiFinanceReportController = require("../../controllers/Banks/DmiFinanceCtrl");

// Create a new DMI Finance Report
router.post("/", dmiFinanceReportController.createDmiFinanceReport);

// Get all DMI Finance Reports
router.get("/", dmiFinanceReportController.getAllDmiFinanceReports);

// Get a single DMI Finance Report by ID
router.get("/:id", dmiFinanceReportController.getDmiFinanceReportById);

// Update a DMI Finance Report by ID
router.put("/:id", dmiFinanceReportController.updateDmiFinanceReport);

// Delete a DMI Finance Report by ID
router.delete("/:id", dmiFinanceReportController.deleteDmiFinanceReport);

module.exports = router;
