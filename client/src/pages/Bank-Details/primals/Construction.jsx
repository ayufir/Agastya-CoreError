import React from "react";

const Construction = () => {
  return (
    <div className="max-w-7xl mx-auto my-4 p-6 bg-white shadow rounded">
      {/* Header */}
      <div className="bg-[#365069] text-white p-4 rounded mb-6">
        <h2 className="text-lg font-semibold">Stage Of Construction</h2>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Construction Progress</p>
          <p className="font-semibold text-blue-600">Stalled</p>
        </div>
        <div>
          <p className="text-gray-500">% Progress</p>
          <p className="font-semibold">0</p>
        </div>
        <div>
          <p className="text-gray-500">% Recommended</p>
          <p className="font-semibold">0</p>
        </div>
        <div>
          <p className="text-gray-500">
            Present Realisable Value based on Construction Stage
          </p>
          <p className="font-semibold">₹0</p>
        </div>
      </div>

      {/* Descriptive Section */}
      <div className="mt-6">
        <p className="text-gray-500 font-semibold">
          Stage of Construction (Descriptive)
        </p>
        <p className="text-xl font-bold">OPEN LAND</p>
      </div>
    </div>
  );
};

export default Construction;
