import React from "react";

const DocumentUpload = ({ onUpload }) => {

    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        onUpload(files);
    };

    return (
   <div className="border border-gray-200 rounded-lg bg-white shadow-sm p-4">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
  </label>

  <div className="flex items-center justify-between border border-dashed border-gray-300 rounded-md px-3 py-2 bg-gray-50">
    
    <span className="text-sm text-gray-500">
      Choose files to upload
    </span>

    <label className="cursor-pointer bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-blue-700 transition">
      Browse
      <input
        type="file"
        multiple
        onChange={handleChange}
        className="hidden"
      />
    </label>

  </div>

  <p className="text-xs text-gray-400 mt-2">
    Upload PDFs, Excel, ATS, Registry & site photos
  </p>
</div>
    );
};

export default DocumentUpload;
