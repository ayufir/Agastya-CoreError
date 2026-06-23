import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button } from "antd";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ImageUploader from "../../../../components/ImageUploader";
import DocumentUploader from "../../../../components/DocumentUploader";
import VideoUploader from "../../../../components/VideoUploader";
import { MapPin, FileText, ClipboardList, Camera, ExternalLink, FolderOpen, AlertCircle } from "lucide-react";

const { TextArea } = Input;

const HomeFirstPortalSections = ({
  mode,
  isEdit = {},
  sectionId,
  registerSectionSubmitter,
  fetchData,
  onNext,
  onBack,
}) => {
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form) || {};
  const hasValue = (name) => formValues[name] !== undefined && formValues[name] !== null && formValues[name] !== "";
  const user = useSelector((state) => state.auth.user);
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [docUrls, setDocUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);

  useEffect(() => {
    if (mode === "observations") {
      const remarks = Array.isArray(isEdit.valuationRemarks)
        ? isEdit.valuationRemarks.map(r => String(r || "").toUpperCase()).join("\n")
        : String(isEdit.valuationRemarks || "").toUpperCase();
      form.setFieldsValue({ observations: remarks });
    }

    if (mode === "billing") {
      form.setFieldsValue({
        charges: (isEdit.charges !== undefined && isEdit.charges !== null && isEdit.charges !== "") ? isEdit.charges : 1800,
        baseRate: (isEdit.baseRate !== undefined && isEdit.baseRate !== null && isEdit.baseRate !== "") ? isEdit.baseRate : 1800,
        totalAmount: (isEdit.totalAmount !== undefined && isEdit.totalAmount !== null && isEdit.totalAmount !== "") ? isEdit.totalAmount : 1800,
      });
    }

    if (mode === "photos") {
      const savedImages = Array.isArray(isEdit.imageUrls) ? isEdit.imageUrls : [];
      setUploadedImages(savedImages);
      setUploadedUrls(savedImages);
    }

    if (mode === "documents") {
      const savedDocs = Array.isArray(isEdit.atsDocuments) && isEdit.atsDocuments.length > 0
        ? isEdit.atsDocuments
        : (Array.isArray(isEdit.AttachDocuments) ? isEdit.AttachDocuments : []);
      setDocUrls(savedDocs);
    }

    if (mode === "videos") {
      setVideoUrls(Array.isArray(isEdit.siteVisitVideo) ? isEdit.siteVisitVideo : []);
    }
  }, [form, isEdit, mode]);

  const handleValuesChange = (_, all) => {
    if (mode === "billing") {
      const charges = all.charges !== undefined && all.charges !== null && all.charges !== "" ? parseFloat(all.charges) : 0;
      const gst = 0.18;
      const total = Math.round(charges * (1 + gst));
      form.setFieldsValue({
        totalAmount: all.charges !== undefined && all.charges !== null && all.charges !== "" ? total : 0,
        baseRate: all.charges !== undefined && all.charges !== null && all.charges !== "" ? all.charges : 1800
      });
    }
  };

  useEffect(() => {
    if (!registerSectionSubmitter || !sectionId) return;

    registerSectionSubmitter(sectionId, async () => {
      if (mode === "photos") {
        if (user?.role === "FieldOfficer" && uploadedUrls.length === 0) {
          toast.error("Please upload at least one site photograph");
          throw new Error("site photograph required");
        }
        return { imageUrls: uploadedUrls };
      }

      if (mode === "documents") {
        return { 
          AttachDocuments: docUrls,
          atsDocuments: docUrls
        };
      }

      if (mode === "videos") {
        return { siteVisitVideo: videoUrls };
      }

      const values = await form.validateFields();
      if (mode === "observations") {
        return {
          valuationRemarks: String(values.observations || "")
            .split(/\r?\n/)
            .map((line) => line.trim().toUpperCase())
            .filter(Boolean),
        };
      }

      return values;
    });

    return () => {
      registerSectionSubmitter(sectionId, null);
    };
  }, [
    docUrls,
    form,
    mode,
    registerSectionSubmitter,
    sectionId,
    uploadedUrls,
    videoUrls,
    user?.role,
  ]);

  if (mode === "fieldUploads") {
    const gpsFiles = Array.isArray(isEdit?.gpsFiles) ? isEdit.gpsFiles : [];
    const atsFiles = Array.isArray(isEdit?.atsDocuments) && isEdit.atsDocuments.length > 0
      ? isEdit.atsDocuments
      : (Array.isArray(isEdit?.AttachDocuments) ? isEdit.AttachDocuments : []);
    const fieldFormFiles = Array.isArray(isEdit?.fieldFormFiles) ? isEdit.fieldFormFiles : [];
    const sitePhotos = Array.isArray(isEdit?.imageUrls) ? isEdit.imageUrls : [];
    const emailFiles = Array.isArray(isEdit?.emailFiles) ? isEdit.emailFiles : [];
    const additionalFiles = Array.isArray(isEdit?.additionalFiles) ? isEdit.additionalFiles : [];

    const totalFiles = gpsFiles.length + atsFiles.length + fieldFormFiles.length + sitePhotos.length + emailFiles.length + additionalFiles.length;

    const DocRow = ({ doc, index, fallbackPrefix }) => {
      const fileUrl = doc?.url || (typeof doc === "string" ? doc : "");
      const fileName = doc?.name || (typeof doc === "string" ? doc.split("/").pop() : `${fallbackPrefix}_${index + 1}`);
      return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-150 bg-slate-50/60 px-3 py-2.5 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate text-xs font-bold text-slate-700" title={fileName}>{fileName}</span>
          </div>
          {fileUrl && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer"
              className="shrink-0 text-[10px] text-indigo-600 hover:text-indigo-800 hover:underline font-bold flex items-center gap-0.5 border-none cursor-pointer">
              View <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      );
    };

    return (
      <div className="home-first-reference-section">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-800">Field Officer Uploads</div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                {totalFiles > 0
                  ? `${totalFiles} file(s) submitted by the assigned Field Officer`
                  : "No documents have been submitted yet"}
              </div>
            </div>
          </div>

          {totalFiles === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <AlertCircle className="w-10 h-10 mb-3 text-slate-300" />
              <div className="text-sm font-semibold text-slate-400">No uploads yet</div>
              <div className="text-xs text-slate-350 mt-1">The Field Officer hasn't uploaded any documents for this case.</div>
            </div>
          )}

          {/* GPS Files */}
          {gpsFiles.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>GPS / Map Screenshots ({gpsFiles.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {gpsFiles.map((doc, i) => <DocRow key={i} doc={doc} index={i} fallbackPrefix="gps" />)}
              </div>
            </div>
          )}

          {/* ATS / Property Papers */}
          {atsFiles.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Property Papers / ATS ({atsFiles.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {atsFiles.map((doc, i) => <DocRow key={i} doc={doc} index={i} fallbackPrefix="doc" />)}
              </div>
            </div>
          )}

          {/* Field Visit Form */}
          {fieldFormFiles.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Field Visit Form ({fieldFormFiles.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fieldFormFiles.map((doc, i) => <DocRow key={i} doc={doc} index={i} fallbackPrefix="form" />)}
              </div>
            </div>
          )}

          {/* Email / MIS */}
          {emailFiles.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Email / MIS Screenshots ({emailFiles.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {emailFiles.map((doc, i) => <DocRow key={i} doc={doc} index={i} fallbackPrefix="email" />)}
              </div>
            </div>
          )}

          {/* Additional Files */}
          {additionalFiles.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Additional Documents ({additionalFiles.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {additionalFiles.map((doc, i) => <DocRow key={i} doc={doc} index={i} fallbackPrefix="extra" />)}
              </div>
            </div>
          )}

          {/* Site Visit Photos */}
          {sitePhotos.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Site Visit Photos ({sitePhotos.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {sitePhotos.map((photo, index) => {
                  const photoUrl = photo?.url || (typeof photo === "string" ? photo : "");
                  const photoName = photo?.name || `photo_${index + 1}`;
                  return (
                    <div key={index} className="group relative rounded-xl border border-slate-150 bg-white p-1.5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md">
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                        {photoUrl ? (
                          <img src={photoUrl} alt={photoName} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-300">
                            <Camera className="w-8 h-8" />
                          </div>
                        )}
                        {photoUrl && (
                          <a href={photoUrl} target="_blank" rel="noopener noreferrer"
                            className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-extrabold rounded-lg gap-1 border-none cursor-pointer">
                            <ExternalLink className="w-3.5 h-3.5" /> Open
                          </a>
                        )}
                      </div>
                      <div className="mt-1.5 text-[9px] font-bold text-slate-500 truncate px-0.5" title={photoName}>{photoName}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderSaveButton = () => {
    const isPhotos = mode === "photos";
    const label = isPhotos ? "Proceed to Document Uploading" : "Save & Proceed";
    const btnStyle = isPhotos
      ? {
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 24px",
          borderRadius: "999px",
          border: "none",
          background: "#0056b3",
          color: "#fff",
          fontWeight: 600,
          fontSize: "14px",
          height: "42px",
          cursor: "pointer",
          boxShadow: "none",
        }
      : {
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 24px",
          borderRadius: "999px",
          border: "2px solid #0056b3",
          background: "transparent",
          color: "#0056b3",
          fontWeight: 600,
          fontSize: "14px",
          height: "42px",
          cursor: "pointer",
          boxShadow: "none",
        };

    return (
      <div style={{ 
        marginTop: "24px", 
        paddingTop: isPhotos ? "24px" : "0px", 
        borderTop: isPhotos ? "1px solid #e2e8f0" : "none" 
      }}>
        <button
          type="button"
          onClick={() => onNext && onNext()}
          style={btnStyle}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          {label}
        </button>
      </div>
    );
  };

  if (mode === "photos") {
    return (
      <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-6 text-slate-800">Site Pics</h2>
        <ImageUploader
          deleteId={isEdit?._id}
          images={images}
          setImages={setImages}
          setUploadedUrls={setUploadedUrls}
          uploadedImages={uploadedImages}
          uploadedUrls={uploadedUrls}
          fetchData={fetchData}
          url="first-bank"
        />
        {renderSaveButton()}
      </div>
    );
  }

  if (mode === "documents") {
    return (
      <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-6 text-slate-800">Documents</h2>
        <DocumentUploader
          caseId={isEdit?._id}
          bankName="first-bank"
          docUrls={docUrls}
          setDocUrls={setDocUrls}
          fetchData={fetchData}
        />
        {renderSaveButton()}
      </div>
    );
  }

  if (mode === "videos") {
    return (
      <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-6 text-slate-800">Site Video</h2>
        <VideoUploader
          caseId={isEdit?._id}
          bankName="first-bank"
          videoUrls={videoUrls}
          setVideoUrls={setVideoUrls}
          fetchData={fetchData}
        />
        {renderSaveButton()}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
      <style>{`
        .custom-form-item-wrapper .custom-label {
          position: absolute;
          top: -8px;
          left: 10px;
          background: #fff;
          padding: 0 6px;
          font-size: 11px;
          color: #475569;
          font-weight: 600;
          z-index: 2;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.15s ease, transform 0.15s ease;
          pointer-events: none;
        }
        .custom-form-item-wrapper:focus-within .custom-label,
        .custom-form-item-wrapper:has(.ant-form-item-has-error) .custom-label,
        .custom-form-item-wrapper.has-value .custom-label {
          opacity: 1;
          transform: translateY(0);
        }
        .custom-form-item-wrapper .ant-input-number {
          width: 100% !important;
          height: 40px !important;
          border-radius: 6px !important;
          display: flex !important;
          align-items: center !important;
          border: 1px solid #d1d5db !important;
          box-shadow: none !important;
        }
        .custom-form-item-wrapper .ant-input-number-input {
          height: 38px !important;
          color: #0f172a !important;
          font-weight: 500 !important;
        }
        .custom-form-item-wrapper:has(.ant-form-item-has-error) .custom-label {
          color: #ff4d4f !important;
        }
        .custom-form-item-wrapper:has(.ant-form-item-has-error) .ant-input-number {
          border-color: #ff4d4f !important;
        }
      `}</style>
      <h2 className="text-xl font-bold mb-6 text-slate-800">
        {mode === "observations" ? "Observations" : "Billing"}
      </h2>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        onFinish={onNext}
      >
        {mode === "observations" && (
          <Form.Item name="observations" style={{ margin: 0 }}>
            <TextArea
              autoSize={{ minRows: 5, maxRows: 16 }}
              placeholder="Observations"
              style={{ border: "1px solid #d1d5db", borderRadius: "6px" }}
            />
          </Form.Item>
        )}

        {mode === "billing" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className={`custom-form-item-wrapper ${hasValue("charges") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
                <span className="custom-label">Charges</span>
                <Form.Item name="charges" style={{ margin: 0 }}>
                  <InputNumber min={0} placeholder="Charges" />
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("baseRate") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
                <span className="custom-label">Base Rate</span>
                <Form.Item name="baseRate" style={{ margin: 0 }}>
                  <InputNumber min={0} placeholder="Base Rate" />
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-4">
              <div className={`custom-form-item-wrapper ${hasValue("totalAmount") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
                <span className="custom-label">Total</span>
                <Form.Item name="totalAmount" style={{ margin: 0 }}>
                  <InputNumber min={0} placeholder="Total" />
                </Form.Item>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: "24px" }}>
          <Button
            htmlType="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 24px",
              borderRadius: "999px",
              border: "2px solid #0056b3",
              background: "transparent",
              color: "#0056b3",
              fontWeight: 600,
              fontSize: "14px",
              height: "42px",
              cursor: "pointer",
              boxShadow: "none",
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save & Proceed
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default HomeFirstPortalSections;
