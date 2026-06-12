import React, { useState } from 'react';

const RequestForm = ({ onDataChange, onNext }) => {
  const [formData, setFormData] = useState({
    status: "Work in progress",
    type: "Individual Technical Request",
    technicalAdmin: "SWARNIM RAYAL",
    dateOfRequest: "10/APR/2025 03:28:51 PM",
    channel: "LOS_CHANNEL",
    branch: "(10816) DEHRADUN SOUTH",
    applicationNo: "77000019932",
    customerName: "NARAYAN KHARKA CHHETRI",
    productType: "NON HOME LOAN",
    businessGroup: "HFCMORTGAGES",
    requestFor: "HFC",
    products: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div className="border p-4 rounded-md bg-yellow-50">
      <h5 className="font-bold text-gray-800 mb-4">
        "RESALE FIRST" Request ID: <span className="text-red-700">HRQ-25-57269</span>
      </h5>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* First Row */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Technical Admin</label>
          <input
            type="text"
            name="technicalAdmin"
            value={formData.technicalAdmin}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date of Request</label>
          <input
            type="text"
            name="dateOfRequest"
            value={formData.dateOfRequest}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Second Row */}
        <div>
          <label className="block text-sm font-medium mb-1">Channel</label>
          <input
            type="text"
            name="channel"
            value={formData.channel}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Section Heading */}
        <div className="col-span-full mt-4 border-t pt-4">
          <h5 className="text-center font-bold text-red-600">Customer Details</h5>
        </div>

        {/* Customer Details Row */}
        <div>
          <label className="block text-sm font-medium mb-1">Application No.</label>
          <input
            type="text"
            name="applicationNo"
            value={formData.applicationNo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product Type</label>
          <input
            type="text"
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Business Group</label>
          <input
            type="text"
            name="businessGroup"
            value={formData.businessGroup}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Request For</label>
          <input
            type="text"
            name="requestFor"
            value={formData.requestFor}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Select Product</label>
          <select
            name="products"
            value={formData.products}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Product</option>
            <option value="APNA GHAR - BALANCE TRANSFER + TOP-UP">APNA GHAR - BALANCE TRANSFER + TOP-UP</option>
            {/* Add other product options here */}
          </select>
        </div>

        <button
          className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-4"
          onClick={handleSubmit}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RequestForm;
