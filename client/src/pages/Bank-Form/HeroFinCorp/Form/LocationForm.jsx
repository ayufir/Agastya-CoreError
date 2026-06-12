// import React, { useState } from "react";
// import { Input, Button, Collapse, Form } from "antd";

// const { Panel } = Collapse;

// const LocationForm = ({ onNext }) => {
//   const [form] = Form.useForm();

//   const handleFinish = (values) => {
//     onNext(values); // Pass data to parent
//   };

//   return (
//     <Collapse defaultActiveKey={["1"]} className='mb-4'>
//       <Panel header='Job Details' key='1'>
//         <Form
//           layout='vertical'
//           form={form}
//           onFinish={handleFinish}
//           className='grid grid-cols-1 md:grid-cols-2 gap-4'
//         >
//           <Form.Item label='Bank Name' name='bankName'>
//             <Input />
//           </Form.Item>
//           <Form.Item label='Bank Ref No' name='bankRefNo'>
//             <Input />
//           </Form.Item>
//           <Form.Item label='Business Division' name='businessDivision'>
//             <Input />
//           </Form.Item>
//           <Form.Item label='Internal Ref' name='internalRef'>
//             <Input />
//           </Form.Item>
//           <Form.Item label='Applicant Name' name='applicantName'>
//             <Input />
//           </Form.Item>
//           <Form.Item label='Application Ref' name='applicationRef'>
//             <Input />
//           </Form.Item>
//           <Form.Item label='Transaction Type' name='transactionType'>
//             <Input />
//           </Form.Item>
//           <Form.Item label='Contact Person' name='contactPerson'>
//             <Input />
//           </Form.Item>
//           <Form.Item label='Contact Mobile' name='contactMobile'>
//             <Input />
//           </Form.Item>
//           <Form.Item label='Contact Email' name='contactEmail'>
//             <Input />
//           </Form.Item>
//           <Form.Item label='Loan Purpose' name='loanPurpose'>
//             <Input.TextArea rows={2} />
//           </Form.Item>
//           <Form.Item label='Property Type' name='propertyType'>
//             <Input />
//           </Form.Item>
//           <Form.Item label='Valuation Type' name='valuationType'>
//             <Input />
//           </Form.Item>
//           <Form.Item label='Special Instructions' name='specialInstructions'>
//             <Input.TextArea rows={2} />
//           </Form.Item>

//           <div className='col-span-2'>
//             <Button type='primary' htmlType='submit' className='bg-[#16828E]'>
//               Save & Continue
//             </Button>
//           </div>
//         </Form>
//       </Panel>
//     </Collapse>
//   );
// };

// export default LocationForm;

import React, { useState, useEffect } from "react";
import { Input, Button, Collapse, Form } from "antd";

const { Panel } = Collapse;

const LocationForm = ({ isEdit, onNext }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(isEdit);
    }
  }, [isEdit]);

  const handleFinish = (values) => {
    onNext(values); // Pass data to parent
  };

  return (
    <Collapse defaultActiveKey={["1"]} className='mb-4'>
      <Panel header='Job Details' key='1'>
        <Form
          layout='vertical'
          form={form}
          onFinish={handleFinish}
          className='grid grid-cols-1 md:grid-cols-2 gap-4'
        >
          <Form.Item label='Bank Name' name='bankName'>
            <Input />
          </Form.Item>
          <Form.Item label='Bank Ref No' name='bankRefNo'>
            <Input />
          </Form.Item>
          <Form.Item label='Business Division' name='businessDivision'>
            <Input />
          </Form.Item>
          <Form.Item label='Internal Ref' name='internalRef'>
            <Input />
          </Form.Item>
          <Form.Item label='Applicant Name' name='applicantName'>
            <Input />
          </Form.Item>
          <Form.Item label='Application Ref' name='applicationRef'>
            <Input />
          </Form.Item>
          <Form.Item label='Transaction Type' name='transactionType'>
            <Input />
          </Form.Item>
          <Form.Item label='Contact Person' name='contactPerson'>
            <Input />
          </Form.Item>
          <Form.Item label='Contact Mobile' name='contactMobile'>
            <Input />
          </Form.Item>
          <Form.Item label='Contact Email' name='contactEmail'>
            <Input />
          </Form.Item>
          <Form.Item label='Loan Purpose' name='loanPurpose'>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label='Property Type' name='propertyType'>
            <Input />
          </Form.Item>
          <Form.Item label='Valuation Type' name='valuationType'>
            <Input />
          </Form.Item>
          <Form.Item label='Special Instructions' name='specialInstructions'>
            <Input.TextArea rows={2} />
          </Form.Item>

          <div className='col-span-2'>
            <Button type='primary' htmlType='submit' className='bg-[#16828E]'>
              Save & Continue
            </Button>
          </div>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default LocationForm;
