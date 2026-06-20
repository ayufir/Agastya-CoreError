import React, { useState, useEffect } from "react";
import { Input, Select } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

const { Option } = Select;

const defaultDocumentData = [
  {
    key: "1",
    type: "NA Converted",
    label: "NA CONVERSION",
    authorityLabel: "NA Conversion Order",
    authorityOptions: ["Yes", "No", "NA"],
    numberPlaceholder: "NA Order Number",
    datePlaceholder: "NA Order Date",
    selectedApprovingAuthority: undefined,
    approvalDate: "",
    approvalDetails: "",
  },
  {
    key: "2",
    type: "Layout Plan",
    label: "LAYOUT PLAN",
    authorityLabel: "Layout Plan Approving Authority",
    authorityOptions: ["TP", "ZP", "GP", "Licensed Surveyor", "NA"],
    numberPlaceholder: "Layout Plan Approval No",
    datePlaceholder: "Layout Plan Approval Date",
    selectedApprovingAuthority: undefined,
    approvalDate: "",
    approvalDetails: "",
  },
  {
    key: "3",
    type: "Building Plan",
    label: "BUILDING PLAN",
    authorityLabel: "Building Plan Authority",
    authorityOptions: ["TP", "ZP", "GP", "Licensed Surveyor", "NA"],
    numberPlaceholder: "Plan Number",
    datePlaceholder: "Plan Date",
    selectedApprovingAuthority: undefined,
    approvalDate: "",
    approvalDetails: "",
  },
  {
    key: "4",
    type: "Commencement Certificate",
    label: "COMMENCEMENT CERTIFICATE",
    authorityLabel: "Commencement Certificate Authority",
    authorityOptions: ["TP", "ZP", "GP", "Licensed Surveyor", "NA"],
    numberPlaceholder: "Commencement Certificate Number",
    datePlaceholder: "Commencement Certificate Date",
    selectedApprovingAuthority: undefined,
    approvalDate: "",
    approvalDetails: "",
  },
  {
    key: "5",
    type: "Occupancy / Completion / Building Usage Certificate",
    label: "OCCUPANCY / COMPLETION CERTIFICATE",
    authorityLabel: "Occupancy / Completion Certificate Authority",
    authorityOptions: ["TP", "ZP", "GP", "Licensed Surveyor", "NA"],
    numberPlaceholder: "Occupancy / Completion Certificate Number",
    datePlaceholder: "Occupancy / Completion Certificate Date",
    selectedApprovingAuthority: undefined,
    approvalDate: "",
    approvalDetails: "",
  },
  {
    key: "6",
    type: "Sub Plotting Plan",
    label: "SUB PLOTTING PLAN",
    authorityLabel: "Sub Plotting Plan Authority",
    authorityOptions: ["TP", "ZP", "GP", "Licensed Surveyor", "NA"],
    numberPlaceholder: "Sub Plotting Plan Approval No",
    datePlaceholder: "Sub Plotting Plan Approval Date",
    selectedApprovingAuthority: undefined,
    approvalDate: "",
    approvalDetails: "",
  },
];

