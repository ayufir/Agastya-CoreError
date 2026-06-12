import React, { useState, useEffect } from "react";

const RemarksForm = ({ onNext, isEdit }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    nfsaCheckRequired: "",
    generalObservations: "",
    raleReferences: "",
    needsFunction: "",
    documentName: "",
    documentReference: "",
    documentDate: "",
    documentAuthority: "",
    personName: "",
    siteVisits: "1",
    personRole: "Self",
    evaluationMode: "",
    personContact: "+91",
    rejectionReason: "",
    verifiedBy: "BHART SHARHA",
    verificationType: "External",
    visitDate: "",
  });

  useEffect(() => {
    if (isEdit) {
      setFormData(isEdit);
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call the onNext function to pass the form data to the next step
    onNext(formData);
    // alert('Form submitted successfully!');
    // console.log(formData);

    setIsEditOpen(false); // Close the form after submission
  };

  const toggleEdit = () => {
    setIsEditOpen(!isEditOpen);
  };

  return (
    <div className='container mx-auto mt-4 max-w-6xl'>
      <div
        className='p-3 border rounded cursor-pointer'
        style={{ backgroundColor: "#98291E" }}
        onClick={toggleEdit}
      >
        <div className='flex justify-between items-center text-white'>
          <h4 className='m-0 text-lg font-semibold'>Remarks</h4>
          <button
            type='button'
            className='bg-white text-gray-800 px-3 py-1 rounded text-sm'
            onClick={(e) => {
              e.stopPropagation();
              toggleEdit();
            }}
          >
            {isEditOpen ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      {isEditOpen && (
        <div className='border rounded p-3 mt-2 bg-white'>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block mb-2 font-semibold'>
                NFSA/Auberance Checks Required Based On Observations
              </label>
              <input
                type='text'
                className='w-full p-2 border border-gray-300 rounded'
                name='nfsaCheckRequired'
                value={formData.nfsaCheckRequired}
                onChange={handleChange}
              />
            </div>

            <div className='mb-4'>
              <label className='block mb-2 font-semibold'>
                General Observations*
              </label>
              <textarea
                className='w-full p-2 border border-gray-300 rounded'
                rows={3}
                maxLength={2000}
                name='generalObservations'
                value={formData.generalObservations}
                onChange={handleChange}
                placeholder='0/2000'
              />
            </div>

            <div className='mb-4'>
              <label className='block mb-2 font-semibold'>
                Rale References
              </label>
              <textarea
                className='w-full p-2 border border-gray-300 rounded'
                rows={3}
                maxLength={2000}
                name='raleReferences'
                value={formData.raleReferences}
                onChange={handleChange}
                placeholder='0/2000'
              />
            </div>

            <div className='mb-4'>
              <label className='block mb-2 font-semibold'>
                In The Property related to the Needs Function?
              </label>
              <div className='flex gap-3'>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='needsFunction'
                    value='Yes'
                    checked={formData.needsFunction === "Yes"}
                    onChange={handleChange}
                  />
                  <label className='form-check-label'>Yes</label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='needsFunction'
                    value='No'
                    checked={formData.needsFunction === "No"}
                    onChange={handleChange}
                  />
                  <label className='form-check-label'>No</label>
                </div>
              </div>
            </div>

            <div className='mb-4'>
              <label className='block mb-2 font-semibold'>
                Document Vertical
              </label>
              <div className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                  <thead>
                    <tr>
                      <th className='p-2 border'>Document Name</th>
                      <th className='p-2 border'>Document References</th>
                      <th className='p-2 border'>Document Date</th>
                      <th className='p-2 border'>Authority</th>
                      <th className='p-2 border'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type='text'
                          className='w-full p-2 border border-gray-300 rounded'
                          name='documentName'
                          value={formData.documentName}
                          onChange={handleChange}
                          placeholder='DD/MM/YYYY'
                        />
                      </td>
                      <td>
                        <input
                          type='text'
                          className='w-full p-2 border border-gray-300 rounded'
                          name='documentReference'
                          value={formData.documentReference}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type='text'
                          className='w-full p-2 border border-gray-300 rounded'
                          name='documentDate'
                          value={formData.documentDate}
                          onChange={handleChange}
                          placeholder='DD/MM/YYYY'
                        />
                      </td>
                      <td>
                        <input
                          type='text'
                          className='w-full p-2 border border-gray-300 rounded'
                          name='documentAuthority'
                          value={formData.documentAuthority}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <button
                          type='button'
                          className='text-blue-500 hover:underline'
                        >
                          Add Note
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
              <div>
                <label className='block mb-2 font-semibold'>
                  Name of The Person held At Site
                </label>
                <input
                  type='text'
                  className='w-full p-2 border border-gray-300 rounded'
                  name='personName'
                  value={formData.personName}
                  onChange={handleChange}
                  placeholder='LANGIAN CHOUNAN'
                />
              </div>
              <div>
                <label className='block mb-2 font-semibold'>
                  No of Site Visits *
                </label>
                <select
                  className='w-full p-2 border border-gray-300 rounded'
                  name='siteVisits'
                  value={formData.siteVisits}
                  onChange={handleChange}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block mb-2 font-semibold'>
                  Role of The Person held at Site
                </label>
                <select
                  className='w-full p-2 border border-gray-300 rounded'
                  name='personRole'
                  value={formData.personRole}
                  onChange={handleChange}
                >
                  <option value='Self'>Self</option>
                  <option value='Agent'>Agent</option>
                  <option value='Relative'>Relative</option>
                  <option value='Other'>Other</option>
                </select>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <label className='block mb-2 font-semibold'>
                  Evaluation Mode
                </label>
                <input
                  type='text'
                  className='w-full p-2 border border-gray-300 rounded'
                  name='evaluationMode'
                  value={formData.evaluationMode}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className='block mb-2 font-semibold'>
                  Contact No. of The Person held At Site
                </label>
                <div className='flex'>
                  <span className='inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l bg-gray-100'>
                    +91
                  </span>
                  <input
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded-r'
                    name='personContact'
                    value={formData.personContact.replace("+91", "")}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "personContact",
                          value: `+91${e.target.value}`,
                        },
                      })
                    }
                    placeholder='469758283'
                  />
                </div>
              </div>
            </div>

            <div className='mb-4'>
              <label className='block mb-2 font-semibold'>
                Reason for rejecting the report *
              </label>
              <input
                type='text'
                className='w-full p-2 border border-gray-300 rounded'
                name='rejectionReason'
                value={formData.rejectionReason}
                onChange={handleChange}
              />
            </div>

            <hr className='my-4' />

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
              <div>
                <label className='block mb-2 font-semibold'>
                  Verified By *
                </label>
                <input
                  type='text'
                  className='w-full p-2 border border-gray-300 rounded'
                  name='verifiedBy'
                  value={formData.verifiedBy}
                  onChange={handleChange}
                  placeholder='BHART SHARHA'
                />
              </div>
              <div>
                <label className='block mb-2 font-semibold'>
                  Verification Type
                </label>
                <select
                  className='w-full p-2 border border-gray-300 rounded'
                  name='verificationType'
                  value={formData.verificationType}
                  onChange={handleChange}
                >
                  <option value='External'>External</option>
                  <option value='Internal'>Internal</option>
                </select>
              </div>
              <div>
                <label className='block mb-2 font-semibold'>
                  Date Of Site Visit *
                </label>
                <input
                  type='text'
                  className='w-full p-2 border border-gray-300 rounded'
                  name='visitDate'
                  value={formData.visitDate}
                  onChange={handleChange}
                  placeholder='DD/MM/YYYY'
                />
              </div>
            </div>

            <div className='flex justify-end'>
              <button
                style={{ background: "#98291E" }}
                type='submit'
                className='text-white px-4 py-2 rounded'
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RemarksForm;
