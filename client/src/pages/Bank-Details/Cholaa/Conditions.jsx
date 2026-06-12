import React from "react";
import { useSelector } from "react-redux";

const Conditions = () => {
  const { singleDetail } = useSelector((state) => state.chola) || {};

  return (
    <div className="max-w-6xl mx-auto my-6 px-4">
      {/* AUTHENTICITY & APPROVALS */}
      <div className="border rounded-lg mb-6 shadow">
        <div className="bg-gray-100 p-4 border-b">
          <h5 className="text-lg font-semibold">AUTHENTICITY & APPROVALS</h5>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 md:pr-4 space-y-3">
              <p>
                <strong>Authenticity Limit</strong>
                <br />
                {singleDetail?.data?.district || "MUNICIPAL CORPORATION"}
              </p>
              <p>
                <strong>Approving Authority</strong>
                <br />
                {singleDetail?.data?.city || "NASAR NIGAMI"}
              </p>
              <p>
                <strong>Bearerment Applicable</strong>
                <br />
                <span className="mr-3">YES</span>
                <span>NO</span>
              </p>
            </div>
            <div className="md:w-1/2 md:pl-4 space-y-3 mt-4 md:mt-0">
              <p>
                <strong>Occupied By</strong>
                <br />
                <span className="mr-2">TENANT</span>
                <span className="mr-2">SELF-OCCUPIED</span>
                <span className="mr-2">VACANT</span>
                <br />
                <span className="mr-2">NA</span>
                <span className="mr-2">SELLER OCCUPIED</span>
                <span>SELF + TENANT</span>
              </p>
              <p>
                <strong>Seller Name/Owner Name</strong>
                <br />
                {singleDetail?.data?.propertyOwner ||
                  "SNT HANTA TYAGI WO NR DE DEEPAK"}
              </p>
              <p>
                <strong>Person met at Site</strong>
                <br />
                {singleDetail?.data?.propertyOwner ||
                  "SNT HANTA TYAGI WO NR DE DEEPAK"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PROPERTY CHARACTERISTICS */}
      <div className="border rounded-lg mb-6 shadow">
        <div className="bg-gray-100 p-4 border-b">
          <h5 className="text-lg font-semibold">PROPERTY CHARACTERISTICS</h5>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 md:pr-4 space-y-3">
              <p>
                <strong>Condition of Approach Roads</strong>
                <br />
                {singleDetail?.data?.colonyStreetLocality || "20 FT WBN ROAD"}
              </p>
              <p>
                <strong>Is Property Approved</strong>
                <br />
                <span className="mr-3">YES</span>
                <span>NO</span>
              </p>
              <p>
                <strong>Residual Age of the Property</strong>
                <br />
                {singleDetail?.data?.percentageCompleted
                  ? `${singleDetail?.data.percentageCompleted}%`
                  : "57 3 ~ 0 ~"}
              </p>
              <p>
                <strong>Usage of Property</strong>
                <br />
                <span className="mr-2">RESIDENTIAL</span>
                <span className="mr-2">COMMERCIAL</span>
                <span>MIXED USAGE</span>
              </p>
            </div>
            <div className="md:w-1/2 md:pl-4 space-y-3 mt-4 md:mt-0">
              <p>
                <strong>Age of Refinance Property</strong>
                <br />
                {singleDetail?.data?.builtUpArea || "38"}
              </p>
              <p>
                <strong>Latest Sale Deed Registration Date</strong>
                <br />
                {singleDetail?.data?.refDate || "-"}
              </p>
              <p>
                <strong>Land Type / Property / Dwelling unit type</strong>
                <br />
                <span className="mr-2">RESIDENTIAL</span>
                <span>{singleDetail?.data?.type || "6+1 RESI HOUSE"}</span>
              </p>
              <p>
                <strong>Storey Type</strong>
                <br />
                <span className="mr-2">STAYUDA</span>
                <span className="mr-2">LOUE</span>
                <span>MULTISTOREY</span>
              </p>
              <p>
                <strong>Is Property REBA Approved</strong>
                <br />
                <span className="mr-3">YES</span>
                <span>NO</span>
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p>
              <strong>Brief On Conditions</strong>
              <br />
              {singleDetail?.data?.remarks || "6+1 RESI HOUSE"}
            </p>
          </div>
        </div>
      </div>

      {/* SURROUNDING EXTERNAL AMENITIES */}
      <div className="border rounded-lg mb-6 shadow">
        <div className="bg-gray-100 p-4 border-b">
          <h5 className="text-lg font-semibold">
            SURROUNDING EXTERNAL AMENITIES
          </h5>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-3 py-2 text-left">S.NO</th>
                <th className="border px-3 py-2 text-left">PREMISES LIST</th>
                <th className="border px-3 py-2 text-left">
                  APPROX DIST. FROM PROPERTY
                </th>
                <th className="border px-3 py-2 text-left">
                  NAME OF THE PREMISES
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">1</td>
                <td className="border px-3 py-2">NEAREST HIGHWAY/MAJOR ROAD</td>
                <td className="border px-3 py-2">
                  {singleDetail?.data?.propertyDistance1 || "-"}
                </td>
                <td className="border px-3 py-2">
                  {singleDetail?.data?.propertyName1 || "-"}
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2">2</td>
                <td className="border px-3 py-2">NEAREST BUS STOP</td>
                <td className="border px-3 py-2">
                  {singleDetail?.data?.propertyDistance2 || "1-3 KM"}
                </td>
                <td className="border px-3 py-2">
                  {singleDetail?.data?.propertyName2 || "BUS STOP"}
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2">3</td>
                <td className="border px-3 py-2">NEAREST HOSPITAL</td>
                <td className="border px-3 py-2">
                  {singleDetail?.data?.propertyDistance3 || "-"}
                </td>
                <td className="border px-3 py-2">
                  {singleDetail?.data?.propertyName3 || "-"}
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2">4</td>
                <td className="border px-3 py-2">NEAREST SCHOOL/COLLEGE</td>
                <td className="border px-3 py-2">
                  {singleDetail?.data?.propertyDistance4 || "3-5 KM"}
                </td>
                <td className="border px-3 py-2">
                  {singleDetail?.data?.propertyName4 ||
                    "CHITRANSH PUBLIC HR. SEC SCHOOL"}
                </td>
              </tr>
              <tr>
                <td className="border px-3 py-2">5</td>
                <td className="border px-3 py-2">NEAREST RAILWAY STATION</td>
                <td className="border px-3 py-2">
                  {singleDetail?.data?.propertyDistance5 || "5 KM"}
                </td>
                <td className="border px-3 py-2">
                  {singleDetail?.data?.propertyName5 || "BHOPAL_UN"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Conditions;
