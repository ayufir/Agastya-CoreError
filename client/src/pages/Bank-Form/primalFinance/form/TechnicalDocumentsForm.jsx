// import React, { useState, useEffect } from "react";
// import {
//   Form,
//   Input,
//   Table,
//   Collapse,
//   Button,
//   Typography,
//   DatePicker,
// } from "antd";
// import moment from "moment";

// const { Panel } = Collapse;
// const { Title } = Typography;

// const TechnicalDocumentsForm = ({
//   onNext,
//   onBack,
//   initialValues = {},
//   isEdit,
// }) => {
//   const [form] = Form.useForm();

//   const [documents, setDocuments] = useState([]);

//   const documentsData = [
//     { name: "APPROVED LAYOUT PLAN", key: 1 },
//     { name: "APPROVED FLOOR PLAN", key: 2 },
//     { name: "CONSTRUCTION PERMISSION / BUILDING", key: 3 },
//     {
//       name: "BUILDING COMPLETION CERTIFICATE / OCCUPATION PERMISSION / USE PERMISSION / POSSESSION CERTIFICATE",
//       key: 4,
//     },
//     {
//       name: "NON AGRICULTURAL PERMISSION / LAND CONVERSION / DIVERSION ORDER",
//       key: 5,
//     },
//     { name: "LOCATION SKETCH / CERTIFICATE", key: 6 },
//     { name: "PROPERTY TAX RECEIPTS", key: 7 },
//     { name: "AUTHORITY TAX RECEIPTS", key: 8 },
//     {
//       name: "CONSTRUCTION ESTIMATE FROM REGISTERED ENGINEER / ARCHITECT",
//       key: 9,
//     },
//     {
//       name: "IMPROVEMENT / EXTENSION ESTIMATE FROM REGISTERED ENGINEER / ARCHITECT",
//       key: 10,
//     },
//     { name: "REMARKS ON DOCUMENTS VERIFIED", key: 11 },
//   ];

//   const getDefaultDocuments = () =>
//     documentsData.map((doc) => ({
//       name: doc.name,
//       recdType: "",
//       refNo: "",
//       refDate: null,
//       approvalDetails: "",
//     }));

//   useEffect(() => {
//     const initialDocs = (initialValues.documents || getDefaultDocuments()).map(
//       (doc) => ({
//         ...doc,
//         refDate: doc.refDate ? moment(doc.refDate, "YYYY-MM-DD") : null,
//       })
//     );
//     setDocuments(initialDocs);
//     form.setFieldsValue({ documents: initialDocs });
//   }, []);

//   // const handleFinish = (values) => {
//   //   const formattedValues = {
//   //     ...values,
//   //     documents: values.documents.map((doc) => ({
//   //       ...doc,
//   //       refDate: doc.refDate ? moment(doc.refDate).format("YYYY-MM-DD") : "",
//   //     })),
//   //   };
//   //   onNext(formattedValues);
//   // };

//   const handleFinish = (values) => {
//     const formattedData = {
//       technicalDocuments: values.documents,
//     };
//     onNext(formattedData);
//     toast.success("Saved successfully");
//   };

//   const documentsColumns = [
//     {
//       title: "Document Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Recd Type",
//       key: "recdType",
//       render: (_, __, index) => (
//         <Form.Item name={["documents", index, "recdType"]} noStyle>
//           <Input placeholder='Recd Type' />
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Ref No.",
//       key: "refNo",
//       render: (_, __, index) => (
//         <Form.Item name={["documents", index, "refNo"]} noStyle>
//           <Input placeholder='Ref No.' />
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Ref Date",
//       key: "refDate",
//       render: (_, __, index) => (
//         <Form.Item name={["documents", index, "refDate"]} noStyle>
//           <DatePicker
//             format='YYYY-MM-DD'
//             placeholder='Select Date'
//             style={{ width: "100%" }}
//           />
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Details of Approval",
//       key: "approvalDetails",
//       render: (_, __, index) => (
//         <Form.Item name={["documents", index, "approvalDetails"]} noStyle>
//           <Input placeholder='Approval Details' />
//         </Form.Item>
//       ),
//     },
//   ];

//   return (
//     <Collapse
//       defaultActiveKey={["1"]}
//       className='mb-6 border rounded bg-white shadow-sm'
//     >
//       <Panel
//         header={
//           <div className='flex justify-between items-center'>
//             <Title level={5} className='!mb-0'>
//               TECHNICAL DOCUMENTS DETAILS
//             </Title>

//             <Button type='primary' size='small'>
//               Edit
//             </Button>
//           </div>
//         }
//         key='1'
//       >
//         <Form
//           form={form}
//           layout='vertical'
//           onFinish={handleFinish}
//           className='p-4 bg-gray-100 rounded'
//         >
//           <Title level={5} className='mt-4 mb-2'>
//             DOCUMENT VERIFICATION DETAILS
//           </Title>

//           <Table
//             columns={documentsColumns}
//             dataSource={documents}
//             pagination={false}
//             rowKey={(record, index) => index}
//             className='mb-4'
//           />

//           <div className='flex justify-between mt-6'>
//             <Button onClick={onBack}>Back</Button>
//             <Button type='primary' htmlType='submit'>
//               Submit
//             </Button>
//           </div>
//         </Form>
//       </Panel>
//     </Collapse>
//   );
// };

