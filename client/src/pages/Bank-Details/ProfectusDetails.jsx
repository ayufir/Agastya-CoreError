import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getBankReportById } from "../../redux/features/Banks/Profectus/profectusThunks";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "antd";

const ProfectusDetails = () => {
  const { id } = useParams();

  const propertyData =
    useSelector((state) => state.profectus?.data?.data) || {};

  console.log(propertyData, "PROFECTUS");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBankReportById(id));
  }, [id, dispatch]);

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

      pdf.save("Profectus_Technical_Report.pdf");
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
    saveAs(blob, "Profectus_Technical_Report.xlsx");
  };

  const handleExportCSV = () => {
    const table = document.getElementById("reportTable");
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Profectus_Technical_Report.csv");
  };

  return (
    <div className='p-2'>
      <div className='mb-5 text-right'>
        <Button onClick={handleExportPDF} className='mr-2'>
          Download PDF
        </Button>
        <Button onClick={handleExportExcel} className='mr-2'>
          Download Excel
        </Button>
        <Button onClick={handleExportCSV}>Download CSV</Button>
      </div>

      <div id='radio' className='w-full h-full'>
        <table id='reportTable' className='w-full h-full border-collapse'>
          <colgroup>
            <col width='436' />
            <col width='67' />
            <col width='121' />
            <col width='67' span='3' />
            <col width='155' />
            <col width='185' />
            <col width='167' />
            <col width='25' />
            <col width='67' />
            <col width='196' />
          </colgroup>
          <tbody>
            <tr>
              <td className='font-bold' colSpan='12'>
                PROFECTUS CAPITAL VALUATION REPORT
              </td>
            </tr>
            <tr>
              <td className='font-bold' colSpan='12'>
                Basic Details
              </td>
            </tr>
            <tr>
              <td className='font-bold'>Name of the Client</td>
              <td colSpan='5'>GAURAV KUMAR GUPTA</td>
              <td className='font-bold'>Initiation Date</td>
              <td colSpan='5'>
                {new Date(propertyData?.createdAt).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className='font-bold'>SR no</td>
              <td colSpan='5'>{propertyData?._id}</td>
              <td className='font-bold'>Visit Date</td>
              <td colSpan='5'>
                {new Date(propertyData?.updatedAt).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className='font-bold'>Case Reference Number</td>
              <td colSpan='5'>{propertyData?.reraId}</td>
              <td className='font-bold'>Report Date</td>
              <td colSpan='5'>{new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td className='font-bold'>Name of the Property Owner</td>
              <td colSpan='11'>{propertyData?.developerName}</td>
            </tr>
            <tr>
              <td className='font-bold' colSpan='12'>
                Location Details
              </td>
            </tr>
            <tr>
              <td className='font-bold'>Property Address</td>
              <td colSpan='11'>{propertyData?.nameOfProject}</td>
            </tr>
            <tr>
              <td className='font-bold'>Main Locality</td>
              <td colSpan='5'>Green Park</td>
              <td className='font-bold'>Sub Locality</td>
              <td colSpan='5'>West District</td>
            </tr>
            <tr>
              <td className='font-bold'>Property Type</td>
              <td colSpan='11'>{propertyData?.typeOfProject}</td>
            </tr>
            <tr>
              <td className='font-bold'>Property Sub Type</td>
              <td colSpan='11'>{propertyData?.natureOfProject}</td>
            </tr>
            <tr>
              <td className='font-bold'>Locality</td>
              <td colSpan='3'>Developing</td>
              <td className='font-bold' colSpan='4'>
                Property Falling Within
              </td>
              <td colSpan='4'>{propertyData?.approvalAuthority}</td>
            </tr>
            <tr>
              <td className='font-bold'>Occupancy Level of the Surrounding</td>
              <td colSpan='11'>Medium Population Density</td>
            </tr>
            <tr>
              <td className='font-bold'>
                Condition of the Site of the Property
              </td>
              <td colSpan='11'>{propertyData?.completionStatus}</td>
            </tr>
            <tr>
              <td className='font-bold' colSpan='12'>
                Property Details
              </td>
            </tr>
            <tr>
              <td className='font-bold'>Occupancy</td>
              <td colSpan='5'>
                {propertyData?.occupancyCertificateAvailable === "Yes"
                  ? "Occupied"
                  : "Vacant"}
              </td>
              <td className='font-bold' colSpan='2'>
                Occupied By
              </td>
              <td colSpan='4'>Owner</td>
            </tr>
            <tr>
              <td className='font-bold'>Property Demarcated</td>
              <td colSpan='5'>YES</td>
              <td className='font-bold' colSpan='2'>
                Property Identification
              </td>
              <td colSpan='4'>Yes</td>
            </tr>
            <tr>
              <td className='font-bold'>Project Category</td>
              <td colSpan='5'>{propertyData?.typeOfProject}</td>
              <td className='font-bold' colSpan='2'>
                Flat Type
              </td>
              <td colSpan='4'>{propertyData?.unitFlatConfiguration}</td>
            </tr>
            <tr>
              <td className='font-bold'>Property Holding</td>
              <td colSpan='11'>{propertyData?.landTitle}</td>
            </tr>
            <tr>
              <td className='font-bold'>Type of Structure</td>
              <td colSpan='5'>{propertyData?.typeOfStructure}</td>
              <td className='font-bold' colSpan='2'>
                Area of Plot
              </td>
              <td colSpan='4'>{propertyData?.plotArea}</td>
            </tr>
            <tr>
              <td className='font-bold'>Total No of Floors</td>
              <td colSpan='5'>{propertyData?.noOfFloorsActual}</td>
              <td className='font-bold' colSpan='2'>
                Lift Facility
              </td>
              <td colSpan='4'>{propertyData?.liftAvailable}</td>
            </tr>
            <tr>
              <td className='font-bold'>Amenities</td>
              <td colSpan='5'>{propertyData?.amenities}</td>
              <td className='font-bold' colSpan='2'>
                Marketability
              </td>
              <td colSpan='4'>{propertyData?.marketability}</td>
            </tr>
            <tr>
              <td className='font-bold'>Quality of Construction</td>
              <td colSpan='5'>{propertyData?.qualityOfConstruction}</td>
              <td className='font-bold' colSpan='2'>
                Construction Stage
              </td>
              <td colSpan='4'>{propertyData?.constructionStage}</td>
            </tr>
            <tr>
              <td className='font-bold'>Age of the Property</td>
              <td colSpan='5'>{propertyData?.approxAgeOfProperty}</td>
              <td className='font-bold' colSpan='2'>
                Residual Age
              </td>
              <td colSpan='4'>{propertyData?.residualAge}</td>
            </tr>
            <tr>
              <td className='font-bold' colSpan='12'>
                Boundary Details
              </td>
            </tr>
            <tr>
              <td className='font-bold'>Detailing</td>
              <td className='font-bold' colSpan='3'>
                North
              </td>
              <td className='font-bold' colSpan='3'>
                South
              </td>
              <td className='font-bold' colSpan='3'>
                East
              </td>
              <td className='font-bold' colSpan='2'>
                West
              </td>
            </tr>
            <tr>
              <td className='font-bold'>Boundaries</td>
              <td colSpan='3'>{propertyData?.directions?.North}</td>
              <td colSpan='3'>{propertyData?.directions?.South}</td>
              <td colSpan='3'>{propertyData?.directions?.East}</td>
              <td colSpan='2'>{propertyData?.directions?.West}</td>
            </tr>
            <tr>
              <td className='font-bold'>Boundaries Matching</td>
              <td colSpan='11'>{propertyData?.boundariesMatching}</td>
            </tr>
            <tr>
              <td className='font-bold' colSpan='12'>
                Valuation
              </td>
            </tr>
            <tr>
              <td className='font-bold'>Fair Market Value</td>
              <td colSpan='11'>₹{propertyData?.fairMarketValue}</td>
            </tr>
            <tr>
              <td className='font-bold'>Distress Value</td>
              <td colSpan='11'>
                ₹
                {Math.round(
                  parseInt(propertyData?.fairMarketValue) * 0.7
                ).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className='font-bold'>Insurance Value</td>
              <td colSpan='11'>
                ₹
                {Math.round(
                  parseInt(propertyData?.fairMarketValue) * 0.8
                ).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className='font-bold' colSpan='12'>
                Project Details
              </td>
            </tr>
            <tr>
              <td className='font-bold'>RERA Approved</td>
              <td colSpan='5'>{propertyData?.isRERAApproved}</td>
              <td className='font-bold' colSpan='2'>
                RERA ID
              </td>
              <td colSpan='4'>{propertyData?.reraId}</td>
            </tr>
            <tr>
              <td className='font-bold'>Total Buildings</td>
              <td colSpan='5'>{propertyData?.totalNoOfBuildings}</td>
              <td className='font-bold' colSpan='2'>
                Units Sold
              </td>
              <td colSpan='4'>
                {propertyData?.unitsSold}/{propertyData?.noOfUnits}
              </td>
            </tr>
            <tr>
              <td className='font-bold'>Expected Completion</td>
              <td colSpan='11'>{propertyData?.expectedCompletionTime}</td>
            </tr>
            <tr>
              <td className='font-bold'>Legal Clearance</td>
              <td colSpan='5'>{propertyData?.legalClearance}</td>
              <td className='font-bold' colSpan='2'>
                Litigation
              </td>
              <td colSpan='4'>{propertyData?.litigation}</td>
            </tr>
            <tr>
              <td rowSpan='3'>&nbsp;</td>
              <td id='catching' colSpan='11' rowSpan='3'>
                <p className='font-bold'>
                  VALUATION REMARKS <br />
                </p>
                1. Property is {propertyData?.constructionStage?.toLowerCase()}{" "}
                with {propertyData?.qualityOfConstruction?.toLowerCase()}{" "}
                quality construction.
                <br />
                2. Project is{" "}
                {propertyData?.isRERAApproved === "Yes" ? "" : "not"} RERA
                approved ({propertyData?.reraId}).
                <br />
                3. The property has the following amenities:{" "}
                {propertyData?.amenities}.<br />
                4. Current construction status: {propertyData?.completionStatus}
                .
                <br />
                5. Expected completion time:{" "}
                {propertyData?.expectedCompletionTime}
                .<br />
                6. Legal clearance: {propertyData?.legalClearance}, Litigation
                status: {propertyData?.litigation}.<br />
                7. Total units in project: {propertyData?.noOfUnits}, Units
                sold: {propertyData?.unitsSold}.<br />
                <p className='font-bold'>
                  8. Marketability of the property is{" "}
                  {propertyData?.marketability?.toLowerCase()}.
                </p>
              </td>
            </tr>
            <tr></tr>
            <tr></tr>
            <tr>
              <td>Name of the Engineer visited</td>
              <td colSpan='11'>ER. BHAGWAT</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfectusDetails;
