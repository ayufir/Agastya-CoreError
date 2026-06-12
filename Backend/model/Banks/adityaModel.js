const mongoose = require("mongoose");

const adityaSchema = new mongoose.Schema(
  {
    // Basic Details
    valuerName: { type: String },
    clientName: { type: String },
    initiationDate: { type: Date },
    vertical: { type: String },
    visitDate: { type: Date },
    caseReferenceNumber: { type: String },
    propertyOwners: { type: String },
    reportDate: { type: String },

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
        "Work in Progress",
        "FinalSubmitted",
      ],
      default: "Pending",
    },
    AttachDocuments: { type: [String], default: [] },
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

    // Location Details
    propertyAddressTRF: { type: String },
    propertyAddressVisit: { type: String },
    propertyAddressDocs: { type: String },
    mainLocality: { type: String },
    subLocality: { type: String },
    microLocation: { type: String },
    landmark: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    propertyType: {
      type: String,
      // enum: [
      //   "RESIDENTIAL",
      //   "COMMERCIAL",
      //   "INDUSTRIAL",
      //   "INSTITUTIONAL",
      //   "AGRICULTURE",
      // ],
    },
    currentUsage: {
      type: String,
      // enum: [
      //   "RESIDENTIAL",
      //   "COMMERCIAL",
      //   "INDUSTRIAL",
      //   "INSTITUTIONAL",
      //   "AGRICULTURE",
      // ],
    },
    previousValuation: {
      type: String,
      enum: ["Yes", "No"],
    },
    previousValuationDate: { type: String },
    propertySubType: { type: String },
    locality: {
      type: String,
      enum: ["Well Developed", "Developing", "Under Develop", "Slum"],
    },
    propertyFallingWithin: {
      type: String,
      // enum: [
      //   "Municipal Corporation",
      //   "Gram Panchayat",
      //   "Town Planning Authority",
      //   "Development Authority",
      //   "Municipality",
      // ],
    },
    occupancyLevel: {
      type: String,
      // enum: [
      //   "Densely Populated",
      //   "Moderately Populated",
      //   "Low Population density",
      // ],
    },
    siteCondition: {
      type: String,
      // enum: ["Well Developed", "Developing", "Under Developed"],
    },
    distanceRailway: { type: String },
    distanceBusStop: { type: String },
    distanceMainRoad: {
      type: String,
      // enum: [
      //   "Not Applicable (Prop on Mid Road)",
      //   "Less than 200 m",
      //   "200 to 500 m",
      //   "above 500 m",
      // ],
    },
    distanceCityCentre: { type: String },
    distanceABFLBranch: { type: String },
    approachRoadWidth: {
      type: String,
      // enum: [
      //   "Width >40 ft.",
      //   "Width 20 to 40 ft.",
      //   "Clear width<10ft",
      //   "Mud Road",
      // ],
    },

    // Property Details
    occupancy: {
      type: String,
      // enum: ["Occupied", "Vacant"],
      // default: "Occupied",
    },
    occupiedBy: { type: String },
    occupiedSince: { type: String },
    occupantName: { type: String },
    propertyDemarcated: {
      type: String, //enum: ["Yes", "Partially", "No"]
    },
    propertyIdentification: {
      type: String, //enum: ["YES", "NO"]
    },
    identificationThrough: {
      type: String, //default: "LOCAL ENQUIRY"
    },
    projectCategory: {
      type: String,
      // enum: ["A", "B", "C", "D", "A+", "Not Applicable"],
    },
    flatType: {
      type: String, // enum: ["Normal", "Duplex", "Not applicable"]
    },
    flatConfiguration: { type: String },
    propertyHolding: {
      type: String, // enum: ["Freehold", "Leasehold"]
    },
    typeOfStructure: { type: String, default: "RCC" },
    plotArea: { type: String, default: "5000 SQFT" },
    totalFloors: { type: String, default: "G+2" },
    liftFacility: {
      type: String,
      // enum: ["YES", "NO"]
    },
    amenities: {
      type: String,
      // enum: ["Average", "Excellent", "Good", "Low", "NA"],
    },
    marketability: {
      type: String,
      // enum: ["Average", "Excellent", "Good", "Low"],
    },
    propertyView: { type: String },
    parkingFacility: {
      type: String, //enum: ["YES", "NO"]
    },
    parkingType: {
      type: String,
      // enum: ["Open CP", "Dependent CP", "Covered CP", "Mechanical CP"],
    },
    constructionQuality: {
      type: String,
      //  enum: ["Class A", "Class B", "Class C", "Class D"],
    },
    propertyShape: {
      type: String, // enum: ["Regular", "Irregular"]
    },
    propertyPlacement: {
      type: String,
      // enum: [
      //   "NE Facing Corner Plot",
      //   "Corner Plot",
      //   "Intermittent Property",
      //   "South Facing",
      // ],
    },
    propertyExteriors: {
      type: String,
      // enum: ["Average", "Poor", "Excellent", "Good", "Low"],
    },
    propertyInteriors: {
      type: String,
      // enum: ["Average", "Poor", "Excellent", "Good", "Low"],
    },
    ageOfProperty: { type: String },

    // Other Floors & Area Details,
    groundFloorDetails: String,
    firstFloorDetails: String,
    secondFloorDetails: String,
    saleDeed: String,
    saleDeedDetails: String,
    sanctionedPlan: String,
    sanctionedPlanDetails: String,
    ccOc: String,
    ccOcDetails: String,
    agreementToSale: String,
    agreementToSaleDetails: String,
    mutationPossession: String,
    mutationPossessionDetails: String,
    taxReceipt: String,
    taxReceiptDetails: String,
    electricityBill: String,
    electricityBillDetails: String,
    conversion: String,
    conversionDetails: String,
    groundFloorArea: Number,
    groundFloorPlanMatch: String,
    groundFloorDeviations: String,
    groundFloorRemarks: String,
    firstFloorArea: Number,
    firstFloorPlanMatch: String,
    firstFloorDeviations: String,
    firstFloorRemarks: String,
    secondFloorArea: Number,
    secondFloorPlanMatch: String,
    secondFloorDeviations: String,
    secondFloorRemarks: String,
    totalArea: Number,
    totalPlanMatch: String,
    totalDeviations: String,
    totalRemarks: String,

    // // Financial Values
    plotAreaDeed: Number,
    plotRateDeed: Number,
    plotValueDeed: Number,
    plotAreaPhysical: Number,
    plotRatePhysical: Number,
    plotValuePhysical: Number,
    carpetAreaPlan: Number,
    carpetRatePlan: Number,
    carpetValuePlan: Number,
    carpetAreaMeasurement: Number,
    carpetRateMeasurement: Number,
    carpetValueMeasurement: Number,
    builtUpAreaNorms: Number,
    builtUpRateNorms: Number,
    builtUpValueNorms: Number,
    builtUpAreaMeasurement: Number,
    builtUpRateMeasurement: Number,
    builtUpValueMeasurement: Number,
    superBuiltUpArea: Number,
    superBuiltUpRate: Number,
    superBuiltUpValue: Number,
    carParkArea: Number,
    carParkRate: Number,
    carParkValue: Number,
    amenitiesArea: Number,
    amenitiesRate: Number,
    amenitiesValue: Number,

    // // Boundary Details
    frontAsPerPlan: String,
    frontActual: String,
    frontDeviation: String,
    frontRemarks: String,
    side1AsPerPlan: String,
    side1Actual: String,
    side1Deviation: String,
    side1Remarks: String,
    side2AsPerPlan: String,
    side2Actual: String,
    side2Deviation: String,
    side2Remarks: String,
    rearAsPerPlan: String,
    rearActual: String,
    rearDeviation: String,
    rearRemarks: String,
    totalValue: Number,
    distressValue: Number,
    insuranceValue: Number,
    governmentValue: Number,
    percentageCompletion: String,
    percentageRecommendation: String,

    // // Final Details
    northAsPerDocs: String,
    southAsPerDocs: String,
    eastAsPerDocs: String,
    westAsPerDocs: String,
    northActual: String,
    southActual: String,
    eastActual: String,
    westActual: String,
    northBoundaryMatching: String,
    southBoundaryMatching: String,
    eastBoundaryMatching: String,
    westBoundaryMatching: String,
    northRemarks: String,
    southRemarks: String,
    eastRemarks: String,
    westRemarks: String,
    additionalRemarks: String,
    engineerName: String,
    propertyPhotos: [],
  },
  { timestamps: true }
);

const adityaModel = mongoose.model("adityaModel", adityaSchema);

module.exports = adityaModel;
