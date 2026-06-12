import React, { useEffect, useState } from "react";

function getFloorLabel(key) {
  if (key?.startsWith("basement_")) return `Basement ${key.replace("basement_", "")}`;
  if (key?.startsWith("parking_")) return `Parking ${key.replace("parking_", "")}`;
  if (key === "ground") return "Ground Floor";
  const n = parseInt(key, 10);
  if (!Number.isFinite(n)) return key || "";
  return `Floor ${n}`;
}

const plotAreaRows = (rows, area) => {
  const base = Array.isArray(rows) && rows.length
    ? rows
    : [{ description: "Plot Area (Sqft)", area: "", rate: "" }];
  return base.map((row, index) =>
    index === 0
      ? { ...row, description: "Plot Area (Sqft)", area: area || row.area || "" }
      : row
  );
};

const getAreaTotal = (areaData, floorKey, unitId, field) => {
  const unit = (areaData?.[floorKey] || []).find((item) => item.id === unitId);
  return (unit?.areas || []).reduce((sum, area) => {
    const carpet = (parseFloat(area.length) || 0) * (parseFloat(area.width) || 0);
    const saleable = carpet * (parseFloat(area.loadingFactor) || 1);
    return sum + (field === "saleableArea" ? saleable : carpet);
  }, 0);
};

const getUnitAreaTotals = (areaData, floorKey, unitId) => ({
  carpetArea: getAreaTotal(areaData, floorKey, unitId, "carpetArea"),
  saleableArea: getAreaTotal(areaData, floorKey, unitId, "saleableArea"),
});

const buildUnitRows = (selectedFloors, floorDetails, areaData, valuationOn, existingRows = []) => {
  const rows = [];
  selectedFloors.forEach((floorKey) => {
    const groupLabel = getFloorLabel(floorKey);
    rows.push({ type: "header", description: groupLabel, floorKey });
    (floorDetails?.[floorKey] || []).forEach((unit, index) => {
      const floorNo = unit.unitNo || String(index + 1);
      const existing = existingRows.find((row) =>
        row.type === "row" &&
        ((row.floorKey === floorKey && row.unitId === unit.id) ||
          (!row.floorKey && row.groupLabel === groupLabel && row.floorNo === floorNo))
      );
      const areaTotals = getUnitAreaTotals(areaData, floorKey, unit.id);
      const legacyArea = existing?.area || "";
      rows.push({
        type: "row",
        floorKey,
        unitId: unit.id,
        groupLabel,
        floorNo,
        carpetArea: existing?.carpetArea || (valuationOn === "carpetArea" ? legacyArea : "") || (areaTotals.carpetArea ? areaTotals.carpetArea.toFixed(2) : ""),
        saleableArea: existing?.saleableArea || (valuationOn === "saleableArea" ? legacyArea : "") || (areaTotals.saleableArea ? areaTotals.saleableArea.toFixed(2) : ""),
        rate: existing?.rate || "",
      });
    });
  });
  return rows;
};

