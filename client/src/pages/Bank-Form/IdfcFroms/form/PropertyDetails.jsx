// import React, { useState } from 'react';
// import { Row, Col } from 'react-bootstrap';

// const PropertyDetails = ({ onDataChange }) => {
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
//           <h4 className="m-0">PROPERTY DETAILS</h4>
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
//             <h5 className="mb-3">Occupant Details</h5>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <label className="form-label">Occupant Status</label>
//                 <select
//                   name="occupantStatus"
//                   className="form-control"
//                   defaultValue="VACANT"
//                   onChange={handleChange}
//                 >
//                   <option value="VACANT">VACANT</option>
//                   <option value="OCCUPIED">OCCUPIED</option>
//                 </select>
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Name of Occupant</label>
//                 <input
//                   type="text"
//                   name="occupantName"
//                   className="form-control"
//                   defaultValue="CPER FLOT"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Relation with applicant</label>
//                 <input
//                   type="text"
//                   name="occupantRelation"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <h5 className="mt-4 mb-3">Building Details</h5>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Property Demarcation</label>
//                 <input
//                   type="text"
//                   name="propertyDemarcation"
//                   className="form-control"
//                   defaultValue="MR. SUNL KUMAR, CONT NO – 7897499327"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Property Identified through</label>
//                 <input
//                   type="text"
//                   name="propertyIdentifiedThrough"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Type of structure</label>
//                 <input
//                   type="text"
//                   name="structureType"
//                   className="form-control"
//                   defaultValue="RCC (PROPOSED)"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Long/First Area</label>
//                 <input
//                   type="text"
//                   name="longFirstArea"
//                   className="form-control"
//                   defaultValue="480"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={4}>
//                 <label className="form-label">No of Block/Hiring</label>
//                 <input
//                   type="text"
//                   name="blockHiringCount"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">No of Units per floor</label>
//                 <input
//                   type="text"
//                   name="unitsPerFloor"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">No. of Floors</label>
//                 <input
//                   type="text"
//                   name="floorsCount"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">No. of Units in each wing</label>
//                 <input
//                   type="text"
//                   name="unitsPerWing"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <h5 className="mt-4 mb-3">Unit Details</h5>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <label className="form-label">Located on Floor No.</label>
//                 <input
//                   type="text"
//                   name="floorNumber"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">No. of rooms</label>
//                 <input
//                   type="text"
//                   name="roomsCount"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Carpet Area</label>
//                 <input
//                   type="text"
//                   name="carpetArea"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Super Built-up</label>
//                 <input
//                   type="text"
//                   name="superBuiltUp"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <h5 className="mt-4 mb-3">Construction Details</h5>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Quality of Construction: Exteriors</label>
//                 <input
//                   type="text"
//                   name="constructionQuality"
//                   className="form-control"
//                   defaultValue="AVERAGE"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Age of the property</label>
//                 <input
//                   type="text"
//                   name="propertyAge"
//                   className="form-control"
//                   defaultValue="0"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Residual life</label>
//                 <input
//                   type="text"
//                   name="residualLife"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <h5 className="mt-4 mb-3">SANCTION PLAN APPROVAL & OTHER DOCUMENTS DETAILS</h5>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Constructed plans verified with approval no</label>
//                 <input
//                   type="text"
//                   name="planApprovalNo"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Construction as per approved plan</label>
//                 <input
//                   type="text"
//                   name="constructionAsPerPlan"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Construction permission</label>
//                 <input
//                   type="text"
//                   name="constructionPermission"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Number and Date</label>
//                 <input
//                   type="text"
//                   name="permissionNumberDate"
//                   className="form-control"
//                   defaultValue="LA"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Ownership type</label>
//                 <input
//                   type="text"
//                   name="ownershipType"
//                   className="form-control"
//                   defaultValue="Localized Of Freehold"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Property documents verified</label>
//                 <input
//                   type="text"
//                   name="documentsVerified"
//                   className="form-control"
//                   defaultValue="SAE DIED"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Is the property within Municipal Limits</label>
//                 <select
//                   name="withinMunicipalLimits"
//                   className="form-control"
//                   onChange={handleChange}
//                 >
//                   <option value="YES">YES</option>
//                   <option value="NO">NO</option>
//                 </select>
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Permissible usage as per master plan</label>
//                 <input
//                   type="text"
//                   name="permissibleUsage"
//                   className="form-control"
//                   defaultValue="RESIDENTIAL"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <h5 className="mt-4 mb-3">Plan/Bye Laws Compliance</h5>
//             <table className="table table-bordered mb-3">
//               <thead>
//                 <tr>
//                   <th>As per plan/ Bye laws</th>
//                   <th>Attend at site</th>
//                   <th>Floor No</th>
//                   <th>As per plan/ bye laws</th>
//                   <th>Attend at site</th>
//                   <th>Deviation / Violations</th>
//                   <th>Remarks, if any</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td><input type="text" name="planByeLaws1" className="form-control" defaultValue="MA" onChange={handleChange} /></td>
//                   <td><input type="text" name="attendSite1" className="form-control" defaultValue="NA" onChange={handleChange} /></td>
//                   <td><input type="text" name="floorNo1" className="form-control" defaultValue="0" onChange={handleChange} /></td>
//                   <td><input type="text" name="planByeLaws2" className="form-control" onChange={handleChange} /></td>
//                   <td><input type="text" name="attendSite2" className="form-control" onChange={handleChange} /></td>
//                   <td><input type="text" name="deviation1" className="form-control" onChange={handleChange} /></td>
//                   <td><input type="text" name="remarks1" className="form-control" onChange={handleChange} /></td>
//                 </tr>
//                 <tr>
//                   <td><input type="text" name="planByeLaws3" className="form-control" defaultValue="NO" onChange={handleChange} /></td>
//                   <td><input type="text" name="attendSite3" className="form-control" onChange={handleChange} /></td>
//                   <td><input type="text" name="floorNo2" className="form-control" onChange={handleChange} /></td>
//                   <td><input type="text" name="planByeLaws4" className="form-control" onChange={handleChange} /></td>
//                   <td><input type="text" name="attendSite4" className="form-control" onChange={handleChange} /></td>
//                   <td><input type="text" name="deviation2" className="form-control" onChange={handleChange} /></td>
//                   <td><input type="text" name="remarks2" className="form-control" onChange={handleChange} /></td>
//                 </tr>
//               </tbody>
//             </table>

