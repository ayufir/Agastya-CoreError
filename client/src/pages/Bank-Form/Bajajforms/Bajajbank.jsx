// import React, { useState, useEffect } from "react";
// import { Card } from "antd";
// import ValuationReportForm from "./Form/ValuationReportForm";
// import NDMAParametersForm from "./Form/NDMAParametersForm";
// import TechnicalDetails from "./Form/TechnicalDetails";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   createValuationReport,
//   updateValuationReport,
//   getValuationReportById,
// } from "../../../redux/features/Banks/bajaj/BajajAsyncThunks";

// import { getCurrentLocation } from "../../../utils/getCurrentLocation";

// const Bajajbank = () => {
//   const [step, setStep] = useState(1);
//   const [collectedData, setCollectedData] = useState({});
//   const [isEdit, setIsEdit] = useState({}); // Static for now (no API)

//   const user = useSelector((state) => state.auth.user);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { id } = useParams();

//   useEffect(() => {
//     if (id) {
//       const editPageHandle = async (id) => {
//         try {
//           const response = await dispatch(getValuationReportById(id)).unwrap();
//           console.log(response, "DSS");

//           setIsEdit(response.data);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
//       };
//       editPageHandle(id);
//     }
//   }, [id]);

//   const handleNext = async (formData) => {
//     const updatedData = { ...collectedData, [`step${step}`]: formData };

//     setCollectedData(updatedData);

//     if (step === 3) {
//       const finalData = {
//         ...updatedData.step1,
//         ...updatedData.step2,
//         ...updatedData.step3,
//       };

//       let location = null;
//       let isReportSubmitted = false;

//       if (user.role === "FieldOfficer") {
//         try {
//           location = await getCurrentLocation();
//           isReportSubmitted = true;
//         } catch (locErr) {
//           console.warn("Location fetch failed:", locErr);
//           // Optionally notify user or just skip location
//         }
//       }

//       const payload = {
//         ...finalData,
//         ...(location && { location }), // Only attach if available
//         isReportSubmitted,
//       };

//       // console.log(finalData, "FInal_DATA");
//       try {
//         if (id) {
//           await dispatch(
//             updateValuationReport({ id, finalData: payload })
//           ).unwrap();
//           user.role === "Admin" ? navigate("/") : navigate("/field/dashboard");
//           toast.success(" submitted successfully");
//         } else {
//           const response = await dispatch(
//             createValuationReport(finalData)
//           ).unwrap();
//           navigate(`/bank/bajaj/${response._id}`);
//           toast.success("Form submitted successfully");
//         }
//       } catch (err) {
//         console.error("dmi-finance form submission failed:", err);
//       }
//     }
//     setStep((prev) => prev + 1);
//   };
//   return (
//     <div className='mb-3 max-w-6xl mt-4 mx-auto'>
//       <Card
//         title={
//           <div className='flex justify-between items-center'>
//             <span className='font-semibold text-lg'>
//               Bajaj Bank Technical Report
//             </span>
//             <span className='text-gray-500'>
//               Step {step <= 3 ? step : 3} of 3
//             </span>
//           </div>
//         }
//         className='shadow-md rounded-2xl'
//       >
//         {step === 1 && <ValuationReportForm onNext={handleNext} />}
//         {step === 2 && <NDMAParametersForm onNext={handleNext} />}
//         {step === 3 && <TechnicalDetails onNext={handleNext} />}

//         {step > 3 && (
//           <div className='text-green-600 font-semibold mt-4'>
//             ✅ All steps completed. Data saved locally.
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default Bajajbank;

// import React, { useState, useEffect } from "react";
// import { Card } from "antd";
// import ValuationReportForm from "./Form/ValuationReportForm";
// import NDMAParametersForm from "./Form/NDMAParametersForm";
// import TechnicalDetails from "./Form/TechnicalDetails";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   createValuationReport,
//   updateValuationReport,
//   getValuationReportById,
// } from "../../../redux/features/Banks/bajaj/BajajAsyncThunks";

// import { getCurrentLocation } from "../../../utils/getCurrentLocation";

// const Bajajbank = () => {
//   const [step, setStep] = useState(1);
//   const [collectedData, setCollectedData] = useState({});
//   const [isEdit, setIsEdit] = useState(null);

//   const user = useSelector((state) => state.auth.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     if (id) {
//       const editPageHandle = async (id) => {
//         try {
//           const response = await dispatch(getValuationReportById(id)).unwrap();
//           setIsEdit(response.data);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
//       };
//       editPageHandle(id);
//     }
//   }, [id, dispatch]);

//   const handleNext = async (formData) => {
//     const updatedData = { ...collectedData, [`step${step}`]: formData };
//     setCollectedData(updatedData);

//     if (step === 3) {
//       const finalData = {
//         ...updatedData.step1,
//         ...updatedData.step2,
//         ...updatedData.step3,
//       };

//       let location = null;

//       // console.log(location)
//       if (user.role === "FieldOfficer") {
//         try {
//           location = await getCurrentLocation();
//           isReportSubmitted = true;
//         } catch (locErr) {
//           console.warn("Location fetch failed:", locErr);
//         }
//       }

//       const payload = {
//         ...finalData,
//         location: location, // locationValue should not be null here
//         isReportSubmitted: true, // true or false based on condition
//       };

//       try {
//         if (id) {
//           await dispatch(updateValuationReport({ id, ...payload })).unwrap();
//           user.role === "Admin" ? navigate("/") : navigate("/field/dashboard");
//           toast.success("Form updated successfully");
//         } else {
//           const response = await dispatch(
//             createValuationReport(finalData)
//           ).unwrap();
//           navigate(`/bank/bajaj/${response._id}`);
//           toast.success("Form submitted successfully");
//         }
//       } catch (err) {
//         console.error("Form submission failed:", err);
//         toast.error("Submission failed. Try again.");
//       }
//     }

//     if (step < 3) {
//       setStep((prev) => prev + 1);
//     }
//   };

//   return (
//     <div className='mb-3 max-w-6xl mt-4 mx-auto'>
//       <Card
//         title={
//           <div className='flex justify-between items-center'>
//             <span className='font-semibold text-lg'>
//               Bajaj Bank Technical Report
//             </span>
//             <span className='text-gray-500'>
//               Step {step <= 3 ? step : 3} of 3
//             </span>
//           </div>
//         }
//         className='shadow-md rounded-2xl'
//       >
//         {step === 1 && (
//           <ValuationReportForm onNext={handleNext} defaultValues={isEdit} />
//         )}
//         {step === 2 && (
//           <NDMAParametersForm onNext={handleNext} defaultValues={isEdit} />
//         )}
//         {step === 3 && (
//           <TechnicalDetails onNext={handleNext} defaultValues={isEdit} />
//         )}

//         {step > 3 && (
//           <div className='text-green-600 font-semibold mt-4'>
//             ✅ All steps completed. Data saved locally.
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default Bajajbank;

















// import React, { useEffect, useState, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// const API = 'http://localhost:5000/api';

// // ==================== STYLES - EXACT BAJAJ THEME ====================
// const s = {
//   app: { minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Segoe UI', Roboto, sans-serif" },

//   // Header - Bajaj Style
//   header: { background: '#0a2540', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
//   headerLeft: { display: 'flex', flexDirection: 'column' },
//   headerLogo: { fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: 1 },
//   headerSub: { fontSize: 11, color: '#8ba3c4', marginTop: 4 },
//   headerRight: { textAlign: 'right' },
//   headerBrand: { fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: 0.5 },
//   headerFin: { fontSize: 10, color: '#8ba3c4', marginTop: 2 },

//   // Progress Bar
//   progressContainer: { background: '#1a3a5c', padding: '12px 28px' },
//   progressLabel: { fontSize: 11, color: '#8ba3c4', marginBottom: 6, display: 'flex', justifyContent: 'space-between' },
//   progressBar: { background: '#2a4a6e', borderRadius: 4, overflow: 'hidden', height: 6 },
//   progressFill: { background: '#00c853', height: 6, borderRadius: 4, transition: 'width 0.3s' },

//   // Stepper - 1 to 8
//   stepper: { display: 'flex', background: '#fff', borderBottom: '1px solid #e0e6ed', padding: '0 20px', overflowX: 'auto', gap: 2 },
//   step: { display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', cursor: 'pointer', borderBottom: '3px solid transparent', whiteSpace: 'nowrap' },
//   stepActive: { borderBottomColor: '#0a2540', color: '#0a2540' },
//   stepDone: { color: '#00c853' },
//   stepNum: { width: 26, height: 26, borderRadius: '50%', background: '#e8edf3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#6c7a8e' },
//   stepNumActive: { background: '#0a2540', color: '#fff' },
//   stepNumDone: { background: '#00c853', color: '#fff' },
//   stepText: { fontSize: 13, fontWeight: 500 },

//   // Main Content
//   main: { padding: '24px', maxWidth: 1400, margin: '0 auto' },

//   // Cards
//   card: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 24, overflow: 'hidden' },
//   cardHeader: { padding: '16px 24px', borderBottom: '1px solid #eef2f7', fontSize: 16, fontWeight: 600, color: '#0a2540', background: '#fafbfd' },
//   cardBody: { padding: '24px' },

//   // Forms
//   grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
//   grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
//   grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 },
//   field: { display: 'flex', flexDirection: 'column', gap: 6 },
//   label: { fontSize: 12, fontWeight: 600, color: '#4a5568', textTransform: 'uppercase', letterSpacing: 0.3 },
//   required: { color: '#e53935', marginLeft: 3 },
//   input: { border: '1px solid #d0d7de', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' },
//   select: { border: '1px solid #d0d7de', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', background: '#fff', width: '100%', cursor: 'pointer' },
//   textarea: { border: '1px solid #d0d7de', borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', resize: 'vertical', width: '100%', fontFamily: 'inherit' },

//   // Tables
//   tableWrapper: { overflowX: 'auto', marginTop: 16 },
//   table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
//   th: { background: '#f8f9fc', padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4a5568', borderBottom: '2px solid #e0e6ed' },
//   td: { padding: '10px 16px', borderBottom: '1px solid #eef2f7' },

//   // ========== IMAGE UPLOAD - EXACT AS SCREENSHOT ==========
//   uploadSection: { marginTop: 24, borderTop: '1px solid #eef2f7', paddingTop: 20 },
//   uploadTitle: { fontSize: 14, fontWeight: 700, color: '#0a2540', marginBottom: 8 },
//   uploadNote: { fontSize: 11, color: '#e53935', marginBottom: 16, background: '#fff3e0', padding: '10px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 },
//   uploadGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20 },
//   uploadBox: { border: '2px dashed #d0d7de', borderRadius: 12, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#fafbfd' },
//   uploadBoxHover: { borderColor: '#0a2540', background: '#f0f4f9' },
//   uploadIcon: { fontSize: 32, marginBottom: 10 },
//   uploadText: { fontSize: 13, fontWeight: 600, color: '#4a5568' },
//   uploadHint: { fontSize: 10, color: '#8ba3c4', marginTop: 6 },

//   // Image Preview Gallery
//   previewContainer: { display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 },
//   previewCard: { position: 'relative', width: 100, height: 100, borderRadius: 10, overflow: 'hidden', border: '2px solid #e0e6ed', background: '#f8f9fc' },
//   previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
//   previewRemove: { position: 'absolute', top: -10, right: -10, background: '#e53935', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' },
//   previewName: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 9, padding: '4px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },

//   // Google Map
//   mapContainer: { height: 380, width: '100%', borderRadius: 12, marginTop: 12, overflow: 'hidden', border: '1px solid #e0e6ed' },
//   searchBox: { marginBottom: 12, padding: '10px 14px', border: '1px solid #d0d7de', borderRadius: 8, width: '100%', fontSize: 14 },
//   mapToolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 8 },
//   mapInfo: { fontSize: 12, color: '#5f6c7b', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
//   locationBtn: { background: '#0a2540', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 13 },
//   locationHint: { fontSize: 11, color: '#8ba3c4' },
//   mapPlaceholder: { height: 260, border: '1px dashed #c8d3df', borderRadius: 12, marginTop: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c7a8e', fontSize: 13, textAlign: 'center', padding: 20 },
//   mapFrame: { position: 'relative', height: '100%', width: '100%', background: '#eef2f7' },
//   mapImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
//   mapMarker: { position: 'absolute', width: 18, height: 18, borderRadius: '50% 50% 50% 0', background: '#e31837', transform: 'translate(-50%, -100%) rotate(-45deg)', boxShadow: '0 2px 8px rgba(0,0,0,0.28)', border: '2px solid #fff' },
//   mapMarkerDot: { position: 'absolute', top: 4, left: 4, width: 6, height: 6, borderRadius: '50%', background: '#fff' },
//   mapCaption: { fontSize: 11, color: '#5f6c7b', marginTop: 8, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },

//   // Footer Buttons
//   footer: { background: '#fff', borderTop: '1px solid #e0e6ed', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0, zIndex: 100 },
//   btnBack: { background: '#fff', color: '#0a2540', border: '2px solid #0a2540', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
//   btnNext: { background: '#0a2540', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
//   btnSave: { background: '#6c7a8e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
//   btnSubmit: { background: '#00c853', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
//   btnView: { background: '#1565c0', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },

//   badge: { background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
//   badgeBlue: { background: '#e3f2fd', color: '#1565c0', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
// };

// // ==================== IMAGE UPLOAD COMPONENT ====================
// function ImageUploadSection({ title, images = [], onUpload, onRemove, maxSizeMB = 10 }) {
//   const fileInputRef = useRef(null);
//   const [isHovered, setIsHovered] = useState(false);

