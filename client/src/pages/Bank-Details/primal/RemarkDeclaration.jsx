import React from "react";
import { useSelector } from "react-redux";

const RemarkDeclaration = () => {
  const singleDetail = useSelector((state) => state.primal?.singleDetail);

  return (
    <div className='max-w-7xl mx-auto my-4 p-6 bg-white shadow rounded'>
      {/* Header */}
      <div className='bg-[#365069] text-white p-4 rounded mb-6'>
        <h2 className='text-lg font-semibold'>Remark & Declaration</h2>
      </div>

      {/* Remark Section */}
      <div className='mb-6'>
        <h3 className='text-gray-600 font-semibold text-base'>Remark</h3>
        <p className='text-sm text-gray-500 mt-2 leading-relaxed'>
          GEO COORDINATES 23.164063, 77.318630 CASE TYPE: FRESH LAP NOTE: 1)
          FORE SIDE BOUNDARIES ARE NOT MATCH SO ANY APPROVED NAJRI NAKSHA,
          LAYOUT PLAN OR T&CP COLONY LAYOUT PLAN REQUIRED. 2) AS PER SALE DEED
          EAST DIRECTION BOUNDARIES GOV. ROAD BUT ACTUAL AT SITE PROPERTY IS
          LAND LOCKED BECAUSE EAST DIRECTION COLONY BOUNDARIES WALL, RE-VISIT IS
          REQUIRE FOR PROPER DEMARCATION. 3) DIVERSION ORDER, BUILDING
          PERMISSION AND MAP IS NOT OBTAIN. 1. PROPERTY IS NOT USE TINERY BO
          FOUR SIDE BOUNDARIES OF GIVEN SALE DEED AND LOCAL ENQUIRY. 2) AS PER
          SALE DEED AND AS PER SITE LAND AREA IS 1911 SQFT. 3) AT SITE PROPERTY
          IS OPEN PLOT WHICH IS DEMARCATED WITH POLE AND WHITE LIME POWDER. 4)
          AS PER DEED PROPERTY IS RESIDENTIAL USES. 5) PROPERTY IS SITUATED AT
          SURROUNDING AREA LOC ALITY IS HESI-CUM- AGRICULTURE ZONING, SURROUND
          AREA DEVELOPMENT IS MORE THAN 20 PERCENT AND HABITATION IS MORE THAN
          25 PERCENT. 6) GIVEN ZERO/XX % OF SALE DEED IS FAVOUR OF MR. MONT
          SINGH S/O MR. MARINAJ SINGH. 7) DURING PROPERTY VISIT MR.HARANARAYAN I
          WAS MET AT THE PROPERTY WHO IS BUILDER AND HIS CONTACT NO.7384313180.
          IT WAS CLEARLY EXPLAINED TO HIM/HER THAT THE PROPERTY VISIT IS BEING
          DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL. 8)
          TENTATIVE LAND RATE IS RS. 2200/- SQFT.
        </p>
      </div>

      {/* Declaration Section */}
      <div className='mb-6'>
        <h3 className='text-gray-600 font-semibold text-base'>
          Declaration (We hereby declare that)
        </h3>
        <p className='text-sm text-gray-500 mt-2 leading-relaxed'>
          The Property Was Inspected by Our Engineer. 2) We Have No Direct Or
          Indirect Interest In The Property Valued. 3) The Information Furnished
          Above Is True And Correct To The Best Of Our Knowledge And Belief And
          Takes Into Account Information And / Or Documents Submitted Or Shown
          To Us By The Client. 4) The Fair Market Value Indicated In The Report
          Is an Opinion Of The Value Prevailing On The Date Of The Said Report
          And Is Based On Market Feedback On Values Of Similar Properties. The
          Client Is Free To Obtain Other Independent Opinions On The Same. 5)
          The Fair Market Value Of Such Properties / Localities May Increase Or
          Decrease, Depending On The Future Market Conditions And Scenarios. 6)
          This Report Does Not Certify Or Confirm Any Ownership Or Title Of The
          Property That Has Been Valued.
        </p>
      </div>

      {/* Location Map Section */}
      <div className='mt-6'>
        <h3 className='text-gray-600 font-semibold mb-2 text-base'>
          Location Map
        </h3>
        <div className='border rounded overflow-hidden'>
          <iframe
            width='100%'
            height='300'
            loading='lazy'
            allowFullScreen
            src={`https://www.google.com/maps?q=${singleDetail?.latitude},${singleDetail?.longitude}&hl=es;z=14&output=embed`}
            title='location-map'
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default RemarkDeclaration;
