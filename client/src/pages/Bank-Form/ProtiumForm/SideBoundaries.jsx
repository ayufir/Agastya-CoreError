import React, { useState } from 'react';

const SideBoundaries = ({ extractedData, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({
  east: "SHOP NO. 03-A",
  west: "CORRIDOR",
  north: "CORRIDOR",
  south: "SHOP NO. 05",
  boundariesMatching: "No",
  propertyIdentified: "No",
  plotDemarcated: "No",
  amenities: "",
  dimensionE: "0",
  dimensionN: "0",
  dimensionW: "0",
  dimensionS: "0",
  totalPlotArea: "0",
  reductionArea: "0",
  totalArea: "0",
  landPlotAreaDoc: "300 Sq Ft",
  landPlotAreaPlan: "0",
  landPlotAreaSite: "0",
  builtUpAreaPlan: "0",
  builtUpAreaActual: "300",
  firstFloor: "",
  typeOfStructure: "RCC / Load Bearing/ Stone Slab/ Tin Sheet/ Temporary",
  noOfWings: "",
  noOfUnitsPerFloor: "",
  qualityOfConstruction: "GOOD",
  structuralObservation: "Yes",
  configuration: "",
  flooringFinishing: "GOOD",
  roofingTerracing: "GOOD",
  qualityFixturesSettings: "GOOD",
  doorsWindows: "YES"
});

  React.useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const bounds = p.boundaries || {};
      const propDet = p.property_details || {};
      const val = p.valuation_details || {};
      const accom = p.accommodation_details || {};

      setFormData((prev) => ({
        ...prev,
        east: bounds.east_actual || bounds.east_as_per_deed || extractedData.east || prev.east,
        west: bounds.west_actual || bounds.west_as_per_deed || extractedData.west || prev.west,
        north: bounds.north_actual || bounds.north_as_per_deed || extractedData.north || prev.north,
        south: bounds.south_actual || bounds.south_as_per_deed || extractedData.south || prev.south,
        boundariesMatching: extractedData.boundariesMatching || prev.boundariesMatching,
        propertyIdentified: propDet.property_identification || extractedData.propertyIdentified || prev.propertyIdentified,
        plotDemarcated: propDet.property_demarcated || extractedData.plotDemarcated || prev.plotDemarcated,
        amenities: propDet.amenities || accom.amenities || extractedData.amenities || prev.amenities,
        dimensionE: bounds.east_dimension || extractedData.dimensionE || prev.dimensionE,
        dimensionN: bounds.north_dimension || extractedData.dimensionN || prev.dimensionN,
        dimensionW: bounds.west_dimension || extractedData.dimensionW || prev.dimensionW,
        dimensionS: bounds.south_dimension || extractedData.dimensionS || prev.dimensionS,
        totalPlotArea: val.plot_area_physical || extractedData.totalPlotArea || prev.totalPlotArea,
        landPlotAreaDoc: val.plot_area_in_deed || extractedData.landPlotAreaDoc || prev.landPlotAreaDoc,
        landPlotAreaPlan: val.plot_area_plan || extractedData.landPlotAreaPlan || prev.landPlotAreaPlan,
        landPlotAreaSite: val.plot_area_physical || extractedData.landPlotAreaSite || prev.landPlotAreaSite,
        builtUpAreaPlan: val.carpet_area_plan || extractedData.builtUpAreaPlan || prev.builtUpAreaPlan,
        builtUpAreaActual: val.carpet_area_measurement || extractedData.builtUpAreaActual || prev.builtUpAreaActual,
        typeOfStructure: accom.type_of_structure || extractedData.typeOfStructure || prev.typeOfStructure,
        noOfUnitsPerFloor: propDet.no_of_units_on_each_floor || extractedData.noOfUnitsPerFloor || prev.noOfUnitsPerFloor,
        qualityOfConstruction: accom.quality_of_construction || extractedData.qualityOfConstruction || prev.qualityOfConstruction,
        configuration: accom.flat_configuration || extractedData.configuration || prev.configuration,
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
          <h4 className="m-0 text-xl font-bold">SIDE BOUNDARIES</h4>
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
          <div>
            <h5 className="mt-4 mb-3 text-lg font-semibold">Boundary Details</h5>
            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">East:</label>
                <input
                  type="text"
                  name="east"
                  className="w-full p-2 border rounded"
                  defaultValue="SHOP NO. 03-A"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">West:</label>
                <input
                  type="text"
                  name="west"
                  className="w-full p-2 border rounded"
                  defaultValue="CORRIDOR"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">North:</label>
                <input
                  type="text"
                  name="north"
                  className="w-full p-2 border rounded"
                  defaultValue="CORRIDOR"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">South:</label>
                <input
                  type="text"
                  name="south"
                  className="w-full p-2 border rounded"
                  defaultValue="SHOP NO. 05"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Boundaries are matching:</label>
                <select
                  name="boundariesMatching"
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                  defaultValue="No"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Property identified through:</label>
                <select
                  name="propertyIdentified"
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                  defaultValue="No"
                >
                  <option value="Yes">Yes / No</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Plot Demarcated at site:</label>
                <select
                  name="plotDemarcated"
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                  defaultValue="No"
                >
                  <option value="Yes">Yes / No</option>
                </select>
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Amenities:</label>
                <input
                  type="text"
                  name="amenities"
                  className="w-full p-2 border rounded"
                  defaultValue=""
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="mt-4 mb-3 text-lg font-semibold">Dimensions</h5>
            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">E:</label>
                <input
                  type="text"
                  name="dimensionE"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">N:</label>
                <input
                  type="text"
                  name="dimensionN"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">W:</label>
                <input
                  type="text"
                  name="dimensionW"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">S:</label>
                <input
                  type="text"
                  name="dimensionS"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Total Plot Area (IN SQFT):</label>
                <input
                  type="text"
                  name="totalPlotArea"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Reduction Area (IN SQFT):</label>
                <input
                  type="text"
                  name="reductionArea"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="w-full px-2 mb-3">
                <label className="block mb-1">Total Area (IN SQFT):</label>
                <input
                  type="text"
                  name="totalArea"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="mt-4 mb-3 text-lg font-semibold">Land / Plot Area</h5>
            <div className="mb-3">
              <div className="w-full px-2 mb-3">
                <label className="block mb-1">Land / Plot Area (Doc):</label>
                <input
                  type="text"
                  name="landPlotAreaDoc"
                  className="w-full p-2 border rounded"
                  defaultValue="300 Sq Ft"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-3">
                <label className="block mb-1">Land / Plot Area (Plan) IN SQFT:</label>
                <input
                  type="text"
                  name="landPlotAreaPlan"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-3">
                <label className="block mb-1">Land / Plot Area (Site) IN SQFT:</label>
                <input
                  type="text"
                  name="landPlotAreaSite"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="mt-4 mb-3 text-lg font-semibold">Built up Area</h5>
            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/2 px-2 mb-3">
                <label className="block mb-1">Built up Area (As per Plan) IN SQFT:</label>
                <input
                  type="text"
                  name="builtUpAreaPlan"
                  className="w-full p-2 border rounded"
                  defaultValue="0"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-3">
                <label className="block mb-1">Built up area (Actual) IN SQFT:</label>
                <input
                  type="text"
                  name="builtUpAreaActual"
                  className="w-full p-2 border rounded"
                  defaultValue="300"
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="mt-4 mb-3 text-lg font-semibold">Floor Details</h5>
            <div className="mb-3">
              <div className="w-full px-2 mb-3">
                <label className="block mb-1">First Floor:</label>
                <input
                  type="text"
                  name="firstFloor"
                  className="w-full p-2 border rounded"
                  defaultValue=""
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="mt-4 mb-3 text-lg font-semibold">Structural Details</h5>
            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Type of Structure:</label>
                <input
                  type="text"
                  name="typeOfStructure"
                  className="w-full p-2 border rounded"
                  defaultValue="RCC / Load Bearing/ Stone Slab/ Tin Sheet/ Temporary"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">No. of wings:</label>
                <input
                  type="text"
                  name="noOfWings"
                  className="w-full p-2 border rounded"
                  defaultValue=""
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">No. of Units on each floor:</label>
                <input
                  type="text"
                  name="noOfUnitsPerFloor"
                  className="w-full p-2 border rounded"
                  defaultValue=""
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Quality of construction:</label>
                <input
                  type="text"
                  name="qualityOfConstruction"
                  className="w-full p-2 border rounded"
                  defaultValue="GOOD"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Structural Observation:</label>
                <select
                  name="structuralObservation"
                  className="w-full p-2 border rounded"
                  onChange={handleChange}
                  defaultValue="Yes"
                >
                  <option value="Yes">YES / No</option>
                </select>
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Configuration:</label>
                <input
                  type="text"
                  name="configuration"
                  className="w-full p-2 border rounded"
                  defaultValue=""
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className="mt-4 mb-3 text-lg font-semibold">Interiors</h5>
            <div className="flex flex-wrap mb-3 -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Flooring & finishing:</label>
                <input
                  type="text"
                  name="flooringFinishing"
                  className="w-full p-2 border rounded"
                  defaultValue="GOOD"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Roofing and terracing:</label>
                <input
                  type="text"
                  name="roofingTerracing"
                  className="w-full p-2 border rounded"
                  defaultValue="GOOD"
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-3">
                <label className="block mb-1">Quality of fixtures & settings:</label>
                <input
                  type="text"
                  name="qualityFixturesSettings"
                  className="w-full p-2 border rounded"
                  defaultValue="GOOD"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="w-full px-2 mb-3">
                <label className="block mb-1">Doors & Windows:</label>
                <input
                  type="text"
                  name="doorsWindows"
                  className="w-full p-2 border rounded"
                  defaultValue="YES"
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

export default SideBoundaries;