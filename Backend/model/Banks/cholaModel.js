const mongoose = require("mongoose");

// const areaTypeSchema = new mongoose.Schema(
//   {
//     type: { type: String },
//     plan: { type: Number },
//     site: { type: Number },
//     rate: { type: Number },
//     valuationPlan: { type: Number },
//     valuationMarket: { type: Number },
//   },
//   { _id: false }
// );
// const AreaTypeSchema = new mongoose.Schema(
//   {
//     type: { type: String },
//     plan: { type: Number },
//     site: { type: Number },
//     rate: { type: Number },
//     valuationPlan: { type: Number },
//     valuationMarket: { type: Number },
//   },
//   { _id: false }
// );
const CholaSchema = new mongoose.Schema(
  {
    // --------------------Location Detail Form ----------------------
    propertyOwner: { type: String },
    surveyNo: { type: String },
    suffixName: { type: String },
    suffixContactNo: { type: String },

    doorNo: { type: String },
    projectName: { type: String },
    colonyStreetLocality: { type: String },
    landmark: { type: String },
    pincode: { type: String },
    city: { type: String },
    district: { type: String },
    villageBoundariesMatching: { type: String },
    village: { type: String },
    taluk: { type: String },

    propertyWithin: { type: String, enum: ["", "RURAL", "URBAN"] },
    boundariesMatching: { type: String, enum: ["", "YES", "NO"] },
    saleInLast3Years: { type: String, enum: ["", "YES", "NO"] },

    addressLine1: { type: String },
    addressLine2: { type: String },

    latitude: { type: String },
    longitude: { type: String },
    distanceFromCity: { type: String },
    nearestBranch: { type: String },

    eastBoundaryOC: { type: String },
    southBoundaryOC: { type: String },
    westBoundaryOC: { type: String },
    northBoundaryOC: { type: String },

    eastBoundaryActual: { type: String },
    southBoundaryActual: { type: String },
    westBoundaryActual: { type: String },
    northBoundaryActual: { type: String },

    eastDimensionOC: { type: String },
    southDimensionOC: { type: String },
    westDimensionOC: { type: String },
    northDimensionOC: { type: String },

    eastDimensionActual: { type: String },
    southDimensionActual: { type: String },
    westDimensionActual: { type: String },
    northDimensionActual: { type: String },

    //   -----------------------Property Detail ---------------
    totalFloors: { type: Number },
    noOfUnits: { type: Number },
    totalMarketValue: { type: Number },
    fsuFar: { type: Number },
    achieved: { type: Number },
    distress: { type: Number },
    distressValue: { type: Number },
    carpetArea: { type: Number },
    carpetAreaInSqMtr: { type: Number },
    // areaType: [areaTypeSchema], // Embedding areaType schema
    builtUpArea: { type: Number },
    guidelineValue: { type: Number },
    rentalDetails: { type: String },
    propertyDistance1: { type: String },
    propertyName1: { type: String },
    propertyDistance2: { type: String },
    propertyName2: { type: String },
    propertyDistance3: { type: String },
    propertyName3: { type: String },
    propertyDistance4: { type: String },
    propertyName4: { type: String },
    propertyDistance5: { type: String },
    propertyName5: { type: String },

    // ----------------------Specification----------------------------
    totalFloors: { type: Number },
    noOfUnits: { type: Number },
    totalMarketValue: { type: Number },
    fsuFar: { type: Number },
    achieved: { type: Number },
    distress: { type: Number }, // as percentage
    distressValue: { type: Number },
    carpetArea: { type: Number }, // in SqFt
    carpetAreaInSqMtr: { type: Number }, // in SqMeter
    builtUpArea: { type: Number }, // not editable, but stored
    guidelineValue: { type: Number },
    areaType: [{
    type: { type: String },
    plan: { type: Number },
    site: { type: Number },
    rate: { type: Number },
    valuationPlan: { type: Number },
    valuationMarket: { type: Number }},
    ],
    amenity: { type: String, default: "" }, // optional text
    rentalDetails: { type: String, default: "" },

    //   -------------------------------------Stage Construction--------------------
    percentageCompleted: {
      type: Number,
    },
    surroundingDevelopment: {
      type: Number,
    },
    plinth: { type: Boolean, default: false },
    rccAboveGround: { type: Boolean, default: false },
    brickwork: { type: Boolean, default: false },
    internalPlaster: { type: Boolean, default: false },
    externalPlaster: { type: Boolean, default: false },
    flooring: { type: Boolean, default: false },
    plumbingElectricWork: { type: Boolean, default: false },
    doorWindowPaint: { type: Boolean, default: false },
    finishingPossession: { type: Boolean, default: false },
    totalCompletion: { type: Boolean, default: false },
    remarks: { type: String, default: "" },

    // Assuming these will be stored as file paths or URLs
    propertyImage: { type: String },
    map: { type: String },
    plan: { type: String },

    //   --------------------------Document Upload----------------------
    // name: {
    //   type: String,
    // },
    // type: {
    //   type: String,
    //   enum: ["", "Original", "Copy"],
    // },
    // refNo: {
    //   type: String,
    //   default: "",
    // },
    // refDate: {
    //   type: String, // or Date if you want to enforce date formatting
    //   default: "",
    // },
    // approvalDetails: {
    //   type: String,
    //   default: "",
    // },
    // uploadedFile: {
    //   type: String, // You can store the file path or URL here
    //   default: "",
    // },

    documents: [
      {
        name: { type: String },
        type: { type: String, enum: ["", "Original", "Copy"] },
        refNo: { type: String, default: "" },
        refDate: { type: String, default: "" },
        approvalDetails: { type: String, default: "" },
        uploadedFile: { type: String, default: "" },
      },
    ],
    //   --------------------------Remark Form----------------------------------------
    connectionName: {
      type: String,
    },
    landRate: {
      type: String, // Could be Number if you plan to store numeric value
    },
    technicallyAcceptable: {
      type: String, // "YES" or "NO"
      enum: ["YES", "NO", null],
      default: null,
    },
    demolitionRisk: {
      type: String,
      enum: ["YES", "NO", null],
      default: null,
    },
    constructedAsPerLaw: {
      type: String,
      enum: ["YES", "NO", null],
      default: null,
    },
    lastBillDate: {
      type: String, // or Date if you want it in date format
      default: "",
    },
    deviationObserved: {
      type: String,
      enum: ["YES", "NO", null],
      default: null,
    },
    natureOfDeviation: {
      type: String,
      default: "",
    },
    marketability: {
      type: String,
      enum: ["YES", "NO", null],
      default: null,
    },
    remarks: {
      type: String,
    },
    declaration: {
      inspectionDate: {
        type: String, // Or Date, based on use
        default: "08.04.2025",
      },
      noInterest: {
        type: String,
      },
      informationCorrect: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const cholaModel = mongoose.model("cholaModel", CholaSchema);

module.exports = cholaModel;
