// components/TMCaseDetails.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitToRTM } from "../../redux/features/caseSlice";

const TMCaseDetails = ({ caseData }) => {
  const dispatch = useDispatch();
  const [pdf, setPdf] = useState(null);
  const [excel, setExcel] = useState(null);
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("caseId", caseData._id);
    formData.append("pdf", pdf);
    formData.append("excel", excel);
    formData.append("comments", comments);

    dispatch(submitToRTM(formData));
  };

  return (
    <div className='p-4 bg-white rounded shadow'>
      <h2 className='text-xl font-semibold mb-4'>
        🧾 Finalize Report - Case #{caseData._id}
      </h2>

      {/* Upload Excel */}
      <label className='block mb-2 font-medium'>
        Upload Excel (Bank Format):
      </label>
      <input
        type='file'
        accept='.xls,.xlsx'
        onChange={(e) => setExcel(e.target.files[0])}
      />

      {/* Upload PDF */}
      <label className='block mt-4 mb-2 font-medium'>Upload PDF Report:</label>
      <input
        type='file'
        accept='.pdf'
        onChange={(e) => setPdf(e.target.files[0])}
      />

      {/* Comments */}
      <label className='block mt-4 mb-2 font-medium'>
        Comments (optional):
      </label>
      <textarea
        rows='3'
        className='w-full border p-2 rounded'
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />

      <button
        className='mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
        onClick={handleSubmit}
      >
        ✅ Submit to RTM
      </button>
    </div>
  );
};

export default TMCaseDetails;
