import React from "react";
import { useSelector } from "react-redux";

const Valuation = () => {
  const { singleDetail } = useSelector((state) => state.primal);
  console.log(singleDetail);

  return (
    <div className="max-w-6xl mt-4 p-4 bg-white shadow-lg rounded mx-auto">
      <div
        style={{ backgroundColor: "#365069" }}
        className="text-white p-3 rounded mb-4"
      >
        <h2 className="text-lg">Individual Valuation Report</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="col-span-1">
          <p className="text-gray-500">Case Type</p>
          <p className="font-semibold">LAP</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">House Delivery Agency</p>
          <p className="font-semibold">Self-Construction</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">
            Valuer visited this property any other FI
          </p>
          <p className="font-semibold">No</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Valuation Report Status</p>
          <p className="font-semibold text-green-500">Positive</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Scope of Valuation</p>
          <p className="font-semibold">FAIR MARKET VALUE</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">
            Contact Person Name (Broker or Applicant)
          </p>
          <p className="font-semibold">SMT Snehata Singh</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Contact Person Number</p>
          <p className="font-semibold">7987468344</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Relationship with applicant</p>
          <p className="font-semibold">SELF</p>
        </div>
      </div>
    </div>
  );
};

export default Valuation;
