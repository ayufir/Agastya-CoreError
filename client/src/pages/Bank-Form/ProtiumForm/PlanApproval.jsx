import React, { useState } from 'react';

const PlanApproval = ({ extractedData, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    constructionAsPerApproved: "Yes",
    approvedPlanDetails: "NOT OBTAIN",
    constructionPermission: "NOT OBTAIN",
    violationsObserved: "LOW/MEDIUM/HIGH",
    structureConfirmingLocal: "Yes",
    floor: "G+3",
    asPerApprovalPlan: "NA",
    deviationSqft: "NA",
    deviationAtSite: "NA",
    deviationPercentage: "NA",
    architectCertifiedEstimate: "NOT OBTAIN",
    constructionAmountCertified: "NOT OBTAIN",
    fairMarketValueFloor: "",
    fairMarketValueActual: "300",
    fairMarketValuePlan: "0",
    finalAreaForValuation: "0",
    landArea: "0",
    rate: "300",
    landValue: "0"
  });

  React.useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const propDet = p.property_details || {};
      const val = p.valuation_details || {};

      setFormData((prev) => ({
        ...prev,
        constructionAsPerApproved: propDet.construction_as_per_plan || extractedData.constructionAsPerApproved || prev.constructionAsPerApproved,
        approvedPlanDetails: p.approved_plan_details || extractedData.approvedPlanDetails || prev.approvedPlanDetails,
        constructionPermission: p.construction_permission || extractedData.constructionPermission || prev.constructionPermission,
        violationsObserved: p.violations_observed || extractedData.violationsObserved || prev.violationsObserved,
        structureConfirmingLocal: p.structure_confirming_local || extractedData.structureConfirmingLocal || prev.structureConfirmingLocal,
        floor: propDet.no_of_floors_actual || extractedData.floor || prev.floor,
        asPerApprovalPlan: propDet.no_of_floors_permissible || extractedData.asPerApprovalPlan || prev.asPerApprovalPlan,
        fairMarketValueFloor: val.building_value || extractedData.fairMarketValueFloor || prev.fairMarketValueFloor,
        fairMarketValueActual: val.market_value || extractedData.fairMarketValueActual || prev.fairMarketValueActual,
        finalAreaForValuation: val.plot_area_physical || extractedData.finalAreaForValuation || prev.finalAreaForValuation,
        landArea: val.plot_area_physical || extractedData.landArea || prev.landArea,
        rate: val.land_rate || val.guideline_rate || extractedData.rate || prev.rate,
        landValue: val.land_value || extractedData.landValue || prev.landValue,
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
 

  return (
    <div className="mb-4">
      <div
        className="p-3 border rounded cursor-pointer"
        style={{ backgroundColor: "#30384B" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center text-white">
          <h4 className="m-0 text-xl font-bold">PLAN APPROVAL DETAILS</h4>
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
        <div className="p-3 border rounded mt-2 bg-gray-50">
          <div className="card-body">
            <h5 className="mt-4 mb-3 text-lg font-semibold">Plan Approval Details</h5>
            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-3">
                <label className="block mb-1">Construction as per approved/sanctioned plans:</label>
                <select
                  name="constructionAsPerApproved"
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                  defaultValue="Yes"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="w-full md:w-1/2 px-2 mb-3">
                <label className="block mb-1">Details of approved plan with approval no & date:</label>
                <input
                  type="text"
                  name="approvedPlanDetails"
                  className="w-full p-2 border rounded"
                  defaultValue="NOT OBTAIN"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-3">
                <label className="block mb-1">Construction permission Number and date:</label>
                <input
                  type="text"
                  name="constructionPermission"
                  className="w-full p-2 border rounded"
                  defaultValue="NOT OBTAIN"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-3">
                <label className="block mb-1">Violations Observed if Any or is there any risk of Demolition in case of Violation:</label>
                <input
                  type="text"
                  name="violationsObserved"
                  className="w-full p-2 border rounded"
                  defaultValue="LOW/MEDIUM/HIGH"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="w-full px-2 mb-3">
                <label className="block mb-1">If plans not available, then is the structure confirming to the local:</label>
                <select
                  name="structureConfirmingLocal"
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                  defaultValue="Yes"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <h5 className="mt-4 mb-3 text-lg font-semibold">Floor Details</h5>
            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Floor:</label>
                <input
                  type="text"
                  name="floor"
                  className="w-full p-2 border rounded"
                  defaultValue="G+3"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">As Per Approval Plan:</label>
                <input
                  type="text"
                  name="asPerApprovalPlan"
                  className="w-full p-2 border rounded"
                  defaultValue="NA"
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="mt-4 mb-3 text-lg font-semibold">Deviation Details</h5>
            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Deviation in Sqft:</label>
                <input
                  type="text"
                  name="deviationSqft"
                  className="w-full p-2 border rounded"
                  defaultValue="NA"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">At Site:</label>
                <input
                  type="text"
                  name="deviationAtSite"
                  className="w-full p-2 border rounded"
                  defaultValue="NA"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Deviation in %:</label>
                <input
                  type="text"
                  name="deviationPercentage"
                  className="w-full p-2 border rounded"
                  defaultValue="NA"
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="mt-4 mb-3 text-lg font-semibold">Self Construction case</h5>
            <div className="mb-3">
              <div className="w-full px-2 mb-3">
                <label className="block mb-1">Architect certified estimate available or not:</label>
                <input
                  type="text"
                  name="architectCertifiedEstimate"
                  className="w-full p-2 border rounded"
                  defaultValue="NOT OBTAIN"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="w-full px-2 mb-3">
                <label className="block mb-1">Construction Amount certified:</label>
                <input
                  type="text"
                  name="constructionAmountCertified"
                  className="w-full p-2 border rounded"
                  defaultValue="NOT OBTAIN"
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="mt-4 mb-3 text-lg font-semibold">Fair Market Value</h5>
            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Floor:</label>
                <input
                  type="text"
                  name="fairMarketValueFloor"
                  className="w-full p-2 border rounded"
                  defaultValue=""
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">As Per Actual:</label>
                <input
                  type="text"
                  name="fairMarketValueActual"
                  className="w-full p-2 border rounded"
                  defaultValue="300"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">As Per Plan:</label>
                <input
                  type="text"
                  name="fairMarketValuePlan"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="w-full px-2 mb-3">
                <label className="block mb-1">Final Area in SQFT Considered for Valuation:</label>
                <input
                  type="text"
                  name="finalAreaForValuation"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="mt-4 mb-3 text-lg font-semibold">Land Area and Value</h5>
            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Land Area (IN SQFT):</label>
                <input
                  type="text"
                  name="landArea"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Rate (IN RS.):</label>
                <input
                  type="text"
                  name="rate"
                  className="w-full p-2 border rounded"
                  defaultValue="300"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Land Value (IN RS.):</label>
                <input
                  type="text"
                  name="landValue"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
       <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md"
         onClick={handleSubmit} >
            Next
          </button>
    </div>
  );
};

export default PlanApproval;