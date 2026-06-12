import { richTextToPlainText, toRichTextHtml } from "./richText";

const FALLBACK_VALUE = "..........";

const firstFilled = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) {
      if (value.length > 0) return value;
      continue;
    }

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }

  return "";
};

const joinPartyNames = (parties = []) =>
  Array.isArray(parties)
    ? parties
        .map((party) => party?.name)
        .filter(Boolean)
        .join(", ")
    : "";

const buildDimensionText = (...values) =>
  firstFilled(...values.map((value) => richTextToPlainText(value))).trim();

const parseReportRemarks = (remarkText = "") => {
  const normalized = richTextToPlainText(remarkText).replace(/\r/g, "\n").trim();
  if (!normalized) return [];

  const numberedMatches = normalized
    .split(/(?:^|\n)(?=\s*\d+[.)]\s+)/)
    .map((item) => item.replace(/^\s*\d+[.)]\s*/, "").trim())
    .filter(Boolean);

  if (numberedMatches.length > 1) {
    return numberedMatches;
  }

  return normalized
    .split(/\n+/)
    .map((line) => line.replace(/^\s*[-*]\s*/, "").trim())
    .filter(Boolean);
};

const buildAreaText = (area, dimensions) => {
  const safeArea = firstFilled(area, "......");
  const safeDimensions = buildDimensionText(dimensions);

  return safeDimensions ? `${safeArea} (${safeDimensions})` : safeArea;
};

const getCommonRemarkContext = (extractedData = {}, formData = {}) => {
  const property = extractedData?.property || {};
  const ownerName = firstFilled(
    property.owner_name,
    formData?.basicDetails?.nameOfPropertyOwner,
    formData?.propertyInfo?.ownerName,
    joinPartyNames(extractedData?.seller),
    FALLBACK_VALUE
  );
  const applicantName = firstFilled(
    property.applicant_name,
    formData?.basicDetails?.nameOfClient,
    formData?.propertyInfo?.applicantName,
    joinPartyNames(extractedData?.buyer),
    FALLBACK_VALUE
  );
  const contactPerson = firstFilled(
    property.contact_person,
    property.duringPropertyVisit,
    formData?.header?.contactedPerson,
    applicantName,
    FALLBACK_VALUE
  );
  const contactNumber = firstFilled(
    property.contact_number,
    property["Mobile No."],
    formData?.contactNumber,
    formData?.customerNo,
    FALLBACK_VALUE
  );
  const plotArea = firstFilled(
    property.LandArea,
    property.plot_area,
    formData?.technicalDetails?.totalLandArea,
    formData?.valuationDetails?.plotAreaInDeed,
    formData?.valuationGLR?.landArea,
    FALLBACK_VALUE
  );
  const plotDimensions = buildDimensionText(
    property.plot_dimensions,
    formData?.propertyInfo?.measurementOfProperty,
    formData?.linearDimension,
    formData?.locationDetails?.dimensionWidth &&
      formData?.locationDetails?.dimensionDepth
      ? `${formData.locationDetails.dimensionWidth} x ${formData.locationDetails.dimensionDepth}`
      : ""
  );
  const locality = firstFilled(
    formData?.locationDetails?.mainLocality,
    formData?.propertyInfo?.locationOfProperty,
    property?.address?.district,
    property?.address?.tehsil,
    "the locality"
  );
  const usage = firstFilled(
    property.property_use,
    formData?.locationDetails?.currentUsage,
    formData?.propertyInfo?.propertyUsage,
    "property use"
  );
  const propertyType = firstFilled(
    property.property_type,
    formData?.locationDetails?.propertyType,
    formData?.propertyInfo?.typeOfProperty,
    "property"
  );
  const landRate = firstFilled(
    formData?.valuationPMR?.landRate,
    formData?.valuationGLR?.landRate,
    formData?.valuationDetails?.plotAreaPhysicalRate,
    formData?.valuationDetails?.builtUpTinShedRate,
    FALLBACK_VALUE
  );

  return {
    applicantName,
    contactNumber,
    contactPerson,
    landRate,
    locality,
    ownerName,
    plotArea,
    plotDimensions,
    propertyType,
    usage,
  };
};

export const buildAdityaRemarksHtml = (extractedData = {}, formData = {}) => {
  const reportRemarks = parseReportRemarks(extractedData?.property?.report_remarks);
  const lines =
    reportRemarks.length > 0
      ? reportRemarks
      : (() => {
          const context = getCommonRemarkContext(extractedData, formData);
          const builtUp = firstFilled(
            formData?.builtUpArea?.totalBuiltUp,
            formData?.valuationDetails?.builtUpAreaTinShed,
            context.plotArea,
            FALLBACK_VALUE
          );

          return [
            `GIVEN XEROX COPY OF DOCUMENT IS IN FAVOUR OF ${context.ownerName}.`,
            `DURING PROPERTY VISIT ${context.contactPerson} WAS MET AT THE PROPERTY. CONTACT NO. ${context.contactNumber}.`,
            "RATE HAS BEEN CONFIRMED FROM LOCAL MARKET ENQUIRY.",
            `PROPERTY IS SITUATED IN ${context.locality} AND THE CURRENT USAGE APPEARS AS ${context.usage}.`,
            `PROPERTY TYPE OBSERVED AT SITE IS ${context.propertyType}.`,
            `TOTAL AREA / BUILT-UP CONSIDERED IS ${buildAreaText(
              builtUp,
              context.plotDimensions
            )}.`,
            "PROPERTY IDENTIFICATION / OWNERSHIP DOCUMENTS SHOULD BE VERIFIED BY THE CREDIT TEAM BEFORE DISBURSEMENT.",
            `TENTATIVE LAND / MARKET RATE CONSIDERED IS RS. ${context.landRate}/-.`,
          ];
        })();

  return lines
    .filter(Boolean)
    .map(
      (line, index) => `<div>${index + 1}. ${toRichTextHtml(line)}</div>`
    )
    .join("");
};

export const buildManappuramRemarks = (extractedData = {}, formData = {}) => {
  const reportRemarks = parseReportRemarks(extractedData?.property?.report_remarks);
  if (reportRemarks.length > 0) {
    return reportRemarks.map((remark) => toRichTextHtml(remark));
  }

  const context = getCommonRemarkContext(extractedData, formData);
  const areaText = buildAreaText(context.plotArea, context.plotDimensions);

  return [
    `GIVEN XEROX COPY OF DOCUMENT IS IN FAVOUR OF ${context.ownerName}.`,
    `DURING PROPERTY VISIT ${context.contactPerson} MET AT THE PROPERTY AND THE CONTACT NUMBER AVAILABLE IS ${context.contactNumber}.`,
    "RATE HAS BEEN CONFIRMED FROM MARKET ENQUIRY.",
    `PROPERTY IS SITUATED AT THE SURROUNDING AREA OF ${context.locality} AND THE PRESENT USAGE IS ${context.usage}.`,
    `AT SITE THE PROPERTY TYPE OBSERVED IS ${context.propertyType}.`,
    `AS PER AVAILABLE DOCUMENTS / SITE INPUT, THE AREA CONSIDERED IS ${areaText}.`,
    "PROPERTY IDENTIFICATION AND OWNERSHIP DOCUMENTS SHOULD BE VERIFIED BY THE CREDIT TEAM BEFORE DISBURSEMENT.",
    `TENTATIVE LAND RATE CONSIDERED IS RS. ${context.landRate}/-.`,
  ].map((remark) => toRichTextHtml(remark));
};

