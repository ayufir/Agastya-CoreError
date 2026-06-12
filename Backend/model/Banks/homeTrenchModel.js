// const mongoose = require("mongoose");

// const homeTrenchSchema = new mongoose.Schema({
//   status: {
//     type: String,
//     enum: [
//       "Pending",
//       "Assigned",
//       "Visited",
//       "Reported",
//       "Reviewed",
//       "Approved",
//       "Rejected",
//     ],
//     default: "Pending",
//   },
//   AttachDocuments: {
//     type: [String],
//     default: [],
//   },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   timeline: [
//     {
//       status: { type: String },
//       updatedAt: { type: Date, default: Date.now },
//       updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       note: { type: String },
//     },
//   ],
//   route: { type: String },
//   bankName: { type: String, default: "HomeFirstTrench" },

//   approvalStatus: { type: String, default: "Pending" },
//   isReportSubmitted: { type: Boolean, default: false },
//   imageUrls: { type: [Object], default: [] },

//   // Vendor Visit Details
//   dateOfVisit: String,
//   dateOfReport: String,
//   propertyAddress: String,
//   visitedPersonName: String,
//   contactNumber: String,
//   laiNo: String,
//   propertyCode: String,


//   // Construction
//   constructionStage: String,
//   constructionPercentage: String,
//   constructionAsPer: String,

//   // Area
//   totalBua: String,
//   areaRemarks: String,
//   latitude: String,
//   longitude: String,
//   overallStatus: String,
//   negativeReason: String,

//   // Certificate
//   certificateText: String,

//   // Billing
//   charges: String,
//   gstPercentage: String,
//   totalAmount: String,

//   // Declaration
//   declaration: [String],

//   // Site Pics
//   sitePics: [
//     {
//       url: String,
//       location: String,
//       latitude: String,
//       longitude: String,
//       localTime: String,
//       altitude: String,
//       gmt: String,
//       date: String,
//     },
//   ],
// });

// const HomeFirstTrench = mongoose.model("HomeTrenchReport", homeTrenchSchema);

// module.exports = HomeFirstTrench;





const mongoose = require("mongoose");

const homeTrenchSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      "Pending",
      "Assigned",
      "Visited",
      "Reported",
      "Reviewed",
      "Approved",
      "Rejected",
    ],
    default: "Pending",
  },
  AttachDocuments: {
    type: [Object],
    default: [],
  },
  atsDocuments: {
    type: [Object],
    default: [],
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timeline: [
    {
      status: { type: String },
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      note: { type: String },
    },
  ],
  route: { type: String },
  bankName: { type: String, default: "HomeFirstTrench" },
  city: { type: String, default: "" },

  approvalStatus: { type: String, default: "Pending" },
  isReportSubmitted: { type: Boolean, default: false },
  imageUrls: { type: [Object], default: [] },

  // Vendor Visit Details
  dateOfVisit: String,
  dateOfReport: String,
  propertyAddress: String,
  visitedPersonName: String,
  contactNumber: String,
  laiNo: String,
  propertyCode: String,

  // Construction
  constructionStage: String,
  constructionPercentage: String,
  constructionRemarks: String,
  constructionAsPer: String,

  // Area
  totalBua: String,
  areaRemarks: String,
  latitude: String,
  longitude: String,
  overallStatus: String,
  negativeReason: String,

  // Certificate
  certificateText: String,

  // Billing
  charges: String,
  baseRate: String,
  gstPercentage: String,
  totalAmount: String,

  // Declaration – split into three fields ✅
  declaration1: { type: Boolean, default: true },
  declaration2: { type: Boolean, default: true },
  declaration3: {
    type: String,
    default:
      "information furnished in the report is true & correct to the best of our knowledge & as per the documents provided by financial Institution or Property Owner.",
  },

  // Site Pics
  sitePics: [
    {
      url: String,
      location: String,
      latitude: String,
      longitude: String,
      localTime: String,
      altitude: String,
      gmt: String,
      date: String,
    },
  ],
}, { timestamps: true });

const HomeFirstTrench = mongoose.model("HomeTrenchReport", homeTrenchSchema);

module.exports = HomeFirstTrench;
