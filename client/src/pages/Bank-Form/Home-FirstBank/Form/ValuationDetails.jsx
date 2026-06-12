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

  const plotArea =
    extracted?.property?.plot_area || pick("landArea") || "......";
  const dimensions =
    extracted?.property?.plot_dimensions || pick("linearDimension") || "";
  const areaStr = dimensions ? `${plotArea} (${dimensions})` : plotArea;

  const landRate = pick("landSiteRate", "marketRatePerSqft") || "......";

  return [
    `GIVEN XEROX COPY OF SALE DEED IS FAVOUR OF ${sellerNames} / GIVEN XEROX COPY OF DRAFT/SALE AGREEMENT IT IS BETWEEN OF (SEELER: ${sellerNames}) AND (BUYER: ${buyerNames}).`,
    `DURING PROPERTY VISIT MR. ${personMet} JI MET AT THE PROPERTY WHO IS CUSTOMER CONTACT NO. ${contactNo}. IT WAS CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.`,
    "RATE HAS BEEN CONFIRM FORM MARKET ENQUIRY.",
    "PROPERTY IS SITUATED AT SURROUNDING AREA OF LOCALITY IS RESI-CUM A. ZONING SURROUNDING AREA DEVELOPMENT IS 45 %.",
    "AT SITE PROPERTY IS GROUND FLOOR UNDER CONST RESIDENTIAL HOUSE WHICH IS OCCUPIED BY OWNER AND WORK DONE UPTO BRICK AND SLAB WORK COMPLETED.",
    `AS PER SALE DEED/ DRAFT /A.T.S/ ACTUAL LAND AREA IS ${areaStr} SQFT.`,
    "PROPERTY IS NOT IDENTIFIED BY FOUR SIDE BOUNDARIES OF GIVEN SALE DEED/ AGREEMENT AND KEY LOCATION PLAN IS REQUIRE FOR IDENTIFICATION / PRIVATE KEY LOCATION PLAN WHICH IS DRAW BY ARCHITECT.",
    "BUILDING PERMISSION AND MAP IS NOT OBTAIN / ARCHITECT MAP RECEIVE FOR G.F.",
    "BUILDING ESTIMATE NOT PROVIDED JUSTIFY CONST. COST CONSIDER AS PER HOME FIRST POLICY.",
    "CONST COST CONSIDER FOR EXISTING STRUCTURE AS PRESENT CONDITION OF STRUCTURE, ALSO CONST COST OF PROPOSED EXTENSION WORK WILL BE CONSIDER AFTER COMPLETION OF WORK./ CONST COST CONSIDER AFTER COMPLETION OF WORK.",
    "CLEAR LEGAL OPINION TO BE TAKEN REGARDING LAND USES.",
    "SUGGEST TO CREDIT TEAM TO BE CHECK PROPER OWNERSHIP DOCUMENT PRIOR DISBURSEMENT.",
    "VALUER IS NOT RESPONSIBLE FOR ANY LEGAL DISPUTE.",
    `TENTATIVE LAND RATE IS RS. ${landRate}/- SQFT`,
  ];
};

// ═══════════════════════════════════════════════════════════════════════════
// Analysis data builder
// ═══════════════════════════════════════════════════════════════════════════
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
// "#000000",
// "#0000FF",
//   "#008000",
//   "#FFA500",
//   "#800080",
//   "#A52A2A",
//   "#FFC0CB",
//   "#808080",
//   "#00FFFF",
//   "#FF00FF",
//   "#FFD700",

