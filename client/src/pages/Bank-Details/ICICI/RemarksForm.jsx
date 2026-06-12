import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, DatePicker, Input, Radio, Select } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const DATE_FORMAT = "DD/MM/YYYY";

const RichTextBox = ({ label, required, value, onChange, max = 2000 }) => {
  const plainText = (value || "").replace(/<[^>]*>/g, "").trim();

  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "align",
  ];

  return (
    <div className="mb-10">
      <label className="block text-[18px] font-semibold text-[#9b0000] mb-4">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>

      <div className="icici-richbox border border-[#d4d4d4] rounded-[8px] overflow-hidden bg-white">
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={onChange}
          modules={modules}
          formats={formats}
        />
      </div>

      <div className="text-right text-[18px] text-black mt-1">
        {plainText.length}/{max}
      </div>
    </div>
  );
};

const LineInput = ({
  label,
  required,
  value,
  onChange,
  placeholder = "",
  className = "",
}) => (
  <div className={className}>
    {label && (
      <label className="block text-[15px] text-[#555] mb-2">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
    )}

    <Input
      value={value || ""}
      placeholder={placeholder}
      bordered={false}
      onChange={(e) => onChange(e.target.value)}
      className="border-b border-[#bdbdbd] rounded-none px-0 text-[18px] h-[34px] bg-transparent"
    />
  </div>
);

const LineSelect = ({
  label,
  required,
  value,
  onChange,
  options = [],
  className = "",
}) => (
  <div className={className}>
    {label && (
      <label className="block text-[15px] text-[#555] mb-2">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
    )}

    <Select
      value={value || undefined}
      onChange={onChange}
      bordered={false}
      className="w-full border-b border-[#bdbdbd] rounded-none h-[34px]"
      suffixIcon={<span className="text-gray-600">▼</span>}
      options={options}
    />
  </div>
);

const LineDatePicker = ({
  label,
  required,
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  className = "",
}) => (
  <div className={className}>
    {label && (
      <label className="block text-[15px] text-[#555] mb-2">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
    )}

    <DatePicker
      value={value ? dayjs(value, DATE_FORMAT) : null}
      format={DATE_FORMAT}
      placeholder={placeholder}
      onChange={(date, dateString) => onChange(dateString)}
      bordered={false}
      className="w-full border-b border-[#bdbdbd] rounded-none px-0 text-[18px] h-[34px] bg-transparent"
    />
  </div>
);

