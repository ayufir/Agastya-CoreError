const express = require("express");
const router = express.Router();
const {
  createIciciHFCBank,
  getAllIciciHFCBanks,
  getIciciHFCBankById,
  updateDetails,
  deleteDetails,
} = require("../../controllers/Banks/IciciHFCController");

// CRUD routes
router.post("/", createIciciHFCBank);
router.get("/", getAllIciciHFCBanks);
router.get("/:id", getIciciHFCBankById);
// router.put("/:id", updateDetails);

// Delete
// router.delete("/:id", deleteDetails);

module.exports = router;
