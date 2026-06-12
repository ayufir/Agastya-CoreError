// IciciBank.jsx
import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createIciciBank,
  getIciciBankById,
  updateIciciBank,
  submitIciciBank,
} from "../../../redux/features/Banks/IciciBank/iciciBankThunk";
import { finalUpdate } from "../../../redux/features/case/caseThunks";

import PropertyDetailsForm from "../../Bank-Details/ICICI/PropertyDetailsForm";
import MaintenanceBoundariesForm from "../../Bank-Details/ICICI/MaintenanceBoundariesForm";
import AmenitiesForm from "../../Bank-Details/ICICI/AmenitiesForm";
import CautionAreaForm from "../../Bank-Details/ICICI/CautionAreaForm";
import RealizableValueForm from "../../Bank-Details/ICICI/RealizableValueForm";
import ConstructionProgressForm from "../../Bank-Details/ICICI/ConstructionProgressForm";
import DistanceRangeForm from "../../Bank-Details/ICICI/DistanceRangeForm";
import SitePhotographsForm from "../../Bank-Details/ICICI/SitePhotographsForm";
import RemarksForm from "../../Bank-Details/ICICI/RemarksForm";
import AutoFillForm from "../../AutoFillForm";
import AdvancedAutoFillForm from "../../../components/AdvancedAutoFillForm";
import { createAutoFillAdapter } from "../../../utils/Autofilladapter";
import { ICICI_MAPPING } from "../../../config/Bankfieldmappings";

import toast from "react-hot-toast";

const Icon = ({ children }) => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const cardIcons = {
  propertyDetails: (
    <Icon>
      <path d="M12 30 L32 14 L52 30" />
      <path d="M18 28 V52 H46 V28" />
      <path d="M27 52 V38 H37 V52" />
      <rect x="8" y="22" width="10" height="30" rx="1" />
      <path d="M8 22 L18 14 L18 22" />
    </Icon>
  ),

  maintenanceBoundaries: (
    <Icon>
      <path d="M10 22 H54" />
      <path d="M10 34 H54" />
      <path d="M10 46 H54" />
      <path d="M18 14 V22" />
      <path d="M32 14 V22" />
      <path d="M46 14 V22" />
      <path d="M24 22 V34" />
      <path d="M40 22 V34" />
      <path d="M16 34 V46" />
      <path d="M32 34 V46" />
      <path d="M48 34 V46" />
    </Icon>
  ),

  amenities: (
    <Icon>
      <circle cx="20" cy="26" r="7" />
      <circle cx="44" cy="26" r="7" />
      <circle cx="32" cy="18" r="7" />
      <path d="M20 33 V42" />
      <path d="M32 25 V42" />
      <path d="M44 33 V42" />
      <path d="M24 48 H40" />
      <path d="M32 42 V48" />
    </Icon>
  ),

  cautionArea: (
    <Icon>
      <rect x="20" y="10" width="24" height="42" rx="3" />
      <path d="M32 18 L42 36 H22 Z" />
      <path d="M32 25 V31" />
      <path d="M32 35 H32.1" />
      <path d="M16 16 H12 V46 H16" />
    </Icon>
  ),

  realizableValue: (
    <Icon>
      <path d="M14 42 H50" />
      <path d="M18 42 V28 L32 18 L46 28 V42" />
      <path d="M27 42 V32 H37 V42" />
      <circle cx="32" cy="15" r="8" />
      <path d="M29 12 H36" />
      <path d="M29 16 H35" />
      <path d="M33 12 C37 15 33 20 29 16" />
      <path d="M12 18 L14 15" />
      <path d="M50 18 L52 15" />
      <path d="M18 10 L20 7" />
      <path d="M44 10 L46 7" />
    </Icon>
  ),

  constructionProgress: (
    <Icon>
      <path d="M10 26 H42" />
      <path d="M10 38 H48" />
      <path d="M16 14 V26" />
      <path d="M30 14 V26" />
      <path d="M22 26 V38" />
      <path d="M38 26 V38" />
      <path d="M14 38 V50" />
      <path d="M32 38 V50" />
      <path d="M48 38 V50" />
      <path d="M42 18 L54 10" />
      <path d="M46 16 L52 24" />
    </Icon>
  ),

  distanceRange: (
    <Icon>
      <path d="M24 30 C24 20 16 16 12 24 C8 32 24 48 24 48 C24 48 40 32 36 24 C32 16 24 20 24 30Z" />
      <path d="M44 30 C44 22 38 18 34 24 C31 31 44 44 44 44 C44 44 57 31 54 24 C51 18 44 22 44 30Z" />
      <circle cx="24" cy="28" r="3" />
      <circle cx="44" cy="28" r="3" />
    </Icon>
  ),

  sitePhotographs: (
    <Icon>
      <rect x="18" y="16" width="34" height="28" rx="3" />
      <rect x="12" y="22" width="34" height="28" rx="3" />
      <circle cx="24" cy="31" r="3" />
      <path d="M16 46 L28 36 L36 43 L42 38 L50 46" />
    </Icon>
  ),

  remarks: (
    <Icon>
      <rect x="18" y="12" width="30" height="40" rx="3" />
      <path d="M25 22 H40" />
      <path d="M25 30 H40" />
      <path d="M25 38 H34" />
      <circle cx="43" cy="41" r="7" />
      <path d="M43 37 V41 L46 44" />
    </Icon>
  ),
};

