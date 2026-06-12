import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const DocumentUpload = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    documents: [
      {
        name: "APPROVED LAYOUT PLAN",
        type: "",
        refNo: "",
        refDate: "",
        approvalDetails: "",
        uploadedFile: null,
      },
      {
        name: "APPROVED FLOOR PLAN",
        type: "",
        refNo: "",
        refDate: "",
        approvalDetails: "",
        uploadedFile: null,
      },
      {
        name: "CONSTRUCTION PERMISSION / BUILDING PERMISSION / CONVERGENCENT CERTIFICATE",
        type: "",
        refNo: "",
        refDate: "",
        approvalDetails: "",
        uploadedFile: null,
      },
      {
        name: "BUILDING COMPETITION CERTIFICATE / OCCUPATION PERMISSION / USE PERMISSION / POSSESSION CERTIFICATE",
        type: "",
        refNo: "",
        refDate: "",
        approvalDetails: "",
        uploadedFile: null,
      },
      {
        name: "NON-ADRICULTURAL PERMISSION / LAND CONVERSION / DIVERSION ORDER",
        type: "",
        refNo: "",
        refDate: "",
        approvalDetails: "",
        uploadedFile: null,
      },
      {
        name: "LOCATION SKETCH/ CERTIFICATE",
        type: "",
        refNo: "",
        refDate: "",
        approvalDetails: "",
        uploadedFile: null,
      },
      {
        name: "AGREEMENT FOR SALE / SALE DEED",
        type: "",
        refNo: "",
        refDate: "",
        approvalDetails: "",
        uploadedFile: null,
      },
      {
        name: "PRUDERITY TAX RECEIPTS",
        type: "",
        refNo: "",
        refDate: "",
        approvalDetails: "",
        uploadedFile: null,
      },
      {
        name: "AUTHORITY ALLOTMENT LETTER",
        type: "",
        refNo: "",
        refDate: "",
        approvalDetails: "",
        uploadedFile: null,
      },
      {
        name: "CONSTRUCTION ESTIMATE FROM REGISTERED ENRINEERARCHITECT",
        type: "",
        refNo: "",
        refDate: "",
        approvalDetails: "",
        uploadedFile: null,
      },
      {
        name: "INPROVEMENT/CXTEASION ESTIMATE FROM REGISTERED ENRINEERARCHITECT",
        type: "",
        refNo: "",
        refDate: "",
        approvalDetails: "",
        uploadedFile: null,
      },
    ],
    selectedDocument: "",
    uploadedFile: null,
  });

  const handleChange = (index, field, value) => {
    const updatedDocuments = [...formData.documents];
    updatedDocuments[index][field] = value;
    setFormData({ ...formData, documents: updatedDocuments });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const docIndex = formData.documents.findIndex(
        (doc) => doc.name === formData.selectedDocument
      );
      if (docIndex !== -1) {
        handleChange(docIndex, "uploadedFile", fileUrl);
      }
      setFormData({ ...formData, uploadedFile: fileUrl });
    }
  };

  const handleSelectDocument = (e) => {
    setFormData({ ...formData, selectedDocument: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
    toast.success("saved successfully");
  };

  return (
    <div className='max-w-7xl mx-auto my-4 px-4'>
      {/* Header */}
      <div
        className='bg-gray-800 text-white p-4 rounded cursor-pointer flex justify-between items-center'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-lg font-semibold'>Technical Documents Details</h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className='bg-white text-gray-800 px-3 py-1 rounded text-sm'
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {/* Form */}
      {isOpen && (
        <div className='bg-white border mt-2 p-4 rounded shadow'>
          <form onSubmit={handleSubmit}>
            <div className='overflow-x-auto'>
              <table className='min-w-full border text-sm'>
                <thead className='bg-gray-100'>
                  <tr className='text-left'>
                    <th className='border px-2 py-1'>Document Name *</th>
                    <th className='border px-2 py-1'>Document Type *</th>
                    <th className='border px-2 py-1'>Ref No</th>
                    <th className='border px-2 py-1'>Ref Date</th>
                    <th className='border px-2 py-1'>
                      Details of the Approval
                    </th>
                    <th className='border px-2 py-1'>File</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.documents.map((doc, index) => (
                    <tr key={index}>
                      <td className='border px-2 py-1'>{doc.name}</td>
                      <td className='border px-2 py-1'>
                        <select
                          className='border rounded px-2 py-1 w-full'
                          value={doc.type}
                          onChange={(e) =>
                            handleChange(index, "type", e.target.value)
                          }
                        >
                          <option value=''>Select</option>
                          <option value='Original'>Original</option>
                          <option value='Copy'>Copy</option>
                        </select>
                      </td>
                      <td className='border px-2 py-1'>
                        <input
                          type='text'
                          name='refNo'
                          className='border rounded px-2 py-1 w-full'
                          value={doc.refNo}
                          onChange={(e) =>
                            handleChange(index, "refNo", e.target.value)
                          }
                        />
                      </td>
                      <td className='border px-2 py-1'>
                        <input
                          type='date'
                          name='refDate'
                          className='border rounded px-2 py-1 w-full'
                          value={doc.refDate}
                          onChange={(e) =>
                            handleChange(index, "refDate", e.target.value)
                          }
                        />
                      </td>
                      <td className='border px-2 py-1'>
                        <input
                          type='text'
                          className='border rounded px-2 py-1 w-full'
                          value={doc.approvalDetails}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "approvalDetails",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className='border px-2 py-1'>
                        {doc.uploadedFile ? (
                          <a
                            href={doc.uploadedFile}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600'
                          >
                            View
                          </a>
                        ) : (
                          "Not uploaded"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Upload Section */}
            <div className='mt-6'>
              <h5 className='text-lg font-semibold mb-2'>Upload Document</h5>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block mb-1 font-medium'>
                    Select Document Name *
                  </label>
                  <select
                    className='border rounded px-2 py-1 w-full'
                    value={formData.selectedDocument}
                    onChange={handleSelectDocument}
                  >
                    <option value=''>Select a document</option>
                    {formData.documents.map((doc, index) => (
                      <option key={index} value={doc.name}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block mb-1 font-medium'>Upload</label>
                  <input
                    type='file'
                    className='border rounded px-2 py-1 w-full'
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end mt-4'>
              <button
                type='submit'
                className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
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

export default DocumentUpload;
