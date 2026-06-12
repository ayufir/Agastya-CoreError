import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LocationForm from "./forms/LocationFrom";
import StageConstruction from "./forms/StageConstruction";
import DocumentUpload from "./forms/DocumentUpload";
import RemarksForm from "./forms/RemarksFrom";
import Specifications from "./forms/Specifications";
import PropertyDetailsForm from "./forms/PropertyDetailsForm";
import {
  createDetails,
  getDetailsById,
  updateDetails,
} from "../../../redux/features/Banks/CholaBank/CholaThunks";
import toast from "react-hot-toast";

const CholaForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});
  const { loading, error } = useSelector((state) => state.chola);

  const [isEdit, setIsEdit] = useState({});
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const editPageHandle = async (id) => {
        try {
          const response = await dispatch(getDetailsById(id)).unwrap();
          console.log(response, "DSS");

          setIsEdit(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      editPageHandle(id);
    }
  }, [id]);

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

      try {
        const response = await dispatch(createDetails(finalData)).unwrap();
        navigate(`/bank/chola/${response.newCholaData._id}`);
        toast.success("Form submitted successfully");
      } catch (err) {
        console.error("Chola form submission failed:", err);
      }
    }

    setStep((prev) => prev + 1);
  };

  return (
    <div className='bg-gray-100 py-2 px-2'>
      <div className='max-w-6xl mx-auto bg-white shadow rounded p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Chola Bank Report Form</h1>
          <p className='text-gray-500'>Step {step <= 6 ? step : 6} of 6</p>
        </div>

        <LocationForm isEdit={isEdit} onNext={handleNext} />
        <PropertyDetailsForm isEdit={isEdit} onNext={handleNext} />
        <Specifications isEdit={isEdit} onNext={handleNext} />
        <StageConstruction isEdit={isEdit} onNext={handleNext} />
        <DocumentUpload isEdit={isEdit} onNext={handleNext} />
        <RemarksForm isEdit={isEdit} onNext={handleNext} />

        {step > 6 && (
          <div className='text-green-600 font-semibold'>
            ✅ All steps completed. Chola form submitted.
          </div>
        )}

        {loading && <p className='text-blue-600'>Submitting...</p>}
        {error && <p className='text-red-600'>Error: {error}</p>}
      </div>
    </div>
  );
};

export default CholaForm;
