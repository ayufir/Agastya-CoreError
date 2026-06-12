// import React, { useState } from "react";
// import { Form, Input, DatePicker, Button, Collapse, Row, Col } from "antd";
// import dayjs from "dayjs";

// const { TextArea } = Input;

// const ProfecutsDetails = ({ onDataChange }) => {
//   const [form] = Form.useForm();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleChange = () => {
//     const values = form.getFieldsValue();
//     onDataChange((prev) => ({ ...prev, ...values }));
//   };

//   const handleSave = () => {
//     const values = form.getFieldsValue();
//     onDataChange((prev) => ({ ...prev, ...values }));
//     // console.log("Data saved", values);
//   };

//   return (
//     <div className='mb-4'>
//       <div
//         className='p-3 border rounded bg-gray-800 cursor-pointer'
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className='flex justify-between items-center text-white'>
//           <h4 className='m-0'>PROBABLE CAPITAL VALUATION REPORT</h4>
//           <Button
//             type='default'
//             size='small'
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsOpen(!isOpen);
//             }}
//           >
//             {isOpen ? "Close" : "Edit"}
//           </Button>
//         </div>
//       </div>

//       {isOpen && (
//         <div className='p-3 border rounded mt-2 bg-gray-100'>
//           <Form
//             form={form}
//             layout='vertical'
//             onValuesChange={handleChange}
//             initialValues={{
//               clientName: "GAURAV KUMAR GUPTA",
//               initiationDate: dayjs("2025-02-20"),
//               visitDate: dayjs("2025-02-20"),
//               caseReferenceNumber: "PLPIBH00077735",
//               reportDate: dayjs("2025-02-20"),
//               propertyOwnerName:
//                 "M/S RADHIKA STEELS (PROPERTY NAME: SHRI GAURAV GUPTA S/O RAJESH BABU GUPTA)",
//               propertyAddressAsPerTRF:
//                 "PROPERTY AT PLOT NO.62 IS SITUATED AT SECTOR-F, INDUSTRIAL AREA, GOVINDPURA,BHOPAL,TESHIL-HUZURI,DIST-BHOPAL,MP,462023",
//               propertyAddressAsPerVisit:
//                 "PROPERTY AT PLOT NO.62 IS SITUATED AT SECTOR-F, INDUSTRIAL AREA, GOVINDPURA,BHOPAL,TESHIL-HUZURI,DIST-BHOPAL,MP,462023",
//               propertyAddressAsPerLegalDocuments:
//                 "PROPERTY AT PLOT NO.62 IS SITUATED AT SECTOR-F, INDUSTRIAL AREA, GOVINDPURA,BHOPAL,TESHIL-HUZURI,DIST-BHOPAL,MP,462023",
//               mainLocality: "GOVINDPURA",
//               microLocation: "SECTOR-F",
//               latitude: "23.264111",
//               subLocality: "INDUSTRIAL AREA",
//               landmark: "NEAR ANAND ICE CREAM BHOPAL",
//               longitude: "777.444278",
//               hasEvaluatorDoneValuationBefore: "Yes",
//               valuationDate: dayjs("2024-07-10"),
//               propertyType: "Industrial",
//               propertySubType: "Factory",
//               locality: "Developing",
//               propertyFallingWithin: "Low Population Density",
//               conditionOfSite: "Under Developed",
//               distanceToRailwayStation: "5 KM",
//               distanceToBusStop: "5 KM",
//               distanceFromMainRoad: "above 500 m",
//               distanceFromCityCenter: "5 KM",
//               distanceFromBranch: "5 KM",
//               widthOfApproachRoad: "Width 10 to 20ft",
//               depthInFeet: "0",
//               physicalApproachToProperty: "Clear",
//               legalApproachToProperty: "Clear",
//               otherFeatures: "No",
//             }}
//           >
//             <h5 className='mt-4 mb-3'>Basic Details</h5>
//             <Row gutter={16}>
//               <Col md={8}>
//                 <Form.Item label='Name of the Client' name='clientName'>
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item label='Initiation Date' name='initiationDate'>
//                   <DatePicker className='w-full' />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item label='Visit Date' name='visitDate'>
//                   <DatePicker className='w-full' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col md={8}>
//                 <Form.Item
//                   label='Case Reference Number'
//                   name='caseReferenceNumber'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item label='Report Date' name='reportDate'>
//                   <DatePicker className='w-full' />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item
//                   label='Name of the Property Owner'
//                   name='propertyOwnerName'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <h5 className='mt-4 mb-3'>Location Details</h5>
//             <Row gutter={16}>
//               <Col md={24}>
//                 <Form.Item
//                   label='Property Address As Per TRF'
//                   name='propertyAddressAsPerTRF'
//                 >
//                   <TextArea rows={3} />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col md={12}>
//                 <Form.Item
//                   label='Property Address As Per Visit'
//                   name='propertyAddressAsPerVisit'
//                 >
//                   <TextArea rows={3} />
//                 </Form.Item>
//               </Col>
//               <Col md={12}>
//                 <Form.Item
//                   label='Property Address As Per Legal Documents'
//                   name='propertyAddressAsPerLegalDocuments'
//                 >
//                   <TextArea rows={3} />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col md={8}>
//                 <Form.Item label='Main Locality' name='mainLocality'>
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item label='Micro Location' name='microLocation'>
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item label='Latitude' name='latitude'>
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col md={8}>
//                 <Form.Item label='Sub Locality' name='subLocality'>
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item label='Landmark' name='landmark'>
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item label='Longitude' name='longitude'>
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col md={24}>
//                 <Form.Item
//                   label='Has the Evaluator Done Valuation for this property before? If yes, when, for whom?'
//                   name='hasEvaluatorDoneValuationBefore'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col md={8}>
//                 <Form.Item label='If yes, when' name='valuationDate'>
//                   <DatePicker className='w-full' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <h5 className='mt-4 mb-3'>Property Type</h5>
//             <Row gutter={16}>
//               <Col md={8}>
//                 <Form.Item label='Property Type' name='propertyType'>
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item label='Property Sub Type' name='propertySubType'>
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item label='Locality' name='locality'>
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <h5 className='mt-4 mb-3'>Occupancy Level of the Surrounding</h5>
//             <Row gutter={16}>
//               <Col md={24}>
//                 <Form.Item
//                   label='Property Falling Within'
//                   name='propertyFallingWithin'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <h5 className='mt-4 mb-3'>Condition of the Site of the Property</h5>
//             <Row gutter={16}>
//               <Col md={24}>
//                 <Form.Item
//                   label='Condition of the Site of the Property'
//                   name='conditionOfSite'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <h5 className='mt-4 mb-3'>Distances</h5>
//             <Row gutter={16}>
//               <Col md={8}>
//                 <Form.Item
//                   label='Distance to Railway Station'
//                   name='distanceToRailwayStation'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item
//                   label='Distance to Bus Stop'
//                   name='distanceToBusStop'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item
//                   label='Distance of Plot From Main Road'
//                   name='distanceFromMainRoad'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col md={8}>
//                 <Form.Item
//                   label='Distance from City Center'
//                   name='distanceFromCityCenter'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col md={8}>
//                 <Form.Item
//                   label='Distance from Branch'
//                   name='distanceFromBranch'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <h5 className='text-lg font-semibold mt-6 mb-3'>
//               Dimensions of the Property
//             </h5>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   label='Width of the Approach Road'
//                   name='widthOfApproachRoad'
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter the width of the approach road",
//                     },
//                   ]}
//                 >
//                   <Input placeholder='Width 10 to 20ft' />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   label='Depth in Feet'
//                   name='depthInFeet'
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter the depth in feet",
//                     },
//                   ]}
//                 >
//                   <Input placeholder='0' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <h5 className='text-lg font-semibold mt-6 mb-3'>
//               Physical and Legal Approach to the Property
//             </h5>
//             <Row gutter={16}>
//               <Col md={12}>
//                 <Form.Item
//                   label='Physical Approach to the Property'
//                   name='physicalApproachToProperty'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col md={12}>
//                 <Form.Item
//                   label='Legal Approach to the Property'
//                   name='legalApproachToProperty'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <h5 className='text-lg font-semibold mt-6 mb-3'>
//               Any Other Features
//             </h5>
//             <Row gutter={16}>
//               <Col md={24}>
//                 <Form.Item
//                   label='Any other features like board of other financier indicating mortgage, notice of Court/any authority which may affect the security:'
//                   name='otherFeatures'
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* Save Button */}
//             <div className='flex justify-end mt-4'>
//               <Button type='primary' onClick={handleSave}>
//                 Save
//               </Button>
//             </div>
//           </Form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfecutsDetails;

