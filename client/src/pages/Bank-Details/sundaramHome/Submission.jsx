import React from "react";
import { Button } from "antd";

const Submission = () => {
  return (
    <div className='p-4'>
      <Button
        type='primary'
        className='w-full mb-4 bg-cyan-600 hover:bg-cyan-700 text-white'
      >
        Click Here for One Page View
      </Button>

      <div className='border p-4 bg-gray-100 rounded-md whitespace-pre-line'>
        <strong className='block mb-2'>Remarks and Declaration *</strong>
        <div className='text-gray-800 leading-relaxed'>
          1. GIVEN XEROX COPY OF SALE DEED IT IS FAVOUR OF MR. ROOPAM SEWANI
          S/O. MR. MOTILAL SEWANI. 2. DURING PROPERTY VISIT MR. GAGAN KUMAR J
          MET AT THE PROPERTY WHO IS CUSTOMER WIFE CONTACT NO. 7566888270. IT
          WAS CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE FOR
          VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL. 3. RATE HAS BEEN
          CONFIRM FORM MARKET ENQUIRY. 4. PROPERTY IS SITUATED AT SURROUNDING
          AREA OF LOCALITY IS UNDER DEV. RESI-CUM AGRICULTURE ZONING SURROUNDING
          AREA DEVELOPMENT IS 30%. 5. AT SITE PROPERTY IS G+3 UNDER CONST.
          RESIDENTIAL HOUSE WHICH IS WORK DONE UP TO SLAB, BRICK & INTERIOR
          PLASTER WORK COMPLETE AND FLOORING ELECTRIFICATION AND OUTSIDE PLASTER
          WORK IS W.I.P. 6. PROPERTY IS IDENTIFIED BY FOUR SIDE BOUNDARIES OF
          GIVEN SALE DEED AND LOCAL ENQUIRE. 7. LAYOUT PLAN, BUILDING
          PERMISSION, MAP ESTIMATE RECEIVED, WHICH IS APPROVED BY BMC.
        </div>
      </div>
    </div>
  );
};

export default Submission;
