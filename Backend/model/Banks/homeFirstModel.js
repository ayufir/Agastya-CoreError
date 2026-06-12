
const mongoose = require("mongoose");

const ValuationReportSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: [
      "Pending", "Assigned", "Visited", "Reported",
      "Reviewed", "Approved", "Rejected", "Work in Progress", "FinalSubmitted",
    ],
    default: "Pending",
  },
  AttachDocuments: { type: [Object], default: [] },
  atsDocuments: { type: [Object], default: [] },
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
  bankName: { type: String, default: "HomeFirst" },
  city: { type: String, default: "" },
  approvalStatus: { type: String, default: "Pending" },
  isReportSubmitted: { type: Boolean, default: false },

  // ─── SECTION 1 & 2: Assignment / Property Overview ───────────────────────
  refNo: { type: String },                    // Loan Account No. (LAI)
  dateOfReport: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  dateOfVisit: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  vendorName: { type: String },
  clContractNo: { type: String },
  projectPinCode: { type: String },           // Pin Code
  latitude: { type: String },
  longitude: { type: String },
  propertyCategory: { type: String },         // INDIVIDUAL / PROJECT
  unitType: { type: String },                 // Property Type (Open Plot, Flat, etc.)
  typeOfLoan: { type: String },
  propertyLocation: { type: String },         // Town / Village / City
  populationCensus2011: { type: String },
  ruralUrban: { type: String },
  zone: { type: String },
  propertyAreaLimits: { type: String },       // Municipal / GP / TP
  eraApplicable: { type: String },            // RERA No.
  projectName: { type: String },

  // ─── SECTION 3: Visit Details ─────────────────────────────────────────────
  customerName: { type: String },             // Applicant Name
  customerNo: { type: String },               // Mobile No.
  personMetDuringVisit: { type: String },     // Person Met At Site
  personContactNo: { type: String },
  relationshipOfPersonMet: { type: String },  // Relationship (SELF, Owner…)
  propertyOwnerName: { type: String },        // Property Owner's Name
  howFoundOwnerName: { type: String },        // How found owner name
  documentsAvailable: { type: String },       // YES / NO
  nameOnSocietyBoard: { type: String },
  addressLegal: { type: String },
  addressSite: { type: String },
  nameOnDoor: { type: String },
  nearbyLandmark: { type: String },
  statusOfOccupancy: { type: String },        // Vacant / Occupied
  occupiedBy: { type: String },
  usageOfProperty: { type: String },
  propertyEasilyIdentifiable: { type: String },

  imageUrls: { type: [Object], default: [] },

  // ─── SECTION 4: Locality ─────────────────────────────────────────────────
  nearestCityTown: { type: String },          // Nearest City/Town
  locationCategory: { type: String },         // TP / ZP / GP / MC
  localityDevelopment: { type: String },
  approachRoadType: { type: String },
  approachRoadWidth: { type: String },
  distanceFromCityCentre: { type: String },
  distanceFromRailwayStation: { type: String },
  distanceFromBusStand: { type: String },
  distanceFromHospital: { type: String },
  occupancyPercentage: { type: String },
  habitationPercentage: { type: String },
  nallahRiverHighTension: { type: String },   // Negative markers
  electricityAvailability: { type: String },
  waterAvailability: { type: String },
  drainageAvailability: { type: String },

  // ─── SECTION 5: Property Plan ────────────────────────────────────────────
  documents: [
    {
      key: { type: String },
      type: { type: String },
      approvingAuthority: { type: String },
      approvalDate: { type: String },
      approvalDetails: { type: String },
    },
  ],

  // ─── SECTION 6: NDMA Guidelines ──────────────────────────────────────────
  seismicZone: { type: String },
  cycloneZone: { type: String },
  landslideProneZone: { type: String },
  floodZone: { type: String },
  crZone: { type: String },
  demolitionRisk: { type: String },
  demolitionRiskDetails: { type: String },
  followsNDMAGuidelines: { type: String },

  // ─── SECTION 7: Boundaries & Dimensions ──────────────────────────────────
  directions: {
    North: { document: { type: String }, actual: { type: String }, plan: { type: String } },
    South: { document: { type: String }, actual: { type: String }, plan: { type: String } },
    East: { document: { type: String }, actual: { type: String }, plan: { type: String } },
    West: { document: { type: String }, actual: { type: String }, plan: { type: String } },
  },
  boundariesMatching: { type: String },
  propertyDemarcated: { type: String },
  boundaryRemarks: { type: String },
  marketability: { type: String },
  landArea: { type: String },                 // e.g. "1980 SQFT"
  linearDimension: { type: String },          // e.g. "30*66"
  plotArea: { type: Number },

  // ─── SECTION 8: Structural Details ───────────────────────────────────────
  typeOfStructure: { type: String },
  typeOfRoof: { type: String },
  noOfFloorsPermissible: { type: String },
  noOfFloorsActual: { type: String },
  noOfUnitFlatOnEachFloor: { type: String },
  qualityOfConstruction: { type: String },
  approxAgeOfProperty: { type: Number },
  residualAge: { type: Number },

  // ─── SECTION 9: Violation ────────────────────────────────────────────────
  deviationToPlan: { type: String },
  deviationDetails: { type: String },
  demolitionDetails: { type: String },
  encroachment: { type: String },
  encroachmentDetails: { type: String },

  // ─── SECTION 10: Valuation ───────────────────────────────────────────────
  // Land rows
  landDocumentArea: { type: Number },
  landDocumentRate: { type: Number },
  landDocumentValuation: { type: Number },
  landPlanArea: { type: Number },
  landPlanRate: { type: Number },
  landPlanValuation: { type: Number },
  landSiteArea: { type: Number },
  landSiteRate: { type: Number },
  landSiteValuation: { type: Number },

  // Construction rows
  constructionDocumentArea: { type: Number },
  constructionDocumentRate: { type: Number },
  constructionDocumentValuation: { type: Number },
  constructionPlanArea: { type: Number },
  constructionPlanRate: { type: Number },
  constructionPlanValuation: { type: Number },
  constructionSiteArea: { type: Number },
  constructionSiteRate: { type: Number },
  constructionSiteValuation: { type: Number },

  // Summary
  amenitiesDetails: { type: String },
  amenitiesValue: { type: Number },
  liftAvailable: { type: String },
  buildingHeight: { type: String },
  realizableValue: { type: Number },
  constructionStage: { type: String },
  constructionStatus: { type: String },
  ValuationatPresentStage: { type: Number },
  ValuationasperGovtGuideline: { type: Number },
  constructionEstimateByCustomer: { type: Number },
  estimateRecommendedByValuer: { type: Number },
  marketRatePerSqft: { type: String },
  constructionAsPerPlan: { type: String },

  // ─── SECTION 11: Observation Remarks ─────────────────────────────────────
  valuationRemarks: [{ type: String }],
  charges: { type: Number },
  baseRate: { type: Number },
  totalAmount: { type: Number },

  // Floor wise section
  ffPlan: { type: String },
  ffRemark: { type: String },
  ffSite: { type: String },
  fifthPlan: { type: String },
  fifthRemark: { type: String },
  fifthSite: { type: String },
  gfPlan: { type: String },
  gfRemark: { type: String },
  gfSite: { type: String },
  sfPlan: { type: String },
  sfRemark: { type: String },
  sfSite: { type: String },
  tfPlan: { type: String },
  tfRemark: { type: String },
  tfSite: { type: String },
  totalPlan: { type: String },
  totalRemark: { type: String },
  totalSite: { type: String },


  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ValuationReportSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("HomeFirst", ValuationReportSchema);
