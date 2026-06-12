const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const {
  createIciciBank,
  getAllIciciBanks,
  getIciciBankById,
  updateIciciBank,
  submitIciciBank,
} = require("../../controllers/Banks/iciciBankController");

router.post("/", protect, createIciciBank);           // Create
router.get("/", protect, getAllIciciBanks);           // Get all
router.get("/:id", getIciciBankById);        // Get by ID
router.put("/:id", protect, updateIciciBank);         // Save / Save & Next
router.put("/:id/submit", protect, submitIciciBank);  // Final Submit button

module.exports = router;