const REMARK_COLORS = [

  "#FF0000",

];

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
                    className={`w-6 h-6 rounded border ${selectedColor === color ? "ring-2 ring-blue-400" : ""
                      }`}
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

    const safeVal = (key, fallback = "") => {
      if (merged[key] !== undefined && merged[key] !== null && merged[key] !== "") {
        return merged[key];
      }
      return currentValues[key] !== undefined && currentValues[key] !== null ? currentValues[key] : fallback;
    };

    form.setFieldsValue({
      landDocumentArea: safeVal("landDocumentArea"),
      landDocumentRate: safeVal("landDocumentRate"),
      landDocumentValuation: safeVal("landDocumentValuation"),
      landPlanArea: safeVal("landPlanArea"),
      landPlanRate: safeVal("landPlanRate"),
      landPlanValuation: safeVal("landPlanValuation"),
      landSiteArea: safeVal("landSiteArea") || safeVal("landAreaSite"),
      landSiteRate: safeVal("landSiteRate") || safeVal("landRate"),
      landSiteValuation: safeVal("landSiteValuation"),
      constructionDocumentArea: safeVal("constructionDocumentArea"),
      constructionDocumentRate: safeVal("constructionDocumentRate"),
      constructionDocumentValuation: safeVal("constructionDocumentValuation"),
      constructionPlanArea: safeVal("constructionPlanArea"),
      constructionPlanRate: safeVal("constructionPlanRate"),
      constructionPlanValuation: safeVal("constructionPlanValuation"),
      constructionSiteArea: safeVal("constructionSiteArea") || safeVal("constructionAreaForValuation"),
      constructionSiteRate: safeVal("constructionSiteRate") || safeVal("constructionRate"),
      constructionSiteValuation: safeVal("constructionSiteValuation"),
      amenitiesDetails: safeVal("amenitiesDetails", "NA"),
      amenitiesValue: safeVal("amenitiesValue"),
      liftAvailable: safeVal("liftAvailable"),
      buildingHeight: safeVal("buildingHeight"),
      realizableValue: safeVal("realizableValue"),
      constructionStage: safeVal("constructionStage"),
      constructionStatus: safeVal("constructionStatus"),
      ValuationatPresentStage: safeVal("ValuationatPresentStage"),
      ValuationasperGovtGuideline: safeVal("ValuationasperGovtGuideline"),
      constructionEstimateByCustomer: safeVal("constructionEstimateByCustomer"),
      estimateRecommendedByValuer: safeVal("estimateRecommendedByValuer"),
      marketRatePerSqft: safeVal("marketRatePerSqft"),
      constructionAsPerPlan: safeVal("constructionAsPerPlan"),
    });

    const savedRemarks =
      merged.valuationRemarks &&
        Array.isArray(merged.valuationRemarks) &&
        merged.valuationRemarks.length > 0
        ? merged.valuationRemarks
        : buildDefaultRemarks(extractedData, isEdit);

    setRemarks(savedRemarks);
  }, [isEdit, extractedData, form]);

  const handleValuesChange = (_, all) => {
    const n = (k) => parseFloat(all[k]) || 0;
    const lSite = n("landSiteArea") * n("landSiteRate");
    const cSite = n("constructionSiteArea") * n("constructionSiteRate");

    form.setFieldsValue({
      landDocumentValuation: n("landDocumentArea") * n("landDocumentRate") || "",
      landPlanValuation: n("landPlanArea") * n("landPlanRate") || "",
      landSiteValuation: lSite || "",
      constructionDocumentValuation:
        n("constructionDocumentArea") * n("constructionDocumentRate") || "",
      constructionPlanValuation:
        n("constructionPlanArea") * n("constructionPlanRate") || "",
      constructionSiteValuation: cSite || "",
      realizableValue: lSite + cSite + n("amenitiesValue") || "",
    });
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

  const AreaRateRow = ({ prefix, labelPrefix }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 p-3 bg-gray-50 rounded">
      <Form.Item label={`${labelPrefix} Area (sq.ft)`} name={`${prefix}Area`} className="mb-0">
        <Input type="number" placeholder="0" />
      </Form.Item>
      <Form.Item label="Rate per sq.ft" name={`${prefix}Rate`} className="mb-0">
        <Input type="number" placeholder="0" />
      </Form.Item>
      <Form.Item label="Valuation (auto)" name={`${prefix}Valuation`} className="mb-0">
        <Input type="number" disabled />
      </Form.Item>
    </div>
  );

  const analysis = buildAnalysis(extractedData, isEdit);
  const hasExtracted = !!analysis;

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Valuation Details</h2>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
      >
        <Divider orientation="left">Land</Divider>
        <p className="font-semibold mb-1 text-gray-600">As per Document (L1)</p>
        <AreaRateRow prefix="landDocument" labelPrefix="Document" />
        <p className="font-semibold mb-1 text-gray-600">Plan (L2)</p>
        <AreaRateRow prefix="landPlan" labelPrefix="Plan" />
        <p className="font-semibold mb-1 text-gray-600">Site (L3)</p>
        <AreaRateRow prefix="landSite" labelPrefix="Site" />

        <Divider orientation="left">Construction</Divider>
        <p className="font-semibold mb-1 text-gray-600">As per Document (L1)</p>
        <AreaRateRow prefix="constructionDocument" labelPrefix="Document" />
        <p className="font-semibold mb-1 text-gray-600">Plan (L2)</p>
        <AreaRateRow prefix="constructionPlan" labelPrefix="Plan" />
        <p className="font-semibold mb-1 text-gray-600">Site (L3)</p>
        <AreaRateRow prefix="constructionSite" labelPrefix="Site" />

        <Divider orientation="left">Summary</Divider>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Amenities (Mention Details)" name="amenitiesDetails">
            <Input />
          </Form.Item>
          <Form.Item label="Value of Amenities (A)" name="amenitiesValue">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Lift Available? (Yes / No)" name="liftAvailable">
            <Select allowClear>
              <Option value="YES">Yes</Option>
              <Option value="NO">No</Option>
              <Option value="NA">NA</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Height of the Building (in Meters)" name="buildingHeight">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Realizable Value after Completion (L3 + C3 + A)"
            name="realizableValue"
            className="md:col-span-2"
          >
            <Input type="number" disabled />
          </Form.Item>
          <Form.Item
            label="Construction Stage"
            name="constructionStage"
            className="md:col-span-2"
          >
            <Select allowClear>
              {[
                "Foundation",
                "Plinth",
                "Brick Work",
                "RCC",
                "Plaster",
                "Tiling",
                "Internal Finishing",
                "Completed",
                "G.F PROPOSED",
                "OPEN PLOT",
              ].map((v) => (
                <Option key={v} value={v}>{v}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Construction %" name="constructionStatus">
            <Input placeholder="e.g. 0%" />
          </Form.Item>
          <Form.Item label="Valuation at Current Stage" name="ValuationatPresentStage">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Valuation as per Govt. Guideline"
            name="ValuationasperGovtGuideline"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Construction Estimate Shared by Customer"
            name="constructionEstimateByCustomer"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Estimate Recommended (by Valuer)"
            name="estimateRecommendedByValuer"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Market Rate for Similar Properties (Rs/sq.ft)"
            name="marketRatePerSqft"
          >
            <Input placeholder="e.g. 1600-1700" />
          </Form.Item>
          <Form.Item
            label="Whether Construction is as per Plan / Permission / By-Laws"
            name="constructionAsPerPlan"
          >
            <Select allowClear>
              <Option value="Yes">Yes</Option>
              <Option value="No">No</Option>
              <Option value="NA">NA</Option>
            </Select>
          </Form.Item>
        </div>

        <Divider orientation="left">
          <span className="font-bold text-2xl  text-red-600">Observations / Remarks — Section 11</span>
        </Divider>

        {hasExtracted && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-4 text-sm text-blue-800 flex gap-2">
            <span className="text-lg">✅</span>
            <span>
              <b>Document se auto-fill ho gaya:</b> Seller/buyer names, person met,
              contact no., land area aur rate remarks mein inject ho gaye hain.
            </span>
          </div>
        )}

        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
          {remarks.map((remark, index) => (
            <RemarkEditor
              key={index}
              index={index}
              value={remark}
              onChange={handleRemarkChange}
              onRemove={removeRemarkField}
              canRemove={index >= 1}
            />
          ))}

          <Button
            type="dashed"
            onClick={addRemarkField}
            icon={<PlusOutlined />}
            className="mt-1"
          >
            Add Remark
          </Button>
        </div>

        {analysis && (
          <>
            <Divider orientation="left">
              <span className="font-bold text-orange-600">Analysis — Extracted Document Data</span>
            </Divider>

            <div className="border border-orange-200 rounded-lg overflow-hidden mb-6">
              <div className="bg-orange-500 text-white px-4 py-2 text-sm font-semibold flex flex-wrap gap-4">
                <span>📄 {analysis.docType}</span>
                <span>| Reg No: {analysis.regNo}</span>
                <span>| Date: {analysis.regDate}</span>
              </div>

              <div className="p-4 space-y-2">
                {[
                  { q: "As per doc plot area", a: `${analysis.plotArea}${analysis.plotDim !== "—" ? ` (${analysis.plotDim})` : ""}` },
                  { q: "What is land uses of property", a: analysis.propUse },
                  { q: "The property is Leasehold or Freehold", a: analysis.docType === "Conveyance" ? "Freehold (Conveyance deed)" : "Check document" },
                  { q: "What is the issue in this property", a: "To be filled by valuer after inspection" },
                  { q: "What is uses of this property", a: `${analysis.propType} — ${analysis.propUse}` },
                  { q: "Which kind of documents I received", a: `${analysis.docType} (Reg: ${analysis.regNo}, Date: ${analysis.regDate})` },
                ].map(({ q, a }, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-orange-50 rounded">
                    <span className="text-orange-500 font-bold min-w-[20px] mt-0.5">→</span>
                    <div className="text-sm">
                      <b className="text-orange-700">{q}:</b>
                      <span className="ml-2 text-gray-800">{a}</span>
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pt-3 border-t border-orange-200">
                  <InfoCard label="SELLER" value={analysis.sellers} />
                  <InfoCard label="BUYER" value={analysis.buyers} />
                  {analysis.address && <InfoCard label="ADDRESS" value={analysis.address} className="md:col-span-2" />}
                  {analysis.boundaries && <InfoCard label="BOUNDARIES" value={analysis.boundaries} className="md:col-span-2" />}
                </div>

                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-orange-600 font-semibold hover:underline">
                    View full extracted JSON ▼
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-50 border rounded p-3 overflow-auto max-h-64 text-gray-600 leading-relaxed">
                    {JSON.stringify(analysis.raw, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </>
        )}

        {showActionButtons && (
          <Form.Item className="lg:col-span-2 text-end">
            {onBack && (
              <Button
                type="default"
                onClick={onBack}
                className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
              >
                Back
              </Button>
            )}
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default ValuationDetails;
