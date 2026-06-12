import React, { useState } from 'react';

const UploadAndSiteVisitForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    image1: null,
    image2: null,
    fileName: '',
    originalFileName: '',
    latitude: '',
    longitude: '',
    location: '',
    imageDate: '',
    propertyType: '',
    unitType: '',
    loanType: '',
    propertyAddress: '',
    landmark: '',
    legalAddress: '',
    pin: ''
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        if (file.size > 102400) { // 100 KB
          alert("File size must be under 100KB");
          return;
        }
        if (file.type !== "image/jpeg") {
          alert("Only JPEG files are allowed");
          return;
        }
      }
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div className="p-3 bg-amber-50 border border-gray-300 rounded-lg">
      <h5 className="text-red-600 font-bold">
        "RESALE FIRST" Request ID: <span className="text-black">HRQ-25-57269</span>
      </h5>

      {/* Image Upload Section */}
      <div className="mb-3 bg-white rounded-lg shadow p-4 border border-gray-200">
        <h6 className="text-red-600 font-bold mb-3">Upload Images</h6>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-2">
            <label htmlFor="image1" className="block text-sm font-medium text-gray-700 mb-1">Image 1</label>
            <input 
              type="file" 
              id="image1"
              name="image1" 
              accept="image/jpeg"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-red-50 file:text-red-700
                hover:file:bg-red-100"
            />
            {formData.image1 && <p className="text-sm text-gray-600 mt-1">{formData.image1.name}</p>}
            <p className="text-xs text-red-600 mt-1">Allowed Type: jpeg | Max Size: 100KB</p>
          </div>
          <div className="mb-2">
            <label htmlFor="image2" className="block text-sm font-medium text-gray-700 mb-1">Image 2</label>
            <input 
              type="file" 
              id="image2"
              name="image2" 
              accept="image/jpeg"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-red-50 file:text-red-700
                hover:file:bg-red-100"
            />
            {formData.image2 && <p className="text-sm text-gray-600 mt-1">{formData.image2.name}</p>}
            <p className="text-xs text-red-600 mt-1">Allowed Type: jpeg | Max Size: 100KB</p>
          </div>
        </div>

        {/* File Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File Save by Name</label>
            <input 
              type="text"
              name="fileName" 
              onChange={handleChange} 
              value={formData.fileName} 
              className="w-full p-2 border border-gray-300 rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Original File Name</label>
            <input 
              type="text"
              name="originalFileName" 
              onChange={handleChange} 
              value={formData.originalFileName} 
              className="w-full p-2 border border-gray-300 rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input 
              type="text"
              name="latitude" 
              onChange={handleChange} 
              value={formData.latitude} 
              className="w-full p-2 border border-gray-300 rounded" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input 
              type="text"
              name="longitude" 
              onChange={handleChange} 
              value={formData.longitude} 
              className="w-full p-2 border border-gray-300 rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input 
              type="text"
              name="location" 
              onChange={handleChange} 
              value={formData.location} 
              className="w-full p-2 border border-gray-300 rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Taken Date</label>
            <input 
              type="date" 
              name="imageDate" 
              onChange={handleChange} 
              value={formData.imageDate} 
              className="w-full p-2 border border-gray-300 rounded" 
            />
          </div>
        </div>
      </div>

      {/* Site Visit Details */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <h6 className="text-red-600 font-bold mb-3">First Site Visit Report</h6>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select 
              name="propertyType" 
              onChange={handleChange} 
              value={formData.propertyType} 
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option>Select Property Type</option>
              <option>Residential</option>
              <option>Commercial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
            <select 
              name="unitType" 
              onChange={handleChange} 
              value={formData.unitType} 
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option>Select</option>
              <option>Flat</option>
              <option>Plot</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loan Property Type</label>
            <select 
              name="loanType" 
              onChange={handleChange} 
              value={formData.loanType} 
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option>Select</option>
              <option>General</option>
              <option>Special</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
            <input 
              type="text"
              name="propertyAddress" 
              onChange={handleChange} 
              value={formData.propertyAddress} 
              className="w-full p-2 border border-gray-300 rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nearest Landmark</label>
            <input 
              type="text"
              name="landmark" 
              onChange={handleChange} 
              value={formData.landmark} 
              className="w-full p-2 border border-gray-300 rounded" 
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Legal Address</label>
          <textarea 
            rows={3} 
            name="legalAddress" 
            onChange={handleChange} 
            value={formData.legalAddress} 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
            <input 
              type="text"
              name="pin" 
              onChange={handleChange} 
              value={formData.pin} 
              className="w-full p-2 border border-gray-300 rounded" 
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-4"
        onClick={handleSubmit}
      >
        Next
      </button>
    </div>
  );
};

export default UploadAndSiteVisitForm;
