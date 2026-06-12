const express = require("express");
const router = express.Router();
const piramalController = require("../../controllers/Banks/piramalController");

// CRUD routes
router.post("/create", piramalController.createDetails);
router.get("/display", piramalController.getAllDetailss);
// Search route
router.get("/search/search", piramalController.searchDetailss);

router.get("/display/:id", piramalController.getDetailsById);
router.put("/update/:id", piramalController.updateDetails);
router.delete("/delete/:id", piramalController.deleteDetails);

module.exports = router;
