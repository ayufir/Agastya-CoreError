// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Input,
//   Select,
//   Table,
//   Collapse,
//   Button,
//   Typography,
//   InputNumber,
// } from "antd";
// const { Panel } = Collapse;
// const { Title } = Typography;
// const { Option } = Select;

// const ValuationDetailsForm = ({
//   onNext,
//   onBack,
//   initialValues = {},
//   isEdit,
// }) => {
//   const [form] = Form.useForm();
//   const [totalAmenitiesCost, setTotalAmenitiesCost] = useState(0);

//   // Handle form submission
//   // const handleFinish = (values) => {
//   //   // Ensure amenities is always an array of 6 objects
//   //   const transformedValues = {
//   //     ...values,
//   //     amenities:
//   //       values.amenities ||
//   //       Array(6).fill({
//   //         description: "",
//   //         areaQuantity: "",
//   //         unit: "",
//   //         amount: "",
//   //       }),
//   //   };
//   //   onNext(transformedValues);
//   // };

//   const handleFinish = (values) => {
//     const formattedData = {
//       ...data,
//       valuationDetails: values,
//     };
//     onNext(formattedData);
//     toast.success("Saved successfully");
//   };

//   // Table columns for Amenities
//   const amenitiesColumns = [
//     {
//       title: "SR. NO.",
//       render: (_, __, index) => index + 1,
//       key: "srNo",
//     },
//     {
//       title: "Description",
//       key: "description",
//       render: (_, __, index) => (
//         <Form.Item name={["amenities", index, "description"]}>
//           <Input placeholder='Description' />
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Area/Quantity",
//       key: "areaQuantity",
//       render: (_, __, index) => (
//         <Form.Item name={["amenities", index, "areaQuantity"]}>
//           <InputNumber placeholder='Area/Quantity' style={{ width: "100%" }} />
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Unit",
//       key: "unit",
//       render: (_, __, index) => (
//         <Form.Item name={["amenities", index, "unit"]}>
//           <Select placeholder='Select Unit'>
//             <Option value='sq.ft'>sq.ft</Option>
//             <Option value='sq.m'>sq.m</Option>
//             <Option value='unit'>unit</Option>
//           </Select>
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Amount",
//       key: "amount",
//       render: (_, __, index) => (
//         <Form.Item name={["amenities", index, "amount"]}>
//           <InputNumber placeholder='Amount' style={{ width: "100%" }} />
//         </Form.Item>
//       ),
//     },
//   ];

//   // Amenities data (6 rows)
//   const amenitiesData = Array.from({ length: 6 }, (_, index) => ({
//     key: index,
//   }));

//   // Watch amenities to calculate total amenities cost dynamically
//   const amenities = Form.useWatch("amenities", form);

//   useEffect(() => {
//     if (Array.isArray(amenities)) {
//       const total = amenities.reduce(
//         (sum, item) => sum + (parseFloat(item?.amount) || 0),
//         0
//       );
//       setTotalAmenitiesCost(total);
//       form.setFieldsValue({ totalAmenitiesCost: total });
//     }
//   }, [amenities]);

//   return (
//     <Collapse
//       defaultActiveKey={["1"]}
//       className='mb-6 border rounded-md bg-white shadow-sm'
//     >
//       <Panel
//         header={
//           <div className='flex justify-between items-center'>
//             <Title level={5} className='!mb-0'>
//               VALUATION DETAILS
//             </Title>
//             <Button type='primary' size='small' disabled={isEdit}>
//               Edit
//             </Button>
//           </div>
//         }
//         key='1'
//       >
//         <Form
//           form={form}
//           layout='vertical'
//           initialValues={{
//             ...initialValues,
//             amenities:
//               initialValues.amenities ||
//               Array(6).fill({
//                 description: "",
//                 areaQuantity: "",
//                 unit: "",
//                 amount: "",
//               }),
//           }}
//           onFinish={handleFinish}
//           className='p-4 bg-gray-100 rounded'
//         >
//           {/* Valuation Calculation */}
//           <Title level={5} className='mt-4 mb-2'>
//             VALUATION CALCULATION
//           </Title>
//           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
//             <Form.Item
//               label='Area Type'
//               name='areaType'
//               rules={[{ required: true, message: "Please select area type" }]}
//             >
//               <Select placeholder='Select Area Type'>
//                 <Option value='RESIDENTIAL'>Residential</Option>
//                 <Option value='COMMERCIAL'>Commercial</Option>
//                 <Option value='INDUSTRIAL'>Industrial</Option>
//               </Select>
//             </Form.Item>
//             <Form.Item
//               label='Area Valuation (Plot Area)'
//               name='areaValuation'
//               rules={[
//                 { required: true, message: "Please enter area valuation" },
//               ]}
//             >
//               <InputNumber
//                 placeholder='Area Valuation'
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//             <Form.Item
//               label='Construction Cost (Construction Area)'
//               name='constructionCost'
//               rules={[
//                 { required: true, message: "Please enter construction cost" },
//               ]}
//             >
//               <InputNumber
//                 placeholder='Construction Cost'
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//             <Form.Item
//               label='Extension/Improvement Estimate'
//               name='extensionEstimate'
//               rules={[
//                 { required: true, message: "Please enter extension estimate" },
//               ]}
//             >
//               <InputNumber
//                 placeholder='Extension Estimate'
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//           </div>