// export default TechnicalDocumentsForm;

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Table,
  Collapse,
  Button,
  Typography,
  DatePicker,
} from "antd";
import moment from "moment";
import toast from "react-hot-toast";

const { Panel } = Collapse;
const { Title } = Typography;

const TechnicalDocumentsForm = ({
  onNext,
  onBack,
  initialValues = {},
  isEdit,
}) => {
  const [form] = Form.useForm();
  const [documents, setDocuments] = useState([]);

  const documentsData = [
    { name: "APPROVED LAYOUT PLAN", key: 1 },
    { name: "APPROVED FLOOR PLAN", key: 2 },
    { name: "CONSTRUCTION PERMISSION / BUILDING", key: 3 },
    {
      name: "BUILDING COMPLETION CERTIFICATE / OCCUPATION PERMISSION / USE PERMISSION / POSSESSION CERTIFICATE",
      key: 4,
    },
    {
      name: "NON AGRICULTURAL PERMISSION / LAND CONVERSION / DIVERSION ORDER",
      key: 5,
    },
    { name: "LOCATION SKETCH / CERTIFICATE", key: 6 },
    { name: "PROPERTY TAX RECEIPTS", key: 7 },
    { name: "AUTHORITY TAX RECEIPTS", key: 8 },
    {
      name: "CONSTRUCTION ESTIMATE FROM REGISTERED ENGINEER / ARCHITECT",
      key: 9,
    },
    {
      name: "IMPROVEMENT / EXTENSION ESTIMATE FROM REGISTERED ENGINEER / ARCHITECT",
      key: 10,
    },
    { name: "REMARKS ON DOCUMENTS VERIFIED", key: 11 },
  ];

  const getDefaultDocuments = () =>
    documentsData.map((doc) => ({
      name: doc.name,
      recdType: "",
      refNo: "",
      refDate: null,
      approvalDetails: "",
    }));

  useEffect(() => {
    const dummyDocs = [
      {
        name: "APPROVED LAYOUT PLAN",
        recdType: "Original",
        refNo: "ALP123",
        refDate: moment("2023-01-15", "YYYY-MM-DD"),
        approvalDetails: "Approved by Town Planning Authority",
      },
      {
        name: "APPROVED FLOOR PLAN",
        recdType: "Copy",
        refNo: "AFP456",
        refDate: moment("2023-02-10", "YYYY-MM-DD"),
        approvalDetails: "Signed by Chief Architect",
      },
      {
        name: "CONSTRUCTION PERMISSION / BUILDING",
        recdType: "Original",
        refNo: "CPB789",
        refDate: moment("2022-12-05", "YYYY-MM-DD"),
        approvalDetails: "Granted by Municipal Corporation",
      },
    ];

    const initialDocs = (initialValues.documents || dummyDocs).map((doc) => ({
      ...doc,
      refDate: doc.refDate ? moment(doc.refDate, "YYYY-MM-DD") : null,
    }));

    setDocuments(initialDocs);
    form.setFieldsValue({ documents: initialDocs });
  }, []);

  const handleFinish = (values) => {
    const formattedData = {
      siteDocumentsVerified: values.documents,
    };
    onNext(formattedData);
    toast.success("Saved successfully");
  };

  const documentsColumns = [
    {
      title: "Document Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Recd Type",
      key: "recdType",
      render: (_, __, index) => (
        <Form.Item name={["documents", index, "recdType"]} noStyle>
          <Input placeholder='Recd Type' />
        </Form.Item>
      ),
    },
    {
      title: "Ref No.",
      key: "refNo",
      render: (_, __, index) => (
        <Form.Item name={["documents", index, "refNo"]} noStyle>
          <Input placeholder='Ref No.' />
        </Form.Item>
      ),
    },
    {
      title: "Ref Date",
      key: "refDate",
      render: (_, __, index) => (
        <Form.Item name={["documents", index, "refDate"]} noStyle>
          <DatePicker
            format='YYYY-MM-DD'
            placeholder='Select Date'
            style={{ width: "100%" }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Details of Approval",
      key: "approvalDetails",
      render: (_, __, index) => (
        <Form.Item name={["documents", index, "approvalDetails"]} noStyle>
          <Input placeholder='Approval Details' />
        </Form.Item>
      ),
    },
  ];

  return (
    <Collapse
      defaultActiveKey={["1"]}
      className='mb-6 border rounded bg-white shadow-sm'
    >
      <Panel
        header={
          <div className='flex justify-between items-center'>
            <Title level={5} className='!mb-0'>
              TECHNICAL DOCUMENTS DETAILS
            </Title>

            <Button type='primary' size='small'>
              Edit
            </Button>
          </div>
        }
        key='1'
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={handleFinish}
          className='p-4 bg-gray-100 rounded'
        >
          <Title level={5} className='mt-4 mb-2'>
            DOCUMENT VERIFICATION DETAILS
          </Title>

          <Table
            columns={documentsColumns}
            dataSource={documents}
            pagination={false}
            rowKey={(record, index) => index}
            className='mb-4'
          />

          <div className='flex justify-between mt-6'>
            <Button onClick={onBack}>Back</Button>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </div>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default TechnicalDocumentsForm;
