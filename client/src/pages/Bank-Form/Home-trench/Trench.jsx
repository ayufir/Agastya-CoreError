import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
} from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { Download } from "lucide-react";
import {
  createHomeTrenchReport,
  getHomeTrenchReportById,
  updateHomeTrenchReport,
} from "../../../redux/features/Banks/homeTrench/homeTrenchReportThunks";
import { ShowLoading, HideLoading } from "../../../redux/features/alerts/alertSlice";
import { finalUpdate } from "../../../redux/features/case/caseThunks";
import { createAutoFillAdapter } from "../../../utils/Autofilladapter";
import { TRENCH_MAPPING } from "../../../config/Bankfieldmappings";
import AutoFillForm from "../../AutoFillForm";
import AdvancedAutoFillForm from "../../../components/AdvancedAutoFillForm";
import ConfirmModal from "../../../components/ConfirmModal";
import DocumentUploader from "../../../components/DocumentUploader";
import ImageUploader from "../../../components/ImageUploader";
import LocationPicker from "../../../components/GeoLocationInput";

const { TextArea } = Input;

const TODAY = () => dayjs().startOf("day");

const TrenchNavItem = ({ id, label, active, complete, onClick }) => (
  <button
    type="button"
    className={`trench-nav-item ${active ? "is-active" : ""}`}
    onClick={() => onClick(id)}
  >
    <span className="trench-nav-status">{complete ? "✓" : id}</span>
    <span>{label}</span>
  </button>
);

