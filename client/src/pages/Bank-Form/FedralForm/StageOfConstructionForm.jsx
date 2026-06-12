import React, { useState } from 'react';

const StageConstructionForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    structureDescription: 'RCC',
    stageDescription: 'FINISHING WORK PENDING',
    percentCompleted: '95%',
    percentRecommended: '100%',
    referenceType: 'NA',
    referenceName: 'NA',
    referenceCategory: '',
    referenceContact: 'NA',
    valuationResult: 'Positive',
    fairRentalValue: 'NA',
    remarks: `1. GIVEN XEROX COPY OF SALE DEED IN FAVOUR OF MR. MOHD AAMIR S/O MR. MO. IMAM KHAN
    2. DURING PROPERTY VISIT MR. AMIR WAS MET AT THE PROPERTY WHO IS COSTUMER. IT WAS CLEARLY EXPLAINED TO HIM/HER THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.
    3. RATE HAS BEEN CONFIRM FROM LOCAL MARKET ENQUIRY.
    4. PROPERTY SITUATED IN SURROUNDING LOCALITY IS RESIDENTIAL.
    5. PROPERTY IS OF RESIDENTIAL HOUSE WHICH VACANT AND FINISHING WORK IS PENDING.
    6. PROPERTY IS IDENTIFIED BY COMMON FOUR SIDE BOUNDARIES OF DEED AND LOCAL ENQUIRY.
    7. AS PER DEED ALSO AREA IS 600 SQFT.
    8. ACTUAL BUILT-UP AREA OF THE GF IS 600 SQFT. BUILT-UP AREA IS CONSIDERED AS PER PERMISSIBLE FSI 0.625.
    9. OBTAINED COPY OF APPROVED MAP FOR G+2, PERMISSION NO. 0445/1757/2022 ON DATE 14/06/2022.
    10. BUILT-UP VALUE IS CONSIDERED AS PER PRESENT CONDITION OF THE WORK`,
    inspectionDate: '2025-02-12',
    place: 'BHOPAL',
    customerName: 'MR. MOHD AAMIR',
    applicationNumber: '',
    propertyAddress: 'PROPERTY AT PLOT NO. 67, PART OF KH. NO. 61/2, G3, 64,65,67,68,69, KUTTER NAGAR NEAR BY LODHI NAGAR, WARD NO.73 GRAM BHAMPUR TEHSIL HUIZUR, DIST BHOPAL',
    latitude: '23.2948',
    longitude: '77.425164',
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="mb-4 border rounded overflow-hidden">
      <div
        className="bg-gray-800 p-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center text-white">
          <h4 className="m-0 text-lg font-semibold">Stage of Construction</h4>
          <button
            type="button"
            className="bg-white text-gray-800 text-sm px-3 py-1 rounded hover:bg-gray-200"
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
        <div className="bg-gray-100 p-4 border-t">
          <div className="overflow-auto">
            <table className="min-w-full border border-gray-300 mb-4 text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">Description of Structure</th>
                  <th className="border px-2 py-1">Description of Stage</th>
                  <th className="border px-2 py-1">% Completed</th>
                  <th className="border px-2 py-1">% Recommended</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">
                    <input
                      type="text"
                      name="structureDescription"
                      value={formData.structureDescription}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      name="stageDescription"
                      value={formData.stageDescription}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      name="percentCompleted"
                      value={formData.percentCompleted}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="text"
                      name="percentRecommended"
                      value={formData.percentRecommended}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Reference Type</label>
              <input
                type="text"
                name="referenceType"
                value={formData.referenceType}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Reference Name</label>
              <input
                type="text"
                name="referenceName"
                value={formData.referenceName}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Reference Category</label>
              <input
                type="text"
                name="referenceCategory"
                value={formData.referenceCategory}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Reference Contact Number</label>
              <input
                type="text"
                name="referenceContact"
                value={formData.referenceContact}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Valuation Result</label>
              <select
                name="valuationResult"
                value={formData.valuationResult}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
                <option value="Neutral">Neutral</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Fair Rental Value</label>
              <input
                type="text"
                name="fairRentalValue"
                value={formData.fairRentalValue}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-1">Remarks</label>
            <textarea
              name="remarks"
              rows="4"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block mb-1">Inspection Date</label>
              <input
                type="date"
                name="inspectionDate"
                value={formData.inspectionDate}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Place</label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Application Number</label>
              <input
                type="text"
                name="applicationNumber"
                value={formData.applicationNumber}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-1">Address of Property</label>
            <textarea
              name="propertyAddress"
              rows="2"
              value={formData.propertyAddress}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block mb-1">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>
        </div>
      )}
      <button
        type="submit"
        className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md"
        onClick={handleSubmit}
      >
        Next
      </button>
    </div>
  );
};

export default StageConstructionForm;
