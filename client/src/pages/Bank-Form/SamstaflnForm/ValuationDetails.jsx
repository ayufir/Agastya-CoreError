import React, { useState } from 'react';

const ValuationDetails = ({ extractedData, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: 'Bungalow',
    landArea: '900',
    rate: '250',
    amount: '225000',
    constructionRate: '846',
    applicableArea: '846',
    stageOfConstruction: '100%',
    stageOfRecommendation: '100%',
    carParking: 'PLC',
    powerBackup: 'EDC',
    other: 'Other',
    landPlotArea: '900',
    totalAmenitiesCharges: '0',
    totalMarketValue: '901800',
    guidelineValue: '0',
    forcedSaleValue: '721440',
    boundariesAsPerDeed: 'HOUSE OF RAMESH JI',
    boundariesAtSite: 'HOUSE OF RAMESH JI',
    boundariesMatching: 'YES',
    eastBoundary: 'HOUSE OF RAMESH JI',
    westBoundary: 'HOUSE OF DILP JI',
    northBoundary: 'HOUSE OF GOKUL JI',
    southBoundary: 'ROAD',
    remarks: `1. GIVEN XEROX COPY OF PATTA IS IN FAVOUR OF MR. BHAVARLAL S/O DEVILAL JI MEHRA.
2. DURING PROPERTY VISIT MR. DILIP MEHRA JI WAS MET AT THE PROPERTY, WHO IS CUSTOMER BROTHER CONTACT NO. 6266737358. IT WAS CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.
3. RATE HAS BEEN CONFIRM FROM MARKET ENQUIRY.
4. AT SITE PROPERTY IS RESIDENTIAL HOUSE WHICH IS OCCUPIED BY CUSTOMER.
5. BUILT UP AREA IS TAKEN ONLY G.F FROM ACTUAL AT SITE.
6. APPROVED MAP IS NOT PROVIDED.
7. PROPERTY IS IDENTIFIED BY FOUR SIDE BOUNDARY OF GIVEN PATTA.
8. SUGGESTED TO CREDIT TEAM PLEASE CHECK THE PROPER LEGAL OWNERSHIP DOCUMENTS OF THE PROPERTY.
9. AT SITE G.F COMPLETED AND F.F IS UNDER CONSTRUCTION COMPLETE UPTO SLAB WORK ALSO ACCESS FOR F.F FROM MORTGAGING AREA.
10. ACCESS OF THE HOUSE ROAD WIDTH APPROX 7 FT ONLY. ALSO REAR SIDE OTHER HOUSES ACCESS IS FROM CUSTOMER PROPERTY AND OTHER ACCESS OF REAR SIDE HOUSES IS ONLY 3 FT GAI.`,
    declaration: `We hereby declare that we have no direct or indirect interest in the valued and the information furnished in the report is true and correct to the best of my knowledge of belief.`,
    engineerName: '',
    authorizedSignatory: ''
  });

  React.useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const bounds = p.boundaries || {};
      const val = p.valuation_details || {};
      const accom = p.accommodation_details || {};

      setFormData((prev) => ({
        ...prev,
        description: accom.type_of_structure || p.property_type || extractedData.description || prev.description,
        landArea: val.plot_area_physical || extractedData.landArea || prev.landArea,
        rate: val.land_rate || val.guideline_rate || extractedData.rate || prev.rate,
        amount: val.land_value || extractedData.amount || prev.amount,
        constructionRate: val.construction_rate || extractedData.constructionRate || prev.constructionRate,
        applicableArea: val.carpet_area_measurement || val.total_built_up_area || extractedData.applicableArea || prev.applicableArea,
        stageOfConstruction: p.construction_stage || extractedData.stageOfConstruction || prev.stageOfConstruction,
        landPlotArea: val.plot_area_physical || extractedData.landPlotArea || prev.landPlotArea,
        totalMarketValue: val.total_value || val.market_value || extractedData.totalMarketValue || prev.totalMarketValue,
        guidelineValue: val.govt_rate || extractedData.guidelineValue || prev.guidelineValue,
        forcedSaleValue: val.distress_value || extractedData.forcedSaleValue || prev.forcedSaleValue,
        eastBoundary: bounds.east_actual || bounds.east_as_per_deed || extractedData.eastBoundary || prev.eastBoundary,
        westBoundary: bounds.west_actual || bounds.west_as_per_deed || extractedData.westBoundary || prev.westBoundary,
        northBoundary: bounds.north_actual || bounds.north_as_per_deed || extractedData.northBoundary || prev.northBoundary,
        southBoundary: bounds.south_actual || bounds.south_as_per_deed || extractedData.southBoundary || prev.southBoundary,
        remarks: p.remarks || extractedData.remarks || prev.remarks,
        engineerName: p.valuer_name || extractedData.engineerName || prev.engineerName,
      }));
    }
  }, [extractedData]);

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
}
    const handleSubmit = () => {
    onNext(formData);
  };

  const renderInput = (label, name, type = "text") => (
    <div className="w-full md:w-1/3 px-2 mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
  );

  return (
    <div className="mb-6 border rounded">
      <div
        className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-semibold">PROPERTY VALUATION DETAILS</h4>
        <button
          className="bg-white text-black text-sm px-3 py-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? 'Close' : 'Edit'}
        </button>
      </div>

      {isOpen && (
        <div className="bg-gray-100 p-4">
          <h5 className="text-md font-semibold mt-2 mb-4">(A) Description of Constructed Area and Rates</h5>
          <div className="flex flex-wrap -mx-2">
            {renderInput("Description:", "description")}
            {renderInput("Land Area (sqft):", "landArea")}
            {renderInput("Rate (sqft):", "rate")}
            {renderInput("Amount:", "amount")}
            {renderInput("Construction rate (as on date):", "constructionRate")}
            {renderInput("Applicable Area:", "applicableArea")}
            {renderInput("Stage of construction in %:", "stageOfConstruction")}
            {renderInput("Stage of Recommendation in %:", "stageOfRecommendation")}
          </div>

          <h5 className="text-md font-semibold mt-6 mb-4">(B) Value of Extra Amenities if applicable</h5>
          <div className="flex flex-wrap -mx-2">
            {renderInput("Car Parking:", "carParking")}
            {renderInput("Power Backup:", "powerBackup")}
            {renderInput("Other:", "other")}
            {renderInput("Land/Plot Area:", "landPlotArea")}
            {renderInput("Total Amenities charges:", "totalAmenitiesCharges")}
            {renderInput("Total Market Value of Property as on Date (A+B):", "totalMarketValue")}
            {renderInput("Guideline Value of the Property:", "guidelineValue")}
            {renderInput("Forced Sale Value:", "forcedSaleValue")}
          </div>

          <h5 className="text-md font-semibold mt-6 mb-4">Boundaries</h5>
          <div className="flex flex-wrap -mx-2">
            {renderInput("As per deed:", "boundariesAsPerDeed")}
            {renderInput("At site:", "boundariesAtSite")}
            {renderInput("Boundaries Matching:", "boundariesMatching")}
            {renderInput("East:", "eastBoundary")}
            {renderInput("West:", "westBoundary")}
            {renderInput("North:", "northBoundary")}
            <div className="w-full px-2 mb-4">
              {renderInput("South:", "southBoundary")}
            </div>
          </div>

          <h5 className="text-md font-semibold mt-6 mb-4">Remarks</h5>
          <textarea
            name="remarks"
            rows="6"
            value={formData.remarks}
            onChange={handleChange}
            className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
          />

          <h5 className="text-md font-semibold mb-4">Declaration</h5>
          <textarea
            name="declaration"
            rows="3"
            value={formData.declaration}
            onChange={handleChange}
            className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
          />

          <div className="flex flex-wrap -mx-2">
            {renderInput("Name of Engineer who visited the property:", "engineerName")}
            {renderInput("(Authorized Signatory):", "authorizedSignatory")}
          </div>
        </div>
      )}
         <div>
         <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md"
         onClick={handleSubmit} >
            Next
          </button>
      </div>
    </div>
  );
};

export default ValuationDetails;
