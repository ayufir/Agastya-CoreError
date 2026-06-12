import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getDetailsById } from "../../redux/features/Banks/manappuram/ManappuramThunks";
import { useEffect, useState } from "react";
import { finalUpdate } from "../../redux/features/assignedCase/assignedCasesThunk";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ManapuramDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useSelector((state) => state.auth);

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

  const { singleDetail } = useSelector((state) => state.manappuram) || {};

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleExportPDF = () => {
    const input = document.getElementById("reportContainer");
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

      pdf.save("Manappuram_Technical_Report.pdf");
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
    saveAs(blob, "Manappuram_Technical_Report.xlsx");
  };

  const handleExportCSV = () => {
    const table = document.getElementById("reportTable");
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Manappuram_Technical_Report.csv");
  };

  const handleFinalSubmit = async () => {
    if (!window.confirm("Are you sure you want to Final Submit? This will lock the report.")) return;
    try {
      setIsSaving(true);
      await dispatch(finalUpdate({ id, bankName: "manappuram", updateData: singleDetail })).unwrap();
      toast.success("Report Finalized ✅");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to finalize report");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='p-4 max-w-6xl mx-auto relative'>
      {/* Sticky Action Bar for Admin/SuperAdmin */}
      {(user?.role === "Admin" || user?.role === "SuperAdmin") && (
        <div className="fixed top-14 left-0 right-0 z-50 bg-white shadow-md p-3 flex justify-center gap-4 border-b">
          <button
            onClick={handleFinalSubmit}
            disabled={isSaving || singleDetail?.status === "FinalSubmitted"}
            className={`px-6 py-2 rounded-full font-semibold text-white shadow-lg transition-all ${
              isSaving || singleDetail?.status === "FinalSubmitted"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-700 hover:scale-105 active:scale-95"
            }`}
          >
            {isSaving ? "Finalizing..." : singleDetail?.status === "FinalSubmitted" ? "Final Submitted ✅" : "Final Submit"}
          </button>
          
          <button
            onClick={handleExportPDF}
            className="px-6 py-2 rounded-full font-semibold text-white shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 active:scale-95 transition-all"
          >
            Download PDF
          </button>
        </div>
      )}

      <div className={`${(user?.role === "Admin" || user?.role === "SuperAdmin") ? "mt-16" : ""}`}>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>
          Property Valuation Report
        </h1>
        <div className='space-x-2'>
          <button
            onClick={handleExportPDF}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
          >
            PDF
          </button>
          <button
            onClick={handleExportExcel}
            className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
          >
            Excel
          </button>
          <button
            onClick={handleExportCSV}
            className='px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors'
          >
            CSV
          </button>
        </div>
      </div>

      <div id='reportContainer' className='bg-white rounded-lg shadow-md p-6'>
        {/* Hidden table for exports (keeps original structure for exports) */}
        <table id='reportTable' className='hidden'>
          {/* ... (keep your original table structure exactly as is) ... */}
        </table>

        {/* New clean UI */}
        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4'>
            <div>
              <h3 className='font-semibold text-gray-700'>Valuer Name</h3>
              <p className='text-gray-900'>{singleDetail?.valuerName || "-"}</p>
            </div>
            <div>
              <h3 className='font-semibold text-gray-700'>Date of Visit</h3>
              <p className='text-gray-900'>
                {formatDate(singleDetail?.dateOfVisit) || "-"}
              </p>
            </div>
            <div>
              <h3 className='font-semibold text-gray-700'>Case Ref. No</h3>
              <p className='text-gray-900'>{singleDetail?.caseRefNo || "-"}</p>
            </div>
            <div>
              <h3 className='font-semibold text-gray-700'>Date of Report</h3>
              <p className='text-gray-900'>
                {formatDate(singleDetail?.dateOfReport) || "-"}
              </p>
            </div>
          </div>

          <div className='border-b pb-4'>
            <h3 className='font-semibold text-gray-700 mb-2'>
              Contacted Person for property inspection
            </h3>
            <p className='text-gray-900'>
              {singleDetail?.contactPersonName || "-"}{" "}
              {singleDetail?.contactPersonMobile || ""}
            </p>
          </div>

          <div className='border-b pb-4'>
            <h3 className='font-semibold text-lg text-gray-800 mb-3'>
              Property Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='font-medium text-gray-700'>
                  Applicant/s Name/s
                </h4>
                <p className='text-gray-900'>
                  {singleDetail?.applicantsName || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Owner</h4>
                <p className='text-gray-900'>{singleDetail?.owner || "-"}</p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Document Produced</h4>
                <p className='text-gray-900'>
                  {singleDetail?.documentProduced || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Type of property</h4>
                <p className='text-gray-900'>
                  {singleDetail?.propertyType || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Current Usage</h4>
                <p className='text-gray-900'>
                  {singleDetail?.propertyUsage || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Holding Type</h4>
                <p className='text-gray-900'>
                  {singleDetail?.holdingType || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className='border-b pb-4'>
            <h3 className='font-semibold text-lg text-gray-800 mb-3'>
              Property Details
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='font-medium text-gray-700'>Usage Authorized</h4>
                <p className='text-gray-900'>
                  {singleDetail?.usageAuthorized || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Usage Restriction</h4>
                <p className='text-gray-900'>
                  {singleDetail?.usageRestriction || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Occupancy Status</h4>
                <p className='text-gray-900'>
                  {singleDetail?.occupancyStatus || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Measurement</h4>
                <p className='text-gray-900'>
                  {singleDetail?.measurement || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>
                  Distance from Branch
                </h4>
                <p className='text-gray-900'>
                  {singleDetail?.distanceFromBranch || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className='border-b pb-4'>
            <h3 className='font-semibold text-lg text-gray-800 mb-3'>
              Location Details
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='font-medium text-gray-700'>Address</h4>
                <p className='text-gray-900'>
                  {singleDetail?.addressAsPerDocument || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Land Mark</h4>
                <p className='text-gray-900'>{singleDetail?.landMark || "-"}</p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Location</h4>
                <p className='text-gray-900'>{singleDetail?.location || "-"}</p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Connectivity</h4>
                <p className='text-gray-900'>
                  {singleDetail?.connectivity || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Site Access</h4>
                <p className='text-gray-900'>
                  {singleDetail?.siteAccess || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>
                  Proximity to Amenities
                </h4>
                <p className='text-gray-900'>
                  {singleDetail?.proximityToAmenities || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>
                  Distance from City Centre
                </h4>
                <p className='text-gray-900'>
                  {singleDetail?.distanceFromCityCentre || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className='border-b pb-4'>
            <h3 className='font-semibold text-lg text-gray-800 mb-3'>
              Boundaries
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='font-medium text-gray-700'>East</h4>
                <p className='text-gray-900'>
                  {singleDetail?.eastBoundary || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>West</h4>
                <p className='text-gray-900'>
                  {singleDetail?.westBoundary || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>North</h4>
                <p className='text-gray-900'>
                  {singleDetail?.northBoundary || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>South</h4>
                <p className='text-gray-900'>
                  {singleDetail?.southBoundary || "-"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className='font-bold text-xl text-gray-900 mb-4'>
              Valuation Details
            </h2>
            <div className='space-y-4'>
              <div className='bg-gray-50 p-4 rounded'>
                <h3 className='font-semibold text-gray-700 mb-2'>
                  Land Component (GLR)
                </h3>
                <div className='grid grid-cols-3 gap-2'>
                  <div>
                    <h4 className='text-sm text-gray-500'>Area</h4>
                    <p>{singleDetail?.landComponentArea || "-"}</p>
                  </div>
                  <div>
                    <h4 className='text-sm text-gray-500'>Rate</h4>
                    <p>{singleDetail?.landComponentRate || "-"}</p>
                  </div>
                  <div>
                    <h4 className='text-sm text-gray-500'>Value</h4>
                    <p>{singleDetail?.landComponentValue || "-"}</p>
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 p-4 rounded'>
                <h3 className='font-semibold text-gray-700 mb-2'>
                  Land Component (PMR)
                </h3>
                <div className='grid grid-cols-3 gap-2'>
                  <div>
                    <h4 className='text-sm text-gray-500'>Area</h4>
                    <p>{singleDetail?.landComponentPMARea || "-"}</p>
                  </div>
                  <div>
                    <h4 className='text-sm text-gray-500'>Rate</h4>
                    <p>{singleDetail?.landComponentPMRRate || "-"}</p>
                  </div>
                  <div>
                    <h4 className='text-sm text-gray-500'>Value</h4>
                    <p>{singleDetail?.landComponentPMRValue || "-"}</p>
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 p-4 rounded'>
                <h3 className='font-semibold text-gray-700 mb-2'>
                  Construction Component
                </h3>
                <div className='grid grid-cols-3 gap-2'>
                  <div>
                    <h4 className='text-sm text-gray-500'>Area</h4>
                    <p>{singleDetail?.constructionComponentArea || "-"}</p>
                  </div>
                  <div>
                    <h4 className='text-sm text-gray-500'>Rate</h4>
                    <p>{singleDetail?.constructionComponentRate || "-"}</p>
                  </div>
                  <div>
                    <h4 className='text-sm text-gray-500'>Value</h4>
                    <p>{singleDetail?.constructionComponentValue || "-"}</p>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <h3 className='font-semibold text-gray-700'>Total Value</h3>
                  <p className='text-lg'>{singleDetail?.totalValue || "-"}</p>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-700'>
                    Distress Sale Value
                  </h3>
                  <p className='text-lg'>
                    {singleDetail?.distressSaleValue || "-"}
                  </p>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-700'>
                    Present Market Value
                  </h3>
                  <p className='text-lg'>
                    {singleDetail?.presentMarketValue || "-"}
                  </p>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-700'>
                    Forced Sale Value
                  </h3>
                  <p className='text-lg'>
                    {singleDetail?.forcedSaleValue || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='border-t pt-4'>
            <h3 className='font-semibold text-lg text-gray-800 mb-2'>
              Additional Information
            </h3>
            <div className='space-y-4'>
              <div>
                <h4 className='font-medium text-gray-700'>Observations</h4>
                <p className='text-gray-900 whitespace-pre-line'>
                  {singleDetail?.observations || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>
                  Property Description
                </h4>
                <p className='text-gray-900 whitespace-pre-line'>
                  {singleDetail?.propertyDescription || "-"}
                </p>
              </div>
              <div>
                <h4 className='font-medium text-gray-700'>Name of Applicant</h4>
                <p className='text-gray-900'>
                  {singleDetail?.nameOfApplicant || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManapuramDetails;
