import React from "react";

const Basic = () => {
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
          <p className="font-semibold">Mrs. SNEHATA SINGH</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Property Category</p>
          <p className="font-semibold">Specialized Property</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Property Sub-Category</p>
          <p className="font-semibold">
            Plot (Plot LAP / Industrial Plot / Commercial Plot)
          </p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">If Green Housing</p>
          <p className="font-semibold">No</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Type and Level of Certification</p>
          <p className="font-semibold">Not Applicable</p>
        </div>
        <div className="col-span-3">
          <p className="text-gray-500">Address as per Provided Documents</p>
          <p className="font-semibold">
            PROPERTY IS PLOT NO. 08, AT PART OF KHASRA NO. 871/1, GRAM CHHAPRI,
            P.H.NO. 32, R.N.M RATIBAD, VIKASH KHAND FANDA, TEHSIL HUZUR, DIST.
            BHOPAL MP 462044
          </p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Flat No/Block No/Shop No</p>
          <p className="font-semibold">Na</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Floor Number & Wing Name</p>
          <p className="font-semibold">Na</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Building/House/Shop Name</p>
          <p className="font-semibold">PLOT NO. 08</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">CTS/Survey/Khasra Number</p>
          <p className="font-semibold">KHASRA NO. 871/1</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Street Name</p>
          <p className="font-semibold">BHADBHADA ROAD</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Landmark</p>
          <p className="font-semibold">JIND BABA MANDIR</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Village/Location</p>
          <p className="font-semibold">CHHAPRI</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">City/Taluka/Town</p>
          <p className="font-semibold">RATIBAD</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">District</p>
          <p className="font-semibold">BHOPAL</p>
        </div>
      </div>
      <hr className="my-4 border-t border-gray-200" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="col-span-1">
          <p className="text-gray-500">Pincode</p>
          <p className="font-semibold">462044</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">State</p>
          <p className="font-semibold">Madhya Pradesh</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Country</p>
          <p className="font-semibold">India</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Latitude</p>
          <p className="font-semibold">23.1640633</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Longitude</p>
          <p className="font-semibold">77.31863</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Address Matching</p>
          <p className="font-semibold">Yes</p>
        </div>
      </div>
    </div>
  );
};

export default Basic;
