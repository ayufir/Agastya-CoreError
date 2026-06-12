import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const IndividualValuation = ({ isEdit, onNext, onBack }) => {
  const [isOpen, setIsOpen] = useState(true); // Accordion Toggle State
  const [formData, setFormData] = useState({
    caseType: "",
    houseDeliveryAgency: "",
    valuerVisit: "",
    valuationReportStatus: "",
    scopeOfValuation: "",
    contactPersonName: "",
    contactPersonNumber: "",
    relationshipWithApplicant: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        caseType: isEdit.caseType || "",
        houseDeliveryAgency: isEdit.houseDeliveryAgency || "",
        valuerVisit: isEdit.valuerVisit || "",
        valuationReportStatus: isEdit.valuationReportStatus || "",
        scopeOfValuation: isEdit.scopeOfValuation || "",
        contactPersonName: isEdit.contactPersonName || "",
        contactPersonNumber: isEdit.contactPersonNumber || "",
        relationshipWithApplicant: isEdit.relationshipWithApplicant || "",
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
    // Reset form fields after submission
    setFormData({
      caseType: "",
      houseDeliveryAgency: "",
      valuerVisit: "",
      valuationReportStatus: "",
      scopeOfValuation: "",
      contactPersonName: "",
      contactPersonNumber: "",
      relationshipWithApplicant: "",
    });

    toast.success("saved successfully!");
  };

  return (
    <div className='container mx-auto mt-2 px-4 '>
      {/* Accordion Header with Edit Button */}
      <div
        className={`flex justify-between items-center text-white p-3 rounded cursor-pointer bg-[#365069]`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='m-0 text-xl font-medium'>Individual Valuation Form</h4>
        <button className='bg-white text-[#365069] px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition'>
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {/* Accordion Content (Show/Hide on Click) */}
      <div className={`mt-3 ${isOpen ? "" : "hidden"}`}>
        <div className='bg-white rounded shadow p-6'>
          <form onSubmit={handleSubmit}>
            {[
              { label: "Case Type", name: "caseType" },
              { label: "House Delivery Agency", name: "houseDeliveryAgency" },
              {
                label: "Valuation Report Status",
                name: "valuationReportStatus",
              },
              { label: "Scope of Valuation", name: "scopeOfValuation" },
              {
                label: "Contact Person Name (Broker or Applicant)",
                name: "contactPersonName",
              },
              { label: "Contact Person Number", name: "contactPersonNumber" },
              {
                label: "Relationship with Applicant",
                name: "relationshipWithApplicant",
              },
            ].map((field, index) => (
              <div className='mb-4' key={index}>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {field.label}:
                </label>
                <input
                  type='text'
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#365069] focus:border-[#365069]'
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            ))}

            {/* Yes/No Select Dropdown for Valuer Visit */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Valuer visited this property any other FI:
              </label>
              <select
                name='valuerVisit'
                value={formData.valuerVisit}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#365069] focus:border-[#365069]'
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
              type='primary'
              htmlType='submit'
              // className="mt-4"
              className='bg-[#365069] text-white px-4 py-2 rounded font-bold hover:bg-[#2a4058] transition'
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IndividualValuation;
