import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx-js-style";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDetailsById } from "../../redux/features/Banks/AdityaBank/adityaThunks";
import FileDownload from "../../components/FileDownload";
import { finalUpdate } from "../../redux/features/assignedCase/assignedCasesThunk";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdityaDetails = () => {
  const reportRef = useRef();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const CPANEL = import.meta.env.VITE_CPANEL_DOMAIN

  const reportData = useSelector((state) => state?.aditya.detail);

  function cleanPath(path) {
    return path.replace(/^undefined\/?/, "");
  }

  // ! START

  // const handleStructureExport = () => {
  //   const tableElement = document.getElementById("reportTable");
  //   if (!tableElement) {
  //     alert("Report Table Not Found");
  //     return;
  //   }

  //   const worksheet = XLSX.utils.table_to_sheet(tableElement, { raw: true });
  //   const range = XLSX.utils.decode_range(worksheet["!ref"]);

  //   // 🔁 Step 1: Apply default styles (border + alignment) to all cells
  //   for (let R = range.s.r; R <= range.e.r; ++R) {
  //     for (let C = range.s.c; C <= range.e.c; ++C) {
  //       const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
  //       if (!worksheet[cellAddress]) worksheet[cellAddress] = { t: "s", v: "" }; // Empty cell fix

  //       const cell = worksheet[cellAddress];
  //       cell.s = cell.s || {};
  //       cell.s.border = {
  //         top: { style: "thin", color: { rgb: "000000" } },
  //         bottom: { style: "thin", color: { rgb: "000000" } },
  //         left: { style: "thin", color: { rgb: "000000" } },
  //         right: { style: "thin", color: { rgb: "000000" } },
  //       };
  //       cell.s.alignment = {
  //         vertical: "center",
  //         horizontal: "center",
  //         wrapText: true,
  //       };
  //     }
  //   }

  //   // 🟨 Step 2: Format A1 Title
  //   const titleCell = worksheet["A1"];
  //   if (titleCell) {
  //     titleCell.s = {
  //       font: { bold: true, sz: 18, color: { rgb: "000000" } },
  //       fill: { fgColor: { rgb: "FFF9E79F" } },
  //       alignment: { horizontal: "center", vertical: "center", wrapText: true },
  //       border: {
  //         top: { style: "medium", color: { rgb: "000000" } },
  //         bottom: { style: "medium", color: { rgb: "000000" } },
  //         left: { style: "medium", color: { rgb: "000000" } },
  //         right: { style: "medium", color: { rgb: "000000" } },
  //       },
  //     };
  //   }

  //   // 🟦 Step 3: Format Header Row (Row 2 = r=1)
  //   for (let C = range.s.c; C <= range.e.c; ++C) {
  //     const headerRef = XLSX.utils.encode_cell({ r: 1, c: C });
  //     const cell = worksheet[headerRef];
  //     if (cell) {
  //       cell.s = cell.s || {};
  //       cell.s.font = { bold: true, sz: 12 };
  //       cell.s.fill = { fgColor: { rgb: "FFD9E1F2" } };
  //       cell.s.alignment = {
  //         horizontal: "center",
  //         vertical: "center",
  //         wrapText: true,
  //       };
  //       cell.s.border = {
  //         top: { style: "thin", color: { rgb: "000000" } },
  //         bottom: { style: "thin", color: { rgb: "000000" } },
  //         left: { style: "thin", color: { rgb: "000000" } },
  //         right: { style: "thin", color: { rgb: "000000" } },
  //       };
  //     }
  //   }

  //   // 📁 Step 4: Export the styled workbook
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "FormattedReport");
  //   XLSX.writeFile(
  //     workbook,
  //     `AdityaBirla_Valuation_FormattedReport_${reportData?.caseReferenceNumber || "details"
  //     }.xlsx`
  //   );

  //   // ✅ Step 5: Handle merged cells and apply border
  //   if (worksheet["!merges"]) {
  //     worksheet["!merges"].forEach((merge) => {
  //       for (let R = merge.s.r; R <= merge.e.r; ++R) {
  //         for (let C = merge.s.c; C <= merge.e.c; ++C) {
  //           const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
  //           if (!worksheet[cellAddress])
  //             worksheet[cellAddress] = { t: "s", v: "" };

  //           const cell = worksheet[cellAddress];
  //           if (!cell.s) cell.s = {};

  //           cell.s.border = {
  //             top: { style: "thin", color: { rgb: "000000" } },
  //             bottom: { style: "thin", color: { rgb: "000000" } },
  //             left: { style: "thin", color: { rgb: "000000" } },
  //             right: { style: "thin", color: { rgb: "000000" } },
  //           };
  //           cell.s.alignment = {
  //             vertical: "center",
  //             horizontal: "center",
  //             wrapText: true,
  //           };
  //         }
  //       }
  //     });
  //   }
  // };



  // const handleStructureExportCSV = () => {
  //   const tableElement = document.getElementById("reportTable");
  //   if (!tableElement) {
  //     alert("Report Table Not Found");
  //     return;
  //   }

  //   const worksheet = XLSX.utils.table_to_sheet(tableElement, { raw: true });

  //   // 🔄 Convert worksheet to CSV format
  //   const csv = XLSX.utils.sheet_to_csv(worksheet, {
  //     FS: ",", // Field Separator
  //     RS: "\n", // Row Separator
  //     strip: true, // Trim trailing spaces
  //   });

  //   // 📁 Create downloadable file
  //   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute(
  //     "download",
  //     `AdityaBirla_Valuation_Report_${reportData?.caseReferenceNumber || "data"
  //     }.csv`
  //   );
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // ! END

  useEffect(() => {
    const fetchReportData = async (currentId) => {
      setLoading(true);
      try {
        await dispatch(fetchDetailsById(currentId));
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchReportData(id);
    } else {
      setLoading(false);
    }
  }, [id, dispatch]);



  useEffect(() => {
    console.log(reportData);

  }, [reportData])


  const handleFinalSubmit = async () => {
    if (!window.confirm("Are you sure you want to Final Submit? This will lock the report.")) return;
    try {
      setIsSaving(true);
      await dispatch(finalUpdate({ id, bankName: "aditya", updateData: reportData })).unwrap();
      toast.success("Report Finalized ✅");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to finalize report");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className='text-center py-8'>Loading...</div>;
  if (!reportData)
    return <div className='text-center py-8'>No report data found.</div>;

  return (
    <div className='container mx-auto px-4 py-8 relative'>
      {/* Sticky Action Bar for Admin/SuperAdmin */}
      {(user?.role === "Admin" || user?.role === "SuperAdmin") && (
        <div className="fixed top-14 left-0 right-0 z-50 bg-white shadow-md p-3 flex justify-center gap-4 border-b">
          <button
            onClick={handleFinalSubmit}
            disabled={isSaving || reportData?.status === "FinalSubmitted"}
            className={`px-6 py-2 rounded-full font-semibold text-white shadow-lg transition-all ${
              isSaving || reportData?.status === "FinalSubmitted"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-700 hover:scale-105 active:scale-95"
            }`}
          >
            {isSaving ? "Finalizing..." : reportData?.status === "FinalSubmitted" ? "Final Submitted ✅" : "Final Submit"}
          </button>
          
          <button
            onClick={() => window.print()}
            className="px-6 py-2 rounded-full font-semibold text-white shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 active:scale-95 transition-all"
          >
            Download PDF
          </button>
        </div>
      )}

      <div className={`bg-white shadow-xl rounded-lg overflow-hidden ${(user?.role === "Admin" || user?.role === "SuperAdmin") ? "mt-16" : ""}`}>
        {/* <div className='flex justify-end gap-4 my-4 px-4'>
          <button
            onClick={() => window.print()}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Print / Save as PDF
          </button>
          <button
            onClick={handleStructureExport}
            className='bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700'
          >
            Export to Excel
          </button>
          <button
            onClick={handleStructureExportCSV}
            className='bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600'
          >
            Export to CSV
          </button>
        </div>
         */}

        <FileDownload data={reportData} tableId='reportTable' name={"aditya"} />

        <div className='' id='print-section'>
          <div ref={reportRef} className='p-3 bg-white shadow border'>
            <table id='reportTable' className='w-full border-collapse'>
              <tbody>
                <tr>
                  <td
                    colSpan='5'
                    className='bg-gray-100 p-4 text-center font-bold text-lg'
                  >
                    Aditya Birla Finance Limited Valuation Report
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan='5'
                    className='bg-gray-50 p-3 text-center font-semibold'
                  >
                    Basic Details
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Name of the Valuer</td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.valuerName}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Name of the Client</td>
                  <td className='border p-3'>{reportData?.clientName}</td>
                  <td className='border p-3 bg-gray-50'>Initiation Date</td>
                  <td colSpan='2' className='border p-3'>
                    {reportData?.initiationDate}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Vertical</td>
                  <td className='border p-3'>{reportData?.vertical}</td>
                  <td className='border p-3 bg-gray-50'>Visit Date</td>
                  <td colSpan='2' className='border p-3'>
                    {reportData?.visitDate}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Case Reference Number
                  </td>
                  <td className='border p-3'>
                    {reportData?.caseReferenceNumber}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Name of the Property Owner
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.propertyOwners}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan='5'
                    className='bg-gray-50 p-3 text-center font-semibold'
                  >
                    Location Details
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Property Address as Per TRF
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.propertyAddressTRF}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Property Address as Per Visit
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.propertyAddressVisit}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Property Address as Per "Docs"
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.propertyAddressDocs}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Main Locality</td>
                  <td className='border p-3'>{reportData?.mainLocality}</td>
                  <td className='border p-3 bg-gray-50'>Sub Locality</td>
                  <td colSpan='2' className='border p-3'>
                    {reportData?.subLocality}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Micro Location</td>
                  <td className='border p-3'>{reportData?.microLocation}</td>
                  <td className='border p-3 bg-gray-50'>Landmark</td>
                  <td colSpan='2' className='border p-3'>
                    {reportData?.landmark}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Latitude</td>
                  <td className='border p-3'>{reportData?.latitude}</td>
                  <td className='border p-3 bg-gray-50'>Longitude</td>
                  <td colSpan='2' className='border p-3'>
                    {reportData?.longitude}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Type of Property</td>
                  <td className='border p-3'>{reportData?.propertyType}</td>
                  <td className='border p-3 bg-gray-50'>Current Usage</td>
                  <td colSpan='2' className='border p-3'>
                    {reportData?.currentUsage}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Has the Valuator Done Valuation for this property before?
                  </td>
                  <td className='border p-3'>
                    {reportData?.previousValuation}
                  </td>
                  <td className='border p-3 bg-gray-50'>If yes, when</td>
                  {/* Your original code has an empty td after "If yes, when" value, ensure reportData.ifYesWhen is what you need or colspan the previous */}
                  <td className='border p-3'>
                    {reportData?.previousValuationDate}
                  </td>
                  <td className='border p-3'></td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Property Type</td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.propertyType}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Property Sub Type</td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.propertySubType}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Locality</td>
                  <td className='border p-3'>{reportData?.locality}</td>
                  <td className='border p-3 bg-gray-50'>
                    Property Falling Within
                  </td>
                  <td colSpan='2' className='border p-3'>
                    {reportData?.propertyFallingWithin}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Occupancy Level of the Surrounding
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.occupancyLevel}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Condition of the Site of the Property
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.siteCondition}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Distance to Railway/Metro Station
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.distanceToRailway}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Distance to Bus Stop
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.distanceToBusStop}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Distance of Plot from Main Road
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.distanceFromMainRoad}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Distance from City Centre
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.distanceFromCityCentre}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Distance from ABFL Branch
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.distanceFromBranch}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Width of the Approach Road
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.approachRoadWidth}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Dimensions of the Property
                  </td>
                  <td className='border p-3'>{reportData?.propertyLength}</td>
                  <td className='border p-3'>{reportData?.propertyBreadth}</td>
                  <td className='border p-3 bg-gray-50'>Depth in Feet</td>
                  <td className='border p-3'>{reportData?.propertyDepth}</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Physical Approach to the Property
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.physicalApproach}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Legal Approach to the Property
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.legalApproach}
                  </td>
                </tr>
                <tr>
                  <td colSpan='4' className='border p-3 bg-gray-50'>
                    Any other features like board of other financier...
                  </td>
                  <td className='border p-3'>{reportData?.otherFeatures}</td>
                </tr>
                <tr>
                  <td
                    colSpan='5'
                    className='bg-gray-50 p-3 text-center font-semibold'
                  >
                    Property Details
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Occupancy</td>
                  <td className='border p-3'>{reportData?.occupancyStatus}</td>
                  <td className='border p-3 bg-gray-50'>Occupied By</td>
                  <td colSpan='2' className='border p-3'>
                    {reportData?.occupiedBy}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Occupied Since</td>
                  <td className='border p-3'>{reportData?.occupiedSince}</td>
                  <td colSpan='2' className='border p-3 bg-gray-50'>
                    Name of the Occupant
                  </td>
                  <td className='border p-3'>{reportData?.occupantName}</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Property Demarcated</td>
                  <td className='border p-3'>
                    {reportData?.propertyDemarcated}
                  </td>
                  <td colSpan='2' className='border p-3 bg-gray-50'>
                    Property Identification
                  </td>
                  <td className='border p-3'>
                    {reportData?.propertyIdentification}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Identification through
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.identificationThrough}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Project Category</td>
                  <td colSpan='2' className='border p-3'>
                    {reportData?.projectCategory}
                  </td>
                  <td className='border p-3 bg-gray-50'>Flat Type</td>
                  <td className='border p-3'>{reportData?.flatType}</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Flat Configuration</td>
                  <td className='border p-3'>
                    {reportData?.flatConfiguration}
                  </td>
                  <td colSpan='2' className='border p-3 bg-gray-50'>
                    Property Holding
                  </td>
                  <td className='border p-3'>{reportData?.propertyHolding}</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Type of Structure</td>
                  <td colSpan='2' className='border p-3'>
                    {reportData?.structureType}
                  </td>
                  <td className='border p-3 bg-gray-50'>Area of PLOT</td>
                  <td className='border p-3'>{reportData?.plotArea}</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Total No of Floors</td>
                  <td colSpan='2' className='border p-3'>
                    {reportData?.totalFloors}
                  </td>
                  <td className='border p-3 bg-gray-50'>Lift Facility</td>
                  <td className='border p-3'>{reportData?.liftFacility}</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Amenities</td>
                  <td className='border p-3'>{reportData?.amenities}</td>
                  {/* The cell below was empty in original, assuming it's for layout or was meant for another amenity detail */}
                  <td className='border p-3'></td>
                  <td className='border p-3 bg-gray-50'>Marketability</td>
                  <td className='border p-3'>{reportData?.marketability}</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Floor Rise</td>
                  <td className='border p-3'>{reportData?.floorRise}</td>
                  <td className='border p-3 bg-gray-50'>Type of Property</td>
                  <td className='border p-3'>{reportData?.propertyType}</td>
                  {/* Label "Property Title" is here, but value is in next td in original table structure. */}
                  <td className='border p-3 bg-gray-50'>Property Title</td>
                </tr>
                {/* This row has empty td for Property Title value from previous row in original structure. Then other fields. */}
                <tr>
                  {/* <td className="border p-3">{reportData?.propertyTitle}</td>  This would be the value for "Property Title" if it's a separate cell. Currently, "Property Title" label and its value are expected in the same conceptual row but split across two <tr> in your HTML snippet if we strictly follow its end. I'm assuming propertyTitle is a field. */}
                  <td className='border p-3 bg-gray-50'>Document Status</td>
                  <td className='border p-3'>{reportData?.documentStatus}</td>
                  <td className='border p-3 bg-gray-50'>Encumbrances</td>
                  <td className='border p-3'>{reportData?.encumbrances}</td>
                  {/* Label "Project Approval" is here */}
                  <td className='border p-3 bg-gray-50'>Project Approval</td>
                </tr>
                <tr>
                  {/* <td className="border p-3">{reportData?.projectApproval}</td> Value for Project Approval*/}
                  <td className='border p-3 bg-gray-50'>
                    Legal Title Validity
                  </td>
                  <td className='border p-3'>
                    {reportData?.legalTitleValidity}
                  </td>
                  <td className='border p-3 bg-gray-50'>Development Status</td>
                  <td className='border p-3'>
                    {reportData?.developmentStatus}
                  </td>
                  {/* Label "Completion Status" is here */}
                  <td className='border p-3 bg-gray-50'>Completion Status</td>
                </tr>

                {/* Area Details */}
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Carpet Area (as per plan)
                  </td>
                  <td className='border p-3'>{reportData?.carpetAreaPlan}</td>
                  <td colSpan='2' className='border p-3 bg-gray-50'>
                    {" "}
                    {/* Label for measurement */}
                    Carpet Area (as per measurement)
                  </td>
                  <td className='border p-3'>
                    {reportData?.carpetAreaMeasurement}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Built Up Area (as per Norms)
                  </td>
                  <td className='border p-3'>{reportData?.builtUpAreaNorms}</td>
                  <td colSpan='2' className='border p-3 bg-gray-50'>
                    {" "}
                    {/* Label for measurement */}
                    Built Up Area (as per measurement)
                  </td>
                  <td className='border p-3'>
                    {reportData?.builtUpAreaMeasurement}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Super Built-Up Area</td>
                  <td className='border p-3'>{reportData?.superBuiltUpArea}</td>
                  <td colSpan='2' className='border p-3'>
                    {" "}
                    {/* In your JSX these display the same value */}
                    {reportData?.superBuiltUpArea}
                  </td>
                  <td className='border p-3'>{reportData?.superBuiltUpArea}</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Car Park</td>
                  <td className='border p-3'>{reportData?.carPark}</td>
                  <td colSpan='2' className='border p-3'>
                    {" "}
                    {/* In your JSX these display the same value */}
                    {reportData?.carPark}
                  </td>
                  <td className='border p-3'>{reportData?.carPark}</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Amenities</td>
                  <td className='border p-3'>{reportData?.amenities}</td>
                  <td colSpan='2' className='border p-3'>
                    {" "}
                    {/* In your JSX these display the same value */}
                    {reportData?.amenities}
                  </td>
                  <td className='border p-3'>{reportData?.amenities}</td>
                </tr>

                {/* Other Details & Setbacks */}
                <tr>
                  <td className='border p-3 bg-gray-50 font-semibold'>
                    Other Details
                  </td>
                  <td colSpan='4' className='border p-3'></td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Setbacks</td>
                  <td className='border p-3'>As per plan/ Bye laws</td>
                  <td className='border p-3'>Actual at site</td>
                  <td className='border p-3'>Deviation</td>
                  <td className='border p-3'>Remarks, if any</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Front</td>
                  <td className='border p-3'>{reportData?.front}</td>
                  <td className='border p-3'>0 Ft</td>
                  <td rowSpan='4' className='border p-3 align-top'>
                    {" "}
                    {/* Added align-top for better look with rowspan */}
                    Usage Deviation
                    {/* If this comes from reportData, use {reportData?.usageDeviation} */}
                  </td>
                  <td rowSpan='4' className='border p-3 align-top'>
                    {/* If this comes from reportData, use {reportData?.setbackRemarks} */}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Side1(Left)</td>
                  <td className='border p-3'>{reportData?.side1}</td>
                  <td className='border p-3'>0 Ft</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Side2(Right)</td>
                  <td className='border p-3'>{reportData?.side2}</td>
                  <td className='border p-3'>0 Ft</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Rear</td>
                  <td className='border p-3'>{reportData?.rear}</td>
                  <td className='border p-3'>0 Ft</td>
                </tr>

                {/* Valuation Summary */}
                <tr>
                  <td className='border p-3 bg-gray-50'>Total Value</td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.totalValue}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Distress Value (80%)
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.distressValue}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Insurance Value</td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.insuranceValue}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Government Value</td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.governmentValue}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>
                    Percentage Completion
                  </td>
                  <td className='border p-3'>
                    {reportData?.percentageCompletion}
                  </td>
                  <td colSpan='2' className='border p-3 bg-gray-50'>
                    Percentage Recommendation
                  </td>
                  <td className='border p-3'>
                    {reportData?.percentageRecommendation}
                  </td>
                </tr>

                {/* Boundary Detailing */}
                <tr>
                  <td className='border p-3 bg-gray-50 font-semibold'>
                    Boundary Detailing
                  </td>
                  <td colSpan='4' className='border p-3'></td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Detailing</td>
                  <td className='border p-3 font-semibold'>North</td>
                  <td className='border p-3 font-semibold'>South</td>
                  <td className='border p-3 font-semibold'>East</td>
                  <td className='border p-3 font-semibold'>West</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>As per docs.</td>
                  <td className='border p-3'>{reportData?.north}</td>
                  <td className='border p-3'>{reportData?.south}</td>
                  <td className='border p-3'>{reportData?.east}</td>
                  <td className='border p-3'>{reportData?.west}</td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>As per Actual</td>
                  <td className='border p-3'>{reportData?.north}</td>{" "}
                  {/* Assuming same data as 'docs', or use reportData?.northActual */}
                  <td className='border p-3'>{reportData?.south}</td>{" "}
                  {/* Assuming same data as 'docs', or use reportData?.southActual */}
                  <td className='border p-3'>{reportData?.east}</td>{" "}
                  {/* Assuming same data as 'docs', or use reportData?.eastActual */}
                  <td className='border p-3'>{reportData?.west}</td>{" "}
                  {/* Assuming same data as 'docs', or use reportData?.westActual */}
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50'>Boundary Matching</td>
                  <td colSpan='4' className='border p-3'>
                    NO{" "}
                    {/* Or {reportData?.boundaryMatchingStatus} if dynamic */}
                  </td>
                </tr>
                <tr>
                  <td className='border p-3 bg-gray-50 font-semibold'>
                    Remarks:
                  </td>
                  <td colSpan='4' className='border p-3'>
                    {reportData?.remarks}
                  </td>
                </tr>
                <tr>
                  <td colSpan='2' className='border p-3 bg-gray-50'>
                    Name of the Engineer visited
                  </td>
                  <td colSpan='3' className='border p-3'>
                    {reportData?.engineerName}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan='5'
                    className='border p-3 bg-gray-50 text-center font-semibold'
                  >
                    {" "}
                    {/* Added text-center and font-semibold */}
                    PHOTOGRAPHS OF PROPERTY
                  </td>
                </tr>
                <tr>
                  <td colSpan='2' className='border p-3 bg-gray-50'>
                    Subject Property
                  </td>
                  <td colSpan='3' className='border p-3'>
                    {reportData?.propertyPhotos?.length > 0 ? (
                      reportData.propertyPhotos.map((item, index) => {
                        const imageUrl = cleanPath(item);

                        return (
                          <img
                            key={index}
                            src={`${CPANEL}/${imageUrl}`}
                            alt={`photo-${index}`}
                            className="w-32 inline-block mr-2 mb-2"
                          />
                        );
                      })
                    ) : (
                      <span>No Images</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdityaDetails;
