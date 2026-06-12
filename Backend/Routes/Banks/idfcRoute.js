// routes/idfcRoutes.js

const express = require("express");
const router = express.Router();
const idfcController = require("../../controllers/Banks/idfcCtrl");

// Routes for CRUD operations
router.post("/create", idfcController.createIDFC); // Create
router.get("/display", idfcController.getAllIDFC); // Read All
router.get("/display/:id", idfcController.getIDFCById); // Read One
router.put("/update/:id", idfcController.updateIDFC); // Update
router.delete("/delete/:id", idfcController.deleteIDFC); // Delete

module.exports = router;
