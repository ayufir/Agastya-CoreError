import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const OtherDetails = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    frontAsPerPlan: "",
    frontActual: "",
    frontDeviation: "",
    frontRemarks: "",
    side1AsPerPlan: "",
    side1Actual: "",
    side1Deviation: "",
    side1Remarks: "",
    side2AsPerPlan: "",
    side2Actual: "",
    side2Deviation: "",
    side2Remarks: "",
    rearAsPerPlan: "",
    rearActual: "",
    rearDeviation: "",
    rearRemarks: "",
    totalValue: "",
    distressValue: "",
    insuranceValue: "",
    governmentValue: "",
    percentageCompletion: "",
    percentageRecommendation: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        frontAsPerPlan: isEdit.frontAsPerPlan || "",
        frontActual: isEdit.frontActual || "",
        frontDeviation: isEdit.frontDeviation || "",
        frontRemarks: isEdit.frontRemarks || "",
        side1AsPerPlan: isEdit.side1AsPerPlan || "",
        side1Actual: isEdit.side1Actual || "",
        side1Deviation: isEdit.side1Deviation || "",
        side1Remarks: isEdit.side1Remarks || "",
        side2AsPerPlan: isEdit.side2AsPerPlan || "",
        side2Actual: isEdit.side2Actual || "",
        side2Deviation: isEdit.side2Deviation || "",
        side2Remarks: isEdit.side2Remarks || "",
        rearAsPerPlan: isEdit.rearAsPerPlan || "",
        rearActual: isEdit.rearActual || "",
        rearDeviation: isEdit.rearDeviation || "",
        rearRemarks: isEdit.rearRemarks || "",
        totalValue: isEdit.totalValue || "",
        distressValue: isEdit.distressValue || "",
        insuranceValue: isEdit.insuranceValue || "",
        governmentValue: isEdit.governmentValue || "",
        percentageCompletion: isEdit.percentageCompletion || "",
        percentageRecommendation: isEdit.percentageRecommendation || "",
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

  const handleNextClick = () => {
    onNext(formData);
    toast.success("Saved Successfully");
  };

  return (
    <div className='mb-4 border border-gray-300 rounded'>
      <div
        className='p-4 bg-gray-800 cursor-pointer rounded-t flex justify-between items-center'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-white m-0 text-lg font-medium'>Other Details</h4>
        <button
          type='button'
          className='bg-white text-gray-800 text-sm px-3 py-1 rounded'
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='p-4 bg-gray-100 border-t'>
          <h5 className='mb-3 text-lg font-semibold'>Setbacks</h5>
          <div className='overflow-x-auto mb-4'>
            <table className='min-w-full text-sm border border-gray-300'>
              <thead className='bg-gray-200'>
                <tr>
                  <th className='border px-3 py-2 text-left'>Direction</th>
                  <th className='border px-3 py-2 text-left'>
                    As per plan/Bye laws
                  </th>
                  <th className='border px-3 py-2 text-left'>Actual at site</th>
                  <th className='border px-3 py-2 text-left'>Deviation</th>
                  <th className='border px-3 py-2 text-left'>
                    Remarks, if any
                  </th>
                </tr>
              </thead>
              <tbody>
                {["front", "side1", "side2", "rear"].map((dir) => (
                  <tr key={dir}>
                    <td className='border px-3 py-2 capitalize'>
                      {dir === "side1"
                        ? "Side1 (Left)"
                        : dir === "side2"
                        ? "Side2 (Right)"
                        : dir.charAt(0).toUpperCase() + dir.slice(1)}
                    </td>
                    <td className='border px-3 py-2'>
                      <input
                        type='text'
                        className='w-full border border-gray-300 px-2 py-1 rounded'
                        name={`${dir}AsPerPlan`}
                        value={formData[`${dir}AsPerPlan`]}
                        onChange={handleChange}
                      />
                    </td>
                    <td className='border px-3 py-2'>
                      <input
                        type='text'
                        className='w-full border border-gray-300 px-2 py-1 rounded'
                        name={`${dir}Actual`}
                        value={formData[`${dir}Actual`]}
                        onChange={handleChange}
                      />
                    </td>
                    <td className='border px-3 py-2'>
                      <input
                        type='text'
                        className='w-full border border-gray-300 px-2 py-1 rounded'
                        name={`${dir}Deviation`}
                        value={formData[`${dir}Deviation`]}
                        onChange={handleChange}
                      />
                    </td>
                    <td className='border px-3 py-2'>
                      <input
                        type='text'
                        className='w-full border border-gray-300 px-2 py-1 rounded'
                        name={`${dir}Remarks`}
                        value={formData[`${dir}Remarks`]}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <div>
              <label className='block mb-1 font-medium'>Total Value</label>
              <input
                type='number'
                className='w-full border border-gray-300 px-2 py-1 rounded'
                name='totalValue'
                value={formData.totalValue}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block mb-1 font-medium'>
                Distress Value (80%)
              </label>
              <input
                type='number'
                className='w-full border border-gray-300 px-2 py-1 rounded'
                name='distressValue'
                value={formData.distressValue}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block mb-1 font-medium'>Insurance Value</label>
              <input
                type='number'
                className='w-full border border-gray-300 px-2 py-1 rounded'
                name='insuranceValue'
                value={formData.insuranceValue}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='md:col-span-1'>
              <label className='block mb-1 font-medium'>Government Value</label>
              <input
                type='number'
                className='w-full border border-gray-300 px-2 py-1 rounded'
                name='governmentValue'
                value={formData.governmentValue}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block mb-1 font-medium'>
                Percentage Completion
              </label>
              <input
                type='text'
                className='w-full border border-gray-300 px-2 py-1 rounded'
                name='percentageCompletion'
                value={formData.percentageCompletion}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block mb-1 font-medium'>
                Percentage Recommendation
              </label>
              <input
                type='text'
                className='w-full border border-gray-300 px-2 py-1 rounded'
                name='percentageRecommendation'
                value={formData.percentageRecommendation}
                onChange={handleChange}
              />
            </div>

            <div className=''>
              <button
                onClick={handleNextClick}
                className='bg-[#1E2939]  text-white font-semibold px-6 py-2 rounded'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherDetails;
