
  import React, { useEffect } from "react";
  import { Form, Input, Button, Select, Row, Col } from "antd";

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

    const initialValues = {
      directions: {
        North: { document: "", actual: "", plan: "" },
        South: { document: "", actual: "", plan: "" },
        East: { document: "", actual: "", plan: "" },
        West: { document: "", actual: "", plan: "" },
      },
      boundariesMatching: "",
      propertyDemarcated: "",
      boundaryRemarks: "",
      plotArea: "",
      linearDimension: "",
      marketability: "",
      // Structural
      typeOfStructure: "",
      typeOfRoof: "",
      noOfFloorsPermissible: "",
      noOfFloorsActual: "",
      noOfUnitFlatOnEachFloor: "",
      qualityOfConstruction: "",
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
              document: bounds.north_as_per_deed || extractedData.northDocument,
              actual: bounds.north_actual || extractedData.northActual,
            },
            South: {
              document: bounds.south_as_per_deed || extractedData.southDocument,
              actual: bounds.south_actual || extractedData.southActual,
            },
            East: {
              document: bounds.east_as_per_deed || extractedData.eastDocument,
              actual: bounds.east_actual || extractedData.eastActual,
            },
            West: {
              document: bounds.west_as_per_deed || extractedData.westDocument,
              actual: bounds.west_actual || extractedData.westActual,
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
          boundariesMatching: safeVal("boundariesMatching"),
          propertyDemarcated: safeVal("propertyDemarcated", "YES"),
          boundaryRemarks: safeVal("boundaryRemarks"),
          plotArea: safeVal("plotArea"),
          linearDimension: safeVal("linearDimension"),
          marketability: safeVal("marketability", "Average"),
          typeOfStructure: safeVal("typeOfStructure"),
          typeOfRoof: safeVal("typeOfRoof"),
          noOfFloorsPermissible: safeVal("noOfFloorsPermissible", "NA"),
          noOfFloorsActual: safeVal("noOfFloorsActual"),
          noOfUnitFlatOnEachFloor: safeVal("noOfUnitFlatOnEachFloor", "NA"),
          qualityOfConstruction: safeVal("qualityOfConstruction", "Average"),
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
        <h2 className="text-2xl font-bold mb-6 text-red-600">
          {showStructural ? "Structural Details" : "Boundaries and Dimensions"}
        </h2>

        <Form
          layout="vertical"
          form={form}
          initialValues={initialValues}
          onFinish={handleFinish}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {/* ── Section 7: Boundaries ── */}
          {showBoundaries && (
            <>
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-red-600 mb-4 border-b pb-2">
              7. Boundaries and Dimensions
            </h3>
          </div>

          {["North", "South", "East", "West"].map((dir) => (
            <div key={dir} className="lg:col-span-2 rounded-md bg-gray-50 p-3">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">{dir}</h3>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label="As per Document / ATS" name={["directions", dir, "document"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="As per Site" name={["directions", dir, "actual"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="As per Plan" name={["directions", dir, "plan"]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}

          <Form.Item label="Boundaries Matching?" name="boundariesMatching">
            <Select allowClear>
              <Option value="YES">Yes</Option>
              <Option value="NO">No</Option>
              <Option value="NA">NA</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Property Demarcated?" name="propertyDemarcated">
            <Select allowClear>
              <Option value="YES">Yes</Option>
              <Option value="NO">No</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Boundary Remarks in Detail" name="boundaryRemarks" className="lg:col-span-2">
            <Input />
          </Form.Item>

          <Form.Item label="Marketability (Good / Average / Poor)" name="marketability">
            <Select allowClear>
              <Option value="Good">Good</Option>
              <Option value="Average">Average</Option>
              <Option value="Poor">Poor</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Land Area (Sq. ft)" name="landArea">
            <Input />
          </Form.Item>

          <Form.Item label="Linear Dimension" name="linearDimension">
            <Input placeholder="e.g. 30*66" />
          </Form.Item>

          <Form.Item label="Plot Area (Sq. ft)" name="plotArea">
            <Input type="number" />
          </Form.Item>

          {/* ── Section 8: Structural Details ── */}
            </>
          )}
          {showStructural && (
            <>
          <div className="lg:col-span-2 mt-4">
            <h3 className="text-xl font-semibold text-red-600 mb-4 border-b pb-2">
              8. Structural Details
            </h3>
          </div>

          <Form.Item label="Type of Structure (RCC / Load Bearing / Open Plot)" name="typeOfStructure">
            <Select allowClear>
              <Option value="RCC">RCC</Option>
              <Option value="Load Bearing">Load Bearing</Option>
              <Option value="Open Plot">Open Plot</Option>
              <Option value="RCC + Load Bearing">RCC + Load Bearing</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Type of Roof (ACC Sheet / Stone Patti / Tin Sheet / Terracotta Tiles / Thatch)"
            name="typeOfRoof"
          >
            <Select allowClear>
              <Option value="ACC Sheet">ACC Sheet</Option>
              <Option value="Stone Patti">Stone Patti</Option>
              <Option value="Tin Sheet">Tin Sheet</Option>
              <Option value="Terracotta Tiles">Terracotta Tiles</Option>
              <Option value="Thatch Roof">Thatch Roof</Option>
              <Option value="RCC Slab">RCC Slab</Option>
              <Option value="G.F PROPOSED">G.F Proposed</Option>
            </Select>
          </Form.Item>

          <Form.Item label="No. of Floors Permissible" name="noOfFloorsPermissible">
            <Input />
          </Form.Item>

          <Form.Item label="No. of Floors – Actual" name="noOfFloorsActual">
            <Input type="number" />
          </Form.Item>

          <Form.Item label="No. of Units / Flats on Each Floor" name="noOfUnitFlatOnEachFloor">
            <Input />
          </Form.Item>

          <Form.Item label="Quality of Construction (Good / Avg. / Poor)" name="qualityOfConstruction">
            <Select allowClear>
              <Option value="Good">Good</Option>
              <Option value="Average">Average</Option>
              <Option value="Poor">Poor</Option>
              <Option value="NA">NA</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Age of Property (Years)" name="approxAgeOfProperty">
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Residual Age (Years)" name="residualAge">
            <Input type="number" />
          </Form.Item>
            </>
          )}

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

  export default PropertyDetails;
