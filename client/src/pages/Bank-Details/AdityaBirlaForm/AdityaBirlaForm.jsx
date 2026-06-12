



import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createAditya,
    fetchAdityaById,
    updateAdityaDetails,
} from "../../../redux/features/Banks/AdityaBirlaBank/AdityaBirlaThunk";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../../config/axios";
import JSZip from "jszip"; // npm install jszip
import AutoFillForm from "../../AutoFillForm";
import AdvancedAutoFillForm from "../../../components/AdvancedAutoFillForm";
import {
    ADITYA_MAPPING,
} from "../../../config/Bankfieldmappings";
import {
    applyMappedFields,
    createAutoFillAdapter,
} from "../../../utils/Autofilladapter";
import RichTextToolbarEditor from "../../../components/RichTextToolbarEditor";
import StaticLocationMap from "../../../components/StaticLocationMap";
import { buildAdityaRemarksHtml } from "../../../utils/autoFillRemarkBuilders";
import { finalUpdate } from "../../../redux/features/case/caseThunks";

const getCoordinateSnapshot = (latitude, longitude) =>
    latitude && longitude
        ? { lat: String(latitude), lng: String(longitude) }
        : { lat: "--", lng: "--" };

// ─── INITIAL STATE ─────────────────────────────────────────────────────────────
const INIT = {
    basicDetails: {
        nameOfValuer: "", nameOfClient: "", vertical: "", caseReferenceNumber: "",
        nameOfPropertyOwner: "", initiationDate: "", visitDate: "", reportDate: "",
    },
    locationDetails: {
        propertyAddressAsTRF: "", propertyAddressAsVisit: "", propertyAddressAsDocs: "",
        mainLocality: "", subLocality: "", microLocation: "", landmark: "",
        latitude: "", longitude: "", typeOfProperty: "", currentUsage: "",
        valuatorDoneBefore: "No", ifYesWhen: "", propertyType: "Commercial",
        propertySubType: "", locality: "Developing", propertyFallingWithin: "Gram Panchayat",
        occupancyLevel: "Low Population density", conditionOfSite: "Developing",
        distanceRailwayStation: "", distanceBusStop: "",
        distancePlotMainRoad: "Not Applicable (Prop on Md Road)",
        distanceCityCentre: "", distanceABCLBranch: "",
        widthApproachRoad: "Width 20 to 40 ft.", dimensionWidth: "NA", dimensionDepth: "NA",
        physicalApproach: "Clear", legalApproach: "Clear", otherFeatures: "NO",
    },
    propertyDetails: {
        occupancy: "Occupied", occupiedBy: "", nameOfOccupant: "", occupiedSince: "",
        propertyDemarcated: "Yes", propertyIdentification: "YES", identificationThrough: "LOCAL ENQUIRY",
    },
    accommodationDetails: {
        projectCategory: "", flatType: "Normal", flatConfiguration: "NA",
        propertyHolding: "Freehold", typeOfStructure: "", areaOfFlat: "", totalNoOfFloors: "GF",
        liftFacility: "YES / N", amenities: "Average", marketability: "Average",
        viewOfProperty: "", parkingFacility: "YES / N", qualityOfConstruction: "Class B",
        typeOfParking: "Open CP", shapeOfProperty: "Regular", placementOfProperty: "",
        exteriorsOfProperty: "Average", interiorsOfProperty: "Average",
        ageOfProperty: "", residualAge: "", sourceOfAge: "",
        maintenanceOfProperty: "Average", cautiousLocation: "NA",
    },
    documentDetails: {
        saleDeedDetails: "NA", sanctionedPlanDetails: "NA", ccOcDetails: "NA",
        agreementToSaleDetails: "NA", mutationPossessionDetails: "NA",
        taxReceiptDetails: "NA", electricityBillDetails: "NA", conversionDetails: "NA",
    },
    builtUpArea: {
        groundFloorAsPerSite: "", groundFloorDeviation: "No", groundFloorDevRmk: "", groundFloorRmk: "",
        firstFloorAsPerSite: "", firstFloorDeviation: "No", firstFloorDevRmk: "", firstFloorRmk: "",
        totalBuiltUp: "", totalDeviation: "No",
    },
    valuationDetails: {
        plotAreaInDeed: "", plotAreaPhysical: "", plotAreaPhysicalRate: "",
        carpetAreaPlan: "", carpetAreaPlanRate: "", carpetAreaMeasurement: "", carpetAreaMeasRate: "",
        builtUpAreaNorms: "", builtUpAreaNormsRate: "", builtUpAreaTinShed: "", builtUpTinShedRate: "",
        superBuiltUpArea: "", superBuiltUpRate: "", carPark: "", carParkRate: "",
        amenitiesVal: "", amenitiesRate: "",
        totalValue: "", distressValue80: "", insuranceValue: "", governmentValue: "",
        percentageCompletion: "100%", percentageRecommendation: "100%",
    },
    setbacks: {
        frontAsPerPlan: "", frontActual: "0 Ft",
        side1AsPerPlan: "", side1Actual: "0 Ft",
        side2AsPerPlan: "", side2Actual: "0 Ft",
        rearAsPerPlan: "", rearActual: "0 Ft",
        usageDeviation: "", totalValue: "", distressValue: "",
        insuranceValue: "", governmentValue: "",
        percentageCompletion: "100%", percentageRecommendation: "100%",
    },
    boundaryDetails: {
        northAsPerDocs: "", southAsPerDocs: "", eastAsPerDocs: "", westAsPerDocs: "",
        northActual: "", southActual: "", eastActual: "", westActual: "",
        boundaryMatching: "YES",
    },
    remarks: `
<div>1. GIVEN XEROX COPY OF SALE DEED IN FAVOUR OF SMT. PADMA RATHORE W/O MR. M.B. RATHORE.</div>
<div>2. DURING PROPERTY VISIT MR. ABHISHEK GUJRATI JI WAS MET AT THE PROPERTY HE IS CUSTOMER HIS CONTACT NO. 8319943922.</div>
<div>3. RATE HAS BEEN CONFIRM FROM LOCAL MARKET ENQUIRY.</div>
<div>4. PROPERTY IS SITUATED AT SURROUNDING AREA OF LOCALITY IS UNDER DEV RESI CUM INDUSTRIAL ZONING.</div>
<div>5. AT SITE PROPERTY IS G.F. INDUSTRIAL PROPERTY KNOW AS M/S RUDRANSH INDUSTRIES.</div>
<div>6. TOTAL BUILT-UP AREA IS 3664 SQFT.</div>
<div>7. PROPERTY IS IDENTIFIED BY FOUR SIDE BOUNDARIES.</div>
<div>8. BUILT UP IS TAKEN FROM ACTUAL AT SITE.</div>
<div>9. SUGGEST TO CREDIT TEAM TO CHECK OWNERSHIP DOCUMENT.</div>
`,
    engineerDetails: {
        nameOfEngineerVisited: "", nameOfAppraiser: "", reportPreparedBy: "", reportFinalizedBy: "",
    },
    imageUrls: [],
    AttachDocuments: [], // new field for documents
};

