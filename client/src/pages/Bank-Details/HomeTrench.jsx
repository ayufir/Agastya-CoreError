// import { useParams } from "react-router-dom";
// import React, { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import moment from "moment";
// import ExcelHeader from "../../components/Header/ExcelHeader";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import StaticLocationMap from "../../components/StaticLocationMap";

// import { getHomeTrenchReportById } from "../../redux/features/Banks/homeTrench/homeTrenchReportThunks";

// const dummyPics = [
//   {
//     url: "https://images.unsplash.com/photo-1702952815477-553ae3774509?w=600&auto=format&fit=crop&q=60",
//     location: "76m3+6qc, Gwalior, Madhya Pradesh 474001, India",
//     latitude: "26.284655",
//     longitude: "78.205254",
//     localTime: "05:13:22 PM",
//     altitude: "188 m",
//     gmt: "12:12:11 PM",
//     date: "Tuesday, 09.04.2025",
//   },
//   {
//     url: "https://images.unsplash.com/photo-1702952815477-553ae3774509?w=600&auto=format&fit=crop&q=60",
//     location: "76m3+6qc, Gwalior, Madhya Pradesh 474001, India",
//     latitude: "26.284655",
//     longitude: "78.205254",
//     localTime: "05:20:10 PM",
//     altitude: "190 m",
//     gmt: "12:20:11 PM",
//     date: "Tuesday, 09.04.2025",
//   },
//   {
//     url: "https://images.unsplash.com/photo-1702952815477-553ae3774509?w=600&auto=format&fit=crop&q=60",
//     location: "76m3+6qc, Gwalior, Madhya Pradesh 474001, India",
//     latitude: "26.284655",
//     longitude: "78.205254",
//     localTime: "05:20:10 PM",
//     altitude: "190 m",
//     gmt: "12:20:11 PM",
//     date: "Tuesday, 09.04.2025",
//   },
// ];

// const getImageSource = (image) =>
//   typeof image === "string" ? image : image?.url || "";

// const HomeTrench = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const CPANEL = import.meta.env.VITE_API_URL

//   const reportData = useSelector((state) => state?.homeTrenchReport?.report);

//   useEffect(() => {
//     if (id) {
//       dispatch(getHomeTrenchReportById(id));
//     }
//   }, [id, dispatch]);


//   // function cleanPath(path) {
//   //   return path?.replace(/^undefined\/?/, "");
//   // }

//   // console.log(reportData);

//   const handleExportPDF = async () => {
//     const source = document.getElementById("reportContent");
//     if (!source) return;

//     const clone = source.cloneNode(true);
//     clone.id = "home-trench-print-clone";
//     clone.style.cssText = [
//       "position:static",
//       "left:auto",
//       "top:auto",
//       "width:794px",
//       "max-height:none",
//       "height:auto",
//       "overflow:visible",
//       "opacity:1",
//       "background:white",
//       "padding:8px",
//       "display:block",
//     ].join(" !important;") + " !important;";

//     clone.querySelectorAll("[data-location-map='true']").forEach((mapNode) => {
//       const staticUrl = mapNode.getAttribute("data-static-map-url") || "";
//       const fallbackUrl = mapNode.getAttribute("data-fallback-map-url") || "";

//       const mapImg = document.createElement("img");
//       mapImg.alt = "Location map";
//       mapImg.style.cssText =
//         "width:100%;height:260px;border:1px solid #d1d5db;object-fit:cover;display:block;";
//       mapImg.setAttribute("crossorigin", "anonymous");
//       mapImg.setAttribute("referrerpolicy", "no-referrer");
//       if (fallbackUrl) {
//         mapImg.setAttribute("data-fallback-map-url", fallbackUrl);
//       }
//       mapImg.src = staticUrl || fallbackUrl;
//       mapImg.onerror = () => {
//         if (fallbackUrl && mapImg.src !== fallbackUrl) {
//           mapImg.src = fallbackUrl;
//         }
//       };

//       mapNode.parentNode.replaceChild(mapImg, mapNode);
//     });

//     const waitForImageLoad = (img) =>
//       new Promise((resolve) => {
//         if (!img) return resolve();
//         if (img.complete && img.naturalWidth > 0) return resolve();
//         img.onload = () => resolve();
//         img.onerror = () => resolve();
//       });

