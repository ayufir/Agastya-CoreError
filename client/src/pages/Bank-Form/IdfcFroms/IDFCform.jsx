// import React, { useState } from "react";
// import TechnicalAppraisalReport from "./form/TechnicalAppraisalReport";
// import PropertyDetails from "./form/PropertyDetails";
// import FloorRevenue from "./form/FloorRevenue";
// import BoundriesDetails from "./form/BoundriesDetails";

// const IDFCform = () => {
//   const [TechnicalData, setTechnicalDeatilsData] = useState({});
//   const [PropertyData, setPropertyData] = useState({});
//   const [FloorData, setFloorData] = useState({});
//   const [BoundaryData, setBoundaryData] = useState({});

//   const handleSubmitAll = () => {
//     const finalData = {
//       TechnicalDeatils: TechnicalData,
//       Propertydeatils: PropertyData,
//       FloorRevenue: FloorData,
//       Boundary: BoundaryData,
//     };

//     // Print the data to the console in a structured format
//     console.log("Submitted Data:", finalData);

//     // Show an alert to confirm submission
//     alert("All data submitted ✅");

//     // Clear the data
//     // setBasicData({});
//   };

//   return (
//     <div className="container mt-4">
//       <h3>Complete Valuation Report</h3>

//       <TechnicalAppraisalReport onDataChange={setTechnicalDeatilsData} />
//       <PropertyDetails onDataChange={setPropertyData} />
//       <FloorRevenue onDataChange={setFloorData} />
//       <BoundriesDetails onDataChange={setBoundaryData} />

//       <div className="text-end mt-2 mb-2">
//         <button className="btn btn-dark" onClick={handleSubmitAll}>
//           Submit Report
//         </button>
//       </div>
//     </div>
//   );
// };

// export default IDFCform;

import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TechnicalAppraisalReport from "./form/TechnicalAppraisalReport";
import PropertyDetails from "./form/PropertyDetails";
import FloorRevenue from "./form/FloorRevenue";
import BoundriesDetails from "./form/BoundriesDetails";
import { createDetails } from "../../../redux/features/Banks/IDFCbank/idfclThunks";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import AutoFillForm from "../../AutoFillForm";

const IDFCForm = () => {
  const navigate = useNavigate();

  const [technicalApprisalData, setTechnicalApprisalData] = useState({});
  const [propertyDetail, setPropertyDetail] = useState({});
  const [floorRevenue, setFloorRevenue] = useState({});
  const [boundryDetail, setBoundryDetail] = useState({});
  const [extractedData, setExtractedData] = useState({});

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.idfc);

  const handleSubmitAll = async () => {
    const finalData = {
      ...technicalApprisalData,
      ...propertyDetail,
      ...floorRevenue,
      ...boundryDetail,
    };

    try {
      const response = await dispatch(createDetails(finalData)).unwrap();

      if (response && response._id) {
        toast.success("✅ IDFC Report Submitted");
        console.log(response, " Submitted Data:");
        console.log(response._id, "response id");
        navigate(`/bank/idfc-first-bank/${response._id}`);
      } else {
        toast.error("❌ Submission failed: Missing response ID");
        console.error("Invalid response:", response);
      }
    } catch (error) {
      toast.error("❌ Submission failed");
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="bg-gray-100 py-4 px-4">
      <div className="max-w-8xl mt-4 mx-auto bg-white shadow rounded p-6">
        <h1 className="text-2xl font-bold mb-4">IDFC Bank Report Form</h1>
        <p className="text-gray-500 mb-6"></p>

        <AutoFillForm setFormData={setExtractedData} />

        <TechnicalAppraisalReport onDataChange={setTechnicalApprisalData} extractedData={extractedData} />
        <PropertyDetails onDataChange={setPropertyDetail} extractedData={extractedData} />
        <FloorRevenue onDataChange={setFloorRevenue} extractedData={extractedData} />
        <BoundriesDetails onDataChange={setBoundryDetail} extractedData={extractedData} />
        {loading && <p className="text-blue-600">Submitting...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        <div className="font-semibold">
          <div className="mt-4">
            <button
              className="btn border-2 p-2 rounded-2xl hover:bg-[#1E2939] hover:text-white"
              onClick={handleSubmitAll}
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDFCForm;
