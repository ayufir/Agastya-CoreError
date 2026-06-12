import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const LocationDetails = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(true);

  const [formData, setFormData] = useState({
    propertyAddressTRF: "",
    propertyAddressVisit: "",
    propertyAddressDocs: "",
    mainLocality: "",
    subLocality: "",
    microLocation: "",
    landmark: "",
    latitude: "",
    longitude: "",
    propertyType: "",
    currentUsage: "",
    previousValuation: "",
    previousValuationDate: "",
    propertySubType: "",
    locality: "",
    propertyFallingWithin: "",
    occupancyLevel: "",
    siteCondition: "",
    distanceRailway: "",
    distanceBusStop: "",
    distanceMainRoad: "",
    distanceCityCentre: "",
    distanceABFLBranch: "",
    approachRoadWidth: "",
    propertyDimensions: "",
    naField: "",
    depthInFeet: "",
    physicalApproach: "",
    legalApproach: "",
    otherFeatures: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        propertyAddressTRF: isEdit.propertyAddressTRF || "",
        propertyAddressVisit: isEdit.propertyAddressVisit || "",
        propertyAddressDocs: isEdit.propertyAddressDocs || "",
        mainLocality: isEdit.mainLocality || "",
        subLocality: isEdit.subLocality || "",
        microLocation: isEdit.microLocation || "",
        landmark: isEdit.landmark || "",
        latitude: isEdit.latitude || "",
        longitude: isEdit.longitude || "",
        propertyType: isEdit.propertyType || "",
        currentUsage: isEdit.currentUsage || "",
        previousValuation: isEdit.previousValuation || "",
        previousValuationDate: isEdit.previousValuationDate || "",
        propertySubType: isEdit.propertySubType || "",
        locality: isEdit.locality || "",
        propertyFallingWithin: isEdit.propertyFallingWithin || "",
        occupancyLevel: isEdit.occupancyLevel || "",
        siteCondition: isEdit.siteCondition || "",
        distanceRailway: isEdit.distanceRailway || "",
        distanceBusStop: isEdit.distanceBusStop || "",
        distanceMainRoad: isEdit.distanceMainRoad || "",
        distanceCityCentre: isEdit.distanceCityCentre || "",
        distanceABFLBranch: isEdit.distanceABFLBranch || "",
        approachRoadWidth: isEdit.approachRoadWidth || "",
        propertyDimensions: isEdit.propertyDimensions || "",
        naField: isEdit.naField || "",
        depthInFeet: isEdit.depthInFeet || "",
        physicalApproach: isEdit.physicalApproach || "",
        legalApproach: isEdit.legalApproach || "",
        otherFeatures: isEdit.otherFeatures || "",
      });
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextClick = () => {
    onNext(formData);
    toast.success("Saved Successfully");
  };

  // Reusable input field component
  const InputField = ({ label, name, value, onChange }) => (
    <div>
      <label className='block mb-1 font-medium'>{label}</label>
      <input
        type='text'
        name={name}
        value={value}
        onChange={onChange}
        className='w-full border rounded px-3 py-2'
      />
    </div>
  );

  // Reusable select field component
  const SelectField = ({ label, name, value, onChange, options }) => (
    <div>
      <label className='block mb-1 font-medium'>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className='w-full border rounded px-3 py-2 bg-white'
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className='mb-6 border rounded shadow-sm'>
      <div
        className='flex justify-between items-center px-4 py-3 bg-gray-800 text-white rounded-t cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-lg font-semibold'>Location Details</h4>
        <button
          type='button'
          className='bg-white text-sm text-gray-800 px-3 py-1 rounded hover:bg-gray-100'
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='bg-gray-50 p-6 rounded-b space-y-5'>
          {/* Address Fields */}
          <div>
            <label className='block mb-1 font-medium'>
              Property Address as Per TRF
            </label>
            <textarea
              name='propertyAddressTRF'
              rows='3'
              className='w-full border rounded px-3 py-2'
              value={formData.propertyAddressTRF}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className='block mb-1 font-medium'>
              Property Address as Per Visit
            </label>
            <textarea
              name='propertyAddressVisit'
              rows='3'
              className='w-full border rounded px-3 py-2'
              value={formData.propertyAddressVisit}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className='block mb-1 font-medium'>
              Property Address as Per Docs
            </label>
            <textarea
              name='propertyAddressDocs'
              rows='3'
              className='w-full border rounded px-3 py-2'
              value={formData.propertyAddressDocs}
              onChange={handleChange}
            />
          </div>

          {/* Location Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <InputField
              label='Main Locality'
              name='mainLocality'
              value={formData.mainLocality}
              onChange={handleChange}
            />
            <InputField
              label='Sub Locality'
              name='subLocality'
              value={formData.subLocality}
              onChange={handleChange}
            />
            <InputField
              label='Micro Location'
              name='microLocation'
              value={formData.microLocation}
              onChange={handleChange}
            />
            <InputField
              label='Landmark'
              name='landmark'
              value={formData.landmark}
              onChange={handleChange}
            />
            <InputField
              label='Latitude'
              name='latitude'
              value={formData.latitude}
              onChange={handleChange}
            />
            <InputField
              label='Longitude'
              name='longitude'
              value={formData.longitude}
              onChange={handleChange}
            />
          </div>

          {/* Property Type and Usage */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <SelectField
              label='Type of Property'
              name='propertyType'
              value={formData.propertyType}
              onChange={handleChange}
              options={[
                "RESIDENTIAL",
                "COMMERCIAL",
                "INDUSTRIAL",
                "INSTITUTIONAL",
                "AGRICULTURE",
              ]}
            />
            <SelectField
              label='Current Usage'
              name='currentUsage'
              value={formData.currentUsage}
              onChange={handleChange}
              options={[
                "RESIDENTIAL",
                "COMMERCIAL",
                "INDUSTRIAL",
                "INSTITUTIONAL",
                "AGRICULTURE",
              ]}
            />
            <SelectField
              label='Previous Valuation Done?'
              name='previousValuation'
              value={formData.previousValuation}
              onChange={handleChange}
              options={["Yes", "No"]}
            />
            <InputField
              label='If yes, when'
              name='previousValuationDate'
              value={formData.previousValuationDate}
              onChange={handleChange}
            />
          </div>

          {/* Property Sub Type and Locality */}
          <InputField
            label='Property Sub Type'
            name='propertySubType'
            value={formData.propertySubType}
            onChange={handleChange}
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <SelectField
              label='Locality'
              name='locality'
              value={formData.locality}
              onChange={handleChange}
              options={[
                "Well Developed",
                "Developing",
                "Under Develop",
                "Slum",
              ]}
            />
            <SelectField
              label='Property Falling Within'
              name='propertyFallingWithin'
              value={formData.propertyFallingWithin}
              onChange={handleChange}
              options={[
                "Municipal Corporation",
                "Gram Panchayat",
                "Town Planning Authority",
                "Development Authority",
                "Municipality",
              ]}
            />
          </div>

          {/* Occupancy, Site Condition, Distances */}
          <SelectField
            label='Occupancy Level of the Surrounding'
            name='occupancyLevel'
            value={formData.occupancyLevel}
            onChange={handleChange}
            options={[
              "Densely Populated",
              "Moderately Populated",
              "Low Population density",
            ]}
          />
          <SelectField
            label='Condition of the Site of the Property'
            name='siteCondition'
            value={formData.siteCondition}
            onChange={handleChange}
            options={["Well Developed", "Developing", "Under Developed"]}
          />
          <InputField
            label='Distance to Railway/Metro Station'
            name='distanceRailway'
            value={formData.distanceRailway}
            onChange={handleChange}
          />
          <InputField
            label='Distance to Bus Stop'
            name='distanceBusStop'
            value={formData.distanceBusStop}
            onChange={handleChange}
          />

          {/* Approach and Distance Fields */}
          <SelectField
            label='Distance of Plot from Main Road'
            name='distanceMainRoad'
            value={formData.distanceMainRoad}
            onChange={handleChange}
            options={[
              "Not Applicable (Prop on Mid Road)",
              "Less than 200 m",
              "200 to 500 m",
              "above 500 m",
            ]}
          />
          <InputField
            label='Distance from City Centre'
            name='distanceCityCentre'
            value={formData.distanceCityCentre}
            onChange={handleChange}
          />
          <InputField
            label='Distance from ABFL Branch'
            name='distanceABFLBranch'
            value={formData.distanceABFLBranch}
            onChange={handleChange}
          />
          <SelectField
            label='Width of the Approach Road'
            name='approachRoadWidth'
            value={formData.approachRoadWidth}
            onChange={handleChange}
            options={[
              "Width 40 ft.",
              "Width 20 to 40 ft.",
              "Clear width 10ft",
              "Mud Road",
              "Illegal Road (Without document)",
            ]}
          />

          {/* Property Dimensions and NA */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <InputField
              label='Dimensions of the Property'
              name='propertyDimensions'
              value={formData.propertyDimensions}
              onChange={handleChange}
            />
            <InputField
              label='NA'
              name='naField'
              value={formData.naField}
              onChange={handleChange}
            />
            <InputField
              label='Depth in Feet'
              name='depthInFeet'
              value={formData.depthInFeet}
              onChange={handleChange}
            />
          </div>

          {/* Physical and Legal Approach */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <SelectField
              label='Physical Approach to the Property'
              name='physicalApproach'
              value={formData.physicalApproach}
              onChange={handleChange}
              options={["Clear", "Partially Clear", "Not Clear"]}
            />
            <SelectField
              label='Legal Approach to the Property'
              name='legalApproach'
              value={formData.legalApproach}
              onChange={handleChange}
              options={["Clear", "Partially Clear", "Not Clear"]}
            />
          </div>

          {/* Additional Features */}
          <SelectField
            label='Any other features like board of other financier indicating mortgage, notice of Court/any authority which may affect the security'
            name='otherFeatures'
            value={formData.otherFeatures}
            onChange={handleChange}
            options={["YES", "NO"]}
          />

          {/* Next button */}
          <div className='text-right pt-4'>
            <button
              onClick={handleNextClick}
              className='bg-[#1E2939]  text-white font-semibold px-6 py-2 rounded'
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDetails;
