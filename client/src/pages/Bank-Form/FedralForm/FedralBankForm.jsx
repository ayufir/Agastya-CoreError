import React, { useState } from "react";
import Customer from "./CustomerDetails";
import PropertyAndDocument from "./PropertyAndDocumentDetails";
import PhysicalDetails from "./PhysicalDetails";
import OccupancyFrom from "./OccupancyDetails";
import ValuationFrom from "./ValuationFedForm";
import StageConstructionFrom from "./StageOfConstructionForm";
import { useNavigate } from "react-router-dom";
import { createFedralBank } from "../../../redux/features/Banks/FedralBankForm/FedralBankThunk";
import { useDispatch } from "react-redux";
const FedralBankForm = () => {
  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = async (formData) => {
    const updatedData = {
      ...collectedData,
      [`step${step}`]: formData,
    };
    setCollectedData(updatedData);

    if (step === 6) {
      const finalData = {
        ...updatedData.step1,
        ...updatedData.step2,
        ...updatedData.step3,
        ...updatedData.step4,
        ...updatedData.step5,
        ...updatedData.step6,
      };

      console.log(finalData, "Submitting Final Data");

      try {
        const response = await dispatch(createFedralBank(finalData)).unwrap();
        navigate(`/bank/fedral/${response._id}`);
      } catch (error) {
        console.error("Submission failed:", error);
        alert("❌ Submission failed. Please try again.");
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className='container mx-auto mt-4'>
      <h3 className='text-3xl font-bold mb-4'>Complete Valuation Report</h3>
      <p className='text-gray-600 mb-4'>Step {step <= 6 ? step : 6} of 6</p>

      {step === 1 && <Customer onNext={handleNext} />}
      {step === 2 && <PropertyAndDocument onNext={handleNext} />}
      {step === 3 && <PhysicalDetails onNext={handleNext} />}
      {step === 4 && <OccupancyFrom onNext={handleNext} />}
      {step === 5 && <ValuationFrom onNext={handleNext} />}

      {step === 6 && <StageConstructionFrom onNext={handleNext} />}

      {step > 6 && (
        <div className='text-green-600 font-semibold mt-4'>
          ✅ All steps completed. Form submitted.
        </div>
      )}
    </div>
  );
};

export default FedralBankForm;
