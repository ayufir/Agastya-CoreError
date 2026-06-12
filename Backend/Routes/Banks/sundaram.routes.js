const express = require("express");
const router = express.Router();
const {
  createExtendedValuation,
  getAllExtendedValuations,
  getExtendedValuationById,
} = require("../../controllers/Banks/sundaram.Controller.js");

// POST - create report
router.post("/", createExtendedValuation);

// GET - all reports
router.get("/", getAllExtendedValuations);

// GET - report by ID
router.get("/:id", getExtendedValuationById);

module.exports = router;
