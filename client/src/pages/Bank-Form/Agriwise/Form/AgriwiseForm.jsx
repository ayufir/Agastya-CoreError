import React, { useState } from "react";
import { Input, Select, Button, DatePicker, Divider } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const AgriwiseForm = ({ onSubmit }) => {
  const [formState, setFormState] = useState({
    valuationAgency: "Agriwise Valuers Pvt Ltd",
    dateOfValuation: "2025-05-10",
    proposalNo: "AWP123456",
    caseType: "Fresh",
    inspectionDate: "2025-05-08",
    nearestLandmark: "City Mall",
    customerName: "Ravi Sharma",
    sellerName: "Anil Verma",
    propertyAddress: "123, Green Residency, Sector 45, Gurgaon",
    propertyStatus: "Under Construction",
    propertyType: "Residential",
    developedBy: "ABC Developers",
    typeOfLocality: "Urban",
    inspectionSiteVisitDate: "2025-05-08",
    occupationStatus: "Vacant",
    propertyUsage: "Self Use",
    plotDemarcation: "Properly Fenced",
    propertyIdentifiable: "Yes",
    withinMC_GPLimit: "Yes",
    typeOfStructure: "RCC Frame",
    floorsInBuilding: "5",
    locatedOnFloorNo: "3",
    yearOfCompletion: "2024",
    constructionStage: "Plaster Work",
    disbursementRecommended: "Yes",
    ageOfProperty: "1",
    futurePhysicalLife: "60",
    saleDeed: "Available",
    statusOfLandHolding: "Freehold",
    typeOfProperty: "Flat",
    occupationStatusInspection: "Vacant",
    propertyUsageInspection: "Residential",
    plotDemarcationInspection: "Proper Boundary Wall",
    identifiedThrough: "Physical Inspection",
    internalFinishing: "Standard",
    noOfFloorsInBuildingInspection: "5",
    totalNoOfFlatsUnitInBuilding: "20",
    constructionStageOfPropertyInspection: "Plaster Work",
    ageOfThePropertyInYearInspection: "1",
    futurePhysicalLifeOfPropertyInYearInspection: "60",
    boundaries: {
      east: "Park",
      west: "Main Road",
      north: "Neighboring Flat",
      south: "Open Land",
    },
    boundariesMatching: "Yes",
  });

  const handleChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parentKey, childKey, value) => {
    setFormState((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
    }));
  };

  const handleDateChange = (field, date, dateString) => {
    setFormState((prev) => ({
      ...prev,
      [field]: dateString,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formState);
  };

  return (
    <div className='p-4 space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* Basic Information Section */}
        <div className='col-span-1 md:col-span-2 lg:col-span-3'>
          <h3 className='text-lg font-semibold'>Basic Information</h3>
          <Divider className='my-2' />
        </div>

        <Input
          placeholder='Valuation Agency'
          value={formState.valuationAgency}
          onChange={(e) => handleChange("valuationAgency", e.target.value)}
        />

        <DatePicker
          placeholder='Date of Valuation'
          style={{ width: "100%" }}
          onChange={(date, dateString) =>
            handleDateChange("dateOfValuation", date, dateString)
          }
        />

        <Input
          placeholder='Proposal No'
          value={formState.proposalNo}
          onChange={(e) => handleChange("proposalNo", e.target.value)}
        />

        <Select
          placeholder='Case Type'
          value={formState.caseType}
          onChange={(value) => handleChange("caseType", value)}
          style={{ width: "100%" }}
        >
          <Option value='Fresh'>Fresh</Option>
          <Option value='Renewal'>Renewal</Option>
          <Option value='Resurvey'>Resurvey</Option>
        </Select>

        <DatePicker
          placeholder='Inspection Date'
          style={{ width: "100%" }}
          onChange={(date, dateString) =>
            handleDateChange("inspectionDate", date, dateString)
          }
        />

        <Input
          placeholder='Nearest Landmark'
          value={formState.nearestLandmark}
          onChange={(e) => handleChange("nearestLandmark", e.target.value)}
        />

        <Input
          placeholder='Customer Name'
          value={formState.customerName}
          onChange={(e) => handleChange("customerName", e.target.value)}
        />

        <Input
          placeholder='Seller Name'
          value={formState.sellerName}
          onChange={(e) => handleChange("sellerName", e.target.value)}
        />

        <TextArea
          placeholder='Property Address'
          value={formState.propertyAddress}
          onChange={(e) => handleChange("propertyAddress", e.target.value)}
          rows={2}
          className='col-span-1 md:col-span-2'
        />

        {/* Property Details Section */}
        <div className='col-span-1 md:col-span-2 lg:col-span-3 mt-4'>
          <h3 className='text-lg font-semibold'>Property Details</h3>
          <Divider className='my-2' />
        </div>

        <Select
          placeholder='Property Status'
          value={formState.propertyStatus}
          onChange={(value) => handleChange("propertyStatus", value)}
          style={{ width: "100%" }}
        >
          <Option value='Under Construction'>Under Construction</Option>
          <Option value='Completed'>Completed</Option>
          <Option value='Ready to Move'>Ready to Move</Option>
        </Select>

        <Select
          placeholder='Property Type'
          value={formState.propertyType}
          onChange={(value) => handleChange("propertyType", value)}
          style={{ width: "100%" }}
        >
          <Option value='Residential'>Residential</Option>
          <Option value='Commercial'>Commercial</Option>
          <Option value='Industrial'>Industrial</Option>
          <Option value='Agricultural'>Agricultural</Option>
        </Select>

        <Input
          placeholder='Developed By'
          value={formState.developedBy}
          onChange={(e) => handleChange("developedBy", e.target.value)}
        />

        <Select
          placeholder='Type of Locality'
          value={formState.typeOfLocality}
          onChange={(value) => handleChange("typeOfLocality", value)}
          style={{ width: "100%" }}
        >
          <Option value='Urban'>Urban</Option>
          <Option value='Semi-Urban'>Semi-Urban</Option>
          <Option value='Rural'>Rural</Option>
        </Select>

        <DatePicker
          placeholder='Inspection Site Visit Date'
          style={{ width: "100%" }}
          onChange={(date, dateString) =>
            handleDateChange("inspectionSiteVisitDate", date, dateString)
          }
        />

        <Select
          placeholder='Occupation Status'
          value={formState.occupationStatus}
          onChange={(value) => handleChange("occupationStatus", value)}
          style={{ width: "100%" }}
        >
          <Option value='Vacant'>Vacant</Option>
          <Option value='Occupied'>Occupied</Option>
          <Option value='Partially Occupied'>Partially Occupied</Option>
        </Select>

        <Select
          placeholder='Property Usage'
          value={formState.propertyUsage}
          onChange={(value) => handleChange("propertyUsage", value)}
          style={{ width: "100%" }}
        >
          <Option value='Self Use'>Self Use</Option>
          <Option value='Rental'>Rental</Option>
          <Option value='Investment'>Investment</Option>
        </Select>

        <Select
          placeholder='Plot Demarcation'
          value={formState.plotDemarcation}
          onChange={(value) => handleChange("plotDemarcation", value)}
          style={{ width: "100%" }}
        >
          <Option value='Properly Fenced'>Properly Fenced</Option>
          <Option value='Partially Fenced'>Partially Fenced</Option>
          <Option value='Not Fenced'>Not Fenced</Option>
        </Select>

        <Select
          placeholder='Property Identifiable'
          value={formState.propertyIdentifiable}
          onChange={(value) => handleChange("propertyIdentifiable", value)}
          style={{ width: "100%" }}
        >
          <Option value='Yes'>Yes</Option>
          <Option value='No'>No</Option>
        </Select>

        <Select
          placeholder='Within MC/GP Limit'
          value={formState.withinMC_GPLimit}
          onChange={(value) => handleChange("withinMC_GPLimit", value)}
          style={{ width: "100%" }}
        >
          <Option value='Yes'>Yes</Option>
          <Option value='No'>No</Option>
        </Select>

        {/* Construction Details Section */}
        <div className='col-span-1 md:col-span-2 lg:col-span-3 mt-4'>
          <h3 className='text-lg font-semibold'>Construction Details</h3>
          <Divider className='my-2' />
        </div>

        <Select
          placeholder='Type of Structure'
          value={formState.typeOfStructure}
          onChange={(value) => handleChange("typeOfStructure", value)}
          style={{ width: "100%" }}
        >
          <Option value='RCC Frame'>RCC Frame</Option>
          <Option value='Load Bearing'>Load Bearing</Option>
          <Option value='Steel Structure'>Steel Structure</Option>
          <Option value='Pre-fabricated'>Pre-fabricated</Option>
        </Select>

        <Input
          placeholder='Floors in Building'
          type='number'
          value={formState.floorsInBuilding}
          onChange={(e) => handleChange("floorsInBuilding", e.target.value)}
        />

        <Input
          placeholder='Located on Floor No'
          type='number'
          value={formState.locatedOnFloorNo}
          onChange={(e) => handleChange("locatedOnFloorNo", e.target.value)}
        />

        <Input
          placeholder='Year of Completion'
          type='number'
          value={formState.yearOfCompletion}
          onChange={(e) => handleChange("yearOfCompletion", e.target.value)}
        />

        <Select
          placeholder='Construction Stage'
          value={formState.constructionStage}
          onChange={(value) => handleChange("constructionStage", value)}
          style={{ width: "100%" }}
        >
          <Option value='Plaster Work'>Plaster Work</Option>
          <Option value='Brick Work'>Brick Work</Option>
          <Option value='Foundation'>Foundation</Option>
          <Option value='Superstructure'>Superstructure</Option>
          <Option value='Completed'>Completed</Option>
        </Select>

        <Select
          placeholder='Disbursement Recommended'
          value={formState.disbursementRecommended}
          onChange={(value) => handleChange("disbursementRecommended", value)}
          style={{ width: "100%" }}
        >
          <Option value='Yes'>Yes</Option>
          <Option value='No'>No</Option>
        </Select>

        <Input
          placeholder='Age of Property (Years)'
          type='number'
          value={formState.ageOfProperty}
          onChange={(e) => handleChange("ageOfProperty", e.target.value)}
        />

        <Input
          placeholder='Future Physical Life (Years)'
          type='number'
          value={formState.futurePhysicalLife}
          onChange={(e) => handleChange("futurePhysicalLife", e.target.value)}
        />

        {/* Legal Details Section */}
        <div className='col-span-1 md:col-span-2 lg:col-span-3 mt-4'>
          <h3 className='text-lg font-semibold'>Legal Details</h3>
          <Divider className='my-2' />
        </div>

        <Select
          placeholder='Sale Deed'
          value={formState.saleDeed}
          onChange={(value) => handleChange("saleDeed", value)}
          style={{ width: "100%" }}
        >
          <Option value='Available'>Available</Option>
          <Option value='Not Available'>Not Available</Option>
          <Option value='Under Process'>Under Process</Option>
        </Select>

        <Select
          placeholder='Status of Land Holding'
          value={formState.statusOfLandHolding}
          onChange={(value) => handleChange("statusOfLandHolding", value)}
          style={{ width: "100%" }}
        >
          <Option value='Freehold'>Freehold</Option>
          <Option value='Leasehold'>Leasehold</Option>
          <Option value='Power of Attorney'>Power of Attorney</Option>
        </Select>

        <Select
          placeholder='Type of Property'
          value={formState.typeOfProperty}
          onChange={(value) => handleChange("typeOfProperty", value)}
          style={{ width: "100%" }}
        >
          <Option value='Flat'>Flat</Option>
          <Option value='Independent House'>Independent House</Option>
          <Option value='Plot'>Plot</Option>
          <Option value='Villa'>Villa</Option>
        </Select>

        {/* Inspection Details Section */}
        <div className='col-span-1 md:col-span-2 lg:col-span-3 mt-4'>
          <h3 className='text-lg font-semibold'>Inspection Details</h3>
          <Divider className='my-2' />
        </div>

        <Select
          placeholder='Occupation Status (Inspection)'
          value={formState.occupationStatusInspection}
          onChange={(value) =>
            handleChange("occupationStatusInspection", value)
          }
          style={{ width: "100%" }}
        >
          <Option value='Vacant'>Vacant</Option>
          <Option value='Occupied'>Occupied</Option>
          <Option value='Partially Occupied'>Partially Occupied</Option>
        </Select>

        <Select
          placeholder='Property Usage (Inspection)'
          value={formState.propertyUsageInspection}
          onChange={(value) => handleChange("propertyUsageInspection", value)}
          style={{ width: "100%" }}
        >
          <Option value='Residential'>Residential</Option>
          <Option value='Commercial'>Commercial</Option>
          <Option value='Mixed Use'>Mixed Use</Option>
        </Select>

        <Select
          placeholder='Plot Demarcation (Inspection)'
          value={formState.plotDemarcationInspection}
          onChange={(value) => handleChange("plotDemarcationInspection", value)}
          style={{ width: "100%" }}
        >
          <Option value='Proper Boundary Wall'>Proper Boundary Wall</Option>
          <Option value='Partial Boundary'>Partial Boundary</Option>
          <Option value='No Boundary'>No Boundary</Option>
        </Select>

        <Select
          placeholder='Identified Through'
          value={formState.identifiedThrough}
          onChange={(value) => handleChange("identifiedThrough", value)}
          style={{ width: "100%" }}
        >
          <Option value='Physical Inspection'>Physical Inspection</Option>
          <Option value='Documents'>Documents</Option>
          <Option value='Both'>Both</Option>
        </Select>

        <Select
          placeholder='Internal Finishing'
          value={formState.internalFinishing}
          onChange={(value) => handleChange("internalFinishing", value)}
          style={{ width: "100%" }}
        >
          <Option value='Standard'>Standard</Option>
          <Option value='Premium'>Premium</Option>
          <Option value='Basic'>Basic</Option>
          <Option value='Luxury'>Luxury</Option>
        </Select>

        <Input
          placeholder='No. of Floors in Building (Inspection)'
          type='number'
          value={formState.noOfFloorsInBuildingInspection}
          onChange={(e) =>
            handleChange("noOfFloorsInBuildingInspection", e.target.value)
          }
        />

        <Input
          placeholder='Total No. of Flats/Units in Building'
          type='number'
          value={formState.totalNoOfFlatsUnitInBuilding}
          onChange={(e) =>
            handleChange("totalNoOfFlatsUnitInBuilding", e.target.value)
          }
        />

        <Select
          placeholder='Construction Stage of Property (Inspection)'
          value={formState.constructionStageOfPropertyInspection}
          onChange={(value) =>
            handleChange("constructionStageOfPropertyInspection", value)
          }
          style={{ width: "100%" }}
        >
          <Option value='Plaster Work'>Plaster Work</Option>
          <Option value='Brick Work'>Brick Work</Option>
          <Option value='Foundation'>Foundation</Option>
          <Option value='Superstructure'>Superstructure</Option>
          <Option value='Completed'>Completed</Option>
        </Select>

        <Input
          placeholder='Age of the Property (Years) (Inspection)'
          type='number'
          value={formState.ageOfThePropertyInYearInspection}
          onChange={(e) =>
            handleChange("ageOfThePropertyInYearInspection", e.target.value)
          }
        />

        <Input
          placeholder='Future Physical Life of Property (Years) (Inspection)'
          type='number'
          value={formState.futurePhysicalLifeOfPropertyInYearInspection}
          onChange={(e) =>
            handleChange(
              "futurePhysicalLifeOfPropertyInYearInspection",
              e.target.value
            )
          }
        />

        {/* Boundaries Section */}
        <div className='col-span-1 md:col-span-2 lg:col-span-3 mt-4'>
          <h3 className='text-lg font-semibold'>Boundaries</h3>
          <Divider className='my-2' />
        </div>

        <Input
          placeholder='East Boundary'
          value={formState.boundaries.east}
          onChange={(e) =>
            handleNestedChange("boundaries", "east", e.target.value)
          }
        />

        <Input
          placeholder='West Boundary'
          value={formState.boundaries.west}
          onChange={(e) =>
            handleNestedChange("boundaries", "west", e.target.value)
          }
        />

        <Input
          placeholder='North Boundary'
          value={formState.boundaries.north}
          onChange={(e) =>
            handleNestedChange("boundaries", "north", e.target.value)
          }
        />

        <Input
          placeholder='South Boundary'
          value={formState.boundaries.south}
          onChange={(e) =>
            handleNestedChange("boundaries", "south", e.target.value)
          }
        />

        <Select
          placeholder='Boundaries Matching'
          value={formState.boundariesMatching}
          onChange={(value) => handleChange("boundariesMatching", value)}
          style={{ width: "100%" }}
        >
          <Option value='Yes'>Yes</Option>
          <Option value='No'>No</Option>
          <Option value='Partially'>Partially</Option>
        </Select>
      </div>

      <div className='pt-4 flex justify-end'>
        <Button type='primary' size='large' onClick={handleSubmit}>
          Submit Form
        </Button>
      </div>
    </div>
  );
};

export default AgriwiseForm;
