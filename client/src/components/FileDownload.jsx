// import React from "react";
// import * as XLSX from "xlsx-js-style";

// const FileDownload = ({ data, name, tableId }) => {
//   const handleStructureExport = () => {
//     const tableElement = document.getElementById(tableId);
//     if (!tableElement) {
//       alert("Report Table Not Found");
//       return;
//     }

//     // Convert table to worksheet
//     const worksheet = XLSX.utils.table_to_sheet(tableElement, { raw: true });
//     const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");

//     // 🔄 Improved column width calculation
//     const colWidths = [];
//     const headerRow = 1; // Assuming header is in row 2 (0-based index)
//     for (let C = range.s.c; C <= range.e.c; ++C) {
//       let maxLength = 10; // Minimum width
//       // Check header row
//       const headerCell =
//         worksheet[XLSX.utils.encode_cell({ r: headerRow, c: C })];
//       if (headerCell && headerCell.v) {
//         maxLength = Math.max(maxLength, headerCell.v.toString().length);
//       }
//       // Check data rows
//       for (let R = range.s.r; R <= range.e.r; ++R) {
//         const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//         const cell = worksheet[cellAddress];
//         if (cell && cell.v != null) {
//           const valueLength = cell.v.toString().length;
//           maxLength = Math.max(maxLength, valueLength);
//         }
//       }
//       // Apply padding and cap width to avoid overly wide columns
//       colWidths.push({ wch: Math.min(maxLength + 4, 50) }); // +4 padding, max 50 chars
//     }
//     worksheet["!cols"] = colWidths;

//     // 🔁 Apply default styles to all cells
//     for (let R = range.s.r; R <= range.e.r; ++R) {
//       for (let C = range.s.c; C <= range.e.c; ++C) {
//         const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//         if (!worksheet[cellAddress]) worksheet[cellAddress] = { t: "s", v: "" };

//         const cell = worksheet[cellAddress];
//         cell.s = cell.s || {};
//         cell.s.border = {
//           top: { style: "thin", color: { rgb: "000000" } },
//           bottom: { style: "thin", color: { rgb: "000000" } },
//           left: { style: "thin", color: { rgb: "000000" } },
//           right: { style: "thin", color: { rgb: "000000" } },
//         };
//         cell.s.alignment = {
//           vertical: "center",
//           horizontal: "center",
//           wrapText: true,
//         };
//       }
//     }

//     // 🟨 Format Title Cell (A1) - set after default styles
//     if (worksheet["A1"]) {
//       worksheet["A1"].s = {
//         font: { bold: true, sz: 18, color: { rgb: "000000" } },
//         fill: { fgColor: { rgb: "FFF9E79F" } },
//         alignment: { horizontal: "center", vertical: "center", wrapText: true },
//         border: {
//           top: { style: "medium", color: { rgb: "000000" } },
//           bottom: { style: "medium", color: { rgb: "000000" } },
//           left: { style: "medium", color: { rgb: "000000" } },
//           right: { style: "medium", color: { rgb: "000000" } },
//         },
//       };
//     }

//     // 🟦 Format Header Row (Row 2) - set after default styles
//     for (let C = range.s.c; C <= range.e.c; ++C) {
//       const headerRef = XLSX.utils.encode_cell({ r: headerRow, c: C });
//       const cell = worksheet[headerRef];
//       if (cell) {
//         cell.s = {
//           font: { bold: true, sz: 12, color: { rgb: "000000" } },
//           fill: { fgColor: { rgb: "FFD9E1F2" } },
//           alignment: {
//             horizontal: "center",
//             vertical: "center",
//             wrapText: true,
//           },
//           border: {
//             top: { style: "thin", color: { rgb: "000000" } },
//             bottom: { style: "thin", color: { rgb: "000000" } },
//             left: { style: "thin", color: { rgb: "000000" } },
//             right: { style: "thin", color: { rgb: "000000" } },
//           },
//         };
//       }
//     }

//     // ✅ Handle merged cells before export
//     if (worksheet["!merges"]) {
//       worksheet["!merges"].forEach((merge) => {
//         for (let R = merge.s.r; R <= merge.e.r; ++R) {
//           for (let C = merge.s.c; C <= merge.e.c; ++C) {
//             const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//             if (!worksheet[cellAddress]) worksheet[cellAddress] = { t: "s", v: "" };

//             const cell = worksheet[cellAddress];
//             cell.s = cell.s || {};
//             cell.s.border = {
//               top: { style: "thin", color: { rgb: "000000" } },
//               bottom: { style: "thin", color: { rgb: "000000" } },
//               left: { style: "thin", color: { rgb: "000000" } },
//               right: { style: "thin", color: { rgb: "000000" } },
//             };
//             cell.s.alignment = {
//               vertical: "center",
//               horizontal: "center",
//               wrapText: true,
//             };
//           }
//         }
//       });
//     }

//     // 🖨️ Set worksheet print setup for A4 size
//     worksheet["!pageSetup"] = {
//       paperSize: 9, // 9 = A4
//       orientation: "portrait",
//       scale: 100,
//       fitToWidth: 1,
//       fitToHeight: 0,
//       margins: {
//         left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3
//       }
//     };

//     // 📁 Export the styled workbook
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "FormattedReport");
//     XLSX.writeFile(
//       workbook,
//       `${name}_${data?.applicantName || "details"}.xlsx`
//     );
//   };

