import React from "react";

const ConfirmModal = ({ visible, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-lg'>
        <h2 className='text-lg font-semibold mb-4'>Are you sure?</h2>
        <p className='text-sm text-gray-700 mb-6'>
          Please double-check all the details before submitting this report.
        </p>
        <div className='flex justify-end space-x-4'>
          <button
            onClick={onCancel}
            className='px-4 py-2 rounded bg-gray-300 hover:bg-gray-400'
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700'
          >
            Yes, Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
