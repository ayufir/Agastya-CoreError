const imagekit = require("../config/imagekit");
const axios = require("axios");
const modelMap = require("./modelMap");

const downloadFileAsBuffer = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    let originalname = pathname.substring(pathname.lastIndexOf("/") + 1) || "file";
    originalname = decodeURIComponent(originalname);

    let mimetype = response.headers["content-type"] || "application/octet-stream";
    if (originalname.toLowerCase().endsWith(".pdf")) {
      mimetype = "application/pdf";
    } else if (originalname.toLowerCase().endsWith(".png")) {
      mimetype = "image/png";
    } else if (originalname.toLowerCase().endsWith(".jpg") || originalname.toLowerCase().endsWith(".jpeg")) {
      mimetype = "image/jpeg";
    } else if (originalname.toLowerCase().endsWith(".mp4")) {
      mimetype = "video/mp4";
    }
    
    return {
      buffer,
      originalname,
      mimetype,
    };
  } catch (error) {
    console.error(`Error downloading file from url ${url}:`, error.message);
    return null;
  }
};

const CATEGORY_LABELS = {
  gpsFiles:        "GPS / site photos / map screenshots with lat-long",
  atsFiles:        "ATS / sale deed / legal property documents (Indian registry, sale deed, gift deed, etc.)",
  emailFiles:      "Email / MIS / sanction screenshot (bank email with file no, LAN, branch, applicant name)",
  fieldFormFiles:  "Field visit form / engineer site visit form (HF valuation format, handwritten form)",
  additionalFiles: "Additional site photos / supporting documents",
  siteVisitPhotos: "Site visit photos by engineer — to be uploaded to photo fields in bank form",
};

const buildAddressString = (address = {}) => {
  const parts = [];

  if (address.plot_number) parts.push(`Plot No. ${address.plot_number}`);

  const khasra = address.khasra_number || address.survey_number;
  if (khasra) parts.push(`Khasra No. ${khasra}`);

  if (address.patwari_halka_number) {
    parts.push(`Patwari Halka No. ${address.patwari_halka_number}`);
  }

  if (address.ward_number) parts.push(`Ward No. ${address.ward_number}`);
  if (address.village_name) parts.push(address.village_name);
  if (address.colony_area) parts.push(address.colony_area);
  if (address.tehsil) parts.push(address.tehsil);

  if (address.district && address.district !== address.tehsil) {
    parts.push(address.district);
  }

  if (address.state) parts.push(address.state);
  if (address.pincode) parts.push(address.pincode);

  return parts.join(", ");
};

const normalizeScalar = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  return value;
};

const normalizeObject = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeObject);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeObject(nestedValue)])
    );
  }

  return normalizeScalar(value);
};

const inferUnitType = (propertyType = "", propertySubType = "") => {
  const raw = `${propertyType} ${propertySubType}`.toLowerCase();

  if (!raw.trim()) return "";
  if (raw.includes("row house")) return "Row House";
  if (raw.includes("flat") || raw.includes("apartment")) return "Flat";
  if (raw.includes("shop")) return "Shop";
  if (raw.includes("office")) return "Office";
  if (raw.includes("industrial")) return "Industrial";
  if (
    raw.includes("plot") ||
    raw.includes("open plot") ||
    raw.includes("land") ||
    raw.includes("bhukhanda") ||
    raw.includes("bhukhand")
  ) {
    return "OPEN PLOT";
  }
  if (
    raw.includes("house") ||
    raw.includes("makan") ||
    raw.includes("makaan") ||
    raw.includes("awas")
  ) {
    return "Individual House";
  }

  return propertySubType || propertyType || "";
};

const inferUsage = (usage = "") => {
  const raw = String(usage || "").toLowerCase();

  if (!raw.trim()) return "";
  if (
    raw.includes("commercial") ||
    raw.includes("vyavsayik") ||
    raw.includes("vanijyik")
  ) {
    return "Commercial";
  }
  if (
    raw.includes("agricultural") ||
    raw.includes("krishi") ||
    raw.includes("farm")
  ) {
    return "Agricultural";
  }
  if (
    raw.includes("industrial") ||
    raw.includes("factory") ||
    raw.includes("industry")
  ) {
    return "Industrial";
  }

  return "Residential";
};

const getValue = (...values) => {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }

  return "";
};

