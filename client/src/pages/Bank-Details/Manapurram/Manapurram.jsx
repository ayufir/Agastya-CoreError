











import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createManappuramReport,
    fetchManappuramById,
    updateManappuramDetails,
} from "../../../redux/features/Banks/ManappuramBank/Manappuramthunk";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../../config/axios";
import JSZip from "jszip";
import AutoFillForm from "../../AutoFillForm";
import AdvancedAutoFillForm from "../../../components/AdvancedAutoFillForm";
import { MANAPPURAM_MAPPING } from "../../../config/Bankfieldmappings";
import {
    applyMappedFields,
    createAutoFillAdapter,
} from "../../../utils/Autofilladapter";
import html2pdf from "html2pdf.js";
import RichTextToolbarEditor from "../../../components/RichTextToolbarEditor";
import StaticLocationMap from "../../../components/StaticLocationMap";
import {
    buildManappuramRemarks,
} from "../../../utils/autoFillRemarkBuilders";
import {
    richTextToPlainText,
    toRichTextHtml,
} from "../../../utils/richText";
import { finalUpdate } from "../../../redux/features/case/caseThunks";

const getCoordinateSnapshot = (coordinates = "") => {
    const [latitude = "--", longitude = "--"] = String(coordinates)
        .split(",")
        .map((value) => value.trim());

    return {
        lat: latitude || "--",
        lng: longitude || "--",
    };
};

const normalizeRemarkText = (remark = "") => richTextToPlainText(remark);

const normalizeRemarks = (remarks = []) => {
    const nextRemarks = Array.isArray(remarks)
        ? remarks
        : remarks
            ? [remarks]
            : [];
    const normalized = nextRemarks.map((remark) => toRichTextHtml(remark));
    return normalized.length > 0 ? normalized : [""];
};

if (!document.getElementById("mnfl-print-style")) {
    const s = document.createElement("style");
    s.textContent = `
@media print {

  html, body {
    margin: 0 !important;
    padding: 0 !important;
  }

  body * {
    visibility: hidden;
  }

  #mnfl-print-area, #mnfl-print-area * {
    visibility: visible;
  }

  #mnfl-print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  /* 🔥 MOST IMPORTANT FIX */
  table {
    page-break-inside: auto !important;
    break-inside: auto !important;
  }

  tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  td, th {
    page-break-inside: auto !important;
    break-inside: auto !important;
  }

  /* 🔥 FORCE BREAK CLEANLY */
  .page-break {
    page-break-before: always;
  }

}
`;
    document.head.appendChild(s);
}

/* ─── INITIAL STATE ─────────────────────────────────────────────────────────── */
const INIT = {
    header: {
        valueName: "",
        caseRefNo: "",
        dateOfVisit: "",
        dateOfReport: "",
        contactedPerson: "",
    },
    propertyInfo: {
        applicantName: "",
        ownerName: "",
        documentProduced: "SALEDEED",
        typeOfProperty: "RESIDENTIAL",
        currentUsage: "OPEN PLOT",
        holdingType: "Free Hold",
        propertyUsage: "OPEN PLOT",
        usageAuthorized: "",
        usageRestriction: "No",
        occupancyStatus: "VACANT",
        measurementOfProperty: "",
        distanceFromBranch: "",
        addressAtSite: "",
        addressAsPerDocument: "",
        landmark: "",
        locationOfProperty: "RURAL",
    },
    siteBoundaries: {
        eastDoc: "",
        westDoc: "",
        northDoc: "",
        southDoc: "",
        eastActual: "",
        westActual: "",
        northActual: "",
        southActual: "",
        boundariesTallied: "NO",
    },
    accessibility: {
        connectivity: "Average",
        siteAccess: "UNDER DEV",
        proximityToAmenities: "",
        typeWidthOfRoad: "",
        commentsOnProperty: "",
        withinMunicipalLimits: "GP",
        adverseFactors: "No",
    },
    municipalDetails: {
        sanctionPlanProvided: "Not produced",
        dateOfSanction: "Not produced",
        sanctionedArea: "Not produced",
        municipalCompliance: "Not produced",
        currentAgeProperty: "0",
        estimatedResidualAge: "60",
    },
    technicalDetails: {
        constructionType: "",
        noOfFloors: "GF",
        totalLandArea: "",
        totalBuiltUpArea: "0",
        totalFloorArea: "0",
        independentAccess: "Independent Access",
        percentCompletion: "0",
        currentAge: "0",
        estimatedResidualAge: "60",
    },
    valuationGLR: { landArea: "", landRate: "0", landValue: "0" },
    valuationPMR: {
        landArea: "0",
        landRate: "0",
        landValue: "0",
        constructionArea: "0",
        constructionRate: "0",
        constructionValue: "0",
        totalValue: "0",
    },
    distressValue: "0",
    remarks: [
        "GIVEN XEROX COPY OF SALE DEED IN FAVOUR OF MR. NAVEEN PRATAP SINGH S/O MR. MANISH SINGH.",
        " DURING PROPERTY VISIT MR. NAVEEN PRATAP SINGH JI MET AT THE PROPERTY HE IS CUSTOMER AND HIS CONT NO. 7806052286. IT WAS CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.",
        "RATE HAS BEEN CONFIRM FROM MARKET ENQUIRY.",
        " PROPERTY IS SITUATED AT SURROUNDING AREA OF LOCALITY IS RESIDENTIAL ZONING.",
        "AT SITE PROPERTY IS OPEN PLOT WHICH IS DEMARCATED BY BENDING WIRE.",
        "PROPERTY IS NOT IDENTIFIED BY AS PER SALE DEED AND LOCAL ENQUIRY.",
        "AS PER DEED 2800 SQFT AND AT SITE LAND AREA IS 40*45= 1800 SQFT.",
        "AS PER SALE DEED AND ACTUAL KHASRA ARE NOT MATCHED.",
        "TENTATIVE LAND RATE IS RS. 900/- SQFT."
    ],
    summary: {
        propertyAddress: "",
        propertyType: "RESIDENTIAL",
        applicantName: "",
        presentMarketValue: "0",
        forcedSaleValue: "0",
        coordinates: "",
    },
    imageUrls: [],
    AttachDocuments: [],
};

