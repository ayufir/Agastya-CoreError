import React, { useState } from "react";
import { Form, Select, Checkbox, Button } from "antd";
import toast from "react-hot-toast";

const { Option } = Select;

const Characteristic = ({ onNext }) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    developmentLocality: "",
    surroundingUsage: [],
    classification: "",
    facilities: [],
    waterSupply: [],
    sanitarySystem: [],
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        onNext(formData);
        toast.success("saved successfully!");
      })
      .catch((err) => {
        console.error("Validation Failed:", err);
      });
  };

  return (
    <div className='bg-white p-6 rounded shadow'>
      <Form form={form} layout='vertical'>
        <Form.Item
          label='Development (Locality) *'
          name='developmentLocality'
          rules={[{ required: true, message: "Please select a value" }]}
        >
          <Select
            placeholder='Select Development'
            value={formData.developmentLocality}
            onChange={(value) => handleChange("developmentLocality", value)}
          >
            <Option value='Average Developing'>Average Developing</Option>
            <Option value='Developed'>Developed</Option>
            <Option value='Under Developing'>Under Developing</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label='Usage of Surrounding Property *'
          name='surroundingUsage'
          rules={[{ required: true, message: "Please select at least one" }]}
        >
          <Checkbox.Group
            className='flex flex-wrap gap-3'
            options={[
              "Agricultural",
              "Commercial",
              "Dry Vacant Land",
              "Industrial",
              "Institutional",
              "Logistic",
              "Residential",
              "Residential Cum Commercial",
              "Warehouse",
            ]}
            value={formData.surroundingUsage}
            onChange={(checkedValues) =>
              handleChange("surroundingUsage", checkedValues)
            }
          />
        </Form.Item>

        <Form.Item
          label='Classification of Locality *'
          name='classification'
          rules={[{ required: true, message: "Please select a value" }]}
        >
          <Select
            placeholder='Select Classification'
            value={formData.classification}
            onChange={(value) => handleChange("classification", value)}
          >
            <Option value='High Class'>High Class</Option>
            <Option value='Middle Class'>Middle Class</Option>
            <Option value='Low Class'>Low Class</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label='Facility Available *'
          name='facilities'
          rules={[{ required: true, message: "Please select at least one" }]}
        >
          <Checkbox.Group
            className='flex flex-wrap gap-3'
            options={[
              "Electrical Line",
              "Gated Communities",
              "Road",
              "Street Light",
              "Telephone Line",
            ]}
            value={formData.facilities}
            onChange={(val) => handleChange("facilities", val)}
          />
        </Form.Item>

        <Form.Item
          label='Water Supply *'
          name='waterSupply'
          rules={[{ required: true, message: "Please select at least one" }]}
        >
          <Checkbox.Group
            className='flex flex-wrap gap-3'
            options={[
              "Bore Well",
              "Local Body Water Connection",
              "Open Well",
              "Over Head Tank",
              "Under Ground Sump",
            ]}
            value={formData.waterSupply}
            onChange={(val) => handleChange("waterSupply", val)}
          />
        </Form.Item>

        <Form.Item
          label='Sanitary System *'
          name='sanitarySystem'
          rules={[{ required: true, message: "Please select at least one" }]}
        >
          <Checkbox.Group
            className='flex flex-wrap gap-3'
            options={[
              "Septic Tank",
              "Sewage Treatment Plant",
              "Under Ground Sewage System",
            ]}
            value={formData.sanitarySystem}
            onChange={(val) => handleChange("sanitarySystem", val)}
          />
        </Form.Item>

        <div className='flex justify-end'>
          <Button type='primary' onClick={handleSubmit}>
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Characteristic;
