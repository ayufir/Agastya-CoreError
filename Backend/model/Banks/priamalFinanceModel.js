const mongoose = require("mongoose");

// Constants for default values
const DEFAULTS = {
  NA: "NA",
  CITY: "BHOPAL",
  STATE: "MADHYA PRADESH",
  COUNTRY: "INDIA",
  YES: "YES",
  MUNICIPAL_AUTHORITY: "NAGAR NIGAM",
  YEAR_OF_CONSTRUCTION: 2010,
  APPROACH_ROAD: "MORE THAN 10 FT",
};

// Address and General Details Schema
const AddressAndGeneralDetailsSchema = new mongoose.Schema(
  {
    houseFlatNo: { type: String, required: true, default: DEFAULTS.NA },
    floorNo: { type: String, default: DEFAULTS.NA },
    wingNameNo: { type: String, default: DEFAULTS.NA },
    buildingNameNo: { type: String, default: "D" },
    plotNo: { type: String, default: "10 & 11" },
    surveyNo: { type: String, default: "" },
    streetNameNo: { type: String, default: "" },
    stageSectorWardNo: { type: String, default: DEFAULTS.NA },
    landmarks: { type: String, default: "" },
    villageLocation: { type: String, default: "" },
    cityTalukaTown: { type: String, required: true, default: DEFAULTS.CITY },
    city: { type: String, default: DEFAULTS.CITY },
    district: { type: String, default: DEFAULTS.CITY },
    state: { type: String, default: DEFAULTS.STATE },
    country: { type: String, default: DEFAULTS.COUNTRY },
    pinCode: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\d{6}$/.test(v),
        message: "Invalid PIN code format",
      },
      default: "",
    },
    latitudeLongitude: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    propertyLocatedOn: { type: String, default: "" },
    approachRoad: {
      type: String,
      enum: ["MORE THAN 10 FT", "10 FT", "LESS THAN 10 FT"],
      default: DEFAULTS.APPROACH_ROAD,
    },
    boundaries: {
      east: {
        approved: { type: String, default: "" },
        site: { type: String, default: "" },
      },
      west: {
        approved: { type: String, default: "" },
        site: { type: String, default: "" },
      },
      north: {
        approved: { type: String, default: "" },
        site: { type: String, default: "" },
      },
      south: {
        approved: { type: String, default: "" },
        site: { type: String, default: "" },
      },
    },
    municipalLimit: {
      type: String,
      enum: ["YES", "NO"],
      default: DEFAULTS.YES,
    },
    municipalAuthority: { type: String, default: DEFAULTS.MUNICIPAL_AUTHORITY },
    yearOfConstruction: {
      type: Number,
      default: DEFAULTS.YEAR_OF_CONSTRUCTION,
      validate: {
        validator: (v) => v >= 1900 && v <= new Date().getFullYear(),
        message: "Invalid year of construction",
      },
    },
    sellerName: { type: String, default: DEFAULTS.NA },
  },
  { _id: false }
);

// Site Investigation Schema
const SiteInvestigationSchema = new mongoose.Schema(
  {
    completion: { type: String, default: "" },
    remarks: { type: String, default: "" },
  },
  { _id: false }
);

const NdpAndSiteDetailsSchema = new mongoose.Schema({
  natureOfBuilding: { type: String, required: true }, // e.g. Residential
  functionOfUse: { type: String, required: true }, // e.g. Residential
  typeOfFoundation: { type: String, required: true }, // e.g. Independent
  concreteGrade: { type: String, required: true }, // e.g. M3D
  seismicZone: { type: String, required: true }, // e.g. Zone III
  floodProneArea: { type: String, required: true }, // e.g. No
  environmentExposureCondition: { type: String, required: true }, // e.g. Moderate
  windCyclones: { type: String, required: true }, // e.g. Low Damage Risk Zone

  // Site Investigation: 9 fixed entries with completion and remarks
  siteInvestigation: {
    type: [SiteInvestigationSchema],
    default: () =>
      Array.from({ length: 9 }, () => ({ completion: "", remarks: "" })),
  },
});

// Document Verification Schema
const DocumentVerificationSchema = new mongoose.Schema(
  {
    name: { type: String },
    recdType: { type: String, default: "" },
    refNo: { type: String, default: "" },
    refDate: { type: String, default: "" },
    approvalDetails: { type: String, default: "" },
  },
  { _id: false }
);

// Valuation Details Schema
const ValuationAmenities = new mongoose.Schema(
  {
    description: { type: String, default: "" },
    areaQuantity: { type: String, default: "" },
    unit: { type: String, default: "" },
    amount: { type: String, default: "" },
  },
  { _id: false }
);

const valuationDetailsSchema = new mongoose.Schema(
  {
    areaType: {
      type: String,
      required: true,
      enum: ["Residential", "Commercial", "Industrial"],
    },
    areaValuation: { type: Number, required: true },
    constructionCost: { type: Number, required: true },
    extensionEstimate: { type: Number, required: true },
    amenities: [ValuationAmenities], // Array of amenities, each defined by the Amenity Schema
    totalAmenitiesCost: { type: Number, required: true },
    variancePercentage: { type: Number, required: true },
    distressValue: { type: Number, required: true },
    rentalValue: { type: Number, required: true },
    noOfBasements: { type: Number, required: true },
    noOfGroundFloors: { type: Number, required: true },
    noOfPodiums: { type: Number, required: true },
    noOfUpperFloors: { type: Number, required: true },
    totalNoOfFloors: { type: Number, required: true },
  },
  { _id: false }
);

