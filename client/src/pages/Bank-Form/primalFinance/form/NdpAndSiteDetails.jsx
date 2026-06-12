// import React from "react";
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

// const NdpAndSiteDetails = ({ onNext, onBack, initialValues = {}, isEdit }) => {
//   const [form] = Form.useForm();

//   // const handleFinish = (values) => {
//   //   const transformedValues = {
//   //     ...values,
//   //     siteInvestigation:
//   //       values.siteInvestigation ||
//   //       Array(9).fill({ completion: "", remarks: "" }),
//   //   };
//   //   onNext(transformedValues);
//   // };

//   const handleFinish = (values) => {
//     const formattedData = {
//       ...data,
//       ndpAndSiteDetails: values,
//     };
//     onNext(formattedData);
//     toast.success("Saved successfully");
//   };

//   const siteInvestigationColumns = [
//     {
//       title: "SR. NO.",
//       dataIndex: "id",
//       key: "id",
//     },
//     {
//       title: "ACTIVITY",
//       dataIndex: "activity",
//       key: "activity",
//     },
//     {
//       title: "ALLOTED % FOR ACTIVITY",
//       dataIndex: "allotted",
//       key: "allotted",
//     },
//     {
//       title: "PRESENT COMPLETION (%)",
//       key: "completion",
//       render: (_, record, index) => (
//         <Form.Item name={["siteInvestigation", index, "completion"]}>
//           <InputNumber placeholder='Completion %' style={{ width: "100%" }} />
//         </Form.Item>
//       ),
//     },
//     {
//       title: "REMARKS ON PROGRESS",
//       key: "remarks",
//       render: (_, record, index) => (
//         <Form.Item name={["siteInvestigation", index, "remarks"]}>
//           <Input placeholder='Remarks' />
//         </Form.Item>
//       ),
//     },
//   ];

//   const siteInvestigationData = [
//     { id: 1, activity: "PLINTH", allotted: "20.00%" },
//     { id: 2, activity: "R.C.C. BOYE GROUND", allotted: "40.00%" },
//     { id: 3, activity: "BRICK WORK", allotted: "10%" },
//     { id: 4, activity: "INTERNAL PLASTER", allotted: "5.00%" },
//     { id: 5, activity: "EXTERNAL PLASTER", allotted: "5.00%" },
//     { id: 6, activity: "FLOORING", allotted: "5.00%" },
//     { id: 7, activity: "PLUMBING & ELECTRIFIC WORK", allotted: "5.00%" },
//     { id: 8, activity: "DOOR, WINDOW & PAINT", allotted: "5.00%" },
//     { id: 9, activity: "FINISHING & POSSESSION", allotted: "5.00%" },
//   ];

//   return (
//     <Collapse
//       defaultActiveKey={["1"]}
//       className='mb-6 border rounded-md bg-white shadow-sm'
//     >
//       <Panel
//         header={
//           <div className='flex justify-between items-center'>
//             <Title level={5} className='!mb-0'>
//               NDP AND SITE DETAILS
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
//             siteInvestigation:
//               initialValues.siteInvestigation ||
//               Array(9).fill({ completion: "", remarks: "" }),
//           }}
//           onFinish={handleFinish}
//           className='p-4 bg-gray-100 rounded'
//         >
//           <Title level={5} className='mt-4 mb-2'>
//             BUILDING DETAILS
//           </Title>
//           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
//             <Form.Item label='Nature of Building' name='natureOfBuilding'>
//               <Select placeholder='Select Nature'>
//                 <Option value='Residential'>Residential</Option>
//                 <Option value='Commercial'>Commercial</Option>
//                 <Option value='Industrial'>Industrial</Option>
//               </Select>
//             </Form.Item>
//             <Form.Item label='Function of Use' name='functionOfUse'>
//               <Select placeholder='Select Function'>
//                 <Option value='Residential'>Residential</Option>
//                 <Option value='Non-Residential'>Non-Residential</Option>
//                 <Option value='Critical Lifeline'>
//                   Critical Lifeline (Infrastructure/development)
//                 </Option>
//               </Select>
//             </Form.Item>
//             <Form.Item label='Type of Foundation' name='typeOfFoundation'>
//               <Select placeholder='Select Foundation Type'>
//                 <Option value='Independent'>Independent</Option>
//                 <Option value='Interconnected'>Interconnected</Option>
//                 <Option value='Ref.'>Ref.</Option>
//                 <Option value='File'>File</Option>
//                 <Option value='Not able to assess'>
//                   Not able to assess since completed property
//                 </Option>
//               </Select>
//             </Form.Item>
//             <Form.Item label='Concrete Grade' name='concreteGrade'>
//               <Select placeholder='Select Concrete Grade'>
//                 <Option value='M2S'>M2S</Option>
//                 <Option value='M3D'>M3D</Option>
//                 <Option value='M4D'>M4D</Option>
//                 <Option value='M4S'>M4S</Option>
//                 <Option value='Not able to assess'>
//                   Not able to assess since completed property
//                 </Option>
//               </Select>
//             </Form.Item>
//             <Form.Item label='Seismic Zone' name='seismicZone'>
//               <Select placeholder='Select Seismic Zone'>
//                 <Option value='Zone II'>Zone II</Option>
//                 <Option value='Zone III'>Zone III</Option>
//                 <Option value='Zone IV'>Zone IV</Option>
//                 <Option value='Zone V'>Zone V</Option>
//               </Select>
//             </Form.Item>
//             <Form.Item label='Flood Prone Area' name='floodProneArea'>
//               <Select placeholder='Select Flood Prone Status'>
//                 <Option value='Yes'>Yes</Option>
//                 <Option value='No'>No</Option>
//               </Select>
//             </Form.Item>
//             <Form.Item
//               label='Environment Exposure Condition'
//               name='environmentExposureCondition'
//             >
//               <Select placeholder='Select Exposure Condition'>
//                 <Option value='MIB'>MIB</Option>
//                 <Option value='Moderate'>Moderate</Option>
//                 <Option value='Severe'>Severe</Option>
//                 <Option value='Very severe'>Very severe</Option>
//                 <Option value='Extreme'>Extreme</Option>
//               </Select>
//             </Form.Item>
//             <Form.Item label='Wind/Cyclones' name='windCyclones'>
//               <Select placeholder='Select Wind/Cyclone Risk'>
//                 <Option value='Very High Damage risk Zone A'>
//                   Very High Damage risk Zone A
//                 </Option>
//                 <Option value='Very High Damage risk Zone B'>
//                   Very High Damage risk Zone B
//                 </Option>
//                 <Option value='Very High Damage Risk Zone C'>
//                   Very High Damage Risk Zone C
//                 </Option>
//                 <Option value='Moderate Damage Risk Zone D'>
//                   Moderate Damage Risk Zone D
//                 </Option>
//                 <Option value='Moderate Damage Risk Zone E'>
//                   Moderate Damage Risk Zone E
//                 </Option>
//                 <Option value='Low Damage Risk Zone'>
//                   Low Damage Risk Zone
//                 </Option>
//               </Select>
//             </Form.Item>
//           </div>

