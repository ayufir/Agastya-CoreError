import React from "react";
import { useSelector } from "react-redux";

const Valuation = () => {
  const singleDetail = useSelector((state) => state.primal?.singleDetail);

  return (
    <div className="max-w-6xl mt-4 p-4 bg-white shadow-lg rounded mx-auto">
      <div
        style={{ backgroundColor: "#365069" }}
        className="text-white p-3 rounded mb-4"
      >
        <h2 className="text-lg">Individual Valuation Report</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Case Type</p>
          <p className="font-semibold">{singleDetail?.caseType || "-"}</p>
        </div>
        <div>
          <p className="text-gray-500">House Delivery Agency</p>
          <p className="font-semibold">
            {singleDetail?.houseDeliveryAgency || "-"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">
            Valuer visited this property any other FI
          </p>
          <p className="font-semibold">{singleDetail?.valuerVisit || "-"}</p>
        </div>
        <div>
          <p className="text-gray-500">Valuation Report Status</p>
          <p
            className={`font-semibold ${
              singleDetail?.valuationReportStatus === "Positive"
                ? "text-green-500"
                : ""
            }`}
          >
            {singleDetail?.valuationReportStatus || "-"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Scope of Valuation</p>
          <p className="font-semibold">
            {singleDetail?.scopeOfValuation || "-"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Contact Person Name</p>
          <p className="font-semibold">
            {singleDetail?.contactPersonName || "-"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Contact Person Number</p>
          <p className="font-semibold">
            {singleDetail?.contactPersonNumber || "-"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Relationship with Applicant</p>
          <p className="font-semibold">
            {singleDetail?.relationshipWithApplicant || "-"}
          </p>
        </div>
      </div>

      <hr className="my-6" />

      <h3 className="text-md font-semibold text-gray-700 mb-2">
        Land Valuation
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Area</p>
          <p className="font-semibold">{singleDetail?.landValueArea || "0"}</p>
        </div>
        <div>
          <p className="text-gray-500">Rate</p>
          <p className="font-semibold">{singleDetail?.landValueRate || "0"}</p>
        </div>
        <div>
          <p className="text-gray-500">Depreciation</p>
          <p className="font-semibold">
            {singleDetail?.landValueDepreciation || "0"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-semibold">
            {singleDetail?.landValueAmount || "0"}
          </p>
        </div>
      </div>

      <h3 className="text-md font-semibold text-gray-700 mt-6 mb-2">
        Building Valuation
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Area</p>
          <p className="font-semibold">
            {singleDetail?.buildingValueArea || "0"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Rate</p>
          <p className="font-semibold">
            {singleDetail?.buildingValueRate || "0"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Depreciation</p>
          <p className="font-semibold">
            {singleDetail?.buildingValueDepreciation || "0"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-semibold">
            {singleDetail?.buildingValueAmount || "0"}
          </p>
        </div>
      </div>

      <h3 className="text-md font-semibold text-gray-700 mt-6 mb-2">
        Improvements
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Area</p>
          <p className="font-semibold">
            {singleDetail?.improvementArea || "0"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Rate</p>
          <p className="font-semibold">
            {singleDetail?.improvementRate || "0"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Depreciation</p>
          <p className="font-semibold">
            {singleDetail?.improvementDepreciation || "0"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-semibold">
            {singleDetail?.improvementAmount || "0"}
          </p>
        </div>
      </div>

      <h3 className="text-md font-semibold text-gray-700 mt-6 mb-2">
        Amenities & Interiors
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Amenities Available</p>
          <p className="font-semibold">
            {singleDetail?.amenitiesAvailable || "Na"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Amenities Value</p>
          <p className="font-semibold">{singleDetail?.amenitiesValue || "0"}</p>
        </div>
        <div>
          <p className="text-gray-500">Fixed Interiors Value</p>
          <p className="font-semibold">
            {singleDetail?.fixedInteriorsValue || "0"}
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="text-gray-500">Details on Interiors</p>
          <p className="font-semibold">
            {singleDetail?.detailsOnInteriors || "Na"}
          </p>
        </div>
      </div>

      <h3 className="text-md font-semibold text-gray-700 mt-6 mb-2">
        Car Parking
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-gray-500">No. of Car Parks</p>
          <p className="font-semibold">{singleDetail?.noOfCarParks || "--"}</p>
        </div>
        <div>
          <p className="text-gray-500">Value of Car Park</p>
          <p className="font-semibold">
            {singleDetail?.valueOfCarPark || "--"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Total Value of Car Parks</p>
          <p className="font-semibold">
            {singleDetail?.totalValueOfCarParks || "--"}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded text-center">
        <p className="text-gray-600 text-sm">Total Realisable Value</p>
        <p className="text-xl font-bold text-green-700">
          {singleDetail?.totalRealisableValue || "₹0"}
        </p>
      </div>
    </div>
  );
};

export default Valuation;
