import React, { useState } from "react";
import toast from "react-hot-toast";

const ApprovedPlanForm = ({ onNext }) => {
  // const [formData, setFormData] = useState({
  //   layoutPlanDetails: "",
  //   constructionPlanDetails: "",
  //   planValidity: "",
  //   approvedAuthority: "",
  //   approvedUsage: "",
  //   constructionQuality: "",
  //   noOfLifts: "",
  //   currentOccupant: "",
  //   accommodationDetails: "",
  //   floorLevel: "",
  //   noOfRooms: "",
  //   noOfKitchens: "",
  //   noOfBathrooms: "",
  //   noOfHalls: "",
  //   sanctionUsage: "",
  //   actualUsage: "",
  //   additionalStructures: "",
  //   eastWest: "",
  //   northSouth: "",
  //   landArea: "",
  // });

  const [formData, setFormData] = useState({
    layoutPlanDetails: "Approved layout plan with 2BHK flats",
    constructionPlanDetails: "RCC framed structure with brick masonry",
    planValidity: "2025-12-31",
    approvedAuthority: "City Development Authority",
    approvedUsage: "Residential",
    constructionQuality: "Good",
    noOfLifts: "2",
    currentOccupant: "Tenants",
    accommodationDetails: "4 flats per floor",
    floorLevel: "5",
    noOfRooms: "3",
    noOfKitchens: "1",
    noOfBathrooms: "2",
    noOfHalls: "1",
    sanctionUsage: "Residential",
    actualUsage: "Residential",
    additionalStructures: "Parking shed in basement",
    eastWest: "30 feet",
    northSouth: "40 feet",
    landArea: "1200 sq.ft.",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const renderInput = (label, name, type = "text") => (
    <div>
      <label className='block font-bold'>{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className='w-full border border-gray-300 p-2'
      />
    </div>
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
    toast.success("saved successfully");
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 p-4'>
      {/* Approved Plan Details */}
      <div className='text-center text-xl font-semibold'>
        Approved Plan Details
      </div>
      <div className='grid grid-cols-3 gap-4'>
        {renderInput("Layout Plan Details", "layoutPlanDetails")}
        {renderInput("Construction Plan Details", "constructionPlanDetails")}
        {renderInput("Plan Validity", "planValidity")}
        {renderInput("Approved Authority", "approvedAuthority")}
        {renderInput("Approved Usage", "approvedUsage")}
      </div>

      {/* Technical Details */}
      <div className='text-xl font-bold '>Technical Details</div>
      <div className='grid grid-cols-3 gap-4'>
        {renderInput("Construction Quality", "constructionQuality")}
        {renderInput("No. of Lifts", "noOfLifts", "number")}
        {renderInput("Current Occupant", "currentOccupant")}
        {renderInput("Accommodation Details", "accommodationDetails")}
      </div>

      {/* Built Up Area Details */}
      <div className='text-xl font-bold'>Built Up Area Details</div>
      <div className='grid grid-cols-4 gap-4'>
        {renderInput("Floor Level", "floorLevel")}
        {renderInput("No. of Rooms", "noOfRooms", "number")}
        {renderInput("No. of Kitchens", "noOfKitchens", "number")}
        {renderInput("No. of Bathrooms", "noOfBathrooms", "number")}
        {renderInput("No. of Halls", "noOfHalls", "number")}
        {renderInput("Sanction Usage", "sanctionUsage")}
        {renderInput("Actual Usage", "actualUsage")}
        {renderInput("Additional Structures", "additionalStructures")}
      </div>

      {/* Plot Area Details */}
      <div className='text-xl font-bold '>Plot Area Details</div>
      <div className='grid grid-cols-3 gap-4'>
        {renderInput("East to West", "eastWest")}
        {renderInput("North to South", "northSouth")}
        {renderInput("Land Area (in Sq feet)", "landArea", "number")}
      </div>

      {/* Submit Button */}
      <div className='text-right mt-6'>
        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded-md'
        >
          save and Next
        </button>
      </div>
    </form>
  );
};

export default ApprovedPlanForm;
