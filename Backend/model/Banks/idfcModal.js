const mongoose = require("mongoose");

const IdfcSchema = new mongoose.Schema({
  // -------------------------------Technical Appraisal Report-------------------------
  branchName: { type: String },
  ref: { type: String },
  date: { type: Date },
  typeOfCase: { type: String },
  volunteerName: { type: String },
  dateOfVisit: { type: Date },
  caseRefNo: { type: String },

  contactPersonName: { type: String },
  contactPersonNumber: { type: String },

  applicantNames: { type: String },
  propertyType: { type: String },
  currentUsage: { type: String },

  siteAddress: { type: String },
  documentAddress: { type: String },
  previousValuation: { type: String },

  location: { type: String },
  approvedUsage: { type: String },
  localityClass: { type: String },
  siteDevelopment: { type: String },
  proximityAmenities: { type: String, enum: ["", "Yes", "NO"] }, // YES/NO as string
  railwayStationDistance: { type: String },
  busStopDistance: { type: String },
  landmark: { type: String },
  city: { type: String, default: "" },
  cityCentreDistance: { type: String },
  approachRoad: { type: String, enum: ["More than 10 ft", "Less than 10 ft"] },

  // ------------------------------Boundries Detail Schema ------------------------------------

  east: { type: String },
  west: { type: String },
  north: { type: String },
  south: { type: String },
  boundariesMatching: { type: String },

  saleDeedCopy: { type: String },
  propertyVisit: { type: String },
  rateConfirmation: { type: String },
  propertyLocation: { type: String },
  propertyIdentification: { type: String },
  tncpLayoutPlan: { type: String },
  buildingEstimateCost: { type: String },
  totalConstructionCost: { type: String },
  approvedMapPermission: { type: String },
  ownershipDocument: { type: String },

  otherObservations: { type: String },

  propertyInCautionArea: { type: String, enum: ["Yes", "No", ""] },
  propertyInNegativeArea: { type: String, enum: ["Yes", "No", ""] },
  propertyInOGL: { type: String, enum: ["Yes", "No", ""] },

  latitude: { type: String },
  longitude: { type: String },

  // ----------------------------------Floor Revenue Schema------------------------------------------

  carpetAreaMeasured: { type: String },
  carpetAreaAgreement: { type: String },
  carpetAreaApp: { type: String },
  areaForValuation: { type: String },
  loading: { type: String },
  superArea: { type: String },
  ratePerSqft: { type: String },
  comparisonValue: { type: String },
  govtApprovedRate: { type: String },

  description1: { type: String },
  area1: { type: String },
  rate1: { type: String },
  amount1: { type: String },

  description2: { type: String },
  area2: { type: String },
  rate2: { type: String },
  amount2: { type: String },

  totalValue: { type: String },

  constructionStage: { type: String },
  constructionPercentage: { type: String },
  constructionStatus: { type: String },
  recommendedPercentage: { type: String },
  recommendedConstructionValue: { type: String },

  carParkingCount: { type: String },
  carParkingRate: { type: String },
  carParkingValue: { type: String },

  totalAmenitiesCharges: { type: String },
  totalMarketValue: { type: String },
  forcedSaleValue: { type: String },
  reconstructionCost: { type: String },
  approxRentals: { type: String },

  onlineRecordFound: { type: String },
  landNature: { type: String },
  ownershipDetails: { type: String },
  propertyAreaDetails: { type: String },

  // ---------------------------Property Detail Schema ------------------------------------

  occupantStatus: { type: String },
  occupantName: { type: String },
  occupantRelation: { type: String },
  propertyDemarcation: { type: String },
  propertyIdentifiedThrough: { type: String },
  structureType: { type: String },
  longFirstArea: { type: String },
  blockHiringCount: { type: String },
  unitsPerFloor: { type: String },
  floorsCount: { type: String },
  unitsPerWing: { type: String },
  floorNumber: { type: String },
  roomsCount: { type: String },
  carpetArea: { type: String },
  superBuiltUp: { type: String },
  constructionQuality: { type: String },
  propertyAge: { type: String },
  residualLife: { type: String },
  planApprovalNo: { type: String },
  constructionAsPerPlan: { type: String },
  constructionPermission: { type: String },
  permissionNumberDate: { type: String },
  ownershipType: { type: String },
  documentsVerified: { type: String },
  withinMunicipalLimits: { type: String },
  permissibleUsage: { type: String },
});

module.exports = mongoose.model("IDFCS", IdfcSchema);