const RealizableValueForm = ({ data, editData, extractedData, onSave, onSaveAndNext, saving }) => {
  const source = data || editData || {};
  const plotAreaFromProperty = String(source.plotAreaSqft || "").trim();
  const selectedFloorKeys = Array.isArray(source.selectedFloors) ? source.selectedFloors : [];
  const savedFloorDetails = source.floorDetails || {};
  const savedAreaData = source.areaData || {};

  const [methodology, setMethodology] = useState(source.valuationMethodology || source.methodology || "");
  const [showBanner, setShowBanner] = useState(true);

  // ── selfConstruction state ──────────────────────────────────────────────
  const [landRows, setLandRows] = useState([{ description: "Plot Area (Sqft)", area: "", rate: "" }]);
  const [amenityRows, setAmenityRows] = useState([{ description: "", qty: "", rate: "" }]);
  const [scArea, setScArea] = useState("0");
  const [scApproved, setScApproved] = useState("");
  const [buildingUsage, setBuildingUsage] = useState("");
  const [govRows, setGovRows] = useState([
    { desc: "Land/BU/SBU", area: "", rate: "" },
    { desc: "Construction", area: "", rate: "" },
  ]);

  // ── saleComparison state ────────────────────────────────────────────────
  const [saleLandRows, setSaleLandRows] = useState([{ description: "Plot Area (Sqft)", area: "", rate: "" }]);
  const [saleValuationOn, setSaleValuationOn] = useState("carpetArea");
  const [saleUnitRows, setSaleUnitRows] = useState([]);
  const [saleBuildingUsage, setSaleBuildingUsage] = useState("commercial");
  const [saleGovRows, setSaleGovRows] = useState([
    { desc: "Land/BU/SBU", area: "", rate: "" },
    { desc: "Construction", area: "", rate: "" },
  ]);
  const [saleConstArea, setSaleConstArea] = useState("");
  const [saleConstApproved, setSaleConstApproved] = useState("");

  // ── incomeApproach state ────────────────────────────────────────────────
  const [valuationOn, setValuationOn] = useState("entireBuilding");

  // Entire Building
  const [ebBuiltUpArea, setEbBuiltUpArea] = useState("");
  const [ebAvgRent, setEbAvgRent] = useState("");
  const [ebMonthlyRent, setEbMonthlyRent] = useState("");
  const [ebAnnualRent, setEbAnnualRent] = useState("");
  const [ebSecDeposit, setEbSecDeposit] = useState("");
  const [ebInterestPct, setEbInterestPct] = useState("");
  const [ebMaintPct, setEbMaintPct] = useState("");
  const [ebTaxes, setEbTaxes] = useState("");
  const [ebCapRate, setEbCapRate] = useState("");
  const [iaArea, setIaArea] = useState("0");
  const [iaApproved, setIaApproved] = useState("");

  // Unit Number — rows mirror the floor/unit structure from Property Details
  // Each unit row: { groupLabel, unitNo, buArea, avgRent, monthlyRent, annualRent, secDeposit, interestPct }
  const [unitRows, setUnitRows] = useState([
    { groupLabel: "Basement2", unitNo: "1", buArea: "", avgRent: "", monthlyRent: "", annualRent: "", secDeposit: "", interestPct: "" },
    { groupLabel: "Basement1", unitNo: "1", buArea: "", avgRent: "", monthlyRent: "", annualRent: "", secDeposit: "", interestPct: "" },
  ]);
  const [unMaintPct, setUnMaintPct] = useState("");
  const [unTaxes, setUnTaxes] = useState("");
  const [unCapRate, setUnCapRate] = useState("");
  const [unConstArea, setUnConstArea] = useState("2");
  const [unConstApproved, setUnConstApproved] = useState("");
  const [inlineError, setInlineError] = useState("");
  const propertyFloorDetailsError = "Please Complete the floor details under propertydetail";

  useEffect(() => {
    const src = (data && Object.keys(data).length > 0) ? data : (editData || {});
    const autofillData = extractedData || {};
    if (Object.keys(src).length === 0 && Object.keys(autofillData).length === 0) return;

    setMethodology(autofillData.valuationMethodology || src.valuationMethodology || src.methodology || "");
    setLandRows(plotAreaRows(src.landRows, autofillData.plotAreaSqft || src.plotAreaSqft));
    setSaleLandRows(plotAreaRows(src.saleLandRows, autofillData.plotAreaSqft || src.plotAreaSqft));
    if (Array.isArray(src.amenityRows)) setAmenityRows(src.amenityRows);
    if (src.scArea !== undefined) setScArea(src.scArea);
    if (src.scApproved !== undefined) setScApproved(src.scApproved);
    if (src.buildingUsage !== undefined) setBuildingUsage(src.buildingUsage);
    if (Array.isArray(src.govRows)) setGovRows(src.govRows);
    if (src.saleValuationOn) setSaleValuationOn(src.saleValuationOn);
    if (src.saleBuildingUsage !== undefined) setSaleBuildingUsage(src.saleBuildingUsage);
    if (Array.isArray(src.saleGovRows)) setSaleGovRows(src.saleGovRows);
    if (src.saleConstArea !== undefined) setSaleConstArea(src.saleConstArea);
    if (src.saleConstApproved !== undefined) setSaleConstApproved(src.saleConstApproved);
    if (src.valuationOn) setValuationOn(src.valuationOn);
    if (src.ebBuiltUpArea !== undefined) setEbBuiltUpArea(src.ebBuiltUpArea);
    if (src.ebAvgRent !== undefined) setEbAvgRent(src.ebAvgRent);
    if (src.ebMonthlyRent !== undefined) setEbMonthlyRent(src.ebMonthlyRent);
    if (src.ebAnnualRent !== undefined) setEbAnnualRent(src.ebAnnualRent);
    if (src.ebSecDeposit !== undefined) setEbSecDeposit(src.ebSecDeposit);
    if (src.ebInterestPct !== undefined) setEbInterestPct(src.ebInterestPct);
    if (src.ebMaintPct !== undefined) setEbMaintPct(src.ebMaintPct);
    if (src.ebTaxes !== undefined) setEbTaxes(src.ebTaxes);
    if (src.ebCapRate !== undefined) setEbCapRate(src.ebCapRate);
    if (src.iaArea !== undefined) setIaArea(src.iaArea);
    if (src.iaApproved !== undefined) setIaApproved(src.iaApproved);
    if (Array.isArray(src.unitRows)) setUnitRows(src.unitRows);
    if (src.unMaintPct !== undefined) setUnMaintPct(src.unMaintPct);
    if (src.unTaxes !== undefined) setUnTaxes(src.unTaxes);
    if (src.unCapRate !== undefined) setUnCapRate(src.unCapRate);
    if (src.unConstArea !== undefined) setUnConstArea(src.unConstArea);
    if (src.unConstApproved !== undefined) setUnConstApproved(src.unConstApproved);
    if (Array.isArray(src.selectedFloors)) {
      setSaleUnitRows(buildUnitRows(
        src.selectedFloors,
        src.floorDetails || {},
        src.areaData || {},
        src.saleValuationOn || saleValuationOn,
        src.saleUnitRows || saleUnitRows
      ));
    } else if (Array.isArray(src.saleUnitRows)) {
      setSaleUnitRows(src.saleUnitRows);
    }
  }, [data, editData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!plotAreaFromProperty) return;
    setLandRows((rows) => plotAreaRows(rows, plotAreaFromProperty));
    setSaleLandRows((rows) => plotAreaRows(rows, plotAreaFromProperty));
  }, [plotAreaFromProperty]);

  useEffect(() => {
    if (!selectedFloorKeys.length) {
      setSaleUnitRows([]);
      return;
    }
    setSaleUnitRows((rows) =>
      buildUnitRows(selectedFloorKeys, savedFloorDetails, savedAreaData, saleValuationOn, rows)
    );
  }, [selectedFloorKeys.join(","), savedFloorDetails, savedAreaData, saleValuationOn]);

  // ── helpers ─────────────────────────────────────────────────────────────
  const num = (v) => parseFloat(v) || 0;
  const calcAmount = (a, b) => num(a) * num(b);
  const fmt = (n) => n.toLocaleString("en-IN");
  const toWords = (n) => n === 0 ? "Zero Rupees Only" : `${fmt(n)} Rupees Only`;

  // selfConstruction
  const scCostConst = calcAmount(scArea, scApproved);
  const landTotal   = landRows.reduce((s, r) => s + calcAmount(r.area, r.rate), 0);
  const amenTotal   = amenityRows.reduce((s, r) => s + calcAmount(r.qty, r.rate), 0);
  const realizable  = landTotal + scCostConst + amenTotal;

  // saleComparison
  const saleLandTotal    = saleLandRows.reduce((s, r) => s + calcAmount(r.area, r.rate), 0);
  const getSaleUnitArea = (row) => saleValuationOn === "saleableArea"
    ? (row.saleableArea ?? row.area)
    : (row.carpetArea ?? row.area);
  const saleUnitTotal    = saleUnitRows.filter(r => r.type === "row").reduce((s, r) => s + calcAmount(getSaleUnitArea(r), r.rate), 0);
  const saleUnitCarpetTotal = saleUnitRows.filter(r => r.type === "row").reduce((s, r) => s + num(r.carpetArea ?? (saleValuationOn === "carpetArea" ? r.area : 0)), 0);
  const saleUnitSaleableTotal = saleUnitRows.filter(r => r.type === "row").reduce((s, r) => s + num(r.saleableArea ?? (saleValuationOn === "saleableArea" ? r.area : 0)), 0);
  const saleRealizable   = saleLandTotal + saleUnitTotal;
  const saleGovTotal     = saleGovRows.reduce((s, r) => s + calcAmount(r.area, r.rate), 0);
  const saleConstCost    = calcAmount(saleConstArea, saleConstApproved);

  // incomeApproach – Entire Building
  const ebInterestAmt      = calcAmount(ebSecDeposit, num(ebInterestPct) / 100);
  const ebGrossMaintRent   = num(ebAnnualRent) + ebInterestAmt;
  const ebMaintRepairAmt   = ebGrossMaintRent * (num(ebMaintPct) / 100);
  const ebNetAnnualRent    = ebGrossMaintRent - ebMaintRepairAmt - num(ebTaxes);
  const ebRealizable       = num(ebCapRate) > 0 ? (ebNetAnnualRent / (num(ebCapRate) / 100)) : 0;
  const iaCostConst        = calcAmount(iaArea, iaApproved);

  // incomeApproach – Unit Number
  const unGrossMaintRent = unitRows.reduce((s, r) => {
    const annualR  = num(r.annualRent);
    const intAmt   = calcAmount(r.secDeposit, num(r.interestPct) / 100);
    return s + annualR + intAmt;
  }, 0);
  const unMaintRepairAmt = unGrossMaintRent * (num(unMaintPct) / 100);
  const unNetAnnualRent  = unGrossMaintRent - unMaintRepairAmt - num(unTaxes);
  const unRealizable     = num(unCapRate) > 0 ? (unNetAnnualRent / (num(unCapRate) / 100)) : 0;
  const unConstCost      = calcAmount(unConstArea, unConstApproved);

  const inputCls = "border-0 border-b border-gray-300 w-full text-sm py-1 outline-none focus:border-blue-900 bg-transparent";
  const labelCls = "block text-xs text-gray-500 mb-1";
  const sectionTitle = "text-red-600 font-semibold text-sm mb-3";
  const summaryBox = "border border-gray-200 rounded p-3 text-sm font-semibold mb-3 bg-gray-50";

  const missingSelectedUnits = selectedFloorKeys.some((key) => {
    const units = savedFloorDetails[key];
    return !Array.isArray(units) || units.length === 0;
  });
  const showFloorUnitError = methodology === "saleComparison" && missingSelectedUnits;
  const propertyFloorDetailsComplete = selectedFloorKeys.length > 0 && !missingSelectedUnits;
  const saleComparisonBlocked = methodology === "saleComparison" && !propertyFloorDetailsComplete;

  useEffect(() => {
    if (propertyFloorDetailsComplete && inlineError === propertyFloorDetailsError) {
      setInlineError("");
    }
  }, [propertyFloorDetailsComplete, inlineError]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUnitRow = (i, field, val) => {
    const rows = [...unitRows];
    rows[i][field] = val;
    setUnitRows(rows);
  };

  const buildPayload = () => ({
    valuationMethodology: methodology,
    methodology,
    landRows,
    amenityRows,
    scArea,
    scApproved,
    buildingUsage,
    govRows,
    saleLandRows,
    saleValuationOn,
    saleUnitRows,
    saleBuildingUsage,
    saleGovRows,
    saleConstArea,
    saleConstApproved,
    valuationOn,
    ebBuiltUpArea,
    ebAvgRent,
    ebMonthlyRent,
    ebAnnualRent,
    ebSecDeposit,
    ebInterestPct,
    ebMaintPct,
    ebTaxes,
    ebCapRate,
    iaArea,
    iaApproved,
    unitRows,
    unMaintPct,
    unTaxes,
    unCapRate,
    unConstArea,
    unConstApproved,
  });

  const handleSaveAction = (next = false) => {
    if (showFloorUnitError || saleComparisonBlocked) {
      setInlineError(propertyFloorDetailsError);
      setShowBanner(true);
      return;
    }
    setInlineError("");
    if (next) {
      onSaveAndNext?.("realizableValue", buildPayload());
    } else {
      onSave?.("realizableValue", buildPayload());
    }
  };

  return (
    <div className="relative pb-20">
     

      {/* Valuation Methodology */}
      <div className="mb-6 max-w-xs">
        <label className={labelCls}>Valuation Methodology <span className="text-red-600">*</span></label>
        <div className="relative">
          <select
            value={methodology}
            onChange={(e) => {
              const nextMethodology = e.target.value;
              if (nextMethodology === "saleComparison" && !propertyFloorDetailsComplete) {
                setInlineError(propertyFloorDetailsError);
                setShowBanner(true);
                setMethodology(nextMethodology);
                return;
              }
              setInlineError("");
              setMethodology(nextMethodology);
            }}
            className="w-full border-0 border-b border-gray-300 py-2 text-sm outline-none appearance-none bg-transparent cursor-pointer"
          >
            <option value="">-- Select --</option>
            <option value="saleComparison">Sale Comparison</option>
            <option value="selfConstruction">Self Construction</option>
            <option value="incomeApproach">Income Approach</option>
          </select>
          <span className="absolute right-1 top-2 text-gray-400 pointer-events-none">▾</span>
        </div>
        {inlineError && <div className="text-red-600 text-xs mt-2">{inlineError}</div>}
      </div>

      {/* ═══════════════════════════════════════════════════
          SALE COMPARISON
      ═══════════════════════════════════════════════════ */}
      {methodology === "saleComparison" && !saleComparisonBlocked && (
        <>
          <p className={sectionTitle}>Land/Existing Structure Value</p>
          <table className="w-full border border-gray-200 rounded overflow-hidden mb-2">
            <thead className="bg-gray-100">
              <tr>{["Description","Area (sq.ft.)","Rate Per sq.ft (₹)","Amount (₹)","Actions"].map(h=><th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {saleLandRows.map((row, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-sm">{i===0?"Plot Area (Sqft)":<input className={inputCls} value={row.description} onChange={e=>{const r=[...saleLandRows];r[i].description=e.target.value;setSaleLandRows(r);}}/>}</td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.area} onChange={e=>{const r=[...saleLandRows];r[i].area=e.target.value;setSaleLandRows(r);}}/></td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.rate} onChange={e=>{const r=[...saleLandRows];r[i].rate=e.target.value;setSaleLandRows(r);}}/></td>
                  <td className="px-3 py-2 text-sm">{fmt(calcAmount(row.area,row.rate))}</td>
                  <td className="px-3 py-2">{i>0&&<button onClick={()=>setSaleLandRows(saleLandRows.filter((_,j)=>j!==i))} className="text-red-400">🗑</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mb-6">
            <button onClick={()=>setSaleLandRows([...saleLandRows,{description:"",area:"",rate:""}])} className="border border-blue-900 text-blue-900 rounded-full px-4 py-1.5 text-xs flex items-center gap-1">⊕ Add More</button>
          </div>

          <p className={sectionTitle}>Unit Value <span className="text-red-600">**</span></p>
          <p className="text-xs text-gray-500 mb-2">Valuation On <span className="text-red-600">*</span></p>
          <div className="flex gap-6 mb-4">
            {[["carpetArea","Carpet Area"],["saleableArea","Saleable Area"]].map(([v,l])=>(
              <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="saleValOn" value={v} checked={saleValuationOn===v} onChange={()=>setSaleValuationOn(v)} className="accent-blue-900"/>{l}
              </label>
            ))}
          </div>
          <table className="w-full border border-gray-200 rounded overflow-hidden mb-2">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Description",
                  "Carpet Area (sq.ft.)",
                  ...(saleValuationOn === "saleableArea" ? ["Saleable Area (sq.ft.)"] : []),
                  "Rate Per sq.ft (Rs.)",
                  "Amount (Rs.)",
                  "Actions",
                ].map(h=><th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-600">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {saleUnitRows.map((row,i)=>{
                const colSpan = saleValuationOn === "saleableArea" ? 6 : 5;
                const amountArea = getSaleUnitArea(row);
                if(row.type==="header") return <tr key={i} className="border-t border-gray-100 bg-white"><td className="px-3 py-2 text-sm text-gray-500" colSpan={colSpan}>{row.description}</td></tr>;
                return (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-3 py-2 text-sm">{row.floorNo}</td>
                    <td className="px-3 py-2"><input className={inputCls} type="number" value={row.carpetArea ?? row.area ?? ""} onChange={e=>{const r=[...saleUnitRows];r[i].carpetArea=e.target.value;if(saleValuationOn==="carpetArea") r[i].area=e.target.value;setSaleUnitRows(r);}}/></td>
                    {saleValuationOn === "saleableArea" && (
                      <td className="px-3 py-2"><input className={inputCls} type="number" value={row.saleableArea ?? row.area ?? ""} onChange={e=>{const r=[...saleUnitRows];r[i].saleableArea=e.target.value;r[i].area=e.target.value;setSaleUnitRows(r);}}/></td>
                    )}
                    <td className="px-3 py-2"><input className={inputCls} type="number" value={row.rate} onChange={e=>{const r=[...saleUnitRows];r[i].rate=e.target.value;setSaleUnitRows(r);}}/></td>
                    <td className="px-3 py-2 text-sm">{fmt(calcAmount(amountArea,row.rate))}</td>
                    <td className="px-3 py-2"><button onClick={()=>setSaleUnitRows(saleUnitRows.filter((_,j)=>j!==i))} className="text-red-400">x</button></td>
                  </tr>
                );
              })}
              <tr className="border-t border-gray-200 bg-gray-50 font-semibold">
                <td className="px-3 py-2 text-sm">Total</td>
                <td className="px-3 py-2 text-sm">{saleUnitCarpetTotal||0}</td>
                {saleValuationOn === "saleableArea" && <td className="px-3 py-2 text-sm">{saleUnitSaleableTotal||0}</td>}
                <td className="px-3 py-2 text-sm"></td>
                <td className="px-3 py-2 text-sm">Rs. {fmt(saleUnitTotal)||0}</td>
                <td className="px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end mb-4">
            <button onClick={()=>setSaleUnitRows([...saleUnitRows,{type:"row",floorNo:String(saleUnitRows.filter(r=>r.type==="row").length+1),carpetArea:"",saleableArea:"",area:"",rate:""}])} className="border border-blue-900 text-blue-900 rounded-full px-4 py-1.5 text-xs flex items-center gap-1">⊕ Add More</button>
          </div>
          <div className={summaryBox}>Realizable value: ₹ {fmt(saleRealizable)}</div>
          <div className={`${summaryBox} mb-8`}>Round Off Total: ₹ {fmt(Math.round(saleRealizable))}.00 ( {toWords(Math.round(saleRealizable))} )</div>

          <p className={sectionTitle}>Valuation As Per Government Rates</p>
          <p className="text-xs text-gray-500 mb-2">Building Usage</p>
          <div className="flex gap-6 mb-4">
            {["commercial","residential"].map(v=>(
              <label key={v} className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="saleBU" value={v} checked={saleBuildingUsage===v} onChange={()=>setSaleBuildingUsage(v)} className="accent-blue-900"/>{v.charAt(0).toUpperCase()+v.slice(1)}</label>
            ))}
          </div>
          <table className="w-full border border-gray-200 rounded overflow-hidden mb-3">
            <thead className="bg-gray-100"><tr>{["Description","Area (sq.ft.)","Rate Per sq.ft (₹)"].map(h=><th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-600">{h}</th>)}</tr></thead>
            <tbody>
              {saleGovRows.map((row,i)=>(
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-sm">{row.desc}</td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.area} onChange={e=>{const r=[...saleGovRows];r[i].area=e.target.value;setSaleGovRows(r);}}/></td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.rate} onChange={e=>{const r=[...saleGovRows];r[i].rate=e.target.value;setSaleGovRows(r);}}/></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={summaryBox}>Total Value ( Gross Value ): ₹ {fmt(saleGovTotal)} ( {toWords(saleGovTotal)} )</div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
            <div><label className={labelCls}>Construction Area (sq.ft.)</label><input className={inputCls} type="number" value={saleConstArea} onChange={e=>setSaleConstArea(e.target.value)}/></div>
            <div><label className={labelCls}>Approved Cost(per. Sq.ft.)</label><input className={inputCls} type="number" value={saleConstApproved} onChange={e=>setSaleConstApproved(e.target.value)}/></div>
            <div><label className={labelCls}>Cost Of Construction <span className="text-red-600">*</span></label><input className={inputCls} type="number" value={saleConstCost} readOnly/></div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════
          SELF CONSTRUCTION
      ═══════════════════════════════════════════════════ */}
      {methodology === "selfConstruction" && (
        <>
          <p className={`${sectionTitle} mt-2`}>Land/Existing Structure Value <span className="text-red-600">*</span></p>
          <table className="w-full border border-gray-200 rounded overflow-hidden mb-2">
            <thead className="bg-gray-100"><tr>{["Description","Area (sq.ft.)","Rate Per sq.ft (₹)","Amount (₹)","Actions"].map(h=><th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-600">{h}</th>)}</tr></thead>
            <tbody>
              {landRows.map((row,i)=>(
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-sm">{i===0?"Plot Area (Sqft)":<input className={inputCls} value={row.description} onChange={e=>{const r=[...landRows];r[i].description=e.target.value;setLandRows(r);}}/>}</td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.area} onChange={e=>{const r=[...landRows];r[i].area=e.target.value;setLandRows(r);}}/></td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.rate} onChange={e=>{const r=[...landRows];r[i].rate=e.target.value;setLandRows(r);}}/></td>
                  <td className="px-3 py-2 text-sm">{fmt(calcAmount(row.area,row.rate))}</td>
                  <td className="px-3 py-2">{i>0&&<button onClick={()=>setLandRows(landRows.filter((_,j)=>j!==i))} className="text-red-500">✕</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mb-4">
            <button onClick={()=>setLandRows([...landRows,{description:"",area:"",rate:""}])} className="border border-blue-900 text-blue-900 rounded-full px-4 py-1.5 text-xs flex items-center gap-1">⊕ Add More</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div><label className={labelCls}>Construction Area (sq.ft.) <span className="text-red-600">*</span></label><input className={inputCls} type="number" value={scArea} onChange={e=>setScArea(e.target.value)}/></div>
            <div><label className={labelCls}>Approved Cost(per. Sq.ft.) <span className="text-red-600">*</span></label><input className={inputCls} type="number" value={scApproved} onChange={e=>setScApproved(e.target.value)}/></div>
            <div><label className={labelCls}>Cost Of Construction <span className="text-red-600">*</span></label><input className={inputCls} type="number" value={scCostConst} readOnly/></div>
          </div>
          <p className={sectionTitle}>Amenities Value</p>
          <table className="w-full border border-gray-200 rounded overflow-hidden mb-2">
            <thead className="bg-gray-100"><tr>{["Description","Quantity","Rate (₹)","Amount (₹)","Actions"].map(h=><th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-600">{h}</th>)}</tr></thead>
            <tbody>
              {amenityRows.map((row,i)=>(
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-2"><input className={inputCls} value={row.description} onChange={e=>{const r=[...amenityRows];r[i].description=e.target.value;setAmenityRows(r);}}/></td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.qty} onChange={e=>{const r=[...amenityRows];r[i].qty=e.target.value;setAmenityRows(r);}}/></td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.rate} onChange={e=>{const r=[...amenityRows];r[i].rate=e.target.value;setAmenityRows(r);}}/></td>
                  <td className="px-3 py-2 text-sm">{fmt(calcAmount(row.qty,row.rate))}</td>
                  <td className="px-3 py-2"><button onClick={()=>setAmenityRows(amenityRows.filter((_,j)=>j!==i))} className="text-red-500">✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mb-3">
            <button onClick={()=>setAmenityRows([...amenityRows,{description:"",qty:"",rate:""}])} className="border border-blue-900 text-blue-900 rounded-full px-4 py-1.5 text-xs flex items-center gap-1">⊕ Add More</button>
          </div>
          <div className={summaryBox}>Amenities Cost: ₹ {fmt(amenTotal)}</div>
          <div className={summaryBox}>Realizable value: ₹ {fmt(realizable)}</div>
          <div className={`${summaryBox} mb-6`}>Round Off Total: ₹ {fmt(Math.round(realizable))}.00</div>
          <p className={sectionTitle}>Valuation As Per Government Rates</p>
          <p className="text-xs text-gray-500 mb-2">Building Usage</p>
          <div className="flex gap-6 mb-4">
            {["commercial","residential"].map(v=><label key={v} className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="bu" value={v} checked={buildingUsage===v} onChange={()=>setBuildingUsage(v)} className="accent-blue-900"/>{v.charAt(0).toUpperCase()+v.slice(1)}</label>)}
          </div>
          <table className="w-full border border-gray-200 rounded overflow-hidden mb-3">
            <thead className="bg-gray-100"><tr>{["Description","Area (sq.ft.)","Rate Per sq.ft (₹)"].map(h=><th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-600">{h}</th>)}</tr></thead>
            <tbody>
              {govRows.map((row,i)=>(
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-sm">{row.desc}</td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.area} onChange={e=>{const r=[...govRows];r[i].area=e.target.value;setGovRows(r);}}/></td>
                  <td className="px-3 py-2"><input className={inputCls} type="number" value={row.rate} onChange={e=>{const r=[...govRows];r[i].rate=e.target.value;setGovRows(r);}}/></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={summaryBox}>Total Value ( Gross Value ): ₹ 0 ( Zero Rupees Only )</div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════
          INCOME APPROACH
      ═══════════════════════════════════════════════════ */}
      {methodology === "incomeApproach" && (
        <>
          {/* Valuation On Radio */}
          <div className="mt-4 mb-6">
            <p className="text-xs text-gray-500 mb-2">Valuation On <span className="text-red-600">*</span></p>
            <div className="flex gap-6">
              {[["entireBuilding","Entire Building"],["unitNumber","Unit Number"]].map(([v,l])=>(
                <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="valOn" value={v} checked={valuationOn===v} onChange={()=>setValuationOn(v)} className="accent-blue-900"/>{l}
                </label>
              ))}
            </div>
          </div>

          {/* ── ENTIRE BUILDING ───────────────────────────────────── */}
          {valuationOn === "entireBuilding" && (
            <>
              {/* Building Rent Details */}
              <p className="text-red-600 font-semibold text-sm mb-4">Building Rent Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                <div>
                  <label className={labelCls}>Built Up Area(sq.ft.) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={ebBuiltUpArea} onChange={e=>setEbBuiltUpArea(e.target.value)}/>
                </div>
                <div>
                  <label className={labelCls}>Average Rent Per sq.ft (₹) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={ebAvgRent} onChange={e=>setEbAvgRent(e.target.value)}/>
                </div>
                <div>
                  <label className={labelCls}>Monthly Rent (As Per Rent Agreement) (₹) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={ebMonthlyRent} onChange={e=>{setEbMonthlyRent(e.target.value);setEbAnnualRent(String((parseFloat(e.target.value)||0)*12));}}/>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className={labelCls}>Annual Rent (₹) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={ebAnnualRent} onChange={e=>setEbAnnualRent(e.target.value)}/>
                </div>
              </div>

              {/* Security Deposit */}
              <p className="text-red-600 font-semibold text-sm mb-4">Security Deposit</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className={labelCls}>Security Deposit Amount (₹) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={ebSecDeposit} onChange={e=>setEbSecDeposit(e.target.value)}/>
                </div>
                <div>
                  <label className={labelCls}>Interest On SD For 1 yrs(%) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={ebInterestPct} onChange={e=>setEbInterestPct(e.target.value)}/>
                </div>
                <div>
                  <label className={labelCls}>Interest Amount On SD At % For 1 yrs (₹) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={fmt(ebInterestAmt)} readOnly/>
                </div>
              </div>

              <div className={summaryBox}>Gross Maintainable Rent: ₹ {fmt(ebGrossMaintRent)}</div>

              {/* Deductions */}
              <p className="text-red-600 font-semibold text-sm mb-4 mt-2">Deductions</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                <div>
                  <label className={labelCls}>Annual Maintenance And Repair(%) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={ebMaintPct} onChange={e=>setEbMaintPct(e.target.value)}/>
                </div>
                <div>
                  <label className={labelCls}>Annual Maintenance And Repair Amount (₹) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={fmt(ebMaintRepairAmt)} readOnly/>
                </div>
                <div>
                  <label className={labelCls}>Taxes (₹) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={ebTaxes} onChange={e=>setEbTaxes(e.target.value)}/>
                </div>
              </div>

              <div className={summaryBox}>Net Annual Rent: ₹ {fmt(ebNetAnnualRent)}</div>

              {/* Capitalization Rate */}
              <p className="text-red-600 font-semibold text-sm mb-4 mt-2">Capitalization Rate</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                <div>
                  <label className={labelCls}>Capitalization Rate(%) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={ebCapRate} onChange={e=>setEbCapRate(e.target.value)}/>
                </div>
              </div>

              <div className={summaryBox}>Realizable value: ₹ {fmt(Math.round(ebRealizable))}</div>
              <div className={`${summaryBox} mb-6`}>Round Off Total: ₹ {fmt(Math.round(ebRealizable))}.00 ( {toWords(Math.round(ebRealizable))} )</div>

              {/* Construction */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
                <div>
                  <label className={labelCls}>Construction Area (sq.ft.)</label>
                  <input className={inputCls} type="number" value={iaArea} onChange={e=>setIaArea(e.target.value)}/>
                </div>
                <div>
                  <label className={labelCls}>Approved Cost(per. Sq.ft.)</label>
                  <input className={inputCls} type="number" value={iaApproved} onChange={e=>setIaApproved(e.target.value)}/>
                </div>
                <div>
                  <label className={labelCls}>Cost Of Construction <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={iaCostConst} readOnly/>
                </div>
              </div>
            </>
          )}

          {/* ── UNIT NUMBER ───────────────────────────────────────── */}
          {valuationOn === "unitNumber" && (
            <>
              {/* Unit Rent Details Table */}
              <p className="text-red-600 font-semibold text-sm mb-3">Unit Rent Details <span className="text-red-600">*</span></p>
              <table className="w-full border border-gray-200 rounded overflow-hidden mb-6">
                <thead className="bg-gray-100">
                  <tr>
                    {["Description","Built Up Area(sq.ft.)","Average Rent(₹)","Monthly Rent (As Per Rent Agreement)(₹)","Annual Rent(₹)"].map(h=>(
                      <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {unitRows.map((row, i) => (
                    <React.Fragment key={i}>
                      {/* Group label row */}
                      <tr className="bg-gray-50 border-t border-gray-200">
                        <td className="px-3 pt-3 pb-1 text-xs text-gray-500" colSpan={5}>{row.groupLabel}</td>
                      </tr>
                      {/* Data row */}
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-2 text-sm">{row.unitNo}</td>
                        <td className="px-3 py-2">
                          <input className={inputCls} type="number" value={row.buArea}
                            onChange={e=>updateUnitRow(i,"buArea",e.target.value)}/>
                        </td>
                        <td className="px-3 py-2">
                          <input className={inputCls} type="number" value={row.avgRent}
                            onChange={e=>updateUnitRow(i,"avgRent",e.target.value)}/>
                        </td>
                        <td className="px-3 py-2">
                          <input className={inputCls} type="number" value={row.monthlyRent}
                            onChange={e=>{
                              const rows=[...unitRows];
                              rows[i].monthlyRent=e.target.value;
                              rows[i].annualRent=String((parseFloat(e.target.value)||0)*12);
                              setUnitRows(rows);
                            }}/>
                        </td>
                        <td className="px-3 py-2">
                          <input className={inputCls} type="number" value={row.annualRent}
                            onChange={e=>updateUnitRow(i,"annualRent",e.target.value)}/>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* Unit Security Deposit Details */}
              <p className="text-red-600 font-semibold text-sm mb-3">Unit Security Deposit Details <span className="text-red-600">*</span></p>
              <table className="w-full border border-gray-200 rounded overflow-hidden mb-6">
                <thead className="bg-gray-100">
                  <tr>
                    {["Description","Security Deposit Amount(₹)","Interest On SD For 1 yrs(%)","Interest Amount On SD For 1 yrs(₹)"].map(h=>(
                      <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {unitRows.map((row, i) => {
                    const intAmt = calcAmount(row.secDeposit, num(row.interestPct)/100);
                    return (
                      <React.Fragment key={i}>
                        <tr className="bg-gray-50 border-t border-gray-200">
                          <td className="px-3 pt-3 pb-1 text-xs text-gray-500" colSpan={4}>{row.groupLabel}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="px-3 py-2 text-sm">{row.unitNo}</td>
                          <td className="px-3 py-2">
                            <input className={inputCls} type="number" value={row.secDeposit}
                              onChange={e=>updateUnitRow(i,"secDeposit",e.target.value)}/>
                          </td>
                          <td className="px-3 py-2">
                            <input className={inputCls} type="number" value={row.interestPct}
                              onChange={e=>updateUnitRow(i,"interestPct",e.target.value)}/>
                          </td>
                          <td className="px-3 py-2 text-sm">{fmt(intAmt)}</td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              <div className={summaryBox}>Gross Maintainable Rent: ₹ {fmt(unGrossMaintRent)}</div>

              {/* Deductions */}
              <p className="text-red-600 font-semibold text-sm mb-4 mt-2">Deductions</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                <div>
                  <label className={labelCls}>Annual Maintenance And Repair(%) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={unMaintPct} onChange={e=>setUnMaintPct(e.target.value)}/>
                </div>
                <div>
                  <label className={labelCls}>Annual Maintenance And Repair Amount (₹) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={fmt(unMaintRepairAmt)} readOnly/>
                </div>
                <div>
                  <label className={labelCls}>Taxes (₹) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={unTaxes} onChange={e=>setUnTaxes(e.target.value)}/>
                </div>
              </div>

              <div className={summaryBox}>Net Annual Rent: ₹ {fmt(unNetAnnualRent)}</div>

              {/* Capitalization Rate */}
              <p className="text-red-600 font-semibold text-sm mb-4 mt-2">Capitalization Rate</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                <div>
                  <label className={labelCls}>Capitalization Rate(%) <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={unCapRate} onChange={e=>setUnCapRate(e.target.value)}/>
                </div>
              </div>

              <div className={summaryBox}>Realizable value: ₹ {fmt(Math.round(unRealizable))}</div>
              <div className={`${summaryBox} mb-6`}>Round Off Total: ₹ {fmt(Math.round(unRealizable))}.00 ( {toWords(Math.round(unRealizable))} )</div>

              {/* Construction */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
                <div>
                  <label className={labelCls}>Construction Area (sq.ft.)</label>
                  <input className={inputCls} type="number" value={unConstArea} onChange={e=>setUnConstArea(e.target.value)}/>
                </div>
                <div>
                  <label className={labelCls}>Approved Cost(per. Sq.ft.)</label>
                  <input className={inputCls} type="number" value={unConstApproved} onChange={e=>setUnConstApproved(e.target.value)}/>
                </div>
                <div>
                  <label className={labelCls}>Cost Of Construction <span className="text-red-600">*</span></label>
                  <input className={inputCls} type="number" value={unConstCost} readOnly/>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Action Buttons */}
      {inlineError && <div className="text-right text-red-600 text-sm mb-3">{inlineError}</div>}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 w-full">
        <button onClick={() => handleSaveAction(false)} disabled={saving} className="border border-blue-900 text-blue-900 px-6 py-2 rounded text-sm font-medium disabled:opacity-60 w-full sm:w-auto">Save</button>
        <button onClick={() => handleSaveAction(true)} disabled={saving} className="bg-blue-900 text-white px-6 py-2 rounded text-sm font-medium disabled:opacity-60 w-full sm:w-auto">Save &amp; Next</button>
      </div>
    </div>
  );
};

export default RealizableValueForm;
