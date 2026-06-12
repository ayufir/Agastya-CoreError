import React, { useState } from "react";

const DescriptionAndValuations = ({ onNext }) => {
  // const [formData, setFormData] = useState({
  //   descriptionProperty: "",
  //   detailsRooms: "",
  //   noKitchen: "",
  //   noToilets: "",
  //   noRooms: "",
  //   structureProperty: "",
  //   roofType: "",
  //   structureSoundness: "",
  //   hall: "",
  //   isPropertyDemarcated: "",
  //   frontRoadWidth: "",
  //   noFlatsEachFloor: "",
  //   heightBuilding: "",
  //   noFloors: "",
  //   authorityLimit: "",
  //   ageProperty: "",
  //   residualAgeProperty: "",
  //   demolitionRisk: "",
  //   floodAffected: "",
  //   landSlideAffected: "",
  //   name: "",
  //   appNo: "",
  //   address: "",
  //   valuation: "",
  //   particular: "",
  //   areaSqFt: "",
  //   ratePerSqFt: "",
  //   totalValue: "",
  //   landArea: "",
  //   carpetArea: "",
  //   builtUpArea: "",
  //   builtUpPresentCondition: "",
  //   builtUpProposed: "",
  //   superBuiltUpArea: "",
  //   amenitiesValue: "",
  //   totalFairMarketValuePresent: "",
  //   totalFairMarketValueCompletion: "",
  //   propertyValueCircleRate: "",
  //   distressSaleValue: "",
  //   insurableValue: "",
  //   stageConstructionBuilding: "",
  //   stageConstructionPercentage: "",
  //   unitBeingFunded: "",
  //   localityDevelopment: "",
  // });

  const [formData, setFormData] = useState({
    descriptionProperty: "A well-maintained residential apartment",
    detailsRooms: "Living room, 2 bedrooms, kitchen, 2 bathrooms",
    noKitchen: "1",
    noToilets: "2",
    noRooms: "3",
    structureProperty: "RCC Framed Structure",
    roofType: "Terrace with waterproofing",
    structureSoundness: "Good",
    hall: "Spacious living and dining hall",
    isPropertyDemarcated: "Yes",
    frontRoadWidth: "30 feet",
    noFlatsEachFloor: "4",
    heightBuilding: "35 feet",
    noFloors: "4",
    authorityLimit: "Local Municipal Corporation",
    ageProperty: "10 years",
    residualAgeProperty: "50 years",
    demolitionRisk: "Low",
    floodAffected: "No",
    landSlideAffected: "No",
    name: "John Doe",
    appNo: "APP-2023-12345",
    address: "123, ABC Nagar, XYZ City, India",
    valuation: "50,00,000 INR",
    particular: "Residential Apartment in a gated community",
    areaSqFt: "1200",
    ratePerSqFt: "4167",
    totalValue: "50,00,400",
    landArea: "1500 sq ft (undivided share)",
    carpetArea: "900",
    builtUpArea: "1100",
    builtUpPresentCondition: "Good",
    builtUpProposed: "",
    superBuiltUpArea: "1200",
    amenitiesValue: "5,00,000 INR (includes parking, club house access)",
    totalFairMarketValuePresent: "55,00,000 INR",
    totalFairMarketValueCompletion: "",
    propertyValueCircleRate: "45,00,000 INR",
    distressSaleValue: "40,00,000 INR",
    insurableValue: "60,00,000 INR",
    stageConstructionBuilding: "Completed",
    stageConstructionPercentage: "100%",
    unitBeingFunded: "Whole unit",
    localityDevelopment: "Well-developed with good infrastructure",
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
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='descriptionProperty'
          >
            Description of the existing property
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='descriptionProperty'
            type='text'
            name='descriptionProperty'
            value={formData.descriptionProperty}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='detailsRooms'
          >
            Details of different rooms
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='detailsRooms'
            type='text'
            name='detailsRooms'
            value={formData.detailsRooms}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='noKitchen'
          >
            No. of Kitchen
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='noKitchen'
            type='text'
            name='noKitchen'
            value={formData.noKitchen}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='noToilets'
          >
            No. of Toilets
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='noToilets'
            type='text'
            name='noToilets'
            value={formData.noToilets}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='noRooms'
          >
            No. of Rooms
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='noRooms'
            type='text'
            name='noRooms'
            value={formData.noRooms}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='structureProperty'
          >
            Structure of property
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='structureProperty'
            type='text'
            name='structureProperty'
            value={formData.structureProperty}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='roofType'
          >
            Roof type
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='roofType'
            type='text'
            name='roofType'
            value={formData.roofType}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='structureSoundness'
          >
            Structure soundness/Quality
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='structureSoundness'
            type='text'
            name='structureSoundness'
            value={formData.structureSoundness}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='hall'
          >
            Hall
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='hall'
            type='text'
            name='hall'
            value={formData.hall}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='isPropertyDemarcated'
          >
            Is Property Demarcated
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='isPropertyDemarcated'
            type='text'
            name='isPropertyDemarcated'
            value={formData.isPropertyDemarcated}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='frontRoadWidth'
          >
            Front Road Width
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='frontRoadWidth'
            type='text'
            name='frontRoadWidth'
            value={formData.frontRoadWidth}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='noFlatsEachFloor'
          >
            No of Flat on each Floor
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='noFlatsEachFloor'
            type='text'
            name='noFlatsEachFloor'
            value={formData.noFlatsEachFloor}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='heightBuilding'
          >
            Height of Building
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='heightBuilding'
            type='text'
            name='heightBuilding'
            value={formData.heightBuilding}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='noFloors'
          >
            Number of Floors
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='noFloors'
            type='text'
            name='noFloors'
            value={formData.noFloors}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='authorityLimit'
          >
            Authority Limit
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='authorityLimit'
            type='text'
            name='authorityLimit'
            value={formData.authorityLimit}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='ageProperty'
          >
            Age of Property
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='ageProperty'
            type='text'
            name='ageProperty'
            value={formData.ageProperty}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='residualAgeProperty'
          >
            Residual age of the Property
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='residualAgeProperty'
            type='text'
            name='residualAgeProperty'
            value={formData.residualAgeProperty}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='demolitionRisk'
          >
            Demolition Risk
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='demolitionRisk'
            type='text'
            name='demolitionRisk'
            value={formData.demolitionRisk}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='floodAffected'
          >
            Flood Affected Area
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='floodAffected'
            type='text'
            name='floodAffected'
            value={formData.floodAffected}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='landSlideAffected'
          >
            Land Slide Affected Area
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='landSlideAffected'
            type='text'
            name='landSlideAffected'
            value={formData.landSlideAffected}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='name'
          >
            Name
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='name'
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='appNo'
          >
            App No
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='appNo'
            type='text'
            name='appNo'
            value={formData.appNo}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='address'
          >
            Address
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='address'
            type='text'
            name='address'
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='valuation'
          >
            VALUATION
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='valuation'
            type='text'
            name='valuation'
            value={formData.valuation}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='particular'
          >
            Particular
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='particular'
            type='text'
            name='particular'
            value={formData.particular}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='areaSqFt'
          >
            Area (In sq.ft)
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='areaSqFt'
            type='text'
            name='areaSqFt'
            value={formData.areaSqFt}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='ratePerSqFt'
          >
            Rate (Per sq.ft)
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='ratePerSqFt'
            type='text'
            name='ratePerSqFt'
            value={formData.ratePerSqFt}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='totalValue'
          >
            Total Value
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='totalValue'
            type='text'
            name='totalValue'
            value={formData.totalValue}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='landArea'
          >
            Land Area
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='landArea'
            type='text'
            name='landArea'
            value={formData.landArea}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='carpetArea'
          >
            Carpet Area
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='carpetArea'
            type='text'
            name='carpetArea'
            value={formData.carpetArea}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='builtUpArea'
          >
            Built up Area
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='builtUpArea'
            type='text'
            name='builtUpArea'
            value={formData.builtUpArea}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='builtUpPresentCondition'
          >
            builtup present condition
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='builtUpPresentCondition'
            type='text'
            name='builtUpPresentCondition'
            value={formData.builtUpPresentCondition}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='builtUpProposed'
          >
            Built up Area (proposed)
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='builtUpProposed'
            type='text'
            name='builtUpProposed'
            value={formData.builtUpProposed}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='superBuiltUpArea'
          >
            Super Built up Area
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='superBuiltUpArea'
            type='text'
            name='superBuiltUpArea'
            value={formData.superBuiltUpArea}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='amenitiesValue'
          >
            Amenities Value
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='amenitiesValue'
            type='text'
            name='amenitiesValue'
            value={formData.amenitiesValue}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='totalFairMarketValuePresent'
          >
            Total Fair Market Value present condition
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='totalFairMarketValuePresent'
            type='text'
            name='totalFairMarketValuePresent'
            value={formData.totalFairMarketValuePresent}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='totalFairMarketValueCompletion'
          >
            Total Fair Market Value after completion
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='totalFairMarketValueCompletion'
            type='text'
            name='totalFairMarketValueCompletion'
            value={formData.totalFairMarketValueCompletion}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='propertyValueCircleRate'
          >
            Property Value As per Circle Rate
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='propertyValueCircleRate'
            type='text'
            name='propertyValueCircleRate'
            value={formData.propertyValueCircleRate}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='distressSaleValue'
          >
            Distress Sale Value
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='distressSaleValue'
            type='text'
            name='distressSaleValue'
            value={formData.distressSaleValue}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='insurableValue'
          >
            Insurable Value
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='insurableValue'
            type='text'
            name='insurableValue'
            value={formData.insurableValue}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='stageConstructionBuilding'
          >
            Stage of Construction - Building
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='stageConstructionBuilding'
            type='text'
            name='stageConstructionBuilding'
            value={formData.stageConstructionBuilding}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='stageConstructionPercentage'
          >
            Stage of Construction - Percentage
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='stageConstructionPercentage'
            type='text'
            name='stageConstructionPercentage'
            value={formData.stageConstructionPercentage}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='unitBeingFunded'
          >
            Unit Being Funded
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='unitBeingFunded'
            type='text'
            name='unitBeingFunded'
            value={formData.unitBeingFunded}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='localityDevelopment'
          >
            LOCALITY DEVELOPMENT
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='localityDevelopment'
            type='text'
            name='localityDevelopment'
            value={formData.localityDevelopment}
            onChange={handleChange}
          />
        </div>
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

export default DescriptionAndValuations;