function PhotoGrid({ label, photos, onAdd, onDelete, reportId, onCaptureLocation }) {
    const ref = useRef();
    const [uploading, setUploading] = useState(false);

    const handleFiles = async (e) => {
        let capturedLocation = null;

        if (navigator.geolocation) {
            capturedLocation = await new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) =>
                        resolve({
                            latitude: pos.coords.latitude.toFixed(6),
                            longitude: pos.coords.longitude.toFixed(6),
                        }),
                    () => resolve(null),
                    { enableHighAccuracy: true }
                );
            });
        }

        if (capturedLocation && onCaptureLocation) {
            onCaptureLocation(
                capturedLocation.latitude,
                capturedLocation.longitude
            );
        }

        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                if (reportId) formData.append("reportId", reportId);
                if (capturedLocation?.latitude && capturedLocation?.longitude) {
                    formData.append("latitude", capturedLocation.latitude);
                    formData.append("longitude", capturedLocation.longitude);
                }

                const res = await axiosInstance.post(
                    "/manappuram/upload-image",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (res.data?.success) {
                    onAdd({ url: res.data.url, fileId: res.data.fileId });
                } else {
                    toast.error("Image upload failed");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Image upload error");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <div>
            <table className="w-full border-collapse border border-black mb-0">
                <tbody>
                    <tr>
                        <th className="bg-amber-50 border border-black p-1 text-xs font-medium">
                            {label}
                        </th>
                    </tr>
                </tbody>
            </table>

            <div className="grid grid-cols-3 gap-1">
                {photos.map((img, i) => {
                    const src = typeof img === "string" ? img : img?.url;
                    return (
                        <div
                            key={i}
                            className="relative border border-black min-h-[180px] flex items-center justify-center bg-black"
                        >
                            <img
                                src={src}
                                alt=""
                                className="max-w-full max-h-full object-contain"
                            />

                            <div className="absolute top-1 left-1 no-print">
                                <button
                                    onClick={() => window.open(src, "_blank")}
                                    className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                    title="View"
                                >
                                    👁️
                                </button>
                            </div>

                            <button
                                onClick={() => onDelete(i, img.fileId)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm no-print"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}

                <div
                    className="no-print relative border border-black min-h-[180px] cursor-pointer flex items-center justify-center bg-gray-100"
                    onClick={() => !uploading && ref.current.click()}
                    style={{ cursor: uploading ? "wait" : "pointer" }}
                >
                    <div className="text-gray-600 text-xs text-center px-2 whitespace-pre-line">
                        {uploading
                            ? "⏳ Uploading..."
                            : "📷 Click to Upload\n(GPS auto-captured)"}
                    </div>
                </div>
            </div>

            <input
                ref={ref}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFiles}
            />
        </div>
    );
}

function FileDocument({ label, documents, onAdd, onDelete, reportId }) {
    const ref = useRef();
    const [uploading, setUploading] = useState(false);

    const handleFiles = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                if (reportId) formData.append("reportId", reportId);

                const res = await axiosInstance.post(
                    "/manappuram/upload-document",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (res.data?.success) {
                    onAdd({
                        url: res.data.url,
                        fileId: res.data.fileId,
                        name: res.data.name,
                    });
                } else {
                    toast.error("Document upload failed");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Document upload error");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <div>
            <table className="w-full border-collapse border border-black mb-0">
                <tbody>
                    <tr>
                        <th className="bg-amber-50 border border-black p-1 text-xs font-medium">
                            {label}
                        </th>
                    </tr>
                </tbody>
            </table>

            <div className="grid grid-cols-3 gap-1">
                {documents.map((doc, i) => (
                    <div
                        key={i}
                        className="relative border border-black p-2 flex items-center justify-between"
                    >
                        <div className="truncate text-xs flex-1">
                            <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                {doc.name || "Document"}
                            </a>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => window.open(doc.url, "_blank")}
                                className="bg-blue-500 text-white rounded px-2 py-1 text-xs no-print"
                                title="View"
                            >
                                📄
                            </button>
                            <button
                                onClick={() => onDelete(i, doc.fileId)}
                                className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm no-print"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}

                <div
                    className="relative border border-black min-h-[80px] cursor-pointer flex items-center justify-center"
                    onClick={() => !uploading && ref.current.click()}
                    style={{ cursor: uploading ? "wait" : "pointer" }}
                >
                    <div className="text-center text-gray-600 text-xs">
                        {uploading ? "⏳ Uploading..." : "📄 Click to Upload Document"}
                    </div>
                </div>
            </div>

            <input
                ref={ref}
                type="file"
                multiple
                className="hidden"
                onChange={handleFiles}
            />
        </div>
    );
}

/* ─── PRINT AREA ────────────────────────────────────────────────────────────── */
function PrintArea({ form }) {
    const mapLocation = getCoordinateSnapshot(form?.summary?.coordinates);
    const hasMapLocation = mapLocation.lat !== "--" && mapLocation.lng !== "--";

    const H = form.header,
        PI = form.propertyInfo,
        SB = form.siteBoundaries,
        AC = form.accessibility;
    const MD = form.municipalDetails,
        TD = form.technicalDetails,
        GLR = form.valuationGLR,
        PMR = form.valuationPMR,
        SUM = form.summary;

    const ps = {
        fontFamily: "Arial, sans-serif",
        fontSize: "8.5pt",
        borderCollapse: "collapse",
        width: "100%",
        tableLayout: "fixed",
        margin: 0,
        padding: 0,
    };

    const td = {
        border: "1px solid black",
        padding: "2px 4px",
        fontSize: "8.5pt",
        verticalAlign: "top",
        wordBreak: "break-word",
        margin: 0,
    };

    const num = {
        ...td,
        textAlign: "center",
        fontWeight: "bold",
        width: "4%",
        verticalAlign: "middle",
    };

    const lbl = {
        ...td,
        width: "30%",
        fontWeight: "bold",
    };

    const val = {
        ...td,
        wordBreak: "break-word",
        whiteSpace: "normal",
    };

    const th = {
        border: "1px solid black",
        padding: "2px 4px",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "8.5pt",
        background: "#f2f2f2",
    };

    return (
        <div
            id="mnfl-print-area"
            style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "8.5pt",
                background: "white",
                color: "black",
                width: "100%",
                margin: 0,
                padding: 0,
            }}
        >
            {/* PAGE 1 + PAGE 2 CONTINUOUS */}
            <div className="print-page" style={{ margin: 0, padding: 0 }}>
                <div className="print-inner" style={{ margin: 0, padding: 0 }}>
                    {/* Header image */}
                    <table style={{ ...ps, border: "2px solid black" }}>
                        <tbody>
                            <tr>
                                <td style={{ ...td, padding: 0, border: "none" }}>
                                    <img
                                        src="/assets/images/header1.jpg"
                                        alt="header"
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            display: "block",
                                            margin: 0,
                                            padding: 0,
                                        }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Valuation Report Header */}
                    <table style={ps}>
                        <tbody>
                            <tr>
                                <td style={{ ...td, fontWeight: "bold", width: "22%" }}>
                                    Valuer Name
                                </td>
                                <td style={{ ...td, width: "2%", textAlign: "center" }}>:</td>
                                <td style={{ ...td, width: "38%" }}>
                                    {H.valueName || "Unique Engineering & Associate"}
                                </td>
                                <td style={{ ...td, fontWeight: "bold", width: "18%" }}>
                                    Date of Visit
                                </td>
                                <td style={td}>{H.dateOfVisit}</td>
                            </tr>
                            <tr>
                                <td style={{ ...td, fontWeight: "bold" }}>Case Ref. No</td>
                                <td style={td}>:</td>
                                <td style={td}>{H.caseRefNo || "NA"}</td>
                                <td style={{ ...td, fontWeight: "bold" }}>Date of Report</td>
                                <td style={td}>{H.dateOfReport}</td>
                            </tr>
                            <tr>
                                <td style={{ ...td, fontWeight: "bold" }}>
                                    Contacted Person for property
                                </td>
                                <td style={td}>:</td>
                                <td colSpan={3} style={td}>
                                    {H.contactedPerson}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Property Information 01–13 */}
                    <table style={ps}>
                        <colgroup>
                            <col style={{ width: "4%" }} />
                            <col style={{ width: "29%" }} />
                            <col style={{ width: "34%" }} />
                            <col />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td style={num}>01</td>
                                <td style={{ ...td, fontWeight: "bold" }}>Applicant/s Name/s</td>
                                <td colSpan={2} style={val}>{PI.applicantName}</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={{ ...td, fontWeight: "bold" }}>Owner</td>
                                <td colSpan={2} style={val}>{PI.ownerName}</td>
                            </tr>
                            <tr>
                                <td style={num}>02</td>
                                <td style={{ ...td, fontWeight: "bold" }}>Document Produced</td>
                                <td colSpan={2} style={val}>{PI.documentProduced}</td>
                            </tr>
                            <tr>
                                <td style={num}>03</td>
                                <td style={{ ...td, fontWeight: "bold" }}>Type of property</td>
                                <td style={val}>{PI.typeOfProperty}</td>
                                <td style={val}>
                                    <b>Current Usage</b>&nbsp;&nbsp;{PI.currentUsage}
                                </td>
                            </tr>
                            <tr>
                                <td style={num}>04</td>
                                <td style={{ ...td, fontWeight: "bold" }}>Holding Type</td>
                                <td colSpan={2} style={val}>{PI.holdingType}</td>
                            </tr>
                            <tr>
                                <td style={num}>05</td>
                                <td style={{ ...td, fontWeight: "bold" }}>Property Usage</td>
                                <td colSpan={2} style={val}>{PI.propertyUsage}</td>
                            </tr>
                            <tr>
                                <td style={num}>06</td>
                                <td style={{ ...td, fontWeight: "bold" }}>Usage Authorized</td>
                                <td colSpan={2} style={val}>{PI.usageAuthorized || "NA"}</td>
                            </tr>
                            <tr>
                                <td style={num}>07</td>
                                <td style={{ ...td, fontWeight: "bold" }}>
                                    Any Usage Restriction of Land?
                                </td>
                                <td colSpan={2} style={val}>{PI.usageRestriction}</td>
                            </tr>
                            <tr>
                                <td style={num}>08</td>
                                <td style={{ ...td, fontWeight: "bold" }}>Occupancy Status</td>
                                <td colSpan={2} style={val}>{PI.occupancyStatus}</td>
                            </tr>
                            <tr>
                                <td style={num}>09</td>
                                <td style={{ ...td, fontWeight: "bold" }}>
                                    Measurement of the Property
                                </td>
                                <td colSpan={2} style={val}>{PI.measurementOfProperty}</td>
                            </tr>
                            <tr>
                                <td style={num}>10</td>
                                <td style={{ ...td, fontWeight: "bold" }}>
                                    Distance of the Property from the Financing Branch
                                </td>
                                <td colSpan={2} style={val}>{PI.distanceFromBranch}</td>
                            </tr>
                            <tr>
                                <td style={num}>11</td>
                                <td style={{ ...td, fontWeight: "bold" }}>Address at site</td>
                                <td colSpan={2} style={{ ...val, fontWeight: "bold" }}>
                                    {PI.addressAtSite}
                                </td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={{ ...td, fontWeight: "bold" }}>
                                    Address as per document
                                </td>
                                <td colSpan={2} style={val}>{PI.addressAsPerDocument}</td>
                            </tr>
                            <tr>
                                <td style={num}>12</td>
                                <td style={{ ...td, fontWeight: "bold" }}>Land mark</td>
                                <td colSpan={2} style={val}>{PI.landmark}</td>
                            </tr>
                            <tr>
                                <td style={num}>13</td>
                                <td style={{ ...td, fontWeight: "bold" }}>
                                    Location of the Property
                                </td>
                                <td colSpan={2} style={val}>{PI.locationOfProperty}</td>
                            </tr>
                        </tbody>
                    </table>


                    <div className="page-break"></div>

                    {/* 14 Site Boundaries */}
                    <table style={ps}>
                        <tbody>
                            <tr>
                                <td style={{ ...th, width: "4%" }}>14</td>
                                <td style={{ ...th, width: "29%" }}>Site Boundaries</td>
                                <td style={th}>As per Title Document</td>
                                <td style={th}>Actual as Verified at time of site visit</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={{ ...td, fontWeight: "bold" }}>East</td>
                                <td style={val}>{SB.eastDoc}</td>
                                <td style={val}>{SB.eastActual}</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={{ ...td, fontWeight: "bold" }}>West</td>
                                <td style={val}>{SB.westDoc}</td>
                                <td style={val}>{SB.westActual}</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={{ ...td, fontWeight: "bold" }}>North</td>
                                <td style={val}>{SB.northDoc}</td>
                                <td style={val}>{SB.northActual}</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={{ ...td, fontWeight: "bold" }}>South</td>
                                <td style={val}>{SB.southDoc}</td>
                                <td style={val}>{SB.southActual}</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td colSpan={2} style={val}>
                                    Site Boundaries tallied with Boundaries in Title Deed provided by Bank
                                </td>
                                <td style={{ ...val, fontWeight: "bold" }}>
                                    {SB.boundariesTallied}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 15 Accessibility */}
                    <table style={ps}>
                        <tbody>
                            <tr>
                                <td style={{ ...th, width: "4%" }}>15</td>
                                <td style={{ ...th, width: "29%" }}>Accessibility</td>
                                <td style={th}>Particular</td>
                                <td style={th}>Details</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={lbl}>Connectivity</td>
                                <td colSpan={2} style={val}>{AC.connectivity}</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={lbl}>Site Access</td>
                                <td colSpan={2} style={val}>{AC.siteAccess}</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={lbl}>Proximity to Amenities</td>
                                <td colSpan={2} style={val}>{AC.proximityToAmenities}</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={lbl}>Type &amp; Width of road available at Present</td>
                                <td colSpan={2} style={val}>{AC.typeWidthOfRoad}</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={lbl}>Comments on the Property</td>
                                <td colSpan={2} style={val}>{AC.commentsOnProperty}</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={lbl}>Within Municipal Limits</td>
                                <td colSpan={2} style={val}>{AC.withinMunicipalLimits}</td>
                            </tr>
                            <tr>
                                <td style={num}></td>
                                <td style={lbl}>Any other Factor which adversely affect the Marketability</td>
                                <td colSpan={2} style={val}>{AC.adverseFactors}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 16 Municipal Details */}
                    <table style={ps}>
                        <tbody>
                            <tr>
                                <td rowSpan={6} style={{ ...num, verticalAlign: "top", paddingTop: 2 }}>
                                    16
                                </td>
                                <td rowSpan={6} style={{ ...td, fontWeight: "bold", verticalAlign: "top", paddingTop: 2 }}>
                                    Municipal Details
                                </td>
                                <td style={lbl}>Sanction Plan Provided</td>
                                <td style={val}>{MD.sanctionPlanProvided}</td>
                            </tr>
                            <tr>
                                <td style={lbl}>Date of Sanction</td>
                                <td style={val}>{MD.dateOfSanction}</td>
                            </tr>
                            <tr>
                                <td style={lbl}>Sanctioned Area</td>
                                <td style={val}>{MD.sanctionedArea}</td>
                            </tr>
                            <tr>
                                <td style={lbl}>Municipal compliance</td>
                                <td style={val}>{MD.municipalCompliance}</td>
                            </tr>
                            <tr>
                                <td style={lbl}>Current age of the property</td>
                                <td style={val}>{MD.currentAgeProperty}</td>
                            </tr>
                            <tr>
                                <td style={lbl}>Estimated Residual Age</td>
                                <td style={val}>{MD.estimatedResidualAge}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 17 Technical details */}
                    <table style={ps}>
                        <tbody>
                            <tr>
                                <td rowSpan={9} style={{ ...num, verticalAlign: "top", paddingTop: 2 }}>
                                    17
                                </td>
                                <td rowSpan={9} style={{ ...td, fontWeight: "bold", verticalAlign: "top", paddingTop: 2 }}>
                                    Technical details
                                </td>
                                <td style={lbl}>Construction Type</td>
                                <td style={val}>{TD.constructionType}</td>
                            </tr>
                            <tr>
                                <td style={lbl}>No of floors</td>
                                <td style={val}>{TD.noOfFloors}</td>
                            </tr>
                            <tr>
                                <td style={lbl}>Total Land Area in sft</td>
                                <td style={val}>{TD.totalLandArea} <b>SQFT</b></td>
                            </tr>
                            <tr>
                                <td style={lbl}>Total Built up Area in sft (Actual)</td>
                                <td style={val}>{TD.totalBuiltUpArea} <b>SQFT</b></td>
                            </tr>
                            <tr>
                                <td style={lbl}>Total Floor Area in sft</td>
                                <td style={val}>{TD.totalFloorArea} <b>SQFT</b></td>
                            </tr>
                            <tr>
                                <td style={lbl}>Is the Property an Independent units &amp; has Independent Access</td>
                                <td style={val}>{TD.independentAccess}</td>
                            </tr>
                            <tr>
                                <td style={lbl}>If under Construction, % Completion</td>
                                <td style={val}>{TD.percentCompletion}%</td>
                            </tr>
                            <tr>
                                <td style={lbl}>Current Age of the Property</td>
                                <td style={val}>{TD.currentAge}</td>
                            </tr>
                            <tr>
                                <td style={lbl}>Estimated Residual Age</td>
                                <td style={val}>{TD.estimatedResidualAge}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* GLR */}
                    <table style={ps}>
                        <tbody>
                            <tr>
                                <td colSpan={4} style={{ ...td, fontWeight: "bold" }}>
                                    VALUATION BY ADOPTING GLR (GUIDELINE RATE)
                                </td>
                            </tr>
                            <tr>
                                <td style={th}></td>
                                <td style={th}>Area in Areas (sqft)</td>
                                <td style={th}>Rate (sqft)</td>
                                <td style={th}>Value</td>
                            </tr>
                            <tr>
                                <td style={{ ...td, fontWeight: "bold" }}>Land Component</td>
                                <td style={{ ...td, textAlign: "center" }}>{GLR.landArea || "0"}</td>
                                <td style={{ ...td, textAlign: "center" }}>{GLR.landRate || "0"}</td>
                                <td style={{ ...td, textAlign: "center" }}>
                                    {(parseFloat(GLR.landValue) || 0).toLocaleString("en-IN")}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* PMR */}
                    <table style={ps}>
                        <tbody>
                            <tr>
                                <td colSpan={4} style={{ ...td, fontWeight: "bold" }}>
                                    VALUATION BY ADOPTING PMR (PREVAILING MARKET RATE)
                                </td>
                            </tr>
                            <tr>
                                <td style={th}></td>
                                <td style={th}>Area in Areas</td>
                                <td style={th}>Rate</td>
                                <td style={th}>Value</td>
                            </tr>
                            <tr>
                                <td style={{ ...td, fontWeight: "bold" }}>Land Component</td>
                                <td style={{ ...td, textAlign: "center" }}>{PMR.landArea || "0"}</td>
                                <td style={{ ...td, textAlign: "center" }}>{PMR.landRate || "0"}</td>
                                <td style={{ ...td, textAlign: "center" }}>
                                    {(parseFloat(PMR.landValue) || 0).toLocaleString("en-IN")}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ ...td, fontWeight: "bold" }}>Construction Component</td>
                                <td style={{ ...td, textAlign: "center" }}>{PMR.constructionArea || "0"}</td>
                                <td style={{ ...td, textAlign: "center" }}>{PMR.constructionRate || "0"}</td>
                                <td style={{ ...td, textAlign: "center" }}>
                                    {(parseFloat(PMR.constructionValue) || 0).toLocaleString("en-IN")}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ ...td, fontWeight: "bold" }}>Total Value</td>
                                <td style={{ ...td, fontWeight: "bold" }}>Rs.</td>
                                <td style={{ ...td, fontWeight: "bold", textAlign: "center" }}>
                                    {(parseFloat(PMR.totalValue) || 0).toLocaleString("en-IN")}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Distress Sale */}
                    <table style={ps}>
                        <tbody>
                            <tr>
                                <td colSpan={2} style={{ ...td, fontWeight: "bold" }}>
                                    DISTRESS SALE VALUE OF THE PROPERTY
                                </td>
                            </tr>
                            <tr>
                                <td style={td}>
                                    VALUE ON SALE IN A FORCIBLE/DISTRESSED CONDITION USUALLY FACE
                                    SIZABLE BARGAIN &amp; CONSIDERED TO BE NEARLY 15% LESS THAN THE
                                    MARKET VALUE ON FAIR APPROXIMATION, WHICH CAN BE TREATED AS THE
                                    REALISABLE VALUE OF THE PROPERTY AT ANY POINT OF TIME.
                                </td>
                                <td style={{ ...td, fontWeight: "bold", textAlign: "center", width: "15%" }}>
                                    {(parseFloat(form.distressValue) || 0).toLocaleString("en-IN")}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Remarks */}
                    <table style={ps}>
                        <tbody>
                            <tr>
                                <td style={{ ...td, lineHeight: 1.4, padding: "2px 4px" }}>
                                    {form.remarks.map((remark, i) => (
                                        <div key={i} style={{ display: "flex", gap: 4, marginBottom: 2 }}>
                                            <span style={{ fontWeight: "bold" }}>{i + 1}. </span>
                                            <div
                                                style={{ flex: 1, whiteSpace: "normal", wordBreak: "break-word" }}
                                                dangerouslySetInnerHTML={{
                                                    __html: toRichTextHtml(remark),
                                                }}
                                            />
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAGE 3 */}
            <div className="print-page cover-page" style={{ margin: 0, padding: 0 }}>
                <div className="print-inner" style={{ margin: 0, padding: 0 }}>
                    <table style={{ ...ps, border: "2px solid black" }}>
                        <tbody>
                            <tr>
                                <td colSpan={2} style={{ ...td, textAlign: "center", padding: "4px", borderBottom: "1px solid black" }}>
                                    <b style={{ fontSize: "10pt", letterSpacing: 1 }}>
                                        MANAPPURAM FINANCE
                                    </b>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ ...td, textAlign: "center", padding: "20px 10px", borderBottom: "1px solid black" }}>
                                    <div style={{ fontWeight: "900", fontSize: "18pt", lineHeight: 1.2, letterSpacing: 1 }}>
                                        VALUATION OF
                                        <br />
                                        PROPERTIES
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ ...td, textAlign: "center", padding: "4px", borderBottom: "1px solid black" }}>
                                    <div style={{ display: "inline-block", background: "black", color: "white", fontWeight: "bold", padding: "2px 30px", fontSize: "9pt", letterSpacing: 1 }}>
                                        {SUM.propertyType || "RESIDENTIAL"}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ ...td, textAlign: "center", fontWeight: "bold", padding: "8px", fontSize: "9pt", borderBottom: "1px solid black" }}>
                                    {SUM.propertyAddress}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ ...td, textAlign: "center", padding: "4px", borderBottom: "1px solid black" }}>
                                    <div style={{ display: "inline-block", background: "black", color: "white", fontWeight: "bold", padding: "2px 20px", fontSize: "8.5pt", letterSpacing: 1 }}>
                                        NAME OF APPLICANT
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ ...td, textAlign: "center", fontWeight: "bold", padding: "6px", fontSize: "10pt", borderBottom: "1px solid black" }}>
                                    {SUM.applicantName}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ ...td, fontWeight: "bold", letterSpacing: 3, padding: "10px 8px", borderBottom: "1px solid black", fontSize: "8.5pt", width: "72%" }}>
                                    P R E S E N T &nbsp;&nbsp; M A R K E T &nbsp;&nbsp; V A L U E
                                </td>
                                <td style={{ ...td, fontWeight: "bold", textAlign: "right", padding: "10px 8px", borderBottom: "1px solid black", fontSize: "10pt" }}>
                                    {(parseFloat(SUM.presentMarketValue) || 0).toLocaleString("en-IN")}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ ...td, fontWeight: "bold", letterSpacing: 3, padding: "10px 8px", fontSize: "8.5pt" }}>
                                    F O R C E D &nbsp;&nbsp; S A L E &nbsp;&nbsp; V A L U E
                                </td>
                                <td style={{ ...td, fontWeight: "bold", textAlign: "right", padding: "10px 8px", fontSize: "10pt" }}>
                                    {(parseFloat(SUM.forcedSaleValue) || 0).toLocaleString("en-IN")}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ ...td, textAlign: "center", padding: "4px", borderBottom: "1px solid black", background: "black" }}>
                                    <div style={{ display: "inline-block", background: "black", color: "white", fontWeight: "bold", padding: "2px 20px", fontSize: "8.5pt", letterSpacing: 1 }}>
                                        PURPOS
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{ ...td, textAlign: "center", fontWeight: "bold", padding: "6px", fontSize: "10pt", borderBottom: "1px solid black" }}>
                                    TO ASSEST THE PRESENT MARKET VALUE OF THE PROPERTIES AS REQUIRED FOR THE SECURITY PURPOSE
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {hasMapLocation && (
                        <div style={{ marginTop: 0, paddingTop: 0 }}>
                            <div style={{ fontWeight: "bold", marginBottom: 4, padding: "2px 4px" }}>
                                Location Map
                            </div>
                            <StaticLocationMap
                                latitude={mapLocation.lat}
                                longitude={mapLocation.lng}
                                title="Property location map"
                                className="w-full border border-black"
                                style={{
                                    width: "100%",
                                    height: "220px",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────────── */
export default function ManappuramForm() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(INIT);
    const [liveLocation, setLiveLocation] = useState({ lat: "--", lng: "--" });
    const [saving, setSaving] = useState(false);
    const [autoFilledFields, setAutoFilledFields] = useState([]);

    const handleAutoFill = createAutoFillAdapter(
        MANAPPURAM_MAPPING,
        (mappedData, extractedData) => {
            // First merge and compute calculations on previewForm so remark builder gets the correct landRate/constructionRate values!
            const previewFormRaw = applyMappedFields(form, mappedData);
            
            // Re-calculate GLR and PMR values for the previewForm
            const gPreview = { ...previewFormRaw.valuationGLR };
            gPreview.landValue = String(
                Math.round(
                    (parseFloat(gPreview.landArea) || 0) * (parseFloat(gPreview.landRate) || 0)
                )
            );
            previewFormRaw.valuationGLR = gPreview;

            const pPreview = { ...previewFormRaw.valuationPMR };
            const lvPreview =
                (parseFloat(pPreview.landArea) || 0) * (parseFloat(pPreview.landRate) || 0);
            const cvPreview =
                (parseFloat(pPreview.constructionArea) || 0) *
                (parseFloat(pPreview.constructionRate) || 0);
            pPreview.landValue = String(Math.round(lvPreview));
            pPreview.constructionValue = String(Math.round(cvPreview));
            pPreview.totalValue = String(Math.round(lvPreview + cvPreview));
            const distressPreview = Math.round((lvPreview + cvPreview) * 0.85);
            previewFormRaw.valuationPMR = pPreview;
            previewFormRaw.distressValue = String(distressPreview);

            previewFormRaw.summary = {
                ...previewFormRaw.summary,
                presentMarketValue: pPreview.totalValue,
                forcedSaleValue: String(distressPreview),
            };

            const nextRemarks = buildManappuramRemarks(extractedData, previewFormRaw);

            setAutoFilledFields(
                nextRemarks?.length
                    ? [...Object.keys(mappedData), "remarks"]
                    : Object.keys(mappedData)
            );
            setForm((prev) => {
                const nextForm = applyMappedFields(prev, mappedData);
                
                // Re-calculate valuationGLR and valuationPMR for the final form state
                const g = { ...nextForm.valuationGLR };
                g.landValue = String(
                    Math.round(
                        (parseFloat(g.landArea) || 0) * (parseFloat(g.landRate) || 0)
                    )
                );
                nextForm.valuationGLR = g;

                const p = { ...nextForm.valuationPMR };
                const lv =
                    (parseFloat(p.landArea) || 0) * (parseFloat(p.landRate) || 0);
                const cv =
                    (parseFloat(p.constructionArea) || 0) *
                    (parseFloat(p.constructionRate) || 0);
                p.landValue = String(Math.round(lv));
                p.constructionValue = String(Math.round(cv));
                p.totalValue = String(Math.round(lv + cv));
                const distress = Math.round((lv + cv) * 0.85);
                nextForm.valuationPMR = p;
                nextForm.distressValue = String(distress);

                nextForm.summary = {
                    ...nextForm.summary,
                    presentMarketValue: p.totalValue,
                    forcedSaleValue: String(distress),
                };

                if (mappedData.imageUrls && Array.isArray(mappedData.imageUrls)) {
                    nextForm.imageUrls = [...(nextForm.imageUrls || []), ...mappedData.imageUrls];
                }

                return nextRemarks?.length
                    ? { ...nextForm, remarks: nextRemarks }
                    : nextForm;
            });

            const coordinates = mappedData["summary.coordinates"];
            if (coordinates) {
                setLiveLocation(getCoordinateSnapshot(coordinates));
            }
        }
    );

    const handleDirectDownload = async () => {
        const source = document.getElementById("mnfl-print-area");
        if (!source) return toast.error("Print area not found");

        const toastId = toast.loading("⏳ Preparing PDF, please wait…");

        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const filename = `Valuation Report ${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}.pdf`;

        const clone = source.cloneNode(true);
        clone.id = "mnfl-print-clone";
        clone.removeAttribute("style");
        clone.style.cssText = [
            "position:static",
            "left:auto",
            "top:auto",
            "width:794px",
            "max-height:none",
            "height:auto",
            "overflow:visible",
            "opacity:1",
            "background:white",
            "padding:0",
            "display:block",
        ].join(" !important;") + " !important;";

        clone.querySelectorAll(".no-print").forEach((el) => (el.style.display = "none"));

        const waitForImageLoad = (img) =>
            new Promise((resolve) => {
                if (!img) return resolve();
                if (img.complete && img.naturalWidth > 0) return resolve();
                img.onload = () => resolve();
                img.onerror = () => resolve();
            });

        const buildFallbackMap = (lat, lng) => {
            const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="600" height="220">
                <rect width="100%" height="100%" fill="white"/>
                <rect x="1" y="1" width="598" height="218" fill="none" stroke="black" stroke-width="2"/>
                <rect x="10" y="10" width="580" height="200" fill="#f7f7f7" stroke="#ddd"/>
                <circle cx="300" cy="110" r="10" fill="red"/>
                <text x="300" y="145" text-anchor="middle" font-family="Arial" font-size="14" fill="black">
                    ${lat}, ${lng}
                </text>
                <text x="300" y="170" text-anchor="middle" font-family="Arial" font-size="12" fill="gray">
                    Map preview unavailable
                </text>
            </svg>
        `;
            return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
        };

        clone.querySelectorAll("iframe").forEach((iframe) => {
            const src = iframe.getAttribute("src") || "";
            const m = src.match(/[?&]q=([^,&]+),([^&]+)/);

            if (m) {
                const lat = m[1].trim();
                const lng = m[2].trim();

                const mapImg = document.createElement("img");
                mapImg.setAttribute("crossorigin", "anonymous");
                mapImg.setAttribute("referrerpolicy", "no-referrer");
                mapImg.alt = "Map location";
                mapImg.style.cssText =
                    "width:100%;height:220px;border:1px solid black;object-fit:cover;display:block;";

                const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=600x220&markers=${lat},${lng},red-marker`;

                mapImg.src = mapUrl;
                mapImg.onerror = () => {
                    mapImg.src = buildFallbackMap(lat, lng);
                };

                iframe.parentNode.replaceChild(mapImg, iframe);
            } else {
                iframe.remove();
            }
        });

        const toBase64 = (imgEl) =>
            new Promise((resolve) => {
                const src = imgEl.getAttribute("src");
                if (!src || src.startsWith("data:")) return resolve();

                fetch(src, { mode: "cors" })
                    .then((r) => r.blob())
                    .then((blob) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            imgEl.src = reader.result;
                            resolve();
                        };
                        reader.onerror = () => resolve();
                        reader.readAsDataURL(blob);
                    })
                    .catch(() => resolve());
            });

        const images = Array.from(clone.querySelectorAll("img"));
        await Promise.allSettled(images.map(toBase64));
        await Promise.allSettled(images.map(waitForImageLoad));

        const wrapper = document.createElement("div");
        wrapper.style.cssText =
            "position:fixed;top:0;left:0;width:794px;z-index:-99999;background:white;opacity:0;pointer-events:none;";
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        await new Promise((r) => setTimeout(r, 500));

        const opt = {
            margin: [0, 0, 0, 0],
            filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                scrollX: 0,
                scrollY: 0,
                windowWidth: 794,
                imageTimeout: 30000,
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait",
                compress: true,
            },
            pagebreak: {
                mode: ["css", "legacy"],
                avoid: ["tr", "td", "img", "iframe", ".print-no-break"],
            },
        };

        try {
            await html2pdf().set(opt).from(clone).save();
            toast.success("✅ PDF downloaded!");
        } catch (err) {
            console.error(err);
            toast.error("❌ PDF generation failed");
        } finally {
            toast.dismiss(toastId);
            document.body.removeChild(wrapper);
        }
    };

    useEffect(() => {
        if (id || !navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                setLiveLocation({ lat, lng });
                setForm((prev) => ({
                    ...prev,
                    summary: { ...prev.summary, coordinates: `${lat}, ${lng}` },
                }));
            },
            () => { },
            { enableHighAccuracy: true }
        );
    }, [id]);

    useEffect(() => {
        if (!id) return;

        dispatch(fetchManappuramById(id))
            .unwrap()
            .then((data) => {
                const nextForm = {
                    ...INIT,
                    ...data,
                    AttachDocuments: data.AttachDocuments || [],
                    imageUrls: data.imageUrls || [],
                    remarks: normalizeRemarks(data.remarks),
                };

                setForm(nextForm);
                setLiveLocation(getCoordinateSnapshot(nextForm.summary?.coordinates));
            });
    }, [dispatch, id]);

    const set = (sec, field, val) =>
        setForm((prev) => ({ ...prev, [sec]: { ...prev[sec], [field]: val } }));

    const calcGLR = (field, val) =>
        setForm((prev) => {
            const g = { ...prev.valuationGLR, [field]: val };
            g.landValue = String(
                Math.round(
                    (parseFloat(g.landArea) || 0) * (parseFloat(g.landRate) || 0)
                )
            );
            return { ...prev, valuationGLR: g };
        });

    const calcPMR = (field, val) =>
        setForm((prev) => {
            const p = { ...prev.valuationPMR, [field]: val };
            const lv =
                (parseFloat(p.landArea) || 0) * (parseFloat(p.landRate) || 0);
            const cv =
                (parseFloat(p.constructionArea) || 0) *
                (parseFloat(p.constructionRate) || 0);
            p.landValue = String(Math.round(lv));
            p.constructionValue = String(Math.round(cv));
            p.totalValue = String(Math.round(lv + cv));
            const distress = Math.round((lv + cv) * 0.85);
            return { ...prev, valuationPMR: p, distressValue: String(distress) };
        });

    const addRemark = () =>
        setForm((prev) => ({ ...prev, remarks: [...prev.remarks, ""] }));

    const updateRemark = (i, v) => {
        const r = [...form.remarks];
        r[i] = v;
        setForm((prev) => ({ ...prev, remarks: r }));
    };

    const deleteRemark = (i) =>
        setForm((prev) => ({
            ...prev,
            remarks: prev.remarks.filter((_, idx) => idx !== i),
        }));

    const addImage = (imgObj) =>
        setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, imgObj] }));

    const deleteImage = async (index, fileId) => {
        try {
            const img = form.imageUrls[index];
            if (img?.fileId && id) {
                await axiosInstance.delete(`/manappuram/delete-file/${id}`, {
                    data: { fileId: img.fileId, type: "image", url: img.url },
                });
            }
            setForm((prev) => ({
                ...prev,
                imageUrls: prev.imageUrls.filter((_, i) => i !== index),
            }));
            toast.success("Image deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete image");
        }
    };

    const addDocument = (docObj) =>
        setForm((prev) => ({
            ...prev,
            AttachDocuments: [...prev.AttachDocuments, docObj],
        }));

    const deleteDocument = async (index, fileId) => {
        try {
            const doc = form.AttachDocuments[index];
            if (doc?.fileId && id) {
                await axiosInstance.delete(`/manappuram/delete-file/${id}`, {
                    data: { fileId: doc.fileId, type: "document", url: doc.url },
                });
            }
            setForm((prev) => ({
                ...prev,
                AttachDocuments: prev.AttachDocuments.filter((_, i) => i !== index),
            }));
            toast.success("Document deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete document");
        }
    };

    const downloadAllImages = async () => {
        const zip = new JSZip();
        for (let i = 0; i < form.imageUrls.length; i++) {
            try {
                const blob = await (await fetch(form.imageUrls[i].url)).blob();
                zip.file(`image_${i + 1}.${blob.type.split("/")[1] || "jpg"}`, blob);
            } catch { }
        }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(await zip.generateAsync({ type: "blob" }));
        link.download = "manappuram_images.zip";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const downloadAllDocuments = async () => {
        const zip = new JSZip();
        for (let i = 0; i < form.AttachDocuments.length; i++) {
            const doc = form.AttachDocuments[i];
            try {
                const blob = await (await fetch(doc.url)).blob();
                const ext = doc.name ? doc.name.split(".").pop() : "pdf";
                zip.file(`document_${i + 1}.${ext}`, blob);
            } catch { }
        }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(await zip.generateAsync({ type: "blob" }));
        link.download = "manappuram_documents.zip";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            const payload = {
                ...form,
                createdAt: form.header?.createdAt || "",

                remarks: normalizeRemarks(form.remarks),
                imageUrls: form.imageUrls
                    .map((img) => (typeof img === "string" ? { url: img } : img))
                    .filter((img) => img?.url?.startsWith("http")),
                AttachDocuments: form.AttachDocuments.filter((doc) =>
                    doc?.url?.startsWith("http")
                ),
            };

            if (id) {
                await dispatch(updateManappuramDetails({ id, ...payload })).unwrap();
                toast.success("Updated ✅");
                if (user?.role === "FieldOfficer") {
                    navigate("/field/dashboard");
                }
            } else {
                const res = await dispatch(createManappuramReport(payload)).unwrap();
                toast.success("Created ✅");
                navigate(`/bank/manappuram/${res._id}`);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error ❌");
        } finally {
            setSaving(false);
        }
    };

    const H = form.header,
        PI = form.propertyInfo,
        SB = form.siteBoundaries;
    const AC = form.accessibility,
        MD = form.municipalDetails,
        TD = form.technicalDetails;
    const GLR = form.valuationGLR,
        PMR = form.valuationPMR,
        SUM = form.summary;

    const inp =
        "w-full px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-800 bg-white outline-none focus:border-blue-400";
    const sel =
        "w-full px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-800 bg-white outline-none";

    const SectionHeader = ({ title }) => (
        <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">
            {title}
        </div>
    );

    return (
        <div
            id="print-section"
            className="max-w-4xl mx-auto my-14 bg-white shadow-lg print:shadow-none print:my-0"
        >
            <div className="no-print fixed top-0 left-0 right-0 z-50 bg-gray-900 p-2 flex items-center gap-2 flex-wrap">
                <div className="flex-1 text-yellow-500 font-bold text-sm">
                    Manappuram Finance — Valuation Report
                </div>

                <button
                    onClick={downloadAllImages}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded text-xs font-medium"
                >
                    📷 Download Images
                </button>
                <button
                    onClick={downloadAllDocuments}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded text-xs font-medium"
                >
                    📄 Download Docs
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded text-xs font-medium disabled:opacity-50"
                >
                    {saving ? "Saving..." : "💾 Save Report"}
                </button>
                {(user?.role === "Admin" || user?.role === "SuperAdmin") && id && (
                    <button
                        onClick={async () => {
                            try {
                                setSaving(true);
                                const payload = {
                                    ...form,
                                    imageUrls: form.imageUrls.filter(img => img?.url?.startsWith("http")),
                                    AttachDocuments: form.AttachDocuments.filter(doc => doc?.url?.startsWith("http")),
                                };
                                await dispatch(updateManappuramDetails({ id, ...payload })).unwrap();
                                await dispatch(finalUpdate({ id, bankName: "manappuram", updateData: payload })).unwrap();
                                toast.success("Report Finalized ✅");
                                navigate("/");
                            } catch (err) {
                                console.error(err);
                                toast.error("Finalization failed");
                            } finally {
                                setSaving(false);
                            }
                        }}
                        disabled={saving}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium disabled:opacity-50"
                    >
                        {saving ? "Finalizing..." : "🚀 Final Submit"}
                    </button>
                )}
                <button
                    onClick={() => window.print()}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs font-medium"
                >
                    📄 Download PDF
                </button>
            </div>

          <div className="no-print w-full flex justify-end">
  <div className="bg-[#fff4f4] border border-[#B5121B] px-3 py-1.5 rounded-lg shadow-sm">
    <input
      type="datetime-local"
      onChange={(e) => setCreatedDate(e.target.value)}
      className="outline-none bg-transparent text-xs text-[#B5121B] font-medium text-right"
    />
  </div>
</div>

            <div className="p-4">
                <div className="print:hidden mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-800">
                        AI Auto-fill
                    </div>
                    <div className="mb-4">
                        <AutoFillForm setFormData={handleAutoFill} />
                    </div>
                    <AdvancedAutoFillForm
                        bankName="Manappuram"
                        setFormData={handleAutoFill}
                    />
                    {autoFilledFields.length > 0 && (
                        <div className="mt-3 text-xs text-slate-600">
                            {autoFilledFields.length} fields auto-filled from uploaded documents.
                        </div>
                    )}
                </div>

                <div className="border-2 border-black flex items-start p-2">
                    <div className="w-full text-center py-2">
                        <img
                            src="/assets/images/header1.jpg"
                            alt="Logo"
                            className="w-full h-auto block"
                        />
                    </div>
                </div>

                <SectionHeader title="Valuation Report Header" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium w-1/3">
                                Valuer Name
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={H.valueName}
                                    onChange={(e) =>
                                        set("header", "valueName", e.target.value)
                                    }
                                    placeholder="Unique Engineering & Associate"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Case Ref. No
                            </td>
                            <td className="border border-black p-1 w-1/3">
                                <input
                                    className={inp}
                                    value={H.caseRefNo}
                                    onChange={(e) =>
                                        set("header", "caseRefNo", e.target.value)
                                    }
                                    placeholder="MNFL-2021-00123"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Date of Visit
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={H.dateOfVisit}
                                    type="date"
                                    onChange={(e) =>
                                        set("header", "dateOfVisit", e.target.value)
                                    }
                                    placeholder="06.03.2021"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Date of Report
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={H.dateOfReport}
                                    type="date"

                                    onChange={(e) =>
                                        set("header", "dateOfReport", e.target.value)
                                    }
                                    placeholder="12.02.2026"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Contacted Person for Property
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={H.contactedPerson}
                                    onChange={(e) =>
                                        set("header", "contactedPerson", e.target.value)
                                    }
                                    placeholder="NAVEEN PRATAP SINGH / 7806052286"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <SectionHeader title="Property Information (01 – 13)" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium w-1/3">
                                01 · Applicant/s Name/s
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.applicantName}
                                    onChange={(e) =>
                                        set("propertyInfo", "applicantName", e.target.value)
                                    }
                                    placeholder="MR. NAVEEN PRATAP SINGH"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Owner
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.ownerName}
                                    onChange={(e) =>
                                        set("propertyInfo", "ownerName", e.target.value)
                                    }
                                    placeholder="MR. NAVEEN PRATAP SINGH S/O MR. MANISH SINGH"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                02 · Document Produced
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={PI.documentProduced}
                                    onChange={(e) =>
                                        set("propertyInfo", "documentProduced", e.target.value)
                                    }
                                >
                                    {[
                                        "SALEDEED",
                                        "AGREEMENT TO SALE",
                                        "MUTATION",
                                        "TAX RECEIPT",
                                        "ALLOTMENT LETTER",
                                        "OTHER",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                03 · Type of Property
                            </td>
                            <td className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={PI.typeOfProperty}
                                    onChange={(e) =>
                                        set("propertyInfo", "typeOfProperty", e.target.value)
                                    }
                                >
                                    {[
                                        "RESIDENTIAL",
                                        "COMMERCIAL",
                                        "INDUSTRIAL",
                                        "AGRICULTURAL",
                                        "INSTITUTIONAL",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Current Usage
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.currentUsage}
                                    onChange={(e) =>
                                        set("propertyInfo", "currentUsage", e.target.value)
                                    }
                                    placeholder="OPEN PLOT"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                04 · Holding Type
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={PI.holdingType}
                                    onChange={(e) =>
                                        set("propertyInfo", "holdingType", e.target.value)
                                    }
                                >
                                    {[
                                        "Free Hold",
                                        "Lease Hold",
                                        "Government Allotted",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                05 · Property Usage
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.propertyUsage}
                                    onChange={(e) =>
                                        set("propertyInfo", "propertyUsage", e.target.value)
                                    }
                                    placeholder="OPEN PLOT"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                06 · Usage Authorized
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.usageAuthorized}
                                    onChange={(e) =>
                                        set("propertyInfo", "usageAuthorized", e.target.value)
                                    }
                                    placeholder="NA"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                07 · Any Usage Restriction of Land?
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={PI.usageRestriction}
                                    onChange={(e) =>
                                        set("propertyInfo", "usageRestriction", e.target.value)
                                    }
                                >
                                    {["No", "Yes"].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                08 · Occupancy Status
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={PI.occupancyStatus}
                                    onChange={(e) =>
                                        set("propertyInfo", "occupancyStatus", e.target.value)
                                    }
                                >
                                    {[
                                        "VACANT",
                                        "OCCUPIED (SELF)",
                                        "OCCUPIED (TENANT)",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                09 · Measurement of the Property
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.measurementOfProperty}
                                    onChange={(e) =>
                                        set(
                                            "propertyInfo",
                                            "measurementOfProperty",
                                            e.target.value
                                        )
                                    }
                                    placeholder="45*40=1800 SQFT"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                10 · Distance from Financing Branch
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.distanceFromBranch}
                                    onChange={(e) =>
                                        set(
                                            "propertyInfo",
                                            "distanceFromBranch",
                                            e.target.value
                                        )
                                    }
                                    placeholder="5.8 KM"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                11 · Address at Site
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <textarea
                                    className={`${inp} min-h-[60px] resize-y`}
                                    value={PI.addressAtSite}
                                    onChange={(e) =>
                                        set("propertyInfo", "addressAtSite", e.target.value)
                                    }
                                    placeholder="PROPERTY SITUATED AT OPEN PLOT, PART OF KHASRA NO..."
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Address as per Document
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <textarea
                                    className={`${inp} min-h-[60px] resize-y`}
                                    value={PI.addressAsPerDocument}
                                    onChange={(e) =>
                                        set(
                                            "propertyInfo",
                                            "addressAsPerDocument",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Same as above or as per deed..."
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                12 · Landmark
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={PI.landmark}
                                    onChange={(e) =>
                                        set("propertyInfo", "landmark", e.target.value)
                                    }
                                    placeholder="KANAK MARRIAGE HALL"
                                />
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                13 · Location of Property
                            </td>
                            <td className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={PI.locationOfProperty}
                                    onChange={(e) =>
                                        set(
                                            "propertyInfo",
                                            "locationOfProperty",
                                            e.target.value
                                        )
                                    }
                                >
                                    {["RURAL", "URBAN", "SEMI-URBAN"].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── SITE BOUNDARIES ── */}
                <SectionHeader title="14 · Site Boundaries" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                        <tr>
                            <th className="border border-black p-1 bg-amber-50">Direction</th>
                            <th className="border border-black p-1 bg-amber-50">
                                As per Title Document
                            </th>
                            <th className="border border-black p-1 bg-amber-50">
                                Actual (Site Visit)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ["East", "eastDoc", "eastActual"],
                            ["West", "westDoc", "westActual"],
                            ["North", "northDoc", "northActual"],
                            ["South", "southDoc", "southActual"],
                        ].map(([dir, dk, ak]) => (
                            <tr key={dir}>
                                <td className="border border-black p-1 font-bold bg-gray-50">
                                    {dir}
                                </td>
                                <td className="border border-black p-1">
                                    <input
                                        className={inp}
                                        value={SB[dk]}
                                        onChange={(e) =>
                                            set("siteBoundaries", dk, e.target.value)
                                        }
                                        placeholder={`${dir} boundary as per deed`}
                                    />
                                </td>
                                <td className="border border-black p-1">
                                    <input
                                        className={inp}
                                        value={SB[ak]}
                                        onChange={(e) =>
                                            set("siteBoundaries", ak, e.target.value)
                                        }
                                        placeholder={`Actual ${dir.toLowerCase()} boundary`}
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td
                                colSpan={2}
                                className="border border-black p-1 bg-gray-50 font-medium"
                            >
                                Site Boundaries Tallied with Title Deed
                            </td>
                            <td className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={SB.boundariesTallied}
                                    onChange={(e) =>
                                        set("siteBoundaries", "boundariesTallied", e.target.value)
                                    }
                                >
                                    {["NO", "YES", "PARTIAL"].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── ACCESSIBILITY ── */}
                <SectionHeader title="15 · Accessibility" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        {[
                            [
                                "Connectivity",
                                "connectivity",
                                "select",
                                ["Average", "Good", "Excellent", "Poor"],
                            ],
                            [
                                "Site Access",
                                "siteAccess",
                                "select",
                                ["UNDER DEV", "DEVELOPED", "GOOD", "POOR"],
                            ],
                            [
                                "Proximity to Amenities",
                                "proximityToAmenities",
                                "input",
                                "02 kms to 03 kms",
                            ],
                            [
                                "Type & Width of Road at Present",
                                "typeWidthOfRoad",
                                "input",
                                "Approx. 23 Feet road physically existing",
                            ],
                            [
                                "Comments on the Property",
                                "commentsOnProperty",
                                "input",
                                "Marketability of the property is AVERAGE",
                            ],
                            [
                                "Within Municipal Limits",
                                "withinMunicipalLimits",
                                "select",
                                [
                                    "GP",
                                    "Municipal Corporation",
                                    "Municipality",
                                    "Town Planning Authority",
                                    "Development Authority",
                                ],
                            ],
                            [
                                "Any other Factor which adversely affect Marketability",
                                "adverseFactors",
                                "select",
                                ["No", "Yes"],
                            ],
                        ].map(([label, key, type, opts]) => (
                            <tr key={key}>
                                <td className="border border-black p-1 bg-gray-50 font-medium w-1/3">
                                    {label}
                                </td>
                                <td colSpan={3} className="border border-black p-1">
                                    {type === "select" ? (
                                        <select
                                            className={sel}
                                            value={AC[key]}
                                            onChange={(e) =>
                                                set("accessibility", key, e.target.value)
                                            }
                                        >
                                            {opts.map((o) => (
                                                <option key={o}>{o}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            className={inp}
                                            value={AC[key]}
                                            onChange={(e) =>
                                                set("accessibility", key, e.target.value)
                                            }
                                            placeholder={opts}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ── MUNICIPAL DETAILS ── */}
                <SectionHeader title="16 · Municipal Details" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        {[
                            ["Sanction Plan Provided", "sanctionPlanProvided", "Not produced"],
                            ["Date of Sanction", "dateOfSanction", "Not produced"],
                            ["Sanctioned Area", "sanctionedArea", "Not produced"],
                            ["Municipal Compliance", "municipalCompliance", "Not produced"],
                            ["Current Age of the Property", "currentAgeProperty", "0"],
                            ["Estimated Residual Age", "estimatedResidualAge", "60"],
                        ].map(([label, key, ph]) => (
                            <tr key={key}>
                                <td className="border border-black p-1 bg-gray-50 font-medium w-1/3">
                                    {label}
                                </td>
                                <td colSpan={3} className="border border-black p-1">
                                    <input
                                        className={inp}
                                        value={MD[key]}
                                        onChange={(e) =>
                                            set("municipalDetails", key, e.target.value)
                                        }
                                        placeholder={ph}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ── TECHNICAL DETAILS ── */}
                <SectionHeader title="17 · Technical Details" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium w-1/3">
                                Construction Type
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.constructionType}
                                    onChange={(e) =>
                                        set("technicalDetails", "constructionType", e.target.value)
                                    }
                                    placeholder="RCC / Load Bearing / Tin Shed"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                No of Floors
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.noOfFloors}
                                    onChange={(e) =>
                                        set("technicalDetails", "noOfFloors", e.target.value)
                                    }
                                    placeholder="GF"
                                />
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Total Land Area (Sqft)
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.totalLandArea}
                                    onChange={(e) =>
                                        set("technicalDetails", "totalLandArea", e.target.value)
                                    }
                                    placeholder="2800"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Total Built-Up Area (Sqft)
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.totalBuiltUpArea}
                                    onChange={(e) =>
                                        set(
                                            "technicalDetails",
                                            "totalBuiltUpArea",
                                            e.target.value
                                        )
                                    }
                                    placeholder="0"
                                />
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Total Floor Area (Sqft)
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.totalFloorArea}
                                    onChange={(e) =>
                                        set("technicalDetails", "totalFloorArea", e.target.value)
                                    }
                                    placeholder="0"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Is the Property an Independent Units & has Independent Access
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={TD.independentAccess}
                                    onChange={(e) =>
                                        set(
                                            "technicalDetails",
                                            "independentAccess",
                                            e.target.value
                                        )
                                    }
                                >
                                    {[
                                        "Independent Access",
                                        "Shared Access",
                                        "No Access",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                If under Construction, % Completion
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.percentCompletion}
                                    onChange={(e) =>
                                        set(
                                            "technicalDetails",
                                            "percentCompletion",
                                            e.target.value
                                        )
                                    }
                                    placeholder="0"
                                />
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Current Age of Property
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.currentAge}
                                    onChange={(e) =>
                                        set("technicalDetails", "currentAge", e.target.value)
                                    }
                                    placeholder="0"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Estimated Residual Age
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={TD.estimatedResidualAge}
                                    onChange={(e) =>
                                        set(
                                            "technicalDetails",
                                            "estimatedResidualAge",
                                            e.target.value
                                        )
                                    }
                                    placeholder="60"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── GLR VALUATION ── */}
                <SectionHeader title="Valuation by GLR (Guideline Rate)" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                        <tr>
                            <th className="border border-black p-1 bg-amber-50">Component</th>
                            <th className="border border-black p-1 bg-amber-50">
                                Area (Sqft)
                            </th>
                            <th className="border border-black p-1 bg-amber-50">
                                Rate (₹/Sqft)
                            </th>
                            <th className="border border-black p-1 bg-amber-50">Value (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 font-medium">
                                Land Component
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={GLR.landArea}
                                    onChange={(e) => calcGLR("landArea", e.target.value)}
                                    placeholder="1800"
                                />
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={GLR.landRate}
                                    onChange={(e) => calcGLR("landRate", e.target.value)}
                                    placeholder="0"
                                />
                            </td>
                            <td className="border border-black p-1 text-right font-semibold">
                                ₹{(parseFloat(GLR.landValue) || 0).toLocaleString("en-IN")}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── PMR VALUATION ── */}
                <SectionHeader title="Valuation by PMR (Prevailing Market Rate)" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                        <tr>
                            <th className="border border-black p-1 bg-amber-50">Component</th>
                            <th className="border border-black p-1 bg-amber-50">
                                Area (Sqft)
                            </th>
                            <th className="border border-black p-1 bg-amber-50">
                                Rate (₹/Sqft)
                            </th>
                            <th className="border border-black p-1 bg-amber-50">Value (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ["Land Component", "landArea", "landRate", PMR.landValue],
                            [
                                "Construction Component",
                                "constructionArea",
                                "constructionRate",
                                PMR.constructionValue,
                            ],
                        ].map(([label, aKey, rKey, v]) => (
                            <tr key={label}>
                                <td className="border border-black p-1 font-medium">
                                    {label}
                                </td>
                                <td className="border border-black p-1">
                                    <input
                                        className={inp}
                                        value={PMR[aKey]}
                                        onChange={(e) => calcPMR(aKey, e.target.value)}
                                        placeholder="0"
                                    />
                                </td>
                                <td className="border border-black p-1">
                                    <input
                                        className={inp}
                                        value={PMR[rKey]}
                                        onChange={(e) => calcPMR(rKey, e.target.value)}
                                        placeholder="0"
                                    />
                                </td>
                                <td className="border border-black p-1 text-right font-semibold">
                                    ₹{(parseFloat(v) || 0).toLocaleString("en-IN")}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-amber-50">
                            <td colSpan={3} className="border border-black p-1 font-bold">
                                Total Value (₹)
                            </td>
                            <td className="border border-black p-1 text-right font-bold">
                                ₹
                                {(parseFloat(PMR.totalValue) || 0).toLocaleString("en-IN")}
                            </td>
                        </tr>
                        <tr className="bg-orange-50">
                            <td colSpan={3} className="border border-black p-1 font-bold">
                                Distress Sale Value (85%) (₹)
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={`${inp} font-bold`}
                                    value={form.distressValue}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            distressValue: e.target.value,
                                        }))
                                    }
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── REMARKS ── */}
                <SectionHeader title="Remarks / Observations" />
                <div className="border border-black p-2">
                    <div className="no-print mb-2">
                        <button
                            onClick={addRemark}
                            className="bg-gray-800 text-white px-3 py-1 rounded text-xs"
                        >
                            ➕ Add Remark
                        </button>
                    </div>
                    {form.remarks.map((remark, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <span className="font-bold text-xs mt-2">{i + 1}.</span>
                            <div className="flex-1">
                                <RichTextToolbarEditor
                                    value={remark}
                                    onChange={(value) => updateRemark(i, value)}
                                    minHeight={120}
                                    editorClassName="rounded bg-white p-2 text-xs outline-none"
                                    toolbarClassName="mb-2 flex flex-wrap gap-1 bg-gray-200 p-1 print:hidden"
                                />
                            </div>
                            <button
                                onClick={() => deleteRemark(i)}
                                className="no-print bg-red-600 text-white rounded px-2 py-1 text-xs h-fit mt-8"
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>

                {/* ── SUMMARY ── */}
                <SectionHeader title="Summary / Declaration" />
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium w-1/3">
                                Property Address
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <textarea
                                    className={`${inp} min-h-[60px] resize-y`}
                                    value={SUM.propertyAddress}
                                    onChange={(e) =>
                                        set("summary", "propertyAddress", e.target.value)
                                    }
                                    placeholder="Full property address..."
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Property Type
                            </td>
                            <td className="border border-black p-1">
                                <select
                                    className={sel}
                                    value={SUM.propertyType}
                                    onChange={(e) =>
                                        set("summary", "propertyType", e.target.value)
                                    }
                                >
                                    {[
                                        "RESIDENTIAL",
                                        "COMMERCIAL",
                                        "INDUSTRIAL",
                                        "AGRICULTURAL",
                                    ].map((o) => (
                                        <option key={o}>{o}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Applicant Name
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={SUM.applicantName}
                                    onChange={(e) =>
                                        set("summary", "applicantName", e.target.value)
                                    }
                                    placeholder="MR. NAVEEN PRATAP SINGH"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Present Market Value (₹)
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={`${inp} font-bold text-green-800`}
                                    value={SUM.presentMarketValue}
                                    onChange={(e) =>
                                        set("summary", "presentMarketValue", e.target.value)
                                    }
                                    placeholder="0"
                                />
                            </td>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Forced Sale Value (₹)
                            </td>
                            <td className="border border-black p-1">
                                <input
                                    className={`${inp} font-bold text-red-800`}
                                    value={SUM.forcedSaleValue}
                                    onChange={(e) =>
                                        set("summary", "forcedSaleValue", e.target.value)
                                    }
                                    placeholder="0"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 bg-gray-50 font-medium">
                                Coordinates (Lat, Lng)
                            </td>
                            <td colSpan={3} className="border border-black p-1">
                                <input
                                    className={inp}
                                    value={SUM.coordinates}
                                    onChange={(e) =>
                                        set("summary", "coordinates", e.target.value)
                                    }
                                    placeholder="24.603531, 80.869926"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* ── PHOTOGRAPHS ── */}
                <div className="">
                    <SectionHeader title="PHOTOGRAPHS OF PROPERTY" />
                    <div className="border border-black p-1">
                        <PhotoGrid
                            label="Subject Property"
                            photos={form.imageUrls}
                            reportId={id}
                            onAdd={addImage}
                            onDelete={deleteImage}
                            onCaptureLocation={(lat, lng) => {
                                setLiveLocation({ lat, lng });
                                set("summary", "coordinates", `${lat}, ${lng}`);
                            }}
                        />
                    </div>
                </div>

                {/* ── DOCUMENTS ── */}
                <div className="no-print">
                    <SectionHeader title="ATTACHED DOCUMENTS" />
                    <div className="border border-black p-1">
                        <FileDocument
                            label="Attached Documents"
                            documents={form.AttachDocuments}
                            reportId={id}
                            onAdd={addDocument}
                            onDelete={deleteDocument}
                        />
                    </div>
                </div>

                {/* ── LIVE LOCATION ── */}
                <div>
                    <SectionHeader title="Live Location (Auto Capture)" />
                    <div className="border border-black p-2 text-center">
                        <div className="mb-2 text-xs">
                            📍 Latitude: <b>{liveLocation.lat}</b> &nbsp;|&nbsp; Longitude:{" "}
                            <b>{liveLocation.lng}</b>
                        </div>
                        <StaticLocationMap
                            latitude={liveLocation.lat}
                            longitude={liveLocation.lng}
                            title="Manappuram live location map"
                            className="mt-1 w-full border border-black"
                            style={{ height: "220px", objectFit: "cover" }}
                        />
                    </div>
                </div>
                <div className="no-print flex gap-3 justify-center mt-4 mb-6">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-green-700 text-white px-6 py-2 rounded font-bold disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "💾 Save Report"}
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-700 text-white px-6 py-2 rounded font-bold"
                    >
                        📄 Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