//     const toBase64 = (imgEl) =>
//       new Promise((resolve) => {
//         const src = imgEl.getAttribute("src");
//         const fallbackUrl = imgEl.getAttribute("data-fallback-map-url");

//         if (!src || src.startsWith("data:")) return resolve();

//         fetch(src, { mode: "cors" })
//           .then((response) => response.blob())
//           .then((blob) => {
//             const reader = new FileReader();
//             reader.onload = () => {
//               imgEl.src = reader.result;
//               resolve();
//             };
//             reader.onerror = () => resolve();
//             reader.readAsDataURL(blob);
//           })
//           .catch(() => {
//             if (fallbackUrl) {
//               imgEl.src = fallbackUrl;
//             }
//             resolve();
//           });
//       });

//     const wrapper = document.createElement("div");
//     wrapper.style.cssText =
//       "position:fixed;top:0;left:0;width:794px;z-index:-99999;background:white;opacity:0;pointer-events:none;";
//     wrapper.appendChild(clone);
//     document.body.appendChild(wrapper);

//     try {
//       const images = Array.from(clone.querySelectorAll("img"));
//       await Promise.allSettled(images.map(toBase64));
//       await Promise.allSettled(images.map(waitForImageLoad));
//       await new Promise((resolve) => setTimeout(resolve, 300));

//       const canvas = await html2canvas(clone, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         scrollX: 0,
//         scrollY: 0,
//         windowWidth: 794,
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const margin = 10;
//       const imgWidth = pageWidth - margin * 2;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       let position = margin;
//       let remainingHeight = imgHeight;

//       if (imgHeight > pageHeight - margin * 2) {
//         while (remainingHeight > 0) {
//           pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
//           remainingHeight -= pageHeight - margin * 2;
//           if (remainingHeight > 0) {
//             pdf.addPage();
//             position = margin - (imgHeight - remainingHeight);
//           }
//         }
//       } else {
//         pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
//       }

//       pdf.save("Home_Trench_Report.pdf");
//     } finally {
//       document.body.removeChild(wrapper);
//     }
//   };

//   const handleExportExcel = () => {
//     const table = document.getElementById("reportTable");
//     const workbook = XLSX.utils.table_to_book(table, { sheet: "Report" });
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(blob, "Baja_Ameriya_Report.xlsx");
//   };

//   const handleExportCSV = () => {
//     const table = document.getElementById("reportTable");
//     const worksheet = XLSX.utils.table_to_sheet(table);
//     const csv = XLSX.utils.sheet_to_csv(worksheet);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "Baja_Ameriya_Report.csv");
//   };

//   return (
//     <div className='w-full border p-3'>
//       {/* Wrapper for the entire content */}
//       <div className='mb-3'>
//         <div className='mb-2.5 text-right'>
//           <button
//             onClick={handleExportPDF}
//             className='mr-2.5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
//           >
//             Download PDF
//           </button>
//           <button
//             onClick={handleExportExcel}
//             className='mr-2.5 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
//           >
//             Download Excel
//           </button>
//           <button
//             onClick={handleExportCSV}
//             className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'
//           >
//             Download CSV
//           </button>
//         </div>
//       </div>
//       <div id='reportContent'>
//         {/* Header Section */}
//         <div className='flex items-center border-b pb-3'>
//           <div className='w-full'>
//             {/* <ExcelHeader /> */}
//             <img src='/assets/images/header1.jpg' alt='' />

//           </div>
//         </div>

//         <div id='reportTable'>
//           <table className='w-full border-collapse border border-gray-300'>
//             <tbody>
//               <tr className='bg-gray-100'>
//                 <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
//                   1. VENDOR VISIT DETAILS
//                 </td>
//               </tr>

//               <tr>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   LAI NO.-
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.laiNo || "N/A"}
//                 </td>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   PROPERTY CODE-
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.propertyCode || "N/A"}
//                 </td>
//               </tr>