const buildFlatPayload = (rawResult = {}) => {
  const result = normalizeObject(rawResult);
  const property = result.property || {};
  const address = property.address || {};
  const bounds = property.boundaries || {};
  const location = property.location_details || {};
  const propertyDetails = property.property_details || {};
  const infrastructure = property.infrastructure_details || {};
  const compliance = property.legal_and_compliance || {};
  const valuation = property.valuation_details || {};
  const accommodation = property.accommodation_details || {};
  const structure = property.structural_engineering || {};
  const municipal = property.municipal_details || {};
  const basic = property.basic_details || {};
  const bankSpecific = property.bank_specific_details || {};
  const setbacks = property.setbacks || {};
  const amenities = property.surrounding_amenities || {};
  const riskFlags = property.risk_flags || {};
  const formattedAddress = getValue(
    address.full_address,
    property.site_address,
    buildAddressString(address)
  );
  const plotArea = getValue(
    valuation.plot_area_physical,
    valuation.plot_area_in_deed,
    property.plot_area,
    property.LandArea
  );
  const useType = inferUsage(getValue(property.property_use, property.actual_usage));
  const unitType = inferUnitType(property.property_type, property.property_sub_type);
  const contactNumber = getValue(
    property.contact_number,
    property["Mobile No."],
    property.person_met_at_site_contact
  );

  return {
    seller: result.seller || [],
    buyer: result.buyer || [],
    property,
    document_type: result.document_type || "",
    registration_number: result.registration_number || "",
    registration_date: result.registration_date || "",
    reportRemarks: property.report_remarks || "",
    photo_analysis: result.photo_analysis || [],
    audit_notes: result.audit_notes || [],

    customerName: getValue(property.applicant_name, property.owner_name),
    propertyOwnerName: getValue(property.owner_name, property.applicant_name),
    personMetDuringVisit: getValue(property.contact_person, property.duringPropertyVisit),
    visitedPersonName: getValue(property.contact_person, property.duringPropertyVisit),
    contactNumber,
    customerNo: contactNumber,
    personName: getValue(property.contact_person, property.applicant_name, property.owner_name),
    personContact: contactNumber,

    fileNo: bankSpecific.file_no || "",
    lanNo: bankSpecific.lan_no || "",
    branch: bankSpecific.branch || "",
    brqNo: bankSpecific.brq_no || "",
    loanCategory: bankSpecific.loan_category || "",
    propertyCode: getValue(bankSpecific.property_code, property.property_code),
    caseReferenceNumber: getValue(
      basic.case_reference_number,
      bankSpecific.file_no,
      result.registration_number
    ),
    refNo: getValue(result.registration_number, basic.case_reference_number, bankSpecific.file_no),

    dateOfReport: getValue(
      property.dateOfReport,
      basic.report_date,
      result.registration_date,
      basic.visit_date
    ),
    reportDate: getValue(basic.report_date, property.dateOfReport, result.registration_date),
    visitDate: basic.visit_date || "",
    initiationDate: basic.initiation_date || "",

    propertyName: getValue(
      property.property_name,
      [address.plot_number && `Plot No. ${address.plot_number}`, address.colony_area, address.village_name, address.tehsil, address.district]
        .filter(Boolean)
        .join(", ")
    ),
    propertyAddress: formattedAddress,
    addressLegal: formattedAddress,
    addressSite: getValue(property.site_address, formattedAddress),

    plotNo: address.plot_number || "",
    plotNumber: address.plot_number || "",
    surveyNumber: address.survey_number || "",
    khasraNumber: address.khasra_number || "",
    wardNumber: address.ward_number || "",
    colonyArea: address.colony_area || "",
    villageName: address.village_name || "",
    patwariHalkaNumber: address.patwari_halka_number || "",
    tehsil: address.tehsil || "",
    district: address.district || "",
    state: address.state || "",
    projectState: address.state || "",
    pincode: address.pincode || "",
    projectPinCode: address.pincode || "",
    city: getValue(address.district, address.tehsil),
    mainLocality: address.main_locality || "",
    subLocality: address.sub_locality || "",

    latitude: property.latitude || "",
    longitude: property.longitude || "",

    unitType,
    propertySubType: property.property_sub_type || "",
    typeOfStructure: getValue(accommodation.type_of_structure, property.property_type),
    zone: useType,
    usageOfProperty: useType,
    sanctionUsage: getValue(property.sanction_usage, useType),
    actualUsage: getValue(property.actual_usage, useType),
    propertyJurisdiction: compliance.jurisdiction || "",
    sanctionAuthorityName: compliance.approving_authority || "",
    constructionStatus: getValue(property.construction_stage, valuation.construction_status),
    propertyEntranceFacing: property.property_entrance_facing || "",
    floorNumber: property.floor_number || "",
    countOfProperties: property.count_of_properties || "",

    locality: getValue(location.locality, address.main_locality, address.sub_locality),
    microLocation: location.micro_location || "",
    localityDevelopment: location.micro_location || "",
    landmark: location.landmark || "",
    nearbyLandmark: location.landmark || "",
    propertyFallingWithin: location.property_falling_within || "",
    occupancyLevel: location.occupancy_level || "",
    conditionOfSite: location.condition_of_site || "",
    distanceRailwayStation: location.distance_railway_station || "",
    railwayStation: location.distance_railway_station || "",
    distanceBusStop: location.distance_bus_stop || "",
    busStop: location.distance_bus_stop || "",
    distanceCityCentre: location.distance_city_centre || "",
    distanceFromCityCenter: location.distance_city_centre || "",
    distanceHospital: location.distance_hospital || "",
    hospital: location.distance_hospital || "",
    distanceABCLBranch: location.distance_abcl_branch || "",
    distanceFromICICIBank: location.distance_abcl_branch || "",
    widthApproachRoad: location.width_approach_road || "",
    physicalApproach: location.physical_approach || "",
    legalApproach: location.legal_approach || "",
    otherFeatures: location.other_features || "",
    connectivity: location.connectivity || "",
    siteAccess: location.site_access || "",
    proximityToAmenities: location.proximity_to_amenities || "",
    commentsOnProperty: location.comments_on_property || "",
    adverseFactors: location.adverse_factors || "",

    occupancy: propertyDetails.occupancy || "",
    occupiedBy: propertyDetails.occupied_by || "",
    occupiedSince: propertyDetails.occupied_since || "",
    nameOfOccupant: propertyDetails.name_of_occupant || "",
    propertyDemarcated: propertyDetails.property_demarcated || "",
    propertyIdentification: propertyDetails.property_identification || "",
    identificationThrough: propertyDetails.identification_through || "",

    northDocument: getValue(bounds.north_as_per_deed, bounds.north),
    southDocument: getValue(bounds.south_as_per_deed, bounds.south),
    eastDocument: getValue(bounds.east_as_per_deed, bounds.east),
    westDocument: getValue(bounds.west_as_per_deed, bounds.west),
    northActual: getValue(bounds.north_actual, bounds.north),
    southActual: getValue(bounds.south_actual, bounds.south),
    eastActual: getValue(bounds.east_actual, bounds.east),
    westActual: getValue(bounds.west_actual, bounds.west),
    northPlan: getValue(bounds.north_as_per_deed, bounds.north),
    southPlan: getValue(bounds.south_as_per_deed, bounds.south),
    eastPlan: getValue(bounds.east_as_per_deed, bounds.east),
    westPlan: getValue(bounds.west_as_per_deed, bounds.west),
    northDimensions: property.dimension_depth || "",
    southDimensions: property.dimension_depth || "",
    eastDimensions: property.dimension_width || "",
    westDimensions: property.dimension_width || "",
    boundariesMatching: getValue(
      property.boundary_matching,
      bounds.north_as_per_deed || bounds.north_actual ? "Yes" : ""
    ),

    plotArea,
    landArea: plotArea,
    LandArea: getValue(property.LandArea, plotArea),
    landSiteArea: plotArea,
    landDocumentArea: getValue(valuation.plot_area_in_deed, plotArea),
    landPlanArea: getValue(valuation.plot_area_in_deed, plotArea),
    linearDimension: property.plot_dimensions || "",
    Dimension: property.plot_dimensions || "",
    dimensionWidth: property.dimension_width || "",
    dimensionDepth: property.dimension_depth || "",

    propertyHolding: accommodation.property_holding || "",
    ownershipType: getValue(accommodation.property_holding, "Freehold"),
    totalNoOfFloors: accommodation.total_floors || "",
    ageOfProperty: accommodation.age_of_property || "",
    propertyAge: accommodation.age_of_property || "",
    residualAge: accommodation.residual_age || "",
    projectCategory: accommodation.project_category || "",
    flatType: accommodation.flat_type || "",
    flatConfiguration: accommodation.flat_configuration || "",
    areaOfFlat: accommodation.area_of_flat || "",
    liftFacility: accommodation.lift_facility || "",
    liftAvailable: accommodation.lift_facility || "",
    amenities: accommodation.amenities || "",
    marketability: accommodation.marketability || "",
    viewOfProperty: accommodation.view_of_property || "",
    parkingFacility: accommodation.parking_facility || "",
    qualityOfConstruction: accommodation.quality_of_construction || "",
    constructionQuality: accommodation.quality_of_construction || "",
    typeOfParking: accommodation.type_of_parking || "",
    shapeOfProperty: accommodation.shape_of_property || "",
    placementOfProperty: accommodation.placement_of_property || "",
    exteriorsOfProperty: accommodation.exteriors_of_property || "",
    interiorsOfProperty: accommodation.interiors_of_property || "",
    sourceOfAge: accommodation.source_of_age || "",
    maintenanceOfProperty: accommodation.maintenance_of_property || "",
    internalMaintenance: accommodation.interiors_of_property || "",
    externalMaintenance: accommodation.exteriors_of_property || "",
    cautiousLocation: accommodation.cautious_location || "",
    independentAccess: accommodation.independent_access || "",

    valuerName: basic.valuer_name || "",
    clientName: basic.client_name || "",
    vertical: basic.vertical || "",

    frontAsPerPlan: setbacks.front_plan || "",
    frontActual: setbacks.front_actual || "",
    rearAsPerPlan: setbacks.rear_plan || "",
    rearActual: setbacks.rear_actual || "",
    side1AsPerPlan: setbacks.side1_plan || "",
    side1Actual: setbacks.side1_actual || "",
    side2AsPerPlan: setbacks.side2_plan || "",
    side2Actual: setbacks.side2_actual || "",

    plotAreaInDeed: valuation.plot_area_in_deed || "",
    plotAreaPhysical: valuation.plot_area_physical || "",
    plotAreaPhysicalRate: valuation.plot_area_physical_rate || "",
    builtUpAreaNorms: valuation.built_up_area_norms || "",
    builtUpAreaNormsRate: valuation.built_up_area_norms_rate || "",
    builtUpAreaTinShed: valuation.built_up_area_tinshed || "",
    builtUpTinShedRate: valuation.built_up_area_tinshed_rate || "",
    superBuiltUpArea: valuation.super_built_up_area || "",
    superBuiltUpRate: valuation.super_built_up_rate || "",
    carpetAreaPlan: valuation.carpet_area_plan || "",
    carpetAreaPlanRate: valuation.carpet_area_plan_rate || "",
    carpetAreaMeasurement: valuation.carpet_area_measurement || "",
    carpetAreaMeasRate: valuation.carpet_area_measurement_rate || "",
    carPark: valuation.car_park || "",
    carParkRate: valuation.car_park_rate || "",
    amenitiesVal: valuation.amenities_val || "",
    amenitiesRate: valuation.amenities_rate || "",
    landRate: getValue(valuation.land_rate, valuation.plot_area_physical_rate),
    constructionRate: valuation.construction_rate || "",
    totalValue: valuation.total_value || "",
    distressValue: valuation.distress_value || "",
    insuranceValue: valuation.insurance_value || "",
    governmentValue: valuation.government_value || "",
    completionPercentage: valuation.completion_percentage || "",
    recommendationPercentage: valuation.recommendation_percentage || "",
    realizableValue: valuation.total_value || "",
    constructionStage: getValue(property.construction_stage, valuation.construction_status),
    constructionStatusPercent: valuation.completion_percentage || "",

    visitedEngineer: property.engineer_details?.visited_engineer || "",
    appraiserName: property.engineer_details?.appraiser_name || "",
    preparedBy: property.engineer_details?.prepared_by || "",
    finalizedBy: property.engineer_details?.finalized_by || "",

    electricityAvailable: infrastructure.electricity_available || "",
    electricityAvailability: infrastructure.electricity_available || "",
    electricityDistributor: infrastructure.electricity_distributor || "",
    waterSupply: infrastructure.water_supply || "",
    waterAvailability: infrastructure.water_supply || "",
    waterDistributor: infrastructure.water_distributor || "",
    sewerLineConnected: infrastructure.sewer_line_connected || "",
    drainageAvailability: infrastructure.sewer_line_connected || "",
    anyDemolitionThreat: getValue(
      infrastructure.any_demolition_threat,
      compliance.risk_of_demolition
    ),

    jurisdiction: compliance.jurisdiction || "",
    demolitionRisk: compliance.risk_of_demolition || "",
    riskOfDemolition: compliance.risk_of_demolition || "",
    isPropertyInNegativeArea: compliance.is_property_in_negative_area || "",
    approvingAuthority: compliance.approving_authority || "",

    steelGrade: structure.steel_grade || "",
    concreteGrade: structure.concrete_grade || "",
    fireExit: structure.fire_exit || "",
    footingType: structure.footing_type || "",
    noOfLifts: structure.no_of_lifts || "",
    typeOfMasonry: structure.type_of_masonry || "",
    seismicZone: structure.seismic_zone || "",
    floodProneArea: structure.flood_prone_area || "",
    floodZone: structure.flood_prone_area || "",
    roofType: structure.roof_type || "",

    sanctionPlanProvided: municipal.sanction_plan_provided || "",
    dateOfSanction: municipal.date_of_sanction || "",
    sanctionedArea: municipal.sanctioned_area || "",
    municipalCompliance: municipal.municipal_compliance || "",

    saleDeedDetails: property.document_details?.sale_deed_details || "",
    sanctionedPlanDetails: property.document_details?.sanctioned_plan_details || "",
    ccOcDetails: property.document_details?.cc_oc_details || "",
    agreementToSaleDetails: property.document_details?.agreement_to_sale_details || "",
    mutationPossessionDetails: property.document_details?.mutation_possession_details || "",
    taxReceiptDetails: property.document_details?.tax_receipt_details || "",
    electricityBillDetails: property.document_details?.electricity_bill_details || "",
    conversionDetails: property.document_details?.conversion_details || "",

    airport: amenities.airport || "",
    busStopAmenity: amenities.bus_stop || "",
    metroStation: amenities.metro_station || "",
    railwayStationAmenity: amenities.railway_station || "",
    college: amenities.college || "",
    school: amenities.school || "",
    hospitalAmenity: amenities.hospital || "",
    superMarket: amenities.super_market || "",
    mall: amenities.mall || "",
    placeOfWorship: amenities.place_of_worship || "",
    rickshawStop: amenities.rickshaw_stop || "",

    anyChemicalHazard: riskFlags.any_chemical_hazard || "",
    nearCrematorium: riskFlags.near_crematorium || "",
    probableRoadExtension: riskFlags.probable_road_extension || "",
    statutoryNoticesOnProperty: riskFlags.statutory_notices_on_property || "",
    communityDominated: riskFlags.community_dominated || "",
    nearGarbageDump: riskFlags.near_garbage_dump || "",
    propertyAccessIssues: riskFlags.property_access_issues || "",
    underHighTensionLine: riskFlags.under_high_tension_line || "",
    floodProne: riskFlags.flood_prone || "",
    nearNalla: riskFlags.near_nalla || "",
    propertyIsLandLocked: riskFlags.property_is_land_locked || "",
    landReservation: riskFlags.land_reservation || "",
    nearToRailTrack: riskFlags.near_to_rail_track || "",
    slumArea: riskFlags.slum_area || "",

    generalObservations: property.report_remarks || "",
    evaluationMode: property.evaluation_mode || "",
    rejectionReason: property.rejection_reason || "",
    verifiedBy: getValue(basic.valuer_name, property.engineer_details?.visited_engineer),
    siteVisits: property.site_visits || "",
  };
};

