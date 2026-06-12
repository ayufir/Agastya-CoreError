// import React, { useState } from 'react';
// import { Row, Col } from 'react-bootstrap';

// const TechnicalAppraisalReport = ({ onDataChange }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     onDataChange(prev => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="accordion-item mb-4">
//       <div
//         className="accordion-header p-3 border rounded"
//         style={{ backgroundColor: "#30384B", cursor: "pointer" }}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className="d-flex justify-content-between align-items-center text-white">
//           <h4 className="m-0">TECHNICAL APPRAISAL REPORT FOR HOUSE/FLAT/LAND/OFFICE/COMMERCIAL PROPERTY</h4>
//           <button
//             type="button"
//             className="btn btn-light btn-sm"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsOpen(!isOpen);
//             }}
//           >
//             {isOpen ? "Close" : "Edit"}
//           </button>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="accordion-body p-3 border rounded mt-2" style={{ backgroundColor: "#f8f9fa" }}>
//           <div className="card-body">
//             <Row className="mb-3">
//               <Col md={4}>
//                 <label className="form-label">Branch Name</label>
//                 <input
//                   type="text"
//                   name="branchName"
//                   className="form-control"
//                   "IDFC FIRST MANDDEEP"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Ref</label>
//                 <input
//                   type="text"
//                   name="ref"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Date</label>
//                 <input
//                   type="date"
//                   name="date"
//                   className="form-control"
//                   "2023-05-22"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={4}>
//                 <label className="form-label">Type of Case</label>
//                 <input
//                   type="text"
//                   name="typeOfCase"
//                   className="form-control"
//                   defaultValue="Ht (construction)"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Volunteer Name</label>
//                 <input
//                   type="text"
//                   name="volunteerName"
//                   className="form-control"
//                   defaultValue="UNIQUE ENGINEERING AND ASSOCIATE"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Date of Visit</label>
//                 <input
//                   type="date"
//                   name="dateOfVisit"
//                   className="form-control"
//                   defaultValue="2023-05-22"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={4}>
//                 <label className="form-label">Case Ref. No.</label>
//                 <input
//                   type="text"
//                   name="caseRefNo"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <h5 className="mt-4 mb-3">Contacted Person for property inspection</h5>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Name</label>
//                 <input
//                   type="text"
//                   name="contactPersonName"
//                   className="form-control"
//                   defaultValue="MR. SUNIL KUMAR"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Contact No.</label>
//                 <input
//                   type="text"
//                   name="contactPersonNumber"
//                   className="form-control"
//                   defaultValue="7987459327"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <h5 className="mt-4 mb-3">BASIC DETAILS</h5>
//             <Row className="mb-3">
//               <Col md={12}>
//                 <label className="form-label">Application/s Name/s</label>
//                 <input
//                   type="text"
//                   name="applicantNames"
//                   className="form-control"
//                   defaultValue="MR. RAJESH KUMAR"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Type of property</label>
//                 <input
//                   type="text"
//                   name="propertyType"
//                   className="form-control"
//                   defaultValue="RESIDNETIAL"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Current Usage</label>
//                 <input
//                   type="text"
//                   name="currentUsage"
//                   className="form-control"
//                   defaultValue="UNDER CONST"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={12}>
//                 <label className="form-label">Address at site</label>
//                 <textarea
//                   name="siteAddress"
//                   className="form-control"
//                   rows="3"
//                   defaultValue="UNDER CONST RESIDENTIAL HOUSE ON PLOT NO. 217, PART OF KH NO. 173/1, 174/1, STUATED AT SHETAL DEEP ORAM PIPALITA GALUU, PH NO. 03, WARD NO 24, MANDDEEP THISIL GOUHARGANI DIST RABEN MP-462046"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={12}>
//                 <label className="form-label">Address as per document</label>
//                 <textarea
//                   name="documentAddress"
//                   className="form-control"
//                   rows="3"
//                   defaultValue="UNDER CONST RESIDENTIAL HOUSE ON PLOT NO. 217, PART OF KH NO. 173/1, 174/1, STUATED AT SHETAL DEEP ORAM PIPALITA GALUU, PH NO. 03, WARD NO 24, MANDDEEP THISIL GOUHARGANI DIST RABEN MP-462046"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={12}>
//                 <label className="form-label">Has the valuation done valuation of this property before this? If yes, when/or whom?</label>
//                 <input
//                   type="text"
//                   name="previousValuation"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <h5 className="mt-4 mb-3">SOURQUISIONS & LOCALITY DETAILS</h5>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Location</label>
//                 <input
//                   type="text"
//                   name="location"
//                   className="form-control"
//                   defaultValue="RESIDENTIAL"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Approved Usage of Property</label>
//                 <input
//                   type="text"
//                   name="approvedUsage"
//                   className="form-control"
//                   defaultValue="RESIDENTIAL"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Class of Locality</label>
//                 <input
//                   type="text"
//                   name="localityClass"
//                   className="form-control"
//                   defaultValue="RESIDENTIAL"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Site is (Dev, Under Dev)</label>
//                 <input
//                   type="text"
//                   name="siteDevelopment"
//                   className="form-control"
//                   defaultValue="DEV"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Proximity to civic amenities/public transport</label>
//                 <select
//                   name="proximityAmenities"
//                   className="form-control"
//                   defaultValue="YES"
//                   onChange={handleChange}
//                 >
//                   <option value="YES">YES</option>
//                   <option value="NO">NO</option>
//                 </select>
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Railway Station</label>
//                 <input
//                   type="text"
//                   name="railwayStationDistance"
//                   className="form-control"
//                   defaultValue="5 KM"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Bus Stop</label>
//                 <input
//                   type="text"
//                   name="busStopDistance"
//                   className="form-control"
//                   defaultValue="2KM"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Close Vicinity/Landmark</label>
//                 <input
//                   type="text"
//                   name="landmark"
//                   className="form-control"
//                   defaultValue="NEAR ORIENTAL PUBLIC SCHOOL"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Distance from City Centre</label>
//                 <input
//                   type="text"
//                   name="cityCentreDistance"
//                   className="form-control"
//                   defaultValue="1 KM"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Condition and width of approach Road</label>
//                 <select
//                   name="approachRoad"
//                   className="form-control"
//                   defaultValue="More than 10 ft"
//                   onChange={handleChange}
//                 >
//                   <option value="More than 10 ft">More than 10 ft</option>
//                   <option value="Less than 10 ft">Less than 10 ft</option>
//                 </select>
//               </Col>
//             </Row>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TechnicalAppraisalReport;
import React, { useState, useEffect } from "react";

