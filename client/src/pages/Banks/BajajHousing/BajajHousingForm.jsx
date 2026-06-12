import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import JSZip from "jszip";
import {
    createBajajHousing,
    fetchBajajHousingById,
    updateBajajHousingDetails,
} from "../../../redux/features/Banks/BajajHousing/BajajHousingThunk";
import { finalUpdate } from "../../../redux/features/case/caseThunks";
import axiosInstance from "../../../config/axios";
import AutoFillForm from "../../AutoFillForm";
import AdvancedAutoFillForm from "../../../components/AdvancedAutoFillForm";
import { createAutoFillAdapter, applyMappedFields } from "../../../utils/Autofilladapter";
import { BAJAJ_HOUSING_MAPPING } from "../../../config/Bankfieldmappings";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getCoordinateSnapshot = (lat, lng) =>
    lat && lng ? { lat: String(lat), lng: String(lng) } : { lat: "--", lng: "--" };

// ─── INITIAL STATE ─────────────────────────────────────────────────────────────
const INIT = {
    applicantDetails: {
        fileNo: "", lanNo: "", applicantName: "", branch: "",
        brqNo: "", dateOfReport: "", loanCategory: "", valuerName: "",
        contactPerson: "", contactNo: "", personMetAtSite: "", propertyOwner: "",
        relationshipMetAtSite: "", personMetAtSiteContact: "", numberOfTenants: "", tenantVintage: "", documentsProvided: "",
    },
    locationDetails: {
        propertyPincode: "", propertyCity: "", propertyState: "",
        addressAsPerSite: "", localityName: "", landmarkNearBy: "",
        distanceFromCityCenter: "", floorNo: "",
        latitude: "", longitude: "", mapView: "satellite", locationCapturedAt: "",
        addressMatching: "", jurisdiction: "", propertyHoldingType: "",
        marketability: "", propertyOccupiedBy: "", typeOfProperty: "",
    },
    boundaryDetails: {
        northBoundary: "", southBoundary: "", eastBoundary: "", westBoundary: "",
        northBoundarySite: "", southBoundarySite: "", eastBoundarySite: "", westBoundarySite: "",
        boundariesMatching: "", approachRoadSize: "", propertyIdentified: "",
    },
    ndmaParameters: {
        natureOfBuilding: "", structureType: "", roofType: "",
        steelGrade: "", concreteGrade: "", typeOfMasonry: "",
        footingType: "", seismicZone: "", floodProneArea: "",
        fireExit: "", sanctionedPlanProvided: "", approvingAuthority: "",
    },
    technicalDetails: {
        constructionQuality: "", liftAvailable: "", noOfLifts: "",
        eastToWestPlan: "", eastToWestDoc: "", eastToWestSite: "",
        northToSouthPlan: "", northToSouthDoc: "", northToSouthSite: "",
        landAreaPlan: "", landAreaDoc: "", landAreaSite: "",
        carpetAreaAsPerDocument: "", actualConstructionSBUA: "",
        riskOfDemolition: "", statusOfProperty: "", percentCompleted: "",
        currentAgeOfProperty: "", residualAge: "",
    },
    accommodationDetails: {
        floors: [],
    },
    valuationDetails: {
        landArea: "", tentativeLandRate: "", depreciation: "",
        landValue: "", governmentValue: "", distressedValue: "",
        valuationMethodology: "", valuationDoneEarlier: "", isPropertyInNegativeArea: "", remarks: "",
    },
    infrastructureDetails: {
        approachRoadToProperty: "", developmentOfSurroundingAreas: "", distanceFromCityCenter: "",
        electricityAvailable: "", electricityDistributor: "", waterSupply: "",
        waterDistributor: "", sewerLineConnected: "", anyDemolitionThreat: "",
        declaration: "", createdBy: "", createdOn: "", location: "",
        approvedBy: "", approvedOn: "", designation: "",
    },
    frontElevationImages: [],
    kitchenImages: [],
    selfieImages: [],
    otherImages: [],
    AttachDocuments: [],
};

