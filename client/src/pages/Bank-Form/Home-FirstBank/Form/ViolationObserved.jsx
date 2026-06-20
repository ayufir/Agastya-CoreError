
import React, { useEffect } from "react";
import { Form, Input, Button, Select } from "antd";

const { Option } = Select;

const ViolationObserved = ({
  isEdit,
  onNext,
  onBack,
  registerSectionSubmitter,
  sectionId,
  showActionButtons = true,
  extractedData,
}) => {
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form) || {};
  const hasValue = (name) => formValues[name] !== undefined && formValues[name] !== null && formValues[name] !== "";

  useEffect(() => {
    const currentValues = form.getFieldsValue();
    const merged = { ...isEdit };

    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const legal = p.legal_and_compliance || {};

      const mapped = {
        deviationToPlan: legal.deviation_from_plan || extractedData.deviationToPlan,
        demolitionRisk: legal.risk_of_demolition || extractedData.demolitionRisk,
      };

      Object.entries(mapped).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== "") {
          merged[key] = val;
        }
      });
    }

    if (merged) {
      const safeVal = (key, fallback = undefined) => {
        if (merged[key] !== undefined && merged[key] !== null && merged[key] !== "") {
          return merged[key];
        }
        return currentValues[key] !== undefined && currentValues[key] !== null ? currentValues[key] : fallback;
      };

      form.setFieldsValue({
        deviationToPlan: safeVal("deviationToPlan", "No"),
        deviationDetails: safeVal("deviationDetails", "NA"),
        demolitionRisk: safeVal("violationDemolitionRisk") || safeVal("demolitionRiskViolation") || safeVal("demolitionRisk") || undefined,
        demolitionDetails: safeVal("demolitionDetails") || "",
        encroachment: safeVal("encroachment") || undefined,
        encroachmentDetails: safeVal("encroachmentDetails") || "",
      });
    }
  }, [isEdit, extractedData, form]);

  const handleSubmit = (values) => {
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

  const handleConditionalFields = (changedValues) => {
    if ("demolitionRisk" in changedValues) {
      if (changedValues.demolitionRisk === "No") {
        form.setFieldsValue({ demolitionDetails: "NA" });
      } else if (changedValues.demolitionRisk === "Yes") {
        const current = form.getFieldValue("demolitionDetails");
        if (current === "NA" || !current) {
          form.setFieldsValue({ demolitionDetails: "" });
        }
      }
    }
    if ("encroachment" in changedValues) {
      if (changedValues.encroachment === "No") {
        form.setFieldsValue({ encroachmentDetails: "NA" });
      } else if (changedValues.encroachment === "Yes") {
        const current = form.getFieldValue("encroachmentDetails");
        if (current === "NA" || !current) {
          form.setFieldsValue({ encroachmentDetails: "" });
        }
      }
    }
  };

  const isDemolitionYes = formValues.demolitionRisk === "Yes";
  const isEncroachmentYes = formValues.encroachment === "Yes";

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-slate-800">Violation</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleConditionalFields}
        initialValues={{
          deviationToPlan: "No",
          deviationDetails: "NA",
          demolitionRisk: undefined,
          demolitionDetails: "",
          encroachment: undefined,
          encroachmentDetails: "",
        }}
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

        {/* Hidden inputs to preserve deviation fields for database */}
        <Form.Item name="deviationToPlan" noStyle>
          <input type="hidden" />
        </Form.Item>
        <Form.Item name="deviationDetails" noStyle>
          <input type="hidden" />
        </Form.Item>

        <div className="flex flex-col gap-y-6">
          {/* Row 1: Demolition Risk */}
          <div className={isDemolitionYes ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "grid grid-cols-1 gap-6"}>
            <div className={`custom-form-item-wrapper ${hasValue("demolitionRisk") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
              <label>Demolition risk due to violation?</label>
              <Form.Item name="demolitionRisk" rules={[{ required: true, message: "Required!" }]} style={{ margin: 0 }}>
                <Select allowClear placeholder="Demolition risk due to violation?">
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </div>

            {isDemolitionYes && (
              <div className={`custom-form-item-wrapper ${hasValue("demolitionDetails") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Demolition Remarks</label>
                <Form.Item
                  name="demolitionDetails"
                  rules={[{ required: true, message: "Please enter Demolition Remarks" }]}
                  style={{ margin: 0 }}
                >
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Demolition Remarks" />
                </Form.Item>
              </div>
            )}
          </div>

          {/* Row 2: Encroachment */}
          <div className={isEncroachmentYes ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "grid grid-cols-1 gap-6"}>
            <div className={`custom-form-item-wrapper ${hasValue("encroachment") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
              <label>Encroachment of land?</label>
              <Form.Item name="encroachment" rules={[{ required: true, message: "Required!" }]} style={{ margin: 0 }}>
                <Select allowClear placeholder="Encroachment of land?">
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </div>

            {isEncroachmentYes && (
              <div className={`custom-form-item-wrapper ${hasValue("encroachmentDetails") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Encroachment Remarks</label>
                <Form.Item
                  name="encroachmentDetails"
                  rules={[{ required: true, message: "Please enter Encroachment Remarks" }]}
                  style={{ margin: 0 }}
                >
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Encroachment Remarks" />
                </Form.Item>
              </div>
            )}
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
        </div>

        {/* Actions for standard navigation if visible */}
        {showActionButtons && (
          <div className="text-right mt-4">
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

export default ViolationObserved;

