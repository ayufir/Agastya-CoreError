import React from "react";
import html2pdf from "html2pdf.js";

const PdfDownload = ({ tableId, fileName = "report.pdf" }) => {
  const handleDownloadPdf = () => {
    const element = document.getElementById(tableId);
    if (!element) {
      alert("Table not found");
      return;
    }

    // Optionally: Temporarily override oklch colors here (if needed)

    const opt = {
      margin: 0.5,
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        // You can add ignoreElements or other config here
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .catch((err) => {
        console.error("PDF generation error:", err);
        alert("PDF generation failed. Please check console.");
      });
  };

  return (
    <button
      onClick={handleDownloadPdf}
      className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
    >
      Export Exact PDF
    </button>
  );
};

export default PdfDownload;