const GeneralDetails = ({ isEdit, extractedData, onDocumentsChange }) => {
  const [documents, setDocuments] = useState(defaultDocumentData);

  // Sync with parent form's extractedData (if any)
  useEffect(() => {
    const merged = { ...extractedData, ...isEdit };
    if (merged.documents && Array.isArray(merged.documents)) {
      setDocuments((prevDocs) => {
        return prevDocs.map((doc) => {
          const existing = merged.documents.find((d) => d.type === doc.type);
          if (!existing) return doc;
          return {
            ...doc,
            selectedApprovingAuthority: existing.approvingAuthority !== undefined && existing.approvingAuthority !== "" 
              ? existing.approvingAuthority 
              : undefined,
            approvalDate: existing.approvalDate !== undefined && existing.approvalDate !== "" 
              ? existing.approvalDate 
              : "",
            approvalDetails: existing.approvalDetails !== undefined && existing.approvalDetails !== "" 
              ? existing.approvalDetails 
              : "",
          };
        });
      });
    }
  }, [isEdit, extractedData]);

  // Notify parent whenever documents change (for hidden field sync)
  useEffect(() => {
    if (onDocumentsChange) {
      onDocumentsChange(documents);
    }
  }, [documents, onDocumentsChange]);

  const updateField = (key, field, value) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.key === key ? { ...doc, [field]: value } : doc))
    );
  };

  const hasVal = (val) => val !== undefined && val !== null && val !== "";

  return (
    <div className="w-full">
      <style>{`
        .custom-form-item-wrapper label {
          position: absolute;
          top: -8px;
          left: 10px;
          background: #fff;
          padding: 0 6px;
          font-size: 11px;
          color: #0056b3;
          font-weight: 600;
          z-index: 2;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.15s ease, transform 0.15s ease;
          pointer-events: none;
        }
        .custom-form-item-wrapper:focus-within label,
        .custom-form-item-wrapper.has-value label {
          opacity: 1;
          transform: translateY(0);
        }
        .custom-form-item-wrapper .ant-select-selector {
          height: 40px !important;
          border-radius: 6px !important;
          display: flex !important;
          align-items: center !important;
          border: 1px solid #d1d5db !important;
          box-shadow: none !important;
        }
        .custom-form-item-wrapper .ant-select-selection-placeholder {
          line-height: 38px !important;
        }
        .custom-form-item-wrapper .ant-select-selection-item {
          line-height: 38px !important;
          color: #0f172a !important;
          font-weight: 500 !important;
        }
        .custom-form-item-wrapper .ant-input {
          color: #0f172a !important;
          font-weight: 500 !important;
        }
        .custom-form-item-wrapper .ant-input-affix-wrapper {
          height: 40px !important;
          border-radius: 6px !important;
          border: 1px solid #d1d5db !important;
          box-shadow: none !important;
        }
        .custom-form-item-wrapper .ant-input-affix-wrapper input {
          color: #0f172a !important;
          font-weight: 500 !important;
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {documents.map((doc) => (
          <div key={doc.key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Header */}
            <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#0056b3", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0" }}>
              {doc.label}
            </h4>

            {/* Grid of 3 Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
              {/* Field 1: Authority Dropdown */}
              <div className={`custom-form-item-wrapper ${hasVal(doc.selectedApprovingAuthority) ? "has-value" : ""}`} style={{ position: "relative" }}>
                <label>{doc.authorityLabel}</label>
                <Select
                  value={doc.selectedApprovingAuthority}
                  onChange={(val) => updateField(doc.key, "selectedApprovingAuthority", val)}
                  className="w-full"
                  placeholder={doc.authorityLabel}
                  allowClear
                >
                  {doc.authorityOptions.map((opt) => (
                    <Option key={opt} value={opt}>{opt}</Option>
                  ))}
                </Select>
              </div>

              {/* Field 2: Details / Number Input */}
              <div className={`custom-form-item-wrapper ${hasVal(doc.approvalDetails) ? "has-value" : ""}`} style={{ position: "relative" }}>
                <label>{doc.numberPlaceholder}</label>
                <Input
                  value={doc.approvalDetails}
                  onChange={(e) => updateField(doc.key, "approvalDetails", e.target.value)}
                  style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                  placeholder={doc.numberPlaceholder}
                />
              </div>

              {/* Field 3: Date Input with Calendar Icon Suffix */}
              <div className={`custom-form-item-wrapper ${hasVal(doc.approvalDate) ? "has-value" : ""}`} style={{ position: "relative" }}>
                <label>{doc.datePlaceholder}</label>
                <Input
                  value={doc.approvalDate}
                  onChange={(e) => updateField(doc.key, "approvalDate", e.target.value)}
                  placeholder={doc.datePlaceholder}
                  suffix={<CalendarOutlined style={{ color: "#94a3b8", fontSize: "16px" }} />}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralDetails;