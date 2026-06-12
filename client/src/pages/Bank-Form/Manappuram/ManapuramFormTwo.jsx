import React, { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";

const ManapuramFormTwo = ({ isEdit, onDataChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    landComponentArea: "",
    landComponentRate: "",
    landComponentValue: "",
    landComponentPMARea: "",
    landComponentPMRRate: "",
    landComponentPMRValue: "",
    constructionComponentArea: "",
    constructionComponentRate: "",
    constructionComponentValue: "",
    totalValue: "",
    distressSaleValue: "",
    observations: ` `,
    propertyDescription: "",
    presentMarketValue: "",
    forcedSaleValue: "",
  });

  // Initialize formData when editing or extracting
  useEffect(() => {
    setFormData((prev) => {
      let newData = { ...prev };

      if (isEdit) {
        newData = {
          ...newData,
          landComponentArea: isEdit.landComponentArea || "",
          landComponentRate: isEdit.landComponentRate || "",
          landComponentValue: isEdit.landComponentValue || "",
          landComponentPMARea: isEdit.landComponentPMARea || "",
          landComponentPMRRate: isEdit.landComponentPMRRate || "",
          landComponentPMRValue: isEdit.landComponentPMRValue || "",
          constructionComponentArea: isEdit.constructionComponentArea || "",
          constructionComponentRate: isEdit.constructionComponentRate || "",
          constructionComponentValue: isEdit.constructionComponentValue || "",
          totalValue: isEdit.totalValue || "",
          distressSaleValue: isEdit.distressSaleValue || "",
          observations: isEdit.observations || ` `,
          propertyDescription: isEdit.propertyDescription || "",
          presentMarketValue: isEdit.presentMarketValue || "",
          forcedSaleValue: isEdit.forcedSaleValue || "",
        };
      }

      if (extractedData && Object.keys(extractedData).length > 0) {
        const p = extractedData.property || {};
        const val = p.valuation_details || {};

        newData = {
          ...newData,
          landComponentArea: val.plot_area_physical || val.plot_area_plan || val.plot_area_in_deed || newData.landComponentArea,
          landComponentRate: val.land_rate || val.plot_area_physical_rate || newData.landComponentRate,
          constructionComponentArea: val.carpet_area_measurement || val.carpet_area_plan || val.super_built_up_area || newData.constructionComponentArea,
          constructionComponentRate: val.construction_rate || newData.constructionComponentRate,
          totalValue: val.total_value || newData.totalValue,
          distressSaleValue: val.distress_value || newData.distressSaleValue,
          presentMarketValue: val.total_value || val.market_rate || newData.presentMarketValue,
          forcedSaleValue: val.distress_value || newData.forcedSaleValue,
        };
      }

      return newData;
    });
  }, [isEdit, extractedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDataChange(formData);
    toast.success("Saved Successfully");
  };

  return (
    <div className='mb-4 border rounded'>
      <div
        className='p-3 bg-[#30384B] text-white cursor-pointer flex justify-between items-center rounded'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='m-0 text-lg font-semibold'>MANIPURAM FORM TWO</h4>
        <button
          type='button'
          className='bg-white text-black text-sm px-3 py-1 rounded hover:bg-gray-200'
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='bg-gray-100 mt-2 p-4 rounded'>
          <h5 className='mt-4 mb-3 font-semibold'>
            Valuation by Adopting GLR (Guideline Rate)
          </h5>
          <div className='grid md:grid-cols-2 gap-4 mb-3'>
            <div>
              <label className='block mb-1 font-medium'>
                Land Component Area (sqft):
              </label>
              <input
                type='text'
                name='landComponentArea'
                className='w-full border px-3 py-2 rounded'
                value={formData.landComponentArea}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block mb-1 font-medium'>Rate (sqft):</label>
              <input
                type='text'
                name='landComponentRate'
                className='w-full border px-3 py-2 rounded'
                value={formData.landComponentRate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Land Component Value:
            </label>
            <input
              type='text'
              name='landComponentValue'
              className='w-full border px-3 py-2 rounded'
              value={formData.landComponentValue}
              onChange={handleChange}
            />
          </div>

          <h5 className='mt-4 mb-3 font-semibold'>
            Valuation by Adopting PMR (Prevailing Market Rate)
          </h5>
          <div className='grid md:grid-cols-2 gap-4 mb-3'>
            <div>
              <label className='block mb-1 font-medium'>
                Land Component Area (sqft):
              </label>
              <input
                type='text'
                name='landComponentPMARea'
                className='w-full border px-3 py-2 rounded'
                value={formData.landComponentPMARea}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block mb-1 font-medium'>Rate (sqft):</label>
              <input
                type='text'
                name='landComponentPMRRate'
                className='w-full border px-3 py-2 rounded'
                value={formData.landComponentPMRRate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Land Component Value:
            </label>
            <input
              type='text'
              name='landComponentPMRValue'
              className='w-full border px-3 py-2 rounded'
              value={formData.landComponentPMRValue}
              onChange={handleChange}
            />
          </div>

          <div className='grid md:grid-cols-2 gap-4 mb-3'>
            <div>
              <label className='block mb-1 font-medium'>
                Construction Component Area (sqft):
              </label>
              <input
                type='text'
                name='constructionComponentArea'
                className='w-full border px-3 py-2 rounded'
                value={formData.constructionComponentArea}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block mb-1 font-medium'>Rate (sqft):</label>
              <input
                type='text'
                name='constructionComponentRate'
                className='w-full border px-3 py-2 rounded'
                value={formData.constructionComponentRate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Construction Component Value:
            </label>
            <input
              type='text'
              name='constructionComponentValue'
              className='w-full border px-3 py-2 rounded'
              value={formData.constructionComponentValue}
              onChange={handleChange}
            />
          </div>

          <div className='mb-3'>
            <label className='block mb-1 font-medium'>Total Value (Rs.):</label>
            <input
              type='text'
              name='totalValue'
              className='w-full border px-3 py-2 rounded'
              value={formData.totalValue}
              onChange={handleChange}
            />
          </div>

          <h5 className='mt-4 mb-3 font-semibold'>
            Distress Sale Value of the Property
          </h5>
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Value on Sale in a Forcible/Distressed Condition:
            </label>
            <input
              type='text'
              name='distressSaleValue'
              className='w-full border px-3 py-2 rounded'
              value={formData.distressSaleValue}
              onChange={handleChange}
            />
          </div>

          <h5 className='mt-4 mb-3 font-semibold'>Observations</h5>
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>Observations:</label>
            <textarea
              name='observations'
              className='w-full border px-3 py-2 rounded'
              rows='6'
              value={formData.observations}
              onChange={handleChange}
            />
          </div>

          <h5 className='mt-4 mb-3 font-semibold'>Valuation of Properties</h5>
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Property Description:
            </label>
            <textarea
              name='propertyDescription'
              className='w-full border px-3 py-2 rounded'
              rows='3'
              value={formData.propertyDescription}
              onChange={handleChange}
            />
          </div>

          <div className='grid md:grid-cols-2 gap-4 mb-3'>
            <div>
              <label className='block mb-1 font-medium'>
                NAME OF APPLICANT:
              </label>
              <input
                type='text'
                name='nameOfApplicant'
                className='w-full border px-3 py-2 rounded'
                value={formData.nameOfApplicant}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block mb-1 font-medium'>
                Present Market Value:
              </label>
              <input
                type='text'
                name='presentMarketValue'
                className='w-full border px-3 py-2 rounded'
                value={formData.presentMarketValue}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block mb-1 font-medium'>
                Forced Sale Value:
              </label>
              <input
                type='text'
                name='forcedSaleValue'
                className='w-full border px-3 py-2 rounded'
                value={formData.forcedSaleValue}
                onChange={handleChange}
              />
            </div>
            {/* Submit Button */}
            <div className='flex justify-end'>
              <button
                style={{ background: "#30384B" }}
                type='submit'
                className='text-white px-4 py-2 rounded'
                onClick={handleSubmit}
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

export default ManapuramFormTwo;
