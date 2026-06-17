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

  useEffect(() => {
    if (id) fetchEditData(id);
  }, [id]);



  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      console.log("Auto data received:", extractedData);
      
      setIsEdit((prev) => {
        const updated = {
          ...prev,
          ...extractedData,
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
        await dispatch(createHFBanks(finalPayload)).unwrap();
        toast.success("Form submitted successfully");
        navigate("/");
        return;
      }

      await dispatch(updateDetails({ id, ...finalPayload })).unwrap();
      toast.success("Form updated successfully");
      navigate("/");
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

      await dispatch(updateDetails({ id, ...finalPayload })).unwrap();
      await dispatch(
        finalUpdate({ id, bankName: "HomeFirstBank", updateData: finalPayload })
      ).unwrap();

      toast.success("Case final submitted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Final submission failed:", err);
      toast.error(err?.message || "Final submission failed");
    } finally {
      setFinalSubmitting(false);
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
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
            border-radius: 0 0 12px 12px !important;
            border-top: none !important;
            border-left: 1px solid #e5e7eb !important;
          }
          .form-content-main.is-field-officer {
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