const extractJsonFromText = (text = "") => {
  const cleaned = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("AI response did not contain valid JSON.");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
};

const parseModelJson = (text = "") => {
  const rawJson = extractJsonFromText(text);

  try {
    return JSON.parse(rawJson);
  } catch {
    const repaired = rawJson.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(repaired);
  }
};

const buildPrompt = ({ bankName, propertyTypeHint, additionalNotes, filesByCategory }) => {
  const fileSummary = Object.entries(filesByCategory)
    .filter(([key, files]) => key !== "siteVisitPhotos" && files.length > 0)
    .map(([key, files]) => `- ${CATEGORY_LABELS[key]}: ${files.map((file) => file.originalname).join(", ")}`)
    .join("\n");

  // Bank-specific extraction hints
  const bankHints = {
    "ICICI": `
ICICI BANK SPECIFIC:
- Extract 'distanceFromICICIBank' from field visit form ('Distance from ICICI / ABCL Branch').
- Extract 'caseReferenceNumber' and 'fileNo' from email/MIS screenshot.
- 'propertyCode' from email (Opportunity Number / OP-XXXX-XXXXXX format).
- GPS lat/long is mandatory for ICICI iLens portal.
`,
    "Bajaj": `
BAJAJ / BAJAJ AMERIYA SPECIFIC:
- Extract 'brqNo' (BRQ Number) from email screenshot.
- Extract 'loanCategory' from email.
- Extract 'fileNo' and 'lanNo' from email/MIS.
- 'distressValue' = totalValue * 0.80.
`,
    "Home First": `
HOME FIRST BANK SPECIFIC:
- Extract 'khasraNumber' from MPSSL / Seemank app screenshot (खसरा संख्या → khasra number).
- Extract 'villageName' from MPSSL (गाँव → village).
- Extract 'tehsil' from MPSSL (तहसील → tehsil).
- Extract 'district' from MPSSL (जिला → district).
- Plot area must be in sq.ft.
`,
    "Home First Tranche": `
HOME FIRST TRANCHE SPECIFIC:
- Same as Home First but also extract 'completionPercentage' and 'constructionStage'.
- Look for 'tranche' or 'disbursement' details in email.
`,
    "Aditya Birla": `
ADITYA BIRLA (ABCL) SPECIFIC:
- Extract 'distanceABCLBranch' from field visit form.
- Setbacks table: front/rear/side1/side2 both plan and actual.
- Extract structural details: steel grade, concrete grade, footing type.
- 'floodProneArea' and 'seismicZone' mandatory.
`,
    "Manappuram": `
MANAPPURAM SPECIFIC:
- GPS coordinates (lat/long) are mandatory.
- Extract 'ageOfProperty' and 'residualAge' from site visit form.
- Count total site photos uploaded.
`,
  };

  const activeBankHint = bankHints[bankName] || `TARGET BANK: ${bankName || "Unknown"}. Extract all available fields.`;


  return `
You are an expert Indian bank property valuation AI that extracts data from multiple documents and fills bank forms.

TARGET BANK: ${bankName || "Auto detect"}
PROPERTY TYPE HINT: ${propertyTypeHint || "Auto detect from documents"}
ADDITIONAL NOTES: ${additionalNotes || "None"}

${activeBankHint}

DOCUMENTS PROVIDED (by category):
${fileSummary || "- No files listed"}

════════════════════════════════════════════════════════
DOCUMENT READING RULES (READ CAREFULLY):
════════════════════════════════════════════════════════

1. LEGAL DOCUMENTS (Sale Deed, Gift Deed, ATS, Registry, Lease Deed):
   - ANY Indian legal property document is valid: Sale Deed, Gift Deed, Lease Deed, Conveyance Deed, Mortgage Deed, Agreement to Sale, Allotment Letter, Patta, Fard, Khatiyan, Jamabandi, etc.
   - Extract: buyer name, seller name, registration number, registration date, property address, plot area, boundaries (N/S/E/W), khasra/survey/plot number, village, tehsil, district, state.
   - Document may be in Hindi (Devanagari) — convert to Roman/English.
   - Registration dates: convert to DD/MM/YYYY format.

2. GPS / MAP SCREENSHOTS:
   - Extract lat/long from Google Maps, GPS app, or any map screenshot.
   - Formats accepted: decimal (23.307619, 77.447237) or DMS (23°18'27"N 77°26'51"E) — convert DMS to decimal.
   - Pincode may be visible on map — extract it.
   - Site condition visible in aerial view — use for occupancy level.

3. SITE VISIT PHOTOS WITH GPS WATERMARK:
   - Photos may have GPS coordinates watermarked at the bottom (e.g., "19 May 2026 14:24:54  23°18'28"N 77°26'51"E  273° W").
   - Extract lat/long from watermark — convert DMS to decimal.
   - Extract date of visit from photo watermark.
   - Compass direction tells facing of the property.
   - Analyze the photo to determine: property type (plot/house/flat), construction stage (vacant plot / under construction / completed), road condition, vegetation, neighborhood.

4. MPSSL / SEEMANK / KHASRA APP SCREENSHOTS (Hindi Devanagari):
   - These are official MP government land record apps.
   - Extract: खसरा संख्या → khasra_number, जिला → district, तहसील → tehsil, गाँव → village_name.
   - App may show satellite view with land boundary marked in orange.

5. FIELD VISIT FORM (Handwritten or Printed):
   - Banks: HF (Home First), ICICI, Aditya Birla, etc. have standard printed forms.
   - Extract: customer name, person met at site, contact number, bank name, visit date, nearest landmark, property address as per site, boundaries as per site, plot size, land rate, distances (bus stop, railway station), structure type, occupation status.
   - Handwritten text may be in Hindi or English — extract as-is in Roman.

6. EMAIL / MIS / BANK EXCEL SCREENSHOT:
   - Extract: applicant/customer name, case reference number, file no, LAN no, BRQ no, branch, loan category, property code, opportunity number.
   - Dates in email → initiation_date or registration_date.

7. ADDITIONAL SITE PHOTOS:
   - Analyze for: structure type (RCC/Load Bearing/Tin Shed), roof type, exterior condition, interior (if visible), parking, water tank, solar panels, compound wall.
   - Identify negative markers: electrical lines above property, nalla nearby, garbage dump, community-dominated area.

8. PHOTO CLASSIFICATION RULE (CRITICAL FOR photo_analysis.supports_fields):
   - You MUST classify which form fields each site visit photo supports. Populate the 'supports_fields' array for each photo based on the target bank:
     - If TARGET BANK is "ICICI", use: ["sitePhotographs"].
     - If TARGET BANK is "Bajaj", analyze which area/view of the property is shown in the image and choose one or more of: ["frontElevationImages", "kitchenImages", "selfieImages", "otherImages"]. (e.g. engineer selfie = ["selfieImages"], kitchen = ["kitchenImages"], front/boundary/facade = ["frontElevationImages"], others = ["otherImages"]).
     - If TARGET BANK is "Home First" or "Home First Tranche" or "Aditya Birla" or "Manappuram", use: ["imageUrls"].

OUTPUT RULES:
1. Return ONLY valid JSON. No markdown, no explanation, no backticks.
2. Use Roman/English script only. NEVER output Devanagari characters.
3. If any field is not found, return empty string "".
4. Convert all DMS coordinates to decimal: Degrees + Minutes/60 + Seconds/3600.
5. CRITICAL: Extract values EXACTLY as written. Do not modify, guess, or paraphrase.
6. Add audit_notes for any conflicts, missing data, or uncertain extractions.

Return JSON exactly in this shape:
{
  "document_type": "",
  "registration_number": "",
  "registration_date": "",
  "seller": [
    {
      "name": "",
      "relation": "",
      "relation_name": "",
      "address": ""
    }
  ],
  "buyer": [
    {
      "name": "",
      "relation": "",
      "relation_name": "",
      "address": ""
    }
  ],
  "property": {
    "applicant_name": "",
    "owner_name": "",
    "contact_person": "",
    "duringPropertyVisit": "",
    "contact_number": "",
    "relationship_met_at_site": "",
    "person_met_at_site_contact": "",
    "number_of_tenants": "",
    "tenant_vintage": "",
    "documents_provided": "",
    "property_code": "",
    "property_name": "",
    "property_type": "",
    "property_sub_type": "",
    "property_use": "",
    "sanction_usage": "",
    "actual_usage": "",
    "construction_stage": "",
    "plot_area": "",
    "plot_dimensions": "",
    "dimension_width": "",
    "dimension_depth": "",
    "latitude": "",
    "longitude": "",
    "dateOfReport": "",
    "boundary_matching": "",
    "property_entrance_facing": "",
    "floor_number": "",
    "count_of_properties": "",
    "evaluation_mode": "",
    "rejection_reason": "",
    "site_visits": "",
    "report_remarks": "",
    "bank_specific_details": {
      "file_no": "",
      "lan_no": "",
      "branch": "",
      "loan_category": "",
      "brq_no": "",
      "property_code": ""
    },
    "address": {
      "full_address": "",
      "plot_number": "",
      "survey_number": "",
      "khasra_number": "",
      "ward_number": "",
      "colony_area": "",
      "village_name": "",
      "patwari_halka_number": "",
      "tehsil": "",
      "district": "",
      "state": "",
      "pincode": "",
      "main_locality": "",
      "sub_locality": ""
    },
    "boundaries": {
      "north_as_per_deed": "",
      "south_as_per_deed": "",
      "east_as_per_deed": "",
      "west_as_per_deed": "",
      "north_actual": "",
      "south_actual": "",
      "east_actual": "",
      "west_actual": ""
    },
    "location_details": {
      "micro_location": "",
      "landmark": "",
      "locality": "",
      "property_falling_within": "",
      "occupancy_level": "",
      "condition_of_site": "",
      "distance_city_centre": "",
      "distance_railway_station": "",
      "distance_bus_stop": "",
      "distance_hospital": "",
      "distance_abcl_branch": "",
      "width_approach_road": "",
      "physical_approach": "",
      "legal_approach": "",
      "other_features": "",
      "connectivity": "",
      "site_access": "",
      "proximity_to_amenities": "",
      "comments_on_property": "",
      "adverse_factors": ""
    },
    "property_details": {
      "occupancy": "",
      "occupied_by": "",
      "occupied_since": "",
      "name_of_occupant": "",
      "property_demarcated": "",
      "property_identification": "",
      "identification_through": ""
    },
    "infrastructure_details": {
      "water_supply": "",
      "electricity_available": "",
      "electricity_distributor": "",
      "water_distributor": "",
      "sewer_line_connected": "",
      "any_demolition_threat": ""
    },
    "legal_and_compliance": {
      "jurisdiction": "",
      "risk_of_demolition": "",
      "is_property_in_negative_area": "",
      "approving_authority": ""
    },
    "structural_engineering": {
      "steel_grade": "",
      "concrete_grade": "",
      "fire_exit": "",
      "footing_type": "",
      "no_of_lifts": "",
      "type_of_masonry": "",
      "seismic_zone": "",
      "flood_prone_area": "",
      "roof_type": ""
    },
    "municipal_details": {
      "sanction_plan_provided": "",
      "date_of_sanction": "",
      "sanctioned_area": "",
      "municipal_compliance": ""
    },
    "valuation_details": {
      "plot_area_in_deed": "",
      "plot_area_physical": "",
      "plot_area_physical_rate": "",
      "built_up_area_norms": "",
      "built_up_area_norms_rate": "",
      "built_up_area_tinshed": "",
      "built_up_area_tinshed_rate": "",
      "super_built_up_area": "",
      "super_built_up_rate": "",
      "carpet_area_plan": "",
      "carpet_area_plan_rate": "",
      "carpet_area_measurement": "",
      "carpet_area_measurement_rate": "",
      "land_rate": "",
      "construction_rate": "",
      "total_value": "",
      "distress_value": "",
      "government_value": "",
      "completion_percentage": "",
      "recommendation_percentage": "",
      "construction_status": ""
    },
    "accommodation_details": {
      "total_floors": "",
      "property_holding": "",
      "type_of_structure": "",
      "age_of_property": "",
      "residual_age": "",
      "project_category": "",
      "flat_type": "",
      "flat_configuration": "",
      "area_of_flat": "",
      "lift_facility": "",
      "amenities": "",
      "marketability": "",
      "view_of_property": "",
      "parking_facility": "",
      "quality_of_construction": "",
      "type_of_parking": "",
      "shape_of_property": "",
      "placement_of_property": "",
      "exteriors_of_property": "",
      "interiors_of_property": "",
      "source_of_age": "",
      "maintenance_of_property": "",
      "cautious_location": "",
      "independent_access": ""
    },
    "basic_details": {
      "valuer_name": "",
      "client_name": "",
      "vertical": "",
      "case_reference_number": "",
      "initiation_date": "",
      "visit_date": "",
      "report_date": ""
    },
    "setbacks": {
      "front_plan": "",
      "front_actual": "",
      "rear_plan": "",
      "rear_actual": "",
      "side1_plan": "",
      "side1_actual": "",
      "side2_plan": "",
      "side2_actual": ""
    },
    "document_details": {
      "sale_deed_details": "",
      "sanctioned_plan_details": "",
      "cc_oc_details": "",
      "agreement_to_sale_details": "",
      "mutation_possession_details": "",
      "tax_receipt_details": "",
      "electricity_bill_details": "",
      "conversion_details": ""
    },
    "surrounding_amenities": {
      "airport": "",
      "bus_stop": "",
      "metro_station": "",
      "railway_station": "",
      "college": "",
      "school": "",
      "hospital": "",
      "super_market": "",
      "mall": "",
      "place_of_worship": "",
      "rickshaw_stop": ""
    },
    "risk_flags": {
      "any_chemical_hazard": "",
      "near_crematorium": "",
      "probable_road_extension": "",
      "statutory_notices_on_property": "",
      "community_dominated": "",
      "near_garbage_dump": "",
      "property_access_issues": "",
      "under_high_tension_line": "",
      "flood_prone": "",
      "near_nalla": "",
      "property_is_land_locked": "",
      "land_reservation": "",
      "near_to_rail_track": "",
      "slum_area": ""
    }
  },
  "photo_analysis": [
    {
      "source_category": "",
      "file_name": "",
      "intent": "",
      "observations": "",
      "supports_fields": [""]
    }
  ],
  "audit_notes": [""]
}
`;
};


