import React, { useState } from 'react';

const directions = [
  'North', 'South', 'East', 'West',
  'North-East', 'North-West', 'South-East', 'South-West',
];

const DocumentForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    name: '',
    customerMobileNo: '',
    reqInitiatorId: '',
    salesManagerMobileNo: '',
    reqInitiatorNameCPCCode: '',
    locations: [
      {
        direction: '',
        boundriesMatching: 'YES',
        distanceTravelled: 0.0,
        siteLocation: '',
        asPerSaleDeed: '',
        actualAtSite: '',
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocationChange = (e, index) => {
    const { name, value } = e.target;
    const updatedLocations = [...formData.locations];
    updatedLocations[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      locations: updatedLocations,
    }));
  };

  const addLocation = () => {
    setFormData((prevData) => ({
      ...prevData,
      locations: [
        ...prevData.locations,
        {
          direction: '',
          boundriesMatching: 'YES',
          distanceTravelled: 0.0,
          siteLocation: '',
          asPerSaleDeed: '',
          actualAtSite: '',
        },
      ],
    }));
  };

  const removeLocation = (index) => {
    const updatedLocations = formData.locations.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      locations: updatedLocations,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) {
      onNext(formData);
    }
  };

  return (
    <div className="p-3 bg-orange-50 border border-gray-300 rounded-lg">
      <h5 className="text-red-600 font-bold mb-4">Contact Persons Details</h5>
      <div className="bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSubmit}>
          {/* Contact Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Narayan Kharka Chhetri"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sales Manager Mobile No</label>
              <input
                type="text"
                name="salesManagerMobileNo"
                value={formData.salesManagerMobileNo}
                onChange={handleChange}
                placeholder="9012757197"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Mobile No</label>
              <input
                type="text"
                name="customerMobileNo"
                value={formData.customerMobileNo}
                onChange={handleChange}
                placeholder="7895335960"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Req Initiator Id</label>
              <input
                type="text"
                name="reqInitiatorId"
                value={formData.reqInitiatorId}
                onChange={handleChange}
                placeholder="1611364"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Req Initiator Name / CPC Code
            </label>
            <input
              type="text"
              name="reqInitiatorNameCPCCode"
              value={formData.reqInitiatorNameCPCCode}
              onChange={handleChange}
              placeholder="LOS_CHANNEL"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <h5 className="text-red-600 font-bold mt-6 mb-4">Physical Details</h5>

          {formData.locations.map((location, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
              <h6 className="font-semibold mb-3">Location {index + 1}</h6>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                  <select
                    name="direction"
                    value={location.direction}
                    onChange={(e) => handleLocationChange(e, index)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Direction</option>
                    {directions.map((dir) => (
                      <option key={dir} value={dir}>
                        {dir}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Boundaries Matching</label>
                  <select
                    name="boundriesMatching"
                    value={location.boundriesMatching}
                    onChange={(e) => handleLocationChange(e, index)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="distanceTravelled"
                    value={location.distanceTravelled}
                    onChange={(e) => handleLocationChange(e, index)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Location</label>
                  <input
                    type="text"
                    name="siteLocation"
                    value={location.siteLocation}
                    onChange={(e) => handleLocationChange(e, index)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">As per Sale Deed</label>
                <textarea
                  rows={2}
                  name="asPerSaleDeed"
                  value={location.asPerSaleDeed}
                  onChange={(e) => handleLocationChange(e, index)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual At Site</label>
                <textarea
                  rows={2}
                  name="actualAtSite"
                  value={location.actualAtSite}
                  onChange={(e) => handleLocationChange(e, index)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              {formData.locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocation(index)}
                  className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded"
                >
                  Remove Location
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addLocation}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Add Location
          </button>

          <button type="submit" className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md">
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default DocumentForm;
