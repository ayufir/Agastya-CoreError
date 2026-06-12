import React, { useEffect } from "react";
import { Descriptions, Table, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { fetchPiramalFinanceRecordById } from "../../redux/features/Banks/piramalFinance/piramalFinanceThunks";
import dayjs from "dayjs";
import FileDownload from "../../components/FileDownload";

const PiramalNPADetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const data = useSelector((state) => state.piramalNPA?.selectedRecord) || {};
  console.log(data);

  useEffect(() => {
    dispatch(fetchPiramalFinanceRecordById(id));
  }, [dispatch, id]);
  const { state } = useLocation();

  return (
    <div className='container mx-auto p-4 ' id='reportTable'>
      <FileDownload data={data} tableId='reportTable' />

      <div className='' id='print-section'>
        <h1 className='text-2xl font-bold mb-6'>TECHNICAL SECURITY REPORT</h1>

        {/* Loan Application Details */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>
            LOAN APPLICATION DETAILS
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <p>
                <span className='font-medium'>Branch Name:</span>{" "}
                {data?.loanApplicationDetails?.branchName || ""}
              </p>
              <p>
                <span className='font-medium'>Application No:</span>{" "}
                {data?.loanApplicationDetails?.applicationNo || ""}
              </p>
              <p>
                <span className='font-medium'>Customer No:</span>{" "}
                {data?.loanApplicationDetails?.customerNo || ""}
              </p>
            </div>
            <div>
              <p>
                <span className='font-medium'>Application Status:</span>{" "}
                {data?.loanApplicationDetails?.applicationStatus || ""}
              </p>
              <p>
                <span className='font-medium'>Applicant Name:</span>{" "}
                {data?.loanApplicationDetails?.applicantName || ""}
              </p>
              <p>
                <span className='font-medium'>Product:</span>{" "}
                {data?.loanApplicationDetails?.product || ""}
              </p>
              <p>
                <span className='font-medium'>Transaction Type:</span>{" "}
                {data?.loanApplicationDetails?.transactionType || ""}
              </p>
            </div>
            <div>
              <p>
                <span className='font-medium'>Visit Done By:</span>{" "}
                {data?.loanApplicationDetails?.visitDoneBy || ""}
              </p>
              <p>
                <span className='font-medium'>Date of Visit:</span>{" "}
                {dayjs(
                  data?.loanApplicationDetails?.dateOfVisit || "2023-09-14"
                ).format("DD-MMM-YYYY")}
              </p>
            </div>
          </div>
        </div>

        {/* Valuation Guidelines */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>VALUATION GUIDELINE</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <p>
              <span className='font-medium'>Location Type:</span>{" "}
              {data?.loanApplicationDetails?.locationType || ""}
            </p>
            <p>
              <span className='font-medium'>Valuation Approaches:</span>{" "}
              {data?.loanApplicationDetails?.valuationApproaches || ""}
            </p>
            <p>
              <span className='font-medium'>Valuation Methodology:</span>{" "}
              {data?.loanApplicationDetails?.valuationMethodology || ""}
            </p>
          </div>

          {/* Address? Details */}
          <h3 className='text-lg font-medium mb-2'>
            ADDRESS DETAILS (AS PER SITE INSPECTION)
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <p>
              <span className='font-medium'>House/Flat No:</span>{" "}
              {data?.address?.houseFlatNo || ""}
            </p>
            <p>
              <span className='font-medium'>Floor No:</span>{" "}
              {data?.address?.floorNo || ""}
            </p>
            <p>
              <span className='font-medium'>Wing Name & No:</span>{" "}
              {data?.address?.wingNameNo || ""}
            </p>
            <p>
              <span className='font-medium'>Building Name and Number:</span>{" "}
              {data?.address?.buildingNameNo || ""}
            </p>
            <p>
              <span className='font-medium'>Plot No:</span>{" "}
              {data?.address?.plotNo || "10 & 11"}
            </p>
            <p>
              <span className='font-medium'>Survey No:</span>{" "}
              {data?.address?.surveyNo || ""}
            </p>
            <p>
              <span className='font-medium'>Street Name & No:</span>{" "}
              {data?.address?.streetNameNo || ""}
            </p>
            <p>
              <span className='font-medium'>Stage/Sector/Ward No:</span>{" "}
              {data?.address?.stageSectorWardNo || ""}
            </p>
            <p>
              <span className='font-medium'>Landmarks:</span>{" "}
              {data?.address?.landmarks || ""}
            </p>
            <p>
              <span className='font-medium'>Village/Location:</span>{" "}
              {data?.address?.villageLocation || ""}
            </p>
            <p>
              <span className='font-medium'>City/Taluka/Town:</span>{" "}
              {data?.address?.cityTalukaTown || ""}
            </p>
            <p>
              <span className='font-medium'>District:</span>{" "}
              {data?.address?.district || ""}
            </p>
            <p>
              <span className='font-medium'>State:</span>{" "}
              {data?.address?.state || ""}
            </p>
            <p>
              <span className='font-medium'>Country:</span>{" "}
              {data?.address?.country || "INDIA"}
            </p>
            <p>
              <span className='font-medium'>PIN Code:</span>{" "}
              {data?.address?.pinCode || ""}
            </p>
            <p>
              <span className='font-medium'>Property Located On:</span>{" "}
              {data?.address?.propertyLocatedOn || ""}
            </p>
            <p>
              <span className='font-medium'>Approach Road to Property:</span>{" "}
              {data?.address?.approachRoad || ""}
            </p>
          </div>

          {/* Boundaries */}
          <h3 className='text-lg font-medium mb-2'>BOUNDARIES</h3>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
            <div>
              <p className='font-medium'>EAST</p>
              <p>Approved: {data?.address?.boundaries?.east?.approved || ""}</p>
              <p>Site: {data?.address?.boundaries?.east?.site || ""}</p>
            </div>
            <div>
              <p className='font-medium'>WEST</p>
              <p>Approved: {data?.address?.boundaries?.west?.approved || ""}</p>
              <p>Site: {data?.address?.boundaries?.west?.site || ""}</p>
            </div>
            <div>
              <p className='font-medium'>NORTH</p>
              <p>
                Approved: {data?.address?.boundaries?.north?.approved || ""}
              </p>
              <p>Site: {data?.address?.boundaries?.north?.site || ""}</p>
            </div>
            <div>
              <p className='font-medium'>SOUTH</p>
              <p>
                Approved: {data?.address?.boundaries?.south?.approved || ""}
              </p>
              <p>Site: {data?.address?.boundaries?.south?.site || ""}</p>
            </div>
          </div>
        </div>

        {/* General Details */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>GENERAL DETAILS</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <p>
              <span className='font-medium'>Municipal Limit:</span>{" "}
              {data?.address?.municipalLimit || ""}
            </p>
            <p>
              <span className='font-medium'>Municipal Authority:</span>{" "}
              {data?.address?.municipalAuthority || ""}
            </p>
            <p>
              <span className='font-medium'>Year of Construction:</span>{" "}
              {data?.address?.yearOfConstruction || ""}
            </p>
            <p>
              <span className='font-medium'>Seller Name:</span>{" "}
              {data?.address?.sellerName || ""}
            </p>
            <p>
              <span className='font-medium'>Occupancy Status:</span> OCCUPIED
            </p>
            <p>
              <span className='font-medium'>Age of Property:</span> 13
            </p>
            <p>
              <span className='font-medium'>Occupant Name:</span> NA
            </p>
            <p>
              <span className='font-medium'>Property/Dwelling Unit Type:</span>{" "}
              NA
            </p>
            <p>
              <span className='font-medium'>
                Residual Life of the Property:
              </span>{" "}
              47
            </p>
            <p>
              <span className='font-medium'>
                Property Furnished/Unfurnished:
              </span>{" "}
              FURNISHED
            </p>
            <p>
              <span className='font-medium'>
                Property Falling in Caution Area:
              </span>{" "}
              NA
            </p>
            <p>
              <span className='font-medium'>Reason for Caution:</span> NA
            </p>
          </div>
        </div>

        {/* Surrounding External Amenities */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>
            SURROUNDING EXTERNAL AMENITIES
          </h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full border'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border p-2'>Sr. No.</th>
                  <th className='border p-2'>Premises List</th>
                  <th className='border p-2'>
                    Approx. Distance from Property (in Kms)
                  </th>
                  <th className='border p-2'>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border p-2'>1</td>
                  <td className='border p-2'>Nearest Bus Stop</td>
                  <td className='border p-2'>2–5 KM</td>
                  <td className='border p-2'>MISHROAD BUS STOP</td>
                </tr>
                <tr>
                  <td className='border p-2'>2</td>
                  <td className='border p-2'>Nearest Railway Station</td>
                  <td className='border p-2'>7.3 KM</td>
                  <td className='border p-2'>RANKAMLAPATI RAILWAY SATAION</td>
                </tr>
                <tr>
                  <td className='border p-2'>3</td>
                  <td className='border p-2'>Nearest Airport</td>
                  <td className='border p-2'>25 KM</td>
                  <td className='border p-2'>RAJABHOU AIRPORT</td>
                </tr>
                <tr>
                  <td className='border p-2'>4</td>
                  <td className='border p-2'>Nearest School/College</td>
                  <td className='border p-2'>2–05 KM</td>
                  <td className='border p-2'>RKDF INSTITUTE BHOPAL</td>
                </tr>
                <tr>
                  <td className='border p-2'>5</td>
                  <td className='border p-2'>Nearest Bank</td>
                  <td className='border p-2'>2–3 KM</td>
                  <td className='border p-2'>HDFC BANK</td>
                </tr>
                <tr>
                  <td className='border p-2'>6</td>
                  <td className='border p-2'>Nearest Highway/Major Road</td>
                  <td className='border p-2'>1–2 KM</td>
                  <td className='border p-2'>HOSHANGABAO ROAD</td>
                </tr>
                <tr>
                  <td className='border p-2'>7</td>
                  <td className='border p-2'>Nearest Hospital</td>
                  <td className='border p-2'>0–1 KM</td>
                  <td className='border p-2'>UBUNTU HART HOSPITAL</td>
                </tr>
                <tr>
                  <td className='border p-2'>8</td>
                  <td className='border p-2'>Nearest Multiplex/Mall/Market</td>
                  <td className='border p-2'>2–5 KM</td>
                  <td className='border p-2'>ASHIMA MALL</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Area Details */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>AREA DETAILS</h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full border'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border p-2'>Area Type</th>
                  <th className='border p-2'>Actual Area</th>
                  <th className='border p-2'>Approved Area</th>
                  <th className='border p-2'>
                    Actual Area / Approved Area for Valuation Purpose
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border p-2'>Plot Area</td>
                  <td className='border p-2'>
                    0 Square Feet (0.00 Square Meter)
                  </td>
                  <td className='border p-2'>0 Square Feet</td>
                  <td className='border p-2'></td>
                </tr>
                <tr>
                  <td className='border p-2'>Construction Area</td>
                  <td className='border p-2'>0.00</td>
                  <td className='border p-2'>0</td>
                  <td className='border p-2'></td>
                </tr>
                <tr>
                  <td className='border p-2'>Carpet Area</td>
                  <td className='border p-2'>0.00</td>
                  <td className='border p-2'>0</td>
                  <td className='border p-2'></td>
                </tr>
                <tr>
                  <td className='border p-2'>Built-up Area</td>
                  <td className='border p-2'>0.00</td>
                  <td className='border p-2'>0</td>
                  <td className='border p-2'></td>
                </tr>
                <tr>
                  <td className='border p-2'>Sale Area</td>
                  <td className='border p-2'>0</td>
                  <td className='border p-2'>0</td>
                  <td className='border p-2'></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Valuation Details */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>VALUATION DETAILS</h2>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
            <p>
              <span className='font-medium'>Area Type:</span> RESIDENTIAL
            </p>
            <p>
              <span className='font-medium'>Area (Sqft):</span>{" "}
            </p>
            <p>
              <span className='font-medium'>Rate/Sqft:</span>{" "}
            </p>
            <p>
              <span className='font-medium'>Valuation:</span> 0
            </p>
          </div>

          <div className='mb-4'>
            <p>
              <span className='font-medium'>A). Area Valuation:</span> Plot Area
              - 0
            </p>
            <p>
              <span className='font-medium'>B). Construction Cost:</span>{" "}
              Construction Area - 0
            </p>
            <p>
              <span className='font-medium'>
                C). Extension/Improvement Estimate:
              </span>{" "}
              Extension/Improvement Area - RS.{" "}
            </p>
          </div>

          <div className='mb-4'>
            <h3 className='text-lg font-medium mb-2'>D). AMENITIES</h3>
            <div className='overflow-x-auto'>
              <table className='min-w-full border'>
                <thead>
                  <tr className='bg-gray-100'>
                    <th className='border p-2'>Sr. No.</th>
                    <th className='border p-2'>Description</th>
                    <th className='border p-2'>Area/Quantity</th>
                    <th className='border p-2'>Unit</th>
                    <th className='border p-2'>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.valuationDetails?.amenities?.map((amenity, index) => (
                    <tr key={index}>
                      <td className='border p-2'>{index + 1}</td>
                      <td className='border p-2'>{amenity?.description}</td>
                      <td className='border p-2'>{amenity?.areaQuantity}</td>
                      <td className='border p-2'>{amenity?.unit}</td>
                      <td className='border p-2'>{amenity?.amount}</td>
                    </tr>
                  )) || (
                    <>
                      <tr>
                        <td className='border p-2'>1</td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                      </tr>
                      <tr>
                        <td className='border p-2'>2</td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                      </tr>
                      <tr>
                        <td className='border p-2'>3</td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                      </tr>
                      <tr>
                        <td className='border p-2'>4</td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                      </tr>
                      <tr>
                        <td className='border p-2'>5</td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                      </tr>
                      <tr>
                        <td className='border p-2'>6</td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                        <td className='border p-2'></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <p className='mt-2'>
              <span className='font-medium'>TOTAL AMENITIES COST (D):</span> RS.{" "}
              {data?.valuationDetails?.totalAmenitiesCost || ""}
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <p>
              <span className='font-medium'>
                TOTAL FAIR MARKET VALUE (A+B+C+D):
              </span>{" "}
              0
            </p>
            <p>
              <span className='font-medium'>
                GOVT / CIRCLE VALUE OF THE PROPERTY (RS.):
              </span>{" "}
              0
            </p>
            <p>
              <span className='font-medium'>
                % Variance (Total Fair Market Value to Govt Value):
              </span>{" "}
            </p>
            <p>
              <span className='font-medium'>
                DISTRESS VALUE OF THE PROPERTY (RS.):
              </span>{" "}
              0
            </p>
            <p>
              <span className='font-medium'>
                RENTAL VALUE OF THE PROPERTY (PER MONTH):
              </span>{" "}
            </p>
          </div>
        </div>

        {/* Floor Details */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>FLOOR DETAILS</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <p>
              <span className='font-medium'>(A) No of Basement(s):</span> 0
            </p>
            <p>
              <span className='font-medium'>
                (B) No of Ground/Parking/Stilt:
              </span>{" "}
              1
            </p>
            <p>
              <span className='font-medium'>(C) Podium(s):</span> 0
            </p>
            <p>
              <span className='font-medium'>(D) No of Upper Floor(s):</span> 1
            </p>
            <p>
              <span className='font-medium'>
                (E) = (A + B + C + D) Total No. of Floor(s):
              </span>{" "}
              0 0
            </p>
          </div>
        </div>

        {/* Technical Documents Details */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>
            TECHNICAL DOCUMENTS DETAILS
          </h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full border'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border p-2'>Document Name</th>
                  <th className='border p-2'>Recd Type</th>
                  <th className='border p-2'>Ref No.</th>
                  <th className='border p-2'>Ref Date</th>
                  <th className='border p-2'>Details of Approval</th>
                </tr>
              </thead>
              <tbody>
                {data?.siteDocumentsVerified?.map((doc, index) => (
                  <tr key={index}>
                    <td className='border p-2'>
                      {doc.documentName || "Approved Layout Plan"}
                    </td>
                    <td className='border p-2'>{doc.recdType}</td>
                    <td className='border p-2'>{doc.refNo}</td>
                    <td className='border p-2'>
                      {new Date(doc.refDate).toLocaleDateString()}
                    </td>
                    <td className='border p-2'>{doc.approvalDetails}</td>
                  </tr>
                )) || (
                  <>
                    <tr>
                      <td className='border p-2'>Approved Layout Plan</td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>Approved Floor Plan</td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>
                        Construction Permission / Building
                      </td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>
                        Building Completion Certificate / Occupation Permission
                        / Use Permission / Possession Certificate
                      </td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>
                        Non Agricultural Permission / Land Conversion /
                        Diversion Order
                      </td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>
                        Location Sketch / Certificate
                      </td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>Property Tax Receipts</td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>Authority Tax Receipts</td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>
                        Construction Estimate from Registered Engineer /
                        Architect
                      </td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>
                        Improvement / Extension Estimate from Registered
                        Engineer / Architect
                      </td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                      <td className='border p-2'></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          <p className='mt-2'>
            <span className='font-medium'>Remarks on Documents Verified:</span>{" "}
          </p>
        </div>

        {/* NDMC Parameters */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>NDMC PARAMETERS</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <p>
              <span className='font-medium'>
                Nature of Building/Wing/Tower:
              </span>{" "}
              {data?.ndpAndSiteDetails?.natureOfBuilding ||
                "Stand alone Structure/slab building"}
            </p>
            <p>
              <span className='font-medium'>Type of structure:</span>{" "}
              {data?.ndpAndSiteDetails?.typeOfStructure ||
                "RCC Framed / Load Bearing / Steel / Composite/TEEN SHED"}
            </p>
            <p>
              <span className='font-medium'>Function of Use:</span>{" "}
              {data?.ndpAndSiteDetails?.functionOfUse ||
                "Residential / Non-Residential / Critical Lifeline (Infrastructural development)"}
            </p>
            <p>
              <span className='font-medium'>
                Height of Building above ground level:
              </span>{" "}
              {data?.ndpAndSiteDetails?.heightOfBuilding ||
                "Less than 15m tall / between 15m to 45m / above 45m"}
            </p>
            <p>
              <span className='font-medium'>Type of foundation:</span>{" "}
              {data?.ndpAndSiteDetails?.typeOfFoundation ||
                "Independent / Interconnected / Raft / Pile / Not able to assess since completed property"}
            </p>
            <p>
              <span className='font-medium'>Horizontal floor type:</span>{" "}
              {data?.ndpAndSiteDetails?.horizontalFloorType ||
                "Beams and slabs / waffles / ribbed floors / first slab with drops"}
            </p>
            <p>
              <span className='font-medium'>Concrete Grade:</span>{" "}
              {data?.ndpAndSiteDetails?.concreteGrade ||
                "M25/M30/M40/M45 / Not able to assess since completed property"}
            </p>
            <p>
              <span className='font-medium'>Steel Grade:</span>{" "}
              {data?.ndpAndSiteDetails?.steelGrade ||
                "FE 450 / FE 500 / Not able to assess since completed property"}
            </p>
            <p>
              <span className='font-medium'>Seismic Zone:</span>{" "}
              {data?.ndpAndSiteDetails?.seismicZone || "Zone II/ III / IV/V"}
            </p>
            <p>
              <span className='font-medium'>
                Soil Slope vulnerable to landslide:
              </span>{" "}
              {data?.ndpAndSiteDetails?.soilSlope ||
                "Very High Hazard zone/ High Hazard Zone/ Moderately High Hazard Zone/ Low Hazard Zone/ Very low Hazard zone"}
            </p>
            <p>
              <span className='font-medium'>Flood prone Area:</span>{" "}
              {data?.ndpAndSiteDetails?.floodProneArea ||
                "Y/N urban floods Upstream/ Downstream"}
            </p>
            <p>
              <span className='font-medium'>
                Environment Exposure Condition:
              </span>{" "}
              {data?.ndpAndSiteDetails?.environmentExposureCondition ||
                "Mild / Moderate/ Severe/ Very severe/ Extreme"}
            </p>
            <p>
              <span className='font-medium'>Tsunami:</span>{" "}
              {data?.ndpAndSiteDetails?.tsunami || "Y/N"}
            </p>
            <p>
              <span className='font-medium'>Wind/Cyclones:</span>{" "}
              {data?.ndpAndSiteDetails?.windCyclones ||
                "Very High Damage risk Zone A/ Very High Damage risk Zone B/ High Damage Risk Zone/ Moderate Damage Risk Zone A/ Moderate Damage Risk Zone B/ Low Damage Risk Zone"}
            </p>
            <p>
              <span className='font-medium'>Coastal Regulatory Zone:</span>{" "}
              {data?.ndpAndSiteDetails?.coastalRegulatoryZone ||
                "CRZ I/ CRZ II/ CRZ III/ CRZ IV/NA"}
            </p>
          </div>
        </div>

        {/* Site Investigation */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>SITE INVESTIGATION</h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full border'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border p-2'>Sr. No.</th>
                  <th className='border p-2'>Activity</th>
                  <th className='border p-2'>Alloted % for Activity</th>
                  <th className='border p-2'>Present Completion (%)</th>
                  <th className='border p-2'>Remarks on Progress</th>
                </tr>
              </thead>
              <tbody>
                {data?.ndpAndSiteDetails?.siteInvestigation?.map(
                  (item, index) => (
                    <tr key={index}>
                      <td className='border p-2'>{index + 1}</td>
                      <td className='border p-2'>
                        {item.activity ||
                          [
                            "Plinth",
                            "R.C.C. Above Ground",
                            "Brick Work",
                            "Internal Plaster",
                            "External Plaster",
                            "Flooring",
                            "Plumbing & Electrification Work",
                            "Door, Window & Paint",
                            "Finishing & Possession",
                          ][index]}
                      </td>
                      <td className='border p-2'>
                        {item.allotedPercentage ||
                          [
                            "20.00%",
                            "40.00%",
                            "10%",
                            "5.00%",
                            "5.00%",
                            "5.00%",
                            "5.00%",
                            "5.00%",
                            "5.00%",
                          ][index]}
                      </td>
                      <td className='border p-2'>
                        {item.presentCompletion ||
                          [
                            "20.00%",
                            "40.00%",
                            "10.00%",
                            "5.00%",
                            "5.00%",
                            "5.00%",
                            "5.00%",
                            "5.00%",
                            "5.00%",
                          ][index]}
                      </td>
                      <td className='border p-2'>
                        {item.remarks ||
                          (index === 4 ? "RESIDENTIAL FLAT" : "")}
                      </td>
                    </tr>
                  )
                ) || (
                  <>
                    <tr>
                      <td className='border p-2'>1</td>
                      <td className='border p-2'>PLINTH</td>
                      <td className='border p-2'>20.00%</td>
                      <td className='border p-2'>20.00%</td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>2</td>
                      <td className='border p-2'>R.C.C. ABOVE GROUND</td>
                      <td className='border p-2'>40.00%</td>
                      <td className='border p-2'>40.00%</td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>3</td>
                      <td className='border p-2'>BRICK WORK</td>
                      <td className='border p-2'>10%</td>
                      <td className='border p-2'>10.00%</td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>4</td>
                      <td className='border p-2'>INTERNAL PLASTER</td>
                      <td className='border p-2'>5.00%</td>
                      <td className='border p-2'>5.00%</td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>5</td>
                      <td className='border p-2'>EXTERNAL PLASTER</td>
                      <td className='border p-2'>5.00%</td>
                      <td className='border p-2'>5.00%</td>
                      <td className='border p-2'>RESIDENTIAL FLAT</td>
                    </tr>
                    <tr>
                      <td className='border p-2'>6</td>
                      <td className='border p-2'>FLOORING</td>
                      <td className='border p-2'>5.00%</td>
                      <td className='border p-2'>5.00%</td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>7</td>
                      <td className='border p-2'>
                        PLUMBING & ELECTRIFICATION WORK
                      </td>
                      <td className='border p-2'>5.00%</td>
                      <td className='border p-2'>5.00%</td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>8</td>
                      <td className='border p-2'>DOOR, WINDOW & PAINT</td>
                      <td className='border p-2'>5.00%</td>
                      <td className='border p-2'>5.00%</td>
                      <td className='border p-2'></td>
                    </tr>
                    <tr>
                      <td className='border p-2'>9</td>
                      <td className='border p-2'>FINISHING & POSSESSION</td>
                      <td className='border p-2'>5.00%</td>
                      <td className='border p-2'>5.00%</td>
                      <td className='border p-2'></td>
                    </tr>
                  </>
                )}
                <tr className='font-medium'>
                  <td className='border p-2' colSpan='2'>
                    TOTAL COMPLETION (%)
                  </td>
                  <td className='border p-2'>100.00%</td>
                  <td className='border p-2'>100.00%</td>
                  <td className='border p-2'></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Final Remarks */}
        <div className='mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <p>
              <span className='font-medium'>
                IS THE PROPERTY TECHNICALLY ACCEPTABLE ?
              </span>{" "}
              YES
            </p>
            <p>
              <span className='font-medium'>MARKETABILITY OF PROPERTY</span>{" "}
              GOOD
            </p>
          </div>

          <h3 className='text-lg font-medium mb-2'>REMARKS ON THE PROPERTY</h3>
          <ol className='list-decimal pl-5'>
            <li>THIS NAP CASE, ONLY OUTSIDE VISIT IS DONE.</li>
            <li>ALL DATA TAKEN AS PROVIDED BY BANK.</li>
            <li>PROPERTY IS IDENTIFIED BY REPORTY ADDRESS? AND UNIT NO.</li>
            <li>RATE HAS BEEN CONFIRM FROM MARKET ENQUIRY.</li>
          </ol>
        </div>

        {/* TSR Deviation */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>TSR DEVIATION</h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full border'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border p-2'>Sr. No.</th>
                  <th className='border p-2'>
                    Deviations in the Property / Documents Available
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border p-2'>1</td>
                  <td className='border p-2'></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TSR Condition */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>TSR CONDITION</h2>
          <h3 className='text-lg font-medium mb-2'>
            TSR CONDITIONS FOR COMPLIANCE
          </h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full border'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border p-2'>Sr. No.</th>
                  <th className='border p-2'>Condition</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border p-2'>1</td>
                  <td className='border p-2'></td>
                </tr>
                <tr>
                  <td className='border p-2'>2</td>
                  <td className='border p-2'></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <div>
            <p>
              <span className='font-medium'>TSR PREPARED BY:</span>{" "}
              {data?.tsrPreparedBy || "UNIQUE ENGO & ASSOCIATES"}
            </p>
            <p>
              <span className='font-medium'>TSR PREPARED ON DATE:</span>{" "}
              {new Date(
                data?.tsrPreparedDate?.$date || "2023-09-14"
              ).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p>
              <span className='font-medium'>TSR SUBMITTED TO:</span>{" "}
              {data?.tsrSubmittedTo || "PIRAMAL HOUSING FINANCE"}
            </p>
            <p>
              <span className='font-medium'>TSR SUBMITTED ON DATE:</span>{" "}
              {new Date(
                data?.tsrSubmittedDate?.$date || "2023-09-14"
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Location Map and Photos */}
        <div className='mb-8'>
          <h3 className='text-lg font-medium mb-2'>Location Map:</h3>
          {/* Map placeholder */}
          <div className='border p-4 text-center bg-gray-100'>
            <p>Location map would be displayed here</p>
          </div>
        </div>

        <div>
          <h3 className='text-lg font-medium mb-2'>Photographs</h3>
          {/* Photos placeholder */}
          <div className='border p-4 text-center bg-gray-100'>
            <p>Property photographs would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiramalNPADetails;