// ─────────────────────────────────────────────────────────────────────────────
// ImageKit upload helper — uploads a single file buffer and returns URL
// ─────────────────────────────────────────────────────────────────────────────
const uploadToImageKit = async (file, folder = "site-visit-photos") => {
  try {
    const base64 = file.buffer.toString("base64");
    const mimeType = file.mimetype || "image/jpeg";
    const fileDataUrl = `data:${mimeType};base64,${base64}`;
    const timestamp = Date.now();
    const safeName = (file.originalname || "photo.jpg").replace(/[^a-zA-Z0-9._-]/g, "_");

    const result = await imagekit.upload({
      file: fileDataUrl,
      fileName: `${timestamp}_${safeName}`,
      folder: `/${folder}`,
      useUniqueFileName: true,
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: file.originalname,
      mimeType,
    };
  } catch (err) {
    console.error(`ImageKit upload failed for ${file.originalname}:`, err.message);
    return null; // Don't block if one photo fails
  }
};

const XLSX = require("xlsx");

const callClaudeAPI = async (system, messagesPrompt, mediaBlocks = []) => {
  const api_key = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!api_key) {
    throw new Error("CLAUDE_API_KEY is not configured in the environment (.env file).");
  }

  const headers = {
    "content-type": "application/json",
    "x-api-key": api_key,
    "anthropic-version": "2023-06-01",
  };

  const hasPdf = mediaBlocks.some((block) => block.type === "document");
  if (hasPdf) {
    headers["anthropic-beta"] = "pdfs-2024-09-25";
  }

  // Filter out any invalid/empty content blocks to prevent Anthropic validation errors
  const validContentBlocks = mediaBlocks.filter(block => {
    if (!block) return false;
    if (block.type === "text" && !block.text) return false;
    if ((block.type === "image" || block.type === "document") && (!block.source || !block.source.data)) return false;
    return true;
  });

  const requestBody = {
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 8192,
    system: system,
    messages: [
      {
        role: "user",
        content: [
          ...validContentBlocks,
          {
            type: "text",
            text: messagesPrompt,
          },
        ],
      },
    ],
  };

  console.log(`[Claude API] Requesting advanced autofill extraction (${hasPdf ? "with PDF" : "standard"})...`);
  const response = await axios.post("https://api.anthropic.com/v1/messages", requestBody, { headers });
  
  return response.data?.content?.[0]?.text || "";
};

