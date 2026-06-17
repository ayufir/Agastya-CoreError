import React, { useMemo, useState, useEffect } from "react";
import { Button, Input, Select, message } from "antd";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Sparkles, 
  Trash2, 
  CloudUpload, 
  FileText, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Mail, 
  ClipboardList, 
  FolderPlus, 
  Camera, 
  Video, 
  Loader2, 
  Eye, 
  Check, 
  AlertTriangle,
  Clock,
  ExternalLink
} from "lucide-react";

const { TextArea } = Input;

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG = [
  {
    key: "gpsFiles",
    title: "📍 GPS / Map Screenshots",
    helper: "Google Maps screenshot, GPS app screenshot jisme lat-long dikhe",
  },
  {
    key: "atsFiles",
    title: "📄 ATS / Sale Deed / Legal Docs",
    helper: "Sale deed, gift deed, registry, allotment letter, patta — koi bhi Indian legal document",
  },
  {
    key: "emailFiles",
    title: "📧 Email / MIS Screenshot",
    helper: "Bank email jisme file no, LAN no, BRQ no, applicant name, branch ho",
  },
  {
    key: "fieldFormFiles",
    title: "📋 Field Visit Form",
    helper: "HF valuation format, handwritten site visit form",
  },
  {
    key: "additionalFiles",
    title: "🗂️ Additional Photos / Docs",
    helper: "MPSSL / Seemank Khasra app screenshot, extra site proof, supporting documents",
  },
];

const EMPTY_FILES = {
  gpsFiles: [],
  atsFiles: [],
  emailFiles: [],
  fieldFormFiles: [],
  additionalFiles: [],
};

const BANK_OPTIONS = [
  { value: "",                   label: "🏦 Select Bank" },
  { value: "ICICI",              label: "ICICI Bank (iLens)" },
  { value: "Bajaj",              label: "Bajaj Housing Finance / Ameriya" },
  { value: "Home First",         label: "Home First Finance" },
  { value: "Home First Tranche", label: "Home First Tranche" },
  { value: "Aditya Birla",       label: "Aditya Birla Capital (ABCL)" },
  { value: "Manappuram",         label: "Manappuram Finance" },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: "",                   label: "Auto Detect" },
  { value: "Open Plot",          label: "Open Plot" },
  { value: "Individual House",   label: "Individual House" },
  { value: "Flat / Apartment",   label: "Flat / Apartment" },
  { value: "Under Construction", label: "Under Construction" },
  { value: "Shop / Office",      label: "Shop / Office" },
];

