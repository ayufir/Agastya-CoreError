// MaintenanceBoundariesForm.jsx — iLens replica, scoped CSS, no Ant Design
import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── SCOPED STYLES ───────────────────────────────────────────────────────────
const css = `
  .mb-wrap *, .mb-wrap *::before, .mb-wrap *::after {
    box-sizing: border-box;
  }
  .mb-wrap {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    color: #222;
    width: 100%;
    padding: 16px;
  }

  /* ── Section title ── */
  .mb-wrap .mb-section-title {
    color: #e8472b;
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 16px;
  }

  /* ══════════════════════════════════════════════════════════════
     PROPERTY MAINTENANCE SECTION
  ══════════════════════════════════════════════════════════════ */
  .mb-wrap .mb-pm-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 10px;
    align-items: end;
  }
  .mb-wrap .mb-pm-field {
    display: flex;
    flex-direction: column;
  }
  .mb-wrap .mb-pm-label {
    font-size: 11.5px;
    color: #666;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .mb-wrap .mb-pm-label .req { color: #e8472b; }
  .mb-wrap .mb-pm-input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #bbb;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: #222;
    padding: 4px 2px 6px;
    transition: border-color 0.2s;
  }
  .mb-wrap .mb-pm-input:focus { border-bottom-color: #1677ff; }
  .mb-wrap .mb-pm-input.error { border-bottom-color: #e8472b; }

  /* ── Custom dropdown ── */
  .mb-wrap .mb-select-wrap {
    position: relative;
  }
  .mb-wrap .mb-select {
    width: 100%;
    border: none;
    border-bottom: 1px solid #bbb;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: #222;
    padding: 4px 24px 6px 2px;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .mb-wrap .mb-select:focus { border-bottom-color: #1677ff; }
  .mb-wrap .mb-select-arrow {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #888;
    font-size: 10px;
  }
  .mb-wrap .mb-required-msg {
    color: #e8472b;
    font-size: 11px;
    margin-top: 3px;
  }
  .mb-wrap .mb-pm-section {
    margin-bottom: 24px;
  }

  /* ══════════════════════════════════════════════════════════════
     LEAKAGE & CRACKS SECTION
  ══════════════════════════════════════════════════════════════ */
  .mb-wrap .mb-lc-section {
    margin-bottom: 24px;
  }
  .mb-wrap .mb-lc-checkbox-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }
  .mb-wrap .mb-lc-checkbox {
    width: 16px;
    height: 16px;
    accent-color: #1677ff;
    cursor: pointer;
  }
  .mb-wrap .mb-lc-checkbox-label {
    font-size: 14px;
    font-weight: 600;
    color: #222;
    cursor: pointer;
    user-select: none;
  }
  .mb-wrap .mb-lc-upload-area {
    max-width: 320px;
  }
  .mb-wrap .mb-lc-upload-box {
    border: 1px dashed #ccc;
    border-radius: 4px;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px 20px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    min-height: 110px;
    text-align: center;
  }
  .mb-wrap .mb-lc-upload-box:hover { border-color: #1677ff; background: #f0f6ff; }
  .mb-wrap .mb-lc-upload-box.has-file { border-color: #52c41a; background: #f6ffed; }
  .mb-wrap .mb-lc-upload-icon {
    font-size: 24px;
    color: #999;
    margin-bottom: 8px;
    line-height: 1;
  }
  .mb-wrap .mb-lc-upload-text {
    font-size: 12px;
    color: #888;
  }
  .mb-wrap .mb-lc-upload-filename {
    font-size: 11px;
    color: #52c41a;
    margin-top: 4px;
  }
  .mb-wrap .mb-lc-upload-hint {
    font-size: 11px;
    color: #aaa;
    margin-top: 6px;
    line-height: 1.5;
  }

  /* ── 4-column boundaries grid ── */
  .mb-wrap .mb-dir-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  /* ── Direction card ── */
  .mb-wrap .mb-dir-card {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #fff;
    overflow: hidden;
  }
  .mb-wrap .mb-dir-header {
    padding: 8px 14px;
    font-weight: 700;
    font-size: 14px;
    color: #222;
    border-bottom: 1px solid #e0e0e0;
    background: #fff;
  }
  .mb-wrap .mb-dir-body {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ── Input fields ── */
  .mb-wrap .mb-field-label {
    font-size: 11.5px;
    color: #666;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .mb-wrap .mb-field-label .req { color: #e8472b; }

  .mb-wrap .mb-input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #bbb;
    outline: none;
    background: transparent;
    font-size: 13px;
    color: #222;
    padding: 4px 2px 6px;
    transition: border-color 0.2s;
  }
  .mb-wrap .mb-input:focus { border-bottom-color: #1677ff; }

  /* ── Upload dragger ── */
  .mb-wrap .mb-upload-box {
    border: 1px dashed #ccc;
    border-radius: 4px;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 18px 10px 14px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    min-height: 110px;
    text-align: center;
  }
  .mb-wrap .mb-upload-box:hover { border-color: #1677ff; background: #f0f6ff; }
  .mb-wrap .mb-upload-box.has-file { border-color: #52c41a; background: #f6ffed; }
  .mb-wrap .mb-upload-icon {
    font-size: 22px;
    color: #999;
    margin-bottom: 6px;
    line-height: 1;
  }
  .mb-wrap .mb-upload-text {
    font-size: 12px;
    color: #888;
  }
  .mb-wrap .mb-upload-filename {
    font-size: 11px;
    color: #52c41a;
    margin-top: 4px;
  }
  .mb-wrap .mb-upload-hint {
    font-size: 11px;
    color: #aaa;
    margin-top: 6px;
    line-height: 1.5;
  }

  /* ── Flags row (3 groups side by side) ── */
  .mb-wrap .mb-flags-row {
    display: flex;
    gap: 0;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #fff;
    margin-bottom: 16px;
  }
  .mb-wrap .mb-flag-group {
    flex: 1;
    padding: 14px 20px;
    border-right: 1px solid #e8e8e8;
  }
  .mb-wrap .mb-flag-group:last-child { border-right: none; }
  .mb-wrap .mb-flag-label {
    font-size: 12px;
    color: #444;
    font-weight: 500;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .mb-wrap .mb-flag-label .info-icon {
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 1px solid #aaa;
    color: #888;
    font-size: 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    flex-shrink: 0;
  }
  .mb-wrap .mb-radio-group {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .mb-wrap .mb-radio {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 13px;
    color: #333;
  }
  .mb-wrap .mb-radio input[type="radio"] {
    accent-color: #e8472b;
    width: 14px; height: 14px;
    cursor: pointer;
  }

  /* ── Sketch uploader (conditional) ── */
  .mb-wrap .mb-sketch-upload-wrap {
    margin-bottom: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #fff;
    padding: 16px 20px;
  }
  .mb-wrap .mb-sketch-upload-title {
    font-size: 12px;
    color: #555;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .mb-wrap .mb-sketch-upload-box {
    border: 1px dashed #ccc;
    border-radius: 4px;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    cursor: pointer;
    max-width: 320px;
    transition: border-color 0.2s;
    text-align: center;
  }
  .mb-wrap .mb-sketch-upload-box:hover { border-color: #1677ff; }
  .mb-wrap .mb-sketch-upload-box.has-file { border-color: #52c41a; }

  /* ── Remarks ── */
  .mb-wrap .mb-remarks-title {
    color: #e8472b;
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 10px;
  }
  .mb-wrap .mb-remarks-wrap {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 4px;
    background: #fff;
  }
  .mb-wrap .mb-rte-toolbar {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 6px 8px;
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
  }
  .mb-wrap .mb-rte-btn {
    width: 28px; height: 26px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: #444;
    transition: background 0.15s;
    padding: 0;
  }
  .mb-wrap .mb-rte-btn:hover { background: #e0e0e0; }
  .mb-wrap .mb-rte-btn.active { background: #d0d0d0; }
  .mb-wrap .mb-rte-divider {
    width: 1px; height: 18px;
    background: #d0d0d0;
    margin: 0 4px;
  }
  .mb-wrap .mb-rte-editor {
    min-height: 120px;
    padding: 10px 12px;
    outline: none;
    font-size: 13px;
    color: #222;
    line-height: 1.6;
  }
  .mb-wrap .mb-rte-editor:empty::before {
    content: attr(data-placeholder);
    color: #bbb;
    pointer-events: none;
  }
  .mb-wrap .mb-char-count {
    text-align: right;
    font-size: 11px;
    color: #aaa;
    margin-top: 3px;
    margin-bottom: 24px;
  }

  /* ── Action buttons ── */
  .mb-wrap .mb-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #e8e8e8;
  }
  .mb-wrap .mb-btn {
    padding: 7px 32px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    background: #fff;
    color: #333;
    transition: all 0.2s;
    font-weight: 500;
  }
  .mb-wrap .mb-btn:hover { border-color: #1677ff; color: #1677ff; }
  .mb-wrap .mb-btn.primary {
    background: #1b3a6b;
    color: #fff;
    border-color: #1b3a6b;
  }
  .mb-wrap .mb-btn.primary:hover { background: #152f58; }
  .mb-wrap .mb-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── Toast ── */
  .mb-toast {
    position: fixed; top: 16px; right: 16px; z-index: 9999;
    color: #fff; padding: 8px 16px; border-radius: 4px;
    font-size: 13px; box-shadow: 0 2px 8px rgba(0,0,0,.2);
  }

  @media (max-width: 900px) {
    .mb-wrap .mb-pm-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .mb-wrap .mb-dir-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .mb-wrap .mb-flags-row { flex-direction: column; gap: 0; }
    .mb-wrap .mb-flag-group { border-right: none; border-bottom: 1px solid #e8e8e8; }
    .mb-wrap .mb-flag-group:last-child { border-bottom: none; }
    .mb-wrap .mb-actions { flex-direction: column; gap: 8px; }
    .mb-wrap .mb-btn { width: 100%; text-align: center; }
  }

  @media (max-width: 500px) {
    .mb-wrap .mb-pm-grid { grid-template-columns: 1fr; }
    .mb-wrap .mb-dir-grid { grid-template-columns: 1fr; }
  }
`;

