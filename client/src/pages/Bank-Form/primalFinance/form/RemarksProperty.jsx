// import React, { useEffect } from "react";
// import {
//   Form,
//   Input,
//   Radio,
//   Checkbox,
//   Collapse,
//   Button,
//   Typography,
//   DatePicker,
//   Upload,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import moment from "moment";

// const { Panel } = Collapse;
// const { Title } = Typography;

// const RemarksProperty = ({ onNext, onBack, initialValues = {}, isEdit }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     form.setFieldsValue({
//       ...initialValues,
//       tsrPreparedDate: initialValues.tsrPreparedDate
//         ? moment(initialValues.tsrPreparedDate)
//         : null,
//       tsrSubmittedDate: initialValues.tsrSubmittedDate
//         ? moment(initialValues.tsrSubmittedDate)
//         : null,
//       locationPhotos: initialValues.locationPhotos
//         ? initialValues.locationPhotos.map((url, index) => ({
//             uid: index,
//             name: url,
//             status: "done",
//             url,
//           }))
//         : [],
//     });
//   }, [initialValues]);

//   // const handleFinish = (values) => {
//   //   const transformedValues = {
//   //     ...values,
//   //     tsrPreparedDate: values.tsrPreparedDate
//   //       ? values.tsrPreparedDate.toISOString()
//   //       : null,
//   //     tsrSubmittedDate: values.tsrSubmittedDate
//   //       ? values.tsrSubmittedDate.toISOString()
//   //       : null,
//   //     locationPhotos: values.locationPhotos
//   //       ? values.locationPhotos.map((file) => file.name)
//   //       : [],
//   //   };
//   //   onNext(transformedValues);
//   // };

//   const handleFinish = (values) => {
//     const formattedData = {
//       ...data,
//       remarks: values,
//     };
//     onNext(formattedData);
//     toast.success("Saved successfully");
//   };

//   const uploadProps = {
//     beforeUpload: () => false,
//     multiple: true,
//   };

//   return (
//     <Collapse
//       defaultActiveKey={["1"]}
//       className='mb-6 border rounded-md bg-white shadow-sm'
//     >
//       <Panel
//         header={
//           <div className='flex justify-between items-center'>
//             <Title level={5} className='!mb-0'>
//               REMARKS ON PROPERTY
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
//           onFinish={handleFinish}
//           className='p-4 bg-gray-100 rounded'
//         >
//           {/* Property Acceptable & Marketability */}
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <Form.Item
//               label='Property Technically Acceptable'
//               name='propertyAcceptable'
//             >
//               <Radio.Group>
//                 <Radio value='YES'>YES</Radio>
//                 <Radio value='NO'>NO</Radio>
//               </Radio.Group>
//             </Form.Item>
//             <Form.Item label='Marketability of Property' name='marketability'>
//               <Input placeholder='Marketability' />
//             </Form.Item>
//           </div>

//           {/* Remarks */}
//           <Title level={5} className='mt-8 mb-2'>
//             REMARKS
//           </Title>
//           <div className='grid grid-cols-1 gap-2'>
//             <Form.Item name='outsideVisitDone' valuePropName='checked'>
//               <Checkbox>This map case, only outside visit is done.</Checkbox>
//             </Form.Item>
//             <Form.Item name='dataProvided' valuePropName='checked'>
//               <Checkbox>All data tackles provided by same.</Checkbox>
//             </Form.Item>
//             <Form.Item name='propertyIdentified' valuePropName='checked'>
//               <Checkbox>
//                 Property is identified by address and unit no.
//               </Checkbox>
//             </Form.Item>
//             <Form.Item name='rateConfirmed' valuePropName='checked'>
//               <Checkbox>Rate has been confirmed from market enquiry.</Checkbox>
//             </Form.Item>
//           </div>

//           {/* Deviation and Condition (Single-line Inputs) */}
//           <Title level={5} className='mt-8 mb-2'>
//             TSR DEVIATION
//           </Title>
//           <Form.Item name='deviation1'>
//             <Input placeholder='Enter property/document deviation' />
//           </Form.Item>

//           <Title level={5} className='mt-8 mb-2'>
//             TSR CONDITION
//           </Title>
//           <Form.Item name='condition1'>
//             <Input placeholder='Enter compliance condition' />
//           </Form.Item>

//           {/* TSR Info */}
//           <Title level={5} className='mt-8 mb-2'>
//             TSR PREPARED BY
//           </Title>
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <Form.Item label='TSR Prepared By' name='tsrPreparedBy'>
//               <Input placeholder='TSR Prepared By' />
//             </Form.Item>
//             <Form.Item label='TSR Submitted To' name='tsrSubmittedTo'>
//               <Input placeholder='TSR Submitted To' />
//             </Form.Item>
//             <Form.Item label='TSR Prepared On Date' name='tsrPreparedDate'>
//               <DatePicker format='YYYY-MM-DD' style={{ width: "100%" }} />
//             </Form.Item>
//             <Form.Item label='TSR Submitted On Date' name='tsrSubmittedDate'>
//               <DatePicker format='YYYY-MM-DD' style={{ width: "100%" }} />
//             </Form.Item>
//           </div>

//           {/* Photos Upload */}
//           <Title level={5} className='mt-8 mb-2'>
//             LOCATION MAPS - PHOTOGRAPHS
//           </Title>
//           <Form.Item
//             name='locationPhotos'
//             valuePropName='fileList'
//             getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
//             rules={[
//               { required: true, message: "Please upload at least one photo" },
//             ]}
//           >
//             <Upload {...uploadProps} listType='picture'>
//               <Button icon={<UploadOutlined />}>Upload Photos</Button>
//             </Upload>
//           </Form.Item>

//           {/* Navigation Buttons */}
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

