import { Card } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import FormComponent from "./Form/FormComponent";
import SpecialRemarks from "./Form/SpecialRemarks";
import DeclarationForm from "./Form/DeclarationForm";
import DescriptionAndValuations from "./Form/DescriptionAndValuations";
import { createDmiFinanceReport } from "../../../redux/features/Banks/dmiFinance/dmiFinanceThunks";

const DmiFinance = () => {
  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = async (formData) => {
    const updatedData = { ...collectedData, [`step${step}`]: formData };

    setCollectedData(updatedData);

    if (step === 4) {
      const finalData = {
        ...updatedData.step1,
        ...updatedData.step2,
        ...updatedData.step3,
        ...updatedData.step4,
      };

      // console.log("dmi finalData", finalData);
      try {
        const response = await dispatch(
          createDmiFinanceReport(finalData)
        ).unwrap();
        navigate(`/bank/dmi-finance/${response._id}`);
        toast.success("Form submitted successfully");
      } catch (err) {
        console.error("dmi-finance form submission failed:", err);
      }
    }
    setStep((prev) => prev + 1);
  };

  return (
    <div className='mb-3 max-w-6xl mt-4 mx-auto'>
      <Card
        title={
          <div className='flex justify-between items-center'>
            <span className='font-semibold text-lg'>DMI Finance Report</span>
            <span className='text-gray-500'>
              Step {step <= 4 ? step : 4} of 4
            </span>
          </div>
        }
        className='shadow-md rounded-2xl'
      >
        {step === 1 && <FormComponent onNext={handleNext} />}
        {step === 2 && <DescriptionAndValuations onNext={handleNext} />}
        {step === 3 && <SpecialRemarks onNext={handleNext} />}
        {step === 4 && <DeclarationForm onNext={handleNext} />}

        {step > 4 && (
          <div className='text-green-600 font-semibold mt-4'>
            ✅ All steps completed. Data saved locally.
          </div>
        )}
      </Card>
    </div>
  );
};

export default DmiFinance;
