import React, { useState } from "react";

const FormComponent = ({ onNext }) => {
  // const [formData, setFormData] = useState({
  //   branch: "",
  //   reportDate: "",
  //   applicationNumber: "",
  //   dateOfVisit: "",
  //   applicantName: "",
  //   visitedBy: "",
  //   product: "",
  //   propertyType: "",
  //   propertyAddressAsPerSite: "",
  //   propertyAddressAsPerDocuments: "",
  //   houseNo: "",
  //   floorNo: "",
  //   wingNameNo: "",
  //   colonyProjectName: "",
  //   plotPropertyDAGNo: "",
  //   khasraSurveyNo: "",
  //   galiRoadName: "",
  //   sectorPhaseWard: "",
  //   landmark: "",
  //   villageLocation: "",
  //   mauzaPoliceStation: "",
  //   cityTehsilTalukaTown: "",
  //   district: "",
  //   state: "",
  //   pincode: "",
  //   distanceFromNearestDmiBranch: "",
  //   distanceFromNearestCityCentre: "",
  //   distanceFromLandmark: "",
  //   listOfDocumentsSubmitted: "",
  //   propertyOwnerAsPerDocuments: "",
  //   isSelfOccupiedProperty: "",
  //   ifNoWhoOwnsTheProperty: "",
  //   nameOfPersonMet: "",
  //   contactNoOfPersonMet: "",
  //   relationWithApplicant: "",
  //   contactNoOfApplicant: "",
  //   documentName: "",
  //   receivedType: "",
  //   receivedStatus: "",
  //   documentNo: "",
  //   documentDate: "",
  //   fourBoundariesEast: "",
  //   fourBoundariesWest: "",
  //   fourBoundariesNorth: "",
  //   fourBoundariesSouth: "",
  //   geoCoordinatesLatitude: "",
  //   geoCoordinatesLongitude: "",
  // });

  const [formData, setFormData] = useState({
    branch: "Lanji Branch",
    reportDate: "2025-05-14",
    applicationNumber: "LA-20250514-001",
    dateOfVisit: "2025-05-13",
    applicantName: "Priya Sharma",
    visitedBy: "Rajesh Kumar (Field Officer)",
    product: "Home Loan",
    propertyType: "Residential Apartment",
    propertyAddressAsPerSite: "Flat No. 203, Shanti Enclave, Ward No. 5",
    propertyAddressAsPerDocuments:
      "Flat No. 203, Shanti Enclave, Ward No. 5, Near Water Tank",
    houseNo: "203",
    floorNo: "2nd Floor",
    wingNameNo: "A Wing",
    colonyProjectName: "Shanti Enclave",
    plotPropertyDAGNo: "Plot No. 15",
    khasraSurveyNo: "Khasra No. 45/2",
    galiRoadName: "Main Road, Shanti Enclave",
    sectorPhaseWard: "Ward No. 5",
    landmark: "Near Water Tank",
    villageLocation: "Lanji",
    mauzaPoliceStation: "Lanji Police Station",
    cityTehsilTalukaTown: "Lanji",
    district: "Balaghat",
    state: "Madhya Pradesh",
    pincode: "481221",
    distanceFromNearestDmiBranch: "2 km",
    distanceFromNearestCityCentre: "5 km",
    distanceFromLandmark: "0.5 km (from Water Tank)",
    listOfDocumentsSubmitted: "Sale Deed, Property Tax Receipts, ID Proof",
    propertyOwnerAsPerDocuments: "Priya Sharma",
    isSelfOccupiedProperty: "Yes",
    ifNoWhoOwnsTheProperty: "",
    nameOfPersonMet: "Priya Sharma",
    contactNoOfPersonMet: "9876543210",
    relationWithApplicant: "Self",
    contactNoOfApplicant: "9876543210",
    documentName: "Sale Deed",
    receivedType: "Original",
    receivedStatus: "Verified",
    documentNo: "SD-2023-00789",
    documentDate: "2023-08-15",
    fourBoundariesEast: "Neighbor's Property",
    fourBoundariesWest: "Internal Road",
    fourBoundariesNorth: "Open Space",
    fourBoundariesSouth: "Other Apartment",
    geoCoordinatesLatitude: "21.9675",
    geoCoordinatesLongitude: "80.7083",
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
    // console.log("Form Data:", formData);
    onNext(formData);
    // You can add your submission logic here
  };

  return (
    <div className='container mx-auto p-4'>
      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
      >
        <div className='flex flex-wrap -mx-3 mb-6'>
          <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='branch'
            >
              Branch
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='branch'
              type='text'
              name='branch'
              value={formData.branch}
              onChange={handleChange}
            />
          </div>
          <div className='w-full md:w-1/2 px-3'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='reportDate'
            >
              Report Date
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='reportDate'
              type='text'
              name='reportDate'
              value={formData.reportDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='flex flex-wrap -mx-3 mb-6'>
          <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='applicationNumber'
            >
              Application Number
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='applicationNumber'
              type='text'
              name='applicationNumber'
              value={formData.applicationNumber}
              onChange={handleChange}
            />
          </div>
          <div className='w-full md:w-1/2 px-3'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='dateOfVisit'
            >
              Date of Visit
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='dateOfVisit'
              type='text'
              name='dateOfVisit'
              value={formData.dateOfVisit}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='flex flex-wrap -mx-3 mb-6'>
          <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='applicantName'
            >
              Applicant Name
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='applicantName'
              type='text'
              name='applicantName'
              value={formData.applicantName}
              onChange={handleChange}
            />
          </div>
          <div className='w-full md:w-1/2 px-3'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='visitedBy'
            >
              Visited by
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='visitedBy'
              type='text'
              name='visitedBy'
              value={formData.visitedBy}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='flex flex-wrap -mx-3 mb-6'>
          <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='product'
            >
              Product
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='product'
              type='text'
              name='product'
              value={formData.product}
              onChange={handleChange}
            />
          </div>
          <div className='w-full md:w-1/2 px-3'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='propertyType'
            >
              Property Type
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='propertyType'
              type='text'
              name='propertyType'
              value={formData.propertyType}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='flex flex-wrap -mx-3 mb-6'>
          <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='propertyAddressAsPerSite'
            >
              Property Address as per Site
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='propertyAddressAsPerSite'
              type='text'
              name='propertyAddressAsPerSite'
              value={formData.propertyAddressAsPerSite}
              onChange={handleChange}
            />
          </div>
          <div className='w-full md:w-1/2 px-3'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='propertyAddressAsPerDocuments'
            >
              Property Address as per Documents
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='propertyAddressAsPerDocuments'
              type='text'
              name='propertyAddressAsPerDocuments'
              value={formData.propertyAddressAsPerDocuments}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='houseNo'
          >
            HOUSE NO.
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='houseNo'
            type='text'
            name='houseNo'
            value={formData.houseNo}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='floorNo'
          >
            Floor No.
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='floorNo'
            type='text'
            name='floorNo'
            value={formData.floorNo}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='wingNameNo'
          >
            Wing Name/No.
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='wingNameNo'
            type='text'
            name='wingNameNo'
            value={formData.wingNameNo}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='colonyProjectName'
          >
            Colony/Project Name
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='colonyProjectName'
            type='text'
            name='colonyProjectName'
            value={formData.colonyProjectName}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='plotPropertyDAGNo'
          >
            Plot/Property/DAG No.
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='plotPropertyDAGNo'
            type='text'
            name='plotPropertyDAGNo'
            value={formData.plotPropertyDAGNo}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='khasraSurveyNo'
          >
            Khasra/Survey No.
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='khasraSurveyNo'
            type='text'
            name='khasraSurveyNo'
            value={formData.khasraSurveyNo}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='galiRoadName'
          >
            Gali No./Road Name
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='galiRoadName'
            type='text'
            name='galiRoadName'
            value={formData.galiRoadName}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='sectorPhaseWard'
          >
            Sector/Phase/Ward
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='sectorPhaseWard'
            type='text'
            name='sectorPhaseWard'
            value={formData.sectorPhaseWard}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='landmark'
          >
            Landmark
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='landmark'
            type='text'
            name='landmark'
            value={formData.landmark}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='villageLocation'
          >
            Village/Location
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='villageLocation'
            type='text'
            name='villageLocation'
            value={formData.villageLocation}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='mauzaPoliceStation'
          >
            Mauza/Police Station
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='mauzaPoliceStation'
            type='text'
            name='mauzaPoliceStation'
            value={formData.mauzaPoliceStation}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='cityTehsilTalukaTown'
          >
            City/Tehsil/Taluka/Town
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='cityTehsilTalukaTown'
            type='text'
            name='cityTehsilTalukaTown'
            value={formData.cityTehsilTalukaTown}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='district'
          >
            District
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='district'
            type='text'
            name='district'
            value={formData.district}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='state'
          >
            State
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='state'
            type='text'
            name='state'
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='pincode'
          >
            Pincode
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='pincode'
            type='text'
            name='pincode'
            value={formData.pincode}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='distanceFromNearestDmiBranch'
          >
            Distance from Nearest DMI branch
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='distanceFromNearestDmiBranch'
            type='text'
            name='distanceFromNearestDmiBranch'
            value={formData.distanceFromNearestDmiBranch}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='distanceFromNearestCityCentre'
          >
            Distance from Nearest city centre
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='distanceFromNearestCityCentre'
            type='text'
            name='distanceFromNearestCityCentre'
            value={formData.distanceFromNearestCityCentre}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='distanceFromLandmark'
          >
            Distance from Landmark
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='distanceFromLandmark'
            type='text'
            name='distanceFromLandmark'
            value={formData.distanceFromLandmark}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='listOfDocumentsSubmitted'
          >
            List of Documents submitted
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='listOfDocumentsSubmitted'
            type='text'
            name='listOfDocumentsSubmitted'
            value={formData.listOfDocumentsSubmitted}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='propertyOwnerAsPerDocuments'
          >
            Property owner as per documents
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='propertyOwnerAsPerDocuments'
            type='text'
            name='propertyOwnerAsPerDocuments'
            value={formData.propertyOwnerAsPerDocuments}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='isSelfOccupiedProperty'
          >
            Is it selfoccupied property by Applicant
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='isSelfOccupiedProperty'
            type='text'
            name='isSelfOccupiedProperty'
            value={formData.isSelfOccupiedProperty}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='ifNoWhoOwnsTheProperty'
          >
            If No, who owns the property
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='ifNoWhoOwnsTheProperty'
            type='text'
            name='ifNoWhoOwnsTheProperty'
            value={formData.ifNoWhoOwnsTheProperty}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='nameOfPersonMet'
          >
            Name of person met
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='nameOfPersonMet'
            type='text'
            name='nameOfPersonMet'
            value={formData.nameOfPersonMet}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='contactNoOfPersonMet'
          >
            Contact no. of person met
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='contactNoOfPersonMet'
            type='text'
            name='contactNoOfPersonMet'
            value={formData.contactNoOfPersonMet}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='relationWithApplicant'
          >
            Relation with applicant
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='relationWithApplicant'
            type='text'
            name='relationWithApplicant'
            value={formData.relationWithApplicant}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='contactNoOfApplicant'
          >
            Contact no. of Applicant
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='contactNoOfApplicant'
            type='text'
            name='contactNoOfApplicant'
            value={formData.contactNoOfApplicant}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='documentName'
          >
            Document Name
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='documentName'
            type='text'
            name='documentName'
            value={formData.documentName}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='receivedType'
          >
            Received Type
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='receivedType'
            type='text'
            name='receivedType'
            value={formData.receivedType}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='receivedStatus'
          >
            Received Status
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='receivedStatus'
            type='text'
            name='receivedStatus'
            value={formData.receivedStatus}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='documentNo'
          >
            Document no.
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='documentNo'
            type='text'
            name='documentNo'
            value={formData.documentNo}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='documentDate'
          >
            Document Date
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='documentDate'
            type='text'
            name='documentDate'
            value={formData.documentDate}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='fourBoundariesEast'
          >
            Four Boundaries - East
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='fourBoundariesEast'
            type='text'
            name='fourBoundariesEast'
            value={formData.fourBoundariesEast}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='fourBoundariesWest'
          >
            Four Boundaries - West
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='fourBoundariesWest'
            type='text'
            name='fourBoundariesWest'
            value={formData.fourBoundariesWest}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='fourBoundariesNorth'
          >
            Four Boundaries - North
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='fourBoundariesNorth'
            type='text'
            name='fourBoundariesNorth'
            value={formData.fourBoundariesNorth}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='fourBoundariesSouth'
          >
            Four Boundaries - South
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='fourBoundariesSouth'
            type='text'
            name='fourBoundariesSouth'
            value={formData.fourBoundariesSouth}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='geoCoordinatesLatitude'
          >
            Geo Cordinates - Latitude
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='geoCoordinatesLatitude'
            type='text'
            name='geoCoordinatesLatitude'
            value={formData.geoCoordinatesLatitude}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='geoCoordinatesLongitude'
          >
            Geo Cordinates - Longitude
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='geoCoordinatesLongitude'
            type='text'
            name='geoCoordinatesLongitude'
            value={formData.geoCoordinatesLongitude}
            onChange={handleChange}
          />
        </div>
        {/* Add more fields in a similar manner */}
        <div className='flex items-center justify-between'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;
