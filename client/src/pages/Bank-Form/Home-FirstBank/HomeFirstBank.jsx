import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import LNAssigment from "./Form/LNTAssignmentDetails";
import LocalityDetails from "./Form/LocalityDetails";
import PropertyDetails from "./Form/PropertyDetails";
import ValuationDetails from "./Form/ValuationDetails";
import ViolationObserved from "./Form/ViolationObserved";
import FLoorWise from "./Form/FLoorWise";
import HomeFirstPortalSections from "./Form/HomeFirstPortalSections";
import {
  createHFBanks,
  fetchHFBankById,
  updateDetails,
} from "../../../redux/features/Banks/HFBank/HFBankThunk";
import AutoFillForm from "../../AutoFillForm";
import AdvancedAutoFillForm from "../../../components/AdvancedAutoFillForm";
import { finalUpdate } from "../../../redux/features/case/caseThunks";
import { Copy, Download, X } from "lucide-react";
import axiosInstance from "../../../config/axios";
import CaseWorkflowActions from "../../../components/CaseWorkflowActions";
import { getDisplayCustomerName, getDisplayContact, getDisplayAddress } from "../../../utils/dashboardRecord";

const formatDateTimeLocal = (dateValue) => {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// ─── Sidebar Nav Item ────────────────────────────────────────────────────────
const SidebarItem = ({ id, label, isActive, onClick }) => (
  <button
    className={`form-sidebar-item ${isActive ? "is-active" : ""}`}
    onClick={() => onClick(id)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      width: "100%",
      padding: "12px 16px",
      background: isActive ? "#eff6ff" : "transparent",
      border: "none",
      borderLeft: isActive ? "3px solid #1d4ed8" : "3px solid transparent",
      cursor: "pointer",
      textAlign: "left",
      transition: "all 0.15s ease",
    }}
  >
    <span
      style={{
        fontSize: 13,
        fontWeight: isActive ? 700 : 600,
        color: isActive ? "#1d4ed8" : "#4b5563",
        width: 16,
        textAlign: "center",
        flexShrink: 0,
      }}
    >
      {id}
    </span>
    <span
      style={{
        fontSize: 13,
        fontWeight: isActive ? 600 : 500,
        color: isActive ? "#1d4ed8" : "#374151",
        lineHeight: 1.35,
      }}
    >
      {label}
    </span>
  </button>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const HomeFirstBank = () => {
  const dispatch = useDispatch();
  const { loading: apiLoading, error } = useSelector((state) => state.hfBanks);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const roleNormalized = (user?.role || "").toLowerCase().replace(/[\s_]+/g, "");
  const isFieldOfficer = roleNormalized === "fieldofficer";
  const savedCity = useSelector((state) => state.assignedCases.savedCity);
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeSection, setActiveSection] = useState(isFieldOfficer ? 2 : 1);
  const [collectedData, setCollectedData] = useState({});
  const [isEdit, setIsEdit] = useState({});
  const [extractedData, setExtractedData] = useState({});
  const sectionSubmittersRef = useRef({});
  const [createdDate, setCreatedDate] = useState(null);
  const [finalSubmitting, setFinalSubmitting] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonOutputData, setJsonOutputData] = useState(null);
  const [onModalCloseAction, setOnModalCloseAction] = useState(null);
  const [isAutofillOpen, setIsAutofillOpen] = useState(true);
  const [isPropertyDetailsOpen, setIsPropertyDetailsOpen] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  useEffect(() => {
    if (isFieldOfficer && activeSection === 1) {
      setActiveSection(2);
    }
  }, [isFieldOfficer, activeSection]);

  const handleTopInputChange = (field, val) => {
    setIsEdit((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const canFinalSubmit = id && (user?.role === "Admin" || user?.role === "SuperAdmin");

  const primaryActionLabel = isFieldOfficer
    ? "Submit"
    : !id
      ? "Submit"
      : "Update";

  const buildFinalData = (latestSections = {}) => {
    const mergedSections = { ...collectedData, ...latestSections };
    return {
      ...isEdit,
      ...mergedSections.step1,
      ...mergedSections.step2,
      ...mergedSections.step3,
      ...mergedSections.step4,
      ...mergedSections.step5,
      ...mergedSections.step6,
      ...mergedSections.step7,
      ...mergedSections.step8,
      ...mergedSections.step9,
      ...mergedSections.step10,
      ...mergedSections.step11,
      ...mergedSections.step12,
      ...mergedSections.step13,
      ...mergedSections.step14,
      ...mergedSections.step15,
      ...mergedSections.step16,
    };
  };

  const fetchEditData = async (fetchId) => {
    try {
      const response = await dispatch(fetchHFBankById(fetchId)).unwrap();
      const docName = response.customerName || getDisplayCustomerName(response);
      const docContact = response.customerNo || getDisplayContact(response);
      const docAddress = response.addressLegal || response.addressSite || getDisplayAddress(response);

      const enriched = {
        ...response,
        customerName: docName !== "N/A" ? docName : response.customerName,
        customerNo: docContact !== "N/A" ? docContact : response.customerNo,
        addressLegal: docAddress !== "N/A" ? docAddress : response.addressLegal,
        addressSite: docAddress !== "N/A" ? docAddress : response.addressSite,
      };
      setIsEdit(enriched);
    } catch (fetchError) {
      console.error("Error fetching data:", fetchError);
    }
  };

// Dropdown normalization helpers
const normalizeYesNo = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.startsWith("Y") || s === "1" || s === "TRUE") return "YES";
  if (s.startsWith("N") || s === "0" || s === "FALSE") return "NO";
  return undefined;
};

const normalizePropertyCategory = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("PROJECT")) return "PROJECT";
  if (s.includes("INDIVIDUAL")) return "INDIVIDUAL";
  return "OTHER";
};

const normalizeUnitType = (val) => {
  if (!val) return undefined;
  const s = String(val).toLowerCase();
  if (s.includes("flat") || s.includes("apartment")) return "Flat";
  if (s.includes("row")) return "Row House";
  if (s.includes("individual") || s.includes("house") || s.includes("makan") || s.includes("makaan")) return "Individual House";
  if (s.includes("open") || s.includes("plot") || s.includes("land") || s.includes("bhukhand")) return "Open Plot";
  if (s.includes("shop")) return "Shop";
  if (s.includes("office")) return "Office";
  return undefined;
};

const normalizeTypeOfLoan = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("OWN")) return "OWN PLOT + SECO";
  return "PLOT + SECO";
};

const normalizePropertyLocation = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("CITY")) return "CITY";
  if (s.includes("TOWN")) return "TOWN";
  if (s.includes("VILLAGE")) return "VILLAGE";
  return undefined;
};

const normalizeRuralUrban = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("RURAL")) return "RURAL";
  if (s.includes("URBAN")) return "URBAN";
  return undefined;
};

const normalizeZone = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("RESIDENT")) return "RESIDENTIAL";
  if (s.includes("COMMERC")) return "COMMERCIAL";
  if (s.includes("INDUST")) return "INDUSTRIAL";
  if (s.includes("AGRIC")) return "AGRICULTURAL";
  if (s.includes("MIX")) return "MIXED";
  return "OTHER";
};

const normalizePropertyAreaLimits = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("MUNICIPAL-TP") || s.includes("TP")) return "MUNICIPAL-TP";
  if (s.includes("MUNICIPAL") || s.includes("MC") || s.includes("CORP")) return "MUNICIPAL";
  if (s.includes("GP") || s.includes("GRAM") || s.includes("PANCH")) return "GP";
  if (s.includes("ZP") || s.includes("ZILLA")) return "ZP";
  return "OTHER";
};

const normalizeRelation = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("SELF")) return "SELF";
  if (s.includes("SPOUSE") || s.includes("WIFE") || s.includes("HUSBAND")) return "SPOUSE";
  if (s.includes("RELATIVE") || s.includes("FATHER") || s.includes("MOTHER") || s.includes("BROTHER") || s.includes("SISTER") || s.includes("SON") || s.includes("DAUGHTER")) return "RELATIVE";
  if (s.includes("SELLER")) return "SELLER";
  if (s.includes("BUYER")) return "BUYER";
  if (s.includes("COLON")) return "COLONISER";
  if (s.includes("BROK")) return "BROKER";
  return "OTHER";
};

const normalizeOwnerNameSource = (val) => {
  if (!val) return "";
  return String(val).toUpperCase();
};