//               <tr>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   DATE OF VISIT
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.dateOfVisit || "N/A"}
//                 </td>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   DATE OF REPORT
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.dateOfReport || "N/A"}
//                 </td>
//               </tr>
//               <tr>
//                 <td
//                   className='p-2 border border-gray-300 font-bold'
//                   colSpan={4}
//                 >
//                   Address of Property (As per site):{" "}
//                   {reportData?.propertyAddress || "N/A"}
//                 </td>
//               </tr>
//               <tr>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   NAME OF THE PERSON WHO VISITED THE SITE:
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.visitedPersonName || "N/A"}
//                 </td>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   CONTACT NUMBER
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.contactNumber || "N/A"}
//                 </td>
//               </tr>
//               <tr className='bg-gray-100'>
//                 <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
//                   2. CONSTRUCTION
//                 </td>
//               </tr>
//               <tr>
//                 <td
//                   className='p-2 border border-gray-300 font-bold'
//                   colSpan={2}
//                 >
//                   CONSTRUCTION STAGE (AS PER SITE):
//                 </td>
//                 <td
//                   className='p-2 border border-gray-300 font-bold'
//                   colSpan={2}
//                 >
//                   {reportData?.constructionStage || "N/A"}
//                 </td>
//               </tr>
//               <tr>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   CONSTRUCTION (%)
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.constructionPercentage || "N/A"}%
//                 </td>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   CONSTRUCTION IS AS PER :
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.constructionAsPer || "N/A"}
//                 </td>
//               </tr>
//               <tr className='bg-gray-100'>
//                 <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
//                   3. AREA
//                 </td>
//               </tr>
//               <tr>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   TOTAL BUA CONSIDERED ON SITE (IN SQ.FT)
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.totalBua || "N/A"} SQFT
//                 </td>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   REMARKS
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.areaRemarks || "N/A"}
//                 </td>
//               </tr>
//               <tr>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   LATITUDE :
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.latitude || "N/A"}
//                 </td>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   LONGITUDE :
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.longitude || "N/A"}
//                 </td>
//               </tr>
//               <tr>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   OVERALL STATUS (POSITIVE / NEGATIVE) :
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.overallStatus || "N/A"}
//                 </td>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   IF NEGATIVE, PLEASE SPECIFY THE REASON :
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.negativeReason || "N/A"}
//                 </td>
//               </tr>
//               {reportData?.latitude && reportData?.longitude && (
//                 <tr>
//                   <td
//                     className='p-2 border border-gray-300 font-bold'
//                     colSpan={4}
//                   >
//                     <div className='mb-2'>LOCATION MAP</div>
//                     <StaticLocationMap
//                       latitude={reportData.latitude}
//                       longitude={reportData.longitude}
//                       title='Home First Trench location map'
//                       className='w-full border border-gray-300'
//                       style={{ width: "100%", height: "260px" }}
//                     />
//                   </td>
//                 </tr>
//               )}
//               <tr className='bg-gray-100'>
//                 <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
//                   4. CERTIFICATE
//                 </td>
//               </tr>
//               <tr>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   CERTIFICATE :
//                 </td>
//                 <td className='p-2 border border-gray-300' colSpan={3}>
//                   {reportData?.certificateText || "N/A"}
//                 </td>
//               </tr>
//               <tr className='bg-gray-100'>
//                 <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
//                   5. BILLING
//                 </td>
//               </tr>
//               <tr>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   CHARGES :
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.charges || "N/A"}
//                 </td>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   GST % (IF APPLICABLE)
//                 </td>
//                 <td className='p-2 border border-gray-300'>
//                   {reportData?.gstPercentage || "N/A"}
//                 </td>
//               </tr>


//               <tr className='bg-gray-100'>
//                 <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
//                   6. DECLARATION
//                 </td>
//               </tr>

//               <tr>
//                 <td className='p-2 border border-gray-300 font-bold'>
//                   DECLARATION <br />
//                   (I HEREBY DECLARE THAT)
//                 </td>
//                 <td className="p-2 border border-gray-300" colSpan={3}>
//                   <ul className="list-disc pl-5">
//                     {reportData?.declaration1 && (
//                       <li>
//                         We have no direct or indirect interest in the property valued.
//                       </li>
//                     )}

//                     {reportData?.declaration2 && (
//                       <li>
//                         The property was inspected by our authorized representative and the information provided is true.
//                       </li>
//                     )}

//                     {reportData?.declaration3 && (
//                       <li>{reportData.declaration3}</li>
//                     )}
//                   </ul>
//                 </td>
//               </tr>


