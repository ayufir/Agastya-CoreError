import { useState } from "react";
import AddressAndGeneralDetails from "./form/AddressAndGeneralDetails";
import LoanApplicationDetails from "./form/LoanApplicationDetails";
import GeneralAmenitiesAreaForm from "./form/GeneralAmenitiesAreaForm";
import NdpAndSiteDetails from "./form/NdpAndSiteDetails";
import ValuationDetailsForm from "./form/ValuationDetailsForm";
import TechnicalDocumentsForm from "./form/TechnicalDocumentsForm";
import RemarksProperty from "./form/RemarksProperty";
import { Button, message } from "antd";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPiramalFinanceRecord } from "../../../redux/features/Banks/piramalFinance/piramalFinanceThunks";

const PrimalNPAForm = () => {
  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});
  const [isEdit, setIsEdit] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = async (formData) => {
    const updatedData = {
      ...collectedData,
      ...formData,
    };
    setCollectedData(updatedData);

    if (step === 7) {
      try {
        const response = await dispatch(
          createPiramalFinanceRecord(updatedData)
        ).unwrap();

        navigate(`/bank/piramalnpa-form/${response.data._id}`);
        toast.success("Form submitted successfully!");
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to submit form.");
      }
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-6 bg-white shadow-md rounded-md'>
      <h1 className='text-2xl font-semibold mb-6 text-gray-800'>
        Property Address Form
      </h1>

      {step === 1 && (
        <AddressAndGeneralDetails isEdit={isEdit} onNext={handleNext} />
      )}

      {step === 2 && (
        <LoanApplicationDetails
          isEdit={isEdit}
          onNext={handleNext}
          onBack={handleBack}
          data={collectedData.loanApplicationDetails || {}}
        />
      )}

      {step === 3 && (
        <GeneralAmenitiesAreaForm
          isEdit={isEdit}
          onNext={handleNext}
          onBack={handleBack}
          data={collectedData.generalAmenities || {}}
        />
      )}

      {step === 4 && (
        <NdpAndSiteDetails
          isEdit={isEdit}
          onNext={handleNext}
          onBack={handleBack}
          data={collectedData.ndpAndSiteDetails || {}}
        />
      )}

      {step === 5 && (
        <ValuationDetailsForm
          isEdit={isEdit}
          onNext={handleNext}
          onBack={handleBack}
          data={collectedData.valuationDetails || {}}
        />
      )}

      {step === 6 && (
        <TechnicalDocumentsForm
          isEdit={isEdit}
          onNext={handleNext}
          onBack={handleBack}
          data={collectedData.technicalDocuments || {}}
        />
      )}

      {step === 7 && (
        <RemarksProperty
          isEdit={isEdit}
          onNext={handleNext}
          onBack={handleBack}
          data={collectedData.remarks || {}}
        />
      )}

      {step > 7 && (
        <div className='text-green-600 mt-4 font-semibold'>
          ✅ All steps completed. Form submitted.
        </div>
      )}
    </div>
  );
};

export default PrimalNPAForm;