//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files);
//     files.forEach(file => {
//       if (file.size > maxSizeMB * 1024 * 1024) {
//         alert(`❌ ${file.name} exceeds ${maxSizeMB}MB limit`);
//         return;
//       }
//       if (!['image/jpeg', 'image/png'].includes(file.type)) {
//         alert(`❌ ${file.name} must be JPEG or PNG format`);
//         return;
//       }
//       onUpload(file);
//     });
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   return (
//     <div style={s.uploadSection}>
//       <div style={s.uploadTitle}>📸 {title}</div>
//       <div 
//         ref={fileInputRef}
//         style={{ ...s.uploadBox, ...(isHovered ? s.uploadBoxHover : {}) }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         onClick={() => fileInputRef.current?.click()}
//       >
//         <div style={s.uploadIcon}>📁</div>
//         <div style={s.uploadText}>Choose File</div>
//         <div style={s.uploadHint}>JPEG, PNG up to {maxSizeMB}MB</div>
//       </div>
//       <input 
//         type="file" 
//         accept="image/jpeg,image/png" 
//         multiple 
//         onChange={handleFileSelect} 
//         style={{ display: 'none' }} 
//         id={`upload-${title.replace(/\s/g, '')}`}
//       />

//       {/* Image Preview Gallery */}
//       {images.length > 0 && (
//         <div style={s.previewContainer}>
//           {images.map((img, idx) => (
//             <div key={idx} style={s.previewCard}>
//               <img src={img.preview || img.url} alt={`Preview ${idx + 1}`} style={s.previewImg} />
//               <button style={s.previewRemove} onClick={(e) => { e.stopPropagation(); onRemove(idx); }}>×</button>
//               <div style={s.previewName}>{img.name?.substring(0, 15) || 'image.jpg'}</div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// const MAP_TILE_SIZE = 256;
// const MAP_ZOOM = 15;
// const MAP_LAYERS = {
//   satellite: {
//     id: 'satellite',
//     label: 'Satellite',
//     attribution: 'Imagery: Esri World Imagery',
//     getTileUrl: (z, y, x) => `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
//   },
//   street: {
//     id: 'street',
//     label: 'Street',
//     attribution: 'Map data: OpenStreetMap contributors',
//     getTileUrl: (z, y, x) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
//   },
// };

// function parseCoordinate(value) {
//   const parsed = Number.parseFloat(value);
//   return Number.isFinite(parsed) ? parsed : null;
// }

// function getStaticMapData(latValue, lngValue, zoom = MAP_ZOOM, layerId = 'satellite') {
//   const lat = parseCoordinate(latValue);
//   const lng = parseCoordinate(lngValue);

//   if (lat === null || lng === null) return null;

//   const clampedLat = Math.max(Math.min(lat, 85.05112878), -85.05112878);
//   const normalizedLng = ((lng + 180) % 360 + 360) % 360 - 180;
//   const latRad = (clampedLat * Math.PI) / 180;
//   const worldSize = MAP_TILE_SIZE * 2 ** zoom;
//   const worldX = ((normalizedLng + 180) / 360) * worldSize;
//   const worldY =
//     (0.5 - Math.log((1 + Math.sin(latRad)) / (1 - Math.sin(latRad))) / (4 * Math.PI)) * worldSize;
//   const tileX = Math.floor(worldX / MAP_TILE_SIZE);
//   const tileY = Math.floor(worldY / MAP_TILE_SIZE);
//   const layer = MAP_LAYERS[layerId] || MAP_LAYERS.satellite;

//   return {
//     lat: clampedLat,
//     lng: normalizedLng,
//     tileUrl: layer.getTileUrl(zoom, tileY, tileX),
//     markerLeft: `${((worldX - tileX * MAP_TILE_SIZE) / MAP_TILE_SIZE) * 100}%`,
//     markerTop: `${((worldY - tileY * MAP_TILE_SIZE) / MAP_TILE_SIZE) * 100}%`,
//     zoom,
//     layerLabel: layer.label,
//     attribution: layer.attribution,
//   };
// }

// function StaticLocationMapPreview({ lat, lng, layerId = 'satellite', height = 380, timestamp }) {
//   const mapData = getStaticMapData(lat, lng, MAP_ZOOM, layerId);

//   if (!mapData) {
//     return (
//       <div style={{ ...s.mapPlaceholder, height }}>
//         Current location set karne ke baad yahan map preview dikh jayega.
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div style={{ ...s.mapContainer, height }}>
//         <div style={s.mapFrame}>
//           <img src={mapData.tileUrl} alt="Location map preview" style={s.mapImage} />
//           <div style={{ ...s.mapMarker, left: mapData.markerLeft, top: mapData.markerTop }}>
//             <div style={s.mapMarkerDot}></div>
//           </div>
//         </div>
//       </div>
//       <div style={s.mapCaption}>
//         <span>{mapData.lat.toFixed(6)}, {mapData.lng.toFixed(6)}</span>
//         <span>{mapData.layerLabel} view</span>
//         {timestamp ? <span>Captured: {timestamp}</span> : null}
//         <span>{mapData.attribution}</span>
//         <a
//           href={`https://www.openstreetmap.org/?mlat=${mapData.lat}&mlon=${mapData.lng}#map=${mapData.zoom}/${mapData.lat}/${mapData.lng}`}
//           target="_blank"
//           rel="noreferrer"
//           style={{ color: '#1565c0', textDecoration: 'none', fontWeight: 600 }}
//         >
//           Open full map
//         </a>
//       </div>
//     </div>
//   );
// }

// // ==================== LOCATION COMPONENT ====================
// function LocationMap({ lat, lng, mapView = 'satellite', capturedAt, onLocationChange, onAddressChange, onTimestampChange, onMapViewChange }) {
//   const [isLocating, setIsLocating] = useState(false);
//   const [locationError, setLocationError] = useState('');
//   const hasCoordinates = parseCoordinate(lat) !== null && parseCoordinate(lng) !== null;

//   const detectCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       setLocationError('Browser geolocation support available nahi hai.');
//       return;
//     }

//     setIsLocating(true);
//     setLocationError('');

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const nextLat = position.coords.latitude.toFixed(6);
//         const nextLng = position.coords.longitude.toFixed(6);
//         onLocationChange(nextLat, nextLng);
//         if (onTimestampChange) {
//           onTimestampChange(new Date().toLocaleString('en-IN', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//             second: '2-digit',
//             hour12: true,
//           }));
//         }
//         if (onAddressChange) {
//           onAddressChange(`Current device location (${nextLat}, ${nextLng})`);
//         }
//         setIsLocating(false);
//       },
//       (error) => {
//         const message =
//           error.code === 1
//             ? 'Location permission allow karo, tab current location aayegi.'
//             : error.code === 2
//               ? 'Location detect nahi ho paayi. GPS/network check karo.'
//               : 'Location fetch timeout ho gaya. Dobara try karo.';
//         setLocationError(message);
//         setIsLocating(false);
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//     );
//   };

//   return (
//     <div>
//       <div style={s.mapToolbar}>
//         <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//           <button type="button" onClick={detectCurrentLocation} style={s.locationBtn} disabled={isLocating}>
//             {isLocating ? 'Detecting location...' : 'Use Current Location'}
//           </button>
//           <button
//             type="button"
//             onClick={() => onMapViewChange && onMapViewChange('satellite')}
//             style={{
//               ...s.locationBtn,
//               background: mapView === 'satellite' ? '#e31837' : '#fff',
//               color: mapView === 'satellite' ? '#fff' : '#0a2540',
//               border: mapView === 'satellite' ? 'none' : '1px solid #0a2540',
//             }}
//           >
//             Satellite
//           </button>
//           <button
//             type="button"
//             onClick={() => onMapViewChange && onMapViewChange('street')}
//             style={{
//               ...s.locationBtn,
//               background: mapView === 'street' ? '#e31837' : '#fff',
//               color: mapView === 'street' ? '#fff' : '#0a2540',
//               border: mapView === 'street' ? 'none' : '1px solid #0a2540',
//             }}
//           >
//             Street
//           </button>
//         </div>
//         <div style={s.mapInfo}>
//           <span>{hasCoordinates ? `Lat ${lat} , Lng ${lng}` : 'Latitude / Longitude abhi set nahi hai'}</span>
//           {capturedAt ? <span>Timestamp: {capturedAt}</span> : null}
//           <span style={s.locationHint}>Without API key, browser GPS + satellite/street tiles use ho rahe hain.</span>
//         </div>
//       </div>
//       {locationError ? <div style={{ ...s.locationHint, color: '#e53935', marginTop: 8 }}>{locationError}</div> : null}
//       <StaticLocationMapPreview lat={lat} lng={lng} layerId={mapView} timestamp={capturedAt} />
//     </div>
//   );
// }

// // ==================== MAIN FORM COMPONENT ====================
// export default function ValuationForm() {
//   const { id } = useParams();
//   const nav = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState({
//     step1: { frontElevation: [], kitchen: [], selfie: [], otherImages: [] },
//     step2: { kitchenImages: [], otherImages: [] },
//     step3: {}, step4: {}, step5: {}, step6: { floors: [] }, step7: {}, step8: { uploadedDocs: [] }
//   });

//   useEffect(() => {
//     loadFormData();
//   }, [id]);

//   const loadFormData = async () => {
//     try {
//       const res = await fetch(`${API}/reports/${id}`);
//       const data = await res.json();
//       if (data) setFormData(prev => ({ ...prev, ...data }));
//     } catch (err) { console.error('Error loading:', err); }
//   };

//   const updateStep = (step, field, value) => {
//     setFormData(prev => ({ ...prev, [step]: { ...prev[step], [field]: value } }));
//   };

//   const saveDraft = async () => {
//     setSaving(true);
//     try {
//       await fetch(`${API}/reports/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...formData, currentStep })
//       });
//     } catch (err) { console.error('Save error:', err); }
//     setSaving(false);
//   };

//   const nextStep = async () => { await saveDraft(); if (currentStep < 8) setCurrentStep(s => s + 1); };
//   const prevStep = () => { if (currentStep > 1) setCurrentStep(s => s - 1); };
//   const submitForm = async () => {
//     await saveDraft();
//     await fetch(`${API}/reports/${id}/submit`, { method: 'POST' });
//     nav(`/report/${id}`);
//   };

//   // ========== IMAGE UPLOAD HANDLERS ==========
//   const readFileAsDataUrl = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });

//   const handleImageUpload = async (step, field, file) => {
//     try {
//       const dataUrl = await readFileAsDataUrl(file);
//       const currentImages = formData[step]?.[field] || [];
//       updateStep(step, field, [...currentImages, { url: dataUrl, name: file.name }]);
//     } catch (err) {
//       console.error('Image read error:', err);
//       alert('Image upload failed. Please try again.');
//     }
//   };

//   const removeImage = (step, field, index) => {
//     const current = formData[step]?.[field] || [];
//     updateStep(step, field, current.filter((_, i) => i !== index));
//   };

//   // Floor management
//   const addFloor = () => {
//     const floors = [...(formData.step6?.floors || [])];
//     floors.push({ floorName: '', rooms: 0, kitchen: 0, bathroom: 0, sanctionedUsage: '', actualUsage: '' });
//     updateStep('step6', 'floors', floors);
//   };

//   const updateFloor = (index, field, value) => {
//     const floors = [...(formData.step6?.floors || [])];
//     floors[index] = { ...floors[index], [field]: value };
//     updateStep('step6', 'floors', floors);
//   };

//   const removeFloor = (index) => {
//     const floors = (formData.step6?.floors || []).filter((_, i) => i !== index);
//     updateStep('step6', 'floors', floors);
//   };

//   // Data shortcuts
//   const d1 = formData.step1 || { frontElevation: [], kitchen: [], selfie: [], otherImages: [] };
//   const d2 = formData.step2 || { kitchenImages: [], otherImages: [] };
//   const d3 = formData.step3 || {};
//   const d4 = formData.step4 || {};
//   const d5 = formData.step5 || {};
//   const d6 = formData.step6 || { floors: [] };
//   const d7 = formData.step7 || {};
//   const d8 = formData.step8 || { uploadedDocs: [] };

//   const YESNO = ['Yes', 'No'];
//   const STEP_NAMES = ['', 'Applicant Details', 'Location Details', 'Boundaries On Site', 'NDMA Parameters', 'Approved Plan Details', 'Technical Details', 'Valuation', 'Additional checks for Panchayat properties'];

//   return (
//     <div style={s.app}>
//       {/* Header */}
//       <div style={s.header}>
//         <div style={s.headerLeft}>
//           <div style={s.headerLogo}>PROVALUER</div>
//           <div style={s.headerSub}>Product of A Ameya Infovision Pvt. Ltd.</div>
//         </div>
//         <div style={s.headerRight}>
//           <div style={s.headerBrand}>BAJAJ HOUSING FINANCE LIMITED</div>
//           <div style={s.headerFin}>Site Visit Report | {d1.applicantName || 'New Application'}</div>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div style={s.progressContainer}>
//         <div style={s.progressLabel}>
//           <span>📊 Progress: 100%</span>
//           <span>✅ 58 / 58 fields completed</span>
//         </div>
//         <div style={s.progressBar}><div style={{ ...s.progressFill, width: '100%' }}></div></div>
//       </div>

//       {/* Stepper */}
//       <div style={s.stepper}>
//         {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
//           <div key={num} onClick={() => setCurrentStep(num)} style={{ ...s.step, ...(currentStep === num ? s.stepActive : {}), ...(num < currentStep ? s.stepDone : {}) }}>
//             <div style={{ ...s.stepNum, ...(currentStep === num ? s.stepNumActive : {}), ...(num < currentStep ? s.stepNumDone : {}) }}>
//               {num < currentStep ? '✓' : num}
//             </div>
//             <span style={s.stepText}>{STEP_NAMES[num]}</span>
//           </div>
//         ))}
//       </div>

//       {/* Main Content */}
//       <div style={s.main}>

//         {/* ==================== STEP 1 - APPLICANT DETAILS ==================== */}
//         {currentStep === 1 && (
//           <div style={s.card}>
//             <div style={s.cardHeader}>📋 Applicant Details</div>
//             <div style={s.cardBody}>
//               <div style={s.grid4}>
//                 <div style={s.field}><label style={s.label}>LAN</label><input style={s.input} value={d1.lan || ''} onChange={e => updateStep('step1', 'lan', e.target.value)} placeholder="H430HLP1807425" /></div>
//                 <div style={s.field}><label style={s.label}>Collateral</label><input style={s.input} value={d1.collateral || ''} onChange={e => updateStep('step1', 'collateral', e.target.value)} placeholder="CT2606800801" /></div>
//                 <div style={s.field}><label style={s.label}>Customer Name</label><input style={s.input} value={d1.customerName || ''} onChange={e => updateStep('step1', 'customerName', e.target.value)} placeholder="UMESH KUMAR JOGI" /></div>
//                 <div style={s.field}><label style={s.label}>Branch</label><input style={s.input} value={d1.branch || ''} onChange={e => updateStep('step1', 'branch', e.target.value)} placeholder="BHOPAL" /></div>
//               </div>
//               <div style={s.grid4}>
//                 <div style={s.field}><label style={s.label}>Request Code</label><input style={s.input} value={d1.requestCode || ''} onChange={e => updateStep('step1', 'requestCode', e.target.value)} placeholder="BRQ-26-13947" /></div>
//                 <div style={s.field}><label style={s.label}>Date Of Report</label><input style={s.input} type="date" value={d1.dateOfReport || ''} onChange={e => updateStep('step1', 'dateOfReport', e.target.value)} /></div>
//                 <div style={s.field}><label style={s.label}>Type Of Loan</label><input style={s.input} value={d1.loanType || ''} onChange={e => updateStep('step1', 'loanType', e.target.value)} placeholder="HLP" /></div>
//                 <div style={s.field}><label style={s.label}>Product Type</label><input style={s.input} value={d1.productType || ''} onChange={e => updateStep('step1', 'productType', e.target.value)} placeholder="HLP" /></div>
//               </div>
//               <div style={s.grid4}>
//                 <div style={s.field}><label style={s.label}>Contact Name</label><input style={s.input} value={d1.contactName || ''} onChange={e => updateStep('step1', 'contactName', e.target.value)} placeholder="UMESH" /></div>
//                 <div style={s.field}><label style={s.label}>Contact No</label><input style={s.input} value={d1.contactNo || ''} onChange={e => updateStep('step1', 'contactNo', e.target.value)} placeholder="9200716408" /></div>
//                 <div style={s.field}><label style={s.label}>Developer Name</label><input style={s.input} value={d1.developerName || ''} onChange={e => updateStep('step1', 'developerName', e.target.value)} placeholder="MIDAS TOUCH" /></div>
//                 <div style={s.field}><label style={s.label}>Valuer Name</label><input style={s.input} value={d1.valuerName || ''} onChange={e => updateStep('step1', 'valuerName', e.target.value)} placeholder="UNIQUE ENGINEERING ASSOCIATE" /></div>
//               </div>
//               <div style={s.grid4}>
//                 <div style={s.field}><label style={s.label}>Person Met at Site <span style={s.required}>*</span></label><input style={s.input} value={d1.personMet || ''} onChange={e => updateStep('step1', 'personMet', e.target.value)} placeholder="SURESH MEHRA" /></div>
//                 <div style={s.field}><label style={s.label}>Relationship <span style={s.required}>*</span></label><input style={s.input} value={d1.relationshipMet || ''} onChange={e => updateStep('step1', 'relationshipMet', e.target.value)} placeholder="EMPLOYEE" /></div>
//                 <div style={s.field}><label style={s.label}>Person Contact</label><input style={s.input} value={d1.personContact || ''} onChange={e => updateStep('step1', 'personContact', e.target.value)} placeholder="7000511349" /></div>
//                 <div style={s.field}><label style={s.label}>No. of Tenants</label><input style={s.input} type="number" value={d1.numberOfTenants || 0} onChange={e => updateStep('step1', 'numberOfTenants', e.target.value)} /></div>
//               </div>

//               {/* ========== IMAGE UPLOADS - STEP 1 (EXACT AS SCREENSHOT) ========== */}
//               <div style={s.uploadSection}>
//                 <div style={s.uploadTitle}>📸 Upload Required Images</div>
//                 <div style={s.uploadNote}>
//                   ⚠️ Max size limit: 10 MB | JPEG/PNG only | Turn off "High Efficiency" mode
//                 </div>

//                 {/* 4 Upload Boxes - Front Elevation, Kitchen, Selfie, Other */}
//                 <div style={s.uploadGrid}>
//                   <div style={s.uploadBox} onClick={() => document.getElementById('frontElevation').click()}>
//                     <div style={s.uploadIcon}>🏠</div>
//                     <div style={s.uploadText}>Front Elevation</div>
//                     <div style={s.uploadHint}>Click to upload</div>
//                   </div>
//                   <div style={s.uploadBox} onClick={() => document.getElementById('kitchenStep1').click()}>
//                     <div style={s.uploadIcon}>🍳</div>
//                     <div style={s.uploadText}>Kitchen</div>
//                     <div style={s.uploadHint}>Click to upload</div>
//                   </div>
//                   <div style={s.uploadBox} onClick={() => document.getElementById('selfie').click()}>
//                     <div style={s.uploadIcon}>🤳</div>
//                     <div style={s.uploadText}>Selfie</div>
//                     <div style={s.uploadHint}>Click to upload</div>
//                   </div>
//                   <div style={s.uploadBox} onClick={() => document.getElementById('otherStep1').click()}>
//                     <div style={s.uploadIcon}>📷</div>
//                     <div style={s.uploadText}>Other</div>
//                     <div style={s.uploadHint}>Click to upload</div>
//                   </div>
//                 </div>

//                 <input id="frontElevation" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleImageUpload('step1', 'frontElevation', e.target.files[0])} />
//                 <input id="kitchenStep1" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleImageUpload('step1', 'kitchen', e.target.files[0])} />
//                 <input id="selfie" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleImageUpload('step1', 'selfie', e.target.files[0])} />
//                 <input id="otherStep1" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleImageUpload('step1', 'otherImages', e.target.files[0])} />

//                 {/* Preview uploaded images */}
//                 {d1.frontElevation?.length > 0 && <ImagePreviewSection title="Front Elevation" images={d1.frontElevation} onRemove={(idx) => removeImage('step1', 'frontElevation', idx)} />}
//                 {d1.kitchen?.length > 0 && <ImagePreviewSection title="Kitchen" images={d1.kitchen} onRemove={(idx) => removeImage('step1', 'kitchen', idx)} />}
//                 {d1.selfie?.length > 0 && <ImagePreviewSection title="Selfie" images={d1.selfie} onRemove={(idx) => removeImage('step1', 'selfie', idx)} />}
//                 {d1.otherImages?.length > 0 && <ImagePreviewSection title="Other" images={d1.otherImages} onRemove={(idx) => removeImage('step1', 'otherImages', idx)} />}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== STEP 2 - LOCATION DETAILS WITH MAP & IMAGES ==================== */}
//         {currentStep === 2 && (
//           <div style={s.card}>
//             <div style={s.cardHeader}>📍 Location Details</div>
//             <div style={s.cardBody}>
//               <div style={s.grid3}>
//                 <div style={s.field}><label style={s.label}>Pin Code <span style={s.required}>*</span></label><input style={s.input} value={d2.pincode || ''} onChange={e => updateStep('step2', 'pincode', e.target.value)} placeholder="466001" /></div>
//                 <div style={s.field}><label style={s.label}>City <span style={s.required}>*</span></label><input style={s.input} value={d2.city || ''} onChange={e => updateStep('step2', 'city', e.target.value)} placeholder="SEHORE" /></div>
//                 <div style={s.field}><label style={s.label}>State <span style={s.required}>*</span></label><input style={s.input} value={d2.state || ''} onChange={e => updateStep('step2', 'state', e.target.value)} placeholder="MADHYA PRADESH" /></div>
//               </div>
//               <div style={s.grid2}>
//                 <div style={s.field}><label style={s.label}>Address Line 1 <span style={s.required}>*</span></label><input style={s.input} value={d2.addressLine1 || ''} onChange={e => updateStep('step2', 'addressLine1', e.target.value)} placeholder="K.H.NO. 247/1/1/2S AND 250/1/1/2 250/1," /></div>
//                 <div style={s.field}><label style={s.label}>Address Line 2</label><input style={s.input} value={d2.addressLine2 || ''} onChange={e => updateStep('step2', 'addressLine2', e.target.value)} placeholder="GRAM-CHITODIYA HEMA" /></div>
//               </div>
//               <div style={s.grid3}>
//                 <div style={s.field}><label style={s.label}>Area Locality <span style={s.required}>*</span></label><input style={s.input} value={d2.areaLocality || ''} onChange={e => updateStep('step2', 'areaLocality', e.target.value)} placeholder="Others" /></div>
//                 <div style={s.field}><label style={s.label}>Nearest Landmark</label><input style={s.input} value={d2.nearestLandmark || ''} onChange={e => updateStep('step2', 'nearestLandmark', e.target.value)} placeholder="FRONT OF NO.3 SBI BANK" /></div>
//                 <div style={s.field}><label style={s.label}>Distance From City (KM) <span style={s.required}>*</span></label><input style={s.input} type="number" value={d2.distanceFromCity || ''} onChange={e => updateStep('step2', 'distanceFromCity', e.target.value)} placeholder="53" /></div>
//               </div>

//               {/* Google Map */}
//               <LocationMap 
//                 lat={d2.latitude} 
//                 lng={d2.longitude}
//                 mapView={d2.mapView || 'satellite'}
//                 capturedAt={d2.locationCapturedAt || ''}
//                 onLocationChange={(lat, lng) => { updateStep('step2', 'latitude', lat); updateStep('step2', 'longitude', lng); }}
//                 onAddressChange={(addr) => updateStep('step2', 'fullAddress', addr)}
//                 onTimestampChange={(timestamp) => updateStep('step2', 'locationCapturedAt', timestamp)}
//                 onMapViewChange={(view) => updateStep('step2', 'mapView', view)}
//               />

//               <div style={s.grid2}>
//                 <div style={s.field}><label style={s.label}>Latitude</label><input style={s.input} value={d2.latitude || ''} onChange={e => updateStep('step2', 'latitude', e.target.value)} placeholder="23.168351" /></div>
//                 <div style={s.field}><label style={s.label}>Longitude</label><input style={s.input} value={d2.longitude || ''} onChange={e => updateStep('step2', 'longitude', e.target.value)} placeholder="76.999335" /></div>
//               </div>

//               <div style={s.grid3}>
//                 <select style={s.select} value={d2.addressMatching || ''} onChange={e => updateStep('step2', 'addressMatching', e.target.value)}><option value="">Address Matching</option><option>YES</option><option>NO</option></select>
//                 <select style={s.select} value={d2.jurisdiction || ''} onChange={e => updateStep('step2', 'jurisdiction', e.target.value)}><option value="">Jurisdiction</option><option>MC</option><option>NON-MC</option><option>DEVELOPMENT AUTHORITY</option></select>
//                 <select style={s.select} value={d2.propertyHolding || ''} onChange={e => updateStep('step2', 'propertyHolding', e.target.value)}><option value="">Property Holding Type</option><option>FREEHOLD</option><option>LEASEHOLD</option></select>
//               </div>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d2.marketability || ''} onChange={e => updateStep('step2', 'marketability', e.target.value)}><option value="">Marketability</option><option>GOOD</option><option>AVERAGE</option><option>POOR</option></select>
//                 <select style={s.select} value={d2.propertyOccupied || ''} onChange={e => updateStep('step2', 'propertyOccupied', e.target.value)}><option value="">Property Occupied By</option><option>SELF</option><option>OWNER</option><option>TENANT</option></select>
//                 <select style={s.select} value={d2.propertyType || ''} onChange={e => updateStep('step2', 'propertyType', e.target.value)}><option value="">Property Type</option><option>RESIDENTIAL</option><option>COMMERCIAL</option><option>OFFICE</option></select>
//               </div>

//               {/* ========== IMAGE UPLOADS - STEP 2 (Kitchen & Other) ========== */}
//               <div style={s.uploadSection}>
//                 <div style={s.uploadTitle}>📸 Property Photos</div>
//                 <div style={s.uploadGrid}>
//                   <div style={s.uploadBox} onClick={() => document.getElementById('kitchenPhotos').click()}>
//                     <div style={s.uploadIcon}>🍳</div><div style={s.uploadText}>Kitchen</div>
//                   </div>
//                   <div style={s.uploadBox} onClick={() => document.getElementById('otherPhotos').click()}>
//                     <div style={s.uploadIcon}>🏢</div><div style={s.uploadText}>Other</div>
//                   </div>
//                 </div>
//                 <input id="kitchenPhotos" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleImageUpload('step2', 'kitchenImages', e.target.files[0])} />
//                 <input id="otherPhotos" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleImageUpload('step2', 'otherImages', e.target.files[0])} />

//                 {d2.kitchenImages?.length > 0 && <ImagePreviewSection title="Kitchen Photos" images={d2.kitchenImages} onRemove={(idx) => removeImage('step2', 'kitchenImages', idx)} />}
//                 {d2.otherImages?.length > 0 && <ImagePreviewSection title="Other Photos" images={d2.otherImages} onRemove={(idx) => removeImage('step2', 'otherImages', idx)} />}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== STEP 3 - BOUNDARIES ON SITE ==================== */}
//         {currentStep === 3 && (
//           <div style={s.card}>
//             <div style={s.cardHeader}>🧭 Boundaries On Site</div>
//             <div style={s.cardBody}>
//               <div style={s.tableWrapper}>
//                 <table style={s.table}>
//                   <thead><tr><th style={s.th}>Direction</th><th style={s.th}>As per legal documents</th><th style={s.th}>As per site visit</th></tr></thead>
//                   <tbody>
//                     {['East', 'West', 'North', 'South'].map(dir => (
//                       <tr key={dir}>
//                         <td style={s.td}><strong>{dir}</strong></td>
//                         <td style={s.td}><input style={s.input} value={d3[`${dir.toLowerCase()}Legal`] || ''} onChange={e => updateStep('step3', `${dir.toLowerCase()}Legal`, e.target.value)} placeholder={`Land of Anup Singh`} /></td>
//                         <td style={s.td}><input style={s.input} value={d3[`${dir.toLowerCase()}Site`] || ''} onChange={e => updateStep('step3', `${dir.toLowerCase()}Site`, e.target.value)} placeholder={`Under const. building`} /></td>
//                        </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d3.boundaryMatching || ''} onChange={e => updateStep('step3', 'boundaryMatching', e.target.value)}><option value="">Boundary Matching</option><option>YES</option><option>NO</option></select>
//                 <select style={s.select} value={d3.approachRoadSize || ''} onChange={e => updateStep('step3', 'approachRoadSize', e.target.value)}><option value="">Approach Road Size</option><option>LESS THAN 10FT</option><option>10-15FT</option><option>MORE THAN 15FT</option></select>
//                 <select style={s.select} value={d3.approachRoad || ''} onChange={e => updateStep('step3', 'approachRoad', e.target.value)}><option value="">Approach Road To Property</option><option>RCC ROAD</option><option>CONCRETE</option><option>KATCHA ROAD</option></select>
//               </div>
//               <div style={s.field}><label style={s.label}>Remarks for Site Boundaries Match</label><textarea style={s.textarea} rows={2} value={d3.boundaryRemarks || ''} onChange={e => updateStep('step3', 'boundaryRemarks', e.target.value)} placeholder="REF REMARK" /></div>
//             </div>
//           </div>
//         )}

//         {/* ==================== STEP 4 - NDMA PARAMETERS ==================== */}
//         {currentStep === 4 && (
//           <div style={s.card}>
//             <div style={s.cardHeader}>🏗️ NDMA Parameters</div>
//             <div style={s.cardBody}>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d4.natureOfBuilding || ''} onChange={e => updateStep('step4', 'natureOfBuilding', e.target.value)}><option value="">Nature of Building/Wing</option><option>RESIDENTIAL</option><option>COMMERCIAL</option><option>INDUSTRIAL</option></select>
//                 <input style={s.input} placeholder="Plan Aspect Ratio" value={d4.planAspectRatio || ''} onChange={e => updateStep('step4', 'planAspectRatio', e.target.value)} />
//                 <select style={s.select} value={d4.structureType || ''} onChange={e => updateStep('step4', 'structureType', e.target.value)}><option value="">Structure Type</option><option>RCC</option><option>LOAD BEARING</option><option>STEEL FRAME</option></select>
//               </div>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d4.projectedParts || ''} onChange={e => updateStep('step4', 'projectedParts', e.target.value)}><option value="">Projected Parts Available</option><option>YES</option><option>NO</option></select>
//                 <select style={s.select} value={d4.masonryType || ''} onChange={e => updateStep('step4', 'masonryType', e.target.value)}><option value="">Type of Masonry</option><option>BRICK MASONRY</option><option>STONE MASONRY</option></select>
//                 <select style={s.select} value={d4.roofType || ''} onChange={e => updateStep('step4', 'roofType', e.target.value)}><option value="">Roof Type</option><option>FLAT ROOF</option><option>SLOPED ROOF</option><option>RCC SLAB</option></select>
//               </div>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d4.steelGrade || ''} onChange={e => updateStep('step4', 'steelGrade', e.target.value)}><option value="">Steel Grade</option><option>FE 415</option><option>FE 500</option><option>FE 550</option></select>
//                 <select style={s.select} value={d4.concreteGrade || ''} onChange={e => updateStep('step4', 'concreteGrade', e.target.value)}><option value="">Concrete Grade</option><option>M20</option><option>M25 Mild</option><option>M30</option></select>
//                 <select style={s.select} value={d4.footingType || ''} onChange={e => updateStep('step4', 'footingType', e.target.value)}><option value="">Footing Type</option><option>INDIVIDUAL FOOTINGS</option><option>RAFT FOUNDATION</option></select>
//               </div>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d4.seismicZone || ''} onChange={e => updateStep('step4', 'seismicZone', e.target.value)}><option value="">Seismic Zone</option><option>ZONE II</option><option>ZONE III</option><option>ZONE IV</option><option>ZONE V</option></select>
//                 <select style={s.select} value={d4.floodProne || ''} onChange={e => updateStep('step4', 'floodProne', e.target.value)}><option value="">Flood Prone Area</option><option>YES</option><option>NO</option></select>
//                 <select style={s.select} value={d4.fireExit || ''} onChange={e => updateStep('step4', 'fireExit', e.target.value)}><option value="">Fire Exit</option><option>YES</option><option>NO</option></select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== STEP 5 - APPROVED PLAN DETAILS ==================== */}
//         {currentStep === 5 && (
//           <div style={s.card}>
//             <div style={s.cardHeader}>📐 Approved Plan Details</div>
//             <div style={s.cardBody}>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d5.sanctionedPlan || ''} onChange={e => updateStep('step5', 'sanctionedPlan', e.target.value)}><option value="">Sanctioned Plan Provided</option><option>YES</option><option>NO</option></select>
//                 <textarea style={s.textarea} rows={2} placeholder="Layout Plan Details" value={d5.layoutPlan || ''} onChange={e => updateStep('step5', 'layoutPlan', e.target.value)} />
//                 <textarea style={s.textarea} rows={2} placeholder="Construction Plan Details" value={d5.constructionPlan || ''} onChange={e => updateStep('step5', 'constructionPlan', e.target.value)} />
//               </div>
//               <div style={s.grid3}>
//                 <input style={s.input} type="date" placeholder="Date of Sanction" value={d5.dateOfSanction || ''} onChange={e => updateStep('step5', 'dateOfSanction', e.target.value)} />
//                 <input style={s.input} type="date" placeholder="Plan Validity" value={d5.planValidity || ''} onChange={e => updateStep('step5', 'planValidity', e.target.value)} />
//                 <select style={s.select} value={d5.approvingAuthority || ''} onChange={e => updateStep('step5', 'approvingAuthority', e.target.value)}><option value="">Approving Authority</option><option>MC</option><option>NON-MC</option></select>
//               </div>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d5.usageAsPerPlan || ''} onChange={e => updateStep('step5', 'usageAsPerPlan', e.target.value)}><option value="">Property Usages as per plan</option><option>RESIDENTIAL</option><option>COMMERCIAL</option></select>
//                 <select style={s.select} value={d5.usageAsPerSite || ''} onChange={e => updateStep('step5', 'usageAsPerSite', e.target.value)}><option value="">Property Usage as per site visit</option><option>RESIDENTIAL</option><option>COMMERCIAL</option></select>
//                 <input style={s.input} type="number" placeholder="Number of Floor in Building" value={d5.numberOfFloors || ''} onChange={e => updateStep('step5', 'numberOfFloors', e.target.value)} />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== STEP 6 - TECHNICAL DETAILS ==================== */}
//         {currentStep === 6 && (
//           <div style={s.card}>
//             <div style={s.cardHeader}>🔧 Technical Details</div>
//             <div style={s.cardBody}>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d6.constructionQuality || ''} onChange={e => updateStep('step6', 'constructionQuality', e.target.value)}><option value="">Construction Quality</option><option>GOOD</option><option>AVERAGE</option><option>POOR</option></select>
//                 <select style={s.select} value={d6.liftAvailable || ''} onChange={e => updateStep('step6', 'liftAvailable', e.target.value)}><option value="">Lift Available</option><option>YES</option><option>NO</option></select>
//                 <input style={s.input} type="number" placeholder="No of Lifts" value={d6.noOfLifts || ''} onChange={e => updateStep('step6', 'noOfLifts', e.target.value)} />
//               </div>

//               {/* Plot Area Table */}
//               <div style={{ marginTop: 24 }}>
//                 <label style={s.label}>Plot Area Details</label>
//                 <div style={s.tableWrapper}>
//                   <table style={s.table}>
//                     <thead><tr><th style={s.th}>Dimension</th><th style={s.th}>As Per Plan</th><th style={s.th}>As Per Documents</th><th style={s.th}>As Per Site Visit</th></tr></thead>
//                     <tbody>
//                       <tr><td style={s.td}>East to West</td>{['eastWestPlan', 'eastWestDoc', 'eastWestSite'].map(f => <td key={f}><input style={s.input} type="number" value={d6[f] || 0} onChange={e => updateStep('step6', f, e.target.value)} /></td>)}</tr>
//                       <tr><td style={s.td}>North to South</td>{['northSouthPlan', 'northSouthDoc', 'northSouthSite'].map(f => <td key={f}><input style={s.input} type="number" value={d6[f] || 0} onChange={e => updateStep('step6', f, e.target.value)} /></td>)}</tr>
//                       <tr><td style={s.td}>Area Of Land(Sq.Ft)</td>{['areaPlan', 'areaDoc', 'areaSite'].map(f => <td key={f}><input style={s.input} type="number" value={d6[f] || 0} onChange={e => updateStep('step6', f, e.target.value)} /></td>)}</tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Floor Details Table */}
//               <div style={{ marginTop: 24 }}>
//                 <label style={s.label}>Unit Details</label>
//                 <div style={s.tableWrapper}>
//                   <table style={s.table}>
//                     <thead><tr><th style={s.th}>BAU Area Details</th><th style={s.th}>Rooms</th><th style={s.th}>Kitchen</th><th style={s.th}>Bathrooms</th><th style={s.th}>Sanctioned Usages</th><th style={s.th}>Actual Usage</th><th style={s.th}></th></tr></thead>
//                     <tbody>
//                       {(d6.floors || []).map((floor, idx) => (
//                         <tr key={idx}>
//                           <td><input style={s.input} value={floor.floorName || ''} onChange={e => updateFloor(idx, 'floorName', e.target.value)} placeholder="GROUND FLOOR" /></td>
//                           <td><input style={{ width: 70 }} type="number" value={floor.rooms || 0} onChange={e => updateFloor(idx, 'rooms', e.target.value)} /></td>
//                           <td><input style={{ width: 70 }} type="number" value={floor.kitchen || 0} onChange={e => updateFloor(idx, 'kitchen', e.target.value)} /></td>
//                           <td><input style={{ width: 70 }} type="number" value={floor.bathroom || 0} onChange={e => updateFloor(idx, 'bathroom', e.target.value)} /></td>
//                           <td><select style={s.select} value={floor.sanctionedUsage || ''} onChange={e => updateFloor(idx, 'sanctionedUsage', e.target.value)}><option value="">Select</option><option>RESIDENTIAL USES</option><option>COMMERCIAL USES</option></select></td>
//                           <td><input style={s.input} value={floor.actualUsage || ''} onChange={e => updateFloor(idx, 'actualUsage', e.target.value)} placeholder="COMMERCIAL USES" /></td>
//                           <td><button onClick={() => removeFloor(idx)} style={{ color: '#e53935', cursor: 'pointer', background: 'none', border: 'none', fontSize: 18 }}>✕</button></td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <button onClick={addFloor} style={{ ...s.btnBack, marginTop: 12, padding: '6px 16px', fontSize: 12 }}>+ Add Floor</button>
//               </div>

//               <div style={s.grid3}>
//                 <input style={s.input} type="number" placeholder="Carpet Area as Per Document" value={d6.carpetArea || 0} onChange={e => updateStep('step6', 'carpetArea', e.target.value)} />
//                 <input style={s.input} type="number" placeholder="Actual construction (SBUA)" value={d6.actualConstruction || 0} onChange={e => updateStep('step6', 'actualConstruction', e.target.value)} />
//                 <select style={s.select} value={d6.riskOfDemolition || ''} onChange={e => updateStep('step6', 'riskOfDemolition', e.target.value)}><option value="">Risk of Demolition</option><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select>
//               </div>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d6.statusOfProperty || ''} onChange={e => updateStep('step6', 'statusOfProperty', e.target.value)}><option value="">Status Of Property</option><option>COMPLETE</option><option>UNDER CONSTRUCTION</option></select>
//                 <input style={s.input} type="number" placeholder="% Completed" value={d6.percentCompleted || 0} onChange={e => updateStep('step6', 'percentCompleted', e.target.value)} />
//                 <input style={s.input} type="number" placeholder="Current Age" value={d6.currentAge || 0} onChange={e => updateStep('step6', 'currentAge', e.target.value)} />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== STEP 7 - VALUATION ==================== */}
//         {currentStep === 7 && (
//           <div style={s.card}>
//             <div style={s.cardHeader}>💰 Valuation</div>
//             <div style={s.cardBody}>
//               <select style={s.select} value={d7.unitOfMeasurement || ''} onChange={e => updateStep('step7', 'unitOfMeasurement', e.target.value)}><option value="">Unit Of Measurement</option><option>SQ. FT</option><option>BUILT UP</option></select>

//               <div style={s.tableWrapper}>
//                 <table style={s.table}>
//                   <thead><tr><th style={s.th}>Items</th><th style={s.th}>Area Details</th><th style={s.th}>Rate</th><th style={s.th}>Total Value (₹)</th></tr></thead>
//                   <tbody>
//                     <tr><td>Land Area</td><td><input style={s.input} type="number" value={d7.landArea || 0} onChange={e => updateStep('step7', 'landArea', e.target.value)} /></td><td><input style={s.input} type="number" value={d7.landRate || 0} onChange={e => updateStep('step7', 'landRate', e.target.value)} /></td><td><input style={s.input} type="number" value={d7.landValue || 0} onChange={e => updateStep('step7', 'landValue', e.target.value)} /></td></tr>
//                     <tr><td>Construction Area</td><td><input style={s.input} type="number" value={d7.constArea || 0} onChange={e => updateStep('step7', 'constArea', e.target.value)} /></td><td><input style={s.input} type="number" value={d7.constRate || 0} onChange={e => updateStep('step7', 'constRate', e.target.value)} /></td><td><input style={s.input} type="number" value={d7.constValue || 0} onChange={e => updateStep('step7', 'constValue', e.target.value)} /></td></tr>
//                     <tr><td>Depreciation %</td><td colSpan="3"><input style={s.input} type="number" value={d7.depreciation || 0} onChange={e => updateStep('step7', 'depreciation', e.target.value)} /></td></tr>
//                   </tbody>
//                 </table>
//               </div>

//               <div style={s.grid3}>
//                 <input style={s.input} placeholder="Government Value" value={d7.govtValue || 0} onChange={e => updateStep('step7', 'govtValue', e.target.value)} />
//                 <input style={s.input} placeholder="Distressed Value" value={d7.distressedValue || 0} onChange={e => updateStep('step7', 'distressedValue', e.target.value)} />
//                 <select style={s.select} value={d7.isNegativeArea || ''} onChange={e => updateStep('step7', 'isNegativeArea', e.target.value)}><option value="">Is Property in Negative Area</option><option>YES</option><option>NO</option></select>
//               </div>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d7.valuationEarlier || ''} onChange={e => updateStep('step7', 'valuationEarlier', e.target.value)}><option value="">Valuation Done Earlier</option><option>YES</option><option>NO</option></select>
//                 <select style={s.select} value={d7.valuationMethodology || ''} onChange={e => updateStep('step7', 'valuationMethodology', e.target.value)}><option value="">Valuation Methodology</option><option>LAND BUILDING</option><option>COMPARATIVE MARKET</option></select>
//                 <textarea style={s.textarea} rows={2} placeholder="Remarks" value={d7.remarks || ''} onChange={e => updateStep('step7', 'remarks', e.target.value)} />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== STEP 8 - PANCHAYAT CHECKS ==================== */}
//         {currentStep === 8 && (
//           <div style={s.card}>
//             <div style={s.cardHeader}>🏘️ Additional checks for Panchayat properties</div>
//             <div style={s.cardBody}>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d8.approachRoad || ''} onChange={e => updateStep('step8', 'approachRoad', e.target.value)}><option value="">Approach Road to property</option><option>Single Lane</option><option>Double Lane</option></select>
//                 <input style={s.input} type="number" placeholder="Distance from city centre (Kms)" value={d8.distanceFromCity || ''} onChange={e => updateStep('step8', 'distanceFromCity', e.target.value)} />
//                 <select style={s.select} value={d8.electricity || ''} onChange={e => updateStep('step8', 'electricity', e.target.value)}><option value="">Electricity Availability</option><option>AVAILABLE</option><option>NOT AVAILABLE</option></select>
//               </div>
//               <div style={s.grid3}>
//                 <select style={s.select} value={d8.waterSupply || ''} onChange={e => updateStep('step8', 'waterSupply', e.target.value)}><option value="">Water supply</option><option>AVAILABLE</option><option>NOT AVAILABLE</option></select>
//                 <select style={s.select} value={d8.sewerConnected || ''} onChange={e => updateStep('step8', 'sewerConnected', e.target.value)}><option value="">Sewer line connected</option><option>YES</option><option>NO</option></select>
//                 <select style={s.select} value={d8.demolitionThreat || ''} onChange={e => updateStep('step8', 'demolitionThreat', e.target.value)}><option value="">Demolition Threat</option><option>YES</option><option>NO</option></select>
//               </div>
//               <textarea style={s.textarea} rows={4} placeholder="Remarks" value={d8.remarks || ''} onChange={e => updateStep('step8', 'remarks', e.target.value)} />

//               {/* Uploaded Documents Table */}
//               <div style={{ marginTop: 24 }}>
//                 <label style={s.label}>Uploaded Documents and Images</label>
//                 <div style={s.tableWrapper}>
//                   <table style={s.table}>
//                     <thead><tr><th style={s.th}>Name</th><th style={s.th}>Type</th><th style={s.th}>Action</th></tr></thead>
//                     <tbody>
//                       {(d8.uploadedDocs || []).map((doc, idx) => (
//                         <tr key={idx}><td style={s.td}>{doc.name}</td><td style={s.td}>Image</td><td style={s.td}>🖼️</td></tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div style={s.uploadBox} onClick={() => document.getElementById('docUpload').click()} style={{ ...s.uploadBox, marginTop: 12, padding: 12 }}>
//                   📎 Choose File
//                 </div>
//                 <input id="docUpload" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => {
//                   if (e.target.files[0]) {
//                     updateStep('step8', 'uploadedDocs', [...(d8.uploadedDocs || []), { name: e.target.files[0].name }]);
//                   }
//                 }} />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Footer Buttons */}
//       <div style={s.footer}>
//         <div>
//           <span style={s.badge}>Remaining: 0</span>
//           <span style={{ ...s.badgeBlue, marginLeft: 8 }}>Completed: 58</span>
//         </div>
//         <div style={{ display: 'flex', gap: 12 }}>
//           {currentStep > 1 && <button style={s.btnBack} onClick={prevStep}>← Back</button>}
//           <button style={s.btnSave} onClick={saveDraft} disabled={saving}>{saving ? 'Saving...' : 'Save Draft'}</button>
//           {currentStep < 8 ? (
//             <button style={s.btnNext} onClick={nextStep}>Save & Next →</button>
//           ) : (
//             <>
//               <button style={s.btnSubmit} onClick={submitForm}>Submit</button>
//               <button style={s.btnView} onClick={() => nav(`/report/${id}`)}>View Report</button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ==================== IMAGE PREVIEW SECTION COMPONENT ====================
// function ImagePreviewSection({ title, images, onRemove }) {
//   if (!images || images.length === 0) return null;

//   return (
//     <div style={{ marginTop: 16 }}>
//       <div style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 8 }}>📸 {title} ({images.length} images)</div>
//       <div style={s.previewContainer}>
//         {images.map((img, idx) => (
//           <div key={idx} style={s.previewCard}>
//             <img src={img.preview || img.url} alt={img.name || 'Uploaded'} style={s.previewImg} />
//             <button style={s.previewRemove} onClick={() => onRemove(idx)}>×</button>
//             <div style={s.previewName}>{img.name?.substring(0, 12) || 'image.jpg'}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


















import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { finalUpdate } from '../../../redux/features/case/caseThunks';
import toast from 'react-hot-toast';
import AutoFillForm from "../../AutoFillForm";
import { createAutoFillAdapter, applyMappedFields } from "../../../utils/Autofilladapter";
import { BAJAJ_BANK_MAPPING } from "../../../config/Bankfieldmappings";

const API = 'https://banker-backend-8ttk.onrender.com/api';

// ==================== HELPER FUNCTIONS ====================
const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function getImageSource(image) {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || image.preview || '';
}

// ==================== MAP CONSTANTS ====================
const MAP_TILE_SIZE = 256;
const MAP_ZOOM = 15;
const MAP_LAYERS = {
  satellite: {
    id: 'satellite',
    label: 'Satellite',
    attribution: 'Imagery: Esri World Imagery',
    getTileUrl: (z, y, x) => `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
  },
  street: {
    id: 'street',
    label: 'Street',
    attribution: 'Map data: OpenStreetMap contributors',
    getTileUrl: (z, y, x) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
  },
};

function parseCoordinate(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getStaticMapData(latValue, lngValue, zoom = MAP_ZOOM, layerId = 'satellite') {
  const lat = parseCoordinate(latValue);
  const lng = parseCoordinate(lngValue);
  if (lat === null || lng === null) return null;
  const clampedLat = Math.max(Math.min(lat, 85.05112878), -85.05112878);
  const normalizedLng = ((lng + 180) % 360 + 360) % 360 - 180;
  const latRad = (clampedLat * Math.PI) / 180;
  const worldSize = MAP_TILE_SIZE * 2 ** zoom;
  const worldX = ((normalizedLng + 180) / 360) * worldSize;
  const worldY = (0.5 - Math.log((1 + Math.sin(latRad)) / (1 - Math.sin(latRad))) / (4 * Math.PI)) * worldSize;
  const tileX = Math.floor(worldX / MAP_TILE_SIZE);
  const tileY = Math.floor(worldY / MAP_TILE_SIZE);
  const layer = MAP_LAYERS[layerId] || MAP_LAYERS.satellite;
  return {
    lat: clampedLat,
    lng: normalizedLng,
    zoom,
    tileUrl: layer.getTileUrl(zoom, tileY, tileX),
    markerLeft: `${((worldX - tileX * MAP_TILE_SIZE) / MAP_TILE_SIZE) * 100}%`,
    markerTop: `${((worldY - tileY * MAP_TILE_SIZE) / MAP_TILE_SIZE) * 100}%`,
    layerLabel: layer.label,
    attribution: layer.attribution,
  };
}

// ==================== STYLES ====================
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
  mapContainer: { height: 380, width: '100%', borderRadius: 12, marginTop: 12, overflow: 'hidden', border: '1px solid #e0e6ed' },
  mapToolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 8 },
  mapInfo: { fontSize: 12, color: '#5f6c7b', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  locationBtn: { background: '#0a2540', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 13 },
  locationHint: { fontSize: 11, color: '#8ba3c4' },
  mapPlaceholder: { height: 260, border: '1px dashed #c8d3df', borderRadius: 12, marginTop: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c7a8e', fontSize: 13, textAlign: 'center', padding: 20 },
  mapFrame: { position: 'relative', height: '100%', width: '100%', background: '#eef2f7' },
  mapImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  mapMarker: { position: 'absolute', width: 18, height: 18, borderRadius: '50% 50% 50% 0', background: '#e31837', transform: 'translate(-50%, -100%) rotate(-45deg)', boxShadow: '0 2px 8px rgba(0,0,0,0.28)', border: '2px solid #fff' },
  mapMarkerDot: { position: 'absolute', top: 4, left: 4, width: 6, height: 6, borderRadius: '50%', background: '#fff' },
  mapCaption: { fontSize: 11, color: '#5f6c7b', marginTop: 8, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  footer: { background: '#fff', borderTop: '1px solid #e0e6ed', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', bottom: 0, zIndex: 100 },
  btnBack: { background: '#fff', color: '#0a2540', border: '2px solid #0a2540', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
  btnNext: { background: '#0a2540', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
  btnSave: { background: '#6c7a8e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
  btnSubmit: { background: '#00c853', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
  btnView: { background: '#1565c0', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 },
  badge: { background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  badgeBlue: { background: '#e3f2fd', color: '#1565c0', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  imageGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginBottom: 20 },
  reportContainer: { background: '#fff', maxWidth: 1000, margin: '0 auto', padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' },
  reportHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #002d72', paddingBottom: 12, marginBottom: 20 },
  reportTitle: { fontSize: 22, fontWeight: 900, color: '#002d72', letterSpacing: 1 },
  sectionTitle: { background: '#002d72', color: '#fff', padding: '6px 12px', fontSize: 13, fontWeight: 700, marginBottom: 0 },
  reportTable: { width: '100%', borderCollapse: 'collapse', marginBottom: 20 },
  reportTd: { padding: '6px 10px', border: '1px solid #999', fontSize: 12 },
  reportTdLabel: { padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9' },
  toolbar: { background: '#fff', borderBottom: '1px solid #dde', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
};

// ==================== IMAGE PREVIEW COMPONENT ====================
function ImagePreviewSection({ title, images, onRemove }) {
  if (!images || images.length === 0) return null;
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', marginBottom: 8 }}>📸 {title} ({images.length} images)</div>
      <div style={s.previewContainer}>
        {images.map((img, idx) => (
          <div key={idx} style={s.previewCard}>
            <img src={img.preview || img.url} alt={img.name || 'Uploaded'} style={s.previewImg} />
            <button style={s.previewRemove} onClick={() => onRemove(idx)}>×</button>
            <div style={s.previewName}>{img.name?.substring(0, 12) || 'image.jpg'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== LOCATION MAP COMPONENT (FORM) ====================
function LocationMap({ lat, lng, mapView = 'satellite', capturedAt, onLocationChange, onAddressChange, onTimestampChange, onMapViewChange }) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const hasCoordinates = parseCoordinate(lat) !== null && parseCoordinate(lng) !== null;

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Browser geolocation support available nahi hai.');
      return;
    }
    setIsLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLat = position.coords.latitude.toFixed(6);
        const nextLng = position.coords.longitude.toFixed(6);
        onLocationChange(nextLat, nextLng);
        if (onTimestampChange) {
          onTimestampChange(new Date().toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
        }
        if (onAddressChange) onAddressChange(`Current device location (${nextLat}, ${nextLng})`);
        setIsLocating(false);
      },
      (error) => {
        const message = error.code === 1 ? 'Location permission allow karo, tab current location aayegi.' : error.code === 2 ? 'Location detect nahi ho paayi. GPS/network check karo.' : 'Location fetch timeout ho gaya. Dobara try karo.';
        setLocationError(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const mapData = getStaticMapData(lat, lng, MAP_ZOOM, mapView);
  const hasMap = mapData !== null;

  return (
    <div>
      <div style={s.mapToolbar}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" onClick={detectCurrentLocation} style={s.locationBtn} disabled={isLocating}>
            {isLocating ? 'Detecting location...' : 'Use Current Location'}
          </button>
          <button type="button" onClick={() => onMapViewChange && onMapViewChange('satellite')} style={{ ...s.locationBtn, background: mapView === 'satellite' ? '#e31837' : '#fff', color: mapView === 'satellite' ? '#fff' : '#0a2540', border: mapView === 'satellite' ? 'none' : '1px solid #0a2540' }}>Satellite</button>
          <button type="button" onClick={() => onMapViewChange && onMapViewChange('street')} style={{ ...s.locationBtn, background: mapView === 'street' ? '#e31837' : '#fff', color: mapView === 'street' ? '#fff' : '#0a2540', border: mapView === 'street' ? 'none' : '1px solid #0a2540' }}>Street</button>
        </div>
        <div style={s.mapInfo}>
          <span>{hasCoordinates ? `Lat ${lat} , Lng ${lng}` : 'Latitude / Longitude abhi set nahi hai'}</span>
          {capturedAt ? <span>Timestamp: {capturedAt}</span> : null}
          <span style={s.locationHint}>Without API key, browser GPS + satellite/street tiles use ho rahe hain.</span>
        </div>
      </div>
      {locationError ? <div style={{ ...s.locationHint, color: '#e53935', marginTop: 8 }}>{locationError}</div> : null}
      {hasMap ? (
        <div>
          <div style={s.mapContainer}>
            <div style={s.mapFrame}>
              <img src={mapData.tileUrl} alt="Location map preview" style={s.mapImage} />
              <div style={{ ...s.mapMarker, left: mapData.markerLeft, top: mapData.markerTop }}><div style={s.mapMarkerDot}></div></div>
            </div>
          </div>
          <div style={s.mapCaption}>
            <span>{mapData.lat.toFixed(6)}, {mapData.lng.toFixed(6)}</span>
            <span>{mapData.layerLabel} view</span>
            {capturedAt ? <span>Captured: {capturedAt}</span> : null}
            <span>{mapData.attribution}</span>
            <a href={`https://www.openstreetmap.org/?mlat=${mapData.lat}&mlon=${mapData.lng}#map=${mapData.zoom}/${mapData.lat}/${mapData.lng}`} target="_blank" rel="noreferrer" style={{ color: '#1565c0', textDecoration: 'none', fontWeight: 600 }}>Open full map</a>
          </div>
        </div>
      ) : (
        <div style={s.mapPlaceholder}>📍 Current location set karne ke baad yahan map preview dikh jayega.</div>
      )}
    </div>
  );
}

