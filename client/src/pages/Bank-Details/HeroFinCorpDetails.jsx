import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getValuationById } from "../../redux/features/Banks/HeroFinCorp/HeroFinCorpThunks";
import { useParams } from "react-router-dom";
import JobForm from "./HeroFinCorp/JobForm";
import JobDetailsForm from "./HeroFinCorp/JobDetailsForm";
// import AttachmentDetails from "./HeroFinCorp/AttachmentDetails";

const HeroFinCorpDetails = () => {
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    const fetchReportData = async (id) => {
      try {
        dispatch(getValuationById(id));
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };
    fetchReportData(id);
  }, [id, dispatch]);

  return (
    <div>
      <JobForm />
      <JobDetailsForm />
      {/* <AttachmentDetails /> */}
    </div>
  );
};

export default HeroFinCorpDetails;
