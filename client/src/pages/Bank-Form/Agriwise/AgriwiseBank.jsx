// import React, { useState } from "react";
// import { Button } from "antd";
// import AgriwiseForm from "./Form/AgriwiseForm";
// import TechnicalReports from "./Form/TechinalReports";
// import { useDispatch } from "react-redux";
// import { createValuation } from "../../../redux/features/agriwise/agriwiseThunks";

// const AgriwiseBank = () => {
//   const [submittedData, setSubmittedData] = useState(null);

//   const handleFormSubmit = async (data) => {
//     // setSubmittedData(data);
//     try {
//       const res = await dispatch(createValuation(data)).unwrap();
//       console.log(res, "RES_DATA");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const dispatch = useDispatch();

//   return (
//     <div className='min-h-screen bg-gray-100 p-6'>
//       <h1 className='text-2xl font-bold mb-6'>Agriwise Bank Form Submission</h1>
//       <AgriwiseForm onSubmit={handleFormSubmit} />
//     </div>
//   );
// };

// export default AgriwiseBank;

import React, { useState } from "react";
import { Button } from "antd";
import AgriwiseForm from "./Form/AgriwiseForm";
import TechnicalReports from "./Form/TechinalReports";
import { useDispatch } from "react-redux";
import { createValuation } from "../../../redux/features/Banks/agriwise/agriwiseThunks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AgriwiseBank = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFormSubmit = async (data) => {
    try {
      const response = await dispatch(createValuation(data)).unwrap(); // use data directly
      navigate(`/bank/agriwise/${response._id}`);
      toast.success("Form submitted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <h1 className='text-2xl font-bold mb-6'>Agriwise Bank Form Submission</h1>
      <AgriwiseForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default AgriwiseBank;