//   const handleStructureExportCSV = () => {
//     const tableElement = document.getElementById(tableId); // Fixed to use tableId prop
//     if (!tableElement) {
//       alert("Report Table Not Found");
//       return;
//     }

//     const worksheet = XLSX.utils.table_to_sheet(tableElement, { raw: true });
//     const csv = XLSX.utils.sheet_to_csv(worksheet, {
//       FS: ",",
//       RS: "\n",
//       strip: true,
//     });

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute(
//       "download",
//       `${name}_${data?.applicantName || "data"}.csv`
//     );
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url); // Clean up
//   };

//   return (
//     <div>
//       <div className='flex justify-end gap-4 my-4 px-4'>
//         <button
//           onClick={() => window.print()}
//           className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
//         >
//           Print / Save as PDF
//         </button>
//         <button
//           onClick={handleStructureExport}
//           className='bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700'
//         >
//           Export to Excel
//         </button>
//         <button
//           onClick={handleStructureExportCSV}
//           className='bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600'
//         >
//           Export to CSV
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FileDownload;

// !-----------------------------------------------------
import React from "react";
import * as XLSX from "xlsx-js-style";

const FileDownload = ({ data, name, tableId }) => {
  const handleStructureExport = () => {
    const tableElement = document.getElementById(tableId);
    if (!tableElement) {
      alert("Report Table Not Found");
      return;
    }

    // Convert table to worksheet
    const worksheet = XLSX.utils.table_to_sheet(tableElement, { raw: true });
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");

    // 🔄 Improved column width calculation
    const colWidths = [];
    const headerRow = 1; // Assuming header is in row 2 (0-based index)
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxLength = 10; // Minimum width
      // Check header row
      const headerCell =
        worksheet[XLSX.utils.encode_cell({ r: headerRow, c: C })];
      if (headerCell && headerCell.v) {
        maxLength = Math.max(maxLength, headerCell.v.toString().length);
      }
      // Check data rows
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (cell && cell.v != null) {
          const valueLength = cell.v.toString().length;
          maxLength = Math.max(maxLength, valueLength);
        }
      }
      // Apply padding and cap width to avoid overly wide columns
      colWidths.push({ wch: Math.min(maxLength + 4, 50) }); // +4 padding, max 50 chars
    }
    worksheet["!cols"] = colWidths;

    // 🔁 Apply default styles to all cells
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) worksheet[cellAddress] = { t: "s", v: "" };

        const cell = worksheet[cellAddress];
        cell.s = cell.s || {};
        cell.s.border = {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        };
        cell.s.alignment = {
          vertical: "center",
          horizontal: "center",
          wrapText: true,
        };
      }
    }

    // 🟨 Format Title Cell (A1) - set after default styles
    if (worksheet["A1"]) {
      worksheet["A1"].s = {
        font: { bold: true, sz: 18, color: { rgb: "000000" } },
        fill: { fgColor: { rgb: "FFF9E79F" } },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: {
          top: { style: "medium", color: { rgb: "000000" } },
          bottom: { style: "medium", color: { rgb: "000000" } },
          left: { style: "medium", color: { rgb: "000000" } },
          right: { style: "medium", color: { rgb: "000000" } },
        },
      };
    }

    // 🟦 Format Header Row (Row 2) - set after default styles
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerRef = XLSX.utils.encode_cell({ r: headerRow, c: C });
      const cell = worksheet[headerRef];
      if (cell) {
        cell.s = {
          font: { bold: true, sz: 12, color: { rgb: "000000" } },
          fill: { fgColor: { rgb: "FFD9E1F2" } },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }

    // ✅ Handle merged cells before export
    if (worksheet["!merges"]) {
      worksheet["!merges"].forEach((merge) => {
        for (let R = merge.s.r; R <= merge.e.r; ++R) {
          for (let C = merge.s.c; C <= merge.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (!worksheet[cellAddress])
              worksheet[cellAddress] = { t: "s", v: "" };

            const cell = worksheet[cellAddress];
            cell.s = cell.s || {};
            cell.s.border = {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            };
            cell.s.alignment = {
              vertical: "center",
              horizontal: "center",
              wrapText: true,
            };
          }
        }
      });
    }

    // 🖨️ Set worksheet print setup for A4 size
    worksheet["!pageSetup"] = {
      paperSize: 9, // 9 = A4
      orientation: "portrait",
      scale: 100,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.7,
        right: 0.7,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
    };

    // 📁 Export the styled workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FormattedReport");
    XLSX.writeFile(
      workbook,
      `${name}_${data?.applicantName || "details"}.xlsx`
    );
  };

  const handleStructureExportCSV = () => {
    const tableElement = document.getElementById(tableId); // Fixed to use tableId prop
    if (!tableElement) {
      alert("Report Table Not Found");
      return;
    }

    const worksheet = XLSX.utils.table_to_sheet(tableElement, { raw: true });
    const csv = XLSX.utils.sheet_to_csv(worksheet, {
      FS: ",",
      RS: "\n",
      strip: true,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${name}_${data?.applicantName || "data"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  };

  return (
    <div>
      <div className='flex justify-end gap-4 my-4 px-4'>
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
    </div>
  );
};

export default FileDownload;

// !   -----------------------------------------------------