const getFileContentBlock = async (file) => {
  const mime = (file.mimetype || "").toLowerCase();
  
  if (mime === "application/pdf") {
    return {
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: file.buffer.toString("base64"),
      },
    };
  }
  
  if (mime.startsWith("image/")) {
    let mediaType = mime;
    if (mediaType === "image/jpg") mediaType = "image/jpeg";
    return {
      type: "image",
      source: {
        type: "base64",
        media_type: mediaType,
        data: file.buffer.toString("base64"),
      },
    };
  }

  // If Excel or CSV, parse it and return as text
  if (
    mime.includes("sheet") ||
    mime.includes("excel") ||
    mime.includes("csv") ||
    file.originalname.endsWith(".xlsx") ||
    file.originalname.endsWith(".xls") ||
    file.originalname.endsWith(".csv")
  ) {
    try {
      if (file.originalname.endsWith(".csv") || mime.includes("csv")) {
        let text;
        try {
          text = file.buffer.toString("utf-8");
        } catch {
          text = file.buffer.toString("latin1");
        }
        return {
          type: "text",
          text: `[Excel/CSV Content from ${file.originalname}]:\n${text}`,
        };
      } else {
        const workbook = XLSX.read(file.buffer, {
          type: "buffer",
          cellDates: true,
          cellNF: true,
          cellText: true,
        });
        const allSheetsText = workbook.SheetNames.map((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const aoa = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: "",
            raw: false,
          });
          const nonEmptyRows = aoa.filter((row) =>
            row.some((cell) => cell !== "" && cell !== null && cell !== undefined)
          );
          if (nonEmptyRows.length === 0) return null;
          const rowsText = nonEmptyRows
            .map((row) => row.map((cell) => String(cell).trim()).join(" | "))
            .join("\n");
          return `=== SHEET: ${sheetName} ===\n${rowsText}`;
        })
          .filter(Boolean)
          .join("\n\n");
        return {
          type: "text",
          text: `[Excel Content from ${file.originalname}]:\n${allSheetsText}`,
        };
      }
    } catch (err) {
      console.warn(`Failed to parse spreadsheet ${file.originalname}:`, err.message);
    }
  }

  // Otherwise, default to text description
  return {
    type: "text",
    text: `[Unsupported file attachment: ${file.originalname} of type ${mime}]`,
  };
};

