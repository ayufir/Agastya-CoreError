// routes/cholaRoutes.js
const express = require("express");
const cholaCtrl = require("../../controllers/Banks/cholaController");

const router = express.Router();

// POST request to save Chola data
router.post("/create", cholaCtrl.saveCholaData);

// GET request to retrieve all Chola data
router.get("/display", cholaCtrl.getAllCholaData);
router.get("/display/:id", cholaCtrl.getCholaDataById);

module.exports = router; // Export using module.exports
