const getDimensionParts = (value = "") => {
    const match = String(value)
        .replace(/,/g, " ")
        .match(/([\d.]+)\s*(?:ft|feet|m|mt|meter|meters)?\s*[xX*]\s*([\d.]+)/);

    if (!match) {
        return { width: null, depth: null };
    }

    return {
        width: match[1],
        depth: match[2],
    };
};

export const TRENCH_MAPPING = {
    propertyAddress: [
        "addressSite",
        "addressLegal",
        "property.address.full_address",
        "propertyName",
    ],
    visitedPersonName: [
        "personMetDuringVisit",
        "property.contact_person",
        "customerName",
    ],
    contactNumber: [
        "personContactNo",
        "customerNo",
        "property.contact_number",
        "contactNumber",
    ],
    latitude: ["latitude", "property.latitude"],
    longitude: ["longitude", "property.longitude"],
};

export const ADITYA_MAPPING = {
    "basicDetails.nameOfValuer": "valuerName",
    "basicDetails.nameOfClient": ["clientName", "customerName"],
    "basicDetails.nameOfPropertyOwner": "propertyOwnerName",
    "basicDetails.caseReferenceNumber": ["caseReferenceNumber", "refNo"],
    "basicDetails.vertical": "vertical",
    "basicDetails.initiationDate": ["initiationDate", "dateOfReport"],
    "basicDetails.visitDate": ["visitDate", "dateOfReport"],
    "basicDetails.reportDate": ["reportDate", "dateOfReport"],
    "locationDetails.propertyAddressAsTRF": [
        "addressLegal",
        "addressSite",
        "propertyName",
    ],
    "locationDetails.propertyAddressAsVisit": [
        "addressSite",
        "addressLegal",
        "propertyName",
    ],
    "locationDetails.propertyAddressAsDocs": [
        "addressLegal",
        "addressSite",
        "propertyName",
    ],
    "locationDetails.mainLocality": ["mainLocality", "city"],
    "locationDetails.subLocality": ["subLocality", "colonyArea", "villageName", "city"],
    "locationDetails.latitude": "latitude",
    "locationDetails.longitude": "longitude",
    "locationDetails.typeOfProperty": ["usageOfProperty", "zone"],
    "locationDetails.currentUsage": "usageOfProperty",
    "locationDetails.propertyType": ["usageOfProperty", "zone"],
    "locationDetails.propertySubType": ["propertySubType", "unitType"],
    "locationDetails.dimensionWidth": (data) =>
        data.dimensionWidth || getDimensionParts(data.linearDimension).width,
    "locationDetails.dimensionDepth": (data) =>
        data.dimensionDepth || getDimensionParts(data.linearDimension).depth,
    "locationDetails.microLocation": "microLocation",
    "locationDetails.landmark": "landmark",
    "locationDetails.valuatorDoneBefore": "valuatorDoneBefore",
    "locationDetails.ifYesWhen": "ifYesWhen",
    "locationDetails.locality": "locality",
    "locationDetails.propertyFallingWithin": "propertyFallingWithin",
    "locationDetails.occupancyLevel": "occupancyLevel",
    "locationDetails.conditionOfSite": "conditionOfSite",
    "locationDetails.distanceRailwayStation": "distanceRailwayStation",
    "locationDetails.distanceBusStop": "distanceBusStop",
    "locationDetails.distancePlotMainRoad": "distancePlotMainRoad",
    "locationDetails.distanceCityCentre": "distanceCityCentre",
    "locationDetails.distanceABCLBranch": "distanceABCLBranch",
    "locationDetails.widthApproachRoad": "widthApproachRoad",
    "locationDetails.physicalApproach": "physicalApproach",
    "locationDetails.legalApproach": "legalApproach",
    "locationDetails.otherFeatures": "otherFeatures",
    "documentDetails.saleDeedDetails": (data) => {
        const isSaleDeed = !data.document_type || ["SALE", "DEED", "OWNERSHIP", "ALLOTMENT", "CONVEYANCE", "REGISTRY", "RESTRY", "LEASE", "GIFT", "PARTITION"].some(t => String(data.document_type).toUpperCase().includes(t));
        if (isSaleDeed) {
            return data.saleDeedDetails || data.numberAndDate || data.documentsAvailable;
        }
        return null;
    },
    "documentDetails.sanctionedPlanDetails": "sanctionedPlanDetails",
    "documentDetails.ccOcDetails": "ccOcDetails",
    "documentDetails.agreementToSaleDetails": "agreementToSaleDetails",
    "documentDetails.mutationPossessionDetails": "mutationPossessionDetails",
    "documentDetails.taxReceiptDetails": "taxReceiptDetails",
    "documentDetails.electricityBillDetails": "electricityBillDetails",
    "documentDetails.conversionDetails": "conversionDetails",
    "propertyDetails.occupancy": "occupancy",
    "propertyDetails.occupiedBy": "occupiedBy",
    "propertyDetails.occupiedSince": "occupiedSince",
    "propertyDetails.nameOfOccupant": ["nameOfOccupant", "personMetDuringVisit", "customerName"],
    "propertyDetails.propertyDemarcated": "propertyDemarcated",
    "propertyDetails.propertyIdentification": "propertyIdentification",
    "propertyDetails.identificationThrough": "identificationThrough",
    "boundaryDetails.northAsPerDocs": "northDocument",
    "boundaryDetails.southAsPerDocs": "southDocument",
    "boundaryDetails.eastAsPerDocs": "eastDocument",
    "boundaryDetails.westAsPerDocs": "westDocument",
    "boundaryDetails.northActual": "northActual",
    "boundaryDetails.southActual": "southActual",
    "boundaryDetails.eastActual": "eastActual",
    "boundaryDetails.westActual": "westActual",
    "boundaryDetails.boundaryMatching": (data) =>
        data.boundariesMatching || "YES",

    // Accommodation details
    "accommodationDetails.typeOfStructure": ["typeOfStructure", "type_of_structure"],
    "accommodationDetails.propertyHolding": ["propertyHolding", "ownershipType"],
    "accommodationDetails.totalNoOfFloors": "totalNoOfFloors",
    "accommodationDetails.ageOfProperty": "ageOfProperty",
    "accommodationDetails.residualAge": "residualAge",
    "accommodationDetails.projectCategory": "projectCategory",
    "accommodationDetails.flatType": "flatType",
    "accommodationDetails.flatConfiguration": "flatConfiguration",
    "accommodationDetails.areaOfFlat": "areaOfFlat",
    "accommodationDetails.liftFacility": "liftFacility",
    "accommodationDetails.amenities": "amenities",
    "accommodationDetails.marketability": "marketability",
    "accommodationDetails.viewOfProperty": "viewOfProperty",
    "accommodationDetails.parkingFacility": "parkingFacility",
    "accommodationDetails.qualityOfConstruction": "qualityOfConstruction",
    "accommodationDetails.typeOfParking": "typeOfParking",
    "accommodationDetails.shapeOfProperty": "shapeOfProperty",
    "accommodationDetails.placementOfProperty": "placementOfProperty",
    "accommodationDetails.exteriorsOfProperty": "exteriorsOfProperty",
    "accommodationDetails.interiorsOfProperty": "interiorsOfProperty",
    "accommodationDetails.sourceOfAge": "sourceOfAge",
    "accommodationDetails.maintenanceOfProperty": "maintenanceOfProperty",
    "accommodationDetails.cautiousLocation": "cautiousLocation",

    // Valuation details
    "valuationDetails.plotAreaInDeed": ["plotAreaInDeed", "plotArea", "landArea"],
    "valuationDetails.plotAreaPhysical": ["plotAreaPhysical", "plotArea", "landArea"],
    "valuationDetails.plotAreaPhysicalRate": "plotAreaPhysicalRate",
    "valuationDetails.builtUpAreaNorms": ["builtUpAreaNorms", "plotArea", "landArea"],
    "valuationDetails.builtUpAreaNormsRate": "builtUpAreaNormsRate",
    "valuationDetails.builtUpAreaTinShed": ["builtUpAreaTinShed", "plotArea", "landArea"],
    "valuationDetails.builtUpTinShedRate": "builtUpTinShedRate",
    "valuationDetails.superBuiltUpArea": "superBuiltUpArea",
    "valuationDetails.superBuiltUpRate": "superBuiltUpRate",
    "valuationDetails.carpetAreaPlan": "carpetAreaPlan",
    "valuationDetails.carpetAreaPlanRate": "carpetAreaPlanRate",
    "valuationDetails.carpetAreaMeasurement": "carpetAreaMeasurement",
    "valuationDetails.carpetAreaMeasRate": "carpetAreaMeasRate",
    "valuationDetails.carPark": "carPark",
    "valuationDetails.carParkRate": "carParkRate",
    "valuationDetails.amenitiesVal": "amenitiesVal",
    "valuationDetails.amenitiesRate": "amenitiesRate",
    "valuationDetails.totalValue": "totalValue",
    "valuationDetails.distressValue80": ["distressValue", "totalValue"],
    "valuationDetails.insuranceValue": "insuranceValue",
    "valuationDetails.governmentValue": "governmentValue",
    "valuationDetails.percentageCompletion": "completionPercentage",
    "valuationDetails.percentageRecommendation": "recommendationPercentage",

    // Setbacks
    "setbacks.frontAsPerPlan": "frontAsPerPlan",
    "setbacks.frontActual": "frontActual",
    "setbacks.rearAsPerPlan": "rearAsPerPlan",
    "setbacks.rearActual": "rearActual",
    "setbacks.side1AsPerPlan": "side1AsPerPlan",
    "setbacks.side1Actual": "side1Actual",
    "setbacks.side2AsPerPlan": "side2AsPerPlan",
    "setbacks.side2Actual": "side2Actual",

    // Built Up Area
    "builtUpArea.groundFloorAsPerSite": "groundFloorAsPerSite",
    "builtUpArea.groundFloorDeviation": "groundFloorDeviation",
    "builtUpArea.groundFloorDevRmk": "groundFloorDevRmk",
    "builtUpArea.groundFloorRmk": "groundFloorRmk",
    "builtUpArea.firstFloorAsPerSite": "firstFloorAsPerSite",
    "builtUpArea.firstFloorDeviation": "firstFloorDeviation",
    "builtUpArea.firstFloorDevRmk": "firstFloorDevRmk",
    "builtUpArea.firstFloorRmk": "firstFloorRmk",
    "builtUpArea.totalBuiltUp": "totalBuiltUp",
    "builtUpArea.totalDeviation": "totalDeviation",

    // Engineer details
    "engineerDetails.nameOfEngineerVisited": "visitedEngineer",
    "engineerDetails.nameOfAppraiser": "appraiserName",
    "engineerDetails.reportPreparedBy": "preparedBy",
    "engineerDetails.reportFinalizedBy": "finalizedBy",
};

