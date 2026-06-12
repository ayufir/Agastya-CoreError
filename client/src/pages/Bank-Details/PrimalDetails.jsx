import Valuation from "./primal/Valuation.jsx";
import Basic from "./primal/Basic.jsx";
import Boundaries from "./primal/Boundaries.jsx";
import Locality from "./primal/Locality.jsx";
import PlanDetails from "./primal/PlanDeatils.jsx";
import PropertyDetails from "./primal/PropertyDetails.jsx";
import NdmaParameters from "./primal/NdmaParameters.jsx";
import Building from "./primal/Building.jsx";
import AreaDetails from "./primal/AreaDetails.jsx";
import Individual from "./primal/Individual.jsx";
import Construction from "./primal/Construction.jsx";
import Value from "./primal/Value.jsx";
import RemarkDeclaration from "./primal/RemarkDeclaration.jsx";
import LandDetails from "./primal/LandDetails.jsx";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getDetailsById } from "../../redux/features/Banks/Primal/piramalThunks.js";
import { useEffect } from "react";

function PrimalDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const init = async (id) => {
    try {
      await dispatch(getDetailsById(id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      init(id);
    }
  }, [id]);

  return (
    <>
      <Valuation />
      <Basic />
      <Boundaries />
      <Locality />
      <PlanDetails />
      <PropertyDetails />
      <NdmaParameters />
      <Building />
      <AreaDetails />
      <Individual />
      <Construction />
      <Value />
      <RemarkDeclaration />
      <LandDetails />
    </>
  );
}

export default PrimalDetails;
