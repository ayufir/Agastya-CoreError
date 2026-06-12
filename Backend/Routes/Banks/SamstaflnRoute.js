const express = require("express");
const router = express.Router();
const {
  createSamstaflnBank,
  getAllSamstaflnBanks,
  getIciciSamstaflnById,
} = require("../../controllers/Banks/SamstaflnController");

// CRUD routes
router.post("/", createSamstaflnBank);
router.get("/", getAllSamstaflnBanks);
router.get("/:id", getIciciSamstaflnById);
// router.put("/:id", updateDetails);

// Delete
// router.delete("/:id", deleteDetails);

module.exports = router;
