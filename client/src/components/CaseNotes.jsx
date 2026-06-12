import { useDispatch, useSelector } from "react-redux";
import { fetchNotes, addNote } from "../redux/features/Note/notesSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CaseNotes = ({ caseId, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notes } = useSelector((state) => state?.notes || []);

  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchNotes(caseId));
  }, [caseId, dispatch]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   dispatch(addNote({ caseId, message }));
  //   setMessage("");
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming addNote is a thunk action returning a promise
      await dispatch(addNote({ caseId, message })).unwrap();

      setMessage("");
      navigate(0);

      toast.success("Note added successfully");
      // call onSuccess to close modal
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to add note:", err);
      // Optionally show error toast here
    }
  };

  return (
    <div className='space-y-3'>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Add note...'
          className='border p-2 flex-1 rounded'
        />
        <button className='bg-blue-600 text-white px-4 py-2 rounded'>
          Add
        </button>
      </form>
    </div>
  );
};

export default CaseNotes;
