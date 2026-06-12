import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const NdmaParameters = ({ isEdit, onNext, onBack }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    natureOfBuilding: "",
    typeOfStructure: "",
    functionOfUse: "",
    heightOfBuilding: "",
    typeOfFoundation: "",
    horizontalFloorType: "",
    concreteGrade: "",
    steelGrade: "",
    seismicZone: "",
    soilSlopeLandslide: "",
    floodProneArea: "",
    urbanFloods: "",
    environmentExposure: "",
    tsunami: "",
    windCyclones: "",
    coastalRegulatoryZone: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        natureOfBuilding: isEdit.natureOfBuilding || "",
        typeOfStructure: isEdit.typeOfStructure || "",
        functionOfUse: isEdit.functionOfUse || "",
        heightOfBuilding: isEdit.heightOfBuilding || "",
        typeOfFoundation: isEdit.typeOfFoundation || "",
        horizontalFloorType: isEdit.horizontalFloorType || "",
        concreteGrade: isEdit.concreteGrade || "",
        steelGrade: isEdit.steelGrade || "",
        seismicZone: isEdit.seismicZone || "",
        soilSlopeLandslide: isEdit.soilSlopeLandslide || "",
        floodProneArea: isEdit.floodProneArea || "",
        urbanFloods: isEdit.urbanFloods || "",
        environmentExposure: isEdit.environmentExposure || "",
        tsunami: isEdit.tsunami || "",
        windCyclones: isEdit.windCyclones || "",
        coastalRegulatoryZone: isEdit.coastalRegulatoryZone || "",
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
    // console.log("Submitted NDMA Data:", formData);
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
        <h4 className='text-lg font-semibold'>NDMA Parameters</h4>
        <button className='bg-white text-sm text-black px-3 py-1 rounded'>
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='bg-white border border-gray-300 mt-4 rounded p-4'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {[
              {
                label: "Nature of Building/Wing/ Tower",
                name: "natureOfBuilding",
              },
              { label: "Type of Structure", name: "typeOfStructure" },
              { label: "Function of Use", name: "functionOfUse" },
              {
                label: "Height of Building above ground level",
                name: "heightOfBuilding",
              },
              { label: "Type of Foundation", name: "typeOfFoundation" },
              { label: "Horizontal Floor type", name: "horizontalFloorType" },
              { label: "Concrete Grade", name: "concreteGrade" },
              { label: "Steel Grade", name: "steelGrade" },
              { label: "Seismic Zone", name: "seismicZone" },
              {
                label: "Soil slope vulnerable to landslide",
                name: "soilSlopeLandslide",
              },
              { label: "Urban Floods", name: "urbanFloods" },
              {
                label: "Environment Exposure Condition",
                name: "environmentExposure",
              },
              { label: "Wind/Cyclones", name: "windCyclones" },
              {
                label: "Coastal Regulatory Zone",
                name: "coastalRegulatoryZone",
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
                  className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500'
                />
              </div>
            ))}

            <div>
              <label className='block font-medium text-gray-700 mb-1'>
                Flood Prone Area:
              </label>
              <select
                name='floodProneArea'
                value={formData.floodProneArea}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring focus:border-blue-500'
              >
                <option value=''>Select</option>
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </select>
            </div>

            <div>
              <label className='block font-medium text-gray-700 mb-1'>
                Tsunami:
              </label>
              <select
                name='tsunami'
                value={formData.tsunami}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring focus:border-blue-500'
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

export default NdmaParameters;
