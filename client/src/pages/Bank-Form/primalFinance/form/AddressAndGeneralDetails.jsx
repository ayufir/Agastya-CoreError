// import React, { useEffect } from "react";
// import {
//   Form,
//   Input,
//   Row,
//   Col,
//   Typography,
//   Button,
//   Select,
//   InputNumber,
// } from "antd";
// import toast from "react-hot-toast";
// import GeoLocationInput from "../../../../components/GeoLocationInput";

// const { Title } = Typography;
// const { Option } = Select;

// const AddressAndGeneralDetails = ({ onNext, formData, isEdit }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (isEdit && formData) {
//       const updatedValues = {
//         ...formData,
//         latitude: formData.latitudeLongitude?.coordinates[0] || "",
//         longitude: formData.latitudeLongitude?.coordinates[1] || "",
//         boundaryEASTApproved: formData.boundaries?.east?.approved || "",
//         boundaryEASTSite: formData.boundaries?.east?.site || "",
//         boundaryWESTApproved: formData.boundaries?.west?.approved || "",
//         boundaryWESTSite: formData.boundaries?.west?.site || "",
//         boundaryNORTHApproved: formData.boundaries?.north?.approved || "",
//         boundaryNORTHSite: formData.boundaries?.north?.site || "",
//         boundarySOUTHApproved: formData.boundaries?.south?.approved || "",
//         boundarySOUTHSite: formData.boundaries?.south?.site || "",
//       };
//       form.setFieldsValue(updatedValues);
//     }
//   }, [isEdit, formData, form]);

//   const handleSubmit = (values) => {
//     const formattedData = {
//       ...values,
//       latitudeLongitude: {
//         type: "Point",
//         coordinates: [
//           parseFloat(values.latitude || 0),
//           parseFloat(values.longitude || 0),
//         ],
//       },
//       boundaries: {
//         east: {
//           approved: values.boundaryEASTApproved || "",
//           site: values.boundaryEASTSite || "",
//         },
//         west: {
//           approved: values.boundaryWESTApproved || "",
//           site: values.boundaryWESTSite || "",
//         },
//         north: {
//           approved: values.boundaryNORTHApproved || "",
//           site: values.boundaryNORTHSite || "",
//         },
//         south: {
//           approved: values.boundarySOUTHApproved || "",
//           site: values.boundarySOUTHSite || "",
//         },
//       },
//     };

//     // Remove extra fields before sending
//     delete formattedData.latitude;
//     delete formattedData.longitude;
//     Object.keys(formattedData).forEach((key) => {
//       if (key.startsWith("boundary")) delete formattedData[key];
//     });

//     onNext(formattedData);
//     toast.success("Saved Successfully");
//   };

//   const renderInput = (label, name, required = false) => (
//     <Form.Item
//       name={name}
//       label={label}
//       rules={
//         required ? [{ required: true, message: `${label} is required` }] : []
//       }
//     >
//       <Input placeholder={label} />
//     </Form.Item>
//   );

//   const renderBoundaryInput = (direction) => (
//     <Row gutter={16} key={direction}>
//       <Col xs={24} md={4}>
//         <Input
//           value={direction}
//           readOnly
//           className='bg-gray-100 font-semibold text-center'
//         />
//       </Col>
//       <Col xs={24} md={10}>
//         <Form.Item name={`boundary${direction}Approved`}>
//           <Input placeholder='As Per Approved Plan' />
//         </Form.Item>
//       </Col>
//       <Col xs={24} md={10}>
//         <Form.Item name={`boundary${direction}Site`}>
//           <Input placeholder='As Per Site Investigation' />
//         </Form.Item>
//       </Col>
//     </Row>
//   );

//   const boundaries = ["EAST", "WEST", "NORTH", "SOUTH"];

//   return (
//     <div className='max-w-6xl mx-auto p-6 bg-white rounded shadow'>
//       <Title level={4} className='mb-4'>
//         Address & General Details
//       </Title>

