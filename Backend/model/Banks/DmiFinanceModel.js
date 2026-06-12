const mongoose = require("mongoose");

const dmiFinanceSchema = new mongoose.Schema({
  // Application Details
  branch: String,
  applicationNumber: String,
  applicantName: String,
  product: String,
  propertyType: String,
  reportDate: String,
  dateOfVisit: String,
  visitedBy: String,

  // Property Details
  propertyAddressAsPerSite: String,
  propertyAddressAsPerDocuments: String,
  houseNo: String,
  floorNo: String,
  wingNameNo: String,
  colonyProjectName: String,
  plotPropertyDagNo: String,
  khasraSurveyNo: String,
  galiNoRoadName: String,
  sectorPhaseWard: String,
  mauzaPoliceStation: String,
  villageLocation: String,
  district: String,
  state: String,
  city: { type: String, default: "" },
  cityTehsilTalukaTown: String,
  pincode: String,
  distanceFromNearestDmiBranch: String,
  distanceFromNearestCityCentre: String,
  distanceFromLandmark: String,
  listOfDocumentsSubmitted: String,
  propertyOwnerAsPerDocuments: String,
  isSelfOccupiedPropertyByApplicant: String,
  ifNoWhoOwnsTheProperty: String,
  nameOfPersonMet: String,
  contactNoOfPersonMet: String,
  relationWithApplicant: String,
  contactNoOfApplicant: String,

  // Document Details
  documents: [
    {
      documentName: String,
      receivedType: String,
      receivedStatus: String,
      documentNo: String,
      documentDate: String,
    },
  ],

  // Four Boundaries
  fourBoundaries: {
    eastAsPerDocuments: String,
    westAsPerDocuments: String,
    northAsPerDocuments: String,
    southAsPerDocuments: String,
    eastAsPerSite: String,
    westAsPerSite: String,
    northAsPerSite: String,
    southAsPerSite: String,
  },

  // Geo Coordinates
  geoCoordinates: {
    latitude: String,
    longitude: String,
  },

  // Description of the Existing Property
  descriptionOfExistingProperty: {
    noOfKitchen: String,
    noOfToilets: String,
    noOfRooms: String,
    structureOfProperty: String,
    roofType: String,
    structureSoundnessQuality: String,
    hall: String,
    isPropertyDemarcated: String,
    frontRoadWidth: String,
    noOfFlatsOnEachFloor: String,
    heightOfBuilding: String,
    authorityLimit: String,
    ageOfProperty: String,
    residualAgeOfProperty: String,
    demolitionRisk: String,
    floodAffectedArea: String,
    landSlideAffectedArea: String,
  },

  // Valuation
  valuation: {
    particulars: [
      {
        particular: String,
        areaInSqFt: String,
        ratePerSqFt: String,
        totalValue: String,
      },
    ],
    totalFairMarketValuePresentCondition: String,
    totalFairMarketValueAfterCompletion: String,
    propertyValueAsPerCircleRate: String,
    distressSaleValue: String,
    insurableValue: String,
  },

  // Additional Details
  localityDevelopment: String,
  specialRemarks: String,
  reportStatus: String,
  reportCertification: String,
  reportDeclaration: String,

  // Signatures
  name: String,
  signatureStamp: String,
  date: String,
  place: String,
});

const DmiFinanceReport = mongoose.model("DmiFinanceReport", dmiFinanceSchema);

module.exports = DmiFinanceReport;