// export default RemarksProperty;

import React, { useEffect } from "react";
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Collapse,
  Button,
  Typography,
  DatePicker,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import toast from "react-hot-toast";

const { Panel } = Collapse;
const { Title } = Typography;

const RemarksProperty = ({ onNext, onBack, initialValues = {}, isEdit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    const dummyValues = {
      propertyAcceptable: "YES",
      marketability: "Good resale potential",
      outsideVisitDone: true,
      dataProvided: true,
      propertyIdentified: true,
      rateConfirmed: true,
      deviations: "Slight discrepancy in building plan",
      conditions: "Submit updated property tax receipt",
      tsrPreparedBy: "Sourabh Badgaiya",
      tsrSubmittedTo: "HeroFinCorp Ltd.",
      tsrPreparedDate: moment("2024-05-10"),
      tsrSubmittedDate: moment("2024-05-11"),
      locationPhotos: [
        {
          uid: "-1",
          name: "photo1.jpg",
          status: "done",
          url: "https://plus.unsplash.com/premium_photo-1694540892449-5c3170caf81c?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    };

    form.setFieldsValue({
      ...dummyValues,
      ...initialValues,
      tsrPreparedDate: initialValues.tsrPreparedDate
        ? moment(initialValues.tsrPreparedDate)
        : dummyValues.tsrPreparedDate,
      tsrSubmittedDate: initialValues.tsrSubmittedDate
        ? moment(initialValues.tsrSubmittedDate)
        : dummyValues.tsrSubmittedDate,
      locationPhotos: initialValues.locationPhotos
        ? initialValues.locationPhotos.map((url, index) => ({
            uid: index,
            name: url,
            status: "done",
            url,
          }))
        : dummyValues.locationPhotos,
    });
  }, [initialValues]);

  const handleFinish = (values) => {
    const transformedValues = {
      ...values,
      tsrPreparedDate: values.tsrPreparedDate
        ? values.tsrPreparedDate.toISOString()
        : null,
      tsrSubmittedDate: values.tsrSubmittedDate
        ? values.tsrSubmittedDate.toISOString()
        : null,
      locationPhotos: values.locationPhotos?.map(
        (file) => file.name || file.url
      ),
    };
    onNext(transformedValues);
    toast.success("Saved successfully");
  };

  const uploadProps = {
    beforeUpload: () => false,
    multiple: true,
  };

  return (
    <Collapse
      defaultActiveKey={["1"]}
      className='mb-6 border rounded-md bg-white shadow-sm'
    >
      <Panel
        header={
          <div className='flex justify-between items-center'>
            <Title level={5} className='!mb-0'>
              REMARKS ON PROPERTY
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
          onFinish={handleFinish}
          className='p-4 bg-gray-100 rounded'
        >
          {/* Property Acceptable & Marketability */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Form.Item
              label='Property Technically Acceptable'
              name='propertyAcceptable'
            >
              <Radio.Group>
                <Radio value='YES'>YES</Radio>
                <Radio value='NO'>NO</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label='Marketability of Property' name='marketability'>
              <Input placeholder='Marketability' />
            </Form.Item>
          </div>

          {/* Remarks */}
          <Title level={5} className='mt-8 mb-2'>
            REMARKS
          </Title>
          <div className='grid grid-cols-1 gap-2'>
            <Form.Item name='outsideVisitDone' valuePropName='checked'>
              <Checkbox>This map case, only outside visit is done.</Checkbox>
            </Form.Item>
            <Form.Item name='dataProvided' valuePropName='checked'>
              <Checkbox>All data tackles provided by same.</Checkbox>
            </Form.Item>
            <Form.Item name='propertyIdentified' valuePropName='checked'>
              <Checkbox>
                Property is identified by address and unit no.
              </Checkbox>
            </Form.Item>
            <Form.Item name='rateConfirmed' valuePropName='checked'>
              <Checkbox>Rate has been confirmed from market enquiry.</Checkbox>
            </Form.Item>
          </div>

          {/* Deviation and Condition */}
          <Title level={5} className='mt-8 mb-2'>
            TSR DEVIATION
          </Title>
          <Form.Item name='deviation1'>
            <Input placeholder='Enter property/document deviation' />
          </Form.Item>

          <Title level={5} className='mt-8 mb-2'>
            TSR CONDITION
          </Title>
          <Form.Item name='condition1'>
            <Input placeholder='Enter compliance condition' />
          </Form.Item>

          {/* TSR Info */}
          <Title level={5} className='mt-8 mb-2'>
            TSR PREPARED BY
          </Title>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Form.Item label='TSR Prepared By' name='tsrPreparedBy'>
              <Input placeholder='TSR Prepared By' />
            </Form.Item>
            <Form.Item label='TSR Submitted To' name='tsrSubmittedTo'>
              <Input placeholder='TSR Submitted To' />
            </Form.Item>
            <Form.Item label='TSR Prepared On Date' name='tsrPreparedDate'>
              <DatePicker format='YYYY-MM-DD' style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label='TSR Submitted On Date' name='tsrSubmittedDate'>
              <DatePicker format='YYYY-MM-DD' style={{ width: "100%" }} />
            </Form.Item>
          </div>

          {/* Photos Upload */}
          <Title level={5} className='mt-8 mb-2'>
            LOCATION MAPS - PHOTOGRAPHS
          </Title>
          <Form.Item
            name='locationPhotos'
            valuePropName='fileList'
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[
              { required: true, message: "Please upload at least one photo" },
            ]}
          >
            <Upload {...uploadProps} listType='picture'>
              <Button icon={<UploadOutlined />}>Upload Photos</Button>
            </Upload>
          </Form.Item>

          {/* Navigation Buttons */}
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

export default RemarksProperty;
