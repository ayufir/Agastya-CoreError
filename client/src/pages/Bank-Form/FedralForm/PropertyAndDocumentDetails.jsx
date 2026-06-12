import React, { useState } from "react";

const PropertyAndDocumentDetails = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    propertyAddress:
      "PROPERTY AT PLOT NO. 67, PART OF KH. NO. 61/2, 63, 64,65,67,68,69, KUTTER NAGAR NEAR BY LODHI NAGAR, WARD NO.73 GRAM BHANPUR TEHSIL HUZUR, DIST BHOPAL",
    legalAddress: "67",
    pinCode: "462037",
    nearbyLandmark: "NEAR BY MASJID BILAL",
    coordinates: "23.294491 77.425164",
    seismicZone: "III",
    layoutPlanProvided: "NA",
    layoutPlanAuthority: "NA",
    layoutPlanApproval: "NA",
    buildingPlanProvided: "YES",
    buildingPlanAuthority: "NAGAR NIGAM BHOPAL",
    buildingPlanApproval: "0465/1767/2022",
    constructionPermissionProvided: "NA",
    constructionPermissionAuthority: "NA",
    constructionPermissionApproval: "NA",
    reraApplicable: "NA",
    reraNumber: "NA",
    reraConstructionStage: "NA",
    propertyCategory: "NA",
    documentsStudied: "SALE DEED",
    otherDocuments: "NA",
  });

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
}
    const handleSubmit = () => {
    onNext(formData);
  };
  return (
    <div className="mb-6 border rounded-lg overflow-hidden">
      <div
        className="bg-gray-800 text-white px-4 py-3 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-semibold">Property & Document Details</h4>
        <button
          className="bg-white text-gray-800 text-sm px-3 py-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className="bg-gray-100 p-6">
          <h5 className="text-lg font-semibold mb-4">PROPERTY DETAILS</h5>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Address of Property</label>
            <textarea
              className="w-full p-2 border rounded"
              name="propertyAddress"
              rows="3"
              value={formData.propertyAddress}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium">Legal Address</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                name="legalAddress"
                value={formData.legalAddress}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Pin Code</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Nearby Landmark</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                name="nearbyLandmark"
                value={formData.nearbyLandmark}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block mb-1 font-medium">Latitude & Longitude</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                name="coordinates"
                value={formData.coordinates}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Seismic Zone</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                name="seismicZone"
                value={formData.seismicZone}
                onChange={handleChange}
              />
            </div>
          </div>

          <h5 className="text-lg font-semibold mt-6 mb-4">DOCUMENT DETAILS</h5>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-300">
                <tr>
                  <th className="border p-2">Document Type</th>
                  <th className="border p-2">Provided (Y/N)</th>
                  <th className="border p-2">Approving Authority</th>
                  <th className="border p-2">Approval Number & Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    type: "Layout Plan",
                    provided: "layoutPlanProvided",
                    authority: "layoutPlanAuthority",
                    approval: "layoutPlanApproval",
                  },
                  {
                    type: "Building Plan",
                    provided: "buildingPlanProvided",
                    authority: "buildingPlanAuthority",
                    approval: "buildingPlanApproval",
                  },
                  {
                    type: "Construction Permission",
                    provided: "constructionPermissionProvided",
                    authority: "constructionPermissionAuthority",
                    approval: "constructionPermissionApproval",
                  },
                ].map((doc) => (
                  <tr key={doc.type}>
                    <td className="border p-2">{doc.type}</td>
                    <td className="border p-2">
                      <select
                        className="w-full p-1 border rounded"
                        name={doc.provided}
                        value={formData[doc.provided]}
                        onChange={handleChange}
                      >
                        <option value="NA">NA</option>
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </td>
                    <td className="border p-2">
                      <input
                        className="w-full p-1 border rounded"
                        name={doc.authority}
                        value={formData[doc.authority]}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        className="w-full p-1 border rounded"
                        name={doc.approval}
                        value={formData[doc.approval]}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block mb-1 font-medium">RERA Applicable</label>
              <select
                className="w-full p-2 border rounded"
                name="reraApplicable"
                value={formData.reraApplicable}
                onChange={handleChange}
              >
                <option value="NA">NA</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">RERA Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                name="reraNumber"
                value={formData.reraNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Stage of Construction as per RERA
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                name="reraConstructionStage"
                value={formData.reraConstructionStage}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block mb-1 font-medium">
                Property Category
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                name="propertyCategory"
                value={formData.propertyCategory}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                List of Documents Studied
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                name="documentsStudied"
                value={formData.documentsStudied}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-1 font-medium">
              Other Documents Provided
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              name="otherDocuments"
              value={formData.otherDocuments}
              onChange={handleChange}
            />
          </div>
        </div>
        
      )}
      <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md"
         onClick={handleSubmit} >
            Next
          </button>
    </div>
  );
};

export default PropertyAndDocumentDetails;
