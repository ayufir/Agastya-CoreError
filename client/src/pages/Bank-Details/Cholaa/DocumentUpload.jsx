import React from "react";
import { useSelector } from "react-redux";

const DocumentUploadDisplay = () => {
  const { singleDetail } = useSelector((state) => state.chola) || {};

  const documentTypes = [
    "APPROVED LAYOUT PLAN",
    "APPROVED FLOOR PLAN",
    "CONSTRUCTION PERMISSION / BUILDING PERMISSION / CONVERGENCENT CERTIFICATE",
    "BUILDING COMPETITION CERTIFICATE / OCCUPATION PERMISSION / USE PERMISSION / POSSESSION CERTIFICATE",
    "NON-ADRICULTURAL PERMISSION / LAND CONVERSION / DIVERSION ORDER",
    "LOCATION SKETCH/ CERTIFICATE",
    "AGREEMENT FOR SALE / SALE DEED",
    "PRUDERITY TAX RECEIPTS",
    "AUTHORITY ALLOTMENT LETTER",
    "CONSTRUCTION ESTIMATE FROM REGISTERED ENRINEERARCHITECT",
    "INPROVEMENT/CXTEASION ESTIMATE FROM REGISTERED ENRINEERARCHITECT",
  ];

  // Get document data from Redux or props
  const documentsData = singleDetail.data?.documents || [];

  console.log(singleDetail.data?.documents, "sadadasdasdasdads");

  return (
    <div className='max-w-7xl mx-auto p-4'>
      <div className='bg-white shadow-md rounded-md mb-6'>
        <div className='bg-gray-100 border-b p-4'>
          <h5 className='text-lg font-semibold'>TECHNICAL DOCUMENTS DETAILS</h5>
        </div>
        <div className='p-4 overflow-auto'>
          <table className='min-w-full border border-gray-300 text-sm'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='border px-2 py-2 text-left'>Document Name</th>
                <th className='border px-2 py-2 text-left'>Document Type</th>
                <th className='border px-2 py-2 text-left'>Ref No</th>
                <th className='border px-2 py-2 text-left'>Ref Date</th>
                <th className='border px-2 py-2 text-left'>
                  Details of Approval
                </th>
                <th className='border px-2 py-2 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {documentTypes.map((docName, idx) => {
                const docData =
                  documentsData.find((doc) => doc.name === docName) || {};
                return (
                  <tr key={idx} className='odd:bg-white even:bg-gray-50'>
                    <td className='border px-2 py-2'>{docName}</td>
                    <td className='border px-2 py-2'>{docData.type || "-"}</td>
                    <td className='border px-2 py-2'>{docData.refNo || "-"}</td>
                    <td className='border px-2 py-2'>
                      {docData.refDate || "-"}
                    </td>
                    <td className='border px-2 py-2'>
                      {docData.approvalDetails || "-"}
                    </td>
                    <td className='border px-2 py-2'>
                      {docData.uploadedFile ? (
                        <a
                          href={docData.uploadedFile}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className='mt-6'>
            <h6 className='text-md font-semibold mb-2'>Upload Document</h6>
            <table className='w-full border border-gray-300 text-sm'>
              <tbody>
                <tr className='bg-white'>
                  <td className='border px-2 py-2 font-medium'>
                    Select Document Name
                  </td>
                  <td className='border px-2 py-2'>
                    {singleDetail?.name || "-"}
                  </td>
                </tr>
                <tr className='bg-gray-50'>
                  <td className='border px-2 py-2 font-medium'>
                    Upload Status
                  </td>
                  <td className='border px-2 py-2'>
                    {singleDetail?.uploadedFile ? "Uploaded" : "Not Uploaded"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadDisplay;
