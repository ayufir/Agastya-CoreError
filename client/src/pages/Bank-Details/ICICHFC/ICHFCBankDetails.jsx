import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIciciHFCBankById } from "../../../redux/features/Banks/IciciHfCBank/IciciHFCBankThunk";
import { useParams } from "react-router-dom";

const IccHfc = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const data = useSelector((state) => state.iciciHFC.singleData);

  useEffect(() => {
    if (id) {
      dispatch(getIciciHFCBankById(id));
    }
  }, [id, dispatch]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-[#fff8e5] border border-[#eee]">
      <div className="text-center font-bold mb-3 bg-[#fedc8c] p-2 text-darkred">
        INDIVIDUAL TECHNICAL REPORT
      </div>

      {/* Report Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p><strong>Request ID:</strong> {data.requestId}</p>
          <p><strong>Customer Name:</strong> {data.customer}</p>
          <p><strong>Channel Name:</strong> {data.channel}</p>
          <p><strong>Report Type:</strong> {data.report}</p>
        </div>
        <div>
          <p><strong>Application No:</strong> {data.application}</p>
          <p><strong>Branch:</strong> {data.branch}</p>
          <p><strong>Business Group:</strong> {data.businessGroup}</p>
          <p><strong>Product Name:</strong> {data.product}</p>
          <p><strong>Loan Property Type:</strong> {data.loan}</p>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-[#fedc8c] text-center font-bold p-2 text-darkred mb-2">
        Property Details
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p><strong>Property Type:</strong> {data.propertyType}</p>
          <p><strong>Unit No:</strong> 01</p>
          <p><strong>Property Address:</strong></p>
          <div className="ml-3">
            {(data.propertyAddress || data.siteAddress)?.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <p><strong>Collateral Id:</strong> I25DEH198-026527</p>
          <p><strong>Legal Address:</strong></p>
          <textarea
            readOnly
            rows={3}
            className="border rounded w-full p-1"
            defaultValue={data.legalAddress || data.documentAddress}
          />
        </div>
        <div>
          <p><strong>Unit Type:</strong> {data.unitType}</p>
          <p><strong>Road Width (Feet):</strong> {data.roadWidth}</p>
          <p><strong>Country:</strong> {data.country}</p>
          <p><strong>State:</strong> {data.state}</p>
          <p><strong>City:</strong> {data.city}</p>
          <p><strong>Nearby Landmark:</strong> {data.landmark}</p>
          <p><strong>Pincode:</strong> {data.pin}</p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-[#fedc8c] text-center font-bold p-2 text-darkred mb-2">
        Contact Details
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p><strong>Name:</strong> {data.applicantNames}</p>
          <p><strong>Customer Mobile No:</strong> {data.customerMobile}</p>
          <p><strong>Req Initiator Id:</strong> {data.requestInitiatorId}</p>
        </div>
        <div>
          <p><strong>Sales Manager Mobile No:</strong> {data.salesManagerMobile}</p>
          <p><strong>Req Initiator Name / CPC Code:</strong> {data.requestInitiatorName}</p>
        </div>
      </div>

      {/* Document Table */}
      <div className="font-bold text-center text-darkred mb-2">Attached Document Details</div>
      <table className="w-full border text-sm mb-4">
        <thead className="bg-yellow-300 text-red-600">
          <tr>
            <th className="border p-1">Document Name</th>
            <th className="border p-1">Field Name</th>
            <th className="border p-1">Field Value</th>
            <th className="border p-1">Field Name</th>
            <th className="border p-1">Field Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="5" className="text-center border p-2">No data</td>
          </tr>
        </tbody>
      </table>

      {/* Boundaries Table */}
      <div className="font-bold text-center text-darkred mb-2">Boundaries on Site</div>
      <table className="w-full border text-sm mb-4">
        <thead className="bg-yellow-300 text-red-600">
          <tr>
            <th className="border p-1">Directions</th>
            <th className="border p-1">As Per Sale Deed</th>
            <th className="border p-1">Actual At Site</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border p-1">East</td><td className="border p-1">{data.east}</td><td className="border p-1">NA</td></tr>
          <tr><td className="border p-1">West</td><td className="border p-1">{data.west}</td><td className="border p-1">NA</td></tr>
          <tr><td className="border p-1">North</td><td className="border p-1">{data.north}</td><td className="border p-1">NA</td></tr>
          <tr><td className="border p-1">South</td><td className="border p-1">{data.south}</td><td className="border p-1">NA</td></tr>
          <tr><td className="border p-1">Boundary Matching</td><td className="border p-1">{data.boundariesMatching}</td><td className="border p-1"></td></tr>
        </tbody>
      </table>

      {/* Property Metrics */}
      <div className="bg-yellow-300 text-center font-bold p-1 text-darkred mb-3">Property Details</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div><strong>Plot Area:</strong> {data.area1 || "1148"}</div>
        <div><strong>Plot Demarcated At Site:</strong> {data.propertyDemarcation ? "YES" : "NO"}</div>
      </div>

      {/* Unit Details Table */}
      <div className="bg-yellow-300 text-center font-bold p-1 text-darkred mb-2">Unit Details</div>
      <table className="w-full border text-sm mb-4">
        <thead className="bg-gray-100 text-red-600">
          <tr>
            <th className="border p-1">Detail</th>
            <th className="border p-1">No. of Rooms</th>
            <th className="border p-1">No. of Kitchen</th>
            <th className="border p-1">No. of Bathrooms</th>
            <th className="border p-1">Usages and Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border p-1">GROUND FLOOR</td><td className="border p-1">{data.roomsCount || ""}</td><td className="border p-1"></td><td className="border p-1"></td><td className="border p-1"></td></tr>
          <tr><td className="border p-1">FIRST FLOOR</td><td className="border p-1"></td><td className="border p-1"></td><td className="border p-1"></td><td className="border p-1"></td></tr>
          <tr><td className="border p-1">SECOND FLOOR</td><td className="border p-1"></td><td className="border p-1"></td><td className="border p-1"></td><td className="border p-1"></td></tr>
          <tr><td className="border p-1">OTHER 1</td><td className="border p-1"></td><td className="border p-1"></td><td className="border p-1"></td><td className="border p-1"></td></tr>
          <tr><td className="border p-1">OTHER 2</td><td className="border p-1"></td><td className="border p-1"></td><td className="border p-1"></td><td className="border p-1"></td></tr>
        </tbody>
      </table>
        </div>
  );
};

export default IccHfc;