//           {/* Amenities */}
//           <Title level={5} className='mt-8 mb-2'>
//             AMENITIES
//           </Title>
//           <Table
//             columns={amenitiesColumns}
//             dataSource={amenitiesData}
//             pagination={false}
//             rowKey='key'
//             className='mb-4'
//           />
//           <Form.Item label='Total Amenities Cost' name='totalAmenitiesCost'>
//             <InputNumber
//               disabled
//               style={{ width: "100%" }}
//               value={totalAmenitiesCost}
//             />
//           </Form.Item>

//           {/* Total Fair Market Value */}
//           <Title level={5} className='mt-8 mb-2'>
//             TOTAL FAIR MARKET VALUE
//           </Title>
//           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
//             <Form.Item
//               label='% Variance (Total Fair Market Value to Govt Value)'
//               name='variancePercentage'
//               rules={[
//                 { required: true, message: "Please enter variance percentage" },
//               ]}
//             >
//               <InputNumber
//                 placeholder='Variance Percentage'
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//             <Form.Item
//               label='Distress Value of the Property (Rs.)'
//               name='distressValue'
//               rules={[
//                 { required: true, message: "Please enter distress value" },
//               ]}
//             >
//               <InputNumber
//                 placeholder='Distress Value'
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//             <Form.Item
//               label='Rental Value of the Property (Per Month)'
//               name='rentalValue'
//               rules={[{ required: true, message: "Please enter rental value" }]}
//             >
//               <InputNumber
//                 placeholder='Rental Value'
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//           </div>

//           {/* Floor Details */}
//           <Title level={5} className='mt-8 mb-2'>
//             FLOOR DETAILS
//           </Title>
//           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
//             <Form.Item
//               label='No of Basement(s)'
//               name='noOfBasements'
//               rules={[
//                 { required: true, message: "Please enter number of basements" },
//               ]}
//             >
//               <InputNumber
//                 placeholder='No of Basements'
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//             <Form.Item
//               label='No of Ground/Parking/Stilt'
//               name='noOfGroundFloors'
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter number of ground floors",
//                 },
//               ]}
//             >
//               <InputNumber
//                 placeholder='No of Ground Floors'
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//             <Form.Item
//               label='Podium(s)'
//               name='noOfPodiums'
//               rules={[
//                 { required: true, message: "Please enter number of podiums" },
//               ]}
//             >
//               <InputNumber
//                 placeholder='No of Podiums'
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//             <Form.Item
//               label='No of Upper Floor(s)'
//               name='noOfUpperFloors'
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter number of upper floors",
//                 },
//               ]}
//             >
//               <InputNumber
//                 placeholder='No of Upper Floors'
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//             <Form.Item
//               label='Total No. of Floor(s)'
//               name='totalNoOfFloors'
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter total number of floors",
//                 },
//               ]}
//             >
//               <InputNumber
//                 placeholder='Total No. of Floors'
//                 style={{ width: "100%" }}
//               />
//             </Form.Item>
//           </div>

//           {/* Navigation Buttons */}
//           <div className='flex justify-between mt-6'>
//             <Button onClick={onBack}>Back</Button>
//             <Button type='primary' htmlType='submit'>
//               Next
//             </Button>
//           </div>
//         </Form>
//       </Panel>
//     </Collapse>
//   );
// };

// export default ValuationDetailsForm;

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Table,
  Collapse,
  Button,
  Typography,
  InputNumber,
} from "antd";
import toast from "react-hot-toast"; // Ensure toast is imported

const { Panel } = Collapse;
const { Title } = Typography;
const { Option } = Select;

