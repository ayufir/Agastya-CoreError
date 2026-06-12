// import React, { useState } from 'react';
// import { Row, Col, Table } from 'react-bootstrap';

// const FloorRevenue  = ({ onDataChange }) => {
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
//           <h4 className="m-0">PROPERTY VALUATION DETAILS</h4>
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
//             <h5 className="mb-3">Floor Wise Area (in sq. ft.)</h5>
//             <Row className="mb-3">
//               <Col md={3}>
//                 <label className="form-label">Carpet Area As Measured (sq. ft)</label>
//                 <input
//                   type="text"
//                   name="carpetAreaMeasured"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={3}>
//                 <label className="form-label">Carpet Area As Agreement (sq. ft)</label>
//                 <input
//                   type="text"
//                   name="carpetAreaAgreement"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={3}>
//                 <label className="form-label">Carpet Area As Per App (sq. ft)</label>
//                 <input
//                   type="text"
//                   name="carpetAreaApp"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={3}>
//                 <label className="form-label">Area Considered For Valuation (sq. ft)</label>
//                 <input
//                   type="text"
//                   name="areaForValuation"
//                   className="form-control"
//                   defaultValue="NA"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={4}>
//                 <label className="form-label">Loading</label>
//                 <input
//                   type="text"
//                   name="loading"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Super Area (sq. ft)</label>
//                 <input
//                   type="text"
//                   name="superArea"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Rate (per sq ft)</label>
//                 <input
//                   type="text"
//                   name="ratePerSqft"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Value by Comparison Method (₹)</label>
//                 <input
//                   type="text"
//                   name="comparisonValue"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Current government approved rate as per ready reckoner</label>
//                 <input
//                   type="text"
//                   name="govtApprovedRate"
//                   className="form-control"
//                   defaultValue="₹/-FRS-SQFT"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <h5 className="mt-4 mb-3">VALUATION</h5>
//             <Table bordered className="mb-3">
//               <thead>
//                 <tr>
//                   <th>Description of Constructed Area and Rates</th>
//                   <th>Area (Sq.ft.)</th>
//                   <th>Rate (Sq.ft.)</th>
//                   <th>Amount (in ₹)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td><input type="text" name="description1" className="form-control" defaultValue="Land" onChange={handleChange} /></td>
//                   <td><input type="text" name="area1" className="form-control" defaultValue="480" onChange={handleChange} /></td>
//                   <td><input type="text" name="rate1" className="form-control" defaultValue="900" onChange={handleChange} /></td>
//                   <td><input type="text" name="amount1" className="form-control" defaultValue="432000" onChange={handleChange} /></td>
//                 </tr>
//                 <tr>
//                   <td><input type="text" name="description2" className="form-control" defaultValue="Construction Area / Saleable area/ Super Built up area (P&CPCS16)" onChange={handleChange} /></td>
//                   <td><input type="text" name="area2" className="form-control" defaultValue="338" onChange={handleChange} /></td>
//                   <td><input type="text" name="rate2" className="form-control" defaultValue="1200" onChange={handleChange} /></td>
//                   <td><input type="text" name="amount2" className="form-control" defaultValue="403200" onChange={handleChange} /></td>
//                 </tr>
//               </tbody>
//             </Table>

