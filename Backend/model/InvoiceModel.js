const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  invoiceNo: { type: String, required: true, unique: true },
  invoiceDate: { type: Date, required: true },
  billMonth: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Submitted" }, // New field
  rows: { type: Array, required: true },
  meta: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Invoice", invoiceSchema);
