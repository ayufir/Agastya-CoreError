import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

const TechnicalDetails = ({ onNext }) => {
  // const [formData, setFormData] = useState({
  //   constructionQuality: "",
  //   openPlot: "",
  //   liftAvailable: "",
  //   numberOfLifts: "",
  //   currentOccupant: "",
  //   independentAccess: "",
  //   accommodationDetails: "",
  //   eastWestDocument: "",
  //   eastWestSite: "",
  //   northSouthDocument: "",
  //   northSouthSite: "",
  //   landAreaDocument: "",
  //   landAreaSite: "",
  //   basementRooms: "",
  //   basementKitchens: "",
  //   basementBathrooms: "",
  //   basementSanctioned: "",
  //   basementActual: "",
  //   groundRooms: "2R+1HAL",
  //   groundKitchens: "1",
  //   groundBathrooms: "1",
  //   groundSanctioned: "RESI.",
  //   groundActual: "OPEN PLOT",
  //   permissibleArea: "NA",
  //   landComponent: "999",
  //   permissibleFSI: "0",
  //   permissibleConstruction: "999",
  //   carpetArea: "849.15",
  //   proposedConstruction: "999",
  //   riskOfDemolition: "LOW",
  //   propertyStatus: "OPEN PLOT",
  //   percentCompleted: "0",
  //   percentRecommended: "0",
  //   propertyAge: "0",
  //   residualAge: "50",
  //   landArea: "999",
  //   landRate: "1600",
  //   landTotal: "1598400",
  //   buaArea: "999",
  //   buaRate: "1700",
  //   buaTotal: "1698300",
  //   realizableValue: "3296700",
  //   governmentValue: "NA",
  //   distressedValue: "2637360",
  //   previousValuation: "NA",
  //   inDemolitionList: "NO",
  //   negativeArea: "NO",
  // });

  const [formData, setFormData] = useState({
    constructionQuality: "Good",
    openPlot: "Yes",
    liftAvailable: "No",
    numberOfLifts: "0",
    currentOccupant: "Vacant",
    independentAccess: "Yes",
    accommodationDetails: "Open plot with boundary wall",
    eastWestDocument: "30m",
    eastWestSite: "30m",
    northSouthDocument: "40m",
    northSouthSite: "40m",
    landAreaDocument: "999 sqm",
    landAreaSite: "999 sqm",
    basementRooms: "0",
    basementKitchens: "0",
    basementBathrooms: "0",
    basementSanctioned: "NA",
    basementActual: "NA",
    groundRooms: "2R+1HAL",
    groundKitchens: "1",
    groundBathrooms: "1",
    groundSanctioned: "RESI.",
    groundActual: "OPEN PLOT",
    permissibleArea: "NA",
    landComponent: "999",
    permissibleFSI: "0",
    permissibleConstruction: "999",
    carpetArea: "849.15",
    proposedConstruction: "999",
    riskOfDemolition: "LOW",
    propertyStatus: "OPEN PLOT",
    percentCompleted: "0",
    percentRecommended: "0",
    propertyAge: "0",
    residualAge: "50",
    landArea: "999",
    landRate: "1600",
    landTotal: "1598400",
    buaArea: "999",
    buaRate: "1700",
    buaTotal: "1698300",
    realizableValue: "3296700",
    governmentValue: "NA",
    distressedValue: "2637360",
    previousValuation: "NA",
    inDemolitionList: "NO",
    negativeArea: "NO",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
    toast.success("saved successfully");
  };

  return (
    <div className='p-4 border rounded-lg shadow-md'>
      <h2 className='text-xl font-bold mb-4'>Technical Details:</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Construction Quality */}
        <div className='col-span-2 grid grid-cols-4 gap-2'>
          <label className='font-bold col-span-3'>
            Construction Quality (Good/Average/Poor):
          </label>
          <select
            name='constructionQuality'
            value={formData.constructionQuality || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600'
          >
            <option value=''>Select</option>
            <option value='Good'>Good</option>
            <option value='Average'>Average</option>
            <option value='Poor'>Poor</option>
          </select>
        </div>

        {/* Open Plot */}
        <div className='col-span-2 grid grid-cols-4 gap-2'>
          <label className='font-bold col-span-3'>OPEN PLOT:</label>
          <input
            type='text'
            name='openPlot'
            value={formData.openPlot || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1'
          />
        </div>

        {/* Lift Available */}
        <div className='col-span-2 grid grid-cols-4 gap-2'>
          <label className='font-bold col-span-3'>
            Lift Available (Yes/No):
          </label>
          <select
            name='liftAvailable'
            value={formData.liftAvailable || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600'
          >
            <option value=''>Select</option>
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
            <option value='NA'>NA</option>
          </select>
        </div>

        {/* Number of Lifts */}
        <div className='col-span-2 grid grid-cols-4 gap-2'>
          <label className='font-bold col-span-3'>Number of Lifts:</label>
          <input
            type='text'
            name='numberOfLifts'
            value={formData.numberOfLifts || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1'
          />
        </div>

        {/* Current Occupant */}
        <div className='col-span-2 grid grid-cols-4 gap-2'>
          <label className='font-bold col-span-3'>
            Current Occupant of Property (Owner/Tenant/Vacant):
          </label>
          <select
            name='currentOccupant'
            value={formData.currentOccupant || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600'
          >
            <option value=''>Select</option>
            <option value='Owner'>Owner</option>
            <option value='Tenant'>Tenant</option>
            <option value='Vacant'>Vacant</option>
          </select>
        </div>

        {/* Independent Access */}
        <div className='col-span-2 grid grid-cols-4 gap-2'>
          <label className='font-bold col-span-3'>
            Independent Access (Yes/No):
          </label>
          <select
            name='independentAccess'
            value={formData.independentAccess || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1'
          >
            <option value=''>Select</option>
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
            <option value='NA'>NA</option>
          </select>
        </div>

        {/* Accommodation Details */}
        <div className='col-span-2 grid grid-cols-4 gap-2'>
          <label className='font-bold col-span-3'>
            Accommodation details: Floor wise and Occupancy
          </label>
          <textarea
            name='accommodationDetails'
            value={formData.accommodationDetails || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-1'
          />
        </div>

        {/* Plot Area Details - Header */}
        <div className='col-span-2 grid grid-cols-4 gap-2'>
          <label className='font-bold col-span-2'>Plot Area Details</label>
          <label className='font-bold'>As Per Documents</label>
          <label className='font-bold'>As Per Site Visit</label>
        </div>

        {/* East to West */}
        <div className='col-span-2 grid grid-cols-4 gap-2'>
          <label className='font-bold col-span-2'>East to West</label>
          <input
            type='text'
            name='eastWestDocument'
            value={formData.eastWestDocument || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-right'
          />
          <input
            type='text'
            name='eastWestSite'
            value={formData.eastWestSite || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600'
          />
        </div>

        {/* North to South */}
        <div className='col-span-2 grid grid-cols-4 gap-2'>
          <label className='font-bold col-span-2'>North to South</label>
          <input
            type='text'
            name='northSouthDocument'
            value={formData.northSouthDocument || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-right'
          />
          <input
            type='text'
            name='northSouthSite'
            value={formData.northSouthSite || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600'
          />
        </div>

        {/* Land Area */}
        <div className='col-span-2 grid grid-cols-4 gap-2'>
          <label className='font-bold col-span-2'>Land Area (In Sq. Ft.)</label>
          <input
            type='text'
            name='landAreaDocument'
            value={formData.landAreaDocument || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-right'
          />
          <input
            type='text'
            name='landAreaSite'
            value={formData.landAreaSite || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600'
          />
        </div>

        {/* BAU Area Header */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='font-bold'>BAU Area Details</label>
          <label className='font-bold'>No. of Rooms</label>
          <label className='font-bold col-span-2'>No. of Kitchens</label>
          <label className='font-bold col-span-2'>No. of Bathrooms</label>
          <label className='font-bold'>Sanctioned Usages</label>
          <label className='font-bold'>Actual Usage</label>
        </div>

        {/* Basement/Stilt Floor */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='font-bold'>Basement/Stilt Floor</label>
          <input
            type='text'
            name='basementRooms'
            value={formData.basementRooms || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1'
          />
          <input
            type='text'
            name='basementKitchens'
            value={formData.basementKitchens || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-2'
          />
          <input
            type='text'
            name='basementBathrooms'
            value={formData.basementBathrooms || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-2'
          />
          <input
            type='text'
            name='basementSanctioned'
            value={formData.basementSanctioned || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1'
          />
          <input
            type='text'
            name='basementActual'
            value={formData.basementActual || ""}
            onChange={handleInputChange}
            className='border rounded px-2 py-1'
          />
        </div>

        {/* Ground Floor Proposed */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='font-bold'>Ground Floor proposed</label>
          <input
            type='text'
            name='groundRooms'
            value={formData.groundRooms || "2R+1HAL"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600'
          />
          <input
            type='text'
            name='groundKitchens'
            value={formData.groundKitchens || "1"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600 col-span-2'
          />
          <input
            type='text'
            name='groundBathrooms'
            value={formData.groundBathrooms || "1"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600 col-span-2'
          />
          <input
            type='text'
            name='groundSanctioned'
            value={formData.groundSanctioned || "RESI."}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600'
          />
          <input
            type='text'
            name='groundActual'
            value={formData.groundActual || "OPEN PLOT"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600'
          />
        </div>

        {/* Additional rows for other floors would go here */}

        {/* Items Header */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='font-bold'>Items</label>
          <label className='font-bold'>
            Permissible area as per plan (In Sq. Ft)
          </label>
          <label className='font-bold col-span-2'>
            Land Component (In Sq. Ft)
          </label>
          <label className='font-bold col-span-2'>Permissible FSI</label>
          <label className='font-bold'>
            Permissible construction as per FSI (In Sq. Ft)
          </label>
          <label className='font-bold'>Carpet Area as Per Document</label>
          <label className='font-bold'>
            Proposed construction (SBUA) (In Sq. Ft)
          </label>
        </div>

        {/* Items Data */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <div></div>
          <input
            type='text'
            name='permissibleArea'
            value={formData.permissibleArea || "NA"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1'
          />
          <input
            type='text'
            name='landComponent'
            value={formData.landComponent || "999"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-red-600 col-span-2'
          />
          <input
            type='text'
            name='permissibleFSI'
            value={formData.permissibleFSI || "0"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-red-600 col-span-2'
          />
          <input
            type='text'
            name='permissibleConstruction'
            value={formData.permissibleConstruction || "999"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-red-600'
          />
          <input
            type='text'
            name='carpetArea'
            value={formData.carpetArea || "849.15"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 font-bold'
          />
          <input
            type='text'
            name='proposedConstruction'
            value={formData.proposedConstruction || "999"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-red-600'
          />
        </div>

        {/* Risk of Demolition */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='font-bold col-span-7'>
            Risk of Demolition (High / Medium / Low)
          </label>
          <select
            name='riskOfDemolition'
            value={formData.riskOfDemolition || "LOW"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600'
          >
            <option value='High'>High</option>
            <option value='Medium'>Medium</option>
            <option value='Low'>Low</option>
          </select>
        </div>

        {/* Status of the Property */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='font-bold col-span-2'>
            Status of the Property (Plot/Under Construction/
            Complete/Construction on Hold)
          </label>
          <input
            type='text'
            name='propertyStatus'
            value={formData.propertyStatus || "OPEN PLOT"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1'
          />
          <label className='font-bold col-span-2'>% Completed</label>
          <input
            type='text'
            name='percentCompleted'
            value={formData.percentCompleted || "0"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1'
          />
          <label className='font-bold col-span-2'>% Recommended</label>
          <input
            type='text'
            name='percentRecommended'
            value={formData.percentRecommended || "0"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1'
          />
        </div>

        {/* Current Age of Property */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='font-bold col-span-3'>
            Current Age of Property IN YEAR
          </label>
          <input
            type='text'
            name='propertyAge'
            value={formData.propertyAge || "0"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-2'
          />
          <label className='font-bold col-span-4'>Residual Age</label>
          <input
            type='text'
            name='residualAge'
            value={formData.residualAge || "50"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600 col-span-2 text-right'
          />
        </div>

        {/* Valuation Table Header */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='font-bold'>Items</label>
          <label className='font-bold col-span-2'>
            Area Details in Sq. Ft.
          </label>
          <label className='font-bold col-span-3'>Rate per Sq. Ft.</label>
          <label className='font-bold col-span-2'>Total Values in Rupees</label>
        </div>

        {/* Land Value */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label>Land Value</label>
          <input
            type='text'
            name='landArea'
            value={formData.landArea || "999"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600 col-span-2'
          />
          <input
            type='text'
            name='landRate'
            value={formData.landRate || "1600"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600 col-span-3'
          />
          <input
            type='text'
            name='landTotal'
            value={formData.landTotal || "1598400"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-2'
          />
        </div>

        {/* BUA Value */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label>BUA Value</label>
          <input
            type='text'
            name='buaArea'
            value={formData.buaArea || "999"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-2'
          />
          <input
            type='text'
            name='buaRate'
            value={formData.buaRate || "1700"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 text-purple-600 col-span-3'
          />
          <input
            type='text'
            name='buaTotal'
            value={formData.buaTotal || "1698300"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-2'
          />
        </div>

        {/* Other valuation rows would go here */}

        {/* Realizable value */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='col-span-6'>Realizable value as on date</label>
          <input
            type='text'
            name='realizableValue'
            value={formData.realizableValue || "3296700"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-2'
          />
        </div>

        {/* Government Value */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='col-span-6'>Government Value</label>
          <input
            type='text'
            name='governmentValue'
            value={formData.governmentValue || "NA"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-2'
          />
        </div>

        {/* Distressed Value */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='col-span-6'>Distressed/Force Value</label>
          <input
            type='text'
            name='distressedValue'
            value={formData.distressedValue || "2637360"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-2'
          />
        </div>

        {/* Valuation Done Earlier */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='col-span-6'>Valuation Done Earlier</label>
          <input
            type='text'
            name='previousValuation'
            value={formData.previousValuation || "NA"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-2'
          />
        </div>

        {/* In Demolition List */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='col-span-6'>
            In Municipal/Development Authority Demolition List (Yes/No)
          </label>
          <select
            name='inDemolitionList'
            value={formData.inDemolitionList || "NO"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-2'
          >
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
          </select>
        </div>

        {/* Negative Area */}
        <div className='col-span-2 grid grid-cols-8 gap-2'>
          <label className='col-span-6'>
            Is Property in Negative Area (Yes/No)
          </label>
          <select
            name='negativeArea'
            value={formData.negativeArea || "NO"}
            onChange={handleInputChange}
            className='border rounded px-2 py-1 col-span-2'
          >
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
          </select>
        </div>
      </div>

      <div className='mt-6'>
        <button
          onClick={handleSubmit}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TechnicalDetails;
