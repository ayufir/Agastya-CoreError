const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema(
  {
    status: String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: String,
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    latitude: { type: String, default: "" },
    longitude: { type: String, default: "" },
  },
  { _id: false }
);

const BajajSchema = new mongoose.Schema(
  {
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
        "Work in Progress",
        "FinalSubmitted",
        "Query Raised",
        "cancelled",
      ],
      default: "Pending",
    },
    approvalStatus: { type: String, default: "Pending" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timeline: { type: [timelineSchema], default: [] },

    route: { type: String, default: "bajaj" },
    bankName: { type: String, default: "Bajaj Bank" },
    isReportSubmitted: { type: Boolean, default: false },
    reportSubmittedAt: { type: Date, default: null },

    location: { type: locationSchema, default: () => ({}) },
    latLong: { type: String, default: "" },
    mapView: {
      type: String,
      enum: ["roadmap", "satellite"],
      default: "roadmap",
    },

    imageUrls: { type: [Object], default: [] },
    AttachDocuments: { type: [Object], default: [] },
    remarks: { type: String, default: "" },

    fileNo: String,
    dateOfReport: String,
    applicantName: String,

    contactPerson: String,
    loanType: String,
    personMet: String,

    propertyOwner: String,
    documentsProvided: String,

    addressSite: String,
    localityName: String,
    landmark: String,
    distanceFromCity: String,
    addressInitiation: String,
    legalAddress: String,
    floorNo: String,
    propertyState: String,
    propertyCity: String,
    city: { type: String, default: "" },
    propertyPinCode: String,
    addressMatching: String,

    jurisdiction: String,

    propertyType: String,
    marketability: String,
    occupancyStatus: String,
    typeOfProperty: String,
    occupancySchedule: String,
    northBoundary: String,
    eastBoundary: String,
    westBoundary: String,
    southBoundary: String,
    boundariesMatching: String,
    identifiedProperty: String,
    approachRoadSize: String,

    buildingNature: String,
    planAspectRatio: String,
    structureType: String,
    projectedParts: String,
    masonryType: String,
    expansionJoints: String,
    roofType: String,
    steelGrade: String,
    mortarType: String,
    concreteGrade: String,
    environmentExposure: String,
    footingType: String,
    seismicZone: String,
    soilLiquefiable: String,
    coastalRegulatoryZone: String,
    soilSlope: String,
    floodProneArea: String,
    groundSlope: String,
    fireExit: String,

    sanctionedPlan: String,
    layoutPlan: String,
    constructionPlan: String,
    sanctionDate: String,
    planValidity: String,
    approvingAuthority: String,
    approvedUsages: String,
    numberOfFloors: String,

    constructionQuality: String,
    openPlot: String,
    liftAvailable: String,
    numberOfLifts: String,
    currentOccupant: String,
    independentAccess: String,
    accommodationDetails: String,

    eastWestDocument: String,
    eastWestSite: String,
    northSouthDocument: String,
    northSouthSite: String,
    landAreaDocument: String,
    landAreaSite: String,

    basementRooms: String,
    basementKitchens: String,
    basementBathrooms: String,
    basementSanctioned: String,
    basementActual: String,

    groundRooms: String,
    groundKitchens: String,
    groundBathrooms: String,
    groundSanctioned: String,
    groundActual: String,

    permissibleArea: String,
    landComponent: String,
    permissibleFSI: String,
    permissibleConstruction: String,
    carpetArea: String,
    proposedConstruction: String,

    riskOfDemolition: String,
    propertyStatus: String,
    percentCompleted: String,
    percentRecommended: String,

    propertyAge: String,
    residualAge: String,

    landArea: String,
    landRate: String,
    landTotal: String,

    buaArea: String,
    buaRate: String,
    buaTotal: String,

    realizableValue: String,
    governmentValue: String,
    distressedValue: String,
    previousValuation: String,

    inDemolitionList: String,
    negativeArea: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bajaj", BajajSchema);