const TechnicalAppraisalReport = ({ onDataChange, extractedData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    branchName: "",
    ref: "",
    date: "",
    typeOfCase: "",
    volunteerName: "",
    dateOfVisit: "",
    caseRefNo: "",
    contactPersonName: "",
    contactPersonNumber: "",
    applicantNames: "",
    propertyType: "",
    currentUsage: "",
    siteAddress: "",
    documentAddress: "",
    previousValuation: "",
    location: "",
    approvedUsage: "",
    localityClass: "",
    siteDevelopment: "",
    proximityAmenities: "",
    railwayStationDistance: "",
    busStopDistance: "",
    landmark: "",
    cityCentreDistance: "",
  });

  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const addr = p.address || {};
      const loc = p.location_details || {};
      const bankDet = p.bank_specific_details || {};
      const accom = p.accommodation_details || {};

      setFormData((prev) => ({
        ...prev,
        caseRefNo: bankDet.file_no || bankDet.lan_no || extractedData.caseReferenceNumber || extractedData.registration_number || prev.caseRefNo,
        contactPersonName: p.contact_person || extractedData.contactPersonName || prev.contactPersonName,
        contactPersonNumber: p.contact_number || p["Mobile No."] || extractedData.contactPersonNumber || prev.contactPersonNumber,
        applicantNames: p.applicant_name || p.owner_name || extractedData.applicantNames || prev.applicantNames,
        propertyType: p.property_type || accom.type_of_structure || extractedData.propertyType || prev.propertyType,
        currentUsage: p.property_use || extractedData.currentUsage || prev.currentUsage,
        siteAddress: addr.full_address || extractedData.siteAddress || prev.siteAddress,
        documentAddress: addr.full_address || extractedData.documentAddress || prev.documentAddress,
        location: loc.micro_location || extractedData.location || prev.location,
        localityClass: loc.micro_location || extractedData.localityClass || prev.localityClass,
        siteDevelopment: loc.micro_location || extractedData.siteDevelopment || prev.siteDevelopment,
        railwayStationDistance: loc.distance_railway_station || extractedData.railwayStationDistance || prev.railwayStationDistance,
        busStopDistance: loc.distance_bus_stop || extractedData.busStopDistance || prev.busStopDistance,
        landmark: loc.landmark || extractedData.landmark || prev.landmark,
        cityCentreDistance: loc.distance_city_centre || extractedData.cityCentreDistance || prev.cityCentreDistance,
      }));
    }
  }, [extractedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onDataChange(formData);
    console.log("Technical Arrraisal Data :", formData);
  };

  return (
    <div className="mb-4 border rounded">
      <div
        className="p-4 bg-gray-800 text-white cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="m-0 text-lg font-semibold">
          TECHNICAL APPRAISAL REPORT FOR HOUSE/FLAT/LAND/OFFICE/COMMERCIAL
          PROPERTY
        </h4>
        <button
          type="button"
          className="bg-white text-gray-800 text-sm px-3 py-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 bg-gray-100 rounded-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">Branch Name</label>
              <input
                type="text"
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Ref</label>
              <input
                type="text"
                name="ref"
                value={formData.ref}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">Type of Case</label>
              <input
                type="text"
                name="typeOfCase"
                value={formData.typeOfCase}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Volunteer Name</label>
              <input
                type="text"
                name="volunteerName"
                value={formData.volunteerName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Date of Visit</label>
              <input
                type="date"
                name="dateOfVisit"
                value={formData.dateOfVisit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Case Ref. No.</label>
            <input
              type="text"
              name="caseRefNo"
              value={formData.caseRefNo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <h5 className="text-lg font-semibold mt-6 mb-3">
            Contacted Person for property inspection
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="contactPersonName"
                value={formData.contactPersonName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Contact No.</label>
              <input
                type="text"
                name="contactPersonNumber"
                value={formData.contactPersonNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <h5 className="text-lg font-semibold mt-6 mb-3">BASIC DETAILS</h5>
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Application/s Name/s
            </label>
            <input
              type="text"
              name="applicantNames"
              value={formData.applicantNames}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">Type of property</label>
              <input
                type="text"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Current Usage</label>
              <input
                type="text"
                name="currentUsage"
                value={formData.currentUsage}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Address at site</label>
            <textarea
              name="siteAddress"
              rows="3"
              value={formData.siteAddress}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Address as per document
            </label>
            <textarea
              name="documentAddress"
              rows="3"
              value={formData.documentAddress}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Has the valuation done valuation of this property before this? If
              yes, when/or whom?
            </label>
            <input
              type="text"
              name="previousValuation"
              value={formData.previousValuation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <h5 className="text-lg font-semibold mt-6 mb-3">
            SOURQUISIONS & LOCALITY DETAILS
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Approved Usage of Property
              </label>
              <input
                type="text"
                name="approvedUsage"
                value={formData.approvedUsage}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">
                Class of Locality
              </label>
              <input
                type="text"
                name="localityClass"
                value={formData.localityClass}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Site is (Dev, Under Dev)
              </label>
              <input
                type="text"
                name="siteDevelopment"
                value={formData.siteDevelopment}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">
                Proximity to civic amenities/public transport
              </label>
              <select
                name="proximityAmenities"
                value={formData.proximityAmenities}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Railway Station</label>
              <input
                type="text"
                name="railwayStationDistance"
                value={formData.railwayStationDistance}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium">Bus Stop</label>
              <input
                type="text"
                name="busStopDistance"
                value={formData.busStopDistance}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Close Vicinity/Landmark
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Distance from City Centre
            </label>
            <input
              type="text"
              name="cityCentreDistance"
              value={formData.cityCentreDistance}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Condition and width of approach Road
            </label>
            <select
              name="approachRoad"
              value={formData.approachRoad}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="More than 10 ft">More than 10 ft</option>
              <option value="Less than 10 ft">Less than 10 ft</option>
            </select>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalAppraisalReport;
