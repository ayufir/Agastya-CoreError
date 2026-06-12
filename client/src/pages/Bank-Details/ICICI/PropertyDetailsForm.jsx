// PropertyDetailsForm.jsx — iLens replica, scoped CSS, full residential/industrial/special logic
// import React, { useState, useEffect, useCallback } from "react";

// // ─── DROPDOWN OPTIONS ────────────────────────────────────────────────────────
// const PROPERTY_SUBTYPE_MAP = {
//   non_residential: [
//     { value: "commercial", label: "Commercial" },
//     { value: "industrial", label: "Industrial" },
//     { value: "special", label: "Special" },
//   ],
//   residential: [{ value: "residential", label: "Residential" }],
// };

// const UNIT_TYPE_MAP = {
//   commercial: [
//     { value: "gala", label: "Gala" },
//     { value: "godown", label: "Godown" },
//     { value: "multi_storey", label: "Multi Storey" },
//     { value: "office", label: "Office" },
//     { value: "plot", label: "Plot" },
//     { value: "shop", label: "Shop" },
//     { value: "showroom", label: "Showroom" },
//   ],
//   industrial: [
//     { value: "godown", label: "Godown" },
//     { value: "plot", label: "Plot" },
//     { value: "warehouse", label: "Warehouse" },
//     { value: "factory_light", label: "Factory- Light Machinery" },
//     { value: "factory_heavy", label: "Factory- Heavy Machinery" },
//   ],
//   special: [
//     { value: "banquet_hall", label: "Banquet Hall" },
//     { value: "hospital", label: "Hospital" },
//     { value: "hotel", label: "Hotel" },
//     { value: "marriage_garden", label: "Marriage Garden" },
//     { value: "nursing_home", label: "Nursing Home" },
//     { value: "plot", label: "Plot" },
//     { value: "godown", label: "Godown" },
//     { value: "school", label: "School" },
//     { value: "warehouse", label: "Warehouse" },
//   ],
//   // Residential uses its own key directly
//   residential: [
//     { value: "bungalow", label: "Bungalow" },
//     { value: "flat", label: "Flat" },
//     { value: "plot", label: "Plot" },
//     { value: "row_house", label: "Row House" },
//   ],
// };

// const SHOW_WING_UNIT_TYPES = new Set(["gala", "multi_storey", "office", "shop", "showroom"]);
// const WITH_BASEMENT_PARKING = new Set(["rcc", "composite", "steel_structure"]);

// const STRUCTURE_TYPES = [
//   { value: "rcc", label: "RCC" },
//   { value: "load_bearing", label: "Load Bearing" },
//   { value: "composite", label: "Composite" },
//   { value: "steel_structure", label: "Steel Structure" },
// ];

// const LIVEABLE_FLOOR_OPTIONS = Array.from({ length: 15 }, (_, i) => ({
//   value: String(i + 1), label: String(i + 1),
// }));

// const FLOOR_OPTIONS = [
//   { value: "ground", label: "Ground" },
//   ...Array.from({ length: 20 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
// ];

// const COUNT_OPTIONS = Array.from({ length: 20 }, (_, i) => ({
//   value: String(i + 1), label: String(i + 1),
// }));

// // ─── SCOPED STYLES — no global * or body resets ──────────────────────────────
// const css = `
//   .pf-wrap *, .pf-wrap *::before, .pf-wrap *::after {
//     box-sizing: border-box;
//   }
//   .pf-wrap {
//     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//     font-size: 13px;
//     background: #f5f5f5;
//     color: #222;
//     width: 100%;
//     padding: 16px;
//   }
//   .pf-wrap .pf-card {
//     background: #fff;
//     border: 1px solid #e8e8e8;
//     border-radius: 4px;
//     padding: 16px 20px 20px;
//     margin-bottom: 16px;
//   }
//   .pf-wrap .pf-section-title {
//     color: #e8472b;
//     font-weight: 600;
//     font-size: 14px;
//     margin-bottom: 16px;
//   }

//   /*
//    * pf-row   = rigid row (address rows where all 4 fields are always present)
//    * pf-grid  = flat reflow grid — ALL conditional fields go here so hidden
//    *            fields leave NO gaps; remaining fields auto-fill 4 columns
//    */
//   .pf-wrap .pf-row,
//   .pf-wrap .pf-grid {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 12px 20px;
//     margin-bottom: 14px;
//   }
//   .pf-wrap .pf-row.mb0,
//   .pf-wrap .pf-grid.mb0 { margin-bottom: 0; }

//   .pf-wrap .pf-field {
//     /* exactly 4 per row — gaps: 3 × 20px = 60px */
//     flex: 0 0 calc((100% - 60px) / 4);
//     min-width: 0;
//   }
//   .pf-wrap .pf-field.w2 {
//     flex: 0 0 calc((100% - 60px) / 2 + 20px);
//   }

//   .pf-wrap .pf-label {
//     font-size: 11.5px;
//     color: #555;
//     margin-bottom: 4px;
//     display: flex;
//     align-items: center;
//     gap: 4px;
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }
//   .pf-wrap .pf-label .req { color: #e8472b; }
//   .pf-wrap .pf-label .info-icon {
//     width: 14px; height: 14px;
//     border-radius: 50%;
//     border: 1px solid #aaa;
//     color: #888;
//     font-size: 9px;
//     display: inline-flex;
//     align-items: center;
//     justify-content: center;
//     cursor: default;
//     flex-shrink: 0;
//   }

//   .pf-wrap .pf-input,
//   .pf-wrap .pf-select,
//   .pf-wrap .pf-textarea {
//     border: none;
//     border-bottom: 1px solid #bbb;
//     border-radius: 0;
//     outline: none;
//     background: transparent;
//     font-size: 13px;
//     color: #222;
//     padding: 4px 2px 5px;
//     width: 100%;
//     transition: border-color 0.2s;
//   }
//   .pf-wrap .pf-input:focus,
//   .pf-wrap .pf-select:focus,
//   .pf-wrap .pf-textarea:focus { border-bottom-color: #1677ff; }
//   .pf-wrap .pf-input:disabled,
//   .pf-wrap .pf-select:disabled { color: #555; background: transparent; }

//   .pf-wrap .pf-select {
//     appearance: none;
//     -webkit-appearance: none;
//     background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E");
//     background-repeat: no-repeat;
//     background-position: right 4px center;
//     padding-right: 18px;
//     cursor: pointer;
//   }

//   .pf-wrap .pf-textarea {
//     resize: none;
//     border: 1px solid #d9d9d9;
//     border-radius: 4px;
//     padding: 8px;
//     font-size: 13px;
//     line-height: 1.5;
//   }
//   .pf-wrap .pf-char-count {
//     text-align: right;
//     font-size: 11px;
//     color: #aaa;
//     margin-top: 2px;
//   }
//   .pf-wrap .pf-input-wrap {
//     position: relative;
//     display: flex;
//     align-items: center;
//   }
//   .pf-wrap .pf-input-wrap .pf-prefix {
//     position: absolute;
//     left: 0;
//     color: #aaa;
//     font-size: 13px;
//   }
//   .pf-wrap .pf-input-wrap .pf-input { padding-left: 18px; }
//   .pf-wrap .pf-input-wrap .pf-suffix {
//     position: absolute;
//     right: 4px;
//     color: #1677ff;
//     font-size: 12px;
//     animation: pf-spin 0.8s linear infinite;
//   }
//   @keyframes pf-spin { to { transform: rotate(360deg); } }

//   .pf-wrap .pf-radio-group {
//     display: flex;
//     align-items: center;
//     gap: 20px;
//     padding: 4px 0 5px;
//   }
//   .pf-wrap .pf-radio {
//     display: flex;
//     align-items: center;
//     gap: 5px;
//     cursor: pointer;
//     font-size: 13px;
//   }
//   .pf-wrap .pf-radio input[type="radio"] {
//     accent-color: #e8472b;
//     width: 14px;
//     height: 14px;
//     cursor: pointer;
//   }

//   .pf-wrap .pf-upload-dragger {
//     border: 1px dashed #d9d9d9;
//     border-radius: 4px;
//     padding: 20px;
//     text-align: center;
//     background: #fafafa;
//     cursor: pointer;
//     margin-top: 10px;
//     max-width: 380px;
//   }
//   .pf-wrap .pf-upload-dragger:hover { border-color: #1677ff; }
//   .pf-wrap .pf-upload-icon { font-size: 24px; color: #bbb; margin-bottom: 6px; }
//   .pf-wrap .pf-upload-text { font-size: 12px; color: #888; }
//   .pf-wrap .pf-upload-hint { font-size: 11px; color: #aaa; margin-top: 6px; }

//   .pf-wrap .pf-actions {
//     display: flex;
//     justify-content: flex-end;
//     gap: 12px;
//     padding-top: 16px;
//     border-top: 1px solid #e8e8e8;
//     margin-top: 4px;
//   }
//   .pf-wrap .pf-btn {
//     padding: 6px 24px;
//     border-radius: 4px;
//     font-size: 14px;
//     cursor: pointer;
//     border: 1px solid #d9d9d9;
//     background: #fff;
//     color: #333;
//     transition: all 0.2s;
//   }
//   .pf-wrap .pf-btn:hover { border-color: #1677ff; color: #1677ff; }
//   .pf-wrap .pf-btn.primary { background: #1677ff; color: #fff; border-color: #1677ff; }
//   .pf-wrap .pf-btn.primary:hover { background: #0958d9; }
// `;

// // ─── PRIMITIVE COMPONENTS ────────────────────────────────────────────────────
// const InfoIcon = () => <span className="info-icon" title="Info">i</span>;

// const Label = ({ children, required, info }) => (
//   <span className="pf-label">
//     {children}
//     {required && <span className="req">*</span>}
//     {info && <InfoIcon />}
//   </span>
// );

// const FieldInput = ({
//   label, field, required, info, type = "text", placeholder,
//   form, handleChange, disabled, suffix, maxLength, prefix, className,
// }) => (
//   <div className={`pf-field ${className || ""}`}>
//     <Label required={required} info={info}>{label}</Label>
//     <div className={prefix ? "pf-input-wrap" : undefined}>
//       {prefix && <span className="pf-prefix">{prefix}</span>}
//       <input
//         className="pf-input"
//         type={type}
//         value={form[field] ?? ""}
//         onChange={(e) => handleChange(field, e.target.value)}
//         placeholder={placeholder || ""}
//         disabled={disabled}
//         maxLength={maxLength}
//       />
//       {suffix && <span className="pf-suffix">{suffix}</span>}
//     </div>
//   </div>
// );

// const FieldSelect = ({
//   label, field, required, info, options = [], placeholder,
//   form, handleChange, disabled, className,
// }) => (
//   <div className={`pf-field ${className || ""}`}>
//     <Label required={required} info={info}>{label}</Label>
//     <select
//       className="pf-select"
//       value={form[field] || ""}
//       onChange={(e) => handleChange(field, e.target.value)}
//       disabled={disabled}
//     >
//       <option value="">{placeholder || `Select ${label}`}</option>
//       {options.map((opt) => (
//         <option key={opt.value} value={opt.value}>{opt.label}</option>
//       ))}
//     </select>
//   </div>
// );

// const FieldYesNo = ({ label, field, required, info, form, handleChange, className }) => (
//   <div className={`pf-field ${className || ""}`}>
//     <Label required={required} info={info}>{label}</Label>
//     <div className="pf-radio-group">
//       <label className="pf-radio">
//         <input type="radio" name={field} checked={form[field] === true} onChange={() => handleChange(field, true)} />
//         Yes
//       </label>
//       <label className="pf-radio">
//         <input type="radio" name={field} checked={form[field] === false} onChange={() => handleChange(field, false)} />
//         No
//       </label>
//     </div>
//   </div>
// );

// // ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
// const PropertyDetailsForm = ({ data, editData, onSave, onSaveAndNext, saving }) => {
//   const [form, setForm] = useState({
//     pincode: "",
//     state: "",
//     city: "",
//     district: "",
//     taluka: "",
//     village: "",
//     locality: "",
//     streetName: "",
//     landmark: "",
//     projectSocietyName: "",
//     plotNo: "",
//     propertyType: "non_residential",
//     propertySubType: "",
//     unitType: "",
//     unitNo: "",
//     buildingWingName: "",
//     revenueRecordTypeNumber: "",
//     withinGeoLimit: false,
//     classOfLocality: "",
//     propertyJurisdiction: "",
//     sanctionAuthorityName: "",
//     sanctionUsage: "",
//     actualUsage: "",
//     typeOfStructure: "",
//     plotAreaSqft: "",
//     basementLevels: "",
//     parkingLevels: "",
//     liveableFloors: "",
//     structureConfiguration: "",
//     societyRegistered: false,
//     uniquePropertyId: "",
//     propertyEntranceFacing: "",
//     constructionStatus: "",
//     apfFlag: "",
//     floorNumber: "",
//     propertyTransactionType: "",
//     countOfProperties: "",
//     collateralScope: "",
//     doorPhotoWithNamePlate: false,
//     doorPhotoFile: null,
//     occupiedType: "multiple",
//     areaMeasured: true,
//   });

