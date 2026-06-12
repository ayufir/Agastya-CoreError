// import React, { useState } from "react";
// import { Form, Input, Button, Row, Col } from "antd";

// const PropertyDetails = ({ onDataChange }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleChange = (changedValues, allValues) => {
//     onDataChange((prev) => ({ ...prev, ...allValues }));
//   };

//   return (
//     <div className='mb-4 border rounded'>
//       <div
//         className='bg-gray-800 text-white p-4 cursor-pointer flex justify-between items-center rounded'
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h4 className='m-0'>PROPERTY DETAILS</h4>
//         <Button
//           size='small'
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsOpen(!isOpen);
//           }}
//         >
//           {isOpen ? "Close" : "Edit"}
//         </Button>
//       </div>

//       {isOpen && (
//         <div className='bg-gray-100 p-4 rounded mt-2'>
//           <Form layout='vertical' onValuesChange={handleChange}>
//             <h5 className='text-lg font-semibold mb-4'>Occupancy</h5>
//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item label='Occupied Since' name='occupiedSince'>
//                   <Input defaultValue='2003' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Occupied' name='occupied'>
//                   <Input defaultValue='Occupied' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Occupied By' name='occupiedBy'>
//                   <Input defaultValue='RADHIKA STEELS' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item
//                   label='Property Demarcated'
//                   name='propertyDemarcated'
//                 >
//                   <Input defaultValue='YES' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Project Category' name='projectCategory'>
//                   <Input defaultValue='Not Applicable' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Flat Configuration' name='flatConfiguration'>
//                   <Input defaultValue='Not Applicable' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item label='Flat Type' name='flatType'>
//                   <Input defaultValue='Not Applicable' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Property Holding' name='propertyHolding'>
//                   <Input defaultValue='Leasehold' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item
//                   label='Property Identification'
//                   name='propertyIdentification'
//                 >
//                   <Input defaultValue='YES' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item label='Type of Structure' name='typeOfStructure'>
//                   <Input defaultValue='Fully Steel' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Area of Plot' name='areaOfPlot'>
//                   <Input defaultValue='7,280' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Lift Facility' name='liftFacility'>
//                   <Input defaultValue='No' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item label='Total No of Floors' name='totalNoOfFloors'>
//                   <Input defaultValue='G.F.' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Amenities' name='amenities'>
//                   <Input defaultValue='NA' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Marketability' name='marketability'>
//                   <Input defaultValue='Average' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item
//                   label='View of the Property'
//                   name='viewOfTheProperty'
//                 >
//                   <Input defaultValue='Normal View / Not Applicable' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item
//                   label='Quality of Construction'
//                   name='qualityOfConstruction'
//                 >
//                   <Input defaultValue='Class B' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item
//                   label='Shape of the Property'
//                   name='shapeOfTheProperty'
//                 >
//                   <Input defaultValue='Regular' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item
//                   label='Exteriors of the Property'
//                   name='exteriorsOfTheProperty'
//                 >
//                   <Input defaultValue='Average' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Age of the Property' name='ageOfTheProperty'>
//                   <Input defaultValue='2' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item
//                   label='Maintenance of the Property'
//                   name='maintenanceOfTheProperty'
//                 >
//                   <Input defaultValue='Good' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item label='Unit Details' name='unitDetails'>
//                   <Input defaultValue='Ground Floor: 2, Bedroom: 1' />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item label='Residual Age' name='residualAge'>
//                   <Input defaultValue='58' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <h5 className='text-lg font-semibold mb-4 mt-4'>
//               Documentation Details
//             </h5>
//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item label='Sale Deed' name='saleDeed'>
//                   <Input defaultValue='Fully Available' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Sanctioned Plan' name='sanctionedPlan'>
//                   <Input defaultValue='Not Available' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='CC/OC' name='ccOc'>
//                   <Input defaultValue='Not Available' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item label='Agreement to Sale' name='agreementToSale'>
//                   <Input defaultValue='Not Available' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Mutation' name='mutation'>
//                   <Input defaultValue='Details' />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item label='Tax' name='tax'>
//                   <Input defaultValue='Details' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item label='Electricity Bill' name='electricityBill'>
//                   <Input defaultValue='Not Applicable' />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item label='Conversion' name='conversion'>
//                   <Input defaultValue='Not Applicable' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={24}>
//                 <Form.Item label='Set Back in Case of L+B' name='setBack'>
//                   <Input defaultValue='As per Plan' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item label='Front Side (L)' name='frontSide'>
//                   <Input defaultValue='As per Site' />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item label='Side (R)' name='side'>
//                   <Input defaultValue='As per Site' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={24}>
//                 <Form.Item label='Back' name='back'>
//                   <Input defaultValue='As per Site' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={24}>
//                 <Form.Item label='Deviations' name='deviations'>
//                   <Input defaultValue='NA' />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={24}>
//                 <Form.Item label='Remarks' name='remarks'>
//                   <Input defaultValue='NA' />
//                 </Form.Item>
//               </Col>
//             </Row>
//           </Form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PropertyDetails;

import React from "react";
import { Form, Input, Button, Select } from "antd";
import toast from "react-hot-toast";

const { Option } = Select;