import React from "react";
import { Form, Input, Button, Select } from "antd";
import toast from "react-hot-toast";

const { Option } = Select;

const ProfecutsDetails = ({ extractedData, onNext }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const addr = p.address || {};
      const accom = p.accommodation_details || {};
      const propDet = p.property_details || {};

      form.setFieldsValue({
        nameOfProject: addr.project_name || addr.building_name || extractedData.nameOfProject,
        developerName: p.developer_name || p.builder_name || extractedData.developerName,
        totalNoOfBuildings: p.total_buildings || extractedData.totalNoOfBuildings,
        buildingUnderConsideration: p.building_consideration || extractedData.buildingUnderConsideration,
        reraId: p.rera_id || p.rera_registration_no || extractedData.reraId,
        completionStatus: p.completion_status || p.construction_stage || extractedData.completionStatus,
        expectedCompletionTime: p.expected_completion_time || extractedData.expectedCompletionTime,
        amenities: accom.amenities || propDet.amenities || extractedData.amenities,
        typeOfProject: p.property_type || extractedData.typeOfProject,
        isProjectApproved: p.project_approved || extractedData.isProjectApproved,
        approvalAuthority: p.approval_authority || extractedData.approvalAuthority,
        isRERAApproved: p.rera_approved || extractedData.isRERAApproved,
        occupancyCertificateAvailable: propDet.occupancy_certificate || extractedData.occupancyCertificateAvailable,
        landTitle: accom.property_holding || extractedData.landTitle,
        legalClearance: propDet.legal_clearance || extractedData.legalClearance,
        noOfUnits: accom.rooms_count || extractedData.noOfUnits,
        unitsSold: p.units_sold || extractedData.unitsSold,
        layoutPlanApproval: p.layout_plan_approval || extractedData.layoutPlanApproval,
        environmentalClearance: p.environmental_clearance || extractedData.environmentalClearance,
        encumbrance: p.encumbrance || extractedData.encumbrance,
        litigation: p.litigation || extractedData.litigation,
        natureOfProject: p.property_sub_type || extractedData.natureOfProject,
        sourceOfFunding: p.source_of_funding || extractedData.sourceOfFunding,
      });
    }
  }, [extractedData, form]);

  const initialValues = {
    nameOfProject: "Sunset Towers",
    developerName: "Green Builders Ltd.",
    totalNoOfBuildings: "5",
    buildingUnderConsideration: "2",
    reraId: "RERA123456789",
    completionStatus: "Under Construction",
    expectedCompletionTime: "December 2026",
    amenities: "Swimming Pool, Gym, Clubhouse, Garden, Jogging Track",
    typeOfProject: "Residential",
    isProjectApproved: "Yes",
    approvalAuthority: "Municipal Corporation",
    isRERAApproved: "Yes",
    occupancyCertificateAvailable: "No",
    landTitle: "Freehold",
    legalClearance: "Yes",
    noOfUnits: "200",
    unitsSold: "120",
    layoutPlanApproval: "Yes",
    environmentalClearance: "Yes",
    encumbrance: "No",
    litigation: "None",
    natureOfProject: "Luxury Apartments",
    sourceOfFunding: "Bank Loan, Developer's Own Funds",
  };

  const handleFinish = (values) => {
    onNext(values);
    toast.success("Saved Successfully");
  };

  return (
    <div className='max-w-6xl mx-auto p-6 bg-white rounded shadow'>
      <h2 className='text-2xl font-bold mb-6'>Project Details</h2>

      <Form
        layout='vertical'
        form={form}
        initialValues={initialValues}
        onFinish={handleFinish}
        className='grid grid-cols-1 md:grid-cols-2 gap-4'
      >
        <Form.Item label='Name of the Project' name='nameOfProject'>
          <Input />
        </Form.Item>

        <Form.Item label='Developer Name' name='developerName'>
          <Input />
        </Form.Item>

        <Form.Item label='Total No. of Buildings' name='totalNoOfBuildings'>
          <Input type='number' />
        </Form.Item>

        <Form.Item
          label='Building Under Consideration'
          name='buildingUnderConsideration'
        >
          <Input />
        </Form.Item>

        <Form.Item label='RERA ID' name='reraId'>
          <Input />
        </Form.Item>

        <Form.Item label='Completion Status' name='completionStatus'>
          <Select>
            <Option value='Completed'>Completed</Option>
            <Option value='Ongoing'>Ongoing</Option>
            <Option value='Planned'>Planned</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label='Expected Completion Time'
          name='expectedCompletionTime'
        >
          <Input />
        </Form.Item>

        <Form.Item label='Amenities' name='amenities'>
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label='Type of Project' name='typeOfProject'>
          <Select>
            <Option value='Residential'>Residential</Option>
            <Option value='Commercial'>Commercial</Option>
            <Option value='Mixed'>Mixed</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Is Project Approved?' name='isProjectApproved'>
          <Select>
            <Option value='Yes'>Yes</Option>
            <Option value='No'>No</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Approval Authority' name='approvalAuthority'>
          <Input />
        </Form.Item>

        <Form.Item label='Is RERA Approved?' name='isRERAApproved'>
          <Select>
            <Option value='Yes'>Yes</Option>
            <Option value='No'>No</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label='Occupancy Certificate Available?'
          name='occupancyCertificateAvailable'
        >
          <Select>
            <Option value='Yes'>Yes</Option>
            <Option value='No'>No</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Land Title' name='landTitle'>
          <Input />
        </Form.Item>

        <Form.Item label='Legal Clearance' name='legalClearance'>
          <Input />
        </Form.Item>

        <Form.Item label='No. of Units' name='noOfUnits'>
          <Input type='number' />
        </Form.Item>

        <Form.Item label='Units Sold' name='unitsSold'>
          <Input type='number' />
        </Form.Item>

        <Form.Item label='Layout Plan Approval' name='layoutPlanApproval'>
          <Select>
            <Option value='Yes'>Yes</Option>
            <Option value='No'>No</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label='Environmental Clearance'
          name='environmentalClearance'
        >
          <Select>
            <Option value='Yes'>Yes</Option>
            <Option value='No'>No</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Encumbrance' name='encumbrance'>
          <Select>
            <Option value='Free'>Free</Option>
            <Option value='Encumbered'>Encumbered</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Litigation (if any)' name='litigation'>
          <Input />
        </Form.Item>

        <Form.Item label='Nature of Project' name='natureOfProject'>
          <Input />
        </Form.Item>

        <Form.Item label='Source of Funding' name='sourceOfFunding'>
          <Input />
        </Form.Item>

        <Form.Item className='md:col-span-2 text-end'>
          <Button type='primary' htmlType='submit'>
            Next
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfecutsDetails;
