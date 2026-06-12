// // models/ManapuramFormOne.js

// const mongoose = require("mongoose");

// const ManapuramSchema = new mongoose.Schema(
//   {
//     // ------------------------------Mananppuram Form One---------------------------------
//     valuerName: { type: String },
//     caseRefNo: { type: String },
//     dateOfVisit: { type: Date },
//     dateOfReport: { type: Date },

//     contactPersonName: { type: String },
//     contactPersonMobile: { type: String },

//     applicantsName: {
//       type: String,
//     },
//     owner: {
//       type: String,
//     },
//     documentProduced: { type: String },

//     propertyType: { type: String },
//     holdingType: { type: String },
//     propertyUsage: { type: String },

//     usageAuthorized: { type: String },
//     usageRestriction: { type: String },
//     occupancyStatus: { type: String },

//     measurement: {
//       type: String,
//     },

//     distanceFromBranch: {
//       type: String,
//     },

//     addressAsPerDocument: {
//       type: String,
//     },

//     landMark: { type: String },
//     location: { type: String },

//     eastBoundary: { type: String },
//     westBoundary: { type: String },
//     northBoundary: { type: String },
//     southBoundary: { type: String },

//     connectivity: { type: String },
//     siteAccess: { type: String },
//     proximityToAmenities: { type: String },
//     distanceFromCityCentre: { type: String },
//     roadTypeWidth: { type: String },
//     commentsOnProperty: { type: String },

//     //   ----------------------------------------------Manappuram Form Two----------------------------
//     // GLR (Guideline Rate)
//     landComponentArea: {
//       type: String,
//     },
//     landComponentRate: {
//       type: String,
//     },
//     landComponentValue: {
//       type: String,
//     },

//     // PMR (Prevailing Market Rate)
//     landComponentPMARea: {
//       type: String,
//     },
//     landComponentPMRRate: {
//       type: String,
//     },
//     landComponentPMRValue: {
//       type: String,
//     },

//     // Construction Component
//     constructionComponentArea: {
//       type: String,
//     },
//     constructionComponentRate: {
//       type: String,
//     },
//     constructionComponentValue: {
//       type: String,
//     },

//     // Total Value
//     totalValue: {
//       type: String,
//     },

//     // Distress Sale
//     distressSaleValue: {
//       type: String,
//     },

//     // Observations (Textarea)
//     observations: {
//       type: String,
//     },

//     // Property Description (Textarea)
//     propertyDescription: {
//       type: String,
//     },

//     // Valuation Details
//     nameOfApplicant: {
//       type: String,
//     },
//     presentMarketValue: {
//       type: String,
//     },
//     forcedSaleValue: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Manapuram", ManapuramSchema);



const mongoose = require("mongoose");

const ManappuramSchema = new mongoose.Schema(
  {
    bankName: { type: String, default: "Manappuram Finance" },
    status: { type: String, default: "Pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    route: { type: String },
    city: { type: String, default: "" },

    timeline: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: String,
      },
    ],

    isReportSubmitted: { type: Boolean, default: false },
    approvalStatus: { type: String, default: "Pending" },

    // ── HEADER ────────────────────────────────────────────────────────────────
    header: {
      valueName: String,
      caseRefNo: String,
      dateOfVisit: String,
      dateOfReport: String,
      contactedPerson: String,
    },

    // ── PROPERTY INFO ─────────────────────────────────────────────────────────
    propertyInfo: {
      applicantName: String,
      ownerName: String,
      documentProduced: String,
      typeOfProperty: String,
      currentUsage: String,
      holdingType: String,
      propertyUsage: String,
      usageAuthorized: String,
      usageRestriction: String,
      occupancyStatus: String,
      measurementOfProperty: String,
      distanceFromBranch: String,
      addressAtSite: String,
      addressAsPerDocument: String,
      landmark: String,
      locationOfProperty: String,
    },

    // ── SITE BOUNDARIES ───────────────────────────────────────────────────────
    siteBoundaries: {
      eastDoc: String,
      westDoc: String,
      northDoc: String,
      southDoc: String,
      eastActual: String,
      westActual: String,
      northActual: String,
      southActual: String,
      boundariesTallied: String,
    },

    // ── ACCESSIBILITY ─────────────────────────────────────────────────────────
    accessibility: {
      connectivity: String,
      siteAccess: String,
      proximityToAmenities: String,
      typeWidthOfRoad: String,
      commentsOnProperty: String,
      withinMunicipalLimits: String,
      adverseFactors: String,
    },

    // ── MUNICIPAL DETAILS ─────────────────────────────────────────────────────
    municipalDetails: {
      sanctionPlanProvided: String,
      dateOfSanction: String,
      sanctionedArea: String,
      municipalCompliance: String,
      currentAgeProperty: String,
      estimatedResidualAge: String,
    },

    // ── TECHNICAL DETAILS ─────────────────────────────────────────────────────
    technicalDetails: {
      constructionType: String,
      noOfFloors: String,
      totalLandArea: String,
      totalBuiltUpArea: String,
      totalFloorArea: String,
      independentAccess: String,
      percentCompletion: String,
      currentAge: String,
      estimatedResidualAge: String,
    },

    // ── VALUATION GLR ─────────────────────────────────────────────────────────
    valuationGLR: {
      landArea: String,
      landRate: String,
      landValue: String,
    },

    // ── VALUATION PMR ─────────────────────────────────────────────────────────
    valuationPMR: {
      landArea: String,
      landRate: String,
      landValue: String,
      constructionArea: String,
      constructionRate: String,
      constructionValue: String,
      totalValue: String,
    },

    // ── DISTRESS VALUE ────────────────────────────────────────────────────────
    distressValue: String,

    // ── REMARKS (array of HTML strings) ──────────────────────────────────────
    remarks: { type: [String], default: [] },

    // ── SUMMARY ───────────────────────────────────────────────────────────────
    summary: {
      propertyAddress: String,
      propertyType: String,
      applicantName: String,
      presentMarketValue: String,
      forcedSaleValue: String,
      coordinates: String,
    },

    // ── IMAGES (URL + fileId from ImageKit) ───────────────────────────────────
    imageUrls: { type: [Object], default: [] },

    // ── ATTACHED DOCUMENTS ────────────────────────────────────────────────────
    AttachDocuments: { type: [Object], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ManappuramReport", ManappuramSchema);
