import React, { useState } from "react";

const ActualPlanDetails = ({ extractedData, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [floors, setFloors] = useState([
    {
      floor: "FIRST FLOOR",
      bua: 300,
      ratePerUnit: 15000,
      replacementCost: 4500000,
      depreciation: 0,
      lessDepreciation: 4500000,
      netDepreciatedValue: 0,
    },
    // Add more floors as needed
  ]);
  const [formData, setformData] = useState({
    buildingValue: 4500000,
    amenities: 0,
    totalBuildingValue: 4500000,
    totalValueOfProperty: 4500000,
    marketValue: 4050000,
    distressedSaleValue: 3600000,
    govtGuidelineValue: 2536,
    landValue: 3600000,
    totalGovtValue: 880000,
    riskAssessment: "High / Medium / Low",
    remarks: `1. GIVEN XEROX COPY OF SALE DEED IN FAVOUR OF ASH BADAL S/O SHRI KAVINDRA KUMAR BADAL.
2. DURING PROPERTY VISIT MR. ASH BADAL JI WAS MET AT THE PROPERTY.
3. RATE HAS BEEN CONFIRM FROM MARKET ENQUIRY.
4. PROPERTY IS SITUATED AT RESIDENTIAL ZONING.
5. AT SITE PROPERTY IS COMMERCIAL SHOP.
6. PROPERTY IS IDENTIFIED BY FOUR SIDE BOUNDARIES OF GIVEN DEED AND LOCAL ENQUIRY.
7. BUILDING PERMISSION AND MAP IS NOT OBTAIN, ONLY FLOOR PLAN RECEIVE.
8. TSGP LAYOUT PLAN IS NOT OBTAIN.
9. BUILDING PRAKOSHT RECEIVE AS PER PRAKOSHT SHOP NO. 03 AREA IS 472 SQFT, BUT AS PER DEED AND ACTUAL AT SITE BUILT UP AREA IS 300 SQFT, WE HAVE CONSIDER BUILT UP AREA AS PER DEED.
10. UNIT VALUE OF PROPERTY IS CONSIDER IN THIS REPORT.
11. VALUER IS NOT RESPONSIBLE FOR ANY LEGAL DISPUTE.`,
    applicantName: "",
    date: "2023-05-16",
    leadId: "A068301-LAP",
  });

  React.useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const val = p.valuation_details || {};
      const propDet = p.property_details || {};

      setformData((prev) => ({
        ...prev,
        buildingValue: val.building_value || extractedData.buildingValue || prev.buildingValue,
        amenities: propDet.amenities || extractedData.amenities || prev.amenities,
        totalBuildingValue: val.total_building_value || extractedData.totalBuildingValue || prev.totalBuildingValue,
        totalValueOfProperty: val.total_value || val.market_value || extractedData.totalValueOfProperty || prev.totalValueOfProperty,
        marketValue: val.market_value || val.total_value || extractedData.marketValue || prev.marketValue,
        distressedSaleValue: val.distress_value || extractedData.distressedSaleValue || prev.distressedSaleValue,
        govtGuidelineValue: val.guideline_rate || val.govt_rate || extractedData.govtGuidelineValue || prev.govtGuidelineValue,
        landValue: val.land_value || extractedData.landValue || prev.landValue,
        totalGovtValue: val.total_govt_value || extractedData.totalGovtValue || prev.totalGovtValue,
        riskAssessment: p.risk_assessment || extractedData.riskAssessment || prev.riskAssessment,
        remarks: p.remarks || extractedData.remarks || prev.remarks,
        applicantName: p.applicant_name || p.owner_name || extractedData.applicantName || prev.applicantName,
        date: p.date_of_report || p.date_of_inspection || extractedData.date || prev.date,
        leadId: p.case_reference_no || extractedData.leadId || prev.leadId,
      }));
    }
  }, [extractedData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
    // onDataChange(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = () => {
    onNext(formData);
  };

  const addFloor = () => {
    const newFloor = {
      floor: `FLOOR ${floors.length + 1}`,
      bua: 0,
      ratePerUnit: 0,
      replacementCost: 0,
      depreciation: 0,
      lessDepreciation: 0,
      netDepreciatedValue: 0,
    };
    setFloors([...floors, newFloor]);
  };

  return (
    <div className='mb-4'>
      <div
        className='p-3 border rounded cursor-pointer'
        style={{ backgroundColor: "#30384B" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex justify-between items-center text-white'>
          <h4 className='m-0 text-xl font-bold'>ACTUAL PLAN DETAILS</h4>
          <button
            type='button'
            className='px-3 py-1 bg-white text-gray-800 rounded text-sm'
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
        <div className='p-3 border rounded mt-2 bg-gray-50'>
          <form>
            <h5 className='mt-4 mb-3 text-lg font-semibold'>Building Value</h5>
            <div className='flex flex-wrap mb-3 -mx-2'>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1'>Building Value:</label>
                <input
                  type='text'
                  name='buildingValue'
                  className='w-full p-2 border rounded'
                  value={formData.buildingValue}
                  onChange={handleInputChange}
                />
              </div>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1'>Amenities:</label>
                <input
                  type='text'
                  name='amenities'
                  className='w-full p-2 border rounded'
                  value={formData.amenities}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className='flex flex-wrap mb-3 -mx-2'>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1'>Total Building Value:</label>
                <input
                  type='text'
                  name='totalBuildingValue'
                  className='w-full p-2 border rounded'
                  value={formData.totalBuildingValue}
                  onChange={handleInputChange}
                />
              </div>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1'>Total Value of Property:</label>
                <input
                  type='text'
                  name='totalValueOfProperty'
                  className='w-full p-2 border rounded'
                  value={formData.totalValueOfProperty}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <h5 className='mt-4 mb-3 text-lg font-semibold'>
              Market Value of Property as per Actual
            </h5>
            <div className='flex flex-wrap mb-3 -mx-2'>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1'>Realizable Sale Value:</label>
                <input
                  type='text'
                  name='marketValue'
                  className='w-full p-2 border rounded'
                  value={formData.marketValue}
                  onChange={handleInputChange}
                />
              </div>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1'>Distressed Sale Value:</label>
                <input
                  type='text'
                  name='distressedSaleValue'
                  className='w-full p-2 border rounded'
                  value={formData.distressedSaleValue}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <h5 className='mt-4 mb-3 text-lg font-semibold'>
              Govt. Guideline Value
            </h5>
            <div className='flex flex-wrap mb-3 -mx-2'>
              <div className='w-full md:w-1/3 px-2 mb-3'>
                <label className='block mb-1'>Rate Per SqFt:</label>
                <input
                  type='text'
                  name='govtGuidelineValue'
                  className='w-full p-2 border rounded'
                  value={formData.govtGuidelineValue}
                  onChange={handleInputChange}
                />
              </div>
              <div className='w-full md:w-1/3 px-2 mb-3'>
                <label className='block mb-1'>Land Value:</label>
                <input
                  type='text'
                  name='landValue'
                  className='w-full p-2 border rounded'
                  value={formData.landValue}
                  onChange={handleInputChange}
                />
              </div>
              <div className='w-full md:w-1/3 px-2 mb-3'>
                <label className='block mb-1'>Total Govt Value:</label>
                <input
                  type='text'
                  name='totalGovtValue'
                  className='w-full p-2 border rounded'
                  value={formData.totalGovtValue}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <h5 className='mt-4 mb-3 text-lg font-semibold'>
              Floorwise Details
            </h5>
            {floors.map((floor, index) => (
              <div key={index} className='flex flex-wrap mb-3 -mx-2'>
                <div className='w-full md:w-1/6 px-2 mb-3'>
                  <label className='block mb-1'>{floor.floor}:</label>
                </div>
                <div className='w-full md:w-1/6 px-2 mb-3'>
                  <input
                    type='text'
                    name={`floors.${index}.bua`}
                    className='w-full p-2 border rounded'
                    value={floor.bua}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='w-full md:w-1/6 px-2 mb-3'>
                  <input
                    type='text'
                    name={`floors.${index}.ratePerUnit`}
                    className='w-full p-2 border rounded'
                    value={floor.ratePerUnit}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='w-full md:w-1/6 px-2 mb-3'>
                  <input
                    type='text'
                    name={`floors.${index}.replacementCost`}
                    className='w-full p-2 border rounded'
                    value={floor.replacementCost}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='w-full md:w-1/6 px-2 mb-3'>
                  <input
                    type='text'
                    name={`floors.${index}.depreciation`}
                    className='w-full p-2 border rounded'
                    value={floor.depreciation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='w-full md:w-1/6 px-2 mb-3'>
                  <input
                    type='text'
                    name={`floors.${index}.lessDepreciation`}
                    className='w-full p-2 border rounded'
                    value={floor.lessDepreciation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='w-full md:w-1/6 px-2 mb-3'>
                  <input
                    type='text'
                    name={`floors.${index}.netDepreciatedValue`}
                    className='w-full p-2 border rounded'
                    value={floor.netDepreciatedValue}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ))}
            <button
              type='button'
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              onClick={addFloor}
            >
              Add Floor
            </button>

            <h5 className='mt-4 mb-3 text-lg font-semibold'>Risk Assessment</h5>
            <div className='mb-3'>
              <div className='w-full px-2 mb-3'>
                <label className='block mb-1'>
                  Risk regarding seismic zone, cyclone area, flood area, land
                  slide:
                </label>
                <input
                  type='text'
                  name='riskAssessment'
                  className='w-full p-2 border rounded'
                  value={formData.riskAssessment}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <h5 className='mt-4 mb-3 text-lg font-semibold'>Remarks</h5>
            <div className='mb-3'>
              <div className='w-full px-2 mb-3'>
                <textarea
                  name='remarks'
                  className='w-full p-2 border rounded'
                  rows='6'
                  value={formData.remarks}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Additional fields below remarks */}
            <h5 className='mt-4 mb-3 text-lg font-semibold'>
              Additional Information
            </h5>
            <div className='flex flex-wrap mb-3 -mx-2'>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1'>Date:</label>
                <input
                  type='date'
                  name='date'
                  className='w-full p-2 border rounded'
                  defaultValue='2023-05-16'
                  onChange={handleInputChange}
                />
              </div>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1'>Applicant Name:</label>
                <input
                  type='text'
                  name='applicantName'
                  className='w-full p-2 border rounded'
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='mb-3'>
              <div className='w-full px-2 mb-3'>
                <label className='block mb-1'>AB Collection:</label>
                <input
                  type='text'
                  name='abCollection'
                  className='w-full p-2 border rounded'
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='mb-3'>
              <div className='w-full px-2 mb-3'>
                <label className='block mb-1'>Site Images:</label>
                <input
                  type='text'
                  name='siteImages'
                  className='w-full p-2 border rounded'
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='mb-3'>
              <div className='w-full px-2 mb-3'>
                <label className='block mb-1'>Lead Id:</label>
                <input
                  type='text'
                  name='leadId'
                  className='w-full p-2 border rounded'
                  defaultValue='A068301-LAP'
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </form>
        </div>
      )}
      <button
        type='submit'
        className='px-6 py-2 bg-gray-800 text-white font-medium rounded-md'
        onClick={handleSubmit}
      >
        Next
      </button>
    </div>
  );
};

export default ActualPlanDetails;