const cardList = [
  { key: "propertyDetails", label: "Property Details", icon: cardIcons.propertyDetails },
  { key: "maintenanceBoundaries", label: "Maintenance & Boundaries", icon: cardIcons.maintenanceBoundaries },
  { key: "amenities", label: "Amenities", icon: cardIcons.amenities },
  { key: "cautionArea", label: "Caution Area", icon: cardIcons.cautionArea },
  { key: "realizableValue", label: "Realizable value", icon: cardIcons.realizableValue },
  { key: "constructionProgress", label: "Construction Progress Details", icon: cardIcons.constructionProgress },
  { key: "distanceRange", label: "Distance Range of The Project", icon: cardIcons.distanceRange },
  { key: "sitePhotographs", label: "Site Photographs", icon: cardIcons.sitePhotographs },
  { key: "remarks", label: "Remarks", icon: cardIcons.remarks },
];

const getDraftKey = (id) => `icici-bank-draft:${id || "new"}`;

const sanitizeForSave = (value) => {
  if (value == null) return value;
  if (value && typeof value === "object" && value.size !== undefined && typeof value.slice === "function") {
    return {
      name: value.name,
      size: value.size,
      type: value.type,
      lastModified: value.lastModified,
    };
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeForSave).filter((item) => item !== undefined);
  }
  if (typeof value !== "object") return value;

  const next = {};
  Object.entries(value).forEach(([key, item]) => {
    if (["originFileObj", "xhr", "preview"].includes(key)) return;
    const clean = sanitizeForSave(item);
    if (clean !== undefined) next[key] = clean;
  });
  return next;
};

