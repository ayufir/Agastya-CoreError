// DocumentAttach.js
import React from "react";
import axiosInstance from "../config/axios"; // adjust the path as needed
import toast from "react-hot-toast";

const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN;

const DocumentAttach = ({ caseId }) => {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);
    formData.append("caseId", caseId);

    try {
      await axiosInstance.post(`/uploads/upload-document`, formData, {
        headers: {
          // ✅ Do NOT add 'Content-Type'
          "Content-Type": "multipart/form-data",
          // ✅ Add any auth token or custom headers if needed
          // Authorization: `Bearer ${yourToken}`
        },
      });
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload document");
    }
  };

  return (
    <input
      type='file'
      accept='.pdf,.doc,.docx,.jpg,.png'
      onChange={handleFileUpload}
      style={{ width: "140px" }}
      className='w-36 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700'
    />
  );
};

export default DocumentAttach;
