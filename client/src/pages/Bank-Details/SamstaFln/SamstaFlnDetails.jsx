import React, { useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {  getSamstaflnBankById } from "../../../redux/features/Banks/SamstaflnBankForm/SamstaflnBankThunk";



const SamstaFln = () => {


  const handleExportPDF = () => {
    const input = document.getElementById('reportTable');
    html2canvas(input, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = margin;
      let remainingHeight = imgHeight;

      if (imgHeight > pageHeight - margin * 2) {
        while (remainingHeight > 0) {
          pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
          remainingHeight -= pageHeight - margin * 2;
          if (remainingHeight > 0) {
            pdf.addPage();
            position = margin - (imgHeight - remainingHeight);
          }
        }
      } else {
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      }

      pdf.save('Samasta_Technical_Report.pdf');
    });
  };

  const dispatch = useDispatch();
  const { id } = useParams();
  const data = useSelector((state) => state.Samsta.singleData);

  useEffect(() => {
    if (id) {
      dispatch( getSamstaflnBankById (id));
    }
  }, [id, dispatch]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const handleExportExcel = () => {
    const table = document.getElementById('reportTable');
    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Report' });
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Samasta_Technical_Report.xlsx');
  };

  const handleExportCSV = () => {
    const table = document.getElementById('reportTable');
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Samasta_Technical_Report.csv');
  };

  // Format date from YYYY-MM-DD to DD.MM.YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="p-2.5">
      <div className="mb-5 text-right">
        <button
          onClick={handleExportPDF}
          className="mr-2.5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="mr-2.5 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Download Excel
        </button>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Download CSV
        </button>
      </div>
      <div id="radio" className="w-full h-full">
        <table
          id="reportTable"
          className="w-full h-full border-collapse"
          style={{ borderSpacing: 0, borderPadding: 0 }}
        >
          <colgroup>
            <col width="203" />
            <col width="119" />
            <col width="38" />
            <col width="93" />
            <col width="87" />
            <col width="112" />
            <col width="106" />
            <col width="60" />
          </colgroup>
          <tbody>
            <tr>
              <td width="203">Branch Name</td>
              <td colSpan="2" width="157">{data.branchName || 'N/A'}</td>
              <td colSpan="2" width="180">Type of Case</td>
              <td colSpan="3" width="278">{data.typeOfCase || 'N/A'}</td>
            </tr>
            <tr>
              <td width="203">Valuer Name</td>
              <td colSpan="3" width="250">{data.valuerName || 'N/A'}</td>
              <td colSpan="2" width="199">Date of Visit :</td>
              <td colSpan="2" width="166">{formatDate(data.dateOfVisit)}</td>
            </tr>
            <tr>
              <td width="203">Lan No-</td>
              <td>{data.lanNo || 'N/A'}</td>
              <td colSpan="2" width="131">Valuation Report- Negative/Positive :</td>
              <td colSpan="2" width="199">Date of Report :</td>
              <td colSpan="2" width="166">{formatDate(data.dateOfReport)}</td>
            </tr>
            <tr>
              <td colSpan="2" width="322">Contacted Person for property inspection (Name/ Mobile)</td>
              <td colSpan="6" width="496">{data.contactedPerson || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-bold" colSpan="8" width="818">BASIC DETAILS</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Applicant/s Name/s</td>
              <td colSpan="5" width="458">{data.applicantsName || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Property Owner</td>
              <td colSpan="5" width="458">{data.propertyOwner || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Name of document holder</td>
              <td colSpan="5" width="458">{data.documentHolder || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Originally type of property</td>
              <td colSpan="2" width="180">{data.originalPropertyType || 'N/A'}</td>
              <td width="112">Current Usage</td>
              <td colSpan="2" width="166">{data.currentUsage || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Address as per request</td>
              <td colSpan="5" width="458">{data.addressAsPerRequest || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Address at site</td>
              <td colSpan="5" width="458">{data.addressAtSite || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Address as per document</td>
              <td colSpan="5" width="458">{data.addressAsPerDocument || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Pin code of the property</td>
              <td colSpan="5" width="458">{data.pinCode || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Latitude: {data.latitude || 'N/A'}</td>
              <td colSpan="5" width="458">Longitude: {data.longitude || 'N/A'}</td>
            </tr>
            <tr>
              <td width="203">Main Locality of the Property:</td>
              <td colSpan="2" width="157">{data.mainLocality || 'N/A'}</td>
              <td colSpan="3" width="292">Sub Locality of the Property:</td>
              <td colSpan="2" width="166">{data.locality || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Has the valuator done valuation of this property before this? If yes, when, for whom?</td>
              <td colSpan="5" width="458">{data.previousValuation || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-bold" colSpan="8" width="818">SURROUNDING & LOCALITY DETAILS</td>
            </tr>
            <tr>
              <td colSpan="3" rowSpan="6" width="360">Location</td>
              <td colSpan="3" width="292">Type (Comm., Res, Ind, Mix)</td>
              <td colSpan="2" width="166">{data.type || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="292">Locality (Low, Medium, Posh)</td>
              <td colSpan="2" width="166">{data.locality || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="292">Site is (Dev, Under Dev)</td>
              <td colSpan="2" width="166">{data.siteDevelopment || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="292">Proximity to civic amenities/public transport</td>
              <td colSpan="2" width="166">{data.proximityToAmenities || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="292">Railway Station</td>
              <td colSpan="2" width="166">{data.railwayStation || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="292">Bus Stop</td>
              <td colSpan="2" width="166">{data.busStop || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Close Vicinity/Landmark</td>
              <td colSpan="5" width="458">{data.closeVicinity || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Distance from City Center</td>
              <td colSpan="5" width="458">{data.distanceFromCityCenter || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Condition and approx width of approach road to reach the property</td>
              <td colSpan="5" width="458">{data.roadCondition || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Physical approach to the property as per site visit (Clear / Not Clear)</td>
              <td colSpan="5" width="458">{data.physicalApproach || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Legal approach to the property as per documents (Clear / Not Clear)</td>
              <td colSpan="5" width="458">{data.legalApproach || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Any other features like board of other financier indicating mortgage, notice of Court/any authority which may affect the security</td>
              <td colSpan="5" width="458">{data.otherFeatures || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-bold" colSpan="8" width="818">PROPERTY DETAILS</td>
            </tr>
            <tr>
              <td rowSpan="3" width="203">Occupant</td>
              <td colSpan="3" width="250">Vacant/Occupied</td>
              <td colSpan="4" width="365">{data.vacantOccupied || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">Name of Occupant</td>
              <td colSpan="4" width="365">{data.nameOfOccupant || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">Relation with applicant</td>
              <td colSpan="4" width="365">{data.relationWithApplicant || 'N/A'}</td>
            </tr>
            <tr>
              <td rowSpan="11" width="203">Building details</td>
              <td colSpan="3" width="250">Property Demarcation (Yes/No)</td>
              <td colSpan="4" width="365">{data.propertyDemarcation || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">Property Identified (Yes/No)</td>
              <td colSpan="4" width="365">{data.propertyIdentified || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">Property Identified through</td>
              <td colSpan="4" width="365">{data.propertyIdentifiedThrough || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">Type of structure</td>
              <td colSpan="4" width="365">{data.typeOfStructure || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">Land/Plot Area</td>
              <td colSpan="4" width="365">{data.landPlotArea || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">No of Blocks if applicable</td>
              <td colSpan="4" width="365">{data.noOfBlocks || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">No of Units on floor</td>
              <td colSpan="4" width="365">{data.noOfUnitsOnFloor || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">No. of Floors</td>
              <td colSpan="4" width="365">{data.noOfFloors || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">No. of Lifts</td>
              <td colSpan="4" width="365">{data.noOfLifts || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">Amenities Available (e.g. Swimming Pool, Club House, etc.)</td>
              <td colSpan="4" width="365">{data.amenitiesAvailable || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">Delivery Agency (Public Sector Agency, Co-operative Society, Pvt. Builders, Self-Construction etc.)</td>
              <td colSpan="4" width="365">{data.deliveryAgency || 'N/A'}</td>
            </tr>
            <tr>
              <td rowSpan="4" width="203">Unit details</td>
              <td colSpan="3" width="250">Property located on Floor Number</td>
              <td colSpan="4" width="365">{data.propertyFloorNumber || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">No. of rooms</td>
              <td colSpan="4" width="365">{data.noOfRooms || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">Applicable area as per measurement</td>
              <td colSpan="4" width="365">{data.applicableArea || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="250">Remarks on view from property (Park/ Main Road /Other Building/sea etc)</td>
              <td colSpan="4" width="365">{data.remarksOnView || 'N/A'}</td>
            </tr>
            <tr>
              <td width="203">Quality of construction (Good /Avg./ Bad)</td>
              <td colSpan="2" width="157">Exteriors</td>
              <td colSpan="2" width="180">{data.exteriors || 'N/A'}</td>
              <td width="112">Interiors</td>
              <td colSpan="2" width="166">{data.interiors || 'N/A'}</td>
            </tr>
            <tr>
              <td width="203">Age of the property considering max age of property as 60 yrs</td>
              <td colSpan="2" width="157">{data.ageOfProperty || 'N/A'}</td>
              <td colSpan="3" width="292">Residual life considering max age of property as 50 yrs</td>
              <td colSpan="2" width="166">{data.residualLife || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-bold" colSpan="8" width="818">SANCTION PLAN APPROVAL & OTHER DOCUMENTS DETAILS</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Sanctioned plans verified with approval no</td>
              <td colSpan="5" width="458">{data.sanctionedPlans || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Ownership type (Leasehold/ Freehold)</td>
              <td colSpan="5" width="458">{data.ownershipType || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Property documents verified</td>
              <td colSpan="5" width="458">{data.propertyDocumentsVerified || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Is the property within Municipal Limits</td>
              <td colSpan="5" width="458">{data.propertyWithinMunicipalLimits || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Permissible usage allow as per master plan</td>
              <td colSpan="5" width="458">{data.permissibleUsage || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Whether property under demolition list as per authority (Y/N)</td>
              <td colSpan="5" width="458">{data.propertyUnderDemolition || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-bold" colSpan="8" width="818">Floor Wise Area (In Sft.)</td>
            </tr>
            <tr>
              <td width="203">Floor</td>
              <td colSpan="2" width="157">Sanctioned/ Permissible/ area</td>
              <td colSpan="2" width="180">Total Constructed in Sqft</td>
              <td colSpan="3">Deviation</td>
            </tr>
            <tr>
              <td width="203">Basement Floor</td>
              <td colSpan="2" width="157">{data.basementFloor || 'N/A'}</td>
              <td colSpan="2" width="180">{data.totalConstructed || 'N/A'}</td>
              <td colSpan="3">{data.deviation || 'N/A'}</td>
            </tr>
            <tr>
              <td width="203">Ground Floor</td>
              <td colSpan="2" width="157">{data.groundFloor || 'N/A'}</td>
              <td colSpan="2" width="180">{data.totalConstructed || 'N/A'}</td>
              <td colSpan="3">{data.deviation || 'N/A'}</td>
            </tr>
            <tr>
              <td width="203">First Floor</td>
              <td colSpan="2" width="157">{data.firstFloor || 'N/A'}</td>
              <td colSpan="2" width="180">{data.totalConstructed || 'N/A'}</td>
              <td colSpan="3">{data.deviation || 'N/A'}</td>
            </tr>
            <tr>
              <td width="203">Second Floor</td>
              <td colSpan="2" width="157">{data.secondFloor || 'N/A'}</td>
              <td colSpan="2" width="180">{data.totalConstructed || 'N/A'}</td>
              <td colSpan="3">{data.deviation || 'N/A'}</td>
            </tr>
            <tr>
              <td width="203">Third Floor</td>
              <td colSpan="2" width="157">{data.thirdFloor || 'N/A'}</td>
              <td colSpan="2" width="180">{data.totalConstructed || 'N/A'}</td>
              <td colSpan="3">{data.deviation || 'N/A'}</td>
            </tr>
            <tr>
              <td width="203">Fourth Floor</td>
              <td colSpan="2" width="157">{data.fourthFloor || 'N/A'}</td>
              <td colSpan="2" width="180">{data.totalConstructed || 'N/A'}</td>
              <td colSpan="3">{data.deviation || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-bold" colSpan="8" width="818">VALUATION</td>
            </tr>
            <tr>
              <td className="font-bold" colSpan="8" width="818">(A) Description of Constructed Area and Rates</td>
            </tr>
            <tr>
              <td className="font-bold" width="203">For Row House /Plots/ Villa and</td>
              <td className="font-bold" colSpan="2" width="157">Description</td>
              <td className="font-bold" colSpan="2" width="180">Area (Sft.)</td>
              <td className="font-bold">Rate (Sft.)</td>
              <td className="font-bold" colSpan="2">Amount</td>
            </tr>
            <tr>
              <td rowSpan="2" width="203">{data.description || 'N/A'}</td>
              <td colSpan="2" width="157">Land Area</td>
              <td colSpan="2" width="180">{data.landArea || 'N/A'}</td>
              <td>{data.rate || 'N/A'}</td>
              <td colSpan="2">{data.amount || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="2" width="157">Construction rate (as on date)</td>
              <td colSpan="2" width="180">{data.constructionRate || 'N/A'}</td>
              <td>800</td>
              <td colSpan="2">676800</td>
            </tr>
            <tr>
              <td width="203">For Flat /Office/Shops/ Builder Floors</td>
              <td colSpan="2" width="157">Applicable Area</td>
              <td colSpan="2" width="180">0</td>
              <td>0</td>
              <td colSpan="2">0</td>
            </tr>
            <tr>
              <td width="203">Stage of construction in %</td>
              <td colSpan="2" width="157">{data.stageOfConstruction || 'N/A'}</td>
              <td colSpan="3" width="292">Stage of Recommendation in %</td>
              <td colSpan="2">{data.stageOfRecommendation || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-bold" colSpan="8" width="818">(B) Value of Extra Amenities if applicable</td>
            </tr>
            <tr>
              <td width="203">Car Parking</td>
              <td width="119">{data.carParking || 'N/A'}</td>
              <td colSpan="2" width="131">IDC</td>
              <td width="87">{data.powerBackup || 'N/A'}</td>
              <td>{data.other || 'N/A'}</td>
              <td colSpan="2"></td>
            </tr>
            <tr>
              <td width="203"></td>
              <td width="119"></td>
              <td colSpan="2" width="131"></td>
              <td width="87"></td>
              <td></td>
              <td colSpan="2"></td>
            </tr>
            <tr>
              <td colSpan="6" width="652">Total Amenities charges</td>
              <td colSpan="2">{data.totalAmenitiesCharges || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="6" width="652">Total Market Value of Property as on Date (A+B)</td>
              <td colSpan="2">{data.totalMarketValue || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="6" width="652">Guideline Value of The Property</td>
              <td colSpan="2">{data.guidelineValue || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="6" width="652">Forced Sale Value</td>
              <td colSpan="2">{data.forcedSaleValue || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="3" width="360">Approx. Rentals in case of 100% complete property</td>
              <td colSpan="5" width="458">Rs- NA/- per month</td>
            </tr>
            <tr>
              <td colSpan="8" width="818">BOUNDARIES</td>
            </tr>
            <tr>
              <td className="font-bold" width="203">Boundaries</td>
              <td className="font-bold" colSpan="2" width="157">EAST</td>
              <td className="font-bold" colSpan="2" width="180">WEST</td>
              <td className="font-bold">NORTH</td>
              <td className="font-bold" colSpan="2">SOUTH</td>
            </tr>
            <tr>
              <td className="font-bold" width="203">As per deed</td>
              <td colSpan="2" width="157">{data.eastBoundary || 'N/A'}</td>
              <td colSpan="2" width="180">{data.westBoundary || 'N/A'}</td>
              <td width="112">{data.northBoundary || 'N/A'}</td>
              <td colSpan="2" width="166">{data.southBoundary || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-bold" width="203">At site</td>
              <td colSpan="2" width="157">{data.eastBoundary || 'N/A'}</td>
              <td colSpan="2" width="180">{data.westBoundary || 'N/A'}</td>
              <td width="112">HOUSE OF GOKUL AND OPEN AREA</td>
              <td colSpan="2" width="166">ROAD AND UC PLOT OF RAMESH JI</td>
            </tr>
            <tr>
              <td className="font-bold" width="203">Boundaries Matching</td>
              <td colSpan="7" width="615">{data.boundariesMatching || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="8" width="818">Remarks-:</td>
            </tr>
            <tr>
              <td id="catching" colSpan="8" rowSpan="9" width="818">
                {data.remarks.split('\n').map((remark, index) => (
                  <React.Fragment key={index}>
                    {index + 1}. {remark}
                    <br />
                  </React.Fragment>
                ))}
                <p className="text-red-500">
                  8. SUGGESTED TO CREDIT TEAM PLEASE CHECK THE PROPER LEGAL OWNERSHIP DOCUMENTS OF THE PROPERTY.<br />
                  9. AT SITE G.F COMPLETED AND F.F IS UNDER CONSTRUCTION COMPLETE COLUMN UP TO SLAB WORK ALSO ACCESS FOR F.F NOT FROM MORTGAGING AREA<br />
                  10. ACCESS OF THE HOUSE ROAD WIDTH APPROX. 7 FT ONLY. ALSO REAR SIDE OTHER HOUSES ACCESS IS FROM CUSTOMER PROPERTY AND OTHER ACCESS OF REAR SIDE HOUSES IS ONLY 3 FT GALI<br />
                  11. INDEMNITIES TO BE TAKEN FROM CUSTOMER FOR PROPERTY SEPARABLE CONDITION IN FURTHER<br />
                  12. VALUER IS NOT RESPONSIBLE FOR ANY LEGAL DISPUTE.<br />
                </p>
              </td>
            </tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr>
              <td colSpan="8" width="818">DECLARATION:</td>
            </tr>
            <tr>
              <td colSpan="8" width="818">{data.declaration || 'N/A'}</td>
            </tr>
            <tr>
              <td colSpan="2" width="322">Name of Engineer who visited the property-:</td>
              <td colSpan="3" width="218">{data.engineerName || 'N/A'}</td>
              <td width="112"></td>
              <td width="106"></td>
              <td width="60"></td>
            </tr>
            <tr>
              <td width="203"></td>
              <td width="119"></td>
              <td width="38"></td>
              <td width="93"></td>
              <td width="87"></td>
              <td width="112"></td>
              <td width="106"></td>
              <td width="60"></td>
            </tr>
            <tr>
              <td width="203"></td>
              <td width="119"></td>
              <td width="38"></td>
              <td width="93"></td>
              <td width="87"></td>
              <td colSpan="3" width="278">{data.authorizedSignatory || '(Authorized Signatory)'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SamstaFln;