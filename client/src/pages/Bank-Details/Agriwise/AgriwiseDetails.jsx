import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const data = {
  valuationAgency: "Agriwise Valuers Pvt Ltd",
  dateOfValuation: "2025-05-10",
  proposalNo: "AWP123456",
  caseType: "Fresh",
  inspectionDate: "2025-05-08",
  nearestLandmark: "City Mall",
  customerName: "Ravi Sharma",
  sellerName: "Anil Verma",
  propertyAddress: "123, Green Residency, Sector 45, Gurgaon",
  propertyStatus: "Under Construction",
  propertyType: "Residential",
  developedBy: "ABC Developers",
  typeOfLocality: "Urban",
  inspectionSiteVisitDate: "2025-05-08",
  occupationStatus: "Vacant",
  propertyUsage: "Self Use",
  plotDemarcation: "Properly Fenced",
  propertyIdentifiable: "Yes",
  withinMC_GPLimit: "Yes",
  typeOfStructure: "RCC Frame",
  floorsInBuilding: "5",
  locatedOnFloorNo: "3",
  yearOfCompletion: "2024",
  constructionStage: "Plaster Work",
  disbursementRecommended: "Yes",
  ageOfProperty: "1",
  futurePhysicalLife: "60",
  saleDeed: "Available",
  statusOfLandHolding: "Freehold",
  typeOfProperty: "Flat",
  occupationStatusInspection: "Vacant",
  propertyUsageInspection: "Residential",
  plotDemarcationInspection: "Proper Boundary Wall",
  identifiedThrough: "Physical Inspection",
  internalFinishing: "Standard",
  noOfFloorsInBuildingInspection: "5",
  totalNoOfFlatsUnitInBuilding: "20",
  constructionStageOfPropertyInspection: "Plaster Work",
  ageOfThePropertyInYearInspection: "1",
  futurePhysicalLifeOfPropertyInYearInspection: "60",
  boundaries: {
    east: "Park",
    west: "Main Road",
    north: "Neighboring Flat",
    south: "Open Land",
  },
  boundariesMatching: "Yes",
};

