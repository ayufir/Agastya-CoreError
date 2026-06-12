
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileDownload from "../../components/FileDownload";
import { fetchHFBankById } from "../../redux/features/Banks/HFBank/HFBankThunk";
import { finalUpdate } from "../../redux/features/case/caseThunks";
import { ReactSortable } from "react-sortablejs";
import moment from "moment";
import StaticLocationMap from "../../components/StaticLocationMap";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────────────────────────────────────
// Word Doc ke 14 default remarks — DB data se auto-fill
// ─────────────────────────────────────────────────────────────────────────────
const buildDefaultRemarks = (d = {}) => {
  const sellerNames = d?.propertyOwnerName || "..........";
  const buyerNames = d?.customerName || "..........";
  const personMet = d?.personMetDuringVisit || "..........";
  const contactNo = d?.customerNo || "..........";
  const plotArea = d?.landArea || "......";
  const dimensions = d?.linearDimension || "";
  const areaStr = dimensions ? `${plotArea} (${dimensions})` : plotArea;
  const landRate = d?.landSiteRate || d?.marketRatePerSqft || "......";

  return [
    `GIVEN XEROX COPY OF SALE DEED IS FAVOUR OF ${sellerNames} / GIVEN XEROX COPY OF DRAFT/SALE AGREEMENT IT IS BETWEEN OF (SEELER: ${sellerNames}) AND (BUYER: ${buyerNames}).`,
    `DURING PROPERTY VISIT MR. ${personMet} JI MET AT THE PROPERTY WHO IS CUSTOMER CONTACT NO. ${contactNo}. IT WAS CLEARLY EXPLAINED TO HIM THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.`,
    "RATE HAS BEEN CONFIRM FORM MARKET ENQUIRY.",
    "PROPERTY IS SITUATED AT SURROUNDING AREA OF LOCALITY IS RESI-CUM A. ZONING SURROUNDING AREA DEVELOPMENT IS 45 %.",
    "AT SITE PROPERTY IS GROUND FLOOR UNDER CONST RESIDENTIAL HOUSE WHICH IS OCCUPIED BY OWNER AND WORK DONE UPTO BRICK AND SLAB WORK COMPLETED.",
    `AS PER SALE DEED/ DRAFT /A.T.S/ ACTUAL LAND AREA IS ${areaStr} SQFT.`,
    "PROPERTY IS NOT IDENTIFIED BY FOUR SIDE BOUNDARIES OF GIVEN SALE DEED/ AGREEMENT AND KEY LOCATION PLAN IS REQUIRE FOR IDENTIFICATION / PRIVATE KEY LOCATION PLAN WHICH IS DRAW BY ARCHITECT.",
    "BUILDING PERMISSION AND MAP IS NOT OBTAIN / ARCHITECT MAP RECEIVE FOR G.F.",
    "BUILDING ESTIMATE NOT PROVIDED JUSTIFY CONST. COST CONSIDER AS PER HOME FIRST POLICY.",
    "CONST COST CONSIDER FOR EXISTING STRUCTURE AS PRESENT CONDITION OF STRUCTURE, ALSO CONST COST OF PROPOSED EXTENSION WORK WILL BE CONSIDER AFTER COMPLETION OF WORK./ CONST COST CONSIDER AFTER COMPLETION OF WORK.",
    "CLEAR LEGAL OPINION TO BE TAKEN REGARDING LAND USES.",
    "SUGGEST TO CREDIT TEAM TO BE CHECK PROPER OWNERSHIP DOCUMENT PRIOR DISBURSEMENT.",
    "VALUER IS NOT RESPONSIBLE FOR ANY LEGAL DISPUTE.",
    `TENTATIVE LAND RATE IS RS. ${landRate}/- SQFT`,
  ];
};

const getImageSource = (image) =>
  typeof image === "string" ? image : image?.url || "";

