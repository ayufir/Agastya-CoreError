import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Select, Divider } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const { Option } = Select;

// ═══════════════════════════════════════════════════════════════════════════
// Word Doc ke 14 default remarks
// ═══════════════════════════════════════════════════════════════════════════
const buildDefaultRemarks = (extracted = {}, formData = {}) => {
  const pick = (...keys) => {
    for (const k of keys) {
      const v = extracted?.[k] ?? formData?.[k];
      if (v !== undefined && v !== null && v !== "") return String(v);
    }
    return null;
  };

  const sellerNames =
    Array.isArray(extracted?.seller) && extracted.seller.length > 0
      ? extracted.seller.map((s) => s.name).join(", ")
      : pick("propertyOwnerName") || "..........";

  const buyerNames =
    Array.isArray(extracted?.buyer) && extracted.buyer.length > 0
      ? extracted.buyer.map((b) => b.name).join(", ")
      : pick("customerName") || "..........";

  const personMet = pick("personMetDuringVisit") || "..........";
  const contactNo = pick("customerNo") || "..........";

  const l1 = parseFloat(pick("landDocumentArea")) || 0;
  const l2 = parseFloat(pick("landPlanArea")) || 0;
  const l3 = parseFloat(pick("landSiteArea")) || 0;

  const validAreas = [];
  if (l1 > 0) validAreas.push({ name: "L1", val: l1 });
  if (l2 > 0) validAreas.push({ name: "L2", val: l2 });
  if (l3 > 0) validAreas.push({ name: "L3", val: l3 });

  let minAreaName = "L1";
  if (validAreas.length > 0) {
    const minObj = validAreas.reduce((min, curr) => curr.val < min.val ? curr : min, validAreas[0]);
    minAreaName = minObj.name;
  }

  let demarcationType = "BOUNDARY WALL";
  const propDemarcated = pick("propertyDemarcated");
  if (propDemarcated === "NO" || propDemarcated === "No") {
    demarcationType = "DEMARCATION NOT FOUND AT SITE";
  } else {
    demarcationType = "NEIGHBOUR WALL / LIME MARKING / BOUNDARY WALL";
  }

  let areaStatement = `AS PER SALE DEED ACTUAL LAND AREA IS ${l1 || "......"} SQFT`;
  if (minAreaName === "L2") {
    areaStatement = `AS PER LAYOUT PLAN ACTUAL LAND AREA IS ${l2} SQFT`;
  } else if (minAreaName === "L3") {
    areaStatement = `AS PER SITE MEASUREMENT ACTUAL LAND AREA IS ${l3} SQFT`;
  }

  const boundsMatching = pick("boundariesMatching") || "";
  let identStatement = `PROPERTY IS IDENTIFIED BY FOUR SIDE BOUNDARIES OF GIVEN ${extracted?.document_type || "SALE DEED / ATS DRAFT"} LOCAL ENQUIRY`;
  if (boundsMatching === "NO" || boundsMatching === "No") {
    identStatement = "PROPERTY IS IDENTIFIED WITH THE HELP OF COLONY LAYOUT PLAN";
  }

  const hasLayoutPlan = pick("sanctionPlanProvided") === "YES" || pick("sanctionPlanProvided") === "Yes";
  const layoutPlanStatement = hasLayoutPlan 
    ? null 
    : "COLONY LAYOUT PLAN, BUILDING PERMISSION AND MAP IS NOT OBTAIN, SAME IS REQUIRED";

  const remarks = [
    `GIVEN XEROX COPY OF SALE DEED IS FAVOUR OF ${sellerNames} / GIVEN XEROX COPY OF DRAFT/SALE AGREEMENT IT IS BETWEEN OF (SEELER: ${sellerNames}) AND (BUYER: ${buyerNames}).`,
    `DURING PROPERTY VISIT MR. ${personMet} JI MET AT THE PROPERTY WHO IS CUSTOMER CONTACT NO. ${contactNo}. IT WAS CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.`,
    `AT SITE PROPERTY IS OPEN PLOT WHICH IS DEMARCATED BY ${demarcationType}.`,
    areaStatement,
    identStatement,
  ];

  if (layoutPlanStatement) {
    remarks.push(layoutPlanStatement);
  }

  remarks.push(
    "BUILDING ESTIMATE NOT PROVIDED JUSTIFY CONST. COST CONSIDER AS PER HOME FIRST POLICY.",
    "CONST COST CONSIDER AFTER COMPLETION OF WORK.",
    "CLEAR LEGAL OPINION TO BE TAKEN REGARDING LAND USES.",
    "SUGGEST TO CREDIT TEAM TO BE CHECK PROPER OWNERSHIP DOCUMENT PRIOR DISBURSEMENT.",
    "VALUER IS NOT RESPONSIBLE FOR ANY LEGAL DISPUTE."
  );

  return remarks;
};

