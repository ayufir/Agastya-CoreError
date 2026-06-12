const mongoose = require("mongoose");

const AdityaBirlaSchema = new mongoose.Schema(
  {
    bankName: { type: String, default: "Aditya Birla" },
    status: { type: String, default: "Pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    route: { type: String },
    propertyCity: { type: String, default: "" }, // For dashboard filtering
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

    // ── BASIC DETAILS ──────────────────────────────────────────────────
    basicDetails: {
      nameOfValuer: String,
      nameOfClient: String,
      vertical: String,
      caseReferenceNumber: String,
      nameOfPropertyOwner: String,
      initiationDate: String,
      visitDate: String,
      reportDate: String,
    },

    // ── LOCATION DETAILS ───────────────────────────────────────────────
    locationDetails: {
      propertyAddressAsTRF: String,
      propertyAddressAsVisit: String,
      propertyAddressAsDocs: String,
      mainLocality: String,
      subLocality: String,
      microLocation: String,
      landmark: String,
      latitude: String,
      longitude: String,
      typeOfProperty: String,
      currentUsage: String,
      valuatorDoneBefore: String,
      ifYesWhen: String,
      propertyType: String,
      propertySubType: String,
      locality: String,
      propertyFallingWithin: String,
      occupancyLevel: String,
      conditionOfSite: String,
      distanceRailwayStation: String,
      distanceBusStop: String,
      distancePlotMainRoad: String,
      distanceCityCentre: String,
      distanceABCLBranch: String,
      widthApproachRoad: String,
      dimensionWidth: String,
      dimensionDepth: String,
      physicalApproach: String,
      legalApproach: String,
      otherFeatures: String,
    },

    // ── PROPERTY DETAILS ───────────────────────────────────────────────
    propertyDetails: {
      occupancy: String,
      occupiedBy: String,
      nameOfOccupant: String,
      occupiedSince: String,
      propertyDemarcated: String,
      propertyIdentification: String,
      identificationThrough: String,
    },

    approvalStatus: { type: String, default: "Pending" },

    // ── ACCOMMODATION DETAILS ──────────────────────────────────────────
    accommodationDetails: {
      projectCategory: String,
      flatType: String,
      flatConfiguration: String,
      propertyHolding: String,
      typeOfStructure: String,
      areaOfFlat: String,
      totalNoOfFloors: String,
      liftFacility: String,
      amenities: String,
      marketability: String,
      viewOfProperty: String,
      parkingFacility: String,
      qualityOfConstruction: String,
      typeOfParking: String,
      shapeOfProperty: String,
      placementOfProperty: String,
      exteriorsOfProperty: String,
      interiorsOfProperty: String,
      ageOfProperty: String,
      residualAge: String,
      sourceOfAge: String,
      maintenanceOfProperty: String,
      cautiousLocation: String,
    },

    // ── DOCUMENT DETAILS ───────────────────────────────────────────────
    documentDetails: {
      saleDeedDetails: String,
      sanctionedPlanDetails: String,
      ccOcDetails: String,
      agreementToSaleDetails: String,
      mutationPossessionDetails: String,
      taxReceiptDetails: String,
      electricityBillDetails: String,
      conversionDetails: String,
    },

    // ── BUILT UP AREA ──────────────────────────────────────────────────
    builtUpArea: {
      groundFloorAsPerSite: String,
      groundFloorDeviation: String,
      groundFloorDevRmk: String,
      groundFloorRmk: String,
      firstFloorAsPerSite: String,
      firstFloorDeviation: String,
      firstFloorDevRmk: String,
      firstFloorRmk: String,
      totalBuiltUp: String,
      totalDeviation: String,
    },

    // ── VALUATION DETAILS ──────────────────────────────────────────────
    valuationDetails: {
      plotAreaInDeed: String,
      plotAreaPhysical: String,
      plotAreaPhysicalRate: String,
      carpetAreaPlan: String,
      carpetAreaPlanRate: String,
      carpetAreaMeasurement: String,
      carpetAreaMeasRate: String,
      builtUpAreaNorms: String,
      builtUpAreaNormsRate: String,
      builtUpAreaTinShed: String,
      builtUpTinShedRate: String,
      superBuiltUpArea: String,
      superBuiltUpRate: String,
      carPark: String,
      carParkRate: String,
      amenitiesVal: String,
      amenitiesRate: String,
      totalValue: String,
      distressValue80: String,
      insuranceValue: String,
      governmentValue: String,
      percentageCompletion: String,
      percentageRecommendation: String,
    },

    // ── SETBACKS ───────────────────────────────────────────────────────
    setbacks: {
      frontAsPerPlan: String,
      frontActual: String,
      side1AsPerPlan: String,
      side1Actual: String,
      side2AsPerPlan: String,
      side2Actual: String,
      rearAsPerPlan: String,
      rearActual: String,
      usageDeviation: String,
      totalValue: String,
      distressValue: String,
      insuranceValue: String,
      governmentValue: String,
      percentageCompletion: String,
      percentageRecommendation: String,
    },

    // ── BOUNDARY DETAILS ───────────────────────────────────────────────
    boundaryDetails: {
      northAsPerDocs: String,
      southAsPerDocs: String,
      eastAsPerDocs: String,
      westAsPerDocs: String,
      northActual: String,
      southActual: String,
      eastActual: String,
      westActual: String,
      boundaryMatching: String,
    },

    // ── REMARKS ────────────────────────────────────────────────────────
    remarks: String,

    // ── ENGINEER DETAILS ───────────────────────────────────────────────
    engineerDetails: {
      nameOfEngineerVisited: String,
      nameOfAppraiser: String,
      reportPreparedBy: String,
      reportFinalizedBy: String,
    },

    // ── IMAGES (only URLs stored, NOT base64) ─────────────────────────
    imageUrls: { type: [Object], default: [] },

    // ── ATTACHED DOCUMENTS ─────────────────────────────────────────────
    AttachDocuments: { type: [Object], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdityaBirlaReport", AdityaBirlaSchema);