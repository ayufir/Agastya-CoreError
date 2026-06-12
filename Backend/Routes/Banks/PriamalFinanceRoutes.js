const express = require("express");
const router = express.Router();
const piramalFinanceController = require("../../controllers/Banks/piramalFinanceController");

// Create a new Piramal Finance record
router.post("/", piramalFinanceController.createRecord);

// Get all Piramal Finance records
router.get("/", piramalFinanceController.getAllRecords);

// Get a single Piramal Finance record by ID
router.get("/:id", piramalFinanceController.getRecordById);

// Update a Piramal Finance record by ID
router.put("/:id", piramalFinanceController.updateRecord);

// Delete a Piramal Finance record by ID
router.delete("/:id", piramalFinanceController.deleteRecord);

module.exports = router;