export const MANAPPURAM_MAPPING = {
    "header.valueName": "valuerName",
    "header.caseRefNo": ["caseReferenceNumber", "refNo"],
    "header.dateOfVisit": ["visitDate", "dateOfReport"],
    "header.dateOfReport": ["reportDate", "dateOfReport"],
    "header.contactedPerson": (data) =>
        [data.personMetDuringVisit || data.customerName || data.clientName, data.contactNumber || data.customerNo]
            .filter(Boolean)
            .join(" / "),
    "propertyInfo.applicantName": ["customerName", "clientName"],
    "propertyInfo.ownerName": ["propertyOwnerName", "ownerName"],
    "propertyInfo.documentProduced": ["documentsAvailable", "document_type"],
    "propertyInfo.typeOfProperty": ["typeOfStructure", "usageOfProperty", "unitType"],
    "propertyInfo.currentUsage": "usageOfProperty",
    "propertyInfo.holdingType": ["propertyHolding", "ownershipType"],
    "propertyInfo.propertyUsage": "usageOfProperty",
    "propertyInfo.measurementOfProperty": ["linearDimension", "landArea", "plotArea"],
    "propertyInfo.addressAtSite": [
        "addressSite",
        "addressLegal",
        "propertyName",
    ],
    "propertyInfo.addressAsPerDocument": [
        "addressLegal",
        "addressSite",
        "propertyName",
    ],
    "propertyInfo.landmark": ["landmark", "propertyName"],
    "propertyInfo.locationOfProperty": (data) => {
        const fallingWithin = String(data.propertyFallingWithin || "").toLowerCase();
        const micro = String(data.microLocation || "").toLowerCase();
        const loc = String(data.locality || "").toLowerCase();
        if (fallingWithin.includes("panchayat") || micro.includes("rural") || loc.includes("rural")) {
            return "RURAL";
        }
        if (fallingWithin.includes("corporation") || micro.includes("metro") || loc.includes("metro")) {
            return "METROPOLITAN";
        }
        if (fallingWithin.includes("municipality") || fallingWithin.includes("municipal council") || micro.includes("urban") || loc.includes("urban")) {
            return "URBAN";
        }
        if (fallingWithin.includes("town") || fallingWithin.includes("tp") || micro.includes("semi") || loc.includes("semi")) {
            return "SEMI URBAN";
        }
        return "RURAL";
    },
    "propertyInfo.distanceFromBranch": ["distanceABCLBranch", "distanceCityCentre", "distanceRailwayStation", "distanceBusStop"],
    "propertyInfo.usageAuthorized": ["usageOfProperty", "zone"],
    "propertyInfo.usageRestriction": (data) => data.adverseFactors || "No",
    "propertyInfo.occupancyStatus": ["occupancy", "occupancyStatus"],
    "siteBoundaries.northDoc": "northDocument",
    "siteBoundaries.southDoc": "southDocument",
    "siteBoundaries.eastDoc": "eastDocument",
    "siteBoundaries.westDoc": "westDocument",
    "siteBoundaries.northActual": "northActual",
    "siteBoundaries.southActual": "southActual",
    "siteBoundaries.eastActual": "eastActual",
    "siteBoundaries.westActual": "westActual",
    "siteBoundaries.boundariesTallied": (data) =>
        data.boundariesMatching ? "YES" : "NO",
    "accessibility.connectivity": "connectivity",
    "accessibility.siteAccess": (data) => {
        const val = String(data.siteAccess || data.physicalApproach || "").toLowerCase();
        if (val.includes("clear") || val.includes("well") || val.includes("good") || val.includes("dev")) {
            if (val.includes("partially") || val.includes("under")) return "UNDER DEV";
            return "WELL DEV";
        }
        if (val.includes("no") || val.includes("not") || val.includes("bad")) {
            return "NO ACCESS";
        }
        return "WELL DEV";
    },
    "accessibility.typeWidthOfRoad": "widthApproachRoad",
    "accessibility.withinMunicipalLimits": "propertyFallingWithin",
    "accessibility.proximityToAmenities": "proximityToAmenities",
    "accessibility.commentsOnProperty": "commentsOnProperty",
    "accessibility.adverseFactors": "adverseFactors",
    "municipalDetails.currentAgeProperty": "ageOfProperty",
    "municipalDetails.estimatedResidualAge": "residualAge",
    "municipalDetails.sanctionPlanProvided": "sanctionPlanProvided",
    "municipalDetails.dateOfSanction": "dateOfSanction",
    "municipalDetails.sanctionedArea": "sanctionedArea",
    "municipalDetails.municipalCompliance": "municipalCompliance",
    "technicalDetails.constructionType": "typeOfStructure",
    "technicalDetails.noOfFloors": "totalNoOfFloors",
    "technicalDetails.totalLandArea": ["plotAreaPhysical", "plotAreaInDeed", "plotArea", "landArea"],
    "technicalDetails.totalBuiltUpArea": ["builtUpAreaNorms", "superBuiltUpArea"],
    "technicalDetails.totalFloorArea": ["totalBuiltUp", "builtUpAreaNorms", "superBuiltUpArea"],
    "technicalDetails.percentCompletion": "completionPercentage",
    "technicalDetails.currentAge": "ageOfProperty",
    "technicalDetails.estimatedResidualAge": "residualAge",
    "technicalDetails.independentAccess": "independentAccess",
    "valuationGLR.landArea": ["plotAreaInDeed", "plotArea", "landArea"],
    "valuationGLR.landRate": "landRate",
    "valuationPMR.landArea": ["plotAreaPhysical", "plotArea", "landArea"],
    "valuationPMR.landRate": "landRate",
    "valuationPMR.constructionArea": ["builtUpAreaNorms", "superBuiltUpArea"],
    "valuationPMR.constructionRate": "constructionRate",
    "valuationPMR.totalValue": "totalValue",
    "distressValue": ["distressValue", "forcedSaleValue"],
    "summary.propertyAddress": [
        "addressLegal",
        "addressSite",
        "propertyName",
    ],
    "summary.propertyType": ["unitType", "usageOfProperty"],
    "summary.applicantName": ["customerName", "clientName"],
    "summary.presentMarketValue": "totalValue",
    "summary.forcedSaleValue": ["distressValue", "forcedSaleValue"],
    "summary.coordinates": (data) =>
        data.latitude && data.longitude
            ? `${data.latitude}, ${data.longitude}`
            : null,
};

