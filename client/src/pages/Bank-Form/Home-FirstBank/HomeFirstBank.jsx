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

// ─── Sidebar Nav Item ────────────────────────────────────────────────────────
const SidebarItem = ({ id, label, isActive, onClick }) => (
  <button
    className={`form-sidebar-item ${isActive ? "is-active" : ""}`}
    onClick={() => onClick(id)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      padding: "10px 16px",
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: isActive ? "#1d4ed8" : "#6b7280",
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {id}
    </span>
    <span
      style={{
        fontSize: 13,
        fontWeight: isActive ? 700 : 500,
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
  const { loading, error } = useSelector((state) => state.hfBanks);
  const user = useSelector((state) => state.auth.user);
  const savedCity = useSelector((state) => state.assignedCases.savedCity);
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeSection, setActiveSection] = useState(1);
  const [collectedData, setCollectedData] = useState({});
  const [isEdit, setIsEdit] = useState({});
  const [extractedData, setExtractedData] = useState({});
  const sectionSubmittersRef = useRef({});
  const [createdDate, setCreatedDate] = useState(null);
  const [finalSubmitting, setFinalSubmitting] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonOutputData, setJsonOutputData] = useState(null);
  const [onModalCloseAction, setOnModalCloseAction] = useState(null);
  const [isAutofillOpen, setIsAutofillOpen] = useState(false);

  const isFieldOfficer = user?.role === "FieldOfficer";
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
      setIsEdit(response);
    } catch (fetchError) {
      console.error("Error fetching data:", fetchError);
    }
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

      // Property Overview (Section 2)
      unitType: extracted.unitType || p.property_type || accom.type_of_structure || prev.unitType || "OPEN PLOT",
      zone: extracted.zone || extracted.usageOfProperty || p.property_use || prev.zone || "Residential",
      usageOfProperty: extracted.usageOfProperty || extracted.actualUsage || p.property_use || prev.usageOfProperty || "Residential",

      // Locality (Section 4)
      nearestCityTown: extracted.nearestCityTown || extracted.city || loc.main_locality || loc.city || prev.nearestCityTown || "",
      locationCategory: extracted.locationCategory || extracted.propertyJurisdiction || loc.property_falling_within || prev.locationCategory || "MC",
      localityDevelopment: extracted.localityDevelopment || extracted.microLocation || loc.micro_location || prev.localityDevelopment || "Under Developed",
      approachRoadType: extracted.approachRoadType || extracted.physicalApproach || loc.physical_approach || prev.approachRoadType || "Mud Road",
      approachRoadWidth: extracted.approachRoadWidth || extracted.widthApproachRoad || loc.width_approach_road || prev.approachRoadWidth || "15ft",
      distanceFromCityCentre: extracted.distanceFromCityCentre || extracted.distanceCityCentre || loc.distance_city_centre || prev.distanceFromCityCentre || "",
      distanceFromRailwayStation: extracted.distanceFromRailwayStation || extracted.distanceRailwayStation || loc.distance_railway_station || prev.distanceFromRailwayStation || "",
      distanceFromBusStand: extracted.distanceFromBusStand || extracted.distanceBusStop || extracted.busStop || loc.distance_bus_stop || prev.distanceFromBusStand || "",
      distanceFromHospital: extracted.distanceFromHospital || extracted.distanceHospital || extracted.hospital || loc.distance_hospital || prev.distanceFromHospital || "",
      occupancyPercentage: extracted.occupancyPercentage || extracted.occupancyLevel || loc.occupancy_level || prev.occupancyPercentage || "",
      habitationPercentage: extracted.habitationPercentage || prev.habitationPercentage || "",
      nallahRiverHighTension: extracted.nallahRiverHighTension || extracted.adverseFactors || loc.adverse_factors || prev.nallahRiverHighTension || "NA",
      electricityAvailability: extracted.electricityAvailability || extracted.electricityAvailable || infra.electricity_available || prev.electricityAvailability || "YES",
      waterAvailability: extracted.waterAvailability || extracted.waterSupply || infra.water_supply || prev.waterAvailability || "YES",
      drainageAvailability: extracted.drainageAvailability || extracted.sewerLineConnected || infra.sewer_line_connected || prev.drainageAvailability || "YES",

      // NDMA Guidelines (Section 6)
      seismicZone: extracted.seismicZone || struct.seismic_zone || prev.seismicZone || "II",
      cycloneZone: extracted.cycloneZone || prev.cycloneZone || "NO",
      landslideProneZone: extracted.landslideProneZone || prev.landslideProneZone || "No",
      floodZone: extracted.floodZone || struct.flood_prone_area || prev.floodZone || "NO",
      crZone: extracted.crZone || prev.crZone || "NO",
      demolitionRisk: extracted.demolitionRisk || extracted.riskOfDemolition || legal.risk_of_demolition || prev.demolitionRisk || "LOW",
      demolitionRiskDetails: extracted.demolitionRiskDetails || prev.demolitionRiskDetails || "NA",
      followsNDMAGuidelines: extracted.followsNDMAGuidelines || prev.followsNDMAGuidelines || "YES",

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
      boundariesMatching: extracted.boundariesMatching || prev.boundariesMatching || "",
      propertyDemarcated: extracted.propertyDemarcated || propDet.property_demarcated || prev.propertyDemarcated || "",
      boundaryRemarks: extracted.boundaryRemarks || prev.boundaryRemarks || "",
      marketability: extracted.marketability || accom.marketability || prev.marketability || "",
      landArea: extracted.landArea || extracted.plotArea || prev.landArea || "",
      linearDimension: extracted.linearDimension || extracted.plotDimensions || prev.linearDimension || "",
      plotArea: Number(extracted.plotArea) || Number(extracted.landArea) || prev.plotArea || 0,

      // Structural Details (Section 8)
      typeOfStructure: extracted.typeOfStructure || p.property_sub_type || accom.type_of_structure || prev.typeOfStructure || "",
      typeOfRoof: extracted.typeOfRoof || struct.roof_type || prev.typeOfRoof || "",
      noOfFloorsPermissible: extracted.noOfFloorsPermissible || prev.noOfFloorsPermissible || "NA",
      noOfFloorsActual: Number(extracted.noOfFloorsActual) || Number(extracted.totalNoOfFloors) || prev.noOfFloorsActual || 0,
      noOfUnitFlatOnEachFloor: extracted.noOfUnitFlatOnEachFloor || prev.noOfUnitFlatOnEachFloor || "NA",
      qualityOfConstruction: extracted.qualityOfConstruction || extracted.constructionQuality || accom.quality_of_construction || prev.qualityOfConstruction || "",
      approxAgeOfProperty: Number(extracted.approxAgeOfProperty) || Number(extracted.ageOfProperty) || Number(extracted.propertyAge) || Number(accom.age_of_property) || prev.approxAgeOfProperty || 0,
      residualAge: Number(extracted.residualAge) || Number(accom.residual_age) || prev.residualAge || 0,
    };

    return mapped;
  };

  useEffect(() => {
    if (id) fetchEditData(id);
  }, [id]);



  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      console.log("Auto data received:", extractedData);
      
      setIsEdit((prev) => {
        const schemaMapped = mapExtractedDataToHFSchema(extractedData, prev);
        const updated = {
          ...prev,
          ...extractedData,
          ...schemaMapped,
          imageUrls: extractedData.imageUrls
            ? [...(prev?.imageUrls || []), ...extractedData.imageUrls]
            : prev?.imageUrls,
          siteVisitVideo: extractedData.siteVisitVideo
            ? [...(prev?.siteVisitVideo || []), ...extractedData.siteVisitVideo]
            : prev?.siteVisitVideo,
          atsDocuments: extractedData.atsDocuments
            ? [...(prev?.atsDocuments || []), ...extractedData.atsDocuments]
            : prev?.atsDocuments,
          AttachDocuments: extractedData.atsDocuments
            ? [...(prev?.AttachDocuments || []), ...extractedData.atsDocuments]
            : prev?.AttachDocuments,
        };

        if (id) {
          const finalPayload = { ...updated, city: savedCity };
          dispatch(updateDetails({ id, ...finalPayload }))
            .unwrap()
            .then((res) => {
              if (res) {
                setIsEdit(res);
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

  const allSections = [
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
          />
          <div className="mt-5 space-y-5">
            <div>
              <AutoFillForm setFormData={setExtractedData} />
            </div>
          </div>

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
        />
      ),
    },
    {
      id: 10,
      label: "Valuation Details",
      component: (
        <ValuationDetails
          isEdit={isEdit}
          sectionId={10}
          showActionButtons={false}
          registerSectionSubmitter={registerSectionSubmitter}
          extractedData={extractedData}
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
        />
      ),
    },
    {
      id: 15,
      label: "Documents",
      component: (
        <HomeFirstPortalSections
          mode="documents"
          isEdit={isEdit}
          sectionId={15}
          registerSectionSubmitter={registerSectionSubmitter}
          fetchData={() => fetchEditData(id)}
        />
      ),
    },
    {
      id: 16,
      label: "Site Video",
      component: (
        <HomeFirstPortalSections
          mode="videos"
          isEdit={isEdit}
          sectionId={16}
          registerSectionSubmitter={registerSectionSubmitter}
          fetchData={() => fetchEditData(id)}
        />
      ),
    },
    ...(id ? [{
      id: 17,
      label: "📋 Field Officer Uploads",
      component: (
        <HomeFirstPortalSections
          mode="fieldUploads"
          isEdit={isEdit}
          sectionId={17}
          registerSectionSubmitter={registerSectionSubmitter}
          fetchData={() => fetchEditData(id)}
        />
      ),
    }] : []),
  ];

  const sections = allSections;

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

  const handleSaveAndProceed = async () => {
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

      const nextId = activeSection + 1;
      const nextSection = sections.find((s) => s.id === nextId);
      if (nextSection) {
        setActiveSection(nextId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      toast.error("Please complete the required fields");
    }
  };

  const handleBack = () => {
    if (activeSection > 1) {
      setActiveSection(activeSection - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };



  const handlePrimaryAction = async (finalSubmit) => {
    try {
      const latestSections = await collectSectionData();
      const finalData = buildFinalData(latestSections);
      let finalPayload = { ...finalData, city: savedCity };

      if (createdDate) finalPayload = { ...finalData, createdAt: createdDate };
      if (!id) {
        finalPayload.status = "Pending";
      } else if (finalSubmit === "final") {
        finalPayload.status = "FinalSubmitted";
      } else {
        finalPayload.status = isEdit?.assignedTo ? "Work in Progress" : "Pending";
      }

      console.log("FINAL PAYLOAD BEFORE UPDATE:", finalPayload);

      if (isFieldOfficer) {
        const payload = { ...finalPayload, isReportSubmitted: true };
        let res;
        if (id) {
          res = await dispatch(updateDetails({ id, ...payload })).unwrap();
        } else {
          res = await dispatch(createHFBanks(payload)).unwrap();
        }
        toast.success("Form submitted successfully");
        setJsonOutputData(res?.updatedJob || res?.data || res || payload);
        setOnModalCloseAction(() => () => navigate("/"));
        setShowJsonModal(true);
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
      let finalPayload = { ...finalData, city: savedCity };
      if (createdDate) finalPayload = { ...finalData, createdAt: createdDate };

      const res = await dispatch(updateDetails({ id, ...finalPayload })).unwrap();
      await dispatch(
        finalUpdate({ id, bankName: "HomeFirstBank", updateData: finalPayload })
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

      saveAs(res.data, `HFB_all_files_${id || "new"}.zip`);
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

  // ─── Active section title ────────────────────────────────────────────────


  const activeSectionLabel = isFieldOfficer
    ? ""
    : activeContent?.label || "";

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "sans-serif" }}>

      {/* ── Top Header ── */}
      <header className="form-sub-header">
        <div className="form-sub-header-title-container">
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Home First Bank</div>
            <div style={{ fontSize: 11, color: "#6b7280" }} className="form-sub-header-subtitle">Property Valuation Report</div>
          </div>
        </div>

        {/* Date picker */}
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
      </header>

      {/* ── Advanced Autofill Section (Collapsible Accordion) ── */}
      <div className="top-advanced-autofill-section" style={{ maxWidth: 1280, margin: "16px auto 0", padding: "0 16px" }}>
        <div style={{
          background: "#ffffff",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
          transition: "all 0.3s ease"
        }}>
          {/* Accordion Trigger Bar */}
          {/* Accordion Header Row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            background: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
            borderBottom: isAutofillOpen ? "1px solid #e2e8f0" : "none",
            gap: 8,
            flexWrap: "wrap"
          }}>
            {/* Left: Toggle trigger */}
            <button
              onClick={() => setIsAutofillOpen(!isAutofillOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flex: 1,
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: "16px", flexShrink: 0 }}>✨</span>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, minWidth: 0 }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#5b21b6", whiteSpace: "nowrap" }}>
                  AI Advanced Auto Fill
                </span>
                <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 500 }} className="desktop-only-text">
                  — Upload site photos &amp; docs to auto-populate form fields
                </span>
              </div>
            </button>

            {/* Right: Download All + Show/Hide Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

              {/* ── Download All Button ── */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownloadAll(); }}
                  title="Download all uploaded images, PDFs and application data as ZIP"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 14px",
                    background: "linear-gradient(135deg, #0f172a, #1e40af)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 20,
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(30,64,175,0.35)",
                    letterSpacing: "0.02em",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, #1e3a8a, #2563eb)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, #0f172a, #1e40af)"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(30,64,175,0.35)"; }}
                >
                  <Download size={13} />
                  Download All
                </button>

              {/* ── Show / Hide Toggle ── */}
              <button
                onClick={() => setIsAutofillOpen(!isAutofillOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  background: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s ease",
                }}
              >
                {isAutofillOpen ? "Hide" : "Show"}
                <svg
                  width="13" height="13"
                  fill="none" stroke="#fff" strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  style={{
                    transform: isAutofillOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease"
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>

          {/* Accordion Content Panel */}
          <div style={{
            maxHeight: isAutofillOpen ? "2000px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}>
            <div style={{ padding: "16px" }}>
              <AdvancedAutoFillForm
                bankName="HomeFirst Bank"
                setFormData={setExtractedData}
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
                fetchData={() => fetchEditData(id)}
              />
            </div>
          </div>
        </div>
      </div>


      {/* ── Body: Sidebar + Content ── */}

      <div
        className="form-container-flex"
        style={{
          display: "flex",
          maxWidth: 1280,
          margin: "24px auto",
          gap: 0,
          padding: "0 16px",
          alignItems: "flex-start",
        }}
      >
        {/* ── Left Sidebar ── */}
        {!isFieldOfficer && (
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
              {sections.map((section) => (
                <SidebarItem
                  key={section.id}
                  id={section.id}
                  label={section.label}
                  isActive={activeSection === section.id}
                  onClick={setActiveSection}
                />
              ))}
            </nav>
          </aside>
        )}

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
            {isFieldOfficer ? (
              <div className="mt-4">
                <AdvancedAutoFillForm
                  bankName="HomeFirst Bank"
                  setFormData={setExtractedData}
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
                  fetchData={() => fetchEditData(id)}
                />
              </div>
            ) : (
              activeContent?.component
            )}
          </div>

          {/* Save & Proceed footer */}
          <div className="form-footer" style={isFieldOfficer ? { justifyContent: "center", padding: "16px 20px" } : {}}>
            {isFieldOfficer ? (
              <button
                type="button"
                onClick={handlePrimaryAction}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  borderRadius: 20,
                  background: loading ? "#9ca3af" : "#2563eb",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(37, 99, 235, 0.15)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "#1d4ed8";
                    e.currentTarget.style.boxShadow = "0 6px 15px rgba(37, 99, 235, 0.25)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "#2563eb";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(37, 99, 235, 0.15)";
                  }
                }}
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            ) : (
              <>
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

                  <button
                    type="button"
                    className="form-footer-save-btn"
                    onClick={handleSaveAndProceed}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "9px 20px",
                      background: "#fff",
                      border: "2px solid #2563eb",
                      borderRadius: 20,
                      color: "#2563eb",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#eff6ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                    }}
                  >
                    <svg width="16" height="16" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save &amp; Proceed
                  </button>
                </div>

                {/* Submit / Update / Final Submit buttons */}
                <div className="form-footer-actions-group">
                  <button
                    type="button"
                    onClick={handlePrimaryAction}
                    disabled={loading}
                    style={{
                      padding: "9px 20px",
                      borderRadius: 8,
                      background: loading ? "#9ca3af" : "#2563eb",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 13,
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    {loading ? "Processing..." : primaryActionLabel}
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePrimaryAction("final")}
                    disabled={loading}
                    style={{
                      padding: "9px 20px",
                      borderRadius: 8,
                      background: loading ? "#9ca3af" : "#2563eb",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 13,
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    {loading ? "Processing..." : "Final Submit"}
                  </button>

                  {canFinalSubmit && (
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={finalSubmitting || loading}
                      style={{
                        padding: "9px 20px",
                        borderRadius: 8,
                        background: finalSubmitting || loading ? "#9ca3af" : "#dc2626",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 13,
                        border: "none",
                        cursor: finalSubmitting || loading ? "not-allowed" : "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      {finalSubmitting ? "Finalizing..." : "Final Submit"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Status messages */}
          {loading && (
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
              Error: {error}
            </div>
          )}
        </main>

        {/* ── JSON Modal Output ── */}
        {showJsonModal && (
          <div className="json-modal-overlay">
            <div className="json-modal-container">
              <div className="json-modal-header">
                <div className="json-modal-title">
                  <span style={{ fontSize: "20px" }}>📋</span> Final JSON Output Generated
                </div>
                <button className="json-modal-close-btn" onClick={handleCloseJsonModal}>
                  <X size={20} />
                </button>
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
                  Close & Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


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
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0; /* Align right at top of scroll container (0px) */
          z-index: 30;
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
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

export default HomeFirstBank;
