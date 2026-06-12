// const mongoose = require("mongoose");

// const ICICIModelSchema = new mongoose.Schema({
//     status: { type: String
//     },
//     type: { type: String },

//     technicalAdmin: { type: String },
//     dateOfRequest: { type: String },
//     channel: { type: String },
//     branch: { type: String },
  
//       number: { type: Number },
//       name: { type: String },
//       product:{ type: String },
//       businessGroup: { type: String },
//       requestFor: { type: String },
//       selectedProduct: { type: String },
//       requestId: { type: String },
  
  
//         fileName:{ type: String },
//         originalFileName:{ type: String },
//         latitude:{ type: Number },
//         longitude: { type: String },
//         location: { type: String },
//         imageTakenDate: { type: Number},
      
   
    
//       propertyType: { type: String },
//       unitType: { type: String },
//       loan: { type: String },
      
//         fullAddress: { type: String },
//         nearestLandmark:{ type: String },
//         legalAddress: { type: String },
//         pin: { type: String },
    
     
//         name: { type: String },
//         salesManagerMobile: { type: String },
//         applicantNames: { type: String },
//         customerMobile: { type: String },
//         requestInitiatorId:{ type: String },
//         requestInitiatorName:{ type: String },
//         east:{ type: String },
//         west:{ type: String },

//         north:{ type: String },

//         sount:{ type: String },

  
      
//         location: { type: String },
//         direction: { type: String },
//         carpetAreaAgreement: { type: String },
//         saleDeedCopy: { type: String },
//         carpetAreaApp: { type: String },
//         propertyVisit: { type: String },
//     ratePerSqft: { type: String },

//         rateConfirmation: { type: String },
//         description1: { type: String },
//         govtApprovedRate: { type: String },
//         area1: { type: String },
//         amount2: { type: String },
//         superArea: { type: String },
//         areaForValuation: { type: String },
//         boundariesMatching: { type: String },
//         distanceFromOfficeKm: { type: Number },
//         siteLocation: { type: String },
//         asPerSaleDeed: { type: String },
//         actualAtSite: { type: String },
   
    
//       plotAreaSqFt: Number,
//       approvedLandUse: { type: String },
//       nameOfLocation: { type: String },
//       propertyLocation: { type: String },
//       propertyIdentification: { type: String },
//       propertyType:{ type: String },
//       propertyArea: { type: String },
//       propertyAddress: { type: String },
//       tncpLayoutPlan: { type: String },
//       costOfConstruction: { type: Number },
//       buildingEstimateCost: { type: Number },
//       totalConstructionCost:{ type: Number },
//       carpetAreaMeasured: { type: String },
//       ownershipDocument: { type: String },
//       otherObservations:  { type: String },
//       propertyInNegativeArea:  { type: String },
//       propertyInOGL:  { type: String },
//       propertyInCautionArea:  { type: String },
//       approvedMapPermission: { type: String },
//       billingCriteria:{ type: String },
//       virtualVisit: {type:String},
//       plotDemarcated:{type:String},
//       commercializedArea: {type:String},
//       classOfLocality: { type: String },
//       distanceFromCityCenter: { type: Number },
//       numberOfFloors: { type: Number },
//       toBeBilled:  {type:String},
     
//       greenHousing: {type:String},
//       natureOfLocation: { type: String },
//       roadWidth: { type: String },
//       internet: { type: String },
//       nationalizeLevel: { type: String },
//       city:{type:String},
//       structure: { type: String },
//       exterior: { type: String },
//       propertyAgeYears:{ type: Number },

   
//       floor:{ type: String },
//       rooms: { type: String },
//       kitchens: { type: String },
//       bathrooms:{ type: String },
//       usageRemarks: { type: String },
//       country: { type: String },
//       state:{type:String},
    
//       heightAboveGround: { type: String },
//       floodProne: {type:String},
//       seismicZone: { type: String },
//       crz: { type: String },
 
    
//       status:{ type: String },
//       customer: { type: String },
//       occupiedSince:{ type: String },
   
  
//       landAreaSqFt: { type: Number },
//       carpetAreaSqFt: { type: Number },
//       superBuiltUpSqFt: { type: Number },
      
     
//           name: { type: String },
//           area: { type: Number },
//           rate: { type: Number },
//           amount: { type: Number },
    
//       landRatePerSqFt: { type: Number },
//       constructedRatePerSqFt:{ type: Number },
//       constructedArea: { type: Number },
//       totalValue: { type: Number },
//       totalValueInWords: String,
//       govApprovedRate: { type: Number },
   
