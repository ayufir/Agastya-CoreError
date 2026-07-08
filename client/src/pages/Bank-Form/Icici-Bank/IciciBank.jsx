// IciciBank.jsx
import React, { useEffect, useState, useRef } from "react";
import { Spin, Button } from "antd";
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
import CaseWorkflowActions from "../../../components/CaseWorkflowActions";
import { createAutoFillAdapter } from "../../../utils/Autofilladapter";
import { ICICI_MAPPING } from "../../../config/Bankfieldmappings";
import axiosInstance from "../../../config/axios";
import { getDisplayCustomerName, getDisplayAddress, getDisplayContact, getDisplayCity } from "../../../utils/dashboardRecord";

import toast from "react-hot-toast";
import { Download } from "lucide-react";

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
      ▲
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

  const [showAutoFill, setShowAutoFill] = useState(false);
  const [isPropertyDetailsOpen, setIsPropertyDetailsOpen] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState([]);

  const handleDownloadAll = async () => {
    const toastId = toast.loading("Fetching latest files and generating ZIP...");
    try {
      const { saveAs } = await import("file-saver");
      let freshData = formData;
      if (id) {
        try {
          const response = await dispatch(getIciciBankById(id)).unwrap();
          freshData = response;
          setFormData(response);
          setEditData(response);
        } catch (fetchErr) {
          console.warn("Could not refresh from server, using cached form:", fetchErr);
        }
      }

      const dataSource = freshData || formData || {};
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
        dataSource.sitePhotographs,
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

      const res = await axiosInstance.post("/proxy", {
        urls,
        jsonData: dataSource,
        jsonFilename: "complete_application_data.json",
      }, { responseType: "blob" });

      const clientName = (dataSource.propertyDetails?.applicantName || dataSource.propertyDetails?.propertyOwner || "Applicant").trim().replace(/[^a-zA-Z0-9]/g, "_");
      const refNo = (dataSource.propertyDetails?.loanAccountNo || id || "Case").trim().replace(/[^a-zA-Z0-9]/g, "_");
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

  const currentFormStateRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const isFieldOfficer = user?.role?.toLowerCase() === "fieldofficer";


  useEffect(() => {
    if (isFieldOfficer) {
      setShowAutoFill(true);
    }
  }, [isFieldOfficer]);
  useEffect(() => {
    if (id) {
      fetchEditData();
    } else {
      setFormData({});
      setEditData({});
      localStorage.removeItem("icici-bank-draft:new");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isFieldOfficer, navigate]);


  const fetchEditData = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getIciciBankById(id)).unwrap();
      const docName = response.customerName || response.applicantName || getDisplayCustomerName(response);
      const docContact = response.personContact || getDisplayContact(response);
      const docAddress = response.plotNo || getDisplayAddress(response);
      const docCity = response.city || response.propertyCity || getDisplayCity(response);

      const enriched = {
        ...response,
        customerName: docName !== "N/A" ? docName : response.customerName,
        applicantName: docName !== "N/A" ? docName : response.applicantName,
        personContact: docContact !== "N/A" ? docContact : response.personContact,
        plotNo: docAddress !== "N/A" ? docAddress : response.plotNo,
        city: docCity !== "N/A" ? docCity : response.city,
      };

      const draft = readDraft(id);

      // ── Never let the draft overwrite file/media fields saved directly in DB ──
      // These fields are always authoritative from the server response.
      const FILE_FIELDS = [
        "gpsFiles", "fieldFormFiles", "emailFiles", "additionalFiles",
        "sitePhotographs", "imageUrls", "otherImages",
        "siteVisitVideo", "atsDocuments", "AttachDocuments", "atsFiles",
      ];
      FILE_FIELDS.forEach((f) => { delete draft[f]; });

      const merged = { ...enriched, ...draft };
      if (enriched._id) {
        merged._id = enriched._id;
        merged.status = enriched.status;
        merged.approvalStatus = enriched.approvalStatus;
        merged.assignedTo = enriched.assignedTo;
        merged.createdBy = enriched.createdBy;
        merged.isReportSubmitted = enriched.isReportSubmitted;
        merged.customCaseId = enriched.customCaseId;
      }
      setEditData(merged);
      setFormData(merged);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (nextCardKey) => {
    if (currentFormStateRef.current) {
      const latestState = currentFormStateRef.current;
      setFormData((prev) => {
        const next = { ...prev, ...latestState };
        writeDraft(id, next);
        return next;
      });
      currentFormStateRef.current = null;
    }
    setActiveCard(nextCardKey);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAutoFill = createAutoFillAdapter(
    ICICI_MAPPING,
    async (mappedData, rawExtractedData) => {
      setExtractedData(mappedData);
      setAutoFilledFields(Object.keys(mappedData));
      
      let updatedData;
      setFormData((prev) => {
        const next = {
          ...prev,
          ...mappedData,
          sitePhotographs: mappedData.sitePhotographs
            ? [...(prev?.sitePhotographs || []), ...mappedData.sitePhotographs]
            : prev?.sitePhotographs,
          siteVisitVideo: mappedData.siteVisitVideo
            ? [...(prev?.siteVisitVideo || []), ...mappedData.siteVisitVideo]
            : prev?.siteVisitVideo,
          atsDocuments: mappedData.atsDocuments
            ? [...(prev?.atsDocuments || []), ...mappedData.atsDocuments]
            : prev?.atsDocuments,
        };
        updatedData = next;
        writeDraft(id, next);
        return next;
      });

      setEditData((prev) => {
        const next = {
          ...prev,
          ...mappedData,
          sitePhotographs: mappedData.sitePhotographs
            ? [...(prev?.sitePhotographs || []), ...mappedData.sitePhotographs]
            : prev?.sitePhotographs,
          siteVisitVideo: mappedData.siteVisitVideo
            ? [...(prev?.siteVisitVideo || []), ...mappedData.siteVisitVideo]
            : prev?.siteVisitVideo,
          atsDocuments: mappedData.atsDocuments
            ? [...(prev?.atsDocuments || []), ...mappedData.atsDocuments]
            : prev?.atsDocuments,
        };
        return next;
      });

      // Auto-save to the backend database immediately if editing an existing case
      if (id) {
        try {
          const payloadWithFiles = await prepareFormDataForServer(updatedData);
          const updated = sanitizeForSave(payloadWithFiles);
          await dispatch(updateIciciBank({ id, formData: { ...updated, isReportSubmitted: false } })).unwrap();
          await fetchEditData();
          toast.success("AI extracted data saved to database successfully!");
        } catch (saveErr) {
          console.error("Auto-save after AI failed:", saveErr);
          toast.error("Failed to auto-save AI data to database");
        }
      } else {
        toast.success("AI Data Extracted and Mapped Successfully!");
      }
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
        await dispatch(updateIciciBank({ id, formData: { ...updated, isReportSubmitted: false } })).unwrap();
        await fetchEditData();
      } else {
        const response = await dispatch(createIciciBank({ ...updated, isReportSubmitted: false })).unwrap();
        if (response?._id) {
          navigate(`/bank/icici/edit/${response._id}`);
        }
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
        await dispatch(updateIciciBank({ id, formData: { ...updated, isReportSubmitted: false } })).unwrap();
        await fetchEditData();
      } else {
        const response = await dispatch(createIciciBank({ ...updated, isReportSubmitted: false })).unwrap();
        if (response?._id) {
          navigate(`/bank/icici/edit/${response._id}`);
        }
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
      isReportSubmitted: true,
      approvalStatus: "Submitted",
      status: formData?.status === "FinalSubmitted" ? "FinalSubmitted" : "Submitted",
    });

    try {
      if (id) {
        await dispatch(submitIciciBank({ id, formData: submitData })).unwrap();
        writeDraft(id, submitData);
        toast.success("Report submitted successfully");
        if (isFieldOfficer) {
          navigate("/field/dashboard");
        } else {
          navigate(`/bank/icici/${id}`);
        }
      } else {
        const response = await dispatch(createIciciBank(submitData)).unwrap();
        writeDraft(response._id, submitData);
        toast.success("Report created and submitted successfully");
        if (isFieldOfficer) {
          navigate("/field/dashboard");
        } else {
          navigate(`/bank/icici/${response._id}`);
        }
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
      const isFO = user?.role === "FieldOfficer";
      const rawCombined = {
        ...formData,
        ...data,
        bankName: "Icici",
        route: "icici",
        isReportSubmitted: isFO ? false : true,
        approvalStatus: isFO ? "Work in Progress" : "Submitted",
        status: isFO ? "Work in Progress" : "FinalSubmitted",
      };
      const payloadWithFiles = await prepareFormDataForServer(rawCombined);
      const finalData = sanitizeForSave(payloadWithFiles);

      if (id) {
        const response = await dispatch(
          submitIciciBank({
            id,
            formData: { ...finalData, status: isFO ? "Work in Progress" : "FinalSubmitted" },
          })
        ).unwrap();
        await dispatch(finalUpdate({ id, bankName: "Icici", updateData: finalData })).unwrap();
        writeDraft(id, finalData);
        toast.success(isFO ? "Report saved successfully" : "Report finalized successfully");
        navigate(isFO ? "/field/dashboard" : `/bank/icici/${id}`);
      } else {
        const response = await dispatch(createIciciBank(finalData)).unwrap();
        await dispatch(finalUpdate({ id: response._id, bankName: "Icici", updateData: finalData })).unwrap();
        writeDraft(response._id, finalData);
        toast.success(isFO ? "Report saved successfully" : "Report created and finalized successfully");
        navigate(isFO ? "/field/dashboard" : `/bank/icici/${response._id}`);
      }
    } catch (err) {
      console.error("Final submit failed:", err);
      toast.error("Failed to finalize report");
    } finally {
      setSaving(false);
    }
  };

  const handleAdminGenerate = async (data) => {
    setSaving(true);
    try {
      const rawCombined = {
        ...formData,
        ...data,
        bankName: "Icici",
        route: "icici",
        isReportSubmitted: false,
        approvalStatus: "Pending",
        status: "Generated",
      };
      const payloadWithFiles = await prepareFormDataForServer(rawCombined);
      const finalData = sanitizeForSave(payloadWithFiles);

      if (id) {
        await dispatch(
          submitIciciBank({
            id,
            formData: { ...finalData, status: "Generated" },
          })
        ).unwrap();
        await dispatch(finalUpdate({ id, bankName: "Icici", updateData: finalData })).unwrap();
        writeDraft(id, finalData);
        navigate("/");
      } else {
        const response = await dispatch(createIciciBank(finalData)).unwrap();
        await dispatch(finalUpdate({ id: response._id, bankName: "Icici", updateData: finalData })).unwrap();
        writeDraft(response._id, finalData);
        navigate("/");
      }
    } catch (err) {
      console.error("Generate Case failed:", err);
      toast.error("Failed to generate case");
      throw err;
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
      stateRef: currentFormStateRef,
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
            onAdminGenerate={handleAdminGenerate}
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
      {!isFieldOfficer && (
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
              {id ? `Editing Case: #${id}` : "Creating New Valuation Report"}
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
      )}

      <div className="max-w-[1550px] mx-auto px-4 mt-6">
        {/* Technical Individual Assignment Tools & Inputs (bottom of the page, hidden on print) */}
        <div className="mb-6 print:hidden">
            <h1 className="text-xl font-bold text-[#0f172a] mb-4">
                Technical Individual Assignment
            </h1>
            
            {/* AI Advanced Auto Fill Accordion */}
            <div className="mb-4 rounded-lg border border-[#e5e7eb] bg-white overflow-hidden shadow-sm">
                {/* Collapsible Header */}
                <div
                  onClick={() => setShowAutoFill(!showAutoFill)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    background: "linear-gradient(135deg, #f0f7ff, #e8f0fe)",
                    borderBottom: showAutoFill ? "1px solid #e5e7eb" : "none",
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

                    {/* Download All ZIP Button */}
                    <button
                      type="button"
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
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: showAutoFill ? "#dc2626" : "#16a34a",
                      background: showAutoFill ? "#fef2f2" : "#f0fdf4",
                      border: `1px solid ${showAutoFill ? "#fecaca" : "#bbf7d0"}`,
                      borderRadius: 6, padding: "3px 10px",
                    }}>
                      {showAutoFill ? "Hide" : "Show"}
                    </span>
                    <svg
                      width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2.5" viewBox="0 0 24 24"
                      style={{ transform: showAutoFill ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {showAutoFill && (
                    <div style={{ padding: "16px", borderTop: "1px solid #e5e7eb" }}>
                        {!isFieldOfficer && (
                        <div className="mb-4">
                            <AutoFillForm setFormData={handleAutoFill} />
                        </div>
                        )}
                        <AdvancedAutoFillForm
                            bankName="ICICI"
                            setFormData={handleAutoFill}
                            setFormDataDirect={setFormData}
                            setEditDataDirect={setEditData}
                            imageUrls={editData?.sitePhotographs || editData?.imageUrls || []}
                            atsDocuments={editData?.atsDocuments && editData.atsDocuments.length > 0 ? editData.atsDocuments : (editData?.AttachDocuments || [])}
                            siteVisitVideo={editData?.siteVisitVideo || []}
                            gpsFiles={editData?.gpsFiles || []}
                            emailFiles={editData?.emailFiles || []}
                            fieldFormFiles={editData?.fieldFormFiles || []}
                            additionalFiles={editData?.additionalFiles || []}
                            fetchData={fetchEditData}
                        />
                        {autoFilledFields.length > 0 && (
                            <div className="mt-3 text-xs text-slate-600">
                                {autoFilledFields.length} fields auto-filled from uploaded documents.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isFieldOfficer && (
              <div className="mb-4 bg-white border border-[#e5e7eb] rounded-lg shadow-sm p-6">
                <CaseWorkflowActions
                  caseId={id}
                  bankName="Icici"
                  onSave={() => handleSave("propertyDetails", {})}
                  onSubmit={(status) => {
                    if (status === "Generated") {
                      return handleAdminGenerate();
                    } else {
                      return handleSubmit();
                    }
                  }}
                  loading={saving}
                  isReportSubmitted={formData?.isReportSubmitted}
                  status={formData?.status}
                />
              </div>
            )}

            {!isFieldOfficer && (
            <div className="mb-4 rounded-lg border border-[#e5e7eb] bg-white overflow-hidden shadow-sm">
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
                    {(formData.applicantName || formData.customerName) && (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                        {(formData.applicantName || formData.customerName) && (
                          <>
                            <span style={{ color: "#cbd5e1" }}>|</span>
                            <span>Applicant <strong style={{ color: "#0f172a", fontWeight: 600 }}>{formData.applicantName || formData.customerName}</strong></span>
                          </>
                        )}
                        {id && (
                          <>
                            <span style={{ color: "#cbd5e1" }}>|</span>
                            <span>Loan Code <strong style={{ color: "#0f172a", fontWeight: 600 }}>{id}</strong></span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transform: isPropertyDetailsOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease"
                    }}
                  >
                    <svg 
                      width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2.5" viewBox="0 0 24 24"
                      style={{ transform: isPropertyDetailsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                    >
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
                          value={formData.applicantName || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({ ...prev, applicantName: val }));
                            setEditData(prev => ({ ...prev, applicantName: val }));
                          }}
                          style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Loan Code</div>
                        <input
                          value={id || ""}
                          disabled
                          style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#94a3b8", outline: "none", boxSizing: "border-box", backgroundColor: "#f3f4f6" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Property Code</div>
                        <input
                          value={formData.uniquePropertyId || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({ ...prev, uniquePropertyId: val }));
                            setEditData(prev => ({ ...prev, uniquePropertyId: val }));
                          }}
                          style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Contact No.</div>
                        <input
                          value={formData.personContact || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({ ...prev, personContact: val }));
                            setEditData(prev => ({ ...prev, personContact: val }));
                          }}
                          style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "16px" }}>
                      <div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Property Name / Owner</div>
                        <input
                          value={formData.customerName || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({ ...prev, customerName: val }));
                            setEditData(prev => ({ ...prev, customerName: val }));
                          }}
                          style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Valuer Name</div>
                        <input
                          value={formData.valuerName || "UNIQUE ENGINEERING ASSOCIATE"}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({ ...prev, valuerName: val }));
                            setEditData(prev => ({ ...prev, valuerName: val }));
                          }}
                          style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Property Sub Type</div>
                        <input
                          value={formData.propertySubType || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({ ...prev, propertySubType: val }));
                            setEditData(prev => ({ ...prev, propertySubType: val }));
                          }}
                          style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                      <div style={{ visibility: "hidden" }}></div>
                    </div>

                    {/* Row 3: Address */}
                    <div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>Address</div>
                      <input
                        value={formData.plotNo || formData.projectSocietyName || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => ({ ...prev, plotNo: val }));
                          setEditData(prev => ({ ...prev, plotNo: val }));
                        }}
                        style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #d1d5db", padding: "0 10px", fontSize: "13px", fontWeight: "600", color: "#1f2937", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>
                )}
            </div>
            )}
        </div>

          {!isFieldOfficer && (
          <>
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
                    {showMobileSteps ? "Hide Steps ▲" : "Show Steps ▼"}
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
                            handleTabClick(card.key);
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
                               <span className="text-[#f59e0b] text-[12px]">▲</span>
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
                      onClick={() => handleTabClick(card.key)}
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



                {renderForm()}
              </div>
            </div>
          </>
          )}
      </div>
    </div>
  );
};

export default IciciBank;





