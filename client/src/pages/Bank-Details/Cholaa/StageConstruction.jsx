import React from "react";
import { useSelector } from "react-redux";

const StageConstruction = () => {
  const { singleDetail } = useSelector((state) => state.chola) || {};

  return (
    <div className="my-8 px-4">
      <div className="border rounded shadow mb-6">
        <div className="p-4 bg-gray-100 border-b">
          <h5 className="text-lg font-semibold">
            TRANCHE 1 COMPLETION DETAILS
          </h5>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Percentage of property completed</strong>
                <br />
                {singleDetail?.data?.percentageCompleted || 0}%
              </p>
            </div>
            <div>
              <p>
                <strong>Surrounding development details required</strong>
                <br />
                {singleDetail?.data?.surroundingDevelopment || 0}%
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h6 className="text-md font-semibold mb-2">ACTIVITY COMPLETED</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="mr-2">
                    {singleDetail?.data?.plinth ? "✓" : "□"}
                  </span>{" "}
                  PLINTH
                </p>
                <p>
                  <span className="mr-2">
                    {singleDetail?.data?.rccAboveGround ? "✓" : "□"}
                  </span>{" "}
                  R.C.C. ABOVE GROUND
                </p>
                <p>
                  <span className="mr-2">
                    {singleDetail?.data?.brickwork ? "✓" : "□"}
                  </span>{" "}
                  BRICKWORK
                </p>
                <p>
                  <span className="mr-2">
                    {singleDetail?.data?.internalPlaster ? "✓" : "□"}
                  </span>{" "}
                  INTERNAL PLASTER
                </p>
                <p>
                  <span className="mr-2">
                    {singleDetail?.data?.externalPlaster ? "✓" : "□"}
                  </span>{" "}
                  EXTERNAL PLASTER
                </p>
              </div>
              <div>
                <p>
                  <span className="mr-2">
                    {singleDetail?.data?.flooring ? "✓" : "□"}
                  </span>{" "}
                  FLOORING
                </p>
                <p>
                  <span className="mr-2">
                    {singleDetail?.data?.plumbingElectricWork ? "✓" : "□"}
                  </span>{" "}
                  PLUMBING & ELECTRIC WORK
                </p>
                <p>
                  <span className="mr-2">
                    {singleDetail?.data?.doorWindowPaint ? "✓" : "□"}
                  </span>{" "}
                  DOOR, WINDOW AND PAINT
                </p>
                <p>
                  <span className="mr-2">
                    {singleDetail?.data?.finishingPossession ? "✓" : "□"}
                  </span>{" "}
                  FINISHING AND POSSESSION
                </p>
                <p>
                  <span className="mr-2">
                    {singleDetail?.data?.totalCompletion ? "✓" : "□"}
                  </span>{" "}
                  TOTAL COMPLETION
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h6 className="text-md font-semibold mb-2">Remarks</h6>
            <p>{singleDetail?.data?.remarks || "No remarks available"}</p>

            <div className="overflow-x-auto mt-4">
              <table className="min-w-full table-fixed border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Document</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Property Document</td>
                    <td className="border px-4 py-2">
                      {singleDetail?.data?.propertyImage
                        ? "Uploaded"
                        : "Not Uploaded"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Map</td>
                    <td className="border px-4 py-2">
                      {singleDetail?.data?.map ? "Uploaded" : "Not Uploaded"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Plan</td>
                    <td className="border px-4 py-2">
                      {singleDetail?.data?.plan ? "Uploaded" : "Not Uploaded"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageConstruction;
