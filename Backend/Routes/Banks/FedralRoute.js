const express = require("express");
const router = express.Router();
const {
  createFedralBank,
  getAllFedralBanks,
  getIciciFedralById,
} = require("../../controllers/Banks/FedralController");

// CRUD routes
router.post("/", createFedralBank);
router.get("/", getAllFedralBanks);
router.get("/:id", getIciciFedralById);
// router.put("/:id", updateDetails);

// Delete
// router.delete("/:id", deleteDetails);

module.exports = router;
