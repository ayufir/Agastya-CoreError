// import React, { useEffect, useState } from "react";
// import { Form, Input, Button, Table, Divider, Upload } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const defaultDocumentData = [
//   {
//     key: "1",
//     type: "NA Converted",
//     approvingAuthority: "No",
//     approvalDate: "",
//     approvalDetails: "NA",
//     file: null,
//   },
//   {
//     key: "2",
//     type: "Approved Sanction Plan",
//     approvingAuthority: "Architect Plan",
//     approvalDate: "",
//     approvalDetails: "ENGG MAP",
//     file: null,
//   },
//   {
//     key: "3",
//     type: "Approved Layout Plan",
//     approvingAuthority: "Architect Plan",
//     approvalDate: "",
//     approvalDetails: "KEY PLAN",
//     file: null,
//   },
//   {
//     key: "4",
//     type: "Commencement Certificate (if any)",
//     approvingAuthority: "",
//     approvalDate: "",
//     approvalDetails: "NA",
//     file: null,
//   },
//   {
//     key: "5",
//     type: "Occupancy/Completion Certificate",
//     approvingAuthority: "",
//     approvalDate: "",
//     approvalDetails: "NA",
//     file: null,
//   },
//   {
//     key: "6",
//     type: "Approved Sub Plotting Plan",
//     approvingAuthority: "",
//     approvalDate: "",
//     approvalDetails: "NA",
//     file: null,
//   },
// ];

// const DocomentDetails = ({ isEdit, onNext, onBack }) => {
//  const [isMobile, setIsMobile] = useState(false);

//   const [form] = Form.useForm();
//   const [documents, setDocuments] = useState(defaultDocumentData);

 

//   const handleFileChange = (file, record) => {
//     const updated = documents.map((doc) =>
//       doc.key === record.key ? { ...doc, file } : doc
//     );
//     setDocuments(updated);
//   };

//   const columns = [
//     {
//       title: "TYPE",
//       dataIndex: "type",
//       key: "type",
//       render: (_, record) => <span>{record.type}</span>,
//     },
//     {
//       title: "Approving Authority",
//       dataIndex: "approvingAuthority",
//       key: "approvingAuthority",
//       render: (_, record) => (
//         <Input
//           defaultValue={record.approvingAuthority}
//           onChange={(e) =>
//             updateField(record.key, "approvingAuthority", e.target.value)
//           }
//         />
//       ),
//     },
//     {
//       title: "Number & Date",
//       dataIndex: "approvalDate",
//       key: "approvalDate",
//       render: (_, record) => (
//         <Input
//           placeholder="Number & Date"
//           defaultValue={record.approvalDate}
//           onChange={(e) =>
//             updateField(record.key, "approvalDate", e.target.value)
//           }
//         />
//       ),
//     },
//     {
//       title: "Details of Approval",
//       dataIndex: "approvalDetails",
//       key: "approvalDetails",
//       render: (_, record) => (
//         <Input
//           placeholder="Details"
//           defaultValue={record.approvalDetails}
//           onChange={(e) =>
//             updateField(record.key, "approvalDetails", e.target.value)
//           }
//         />
//       ),
//     },
 
//   ];

//   const handleSubmit = () => {
//     onNext(documents);
//   };

//   return (
//        <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-6">Document Details</h2>

//       <Form form={form} layout="vertical" onFinish={handleSubmit}>
//         <Divider orientation="left">DOCUMENT DETAILS</Divider>

//         {!isMobile ? (
//           <Table
//             columns={columns}
//             dataSource={documents}
//             pagination={false}
//             bordered
//             rowKey="key"
//           />
//         ) : (
//           <div className="space-y-4">
//             {documents.map((record) => (
//               <div
//                 key={record.key}
//                 className="border p-3 rounded shadow-sm bg-gray-50"
//               >
//                 <p className="font-semibold mb-2">TYPE: {record.type}</p>

//                 <Form.Item label="Approving Authority">
//                   <Input
//                     value={record.approvingAuthority}
//                     onChange={(e) =>
//                       updateField(record.key, "approvingAuthority", e.target.value)
//                     }
//                   />
//                 </Form.Item>

//                 <Form.Item label="Number & Date">
//                   <Input
//                     value={record.approvalDate}
//                     onChange={(e) =>
//                       updateField(record.key, "approvalDate", e.target.value)
//                     }
//                   />
//                 </Form.Item>

//                 <Form.Item label="Details">
//                   <Input
//                     value={record.approvalDetails}
//                     onChange={(e) =>
//                       updateField(record.key, "approvalDetails", e.target.value)
//                     }
//                   />
//                 </Form.Item>

//                 <Form.Item label="Upload File">
//                   <Upload
//                     beforeUpload={(file) => {
//                       handleFileChange(file, record);
//                       return false;
//                     }}
//                   >
//                     <Button icon={<UploadOutlined />}>Upload</Button>
//                   </Upload>
//                 </Form.Item>
//               </div>
//             ))}
//           </div>
//         )}

//         <Form.Item className="text-right mt-4">
//           {onBack && (
//             <Button onClick={onBack} style={{ marginRight: 8 }}>
//               Back
//             </Button>
//           )}
//           <Button type="primary" htmlType="submit">
//             Next
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };



// export default DocomentDetails;
