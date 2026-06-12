// import React, { useState } from "react";
// import { Input, Button } from "antd";

// const { TextArea } = Input;

// const ValuationDetails = ({ onDataChange }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     onDataChange((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className=' text-white mb-6'>
//       <div className='flex justify-between p-4  bg-gray-800 cursor-pointer rounded items-center'>
//         <h4 className='text-lg font-semibold'>VALUATION DETAILS</h4>
//         <Button size='small' onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? "Close" : "Edit"}
//         </Button>
//       </div>

//       {isOpen && (
//         <div className='bg-white text-black mt-4 rounded p-4 space-y-6'>
//           <section>
//             <h5 className='text-base font-semibold mb-3'>Detailing</h5>
//             <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//               <Input
//                 name='plotAreaLeaseDeed'
//                 addonBefore='Plot Area (Lease Deed)'
//                 defaultValue='7,280'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='ratePsqft'
//                 addonBefore='Rate psqft'
//                 defaultValue='800'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='value'
//                 addonBefore='Value'
//                 defaultValue='5824000'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='plotAreaPhysical'
//                 addonBefore='Plot Area (Physical)'
//                 defaultValue='7,280'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='plotAreaPlan'
//                 addonBefore='Plot Area (Plan)'
//                 defaultValue='0'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='carpetAreaPlan'
//                 addonBefore='Carpet Area (Plan)'
//                 defaultValue='0'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='carpetAreaMeasurement'
//                 addonBefore='Carpet Area (Measured)'
//                 defaultValue='0'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='builtUpAreaRcc'
//                 addonBefore='Built Up Area RCC'
//                 defaultValue='0'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='builtUpAreaTinShed'
//                 addonBefore='Built Up Area TIN SHED'
//                 defaultValue='3,252'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='boundaryDetails'
//                 addonBefore='Boundary Details'
//                 defaultValue='PLOT NO.61-A(M/S K.C. ENTERPRISES)'
//                 onChange={handleChange}
//               />
//             </div>
//           </section>

//           <section>
//             <h5 className='text-base font-semibold mb-3'>Valuation</h5>
//             <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//               <Input
//                 name='areaInSqft'
//                 addonBefore='Area in Sqft'
//                 defaultValue='3,252'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='ratePsqft'
//                 addonBefore='Rate psqft'
//                 defaultValue='1000'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='value'
//                 addonBefore='Value'
//                 defaultValue='4659200'
//                 onChange={handleChange}
//               />
//             </div>
//           </section>

//           <section>
//             <h5 className='text-base font-semibold mb-3'>Boundary Details</h5>
//             <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//               <Input
//                 name='north'
//                 addonBefore='North'
//                 defaultValue='PLOT NO.61-A(M/S K.C. ENTERPRISES)'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='south'
//                 addonBefore='South'
//                 defaultValue='M/S T.A.J. ENTERPRISES'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='east'
//                 addonBefore='East'
//                 defaultValue='ROAD'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='west'
//                 addonBefore='West'
//                 defaultValue='RESIDENCE COLONY'
//                 onChange={handleChange}
//               />
//               <Input
//                 name='percentageRecommendation'
//                 addonBefore='Percentage Recommendation'
//                 defaultValue='100%'
//                 onChange={handleChange}
//               />
//             </div>
//           </section>

//           <section>
//             <h5 className='text-base font-semibold mb-3'>Old Remarks</h5>
//             <TextArea
//               name='oldRemarks'
//               rows={8}
//               onChange={handleChange}
//               defaultValue={`1. GIVEN XEROX COPY OF LEASE DEED IN FAVOUR OF M/S RADHIKA STEELS... (rest of text)`} // Truncated here
//             />
//           </section>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ValuationDetails;

import React from "react";
import { Form, Input, Button, Select } from "antd";
import toast from "react-hot-toast";

const { Option } = Select;

