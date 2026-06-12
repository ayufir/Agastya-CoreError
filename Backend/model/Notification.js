// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // jise dikhani hai
    caseId: { type: mongoose.Schema.Types.ObjectId }, // kis case ka update hai
    bankName: { type: String }, // e.g., "Bajaj"
    message: { type: String }, // e.g., "Status updated to Work in Progress"
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
