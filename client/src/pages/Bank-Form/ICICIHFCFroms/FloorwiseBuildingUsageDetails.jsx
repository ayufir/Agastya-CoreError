import React, { useState } from 'react';

const FloorwiseBuildingUsageDetails = ({ onNext }) => {
  const [formData, setFormData] = useState({
    structureType: '',
    structureDescription: '',
    stageOfConstruction: '',
    descriptionOfStage: '',
    percentCompleted: '',
    percentRecommended: '',
    violationsObserved: '',
    remarks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Optional but useful if wrapping in <form>
    if (onNext) {
      onNext(formData);
    }
  };

  return (
    <div className="p-6 bg-orange-100 border border-gray-300 rounded-md">
      <h5 className="text-red-700 font-bold text-lg mb-4">Floorwise Building Usage Details</h5>
      <div className="bg-white shadow-md rounded-md p-6">
        <form onSubmit={handleSubmit}>
          <h6 className="text-red-800 font-bold text-md mt-4 mb-2">Structure Details</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="structureType" className="block font-medium text-gray-700 mb-1">
                Select Structure
              </label>
              <select
                name="structureType"
                id="structureType"
                value={formData.structureType}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select Structure</option>
                <option value="Structure 1">Structure 1</option>
                <option value="Structure 2">Structure 2</option>
                <option value="Structure 3">Structure 3</option>
              </select>
            </div>
            <div>
              <label htmlFor="structureDescription" className="block font-medium text-gray-700 mb-1">
                Structure Description
              </label>
              <input
                type="text"
                name="structureDescription"
                id="structureDescription"
                value={formData.structureDescription}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          <h6 className="text-red-800 font-bold text-md mt-6 mb-2">Stage of Construction</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stageOfConstruction" className="block font-medium text-gray-700 mb-1">
                Stage of Construction
              </label>
              <input
                type="text"
                name="stageOfConstruction"
                id="stageOfConstruction"
                value={formData.stageOfConstruction}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="descriptionOfStage" className="block font-medium text-gray-700 mb-1">
                Description of Stage
              </label>
              <input
                type="text"
                name="descriptionOfStage"
                id="descriptionOfStage"
                value={formData.descriptionOfStage}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="percentCompleted" className="block font-medium text-gray-700 mb-1">
                % Completed
              </label>
              <input
                type="text"
                name="percentCompleted"
                id="percentCompleted"
                value={formData.percentCompleted}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="percentRecommended" className="block font-medium text-gray-700 mb-1">
                % Recommended
              </label>
              <input
                type="text"
                name="percentRecommended"
                id="percentRecommended"
                value={formData.percentRecommended}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          <h6 className="text-red-800 font-bold text-md mt-6 mb-2">Violations and Remarks</h6>
          <div className="mb-4">
            <label htmlFor="violationsObserved" className="block font-medium text-gray-700 mb-1">
              Violations Observed
            </label>
            <input
              type="text"
              name="violationsObserved"
              id="violationsObserved"
              value={formData.violationsObserved}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="remarks" className="block font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <input
              type="text"
              name="remarks"
              id="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-4"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default FloorwiseBuildingUsageDetails;