const ValuationDetails = ({ extractedData, onNext }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const val = p.valuation_details || {};

      form.setFieldsValue({
        guidelineValue: val.guideline_rate || val.govt_rate || extractedData.guidelineValue,
        distressValue: val.distress_value || extractedData.distressValue,
        realizableValue: val.realizable_value || extractedData.realizableValue,
        fairMarketValue: val.market_value || val.total_value || extractedData.fairMarketValue,
        buildingValuation: val.building_value || extractedData.buildingValuation,
        landValuation: val.land_value || extractedData.landValuation,
        totalValuation: val.total_value || val.market_value || extractedData.totalValuation,
        valuationApproach: p.valuation_approach || extractedData.valuationApproach,
        remarks: p.remarks || extractedData.remarks,
        valuerName: p.valuer_name || extractedData.valuerName,
        valuerRegistrationNo: p.valuer_registration || extractedData.valuerRegistrationNo,
        dateOfInspection: p.date_of_inspection || extractedData.dateOfInspection,
        dateOfReport: p.date_of_report || extractedData.dateOfReport,
        purposeOfValuation: p.purpose_of_valuation || extractedData.purposeOfValuation,
      });
    }
  }, [extractedData, form]);

  const initialValues = {
    guidelineValue: 4500, // ₹ per sq.ft.
    distressValue: 6000000,
    realizableValue: 7200000,
    fairMarketValue: 7500000,
    buildingValuation: 4000000,
    landValuation: 3500000,
    totalValuation: 7500000,
    valuationApproach: "Market Approach",
    remarks:
      "Property is well-located and structurally sound. No legal encumbrances found.",
    valuerName: "Ramesh Kulkarni",
    valuerRegistrationNo: "VAL/MAH/2022/087",
    dateOfInspection: "2025-04-15",
    dateOfReport: "2025-04-20",
    purposeOfValuation: "Home Loan Mortgage",
  };

  const handleFinish = (values) => {
    onNext(values);
    toast.success("Saved Successfully");
  };

  return (
    <div className='max-w-6xl mx-auto p-6 bg-white rounded shadow'>
      <h2 className='text-2xl font-bold mb-6'>Valuation Details</h2>

      <Form
        layout='vertical'
        form={form}
        initialValues={initialValues}
        onFinish={handleFinish}
        className='grid grid-cols-1 md:grid-cols-2 gap-4'
      >
        <Form.Item label='Guideline Value' name='guidelineValue'>
          <Input type='number' />
        </Form.Item>

        <Form.Item label='Distress Value' name='distressValue'>
          <Input type='number' />
        </Form.Item>

        <Form.Item label='Realizable Value' name='realizableValue'>
          <Input type='number' />
        </Form.Item>

        <Form.Item label='Fair Market Value' name='fairMarketValue'>
          <Input type='number' />
        </Form.Item>

        <Form.Item label='Building Valuation' name='buildingValuation'>
          <Input type='number' />
        </Form.Item>

        <Form.Item label='Land Valuation' name='landValuation'>
          <Input type='number' />
        </Form.Item>

        <Form.Item label='Total Valuation' name='totalValuation'>
          <Input type='number' />
        </Form.Item>

        <Form.Item label='Valuation Approach' name='valuationApproach'>
          <Input />
        </Form.Item>

        <Form.Item label='Remarks' name='remarks'>
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label='Valuer Name' name='valuerName'>
          <Input />
        </Form.Item>

        <Form.Item label='Valuer Registration No.' name='valuerRegistrationNo'>
          <Input />
        </Form.Item>

        <Form.Item label='Date of Inspection' name='dateOfInspection'>
          <Input type='date' />
        </Form.Item>

        <Form.Item label='Date of Report' name='dateOfReport'>
          <Input type='date' />
        </Form.Item>

        <Form.Item label='Purpose of Valuation' name='purposeOfValuation'>
          <Select>
            <Option value='Home Loan'>Home Loan</Option>
            <Option value='Mortgage'>Mortgage</Option>
            <Option value='Legal Purpose'>Legal Purpose</Option>
            <Option value='Others'>Others</Option>
          </Select>
        </Form.Item>

        <Form.Item className='md:col-span-2 text-end'>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ValuationDetails;
