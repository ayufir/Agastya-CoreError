const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  property: {
    pincode: { type: String },
    state: { type: String },
    city: { type: String },
    district: { type: String },
    locality: { type: String },
    streetName: { type: String },
    landmark: { type: String },
    plotNo: { type: String },
    propertyType: { type: String },
    unitType: { type: String },
    revenueRecordType: { type: String },
    sanctionUsage: { type: String },
    actualUsage: { type: String },
    plotArea: { type: Number },
    propertyJurisdiction: { type: String },
    sanctionAuthorityName: { type: String },
    societyRegistered: { type: Boolean },
    uniquePropertyID: { type: String },
    propertyEntranceFacing: { type: String },
    affFlag: { type: Boolean },
    propertyTransactionType: { type: String },
    countOfProperties: { type: Number },
    doorPhotoWithNamePlate: { type: Boolean }
  },

  maintenance: {
    propertyAge: { type: Number },
    residualAge: { type: Number },
    internalMaintenance: { type: String },
    externalMaintenance: { type: String },
    boundaries: {
      east: {
        document: { type: String },
        siteVisit: { type: String },
        dimensions: { type: String }
      },
      west: {
        document: { type: String },
        siteVisit: { type: String },
        dimensions: { type: String }
      },
      north: {
        document: { type: String },
        siteVisit: { type: String },
        dimensions: { type: String }
      },
      south: {
        document: { type: String },
        siteVisit: { type: String },
        dimensions: { type: String }
      }
    },
    irregularShape: { type: Boolean },
    notDemented: { type: Boolean },
    boundariesMatching: { type: Boolean },
    remarks: { type: String },
    capturePlotSketch: { type: Boolean },
    plotDemarcated: { type: Boolean }
  },

  amenities: {
    airport: { type: Boolean },
    rickshawStop: { type: Boolean },
    busStop: { type: Boolean },
    metroStation: { type: Boolean },
    railwayStation: { type: Boolean },
    college: { type: Boolean },
    school: { type: Boolean },
    hospital: { type: Boolean },
    superMarket: { type: Boolean },
    mall: { type: Boolean },
    placeOfWorship: { type: Boolean },
    infra: { type: String },
    image: { type: String }
  },

  cautionArea: {
    anyChemicalHazard: { type: Boolean },
    nearCrematorium: { type: Boolean },
    probableRoadExtension: { type: Boolean },
    statutoryNoticesOnProperty: { type: Boolean },
    communityDominated: { type: Boolean },
    nearGarbageDump: { type: Boolean },
    propertyAccessIssues: { type: Boolean },
    underHighTensionLine: { type: Boolean },
    floodProne: { type: Boolean },
    nearNalla: { type: Boolean },
    propertyIsLandLocked: { type: Boolean },
    landReservation: { type: Boolean },
    nearToRailTrack: { type: Boolean },
    slumArea: { type: Boolean }
  },

  valuation: {
    valuationMethodology: {
      type: String,
      enum: ['sale Comparison', 'income Approach', 'cost Approach']
    },
    landData: {
      area: { type: Number },
      ratePerSqFt: { type: Number },
      amount: { type: Number }
    },
    unitValueData: [
      {
        floorDescription: { type: String },
        shortCode: { type: String },
        carpetAreaSqFt: { type: Number },
        saleableAreaSqFt: { type: Number },
        ratePerSqFt: { type: Number },
        amount: { type: Number }
      }
    ],
    totalAppraisedValue: { type: Number },
    roundOffTotal: { type: Number },
    governmentRatesData: {
      landRate: { type: Number },
      landArea: { type: Number },
      landAmount: { type: Number },
      constructionRate: { type: Number },
      constructionArea: { type: Number },
      constructionAmount: { type: Number }
    },
    constructionDetails: {
      constructionAreaSqFt: { type: Number },
      approvedCoverageSqFt: { type: Number },
      costOfConstruction: { type: Number }
    }
  },

  construction: {
    typeOfStructure: { type: String },
    structureConfiguration: { type: String },
    resolutionAmenities: { type: Number },
    recommendationAmenities: { type: Number },
    amenityCompletion: { type: Number },
    amenityRecommendation: { type: Number },
    structureCompletion: { type: Number },
    structureRecommendation: { type: Number },
    recommendedValue: { type: Number },
    comments: { type: String }
  },

  distance: {
    distanceFromCPC: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    distanceFromCityCenter: { type: Number, default: 0 },
    distanceFromICICIBank: { type: Number, default: 0 },
    latitude: { type: Number, default: 0 },
    oneWayDistance: { type: Number, default: 0 }
  },

  sitePhotos: {
    imageFile: { type: String },
    fileName: { type: String },
    uploadDate: { type: Date, default: Date.now }
  },

  remarks: {
    nfsaCheckRequired: { type: String },
    generalObservations: { type: String, maxLength: 2000 },
    raleReferences: { type: String, maxLength: 2000 },
    needsFunction: { type: String, enum: ["Yes", "No"] },
    documentName: { type: String },
    documentReference: { type: String },
    documentDate: { type: String },
    documentAuthority: { type: String },
    personName: { type: String },
    siteVisits: { type: Number, min: 1, max: 5 },
    personRole: { type: String, enum: ["Self", "Agent", "Relative", "Other"] },
    evaluationMode: { type: String },
    personContact: { type: String },
    rejectionReason: { type: String },
    verifiedBy: { type: String },
    verificationType: { type: String, enum: ["External", "Internal"] },
    visitDate: { type: String }
  }
});

module.exports = mongoose.model("ValuationForm", formSchema);
