import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const StageConstruction = ({ isEdit, onNext, onBack }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    constructionProgress: "Stalled",
    progressPercentage: "0",
    recommendedPercentage: "0",
    presentRealisableValue: "₹0",
    constructionStageDescription: "OPEN LAND",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        constructionProgress: isEdit.constructionProgress || "",
        progressPercentage: isEdit.progressPercentage || "",
        recommendedPercentage: isEdit.recommendedPercentage || "",
        presentRealisableValue: isEdit.presentRealisableValue || "",
        constructionStageDescription: isEdit.constructionStageDescription || "",
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
    <div className='container mx-auto mt-2 px-4 max-w-4xl'>
      <div
        className='flex justify-between items-center text-white px-4 py-3 rounded cursor-pointer'
        style={{ backgroundColor: "#365069" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-lg font-semibold m-0'>Stage of Construction</h4>
        <button className='bg-white text-sm text-black px-3 py-1 rounded'>
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      <div className={`mt-3 ${isOpen ? "" : "hidden"}`}>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {[
            {
              label: "Construction Progress",
              name: "constructionProgress",
            },
            { label: "% Progress", name: "progressPercentage" },
            { label: "% Recommended", name: "recommendedPercentage" },
            {
              label: "Present Realisable Value based on Construction Stage",
              name: "presentRealisableValue",
            },
            {
              label: "Stage of Construction (Descriptive)",
              name: "constructionStageDescription",
            },
          ].map((field, index) => (
            <div key={index}>
              <label className='block font-medium text-gray-700 mb-1'>
                {field.label}
              </label>
              <input
                type='text'
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-teal-500'
                placeholder={`Enter ${field.label}`}
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
            className='mt-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded'
            style={{ backgroundColor: "#365069" }}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default StageConstruction;
