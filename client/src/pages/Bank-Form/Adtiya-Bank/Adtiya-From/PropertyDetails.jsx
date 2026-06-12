import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const PropertyDetails = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize state with all the fields
  const [formData, setFormData] = useState({
    occupancy: "",
    occupiedBy: "",
    occupiedSince: "",
    occupantName: "",
    propertyDemarcated: "",
    propertyIdentification: "",
    identificationThrough: "",
    projectCategory: "",
    flatType: "",
    flatConfiguration: "",
    propertyHolding: "",
    typeOfStructure: "",
    plotArea: "",
    totalFloors: "",
    liftFacility: "",
    amenities: "",
    marketability: "",
    propertyView: "",
    parkingFacility: "",
    parkingType: "",
    constructionQuality: "",
    propertyShape: "",
    propertyPlacement: "",
    propertyExteriors: "",
    propertyInteriors: "",
    propertyAge: "",
    residualAge: "",
    ageSource: "",
    propertyMaintenance: "",
    cautiousLocation: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        occupancy: isEdit.occupancy || "",
        occupiedBy: isEdit.occupiedBy || "",
        occupiedSince: isEdit.occupiedSince || "",
        occupantName: isEdit.occupantName || "",
        propertyDemarcated: isEdit.propertyDemarcated || "",
        propertyIdentification: isEdit.propertyIdentification || "",
        identificationThrough: isEdit.identificationThrough || "",
        projectCategory: isEdit.projectCategory || "",
        flatType: isEdit.flatType || "",
        flatConfiguration: isEdit.flatConfiguration || "",
        propertyHolding: isEdit.propertyHolding || "",
        typeOfStructure: isEdit.typeOfStructure || "",
        plotArea: isEdit.plotArea || "",
        totalFloors: isEdit.totalFloors || "",
        liftFacility: isEdit.liftFacility || "",
        amenities: isEdit.amenities || "",
        marketability: isEdit.marketability || "",
        propertyView: isEdit.propertyView || "",
        parkingFacility: isEdit.parkingFacility || "",
        parkingType: isEdit.parkingType || "",
        constructionQuality: isEdit.constructionQuality || "",
        propertyShape: isEdit.propertyShape || "",
        propertyPlacement: isEdit.propertyPlacement || "",
        propertyExteriors: isEdit.propertyExteriors || "",
        propertyInteriors: isEdit.propertyInteriors || "",
        propertyAge: isEdit.propertyAge || "",
        residualAge: isEdit.residualAge || "",
        ageSource: isEdit.ageSource || "",
        propertyMaintenance: isEdit.propertyMaintenance || "",
        cautiousLocation: isEdit.cautiousLocation || "",
      });
    }
  }, [isEdit]);

  // Handle change in form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      // onDataChange(updatedData);  // Pass the updated data to parent component
      return updatedData;
    });
  };

  const handleNextClick = () => {
    onNext(formData);
    toast.success("Saved Successfully");
  };

  return (
    <div className='mb-4'>
      <div
        className='p-3 border rounded bg-gray-800 text-white cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex justify-between items-center'>
          <h4 className='m-0'>Property Details</h4>
          <button
            type='button'
            className='btn btn-light btn-sm text-sm py-1 px-2 bg-gray-200 text-black rounded'
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? "Close" : "Edit"}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className='p-3 border rounded mt-2 bg-gray-100'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Occupancy */}
            <div>
              <label className='block mb-1 font-medium'>Occupancy</label>
              <select
                className='w-full p-2 border rounded'
                name='occupancy'
                value={formData.occupancy}
                onChange={handleChange}
              >
                <option value='Occupied'>Occupied</option>
                <option value='Vacant'>Vacant</option>
              </select>
            </div>

            {/* Occupied By */}
            <div>
              <label className='block mb-1 font-medium'>Occupied By</label>
              <input
                type='text'
                className='w-full p-2 border rounded'
                name='occupiedBy'
                value={formData.occupiedBy}
                onChange={handleChange}
              />
            </div>

            {/* Occupied Since */}
            <div>
              <label className='block mb-1 font-medium'>Occupied Since</label>
              <input
                type='text'
                className='w-full p-2 border rounded'
                name='occupiedSince'
                value={formData.occupiedSince}
                onChange={handleChange}
              />
            </div>

            {/* Name of the Occupant */}
            <div>
              <label className='block mb-1 font-medium'>
                Name of the Occupant
              </label>
              <input
                type='text'
                className='w-full p-2 border rounded'
                name='occupantName'
                value={formData.occupantName}
                onChange={handleChange}
              />
            </div>

            {/* Property Demarcated */}
            <div>
              <label className='block mb-1 font-medium'>
                Property Demarcated
              </label>
              <select
                className='w-full p-2 border rounded'
                name='propertyDemarcated'
                value={formData.propertyDemarcated}
                onChange={handleChange}
              >
                <option value='Yes'>Yes</option>
                <option value='Partially'>Partially</option>
                <option value='No'>No</option>
              </select>
            </div>

            {/* Property Identification */}
            <div>
              <label className='block mb-1 font-medium'>
                Property Identification
              </label>
              <select
                className='w-full p-2 border rounded'
                name='propertyIdentification'
                value={formData.propertyIdentification}
                onChange={handleChange}
              >
                <option value='YES'>YES</option>
                <option value='NO'>NO</option>
              </select>
            </div>

            {/* Identification through */}
            <div>
              <label className='block mb-1 font-medium'>
                Identification through
              </label>
              <input
                type='text'
                className='w-full p-2 border rounded'
                name='identificationThrough'
                value={formData.identificationThrough}
                onChange={handleChange}
              />
            </div>

            {/* Project Category */}
            <div>
              <label className='block mb-1 font-medium'>Project Category</label>
              <select
                className='w-full p-2 border rounded'
                name='projectCategory'
                value={formData.projectCategory}
                onChange={handleChange}
              >
                <option value='A'>A</option>
                <option value='B'>B</option>
                <option value='C'>C</option>
                <option value='D'>D</option>
                <option value='A+'>A+</option>
                <option value='Not Applicable'>Not Applicable</option>
              </select>
            </div>

            {/* Flat Type */}
            <div>
              <label className='block mb-1 font-medium'>Flat Type</label>
              <select
                className='w-full p-2 border rounded'
                name='flatType'
                value={formData.flatType}
                onChange={handleChange}
              >
                <option value='Normal'>Normal</option>
                <option value='Duplex'>Duplex</option>
                <option value='Not applicable'>Not applicable</option>
              </select>
            </div>

            {/* Flat Configuration */}
            <div>
              <label className='block mb-1 font-medium'>
                Flat Configuration
              </label>
              <input
                type='text'
                className='w-full p-2 border rounded'
                name='flatConfiguration'
                value={formData.flatConfiguration}
                onChange={handleChange}
              />
            </div>

            {/* Property Holding */}
            <div>
              <label className='block mb-1 font-medium'>Property Holding</label>
              <select
                className='w-full p-2 border rounded'
                name='propertyHolding'
                value={formData.propertyHolding}
                onChange={handleChange}
              >
                <option value='Freehold'>Freehold</option>
                <option value='Leasehold'>Leasehold</option>
              </select>
            </div>

            {/* Type of Structure */}
            <div>
              <label className='block mb-1 font-medium'>
                Type of Structure
              </label>
              <input
                type='text'
                className='w-full p-2 border rounded'
                name='typeOfStructure'
                value={formData.typeOfStructure}
                onChange={handleChange}
              />
            </div>

            {/* Area of Plot */}
            <div>
              <label className='block mb-1 font-medium'>Area of PLOT</label>
              <input
                type='text'
                className='w-full p-2 border rounded'
                name='plotArea'
                value={formData.plotArea}
                onChange={handleChange}
              />
            </div>

            {/* Total No of Floors */}
            <div>
              <label className='block mb-1 font-medium'>
                Total No of Floors
              </label>
              <input
                type='text'
                className='w-full p-2 border rounded'
                name='totalFloors'
                value={formData.totalFloors}
                onChange={handleChange}
              />
            </div>

            {/* Lift Facility */}
            <div>
              <label className='block mb-1 font-medium'>Lift Facility</label>
              <select
                className='w-full p-2 border rounded'
                name='liftFacility'
                value={formData.liftFacility}
                onChange={handleChange}
              >
                <option value='YES'>YES</option>
                <option value='NO'>NO</option>
              </select>
            </div>

            {/* Amenities */}
            <div>
              <label className='block mb-1 font-medium'>Amenities</label>
              <select
                className='w-full p-2 border rounded'
                name='amenities'
                value={formData.amenities}
                onChange={handleChange}
              >
                <option value='Average'>Average</option>
                <option value='Excellent'>Excellent</option>
                <option value='Good'>Good</option>
                <option value='Low'>Low</option>
                <option value='NA'>NA</option>
              </select>
            </div>

            {/* Marketability */}
            <div>
              <label className='block mb-1 font-medium'>Marketability</label>
              <select
                className='w-full p-2 border rounded'
                name='marketability'
                value={formData.marketability}
                onChange={handleChange}
              >
                <option value='Average'>Average</option>
                <option value='Excellent'>Excellent</option>
                <option value='Good'>Good</option>
                <option value='Low'>Low</option>
              </select>
            </div>

            {/* View of the Property */}
            <div>
              <label className='block mb-1 font-medium'>
                View of the Property
              </label>
              <input
                type='text'
                className='w-full p-2 border rounded'
                name='propertyView'
                value={formData.propertyView}
                onChange={handleChange}
              />
            </div>

            {/* Parking Facility */}
            <div>
              <label className='block mb-1 font-medium'>Parking Facility</label>
              <select
                className='w-full p-2 border rounded'
                name='parkingFacility'
                value={formData.parkingFacility}
                onChange={handleChange}
              >
                <option value='YES'>YES</option>
                <option value='NO'>NO</option>
              </select>
            </div>

            {/* Type of Parking */}
            <div>
              <label className='block mb-1 font-medium'>Type of Parking</label>
              <select
                className='w-full p-2 border rounded'
                name='parkingType'
                value={formData.parkingType}
                onChange={handleChange}
              >
                <option value='Open CP'>Open CP</option>
                <option value='Dependent CP'>Dependent CP</option>
                <option value='Covered CP'>Covered CP</option>
                <option value='Mechanical CP'>Mechanical CP</option>
              </select>
            </div>

            {/* Quality of Construction */}
            <div>
              <label className='block mb-1 font-medium'>
                Quality of Construction
              </label>
              <select
                className='w-full p-2 border rounded'
                name='constructionQuality'
                value={formData.constructionQuality}
                onChange={handleChange}
              >
                <option value='Class A'>Class A</option>
                <option value='Class B'>Class B</option>
                <option value='Class C'>Class C</option>
                <option value='Class D'>Class D</option>
              </select>
            </div>

            {/* Shape of the Property */}
            <div>
              <label className='block mb-1 font-medium'>
                Shape of the Property
              </label>
              <select
                className='w-full p-2 border rounded'
                name='propertyShape'
                value={formData.propertyShape}
                onChange={handleChange}
              >
                <option value='Regular'>Regular</option>
                <option value='Irregular'>Irregular</option>
              </select>
            </div>

            {/* Placement of the Property */}
            <div>
              <label className='block mb-1 font-medium'>
                Placement of the Property
              </label>
              <select
                className='w-full p-2 border rounded'
                name='propertyPlacement'
                value={formData.propertyPlacement}
                onChange={handleChange}
              >
                <option value='NE Facing Corner Plot'>
                  NE Facing Corner Plot
                </option>
                <option value='Corner Plot'>Corner Plot</option>
                <option value='Intermittent Property'>
                  Intermittent Property
                </option>
                <option value='South Facing'>South Facing</option>
              </select>
            </div>

            {/* Exteriors of the Property */}
            <div>
              <label className='block mb-1 font-medium'>
                Exteriors of the Property
              </label>
              <select
                className='w-full p-2 border rounded'
                name='propertyExteriors'
                value={formData.propertyExteriors}
                onChange={handleChange}
              >
                <option value='Average'>Average</option>
                <option value='Poor'>Poor</option>
                <option value='Excellent'>Excellent</option>
                <option value='Good'>Good</option>
                <option value='Low'>Low</option>
              </select>
            </div>

            {/* Interiors of the Property */}
            <div>
              <label className='block mb-1 font-medium'>
                Interiors of the Property
              </label>
              <select
                className='w-full p-2 border rounded'
                name='propertyInteriors'
                value={formData.propertyInteriors}
                onChange={handleChange}
              >
                <option value='Average'>Average</option>
                <option value='Poor'>Poor</option>
                <option value='Excellent'>Excellent</option>
                <option value='Good'>Good</option>
                <option value='Low'>Low</option>
              </select>
            </div>

            {/* Age of the Property */}
            <div>
              <label className='block mb-1 font-medium'>
                Age of the Property (in Years)
              </label>
              <input
                type='number'
                className='w-full p-2 border rounded'
                name='propertyAge'
                value={formData.propertyAge}
                onChange={handleChange}
              />
            </div>

            {/* Residual Age */}
            <div>
              <label className='block mb-1 font-medium'>Residual Age</label>
              <input
                type='number'
                className='w-full p-2 border rounded'
                name='residualAge'
                value={formData.residualAge}
                onChange={handleChange}
              />
            </div>

            {/* Source of Age */}
            <div>
              <label className='block mb-1 font-medium'>Source of Age</label>
              <input
                type='text'
                className='w-full p-2 border rounded'
                name='ageSource'
                value={formData.ageSource}
                onChange={handleChange}
              />
            </div>

            {/* Property Maintenance */}
            <div>
              <label className='block mb-1 font-medium'>
                Property Maintenance
              </label>
              <select
                className='w-full p-2 border rounded'
                name='propertyMaintenance'
                value={formData.propertyMaintenance}
                onChange={handleChange}
              >
                <option value='Average'>Average</option>
                <option value='Good'>Good</option>
                <option value='Excellent'>Excellent</option>
                <option value='Low'>Low</option>
              </select>
            </div>

            {/* Cautious Location */}
            <div>
              <label className='block mb-1 font-medium'>
                Cautious Location
              </label>
              <input
                type='text'
                className='w-full p-2 border rounded'
                name='cautiousLocation'
                value={formData.cautiousLocation}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='text-right mt-2'>
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

export default PropertyDetails;
