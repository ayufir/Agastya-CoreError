// import React, { useState } from "react";
// import ProfecutsDeatils from "./Form/ProfecutsDetails";
// import PropertyDetails from "./Form/PropertyDetails";
// import ValuationDetails from "./Form/ValuationDetails";

// const Profectus = () => {
//   const [profecutsData, setProfecutsData] = useState({});
//   const [propertyData, setPropertyData] = useState({});
//   const [valuationData, setValuationData] = useState({});

//   console.log(profecutsData, "ProfecutsData");

//   // Handle data change for each child form
//   const handleProfecutsDataChange = (newData) => {
//     setProfecutsData((prev) => ({ ...prev, ...newData }));
//   };

//   const handlePropertyDataChange = (newData) => {
//     setPropertyData((prev) => ({ ...prev, ...newData }));
//   };

//   const handleValuationDataChange = (newData) => {
//     setValuationData((prev) => ({ ...prev, ...newData }));
//   };

//   // Handle submit
//   const handleSubmit = () => {
//     const finalData = {
//       ...profecutsData,
//       ...propertyData,
//       ...valuationData,
//     };

//     // Here, send finalData to your API (using fetch or axios)
//     console.log("Final Submit Data:", finalData);
//     // API call example: apiCall(finalData)
//   };

//   return (
//     <div>
//       <ProfecutsDeatils onDataChange={handleProfecutsDataChange} />
//       <PropertyDetails onDataChange={handlePropertyDataChange} />
//       <ValuationDetails onDataChange={handleValuationDataChange} />

//       {/* Submit Button */}
//       <button onClick={handleSubmit} className='btn btn-primary'>
//         Submit All Details
//       </button>
//     </div>
//   );
// };

// export default Profectus;

import React, { useState } from "react";
import ProfecutsDetails from "./Form/ProfecutsDetails";
import PropertyDetails from "./Form/PropertyDetails";
import ValuationDetails from "./Form/ValuationDetails";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createBankReport } from "../../../redux/features/Banks/Profectus/profectusThunks";
import toast from "react-hot-toast";
import AutoFillForm from "../../AutoFillForm";

const Profectus = () => {
  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});
  const [extractedData, setExtractedData] = useState({});

  // console.log(collectedData, "COLLECTED DATA");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const handleNext = async (formData) => {
    const updatedData = {
      ...collectedData,
      [`step${step}`]: formData,
    };

    setCollectedData(updatedData);

    if (step === 3) {
      const finalData = {
        ...updatedData.step1,
        ...updatedData.step2,
        ...updatedData.step3,
      };

      try {
        if (!id) {
          const response = await dispatch(createBankReport(finalData)).unwrap();
          navigate(`/bank/profectus/${response.data._id}`);
          toast.success("Form submitted successfully!");
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    }

    setStep((prev) => prev + 1);
  };

  return (
    <div className='bg-gray-100 py-4 px-4 min-h-screen'>
      <div className='max-w-6xl mx-auto bg-white shadow-md rounded p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Complete Valuation Report</h1>
          <p className='text-gray-600'>Step {step <= 3 ? step : 3} of 3</p>
        </div>

        <AutoFillForm setFormData={setExtractedData} />

        {step === 1 && <ProfecutsDetails extractedData={extractedData} onNext={handleNext} />}
        {step === 2 && <PropertyDetails extractedData={extractedData} onNext={handleNext} />}
        {step === 3 && <ValuationDetails extractedData={extractedData} onNext={handleNext} />}

        {step > 3 && (
          <div className='text-green-600 font-semibold'>
            ✅ All steps completed. Check console for final data.
          </div>
        )}
      </div>
    </div>
  );
};

export default Profectus;
