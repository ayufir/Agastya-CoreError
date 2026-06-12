// import { useState } from "react";
// import Basicdeatils from "./BasicDetails";
// import Surrondingdeatils from "./SurroundingDetails";
// import Propertydeatils from "./PropertyDetails";
// import Valuationdeatils from "./ValuationDetails";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {createSamstaflnBank } from "../../redux/features/SamstaflnBankForm/SamstaflnBankThunk"; // Replace with actual action path

// const SamstaflnBankForm = () => {
//   const [step, setStep] = useState(1);
//   const [collectedData, setCollectedData] = useState({});
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleNext = async (formData) => {
//     const updatedData = {
//       ...collectedData,
//       [`step${step}`]: formData,
//     };

//     setCollectedData(updatedData);

//     if (step === 4) {
//       const finalData = {
//         ...updatedData.step1,
//         ...updatedData.step2,
//         ...updatedData.step3,
//         ...updatedData.step4,

//       };

//       console.log(finalData, "Submitting Final Data");

//       try {
//         const response = await dispatch(createSamstaflnBank(finalData)).unwrap();
//         navigate(`/bank/samasta/${response._id}`);
//       } catch (error) {
//         console.error("Submission failed:", error);
//         alert("❌ Submission failed. Please try again.");
//       }
//     } else {
//       setStep((prev) => prev + 1);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h3 className="text-2xl font-bold text-gray-800 mb-6">ICICI Valuation Report</h3>
//       <p className="text-gray-600 mb-4">Step {step <= 4 ? step : 4} of 4</p>

//       {step === 1 && <Basicdeatils onNext={handleNext} />}
//       {step === 2 && <Surrondingdeatils onNext={handleNext} />}
//       {step === 3 && <Propertydeatils onNext={handleNext} />}
//       {step === 4 && <Valuationdeatils onNext={handleNext} />}

//       {step > 4 && (
//         <div className="text-green-600 font-semibold mt-4">
//           ✅ All steps completed. Form submitted.
//         </div>
//       )}
//     </div>
//   );
// };

// export default SamstaflnBankForm;

import { useState } from "react";
import BasicDetails from "./BasicDetails";
import SurroundingDetails from "./SurroundingDetails";
import PropertyDetails from "./PropertyDetails";
import ValuationDetails from "./ValuationDetails";
import AutoFillForm from "../../AutoFillForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSamstaflnBank } from "../../../redux/features/Banks/SamstaflnBankForm/SamstaflnBankThunk";

const SamstaflnBankForm = () => {
  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});
  const [extractedData, setExtractedData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = async (formData) => {
    const updatedData = {
      ...collectedData,
      [`step${step}`]: formData,
    };

    setCollectedData(updatedData);

    if (step === 4) {
      const finalData = {
        ...updatedData.step1,
        ...updatedData.step2,
        ...updatedData.step3,
        ...updatedData.step4,
      };

      console.log(finalData, "Submitting Final Data");

      try {
        const response = await dispatch(
          createSamstaflnBank(finalData)
        ).unwrap();
        navigate(`/bank/samasta/${response._id}`);
      } catch (error) {
        console.error("Submission failed:", error);
        alert("❌ Submission failed. Please try again.");
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className='container mt-4'>
      <h3 className='text-2xl font-bold text-gray-800 mb-6'>
        ICICI Valuation Report
      </h3>
      <p className='text-gray-600 mb-4'>Step {step <= 4 ? step : 4} of 4</p>

      <AutoFillForm setFormData={setExtractedData} />

      {step === 1 && <BasicDetails extractedData={extractedData} onNext={handleNext} />}
      {step === 2 && <SurroundingDetails extractedData={extractedData} onNext={handleNext} />}
      {step === 3 && <PropertyDetails extractedData={extractedData} onNext={handleNext} />}
      {step === 4 && <ValuationDetails extractedData={extractedData} onNext={handleNext} />}

      {step > 4 && (
        <div className='text-green-600 font-semibold mt-4'>
          ✅ All steps completed. Form submitted.
        </div>
      )}
    </div>
  );
};

export default SamstaflnBankForm;
