import React, { useState } from "react";
import toast from "react-hot-toast";

const PermissibleArea = ({ onNext }) => {
  // const [formData, setFormData] = useState({
  //   floorLevel: '',
  //   permissibleArea: '',
  //   landComponent: '',
  //   permissibleFSI: '',
  //   permissibleConstruction: '',
  //   construction140Percent: '',
  //   actualConstruction: '',
  //   fsiViolation: '',
  //   riskOfDemolition: 'Low',
  //   valuationDone: 'NO',
  //   statusOfProperty: '100%',
  //   completionPercentage: '100%',
  //   currentAgeOfProperty: 2,
  //   residualAge: 58,
  //   landValue: '',
  //   buaValue: '',
  //   depreciation: '',
  //   carParking: '',
  //   amenitiesCharges: '',
  //   fairMarketValue: '',
  //   govtValue: '',
  //   distressedValue: '',
  //   valuationDoneEarlier: 'No',
  //   demolitionList: 'No',
  //   negativeArea: 'No',
  //   remarks: ''
  // });

  const [formData, setFormData] = useState({
    floorLevel: "3",
    permissibleArea: "1200 sq.ft.",
    landComponent: "800 sq.ft.",
    permissibleFSI: "1.5",
    permissibleConstruction: "1800 sq.ft.",
    construction140Percent: "2520 sq.ft.",
    actualConstruction: "2100 sq.ft.",
    fsiViolation: "300 sq.ft. (16.67%)",
    riskOfDemolition: "Medium",
    valuationDone: "YES",
    statusOfProperty: "Occupied",
    completionPercentage: "95%",
    currentAgeOfProperty: 5,
    residualAge: 55,
    landValue: "₹2,50,00,000",
    buaValue: "₹1,80,00,000",
    depreciation: "15%",
    carParking: "2 covered slots",
    amenitiesCharges: "₹5,00,000",
    fairMarketValue: "₹4,75,00,000",
    govtValue: "₹3,20,00,000",
    distressedValue: "₹3,80,00,000",
    valuationDoneEarlier: "Yes (2022)",
    demolitionList: "No",
    negativeArea: "No",
    remarks:
      "Minor FSI violation observed. Property in good condition with regular maintenance.",
  });

  const handleInputChange = (e) => {
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
    <div onSubmit={handleSubmit} className='container mx-auto p-6'>
      <h2 className='text-center text-xl font-semibold'>
        Permissible Area Details
      </h2>
      <form on className='space-y-4'>
        {/* Grid Layout for input fields */}
        <div className='grid grid-cols-4 gap-4'>
          <div>
            <label htmlFor='floorLevel' className='block font-medium mb-2'>
              Floor Level
            </label>
            <input
              type='text'
              id='floorLevel'
              name='floorLevel'
              value={formData.floorLevel}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label htmlFor='permissibleArea' className='block font-medium mb-2'>
              Permissible Area as per Plan
            </label>
            <input
              type='text'
              id='permissibleArea'
              name='permissibleArea'
              value={formData.permissibleArea}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label htmlFor='landComponent' className='block font-medium mb-2'>
              Land Component
            </label>
            <input
              type='text'
              id='landComponent'
              name='landComponent'
              value={formData.landComponent}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label htmlFor='permissibleFSI' className='block font-medium mb-2'>
              Permissible FSI
            </label>
            <input
              type='text'
              id='permissibleFSI'
              name='permissibleFSI'
              value={formData.permissibleFSI}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
        </div>

        <div className='grid grid-cols-4 gap-4'>
          <div>
            <label
              htmlFor='permissibleConstruction'
              className='block font-medium mb-2'
            >
              Permissible Construction as per FSI
            </label>
            <input
              type='text'
              id='permissibleConstruction'
              name='permissibleConstruction'
              value={formData.permissibleConstruction}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label
              htmlFor='construction140Percent'
              className='block font-medium mb-2'
            >
              140% of Permissible Construction
            </label>
            <input
              type='text'
              id='construction140Percent'
              name='construction140Percent'
              value={formData.construction140Percent}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label
              htmlFor='actualConstruction'
              className='block font-medium mb-2'
            >
              Actual Construction (BUA)
            </label>
            <input
              type='text'
              id='actualConstruction'
              name='actualConstruction'
              value={formData.actualConstruction}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label htmlFor='fsiViolation' className='block font-medium mb-2'>
              FSI Violation %
            </label>
            <input
              type='text'
              id='fsiViolation'
              name='fsiViolation'
              value={formData.fsiViolation}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
        </div>

        <div className='grid grid-cols-4 gap-4'>
          <div>
            <label
              htmlFor='riskOfDemolition'
              className='block font-medium mb-2'
            >
              Risk of Demolition
            </label>
            <input
              type='text'
              id='riskOfDemolition'
              name='riskOfDemolition'
              value={formData.riskOfDemolition}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label htmlFor='valuationDone' className='block font-medium mb-2'>
              Valuation done as per BFL BSL Norms
            </label>
            <input
              type='text'
              id='valuationDone'
              name='valuationDone'
              value={formData.valuationDone}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label
              htmlFor='statusOfProperty'
              className='block font-medium mb-2'
            >
              Status of the Property
            </label>
            <input
              type='text'
              id='statusOfProperty'
              name='statusOfProperty'
              value={formData.statusOfProperty}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label
              htmlFor='completionPercentage'
              className='block font-medium mb-2'
            >
              % Completion
            </label>
            <input
              type='text'
              id='completionPercentage'
              name='completionPercentage'
              value={formData.completionPercentage}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
        </div>

        <div className='grid grid-cols-4 gap-4'>
          <div>
            <label
              htmlFor='currentAgeOfProperty'
              className='block font-medium mb-2'
            >
              Current Age of Property
            </label>
            <input
              type='text'
              id='currentAgeOfProperty'
              name='currentAgeOfProperty'
              value={formData.currentAgeOfProperty}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label htmlFor='residualAge' className='block font-medium mb-2'>
              Residual Age of Property
            </label>
            <input
              type='text'
              id='residualAge'
              name='residualAge'
              value={formData.residualAge}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label htmlFor='landValue' className='block font-medium mb-2'>
              Land Value
            </label>
            <input
              type='text'
              id='landValue'
              name='landValue'
              value={formData.landValue}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label htmlFor='buaValue' className='block font-medium mb-2'>
              BUA Value
            </label>
            <input
              type='text'
              id='buaValue'
              name='buaValue'
              value={formData.buaValue}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
        </div>

        {/* Remaining Fields */}
        <div className='grid grid-cols-4 gap-4'>
          <div>
            <label htmlFor='depreciation' className='block font-medium mb-2'>
              Depreciation
            </label>
            <input
              type='text'
              id='depreciation'
              name='depreciation'
              value={formData.depreciation}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label htmlFor='carParking' className='block font-medium mb-2'>
              Car Parking
            </label>
            <input
              type='text'
              id='carParking'
              name='carParking'
              value={formData.carParking}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label
              htmlFor='amenitiesCharges'
              className='block font-medium mb-2'
            >
              Amenities Charges
            </label>
            <input
              type='text'
              id='amenitiesCharges'
              name='amenitiesCharges'
              value={formData.amenitiesCharges}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label htmlFor='fairMarketValue' className='block font-medium mb-2'>
              Fair Market Value
            </label>
            <input
              type='text'
              id='fairMarketValue'
              name='fairMarketValue'
              value={formData.fairMarketValue}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
        </div>

        <div className='grid grid-cols-4 gap-4'>
          <div>
            <label htmlFor='govtValue' className='block font-medium mb-2'>
              Government Value
            </label>
            <input
              type='text'
              id='govtValue'
              name='govtValue'
              value={formData.govtValue}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label htmlFor='distressedValue' className='block font-medium mb-2'>
              Distressed Value
            </label>
            <input
              type='text'
              id='distressedValue'
              name='distressedValue'
              value={formData.distressedValue}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label
              htmlFor='valuationDoneEarlier'
              className='block font-medium mb-2'
            >
              Valuation Done Earlier
            </label>
            <input
              type='text'
              id='valuationDoneEarlier'
              name='valuationDoneEarlier'
              value={formData.valuationDoneEarlier}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div>
            <label htmlFor='demolitionList' className='block font-medium mb-2'>
              Demolition List
            </label>
            <input
              type='text'
              id='demolitionList'
              name='demolitionList'
              value={formData.demolitionList}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
        </div>

        {/* Remarks Section */}
        <div>
          <label htmlFor='remarks' className='block font-medium mb-2'>
            Remarks
          </label>
          <textarea
            id='remarks'
            name='remarks'
            value={formData.remarks}
            onChange={handleInputChange}
            className='w-full border border-gray-300 rounded px-3 py-2 h-32'
          />
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
    </div>
  );
};

export default PermissibleArea;