const normalizeStatusOfOccupancy = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("VACANT")) return "VACANT";
  if (s.includes("PARTLY") || s.includes("PARTIAL")) return "PARTLY OCCUPIED";
  if (s.includes("OCCUPIED") || s.includes("LIVE") || s.includes("TENANT") || s.includes("OWNER")) return "OCCUPIED";
  return "OTHER";
};

const normalizeOccupiedBy = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("OWNER")) return "OWNER";
  if (s.includes("TENANT") || s.includes("RENT")) return "TENANT";
  if (s.includes("THIRD")) return "THIRD PARTY";
  if (s.includes("ENCROACH")) return "ENCROACHER";
  if (s.includes("NA") || s.includes("NOT APPLICABLE")) return "NA";
  return "OTHER";
};

const normalizeUsageOfProperty = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("VACANT") || s.includes("PLOT")) return "VACANT PLOT";
  if (s.includes("RESIDENT")) return "RESIDENTIAL";
  if (s.includes("COMMERC")) return "COMMERCIAL";
  if (s.includes("AGRIC")) return "AGRICULTURAL";
  if (s.includes("MIX")) return "MIXED";
  return "OTHER";
};

const normalizeLocationCategory = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("GP") || s.includes("GRAM") || s.includes("PANCH")) return "GP";
  if (s.includes("MC") || s.includes("CORP") || s.includes("MUNICIPAL")) return "MC";
  if (s.includes("MUNICIPAL-TP") || s.includes("TP")) return "MUNICIPAL-TP";
  return "OTHER";
};

const normalizeApproachRoadType = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("RCC")) return "RCC ROAD";
  if (s.includes("TAR") || s.includes("PUCCA") || s.includes("ASPHALT")) return "TAR ROAD";
  if (s.includes("PAVER") || s.includes("BLOCK")) return "PAVER BLOCK ROAD";
  if (s.includes("SOIL") || s.includes("MUD") || s.includes("KUTCHA") || s.includes("DIRT")) return "SOIL ROAD";
  if (s.includes("GRAVEL") || s.includes("WBM")) return "GRAVEL ROAD";
  return "OTHER";
};

const normalizeOccupancyPercentage = (val) => {
  if (!val) return undefined;
  const s = String(val);
  if (s.includes("100")) return "100%";
  if (s.includes("25")) return "25%";
  if (s.includes("50")) return "50%";
  return "50%";
};

const normalizeHabitation = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("LOW") || s.includes("POOR")) return "LOW";
  if (s.includes("DENSE") || s.includes("HIGH")) return "DENSE";
  return "MEDIUM";
};

const normalizeSeismicZone = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("I")) {
    if (s.includes("II")) {
      if (s.includes("III")) {
        if (s.includes("IV")) {
          if (s.includes("V")) return "V";
          return "IV";
        }
        return "III";
      }
      return "II";
    }
    return "I";
  }
  return "II"; // default
};

const normalizeDemolitionRisk = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("HIGH")) return "HIGH";
  if (s.includes("MED")) return "MEDIUM";
  if (s.includes("LOW")) return "LOW";
  if (s.includes("NO")) return "NO";
  return "LOW";
};

const normalizeDemolitionRiskDetails = (val) => {
  if (!val) return undefined;
  const s = String(val).toLowerCase();
  if (s.includes("forest")) return "Forest Land";
  if (s.includes("govt land") || s.includes("government land")) return "Govt Land";
  if (s.includes("notification")) return "Govt Notification";
  if (s.includes("widening")) return "Road Widening";
  if (s.includes("demolition")) return "Demolition List";
  return "NA";
};


const normalizePlanAuthority = (val, fallback = "NA") => {
  const s = String(val || "").toUpperCase();
  if (!s) return fallback;
  if (s.includes("MUNICIPAL") || s.includes("NAGAR") || s.includes("CORPORATION") || s.includes("NIGAM")) return "MUNICIPAL";
  if (s.includes("GRAM") || s.includes("PANCHAYAT") || s.includes("GP")) return "GP";
  if (s.includes("ZILLA") || s.includes("ZP")) return "ZP";
  if (s.includes("TOWN") || s.includes("COUNTRY") || s.includes("TP") || s.includes("T&CP")) return "TP";
  if (s.includes("ARCHITECT")) return "ARCHITECT";
  if (s.includes("SURVEYOR")) return "LICENSED SURVEYOR";
  if (s.includes("YES")) return "YES";
  if (s.includes("NO")) return "NO";
  if (s.includes("NA") || s.includes("N/A") || s.includes("NOT")) return "NA";
  return fallback;
};

const firstText = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") return String(value).trim();
  }
  return "";
};

const extractDateText = (...values) => {
  const text = firstText(...values);
  const match = text.match(/\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b|\b\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2}\b/);
  return match ? match[0] : "";
};

const buildHomeFirstDocuments = (extracted = {}, property = {}, previousDocs = []) => {
  const municipal = property.municipal_details || {};
  const legal = property.legal_and_compliance || {};
  const docDetails = property.document_details || {};
  const prevByType = new Map((Array.isArray(previousDocs) ? previousDocs : []).map((doc) => [doc.type, doc]));
  const baseAuthority = firstText(extracted.approvingAuthority, extracted.sanctionAuthorityName, legal.approving_authority, municipal.municipal_compliance);
  const sanctionText = firstText(extracted.sanctionedPlanDetails, docDetails.sanctioned_plan_details, municipal.sanction_plan_provided, municipal.municipal_compliance);
  const ccText = firstText(extracted.ccOcDetails, docDetails.cc_oc_details);
  const conversionText = firstText(extracted.conversionDetails, docDetails.conversion_details);

  const makeDoc = (key, type, authority, details, date) => {
    const prev = prevByType.get(type) || {};
    return {
      key,
      type,
      approvingAuthority: firstText(authority, prev.approvingAuthority),
      selectedApprovingAuthority: firstText(authority, prev.selectedApprovingAuthority, prev.approvingAuthority),
      approvalDetails: firstText(details, prev.approvalDetails),
      approvalDate: firstText(date, prev.approvalDate),
    };
  };

  return [
    makeDoc("1", "NA Converted", normalizePlanAuthority(conversionText, conversionText ? "YES" : "NA"), conversionText, extractDateText(conversionText)),
    makeDoc("2", "Layout Plan", normalizePlanAuthority(baseAuthority, "NA"), sanctionText, extractDateText(sanctionText, municipal.date_of_sanction, extracted.dateOfSanction)),
    makeDoc("3", "Building Plan", normalizePlanAuthority(baseAuthority, "NA"), sanctionText, extractDateText(sanctionText, municipal.date_of_sanction, extracted.dateOfSanction)),
    makeDoc("4", "Commencement Certificate", normalizePlanAuthority(baseAuthority, "NA"), firstText(extracted.commencementCertificateDetails, sanctionText), extractDateText(extracted.commencementCertificateDetails, municipal.date_of_sanction, extracted.dateOfSanction)),
    makeDoc("5", "Occupancy / Completion / Building Usage Certificate", normalizePlanAuthority(ccText, ccText ? "YES" : "NA"), ccText, extractDateText(ccText)),
    makeDoc("6", "Sub Plotting Plan", normalizePlanAuthority(extracted.subPlottingPlanDetails, "NA"), firstText(extracted.subPlottingPlanDetails), extractDateText(extracted.subPlottingPlanDetails)),
  ];
};
const normalizeBoundariesMatching = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("PARTIAL")) return "PARTIAL";
  if (s.includes("YES") || s.includes("MATCH")) return "YES";
  if (s.includes("NO") || s.includes("DIFFER")) return "NO";
  if (s.includes("VERIFY") || s.includes("CANNOT")) return "CANNOT VERIFY";
  return "YES";
};

const normalizeMarketability = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("GOOD")) return "GOOD";
  if (s.includes("AVERAGE")) return "AVERAGE";
  if (s.includes("POOR")) return "POOR";
  return "AVERAGE";
};

const normalizeTypeOfStructure = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("RCC")) return "RCC";
  if (s.includes("LOAD") || s.includes("BEAR")) return "Load Bearing";
  return "RCC";
};

const normalizeTypeOfRoof = (val) => {
  if (!val) return undefined;
  const s = String(val).toLowerCase();
  if (s.includes("rcc")) return "RCC";
  if (s.includes("acc") || s.includes("asbestos")) return "ACC Sheet";
  if (s.includes("stone") || s.includes("patti")) return "Stone Patti";
  if (s.includes("tin") || s.includes("sheet") || s.includes("metal")) return "Tin Sheet";
  if (s.includes("terra") || s.includes("tile")) return "Terracotta Tiles";
  return "RCC";
};

