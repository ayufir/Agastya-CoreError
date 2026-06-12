import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import IndividualValuation from "./Form/IndividualValuation";
import BasicDetail from "./Form/BasicDetail";
import AreaDetails from "./Form/AreaDetails";
import Boundaries from "./Form/Boundaries";
import SurroundingLocality from "./Form/SurroundingLocality";
import SanctionPlan from "./Form/SanctionPlan";
import PropertyDetails from "./Form/PropertyDetails";
import NdmaParameters from "./Form/NdmdParameters";
import BuildingDetails from "./Form/BuildingDetails";
import Valuation from "./Form/Valuation";
import StageConstruction from "./Form/StageConstruction";
import OtherValue from "./Form/OtherValue";
import AutoFillForm from "../../AutoFillForm";

import {
  createDetails,
  getDetailsById,
  updateDetails,
} from "../../../redux/features/Banks/Primal/piramalThunks";
import { finalUpdate } from "../../../redux/features/case/caseThunks";

const Primal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [isEdit, setIsEdit] = useState({});
  const [collectedData, setCollectedData] = useState({});
  const [extractedData, setExtractedData] = useState({});
  const { loading, error } = useSelector((state) => state.primal);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const editPageHandle = async (id) => {
        try {
          const response = await dispatch(getDetailsById(id)).unwrap();
          setIsEdit(response);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      editPageHandle(id);
    }
  }, [id]);

  const handleNext = async (formData) => {
    const updatedData = { ...collectedData, [`step${step}`]: formData };

    setCollectedData(updatedData);

    if (id) {
      try {
        // Backend me updateDetails thunk me id aur current step ka data bhejo
        await dispatch(updateDetails({ id, ...formData })).unwrap();
        // toast.success(`Step ${step} updated successfully`);
      } catch (err) {
        console.error("Step update failed:", err);
        toast.error("Failed to update this step");
        return; // agar update fail ho to aage na badho
      }
    }

    if (user.role === "FieldOfficer" && step === 1) {
      try {
        await dispatch(updateDetails({ id, ...formData })).unwrap();
        toast.success("Form updated successfully");
        setStep(12);
        navigate("/field/dashboard");
      } catch (err) {
        console.error("Submission failed:", err);
        toast.error("Failed to submit form");
      }

      return; // Prevent step increment
    }

    // Admin ke liye final step me form update aur navigate karna hai
    if (step === 12 && id && user.role === "Admin") {
      const finalData = {
        ...updatedData.step1,
        ...updatedData.step2,
        ...updatedData.step3,
        ...updatedData.step4,
        ...updatedData.step5,
        ...updatedData.step6,
        ...updatedData.step7,
        ...updatedData.step8,
        ...updatedData.step9,
        ...updatedData.step10,
        ...updatedData.step11,
        ...updatedData.step12,
      };

      try {
        const response = await dispatch(
          updateDetails({ id, ...finalData })
        ).unwrap();
        toast.success("Form updated successfully");
        console.log(response);

        navigate(`/bank/home-first/${response?._id}`);
        // navigate(`/`);
        setStep(12);
      } catch (err) {
        console.error("Update failed:", err);
        toast.error("Failed to update form");
      }
      return;
    }

    // Agar final step (4) hai aur create mode (id nahi hai) toh pura merged data bhejo backend ko create ke liye

    if (step === 12) {
      const finalData = {
        ...updatedData.step1,
        ...updatedData.step2,
        ...updatedData.step3,
        ...updatedData.step4,
        ...updatedData.step5,
        ...updatedData.step6,
        ...updatedData.step7,
        ...updatedData.step8,
        ...updatedData.step9,
        ...updatedData.step10,
        ...updatedData.step11,
        ...updatedData.step12,
      };

      try {
        const response = await dispatch(createDetails(finalData)).unwrap();
        navigate(`/bank/piramal/${response._id}`);
        setStep(12);
        toast.success("Form Submitted successfully!");
      } catch (err) {
        console.error("❌ Submission failed:", err);
      }
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const lastUpdate = async () => {
    const finalData = {
      ...collectedData.step1,
      ...collectedData.step2,
      ...collectedData.step3,
      ...collectedData.step4,
    };

    try {
      await dispatch(
        finalUpdate({ id, bankName: "Piramal", updateData: finalData })
      ).unwrap();

      toast.success("Case submitted finally!");
      navigate("/"); // update as per your routing
    } catch (err) {
      console.error("Final submission failed", err);
      toast.error("Final submission failed");
    }
  };

  return (
    <div className='bg-gray-100 py-2 px-2'>
      <div className='max-w-8xl mx-auto bg-white shadow rounded p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Valuation Form</h1>
        </div>

        <AutoFillForm setFormData={setExtractedData} />

        {step === 1 && (
          <BasicDetail
            isEdit={isEdit}
            extractedData={extractedData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 2 && (
          <AreaDetails
            isEdit={isEdit}
            extractedData={extractedData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <IndividualValuation
            isEdit={isEdit}
            extractedData={extractedData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 4 && (
          <Boundaries isEdit={isEdit} extractedData={extractedData} onNext={handleNext} onBack={handleBack} />
        )}
        {step === 5 && (
          <SurroundingLocality
            isEdit={isEdit}
            extractedData={extractedData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 6 && (
          <SanctionPlan
            isEdit={isEdit}
            extractedData={extractedData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 7 && (
          <PropertyDetails
            isEdit={isEdit}
            extractedData={extractedData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 8 && (
          <NdmaParameters
            isEdit={isEdit}
            extractedData={extractedData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 9 && (
          <BuildingDetails
            isEdit={isEdit}
            extractedData={extractedData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 10 && (
          <Valuation isEdit={isEdit} extractedData={extractedData} onNext={handleNext} onBack={handleBack} />
        )}
        {step === 11 && (
          <StageConstruction
            isEdit={isEdit}
            extractedData={extractedData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 12 && (
          <OtherValue isEdit={isEdit} extractedData={extractedData} onNext={handleNext} onBack={handleBack} />
        )}

        {step === 12 && id && user?.role === "Admin" && (
          <div className='text-green-600 font-semibold'>
            <div className='mt-6 text-right'>
              <button
                onClick={lastUpdate}
                className='ml-4 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700'
              >
                Final Submit
              </button>
            </div>
          </div>
        )}

        {loading && <p className='text-blue-600'>Submitting...</p>}
        {error && <p className='text-red-600'>Error: {error}</p>}
      </div>
    </div>
  );
};

export default Primal;