const RemarksForm = ({
  data,
  editData,
  extractedData,
  onSave,
  onSubmit,
  onFinalSubmit,
  isAdmin,
  saving,
}) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nfsaCheckRequired: "",
    generalObservations: "",
    raleReferences: "",
    valuedUnderMarketPractice: "no",
    propertyCategorization: "",

    documentsVetted: [
      {
        documentName: "",
        documentReference: "",
        documentDate: "",
        documentAuthority: "",
      },
    ],

    personName: "Pooja Traders  Mobile",
    relationshipPerson: "Self",
    countryCode: "+91",
    mobileNo: "9425116566",
    siteVisits: "1",
    evaluationMode: "",
    rejectionReason: "",

    visitedBy: "LOKESH SHARMA",
    visitedUserType: "External",
    visitDate: "",
  });

  useEffect(() => {
    const src = (data && Object.keys(data).length > 0) ? data : (editData || {});
    const autofillData = extractedData || {};
    if (src) {
      const rawContact = src.personContact || "";
      const hasCountryCode = rawContact.startsWith("+");
      const countryCode = hasCountryCode ? rawContact.slice(0, 3) : "+91";
      const mobileNo = hasCountryCode ? rawContact.slice(3) : rawContact;

      setForm((prev) => ({
        ...prev,
        ...src,

        nfsaCheckRequired: src.nfsaCheckRequired || "",
        generalObservations: src.generalObservations || "",
        raleReferences: src.raleReferences || "",

        valuedUnderMarketPractice:
          src.valuedUnderMarketPractice || prev.valuedUnderMarketPractice,
        propertyCategorization:
          src.propertyCategorization || prev.propertyCategorization,

        personName: src.personName || prev.personName,
        relationshipPerson:
          src.personRole ||
          src.relationshipPerson ||
          prev.relationshipPerson,

        countryCode,
        mobileNo,

        siteVisits: src.siteVisits?.toString() || prev.siteVisits,
        evaluationMode: src.evaluationMode || prev.evaluationMode,
        rejectionReason: src.rejectionReason || prev.rejectionReason,

        visitedBy: src.verifiedBy || src.visitedBy || prev.visitedBy,
        visitedUserType:
          src.verificationType ||
          src.visitedUserType ||
          prev.visitedUserType,

        visitDate: src.visitDate || prev.visitDate,

        documentsVetted:
          Array.isArray(src.documentsVetted) &&
          src.documentsVetted.length > 0
            ? src.documentsVetted
            : prev.documentsVetted,
      }));
    }
  }, [editData, data, extractedData]);

  const change = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const changeDoc = (index, field, value) => {
    setForm((prev) => {
      const docs = [...prev.documentsVetted];
      docs[index] = { ...docs[index], [field]: value };
      return { ...prev, documentsVetted: docs };
    });
  };

  const addDoc = () => {
    setForm((prev) => ({
      ...prev,
      documentsVetted: [
        ...prev.documentsVetted,
        {
          documentName: "",
          documentReference: "",
          documentDate: "",
          documentAuthority: "",
        },
      ],
    }));
  };

  const removeDoc = (index) => {
    setForm((prev) => ({
      ...prev,
      documentsVetted:
        prev.documentsVetted.length === 1
          ? prev.documentsVetted
          : prev.documentsVetted.filter((_, i) => i !== index),
    }));
  };

  const buildPayload = () => {
    const payload = {
      ...form,
      personRole: form.relationshipPerson,
      personContact: form.mobileNo
        ? `${form.countryCode}${form.mobileNo}`
        : form.personContact || "",
      verifiedBy: form.visitedBy,
      verificationType: form.visitedUserType,
      visitDate: form.visitDate,
    };
    
    if (form.siteVisits && !isNaN(Number(form.siteVisits))) {
      payload.siteVisits = Number(form.siteVisits);
    }
    
    return payload;
  };

  const handleSave = () => {
    if (onSave) onSave("remarks", buildPayload());
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(buildPayload());
  };

  const handleFinalSubmit = () => {
    if (onFinalSubmit) onFinalSubmit(buildPayload());
  };

  const handleDownloadJson = async () => {
    toast.loading("Preparing JSON with images...", { id: "json-download" });
    const fullState = { ...data, ...buildPayload() };
    
    const fileToBase64 = (file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

    const cleanState = { ...fullState };
    
    if (cleanState.sitePhotographs && Array.isArray(cleanState.sitePhotographs)) {
      const photosWithBase64 = [];
      for (const photo of cleanState.sitePhotographs) {
        let actualFile = photo;
        if (photo && photo.originFileObj instanceof File) {
          actualFile = photo.originFileObj;
        }

        if (typeof File !== "undefined" && actualFile instanceof File) {
          const base64 = await fileToBase64(actualFile);
          photosWithBase64.push({ name: actualFile.name, type: actualFile.type, size: actualFile.size, base64 });
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
        if (photo && photo.file instanceof File) {
          actualFile = photo.file;
        }

        if (typeof File !== "undefined" && actualFile instanceof File) {
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
      if (actualFile && actualFile.originFileObj instanceof File) {
        actualFile = actualFile.originFileObj;
      }
      if (typeof File !== "undefined" && actualFile instanceof File) {
         const base64 = await fileToBase64(actualFile);
         cleanState[field] = { name: actualFile.name, type: actualFile.type, size: actualFile.size, base64 };
      }
    }

    const finalStr = JSON.stringify(cleanState, (key, value) => {
      if (typeof File !== "undefined" && value instanceof File) return undefined;
      return value;
    }, 2);
    
    const blob = new Blob([finalStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `icici-form-${editData?._id || "draft"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON Downloaded!", { id: "json-download" });
  };

  const handlePreview = () => {
    const reportId = editData?._id || data?._id;
    if (reportId) {
      navigate(`/bank/icici/${reportId}`);
    } else {
      toast.error("Report not available for preview yet.");
    }
  };

  return (
    <div className="pb-28">
      <style>{`
        .icici-richbox .ql-toolbar {
          background: #cfcfcf;
          border: none !important;
          min-height: 52px;
          display: flex;
          align-items: center;
        }

        .icici-richbox .ql-container {
          border: none !important;
          font-size: 16px;
          min-height: 175px;
        }

        .icici-richbox .ql-editor {
          min-height: 175px;
          padding: 16px;
        }

        .icici-richbox .ql-toolbar button,
        .icici-richbox .ql-toolbar .ql-picker-label {
          color: #222;
        }

        .icici-richbox .ql-toolbar button svg {
          width: 18px;
          height: 18px;
        }

        .ant-picker-input > input {
          font-size: 18px !important;
        }
      `}</style>

      <h3 className="text-[22px] font-semibold text-[#9b0000] mb-20">
        Remarks
      </h3>

      <RichTextBox
        label="NFA’s/Adherence Checks Required Based On Observations"
        value={form.nfsaCheckRequired}
        onChange={(v) => change("nfsaCheckRequired", v)}
      />

      <RichTextBox
        label="General Observations"
        required
        value={form.generalObservations}
        onChange={(v) => change("generalObservations", v)}
      />

      <RichTextBox
        label="Rate Reference"
        value={form.raleReferences}
        max={1000}
        onChange={(v) => change("raleReferences", v)}
      />

      <div className="mb-12">
        <p className="text-[15px] text-[#555] mb-3">
          Is The Property Valued Under Market Practice?
        </p>

        <Radio.Group
          value={form.valuedUnderMarketPractice}
          onChange={(e) =>
            change("valuedUnderMarketPractice", e.target.value)
          }
        >
          <Radio value="yes" className="text-[18px]">
            Yes
          </Radio>
          <Radio value="no" className="text-[18px]">
            No
          </Radio>
        </Radio.Group>
      </div>

      <LineSelect
        label="Property categorization"
        required
        value={form.propertyCategorization}
        onChange={(v) => change("propertyCategorization", v)}
        className="w-[360px] mb-10"
        options={[
          { value: "standard", label: "Standard" },
          { value: "highRisk", label: "High Risk" },
          { value: "lowRisk", label: "Low Risk" },
        ]}
      />

      <h3 className="text-[20px] font-semibold text-[#9b0000] mb-6">
        Document Vetted
      </h3>

      <div className="overflow-x-auto border border-[#d6d6d6] mb-8">
        <div style={{ minWidth: "800px" }}>
          <div className="grid grid-cols-[1.1fr_1.1fr_1fr_1fr_0.5fr] bg-[#efeee9] text-[18px] font-semibold text-black">
          <div className="p-4">Document Name</div>
          <div className="p-4">Document Reference</div>
          <div className="p-4">Document Date</div>
          <div className="p-4">Authority</div>
          <div className="p-4 text-center">Actions</div>
        </div>

        {form.documentsVetted.map((doc, index) => (
          <div
            key={index}
            className="grid grid-cols-[1.1fr_1.1fr_1fr_1fr_0.5fr] items-center min-h-[75px]"
          >
            <div className="px-4">
              <Input
                value={doc.documentName || ""}
                bordered={false}
                onChange={(e) =>
                  changeDoc(index, "documentName", e.target.value)
                }
                className="border-b border-[#bdbdbd] rounded-none px-0"
              />
            </div>

            <div className="px-4">
              <Input
                value={doc.documentReference || ""}
                bordered={false}
                onChange={(e) =>
                  changeDoc(index, "documentReference", e.target.value)
                }
                className="border-b border-[#bdbdbd] rounded-none px-0"
              />
            </div>

            <div className="px-4">
              <LineDatePicker
                value={doc.documentDate}
                onChange={(v) => changeDoc(index, "documentDate", v)}
              />
            </div>

            <div className="px-4">
              <Input
                value={doc.documentAuthority || ""}
                bordered={false}
                onChange={(e) =>
                  changeDoc(index, "documentAuthority", e.target.value)
                }
                className="border-b border-[#bdbdbd] rounded-none px-0"
              />
            </div>

            <div className="px-4 text-center">
              <button
                type="button"
                onClick={() => removeDoc(index)}
                className="text-red-600 text-[24px]"
              >
                <DeleteOutlined />
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className="flex justify-end mb-20">
        <button
          type="button"
          onClick={addDoc}
          className="border border-[#003b70] text-[#003b70] rounded-[4px] px-4 py-2 text-[18px] flex items-center gap-2"
        >
          <PlusCircleOutlined />
          Add More
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 md:gap-x-32 gap-y-6 md:gap-y-9 mb-14">
        <LineInput
          label="Name Of The Person Met At Site"
          value={form.personName}
          onChange={(v) => change("personName", v)}
        />

        <LineSelect
          label="Relationship Of The Person Met At Site"
          value={form.relationshipPerson}
          onChange={(v) => change("relationshipPerson", v)}
          options={[
            { value: "Self", label: "Self" },
            { value: "Owner", label: "Owner" },
            { value: "Tenant", label: "Tenant" },
            { value: "Relative", label: "Relative" },
          ]}
        />

        <div>
          <label className="block text-[15px] text-[#555] mb-2">
            Mobile No. Of The Person Met At Site
          </label>

          <div className="grid grid-cols-[120px_1fr] gap-6">
            <LineSelect
              value={form.countryCode}
              onChange={(v) => change("countryCode", v)}
              options={[
                { value: "+91", label: "+91" },
                { value: "+1", label: "+1" },
              ]}
            />

            <LineInput
              value={form.mobileNo}
              onChange={(v) => change("mobileNo", v)}
            />
          </div>
        </div>

        <LineSelect
          label="No Of Site Visits"
          required
          value={form.siteVisits}
          onChange={(v) => change("siteVisits", v)}
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
          ]}
        />

        <LineSelect
          label="Evaluation Mode"
          value={form.evaluationMode}
          onChange={(v) => change("evaluationMode", v)}
          options={[
            { value: "physical", label: "Physical" },
            { value: "desktop", label: "Desktop" },
          ]}
        />

        <LineSelect
          label="Reason for rejecting the report"
          required
          value={form.rejectionReason}
          onChange={(v) => change("rejectionReason", v)}
          options={[
            { value: "notApplicable", label: "Not Applicable" },
            { value: "documentMismatch", label: "Document Mismatch" },
            { value: "siteMismatch", label: "Site Mismatch" },
          ]}
        />
      </div>

      <h3 className="text-[20px] font-semibold text-[#9b0000] mb-8">
        User Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 md:gap-x-32 gap-y-6 mb-24">
        <LineInput
          label="Visited By"
          required
          value={form.visitedBy}
          onChange={(v) => change("visitedBy", v)}
        />

        <LineInput
          label="Visited User Type"
          required
          value={form.visitedUserType}
          onChange={(v) => change("visitedUserType", v)}
        />

        <LineDatePicker
          label="Date Of Site Visit"
          required
          value={form.visitDate}
          onChange={(v) => change("visitDate", v)}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-6 w-full">
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={saving}
          style={{
              backgroundColor: "#235097",
              borderColor: "#285194",
              height: "38px",
              paddingLeft: "24px",
              paddingRight: "24px",
              fontSize: "14px",
              fontWeight: "500",
              borderRadius: "4px",
            }}
          className="h-[38px] px-6 text-sm font-medium rounded-[4px] bg-[#003b70] hover:bg-[#003b70] text-white w-full sm:w-auto"
        >
          Submit
        </Button>

        {isAdmin && (
          <Button
            type="primary"
            onClick={handleFinalSubmit}
            loading={saving}
            style={{
              backgroundColor: "#1b3a6b",
              borderColor: "#1b3a6b",
              height: "38px",
              paddingLeft: "24px",
              paddingRight: "24px",
              fontSize: "14px",
              fontWeight: "500",
              borderRadius: "4px",
            }}
            className="w-full sm:w-auto"
          >
            Final Submit
          </Button>
        )}
        
        <Button
          onClick={handleDownloadJson}
          style={{
            borderColor: "#003b70",
            color: "#003b70",
            height: "38px",
            paddingLeft: "24px",
            paddingRight: "24px",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "4px",
          }}
          className="h-[38px] px-6 text-sm font-medium rounded-[4px] hover:bg-gray-50 w-full sm:w-auto"
        >
          ⬇️ Download JSON
        </Button>
      </div>
    </div>
  );
};

export default RemarksForm;