const normalizeQualityOfConstruction = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("GOOD")) return "Good";
  if (s.includes("AVERAGE")) return "Average";
  if (s.includes("POOR")) return "Poor";
  return "Average";
};

  const mapExtractedDataToHFSchema = (extracted, prev = {}) => {
    if (!extracted || Object.keys(extracted).length === 0) return {};

    const p = extracted.property || {};
    const addr = p.address || {};
    const bankDet = p.bank_specific_details || {};
    const accom = p.accommodation_details || {};
    const propDet = p.property_details || {};
    const loc = p.location_details || {};
    const struct = p.structural_engineering || {};
    const legal = p.legal_and_compliance || {};
    const infra = p.infrastructure_details || {};

    const village = extracted.villageName || addr.village_name || prev.villageName || "";
    const locCat = extracted.locationCategory || loc.property_falling_within || prev.locationCategory || "";
    const normalizedLocCat = String(locCat).toLowerCase();
    const normalizedVillage = String(village).toLowerCase();

    let finalPropLoc = prev.propertyLocation || "TOWN";
    let finalAreaLim = prev.propertyAreaLimits || "MUNICIPAL-TP";
    let finalRuralUrban = prev.ruralUrban || "URBAN";

    if (normalizedVillage && normalizedVillage !== "na" && normalizedVillage !== "n/a") {
      finalPropLoc = "VILLAGE";
      finalAreaLim = "GP";
      finalRuralUrban = "RURAL";
    } else if (
      normalizedLocCat.includes("municipal") ||
      normalizedLocCat.includes("mc") ||
      normalizedLocCat.includes("corporation") ||
      normalizedLocCat.includes("city")
    ) {
      finalPropLoc = "CITY";
      finalAreaLim = "MUNICIPAL";
      finalRuralUrban = "URBAN";
    } else if (
      normalizedLocCat.includes("nagar") ||
      normalizedLocCat.includes("palika") ||
      normalizedLocCat.includes("planning") ||
      normalizedLocCat.includes("tp") ||
      normalizedLocCat.includes("town")
    ) {
      finalPropLoc = "TOWN";
      finalAreaLim = "MUNICIPAL-TP";
      finalRuralUrban = "URBAN";
    } else if (
      normalizedLocCat.includes("gram") ||
      normalizedLocCat.includes("panchayat") ||
      normalizedLocCat.includes("gp") ||
      normalizedLocCat.includes("village")
    ) {
      finalPropLoc = "VILLAGE";
      finalAreaLim = "GP";
      finalRuralUrban = "RURAL";
    }

    const mapped = {
      // Basic Details / Visit Details (Section 3)
      customerName: extracted.customerName || p.applicant_name || p.owner_name || prev.customerName || "",
      customerNo: extracted.customerNo || extracted.contactNumber || p.contact_number || p["Mobile No."] || prev.customerNo || "",
      propertyOwnerName: extracted.propertyOwnerName || p.owner_name || prev.propertyOwnerName || "",
      personMetDuringVisit: extracted.personMetDuringVisit || p.contact_person || prev.personMetDuringVisit || "N/A",
      personContactNo: extracted.personContactNo || extracted.contactNumber || p.contact_number || prev.personContactNo || "N/A",
      addressLegal: extracted.addressLegal || extracted.propertyAddress || addr.full_address || prev.addressLegal || "",
      addressSite: extracted.addressSite || extracted.propertyAddress || addr.full_address || prev.addressSite || "",
      nearbyLandmark: extracted.nearbyLandmark || extracted.landmark || loc.landmark || prev.nearbyLandmark || "",
      latitude: extracted.latitude || p.latitude || prev.latitude || "",
      longitude: extracted.longitude || p.longitude || prev.longitude || "",
      refNo: extracted.refNo || extracted.registration_number || extracted.fileNo || bankDet.file_no || bankDet.lan_no || prev.refNo || "N/A",
      dateOfReport: extracted.dateOfReport || extracted.reportDate || p.dateOfReport || prev.dateOfReport || null,
      dateOfVisit: extracted.dateOfVisit || extracted.visitDate || p.dateOfVisit || prev.dateOfVisit || null,
      projectPinCode: extracted.projectPinCode || extracted.pincode || addr.pincode || prev.projectPinCode || "",
      nameOnDoor: extracted.nameOnDoor || p.name_on_door || prev.nameOnDoor || "NA",
      nameOnSocietyBoard: extracted.nameOnSocietyBoard || p.name_on_society_board || prev.nameOnSocietyBoard || "",

      // Property Overview (Section 2)
      propertyCategory: normalizePropertyCategory(extracted.propertyCategory || p.property_category || prev.propertyCategory || "INDIVIDUAL"),
      unitType: normalizeUnitType(extracted.unitType || p.property_type || accom.type_of_structure || prev.unitType || "Row House"),
      typeOfLoan: normalizeTypeOfLoan(extracted.typeOfLoan || p.type_of_loan || prev.typeOfLoan || "OWN PLOT + SECO"),
      propertyLocation: normalizePropertyLocation(finalPropLoc),
      populationCensus2011: finalRuralUrban === "URBAN" ? "100000" : "10000",
      ruralUrban: normalizeRuralUrban(finalRuralUrban),
      zone: normalizeZone(extracted.zone || extracted.usageOfProperty || p.property_use || prev.zone || "Residential"),
      propertyAreaLimits: normalizePropertyAreaLimits(finalAreaLim),
      eraApplicable: extracted.eraApplicable || p.legal_and_compliance?.approving_authority || prev.eraApplicable || "",
      projectName: extracted.projectName || p.project_name || prev.projectName || "",

      // Visit details normalizations
      relationshipOfPersonMet: normalizeRelation(extracted.relationshipOfPersonMet || p.relationship_met_at_site || prev.relationshipOfPersonMet || "SELF"),
      howFoundOwnerName: normalizeOwnerNameSource(extracted.howFoundOwnerName || p.how_found_owner_name || prev.howFoundOwnerName || "SALE DEED"),
      documentsAvailable: normalizeYesNo(extracted.documentsAvailable || p.documents_provided || prev.documentsAvailable || "YES"),
      statusOfOccupancy: normalizeStatusOfOccupancy(extracted.statusOfOccupancy || propDet.occupancy || loc.occupancy_level || prev.statusOfOccupancy || "VACANT"),
      occupiedBy: normalizeOccupiedBy(extracted.occupiedBy || propDet.occupied_by || prev.occupiedBy || "NA"),
      usageOfProperty: normalizeUsageOfProperty(extracted.usageOfProperty || extracted.actualUsage || p.property_use || prev.usageOfProperty || "RESIDENTIAL"),
      propertyEasilyIdentifiable: normalizeYesNo(extracted.propertyEasilyIdentifiable || prev.propertyEasilyIdentifiable || "YES"),

      // Locality (Section 4)
      nearestCityTown: String(
        extracted.nearestCityTown ||
        extracted.city ||
        extracted.tehsil ||
        addr.tehsil ||
        addr.district ||
        loc.main_locality ||
        loc.city ||
        prev.nearestCityTown ||
        savedCity ||
        prev.city ||
        ""
      ).toUpperCase(),
      locationCategory: normalizeLocationCategory(extracted.locationCategory || extracted.propertyJurisdiction || loc.property_falling_within || prev.locationCategory || "MC"),
      localityDevelopment: normalizeHabitation(extracted.localityDevelopment || extracted.microLocation || loc.micro_location || prev.localityDevelopment || "Under Developed"),
      approachRoadType: normalizeApproachRoadType(extracted.approachRoadType || extracted.physicalApproach || loc.physical_approach || prev.approachRoadType || "Mud Road"),
      approachRoadWidth: extracted.approachRoadWidth || extracted.widthApproachRoad || loc.width_approach_road || prev.approachRoadWidth || "15ft",
      distanceFromCityCentre: extracted.distanceFromCityCentre || extracted.distanceCityCentre || loc.distance_city_centre || prev.distanceFromCityCentre || "",
      distanceFromRailwayStation: extracted.distanceFromRailwayStation || extracted.distanceRailwayStation || loc.distance_railway_station || prev.distanceFromRailwayStation || "",
      distanceFromBusStand: extracted.distanceFromBusStand || extracted.distanceBusStop || extracted.busStop || loc.distance_bus_stop || prev.distanceFromBusStand || "",
      distanceFromHospital: extracted.distanceFromHospital || extracted.distanceHospital || extracted.hospital || loc.distance_hospital || prev.distanceFromHospital || "",
      occupancyPercentage: normalizeOccupancyPercentage(extracted.occupancyPercentage || extracted.occupancyLevel || loc.occupancy_level || prev.occupancyPercentage || "50%"),
      habitationPercentage: normalizeHabitation(extracted.habitationPercentage || prev.habitationPercentage || "MEDIUM"),
      nallahRiverHighTension: extracted.nallahRiverHighTension || extracted.adverseFactors || loc.adverse_factors || prev.nallahRiverHighTension || "NA",
      electricityAvailability: normalizeYesNo(extracted.electricityAvailability || extracted.electricityAvailable || infra.electricity_available || prev.electricityAvailability || "YES"),
      waterAvailability: normalizeYesNo(extracted.waterAvailability || extracted.waterSupply || infra.water_supply || prev.waterAvailability || "YES"),
      drainageAvailability: normalizeYesNo(extracted.drainageAvailability || extracted.sewerLineConnected || infra.sewer_line_connected || prev.drainageAvailability || "YES"),

      // Property Plan (Section 5)
      documents: buildHomeFirstDocuments(extracted, p, prev.documents),

      // NDMA Guidelines (Section 6)
      seismicZone: normalizeSeismicZone(extracted.seismicZone || struct.seismic_zone || prev.seismicZone || "II"),
      cycloneZone: normalizeYesNo(extracted.cycloneZone || prev.cycloneZone || "NO"),
      landslideProneZone: normalizeYesNo(extracted.landslideProneZone || prev.landslideProneZone || "NO"),
      floodZone: normalizeYesNo(extracted.floodZone || struct.flood_prone_area || prev.floodZone || "NO"),
      crZone: normalizeYesNo(extracted.crZone || prev.crZone || "NO"),
      demolitionRisk: normalizeDemolitionRisk(extracted.demolitionRisk || extracted.riskOfDemolition || legal.risk_of_demolition || prev.demolitionRisk || "LOW"),
      demolitionRiskDetails: normalizeDemolitionRiskDetails(extracted.demolitionRiskDetails || prev.demolitionRiskDetails || "NA"),
      followsNDMAGuidelines: normalizeYesNo(extracted.followsNDMAGuidelines || prev.followsNDMAGuidelines || "YES"),

      // Boundaries & Dimensions (Section 7)
      directions: {
        North: {
          document: extracted.northDocument || extracted.northPlan || p.boundaries?.north_as_per_deed || prev?.directions?.North?.document || "",
          actual: extracted.northActual || p.boundaries?.north_actual || prev?.directions?.North?.actual || "",
          plan: extracted.northPlan || extracted.northDocument || p.boundaries?.north_as_per_deed || prev?.directions?.North?.plan || "",
        },
        South: {
          document: extracted.southDocument || extracted.southPlan || p.boundaries?.south_as_per_deed || prev?.directions?.South?.document || "",
          actual: extracted.southActual || p.boundaries?.south_actual || prev?.directions?.South?.actual || "",
          plan: extracted.southPlan || extracted.southDocument || p.boundaries?.south_as_per_deed || prev?.directions?.South?.plan || "",
        },
        East: {
          document: extracted.eastDocument || extracted.eastPlan || p.boundaries?.east_as_per_deed || prev?.directions?.East?.document || "",
          actual: extracted.eastActual || p.boundaries?.east_actual || prev?.directions?.East?.actual || "",
          plan: extracted.eastPlan || extracted.eastDocument || p.boundaries?.east_as_per_deed || prev?.directions?.East?.plan || "",
        },
        West: {
          document: extracted.westDocument || extracted.westPlan || p.boundaries?.west_as_per_deed || prev?.directions?.West?.document || "",
          actual: extracted.westActual || p.boundaries?.west_actual || prev?.directions?.West?.actual || "",
          plan: extracted.westPlan || extracted.westDocument || p.boundaries?.west_as_per_deed || prev?.directions?.West?.plan || "",
        },
      },
      boundariesMatching: normalizeBoundariesMatching(extracted.boundariesMatching || prev.boundariesMatching || "YES"),
      propertyDemarcated: normalizeYesNo(extracted.propertyDemarcated || propDet.property_demarcated || prev.propertyDemarcated || "YES"),
      boundaryRemarks: extracted.boundaryRemarks || prev.boundaryRemarks || "",
      marketability: normalizeMarketability(extracted.marketability || accom.marketability || prev.marketability || "AVERAGE"),
      landArea: extracted.landArea || extracted.plotArea || prev.landArea || "",
      linearDimension: extracted.linearDimension || extracted.plotDimensions || prev.linearDimension || "",
      plotArea: Number(extracted.plotArea) || Number(extracted.landArea) || prev.plotArea || 0,

      // Structural Details (Section 8)
      typeOfStructure: normalizeTypeOfStructure(extracted.typeOfStructure || p.property_sub_type || accom.type_of_structure || prev.typeOfStructure || "RCC"),
      typeOfRoof: normalizeTypeOfRoof(extracted.typeOfRoof || struct.roof_type || prev.typeOfRoof || "RCC"),
      noOfFloorsPermissible: extracted.noOfFloorsPermissible || prev.noOfFloorsPermissible || "NA",
      noOfFloorsActual: Number(extracted.noOfFloorsActual) || Number(extracted.totalNoOfFloors) || prev.noOfFloorsActual || 0,
      noOfUnitFlatOnEachFloor: extracted.noOfUnitFlatOnEachFloor || prev.noOfUnitFlatOnEachFloor || "NA",
      qualityOfConstruction: normalizeQualityOfConstruction(extracted.qualityOfConstruction || extracted.constructionQuality || accom.quality_of_construction || prev.qualityOfConstruction || "Average"),
      approxAgeOfProperty: Number(extracted.approxAgeOfProperty) || Number(extracted.ageOfProperty) || Number(extracted.propertyAge) || Number(accom.age_of_property) || prev.approxAgeOfProperty || 0,
      residualAge: Number(extracted.residualAge) || Number(accom.residual_age) || prev.residualAge || 0,
    };

    return mapped;
  };



  useEffect(() => {
    if (user?.role?.toLowerCase() === "fieldofficer" && !id) {
      toast.error("You do not have permission to create cases");
      navigate("/field/dashboard");
      return;
    }

    if (id) {
      fetchEditData(id);
    } else {
      setIsEdit({});
      setCollectedData({});
      setExtractedData({});
      setActiveSection(isFieldOfficer ? 2 : 1);
    }
  }, [id, user, navigate]);



  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      console.log("Auto data received:", extractedData);
      
      setIsEdit((prev) => {
        const mergeUniqueFiles = (existing = [], incoming = []) => {
          const seen = new Set(existing.map(f => typeof f === "string" ? f : (f?.url || "")));
          const result = [...existing];
          incoming.forEach(f => {
            const url = typeof f === "string" ? f : (f?.url || "");
            if (url && !seen.has(url)) {
              result.push(f);
              seen.add(url);
            }
          });
          return result;
        };

        const schemaMapped = mapExtractedDataToHFSchema(extractedData, prev);
        const updated = {
          ...prev,
          ...extractedData,
          ...schemaMapped,
          imageUrls: extractedData.imageUrls
            ? mergeUniqueFiles(prev?.imageUrls || [], extractedData.imageUrls)
            : prev?.imageUrls,
          siteVisitVideo: extractedData.siteVisitVideo
            ? mergeUniqueFiles(prev?.siteVisitVideo || [], extractedData.siteVisitVideo)
            : prev?.siteVisitVideo,
          atsDocuments: extractedData.atsDocuments
            ? mergeUniqueFiles(prev?.atsDocuments || [], extractedData.atsDocuments)
            : prev?.atsDocuments,
          AttachDocuments: extractedData.atsDocuments
            ? mergeUniqueFiles(prev?.AttachDocuments || [], extractedData.atsDocuments)
            : prev?.AttachDocuments,
        };

        if (id) {
          const finalPayload = { ...updated, city: savedCity };
          dispatch(updateDetails({ id, ...finalPayload }))
            .unwrap()
            .then((res) => {
              if (res) {
                setIsEdit(res);
                setExtractedData({});
              }
              toast.success("AI extracted data saved successfully!");
            })
            .catch((err) => {
              console.error("Failed to save AI data:", err);
              toast.error("Failed to save AI data to database");
            });
        }

        return updated;
      });
    }
  }, [extractedData, id, dispatch, savedCity]);

  const registerSectionSubmitter = (sectionId, submitter) => {
    sectionSubmittersRef.current[sectionId] = submitter;
  };

  const allSections = React.useMemo(() => [
    {
      id: 1,
      label: "General Details",
      component: (
        <>
          <LNAssigment
            isEdit={isEdit}
            sectionId={1}
            visibleSection="general"
            showActionButtons={false}
            registerSectionSubmitter={registerSectionSubmitter}
            extractedData={extractedData}
            fetchData={() => fetchEditData(id)}
            onNext={handleSaveAndProceed}
            onBack={handleBack}
          />


        </>
      ),
    },
    {
      id: 2,
      label: "Property Overview",
      component: (
        <LNAssigment
          isEdit={isEdit}
          sectionId={2}
          visibleSection="propertyOverview"
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
          fetchData={() => fetchEditData(id)}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
    {
      id: 3,
      label: "Visit Details",
      component: (
        <LNAssigment
          isEdit={isEdit}
          sectionId={3}
          visibleSection="visitDetails"
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
          fetchData={() => fetchEditData(id)}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
    {
      id: 4,
      label: "Locality",
      component: (
        <LocalityDetails
          isEdit={isEdit}
          sectionId={4}
          visibleSection="locality"
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
    {
      id: 5,
      label: "Property Plan",
      component: (
        <LocalityDetails
          isEdit={isEdit}
          sectionId={5}
          visibleSection="propertyPlan"
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
    {
      id: 6,
      label: "NDMA Guidelines",
      component: (
        <LocalityDetails
          isEdit={isEdit}
          sectionId={6}
          visibleSection="ndma"
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
    {
      id: 7,
      label: "Boundaries & Dimensions",
      component: (
        <PropertyDetails
          isEdit={isEdit}
          sectionId={7}
          visibleSection="boundaries"
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
    {
      id: 8,
      label: "Structural Details",
      component: (
        <PropertyDetails
          isEdit={isEdit}
          sectionId={8}
          visibleSection="structural"
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
    {
      id: 9,
      label: "Violation Observed",
      component: (
        <ViolationObserved
          isEdit={isEdit}
          sectionId={9}
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
    {
      id: 10,
      label: "Valuation",
      component: (
        <ValuationDetails
          isEdit={isEdit}
          sectionId={10}
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
    {
      id: 11,
      label: "Floor Wise Built-Up Area",
      component: (
        <FLoorWise
          isEdit={isEdit}
          sectionId={11}
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
    {
      id: 12,
      label: "Observations",
      component: (
        <HomeFirstPortalSections
          mode="observations"
          isEdit={isEdit}
          sectionId={12}
          registerSectionSubmitter={registerSectionSubmitter}
          fetchData={() => fetchEditData(id)}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
    {
      id: 13,
      label: "Billing",
      component: (
        <HomeFirstPortalSections
          mode="billing"
          isEdit={isEdit}
          sectionId={13}
          registerSectionSubmitter={registerSectionSubmitter}
          fetchData={() => fetchEditData(id)}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
    {
      id: 14,
      label: "Site Pics",
      component: (
        <HomeFirstPortalSections
          mode="photos"
          isEdit={isEdit}
          sectionId={14}
          registerSectionSubmitter={registerSectionSubmitter}
          fetchData={() => fetchEditData(id)}
          onNext={handleSaveAndProceed}
          onBack={handleBack}
        />
      ),
    },
  ], [isEdit, extractedData, id, savedCity]);

  const sections = React.useMemo(() => {
    if (isFieldOfficer) {
      return allSections.filter((s) => s.id !== 1);
    }
    return allSections;
  }, [allSections, isFieldOfficer]);

  const activeContent = sections.find((s) => s.id === activeSection);

  const collectSectionData = async () => {
    const latestData = {};
    for (const section of sections) {
      const submitter = sectionSubmittersRef.current[section.id];
      if (typeof submitter !== "function") continue;
      const sectionData = await submitter();
      latestData[`step${section.id}`] = sectionData;
    }
    setCollectedData((prev) => ({ ...prev, ...latestData }));
    return latestData;
  };

  async function handleSaveAndProceed() {
    try {
      if (isFieldOfficer) {
        if (id) {
          const finalPayload = { ...isEdit, ...extractedData, city: savedCity, isReportSubmitted: false };
          const response = await dispatch(updateDetails({ id, ...finalPayload })).unwrap();
          if (response) {
            setIsEdit(response);
          }
          toast.success("Details saved successfully");
        } else {
          toast.success("Progress saved locally");
        }
        return;
      }

      const submitter = sectionSubmittersRef.current[activeSection];
      let sectionData = {};
      if (typeof submitter === "function") {
        sectionData = await submitter();
        setCollectedData((prev) => ({
          ...prev,
          [`step${activeSection}`]: sectionData,
        }));
      }

      if (id) {
        const latestSections = { [`step${activeSection}`]: sectionData };
        const finalData = buildFinalData(latestSections);
        const status = isEdit?.assignedTo ? "Work in Progress" : "Pending";
        const finalPayload = { ...finalData, status, city: savedCity };
        const response = await dispatch(updateDetails({ id, ...finalPayload })).unwrap();
        if (response) {
          setIsEdit(response);
        }
      }

      const currentIndex = sections.findIndex((s) => s.id === activeSection);
      if (currentIndex !== -1 && currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        setActiveSection(nextSection.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Save & Proceed validation/API error details:", err);
      if (err?.errorFields) {
        const fieldNames = err.errorFields.map(f => f.name.join(".")).join(", ");
        toast.error(`Required fields missing: ${fieldNames}`);
      } else {
        toast.error(err?.message || "Please complete the required fields");
      }
    }
  }

  function handleBack() {
    const currentIndex = sections.findIndex((s) => s.id === activeSection);
    if (currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      setActiveSection(prevSection.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }



  const handleFOSave = async () => {
    setLoading(true);
    try {
      const payload = { ...isEdit, ...extractedData, city: savedCity, isReportSubmitted: false };
      if (id) {
        await dispatch(updateDetails({ id, ...payload })).unwrap();
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleFOSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...isEdit, ...extractedData, city: savedCity, isReportSubmitted: false, status: "Work in Progress" };
      if (id) {
        await dispatch(updateDetails({ id, ...payload })).unwrap();
        await dispatch(finalUpdate({ id, bankName: "home-first", updateData: { isReportSubmitted: false, status: "Work in Progress" } })).unwrap();
      } else {
        await dispatch(createHFBanks(payload)).unwrap();
      }
      navigate("/field/dashboard");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAdminGenerate = async () => {
    setLoading(true);
    try {
      const latestSections = await collectSectionData();
      const finalData = buildFinalData(latestSections);
      const visitDate = finalData.dateOfVisit || finalData.dateOfReport;
      const targetCreatedAt = finalData.createdAt
        ? new Date(finalData.createdAt)
        : (visitDate ? new Date(visitDate) : undefined);

      let finalPayload = { ...finalData, city: savedCity, status: "Generated" };
      if (targetCreatedAt && !isNaN(targetCreatedAt.getTime())) {
        finalPayload.createdAt = targetCreatedAt;
      }

      if (!id) {
        await dispatch(createHFBanks(finalPayload)).unwrap();
      } else {
        await dispatch(updateDetails({ id, ...finalPayload })).unwrap();
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePrimaryAction = async (finalSubmit) => {
    try {
      const latestSections = await collectSectionData();
      const finalData = buildFinalData(latestSections);
      const visitDate = finalData.dateOfVisit || finalData.dateOfReport;
      const targetCreatedAt = finalData.createdAt
        ? new Date(finalData.createdAt)
        : (visitDate ? new Date(visitDate) : undefined);

      let finalPayload = { ...finalData, city: savedCity };
      if (targetCreatedAt && !isNaN(targetCreatedAt.getTime())) {
        finalPayload.createdAt = targetCreatedAt;
      }
      if (!id) {
        finalPayload.status = "Pending";
      } else if (finalSubmit === "final") {
        finalPayload.status = "FinalSubmitted";
      } else {
        finalPayload.status = isEdit?.assignedTo ? "Work in Progress" : "Pending";
      }

      console.log("FINAL PAYLOAD BEFORE UPDATE:", finalPayload);

      if (isFieldOfficer) {
        const payload = { ...isEdit, ...extractedData, city: savedCity, isReportSubmitted: true };
        if (id) {
          await dispatch(updateDetails({ id, ...payload })).unwrap();
        } else {
          await dispatch(createHFBanks(payload)).unwrap();
        }
        toast.success("Form submitted successfully");
        navigate("/");
        return;
      }

      if (!id) {
        const res = await dispatch(createHFBanks(finalPayload)).unwrap();
        toast.success("Form submitted successfully");
        setJsonOutputData(res?.updatedJob || res?.data || res || finalPayload);
        setOnModalCloseAction(() => () => navigate("/"));
        setShowJsonModal(true);
        return;
      }

      const res = await dispatch(updateDetails({ id, ...finalPayload })).unwrap();
      toast.success("Form updated successfully");
      setJsonOutputData(res?.updatedJob || res?.data || res || finalPayload);
      setOnModalCloseAction(() => () => navigate("/"));
      setShowJsonModal(true);
    } catch (submitError) {
      if (submitError?.errorFields) {
        toast.error("Please complete the required fields");
        return;
      }
      toast.error("Failed to submit form");
    }
  };

  const handleFinalSubmit = async () => {
    if (!id || !canFinalSubmit) {
      toast.error("Cannot perform final submit");
      return;
    }
    setFinalSubmitting(true);
    try {
      const latestSections = await collectSectionData();
      const finalData = buildFinalData(latestSections);
      const visitDate = finalData.dateOfVisit || finalData.dateOfReport;
      const targetCreatedAt = finalData.createdAt
        ? new Date(finalData.createdAt)
        : (visitDate ? new Date(visitDate) : undefined);

      let finalPayload = { ...finalData, city: savedCity };
      if (targetCreatedAt && !isNaN(targetCreatedAt.getTime())) {
        finalPayload.createdAt = targetCreatedAt;
      }

      const res = await dispatch(updateDetails({ id, ...finalPayload })).unwrap();
      await dispatch(
        finalUpdate({ id, bankName: "home-first", updateData: finalPayload })
      ).unwrap();

      toast.success("Case final submitted successfully!");
      setJsonOutputData(res?.updatedJob || res?.data || res || finalPayload);
      setOnModalCloseAction(() => () => navigate("/"));
      setShowJsonModal(true);
    } catch (err) {
      console.error("Final submission failed:", err);
      toast.error(err?.message || "Final submission failed");
    } finally {
      setFinalSubmitting(false);
    }
  };

  const handleCopyJson = () => {
    if (jsonOutputData) {
      navigator.clipboard.writeText(JSON.stringify(jsonOutputData, null, 2));
      toast.success("JSON copied to clipboard!");
    }
  };

  const handleDownloadJson = () => {
    if (jsonOutputData) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonOutputData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `home_first_valuation_${id || "case"}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast.success("JSON downloaded successfully!");
    }
  };

  const handleJustCloseModal = () => {
    setShowJsonModal(false);
  };

  const handleCloseJsonModal = () => {
    setShowJsonModal(false);
    if (onModalCloseAction) {
      onModalCloseAction();
    }
  };

  const handleDownloadAll = async () => {
    const toastId = toast.loading("Fetching latest files and generating ZIP…");
    try {
      const { saveAs } = await import("file-saver");

      // ── Always fetch the freshest data from server so recently-uploaded files are included ──
      let freshData = isEdit;
      if (id) {
        try {
          const response = await dispatch(fetchHFBankById(id)).unwrap();
          freshData = response;
          setIsEdit(response); // also sync local state
        } catch (fetchErr) {
          console.warn("Could not refresh from server, using cached isEdit:", fetchErr);
        }
      }

      // Fallback: if still nothing, use built collected section data
      const dataSource = freshData || collectedData || {};

      const urls = [];

      // ── Smart URL extractor — handles { url, fileId }, plain strings, and nested arrays ──
      const addUrl = (fileObj) => {
        if (!fileObj) return;
        if (typeof fileObj === "string" && fileObj.startsWith("http")) {
          urls.push(fileObj);
        } else if (fileObj.url && typeof fileObj.url === "string" && fileObj.url.startsWith("http")) {
          urls.push(fileObj.url);
        } else if (Array.isArray(fileObj)) {
          fileObj.forEach(addUrl);
        }
      };

      // ── Collect from every possible file field ──
      [
        dataSource.atsDocuments,
        dataSource.AttachDocuments,
        dataSource.imageUrls,
        dataSource.siteVisitVideo,
        dataSource.gpsFiles,
        dataSource.emailFiles,
        dataSource.fieldFormFiles,
        dataSource.additionalFiles,
      ]
        .filter(Array.isArray)
        .forEach(arr => arr.forEach(addUrl));

      if (urls.length === 0 && (!dataSource || Object.keys(dataSource).length === 0)) {
        toast.error("No files or data found to download.", { id: toastId });
        return;
      }

      if (urls.length === 0) {
        // No files but we have form data — download JSON only
        toast.loading("No files found — downloading form data as JSON…", { id: toastId });
      }

      // ── Call proxy to bundle everything into a ZIP ──
      const res = await axiosInstance.post("/proxy", {
        urls,
        jsonData: dataSource,
        jsonFilename: "complete_application_data.json",
      }, { responseType: "blob" });

      const applicantName = (dataSource.customerName || "Applicant").trim().replace(/[^a-zA-Z0-9]/g, "_");
      const propertyCode = (dataSource.refNo || dataSource.clContractNo || id || "Case").trim().replace(/[^a-zA-Z0-9]/g, "_");
      const zipFilename = `${applicantName}_${propertyCode}.zip`;

      saveAs(res.data, zipFilename);
      toast.success(
        urls.length > 0
          ? `Downloaded ${urls.length} file(s) + form data ✓`
          : "Form data downloaded as JSON ✓",
        { id: toastId }
      );
    } catch (error) {
      console.error("Failed to download ZIP:", error);
      toast.error("Download failed: " + (error?.response?.data?.error || error.message || error), { id: toastId });
    }
  };

  const [showFullBankForm, setShowFullBankForm] = useState(false);
  const activeSectionLabel = activeContent?.label || "";

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "sans-serif" }}>

      {/* ── Top Header ── */}
      <header className="form-sub-header">
        <div className="form-sub-header-title-container">
          <img
            src="/assets/images/banks-img/homefrist.webp"
            alt="Home First Bank"
            loading="lazy"
            style={{ height: 72, maxWidth: 200, objectFit: "contain", display: "block" }}
          />
        </div>

        {/* Date picker */}
        {!isFieldOfficer && (
          <div className="form-sub-header-date-container">
            <input
              type="datetime-local"
              onChange={(e) => setCreatedDate(e.target.value)}
              style={{
                outline: "none",
                background: "transparent",
                fontSize: 11,
                color: "#B5121B",
                fontWeight: 600,
                border: "none",
                width: "100%",
              }}
            />
          </div>
        )}
      </header>

      {/* ── AI Advanced Auto Fill (Admin/SuperAdmin only) ── */}
      <div style={{ maxWidth: 1280, margin: "20px auto 0", padding: "0 16px" }}>
          <div style={{
            background: "#ffffff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}>
            {/* Collapsible Header */}
            <div
              onClick={() => setIsAutofillOpen(!isAutofillOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                background: "linear-gradient(135deg, #f0f7ff, #e8f0fe)",
                borderBottom: isAutofillOpen ? "1px solid #e5e7eb" : "none",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1e40af" }}>AI Advanced Auto Fill</span>
                <span style={{
                  fontSize: 11, fontWeight: 500, color: "#6366f1",
                  background: "#ede9fe", borderRadius: 6, padding: "2px 8px"
                }}>AI Powered</span>

                {/* Download All ZIP Button next to the title */}
                {!isFieldOfficer && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadAll();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginLeft: 12,
                      padding: "6px 12px",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(16, 185, 129, 0.25)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 4px 10px rgba(16, 185, 129, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 6px rgba(16, 185, 129, 0.25)";
                    }}
                  >
                    <Download size={12} /> Download All (ZIP)
                  </button>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: isAutofillOpen ? "#dc2626" : "#16a34a",
                  background: isAutofillOpen ? "#fef2f2" : "#f0fdf4",
                  border: `1px solid ${isAutofillOpen ? "#fecaca" : "#bbf7d0"}`,
                  borderRadius: 6, padding: "3px 10px",
                }}>
                  {isAutofillOpen ? "Hide" : "Show"}
                </span>
                <svg
                  width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2.5" viewBox="0 0 24 24"
                  style={{ transform: isAutofillOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Collapsible Content */}
            {isAutofillOpen && (
              <div style={{ padding: "16px" }}>
                <AdvancedAutoFillForm
                  caseId={id}
                  bankName="HomeFirst Bank"
                  setFormData={setExtractedData}
                  setFormDataDirect={setIsEdit}
                  atsDocuments={
                    isEdit?.atsDocuments && isEdit.atsDocuments.length > 0
                      ? isEdit.atsDocuments
                      : (isEdit?.AttachDocuments || [])
                  }
                  imageUrls={isEdit?.imageUrls || []}
                  siteVisitVideo={isEdit?.siteVisitVideo || []}
                  gpsFiles={isEdit?.gpsFiles || []}
                  emailFiles={isEdit?.emailFiles || []}
                  fieldFormFiles={isEdit?.fieldFormFiles || []}
                  additionalFiles={isEdit?.additionalFiles || []}
                  fetchData={() => id && fetchEditData(id)}
                  onUploadingChange={setIsUploadingFiles}
                  isSubmitted={isEdit?.isReportSubmitted}
                />

                {isFieldOfficer && (
                  <div style={{ marginTop: 24 }}>
                    <CaseWorkflowActions
                      caseId={id}
                      bankName="Home First"
                      onSave={handleFOSave}
                      onSubmit={(status) => {
                        if (status === "Generated") {
                          return handleAdminGenerate();
                        } else {
                          return handleFOSubmit();
                        }
                      }}
                      loading={loading || apiLoading}
                      isReportSubmitted={isEdit?.isReportSubmitted}
                      status={isEdit?.status}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 
        {isFieldOfficer && (
          <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
            <button
              type="button"
              onClick={() => setShowFullBankForm(!showFullBankForm)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                background: showFullBankForm ? "#f8fafc" : "#eff6ff",
                border: "1.5px solid #3b82f6",
                borderRadius: "10px",
                color: "#1d4ed8",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(59,130,246,0.15)",
                transition: "all 0.2s ease",
              }}
            >
              <span>{showFullBankForm ? "🙈 Hide Bank Valuation Form" : "📋 View / Edit Detailed Bank Valuation Form"}</span>
            </button>
          </div>
        )}
        */}

        {!isFieldOfficer && (
          <>
            {/* Collapsible Property Details Panel */}
            <div style={{ maxWidth: 1280, margin: "20px auto 0", padding: "0 16px" }}>
              <div style={{
                background: "#ffffff",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                overflow: "hidden"
              }}>
            {/* Accordion Header Row */}
            <div 
              onClick={() => setIsPropertyDetailsOpen(!isPropertyDetailsOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                background: "#ffffff",
                borderBottom: isPropertyDetailsOpen ? "1px solid #e5e7eb" : "none",
                cursor: "pointer",
                userSelect: "none"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>Property Details</span>
                {(isEdit?.customerName || isEdit?.clContractNo || isEdit?.refNo) && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                    {isEdit?.customerName && (
                      <>
                        <span style={{ color: "#cbd5e1" }}>|</span>
                        <span>Applicant <strong style={{ color: "#0f172a", fontWeight: 600 }}>{isEdit.customerName}</strong></span>
                      </>
                    )}
                    {isEdit?.clContractNo && (
                      <>
                        <span style={{ color: "#cbd5e1" }}>|</span>
                        <span>Loan Code <strong style={{ color: "#0f172a", fontWeight: 600 }}>{isEdit.clContractNo}</strong></span>
                      </>
                    )}
                    {isEdit?.refNo && (
                      <>
                        <span style={{ color: "#cbd5e1" }}>|</span>
                        <span>Property <strong style={{ color: "#0f172a", fontWeight: 600 }}>{isEdit.refNo}</strong></span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transform: isPropertyDetailsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease"
                }}
              >
                <svg width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2.5" viewBox="0 0 24 24" style={{ transform: isPropertyDetailsOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            {/* Accordion Content Panel */}
            {isPropertyDetailsOpen && (
              <div style={{ padding: "20px 24px" }}>
                {/* Row 1 */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Applicant Name</div>
                    <input
                      value={isEdit?.customerName || ""}
                      onChange={(e) => handleTopInputChange("customerName", e.target.value)}
                      disabled={isFieldOfficer && isEdit?.isReportSubmitted}
                      style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Loan Code</div>
                    <input
                      value={isEdit?.clContractNo || ""}
                      onChange={(e) => handleTopInputChange("clContractNo", e.target.value)}
                      disabled={isFieldOfficer && isEdit?.isReportSubmitted}
                      style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Property Code</div>
                    <input
                      value={isEdit?.refNo || ""}
                      onChange={(e) => handleTopInputChange("refNo", e.target.value)}
                      disabled={isFieldOfficer && isEdit?.isReportSubmitted}
                      style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Contact No.</div>
                    <input
                      value={isEdit?.customerNo || ""}
                      onChange={(e) => handleTopInputChange("customerNo", e.target.value)}
                      disabled={isFieldOfficer && isEdit?.isReportSubmitted}
                      style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Property Name</div>
                    <input
                      value={isEdit?.propertyName || ""}
                      onChange={(e) => handleTopInputChange("propertyName", e.target.value)}
                      disabled={isFieldOfficer && isEdit?.isReportSubmitted}
                      style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Builder Name</div>
                    <input
                      value={isEdit?.projectName || ""}
                      onChange={(e) => handleTopInputChange("projectName", e.target.value)}
                      disabled={isFieldOfficer && isEdit?.isReportSubmitted}
                      style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Plot ID</div>
                    <input
                      value={isEdit?.plotNo || ""}
                      onChange={(e) => handleTopInputChange("plotNo", e.target.value)}
                      disabled={isFieldOfficer && isEdit?.isReportSubmitted}
                      style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ visibility: "hidden" }}></div>
                </div>

                {/* Row 3: Address */}
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Address</div>
                  <input
                    value={isEdit?.addressSite || isEdit?.addressLegal || ""}
                    onChange={(e) => handleTopInputChange("addressSite", e.target.value)}
                    disabled={isFieldOfficer && isEdit?.isReportSubmitted}
                    style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

      {/* ── Body: Sidebar + Content ── */}

        <div
          className="form-container-flex"
          style={{
            display: "flex",
            maxWidth: 1140,
            margin: "24px auto",
            gap: 0,
            padding: "0 16px",
            alignItems: "flex-start",
          }}
        >
        {/* ── Left Sidebar ── */}
          <aside
            className="form-sidebar-aside"
            style={{
              width: 248,
              flexShrink: 0,
              background: "#fff",
              borderRadius: "12px 0 0 12px",
              border: "1px solid #e5e7eb",
              borderRight: "none",
              overflow: "hidden",
              position: "sticky",
              top: 80,
              alignSelf: "flex-start",
            }}
          >
            {/* Sidebar header */}
            <div
              className="form-sidebar-header"
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid #e5e7eb",
                background: "#f9fafb",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Form Sections
              </div>
            </div>

            {/* Nav items */}
            <nav className="form-sidebar-nav" style={{ padding: "8px 0" }}>
              {sections.map((section, idx) => (
                <SidebarItem
                  key={section.id}
                  id={idx + 1}
                  label={section.label}
                  isActive={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                />
              ))}
            </nav>
          </aside>

        {/* ── Right Content Panel ── */}
        <main
          className={`form-content-main ${isFieldOfficer ? "is-field-officer" : ""}`}
          style={{
            flex: 1,
            minWidth: 0,
            background: "#fff",
            borderRadius: isFieldOfficer ? "12px" : "0 12px 12px 0",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          {/* Content header */}
          <div className="form-content-header">
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>
              {activeSectionLabel}
            </h2>
          </div>

          {/* Form content */}
          <div className="form-content-body">
              {activeContent?.component}
          </div>

          {/* Save & Proceed footer */}
          <div className="form-footer">
            {/* Save & Proceed Navigation (Back + Proceed) */}
            <div className="form-footer-nav-buttons" style={{ display: "flex", gap: 10, width: "100%", justifyContent: "flex-start" }}>
              {activeSection > 1 && (
                <button
                  type="button"
                  className="form-footer-back-btn"
                  onClick={handleBack}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 20px",
                    background: "#fff",
                    border: "2px solid #6b7280",
                    borderRadius: 20,
                    color: "#374151",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back
                </button>
              )}
            </div>

            {/* Submit / Save / Final Submit buttons */}
            {activeSection === sections[sections.length - 1]?.id && (
              <CaseWorkflowActions
                caseId={id}
                bankName="Home First"
                onSave={handleFOSave}
                onSubmit={(status) => {
                  if (status === "Generated") {
                    return handleAdminGenerate();
                  } else {
                    return handleFOSubmit();
                  }
                }}
                loading={loading || apiLoading}
                isReportSubmitted={isEdit?.isReportSubmitted}
                status={isEdit?.status}
              />
            )}
          </div>

          {/* Status messages */}
          {(loading || apiLoading) && (
            <div
              style={{
                margin: "0 28px 16px",
                padding: "10px 14px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: 8,
                color: "#1d4ed8",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg
                style={{ animation: "spin 1s linear infinite", width: 16, height: 16 }}
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </div>
          )}

          {error && (
            <div
              style={{
                margin: "0 28px 16px",
                padding: "10px 14px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                color: "#dc2626",
                fontSize: 13,
              }}
            >
              Error: {typeof error === "object" ? (error.message || error.error || JSON.stringify(error)) : error}
            </div>
          )}
        </main>
      </div>
    </>
  )}

      {/* ── JSON Modal Output ── */}
      {showJsonModal && (
        <div className="json-modal-overlay">
          <div className="json-modal-container">
            <div className="json-modal-header">
              <div className="json-modal-title">
                <span style={{ fontSize: "20px" }}>📋</span> Final JSON Output Generated
              </div>
              <button className="json-modal-close-btn" onClick={handleJustCloseModal}>
                <X size={20} />
              </button>
            </div>

            {/* Success Summary Banner */}
            <div style={{
              background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
              border: "1px solid #6ee7b7",
              borderRadius: 10,
              margin: "16px 20px 0",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#10b981",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#065f46" }}>Form Submitted Successfully!</div>
                <div style={{ fontSize: 12, color: "#047857", marginTop: 2 }}>
                  Case ID: <strong>{jsonOutputData?._id || id || "—"}</strong>
                  &nbsp;·&nbsp;
                  Status: <strong>{jsonOutputData?.status || "Submitted"}</strong>
                  &nbsp;·&nbsp;
                  Images: <strong>{(jsonOutputData?.imageUrls?.length || jsonOutputData?.gpsFiles?.length || 0)}</strong>
                </div>
              </div>
            </div>

            <div className="json-modal-body">
              <pre className="json-code-block">
                {JSON.stringify(jsonOutputData, null, 2)}
              </pre>
            </div>
            <div className="json-modal-footer">
              <button className="json-btn json-btn-copy" onClick={handleCopyJson}>
                <Copy size={16} /> Copy JSON
              </button>
              <button className="json-btn json-btn-download" onClick={handleDownloadJson}>
                <Download size={16} /> Download JSON
              </button>
              <button className="json-btn json-btn-close" onClick={handleCloseJsonModal}>
                Close &amp; Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}


      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* JSON Modal Styles */
        .json-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 20px;
          animation: fadeIn 0.25s ease-out;
        }

        .json-modal-container {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 800px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .json-modal-header {
          padding: 18px 24px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
        }

        .json-modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .json-modal-close-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .json-modal-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .json-modal-body {
          padding: 24px;
          overflow-y: auto;
          background: #0f172a;
          flex: 1;
        }

        .json-code-block {
          margin: 0;
          font-family: 'Courier New', Courier, monospace;
          font-size: 13px;
          color: #38bdf8;
          white-space: pre-wrap;
          word-break: break-all;
          line-height: 1.5;
        }

        .json-modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: #f8fafc;
        }

        .json-btn {
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .json-btn-copy {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
        }

        .json-btn-copy:hover {
          background: #e2e8f0;
        }

        .json-btn-download {
          background: #3b82f6;
          color: #ffffff;
        }

        .json-btn-download:hover {
          background: #2563eb;
        }

        .json-btn-close {
          background: #10b981;
          color: #ffffff;
        }

        .json-btn-close:hover {
          background: #059669;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        /* Responsive Header & Content classes */

        .form-sub-header {
          background: #ffffff;
          border-bottom: 3px solid #00a3ad;
          position: sticky;
          top: 0;
          z-index: 30;
          padding: 12px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 12px rgba(0, 163, 173, 0.10), 0 1px 4px rgba(0,0,0,0.07);
          min-height: 80px;
        }
        .form-sub-header-title-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .form-sub-header-date-container {
          background: #fff4f4;
          border: 1px solid #B5121B;
          border-radius: 8px;
          padding: 6px 12px;
        }
        .form-content-header {
          padding: 18px 28px;
          border-bottom: 1px solid #e5e7eb;
          background: #fff;
        }
        .form-content-body {
          padding: 24px 28px;
        }
        .form-footer {
          padding: 16px 28px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: #fafafa;
        }
        .form-footer-actions-group {
          display: flex;
          gap: 10px;
        }

        @media (max-width: 768px) {
          .json-modal-container {
            max-height: 90vh !important;
            max-width: 95vw !important;
          }
          .json-modal-footer {
            flex-direction: column !important;
            gap: 8px !important;
            padding: 12px 16px !important;
          }
          .json-btn {
            width: 100% !important;
            justify-content: center !important;
          }
          .desktop-only-text {
            display: none !important;
          }


          .form-sub-header {

            top: 0 !important; /* Stays below navbar on mobile too! */
            padding: 8px 12px !important;
            flex-direction: row !important; /* Keep inline side-by-side */
            justify-content: space-between !important;
            align-items: center !important;
            gap: 6px !important;
          }
          .form-sub-header-subtitle {
            display: none !important; /* Hide subtitle to fit title + date input */
          }
          .form-sub-header-title-container {
            gap: 8px !important;
          }
          .form-sub-header-title-container div:first-child {
            width: 24px !important;
            height: 24px !important;
          }
          .form-sub-header-title-container div:first-child svg {
            width: 14px !important;
            height: 14px !important;
          }
          .form-sub-header-title-container > div:last-child > div:first-child {
            font-size: 12px !important;
            white-space: nowrap !important;
          }
          .form-sub-header-date-container {
            width: auto !important;
            padding: 4px 8px !important; /* Compact date picker */
            max-width: 135px !important; /* Limit width to fit side-by-side */
            box-sizing: border-box !important;
          }
          .form-sub-header-date-container input {
            font-size: 9px !important;
          }
          .form-content-header {
            padding: 12px 16px !important;
          }
          .form-content-body {
            padding: 16px 12px !important;
          }
          .form-footer {
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 16px 12px !important;
            gap: 12px !important;
          }
          .form-footer-nav-buttons {
            width: 100% !important;
            display: flex !important;
            gap: 10px !important;
          }
          .form-footer-nav-buttons button {
            flex: 1 !important;
            width: auto !important;
            justify-content: center !important;
          }
          .form-footer-actions-group {
            flex-direction: column !important;
            gap: 8px !important;
            width: 100% !important;
          }
          .form-footer-actions-group button {
            width: 100% !important;
          }

           .form-container-flex {
            flex-direction: column !important;
            margin: 12px auto !important;
            padding: 0 8px !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          }
          .form-sidebar-aside {
            width: 100% !important;
            position: relative !important;
            top: 0 !important;
            border-right: 1px solid #e5e7eb !important;
            border-bottom: none !important;
            border-radius: 12px 12px 0 0 !important;
            margin-bottom: 0 !important;
            overflow: visible !important;
            height: auto !important;
            background: #fff !important;
            display: block !important;
          }
          .form-sidebar-header {
            display: none !important;
          }
          .form-sidebar-nav {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important; /* Prevent wrapping onto next line */
            overflow-x: auto !important;
            overflow-y: hidden !important;
            padding: 8px !important;
            gap: 8px !important;
            scrollbar-width: thin;
            height: auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .form-sidebar-item {
            min-width: 140px !important;
            width: auto !important;
            border-left: none !important;
            border-bottom: 3px solid transparent !important;
            flex-shrink: 0 !important;
            padding: 6px 10px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            height: 38px !important;
          }
          .form-sidebar-item.is-active {
            border-bottom: 3px solid #1d4ed8 !important;
            background: #eff6ff !important;
          }
          .form-content-main {
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 0 0 12px 12px !important;
            border-top: none !important;
            border-left: 1px solid #e5e7eb !important;
          }
          .form-content-main.is-field-officer {
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 12px !important;
            border-top: 1px solid #e5e7eb !important;
            border-left: 1px solid #e5e7eb !important;
          }
        }
      `}</style>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, background: "#fff", border: "1px solid #f87171", borderRadius: 8, margin: 16 }}>
          <h2 style={{ color: "#dc2626", fontSize: 18, fontWeight: 700 }}>Something went wrong.</h2>
          <pre style={{ background: "#fef2f2", padding: 12, borderRadius: 6, color: "#991b1b", marginTop: 12, overflowX: "auto" }}>
            {this.state.error?.stack || this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: 12, padding: "8px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const HomeFirstBankWithErrorBoundary = (props) => (
  <ErrorBoundary>
    <HomeFirstBank {...props} />
  </ErrorBoundary>
);

export default HomeFirstBankWithErrorBoundary;