const HFBankDetails = () => {
  const CPANEL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reportRef = useRef();
  const { singleBank } = useSelector((state) => state.hfBanks);
  const { user } = useSelector((state) => state.auth);
  const reportData = singleBank?.data ?? singleBank;
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchHFBankById(id));
  }, [id, dispatch]);

  // Use saved remarks from DB; if none saved yet, fall back to 14 defaults from Word doc
  const savedRemarks = Array.isArray(reportData?.valuationRemarks)
    ? reportData.valuationRemarks
    : reportData?.valuationRemarks
      ? [reportData.valuationRemarks]
      : [];

  const userRemarks =
    savedRemarks.length > 0 ? savedRemarks : buildDefaultRemarks(reportData);

  const [sortedImages, setSortedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (reportData?.imageUrls?.length > 0) {
      const updated = reportData.imageUrls.map((url, index) => ({
        id: index + 1,
        url,
      }));
      setSortedImages(updated);
    }
  }, [reportData?.imageUrls]);

  const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
  const closeModal = () => setSelectedImage(null);
  const canFinalSubmit = user?.role === "Admin" || user?.role === "SuperAdmin";

  // Helper: show value or fallback
  const val = (v, fallback = "—") =>
    v !== undefined && v !== null && v !== "" ? v : fallback;

  // Format date
  const formatDate = (d) => {
    if (!d) return "—";
    const m = moment(d);
    return m.isValid() ? m.format("DD.MM.YYYY") : d;
  };

  const handleFinalSubmit = async () => {
    if (!canFinalSubmit || !id) return;
    if (!window.confirm("Are you sure you want to Final Submit? This will lock the report.")) {
      return;
    }

    try {
      setIsSaving(true);
      await dispatch(
        finalUpdate({ id, bankName: "home-first", updateData: reportData })
      ).unwrap();
      await dispatch(fetchHFBankById(id)).unwrap();
      toast.success("Report finalized successfully");
    } catch (error) {
      toast.error("Failed to final submit report");
    } finally {
      setIsSaving(false);
    }
  };

  // Documents plan table rows config (matches PDF Section 5)
  const planDocs = [
    {
      label: "NA Conversion Order",
      hint: "{Yes, No, NA}",
      planLabel: "NA Order Number/Date",
    },
    {
      label: "Layout Plan",
      hint: "{TP, ZP, GP, Licensed Surveyor}",
      planLabel: "Plan Number/Date",
    },
    {
      label: "Building Plan",
      hint: "{TP, ZP, GP, Licensed Surveyor}",
      planLabel: "Plan Number/Date",
    },
    {
      label: "Commencement Certificate",
      hint: "{TP, ZP, GP}",
      planLabel: "Plan Number/Date",
    },
    {
      label: "Occupancy/Completion/Building Usage Certificate",
      hint: "{TP, ZP, GP, Licensed Surveyor}",
      planLabel: "Plan Number/Date",
    },
    {
      label: "Sub Plotting Plan",
      hint: "{TP, ZP, GP, Licensed Surveyor}",
      planLabel: "Plan Number/Date",
    },
  ];

  const thStyle = { backgroundColor: "#EFF6FF" };
  const sectionHead =
    "text-black bg-[#FDE9D9] text-start border border-black font-bold px-2";

  return (
    <div className="container mx-auto p-4">
      {/* Note:
        "localhost:5173/#/..." print me aa raha hai to browser ka Header/Footer hai.
        Ctrl+P -> More settings -> "Headers and footers" OFF kar dijiye.
      */}

      {/* ✅ PRINT/PDF DESIGN FIX (A4, no cutting, gaps reduced, images not cropped) */}
      <style>
        {`
          @page { 
            size: A4; 
            margin: 10mm; 
          }

          @media print {
  .flex {
    display: block !important;
  }

  .overflow-hidden {
    overflow: visible !important;
  }
}

          @media print {
            html, body {
              width: 210mm;
              height: auto;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .container, .mx-auto, .p-4 {
              padding: 0 !important;
              margin: 0 !important;
              max-width: none !important;
              width: 100% !important;
            }

            .overflow-x-auto {
              overflow: visible !important;
            }

            .valuation-report table {
              width: 100% !important;
              table-layout: fixed !important;
              border-collapse: collapse !important;
              font-size: 11px !important;
              line-height: 1.15 !important;
            }

            .valuation-report td,
            .valuation-report th {
              word-break: break-word !important;
              overflow-wrap: anywhere !important;
              white-space: normal !important;
              padding-top: 3px !important;
              padding-bottom: 3px !important;
            }

            /* Default: avoid splitting rows */
            .valuation-report tr {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            /* Allow breaking for long blocks to remove end-page gaps */
            .allow-break,
            .allow-break tr,
            .allow-break td,
            .remarks-block {
              break-inside: auto !important;
              page-break-inside: auto !important;
            }

            /* Chrome repeats THEAD on every page; disable repeating */
            .valuation-report thead {
              display: table-row-group !important;
            }

            .valuation-report thead img {
              max-width: 100% !important;
              height: auto !important;
              object-fit: contain !important;
              display: block !important;
              margin: 0 auto !important;
            }

            /* ✅ IMPORTANT: disable forced page break to avoid blank page gap */
            .print-break-before {
              break-before: auto !important;
              page-break-before: auto !important;
            }

            iframe {
              width: 100% !important;
              height: 220px !important;
              border: 0 !important;
            }

            .image-grid {
              display: grid !important;
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 6px !important;
            }

            /* ✅ KEY FIX: images should NOT crop in PDF */
            .image-grid img {
              width: 100% !important;
              height: 58mm !important;
              object-fit: contain !important;
              object-position: center !important;
              background: #fff !important;
              display: block !important;
            }

            .print-photo-cell {
              overflow: visible !important;
            }

            .print-footer {
              opacity: 0 !important;
            }

            .fixed.inset-0 {
              display: none !important;
            }
          }
        `}
      </style>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Home First Valuation Report
          </h2>
          <p className="text-sm text-gray-500">
            {reportData?.customerName || reportData?.refNo || "Saved report"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate(`/bank/home-first/edit/${id}`)}
            className="rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Edit
          </button>

          {canFinalSubmit && (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSaving || reportData?.status === "FinalSubmitted"}
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                isSaving || reportData?.status === "FinalSubmitted"
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSaving
                ? "Finalizing..."
                : reportData?.status === "FinalSubmitted"
                  ? "Final Submitted"
                  : "Final Submit"}
            </button>
          )}
        </div>
      </div>

      <FileDownload data={reportData} tableId="reportTable" />

      <div id="report" ref={reportRef} className="valuation-report">
        <div className="p-3 bg-white shadow border" id="reportTable">
          <div
            id="print-section"
            className="bg-white shadow-md mt-1 rounded-lg overflow-hidden flex"
          >
            <div className="flex-1 overflow-x-auto">
              <table className="w-full border-collapse border">
                {/* ── HEADER ── */}
                <thead>
                  <tr className="border">
                    <th colSpan="6" className="py-1 text-center">
                      <img src="/assets/images/header1.jpg" alt="" />
                      <h1 className="text-center text-xl">VALUATION REPORT</h1>
                    </th>
                  </tr>
                </thead>

                {/* ══════════════════════════════════════════
                    SECTION 1 — GENERAL DETAILS
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="text-start pl-2 w-[10px]" style={thStyle}>
                      1
                    </th>
                    <th colSpan="5" className={sectionHead}>
                      GENERAL DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border font-bold bg-blue-50">Vendor Name:</td>
                    <td
                      colSpan="5"
                      className="border font-bold bg-blue-50 text-center"
                    >
                      <p className="text-blue-500">
                        UNIQUE ENGINEERING AND ASSOCIATE
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Loan Account No. (LAI)
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.refNo)}
                    </td>
                    <td className="border font-bold" colSpan="1">
                      Date
                    </td>
                    <td className="border text-center" colSpan="2">
                      {formatDate(reportData?.dateOfReport)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Pin Code
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.projectPinCode)}
                    </td>
                    <td className="border font-bold" colSpan="1">
                      Geo Coord
                    </td>
                    <td className="border text-center" colSpan="2">
                      {reportData?.latitude && reportData?.longitude
                        ? `${reportData.latitude}, ${reportData.longitude}`
                        : "—"}
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 2 — PROPERTY OVERVIEW
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th
                      className="text-start pl-1 w-[10px] border"
                      style={thStyle}
                    >
                      2
                    </th>
                    <th colSpan="5" className={sectionHead}>
                      Property Overview
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="border">
                      <span className="font-bold">Property Category</span>
                      <br />
                      <span className="text-blue-500">
                        {"{Project/ Individual}"}
                      </span>
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.propertyCategory)}
                    </td>
                    <td colSpan="2" className="border">
                      <span className="font-bold">Property Type</span>
                      <br />
                      <span className="text-blue-500">
                        {
                          "{Apartment, Row House, Individual House, Shop, Office, Industrial}"
                        }
                      </span>
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.unitType)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border font-bold">
                      Type of Loan
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.typeOfLoan)}
                    </td>
                    <td colSpan="2" className="border font-bold">
                      Property Location
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.propertyLocation)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border font-bold">
                      Population as per Census 2011
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.populationCensus2011)}
                    </td>
                    <td colSpan="2" className="border font-bold">
                      Rural / Urban {`(> 10k = Urban)`}
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.ruralUrban)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border font-bold">
                      Zone
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.zone)}
                    </td>
                    <td colSpan="2" className="border font-bold">
                      Property Area Limits
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.propertyAreaLimits)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      <span className="font-bold">RERA No.</span>
                      <span className="text-blue-500"> {"{If applicable}"}</span>
                    </td>
                    <td colSpan="4" className="border text-center">
                      {val(reportData?.eraApplicable)}
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 3 — VISIT DETAILS
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF] pl-1 text-start">3</th>
                    <th colSpan="5" className={sectionHead}>
                      Visit Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Applicant Name
                    </td>
                    <td className="border text-center" colSpan="2">
                      {val(reportData?.customerName)}
                    </td>
                    <td className="border font-bold" colSpan="1">
                      Mobile No.
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.customerNo)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border font-bold">
                      Person Met At Site
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.personMetDuringVisit)}
                    </td>
                    <td colSpan="2" className="border font-bold">
                      Relationship of person met and property
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.relationshipOfPersonMet)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="1">
                      Property Owner's Name
                    </td>
                    <td
                      className="border text-center whitespace-pre-line"
                      colSpan="2"
                    >
                      {val(reportData?.propertyOwnerName)}
                    </td>
                    <td className="border font-bold" colSpan="2">
                      How did you find out property owner's name?
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.howFoundOwnerName)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Property Documents Available?
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.documentsAvailable)}
                    </td>
                    <td className="border font-bold" colSpan="2">
                      Name on Society Board/Signage
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.nameOnSocietyBoard)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Address as per legal document
                    </td>
                    <td className="border text-center" colSpan="4">
                      {val(reportData?.addressLegal)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Address of Property (As per site)
                    </td>
                    <td className="border text-center" colSpan="4">
                      {val(reportData?.addressSite)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Name on door of the premises
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.nameOnDoor)}
                    </td>
                    <td className="border font-bold" colSpan="2">
                      Nearby landmark {`[within 500m]`}
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.nearbyLandmark)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Occupancy
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.statusOfOccupancy)}
                    </td>
                    <td className="border font-bold" colSpan="2">
                      Occupied by
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.occupiedBy)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Usage
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.usageOfProperty)}
                    </td>
                    <td className="border font-bold" colSpan="2">
                      Property easily identifiable?
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.propertyEasilyIdentifiable)}
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 4 — LOCALITY
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">4</th>
                    <th colSpan="5" className={sectionHead}>
                      Locality
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Nearest City/Town
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.nearestCityTown)}
                    </td>
                    <td className="border font-bold" colSpan="2">
                      Location Category{" "}
                      <span className="text-blue-500">{"{TP / ZP / GP}"}</span>
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.locationCategory)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Distance of property from city centre
                    </td>
                    <td className="border text-center">
                      {val(reportData?.distanceFromCityCentre)}
                    </td>
                    <td className="border text-center font-bold">
                      Distance from:
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border px-2 font-bold">Railway Stn</td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">Bus Stand</td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">Hospital</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border text-center font-bold">
                              {val(reportData?.distanceFromRailwayStation)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border text-center font-bold">
                              {val(reportData?.distanceFromBusStand)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border text-center font-bold">
                              {val(reportData?.distanceFromHospital)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td className="border" colSpan="2">
                      <span className="font-bold">Approach Road Width</span>
                      <span className="text-blue-500"> {"{In Feet}"}</span>
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.approachRoadWidth)}
                    </td>
                    <td className="border font-bold" colSpan="2">
                      Approach Road Type
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.approachRoadType)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Occupancy in Project
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.occupancyPercentage)}
                    </td>
                    <td className="border font-bold" colSpan="2">
                      Habitation of nearby area
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.habitationPercentage)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border" colSpan="2">
                      <span className="font-bold">Negative Markers If Any</span>
                      <br />
                      <span className="text-blue-500">
                        {"{HT Wire, Nallah, River, Lake, Road Widening}"}
                      </span>
                    </td>
                    <td className="border text-center">
                      {val(reportData?.nallahRiverHighTension)}
                    </td>
                    <td className="border text-center font-bold">
                      Availability :
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border px-2 font-bold">Electricity</td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">Water</td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">Drainage</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border text-center font-bold">
                              {val(reportData?.electricityAvailability)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border text-center font-bold">
                              {val(reportData?.waterAvailability)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border text-center font-bold">
                              {val(reportData?.drainageAvailability)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 5 — PROPERTY PLAN
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">5</th>
                    <th colSpan="5" className={sectionHead}>
                      Property Plan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {planDocs.map((planRow, idx) => {
                    const saved =
                      reportData?.documents?.find(
                        (d) => d.type === planRow.label
                      ) || {};
                    return (
                      <tr key={idx}>
                        <td className="border" colSpan="2">
                          <span className="font-bold">{planRow.label}</span>
                          <br />
                          <span className="text-blue-500">
                            {planRow.hint}
                          </span>
                        </td>
                        <td className="border text-center" colSpan="1">
                          {val(saved.approvingAuthority)}
                        </td>
                        <td className="border font-bold" colSpan="1">
                          {planRow.planLabel}
                        </td>
                        <td className="border text-center" colSpan="1">
                          {val(saved.approvalDate)}
                        </td>
                        <td className="border text-center" colSpan="1">
                          {val(saved.approvalDetails)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 6 — NDMA GUIDELINES
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">6</th>
                    <th colSpan="5" className={sectionHead}>
                      NDMA Guidelines
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Property falls under Seismic Zone
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.seismicZone)}
                    </td>
                    <td className="border font-bold" colSpan="2">
                      Property falls under Flood Zone
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.floodZone)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Property falls under Cyclone Zone
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.cycloneZone)}
                    </td>
                    <td className="border font-bold" colSpan="2">
                      Property falls under Landslide Prone Zone
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.landslideProneZone)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Property falls under CR Zone
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.crZone)}
                    </td>
                    <td className="border font-bold" colSpan="2">
                      Property falls under Demolition Risk
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.demolitionRisk)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border font-bold" colSpan="2">
                      Demolition Risk Details
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.demolitionRiskDetails)}
                    </td>
                    <td className="border font-bold" colSpan="2">
                      Property Follows NDMA Guidelines
                    </td>
                    <td className="border text-center" colSpan="1">
                      {val(reportData?.followsNDMAGuidelines)}
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 7 — BOUNDARIES & DIMENSIONS
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">7</th>
                    <th colSpan="5" className={sectionHead}>
                      Boundaries and Dimensions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border" colSpan="2">
                      Boundaries
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border px-2 font-bold">Directions</td>
                          </tr>
                          {["North", "South", "East", "West"].map((d) => (
                            <tr key={d}>
                              <td className="border px-2 font-bold">{d}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border text-center font-bold">
                              As per documents
                            </td>
                          </tr>
                          {["North", "South", "East", "West"].map((d) => (
                            <tr key={d}>
                              <td className="border text-center font-bold">
                                {val(reportData?.directions?.[d]?.document)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border px-2 font-bold">As per site</td>
                          </tr>
                          {["North", "South", "East", "West"].map((d) => (
                            <tr key={d}>
                              <td className="border px-2 font-bold">
                                {val(reportData?.directions?.[d]?.actual)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border px-2 font-bold">As per plan</td>
                          </tr>
                          {["North", "South", "East", "West"].map((d) => (
                            <tr key={d}>
                              <td className="border px-2 font-bold">
                                {val(reportData?.directions?.[d]?.plan)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border px-4">
                      Boundaries Matching?
                    </td>
                    <td colSpan="1" className="border px-4">
                      {val(reportData?.boundariesMatching)}
                    </td>
                    <td colSpan="2" className="border px-4">
                      Property Demarcated?
                    </td>
                    <td colSpan="1" className="border px-4">
                      {val(reportData?.propertyDemarcated)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border px-4">
                      Boundary Remarks in Detail
                    </td>
                    <td colSpan="4" className="border px-4">
                      {val(reportData?.boundaryRemarks)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border px-4">
                      Marketability{" "}
                      <span className="text-blue-500">
                        {"{Good / Average / Poor}"}
                      </span>
                    </td>
                    <td colSpan="4" className="border px-4">
                      {val(reportData?.marketability)}
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 8 — STRUCTURAL DETAILS
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">8</th>
                    <th colSpan="5" className={sectionHead}>
                      Structural Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="border">
                      <span>Type of structure</span>
                      <br />
                      <span className="text-blue-500">
                        {"{RCC / Load bearing}"}
                      </span>
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.typeOfStructure)}
                    </td>
                    <td colSpan="2" className="border">
                      <span>Type of roof</span>
                      <br />
                      <span className="text-blue-500">
                        {
                          "{ACC Sheet/ Stone Patti/ Tin Sheet/ Terracotta Tiles, Thatch roof}"
                        }
                      </span>
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.typeOfRoof)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      No. of floors permissible
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.noOfFloorsPermissible)}
                    </td>
                    <td colSpan="2" className="border">
                      No. of floors – Actual
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.noOfFloorsActual)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      No. of units/flats on each floor
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.noOfUnitFlatOnEachFloor)}
                    </td>
                    <td colSpan="2" className="border">
                      <span>Quality of construction</span>
                      <span className="text-blue-500">
                        {" "}
                        {"{Good / Avg./ Poor}"}
                      </span>
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.qualityOfConstruction)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      Age of property
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.approxAgeOfProperty)}
                    </td>
                    <td colSpan="2" className="border">
                      Residual age
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.residualAge)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      Land Area
                    </td>
                    <td colSpan="2" className="border text-center">
                      {val(reportData?.landArea)}
                    </td>
                    <td colSpan="1" className="border">
                      Linear Dimension
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.linearDimension)}
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 9 — VIOLATION OBSERVED
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">9</th>
                    <th colSpan="5" className={sectionHead}>
                      Violation Observed (if any)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="border">
                      Demolition risk due to violation?
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.demolitionRisk)}
                    </td>
                    <td colSpan="2" className="border">
                      Remarks
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.demolitionDetails)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      Encroachment of land?
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.encroachment)}
                    </td>
                    <td colSpan="2" className="border">
                      Remarks
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.encroachmentDetails)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      Deviation to Plan?
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.deviationToPlan)}
                    </td>
                    <td colSpan="2" className="border">
                      Remarks
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.deviationDetails)}
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 10 — VALUATION
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">10</th>
                    <th colSpan="5" className={sectionHead}>
                      Valuation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* ── Land ── */}
                  <tr>
                    <td className="border" colSpan="2">
                      Land
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border px-2 font-bold">As per</td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              Document (L1)
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">Plan (L2)</td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">Site (L3)</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border text-center font-bold">
                              Area
                            </td>
                          </tr>
                          <tr>
                            <td className="border text-center font-bold">
                              {val(reportData?.landDocumentArea, 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border text-center font-bold">
                              {val(reportData?.landPlanArea, 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border text-center font-bold">
                              {val(reportData?.landSiteArea, 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border px-2 font-bold">
                              Rate per sq.ft
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              {val(reportData?.landDocumentRate, 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              {val(reportData?.landPlanRate, 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              {val(reportData?.landSiteRate, 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border px-2 font-bold">Valuation</td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              {val(reportData?.landDocumentValuation, 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              {val(reportData?.landPlanValuation, 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              {val(reportData?.landSiteValuation, 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {/* ── Construction ── */}
                  <tr>
                    <td className="border" colSpan="2">
                      Construction
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border px-2 font-bold">As per</td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              Document (L1)
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">Plan (L2)</td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">Site (L3)</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border text-center font-bold">
                              Area
                            </td>
                          </tr>
                          <tr>
                            <td className="border text-center font-bold">
                              {val(reportData?.constructionDocumentArea, 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border text-center font-bold">
                              {val(reportData?.constructionPlanArea, 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border text-center font-bold">
                              {val(reportData?.constructionSiteArea, 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border px-2 font-bold">
                              Rate per sq.ft
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              {val(reportData?.constructionDocumentRate, 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              {val(reportData?.constructionPlanRate, 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              {val(reportData?.constructionSiteRate, 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td className="border p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border px-2 font-bold">Valuation</td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              {val(reportData?.constructionDocumentValuation, 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              {val(reportData?.constructionPlanValuation, 0)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border px-2 font-bold">
                              {val(reportData?.constructionSiteValuation, 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {/* ── Amenities ── */}
                  <tr>
                    <td colSpan="2" className="border">
                      Amenities{" "}
                      <span className="text-blue-500">{"{Mention details}"}</span>
                    </td>
                    <td colSpan="2" className="border text-center">
                      {val(reportData?.amenitiesDetails)}
                    </td>
                    <td colSpan="1" className="border">
                      Value of amenities (A)
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.amenitiesValue)}
                    </td>
                  </tr>

                  {/* ── Lift / Height ── */}
                  <tr>
                    <td colSpan="2" className="border">
                      Lift Available?{" "}
                      <span className="text-blue-500">{"{Yes/ No}"}</span>
                    </td>
                    <td colSpan="2" className="border text-center">
                      {val(reportData?.liftAvailable)}
                    </td>
                    <td colSpan="1" className="border">
                      Height of the building
                      <br />
                      <span className="text-blue-500">{"{in Meters}"}</span>
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.buildingHeight)}
                    </td>
                  </tr>

                  {/* ── Realizable Value ── */}
                  <tr>
                    <td colSpan="5" className="border p-1">
                      Realizable Value after completion <span>{"{L3 + C3 + A}"}</span>
                    </td>
                    <td className="border text-center">
                      {val(reportData?.realizableValue)}
                    </td>
                  </tr>

                  {/* ── Construction Stage ── */}
                  <tr>
                    <td colSpan="3" className="border p-1">
                      Construction Stage
                      <br />
                      <span className="text-blue-500">
                        {`{Foundation/Plinth/Brick Work/RCC/Plaster/Tiling/Internal Finishing/Completed}`}
                      </span>
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.constructionStage)}
                    </td>
                    <td colSpan="1" className="border">
                      Construction %
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.constructionStatus)}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="5" className="border p-1">
                      Valuation at current stage
                    </td>
                    <td className="border text-center">
                      {val(reportData?.ValuationatPresentStage)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="border p-1">
                      Valuation as per Govt. guideline <span>{"{L3+C3+A}"}</span>
                    </td>
                    <td className="border text-center">
                      {val(reportData?.ValuationasperGovtGuideline)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="border p-1">
                      Construction estimate shared by customer{" "}
                      <span>{"{L3+C3+A}"}</span>
                    </td>
                    <td className="border text-center">
                      {val(reportData?.constructionEstimateByCustomer)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="border p-1">
                      Estimate recommended (by valuer)
                    </td>
                    <td className="border text-center">
                      {val(reportData?.estimateRecommendedByValuer)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="border p-1">
                      Market rate for similar properties in the locality
                      (Rs/sq.ft)
                    </td>
                    <td className="border text-center">
                      {val(reportData?.marketRatePerSqft)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="border p-1">
                      Whether construction is as per plan / permission / building
                      by laws
                    </td>
                    <td className="border text-center">
                      {val(reportData?.constructionAsPerPlan)}
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 11 — OBSERVATIONS / REMARKS
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    {/* <th className="bg-[#F0F8FF]">11</th> */}
                    <th colSpan="5" className={sectionHead}>
                      Observations Remark:
                    </th>
                  </tr>
                </thead>
                <tbody className="allow-break">
                  <tr>
                    <td colSpan="6" className="border p-3 remarks-block">
                      <ol className="list-decimal pl-5 space-y-1 text-sm">
                        {userRemarks.map((remark, idx) => (
                          <li key={idx} className="py-0.5 leading-snug">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: remark || "",
                              }}
                            />
                          </li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                </tbody>

                <thead>
                  <th className="bg-[#F0F8FF]">11</th>

                  <th colSpan="5" className={sectionHead}>
                    Floor wise built-up area
                  </th>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="border">
                      Floor
                    </td>
                    <td colSpan="1" className="border text-center">
                      As per plan
                    </td>
                    <td colSpan="2" className="border">
                      As per site
                    </td>
                    <td colSpan="1" className="border text-center">
                      Remarks
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      GF
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.gfPlan)}
                    </td>
                    <td colSpan="2" className="border">
                      {val(reportData?.gfSite)}
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.gfRemark)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      FF
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.ffPlan)}
                    </td>
                    <td colSpan="2" className="border">
                      {val(reportData?.ffSite)}

                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.ffRemark)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      SF
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.sfPlan)}
                    </td>
                    <td colSpan="2" className="border">
                      {val(reportData?.sfSite)}
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.sfRemark)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      TF
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.tfPlan)}
                    </td>
                    <td colSpan="2" className="border">
                      {val(reportData?.tfSite)}

                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.tfRemark)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="border">
                      FF
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.fifthPlan)}
                    </td>
                    <td colSpan="2" className="border">
                      {val(reportData?.fifthSite)}

                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.fifthRemark)}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="2" className="border">
                      Total BUA
                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.totalPlan)}
                    </td>
                    <td colSpan="2" className="border">
                      {val(reportData?.totalSite)}

                    </td>
                    <td colSpan="1" className="border text-center">
                      {val(reportData?.totalRemark)}
                    </td>
                  </tr>
                </tbody>

                {/* ══════════════════════════════════════════
                    SECTION 12 — PROPERTY PHOTOS
                ══════════════════════════════════════════ */}
                <thead>
                  <tr>
                    <th className="bg-[#F0F8FF]">12</th>
                    <th colSpan="5" className={sectionHead}>
                      Property Photos
                    </th>
                  </tr>
                </thead>
                <tbody className="allow-break">
                  <tr>
                    <td
                      className="border border-black px-4 font-semibold print-photo-cell"
                      colSpan="6"
                    >
                      {sortedImages.length === 0 ? (
                        <p className="text-gray-500 p-2">No images uploaded.</p>
                      ) : (
                        <ReactSortable
                          list={sortedImages}
                          setList={setSortedImages}
                          className="image-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-2 gap-2"
                          animation={200}
                        >
                          {sortedImages.map((item, index) => (
                            <div
                              key={item.id}
                              className="overflow-hidden border p-1 cursor-pointer"
                              onClick={() => handleImageClick(getImageSource(item?.url))}
                            >
                              <img
                                src={getImageSource(item?.url)}
                                alt={`Image ${index + 1}`}
                                className="w-full h-80 object-contain bg-white"
                              />
                            </div>
                          ))}
                        </ReactSortable>
                      )}
                    </td>
                  </tr>
                </tbody>

                {/* ── LOCATION ── */}
                <tbody className="allow-break">
                  <tr>
                    <td className="bg-[#F0F8FF]"></td>
                    <td
                      className="border text-start border-black font-bold px-4 bg-[#FDE9D9] text-red-500"
                      colSpan="5"
                    >
                      LOCATION
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black px-4 font-semibold">
                      Geo-Coordinates
                    </td>
                    <td className="border px-4 text-center" colSpan="1">
                      <b>Latitude</b>
                    </td>
                    <td colSpan="1">{val(reportData?.latitude)}</td>
                    <td className="border px-4 text-center" colSpan="1">
                      <b>Longitude</b>
                    </td>
                    <td colSpan="2">{val(reportData?.longitude)}</td>
                  </tr>
                  <tr>
                    <td className="bg-[#F0F8FF]"></td>
                    <td colSpan="5" className="border border-black">
                      {reportData?.latitude && reportData?.longitude ? (
                        <StaticLocationMap
                          latitude={reportData.latitude}
                          longitude={reportData.longitude}
                          title="Home First location map"
                          className="w-full border-0"
                          style={{ width: "100%", height: "300px" }}
                        />
                      ) : (
                        <p className="text-center text-gray-500 p-4">
                          Coordinates not available
                        </p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="print-footer opacity-0">
                Unique Engineering and Associate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Image Modal ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-5xl max-h-full">
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-gray-300 z-10"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HFBankDetails;
