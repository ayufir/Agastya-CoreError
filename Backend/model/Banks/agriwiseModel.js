const mongoose = require("mongoose");

const boundariesSchema = new mongoose.Schema(
  {
    east: { type: String, required: true },
    west: { type: String, required: true },
    north: { type: String, required: true },
    south: { type: String, required: true },
  },
  { _id: false }
);

const agriwiseSchema = new mongoose.Schema(
  {
    valuationAgency: { type: String, required: true },
    city: { type: String, default: "" },
    dateOfValuation: { type: String, required: true },
    proposalNo: { type: String, required: true },
    caseType: { type: String, required: true },
    inspectionDate: { type: String, required: true },
    nearestLandmark: { type: String, required: true },
    customerName: { type: String, required: true },
    sellerName: { type: String, required: true },
    propertyAddress: { type: String, required: true },
    propertyStatus: { type: String, required: true },
    propertyType: { type: String, required: true },
    developedBy: { type: String },
    typeOfLocality: { type: String, required: true },
    inspectionSiteVisitDate: { type: String, required: true },
    occupationStatus: { type: String, required: true },
    propertyUsage: { type: String, required: true },
    plotDemarcation: { type: String, required: true },
    propertyIdentifiable: { type: String, required: true },
    withinMC_GPLimit: { type: String, required: true },
    typeOfStructure: { type: String, required: true },
    floorsInBuilding: { type: String, required: true },
    locatedOnFloorNo: { type: String, required: true },
    yearOfCompletion: { type: String, required: true },
    constructionStage: { type: String, required: true },
    disbursementRecommended: { type: String, required: true },
    ageOfProperty: { type: Number, required: true },
    futurePhysicalLife: { type: Number, required: true },
    saleDeed: { type: String, required: true },
    statusOfLandHolding: { type: String, required: true },
    typeOfProperty: { type: String, required: true },
    occupationStatusInspection: { type: String, required: true },
    propertyUsageInspection: { type: String, required: true },
    plotDemarcationInspection: { type: String, required: true },
    identifiedThrough: { type: String, required: true },
    internalFinishing: { type: String, required: true },
    noOfFloorsInBuildingInspection: { type: String, required: true },
    totalNoOfFlatsUnitInBuilding: { type: String },
    constructionStageOfPropertyInspection: { type: String, required: true },
    ageOfThePropertyInYearInspection: { type: Number, required: true },
    futurePhysicalLifeOfPropertyInYearInspection: {
      type: Number,
      required: true,
    },
    boundaries: { type: boundariesSchema, required: true },
    boundariesMatching: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agriwise", agriwiseSchema);
