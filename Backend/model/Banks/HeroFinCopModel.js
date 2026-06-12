const mongoose = require("mongoose");

// Attachment Sub-Schema
const attachmentSchema = new mongoose.Schema(
  {
    name: { type: String },
    type: { type: String, default: "Other" },
  },
  { _id: false }
);

// Comment Sub-Schema
const commentSchema = new mongoose.Schema(
  {
    text: { type: String },
    author: { type: String },
    date: { type: String }, // Or use Date type if needed
  },
  { _id: false }
);

// Main HeroFinCop Schema
const HeroFinCopSchema = new mongoose.Schema(
  {
    bankName: { type: String },
    city: { type: String, default: "" },
    bankRefNo: { type: String },
    businessDivision: { type: String },
    internalRef: { type: String },
    applicantName: { type: String },
    applicationRef: { type: String },
    transactionType: { type: String },
    contactPerson: { type: String },
    contactMobile: { type: String },
    contactEmail: { type: String },
    loanPurpose: { type: String },
    propertyType: { type: String },
    valuationType: { type: String },
    specialInstructions: { type: String },

    estimatedHours: { type: String },
    assignTo: { type: String },
    assignForm: { type: String },
    reportTemplate: { type: String },
    jobCreatedOn: { type: Date },
    estimatedTime: { type: String },
    urgentCompletedBy: { type: Date },
    jobCompletedDate: { type: Date },
    status: { type: String },
    phone: { type: String },

    attachments: [attachmentSchema],
    comments: [commentSchema],
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("HeroFinCop", HeroFinCopSchema);