export const ICICI_MAPPING = {
    // 1. Property Details
    "pincode": "pincode",
    "state": "state",
    "city": "city",
    "district": "district",
    "locality": "locality",
    "landmark": "landmark",
    "plotNo": "plotNo",
    "propertyType": ["usageOfProperty", "zone"],
    "unitType": ["unitType", "propertySubType"],
    "sanctionUsage": ["sanctionUsage", "usageOfProperty"],
    "actualUsage": "usageOfProperty",
    "propertyJurisdiction": "propertyJurisdiction",
    "sanctionAuthorityName": "sanctionAuthorityName",
    "constructionStatus": "constructionStatus",
    "propertyEntranceFacing": "propertyEntranceFacing",
    "floorNumber": "floorNumber",
    "countOfProperties": "countOfProperties",

    // 2. Maintenance & Boundaries
    "propertyAge": "ageOfProperty",
    "residualAge": "residualAge",
    "internalMaintenance": "internalMaintenance",
    "externalMaintenance": "externalMaintenance",
    "eastDocument": "eastDocument",
    "eastSiteVisit": "eastActual",
    "eastDimensions": "eastDimensions",
    "westDocument": "westDocument",
    "westSiteVisit": "westActual",
    "westDimensions": "westDimensions",
    "northDocument": "northDocument",
    "northSiteVisit": "northActual",
    "northDimensions": "northDimensions",
    "southDocument": "southDocument",
    "southSiteVisit": "southActual",
    "southDimensions": "southDimensions",

    // 3. Amenities
    "airport": "airport",
    "busStop": "busStop",
    "metroStation": "metroStation",
    "railwayStation": "railwayStation",
    "college": "college",
    "school": "school",
    "hospital": "hospital",
    "superMarket": "superMarket",
    "mall": "mall",
    "placeOfWorship": "placeOfWorship",
    "rickshawStop": "rickshawStop",

    // 4. Caution Area
    "anyChemicalHazard": "anyChemicalHazard",
    "nearCrematorium": "nearCrematorium",
    "probableRoadExtension": "probableRoadExtension",
    "statutoryNoticesOnProperty": "statutoryNoticesOnProperty",
    "communityDominated": "communityDominated",
    "nearGarbageDump": "nearGarbageDump",
    "propertyAccessIssues": "propertyAccessIssues",
    "underHighTensionLine": "underHighTensionLine",
    "floodProne": "floodProne",
    "nearNalla": "nearNalla",
    "propertyIsLandLocked": "propertyIsLandLocked",
    "landReservation": "landReservation",
    "nearToRailTrack": "nearToRailTrack",
    "slumArea": "slumArea",

    // 5. Realizable Value
    "landDataArea": ["landArea", "plotAreaInDeed", "plotAreaPhysical", "plotArea"],
    "landDataRatePerSqFt": "landRate",
    "landDataAmount": "landAmount",
    "totalAppraisedValue": "totalValue",
    "roundOffTotal": "roundOffTotal",
    "govtLandRate": "govtLandRate",
    "govtLandArea": "govtLandArea",
    "govtLandAmount": "govtLandAmount",
    "govtConstructionRate": "govtConstructionRate",
    "govtConstructionArea": "govtConstructionArea",
    "govtConstructionAmount": "govtConstructionAmount",
    "constructionAreaSqFt": ["constructionArea", "builtUpAreaNorms", "superBuiltUpArea"],
    "approvedCoverageSqFt": "approvedCoverageSqFt",
    "costOfConstruction": "costOfConstruction",

    // 6. Construction Progress
    "typeOfStructure": "typeOfStructure",
    "structureConfiguration": "structureConfiguration",
    "structureCompletion": "completionPercentage",
    "structureRecommendation": "recommendationPercentage",
    "amenityCompletion": "amenityCompletion",
    "amenityRecommendation": "amenityRecommendation",
    "resolutionAmenities": "resolutionAmenities",
    "recommendationAmenities": "recommendationAmenities",
    "recommendedValue": "recommendedValue",
    "comments": "commentsOnProperty",

    // 7. Distance Range
    "distanceFromCPC": "distanceFromCPC",
    "distanceFromCityCenter": ["distanceFromCityCenter", "distanceCityCentre"],
    "distanceFromICICIBank": ["distanceFromICICIBank", "distanceABCLBranch"],
    "oneWayDistance": "oneWayDistance",
    "latitude": "latitude",
    "longitude": "longitude",

    // 8. Remarks
    "nfsaCheckRequired": "nfsaCheckRequired",
    "generalObservations": "generalObservations",
    "raleReferences": "raleReferences",
    "personName": ["customerName", "clientName", "personMetDuringVisit", "personName"],
    "personContact": ["contactNumber", "customerNo", "personContact"],
    "evaluationMode": "evaluationMode",
    "rejectionReason": "rejectionReason",
    "verifiedBy": ["valuerName", "visitedEngineer", "verifiedBy"],
    "visitDate": ["visitDate", "dateOfReport"],
    "siteVisits": "siteVisits",
};

