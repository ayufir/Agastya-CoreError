import React, { useEffect, useState } from "react";
import ManapuramFormOne from "./ManapuramFormOne";
import ManapuramFormTwo from "./ManapuramFormTwo";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createDetails,
  getDetailsById,
  updateDetails,
} from "../../../redux/features/Banks/manappuram/ManappuramThunks";
import toast from "react-hot-toast";
import { finalUpdate } from "../../../redux/features/case/caseThunks";
import AutoFillForm from "../../AutoFillForm";

const Manapuram = () => {
  const [ManipuramData, setManipuramData] = useState({});
  const [ManipuramTwo, setManipuramTwo] = useState({});
  const [isEdit, setIsEdit] = useState({});
  const [extractedData, setExtractedData] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { loading, error } = useSelector((state) => state.manappuram);

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
  }, [id, dispatch]);

  const handleSubmitAll = async () => {
    const finalData = {
      ...ManipuramData,
      ...ManipuramTwo,
    };

    try {
      if (id) {
        await dispatch(
          updateDetails({ id, formData: finalData })
        ).unwrap();

        toast.success("Data updated successfully!");
      } else {
        const response = await dispatch(createDetails(finalData)).unwrap();
        navigate(`/bank/manappuram/${response._id}`);
        toast.success("Data submitted successfully!");
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const lastUpdate = async () => {
    const finalData = {
      ...ManipuramData,
      ...ManipuramTwo,
    };

    try {
      let targetId = id;

      // If no ID, create the report first
      if (!targetId) {
        const response = await dispatch(createDetails(finalData)).unwrap();
        targetId = response._id || response.data?._id;
      }

      if (targetId) {
        await dispatch(
          finalUpdate({ id: targetId, bankName: "manappuram", updateData: finalData })
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
    <div className='max-w-5xl mx-auto mt-6 px-4'>
      <h3 className='text-2xl font-semibold mb-4'>Complete Valuation Report</h3>

      <AutoFillForm setFormData={setExtractedData} />

      <ManapuramFormOne isEdit={isEdit} extractedData={extractedData} onDataChange={setManipuramData} />
      <ManapuramFormTwo isEdit={isEdit} extractedData={extractedData} onDataChange={setManipuramTwo} />
      {loading && <p className='text-blue-600'>Submitting...</p>}
      {error && <p className='text-red-600'>Error: {error}</p>}

      <div className='flex justify-end gap-4 mt-4 mb-4'>
        <button
          className='bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition'
          onClick={handleSubmitAll}
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
  );
};

export default Manapuram;
