import React from "react";
import { useSelector } from "react-redux";

const Specifications = () => {
  const { singleDetail } = useSelector((state) => state.chola) || {};
  console.log(singleDetail?.data?.areaType, "singleDetail");
  const areatype = singleDetail?.data?.areaType;
  console.log(singleDetail?.data?.amenity, "amenities");

  return (
    <div className="my-4 px-4">
      {/* AREA TYPE CARD */}
      <div className="bg-white border rounded mb-6 shadow-sm">
        <div className="p-3 bg-gray-100 border-b">
          <h5 className="text-lg font-semibold">AREA TYPE</h5>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Type</th>
                <th className="border p-2">Plan</th>
                <th className="border p-2">Site</th>
                <th className="border p-2">Rate</th>
                <th className="border p-2">Valuation Plan</th>
                <th className="border p-2">Valuation Market</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(areatype) &&
                areatype.map((key, index) => (
                  <tr key={index}>
                    <td className="border p-2">{key.type || "-"}</td>
                    <td className="border p-2">{key.plan || "-"}</td>
                    <td className="border p-2">{key.site || "-"}</td>
                    <td className="border p-2">{key.rate || "-"}</td>
                    <td className="border p-2">{key.valuationPlan || "-"}</td>
                    <td className="border p-2">{key.valuationMarket || "-"}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="grid grid-cols-1 md:grid-cols-3 mt-4">
            <div>
              <p>
                <strong>Built up Area</strong>
                <br />
                {singleDetail?.data?.builtUpArea || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VALUATION DETAILS */}
      <div className="bg-white border rounded mb-6 shadow-sm">
        <div className="p-3 bg-gray-100 border-b">
          <h5 className="text-lg font-semibold">VALUATION DETAILS</h5>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p>
                <strong>Total Floors</strong>
                <br />
                {singleDetail?.data?.totalFloors || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Total Market Value</strong>
                <br />
                {singleDetail?.data?.totalMarketValue || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>FSU/FAR</strong>
                <br />
                {singleDetail?.data?.fsuFar || "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p>
                <strong>Achieved</strong>
                <br />
                {singleDetail?.data?.achieved || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>AMENITIES</strong>
                <br />
                {singleDetail?.data?.amenity || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Distress</strong>
                <br />
                {singleDetail?.data?.distress
                  ? `${singleDetail?.data.distress}%`
                  : "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p>
                <strong>Distress Value</strong>
                <br />
                {singleDetail?.data?.distressValue || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Guideline Value</strong>
                <br />
                {singleDetail?.data?.guidelineValue || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Carpet Area</strong>
                <br />
                {singleDetail?.data?.carpetArea || "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p>
                <strong>Carpet Area (sq meters)</strong>
                <br />
                {singleDetail?.data?.carpetAreaInSqMtr || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>RENTAL DETAILS</strong>
                <br />
                {singleDetail?.data?.rentalDetails || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>No of Units</strong>
                <br />
                {singleDetail?.data?.noOfUnits || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADDITIONAL DETAILS */}
      <div className="bg-white border rounded shadow-sm">
        <div className="p-3 bg-gray-100 border-b">
          <h5 className="text-lg font-semibold">ADDITIONAL DETAILS</h5>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p>
                <strong>Property Distance 1</strong>
                <br />
                {singleDetail?.data?.propertyDistance1 || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Property Name 1</strong>
                <br />
                {singleDetail?.data?.propertyName1 || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Property Distance 2</strong>
                <br />
                {singleDetail?.data?.propertyDistance2 || "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p>
                <strong>Property Name 2</strong>
                <br />
                {singleDetail?.data?.propertyName2 || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Property Distance 3</strong>
                <br />
                {singleDetail?.data?.propertyDistance3 || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Property Name 3</strong>
                <br />
                {singleDetail?.data?.propertyName3 || "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p>
                <strong>Property Distance 4</strong>
                <br />
                {singleDetail?.data?.propertyDistance4 || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Property Name 4</strong>
                <br />
                {singleDetail?.data?.propertyName4 || "-"}
              </p>
            </div>
            <div>
              <p>
                <strong>Property Distance 5</strong>
                <br />
                {singleDetail?.data?.propertyDistance5 || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specifications;
