
import React, { useEffect } from "react";
import { Form, Input, Button, Select, Row, Col, Divider } from "antd";

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
      const safeVal = (key, fallback = "") => {
        if (merged[key] !== undefined && merged[key] !== null && merged[key] !== "") {
          return merged[key];
        }
        return currentValues[key] !== undefined && currentValues[key] !== null ? currentValues[key] : fallback;
      };

      form.setFieldsValue({
        deviationToPlan: safeVal("deviationToPlan", "No"),
        deviationDetails: safeVal("deviationDetails", "NA"),
        demolitionRisk: safeVal("violationDemolitionRisk") || safeVal("demolitionRiskViolation") || safeVal("demolitionRisk", "No"),
        demolitionDetails: safeVal("demolitionDetails", "NA"),
        encroachment: safeVal("encroachment", "No"),
        encroachmentDetails: safeVal("encroachmentDetails", "NA"),
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
    if ("deviationToPlan" in changedValues && changedValues.deviationToPlan === "No") {
      form.setFieldsValue({ deviationDetails: "NA" });
    }
    if ("demolitionRisk" in changedValues && changedValues.demolitionRisk === "No") {
      form.setFieldsValue({ demolitionDetails: "NA" });
    }
    if ("encroachment" in changedValues && changedValues.encroachment === "No") {
      form.setFieldsValue({ encroachmentDetails: "NA" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-red-600">VIOLATION OBSERVED, IF ANY</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleConditionalFields}
        initialValues={{
          deviationToPlan: "No",
          deviationDetails: "NA",
          demolitionRisk: "No",
          demolitionDetails: "NA",
          encroachment: "No",
          encroachmentDetails: "NA",
        }}
      >
        <Row gutter={16}>
          <Col span={24}>

            {/* Deviation to Plan */}
            <Divider orientation="left">Deviation to Plan</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="deviationToPlan" label="Deviation to Plan">
                  <Select>
                    <Select.Option value="Yes">Yes</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="deviationDetails"
                  label="Remarks (If Yes)"
                  rules={[
                    ({ getFieldValue }) => ({
                      required: getFieldValue("deviationToPlan") === "Yes",
                      message: "Please provide deviation details",
                    }),
                  ]}
                >
                  <Input disabled={form.getFieldValue("deviationToPlan") === "No"} />
                </Form.Item>
              </Col>
            </Row>

            {/* Demolition Risk due to Violation */}
            <Divider orientation="left">Demolition Risk due to Violation</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="demolitionRisk" label="Demolition Risk due to Violation?">
                  <Select>
                    <Select.Option value="Yes">Yes</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="demolitionDetails"
                  label="Remarks (If Yes)"
                  rules={[
                    ({ getFieldValue }) => ({
                      required: getFieldValue("demolitionRisk") === "Yes",
                      message: "Please provide demolition details",
                    }),
                  ]}
                >
                  <Input disabled={form.getFieldValue("demolitionRisk") === "No"} />
                </Form.Item>
              </Col>
            </Row>

            {/* Encroachment */}
            <Divider orientation="left">Encroachment of Land</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="encroachment" label="Encroachment of Land?">
                  <Select>
                    <Select.Option value="Yes">Yes</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="encroachmentDetails"
                  label="Remarks (If Yes)"
                  rules={[
                    ({ getFieldValue }) => ({
                      required: getFieldValue("encroachment") === "Yes",
                      message: "Please provide encroachment details",
                    }),
                  ]}
                >
                  <Input disabled={form.getFieldValue("encroachment") === "No"} />
                </Form.Item>
              </Col>
            </Row>

          </Col>
        </Row>

        {/* Actions */}
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

export default ViolationObserved;
