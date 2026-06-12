import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "../../../config/axios";
import { finalUpdate } from "../../../redux/features/case/caseThunks";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

function Row({ label, value, wide }) {
  return (
    <tr>
      <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9', width: wide ? '30%' : '25%', verticalAlign: 'top' }}>{label}</td>
      <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12, verticalAlign: 'top' }}>{value || '-'}</td>
    </tr>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ background: '#002d72', color: '#fff', padding: '6px 12px', fontSize: 13, fontWeight: 700, marginBottom: 0 }}>{title}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>{children}</tbody></table>
    </div>
  );
}

function Row2({ l1, v1, l2, v2 }) {
  return (
    <tr>
      <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9', width: '20%' }}>{l1}</td>
      <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12, width: '30%' }}>{v1 || '-'}</td>
      <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9', width: '20%' }}>{l2}</td>
      <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12, width: '30%' }}>{v2 || '-'}</td>
    </tr>
  );
}

function getImageSource(image) {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || image.preview || '';
}

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
  const worldY =
    (0.5 - Math.log((1 + Math.sin(latRad)) / (1 - Math.sin(latRad))) / (4 * Math.PI)) * worldSize;
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

function ReportLocationMap({ lat, lng, mapView = 'satellite', timestamp }) {
  const mapData = getStaticMapData(lat, lng, MAP_ZOOM, mapView);
  if (!mapData) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ background: '#002d72', color: '#fff', padding: '6px 12px', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Current Location Map</div>
      <div style={{ border: '1px solid #cfd8e3', borderRadius: 8, padding: 10, background: '#fafbfd' }}>
        <div style={{ position: 'relative', height: 260, overflow: 'hidden', borderRadius: 6, background: '#eef2f7' }}>
          <img src={mapData.tileUrl} alt="Current property location map" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div
            style={{
              position: 'absolute',
              left: mapData.markerLeft,
              top: mapData.markerTop,
              width: 18,
              height: 18,
              borderRadius: '50% 50% 50% 0',
              background: '#e31837',
              transform: 'translate(-50%, -100%) rotate(-45deg)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.28)',
              border: '2px solid #fff'
            }}
          >
            <div style={{ position: 'absolute', top: 4, left: 4, width: 6, height: 6, borderRadius: '50%', background: '#fff' }}></div>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: '#5f6c7b', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <span>{mapData.lat.toFixed(6)}, {mapData.lng.toFixed(6)}</span>
          <span>{mapData.layerLabel} view</span>
          {timestamp ? <span>Captured: {timestamp}</span> : null}
          <span>{mapData.attribution}</span>
          <a
            href={`https://www.openstreetmap.org/?mlat=${mapData.lat}&mlon=${mapData.lng}#map=${mapData.zoom}/${mapData.lat}/${mapData.lng}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#1565c0', textDecoration: 'none', fontWeight: 600 }}
          >
            Open full map
          </a>
        </div>
      </div>
    </div>
  );
}

function ImageGallery({ title, images = [] }) {
  const validImages = images.filter((img) => !!getImageSource(img));
  if (!validImages.length) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ background: '#002d72', color: '#fff', padding: '6px 12px', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        {validImages.map((img, index) => (
          <div key={`${title}-${index}`} style={{ border: '1px solid #cfd8e3', borderRadius: 8, padding: 10, background: '#fafbfd' }}>
            <img
              src={getImageSource(img)}
              alt={img.name || `${title} ${index + 1}`}
              style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 6, display: 'block', background: '#eef2f7' }}
            />
            <div style={{ marginTop: 8, fontSize: 11, color: '#5f6c7b', wordBreak: 'break-word' }}>{img.name || `${title} ${index + 1}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BajajHousingView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [saving, setSaving] = useState(false);
  const printRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Fetch data using axiosInstance matched to backend routes configured
    axiosInstance.get(`/bajaj-housing/${id}`)
      .then(res => {
         // Axios response puts data inside data.data or response is directly object
         setReportData(res.data.data || res.data);
      })
      .catch(err => {
         console.error('Failed to load report for view', err);
      });
  }, [id]);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Valuation Report</title><style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Arial, sans-serif; font-size: 12px; }
      img { max-width: 100%; }
      @media print { body { margin: 0; } }
    </style></head><body>${content}</body></html>`);
    win.document.close();
    win.focus();
    const waitForImages = () => {
      const images = Array.from(win.document.images || []);
      if (!images.length) {
        win.print();
        win.close();
        return;
      }

      let loaded = 0;
      const done = () => {
        loaded += 1;
        if (loaded === images.length) {
          win.print();
          win.close();
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          done();
          return;
        }
        img.onload = done;
        img.onerror = done;
      });
    };

    setTimeout(waitForImages, 300);
  };
  
  const handleFinalSubmit = async () => {
    try {
      setSaving(true);
      await dispatch(finalUpdate({ id, bankName: "bajajHousing", updateData: reportData })).unwrap();
      toast.success("Report Finalized ✅");
      nav("/");
    } catch (err) {
      console.error(err);
      toast.error("Finalization failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadJson = async () => {
    toast.loading("Preparing JSON...", { id: "json-download" });
    const fullState = { ...reportData };

    const urlToBase64 = async (url) => {
      try {
        if (!url) return "";
        if (url.startsWith("data:")) return url;
        
        let targetUrl = url;
        if (url.startsWith("/")) {
          targetUrl = `${window.location.origin}${url}`;
        }
        
        const response = await fetch(targetUrl);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.warn("Failed to convert image url to base64:", url, e);
        return url;
      }
    };

    const cleanState = { ...fullState };
    
    // Process image/document arrays
    const imageFields = ["frontElevationImages", "kitchenImages", "selfieImages", "otherImages", "AttachDocuments"];
    for (const field of imageFields) {
      if (cleanState[field] && Array.isArray(cleanState[field])) {
        const processed = [];
        for (const item of cleanState[field]) {
          if (item && typeof item === "object" && item.url) {
            const base64 = await urlToBase64(item.url);
            processed.push({ ...item, base64, url: base64 });
          } else if (typeof item === "string") {
            const base64 = await urlToBase64(item);
            processed.push({ url: base64, base64 });
          } else {
            processed.push(item);
          }
        }
        cleanState[field] = processed;
      }
    }

    const finalStr = JSON.stringify(cleanState, null, 2);
    const blob = new Blob([finalStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bajaj-housing-final-report-${id || "draft"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON Downloaded!", { id: "json-download" });
  };

  if (!reportData) return <div style={{ padding: 60, textAlign: 'center' }}>Loading Report...</div>;

  // Map the backend DB schema to the view format
  const s1 = { 
     ...(reportData.applicantDetails || {}), 
     documentsProvided: (reportData.AttachDocuments || []).map(d => d.name || 'Document').join(', '),
     frontElevation: reportData.frontElevationImages || [],
     kitchen: reportData.kitchenImages || [],
     selfie: reportData.selfieImages || [],
     otherImages: reportData.otherImages || []
  };
  const s2 = reportData.locationDetails || {};
  const s3 = reportData.boundaryDetails || {};
  const s4 = reportData.ndmaParameters || {};
  
  // Tech Details mapped smoothly
  const tech = reportData.technicalDetails || {};
  const s5 = {
      ...tech,
      eastToWest: tech.eastToWestSite || tech.eastToWestPlan || '',
      northToSouth: tech.northToSouthSite || tech.northToSouthPlan || '',
      landAreaSqFt: tech.landAreaSite || tech.landAreaPlan || '',
      percentRecommended: tech.percentRecommended || ''
  };

  const s6 = reportData.accommodationDetails || { floors: [] };
  const s7 = { ...(reportData.valuationDetails || {}), ...(reportData.infrastructureDetails || {}) };
  const s8 = reportData.infrastructureDetails || {};

  const pageId = `${s1.fileNo || id} \\ ${s1.lanNo || 'CT---'} \\ ${s1.brqNo || 'BRQ---'}`;

  return (
    <div style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 56px)' }}>
      {/* Toolbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #dde', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ color: '#002d72', fontWeight: 700, fontSize: 16 }}>Valuation Report</span>
          <span style={{ color: '#888', fontSize: 13, marginLeft: 12 }}>{s1.applicantName} — {s1.fileNo}</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => nav(`/bank/bajaj-housing/edit/${id}`)} style={{ background: '#fff', color: '#002d72', border: '2px solid #002d72', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>✏️ Edit</button>
          
          {(user?.role === "Admin" || user?.role === "SuperAdmin") && (
            <button 
              onClick={handleFinalSubmit} 
              disabled={saving}
              style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Finalizing..." : "🚀 Final Submit"}
            </button>
          )}

          <button onClick={handlePrint} style={{ background: '#e31837', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Save as PDF / Print</button>
          <button onClick={handleDownloadJson} style={{ background: '#6f42c1', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>⬇️ Download JSON</button>
          <button onClick={() => window.history.back()} style={{ background: '#6c757d', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>← Back</button>
        </div>
      </div>

      {/* Report */}
      <div style={{ padding: '24px 32px' }}>
        <div ref={printRef} style={{ background: '#fff', maxWidth: 900, margin: '0 auto', padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #002d72', paddingBottom: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ background: '#002d72', color: '#fff', fontWeight: 900, fontSize: 20, padding: '6px 12px', borderRadius: 4, letterSpacing: 2 }}>BAJAJ</div>
              <div>
                <div style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>HOUSING</div>
                <div style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>FINANCE</div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#002d72', letterSpacing: 1 }}>Valuation Report</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 12 }}>
              <div><strong>Valuer Name :</strong> {s1.valuerName || 'UNIQUE ENGINEERING ASSOCIATE'}</div>
              <div><strong>Valuer Type :</strong> {s1.valuerType || 'External'}</div>
            </div>
          </div>

          {/* Basic Info Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9', width: '20%' }}>File No./LAN No./System</td>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12, width: '30%' }}>{s1.fileNo} / {s1.lanNo}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9', width: '20%' }}>Date of Report</td>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s1.dateOfReport}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9' }}>Name of Applicant</td>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s1.applicantName}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9' }}>Contact Person</td>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s1.contactPerson}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9' }}>Loan Category</td>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s1.loanCategory}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9' }}>Person Met at Site</td>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s1.personMetAtSite}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9' }}>Property Owner (Legal Document)</td>
                <td colSpan={3} style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s1.propertyOwner}</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9' }}>Documents Provided</td>
                <td colSpan={3} style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s1.documentsProvided || 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          {/* Location Details */}
          <Section title="Location Details">
            <Row2 l1="Address as per Site" v1={s2.addressAsPerSite} l2="Locality Name" v2={s2.localityName} />
            <Row2 l1="Landmark Near By" v1={s2.landmarkNearBy} l2="Distance from City Centre" v2={s2.distanceFromCityCenter} />
            <Row2 l1="LAT/Long" v1={`${s2.latitude || '-'},${s2.longitude || '-'}`} l2="Address as per Initiation" v2={s2.addressAsPerInitiation} />
            <Row2 l1="Floor No. of Property" v1={s2.floorNo} l2="Property City" v2={s2.propertyCity} />
            <Row2 l1="Property State" v1={s2.propertyState} l2="Property Pin code" v2={s2.propertyPincode} />
            <Row2 l1="Address Matching" v1={s2.addressMatching} l2="Property Holding Type" v2={s2.propertyHoldingType} />
            <Row2 l1="Property Occupied by" v1={s2.propertyOccupiedBy} l2="Type of the Property" v2={s2.typeOfProperty} />
            <Row2 l1="Jurisdiction/Local Municipal Body" v1={s2.jurisdiction} l2="Marketability" v2={s2.marketability} />
            <Row label="Legal Address of the Property (As per Title Deed or Sanctioned Plan)" value={s2.legalAddress} wide />
          </Section>

          <ReportLocationMap lat={s2.latitude} lng={s2.longitude} mapView={s2.mapView || 'satellite'} timestamp={s2.locationCapturedAt} />

          {/* Boundary Details */}
          <Section title="Schedule of the Property — Boundaries">
            <tr>
              <td colSpan={2} style={{ padding: '4px 10px', border: '1px solid #999', fontWeight: 700, fontSize: 12, background: '#e8ecf5' }}>As per Legal Documents</td>
              <td colSpan={2} style={{ padding: '4px 10px', border: '1px solid #999', fontWeight: 700, fontSize: 12, background: '#e8ecf5' }}>As per Site Visit</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9', width: '10%' }}>North</td>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12, width: '40%' }}>{s3.northBoundary}</td>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12, width: '10%' }}>North</td>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s3.northBoundarySite}</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9' }}>South</td>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s3.southBoundary}</td>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>South</td>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s3.southBoundarySite}</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9' }}>East</td>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s3.eastBoundary}</td>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>East</td>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s3.eastBoundarySite}</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontWeight: 500, fontSize: 12, background: '#f9f9f9' }}>West</td>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s3.westBoundary}</td>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>West</td>
              <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{s3.westBoundarySite}</td>
            </tr>
            <Row2 l1="Boundaries Matching" v1={s3.boundariesMatching} l2="Approach Road Size" v2={s3.approachRoadSize} />
            <Row label="Property Identified" value={s3.propertyIdentified} wide />
          </Section>

          {/* NDMA Parameters */}
          <Section title="NDMA Parameters">
            <Row2 l1="Nature of Building" v1={s4.natureOfBuilding} l2="Roof Type" v2={s4.roofType} />
            <Row2 l1="Structure Type" v1={s4.structureType} l2="Steel Grade" v2={s4.steelGrade} />
            <Row2 l1="Concrete Grade" v1={s4.concreteGrade} l2="Type of Masonry" v2={s4.typeOfMasonry} />
            <Row2 l1="Mortar Type" v1={s4.mortarType} l2="Footing Type" v2={s4.footingType} />
            <Row2 l1="Seismic Zone" v1={s4.seismicZone} l2="Env Exposure Condition" v2={s4.envExposureCondition} />
            <Row2 l1="Flood Prone Area" v1={s4.floodProneArea} l2="Soil Liquefiable" v2={s4.soilLiquefiable} />
            <Row2 l1="Projected Parts Available" v1={s4.projectedPartsAvailable} l2="Fire Exit" v2={s4.fireExit} />
            <Row2 l1="Sanctioned Plan Provided" v1={s4.sanctionedPlanProvided} l2="Approved Usages" v2={s4.approvedUsages} />
            <Row2 l1="Approving Authority" v1={s4.approvingAuthority} l2="Number of Floor in Building" v2={s4.numberOfFloorInBuilding} />
          </Section>

          {/* Technical Details */}
          <Section title="Technical Details">
            <Row2 l1="Construction Quality" v1={s5.constructionQuality} l2="Current Occupant" v2={s5.currentOccupant} />
            <Row2 l1="East to West (ft)" v1={s5.eastToWest} l2="North to South (ft)" v2={s5.northToSouth} />
            <Row2 l1="Land Area (Sq. Ft.)" v1={s5.landAreaSqFt} l2="Lift Available" v2={s5.liftAvailable} />
            <Row2 l1="% Completed" v1={s5.percentCompleted} l2="% Recommended" v2={s5.percentRecommended} />
            <Row2 l1="Current Age of Property (Years)" v1={s5.currentAgeOfProperty} l2="Residual Age (Years)" v2={s5.residualAge} />
            <Row2 l1="Risk of Demolition" v1={s5.riskOfDemolition} l2="Status of the Property" v2={s5.statusOfProperty} />
            <Row2 l1="Carpet Area as per Document (Sq.Ft)" v1={s5.carpetAreaAsPerDocument} l2="Actual Construction SBUA (Sq.Ft)" v2={s5.actualConstructionSBUA} />
          </Section>

          {/* Accommodation Details */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ background: '#002d72', color: '#fff', padding: '6px 12px', fontSize: 13, fontWeight: 700 }}>Accommodation Details</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f2f5' }}>
                  {['Floor No', 'No of Rooms', 'No of Kitchen', 'No of BathRoom', 'Sanction Usage', 'Actual Usage and Remark'].map(h => (
                    <th key={h} style={{ padding: '7px 10px', border: '1px solid #999', fontSize: 11, fontWeight: 700, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(s6.floors || []).map((fl, i) => (
                  <tr key={i}>
                    <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{fl.floorNo}</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{fl.noOfRooms}</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{fl.noOfKitchen}</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{fl.noOfBathRoom}</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{fl.sanctionUsage}</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12 }}>{fl.actualUsage}</td>
                  </tr>
                ))}
                {(!s6.floors || s6.floors.length === 0) && (
                  <tr><td colSpan="6" style={{ padding: '6px 10px', border: '1px solid #999', fontSize: 12, textAlign: 'center' }}>No accommodation details recorded.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Valuation Details */}
          <Section title="Valuation Details">
            <Row2 l1="Land Area (Sq.Ft)" v1={s7.landArea} l2="Tentative Land Rate (₹/Sq.Ft)" v2={s7.tentativeLandRate ? `₹${Number(s7.tentativeLandRate).toLocaleString('en-IN')}` : '-'} />
            <Row2 l1="Depreciation %" v1={s7.depreciation} l2="Land Value (₹)" v2={s7.landValue ? `₹${Number(s7.landValue).toLocaleString('en-IN')}` : '-'} />
            <Row2 l1="Car Parking Charges (₹)" v1={s7.carParkingCharges} l2="Amenities/Other charges (₹)" v2={s7.amenitiesCharges} />
            <Row2 l1="Realizable Value" v1={s7.realizableValue ? `₹${Number(s7.realizableValue).toLocaleString('en-IN')}` : '-'} l2="Distressed/Force Value" v2={s7.distressedValue ? `₹${Number(s7.distressedValue).toLocaleString('en-IN')}` : '-'} />
            <Row2 l1="Government Value (₹)" v1={s7.governmentValue ? `₹${Number(s7.governmentValue).toLocaleString('en-IN')}` : '-'} l2="Valuation Methodology" v2={s7.valuationMethodology} />
            <Row2 l1="Valuation Done Earlier" v1={s7.valuationDoneEarlier} l2="Is Property in Negative Area" v2={s7.isPropertyInNegativeArea} />
            <Row label="Remarks if any" value={s7.remarks} wide />
          </Section>

          {/* Infrastructure */}
          <Section title="Infrastructure Details">
            <Row2 l1="Development of Surrounding Areas" v1={s7.developmentOfSurroundingAreas} l2="Distance from City Centre" v2={s7.distanceFromCityCenter} />
            <Row2 l1="Approach Road to the Property" v1={s7.approachRoadToProperty} l2="Electricity Available" v2={s7.electricityAvailable} />
            <Row2 l1="Electricity Distributor" v1={s7.electricityDistributor} l2="Water Supply" v2={s7.waterSupply} />
            <Row2 l1="Water Distributor" v1={s7.waterDistributor} l2="Sewer Line Connected" v2={s7.sewerLineConnected} />
            <Row label="Any Demolition Threat in Future" value={s7.anyDemolitionThreat} wide />
          </Section>

          {/* Declaration */}
          <Section title="Declaration">
            <Row label="Declaration" value={s8.declaration} wide />
            <Row2 l1="Created By" v1={s8.createdBy} l2="Created On" v2={s8.createdOn} />
            <Row2 l1="Location" v1={s8.location} l2="Approved By" v2={s8.approvedBy} />
            <Row2 l1="Approved On" v1={s8.approvedOn} l2="Designation" v2={s8.designation} />
          </Section>

          <div style={{ pageBreakBefore: 'always' }}>
            <ImageGallery title="Front Elevation" images={s1.frontElevation || []} />
            <ImageGallery title="Kitchen Images" images={s1.kitchen || []} />
            <ImageGallery title="Selfie At Site" images={s1.selfie || []} />
            <ImageGallery title="Other Property Images" images={s1.otherImages || []} />
          </div>

          {/* Footer */}
          <div style={{ borderTop: '2px solid #002d72', marginTop: 20, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#666' }}>
            <div>{pageId}</div>
            <div>Computer Generated Report</div>
            <div>This document does not require signature.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