//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [pincodeOptions, setPincodeOptions] = useState(null);
//   const [toast, setToast] = useState(null);

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   useEffect(() => {
//     const src = editData || data;
//     if (src) setForm((prev) => ({ ...prev, ...src }));
//   }, [editData, data]);

//   const handleChange = useCallback((field, value) => {
//     setForm((prev) => {
//       const u = { ...prev, [field]: value };
//       // Reset downstream fields on type/subtype/unit changes
//       if (field === "propertyType") {
//         u.propertySubType = "";
//         u.unitType = "";
//         u.buildingWingName = "";
//         u.unitNo = "";
//       }
//       if (field === "propertySubType") {
//         u.unitType = "";
//         u.buildingWingName = "";
//         u.unitNo = "";
//       }
//       if (field === "unitType") {
//         u.buildingWingName = "";
//         u.unitNo = "";
//       }
//       if (field === "typeOfStructure" && !WITH_BASEMENT_PARKING.has(value)) {
//         u.basementLevels = "";
//         u.parkingLevels = "";
//       }
//       if (field === "doorPhotoWithNamePlate" && value === false) {
//         u.doorPhotoFile = null;
//       }
//       return u;
//     });
//   }, []);

//   const fetchPincode = useCallback(async (pin) => {
//     if (!/^\d{6}$/.test(pin)) return;
//     setPincodeLoading(true);
//     try {
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
//       const json = await res.json();
//       if (json?.[0]?.Status === "Success" && json[0].PostOffice?.length) {
//         const offices = json[0].PostOffice;
//         const first = offices[0];
//         const uniq = (arr) =>
//           [...new Set(arr.filter(Boolean))].map((v) => ({ value: v, label: v }));
//         setForm((prev) => ({
//           ...prev,
//           state: first.State || "",
//           city: first.District || "",
//           district: first.District || "",
//           taluka: first.Block || prev.taluka,
//         }));
//         setPincodeOptions({
//           talukas: uniq(offices.map((o) => o.Block || o.Division)),
//           villages: uniq(offices.map((o) => o.Name)),
//           localities: uniq(offices.map((o) => o.Name)),
//         });
//         showToast(`${first.District}, ${first.State}`);
//       } else {
//         showToast("Invalid pincode or no data found.", "error");
//         setPincodeOptions(null);
//       }
//     } catch {
//       showToast("Pincode lookup failed.", "error");
//     } finally {
//       setPincodeLoading(false);
//     }
//   }, []);

//   const handlePincodeChange = (val) => {
//     handleChange("pincode", val);
//     if (val.length === 6) fetchPincode(val);
//   };

//   // ── DERIVED STATE ─────────────────────────────────────────────────────────
//   const isResidential = form.propertyType === "residential";
//   const subType = form.propertySubType;                      // "" for residential
//   const unitType = form.unitType;
//   const isSpecial = subType === "special";
//   const isCommercial = subType === "commercial";

//   /**
//    * isPlot: true when ANY property type has plot as unit type
//    * Covers: commercial/industrial/special + "plot", and residential + "plot"
//    */
//   const isPlot = unitType === "plot" && (isResidential || !!subType);

//   /** hidePlotFields: hide structure/floor/area fields when it's a plot */
//   const hidePlotFields = isPlot;

//   const isResidentialLoadBearing =
//     isResidential && form.typeOfStructure === "load_bearing";
//   const hideForLoadBearing = isResidentialLoadBearing;

//   /**
//    * Unit Type options:
//    * - Residential → always use UNIT_TYPE_MAP["residential"]
//    * - Non-residential → look up by subType
//    */
//   const unitTypeOptions = isResidential
//     ? UNIT_TYPE_MAP["residential"]
//     : UNIT_TYPE_MAP[subType] || [];

//   /**
//    * Show Unit Type dropdown when:
//    * - Residential (always show, regardless of subType)
//    * - Non-residential + subType is selected
//    */
//   const showUnitType = isResidential || !!subType;

//   /**
//    * Unit No visibility rules:
//    * - Residential Flat       → show (along with Building/Wing)
//    * - Residential Bungalow   → show only Unit No
//    * - Residential Row House  → show only Unit No
//    * - Residential Plot       → HIDE
//    * - Non-residential (non-special, non-plot) → show
//    */
//   const showUnitNo =
//     (isResidential && ["flat", "bungalow", "row_house"].includes(unitType)) ||
//     (!isResidential && !isSpecial && !isPlot);

//   /**
//    * Building/Wing Name:
//    * - Commercial + wing-type units
//    * - Residential Flat
//    */
//   const showBuildingWing =
//     (isCommercial && SHOW_WING_UNIT_TYPES.has(unitType)) ||
//     (isResidential && unitType === "flat");

//   const showBasementParking =
//     !hidePlotFields && WITH_BASEMENT_PARKING.has(form.typeOfStructure);

//   const hideLivFloors        = hidePlotFields || hideForLoadBearing;
//   const hideStructConfig     = hidePlotFields || hideForLoadBearing;
//   const hideConstructionStatus = hidePlotFields || hideForLoadBearing;
//   const hideFloorNumber      = hidePlotFields || hideForLoadBearing;

//   const showFloorDetails = !hidePlotFields && !hideForLoadBearing;
//   const showAreaCalc     = !hidePlotFields && !hideForLoadBearing;

//   const subTypeOptions = PROPERTY_SUBTYPE_MAP[form.propertyType] || [];

//   const p = { form, handleChange };

//   return (
//     <>
//       <style>{css}</style>
//       {toast && (
//         <div style={{
//           position: "fixed", top: 16, right: 16, zIndex: 9999,
//           background: toast.type === "error" ? "#ff4d4f" : "#52c41a",
//           color: "#fff", padding: "8px 16px", borderRadius: 4,
//           fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//         }}>
//           {toast.msg}
//         </div>
//       )}

//       <div className="pf-wrap">

//         {/* ══ PROPERTY ADDRESS ══════════════════════════════════════════════ */}
//         <div className="pf-card">
//           <div className="pf-section-title">Property Address</div>

//           {/* Pincode · State · City · District */}
//           <div className="pf-row">
//             <div className="pf-field">
//               <Label required info>Pincode</Label>
//               <div className="pf-input-wrap">
//                 <input
//                   className="pf-input"
//                   value={form.pincode}
//                   onChange={(e) => handlePincodeChange(e.target.value)}
//                   placeholder="474001"
//                   maxLength={6}
//                 />
//                 {pincodeLoading && <span className="pf-suffix">⟳</span>}
//               </div>
//             </div>
//             <FieldInput label="State"    field="state"    info disabled placeholder="Auto-filled" {...p} />
//             <FieldInput label="City"     field="city"     info disabled placeholder="Auto-filled" {...p} />
//             <FieldInput label="District" field="district" info required disabled placeholder="Auto-filled" {...p} />
//           </div>

//           {/* Taluka · Village · Locality · Street Name */}
//           <div className="pf-row">
//             <FieldSelect
//               label="Taluka" field="taluka" info
//               options={pincodeOptions?.talukas || (form.taluka ? [{ value: form.taluka, label: form.taluka }] : [])}
//               placeholder="Select Taluka"
//               disabled={!pincodeOptions && !form.taluka}
//               {...p}
//             />
//             <FieldSelect
//               label="Village" field="village" info
//               options={pincodeOptions?.villages || (form.village ? [{ value: form.village, label: form.village }] : [])}
//               placeholder="Select Village"
//               disabled={!pincodeOptions && !form.village}
//               {...p}
//             />
//             <FieldSelect
//               label="Locality" field="locality" info
//               options={pincodeOptions?.localities || (form.locality ? [{ value: form.locality, label: form.locality }] : [])}
//               placeholder="Select Locality"
//               disabled={!pincodeOptions && !form.locality}
//               {...p}
//             />
//             <FieldInput label="Street Name & No." field="streetName" info placeholder="Street Name & No." {...p} />
//           </div>

//           {/* Landmark · Project/Society (span 2) · Plot No */}
//           <div className="pf-row">
//             <FieldInput label="Landmark" field="landmark" info required placeholder="Landmark" {...p} />
//             <FieldInput
//               label="Project/Society/Commercial/Industrial Estate Name"
//               field="projectSocietyName"
//               placeholder="Enter name"
//               className="w2"
//               {...p}
//             />
//             <FieldInput label="Plot No." field="plotNo" required placeholder="Plot / Survey / House No." {...p} />
//           </div>

//           {/* Property Type · Sub Type (hidden for Residential) · Unit Type · Unit No */}
//           {/* Fields auto-arrange via flex — no blank gaps */}
//           <div className="pf-row" style={{ alignItems: "start" }}>
//             {/* Property Type: always shown */}
//             <div className="pf-field">
//               <Label required>Property Type</Label>
//               <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 4 }}>
//                 <label className="pf-radio">
//                   <input
//                     type="radio"
//                     name="propertyType"
//                     checked={form.propertyType === "non_residential"}
//                     onChange={() => handleChange("propertyType", "non_residential")}
//                   />
//                   Non Residential
//                 </label>
//                 <label className="pf-radio">
//                   <input
//                     type="radio"
//                     name="propertyType"
//                     checked={form.propertyType === "residential"}
//                     onChange={() => handleChange("propertyType", "residential")}
//                   />
//                   Residential
//                 </label>
//               </div>
//             </div>

//             {/* Property Sub Type: hidden when Residential */}
//             {!isResidential && (
//               <FieldSelect
//                 label="Property Sub Type"
//                 field="propertySubType"
//                 required
//                 options={subTypeOptions}
//                 placeholder="Select Sub Type"
//                 {...p}
//               />
//             )}

//             {/* Unit Type: shown for Residential always; non-residential when subType selected */}
//             {showUnitType && (
//               <FieldSelect
//                 label="Unit Type"
//                 field="unitType"
//                 required
//                 options={unitTypeOptions}
//                 placeholder="Select Unit Type"
//                 {...p}
//               />
//             )}

//             {/* Unit No: per rules above */}
//             {showUnitNo && (
//               <FieldInput label="Unit No." field="unitNo" placeholder="Unit No." {...p} />
//             )}
//           </div>

//           {/* Building/Wing Name: conditional row */}
//           {showBuildingWing && (
//             <div className="pf-row">
//               <FieldInput
//                 label="Building / Wing Name"
//                 field="buildingWingName"
//                 required
//                 placeholder="Building / Wing Name"
//                 className="w2"
//                 {...p}
//               />
//             </div>
//           )}

//           {/* Revenue Record Type & Number */}
//           <div style={{ marginTop: 4 }}>
//             <Label required>Revenue Record Type &amp; Number</Label>
//             <textarea
//               className="pf-textarea"
//               value={form.revenueRecordTypeNumber ?? ""}
//               onChange={(e) => handleChange("revenueRecordTypeNumber", e.target.value)}
//               rows={2}
//               placeholder="Enter Revenue Record Type & Number"
//               maxLength={1000}
//               style={{ width: "100%", marginTop: 4 }}
//             />
//             <div className="pf-char-count">
//               {(form.revenueRecordTypeNumber || "").length}/1000
//             </div>
//           </div>
//         </div>

//         {/* ══ PROPERTY DETAILS ══════════════════════════════════════════════ */}
//         <div className="pf-card">
//           <div className="pf-section-title">Property Details</div>

//           {/*
//            * SINGLE flat pf-grid — all conditional fields in one container.
//            * Hidden fields are not rendered (removed from DOM), so the next
//            * field naturally fills the empty slot → zero blank gaps, always
//            * packs left-to-right in a strict 4-column grid.
//            */}
//           <div className="pf-grid">
//             <FieldYesNo label="Within Geo Limit" field="withinGeoLimit" info {...p} />
//             <FieldSelect
//               label="Sanction Usage" field="sanctionUsage" required info
//               options={[
//                 { value: "residential", label: "Residential" },
//                 { value: "commercial",  label: "Commercial" },
//                 { value: "industrial",  label: "Industrial" },
//                 { value: "special",     label: "Special" },
//               ]}
//               {...p}
//             />
//             {showBasementParking && (
//               <FieldSelect
//                 label="Basement Levels" field="basementLevels" required info
//                 options={[
//                   { value: "0", label: "0" }, { value: "1", label: "1" },
//                   { value: "2", label: "2" }, { value: "3", label: "3" },
//                 ]}
//                 {...p}
//               />
//             )}
//             <FieldYesNo label="Society Registered" field="societyRegistered" {...p} />

//             <FieldSelect
//               label="APF Flag" field="apfFlag"
//               options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
//               {...p}
//             />
//             <FieldSelect
//               label="Collateral Scope" field="collateralScope" required
//               options={[
//                 { value: "entire_property", label: "Entire Property" },
//                 { value: "part_property", label: "Part Property" },
//               ]}
//               {...p}
//             />
//             <FieldSelect
//               label="Class Of Locality" field="classOfLocality" required
//               options={[
//                 { value: "lower_class", label: "Lower Class" },
//                 { value: "middle_class", label: "Middle Class" },
//                 { value: "posh",    label: "Posh" },
//                 { value: "slum",    label: "Slum" },
//                 { value: "upper_class", label: "Upper Class" },
//                  ]}
//               {...p}
//             />
//             <FieldSelect
//               label="Actual Usage" field="actualUsage" required info
//               options={[
//                 { value: "residential", label: "Residential" },
//                 { value: "commercial",  label: "Commercial" },
//                 { value: "industrial",  label: "Industrial" },
//                 { value: "special",     label: "Special" },
//               ]}
//               {...p}
//             />

//             {showBasementParking && (
//               <FieldSelect
//                 label="Parking Levels" field="parkingLevels" required info
//                 options={[
//                   { value: "0", label: "0" },
//                   { value: "1", label: "1" },
//                   { value: "2", label: "2" },
//                 ]}
//                 {...p}
//               />
//             )}
//             <FieldInput label="Unique Property ID" field="uniquePropertyId" info placeholder="Unique Property ID" {...p} />
//             {!hideFloorNumber && (
//               <FieldSelect label="Floor Number" field="floorNumber" required options={FLOOR_OPTIONS} {...p} />
//             )}
//             <FieldSelect
//               label="Property Jurisdiction" field="propertyJurisdiction" required
//               options={[
//                 { value: "city_development_authority",         label: "City Development Authority" },
//                 { value: "dtcp",         label: "Dtcp" },
//                 { value: "gram_panchayat",       label: "Gram Panchayat" },
//                 { value: "municipality_corp",       label: "Municipality/Corporation" },
//                 { value: "other_development_authority",       label: "Other Development Authority" },
//                 { value: "town_nagar_panchayat", label: "Town/Nagar Panchayat" },
                
                
//               ]}
//               {...p}
//             />

//             {!hidePlotFields && (
//               <FieldSelect label="Type of Structure" field="typeOfStructure" required options={STRUCTURE_TYPES} {...p} />
//             )}
//             {!hideLivFloors && (
//               <FieldSelect label="Livable Floors" field="liveableFloors" required info options={LIVEABLE_FLOOR_OPTIONS} {...p} />
//             )}
//             <FieldSelect
//               label="Property Entrance Facing" field="propertyEntranceFacing"
//               options={[
//                 { value: "north",      label: "North" },
//                 { value: "south",      label: "South" },
//                 { value: "east",       label: "East" },
//                 { value: "west",       label: "West" },
//                 { value: "north_east", label: "North East" },
//                 { value: "north_west", label: "North West" },
//                 { value: "south_east", label: "South East" },
//                 { value: "south_west", label: "South West" },
//               ]}
//               {...p}
//             />
//             <FieldSelect
//               label="Property Transaction Type" field="propertyTransactionType" info
//               options={[
//                { value: "builder_resale",        label: "Builder Resale" },
//   { value: "direct_allotment",      label: "Direct Allotment from Builder" },
//   { value: "direct_dev_auth",       label: "Direct Allotment from Development Authority / Govt Body" },
//   { value: "dev_auth_resale",       label: "Development Authority / Govt Body - Resale" },
//   { value: "direct_society",        label: "Direct Allotment from Society" },
//   { value: "resale_others",         label: "Resale (Others)" },
//   { value: "self_construction",     label: "Self Construction" },
//   { value: "society_resale",        label: "Society Resale" },
//   { value: "crfg_ssvr",             label: "CRFG SSVR" },
//   { value: "crfg_fsvr",             label: "CRFG FSVR" },
//               ]}
//               {...p}
//             />

//             <FieldInput label="Sanction Authority Name" field="sanctionAuthorityName" required placeholder="e.g. KDMC" {...p} />
//             <FieldInput label="Plot Area (Sqft)" field="plotAreaSqft" required type="number" placeholder="0" {...p} />
//             {!hideStructConfig && (
//               <FieldInput label="Structure Configuration" field="structureConfiguration" placeholder="Structure Configuration" {...p} />
//             )}
//             {!hideConstructionStatus && (
//               <FieldSelect
//                 label="Construction Status" field="constructionStatus" required
//                 options={[
//                   { value: "completed",          label: "Completed" },
//                   { value: "under_construction", label: "Under Construction" },
//                 ]}
//                 {...p}
//               />
//             )}

//             <FieldSelect
//               label="Count Of Properties"
//               field="countOfProperties"
//               options={COUNT_OPTIONS}
//               placeholder="Select count"
//               {...p}
//             />
//           </div>

//           {/* Door Photo */}
//           <div style={{ marginTop: 16 }}>
//             <Label>Door Photo With Name Plate</Label>
//             <div className="pf-radio-group" style={{ marginTop: 4 }}>
//               <label className="pf-radio">
//                 <input
//                   type="radio"
//                   name="doorPhotoWithNamePlate"
//                   checked={form.doorPhotoWithNamePlate === true}
//                   onChange={() => handleChange("doorPhotoWithNamePlate", true)}
//                 />
//                 Yes
//               </label>
//               <label className="pf-radio">
//                 <input
//                   type="radio"
//                   name="doorPhotoWithNamePlate"
//                   checked={form.doorPhotoWithNamePlate === false}
//                   onChange={() => handleChange("doorPhotoWithNamePlate", false)}
//                 />
//                 No
//               </label>
//             </div>
//             {form.doorPhotoWithNamePlate === true && (
//               <div>
//                 <div
//                   className="pf-upload-dragger"
//                   onClick={() => document.getElementById("doorPhotoInput").click()}
//                 >
//                   <div className="pf-upload-icon">↑</div>
//                   <div className="pf-upload-text">Drag &amp; Drop / Upload Photo *</div>
//                   {form.doorPhotoFile && (
//                     <div style={{ fontSize: 12, color: "#52c41a", marginTop: 4 }}>
//                       ✓ {form.doorPhotoFile.name}
//                     </div>
//                   )}
//                 </div>
//                 <input
//                   id="doorPhotoInput"
//                   type="file"
//                   accept=".jpg,.jpeg,.png"
//                   style={{ display: "none" }}
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     if (!file) return;
//                     const ok = ["image/jpeg", "image/jpg", "image/png"].includes(file.type);
//                     if (!ok) { showToast("Only JPEG, JPG, PNG supported.", "error"); return; }
//                     if (file.size > 500 * 1024) { showToast("Max file size is 500 KB.", "error"); return; }
//                     handleChange("doorPhotoFile", file);
//                   }}
//                 />
//                 <p className="pf-upload-hint">
//                   * Supported file formats are JPEG, JPG, PNG (Maximum file size 500 KB)
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ══ FLOOR DETAILS ═════════════════════════════════════════════════ */}
//         {showFloorDetails && (
//           <div className="pf-card">
//             <div className="pf-section-title">Floor Details</div>
//             <Label required>Occupied Type</Label>
//             <div className="pf-radio-group" style={{ marginTop: 6 }}>
//               <label className="pf-radio">
//                 <input
//                   type="radio"
//                   name="occupiedType"
//                   checked={form.occupiedType === "multiple"}
//                   onChange={() => handleChange("occupiedType", "multiple")}
//                 />
//                 Multiple Occupancy
//               </label>
//               <label className="pf-radio">
//                 <input
//                   type="radio"
//                   name="occupiedType"
//                   checked={form.occupiedType === "single"}
//                   onChange={() => handleChange("occupiedType", "single")}
//                 />
//                 Single Occupancy
//               </label>
//             </div>
//           </div>
//         )}

//         {/* ══ AREA CALCULATOR ═══════════════════════════════════════════════ */}
//         {showAreaCalc && (
//           <div className="pf-card">
//             <div className="pf-section-title">Area Calculator</div>
//             <Label required>Area Measured</Label>
//             <div className="pf-radio-group" style={{ marginTop: 6 }}>
//               <label className="pf-radio">
//                 <input
//                   type="radio"
//                   name="areaMeasured"
//                   checked={form.areaMeasured === true}
//                   onChange={() => handleChange("areaMeasured", true)}
//                 />
//                 Yes
//               </label>
//               <label className="pf-radio">
//                 <input
//                   type="radio"
//                   name="areaMeasured"
//                   checked={form.areaMeasured === false}
//                   onChange={() => handleChange("areaMeasured", false)}
//                 />
//                 No
//               </label>
//             </div>
//           </div>
//         )}

//         {/* ══ ACTION BUTTONS ════════════════════════════════════════════════ */}
//         <div className="pf-actions">
//           <button
//             className="pf-btn"
//             onClick={() => onSave?.("propertyDetails", form)}
//             disabled={saving}
//           >
//             {saving ? "Saving…" : "Save"}
//           </button>
//           <button
//             className="pf-btn primary"
//             onClick={() => onSaveAndNext?.("propertyDetails", form)}
//             disabled={saving}
//           >
//             {saving ? "Saving…" : "Save & Next"}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PropertyDetailsForm;




























// PropertyDetailsForm.jsx — Fixed: auto structure config, dynamic floor checkboxes (basement+parking+liveable)
// PropertyDetailsForm.jsx — Updated: Landmark as input, Basement/Parking/Liveable as number inputs (always visible), Single Occupancy inline fields
import React, { useState, useEffect, useCallback, useRef } from "react";

const PROPERTY_SUBTYPE_MAP = {
  non_residential: [
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
    { value: "special", label: "Special" },
  ],
  residential: [{ value: "residential", label: "Residential" }],
};
const UNIT_TYPE_MAP = {
  commercial: [
    { value: "gala", label: "Gala" }, { value: "godown", label: "Godown" },
    { value: "multi_storey", label: "Multi Storey" }, { value: "office", label: "Office" },
    { value: "plot", label: "Plot" }, { value: "shop", label: "Shop" },
    { value: "showroom", label: "Showroom" },
  ],
  industrial: [
    { value: "godown", label: "Godown" }, { value: "plot", label: "Plot" },
    { value: "warehouse", label: "Warehouse" },
    { value: "factory_light", label: "Factory- Light Machinery" },
    { value: "factory_heavy", label: "Factory- Heavy Machinery" },
  ],
  special: [
    { value: "banquet_hall", label: "Banquet Hall" }, { value: "hospital", label: "Hospital" },
    { value: "hotel", label: "Hotel" }, { value: "marriage_garden", label: "Marriage Garden" },
    { value: "nursing_home", label: "Nursing Home" }, { value: "plot", label: "Plot" },
    { value: "godown", label: "Godown" }, { value: "school", label: "School" },
    { value: "warehouse", label: "Warehouse" },
  ],
  residential: [
    { value: "bungalow", label: "Bungalow" }, { value: "flat", label: "Flat" },
    { value: "plot", label: "Plot" }, { value: "row_house", label: "Row House" },
  ],
};
const SHOW_WING_UNIT_TYPES = new Set(["gala", "multi_storey", "office", "shop", "showroom"]);
const WITH_BASEMENT_PARKING = new Set(["rcc", "composite", "steel_structure"]);
const STRUCTURE_TYPES = [
  { value: "rcc", label: "RCC" }, { value: "load_bearing", label: "Load Bearing" },
  { value: "composite", label: "Composite" }, { value: "steel_structure", label: "Steel Structure" },
];
const COUNT_OPTIONS = Array.from({ length: 20 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
const SPACE_TYPES = [
  { value: "cabin", label: "Cabin" },
  { value: "bedroom", label: "Bedroom" }, { value: "bathroom", label: "Bathroom" },
  { value: "toilet", label: "Toilet" }, { value: "kitchen", label: "Kitchen" },
  { value: "living_room", label: "Living Room" }, { value: "dining_room", label: "Dining Room" },
  { value: "balcony", label: "Balcony" }, { value: "garage", label: "Garage" },
  { value: "store_room", label: "Store Room" }, { value: "servant_room", label: "Servant Room" },
  { value: "terrace", label: "Terrace" }, { value: "lobby", label: "Lobby" },
  { value: "hall", label: "Hall" }, { value: "pooja_room", label: "Pooja Room" },
  { value: "study_room", label: "Study Room" },
];
const OCCUPIED_BY_OPTIONS = [
  { value: "occupied_by_seller", label: "Occupied By Seller" },
  { value: "occupied_by_tenant", label: "Occupied By Tenant" },
  { value: "occupied_by_third_party", label: "Occupied By Third Party" },
  { value: "self_occupied", label: "Self Occupied" },
  { value: "under_construction", label: "Under Construction" },
  { value: "vacant", label: "Vacant" },
  { value: "under_renovation", label: "Under Renovation" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getFloorLabel(key) {
  if (key.startsWith("basement_")) {
    const n = key.replace("basement_", "");
    return `Basement ${n}`;
  }
  if (key.startsWith("parking_")) {
    const n = key.replace("parking_", "");
    return `Parking ${n}`;
  }
  if (key === "ground") return "Ground Floor";
  const n = parseInt(key);
  return `Floor ${n}`;
}

function getAllFloorKeys(basementLevels, parkingLevels, liveableFloors, includeGroundFloor = true) {
  const b = parseInt(basementLevels) || 0;
  const p = parseInt(parkingLevels) || 0;
  const f = parseInt(liveableFloors) || 0;
  const keys = [];
  for (let i = b; i >= 1; i--) keys.push(`basement_${i}`);
  for (let i = p; i >= 1; i--) keys.push(`parking_${i}`);
  if (f > 0) {
    if (includeGroundFloor) {
      keys.push("ground");
      for (let i = 1; i < f; i++) keys.push(String(i));
    } else {
      for (let i = 1; i <= f; i++) keys.push(String(i));
    }
  }
  return keys;
}

function computeStructureConfig(basementLevels, parkingLevels, liveableFloors, isLB) {
  if (isLB) {
    const f = parseInt(liveableFloors) || 0;
    if (f <= 0) return "";
    return f === 1 ? "G" : `G+${f - 1}`;
  }
  const b = parseInt(basementLevels) || 0;
  const p = parseInt(parkingLevels) || 0;
  const f = parseInt(liveableFloors) || 0;
  const parts = [];
  if (b > 0) parts.push(b === 1 ? "B" : `${b}B`);
  if (p > 0) parts.push(p === 1 ? "P" : `${p}P`);
  if (f > 0) parts.push(String(f));
  return parts.join("+");
}

function isLoadBearingStructure(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_") === "load_bearing";
}

let _uid = 1000;
const uid = () => ++_uid;

const getSpaceLabel = (value) => SPACE_TYPES.find((s) => s.value === value)?.label || value || "Area";
const safeCount = (value) => Math.max(0, parseInt(value, 10) || 0);

function buildAreaRowsForUnit(unit, existingAreas = []) {
  const existingBySource = new Map(existingAreas.filter((a) => a.sourceKey).map((a) => [a.sourceKey, a]));
  const existingManual = existingAreas.filter((a) => !a.generated);
  const rows = [];
  const liveSourceKeys = new Set();

  (unit.spaces || []).forEach((space) => {
    if (!space.spaceType) return;
    const count = safeCount(space.count);
    const label = getSpaceLabel(space.spaceType);
    for (let i = 1; i <= count; i += 1) {
      const sourceKey = `space:${space.id}:${i}`;
      liveSourceKeys.add(sourceKey);
      const prev = existingBySource.get(sourceKey) || {};
      rows.push({
        ...prev,
        id: prev.id || uid(),
        sourceKey,
        sourceBaseKey: sourceKey,
        generated: true,
        name: count > 1 ? `${label}-${i}` : label,
        length: prev.length || "",
        width: prev.width || "",
        loadingFactor: prev.loadingFactor || "",
      });
      existingManual
        .filter((a) => a.sourceBaseKey === sourceKey)
        .forEach((a) => rows.push(a));
    }
  });
  existingManual.filter((a) => !a.sourceBaseKey).forEach((a) => rows.push(a));
  return rows.filter((a) => a.generated || !a.sourceBaseKey || liveSourceKeys.has(a.sourceBaseKey));
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  .pf-wrap *, .pf-wrap *::before, .pf-wrap *::after { box-sizing: border-box; }
  .pf-wrap {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px; background: #f5f5f5; color: #111; width: 100%; padding: 16px;
  }
  .pf-wrap .pf-card {
    background: #fff; border: 1px solid #e8e8e8; border-radius: 4px;
    padding: 16px 20px 20px; margin-bottom: 16px;
  }
  .pf-wrap .pf-section-title { color: #e8472b; font-weight: 600; font-size: 14px; margin-bottom: 16px; }

  .pf-wrap .pf-addr-row {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 18px 24px; margin-bottom: 20px; align-items: start;
  }
  .pf-wrap .pf-addr-row .span2 { grid-column: span 2; }

  .pf-wrap .pf-det-grid {
    display: flex; flex-wrap: wrap; gap: 20px 24px; align-items: start;
  }
  .pf-wrap .pf-det-grid .pf-item {
    flex: 0 0 calc((100% - 72px) / 4); min-width: 0;
  }

  .pf-wrap .pf-label {
    font-size: 14px; color: #444; font-weight: 500; margin-bottom: 5px;
    display: flex; align-items: center; gap: 4px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .pf-wrap .pf-label .req { color: #e8472b; }
  .pf-wrap .pf-label .info-icon {
    width: 14px; height: 14px; border-radius: 50%; border: 1px solid #aaa;
    color: #888; font-size: 9px; display: inline-flex; align-items: center;
    justify-content: center; cursor: default; flex-shrink: 0;
  }

  .pf-wrap .pf-input, .pf-wrap .pf-select {
    border: none; border-bottom: 0.75px solid #bbb; border-radius: 0; outline: none;
    background: transparent; font-size: 13.5px; color: #111; font-weight: 400;
    padding: 3px 2px 6px; width: 100%; transition: border-color 0.2s;
  }
  .pf-wrap .pf-input::placeholder { color: #bbb; font-size: 12px; font-weight: 400; }
  .pf-wrap .pf-input:focus, .pf-wrap .pf-select:focus { border-bottom-color: #1677ff; }
  .pf-wrap .pf-input:disabled, .pf-wrap .pf-select:disabled { color: #555; background: transparent; }
  .pf-wrap .pf-select {
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 4px center;
    padding-right: 18px; cursor: pointer;
  }
  .pf-wrap .pf-textarea-box {
    border: 1px solid #d9d9d9; border-radius: 4px; padding: 8px;
    font-size: 13.5px; color: #111; resize: none; line-height: 1.5;
    outline: none; width: 100%;
  }
  .pf-wrap .pf-textarea-box::placeholder { color: #bbb; font-size: 12px; }
  .pf-wrap .pf-textarea-box:focus { border-color: #1677ff; }
  .pf-wrap .pf-char-count { text-align: right; font-size: 11px; color: #aaa; margin-top: 2px; }
  .pf-wrap .pf-input-wrap { position: relative; display: flex; align-items: center; }
  .pf-wrap .pf-input-wrap .pf-suffix { position: absolute; right: 4px; color: #1677ff; font-size: 12px; animation: pf-spin 0.8s linear infinite; }
  @keyframes pf-spin { to { transform: rotate(360deg); } }

  .pf-wrap .pf-radio-group { display: flex; align-items: center; gap: 20px; padding: 3px 0 4px; }
  .pf-wrap .pf-radio { display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 13px; color: #111; }
  .pf-wrap .pf-radio input[type="radio"] { accent-color: #e8472b; width: 14px; height: 14px; cursor: pointer; }

  .pf-wrap .pf-upload-dragger {
    border: 1px dashed #d9d9d9; border-radius: 4px; padding: 20px; text-align: center;
    background: #fafafa; cursor: pointer; margin-top: 10px; max-width: 380px;
  }
  .pf-wrap .pf-upload-dragger:hover { border-color: #1677ff; }
  .pf-wrap .pf-upload-icon { font-size: 24px; color: #bbb; margin-bottom: 6px; }
  .pf-wrap .pf-upload-text { font-size: 12px; color: #888; }
  .pf-wrap .pf-upload-hint { font-size: 11px; color: #aaa; margin-top: 6px; }

  .pf-wrap .pf-actions {
    display: flex; justify-content: flex-end; gap: 12px;
    padding-top: 16px; border-top: 1px solid #e8e8e8; margin-top: 4px;
  }
  .pf-wrap .pf-btn {
    padding: 6px 24px; border-radius: 4px; font-size: 14px; cursor: pointer;
    border: 1px solid #d9d9d9; background: #fff; color: #333; transition: all 0.2s;
  }
  .pf-wrap .pf-btn:hover { border-color: #1677ff; color: #1677ff; }
  .pf-wrap .pf-btn.primary { background: #1b3a6b; color: #fff; border-color: #1677ff; }
  .pf-wrap .pf-btn.primary:hover { background: #1b3a6b; }
  .pf-wrap .pf-btn.danger { color: #ff4d4f; border-color: #ffa39e; }
  .pf-wrap .pf-btn.danger:hover { background: #fff2f0; border-color: #ff4d4f; }

  .pf-wrap .pf-inline-toast {
    padding: 10px 16px; border-radius: 4px; margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px; font-size: 13px;
  }
  .pf-wrap .pf-inline-toast.success { background: #f6ffed; border: 1px solid #b7eb8f; color: #389e0d; }
  .pf-wrap .pf-inline-toast.error   { background: #fff2f0; border: 1px solid #ffa39e; color: #cf1322; }
  .pf-wrap .pf-toast-close {
    margin-left: auto; background: none; border: none; cursor: pointer;
    color: inherit; font-size: 18px; line-height: 1; padding: 0; opacity: 0.7;
  }

  /* Floor Number Dropdown */
  .pf-wrap .pf-floor-select-wrap { position: relative; }
  .pf-wrap .pf-floor-trigger {
    width: 100%; border: none; border-bottom: 0.75px solid #bbb; background: transparent;
    min-height: 29px; padding: 3px 20px 6px 2px; text-align: left; cursor: pointer;
    color: #111; font-size: 13.5px; position: relative;
  }
  .pf-wrap .pf-floor-trigger::after {
    content: ""; position: absolute; right: 4px; top: 12px; border-left: 5px solid transparent;
    border-right: 5px solid transparent; border-top: 6px solid #999;
  }
  .pf-wrap .pf-floor-trigger.placeholder { color: #bbb; font-size: 12px; }
  .pf-wrap .pf-floor-menu {
    position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 20;
    max-height: 230px; overflow: auto; background: #fff; border: 1px solid #bfbfbf;
    box-shadow: 0 2px 6px rgba(0,0,0,0.18);
  }
  .pf-wrap .pf-floor-menu-actions {
    position: sticky; bottom: 0; display: flex; justify-content: flex-end; gap: 8px;
    background: #fff; border-top: 1px solid #e8e8e8; padding: 6px 8px;
  }
  .pf-wrap .pf-floor-menu-actions button {
    border: 1px solid #1677ff; border-radius: 4px; background: #fff; color: #1677ff;
    font-size: 12px; padding: 3px 10px; cursor: pointer;
  }
  .pf-wrap .pf-floor-menu-actions button:hover { background: #e6f0ff; }
  .pf-wrap .pf-floor-checks { display: flex; flex-direction: column; gap: 0; padding: 0; }
  .pf-wrap .pf-floor-chk {
    display: flex; align-items: center; gap: 7px; cursor: pointer; font-size: 13px; color: #111;
    background: #fff; border: none; border-bottom: 1px solid #e8e8e8; border-radius: 0;
    padding: 8px 10px; transition: all 0.15s;
  }
  .pf-wrap .pf-floor-chk:hover { border-color: #1677ff; background: #eef4ff; }
  .pf-wrap .pf-floor-chk.checked { background: #e6f0ff; border-color: #1677ff; color: #1677ff; font-weight: 500; }
  .pf-wrap .pf-floor-chk.basement { border-left: 3px solid #722ed1; }
  .pf-wrap .pf-floor-chk.basement.checked { background: #f9f0ff; border-color: #722ed1; color: #722ed1; }
  .pf-wrap .pf-floor-chk.parking { border-left: 3px solid #fa8c16; }
  .pf-wrap .pf-floor-chk.parking.checked { background: #fff7e6; border-color: #fa8c16; color: #d46b08; }
  .pf-wrap .pf-floor-chk input[type="checkbox"] { accent-color: #1677ff; width: 14px; height: 14px; cursor: pointer; }

  .pf-wrap .pf-hint-text { font-size: 11.5px; color: #aaa; padding: 4px 0; }

  /* Single Occupancy inline fields */
  .pf-wrap .pf-single-occ-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px 24px;
    margin-top: 16px; padding: 16px; background: #f9f9f9;
    border: 1px solid #e8e8e8; border-radius: 4px;
  }
  .pf-wrap .pf-single-occ-row .pf-occupancy-field label {
    display: block; font-size: 13px; color: #444; font-weight: 500; margin-bottom: 5px;
  }

  .pf-wrap .pf-divider { height: 1px; background: #f0f0f0; margin: 18px 0; }

  .pf-wrap .pf-split { display: flex; gap: 0; min-height: 240px; margin-top: 16px; }
  .pf-wrap .pf-split-left {
    width: 230px; flex-shrink: 0; border: 1px solid #e8e8e8;
    border-right: none; border-radius: 4px 0 0 4px; overflow: hidden; background: #fff;
  }
  .pf-wrap .pf-split-right {
    flex: 1; border: 1px solid #e8e8e8; border-radius: 0 4px 4px 0;
    padding: 16px; background: #fff; overflow: auto; min-width: 0;
  }
  .pf-wrap .pf-acc-hdr {
    padding: 9px 12px; background: #f7f7f7; border-bottom: 1px solid #e8e8e8;
    display: flex; justify-content: space-between; align-items: center;
    cursor: pointer; font-size: 13px; font-weight: 600; color: #333; user-select: none;
  }
  .pf-wrap .pf-acc-hdr:hover { background: #eef2ff; }
  .pf-wrap .pf-acc-hdr.open { background: #e6f0ff; color: #1677ff; border-left: 3px solid #1677ff; }
  .pf-wrap .pf-acc-hdr.basement-hdr { border-left: 3px solid #722ed1; }
  .pf-wrap .pf-acc-hdr.basement-hdr.open { background: #f9f0ff; color: #722ed1; border-left-color: #722ed1; }
  .pf-wrap .pf-acc-hdr.parking-hdr { border-left: 3px solid #fa8c16; }
  .pf-wrap .pf-acc-hdr.parking-hdr.open { background: #fff7e6; color: #d46b08; border-left-color: #fa8c16; }
  .pf-wrap .pf-acc-unit {
    padding: 7px 12px 7px 20px; background: #fff; border-bottom: 1px solid #f0f0f0;
    display: flex; justify-content: space-between; align-items: center;
    cursor: pointer; font-size: 12px; color: #333;
  }
  .pf-wrap .pf-acc-unit:hover { background: #f5f5f5; }
  .pf-wrap .pf-acc-unit.sel { background: #1677ff; color: #fff; }
  .pf-wrap .pf-acc-addmore { padding: 8px 12px 8px 20px; background: #fff; border-bottom: 1px solid #e8e8e8; }
  .pf-wrap .pf-link-btn {
    background: none; border: 1px solid #1677ff; color: #1677ff; border-radius: 4px;
    padding: 4px 10px; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
  }
  .pf-wrap .pf-link-btn:hover { background: #e6f0ff; }
  .pf-wrap .pf-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 200px; color: #aaa; text-align: center; gap: 6px;
  }
  .pf-wrap .pf-unit-header { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .pf-wrap .pf-space-tbl { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  .pf-wrap .pf-space-tbl th {
    background: #f7f7f7; padding: 7px 10px; text-align: left; font-size: 12px; font-weight: 600; border: 1px solid #e8e8e8;
  }
  .pf-wrap .pf-space-tbl td { padding: 5px 8px; border: 1px solid #e8e8e8; vertical-align: top; }
  .pf-wrap .pf-del-btn { background: none; border: none; cursor: pointer; color: #ff4d4f; font-size: 18px; line-height: 1; padding: 2px; }
  .pf-wrap .pf-form-footer {
    display: flex; justify-content: flex-end; gap: 8px;
    margin-top: 14px; border-top: 1px solid #f0f0f0; padding-top: 14px;
  }
  .pf-wrap .pf-occupancy-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin: 14px 0 10px;
  }
  .pf-wrap .pf-occupancy-field label {
    display: block; font-size: 12px; color: #444; font-weight: 500; margin-bottom: 4px;
  }
  .pf-wrap .pf-remarks-row { display: flex; align-items: center; gap: 8px; margin: 10px 0 14px; }
  .pf-wrap .pf-remarks-row label { font-size: 13px; color: #555; white-space: nowrap; }
  .pf-wrap .pf-remarks-input {
    flex: 1; border: none; border-bottom: 0.75px solid #bbb; outline: none;
    background: transparent; font-size: 13.5px; color: #111; padding: 3px 2px 4px; min-width: 0;
  }
  .pf-wrap .pf-remarks-input:focus { border-bottom-color: #1677ff; }
  .pf-wrap .pf-area-tbl { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px; }
  .pf-wrap .pf-area-tbl th {
    background: #f7f7f7; padding: 7px 6px; text-align: center; font-weight: 600; border: 1px solid #e8e8e8; font-size: 11px; white-space: nowrap;
  }
  .pf-wrap .pf-area-tbl td { padding: 5px 4px; border: 1px solid #e8e8e8; text-align: center; }
  .pf-wrap .pf-area-tbl tr.manual-area-row td { background: #fff; }
  .pf-wrap .pf-totals {
    padding: 10px 4px 0; font-size: 12px; border-top: 1px solid #e8e8e8;
    display: flex; justify-content: flex-end; gap: 24px;
  }
  .pf-wrap .pf-total-item { display: flex; flex-direction: column; gap: 2px; text-align: right; }
  .pf-wrap .pf-total-label { color: #888; font-size: 11px; }
  .pf-wrap .pf-total-val { font-weight: 600; font-size: 13px; color: #111; }

  .pf-wrap .pf-floor-type-tag {
    font-size: 10px; padding: 1px 6px; border-radius: 10px; font-weight: 600;
    margin-left: 4px; vertical-align: middle;
  }
  .pf-wrap .pf-floor-type-tag.b { background: #f9f0ff; color: #722ed1; }
  .pf-wrap .pf-floor-type-tag.p { background: #fff7e6; color: #d46b08; }
  .pf-wrap .pf-floor-type-tag.f { background: #e6f0ff; color: #1677ff; }

  @media (max-width: 900px) {
    .pf-wrap .pf-addr-row { grid-template-columns: repeat(2, 1fr); gap: 12px 16px; }
    .pf-wrap .pf-det-grid .pf-item { flex: 0 0 calc((100% - 24px) / 2); }
    .pf-wrap .pf-single-occ-row { grid-template-columns: 1fr; gap: 12px; }
    .pf-wrap .pf-occupancy-grid { grid-template-columns: 1fr; gap: 12px; }
    .pf-wrap .pf-split { flex-direction: column; }
    .pf-wrap .pf-split-left { width: 100%; border-right: 1px solid #e8e8e8; border-bottom: none; border-radius: 4px 4px 0 0; }
    .pf-wrap .pf-split-right { border-radius: 0 0 4px 4px; }
    .pf-wrap .pf-unit-header { grid-template-columns: 1fr; gap: 12px; }
    .pf-wrap .pf-actions { flex-direction: column; gap: 8px; }
    .pf-wrap .pf-btn { width: 100%; text-align: center; }
  }

  @media (max-width: 500px) {
    .pf-wrap .pf-addr-row { grid-template-columns: 1fr; }
    .pf-wrap .pf-addr-row .span2 { grid-column: span 1; }
    .pf-wrap .pf-det-grid .pf-item { flex: 0 0 100%; }
  }
`;

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
const InfoIcon = () => <span className="info-icon" title="Info">i</span>;
const Label = ({ children, required, info }) => (
  <span className="pf-label">
    {children}
    {required && <span className="req"> *</span>}
    {info && <InfoIcon />}
  </span>
);
const AF = ({ label, required, info, children, className }) => (
  <div className={className}>
    <Label required={required} info={info}>{label}</Label>
    {children}
  </div>
);
const DF = ({ label, required, info, children }) => (
  <div className="pf-item">
    <Label required={required} info={info}>{label}</Label>
    {children}
  </div>
);
const Inp = ({ field, form, onChange, placeholder, type = "text", disabled, maxLength, readOnly, style }) => (
  <input className="pf-input" type={type} value={form[field] ?? ""}
    onChange={(e) => onChange(field, e.target.value)}
    placeholder={placeholder || ""} disabled={disabled} maxLength={maxLength}
    readOnly={readOnly} style={style} />
);
const Sel = ({ field, form, onChange, options = [], placeholder, disabled }) => (
  <select className="pf-select" value={form[field] || ""}
    onChange={(e) => onChange(field, e.target.value)} disabled={disabled}>
    <option value="">{placeholder || "Select"}</option>
    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);
const YesNo = ({ field, form, onChange }) => (
  <div className="pf-radio-group">
    <label className="pf-radio"><input type="radio" name={field} checked={form[field] === true} onChange={() => onChange(field, true)} /> Yes</label>
    <label className="pf-radio"><input type="radio" name={field} checked={form[field] === false} onChange={() => onChange(field, false)} /> No</label>
  </div>
);

function floorKeyType(key) {
  if (key.startsWith("basement_")) return "basement";
  if (key.startsWith("parking_")) return "parking";
  return "floor";
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const PropertyDetailsForm = ({ data, editData, extractedData, onSave, onSaveAndNext, saving }) => {
  const [form, setForm] = useState({
    pincode: "", state: "", city: "", district: "", taluka: "", village: "",
    locality: "", streetName: "", landmark: "", projectSocietyName: "", plotNo: "",
    propertyType: "non_residential", propertySubType: "", unitType: "", unitNo: "",
    buildingWingName: "", revenueRecordTypeNumber: "",
    withinGeoLimit: false, classOfLocality: "", propertyJurisdiction: "",
    sanctionAuthorityName: "", approvedPlanNo: "", sanctionUsage: "", actualUsage: "",
    typeOfStructure: "", plotAreaSqft: "", basementLevels: "", parkingLevels: "",
    liveableFloors: "", structureConfiguration: "", societyRegistered: false,
    uniquePropertyId: "", propertyEntranceFacing: "", constructionStatus: "",
    apfFlag: "", apfId: "", propertyTransactionType: "", countOfProperties: "",
    collateralScope: "", ownershipType: "", doorPhotoWithNamePlate: false,
    doorPhotoFile: null, occupiedType: "multiple", areaMeasured: true,
    societyRegisteredFile: null,
    // Single occupancy fields (applied to whole property, not per-unit)
    singleOccupiedBy: "", singleOccupantName: "", singleOccupiedSince: "",
  });

  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeOptions, setPincodeOptions] = useState(null);
  const [selectedFloors, setSelectedFloors] = useState([]);
  const [floorDetails, setFloorDetails] = useState({});
  const [openFloor, setOpenFloor] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [areaData, setAreaData] = useState({});
  const [openAreaFloor, setOpenAreaFloor] = useState(null);
  const [selectedAreaUnit, setSelectedAreaUnit] = useState(null);
  const [floorDropdownOpen, setFloorDropdownOpen] = useState(false);
  const floorDropdownRef = useRef(null);
  const hydratingSavedFloorsRef = useRef(false);

  useEffect(() => {
    const src = (data && Object.keys(data).length > 0) ? data : (editData || {});
    const autofillData = extractedData || {};
    
    // Only return if both are totally empty and we have no state to initialize
    if (Object.keys(src).length === 0 && Object.keys(autofillData).length === 0) return;

    hydratingSavedFloorsRef.current = true;
    
    setForm((p) => ({ ...p, ...src, ...autofillData }));

    if (Array.isArray(src.selectedFloors)) {
      setSelectedFloors(src.selectedFloors);
    }
    if (src.floorDetails && typeof src.floorDetails === "object") {
      setFloorDetails(src.floorDetails);
    }
    if (src.areaData && typeof src.areaData === "object") {
      setAreaData(src.areaData);
    }

    setTimeout(() => {
      hydratingSavedFloorsRef.current = false;
    }, 0);
  }, [editData, data]);

  useEffect(() => {
    const closeFloorDropdown = (event) => {
      if (!floorDropdownRef.current?.contains(event.target)) setFloorDropdownOpen(false);
    };
    document.addEventListener("mousedown", closeFloorDropdown);
    return () => document.removeEventListener("mousedown", closeFloorDropdown);
  }, []);

  // ── HANDLE CHANGE ─────────────────────────────────────────────────────────
  const handleChange = useCallback((field, value) => {
    setForm((prev) => {
      const u = { ...prev, [field]: value };
      if (field === "propertyType") {
        u.propertySubType = ""; u.unitType = ""; u.buildingWingName = ""; u.unitNo = "";
        u.liveableFloors = ""; u.structureConfiguration = ""; u.typeOfStructure = "";
        u.basementLevels = ""; u.parkingLevels = "";
      }
      if (field === "propertySubType") { u.unitType = ""; u.buildingWingName = ""; u.unitNo = ""; }
      if (field === "unitType") { u.buildingWingName = ""; u.unitNo = ""; }
      if (field === "typeOfStructure") {
        u.liveableFloors = ""; u.structureConfiguration = "";
        if (!WITH_BASEMENT_PARKING.has(value)) {
          u.basementLevels = ""; u.parkingLevels = "";
        }
      }
      // Auto-compute Structure Configuration
      if (["typeOfStructure", "basementLevels", "parkingLevels", "liveableFloors"].includes(field)) {
        const structType = field === "typeOfStructure" ? value : u.typeOfStructure;
        const isLB = isLoadBearingStructure(structType);
        const bl = field === "basementLevels" ? value : u.basementLevels;
        const pl = field === "parkingLevels" ? value : u.parkingLevels;
        const lf = field === "liveableFloors" ? value : u.liveableFloors;
        if (structType) {
          u.structureConfiguration = computeStructureConfig(bl, pl, lf, isLB);
        }
      }
      if (field === "doorPhotoWithNamePlate" && value === false) u.doorPhotoFile = null;
      if (field === "societyRegistered" && value === false) u.societyRegisteredFile = null;
      return u;
    });
  }, []);

  // ── PINCODE ────────────────────────────────────────────────────────────────
  const fetchPincode = useCallback(async (pin) => {
    if (!/^\d{6}$/.test(pin)) return;
    setPincodeLoading(true);
    let success = false;
    
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const json = await res.json();
      if (json?.[0]?.Status === "Success" && json[0].PostOffice?.length) {
        const offices = json[0].PostOffice; const first = offices[0];
        const uniq = (arr) => [...new Set(arr.filter(Boolean))].map((v) => ({ value: v, label: v }));
        const officeNames = offices.map((o) => o.Name);
        setForm((p) => ({
          ...p,
          state: first.State || "",
          city: first.District || "",
          district: first.District || "",
          taluka: first.Block || p.taluka,
        }));
        setPincodeOptions({
          talukas: uniq(offices.map((o) => o.Block || o.Division)),
          villages: uniq(officeNames),
          localities: uniq(officeNames),
          streets: uniq(officeNames),
        });
        showToast(`${first.District}, ${first.State}`);
        success = true;
      }
    } catch (e) {
      console.log("Primary pincode API failed, trying fallback...");
    }

    if (!success) {
      try {
        const fallbackRes = await fetch(`https://api.zippopotam.us/IN/${pin}`);
        if (fallbackRes.ok) {
          const fallbackJson = await fallbackRes.json();
          if (fallbackJson && fallbackJson.places && fallbackJson.places.length > 0) {
            const firstPlace = fallbackJson.places[0];
            const uniq = (arr) => [...new Set(arr.filter(Boolean))].map((v) => ({ value: v, label: v }));
            const placeNames = fallbackJson.places.map(p => p["place name"]);
            
            setForm((p) => ({
              ...p,
              state: firstPlace.state || "",
              city: firstPlace["place name"] || "",
              district: firstPlace["place name"] || "",
            }));
            
            setPincodeOptions({
              talukas: [],
              villages: uniq(placeNames),
              localities: uniq(placeNames),
              streets: uniq(placeNames),
            });
            showToast(`${firstPlace["place name"]}, ${firstPlace.state}`);
            success = true;
          }
        }
      } catch (fallbackError) {
        console.log("Fallback pincode API failed.", fallbackError);
      }
    }

    if (!success) {
      showToast("Invalid pincode or no data found.", "error");
      setPincodeOptions(null);
    }
    
    setPincodeLoading(false);
  }, [showToast]);

  // ── DERIVED ────────────────────────────────────────────────────────────────
  const isResidential = form.propertyType === "residential";
  const subType = form.propertySubType;
  const unitType = form.unitType;
  const isSpecial = subType === "special";
  const isCommercial = subType === "commercial";
  const isPlot = unitType === "plot" && (isResidential || !!subType);
  const isLB = isLoadBearingStructure(form.typeOfStructure);
  const showStructuralFields = !isPlot;
  const showFloorInputs = showStructuralFields;
  const showFloorDetails = showStructuralFields;
  const showAreaCalc = showStructuralFields;
  const showBasementParking = showFloorInputs && WITH_BASEMENT_PARKING.has(form.typeOfStructure);

  const unitTypeOptions = isResidential ? UNIT_TYPE_MAP["residential"] : UNIT_TYPE_MAP[subType] || [];
  const showUnitType = isResidential || !!subType;
  const showUnitNo = (isResidential && ["flat", "bungalow", "row_house"].includes(unitType)) ||
    (!isResidential && !isSpecial && !isPlot);
  const showBuildingWing = (isCommercial && SHOW_WING_UNIT_TYPES.has(unitType)) ||
    (isResidential && unitType === "flat");

  const allFloorKeys = getAllFloorKeys(
    showBasementParking ? form.basementLevels : "",
    showBasementParking ? form.parkingLevels : "",
    showFloorInputs ? form.liveableFloors : "",
    isLB
  );

  useEffect(() => {
    if (hydratingSavedFloorsRef.current) return;
    setSelectedFloors((prev) => {
      const valid = prev.filter((k) => allFloorKeys.includes(k));
      if (valid.length === prev.length) return prev;
      const removed = prev.filter((k) => !allFloorKeys.includes(k));
      if (removed.length > 0) {
        setFloorDetails((fd) => { const n = { ...fd }; removed.forEach((k) => delete n[k]); return n; });
        setAreaData((ad) => { const n = { ...ad }; removed.forEach((k) => delete n[k]); return n; });
        setOpenFloor((f) => removed.includes(f) ? null : f);
        setSelectedUnit((su) => su && removed.includes(su.floorKey) ? null : su);
        setOpenAreaFloor((f) => removed.includes(f) ? null : f);
        setSelectedAreaUnit((su) => su && removed.includes(su.floorKey) ? null : su);
      }
      return valid;
    });
  }, [allFloorKeys.join(",")]); // eslint-disable-line

  // ── FLOOR TOGGLE ───────────────────────────────────────────────────────────
  const toggleFloor = (key) => {
    setSelectedFloors((prev) => {
      if (prev.includes(key)) {
        setFloorDetails((fd) => { const n = { ...fd }; delete n[key]; return n; });
        setAreaData((ad) => { const n = { ...ad }; delete n[key]; return n; });
        if (openFloor === key) setOpenFloor(null);
        if (selectedUnit?.floorKey === key) setSelectedUnit(null);
        if (openAreaFloor === key) setOpenAreaFloor(null);
        if (selectedAreaUnit?.floorKey === key) setSelectedAreaUnit(null);
        return prev.filter((k) => k !== key);
      }
      setFloorDetails((fd) => fd[key] ? fd : { ...fd, [key]: [] });
      setAreaData((ad) => ad[key] ? ad : { ...ad, [key]: [] });
      setOpenFloor(key);
      setOpenAreaFloor(key);
      setSelectedUnit(null);
      setSelectedAreaUnit(null);
      return [...prev, key];
    });
  };

  const handleFloorOpen = (fk) => {
    const next = openFloor === fk ? null : fk;
    setOpenFloor(next); setOpenAreaFloor(next);
    if (!next) { setSelectedUnit(null); setSelectedAreaUnit(null); return; }
    const firstUnit = floorDetails[fk]?.[0];
    if (firstUnit) { setSelectedUnit({ floorKey: fk, unitId: firstUnit.id }); setSelectedAreaUnit({ floorKey: fk, unitId: firstUnit.id }); return; }
    setSelectedUnit(null); setSelectedAreaUnit(null);
  };

  const handleAreaFloorOpen = (fk) => {
    const next = openAreaFloor === fk ? null : fk;
    setOpenAreaFloor(next); setOpenFloor(next);
    if (!next) { setSelectedAreaUnit(null); setSelectedUnit(null); return; }
    const firstUnit = floorDetails[fk]?.[0];
    if (firstUnit) { setSelectedAreaUnit({ floorKey: fk, unitId: firstUnit.id }); setSelectedUnit({ floorKey: fk, unitId: firstUnit.id }); return; }
    setSelectedAreaUnit(null); setSelectedUnit(null);
  };

  const selectUnitEverywhere = (fk, unitId) => {
    setOpenFloor(fk); setOpenAreaFloor(fk);
    setSelectedUnit({ floorKey: fk, unitId });
    setSelectedAreaUnit({ floorKey: fk, unitId });
  };

  const handleOccupiedTypeChange = (value) => {
    handleChange("occupiedType", value);
  };

  // ── UNIT / SPACE ───────────────────────────────────────────────────────────
  const makeUnit = () => ({
    id: uid(), unitNo: "", unitConfig: "",
    spaces: [{ id: uid(), spaceType: "", count: "" }],
    remarks: "",
  });
  const addUnit = (fk) => {
    const nu = makeUnit();
    setFloorDetails((fd) => ({ ...fd, [fk]: [...(fd[fk] || []), nu] }));
    selectUnitEverywhere(fk, nu.id);
    setAreaData((ad) => ({ ...ad, [fk]: [...(ad[fk] || []), { id: nu.id, unitNo: "", areas: [] }] }));
  };
  const updateUnit = (fk, uid2, patch) => setFloorDetails((fd) => ({ ...fd, [fk]: fd[fk].map((u) => u.id === uid2 ? { ...u, ...patch } : u) }));
  const deleteUnit = (fk, uid2) => {
    setFloorDetails((fd) => ({ ...fd, [fk]: (fd[fk] || []).filter((u) => u.id !== uid2) }));
    setAreaData((ad) => ({ ...ad, [fk]: (ad[fk] || []).filter((u) => u.id !== uid2) }));
    if (selectedUnit?.floorKey === fk && selectedUnit?.unitId === uid2) setSelectedUnit(null);
  };
  const addSpace = (fk, uid2) => setFloorDetails((fd) => ({ ...fd, [fk]: fd[fk].map((u) => u.id === uid2 ? { ...u, spaces: [...u.spaces, { id: uid(), spaceType: "", count: "" }] } : u) }));
  const updateSpace = (fk, uid2, sid, patch) => setFloorDetails((fd) => ({ ...fd, [fk]: fd[fk].map((u) => u.id === uid2 ? { ...u, spaces: u.spaces.map((s) => s.id === sid ? { ...s, ...patch } : s) } : u) }));
  const deleteSpace = (fk, uid2, sid) => setFloorDetails((fd) => ({ ...fd, [fk]: fd[fk].map((u) => u.id === uid2 ? { ...u, spaces: u.spaces.filter((s) => s.id !== sid) } : u) }));

  // ── AREA ──────────────────────────────────────────────────────────────────
  const addArea = (fk, uid2, sourceBaseKey = "") => setAreaData((ad) => ({
    ...ad,
    [fk]: (ad[fk] || []).map((u) => {
      if (u.id !== uid2) return u;
      const newRow = { id: uid(), sourceBaseKey, generated: false, name: "", length: "", width: "", loadingFactor: "" };
      if (!sourceBaseKey) return { ...u, areas: [...(u.areas || []), newRow] };
      const areas = [...(u.areas || [])];
      const lastIndex = areas.reduce((idx, a, i) => (a.sourceBaseKey === sourceBaseKey ? i : idx), -1);
      areas.splice(lastIndex + 1, 0, newRow);
      return { ...u, areas };
    }),
  }));
  const updateAreaRow = (fk, uid2, aid, patch) => setAreaData((ad) => ({ ...ad, [fk]: ad[fk].map((u) => u.id === uid2 ? { ...u, areas: u.areas.map((a) => a.id === aid ? { ...a, ...patch } : a) } : u) }));
  const deleteAreaRow = (fk, uid2, aid) => setAreaData((ad) => ({ ...ad, [fk]: (ad[fk] || []).map((u) => u.id === uid2 ? { ...u, areas: (u.areas || []).filter((a) => a.id !== aid) } : u) }));
  const calcCarpet = (a) => (parseFloat(a.length) || 0) * (parseFloat(a.width) || 0);
  const calcSaleable = (a) => calcCarpet(a) * (parseFloat(a.loadingFactor) || 1);
  const getTotals = (units) => {
    let tc = 0, ts = 0;
    (units || []).forEach((u) => (u.areas || []).forEach((a) => { tc += calcCarpet(a); ts += calcSaleable(a); }));
    return { totalCarpet: tc, totalSaleable: ts };
  };

  useEffect(() => {
    setAreaData((prev) => {
      const next = {};
      selectedFloors.forEach((fk) => {
        next[fk] = (floorDetails[fk] || []).map((unit) => {
          const existing = (prev[fk] || []).find((u) => u.id === unit.id) || {};
          return {
            ...existing,
            id: unit.id, unitNo: unit.unitNo, unitConfig: unit.unitConfig,
            areas: buildAreaRowsForUnit(unit, existing.areas || []),
          };
        });
      });
      return next;
    });
  }, [floorDetails, selectedFloors.join(",")]); // eslint-disable-line

  const currentUnit = selectedUnit ? (floorDetails[selectedUnit.floorKey] || []).find((u) => u.id === selectedUnit.unitId) : null;
  const currentAreaUnit = selectedAreaUnit ? (areaData[selectedAreaUnit.floorKey] || []).find((u) => u.id === selectedAreaUnit.unitId) : null;
  const fp = { form, onChange: handleChange };
  const selectedFloorSummary = selectedFloors.map(getFloorLabel).join(", ");
  const savePayload = { ...form, selectedFloors, floorDetails, areaData };

  const canShowFloorNumbers = showFloorInputs && !!form.typeOfStructure && allFloorKeys.length > 0;
  const floorNumberNotReady = showFloorInputs && (
    !form.typeOfStructure ? "Select Type of Structure first"
      : allFloorKeys.length === 0 ? "Set Livable Floors first"
      : null
  );

  return (
    <>
      <style>{css}</style>
      <div className="pf-wrap">

        {toast && (
          <div className={`pf-inline-toast ${toast.type || "success"}`}>
            <span>{toast.type === "error" ? "✕" : "✓"}</span>
            <span>{toast.msg}</span>
            <button className="pf-toast-close" onClick={() => setToast(null)}>×</button>
          </div>
        )}

        {/* ══ PROPERTY ADDRESS ══════════════════════════════════════════════ */}
        <div className="pf-card">
          <div className="pf-section-title">Property Address</div>

          <div className="pf-addr-row">
            <AF label="Pincode" required info>
              <div className="pf-input-wrap">
                <input className="pf-input" value={form.pincode} maxLength={6} placeholder="474001"
                  onChange={(e) => { handleChange("pincode", e.target.value); if (e.target.value.length === 6) fetchPincode(e.target.value); }} />
                {pincodeLoading && <span className="pf-suffix">⟳</span>}
              </div>
            </AF>
            <AF label="State" info><Inp field="state" disabled placeholder="Auto-filled" {...fp} /></AF>
            <AF label="City" info><Inp field="city" disabled placeholder="Auto-filled" {...fp} /></AF>
            <AF label="District" required info><Inp field="district" disabled placeholder="Auto-filled" {...fp} /></AF>
          </div>

          <div className="pf-addr-row">
            <AF label="Taluka" info>
              <Sel field="taluka" options={pincodeOptions?.talukas || (form.taluka ? [{ value: form.taluka, label: form.taluka }] : [])} placeholder="Select Taluka" disabled={!pincodeOptions && !form.taluka} {...fp} />
            </AF>
            <AF label="Village" info>
              <Sel field="village" options={pincodeOptions?.villages || (form.village ? [{ value: form.village, label: form.village }] : [])} placeholder="Select Village" disabled={!pincodeOptions && !form.village} {...fp} />
            </AF>
            <AF label="Locality" info>
              <Sel field="locality" options={pincodeOptions?.localities || (form.locality ? [{ value: form.locality, label: form.locality }] : [])} placeholder="Select Locality" disabled={!pincodeOptions && !form.locality} {...fp} />
            </AF>
            <AF label="Street Name & No." info>
              <Sel field="streetName" options={pincodeOptions?.streets || (form.streetName ? [{ value: form.streetName, label: form.streetName }] : [])} placeholder="Select Street Name" disabled={!pincodeOptions && !form.streetName} {...fp} />
            </AF>
          </div>

          <div className="pf-addr-row">
            {/* ✅ CHANGE 1: Landmark is now a plain text input, not a dropdown */}
            <AF label="Landmark" required info>
              <Inp field="landmark" placeholder="Enter Landmark" {...fp} />
            </AF>
            <AF label="Project/Society/Commercial/Industrial Estate Name" className="span2">
              <Inp field="projectSocietyName" placeholder="Enter name" {...fp} />
            </AF>
            <AF label="Plot No." required><Inp field="plotNo" placeholder="Plot / Survey / House No." {...fp} /></AF>
          </div>

          <div className="pf-addr-row" style={{ alignItems: "start" }}>
            <AF label="Property Type" required>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 4 }}>
                <label className="pf-radio"><input type="radio" name="propertyType" checked={form.propertyType === "non_residential"} onChange={() => handleChange("propertyType", "non_residential")} /> Non Residential</label>
                <label className="pf-radio"><input type="radio" name="propertyType" checked={form.propertyType === "residential"} onChange={() => handleChange("propertyType", "residential")} /> Residential</label>
              </div>
            </AF>
            {!isResidential
              ? <AF label="Property Sub Type" required><Sel field="propertySubType" options={PROPERTY_SUBTYPE_MAP[form.propertyType] || []} placeholder="Select Sub Type" {...fp} /></AF>
              : <div />}
            {showUnitType
              ? <AF label="Unit Type" required><Sel field="unitType" options={unitTypeOptions} placeholder="Select Unit Type" {...fp} /></AF>
              : <div />}
            {showUnitNo
              ? <AF label="Unit No."><Inp field="unitNo" placeholder="Unit No." {...fp} /></AF>
              : <div />}
          </div>

          {showBuildingWing && (
            <div className="pf-addr-row" style={{ marginBottom: 20 }}>
              <AF label="Building / Wing Name" required className="span2">
                <Inp field="buildingWingName" placeholder="Building / Wing Name" {...fp} />
              </AF>
            </div>
          )}

          <div>
            <Label required>Revenue Record Type &amp; Number</Label>
            <textarea className="pf-textarea-box" rows={2}
              value={form.revenueRecordTypeNumber ?? ""}
              onChange={(e) => handleChange("revenueRecordTypeNumber", e.target.value)}
              placeholder="Enter Revenue Record Type & Number" maxLength={1000}
              style={{ width: "100%", marginTop: 4 }} />
            <div className="pf-char-count">{(form.revenueRecordTypeNumber || "").length}/1000</div>
          </div>
        </div>

        {/* ══ PROPERTY DETAILS ══════════════════════════════════════════════ */}
        <div className="pf-card">
          <div className="pf-section-title">Property Details</div>
          <div className="pf-det-grid">

            <DF label="Within Geo Limit" info><YesNo field="withinGeoLimit" {...fp} /></DF>
            <DF label="Class Of Locality" required>
              <Sel field="classOfLocality" options={[
                { value: "lower_class", label: "Lower Class" }, { value: "middle_class", label: "Middle Class" },
                { value: "posh", label: "Posh" }, { value: "slum", label: "Slum" }, { value: "upper_class", label: "Upper Class" },
              ]} {...fp} />
            </DF>
            <DF label="Property Jurisdiction" required>
              <Sel field="propertyJurisdiction" options={[
                { value: "city_development_authority", label: "City Development Authority" },
                { value: "dtcp", label: "Dtcp" }, { value: "gram_panchayat", label: "Gram Panchayat" },
                { value: "municipality_corp", label: "Municipality/Corporation" },
                { value: "other_development_authority", label: "Other Development Authority" },
                { value: "town_nagar_panchayat", label: "Town/Nagar Panchayat" },
              ]} {...fp} />
            </DF>
            <DF label="Sanction Authority Name" required><Inp field="sanctionAuthorityName" placeholder="e.g. KDMC" {...fp} /></DF>

            <DF label="Approved Plan No"><Inp field="approvedPlanNo" {...fp} /></DF>
            <DF label="Sanction Usage" required info>
              <Sel field="sanctionUsage" options={[
                { value: "residential", label: "Residential" }, { value: "commercial", label: "Commercial" },
                { value: "industrial", label: "Industrial" }, { value: "special", label: "Special" },
              ]} {...fp} />
            </DF>
            <DF label="Actual Usage" required info>
              <Sel field="actualUsage" options={[
                { value: "residential", label: "Residential" }, { value: "commercial", label: "Commercial" },
                { value: "industrial", label: "Industrial" }, { value: "special", label: "Special" },
              ]} {...fp} />
            </DF>
            {showStructuralFields && (
              <DF label="Type of Structure" required>
                <Sel field="typeOfStructure" options={STRUCTURE_TYPES} {...fp} />
              </DF>
            )}

            <DF label="Plot Area (Sqft)" required><Inp field="plotAreaSqft" type="number" placeholder="0" {...fp} /></DF>

            {/* ✅ CHANGE 2: Basement Levels — always visible when structural, plain number input */}
            {showBasementParking && (
              <DF label="Basement Levels" info>
                <Inp field="basementLevels" type="number" placeholder="0" {...fp} />
              </DF>
            )}

            {/* ✅ CHANGE 3: Parking Levels — always visible when structural, plain number input */}
            {showBasementParking && (
              <DF label="Parking Levels" info>
                <Inp field="parkingLevels" type="number" placeholder="0" {...fp} />
              </DF>
            )}

            {/* ✅ CHANGE 4: Livable Floors — plain number input instead of dropdown */}
            {showFloorInputs && (
              <DF label="Livable Floors" required info>
                <Inp field="liveableFloors" type="number" placeholder="0" {...fp} />
              </DF>
            )}

            {/* Structure Configuration: auto-computed, read-only */}
            {showFloorInputs && (
              <DF label="Structure Configuration">
                <input className="pf-input" value={form.structureConfiguration ?? ""} readOnly
                  placeholder="Auto-computed"
                  style={{ color: form.structureConfiguration ? "#1677ff" : "#bbb", fontWeight: form.structureConfiguration ? 600 : 400, cursor: "default" }} />
              </DF>
            )}

            <DF label="Society Registered"><YesNo field="societyRegistered" {...fp} /></DF>
            <DF label="Unique Property ID" info><Inp field="uniquePropertyId" placeholder="Unique Property ID" {...fp} /></DF>
            <DF label="Property Entrance Facing">
              <Sel field="propertyEntranceFacing" options={[
                {value:"north",label:"North"},{value:"south",label:"South"},
                {value:"east",label:"East"},{value:"west",label:"West"},
                {value:"north_east",label:"North East"},{value:"north_west",label:"North West"},
                {value:"south_east",label:"South East"},{value:"south_west",label:"South West"},
              ]} {...fp} />
            </DF>

            {showFloorInputs && (
              <DF label="Construction Status" required>
                <Sel field="constructionStatus" options={[
                  { value: "completed", label: "Completed" },
                  { value: "under_construction", label: "Under Construction" },
                ]} {...fp} />
              </DF>
            )}
            <DF label="APF Flag">
              <Sel field="apfFlag" options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} {...fp} />
            </DF>

            {/* Floor Number — dynamic checkbox dropdown */}
            {showFloorInputs && (
              <DF label="Floor Number" required>
                {floorNumberNotReady ? (
                  <span className="pf-hint-text">{floorNumberNotReady}</span>
                ) : (
                  <div className="pf-floor-select-wrap" ref={floorDropdownRef}>
                    <button
                      type="button"
                      className={`pf-floor-trigger ${selectedFloors.length ? "" : "placeholder"}`}
                      onClick={() => setFloorDropdownOpen((v) => !v)}
                    >
                      {selectedFloorSummary || "Select Floor Number"}
                    </button>
                    {floorDropdownOpen && (
                      <div className="pf-floor-menu">
                        <div className="pf-floor-checks">
                          {allFloorKeys.map((key) => {
                            const kType = floorKeyType(key);
                            const isChecked = selectedFloors.includes(key);
                            return (
                              <label key={key}
                                className={`pf-floor-chk ${kType === "basement" ? "basement" : kType === "parking" ? "parking" : ""} ${isChecked ? "checked" : ""}`}>
                                <input type="checkbox" checked={isChecked} onChange={() => toggleFloor(key)} />
                                {getFloorLabel(key)}
                              </label>
                            );
                          })}
                        </div>
                        <div className="pf-floor-menu-actions">
                          <button type="button" onClick={() => setFloorDropdownOpen(false)}>Done</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </DF>
            )}

            <DF label="Property Transaction Type" info>
              <Sel field="propertyTransactionType" options={[
                {value:"builder_resale",label:"Builder Resale"},
                {value:"direct_allotment",label:"Direct Allotment from Builder"},
                {value:"direct_dev_auth",label:"Direct Allotment from Development Authority / Govt Body"},
                {value:"dev_auth_resale",label:"Development Authority / Govt Body - Resale"},
                {value:"direct_society",label:"Direct Allotment from Society"},
                {value:"resale_others",label:"Resale (Others)"},
                {value:"self_construction",label:"Self Construction"},
                {value:"society_resale",label:"Society Resale"},
                {value:"crfg_ssvr",label:"CRFG SSVR"},
                {value:"crfg_fsvr",label:"CRFG FSVR"},
              ]} {...fp} />
            </DF>

            <DF label="Count Of Properties">
              <Sel field="countOfProperties" options={COUNT_OPTIONS} placeholder="Select count" {...fp} />
            </DF>
            <DF label="Collateral Scope" required>
              <Sel field="collateralScope" options={[{value:"entire_property",label:"Entire Property"},{value:"part_property",label:"Part Property"}]} {...fp} />
            </DF>
            <DF label="Ownership Type" required>
              <Sel field="ownershipType" options={[{value:"free_hold",label:"Free hold"},{value:"lease_hold",label:"Lease hold"},{value:"government",label:"Government"}]} {...fp} />
            </DF>
            <DF label="APF ID"><Inp field="apfId" {...fp} /></DF>
          </div>

          <div className="pf-divider" />

          {/* Door Photo */}
          <div style={{ marginTop: 14 }}>
            <Label required>Door Photo With Name Plate</Label>
            <div className="pf-radio-group" style={{ marginTop: 6 }}>
              <label className="pf-radio">
                <input type="radio" name="doorPhotoWithNamePlate" checked={form.doorPhotoWithNamePlate === true} onChange={() => handleChange("doorPhotoWithNamePlate", true)} />
                Yes
              </label>
              <label className="pf-radio">
                <input type="radio" name="doorPhotoWithNamePlate" checked={form.doorPhotoWithNamePlate === false} onChange={() => handleChange("doorPhotoWithNamePlate", false)} />
                No
              </label>
            </div>
          </div>

          {form.doorPhotoWithNamePlate === true && (
            <div style={{ marginTop: 14 }}>
              <Label required>Door Photo Upload</Label>
              <div className="pf-upload-dragger" onClick={() => document.getElementById("doorPhotoInput").click()}>
                <div className="pf-upload-icon">Upload</div>
                <div className="pf-upload-text">Drag &amp; Drop / Upload Photo *</div>
                {form.doorPhotoFile && <div style={{ fontSize: 12, color: "#52c41a", marginTop: 4 }}>Saved: {form.doorPhotoFile.name || "door_photo.png"}</div>}
              </div>
              <input id="doorPhotoInput" type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0]; if (!file) return;
                  if (!["image/jpeg","image/jpg","image/png"].includes(file.type)) { showToast("Only JPEG, JPG, PNG supported.", "error"); return; }
                  if (file.size > 500*1024) { showToast("Max file size is 500 KB.", "error"); return; }
                  handleChange("doorPhotoFile", file);
                }} />
              <p className="pf-upload-hint">* Supported file formats are JPEG, JPG, PNG (Maximum file size 500 KB)</p>
            </div>
          )}
        </div>

        {/* ══ FLOOR DETAILS ════════════════════════════════════════════════ */}
        {showFloorDetails && (
          <div className="pf-card">
            <div className="pf-section-title">Floor Details</div>

            {/* Occupied Type radio */}
            <div style={{ marginBottom: 8 }}>
              <Label required>Occupied Type</Label>
              <div className="pf-radio-group" style={{ marginTop: 6 }}>
                <label className="pf-radio"><input type="radio" name="occupiedType" checked={form.occupiedType === "multiple"} onChange={() => handleOccupiedTypeChange("multiple")} /> Multiple Occupancy</label>
                <label className="pf-radio"><input type="radio" name="occupiedType" checked={form.occupiedType === "single"} onChange={() => handleOccupiedTypeChange("single")} /> Single Occupancy</label>
              </div>
            </div>

            {/* ✅ CHANGE 5: Single Occupancy — show 3 fields inline below radio, matching image */}
            {form.occupiedType === "single" && (
              <div className="pf-single-occ-row">
                <div className="pf-occupancy-field">
                  <label>Occupied By <span style={{ color: "#e8472b" }}>*</span></label>
                  <select className="pf-select" value={form.singleOccupiedBy || ""}
                    onChange={(e) => handleChange("singleOccupiedBy", e.target.value)}>
                    <option value="">Select</option>
                    {OCCUPIED_BY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="pf-occupancy-field">
                  <label>Occupant Name</label>
                  <input className="pf-input" value={form.singleOccupantName || ""}
                    placeholder="Enter name"
                    onChange={(e) => handleChange("singleOccupantName", e.target.value)} />
                </div>
                <div className="pf-occupancy-field">
                  <label>Occupied Since</label>
                  <input className="pf-input" type="date" value={form.singleOccupiedSince || ""}
                    onChange={(e) => handleChange("singleOccupiedSince", e.target.value)} />
                </div>
              </div>
            )}

            {/* Floor split panel */}
            <div style={{ marginTop: 16 }}>
              {selectedFloors.length === 0 ? (
                <div className="pf-hint-text" style={{ padding: "16px 0" }}>
                  {allFloorKeys.length === 0
                    ? "Set Livable Floors first to select floors."
                    : "Select floors from Floor Number checkboxes above to add floor details."}
                </div>
              ) : (
                <div className="pf-split">
                  <div className="pf-split-left">
                    {selectedFloors.map((fk) => {
                      const units = floorDetails[fk] || [];
                      const isOpen = openFloor === fk;
                      const kType = floorKeyType(fk);
                      return (
                        <div key={fk}>
                          <div
                            className={`pf-acc-hdr ${isOpen ? "open" : ""} ${kType === "basement" ? "basement-hdr" : kType === "parking" ? "parking-hdr" : ""}`}
                            onClick={() => handleFloorOpen(fk)}
                          >
                            <span>
                              {getFloorLabel(fk)}
                              <span className={`pf-floor-type-tag ${kType === "basement" ? "b" : kType === "parking" ? "p" : "f"}`}>
                                {kType === "basement" ? "B" : kType === "parking" ? "P" : "F"}
                              </span>
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 400 }}>{units.length} Unit{units.length !== 1 ? "s" : ""} {isOpen ? "−" : "+"}</span>
                          </div>
                          {isOpen && (
                            <>
                              {units.map((u) => {
                                const isSel = selectedUnit?.floorKey === fk && selectedUnit?.unitId === u.id;
                                return (
                                  <div key={u.id} className={`pf-acc-unit ${isSel ? "sel" : ""}`}
                                    onClick={() => selectUnitEverywhere(fk, u.id)}>
                                    <span>{u.unitNo || "—"}</span>
                                    <span style={{ opacity: 0.7 }}>{u.unitConfig || ""} ›</span>
                                  </div>
                                );
                              })}
                              <div className="pf-acc-addmore">
                                <button className="pf-link-btn" onClick={() => addUnit(fk)}>⊕ Add More</button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="pf-split-right">
                    {!currentUnit ? (
                      <div className="pf-empty">
                        <div style={{ fontSize: 32, color: "#e0e0e0" }}>☰</div>
                        <div style={{ fontWeight: 600, color: "#bbb" }}>Unit Floor Details</div>
                        <div style={{ fontSize: 12 }}>Please add unit floor details here</div>
                        {openFloor && (
                          <button className="pf-link-btn" style={{ marginTop: 8 }} onClick={() => addUnit(openFloor)}>⊕ Add More</button>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="pf-unit-header">
                          <div>
                            <div style={{ fontSize: 12, color: "#444", fontWeight: 500, marginBottom: 4 }}>Unit No</div>
                            <input className="pf-input" value={currentUnit.unitNo}
                              onChange={(e) => updateUnit(selectedUnit.floorKey, currentUnit.id, { unitNo: e.target.value })}
                              placeholder="Unit No" />
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: "#444", fontWeight: 500, marginBottom: 4 }}>Unit Configuration</div>
                            <input className="pf-input" value={currentUnit.unitConfig}
                              onChange={(e) => updateUnit(selectedUnit.floorKey, currentUnit.id, { unitConfig: e.target.value })}
                              placeholder="e.g. 2BHK" />
                          </div>
                        </div>
                        <table className="pf-space-tbl">
                          <thead>
                            <tr>
                              <th>Space Type <span style={{ color: "#e8472b" }}>*</span></th>
                              <th>Count <span style={{ color: "#e8472b" }}>*</span></th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentUnit.spaces.map((sp) => {
                              const usedTypes = currentUnit.spaces.filter((s) => s.id !== sp.id && s.spaceType).map((s) => s.spaceType);
                              return (
                                <tr key={sp.id}>
                                  <td>
                                    <select className="pf-select" value={sp.spaceType} style={{ minWidth: 140 }}
                                      onChange={(e) => updateSpace(selectedUnit.floorKey, currentUnit.id, sp.id, { spaceType: e.target.value })}>
                                      <option value="">Select Space Type</option>
                                      {SPACE_TYPES.map((st) => (
                                        <option key={st.value} value={st.value} disabled={usedTypes.includes(st.value)}>{st.label}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    <input className="pf-input" type="number" min={1} style={{ width: 80 }} value={sp.count}
                                      onChange={(e) => updateSpace(selectedUnit.floorKey, currentUnit.id, sp.id, { count: e.target.value })} />
                                    {!sp.count && <div style={{ color: "#ff4d4f", fontSize: 11 }}>*required</div>}
                                  </td>
                                  <td>
                                    <button className="pf-del-btn" onClick={() => deleteSpace(selectedUnit.floorKey, currentUnit.id, sp.id)}>🗑</button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div style={{ textAlign: "right", marginBottom: 8 }}>
                          <button className="pf-link-btn" onClick={() => addSpace(selectedUnit.floorKey, currentUnit.id)}>⊕ Add More</button>
                        </div>

                        {/* Multiple Occupancy: per-unit fields inside panel */}
                        {form.occupiedType === "multiple" && (
                          <div className="pf-occupancy-grid">
                            <div className="pf-occupancy-field">
                              <label>Occupied By <span style={{ color: "#e8472b" }}>*</span></label>
                              <select className="pf-select" value={currentUnit.occupiedBy || ""}
                                onChange={(e) => updateUnit(selectedUnit.floorKey, currentUnit.id, { occupiedBy: e.target.value })}>
                                <option value="">Select</option>
                                {OCCUPIED_BY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                              </select>
                            </div>
                            <div className="pf-occupancy-field">
                              <label>Occupant Name</label>
                              <input className="pf-input" value={currentUnit.occupantName || ""}
                                onChange={(e) => updateUnit(selectedUnit.floorKey, currentUnit.id, { occupantName: e.target.value })} />
                            </div>
                            <div className="pf-occupancy-field">
                              <label>Occupied Since</label>
                              <input className="pf-input" type="date" value={currentUnit.occupiedSince || ""}
                                onChange={(e) => updateUnit(selectedUnit.floorKey, currentUnit.id, { occupiedSince: e.target.value })} />
                            </div>
                          </div>
                        )}

                        <div className="pf-remarks-row">
                          <label>Remarks :</label>
                          <input className="pf-remarks-input" value={currentUnit.remarks}
                            onChange={(e) => updateUnit(selectedUnit.floorKey, currentUnit.id, { remarks: e.target.value })} />
                        </div>
                        <div className="pf-form-footer">
                          <button className="pf-btn danger" onClick={() => deleteUnit(selectedUnit.floorKey, currentUnit.id)}>🗑 Delete</button>
                          <button className="pf-btn primary" onClick={() => {
                            updateUnit(selectedUnit.floorKey, currentUnit.id, { _saved: true });
                            selectUnitEverywhere(selectedUnit.floorKey, currentUnit.id);
                            showToast("Unit updated successfully");
                          }}>
                            {currentUnit._saved ? "Update" : "Add"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ AREA CALCULATOR ══════════════════════════════════════════════ */}
        {showAreaCalc && (
          <div className="pf-card">
            <div className="pf-section-title">Area Calculator</div>
            <div style={{ marginBottom: 14 }}>
              <Label required>Area Measured</Label>
              <div className="pf-radio-group" style={{ marginTop: 6 }}>
                <label className="pf-radio"><input type="radio" name="areaMeasured" checked={form.areaMeasured === true} onChange={() => handleChange("areaMeasured", true)} /> Yes</label>
                <label className="pf-radio"><input type="radio" name="areaMeasured" checked={form.areaMeasured === false} onChange={() => handleChange("areaMeasured", false)} /> No</label>
              </div>
            </div>

            {form.areaMeasured && selectedFloors.length > 0 && (
              <div className="pf-split">
                <div className="pf-split-left">
                  {selectedFloors.map((fk) => {
                    const adUnits = areaData[fk] || [];
                    const { totalCarpet } = getTotals(adUnits);
                    const isOpen = openAreaFloor === fk;
                    const kType = floorKeyType(fk);
                    return (
                      <div key={fk}>
                        <div
                          className={`pf-acc-hdr ${isOpen ? "open" : ""} ${kType === "basement" ? "basement-hdr" : kType === "parking" ? "parking-hdr" : ""}`}
                          onClick={() => handleAreaFloorOpen(fk)}
                        >
                          <span>
                            {getFloorLabel(fk)}
                            <span className={`pf-floor-type-tag ${kType === "basement" ? "b" : kType === "parking" ? "p" : "f"}`}>
                              {kType === "basement" ? "B" : kType === "parking" ? "P" : "F"}
                            </span>
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 400 }}>{totalCarpet > 0 ? `${totalCarpet.toFixed(2)} Sqft` : "Sqft"} {isOpen ? "−" : "+"}</span>
                        </div>
                        {isOpen && (
                          <>
                            {adUnits.map((u) => {
                              const { totalCarpet: uc } = getTotals([u]);
                              const isSel = selectedAreaUnit?.floorKey === fk && selectedAreaUnit?.unitId === u.id;
                              return (
                                <div key={u.id} className={`pf-acc-unit ${isSel ? "sel" : ""}`}
                                  onClick={() => selectUnitEverywhere(fk, u.id)}>
                                  <span>{u.unitNo || "—"}</span>
                                  <span style={{ opacity: 0.7 }}>{uc > 0 ? `${uc.toFixed(2)} ›` : "›"}</span>
                                </div>
                              );
                            })}
                            {adUnits.length === 0 && (
                              <div style={{ padding: "8px 16px", fontSize: 12, color: "#aaa" }}>Add units from Floor Details</div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="pf-split-right">
                  {!currentAreaUnit ? (
                    <div className="pf-empty">
                      <div style={{ fontSize: 32, color: "#e0e0e0" }}>📐</div>
                      <div style={{ fontWeight: 600, color: "#bbb" }}>Unit Area Details</div>
                      <div style={{ fontSize: 12 }}>Select a unit from the left to enter area</div>
                    </div>
                  ) : (() => {
                    const fk = selectedAreaUnit.floorKey;
                    const areas = currentAreaUnit.areas || [];
                    const totalCarpet = areas.reduce((s, a) => s + calcCarpet(a), 0);
                    const totalSaleable = areas.reduce((s, a) => s + calcSaleable(a), 0);
                    return (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{areas.length} Details</span>
                          <button className="pf-link-btn" onClick={() => addArea(fk, currentAreaUnit.id)}>⊕ Add More</button>
                        </div>
                        {areas.length > 0 && (
                          <table className="pf-area-tbl">
                            <thead>
                              <tr>
                                <th>Name</th><th>Length (ft)</th><th>Width (ft)</th>
                                <th>Carpet Area (Sqft)</th><th>Loading Factor</th>
                                <th>Saleable Area (Sqft)</th><th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {areas.map((a) => (
                                <tr key={a.id} className={a.generated ? "" : "manual-area-row"}>
                                  <td><input className="pf-input" style={{ minWidth: 80 }} value={a.name} readOnly={a.generated} onChange={(e) => updateAreaRow(fk, currentAreaUnit.id, a.id, { name: e.target.value })} /></td>
                                  <td><input className="pf-input" type="number" style={{ width: 60 }} value={a.length} onChange={(e) => updateAreaRow(fk, currentAreaUnit.id, a.id, { length: e.target.value })} /></td>
                                  <td><input className="pf-input" type="number" style={{ width: 60 }} value={a.width} onChange={(e) => updateAreaRow(fk, currentAreaUnit.id, a.id, { width: e.target.value })} /></td>
                                  <td>{calcCarpet(a).toFixed(2)}</td>
                                  <td><input className="pf-input" type="number" step="0.01" style={{ width: 70 }} value={a.loadingFactor} onChange={(e) => updateAreaRow(fk, currentAreaUnit.id, a.id, { loadingFactor: e.target.value })} /></td>
                                  <td>{calcSaleable(a).toFixed(2)}</td>
                                  <td>
                                    {a.generated ? (
                                      <button className="pf-link-btn" style={{ fontSize: 11, padding: "2px 8px" }} onClick={() => addArea(fk, currentAreaUnit.id, a.sourceKey)}>+ Add Area</button>
                                    ) : (
                                      <button className="pf-del-btn" style={{ fontSize: 12 }} onClick={() => deleteAreaRow(fk, currentAreaUnit.id, a.id)}>Delete</button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                        {areas.length === 0 && (
                          <div style={{ textAlign: "center", padding: "24px 0", color: "#bbb" }}>Click "Add More" to add area measurements</div>
                        )}
                        <div className="pf-totals">
                          <div className="pf-total-item">
                            <span className="pf-total-label">Total Carpet Area (sq.ft.)</span>
                            <span className="pf-total-val">{totalCarpet.toFixed(2)}</span>
                          </div>
                          <div className="pf-total-item">
                            <span className="pf-total-label">Total Saleable Area (sq.ft.)</span>
                            <span className="pf-total-val">{totalSaleable.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="pf-form-footer">
                          <button className="pf-btn primary" onClick={() => showToast("Area updated successfully")}>Update</button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {form.areaMeasured && selectedFloors.length === 0 && (
              <div className="pf-hint-text" style={{ padding: "16px 0" }}>
                Select floors from Floor Number checkboxes to calculate area.
              </div>
            )}
          </div>
        )}

        {/* Society Registered Images */}
        {form.societyRegistered === true && (
          <div className="pf-card">
            <div className="pf-section-title">Society Registered Images</div>
            <div className="pf-upload-dragger" onClick={() => document.getElementById("societyRegisteredImageInput").click()}>
              <div className="pf-upload-icon">Upload</div>
              <div className="pf-upload-text">Drag &amp; Drop / Upload Photo *</div>
              {form.societyRegisteredFile && <div style={{ fontSize: 12, color: "#52c41a", marginTop: 4 }}>Saved: {form.societyRegisteredFile.name}</div>}
            </div>
            <input id="societyRegisteredImageInput" type="file" accept=".jpg,.jpeg,.png" style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0]; if (!file) return;
                if (!["image/jpeg","image/jpg","image/png"].includes(file.type)) { showToast("Only JPEG, JPG, PNG supported.", "error"); return; }
                if (file.size > 500*1024) { showToast("Max file size is 500 KB.", "error"); return; }
                handleChange("societyRegisteredFile", file);
              }} />
            <p className="pf-upload-hint">* Supported file formats are JPEG, JPG, PNG (Maximum file size 500 KB)</p>
          </div>
        )}

        {/* ══ ACTIONS ══════════════════════════════════════════════════════ */}
        <div className="pf-actions">
          <button className="pf-btn" onClick={() => onSave?.("propertyDetails", savePayload)} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
          <button className="pf-btn primary" onClick={() => onSaveAndNext?.("propertyDetails", savePayload)} disabled={saving}>{saving ? "Saving…" : "Save & Next"}</button>
        </div>
      </div>
    </>
  );
};

export default PropertyDetailsForm;
