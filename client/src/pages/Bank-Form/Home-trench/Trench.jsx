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

  const initialValues = useMemo(() => ({
    dateOfVisit: TODAY(),
    dateOfReport: TODAY(),
    propertyAddress: "",
    visitedPersonName: "",
    contactNumber: "",
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
    const allowedData = Object.fromEntries(
      Object.entries(mappedData).filter(([, value]) => (
        value !== null && value !== undefined && value !== ""
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
    if (id) {
      fetchReport();
      return;
    }

    form.setFieldsValue(initialValues);
  }, [fetchReport, form, id, initialValues]);

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

  return (
    <div className="trench-portal">
      <ConfirmModal
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleSubmit}
        title="Confirm Submission"
        message="Are you sure you want to submit this report?"
      />

      <header className="trench-topbar">
        <div className="trench-brand">
          <span>home</span>first
        </div>
        <div className="trench-user">
          {user?.name || "Assigned User"} · {user?.role || "User"}
        </div>
      </header>

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
                <div className="trench-autofill">
                  <div className="trench-autofill-heading">
                    <div>
                      <strong>Upload Home First Report</strong>
                      <p>
                        Only visitor name, contact number, property address,
                        latitude, and longitude will be filled.
                      </p>
                    </div>
                    {autoFilledFields.length > 0 && (
                      <Tag color="success">{autoFilledFields.length} fields filled</Tag>
                    )}
                  </div>
                  <AutoFillForm setFormData={handleAutoFill} />
                  <div className="mt-4">
                    <AdvancedAutoFillForm
                      bankName="Home First Tranche"
                      setFormData={handleAutoFill}
                      atsDocuments={atsDocuments || []}
                      imageUrls={uploadedUrls || []}
                      fetchData={fetchReport}
                    />
                  </div>
                </div>

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
                  <Form.Item label="Latitude" name="latitude">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Longitude" name="longitude">
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
                  <Form.Item label="If Negative, Specify Reason" name="negativeReason">
                    <Input />
                  </Form.Item>
                </div>
                <div className="trench-location-picker">
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
