import React, { useState } from "react";
import AgencyName from "./Form/AgencyName";
import ApprovedPlanForm from "./Form/ApprovedPlanForm";
import PermissibleArea from "./Form/PermissibleArea";
import PanchayatPropertyForm from "./Form/PanchayatPropertyForm";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createReport } from "../../../redux/features/Banks/bajajAmeriya/bajajThunks";
import { finalUpdate } from "../../../redux/features/case/caseThunks";

const BajajAmeriya = () => {
  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});
  const [isEdit, setIsEdit] = useState({}); // Static for now (no API)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();

  const handleNext = async (formData) => {
    const updatedData = { ...collectedData, [`step${step}`]: formData };
    setCollectedData(updatedData);
    setStep((prev) => prev + 1);
  };

  const getFinalData = () => {
    return {
      ...collectedData.step1,
      ...collectedData.step2,
      ...collectedData.step3,
      ...collectedData.step4,
    };
  };

  const handleSubmit = async () => {
    const finalData = getFinalData();
    try {
      const response = await dispatch(createReport(finalData)).unwrap();
      navigate(`/bank/bajaj-ameriya-bank/${response.data._id}`);
      toast.success("Form submitted successfully");
    } catch (err) {
      console.error("Bajaj Ameriya form submission failed:", err);
      toast.error("Submission failed");
    }
  };

  const lastUpdate = async () => {
    const finalData = getFinalData();
    try {
      let targetId = id;
      if (!targetId) {
        const response = await dispatch(createReport(finalData)).unwrap();
        targetId = response.data?._id || response._id;
      }

      if (targetId) {
        await dispatch(
          finalUpdate({ id: targetId, bankName: "bajajameriya", updateData: finalData })
        ).unwrap();
        toast.success("Case submitted finally!");
        navigate("/");
      } else {
        toast.error("Failed to create report for final submission");
      }
    } catch (err) {
      console.error("Final submission failed", err);
      toast.error("Final submission failed");
    }
  };

  return (
    <div className='bg-gray-100 py-2 px-2'>
      <div className='max-w-8xl mx-auto bg-white shadow rounded p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Bajaj Ameriya Form</h1>
          <p className='text-gray-500'>Step {step <= 4 ? step : 4} of 4</p>
        </div>

        {step === 1 && <AgencyName isEdit={isEdit} onNext={handleNext} />}
        {step === 2 && <ApprovedPlanForm isEdit={isEdit} onNext={handleNext} />}
        {step === 3 && <PermissibleArea isEdit={isEdit} onNext={handleNext} />}
        {step === 4 && (
          <PanchayatPropertyForm isEdit={isEdit} onNext={handleNext} />
        )}

        {step > 4 && (
          <div className='font-semibold'>
            <div className='text-green-600 mb-4'>✅ All steps completed.</div>
            <div className='flex gap-4'>
              <button
                className='px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition'
                onClick={handleSubmit}
              >
                Submit Report
              </button>

              {(user?.role === "Admin" || user?.role === "SuperAdmin") && (
                <button
                  onClick={lastUpdate}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-semibold"
                >
                  Final Submit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BajajAmeriya;