const performCalculation = (values) => {
  const n = (k) => {
    const val = values?.[k];
    if (val === "" || val === undefined || val === null) return 0;
    return parseFloat(val) || 0;
  };

  const l1 = n("landDocumentArea");
  const l2 = n("landPlanArea");
  const l3 = n("landSiteArea");

  const validAreas = [];
  if (l1 > 0) validAreas.push({ name: "landDocument", val: l1 });
  if (l2 > 0) validAreas.push({ name: "landPlan", val: l2 });
  if (l3 > 0) validAreas.push({ name: "landSite", val: l3 });

  let minAreaName = "";
  let minAreaVal = 0;
  if (validAreas.length > 0) {
    const minObj = validAreas.reduce((min, curr) => curr.val < min.val ? curr : min, validAreas[0]);
    minAreaName = minObj.name;
    minAreaVal = minObj.val;
  }

  let activeRate = n("landSiteRate") || n("landPlanRate") || n("landDocumentRate") || n("marketRatePerSqft") || 0;

  const landDocumentRate = minAreaName === "landDocument" && activeRate ? activeRate : "";
  const landPlanRate = minAreaName === "landPlan" && activeRate ? activeRate : "";
  const landSiteRate = minAreaName === "landSite" && activeRate ? activeRate : "";

  const landDocumentValuation = minAreaName === "landDocument" && l1 && activeRate ? l1 * activeRate : 0;
  const landPlanValuation = minAreaName === "landPlan" && l2 && activeRate ? l2 * activeRate : 0;
  const landSiteValuation = minAreaName === "landSite" && l3 && activeRate ? l3 * activeRate : 0;

  const landValue = minAreaVal * activeRate;

  const c2Area = n("constructionPlanArea");
  const c2Rate = values?.constructionPlanRate !== undefined && values?.constructionPlanRate !== "" ? values.constructionPlanRate : "";
  const c2Valuation = c2Area && parseFloat(c2Rate) ? c2Area * parseFloat(c2Rate) : 0;

  const realizableValue = landValue || 0;
  const valuationAtPresentStage = landValue || 0;

  return {
    landDocumentArea: (values?.landDocumentArea !== undefined && values?.landDocumentArea !== null) ? values.landDocumentArea : 0,
    landDocumentRate,
    landDocumentValuation: landDocumentValuation || 0,
    landPlanArea: (values?.landPlanArea !== undefined && values?.landPlanArea !== null) ? values.landPlanArea : 0,
    landPlanRate,
    landPlanValuation: landPlanValuation || 0,
    landSiteArea: (values?.landSiteArea !== undefined && values?.landSiteArea !== null) ? values.landSiteArea : 0,
    landSiteRate,
    landSiteValuation: landSiteValuation || 0,

    constructionDocumentArea: (values?.constructionDocumentArea !== undefined && values?.constructionDocumentArea !== null) ? values.constructionDocumentArea : 0,
    constructionDocumentRate: values?.constructionDocumentRate || "",
    constructionDocumentValuation: values?.constructionDocumentValuation || 0,
    constructionSiteArea: (values?.constructionSiteArea !== undefined && values?.constructionSiteArea !== null) ? values.constructionSiteArea : 0,
    constructionSiteRate: values?.constructionSiteRate || "",
    constructionSiteValuation: values?.constructionSiteValuation || 0,
    
    constructionPlanArea: (values?.constructionPlanArea !== undefined && values?.constructionPlanArea !== null) ? values.constructionPlanArea : 0,
    constructionPlanRate: c2Rate,
    constructionPlanValuation: c2Valuation || 0,

    amenitiesDetails: (values?.amenitiesDetails !== undefined && values?.amenitiesDetails !== null && values?.amenitiesDetails !== "") ? values.amenitiesDetails : undefined,
    amenitiesValue: (values?.amenitiesValue !== undefined && values?.amenitiesValue !== null) ? values.amenitiesValue : 0,
    liftAvailable: (values?.liftAvailable !== undefined && values?.liftAvailable !== null && values?.liftAvailable !== "") ? values.liftAvailable : undefined,
    buildingHeight: (values?.buildingHeight !== undefined && values?.buildingHeight !== null) ? values.buildingHeight : 0,
    realizableValue: realizableValue,
    constructionStage: (values?.constructionStage !== undefined && values?.constructionStage !== null && values?.constructionStage !== "") ? values.constructionStage : undefined,
    constructionStatus: values?.constructionStatus || "0%",
    ValuationatPresentStage: valuationAtPresentStage,
    constructionEstimateByCustomer: (values?.constructionEstimateByCustomer !== undefined && values?.constructionEstimateByCustomer !== null) ? values.constructionEstimateByCustomer : 0,
    estimateRecommendedByValuer: (values?.estimateRecommendedByValuer !== undefined && values?.estimateRecommendedByValuer !== null) ? values.estimateRecommendedByValuer : 0,
    marketRatePerSqft: (values?.marketRatePerSqft !== undefined && values?.marketRatePerSqft !== null && values?.marketRatePerSqft !== "") ? values.marketRatePerSqft : undefined,
    constructionAsPerPlan: (values?.constructionAsPerPlan !== undefined && values?.constructionAsPerPlan !== null && values?.constructionAsPerPlan !== "") ? values.constructionAsPerPlan : undefined,
    ValuationasperGovtGuideline: (values?.ValuationasperGovtGuideline !== undefined && values?.ValuationasperGovtGuideline !== null) ? values.ValuationasperGovtGuideline : 0,
  };
};

