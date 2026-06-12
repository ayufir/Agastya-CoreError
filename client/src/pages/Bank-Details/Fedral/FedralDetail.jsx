import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import { useDispatch, useSelector } from "react-redux";
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getFedralBankById } from "../../../redux/features/Banks/FedralBankForm/FedralBankThunk";
import { useParams } from "react-router-dom";

export const Fed = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const data = useSelector((state) => state.Fedral.singleData);

  useEffect(() => {
    if (id) {
      dispatch(getFedralBankById(id));
    }
  }, [id, dispatch]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const handleExportPDF = () => {
    const input = document.getElementById('reportTable');
    html2canvas(input, { 
      scale: 2, 
      useCORS: true,
      scrollY: -window.scrollY
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pageWidth - margin * 2;
      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = margin;
      let remainingHeight = imgHeight;

      while (remainingHeight > 0) {
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        remainingHeight -= pageHeight - margin * 2;
        position -= pageHeight - margin * 2;
        
        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }

      pdf.save('Technical_Report.pdf');
    });
  };

  const handleExportExcel = () => {
    const table = document.getElementById('reportTable');
    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Report' });
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Technical_Report.xlsx');
  };

  const handleExportCSV = () => {
    const table = document.getElementById('reportTable');
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Technical_Report.csv');
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Export Buttons */}
      <div style={{ marginBottom: 20, textAlign: 'right' }}>
        <button 
          onClick={handleExportPDF} 
          style={{ marginRight: 10, padding: '8px 16px', cursor: 'pointer' }}
        >
          Download PDF
        </button>
        <button 
          onClick={handleExportExcel} 
          style={{ marginRight: 10, padding: '8px 16px', cursor: 'pointer' }}
        >
          Download Excel
        </button>
        <button 
          onClick={handleExportCSV}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Download CSV
        </button>
      </div>

      <div id="radio" className="technical-report">
        <table id="reportTable" cellSpacing="0" cellPadding="0" style={{ width: "100%" }}>
          <colgroup>
            <col width="68" />
            <col width="244" />
            <col width="251" />
            <col width="145" />
            <col width="95" />
            <col width="107" />
            <col width="101" />
            <col width="101" />
            <col width="85" />
          </colgroup>
          <tbody>
            <tr>
              <td className='catching fw-bold' colSpan="9"><a name="RANGE!A1:I126">TECHNICAL REPORT FORMAT</a></td>
            </tr>
            <tr>
              <td width="68">&nbsp;</td>
              <td width="244">Product</td>
              <td colSpan="2" width="396">LAP/MSE LAP/HOME LOAN BT/ HL/STL- NEW FIXED</td>
              <td width="95">Branch</td>
              <td width="107">{data.branch || 'BHOPAL'}</td>
              <td width="101">Date of Report</td>
              <td colSpan="2" width="186">{data.inspectionDate || '12.02.2025'}</td>
            </tr>
            <tr>
              <td>1</td>
              <td className='fw-bold' colSpan="8" width="1129">CUSTOMER DETAILS</td>
            </tr>
            <tr>
              <td>1.1</td>
              <td width="244">Application Number</td>
              <td colSpan="2" width="396">{data.applicationNumber || 'L0000018458'}</td>
              <td width="95">1.7</td>
              <td colSpan="2" width="208">Reference Number</td>
              <td className='fw-bold' colSpan="2" width="186">{data.referenceNumber || 'NA'}</td>
            </tr>
            <tr>
              <td>1.2</td>
              <td width="244">Customer Name</td>
              <td colSpan="2" width="396">{data.customerName || 'MR. MOHD AAMIR'}</td>
              <td width="95">1.8</td>
              <td colSpan="2" width="208">Current Property owner name as per ownership document</td>
              <td colSpan="2" width="186">{data.customerName || 'MR. MOHD AAMIR'}</td>
            </tr>
            <tr>
              <td>1.3</td>
              <td width="244">Co-applicant Details</td>
              <td colSpan="2" width="396">{data.coApplicantDetails || 'NA'}</td>
              <td width="95">1.9</td>
              <td colSpan="2" width="208">Proposed Owner/s</td>
              <td colSpan="2" width="186">{data.proposedOwners || 'NA'}</td>
            </tr>
            <tr>
              <td>1.4</td>
              <td width="244">Date &amp; Time of Inspection</td>
              <td colSpan="2" width="396">{data.inspectionDate || '12.02.2025'}</td>
              <td width="95">1.10'</td>
              <td colSpan="2" width="208">Visit Done By</td>
              <td colSpan="2" width="186">{data.visitDoneBy || 'MR. BHAGWAT'}</td>
            </tr>
            <tr>
              <td>1.5</td>
              <td width="244">Case Type</td>
              <td colSpan="2">{data.caseType || 'STL- NEW FIXED'}</td>
              <td width="95">1.11</td>
              <td colSpan="2">Person met at site</td>
              <td colSpan="2">{data.personMetAtSite || data.customerName || 'MR. MOHD AAMIR'}</td>
            </tr>
            <tr>
              <td>1.6</td>
              <td width="244">Contact Number of person met at site</td>
              <td colSpan="2" width="396">{data.contactNumber || '9713742877, 8224038590'}</td>
              <td width="95">1.12</td>
              <td colSpan="2" width="208">Relationship with customer</td>
              <td colSpan="2">{data.relationshipWithCustomer || 'SELF'}</td>
            </tr>
            <tr>
              <td>2</td>
              <td className='fw-bold' colSpan="8" width="1129">PROPERTY DETAILS</td>
            </tr>
            <tr>
              <td>2.1</td>
              <td width="244">Address of Property</td>
              <td colSpan="2" width="396">{data.propertyAddress || 'PROPERTY AT PLOT NO. 67, PART OF KH. NO. 61/2, 63, 64,65,67,68,69, KUTEER NAGAR NEAR BY LODHI NAGAR, WARD NO.73 GRAM BHANPUR TEHSIL HUZUR, DIST BHOPAL'}</td>
              <td width="95">2.4</td>
              <td colSpan="2" width="208">Legal Address (Survey No. / FP No. / Khasra No./ Plot No)</td>
              <td colSpan="2">{data.legalAddress || '67'}</td>
            </tr>
            <tr>
              <td>2.2</td>
              <td width="244">Pin Code</td>
              <td colSpan="2" width="396">{data.pinCode || '462037'}</td>
              <td width="95">2.5</td>
              <td colSpan="2" width="208">Nearby landmark</td>
              <td colSpan="2" width="186">{data.nearbyLandmark || 'NEAR BY MASJID BILAL'}</td>
            </tr>
            <tr>
              <td>2.3</td>
              <td width="244">Latitude &amp; Longitude</td>
              <td colSpan="2" width="396">{data.coordinates || '23.294491 77.425164'}</td>
              <td width="95">2.6</td>
              <td colSpan="2" width="208">Seismic Zone</td>
              <td colSpan="2" width="186">{data.seismicZone || 'III'}</td>
            </tr>
            <tr>
              <td>3</td>
              <td className='fw-bold' colSpan="8" width="1129">DOCUMENT DETAILS</td>
            </tr>
            <tr>
              <td>3.1</td>
              <td width="244">Layout Plan Provided (Y/N)</td>
              <td width="251">{data.layoutPlanProvided || 'NA'}</td>
              <td colSpan="2" width="240">Approving Authority</td>
              <td colSpan="2" width="208">{data.layoutPlanAuthority || 'NA'}</td>
              <td width="101">Approval Number &amp; Date</td>
              <td width="85">{data.layoutPlanApproval || 'NA'}</td>
            </tr>
            <tr>
              <td>3.2</td>
              <td width="244">Building Plan Provided (Y/N)</td>
              <td width="251">{data.buildingPlanProvided || 'YES'}</td>
              <td colSpan="2" width="240">Approving Authority</td>
              <td colSpan="2" width="208">{data.buildingPlanAuthority || 'NAGAR NIGAM BHOPAL'}</td>
              <td width="101">Approval Number &amp; Date</td>
              <td width="85">{data.buildingPlanApproval || '0465/1767/2022'}</td>
            </tr>
            <tr>
              <td>3.3</td>
              <td width="244">Construction Permission (Y/N)</td>
              <td width="251">{data.constructionPermissionProvided || 'NA'}</td>
              <td colSpan="2" width="240">Approving Authority</td>
              <td colSpan="2" width="208">{data.constructionPermissionAuthority || 'NA'}</td>
              <td width="101">Approval Number &amp; Date</td>
              <td width="85">{data.constructionPermissionApproval || 'NA'}</td>
            </tr>
            <tr>
              <td>3.4</td>
              <td width="244">RERA Applicable (Y/N)</td>
              <td width="251">{data.reraApplicable || 'NA'}</td>
              <td colSpan="2" width="240">RERA Number</td>
              <td colSpan="4" width="394">{data.reraNumber || 'NA'}</td>
            </tr>
            <tr>
              <td>3.5</td>
              <td width="244">Stage of Construction as per RERA Website</td>
              <td width="251">{data.reraConstructionStage || 'NA'}</td>
              <td colSpan="2" width="240">Property Category (A Katha / B Katha / Panchayat / Laal Dora etc.)</td>
              <td width="107">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="101">{data.propertyCategory || 'NA'}</td>
              <td width="85">&nbsp;</td>
            </tr>
            <tr>
              <td>3.6</td>
              <td width="244">List of Documents studied</td>
              <td width="251">{data.documentsStudied || 'SALE DEED'}</td>
              <td colSpan="2" width="240">Other Document Provided</td>
              <td colSpan="4">{data.otherDocuments || 'NA'}</td>
            </tr>
            <tr>
              <td>4</td>
              <td className='fw-bold' colSpan="8" width="1129">PHYSICAL DETAILS</td>
            </tr>
            <tr>
              <td>4.1</td>
              <td rowSpan="4" width="244">Four Boundaries of property</td>
              <td className='fw-bold' width="251">Directions</td>
              <td className='fw-bold' width="145">East</td>
              <td className='fw-bold' colSpan="2" width="202">West</td>
              <td className='fw-bold' width="101">North</td>
              <td className='fw-bold' colSpan="2" width="186">South</td>
            </tr>
            <tr>
              <td>4.2</td>
              <td width="251">As per deed</td>
              <td width="145">{data.deed_East || 'PLOT NO. 68'}</td>
              <td colSpan="2" width="202">{data.deed_West || 'PLOT NO. 66'}</td>
              <td width="101">{data.deed_North || 'ROAD'}</td>
              <td colSpan="2" width="186">{data.deed_South || 'PLOT NO. 82'}</td>
            </tr>
            <tr>
              <td>4.3</td>
              <td width="251">As per Plan</td>
              <td width="145">{data.plan_East || 'NA'}</td>
              <td colSpan="2" width="202">{data.plan_West || 'NA'}</td>
              <td width="101">{data.plan_North || 'NA'}</td>
              <td colSpan="2" width="186">{data.plan_South || 'NA'}</td>
            </tr>
            <tr>
              <td width="68">4.4</td>
              <td width="251">Actual at site</td>
              <td width="145">{data.actual_East || 'PLOT NO. 68'}</td>
              <td colSpan="2" width="202">{data.actual_West || 'HOUSE NO. 66'}</td>
              <td width="101">{data.actual_North || 'ROAD'}</td>
              <td colSpan="2" width="186">{data.actual_South || 'HOUSE NO. 82'}</td>
            </tr>
            <tr>
              <td width="68">4.5</td>
              <td width="244">Boundaries Matching</td>
              <td colSpan="2" width="396">{data.boundariesMatching || 'YES'}</td>
              <td colSpan="2" width="202">If Not, remarks</td>
              <td colSpan="3" width="287">&nbsp;</td>
            </tr>
            <tr>
              <td width="68">4.6</td>
              <td width="244">Construction as per approved Plan</td>
              <td colSpan="7" width="885">{data.structureConfirmingByelaws || 'NA'}</td>
            </tr>
            <tr>
              <td width="68">4.7</td>
              <td rowSpan="9" width="244">Plot Details</td>
              <td colSpan="2" width="396">Plot Area As per Measurement</td>
              <td colSpan="5" width="489">{data.landAreaSite || '600 SQFT.'}</td>
            </tr>
            <tr>
              <td width="68">4.8</td>
              <td colSpan="2" width="396">Plot demarcated at site</td>
              <td colSpan="5" width="489">{data.demarcatedSite || 'YES'}</td>
            </tr>
            <tr>
              <td width="68">4.9</td>
              <td colSpan="2" width="396">Land Use (As per master plan)</td>
              <td colSpan="5" width="489">{data.landUse || 'NA'}</td>
            </tr>
            <tr>
              <td width="68">4.10'</td>
              <td colSpan="2" width="396">Whether Electricity, water, drainage present in the vicinity (Y/N)</td>
              <td colSpan="5" width="489">YES</td>
            </tr>
            <tr>
              <td width="68">4.11</td>
              <td colSpan="2" width="396">Type of Locality (Residential/Commercial/Mix/Industrial/Others)</td>
              <td colSpan="5" width="489">RESIDENTIAL</td>
            </tr>
            <tr>
              <td width="68">4.12</td>
              <td colSpan="2" width="396">Class of Locality (Posh/High/Middle/Low/Slum)</td>
              <td colSpan="5" width="489">Middle</td>
            </tr>
            <tr>
              <td width="68">4.13</td>
              <td colSpan="2" width="396">Is community dominated area (Yes/No)</td>
              <td colSpan="5" width="489">NO</td>
            </tr>
            <tr>
              <td width="68">4.14</td>
              <td colSpan="2" width="396">Width of public road (ft.)</td>
              <td colSpan="5" width="489">10 FT</td>
            </tr>
            <tr>
              <td width="68">4.15</td>
              <td colSpan="2" width="396">Is property easily located and identified (Yes/No)</td>
              <td colSpan="2" width="202">YES</td>
              <td width="101">If No, mention reasons</td>
              <td colSpan="2" width="186">NA</td>
            </tr>
            <tr>
              <td width="68">4.16</td>
              <td>&nbsp;</td>
              <td colSpan="2" width="396">How Property Identified By Agency Personal</td>
              <td colSpan="5" width="489">CUSTOMER</td>
            </tr>
            <tr>
              <td width="68">4.17</td>
              <td width="244">Property Location (MC/GP/Panchayat under Development Authority)</td>
              <td colSpan="2" width="396">MC</td>
              <td width="95">4.18</td>
              <td colSpan="2" width="208">Distance from Fedfina Branch (Km)</td>
              <td colSpan="2" width="186">13 KM</td>
            </tr>
            <tr>
              <td width="68">4.19</td>
              <td width="244">Type of Property- <span className='fw-bold'>On Verification</span>  (Land/Bungalow/Apartment/Builder Floor/Factory/Commercial Shop/Office/Institute/Farm House/Others</td>
              <td colSpan="2" width="396">RESIDENTIAL</td>
              <td width="95">Type of Property- On Documents</td>
              <td colSpan="4" width="394">RESIDENTIAL</td>
            </tr>
            <tr>
              <td width="68">4.20&quot;</td>
              <td rowSpan="5" width="244">Unit Details</td>
              <td className='fw-bold'  colSpan="2" width="396">Detail</td>
              <td className='fw-bold' colSpan="2" width="202">No. of Rooms</td>
              <td className='fw-bold' width="101">No. of Kitchen</td>
              <td className='fw-bold' width="101">No. of Bathrooms</td>
              <td className='fw-bold' width="85">Others</td>
            </tr>
            <tr>
              <td width="68">4.21</td>
              <td colSpan="2" width="396">{data.floor || 'G.F'}</td>
              <td colSpan="2" width="202">2+ 1 HALL</td>
              <td width="101">1</td>
              <td width="101">1</td>
              <td width="85">&nbsp;</td>
            </tr>
            <tr>
              <td width="68">4.22</td>
              <td colSpan="2" width="396">&nbsp;</td>
              <td colSpan="2" width="202">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="85">&nbsp;</td>
            </tr>
            <tr>
              <td width="68">4.23</td>
              <td colSpan="2" width="396">&nbsp;</td>
              <td colSpan="2" width="202">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="85">&nbsp;</td>
            </tr>
            <tr>
              <td width="68">4.24</td>
              <td colSpan="2" width="396">&nbsp;</td>
              <td colSpan="2" width="202">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="85">&nbsp;</td>
            </tr>
            <tr>
              <td width="68">4.25</td>
              <td width="244">&nbsp;</td>
              <td colSpan="2" width="396">&nbsp;</td>
              <td colSpan="2" width="202">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="85">&nbsp;</td>
            </tr>
            <tr>
              <td width="68">4.26</td>
              <td width="244">No of Wings</td>
              <td colSpan="7" width="885">&nbsp;</td>
            </tr>
            <tr>
              <td width="68">4.27</td>
              <td width="244">Structure (Load Bearing/RCC/Mixed)</td>
              <td colSpan="7" width="885">{data.structureDescription || 'RCC'}</td>
            </tr>
            <tr>
              <td width="68">4.28</td>
              <td width="244">Interior Quality (Premium/Average/Satisfactory/Poor)</td>
              <td colSpan="2" width="396">GOOD</td>
              <td width="95">4.32</td>
              <td width="107">Exterior Quality (Premium/Average/Satisfactory/Poor)</td>
              <td colSpan="3" width="287">GOOD</td>
            </tr>
            <tr>
              <td width="68">4.29</td>
              <td width="244">Maintenance level (Good/Average/Poor)</td>
              <td colSpan="7" width="885">GOOD</td>
            </tr>
            <tr>
              <td width="68">4.30&quot;</td>
              <td width="244">Roof (RCC/Wood/Stone/Metal/Asbestos etc.</td>
              <td colSpan="2" width="396">RCC</td>
              <td width="95">4.33</td>
              <td width="107">Wall Quality</td>
              <td colSpan="3" width="287">GOOD</td>
            </tr>
            <tr>
              <td>4.31</td>
              <td width="244">Age of Property (Years)</td>
              <td colSpan="2" width="396">2</td>
              <td width="95">4.34</td>
              <td colSpan="2" width="208">Residual Age of property (Years)</td>
              <td colSpan="2" width="186">48</td>
            </tr>
            <tr>
              <td colSpan="9" width="1197">&nbsp;</td>
            </tr>
            <tr>
              <td  width="68">5</td>
              <td className='fw-bold' colSpan="8" width="1129">OCCUPANCY DETAILS</td>
            </tr>
            <tr>
              <td width="68">5.1</td>
              <td className='fw-bold' colSpan="8" width="1129">OCCUPANCY DETAILS - SUBJECT UNIT</td>
            </tr>
            <tr>
              <td width="68">5.1.1</td>
              <td width="244">Status of Occupancy</td>
              <td colSpan="2" width="396">{data.statusOfOccupancy || 'VACANT'}</td>
              <td width="95">5.1.3</td>
              <td width="107">Occupied by</td>
              <td colSpan="3">{data.occupiedBy || 'NA'}</td>
            </tr>
            <tr>
              <td width="68">5.1.2</td>
              <td width="244">Relationship of Occupant with customer</td>
              <td colSpan="2" width="396">{data.occupantRelationship || 'NA'}</td>
              <td width="95">5.1.4</td>
              <td width="107">Occupied Since</td>
              <td colSpan="3">{data.occupiedSince || 'NA'}</td>
            </tr>
            <tr>
              <td width="68">5.2</td>
              <td className='fw-bold' colSpan="8" width="1129">OCCUPANCY DETAILS - SUBJECT SCHEME</td>
            </tr>
            <tr>
              <td width="68">5.2.1.</td>
              <td width="244">No of Units Occupied in Particular Scheme</td>
              <td colSpan="2" width="396">{data.unitsOccupiedInScheme || 'NA'}</td>
              <td width="95">5.2.3</td>
              <td colSpan="2" width="208">Percentage of Occupancy in Particular Scheme</td>
              <td colSpan="2">{data.occupancyPercentageInScheme || '80%'}</td>
            </tr>
            <tr>
              <td width="68">5.2.2</td>
              <td width="244">Percentage of Habitation in Particular Area (1 Kms)</td>
              <td colSpan="7" width="885">{data.habitationPercentage || '85%'}</td>
            </tr>
            <tr>
              <td width="68">6</td>
              <td className='fw-bold' colSpan="8" width="1129">VIOLATIONS OBSERVED IF ANY</td>
            </tr>
            <tr>
              <td width="68">6.1</td>
              <td width="244">Is there encroachment of land(Y/N)</td>
              <td colSpan="2" width="396">{data.encroachment || 'NO'}</td>
              <td width="95">6.4</td>
              <td colSpan="2" width="208">Area of encroachment</td>
              <td colSpan="2" width="186">{data.encroachmentArea || 'NA'}</td>
            </tr>
            <tr>
              <td width="68">6.2</td>
              <td width="244">Any Deviation in Structure</td>
              <td colSpan="2" width="396">{data.structureDeviation || 'NA'}</td>
              <td width="95">6.5</td>
              <td colSpan="2" width="208">Risk of Demolition/Sealing (Nil/Low/Medium/High)</td>
              <td colSpan="2" width="186">{data.riskLevel || 'LOW'}</td>
            </tr>
            <tr>
              <td width="68">6.3</td>
              <td width="244">if plans not available then is the structure confirming to the local byelaws</td>
              <td colSpan="2" width="396">{data.structureConfirmingByelaws || 'NA'}</td>
              <td width="95">&nbsp;</td>
              <td width="107">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="85">&nbsp;</td>
            </tr>
            <tr>
              <td colSpan="9" width="1197">&nbsp;</td>
            </tr>
            <tr>
              <td width="68">7</td>
              <td className='fw-bold' colSpan="8" width="1129">VALUATION</td>
            </tr>
            <tr>
              <td rowSpan="3" width="68">7.1</td>
              <td rowSpan="4" width="244">Land Value</td>
              <td width="251">Land Area as per Plan</td>
              <td colSpan="6" width="634">{data.landAreaPlan || 'NA'}</td>
            </tr>
            <tr>
              <td width="251">Land Area as per Document (in sq. ft.)</td>
              <td colSpan="6">{data.landAreaDocument || '600'}</td>
            </tr>
            <tr>
              <td width="251">Land Area as per site (in sq. ft.)</td>
              <td colSpan="6" width="634">{data.landAreaSite || '600'}</td>
            </tr>
            <tr>
              <td width="68">7.2</td>
              <td width="251">Land Rate(Per sq. ft.)</td>
              <td width="145">{data.landRate || '1500'}</td>
              <td width="95">7.11</td>
              <td colSpan="2" width="208">Land Value</td>
              <td colSpan="2" width="186">{data.landValue || '900000.00'}</td>
            </tr>
            <tr>
              <td width="68">7.3</td>
              <td width="244">Permissible FSI</td>
              <td colSpan="2" width="396">&nbsp;</td>
              <td width="95">7.12</td>
              <td colSpan="2">FSI Considered for valuation</td>
              <td colSpan="2" width="186">{data.fsiConsidered || '0.63'}</td>
            </tr>
            <tr>
              <td width="68">7.4</td>
              <td rowSpan="6" width="244">Existing Construction Value</td>
              <td width="251">Type of area (Carpet Area/Super Built Up Area/Built Up Area)</td>
              <td width="145">Built Up Area</td>
              <td width="95">&nbsp;</td>
              <td width="107">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="101">&nbsp;</td>
              <td width="85">&nbsp;</td>
            </tr>
            <tr>
              <td width="68">7.5</td>
              <td width="251">Floor Details</td>
              <td width="145">Area (Sqft)</td>
              <td colSpan="2" width="202">Rate (per Sqft)</td>
              <td colSpan="3" width="287">Amount (Rs)</td>
            </tr>
            <tr>
              <td width="68">7.6</td>
              <td width="251">{data.floor || 'G.F'}</td>
              <td width="145">{data.area || '375'}</td>
              <td colSpan="2" width="202">{data.rate || '1200'}</td>
              <td colSpan="3" width="287">{data.amount || '450000'}</td>
            </tr>
            <tr>
              <td width="68">7.7</td>
              <td width="251">&nbsp;</td>
              <td width="145">&nbsp;</td>
              <td colSpan="2" width="202">0</td>
              <td colSpan="3" width="287">0</td>
            </tr>
            <tr>
              <td width="68">7.8</td>
              <td width="251">&nbsp;</td>
              <td width="145">&nbsp;</td>
              <td colSpan="2" width="202">&nbsp;</td>
              <td colSpan="3" width="287">&nbsp;</td>
            </tr>
            <tr>
              <td width="68">7.9</td>
              <td width="251">Total</td>
              <td colSpan="3" width="347">&nbsp;</td>
              <td colSpan="3" width="287">450000</td>
            </tr>
            <tr>
              <td width="68">7.10'</td>
              <td width="244">Total Existing Value of Property(Rs)</td>
              <td width="251">&nbsp;</td>
              <td colSpan="3" width="347">&nbsp;</td>
              <td colSpan="3" width="287">{data.totalExistingValue || '1350000.00'}</td>
            </tr>
            <tr>
              <td colSpan="9" width="1197">Note: Lower of 3 to be considered: Construction Area as per plans or As per FSI norms or Actual Physical Measurement Area</td>
            </tr>
            <tr>
              <td width="68">&nbsp;</td>
              <td className='fw-bold' colSpan="8" width="1129">To Be Filled ONLY For Construction &amp; Improvement Cases</td>
            </tr>
            <tr>
              <td rowSpan="6" width="68">7.13</td>
              <td className='fw-bold' rowSpan="6" width="244">Proposed Construction Details ('C)</td>
              <td className='fw-bold' width="251">Floor Details</td>
                    <td className='fw-bold' width="145">Area (Sqft)</td>
            <td className='fw-bold' colSpan="2" width="202">Rate (per Sqft)</td>
            <td className='fw-bold' colSpan="3" width="287">Amount (Rs)</td>
          </tr>
          <tr>
            <td width="251">&nbsp;</td>
            <td width="145">&nbsp;</td>
            <td colSpan="2" width="202">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td width="85">&nbsp;</td>
          </tr>
          <tr>
            <td width="251">&nbsp;</td>
            <td width="145">&nbsp;</td>
            <td colSpan="2" width="202">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td width="85">&nbsp;</td>
          </tr>
          <tr>
            <td width="251">&nbsp;</td>
            <td width="145">&nbsp;</td>
            <td colSpan="2" width="202">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td width="85">&nbsp;</td>
          </tr>
          <tr>
            <td width="251">&nbsp;</td>
            <td width="145">&nbsp;</td>
            <td width="95">&nbsp;</td>
            <td width="107">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td width="85">&nbsp;</td>
          </tr>
          <tr>
            <td className='fw-bold' width="251">Total</td>
            <td colSpan="6" width="634">&nbsp;</td>
          </tr>
          <tr>
            <td width="68">7.14</td>
            <td  className='fw-bold' width="244">Cost as per Estimate of Customer (Rs)</td>
            <td colSpan="7" width="885">&nbsp;</td>
          </tr>
          <tr>
            <td width="68">7.15</td>
            <td  className='fw-bold' width="244">Rate/Sqft as per Estimate of customer(Rs)</td>
            <td colSpan="7" width="885">&nbsp;</td>
          </tr>
          <tr>
            <td width="68">7.16</td>
            <td  className='fw-bold' width="244">Expected Date of Completion</td>
            <td width="251">&nbsp;</td>
            <td colSpan="6" width="634">&nbsp;</td>
          </tr>
          <tr>
            <td width="68">7.17</td>
            <td   className='fw-bold' rowSpan="6" width="244">Description of proposed construction/improvement</td>
            <td  className='fw-bold' width="251">Material at site (Yes/No)</td>
            <td colSpan="6" width="634">&nbsp;</td>
          </tr>
          <tr>
            <td rowSpan="5" width="68">7.18</td>
            <td  className='fw-bold' colSpan="2" width="396">Description</td>
            <td  className='fw-bold' colSpan="2" width="202">Rs. / sqft</td>
            <td  className='fw-bold' width="101">Qty.</td>
            <td  className='fw-bold' colSpan="2">Total value</td>
          </tr>
          <tr>
            <td colSpan="2" width="396">&nbsp;</td>
            <td colSpan="2" width="202">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td colSpan="2">&nbsp;</td>
          </tr>
          <tr>
            <td colSpan="2" width="396">&nbsp;</td>
            <td colSpan="2" width="202">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td colSpan="2">&nbsp;</td>
          </tr>
          <tr>
            <td colSpan="2" width="396">&nbsp;</td>
            <td colSpan="2" width="202">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td colSpan="2" width="186">&nbsp;</td>
          </tr>
          <tr>
            <td colSpan="2" width="396">&nbsp;</td>
            <td colSpan="2" width="202">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td colSpan="2" width="186">&nbsp;</td>
          </tr>
          <tr>
            <td width="68">7.19</td>
            <td width="244">&nbsp;</td>
            <td  className='fw-bold' width="251">Value of extra Amenities</td>
            <td colSpan="6" width="634">&nbsp;</td>
          </tr>
          <tr>
            <td width="68">7.20&quot;</td>
            <td width="244">Total Property Valuation(A+B+C)(Rs)</td>
            <td colSpan="7" width="885">1350000.00</td>
          </tr>
          <tr>
            <td width="68">7.21</td>
            <td width="244">Valuation as per Govt. Guideline Rate</td>
            <td>Rate (per sqft)</td>
            <td>654</td>
            <td>7.25</td>
            <td colSpan="2" width="208">Land value as per Government Guideline Rate (Rs)</td>
            <td colSpan="2">392400</td>
          </tr>
          <tr>
            <td width="68">7.22</td>
            <td width="244">Realizable Value (_90__% of Fair Market Value)</td>
            <td colSpan="7">1215000</td>
          </tr>
          <tr>
            <td width="68">7.23</td>
            <td width="244">Distressed Value of Property (Rs) (_80__% of market value)</td>
            <td colSpan="7">1080000</td>
          </tr>
          <tr>
            <td width="68">7.24</td>
            <td width="244">Marketability</td>
            <td colSpan="7">GOOD</td>
          </tr>
          <tr>
            <td width="68">8</td>
            <td  className='fw-bold' colSpan="8">STAGE OF CONSTRUCTION</td>
          </tr>
          <tr>
            <td width="68">8.1</td>
            <td rowSpan="2" width="244">Based on standard Cost of construction</td>
            <td width="251">Description of Structure (RCC/Load Bearing/Mix)</td>
            <td width="145">(Description of stage)</td>
            <td colSpan="3" width="303">% Completed</td>
            <td colSpan="2" width="186">% Recommended</td>
          </tr>
          <tr>
            <td width="68">8.2</td>
            <td width="251">RCC</td>
            <td width="145">FINISHING WORK PENDING</td>
            <td colSpan="3" width="303">95%</td>
            <td colSpan="2">100%</td>
          </tr>
          <tr>
            <td width="68">9</td>
            <td  className='fw-bold' colSpan="8">REFERENCE DETAILS</td>
          </tr>
          <tr>
            <td width="68">9.1</td>
            <td width="244">Reference Type (Broker/Builder/Colonizer/Neighbour/Shop Owner/Valuer</td>
            <td colSpan="2" width="396">NA</td>
            <td width="95">9.4</td>
            <td colSpan="2" width="208">Reference Name</td>
            <td colSpan="2">NA</td>
          </tr>
          <tr>
            <td width="68">9.2</td>
            <td width="244">Reference Contact Number</td>
            <td colSpan="2" width="396">NA</td>
            <td width="95">9.5</td>
            <td colSpan="2" width="208">Remarks, if any</td>
            <td colSpan="2">NA</td>
          </tr>
          <tr>
            <td width="68">9.3</td>
            <td>Valuation Result</td>
            <td colSpan="2" width="396">Positive/Negative/Neutral</td>
            <td width="95">9.6</td>
            <td colSpan="2" width="208">Fair Rental Value</td>
            <td colSpan="2">NA</td>
          </tr>
          <tr>
            <td width="68">10</td>
            <td  className='fw-bold' colSpan="8" width="1129">1. GIVEN XEROX COPY OF SALE DEED IN FAVOUR OF MR. MOHD AAMIR S/O MR. MO. IMAM KHAN<br />
              2. DURING PROPERTY VISIT MR. AMIR WAS MET AT THE PROPERTY WHO IS COSTUMER. IT WAS CLEARLY EXPLAINED TO HIM/HER THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.<br />
              3. RATE HAS BEEN CONFIRM FROM LOCAL MARKET ENQUIRY.<br />
              4. PROPERTY SITUATED IN SURROUNDING LOCALITY IS RESIDENTIAL. <br />
              5. PROPERTY IS GF RESIDENTIAL HOUSE WHICH VACANT AND FINISHING WORK IS PENDING. <br />
              6. PROPERTY IS IDENTIFIED BY COMMON FOUR SIDE BOUNDARIES OF DEED AND LOCAL ENQUIRY.<br />
              7. AS PER DEED LAND AREA IS 600 SQFT. <br />
              7. ACTUAL BUILT-UP AREA OF THE GF IS 600 SQFT. BUILT-UP AREA IS CONSIDERED AS PER PERMISSIBLE FSI 0.625. <br />
              8. OBTAINED COPY OF APPROVED MAP FOR G+2, PERMISSION NO. 0465/1767/2022 ON DATE 14/06/2022.<br />
              9. AS PER DEED USES ARE RESIDENTIAL <br />
              10. BUILT-UP VALUE IS CONSIDERED AS PER PRESENT CONDITION OF THE WORK <br /></td>
          </tr>
          <tr>
            <td width="68">&nbsp;</td>
            <td colSpan="5" width="842">Declaration</td>
            <td colSpan="3" rowSpan="2" width="287">&nbsp;</td>
          </tr>
          <tr>
            <td width="68">&nbsp;</td>
            <td colSpan="5">I/We hereby declare that</td>
          </tr>
          <tr>
            <td width="68">&nbsp;</td>
            <td colSpan="5">1. My representative (Named: ) has personally inspected the property on date ______________</td>
            <td colSpan="3">Signature with seal</td>
          </tr>
          <tr>
            <td width="68">&nbsp;</td>
            <td colSpan="5">2. I/We have no direct or Indirect Interest in the property valued</td>
            <td width="101">Date</td>
            <td colSpan="2">12.02.2025</td>
          </tr>
          <tr>
            <td width="68">&nbsp;</td>
            <td colSpan="5">3 The information furnished above is true and correct to my/our knowledge.</td>
            <td width="101">Place</td>
            <td colSpan="2">BHOPAL</td>
          </tr>
          <tr>
            <td width="68">&nbsp;</td>
            <td width="244">Customer Name</td>
            <td colSpan="2" width="396">MR, MO AAMIR</td>
            <td width="95">&nbsp;</td>
            <td colSpan="2">Application Number</td>
            <td colSpan="2" width="186">&nbsp;</td>
          </tr>
          <tr>
            <td width="68">&nbsp;</td>
            <td width="244">Address of Property</td>
            <td colSpan="7" width="885">PROPERTY AT PLOT NO. 67, PART OF KH. NO. 61/2, 63, 64,65,67,68,69, KUTEER NAGAR NEAR BY LODHI NAGAR, WARD NO.73 GRAM BHANPUR TEHSIL HUZUR, DIST BHOPAL</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td width="244">Google View Map</td>
            <td width="251">&nbsp;</td>
            <td width="145">&nbsp;</td>
            <td width="95">&nbsp;</td>
            <td width="107">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td width="101">&nbsp;</td>
            <td width="85">&nbsp;</td>
          </tr>
          <tr>
            <td>11</td>
            <td  className='fw-bold' colSpan="8" width="1129">Property Photograph</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td width="244">External photograph of unit<br />
              (Photo of building/Society Name)</td>
            <td width="251">One Surrounding Photograph</td>
            <td width="145">One Photo of Electricity Meter (Meter number should be visible)</td>
            <td width="95">Selfie of vendor/agent visiting the property</td>
            <td colSpan="2" width="208">Internal photograph of unit (Drawing Room, Kitchen, Bedroom, Gallery etc.)</td>
            <td colSpan="2" width="186">One Photo of all entrance</td>
          </tr>
          <tr>
            <td colSpan="9" rowSpan="5">&nbsp;</td>
          </tr>
          <tr> </tr>
          <tr> </tr>
          <tr> </tr>
          <tr> </tr>
          <tr>
            <td>12</td>
            <td colSpan="8" width="1129">Geo Location (Satellite View)</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td colSpan="8" width="1129">&nbsp;</td>
          </tr>
          <tr>
            <td>13</td>
            <td colSpan="8" width="1129">Geo Co-ordinates- 23.294481 77.425164</td>
          </tr>
        </tbody>
      </table>
    </div>

    
</div>
  );
};

export default Fed;
