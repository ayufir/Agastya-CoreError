import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const OtherValue = ({ isEdit, onNext, onBack }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    guidelineValue: "",
    forcedSaleValue: "",
    reconstructionCost: "",
    approxRentals: "",
    riskOfDemolition: "",
    offsetProjections: "",
    extraCoverage: "",
    habitation: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        guidelineValue: isEdit.guidelineValue || "",
        forcedSaleValue: isEdit.forcedSaleValue || "",
        reconstructionCost: isEdit.reconstructionCost || "",
        approxRentals: isEdit.approxRentals || "",
        riskOfDemolition: isEdit.riskOfDemolition || "",
        offsetProjections: isEdit.offsetProjections || "",
        extraCoverage: isEdit.extraCoverage || "",
        habitation: isEdit.habitation || "",
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
    setFormData({
      guidelineValue: "",
      forcedSaleValue: "",
      reconstructionCost: "",
      approxRentals: "",
      riskOfDemolition: "",
      offsetProjections: "",
      extraCoverage: "",
      habitation: "",
    });
    toast.success("saved successfully!");
  };

  return (
    <div className='container mx-auto mt-2 px-4 max-w-4xl'>
      <div
        className='flex justify-between items-center text-white p-2 rounded cursor-pointer bg-[#365069]'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-lg font-semibold'>Other Value References</h4>
        <button className='bg-white text-[#365069] font-semibold px-4 py-2 rounded shadow-sm'>
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='mt-4 bg-white rounded-lg shadow-md p-6'>
          <form onSubmit={handleSubmit}>
            {[
              {
                label: "Guideline Value of The Property",
                name: "guidelineValue",
              },
              {
                label: "Forced Sale Value / Distressed rate",
                name: "forcedSaleValue",
              },
              { label: "Re-construction cost", name: "reconstructionCost" },
              {
                label: "Approx. Rentals in case of 100% complete property",
                name: "approxRentals",
              },
              {
                label:
                  "Risk of Demolition based on Techno-legal aspect/ Building Quality",
                name: "riskOfDemolition",
              },
              { label: "Offset/Projections", name: "offsetProjections" },
              { label: "Extra Coverage", name: "extraCoverage" },
              { label: "Habitation", name: "habitation" },
            ].map((field, index) => (
              <div className='mb-6' key={index}>
                <label className='block text-gray-700 font-medium mb-2'>
                  {field.label}:
                </label>
                <input
                  type='text'
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label}`}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
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
              className='bg-[#365069] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2c435a] transition'
            >
              Next
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OtherValue;
