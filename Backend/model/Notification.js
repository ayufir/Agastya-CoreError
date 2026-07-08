// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // jise dikhani hai (ASSIGNER)
    caseId:   { type: mongoose.Schema.Types.ObjectId },              // kis case ka update hai
    bankName: { type: String },                                      // e.g., "ICICI Bank"
    message:  { type: String },                                      // display message
    isRead:   { type: Boolean, default: false },
    type:     { type: String, default: "general" },                  // "fo_submit", "status_update", etc.
    route:    { type: String, default: null },                       // frontend route to navigate on click
    foName:   { type: String, default: null },                       // field officer name
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);

