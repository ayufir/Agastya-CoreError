const express = require("express");
const router = express.Router();
const ProtiumController = require("../../controllers/Banks/ProtiumController");

router.post("/", ProtiumController.createProtiumBank);
router.get("/", ProtiumController.getAllProtiumBanks);
router.get("/:id", ProtiumController.getIciciProtiumById);

module.exports = router;