//             <Row className="mb-3">
//               <Col md={12}>
//                 <label className="form-label">Total Value by Land & Building Method (₹) or comparison method</label>
//                 <input
//                   type="text"
//                   name="totalValue"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <h5 className="mt-4 mb-3">Construction Details</h5>
//             <Row className="mb-3">
//               <Col md={3}>
//                 <label className="form-label">Stage of construction</label>
//                 <input
//                   type="text"
//                   name="constructionStage"
//                   className="form-control"
//                   defaultValue="COMPLETE"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={3}>
//                 <label className="form-label">%</label>
//                 <input
//                   type="text"
//                   name="constructionPercentage"
//                   className="form-control"
//                   defaultValue="30%"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={3}>
//                 <label className="form-label">Status</label>
//                 <input
//                   type="text"
//                   name="constructionStatus"
//                   className="form-control"
//                   defaultValue="RECOMMENDED"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={3}>
//                 <label className="form-label">%</label>
//                 <input
//                   type="text"
//                   name="recommendedPercentage"
//                   className="form-control"
//                   defaultValue="40%"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={12}>
//                 <label className="form-label">Recommended Construction Value</label>
//                 <input
//                   type="text"
//                   name="recommendedConstructionValue"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <h5 className="mt-4 mb-3">Value of Extra Amenities</h5>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <label className="form-label">No of Car Parking</label>
//                 <input
//                   type="text"
//                   name="carParkingCount"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Rate per Parking</label>
//                 <input
//                   type="text"
//                   name="carParkingRate"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Value of Car Parking</label>
//                 <input
//                   type="text"
//                   name="carParkingValue"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={12}>
//                 <label className="form-label">Total Amenities Charges</label>
//                 <input
//                   type="text"
//                   name="totalAmenitiesCharges"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Total Market Value of Property (A+B) (in ₹)</label>
//                 <input
//                   type="text"
//                   name="totalMarketValue"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Forced Sale Value</label>
//                 <input
//                   type="text"
//                   name="forcedSaleValue"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={6}>
//                 <label className="form-label">Re-construction Cost (for Property Insurance)</label>
//                 <input
//                   type="text"
//                   name="reconstructionCost"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//               <Col md={6}>
//                 <label className="form-label">Approx. Rentals in case of 100% complete property</label>
//                 <input
//                   type="text"
//                   name="approxRentals"
//                   className="form-control"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <h5 className="mt-4 mb-3">Details from Online Land Revenue Records</h5>
//             <Row className="mb-3">
//               <Col md={4}>
//                 <label className="form-label">Online Record Found</label>
//                 <select
//                   name="onlineRecordFound"
//                   className="form-control"
//                   onChange={handleChange}
//                 >
//                   <option value="Yes">Yes</option>
//                   <option value="No">No</option>
//                   <option value="Not applicable">Not applicable</option>
//                 </select>
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Nature of Land specified in records</label>
//                 <select
//                   name="landNature"
//                   className="form-control"
//                   onChange={handleChange}
//                 >
//                   <option value="Agriculture">Agriculture</option>
//                   <option value="Non-Agriculture">Non-Agriculture</option>
//                   <option value="Others">Others (please specify)</option>
//                 </select>
//               </Col>
//               <Col md={4}>
//                 <label className="form-label">Ownership Details as per records</label>
//                 <input
//                   type="text"
//                   name="ownershipDetails"
//                   className="form-control"
//                   defaultValue="Name of Owner - MULTIPLE ERASSEA FOUND"
//                   onChange={handleChange}
//                 />
//               </Col>
//             </Row>

//             <Row className="mb-3">
//               <Col md={12}>
//                 <label className="form-label">Property area Details mentioned in records</label>
//                 <input
//                   type="text"
//                   name="propertyAreaDetails"
//                   className="form-control"
//                   defaultValue="NA"
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

// export default FloorRevenue;
import React, { useState } from "react";

