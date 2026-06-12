import React from "react";
import { useSelector } from "react-redux";

const Remarks = () => {
  const {  singleDetail } = useSelector((state) => state.chola) || {};

  return (
    <div className="container mx-auto my-4 px-4">
      {/* Electricity Details */}
      <div className="border rounded-lg mb-4 shadow-sm">
        <div className="p-3 bg-gray-100 border-b">
          <h5 className="text-lg font-semibold">ELECTRICITY DETAILS</h5>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 space-y-4">
              <p>
                <strong>Connection in the name of</strong>
                <br />
                { singleDetail?.data?.connectionName || "-"}
              </p>
              <p>
                <strong>
                  Land Rate given for the property in the same locality in Last
                  3 Months
                </strong>
                <br />
                { singleDetail?.data?.landRate || "-"}
              </p>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <p>
                <strong>TECHNICALLY ACCEPTABLE?</strong>
                <br />
                <span
                  className={`mr-4 ${
                     singleDetail?.data?.technicallyAcceptable === "YES"
                      ? "font-bold"
                      : ""
                  }`}
                >
                  YES
                </span>
                <span
                  className={
                     singleDetail?.data?.technicallyAcceptable === "NO"
                      ? "font-bold"
                      : ""
                  }
                >
                  NO
                </span>
              </p>
              <p>
                <strong>RISK of Demolition</strong>
                <br />
                { singleDetail?.data?.demolitionRisk || "-"}
              </p>
              <p>
                <strong>MARKETABILITY OF PROPERTY</strong>
                <br />
                { singleDetail?.data?.marketability || "-"}
              </p>
              <p>
                <strong>Constructed as per Law</strong>
                <br />
                { singleDetail?.data?.constructedAsPerLaw || "-"}
              </p>
              { singleDetail?.data?.deviationObserved === "YES" && (
                <p>
                  <strong>Nature of Deviation</strong>
                  <br />
                  { singleDetail?.data?.natureOfDeviation || "-"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Remarks on Property */}
      <div className="border rounded-lg mb-4 shadow-sm">
        <div className="p-3 bg-gray-100 border-b">
          <h5 className="text-lg font-semibold">REMARKS ON PROPERTY</h5>
        </div>
        <div className="p-4">
          <div className="whitespace-pre-line">
            { singleDetail?.data?.remarks || "No remarks available"}
          </div>
        </div>
      </div>

      {/* Declaration */}
      <div className="border rounded-lg mb-4 shadow-sm">
        <div className="p-3 bg-gray-100 border-b">
          <h5 className="text-lg font-semibold">DECLARATION</h5>
        </div>
        <div className="p-4">
          <p className="mb-3">I/We hereby Confirm and declare as that :</p>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>
              The property was inspected by ANCE, JND on{" "}
              { singleDetail?.data?.declaration?.inspectionDate || "08.04.2005"}
            </li>
            <li>
              I/We have { singleDetail?.data?.declaration?.noInterest} direct or
              indirect interest in the property valued.
            </li>
            <li>
              The information furnished above are{" "}
              { singleDetail?.data?.declaration?.informationCorrect} true and correct
              to my/our best of knowledge.
            </li>
          </ol>
          <div>
            <h6 className="font-semibold mb-2">DISCLAIMERS:</h6>
            <p className="text-sm leading-relaxed text-gray-700">
              { singleDetail?.data?.remarks}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Remarks;