export const BAJAJ_HOUSING_MAPPING = {
    // Applicant Details
    "applicantDetails.fileNo": ["property.bank_specific_details.file_no", "caseReferenceNumber", "refNo", "registration_number", "fileNo"],
    "applicantDetails.lanNo": ["property.bank_specific_details.lan_no", "customerNo", "lanNo"],
    "applicantDetails.branch": ["property.bank_specific_details.branch", "branch"],
    "applicantDetails.brqNo": ["property.bank_specific_details.brq_no", "brqNo"],
    "applicantDetails.loanCategory": ["property.bank_specific_details.loan_category", "loanCategory"],
    "applicantDetails.applicantName": ["property.applicant_name", "property.owner_name", "borrowerName", "applicantName", "customerName"],
    "applicantDetails.valuerName": ["property.engineer_details.visited_engineer", "property.engineer_details.appraiser_name", "valuerName"],
    "applicantDetails.contactPerson": ["property.contact_person", "contactPerson"],
    "applicantDetails.contactNo": ["property.contact_number", "property.Mobile No.", "contactNumber", "contactNo"],
    "applicantDetails.personMetAtSite": ["property.duringPropertyVisit", "personMetDuringVisit", "personMetAtSite"],
    "applicantDetails.propertyOwner": ["property.owner_name", "propertyOwnerName", "propertyOwner"],
    "applicantDetails.dateOfReport": ["property.dateOfReport", "dateOfReport", "reportDate"],
    "applicantDetails.relationshipMetAtSite": ["property.relationship_met_at_site", "relationshipMetAtSite"],
    "applicantDetails.personMetAtSiteContact": ["property.person_met_at_site_contact", "personMetAtSiteContact", "property.contact_number", "property.contact_no", "contactNo"],
    "applicantDetails.numberOfTenants": ["property.number_of_tenants", "numberOfTenants"],
    "applicantDetails.tenantVintage": ["property.tenant_vintage", "tenantVintage"],
    "applicantDetails.documentsProvided": ["property.documents_provided", "documentsProvided"],

    // Location Details
    "locationDetails.propertyPincode": ["property.address.pincode", "pincode", "projectPinCode", "propertyPincode"],
    "locationDetails.propertyCity": ["property.address.district", "property.address.tehsil", "city", "propertyCity"],
    "locationDetails.propertyState": ["property.address.state", "state", "projectState", "propertyState"],
    "locationDetails.addressAsPerSite": ["property.address.full_address", "propertyAddress", "addressSite", "addressAsPerSite"],
    "locationDetails.localityName": ["property.location_details.locality", "property.address.main_locality", "property.address.sub_locality", "locality", "localityName"],
    "locationDetails.landmarkNearBy": ["property.location_details.landmark", "landmark", "landmarkNearBy"],
    "locationDetails.distanceFromCityCenter": ["property.location_details.distance_city_centre", "distanceCityCentre", "distanceFromCityCenter"],
    "locationDetails.floorNo": ["property.accommodation_details.flat_configuration", "property.accommodation_details.flat_type", "unitNo", "floorNo"],
    "locationDetails.latitude": ["property.latitude", "latitude"],
    "locationDetails.longitude": ["property.longitude", "longitude"],
    "locationDetails.jurisdiction": ["property.legal_and_compliance.jurisdiction", "jurisdiction"],
    "locationDetails.propertyHoldingType": ["property.accommodation_details.property_holding", "propertyHolding", "ownershipType", "propertyHoldingType"],
    "locationDetails.marketability": ["property.accommodation_details.marketability", "marketability"],
    "locationDetails.propertyOccupiedBy": ["property.property_details.occupied_by", "property.property_details.occupancy", "occupiedBy", "occupancy", "propertyOccupiedBy"],
    "locationDetails.typeOfProperty": ["property.property_sub_type", "property.accommodation_details.type_of_structure", "property.property_type", "typeOfStructure", "typeOfProperty"],

    // Boundaries on site
    "boundaryDetails.northBoundarySite": ["property.boundaries.north_actual", "northActual", "northBoundarySite"],
    "boundaryDetails.southBoundarySite": ["property.boundaries.south_actual", "southActual", "southBoundarySite"],
    "boundaryDetails.eastBoundarySite": ["property.boundaries.east_actual", "eastActual", "eastBoundarySite"],
    "boundaryDetails.westBoundarySite": ["property.boundaries.west_actual", "westActual", "westBoundarySite"],
    "boundaryDetails.northBoundary": ["property.boundaries.north_as_per_deed", "northDocument", "northBoundary"],
    "boundaryDetails.southBoundary": ["property.boundaries.south_as_per_deed", "southDocument", "southBoundary"],
    "boundaryDetails.eastBoundary": ["property.boundaries.east_as_per_deed", "eastDocument", "eastBoundary"],
    "boundaryDetails.westBoundary": ["property.boundaries.west_as_per_deed", "westDocument", "westBoundary"],
    "boundaryDetails.boundariesMatching": ["boundariesMatching"],
    "boundaryDetails.approachRoadSize": ["property.location_details.width_approach_road", "widthApproachRoad", "approachRoadSize"],
    "boundaryDetails.propertyIdentified": ["property.property_details.property_identification", "property.property_details.property_demarcated", "propertyIdentification", "propertyIdentified"],

    // NDMA parameters
    "ndmaParameters.natureOfBuilding": ["property.accommodation_details.type_of_structure", "typeOfStructure", "natureOfBuilding"],
    "ndmaParameters.structureType": ["property.accommodation_details.type_of_structure", "structureType"],
    "ndmaParameters.roofType": ["property.structural_engineering.roof_type", "roofType"],
    "ndmaParameters.steelGrade": ["property.structural_engineering.steel_grade", "steelGrade"],
    "ndmaParameters.concreteGrade": ["property.structural_engineering.concrete_grade", "concreteGrade"],
    "ndmaParameters.typeOfMasonry": ["property.structural_engineering.type_of_masonry", "typeOfMasonry"],
    "ndmaParameters.footingType": ["property.structural_engineering.footing_type", "footingType"],
    "ndmaParameters.seismicZone": ["property.structural_engineering.seismic_zone", "seismicZone"],
    "ndmaParameters.floodProneArea": ["property.structural_engineering.flood_prone_area", "floodProneArea"],
    "ndmaParameters.fireExit": ["property.structural_engineering.fire_exit", "fireExit"],
    "ndmaParameters.sanctionedPlanProvided": ["property.municipal_details.sanction_plan_provided", "sanctionPlanProvided", "sanctionedPlanProvided"],
    "ndmaParameters.approvingAuthority": ["property.legal_and_compliance.approving_authority", "approvingAuthority"],

    // Technical details
    "technicalDetails.constructionQuality": ["property.accommodation_details.quality_of_construction", "qualityOfConstruction", "constructionQuality"],
    "technicalDetails.liftAvailable": ["property.accommodation_details.lift_facility", "liftFacility", "liftAvailable"],
    "technicalDetails.noOfLifts": ["property.structural_engineering.no_of_lifts", "noOfLifts"],
    "technicalDetails.eastToWestPlan": ["property.dimension_width", "side1AsPerPlan", "eastToWestPlan"],
    "technicalDetails.eastToWestDoc": ["property.dimension_width", "side1AsPerPlan", "eastToWestDoc"],
    "technicalDetails.eastToWestSite": ["property.dimension_width", "side1Actual", "eastToWestSite"],
    "technicalDetails.northToSouthPlan": ["property.dimension_depth", "side2AsPerPlan", "northToSouthPlan"],
    "technicalDetails.northToSouthDoc": ["property.dimension_depth", "side2AsPerPlan", "northToSouthDoc"],
    "technicalDetails.northToSouthSite": ["property.dimension_depth", "side2Actual", "northToSouthSite"],
    "technicalDetails.landAreaPlan": ["property.valuation_details.plot_area_in_deed", "property.plot_area", "plotArea", "landPlanArea", "landAreaPlan"],
    "technicalDetails.landAreaDoc": ["property.valuation_details.plot_area_in_deed", "property.plot_area", "plotArea", "landDocumentArea", "landAreaDoc"],
    "technicalDetails.landAreaSite": ["property.valuation_details.plot_area_physical", "property.plot_area", "plotArea", "landSiteArea", "landAreaSite"],
    "technicalDetails.carpetAreaAsPerDocument": ["property.valuation_details.carpet_area_plan", "property.valuation_details.carpet_area_measurement", "carpetAreaPlan", "carpetAreaAsPerDocument"],
    "technicalDetails.actualConstructionSBUA": ["property.valuation_details.super_built_up_area", "superBuiltUpArea", "actualConstructionSBUA"],
    "technicalDetails.statusOfProperty": ["property.location_details.condition_of_site", "property.location_details.occupancy_level", "conditionOfSite", "occupancyLevel", "statusOfProperty"],
    "technicalDetails.percentCompleted": ["property.valuation_details.completion_percentage", "completionPercentage", "percentCompleted"],
    "technicalDetails.currentAgeOfProperty": ["property.accommodation_details.age_of_property", "ageOfProperty", "currentAgeOfProperty"],
    "technicalDetails.residualAge": ["property.accommodation_details.residual_age", "residualAge"],
    "technicalDetails.riskOfDemolition": ["property.legal_and_compliance.risk_of_demolition", "riskOfDemolition"],

    // Valuation details
    "valuationDetails.landArea": ["property.valuation_details.plot_area_physical", "property.valuation_details.plot_area_in_deed", "property.plot_area", "plotArea", "landArea"],
    "valuationDetails.tentativeLandRate": ["property.valuation_details.land_rate", "property.valuation_details.plot_area_physical_rate", "landRate", "plotAreaPhysicalRate", "tentativeLandRate"],
    "valuationDetails.landValue": ["property.valuation_details.total_value", "totalValue", "landValue"],
    "valuationDetails.governmentValue": ["property.valuation_details.government_value", "governmentValue"],
    "valuationDetails.distressedValue": ["property.valuation_details.distress_value", "distressValue", "distressedValue"],
    "valuationDetails.valuationMethodology": ["valuationMethodology"],
    "valuationDetails.valuationDoneEarlier": ["property.location_details.valuator_done_before", "valuatorDoneBefore", "valuationDoneEarlier"],
    "valuationDetails.remarks": ["property.report_remarks", "property.location_details.comments_on_property", "reportRemarks", "commentsOnProperty", "remarks"],
    "valuationDetails.isPropertyInNegativeArea": ["property.legal_and_compliance.is_property_in_negative_area", "isPropertyInNegativeArea"],

    // Infrastructure details
    "infrastructureDetails.approachRoadToProperty": ["property.location_details.physical_approach", "property.location_details.width_approach_road", "physicalApproach", "widthApproachRoad", "approachRoadToProperty"],
    "infrastructureDetails.developmentOfSurroundingAreas": ["property.location_details.micro_location", "microLocation", "developmentOfSurroundingAreas"],
    "infrastructureDetails.distanceFromCityCenter": ["property.location_details.distance_city_centre", "distanceCityCentre", "distanceFromCityCenter"],
    "infrastructureDetails.anyDemolitionThreat": ["property.infrastructure_details.any_demolition_threat", "property.location_details.adverse_factors", "adverseFactors", "anyDemolitionThreat"],
    "infrastructureDetails.waterSupply": ["property.infrastructure_details.water_supply", "waterSupply"],
    "infrastructureDetails.waterDistributor": ["property.infrastructure_details.water_distributor", "waterDistributor"],
    "infrastructureDetails.electricityAvailable": ["property.infrastructure_details.electricity_available", "electricityAvailable"],
    "infrastructureDetails.electricityDistributor": ["property.infrastructure_details.electricity_distributor", "electricityDistributor"],
    "infrastructureDetails.sewerLineConnected": ["property.infrastructure_details.sewer_line_connected", "sewerLineConnected"],
    "infrastructureDetails.createdBy": ["property.engineer_details.prepared_by", "preparedBy", "createdBy"],
    "infrastructureDetails.approvedBy": ["property.engineer_details.finalized_by", "finalizedBy", "approvedBy"],
};