const buildAnalysis = (extracted = {}, formData = {}) => {
  if (!extracted || Object.keys(extracted).length === 0) return null;

  const prop = extracted?.property || {};
  const addr = prop?.address || {};
  const bnds = prop?.boundaries || {};

  return {
    docType: extracted?.document_type || "—",
    regNo: extracted?.registration_number || "—",
    regDate: extracted?.registration_date || "—",
    sellers: Array.isArray(extracted?.seller)
      ? extracted.seller.map((s) => `${s.name} (${s.relation})`).join(", ")
      : "—",
    buyers: Array.isArray(extracted?.buyer)
      ? extracted.buyer.map((b) => `${b.name} (${b.relation})`).join(", ")
      : "—",
    plotArea: prop?.plot_area || "—",
    plotDim: prop?.plot_dimensions || "—",
    propUse: prop?.property_use || formData?.usageOfProperty || "—",
    propType: prop?.property_type || formData?.unitType || "—",
    address: [
      addr.plot_number && `Plot No. ${addr.plot_number}`,
      addr.colony_area,
      addr.ward_number && `Ward ${addr.ward_number}`,
      addr.tehsil && `Tehsil: ${addr.tehsil}`,
      addr.district && `Dist: ${addr.district}`,
      addr.state,
      addr.pincode,
    ]
      .filter(Boolean)
      .join(", "),
    boundaries: Object.entries(bnds)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
      .join(" | "),
    raw: extracted,
  };
};

const InfoCard = ({ label, value, className = "" }) => (
  <div className={`bg-white border rounded p-2 text-sm ${className}`}>
    <b className="text-gray-400 text-xs block mb-0.5">{label}</b>
    <span className="text-gray-800">{value}</span>
  </div>
);

const REMARK_COLORS = ["#FF0000"];

