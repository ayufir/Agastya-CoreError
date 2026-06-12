import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import ValuationDetails from "./ValuationReportForm";
import SideBoundaries from "./SideBoundaries";
import PlanApproval from "./PlanApproval";
import ActualPlan from "./ActualPlan";
import AutoFillForm from "../../AutoFillForm";

import { createProtiumBank } from "../../../redux/features/Banks/Protium/ProtiumBankThunk";

const ProtiumForm = () => {
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

      try {
        const response = await dispatch(createProtiumBank(finalData)).unwrap();
        navigate(`/bank/protium/${response._id}`);
      } catch (error) {
        console.error("Submission failed:", error);
        alert("❌ Submission failed. Please try again.");
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className='container mx-auto px-4 py-6'>
      <h3 className='text-2xl font-bold text-gray-800 mb-4'>
        Protium Bank Report
      </h3>
      <p className='text-gray-600 mb-6'>Step {step <= 4 ? step : 4} of 4</p>

      <AutoFillForm setFormData={setExtractedData} />

      {step === 1 && <ActualPlan extractedData={extractedData} onNext={handleNext} />}
      {step === 2 && <PlanApproval extractedData={extractedData} onNext={handleNext} />}
      {step === 3 && <SideBoundaries extractedData={extractedData} onNext={handleNext} />}
      {step === 4 && <ValuationDetails extractedData={extractedData} onNext={handleNext} />}

      {step > 4 && (
        <div className='text-green-600 font-semibold mt-4'>
          ✅ All steps completed. Form submitted.
        </div>
      )}
    </div>
  );
};

export default ProtiumForm;
