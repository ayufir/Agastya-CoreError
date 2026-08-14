import React, { useMemo, useState, useEffect } from "react";
import { Button, Input, Select, message } from "antd";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../config/axios";
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
  ExternalLink,
  FileUp,
  ChevronDown,
  ChevronUp,
  EyeOff
} from "lucide-react";

const { TextArea } = Input;
const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN || "";

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
  const isImg = file.name?.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/) || file.url?.match(/\.(jpg|jpeg|png|webp|gif)/i);
  const fileUrl = file.url || file.thumbUrl;

  const formatFileSize = (bytes) => {
    if (!bytes) return "Uploaded ✓";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="flex items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-[#d0e6df]/75 bg-white p-3 sm:p-3.5 shadow-sm hover:border-[#3b6657] hover:shadow-md transition-all duration-250 group">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {fileUrl && isImg ? (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 cursor-pointer" title="Click to view full image">
            <img src={fileUrl} alt={file.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 hover:scale-105 transition-transform" />
          </a>
        ) : (
          <div className={`p-2 rounded-xl ${isPdf ? "bg-red-50 text-red-500 border-red-100" : "bg-[#f4faf8] text-[#3b6657] border-[#d0e6df]/40"} border shrink-0 flex items-center justify-center`}>
            <FileText className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-[#1c2725] text-xs font-bold leading-none mb-1">{file.name}</div>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="text-[10px] text-[#7a928e] font-semibold">{formatFileSize(file.size)}</span>
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
              >
                <Eye className="w-3 h-3" /> View Document <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      </div>
      {showDelete && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer border-none flex items-center justify-center"
          title="Remove File"
        >
          <Trash2 className="w-4 h-4" />
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
const UploadCard = ({ title, helper, files, onAddFiles, onRemoveFile, accent = "blue", accept = "image/*,.pdf", icon, loading = false, allowDelete = true, isFieldOfficer = false, isSubmitted = false }) => {
  const styles = ACCENT_STYLES[accent] || ACCENT_STYLES.blue;
  const [isDragging, setIsDragging] = useState(false);

  // accent → CTA button color
  const btnColorMap = {
    purple:  { bg: "#7c3aed", hover: "#6d28d9" },
    blue:    { bg: "#2563eb", hover: "#1d4ed8" },
    emerald: { bg: "#059669", hover: "#047857" },
    rose:    { bg: "#e11d48", hover: "#be123c" },
    amber:   { bg: "#d97706", hover: "#b45309" },
    indigo:  { bg: "#4f46e5", hover: "#4338ca" },
    slate:   { bg: "#475569", hover: "#334155" },
  };
  const btnColor = btnColorMap[accent] || btnColorMap.blue;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (loading || isSubmitted) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(e.dataTransfer.files);
    }
  };

  // ── Field Officer view stays unchanged ──
  if (isFieldOfficer) {
    return (
      <div className="rounded-[24px] border border-[#d0e6df] bg-white shadow-sm p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="mb-4">
            <div className="text-sm font-extrabold text-[#1c2725] flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">{icon}</span>
              <span>{title}</span>
            </div>
            <div className="mt-2 text-[11px] text-[#5c706c] font-semibold leading-relaxed">{helper}</div>
          </div>
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-3 sm:px-4 py-6 sm:py-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
              <span className="text-[11.5px] font-bold text-slate-500">Case Submitted - Upload Closed</span>
            </div>
          ) : (
            <>
              <label 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center cursor-pointer rounded-[20px] border border-dashed px-3 sm:px-4 py-6 sm:py-8 text-center transition-all duration-200 group ${
                  isDragging 
                    ? "border-[#3b6657] bg-[#eef7f4]/80 shadow-md scale-[1.01]" 
                    : "border-[#d0e6df] bg-[#f4faf8]/35 hover:bg-[#eef7f4]/60 hover:border-[#3b6657]"
                }`}
              >
                {loading ? (
                  <Loader2 className="w-10 h-10 text-[#3b6657] mb-2.5 animate-spin" />
                ) : (
                  <FileUp className="w-10 h-10 text-[#7a928e] group-hover:text-[#3b6657] mb-2.5 transition-all duration-300 group-hover:scale-110" />
                )}
                <span className="text-[11.5px] font-semibold text-[#5c706c] mb-1">
                  {loading ? "Uploading files, please wait..." : (
                    <>Drag and Drop file here or <span className="text-[#3b6657] font-extrabold underline decoration-2 cursor-pointer hover:text-[#1c2725] transition-all">Choose here</span></>
                  )}
                </span>
                <input type="file" multiple disabled={loading} accept={accept} className="hidden" onChange={(e) => { onAddFiles(e.target.files); e.target.value = ""; }} />
              </label>
              <div className="flex flex-wrap justify-between items-center gap-y-1 gap-x-2 text-[9px] text-[#7a928e] font-extrabold uppercase mt-2.5 px-1 tracking-wider">
                <span>Supported formats: Images, PDF</span>
                <span>Maximum size: 20 MB</span>
              </div>
            </>
          )}
        </div>
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <FileChip key={`${file.name}-${index}`} file={file} showDelete={!isSubmitted && allowDelete} onRemove={() => onRemoveFile(index)} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Admin / SuperAdmin — premium redesign ──
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 20,
      border: "1px solid #e8eaed",
      boxShadow: "0 1px 6px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: 0,
      transition: "box-shadow 0.2s ease, transform 0.2s ease",
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}
    >
      {/* Card Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 30, height: 30, borderRadius: 10,
            background: "#f8f9fa", border: "1px solid #eee",
            flexShrink: 0,
          }}>{icon}</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.01em" }}>{title}</span>
        </div>
        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, lineHeight: 1.5, paddingLeft: 38 }}>{helper}</div>
      </div>

      {/* Drop Zone */}
      <label 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          border: isDragging ? `2px dashed ${btnColor.bg}` : "1.5px dashed #d1d5db",
          borderRadius: 14,
          padding: "28px 16px",
          cursor: loading ? "not-allowed" : "pointer",
          background: isDragging ? "#f5f5ff" : "#fafafa",
          transition: "border-color 0.2s ease, background 0.2s ease",
          textAlign: "center",
          position: "relative",
          minHeight: 130,
        }}
        onMouseEnter={e => { if (!loading && !isDragging) { e.currentTarget.style.borderColor = btnColor.bg; e.currentTarget.style.background = "#f5f5ff"; }}}
        onMouseLeave={e => { if (!loading && !isDragging) { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "#fafafa"; }}}
      >
        {/* Upload Icon — Document with arrow */}
        {loading ? (
          <Loader2 style={{ width: 36, height: 36, color: btnColor.bg, marginBottom: 10, animation: "spin 1s linear infinite" }} />
        ) : (
          <div style={{ position: "relative", width: 44, height: 44, marginBottom: 10 }}>
            {/* Document body */}
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="4" width="24" height="32" rx="4" fill="#f0f4ff" stroke="#c7d2fe" strokeWidth="1.5"/>
              <path d="M22 4v8h8" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M12 18h12M12 22h10M12 26h8" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round"/>
              {/* Upload arrow */}
              <circle cx="33" cy="33" r="9" fill={btnColor.bg}/>
              <path d="M33 37v-8M30 32l3-3 3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
          {loading ? "Uploading, please wait…" : (
            <>
              Drag and Drop file here or{" "}
              <span style={{ color: btnColor.bg, fontWeight: 800, textDecoration: "underline", cursor: "pointer" }}>
                Choose here
              </span>
            </>
          )}
        </div>
        <input
          type="file" multiple disabled={loading} accept={accept} style={{ display: "none" }}
          onChange={e => { onAddFiles(e.target.files); e.target.value = ""; }}
        />
      </label>

      {/* Meta row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, marginBottom: files.length > 0 ? 14 : 0, paddingInline: 2 }}>
        <span style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Supported: Images, PDF
        </span>
        <span style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Max size: 20 MB
        </span>
      </div>

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {files.map((file, index) => {
            const isPdf = file.name?.toLowerCase().endsWith(".pdf");
            return (
              <div key={`${file.name}-${index}`} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#fafafa", border: "1px solid #e5e7eb",
                borderRadius: 12, padding: "10px 12px",
                transition: "border-color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#c7d2fe"; e.currentTarget.style.background = "#f5f5ff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; }}
              >
                {/* File icon */}
                <div style={{
                  width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isPdf ? "#fff1f2" : "#eff6ff",
                  border: `1px solid ${isPdf ? "#fecdd3" : "#bfdbfe"}`,
                }}>
                  <FileText style={{ width: 16, height: 16, color: isPdf ? "#e11d48" : "#3b82f6" }} />
                </div>
                {/* Name + status */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1f2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {file.name || `file_${index + 1}`}
                  </div>
                  <div style={{ fontSize: 10, color: "#10b981", fontWeight: 700, marginTop: 1 }}>
                    Uploaded • 100%
                  </div>
                </div>
                {/* Delete */}
                {allowDelete && onRemoveFile && (
                  <button
                    type="button"
                    onClick={() => onRemoveFile(index)}
                    title="Remove file"
                    style={{
                      flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "transparent", border: "1px solid #e5e7eb",
                      cursor: "pointer", color: "#9ca3af", transition: "all 0.15s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.borderColor = "#fecdd3"; e.currentTarget.style.color = "#e11d48"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#9ca3af"; }}
                  >
                    <Trash2 style={{ width: 13, height: 13 }} />
                  </button>
                )}
              </div>
            );
          })}
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
  fetchData,
  onUploadingChange,
  isSubmitted = false
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

  const [isExpanded, setIsExpanded]               = useState(false);
  const [uploadingCategory, setUploadingCategory] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { doc, animating }

  useEffect(() => {
    const isUploading = uploadingAts || Object.values(uploadingCategory).some(Boolean);
    if (typeof onUploadingChange === "function") {
      onUploadingChange(isUploading);
    }
  }, [uploadingAts, uploadingCategory, onUploadingChange]);

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

  console.log("AdvancedAutoFillForm render props:", {
    caseId,
    propGpsFiles,
    propFieldFormFiles,
    propImageUrls,
    isFieldOfficer,
    isSubmitted
  });

  useEffect(() => {
    setAtsDocsList(normalizeDocumentsList(propAtsDocuments));
  }, [propAtsDocuments]);

  useEffect(() => {
    if (!uploadingCategory["siteVisitPhotos"]) {
      setUploadedPhotoUrls(propImageUrls || []);
    }
  }, [propImageUrls, uploadingCategory]);

  useEffect(() => {
    if (!uploadingCategory["siteVisitVideo"]) {
      setUploadedVideoUrls(propSiteVisitVideo || []);
    }
  }, [propSiteVisitVideo, uploadingCategory]);

  useEffect(() => {
    if (!uploadingCategory["gpsFiles"]) {
      setUploadedGpsUrls(propGpsFiles || []);
    }
  }, [propGpsFiles, uploadingCategory]);

  useEffect(() => {
    if (!uploadingCategory["emailFiles"]) {
      setUploadedEmailUrls(propEmailFiles || []);
    }
  }, [propEmailFiles, uploadingCategory]);

  useEffect(() => {
    if (!uploadingCategory["fieldFormFiles"]) {
      setUploadedFieldFormUrls(propFieldFormFiles || []);
    }
  }, [propFieldFormFiles, uploadingCategory]);

  useEffect(() => {
    if (!uploadingCategory["additionalFiles"]) {
      setUploadedAdditionalUrls(propAdditionalFiles || []);
    }
  }, [propAdditionalFiles, uploadingCategory]);

  // Fetch ALL document fields from DB using authenticated axiosInstance (plain fetch() has no auth and returns 401)
  useEffect(() => {
    if (!caseId) return;
    axiosInstance.get(`/case/${caseId}`)
      .then((res) => {
        const resData = res.data;
        if (!resData) return;

        // ATS docs
        if (!propAtsDocuments || propAtsDocuments.length === 0) {
          const rawAts = resData.atsDocuments && resData.atsDocuments.length > 0
            ? resData.atsDocuments
            : (resData.AttachDocuments || []);
          setAtsDocsList(normalizeDocumentsList(rawAts));
        }
        // Site visit videos
        if ((!propSiteVisitVideo || propSiteVisitVideo.length === 0) && Array.isArray(resData.siteVisitVideo)) {
          setUploadedVideoUrls(resData.siteVisitVideo);
        }
        // GPS screenshots
        if ((!propGpsFiles || propGpsFiles.length === 0) && Array.isArray(resData.gpsFiles)) {
          setUploadedGpsUrls(resData.gpsFiles);
        }
        // Email / MIS screenshots
        if ((!propEmailFiles || propEmailFiles.length === 0) && Array.isArray(resData.emailFiles)) {
          setUploadedEmailUrls(resData.emailFiles);
        }
        // Field visit form
        if ((!propFieldFormFiles || propFieldFormFiles.length === 0) && Array.isArray(resData.fieldFormFiles)) {
          setUploadedFieldFormUrls(resData.fieldFormFiles);
        }
        // Additional files
        if ((!propAdditionalFiles || propAdditionalFiles.length === 0) && Array.isArray(resData.additionalFiles)) {
          setUploadedAdditionalUrls(resData.additionalFiles);
        }
        // Site photos (ICICI = sitePhotographs, Bajaj = otherImages, others = imageUrls)
        const bankLower = (propBankName || "").toLowerCase();
        const photoField = bankLower.includes("icici") ? "sitePhotographs" : bankLower.includes("bajaj") ? "otherImages" : "imageUrls";
        if ((!propImageUrls || propImageUrls.length === 0) && Array.isArray(resData[photoField])) {
          setUploadedPhotoUrls(resData[photoField]);
        }
      })
      .catch((err) => console.error("Error fetching case documents:", err));
  }, [caseId]);

  const handleGenericFileUpload = async (categoryKey, incomingFiles) => {
    const files = Array.from(incomingFiles || []);
    if (!files.length) return;

    setUploadingCategory((prev) => ({ ...prev, [categoryKey]: true }));
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const uploadRes = await fetch(`${CPANEL}/api/uploads`, {
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
          const res = await fetch(`${CPANEL}/api/uploads/upload-category-document`, {
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
    // Optimistically update local UI state immediately
    if (categoryKey === "gpsFiles") {
      setUploadedGpsUrls((prev) => prev.filter((f) => f.fileId !== docToRemove.fileId && f.url !== docToRemove.url));
    } else if (categoryKey === "emailFiles") {
      setUploadedEmailUrls((prev) => prev.filter((f) => f.fileId !== docToRemove.fileId && f.url !== docToRemove.url));
    } else if (categoryKey === "fieldFormFiles") {
      setUploadedFieldFormUrls((prev) => prev.filter((f) => f.fileId !== docToRemove.fileId && f.url !== docToRemove.url));
    } else if (categoryKey === "additionalFiles") {
      setUploadedAdditionalUrls((prev) => prev.filter((f) => f.fileId !== docToRemove.fileId && f.url !== docToRemove.url));
    } else if (categoryKey === "siteVisitVideo") {
      setUploadedVideoUrls((prev) => prev.filter((f) => f.fileId !== docToRemove.fileId && f.url !== docToRemove.url));
    } else if (categoryKey === "siteVisitPhotos") {
      setUploadedPhotoUrls((prev) => prev.filter((f) => f.fileId !== docToRemove.fileId && f.url !== docToRemove.url));
    }

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

        const res = await fetch(`${CPANEL}/api/uploads/remove-category-document`, {
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
          await fetch(`${CPANEL}/api/remove/delete-file`, {
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

        const res = await fetch(`${CPANEL}/api/case/remove-image/${caseId}`, {
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
          await fetch(`${CPANEL}/api/remove/delete-file`, {
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
      const uploadRes = await fetch(`${CPANEL}/api/uploads`, {
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
          const res = await fetch(`${CPANEL}/api/uploads/upload-ats-document`, {
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

  // ── Delete with confirmation ───────────────────────────────────────────────
  const requestAtsDelete = (docOrIndex) => {
    // UploadCard passes index for generic files, but ATS passes doc object
    const doc = typeof docOrIndex === "number" ? atsDocsList[docOrIndex] : docOrIndex;
    if (!doc) return;
    setDeleteConfirm({ doc, animating: true });
    setTimeout(() => setDeleteConfirm((prev) => prev ? { ...prev, animating: false } : null), 10);
  };

  const handleAtsDelete = async (docToDelete) => {
    // Optimistically update local UI state immediately
    setAtsDocsList((prev) => prev.filter((doc) => doc.fileId !== docToDelete.fileId && doc.url !== docToDelete.url));
    setFilesByCategory((prev) => ({
      ...prev,
      atsFiles: prev.atsFiles.filter((f) => f.name !== docToDelete.name),
    }));

    try {
      if (caseId) {
        const res = await fetch(`${CPANEL}/api/uploads/remove-ats-document`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseId, document: docToDelete }),
        });
        const resData = await res.json();
        if (!resData.success) {
          throw new Error(resData.error || "Failed to remove document");
        }
        if (fetchData) {
          await fetchData();
        }
        message.success("Property paper removed successfully!");
      } else {
        if (docToDelete.fileId) {
          await fetch(`${CPANEL}/api/remove/delete-file`, {
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
    // Optimistically update local UI state immediately
    setUploadedPhotoUrls((prev) => prev.filter((photo) => photo.fileId !== photoToDelete.fileId && photo.url !== photoToDelete.url));

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

if (typeof setFormDataDirect === "function") {
        setFormDataDirect((prev) => {
          const next = { ...(prev || {}), ...finalData };
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
        setEditDataDirect((prev) => ({ ...(prev || {}), ...finalData }));
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
    <>
    <div className={`w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 ${isFieldOfficer ? "bg-white p-4 sm:p-6 shadow-sm" : "bg-gradient-to-br from-indigo-50/20 via-white to-blue-50/15 p-4 sm:p-6 shadow-md relative backdrop-blur-md"}`}>
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

      {/* Header Panel with Expand / Collapse Toggle */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isExpanded ? "border-b border-slate-150/70 pb-4 mb-6" : ""}`}>
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl text-white shadow-md flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>AI Advanced Auto Fill</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white border border-slate-200 text-slate-700 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {user?.role === "SuperAdmin" ? "Super Admin Mode" : user?.role === "Admin" ? "Admin Mode" : user?.role === "Coordinator" ? "Coordinator Mode" : `${user?.role || "Guest"} Mode`}
              </span>
              {!isExpanded && (uploadedGpsUrls.length + atsDocsList.length + uploadedFieldFormUrls.length + uploadedPhotoUrls.length + uploadedVideoUrls.length + uploadedEmailUrls.length > 0) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 border border-indigo-200 text-indigo-700">
                  📎 {uploadedGpsUrls.length + atsDocsList.length + uploadedFieldFormUrls.length + uploadedPhotoUrls.length + uploadedVideoUrls.length + uploadedEmailUrls.length} Files Attached
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-500 font-semibold leading-relaxed">
              Upload site media and property documents to auto-populate files using intelligent Claude AI extraction.
            </div>
          </div>
        </div>

        {/* Toggle Button on Right */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm ${
              isExpanded
                ? "bg-white hover:bg-slate-50 text-slate-700 border border-slate-250 shadow-slate-100 hover:border-slate-350"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white border-none shadow-indigo-200 hover:shadow-md hover:scale-[1.02]"
            }`}
          >
            {isExpanded ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                <span>Hide AI Auto Fill</span>
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-pulse" />
                <span>Show / Unhide AI Auto Fill</span>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-200" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Form Body */}
      {isExpanded && (
        <>
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
          isSubmitted={isSubmitted}
        />

        {/* Card 2: ATS / Sale Deed / Legal Docs (Show for Admin/SuperAdmin only) */}
        {!isFieldOfficer && (
          <UploadCard
            title="ATS / Sale Deed / Legal Docs"
            helper="Sale deed, gift deed, registry, allotment letter, patta legal papers"
            files={atsDocsList}
            onAddFiles={handleAtsUpload}
            onRemoveFile={requestAtsDelete}
            accent="amber"
            loading={uploadingAts}
            icon={<FileText className="w-4 h-4 text-amber-600" />}
            allowDelete={!isFieldOfficer}
            isFieldOfficer={isFieldOfficer}
            isSubmitted={isSubmitted}
          />
        )}

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
            isSubmitted={isSubmitted}
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
          isSubmitted={isSubmitted}
        />

        {/* Card 5: Additional Photos / Docs — HIDDEN */}
        {/* {!isFieldOfficer && (
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
            isSubmitted={isSubmitted}
          />
        )} */}

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
          isSubmitted={isSubmitted}
        />

        {/* Card 7: Site Visit Video */}
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
          isSubmitted={isSubmitted}
        />
      </div>

      {/* ── Uploaded Documents Preview Panel — visible to ALL roles ──────── */}
      {(() => {
        const totalFoFiles = uploadedGpsUrls.length + atsDocsList.length + uploadedFieldFormUrls.length + uploadedPhotoUrls.length + uploadedVideoUrls.length;
        if (totalFoFiles === 0) return null;
        return (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Panel Header - always visible */}
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
              <div className="p-1.5 bg-emerald-50 rounded-xl text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-800">📎 Uploaded Documents & Media</div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {totalFoFiles} file(s) uploaded by Field Officer — GPS, Property Papers, Site Photos & More
                </div>
              </div>
              <span className="ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100">
                {totalFoFiles} Files
              </span>
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
                        <div className="flex items-center gap-2 min-w-0 flex-1">
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
                          {!isSubmitted && (
                            <button type="button" onClick={() => handleGenericFileRemove("gpsFiles", doc)}
                              className="rounded-lg p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 transition-colors cursor-pointer" title="Delete file">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
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
                        <div className="flex items-center gap-2 min-w-0 flex-1">
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
                          {!isSubmitted && (
                            <button type="button" onClick={() => handleAtsDelete(doc)}
                              className="rounded-lg p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 transition-colors cursor-pointer" title="Delete file">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
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
                        <div className="flex items-center gap-2 min-w-0 flex-1">
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
                          {!isSubmitted && (
                            <button type="button" onClick={() => handleGenericFileRemove("fieldFormFiles", doc)}
                              className="rounded-lg p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 transition-colors cursor-pointer" title="Delete file">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
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
                        {!isSubmitted && (
                          <button type="button" onClick={() => handlePhotoDelete(photo)}
                            className="mt-1 w-full rounded-lg bg-red-50 hover:bg-red-100 text-red-500 py-1 text-[10px] font-bold cursor-pointer border-none flex items-center justify-center gap-1">
                            <Trash2 className="w-2.5 h-2.5" /> Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Site Visit Videos */}
              {uploadedVideoUrls.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-extrabold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    <span>Site Visit Videos ({uploadedVideoUrls.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {uploadedVideoUrls.map((video, index) => (
                      <div key={index} className="flex items-center justify-between gap-3 rounded-xl border border-rose-100 bg-rose-50/30 px-3 py-2.5">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-150 text-rose-650">
                            <Video className="w-4 h-4" />
                          </div>
                          <span className="truncate text-xs font-bold text-slate-700">{video.name || `video_${index + 1}`}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a href={video.url} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] text-indigo-650 hover:underline font-bold flex items-center gap-0.5 border-none cursor-pointer">
                            Play <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          {!isSubmitted && (
                            <button type="button" onClick={() => handleVideoDelete(video)}
                              className="rounded-lg p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 transition-colors cursor-pointer" title="Delete video">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
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
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-100/50 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                <Video className="w-3 h-3" /> Video: {uploadedVideoUrls.length}
              </span>
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
      {(sourceSummary || 
        auditNotes.length > 0 || 
        uploadedPhotoUrls.length > 0 || 
        uploadedVideoUrls.length > 0 || 
        atsDocsList.length > 0 || 
        uploadedGpsUrls.length > 0 || 
        uploadedEmailUrls.length > 0 || 
        uploadedFieldFormUrls.length > 0 || 
        uploadedAdditionalUrls.length > 0) && (
        <div className="w-full max-w-full overflow-hidden mt-6 rounded-3xl border border-slate-200 bg-white/95 p-4 sm:p-5.5 shadow-md space-y-5.5 relative">
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
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
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
                        onClick={() => requestAtsDelete(doc)}
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
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
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
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
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

          {/* Uploaded ImageKit video URLs */}
          {uploadedVideoUrls.length > 0 && (
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
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
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
        </>
      )}
    </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div
          style={{
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,0.65)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 99999,
            padding: 20,
            animation: "ats-overlay-in 0.2s ease-out",
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "32px 28px 24px",
              maxWidth: 400,
              width: "100%",
              boxShadow: "0 30px 60px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)",
              transform: deleteConfirm.animating ? "scale(0.85) translateY(24px)" : "scale(1) translateY(0)",
              opacity: deleteConfirm.animating ? 0 : 1,
              transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated warning icon */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                border: "3px solid #f59e0b",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "ats-pulse 1.5s ease-in-out infinite",
              }}>
                <svg width="32" height="32" fill="none" stroke="#d97706" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
              Delete This Document?
            </h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 6px", lineHeight: 1.5 }}>
              Aap sure hain ki yeh document delete karna chahte hain?
            </p>
            <div style={{
              background: "#fef9ec",
              border: "1px solid #fde68a",
              borderRadius: 10,
              padding: "10px 14px",
              margin: "12px 0 24px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <svg width="16" height="16" fill="none" stroke="#b45309" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#92400e", wordBreak: "break-all", textAlign: "left" }}>
                {deleteConfirm.doc?.name || "Document"}
              </span>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, padding: "12px 0",
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 12,
                  fontSize: 14, fontWeight: 700, color: "#475569",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseOver={e => e.currentTarget.style.background = "#f1f5f9"}
                onMouseOut={e => e.currentTarget.style.background = "#f8fafc"}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const doc = deleteConfirm.doc;
                  setDeleteConfirm(null);
                  await handleAtsDelete(doc);
                }}
                style={{
                  flex: 1, padding: "12px 0",
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 14, fontWeight: 700, color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(239,68,68,0.35)",
                  transition: "all 0.15s ease",
                }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(239,68,68,0.45)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(239,68,68,0.35)"; }}
              >
                🗑️ Haan, Delete Karo
              </button>
            </div>
          </div>

          <style>{`
            @keyframes ats-overlay-in {
              from { opacity: 0; } to { opacity: 1; }
            }
            @keyframes ats-pulse {
              0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
              50% { transform: scale(1.06); box-shadow: 0 0 0 10px rgba(245,158,11,0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default AdvancedAutoFillForm;

