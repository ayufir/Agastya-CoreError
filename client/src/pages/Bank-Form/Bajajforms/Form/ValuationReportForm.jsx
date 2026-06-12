import React, { useState } from "react";
import toast from "react-hot-toast";

const ValuationReportForm = ({ onNext }) => {
  // const [formData, setFormData] = useState({
  //     fileNo: '',
  //     dateOfReport: '',
  //     applicantName: '',
  //     contactPerson: '',
  //     loanType: '',
  //     personMet: '',
  //     propertyOwner: '',
  //     documentsProvided: '',
  //     addressSite: '',
  //     localityName: '',
  //     landmark: '',
  //     distanceFromCity: '',
  //     latLong: '',
  //     addressInitiation: '',
  //     legalAddress: '',
  //     floorNo: '',
  //     propertyState: '',
  //     propertyCity: '',
  //     propertyPinCode: '',
  //     addressMatching: '',
  //     jurisdiction: '',
  //     propertyType: '',
  //     marketability: '',
  //     occupancyStatus: '',
  //     typeOfProperty: '',
  //     occupancySchedule: '',
  //     northBoundary: '',
  //     eastBoundary: '',
  //     westBoundary: '',
  //     southBoundary: '',
  //     boundariesMatching: '',
  //     identifiedProperty: '',
  //     approachRoadSize: '',
  // });

  const [formData, setFormData] = useState({
    fileNo: "SME-2023-00542",
    dateOfReport: "15/11/2023",
    applicantName: "Shri Ganesh Finance Corporation",
    contactPerson: "Mr. Rajesh Verma",
    loanType: "BLSE",
    personMet: "Mr. Amit Patel (Site Incharge)",
    propertyOwner: "Mrs. Sunita Devi W/o Mr. Ramesh Kumar",
    documentsProvided: "Registered Sale Deed No. 4587 dated 12/03/2018",
    addressSite: "Plot No. 45, Sector 12, Near ICICI Bank",
    localityName: "Gandhi Nagar",
    landmark: "Opposite City Mall",
    distanceFromCity: "3.5 km from city center",
    latLong: "23.0225° N, 72.5714° E",
    addressInitiation: "Survey done via GPS coordinates",
    legalAddress: "Survey No. 78/2, Gandhi Nagar, Ahmedabad - 380009",
    floorNo: "Ground + 2 Floors",
    propertyState: "Gujarat",
    propertyCity: "Ahmedabad",
    propertyPinCode: "380009",
    addressMatching: "Yes",
    jurisdiction: "Ahmedabad Municipal Corporation",
    propertyType: "Residential Building",
    marketability: "Excellent",
    occupancyStatus: "Partially Occupied",
    typeOfProperty: "Independent House",
    occupancySchedule:
      "Ground Floor: Owner, 1st Floor: Tenant, 2nd Floor: Vacant",
    northBoundary: "10 ft wide lane",
    eastBoundary: "Adjacent property (Mr. Sharma's house)",
    westBoundary: "15 ft main road",
    southBoundary: "Vacant plot",
    boundariesMatching: "Yes (Minor deviation of 0.5 ft on east side)",
    identifiedProperty: "Yes (Verified with property documents)",
    approachRoadSize: "15 ft wide concrete road",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
    toast.success("saved successfully");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='  space-y-4 p-4  rounded-lg shadow-md'
    >
      <div className='font-bold text-center'>Valuation Report</div>

      <div className='font-bold'>Application Details:</div>

      {/* Application Details */}
      <div className='grid grid-cols-4 gap-4'>
        <div>File No./LAN No./System No.</div>
        <input
          type='text'
          name='fileNo'
          value={formData.fileNo}
          onChange={handleChange}
          className='border p-2'
        />
        <div>Date of Report</div>
        <input
          type='date'
          name='dateOfReport'
          value={formData.dateOfReport}
          onChange={handleChange}
          className='border p-2'
        />
        <div>Name of Applicant</div>
        <input
          type='text'
          name='applicantName'
          value={formData.applicantName}
          onChange={handleChange}
          className='border p-2'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Contact Person Name & No.</div>
        <input
          type='text'
          name='contactPerson'
          value={formData.contactPerson}
          onChange={handleChange}
          className='border p-2'
        />
        <div>Loan Type (HL/LAP/BT)</div>
        <input
          type='text'
          name='loanType'
          value={formData.loanType}
          onChange={handleChange}
          className='border p-2'
        />
        <div>Person Met at Site</div>
        <input
          type='text'
          name='personMet'
          value={formData.personMet}
          onChange={handleChange}
          className='border p-2'
        />
      </div>

      {/* Location Details */}
      <div className='font-bold'>Location Details:</div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Address of Property</div>
        <input
          type='text'
          name='addressSite'
          value={formData.addressSite}
          onChange={handleChange}
          className='border p-2 col-span-3'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Locality Name</div>
        <input
          type='text'
          name='localityName'
          value={formData.localityName}
          onChange={handleChange}
          className='border p-2'
        />
        <div>Landmark Near By</div>
        <input
          type='text'
          name='landmark'
          value={formData.landmark}
          onChange={handleChange}
          className='border p-2 col-span-2'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Distance from City Centre</div>
        <input
          type='number'
          name='distanceFromCity'
          value={formData.distanceFromCity}
          onChange={handleChange}
          className='border p-2'
        />
        <div>LAT/Long</div>
        <input
          type='text'
          name='latLong'
          value={formData.latLong}
          onChange={handleChange}
          className='border p-2 col-span-2'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Address as per Initiation</div>
        <input
          type='text'
          name='addressInitiation'
          value={formData.addressInitiation}
          onChange={handleChange}
          className='border p-2 col-span-3'
        />
      </div>

      {/* Legal Address */}
      <div className='font-bold'>Legal Address of the Property:</div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Address of Property</div>
        <input
          type='text'
          name='legalAddress'
          value={formData.legalAddress}
          onChange={handleChange}
          className='border p-2 col-span-3'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Floor No. of Property</div>
        <input
          type='text'
          name='floorNo'
          value={formData.floorNo}
          onChange={handleChange}
          className='border p-2'
        />
        <div>Property State</div>
        <input
          type='text'
          name='propertyState'
          value={formData.propertyState}
          onChange={handleChange}
          className='border p-2'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Property City</div>
        <input
          type='text'
          name='propertyCity'
          value={formData.propertyCity}
          onChange={handleChange}
          className='border p-2'
        />
        <div>Property Pin code</div>
        <input
          type='text'
          name='propertyPinCode'
          value={formData.propertyPinCode}
          onChange={handleChange}
          className='border p-2'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Address Matching (Yes/No)</div>
        <input
          type='text'
          name='addressMatching'
          value={formData.addressMatching}
          onChange={handleChange}
          className='border p-2'
        />
        <div>Jurisdiction/Local Municipal Body</div>
        <input
          type='text'
          name='jurisdiction'
          value={formData.jurisdiction}
          onChange={handleChange}
          className='border p-2 col-span-2'
        />
      </div>

      {/* Property Details */}
      <div className='grid grid-cols-4 gap-4'>
        <div>Property Holding Type (Freehold/Lease hold)</div>
        <input
          type='text'
          name='propertyType'
          value={formData.propertyType}
          onChange={handleChange}
          className='border p-2'
        />
        <div>Marketability (Poor/Fair/Good)</div>
        <input
          type='text'
          name='marketability'
          value={formData.marketability}
          onChange={handleChange}
          className='border p-2'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Occupancy Status (Self/Tenant/Vacant/Under Construction)</div>
        <input
          type='text'
          name='occupancyStatus'
          value={formData.occupancyStatus}
          onChange={handleChange}
          className='border p-2'
        />
        <div>
          Type of Property (Flat/Bungalow/Commercial Building/Commercial
          Unit/Industrial/Plot)
        </div>
        <input
          type='text'
          name='typeOfProperty'
          value={formData.typeOfProperty}
          onChange={handleChange}
          className='border p-2'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Occupancy Status (SORP/SOCP/Rented/Vacant)</div>
        <input
          type='text'
          name='occupancySchedule'
          value={formData.occupancySchedule}
          onChange={handleChange}
          className='border p-2'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>North Boundary</div>
        <input
          type='text'
          name='northBoundary'
          value={formData.northBoundary}
          onChange={handleChange}
          className='border p-2'
        />
        <div>East Boundary</div>
        <input
          type='text'
          name='eastBoundary'
          value={formData.eastBoundary}
          onChange={handleChange}
          className='border p-2'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>West Boundary</div>
        <input
          type='text'
          name='westBoundary'
          value={formData.westBoundary}
          onChange={handleChange}
          className='border p-2'
        />
        <div>South Boundary</div>
        <input
          type='text'
          name='southBoundary'
          value={formData.southBoundary}
          onChange={handleChange}
          className='border p-2'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Boundaries Matching (Yes/No)</div>
        <input
          type='text'
          name='boundariesMatching'
          value={formData.boundariesMatching}
          onChange={handleChange}
          className='border p-2'
        />
        <div>Property Identified (Yes/No)</div>
        <input
          type='text'
          name='identifiedProperty'
          value={formData.identifiedProperty}
          onChange={handleChange}
          className='border p-2'
        />
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div>Approach Road Size (& Width)</div>
        <input
          type='text'
          name='approachRoadSize'
          value={formData.approachRoadSize}
          onChange={handleChange}
          className='border p-2'
        />
      </div>

      <button
        type='submit'
        className='bg-blue-500 text-white p-2 mt-4  rounded'
      >
        Submit
      </button>
    </form>
  );
};

export default ValuationReportForm;
