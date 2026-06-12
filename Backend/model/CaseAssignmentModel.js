const mongoose = require("mongoose");

// bankName: { type: String, required: true }, // eg: "HDFC"
const caseAssignmentSchema = new mongoose.Schema(
  {
    caseId: { type: mongoose.Schema.Types.ObjectId, required: true }, // refers to form _id
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["FO", "TM", "RTM"],
      default: "FO",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ASSIGNED", "ACCEPTED", "SUBMITTED", "QUERY_RAISED"],
      default: "PENDING",
    },
    route: {
      type: String,
      required: true,
    },

    query: [
      {
        message: String,
        raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CaseAssignment", caseAssignmentSchema);
