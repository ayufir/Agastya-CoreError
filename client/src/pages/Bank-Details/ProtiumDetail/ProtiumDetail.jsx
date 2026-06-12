import React, { useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProtiumBankById } from "../../../redux/features/Banks/Protium/ProtiumBankThunk";
const ProtiumDeatil = () => {
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

      pdf.save("Protium_Technical_Report.pdf");
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
    saveAs(blob, "Protium_Technical_Report.xlsx");
  };

  const handleExportCSV = () => {
    const table = document.getElementById("reportTable");
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Protium_Technical_Report.csv");
  };

  const dispatch = useDispatch();
  const { id } = useParams();
  const data = useSelector((state) => state.protium.singleData);

  useEffect(() => {
    if (id) {
      dispatch(getProtiumBankById(id));
    }
  }, [id, dispatch]);

  if (!data) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className='p-2'>
        <div className='mb-5 text-right'>
          <button
            onClick={handleExportPDF}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2'
          >
            Download PDF
          </button>
          <button
            onClick={handleExportExcel}
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2'
          >
            Download Excel
          </button>
          <button
            onClick={handleExportCSV}
            className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'
          >
            Download CSV
          </button>
        </div>

        <div id='radio' className='w-full h-full'>
          <table id='reportTable' className='w-full border-collapse'>
            <colgroup>
              <col width='66' span='2' />
              <col width='67' span='2' />
              <col width='72' />
              <col width='66' />
              <col width='108' />
              <col width='143' />
              <col width='66' />
              <col width='77' />
              <col width='67' />
              <col width='83' />
            </colgroup>
            <tbody>
              <tr>
                <td className='font-bold' colSpan='12'>
                  VALUATION REPORT FOR PROTIUM FINANCE LIMITED
                </td>
              </tr>
              <tr>
                <td colSpan='12'>APPLICATION DETAILS:</td>
              </tr>
              <tr>
                <td colSpan='3'>Lead ID / LAN NO.</td>
                <td colSpan='4'>{data.leadId || "A068301-LAP"}</td>
                <td>DATE</td>
                <td>
                  {new Date(data.date).toLocaleDateString() || "16.05.2023"}
                </td>
                <td>&nbsp;</td>
                <td>CASE</td>
                <td>LAP</td>
              </tr>
              <tr>
                <td colSpan='3'>VALUER NAME</td>
                <td className='font-bold' colSpan='9'>
                  {data.valuerName || "UNIQUE ENGGINEERING & ASSOCIATES"}
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  A. GENERAL DETAILS
                </td>
              </tr>
              <tr>
                <td colSpan='4'>1. NAME OF APPLICANT</td>
                <td colSpan='8'>{data.nameOfApplicant || "AB COLLECTION"}</td>
              </tr>
              <tr>
                <td colSpan='4'>2. NAME OF PROPERTY OWNER</td>
                <td colSpan='8'>
                  {data.nameOfPropertyOwner ||
                    "MR. AKASH BADAL S/O SHRI KAVINDRA KUMAR BADAL"}
                </td>
              </tr>
              <tr>
                <td colSpan='4'>3. Property Address as per site</td>
                <td colSpan='8'>
                  {data.propertyAddressSite ||
                    "COMMERCIAL SHOP NO. 03(CORNNER), SITUATED AT FIRST FLOOR OF BUILDING KNOWN AS KRISHNA COMPLEX, AT PART OF KHASRA NO. 493/1/1/2, PH. NO. 33, VILLAGE-NEELBAD, WARD NO. 26, VIKASHKHAND-PHANDA, TEHSIL-HUZUR, DIST. - BHOPAL (M.P.)-"}
                </td>
              </tr>
              <tr>
                <td colSpan='4'>4. Legal address of property</td>
                <td colSpan='8'>
                  {data.legalAddress ||
                    "COMMERCIAL SHOP NO. 03(CORNNER), SITUATED AT FIRST FLOOR OF BUILDING KNOWN AS KRISHNA COMPLEX, AT PART OF KHASRA NO. 493/1/1/2, PH. NO. 33, VILLAGE-NEELBAD, WARD NO. 26, VIKASHKHAND-PHANDA, TEHSIL-HUZUR, DIST. - BHOPAL (M.P.)-"}
                </td>
              </tr>
              <tr>
                <td colSpan='4'>5. Contact No. of the Owner</td>
                <td colSpan='3'>{data.contactNoOfOwner || "7869416171"}</td>
                <td colSpan='2'>Tenant if Applicable</td>
                <td colSpan='3'>NA</td>
              </tr>
              <tr>
                <td colSpan='4' rowSpan='2'>
                  6. LANDMARK
                </td>
                <td colSpan='3' rowSpan='2'>
                  {data.landmark || "NEAR RANI LAXSHMI BAI SHOPPING COMPLEX"}
                </td>
                <td colSpan='2'>Latitude</td>
                <td colSpan='3'>23.192768</td>
              </tr>
              <tr>
                <td colSpan='2'>Longitude</td>
                <td colSpan='3'>,77.342493</td>
              </tr>
              <tr>
                <td colSpan='4'>7. DATE OF TECHNICAL VISIT</td>
                <td colSpan='8'>
                  {new Date(data.dateOfTechnicalVisit).toLocaleDateString() ||
                    "16.05.2023"}
                </td>
              </tr>
              <tr>
                <td colSpan='4'>8. Property Usage</td>
                <td colSpan='3'>
                  {" "}
                  <span className='font-bold'>
                    {data.propertyUsage || "Commercial"}
                  </span>{" "}
                  /Residential/ Industrial /Land/ VACANT
                </td>
                <td>As per document</td>
                <td colSpan='4'>COMMERCIAL</td>
              </tr>
              <tr>
                <td colSpan='4'>9. Occupancy</td>
                <td colSpan='8'>
                  <span className='font-bold'>
                    {data.occupancy || "Self-Occupied"}
                  </span>{" "}
                  /Rented/Vacant /Multiusage
                </td>
              </tr>
              <tr>
                <td colSpan='4'>10. Marketability</td>
                <td colSpan='8'>Very Good / Good / Low</td>
              </tr>
              <tr>
                <td colSpan='4'>11. Habitation</td>
                <td colSpan='8'>
                  Less than 30% <br />
                  <span className='font-bold'>
                    {data.habitation || "Greater than 30% & less than 50%"}
                    <br />
                  </span>
                  Greater than 65%
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  B. SURROUNDING LOCALITY DETAILS
                </td>
              </tr>
              <tr>
                <td colSpan='4'>1. Ward No/ Municipal land No</td>
                <td colSpan='8'>{data.wardNo || "WARD NO. 26"}</td>
              </tr>
              <tr>
                <td colSpan='4'>2. Type of locality</td>
                <td colSpan='8'>
                  {data.typeOfLocality ||
                    "Residential/Commercial/Industrial/Chawl/Village/Slum"}
                </td>
              </tr>
              <tr>
                <td colSpan='4' rowSpan='2'>
                  3. Distance From City Centre
                </td>
                <td colSpan='3'>Approx (KMs)</td>
                <td>BUS STOP</td>
                <td colSpan='2'>HOSPITAL</td>
                <td colSpan='2'>RAILWAY STATION</td>
              </tr>
              <tr>
                <td colSpan='3'>{data.distanceFromCityCentre || "14 KM"}</td>
                <td>03 KM</td>
                <td colSpan='2'>2-3 KM</td>
                <td colSpan='2'>16 KM</td>
              </tr>
              <tr>
                <td colSpan='4'>4. Site Access</td>
                <td colSpan='8'>{data.siteAccess || "CLEAR"}</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  5. Approving Authority:
                </td>
              </tr>
              <tr>
                <td colSpan='4'>Corporation Limit</td>
                <td colSpan='3'>{data.corporationLimit || "18-20 KM"}</td>
                <td colSpan='2'>Municipality / DA</td>
                <td colSpan='3'>NAGAR NIGAM</td>
              </tr>
              <tr>
                <td colSpan='4'>Panchayat Union</td>
                <td colSpan='3'>{data.panchayatUnion || "NA"}</td>
                <td colSpan='2'>Any other specify</td>
                <td colSpan='3'>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan='4'>6. Conditions of Approach Road</td>
                <td colSpan='3'>
                  {data.conditionsOfApproachRoad || "Good/Bad"}
                </td>
                <td colSpan='2'>ROAD WIDTH</td>
                <td colSpan='3'>MORE THAN 10 FT</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  C. PROPERTY DETAILS (Proposed)
                </td>
              </tr>
              <tr>
                <td colSpan='4'>1. No of Floors</td>
                <td colSpan='8'>{data.noOfFloors || "B+G+2"}</td>
              </tr>
              <tr>
                <td colSpan='4'>2. Floor Wise Usage</td>
                <td colSpan='8'>
                  {data.floorWiseUsage || "FIRST FLOOR- 1 SHOP (OWNER)"}
                </td>
              </tr>
              <tr>
                <td colSpan='4'>3. Age of the property</td>
                <td colSpan='3'>{data.ageOfTheProperty || "3"}</td>
                <td colSpan='2'>Residual age</td>
                <td colSpan='3'>57</td>
              </tr>
              <tr>
                <td colSpan='12'>&nbsp;</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  4. SIDE BOUNDARIES
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='2'>
                  DIRECTION
                </td>
                <td className='font-bold' colSpan='4'>
                  As per Ownership Document
                </td>
                <td className='font-bold' colSpan='3'>
                  As per site
                </td>
                <td className='font-bold' colSpan='3'>
                  As per plan
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='2'>
                  EAST
                </td>
                <td colSpan='4'>{data.east || "SHOP NO. 03-A"}</td>
                <td colSpan='3'>SHOP NO. 03-A</td>
                <td colSpan='3'>&nbsp;</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='2'>
                  WEST
                </td>
                <td colSpan='4'>{data.west || "COORIDOR"}</td>
                <td colSpan='3'>COORIDOR</td>
                <td colSpan='3'>&nbsp;</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='2'>
                  NORTH
                </td>
                <td colSpan='4'>{data.north || "COORIDOR"}</td>
                <td colSpan='3'>COORIDOR</td>
                <td colSpan='3'>&nbsp;</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='2'>
                  SOUTH
                </td>
                <td colSpan='4'>{data.south || "SHOP NO. 05"}</td>
                <td colSpan='3'>SHOP NO. 05</td>
                <td colSpan='3'>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan='4'>5. Boundaries are matching </td>
                <td colSpan='8'>{data.boundariesMatching || "Yes / No"}</td>
              </tr>
              <tr>
                <td colSpan='4'>6. Property Identified through</td>
                <td colSpan='8'>{data.propertyIdentified || "SALE DEED"}</td>
              </tr>
              <tr>
                <td colSpan='4'>7. Plot Demarcated at site</td>
                <td colSpan='8'>{data.plotDemarcated || "Yes / No"}</td>
              </tr>
              <tr>
                <td colSpan='4'>8. Amenities</td>
                <td colSpan='8'>
                  Playground/ Swimming pool/Sports club/GYM/Temple/School
                </td>
              </tr>
              <tr>
                <td colSpan='4' rowSpan='5'>
                  9. Land / Plot Area (Doc)
                </td>
                <td colSpan='2' rowSpan='5'>
                  {data.landPlotAreaDoc || "300 Sq Ft"}
                </td>
                <td colSpan='2' rowSpan='2'>
                  DIMENSION (IN FT):{" "}
                </td>
                <td>E</td>
                <td align='right'>{data.dimensionE || "0"}</td>
                <td>W</td>
                <td align='right'>{data.dimensionW || "0"}</td>
              </tr>
              <tr>
                <td>N</td>
                <td align='right'>{data.dimensionN || "0"}</td>
                <td>S</td>
                <td align='right'>{data.dimensionS || "0"}</td>
              </tr>
              <tr>
                <td colSpan='3'>TOTAL PLOT AREA (IN SQFT)</td>
                <td colSpan='3'>{data.totalPlotArea || "0"}</td>
              </tr>
              <tr>
                <td colSpan='3'>REDUCTION AREA (IN SQFT)</td>
                <td colSpan='3'>{data.reductionArea || "0"}</td>
              </tr>
              <tr>
                <td colSpan='3'>TOTAL AREA (IN SQFT)</td>
                <td colSpan='3'>{data.totalArea || "0"}</td>
              </tr>
              <tr>
                <td colSpan='4'> Land / Plot Area (Plan) IN SQFT</td>
                <td colSpan='2'>{data.landPlotAreaPlan || ""}</td>
                <td colSpan='6'>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan='4'>Land / Plot Area (Site) IN SQFT</td>
                <td colSpan='2'>{data.landPlotAreaSite || ""}</td>
                <td colSpan='6'>0</td>
              </tr>
              <tr>
                <td colSpan='4'>Built up Area (As per Plan) IN SQFT</td>
                <td colSpan='2'>{data.builtUpAreaPlan || ""}</td>
                <td colSpan='6'>0</td>
              </tr>
              <tr>
                <td colSpan='4'>Built up area (Actual) IN SQFT</td>
                <td colSpan='2'>{data.builtUpAreaActual || "300"}</td>
                <td colSpan='6'>0</td>
              </tr>
              <tr>
                <td colSpan='4' rowSpan='2'>
                  &nbsp;
                </td>
                <td className='font-bold' colSpan='2'>
                  Floor details
                </td>
                <td className='font-bold' colSpan='3'>
                  Property type
                </td>
                <td className='font-bold' colSpan='3'>
                  Occupancy Status
                </td>
              </tr>
              <tr>
                <td colSpan='2'>FIRST FLOOR</td>
                <td colSpan='3'>COMMERCIAL SHOP</td>
                <td colSpan='3'>OCCUPIED/VACANT </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  D. STRUCTURAL DETAILS
                </td>
              </tr>
              <tr>
                <td colSpan='4'>1. Type of Structure</td>
                <td colSpan='2'>
                  {data.typeOfStructure ||
                    "RCC /Load Bearing/Stone Slab/Tin Sheet/Temporary"}
                </td>
                <td className='font-bold' colSpan='3'>
                  AT FIRST FLOOR
                </td>
                <td colSpan='3'>OCCPIED</td>
              </tr>
              <tr>
                <td colSpan='4'>2. No of wings</td>
                <td colSpan='8'>{data.noOfWings || "NA"}</td>
              </tr>
              <tr>
                <td colSpan='4'>3. No. of Units on each floor</td>
                <td colSpan='8'>{data.noOfUnitsPerFloor || "NA"}</td>
              </tr>
              <tr>
                <td colSpan='4'>4. Quality of construction</td>
                <td colSpan='8'>{data.qualityOfConstruction || "GOOD"}</td>
              </tr>
              <tr>
                <td colSpan='4'>5. Structural Observation</td>
                <td colSpan='8'>{data.structuralObservation || "YES / No"}</td>
              </tr>
              <tr>
                <td colSpan='4'>6. Configuration</td>
                <td colSpan='8'>{data.configuration || "F.F.- 1 SHOP"}</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  E. INTERIORS
                </td>
              </tr>
              <tr>
                <td colSpan='4'>1. Flooring &amp; finishing.</td>
                <td colSpan='8'>{data.flooringFinishing || "GOOD"}</td>
              </tr>
              <tr>
                <td colSpan='4'>2. Roofing and terracing</td>
                <td colSpan='8'>{data.roofingTerracing || "GOOD"}</td>
              </tr>
              <tr>
                <td colSpan='4'>3. Quality of fixtures &amp; Settings</td>
                <td colSpan='8'>{data.qualityFixturesSettings || "GOOD"}</td>
              </tr>
              <tr>
                <td colSpan='4'>4. Doors &amp; Windows</td>
                <td colSpan='8'>{data.doorsWindows || "YES"}</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  F. PLAN APPROVAL DETAILS
                </td>
              </tr>
              <tr>
                <td colSpan='4'>
                  1. Construction as per approved
                  <br />
                  /Sanctioned plans
                  <br />
                </td>
                <td colSpan='8'>
                  {data.constructionAsPerApproved || "Yes / No"}
                </td>
              </tr>
              <tr>
                <td colSpan='4'>
                  2. Details of approved plan with approval no &amp; date
                </td>
                <td colSpan='8'>{data.approvedPlanDetails || "NOT OBTAIN"}</td>
              </tr>
              <tr>
                <td colSpan='4'>3. Construction permission Number and date.</td>
                <td colSpan='8'>
                  {data.constructionPermission || "NOT OBTAIN"}
                </td>
              </tr>
              <tr>
                <td colSpan='4'>
                  4. Violations Observed if Any or is there any risk of
                  Demolition in case of Violation
                </td>
                <td colSpan='8'>
                  {data.violationsObserved || "LOW/MEDIUM/HIGH"}
                </td>
              </tr>
              <tr>
                <td colSpan='4'>
                  5. If plans not available, then is the structure confirming to
                  the local
                </td>
                <td colSpan='8'>
                  {data.structureConfirmingLocal || "Yes / No"}
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  G. DEVIATION DETAILS
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='4'>
                  FLOOR DETAILS
                </td>
                <td className='font-bold' colSpan='5'>
                  Deviation in Sqft
                </td>
                <td className='font-bold' colSpan='3'>
                  Deviation in %
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='4'>
                  Floor
                </td>
                <td colSpan='3'>
                  {data.asPerApprovalPlan || "AS PER APPROVAL PLAN"}
                </td>
                <td className='font-bold' colSpan='2'>
                  {data.deviationAtSite || "AT SITE"}
                </td>
                <td className='font-bold' colSpan='3'>
                  {data.deviationPercentage || "AT SITE"}
                </td>
              </tr>
              <tr>
                <td colSpan='4'>G+3</td>
                <td className='font-bold' colSpan='3'>
                  NA
                </td>
                <td className='font-bold' colSpan='2'>
                  NA
                </td>
                <td className='font-bold' colSpan='3'>
                  NA
                </td>
              </tr>
              <tr>
                <td colSpan='12'>&nbsp;</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  H. Self Construction case
                </td>
              </tr>
              <tr>
                <td colSpan='3'>
                  Architect certified estimate available or not
                </td>
                <td colSpan='9'>
                  {data.architectCertifiedEstimate || "NOT OBTAIN"}
                </td>
              </tr>
              <tr>
                <td colSpan='3'>Construction Amount certified</td>
                <td colSpan='9'>
                  {data.constructionAmountCertified || "NOT OBTAIN"}
                </td>
              </tr>
              <tr>
                <td colSpan='3'>Others</td>
                <td colSpan='9'>NA</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  I. FAIR MARKET VALUE
                </td>
              </tr>
              <tr>
                <td colSpan='4'>1. Valuation Methodology</td>
                <td colSpan='8'>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan='4' rowSpan='8'>
                  Final Area in SQFT Considered for Valuation
                </td>
                <td colSpan='3'>&nbsp;</td>
                <td colSpan='2'>&nbsp;</td>
                <td colSpan='3'>&nbsp;</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='3'>
                  Floor
                </td>
                <td className='font-bold' colSpan='2'>
                  As Per Actual
                </td>
                <td className='font-bold' colSpan='3'>
                  As Per Plan
                </td>
              </tr>
              <tr>
                <td colSpan='3'>GROUND FLOOR</td>
                <td className='font-bold' colSpan='2'>
                  0
                </td>
                <td className='font-bold' colSpan='3'>
                  0
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='3'>
                  FIRST FLOOR
                </td>
                <td className='font-bold' colSpan='2'>
                  {data?.fairMarketValueActual || "300"}
                </td>
                <td colSpan='3'>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan='3'>SECOND FLOOR</td>
                <td className='font-bold' colSpan='2'>
                  0
                </td>
                <td colSpan='3'>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan='3'>THIRD FLOOR</td>
                <td className='font-bold' colSpan='2'>
                  0
                </td>
                <td colSpan='3'>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan='3'>FOURTH FLOOR</td>
                <td className='font-bold' colSpan='2'>
                  0
                </td>
                <td colSpan='3'>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan='3'>TOTAL</td>
                <td className='font-bold' colSpan='2'>
                  300
                </td>
                <td className='font-bold' colSpan='3'>
                  0
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='4'>
                  Land Area (IN SQFT)
                </td>
                <td className='font-bold' colSpan='2'>
                  {data.landArea || "0"}
                </td>
                <td className='font-bold' colSpan='2'>
                  RATE (IN RS. )
                </td>
                <td className='font-bold' colSpan='4'>
                  {data.rate || "0"}
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='4'>
                  2. LAND VALUE (IN RS.)
                </td>
                <td className='font-bold' colSpan='8'>
                  {data.landValue || "0"}
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  As per Actual/FSI/Plan
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='2'>
                  Particulars
                </td>
                <td className='font-bold' colSpan='2'>
                  BUA/ SBUA (IN SQFT)
                </td>
                <td className='font-bold' colSpan='2'>
                  Rate per unit
                </td>
                <td className='font-bold'>Replacement cost (IN RS.)</td>
                <td className='font-bold'>
                  Depreciation %<br />
                  (PER ANNUM)
                </td>
                <td className='font-bold' colSpan='2'>
                  Less Depreciation (IN RS.)
                </td>
                <td className='font-bold' colSpan='2'>
                  Net Depreciated Value (IN RS.)
                </td>
              </tr>
              <tr>
                <td colSpan='2'>GROUND FLOOR</td>
                <td colSpan='2'>0</td>
                <td colSpan='2'>0</td>
                <td>0</td>
                <td>0</td>
                <td colSpan='2'>0</td>
                <td colSpan='2'>0</td>
              </tr>
              <tr>
                <td colSpan='2'>FIRST FLOOR</td>
                <td colSpan='2'>{data.bua || "300"}</td>
                <td colSpan='2'>{data.ratePerUnit || "15000"}</td>
                <td>{data.replacementCost || "4500000"}</td>
                <td>{data.depreciation || "0"}</td>
                <td colSpan='2'>{data.lessDepreciation || "4500000"}</td>
                <td colSpan='2'>{data.netDepreciatedValue || "0"}</td>
              </tr>
              <tr>
                <td colSpan='2'>SECOND FLOOR</td>
                <td colSpan='2'>0</td>
                <td colSpan='2'>0</td>
                <td>0</td>
                <td>0</td>
                <td colSpan='2'>0</td>
                <td colSpan='2'>0</td>
              </tr>
              <tr>
                <td colSpan='2'>THIRD FLOOR</td>
                <td colSpan='2'>0</td>
                <td colSpan='2'>0</td>
                <td>0</td>
                <td>0</td>
                <td colSpan='2'>0</td>
                <td colSpan='2'>0</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='8'>
                  BUILDING VALUE
                </td>
                <td colSpan='4'>{data.buildingValue || "4500000"}</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='8'>
                  Amenities
                </td>
                <td colSpan='4'>{data.amenities || "0"}</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='8'>
                  Total Building Value
                </td>
                <td colSpan='4'>{data.totalBuildingValue || "4500000"}</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='6'>
                  Total Value of Property as per Actual
                </td>
                <td className='font-bold' colSpan='6'>
                  {data.totalValueOfProperty || "4500000"}
                </td>
              </tr>
              <tr>
                <td colSpan='6'>&nbsp;</td>
                <td colSpan='6'>&nbsp;</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='6'>
                  Market Value of Property as per Actual in Words:{" "}
                </td>
                <td className='font-bold' colSpan='6'>
                  RS. FOURTY FIVE LAKH ONLY
                </td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='6'>
                  Realizable Sale Value (90% of total value)
                </td>
                <td colSpan='6'>4050000</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='6'>
                  Distressed Value (80% OF TOTAL VALUE)
                </td>
                <td colSpan='6'>3600000</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='4'>
                  Govt. Guideline value{" "}
                </td>
                <td colSpan='2'>RS. PER SQFT</td>
                <td>2936</td>
                <td colSpan='2'>(LAND VALUE) - Rs.</td>
                <td colSpan='3'>{data.totalGovtValue || "880800"}</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='12'>
                  3. FLOORWISE DETAILS OF USAGE AND RENTAL VALUE
                </td>
              </tr>
              <tr>
                <td>FLOOR</td>
                <td>USAGE</td>
                <td colSpan='2'>UNIT</td>
                <td colSpan='2'>VALUE</td>
                <td className='font-bold' colSpan='3'>
                  If Tenanted, Year of Current Tenancy
                </td>
                <td className='font-bold' colSpan='3'>
                  Rental Assessment
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td colSpan='2'>&nbsp;</td>
                <td colSpan='2'>&nbsp;</td>
                <td colSpan='3'>&nbsp;</td>
                <td colSpan='3'>&nbsp;</td>
              </tr>
              <tr>
                <td className='font-bold' colSpan='4' rowSpan='2'>
                  4. Stage of Construction{" "}
                </td>
                <td className='font-bold' colSpan='3'>
                  PROGRESS (%)
                </td>
                <td className='font-bold' colSpan='5'>
                  RECOMMENDED (%)
                </td>
              </tr>
              <tr>
                <td colSpan='3'>100%</td>
                <td colSpan='5'>100%</td>
              </tr>
              <tr>
                <td colSpan='4'>Demolition Risk </td>
                <td colSpan='8'>
                  {data.riskAssessment || "High / Medium / low"}
                </td>
              </tr>
              <tr>
                <td colSpan='4'>
                  Risk regarding seismic zone, cyclone area, flood area, land
                  slide
                </td>
                <td colSpan='8'>High / Medium / low</td>
              </tr>

              <td colSpan='12'>REMARKS :-</td>

              <td id='catching' colSpan='12' rowSpan='2'>
                {data.remarks ||
                  `1. GIVEN XEROX COPY OF SALE DEED IN FAVOUR OF AKSH BADAL S/O SHRI KAVINDRA KUMAR BADAL. <br />
                2. DURING PROPERTY VISIT MR. AKSH BADAL JI WAS MET AT THE PROPERTY HE IS CUSTOMER CONT NO. - 9685309257. IT WAS CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.<br />
                3. RATE HAS BEEN CONFIRM FORM MARKET ENQUIRY.<br />
                4. PROPERTY IS SITUATED AT SURROUNDING AREA OF LOCALITY IS RESI CUM COMMERCIAL ZONING.<br />
                5. AT SITE PROPERTY IS COMMERCIAL SHOP SITUATED AT FIRST FLOOR OF BUILDING KNOWN AS KRISHNA COMPLEX AND MORTGAGING PROPERTY IS OCCUPIED BY CUSTOMER.<br />
                6. PROPERTY IS IDENTIFIED BY FOUR SIDE BOUNDARIES OF GIVEN DEED AND LOCAL ENQUIRY.<br />
                7. BUILDING PERMISSION `}
              </td>
              <tr>
                <td id='catching' colSpan='12' rowSpan='2'>
                  1. GIVEN XEROX COPY OF SALE DEED IN FAVOUR OF AKSH BADAL S/O
                  SHRI KAVINDRA KUMAR BADAL. <br />
                  2. DURING PROPERTY VISIT MR. AKSH BADAL JI WAS MET AT THE
                  PROPERTY HE IS CUSTOMER CONT NO. - 9685309257. IT WAS CLEARLY
                  EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE FOR
                  VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.
                  <br />
                  3. RATE HAS BEEN CONFIRM FORM MARKET ENQUIRY.
                  <br />
                  4. PROPERTY IS SITUATED AT SURROUNDING AREA OF LOCALITY IS
                  RESI CUM COMMERCIAL ZONING.
                  <br />
                  5. AT SITE PROPERTY IS COMMERCIAL SHOP SITUATED AT FIRST FLOOR
                  OF BUILDING KNOWN AS KRISHNA COMPLEX AND MORTGAGING PROPERTY
                  IS OCCUPIED BY CUSTOMER.
                  <br />
                  6. PROPERTY IS IDENTIFIED BY FOUR SIDE BOUNDARIES OF GIVEN
                  DEED AND LOCAL ENQUIRY.
                  <br />
                  7. BUILDING PERMISSION AND MAP IS NOT OBTAIN, ONLY FLOOR PLAN
                  RECIEVE.
                  <br />
                  8. T&amp;CP LAYOUT PLAN IS NOT OBTAIN.
                  <br />
                  9. BUILDING PRAKOSTH RECIEVE AS PER PRAKOSTH SHOP NO. 03 AREA
                  IS 472 SQFT, BUT AS PER DEED AND ACTUAL AT SITE BUILT UP AREA
                  IS 300 SQFT, WE HAVE CONSIDER BUILT UP AREA AS PER DEED.
                  <br />
                  10. UNIT VALUE OF PROPERTY IS CONSIDER IN THIS REPORT.
                  <br />
                  11. SUGGEST TO CREDIT TEAM TO BE CHECK PROPER OWNERSHIP
                  DOCUMENT PRIOR DISBURSEMENT.
                  <br />
                  12. VALUER IS NOT RESPONSIBLE FOR ANY LEGAL DISPUTE.
                  <br />
                </td>
              </tr>
              <tr></tr>
              <tr>
                <td colSpan='12'>APPLICANT NAME</td>
              </tr>
              <tr>
                <td colSpan='12' rowSpan='2'>
                  • WE HAVE NO DIRECT/INDIRECT INTEREST IN THE PROPERTY VALUED.
                  <br />
                  • THE INFORMATION FURNISHED IN THE REPORT IS TRUE AND CORRECT
                  TO THE BEST OF MY KNOWLEDGE. <br />
                  <br />
                </td>
              </tr>
              <tr></tr>
              <tr>
                <td colSpan='12'>FOR SEAL WITH SIGNATURE</td>
              </tr>
              <tr>
                <td>DATE</td>
                <td colSpan='2'>16.05.2023</td>
                <td colSpan='9'>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan='12'>SITE IMAGES</td>
              </tr>
              <tr>
                <td colSpan='2'>{data.nameOfApplicant}</td>
                <td colSpan='5'>AB COLLECTION</td>
                <td>Lead Id:-</td>
                <td colSpan='4'> A068301-LAP</td>
              </tr>
              <tr>
                <td colSpan='12'>&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProtiumDeatil;
