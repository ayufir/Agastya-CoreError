import React from "react";
import { useSelector } from "react-redux";

const LandDetails = () => {
  const singleDetail = useSelector((state) => state.primal?.singleDetail);

  console.log(singleDetail, "PHT");

  return (
    <div className='max-w-7xl mx-auto my-4 p-6 bg-white shadow rounded'>
      {/* Photographs Section */}
      <div>
        <h2 className='text-lg font-semibold mb-4'>Photographs</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {singleDetail &&
            singleDetail?.imageUrls?.map((p, i) => (
              <div key={i} className=''>
                <img
                  src={p}
                  alt='Person standing on land'
                  className='w-full h-auto rounded'
                />
              </div>
            ))}
        </div>
      </div>

      {/* Master Plan Section */}
      {/* <div className='mt-6'>
        <div className='border p-4 rounded bg-gray-100 text-center'>
          <p className='text-sm text-gray-700'>No master plan uploaded.</p>
        </div>
      </div> */}

      {/* Upload Support Documents Section */}
      {/* <div className='mt-3'>
        <div className='border p-4 rounded bg-gray-100 text-center'>
          <p className='text-sm text-gray-700'>No documents uploaded.</p>
        </div>
      </div> */}

      {/* Buttons */}
      {/* <div className='mt-6 flex flex-wrap justify-end gap-3'>
        <button className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'>
          Re-Assign
        </button>
        <button className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
          Preview the PDF
        </button>
        <button className='px-4 py-2 bg-gray-900 text-white rounded hover:bg-black'>
          Upload the Signed & Stamped Copy
        </button>
        <button className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>
          Sign with auto sign and stamp
        </button>
      </div> */}
    </div>
  );
};

export default LandDetails;
