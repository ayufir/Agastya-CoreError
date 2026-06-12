import React from "react";

const AreaDetails = () => {
  return (
    <div className="container mx-auto my-4 p-4 bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="border-b pb-3 mb-4">
        <div
          style={{ backgroundColor: "#365069" }}
          className="text-white p-3 rounded mb-4"
        >
          <h2 className="text-lg font-semibold">Area Details</h2>
        </div>
      </div>

      {/* Type of Property */}
      <div className="mb-4">
        <p className="text-gray-500">Type of Property</p>
        <p className="font-semibold">Individual Property</p>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-center">
            <tr>
              <th className="border border-gray-200 p-2">Floor</th>
              <th className="border border-gray-200 p-2">
                Sanctioned Area / Permissible
              </th>
              <th className="border border-gray-200 p-2">Actual Area</th>
              <th className="border border-gray-200 p-2">
                Final Area Considered
              </th>
              <th className="border border-gray-200 p-2">
                Overall BUA Division wrt Permissible Area
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {[
              "Basement Floor",
              "Stilt Floor",
              "Ground Floor",
              "First Floor",
              "Second Floor",
              "Third Floor",
              "Fourth Floor",
              "Sixth Floor",
            ].map((floor, index) => (
              <tr key={index}>
                <td className="border border-gray-200 p-2">{floor}</td>
                <td className="border border-gray-200 p-2">0</td>
                <td className="border border-gray-200 p-2">0</td>
                <td className="border border-gray-200 p-2">0</td>
                <td className="border border-gray-200 p-2">
                  {index === 7 ? "Enter OverAll BUA" : "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quality of Construction */}
      <div className="mt-4 border-t pt-4">
        <div className="text-center">
          <span className="text-red-500 font-semibold text-lg border border-gray-400 px-4 py-1 rounded-full">
            Quality of Construction
          </span>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div>
            <p className="text-gray-500">Exteriors</p>
            <p className="font-semibold">Non Satisfactory</p>
          </div>
          <div>
            <p className="text-gray-500">Interiors</p>
            <p className="font-semibold">Non Satisfactory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaDetails;
