import React from "react";
import { Form, Input, Select, Checkbox, Button, Row, Col } from "antd";
import toast from "react-hot-toast";

const { Option } = Select;
const { TextArea } = Input;

const flooringOptions = [
  "Cement",
  "Ceramic Tiles",
  "Granite",
  "Marble",
  "Mosaic",
  "Stone",
  "Tiles",
  "Under Construction",
  "Vitrified Tiles",
];

const naturalProtectionOptions = [
  "Earthquake Protection",
  "Fire Fighting System",
  "Floods Protection",
  "Landslide Protection",
  "Tsunami Protection",
  "Volcanic Eruption Protection",
];

const facilitiesOptions = [
  "CCTV",
  "Club House",
  "Community Hall",
  "Covered Car Park",
  "Gym",
  "Intercom Facility",
  "Kids Play Area",
  "Lift",
  "No Additional Amenities",
  "Power Backup - For Common Areas",
  "Power Backup - For Limited Points & Common Area",
  "Power Backup - For Entire Building",
  "Security",
  "Swimming Pool",
];

const ValuationForm = ({ onNext }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // console.log("Submitted Data:", values);
    onNext(values);
    toast.success("saved successfully!");
  };

  return (
    <div className='p-4'>
      <h2 className='text-lg font-semibold mb-4'>Valuation Details</h2>
      <Form layout='vertical' form={form} onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name='caution_property' label='Caution Property'>
              <Select placeholder='Select'>
                <Option value='YES'>YES</Option>
                <Option value='NO'>NO</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='usage_master_plan' label='Usage - Master Plan'>
              <Select placeholder='Select'>
                <Option value='Residential'>Residential</Option>
                <Option value='Commercial'>Commercial</Option>
                <Option value='Industrial'>Industrial</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='usage_site' label='Usage - Site'>
              <Select placeholder='Select'>
                <Option value='Residential'>Residential</Option>
                <Option value='Commercial'>Commercial</Option>
                <Option value='Industrial'>Industrial</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name='marketability' label='Marketability'>
              <Select placeholder='Select'>
                <Option value='EXCELLENT'>EXCELLENT</Option>
                <Option value='GOOD'>GOOD</Option>
                <Option value='AVERAGE'>AVERAGE</Option>
                <Option value='BELOW AVERAGE'>BELOW AVERAGE</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='rental_value' label='Rental Value'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='factor_enhancing' label='Enhancing Factors'>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name='factor_affecting' label='Affecting Factors'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='building_spec_1' label='Building Spec 1'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='building_spec_2' label='Building Spec 2'>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name='flooring' label='Flooring'>
              <Checkbox.Group options={flooringOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name='details_of_rooms' label='Details of Rooms'>
              <TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name='natural_protection' label='Natural Protection'>
              <Checkbox.Group options={naturalProtectionOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name='facilities' label='Facilities'>
              <Checkbox.Group options={facilitiesOptions} />
            </Form.Item>
          </Col>
        </Row>

        {/* Add more rows for construction details, area, valuation, etc., as needed */}

        <Form.Item>
          <Button type='primary' htmlType='submit' className='mt-4'>
            Save & Next
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ValuationForm;
