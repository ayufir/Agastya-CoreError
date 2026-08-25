import React, { useEffect, useState } from "react";
import BasicDetails from "./Adtiya-From/BasicDetails";
import LocationDetails from "./Adtiya-From/LocationDetails";
import PropertyDetails from "./Adtiya-From/PropertyDetails";
import UnitDetails from "./Adtiya-From/UnitDetails";
import OtherDetails from "./Adtiya-From/OtherDetails";
import BoundaryDetails from "./Adtiya-From/BoundaryDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  createDetails,
  fetchDetailsById,
  updateDetails,
} from "../../../redux/features/Banks/AdityaBank/adityaThunks";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { finalUpdate } from "../../../redux/features/case/caseThunks";
import CaseWorkflowActions from "../../../components/CaseWorkflowActions";

const AditiyaFrom = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isEdit, setIsEdit] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const { id } = useParams();

  if (id) {
    useEffect(() => {
      const editPageHandle = async (id) => {
        try {
          const response = await dispatch(fetchDetailsById(id)).unwrap();
          setIsEdit(response);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      editPageHandle(id);
    }, [id]);
  }

  const handleNext = (data) => {
    setFormData((prev) => ({
      ...prev,
      [`step${step}`]: data,
    }));
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleFOSave = async () => {
    const finalData = Object.values(formData).reduce((acc, curr) => ({ ...acc, ...curr }), {});
    setLoading(true);
    try {
      if (id) {
        await dispatch(updateDetails({ id, data: { ...finalData, isReportSubmitted: false } })).unwrap();
      }
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleFOSubmit = async () => {
    const finalData = Object.values(formData).reduce((acc, curr) => ({ ...acc, ...curr }), {});
    setLoading(true);
    try {
      if (id) {
        await dispatch(updateDetails({ id, data: { ...finalData, isReportSubmitted: true } })).unwrap();
      } else {
        await dispatch(createDetails(finalData)).unwrap();
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleAdminGenerate = async () => {
    const finalData = Object.values(formData).reduce((acc, curr) => ({ ...acc, ...curr }), {});
    setLoading(true);
    try {
      if (id) {
        await dispatch(updateDetails({ id, data: { ...finalData, status: "Generated" } })).unwrap();
        await dispatch(finalUpdate({ id, bankName: "aditya", updateData: finalData })).unwrap();
      } else {
        const response = await dispatch(createDetails(finalData)).unwrap();
        const targetId = response._id || response.data?._id;
        await dispatch(finalUpdate({ id: targetId, bankName: "aditya", updateData: finalData })).unwrap();
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-gray-100 py-4 px-4'>
      <div className='max-w-8xl mt-4 mx-auto bg-white shadow rounded p-6'>
        <h1 className='text-2xl font-bold mb-4'>Aditya Bank Report Form</h1>
        <p className='text-gray-500 mb-6'>Step {step} of 6</p>

        {/* Conditional Step Rendering */}
        {step === 1 && <BasicDetails isEdit={isEdit} onNext={handleNext} />}
        {step === 2 && <LocationDetails isEdit={isEdit} onNext={handleNext} />}
        {step === 3 && <PropertyDetails isEdit={isEdit} onNext={handleNext} />}
        {step === 4 && <UnitDetails isEdit={isEdit} onNext={handleNext} />}
        {step === 5 && <OtherDetails isEdit={isEdit} onNext={handleNext} />}
        {step === 6 && <BoundaryDetails isEdit={isEdit} onNext={handleNext} />}

        {step > 6 && (
          <div className='font-semibold'>
            ✅ All steps completed.
            <CaseWorkflowActions
              caseId={id}
              bankName="Aditya"
              onSave={handleFOSave}
              onSubmit={(status) => {
                if (status === "Generated") {
                  return handleAdminGenerate();
                } else if (status === "FinalSubmitted" || !isFieldOfficer) {
                  return handleFinalSubmit();
                } else {
                  return handleFOSubmit();
                }
              }}
              loading={loading}
              isReportSubmitted={isEdit?.isReportSubmitted}
              status={isEdit?.status}
            />
          </div>
        )}

        {/* Back Button */}
        <div className='mt-6 flex justify-between'>
          {step > 1 && step <= 6 && (
            <button className='btn btn-outline-secondary' onClick={handleBack}>
              ⬅ Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AditiyaFrom;
