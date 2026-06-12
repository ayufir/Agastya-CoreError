// import React, { useEffect, useState } from "react";
// import { Row, Col, Input, Button, Collapse, Typography, Select } from "antd";

// const { Panel } = Collapse;
// const { Title } = Typography;
// const { Option } = Select;

// const GeneralAmenitiesAreaForm = ({ onNext, isEdit = {} }) => {
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     if (isEdit) {
//       setFormData((prev) => ({
//         ...prev,
//         ...isEdit,
//       }));
//     }
//   }, [isEdit]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (value, name) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const renderInput = (label, name, defaultValue = "") => (
//     <Col xs={24} md={8} className='mb-4'>
//       <label className='block text-gray-700 font-medium mb-1'>{label}</label>
//       <Input
//         name={name}
//         value={formData[name] || ""}
//         onChange={handleChange}
//         placeholder={label}
//       />
//     </Col>
//   );

//   const renderSelect = (label, name, options = ["YES", "NO", "PARTIAL"]) => (
//     <Col xs={24} md={8} className='mb-4'>
//       <label className='block text-gray-700 font-medium mb-1'>{label}</label>
//       <Select
//         value={formData[name] || ""}
//         onChange={(value) => handleSelectChange(value, name)}
//         className='w-full'
//         placeholder={`Select ${label}`}
//       >
//         {options.map((option) => (
//           <Option key={option} value={option}>
//             {option}
//           </Option>
//         ))}
//       </Select>
//     </Col>
//   );

//   // const handleSubmit = () => {
//   //   onNext(formData);
//   // };
//   const handleSubmit = (values) => {
//     const formattedData = {
//       ...data, // Preserve previous data (address, loanApplicationDetails)
//       generalAmenities: values,
//     };
//     onNext(formattedData);
//     toast.success("Saved successfully");
//   };

//   return (
//     <div className='bg-white shadow p-4 rounded'>
//       <Collapse defaultActiveKey={["1"]} className='mb-6'>
//         <Panel
//           header={
//             <Title level={5} className='!mb-0'>
//               GENERAL, AMENITIES & AREA DETAILS
//             </Title>
//           }
//           key='1'
//         >
//           {/* General Details */}
//           <Title level={5} className='mt-4 mb-2'>
//             GENERAL DETAILS
//           </Title>
//           <Row gutter={16}>
//             {renderInput("Municipal Limit", "municipalLimit", "YES")}
//             {renderInput(
//               "Municipal Authority (Name)",
//               "municipalAuthority",
//               "NAGAR NIGAM"
//             )}
//             {renderInput("Year of Construction", "yearOfConstruction", "2010")}
//             {renderInput("Occupancy Status", "occupancyStatus", "OCCUPIED")}
//             {renderInput("Age of Property", "ageOfProperty", "13")}
//             {renderInput("Residual Life of the Property", "residualLife", "47")}
//             {renderInput(
//               "Property Furnished/Unfurnished",
//               "propertyFurnishing",
//               "FURNISHED"
//             )}
//           </Row>

//           {/* General Amenities */}
//           <Title level={5} className='mt-8 mb-2'>
//             GENERAL AMENITIES
//           </Title>
//           <Row gutter={16}>
//             {renderSelect("Water Supply", "waterSupply")}
//             {renderSelect("Electricity Supply", "electricitySupply")}
//             {renderSelect("Parking Facility", "parkingFacility", ["YES", "NO"])}
//             {renderSelect("Lift Facility", "liftFacility", ["YES", "NO"])}
//             {renderSelect("Security", "security", ["YES", "NO"])}
//             {renderSelect("Fire Safety", "fireSafety", ["YES", "NO"])}
//             {renderSelect("Sewage System", "sewageSystem", ["YES", "NO"])}
//             {renderSelect("Waste Management", "wasteManagement", ["YES", "NO"])}
//             {renderSelect("Green Area", "greenArea", ["YES", "NO"])}
//             {renderSelect("Clubhouse", "clubhouse", ["YES", "NO"])}
//             {renderSelect("Swimming Pool", "swimmingPool", ["YES", "NO"])}
//             {renderSelect("Gymnasium", "gymnasium", ["YES", "NO"])}
//           </Row>

//           {/* External Amenities */}
//           <Title level={5} className='mt-8 mb-2'>
//             SURROUNDING EXTERNAL AMENITIES
//           </Title>
//           <Row gutter={16}>
//             {renderInput(
//               "Nearest Bus Stop",
//               "nearestBusStop",
//               "2-5 KM (MISHROAD BUS STOP)"
//             )}
//             {renderInput(
//               "Nearest Railway Station",
//               "nearestRailway",
//               "7.3 KM (RANKAMLAPATI RAILWAY STATION)"
//             )}
//             {renderInput(
//               "Nearest Airport",
//               "nearestAirport",
//               "25 KM (RAJABHOU AIRPORT)"
//             )}
//             {renderInput(
//               "Nearest School/College",
//               "nearestSchool",
//               "2-05 KM (RKDF INSTITUTE BHOPAL)"
//             )}
//             {renderInput("Nearest Bank", "nearestBank", "2-3 KM (HDFC BANK)")}
//             {renderInput(
//               "Nearest Highway/Major Road",
//               "nearestHighway",
//               "1-2 KM (HOSHANGABAD ROAD)"
//             )}
//             {renderInput(
//               "Nearest Hospital",
//               "nearestHospital",
//               "0-1 KM (UBUNTU HART HOSPITAL)"
//             )}
//             {renderInput(
//               "Nearest Multiplex/Mall/Market",
//               "nearestMall",
//               "2-5 KM (ASHIMA MALL)"
//             )}
//           </Row>

//           {/* Area Details */}
//           <Title level={5} className='mt-8 mb-2'>
//             AREA DETAILS
//           </Title>
//           <Row gutter={16}>
//             {renderInput("Plot Area (sq. feet)", "plotAreaSqFt")}
//             {renderInput("Plot Area (sq. meter)", "plotAreaSqMeter")}
//             {renderInput(
//               "Construction Area (sq. feet)",
//               "constructionAreaSqFt",
//               "0"
//             )}
//             {renderInput(
//               "Construction Area (sq. meter)",
//               "constructionAreaSqMeter",
//               "0.00"
//             )}
//             {renderInput(
//               "Carpet Area (sq. meter)",
//               "carpetAreaSqMeter",
//               "0.00"
//             )}
//             {renderInput(
//               "Built-up Area (sq. meter)",
//               "builtUpAreaSqMeter",
//               "0.00"
//             )}
//             {renderInput("Sale Area (sq. feet)", "saleAreaSqFt")}
//           </Row>

//           <div className='mt-6 text-right'>
//             <Button type='primary' size='large' onClick={handleSubmit}>
//               Save & Next
//             </Button>
//           </div>
//         </Panel>
//       </Collapse>
//     </div>
//   );
// };

// export default GeneralAmenitiesAreaForm;

import React, { useEffect, useState } from "react";
import { Row, Col, Input, Button, Collapse, Typography, Select } from "antd";
import toast from "react-hot-toast"; // Ensure toast is imported

const { Panel } = Collapse;
const { Title } = Typography;
const { Option } = Select;

const GeneralAmenitiesAreaForm = ({
  onNext,
  onBack,
  isEdit = {},
  data = {},
}) => {
  const [formData, setFormData] = useState({});

  // Dummy data for testing
  const dummyData = {
    municipalLimit: "YES",
    municipalAuthority: "Pune Municipal Corporation",
    yearOfConstruction: "2015",
    occupancyStatus: "OCCUPIED",
    ageOfProperty: "10",
    residualLife: "50",
    propertyFurnishing: "SEMI-FURNISHED",
    waterSupply: "YES",
    electricitySupply: "YES",
    parkingFacility: "YES",
    liftFacility: "NO",
    security: "YES",
    fireSafety: "YES",
    sewageSystem: "YES",
    wasteManagement: "YES",
    greenArea: "YES",
    clubhouse: "NO",
    swimmingPool: "NO",
    gymnasium: "NO",
    nearestBusStop: "1 KM (Kothrud Bus Stand)",
    nearestRailway: "5 KM (Pune Railway Station)",
    nearestAirport: "15 KM (Pune International Airport)",
    nearestSchool: "0.5 KM (City International School)",
    nearestBank: "1 KM (SBI Bank)",
    nearestHighway: "2 KM (Mumbai-Pune Expressway)",
    nearestHospital: "1 KM (Deenanath Mangeshkar Hospital)",
    nearestMall: "3 KM (Phoenix Marketcity)",
    plotAreaSqFt: "1200",
    plotAreaSqMeter: "111.48",
    constructionAreaSqFt: "800",
    constructionAreaSqMeter: "74.32",
    carpetAreaSqMeter: "65.00",
    builtUpAreaSqMeter: "70.00",
    saleAreaSqFt: "900",
  };

  useEffect(() => {
    if (isEdit && Object.keys(isEdit).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...isEdit,
      }));
    } else {
      setFormData(dummyData); // Set dummy data if not in edit mode
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderInput = (label, name, defaultValue = "") => (
    <Col xs={24} md={8} className='mb-4'>
      <label className='block text-gray-700 font-medium mb-1'>{label}</label>
      <Input
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        placeholder={label}
      />
    </Col>
  );

  const renderSelect = (label, name, options = ["YES", "NO", "PARTIAL"]) => (
    <Col xs={24} md={8} className='mb-4'>
      <label className='block text-gray-700 font-medium mb-1'>{label}</label>
      <Select
        value={formData[name] || ""}
        onChange={(value) => handleSelectChange(value, name)}
        className='w-full'
        placeholder={`Select ${label}`}
      >
        {options.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    </Col>
  );

  const handleSubmit = () => {
    const formattedData = {
      ...data, // Preserve previous data (address, loanApplicationDetails)
      generalAmenities: formData, // Wrap current form data in generalAmenities
    };
    onNext(formattedData);
    toast.success("Saved successfully");
  };

  return (
    <div className='bg-white shadow p-4 rounded'>
      <Collapse defaultActiveKey={["1"]} className='mb-6'>
        <Panel
          header={
            <Title level={5} className='!mb-0'>
              GENERAL, AMENITIES & AREA DETAILS
            </Title>
          }
          key='1'
        >
          {/* General Details */}
          <Title level={5} className='mt-4 mb-2'>
            GENERAL DETAILS
          </Title>
          <Row gutter={16}>
            {renderInput("Municipal Limit", "municipalLimit")}
            {renderInput("Municipal Authority (Name)", "municipalAuthority")}
            {renderInput("Year of Construction", "yearOfConstruction")}
            {renderInput("Occupancy Status", "occupancyStatus")}
            {renderInput("Age of Property", "ageOfProperty")}
            {renderInput("Residual Life of the Property", "residualLife")}
            {renderInput(
              "Property Furnished/Unfurnished",
              "propertyFurnishing"
            )}
          </Row>

          {/* General Amenities */}
          <Title level={5} className='mt-8 mb-2'>
            GENERAL AMENITIES
          </Title>
          <Row gutter={16}>
            {renderSelect("Water Supply", "waterSupply")}
            {renderSelect("Electricity Supply", "electricitySupply")}
            {renderSelect("Parking Facility", "parkingFacility", ["YES", "NO"])}
            {renderSelect("Lift Facility", "liftFacility", ["YES", "NO"])}
            {renderSelect("Security", "security", ["YES", "NO"])}
            {renderSelect("Fire Safety", "fireSafety", ["YES", "NO"])}
            {renderSelect("Sewage System", "sewageSystem", ["YES", "NO"])}
            {renderSelect("Waste Management", "wasteManagement", ["YES", "NO"])}
            {renderSelect("Green Area", "greenArea", ["YES", "NO"])}
            {renderSelect("Clubhouse", "clubhouse", ["YES", "NO"])}
            {renderSelect("Swimming Pool", "swimmingPool", ["YES", "NO"])}
            {renderSelect("Gymnasium", "gymnasium", ["YES", "NO"])}
          </Row>

          {/* External Amenities */}
          <Title level={5} className='mt-8 mb-2'>
            SURROUNDING EXTERNAL AMENITIES
          </Title>
          <Row gutter={16}>
            {renderInput("Nearest Bus Stop", "nearestBusStop")}
            {renderInput("Nearest Railway Station", "nearestRailway")}
            {renderInput("Nearest Airport", "nearestAirport")}
            {renderInput("Nearest School/College", "nearestSchool")}
            {renderInput("Nearest Bank", "nearestBank")}
            {renderInput("Nearest Highway/Major Road", "nearestHighway")}
            {renderInput("Nearest Hospital", "nearestHospital")}
            {renderInput("Nearest Multiplex/Mall/Market", "nearestMall")}
          </Row>

          {/* Area Details */}
          <Title level={5} className='mt-8 mb-2'>
            AREA DETAILS
          </Title>
          <Row gutter={16}>
            {renderInput("Plot Area (sq. feet)", "plotAreaSqFt")}
            {renderInput("Plot Area (sq. meter)", "plotAreaSqMeter")}
            {renderInput(
              "Construction Area (sq. feet)",
              "constructionAreaSqFt"
            )}
            {renderInput(
              "Construction Area (sq. meter)",
              "constructionAreaSqMeter"
            )}
            {renderInput("Carpet Area (sq. meter)", "carpetAreaSqMeter")}
            {renderInput("Built-up Area (sq. meter)", "builtUpAreaSqMeter")}
            {renderInput("Sale Area (sq. feet)", "saleAreaSqFt")}
          </Row>

          <div className='mt-6 flex justify-between'>
            <Button type='default' size='large' onClick={onBack}>
              Back
            </Button>
            <Button type='primary' size='large' onClick={handleSubmit}>
              Save & Next
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default GeneralAmenitiesAreaForm;
