// const mongoose = require("mongoose");

// const profecutsSchema = new mongoose.Schema(
//   {
//     // ProfecutsDetails Fields
//     northDirection: { type: String, required: true },
//     southDirection: { type: String, required: true },
//     eastDirection: { type: String, required: true },
//     westDirection: { type: String, required: true },
//     boundariesMatching: {
//       type: String,
//       enum: ["Yes", "No", "NA"],
//       required: true,
//     },
//     plotArea: { type: Number, required: true },
//     isPropertyWithinLimit: { type: String, required: true },
//     marketability: { type: String, enum: ["Yes", "No", "NA"], required: true },
//     structureType: { type: String, required: true },
//     constructionQuality: { type: String, required: true },
//     unitConfiguration: { type: String, required: true },
//     permissibleFloors: { type: Number, required: true },
//     unitsPerFloor: { type: Number, required: true },
//     actualFloors: { type: Number, required: true },
//     propertyAge: { type: Number, required: true },
//     residualAge: { type: Number, required: true },
//     liftAvailable: {
//       type: String,
//       enum: ["Yes", "No", "NA"],
//       required: true,
//     },

//     constructionStage: { type: String, required: true },

//     // PropertyDetails Fields
//     approxAgeOfProperty: { type: Number, required: true },
//     directionNorth: { type: String, required: true },
//     directionSouth: { type: String, required: true },
//     directionEast: { type: String, required: true },
//     directionWest: { type: String, required: true },
//     isPropertyWithinLimit: { type: String, required: true },
//     typeOfStructure: { type: String, required: true },
//     qualityOfConstruction: { type: String, required: true },
//     unitFlatConfiguration: { type: String, required: true },
//     noOfFloorsPermissible: { type: Number, required: true },
//     noOfUnitFlatOnEachFloor: { type: Number, required: true },
//     noOfFloorsActual: { type: Number, required: true },
//     residualAge: { type: Number, required: true },
//     liftAvailable: { type: String, enum: ["Yes", "No", "NA"], required: true },
//     constructionStage: { type: String, required: true },

//     // ValuationDetails Fields
//     marketabilityStatus: {
//       type: String,
//       enum: ["Yes", "No", "NA"],
//       required: true,
//     },
//     propertyLimit: { type: String, required: true },
//     plotSize: { type: Number, required: true },
//     floorConfiguration: { type: String, required: true },
//     constructionStatus: { type: String, required: true },
//     ageOfProperty: { type: Number, required: true },
//     remainingAge: { type: Number, required: true },
//     liftAvailability: {
//       type: String,
//       enum: ["Yes", "No", "NA"],
//       required: true,
//     },
//     boundaryMatch: { type: String, enum: ["Yes", "No", "NA"], required: true },
//     permissibleFloors: { type: Number, required: true },
//     totalFloors: { type: Number, required: true },
//     unitPerFloor: { type: Number, required: true },
//     conditionOfProperty: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const profecuts = mongoose.model("Profecuts", profecutsSchema);

// module.exports = profecuts;
const mongoose = require("mongoose");

const projectValuationSchema = new mongoose.Schema(
  {
    // Step 1 - ProfecutsDetails
    amenities: { type: String },
    city: { type: String, default: "" },
    approvalAuthority: { type: String },
    buildingUnderConsideration: { type: String },
    completionStatus: { type: String },
    developerName: { type: String },
    encumbrance: { type: String },
    environmentalClearance: { type: String },
    expectedCompletionTime: { type: String },
    isProjectApproved: { type: String },
    isRERAApproved: { type: String },
    landTitle: { type: String },
    layoutPlanApproval: { type: String },
    legalClearance: { type: String },
    litigation: { type: String },
    nameOfProject: { type: String },
    natureOfProject: { type: String },
    noOfUnits: { type: String },
    occupancyCertificateAvailable: { type: String },
    reraId: { type: String },
    sourceOfFunding: { type: String },
    totalNoOfBuildings: { type: String },
    typeOfProject: { type: String },
    unitsSold: { type: String },

    // Step 2 - PropertyDetails
    directions: {
      North: { type: String },
      South: { type: String },
      East: { type: String },
      West: { type: String },
    },
    boundariesMatching: { type: String },
    plotArea: { type: String },
    isPropertyWithinLimit: { type: String },
    marketability: { type: String },
    typeOfStructure: { type: String },
    qualityOfConstruction: { type: String },
    unitFlatConfiguration: { type: String },
    noOfFloorsPermissible: { type: String },
    noOfUnitFlatOnEachFloor: { type: String },
    noOfFloorsActual: { type: String },
    approxAgeOfProperty: { type: String },
    residualAge: { type: String },
    liftAvailable: { type: String },
    constructionStage: { type: String },

    // Step 3 - ValuationDetails
    distressSaleValue: { type: String },
    distressSaleRatePerSqft: { type: String },
    distressValueOfUnsoldInventory: { type: String },
    fairMarketRatePerSqft: { type: String },
    fairMarketValue: { type: String },
    fairValueOfUnsoldInventory: { type: String },
    methodOfValuation: { type: String },
    totalArea: { type: String },
    totalUnsoldInventory: { type: String },
    unsoldInventoryRatePerSqft: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectValuation", projectValuationSchema);
