import React, { useState } from "react";
import toast from "react-hot-toast";

const StageConstruction = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    percentageCompleted: 100,
    surroundingDevelopment: 40,
    plinth: false,
    rccAboveGround: false,
    brickwork: false,
    internalPlaster: false,
    externalPlaster: false,
    flooring: false,
    plumbingElectricWork: false,
    doorWindowPaint: false,
    finishingPossession: false,
    totalCompletion: false,
    remarks: "",
    propertyImage: null,
    map: null,
    plan: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);
    onNext(formData);
    toast.success("saved successfully");
  };

  return (
    <div className='container mx-auto mt-4 px-4'>
      {/* Header */}
      <div
        className='p-4 bg-gray-800 text-white rounded cursor-pointer flex justify-between items-center'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-lg font-semibold'>TRANCHE 1</h4>
        <button
          type='button'
          className='bg-white text-gray-800 px-3 py-1 text-sm rounded'
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {/* Form Section */}
      {isOpen && (
        <div className='bg-white border rounded p-4 mt-2 space-y-4'>
          <div>
            <label className='block mb-1 font-medium'>
              Percentage of property completed *
            </label>
            <input
              type='number'
              name='percentageCompleted'
              value={formData.percentageCompleted}
              onChange={handleChange}
              min='0'
              max='100'
              className='w-full border border-gray-300 p-2 rounded'
            />
          </div>

          <div>
            <label className='block mb-1 font-medium'>
              Surrounding development details in % *
            </label>
            <input
              type='number'
              name='surroundingDevelopment'
              value={formData.surroundingDevelopment}
              onChange={handleChange}
              min='0'
              max='100'
              className='w-full border border-gray-300 p-2 rounded'
            />
          </div>

          {/* Activity Completed Checkboxes */}
          <div>
            <label className='block mb-2 font-medium'>ACTIVITY COMPLETED</label>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Left Column */}
              <div className='space-y-2'>
                {[
                  "plinth",
                  "rccAboveGround",
                  "brickwork",
                  "internalPlaster",
                  "externalPlaster",
                ].map((field) => (
                  <div key={field} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      name={field}
                      checked={formData[field]}
                      onChange={handleChange}
                      className='w-4 h-4'
                    />
                    <label className='capitalize'>
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className='space-y-2'>
                {[
                  "flooring",
                  "plumbingElectricWork",
                  "doorWindowPaint",
                  "finishingPossession",
                  "totalCompletion",
                ].map((field) => (
                  <div key={field} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      name={field}
                      checked={formData[field]}
                      onChange={handleChange}
                      className='w-4 h-4'
                    />
                    <label className='capitalize'>
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className='block mb-1 font-medium'>Remarks</label>
            <textarea
              name='remarks'
              value={formData.remarks}
              onChange={handleChange}
              className='w-full border border-gray-300 p-2 rounded'
            />
          </div>

          {/* File Inputs */}
          {[
            {
              name: "propertyImage",
              label: "Property image and Guideline value upload document *",
            },
            { name: "map", label: "Upload Map" },
            { name: "plan", label: "Upload Plan" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className='block mb-1 font-medium'>{label}</label>
              <div className='flex items-center gap-3'>
                <input
                  type='file'
                  name={name}
                  onChange={handleChange}
                  className='border border-gray-300 rounded px-2 py-1'
                />
                {formData[name] && (
                  <button
                    className='text-blue-600 underline text-sm'
                    type='button'
                  >
                    Preview
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className='text-right'>
            <button
              type='submit'
              onClick={handleSubmit}
              className='bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700'
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StageConstruction;
