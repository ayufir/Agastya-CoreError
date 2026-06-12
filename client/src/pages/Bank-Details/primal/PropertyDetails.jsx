import React from "react";
import { useSelector } from "react-redux";

const PropertyDetails = () => {
  const singleDetail = useSelector((state) => state.primal?.singleDetail);

  return (
    <div className="max-w-7xl mx-auto my-4 p-6 bg-white shadow-lg rounded-lg">
      <div className="bg-[#365069] text-white p-4 rounded mb-6">
        <h2 className="text-lg font-semibold">Property Details</h2>
      </div>

      {/* Occupant Details Section */}
      <div className="p-4 mb-6">
        <div className="text-center mb-4">
          <span className="text-red-600 font-semibold border border-gray-400 rounded-full px-4 py-1 inline-block">
            {singleDetail?.qualityOfConstruction || "Quality of Construction"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Occupancy of the Property</p>
            <p className="font-semibold">
              {singleDetail?.occupancyOfProperty || "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Multi Tenanted Property</p>
            <p className="font-semibold">
              {singleDetail?.multiTenantedProperty || "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Number of Tenants</p>
            <p className="font-semibold">
              {singleDetail?.numberOfTenants || "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">If Vacant, since how long</p>
            <p className="font-semibold">{singleDetail?.vacantSince || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">
              Reason for being vacant as per local enquiry
            </p>
            <p className="font-semibold">
              {singleDetail?.reasonForVacant || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Land Details Section */}
      <div className="p-4">
        <div className="text-center mb-4">
          <span className="text-red-600 font-semibold border border-gray-400 rounded-full px-4 py-1 inline-block">
            Land Details
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Land/Plot Area as per plan</p>
            <p className="font-semibold">
              {singleDetail?.landAreaAsPerPlan || "0 sq. ft."}
            </p>
          </div>
          <div>
            <p className="text-gray-500">
              Land/Plot Area as per title documents
            </p>
            <p className="font-semibold">
              {singleDetail?.landAreaAsPerTitle || "0 sq. ft."}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Land/Plot Area as per site</p>
            <p className="font-semibold">
              {singleDetail?.landAreaAsPerSite || "0 sq. ft."}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Residential Area</p>
            <p className="font-semibold">
              {singleDetail?.residentialArea || "0 sq. ft."}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Commercial Area</p>
            <p className="font-semibold">
              {singleDetail?.commercialArea || "0 sq. ft."}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Type of plot (in case of plot)</p>
            <p className="font-semibold">{singleDetail?.typeOfPlot || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">
              Final Land area / UDS considered for valuation
            </p>
            <p className="font-semibold">
              {singleDetail?.finalLandArea || "0 sq. ft."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