//               <tr>
//                 <td
//                   className=' border border-black px-4 mt font-semibold'
//                   colSpan='8'
//                 >
//                   <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-2  '>
//                     {/* <td className="boder">he</td> */}
//                     {reportData?.imageUrls?.length > 0 ? (
//                       reportData.imageUrls.map((imageUrl, index) => {
//                         const src = getImageSource(imageUrl);
//                         return (
//                           <div key={index} className='  overflow-hidden  '>
//                             <img
//                               src={src}
//                               alt={`Property Image ${index + 1}`}
//                               className='w-full h-96 object-cover'
//                             />
//                           </div>
//                         )
//                       }))
//                       : (
//                         <p>No images available.</p>
//                       )}
//                   </div>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         <div className='mt-8 text-sm text-gray-600'>
//           <p className='mb-1'>
//             * This is a system-generated report. The data provided is based on
//             site visit and available records.
//           </p>
//           <p>
//             For any queries, please contact us at{" "}
//             <a
//               href='mailto:support@example.com'
//               className='text-blue-500 underline'
//             >
//               support@example.com
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomeTrench;



import { useParams } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ExcelHeader from "../../components/Header/ExcelHeader";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import StaticLocationMap from "../../components/StaticLocationMap";

import { getHomeTrenchReportById } from "../../redux/features/Banks/homeTrench/homeTrenchReportThunks";

const dummyPics = [
  {
    url: "https://images.unsplash.com/photo-1702952815477-553ae3774509?w=600&auto=format&fit=crop&q=60",
    location: "76m3+6qc, Gwalior, Madhya Pradesh 474001, India",
    latitude: "26.284655",
    longitude: "78.205254",
    localTime: "05:13:22 PM",
    altitude: "188 m",
    gmt: "12:12:11 PM",
    date: "Tuesday, 09.04.2025",
  },
  {
    url: "https://images.unsplash.com/photo-1702952815477-553ae3774509?w=600&auto=format&fit=crop&q=60",
    location: "76m3+6qc, Gwalior, Madhya Pradesh 474001, India",
    latitude: "26.284655",
    longitude: "78.205254",
    localTime: "05:20:10 PM",
    altitude: "190 m",
    gmt: "12:20:11 PM",
    date: "Tuesday, 09.04.2025",
  },
  {
    url: "https://images.unsplash.com/photo-1702952815477-553ae3774509?w=600&auto=format&fit=crop&q=60",
    location: "76m3+6qc, Gwalior, Madhya Pradesh 474001, India",
    latitude: "26.284655",
    longitude: "78.205254",
    localTime: "05:20:10 PM",
    altitude: "190 m",
    gmt: "12:20:11 PM",
    date: "Tuesday, 09.04.2025",
  },
];

const getImageSource = (image) =>
  typeof image === "string" ? image : image?.url || "";