// ─── File chip ────────────────────────────────────────────────────────────────
const FileChip = ({ file, onRemove, showDelete = true }) => {
  const isPdf = file.name?.toLowerCase().endsWith(".pdf");
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-150/70 bg-white/95 px-3 py-2 text-xs shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center gap-2 min-w-0">
        <div className={`p-1.5 rounded-lg ${isPdf ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"} shrink-0 flex items-center justify-center`}>
          <FileText className="w-3.5 h-3.5" />
        </div>
        <span className="truncate text-slate-700 font-semibold leading-none">{file.name}</span>
      </div>
      {showDelete && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors duration-150 cursor-pointer border-none flex items-center justify-center"
          title="Remove File"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

const ACCENT_STYLES = {
  purple: {
    border: "border-purple-200/70 hover:border-purple-400/80",
    bg: "bg-gradient-to-br from-purple-50/20 via-white/80 to-purple-50/10",
    shadow: "shadow-sm hover:shadow-md hover:shadow-purple-100/20",
    dashed: "border-purple-200 hover:border-purple-450",
    btn: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-200",
    badge: "bg-purple-100/60 text-purple-700 border-purple-250/50",
    lightBg: "bg-purple-50/50"
  },
  blue: {
    border: "border-blue-200/70 hover:border-blue-400/80",
    bg: "bg-gradient-to-br from-blue-50/20 via-white/80 to-blue-50/10",
    shadow: "shadow-sm hover:shadow-md hover:shadow-blue-100/20",
    dashed: "border-blue-200 hover:border-blue-450",
    btn: "bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-blue-200",
    badge: "bg-blue-100/60 text-blue-700 border-blue-250/50",
    lightBg: "bg-blue-50/50"
  },
  emerald: {
    border: "border-emerald-200/70 hover:border-emerald-400/80",
    bg: "bg-gradient-to-br from-emerald-50/20 via-white/80 to-emerald-50/10",
    shadow: "shadow-sm hover:shadow-md hover:shadow-emerald-100/20",
    dashed: "border-emerald-200 hover:border-emerald-450",
    btn: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-200",
    badge: "bg-emerald-100/60 text-emerald-700 border-emerald-250/50",
    lightBg: "bg-emerald-50/50"
  },
  rose: {
    border: "border-rose-200/70 hover:border-rose-400/80",
    bg: "bg-gradient-to-br from-rose-50/20 via-white/80 to-rose-50/10",
    shadow: "shadow-sm hover:shadow-md hover:shadow-rose-100/20",
    dashed: "border-rose-200 hover:border-rose-450",
    btn: "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-rose-200",
    badge: "bg-rose-100/60 text-rose-700 border-rose-250/50",
    lightBg: "bg-rose-50/50"
  },
  amber: {
    border: "border-amber-200/70 hover:border-amber-400/80",
    bg: "bg-gradient-to-br from-amber-50/20 via-white/80 to-amber-50/10",
    shadow: "shadow-sm hover:shadow-md hover:shadow-amber-100/20",
    dashed: "border-amber-200 hover:border-amber-450",
    btn: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-amber-200",
    badge: "bg-amber-100/60 text-amber-700 border-amber-250/50",
    lightBg: "bg-amber-50/50"
  },
  indigo: {
    border: "border-indigo-200/70 hover:border-indigo-400/80",
    bg: "bg-gradient-to-br from-indigo-50/20 via-white/80 to-indigo-50/10",
    shadow: "shadow-sm hover:shadow-md hover:shadow-indigo-100/20",
    dashed: "border-indigo-200 hover:border-indigo-450",
    btn: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-200",
    badge: "bg-indigo-100/60 text-indigo-700 border-indigo-250/50",
    lightBg: "bg-indigo-50/50"
  },
  slate: {
    border: "border-slate-200/70 hover:border-slate-400/80",
    bg: "bg-gradient-to-br from-slate-50/20 via-white/80 to-slate-50/10",
    shadow: "shadow-sm hover:shadow-md hover:shadow-slate-100/20",
    dashed: "border-slate-200 hover:border-slate-450",
    btn: "bg-gradient-to-r from-slate-600 to-slate-850 hover:from-slate-700 hover:to-slate-900 shadow-slate-200",
    badge: "bg-slate-100/60 text-slate-700 border-slate-250/50",
    lightBg: "bg-slate-50/50"
  },
};

// ─── Upload card ──────────────────────────────────────────────────────────────
const UploadCard = ({ title, helper, files, onAddFiles, onRemoveFile, accent = "blue", accept = "image/*,.pdf", icon, loading = false, allowDelete = true, isFieldOfficer = false }) => {
  const styles = ACCENT_STYLES[accent] || ACCENT_STYLES.blue;

  return (
    <div className={`rounded-2xl border ${isFieldOfficer ? "border-slate-200 bg-white shadow-sm" : `${styles.border} ${styles.bg} ${styles.shadow}`} p-5 transition-all duration-300 hover:scale-[1.015]`}>
      <div className="mb-4">
        <div className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
            {icon}
          </span>
          <span>{title}</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 font-semibold leading-relaxed">{helper}</div>
      </div>
      <label
        className={`flex flex-col items-center justify-center cursor-pointer rounded-xl border-2 border-dashed ${isFieldOfficer ? "border-slate-200 bg-slate-55/40 hover:bg-slate-50" : `${styles.dashed} bg-white/65 hover:bg-white/95`} px-4 py-5 text-center transition-all duration-200`}
      >
        <CloudUpload className={`w-7 h-7 text-slate-450 mb-2 transition-colors duration-250 ${isFieldOfficer ? "" : "animate-bounce"}`} style={isFieldOfficer ? {} : { animationDuration: '3s' }} />
        <span className="text-[11px] font-extrabold text-slate-600 mb-0.5">Drag & drop or browse</span>
        <span className="text-[9px] font-semibold text-slate-400 mb-3">Supports images, PDF up to 20MB</span>
        <span className={`rounded-lg ${isFieldOfficer ? "bg-slate-800 hover:bg-slate-900 text-white shadow-sm" : styles.btn} px-4 py-1.5 text-[11px] font-bold shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer flex items-center gap-1.5`}>
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {loading ? "Uploading..." : "Browse Files"}
        </span>
        <input
          type="file"
          multiple
          disabled={loading}
          accept={accept}
          className="hidden"
          onChange={(event) => {
            onAddFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <FileChip
              key={`${file.name}-${file.lastModified}-${index}`}
              file={file}
              showDelete={allowDelete}
              onRemove={() => onRemoveFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper to normalize documents (either string URLs or objects) to uniform { url, name, fileId } objects
const normalizeDocumentsList = (docs) => {
  if (!Array.isArray(docs)) return [];
  return docs.map((doc) => {
    if (typeof doc === "string") {
      let name = "Document";
      try {
        const urlObj = new URL(doc);
        const pathname = urlObj.pathname;
        name = pathname.substring(pathname.lastIndexOf("/") + 1) || "Document";
      } catch (e) {
        const parts = doc.split("/");
        name = parts[parts.length - 1] || "Document";
      }
      return { url: doc, name, fileId: doc };
    }
    return {
      url: doc?.url || "",
      fileId: doc?.fileId || doc?.url || "",
      name: doc?.name || "Document",
    };
  });
};

// ─── Main component ──────────────────────────────────────────────────────────
const AdvancedAutoFillForm = ({ 
  setFormData, 
  setFormDataDirect,
  setEditDataDirect,
  bankName: propBankName = "", 
  atsDocuments: propAtsDocuments = [],
  imageUrls: propImageUrls = [],
  siteVisitVideo: propSiteVisitVideo = [],
  gpsFiles: propGpsFiles = [],
  emailFiles: propEmailFiles = [],
  fieldFormFiles: propFieldFormFiles = [],
  additionalFiles: propAdditionalFiles = [],
  fetchData
}) => {
  const user = useSelector((state) => state.auth.user);
  const isFieldOfficer = user?.role?.toLowerCase() === "fieldofficer";
  const { id: caseId } = useParams();

  const [atsDocsList, setAtsDocsList] = useState([]);
  const [uploadingAts, setUploadingAts] = useState(false);
  const [filesByCategory, setFilesByCategory]     = useState(EMPTY_FILES);
  const [siteVisitPhotos, setSiteVisitPhotos]     = useState([]);
  const [siteVisitVideo, setSiteVisitVideo]       = useState([]);
  const [loading, setLoading]                     = useState(false);
  const [propertyTypeHint, setPropertyTypeHint]   = useState("");
  const [additionalNotes, setAdditionalNotes]     = useState("");
  const [selectedBank, setSelectedBank]           = useState(propBankName || "");
  const [auditNotes, setAuditNotes]               = useState([]);
  const [sourceSummary, setSourceSummary]         = useState(null);
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState([]);
  const [uploadedVideoUrls, setUploadedVideoUrls] = useState([]);
  const [uploadedGpsUrls, setUploadedGpsUrls] = useState([]);
  const [uploadedEmailUrls, setUploadedEmailUrls] = useState([]);
  const [uploadedFieldFormUrls, setUploadedFieldFormUrls] = useState([]);
  const [uploadedAdditionalUrls, setUploadedAdditionalUrls] = useState([]);

  const [uploadingCategory, setUploadingCategory] = useState({});

  const updateParentState = (fieldName, updatedList) => {
    if (typeof setFormDataDirect === "function") {
      setFormDataDirect((prev) => {
        const next = { ...prev, [fieldName]: updatedList };
        try {
          const normBank = selectedBank.toLowerCase();
          let draftKey = `icici-bank-draft:${caseId || "new"}`;
          if (normBank.includes("first")) {
            draftKey = `homefirst-bank-draft:${caseId || "new"}`;
          } else if (normBank.includes("bajaj")) {
            draftKey = `bajaj-bank-draft:${caseId || "new"}`;
          }
          localStorage.setItem(draftKey, JSON.stringify(next));
        } catch (e) {
          console.error("Draft auto-save failed:", e);
        }
        return next;
      });
    }
    if (typeof setEditDataDirect === "function") {
      setEditDataDirect((prev) => ({ ...prev, [fieldName]: updatedList }));
    }
    if (typeof setFormData === "function" && typeof setFormDataDirect !== "function") {
      setFormData((prev) => ({ ...(prev || {}), [fieldName]: updatedList }));
    }
  };

  useEffect(() => {
    setAtsDocsList(normalizeDocumentsList(propAtsDocuments));
  }, [propAtsDocuments]);

  useEffect(() => {
    setUploadedPhotoUrls(propImageUrls || []);
  }, [propImageUrls]);

  useEffect(() => {
    setUploadedVideoUrls(propSiteVisitVideo || []);
  }, [propSiteVisitVideo]);

  useEffect(() => {
    setUploadedGpsUrls(propGpsFiles || []);
  }, [propGpsFiles]);

  useEffect(() => {
    setUploadedEmailUrls(propEmailFiles || []);
  }, [propEmailFiles]);

  useEffect(() => {
    setUploadedFieldFormUrls(propFieldFormFiles || []);
  }, [propFieldFormFiles]);

  useEffect(() => {
    setUploadedAdditionalUrls(propAdditionalFiles || []);
  }, [propAdditionalFiles]);

  // Fetch as fallback if caseId exists
  useEffect(() => {
    if (caseId) {
      fetch(`${import.meta.env.VITE_API_URL}/api/case/${caseId}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData) {
            if (!propAtsDocuments || propAtsDocuments.length === 0) {
              const rawAts = resData.atsDocuments && resData.atsDocuments.length > 0
                ? resData.atsDocuments
                : (resData.AttachDocuments || []);
              setAtsDocsList(normalizeDocumentsList(rawAts));
            }
            if ((!propSiteVisitVideo || propSiteVisitVideo.length === 0) && Array.isArray(resData.siteVisitVideo)) {
              setUploadedVideoUrls(resData.siteVisitVideo);
            }
            if ((!propGpsFiles || propGpsFiles.length === 0) && Array.isArray(resData.gpsFiles)) {
              setUploadedGpsUrls(resData.gpsFiles);
            }
            if ((!propEmailFiles || propEmailFiles.length === 0) && Array.isArray(resData.emailFiles)) {
              setUploadedEmailUrls(resData.emailFiles);
            }
            if ((!propFieldFormFiles || propFieldFormFiles.length === 0) && Array.isArray(resData.fieldFormFiles)) {
              setUploadedFieldFormUrls(resData.fieldFormFiles);
            }
            if ((!propAdditionalFiles || propAdditionalFiles.length === 0) && Array.isArray(resData.additionalFiles)) {
              setUploadedAdditionalUrls(resData.additionalFiles);
            }
          }
        })
        .catch((err) => console.error("Error fetching case details:", err));
    }
  }, [caseId, propAtsDocuments?.length, propSiteVisitVideo?.length, propGpsFiles?.length, propEmailFiles?.length, propFieldFormFiles?.length, propAdditionalFiles?.length]);

  const handleGenericFileUpload = async (categoryKey, incomingFiles) => {
    const files = Array.from(incomingFiles || []);
    if (!files.length) return;

    setUploadingCategory((prev) => ({ ...prev, [categoryKey]: true }));
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success || !uploadData.urls?.length) {
        throw new Error(uploadData.message || "Failed to upload files");
      }

      const newDocs = uploadData.urls.map((item) => ({
        url: item.url,
        fileId: item.fileId,
        name: item.name,
      }));

      if (caseId) {
        let fieldName = categoryKey;
        if (categoryKey === "siteVisitPhotos") {
          const normBank = selectedBank.toLowerCase();
          if (normBank.includes("icici")) {
            fieldName = "sitePhotographs";
          } else if (normBank.includes("bajaj")) {
            fieldName = "otherImages";
          } else {
            fieldName = "imageUrls";
          }
        }

        // ── Optimistic update: show files immediately while DB saves ──────────
        if (categoryKey === "gpsFiles") {
          setUploadedGpsUrls((prev) => [...prev, ...newDocs]);
        } else if (categoryKey === "emailFiles") {
          setUploadedEmailUrls((prev) => [...prev, ...newDocs]);
        } else if (categoryKey === "fieldFormFiles") {
          setUploadedFieldFormUrls((prev) => [...prev, ...newDocs]);
        } else if (categoryKey === "additionalFiles") {
          setUploadedAdditionalUrls((prev) => [...prev, ...newDocs]);
        } else if (categoryKey === "siteVisitVideo") {
          setUploadedVideoUrls((prev) => [...prev, ...newDocs]);
        } else if (categoryKey === "siteVisitPhotos") {
          setUploadedPhotoUrls((prev) => [...prev, ...newDocs]);
        }

        let lastUpdatedCase = null;
        for (const doc of newDocs) {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/upload-category-document`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ caseId, fieldName, document: doc }),
          });
          const resData = await res.json();
          if (resData.success && resData.updatedCase) {
            lastUpdatedCase = resData.updatedCase;
          }
        }

        if (lastUpdatedCase) {
          if (fetchData) {
            await fetchData();
          } else {
            setFormData((prev) => ({
              ...(prev || {}),
              ...lastUpdatedCase,
            }));
          }
          // Sync from DB to ensure state exactly matches saved data
          if (categoryKey === "gpsFiles") {
            setUploadedGpsUrls(lastUpdatedCase.gpsFiles || []);
          } else if (categoryKey === "emailFiles") {
            setUploadedEmailUrls(lastUpdatedCase.emailFiles || []);
          } else if (categoryKey === "fieldFormFiles") {
            setUploadedFieldFormUrls(lastUpdatedCase.fieldFormFiles || []);
          } else if (categoryKey === "additionalFiles") {
            setUploadedAdditionalUrls(lastUpdatedCase.additionalFiles || []);
          } else if (categoryKey === "siteVisitVideo") {
            setUploadedVideoUrls(lastUpdatedCase.siteVisitVideo || []);
          } else if (categoryKey === "siteVisitPhotos") {
            setUploadedPhotoUrls(lastUpdatedCase[fieldName] || []);
          }
          message.success("Files uploaded and saved successfully!");
        } else {
          message.success("Files uploaded successfully!");
        }
      } else {
        if (categoryKey === "gpsFiles") {
          const updated = [...uploadedGpsUrls, ...newDocs];
          setUploadedGpsUrls(updated);
          updateParentState("gpsFiles", updated);
        } else if (categoryKey === "emailFiles") {
          const updated = [...uploadedEmailUrls, ...newDocs];
          setUploadedEmailUrls(updated);
          updateParentState("emailFiles", updated);
        } else if (categoryKey === "fieldFormFiles") {
          const updated = [...uploadedFieldFormUrls, ...newDocs];
          setUploadedFieldFormUrls(updated);
          updateParentState("fieldFormFiles", updated);
        } else if (categoryKey === "additionalFiles") {
          const updated = [...uploadedAdditionalUrls, ...newDocs];
          setUploadedAdditionalUrls(updated);
          updateParentState("additionalFiles", updated);
        } else if (categoryKey === "siteVisitVideo") {
          const updated = [...uploadedVideoUrls, ...newDocs];
          setUploadedVideoUrls(updated);
          updateParentState("siteVisitVideo", updated);
        } else if (categoryKey === "siteVisitPhotos") {
          const updated = [...uploadedPhotoUrls, ...newDocs];
          setUploadedPhotoUrls(updated);
          const normBank = selectedBank.toLowerCase();
          const fieldName = normBank.includes("icici") ? "sitePhotographs" : normBank.includes("bajaj") ? "otherImages" : "imageUrls";
          updateParentState(fieldName, updated);
        }
        message.success("Files added!");
      }
    } catch (err) {
      console.error(`Error uploading files for ${categoryKey}:`, err);
      message.error(err.message || `Failed to upload files.`);
    } finally {
      setUploadingCategory((prev) => ({ ...prev, [categoryKey]: false }));
    }
  };

  const handleGenericFileRemove = async (categoryKey, docToRemove) => {
    try {
      if (caseId) {
        let fieldName = categoryKey;
        if (categoryKey === "siteVisitPhotos") {
          const normBank = selectedBank.toLowerCase();
          if (normBank.includes("icici")) {
            fieldName = "sitePhotographs";
          } else if (normBank.includes("bajaj")) {
            fieldName = "otherImages";
          } else {
            fieldName = "imageUrls";
          }
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/remove-category-document`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseId, fieldName, document: docToRemove }),
        });
        const resData = await res.json();
        if (!resData.success) {
          throw new Error(resData.error || "Failed to remove document");
        }

        if (resData.updatedCase) {
          if (fetchData) {
            await fetchData();
          } else {
            setFormData((prev) => ({
              ...(prev || {}),
              ...resData.updatedCase,
            }));
          }
          if (categoryKey === "gpsFiles") {
            setUploadedGpsUrls(resData.updatedCase.gpsFiles || []);
          } else if (categoryKey === "emailFiles") {
            setUploadedEmailUrls(resData.updatedCase.emailFiles || []);
          } else if (categoryKey === "fieldFormFiles") {
            setUploadedFieldFormUrls(resData.updatedCase.fieldFormFiles || []);
          } else if (categoryKey === "additionalFiles") {
            setUploadedAdditionalUrls(resData.updatedCase.additionalFiles || []);
          } else if (categoryKey === "siteVisitVideo") {
            setUploadedVideoUrls(resData.updatedCase.siteVisitVideo || []);
          } else if (categoryKey === "siteVisitPhotos") {
            setUploadedPhotoUrls(resData.updatedCase[fieldName] || []);
          }
        }
        message.success("File removed successfully!");
      } else {
        if (docToRemove.fileId) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/remove/delete-file`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filePath: docToRemove.fileId }),
          });
        }

        if (categoryKey === "gpsFiles") {
          const updated = uploadedGpsUrls.filter((f) => f.fileId !== docToRemove.fileId && f.url !== docToRemove.url);
          setUploadedGpsUrls(updated);
          updateParentState("gpsFiles", updated);
        } else if (categoryKey === "emailFiles") {
          const updated = uploadedEmailUrls.filter((f) => f.fileId !== docToRemove.fileId && f.url !== docToRemove.url);
          setUploadedEmailUrls(updated);
          updateParentState("emailFiles", updated);
        } else if (categoryKey === "fieldFormFiles") {
          const updated = uploadedFieldFormUrls.filter((f) => f.fileId !== docToRemove.fileId && f.url !== docToRemove.url);
          setUploadedFieldFormUrls(updated);
          updateParentState("fieldFormFiles", updated);
        } else if (categoryKey === "additionalFiles") {
          const updated = uploadedAdditionalUrls.filter((f) => f.fileId !== docToRemove.fileId && f.url !== docToRemove.url);
          setUploadedAdditionalUrls(updated);
          updateParentState("additionalFiles", updated);
        } else if (categoryKey === "siteVisitVideo") {
          const updated = uploadedVideoUrls.filter((f) => f.fileId !== docToRemove.fileId && f.url !== docToRemove.url);
          setUploadedVideoUrls(updated);
          updateParentState("siteVisitVideo", updated);
        } else if (categoryKey === "siteVisitPhotos") {
          const updated = uploadedPhotoUrls.filter((f) => f.fileId !== docToRemove.fileId && f.url !== docToRemove.url);
          setUploadedPhotoUrls(updated);
          const normBank = selectedBank.toLowerCase();
          const fieldName = normBank.includes("icici") ? "sitePhotographs" : normBank.includes("bajaj") ? "otherImages" : "imageUrls";
          updateParentState(fieldName, updated);
        }
        message.success("File removed.");
      }
    } catch (err) {
      console.error(`Error removing file for ${categoryKey}:`, err);
      message.error(err.message || `Failed to remove file.`);
    }
  };

  const handleDeleteUploadedFile = async (categoryKey, fileToDelete) => {
    try {
      if (caseId) {
        let fieldName = categoryKey;
        if (categoryKey === "siteVisitPhotos") {
          const normBank = selectedBank.toLowerCase();
          if (normBank.includes("icici")) {
            fieldName = "sitePhotographs";
          } else if (normBank.includes("bajaj")) {
            fieldName = "otherImages";
          } else {
            fieldName = "imageUrls";
          }
        }

        let bankRoute = "icici";
        const normBank = selectedBank.toLowerCase();
        if (normBank.includes("first")) {
          if (normBank.includes("tranche")) {
            bankRoute = "home-first-trench";
          } else {
            bankRoute = "home-first";
          }
        } else if (normBank.includes("aditya")) {
          bankRoute = "aditya";
        } else if (normBank.includes("manappuram")) {
          bankRoute = "manappuram";
        } else if (normBank.includes("bajaj")) {
          bankRoute = "bajaj";
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/case/remove-image/${caseId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: fileToDelete,
            route: `/bank/${bankRoute}`,
            fieldName,
          }),
        });

        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.message || "Failed to remove file from server");
        }

        message.success("File deleted successfully!");
        if (fetchData) {
          await fetchData();
        }
      }
    } catch (err) {
      console.error("File delete error:", err);
      message.error(err.message || "Failed to delete file.");
    }
  };

  const handleVideoDelete = async (videoToDelete) => {
    try {
      if (caseId) {
        await handleDeleteUploadedFile("siteVisitVideo", videoToDelete);
      } else {
        if (videoToDelete.fileId) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/remove/delete-file`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filePath: videoToDelete.fileId }),
          });
        }
        message.success("Video removed.");
      }

      const updatedList = uploadedVideoUrls.filter(
        (video) => video.fileId !== videoToDelete.fileId && video.url !== videoToDelete.url
      );
      setUploadedVideoUrls(updatedList);

      if (!caseId) {
        updateParentState("siteVisitVideo", updatedList);
      }
    } catch (err) {
      console.error("Video delete error:", err);
      message.error(err.message || "Failed to remove video.");
    }
  };

  const handleAtsUpload = async (incomingFiles) => {
    const files = Array.from(incomingFiles || []);
    if (!files.length) return;

    setUploadingAts(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success || !uploadData.urls?.length) {
        throw new Error(uploadData.message || "Failed to upload files");
      }

      const newDocs = uploadData.urls.map((item) => ({
        url: item.url,
        fileId: item.fileId,
        name: item.name,
      }));

      const updatedList = [...atsDocsList, ...newDocs];
      setAtsDocsList(updatedList);

      if (caseId) {
        let lastUpdatedCase = null;
        for (const doc of newDocs) {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/upload-ats-document`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ caseId, document: doc }),
          });
          const resData = await res.json();
          if (resData.success && resData.updatedCase) {
            lastUpdatedCase = resData.updatedCase;
          }
        }

        if (lastUpdatedCase) {
          if (fetchData) {
            await fetchData();
          } else {
            setFormData((prev) => ({
              ...(prev || {}),
              ...lastUpdatedCase,
            }));
          }
          const addr = lastUpdatedCase.addressLegal || lastUpdatedCase.address || lastUpdatedCase.propertyAddress || "";
          const addrMsg = addr ? ` Autodetected address: "${addr}"` : "";
          message.success(`Property paper uploaded and saved successfully!${addrMsg}`);
        } else {
          if (fetchData) {
            await fetchData();
          } else {
            setFormData((prev) => ({
              ...(prev || {}),
              atsDocuments: updatedList,
            }));
          }
          message.success("Property paper uploaded and saved successfully!");
        }
      } else {
        updateParentState("atsDocuments", updatedList);
        message.success("Property paper added!");
      }

      setFilesByCategory((prev) => ({
        ...prev,
        atsFiles: [...prev.atsFiles, ...files],
      }));
    } catch (err) {
      console.error("ATS upload error:", err);
      message.error(err.message || "Failed to upload property documents.");
    } finally {
      setUploadingAts(false);
    }
  };

  const handleAtsDelete = async (docToDelete) => {
    try {
      if (caseId) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/remove-ats-document`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseId, document: docToDelete }),
        });
        const resData = await res.json();
        if (!resData.success) {
          throw new Error(resData.error || "Failed to remove document");
        }
        message.success("Property paper removed successfully!");
      } else {
        if (docToDelete.fileId) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/remove/delete-file`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filePath: docToDelete.fileId }),
          });
        }
        message.success("Property paper removed.");
      }

      const updatedList = atsDocsList.filter((doc) => doc.fileId !== docToDelete.fileId);
      setAtsDocsList(updatedList);

      if (!caseId) {
        updateParentState("atsDocuments", updatedList);
      }

      setFilesByCategory((prev) => ({
        ...prev,
        atsFiles: prev.atsFiles.filter((f) => f.name !== docToDelete.name),
      }));
    } catch (err) {
      console.error("ATS delete error:", err);
      message.error(err.message || "Failed to remove property document.");
    }
  };

  const handlePhotoDelete = async (photoToDelete) => {
    try {
      if (caseId) {
        const normBank = selectedBank.toLowerCase();
        let bankUrlPart = "first-bank";
        if (normBank.includes("icici")) {
          bankUrlPart = "icici-bank";
        } else if (normBank.includes("tranche")) {
          bankUrlPart = "home-trench-reports";
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${bankUrlPart}/remove-image/${caseId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: photoToDelete }),
        });
        const resData = await res.json();
        if (!resData.success && !res.ok) {
          throw new Error(resData.message || "Failed to remove photo from server");
        }

        if (fetchData) {
          await fetchData();
        }

        message.success("Site photo removed successfully!");
      } else {
        if (photoToDelete.fileId) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/remove/delete-file`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filePath: photoToDelete.fileId }),
          });
        }
        message.success("Site photo removed.");
      }

      const updatedList = uploadedPhotoUrls.filter(
        (photo) => photo.fileId !== photoToDelete.fileId && photo.url !== photoToDelete.url
      );
      setUploadedPhotoUrls(updatedList);

      const normBank = selectedBank.toLowerCase();
      let fieldName = "imageUrls";
      if (normBank.includes("icici")) {
        fieldName = "sitePhotographs";
      } else if (normBank.includes("bajaj")) {
        fieldName = "otherImages";
      }

      if (!caseId) {
        updateParentState(fieldName, updatedList);
      }
    } catch (err) {
      console.error("Photo delete error:", err);
      message.error(err.message || "Failed to remove site photo.");
    }
  };

  const totalFiles = useMemo(() => {
    return (
      uploadedGpsUrls.length +
      atsDocsList.length +
      uploadedEmailUrls.length +
      uploadedFieldFormUrls.length +
      uploadedAdditionalUrls.length +
      uploadedPhotoUrls.length +
      uploadedVideoUrls.length
    );
  }, [
    uploadedGpsUrls.length,
    atsDocsList.length,
    uploadedEmailUrls.length,
    uploadedFieldFormUrls.length,
    uploadedAdditionalUrls.length,
    uploadedPhotoUrls.length,
    uploadedVideoUrls.length,
  ]);

  const handleClearAll = () => {
    setFilesByCategory(EMPTY_FILES);
    setSiteVisitPhotos([]);
    setSiteVisitVideo([]);
    setPropertyTypeHint("");
    setAdditionalNotes("");
    setAuditNotes([]);
    setSourceSummary(null);
    setUploadedPhotoUrls([]);
    setUploadedVideoUrls([]);
    setUploadedGpsUrls([]);
    setUploadedEmailUrls([]);
    setUploadedFieldFormUrls([]);
    setUploadedAdditionalUrls([]);
    setAtsDocsList([]);
    
    const normBank = selectedBank.toLowerCase();
    const photoField = normBank.includes("icici") ? "sitePhotographs" : normBank.includes("bajaj") ? "otherImages" : "imageUrls";

    if (caseId) {
      if (typeof setFormData === "function") {
        setFormData((prev) => ({
          ...(prev || {}),
          atsDocuments: [],
          siteVisitVideo: [],
          gpsFiles: [],
          emailFiles: [],
          fieldFormFiles: [],
          additionalFiles: [],
          [photoField]: [],
        }));
      }
    } else {
      const clearedFields = {
        atsDocuments: [],
        siteVisitVideo: [],
        gpsFiles: [],
        emailFiles: [],
        fieldFormFiles: [],
        additionalFiles: [],
        imageUrls: [],
        sitePhotographs: [],
        otherImages: [],
      };

      if (typeof setFormDataDirect === "function") {
        setFormDataDirect((prev) => {
          const next = { ...prev, ...clearedFields };
          try {
            let draftKey = `icici-bank-draft:${caseId || "new"}`;
            if (normBank.includes("first")) {
              draftKey = `homefirst-bank-draft:${caseId || "new"}`;
            } else if (normBank.includes("bajaj")) {
              draftKey = `bajaj-bank-draft:${caseId || "new"}`;
            }
            localStorage.setItem(draftKey, JSON.stringify(next));
          } catch (e) {
            console.error("Draft auto-save failed:", e);
          }
          return next;
        });
      }
      if (typeof setEditDataDirect === "function") {
        setEditDataDirect((prev) => ({ ...prev, ...clearedFields }));
      }
      if (typeof setFormData === "function" && typeof setFormDataDirect !== "function") {
        setFormData((prev) => ({ ...(prev || {}), ...clearedFields }));
      }
    }
    message.info("Advanced AI uploads cleared.");
  };

  const handleGenerate = async () => {
    if (!totalFiles) {
      message.warning("Please upload at least one file.");
      return;
    }
    if (!selectedBank) {
      message.warning("Please select the target bank first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("bankName",         selectedBank);
      formData.append("propertyTypeHint", propertyTypeHint);
      formData.append("additionalNotes",  additionalNotes);
      if (caseId) {
        formData.append("caseId", caseId);
      }
      formData.append("gpsFilesList",        JSON.stringify(uploadedGpsUrls));
      formData.append("atsFilesList",        JSON.stringify(atsDocsList));
      formData.append("emailFilesList",      JSON.stringify(uploadedEmailUrls));
      formData.append("fieldFormFilesList",  JSON.stringify(uploadedFieldFormUrls));
      formData.append("additionalFilesList", JSON.stringify(uploadedAdditionalUrls));
      formData.append("siteVisitPhotosList", JSON.stringify(uploadedPhotoUrls));
      formData.append("siteVisitVideoList",  JSON.stringify(uploadedVideoUrls));

      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${apiBaseUrl}/api/advanced-autofill`,
        {
          method:      "POST",
          body:        formData,
          credentials: "include",
        }
      );

      const payload = await response.json();

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message || "Advanced autofill failed.");
      }

      // Fill form data (text fields & photos & videos)
      const photoUrls = payload.siteVisitPhotoUrls || [];
      const videoUrls = payload.siteVisitVideoUrls || [];
      const photoAnalysis = payload.photoAnalysis || [];
      const finalData = { ...payload.data };

      if (photoUrls.length > 0) {
        const categorized = {};

        photoUrls.forEach((photo) => {
          const match = photoAnalysis.find(
            (a) => a.file_name === photo.name || photo.name?.includes(a.file_name) || a.file_name?.includes(photo.name)
          );

          let fields = match && Array.isArray(match.supports_fields)
            ? match.supports_fields.filter(Boolean)
            : [];

          if (fields.length === 0) {
            const normBank = selectedBank.toLowerCase();
            if (normBank.includes("icici")) {
              fields = ["sitePhotographs"];
            } else if (normBank.includes("bajaj")) {
              fields = ["otherImages"];
            } else {
              fields = ["imageUrls"];
            }
          }

          fields.forEach((field) => {
            if (!categorized[field]) {
              categorized[field] = [];
            }
            if (field === "sitePhotographs") {
              categorized[field].push({
                name: photo.name,
                url: photo.url,
                fileId: photo.fileId,
                status: "done",
                uid: photo.fileId || `rc-upload-${Date.now()}-${Math.random()}`,
                thumbUrl: photo.url,
              });
            } else {
              categorized[field].push({
                url: photo.url,
                fileId: photo.fileId,
                name: photo.name,
              });
            }
          });
        });

        Object.entries(categorized).forEach(([field, photos]) => {
          finalData[field] = photos;
        });

        finalData.siteVisitPhotoUrls = photoUrls;
        finalData.photoAnalysis = photoAnalysis;
      }

      const atsUrls = payload.atsDocumentUrls || [];
      if (atsUrls.length > 0) {
        finalData.atsDocuments = atsUrls;
      }

      if (videoUrls.length > 0) {
        finalData.siteVisitVideo = videoUrls;
      }

      const gpsUrls = payload.gpsDocumentUrls || [];
      if (gpsUrls.length > 0) {
        finalData.gpsFiles = gpsUrls;
        setUploadedGpsUrls(gpsUrls);
      }

      const emailUrls = payload.emailDocumentUrls || [];
      if (emailUrls.length > 0) {
        finalData.emailFiles = emailUrls;
        setUploadedEmailUrls(emailUrls);
      }

      const fieldFormUrls = payload.fieldFormDocumentUrls || [];
      if (fieldFormUrls.length > 0) {
        finalData.fieldFormFiles = fieldFormUrls;
        setUploadedFieldFormUrls(fieldFormUrls);
      }

      const additionalUrls = payload.additionalDocumentUrls || [];
      if (additionalUrls.length > 0) {
        finalData.additionalFiles = additionalUrls;
        setUploadedAdditionalUrls(additionalUrls);
      }

      setFormData(finalData);
      setUploadedPhotoUrls(photoUrls);
      setUploadedVideoUrls(videoUrls);

      setAuditNotes(Array.isArray(payload.auditNotes) ? payload.auditNotes.filter(Boolean) : []);
      setSourceSummary(payload.sourceSummary || null);

      const photoMsg = photoUrls.length > 0
        ? ` ${photoUrls.length} site photos ImageKit pe upload ho gaye — form ke photo fields mein fill honge.`
        : "";
      const docMsg = atsUrls.length > 0
        ? ` ${atsUrls.length} property papers successfully upload ho gaye.`
        : "";

      message.success(`✅ Advanced AI ne form fill kar diya.${photoMsg}${docMsg}`);

      // Notify extension to inject photos via postMessage
      if (photoUrls.length > 0) {
        window.postMessage(
          {
            type: "EXTENSION_INJECT_PHOTOS",
            photoUrls: photoUrls.map((p) => p.url),
          },
          "*"
        );
      }
    } catch (error) {
      console.error("Advanced autofill error:", error);
      message.error(error.message || "Advanced AI request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-3xl border border-slate-200 ${isFieldOfficer ? "bg-white p-6 shadow-sm" : "bg-gradient-to-br from-indigo-50/20 via-white to-blue-50/15 p-6 shadow-md relative overflow-hidden backdrop-blur-md"}`}>
      {/* Decorative background glow elements */}
      {!isFieldOfficer && (
        <>
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Premium Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 transition-all duration-300">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-spin blur-md opacity-35" style={{ animationDuration: '6s' }} />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 text-indigo-650">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="absolute -inset-2 rounded-full border border-indigo-150 animate-ping opacity-40" style={{ animationDuration: '2s' }} />
          </div>
          
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight text-center mb-1 flex items-center gap-1.5 justify-center">
            <span>🤖 AI Engine Processing</span>
          </h3>
          <p className="text-xs text-slate-500 font-semibold text-center mb-6 max-w-xs leading-relaxed">
            Please wait while Claude AI extracts property data, maps coordinates, and uploads media assets...
          </p>

          <div className="w-full max-w-xs bg-slate-50/80 border border-slate-150 rounded-2xl p-4.5 space-y-3 shadow-inner">
            <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-extrabold">1</span>
              <span className="flex-1">Uploading site visit documents & media</span>
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-550 animate-ping" />
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-450">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 text-[10px] font-extrabold">2</span>
              <span className="flex-1">Claude AI address and content scan</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-450">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 text-[10px] font-extrabold">3</span>
              <span className="flex-1">Injecting extracted fields to report</span>
            </div>
          </div>
        </div>
      )}

      {/* Header Panel */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150/70 pb-5">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 bg-gradient-to-tr ${isFieldOfficer ? "from-slate-400 to-slate-500" : "from-indigo-500 to-purple-600"} rounded-2xl text-white shadow-md flex items-center justify-center shrink-0`}>
            {isFieldOfficer ? <FolderPlus className="w-5 h-5" /> : <Sparkles className="w-5 h-5 animate-pulse" />}
          </div>
          <div>
            <div className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>{isFieldOfficer ? "Case Documents & Media" : "AI Advanced Auto Fill"}</span>
              {!isFieldOfficer && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white border border-slate-200 text-slate-700 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {user?.role === "SuperAdmin" ? "Super Admin Mode" : `${user?.role || "Guest"} Mode`}
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-500 font-semibold leading-relaxed">
              {isFieldOfficer 
                ? "Upload property documents, screenshots, site visit form and site visit photographs."
                : "Upload site media and property documents to auto-populate files using intelligent Claude AI extraction."}
            </div>
          </div>
        </div>
      </div>

      {/* Bank + Property Type + Notes row */}
      {!isFieldOfficer && (
        <div className="mb-6 grid gap-4 md:grid-cols-3 bg-white/70 backdrop-blur-sm p-4.5 rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="space-y-1">
            <div className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <span>🏦 Target Bank</span>
              <span className="text-red-500 font-bold">*</span>
            </div>
            <Select
              value={selectedBank}
              onChange={setSelectedBank}
              options={BANK_OPTIONS}
              className="w-full"
              size="large"
              placeholder="Select bank"
              status={!selectedBank ? "error" : ""}
            />
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Property Type Hint</div>
            <Select
              value={propertyTypeHint}
              onChange={setPropertyTypeHint}
              options={PROPERTY_TYPE_OPTIONS}
              className="w-full"
              size="large"
            />
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Additional Context</div>
            <TextArea
              rows={2}
              value={additionalNotes}
              onChange={(event) => setAdditionalNotes(event.target.value)}
              placeholder="Optional notes for AI extraction context..."
              className="rounded-xl border-slate-200/85 hover:border-slate-350 focus:border-indigo-500 text-xs font-semibold focus:shadow-none placeholder-slate-400"
            />
          </div>
        </div>
      )}

      {/* Upload cards grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Card 1: GPS / Map Screenshots */}
        <UploadCard
          title="GPS / Map Screenshots"
          helper="Google Maps screenshot, GPS app screenshot showing coordinates"
          files={uploadedGpsUrls}
          onAddFiles={(incoming) => handleGenericFileUpload("gpsFiles", incoming)}
          onRemoveFile={(index) => handleGenericFileRemove("gpsFiles", uploadedGpsUrls[index])}
          accent="purple"
          loading={uploadingCategory["gpsFiles"]}
          icon={<MapPin className="w-4 h-4 text-purple-600" />}
          isFieldOfficer={isFieldOfficer}
        />

        {/* Card 2: ATS / Sale Deed / Legal Docs (Show for Admin/SuperAdmin/FO) */}
        <UploadCard
          title="ATS / Sale Deed / Legal Docs"
          helper="Sale deed, gift deed, registry, allotment letter, patta legal papers"
          files={atsDocsList}
          onAddFiles={handleAtsUpload}
          onRemoveFile={handleAtsDelete}
          accent="amber"
          loading={uploadingAts}
          icon={<FileText className="w-4 h-4 text-amber-600" />}
          allowDelete={!isFieldOfficer}
          isFieldOfficer={isFieldOfficer}
        />

        {/* Card 3: Email / MIS Screenshot (Show for Admin/SuperAdmin only) */}
        {!isFieldOfficer && (
          <UploadCard
            title="Email / MIS Screenshot"
            helper="Bank email detailing file/LAN/BRQ numbers, applicant and branch details"
            files={uploadedEmailUrls}
            onAddFiles={(incoming) => handleGenericFileUpload("emailFiles", incoming)}
            onRemoveFile={(index) => handleGenericFileRemove("emailFiles", uploadedEmailUrls[index])}
            accent="indigo"
            loading={uploadingCategory["emailFiles"]}
            icon={<Mail className="w-4 h-4 text-indigo-650" />}
            allowDelete={!isFieldOfficer}
            isFieldOfficer={isFieldOfficer}
          />
        )}

        {/* Card 4: Field Visit Form */}
        <UploadCard
          title="Field Visit Form"
          helper="Handwritten site visit form or standard valuation format sheet"
          files={uploadedFieldFormUrls}
          onAddFiles={(incoming) => handleGenericFileUpload("fieldFormFiles", incoming)}
          onRemoveFile={(index) => handleGenericFileRemove("fieldFormFiles", uploadedFieldFormUrls[index])}
          accent="blue"
          loading={uploadingCategory["fieldFormFiles"]}
          icon={<ClipboardList className="w-4 h-4 text-blue-650" />}
          isFieldOfficer={isFieldOfficer}
        />

        {/* Card 5: Additional Photos / Docs (Show for Admin/SuperAdmin only) */}
        {!isFieldOfficer && (
          <UploadCard
            title="Additional Photos / Docs"
            helper="Extra site proof, supporting legal screenshots, or structural layouts"
            files={uploadedAdditionalUrls}
            onAddFiles={(incoming) => handleGenericFileUpload("additionalFiles", incoming)}
            onRemoveFile={(index) => handleGenericFileRemove("additionalFiles", uploadedAdditionalUrls[index])}
            accent="slate"
            loading={uploadingCategory["additionalFiles"]}
            icon={<FolderPlus className="w-4 h-4 text-slate-600" />}
            allowDelete={!isFieldOfficer}
            isFieldOfficer={isFieldOfficer}
          />
        )}

        {/* Card 6: Site Visit Photos */}
        <UploadCard
          title="Site Visit Photos"
          helper="Site engineer captures. Autofills photo grids across report steps"
          files={uploadedPhotoUrls}
          onAddFiles={(incoming) => handleGenericFileUpload("siteVisitPhotos", incoming)}
          onRemoveFile={(index) => handleGenericFileRemove("siteVisitPhotos", uploadedPhotoUrls[index])}
          accent="emerald"
          loading={uploadingCategory["siteVisitPhotos"]}
          icon={<Camera className="w-4 h-4 text-emerald-650" />}
          isFieldOfficer={isFieldOfficer}
        />

        {/* Card 7: Site Visit Video (Show for Admin/SuperAdmin only) */}
        {!isFieldOfficer && (
          <UploadCard
            title="Site Visit Video"
            helper="Property site video sequence. Persisted to ImageKit video repository"
            files={uploadedVideoUrls}
            onAddFiles={(incoming) => handleGenericFileUpload("siteVisitVideo", incoming)}
            onRemoveFile={(index) => handleGenericFileRemove("siteVisitVideo", uploadedVideoUrls[index])}
            accent="rose"
            accept="video/*"
            loading={uploadingCategory["siteVisitVideo"]}
            icon={<Video className="w-4 h-4 text-rose-650" />}
            isFieldOfficer={isFieldOfficer}
          />
        )}
      </div>

      {/* ── Field Officer: Uploaded Documents Preview Panel ─────────────────── */}
      {isFieldOfficer && (() => {
        const totalFoFiles = uploadedGpsUrls.length + atsDocsList.length + uploadedFieldFormUrls.length + uploadedPhotoUrls.length;
        return (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Panel Header - always visible */}
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
              <div className="p-1.5 bg-emerald-50 rounded-xl text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-800">Uploaded Documents</div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {totalFoFiles > 0 ? `${totalFoFiles} file(s) saved to this case` : "No files uploaded yet — upload files above"}
                </div>
              </div>
              {totalFoFiles > 0 && (
                <span className="ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {totalFoFiles} Files
                </span>
              )}
            </div>

            <div className="p-5 space-y-5">
              {/* Empty State */}
              {totalFoFiles === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <CloudUpload className="w-10 h-10 mb-2 text-slate-200" />
                  <div className="text-sm font-semibold text-slate-400">No files uploaded yet</div>
                  <div className="text-[11px] text-slate-350 mt-1 text-center max-w-xs">Upload GPS screenshots, property papers, field visit form or site photos using the cards above.</div>
                </div>
              )}

              {/* GPS Files */}
              {uploadedGpsUrls.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>GPS / Map Screenshots ({uploadedGpsUrls.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {uploadedGpsUrls.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between gap-3 rounded-xl border border-purple-100 bg-purple-50/30 px-3 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <span className="truncate text-xs font-bold text-slate-700">{doc.name || `gps_${index + 1}`}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a href={doc.url} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] text-indigo-600 hover:underline font-bold flex items-center gap-0.5 border-none cursor-pointer">
                            View <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <button type="button" onClick={() => handleGenericFileRemove("gpsFiles", doc)}
                            className="rounded-lg p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 transition-colors cursor-pointer" title="Delete file">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ATS / Property Papers */}
              {atsDocsList.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Property Papers / ATS ({atsDocsList.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {atsDocsList.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50/30 px-3 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="truncate text-xs font-bold text-slate-700">{doc.name || `doc_${index + 1}`}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a href={doc.url} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] text-indigo-600 hover:underline font-bold flex items-center gap-0.5 border-none cursor-pointer">
                            View <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <button type="button" onClick={() => handleAtsDelete(doc)}
                            className="rounded-lg p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 transition-colors cursor-pointer" title="Delete file">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Field Visit Form */}
              {uploadedFieldFormUrls.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Field Visit Form ({uploadedFieldFormUrls.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {uploadedFieldFormUrls.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/30 px-3 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <ClipboardList className="w-4 h-4" />
                          </div>
                          <span className="truncate text-xs font-bold text-slate-700">{doc.name || `form_${index + 1}`}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a href={doc.url} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] text-indigo-600 hover:underline font-bold flex items-center gap-0.5 border-none cursor-pointer">
                            View <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <button type="button" onClick={() => handleGenericFileRemove("fieldFormFiles", doc)}
                            className="rounded-lg p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 transition-colors cursor-pointer" title="Delete file">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Site Visit Photos */}
              {uploadedPhotoUrls.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Site Visit Photos ({uploadedPhotoUrls.length})</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {uploadedPhotoUrls.map((photo, index) => (
                      <div key={index} className="group relative rounded-xl border border-emerald-100 bg-white p-1.5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                          <img src={photo.url} alt={photo.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          <a href={photo.url} target="_blank" rel="noopener noreferrer"
                            className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-extrabold rounded-lg gap-1 border-none cursor-pointer">
                            <Eye className="w-3.5 h-3.5" /> View
                          </a>
                        </div>
                        <div className="mt-1.5 text-[10px] font-bold text-slate-600 truncate px-0.5" title={photo.name}>{photo.name}</div>
                        <button type="button" onClick={() => handlePhotoDelete(photo)}
                          className="mt-1 w-full rounded-lg bg-red-50 hover:bg-red-100 text-red-500 py-1 text-[10px] font-bold cursor-pointer border-none flex items-center justify-center gap-1">
                          <Trash2 className="w-2.5 h-2.5" /> Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Footer action bar */}
      {!isFieldOfficer && (
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm p-4.5 shadow-sm">
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Files Loaded & Pending AI Extraction</span>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100/50 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                <MapPin className="w-3 h-3" /> GPS: {uploadedGpsUrls.length}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100/50 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                <FileText className="w-3 h-3" /> ATS: {atsDocsList.length}
              </span>
              {!isFieldOfficer && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100/50 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                  <Mail className="w-3 h-3" /> Email: {uploadedEmailUrls.length}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100/50 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                <ClipboardList className="w-3 h-3" /> Form: {uploadedFieldFormUrls.length}
              </span>
              {!isFieldOfficer && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-100/50 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                  <FolderPlus className="w-3 h-3" /> Extra: {uploadedAdditionalUrls.length}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                <Camera className="w-3 h-3" /> Photo: {uploadedPhotoUrls.length}
              </span>
              {!isFieldOfficer && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-100/50 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                  <Video className="w-3 h-3" /> Video: {uploadedVideoUrls.length}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2.5 shrink-0 self-end md:self-auto">
            <Button
              type="default"
              onClick={handleClearAll}
              className="hover:border-slate-350 hover:text-slate-800 text-xs font-bold text-slate-650 rounded-xl px-4 h-10 flex items-center transition-all bg-white border-slate-200 cursor-pointer shadow-sm"
              disabled={loading}
            >
              Clear All
            </Button>
            <Button
              type="primary"
              onClick={handleGenerate}
              loading={loading}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 border-none text-xs font-bold rounded-xl px-6 h-10 flex items-center transition-all shadow-md shadow-indigo-150 cursor-pointer text-white"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
              Process With Advanced AI
            </Button>
          </div>
        </div>
      )}

      {/* Results panel */}
      {!isFieldOfficer && (sourceSummary || 
        auditNotes.length > 0 || 
        uploadedPhotoUrls.length > 0 || 
        uploadedVideoUrls.length > 0 || 
        atsDocsList.length > 0 || 
        uploadedGpsUrls.length > 0 || 
        uploadedEmailUrls.length > 0 || 
        uploadedFieldFormUrls.length > 0 || 
        uploadedAdditionalUrls.length > 0) && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white/95 p-5.5 shadow-md space-y-5.5 relative overflow-hidden">
          <div className="border-b border-slate-150 pb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 rounded-xl text-indigo-600">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <span className="text-sm font-extrabold text-slate-850">AI Extraction Analysis Results</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /> Active
            </span>
          </div>

          {/* Uploaded ATS Documents / Property Papers */}
          {atsDocsList.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Property Papers ({atsDocsList.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {atsDocsList.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-150/70 bg-gradient-to-br from-white to-amber-50/10 p-3 shadow-sm transition-all hover:border-amber-300 hover:shadow-md duration-200 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 text-sm font-extrabold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-bold text-slate-800" title={doc.name || `document_${index + 1}`}>
                          {doc.name || `document_${index + 1}`}
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-650 hover:text-indigo-850 hover:underline font-bold flex items-center gap-0.5 mt-0.5 cursor-pointer border-none"
                        >
                          View File <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                    {!isFieldOfficer && (
                      <button
                        type="button"
                        onClick={() => handleAtsDelete(doc)}
                        className="rounded-lg p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-650 transition-colors duration-155 cursor-pointer shrink-0 border-none flex items-center justify-center"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded Email Screenshots (Show for Admin/SuperAdmin only) */}
          {!isFieldOfficer && uploadedEmailUrls.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Email Screenshots ({uploadedEmailUrls.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {uploadedEmailUrls.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-150/70 bg-gradient-to-br from-white to-indigo-50/10 p-3 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md duration-200 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 text-sm font-extrabold">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-bold text-slate-800" title={doc.name || `email_${index + 1}`}>
                          {doc.name || `email_${index + 1}`}
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-650 hover:text-indigo-850 hover:underline font-bold flex items-center gap-0.5 mt-0.5 cursor-pointer border-none"
                        >
                          View File <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                    {!isFieldOfficer && (
                      <button
                        type="button"
                        onClick={() => handleGenericFileRemove("emailFiles", uploadedEmailUrls[index])}
                        className="rounded-lg p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-650 transition-colors duration-155 cursor-pointer shrink-0 border-none flex items-center justify-center"
                        title="Delete email file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded Additional Files (Show for Admin/SuperAdmin only) */}
          {!isFieldOfficer && uploadedAdditionalUrls.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Additional Files ({uploadedAdditionalUrls.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {uploadedAdditionalUrls.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-150/70 bg-gradient-to-br from-white to-slate-50/10 p-3 shadow-sm transition-all hover:border-slate-300 hover:shadow-md duration-200 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600 text-sm font-extrabold">
                        <FolderPlus className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-bold text-slate-800" title={doc.name || `additional_${index + 1}`}>
                          {doc.name || `additional_${index + 1}`}
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-650 hover:text-indigo-850 hover:underline font-bold flex items-center gap-0.5 mt-0.5 cursor-pointer border-none"
                        >
                          View File <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                    {!isFieldOfficer && (
                      <button
                        type="button"
                        onClick={() => handleGenericFileRemove("additionalFiles", uploadedAdditionalUrls[index])}
                        className="rounded-lg p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-650 transition-colors duration-155 cursor-pointer shrink-0 border-none flex items-center justify-center"
                        title="Delete additional file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source summary */}
          {sourceSummary && (
            <div className="rounded-2xl border border-slate-150 bg-gradient-to-r from-slate-50 via-indigo-50/10 to-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-xs font-extrabold text-slate-800 tracking-tight">AI Analysis Extraction Stats</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white border border-purple-100 text-purple-700 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                  GPS: {sourceSummary.gpsFiles || 0}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-blue-100 text-blue-700 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                  Form: {sourceSummary.fieldFormFiles || 0}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-100 text-emerald-700 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                  Photos: {sourceSummary.siteVisitUploaded || 0}/{sourceSummary.siteVisitPhotos || 0}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-rose-100 text-rose-700 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                  Videos: {sourceSummary.siteVisitVideoUploaded || 0}/{sourceSummary.siteVisitVideo || 0}
                </span>
              </div>
            </div>
          )}

          {/* Uploaded ImageKit photo URLs */}
          {uploadedPhotoUrls.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Uploaded Site Photos ({uploadedPhotoUrls.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedPhotoUrls.map((photo, index) => (
                  <div
                    key={index}
                    className="group relative rounded-2xl border border-slate-150/75 bg-gradient-to-br from-white to-slate-50/20 p-2 text-center transition-all duration-300 hover:border-emerald-300 hover:shadow-md"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-inner">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="h-full w-full object-cover transition-transform duration-350 group-hover:scale-105"
                      />
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-extrabold rounded-xl gap-1 border-none cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Full
                      </a>
                    </div>
                    <div className="mt-2 text-[10px] font-extrabold text-slate-700 truncate px-1" title={photo.name}>
                      {photo.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePhotoDelete(photo)}
                      className="mt-2 w-full rounded-xl bg-red-50 hover:bg-red-100 text-red-600 py-1.5 text-[10px] font-extrabold transition-all duration-150 cursor-pointer border-none flex items-center justify-center"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded ImageKit video URLs (Show for Admin/SuperAdmin only) */}
          {!isFieldOfficer && uploadedVideoUrls.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-extrabold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                <span>Uploaded Site Videos ({uploadedVideoUrls.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {uploadedVideoUrls.map((video, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-150/70 bg-gradient-to-br from-white to-rose-50/10 p-3 shadow-sm transition-all hover:border-rose-300 hover:shadow-md duration-200 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-650 text-xs font-extrabold">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-bold text-slate-800" title={video.name || `video_${index + 1}`}>
                          {video.name || `video_${index + 1}`}
                        </div>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-650 hover:text-indigo-850 hover:underline font-bold flex items-center gap-0.5 mt-0.5 cursor-pointer border-none"
                        >
                          Play Video <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVideoDelete(video)}
                      className="rounded-lg p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-650 transition-colors duration-150 cursor-pointer shrink-0 border-none flex items-center justify-center"
                      title="Delete video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Audit notes */}
          {auditNotes.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>AI Audit Notes ({auditNotes.length})</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {auditNotes.map((note, index) => (
                  <div
                    key={`${note}-${index}`}
                    className="rounded-xl border border-amber-200/70 bg-amber-50/25 p-3.5 text-xs text-amber-900 font-semibold leading-relaxed flex items-start gap-2.5 shadow-sm"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedAutoFillForm;
