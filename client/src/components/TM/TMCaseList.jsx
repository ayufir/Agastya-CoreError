// components/TMCaseList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCases } from "../../redux/features/caseSlice";
import { useNavigate } from "react-router-dom";

const TMCaseList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cases } = useSelector((state) => state.case);

  useEffect(() => {
    dispatch(fetchCases());
  }, [dispatch]);

  const filtered = cases.filter(
    (c) => c.status === "submitted_by_field_officer"
  );

  return (
    <div className='p-4'>
      <h2 className='text-xl font-semibold mb-4'>📋 Pending Cases (TM)</h2>
      {filtered.map((c) => (
        <div
          key={c._id}
          className='border rounded p-3 mb-3 shadow cursor-pointer hover:bg-gray-50'
          onClick={() => navigate(`/tm/case/${c._id}`)}
        >
          <p>
            <strong>Case ID:</strong> {c._id}
          </p>
          <p>
            <strong>Bank:</strong> {c.bank}
          </p>
          <p>
            <strong>Location:</strong> {c.propertyAddress}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TMCaseList;
