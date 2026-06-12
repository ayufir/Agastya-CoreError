import React from "react";

const Individual = () => {
  return (
    <div className="container mx-auto my-4 p-4 bg-white shadow-md rounded-lg">
      {/* Header */}
      <div
        style={{ backgroundColor: "#365069" }}
        className="text-white p-3 rounded mb-4"
      >
        <h2 className="text-lg font-semibold">Valuation</h2>
      </div>

      {/* Individual Property */}
      <div className="text-center">
        <span className="text-red-500 font-semibold text-lg border border-gray-400 px-4 py-1 rounded-full">
          Individual Property
        </span>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="border border-gray-200 p-2">Property Type</th>
              <th className="border border-gray-200 p-2">Area (sqft/sqmt)</th>
              <th className="border border-gray-200 p-2">Rate (sqft/sqmt)</th>
              <th className="border border-gray-200 p-2">Depreciation (%)</th>
              <th className="border border-gray-200 p-2">Amount (in Rs.)</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {[
              {
                type: "Land Value",
                area: "1981",
                rate: "0",
                depreciation: "0",
                amount: "0",
              },
              {
                type: "Building Value after Depreciation",
                area: "0",
                rate: "0",
                depreciation: "0",
                amount: "0",
              },
              {
                type: "Extension / Improvement",
                area: "0",
                rate: "0",
                depreciation: "0",
                amount: "0",
              },
            ].map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-200 p-2">{item.type}</td>
                <td className="border border-gray-200 p-2">{item.area}</td>
                <td className="border border-gray-200 p-2">{item.rate}</td>
                <td className="border border-gray-200 p-2">
                  {item.depreciation}
                </td>
                <td className="border border-gray-200 p-2">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Amenities Section */}
      <div className="mt-4 border-t pt-4">
        <div className="text-center">
          <span className="text-red-500 font-semibold text-lg border border-gray-400 px-4 py-1 rounded-full">
            Amenities
          </span>
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <p className="text-gray-500">Amenities Available</p>
            <p className="font-semibold">Na</p>
          </div>
          <div>
            <p className="text-gray-500">Details on Interiors</p>
            <p className="font-semibold">Na</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <p className="text-gray-500">Amenities Value</p>
            <p className="font-semibold">0</p>
          </div>
          <div>
            <p className="text-gray-500">Fixed Interiors Value</p>
            <p className="font-semibold">0</p>
          </div>
        </div>
      </div>

      {/* Car Park Section */}
      <div className="mt-4 border-t pt-4">
        <div className="text-center">
          <span className="text-red-500 font-semibold text-lg border border-gray-400 px-4 py-1 rounded-full">
            Car Park
          </span>
        </div>

        <div className="mt-4 flex justify-between">
          <div>
            <p className="text-gray-500">No of Car Parks</p>
            <p className="font-semibold">--</p>
          </div>
          <div>
            <p className="text-gray-500">Value of Car Park</p>
            <p className="font-semibold">--</p>
          </div>
          <div>
            <p className="text-gray-500">Total Value of Car Parks</p>
            <p className="font-semibold">--</p>
          </div>
          <div>
            <p className="text-gray-500">Total Realisable Value (in Amt.)</p>
            <p className="font-semibold">₹0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Individual;
