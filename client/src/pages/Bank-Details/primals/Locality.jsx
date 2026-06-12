import React from "react";

const Locality = () => {
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
          <p className="font-semibold">Residential</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">Class of Locality</h6>
          <p className="font-semibold">MIG</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">Proximity to civic amenities</h6>
          <p className="font-semibold">1 Kilometers</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">Railway Station</h6>
          <p className="font-semibold">18 Kilometers</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">Bus Stop</h6>
          <p className="font-semibold">19 Kilometers</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">Type of Road</h6>
          <p className="font-semibold">Mudroad</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">
            Legal approach to the property as per documents
          </h6>
          <p className="font-semibold">Clear</p>
        </div>
        <div className="col-span-1">
          <h6 className="text-blue-600">
            Physical approach to the property as per site visit
          </h6>
          <p className="font-semibold">Clear</p>
        </div>
      </div>
    </div>
  );
};

export default Locality;
