const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["FieldOfficer", "TM", "RTM", "Coordinator", "Admin"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  // "note" = regular note/query, "call_not_attended" = quick call log
  type: {
    type: String,
    enum: ["note", "call_not_attended"],
    default: "note",
  },
  // Optional photo attached to a note
  image: {
    url: { type: String, default: null },
    fileId: { type: String, default: null },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", noteSchema);
