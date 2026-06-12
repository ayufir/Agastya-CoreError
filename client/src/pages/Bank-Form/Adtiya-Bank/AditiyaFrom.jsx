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

const AditiyaFrom = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isEdit, setIsEdit] = useState({});

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

  const handleSubmit = async () => {
    // Flatten all step data into a single object
    const finalData = Object.values(formData).reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});

    console.log(finalData)

    try {
      if (id) {
        await dispatch(updateDetails({ id, data: finalData })).unwrap();
        toast.success("Data updated successfully!");
        navigate("/");
      } else {

        const response = await dispatch(createDetails(finalData)).unwrap();
        toast.success("✅ Form submitted!");
        navigate(`/bank/aditya/${response._id}`);
      }
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const lastUpdate = async () => {
    const finalData = Object.values(formData).reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});

    try {
      let targetId = id;

      // If no ID, create the report first
      if (!targetId) {
        const response = await dispatch(createDetails(finalData)).unwrap();
        // The createDetails return might be different, usually it has _id or data._id
        targetId = response._id || response.data?._id;
      }

      if (targetId) {
        await dispatch(
          finalUpdate({ id: targetId, bankName: "aditya", updateData: finalData })
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
            <div className='mt-4 flex gap-4'>
              <button
                className='btn border-2 p-2 rounded-2xl hover:bg-[#1E2939] hover:text-white'
                onClick={handleSubmit}
              >
                Submit Report
              </button>

              {(user?.role === "Admin" || user?.role === "SuperAdmin") && (
                <button
                  onClick={lastUpdate}
                  className="px-5 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 font-semibold"
                >
                  Final Submit
                </button>
              )}
            </div>
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