const advancedAutofill = async (req, res) => {
  try {
    const api_key = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!api_key) {
      return res.status(500).json({
        success: false,
        message: "No Claude API key (CLAUDE_API_KEY or ANTHROPIC_API_KEY) found on the server.",
      });
    }

    const { caseId } = req.body || {};

    // ── 1. Collect NEW files from request ────────────────────────────────────
    const newFilesByCategory = {
      gpsFiles:        req.files?.gpsFiles        || [],
      atsFiles:        req.files?.atsFiles         || [],
      emailFiles:      req.files?.emailFiles       || [],
      fieldFormFiles:  req.files?.fieldFormFiles   || [],
      additionalFiles: req.files?.additionalFiles  || [],
    };

    const newSiteVisitPhotos = req.files?.siteVisitPhotos || [];
    const newSiteVisitVideo = req.files?.siteVisitVideo || [];

    // ── 2. Upload new site visit photos to ImageKit in parallel ─────────────
    let siteVisitPhotoUrls = [];
    if (newSiteVisitPhotos.length > 0) {
      console.log(`📸 Uploading ${newSiteVisitPhotos.length} site visit photos to ImageKit...`);
      const uploadResults = await Promise.all(
        newSiteVisitPhotos.map((file) => uploadToImageKit(file, "site-visit-photos"))
      );
      siteVisitPhotoUrls = uploadResults.filter(Boolean); // Remove nulls (failed uploads)
      console.log(`✅ ImageKit: ${siteVisitPhotoUrls.length}/${newSiteVisitPhotos.length} photos uploaded.`);
    }

    // ── Upload new atsFiles to ImageKit in parallel ─────────────────────────
    let atsDocumentUrls = [];
    if (newFilesByCategory.atsFiles && newFilesByCategory.atsFiles.length > 0) {
      console.log(`📄 Uploading ${newFilesByCategory.atsFiles.length} ATS documents to ImageKit...`);
      const uploadResults = await Promise.all(
        newFilesByCategory.atsFiles.map((file) => uploadToImageKit(file, "ats-documents"))
      );
      atsDocumentUrls = uploadResults.filter(Boolean);
      console.log(`✅ ImageKit: ${atsDocumentUrls.length}/${newFilesByCategory.atsFiles.length} ATS documents uploaded.`);
    }

    // ── Upload new siteVisitVideo to ImageKit in parallel ───────────────────
    let siteVisitVideoUrls = [];
    if (newSiteVisitVideo.length > 0) {
      console.log(`🎥 Uploading ${newSiteVisitVideo.length} site visit videos to ImageKit...`);
      const uploadResults = await Promise.all(
        newSiteVisitVideo.map((file) => uploadToImageKit(file, "site-visit-videos"))
      );
      siteVisitVideoUrls = uploadResults.filter(Boolean);
      console.log(`✅ ImageKit: ${siteVisitVideoUrls.length}/${newSiteVisitVideo.length} site visit videos uploaded.`);
    }

    // ── Upload new gpsFiles to ImageKit in parallel ─────────────────────────
    let gpsDocumentUrls = [];
    if (newFilesByCategory.gpsFiles && newFilesByCategory.gpsFiles.length > 0) {
      console.log(`📍 Uploading ${newFilesByCategory.gpsFiles.length} GPS documents to ImageKit...`);
      const uploadResults = await Promise.all(
        newFilesByCategory.gpsFiles.map((file) => uploadToImageKit(file, "gps-documents"))
      );
      gpsDocumentUrls = uploadResults.filter(Boolean);
      console.log(`✅ ImageKit: ${gpsDocumentUrls.length}/${newFilesByCategory.gpsFiles.length} GPS documents uploaded.`);
    }

    // ── Upload new emailFiles to ImageKit in parallel ───────────────────────
    let emailDocumentUrls = [];
    if (newFilesByCategory.emailFiles && newFilesByCategory.emailFiles.length > 0) {
      console.log(`📧 Uploading ${newFilesByCategory.emailFiles.length} email documents to ImageKit...`);
      const uploadResults = await Promise.all(
        newFilesByCategory.emailFiles.map((file) => uploadToImageKit(file, "email-documents"))
      );
      emailDocumentUrls = uploadResults.filter(Boolean);
      console.log(`✅ ImageKit: ${emailDocumentUrls.length}/${newFilesByCategory.emailFiles.length} email documents uploaded.`);
    }

    // ── Upload new fieldFormFiles to ImageKit in parallel ───────────────────
    let fieldFormDocumentUrls = [];
    if (newFilesByCategory.fieldFormFiles && newFilesByCategory.fieldFormFiles.length > 0) {
      console.log(`📋 Uploading ${newFilesByCategory.fieldFormFiles.length} field forms to ImageKit...`);
      const uploadResults = await Promise.all(
        newFilesByCategory.fieldFormFiles.map((file) => uploadToImageKit(file, "field-forms"))
      );
      fieldFormDocumentUrls = uploadResults.filter(Boolean);
      console.log(`✅ ImageKit: ${fieldFormDocumentUrls.length}/${newFilesByCategory.fieldFormFiles.length} field forms uploaded.`);
    }

    // ── Upload new additionalFiles to ImageKit in parallel ──────────────────
    let additionalDocumentUrls = [];
    if (newFilesByCategory.additionalFiles && newFilesByCategory.additionalFiles.length > 0) {
      console.log(`🗂️ Uploading ${newFilesByCategory.additionalFiles.length} additional files to ImageKit...`);
      const uploadResults = await Promise.all(
        newFilesByCategory.additionalFiles.map((file) => uploadToImageKit(file, "additional-files"))
      );
      additionalDocumentUrls = uploadResults.filter(Boolean);
      console.log(`✅ ImageKit: ${additionalDocumentUrls.length}/${newFilesByCategory.additionalFiles.length} additional files uploaded.`);
    }

    // ── Fetch existing documents from database and merge for Gemini ─────────
    const filesByCategory = {
      gpsFiles:        [...newFilesByCategory.gpsFiles],
      atsFiles:        [...newFilesByCategory.atsFiles],
      emailFiles:      [...newFilesByCategory.emailFiles],
      fieldFormFiles:  [...newFilesByCategory.fieldFormFiles],
      additionalFiles: [...newFilesByCategory.additionalFiles],
    };
    let siteVisitPhotos = [...newSiteVisitPhotos];
    let siteVisitVideo = [...newSiteVisitVideo];

    let dbGpsUrls = [];
    let dbAtsUrls = [];
    let dbEmailUrls = [];
    let dbFieldFormUrls = [];
    let dbAdditionalUrls = [];
    let dbPhotoUrls = [];
    let dbVideoUrls = [];

    const getUrl = (doc) => {
      if (!doc) return null;
      if (typeof doc === "string") return doc;
      return doc.url || null;
    };

    const getName = (doc, index) => {
      if (!doc) return `file_${index}`;
      if (typeof doc === "string") {
        try {
          const u = new URL(doc);
          return u.pathname.substring(u.pathname.lastIndexOf("/") + 1) || `file_${index}`;
        } catch (e) {
          return `file_${index}`;
        }
      }
      return doc.name || `file_${index}`;
    };

    const getFileId = (doc) => {
      if (!doc) return null;
      if (typeof doc === "string") return doc;
      return doc.fileId || doc.url || null;
    };

    const normalizeDbDocs = (dbDocs) => {
      if (!Array.isArray(dbDocs)) return [];
      return dbDocs.map((doc, idx) => ({
        url: getUrl(doc),
        fileId: getFileId(doc),
        name: getName(doc, idx),
      })).filter(d => d.url);
    };

    const downloadDbFiles = async (dbDocs) => {
      const files = [];
      if (Array.isArray(dbDocs)) {
        for (let i = 0; i < dbDocs.length; i++) {
          const doc = dbDocs[i];
          const url = getUrl(doc);
          if (url) {
            console.log(`[Advanced AI] Downloading DB file: ${url}`);
            const downloaded = await downloadFileAsBuffer(url);
            if (downloaded) {
              files.push(downloaded);
            }
          }
        }
      }
      return files;
    };

    if (caseId) {
      console.log(`[Advanced AI] Fetching case ID: ${caseId}`);
      const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
      let matchedCase = null;
      for (const bankConfig of bankRegistry) {
        const Model = bankConfig.model || bankConfig;
        if (Model && Model.findById) {
          const exists = await Model.findById(caseId);
          if (exists) {
            matchedCase = exists;
            break;
          }
        }
      }

      if (matchedCase) {
        console.log(`[Advanced AI] Case found in database. Merging document references...`);

        dbGpsUrls = normalizeDbDocs(matchedCase.gpsFiles);
        dbAtsUrls = normalizeDbDocs(matchedCase.atsDocuments);
        dbEmailUrls = normalizeDbDocs(matchedCase.emailFiles);
        dbFieldFormUrls = normalizeDbDocs(matchedCase.fieldFormFiles);
        dbAdditionalUrls = normalizeDbDocs(matchedCase.additionalFiles);
        dbPhotoUrls = normalizeDbDocs([
          ...(matchedCase.sitePhotographs || []),
          ...(matchedCase.otherImages || []),
          ...(matchedCase.imageUrls || []),
        ]);
        dbVideoUrls = normalizeDbDocs(matchedCase.siteVisitVideo);

        // Download existing files and append to list for Gemini
        const dbGps = await downloadDbFiles(matchedCase.gpsFiles);
        filesByCategory.gpsFiles.push(...dbGps);

        const dbAts = await downloadDbFiles(matchedCase.atsDocuments);
        filesByCategory.atsFiles.push(...dbAts);

        const dbEmail = await downloadDbFiles(matchedCase.emailFiles);
        filesByCategory.emailFiles.push(...dbEmail);

        const dbFieldForm = await downloadDbFiles(matchedCase.fieldFormFiles);
        filesByCategory.fieldFormFiles.push(...dbFieldForm);

        const dbAdditional = await downloadDbFiles(matchedCase.additionalFiles);
        filesByCategory.additionalFiles.push(...dbAdditional);

        const dbPhotos = await downloadDbFiles([
          ...(matchedCase.sitePhotographs || []),
          ...(matchedCase.otherImages || []),
          ...(matchedCase.imageUrls || []),
        ]);
        siteVisitPhotos.push(...dbPhotos);

        const dbVideo = await downloadDbFiles(matchedCase.siteVisitVideo);
        siteVisitVideo.push(...dbVideo);
      }
    }

    const mergedSiteVisitPhotoUrls = [...siteVisitPhotoUrls, ...dbPhotoUrls];
    const mergedAtsDocumentUrls = [...atsDocumentUrls, ...dbAtsUrls];
    const mergedSiteVisitVideoUrls = [...siteVisitVideoUrls, ...dbVideoUrls];
    const mergedGpsDocumentUrls = [...gpsDocumentUrls, ...dbGpsUrls];
    const mergedEmailDocumentUrls = [...emailDocumentUrls, ...dbEmailUrls];
    const mergedFieldFormDocumentUrls = [...fieldFormDocumentUrls, ...dbFieldFormUrls];
    const mergedAdditionalDocumentUrls = [...additionalDocumentUrls, ...dbAdditionalUrls];

    // Total includes siteVisitPhotos and siteVisitVideo (those are only for media fields, not AI text extraction)
    const totalFiles = Object.values(filesByCategory).reduce(
      (sum, files) => sum + files.length,
      0
    ) + siteVisitPhotos.length + siteVisitVideo.length;

    if (!totalFiles) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded for advanced autofill.",
      });
    }

    // ── 3. Build Claude content parts ────────────────────────────────────────
    let bankName = req.body?.bankName || "";
    // Normalize bankName
    const lowerBank = bankName.toLowerCase();
    if (lowerBank.includes("bajaj")) {
      bankName = "Bajaj";
    } else if (lowerBank.includes("icici")) {
      bankName = "ICICI";
    } else if (lowerBank.includes("homefirst") || lowerBank.includes("home first")) {
      if (lowerBank.includes("tranche") || lowerBank.includes("trnch")) {
        bankName = "Home First Tranche";
      } else {
        bankName = "Home First";
      }
    } else if (lowerBank.includes("aditya")) {
      bankName = "Aditya Birla";
    } else if (lowerBank.includes("manappuram") || lowerBank.includes("manapuram")) {
      bankName = "Manappuram";
    }

    const messagesPrompt = buildPrompt({
      bankName,
      propertyTypeHint:  req.body?.propertyTypeHint,
      additionalNotes:   req.body?.additionalNotes,
      filesByCategory,
    });

    const mediaBlocks = [];

    // Send all document categories to Claude
    for (const [categoryKey, files] of Object.entries(filesByCategory)) {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const block = await getFileContentBlock(file);
        
        mediaBlocks.push({
          type: "text",
          text: `\n--- DOCUMENT CATEGORY: ${CATEGORY_LABELS[categoryKey]} | file ${index + 1} | ${file.originalname} ---`
        });
        mediaBlocks.push(block);
      }
    }

    // Also send siteVisitPhotos to Claude so AI can observe property condition
    if (siteVisitPhotos.length > 0) {
      mediaBlocks.push({
        type: "text",
        text: `\n--- SITE VISIT PHOTOS (${siteVisitPhotos.length} photos — analyze for property condition, GPS watermarks, construction stage) ---`
      });
      for (let index = 0; index < siteVisitPhotos.length; index++) {
        const file = siteVisitPhotos[index];
        const block = await getFileContentBlock(file);
        mediaBlocks.push({
          type: "text",
          text: `Site visit photo ${index + 1}: ${file.originalname}`
        });
        mediaBlocks.push(block);
      }
    }

    // ── 4. Call Claude ───────────────────────────────────────────────────────
    const responseText = await callClaudeAPI(
      `You are an expert Indian bank property valuation AI that extracts data from multiple documents and fills bank forms. Use Hinglish/Roman script for Hindi words but keep other text in English. Return ONLY valid JSON.`,
      messagesPrompt,
      mediaBlocks
    );

    const parsed     = parseModelJson(responseText);
    const normalized = normalizeObject(parsed);
    const flatPayload = buildFlatPayload(normalized);

    const fs = require("fs");
    const path = require("path");
    fs.writeFileSync(
      path.join(__dirname, "../autofill-debug.json"),
      JSON.stringify({
        timestamp: new Date().toISOString(),
        requestFiles: {
          gpsFiles: filesByCategory.gpsFiles.map(f => f.originalname),
          atsFiles: filesByCategory.atsFiles.map(f => f.originalname),
          siteVisitPhotos: siteVisitPhotos.map(f => f.originalname),
          siteVisitVideo: siteVisitVideo.map(f => f.originalname),
        },
        atsDocumentUrls: mergedAtsDocumentUrls,
        siteVisitPhotoUrls: mergedSiteVisitPhotoUrls,
        siteVisitVideoUrls: mergedSiteVisitVideoUrls,
      }, null, 2)
    );

    // ── 5. Return response ───────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      data: flatPayload,
      siteVisitPhotoUrls: mergedSiteVisitPhotoUrls, // Array of { url, fileId, name, mimeType } — for photo field injection
      atsDocumentUrls: mergedAtsDocumentUrls, // Array of { url, fileId, name, mimeType } — for document field injection
      siteVisitVideoUrls: mergedSiteVisitVideoUrls, // Array of { url, fileId, name, mimeType } — for video field injection
      gpsDocumentUrls: mergedGpsDocumentUrls, // Array of { url, fileId, name, mimeType }
      emailDocumentUrls: mergedEmailDocumentUrls, // Array of { url, fileId, name, mimeType }
      fieldFormDocumentUrls: mergedFieldFormDocumentUrls, // Array of { url, fileId, name, mimeType }
      additionalDocumentUrls: mergedAdditionalDocumentUrls, // Array of { url, fileId, name, mimeType }
      sourceSummary: {
        gpsFiles:        filesByCategory.gpsFiles.length,
        atsFiles:        filesByCategory.atsFiles.length,
        emailFiles:      filesByCategory.emailFiles.length,
        fieldFormFiles:  filesByCategory.fieldFormFiles.length,
        additionalFiles: filesByCategory.additionalFiles.length,
        siteVisitPhotos: siteVisitPhotos.length,
        siteVisitUploaded: mergedSiteVisitPhotoUrls.length,
        siteVisitVideo:   siteVisitVideo.length,
        siteVisitVideoUploaded: mergedSiteVisitVideoUrls.length,
      },
      auditNotes:   normalized.audit_notes   || [],
      photoAnalysis: normalized.photo_analysis || [],
    });
  } catch (error) {
    console.error("Advanced autofill failed:", error);
    return res.status(500).json({
      success: false,
      message: "Advanced autofill failed.",
      error: error.message,
    });
  }
};


module.exports = {
  advancedAutofill,
};

