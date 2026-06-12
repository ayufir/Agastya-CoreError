// const mongoose = require('mongoose');

// const SamstaflnModeltSchema = new mongoose.Schema({
//   branchName: {
//     type: String,
//   },
//   typeOfCase: {
//     type: String,
//   },
//   valuerName: {
//     type: String,
//   },
//   dateOfVisit: {
//     type: String,
//   },
//   lanNo: {
//     type: String,
//   },
//   valuationResult: {
//     type: String,
//   },
//   dateOfReport: {
//     type: String,
//   },
//   contactPerson: {
//     type: String,
//   },
//   applicantName: {
//     type: String,
//   },
//   propertyOwner: {
//     type: String,
//   },
//   documentHolder: {
//     type: String,
//   },
//   originallyTypeOfProperty: {
//     type: String,
//   },
//   currentUsage: {
//     type: String,
//   },
  
//     request: {
//     type: String,
//   },
//     site: {
//     type: String,
//   },
//     document: {
//     type: String,
//   },
//     pinCode: {
//     type: String,
//   },
//     latitude: {
//     type: String,
//   },
 
//   locality: {
//     type: String,
//   },
//   previousValuation: {
//     type: String,
//   },
//   surroundings: {
//     type: String,
//   },
//     locationType: {
//     type: String,
//   },
//     localityLevel: {
//     type: String,
//   },
//     siteDevelopment: {
//     type: String,
//   },
//     civicProximityKm: {
//     type: String,
//   },
//     railwayStationDistanceKm: {
//     type: String,
//   },g,
//     busStopDistanceKm: {
//     type: String,
//   },
//     landmark: {
//     type: String,
//   },
//     cityCenterDistanceKm: {
//     type: String,
//   },
//     roadCondition: {
//     type: String,
//   },
//     physicalApproach: String,
//     legalApproach: String,
//     otherFeatures: String,
//   },
//   propertyDetails: {
//     occupantStatus: String,
//     occupantName: String,
//     occupantRelation: String,
//     demarcation: Boolean,
//     identified: Boolean,
//     identifiedThrough: String,
//     structureType: String,
//     landArea: Number,
//     floors: String,
//     rooms: String,
//     applicableArea: Number,
//     viewRemarks: String,
//     constructionQuality: {
//       exterior: String,
//       interior: String,
//     },
//     propertyAge: Number,
//     residualLife: Number,
//   },
//   sanctionPlan: {
//     planProvided: Boolean,
//     ownershipType: String,
//     documentsVerified: Boolean,
//     withinMunicipalLimits: String,
//     permissibleUsage: String,
//     underDemolitionList: String,
//     floorWiseArea: [{
//       floor: String,
//       sanctioned: String,
//       constructed: String,
//       deviation: String,
//     }],
//   },
//   valuation: {
//     constructedArea: {
//       type: String,
//       landArea: Number,
//       landRate: Number,
//       landValue: Number,
//       constructionArea: Number,
//       constructionRate: Number,
//       constructionValue: Number,
//     },
//     amenitiesCharges: Number,
//     marketValue: Number,
//     guidelineValue: Number,
//     forcedSaleValue: Number,
//     rentalValue: String,
//   },
//   boundaries: {
//     deed: {
//       east: String,
//       west: String,
//       north: String,
//       south: String,
//     },
//     site: {
//       east: String,
//       west: String,
//       north: String,
//       south: String,
//     },
//     matching: Boolean,
//   },
//   remarks: [String],
//   declaration: {
//     engineerName: String,
//     authorizedSignatory: Boolean,
//   },
// }, { timestamps: true });




//  const SamstaflnModelt = mongoose.model("SamstaflnModel", SamstaflnModeltSchema);
  
//   module.exports = SamstaflnModelt;
  




const mongoose = require('mongoose');

const SamstaflnSchema = new mongoose.Schema({
  branchName: { type: String },
  addressAsPerDocument: { type: String },
  addressAsPerRequest: { type: String },
  addressAtSite: { type: String },
  ageOfProperty: { type: String },
  amenitiesAvailable: { type: String },
  amount: { type: String },
  applicableArea: { type: String },
  applicantsName: { type: String },
  authorizedSignatory: { type: String },
  basementFloor: { type: String },
  boundariesAsPerDeed: { type: String },
  boundariesAtSite: { type: String },
  boundariesMatching: { type: String },
  busStop: { type: String },
  carParking: { type: String },
  closeVicinity: { type: String },
  constructionRate: { type: String },
  contactedPerson: { type: String },
  currentUsage: { type: String },
  dateOfReport: { type: String }, // Specify the type here
  dateOfVisit: { type: String },
  declaration: { type: String },
  deliveryAgency: { type: String },
  description: { type: String },
  deviation: { type: String },
  distanceFromCityCenter: { type: String },
  documentHolder: { type: String },
  eastBoundary: { type: String },
  engineerName: { type: String },
  exteriors: { type: String },
  firstFloor: { type: String },
  forcedSaleValue: { type: String },
  fourthFloor: { type: String },
  groundFloor: { type: String },
  guidelineValue: { type: String },
  interiors: { type: String },
  lanNo: { type: String },
  landArea: { type: String },
  landPlotArea: { type: String },
  latitude: { type: String },
  legalApproach: { type: String },
  locality: { type: String },
  longitude: { type: String },
  mainLocality: { type: String },
  nameOfOccupant: { type: String },
  noOfBlocks: { type: String },
  noOfFloors: { type: String },
  noOfLifts: { type: String },
  noOfRooms: { type: String },
  noOfUnitsOnFloor: { type: String },
  northBoundary: { type: String },
  originalPropertyType: { type: String },
  other: { type: String },
  otherFeatures: { type: String },
  ownershipType: { type: String },
  permissibleUsage: { type: String },
  physicalApproach: { type: String },
  pinCode: { type: String },
  powerBackup: { type: String },
  previousValuation: { type: String },
  propertyDemarcation: { type: String },
  propertyDocumentsVerified: { type: String },
  propertyFloorNumber: { type: String },
  propertyIdentified: { type: String },
  propertyIdentifiedThrough: { type: String },
  propertyOwner: { type: String },
  propertyUnderDemolition: { type: String },
  propertyWithinMunicipalLimits: { type: String },
  proximityToAmenities: { type: String },
  qualityOfConstruction: { type: String },
  railwayStation: { type: String },
  rate: { type: String },
  relationWithApplicant: { type: String },
  remarks: { type: String },
  remarksOnView: { type: String },
  residualLife: { type: String },
  roadCondition: { type: String },
  sanctionedPermissibleArea: { type: String },
  sanctionedPlans: { type: String },
  secondFloor: { type: String },
  siteDevelopment: { type: String },
  southBoundary: { type: String },
  stageOfConstruction: { type: String },
  stageOfRecommendation: { type: String },
  thirdFloor: { type: String },
  totalAmenitiesCharges: { type: String },
  totalConstructed: { type: String },
  totalMarketValue: { type: String },
  typeOfCase: { type: String },
  typeOfStructure: { type: String },
  vacantOccupied: { type: String },
  valuerName: { type: String },
  westBoundary: { type: String }
});

const SamstaflnModel = mongoose.model("SamstaflnModel", SamstaflnSchema);

module.exports = SamstaflnModel;
