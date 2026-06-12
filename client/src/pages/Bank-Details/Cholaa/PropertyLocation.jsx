import React from "react";
import { useSelector } from "react-redux";

const PropertyDetails = () => {
  const { singleDetail } = useSelector((state) => state.chola) || {};
  console.log(singleDetail?.data, "property location page");
  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* PROPERTY DETAILS AS PER SITE */}
      <div className="bg-white shadow-md rounded mb-6">
        <div className="bg-gray-100 p-3 border-b">
          <h5 className="text-lg font-semibold">
            PROPERTY DETAILS AS PER SITE
          </h5>
        </div>
        <div className="p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Property Owner / Sales Name</strong>
                <br />
                {singleDetail?.data?.propertyOwner || "N/A"}
              </p>
              <p>
                <strong>Survey No</strong>
                <br />
                {singleDetail?.data?.surveyNo || "N/A"}
                {singleDetail?.data?.suffixName &&
                  `/${singleDetail?.data.suffixName}`}
              </p>
            </div>
            <div>
              <p>
                <strong>Builder Name</strong>
                <br />
                {singleDetail?.data?.suffixName || "N/A"}
              </p>
              <p>
                <strong>Builder Contact No</strong>
                <br />
                {singleDetail?.data?.suffixContactNo || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADDRESS AS PER SITE */}
      <div className="bg-white shadow-md rounded mb-6">
        <div className="bg-gray-100 p-3 border-b">
          <h5 className="text-lg font-semibold">ADDRESS AS PER SITE</h5>
        </div>
        <div className="p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Date No / Home No / File No</strong>
                <br />
                {singleDetail?.data?.doorNo || "N/A"}
              </p>
              <p>
                <strong>Project Name</strong>
                <br />
                {singleDetail?.data?.projectName || "N/A"}
              </p>
              <p>
                <strong>Colony / Street / Locality</strong>
                <br />
                {singleDetail?.data?.colonyStreetLocality || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <strong>Landmark</strong>
                <br />
                {singleDetail?.data?.landmark || "N/A"}
              </p>
              <p>
                <strong>Village</strong>
                <br />
                {singleDetail?.data?.village || "N/A"}
              </p>
              <p>
                <strong>Taluk</strong>
                <br />
                {singleDetail?.data?.taluk || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <strong>State</strong>
                <br />
                {/* State field not in schema, keeping static */}
                INIZUR
              </p>
              <p>
                <strong>City</strong>
                <br />
                {singleDetail?.data?.city || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <strong>District</strong>
                <br />
                {singleDetail?.data?.district || "N/A"}
              </p>
              <p>
                <strong>Pincode</strong>
                <br />
                {singleDetail?.data?.pincode || "N/A"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p>
                <strong>Whether Boundaries Matching</strong>
                <br />
                {singleDetail?.data?.boundariesMatching || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADDRESS AS PER DOCUMENT */}
      <div className="bg-white shadow-md rounded mb-6">
        <div className="bg-gray-100 p-3 border-b">
          <h5 className="text-lg font-semibold">ADDRESS AS PER DOCUMENT</h5>
        </div>
        <div className="p-4">
          <p>
            <strong>Address Line 1</strong>
            <br />
            {singleDetail?.data?.addressLine1 || "N/A"}
          </p>
          <p>
            <strong>Address Line 2</strong>
            <br />
            {singleDetail?.data?.addressLine2 || "N/A"}
          </p>
        </div>
      </div>

      {/* LOCATION */}
      <div className="bg-white shadow-md rounded mb-6">
        <div className="bg-gray-100 p-3 border-b">
          <h5 className="text-lg font-semibold">LOCATION</h5>
        </div>
        <div className="p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Latitude</strong>
                <br />
                {singleDetail?.data?.latitude || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <strong>Longitude</strong>
                <br />
                {singleDetail?.data?.longitude || "N/A"}
              </p>
            </div>
          </div>
          <p className="mt-4">
            <strong>Nearest branch</strong>
            <br />
            {singleDetail?.data?.nearestBranch || "N/A"}
          </p>
          <p className="mt-4">
            <strong>Distance From City</strong>
            <br />
            {singleDetail?.data?.distanceFromCity || "N/A"}
          </p>
        </div>
      </div>

      {/* BOUNDARIES */}
      <div className="bg-white shadow-md rounded mb-6">
        <div className="bg-gray-100 p-3 border-b">
          <h5 className="text-lg font-semibold">BOUNDARIES</h5>
        </div>
        <div className="p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-2">As per DECED</p>
              <table className="w-full border text-sm">
                <tbody>
                  <tr>
                    <td className="border px-2 py-1">East</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.eastBoundaryOC || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">South</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.southBoundaryOC || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">West</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.westBoundaryOC || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">North</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.northBoundaryOC || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <p className="font-semibold mb-2">As per Actual Site</p>
              <table className="w-full border text-sm">
                <tbody>
                  <tr>
                    <td className="border px-2 py-1">East</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.eastBoundaryActual || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">South</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.southBoundaryActual || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">West</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.westBoundaryActual || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">North</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.northBoundaryActual || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* DIMENSIONS */}
      <div className="bg-white shadow-md rounded mb-6">
        <div className="bg-gray-100 p-3 border-b">
          <h5 className="text-lg font-semibold">DIMENSIONS</h5>
        </div>
        <div className="p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-2">As per DECED</p>
              <table className="w-full border text-sm">
                <tbody>
                  <tr>
                    <td className="border px-2 py-1">East</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.eastDimensionOC || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">South</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.southDimensionOC || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">West</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.westDimensionOC || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">North</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.northDimensionOC || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <p className="font-semibold mb-2">As per Actual</p>
              <table className="w-full border text-sm">
                <tbody>
                  <tr>
                    <td className="border px-2 py-1">East</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.eastDimensionActual || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">South</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.southDimensionActual || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">West</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.westDimensionActual || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">North</td>
                    <td className="border px-2 py-1">
                      {singleDetail?.data?.northDimensionActual || "N/A"}
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

export default PropertyDetails;
