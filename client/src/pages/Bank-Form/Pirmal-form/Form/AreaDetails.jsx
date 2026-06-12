import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const AreaDetails = ({ isEdit, onNext, onBack }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    typeOfProperty: "",
    sanctionedArea: "",
    actualArea: "",
    finalAreaConsidered: "",
    overallBUA: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        typeOfProperty: isEdit.typeOfProperty || "",
        sanctionedArea: isEdit.sanctionedArea || "",
        actualArea: isEdit.actualArea || "",
        finalAreaConsidered: isEdit.finalAreaConsidered || "",
        overallBUA: isEdit.overallBUA || "",
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
    // console.log(formData, "Area Details Data");

    onNext(formData);
    toast.success("saved successfully!");
    // console.log("Submitted Data:", formData);
  };

  return (
    <div className='container mx-auto mt-2 px-4 '>
      <div
        className='flex justify-between items-center bg-[#365069] text-white px-4 py-3 rounded cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-lg font-semibold'>Area Details</h4>
        <button className='bg-white text-sm text-black px-3 py-1 rounded'>
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='bg-white border border-gray-300 mt-4 rounded p-4'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {[
              { label: "Type of Property", name: "typeOfProperty" },
              {
                label: "Sanctioned Area / Permissible",
                name: "sanctionedArea",
              },
              { label: "Actual Area", name: "actualArea" },
              { label: "Final Area Considered", name: "finalAreaConsidered" },
              {
                label: "Overall BUA Division wrt Permissible Area",
                name: "overallBUA",
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
                  placeholder={`Enter ${field.label}`}
                  className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-teal-500'
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
            >
              Next
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AreaDetails;
