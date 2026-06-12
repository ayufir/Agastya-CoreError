// AmenitiesForm.jsx — iLens replica, exact match to UI screenshots
import React, { useState, useEffect, useRef } from "react";

// ─── SCOPED CSS ───────────────────────────────────────────────────────────────
const css = `
  .am-wrap *, .am-wrap *::before, .am-wrap *::after { box-sizing: border-box; }
  .am-wrap {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px; background: #f5f5f5; color: #111; width: 100%; padding: 16px;
  }
  .am-wrap .am-card {
    background: #fff; border: 1px solid #e8e8e8; border-radius: 4px;
    padding: 20px 24px 24px; margin-bottom: 16px;
  }
  .am-wrap .am-section-title {
    color: #e8472b; font-weight: 600; font-size: 15px; margin-bottom: 18px;
  }
  .am-wrap .am-sub-label {
    font-size: 12.5px; color: #333; font-weight: 500;
    margin-bottom: 12px; margin-top: 20px;
  }
  .am-wrap .am-sub-label:first-child { margin-top: 0; }

  /* Underline inputs */
  .am-wrap .am-input {
    border: none; border-bottom: 0.75px solid #bbb; border-radius: 0;
    outline: none; background: transparent; font-size: 13.5px; color: #111;
    padding: 3px 2px 6px; width: 100%; transition: border-color 0.2s;
  }
  .am-wrap .am-input::placeholder { color: #bbb; font-size: 12px; }
  .am-wrap .am-input:focus { border-bottom-color: #1677ff; }
  .am-wrap .am-field-label {
    font-size: 12px; color: #666; display: block; margin-bottom: 3px;
  }

  /* Checkboxes */
  .am-wrap .am-checkbox {
    display: flex; align-items: center; gap: 8px; cursor: pointer;
    font-size: 13px; color: #222; user-select: none; line-height: 1.4;
  }
  .am-wrap .am-checkbox input[type="checkbox"] {
    width: 14px; height: 14px; flex-shrink: 0;
    accent-color: #e8472b; cursor: pointer;
  }

  /* Radio */
  .am-wrap .am-radio {
    display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
    font-size: 13px; color: #222; margin-right: 24px; user-select: none;
  }
  .am-wrap .am-radio input[type="radio"] {
    width: 14px; height: 14px; accent-color: #e8472b; cursor: pointer;
  }
  .am-wrap .am-radio-row { display: flex; flex-wrap: wrap; padding: 4px 0; gap: 4px 0; }

  /* Checkbox grids */
  .am-wrap .am-chk-grid-4 {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px 16px;
  }
  .am-wrap .am-chk-grid-2 {
    display: grid; grid-template-columns: repeat(2, max-content); gap: 16px 48px;
  }

  /* Input grid layouts */
  .am-wrap .am-two-col {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px;
  }
  .am-wrap .am-three-col {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0 32px;
  }

  /* Divider */
  .am-wrap .am-divider { height: 1px; background: #f0f0f0; margin: 18px 0; }

  /* Upload dragger */
  .am-wrap .am-upload-dragger {
    border: 1px solid #e0e0e0; border-radius: 4px;
    background: #fff; cursor: pointer;
    min-height: 320px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 12px;
    transition: border-color 0.2s; width: 100%;
  }
  .am-wrap .am-upload-dragger:hover { border-color: #1677ff; }
  .am-wrap .am-upload-icon { font-size: 28px; color: #888; line-height: 1; }
  .am-wrap .am-upload-text { font-size: 14px; color: #666; }
  .am-wrap .am-upload-hint { font-size: 11px; color: #aaa; margin-top: 6px; }

  /* Thumbnail strip (below upload area) */
  .am-wrap .am-thumb-strip {
    display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; align-items: flex-start;
  }
  .am-wrap .am-thumb-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .am-wrap .am-thumb {
    width: 64px; height: 64px; border-radius: 4px; overflow: hidden;
    border: 2px solid #e0e0e0; cursor: pointer; flex-shrink: 0;
    transition: border-color 0.15s;
  }
  .am-wrap .am-thumb:hover { border-color: #1677ff; }
  .am-wrap .am-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .am-wrap .am-thumb-name {
    font-size: 10px; color: #555; max-width: 68px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center;
  }

  /* Modal overlay */
  .am-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
  }
  .am-modal {
    background: #fff; border-radius: 8px; width: 820px; max-width: 96vw;
    max-height: 90vh; overflow: hidden; display: flex; flex-direction: column;
    box-shadow: 0 12px 40px rgba(0,0,0,0.25);
  }
  .am-modal-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 20px; border-bottom: 1px solid #e8e8e8;
    font-size: 15px; font-weight: 600; color: #222; flex-shrink: 0;
  }
  .am-modal-close {
    background: none; border: none; cursor: pointer;
    font-size: 22px; color: #888; line-height: 1; padding: 0;
  }
  .am-modal-close:hover { color: #333; }
  .am-modal-body {
    display: flex; flex: 1; overflow: hidden; min-height: 0;
  }
  .am-modal-left {
    flex: 1; display: flex; flex-direction: column; padding: 16px;
    border-right: 1px solid #e8e8e8; min-width: 0; overflow: hidden;
  }
  .am-modal-preview {
    flex: 1; background: #f5f5f5; border-radius: 4px; overflow: hidden;
    display: flex; align-items: center; justify-content: center; min-height: 180px;
  }
  .am-modal-preview img { max-width: 100%; max-height: 340px; object-fit: contain; display: block; }
  .am-modal-thumbs {
    display: flex; gap: 6px; margin-top: 10px;
    overflow-x: auto; padding-bottom: 2px; flex-shrink: 0;
  }
  .am-modal-thumb {
    width: 52px; height: 52px; border-radius: 3px; overflow: hidden;
    border: 2px solid transparent; cursor: pointer; flex-shrink: 0;
    transition: border-color 0.15s;
  }
  .am-modal-thumb.active { border-color: #1677ff; }
  .am-modal-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .am-modal-right {
    width: 280px; flex-shrink: 0; padding: 20px 20px; display: flex;
    flex-direction: column; gap: 18px; overflow-y: auto;
  }
  .am-modal-field label {
    display: block; font-size: 12px; color: #555; margin-bottom: 6px; font-weight: 500;
  }
  .am-modal-field input {
    width: 100%; border: 1px solid #d9d9d9; border-radius: 4px;
    padding: 8px 10px; font-size: 13px; color: #111; outline: none; transition: border-color 0.2s;
  }
  .am-modal-field input:focus { border-color: #1677ff; }
  .am-modal-nav {
    display: flex; align-items: center; justify-content: center;
    padding: 0 12px; cursor: pointer; font-size: 24px; color: #888;
    border-left: 1px solid #f0f0f0; flex-shrink: 0; user-select: none;
  }
  .am-modal-nav:hover { color: #1677ff; }
  .am-modal-footer {
    display: flex; justify-content: flex-end; gap: 10px;
    padding: 14px 20px; border-top: 1px solid #e8e8e8; flex-shrink: 0;
  }

  /* Buttons */
  .am-wrap .am-actions {
    display: flex; justify-content: flex-end; gap: 12px;
    padding-top: 16px; border-top: 1px solid #e8e8e8;
  }
  .am-btn {
    padding: 7px 28px; border-radius: 4px; font-size: 14px; cursor: pointer;
    border: 1px solid #d9d9d9; background: #fff; color: #333;
    transition: all 0.2s; font-family: inherit;
  }
  .am-btn:hover { border-color: #1677ff; color: #1677ff; }
  .am-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .am-btn.primary { background: #1a3a6b; color: #fff; border-color: #1a3a6b; }
  .am-btn.primary:hover { background: #142d55; border-color: #142d55; }

  /* Narrow input (Seating Capacity / Ceiling Height) */
  .am-wrap .am-narrow { max-width: 280px; }

  @media (max-width: 860px) {
    .am-wrap .am-chk-grid-4 { grid-template-columns: repeat(2, 1fr); }
    .am-wrap .am-two-col, .am-wrap .am-three-col { grid-template-columns: 1fr; }
    .am-modal-right { width: 200px; }
  }

  @media (max-width: 600px) {
    .am-wrap .am-actions { flex-direction: column; gap: 8px; }
    .am-wrap .am-btn { width: 100%; text-align: center; }
    .am-modal-body { flex-direction: column; overflow-y: auto; }
    .am-modal-right { width: 100%; padding: 16px; border-top: 1px solid #e8e8e8; }
    .am-modal-nav { display: none; }
  }
`;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AmenitiesForm = ({ data, editData, extractedData, onSave, onSaveAndNext, saving }) => {
  const [form, setForm] = useState({
    // ── Project Amenities ──────────────────────────────────────────────────
    furnished: false,
    greenBuildingCertified: false,
    hvac: false,
    lift: false,
    meetingRoom: false,
    pantry: false,
    parking: false,
    viewVista: false,
    washroom: false,
    seatingCapacity: "",
    frontageAvailable: false,
    loftAvailable: false,
    footFall: "",           // "high" | "low" | "medium"
    ceilingHeight: "",
    loadingPlatformAvailable: false,

    // ── Surrounding Amenities ──────────────────────────────────────────────
    // Public Transport
    airport: false,
    busStop: false,
    metroStation: false,
    railwayStation: false,
    rickshawStop: false,
    // Other Amenities
    college: false,
    hospital: false,
    mall: false,
    placeOfWorship: false,
    school: false,
    superMarket: false,
    // Infra
    infraSurroundings: "",  // "developed" | "developing" | "underDeveloped"
    widthOfAccessRoad: "",
    anyOtherSurrounding: "",
    accessibility: "",      // "average" | "good" | "poor" | "veryGood" | "veryPoor"

    // ── Special Privileges ─────────────────────────────────────────────────
    financialDistrict: false,
    sez: false,
    surroundingOccupancy: "", // "fullyOccupied" | "largelyVacant" | "partOccupied"
    rentAmount: "",
    maintenanceCost: "",
    typeOfIndustry: "",
  });

  // Images: [{ id, file, previewUrl, name, longitude, latitude }]
  const [images, setImages] = useState([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(0);
  const [modalForm, setModalForm] = useState({ name: "", longitude: "", latitude: "" });

  const fileInputRef = useRef(null);

  // ── Init from props ────────────────────────────────────────────────────────
  useEffect(() => {
    const src = (data && Object.keys(data).length > 0) ? data : (editData || {});
    const autofillData = extractedData || {};
    if (Object.keys(src).length === 0 && Object.keys(autofillData).length === 0) return;
    const { images: imgs, ...rest } = src;
    setForm((p) => ({ ...p, ...rest, ...autofillData }));
    if (imgs) setImages(imgs);
  }, [editData, data, extractedData]);

  // ── Field helpers ──────────────────────────────────────────────────────────
  const hc = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const hChk = (field) => setForm((p) => ({ ...p, [field]: !p[field] }));

  // ── Image upload ───────────────────────────────────────────────────────────
  const addFiles = (files) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    const newImgs = Array.from(files)
      .filter((f) => allowed.includes(f.type))
      .map((f) => ({
        id: Date.now() + Math.random(),
        file: f,
        previewUrl: URL.createObjectURL(f),
        name: f.name.replace(/\.[^/.]+$/, ""),
        longitude: "",
        latitude: "",
      }));
    setImages((p) => [...p, ...newImgs]);
  };

  const handleFileInput = (e) => {
    addFiles(e.target.files || []);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files || []);
  };

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openModal = (idx) => {
    setModalIdx(idx);
    const img = images[idx];
    setModalForm({ name: img.name, longitude: img.longitude, latitude: img.latitude });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const updateModal = () => {
    setImages((p) =>
      p.map((img, i) => (i === modalIdx ? { ...img, ...modalForm } : img))
    );
    closeModal();
  };

  const navModal = (dir) => {
    const next = (modalIdx + dir + images.length) % images.length;
    setModalIdx(next);
    const img = images[next];
    setModalForm({ name: img.name, longitude: img.longitude, latitude: img.latitude });
  };

  const savePayload = { ...form, images };

  return (
    <>
      <style>{css}</style>
      <div className="am-wrap">

        {/* ══ PROJECT AMENITIES ══════════════════════════════════════════════ */}
        <div className="am-card">
          <div className="am-section-title">Project Amenities</div>

          {/* 4-col checkbox grid */}
          <div className="am-chk-grid-4">
            <label className="am-checkbox">
              <input type="checkbox" checked={form.furnished} onChange={() => hChk("furnished")} />
              Furnished
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.greenBuildingCertified} onChange={() => hChk("greenBuildingCertified")} />
              Green Building Certified
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.hvac} onChange={() => hChk("hvac")} />
              Hvac
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.lift} onChange={() => hChk("lift")} />
              Lift
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.meetingRoom} onChange={() => hChk("meetingRoom")} />
              Meeting Room
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.pantry} onChange={() => hChk("pantry")} />
              Pantry
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.parking} onChange={() => hChk("parking")} />
              Parking
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.viewVista} onChange={() => hChk("viewVista")} />
              View Vista
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.washroom} onChange={() => hChk("washroom")} />
              Washroom
            </label>
          </div>

          {/* Seating Capacity */}
          <div style={{ marginTop: 20 }}>
            <span className="am-field-label">Seating Capacity</span>
            <input
              className="am-input am-narrow"
              value={form.seatingCapacity}
              onChange={(e) => hc("seatingCapacity", e.target.value)}
            />
          </div>

          {/* Frontage Available | Loft Available */}
          <div className="am-chk-grid-2" style={{ marginTop: 20 }}>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.frontageAvailable} onChange={() => hChk("frontageAvailable")} />
              Frontage Available
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.loftAvailable} onChange={() => hChk("loftAvailable")} />
              Loft Available
            </label>
          </div>

          {/* Foot Fall */}
          <div style={{ marginTop: 20 }}>
            <span className="am-field-label">Foot Fall</span>
            <div className="am-radio-row" style={{ marginTop: 6 }}>
              <label className="am-radio">
                <input type="radio" name="footFall" value="high" checked={form.footFall === "high"} onChange={() => hc("footFall", "high")} />
                High
              </label>
              <label className="am-radio">
                <input type="radio" name="footFall" value="low" checked={form.footFall === "low"} onChange={() => hc("footFall", "low")} />
                Low
              </label>
              <label className="am-radio">
                <input type="radio" name="footFall" value="medium" checked={form.footFall === "medium"} onChange={() => hc("footFall", "medium")} />
                Medium
              </label>
            </div>
          </div>

          {/* Ceiling Height */}
          <div style={{ marginTop: 20 }}>
            <span className="am-field-label">Ceiling Height (Ft)</span>
            <input
              className="am-input am-narrow"
              value={form.ceilingHeight}
              onChange={(e) => hc("ceilingHeight", e.target.value)}
            />
          </div>

          {/* Loading Platform Available */}
          <div style={{ marginTop: 20 }}>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.loadingPlatformAvailable} onChange={() => hChk("loadingPlatformAvailable")} />
              Loading Platform Available
            </label>
          </div>
        </div>

        {/* ══ SURROUNDING AMENITIES ══════════════════════════════════════════ */}
        <div className="am-card">
          <div className="am-section-title">Surrounding Amenities</div>

          {/* Public Transport */}
          <div className="am-sub-label" style={{ marginTop: 0 }}>Public Transport In 1 Km Vicinity</div>
          <div className="am-chk-grid-4">
            <label className="am-checkbox">
              <input type="checkbox" checked={form.airport} onChange={() => hChk("airport")} />
              Airport
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.busStop} onChange={() => hChk("busStop")} />
              Bus Stop
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.metroStation} onChange={() => hChk("metroStation")} />
              Metro Station
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.railwayStation} onChange={() => hChk("railwayStation")} />
              Railway Station
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.rickshawStop} onChange={() => hChk("rickshawStop")} />
              Rickshaw Stop
            </label>
          </div>

          {/* Other Amenities */}
          <div className="am-sub-label">Other Amenities In 1 Km Vicinity</div>
          <div className="am-chk-grid-4">
            <label className="am-checkbox">
              <input type="checkbox" checked={form.college} onChange={() => hChk("college")} />
              College
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.hospital} onChange={() => hChk("hospital")} />
              Hospital
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.mall} onChange={() => hChk("mall")} />
              Mall
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.placeOfWorship} onChange={() => hChk("placeOfWorship")} />
              Place Of Worship
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.school} onChange={() => hChk("school")} />
              School
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.superMarket} onChange={() => hChk("superMarket")} />
              Super Market
            </label>
          </div>

          {/* Infra Surroundings */}
          <div className="am-sub-label">Infra Surroundings</div>
          <div className="am-radio-row">
            <label className="am-radio">
              <input type="radio" name="infraSurroundings" value="developed" checked={form.infraSurroundings === "developed"} onChange={() => hc("infraSurroundings", "developed")} />
              Developed
            </label>
            <label className="am-radio">
              <input type="radio" name="infraSurroundings" value="developing" checked={form.infraSurroundings === "developing"} onChange={() => hc("infraSurroundings", "developing")} />
              Developing
            </label>
            <label className="am-radio">
              <input type="radio" name="infraSurroundings" value="underDeveloped" checked={form.infraSurroundings === "underDeveloped"} onChange={() => hc("infraSurroundings", "underDeveloped")} />
              Under Developed
            </label>
          </div>

          {/* Width Of Access Road | Any Other? */}
          <div className="am-two-col" style={{ marginTop: 20 }}>
            <div>
              <span className="am-field-label">Width Of Access Road(ft)</span>
              <input
                className="am-input"
                value={form.widthOfAccessRoad}
                onChange={(e) => hc("widthOfAccessRoad", e.target.value)}
              />
            </div>
            <div>
              <span className="am-field-label">Any Other?</span>
              <input
                className="am-input"
                value={form.anyOtherSurrounding}
                onChange={(e) => hc("anyOtherSurrounding", e.target.value)}
              />
            </div>
          </div>

          {/* Accessibility */}
          <div className="am-sub-label">Accessibility</div>
          <div className="am-radio-row">
            <label className="am-radio">
              <input type="radio" name="accessibility" value="average" checked={form.accessibility === "average"} onChange={() => hc("accessibility", "average")} />
              Average
            </label>
            <label className="am-radio">
              <input type="radio" name="accessibility" value="good" checked={form.accessibility === "good"} onChange={() => hc("accessibility", "good")} />
              Good
            </label>
            <label className="am-radio">
              <input type="radio" name="accessibility" value="poor" checked={form.accessibility === "poor"} onChange={() => hc("accessibility", "poor")} />
              Poor
            </label>
            <label className="am-radio">
              <input type="radio" name="accessibility" value="veryGood" checked={form.accessibility === "veryGood"} onChange={() => hc("accessibility", "veryGood")} />
              Very Good
            </label>
            <label className="am-radio">
              <input type="radio" name="accessibility" value="veryPoor" checked={form.accessibility === "veryPoor"} onChange={() => hc("accessibility", "veryPoor")} />
              Very Poor
            </label>
          </div>
        </div>

        {/* ══ SPECIAL PRIVILEGES ═════════════════════════════════════════════ */}
        <div className="am-card">
          <div className="am-section-title">Special Privileges</div>

          {/* Financial District | Sez */}
          <div className="am-chk-grid-2">
            <label className="am-checkbox">
              <input type="checkbox" checked={form.financialDistrict} onChange={() => hChk("financialDistrict")} />
              Financial District
            </label>
            <label className="am-checkbox">
              <input type="checkbox" checked={form.sez} onChange={() => hChk("sez")} />
              Sez
            </label>
          </div>

          {/* Surrounding Occupancy */}
          <div className="am-sub-label">Surrounding Occupancy</div>
          <div className="am-radio-row">
            <label className="am-radio">
              <input type="radio" name="surroundingOccupancy" value="fullyOccupied" checked={form.surroundingOccupancy === "fullyOccupied"} onChange={() => hc("surroundingOccupancy", "fullyOccupied")} />
              Fully Occupied
            </label>
            <label className="am-radio">
              <input type="radio" name="surroundingOccupancy" value="largelyVacant" checked={form.surroundingOccupancy === "largelyVacant"} onChange={() => hc("surroundingOccupancy", "largelyVacant")} />
              Largely Vacant
            </label>
            <label className="am-radio">
              <input type="radio" name="surroundingOccupancy" value="partOccupied" checked={form.surroundingOccupancy === "partOccupied"} onChange={() => hc("surroundingOccupancy", "partOccupied")} />
              Part Occupied
            </label>
          </div>

          {/* Rent Amount | Maintenance Cost | Type Of Industry */}
          <div className="am-three-col" style={{ marginTop: 20 }}>
            <div>
              <span className="am-field-label">Rent Amount (per sq.ft.)</span>
              <input
                className="am-input"
                value={form.rentAmount}
                onChange={(e) => hc("rentAmount", e.target.value)}
              />
            </div>
            <div>
              <span className="am-field-label">Maintenance Cost</span>
              <input
                className="am-input"
                value={form.maintenanceCost}
                onChange={(e) => hc("maintenanceCost", e.target.value)}
              />
            </div>
            <div>
              <span className="am-field-label">Type Of Industry Occupying Surrounding Premise</span>
              <input
                className="am-input"
                value={form.typeOfIndustry}
                onChange={(e) => hc("typeOfIndustry", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ══ AMENITIES IMAGES ═══════════════════════════════════════════════ */}
        <div className="am-card">
          <div className="am-section-title">Amenities Images</div>

          {/* Upload dragger */}
          <div
            className="am-upload-dragger"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="am-upload-icon">↑</div>
            <div className="am-upload-text">Drag &amp; Drop/ Upload Photo *</div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            multiple
            style={{ display: "none" }}
            onChange={handleFileInput}
          />
          <p className="am-upload-hint">
            * Supported file formats are JPEG, JPG, PNG (Maximum file size 500 KB)
          </p>

          {/* Thumbnail strip */}
          {images.length > 0 && (
            <div className="am-thumb-strip">
              {images.map((img, idx) => (
                <div key={img.id} className="am-thumb-wrap">
                  <div className="am-thumb" onClick={() => openModal(idx)}>
                    <img src={img.previewUrl} alt={img.name} />
                  </div>
                  <span className="am-thumb-name">{img.name || "—"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ ACTIONS ════════════════════════════════════════════════════════ */}
        <div className="am-actions">
          <button
            className="am-btn"
            onClick={() => onSave?.("amenities", savePayload)}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            className="am-btn primary"
            onClick={() => onSaveAndNext?.("amenities", savePayload)}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save & Next"}
          </button>
        </div>

      </div>

      {/* ══ IMAGE DETAIL MODAL ═════════════════════════════════════════════ */}
      {modalOpen && images.length > 0 && (
        <div
          className="am-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="am-modal">
            {/* Header */}
            <div className="am-modal-header">
              <span>Amenities Images Details</span>
              <button className="am-modal-close" onClick={closeModal}>×</button>
            </div>

            {/* Body */}
            <div className="am-modal-body">
              {/* Left — preview + thumbnail strip */}
              <div className="am-modal-left">
                <div className="am-modal-preview">
                  {images[modalIdx] && (
                    <img src={images[modalIdx].previewUrl} alt="preview" />
                  )}
                </div>
                {images.length > 1 && (
                  <div className="am-modal-thumbs">
                    {images.map((img, i) => (
                      <div
                        key={img.id}
                        className={`am-modal-thumb ${i === modalIdx ? "active" : ""}`}
                        onClick={() => {
                          setModalIdx(i);
                          setModalForm({
                            name: img.name,
                            longitude: img.longitude,
                            latitude: img.latitude,
                          });
                        }}
                      >
                        <img src={img.previewUrl} alt={img.name} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right — Name, Longitude, Latitude */}
              <div className="am-modal-right">
                <div className="am-modal-field">
                  <label>Name</label>
                  <input
                    value={modalForm.name}
                    onChange={(e) => setModalForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="am-modal-field">
                  <label>Longitude</label>
                  <input
                    value={modalForm.longitude}
                    onChange={(e) => setModalForm((p) => ({ ...p, longitude: e.target.value }))}
                  />
                </div>
                <div className="am-modal-field">
                  <label>Latitude</label>
                  <input
                    value={modalForm.latitude}
                    onChange={(e) => setModalForm((p) => ({ ...p, latitude: e.target.value }))}
                  />
                </div>
              </div>

              {/* Navigation arrow */}
              {images.length > 1 && (
                <div className="am-modal-nav" onClick={() => navModal(1)}>›</div>
              )}
            </div>

            {/* Footer */}
            <div className="am-modal-footer">
              <button className="am-btn" onClick={closeModal}>Cancel</button>
              <button className="am-btn primary" onClick={updateModal}>Update</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AmenitiesForm;