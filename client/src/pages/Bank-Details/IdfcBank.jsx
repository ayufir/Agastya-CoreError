import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getDetailsById } from "../../redux/features/Banks/IDFCbank/idfclThunks";
import moment from "moment";

const IdfcBank = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const init = async (id) => {
    try {
      await dispatch(getDetailsById(id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      init(id);
    }
  }, [id]);

  const { singleDetail } = useSelector((state) => state.idfc) || {};
  console.log(singleDetail, "idfc data");

  const handleExportPDF = () => {
    const input = document.getElementById("reportTable");
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = margin;
      let remainingHeight = imgHeight;

      if (imgHeight > pageHeight - margin * 2) {
        while (remainingHeight > 0) {
          pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
          remainingHeight -= pageHeight - margin * 2;
          if (remainingHeight > 0) {
            pdf.addPage();
            position = margin - (imgHeight - remainingHeight);
          }
        }
      } else {
        pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
      }

      pdf.save("IDFC_Technical_Report.pdf");
    });
  };

  const handleExportExcel = () => {
    const table = document.getElementById("reportTable");
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Report" });
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "IDFC_Technical_Report.xlsx");
  };

  const handleExportCSV = () => {
    const table = document.getElementById("reportTable");
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "IDFC_Technical_Report.csv");
  };

  return (
    <div className='p-2'>
      <div className='mb-5 text-right'>
        <button
          onClick={handleExportPDF}
          className='bg-blue-500 text-white px-4 py-2 rounded mr-2'
        >
          Download PDF
        </button>
        <button
          onClick={handleExportExcel}
          className='bg-green-500 text-white px-4 py-2 rounded mr-2'
        >
          Download Excel
        </button>
        <button
          onClick={handleExportCSV}
          className='bg-purple-500 text-white px-4 py-2 rounded'
        >
          Download CSV
        </button>
      </div>

      <div id='radio' className='w-full h-full'>
        <table id='reportTable' className='w-full border-collapse'>
          <colgroup>
            <col className='w-8' />
            <col className='w-28' />
            <col className='w-16' />
            <col className='w-24' />
            <col className='w-16' span='6' />
            <col className='w-24' />
          </colgroup>

          <tbody>
            <tr>
              <td colSpan='11' className='text-center font-bold text-lg border'>
                TECHNICAL APPRAISAL REPORT FOR HOUSE/FLAT/LAND/OFFICE/COMMERCIAL
                PROPERTY
              </td>
            </tr>

            <tr>
              <td colSpan='7' className='border'>
                Ref: <span className='mx-2'>{singleDetail?.ref}</span>
              </td>
              <td colSpan='2' className='border'>
                Date:
              </td>
              <td colSpan='2' className='border'>
                {singleDetail?.date
                  ? moment(singleDetail.date).format("DD-MM-YYYY")
                  : ""}
              </td>
            </tr>

            <tr>
              <td className='border'>Branch Name:</td>
              <td className='border'>{singleDetail?.branchName}</td>
              <td colSpan='5' className='border'>
                IDFC FIRST MANDIDEEP
              </td>
              <td colSpan='2' className='border'>
                Type of Case
              </td>
              <td colSpan='2' className='border'>
                {singleDetail?.typeOfCase}
              </td>
            </tr>

            <tr>
              <td className='border'>Valuer Name</td>
              <td className='border'>{singleDetail?.volunteerName}</td>
              <td colSpan='5' className='border'>
                UNIQUE ENGINEERING AND ASSOCIATE
              </td>
              <td colSpan='2' className='border'>
                Date of Visit:
              </td>
              <td colSpan='2' className='border'>
                {singleDetail?.dateOfVisit
                  ? moment(singleDetail.dateOfVisit).format("DD-MM-YYYY")
                  : ""}
              </td>
            </tr>

            <tr>
              <td className='border'>Case Ref. No.</td>
              <td className='border'>{singleDetail?.caseRefNo}</td>
              <td colSpan='9' className='border'>
                NA
              </td>
            </tr>

            <tr>
              <td colSpan='3' className='border'>
                Contacted Person for property inspection
              </td>
              <td colSpan='8' className='border'>
                {singleDetail?.contactPersonName}, CONT NO.-{" "}
                {singleDetail?.contactPersonNumber}
              </td>
            </tr>

            <tr>
              <td className='font-bold text-center border' colSpan='11'>
                BASIC DETAILS
              </td>
            </tr>

            <tr>
              <td className='text-right border'>1</td>
              <td className='font-bold border' colSpan='2'>
                Applicant/s Name/s
              </td>
              <td colSpan='8' className='border'>
                {singleDetail?.applicantNames}
              </td>
            </tr>

            <tr>
              <td className='text-right border'>2</td>
              <td className='border'>Type of property</td>
              <td colSpan='5' className='border'>
                {singleDetail?.propertyType}
              </td>
              <td className='border'>
                Current <br />
                Usage
              </td>
              <td colSpan='3' className='border'>
                {singleDetail?.currentUsage}
              </td>
            </tr>

            <tr>
              <td rowSpan='2' className='text-right border'>
                3
              </td>
              <td colSpan='2' className='border'>
                Address at site
              </td>
              <td colSpan='8' className='border'>
                {singleDetail?.siteAddress}
              </td>
            </tr>

            <tr>
              <td colSpan='2' className='border'>
                Address as per <br />
                document
              </td>
              <td colSpan='8' className='border'>
                {singleDetail?.documentAddress}
              </td>
            </tr>

            <tr>
              <td className='text-right border'>4</td>
              <td colSpan='7' className='border'>
                Has the valuator done valuation of this property before this? If
                yes, when, for whom?
              </td>
              <td colSpan='3' className='border'>
                {singleDetail?.previousValuation}
              </td>
            </tr>

            <tr>
              <td colSpan='11' className='border'>
                &nbsp;
              </td>
            </tr>

            <tr>
              <td className='font-bold text-center border' colSpan='11'>
                SOUROUNDING & LOCALITY DETAILS
              </td>
            </tr>

            <tr>
              <td rowSpan='6' className='text-right border'>
                5
              </td>
              <td colSpan='2' rowSpan='6' className='border'>
                {singleDetail?.location}
              </td>
              <td colSpan='4' className='border'>
                Approved Usage of Property
              </td>
              <td colSpan='4' className='border'>
                {singleDetail?.approvedUsage}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Class of Locality
              </td>
              <td colSpan='4' className='border'>
                {singleDetail?.localityClass}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Site is (Dev, Under Dev)
              </td>
              <td colSpan='4' className='border'>
                {singleDetail?.siteDevelopment}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Proximity to civic amenities/public transport
              </td>
              <td colSpan='4' className='border'>
                {singleDetail?.proximityAmenities}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Railway Station
              </td>
              <td colSpan='4' className='border'>
                {singleDetail?.railwayStationDistance}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Bus Stop
              </td>
              <td colSpan='4' className='border'>
                {singleDetail?.busStopDistance}
              </td>
            </tr>

            <tr>
              <td className='text-right border'>6</td>
              <td colSpan='2' className='border'>
                Close Vicinity/Landmark
              </td>
              <td colSpan='8' className='border'>
                {singleDetail?.landmark}
              </td>
            </tr>

            <tr>
              <td className='text-right border'>7</td>
              <td colSpan='2' className='border'>
                Distance from City Centre
              </td>
              <td colSpan='8' className='border'>
                {singleDetail?.cityCentreDistance}
              </td>
            </tr>

            <tr>
              <td className='border'>8</td>
              <td colSpan='2' className='border'>
                Condition and width of <br />
                approach Road
              </td>
              <td colSpan='8' className='border'>
                <span className='font-bold'>More than 10 ft</span> / Less than
                10 ft
              </td>
            </tr>

            <tr>
              <td colSpan='11' className='border'>
                &nbsp;
              </td>
            </tr>

            <tr>
              <td colSpan='2' className='border'>
                Property Identified <br />
                through
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.propertyIdentifiedThrough}
              </td>
            </tr>

            <tr>
              <td colSpan='2' className='border'>
                Type of structure
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.structureType}
              </td>
            </tr>

            <tr>
              <td colSpan='2' className='border'>
                Land/Plot Area
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.longFirstArea}
              </td>
            </tr>
            <tr>
              <td colSpan='2' className='border'>
                No of Blocks/Wings
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.blockHiringCount}
              </td>
            </tr>

            <tr>
              <td colSpan='2' className='border'>
                No of Units per floor
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.unitsPerFloor}
              </td>
            </tr>

            <tr>
              <td colSpan='2' className='border'>
                No. of Floors
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.floorsCount}
              </td>
            </tr>

            <tr>
              <td colSpan='2' className='border'>
                No. of Lifts in each wing
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.unitsPerWing}
              </td>
            </tr>

            <tr>
              <td rowSpan='4' className='text-right border'>
                11
              </td>
              <td rowSpan='3' className='border'>
                Unit details
              </td>
              <td colSpan='2' className='border'>
                Located on Floor No.
              </td>
              <td colSpan='7' className='border'>
                {singleDetail?.floorNumber}
              </td>
            </tr>

            <tr>
              <td colSpan='2' className='border'>
                No. of rooms
              </td>
              <td colSpan='7' className='border'>
                {singleDetail?.roomsCount}
              </td>
            </tr>

            <tr>
              <td colSpan='2' className='border'>
                Carpet Area
              </td>
              <td colSpan='2' className='border'>
                {singleDetail?.carpetArea}
              </td>
              <td colSpan='2' className='border'>
                Super Built-up
              </td>
              <td colSpan='3' className='border'>
                {singleDetail?.superBuiltUp}
              </td>
            </tr>

            <tr>
              <td className='border'>&nbsp;</td>
              <td colSpan='5' className='border'>
                &nbsp;
              </td>
              <td className='font-bold border' colSpan='2'>
                Road Facing
              </td>
              <td colSpan='2' className='border'>
                &nbsp;
              </td>
            </tr>

            <tr>
              <td rowSpan='2' className='text-right border'>
                12
              </td>
              <td rowSpan='2' className='border'>
                Quality of Construction:
              </td>
              <td colSpan='2' rowSpan='2' className='border'>
                Exteriors
              </td>
              <td colSpan='3' rowSpan='2' className='border'>
                {singleDetail?.constructionQuality}
              </td>
            </tr>

            <tr></tr>

            <tr>
              <td rowSpan='2' className='text-right border'>
                13
              </td>
              <td rowSpan='2' className='border'>
                Age of the <br /> property
              </td>
              <td colSpan='2' rowSpan='2' className='border'>
                {singleDetail?.propertyAge}
              </td>
              <td colSpan='3' rowSpan='2' className='border'>
                Residual life
              </td>
              <td colSpan='4' rowSpan='2' className='border'>
                {singleDetail?.residualLife}
              </td>
            </tr>

            <tr></tr>

            <tr>
              <td colSpan='11' className='border'>
                &nbsp;
              </td>
            </tr>

            {/* <!-- Sanction Details Table --> */}
            <tr>
              <td colSpan='11' className='border'>
                &nbsp;
              </td>
            </tr>

            <tr>
              <td className='font-bold text-center border' colSpan='11'>
                SANCTION PLAN APPROVAL & OTHER DOCUMENTS DETAILS
              </td>
            </tr>

            <tr>
              <td rowSpan='3' className='text-right border'>
                14
              </td>
              <td colSpan='2' rowSpan='3' className='border'>
                Sanctioned plans verified with approval no
              </td>
              <td colSpan='8' rowSpan='3' className='border'>
                {singleDetail?.planApprovalNo}
              </td>
            </tr>

            <tr></tr>
            <tr></tr>

            <tr>
              <td className='border'>14A</td>
              <td colSpan='2' className='border'>
                Construction as per approved plan
              </td>
              <td colSpan='8' className='border'>
                {singleDetail?.constructionAsPerPlan}
              </td>
            </tr>

            <tr>
              <td className='border'>14B</td>
              <td colSpan='2' className='border'>
                Construction permission
              </td>
              <td colSpan='8' className='border'>
                {singleDetail?.constructionPermission}
              </td>
            </tr>

            <tr>
              <td className='border'>14C</td>
              <td colSpan='2' className='border'>
                Number and Date
              </td>
              <td colSpan='8' className='border'>
                {singleDetail?.permissionNumberDate}
              </td>
            </tr>

            <tr>
              <td className='text-right border'>15</td>
              <td colSpan='2' className='border'>
                Ownership type
              </td>
              <td colSpan='8' className='border'>
                {singleDetail?.ownershipType}
              </td>
            </tr>

            <tr>
              <td className='text-right border'>16</td>
              <td colSpan='2' rowSpan='2' className='border'>
                Property documents verified
              </td>
              <td colSpan='8' rowSpan='2' className='border'>
                {singleDetail?.documentsVerified}
              </td>
            </tr>

            <tr>
              <td className='border'>&nbsp;</td>
            </tr>

            <tr>
              <td className='text-right border'>17</td>
              <td colSpan='3' className='border'>
                Is the property within Municipal Limits
              </td>
              <td colSpan='7' className='border'>
                {singleDetail?.withinMunicipalLimits}
              </td>
            </tr>

            <tr>
              <td className='text-right border'>18</td>
              <td colSpan='3' rowSpan='2' className='border'>
                Permissible usage allowed as per master
                <br /> plan
              </td>
              <td colSpan='7' rowSpan='2' className='border'>
                {singleDetail?.permissibleUsage}
              </td>
            </tr>

            <tr>
              <td className='border'>&nbsp;</td>
            </tr>

            <tr>
              <td rowSpan='9' className='text-right border'>
                19
              </td>
              <td className='font-bold border' colSpan='10'>
                Setbacks
              </td>
            </tr>

            <tr>
              <td className='font-bold border' rowSpan='3'>
                Setbacks
              </td>
              <td rowSpan='3' className='border'>
                As per plan/
                <br />
                Bye laws
              </td>
              <td rowSpan='3' className='border'>
                Actual at
                <br />
                site
              </td>
              <td rowSpan='3' className='border'>
                Floor No
              </td>
              <td rowSpan='3' className='border'>
                As per
                <br />
                plan/ Bye
                <br />
                laws
              </td>
              <td rowSpan='3' className='border'>
                Actual
                <br />
                at site
              </td>
              <td colSpan='2' rowSpan='3' className='border'>
                Deviation /
                <br />
                Violations
              </td>
              <td colSpan='2' rowSpan='3' className='border'>
                Remarks, if any
              </td>
            </tr>

            <tr></tr>
            <tr></tr>

            <tr>
              <td className='border'>Front</td>
              <td className='border'>NA</td>
              <td className='border'>NA</td>
              <td className='border'>&nbsp;</td>
              <td className='border'>&nbsp;</td>
              <td className='text-right border'>0</td>
              <td colSpan='2' rowSpan='5' className='border'>
                NO
              </td>
              <td colSpan='2' rowSpan='5' className='border'>
                NA
              </td>
            </tr>

            <tr>
              <td className='border'>Side2 (Right)</td>
              <td className='border'>NA</td>
              <td className='border'>NA</td>
              <td className='border'>&nbsp;</td>
              <td className='border'>&nbsp;</td>
              <td className='text-right border'>0</td>
            </tr>

            <tr>
              <td className='border'>Rear</td>
              <td className='border'>NA</td>
              <td className='border'>NA</td>
              <td className='border'>&nbsp;</td>
              <td className='border'>&nbsp;</td>
              <td className='text-right border'>0</td>
            </tr>

            <tr>
              <td colSpan='2' rowSpan='2' className='border'>
                Demolition risk (if any to be highlighted)
              </td>
              <td colSpan='4' rowSpan='2' className='border'>
                LOW
              </td>
            </tr>

            <tr></tr>

            <tr>
              <td className='text-right border'>20</td>
              <td className='font-bold border' colSpan='10'>
                Floor Wise Area (In Sq. fts.)
              </td>
            </tr>

            <tr>
              <td rowSpan='9' className='border'>
                {singleDetail?.unitsPerFloor}
              </td>
              <td colSpan='3' className='border'>
                {singleDetail?.floorsCount}
              </td>
              <td colSpan='7' className='border'>
                {singleDetail?.unitsPerWing}
              </td>
            </tr>

            <tr>
              <td className='border'>Carpet Area As Measured (sq. ft)</td>
              <td className='border'>&nbsp;</td>
              <td className='border'>&nbsp;</td>
              <td colSpan='7' className='border'>
                {singleDetail?.carpetAreaMeasured}
              </td>
            </tr>

            <tr>
              <td className='border'>Carpet Area as Agreement (sq. ft)</td>
              <td className='border'>&nbsp;</td>
              <td className='border'>&nbsp;</td>
              <td colSpan='7' className='border'>
                {singleDetail?.carpetAreaAgreement}
              </td>
            </tr>

            <tr>
              <td className='border'>Carpet Area as Per App. Plan (sq. ft)</td>
              <td className='border'>&nbsp;</td>
              <td className='border'>&nbsp;</td>
              <td colSpan='7' className='border'>
                {singleDetail?.carpetAreaApp}
              </td>
            </tr>

            <tr>
              <td className='border'>Area Considered For Valuation (sq. ft)</td>
              <td className='border'>&nbsp;</td>
              <td className='border'>&nbsp;</td>
              <td colSpan='7' className='border'>
                {singleDetail?.areaForValuation}
              </td>
            </tr>

            <tr>
              <td className='font-bold border' colSpan='5'>
                Loading
              </td>
              <td className='font-bold border' colSpan='5'>
                Super Area (sq. ft)
              </td>
            </tr>

            <tr>
              <td colSpan='5' className='border'>
                {singleDetail?.loading}
              </td>
              <td colSpan='5' className='border'>
                {singleDetail?.superArea}
              </td>
            </tr>

            <tr>
              <td className='font-bold border' colSpan='5'>
                Rate (per sq ft)
              </td>
              <td className='font-bold border' colSpan='5'>
                Value by Comparison Md.(INR)
              </td>
            </tr>

            <tr>
              <td colSpan='5' className='border'>
                {singleDetail?.ratePerSqft}
              </td>
              <td colSpan='5' className='border'>
                {singleDetail?.comparisonValue}
              </td>
            </tr>

            <tr>
              <td className='border'>20A</td>
              <td className='font-bold border' colSpan='5'>
                Current government approved rate as per ready reckoner (Kindly
                provide this Rate in sq ft. only)
              </td>
              <td colSpan='5' className='border'>
                {singleDetail?.govtApprovedRate}
              </td>
            </tr>
          </tbody>
        </table>

        <table className='w-full border-collapse'>
          <colgroup>
            <col className='w-8' />
            <col className='w-28' />
            <col className='w-16' />
            <col className='w-24' />
            <col className='w-16' span='6' />
            <col className='w-24' />
          </colgroup>

          <tbody>
            <tr>
              <td colSpan='11' className='border'>
                &nbsp;
              </td>
            </tr>

            <tr>
              <td className='font-bold text-center border' colSpan='11'>
                VALUATION
              </td>
            </tr>

            <tr>
              <td rowSpan='15' className='text-right border'>
                21
              </td>
              <td className='font-bold border' colSpan='10'>
                A. Description of Constructed Area and Rates
              </td>
            </tr>

            <tr>
              <td className='font-bold border' colSpan='2'>
                Description
              </td>
              <td className='font-bold border' colSpan='2'>
                Area (Sft.)
              </td>
              <td className='font-bold border' colSpan='3'>
                Rate (Sft.)
              </td>
              <td className='font-bold border' colSpan='3'>
                Amount (in ₹ )
              </td>
            </tr>

            <tr>
              <td className='font-bold border' colSpan='2'>
                {singleDetail?.description1}
              </td>
              <td colSpan='2' className='border'>
                {singleDetail?.area1}
              </td>
              <td colSpan='3' className='border'>
                {singleDetail?.rate1}
              </td>
              <td colSpan='3' className='border'>
                {singleDetail?.amount1}
              </td>
            </tr>

            <tr>
              <td className='font-bold border' colSpan='2'>
                {singleDetail?.description2}
              </td>
              <td colSpan='2' className='border'>
                {singleDetail?.area2}
              </td>
              <td colSpan='3' className='border'>
                {singleDetail?.rate2}
              </td>
              <td colSpan='3' className='border'>
                {singleDetail?.amount2}
              </td>
            </tr>

            <tr>
              <td className='font-bold border' colSpan='4'>
                Total Value by Land & Building Method (INR) or comparison method
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.totalValue}
              </td>
            </tr>

            <tr>
              <td className='font-bold border' colSpan='4'>
                Stage of construction
              </td>
              <td colSpan='2' className='border'>
                {singleDetail?.constructionStage}
              </td>
              <td className='text-right border'>30%</td>
              <td colSpan='2' className='border'>
                RECOMMENDED
              </td>
              <td className='text-right border'>
                {singleDetail?.recommendedPercentage}
              </td>
            </tr>

            <tr>
              <td className='font-bold border' colSpan='4'>
                Recommended Construction Value
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.recommendedConstructionValue}
              </td>
            </tr>

            <tr>
              <td className='font-bold border' colSpan='10'>
                B. Value of Extra Amenities if applicable
              </td>
            </tr>

            <tr>
              <td colSpan='2' className='border'>
                No of Car Parking
              </td>
              <td colSpan='2' className='border'>
                Rate per Parking
              </td>
              <td colSpan='3' className='border'>
                Value of Car Parking
              </td>
              <td colSpan='3' className='border'>
                PLC/IDC/EDC/Power Backup/Other
              </td>
            </tr>

            <tr>
              <td colSpan='2' className='border'>
                {singleDetail?.carParkingCount}
              </td>
              <td colSpan='2' className='border'>
                {singleDetail?.carParkingRate}
              </td>
              <td colSpan='3' className='border'>
                {singleDetail?.carParkingValue}
              </td>
              <td colSpan='3' className='border'>
                NA
              </td>
            </tr>

            <tr>
              <td className='font-bold border' colSpan='4'>
                Total Amenities Charges
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.totalAmenitiesCharges}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Total Market Value of Property (A+B) (in Amt. )
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.totalMarketValue}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Forced Sale Value
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.forcedSaleValue}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Re-construction Cost (for Property insurance)
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.reconstructionCost}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Approx. Rentals in case of 100% complete property
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.approxRentals}
              </td>
            </tr>

            <tr>
              <td colSpan='11' className='border'>
                &nbsp;
              </td>
            </tr>

            <tr>
              <td rowSpan='5' className='text-right border'>
                22
              </td>
              <td className='font-bold border' colSpan='10'>
                Details from Online land Revenue RecordS
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Online Record Found
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.onlineRecordFound}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Nature of Land specified in records
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.landNature}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Ownership Details as per records
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.ownershipDetails}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Property area Details mentioned in records
              </td>
              <td colSpan='6' className='border'>
                {singleDetail?.propertyAreaDetails}
              </td>
            </tr>

            <tr>
              <td colSpan='11' className='border'>
                &nbsp;
              </td>
            </tr>

            <tr>
              <td className='font-bold text-center border' colSpan='11'>
                BOUNDARIES
              </td>
            </tr>

            <tr>
              <td colSpan='2' rowSpan='5' className='border'>
                Boundary details
              </td>
              <td className='border'>&nbsp;</td>
              <td colSpan='4' className='border'>
                <span className='font-bold'>As per DEED</span> /AS PER AGREEMENT
              </td>
              <td className='font-bold border' colSpan='4'>
                As per site
              </td>
            </tr>

            <tr>
              <td className='font-bold border'>East :</td>
              <td colSpan='4' className='border'>
                COLONY ROAD
              </td>
              <td colSpan='4' className='border'>
                KACHA ROAD
              </td>
            </tr>

            <tr>
              <td className='font-bold border'>West :</td>
              <td colSpan='4' className='border'>
                PLOT NO 276
              </td>
              <td colSpan='4' className='border'>
                OPEN PLOT NO. 276
              </td>
            </tr>

            <tr>
              <td className='font-bold border'>North :</td>
              <td colSpan='4' className='border'>
                PLOT NO 218
              </td>
              <td colSpan='4' className='border'>
                OPEN PLOT NO. 218
              </td>
            </tr>

            <tr>
              <td className='font-bold border'>South :</td>
              <td colSpan='4' className='border'>
                PLOT NI 217
              </td>
              <td colSpan='4' className='border'>
                OPEN PLOT NO. 217
              </td>
            </tr>

            <tr>
              <td className='text-right border'>22</td>
              <td className='border'>Boundaries Matching</td>
              <td className='border'>&nbsp;</td>
              <td colSpan='8' className='border'>
                {singleDetail?.boundariesMatching}
              </td>
            </tr>

            <tr>
              <td colSpan='11' className='border'>
                <img
                  width='175'
                  height='190'
                  src='SUndram_clip_image002_0000.png'
                  alt='Property image'
                />

                <h5 className='font-bold'>
                  AT SITE PLINTH WORK DONE, PREVIOUS REMARKS ARE THESE:-
                  <br />
                  <span className='text-red-500'>
                    BUILDING PERMISSION AND MAP IS REQUIRE.
                  </span>
                  <br />
                </h5>
                <br />
                <p className='font-bold'>
                  1. GIVEN XEROX COPY OF SALE DEED IS IN FAVOR OF MR. ARJUN
                  LALWANI S/O LATE MR. PRAHAAD RAI LALWANI AND DRAFT SALE
                  AGREEMENT IS BETWEEN MR. ARJUN LALWANI S/O MR. PRAHALAD RAI
                  LALWANI AND (1) MR. RAJESH KUMAR S/O MR. AMAR SINGH (2) SMT.
                  BHARTI BAI W/O MR. RAJESH KUMAR.
                  <br />
                  2. DURING PROPERTY VISIT MR. SUNIL KUMAR JI WAS MET AT SITE
                  WHO IS THE CUSTOMER REPRSANTATIVE CONT NO.- 7987459327. IT WAS
                  CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE
                  FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.
                  <br />
                  3. RATE HAS BEEN CONFORM FROM MARKET INQUIRY.
                  <br />
                  4. PROPERTY IS SITUATED AT SURROUNDING AREA OF UNDER DEV.
                  RESIDENTIAL ZONING.
                  <br />
                  5. PROPERTY IS IDENTIFIED BY FOUR SIDE BOUNDARIES OF GIVEN
                  SALE DEED AND SALE AGREEMENT AND COLONY LAYOUT PLAN.
                  <br />
                  6. OBTAIN COPY OF TNCP LAYOUT PLAN MEMO NO. 2387 ON DATED
                  29.12.2011.
                  <br />
                  7. OBTAIN COPY OF BUILDING ESTIMATE COST OF RS. 403200/- FOR
                  G.F. BUILT UP AREA 336 SQFT.
                  <br />
                  8. TOTAL CONST COST WILL BE CONSIDER AFTER COMPLETION OF WORK.
                  <br />
                  9. APPROVED MAP AND PERMISSION TO BE TAKEN PRIOR DISBURSEMENT
                  OF CONST PART.
                  <br />
                  10. SUGGEST TO CREDIT TEAM TO BE CHECK PROPER OWNERSHIP
                  DOCUMNET PRIOR DISBURSEMENT.
                </p>
              </td>
            </tr>

            <tr>
              <td className='font-bold text-center border' colSpan='11'>
                Any other observation to highlighted:
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Property in caution area (Y/N)
              </td>
              <td colSpan='7' className='border'>
                {singleDetail?.propertyInCautionArea}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Property in Negative area (Y/N)
              </td>
              <td colSpan='7' className='border'>
                {singleDetail?.propertyInNegativeArea}
              </td>
            </tr>

            <tr>
              <td colSpan='4' className='border'>
                Property in OGL (Y/N)
              </td>
              <td colSpan='7' className='border'>
                {singleDetail?.propertyInOGL}
              </td>
            </tr>

            <tr>
              <td className='border'>&nbsp;</td>
              <td className='border'></td>
              <td className='border'></td>
              <td className='border'></td>
              <td className='border'></td>
              <td className='border'></td>
              <td className='border'></td>
              <td className='border'></td>
              <td className='border'></td>
              <td className='border'></td>
              <td className='border'>&nbsp;</td>
            </tr>

            <tr>
              <td className='font-bold border' colSpan='2'>
                Latitude :
              </td>
              <td colSpan='3' className='border'>
                {singleDetail?.latitude}
              </td>
              <td className='font-bold border' colSpan='2'>
                Longitude :
              </td>
              <td colSpan='4' className='border'>
                {singleDetail?.longitude}
              </td>
            </tr>

            <tr>
              <td className='font-bold text-center border' colSpan='11'>
                Location sketch for the property: (Google & Map Images showing
                exact location of the property)
              </td>
            </tr>
          </tbody>
        </table>

        <p>&nbsp;</p>
        <p>&nbsp;</p>
      </div>
    </div>
  );
};

export default IdfcBank;
