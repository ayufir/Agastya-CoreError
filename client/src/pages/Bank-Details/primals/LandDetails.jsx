import React from "react";

const LandDetails = () => {
  return (
    <div className='max-w-7xl mx-auto my-4 p-6 bg-white shadow rounded'>
      {/* Photographs Section */}
      <div>
        <h2 className='text-lg font-semibold mb-4'>Photographs</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          <img
            src='https://images.unsplash.com/photo-1590733839006-d7b9006c2e98?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxhbmR8ZW58MHwwfDB8fHww'
            alt='Person standing on land'
            className='w-full h-auto rounded'
          />
          <img
            src='https://images.unsplash.com/photo-1629016429417-0a01981c3cb1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhbmR8ZW58MHwwfDB8fHww'
            alt='Land view'
            className='w-full h-auto rounded'
          />
          <img
            src='https://images.unsplash.com/photo-1572109646045-7cce4196cfd7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhbmR8ZW58MHwwfDB8fHww'
            alt='Distant land view'
            className='w-full h-auto rounded'
          />
        </div>
      </div>

      {/* Master Plan Section */}
      <div className='mt-6'>
        <div className='border p-4 rounded bg-gray-100 text-center'>
          <p className='text-sm text-gray-700'>No master plan uploaded.</p>
        </div>
      </div>

      {/* Upload Support Documents Section */}
      <div className='mt-3'>
        <div className='border p-4 rounded bg-gray-100 text-center'>
          <p className='text-sm text-gray-700'>No documents uploaded.</p>
        </div>
      </div>

      {/* Buttons */}
      <div className='mt-6 flex flex-wrap justify-end gap-3'>
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
      </div>
    </div>
  );
};

export default LandDetails;
