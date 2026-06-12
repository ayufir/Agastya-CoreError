import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";

const BuildingDetails = ({ isEdit, onNext, onBack }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    numberOfBlocks: "",
    numberOfLifts: "",
    ageOfBuilding: "",
    residualLife: "",
    unitConfiguration: "",
    floorsApproved: "",
    floorsProposed: "",
    floorsAtSite: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        numberOfBlocks: isEdit.numberOfBlocks || "",
        numberOfLifts: isEdit.numberOfLifts || "",
        ageOfBuilding: isEdit.ageOfBuilding || "",
        residualLife: isEdit.residualLife || "",
        unitConfiguration: isEdit.unitConfiguration || "",
        floorsApproved: isEdit.floorsApproved || "",
        floorsProposed: isEdit.floorsProposed || "",
        floorsAtSite: isEdit.floorsAtSite || "",
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
    // console.log("Submitted Building Details:", formData);
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
        <h4 className='text-lg font-semibold'>Building Details</h4>
        <button className='bg-white text-sm text-black px-3 py-1 rounded'>
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='bg-white border border-gray-300 mt-4 rounded p-4'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {[
              { label: "No. of Blocks/Wings", name: "numberOfBlocks" },
              { label: "No. of Lifts", name: "numberOfLifts" },
              { label: "Age of Building (in years)", name: "ageOfBuilding" },
              {
                label: "Residual life of Building (in years)",
                name: "residualLife",
              },
              { label: "Unit Configuration", name: "unitConfiguration" },
              { label: "Floors Approved/Sanctioned", name: "floorsApproved" },
              { label: "Floors Proposed", name: "floorsProposed" },
              { label: "Floors at Site", name: "floorsAtSite" },
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
                  placeholder={`Enter ${field.label}`}
                  className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500'
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
              className='mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded'
              style={{ backgroundColor: "#365069" }}
            >
              Next
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BuildingDetails;