const PropertyDetails = ({ extractedData, onNext }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const bounds = p.boundaries || {};
      const val = p.valuation_details || {};
      const propDet = p.property_details || {};
      const accom = p.accommodation_details || {};

      form.setFieldsValue({
        directions: {
          North: bounds.north_actual || bounds.north_as_per_deed || extractedData.northBoundary || form.getFieldValue(["directions", "North"]),
          South: bounds.south_actual || bounds.south_as_per_deed || extractedData.southBoundary || form.getFieldValue(["directions", "South"]),
          East: bounds.east_actual || bounds.east_as_per_deed || extractedData.eastBoundary || form.getFieldValue(["directions", "East"]),
          West: bounds.west_actual || bounds.west_as_per_deed || extractedData.westBoundary || form.getFieldValue(["directions", "West"]),
        },
        boundariesMatching: extractedData.boundariesMatching || form.getFieldValue("boundariesMatching"),
        plotArea: val.plot_area_physical || val.plot_area_plan || val.plot_area_in_deed || extractedData.plotArea,
        isPropertyWithinLimit: propDet.property_within_limit || extractedData.isPropertyWithinLimit,
        marketability: propDet.marketability || extractedData.marketability,
        typeOfStructure: accom.type_of_structure || p.property_sub_type || extractedData.typeOfStructure,
        qualityOfConstruction: accom.quality_of_construction || extractedData.qualityOfConstruction,
        unitFlatConfiguration: accom.flat_configuration || extractedData.unitFlatConfiguration,
        noOfFloorsPermissible: propDet.no_of_floors_permissible || extractedData.noOfFloorsPermissible,
        noOfUnitFlatOnEachFloor: propDet.no_of_units_on_each_floor || extractedData.noOfUnitFlatOnEachFloor,
        noOfFloorsActual: propDet.no_of_floors_actual || extractedData.noOfFloorsActual,
        approxAgeOfProperty: accom.age_of_property || propDet.age_of_property || extractedData.approxAgeOfProperty,
        residualAge: accom.residual_age || propDet.residual_age || extractedData.residualAge,
        liftAvailable: accom.lift_facility || extractedData.liftAvailable,
        constructionStage: p.construction_stage || p.completion_status || extractedData.constructionStage,
      });
    }
  }, [extractedData, form]);

  const initialValues = {
    directions: {
      North: "Adjacent to Green Park",
      South: "20 ft Wide Internal Road",
      East: "Residential Complex",
      West: "Open Land",
    },
    boundariesMatching: "Yes", // Indicates that physical site boundaries match legal documents
    plotArea: "1500 sq.ft.", // Total plot area in square feet or meters
    isPropertyWithinLimit: "Yes", // Confirms that the property lies within municipal limits
    marketability: "Good", // Reflects ease of selling/reselling based on legality and location
    typeOfStructure: "RCC Framed Structure", // Common type for modern construction
    qualityOfConstruction: "High", // Subjective assessment: High / Medium / Low
    unitFlatConfiguration: "3 BHK", // Type of unit configuration (e.g., 2 BHK, 3 BHK, Studio)
    noOfFloorsPermissible: "5", // As per local authority approvals
    noOfUnitFlatOnEachFloor: "2", // Number of units per floor
    noOfFloorsActual: "4", // Floors built so far or completed
    approxAgeOfProperty: "2 years", // Age since construction was completed
    residualAge: "48 years", // Remaining life span based on structure/material quality
    liftAvailable: "Yes", // Indicates if lift is available in the building
    constructionStage: "Ready to Move", // Options: Planned, Under Construction, Ready to Move
  };

  const handleFinish = (values) => {
    onNext(values);
    toast.success("Saved Successfully");
  };

  return (
    <div className='max-w-6xl mx-auto p-6 bg-white rounded shadow'>
      <h2 className='text-2xl font-bold mb-6'>Property Details</h2>

      <Form
        layout='vertical'
        form={form}
        initialValues={initialValues}
        onFinish={handleFinish}
        className='grid grid-cols-1 md:grid-cols-2 gap-4'
      >
        {/* Directions */}
        {["North", "South", "East", "West"].map((dir) => (
          <Form.Item
            key={dir}
            label={`Direction - ${dir}`}
            name={["directions", dir]}
          >
            <Input />
          </Form.Item>
        ))}

        <Form.Item label='Boundaries Matching' name='boundariesMatching'>
          <Select>
            <Option value='Yes'>Yes</Option>
            <Option value='No'>No</Option>
            <Option value='NA'>NA</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Plot Area (Sq. ft)' name='plotArea'>
          <Input type='number' />
        </Form.Item>

        <Form.Item
          label='Is Property Within Limit'
          name='isPropertyWithinLimit'
        >
          <Input />
        </Form.Item>

        <Form.Item label='Marketability' name='marketability'>
          <Select>
            <Option value='Yes'>Yes</Option>
            <Option value='No'>No</Option>
            <Option value='NA'>NA</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Type of Structure' name='typeOfStructure'>
          <Input />
        </Form.Item>

        <Form.Item label='Quality of Construction' name='qualityOfConstruction'>
          <Input />
        </Form.Item>

        <Form.Item
          label='Unit / Flat Configuration'
          name='unitFlatConfiguration'
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='No. of Floors Permissible'
          name='noOfFloorsPermissible'
        >
          <Input type='number' />
        </Form.Item>

        <Form.Item
          label='No. of Unit / Flat on Each Floor'
          name='noOfUnitFlatOnEachFloor'
        >
          <Input type='number' />
        </Form.Item>

        <Form.Item label='No. of Floors Actual' name='noOfFloorsActual'>
          <Input type='number' />
        </Form.Item>

        <Form.Item
          label='Approx. Age of Property (Years)'
          name='approxAgeOfProperty'
        >
          <Input type='number' />
        </Form.Item>

        <Form.Item label='Residual Age (Years)' name='residualAge'>
          <Input type='number' />
        </Form.Item>

        <Form.Item label='Lift Available' name='liftAvailable'>
          <Select>
            <Option value='Yes'>Yes</Option>
            <Option value='No'>No</Option>
            <Option value='NA'>NA</Option>
          </Select>
        </Form.Item>

        <Form.Item label='Construction Stage' name='constructionStage'>
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

export default PropertyDetails;