// General Amenities Schema
const GeneralAmenitiesSchema = new mongoose.Schema(
  {
    waterSupply: {
      type: String,
      enum: ["YES", "NO", "PARTIAL"],
      default: "NO",
    },
    electricitySupply: {
      type: String,
      enum: ["YES", "NO", "PARTIAL"],
      default: "NO",
    },
    parkingFacility: { type: String, enum: ["YES", "NO"], default: "NO" },
    liftFacility: { type: String, enum: ["YES", "NO"], default: "NO" },
    security: { type: String, enum: ["YES", "NO"], default: "NO" },
    fireSafety: { type: String, enum: ["YES", "NO"], default: "NO" },
    sewageSystem: { type: String, enum: ["YES", "NO"], default: "NO" },
    wasteManagement: { type: String, enum: ["YES", "NO"], default: "NO" },
    greenArea: { type: String, enum: ["YES", "NO"], default: "NO" },
    clubhouse: { type: String, enum: ["YES", "NO"], default: "NO" },
    swimmingPool: { type: String, enum: ["YES", "NO"], default: "NO" },
    gymnasium: { type: String, enum: ["YES", "NO"], default: "NO" },
  },
  { _id: false }
);

// Loan Application Details Schema
const loanApplicationDetailsSchema = new mongoose.Schema(
  {
    branchName: { type: String, trim: true },
    applicationNo: { type: String, trim: true },
    customerNo: { type: String, trim: true },
    applicationStatus: { type: String, trim: true },
    applicantName: { type: String, trim: true },
    product: { type: String, trim: true },
    transactionType: { type: String, trim: true },
    visitDoneBy: { type: String, trim: true },
    dateOfVisit: { type: Date },
    locationType: { type: String, trim: true },
    valuationApproaches: { type: String, trim: true },
    valuationMethodology: { type: String, trim: true },
    propertyAddress: { type: String, trim: true },
    centerName: { type: String, trim: true },
  },
  { _id: false }
);

// Remarks Property Schema
const remarksPropertySchema = new mongoose.Schema(
  {
    propertyAcceptable: { type: String, enum: ["YES", "NO"] },
    marketability: { type: String },
    outsideVisitDone: { type: Boolean, default: false },
    dataProvided: { type: Boolean, default: false },
    propertyIdentified: { type: Boolean, default: false },
    rateConfirmed: { type: Boolean, default: false },
    deviations: [{ description: String }],
    conditions: [{ description: String }],
    tsrPreparedBy: { type: String },
    tsrSubmittedTo: { type: String },
    tsrPreparedDate: { type: Date },
    tsrSubmittedDate: { type: Date },
    locationPhotos: [{ type: String }],
    propertyOwnerName: { type: String },
    propertyInspectionDate: { type: Date },
    marketValueConfirmed: { type: Boolean, default: false },
  },
  { _id: false }
);

// Main Piramal Finance Model Schema
const PiramalFinanceModelSchema = new mongoose.Schema({
  address: AddressAndGeneralDetailsSchema,
  loanApplicationDetails: loanApplicationDetailsSchema,
  // remarksProperty: remarksPropertySchema,
  generalAmenities: GeneralAmenitiesSchema,

  ndpAndSiteDetails: NdpAndSiteDetailsSchema,

  siteDocumentsVerified: {
    type: [DocumentVerificationSchema],
    default: () => [
      { name: "APPROVED LAYOUT PLAN" },
      { name: "APPROVED FLOOR PLAN" },
      { name: "CONSTRUCTION PERMISSION / BUILDING" },
      {
        name: "BUILDING COMPLETION CERTIFICATE / OCCUPATION PERMISSION / USE PERMISSION / POSSESSION CERTIFICATE",
      },
      {
        name: "NON AGRICULTURAL PERMISSION / LAND CONVERSION / DIVERSION ORDER",
      },
      { name: "LOCATION SKETCH / CERTIFICATE" },
      { name: "PROPERTY TAX RECEIPTS" },
      { name: "AUTHORITY TAX RECEIPTS" },
      {
        name: "CONSTRUCTION ESTIMATE FROM REGISTERED ENGINEER / ARCHITECT",
      },
      {
        name: "IMPROVEMENT / EXTENSION ESTIMATE FROM REGISTERED ENGINEER / ARCHITECT",
      },
      { name: "REMARKS ON DOCUMENTS VERIFIED" },
    ],
  },
  valuationDetails: {
    type: [valuationDetailsSchema],
    default: () =>
      Array.from({ length: 6 }, () => ({
        description: "",
        areaQuantity: "",
        unit: "",
        amount: "",
      })),
  },

  propertyAcceptable: { type: String, enum: ["YES", "NO"] },
  marketability: { type: String },
  outsideVisitDone: { type: Boolean, default: false },
  dataProvided: { type: Boolean, default: false },
  propertyIdentified: { type: Boolean, default: false },
  rateConfirmed: { type: Boolean, default: false },
  deviations: [{ description: String }],
  conditions: [{ description: String }],
  tsrPreparedBy: { type: String },
  tsrSubmittedTo: { type: String },
  tsrPreparedDate: { type: Date },
  tsrSubmittedDate: { type: Date },
  locationPhotos: [{ type: String }],
  propertyOwnerName: { type: String },
  propertyInspectionDate: { type: Date },
  marketValueConfirmed: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PiramalFinanceModelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model(
  "PiramalFinanceModel",
  PiramalFinanceModelSchema
);
