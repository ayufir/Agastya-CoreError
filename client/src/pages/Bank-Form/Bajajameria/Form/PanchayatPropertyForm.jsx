import React, { useState } from "react";
import toast from "react-hot-toast";

const PanchayatPropertyForm = ({ onNext }) => {
  // const [formData, setFormData] = useState({
  //   approachRoad: '',
  //   surroundingDevelopment: '',
  //   distanceCityCentre: '',
  //   distanceCorpLimits: '',
  //   electricity: '',
  //   electricityDistributor: '',
  //   waterSupply: '',
  //   waterDistributor: '',
  //   sewerProvision: '',
  //   sewerLineConnected: '',
  //   demolitionThreat: '',
  //   latitude: '',
  //   longitude: '',
  //   agencyName: '',
  //   agencyCode: '',
  //   agencyLoginIP: '',
  //   agencyGeoLocation: '',
  //   agencyUsername: ''
  // });

  const [formData, setFormData] = useState({
    approachRoad: "15 feet wide concrete road",
    surroundingDevelopment: "Mixed residential and commercial area",
    distanceCityCentre: "5.2 km",
    distanceCorpLimits: "2.8 km",
    electricity: "Available",
    electricityDistributor: "State Electricity Board",
    waterSupply: "Municipal supply with overhead tank",
    waterDistributor: "City Water Authority",
    sewerProvision: "Underground sewer system",
    sewerLineConnected: "Yes",
    demolitionThreat: "No",
    latitude: "28.6139° N",
    longitude: "77.2090° E",
    agencyName: "Urban Property Assessors",
    agencyCode: "UPA-DL-042",
    agencyLoginIP: "192.168.4.42",
    agencyGeoLocation: "New Delhi Regional Office",
    agencyUsername: "surveyor_amit_sharma",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(formData);
    onNext(formData);
    // console.log("Form Data:", formData);
  };

  return (
    <div className='p-6 bg-white   mx-auto border-[1px] '>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h2 className='text-center text-xl font-semibold'>
          Additional Checks for Panchayat Properties
        </h2>

        <div className='grid grid-cols-2 gap-4'>
          <label className='flex flex-col'>
            Approach Road to the Property
            <input
              type='text'
              name='approachRoad'
              value={formData.approachRoad}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Development of Surrounding Areas
            <input
              type='text'
              name='surroundingDevelopment'
              value={formData.surroundingDevelopment}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Distance from City Centre (Km)
            <input
              type='number'
              name='distanceCityCentre'
              value={formData.distanceCityCentre}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Distance from Corporation Limits (Km)
            <input
              type='number'
              name='distanceCorpLimits'
              value={formData.distanceCorpLimits}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Electricity
            <input
              type='text'
              name='electricity'
              value={formData.electricity}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Electricity Distributor
            <input
              type='text'
              name='electricityDistributor'
              value={formData.electricityDistributor}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Water Supply
            <input
              type='text'
              name='waterSupply'
              value={formData.waterSupply}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Water Distributor
            <input
              type='text'
              name='waterDistributor'
              value={formData.waterDistributor}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Sewer Provision
            <input
              type='text'
              name='sewerProvision'
              value={formData.sewerProvision}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Sewer Line Connected to Main Sewer
            <input
              type='text'
              name='sewerLineConnected'
              value={formData.sewerLineConnected}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Demolition Threat
            <input
              type='text'
              name='demolitionThreat'
              value={formData.demolitionThreat}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Latitude
            <input
              type='text'
              name='latitude'
              value={formData.latitude}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Longitude
            <input
              type='text'
              name='longitude'
              value={formData.longitude}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>
        </div>

        <h2 className='text-xl font-bold pt-6'>Agency Details</h2>
        <div className='grid grid-cols-2 gap-4'>
          <label className='flex flex-col'>
            Agency Name
            <input
              type='text'
              name='agencyName'
              value={formData.agencyName}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Agency Code
            <input
              type='text'
              name='agencyCode'
              value={formData.agencyCode}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Agency Login IP
            <input
              type='text'
              name='agencyLoginIP'
              value={formData.agencyLoginIP}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Agency Geo-Location
            <input
              type='text'
              name='agencyGeoLocation'
              value={formData.agencyGeoLocation}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>

          <label className='flex flex-col'>
            Agency Username
            <input
              type='text'
              name='agencyUsername'
              value={formData.agencyUsername}
              onChange={handleChange}
              className='border p-2 rounded'
            />
          </label>
        </div>

        <div className='text-right mt-6'>
          <button
            type='submit'
            className='bg-blue-500 text-white py-2 px-4 rounded-md'
          >
            save and Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default PanchayatPropertyForm;
