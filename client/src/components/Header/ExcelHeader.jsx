import React from "react";
import { FaPhoneAlt } from "react-icons/fa";

const ExcelHeader = () => {
  return (
    <div className='bg-[#F0F8FF] w-full border border-black'>
      <div className='w-full shadow-md  mx-auto p-4'>
        {/* Top Section - Logo and Heading */}
        <div className='flex  w-full flex-col  mb-4'>
          <div className='flex items-center      justify-center'>
            <img
              src='/assets/images/download.png'
              alt='Unique Engineering Logo'
              className='h-[100px] w-32 md:w-40'
            />
            <div className='text-start'>
              <h1 className='text-2xl md:text-3xl font-bold text-[#1D4577]'>
                UNIQUE ENGINEERING AND ASSOCIATE
              </h1>
            </div>
          </div>
        </div>

        {/* Middle Section - Two columns */}
        <div className='flex flex-col md:flex-row justify-between items-start gap-4 mb-4'>
          {/* Left Column */}
          <div className='text-center md:text-left'>
            <p className='text-[#1D4577] mb-1 font-semibold'>
              CHARTED ENGINEER AND APPROVED VALUER
            </p>
            <p className='text-sm text-gray-800 mb-1'>
              Reg. AMIE- AM167147-5, IMC- 82-16, IIOV- CAT-I/A-4537,
            </p>
            <a
              href='http://www.ueaa.co.in'
              className='text-blue-500 text-sm block'
            >
              www.ueaa.co.in
            </a>
            <a
              href='mailto:bhartsharma1@gmail.com'
              className='text-blue-500 text-sm'
            >
              bhartsharma1@gmail.com
            </a>
          </div>

          {/* Right Column */}
          <div className='text-center md:text-right'>
            <p className='text-sm md:text-base font-semibold text-black'>
              CONSULTING ENGINEER VALUERS,
              <br />
              ARCHITECTS AND DESIGNER WORK,
              <br />
              REGISTERED ENGINEER WITH IMC AND T&CP
            </p>
          </div>
        </div>

        {/* Bottom Section - Address and Contact */}
        <div className='flex flex-col md:flex-row items-center justify-between border-t border-gray-300 pt-3'>
          <div className='text-sm text-black mb-2 md:mb-0'>
            REG. OFFICE - OFFICE NO. 102, SWADESH BHAWAN PLOT NO. 2 PRESS
            COMPLEX A.B ROAD INDORE. 452001 M.P
          </div>
          <div className='flex items-center gap-2'>
            <FaPhoneAlt className='text-black' />
            <span className='font-semibold text-black'>BHART SHARMA</span>
            <span className='text-black'>+919993970499</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelHeader;