// ==================== STYLES - EXACT BAJAJ THEME ====================
const s = {
    app: { minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Segoe UI', Roboto, sans-serif" },
    header: { background: '#0a2540', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
    headerLeft: { display: 'flex', flexDirection: 'column' },
    headerLogo: { fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: 1 },
    headerSub: { fontSize: 11, color: '#8ba3c4', marginTop: 4 },
    headerRight: { textAlign: 'right' },
    headerBrand: { fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 0.5 },
    headerFin: { fontSize: 10, color: '#8ba3c4', marginTop: 2 },
    progressContainer: { background: '#1a3a5c', padding: '12px 28px' },
    progressLabel: { fontSize: 11, color: '#8ba3c4', marginBottom: 6, display: 'flex', justifyContent: 'space-between' },
    progressBar: { background: '#2a4a6e', borderRadius: 4, overflow: 'hidden', height: 6 },
    progressFill: { background: '#00c853', height: 6, borderRadius: 4, transition: 'width 0.3s' },
    stepper: { display: 'flex', background: '#fff', borderBottom: '1px solid #e0e6ed', padding: '0 20px', overflowX: 'auto', gap: 2 },
    step: { display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', cursor: 'pointer', borderBottom: '3px solid transparent', whiteSpace: 'nowrap' },
    stepActive: { borderBottomColor: '#0a2540', color: '#0a2540' },
    stepDone: { color: '#00c853' },
    stepNum: { width: 26, height: 26, borderRadius: '50%', background: '#e8edf3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#6c7a8e' },
    stepNumActive: { background: '#0a2540', color: '#fff' },
    stepNumDone: { background: '#00c853', color: '#fff' },
    stepText: { fontSize: 13, fontWeight: 500 },
    main: { padding: '24px', maxWidth: 1400, margin: '0 auto' },
    card: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 24, overflow: 'hidden' },
    cardHeader: { padding: '16px 24px', borderBottom: '1px solid #eef2f7', fontSize: 16, fontWeight: 600, color: '#0a2540', background: '#fafbfd' },
    cardBody: { padding: '24px' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 },
    field: { display: 'flex', flexDirection: 'column', gap: 6 },
    label: { fontSize: 12, fontWeight: 600, color: '#4a5568', textTransform: 'uppercase', letterSpacing: 0.3 },
    required: { color: '#e53935', marginLeft: 3 },
    input: { border: '1px solid #d0d7de', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' },
    select: { border: '1px solid #d0d7de', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', background: '#fff', width: '100%', cursor: 'pointer' },
    textarea: { border: '1px solid #d0d7de', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', resize: 'vertical', width: '100%', fontFamily: 'inherit' },
    tableWrapper: { overflowX: 'auto', marginTop: 16 },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
    th: { background: '#f8f9fc', padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4a5568', borderBottom: '2px solid #e0e6ed' },
    td: { padding: '10px 16px', borderBottom: '1px solid #eef2f7' },
    uploadSection: { marginTop: 24, borderTop: '1px solid #eef2f7', paddingTop: 20 },
    uploadTitle: { fontSize: 14, fontWeight: 700, color: '#0a2540', marginBottom: 8 },
    uploadNote: { fontSize: 11, color: '#e53935', marginBottom: 16, background: '#fff3e0', padding: '10px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 },
    uploadGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20 },
    uploadBox: { border: '2px dashed #d0d7de', borderRadius: 12, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#fafbfd' },
    uploadBoxHover: { borderColor: '#0a2540', background: '#f0f4f9' },
    uploadIcon: { fontSize: 32, marginBottom: 10 },
    uploadText: { fontSize: 13, fontWeight: 600, color: '#4a5568' },
    uploadHint: { fontSize: 10, color: '#8ba3c4', marginTop: 6 },
    previewContainer: { display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 },
    previewCard: { position: 'relative', width: 100, height: 100, borderRadius: 10, overflow: 'hidden', border: '2px solid #e0e6ed', background: '#f8f9fc' },
    previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
    previewRemove: { position: 'absolute', top: -10, right: -10, background: '#e53935', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' },
    previewName: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 9, padding: '4px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    footer: { background: '#fff', borderTop: '1px solid #e0e6ed', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0, zIndex: 100 },
    btnBack: { background: '#fff', color: '#0a2540', border: '2px solid #0a2540', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
    btnNext: { background: '#0a2540', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
    btnSave: { background: '#6c7a8e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
    btnSubmit: { background: '#00c853', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
    btnFinal: { background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
    btnView: { background: '#1565c0', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
    badge: { background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
    badgeBlue: { background: '#e3f2fd', color: '#1565c0', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
};

// ─── PHOTO GRID ───────────────────────────────
function PhotoGrid({ label, photos, onAdd, onDelete, reportId, imageType, onCaptureLocation }) {
    const ref = useRef();
    const [uploading, setUploading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleFiles = async (e) => {
        let capturedLocation = null;
        if (navigator.geolocation) {
            capturedLocation = await new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) => resolve({
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
                if (imageType) formData.append("imageType", imageType);
                if (capturedLocation?.latitude) formData.append("latitude", capturedLocation.latitude);
                if (capturedLocation?.longitude) formData.append("longitude", capturedLocation.longitude);

                const res = await axiosInstance.post("/bajaj-housing/upload-image", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (res.data?.success) {
                    onAdd({ url: res.data.url, fileId: res.data.fileId, name: file.name });
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
        <div style={{ ...s.uploadBox, ...(isHovered ? s.uploadBoxHover : {}) }}>
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => !uploading && ref.current.click()}
            >
                <div style={s.uploadIcon}>📷</div>
                <div style={s.uploadText}>{uploading ? "Uploading..." : label}</div>
                <div style={s.uploadHint}>Click to upload</div>
            </div>
            <input ref={ref} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleFiles} />
        </div>
    );
}

function ImagePreviewSection({ title, images, onRemove }) {
    if (!images || images.length === 0) return null;
    return (
        <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 8 }}>📸 {title} ({images.length} images)</div>
            <div style={s.previewContainer}>
                {images.map((img, idx) => (
                    <div key={idx} style={s.previewCard}>
                        <img src={img.url || img.preview} alt={title} style={s.previewImg} onClick={() => window.open(img.url, "_blank")} />
                        <button style={s.previewRemove} onClick={(e) => { e.stopPropagation(); onRemove(idx, img.fileId); }}>×</button>
                        <div style={s.previewName}>{img.name?.substring(0, 12) || 'image.jpg'}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── DOCUMENT GRID ────────────────────────────────────────────────────────────
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
                const res = await axiosInstance.post("/bajaj-housing/upload-document", formData, {
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
        <div style={{ marginTop: 24 }}>
            <label style={s.label}>{label}</label>
            <div style={s.tableWrapper}>
                <table style={s.table}>
                    <thead><tr><th style={s.th}>Name</th><th style={s.th}>Type</th><th style={s.th}>Action</th></tr></thead>
                    <tbody>
                        {documents.map((doc, idx) => (
                            <tr key={idx}>
                                <td style={s.td}><a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1565c0' }}>{doc.name || "Document"}</a></td>
                                <td style={s.td}>Document</td>
                                <td style={s.td}>
                                    <button onClick={() => onDelete(idx, doc.fileId)} style={{ color: '#e53935', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ ...s.uploadBox, marginTop: 12, padding: 12 }} onClick={() => !uploading && ref.current.click()}>
                {uploading ? "⏳ Uploading..." : "📎 Choose File"}
            </div>
            <input ref={ref} type="file" multiple style={{ display: 'none' }} onChange={handleFiles} />
        </div>
    );
}

// ─── MAIN FORM COMPONENT ──────────────────────────────────────────────────────
export default function BajajHousingForm() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { id } = useParams();
    const navigate = useNavigate();


    ///////////////////////////////////////
    const [createdDate, setCreatedDate] = useState(null)


    const [form, setForm] = useState(INIT);
    const [liveLocation, setLiveLocation] = useState({ lat: "--", lng: "--" });
    const [saving, setSaving] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [extractedData, setExtractedData] = useState({});

    const isEdit = Boolean(id);
    const canFinalSubmit =
        isEdit && (user?.role === "Admin" || user?.role === "SuperAdmin");

    const handleAutoFill = createAutoFillAdapter(
        BAJAJ_HOUSING_MAPPING,
        (mappedData, rawExtractedData) => {
            setExtractedData(mappedData);
            setForm((prev) => {
                const next = applyMappedFields(prev, mappedData);
                const photoFields = ["frontElevationImages", "kitchenImages", "selfieImages", "otherImages"];
                photoFields.forEach((field) => {
                    if (mappedData[field] && Array.isArray(mappedData[field])) {
                        next[field] = [...(next[field] || []), ...mappedData[field]];
                    }
                });
                return next;
            });
            const latitude = mappedData["locationDetails.latitude"];
            const longitude = mappedData["locationDetails.longitude"];
            if (latitude && longitude) {
                setLiveLocation(getCoordinateSnapshot(latitude, longitude));
            }
            toast.success("AI Data Extracted and Mapped Successfully!");
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
                    locationDetails: { ...prev.locationDetails, latitude: lat, longitude: lng },
                }));
            },
            () => { },
            { enableHighAccuracy: true }
        );
    }, [id]);

    useEffect(() => {
        if (!id) return;
        dispatch(fetchBajajHousingById(id))
            .unwrap()
            .then((data) => {
                const nextForm = {
                    ...INIT,
                    ...data,
                    applicantDetails: {
                        ...INIT.applicantDetails,
                        ...(data.applicantDetails || {}),
                    },
                    locationDetails: {
                        ...INIT.locationDetails,
                        ...(data.locationDetails || {}),
                    },
                    boundaryDetails: {
                        ...INIT.boundaryDetails,
                        ...(data.boundaryDetails || {}),
                    },
                    ndmaParameters: {
                        ...INIT.ndmaParameters,
                        ...(data.ndmaParameters || {}),
                    },
                    technicalDetails: {
                        ...INIT.technicalDetails,
                        ...(data.technicalDetails || {}),
                    },
                    valuationDetails: {
                        ...INIT.valuationDetails,
                        ...(data.valuationDetails || {}),
                    },
                    infrastructureDetails: {
                        ...INIT.infrastructureDetails,
                        ...(data.infrastructureDetails || {}),
                    },
                    frontElevationImages: data.frontElevationImages || [],
                    kitchenImages: data.kitchenImages || [],
                    selfieImages: data.selfieImages || [],
                    otherImages: data.otherImages || [],
                    AttachDocuments: data.AttachDocuments || [],
                    accommodationDetails: {
                        floors: data.accommodationDetails?.floors || [],
                    },
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

    const set = (sec, field, val) =>
        setForm((prev) => ({ ...prev, [sec]: { ...prev[sec], [field]: val } }));

    const addFloor = () =>
        setForm((prev) => ({
            ...prev,
            accommodationDetails: {
                floors: [
                    ...prev.accommodationDetails.floors,
                    { floorNo: "", noOfRooms: "0", noOfKitchen: "0", noOfBathRoom: "0", sanctionUsage: "", actualUsage: "" },
                ],
            },
        }));

    const updateFloor = (index, field, val) =>
        setForm((prev) => {
            const floors = [...prev.accommodationDetails.floors];
            floors[index] = { ...floors[index], [field]: val };
            return { ...prev, accommodationDetails: { floors } };
        });

    const removeFloor = (index) =>
        setForm((prev) => ({
            ...prev,
            accommodationDetails: {
                floors: prev.accommodationDetails.floors.filter((_, i) => i !== index),
            },
        }));

    const addImage = (field, imgObj) =>
        setForm((prev) => ({ ...prev, [field]: [...prev[field], imgObj] }));

    const deleteImage = async (field, index, fileId) => {
        try {
            const img = form[field][index];
            if (img?.fileId && id) {
                await axiosInstance.delete(`/bajaj-housing/delete-file/${id}`, {
                    data: { fileId: img.fileId, type: "image", imageType: field },
                });
            }
            setForm((prev) => ({
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index),
            }));
            toast.success("Image deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete image");
        }
    };

    const addDocument = (docObj) =>
        setForm((prev) => ({ ...prev, AttachDocuments: [...prev.AttachDocuments, docObj] }));

    const deleteDocument = async (index, fileId) => {
        try {
            const doc = form.AttachDocuments[index];
            if (doc?.fileId && id) {
                await axiosInstance.delete(`/bajaj-housing/delete-file/${id}`, {
                    data: { fileId: doc.fileId, type: "document" },
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
        const allImgs = [
            ...form.frontElevationImages,
            ...form.kitchenImages,
            ...form.selfieImages,
            ...form.otherImages,
        ];
        for (let i = 0; i < allImgs.length; i++) {
            try {
                const blob = await (await fetch(allImgs[i].url)).blob();
                const ext = blob.type.split("/")[1] || "jpg";
                zip.file(`image_${i + 1}.${ext}`, blob);
            } catch { }
        }
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "bajaj_housing_images.zip";
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
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "bajaj_housing_documents.zip";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            const sanitizeImgArr = (arr) =>
                arr
                    .map((img) => (typeof img === "string" ? { url: img } : img))
                    .filter((img) => img?.url?.startsWith("http") || img?.url?.startsWith("data:"));

            const payload = {
                ...form,
                frontElevationImages: sanitizeImgArr(form.frontElevationImages),
                kitchenImages: sanitizeImgArr(form.kitchenImages),
                selfieImages: sanitizeImgArr(form.selfieImages),
                otherImages: sanitizeImgArr(form.otherImages),
                AttachDocuments: form.AttachDocuments.filter((d) => d?.url?.startsWith("http") || d?.url?.startsWith("data:")),


                // dynamic field add
                ...(createdDate != null && {
                    createdAt: createdDate
                })

            };

            // createdDate
            if (id) {
                await dispatch(updateBajajHousingDetails({ id, ...payload })).unwrap();
                toast.success("Updated ✅");
                
                if (window.confirm("Form updated successfully! Do you want to Save as PDF now?")) {
                    window.open(`/bank/bajaj-housing/view/${id}`, '_blank');
                }

                if (user?.role === "FieldOfficer") navigate("/field/dashboard");
                else navigate(`/bank/bajaj-housing/view/${id}`);
            } else {
                const res = await dispatch(createBajajHousing(payload)).unwrap();
                toast.success("Created ✅");
                
                if (window.confirm("Form created successfully! Do you want to Save as PDF now?")) {
                    window.open(`/bank/bajaj-housing/view/${res._id}`, '_blank');
                }

                navigate(`/bank/bajaj-housing/view/${res._id}`);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error ❌");
        } finally {
            setSaving(false);
        }
    };

    const handleFinalSubmit = async () => {
        if (!id || !canFinalSubmit) return;

        try {
            setSaving(true);
            const sanitizeImgArr = (arr) =>
                arr
                    .map((img) => (typeof img === "string" ? { url: img } : img))
                    .filter((img) => img?.url?.startsWith("http") || img?.url?.startsWith("data:"));

            const payload = {
                ...form,
                frontElevationImages: sanitizeImgArr(form.frontElevationImages),
                kitchenImages: sanitizeImgArr(form.kitchenImages),
                selfieImages: sanitizeImgArr(form.selfieImages),
                otherImages: sanitizeImgArr(form.otherImages),
                AttachDocuments: form.AttachDocuments.filter((d) => d?.url?.startsWith("http") || d?.url?.startsWith("data:")),
            };

            await dispatch(updateBajajHousingDetails({ id, ...payload })).unwrap();
            await dispatch(
                finalUpdate({ id, bankName: "bajaj-housing", updateData: payload })
            ).unwrap();

            toast.success("Final submitted ✅");
            
            if (window.confirm("Final submit successful! Do you want to Save as PDF now?")) {
                window.open(`/bank/bajaj-housing/view/${id}`, '_blank');
            }

            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error("Finalization failed");
        } finally {
            setSaving(false);
        }
    };

    const nextStep = () => { if (currentStep < 8) setCurrentStep(s => s + 1); };
    const prevStep = () => { if (currentStep > 1) setCurrentStep(s => s - 1); };

    const AD = form.applicantDetails;
    const LD = form.locationDetails;
    const BD = form.boundaryDetails;
    const ND = form.ndmaParameters;
    const TD = form.technicalDetails;
    const VD = form.valuationDetails;
    const ID = form.infrastructureDetails;
    const floors = form.accommodationDetails.floors;

    const STEP_NAMES = ['', 'Applicant Details', 'Location Details', 'Boundaries On Site', 'NDMA Parameters', 'Technical Details', 'Accommodation Details', 'Valuation Details', 'Infrastructure & Docs'];

    return (
        <div style={s.app}>
            <div style={s.header}>
                <div style={s.headerLeft}>
                    <div style={s.headerLogo}>BAJAJ</div>
                    <div style={s.headerSub}>Product of A Ameya Infovision Pvt. Ltd.</div>
                </div>
                <div style={s.headerRight}>
                    <div style={s.headerBrand}>BAJAJ HOUSING FINANCE LIMITED</div>
                    <div style={s.headerFin}>Site Visit Report | {AD.applicantName || 'New Application'}</div>
                </div>
            </div>

            <div style={s.progressContainer}>
                <div style={s.progressLabel}>
                    <span>📊 Progress: {Math.round((currentStep / 8) * 100)}%</span>
                    <span>✅ Step {currentStep} of 8</span>
                </div>
                <div style={s.progressBar}><div style={{ ...s.progressFill, width: `${(currentStep / 8) * 100}%` }}></div></div>
            </div>

            <div style={s.stepper}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <div key={num} onClick={() => setCurrentStep(num)} style={{ ...s.step, ...(currentStep === num ? s.stepActive : {}), ...(num < currentStep ? s.stepDone : {}) }}>
                        <div style={{ ...s.stepNum, ...(currentStep === num ? s.stepNumActive : {}), ...(num < currentStep ? s.stepNumDone : {}) }}>
                            {num < currentStep ? '✓' : num}
                        </div>
                        <span style={s.stepText}>{STEP_NAMES[num]}</span>
                    </div>
                ))}
            </div>

            <div style={{ margin: "20px 24px 0 24px" }}>
                <div style={{ marginBottom: 16 }}>
                    <AutoFillForm setFormData={handleAutoFill} />
                </div>
                <AdvancedAutoFillForm
                    bankName="Bajaj Housing"
                    setFormData={handleAutoFill}
                />
            </div>

            <div style={s.main}>
                {currentStep === 1 && (
                    <div style={s.card}>
                        <div style={s.cardHeader}>📋 Applicant Details</div>
                        <div style={s.cardHeader}>📋<input type="date" onChange={(e) => setCreatedDate(e.target.value)} />
                        </div>


                        <div style={s.cardBody}>
                            <div style={s.grid4}>
                                <div style={s.field}><label style={s.label}>File No.</label><input style={s.input} value={AD.fileNo} onChange={e => set('applicantDetails', 'fileNo', e.target.value)} placeholder="H430HLP1807425" /></div>
                                <div style={s.field}><label style={s.label}>LAN No.</label><input style={s.input} value={AD.lanNo} onChange={e => set('applicantDetails', 'lanNo', e.target.value)} placeholder="CT2606800801" /></div>
                                <div style={s.field}><label style={s.label}>Applicant Name</label><input style={s.input} value={AD.applicantName} onChange={e => set('applicantDetails', 'applicantName', e.target.value)} placeholder="UMESH KUMAR JOGI" /></div>
                                <div style={s.field}><label style={s.label}>Branch</label><input style={s.input} value={AD.branch} onChange={e => set('applicantDetails', 'branch', e.target.value)} placeholder="BHOPAL" /></div>
                            </div>
                            <div style={s.grid4}>
                                <div style={s.field}><label style={s.label}>BRQ No.</label><input style={s.input} value={AD.brqNo} onChange={e => set('applicantDetails', 'brqNo', e.target.value)} placeholder="BRQ-26-13947" /></div>
                                <div style={s.field}><label style={s.label}>Date Of Report</label><input style={s.input} type="date" value={AD.dateOfReport} onChange={e => set('applicantDetails', 'dateOfReport', e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Loan Category</label><input style={s.input} value={AD.loanCategory} onChange={e => set('applicantDetails', 'loanCategory', e.target.value)} placeholder="HLP" /></div>
                                <div style={s.field}><label style={s.label}>Valuer Name</label><input style={s.input} value={AD.valuerName} onChange={e => set('applicantDetails', 'valuerName', e.target.value)} placeholder="UNIQUE ENGINEERING ASSOCIATE" /></div>
                            </div>
                            <div style={s.grid4}>
                                <div style={s.field}><label style={s.label}>Contact Person</label><input style={s.input} value={AD.contactPerson} onChange={e => set('applicantDetails', 'contactPerson', e.target.value)} placeholder="UMESH" /></div>
                                <div style={s.field}><label style={s.label}>Contact No</label><input style={s.input} value={AD.contactNo} onChange={e => set('applicantDetails', 'contactNo', e.target.value)} placeholder="9200716408" /></div>
                                <div style={s.field}><label style={s.label}>Property Owner</label><input style={s.input} value={AD.propertyOwner} onChange={e => set('applicantDetails', 'propertyOwner', e.target.value)} placeholder="UMESH KUMAR JOGI" /></div>
                                <div style={s.field}><label style={s.label}>Person Met at Site <span style={s.required}>*</span></label><input style={s.input} value={AD.personMetAtSite} onChange={e => set('applicantDetails', 'personMetAtSite', e.target.value)} placeholder="SURESH MEHRA" /></div>
                            </div>
                            <div style={s.grid4}>
                                <div style={s.field}>
                                    <label style={s.label}>Relationship Met at Site <span style={s.required}>*</span></label>
                                    <select style={s.select} value={AD.relationshipMetAtSite} onChange={e => set('applicantDetails', 'relationshipMetAtSite', e.target.value)}>
                                        <option value="">-- Select --</option>
                                        <option>SELF</option>
                                        <option>SPOUSE</option>
                                        <option>PARENT</option>
                                        <option>SIBLING</option>
                                        <option>CHILD</option>
                                        <option>TENANT</option>
                                        <option>OTHER</option>
                                    </select>
                                </div>
                                <div style={s.field}><label style={s.label}>Person Met at Site Contact <span style={s.required}>*</span></label><input style={s.input} value={AD.personMetAtSiteContact} onChange={e => set('applicantDetails', 'personMetAtSiteContact', e.target.value)} placeholder="9200716408" /></div>
                                <div style={s.field}><label style={s.label}>Number of Tenants <span style={s.required}>*</span></label><input style={s.input} type="number" value={AD.numberOfTenants} onChange={e => set('applicantDetails', 'numberOfTenants', e.target.value)} placeholder="0" /></div>
                                <div style={s.field}><label style={s.label}>Tenant Vintage (Years) <span style={s.required}>*</span></label><input style={s.input} type="number" value={AD.tenantVintage} onChange={e => set('applicantDetails', 'tenantVintage', e.target.value)} placeholder="0" /></div>
                            </div>
                            <div style={s.grid4}>
                                <div style={s.field}>
                                    <label style={s.label}>Documents Provided <span style={s.required}>*</span></label>
                                    <select style={s.select} value={AD.documentsProvided} onChange={e => set('applicantDetails', 'documentsProvided', e.target.value)}>
                                        <option value="">-- Select --</option>
                                        <option>YES</option>
                                        <option>NO</option>
                                        <option>PARTIALLY</option>
                                    </select>
                                </div>
                            </div>

                            <div style={s.uploadSection}>
                                <div style={s.uploadTitle}>📸 Upload Photographs (Applicant level)</div>
                                <div style={s.uploadGrid}>
                                    <PhotoGrid label="Front Elevation" photos={form.frontElevationImages} imageType="frontElevationImages" reportId={id} onAdd={img => addImage("frontElevationImages", img)} onDelete={(i, fid) => deleteImage("frontElevationImages", i, fid)} onCaptureLocation={(lat, lng) => { setLiveLocation({ lat, lng }); set("locationDetails", "latitude", lat); set("locationDetails", "longitude", lng); }} />
                                    <PhotoGrid label="Kitchen" photos={form.kitchenImages} imageType="kitchenImages" reportId={id} onAdd={img => addImage("kitchenImages", img)} onDelete={(i, fid) => deleteImage("kitchenImages", i, fid)} />
                                    <PhotoGrid label="Selfie at Site" photos={form.selfieImages} imageType="selfieImages" reportId={id} onAdd={img => addImage("selfieImages", img)} onDelete={(i, fid) => deleteImage("selfieImages", i, fid)} />
                                    <PhotoGrid label="Other Images" photos={form.otherImages} imageType="otherImages" reportId={id} onAdd={img => addImage("otherImages", img)} onDelete={(i, fid) => deleteImage("otherImages", i, fid)} />
                                </div>

                                <ImagePreviewSection title="Front Elevation" images={form.frontElevationImages} onRemove={(idx, fid) => deleteImage("frontElevationImages", idx, fid)} />
                                <ImagePreviewSection title="Kitchen" images={form.kitchenImages} onRemove={(idx, fid) => deleteImage("kitchenImages", idx, fid)} />
                                <ImagePreviewSection title="Selfie at Site" images={form.selfieImages} onRemove={(idx, fid) => deleteImage("selfieImages", idx, fid)} />
                                <ImagePreviewSection title="Other Images" images={form.otherImages} onRemove={(idx, fid) => deleteImage("otherImages", idx, fid)} />
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div style={s.card}>
                        <div style={s.cardHeader}>📍 Location Details</div>
                        <div style={s.cardBody}>
                            <div style={s.grid4}>
                                <div style={s.field}><label style={s.label}>Pin Code</label><input style={s.input} value={LD.propertyPincode} onChange={e => set("locationDetails", "propertyPincode", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>City</label><input style={s.input} value={LD.propertyCity} onChange={e => set("locationDetails", "propertyCity", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>State</label><input style={s.input} value={LD.propertyState} onChange={e => set("locationDetails", "propertyState", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Floor No.</label><input style={s.input} value={LD.floorNo} onChange={e => set("locationDetails", "floorNo", e.target.value)} /></div>
                            </div>
                            <div style={{ ...s.field, marginBottom: 20 }}><label style={s.label}>Address as per Site</label><input style={s.input} value={LD.addressAsPerSite} onChange={e => set("locationDetails", "addressAsPerSite", e.target.value)} /></div>
                            <div style={s.grid3}>
                                <div style={s.field}><label style={s.label}>Locality Name</label><input style={s.input} value={LD.localityName} onChange={e => set("locationDetails", "localityName", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Landmark Near By</label><input style={s.input} value={LD.landmarkNearBy} onChange={e => set("locationDetails", "landmarkNearBy", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Distance From City Center (KM)</label><input style={s.input} value={LD.distanceFromCityCenter} onChange={e => set("locationDetails", "distanceFromCityCenter", e.target.value)} /></div>
                            </div>
                            <div style={s.grid3}>
                                <div style={s.field}><label style={s.label}>Address Matching</label><select style={s.select} value={LD.addressMatching} onChange={e => set("locationDetails", "addressMatching", e.target.value)}><option value="">-- Select --</option><option>YES</option><option>NO</option></select></div>
                                <div style={s.field}><label style={s.label}>Latitude</label><input style={s.input} value={LD.latitude} onChange={e => { set("locationDetails", "latitude", e.target.value); setLiveLocation((p) => ({ ...p, lat: e.target.value })); }} /></div>
                                <div style={s.field}><label style={s.label}>Longitude</label><input style={s.input} value={LD.longitude} onChange={e => { set("locationDetails", "longitude", e.target.value); setLiveLocation((p) => ({ ...p, lng: e.target.value })); }} /></div>
                            </div>
                            <div style={s.grid4}>
                                <div style={s.field}><label style={s.label}>Jurisdiction</label><select style={s.select} value={LD.jurisdiction} onChange={e => set("locationDetails", "jurisdiction", e.target.value)}><option value="">-- Select --</option><option>MC</option><option>NON-MC</option></select></div>
                                <div style={s.field}><label style={s.label}>Property Holding Type</label><select style={s.select} value={LD.propertyHoldingType} onChange={e => set("locationDetails", "propertyHoldingType", e.target.value)}><option value="">-- Select --</option><option>FREEHOLD</option><option>LEASEHOLD</option></select></div>
                                <div style={s.field}><label style={s.label}>Marketability</label><select style={s.select} value={LD.marketability} onChange={e => set("locationDetails", "marketability", e.target.value)}><option value="">-- Select --</option><option>GOOD</option><option>AVERAGE</option><option>POOR</option></select></div>
                                <div style={s.field}><label style={s.label}>Property Occupied By</label><select style={s.select} value={LD.propertyOccupiedBy} onChange={e => set("locationDetails", "propertyOccupiedBy", e.target.value)}><option value="">-- Select --</option><option>SELF</option><option>OWNER</option><option>TENANT</option></select></div>
                            </div>
                            <div style={s.field}><label style={s.label}>Type of Property</label><select style={s.select} value={LD.typeOfProperty} onChange={e => set("locationDetails", "typeOfProperty", e.target.value)}><option value="">-- Select --</option><option>RESIDENTIAL</option><option>COMMERCIAL</option><option>OFFICE</option><option>INDUSTRIAL</option></select></div>

                            <div style={{ marginTop: 24, borderTop: '1px solid #eef2f7', paddingTop: 20 }}>
                                <div style={s.uploadTitle}>Live Location (Auto Capture)</div>
                                <div style={{ border: '2px dashed #d0d7de', padding: '16px', borderRadius: '12px', background: '#fafbfd', textAlign: 'center' }}>
                                    <span>📍 Latitude: <b>{liveLocation.lat}</b> &nbsp;|&nbsp; Longitude: <b>{liveLocation.lng}</b></span>
                                    {liveLocation.lat !== "--" && liveLocation.lng !== "--" && (
                                        <div style={{ marginTop: 8 }}>
                                            <a href={`https://www.google.com/maps?q=${liveLocation.lat},${liveLocation.lng}`} target="_blank" rel="noreferrer" style={{ color: '#1565c0', fontWeight: 'bold' }}>
                                                View on Google Maps ↗
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div style={s.card}>
                        <div style={s.cardHeader}>🧭 Boundaries On Site</div>
                        <div style={s.cardBody}>
                            <div style={s.tableWrapper}>
                                <table style={s.table}>
                                    <thead><tr><th style={s.th}>Direction</th><th style={s.th}>As per Legal Documents</th><th style={s.th}>As per Site Visit</th></tr></thead>
                                    <tbody>
                                        {[["North", "northBoundary", "northBoundarySite"], ["South", "southBoundary", "southBoundarySite"], ["East", "eastBoundary", "eastBoundarySite"], ["West", "westBoundary", "westBoundarySite"]].map(([dir, docKey, siteKey]) => (
                                            <tr key={dir}>
                                                <td style={s.td}><strong>{dir}</strong></td>
                                                <td style={s.td}><input style={s.input} value={BD[docKey]} onChange={e => set("boundaryDetails", docKey, e.target.value)} /></td>
                                                <td style={s.td}><input style={s.input} value={BD[siteKey]} onChange={e => set("boundaryDetails", siteKey, e.target.value)} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ ...s.grid2, marginTop: 20 }}>
                                <div style={s.field}><label style={s.label}>Boundaries Matching</label><select style={s.select} value={BD.boundariesMatching} onChange={e => set("boundaryDetails", "boundariesMatching", e.target.value)}><option value="">-- Select --</option><option>YES</option><option>NO</option></select></div>
                                <div style={s.field}><label style={s.label}>Approach Road Size</label><select style={s.select} value={BD.approachRoadSize} onChange={e => set("boundaryDetails", "approachRoadSize", e.target.value)}><option value="">-- Select --</option><option>LESS THAN 10FT</option><option>10-15FT</option><option>MORE THAN 15FT</option></select></div>
                            </div>
                            <div style={s.field}><label style={s.label}>Property Identified</label><select style={s.select} value={BD.propertyIdentified} onChange={e => set("boundaryDetails", "propertyIdentified", e.target.value)}><option value="">-- Select --</option><option>YES</option><option>NO</option></select></div>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div style={s.card}>
                        <div style={s.cardHeader}>🏗️ NDMA Parameters</div>
                        <div style={s.cardBody}>
                            <div style={s.grid3}>
                                {[
                                    ["Nature of Building/Wing", "natureOfBuilding", ["RESIDENTIAL", "COMMERCIAL"]],
                                    ["Structure Type", "structureType", ["RCC", "LOAD BEARING", "STEEL FRAME"]],
                                    ["Roof Type", "roofType", ["FLAT ROOF", "SLOPED ROOF", "SHED"]],
                                    ["Steel Grade", "steelGrade", ["FE 415", "FE 500", "FE 550"]],
                                    ["Concrete Grade", "concreteGrade", ["M15", "M20", "M25", "M30"]],
                                    ["Type of Masonry", "typeOfMasonry", ["BRICK MASONRY", "STONE MASONRY", "HOLLOW BLOCK"]],
                                    ["Footing Type", "footingType", ["INDIVIDUAL FOOTINGS", "RAFT FOUNDATION", "PILE FOUNDATION"]],
                                    ["Seismic Zone", "seismicZone", ["ZONE II", "ZONE III", "ZONE IV", "ZONE V"]],
                                    ["Flood Prone Area", "floodProneArea", ["YES", "NO"]],
                                    ["Fire Exit", "fireExit", ["YES", "NO"]],
                                    ["Sanctioned Plan Provided", "sanctionedPlanProvided", ["YES", "NO"]],
                                    ["Approving Authority", "approvingAuthority", ["MC", "NON-MC", "TOWN PLANNING"]],
                                ].map(([label, key, opts]) => (
                                    <div key={key} style={s.field}>
                                        <label style={s.label}>{label}</label>
                                        <select style={s.select} value={ND[key]} onChange={e => set("ndmaParameters", key, e.target.value)}>
                                            <option value="">-- Select --</option>
                                            {opts.map(o => <option key={o}>{o}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 5 && (
                    <div style={s.card}>
                        <div style={s.cardHeader}>📐 Technical Details / Plot & Construction</div>
                        <div style={s.cardBody}>
                            <div style={s.grid3}>
                                <div style={s.field}><label style={s.label}>Construction Quality</label><select style={s.select} value={TD.constructionQuality} onChange={e => set("technicalDetails", "constructionQuality", e.target.value)}><option value="">-- Select --</option><option>GOOD</option><option>AVERAGE</option><option>POOR</option></select></div>
                                <div style={s.field}><label style={s.label}>Lift Available</label><select style={s.select} value={TD.liftAvailable} onChange={e => set("technicalDetails", "liftAvailable", e.target.value)}><option value="">-- Select --</option><option>YES</option><option>NO</option></select></div>
                                <div style={s.field}><label style={s.label}>No. of Lifts</label><input style={s.input} value={TD.noOfLifts} onChange={e => set("technicalDetails", "noOfLifts", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Risk of Demolition</label><select style={s.select} value={TD.riskOfDemolition} onChange={e => set("technicalDetails", "riskOfDemolition", e.target.value)}><option value="">-- Select --</option><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select></div>
                            </div>

                            <div style={{ marginTop: 24 }}>
                                <label style={s.label}>Dimension Details</label>
                                <div style={s.tableWrapper}>
                                    <table style={s.table}>
                                        <thead><tr><th style={s.th}>Dimension</th><th style={s.th}>As Per Plan</th><th style={s.th}>As Per Documents</th><th style={s.th}>As Per Site Visit</th></tr></thead>
                                        <tbody>
                                            <tr><td style={s.td}>East to West (ft)</td><td style={s.td}><input style={s.input} value={TD.eastToWestPlan} onChange={e => set("technicalDetails", "eastToWestPlan", e.target.value)} /></td><td style={s.td}><input style={s.input} value={TD.eastToWestDoc} onChange={e => set("technicalDetails", "eastToWestDoc", e.target.value)} /></td><td style={s.td}><input style={s.input} value={TD.eastToWestSite} onChange={e => set("technicalDetails", "eastToWestSite", e.target.value)} /></td></tr>
                                            <tr><td style={s.td}>North to South (ft)</td><td style={s.td}><input style={s.input} value={TD.northToSouthPlan} onChange={e => set("technicalDetails", "northToSouthPlan", e.target.value)} /></td><td style={s.td}><input style={s.input} value={TD.northToSouthDoc} onChange={e => set("technicalDetails", "northToSouthDoc", e.target.value)} /></td><td style={s.td}><input style={s.input} value={TD.northToSouthSite} onChange={e => set("technicalDetails", "northToSouthSite", e.target.value)} /></td></tr>
                                            <tr><td style={s.td}>Land Area (Sq.Ft)</td><td style={s.td}><input style={s.input} value={TD.landAreaPlan} onChange={e => set("technicalDetails", "landAreaPlan", e.target.value)} /></td><td style={s.td}><input style={s.input} value={TD.landAreaDoc} onChange={e => set("technicalDetails", "landAreaDoc", e.target.value)} /></td><td style={s.td}><input style={s.input} value={TD.landAreaSite} onChange={e => set("technicalDetails", "landAreaSite", e.target.value)} /></td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div style={{ ...s.grid2, marginTop: 24 }}>
                                <div style={s.field}><label style={s.label}>Carpet Area as per Document (Sq.Ft)</label><input style={s.input} value={TD.carpetAreaAsPerDocument} onChange={e => set("technicalDetails", "carpetAreaAsPerDocument", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Actual Construction SBUA (Sq.Ft)</label><input style={s.input} value={TD.actualConstructionSBUA} onChange={e => set("technicalDetails", "actualConstructionSBUA", e.target.value)} /></div>
                            </div>
                            <div style={{ ...s.grid2, marginTop: 24 }}>
                                <div style={s.field}><label style={s.label}>Status of Property</label><select style={s.select} value={TD.statusOfProperty} onChange={e => set("technicalDetails", "statusOfProperty", e.target.value)}><option value="">-- Select --</option><option>COMPLETE</option><option>UNDER CONSTRUCTION</option></select></div>
                                <div style={s.field}><label style={s.label}>% Completed</label><input style={s.input} value={TD.percentCompleted} onChange={e => set("technicalDetails", "percentCompleted", e.target.value)} /></div>
                            </div>
                            <div style={{ ...s.grid2, marginTop: 24 }}>
                                <div style={s.field}><label style={s.label}>Current Age of Property (Years)</label><input style={s.input} value={TD.currentAgeOfProperty} onChange={e => set("technicalDetails", "currentAgeOfProperty", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Residual Age (Years)</label><input style={s.input} value={TD.residualAge} onChange={e => set("technicalDetails", "residualAge", e.target.value)} /></div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 6 && (
                    <div style={s.card}>
                        <div style={s.cardHeader}>🏨 Accommodation Details</div>
                        <div style={s.cardBody}>
                            <div style={s.tableWrapper}>
                                <table style={s.table}>
                                    <thead>
                                        <tr>
                                            <th style={s.th}>Floor No.</th>
                                            <th style={s.th}>Rooms</th>
                                            <th style={s.th}>Kitchen</th>
                                            <th style={s.th}>Bathroom</th>
                                            <th style={s.th}>Sanction Usage</th>
                                            <th style={s.th}>Actual Usage</th>
                                            <th style={s.th}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {floors.map((floor, idx) => (
                                            <tr key={idx}>
                                                <td style={s.td}><input style={s.input} value={floor.floorNo} onChange={e => updateFloor(idx, "floorNo", e.target.value)} placeholder="GROUND FLOOR" /></td>
                                                <td style={s.td}><input style={s.input} type="number" value={floor.noOfRooms} onChange={e => updateFloor(idx, "noOfRooms", e.target.value)} /></td>
                                                <td style={s.td}><input style={s.input} type="number" value={floor.noOfKitchen} onChange={e => updateFloor(idx, "noOfKitchen", e.target.value)} /></td>
                                                <td style={s.td}><input style={s.input} type="number" value={floor.noOfBathRoom} onChange={e => updateFloor(idx, "noOfBathRoom", e.target.value)} /></td>
                                                <td style={s.td}>
                                                    <select style={s.select} value={floor.sanctionUsage} onChange={e => updateFloor(idx, "sanctionUsage", e.target.value)}>
                                                        <option value="">Select</option>
                                                        <option>RESIDENTIAL</option>
                                                        <option>COMMERCIAL</option>
                                                    </select>
                                                </td>
                                                <td style={s.td}><input style={s.input} value={floor.actualUsage} onChange={e => updateFloor(idx, "actualUsage", e.target.value)} /></td>
                                                <td style={s.td}>
                                                    <button onClick={() => removeFloor(idx)} style={{ color: '#e53935', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button onClick={addFloor} style={{ ...s.btnBack, marginTop: 16 }}>+ Add Floor</button>
                        </div>
                    </div>
                )}

                {currentStep === 7 && (
                    <div style={s.card}>
                        <div style={s.cardHeader}>💰 Valuation Details</div>
                        <div style={s.cardBody}>
                            <div style={s.grid2}>
                                <div style={s.field}><label style={s.label}>Land Area (Sq.Ft)</label><input style={s.input} value={VD.landArea} onChange={e => set("valuationDetails", "landArea", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Tentative Land Rate (₹/Sq.Ft)</label><input style={s.input} value={VD.tentativeLandRate} onChange={e => set("valuationDetails", "tentativeLandRate", e.target.value)} /></div>
                            </div>
                            <div style={s.grid2}>
                                <div style={s.field}><label style={s.label}>Depreciation %</label><input style={s.input} value={VD.depreciation} onChange={e => set("valuationDetails", "depreciation", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Land Value (₹)</label><input style={s.input} value={VD.landValue} onChange={e => set("valuationDetails", "landValue", e.target.value)} /></div>
                            </div>
                            <div style={s.grid2}>
                                <div style={s.field}><label style={s.label}>Government Value (₹)</label><input style={s.input} value={VD.governmentValue} onChange={e => set("valuationDetails", "governmentValue", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Distressed / Force Value (₹)</label><input style={s.input} value={VD.distressedValue} onChange={e => set("valuationDetails", "distressedValue", e.target.value)} /></div>
                            </div>
                            <div style={s.grid2}>
                                <div style={s.field}><label style={s.label}>Valuation Methodology</label><select style={s.select} value={VD.valuationMethodology} onChange={e => set("valuationDetails", "valuationMethodology", e.target.value)}><option value="">-- Select --</option><option>LAND BUILDING</option><option>COMPARATIVE MARKET</option><option>INCOME APPROACH</option></select></div>
                                <div style={s.field}><label style={s.label}>Valuation Done Earlier</label><select style={s.select} value={VD.valuationDoneEarlier} onChange={e => set("valuationDetails", "valuationDoneEarlier", e.target.value)}><option value="">-- Select --</option><option>YES</option><option>NO</option></select></div>
                            </div>
                            <div style={s.grid2}>
                                <div style={s.field}><label style={s.label}>Is Property in Negative Area</label><select style={s.select} value={VD.isPropertyInNegativeArea} onChange={e => set("valuationDetails", "isPropertyInNegativeArea", e.target.value)}><option value="">-- Select --</option><option>YES</option><option>NO</option></select></div>
                                <div style={s.field}><label style={s.label}>Remarks</label><input style={s.input} value={VD.remarks} onChange={e => set("valuationDetails", "remarks", e.target.value)} /></div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 8 && (
                    <div style={s.card}>
                        <div style={s.cardHeader}>🏘️ Infrastructure & Docs</div>
                        <div style={s.cardBody}>
                            <div style={s.grid3}>
                                <div style={s.field}><label style={s.label}>Approach Road to Property</label><select style={s.select} value={ID.approachRoadToProperty} onChange={e => set("infrastructureDetails", "approachRoadToProperty", e.target.value)}><option value="">-- Select --</option><option>Single Lane</option><option>Double Lane</option><option>Mud Road</option></select></div>
                                <div style={s.field}><label style={s.label}>Development of Surrounding Areas</label><select style={s.select} value={ID.developmentOfSurroundingAreas} onChange={e => set("infrastructureDetails", "developmentOfSurroundingAreas", e.target.value)}><option value="">-- Select --</option><option>LOW DENSITY</option><option>MEDIUM DENSITY</option><option>HIGH DENSITY</option></select></div>
                                <div style={s.field}><label style={s.label}>Distance from City Centre</label><input style={s.input} value={ID.distanceFromCityCenter} onChange={e => set("infrastructureDetails", "distanceFromCityCenter", e.target.value)} /></div>
                            </div>
                            <div style={s.grid2}>
                                <div style={s.field}><label style={s.label}>Electricity Available</label><select style={s.select} value={ID.electricityAvailable} onChange={e => set("infrastructureDetails", "electricityAvailable", e.target.value)}><option value="">-- Select --</option><option>AVAILABLE</option><option>NOT AVAILABLE</option></select></div>
                                <div style={s.field}><label style={s.label}>Electricity Distributor</label><input style={s.input} value={ID.electricityDistributor} onChange={e => set("infrastructureDetails", "electricityDistributor", e.target.value)} /></div>
                            </div>
                            <div style={s.grid2}>
                                <div style={s.field}><label style={s.label}>Water Supply</label><select style={s.select} value={ID.waterSupply} onChange={e => set("infrastructureDetails", "waterSupply", e.target.value)}><option value="">-- Select --</option><option>AVAILABLE</option><option>NOT AVAILABLE</option></select></div>
                                <div style={s.field}><label style={s.label}>Water Distributor</label><input style={s.input} value={ID.waterDistributor} onChange={e => set("infrastructureDetails", "waterDistributor", e.target.value)} /></div>
                            </div>
                            <div style={s.grid2}>
                                <div style={s.field}><label style={s.label}>Sewer Line Connected</label><select style={s.select} value={ID.sewerLineConnected} onChange={e => set("infrastructureDetails", "sewerLineConnected", e.target.value)}><option value="">-- Select --</option><option>YES</option><option>NO</option></select></div>
                                <div style={s.field}><label style={s.label}>Any Demolition Threat</label><select style={s.select} value={ID.anyDemolitionThreat} onChange={e => set("infrastructureDetails", "anyDemolitionThreat", e.target.value)}><option value="">-- Select --</option><option>YES</option><option>NO</option></select></div>
                            </div>

                            <div style={{ ...s.field, marginTop: 16 }}>
                                <label style={s.label}>Declaration</label>
                                <textarea style={s.textarea} rows={3} value={ID.declaration} onChange={e => set("infrastructureDetails", "declaration", e.target.value)} placeholder="I hereby declare that the above information is true and correct..." />
                            </div>

                            <div style={{ ...s.grid4, marginTop: 24 }}>
                                <div style={s.field}><label style={s.label}>Created By</label><input style={s.input} value={ID.createdBy} onChange={e => set("infrastructureDetails", "createdBy", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Created On</label><input style={s.input} value={ID.createdOn} onChange={e => set("infrastructureDetails", "createdOn", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Approved By</label><input style={s.input} value={ID.approvedBy} onChange={e => set("infrastructureDetails", "approvedBy", e.target.value)} /></div>
                                <div style={s.field}><label style={s.label}>Approved On</label><input style={s.input} value={ID.approvedOn} onChange={e => set("infrastructureDetails", "approvedOn", e.target.value)} /></div>
                            </div>

                            <FileDocument label="Attached Documents" documents={form.AttachDocuments} reportId={id} onAdd={addDocument} onDelete={deleteDocument} />
                        </div>
                    </div>
                )}
            </div>

            <div style={s.footer}>
                <div>
                    <span style={s.badge}>Remaining: {8 - currentStep} steps</span>
                    <span style={{ ...s.badgeBlue, marginLeft: 8 }}>Vite Dev Server</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button style={s.btnBack} onClick={() => { downloadAllImages(); downloadAllDocuments(); }}>Download Photos/Docs</button>
                    {currentStep > 1 && <button style={s.btnBack} onClick={prevStep}>← Back</button>}
                    {/* <button style={s.btnSave} onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save Draft'}</button> */}
                    {currentStep < 8 ? (
                        <button style={s.btnNext} onClick={nextStep}>Next →</button>
                    ) : (
                        <>
                            <button style={s.btnSubmit} onClick={handleSubmit} disabled={saving}>
                                {saving ? "Saving..." : isEdit ? "Update" : "Submit"}
                            </button>
                            {isEdit && (
                                <button 
                                    style={s.btnView} 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.open(`/bank/bajaj-housing/view/${id}`, '_blank');
                                    }}
                                >
                                    📄 Save as PDF
                                </button>
                            )}
                            {canFinalSubmit && (
                                <button style={s.btnFinal} onClick={handleFinalSubmit} disabled={saving}>
                                    {saving ? "Finalizing..." : "Final Submit"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
