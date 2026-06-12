// import React, { useState } from 'react';

// const CustomerDetails = ({ onNext }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleChange = (e) => {

//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
// }
//     const handleSubmit = () => {
//     onNext(formData);
//   };

//   return (
//     <div className="mb-4 border rounded overflow-hidden">
//       <div
//         className="bg-gray-800 p-4 text-white flex justify-between items-center cursor-pointer"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h4 className="text-lg font-semibold">Customer Details</h4>
//         <button
//           type="button"
//           className="bg-white text-gray-800 text-sm px-3 py-1 rounded"
//           onClick={(e) => {
//             e.stopPropagation();
//             setIsOpen(!isOpen);
//           }}
//         >
//           {isOpen ? 'Close' : 'Edit'}
//         </button>
//       </div>

//       {isOpen && (
//         <div className="bg-gray-100 p-4 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <InputField
//               label="Product"
//               name="product"
//               value={formData.product || ''}
//               onChange={handleChange}
//             />
//             <InputField
//               label="Branch"
//               name="branch"
//               value={formData.branch || ''}
//               onChange={handleChange}
//             />
//             <InputField
//               label="Date of Report"
//               name="reportDate"
//               type="date"
//               value={formData.reportDate || ''}
//               onChange={handleChange}
//             />
//           </div>

//           <h5 className="text-md font-semibold">CUSTOMER DETAILS</h5>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <InputField
//               label="Application Number"
//               name="applicationNumber"
//               value={formData.applicationNumber || ''}
//               onChange={handleChange}
//             />
//             <InputField
//               label="Reference Number"
//               name="referenceNumber"
//               value={formData.referenceNumber || ''}
//               onChange={handleChange}
//             />
//             <InputField
//               label="Customer Name"
//               name="customerName"
//               value={formData.customerName || ''}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <InputField
//               label="Current Property Owner Name (as per document)"
//               name="propertyOwnerName"
//               value={formData.propertyOwnerName || ''}
//               onChange={handleChange}
//             />
//             <InputField
//               label="Co-applicant Details"
//               name="coApplicantDetails"
//               value={formData.coApplicantDetails || ''}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <InputField
//               label="Proposed Owner/s"
//               name="proposedOwners"
//               value={formData.proposedOwners || ''}
//               onChange={handleChange}
//             />
//             <InputField
//               label="Date & Time of Inspection"
//               name="inspectionDateTime"
//               type="datetime-local"
//               value={formData.inspectionDateTime || ''}
//               onChange={handleChange}
//             />
//             <InputField
//               label="Visit Done By"
//               name="visitDoneBy"
//               value={formData.visitDoneBy || ''}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <InputField
//               label="Case Type"
//               name="caseType"
//               value={formData.caseType || ''}
//               onChange={handleChange}
//             />
//             <InputField
//               label="Person met at site"
//               name="personMetAtSite"
//               value={formData.personMetAtSite || ''}
//               onChange={handleChange}
//             />
//             <InputField
//               label="Relationship with customer"
//               name="relationshipWithCustomer"
//               value={formData.relationshipWithCustomer || ''}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <InputField
//               label="Contact Number of person met at site"
//               name="contactNumber"
//               value={formData.contactNumber || ''}
//               onChange={handleChange}
//             />
//           </div>
//         </div>
        
//       )}
//       <button
//             type="submit"
//             className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md"
//          onClick={handleSubmit} >
//             Next
//           </button>
//     </div>
//   );
// };

// const InputField = ({ label, name, type = 'text', value, onChange }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//     />
//   </div>
// );

// export default CustomerDetails;



import React, { useState } from 'react';

const CustomerDetails = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    branch: '',
    reportDate: '',
    applicationNumber: '',
    referenceNumber: '',
    customerName: '',
    propertyOwnerName: '',
    coApplicantDetails: '',
    proposedOwners: '',
    inspectionDateTime: '',
    visitDoneBy: '',
    caseType: '',
    personMetAtSite: '',
    relationshipWithCustomer: '',
    contactNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div className="mb-4 border rounded overflow-hidden">
      <div
        className="bg-gray-800 p-4 text-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-semibold">Customer Details</h4>
        <button
          type="button"
          className="bg-white text-gray-800 text-sm px-3 py-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? 'Close' : 'Edit'}
        </button>
      </div>

      {isOpen && (
        <div className="bg-gray-100 p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Product"
              name="product"
              value={formData.product}
              onChange={handleChange}
            />
            <InputField
              label="Branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
            />
            <InputField
              label="Date of Report"
              name="reportDate"
              type="date"
              value={formData.reportDate}
              onChange={handleChange}
            />
          </div>

          <h5 className="text-md font-semibold">CUSTOMER DETAILS</h5>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Application Number"
              name="applicationNumber"
              value={formData.applicationNumber}
              onChange={handleChange}
            />
            <InputField
              label="Reference Number"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
            />
            <InputField
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Current Property Owner Name (as per document)"
              name="propertyOwnerName"
              value={formData.propertyOwnerName}
              onChange={handleChange}
            />
            <InputField
              label="Co-applicant Details"
              name="coApplicantDetails"
              value={formData.coApplicantDetails}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Proposed Owner/s"
              name="proposedOwners"
              value={formData.proposedOwners}
              onChange={handleChange}
            />
            <InputField
              label="Date & Time of Inspection"
              name="inspectionDateTime"
              type="datetime-local"
              value={formData.inspectionDateTime}
              onChange={handleChange}
            />
            <InputField
              label="Visit Done By"
              name="visitDoneBy"
              value={formData.visitDoneBy}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Case Type"
              name="caseType"
              value={formData.caseType}
              onChange={handleChange}
            />
            <InputField
              label="Person met at site"
              name="personMetAtSite"
              value={formData.personMetAtSite}
              onChange={handleChange}
            />
            <InputField
              label="Relationship with customer"
              name="relationshipWithCustomer"
              value={formData.relationshipWithCustomer}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Contact Number of person met at site"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
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

const InputField = ({ label, name, type = 'text', value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default CustomerDetails;
