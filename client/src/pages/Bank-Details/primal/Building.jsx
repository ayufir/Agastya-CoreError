import React from "react";
import { useSelector } from "react-redux";

const Building = () => {
  const singleDetail = useSelector((state) => state.primal?.singleDetail);

  return (
    <div className="container mx-auto my-4 p-4 bg-white shadow rounded">
      {/* Header */}
      <div className="border-b pb-3 mb-4">
        <div className="bg-[#365069] text-white p-3 rounded mb-4">
          <h2 className="text-lg font-semibold">Building Details</h2>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        <div className="mb-3">
          <p className="text-gray-500">No. of Blocks/Wings</p>
          <p className="font-semibold">{singleDetail?.numberOfBlocks || "0"}</p>
        </div>
        <div className="mb-3">
          <p className="text-gray-500">No. of Lifts</p>
          <p className="font-semibold">{singleDetail?.numberOfLifts || "0"}</p>
        </div>
        <div className="mb-3">
          <p className="text-gray-500">Age of Building (in years)</p>
          <p className="font-semibold">{singleDetail?.ageOfBuilding || "0"}</p>
        </div>
        <div className="mb-3">
          <p className="text-gray-500">Residual life of Building (in years)</p>
          <p className="font-semibold">{singleDetail?.residualLife || "60"}</p>
        </div>
      </div>

      {/* Second Row in One Line */}
      <div className="flex flex-wrap items-center gap-4 text-sm mt-3">
        <div>
          <p className="text-gray-500 mb-0">Unit Configuration:</p>
          <p className="font-semibold inline">
            {singleDetail?.unitConfiguration || "Na"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-0">Floors Approved/Sanctioned:</p>
          <p className="font-semibold inline">
            {singleDetail?.floorsApproved ||
              "0 Basement + Ground + 0 Podium + 0 Habitable Floors"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-0">Floors Proposed:</p>
          <p className="font-semibold inline">
            {singleDetail?.floorsProposed ||
              "0 Basement + Ground + 0 Podium + 0 Habitable Floors"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-0">Floors at Site:</p>
          <p className="font-semibold inline">
            {singleDetail?.floorsAtSite ||
              "0 Basement + Ground + 0 Podium + 0 Habitable Floors"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Building;
