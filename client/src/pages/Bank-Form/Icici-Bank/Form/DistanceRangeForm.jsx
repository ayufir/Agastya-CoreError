import React, { useState, useEffect } from "react";

const DistanceRangeForm = ({ onNext, isEdit }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    distanceFromCPC: 120,
    longitude: 79.43277,
    distanceFromCityCenter: 2,
    distanceFromICICIBank: 120,
    latitude: 23.83895,
    oneWayDistance: 120,
  });

  useEffect(() => {
    if (isEdit) {
      setFormData(isEdit);
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onNext function to pass the form data to the next step
    onNext(formData);
    // alert('Form submitted successfully!');
    setIsEditOpen(false); // Close the form after submission
  };

  const toggleEdit = () => {
    setIsEditOpen(!isEditOpen);
  };

  return (
    <div className="container mx-auto mt-4 max-w-6xl">
      <div
        className="p-3 border rounded cursor-pointer"
        style={{ backgroundColor: "#98291E" }}
        onClick={toggleEdit}
      >
        <div className="flex justify-between items-center text-white">
          <h4 className="m-0 text-lg font-semibold">
            Distance Range of the Property
          </h4>
          <button
            type="button"
            className="bg-white text-gray-800 px-3 py-1 rounded text-sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleEdit();
            }}
          >
            {isEditOpen ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      {isEditOpen && (
        <div className="border rounded p-3 mt-2 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-semibold">
                  Distance From CPC (km):
                </label>
                <div className="flex">
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-l"
                    name="distanceFromCPC"
                    value={formData.distanceFromCPC}
                    onChange={handleChange}
                  />
                  <span className="inline-flex items-center px-3 border border-gray-300 border-l-0 rounded-r bg-gray-100">
                    km
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Longitude:</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="0.00001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-semibold">
                  Distance From City Center (km):
                </label>
                <div className="flex">
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-l"
                    name="distanceFromCityCenter"
                    value={formData.distanceFromCityCenter}
                    onChange={handleChange}
                  />
                  <span className="inline-flex items-center px-3 border border-gray-300 border-l-0 rounded-r bg-gray-100">
                    km
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Distance From ICICI Bank Sourcing Branch (km):
                </label>
                <div className="flex">
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-l"
                    name="distanceFromICICIBank"
                    value={formData.distanceFromICICIBank}
                    onChange={handleChange}
                  />
                  <span className="inline-flex items-center px-3 border border-gray-300 border-l-0 rounded-r bg-gray-100">
                    km
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-semibold">Latitude:</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="0.00001"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  One Way Distance From Operating Location (km):
                </label>
                <div className="flex">
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-l"
                    name="oneWayDistance"
                    value={formData.oneWayDistance}
                    onChange={handleChange}
                  />
                  <span className="inline-flex items-center px-3 border border-gray-300 border-l-0 rounded-r bg-gray-100">
                    km
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Location Map:</label>
              <div
                className="border p-2 text-center"
                style={{ height: "200px", backgroundColor: "#f8f9fa" }}
              >
                <p className="text-gray-500 mt-4">
                  Map visualization would appear here
                </p>
                <small className="text-gray-500">
                  Latitude: {formData.latitude}, Longitude: {formData.longitude}
                </small>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                style={{ background: "#98291E" }}
                type="submit"
                className="text-white px-4 py-2 rounded"
              >
                Save & Next
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DistanceRangeForm;