// ==================== REPORT MAP COMPONENT ====================
function ReportLocationMap({ lat, lng, mapView = 'satellite', timestamp }) {
  const mapData = getStaticMapData(lat, lng, MAP_ZOOM, mapView);
  if (!mapData) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={s.sectionTitle}>Current Location Map</div>
      <div style={{ border: '1px solid #cfd8e3', borderRadius: 8, padding: 10, background: '#fafbfd', marginTop: 12 }}>
        <div style={{ position: 'relative', height: 260, overflow: 'hidden', borderRadius: 6, background: '#eef2f7' }}>
          <img src={mapData.tileUrl} alt="Current property location map" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', left: mapData.markerLeft, top: mapData.markerTop, width: 18, height: 18, borderRadius: '50% 50% 50% 0', background: '#e31837', transform: 'translate(-50%, -100%) rotate(-45deg)', boxShadow: '0 2px 8px rgba(0,0,0,0.28)', border: '2px solid #fff' }}><div style={{ position: 'absolute', top: 4, left: 4, width: 6, height: 6, borderRadius: '50%', background: '#fff' }}></div></div>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: '#5f6c7b', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span>{mapData.lat.toFixed(6)}, {mapData.lng.toFixed(6)}</span>
          <span>{mapData.layerLabel} view</span>
          {timestamp ? <span>Captured: {timestamp}</span> : null}
          <span>{mapData.attribution}</span>
          <a href={`https://www.openstreetmap.org/?mlat=${mapData.lat}&mlon=${mapData.lng}#map=${mapData.zoom}/${mapData.lat}/${mapData.lng}`} target="_blank" rel="noreferrer" style={{ color: '#1565c0', textDecoration: 'none', fontWeight: 600 }}>Open full map</a>
        </div>
      </div>
    </div>
  );
}

