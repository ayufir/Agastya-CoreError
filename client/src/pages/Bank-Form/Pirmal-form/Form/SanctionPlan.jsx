import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const SanctionPlan = ({ isEdit, onNext, onBack }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    usageAsPerMasterPlan: "",
    usageApprovedAsPerPlan: "",
    currentUsage: "",
    propertyLimits: "",
    plotWithinMunicipalLimit: "",
    underDemolitionList: "",
    planApprovedBy: "",
    planDetails: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        usageAsPerMasterPlan: isEdit.usageAsPerMasterPlan || "",
        usageApprovedAsPerPlan: isEdit.usageApprovedAsPerPlan || "",
        currentUsage: isEdit.currentUsage || "",
        propertyLimits: isEdit.propertyLimits || "",
        plotWithinMunicipalLimit: isEdit.plotWithinMunicipalLimit || "",
        underDemolitionList: isEdit.underDemolitionList || "",
        planApprovedBy: isEdit.planApprovedBy || "",
        planDetails: isEdit.planDetails || "",
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
    onNext(formData);
    // console.log("Submitted Data:", formData);
    setFormData({
      usageAsPerMasterPlan: "",
      usageApprovedAsPerPlan: "",
      currentUsage: "",
      propertyLimits: "",
      plotWithinMunicipalLimit: "",
      underDemolitionList: "",
      planApprovedBy: "",
      planDetails: "",
    });
    toast.success("saved successfully!");
  };

  return (
    <div className='max-w-4xl mx-auto mt-4 px-4'>
      <div
        className='flex justify-between items-center text-white p-4 rounded cursor-pointer'
        style={{ backgroundColor: "#365069" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-lg font-semibold'>
          Sanction Plan Approval & Other Document Details
        </h4>
        <button className='bg-white text-gray-800 px-3 py-1 rounded text-sm font-medium'>
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='mt-4 bg-white p-6 rounded shadow'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {[
              {
                label: "Usage as per CDP/Master Plan",
                name: "usageAsPerMasterPlan",
              },
              {
                label: "Usage Approved as per Plan",
                name: "usageApprovedAsPerPlan",
              },
              { label: "Current Usage", name: "currentUsage" },
              {
                label: "Property Coming Under Which Limits",
                name: "propertyLimits",
              },
              { label: "Plan Approved By", name: "planApprovedBy" },
              { label: "Plan Details (Numbers & Date)", name: "planDetails" },
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

            <div>
              <label className='block font-semibold text-gray-700 mb-1'>
                Plot Within Municipal Limit:
              </label>
              <select
                name='plotWithinMunicipalLimit'
                value={formData.plotWithinMunicipalLimit}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Select</option>
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </select>
            </div>

            <div>
              <label className='block font-semibold text-gray-700 mb-1'>
                Under Demolition List:
              </label>
              <select
                name='underDemolitionList'
                value={formData.underDemolitionList}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Select</option>
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </select>
            </div>
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

export default SanctionPlan;