const ValuationDetailsForm = ({
  onNext,
  onBack,
  initialValues = {},
  isEdit,
  data = {},
}) => {
  const [form] = Form.useForm();
  const [totalAmenitiesCost, setTotalAmenitiesCost] = useState(0);

  // Dummy data for testing
  const dummyData = {
    areaType: "Residential",
    areaValuation: 5000000, // 50 lakh for plot area valuation
    constructionCost: 2000000, // 20 lakh for construction cost
    extensionEstimate: 500000, // 5 lakh for extension/improvement
    amenities: [
      {
        description: "Parking Area",
        areaQuantity: 200,
        unit: "sq.ft",
        amount: 200000,
      },
      {
        description: "Garden",
        areaQuantity: 150,
        unit: "sq.ft",
        amount: 150000,
      },
      {
        description: "Security System",
        areaQuantity: 1,
        unit: "unit",
        amount: 100000,
      },
      { description: "Lift", areaQuantity: 1, unit: "unit", amount: 300000 },
      {
        description: "Water Tank",
        areaQuantity: 1,
        unit: "unit",
        amount: 50000,
      },
      {
        description: "Gym Equipment",
        areaQuantity: 1,
        unit: "unit",
        amount: 200000,
      },
    ],
    totalAmenitiesCost: 1000000, // Will be calculated dynamically in useEffect
    variancePercentage: 10, // 10% variance
    distressValue: 6000000, // 60 lakh distress value
    rentalValue: 30000, // 30,000 per month rental value
    noOfBasements: 1,
    noOfGroundFloors: 1,
    noOfPodiums: 0,
    noOfUpperFloors: 2,
    totalNoOfFloors: 4, // 1 Basement + 1 Ground + 2 Upper = 4
  };

  // Calculate initial totalAmenitiesCost from dummyData
  // useEffect(() => {
  //   const initialAmenities = isEdit
  //     ? initialValues.amenities
  //     : dummyData.amenities;
  //   const initialTotal = initialAmenities?.reduce(
  //     (sum, item) => sum + (parseFloat(item?.amount) || 0),
  //     0
  //   );
  //   setTotalAmenitiesCost(initialTotal);
  //   form.setFieldsValue({
  //     ...(isEdit ? initialValues : dummyData),
  //     totalAmenitiesCost: initialTotal,
  //   });
  // }, [form, isEdit, initialValues]);

  // Handle form submission
  const handleFinish = (values) => {
    const formattedData = {
      ...data, // Preserve previous data (address, loanApplicationDetails, etc.)
      valuationDetails: values, // Wrap current form data in valuationDetails
    };
    onNext(formattedData);
    toast.success("Saved successfully");
  };

  // Table columns for Amenities
  const amenitiesColumns = [
    {
      title: "SR. NO.",
      render: (_, __, index) => index + 1,
      key: "srNo",
    },
    {
      title: "Description",
      key: "description",
      render: (_, __, index) => (
        <Form.Item name={["amenities", index, "description"]}>
          <Input placeholder='Description' />
        </Form.Item>
      ),
    },
    {
      title: "Area/Quantity",
      key: "areaQuantity",
      render: (_, __, index) => (
        <Form.Item name={["amenities", index, "areaQuantity"]}>
          <InputNumber placeholder='Area/Quantity' style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "Unit",
      key: "unit",
      render: (_, __, index) => (
        <Form.Item name={["amenities", index, "unit"]}>
          <Select placeholder='Select Unit'>
            <Option value='sq.ft'>sq.ft</Option>
            <Option value='sq.m'>sq.m</Option>
            <Option value='unit'>unit</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, __, index) => (
        <Form.Item name={["amenities", index, "amount"]}>
          <InputNumber placeholder='Amount' style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
  ];

  // Amenities data (6 rows)
  const amenitiesData = Array.from({ length: 6 }, (_, index) => ({
    key: index,
  }));

  // Watch amenities to calculate total amenities cost dynamically
  const amenities = Form.useWatch("amenities", form);

  useEffect(() => {
    if (Array.isArray(amenities)) {
      const total = amenities.reduce(
        (sum, item) => sum + (parseFloat(item?.amount) || 0),
        0
      );
      setTotalAmenitiesCost(total);
      form.setFieldsValue({ totalAmenitiesCost: total });
    }
  }, [amenities, form]);

  return (
    <Collapse
      defaultActiveKey={["1"]}
      className='mb-6 border rounded-md bg-white shadow-sm'
    >
      <Panel
        header={
          <div className='flex justify-between items-center'>
            <Title level={5} className='!mb-0'>
              VALUATION DETAILS
            </Title>
            <Button type='primary' size='small' disabled={isEdit}>
              Edit
            </Button>
          </div>
        }
        key='1'
      >
        <Form
          form={form}
          layout='vertical'
          initialValues={dummyData} // Use dummy data if not in edit mode
          onFinish={handleFinish}
          className='p-4 bg-gray-100 rounded'
        >
          {/* Valuation Calculation */}
          <Title level={5} className='mt-4 mb-2'>
            VALUATION CALCULATION
          </Title>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Form.Item
              label='Area Type'
              name='areaType'
              rules={[{ required: true, message: "Please select area type" }]}
            >
              <Select placeholder='Select Area Type'>
                <Option value='RESIDENTIAL'>Residential</Option>
                <Option value='COMMERCIAL'>Commercial</Option>
                <Option value='INDUSTRIAL'>Industrial</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label='Area Valuation (Plot Area)'
              name='areaValuation'
              rules={[
                { required: true, message: "Please enter area valuation" },
              ]}
            >
              <InputNumber
                placeholder='Area Valuation'
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label='Construction Cost (Construction Area)'
              name='constructionCost'
              rules={[
                { required: true, message: "Please enter construction cost" },
              ]}
            >
              <InputNumber
                placeholder='Construction Cost'
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label='Extension/Improvement Estimate'
              name='extensionEstimate'
              rules={[
                { required: true, message: "Please enter extension estimate" },
              ]}
            >
              <InputNumber
                placeholder='Extension Estimate'
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          {/* Amenities */}
          <Title level={5} className='mt-8 mb-2'>
            AMENITIES
          </Title>
          <Table
            columns={amenitiesColumns}
            dataSource={amenitiesData}
            pagination={false}
            rowKey='key'
            className='mb-4'
          />
          <Form.Item label='Total Amenities Cost' name='totalAmenitiesCost'>
            <InputNumber
              disabled
              style={{ width: "100%" }}
              value={totalAmenitiesCost}
            />
          </Form.Item>

          {/* Total Fair Market Value */}
          <Title level={5} className='mt-8 mb-2'>
            TOTAL FAIR MARKET VALUE
          </Title>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Form.Item
              label='% Variance (Total Fair Market Value to Govt Value)'
              name='variancePercentage'
              rules={[
                { required: true, message: "Please enter variance percentage" },
              ]}
            >
              <InputNumber
                placeholder='Variance Percentage'
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label='Distress Value of the Property (Rs.)'
              name='distressValue'
              rules={[
                { required: true, message: "Please enter distress value" },
              ]}
            >
              <InputNumber
                placeholder='Distress Value'
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label='Rental Value of the Property (Per Month)'
              name='rentalValue'
              rules={[{ required: true, message: "Please enter rental value" }]}
            >
              <InputNumber
                placeholder='Rental Value'
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          {/* Floor Details */}
          <Title level={5} className='mt-8 mb-2'>
            FLOOR DETAILS
          </Title>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <Form.Item
              label='No of Basement(s)'
              name='noOfBasements'
              rules={[
                { required: true, message: "Please enter number of basements" },
              ]}
            >
              <InputNumber
                placeholder='No of Basements'
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label='No of Ground/Parking/Stilt'
              name='noOfGroundFloors'
              rules={[
                {
                  required: true,
                  message: "Please enter number of ground floors",
                },
              ]}
            >
              <InputNumber
                placeholder='No of Ground Floors'
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label='Podium(s)'
              name='noOfPodiums'
              rules={[
                { required: true, message: "Please enter number of podiums" },
              ]}
            >
              <InputNumber
                placeholder='No of Podiums'
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label='No of Upper Floor(s)'
              name='noOfUpperFloors'
              rules={[
                {
                  required: true,
                  message: "Please enter number of upper floors",
                },
              ]}
            >
              <InputNumber
                placeholder='No of Upper Floors'
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label='Total No. of Floor(s)'
              name='totalNoOfFloors'
              rules={[
                {
                  required: true,
                  message: "Please enter total number of floors",
                },
              ]}
            >
              <InputNumber
                placeholder='Total No. of Floors'
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          {/* Navigation Buttons */}
          <div className='flex justify-between mt-6'>
            <Button onClick={onBack}>Back</Button>
            <Button type='primary' htmlType='submit'>
              Next
            </Button>
          </div>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default ValuationDetailsForm;
