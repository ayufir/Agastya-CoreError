import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber } from "antd";
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
}) => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.user);
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [docUrls, setDocUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);

  useEffect(() => {
    if (mode === "observations") {
      const remarks = Array.isArray(isEdit.valuationRemarks)
        ? isEdit.valuationRemarks.join("\n")
        : isEdit.valuationRemarks || "";
      form.setFieldsValue({ observations: remarks });
    }

    if (mode === "billing") {
      form.setFieldsValue({
        charges: isEdit.charges ?? "",
        baseRate: isEdit.baseRate ?? "",
        totalAmount: isEdit.totalAmount ?? "",
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
            .map((line) => line.trim())
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

  if (mode === "photos") {
    return (
      <div className="home-first-reference-section">
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
      </div>
    );
  }

  if (mode === "documents") {
    return (
      <div className="home-first-reference-section">
        <DocumentUploader
          caseId={isEdit?._id}
          bankName="first-bank"
          docUrls={docUrls}
          setDocUrls={setDocUrls}
          fetchData={fetchData}
        />
      </div>
    );
  }

  if (mode === "videos") {
    return (
      <div className="home-first-reference-section">
        <VideoUploader
          caseId={isEdit?._id}
          bankName="first-bank"
          videoUrls={videoUrls}
          setVideoUrls={setVideoUrls}
          fetchData={fetchData}
        />
      </div>
    );
  }

  return (
    <Form form={form} layout="vertical" className="home-first-reference-section">
      {mode === "observations" && (
        <Form.Item label="Observations" name="observations">
          <TextArea
            autoSize={{ minRows: 5, maxRows: 16 }}
            placeholder="Enter complete observations"
          />
        </Form.Item>
      )}

      {mode === "billing" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item label="Charges" name="charges">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item label="Base Rate" name="baseRate">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item label="Total" name="totalAmount" className="md:col-span-2">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
        </div>
      )}
    </Form>
  );
};

export default HomeFirstPortalSections;