export const AgriwiseDetails = () => {
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

      pdf.save("Agriwise_Finance_Report.pdf");
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
    saveAs(blob, "Agriwise_Finance_Report.xlsx");
  };

  const handleExportCSV = () => {
    const table = document.getElementById("reportTable");
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Agriwise_Finance_Report.csv");
  };

  return (
    <div className='p-4'>
      <div className='mb-4 text-right'>
        <button
          onClick={handleExportPDF}
          className='mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Download PDF
        </button>
        <button
          onClick={handleExportExcel}
          className='mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
        >
          Download Excel
        </button>
        <button
          onClick={handleExportCSV}
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
        >
          Download CSV
        </button>
      </div>

      <div className='valuation-report'>
        <table id='reportTable' className='table-auto w-full'>
          <colgroup>
            <col className='w-1/12' />
            <col className='w-1/12' />
            <col className='w-1/12' />
            <col className='w-1/12' />
            <col className='w-1/12' />
            <col className='w-1/12' />
            <col className='w-1/12' />
            <col className='w-1/12' />
            <col className='w-1/12' />
            <col className='w-1/12' />
            <col className='w-1/12' />
            <col className='w-1/12' />
          </colgroup>
          <tbody>
            <tr>
              <td colSpan='12' className='text-center font-bold text-lg'>
                AGRIWISE FINANCE LIMITED
              </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>Name of Valuation Agency</td>
              <td colSpan='3'>{data.valuationAgency}</td>
              <td colSpan='3'>Date of Valuation</td>
              <td colSpan='2'>{data.dateOfValuation}</td>
            </tr>
            <tr>
              <td>A.</td>
              <td className='font-bold' colSpan='11'>
                Technical Initiation Request Form Data
              </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>Proposal No</td>
              <td colSpan='3'>{data.proposalNo}</td>
              <td colSpan='2'>Case Type</td>
              <td colSpan='3'>{data.caseType}</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>Date of Inspection / Site visit</td>
              <td colSpan='3'>{data.inspectionDate}</td>
              <td colSpan='2'>Nearest Landmark</td>
              <td colSpan='3'>{data.nearestLandmark}</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='5'>
                Name of the Customer/ Applicant & Contact Details
              </td>
              <td className='font-bold' colSpan='6'>
                {data.customerName}
              </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='5'>Name of Current Owner / Seller</td>
              <td colSpan='6'>{data.sellerName}</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='4' rowSpan='3'>
                Address of the property being appraised
              </td>
              <td>(As per TRF)</td>
              <td colSpan='6'>{data.propertyAddress}</td>
            </tr>
            <tr>
              <td></td>
              <td>As per Document</td>
              <td colSpan='6'>{data.propertyAddress}</td>
            </tr>
            <tr>
              <td></td>
              <td>As per Actual at site</td>
              <td colSpan='6'>{data.propertyAddress}</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='5'>Documents Provided by SFL</td>
              <td colSpan='6'>{data.saleDeed}</td>
            </tr>
            <tr>
              <td>B.</td>
              <td className='font-bold' colSpan='11'>
                Locational & Property Specific Details (based on site visit)
              </td>
            </tr>
            <tr>
              <td rowSpan='11'></td>
              <td colSpan='3'>Status of Land Holding</td>
              <td colSpan='2'>{data.statusOfLandHolding}</td>
              <td colSpan='2'>Developed By</td>
              <td colSpan='4'>{data.developedBy}</td>
            </tr>
            <tr>
              <td colSpan='3'>Type of Property</td>
              <td colSpan='2'>{data.typeOfProperty}</td>
              <td colSpan='2'>Type of Locality</td>
              <td colSpan='4'>{data.typeOfLocality}</td>
            </tr>
            <tr>
              <td colSpan='3'>Date of Inspection / Site visit</td>
              <td colSpan='2'>{data.inspectionSiteVisitDate}</td>
              <td colSpan='2'>Occupation Status</td>
              <td colSpan='4'>{data.occupationStatus}</td>
            </tr>
            <tr>
              <td colSpan='3'>Location/Zoning as per Master Plan</td>
              <td colSpan='2'>NA</td>
              <td colSpan='2'>Property Usage</td>
              <td colSpan='4'>{data.propertyUsage}</td>
            </tr>
            <tr>
              <td colSpan='3'>Plot Demarcation</td>
              <td colSpan='2'>{data.plotDemarcation}</td>
              <td colSpan='2'>Property Identifiable</td>
              <td colSpan='4'>{data.propertyIdentifiable}</td>
            </tr>
            <tr>
              <td colSpan='3'>Identified Through</td>
              <td colSpan='2'>{data.identifiedThrough}</td>
              <td colSpan='2'>Within MC / GP Limit</td>
              <td colSpan='4'>{data.withinMC_GPLimit}</td>
            </tr>
            <tr>
              <td colSpan='3'>Internal Finishing</td>
              <td colSpan='2'>{data.internalFinishing}</td>
              <td colSpan='2'>Type of Structure </td>

              <td colSpan='4'>{data.typeOfStructure}</td>
            </tr>
            <tr>
              <td colSpan='3'>No. of Floors in the building</td>
              <td colSpan='2'>{data.floorsInBuilding}</td>
              <td colSpan='2'>Located on Floor No.</td>
              <td colSpan='4'>{data.locatedOnFloorNo}</td>
            </tr>
            <tr>
              <td colSpan='3'>Total No. of Flats / Unit in building</td>
              <td colSpan='2'>{data.totalNoOfFlatsUnitInBuilding}</td>
              <td colSpan='2'>Year of Completion of Property</td>
              <td colSpan='4'>{data.yearOfCompletion}</td>
            </tr>
            <tr>
              <td colSpan='3'>Construction Stage of the Property (in %)</td>
              <td colSpan='2'>{data.constructionStage}</td>
              <td colSpan='2'>Disbursement Recommended (in %)</td>
              <td colSpan='4'>{data.disbursementRecommended}</td>
            </tr>
            <tr>
              <td colSpan='3'>Age of the Property In Year</td>
              <td colSpan='2'>{data.ageOfProperty}</td>
              <td colSpan='2'>Future Physical Life of Property in Year</td>
              <td colSpan='4'>{data.futurePhysicalLife}</td>
            </tr>
            <tr>
              <td>C.</td>
              <td className='font-bold' colSpan='11'>
                Boundaries
              </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>DIRECTIONS</td>
              <td colSpan='2'>EAST</td>
              <td>WEST</td>
              <td colSpan='2'>NORTH</td>
              <td colSpan='3'>SOUTH</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>As per Documents</td>
              <td colSpan='2'>{data.boundaries.east}</td>
              <td>{data.boundaries.west}</td>
              <td colSpan='2'>{data.boundaries.north}</td>
              <td colSpan='3'>{data.boundaries.south}</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>Boundaries Matching</td>
              <td colSpan='11'>{data.boundariesMatching}</td>
            </tr>
            <tr>
              <td>D.</td>
              <td className='font-bold' colSpan='11'>
                Setbacks / Margin
              </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>Setbacks / Margin in the Building (in Ft)</td>
              <td colSpan='2'>Front</td>
              <td>Rear</td>
              <td colSpan='2'>Left Side</td>
              <td colSpan='3'>Right Side</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>As per sanctioned/ permissible byelaws</td>
              <td colSpan='2'>NA</td>
              <td>NA</td>
              <td colSpan='2'>NA</td>
              <td colSpan='3'>NA</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>As per Site / Actual</td>
              <td colSpan='2'>NA</td>
              <td>NA</td>
              <td colSpan='2'>NA</td>
              <td colSpan='3'>NA</td>
            </tr>
            <tr>
              <td>E.</td>
              <td className='font-bold' colSpan='11'>
                Height/Stories
              </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='6'>As per sanctioned/ permissible bye laws</td>
              <td colSpan='5'>NA</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='6'>As per Site / Actual</td>
              <td colSpan='5'>NA</td>
            </tr>
            <tr>
              <td>F.</td>
              <td className='font-bold' colSpan='11'>
                Built-up Area & Accommodation Details
              </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>Floor (Pl mention floor wise)</td>
              <td colSpan='2'>Accommodation</td>
              <td>Carpet Area (Sft)</td>
              <td>Actual SBUA (Sft)</td>
              <td>Permissible BUA (Sft)</td>
              <td colSpan='3'>Adopted Built-up area (Sft)</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>Ground Floor</td>
              <td colSpan='2'>4SHOP +3H+1k</td>
              <td>1300</td>
              <td>2000</td>
              <td>1500</td>
              <td colSpan='3'>1500</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>First Floor</td>
              <td colSpan='2'>4SHOP +4R+1K+1LB</td>
              <td>1300</td>
              <td>2000</td>
              <td>1500</td>
              <td colSpan='3'>1500</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>Total</td>
              <td colSpan='2'></td>
              <td>2600</td>
              <td>4000</td>
              <td>3000</td>
              <td colSpan='3'>3000</td>
            </tr>
            <tr>
              <td>G.</td>
              <td className='font-bold' colSpan='11'>
                Plan Approvals
              </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='5'>
                Construction as per approved/ sanctioned plans
              </td>
              <td>NA</td>
              <td colSpan='3'>
                Details of approved plan with approval no and date
              </td>
              <td colSpan='2'>NA</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='5'>Construction permission Number and date</td>
              <td>NA</td>
              <td colSpan='3'>Violations Observed if Any</td>
              <td colSpan='2'>NA</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='7'>
                If plans not available then is the structure confirming to the
                local byelaws.
              </td>
              <td colSpan='4'>NA</td>
            </tr>
            <tr>
              <td>H.</td>
              <td className='font-bold' colSpan='11'>
                Estimate Analysis (Applicable only in Self Construction cases)
              </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='5'>Estimated Cost (In Rs)</td>
              <td>NA</td>
              <td colSpan='3'>Estimated Cost (in Rs per Sqft)</td>
              <td colSpan='2'>NA</td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='5'>Justified Estimated Cost (in Rs per Sqft)</td>
              <td>NA</td>
              <td colSpan='3'>Adoptable / Justified Estimated Cost (In Rs)</td>
              <td colSpan='2'>NA</td>
            </tr>
            <tr>
              <td>I.</td>
              <td className='font-bold' colSpan='11'>
                Valuation of Property (Fair Market Valuation / Distress
                Valuation)
              </td>
            </tr>
            <tr>
              <td rowSpan='10'></td>
              <td colSpan='4'>Land Area (In Sqft)</td>
              <td>2000</td>
              <td colSpan='3'>Adoptable Built-up Area (in Sqft) FOR RCC</td>
              <td colSpan='2'>3000</td>
              <td>SQFT</td>
            </tr>
            <tr>
              <td colSpan='4'>
                Current Market Rate of land in the locality (Range) in Rs Per
                Sqft
              </td>
              <td>0</td>
              <td colSpan='3'>Construction Cost (Rs per sft)</td>
              <td colSpan='2'>0</td>
              <td>SQFT</td>
            </tr>
            <tr>
              <td colSpan='4'>Recommended Rate of Land (Rs per sqft)</td>
              <td>0</td>
              <td colSpan='3'>
                Total Construction Value for 100% complete building (in Rs)
              </td>
              <td colSpan='3'>0</td>
            </tr>
            <tr>
              <td colSpan='4'>Total Land Value (in Rs)</td>
              <td>0</td>
              <td colSpan='3'>
                Total Construction Value for present construction stage (in Rs)
              </td>
              <td colSpan='3'>0</td>
            </tr>
            <tr>
              <td colSpan='4'>
                Market Value of Land & Building for 100% complete property (in
                Rs)
              </td>
              <td>0</td>
              <td colSpan='3'>
                Market Value of Land & Building for present completed property
                (in Rs)
              </td>
              <td colSpan='3'>0</td>
            </tr>
            <tr>
              <td colSpan='4'>
                Distress Value of 100% complete property @ 60% of MV
              </td>
              <td>0</td>
              <td colSpan='3'>
                Distress Value of present completed property @ 50% of MV (As on
                date) (in Rs)
              </td>
              <td colSpan='3'>0</td>
            </tr>
            <tr>
              <td colSpan='4'>
                Flat / Apartment / Shop / Office BUA (in Sqft)
              </td>
              <td></td>
              <td colSpan='3'>Composite sale rate (Rs per sqft)</td>
              <td colSpan='3'></td>
            </tr>
            <tr>
              <td colSpan='7'>
                Total Market Value of Apartment / Shop / Flat / Office (Rs per
                sqft)
              </td>
              <td colSpan='4'>0</td>
            </tr>
            <tr>
              <td colSpan='4'>
                Government Guideline/ Circle rate for Land (Rs per sqft)
              </td>
              <td>0</td>
              <td colSpan='3'>Land Value as per Government Rate (Rs)</td>
              <td colSpan='3'>0</td>
            </tr>
            <tr>
              <td colSpan='4'>
                Government Guideline/ Circle rate for Flats (Rs per sqft)
              </td>
              <td>0</td>
              <td colSpan='3'>
                Flat / Apartment Value as per Government Rate (Rs)
              </td>
              <td colSpan='3'>0</td>
            </tr>
            <tr>
              <td>J.</td>
              <td className='font-bold' colSpan='11'>
                Property Specific Remarks & Observation
              </td>
            </tr>
            <tr>
              <td rowSpan='3'></td>
              <td colSpan='2' rowSpan='3'>
                REMARKS/ OBSERVATION
              </td>
              <td colSpan='9' rowSpan='3'>
                1. GIVEN XEROX COPY OF SALE DEED IS IN FAVOUR OF SMT. JAMVATI
                BAI W/O MR. PRITAM SINGH.
                <br />
                2. DURING PROPERTY VISIT MR. NARENDRA CHOUHAN JI MET AT THE
                PROPERTY HE IS THE CUSTOMER CONTACT NO. 9340034032. IT WAS
                CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE
                FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.
                <br />
                3. RATE HAS BEEN CONFORMED FROM MARKET ENQUIRY.
                <br />
                4. THE PROPERTY IS SITUATED AT SURROUNDING AREA OF AGRICULTURAL
                CUM COMMERCIAL ZONING SURROUNDING AREA DEVELOPMENT 40-50%.
                <br />
                5. AT SITE PROPERTY IS G+1 RSI CUM COMMERCIAL WHERE G.F HAVING 4
                SHOP +3HALL+1KITCHIN AND F.F HAVING 4SHOP +4R+1K+1LB OCCUPIED BY
                CUSTOMER AT SITE.
                <br />
                6. G+1 STRUCTURE BUILT OVER THE PLOT AREA 40X50=2000 SQFT.
                <br />
                <span className='text-red-500'>
                  7. PROPERTY IS NOT IDENTIFIED BY FOUR SIDE BOUNDARIES OF THE
                  SALE DEED ANY APPROVER NAJARIYA NAKSHA OR KEY LOCATION PLAN IS
                  REQUIRED FOR IDENTIFICATION.
                  <br />
                </span>
                8. OBTAIN BUILDING MAP FOR G+2 STRUCTURE WHICH IS APPROVED BY
                GRAM PANCHAYT DOBI. DATE AND MEMO NO. NOT MENTIONED
                <br />
                9. BUILT UP IS TAKEN AS PER PERMISSIBLE FAR 1.5 FAR
                <br />
                10. AS PER SALE DEED LAND USES ARE FOR RESIDENTIAL PROPOSES AND
                AS PER TAX RECEIPT LAND USES ARE RESIDENTIAL AND COMMERCIAL
                <br />
                12. TENTATIVE LAND RATE IS RS 2500 PER SQFT.
                <br />
              </td>
            </tr>
            <tr></tr>
            <tr></tr>
            <tr>
              <td>K.</td>
              <td className='font-bold' colSpan='11'>
                Value Certification
              </td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>Date of Visit</td>
              <td colSpan='2'>{data.inspectionSiteVisitDate}</td>
              <td colSpan='3'>Date of Report Submission</td>
              <td colSpan='3'></td>
            </tr>
            <tr>
              <td></td>
              <td colSpan='3'>Name of Engineer Visited the property</td>
              <td colSpan='2'>BHART SHARMA</td>
              <td colSpan='3'>Authorized Signatory Name & Signature</td>
              <td colSpan='3'></td>
            </tr>
            <tr>
              <td className='font-bold' colSpan='12'>
                DECLARATIONS
              </td>
            </tr>
            <tr>
              <td rowSpan='4'></td>
              <td colSpan='11' rowSpan='4'>
                1. We have deputed our representative Mr. BHAGWAT to inspect the
                property. Our representative has personally inspected the
                property on 25.05.2023
                <br />
                2. We have no direct / indirect interest in the property valued
                <br />
                3. The valuation is based on the site visit and the information
                given by borrower
                <br />
                4. The information furnished above is true and correct to the
                best of our knowledge and belief and as per actual position &
                information given to us and is based on the copy of documents /
                plans, if submitted to us by the Bank or shown to us by the
                client
                <br />
                5. No assistance was received in the preparation of the
                appraisal, in the property valued
                <br />
                6. The contents of this report are for technical valuation and
                should not be read in any legal context
                <br />
                7. Inspection of the property was informed
                <br />
                8. Limiting conditions have been disclosed
                <br />
                9. The valuation is subject and marketable title and adequacy of
                engineering design
                <br />
                10. The contents of this report are for technical valuation and
                should not be read in any legal context. The fair market value
                indicated in the report is an opinion of the value prevailing on
                the date of the said report and is based on market feedback on
                values of similar properties. The client is free to obtain other
                independent opinions on the same. The fair market value of such
                properties / localities may increase or decrease, depending on
                the future market conditions and scenarios. The valuation is
                subject to clear & marketable title & adequacy of engineering
                design.
                <br />
              </td>
            </tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgriwiseDetails;
