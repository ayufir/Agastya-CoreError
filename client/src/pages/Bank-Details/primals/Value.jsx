import React from "react";

const Value = () => {
  return (
    <div className="max-w-7xl mx-auto my-4 p-6 bg-white shadow rounded">
      {/* Header */}
      <div className="bg-[#365069] text-white p-4 rounded mb-6">
        <h2 className="text-lg font-semibold">Other Value References</h2>
      </div>

      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Guideline Value of The Property</p>
          <p className="font-semibold">₹ 614</p>
        </div>
        <div>
          <p className="text-gray-500">Forced Sale Value / Distressed rate</p>
          <p className="font-semibold">₹ 0</p>
        </div>
        <div>
          <p className="text-gray-500">Re-construction cost</p>
          <p className="font-semibold">₹ 0</p>
        </div>
        <div>
          <p className="text-gray-500">
            Approx. Rentals in case of 100% complete property
          </p>
          <p className="font-semibold">₹ 0</p>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mt-6">
        <div>
          <p className="text-gray-500">
            Risk of Demolition based on Techno-legal aspect/ Building Quality
          </p>
          <p className="font-semibold">Low</p>
        </div>
        <div>
          <p className="text-gray-500">Offset/Projections</p>
          <p className="font-semibold">Within Norms</p>
        </div>
        <div>
          <p className="text-gray-500">Extra Coverage</p>
          <p className="font-semibold">Less than 25%</p>
        </div>
        <div>
          <p className="text-gray-500">Habitation</p>
          <p className="font-semibold">Low</p>
        </div>
      </div>
    </div>
  );
};

export default Value;
