// models/BajajAmeriya.js

const mongoose = require("mongoose");

// const BajajAmeriyaSchema = new mongoose.Schema(
//   {
//     fileNumber: String,
//     reportDate: Date,

//     applicantDetails: {
//       applicantName: String,
//       contactPersonName: String,
//       contactNumber: String,
//       loanType: String,
//       personMetAtSite: String,
//     },

//     ownershipDetails: {
//       propertyOwners: [String],
//       documentsProvided: String,
//     },

//     address: {
//       postalAddress: String,
//       localityName: String,
//       nearbyLandmark: String,
//       distanceFromHub: String,
//       legalAddress: String,
//       addressMatching: Boolean,
//       jurisdiction: String,
//     },

//     propertyDetails: {
//       propertyHoldingType: String,
//       marketability: String,
//       typeOfProperty: String,
//       occupancyStatus: String,
//       distanceFromNH_SH: String,
//     },

//     boundaryDetails: {
//       legal: {
//         east: String,
//         west: String,
//         north: String,
//         south: String,
//       },
//       siteVisit: {
//         east: String,
//         west: String,
//         north: String,
//         south: String,
//       },
//       plan: {
//         east: String,
//         west: String,
//         north: String,
//         south: String,
//       },
//       boundaryMismatch: String,
//       propertyIdentified: Boolean,
//     },

//     approvedPlan: {
//       layoutPlanDetails: String,
//       constructionPlanDetails: String,
//       planValidity: String,
//       approvedAuthority: String,
//       approvedUsage: String,
//     },

//     technicalDetails: {
//       constructionQuality: String,
//       numberOfLifts: Number,
//       currentOccupant: String,
//       floorOccupancy: String,
//     },

//     builtUpAreaDetails: [
//       {
//         floorLevel: String,
//         numberOfRooms: Number,
//         numberOfKitchens: Number,
//         numberOfBathrooms: Number,
//         numberOfHalls: Number,
//         sanctionUsage: String,
//         actualUsage: String,
//       },
//     ],

//     additionalStructures: String,

//     plotAreaDetails: {
//       eastToWest: {
//         asPerDocs: String,
//         asPerPlan: String,
//         asPerSiteVisit: String,
//       },
//       northToSouth: {
//         asPerDocs: String,
//         asPerPlan: String,
//         asPerSiteVisit: String,
//       },
//       landAreaSqft: {
//         asPerDocs: Number,
//         asPerPlan: String,
//         asPerSiteVisit: Number,
//       },
//     },

//     permissibleAreaDetails: [
//       {
//         floorLevel: String,
//         permissibleAreaPlan: Number,
//         landComponent: Number,
//         permissibleFSI: Number,
//         permissibleConstruction: Number,
//         permissibleWith140Percent: Number,
//         actualConstructionBUA: Number,
//         fsiViolationPercent: Number,
//       },
//     ],

//     valuationAssessment: {
//       riskOfDemolition: String,
//       valuationAsPerBFLNorms: Boolean,
//       propertyStatus: String,
//       completionPercent: Number,
//       propertyAge: Number,
//       residualAge: Number,
//       landValue: {
//         area: Number,
//         ratePerSft: Number,
//         total: Number,
//       },
//       buaValue: {
//         area: Number,
//         ratePerSft: Number,
//         total: Number,
//       },
//       depreciation: Number,
//       carParking: Number,
//       otherCharges: Number,
//       fairMarketValue: Number,
//       govtValueRatePerSqft: String,
//       distressedValue: Number,
//       earlierValuation: Boolean,
//       demolitionList: Boolean,
//       negativeArea: Boolean,
//     },

//     remarks: [String],

//     panchayatChecks: {
//       approachRoad: String,
//       surroundingDevelopment: String,
//       distanceFromCityCenter: Number,
//       distanceFromCorpLimits: Number,
//       electricity: String,
//       electricityDistributor: String,
//       waterSupply: String,
//       waterDistributor: String,
//       sewerProvision: Boolean,
//       sewerConnectedToMain: Boolean,
//       demolitionThreat: Boolean,
//     },

//     geoTagging: {
//       latitude: Number,
//       longitude: Number,
//     },

//     satelliteImage: String, // could be a URL

//     declaration: [String],

//     agencyDetails: {
//       agencyName: String,
//       agencyCode: String,
//       agencyLoginIP: String,
//       agencyGeoLocation: {
//         latitude: String,
//         longitude: String,
//       },
//       agencyUsername: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

const BajajAmeriyaSchema = new mongoose.Schema(
  {
    // Agency and Basic Information
    agencyName: String,
    fileNo: String,
    reportDate: String,
    applicantName: String,
    contactPerson: String,
    contactNo: String,
    loanType: String,
    personMet: String,
    personContact: String,
    ownerName: String,
    
    documentsProvided: String,

    // Property Address Details
    postalAddress: String,
    locality: String,
    landmark: String,
    distanceFromHub: String,
    legalAddress: String,
    addressMatching: String,
    municipalBody: String,
    holdingType: String,
    marketability: String,
    propertyType: String,
    occupancyStatus: String,
    distanceFromNH: String,

    // Property Schedule Details
    scheduleLegalEast: String,
    scheduleLegalWest: String,
    scheduleLegalNorth: String,
    scheduleLegalSouth: String,
    scheduleSiteEast: String,
    scheduleSiteWest: String,
    scheduleSiteNorth: String,
    scheduleSiteSouth: String,
    schedulePlanEast: String,
    schedulePlanWest: String,
    schedulePlanNorth: String,
    schedulePlanSouth: String,
    boundaryMatch: String,
    propertyIdentified: String,

    // Construction Details
    layoutPlanDetails: String,
    constructionPlanDetails: String,
    planValidity: String,
    approvedAuthority: String,
    approvedUsage: String,
    constructionQuality: String,
    noOfLifts: String,
    currentOccupant: String,
    accommodationDetails: String,
    floorLevel: String,
    noOfRooms: String,
    noOfKitchens: String,
    noOfBathrooms: String,
    noOfHalls: String,
    sanctionUsage: String,
    actualUsage: String,
    additionalStructures: String,
    eastWest: String,
    northSouth: String,
    landArea: String,

    // Infrastructure Details
    approachRoad: String,
    surroundingDevelopment: String,
    distanceCityCentre: String,
    distanceCorpLimits: String,
    electricity: String,
    electricityDistributor: String,
    waterSupply: String,
    waterDistributor: String,
    sewerProvision: String,
    sewerLineConnected: String,
    demolitionThreat: String,
    latitude: String,
    longitude: String,
    agencyGeoLocation: String,
    agencyUsername: String,

    // Valuation Details
    permissibleArea: String,
    landComponent: String,
    permissibleFSI: String,
    permissibleConstruction: String,
    construction140Percent: String,
    actualConstruction: String,
    fsiViolation: String,
    riskOfDemolition: String,
    valuationDone: String,
    statusOfProperty: String,
    completionPercentage: String,
    currentAgeOfProperty: Number,
    residualAge: Number,
    landValue: String,
    buaValue: String,
    depreciation: String,
    carParking: String,
    amenitiesCharges: String,
    fairMarketValue: String,
    govtValue: String,
    distressedValue: String,
    valuationDoneEarlier: String,
    demolitionList: String,
    negativeArea: String,
    remarks: String,
      city: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BajajAmeriya", BajajAmeriyaSchema);
