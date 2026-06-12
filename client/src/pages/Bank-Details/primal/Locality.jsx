import React from "react";
import { useSelector } from "react-redux";

const Locality = () => {
  const singleDetail = useSelector((state) => state.primal?.singleDetail);

  return (
    <div className="container mx-auto mt-4 p-4 bg-white shadow-lg rounded-lg">
      <div
        style={{ backgroundColor: "#365069" }}
        className="text-white p-3 rounded mb-4"
      >
        <h2 className="text-lg font-medium">Surrounding & Locality Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        <div className="col-span-1">
          <h6 className="text-blue-600">Location Type</h6>
          <p className="font-semibold">{singleDetail?.locationType || "-"}</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">Class of Locality</h6>
          <p className="font-semibold">
            {singleDetail?.classOfLocality || "-"}
          </p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">Proximity to civic amenities</h6>
          <p className="font-semibold">
            {singleDetail?.proximityToCivicAmenities || "-"}
          </p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">Railway Station</h6>
          <p className="font-semibold">{singleDetail?.railwayStation || "-"}</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">Bus Stop</h6>
          <p className="font-semibold">{singleDetail?.busStop || "-"}</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">Type of Road</h6>
          <p className="font-semibold">{singleDetail?.typeOfRoad || "-"}</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">
            Legal approach to the property as per documents
          </h6>
          <p className="font-semibold">{singleDetail?.legalApproach || "-"}</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">
            Physical approach to the property as per site visit
          </h6>
          <p className="font-semibold">
            {singleDetail?.physicalApproach || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Locality;
