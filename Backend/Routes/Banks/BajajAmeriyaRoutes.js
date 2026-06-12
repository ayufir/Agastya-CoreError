const express = require("express");
const router = express.Router();
const bajajController = require("../../controllers/Banks/bajajAmeriyaCtrl");

// CREATE
router.post("/", bajajController.createReport);

// READ ALL
router.get("/", bajajController.getAllReports);

// READ BY ID
router.get("/:id", bajajController.getReportById);

// UPDATE
router.put("/:id", bajajController.updateReport);

// DELETE
router.delete("/:id", bajajController.deleteReport);

module.exports = router;
