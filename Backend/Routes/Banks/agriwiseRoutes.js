const express = require("express");
const router = express.Router();
const propertyValuationController = require("../../controllers/Banks/agriwiseController");

// POST: Create a new property valuation record
router.post("/", propertyValuationController.createPropertyValuation);

// GET: Get all property valuation records
router.get("/", propertyValuationController.getAllPropertyValuations);

// GET: Get a single valuation by ID
router.get("/:id", propertyValuationController.getPropertyValuationById);

module.exports = router;
