import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Input, Select, Button, Card, Typography, Form } from "antd";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const JobForm = () => {
  const { selectedValuation } =
    useSelector((state) => state?.HeroFinCorp) || {};
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedValuation) {
      form.setFieldsValue(selectedValuation);
    }
  }, [selectedValuation, form]);

  const transactionTypeOptions = ["Purchase", "Refinance", "Construction"];
  const propertyTypeOptions = ["Residential", "Commercial", "Industrial"];

  return (
    <div className='p-4'>
      <Card className='mb-4 shadow rounded-lg'>
        <Text className='text-sm text-gray-500'>Order Address</Text>
        <Title level={5} className='text-[#007b8f]'>
          GRAM AMADARI PH NO 04 DEWANGANG TEHSIL RAISEN
        </Title>
      </Card>

      <div className='bg-[#007b8f] text-white px-4 py-2 rounded-t-lg flex justify-between items-center'>
        <strong>Edit Job VL3-ZX23-VXL</strong>
        <div className='space-x-2'>
          <Button type='primary' className='bg-green-600 border-none'>
            Proceed
          </Button>
          <Button className='bg-gray-500 text-white border-none'>Cancel</Button>
          <Button type='primary'>Save</Button>
        </div>
      </div>

      <Card className='rounded-t-none shadow'>
        <Form layout='vertical' form={form}>
          <Form.Item label='Bank Name/Ref' name='bankName'>
            <Input />
          </Form.Item>

          <Form.Item label='Bank Ref No' name='bankRefNo'>
            <Input disabled />
          </Form.Item>

          <Form.Item label='Business Division' name='businessDivision'>
            <Input />
          </Form.Item>

          <Form.Item label='Internal Reference' name='internalRef'>
            <Input disabled />
          </Form.Item>

          <Form.Item label='Applicant Name' name='applicantName'>
            <Input />
          </Form.Item>

          <Form.Item label='Application Reference' name='applicationRef'>
            <Input />
          </Form.Item>

          <Form.Item label='Transaction Type' name='transactionType'>
            <Select placeholder='Select Transaction Type'>
              {transactionTypeOptions.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='Bank Contact Person' name='contactPerson'>
            <Input />
          </Form.Item>

          <Form.Item label='Bank Contact Person Mobile' name='contactMobile'>
            <Input disabled />
          </Form.Item>

          <Form.Item label='Bank Contact Person Email' name='contactEmail'>
            <Input />
          </Form.Item>

          <Form.Item label='Loan Purpose' name='loanPurpose'>
            <TextArea />
          </Form.Item>

          <Form.Item label='Property Type' name='propertyType' required>
            <Select placeholder='Select Property Type'>
              {propertyTypeOptions.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label='Valuation Type' name='valuationType'>
            <Input />
          </Form.Item>

          <Form.Item
            label='Any Special Instructions'
            name='specialInstructions'
          >
            <TextArea />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default JobForm;
