import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getValuationReportById } from "../../redux/features/Banks/bajaj/BajajAsyncThunks";
import * as XLSX from "xlsx-js-style";

import { Card, Descriptions, Skeleton, Typography } from "antd";
import FileDownload from "../../components/FileDownload";
import { finalUpdate } from "../../redux/features/assignedCase/assignedCasesThunk";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const { Title } = Typography;

const BajajDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const data = useSelector((state) => state.bajaj.report);

  // ! START

  const handleStructureExport = () => {
    const tableElement = document.getElementById("reportTable");
    if (!tableElement) {
      alert("Report Table Not Found");
      return;
    }

    const worksheet = XLSX.utils.table_to_sheet(tableElement, { raw: true });
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // 🔄 Auto column width based on content
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxLength = 10; // default minimum width
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (cell && cell.v != null) {
          const valueLength = cell.v.toString().length;
          if (valueLength > maxLength) maxLength = valueLength;
        }
      }
      colWidths.push({ wch: maxLength + 2 }); // +2 padding
    }

    // ✅ Apply column widths
    worksheet["!cols"] = colWidths;

    // 🔁 Step 1: Apply default styles (border + alignment) to all cells
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) worksheet[cellAddress] = { t: "s", v: "" }; // Empty cell fix

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

    // 🟨 Step 2: Format A1 Title
    const titleCell = worksheet["A1"];
    if (titleCell) {
      titleCell.s = {
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

    // 🟦 Step 3: Format Header Row (Row 2 = r=1)
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerRef = XLSX.utils.encode_cell({ r: 1, c: C });
      const cell = worksheet[headerRef];
      if (cell) {
        cell.s = cell.s || {};
        cell.s.font = { bold: true, sz: 12 };
        cell.s.fill = { fgColor: { rgb: "FFD9E1F2" } };
        cell.s.alignment = {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        };
        cell.s.border = {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        };
      }
    }

    // 📁 Step 4: Export the styled workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FormattedReport");
    XLSX.writeFile(
      workbook,
      `Bajaj_Valuation_FormattedReport_${
        data?.caseReferenceNumber || "details"
      }.xlsx`
    );

    // ✅ Step 5: Handle merged cells and apply border
    if (worksheet["!merges"]) {
      worksheet["!merges"].forEach((merge) => {
        for (let R = merge.s.r; R <= merge.e.r; ++R) {
          for (let C = merge.s.c; C <= merge.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (!worksheet[cellAddress])
              worksheet[cellAddress] = { t: "s", v: "" };

            const cell = worksheet[cellAddress];
            if (!cell.s) cell.s = {};

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
  };

  const handleStructureExportCSV = () => {
    const tableElement = document.getElementById("reportTable");
    if (!tableElement) {
      alert("Report Table Not Found");
      return;
    }

    const worksheet = XLSX.utils.table_to_sheet(tableElement, { raw: true });

    // 🔄 Convert worksheet to CSV format
    const csv = XLSX.utils.sheet_to_csv(worksheet, {
      FS: ",", // Field Separator
      RS: "\n", // Row Separator
      strip: true, // Trim trailing spaces
    });

    // 📁 Create downloadable file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Bajaj_Valuation_Report_${data?.caseReferenceNumber || "data"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ! END

  useEffect(() => {
    if (id) dispatch(getValuationReportById(id));
  }, [id, dispatch]);
  if (!data) return <Skeleton active />;

  const renderField = (label, value) => (
    <Descriptions.Item label={label}>
      {value && value !== "NA" ? (
        value
      ) : (
        <span className='text-red-500 font-semibold'>Not Available</span>
      )}
    </Descriptions.Item>
  );

  const handleFinalSubmit = async () => {
    if (!window.confirm("Are you sure you want to Final Submit? This will lock the report.")) return;
    try {
      setIsSaving(true);
      await dispatch(finalUpdate({ id, bankName: "bajaj", updateData: data })).unwrap();
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
    <div className='p-6 bg-gray-100 min-h-screen relative'>
      {/* Sticky Action Bar for Admin/SuperAdmin */}
      {(user?.role === "Admin" || user?.role === "SuperAdmin") && (
        <div className="fixed top-14 left-0 right-0 z-50 bg-white shadow-md p-3 flex justify-center gap-4 border-b">
          <button
            onClick={handleFinalSubmit}
            disabled={isSaving || data?.status === "FinalSubmitted"}
            className={`px-6 py-2 rounded-full font-semibold text-white shadow-lg transition-all ${
              isSaving || data?.status === "FinalSubmitted"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-700 hover:scale-105 active:scale-95"
            }`}
          >
            {isSaving ? "Finalizing..." : data?.status === "FinalSubmitted" ? "Final Submitted ✅" : "Final Submit"}
          </button>
          
          <button
            onClick={() => window.print()}
            className="px-6 py-2 rounded-full font-semibold text-white shadow-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 active:scale-95 transition-all"
          >
            Download PDF
          </button>
        </div>
      )}

      <div className={`${(user?.role === "Admin" || user?.role === "SuperAdmin") ? "mt-16" : ""}`}>
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
      </div> */}
      <FileDownload data={data} tableId='reportTable' />

      {/* //!Button */}
      {/* //! */}
      <div className='' id='reportTable'>
        <div className='' id='print-section'>
          <Title level={3} className='text-center mb-6'>
            Property Valuation Report
          </Title>

          <Card variant='borderless' className='mb-6'>
            <Descriptions title='Applicant Details' bordered column={2}>
              {renderField("File No", data.fileNo)}
              {renderField("Date of Report", data.dateOfReport)}
              {renderField("Applicant Name", data.applicantName)}
              {renderField("Contact Person", data.contactPerson)}
              {renderField("Loan Type", data.loanType)}
              {renderField("Person Met", data.personMet)}
              {renderField("Property Owner", data.propertyOwner)}
              {renderField("Documents Provided", data.documentsProvided)}
            </Descriptions>
          </Card>

          <Card variant='borderless' className='mb-6'>
            <Descriptions title='Property Address' bordered column={2}>
              {renderField("Site Address", data.addressSite)}
              {renderField("Locality", data.localityName)}
              {renderField("Landmark", data.landmark)}
              {renderField("Distance from City", data.distanceFromCity)}
              {renderField("Latitude & Longitude", data.latLong)}
              {renderField("Address from Initiation", data.addressInitiation)}
              {renderField("Legal Address", data.legalAddress)}
              {renderField("State", data.propertyState)}
              {renderField("City", data.propertyCity)}
              {renderField("Pincode", data.propertyPinCode)}
              {renderField("Floor No.", data.floorNo)}
            </Descriptions>
          </Card>

          <Card variant='borderless' className='mb-6'>
            <Descriptions
              title='Legal & Structural Details'
              bordered
              column={2}
            >
              {renderField("Address Matching", data.addressMatching)}
              {renderField("Jurisdiction", data.jurisdiction)}
              {renderField("Property Type", data.propertyType)}
              {renderField("Marketability", data.marketability)}
              {renderField("Occupancy Status", data.occupancyStatus)}
              {renderField("Type Of Property", data.typeOfProperty)}
              {renderField("Occupancy Schedule", data.occupancySchedule)}
              {renderField("North Boundary", data.northBoundary)}
              {renderField("East Boundary", data.eastBoundary)}
              {renderField("West Boundary", data.westBoundary)}
              {renderField("South Boundary", data.southBoundary)}
              {renderField("Boundary Match", data.boundariesMatching)}
              {renderField("Property Identified", data.identifiedProperty)}
              {renderField("Approach Road Size", data.approachRoadSize)}
              {renderField("Structure Type", data.structureType)}
              {renderField("Roof Type", data.roofType)}
              {renderField("Construction Quality", data.constructionQuality)}
              {renderField("Open Plot", data.openPlot)}
            </Descriptions>
          </Card>

          <Card variant='borderless' className='mb-6'>
            <Descriptions
              title='Construction and Area Details'
              bordered
              column={2}
            >
              {renderField("Number of Floors", data.numberOfFloors)}
              {renderField("Lift Available", data.liftAvailable)}
              {renderField("Number of Lifts", data.numberOfLifts)}
              {renderField("Current Occupant", data.currentOccupant)}
              {renderField("Independent Access", data.independentAccess)}
              {renderField("Accommodation Details", data.accommodationDetails)}
              {renderField(
                "East-West (Doc/Site)",
                `${data.eastWestDocument} / ${data.eastWestSite}`
              )}
              {renderField(
                "North-South (Doc/Site)",
                `${data.northSouthDocument} / ${data.northSouthSite}`
              )}
              {renderField(
                "Land Area (Doc/Site)",
                `${data.landAreaDocument} / ${data.landAreaSite}`
              )}
              {renderField("Ground Rooms", data.groundRooms)}
              {renderField("Ground Kitchens", data.groundKitchens)}
              {renderField("Ground Bathrooms", data.groundBathrooms)}
              {renderField("Sanctioned Ground", data.groundSanctioned)}
              {renderField("Actual Ground", data.groundActual)}
              {renderField("Permissible Area", data.permissibleArea)}
              {renderField("Permissible FSI", data.permissibleFSI)}
              {renderField(
                "Permissible Construction",
                data.permissibleConstruction
              )}
              {renderField("Carpet Area", data.carpetArea)}
              {renderField("Proposed Construction", data.proposedConstruction)}
            </Descriptions>
          </Card>

          <Card variant='borderless' className='mb-6'>
            <Descriptions title='Valuation Details' bordered column={2}>
              {renderField("Risk of Demolition", data.riskOfDemolition)}
              {renderField("Property Status", data.propertyStatus)}
              {renderField("Construction Completion %", data.percentCompleted)}
              {renderField("Recommended %", data.percentRecommended)}
              {renderField("Property Age", data.propertyAge)}
              {renderField("Residual Age", data.residualAge)}
              {renderField("Land Area", data.landArea)}
              {renderField("Land Rate", `₹ ${data.landRate}`)}
              {renderField("Land Total", `₹ ${data.landTotal}`)}
              {renderField("BUA Area", data.buaArea)}
              {renderField("BUA Rate", `₹ ${data.buaRate}`)}
              {renderField("BUA Total", `₹ ${data.buaTotal}`)}
              {renderField("Realizable Value", `₹ ${data.realizableValue}`)}
              {renderField("Government Value", data.governmentValue)}
              {renderField("Distressed Value", `₹ ${data.distressedValue}`)}
              {renderField("Previous Valuation", data.previousValuation)}
              {renderField("In Demolition List", data.inDemolitionList)}
              {renderField("Negative Area", data.negativeArea)}
            </Descriptions>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BajajDetails;
