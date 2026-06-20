import React, { useEffect } from "react";
import { Form, Input, Button, Select } from "antd";

const { Option } = Select;

const PropertyDetails = ({
  isEdit,
  onNext,
  onBack,
  registerSectionSubmitter,
  sectionId,
  showActionButtons = true,
  extractedData,
  visibleSection = "boundaries",
}) => {
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form) || {};
  const hasValue = (name) => formValues[name] !== undefined && formValues[name] !== null && formValues[name] !== "";

  const initialValues = {
    directions: {
      North: { document: "", actual: "", plan: "" },
      South: { document: "", actual: "", plan: "" },
      East: { document: "", actual: "", plan: "" },
      West: { document: "", actual: "", plan: "" },
    },
    boundariesMatching: undefined,
    propertyDemarcated: undefined,
    boundaryRemarks: "",
    plotArea: "",
    linearDimension: "",
    marketability: undefined,
    // Structural
    typeOfStructure: undefined,
    typeOfRoof: undefined,
    noOfFloorsPermissible: "",
    noOfFloorsActual: "",
    noOfUnitFlatOnEachFloor: "",
    qualityOfConstruction: undefined,
    approxAgeOfProperty: "",
    residualAge: "",
    landArea: "",
  };

  useEffect(() => {
    const currentValues = form.getFieldsValue();
    const merged = { ...isEdit };

    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const bounds = p.boundaries || {};
      const propDet = p.property_details || {};
      const accom = p.accommodation_details || {};
      const val = p.valuation_details || {};

      const mapped = {
        boundariesMatching: extractedData.boundariesMatching,
        propertyDemarcated: propDet.property_identification || propDet.property_demarcated || extractedData.propertyDemarcated,
        plotArea: val.plot_area_physical || p.plot_area || extractedData.plotArea,
        landArea: val.plot_area_physical || p.plot_area || extractedData.landArea,
        marketability: accom.marketability || extractedData.marketability,
        typeOfStructure: p.property_sub_type || accom.type_of_structure || extractedData.typeOfStructure,
        qualityOfConstruction: accom.quality_of_construction || extractedData.qualityOfConstruction,
        approxAgeOfProperty: accom.age_of_property || extractedData.approxAgeOfProperty,
        residualAge: accom.residual_age || extractedData.residualAge,
        directions: {
          North: {
            document: bounds.north_as_per_deed || extractedData.northDocument || "",
            actual: bounds.north_actual || extractedData.northActual || "",
            plan: bounds.north_as_per_deed || extractedData.northPlan || extractedData.northDocument || "",
          },
          South: {
            document: bounds.south_as_per_deed || extractedData.southDocument || "",
            actual: bounds.south_actual || extractedData.southActual || "",
            plan: bounds.south_as_per_deed || extractedData.southPlan || extractedData.southDocument || "",
          },
          East: {
            document: bounds.east_as_per_deed || extractedData.eastDocument || "",
            actual: bounds.east_actual || extractedData.eastActual || "",
            plan: bounds.east_as_per_deed || extractedData.eastPlan || extractedData.eastDocument || "",
          },
          West: {
            document: bounds.west_as_per_deed || extractedData.westDocument || "",
            actual: bounds.west_actual || extractedData.westActual || "",
            plan: bounds.west_as_per_deed || extractedData.westPlan || extractedData.westDocument || "",
          },
        }
      };

      Object.entries(mapped).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== "") {
          merged[key] = val;
        }
      });
    }

    if (merged) {
      const safeVal = (key, fallback = "") => {
        if (merged[key] !== undefined && merged[key] !== null && merged[key] !== "") {
          return merged[key];
        }
        return currentValues[key] !== undefined && currentValues[key] !== null ? currentValues[key] : fallback;
      };

      const safeNested = (dir, field, fallback = "") => {
        const extVal = merged?.directions?.[dir]?.[field] || merged[`${dir.toLowerCase()}${field.charAt(0).toUpperCase()}${field.slice(1)}`] || "";
        if (extVal !== undefined && extVal !== null && extVal !== "") {
          return extVal;
        }
        return currentValues?.directions?.[dir]?.[field] !== undefined && currentValues?.directions?.[dir]?.[field] !== null 
          ? currentValues.directions[dir][field] 
          : fallback;
      };

      form.setFieldsValue({
        directions: {
          North: {
            document: safeNested("North", "document"),
            actual: safeNested("North", "actual"),
            plan: safeNested("North", "plan"),
          },
          South: {
            document: safeNested("South", "document"),
            actual: safeNested("South", "actual"),
            plan: safeNested("South", "plan"),
          },
          East: {
            document: safeNested("East", "document"),
            actual: safeNested("East", "actual"),
            plan: safeNested("East", "plan"),
          },
          West: {
            document: safeNested("West", "document"),
            actual: safeNested("West", "actual"),
            plan: safeNested("West", "plan"),
          },
        },
        boundariesMatching: safeVal("boundariesMatching") || undefined,
        propertyDemarcated: safeVal("propertyDemarcated") || undefined,
        boundaryRemarks: safeVal("boundaryRemarks"),
        plotArea: safeVal("plotArea"),
        linearDimension: safeVal("linearDimension"),
        marketability: safeVal("marketability") || undefined,
        typeOfStructure: safeVal("typeOfStructure") || undefined,
        typeOfRoof: safeVal("typeOfRoof") || undefined,
        noOfFloorsPermissible: safeVal("noOfFloorsPermissible"),
        noOfFloorsActual: safeVal("noOfFloorsActual"),
        noOfUnitFlatOnEachFloor: safeVal("noOfUnitFlatOnEachFloor"),
        qualityOfConstruction: safeVal("qualityOfConstruction") || undefined,
        approxAgeOfProperty: safeVal("approxAgeOfProperty"),
        residualAge: safeVal("residualAge"),
        landArea: safeVal("landArea"),
      });
    }
  }, [isEdit, extractedData, form]);

  const handleFinish = (values) => {
    if (!onNext) return;
    onNext(values);
  };

  useEffect(() => {
    if (!registerSectionSubmitter || !sectionId) return;

    registerSectionSubmitter(sectionId, async () => form.validateFields());

    return () => {
      registerSectionSubmitter(sectionId, null);
    };
  }, [registerSectionSubmitter, sectionId, form]);

  const showBoundaries = visibleSection === "boundaries";
  const showStructural = visibleSection === "structural";

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-slate-800">
        {showStructural ? "Structural Details" : "Boundaries"}
      </h2>

      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={handleFinish}
        style={{ display: "block", width: "100%" }}
      >
        <style>{`
          .custom-form-item-wrapper label {
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
          .custom-form-item-wrapper:focus-within label,
          .custom-form-item-wrapper:has(.ant-form-item-has-error) label,
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
          .custom-form-item-wrapper:has(.ant-form-item-has-error) label {
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
        `}</style>

        {/* ── Section 7: Boundaries ── */}
        {showBoundaries && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            {/* Boundaries Table */}
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "12px 10px", textAlign: "left", color: "#475569", fontWeight: 600 }}>Direction</th>
                    <th style={{ padding: "12px 10px", textAlign: "left", color: "#475569", fontWeight: 600 }}>As per Document</th>
                    <th style={{ padding: "12px 10px", textAlign: "left", color: "#475569", fontWeight: 600 }}>As per Site</th>
                    <th style={{ padding: "12px 10px", textAlign: "left", color: "#475569", fontWeight: 600 }}>As per Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {["North", "South", "East", "West"].map((dir) => (
                    <tr key={dir} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 10px", fontWeight: 600, color: "#1e293b" }}>{dir}</td>
                      <td style={{ padding: "8px 4px" }}>
                        <Form.Item name={["directions", dir, "document"]} style={{ margin: 0 }}>
                          <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
                        </Form.Item>
                      </td>
                      <td style={{ padding: "8px 4px" }}>
                        <Form.Item name={["directions", dir, "actual"]} style={{ margin: 0 }}>
                          <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
                        </Form.Item>
                      </td>
                      <td style={{ padding: "8px 4px" }}>
                        <Form.Item name={["directions", dir, "plan"]} style={{ margin: 0 }}>
                          <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
                        </Form.Item>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Fields Stack */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginTop: "12px", width: "100%" }}>
              <div className={`custom-form-item-wrapper ${hasValue("boundariesMatching") ? "has-value" : ""}`} style={{ position: "relative" }}>
                <label>Boundaries Matching</label>
                <Form.Item name="boundariesMatching" rules={[{ required: true, message: "Required!" }]} style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Boundaries Matching">
                    <Option value="YES">Yes</Option>
                    <Option value="NO">No</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("marketability") ? "has-value" : ""}`} style={{ position: "relative" }}>
                <label>Marketability</label>
                <Form.Item name="marketability" rules={[{ required: true, message: "Required!" }]} style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Marketability">
                    <Option value="Good">Good</Option>
                    <Option value="Average">Average</Option>
                    <Option value="Poor">Poor</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("boundaryRemarks") ? "has-value" : ""}`} style={{ position: "relative", gridColumn: "1 / -1" }}>
                <label>Boundary Remarks in Detail</label>
                <Form.Item name="boundaryRemarks" style={{ margin: 0 }}>
                  <Input.TextArea style={{ borderRadius: "6px", border: "1px solid #d1d5db", minHeight: "80px" }} placeholder="Boundary Remarks in Detail" />
                </Form.Item>
              </div>
            </div>

            {/* Hidden Fields for DB compatibility */}
            <Form.Item name="propertyDemarcated" noStyle><input type="hidden" /></Form.Item>
            <Form.Item name="landArea" noStyle><input type="hidden" /></Form.Item>
            <Form.Item name="linearDimension" noStyle><input type="hidden" /></Form.Item>
            <Form.Item name="plotArea" noStyle><input type="hidden" /></Form.Item>

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
          </div>
        )}

        {/* ── Section 8: Structural Details ── */}
        {showStructural && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", width: "100%" }}>
            <div className={`custom-form-item-wrapper ${hasValue("typeOfStructure") ? "has-value" : ""}`} style={{ position: "relative" }}>
              <label>Type of Structure</label>
              <Form.Item name="typeOfStructure" rules={[{ required: true, message: "Type of Structure is required" }]} style={{ margin: 0 }}>
                <Select allowClear className="w-full" placeholder="Type of Structure">
                  <Option value="RCC">RCC</Option>
                  <Option value="Load Bearing">Load Bearing</Option>
                </Select>
              </Form.Item>
            </div>

            <div className={`custom-form-item-wrapper ${hasValue("typeOfRoof") ? "has-value" : ""}`} style={{ position: "relative" }}>
              <label>Type of Roof</label>
              <Form.Item name="typeOfRoof" rules={[{ required: true, message: "Type of Roof is required" }]} style={{ margin: 0 }}>
                <Select allowClear className="w-full" placeholder="Type of Roof">
                  <Option value="ACC Sheet">ACC Sheet</Option>
                  <Option value="Stone Patti">Stone Patti</Option>
                  <Option value="Tin Sheet">Tin Sheet</Option>
                  <Option value="Terracotta Tiles">Terracotta Tiles</Option>
                  <Option value="RCC">RCC</Option>
                </Select>
              </Form.Item>
            </div>

            <div className={`custom-form-item-wrapper ${hasValue("noOfFloorsPermissible") ? "has-value" : ""}`} style={{ position: "relative" }}>
              <label>No. of Floors Permissible</label>
              <Form.Item name="noOfFloorsPermissible" rules={[{ required: true, message: "Required" }]} style={{ margin: 0 }}>
                <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="No. of Floors Permissible" />
              </Form.Item>
            </div>

            <div className={`custom-form-item-wrapper ${hasValue("noOfFloorsActual") ? "has-value" : ""}`} style={{ position: "relative" }}>
              <label>No. of Floors - Actual</label>
              <Form.Item name="noOfFloorsActual" rules={[{ required: true, message: "Required" }]} style={{ margin: 0 }}>
                <Input type="number" style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="No. of Floors - Actual" />
              </Form.Item>
            </div>

            <div className={`custom-form-item-wrapper ${hasValue("noOfUnitFlatOnEachFloor") ? "has-value" : ""}`} style={{ position: "relative" }}>
              <label>No. of Units / Flats per Floor</label>
              <Form.Item name="noOfUnitFlatOnEachFloor" rules={[{ required: true, message: "Required" }]} style={{ margin: 0 }}>
                <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="No. of Units / Flats per Floor" />
              </Form.Item>
            </div>

            <div className={`custom-form-item-wrapper ${hasValue("qualityOfConstruction") ? "has-value" : ""}`} style={{ position: "relative" }}>
              <label>Quality of Construction</label>
              <Form.Item name="qualityOfConstruction" rules={[{ required: true, message: "Required" }]} style={{ margin: 0 }}>
                <Select allowClear className="w-full" placeholder="Quality of Construction">
                  <Option value="Good">Good</Option>
                  <Option value="Average">Average</Option>
                  <Option value="Poor">Poor</Option>
                </Select>
              </Form.Item>
            </div>

            <div className={`custom-form-item-wrapper ${hasValue("approxAgeOfProperty") ? "has-value" : ""}`} style={{ position: "relative" }}>
              <label>Property Age (Years)</label>
              <Form.Item name="approxAgeOfProperty" rules={[{ required: true, message: "Required" }]} style={{ margin: 0 }}>
                <Input type="number" style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Property Age (Years)" />
              </Form.Item>
            </div>

            <div className={`custom-form-item-wrapper ${hasValue("residualAge") ? "has-value" : ""}`} style={{ position: "relative" }}>
              <label>Residual Age (Years)</label>
              <Form.Item name="residualAge" rules={[{ required: true, message: "Required" }]} style={{ margin: 0 }}>
                <Input type="number" style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Residual Age (Years)" />
              </Form.Item>
            </div>

            {/* Save & Proceed Button */}
            <div style={{ gridColumn: "1 / -1", marginTop: "24px" }}>
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
          </div>
        )}

        {/* Actions */}
        {showActionButtons && (
          <div style={{ textAlign: "right", marginTop: "20px" }}>
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

export default PropertyDetails;