const RemarkEditor = ({ index, value, onChange, onRemove, canRemove }) => {
  const editorRef = useRef(null);
  const rangeRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState("#FF0000");

  useEffect(() => {
    if (!editorRef.current) return;
    const safeValue = value || "";
    if (editorRef.current.innerHTML !== safeValue) {
      editorRef.current.innerHTML = safeValue;
    }
  }, [value]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
      rangeRef.current = range.cloneRange();
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !rangeRef.current) return;

    selection.removeAllRanges();
    selection.addRange(rangeRef.current);
  };

  const syncHtml = () => {
    onChange(index, editorRef.current?.innerHTML || "");
  };

  const focusEditorAtSavedRange = () => {
    editorRef.current?.focus();
    restoreSelection();
  };

  const handleBold = () => {
    focusEditorAtSavedRange();
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("bold", false, null);
    saveSelection();
    syncHtml();
  };

  const applyColor = (color) => {
    setSelectedColor(color);
    focusEditorAtSavedRange();
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("foreColor", false, color);
    saveSelection();
    syncHtml();
  };

  return (
    <div className="mb-4 border border-gray-200 rounded-lg bg-white p-3 shadow-sm">
      <div className="flex items-start mb-2 gap-2">
        <span className="mt-1 min-w-[26px] text-gray-600 font-bold text-sm">
          {index + 1}.
        </span>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2 gap-2">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Button
                  size="small"
                  className="font-bold"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleBold}
                >
                  B
                </Button>

                {REMARK_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyColor(color)}
                    className={`w-6 h-6 rounded border ${selectedColor === color ? "ring-2 ring-blue-400" : ""}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}

                <label
                  className="w-8 h-8 rounded border cursor-pointer overflow-hidden flex items-center justify-center bg-white"
                  title="Custom Color"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => applyColor(e.target.value)}
                    className="w-10 h-10 border-0 p-0 cursor-pointer"
                    style={{ background: "transparent" }}
                  />
                </label>
              </div>
            </div>

            {canRemove && (
              <Button
                type="text"
                danger
                size="small"
                icon={<MinusOutlined />}
                onClick={() => onRemove(index)}
              />
            )}
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={syncHtml}
            onMouseUp={saveSelection}
            onKeyUp={saveSelection}
            onFocus={saveSelection}
            className="w-full min-h-[88px] rounded-md border border-gray-300 px-3 py-2 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm leading-7 whitespace-pre-wrap overflow-auto"
            style={{ wordBreak: "break-word" }}
          />
        </div>
      </div>
    </div>
  );
};

const ValuationDetails = ({
  isEdit,
  onNext,
  onBack,
  registerSectionSubmitter,
  sectionId,
  showActionButtons = true,
  extractedData,
}) => {
  const [form] = Form.useForm();
  const [remarks, setRemarks] = useState([]);
  const formValues = Form.useWatch([], form) || {};
  const hasValue = (name) => formValues[name] !== undefined && formValues[name] !== null && formValues[name] !== "";

  useEffect(() => {
    const currentValues = form.getFieldsValue();
    const merged = { ...isEdit };

    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const val = p.valuation_details || {};
      const accom = p.accommodation_details || {};
      
      const mapped = {
        landDocumentArea: val.plot_area_in_deed || extractedData.landDocumentArea,
        landDocumentRate: val.plot_area_in_deed_rate || extractedData.landDocumentRate,
        landPlanArea: val.plot_area_plan || extractedData.landPlanArea,
        landPlanRate: val.plot_area_plan_rate || extractedData.landPlanRate,
        landSiteArea: val.plot_area_physical || p.plot_area || extractedData.landSiteArea,
        landSiteRate: val.land_rate || val.plot_area_physical_rate || extractedData.landSiteRate,
        constructionDocumentArea: val.super_built_up_area || extractedData.constructionDocumentArea,
        constructionPlanArea: val.carpet_area_plan || extractedData.constructionPlanArea,
        constructionSiteArea: val.carpet_area_measurement || extractedData.constructionSiteArea,
        constructionSiteRate: val.construction_rate || extractedData.constructionSiteRate,
        liftAvailable: accom.lift_facility || extractedData.liftAvailable,
        ValuationasperGovtGuideline: val.government_value || extractedData.ValuationasperGovtGuideline,
        realizableValue: val.total_value || extractedData.realizableValue,
        constructionStage: p.construction_stage || val.construction_status || extractedData.constructionStage,
        constructionStatus: val.completion_percentage || extractedData.constructionStatus,
        marketRatePerSqft: val.market_rate || extractedData.marketRatePerSqft,
      };

      Object.entries(mapped).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          merged[key] = value;
        }
      });
    }

    const calculated = performCalculation(merged);
    const finalFormValues = { ...merged, ...calculated };

    form.setFieldsValue(finalFormValues);

    const savedRemarks =
      isEdit.valuationRemarks &&
        Array.isArray(isEdit.valuationRemarks) &&
        isEdit.valuationRemarks.length > 0
        ? isEdit.valuationRemarks
        : buildDefaultRemarks(extractedData, finalFormValues);

    setRemarks(savedRemarks);
  }, [isEdit, extractedData, form]);

  const handleValuesChange = (changedValues, all) => {
    const updates = performCalculation(all);
    form.setFieldsValue(updates);

    if (changedValues.landDocumentArea || changedValues.landPlanArea || changedValues.landSiteArea || changedValues.landSiteRate || changedValues.landPlanRate || changedValues.landDocumentRate) {
      const updatedRemarks = buildDefaultRemarks(extractedData, { ...isEdit, ...all, ...updates });
      setRemarks(updatedRemarks);
    }
  };

  const handleRemarkChange = (index, html) => {
    setRemarks((prev) => {
      const updated = [...prev];
      updated[index] = html;
      return updated;
    });
  };

  const addRemarkField = () => {
    setRemarks((prev) => [...prev, ""]);
  };

  const removeRemarkField = (index) => {
    setRemarks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (values) => {
    if (!onNext) return;
    onNext({
      ...values,
      valuationRemarks: remarks.filter((item) => item !== ""),
    });
  };

  useEffect(() => {
    if (!registerSectionSubmitter || !sectionId) return;

    registerSectionSubmitter(sectionId, async () => {
      const values = await form.validateFields();
      return {
        ...values,
        valuationRemarks: remarks.filter((item) => item !== ""),
      };
    });

    return () => {
      registerSectionSubmitter(sectionId, null);
    };
  }, [registerSectionSubmitter, sectionId, form, remarks]);

  const analysis = buildAnalysis(extractedData, isEdit);
  const hasExtracted = !!analysis;

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
        .custom-form-item-wrapper:has(.ant-form-item-has-error) .custom-label {
          color: #ff4d4f !important;
        }
        .custom-form-item-wrapper:has(.ant-form-item-has-error) .ant-select-selector,
        .custom-form-item-wrapper:has(.ant-form-item-has-error) .ant-input,
        .custom-form-item-wrapper:has(.ant-form-item-has-error) .ant-input-affix-wrapper {
          border-color: #ff4d4f !important;
        }
        .custom-form-item-wrapper .ant-form-item-explain-error {
          color: #ff4d4f !important;
          font-size: 12px;
          margin-top: 4px;
        }
        .valuation-table th {
          font-weight: 600;
          color: #475569;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 10px;
        }
        .valuation-table td {
          padding: 8px 10px;
          border-bottom: 1px solid #f1f5f9;
        }
      `}</style>

      <h2 className="text-xl font-bold mb-6 text-slate-800">Valuation</h2>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
      >
        {/* Table representation for Land & Construction */}
        <div className="border border-slate-200 rounded-lg overflow-hidden mb-8 bg-white">
          <table className="w-full text-left border-collapse valuation-table">
            <thead>
              <tr>
                <th style={{ width: "15%" }}></th>
                <th style={{ width: "20%" }}>As per</th>
                <th style={{ width: "20%" }}>Area</th>
                <th style={{ width: "25%" }}>Rate per sq.ft</th>
                <th style={{ width: "20%" }}>Valuation</th>
              </tr>
            </thead>
            <tbody>
              {/* Land rows */}
              <tr>
                <td rowSpan={3} className="font-bold text-slate-800 border-r border-slate-200 align-top text-center bg-slate-50 pt-4">
                  Land
                </td>
                <td className="text-slate-600 align-middle pl-4">Document (L1)</td>
                <td>
                  <Form.Item name="landDocumentArea" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="0" />
                  </Form.Item>
                </td>
                <td>
                  <Form.Item name="landDocumentRate" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="" />
                  </Form.Item>
                </td>
                <td>
                  <Form.Item name="landDocumentValuation" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="0" disabled />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="text-slate-600 align-middle pl-4">Plan (L2)</td>
                <td>
                  <Form.Item name="landPlanArea" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="0" />
                  </Form.Item>
                </td>
                <td>
                  <Form.Item name="landPlanRate" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="" />
                  </Form.Item>
                </td>
                <td>
                  <Form.Item name="landPlanValuation" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="0" disabled />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="text-slate-600 align-middle pl-4 border-b border-slate-200">Site (L3)</td>
                <td className="border-b border-slate-200">
                  <Form.Item name="landSiteArea" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="0" />
                  </Form.Item>
                </td>
                <td className="border-b border-slate-200">
                  <Form.Item name="landSiteRate" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="" />
                  </Form.Item>
                </td>
                <td className="border-b border-slate-200">
                  <Form.Item name="landSiteValuation" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="0" disabled />
                  </Form.Item>
                </td>
              </tr>

              {/* Construction rows */}
              <tr>
                <td rowSpan={3} className="font-bold text-slate-800 border-r border-slate-200 align-top text-center bg-slate-50 pt-4">
                  Construction
                </td>
                <td className="text-slate-600 align-middle pl-4">Document (C1)</td>
                <td>
                  <Form.Item name="constructionDocumentArea" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="0" />
                  </Form.Item>
                </td>
                <td>
                  <Form.Item name="constructionDocumentRate" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="" />
                  </Form.Item>
                </td>
                <td>
                  <Form.Item name="constructionDocumentValuation" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="0" disabled />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="text-slate-600 align-middle pl-4">Plan (C2)</td>
                <td>
                  <Form.Item name="constructionPlanArea" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="0" />
                  </Form.Item>
                </td>
                <td>
                  <Form.Item name="constructionPlanRate" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="" />
                  </Form.Item>
                </td>
                <td>
                  <Form.Item name="constructionPlanValuation" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="0" disabled />
                  </Form.Item>
                </td>
              </tr>
              <tr>
                <td className="text-slate-600 align-middle pl-4">Site (C3)</td>
                <td>
                  <Form.Item name="constructionSiteArea" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="0" />
                  </Form.Item>
                </td>
                <td>
                  <Form.Item name="constructionSiteRate" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="" />
                  </Form.Item>
                </td>
                <td>
                  <Form.Item name="constructionSiteValuation" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px" }} placeholder="0" disabled />
                  </Form.Item>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-bold mb-4 text-slate-800">Other Details</h3>
        
        {/* Row 1: Amenities & Value of Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
          <div className={`custom-form-item-wrapper ${hasValue("amenitiesDetails") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Amenities</span>
            <Form.Item name="amenitiesDetails" style={{ margin: 0 }}>
              <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Amenities" />
            </Form.Item>
          </div>

          <div className={`custom-form-item-wrapper ${hasValue("amenitiesValue") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Value of Amenities (D)</span>
            <Form.Item name="amenitiesValue" style={{ margin: 0 }}>
              <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Value of Amenities (D)" />
            </Form.Item>
          </div>
        </div>

        {/* Row 2: Lift Available? & Height of Building */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
          <div className={`custom-form-item-wrapper ${hasValue("liftAvailable") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Lift Available?</span>
            <Form.Item name="liftAvailable" style={{ margin: 0 }}>
              <Select allowClear className="w-full" placeholder="Lift Available?">
                <Option value="YES">Yes</Option>
                <Option value="NO">No</Option>
              </Select>
            </Form.Item>
          </div>

          <div className={`custom-form-item-wrapper ${hasValue("buildingHeight") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Height of Building (in m.)</span>
            <Form.Item name="buildingHeight" style={{ margin: 0 }}>
              <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Height of Building (in m.)" />
            </Form.Item>
          </div>
        </div>

        {/* Row 3: Realizable Value & Construction Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
          <div className={`custom-form-item-wrapper ${hasValue("realizableValue") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Realizable Value after completion</span>
            <Form.Item name="realizableValue" style={{ margin: 0 }}>
              <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Realizable Value after completion" disabled />
            </Form.Item>
          </div>

          <div className={`custom-form-item-wrapper ${hasValue("constructionStage") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Construction Stage</span>
            <Form.Item name="constructionStage" style={{ margin: 0 }}>
              <Select allowClear className="w-full" placeholder="Construction Stage">
                {[
                  "Foundation",
                  "Plinth",
                  "RCC",
                  "Brick Work",
                  "Plaster",
                  "Tiling",
                  "Internal Finishing",
                  "Completed",
                ].map((v) => (
                  <Option key={v} value={v}>{v}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* Row 4: Construction % & Valuation at current stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
          <div className={`custom-form-item-wrapper ${hasValue("constructionStatus") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Construction %</span>
            <Form.Item name="constructionStatus" style={{ margin: 0 }}>
              <Select allowClear className="w-full" placeholder="Construction %">
                {["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"].map((pct) => (
                  <Option key={pct} value={pct}>{pct}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className={`custom-form-item-wrapper ${hasValue("ValuationatPresentStage") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Valuation at current stage</span>
            <Form.Item name="ValuationatPresentStage" style={{ margin: 0 }}>
              <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Valuation at current stage" />
            </Form.Item>
          </div>
        </div>

        {/* Row 5: Valuation as per Govt. guideline & Estimate Amount shared by customer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
          <div className={`custom-form-item-wrapper ${hasValue("ValuationasperGovtGuideline") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Valuation as per Govt. guideline</span>
            <Form.Item name="ValuationasperGovtGuideline" style={{ margin: 0 }}>
              <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Valuation as per Govt. guideline" />
            </Form.Item>
          </div>

          <div className={`custom-form-item-wrapper ${hasValue("constructionEstimateByCustomer") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Estimate Amount shared by customer</span>
            <Form.Item name="constructionEstimateByCustomer" style={{ margin: 0 }}>
              <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Estimate Amount shared by customer" />
            </Form.Item>
          </div>
        </div>

        {/* Row 6: Estimate recommended (by valuer) & Market rate for similar properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
          <div className={`custom-form-item-wrapper ${hasValue("estimateRecommendedByValuer") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Estimate recommended (by valuer)</span>
            <Form.Item name="estimateRecommendedByValuer" style={{ margin: 0 }}>
              <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Estimate recommended (by valuer)" />
            </Form.Item>
          </div>

          <div className={`custom-form-item-wrapper ${hasValue("marketRatePerSqft") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Market rate for similar properties (Rs/sq.ft)</span>
            <Form.Item name="marketRatePerSqft" style={{ margin: 0 }}>
              <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Market rate for similar properties (Rs/sq.ft)" />
            </Form.Item>
          </div>
        </div>

        {/* Row 7: Construction as per plan / by laws? */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
          <div className={`custom-form-item-wrapper ${hasValue("constructionAsPerPlan") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "8px" }}>
            <span className="custom-label">Construction as per plan / by laws?</span>
            <Form.Item name="constructionAsPerPlan" style={{ margin: 0 }}>
              <Select allowClear className="w-full" placeholder="Construction as per plan / by laws?">
                <Option value="Yes">Yes</Option>
                <Option value="No">No</Option>
              </Select>
            </Form.Item>
          </div>
        </div>





        {/* Save & Proceed Button */}
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
              boxShadow: "none"
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

        {/* Actions */}
        {showActionButtons && (
          <div className="text-right mt-4 border-t pt-4">
            {onBack && (
              <Button onClick={onBack} className="mr-2">
                Back
              </Button>
            )}
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default ValuationDetails;
