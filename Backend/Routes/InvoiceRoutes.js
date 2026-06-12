const express = require("express");
const router = express.Router();
const { saveInvoice, getAllInvoices, deleteInvoice, updateInvoice } = require("../controllers/InvoiceCtrl");
const { protect } = require("../middleware/authMiddleware");

router.post("/save", protect, saveInvoice);
router.get("/", protect, getAllInvoices);
router.delete("/:id", protect, deleteInvoice);
router.put("/:id", protect, updateInvoice);
module.exports = router;