//           <Title level={5} className='mt-6 mb-2'>
//             SITE INVESTIGATION DETAILS
//           </Title>
//           <Table
//             dataSource={siteInvestigationData}
//             columns={siteInvestigationColumns}
//             pagination={false}
//             rowKey='id'
//           />

//           <div className='flex justify-end mt-6'>
//             <Button onClick={onBack} className='mr-2'>
//               Back
//             </Button>
//             <Button type='primary' htmlType='submit'>
//               Next
//             </Button>
//           </div>
//         </Form>
//       </Panel>
//     </Collapse>
//   );
// };

// export default NdpAndSiteDetails;

import React from "react";
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

const NdpAndSiteDetails = ({
  onNext,
  onBack,
  initialValues = {},
  isEdit,
  data = {},
}) => {
  const [form] = Form.useForm();

  // Dummy data for testing
  const dummyData = {
    natureOfBuilding: "Residential",
    functionOfUse: "Residential",
    typeOfFoundation: "Independent",
    concreteGrade: "M3D",
    seismicZone: "Zone III",
    floodProneArea: "No",
    environmentExposureCondition: "Moderate",
    windCyclones: "Low Damage Risk Zone",
    siteInvestigation: [
      { completion: "100", remarks: "Plinth completed" },
      { completion: "80", remarks: "RCC work in progress" },
      { completion: "50", remarks: "Brick work started" },
      { completion: "20", remarks: "Internal plaster pending" },
      { completion: "10", remarks: "External plaster pending" },
      { completion: "0", remarks: "Flooring not started" },
      { completion: "0", remarks: "Plumbing pending" },
      { completion: "0", remarks: "Doors and windows pending" },
      { completion: "0", remarks: "Finishing not started" },
    ],
  };

  const handleFinish = (values) => {
    const formattedData = {
      ...data, // Preserve previous data (address, loanApplicationDetails, etc.)
      ndpAndSiteDetails: values, // Wrap current form data in ndpAndSiteDetails
    };
    onNext(formattedData);
    toast.success("Saved successfully");
  };

  const siteInvestigationColumns = [
    {
      title: "SR. NO.",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "ACTIVITY",
      dataIndex: "activity",
      key: "activity",
    },
    {
      title: "ALLOTED % FOR ACTIVITY",
      dataIndex: "allotted",
      key: "allotted",
    },
    {
      title: "PRESENT COMPLETION (%)",
      key: "completion",
      render: (_, record, index) => (
        <Form.Item name={["siteInvestigation", index, "completion"]}>
          <InputNumber placeholder='Completion %' style={{ width: "100%" }} />
        </Form.Item>
      ),
    },
    {
      title: "REMARKS ON PROGRESS",
      key: "remarks",
      render: (_, record, index) => (
        <Form.Item name={["siteInvestigation", index, "remarks"]}>
          <Input placeholder='Remarks' />
        </Form.Item>
      ),
    },
  ];

  const siteInvestigationData = [
    { id: 1, activity: "PLINTH", allotted: "20.00%" },
    { id: 2, activity: "R.C.C. BOYE GROUND", allotted: "40.00%" },
    { id: 3, activity: "BRICK WORK", allotted: "10%" },
    { id: 4, activity: "INTERNAL PLASTER", allotted: "5.00%" },
    { id: 5, activity: "EXTERNAL PLASTER", allotted: "5.00%" },
    { id: 6, activity: "FLOORING", allotted: "5.00%" },
    { id: 7, activity: "PLUMBING & ELECTRIFIC WORK", allotted: "5.00%" },
    { id: 8, activity: "DOOR, WINDOW & PAINT", allotted: "5.00%" },
    { id: 9, activity: "FINISHING & POSSESSION", allotted: "5.00%" },
  ];

  return (
    <Collapse
      defaultActiveKey={["1"]}
      className='mb-6 border rounded-md bg-white shadow-sm'
    >
      <Panel
        header={
          <div className='flex justify-between items-center'>
            <Title level={5} className='!mb-0'>
              NDP AND SITE DETAILS
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
          <Title level={5} className='mt-4 mb-2'>
            BUILDING DETAILS
          </Title>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Form.Item label='Nature of Building' name='natureOfBuilding'>
              <Select placeholder='Select Nature'>
                <Option value='Residential'>Residential</Option>
                <Option value='Commercial'>Commercial</Option>
                <Option value='Industrial'>Industrial</Option>
              </Select>
            </Form.Item>
            <Form.Item label='Function of Use' name='functionOfUse'>
              <Select placeholder='Select Function'>
                <Option value='Residential'>Residential</Option>
                <Option value='Non-Residential'>Non-Residential</Option>
                <Option value='Critical Lifeline'>
                  Critical Lifeline (Infrastructure/development)
                </Option>
              </Select>
            </Form.Item>
            <Form.Item label='Type of Foundation' name='typeOfFoundation'>
              <Select placeholder='Select Foundation Type'>
                <Option value='Independent'>Independent</Option>
                <Option value='Interconnected'>Interconnected</Option>
                <Option value='Ref.'>Ref.</Option>
                <Option value='File'>File</Option>
                <Option value='Not able to assess'>
                  Not able to assess since completed property
                </Option>
              </Select>
            </Form.Item>
            <Form.Item label='Concrete Grade' name='concreteGrade'>
              <Select placeholder='Select Concrete Grade'>
                <Option value='M2S'>M2S</Option>
                <Option value='M3D'>M3D</Option>
                <Option value='M4D'>M4D</Option>
                <Option value='M4S'>M4S</Option>
                <Option value='Not able to assess'>
                  Not able to assess since completed property
                </Option>
              </Select>
            </Form.Item>
            <Form.Item label='Seismic Zone' name='seismicZone'>
              <Select placeholder='Select Seismic Zone'>
                <Option value='Zone II'>Zone II</Option>
                <Option value='Zone III'>Zone III</Option>
                <Option value='Zone IV'>Zone IV</Option>
                <Option value='Zone V'>Zone V</Option>
              </Select>
            </Form.Item>
            <Form.Item label='Flood Prone Area' name='floodProneArea'>
              <Select placeholder='Select Flood Prone Status'>
                <Option value='Yes'>Yes</Option>
                <Option value='No'>No</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label='Environment Exposure Condition'
              name='environmentExposureCondition'
            >
              <Select placeholder='Select Exposure Condition'>
                <Option value='MIB'>MIB</Option>
                <Option value='Moderate'>Moderate</Option>
                <Option value='Severe'>Severe</Option>
                <Option value='Very severe'>Very severe</Option>
                <Option value='Extreme'>Extreme</Option>
              </Select>
            </Form.Item>
            <Form.Item label='Wind/Cyclones' name='windCyclones'>
              <Select placeholder='Select Wind/Cyclone Risk'>
                <Option value='Very High Damage risk Zone A'>
                  Very High Damage risk Zone A
                </Option>
                <Option value='Very High Damage risk Zone B'>
                  Very High Damage risk Zone B
                </Option>
                <Option value='Very High Damage Risk Zone C'>
                  Very High Damage Risk Zone C
                </Option>
                <Option value='Moderate Damage Risk Zone D'>
                  Moderate Damage Risk Zone D
                </Option>
                <Option value='Moderate Damage Risk Zone E'>
                  Moderate Damage Risk Zone E
                </Option>
                <Option value='Low Damage Risk Zone'>
                  Low Damage Risk Zone
                </Option>
              </Select>
            </Form.Item>
          </div>

          <Title level={5} className='mt-6 mb-2'>
            SITE INVESTIGATION DETAILS
          </Title>
          <Table
            dataSource={siteInvestigationData}
            columns={siteInvestigationColumns}
            pagination={false}
            rowKey='id'
          />

          <div className='flex justify-end mt-6'>
            <Button onClick={onBack} className='mr-2'>
              Back
            </Button>
            <Button type='primary' htmlType='submit'>
              Next
            </Button>
          </div>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default NdpAndSiteDetails;
