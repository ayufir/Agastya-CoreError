import React from "react";

const PlanDetails = () => {
  return (
    <div className="container mx-auto my-4 p-4 bg-white shadow-lg rounded-lg">
      <div
        style={{ backgroundColor: "#365069" }}
        className="text-white p-3 rounded mb-4 text-left"
      >
        <h2 className="text-lg font-medium">
          Sanction Plan Approval & Other Document Details
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        <div className="col-span-1">
          <h6 className="text-gray-500">Usage as per CDP/Master plan</h6>
          <p className="font-bold">Residential</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-gray-500">
            Usage approved as per Plan / Provided Documents
          </h6>
          <p className="font-bold">Residential</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-gray-500">Current Usage</h6>
          <p className="font-bold">Residential</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-gray-500">Property coming under which limits</h6>
          <p className="font-bold">GP Limits</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-gray-500">Plot within Municipal limit</h6>
          <p className="font-bold">No</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-gray-500">
            Whether property under demolition list as per authority
          </h6>
          <p className="font-bold">No</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-gray-500">Plan approved by</h6>
          <p className="font-bold">Na</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-gray-500">Plan Details (Numbers & Date)</h6>
          <p className="font-bold">Na</p>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