//       <Form
//         form={form}
//         layout='vertical'
//         onFinish={handleSubmit}
//         initialValues={formData}
//         className='grid grid-cols-1 lg:grid-cols-3 gap-4'
//       >
//         {renderInput("House/Flat No.", "houseFlatNo", true)}
//         {renderInput("Floor No.", "floorNo")}
//         {renderInput("Wing Name & No.", "wingNameNo")}
//         {renderInput("Building Name and Number", "buildingNameNo")}
//         {renderInput("Plot No.", "plotNo")}
//         {renderInput("Survey No.", "surveyNo")}
//         {renderInput("Street Name & No.", "streetNameNo")}
//         {renderInput("Stage/Sector/Ward No.", "stageSectorWardNo")}
//         {renderInput("Landmarks", "landmarks")}
//         {renderInput("Village/Location", "villageLocation")}
//         {renderInput("City/Taluka/Town", "cityTalukaTown", true)}
//         {renderInput("District", "district")}
//         {renderInput("State", "state")}
//         {renderInput("Country", "country")}

//         <Form.Item
//           name='pinCode'
//           label='Pin Code'
//           rules={[
//             { required: true, message: "PIN Code is required" },
//             {
//               pattern: /^\d{6}$/,
//               message: "PIN Code must be 6 digits",
//             },
//           ]}
//         >
//           <Input placeholder='PIN Code' />
//         </Form.Item>

//         <GeoLocationInput />

//         {renderInput("Property Located On", "propertyLocatedOn")}

//         <Form.Item name='approachRoad' label='Approach Road to Property'>
//           <Select placeholder='Select approach road'>
//             <Option value='MORE THAN 10 FT'>MORE THAN 10 FT</Option>
//             <Option value='10 FT'>10 FT</Option>
//             <Option value='LESS THAN 10 FT'>LESS THAN 10 FT</Option>
//           </Select>
//         </Form.Item>

//         <div className='lg:col-span-3 mt-6'>
//           <Title level={5} className='mb-2'>
//             Boundaries
//           </Title>
//           {boundaries.map(renderBoundaryInput)}
//         </div>

//         <div className='lg:col-span-3 mt-6'>
//           <Title level={5} className='mb-2'>
//             General Info
//           </Title>
//           <Row gutter={16}>
//             <Col xs={24} md={6}>
//               <Form.Item name='municipalLimit' label='Municipal Limit'>
//                 <Select placeholder='Select'>
//                   <Option value='YES'>YES</Option>
//                   <Option value='NO'>NO</Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={6}>
//               {renderInput("Municipal Authority (Name)", "municipalAuthority")}
//             </Col>
//             <Col xs={24} md={6}>
//               <Form.Item
//                 name='yearOfConstruction'
//                 label='Year of Construction'
//                 rules={[
//                   {
//                     type: "number",
//                     min: 1900,
//                     max: new Date().getFullYear(),
//                     message: "Enter a valid year",
//                   },
//                 ]}
//               >
//                 <InputNumber placeholder='Year' className='w-full' />
//               </Form.Item>
//             </Col>
//             <Col xs={24} md={6}>
//               {renderInput("Seller Name", "sellerName")}
//             </Col>
//           </Row>
//         </div>

//         <Form.Item className='lg:col-span-3 text-end'>
//           <Button type='primary' htmlType='submit'>
//             Next
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default AddressAndGeneralDetails;

import React, { useEffect } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Typography,
  Button,
  Select,
  InputNumber,
} from "antd";
import toast from "react-hot-toast";
import GeoLocationInput from "../../../../components/GeoLocationInput";

const { Title } = Typography;
const { Option } = Select;

