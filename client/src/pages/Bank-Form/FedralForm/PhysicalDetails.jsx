// import React, { useState } from 'react';

// const PhysicalDetails = ({ onNext }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [formData, setFormData] = useState({});

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
//     <div className="mb-6 border rounded">
//       <div
//         className="p-4 bg-gray-800 text-white flex justify-between items-center cursor-pointer"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <h4 className="text-lg font-semibold">Physical Details</h4>
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
//         <div className="p-4 bg-gray-100">
//           <h5 className="text-lg font-semibold mb-2">Four Boundaries of Property</h5>
//           <div className="flex flex-wrap -mx-2">
//             {['East', 'West', 'North', 'South'].map((dir) => (
//               <React.Fragment key={dir}>
//                 <div className="w-full md:w-1/3 px-2 mb-4">
//                   <label className="block mb-1">{dir} - As per deed</label>
//                   <input
//                     type="text"
//                     name={`deed_${dir}`}
//                     value={formData[`deed_${dir}`] || ''}
//                     onChange={handleChange}
//                     className="w-full border p-2 rounded"
//                   />
//                 </div>
//                 <div className="w-full md:w-1/3 px-2 mb-4">
//                   <label className="block mb-1">{dir} - As per Plan</label>
//                   <input
//                     type="text"
//                     name={`plan_${dir}`}
//                     value={formData[`plan_${dir}`] || ''}
//                     onChange={handleChange}
//                     className="w-full border p-2 rounded"
//                   />
//                 </div>
//                 <div className="w-full md:w-1/3 px-2 mb-4">
//                   <label className="block mb-1">{dir} - Actual at site</label>
//                   <input
//                     type="text"
//                     name={`actual_${dir}`}
//                     value={formData[`actual_${dir}`] || ''}
//                     onChange={handleChange}
//                     className="w-full border p-2 rounded"
//                   />
//                 </div>
//               </React.Fragment>
//             ))}
//           </div>

//           <div className="flex flex-wrap -mx-2">
//             <div className="w-full md:w-1/2 px-2 mb-4">
//               <label className="block mb-1">Boundaries Matching</label>
//               <select
//                 name="boundariesMatching"
//                 value={formData.boundariesMatching || ''}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               >
//                 <option value="">Select</option>
//                 <option value="YES">YES</option>
//                 <option value="NO">NO</option>
//               </select>
//             </div>
//             <div className="w-full md:w-1/2 px-2 mb-4">
//               <label className="block mb-1">Construction as per Approved Plan</label>
//               <input
//                 type="text"
//                 name="constructionPlan"
//                 value={formData.constructionPlan || ''}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               />
//             </div>
//           </div>

//           {/* Add more fields below following similar Tailwind and controlled structure */}
//           {/* Plot Details, Utilities, Location, Type, Structure, etc. */}

//           {/* Example continuation */}
//           <div className="flex flex-wrap -mx-2">
//             <div className="w-full md:w-1/3 px-2 mb-4">
//               <label className="block mb-1">Plot Area as per Measurement</label>
//               <input
//                 type="text"
//                 name="plotArea"
//                 value={formData.plotArea || ''}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               />
//             </div>
//             <div className="w-full md:w-1/3 px-2 mb-4">
//               <label className="block mb-1">Plot Demarcated at Site</label>
//               <select
//                 name="demarcatedSite"
//                 value={formData.demarcatedSite || ''}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               >
//                 <option value="">Select</option>
//                 <option value="YES">YES</option>
//                 <option value="NO">NO</option>
//               </select>
//             </div>
//             <div className="w-full md:w-1/3 px-2 mb-4">
//               <label className="block mb-1">Land Use (As per master plan)</label>
//               <input
//                 type="text"
//                 name="landUse"
//                 value={formData.landUse || ''}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               />
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md"
//          onClick={handleSubmit} >
//             Next
//           </button>

//           {/* Continue similar blocks for remaining fields... */}

//         </div>
//       )}
//     </div>
//   );
// };

// export default PhysicalDetails;



import React, { useState, useEffect } from 'react';

const PhysicalDetails = ({ onNext, initialData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    deed_East: '',
    deed_West: '',
    deed_North: '',
    deed_South: '',
    plan_East: '',
    plan_West: '',
    plan_North: '',
    plan_South: '',
    actual_East: '',
    actual_West: '',
    actual_North: '',
    actual_South: '',
    boundariesMatching: '',
    constructionPlan: '',
    plotArea: '',
    demarcatedSite: '',
    landUse: ''
  });

  // Fill form with initial data (if provided)
  useEffect(() => {
    if (initialData) {
      setFormData((prevData) => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData); // Pass data to the parent component when Next is clicked
  };

  return (
    <div className="mb-6 border rounded">
      <div
        className="p-4 bg-gray-800 text-white flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-semibold">Physical Details</h4>
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
        <div className="p-4 bg-gray-100">
          <h5 className="text-lg font-semibold mb-2">Four Boundaries of Property</h5>
          <div className="flex flex-wrap -mx-2">
            {['East', 'West', 'North', 'South'].map((dir) => (
              <React.Fragment key={dir}>
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block mb-1">{dir} - As per deed</label>
                  <input
                    type="text"
                    name={`deed_${dir}`}
                    value={formData[`deed_${dir}`] || ''}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block mb-1">{dir} - As per Plan</label>
                  <input
                    type="text"
                    name={`plan_${dir}`}
                    value={formData[`plan_${dir}`] || ''}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block mb-1">{dir} - Actual at site</label>
                  <input
                    type="text"
                    name={`actual_${dir}`}
                    value={formData[`actual_${dir}`] || ''}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1">Boundaries Matching</label>
              <select
                name="boundariesMatching"
                value={formData.boundariesMatching || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block mb-1">Construction as per Approved Plan</label>
              <input
                type="text"
                name="constructionPlan"
                value={formData.constructionPlan || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Example continuation */}
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label className="block mb-1">Plot Area as per Measurement</label>
              <input
                type="text"
                name="plotArea"
                value={formData.plotArea || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label className="block mb-1">Plot Demarcated at Site</label>
              <select
                name="demarcatedSite"
                value={formData.demarcatedSite || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label className="block mb-1">Land Use (As per master plan)</label>
              <input
                type="text"
                name="landUse"
                value={formData.landUse || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit} // Call handleSubmit on click
            className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md"
          >
            Next
          </button>

        </div>
      )}
    </div>
  );
};

export default PhysicalDetails;
