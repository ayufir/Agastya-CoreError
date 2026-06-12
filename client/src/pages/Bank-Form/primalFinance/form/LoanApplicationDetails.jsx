import React, { useEffect } from "react";
import { Input, DatePicker, Button, Form, Select } from "antd";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const { Option } = Select;

const LoanApplicationDetails = ({ isEdit, onNext, onBack, data = {} }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data?.dateOfVisit) {
      form.setFieldsValue({
        ...data,
        dateOfVisit: dayjs(data.dateOfVisit),
      });
    } else {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  // Dummy data for testing
  const dummyData = {
    branchName: "Pune Main Branch",
    applicationNo: "APP123456",
    customerNo: "CUST789",
    applicationStatus: "In Progress",
    applicantName: "Rahul Sharma",
    product: "Home Loan",
    transactionType: "New Loan",
    visitDoneBy: "Amit Kumar",
    dateOfVisit: dayjs("2025-05-01"), // Date in dayjs format
    locationType: "Urban",
    valuationApproaches: "Market Approach",
    valuationMethodology: "Comparative Method",
  };

  const handleFinish = (values) => {
    const formattedData = {
      ...data,
      loanApplicationDetails: {
        ...values,
        dateOfVisit: values.dateOfVisit
          ? values.dateOfVisit.toISOString()
          : undefined,
      },
    };
    onNext(formattedData);
    toast.success("Saved successfully");
  };

  // const handleFinish = (values) => {
  //   onNext(values);
  //   toast.success("Saved successfully");
  // };

  return (
    <div className='bg-white p-6 rounded-md shadow-md'>
      <h2 className='text-xl font-semibold text-gray-800 mb-4'>
        Loan Application Details
      </h2>

      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={dummyData}
      >
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Form.Item
            label='Branch Name'
            name='branchName'
            rules={[{ required: true, message: "Please enter branch name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Application No.'
            name='applicationNo'
            rules={[
              { required: true, message: "Please enter application number" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Customer No.'
            name='customerNo'
            rules={[
              { required: true, message: "Please enter customer number" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Application Status'
            name='applicationStatus'
            rules={[
              { required: true, message: "Please select application status" },
            ]}
          >
            <Select placeholder='Select status'>
              <Option value='Open'>Open</Option>
              <Option value='In Progress'>In Progress</Option>
              <Option value='Completed'>Completed</Option>
              <Option value='Rejected'>Rejected</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label='Applicant Name'
            name='applicantName'
            rules={[{ required: true, message: "Please enter applicant name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Product'
            name='product'
            rules={[{ required: true, message: "Please enter product" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Transaction Type'
            name='transactionType'
            rules={[
              { required: true, message: "Please enter transaction type" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Visit Done By'
            name='visitDoneBy'
            rules={[
              { required: true, message: "Please enter name of the person" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Date of Visit'
            name='dateOfVisit'
            rules={[{ required: true, message: "Please select visit date" }]}
          >
            <DatePicker className='w-full' format='YYYY-MM-DD' />
          </Form.Item>
        </div>

        <h3 className='text-lg font-medium mt-6 mb-3 text-gray-700'>
          Valuation Guideline
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Form.Item
            label='Location Type'
            name='locationType'
            rules={[{ required: true, message: "Please select location type" }]}
          >
            <Select placeholder='Select location type'>
              <Option value='Urban'>Urban</Option>
              <Option value='Semi-Urban'>Semi-Urban</Option>
              <Option value='Rural'>Rural</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label='Valuation Approaches'
            name='valuationApproaches'
            rules={[
              { required: true, message: "Please enter valuation approaches" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Valuation Methodology'
            name='valuationMethodology'
            rules={[
              { required: true, message: "Please enter valuation methodology" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className='flex justify-between mt-6'>
          <Button type='default' onClick={onBack}>
            Back
          </Button>
          <Button type='primary' htmlType='submit'>
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoanApplicationDetails;