//       floorwiseUsage: { type: String },
//       structureDetails: { type: String },
//       stageOfConstruction: { type: String },
//       constructionStage: { type: String },
//       constructionPercentage: { type: String },
//       carParkingCount: { type: String },
//       carParkingRate: { type: String },
//       stageDescription:{ type: String },
//       carParkingValue:{ type: String },
//       totalAmenitiesCharges:{ type: String },
//       percentCompleted: { type: Number },
//       percentRecommended: { type: Number },
//       totalMarketValue:{ type: String },
//       forcedSaleValue:{ type: String },
//       reconstructionCost:{ type: String },
//       approxRentals:{ type: String },
//       onlineRecordFound:{ type: String },
  
   
//       observed: { type: String },
//       remarks: { type: String },
  
//   });

//   const ICICIModel = mongoose.model("ICICIModel", ICICIModelSchema);
  
//   module.exports = ICICIModel;
  
const mongoose = require("mongoose");

const ICICIModelSchema = new mongoose.Schema({
  name: { type: String },
  customerMobileNo: { type: String },
  reqInitiatorId: { type: String },
  salesManagerMobileNo: { type: String },
  reqInitiatorNameCPCCode: { type: String },
  locations: [
  {
    direction: String,
    boundriesMatching: String,
    distanceTravelled: Number,
    siteLocation: String,
    asPerSaleDeed: String,
    actualAtSite: String,
  }
],
  direction: { type: String },
  boundriesMatching: { type: String, default: 'YES' },
  distanceTravelled: { type: String },
  siteLocation: { type: String },
  asPerSaleDeed: { type: String },
  actualAtSite: { type: String },
  structureType: { type: String },
  structureDescription: { type: String },
  stageOfConstruction: { type: String },
  descriptionOfStage: { type: String },
  percentCompleted: { type: String },
  percentRecommended: { type: String },
  violationsObserved: { type: String },
  remarks: { type: String },
  plotArea: { type: String },
  approvedLandUse: { type: String, default: 'RESIDENTIAL' },
  nameOfLocation: { type: String, default: 'INTER-CLASS/EXECUTE' },
  propertyLocation: { type: String, default: 'DEVELOPMENT/LATENDER' },
  propertyType: { type: String, default: 'LABOR/SERIENING' },
  propertyArea: { type: String },
  city: { type: String, default: "" },
  costOfConstruction: { type: String },
  carpetAreaMeasured: { type: String, default: 'No' },
  billingCriteria: { type: String, default: 'BELS' },
  virtualVisit: { type: String },
  plotDemarcatedAtSite: { type: String, default: 'YES' },
  commercializedArea: { type: String },
  classOfLocality: { type: String, default: 'REPEAL CLASS HERE' },
  distanceFromCityCenter: { type: String },
  noOfFloors: { type: String, default: '1' },
  toBeBilled: { type: String },
  greenHousing: { type: String },
  natureOfLocation: { type: String, default: 'URBAN' },
  roadWidth: { type: String, default: 'IS' },
  structure: { type: String, default: 'GET APPLICABLE' },
  exterior: { type: String, default: 'GOOD' },
  approxPropertyAge: { type: String },
  interior: { type: String, default: 'GOOD' },
  maintenanceLevel: { type: String, default: 'GOOD' },
  residualAgeOfProperty: { type: String, default: 'IE' },
  internet: { type: String, default: 'GOOD' },
  nationalizeLevel: { type: String, default: 'GOOD' },
  status: { type: String, default: 'Work in progress' },
  type: { type: String, default: 'Individual Technical Request' },
  technicalAdmin: { type: String, default: 'SWARNIM RAYAL' },
  dateOfRequest: { type: String, default: '10/APR/2025 03:28:51 PM' },
  channel: { type: String, default: 'LOS_CHANNEL' },
  branch: { type: String, default: '(10816) DEHRADUN SOUTH' },
  applicationNo: { type: String, default: '77000019932' },
  customerName: { type: String, default: 'NARAYAN KHARKA CHHETRI' },
  productType: { type: String, default: 'NON HOME LOAN' },
  businessGroup: { type: String, default: 'HFCMORTGAGES' },
  requestFor: { type: String, default: 'HFC' },
  products: { type: String },
  image1: { type: String },
  image2: { type: String },
  fileName: { type: String },
  originalFileName: { type: String },
  latitude: { type: String },
  longitude: { type: String },
  location: { type: String },
  imageDate: { type: String },
  propertyType: { type: String },
  unitType: { type: String },
  loanType: { type: String },
  propertyAddress: { type: String },
  landmark: { type: String },
  legalAddress: { type: String },
  pin: { type: String }
});

const ICICIModel = mongoose.model("ICICIModel", ICICIModelSchema);

module.exports = ICICIModel;
