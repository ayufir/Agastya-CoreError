import React, { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";

const BasicDetails = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [localData, setLocalData] = useState({
    valuerName: "",
    clientName: "",
    initiationDate: "",
    vertical: "",
    visitDate: "",
    caseReferenceNumber: "",
    propertyOwners: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setLocalData({
        valuerName: isEdit.valuerName || "",
        clientName: isEdit.clientName || "",
        initiationDate: isEdit?.initiationDate
          ? moment(isEdit.initiationDate).format("YYYY-MM-DD")
          : "",
        vertical: isEdit.vertical || "",
        visitDate: isEdit?.visitDate
          ? moment(isEdit.visitDate).format("YYYY-MM-DD")
          : "",
        caseReferenceNumber: isEdit.caseReferenceNumber || "",
        propertyOwners: isEdit.propertyOwners || "",
      });
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextClick = () => {
    onNext(localData);
    toast.success("Saved Successfully");
  };

  return (
    <div className='mb-4 border rounded shadow-sm'>
      <div
        className='p-4 bg-gray-800 text-white flex justify-between items-center cursor-pointer rounded-t'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-lg font-semibold'>Basic Details</h4>
        <button
          type='button'
          className='bg-white text-gray-800 text-sm px-3 py-1 rounded hover:bg-gray-200'
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='bg-gray-50 p-6 rounded-b'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Name of the Valuer
              </label>
              <input
                type='text'
                className='w-full border rounded px-3 py-2'
                name='valuerName'
                value={localData.valuerName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Name of the Client
              </label>
              <input
                type='text'
                className='w-full border rounded px-3 py-2'
                name='clientName'
                value={localData.clientName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Initiation Date
              </label>
              <input
                type='date'
                className='w-full border rounded px-3 py-2'
                name='initiationDate'
                value={localData.initiationDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Vertical</label>
              <input
                type='text'
                className='w-full border rounded px-3 py-2'
                name='vertical'
                value={localData.vertical}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Visit Date
              </label>
              <input
                type='date'
                className='w-full border rounded px-3 py-2'
                name='visitDate'
                value={localData.visitDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>
              Case Reference Number
            </label>
            <input
              type='text'
              className='w-full border rounded px-3 py-2'
              name='caseReferenceNumber'
              value={localData.caseReferenceNumber}
              onChange={handleChange}
            />
          </div>

          <div className='mb-6'>
            <label className='block text-sm font-medium mb-1'>
              Name of the Property Owner(s)
            </label>
            <textarea
              className='w-full border rounded px-3 py-2'
              name='propertyOwners'
              value={localData.propertyOwners}
              onChange={handleChange}
              rows='3'
            />
          </div>

          <div className='text-right'>
            <button
              onClick={handleNextClick}
              className='bg-[#1E2939]  text-white font-semibold px-6 py-2 rounded'
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicDetails;
