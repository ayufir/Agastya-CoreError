import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Boundaries = ({ isEdit, extractedData, onNext, onBack }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    east: "",
    west: "",
    north: "",
    south: "",
    boundariesMatching: "",
    remarks: "",
    propertyIdentifiedThrough: "",
    propertyDemarcated: "",
    demarcationType: "",
  });

  // Initialize formData when editing or extracting
  useEffect(() => {
    setFormData((prev) => {
      let newData = { ...prev };

      if (isEdit) {
        newData = {
          ...newData,
          east: isEdit.east || "",
          west: isEdit.west || "",
          north: isEdit.north || "",
          south: isEdit.south || "",
          boundariesMatching: isEdit.boundariesMatching || "",
          remarks: isEdit.remarks || "",
          propertyIdentifiedThrough: isEdit.propertyIdentifiedThrough || "",
          propertyDemarcated: isEdit.propertyDemarcated || "",
          demarcationType: isEdit.demarcationType || "",
        };
      }

      if (extractedData && Object.keys(extractedData).length > 0) {
        const p = extractedData.property || {};
        const bounds = p.boundaries || {};
        const propDet = p.property_details || {};

        newData = {
          ...newData,
          east: bounds.east_actual || bounds.east_as_per_deed || extractedData.east || newData.east,
          west: bounds.west_actual || bounds.west_as_per_deed || extractedData.west || newData.west,
          north: bounds.north_actual || bounds.north_as_per_deed || extractedData.north || newData.north,
          south: bounds.south_actual || bounds.south_as_per_deed || extractedData.south || newData.south,
          boundariesMatching: extractedData.boundariesMatching || newData.boundariesMatching,
          propertyIdentifiedThrough: propDet.property_identification || extractedData.propertyIdentifiedThrough || newData.propertyIdentifiedThrough,
          propertyDemarcated: propDet.property_demarcated || extractedData.propertyDemarcated || newData.propertyDemarcated,
        };
      }

      return newData;
    });
  }, [isEdit, extractedData]);

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
      east: "",
      west: "",
      north: "",
      south: "",
      boundariesMatching: "",
      remarks: "",
      propertyIdentifiedThrough: "",
      propertyDemarcated: "",
      demarcationType: "",
    });
    toast.success("saved successfully!");
  };

  return (
    <div className='container mx-auto mt-2 px-4 '>
      <div
        className='flex justify-between items-center text-white p-3 rounded-md cursor-pointer bg-[#365069]'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='m-0 text-lg font-semibold'>Boundaries Information</h4>
        <button className='px-3 py-1 bg-white text-[#365069] rounded text-sm font-medium hover:bg-gray-100'>
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      <div className={`mt-3 ${isOpen ? "" : "hidden"}`}>
        <div className='bg-white rounded-md shadow-sm'>
          <div className='p-4'>
            <form onSubmit={handleSubmit}>
              {[
                { label: "East", name: "east" },
                { label: "West", name: "west" },
                { label: "North", name: "north" },
                { label: "South", name: "south" },
                { label: "Remarks if any", name: "remarks" },
                {
                  label: "Property Identified Through",
                  name: "propertyIdentifiedThrough",
                },
                { label: "If demarcated, type", name: "demarcationType" },
              ].map((field, index) => (
                <div className='mb-4' key={index}>
                  <label className='block text-sm font-semibold mb-1'>
                    {field.label}:
                  </label>
                  <input
                    type='text'
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#365069]'
                    placeholder={`Enter ${field.label}`}
                  />
                </div>
              ))}

              {/* Boundaries Matching - Yes/No Select Option */}
              <div className='mb-4'>
                <label className='block text-sm font-semibold mb-1'>
                  Boundaries Matching:
                </label>
                <select
                  name='boundariesMatching'
                  value={formData.boundariesMatching}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#365069]'
                >
                  <option value=''>Select</option>
                  <option value='Yes'>Yes</option>
                  <option value='No'>No</option>
                </select>
              </div>

              {/* Property Demarcated - Yes/No Select Option */}
              <div className='mb-4'>
                <label className='block text-sm font-semibold mb-1'>
                  Property Demarcated:
                </label>
                <select
                  name='propertyDemarcated'
                  value={formData.propertyDemarcated}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#365069]'
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
                className='px-4 py-2 bg-[#365069] text-white font-bold rounded-md hover:bg-[#2a4058]'
              >
                Next
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boundaries;