//             <h5 className="mt-4 mb-3">Description risk (if any to be highlighted)</h5>
//             <Row className="mb-3">
//               <Col md={12}>
//                 <textarea
//                   name="riskDescription"
//                   className="form-control"
//                   rows="3"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Floor Wise Area (in sq. fts.)</label>
//                 <input
//                   type="text"
//                   name="floorWiseArea"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PropertyDetails;
import React, { useState } from "react";

const PropertyDetails = ({ onDataChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    occupantStatus: "",
    occupantName: " ",
    occupantRelation: "",
    propertyDemarcation: "",
    propertyIdentifiedThrough: "",
    structureType: "",
    longFirstArea: "",
    blockHiringCount: "",
    unitsPerFloor: "",
    floorsCount: "",
    unitsPerWing: "",
    floorNumber: "",
    roomsCount: "",
    carpetArea: "",
    superBuiltUp: "",
    constructionQuality: "",
    propertyAge: "",
    residualLife: "",
    planApprovalNo: "",
    constructionAsPerPlan: "",
    constructionPermission: "",
    permissionNumberDate: "",
    ownershipType: "",
    documentsVerified: "",
    withinMunicipalLimits: "",
    permissibleUsage: "",
  });

  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const propDet = p.property_details || {};
      const accom = p.accommodation_details || {};
      const val = p.valuation_details || {};
      const muni = p.municipal_details || {};

      setFormData((prev) => ({
        ...prev,
        occupantStatus: propDet.occupancy || extractedData.occupantStatus || prev.occupantStatus,
        occupantName: propDet.occupied_by || extractedData.occupantName || prev.occupantName,
        propertyDemarcation: propDet.property_demarcated || propDet.property_identification || extractedData.propertyDemarcation || prev.propertyDemarcation,
        structureType: accom.type_of_structure || p.property_sub_type || extractedData.structureType || prev.structureType,
        floorNumber: accom.flat_configuration || accom.flat_type || extractedData.floorNumber || prev.floorNumber,
        carpetArea: val.carpet_area_measurement || val.carpet_area_plan || extractedData.carpetArea || prev.carpetArea,
        superBuiltUp: val.super_built_up_area || extractedData.superBuiltUp || prev.superBuiltUp,
        constructionQuality: accom.quality_of_construction || extractedData.constructionQuality || prev.constructionQuality,
        propertyAge: accom.age_of_property || extractedData.propertyAge || prev.propertyAge,
        residualLife: accom.residual_age || extractedData.residualLife || prev.residualLife,
        planApprovalNo: muni.sanction_plan_provided || extractedData.planApprovalNo || prev.planApprovalNo,
        ownershipType: accom.property_holding || extractedData.ownershipType || prev.ownershipType,
        permissibleUsage: muni.municipal_usage || extractedData.permissibleUsage || prev.permissibleUsage,
      }));
    }
  }, [extractedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onDataChange(formData);
  };

  return (
    <div className="mb-4 border rounded">
      <div
        className="p-3 bg-gray-800 text-white cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="m-0 text-lg font-semibold">PROPERTY DETAILS</h4>
        <button
          type="button"
          className="bg-white text-black text-sm px-3 py-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 bg-gray-100">
          <h5 className="mb-3 font-semibold text-base">Occupant Details</h5>
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="w-full md:w-1/3">
              <label className="block mb-1">Occupant Status</label>
              <select
                name="occupantStatus"
                className="w-full border p-2 rounded"
                value={formData.occupantStatus}
                onChange={handleChange}
              >
                <option value="VACANT">VACANT</option>
                <option value="OCCUPIED">OCCUPIED</option>
              </select>
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1">Name of Occupant</label>
              <input
                type="text"
                name="occupantName"
                className="w-full border p-2 rounded"
                value={formData.occupantName}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1">Relation with applicant</label>
              <input
                type="text"
                name="occupantRelation"
                className="w-full border p-2 rounded"
                value={formData.occupantRelation}
                onChange={handleChange}
              />
            </div>
          </div>

          <h5 className="mt-4 mb-3 font-semibold text-base">
            Building Details
          </h5>
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block mb-1">Property Demarcation</label>
              <input
                type="text"
                name="propertyDemarcation"
                className="w-full border p-2 rounded"
                value={formData.propertyDemarcation}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block mb-1">Property Identified through</label>
              <input
                type="text"
                name="propertyIdentifiedThrough"
                className="w-full border p-2 rounded"
                value={formData.propertyIdentifiedThrough}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block mb-1">Type of structure</label>
              <input
                type="text"
                name="structureType"
                className="w-full border p-2 rounded"
                value={formData.structureType}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block mb-1">Long/First Area</label>
              <input
                type="text"
                name="longFirstArea"
                className="w-full border p-2 rounded"
                value={formData.longFirstArea}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-3">
            <div className="w-full md:w-1/3">
              <label className="block mb-1">No of Block/Hiring</label>
              <input
                type="text"
                name="blockHiringCount"
                className="w-full border p-2 rounded"
                value={formData.blockHiringCount}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1">No of Units per floor</label>
              <input
                type="text"
                name="unitsPerFloor"
                className="w-full border p-2 rounded"
                value={formData.unitsPerFloor}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1">No. of Floors</label>
              <input
                type="text"
                name="floorsCount"
                className="w-full border p-2 rounded"
                value={formData.floorsCount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3 md:w-1/2">
            <label className="block mb-1">No. of Units in each wing</label>
            <input
              type="text"
              name="unitsPerWing"
              className="w-full border p-2 rounded"
              value={formData.unitsPerWing}
              onChange={handleChange}
            />
          </div>

          <h5 className="mt-4 mb-3 font-semibold text-base">Unit Details</h5>
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="w-full md:w-1/3">
              <label className="block mb-1">Located on Floor No.</label>
              <input
                type="text"
                name="floorNumber"
                className="w-full border p-2 rounded"
                value={formData.floorNumber}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1">No. of rooms</label>
              <input
                type="text"
                name="roomsCount"
                className="w-full border p-2 rounded"
                value={formData.roomsCount}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-1">Carpet Area</label>
              <input
                type="text"
                name="carpetArea"
                className="w-full border p-2 rounded"
                value={formData.carpetArea}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3 md:w-1/2">
            <label className="block mb-1">Super Built-up</label>
            <input
              type="text"
              name="superBuiltUp"
              className="w-full border p-2 rounded"
              value={formData.superBuiltUp}
              onChange={handleChange}
            />
          </div>

          <h5 className="mt-4 mb-3 font-semibold text-base">
            Construction Details
          </h5>
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block mb-1">
                Quality of Construction: Exteriors
              </label>
              <input
                type="text"
                name="constructionQuality"
                className="w-full border p-2 rounded"
                value={formData.constructionQuality}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block mb-1">Age of the property</label>
              <input
                type="text"
                name="propertyAge"
                className="w-full border p-2 rounded"
                value={formData.propertyAge}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3 md:w-1/2">
            <label className="block mb-1">Residual life</label>
            <input
              type="text"
              name="residualLife"
              className="w-full border p-2 rounded"
              value={formData.residualLife}
              onChange={handleChange}
            />
          </div>

          <h5 className="mt-4 mb-3 font-semibold text-base">
            SANCTION PLAN APPROVAL & OTHER DOCUMENTS DETAILS
          </h5>
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block mb-1">
                Constructed plans verified with approval no
              </label>
              <input
                type="text"
                name="planApprovalNo"
                className="w-full border p-2 rounded"
                value={formData.planApprovalNo}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block mb-1">
                Construction as per approved plan
              </label>
              <input
                type="text"
                name="constructionAsPerPlan"
                className="w-full border p-2 rounded"
                value={formData.constructionAsPerPlan}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block mb-1">Construction permission</label>
              <input
                type="text"
                name="constructionPermission"
                className="w-full border p-2 rounded"
                value={formData.constructionPermission}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block mb-1">Number and Date</label>
              <input
                type="text"
                name="permissionNumberDate"
                className="w-full border p-2 rounded"
                value={formData.permissionNumberDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block mb-1">Ownership type</label>
              <input
                type="text"
                name="ownershipType"
                className="w-full border p-2 rounded"
                value={formData.ownershipType}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block mb-1">Property documents verified</label>
              <input
                type="text"
                name="documentsVerified"
                className="w-full border p-2 rounded"
                value={formData.documentsVerified}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-3">
            <div className="w-full md:w-1/2">
              <label className="block mb-1">
                Is the property within Municipal Limits
              </label>
              <select
                name="withinMunicipalLimits"
                className="w-full border p-2 rounded"
                value={formData.withinMunicipalLimits}
                onChange={handleChange}
              >
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div className="w-full md:w-1/2">
              <label className="block mb-1">
                Permissible usage as per master plan
              </label>
              <input
                type="text"
                name="permissibleUsage"
                className="w-full border p-2 rounded"
                value={formData.permissibleUsage}
                onChange={handleChange}
              />
            </div>
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

          <h5 className="text-lg font-semibold mt-4 mb-3">
            Plan/Bye Laws Compliance
          </h5>
          <div className="overflow-auto">
            <table className="w-full border border-gray-300 mb-4 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">As per plan/ Bye laws</th>
                  <th className="border px-2 py-1">Attend at site</th>
                  <th className="border px-2 py-1">Floor No</th>
                  <th className="border px-2 py-1">As per plan/ Bye laws</th>
                  <th className="border px-2 py-1">Attend at site</th>
                  <th className="border px-2 py-1">Deviation / Violations</th>
                  <th className="border px-2 py-1">Remarks, if any</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="planByeLaws1"
                      defaultValue="MA"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="attendSite1"
                      defaultValue="NA"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="floorNo1"
                      defaultValue="0"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="planByeLaws2"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="attendSite2"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="deviation1"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="remarks1"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="planByeLaws3"
                      defaultValue="NO"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="attendSite3"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="floorNo2"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="planByeLaws4"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="attendSite4"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="deviation2"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      name="remarks2"
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h5 className="text-lg font-semibold mt-4 mb-2">
            Description of Risk (if any)
          </h5>
          <textarea
            name="riskDescription"
            rows="3"
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
          />

          <div className="w-full md:w-1/2 mb-3">
            <label className="block mb-1">Floor Wise Area (in sq. ft.)</label>
            <input
              type="text"
              name="floorWiseArea"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />
          </div>

          <h5 className="mt-4 mb-3 text-lg font-semibold">Unit Details</h5>
          <div className="mb-3 flex flex-wrap -mx-2">
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label className="block mb-1 font-medium">
                Located on Floor No.
              </label>
              <input
                type="text"
                name="floorNumber"
                defaultValue="NA"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label className="block mb-1 font-medium">No. of rooms</label>
              <input
                type="text"
                name="roomsCount"
                defaultValue="NA"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label className="block mb-1 font-medium">Carpet Area</label>
              <input
                type="text"
                name="carpetArea"
                defaultValue="NA"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="mb-3 flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1 font-medium">Super Built-up</label>
              <input
                type="text"
                name="superBuiltUp"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <h5 className="mt-4 mb-3 text-lg font-semibold">
            Construction Details
          </h5>
          <div className="mb-3 flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1 font-medium">
                Quality of Construction: Exteriors
              </label>
              <input
                type="text"
                name="constructionQuality"
                defaultValue="AVERAGE"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1 font-medium">
                Age of the property
              </label>
              <input
                type="text"
                name="propertyAge"
                defaultValue="0"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="mb-3 flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1 font-medium">Residual life</label>
              <input
                type="text"
                name="residualLife"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <h5 className="mt-4 mb-3 text-lg font-semibold">
            SANCTION PLAN APPROVAL & OTHER DOCUMENTS DETAILS
          </h5>
          <div className="mb-3 flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1 font-medium">
                Constructed plans verified with approval no
              </label>
              <input
                type="text"
                name="planApprovalNo"
                defaultValue="NA"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1 font-medium">
                Construction as per approved plan
              </label>
              <input
                type="text"
                name="constructionAsPerPlan"
                defaultValue="NA"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="mb-3 flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1 font-medium">
                Construction permission
              </label>
              <input
                type="text"
                name="constructionPermission"
                defaultValue="NA"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="w-fulOccupant Detailsl md:w-1/2 px-2 mb-4">
              <label className="block mb-1 font-medium">Number and Date</label>
              <input
                type="text"
                name="permissionNumberDate"
                defaultValue="LA"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="mb-3 flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1 font-medium">Ownership type</label>
              <input
                type="text"
                name="ownershipType"
                defaultValue="Localized Of Freehold"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1 font-medium">
                Property documents verified
              </label>
              <input
                type="text"
                name="documentsVerified"
                defaultValue="SAE DIED"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="mb-3 flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1 font-medium">
                Is the property within Municipal Limits
              </label>
              <select
                name="withinMunicipalLimits"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1 font-medium">
                Permissible usage as per master plan
              </label>
              <input
                type="text"
                name="permissibleUsage"
                defaultValue="RESIDENTIAL"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <h5 className="mt-4 mb-3 text-lg font-semibold">
            Plan/Bye Laws Compliance
          </h5>
          <div className="overflow-auto mb-3">
            <table className="table-auto w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">As per plan/ Bye laws</th>
                  <th className="border p-2">Attend at site</th>
                  <th className="border p-2">Floor No</th>
                  <th className="border p-2">As per plan/ bye laws</th>
                  <th className="border p-2">Attend at site</th>
                  <th className="border p-2">Deviation / Violations</th>
                  <th className="border p-2">Remarks, if any</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="planByeLaws1"
                      defaultValue="MA"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="attendSite1"
                      defaultValue="NA"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="floorNo1"
                      defaultValue="0"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="planByeLaws2"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="attendSite2"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="deviation1"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="remarks1"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="planByeLaws3"
                      defaultValue="NO"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="attendSite3"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="floorNo2"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="planByeLaws4"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="attendSite4"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="deviation2"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="remarks2"
                      onChange={handleChange}
                      className="w-full border rounded px-2"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h5 className="mt-4 mb-3 text-lg font-semibold">
            Description risk (if any to be highlighted)
          </h5>
          <div className="mb-3">
            <textarea
              name="riskDescription"
              rows="3"
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
