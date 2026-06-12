import React, { useState } from "react";

const SpecialRemarks = ({ onNext }) => {
  // Pre-filled data
  const initialData = {
    specialRemarks: `DURING VISIT AT SITE PROPERTY IS GF UNDER CONSTRUCTION WHERE SLAB CASTING WORK HAS DONE AND BRICK WORK IS IN PROGRESS.
THIS IS A TRANCH CASE SO ALL DATA ARE TAKEN FROM OLD REPORT.

OLD REMARKS ARE THESE:
DURING VISIT ACTUAL AT SITE PROPERTY IS UNDER CONSTRUCTION WHERE SLAB CASTING WORK IS DONE
PREVIOUS REMARKS IS THESE :
1. GIVEN XEROX COPY OF SALE DEED IS IN FAVOUR OF MR. SUMER SINGH YADAV S/O. MR. BAL KISHAN.
2. DURING PROPERTY VISIT MR. SUMER SINGH YADAV MET AT THE PROPERTY WHO IS THE CUSTOMER CONT NO.9713357500. IT WAS CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.
3. RATE HAS BEEN CONFORM FROM MARKET INQUIRY.
4. AT SITE PROPERTY IS OPEN PLOT WHICH IS DEMARCATED.
5. PROPERTY IS SITUATED AT SURROUNDING AREA OF LOCALITY IS UNDER DEV RESIDENTIAL ZONING.
6. PROPERTY IS IDENTIFIED BY TWO SIDE PERPENDICULAR BOUNDARY OF SALE DEED AND LOCAL ENQUIRY, COLONY LAYOUT TO BE TAKEN.
7. OBTAIN COPY OF ESTIMATE COST OF RS. 1908000/- FOR G.F. BUILT UP AREA 1590 SQFT.
8. TOTAL CONST COST WILL BE CONSIDER AFTER COMPLETION OF WORK.
9. BUILDING PERMISSION AND MAP IS NOT OBTAIN.
10. CLEAR LEGAL OPINION TO BE TAKEN REGARDING LAND USES.
11. SUGGEST TO CREDIT TEAM TO BE CHECK PROPER OWNERSHIP DOCUMENT PRIOR DISBURSEMENT.
12. REPORT IS RELASE SUBJECT TO TECHNICAL TEAM APPROVAL.
13. VALUER IS NOT RESPONSIBLE FOR ANY LEGAL DISPUTE.`,
  };

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Data:", formData);
    onNext(formData);
    // You can add your submission logic here
  };

  return (
    <div className='container mx-auto p-4'>
      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
      >
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='specialRemarks'
          >
            Special Remarks
          </label>
          <textarea
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='specialRemarks'
            name='specialRemarks'
            rows='10'
            value={formData.specialRemarks}
            onChange={handleChange}
          />
        </div>
        <div className='flex items-center justify-between'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpecialRemarks;