const HomeTrench = () => {
  const { id } = useParams();
  const dispatch = useDispatch();



  const reportData = useSelector((state) => state?.homeTrenchReport?.report);

  useEffect(() => {
    if (id) {
      dispatch(getHomeTrenchReportById(id));
    }
  }, [id, dispatch]);


  // function cleanPath(path) {
  //   return path?.replace(/^undefined\/?/, "");
  // }

  // console.log(reportData);



  const handlePrintPreview = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const table = document.getElementById("reportTable");
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Report" });
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Baja_Ameriya_Report.xlsx");
  };

  const handleExportCSV = () => {
    const table = document.getElementById("reportTable");
    const worksheet = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Baja_Ameriya_Report.csv");
  };

  return (



    <>

      <style>
        {`
    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
      }

      body * {
        visibility: hidden;
      }

      #print-section,
      #print-section * {
        visibility: visible;
      }

      #print-section {
        position: static !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        box-shadow: none !important;
        background: white !important;
      }

      .print\\:hidden {
        display: none !important;
      }

      img {
        max-width: 100% !important;
        display: block !important;
      }

      table {
        width: 100% !important;
        border-collapse: collapse !important;
      }

      tr, td, th, div {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      @page {
        size: A4;
        margin: 8mm;
      }
    }
  `}
      </style>

      <div
        id="print-section"
        className="w-full border p-3 bg-white print:border-0 print:p-0 print:m-0"
      >

        <div
          id="print-section"
          className="w-full border p-3 bg-white print:border-0 print:p-0 print:m-0"
        >
          {/* Wrapper for the entire content */}
          <div className='mb-3 print:hidden'>
            <div className='mb-2.5 text-right'>
              <button
                onClick={handlePrintPreview}
                className='mr-2.5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              >
                Download PDF
              </button>
              <button
                onClick={handleExportExcel}
                className='mr-2.5 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
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
          </div>
          <div id='reportContent' className='bg-white print:bg-white'>
            {/* Header Section */}
            <div className='flex items-center border-b pb-0 mb-0'>
              <div className='w-full'>
                {/* <ExcelHeader /> */}
                <img
                  src={`${window.location.origin}/assets/images/header1.jpg`}
                  alt='Header'
                  className='w-full'
                />

              </div>
            </div>

            <div
              id='reportTable'
              style={{
                marginTop: 0,
                paddingTop: 0,
                breakInside: "avoid",
                pageBreakInside: "avoid",
              }}
            >
              <table
                className='w-full border-collapse border border-gray-300'
                style={{
                  marginTop: 0,
                  breakInside: "auto",
                  pageBreakInside: "auto",
                }}
              >
                <tbody>
                  <tr style={{ backgroundColor: "#f3f4f6" }}>
                    <td
                      className='p-2 font-bold'
                      colSpan={4}
                      style={{ backgroundColor: "#dbeafe" }}
                    >
                      1. VENDOR VISIT DETAILS
                    </td>
                  </tr>

                  <tr>
                    <td className='p-2 border border-gray-300 font-bold'>
                      LAI NO.-
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.laiNo || "N/A"}
                    </td>
                    <td className='p-2 border border-gray-300 font-bold'>
                      PROPERTY CODE-
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.propertyCode || "N/A"}
                    </td>
                  </tr>

                  <tr>
                    <td className='p-2 border border-gray-300 font-bold'>
                      DATE OF VISIT
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.dateOfVisit || "N/A"}
                    </td>
                    <td className='p-2 border border-gray-300 font-bold'>
                      DATE OF REPORT
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.dateOfReport || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className='p-2 border border-gray-300 font-bold'
                      colSpan={4}
                    >
                      Address of Property (As per site):{" "}
                      {reportData?.propertyAddress || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className='p-2 border border-gray-300 font-bold'>
                      NAME OF THE PERSON WHO VISITED THE SITE:
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.visitedPersonName || "N/A"}
                    </td>
                    <td className='p-2 border border-gray-300 font-bold'>
                      CONTACT NUMBER
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.contactNumber || "N/A"}
                    </td>
                  </tr>
                  <tr className='bg-gray-100'>
                    <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
                      2. CONSTRUCTION
                    </td>
                  </tr>
                  <tr>
                    <td
                      className='p-2 border border-gray-300 font-bold'
                      colSpan={2}
                    >
                      CONSTRUCTION STAGE (AS PER SITE):
                    </td>
                    <td
                      className='p-2 border border-gray-300 font-bold'
                      colSpan={2}
                    >
                      {reportData?.constructionStage || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className='p-2 border border-gray-300 font-bold'>
                      CONSTRUCTION (%)
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.constructionPercentage || "N/A"}%
                    </td>
                    <td className='p-2 border border-gray-300 font-bold'>
                      CONSTRUCTION IS AS PER :
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.constructionAsPer || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className='p-2 border border-gray-300 font-bold' colSpan={2}>
                      CONSTRUCTION REMARKS
                    </td>
                    <td className='p-2 border border-gray-300' colSpan={2}>
                      {reportData?.constructionRemarks || "N/A"}
                    </td>
                  </tr>
                  <tr className='bg-gray-100'>
                    <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
                      3. AREA
                    </td>
                  </tr>
                  <tr>
                    <td className='p-2 border border-gray-300 font-bold'>
                      TOTAL BUA CONSIDERED ON SITE (IN SQ.FT)
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.totalBua || "N/A"} SQFT
                    </td>
                    <td className='p-2 border border-gray-300 font-bold'>
                      REMARKS
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.areaRemarks || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className='p-2 border border-gray-300 font-bold'>
                      LATITUDE :
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.latitude || "N/A"}
                    </td>
                    <td className='p-2 border border-gray-300 font-bold'>
                      LONGITUDE :
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.longitude || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className='p-2 border border-gray-300 font-bold'>
                      OVERALL STATUS (POSITIVE / NEGATIVE) :
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.overallStatus || "N/A"}
                    </td>
                    <td className='p-2 border border-gray-300 font-bold'>
                      IF NEGATIVE, PLEASE SPECIFY THE REASON :
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.negativeReason || "N/A"}
                    </td>
                  </tr>
                  {reportData?.latitude && reportData?.longitude && (
                    <tr>
                      <td
                        className='p-2 border border-gray-300 font-bold'
                        colSpan={4}
                      >
                        <div className='mb-2'>LOCATION MAP</div>

                        <StaticLocationMap
                          latitude={reportData.latitude}
                          longitude={reportData.longitude}
                          title='Home First Trench location map'
                          className='w-full border border-gray-300'
                          style={{ width: "100%", height: "260px", objectFit: "cover" }}
                        />
                      </td>
                    </tr>
                  )}
                  <tr className='bg-gray-100'>
                    <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
                      4. CERTIFICATE
                    </td>
                  </tr>
                  <tr>
                    <td className='p-2 border border-gray-300 font-bold'>
                      CERTIFICATE :
                    </td>
                    <td className='p-2 border border-gray-300' colSpan={3}>
                      {reportData?.certificateText || "N/A"}
                    </td>
                  </tr>
                  <tr className='bg-gray-100'>
                    <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
                      5. BILLING
                    </td>
                  </tr>
                  <tr>
                    <td className='p-2 border border-gray-300 font-bold'>
                      CHARGES :
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.charges || "N/A"}
                    </td>
                    <td className='p-2 border border-gray-300 font-bold'>
                      BASE RATE
                    </td>
                    <td className='p-2 border border-gray-300'>
                      {reportData?.baseRate || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className='p-2 border border-gray-300 font-bold' colSpan={2}>
                      TOTAL
                    </td>
                    <td className='p-2 border border-gray-300' colSpan={2}>
                      {reportData?.totalAmount || "N/A"}
                    </td>
                  </tr>


                  <tr className='bg-gray-100'>
                    <td className='bg-blue-100 p-2 font-bold' colSpan={4}>
                      6. DECLARATION
                    </td>
                  </tr>

                  <tr>
                    <td className='p-2 border border-gray-300 font-bold'>
                      DECLARATION <br />
                      (I HEREBY DECLARE THAT)
                    </td>
                    <td className="p-2 border border-gray-300" colSpan={3}>
                      <ul className="list-disc pl-5">
                        {reportData?.declaration1 && (
                          <li>
                            We have no direct or indirect interest in the property valued.
                          </li>
                        )}

                        {reportData?.declaration2 && (
                          <li>
                            The property was inspected by our authorized representative and the information provided is true.
                          </li>
                        )}

                        {reportData?.declaration3 && (
                          <li>{reportData.declaration3}</li>
                        )}
                      </ul>
                    </td>
                  </tr>


                  <tr>
                    <td
                      className=' border border-black px-4 mt font-semibold'
                      colSpan='8'
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "8px",
                          padding: "8px 0",
                        }}
                      >
                        {/* <td className="boder">he</td> */}
                        {reportData?.imageUrls?.length > 0 ? (
                          reportData.imageUrls.map((imageUrl, index) => {
                            const src = getImageSource(imageUrl);
                            return (
                              <div key={index} className='  overflow-hidden  '>
                                <img
                                  src={src}
                                  alt={`Property Image ${index + 1}`}
                                  crossOrigin="anonymous"
                                  referrerPolicy="no-referrer"
                                  style={{
                                    width: "100%",
                                    height: "250px",
                                    objectFit: "cover",
                                    border: "1px solid #d1d5db",
                                    display: "block",
                                  }}
                                />
                              </div>
                            )
                          }))
                          : (
                            <p>No images available.</p>
                          )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: "32px",
                fontSize: "14px",
                color: "#4b5563",
              }}
            >
              <p className='mb-1'>
                * This is a system-generated report. The data provided is based on
                site visit and available records.
              </p>
              <p>
                For any queries, please contact us at{" "}
                <a
                  href='mailto:support@example.com'
                  style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                  support@example.com
                </a>
              </p>
            </div>
          </div>
        </div>
        );
      </div>
    </>
  );
};

export default HomeTrench;