const AddressAndGeneralDetails = ({ onNext, formData, isEdit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit && formData) {
      const updatedValues = {
        ...formData,
        latitude: formData.latitudeLongitude?.coordinates[0] || "",
        longitude: formData.latitudeLongitude?.coordinates[1] || "",
        boundaryEASTApproved: formData.boundaries?.east?.approved || "",
        boundaryEASTSite: formData.boundaries?.east?.site || "",
        boundaryWESTApproved: formData.boundaries?.west?.approved || "",
        boundaryWESTSite: formData.boundaries?.west?.site || "",
        boundaryNORTHApproved: formData.boundaries?.north?.approved || "",
        boundaryNORTHSite: formData.boundaries?.north?.site || "",
        boundarySOUTHApproved: formData.boundaries?.south?.approved || "",
        boundarySOUTHSite: formData.boundaries?.south?.site || "",
      };
      form.setFieldsValue(updatedValues);
    }
  }, [isEdit, formData, form]);

  const handleSubmit = (values) => {
    const formattedData = {
      ...values,
      latitudeLongitude: {
        type: "Point",
        coordinates: [
          parseFloat(values.latitude || 0),
          parseFloat(values.longitude || 0),
        ],
      },
      boundaries: {
        east: {
          approved: values.boundaryEASTApproved || "",
          site: values.boundaryEASTSite || "",
        },
        west: {
          approved: values.boundaryWESTApproved || "",
          site: values.boundaryWESTSite || "",
        },
        north: {
          approved: values.boundaryNORTHApproved || "",
          site: values.boundaryNORTHSite || "",
        },
        south: {
          approved: values.boundarySOUTHApproved || "",
          site: values.boundarySOUTHSite || "",
        },
      },
    };

    delete formattedData.latitude;
    delete formattedData.longitude;
    Object.keys(formattedData).forEach((key) => {
      if (key.startsWith("boundary")) delete formattedData[key];
    });

    onNext({ address: formattedData });
    toast.success("Saved Successfully");
  };

  // const handleSubmit = (values) => {
  //   const formattedData = {
  //     ...values,
  //     latitudeLongitude: {
  //       type: "Point",
  //       coordinates: [
  //         parseFloat(values.latitude || 0),
  //         parseFloat(values.longitude || 0),
  //       ],
  //     },
  //     boundaries: {
  //       east: {
  //         approved: values.boundaryEASTApproved || "",
  //         site: values.boundaryEASTSite || "",
  //       },
  //       west: {
  //         approved: values.boundaryWESTApproved || "",
  //         site: values.boundaryWESTSite || "",
  //       },
  //       north: {
  //         approved: values.boundaryNORTHApproved || "",
  //         site: values.boundaryNORTHSite || "",
  //       },
  //       south: {
  //         approved: values.boundarySOUTHApproved || "",
  //         site: values.boundarySOUTHSite || "",
  //       },
  //     },
  //   };

  //   // Remove extra fields before sending
  //   delete formattedData.latitude;
  //   delete formattedData.longitude;
  //   Object.keys(formattedData).forEach((key) => {
  //     if (key.startsWith("boundary")) delete formattedData[key];
  //   });

  //   onNext(formattedData);
  //   toast.success("Saved Successfully");
  // };

  const renderInput = (label, name, required = false) => (
    <Form.Item
      name={name}
      label={label}
      rules={
        required ? [{ required: true, message: `${label} is required` }] : []
      }
    >
      <Input placeholder={label} />
    </Form.Item>
  );

  const renderBoundaryInput = (direction) => (
    <Row gutter={16} key={direction}>
      <Col xs={24} md={4}>
        <Input
          value={direction}
          readOnly
          className='bg-gray-100 font-semibold text-center'
        />
      </Col>
      <Col xs={24} md={10}>
        <Form.Item name={`boundary${direction}Approved`}>
          <Input placeholder='As Per Approved Plan' />
        </Form.Item>
      </Col>
      <Col xs={24} md={10}>
        <Form.Item name={`boundary${direction}Site`}>
          <Input placeholder='As Per Site Investigation' />
        </Form.Item>
      </Col>
    </Row>
  );

  const boundaries = ["EAST", "WEST", "NORTH", "SOUTH"];

  // Dummy data for testing
  const dummyData = {
    houseFlatNo: "A-101",
    floorNo: "3rd Floor",
    wingNameNo: "Wing B, No. 2",
    buildingNameNo: "Sunrise Towers, Bldg 5",
    plotNo: "Plot 45",
    surveyNo: "Survey 123/4",
    streetNameNo: "MG Road, Lane 7",
    stageSectorWardNo: "Sector 12",
    landmarks: "Near City Mall",
    villageLocation: "Kothrud",
    cityTalukaTown: "Pune",
    district: "Pune",
    state: "Maharashtra",
    country: "India",
    pinCode: "411038",
    latitude: "18.5204",
    longitude: "73.8567",
    propertyLocatedOn: "Main Road",
    approachRoad: "MORE THAN 10 FT",
    boundaryEASTApproved: "20m Road",
    boundaryEASTSite: "22m Road",
    boundaryWESTApproved: "Residential Building",
    boundaryWESTSite: "Residential Building",
    boundaryNORTHApproved: "Open Space",
    boundaryNORTHSite: "Open Space",
    boundarySOUTHApproved: "Commercial Complex",
    boundarySOUTHSite: "Commercial Complex",
    municipalLimit: "YES",
    municipalAuthority: "Pune Municipal Corporation",
    yearOfConstruction: 2018,
    sellerName: "John Doe",
  };

  return (
    <div className='max-w-6xl mx-auto p-6 bg-white rounded shadow'>
      <Title level={4} className='mb-4'>
        Address & General Details
      </Title>

      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={dummyData} // Use dummy data if not in edit mode
        className='grid grid-cols-1 lg:grid-cols-3 gap-4'
      >
        {renderInput("House/Flat No.", "houseFlatNo", true)}
        {renderInput("Floor No.", "floorNo")}
        {renderInput("Wing Name & No.", "wingNameNo")}
        {renderInput("Building Name and Number", "buildingNameNo")}
        {renderInput("Plot No.", "plotNo")}
        {renderInput("Survey No.", "surveyNo")}
        {renderInput("Street Name & No.", "streetNameNo")}
        {renderInput("Stage/Sector/Ward No.", "stageSectorWardNo")}
        {renderInput("Landmarks", "landmarks")}
        {renderInput("Village/Location", "villageLocation")}
        {renderInput("City/Taluka/Town", "cityTalukaTown", true)}
        {renderInput("District", "district")}
        {renderInput("State", "state")}
        {renderInput("Country", "country")}

        <Form.Item
          name='pinCode'
          label='Pin Code'
          rules={[
            { required: true, message: "PIN Code is required" },
            {
              pattern: /^\d{6}$/,
              message: "PIN Code must be 6 digits",
            },
          ]}
        >
          <Input placeholder='PIN Code' />
        </Form.Item>

        <GeoLocationInput />

        {renderInput("Property Located On", "propertyLocatedOn")}

        <Form.Item name='approachRoad' label='Approach Road to Property'>
          <Select placeholder='Select approach road'>
            <Option value='MORE THAN 10 FT'>MORE THAN 10 FT</Option>
            <Option value='10 FT'>10 FT</Option>
            <Option value='LESS THAN 10 FT'>LESS THAN 10 FT</Option>
          </Select>
        </Form.Item>

        <div className='lg:col-span-3 mt-6'>
          <Title level={5} className='mb-2'>
            Boundaries
          </Title>
          {boundaries.map(renderBoundaryInput)}
        </div>

        <div className='lg:col-span-3 mt-6'>
          <Title level={5} className='mb-2'>
            General Info
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Form.Item name='municipalLimit' label='Municipal Limit'>
                <Select placeholder='Select'>
                  <Option value='YES'>YES</Option>
                  <Option value='NO'>NO</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              {renderInput("Municipal Authority (Name)", "municipalAuthority")}
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                name='yearOfConstruction'
                label='Year of Construction'
                rules={[
                  {
                    type: "number",
                    min: 1900,
                    max: new Date().getFullYear(),
                    message: "Enter a valid year",
                  },
                ]}
              >
                <InputNumber placeholder='Year' className='w-full' />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              {renderInput("Seller Name", "sellerName")}
            </Col>
          </Row>
        </div>

        <Form.Item className='lg:col-span-3 text-end'>
          <Button type='primary' htmlType='submit'>
            Next
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddressAndGeneralDetails;