// ─── PHOTO GRID COMPONENT (with deletion support) ────────────────────────────
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
            onCaptureLocation(capturedLocation.latitude, capturedLocation.longitude);
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

                const res = await axiosInstance.post("/aditya-birla/upload-image", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

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
            <table className="w-full border-collapse border border-black mb-1">
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
                        <div key={i} className="relative border border-black min-h-[180px]">
                            <img src={src} alt="" className="w-full h-48 object-cover" />
                            <div className="absolute top-1 left-1 flex gap-1">
                                <button
                                    onClick={() => window.open(src, '_blank')}
                                    className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                    title="View"
                                >
                                    👁️
                                </button>
                            </div>
                            <button
                                onClick={() => onDelete(i, img.fileId)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}

                <div
                    className="print:hidden relative border border-black min-h-[180px] cursor-pointer"
                    onClick={() => !uploading && ref.current.click()}
                    style={{ cursor: uploading ? "wait" : "pointer" }}
                >
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600 text-xs">
                        {uploading ? "⏳ Uploading..." : "📷 Click to Upload"}
                    </div>
                </div>
            </div>

            <input
                ref={ref}
                type="file"
                multiple
                accept="image/*"
                className="hidden "
                onChange={handleFiles}
            />
        </div>
    );
}

// ─── DOCUMENT GRID COMPONENT ──────────────────────────────────────────────────
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

                const res = await axiosInstance.post("/aditya-birla/upload-document", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (res.data?.success) {
                    onAdd({ url: res.data.url, fileId: res.data.fileId, name: res.data.name });
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
            <table className="w-full border-collapse border border-black mb-1">
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
                    <div key={i} className="relative border border-black p-2 flex items-center justify-between">
                        <div className="truncate text-xs flex-1">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                {doc.name || "Document"}
                            </a>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => window.open(doc.url, '_blank')}
                                className="bg-blue-500 text-white rounded px-2 py-1 text-xs"
                                title="View"
                            >
                                📄
                            </button>
                            <button
                                onClick={() => onDelete(i, doc.fileId)}
                                className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
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

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function AdityaBirlaForm() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(INIT);
    const [liveLocation, setLiveLocation] = useState({ lat: "--", lng: "--" });
    const [saving, setSaving] = useState(false);
    const [autoFilledFields, setAutoFilledFields] = useState([]);

    const handleAutoFill = createAutoFillAdapter(
        ADITYA_MAPPING,
        (mappedData, extractedData) => {
            const previewForm = applyMappedFields(form, mappedData);
            const nextRemarks = buildAdityaRemarksHtml(extractedData, previewForm);

            setAutoFilledFields(
                nextRemarks ? [...Object.keys(mappedData), "remarks"] : Object.keys(mappedData)
            );
            setForm((prev) => {
                const nextForm = applyMappedFields(prev, mappedData);
                if (mappedData.imageUrls && Array.isArray(mappedData.imageUrls)) {
                    nextForm.imageUrls = [...(nextForm.imageUrls || []), ...mappedData.imageUrls];
                }
                return nextRemarks ? { ...nextForm, remarks: nextRemarks } : nextForm;
            });

            const latitude = mappedData["locationDetails.latitude"];
            const longitude = mappedData["locationDetails.longitude"];
            if (latitude && longitude) {
                setLiveLocation(getCoordinateSnapshot(latitude, longitude));
            }
        }
    );

    useEffect(() => {
        if (id || !navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                setLiveLocation({ lat, lng });
                setForm((prev) => ({
                    ...prev,
                    locationDetails: {
                        ...prev.locationDetails,
                        latitude: lat,
                        longitude: lng,
                    },
                }));
            },
            () => { },
            { enableHighAccuracy: true }
        );
    }, [id]);

    useEffect(() => {
        if (!id) return;

        dispatch(fetchAdityaById(id))
            .unwrap()
            .then((data) => {
                const nextForm = {
                    ...INIT,
                    ...data,
                    AttachDocuments: data.AttachDocuments || [],
                    imageUrls: data.imageUrls || [],
                };

                setForm(nextForm);
                setLiveLocation(
                    getCoordinateSnapshot(
                        nextForm.locationDetails?.latitude,
                        nextForm.locationDetails?.longitude
                    )
                );
            });
    }, [dispatch, id]);

    // Generic section setter
    const set = (sec, field, val) =>
        setForm(prev => ({ ...prev, [sec]: { ...prev[sec], [field]: val } }));

    // Add image object
    const addImage = (imgObj) =>
        setForm(prev => ({ ...prev, imageUrls: [...prev.imageUrls, imgObj] }));

    // Delete image (with backend call)
    const deleteImage = async (index, fileId) => {
        try {
            const img = form.imageUrls[index];
            if (img?.fileId && id) {
                await axiosInstance.delete(`/aditya-birla/delete-file/${id}`, {
                    data: { fileId: img.fileId, type: "image", url: img.url }
                });
            }
            setForm(prev => ({
                ...prev,
                imageUrls: prev.imageUrls.filter((_, i) => i !== index)
            }));
            toast.success("Image deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete image");
        }
    };

    // Add document object
    const addDocument = (docObj) =>
        setForm(prev => ({ ...prev, AttachDocuments: [...prev.AttachDocuments, docObj] }));

    // Delete document (with backend call)
    const deleteDocument = async (index, fileId) => {
        try {
            const doc = form.AttachDocuments[index];
            if (doc?.fileId && id) {
                await axiosInstance.delete(`/aditya-birla/delete-file/${id}`, {
                    data: { fileId: doc.fileId, type: "document", url: doc.url }
                });
            }
            setForm(prev => ({
                ...prev,
                AttachDocuments: prev.AttachDocuments.filter((_, i) => i !== index)
            }));
            toast.success("Document deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete document");
        }
    };

    // Built-up auto calc
    const calcBU = (field, val) => {
        setForm(prev => {
            const bu = { ...prev.builtUpArea, [field]: val };
            bu.totalBuiltUp = String(
                (parseFloat(bu.groundFloorAsPerSite) || 0) +
                (parseFloat(bu.firstFloorAsPerSite) || 0)
            );
            return { ...prev, builtUpArea: bu };
        });
    };

    // Valuation auto calc
    const calcVal = (field, val) => {
        setForm(prev => {
            const vd = { ...prev.valuationDetails, [field]: val };
            const rows = [
                ["plotAreaPhysical", "plotAreaPhysicalRate"],
                ["carpetAreaPlan", "carpetAreaPlanRate"],
                ["carpetAreaMeasurement", "carpetAreaMeasRate"],
                ["builtUpAreaNorms", "builtUpAreaNormsRate"],
                ["builtUpAreaTinShed", "builtUpTinShedRate"],
                ["superBuiltUpArea", "superBuiltUpRate"],
                ["carPark", "carParkRate"],
                ["amenitiesVal", "amenitiesRate"],
            ];
            const total = rows.reduce(
                (s, [a, r]) => s + (parseFloat(vd[a]) || 0) * (parseFloat(vd[r]) || 0), 0
            );
            vd.totalValue = String(Math.round(total));
            vd.distressValue80 = String(Math.round(total * 0.8));
            return { ...prev, valuationDetails: vd };
        });
    };

    const rowTotal = (a, r) => {
        const t = (parseFloat(a) || 0) * (parseFloat(r) || 0);
        return t ? t.toLocaleString("en-IN") : "0";
    };

    // ── BULK DOWNLOAD FUNCTIONS ──────────────────────────────────────────────
    const downloadAllImages = async () => {
        const zip = new JSZip();
        const images = form.imageUrls;
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            try {
                const response = await fetch(img.url);
                const blob = await response.blob();
                const ext = blob.type.split('/')[1] || 'jpg';
                zip.file(`image_${i + 1}.${ext}`, blob);
            } catch (err) {
                console.error(`Failed to download ${img.url}`, err);
            }
        }
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "images.zip";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const downloadAllDocuments = async () => {
        const zip = new JSZip();
        const docs = form.AttachDocuments;
        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            try {
                const response = await fetch(doc.url);
                const blob = await response.blob();
                const ext = doc.name ? doc.name.split('.').pop() : 'pdf';
                zip.file(`document_${i + 1}.${ext}`, blob);
            } catch (err) {
                console.error(`Failed to download ${doc.url}`, err);
            }
        }
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "documents.zip";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    // ── SUBMIT ──────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        try {
            setSaving(true);
            const payload = {
                ...form,
                createdAt: form?.basicDetails?.createdAt || "",

                imageUrls: form.imageUrls
                    .map(img => (typeof img === "string" ? { url: img } : img))
                    .filter(img => img?.url?.startsWith("http")),
                AttachDocuments: form.AttachDocuments.filter(doc => doc?.url?.startsWith("http")),
            };

            if (id) {
                await dispatch(updateAdityaDetails({ id, ...payload })).unwrap();
                toast.success("Updated ✅");
                if (user?.role === "FieldOfficer") {
                    navigate("/field/dashboard");
                }
            } else {
                const res = await dispatch(createAditya(payload)).unwrap();
                toast.success("Created ✅");
                navigate(`/bank/aditya-birla/${res._id}`);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error ❌");
        } finally {
            setSaving(false);
        }
    };

    // ── PDF DOWNLOAD (print) ────────────────────────────────────────────────
    const handleDownloadPDF = () => {
        window.print();
    };

    const B = form.basicDetails;
    const L = form.locationDetails;
    const P = form.propertyDetails;
    const A = form.accommodationDetails;
    const D = form.documentDetails;
    const BU = form.builtUpArea;
    const V = form.valuationDetails;
    const S = form.setbacks;
    const BD = form.boundaryDetails;
    const E = form.engineerDetails;

    return (
        <div id="print-section" className="aditya-print-section max-w-4xl mx-auto my-14 bg-white shadow-lg print:shadow-none print:m-0 print:max-w-full">
            {/* Action Bar (hidden in print) */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 p-2 flex items-center gap-2 print:hidden">
                <div className="flex-1 text-yellow-500 font-bold text-sm">
                    Aditya Birla Capital Ltd.
                </div>
                <button
                    onClick={downloadAllImages}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-1.5 rounded text-sm font-medium"
                >
                    📷 Download All Images
                </button>
                <button
                    onClick={downloadAllDocuments}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-1.5 rounded text-sm font-medium"
                >
                    📄 Download All Documents
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-1.5 rounded text-sm font-medium disabled:opacity-50"
                >
                    {saving ? "Saving..." : "💾 Save Report"}
                </button>

                {(user?.role === "Admin" || user?.role === "SuperAdmin") && id && (
                    <button
                        onClick={async () => {
                            try {
                                setSaving(true);
                                // First save the current changes
                                const payload = {
                                    ...form,
                                    imageUrls: form.imageUrls
                                        .map(img => (typeof img === "string" ? { url: img } : img))
                                        .filter(img => img?.url?.startsWith("http")),
                                    AttachDocuments: form.AttachDocuments.filter(doc => doc?.url?.startsWith("http")),
                                };
                                await dispatch(updateAdityaDetails({ id, ...payload })).unwrap();

                                // Then do final submit
                                await dispatch(finalUpdate({ id, bankName: "aditya", updateData: payload })).unwrap();
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
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-medium disabled:opacity-50"
                    >
                        {saving ? "Finalizing..." : "🚀 Final Submit"}
                    </button>
                )}

                <button
                    onClick={handleDownloadPDF}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded text-sm font-medium"
                >
                    📄 Download PDF
                </button>
            </div>

           <div className="no-print w-full flex justify-end">
  <div className="bg-[#fff4f4] border border-[#B5121B] px-3 py-1.5 rounded-lg shadow-sm">
    <input
      className="outline-none bg-transparent text-xs text-[#B5121B] font-medium text-right"
      type="datetime-local"
      value={B.createdAt}
      onChange={e => set("basicDetails", "createdAt", e.target.value)}
    />
  </div>
</div>

            {/* Report Content */}
            <div className="p-4 print:p-0">
                <div className="print:hidden mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-800">
                        AI Auto-fill
                    </div>
                    <div className="mb-4">
                        <AutoFillForm setFormData={handleAutoFill} />
                    </div>
                    <AdvancedAutoFillForm
                        bankName="Aditya Birla"
                        setFormData={handleAutoFill}
                    />
                    {autoFilledFields.length > 0 && (
                        <div className="mt-3 text-xs text-slate-600">
                            {autoFilledFields.length} fields auto-filled from uploaded documents.
                        </div>
                    )}
                </div>

                {/* Header */}
                <div className="border-2 border-black flex items-start p-2 gap-2 print:border-2">
                    <div className="hdr">
                        <div className="header-wrapper">
                            <img src="/assets/images/header1.jpg" className="header-img-full" alt="header" />
                        </div>
                    </div>
                </div>

                {/* Basic Details Section */}
                <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Basic Details</div>
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr><td className="border border-black p-1 w-1/3 bg-gray-50 font-medium">Name of the Valuer</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={B.nameOfValuer} onChange={e => set("basicDetails", "nameOfValuer", e.target.value)} placeholder="MR. BHART SHARMA" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Name of the Client</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={B.nameOfClient} onChange={e => set("basicDetails", "nameOfClient", e.target.value)} placeholder="M/s RUDRANSH INDUSTRIES" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Initiation Date</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={B.initiationDate} onChange={e => set("basicDetails", "initiationDate", e.target.value)} placeholder="11.02.2026" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Vertical</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={B.vertical} onChange={e => set("basicDetails", "vertical", e.target.value)} placeholder="PRIME" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Visit Date</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={B.visitDate} onChange={e => set("basicDetails", "visitDate", e.target.value)} placeholder="11.02.2026" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Case Reference Number</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={B.caseReferenceNumber} onChange={e => set("basicDetails", "caseReferenceNumber", e.target.value)} placeholder="STSL00000095222" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Report Date</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={B.reportDate} onChange={e => set("basicDetails", "reportDate", e.target.value)} placeholder="11.02.2026" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Name of the Property Owner</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={B.nameOfPropertyOwner} onChange={e => set("basicDetails", "nameOfPropertyOwner", e.target.value)} placeholder="SMT. PADMA RATHORE W/O MR. M.B. RATHORE" /></td></tr>
                    </tbody>
                </table>

                {/* Location Details Section */}
                <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Location Details</div>
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Property Address as Per TRF</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.propertyAddressAsTRF} onChange={e => set("locationDetails", "propertyAddressAsTRF", e.target.value)} /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Property Address as Per Visit</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.propertyAddressAsVisit} onChange={e => set("locationDetails", "propertyAddressAsVisit", e.target.value)} /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Property Address as Per "Docs"</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.propertyAddressAsDocs} onChange={e => set("locationDetails", "propertyAddressAsDocs", e.target.value)} /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Main Locality</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.mainLocality} onChange={e => set("locationDetails", "mainLocality", e.target.value)} placeholder="SEHORE" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Sub Locality</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.subLocality} onChange={e => set("locationDetails", "subLocality", e.target.value)} placeholder="ABDULLAPUR" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Micro Location</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.microLocation} onChange={e => set("locationDetails", "microLocation", e.target.value)} placeholder="ABDULLAPUR" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Landmark</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.landmark} onChange={e => set("locationDetails", "landmark", e.target.value)} placeholder="NEAR RAJPUT DHABA" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Latitude</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.latitude} onChange={e => set("locationDetails", "latitude", e.target.value)} placeholder="23.218819" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Longitude</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.longitude} onChange={e => set("locationDetails", "longitude", e.target.value)} placeholder="77.132607" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Type of Property</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.typeOfProperty} onChange={e => set("locationDetails", "typeOfProperty", e.target.value)} placeholder="COMMERCIAL" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Current Usage</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.currentUsage} onChange={e => set("locationDetails", "currentUsage", e.target.value)} placeholder="Factory" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Has the Valuator Done Valuation for this property before?</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={L.valuatorDoneBefore} onChange={e => set("locationDetails", "valuatorDoneBefore", e.target.value)}><option>No</option><option>Yes</option></select></td><td className="border border-black p-1 bg-gray-50 font-medium">If yes, when</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.ifYesWhen} onChange={e => set("locationDetails", "ifYesWhen", e.target.value)} /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Property Type</td><td colSpan="3" className="border border-black p-1">Residential //&nbsp;<select className="inline w-auto text-xs bg-transparent border-none" value={L.propertyType} onChange={e => set("locationDetails", "propertyType", e.target.value)}><option>Commercial</option><option>Residential</option><option>Industrial</option><option>Institutional</option><option>Agriculture</option></select>&nbsp;// Industrial // Institutional // Agriculture</td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Property Sub Type</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.propertySubType} onChange={e => set("locationDetails", "propertySubType", e.target.value)} placeholder="Factory" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Locality</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={L.locality} onChange={e => set("locationDetails", "locality", e.target.value)}><option>Well Developed</option><option>Developing</option><option>Under Develop</option><option>Slum</option></select></td><td className="border border-black p-1 bg-gray-50 font-medium">Property Falling Within</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={L.propertyFallingWithin} onChange={e => set("locationDetails", "propertyFallingWithin", e.target.value)}><option>Municipal Corporation</option><option>Gram Panchayat</option><option>Town Planning Authority</option><option>Development Authority</option><option>Municipality</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Occupancy Level of the Surrounding</td><td colSpan="3" className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={L.occupancyLevel} onChange={e => set("locationDetails", "occupancyLevel", e.target.value)}><option>Densely Populated</option><option>Moderately Populated</option><option>Low Population density</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Condition of the Site of the Property</td><td colSpan="3" className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={L.conditionOfSite} onChange={e => set("locationDetails", "conditionOfSite", e.target.value)}><option>Well Developed</option><option>Developing</option><option>Under Developed</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Distance to Railway/Metro Station</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.distanceRailwayStation} onChange={e => set("locationDetails", "distanceRailwayStation", e.target.value)} placeholder="7.6 KM" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Distance to Bus Stop</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.distanceBusStop} onChange={e => set("locationDetails", "distanceBusStop", e.target.value)} placeholder="5.7 KM" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Distance of Plot from Main Road</td><td colSpan="3" className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={L.distancePlotMainRoad} onChange={e => set("locationDetails", "distancePlotMainRoad", e.target.value)}><option>Not Applicable (Prop on Md Road)</option><option>Less than 200 m</option><option>200 to 500 m</option><option>above 500 m</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Distance from City Centre</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.distanceCityCentre} onChange={e => set("locationDetails", "distanceCityCentre", e.target.value)} placeholder="38.7 KMS" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Distance from ABCL BRANCH</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.distanceABCLBranch} onChange={e => set("locationDetails", "distanceABCLBranch", e.target.value)} placeholder="36.6 KMS" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Width of the Approach Road</td><td colSpan="3" className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={L.widthApproachRoad || ""} onChange={(e) => set("locationDetails", "widthApproachRoad", e.target.value)}><option value="">-- Select Width --</option><option value="Width is >40 ft.">Width is &gt; 40 ft.</option><option value="Width 20 to 40 ft.">Width 20 to 40 ft.</option><option value="Clear width <10ft">Clear width &lt; 10ft</option><option value="Mud Road">Mud Road</option><option value="Illegal Road (Without document)">Illegal Road (Without document)</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Dimensions of the Property</td><td className="border border-black p-1">Width in feet <input className="w-16 inline-block text-xs border-none bg-transparent" value={L.dimensionWidth} onChange={e => set("locationDetails", "dimensionWidth", e.target.value)} placeholder="NA" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Depth in Feet</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={L.dimensionDepth} onChange={e => set("locationDetails", "dimensionDepth", e.target.value)} placeholder="NA" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Physical Approach to the Property</td><td colSpan="3" className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={L.physicalApproach} onChange={e => set("locationDetails", "physicalApproach", e.target.value)}><option>Clear</option><option>Partially Clear</option><option>Not Clear</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Legal Approach to the Property</td><td colSpan="3" className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={L.legalApproach} onChange={e => set("locationDetails", "legalApproach", e.target.value)}><option>Clear</option><option>Partially Clear</option><option>Not Clear</option></select></td></tr>
                        <tr><td colSpan="3" className="border border-black p-1 text-[9.5px]">Any other features like board of other financier indicating mortgage, notice of Court/any authority which may affect the security</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={L.otherFeatures} onChange={e => set("locationDetails", "otherFeatures", e.target.value)}><option>NO</option><option>YES</option></select></td></tr>
                    </tbody>
                </table>

                {/* Property Details Section */}
                <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Property Details</div>
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Occupancy</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={P.occupancy} onChange={e => set("propertyDetails", "occupancy", e.target.value)}><option>Occupied</option><option>Vacant</option></select></td><td className="border border-black p-1 bg-gray-50 font-medium">Occupied By</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={P.occupiedBy} onChange={e => set("propertyDetails", "occupiedBy", e.target.value)} placeholder="self" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Occupied Since</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={P.occupiedSince} onChange={e => set("propertyDetails", "occupiedSince", e.target.value)} placeholder="2023" /></td><td className="border border-black p-1 bg-gray-50 font-medium text-[9px]">Name of the Occupant</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={P.nameOfOccupant} onChange={e => set("propertyDetails", "nameOfOccupant", e.target.value)} placeholder="MR. RUSRANSH" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Property Demarcated</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={P.propertyDemarcated} onChange={e => set("propertyDetails", "propertyDemarcated", e.target.value)}><option>Yes</option><option>Partially</option><option>No</option></select></td><td className="border border-black p-1 bg-gray-50 font-medium text-[9px]">Property Identification</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={P.propertyIdentification} onChange={e => set("propertyDetails", "propertyIdentification", e.target.value)}><option>YES</option><option>N</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Identification through</td><td colSpan="3" className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={P.identificationThrough} onChange={e => set("propertyDetails", "identificationThrough", e.target.value)}><option>LOCAL ENQUIRY</option><option>DOCUMENT</option><option>BOTH</option></select></td></tr>
                    </tbody>
                </table>

                {/* Accommodation/Unit Details Section */}
                <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Accommodation/Unit Details</div>
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Project Category</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={A.projectCategory} onChange={e => set("accommodationDetails", "projectCategory", e.target.value)} /></td><td className="border border-black p-1 bg-gray-50 font-medium">Flat Type</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={A.flatType} onChange={e => set("accommodationDetails", "flatType", e.target.value)}><option>Normal</option><option>Duplex</option><option>Not applicable</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Flat Configuration</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={A.flatConfiguration} onChange={e => set("accommodationDetails", "flatConfiguration", e.target.value)} placeholder="NA" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Freehold/Leasehold</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={A.propertyHolding} onChange={e => set("accommodationDetails", "propertyHolding", e.target.value)}><option>Freehold</option><option>Leasehold</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Type of Structure</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={A.typeOfStructure} onChange={e => set("accommodationDetails", "typeOfStructure", e.target.value)} placeholder="TENSHED / NORMAL" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Area of Flat</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={A.areaOfFlat} onChange={e => set("accommodationDetails", "areaOfFlat", e.target.value)} placeholder="16,335 SQFT" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Total No of Floors</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={A.totalNoOfFloors} onChange={e => set("accommodationDetails", "totalNoOfFloors", e.target.value)} placeholder="GF" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Lift Facility</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={A.liftFacility} onChange={e => set("accommodationDetails", "liftFacility", e.target.value)}><option>YES / N</option><option>YES</option><option>N</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Amenities</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={A.amenities} onChange={e => set("accommodationDetails", "amenities", e.target.value)}><option>Average</option><option>Excellent</option><option>Good</option><option>Low</option><option>NA</option></select></td><td className="border border-black p-1 bg-gray-50 font-medium">Marketability</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={A.marketability} onChange={e => set("accommodationDetails", "marketability", e.target.value)}><option>Average</option><option>Excellent</option><option>Good</option><option>Low</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">View of the Property</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={A.viewOfProperty} onChange={e => set("accommodationDetails", "viewOfProperty", e.target.value)} /></td><td className="border border-black p-1 bg-gray-50 font-medium">Parking Facility</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={A.parkingFacility} onChange={e => set("accommodationDetails", "parkingFacility", e.target.value)}><option>YES / N</option><option>YES</option><option>N</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Quality of Construction</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={A.qualityOfConstruction} onChange={e => set("accommodationDetails", "qualityOfConstruction", e.target.value)}><option>Class A</option><option>Class B</option><option>Class C</option><option>Class D</option></select></td><td className="border border-black p-1 bg-gray-50 font-medium">Type of Parking</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={A.typeOfParking} onChange={e => set("accommodationDetails", "typeOfParking", e.target.value)}><option>Open CP</option><option>Dependent CP</option><option>Covered CP</option><option>Mechanical CP</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Shape of the Property</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={A.shapeOfProperty} onChange={e => set("accommodationDetails", "shapeOfProperty", e.target.value)}><option>Regular</option><option>Irregular</option></select></td><td className="border border-black p-1 bg-gray-50 font-medium">Placement of the Property</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={A.placementOfProperty} onChange={e => set("accommodationDetails", "placementOfProperty", e.target.value)} placeholder="NE Facing Corner Plot" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Exteriors of the Property</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={A.exteriorsOfProperty} onChange={e => set("accommodationDetails", "exteriorsOfProperty", e.target.value)}><option>Average</option><option>Poor</option><option>Excellent</option><option>Good</option><option>Low</option></select></td><td className="border border-black p-1 bg-gray-50 font-medium">Interiors of the Property</td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={A.interiorsOfProperty} onChange={e => set("accommodationDetails", "interiorsOfProperty", e.target.value)}><option>Average</option><option>Poor</option><option>Excellent</option><option>Good</option><option>Low</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Age of the Property</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={A.ageOfProperty} onChange={e => set("accommodationDetails", "ageOfProperty", e.target.value)} placeholder="3" /></td><td className="border border-black p-1 bg-gray-50 font-medium">Residual Age</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={A.residualAge} onChange={e => set("accommodationDetails", "residualAge", e.target.value)} placeholder="57" /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Source of age of Property</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={A.sourceOfAge} onChange={e => set("accommodationDetails", "sourceOfAge", e.target.value)} /></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Maintenance of the Property</td><td colSpan="3" className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={A.maintenanceOfProperty} onChange={e => set("accommodationDetails", "maintenanceOfProperty", e.target.value)}><option>Average</option><option>Good</option><option>Excellent</option><option>Poor</option><option>Low</option></select></td></tr>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Cautious Location</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={A.cautiousLocation} onChange={e => set("accommodationDetails", "cautiousLocation", e.target.value)} placeholder="NA" /></td></tr>
                    </tbody>
                </table>

                {/* Document Details Section */}
                <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Document Details</div>
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        {[
                            ["saleDeedDetails", "Sale Deed/allotment Letter Details"],
                            ["sanctionedPlanDetails", "Sanctioned Plan Details"],
                            ["ccOcDetails", "CC/OC Details"],
                            ["agreementToSaleDetails", "Agreement to Sale Details"],
                            ["mutationPossessionDetails", "Mutation/Possession Letter Details"],
                            ["taxReceiptDetails", "Tax Receipt Details"],
                            ["electricityBillDetails", "Electricity Bill Details"],
                            ["conversionDetails", "Conversion Details"],
                        ].map(([key, label]) => (
                            <tr key={key}>
                                <td className="border border-black p-1 bg-gray-50 font-medium">{label}</td>
                                <td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={D[key]} onChange={e => set("documentDetails", key, e.target.value)} placeholder="NA" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Built up area Section */}
                <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Built up area</div>
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                        <tr><th className="border border-black p-1 bg-amber-50 font-medium">Floor</th><th className="border border-black p-1 bg-amber-50 font-medium">As per Site (Sqft)</th><th className="border border-black p-1 bg-amber-50 font-medium">Deviation</th><th className="border border-black p-1 bg-amber-50 font-medium">Dev Remark</th><th className="border border-black p-1 bg-amber-50 font-medium">Remarks</th></tr>
                    </thead>
                    <tbody>
                        <tr><td className="border border-black p-1">Ground Floor</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BU.groundFloorAsPerSite} onChange={e => calcBU("groundFloorAsPerSite", e.target.value)} placeholder="16,335" /></td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={BU.groundFloorDeviation} onChange={e => set("builtUpArea", "groundFloorDeviation", e.target.value)}><option>No</option><option>Yes</option></select></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BU.groundFloorDevRmk} onChange={e => set("builtUpArea", "groundFloorDevRmk", e.target.value)} /></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BU.groundFloorRmk} onChange={e => set("builtUpArea", "groundFloorRmk", e.target.value)} /></td></tr>
                        <tr><td className="border border-black p-1">FIRST FLOOR</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BU.firstFloorAsPerSite} onChange={e => calcBU("firstFloorAsPerSite", e.target.value)} placeholder="0" /></td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={BU.firstFloorDeviation} onChange={e => set("builtUpArea", "firstFloorDeviation", e.target.value)}><option>No</option><option>Yes</option></select></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BU.firstFloorDevRmk} onChange={e => set("builtUpArea", "firstFloorDevRmk", e.target.value)} /></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BU.firstFloorRmk} onChange={e => set("builtUpArea", "firstFloorRmk", e.target.value)} /></td></tr>
                        <tr className="bg-amber-50"><td className="border border-black p-1 font-bold">Total</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs font-bold" value={BU.totalBuiltUp} onChange={e => set("builtUpArea", "totalBuiltUp", e.target.value)} /></td><td className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={BU.totalDeviation} onChange={e => set("builtUpArea", "totalDeviation", e.target.value)}><option>No</option><option>Yes</option></select></td><td colSpan="2" className="border border-black p-1"></td></tr>
                    </tbody>
                </table>

                {/* Detailing / Valuation Section */}
                <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Detailing / Valuation</div>
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                        <tr><th className="border border-black p-1 bg-amber-50 font-medium">Detailing Area</th><th className="border border-black p-1 bg-amber-50 font-medium">Area in Sqft</th><th className="border border-black p-1 bg-amber-50 font-medium">Rate per Sqft (₹)</th><th className="border border-black p-1 bg-amber-50 font-medium">Valuation (₹)</th></tr>
                    </thead>
                    <tbody>
                        <tr><td className="border border-black p-1">Plot Area (in Deed)</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={V.plotAreaInDeed} onChange={e => set("valuationDetails", "plotAreaInDeed", e.target.value)} placeholder="16,335" /></td><td className="border border-black p-1 text-center">0</td><td className="border border-black p-1 text-center">0</td></tr>
                        {[
                            ["plotAreaPhysical", "plotAreaPhysicalRate", "Plot Area (as per physical)", "16,335", "320"],
                            ["carpetAreaPlan", "carpetAreaPlanRate", "Carpet Area (as per plan)", "0", "0"],
                            ["carpetAreaMeasurement", "carpetAreaMeasRate", "Carpet Area (as per measurement)", "0", "0"],
                            ["builtUpAreaNorms", "builtUpAreaNormsRate", "Built Up Area (as per Norms)", "0", "0"],
                            ["builtUpAreaTinShed", "builtUpTinShedRate", "Built Up Area (TIN SHED)", "3664", "700"],
                            ["superBuiltUpArea", "superBuiltUpRate", "Super Built-Up Area", "0", "0"],
                            ["carPark", "carParkRate", "Car Park", "0", "0"],
                            ["amenitiesVal", "amenitiesRate", "Amenities", "0", "0"],
                        ].map(([aKey, rKey, label, aph, rph]) => (
                            <tr key={aKey}>
                                <td className="border border-black p-1">{label}</td>
                                <td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={V[aKey]} onChange={e => calcVal(aKey, e.target.value)} placeholder={aph} /></td>
                                <td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={V[rKey]} onChange={e => calcVal(rKey, e.target.value)} placeholder={rph} /></td>
                                <td className="border border-black p-1 text-right font-semibold">{rowTotal(V[aKey], V[rKey])}</td>
                            </tr>
                        ))}
                        <tr className="bg-amber-50"><td colSpan="3" className="border border-black p-1 font-bold">Total Value (₹)</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs font-bold" value={V.totalValue} onChange={e => set("valuationDetails", "totalValue", e.target.value)} /></td></tr>
                        <tr className="bg-orange-50"><td colSpan="3" className="border border-black p-1 font-bold">Distress Value (80%) (₹)</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs font-bold" value={V.distressValue80} onChange={e => set("valuationDetails", "distressValue80", e.target.value)} /></td></tr>
                        <tr><td colSpan="3" className="border border-black p-1">Insurance Value (₹)</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={V.insuranceValue} onChange={e => set("valuationDetails", "insuranceValue", e.target.value)} /></td></tr>
                        <tr><td colSpan="3" className="border border-black p-1">Government Value (₹)</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={V.governmentValue} onChange={e => set("valuationDetails", "governmentValue", e.target.value)} /></td></tr>
                        <tr><td className="border border-black p-1">Percentage Completion</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={V.percentageCompletion} onChange={e => set("valuationDetails", "percentageCompletion", e.target.value)} placeholder="100%" /></td><td className="border border-black p-1">Percentage Recommendation</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={V.percentageRecommendation} onChange={e => set("valuationDetails", "percentageRecommendation", e.target.value)} placeholder="100%" /></td></tr>
                    </tbody>
                </table>

                {/* Other Details / Setbacks Section */}
                <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Other Details / Setbacks</div>
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                        <tr><th className="border border-black p-1 bg-amber-50 font-medium">Setbacks</th><th className="border border-black p-1 bg-amber-50 font-medium">As per plan/Bye laws</th><th className="border border-black p-1 bg-amber-50 font-medium">Actual at site</th><th className="border border-black p-1 bg-amber-50 font-medium">Deviation</th><th className="border border-black p-1 bg-amber-50 font-medium">Remarks, if any</th></tr>
                    </thead>
                    <tbody>
                        <tr><td className="border border-black p-1">Front</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.frontAsPerPlan} onChange={e => set("setbacks", "frontAsPerPlan", e.target.value)} placeholder="M" /></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.frontActual} onChange={e => set("setbacks", "frontActual", e.target.value)} placeholder="0 Ft" /></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                        <tr><td className="border border-black p-1">Side1(Left)</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.side1AsPerPlan} onChange={e => set("setbacks", "side1AsPerPlan", e.target.value)} placeholder="M" /></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.side1Actual} onChange={e => set("setbacks", "side1Actual", e.target.value)} placeholder="0 Ft" /></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                        <tr><td className="border border-black p-1">Side2(Right)</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.side2AsPerPlan} onChange={e => set("setbacks", "side2AsPerPlan", e.target.value)} placeholder="M" /></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.side2Actual} onChange={e => set("setbacks", "side2Actual", e.target.value)} placeholder="0 Ft" /></td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                        <tr><td className="border border-black p-1">Rear</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.rearAsPerPlan} onChange={e => set("setbacks", "rearAsPerPlan", e.target.value)} placeholder="M" /></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.rearActual} onChange={e => set("setbacks", "rearActual", e.target.value)} placeholder="0 Ft" /></td><td className="border border-black p-1">Usage Deviation</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.usageDeviation} onChange={e => set("setbacks", "usageDeviation", e.target.value)} /></td></tr>
                        <tr className="bg-amber-50"><td colSpan="2" className="border border-black p-1">Total Value</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.totalValue} onChange={e => set("setbacks", "totalValue", e.target.value)} /></td></tr>
                        <tr className="bg-orange-50"><td colSpan="2" className="border border-black p-1">Distress Value (80%)</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.distressValue} onChange={e => set("setbacks", "distressValue", e.target.value)} /></td></tr>
                        <tr><td colSpan="2" className="border border-black p-1">Insurance Value</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.insuranceValue} onChange={e => set("setbacks", "insuranceValue", e.target.value)} /></td></tr>
                        <tr><td colSpan="2" className="border border-black p-1">Government Value</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.governmentValue} onChange={e => set("setbacks", "governmentValue", e.target.value)} /></td></tr>
                        <tr><td colSpan="2" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={S.percentageCompletion} onChange={e => set("setbacks", "percentageCompletion", e.target.value)} placeholder="100%" /></td><td colSpan="3" className="border border-black p-1">Percentage Recommendation &nbsp;<input className="w-20 inline-block text-xs border-none bg-transparent" value={S.percentageRecommendation} onChange={e => set("setbacks", "percentageRecommendation", e.target.value)} placeholder="100%" /></td></tr>
                    </tbody>
                </table>

                {/* Boundary Detailing Section */}
                <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Boundary Detailing</div>
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                        <tr><th className="border border-black p-1 bg-amber-50 font-medium">Detailing</th><th className="border border-black p-1 bg-amber-50 font-medium">North</th><th className="border border-black p-1 bg-amber-50 font-medium">South</th><th className="border border-black p-1 bg-amber-50 font-medium">East</th><th className="border border-black p-1 bg-amber-50 font-medium">West</th></tr>
                    </thead>
                    <tbody>
                        <tr><td className="border border-black p-1">As per docs.</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BD.northAsPerDocs} onChange={e => set("boundaryDetails", "northAsPerDocs", e.target.value)} placeholder="INDUSTRIAL AREA ROAD" /></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BD.southAsPerDocs} onChange={e => set("boundaryDetails", "southAsPerDocs", e.target.value)} placeholder="GOVERNMENT LAND" /></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BD.eastAsPerDocs} onChange={e => set("boundaryDetails", "eastAsPerDocs", e.target.value)} placeholder="PLOT NO. 2" /></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BD.westAsPerDocs} onChange={e => set("boundaryDetails", "westAsPerDocs", e.target.value)} placeholder="PLOT NO. 4" /></td></tr>
                        <tr><td className="border border-black p-1">As per Actual</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BD.northActual} onChange={e => set("boundaryDetails", "northActual", e.target.value)} placeholder="ROAD" /></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BD.southActual} onChange={e => set("boundaryDetails", "southActual", e.target.value)} placeholder="GOVERNMENT LAND" /></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BD.eastActual} onChange={e => set("boundaryDetails", "eastActual", e.target.value)} placeholder="INDUSTRY NO. 02" /></td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={BD.westActual} onChange={e => set("boundaryDetails", "westActual", e.target.value)} placeholder="INDUSTRY PLOT NO. 04" /></td></tr>
                        <tr><td className="border border-black p-1">Boundary Matching</td><td colSpan="4" className="border border-black p-1"><select className="w-full outline-none bg-transparent text-xs" value={BD.boundaryMatching} onChange={e => set("boundaryDetails", "boundaryMatching", e.target.value)}><option>YES</option><option>NO</option></select></td></tr>
                    </tbody>
                </table>

                {/* Remarks Section */}
                <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Remarks</div>
                <RichTextToolbarEditor
                    value={form.remarks || "<div>1. </div>"}
                    onChange={(value) =>
                        setForm((prev) => ({ ...prev, remarks: value }))
                    }
                    minHeight={160}
                />

                {/* Engineer Details */}
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Name of the Engineer visited</td><td className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={E.nameOfEngineerVisited} onChange={e => set("engineerDetails", "nameOfEngineerVisited", e.target.value)} placeholder="ER. BHAGWAT PRAJAPATI" /></td></tr>
                    </tbody>
                </table>

                {/* PHOTOGRAPHS OF PROPERTY - hidden on print */}
                <div className="">
                    <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">PHOTOGRAPHS OF PROPERTY</div>
                    <div className="border border-black p-1">
                        <PhotoGrid
                            label="Subject Property"
                            photos={form.imageUrls}
                            reportId={id}
                            onAdd={addImage}
                            onDelete={deleteImage}
                            onCaptureLocation={(lat, lng) => {
                                setLiveLocation({ lat, lng });
                                set("locationDetails", "latitude", lat);
                                set("locationDetails", "longitude", lng);
                            }}
                        />
                    </div>
                </div>

                {/* Document Upload Section - hidden on print */}
                <div className="print:hidden">
                    <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Document</div>
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

                {/* Live Location Section */}
                <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Live Location (Auto Capture)</div>
                <div className="border border-black p-2 text-center">
                    <div className="mb-1 text-xs">📍 Latitude: <b>{liveLocation.lat}</b> &nbsp;|&nbsp; Longitude: <b>{liveLocation.lng}</b></div>
                    <StaticLocationMap
                        latitude={liveLocation.lat}
                        longitude={liveLocation.lng}
                        title="Aditya live location map"
                        className="mt-1 w-full border border-black"
                        style={{ height: "220px", objectFit: "cover" }}
                    />
                </div>

                {/* Name of Appraiser / Declaration */}
                <div className="bg-amber-50 text-center font-bold text-xs py-1 border-x border-black">Name of Appraiser / Declaration</div>
                <table className="w-full border-collapse border border-black text-[10.5px]">
                    <tbody>
                        <tr><td className="border border-black p-1 bg-gray-50 font-medium">Name of Appraiser</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={E.nameOfAppraiser} onChange={e => set("engineerDetails", "nameOfAppraiser", e.target.value)} /></td></tr>
                        <tr><td colSpan="4" className="border border-black p-1 text-[9.5px] bg-gray-50">Declaration (We hereby declare that)</td></tr>
                        <tr><td className="border border-black p-1 text-[9.5px]">• Report Prepared by – Mr.</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={E.reportPreparedBy} onChange={e => set("engineerDetails", "reportPreparedBy", e.target.value)} placeholder="ER. RITIK RATHORE" /></td></tr>
                        <tr><td className="border border-black p-1 text-[9.5px]">• Report Finalized by – Mr.</td><td colSpan="3" className="border border-black p-1"><input className="w-full outline-none bg-transparent text-xs" value={E.reportFinalizedBy} onChange={e => set("engineerDetails", "reportFinalizedBy", e.target.value)} placeholder="ER. RITIK RATHORE" /></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
