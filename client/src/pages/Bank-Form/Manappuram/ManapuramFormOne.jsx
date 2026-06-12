import React, { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";

const ManapuramFormOne = ({ isEdit, onDataChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    valuerName: "",
    caseRefNo: "",
    dateOfVisit: "",
    dateOfReport: "",
    contactPersonName: "",
    contactPersonMobile: "",
    applicantsName: "",
    owner: "",
    documentProduced: "",
    propertyType: "",
    holdingType: " ",
    propertyUsage: "",
    usageAuthorized: "",
    usageRestriction: "",
    occupancyStatus: "",
    measurement: ".",
    distanceFromBranch: "",
    addressAsPerDocument: "",
    landMark: "",
    location: "",
    eastBoundary: "",
    westBoundary: "",
    northBoundary: "",
    southBoundary: "",
    connectivity: "",
    siteAccess: "",
    proximityToAmenities: " ",
    distanceFromCityCentre: "    ",
    roadTypeWidth: "",
    commentsOnProperty: "",
  });

  // Initialize formData when editing or extracting
  useEffect(() => {
    setFormData((prev) => {
      let newData = { ...prev };

      if (isEdit) {
        newData = {
          ...newData,
          valuerName: isEdit.valuerName || "",
          caseRefNo: isEdit.caseRefNo || "",
          dateOfVisit: isEdit?.dateOfVisit
            ? moment(isEdit.dateOfVisit).format("YYYY-MM-DD")
            : "",
          dateOfReport: isEdit?.dateOfReport
            ? moment(isEdit.dateOfReport).format("YYYY-MM-DD")
            : "",
          contactPersonName: isEdit.contactPersonName || "",
          contactPersonMobile: isEdit.contactPersonMobile || "",
          applicantsName: isEdit.applicantsName || "",
          owner: isEdit.owner || "",
          documentProduced: isEdit.documentProduced || "",
          propertyType: isEdit.propertyType || "",
          holdingType: isEdit.holdingType || "",
          propertyUsage: isEdit.propertyUsage || "",
          usageAuthorized: isEdit.usageAuthorized || "",
          usageRestriction: isEdit.usageRestriction || "",
          occupancyStatus: isEdit.occupancyStatus || "",
          measurement: isEdit.measurement || "",
          distanceFromBranch: isEdit.distanceFromBranch || "",
          addressAsPerDocument: isEdit.addressAsPerDocument || "",
          landMark: isEdit.landMark || "",
          eastBoundary: isEdit.eastBoundary || "",
          westBoundary: isEdit.westBoundary || "",
          northBoundary: isEdit.northBoundary || "",
          southBoundary: isEdit.southBoundary || "",
          connectivity: isEdit.connectivity || "",
          siteAccess: isEdit.siteAccess || "",
          proximityToAmenities: isEdit.proximityToAmenities || "",
          distanceFromCityCentre: isEdit.distanceFromCityCentre || "",
          roadTypeWidth: isEdit.roadTypeWidth || "",
          commentsOnProperty: isEdit.commentsOnProperty || "",
        };
      }

      if (extractedData && Object.keys(extractedData).length > 0) {
        const p = extractedData.property || {};
        const bankDet = p.bank_specific_details || {};
        const addr = p.address || {};
        const loc = p.location_details || {};
        const accom = p.accommodation_details || {};
        const propDet = p.property_details || {};
        const bounds = p.boundaries || {};
        const val = p.valuation_details || {};

        newData = {
          ...newData,
          caseRefNo: bankDet.file_no || bankDet.lan_no || extractedData.caseReferenceNumber || newData.caseRefNo,
          contactPersonName: p.contact_person || extractedData.contactPersonName || newData.contactPersonName,
          contactPersonMobile: p.contact_number || p["Mobile No."] || extractedData.contactPersonNumber || newData.contactPersonMobile,
          applicantsName: p.applicant_name || p.owner_name || extractedData.applicantNames || newData.applicantsName,
          owner: p.owner_name || newData.owner,
          propertyType: p.property_type || accom.type_of_structure || extractedData.propertyType || newData.propertyType,
          holdingType: accom.property_holding || newData.holdingType,
          propertyUsage: p.property_use || newData.propertyUsage,
          occupancyStatus: propDet.occupancy || newData.occupancyStatus,
          addressAsPerDocument: addr.full_address || newData.addressAsPerDocument,
          landMark: loc.landmark || newData.landMark,
          eastBoundary: bounds.east_actual || bounds.east_as_per_deed || newData.eastBoundary,
          westBoundary: bounds.west_actual || bounds.west_as_per_deed || newData.westBoundary,
          northBoundary: bounds.north_actual || bounds.north_as_per_deed || newData.northBoundary,
          southBoundary: bounds.south_actual || bounds.south_as_per_deed || newData.southBoundary,
          distanceFromCityCentre: loc.distance_city_centre || newData.distanceFromCityCentre,
          roadTypeWidth: loc.width_approach_road || newData.roadTypeWidth,
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
    <div className='mb-4'>
      <div
        className='p-3 border rounded cursor-pointer'
        style={{ backgroundColor: "#30384B" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex justify-between items-center text-white'>
          <h4 className='m-0 text-lg font-semibold'>MANIPURAM FORM ONE</h4>
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
      </div>

      {isOpen && (
        <div className='p-3 border rounded mt-2 bg-gray-100'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Valuer Info */}
            <div className='flex flex-wrap -mx-2'>
              <div className='w-full md:w-1/3 px-2 mb-3'>
                <label className='block mb-1 font-medium'>Valuer Name:</label>
                <input
                  type='text'
                  name='valuerName'
                  className='w-full p-2 border rounded'
                  value={formData.valuerName}
                  onChange={handleChange}
                />
              </div>
              <div className='w-full md:w-1/3 px-2 mb-3'>
                <label className='block mb-1 font-medium'>Case Ref. No:</label>
                <input
                  type='text'
                  name='caseRefNo'
                  className='w-full p-2 border rounded'
                  value={formData.caseRefNo}
                  onChange={handleChange}
                />
              </div>
              <div className='w-full md:w-1/3 px-2 mb-3'>
                <label className='block mb-1 font-medium'>Date of Visit:</label>
                <input
                  type='date'
                  name='dateOfVisit'
                  className='w-full p-2 border rounded'
                  value={formData.dateOfVisit}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='flex flex-wrap -mx-2'>
              <div className='w-full md:w-1/3 px-2 mb-3'>
                <label className='block mb-1 font-medium'>
                  Date of Report:
                </label>
                <input
                  type='date'
                  name='dateOfReport'
                  className='w-full p-2 border rounded'
                  value={formData.dateOfReport}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className='text-lg font-semibold mt-4 mb-2'>
              Contacted Person for property inspection
            </h5>

            <div className='flex flex-wrap -mx-2'>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1 font-medium'>Name:</label>
                <input
                  type='text'
                  name='contactPersonName'
                  className='w-full p-2 border rounded'
                  value={formData.contactPersonName}
                  onChange={handleChange}
                />
              </div>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1 font-medium'>Mobile:</label>
                <input
                  type='text'
                  name='contactPersonMobile'
                  className='w-full p-2 border rounded'
                  value={formData.contactPersonMobile}
                  onChange={handleChange}
                />
              </div>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1 font-medium'>
                  Usage Authorized:
                </label>
                <input
                  type='text'
                  name='usageAuthorized'
                  className='w-full p-2 border rounded'
                  value={formData.usageAuthorized}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h5 className='text-lg font-semibold mt-4 mb-2'>Basic Details</h5>

            <div className='flex flex-wrap -mx-2'>
              {[
                {
                  name: "applicantsName",
                  label: "Applicant's Name/s",
                },
                {
                  name: "owner",
                  label: "Owner",
                },
                {
                  name: "documentProduced",
                  label: "Document Produced",
                },
              ].map((item, index) => (
                <div key={index} className='w-full md:w-1/3 px-2 mb-3'>
                  <label className='block mb-1 font-medium'>
                    {item.label}:
                  </label>
                  <input
                    type='text'
                    name={item.name}
                    className='w-full p-2 border rounded'
                    value={formData[item.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            <div className='flex flex-wrap -mx-2'>
              {[
                {
                  name: "propertyType",
                  label: "Type of Property",
                },
                {
                  name: "holdingType",
                  label: "Holding Type",
                },
                {
                  name: "propertyUsage",
                  label: "Property Usage",
                },
              ].map((item, index) => (
                <div key={index} className='w-full md:w-1/3 px-2 mb-3'>
                  <label className='block mb-1 font-medium'>
                    {item.label}:
                  </label>
                  <input
                    type='text'
                    name={item.name}
                    className='w-full p-2 border rounded'
                    value={formData[item.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            {/* Continue adding similar blocks for other sections */}
            {/* Additional Missing Fields */}
            <div className='flex flex-wrap -mx-2'>
              <div className='w-full md:w-1/3 px-2 mb-3'>
                <label className='block mb-1 font-medium'>
                  Occupancy Status:
                </label>
                <input
                  type='text'
                  name='occupancyStatus'
                  className='w-full p-2 border rounded'
                  value={formData.occupancyStatus}
                  onChange={handleChange}
                />
              </div>
              <div className='w-full md:w-1/3 px-2 mb-3'>
                <label className='block mb-1 font-medium'>Measurement:</label>
                <input
                  type='text'
                  name='measurement'
                  className='w-full p-2 border rounded'
                  value={formData.measurement}
                  onChange={handleChange}
                />
              </div>
              <div className='w-full md:w-1/3 px-2 mb-3'>
                <label className='block mb-1 font-medium'>
                  Distance from Branch:
                </label>
                <input
                  type='text'
                  name='distanceFromBranch'
                  className='w-full p-2 border rounded'
                  value={formData.distanceFromBranch}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='flex flex-wrap -mx-2'>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1 font-medium'>
                  Address as per Document:
                </label>
                <input
                  type='text'
                  name='addressAsPerDocument'
                  className='w-full p-2 border rounded'
                  value={formData.addressAsPerDocument}
                  onChange={handleChange}
                />
              </div>
              <div className='w-full md:w-1/2 px-2 mb-3'>
                <label className='block mb-1 font-medium'>Landmark:</label>
                <input
                  type='text'
                  name='landMark'
                  className='w-full p-2 border rounded'
                  value={formData.landMark}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='flex flex-wrap -mx-2'>
              {[
                { name: "eastBoundary", label: "East Boundary" },
                { name: "westBoundary", label: "West Boundary" },
                { name: "northBoundary", label: "North Boundary" },
                { name: "southBoundary", label: "South Boundary" },
                { name: "connectivity", label: "Connectivity" },
                { name: "siteAccess", label: "Site Access" },
                {
                  name: "proximityToAmenities",
                  label: "Proximity to Amenities",
                },
                {
                  name: "distanceFromCityCentre",
                  label: "Distance from City Centre",
                },
                { name: "roadTypeWidth", label: "Road Type/Width" },
                { name: "commentsOnProperty", label: "Comments on Property" },
              ].map((item, index) => (
                <div key={index} className='w-full md:w-1/2 px-2 mb-3'>
                  <label className='block mb-1 font-medium'>
                    {item.label}:
                  </label>
                  <input
                    type='text'
                    name={item.name}
                    className='w-full p-2 border rounded'
                    value={formData[item.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className='flex justify-end mt-4'>
              <button
                type='submit'
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManapuramFormOne;
