// import React from "react";
// import { Form, Input, Button, Select } from "antd";

// const NDMAGuidelines = ({ isEdit, onNext, onBack }) => {
//   const [form] = Form.useForm();

//   React.useEffect(() => {
//     if (isEdit) {
//       form.setFieldsValue(isEdit);
//     }
//   }, [isEdit, form]);

//   const handleSubmit = (values) => {
//     onNext(values);
//     console.log(values);
//   };
  

//   return (
//     <div className='max-w-5xl mx-auto p-4 bg-white rounded shadow'>
//       <h2 className='text-2xl font-bold mb-6'>NDMA GUIDELINE</h2>

//       <Form
//         layout='vertical'
//         form={form}
//         onFinish={handleSubmit}
//         className='grid grid-cols-1 md:grid-cols-2 gap-4'
//       >
//         {/* First Column */}
//         <div>
//           <Form.Item 
//             label="Property Falls under Seismic Zone" 
//             name="seismicZone"
//             initialValue="III"
//           >
//             <Select>
//               <Select.Option value="I">Zone I</Select.Option>
//               <Select.Option value="II">Zone II</Select.Option>
//               <Select.Option value="III">Zone III</Select.Option>
//               <Select.Option value="IV">Zone IV</Select.Option>
//               <Select.Option value="V">Zone V</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item 
//             label="Property Falls under Cyclone Zone" 
//             name="cycloneZone"
//             initialValue="No"
//           >
//             <Select>
//               <Select.Option value="Yes">Yes</Select.Option>
//               <Select.Option value="No">No</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item 
//             label="Property falls under Landslide Prone Zone" 
//             name="landslideProneZone"
//             initialValue="No"
//           >
//             <Select>
//               <Select.Option value="Yes">Yes</Select.Option>
//               <Select.Option value="No">No</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item 
//             label="Degree of Risk Associated" 
//             name="degreeOfRisk"
//             initialValue="Medium"
//           >
//             <Select>
//               <Select.Option value="High">High</Select.Option>
//               <Select.Option value="Medium">Medium</Select.Option>
//               <Select.Option value="Low">Low</Select.Option>
//             </Select>
//           </Form.Item>
//         </div>

//         {/* Second Column */}
//         <div>
//           <Form.Item 
//             label="Property Falls under Flood Zone" 
//             name="floodZone"
//             initialValue="NO"
//           >
//             <Select>
//               <Select.Option value="YES">YES</Select.Option>
//               <Select.Option value="NO">NO</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item 
//             label="Property Falls in CR Zone" 
//             name="crZone"
//             initialValue="NO"
//           >
//             <Select>
//               <Select.Option value="YES">YES</Select.Option>
//               <Select.Option value="NO">NO</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item 
//             label="Follows NDMA Guidelines" 
//             name="followsNDMAGuidelines"
//             initialValue="Yes"
//           >
//             <Select>
//               <Select.Option value="Yes">Yes</Select.Option>
//               <Select.Option value="No">No</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item 
//             label="Any Demolition Risk with Details" 
//             name="demolitionRisk"
//             initialValue="None"
//           >
//             <Select>
//               <Select.Option value="None">None</Select.Option>
//               <Select.Option value="Demolition List">Demolition List</Select.Option>
//               <Select.Option value="Forest Land">Forest Land</Select.Option>
//               <Select.Option value="Govt Land">Govt Land</Select.Option>
//               <Select.Option value="Govt Notification">Govt Notification</Select.Option>
//               <Select.Option value="Road Widening">Road Widening</Select.Option>
//               <Select.Option value="NII">NII</Select.Option>
//             </Select>
//           </Form.Item>
//         </div>

//         {/* Form Actions */}
//         <div className="md:col-span-2">
//           <Form.Item className='text-right'>
//             {onBack && (
//               <Button
//                 type='default'
//                 onClick={onBack}
//                 className='mr-2 px-4 py-2 bg-gray-500 rounded'
//               >
//                 Back
//               </Button>
//             )}
//             <Button type='primary' htmlType='submit'>
//               Next
//             </Button>
//           </Form.Item>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default NDMAGuidelines;