import React, { useState, useEffect } from "react";

const ConstructionProgressForm = ({ onNext, isEdit }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    typeOfStructure: "Load Bearing",
    structureConfiguration: "G + 1",
    resolutionAmenities: 100,
    recommendationAmenities: 100,
    amenityCompletion: 100,
    amenityRecommendation: 100,
    structureCompletion: 100,
    structureRecommendation: 100,
    recommendedValue: 33000000,
    comments: "",
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
    setIsEditOpen(false);
  };

  return (
    <div className="container mx-auto mt-4 max-w-6xl">
      <div
        className="p-3 border rounded cursor-pointer"
        style={{ backgroundColor: "#98291E" }}
        onClick={() => setIsEditOpen(!isEditOpen)}
      >
        <div className="flex justify-between items-center text-white">
          <h4 className="m-0 text-lg font-semibold">
            Construction Progress Details
          </h4>
          <button
            type="button"
            className="bg-white text-gray-800 px-3 py-1 rounded text-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditOpen(!isEditOpen);
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
                <label className="block mb-2">Type of Structure:</label>
                <select
                  className="w-full p-2 border rounded"
                  name="typeOfStructure"
                  value={formData.typeOfStructure}
                  onChange={handleChange}
                >
                  <option value="Load Bearing">Load Bearing</option>
                  <option value="RCC Frame">RCC Frame</option>
                  <option value="Steel Frame">Steel Frame</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Structure Configuration:</label>
                <select
                  className="w-full p-2 border rounded"
                  name="structureConfiguration"
                  value={formData.structureConfiguration}
                  onChange={handleChange}
                >
                  <option value="G">Ground Floor</option>
                  <option value="G + 1">Ground + 1</option>
                  <option value="G + 2">Ground + 2</option>
                  <option value="G + 3">Ground + 3</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2">Resolution Amenities (%):</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  name="resolutionAmenities"
                  value={formData.resolutionAmenities}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2">
                  Recommendation Amenities (%):
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  name="recommendationAmenities"
                  value={formData.recommendationAmenities}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2">Amenity Completion (%):</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  name="amenityCompletion"
                  value={formData.amenityCompletion}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2">
                  Amenity Recommendation (%):
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  name="amenityRecommendation"
                  value={formData.amenityRecommendation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2">Structure Completion (%):</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  name="structureCompletion"
                  value={formData.structureCompletion}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2">
                  Structure Recommendation (%):
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  name="structureRecommendation"
                  value={formData.structureRecommendation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Recommended Value:</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100">
                  ¥
                </span>
                <input
                  type="number"
                  className="w-full p-2 border rounded-r"
                  name="recommendedValue"
                  value={formData.recommendedValue}
                  onChange={handleChange}
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {new Intl.NumberFormat("en-IN").format(
                  formData.recommendedValue
                )}{" "}
                (Thirty Three Lakh Rupees Only)
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">
                Comments on Construction:
              </label>
              <textarea
                className="w-full p-2 border rounded"
                rows="3"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Please enter your remarks here..."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                style={{ background: "#98291E" }}
                type="submit"
                className="text-white px-4 py-2 rounded"
              >
           Next
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ConstructionProgressForm;