const Trench = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const savedCity = useSelector((state) => state.assignedCases.savedCity);
  const geoRef = useRef();

  const [activeTab, setActiveTab] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState([]);
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [docUrls, setDocUrls] = useState([]);
  const [atsDocuments, setAtsDocuments] = useState([]);
  const watchedLatitude = Form.useWatch("latitude", form);
  const watchedLongitude = Form.useWatch("longitude", form);

  const [showAutoFill, setShowAutoFill] = useState(false);
  const [isPropertyDetailsOpen, setIsPropertyDetailsOpen] = useState(false);
  const isFieldOfficer = user?.role?.toLowerCase() === "fieldofficer";

  const watchedVisitedPersonName = Form.useWatch("visitedPersonName", form);
  const watchedContactNumber = Form.useWatch("contactNumber", form);
  const watchedPropertyAddress = Form.useWatch("propertyAddress", form);
  const watchedLaiNo = Form.useWatch("laiNo", form);
  const watchedPropertyCode = Form.useWatch("propertyCode", form);

  const handleDownloadAll = async () => {
    const toastId = toast.loading("Fetching latest files and generating ZIP…");
    try {
      const { saveAs } = await import("file-saver");
      let freshData = reportData;
      if (id) {
        try {
          const response = await dispatch(getHomeTrenchReportById(id)).unwrap();
          freshData = response;
          setReportData(response);
        } catch (fetchErr) {
          console.warn("Could not refresh from server, using cached form:", fetchErr);
        }
      }

      const dataSource = freshData || reportData || {};
      const urls = [];

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

      [
        dataSource.atsDocuments,
        dataSource.AttachDocuments,
        dataSource.imageUrls,
      ]
        .filter(Array.isArray)
        .forEach(arr => arr.forEach(addUrl));

      if (urls.length === 0 && (!dataSource || Object.keys(dataSource).length === 0)) {
        toast.error("No files or data found to download.", { id: toastId });
        return;
      }

      const axiosInstance = (await import("../../../config/axios")).default;
      const res = await axiosInstance.post("/proxy", {
        urls,
        jsonData: dataSource,
        jsonFilename: "complete_application_data.json",
      }, { responseType: "blob" });

      const clientName = (dataSource.visitedPersonName || "Applicant").trim().replace(/[^a-zA-Z0-9]/g, "_");
      const refNo = (dataSource.laiNo || id || "Case").trim().replace(/[^a-zA-Z0-9]/g, "_");
      const zipFilename = `${clientName}_${refNo}.zip`;

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

  const initialValues = useMemo(() => ({
    dateOfVisit: TODAY(),
    dateOfReport: TODAY(),
    propertyAddress: "",
    visitedPersonName: "",
    contactNumber: "",
    laiNo: "",
    propertyCode: "",
    constructionStage: "",
    constructionPercentage: null,
    constructionRemarks: "",
    constructionAsPer: "",
    totalBua: null,
    areaRemarks: "",
    latitude: "",
    longitude: "",
    overallStatus: "",
    negativeReason: "",
    charges: 1000,
    baseRate: null,
    totalAmount: null,
  }), []);

  const handleAutoFill = createAutoFillAdapter(TRENCH_MAPPING, (mappedData) => {
    const excludeKeys = ["totalBua", "latitude", "longitude", "areaRemarks", "overallStatus", "negativeReason"];
    const allowedData = Object.fromEntries(
      Object.entries(mappedData).filter(([key, value]) => (
        value !== null && value !== undefined && value !== "" && !excludeKeys.includes(key)
      ))
    );

    setAutoFilledFields(Object.keys(allowedData));
    form.setFieldsValue(allowedData);
    if (mappedData.imageUrls && Array.isArray(mappedData.imageUrls)) {
      setUploadedUrls(mappedData.imageUrls);
      setUploadedImages(mappedData.imageUrls);
    }
    if (mappedData.atsDocuments && Array.isArray(mappedData.atsDocuments)) {
      setAtsDocuments(mappedData.atsDocuments);
    }
    toast.success(`${Object.keys(allowedData).length} requested field(s) filled`);
  });

  const fetchReport = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await dispatch(getHomeTrenchReportById(id)).unwrap();
      const hydrated = {
        ...response,
        laiNo: response.laiNo || "",
        propertyCode: response.propertyCode || "",
        dateOfVisit: response.dateOfVisit ? dayjs(response.dateOfVisit) : TODAY(),
        dateOfReport: response.dateOfReport ? dayjs(response.dateOfReport) : TODAY(),
        charges: response.charges === "" || response.charges == null
          ? 1000
          : Number(response.charges),
        baseRate: response.baseRate === "" || response.baseRate == null
          ? null
          : Number(response.baseRate),
        totalAmount: response.totalAmount === "" || response.totalAmount == null
          ? null
          : Number(response.totalAmount),
        totalBua: response.totalBua === "" || response.totalBua == null
          ? null
          : Number(response.totalBua),
      };

      setIsEdit(true);
      setReportData(response);
      form.setFieldsValue(hydrated);
      setUploadedImages(Array.isArray(response.imageUrls) ? response.imageUrls : []);
      setUploadedUrls(Array.isArray(response.imageUrls) ? response.imageUrls : []);
      setDocUrls(Array.isArray(response.AttachDocuments) ? response.AttachDocuments : []);
      setAtsDocuments(Array.isArray(response.atsDocuments) ? response.atsDocuments : []);
    } catch (error) {
      console.error("Home First Trench fetch failed:", error);
      toast.error("Failed to load Trench report");
    } finally {
      setLoading(false);
    }
  }, [dispatch, form, id]);

  useEffect(() => {
    if (isFieldOfficer && !id) {
      toast.error("You do not have permission to create cases");
      navigate("/field/dashboard");
      return;
    }

    if (id) {
      fetchReport();
      return;
    }

    form.setFieldsValue(initialValues);
  }, [fetchReport, form, id, initialValues, isFieldOfficer, navigate]);

  useEffect(() => {
    if (user?.role !== "FieldOfficer" || id) return;

    const timeout = setTimeout(() => geoRef.current?.getLocation(), 150);
    return () => clearTimeout(timeout);
  }, [id, user?.role]);

  const handleLocationChange = (latitude, longitude) => {
    form.setFieldsValue({ latitude, longitude });
  };

  const buildPayload = async () => {
    const values = await form.validateFields();
    return {
      ...values,
      laiNo: values.laiNo || "",
      propertyCode: values.propertyCode || "",
      dateOfVisit: values.dateOfVisit?.format("YYYY-MM-DD") || "",
      dateOfReport: values.dateOfReport?.format("YYYY-MM-DD") || "",
      imageUrls: uploadedUrls,
      AttachDocuments: docUrls,
      atsDocuments: atsDocuments,
      city: savedCity,
    };
  };

  const validateBeforeSubmit = async () => {
    try {
      await form.validateFields();
      if (user?.role === "FieldOfficer" && uploadedUrls.length === 0) {
        toast.error("Please upload at least one site photograph");
        setActiveTab(5);
        return false;
      }
      return true;
    } catch {
      toast.error("Please complete the required fields");
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!(await validateBeforeSubmit())) return;

    dispatch(ShowLoading());
    setLoading(true);
    try {
      const fullData = await buildPayload();
      if (isEdit) {
        await dispatch(updateHomeTrenchReport({ id, fullData })).unwrap();
        toast.success("Trench report updated successfully");
      } else {
        await dispatch(createHomeTrenchReport(fullData)).unwrap();
        toast.success("Trench report submitted successfully");
      }

      navigate(user?.role === "FieldOfficer" ? "/field/dashboard" : "/");
    } catch (error) {
      toast.error(error?.message || "Failed to save Trench report");
    } finally {
      setLoading(false);
      dispatch(HideLoading());
      setShowConfirm(false);
    }
  };

  const handleSubmitClick = async () => {
    if (!(await validateBeforeSubmit())) return;
    if (user?.role === "FieldOfficer") {
      setShowConfirm(true);
      return;
    }
    handleSubmit();
  };

  const handleFinalSubmit = async () => {
    if (!id) {
      toast.error("Save the report before final submission");
      return;
    }
    if (!(await validateBeforeSubmit())) return;

    setLoading(true);
    try {
      const finalData = await buildPayload();
      await dispatch(updateHomeTrenchReport({ id, fullData: finalData })).unwrap();
      await dispatch(
        finalUpdate({
          id,
          bankName: "HomeFirstTrench",
          updateData: finalData,
        })
      ).unwrap();
      toast.success("Case submitted finally");
      navigate(user?.role === "FieldOfficer" ? "/field/dashboard" : "/");
    } catch (error) {
      console.error("Home First Trench final submit failed:", error);
      toast.error("Final submission failed");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 1, label: "Vendor Visit Details" },
    { id: 2, label: "Construction" },
    { id: 3, label: "Area" },
    { id: 4, label: "Billing" },
    { id: 5, label: "Site Pics" },
  ];

  const nextTab = () => {
    if (activeTab < 6) {
      setActiveTab((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

      {/* ── Technical Individual Assignment Header & Panels ── */}
      <div style={{ maxWidth: 1140, margin: "20px auto 0", padding: "0 16px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
          Technical Individual Assignment
        </h1>

        {/* AI Advanced Auto Fill Accordion */}
        <div style={{
          background: "#ffffff",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
          marginBottom: "16px"
        }}>
          <div 
            onClick={() => setShowAutoFill(!showAutoFill)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 24px",
              background: "#ffffff",
              borderBottom: showAutoFill ? "1px solid #e5e7eb" : "none",
              cursor: "pointer",
              userSelect: "none"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>🤖 AI Advanced Auto Fill</span>
              {autoFilledFields.length > 0 && (
                <span style={{ fontSize: "11px", background: "#f0fdf4", color: "#166534", padding: "2px 8px", borderRadius: "9999px", fontWeight: 500 }}>
                  {autoFilledFields.length} fields filled
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleDownloadAll}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#475569",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <Download size={14} /> Download All (ZIP)
              </button>
              <button
                onClick={() => setShowAutoFill(!showAutoFill)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transform: showAutoFill ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease"
                }}
              >
                <svg width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>

          {showAutoFill && (
            <div style={{ padding: "20px 24px" }}>
              <AdvancedAutoFillForm
                bankName="Home First Tranche"
                setFormData={handleAutoFill}
                atsDocuments={atsDocuments && atsDocuments.length > 0 ? atsDocuments : (docUrls || [])}
                imageUrls={uploadedUrls || []}
                siteVisitVideo={reportData?.siteVisitVideo || []}
                gpsFiles={reportData?.gpsFiles || []}
                emailFiles={reportData?.emailFiles || []}
                fieldFormFiles={reportData?.fieldFormFiles || []}
                additionalFiles={reportData?.additionalFiles || []}
                fetchData={fetchReport}
              />
            </div>
          )}
        </div>

        {/* Collapsible Property Details Panel */}
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
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>🏠 Property Details</span>
              {(watchedVisitedPersonName || watchedLaiNo || watchedPropertyCode) && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                  {watchedVisitedPersonName && (
                    <>
                      <span style={{ color: "#cbd5e1" }}>|</span>
                      <span>Applicant <strong style={{ color: "#0f172a", fontWeight: 600 }}>{watchedVisitedPersonName}</strong></span>
                    </>
                  )}
                  {watchedLaiNo && (
                    <>
                      <span style={{ color: "#cbd5e1" }}>|</span>
                      <span>Loan Code <strong style={{ color: "#0f172a", fontWeight: 600 }}>{watchedLaiNo}</strong></span>
                    </>
                  )}
                  {watchedPropertyCode && (
                    <>
                      <span style={{ color: "#cbd5e1" }}>|</span>
                      <span>Property <strong style={{ color: "#0f172a", fontWeight: 600 }}>{watchedPropertyCode}</strong></span>
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
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Visited Person Name</div>
                  <input
                    value={watchedVisitedPersonName || ""}
                    onChange={(e) => form.setFieldsValue({ visitedPersonName: e.target.value })}
                    disabled={isFieldOfficer && reportData?.isReportSubmitted}
                    style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Loan Code</div>
                  <input
                    value={watchedLaiNo || ""}
                    onChange={(e) => form.setFieldsValue({ laiNo: e.target.value })}
                    disabled={isFieldOfficer && reportData?.isReportSubmitted}
                    style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Property Code</div>
                  <input
                    value={watchedPropertyCode || ""}
                    onChange={(e) => form.setFieldsValue({ propertyCode: e.target.value })}
                    disabled={isFieldOfficer && reportData?.isReportSubmitted}
                    style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Contact No.</div>
                  <input
                    value={watchedContactNumber || ""}
                    onChange={(e) => form.setFieldsValue({ contactNumber: e.target.value })}
                    disabled={isFieldOfficer && reportData?.isReportSubmitted}
                    style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Property Address</div>
                  <textarea
                    value={watchedPropertyAddress || ""}
                    onChange={(e) => form.setFieldsValue({ propertyAddress: e.target.value })}
                    disabled={isFieldOfficer && reportData?.isReportSubmitted}
                    style={{ width: "100%", minHeight: "64px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "8px 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box", resize: "vertical" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="trench-heading">
        <h1>Revisit One Off</h1>
        <div className="trench-summary">
          <strong>Property Details</strong>
          <span>Applicant</span>
          <b>{reportData?.visitedPersonName || "Not available"}</b>
          <i />
          <span>Loan Code</span>
          <b>{reportData?.laiNo || "Not available"}</b>
          <i />
          <span>Property</span>
          <b>{reportData?.propertyCode || "Not available"}</b>
        </div>
      </section>

      <main className="trench-shell">
        <aside className="trench-sidebar">
          <div className="trench-sidebar-title">Assignment Details</div>
          {tabs.map((tab) => (
            <TrenchNavItem
              key={tab.id}
              {...tab}
              active={activeTab === tab.id}
              complete={activeTab > tab.id}
              onClick={setActiveTab}
            />
          ))}
          <button
            type="button"
            className={`trench-document-link ${activeTab === 6 ? "is-active" : ""}`}
            onClick={() => setActiveTab(6)}
          >
            Documents
          </button>
        </aside>

        <section className="trench-content">
          <h2>{activeTab === 6 ? "Documents" : tabs[activeTab - 1]?.label}</h2>

          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            requiredMark={false}
          >
            {activeTab === 1 && (
              <>
                <div className="trench-grid">
                  <Form.Item label="Date of Visit" name="dateOfVisit">
                    <DatePicker className="w-full" format="DD/MM/YYYY" />
                  </Form.Item>
                  <Form.Item label="Date of Report" name="dateOfReport">
                    <DatePicker className="w-full" format="DD/MM/YYYY" />
                  </Form.Item>
                  <Form.Item label="Visitor Name" name="visitedPersonName">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Visitor Contact Number" name="contactNumber">
                    <Input inputMode="tel" />
                  </Form.Item>
                  <Form.Item
                    className="trench-full"
                    label="Property Address (As per site)"
                    name="propertyAddress"
                  >
                    <TextArea autoSize={{ minRows: 3, maxRows: 8 }} />
                  </Form.Item>
                </div>
              </>
            )}

            {activeTab === 2 && (
              <div className="trench-grid">
                <Form.Item label="Construction Stage" name="constructionStage">
                  <Select
                    allowClear
                    options={[
                      "FOUNDATION",
                      "PLINTH",
                      "RCC",
                      "BRICK WORK",
                      "PLASTER",
                      "TILING",
                      "INTERNAL FINISHING",
                      "COMPLETED",
                    ].map((value) => ({ value, label: value }))}
                  />
                </Form.Item>
                <Form.Item label="Construction %" name="constructionPercentage">
                  <InputNumber className="w-full" min={0} max={100} />
                </Form.Item>
                <Form.Item label="Construction Remarks" name="constructionRemarks">
                  <Input />
                </Form.Item>
                <Form.Item label="Construction is as per provided plans/bylaws" name="constructionAsPer">
                  <Select
                    allowClear
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                  />
                </Form.Item>
              </div>
            )}

            {activeTab === 3 && (
              <>
                <div className="trench-grid">
                  <Form.Item label="Total BUA Considered on Site (Sqft)" name="totalBua">
                    <InputNumber className="w-full" min={0} />
                  </Form.Item>
                  <Form.Item 
                    label="Latitude" 
                    name="latitude"
                    extra={<span style={{ fontSize: "11px", color: "#6b7280" }}>Example: 19.0760</span>}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item 
                    label="Longitude" 
                    name="longitude"
                    extra={<span style={{ fontSize: "11px", color: "#6b7280" }}>Example: 72.8777</span>}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item className="trench-full" label="Remarks" name="areaRemarks">
                    <TextArea autoSize={{ minRows: 3, maxRows: 8 }} />
                  </Form.Item>
                  <Form.Item label="Overall Status" name="overallStatus">
                    <Select
                      allowClear
                      options={[
                        { value: "POSITIVE", label: "Positive" },
                        { value: "NEGATIVE", label: "Negative" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues?.overallStatus !== currentValues?.overallStatus}
                  >
                    {({ getFieldValue }) =>
                      getFieldValue("overallStatus") === "NEGATIVE" ? (
                        <Form.Item label="If Negative, Specify Reason" name="negativeReason">
                          <Input />
                        </Form.Item>
                      ) : null
                    }
                  </Form.Item>
                </div>
                <div className="trench-location-picker" style={{ display: 'none' }}>
                  <LocationPicker
                    ref={geoRef}
                    onLocationChange={handleLocationChange}
                    initialLat={watchedLatitude}
                    initialLng={watchedLongitude}
                  />
                </div>
              </>
            )}

            {activeTab === 4 && (
              <div className="trench-grid">
                <Form.Item label="Charges" name="charges">
                  <InputNumber className="w-full" min={0} />
                </Form.Item>
                <Form.Item label="Base Rate" name="baseRate">
                  <InputNumber className="w-full" min={0} />
                </Form.Item>
                <Form.Item className="trench-full" label="Total" name="totalAmount">
                  <InputNumber className="w-full" min={0} />
                </Form.Item>
              </div>
            )}

            {activeTab === 5 && (
              <ImageUploader
                deleteId={id}
                images={images}
                setImages={setImages}
                setUploadedUrls={setUploadedUrls}
                uploadedImages={uploadedImages}
                uploadedUrls={uploadedUrls}
                fetchData={fetchReport}
                url="home-trench-reports"
                onCaptureLocation={handleLocationChange}
              />
            )}

            {activeTab === 6 && (
              <DocumentUploader
                caseId={id}
                bankName="home-trench-reports"
                docUrls={docUrls}
                setDocUrls={setDocUrls}
                fetchData={fetchReport}
              />
            )}
          </Form>

          <div className="trench-actions">
            {activeTab < 6 && (
              <Button onClick={nextTab}>Save &amp; Proceed</Button>
            )}
            <div>
              <Button type="primary" loading={loading} onClick={handleSubmitClick}>
                {isEdit ? "Update Report" : "Submit Report"}
              </Button>
              {id && (
                <Button danger loading={loading} onClick={handleFinalSubmit}>
                  Final Submit
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .trench-portal {
          min-height: 100vh;
          background: #f5f7fb;
          color: #172033;
          font-family: "Segoe UI", sans-serif;
        }
        .trench-topbar {
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 56px;
          padding: 0 28px;
          border-bottom: 1px solid #dfe5ec;
          background: #fff;
          box-shadow: 0 1px 4px rgba(15, 23, 42, .06);
        }
        .trench-brand {
          color: #1595d3;
          font-size: 21px;
          font-style: italic;
          font-weight: 800;
        }
        .trench-brand span {
          color: #09579f;
        }
        .trench-user {
          color: #334155;
          font-size: 12px;
          font-weight: 600;
        }
        .trench-heading {
          max-width: 1140px;
          margin: 14px auto 4px;
          padding: 0 16px;
        }
        .trench-heading h1 {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 700;
        }
        .trench-summary {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 52px;
          padding: 10px 18px;
          border: 1px solid #d7dee8;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 1px 4px rgba(15, 23, 42, .07);
          font-size: 12px;
        }
        .trench-summary span {
          color: #94a3b8;
          font-size: 10px;
        }
        .trench-summary i {
          width: 1px;
          height: 18px;
          background: #dbe2ea;
        }
        .trench-shell {
          display: flex;
          max-width: 1140px;
          min-height: 520px;
          margin: 0 auto 28px;
          padding: 0 16px;
        }
        .trench-sidebar {
          width: 180px;
          flex: 0 0 180px;
          border: 1px solid #d9e0e8;
          border-right: 0;
          background: #fff;
        }
        .trench-sidebar-title {
          padding: 16px 12px 8px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .trench-nav-item,
        .trench-document-link {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 10px 14px;
          border: 0;
          border-left: 2px solid transparent;
          background: #fff;
          color: #334155;
          cursor: pointer;
          font-size: 11px;
          text-align: left;
        }
        .trench-nav-item.is-active,
        .trench-document-link.is-active {
          border-left-color: #1768d1;
          background: #eaf2fd;
          color: #0755ad;
          font-weight: 700;
        }
        .trench-nav-status {
          display: inline-flex;
          width: 16px;
          justify-content: center;
          color: #15803d;
          font-size: 11px;
        }
        .trench-document-link {
          margin-top: 8px;
          border-top: 1px solid #e2e8f0;
          font-weight: 600;
        }
        .trench-content {
          min-width: 0;
          flex: 1;
          padding: 16px 22px 22px;
          border: 1px solid #d9e0e8;
          background: #fff;
        }
        .trench-content > h2 {
          margin: 0 0 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #edf1f5;
          font-size: 13px;
          font-weight: 700;
        }
        .trench-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0 16px;
          max-width: 760px;
        }
        .trench-full {
          grid-column: 1 / -1;
        }
        .trench-portal .ant-form-item {
          margin-bottom: 14px;
        }
        .trench-portal .ant-form-item-label > label {
          color: #475569;
          font-size: 10px;
        }
        .trench-portal .ant-input,
        .trench-portal .ant-input-number,
        .trench-portal .ant-picker,
        .trench-portal .ant-select-selector {
          border-color: #8793a3 !important;
          border-radius: 3px !important;
        }
        .trench-autofill {
          max-width: 820px;
          margin-bottom: 18px;
          padding: 14px;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          background: #f7fbff;
        }
        .trench-autofill-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }
        .trench-autofill-heading p {
          margin: 3px 0 0;
          color: #64748b;
          font-size: 11px;
        }
        .trench-location-picker {
          max-width: 760px;
          margin-top: 10px;
        }
        .trench-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          max-width: 820px;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }
        .trench-actions > div {
          display: flex;
          gap: 10px;
        }
        @media (max-width: 760px) {
          .trench-topbar {
            padding: 0 14px;
          }
          .trench-user {
            display: none;
          }
          .trench-summary {
            align-items: flex-start;
            flex-direction: column;
          }
          .trench-summary i {
            width: 100%;
            height: 1px;
          }
          .trench-shell {
            display: block;
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          }
          .trench-sidebar {
            display: flex;
            width: 100%;
            overflow-x: auto;
            border-right: 1px solid #d9e0e8;
          }
          .trench-sidebar-title {
            display: none;
          }
          .trench-nav-item,
          .trench-document-link {
            min-width: 150px;
            margin: 0;
            border-top: 0;
          }
          .trench-grid {
            grid-template-columns: 1fr;
          }
          .trench-full {
            grid-column: auto;
          }
          .trench-actions {
            align-items: stretch;
            flex-direction: column;
          }
          .trench-actions > div {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Trench;
