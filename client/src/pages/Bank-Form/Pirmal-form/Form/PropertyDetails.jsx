import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PropertyDetails = ({ isEdit, extractedData, onNext, onBack }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    qualityOfConstruction: "",
    occupancyOfProperty: "",
    multiTenantedProperty: "",
    numberOfTenants: "",
    vacantSince: "",
    reasonForVacant: "",
    landAreaAsPerPlan: "",
    landAreaAsPerTitle: "",
    landAreaAsPerSite: "",
    residentialArea: "",
    commercialArea: "",
    typeOfPlot: "",
    finalLandArea: "",
  });

  // Initialize formData when editing or extracting
  useEffect(() => {
    setFormData((prev) => {
      let newData = { ...prev };

      if (isEdit) {
        newData = {
          ...newData,
          qualityOfConstruction: isEdit.qualityOfConstruction || "",
          occupancyOfProperty: isEdit.occupancyOfProperty || "",
          multiTenantedProperty: isEdit.multiTenantedProperty || "",
          numberOfTenants: isEdit.numberOfTenants || "",
          vacantSince: isEdit.vacantSince || "",
          reasonForVacant: isEdit.reasonForVacant || "",
          landAreaAsPerPlan: isEdit.landAreaAsPerPlan || "",
          landAreaAsPerTitle: isEdit.landAreaAsPerTitle || "",
          landAreaAsPerSite: isEdit.landAreaAsPerSite || "",
          residentialArea: isEdit.residentialArea || "",
          commercialArea: isEdit.commercialArea || "",
          typeOfPlot: isEdit.typeOfPlot || "",
          finalLandArea: isEdit.finalLandArea || "",
        };
      }

      if (extractedData && Object.keys(extractedData).length > 0) {
        const p = extractedData.property || {};
        const accom = p.accommodation_details || {};
        const propDet = p.property_details || {};
        const val = p.valuation_details || {};

        newData = {
          ...newData,
          qualityOfConstruction: accom.quality_of_construction || extractedData.qualityOfConstruction || newData.qualityOfConstruction,
          occupancyOfProperty: propDet.occupancy || extractedData.occupancyOfProperty || newData.occupancyOfProperty,
          multiTenantedProperty: propDet.multi_tenanted || extractedData.multiTenantedProperty || newData.multiTenantedProperty,
          numberOfTenants: propDet.no_of_tenants || extractedData.numberOfTenants || newData.numberOfTenants,
          vacantSince: propDet.vacant_since || extractedData.vacantSince || newData.vacantSince,
          landAreaAsPerPlan: val.plot_area_plan || extractedData.landAreaAsPerPlan || newData.landAreaAsPerPlan,
          landAreaAsPerTitle: val.plot_area_in_deed || extractedData.landAreaAsPerTitle || newData.landAreaAsPerTitle,
          landAreaAsPerSite: val.plot_area_physical || extractedData.landAreaAsPerSite || newData.landAreaAsPerSite,
          residentialArea: accom.residential_area || extractedData.residentialArea || newData.residentialArea,
          commercialArea: accom.commercial_area || extractedData.commercialArea || newData.commercialArea,
          typeOfPlot: p.property_type || extractedData.typeOfPlot || newData.typeOfPlot,
          finalLandArea: val.plot_area_physical || val.plot_area_in_deed || extractedData.finalLandArea || newData.finalLandArea,
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
    toast.success("saved successfully!");
  };

  return (
    <div className='container mx-auto mt-2 px-4 max-w-4xl'>
      <div
        className='flex justify-between items-center text-white p-4 rounded cursor-pointer bg-[#365069]'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='m-0 text-lg font-semibold'>Property Details</h4>
        <button className='bg-white text-black text-sm font-medium px-3 py-1 rounded'>
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='mt-4 bg-white shadow-md rounded p-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {[
              {
                label: "Occupancy of the Property",
                name: "occupancyOfProperty",
              },
              {
                label: "Number of Tenants",
                name: "numberOfTenants",
              },
              {
                label: "If Vacant, since how long",
                name: "vacantSince",
              },
              {
                label: "Reason for being vacant",
                name: "reasonForVacant",
              },
              {
                label: "Land/Plot Area as per plan",
                name: "landAreaAsPerPlan",
              },
              {
                label: "Land/Plot Area as per title documents",
                name: "landAreaAsPerTitle",
              },
              {
                label: "Land/Plot Area as per site",
                name: "landAreaAsPerSite",
              },
              {
                label: "Residential Area",
                name: "residentialArea",
              },
              {
                label: "Commercial Area",
                name: "commercialArea",
              },
              {
                label: "Type of Plot",
                name: "typeOfPlot",
              },
              {
                label: "Final Land area / UDS considered for valuation",
                name: "finalLandArea",
              },
            ].map((field, index) => (
              <div key={index}>
                <label className='block font-semibold mb-1'>
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
              <label className='block font-semibold mb-1'>
                Multi Tenanted Property:
              </label>
              <select
                name='multiTenantedProperty'
                value={formData.multiTenantedProperty}
                onChange={handleChange}
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
              className='bg-[#365069] text-white font-semibold px-6 py-2 rounded hover:bg-[#2c3f52] transition'
            >
              Next
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
