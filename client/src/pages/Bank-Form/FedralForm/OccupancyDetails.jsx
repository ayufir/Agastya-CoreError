// import React, { useState } from 'react';

// const OccupancyDetails = ({ onNext }) => {
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
//     <div className="mb-4">
//       <div
//         className="p-4 border rounded cursor-pointer bg-[#30384B] text-white"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className="flex justify-between items-center">
//           <h4 className="text-lg font-semibold m-0">Occupancy & Violations Details</h4>
//           <button
//             type="button"
//             className="bg-white text-black px-3 py-1 rounded text-sm"
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsOpen(!isOpen);
//             }}
//           >
//             {isOpen ? 'Close' : 'Edit'}
//           </button>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="mt-2 p-4 border rounded bg-gray-100">
//           {/* Subject Unit */}
//           <h5 className="text-md font-semibold mb-3">Occupancy Details - Subject Unit</h5>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block mb-1 font-medium">Status of Occupancy</label>
//               <input
//                 type="text"
//                 name="statusOfOccupancy"
//                 defaultValue="VACANT"
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Occupied By</label>
//               <input
//                 type="text"
//                 name="occupiedBy"
//                 defaultValue="NA"
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Relationship of Occupant with Customer</label>
//               <input
//                 type="text"
//                 name="occupantRelationship"
//                 defaultValue="NA"
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Occupied Since</label>
//               <input
//                 type="text"
//                 name="occupiedSince"
//                 defaultValue="NA"
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//           </div>

//           {/* Subject Scheme */}
//           <h5 className="text-md font-semibold mb-3">Occupancy Details - Subject Scheme</h5>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block mb-1 font-medium">No. of Units Occupied in Particular Scheme</label>
//               <input
//                 type="text"
//                 name="unitsOccupiedInScheme"
//                 defaultValue="NA"
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Percentage of Occupancy in Particular Scheme</label>
//               <input
//                 type="text"
//                 name="occupancyPercentageInScheme"
//                 defaultValue="80%"
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block mb-1 font-medium">
//                 Percentage of Habitation in Particular Area (1 Kms)
//               </label>
//               <input
//                 type="text"
//                 name="habitationPercentage"
//                 defaultValue="85%"
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//           </div>

//           {/* Violations */}
//           <h5 className="text-md font-semibold mb-3">Violations Observed If Any</h5>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block mb-1 font-medium">Is there encroachment of land (Y/N)</label>
//               <input
//                 type="text"
//                 name="encroachment"
//                 defaultValue="NO"
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Area of Encroachment</label>
//               <input
//                 type="text"
//                 name="encroachmentArea"
//                 defaultValue="NA"
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Any Deviation in Structure</label>
//               <input
//                 type="text"
//                 name="structureDeviation"
//                 defaultValue="NA"
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">
//                 Risk of Demolition/Sealing (Nil/Low/Medium/High)
//               </label>
//               <input
//                 type="text"
//                 name="riskLevel"
//                 defaultValue="LOW"
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block mb-1 font-medium">
//                 If plans not available then is the structure confirming to local byelaws
//               </label>
//               <input
//                 type="text"
//                 name="structureConfirmingByelaws"
//                 defaultValue="NA"
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md"
//          onClick={handleSubmit} >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OccupancyDetails;



import React, { useState } from 'react';

const OccupancyDetails = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Initial state for form data
  const [formData, setFormData] = useState({
    statusOfOccupancy: 'VACANT',
    occupiedBy: 'NA',
    occupantRelationship: 'NA',
    occupiedSince: 'NA',
    unitsOccupiedInScheme: 'NA',
    occupancyPercentageInScheme: '80%',
    habitationPercentage: '85%',
    encroachment: 'NO',
    encroachmentArea: 'NA',
    structureDeviation: 'NA',
    riskLevel: 'LOW',
    structureConfirmingByelaws: 'NA'
  });

  // Handle input changes and update the state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    onNext(formData);  // Pass the form data to the parent component
  };

  return (
    <div className="mb-4">
      <div
        className="p-4 border rounded cursor-pointer bg-[#30384B] text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold m-0">Occupancy & Violations Details</h4>
          <button
            type="button"
            className="bg-white text-black px-3 py-1 rounded text-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? 'Close' : 'Edit'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 p-4 border rounded bg-gray-100">
          {/* Subject Unit */}
          <h5 className="text-md font-semibold mb-3">Occupancy Details - Subject Unit</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-1 font-medium">Status of Occupancy</label>
              <input
                type="text"
                name="statusOfOccupancy"
                value={formData.statusOfOccupancy}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Occupied By</label>
              <input
                type="text"
                name="occupiedBy"
                value={formData.occupiedBy}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Relationship of Occupant with Customer</label>
              <input
                type="text"
                name="occupantRelationship"
                value={formData.occupantRelationship}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Occupied Since</label>
              <input
                type="text"
                name="occupiedSince"
                value={formData.occupiedSince}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Subject Scheme */}
          <h5 className="text-md font-semibold mb-3">Occupancy Details - Subject Scheme</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-1 font-medium">No. of Units Occupied in Particular Scheme</label>
              <input
                type="text"
                name="unitsOccupiedInScheme"
                value={formData.unitsOccupiedInScheme}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Percentage of Occupancy in Particular Scheme</label>
              <input
                type="text"
                name="occupancyPercentageInScheme"
                value={formData.occupancyPercentageInScheme}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">
                Percentage of Habitation in Particular Area (1 Kms)
              </label>
              <input
                type="text"
                name="habitationPercentage"
                value={formData.habitationPercentage}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Violations */}
          <h5 className="text-md font-semibold mb-3">Violations Observed If Any</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Is there encroachment of land (Y/N)</label>
              <input
                type="text"
                name="encroachment"
                value={formData.encroachment}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Area of Encroachment</label>
              <input
                type="text"
                name="encroachmentArea"
                value={formData.encroachmentArea}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Any Deviation in Structure</label>
              <input
                type="text"
                name="structureDeviation"
                value={formData.structureDeviation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Risk of Demolition/Sealing (Nil/Low/Medium/High)
              </label>
              <input
                type="text"
                name="riskLevel"
                value={formData.riskLevel}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">
                If plans not available then is the structure confirming to local byelaws
              </label>
              <input
                type="text"
                name="structureConfirmingByelaws"
                value={formData.structureConfirmingByelaws}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md"
            onClick={handleSubmit}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OccupancyDetails;
