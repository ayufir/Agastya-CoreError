

import React, { useState } from "react";

const BasicDetails = ({ extractedData, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    branchName: "BHOPAL",
    valuerName: "Unique Engineering and Associate",
    typeOfCase: "Valuation Report",
    lanNo: "210225257489700",
    dateOfVisit: "2021-03-09",
    dateOfReport: "2021-03-09",
    contactedPerson: "MR. DILIP MEHRA CONT NO 6266737358",
    applicantsName: "BHAVAR LAL MEHRA",
    propertyOwner: "MR. BHAVARLAL S/O DEVILAL JI MEHRA",
    documentHolder: "MR. BHAVARLAL S/O DEVILAL JI MEHRA",
    originalPropertyType: "Residential",
    currentUsage: "Residential",
    addressAsPerRequest: "RESIDENTIAL HOUSE OF KH NO 180 H.NO. 72 PH NO 05 VILLAGE KURANA TESLI HUZURI DIST BHOPAL MP 462030",
    addressAtSite: "RESIDENTIAL HOUSE OF KH NO 180 H.NO. 72 PH NO 05 VILLAGE KURANA TESLI HUZURI DIST BHOPAL MP 462030",
    addressAsPerDocument: "RESIDENTIAL HOUSE OF KH NO 180 H.NO. 72 PH NO 05 VILLAGE KURANA TESLI HUZURI DIST BHOPAL MP 462030",
    pinCode: "462030",
    latitude: "23.330544",
    longitude: "77.31751",
    mainLocality: "Middle Class",
    previousValuation: "No"
  });

  React.useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const addr = p.address || {};
      const loc = p.location_details || {};
      const propDet = p.property_details || {};

      setFormData((prev) => ({
        ...prev,
        branchName: p.branch_name || extractedData.branchName || prev.branchName,
        valuerName: p.valuer_name || extractedData.valuerName || prev.valuerName,
        typeOfCase: p.type_of_case || extractedData.typeOfCase || prev.typeOfCase,
        lanNo: p.case_reference_no || extractedData.lanNo || prev.lanNo,
        dateOfVisit: p.date_of_inspection || extractedData.dateOfVisit || prev.dateOfVisit,
        dateOfReport: p.date_of_report || extractedData.dateOfReport || prev.dateOfReport,
        contactedPerson: p.contact_person || extractedData.contactedPerson || prev.contactedPerson,
        applicantsName: p.applicant_name || extractedData.applicantsName || prev.applicantsName,
        propertyOwner: p.owner_name || p.property_owner || extractedData.propertyOwner || prev.propertyOwner,
        documentHolder: p.document_holder || extractedData.documentHolder || prev.documentHolder,
        originalPropertyType: p.property_type || extractedData.originalPropertyType || prev.originalPropertyType,
        currentUsage: propDet.occupancy || extractedData.currentUsage || prev.currentUsage,
        addressAsPerRequest: addr.full_address || extractedData.addressAsPerRequest || prev.addressAsPerRequest,
        addressAtSite: addr.full_address || extractedData.addressAtSite || prev.addressAtSite,
        addressAsPerDocument: addr.full_address || extractedData.addressAsPerDocument || prev.addressAsPerDocument,
        pinCode: addr.pincode || extractedData.pinCode || prev.pinCode,
        latitude: p.latitude || extractedData.latitude || prev.latitude,
        longitude: p.longitude || extractedData.longitude || prev.longitude,
        mainLocality: loc.type_of_locality || extractedData.mainLocality || prev.mainLocality,
        previousValuation: p.previous_valuation || extractedData.previousValuation || prev.previousValuation,
      }));
    }
  }, [extractedData]);

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
    <div className="mb-4 border border-gray-700 rounded">
      <div
        className="p-4 bg-gray-800 text-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="m-0 font-semibold text-lg">BASIC DETAILS</h4>
        <button
          type="button"
          className="bg-white text-gray-800 px-3 py-1 text-sm rounded"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Branch Name</label>
              <input
                type="text"
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Valuer Name</label>
              <input
                type="text"
                name="valuerName"
                value={formData.valuerName}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Type of Case</label>
              <input
                type="text"
                name="typeOfCase"
                value={formData.typeOfCase}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          </div>

          {/* You can continue the pattern for each row/field below */}
          {/* For brevity, I'll skip to a textarea example */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Address at Site</label>
              <textarea
                name="addressAtSite"
                rows="3"
                value={formData.addressAtSite}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address as per Document</label>
              <textarea
                name="addressAsPerDocument"
                rows="3"
                value={formData.addressAsPerDocument}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          </div>

          {/* Final fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Main Locality of the Property</label>
            <input
              type="text"
              name="mainLocality"
              value={formData.mainLocality}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
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

export default BasicDetails;
