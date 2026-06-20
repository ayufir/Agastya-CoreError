import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const FLoorWise = ({
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

    if (extractedData) {
      Object.entries(extractedData).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== "") {
          merged[key] = val;
        }
      });
    }

    const initialFloors = [];
    if (merged.gfPlan || merged.gfSite || merged.gfRemark) {
      initialFloors.push({ floorNo: "Ground Floor", planArea: merged.gfPlan, siteArea: merged.gfSite, remarks: merged.gfRemark });
    }
    if (merged.ffPlan || merged.ffSite || merged.ffRemark) {
      initialFloors.push({ floorNo: "First Floor", planArea: merged.ffPlan, siteArea: merged.ffSite, remarks: merged.ffRemark });
    }
    if (merged.sfPlan || merged.sfSite || merged.sfRemark) {
      initialFloors.push({ floorNo: "Second Floor", planArea: merged.sfPlan, siteArea: merged.sfSite, remarks: merged.sfRemark });
    }
    if (merged.tfPlan || merged.tfSite || merged.tfRemark) {
      initialFloors.push({ floorNo: "Third Floor", planArea: merged.tfPlan, siteArea: merged.tfSite, remarks: merged.tfRemark });
    }
    if (merged.fifthPlan || merged.fifthSite || merged.fifthRemark) {
      initialFloors.push({ floorNo: "Fifth Floor", planArea: merged.fifthPlan, siteArea: merged.fifthSite, remarks: merged.fifthRemark });
    }

    if (initialFloors.length === 0) {
      initialFloors.push({ floorNo: "", planArea: "", siteArea: "", remarks: "" });
    }

    form.setFieldsValue({ floors: initialFloors });
  }, [isEdit, extractedData, form]);

  const handleSubmit = (values) => {
    if (!onNext) return;
    const floors = values.floors || [];
    const mappedValues = {
      gfPlan: floors[0]?.planArea || "",
      gfSite: floors[0]?.siteArea || "",
      gfRemark: floors[0]?.remarks || "",

      ffPlan: floors[1]?.planArea || "",
      ffSite: floors[1]?.siteArea || "",
      ffRemark: floors[1]?.remarks || "",

      sfPlan: floors[2]?.planArea || "",
      sfSite: floors[2]?.siteArea || "",
      sfRemark: floors[2]?.remarks || "",

      tfPlan: floors[3]?.planArea || "",
      tfSite: floors[3]?.siteArea || "",
      tfRemark: floors[3]?.remarks || "",

      fifthPlan: floors[4]?.planArea || "",
      fifthSite: floors[4]?.siteArea || "",
      fifthRemark: floors[4]?.remarks || "",
    };
    onNext(mappedValues);
  };

  useEffect(() => {
    if (!registerSectionSubmitter || !sectionId) return;

    registerSectionSubmitter(sectionId, async () => {
      const values = await form.validateFields();
      const floors = values.floors || [];
      return {
        gfPlan: floors[0]?.planArea || "",
        gfSite: floors[0]?.siteArea || "",
        gfRemark: floors[0]?.remarks || "",

        ffPlan: floors[1]?.planArea || "",
        ffSite: floors[1]?.siteArea || "",
        ffRemark: floors[1]?.remarks || "",

        sfPlan: floors[2]?.planArea || "",
        sfSite: floors[2]?.siteArea || "",
        sfRemark: floors[2]?.remarks || "",

        tfPlan: floors[3]?.planArea || "",
        tfSite: floors[3]?.siteArea || "",
        tfRemark: floors[3]?.remarks || "",

        fifthPlan: floors[4]?.planArea || "",
        fifthSite: floors[4]?.siteArea || "",
        fifthRemark: floors[4]?.remarks || "",
      };
    });

    return () => {
      registerSectionSubmitter(sectionId, null);
    };
  }, [registerSectionSubmitter, sectionId, form]);

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-slate-800">
        Floor Wise Built-up Area
      </h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.List name="floors">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <div
                  key={key}
                  className="border border-slate-200 rounded-xl p-5 mb-5 bg-[#f8fafc]/50 relative"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Row 1: Floor No & Area as per Plan */}
                    <Form.Item
                      {...restField}
                      name={[name, "floorNo"]}
                      style={{ margin: 0 }}
                    >
                      <Input
                        style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                        placeholder="Floor No."
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "planArea"]}
                      style={{ margin: 0 }}
                    >
                      <Input
                        style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                        placeholder="Area as per Plan"
                      />
                    </Form.Item>

                    {/* Row 2: Area as per Site & Remarks */}
                    <Form.Item
                      {...restField}
                      name={[name, "siteArea"]}
                      style={{ margin: 0 }}
                    >
                      <Input
                        style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                        placeholder="Area as per Site"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "remarks"]}
                      style={{ margin: 0 }}
                    >
                      <Input
                        style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                        placeholder="Remarks"
                      />
                    </Form.Item>
                  </div>

                  {/* Actions (Add / Delete) */}
                  <div className="flex items-center gap-4 mt-4">
                    {index === fields.length - 1 && fields.length < 5 && (
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => add()}
                        style={{
                          color: "#0056b3",
                          fontWeight: 600,
                          fontSize: "18px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          height: "auto",
                          width: "auto",
                        }}
                      />
                    )}
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                        style={{
                          fontSize: "18px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          height: "auto",
                          width: "auto",
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </Form.List>

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
              boxShadow: "none",
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

export default FLoorWise;
