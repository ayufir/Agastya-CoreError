import React, { useState } from "react";
import toast from "react-hot-toast";

const AgencyName = ({ onNext }) => {
  const [formData, setFormData] = useState({
    agencyName: "AMERIYA ENGINEERING PVT. LTD.",
    fileNo: "SME000006389870",
    reportDate: "20.03.2023",
    applicantName: "SHRI SIDDHI VINAYAK CUSTOMER SERVICE POINT",
    contactPerson: "RATNESH PATEL",
    contactNo: "7879776849",
    loanType: "BLSE",
    personMet: "RATNESH PATEL",
    personContact: "7879776849",
    ownerName:
      "(1) MR. RAJNEESH PATEL S/O MR. INDRAKESHWAR PATEL (2) MR. RATNESH PATEL S/O MR. INDRAKESHWAR PATEL",
    documentsProvided: "SALE DEED NO. MP182542020A1914263 ON DATED 31.12.2020",

    postalAddress:
      "PROPERTY PART OF KH NO. 557/2, PH NO. 59, PATEL MOHALLA, MAUJA BARGI RNM SALICHOUKA, JABALPUR TEHSIL AND DIST JABALPUR MP-482051",
    locality: "PATEL MOHALLA",
    landmark: "NEAR BAMBAM HOTEL",
    distanceFromHub: "2-3 Km",
    legalAddress:
      "PROPERTY PART OF KH NO. 557/2, PH NO. 59, PATEL MOHALLA, MAUJA BARGI RNM SALICHOUKA, JABALPUR TEHSIL AND DIST JABALPUR MP-482051",
    addressMatching: "Yes",
    municipalBody: "NAGAR NIGAM",
    holdingType: "Freehold",
    marketability: "GOOD",
    propertyType: "RESIDENTIAL HOUSE",
    occupancyStatus: "SELF",
    distanceFromNH: "100 METER",
    scheduleLegalEast: "PLOT OF KISHORE CHOUKSEY",
    scheduleLegalWest: "SIDE ROAD",
    scheduleLegalNorth: "HOUSE OF BAMHNE JI",
    scheduleLegalSouth: "SIDE ROAD",
    scheduleSiteEast: "PLOT OF KISHORE CHOUKSEY",
    scheduleSiteWest: "KACCHA ROAD",
    scheduleSiteNorth: "HOUSE OF BAMHNE JI",
    scheduleSiteSouth: "15 FT ROAD",
    schedulePlanEast: "NA",
    schedulePlanWest: "NA",
    schedulePlanNorth: "NA",
    schedulePlanSouth: "NA",
    boundaryMatch: "MATCH",
    propertyIdentified: "YES",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);

    onNext(formData);
    toast.success("saved successfully");
  };

  return (
    <form
      className='p-5 bg-gray-100 rounded-lg shadow-md space-y-4'
      onSubmit={handleSubmit}
    >
      <h5 className='text-center text-xl font-semibold'>
        PROPERTY VALUATION REPORT
      </h5>

      {/* Agency Details */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Agency Name</label>
          <input
            type='text'
            name='agencyName'
            value={formData.agencyName}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>File No.</label>
          <input
            type='text'
            name='fileNo'
            value={formData.fileNo}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Report Date</label>
          <input
            type='text'
            name='reportDate'
            value={formData.reportDate}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
      </div>

      {/* Applicant Details */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Applicant Name</label>
          <input
            type='text'
            name='applicantName'
            value={formData.applicantName}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Contact Person</label>
          <input
            type='text'
            name='contactPerson'
            value={formData.contactPerson}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Contact No.</label>
          <input
            type='text'
            name='contactNo'
            value={formData.contactNo}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
      </div>

      {/* Loan Type and Meeting Details */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Loan Type</label>
          <input
            type='text'
            name='loanType'
            value={formData.loanType}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Person Met</label>
          <input
            type='text'
            name='personMet'
            value={formData.personMet}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Person Contact</label>
          <input
            type='text'
            name='personContact'
            value={formData.personContact}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
      </div>

      {/* Owner Details */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='flex flex-col col-span-3'>
          <label className='font-semibold text-sm mb-2'>Owner Name</label>
          <input
            type='text'
            name='ownerName'
            value={formData.ownerName}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
      </div>

      {/* Address Details */}
      <h6 className='font-semibold text-lg mt-4'>Address Details</h6>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='flex flex-col col-span-3'>
          <label className='font-semibold text-sm mb-2'>Postal Address</label>
          <textarea
            name='postalAddress'
            value={formData.postalAddress}
            onChange={handleChange}
            rows='2'
            className='p-2 border rounded-md'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Locality</label>
          <input
            type='text'
            name='locality'
            value={formData.locality}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Landmark</label>
          <input
            type='text'
            name='landmark'
            value={formData.landmark}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>
            Distance from Hub
          </label>
          <input
            type='text'
            name='distanceFromHub'
            value={formData.distanceFromHub}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Legal Address</label>
          <textarea
            name='legalAddress'
            value={formData.legalAddress}
            onChange={handleChange}
            rows='2'
            className='p-2 border rounded-md'
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Municipal Body</label>
          <input
            type='text'
            name='municipalBody'
            value={formData.municipalBody}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
        <div className='flex flex-col'>
          <label className='font-semibold text-sm mb-2'>Holding Type</label>
          <input
            type='text'
            name='holdingType'
            value={formData.holdingType}
            onChange={handleChange}
            className='p-2 border rounded-md'
          />
        </div>
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

export default AgencyName;
