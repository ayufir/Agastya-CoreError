import React, { useState } from 'react';

const PropertyAndUnitDetailsForm = ({ onNext }) => {
  // Property Details State
  const [formData, setFormData] = useState({
    plotArea: '',
    approvedLandUse: 'RESIDENTIAL',
    nameOfLocation: 'INTER-CLASS/EXECUTE',
    propertyLocation: 'DEVELOPMENT/LATENDER',
    propertyType: 'LABOR/SERIENING',
    propertyArea: '',
    costOfConstruction: '',
    carpetAreaMeasured: 'No',
    billingCriteria: 'BELS',
    virtualVisit: "", // Changed to Boolean
    plotDemarcatedAtSite: 'YES',
    commercializedArea: "", // Changed to Boolean
    classOfLocality: 'REPEAL CLASS HERE',
    distanceFromCityCenter: '',
    noOfFloors: '1',
    toBeBilled: "", // Changed to Boolean
    greenHousing: "", // Changed to Boolean
    natureOfLocation: 'URBAN',
    roadWidth: 'IS',
    structure: 'GET APPLICABLE',
    exterior: 'GOOD',
    approxPropertyAge: '',
    interior: 'GOOD',
    maintenanceLevel: 'GOOD',
    residualAgeOfProperty: 'IE',
    internet: 'GOOD',
    nationalizeLevel: 'GOOD'
  });

  // Unit Details State (with floors)
  const [unitDetails, setUnitDetails] = useState([
    {
      floor: 'Ground Floor',
      description: '',
      rooms: '',
      kitchens: '',
      bathrooms: '',
      usageRemarks: 'BRANDSBOX BY $9.92'
    }
  ]);

  // Handle property details change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value === 'No' || value === 'Yes' ? value === 'Yes' : value, // Handle conversion to Boolean
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission to avoid page reload
    onNext(formData, unitDetails); // Send both form data and unit details to the next step
  };

  // Add a new floor
  const addFloor = () => {
    setUnitDetails([
      ...unitDetails,
      {
        floor: `Floor ${unitDetails.length + 1}`,
        description: '',
        rooms: '',
        kitchens: '',
        bathrooms: '',
        usageRemarks: 'BRANDSBOX BY $9.92'
      }
    ]);
  };

  // Remove a floor
  const removeFloor = (index) => {
    if (unitDetails.length > 1) {
      const newFloors = [...unitDetails];
      newFloors.splice(index, 1);
      setUnitDetails(newFloors);
    }
  };

  // Handle changes in floor details
  const handleFloorChange = (index, field, value) => {
    const newFloors = [...unitDetails];
    newFloors[index][field] = value;
    setUnitDetails(newFloors);
  };

  return (
    <div className="p-3 bg-amber-50 border border-gray-300">
      <form onSubmit={handleSubmit}>
        <h5 className="text-red-600 font-bold">Property Details</h5>
        <div className="mb-4 bg-white rounded shadow">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">Plot Area (In Sq. Ft.)</label>
                <input
                  type="text"
                  name="plotArea"
                  value={formData.plotArea}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Approved Land Use</label>
                <select
                  name="approvedLandUse"
                  value={formData.approvedLandUse}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="RESIDENTIAL">RESIDENTIAL</option>
                  <option value="COMMERCIAL">COMMERCIAL</option>
                  <option value="INDUSTRIAL">INDUSTRIAL</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Name of Location</label>
                <select
                  name="nameOfLocation"
                  value={formData.nameOfLocation}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="INTER-CLASS/EXECUTE">INTER-CLASS/EXECUTE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block mb-1">Property Location</label>
                <select
                  name="propertyLocation"
                  value={formData.propertyLocation}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="DEVELOPMENT/LATENDER">DEVELOPMENT/LATENDER</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="LABOR/SERIENING">LABOR/SERIENING</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Property Area</label>
                <input
                  type="text"
                  name="propertyArea"
                  value={formData.propertyArea}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            {/* Additional fields here (Cost Of Construction, Virtual Visit, etc.) */}

          </div>
        </div>

        <h5 className="text-red-600 font-bold">Unit Details</h5>
        <div className="mb-4 bg-white rounded shadow">
          <div className="p-4">
            {unitDetails.map((floor, index) => (
              <div key={index} className="mb-4 p-3 border border-gray-200 rounded">
                <div className="mb-2">
                  <div className="flex justify-between items-center">
                    <h6 className="font-semibold">{floor.floor}</h6>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeFloor(index)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Remove Floor
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block mb-1">Description</label>
                    <input
                      type="text"
                      value={floor.description}
                      onChange={(e) => handleFloorChange(index, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block mb-1">Rooms</label>
                    <input
                      type="number"
                      value={floor.rooms}
                      onChange={(e) => handleFloorChange(index, 'rooms', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Kitchens</label>
                    <input
                      type="number"
                      value={floor.kitchens}
                      onChange={(e) => handleFloorChange(index, 'kitchens', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={floor.bathrooms}
                      onChange={(e) => handleFloorChange(index, 'bathrooms', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block mb-1">Usage & Remarks</label>
                  <textarea
                    rows={2}
                    value={floor.usageRemarks}
                    onChange={(e) => handleFloorChange(index, 'usageRemarks', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            ))}

            <div className="mt-4">
              <button
                type="button"
                onClick={addFloor}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Another Floor
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-4"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default PropertyAndUnitDetailsForm;
