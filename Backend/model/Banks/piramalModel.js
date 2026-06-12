const mongoose = require("mongoose");

const piramalSchema = new mongoose.Schema({
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
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timeline: [
    {
      status: { type: String, default: "NA" },
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      note: { type: String, default: "NA" },
    },
  ],
  route: { type: String, default: "NA" },
  bankName: { type: String, default: "Piramal" },

  approvalStatus: { type: String, default: "Pending" },
  isReportSubmitted: { type: Boolean, default: false },

  imageUrls: { type: [String], default: [] },
  AttachDocuments: {
    type: [String],
    default: [],
  },

  // -----------------Individual Valuation Details------------

  caseType: {
    type: String,
  },
  houseDeliveryAgency: {
    type: String,
  },
  valuerVisit: {
    type: String,

    // enum: ["Yes", "No"],
    // default: "No",
  },
  valuationReportStatus: {
    type: String,
  },
  scopeOfValuation: {
    type: String,
  },
  contactPersonName: {
    type: String,
  },
  contactPersonNumber: {
    type: String,
  },
  relationshipWithApplicant: {
    type: String,
  },

  //   -----------------Basic Details------------

  applicantName: {
    type: String,
  },
  propertyCategory: {
    type: String,
  },
  propertySubCategory: {
    type: String,
  },
  greenHousing: {
    type: String,
    // enum: ["Yes", "No"],
    // default: "No",
  },
  certificationType: {
    type: String,
  },
  address: {
    type: String,
  },
  flatNo: {
    type: String,
  },
  floorWing: {
    type: String,
  },
  buildingName: {
    type: String,
  },
  khasraNumber: {
    type: String,
  },
  streetName: {
    type: String,
  },
  landmark: {
    type: String,
  },
  village: {
    type: String,
  },
  city: {
    type: String,
  },
  district: {
    type: String,
  },
  pincode: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,

    default: "India",
  },
  latitude: {
    type: String,
    trim: true,
  },
  longitude: {
    type: String,
    trim: true,
  },
  addressMatching: {
    type: String,
    // enum: ["Yes", "No"],
  },

  // -----------------Boundry Schema------------

  east: {
    type: String,
  },
  west: {
    type: String,
  },
  north: {
    type: String,
  },
  south: {
    type: String,
  },
  boundariesMatching: {
    type: String,
  },
  remarks: {
    type: String,
  },
  propertyIdentifiedThrough: {
    type: String,
    // enum: [
    //   "Survey Markers",
    //   "Fencing",
    //   "Natural Features",
    //   "Documents",
    //   "Other",
    // ],
  },
  propertyDemarcated: {
    type: String,

    // enum: ["Yes", "No"],
  },
  demarcationType: {
    type: String,

    // enum: ["Fence", "Wall", "Hedges", "Markers", "Other"],
  },

  //   ------------------surrounding Locality Schema ------------------
  locationType: {
    type: String,
  },
  classOfLocality: {
    type: String,
  },
  proximityToCivicAmenities: {
    type: String,
  },
  railwayStation: {
    type: String,
  },
  busStop: {
    type: String,
  },
  typeOfRoad: {
    type: String,
  },
  legalApproach: {
    type: String,
  },
  physicalApproach: {
    type: String,
  },
  //   ------------------Sanction plan Schema ------------------
  usageAsPerMasterPlan: String,
  usageApprovedAsPerPlan: String,
  currentUsage: String,
  propertyLimits: String,
  plotWithinMunicipalLimit: String,
  underDemolitionList: String,
  planApprovedBy: String,
  planDetails: String,

  //   ------------------Property Details Schema ------------------
  qualityOfConstruction: String,
  occupancyOfProperty: String,
  multiTenantedProperty: String,
  numberOfTenants: String,
  vacantSince: String,
  reasonForVacant: String,
  landAreaAsPerPlan: String,
  landAreaAsPerTitle: String,
  landAreaAsPerSite: String,
  residentialArea: String,
  commercialArea: String,
  typeOfPlot: String,
  finalLandArea: String,

  //   ------------------NDMA  Schema ------------------
  natureOfBuilding: String,
  typeOfStructure: String,
  functionOfUse: String,
  heightOfBuilding: String,
  typeOfFoundation: String,
  horizontalFloorType: String,
  concreteGrade: String,
  steelGrade: String,
  seismicZone: String,
  soilSlopeLandslide: String,
  floodProneArea: String,
  urbanFloods: String,
  environmentExposure: String,
  tsunami: String,
  windCyclones: String,
  coastalRegulatoryZone: String,
  //   ------------------Building Details Schema ------------------
  //   ------------------Building Details Schema ------------------
  numberOfBlocks: {
    type: String,
  },
  numberOfLifts: {
    type: String,
  },
  ageOfBuilding: {
    type: String,
  },
  residualLife: {
    type: String,
  },
  unitConfiguration: {
    type: String,
  },
  floorsApproved: {
    type: String,
  },
  floorsProposed: {
    type: String,
  },
  floorsAtSite: {
    type: String,
  },
  //   ------------------Area Details Schema ------------------
  typeOfProperty: {
    type: String,
  },
  sanctionedArea: {
    type: String,
  },
  actualArea: {
    type: String,
  },
  finalAreaConsidered: {
    type: String,
  },
  overallBUA: {
    type: String,
  },
  //   ------------------Valuation Details Schema ------------------
  landValueArea: {
    type: String,
    default: "1981",
  },
  landValueRate: {
    type: String,
    default: "0",
  },
  landValueDepreciation: {
    type: String,
    default: "0",
  },
  landValueAmount: {
    type: String,
    default: "0",
  },
  buildingValueArea: {
    type: String,
    default: "0",
  },
  buildingValueRate: {
    type: String,
    default: "0",
  },
  buildingValueDepreciation: {
    type: String,
    default: "0",
  },
  buildingValueAmount: {
    type: String,
    default: "0",
  },
  improvementArea: {
    type: String,
    default: "0",
  },
  improvementRate: {
    type: String,
    default: "0",
  },
  improvementDepreciation: {
    type: String,
    default: "0",
  },
  improvementAmount: {
    type: String,
    default: "0",
  },
  amenitiesAvailable: {
    type: String,
    default: "Na",
  },
  detailsOnInteriors: {
    type: String,
    default: "Na",
  },
  amenitiesValue: {
    type: String,
    default: "0",
  },
  fixedInteriorsValue: {
    type: String,
    default: "0",
  },
  noOfCarParks: {
    type: String,
    default: "--",
  },
  valueOfCarPark: {
    type: String,
    default: "--",
  },
  totalValueOfCarParks: {
    type: String,
    default: "--",
  },
  totalRealisableValue: {
    type: String,
    default: "₹0",
  },
  //   ------------------Stage of Construction Schema ------------------
  constructionProgress: {
    type: String,
    default: "Stalled",
  },
  progressPercentage: {
    type: String,
    default: "0",
  },
  recommendedPercentage: {
    type: String,
    default: "0",
  },
  presentRealisableValue: {
    type: String,
    default: "₹0",
  },
  constructionStageDescription: {
    type: String,
    default: "OPEN LAND",
  },
  //   ------------------Other Value References Schema ------------------
  guidelineValue: {
    type: String,
    default: "",
  },
  forcedSaleValue: {
    type: String,
    default: "",
  },
  reconstructionCost: {
    type: String,
    default: "",
  },
  approxRentals: {
    type: String,
    default: "",
  },
  riskOfDemolition: {
    type: String,
    default: "",
  },
  offsetProjections: {
    type: String,
    default: "",
  },
  extraCoverage: {
    type: String,
    default: "",
  },
  habitation: {
    type: String,
    default: "",
  },
});
const adityaModel = mongoose.model("piramalModel", piramalSchema);

module.exports = adityaModel;
