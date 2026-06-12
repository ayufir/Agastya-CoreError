// import React, { useState } from 'react';

// const ValuationFedForm = ({ onNext }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleOpen = () => setIsOpen(!isOpen);
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
//     <div className="accordion-item mb-4">
//       <div
//         className="accordion-header p-3 border rounded bg-[#30384B] cursor-pointer"
//         onClick={toggleOpen}
//       >
//         <div className="flex justify-between items-center text-white">
//           <h4 className="m-0">7. VALUATION</h4>
//           <button
//             type="button"
//             className="btn btn-light btn-sm"
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleOpen();
//             }}
//           >
//             {isOpen ? "Close" : "Edit"}
//           </button>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="accordion-body p-3 border rounded mt-2 bg-[#f8f9fa]">
//           <div className="card-body">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Land Area as per Plan</label>
//                 <input className="form-input" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Land Area as per Document (in sq.ft.)</label>
//                 <input className="form-input" defaultValue="600" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Land Area as per Site (in sq.ft.)</label>
//                 <input className="form-input" defaultValue="600" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Land Rate (per sq.ft.)</label>
//                 <input className="form-input" defaultValue="1500" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Land Value</label>
//                 <input className="form-input" defaultValue="900000" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">FSI Considered for Valuation</label>
//                 <input className="form-input" defaultValue="0.63" />
//               </div>
//             </div>
//             <hr className="my-4" />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Type of Area</label>
//                 <input className="form-input" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Built Up Area</label>
//                 <input className="form-input" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Floor</label>
//                 <input className="form-input" defaultValue="G.F" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Area (sq.ft.)</label>
//                 <input className="form-input" defaultValue="375" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Rate (per sq.ft.)</label>
//                 <input className="form-input" defaultValue="1200" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Amount (Rs)</label>
//                 <input className="form-input" defaultValue="450000" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Total Existing Value of Property (Rs)</label>
//                 <input className="form-input" defaultValue="1350000" />
//               </div>
//             </div>
//             <hr className="my-4" />
//             <h6 className="font-semibold">To Be Filled ONLY For Construction & Improvement Cases</h6>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Floor</label>
//                 <input className="form-input" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Area (sq.ft.)</label>
//                 <input className="form-input" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Rate (per sq.ft.)</label>
//                 <input className="form-input" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Amount (Rs)</label>
//                 <input className="form-input" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Total (Proposed Construction)</label>
//                 <input className="form-input" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Cost as per Estimate of Customer (Rs)</label>
//                 <input className="form-input" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Rate/Sqft as per Estimate</label>
//                 <input className="form-input" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Expected Date of Completion</label>
//                 <input type="date" className="form-input" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Material at Site (Yes/No)</label>
//                 <input className="form-input" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Description</label>
//                 <input className="form-input" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Rs./sqft</label>
//                 <input className="form-input" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Qty.</label>
//                 <input className="form-input" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Total Value</label>
//                 <input className="form-input" />
//               </div>
//             </div>
//             <hr className="my-4" />
//             <h6 className="font-semibold">Value of Extra Amenities</h6>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Total Property Valuation (A+B+C) (Rs)</label>
//                 <input className="form-input" defaultValue="1350000" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Valuation as per Govt. Guideline Rate</label>
//                 <input className="form-input" defaultValue="654" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Land Value as per Govt. Guideline Rate (Rs)</label>
//                 <input className="form-input" defaultValue="392400" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Realizable Value (90% of Market Value)</label>
//                 <input className="form-input" defaultValue="1215000" />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Distressed Value (80% of Market Value)</label>
//                 <input className="form-input" defaultValue="1080000" />
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-sm font-semibold">Marketability</label>
//                 <input className="form-input" defaultValue="GOOD" />
//               </div>
//             </div>
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

// export default ValuationFedForm;





import React, { useState } from 'react';

const ValuationFedForm = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    landAreaPlan: '',
    landAreaDocument: '600',
    landAreaSite: '600',
    landRate: '1500',
    landValue: '900000',
    fsiConsidered: '0.63',
    typeOfArea: '',
    builtUpArea: '',
    floor: 'G.F',
    area: '375',
    rate: '1200',
    amount: '450000',
    totalExistingValue: '1350000',
    proposedFloor: '',
    proposedArea: '',
    proposedRate: '',
    proposedAmount: '',
    totalProposedConstruction: '',
    costEstimate: '',
    rateEstimate: '',
    completionDate: '',
    materialAtSite: '',
    materialDescription: '',
    extraAmenities: '',
    totalPropertyValuation: '1350000',
    govtGuidelineRate: '654',
    landValueGovtRate: '392400',
    realizableValue: '1215000',
    distressedValue: '1080000',
    marketability: 'GOOD',
  });

  const toggleOpen = () => setIsOpen(!isOpen);

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
    <div className="accordion-item mb-4">
      <div
        className="accordion-header p-3 border rounded bg-[#30384B] cursor-pointer"
        onClick={toggleOpen}
      >
        <div className="flex justify-between items-center text-white">
          <h4 className="m-0">7. VALUATION</h4>
          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleOpen();
            }}
          >
            {isOpen ? 'Close' : 'Edit'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="accordion-body p-3 border rounded mt-2 bg-[#f8f9fa]">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <div className="flex flex-col">
                <label className="text-sm font-semibold">Land Area as per Plan</label>
                <input
                  name="landAreaPlan"
                  className="form-input"
                  value={formData.landAreaPlan}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold">Land Area as per Document (in sq.ft.)</label>
                <input
                  name="landAreaDocument"
                  className="form-input"
                  value={formData.landAreaDocument}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <div className="flex flex-col">
                <label className="text-sm font-semibold">Land Area as per Site (in sq.ft.)</label>
                <input
                  name="landAreaSite"
                  className="form-input"
                  value={formData.landAreaSite}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold">Land Rate (per sq.ft.)</label>
                <input
                  name="landRate"
                  className="form-input"
                  value={formData.landRate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <div className="flex flex-col">
                <label className="text-sm font-semibold">Land Value</label>
                <input
                  name="landValue"
                  className="form-input"
                  value={formData.landValue}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold">FSI Considered for Valuation</label>
                <input
                  name="fsiConsidered"
                  className="form-input"
                  value={formData.fsiConsidered}
                  onChange={handleChange}
                />
              </div>
            </div>
            <hr className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <div className="flex flex-col">
                <label className="text-sm font-semibold">Type of Area</label>
                <input
                  name="typeOfArea"
                  className="form-input"
                  value={formData.typeOfArea}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold">Built Up Area</label>
                <input
                  name="builtUpArea"
                  className="form-input"
                  value={formData.builtUpArea}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* Add the remaining form fields similarly by binding them to the formData state */}
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md"
              onClick={handleSubmit}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValuationFedForm;