// ==================== REPORT IMAGE GALLERY ====================
function ReportImageGallery({ title, images = [] }) {
  const validImages = images.filter((img) => !!getImageSource(img));
  if (!validImages.length) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={s.sectionTitle}>{title}</div>
      <div style={s.imageGrid}>
        {validImages.map((img, index) => (
          <div key={`${title}-${index}`} style={{ border: '1px solid #cfd8e3', borderRadius: 8, padding: 10, background: '#fafbfd' }}>
            <img src={getImageSource(img)} alt={img.name || `${title} ${index + 1}`} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 6, display: 'block', background: '#eef2f7' }} />
            <div style={{ marginTop: 8, fontSize: 11, color: '#5f6c7b', wordBreak: 'break-word' }}>{img.name || `${title} ${index + 1}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== VALUATION FORM COMPONENT ====================
function ValuationForm({ id, onSave, onSubmit }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [extractedData, setExtractedData] = useState({});
  const [formData, setFormData] = useState({
    step1: { frontElevation: [], kitchen: [], selfie: [], otherImages: [] },
    step2: { kitchenImages: [], otherImages: [] },
    step3: {}, step4: {}, step5: {}, step6: { floors: [] }, step7: {}, step8: { uploadedDocs: [] }
  });

  const handleAutoFill = createAutoFillAdapter(
    BAJAJ_BANK_MAPPING,
    (mappedData, rawExtractedData) => {
      setExtractedData(mappedData);
      setFormData((prev) => {
        return applyMappedFields(prev, mappedData);
      });
      toast.success("AI Data Extracted and Mapped Successfully!");
    }
  );

  useEffect(() => {
    if (id) {
      fetch(`${API}/reports/${id}`).then(r => r.json()).then(data => { if (data) setFormData(prev => ({ ...prev, ...data })); }).catch(console.error);
    }
  }, [id]);

  const updateStep = (step, field, value) => setFormData(prev => ({ ...prev, [step]: { ...prev[step], [field]: value } }));

  const saveDraft = async () => {
    setSaving(true);
    try {
      await fetch(`${API}/reports/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, currentStep }) });
      if (onSave) onSave();
    } catch (err) { console.error('Save error:', err); }
    setSaving(false);
  };

  const nextStep = async () => { await saveDraft(); if (currentStep < 8) setCurrentStep(s => s + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(s => s - 1); };
  const submitForm = async () => { await saveDraft(); if (onSubmit) onSubmit(); };

  const lastUpdate = async () => {
    await saveDraft();
    try {
      await dispatch(
        finalUpdate({ id, bankName: "bajaj", updateData: formData })
      ).unwrap();
      toast.success("Case submitted finally!");
      if (onSubmit) onSubmit();
    } catch (err) {
      console.error("Final submission failed", err);
      toast.error("Final submission failed");
    }
  };

  const handleImageUpload = async (step, field, file) => {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const currentImages = formData[step]?.[field] || [];
      updateStep(step, field, [...currentImages, { url: dataUrl, name: file.name }]);
    } catch (err) { alert('Image upload failed. Please try again.'); }
  };

  const removeImage = (step, field, index) => {
    const current = formData[step]?.[field] || [];
    updateStep(step, field, current.filter((_, i) => i !== index));
  };

  const addFloor = () => {
    const floors = [...(formData.step6?.floors || [])];
    floors.push({ floorName: '', rooms: 0, kitchen: 0, bathroom: 0, sanctionedUsage: '', actualUsage: '' });
    updateStep('step6', 'floors', floors);
  };

  const updateFloor = (index, field, value) => {
    const floors = [...(formData.step6?.floors || [])];
    floors[index] = { ...floors[index], [field]: value };
    updateStep('step6', 'floors', floors);
  };

  const removeFloor = (index) => {
    const floors = (formData.step6?.floors || []).filter((_, i) => i !== index);
    updateStep('step6', 'floors', floors);
  };

  const d1 = formData.step1 || { frontElevation: [], kitchen: [], selfie: [], otherImages: [] };
  const d2 = formData.step2 || { kitchenImages: [], otherImages: [] };
  const d3 = formData.step3 || {};
  const d4 = formData.step4 || {};
  const d5 = formData.step5 || {};
  const d6 = formData.step6 || { floors: [] };
  const d7 = formData.step7 || {};
  const d8 = formData.step8 || { uploadedDocs: [] };
  const STEP_NAMES = ['', 'Applicant Details', 'Location Details', 'Boundaries On Site', 'NDMA Parameters', 'Approved Plan Details', 'Technical Details', 'Valuation', 'Additional checks'];

  return (
    <div>
      <div style={s.progressContainer}>
        <div style={s.progressLabel}><span>📊 Progress: 100%</span><span>✅ All fields completed</span></div>
        <div style={s.progressBar}><div style={{ ...s.progressFill, width: '100%' }}></div></div>
      </div>
      <div style={s.stepper}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
          <div key={num} onClick={() => setCurrentStep(num)} style={{ ...s.step, ...(currentStep === num ? s.stepActive : {}), ...(num < currentStep ? s.stepDone : {}) }}>
            <div style={{ ...s.stepNum, ...(currentStep === num ? s.stepNumActive : {}), ...(num < currentStep ? s.stepNumDone : {}) }}>{num < currentStep ? '✓' : num}</div>
            <span style={s.stepText}>{STEP_NAMES[num]}</span>
          </div>
        ))}
      </div>
      
      <div style={{ margin: "20px 20px 0 20px" }}>
        <AutoFillForm setFormData={handleAutoFill} />
      </div>

      <div style={s.main}>
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div style={s.card}>
            <div style={s.cardHeader}>📋 Applicant Details</div>
            <div style={s.cardBody}>
              <div style={s.grid4}>
                <div style={s.field}><label style={s.label}>File No.</label><input style={s.input} value={d1.fileNo || ''} onChange={e => updateStep('step1', 'fileNo', e.target.value)} placeholder="H430HLP1807425" /></div>
                <div style={s.field}><label style={s.label}>LAN No.</label><input style={s.input} value={d1.lanNo || ''} onChange={e => updateStep('step1', 'lanNo', e.target.value)} placeholder="CT2606800801" /></div>
                <div style={s.field}><label style={s.label}>Applicant Name</label><input style={s.input} value={d1.applicantName || ''} onChange={e => updateStep('step1', 'applicantName', e.target.value)} placeholder="UMESH KUMAR JOGI" /></div>
                <div style={s.field}><label style={s.label}>Branch</label><input style={s.input} value={d1.branch || ''} onChange={e => updateStep('step1', 'branch', e.target.value)} placeholder="BHOPAL" /></div>
              </div>
              <div style={s.grid4}>
                <div style={s.field}><label style={s.label}>BRQ No.</label><input style={s.input} value={d1.brqNo || ''} onChange={e => updateStep('step1', 'brqNo', e.target.value)} placeholder="BRQ-26-13947" /></div>
                <div style={s.field}><label style={s.label}>Date Of Report</label><input style={s.input} type="date" value={d1.dateOfReport || ''} onChange={e => updateStep('step1', 'dateOfReport', e.target.value)} /></div>
                <div style={s.field}><label style={s.label}>Loan Category</label><input style={s.input} value={d1.loanCategory || ''} onChange={e => updateStep('step1', 'loanCategory', e.target.value)} placeholder="HLP" /></div>
                <div style={s.field}><label style={s.label}>Valuer Name</label><input style={s.input} value={d1.valuerName || ''} onChange={e => updateStep('step1', 'valuerName', e.target.value)} placeholder="UNIQUE ENGINEERING ASSOCIATE" /></div>
              </div>
              <div style={s.grid4}>
                <div style={s.field}><label style={s.label}>Contact Person</label><input style={s.input} value={d1.contactPerson || ''} onChange={e => updateStep('step1', 'contactPerson', e.target.value)} placeholder="UMESH" /></div>
                <div style={s.field}><label style={s.label}>Contact No</label><input style={s.input} value={d1.contactNo || ''} onChange={e => updateStep('step1', 'contactNo', e.target.value)} placeholder="9200716408" /></div>
                <div style={s.field}><label style={s.label}>Person Met at Site</label><input style={s.input} value={d1.personMetAtSite || ''} onChange={e => updateStep('step1', 'personMetAtSite', e.target.value)} placeholder="SURESH MEHRA" /></div>
                <div style={s.field}><label style={s.label}>Property Owner</label><input style={s.input} value={d1.propertyOwner || ''} onChange={e => updateStep('step1', 'propertyOwner', e.target.value)} placeholder="UMESH KUMAR JOGI" /></div>
              </div>
              <div style={s.uploadSection}>
                <div style={s.uploadTitle}>📸 Upload Required Images</div>
                <div style={s.uploadNote}>⚠️ Max size limit: 10 MB | JPEG/PNG only</div>
                <div style={s.uploadGrid}>
                  <div style={s.uploadBox} onClick={() => document.getElementById('frontElevation').click()}><div style={s.uploadIcon}>🏠</div><div style={s.uploadText}>Front Elevation</div></div>
                  <div style={s.uploadBox} onClick={() => document.getElementById('kitchenStep1').click()}><div style={s.uploadIcon}>🍳</div><div style={s.uploadText}>Kitchen</div></div>
                  <div style={s.uploadBox} onClick={() => document.getElementById('selfie').click()}><div style={s.uploadIcon}>🤳</div><div style={s.uploadText}>Selfie</div></div>
                  <div style={s.uploadBox} onClick={() => document.getElementById('otherStep1').click()}><div style={s.uploadIcon}>📷</div><div style={s.uploadText}>Other</div></div>
                </div>
                <input id="frontElevation" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleImageUpload('step1', 'frontElevation', e.target.files[0])} />
                <input id="kitchenStep1" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleImageUpload('step1', 'kitchen', e.target.files[0])} />
                <input id="selfie" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleImageUpload('step1', 'selfie', e.target.files[0])} />
                <input id="otherStep1" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleImageUpload('step1', 'otherImages', e.target.files[0])} />
                {d1.frontElevation?.length > 0 && <ImagePreviewSection title="Front Elevation" images={d1.frontElevation} onRemove={(idx) => removeImage('step1', 'frontElevation', idx)} />}
                {d1.kitchen?.length > 0 && <ImagePreviewSection title="Kitchen" images={d1.kitchen} onRemove={(idx) => removeImage('step1', 'kitchen', idx)} />}
                {d1.selfie?.length > 0 && <ImagePreviewSection title="Selfie" images={d1.selfie} onRemove={(idx) => removeImage('step1', 'selfie', idx)} />}
                {d1.otherImages?.length > 0 && <ImagePreviewSection title="Other" images={d1.otherImages} onRemove={(idx) => removeImage('step1', 'otherImages', idx)} />}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div style={s.card}>
            <div style={s.cardHeader}>📍 Location Details</div>
            <div style={s.cardBody}>
              <div style={s.grid3}>
                <div style={s.field}><label style={s.label}>Pin Code</label><input style={s.input} value={d2.propertyPincode || ''} onChange={e => updateStep('step2', 'propertyPincode', e.target.value)} placeholder="466001" /></div>
                <div style={s.field}><label style={s.label}>City</label><input style={s.input} value={d2.propertyCity || ''} onChange={e => updateStep('step2', 'propertyCity', e.target.value)} placeholder="SEHORE" /></div>
                <div style={s.field}><label style={s.label}>State</label><input style={s.input} value={d2.propertyState || ''} onChange={e => updateStep('step2', 'propertyState', e.target.value)} placeholder="MADHYA PRADESH" /></div>
              </div>
              <div style={s.grid2}>
                <div style={s.field}><label style={s.label}>Address as per Site</label><input style={s.input} value={d2.addressAsPerSite || ''} onChange={e => updateStep('step2', 'addressAsPerSite', e.target.value)} placeholder="K.H.NO. 247/1/1/2S AND 250/1/1/2 250/1," /></div>
                <div style={s.field}><label style={s.label}>Locality Name</label><input style={s.input} value={d2.localityName || ''} onChange={e => updateStep('step2', 'localityName', e.target.value)} placeholder="GRAM-CHITODIYA HEMA" /></div>
              </div>
              <div style={s.grid3}>
                <div style={s.field}><label style={s.label}>Nearest Landmark</label><input style={s.input} value={d2.landmarkNearBy || ''} onChange={e => updateStep('step2', 'landmarkNearBy', e.target.value)} placeholder="FRONT OF NO.3 SBI BANK" /></div>
                <div style={s.field}><label style={s.label}>Distance From City Centre (KM)</label><input style={s.input} type="number" value={d2.distanceFromCityCenter || ''} onChange={e => updateStep('step2', 'distanceFromCityCenter', e.target.value)} placeholder="53" /></div>
                <div style={s.field}><label style={s.label}>Floor No.</label><input style={s.input} value={d2.floorNo || ''} onChange={e => updateStep('step2', 'floorNo', e.target.value)} placeholder="GROUND" /></div>
              </div>
              <LocationMap
                lat={d2.latitude} lng={d2.longitude} mapView={d2.mapView || 'satellite'} capturedAt={d2.locationCapturedAt || ''}
                onLocationChange={(lat, lng) => { updateStep('step2', 'latitude', lat); updateStep('step2', 'longitude', lng); }}
                onAddressChange={(addr) => updateStep('step2', 'addressAsPerSite', addr)}
                onTimestampChange={(timestamp) => updateStep('step2', 'locationCapturedAt', timestamp)}
                onMapViewChange={(view) => updateStep('step2', 'mapView', view)}
              />
              <div style={s.grid3}>
                <select style={s.select} value={d2.addressMatching || ''} onChange={e => updateStep('step2', 'addressMatching', e.target.value)}><option value="">Address Matching</option><option>YES</option><option>NO</option></select>
                <select style={s.select} value={d2.jurisdiction || ''} onChange={e => updateStep('step2', 'jurisdiction', e.target.value)}><option value="">Jurisdiction</option><option>MC</option><option>NON-MC</option></select>
                <select style={s.select} value={d2.propertyHoldingType || ''} onChange={e => updateStep('step2', 'propertyHoldingType', e.target.value)}><option value="">Property Holding Type</option><option>FREEHOLD</option><option>LEASEHOLD</option></select>
              </div>
              <div style={s.grid3}>
                <select style={s.select} value={d2.marketability || ''} onChange={e => updateStep('step2', 'marketability', e.target.value)}><option value="">Marketability</option><option>GOOD</option><option>AVERAGE</option><option>POOR</option></select>
                <select style={s.select} value={d2.propertyOccupiedBy || ''} onChange={e => updateStep('step2', 'propertyOccupiedBy', e.target.value)}><option value="">Property Occupied By</option><option>SELF</option><option>OWNER</option><option>TENANT</option></select>
                <select style={s.select} value={d2.typeOfProperty || ''} onChange={e => updateStep('step2', 'typeOfProperty', e.target.value)}><option value="">Type of Property</option><option>RESIDENTIAL</option><option>COMMERCIAL</option><option>OFFICE</option></select>
              </div>
              <div style={s.uploadSection}>
                <div style={s.uploadTitle}>📸 Property Photos</div>
                <div style={s.uploadGrid}>
                  <div style={s.uploadBox} onClick={() => document.getElementById('kitchenPhotos').click()}><div style={s.uploadIcon}>🍳</div><div style={s.uploadText}>Kitchen</div></div>
                  <div style={s.uploadBox} onClick={() => document.getElementById('otherPhotos').click()}><div style={s.uploadIcon}>🏢</div><div style={s.uploadText}>Other</div></div>
                </div>
                <input id="kitchenPhotos" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleImageUpload('step2', 'kitchenImages', e.target.files[0])} />
                <input id="otherPhotos" type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleImageUpload('step2', 'otherImages', e.target.files[0])} />
                {d2.kitchenImages?.length > 0 && <ImagePreviewSection title="Kitchen Photos" images={d2.kitchenImages} onRemove={(idx) => removeImage('step2', 'kitchenImages', idx)} />}
                {d2.otherImages?.length > 0 && <ImagePreviewSection title="Other Photos" images={d2.otherImages} onRemove={(idx) => removeImage('step2', 'otherImages', idx)} />}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 - Boundaries */}
        {currentStep === 3 && (
          <div style={s.card}>
            <div style={s.cardHeader}>🧭 Boundaries On Site</div>
            <div style={s.cardBody}>
              <div style={s.tableWrapper}>
                <table style={s.table}>
                  <thead><tr><th style={s.th}>Direction</th><th style={s.th}>As per legal documents</th><th style={s.th}>As per site visit</th></tr></thead>
                  <tbody>
                    {['East', 'West', 'North', 'South'].map(dir => (
                      <tr key={dir}>
                        <td style={s.td}><strong>{dir}</strong></td>
                        <td style={s.td}><input style={s.input} value={d3[`${dir.toLowerCase()}Boundary`] || ''} onChange={e => updateStep('step3', `${dir.toLowerCase()}Boundary`, e.target.value)} placeholder={`Land of Anup Singh`} /></td>
                        <td style={s.td}><input style={s.input} value={d3[`${dir.toLowerCase()}BoundarySite`] || ''} onChange={e => updateStep('step3', `${dir.toLowerCase()}BoundarySite`, e.target.value)} placeholder={`Under const. building`} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={s.grid3}>
                <select style={s.select} value={d3.boundariesMatching || ''} onChange={e => updateStep('step3', 'boundariesMatching', e.target.value)}><option value="">Boundary Matching</option><option>YES</option><option>NO</option></select>
                <select style={s.select} value={d3.approachRoadSize || ''} onChange={e => updateStep('step3', 'approachRoadSize', e.target.value)}><option value="">Approach Road Size</option><option>LESS THAN 10FT</option><option>10-15FT</option><option>MORE THAN 15FT</option></select>
                <select style={s.select} value={d3.propertyIdentified || ''} onChange={e => updateStep('step3', 'propertyIdentified', e.target.value)}><option value="">Property Identified</option><option>YES</option><option>NO</option></select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 - NDMA Parameters */}
        {currentStep === 4 && (
          <div style={s.card}>
            <div style={s.cardHeader}>🏗️ NDMA Parameters</div>
            <div style={s.cardBody}>
              <div style={s.grid3}>
                <select style={s.select} value={d4.natureOfBuilding || ''} onChange={e => updateStep('step4', 'natureOfBuilding', e.target.value)}><option value="">Nature of Building/Wing</option><option>RESIDENTIAL</option><option>COMMERCIAL</option></select>
                <select style={s.select} value={d4.structureType || ''} onChange={e => updateStep('step4', 'structureType', e.target.value)}><option value="">Structure Type</option><option>RCC</option><option>LOAD BEARING</option></select>
                <select style={s.select} value={d4.roofType || ''} onChange={e => updateStep('step4', 'roofType', e.target.value)}><option value="">Roof Type</option><option>FLAT ROOF</option><option>SLOPED ROOF</option></select>
              </div>
              <div style={s.grid3}>
                <select style={s.select} value={d4.steelGrade || ''} onChange={e => updateStep('step4', 'steelGrade', e.target.value)}><option value="">Steel Grade</option><option>FE 415</option><option>FE 500</option></select>
                <select style={s.select} value={d4.concreteGrade || ''} onChange={e => updateStep('step4', 'concreteGrade', e.target.value)}><option value="">Concrete Grade</option><option>M20</option><option>M25</option></select>
                <select style={s.select} value={d4.typeOfMasonry || ''} onChange={e => updateStep('step4', 'typeOfMasonry', e.target.value)}><option value="">Type of Masonry</option><option>BRICK MASONRY</option><option>STONE MASONRY</option></select>
              </div>
              <div style={s.grid3}>
                <select style={s.select} value={d4.footingType || ''} onChange={e => updateStep('step4', 'footingType', e.target.value)}><option value="">Footing Type</option><option>INDIVIDUAL FOOTINGS</option><option>RAFT FOUNDATION</option></select>
                <select style={s.select} value={d4.seismicZone || ''} onChange={e => updateStep('step4', 'seismicZone', e.target.value)}><option value="">Seismic Zone</option><option>ZONE II</option><option>ZONE III</option><option>ZONE IV</option></select>
                <select style={s.select} value={d4.floodProneArea || ''} onChange={e => updateStep('step4', 'floodProneArea', e.target.value)}><option value="">Flood Prone Area</option><option>YES</option><option>NO</option></select>
              </div>
              <div style={s.grid3}>
                <select style={s.select} value={d4.fireExit || ''} onChange={e => updateStep('step4', 'fireExit', e.target.value)}><option value="">Fire Exit</option><option>YES</option><option>NO</option></select>
                <select style={s.select} value={d4.sanctionedPlanProvided || ''} onChange={e => updateStep('step4', 'sanctionedPlanProvided', e.target.value)}><option value="">Sanctioned Plan Provided</option><option>YES</option><option>NO</option></select>
                <select style={s.select} value={d4.approvingAuthority || ''} onChange={e => updateStep('step4', 'approvingAuthority', e.target.value)}><option value="">Approving Authority</option><option>MC</option><option>NON-MC</option></select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 - Technical Details (Plot Area) */}
        {currentStep === 5 && (
          <div style={s.card}>
            <div style={s.cardHeader}>📐 Plot & Construction Details</div>
            <div style={s.cardBody}>
              <div style={s.grid3}>
                <select style={s.select} value={d5.constructionQuality || ''} onChange={e => updateStep('step5', 'constructionQuality', e.target.value)}><option value="">Construction Quality</option><option>GOOD</option><option>AVERAGE</option><option>POOR</option></select>
                <select style={s.select} value={d5.liftAvailable || ''} onChange={e => updateStep('step5', 'liftAvailable', e.target.value)}><option value="">Lift Available</option><option>YES</option><option>NO</option></select>
                <input style={s.input} type="number" placeholder="No of Lifts" value={d5.noOfLifts || ''} onChange={e => updateStep('step5', 'noOfLifts', e.target.value)} />
              </div>
              <div style={s.tableWrapper}>
                <table style={s.table}>
                  <thead><tr><th style={s.th}>Dimension</th><th style={s.th}>As Per Plan</th><th style={s.th}>As Per Documents</th><th style={s.th}>As Per Site Visit</th></tr></thead>
                  <tbody>
                    <tr><td style={s.td}>East to West (ft)</td><td><input style={s.input} type="number" value={d5.eastToWestPlan || ''} onChange={e => updateStep('step5', 'eastToWestPlan', e.target.value)} /></td><td><input style={s.input} type="number" value={d5.eastToWestDoc || ''} onChange={e => updateStep('step5', 'eastToWestDoc', e.target.value)} /></td><td><input style={s.input} type="number" value={d5.eastToWestSite || ''} onChange={e => updateStep('step5', 'eastToWestSite', e.target.value)} /></td></tr>
                    <tr><td style={s.td}>North to South (ft)</td><td><input style={s.input} type="number" value={d5.northToSouthPlan || ''} onChange={e => updateStep('step5', 'northToSouthPlan', e.target.value)} /></td><td><input style={s.input} type="number" value={d5.northToSouthDoc || ''} onChange={e => updateStep('step5', 'northToSouthDoc', e.target.value)} /></td><td><input style={s.input} type="number" value={d5.northToSouthSite || ''} onChange={e => updateStep('step5', 'northToSouthSite', e.target.value)} /></td></tr>
                    <tr><td style={s.td}>Land Area (Sq.Ft)</td><td><input style={s.input} type="number" value={d5.landAreaPlan || ''} onChange={e => updateStep('step5', 'landAreaPlan', e.target.value)} /></td><td><input style={s.input} type="number" value={d5.landAreaDoc || ''} onChange={e => updateStep('step5', 'landAreaDoc', e.target.value)} /></td><td><input style={s.input} type="number" value={d5.landAreaSite || ''} onChange={e => updateStep('step5', 'landAreaSite', e.target.value)} /></td></tr>
                  </tbody>
                </table>
              </div>
              <div style={s.grid3}>
                <input style={s.input} type="number" placeholder="Carpet Area as per Document (Sq.Ft)" value={d5.carpetAreaAsPerDocument || ''} onChange={e => updateStep('step5', 'carpetAreaAsPerDocument', e.target.value)} />
                <input style={s.input} type="number" placeholder="Actual Construction SBUA (Sq.Ft)" value={d5.actualConstructionSBUA || ''} onChange={e => updateStep('step5', 'actualConstructionSBUA', e.target.value)} />
                <select style={s.select} value={d5.riskOfDemolition || ''} onChange={e => updateStep('step5', 'riskOfDemolition', e.target.value)}><option value="">Risk of Demolition</option><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select>
              </div>
              <div style={s.grid3}>
                <select style={s.select} value={d5.statusOfProperty || ''} onChange={e => updateStep('step5', 'statusOfProperty', e.target.value)}><option value="">Status Of Property</option><option>COMPLETE</option><option>UNDER CONSTRUCTION</option></select>
                <input style={s.input} type="number" placeholder="% Completed" value={d5.percentCompleted || ''} onChange={e => updateStep('step5', 'percentCompleted', e.target.value)} />
                <input style={s.input} type="number" placeholder="Current Age of Property (Years)" value={d5.currentAgeOfProperty || ''} onChange={e => updateStep('step5', 'currentAgeOfProperty', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6 - Accommodation Details (Floors) */}
        {currentStep === 6 && (
          <div style={s.card}>
            <div style={s.cardHeader}>🏢 Accommodation Details</div>
            <div style={s.cardBody}>
              <div style={s.tableWrapper}>
                <table style={s.table}>
                  <thead><tr><th style={s.th}>Floor No</th><th style={s.th}>No of Rooms</th><th style={s.th}>No of Kitchen</th><th style={s.th}>No of BathRoom</th><th style={s.th}>Sanction Usage</th><th style={s.th}>Actual Usage</th><th style={s.th}></th></tr></thead>
                  <tbody>
                    {(d6.floors || []).map((floor, idx) => (
                      <tr key={idx}>
                        <td><input style={s.input} value={floor.floorNo || ''} onChange={e => updateFloor(idx, 'floorNo', e.target.value)} placeholder="GROUND FLOOR" /></td>
                        <td><input style={{ width: 70 }} type="number" value={floor.noOfRooms || 0} onChange={e => updateFloor(idx, 'noOfRooms', e.target.value)} /></td>
                        <td><input style={{ width: 70 }} type="number" value={floor.noOfKitchen || 0} onChange={e => updateFloor(idx, 'noOfKitchen', e.target.value)} /></td>
                        <td><input style={{ width: 70 }} type="number" value={floor.noOfBathRoom || 0} onChange={e => updateFloor(idx, 'noOfBathRoom', e.target.value)} /></td>
                        <td><select style={s.select} value={floor.sanctionUsage || ''} onChange={e => updateFloor(idx, 'sanctionUsage', e.target.value)}><option value="">Select</option><option>RESIDENTIAL</option><option>COMMERCIAL</option></select></td>
                        <td><input style={s.input} value={floor.actualUsage || ''} onChange={e => updateFloor(idx, 'actualUsage', e.target.value)} placeholder="COMMERCIAL" /></td>
                        <td><button onClick={() => removeFloor(idx)} style={{ color: '#e53935', cursor: 'pointer', background: 'none', border: 'none', fontSize: 18 }}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={addFloor} style={{ ...s.btnBack, marginTop: 12, padding: '6px 16px', fontSize: 12 }}>+ Add Floor</button>
            </div>
          </div>
        )}

        {/* STEP 7 - Valuation */}
        {currentStep === 7 && (
          <div style={s.card}>
            <div style={s.cardHeader}>💰 Valuation</div>
            <div style={s.cardBody}>
              <div style={s.grid3}>
                <input style={s.input} type="number" placeholder="Land Area (Sq.Ft)" value={d7.landArea || ''} onChange={e => updateStep('step7', 'landArea', e.target.value)} />
                <input style={s.input} type="number" placeholder="Tentative Land Rate (₹/Sq.Ft)" value={d7.tentativeLandRate || ''} onChange={e => updateStep('step7', 'tentativeLandRate', e.target.value)} />
                <input style={s.input} type="number" placeholder="Depreciation %" value={d7.depreciation || ''} onChange={e => updateStep('step7', 'depreciation', e.target.value)} />
              </div>
              <div style={s.grid3}>
                <input style={s.input} type="number" placeholder="Land Value (₹)" value={d7.landValue || ''} onChange={e => updateStep('step7', 'landValue', e.target.value)} />
                <input style={s.input} type="number" placeholder="Government Value (₹)" value={d7.governmentValue || ''} onChange={e => updateStep('step7', 'governmentValue', e.target.value)} />
                <input style={s.input} type="number" placeholder="Distressed/Force Value (₹)" value={d7.distressedValue || ''} onChange={e => updateStep('step7', 'distressedValue', e.target.value)} />
              </div>
              <div style={s.grid3}>
                <select style={s.select} value={d7.valuationMethodology || ''} onChange={e => updateStep('step7', 'valuationMethodology', e.target.value)}><option value="">Valuation Methodology</option><option>LAND BUILDING</option><option>COMPARATIVE MARKET</option></select>
                <select style={s.select} value={d7.valuationDoneEarlier || ''} onChange={e => updateStep('step7', 'valuationDoneEarlier', e.target.value)}><option value="">Valuation Done Earlier</option><option>YES</option><option>NO</option></select>
                <select style={s.select} value={d7.isPropertyInNegativeArea || ''} onChange={e => updateStep('step7', 'isPropertyInNegativeArea', e.target.value)}><option value="">Is Property in Negative Area</option><option>YES</option><option>NO</option></select>
              </div>
              <textarea style={s.textarea} rows={3} placeholder="Remarks if any" value={d7.remarks || ''} onChange={e => updateStep('step7', 'remarks', e.target.value)} />
            </div>
          </div>
        )}

        {/* STEP 8 - Infrastructure & Declaration */}
        {currentStep === 8 && (
          <div style={s.card}>
            <div style={s.cardHeader}>🏘️ Infrastructure & Declaration</div>
            <div style={s.cardBody}>
              <div style={s.grid3}>
                <select style={s.select} value={d8.approachRoadToProperty || ''} onChange={e => updateStep('step8', 'approachRoadToProperty', e.target.value)}><option value="">Approach Road to property</option><option>Single Lane</option><option>Double Lane</option></select>
                <select style={s.select} value={d8.developmentOfSurroundingAreas || ''} onChange={e => updateStep('step8', 'developmentOfSurroundingAreas', e.target.value)}><option value="">Development of Surrounding Areas</option><option>LOW DENSITY</option><option>MEDIUM DENSITY</option><option>HIGH DENSITY</option></select>
                <input style={s.input} type="number" placeholder="Distance from city centre (Kms)" value={d8.distanceFromCityCenter || ''} onChange={e => updateStep('step8', 'distanceFromCityCenter', e.target.value)} />
              </div>
              <div style={s.grid3}>
                <select style={s.select} value={d8.electricityAvailable || ''} onChange={e => updateStep('step8', 'electricityAvailable', e.target.value)}><option value="">Electricity Available</option><option>AVAILABLE</option><option>NOT AVAILABLE</option></select>
                <input style={s.input} placeholder="Electricity Distributor" value={d8.electricityDistributor || ''} onChange={e => updateStep('step8', 'electricityDistributor', e.target.value)} />
                <select style={s.select} value={d8.waterSupply || ''} onChange={e => updateStep('step8', 'waterSupply', e.target.value)}><option value="">Water Supply</option><option>AVAILABLE</option><option>NOT AVAILABLE</option></select>
              </div>
              <div style={s.grid3}>
                <input style={s.input} placeholder="Water Distributor" value={d8.waterDistributor || ''} onChange={e => updateStep('step8', 'waterDistributor', e.target.value)} />
                <select style={s.select} value={d8.sewerLineConnected || ''} onChange={e => updateStep('step8', 'sewerLineConnected', e.target.value)}><option value="">Sewer Line Connected</option><option>YES</option><option>NO</option></select>
                <select style={s.select} value={d8.anyDemolitionThreat || ''} onChange={e => updateStep('step8', 'anyDemolitionThreat', e.target.value)}><option value="">Any Demolition Threat in Future</option><option>YES</option><option>NO</option></select>
              </div>
              <textarea style={s.textarea} rows={3} placeholder="Declaration" value={d8.declaration || ''} onChange={e => updateStep('step8', 'declaration', e.target.value)} />
              <div style={s.grid3}>
                <input style={s.input} placeholder="Created By" value={d8.createdBy || ''} onChange={e => updateStep('step8', 'createdBy', e.target.value)} />
                <input style={s.input} placeholder="Created On" value={d8.createdOn || ''} onChange={e => updateStep('step8', 'createdOn', e.target.value)} />
                <input style={s.input} placeholder="Location" value={d8.location || ''} onChange={e => updateStep('step8', 'location', e.target.value)} />
                <input style={s.input} placeholder="Approved By" value={d8.approvedBy || ''} onChange={e => updateStep('step8', 'approvedBy', e.target.value)} />
                <input style={s.input} placeholder="Approved On" value={d8.approvedOn || ''} onChange={e => updateStep('step8', 'approvedOn', e.target.value)} />
                <input style={s.input} placeholder="Designation" value={d8.designation || ''} onChange={e => updateStep('step8', 'designation', e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={s.footer}>
        <div><span style={s.badge}>Remaining: 0</span><span style={{ ...s.badgeBlue, marginLeft: 8 }}>Completed: All</span></div>
        <div style={{ display: 'flex', gap: 12 }}>
          {currentStep > 1 && <button style={s.btnBack} onClick={prevStep}>← Back</button>}
          <button style={s.btnSave} onClick={saveDraft} disabled={saving}>{saving ? 'Saving...' : 'Save Draft'}</button>
          {currentStep < 8 ? <button style={s.btnNext} onClick={nextStep}>Save & Next →</button> : (
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={s.btnSubmit} onClick={submitForm}>Submit</button>
              {id && (user?.role === "Admin" || user?.role === "SuperAdmin") && (
                <button
                  onClick={lastUpdate}
                  style={{ ...s.btnSubmit, background: '#e31837' }}
                >
                  Final Submit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== VIEW REPORT COMPONENT ====================
function ViewReport({ id, onBack }) {
  const [report, setReport] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    fetch(`${API}/reports/${id}`).then(r => r.json()).then(setReport).catch(console.error);
  }, [id]);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Valuation Report</title><style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 20px; }
      img { max-width: 100%; }
      @media print { body { margin: 0; padding: 0; } }
    </style></head><body>${content}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  if (!report) return <div style={{ textAlign: 'center', padding: 60 }}>Loading report...</div>;

  const s1 = report.step1 || {};
  const s2 = report.step2 || {};
  const s3 = report.step3 || {};
  const s4 = report.step4 || {};
  const s5 = report.step5 || {};
  const s6 = report.step6 || { floors: [] };
  const s7 = report.step7 || {};
  const s8 = report.step8 || {};
  const pageId = `${s1.fileNo || id} / ${s1.lanNo || 'CT---'} / ${s1.brqNo || 'BRQ---'}`;

  const Row = ({ label, value }) => (
    <tr><td style={s.reportTdLabel}>{label}</td><td style={s.reportTd}>{value || '-'}</td></tr>
  );
  const Row2 = ({ l1, v1, l2, v2 }) => (
    <tr>
      <td style={s.reportTdLabel}>{l1}</td><td style={s.reportTd}>{v1 || '-'}</td>
      <td style={s.reportTdLabel}>{l2}</td><td style={s.reportTd}>{v2 || '-'}</td>
    </tr>
  );

  return (
    <div>
      <div style={s.toolbar}>
        <div><span style={{ color: '#002d72', fontWeight: 700, fontSize: 16 }}>Valuation Report</span><span style={{ color: '#888', fontSize: 13, marginLeft: 12 }}>{s1.applicantName} — {s1.fileNo}</span></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.location.reload()} style={{ background: '#fff', color: '#002d72', border: '2px solid #002d72', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>✏️ Edit</button>
          <button onClick={handlePrint} style={{ background: '#e31837', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>⬇ Download / Print</button>
          <button onClick={onBack} style={{ background: '#6c757d', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>← Back</button>
        </div>
      </div>
      <div style={{ padding: '24px 32px' }}>
        <div ref={printRef} style={s.reportContainer}>
          {/* Header */}
          <div style={s.reportHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ background: '#002d72', color: '#fff', fontWeight: 900, fontSize: 20, padding: '6px 12px', borderRadius: 4, letterSpacing: 2 }}>BAJAJ</div>
              <div><div style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>HOUSING</div><div style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>FINANCE</div></div>
            </div>
            <div style={s.reportTitle}>Valuation Report</div>
            <div style={{ textAlign: 'right', fontSize: 12 }}><div><strong>Valuer Name :</strong> {s1.valuerName || 'UNIQUE ENGINEERING ASSOCIATE'}</div></div>
          </div>

          {/* Basic Info */}
          <table style={s.reportTable}>
            <tbody>
              <Row label="File No./LAN No." value={`${s1.fileNo} / ${s1.lanNo}`} />
              <Row label="Date of Report" value={s1.dateOfReport} />
              <Row label="Name of Applicant" value={s1.applicantName} />
              <Row label="Contact Person" value={s1.contactPerson} />
              <Row label="Loan Category" value={s1.loanCategory} />
              <Row label="Person Met at Site" value={s1.personMetAtSite} />
              <Row label="Property Owner (Legal Document)" value={s1.propertyOwner} />
            </tbody>
          </table>

          {/* Location Details */}
          <div style={s.sectionTitle}>Location Details</div>
          <table style={s.reportTable}>
            <tbody>
              <Row2 l1="Address as per Site" v1={s2.addressAsPerSite} l2="Locality Name" v2={s2.localityName} />
              <Row2 l1="Landmark Near By" v1={s2.landmarkNearBy} l2="Distance from City Centre" v2={s2.distanceFromCityCenter} />
              <Row2 l1="LAT/Long" v1={`${s2.latitude}, ${s2.longitude}`} l2="Floor No. of Property" v2={s2.floorNo} />
              <Row2 l1="Property City/State/Pin" v1={`${s2.propertyCity}, ${s2.propertyState}, ${s2.propertyPincode}`} l2="Address Matching" v2={s2.addressMatching} />
              <Row2 l1="Property Holding Type" v1={s2.propertyHoldingType} l2="Property Occupied by" v2={s2.propertyOccupiedBy} />
              <Row2 l1="Type of the Property" v1={s2.typeOfProperty} l2="Jurisdiction" v2={s2.jurisdiction} />
              <Row2 l1="Marketability" v1={s2.marketability} l2="Legal Address" v2={s2.legalAddress} />
            </tbody>
          </table>
          <ReportLocationMap lat={s2.latitude} lng={s2.longitude} mapView={s2.mapView || 'satellite'} timestamp={s2.locationCapturedAt} />

          {/* Boundaries */}
          <div style={s.sectionTitle}>Schedule of the Property — Boundaries</div>
          <table style={s.reportTable}>
            <tbody>
              <tr><td colSpan={2} style={{ ...s.reportTdLabel, textAlign: 'center' }}>As per Legal Documents</td><td colSpan={2} style={{ ...s.reportTdLabel, textAlign: 'center' }}>As per Site Visit</td></tr>
              <Row2 l1="North" v1={s3.northBoundary} l2="North" v2={s3.northBoundarySite} />
              <Row2 l1="South" v1={s3.southBoundary} l2="South" v2={s3.southBoundarySite} />
              <Row2 l1="East" v1={s3.eastBoundary} l2="East" v2={s3.eastBoundarySite} />
              <Row2 l1="West" v1={s3.westBoundary} l2="West" v2={s3.westBoundarySite} />
              <Row2 l1="Boundaries Matching" v1={s3.boundariesMatching} l2="Approach Road Size" v2={s3.approachRoadSize} />
            </tbody>
          </table>

          {/* NDMA Parameters */}
          <div style={s.sectionTitle}>NDMA Parameters</div>
          <table style={s.reportTable}>
            <tbody>
              <Row2 l1="Nature of Building" v1={s4.natureOfBuilding} l2="Roof Type" v2={s4.roofType} />
              <Row2 l1="Structure Type" v1={s4.structureType} l2="Steel Grade" v2={s4.steelGrade} />
              <Row2 l1="Concrete Grade" v1={s4.concreteGrade} l2="Type of Masonry" v2={s4.typeOfMasonry} />
              <Row2 l1="Footing Type" v1={s4.footingType} l2="Seismic Zone" v2={s4.seismicZone} />
              <Row2 l1="Flood Prone Area" v1={s4.floodProneArea} l2="Fire Exit" v2={s4.fireExit} />
              <Row2 l1="Sanctioned Plan Provided" v1={s4.sanctionedPlanProvided} l2="Approving Authority" v2={s4.approvingAuthority} />
            </tbody>
          </table>

          {/* Technical Details */}
          <div style={s.sectionTitle}>Technical Details</div>
          <table style={s.reportTable}>
            <tbody>
              <Row2 l1="Construction Quality" v1={s5.constructionQuality} l2="Lift Available" v2={s5.liftAvailable} />
              <Row2 l1="East to West (ft)" v1={s5.eastToWestSite} l2="North to South (ft)" v2={s5.northToSouthSite} />
              <Row2 l1="Land Area (Sq. Ft.)" v1={s5.landAreaSite} l2="Carpet Area (Sq.Ft)" v2={s5.carpetAreaAsPerDocument} />
              <Row2 l1="Actual Construction SBUA" v1={s5.actualConstructionSBUA} l2="Risk of Demolition" v2={s5.riskOfDemolition} />
              <Row2 l1="Status of Property" v1={s5.statusOfProperty} l2="% Completed" v2={s5.percentCompleted} />
              <Row2 l1="Current Age of Property" v1={s5.currentAgeOfProperty} l2="Residual Age" v2={s5.residualAge} />
            </tbody>
          </table>

          {/* Accommodation Details */}
          <div style={s.sectionTitle}>Accommodation Details</div>
          <table style={s.reportTable}>
            <thead><tr style={{ background: '#f0f2f5' }}>{['Floor No', 'Rooms', 'Kitchen', 'Bathroom', 'Sanction Usage', 'Actual Usage'].map(h => <th key={h} style={{ padding: '7px 10px', border: '1px solid #999', fontSize: 11, fontWeight: 700, textAlign: 'left' }}>{h}</th>)}</tr></thead>
            <tbody>{(s6.floors || []).map((fl, i) => <tr key={i}>{['floorNo', 'noOfRooms', 'noOfKitchen', 'noOfBathRoom', 'sanctionUsage', 'actualUsage'].map(f => <td key={f} style={s.reportTd}>{fl[f] || '-'}</td>)}</tr>)}</tbody>
          </table>

          {/* Valuation Details */}
          <div style={s.sectionTitle}>Valuation Details</div>
          <table style={s.reportTable}>
            <tbody>
              <Row2 l1="Land Area (Sq.Ft)" v1={s7.landArea} l2="Tentative Land Rate" v2={s7.tentativeLandRate ? `₹${Number(s7.tentativeLandRate).toLocaleString('en-IN')}` : '-'} />
              <Row2 l1="Depreciation %" v1={s7.depreciation} l2="Land Value" v2={s7.landValue ? `₹${Number(s7.landValue).toLocaleString('en-IN')}` : '-'} />
              <Row2 l1="Government Value" v1={s7.governmentValue ? `₹${Number(s7.governmentValue).toLocaleString('en-IN')}` : '-'} l2="Distressed Value" v2={s7.distressedValue ? `₹${Number(s7.distressedValue).toLocaleString('en-IN')}` : '-'} />
              <Row2 l1="Valuation Methodology" v1={s7.valuationMethodology} l2="Is Property in Negative Area" v2={s7.isPropertyInNegativeArea} />
              <Row label="Remarks" value={s7.remarks} />
            </tbody>
          </table>

          {/* Infrastructure & Declaration */}
          <div style={s.sectionTitle}>Infrastructure & Declaration</div>
          <table style={s.reportTable}>
            <tbody>
              <Row2 l1="Approach Road" v1={s8.approachRoadToProperty} l2="Surrounding Development" v2={s8.developmentOfSurroundingAreas} />
              <Row2 l1="Distance from City Centre" v1={s8.distanceFromCityCenter} l2="Electricity" v2={s8.electricityAvailable} />
              <Row2 l1="Electricity Distributor" v1={s8.electricityDistributor} l2="Water Supply" v2={s8.waterSupply} />
              <Row2 l1="Water Distributor" v1={s8.waterDistributor} l2="Sewer Line Connected" v2={s8.sewerLineConnected} />
              <Row2 l1="Demolition Threat" v1={s8.anyDemolitionThreat} l2="Created By/On" v2={`${s8.createdBy} / ${s8.createdOn}`} />
              <Row label="Declaration" value={s8.declaration} />
            </tbody>
          </table>

          {/* Images */}
          <ReportImageGallery title="Front Elevation" images={s1.frontElevation || []} />
          <ReportImageGallery title="Kitchen Images" images={[...(s1.kitchen || []), ...(s2.kitchenImages || [])]} />
          <ReportImageGallery title="Selfie At Site" images={s1.selfie || []} />
          <ReportImageGallery title="Other Property Images" images={[...(s1.otherImages || []), ...(s2.otherImages || [])]} />

          {/* Footer */}
          <div style={{ borderTop: '2px solid #002d72', marginTop: 20, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#666' }}>
            <div>{pageId}</div><div>Page 1</div><div>This document is computer generated and does not require signature.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN EXPORT - TOGGLE BETWEEN FORM AND REPORT ====================
export default function ValuationModule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState('form'); // 'form' or 'report'

  const handleSubmit = () => {
    setMode('report');
  };

  const handleBack = () => {
    navigate('/requests');
  };

  if (mode === 'report') {
    return <ViewReport id={id} onBack={() => setMode('form')} />;
  }

  return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.headerLogo}>PROVALUER</div>
          <div style={s.headerSub}>Product of A Ameya Infovision Pvt. Ltd.</div>
        </div>
        <div style={s.headerRight}>
          <div style={s.headerBrand}>BAJAJ HOUSING FINANCE LIMITED</div>
          <div style={s.headerFin}>Site Visit Report | New Application</div>
        </div>
      </div>
      <ValuationForm id={id} onSubmit={handleSubmit} onSave={() => { }} />
    </div>
  );
}