const FloorRevenue = ({ onDataChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    carpetAreaMeasured: "",
    carpetAreaAgreement: "",
    carpetAreaApp: "",
    areaForValuation: "",
    loading: "",
    superArea: "",
    ratePerSqft: "",
    comparisonValue: "",
    govtApprovedRate: "",
    description1: "",
    area1: "",
    rate1: "",
    amount1: "",
    description2: "",
    area2: "",
    rate2: "",
    amount2: "",
    totalValue: "",
    constructionStage: "",
    constructionPercentage: "",
    constructionStatus: "",
    recommendedPercentage: "",
    recommendedConstructionValue: "",
    carParkingCount: "",
    carParkingRate: "",
    carParkingValue: "",
    totalAmenitiesCharges: "",
    totalMarketValue: "",
    forcedSaleValue: "",
    reconstructionCost: "",
    approxRentals: "",
    onlineRecordFound: "",
    landNature: "",
    ownershipDetails: " ",
    propertyAreaDetails: "",
  });

  useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const val = p.valuation_details || {};

      setFormData((prev) => ({
        ...prev,
        carpetAreaMeasured: val.carpet_area_measurement || extractedData.carpetAreaMeasured || prev.carpetAreaMeasured,
        carpetAreaAgreement: val.carpet_area_plan || extractedData.carpetAreaAgreement || prev.carpetAreaAgreement,
        carpetAreaApp: val.carpet_area_plan || extractedData.carpetAreaApp || prev.carpetAreaApp,
        superArea: val.super_built_up_area || extractedData.superArea || prev.superArea,
        ratePerSqft: val.construction_rate || val.land_rate || val.plot_area_physical_rate || extractedData.ratePerSqft || prev.ratePerSqft,
        comparisonValue: val.market_rate || extractedData.comparisonValue || prev.comparisonValue,
        govtApprovedRate: val.government_value || extractedData.govtApprovedRate || prev.govtApprovedRate,
        totalValue: val.total_value || extractedData.totalValue || prev.totalValue,
        constructionStage: p.construction_stage || val.construction_status || extractedData.constructionStage || prev.constructionStage,
        constructionPercentage: val.completion_percentage || extractedData.constructionPercentage || prev.constructionPercentage,
        constructionStatus: p.construction_stage || extractedData.constructionStatus || prev.constructionStatus,
        totalMarketValue: val.total_value || extractedData.totalMarketValue || prev.totalMarketValue,
        forcedSaleValue: val.distress_value || extractedData.forcedSaleValue || prev.forcedSaleValue,
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
    <div className="mb-6">
      <div
        className="p-4 border rounded-lg cursor-pointer"
        style={{ backgroundColor: "#30384B" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center text-white">
          <h4 className="m-0 text-xl font-bold">PROPERTY VALUATION DETAILS</h4>
          <button
            type="button"
            className="px-3 py-1 bg-white text-gray-800 rounded text-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border rounded-lg mt-2 bg-gray-50">
          <div>
            <h5 className="mb-3 text-lg font-semibold">
              Floor Wise Area (in sq. ft.)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Carpet Area As Measured (sq. ft)
                </label>
                <input
                  type="text"
                  name="carpetAreaMeasured"
                  className="w-full p-2 border rounded"
                  value={formData.carpetAreaMeasured}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Carpet Area As Agreement (sq. ft)
                </label>
                <input
                  type="text"
                  name="carpetAreaAgreement"
                  className="w-full p-2 border rounded"
                  value={formData.carpetAreaAgreement}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Carpet Area As Per App (sq. ft)
                </label>
                <input
                  type="text"
                  name="carpetAreaApp"
                  className="w-full p-2 border rounded"
                  value={formData.carpetAreaApp}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Area Considered For Valuation (sq. ft)
                </label>
                <input
                  type="text"
                  name="areaForValuation"
                  className="w-full p-2 border rounded"
                  value={formData.areaForValuation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Loading
                </label>
                <input
                  type="text"
                  name="loading"
                  className="w-full p-2 border rounded"
                  value={formData.loading}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Super Area (sq. ft)
                </label>
                <input
                  type="text"
                  name="superArea"
                  className="w-full p-2 border rounded"
                  value={formData.superArea}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Rate (per sq ft)
                </label>
                <input
                  type="text"
                  name="ratePerSqft"
                  className="w-full p-2 border rounded"
                  value={formData.ratePerSqft}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Value by Comparison Method (₹)
                </label>
                <input
                  type="text"
                  name="comparisonValue"
                  className="w-full p-2 border rounded"
                  value={formData.comparisonValue}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Current government approved rate as per ready reckoner
                </label>
                <input
                  type="text"
                  name="govtApprovedRate"
                  className="w-full p-2 border rounded"
                  value={formData.govtApprovedRate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="mt-6 mb-3 text-lg font-semibold">VALUATION</h5>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border text-left">
                      Description of Constructed Area and Rates
                    </th>
                    <th className="p-2 border text-left">Area (Sq.ft.)</th>
                    <th className="p-2 border text-left">Rate (Sq.ft.)</th>
                    <th className="p-2 border text-left">Amount (in ₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border">
                      <input
                        type="text"
                        name="description1"
                        className="w-full p-1 border rounded"
                        value={formData.description1}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        name="area1"
                        className="w-full p-1 border rounded"
                        value={formData.area1}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        name="rate1"
                        className="w-full p-1 border rounded"
                        value={formData.rate1}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        name="amount1"
                        className="w-full p-1 border rounded"
                        value={formData.amount1}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border">
                      <input
                        type="text"
                        name="description2"
                        className="w-full p-1 border rounded"
                        value={formData.description2}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        name="area2"
                        className="w-full p-1 border rounded"
                        value={formData.area2}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        name="rate2"
                        className="w-full p-1 border rounded"
                        value={formData.rate2}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        name="amount2"
                        className="w-full p-1 border rounded"
                        value={formData.amount2}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Total Value by Land & Building Method (₹) or comparison method
              </label>
              <input
                type="text"
                name="totalValue"
                className="w-full p-2 border rounded"
                value={formData.totalValue}
                onChange={handleChange}
              />
            </div>

            <h5 className="mt-6 mb-3 text-lg font-semibold">
              Construction Details
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Stage of construction
                </label>
                <input
                  type="text"
                  name="constructionStage"
                  className="w-full p-2 border rounded"
                  value={formData.constructionStage}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">%</label>
                <input
                  type="text"
                  name="constructionPercentage"
                  className="w-full p-2 border rounded"
                  value={formData.constructionPercentage}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <input
                  type="text"
                  name="constructionStatus"
                  className="w-full p-2 border rounded"
                  value={formData.constructionStatus}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">%</label>
                <input
                  type="text"
                  name="recommendedPercentage"
                  className="w-full p-2 border rounded"
                  value={formData.recommendedPercentage}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Recommended Construction Value
              </label>
              <input
                type="text"
                name="recommendedConstructionValue"
                className="w-full p-2 border rounded"
                value={formData.recommendedConstructionValue}
                onChange={handleChange}
              />
            </div>

            <h5 className="mt-6 mb-3 text-lg font-semibold">
              Value of Extra Amenities
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  No of Car Parking
                </label>
                <input
                  type="text"
                  name="carParkingCount"
                  className="w-full p-2 border rounded"
                  value={formData.carParkingCount}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Rate per Parking
                </label>
                <input
                  type="text"
                  name="carParkingRate"
                  className="w-full p-2 border rounded"
                  value={formData.carParkingRate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Value of Car Parking
                </label>
                <input
                  type="text"
                  name="carParkingValue"
                  className="w-full p-2 border rounded"
                  value={formData.carParkingValue}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Total Amenities Charges
              </label>
              <input
                type="text"
                name="totalAmenitiesCharges"
                className="w-full p-2 border rounded"
                value={formData.totalAmenitiesCharges}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Market Value of Property (A+B) (in ₹)
                </label>
                <input
                  type="text"
                  name="totalMarketValue"
                  className="w-full p-2 border rounded"
                  value={formData.totalMarketValue}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Forced Sale Value
                </label>
                <input
                  type="text"
                  name="forcedSaleValue"
                  className="w-full p-2 border rounded"
                  value={formData.forcedSaleValue}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Re-construction Cost (for Property Insurance)
                </label>
                <input
                  type="text"
                  name="reconstructionCost"
                  className="w-full p-2 border rounded"
                  value={formData.reconstructionCost}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Approx. Rentals in case of 100% complete property
                </label>
                <input
                  type="text"
                  name="approxRentals"
                  className="w-full p-2 border rounded"
                  value={formData.approxRentals}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="mt-6 mb-3 text-lg font-semibold">
              Details from Online Land Revenue Records
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Online Record Found
                </label>
                <select
                  name="onlineRecordFound"
                  className="w-full p-2 border rounded"
                  value={formData.onlineRecordFound}
                  onChange={handleChange}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Not applicable">Not applicable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nature of Land specified in records
                </label>
                <select
                  name="landNature"
                  className="w-full p-2 border rounded"
                  value={formData.landNature}
                  onChange={handleChange}
                >
                  <option value="Agriculture">Agriculture</option>
                  <option value="Non-Agriculture">Non-Agriculture</option>
                  <option value="Others">Others (please specify)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ownership Details as per records
                </label>
                <input
                  type="text"
                  name="ownershipDetails"
                  className="w-full p-2 border rounded"
                  value={formData.ownershipDetails}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Property area Details mentioned in records
              </label>
              <input
                type="text"
                name="propertyAreaDetails"
                className="w-full p-2 border rounded"
                value={formData.propertyAreaDetails}
                onChange={handleChange}
              />
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
        </div>
      )}
    </div>
  );
};

export default FloorRevenue;
