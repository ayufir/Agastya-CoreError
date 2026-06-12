import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SurroundingLocality = ({ isEdit, onNext, onBack }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    locationType: "",
    classOfLocality: "",
    proximityToCivicAmenities: "",
    railwayStation: "",
    busStop: "",
    typeOfRoad: "",
    legalApproach: "",
    physicalApproach: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        locationType: isEdit.locationType || "",
        classOfLocality: isEdit.classOfLocality || "",
        proximityToCivicAmenities: isEdit.proximityToCivicAmenities || "",
        railwayStation: isEdit.railwayStation || "",
        busStop: isEdit.busStop || "",
        typeOfRoad: isEdit.typeOfRoad || "",
        legalApproach: isEdit.legalApproach || "",
        physicalApproach: isEdit.physicalApproach || "",
      });
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
    // console.log("Submitted Data:", formData);
    onNext(formData);
    toast.success("saved successfully!");
  };

  return (
    <div className='max-w-4xl mx-auto mt-4 px-4'>
      <div
        className='flex justify-between items-center text-white p-4 rounded cursor-pointer'
        style={{ backgroundColor: "#365069" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-lg font-semibold m-0'>
          Surrounding & Locality Details
        </h4>
        <button className='bg-white text-gray-800 px-3 py-1 rounded text-sm font-medium'>
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='mt-4 bg-white p-6 rounded shadow'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {[
              { label: "Location Type", name: "locationType" },
              { label: "Class of Locality", name: "classOfLocality" },
              {
                label: "Proximity to Civic Amenities (Km)",
                name: "proximityToCivicAmenities",
              },
              { label: "Railway Station (Km)", name: "railwayStation" },
              { label: "Bus Stop (Km)", name: "busStop" },
              { label: "Type of Road", name: "typeOfRoad" },
              {
                label: "Legal Approach to the Property",
                name: "legalApproach",
              },
              {
                label: "Physical Approach to the Property",
                name: "physicalApproach",
              },
            ].map((field, index) => (
              <div key={index}>
                <label className='block font-semibold text-gray-700 mb-1'>
                  {field.label}:
                </label>
                <input
                  type='text'
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label}`}
                  className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            ))}
            {onBack && (
              <button
                type='default'
                onClick={onBack}
                className='mr-2 px-4 py-2 bg-gray-500 rounded'
              >
                Back
              </button>
            )}
            <button
              type='submit'
              className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded'
            >
              Next
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SurroundingLocality;
