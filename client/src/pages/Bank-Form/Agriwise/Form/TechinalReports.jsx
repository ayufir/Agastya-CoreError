import React, { useState } from "react";
import { Input, DatePicker, Select, Row, Col } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const TechnicalReports = ({ onDataChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    branchName: "IDFC FIRST MANDDEEP",
    ref: "",
    date: "2023-05-22",
    typeOfCase: "Ht (construction)",
    volunteerName: "UNIQUE ENGINEERING AND ASSOCIATE",
    dateOfVisit: "2023-05-22",
    caseRefNo: "NA",
    contactPersonName: "MR. SUNIL KUMAR",
    contactPersonNumber: "7987459327",
    applicantNames: "MR. RAJESH KUMAR",
    propertyType: "RESIDNETIAL",
    currentUsage: "UNDER CONST",
    siteAddress: "UNDER CONST RESIDENTIAL HOUSE ON PLOT NO. 217...",
    documentAddress: "UNDER CONST RESIDENTIAL HOUSE ON PLOT NO. 217...",
    previousValuation: "",
    location: "RESIDENTIAL",
    approvedUsage: "RESIDENTIAL",
    localityClass: "RESIDENTIAL",
    siteDevelopment: "DEV",
    proximityAmenities: "YES",
    railwayStationDistance: "5 KM",
    busStopDistance: "2KM",
    landmark: "NEAR ORIENTAL PUBLIC SCHOOL",
    cityCentreDistance: "1 KM",
    approachRoad: "More than 10 ft",
  });

  const handleChange = (name, value) => {
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    onDataChange(updated); // 🔥 Send full form data to parent
  };

  return (
    <div className='border rounded mb-4'>
      <div
        className='bg-gray-800 text-white p-4 cursor-pointer flex justify-between items-center'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-lg font-semibold'>
          TECHNICAL APPRAISAL REPORT FOR HOUSE/FLAT/LAND/OFFICE/COMMERCIAL
          PROPERTY
        </h4>
        <button
          className='bg-white text-gray-800 px-3 py-1 rounded'
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='bg-white p-6'>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <label className='block mb-1'>Branch Name</label>
              <Input
                name='branchName'
                value={formData.branchName}
                onChange={(e) => handleChange("branchName", e.target.value)}
              />
            </Col>
            <Col span={8}>
              <label className='block mb-1'>Ref</label>
              <Input
                name='ref'
                value={formData.ref}
                onChange={(e) => handleChange("ref", e.target.value)}
              />
            </Col>
            <Col span={8}>
              <label className='block mb-1'>Date</label>
              <Input
                type='date'
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </Col>

            <Col span={8}>
              <label className='block mb-1'>Type of Case</label>
              <Input
                value={formData.typeOfCase}
                onChange={(e) => handleChange("typeOfCase", e.target.value)}
              />
            </Col>
            <Col span={8}>
              <label className='block mb-1'>Volunteer Name</label>
              <Input
                value={formData.volunteerName}
                onChange={(e) => handleChange("volunteerName", e.target.value)}
              />
            </Col>
            <Col span={8}>
              <label className='block mb-1'>Date of Visit</label>
              <Input
                type='date'
                value={formData.dateOfVisit}
                onChange={(e) => handleChange("dateOfVisit", e.target.value)}
              />
            </Col>

            <Col span={8}>
              <label className='block mb-1'>Case Ref No.</label>
              <Input
                value={formData.caseRefNo}
                onChange={(e) => handleChange("caseRefNo", e.target.value)}
              />
            </Col>

            <Col span={8}>
              <label className='block mb-1'>Contact Person Name</label>
              <Input
                value={formData.contactPersonName}
                onChange={(e) =>
                  handleChange("contactPersonName", e.target.value)
                }
              />
            </Col>

            <Col span={8}>
              <label className='block mb-1'>Contact Number</label>
              <Input
                value={formData.contactPersonNumber}
                onChange={(e) =>
                  handleChange("contactPersonNumber", e.target.value)
                }
              />
            </Col>

            <Col span={12}>
              <label className='block mb-1'>Applicant Names</label>
              <Input
                value={formData.applicantNames}
                onChange={(e) => handleChange("applicantNames", e.target.value)}
              />
            </Col>

            <Col span={6}>
              <label className='block mb-1'>Type of Property</label>
              <Input
                value={formData.propertyType}
                onChange={(e) => handleChange("propertyType", e.target.value)}
              />
            </Col>
            <Col span={6}>
              <label className='block mb-1'>Current Usage</label>
              <Input
                value={formData.currentUsage}
                onChange={(e) => handleChange("currentUsage", e.target.value)}
              />
            </Col>

            <Col span={24}>
              <label className='block mb-1'>Address at Site</label>
              <TextArea
                rows={3}
                value={formData.siteAddress}
                onChange={(e) => handleChange("siteAddress", e.target.value)}
              />
            </Col>
            <Col span={24}>
              <label className='block mb-1'>Address as per Document</label>
              <TextArea
                rows={3}
                value={formData.documentAddress}
                onChange={(e) =>
                  handleChange("documentAddress", e.target.value)
                }
              />
            </Col>
            <Col span={24}>
              <label className='block mb-1'>Previous Valuation Info</label>
              <Input
                value={formData.previousValuation}
                onChange={(e) =>
                  handleChange("previousValuation", e.target.value)
                }
              />
            </Col>

            <Col span={6}>
              <label className='block mb-1'>Location</label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </Col>
            <Col span={6}>
              <label className='block mb-1'>Approved Usage</label>
              <Input
                value={formData.approvedUsage}
                onChange={(e) => handleChange("approvedUsage", e.target.value)}
              />
            </Col>
            <Col span={6}>
              <label className='block mb-1'>Locality Class</label>
              <Input
                value={formData.localityClass}
                onChange={(e) => handleChange("localityClass", e.target.value)}
              />
            </Col>
            <Col span={6}>
              <label className='block mb-1'>Site Development</label>
              <Input
                value={formData.siteDevelopment}
                onChange={(e) =>
                  handleChange("siteDevelopment", e.target.value)
                }
              />
            </Col>

            <Col span={6}>
              <label className='block mb-1'>Proximity to Amenities</label>
              <Select
                value={formData.proximityAmenities}
                onChange={(value) => handleChange("proximityAmenities", value)}
                className='w-full'
              >
                <Option value='YES'>YES</Option>
                <Option value='NO'>NO</Option>
              </Select>
            </Col>
            <Col span={6}>
              <label className='block mb-1'>Railway Station Distance</label>
              <Input
                value={formData.railwayStationDistance}
                onChange={(e) =>
                  handleChange("railwayStationDistance", e.target.value)
                }
              />
            </Col>
            <Col span={6}>
              <label className='block mb-1'>Bus Stop Distance</label>
              <Input
                value={formData.busStopDistance}
                onChange={(e) =>
                  handleChange("busStopDistance", e.target.value)
                }
              />
            </Col>
            <Col span={6}>
              <label className='block mb-1'>Landmark</label>
              <Input
                value={formData.landmark}
                onChange={(e) => handleChange("landmark", e.target.value)}
              />
            </Col>

            <Col span={6}>
              <label className='block mb-1'>City Centre Distance</label>
              <Input
                value={formData.cityCentreDistance}
                onChange={(e) =>
                  handleChange("cityCentreDistance", e.target.value)
                }
              />
            </Col>
            <Col span={6}>
              <label className='block mb-1'>Approach Road</label>
              <Select
                value={formData.approachRoad}
                onChange={(value) => handleChange("approachRoad", value)}
                className='w-full'
              >
                <Option value='More than 10 ft'>More than 10 ft</Option>
                <Option value='Less than 10 ft'>Less than 10 ft</Option>
              </Select>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default TechnicalReports;