export const BAJAJ_BANK_MAPPING = {
    // Step 1 - Applicant Details
    "step1.fileNo": ["property.bank_specific_details.file_no", "caseReferenceNumber", "refNo", "registration_number", "fileNo"],
    "step1.lanNo": ["property.bank_specific_details.lan_no", "customerNo", "lanNo"],
    "step1.branch": ["property.bank_specific_details.branch", "branch"],
    "step1.brqNo": ["property.bank_specific_details.brq_no", "brqNo"],
    "step1.loanCategory": ["property.bank_specific_details.loan_category", "loanCategory"],
    "step1.applicantName": ["property.applicant_name", "property.owner_name", "borrowerName", "applicantName", "customerName"],
    "step1.valuerName": ["property.engineer_details.visited_engineer", "property.engineer_details.appraiser_name", "valuerName"],
    "step1.contactPerson": ["property.contact_person", "contactPerson"],
    "step1.contactNo": ["property.contact_number", "property.Mobile No.", "contactNumber", "contactNo"],
    "step1.personMetAtSite": ["property.duringPropertyVisit", "personMetDuringVisit", "personMetAtSite"],
    "step1.propertyOwner": ["property.owner_name", "propertyOwnerName", "propertyOwner"],
    "step1.dateOfReport": ["property.dateOfReport", "dateOfReport", "reportDate"],
    "step1.relationshipMetAtSite": ["property.relationship_met_at_site", "relationshipMetAtSite"],
    "step1.personMetAtSiteContact": ["property.person_met_at_site_contact", "personMetAtSiteContact", "property.contact_number", "property.contact_no", "contactNo"],
    "step1.numberOfTenants": ["property.number_of_tenants", "numberOfTenants"],
    "step1.tenantVintage": ["property.tenant_vintage", "tenantVintage"],
    "step1.documentsProvided": ["property.documents_provided", "documentsProvided"],

    // Step 2 - Location Details
    "step2.propertyPincode": ["property.address.pincode", "pincode", "projectPinCode", "propertyPincode"],
    "step2.propertyCity": ["property.address.district", "property.address.tehsil", "city", "propertyCity"],
    "step2.propertyState": ["property.address.state", "state", "projectState", "propertyState"],
    "step2.addressAsPerSite": ["property.address.full_address", "propertyAddress", "addressSite", "addressAsPerSite"],
    "step2.localityName": ["property.location_details.locality", "property.address.main_locality", "property.address.sub_locality", "locality", "localityName"],
    "step2.landmarkNearBy": ["property.location_details.landmark", "landmark", "landmarkNearBy"],
    "step2.distanceFromCityCenter": ["property.location_details.distance_city_centre", "distanceCityCentre", "distanceFromCityCenter"],
    "step2.floorNo": ["property.accommodation_details.flat_configuration", "property.accommodation_details.flat_type", "unitNo", "floorNo"],
    "step2.latitude": ["property.latitude", "latitude"],
    "step2.longitude": ["property.longitude", "longitude"],
    "step2.jurisdiction": ["property.legal_and_compliance.jurisdiction", "jurisdiction"],
    "step2.propertyHoldingType": ["property.accommodation_details.property_holding", "propertyHolding", "ownershipType", "propertyHoldingType"],
    "step2.marketability": ["property.accommodation_details.marketability", "marketability"],
    "step2.propertyOccupiedBy": ["property.property_details.occupied_by", "property.property_details.occupancy", "occupiedBy", "occupancy", "propertyOccupiedBy"],
    "step2.typeOfProperty": ["property.property_sub_type", "property.accommodation_details.type_of_structure", "property.property_type", "typeOfStructure", "typeOfProperty"],

    // Step 3 - Boundaries
    "step3.northBoundarySite": ["property.boundaries.north_actual", "northActual", "northBoundarySite"],
    "step3.southBoundarySite": ["property.boundaries.south_actual", "southActual", "southBoundarySite"],
    "step3.eastBoundarySite": ["property.boundaries.east_actual", "eastActual", "eastBoundarySite"],
    "step3.westBoundarySite": ["property.boundaries.west_actual", "westActual", "westBoundarySite"],
    "step3.northBoundary": ["property.boundaries.north_as_per_deed", "northDocument", "northBoundary"],
    "step3.southBoundary": ["property.boundaries.south_as_per_deed", "southDocument", "southBoundary"],
    "step3.eastBoundary": ["property.boundaries.east_as_per_deed", "eastDocument", "eastBoundary"],
    "step3.westBoundary": ["property.boundaries.west_as_per_deed", "westDocument", "westBoundary"],
    "step3.boundariesMatching": ["boundariesMatching"],
    "step3.approachRoadSize": ["property.location_details.width_approach_road", "widthApproachRoad", "approachRoadSize"],
    "step3.propertyIdentified": ["property.property_details.property_identification", "property.property_details.property_demarcated", "propertyIdentification", "propertyIdentified"],

    // Step 4 - NDMA Parameters
    "step4.natureOfBuilding": ["property.accommodation_details.type_of_structure", "typeOfStructure", "natureOfBuilding"],
    "step4.structureType": ["property.accommodation_details.type_of_structure", "structureType"],
    "step4.roofType": ["property.structural_engineering.roof_type", "roofType"],
    "step4.steelGrade": ["property.structural_engineering.steel_grade", "steelGrade"],
    "step4.concreteGrade": ["property.structural_engineering.concrete_grade", "concreteGrade"],
    "step4.typeOfMasonry": ["property.structural_engineering.type_of_masonry", "typeOfMasonry"],
    "step4.footingType": ["property.structural_engineering.footing_type", "footingType"],
    "step4.seismicZone": ["property.structural_engineering.seismic_zone", "seismicZone"],
    "step4.floodProneArea": ["property.structural_engineering.flood_prone_area", "floodProneArea"],
    "step4.fireExit": ["property.structural_engineering.fire_exit", "fireExit"],
    "step4.sanctionedPlanProvided": ["property.municipal_details.sanction_plan_provided", "sanctionPlanProvided", "sanctionedPlanProvided"],
    "step4.approvingAuthority": ["property.legal_and_compliance.approving_authority", "approvingAuthority"],

    // Step 5 - Technical Details
    "step5.constructionQuality": ["property.accommodation_details.quality_of_construction", "qualityOfConstruction", "constructionQuality"],
    "step5.liftAvailable": ["property.accommodation_details.lift_facility", "liftFacility", "liftAvailable"],
    "step5.noOfLifts": ["property.structural_engineering.no_of_lifts", "noOfLifts"],
    "step5.eastToWestPlan": ["property.dimension_width", "side1AsPerPlan", "eastToWestPlan"],
    "step5.eastToWestDoc": ["property.dimension_width", "side1AsPerPlan", "eastToWestDoc"],
    "step5.eastToWestSite": ["property.dimension_width", "side1Actual", "eastToWestSite"],
    "step5.northToSouthPlan": ["property.dimension_depth", "side2AsPerPlan", "northToSouthPlan"],
    "step5.northToSouthDoc": ["property.dimension_depth", "side2AsPerPlan", "northToSouthDoc"],
    "step5.northToSouthSite": ["property.dimension_depth", "side2Actual", "northToSouthSite"],
    "step5.landAreaPlan": ["property.valuation_details.plot_area_in_deed", "property.plot_area", "plotArea", "landPlanArea", "landAreaPlan"],
    "step5.landAreaDoc": ["property.valuation_details.plot_area_in_deed", "property.plot_area", "plotArea", "landDocumentArea", "landAreaDoc"],
    "step5.landAreaSite": ["property.valuation_details.plot_area_physical", "property.plot_area", "plotArea", "landSiteArea", "landAreaSite"],
    "step5.carpetAreaAsPerDocument": ["property.valuation_details.carpet_area_plan", "property.valuation_details.carpet_area_measurement", "carpetAreaPlan", "carpetAreaAsPerDocument"],
    "step5.actualConstructionSBUA": ["property.valuation_details.super_built_up_area", "superBuiltUpArea", "actualConstructionSBUA"],
    "step5.statusOfProperty": ["property.location_details.condition_of_site", "property.location_details.occupancy_level", "conditionOfSite", "occupancyLevel", "statusOfProperty"],
    "step5.percentCompleted": ["property.valuation_details.completion_percentage", "completionPercentage", "percentCompleted"],
    "step5.currentAgeOfProperty": ["property.accommodation_details.age_of_property", "ageOfProperty", "currentAgeOfProperty"],
    "step5.residualAge": ["property.accommodation_details.residual_age", "residualAge"],
    "step5.riskOfDemolition": ["property.legal_and_compliance.risk_of_demolition", "riskOfDemolition"],

    // Step 6 - Plot Area
    "step6.plotArea": ["property.plot_area", "plotArea"],

    // Step 7 - Valuation Details
    "step7.landArea": ["property.valuation_details.plot_area_physical", "property.valuation_details.plot_area_in_deed", "property.plot_area", "plotArea", "landArea"],
    "step7.tentativeLandRate": ["property.valuation_details.land_rate", "property.valuation_details.plot_area_physical_rate", "landRate", "plotAreaPhysicalRate", "tentativeLandRate"],
    "step7.landValue": ["property.valuation_details.total_value", "totalValue", "landValue"],
    "step7.governmentValue": ["property.valuation_details.government_value", "governmentValue"],
    "step7.distressedValue": ["property.valuation_details.distress_value", "distressValue", "distressedValue"],
    "step7.valuationMethodology": ["valuationMethodology"],
    "step7.remarks": ["property.report_remarks", "property.location_details.comments_on_property", "reportRemarks", "commentsOnProperty", "remarks"],
};