const readDraft = (id) => {
  try {
    const raw = localStorage.getItem(getDraftKey(id));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeDraft = (id, data) => {
  try {
    localStorage.setItem(getDraftKey(id), JSON.stringify(sanitizeForSave(data)));
  } catch (error) {
    console.error("Draft save failed:", error);
  }
};

const ComingSoonForm = ({ title }) => (
  <div className="min-h-[300px] flex items-center justify-center text-gray-500 text-lg">
    {title} form abhi connect nahi hai
  </div>
);

const CardStatusIcon = ({ done }) => {
  if (done) {
    return (
      <span className="absolute md:top-[6px] md:right-[7px] right-4 w-[16px] h-[16px] rounded-full bg-[#67c915] text-white text-[12px] leading-[16px] font-bold flex items-center justify-center">
        ✓
      </span>
    );
  }

  return (
    <span className="absolute md:top-[6px] md:right-[7px] right-4 text-[#f59e0b] text-[18px] leading-none">
      △
    </span>
  );
};

const IciciBank = () => {
  const [activeCard, setActiveCard] = useState("propertyDetails");
  const [formData, setFormData] = useState({});
  const [editData, setEditData] = useState(null);
  const [extractedData, setExtractedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMobileSteps, setShowMobileSteps] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (id) {
      fetchEditData();
    } else {
      const draft = readDraft(id);
      setFormData(draft);
      setEditData(draft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchEditData = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getIciciBankById(id)).unwrap();
      const merged = { ...response, ...readDraft(id) };
      setEditData(merged);
      setFormData(merged);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = createAutoFillAdapter(
    ICICI_MAPPING,
    (mappedData, rawExtractedData) => {
      setExtractedData(mappedData);
      setFormData((prev) => {
        const next = { ...prev, ...mappedData };
        writeDraft(id, next);
        return next;
      });
      setEditData((prev) => ({ ...prev, ...mappedData }));
      toast.success("AI Data Extracted and Mapped Successfully!");
    }
  );

  const fileToBase64 = (file) => new Promise((resolve) => {
    // Only compress images, let other files pass through normal FileReader
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // compress to 0.7 quality jpeg
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  const prepareFormDataForServer = async (dataObj) => {
    const cleanState = { ...dataObj };

    if (cleanState.sitePhotographs && Array.isArray(cleanState.sitePhotographs)) {
      const photosWithBase64 = [];
      for (const photo of cleanState.sitePhotographs) {
        let actualFile = photo;
        if (photo && photo.originFileObj) {
          actualFile = photo.originFileObj;
        }

        if (actualFile && typeof actualFile === "object" && actualFile.size !== undefined && typeof actualFile.slice === "function") {
          const base64 = await fileToBase64(actualFile);
          photosWithBase64.push({ name: actualFile.name, type: actualFile.type, size: actualFile.size, base64, url: base64, uid: photo.uid || `rc-upload-${Date.now()}` });
        } else {
           photosWithBase64.push(photo);
        }
      }
      cleanState.sitePhotographs = photosWithBase64;
    }

    if (cleanState.images && Array.isArray(cleanState.images)) {
      const photosWithBase64 = [];
      for (const photo of cleanState.images) {
        let actualFile = photo;
        if (photo && photo.file) {
          actualFile = photo.file;
        }

        if (actualFile && typeof actualFile === "object" && actualFile.size !== undefined && typeof actualFile.slice === "function") {
          const base64 = await fileToBase64(actualFile);
          photosWithBase64.push({ 
            id: photo.id || Date.now() + Math.random(),
            name: photo.name || actualFile.name, 
            longitude: photo.longitude || "",
            latitude: photo.latitude || "",
            previewUrl: base64,
            base64 
          });
        } else {
           photosWithBase64.push(photo);
        }
      }
      cleanState.images = photosWithBase64;
    }

    const fileFields = ['doorPhotoFile', 'societyRegisteredFile', 'eastPhoto', 'westPhoto', 'northPhoto', 'southPhoto', 'sketchPhoto', 'leakageCracksPhoto'];
    for (const field of fileFields) {
      let actualFile = cleanState[field];
      if (actualFile && actualFile.originFileObj) {
        actualFile = actualFile.originFileObj;
      }
      if (actualFile && typeof actualFile === "object" && actualFile.size !== undefined && typeof actualFile.slice === "function") {
         const base64 = await fileToBase64(actualFile);
         cleanState[field] = { name: actualFile.name, type: actualFile.type, size: actualFile.size, base64, url: base64, uid: actualFile.uid || `rc-upload-${Date.now()}` };
      }
    }
    return cleanState;
  };

  const handleSave = async (cardKey, data) => {
    setSaving(true);
    try {
      const rawCombined = { ...formData, ...data };
      const payloadWithFiles = await prepareFormDataForServer(rawCombined);
      const updated = sanitizeForSave(payloadWithFiles);
      
      setFormData(updated);
      setEditData(updated);
      writeDraft(id, updated);

      if (id) {
        await dispatch(updateIciciBank({ id, formData: updated })).unwrap();
        await fetchEditData();
      }
      toast.success("Data saved successfully");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndNext = async (cardKey, data) => {
    setSaving(true);
    try {
      const rawCombined = { ...formData, ...data };
      const payloadWithFiles = await prepareFormDataForServer(rawCombined);
      const updated = sanitizeForSave(payloadWithFiles);
      
      setFormData(updated);
      setEditData(updated);
      writeDraft(id, updated);

      if (id) {
        await dispatch(updateIciciBank({ id, formData: updated })).unwrap();
        await fetchEditData();
      } else {
        const response = await dispatch(createIciciBank(updated)).unwrap();
        // If it's a new report, we might want to navigate to the edit URL with the new ID, 
        // but for now keeping it as original logic
      }
      toast.success("Data saved successfully");

      const currentIndex = cardList.findIndex((c) => c.key === cardKey);
      if (currentIndex < cardList.length - 1) {
        setActiveCard(cardList[currentIndex + 1].key);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    const submitData = sanitizeForSave({
      ...formData,
      ...data,
      bankName: "Icici",
      route: "icici",
      isReportSubmitted: false,
      approvalStatus: "Pending",
      status: formData?.status === "FinalSubmitted" ? "FinalSubmitted" : "Pending",
    });

    try {
      if (id) {
        await dispatch(submitIciciBank({ id, formData: submitData })).unwrap();
        writeDraft(id, submitData);
        toast.success("Report submitted successfully");
        navigate(`/bank/icici/${id}`);
      } else {
        const response = await dispatch(createIciciBank(submitData)).unwrap();
        writeDraft(response._id, submitData);
        toast.success("Report created and submitted successfully");
        navigate(`/bank/icici/${response._id}`);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error(err || "Submission failed");
    } finally {
      setSaving(false);
    }
  };

  const handleFinalSubmit = async (data) => {
    setSaving(true);
    try {
      const rawCombined = {
        ...formData,
        ...data,
        bankName: "Icici",
        route: "icici",
        isReportSubmitted: true,
        approvalStatus: "Submitted",
        status: "FinalSubmitted",
      };
      const payloadWithFiles = await prepareFormDataForServer(rawCombined);
      const finalData = sanitizeForSave(payloadWithFiles);

      if (id) {
        const response = await dispatch(
          submitIciciBank({
            id,
            formData: { ...finalData, status: "FinalSubmitted" },
          })
        ).unwrap();
        await dispatch(finalUpdate({ id, bankName: "Icici", updateData: finalData })).unwrap();
        writeDraft(id, finalData);
        toast.success("Report finalized successfully");
        navigate(`/bank/icici/${id}`);
      } else {
        const response = await dispatch(createIciciBank(finalData)).unwrap();
        await dispatch(finalUpdate({ id: response._id, bankName: "Icici", updateData: finalData })).unwrap();
        writeDraft(response._id, finalData);
        toast.success("Report created and finalized successfully");
        navigate(`/bank/icici/${response._id}`);
      }
    } catch (err) {
      console.error("Final submit failed:", err);
      toast.error("Failed to finalize report");
    } finally {
      setSaving(false);
    }
  };

  const renderForm = () => {
    const commonProps = {
      data: formData,
      editData,
      extractedData,
      onSave: handleSave,
      onSaveAndNext: handleSaveAndNext,
      saving,
    };

    switch (activeCard) {
      case "propertyDetails":
        return <PropertyDetailsForm {...commonProps} />;

      case "maintenanceBoundaries":
        return <MaintenanceBoundariesForm {...commonProps} />;

      case "amenities":
        return <AmenitiesForm {...commonProps} />;

      case "cautionArea":
        return <CautionAreaForm {...commonProps} />;

      case "realizableValue":
        return <RealizableValueForm {...commonProps} />;

      case "constructionProgress":
        return <ConstructionProgressForm {...commonProps} />;

      case "distanceRange":
        return <DistanceRangeForm {...commonProps} />;

      case "sitePhotographs":
        return <SitePhotographsForm {...commonProps} />;

      case "remarks":
        return (
          <RemarksForm
            {...commonProps}
            onSubmit={handleSubmit}
            onFinalSubmit={handleFinalSubmit}
            isAdmin={user?.role === "Admin" || user?.role === "SuperAdmin"}
          />
        );

      default:
        return (
          <ComingSoonForm
            title={cardList.find((c) => c.key === activeCard)?.label}
          />
        );
    }
  };

  const activeIndex = cardList.findIndex((c) => c.key === activeCard);
  const activeItem = cardList[activeIndex];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* APPLICATION INFO BANNER */}
      <div className="bg-[#0b1d3a] text-white py-5 shadow-sm">
        <div className="max-w-[1550px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#b21b12] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide">
                ICICI BANK
              </span>
              <h1 className="text-xl font-bold tracking-tight">
                Valuation Report Wizard
              </h1>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {id ? `Editing Case: #${id}` : "Creating New Valuation Report"} • Draft auto-saved locally
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1550px] mx-auto px-4 mt-6">
        {/* TOP COMPACT NAV (MOBILE ONLY) & GRID NAV (DESKTOP ONLY) */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6 mb-6">
          {/* Mobile view step header */}
          <div className="block md:hidden">
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-[#b21b12] h-full transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / cardList.length) * 100}%` }}
              ></div>
            </div>
            
            {/* Active Step Selector Card */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-[#b21b12] [&>svg]:w-[28px] [&>svg]:h-[28px] flex-shrink-0">
                  {activeItem?.icon}
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Step {activeIndex + 1} of {cardList.length}
                  </span>
                  <span className="text-[14px] font-bold text-[#0b1d3a] leading-tight block">
                    {activeItem?.label}
                  </span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowMobileSteps((v) => !v)}
                className="bg-red-50 hover:bg-red-100 text-[#a50000] px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors border border-red-100"
              >
                {showMobileSteps ? "Hide Steps ▴" : "Show Steps ▾"}
              </button>
            </div>
            
            {/* Collapsible Steps List */}
            {showMobileSteps && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 gap-1.5 max-h-[280px] overflow-y-auto">
                {cardList.map((card, idx) => {
                  const isActive = activeCard === card.key;
                  const isDone = idx < activeIndex;
                  return (
                    <button
                      key={card.key}
                      type="button"
                      onClick={() => {
                        setActiveCard(card.key);
                        setShowMobileSteps(false);
                      }}
                      className={`
                        flex items-center justify-between p-2.5 rounded border text-left transition-all
                        ${isActive 
                          ? "border-[#a50000] bg-red-50/10 font-semibold" 
                          : "border-gray-50 bg-gray-50/30 hover:bg-gray-50"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`[&>svg]:w-[20px] [&>svg]:h-[20px] ${isActive ? "text-[#b21b12]" : "text-[#0b1d3a]"}`}>
                          {card.icon}
                        </div>
                        <span className={`text-[13px] ${isActive ? "text-[#9b0000] font-bold" : "text-[#0b1d3a] font-medium"}`}>
                          {idx + 1}. {card.label}
                        </span>
                      </div>
                      <div className="relative w-4 h-4 flex-shrink-0 text-right">
                        {isDone ? (
                          <span className="text-[#67c915] text-[12px] font-bold">✓</span>
                        ) : isActive ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#b21b12] inline-block"></span>
                        ) : (
                          <span className="text-[#f59e0b] text-[12px]">△</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop step cards */}
          <div className="hidden md:grid md:grid-cols-9 gap-3 w-full">
            {cardList.map((card) => {
              const isActive = activeCard === card.key;
              const currentIndex = cardList.findIndex((c) => c.key === card.key);
              const isDone = currentIndex < activeIndex;

              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => setActiveCard(card.key)}
                  className={`
                    relative border rounded-[4px] bg-white cursor-pointer transition-all duration-200
                    flex flex-col items-center justify-center h-[122px] px-1
                    ${isActive ? "border-[#a50000] bg-red-50/5" : "border-[#c9c9c9] hover:bg-slate-50"}
                  `}
                >
                  <CardStatusIcon done={isDone} />

                  <div
                    className={`
                      [&>svg]:w-[44px] [&>svg]:h-[44px] flex-shrink-0
                      ${isActive ? "text-[#b21b12]" : "text-[#0b1d3a]"}
                    `}
                  >
                    {card.icon}
                  </div>

                  <div
                    className={`
                      text-[13px] leading-tight text-center px-1 flex-1 break-words mt-1
                      ${isActive ? "text-[#9b0000] font-semibold" : "text-[#00133a] font-medium"}
                    `}
                  >
                    {card.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FORM CARD CONTAINER */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-6 md:p-8 mb-10">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="text-[#0b1d3a] [&>svg]:w-[32px] [&>svg]:h-[32px] flex-shrink-0">
                  {activeItem?.icon}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#9b0000]">
                    {activeItem?.label}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">Fill in the details below</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear the entire form? All unsaved data will be lost.")) {
                      localStorage.removeItem(`icici-bank-draft:${id || "new"}`);
                      setFormData({});
                      setEditData({});
                      window.location.reload();
                    }
                  }}
                  className="bg-red-50 text-[#C40C0C] border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-100 transition-all text-xs font-bold shadow-sm"
                >
                  Clear Form
                </button>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-semibold">
                  Step {activeIndex + 1} of {cardList.length}
                </span>
              </div>
            </div>

            <div className={`mb-6 border border-blue-200 rounded-lg p-4 bg-blue-50/50 ${activeCard !== "propertyDetails" ? "hidden" : ""}`}>
              <div className="mb-4">
                <AutoFillForm setFormData={handleAutoFill} />
              </div>
              <AdvancedAutoFillForm
                bankName="ICICI"
                setFormData={handleAutoFill}
                imageUrls={editData?.sitePhotographs || editData?.imageUrls || []}
                fetchData={fetchEditData}
              />
            </div>

            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IciciBank;