// ─── DIRECTION CARD ───────────────────────────────────────────────────────────
const DirectionCard = ({ dir, form, onChange, onToast }) => {
  const key = dir.toLowerCase(); // east, west, north, south
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const ok = ["image/jpeg", "image/jpg", "image/png"].includes(file.type);
    if (!ok) { onToast("Only JPEG, JPG, PNG supported.", "error"); return; }
    if (file.size > 500 * 1024) { onToast("Max file size is 500 KB.", "error"); return; }
    onChange(`${key}Photo`, file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const photo = form[`${key}Photo`];

  return (
    <div className="mb-dir-card">
      <div className="mb-dir-header">{dir}</div>
      <div className="mb-dir-body">
        {/* As Per Document */}
        <div>
          <div className="mb-field-label">As Per Document <span className="req">*</span></div>
          <input
            className="mb-input"
            value={form[`${key}AsPerDocument`] ?? ""}
            onChange={(e) => onChange(`${key}AsPerDocument`, e.target.value)}
            placeholder=""
          />
        </div>

        {/* As Per Site Visit */}
        <div>
          <div className="mb-field-label">As Per Site Visit <span className="req">*</span></div>
          <input
            className="mb-input"
            value={form[`${key}AsPerSiteVisit`] ?? ""}
            onChange={(e) => onChange(`${key}AsPerSiteVisit`, e.target.value)}
            placeholder=""
          />
        </div>

        {/* Linear Dimensions */}
        <div>
          <div className="mb-field-label">Linear Dimensions(ft)</div>
          <input
            className="mb-input"
            value={form[`${key}LinearDimensions`] ?? ""}
            onChange={(e) => onChange(`${key}LinearDimensions`, e.target.value)}
            placeholder=""
          />
        </div>

        {/* Upload */}
        <div>
          <div
            className={`mb-upload-box ${photo ? "has-file" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="mb-upload-icon">↑</div>
            <div className="mb-upload-text">Drag &amp; Drop/ Upload Photo *</div>
            {photo && <div className="mb-upload-filename">✓ {photo.name}</div>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p className="mb-upload-hint">
            * Supported file formats are JPEG, JPG, PNG<br />(Maximum file size 500 KB)
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── SKETCH UPLOADER ─────────────────────────────────────────────────────────
const SketchUploader = ({ form, onChange, onToast }) => {
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const ok = ["image/jpeg", "image/jpg", "image/png"].includes(file.type);
    if (!ok) { onToast("Only JPEG, JPG, PNG supported.", "error"); return; }
    if (file.size > 500 * 1024) { onToast("Max file size is 500 KB.", "error"); return; }
    onChange("sketchPhoto", file);
  };

  return (
    <div className="mb-sketch-upload-wrap">
      <div className="mb-sketch-upload-title">Upload Plot Sketch *</div>
      <div
        className={`mb-sketch-upload-box ${form.sketchPhoto ? "has-file" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
      >
        <div style={{ fontSize: 22, color: "#999", marginBottom: 6 }}>↑</div>
        <div style={{ fontSize: 12, color: "#888" }}>Drag &amp; Drop / Upload Sketch *</div>
        {form.sketchPhoto && (
          <div style={{ fontSize: 11, color: "#52c41a", marginTop: 4 }}>✓ {form.sketchPhoto.name}</div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <p style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>
        * Supported file formats are JPEG, JPG, PNG (Maximum file size 500 KB)
      </p>
    </div>
  );
};

// ─── RICH TEXT EDITOR ────────────────────────────────────────────────────────
const RichTextEditor = ({ value, onChange, maxLength = 1000 }) => {
  const editorRef = useRef(null);
  const [charCount, setCharCount] = useState(0);

  const exec = (cmd, val) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    updateCount();
  };

  const updateCount = () => {
    const text = editorRef.current?.innerText || "";
    setCharCount(text.length);
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleInput = () => updateCount();

  const handleKeyDown = (e) => {
    const text = editorRef.current?.innerText || "";
    if (text.length >= maxLength && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const ToolBtn = ({ cmd, val, title, children, isActive }) => (
    <button
      type="button"
      className={`mb-rte-btn ${isActive ? "active" : ""}`}
      title={title}
      onMouseDown={(e) => { e.preventDefault(); exec(cmd, val); }}
    >
      {children}
    </button>
  );

  return (
    <div>
      <div className="mb-remarks-wrap">
        <div className="mb-rte-toolbar">
          <ToolBtn cmd="bold" title="Bold"><b>B</b></ToolBtn>
          <ToolBtn cmd="italic" title="Italic"><i>I</i></ToolBtn>
          <ToolBtn cmd="underline" title="Underline"><u>U</u></ToolBtn>
          <div className="mb-rte-divider" />
          <ToolBtn cmd="foreColor" val="#e8472b" title="Text Color">
            <span style={{ color: "#e8472b", fontWeight: 700 }}>A</span>
          </ToolBtn>
          <ToolBtn cmd="strikeThrough" title="Strikethrough">
            <s>S</s>
          </ToolBtn>
          <div className="mb-rte-divider" />
          <ToolBtn cmd="insertOrderedList" title="Numbered List">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1h2M1 4h2M1 7h2M5 1h8M5 4h8M5 7h8" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
              <text x="1" y="13" fontSize="5" fill="#555">1.</text>
              <path d="M5 11h8" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </ToolBtn>
          <ToolBtn cmd="insertUnorderedList" title="Bullet List">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="2" cy="3" r="1.2" fill="#555"/>
              <circle cx="2" cy="7" r="1.2" fill="#555"/>
              <circle cx="2" cy="11" r="1.2" fill="#555"/>
              <path d="M5 3h8M5 7h8M5 11h8" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </ToolBtn>
          <ToolBtn cmd="justifyLeft" title="Align Left">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 3h12M1 6h8M1 9h12M1 12h8" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </ToolBtn>
        </div>
        <div
          ref={editorRef}
          className="mb-rte-editor"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Enter remarks here..."
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="mb-char-count">{charCount}/{maxLength}</div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const MaintenanceBoundariesForm = ({ data, editData, extractedData, onSave, onSaveAndNext, saving }) => {
  const [form, setForm] = useState({
    // ── Property Maintenance ──
    propertyAge: "",
    residualAge: "",
    internalMaintenance: "",
    externalMaintenance: "",
    // ── Leakage & Cracks ──
    leakageCracks: false,
    leakageCracksPhoto: null,
    // East
    eastAsPerDocument: "",
    eastAsPerSiteVisit: "",
    eastLinearDimensions: "",
    eastPhoto: null,
    // West
    westAsPerDocument: "",
    westAsPerSiteVisit: "",
    westLinearDimensions: "",
    westPhoto: null,
    // North
    northAsPerDocument: "",
    northAsPerSiteVisit: "",
    northLinearDimensions: "",
    northPhoto: null,
    // South
    southAsPerDocument: "",
    southAsPerSiteVisit: "",
    southLinearDimensions: "",
    southPhoto: null,
    // Flags
    capturePlotSketch: null,
    plotDemarcated: null,
    boundariesMatching: null,
    // Sketch upload (shown when capturePlotSketch === true)
    sketchPhoto: null,
    // Remarks (HTML)
    remarks: "",
  });

  const [toast, setToast] = useState(null);
  const lcFileInputRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    const src = (data && Object.keys(data).length > 0) ? data : (editData || {});
    const autofillData = extractedData || {};
    if (Object.keys(src).length === 0 && Object.keys(autofillData).length === 0) return;
    setForm((prev) => ({ ...prev, ...src, ...autofillData }));
  }, [editData, data, extractedData]);

  const handleChange = useCallback((field, value) => {
    setForm((prev) => {
      const u = { ...prev, [field]: value };
      // Hide sketch upload when switching to No
      if (field === "capturePlotSketch" && value === false) {
        u.sketchPhoto = null;
      }
      return u;
    });
  }, []);

  // ── Leakage & Cracks photo handler ──────────────────────────────────────────
  const handleLcFile = (file) => {
    if (!file) return;
    const ok = ["image/jpeg", "image/jpg", "image/png"].includes(file.type);
    if (!ok) { showToast("Only JPEG, JPG, PNG supported.", "error"); return; }
    if (file.size > 500 * 1024) { showToast("Max file size is 500 KB.", "error"); return; }
    handleChange("leakageCracksPhoto", file);
  };

  const DIRECTIONS = ["East", "West", "North", "South"];

  const MAINTENANCE_OPTIONS = ["Very Good", "Good", "Average", "Poor", "Very Poor"];

  const FlagGroup = ({ field, label, info }) => (
    <div className="mb-flag-group">
      <div className="mb-flag-label">
        {label}
        {info && <span className="info-icon" title="Info">i</span>}
      </div>
      <div className="mb-radio-group">
        <label className="mb-radio">
          <input
            type="radio"
            name={field}
            checked={form[field] === true}
            onChange={() => handleChange(field, true)}
          />
          Yes
        </label>
        <label className="mb-radio">
          <input
            type="radio"
            name={field}
            checked={form[field] === false}
            onChange={() => handleChange(field, false)}
          />
          No
        </label>
      </div>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      {toast && (
        <div
          className="mb-toast"
          style={{ background: toast.type === "error" ? "#ff4d4f" : "#52c41a" }}
        >
          {toast.msg}
        </div>
      )}

      <div className="mb-wrap">

        {/* ══ PROPERTY MAINTENANCE ══════════════════════════════════════════ */}
        <div className="mb-pm-section">
          <div className="mb-section-title">Property Maintenance</div>
          <div className="mb-pm-grid">
            {/* Property Age */}
            <div className="mb-pm-field">
              <div className="mb-pm-label">
                Property Age(yrs) <span className="req">*</span>
              </div>
              <input
                className="mb-pm-input"
                type="number"
                min="0"
                value={form.propertyAge}
                onChange={(e) => handleChange("propertyAge", e.target.value)}
                placeholder=""
              />
            </div>

            {/* Residual Age */}
            <div className="mb-pm-field">
              <div className="mb-pm-label">
                Residual Age(yrs) <span className="req">*</span>
              </div>
              <input
                className="mb-pm-input"
                type="number"
                min="0"
                value={form.residualAge}
                onChange={(e) => handleChange("residualAge", e.target.value)}
                placeholder=""
              />
            </div>

            {/* Internal Maintenance */}
            <div className="mb-pm-field">
              <div className="mb-pm-label">
                Internal Maintenance <span className="req">*</span>
              </div>
              <div className="mb-select-wrap">
                <select
                  className="mb-select"
                  value={form.internalMaintenance}
                  onChange={(e) => handleChange("internalMaintenance", e.target.value)}
                >
                  <option value=""></option>
                  {MAINTENANCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <span className="mb-select-arrow">▼</span>
              </div>
              {!form.internalMaintenance && (
                <div className="mb-required-msg">*required</div>
              )}
            </div>

            {/* External Maintenance */}
            <div className="mb-pm-field">
              <div className="mb-pm-label">
                External Maintenance <span className="req">*</span>
              </div>
              <div className="mb-select-wrap">
                <select
                  className="mb-select"
                  value={form.externalMaintenance}
                  onChange={(e) => handleChange("externalMaintenance", e.target.value)}
                >
                  <option value=""></option>
                  {MAINTENANCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <span className="mb-select-arrow">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ LEAKAGE & CRACKS ══════════════════════════════════════════════ */}
        <div className="mb-lc-section">
          <div className="mb-lc-checkbox-row">
            <input
              id="lc-checkbox"
              type="checkbox"
              className="mb-lc-checkbox"
              checked={form.leakageCracks}
              onChange={(e) => {
                  handleChange("leakageCracks", e.target.checked);
                  if (!e.target.checked) handleChange("leakageCracksPhoto", null);
                }}
            />
            <label htmlFor="lc-checkbox" className="mb-lc-checkbox-label">
              Leakage &amp; Cracks
            </label>
          </div>

          {form.leakageCracks && (
            <div className="mb-lc-upload-area">
              <div
                className={`mb-lc-upload-box ${form.leakageCracksPhoto ? "has-file" : ""}`}
                onClick={() => lcFileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleLcFile(e.dataTransfer.files?.[0]); }}
              >
                <div className="mb-lc-upload-icon">↑</div>
                <div className="mb-lc-upload-text">Drag &amp; Drop/ Upload Photo *</div>
                {form.leakageCracksPhoto && (
                  <div className="mb-lc-upload-filename">✓ {form.leakageCracksPhoto.name}</div>
                )}
              </div>
              <input
                ref={lcFileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                style={{ display: "none" }}
                onChange={(e) => handleLcFile(e.target.files?.[0])}
              />
              <p className="mb-lc-upload-hint">
                * Supported file formats are JPEG, JPG, PNG (Maximum file size 500 KB)
              </p>
            </div>
          )}
        </div>

        {/* ══ BOUNDARIES TITLE ══════════════════════════════════════════════ */}
        <div className="mb-section-title">Boundaries</div>

        {/* ══ 4-COLUMN DIRECTION CARDS ══════════════════════════════════════ */}
        <div className="mb-dir-grid">
          {DIRECTIONS.map((dir) => (
            <DirectionCard
              key={dir}
              dir={dir}
              form={form}
              onChange={handleChange}
              onToast={showToast}
            />
          ))}
        </div>

        {/* ══ FLAGS ROW ═════════════════════════════════════════════════════ */}
        <div className="mb-flags-row">
          <FlagGroup
            field="capturePlotSketch"
            label="Capture Plot Sketch For Irregular Shape Plots"
            info
          />
          <FlagGroup field="plotDemarcated" label="Plot Demarcated" />
          <FlagGroup field="boundariesMatching" label="Boundaries Are Matching" />
        </div>

        {/* ══ SKETCH UPLOAD (conditional on capturePlotSketch = Yes) ════════ */}
        {form.capturePlotSketch === true && (
          <SketchUploader form={form} onChange={handleChange} onToast={showToast} />
        )}

        {/* ══ REMARKS ═══════════════════════════════════════════════════════ */}
        <div className="mb-remarks-title">Remarks</div>
        <RichTextEditor
          value={form.remarks}
          onChange={(val) => handleChange("remarks", val)}
          maxLength={1000}
        />

        {/* ══ ACTION BUTTONS ════════════════════════════════════════════════ */}
        <div className="mb-actions">
          <button
            className="mb-btn"
            onClick={() => onSave?.("maintenanceBoundaries", form)}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            className="mb-btn primary"
            onClick={() => onSaveAndNext?.("maintenanceBoundaries", form)}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save & Next"}
          </button>
        </div>
      </div>
    </>
  );
};

export default MaintenanceBoundariesForm;