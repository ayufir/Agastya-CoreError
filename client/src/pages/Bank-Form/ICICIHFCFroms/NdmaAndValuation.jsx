import React, { useState } from 'react';

const NdmaAndValuation = ({ onNext }) => {
  const [formData, setFormData] = useState({
    heightOfBuilding: 'Less than 15 meter',
    floodProneArea: 'No',
    seismicZone: '4',
    crz: '1',
    occupancyStatus: 'VACANT',
    customerRelationWithOccupant: 'VACANT LAND',
    occupiedSince: 'LAND',
    realizableValue: '0',
    totalValueInWords: '',
    landArea: '',
    landAreaRate: '1',
    constructedArea: '',
    constructedRate: '',
    totalValue: '',
    rates: [
      { description: '', area: '', ratePerSqFt: '', amount: '' }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRateChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRates = [...formData.rates];
    updatedRates[index][name] = value;

    // Recalculate amount if area or rate changes
    const area = parseFloat(updatedRates[index].area) || 0;
    const rate = parseFloat(updatedRates[index].ratePerSqFt) || 0;
    updatedRates[index].amount = (area * rate).toFixed(2);

    setFormData((prevData) => ({
      ...prevData,
      rates: updatedRates,
    }));
  };

  const addRateRow = () => {
    setFormData((prevData) => ({
      ...prevData,
      rates: [...prevData.rates, { description: '', area: '', ratePerSqFt: '', amount: '' }],
    }));
  };

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div className="p-4 bg-orange-100 border border-gray-300 rounded-md">
      <h2 className="text-red-700 font-bold text-lg mb-4">NDMA and Valuation Details</h2>

      <form className="space-y-6">
        {/* NDMA Details */}
        <div>
          <h3 className="text-red-700 font-semibold mb-2">NDMA Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['heightOfBuilding', 'floodProneArea', 'seismicZone', 'crz'].map((field) => (
              <div key={field}>
                <label className="block font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Occupancy Details */}
        <div>
          <h3 className="text-red-700 font-semibold mb-2">Occupancy Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Status of Occupancy</label>
              <select name="occupancyStatus" value={formData.occupancyStatus} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="VACANT">VACANT</option>
                <option value="OCCUPIED">OCCUPIED</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Customer Relation With Occupant</label>
              <select name="customerRelationWithOccupant" value={formData.customerRelationWithOccupant} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="VACANT LAND">VACANT LAND</option>
                <option value="OWNER">OWNER</option>
                <option value="TENANT">TENANT</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium">Occupied Since</label>
              <input type="text" name="occupiedSince" value={formData.occupiedSince} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </div>

        {/* Valuation Details */}
        <div>
          <h3 className="text-red-700 font-semibold mb-2">Valuation</h3>
          {formData.rates.map((rate, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
              {['description', 'area', 'ratePerSqFt', 'amount'].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={rate[field]}
                  onChange={(e) => handleRateChange(e, index)}
                  placeholder={field.replace(/([A-Z])/g, ' $1')}
                  className="border rounded px-3 py-2"
                />
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={addRateRow}
            className="mt-2 px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            + Add Valuation Row
          </button>
        </div>

        {/* Summary Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Realizable Value</label>
            <input type="text" name="realizableValue" value={formData.realizableValue} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-medium">Total Value In Words</label>
            <input type="text" name="totalValueInWords" value={formData.totalValueInWords} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        {/* Govt. Approved Valuation */}
        <div>
          <h3 className="text-red-700 font-semibold mb-2">Valuation as per Govt. Approval</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="landArea" value={formData.landArea} onChange={handleChange} placeholder="Land Area (Sq.Ft)" className="w-full border rounded px-3 py-2" />
            <input type="text" name="landAreaRate" value={formData.landAreaRate} onChange={handleChange} placeholder="Land Area Rate (Per Sq.Ft)" className="w-full border rounded px-3 py-2" />
            <input type="text" name="constructedArea" value={formData.constructedArea} onChange={handleChange} placeholder="Constructed Area" className="w-full border rounded px-3 py-2" />
            <input type="text" name="constructedRate" value={formData.constructedRate} onChange={handleChange} placeholder="Constructed Rate" className="w-full border rounded px-3 py-2" />
            <div className="md:col-span-2">
              <input type="text" name="totalValue" value={formData.totalValue} onChange={handleChange} placeholder="Total Value" className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </div>
      </form>

      <button
        className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-4"
        onClick={handleSubmit}
      >
        Next
      </button>
    </div>
  );
};

export default NdmaAndValuation;
