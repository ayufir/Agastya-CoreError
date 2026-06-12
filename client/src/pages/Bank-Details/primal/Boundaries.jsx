import React from "react";
import { useSelector } from "react-redux";

const Boundaries = () => {
  const singleDetail = useSelector((state) => state.primal?.singleDetail);

  return (
    <div className="container mx-auto mt-4 p-4 bg-white shadow-lg rounded-lg">
      <div
        style={{ backgroundColor: "#365069" }}
        className="text-white p-3 rounded mb-4"
      >
        <h2 className="text-lg font-medium">Boundaries</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2"></th>
              <th className="border p-2">East</th>
              <th className="border p-2">West</th>
              <th className="border p-2">North</th>
              <th className="border p-2">South</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 font-bold">As Per Deed</td>
              <td className="border p-2">{singleDetail?.east || "N/A"}</td>
              <td className="border p-2">{singleDetail?.west || "N/A"}</td>
              <td className="border p-2">{singleDetail?.north || "N/A"}</td>
              <td className="border p-2">{singleDetail?.south || "N/A"}</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold">As Per Site</td>
              <td className="border p-2">{singleDetail?.east || "N/A"}</td>
              <td className="border p-2">{singleDetail?.west || "N/A"}</td>
              <td className="border p-2">{singleDetail?.north || "N/A"}</td>
              <td className="border p-2">{singleDetail?.south || "N/A"}</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold">As Per Plan</td>
              <td className="border p-2">Na</td>
              <td className="border p-2">Na</td>
              <td className="border p-2">Na</td>
              <td className="border p-2">Na</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mt-4">
        <div className="col-span-1">
          <p className="text-gray-500">Boundaries Matching</p>
          <p className="font-semibold">
            {singleDetail?.boundariesMatching || "N/A"}
          </p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Remarks if any</p>
          <p className="font-semibold">{singleDetail?.remarks || "N/A"}</p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Property Identified Through</p>
          <p className="font-semibold">
            {singleDetail?.propertyIdentifiedThrough || "N/A"}
          </p>
        </div>
        <div className="col-span-1">
          <p className="text-gray-500">Property Demarcated</p>
          <p className="font-semibold">
            {singleDetail?.propertyDemarcated || "N/A"}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-500">If demarcated, type:</p>
          <p className="font-semibold">
            {singleDetail?.demarcationType || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Boundaries;
