import React from "react";
import { useSelector } from "react-redux";

const Basic = () => {
  const { singleDetail } = useSelector((state) => state.primal) || {};

  return (
    <div className="container mx-auto mt-2 p-4 bg-white shadow-lg rounded-lg">
      <div
        style={{ backgroundColor: "#365069" }}
        className="text-white p-3 rounded mb-4"
      >
        <h2 className="text-lg font-medium">Basic Details</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="col-span-1">
          <p className="text-gray-500">Applicant's Name / Owner Name</p>
          <p className="font-semibold">{singleDetail?.applicantName || "-"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Property Category</p>
          <p className="font-semibold">
            {singleDetail?.propertyCategory || "-"}
          </p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Property Sub-Category</p>
          <p className="font-semibold">
            {singleDetail?.propertySubCategory || "-"}
          </p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">If Green Housing</p>
          <p className="font-semibold">{singleDetail?.greenHousing || "No"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Type and Level of Certification</p>
          <p className="font-semibold">
            {singleDetail?.certificationType || "Not Applicable"}
          </p>
        </div>
        <div className="col-span-3">
          <p className="text-gray-500">Address as per Provided Documents</p>
          <p className="font-semibold">{singleDetail?.address || "-"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Flat No/Block No/Shop No</p>
          <p className="font-semibold">{singleDetail?.flatNo || "Na"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Floor Number & Wing Name</p>
          <p className="font-semibold">{singleDetail?.floorWing || "Na"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Building/House/Shop Name</p>
          <p className="font-semibold">{singleDetail?.buildingName || "-"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">CTS/Survey/Khasra Number</p>
          <p className="font-semibold">{singleDetail?.khasraNumber || "-"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Street Name</p>
          <p className="font-semibold">{singleDetail?.streetName || "-"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Landmark</p>
          <p className="font-semibold">{singleDetail?.landmark || "-"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Village/Location</p>
          <p className="font-semibold">{singleDetail?.village || "-"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">City/Taluka/Town</p>
          <p className="font-semibold">{singleDetail?.city || "-"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">District</p>
          <p className="font-semibold">{singleDetail?.district || "-"}</p>
        </div>
      </div>
      <hr className="my-4 border-t border-gray-200" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="col-span-1">
          <p className="text-gray-500">Pincode</p>
          <p className="font-semibold">{singleDetail?.pincode || "-"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">State</p>
          <p className="font-semibold">{singleDetail?.state || "-"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Country</p>
          <p className="font-semibold">{singleDetail?.country || "India"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Latitude</p>
          <p className="font-semibold">{singleDetail?.latitude || "-"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Longitude</p>
          <p className="font-semibold">{singleDetail?.longitude || "-"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Address Matching</p>
          <p className="font-semibold">
            {singleDetail?.addressMatching || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Basic;
