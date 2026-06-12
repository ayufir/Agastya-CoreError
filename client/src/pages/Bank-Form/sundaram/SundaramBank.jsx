import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Step Components (adjust paths as needed)
import PlanApprovalForm from "./form/PlanApprovel";
import Characteristic from "./form/Characteristic";
import ValuationForm from "./form/ValuationForm";
import DocumentPage from "./form/DocumentPage";
import RemarksForm from "./form/RemarksForm";
import AutoFillForm from "../../AutoFillForm";

// Redux Thunk
import { createExtendedValuation } from "../../../redux/features/Banks/sundaram/sundaramThunks";
import toast from "react-hot-toast";

const SundaramBank = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   const { loading, error } = useSelector((state) => state.sundaramBank); // adjust if your slice name differs

  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});
  const [extractedData, setExtractedData] = useState({});

  const handleNext = async (formData) => {
    const updatedData = {
      ...collectedData,
      [`step${step}`]: formData,
    };

    setCollectedData(updatedData);

    if (step === 5) {
      const finalData = {
        ...updatedData.step1,
        ...updatedData.step2,
        ...updatedData.step3,
        ...updatedData.step4,
        ...updatedData.step5,
      };

      console.log("Final Data to be submitted:", finalData);
      try {
        const response = await dispatch(
          createExtendedValuation(finalData)
        ).unwrap();
        navigate(`/bank/sundaram/${response._id}`);
        toast.success("Form submitted successfully!");
      } catch (err) {
        console.error("Submission failed:", err);
      }
    }

    setStep((prev) => prev + 1);
  };

  return (
    <div className='bg-gray-100 py-4 px-2'>
      <div className='max-w-6xl mx-auto bg-white shadow rounded p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Sundaram Bank Valuation Form</h1>
          <p className='text-gray-500'>Step {step <= 5 ? step : 5} of 5</p>
        </div>

        <AutoFillForm setFormData={setExtractedData} />

        {step === 1 && <PlanApprovalForm extractedData={extractedData} onNext={handleNext} />}
        {step === 2 && <Characteristic extractedData={extractedData} onNext={handleNext} />}
        {step === 3 && <ValuationForm extractedData={extractedData} onNext={handleNext} />}
        {step === 4 && <DocumentPage extractedData={extractedData} onNext={handleNext} />}
        {step === 5 && <RemarksForm extractedData={extractedData} onNext={handleNext} />}

        {step > 5 && (
          <div className='text-green-600 font-semibold'>
            ✅ All steps completed. Form submitted.
          </div>
        )}

        {/* {loading && <p className='text-blue-600'>Submitting...</p>}
        {error && <p className='text-red-600'>Error: {error}</p>} */}
      </div>
    </div>
  );
};

export default SundaramBank;
