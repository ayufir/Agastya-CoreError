import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import JSZip from "jszip";
import axiosInstance from "../../config/axios";
import StaticLocationMap from "../../components/StaticLocationMap";
import {
  createValuationReport,
  getValuationReportById,
  updateValuationReport,
} from "../../redux/features/Banks/bajaj/BajajAsyncThunks";
import { getCurrentLocation as getLiveLocation } from "../../utils/getLocation";

const ROAD_OPTIONS = ["3 Ft", "6 Ft", "9 Ft", "12 Ft", "20 Ft", "30 Ft", "40 Ft"];
const YES_NO_OPTIONS = ["Yes", "No"];
const YES_NO_NA_OPTIONS = ["Yes", "No", "NA"];

const APPLICANT_FIELDS = [
  { key: "fileNo", label: "File / LAN / System No." },
  { key: "dateOfReport", label: "Date Of Report", type: "date" },
  { key: "applicantName", label: "Applicant Name" },
  { key: "contactPerson", label: "Contact Person / Number" },
  { key: "loanType", label: "Loan Type" },
  { key: "personMet", label: "Person Met At Site" },
  { key: "propertyOwner", label: "Property Owner" },
  { key: "documentsProvided", label: "Documents Provided", type: "textarea", colSpan: 2 },
];

const LOCATION_FIELDS = [
  { key: "addressSite", label: "Address Of Property", type: "textarea", colSpan: 2 },
  { key: "legalAddress", label: "Legal Address", type: "textarea", colSpan: 2 },
  { key: "addressInitiation", label: "Address As Per Initiation", type: "textarea", colSpan: 2 },
  { key: "localityName", label: "Locality Name" },
  { key: "landmark", label: "Landmark" },
  { key: "distanceFromCity", label: "Distance From City" },
  { key: "propertyState", label: "State" },
  { key: "propertyCity", label: "City" },
  { key: "propertyPinCode", label: "Pin Code" },
  { key: "floorNo", label: "Floor No." },
  { key: "addressMatching", label: "Address Matching", type: "select", options: YES_NO_OPTIONS },
  { key: "jurisdiction", label: "Jurisdiction / Municipal Body" },
];

const PROPERTY_FIELDS = [
  { key: "propertyType", label: "Property Holding Type" },
  { key: "typeOfProperty", label: "Type Of Property" },
  { key: "marketability", label: "Marketability" },
  { key: "occupancyStatus", label: "Occupancy Status" },
  { key: "occupancySchedule", label: "Occupancy Schedule", type: "textarea", colSpan: 2 },
  { key: "northBoundary", label: "North Boundary" },
  { key: "eastBoundary", label: "East Boundary" },
  { key: "westBoundary", label: "West Boundary" },
  { key: "southBoundary", label: "South Boundary" },
  { key: "boundariesMatching", label: "Boundaries Matching", type: "select", options: YES_NO_OPTIONS },
  { key: "identifiedProperty", label: "Property Identified", type: "select", options: YES_NO_OPTIONS },
  { key: "approachRoadSize", label: "Approach Road Size", type: "select", options: ROAD_OPTIONS },
];

const NDMA_FIELDS = [
  { key: "buildingNature", label: "Nature Of Building" },
  { key: "planAspectRatio", label: "Plan Aspect Ratio" },
  { key: "structureType", label: "Structure Type" },
  { key: "projectedParts", label: "Projected Parts" },
  { key: "masonryType", label: "Masonry Type" },
  { key: "expansionJoints", label: "Expansion Joints" },
  { key: "roofType", label: "Roof Type" },
  { key: "steelGrade", label: "Steel Grade" },
  { key: "mortarType", label: "Mortar Type" },
  { key: "concreteGrade", label: "Concrete Grade" },
  { key: "environmentExposure", label: "Environment Exposure" },
  { key: "footingType", label: "Footing Type" },
  { key: "seismicZone", label: "Seismic Zone" },
  { key: "soilLiquefiable", label: "Soil Liquefiable", type: "select", options: YES_NO_OPTIONS },
  { key: "coastalRegulatoryZone", label: "Coastal Regulatory Zone", type: "select", options: YES_NO_OPTIONS },
  { key: "soilSlope", label: "Soil Slope / Landslide", type: "select", options: YES_NO_OPTIONS },
  { key: "floodProneArea", label: "Flood Prone Area", type: "select", options: YES_NO_OPTIONS },
  { key: "groundSlope", label: "Ground Slope", type: "select", options: YES_NO_OPTIONS },
  { key: "fireExit", label: "Fire Exit", type: "select", options: YES_NO_NA_OPTIONS },
];

const APPROVAL_FIELDS = [
  { key: "sanctionedPlan", label: "Sanctioned Plan" },
  { key: "layoutPlan", label: "Layout Plan" },
  { key: "constructionPlan", label: "Construction Plan" },
  { key: "sanctionDate", label: "Sanction Date" },
  { key: "planValidity", label: "Plan Validity" },
  { key: "approvingAuthority", label: "Approving Authority" },
  { key: "approvedUsages", label: "Approved Usages" },
  { key: "numberOfFloors", label: "Number Of Floors" },
];

const TECHNICAL_FIELDS = [
  { key: "constructionQuality", label: "Construction Quality" },
  { key: "openPlot", label: "Open Plot", type: "select", options: YES_NO_OPTIONS },
  { key: "liftAvailable", label: "Lift Available", type: "select", options: YES_NO_NA_OPTIONS },
  { key: "numberOfLifts", label: "Number Of Lifts", type: "number" },
  { key: "currentOccupant", label: "Current Occupant" },
  { key: "independentAccess", label: "Independent Access", type: "select", options: YES_NO_OPTIONS },
  { key: "accommodationDetails", label: "Accommodation Details", type: "textarea", colSpan: 2 },
  { key: "eastWestDocument", label: "East-West (Document)" },
  { key: "eastWestSite", label: "East-West (Site)" },
  { key: "northSouthDocument", label: "North-South (Document)" },
  { key: "northSouthSite", label: "North-South (Site)" },
  { key: "landAreaDocument", label: "Land Area (Document)" },
  { key: "landAreaSite", label: "Land Area (Site)" },
  { key: "basementRooms", label: "Basement Rooms" },
  { key: "basementKitchens", label: "Basement Kitchens" },
  { key: "basementBathrooms", label: "Basement Bathrooms" },
  { key: "basementSanctioned", label: "Basement Sanctioned Usage" },
  { key: "basementActual", label: "Basement Actual Usage" },
  { key: "groundRooms", label: "Ground Rooms" },
  { key: "groundKitchens", label: "Ground Kitchens" },
  { key: "groundBathrooms", label: "Ground Bathrooms" },
  { key: "groundSanctioned", label: "Ground Sanctioned Usage" },
  { key: "groundActual", label: "Ground Actual Usage" },
];

const PLANNING_FIELDS = [
  { key: "permissibleArea", label: "Permissible Area" },
  { key: "landComponent", label: "Land Component" },
  { key: "permissibleFSI", label: "Permissible FSI" },
  { key: "permissibleConstruction", label: "Permissible Construction" },
  { key: "carpetArea", label: "Carpet Area" },
  { key: "proposedConstruction", label: "Proposed Construction" },
  { key: "riskOfDemolition", label: "Risk Of Demolition" },
  { key: "propertyStatus", label: "Property Status" },
  { key: "percentCompleted", label: "% Completed" },
  { key: "percentRecommended", label: "% Recommended" },
  { key: "propertyAge", label: "Property Age" },
  { key: "residualAge", label: "Residual Age" },
];

const VALUATION_FIELDS = [
  { key: "landArea", label: "Land Area" },
  { key: "landRate", label: "Land Rate" },
  { key: "landTotal", label: "Land Total" },
  { key: "buaArea", label: "BUA Area" },
  { key: "buaRate", label: "BUA Rate" },
  { key: "buaTotal", label: "BUA Total" },
  { key: "realizableValue", label: "Realizable Value" },
  { key: "governmentValue", label: "Government Value" },
  { key: "distressedValue", label: "Distressed Value" },
  { key: "previousValuation", label: "Previous Valuation" },
  { key: "inDemolitionList", label: "In Demolition List", type: "select", options: YES_NO_OPTIONS },
  { key: "negativeArea", label: "Negative Area", type: "select", options: YES_NO_OPTIONS },
];

const INITIAL_FORM = {
  bankName: "Bajaj Bank",
  route: "bajaj",
  status: "Pending",
  approvalStatus: "Pending",
  isReportSubmitted: false,
  fileNo: "",
  dateOfReport: "",
  applicantName: "",
  contactPerson: "",
  loanType: "",
  personMet: "",
  propertyOwner: "",
  documentsProvided: "",
  addressSite: "",
  localityName: "",
  landmark: "",
  distanceFromCity: "",
  addressInitiation: "",
  legalAddress: "",
  floorNo: "",
  propertyState: "",
  propertyCity: "",
  propertyPinCode: "",
  addressMatching: "",
  jurisdiction: "",
  propertyType: "",
  marketability: "",
  occupancyStatus: "",
  typeOfProperty: "",
  occupancySchedule: "",
  northBoundary: "",
  eastBoundary: "",
  westBoundary: "",
  southBoundary: "",
  boundariesMatching: "",
  identifiedProperty: "",
  approachRoadSize: "",
  buildingNature: "",
  planAspectRatio: "",
  structureType: "",
  projectedParts: "",
  masonryType: "",
  expansionJoints: "",
  roofType: "",
  steelGrade: "",
  mortarType: "",
  concreteGrade: "",
  environmentExposure: "",
  footingType: "",
  seismicZone: "",
  soilLiquefiable: "",
  coastalRegulatoryZone: "",
  soilSlope: "",
  floodProneArea: "",
  groundSlope: "",
  fireExit: "",
  sanctionedPlan: "",
  layoutPlan: "",
  constructionPlan: "",
  sanctionDate: "",
  planValidity: "",
  approvingAuthority: "",
  approvedUsages: "",
  numberOfFloors: "",
  constructionQuality: "",
  openPlot: "",
  liftAvailable: "",
  numberOfLifts: "",
  currentOccupant: "",
  independentAccess: "",
  accommodationDetails: "",
  eastWestDocument: "",
  eastWestSite: "",
  northSouthDocument: "",
  northSouthSite: "",
  landAreaDocument: "",
  landAreaSite: "",
  basementRooms: "",
  basementKitchens: "",
  basementBathrooms: "",
  basementSanctioned: "",
  basementActual: "",
  groundRooms: "",
  groundKitchens: "",
  groundBathrooms: "",
  groundSanctioned: "",
  groundActual: "",
  permissibleArea: "",
  landComponent: "",
  permissibleFSI: "",
  permissibleConstruction: "",
  carpetArea: "",
  proposedConstruction: "",
  riskOfDemolition: "",
  propertyStatus: "",
  percentCompleted: "",
  percentRecommended: "",
  propertyAge: "",
  residualAge: "",
  landArea: "",
  landRate: "",
  landTotal: "",
  buaArea: "",
  buaRate: "",
  buaTotal: "",
  realizableValue: "",
  governmentValue: "",
  distressedValue: "",
  previousValuation: "",
  inDemolitionList: "",
  negativeArea: "",
  remarks: "",
  latLong: "",
  mapView: "roadmap",
  location: { latitude: "", longitude: "" },
  imageUrls: [],
  AttachDocuments: [],
};

const normalizeMediaItems = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") {
        return { url: item, fileId: "", name: "" };
      }

      if (!item.url) return null;

      return {
        url: item.url,
        fileId: item.fileId || "",
        name: item.name || "",
        latitude: item.latitude || "",
        longitude: item.longitude || "",
        capturedAt: item.capturedAt || "",
      };
    })
    .filter(Boolean);

const buildLocationFromReport = (report = {}) => {
  const nestedLatitude = report?.location?.latitude;
  const nestedLongitude = report?.location?.longitude;

  if (nestedLatitude || nestedLongitude) {
    return {
      latitude: String(nestedLatitude || ""),
      longitude: String(nestedLongitude || ""),
    };
  }

  if (report?.latLong) {
    const [latitude = "", longitude = ""] = String(report.latLong)
      .split(",")
      .map((value) => value.trim());
    return { latitude, longitude };
  }

  return { latitude: "", longitude: "" };
};

const buildFormState = (report = {}) => {
  const location = buildLocationFromReport(report);
  return {
    ...INITIAL_FORM,
    ...report,
    location,
    latLong:
      report.latLong ||
      (location.latitude && location.longitude
        ? `${location.latitude}, ${location.longitude}`
        : ""),
    mapView: report.mapView === "satellite" ? "satellite" : "roadmap",
    imageUrls: normalizeMediaItems(report.imageUrls),
    AttachDocuments: normalizeMediaItems(report.AttachDocuments),
  };
};

const getFieldValue = (form, key) => (form[key] ?? "").toString();

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  fallback;

const downloadItemsAsZip = async (items, zipName, fallbackPrefix) => {
  if (!items.length) {
    toast.error(`No ${fallbackPrefix} available to download`);
    return;
  }

  const zip = new JSZip();
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const safeName =
        item.name ||
        item.url.split("/").pop() ||
        `${fallbackPrefix}-${index + 1}.${blob.type.split("/").pop() || "bin"}`;
      zip.file(safeName, blob);
    } catch (_error) {
      zip.file(
        `${fallbackPrefix}-${index + 1}-error.txt`,
        `Failed to download ${item.url}`
      );
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = zipName;
  link.click();
  URL.revokeObjectURL(link.href);
};

const SectionCard = ({ title, description, children }) => (
  <section className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
    <div className='mb-4'>
      <h2 className='text-lg font-semibold text-slate-900'>{title}</h2>
      {description ? <p className='mt-1 text-sm text-slate-500'>{description}</p> : null}
    </div>
    {children}
  </section>
);

const TextField = ({ label, value, onChange, type = "text", textarea = false }) => (
  <label className='block'>
    <span className='mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500'>
      {label}
    </span>
    {textarea ? (
      <textarea
        value={value}
        onChange={onChange}
        rows={3}
        className='min-h-[110px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        className='w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
      />
    )}
  </label>
);

const SelectField = ({ label, value, onChange, options }) => (
  <label className='block'>
    <span className='mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500'>
      {label}
    </span>
    <select
      value={value}
      onChange={onChange}
      className='w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
    >
      <option value=''>Select</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

const FormGrid = ({ fields, form, onFieldChange }) => (
  <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
    {fields.map((field) => (
      <div
        key={field.key}
        className={field.colSpan === 2 ? "md:col-span-2 xl:col-span-2" : ""}
      >
        {field.type === "select" ? (
          <SelectField
            label={field.label}
            value={getFieldValue(form, field.key)}
            onChange={(event) => onFieldChange(field.key, event.target.value)}
            options={field.options || []}
          />
        ) : (
          <TextField
            label={field.label}
            value={getFieldValue(form, field.key)}
            onChange={(event) => onFieldChange(field.key, event.target.value)}
            type={field.type === "number" ? "number" : field.type || "text"}
            textarea={field.type === "textarea"}
          />
        )}
      </div>
    ))}
  </div>
);

const MediaUploader = ({
  type,
  title,
  items,
  reportId,
  mapView,
  onChange,
  onLocationCapture,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleDelete = async (itemToDelete) => {
    try {
      if (itemToDelete.fileId) {
        if (reportId) {
          await axiosInstance.delete(`/bajaj/delete-file/${reportId}`, {
            data: { fileId: itemToDelete.fileId, type },
          });
        } else {
          await axiosInstance.delete("/bajaj/delete-upload", {
            data: { fileId: itemToDelete.fileId },
          });
        }
      }

      onChange(items.filter((item) => item !== itemToDelete));
      toast.success(`${type === "image" ? "Image" : "Document"} deleted`);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          `Failed to delete ${type === "image" ? "image" : "document"}`
        )
      );
    }
  };

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploading(true);

    let capturedLocation = null;
    if (type === "image") {
      try {
        capturedLocation = await getLiveLocation();
        onLocationCapture?.(
          Number.parseFloat(capturedLocation.latitude).toFixed(6),
          Number.parseFloat(capturedLocation.longitude).toFixed(6)
        );
      } catch (_error) {
        toast.error("Location capture failed while uploading image");
      }
    }

    try {
      const uploadedItems = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        if (reportId) {
          formData.append("reportId", reportId);
        }

        if (capturedLocation && type === "image") {
          formData.append(
            "latitude",
            Number.parseFloat(capturedLocation.latitude).toFixed(6)
          );
          formData.append(
            "longitude",
            Number.parseFloat(capturedLocation.longitude).toFixed(6)
          );
          formData.append("mapView", mapView);
        }

        const endpoint =
          type === "image" ? "/bajaj/upload-image" : "/bajaj/upload-document";
        const response = await axiosInstance.post(endpoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedItems.push({
          url: response.data.url,
          fileId: response.data.fileId,
          name: response.data.name || file.name,
          latitude: response.data.latitude || "",
          longitude: response.data.longitude || "",
          capturedAt: response.data.capturedAt || new Date().toISOString(),
        });
      }

      onChange([...items, ...uploadedItems]);
      toast.success(
        `${uploadedItems.length} ${type === "image" ? "image" : "document"} uploaded`
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          `Failed to upload ${type === "image" ? "images" : "documents"}`
        )
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className='rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4'>
      <div className='mb-3 flex items-center justify-between gap-3'>
        <div>
          <h3 className='text-sm font-semibold text-slate-900'>{title}</h3>
          <p className='text-xs text-slate-500'>
            {type === "image"
              ? "Image upload ke saath current latitude/longitude capture hoga."
              : "PDF, image, Word ya Excel documents upload kar sakte ho."}
          </p>
        </div>
        <label className='inline-flex cursor-pointer items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700'>
          {uploading ? "Uploading..." : `Upload ${type === "image" ? "Images" : "Documents"}`}
          <input
            type='file'
            multiple
            accept={type === "image" ? "image/*" : undefined}
            className='hidden'
            onChange={handleFiles}
            disabled={uploading}
          />
        </label>
      </div>

      {items.length === 0 ? (
        <div className='rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500'>
          No {type === "image" ? "images" : "documents"} uploaded yet.
        </div>
      ) : type === "image" ? (
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>
          {items.map((item, index) => (
            <div
              key={`${item.fileId || item.url}-${index}`}
              className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'
            >
              <img
                src={item.url}
                alt={`bajaj-${index + 1}`}
                className='h-52 w-full object-cover'
              />
              <div className='space-y-2 p-3 text-xs text-slate-600'>
                <div className='font-medium text-slate-900'>
                  {item.name || `Image ${index + 1}`}
                </div>
                {item.latitude && item.longitude ? (
                  <div>
                    {item.latitude}, {item.longitude}
                  </div>
                ) : null}
                <div className='flex gap-2'>
                  <button
                    type='button'
                    className='rounded-full border border-slate-200 px-3 py-1 font-medium text-slate-700 transition hover:border-slate-400'
                    onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                  >
                    View
                  </button>
                  <a
                    href={item.url}
                    download
                    className='rounded-full border border-slate-200 px-3 py-1 font-medium text-slate-700 transition hover:border-slate-400'
                  >
                    Download
                  </a>
                  <button
                    type='button'
                    className='rounded-full border border-rose-200 px-3 py-1 font-medium text-rose-600 transition hover:border-rose-400'
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='space-y-2'>
          {items.map((item, index) => (
            <div
              key={`${item.fileId || item.url}-${index}`}
              className='flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between'
            >
              <div className='min-w-0'>
                <div className='truncate font-medium text-slate-900'>
                  {item.name || item.url.split("/").pop() || `Document ${index + 1}`}
                </div>
                <div className='truncate text-xs text-slate-500'>{item.url}</div>
              </div>
              <div className='flex flex-wrap gap-2'>
                <button
                  type='button'
                  className='rounded-full border border-slate-200 px-3 py-1 font-medium text-slate-700 transition hover:border-slate-400'
                  onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                >
                  View
                </button>
                <a
                  href={item.url}
                  download
                  className='rounded-full border border-slate-200 px-3 py-1 font-medium text-slate-700 transition hover:border-slate-400'
                >
                  Download
                </a>
                <button
                  type='button'
                  className='rounded-full border border-rose-200 px-3 py-1 font-medium text-rose-600 transition hover:border-rose-400'
                  onClick={() => handleDelete(item)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ label, value, tone = "slate" }) => {
  const toneMap = {
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
  };

  return (
    <div className='rounded-2xl border border-white/50 bg-white/70 px-4 py-3 backdrop-blur'>
      <div className='text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500'>
        {label}
      </div>
      <div className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneMap[tone]}`}>
        {value || "N/A"}
      </div>
    </div>
  );
};

const BajajReportPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [capturingLocation, setCapturingLocation] = useState(false);

  const isFieldOfficer = user?.role === "FieldOfficer";
  const pageTitle = id ? "Bajaj Report Workspace" : "Create Bajaj Report";
  const hasCoordinates = form.location.latitude && form.location.longitude;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    dispatch(getValuationReportById(id))
      .unwrap()
      .then((report) => {
        if (isMounted) {
          setForm(buildFormState(report));
        }
      })
      .catch((error) => {
        toast.error(getErrorMessage(error, "Failed to load Bajaj report"));
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (id || form.location.latitude || form.location.longitude) return;

    let isMounted = true;
    setCapturingLocation(true);

    getLiveLocation()
      .then((location) => {
        if (!isMounted) return;
        const latitude = Number.parseFloat(location.latitude).toFixed(6);
        const longitude = Number.parseFloat(location.longitude).toFixed(6);
        setForm((previous) => ({
          ...previous,
          location: { latitude, longitude },
          latLong: `${latitude}, ${longitude}`,
        }));
      })
      .catch(() => { })
      .finally(() => {
        if (isMounted) {
          setCapturingLocation(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [form.location.latitude, form.location.longitude, id]);

  const summaryLabel = useMemo(
    () => `${form.applicantName || "Unnamed Case"}${form.fileNo ? ` • ${form.fileNo}` : ""}`,
    [form.applicantName, form.fileNo]
  );

  const handleFieldChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleLocationUpdate = (latitude, longitude) => {
    setForm((previous) => ({
      ...previous,
      location: {
        latitude: String(latitude || ""),
        longitude: String(longitude || ""),
      },
      latLong: latitude && longitude ? `${latitude}, ${longitude}` : "",
    }));
  };

  const captureCurrentLocation = async () => {
    try {
      setCapturingLocation(true);
      const location = await getLiveLocation();
      const latitude = Number.parseFloat(location.latitude).toFixed(6);
      const longitude = Number.parseFloat(location.longitude).toFixed(6);
      handleLocationUpdate(latitude, longitude);
      toast.success("Current location captured");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to capture current location"));
    } finally {
      setCapturingLocation(false);
    }
  };

  const buildPayload = (submitAction) => {
    const latitude = String(form.location.latitude || "").trim();
    const longitude = String(form.location.longitude || "").trim();

    return {
      ...form,
      bankName: "Bajaj Bank",
      route: "bajaj",
      location: { latitude, longitude },
      latLong: latitude && longitude ? `${latitude}, ${longitude}` : "",
      imageUrls: normalizeMediaItems(form.imageUrls),
      AttachDocuments: normalizeMediaItems(form.AttachDocuments),
      submitAction,
    };
  };

  const handleSave = async (submitAction = "save-draft") => {
    try {
      setSaving(true);
      const payload = buildPayload(submitAction);

      if (id) {
        const updated = await dispatch(
          updateValuationReport({ id, ...payload })
        ).unwrap();
        setForm(buildFormState(updated));
        toast.success(
          submitAction === "final-submit"
            ? "Bajaj report submitted successfully"
            : "Bajaj report updated"
        );

        if (submitAction === "final-submit" && isFieldOfficer) {
          navigate("/field/dashboard");
          return;
        }

        navigate(`/bank/bajaj/${updated._id}`);
        return;
      }

      const created = await dispatch(createValuationReport(payload)).unwrap();
      setForm(buildFormState(created));
      toast.success(
        submitAction === "final-submit"
          ? "Bajaj report created and submitted"
          : "Bajaj report created"
      );

      if (submitAction === "final-submit" && isFieldOfficer) {
        navigate("/field/dashboard");
        return;
      }

      navigate(`/bank/bajaj/${created._id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save Bajaj report"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-100'>
        <div className='rounded-3xl border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-600 shadow-sm'>
          Loading Bajaj report...
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-100 pb-12'>
      <div className='sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur print:hidden'>
        <div className='mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <div className='text-xs font-semibold uppercase tracking-[0.24em] text-rose-500'>
              Bajaj Housing Finance
            </div>
            <h1 className='mt-1 text-2xl font-semibold text-slate-900'>{pageTitle}</h1>
            <p className='mt-1 text-sm text-slate-500'>{summaryLabel}</p>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <button
              type='button'
              className='rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500'
              onClick={() => downloadItemsAsZip(form.imageUrls, "bajaj-images.zip", "image")}
            >
              Download Images
            </button>
            <button
              type='button'
              className='rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500'
              onClick={() =>
                downloadItemsAsZip(form.AttachDocuments, "bajaj-documents.zip", "document")
              }
            >
              Download Documents
            </button>
            <button
              type='button'
              className='rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500'
              onClick={() => window.print()}
            >
              Download PDF
            </button>
            <button
              type='button'
              className='rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400'
              onClick={() => handleSave("save-draft")}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              type='button'
              className='rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700'
              onClick={() => handleSave("final-submit")}
              disabled={saving}
            >
              {saving ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </div>

      <div id='bajaj-report-print' className='mx-auto max-w-7xl px-4 pt-6'>
        <div className='mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]'>
          <div className='rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-rose-700 px-6 py-6 text-white shadow-lg'>
            <div className='flex flex-wrap items-start justify-between gap-4'>
              <div>
                <div className='inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]'>
                  Technical Report
                </div>
                <h2 className='mt-4 text-3xl font-semibold'>Bajaj Report Control Room</h2>
                <p className='mt-2 max-w-2xl text-sm text-white/80'>
                  Yahi page se case create, field officer handoff, geo-tagged image upload,
                  document management, map mode selection aur report submission sab handle hoga.
                </p>
              </div>
              <div className='text-right text-sm text-white/80'>
                <div>Case ID</div>
                <div className='mt-1 text-base font-semibold text-white'>{id || "New"}</div>
              </div>
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-1'>
            <StatusBadge label='Status' value={form.status} tone='amber' />
            <StatusBadge label='Approval' value={form.approvalStatus} tone='slate' />
            <StatusBadge
              label='Submission'
              value={form.isReportSubmitted ? "Submitted" : "Draft"}
              tone={form.isReportSubmitted ? "emerald" : "rose"}
            />
          </div>
        </div>

        <div className='grid gap-6'>
          <SectionCard
            title='Applicant & Case Details'
            description='Basic case generation details jo dashboard, assignment aur summary me show honge.'
          >
            <FormGrid fields={APPLICANT_FIELDS} form={form} onFieldChange={handleFieldChange} />
          </SectionCard>

          <SectionCard
            title='Location & Geo Coordinates'
            description='Image upload ke waqt bhi location capture hoga. Aap manually bhi location refresh kar sakte ho.'
          >
            <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-4'>
              <TextField
                label='Latitude'
                value={form.location.latitude}
                onChange={(event) =>
                  handleLocationUpdate(event.target.value, form.location.longitude)
                }
              />
              <TextField
                label='Longitude'
                value={form.location.longitude}
                onChange={(event) =>
                  handleLocationUpdate(form.location.latitude, event.target.value)
                }
              />
              <TextField
                label='Lat / Long Snapshot'
                value={form.latLong}
                onChange={(event) => handleFieldChange("latLong", event.target.value)}
              />
              <div className='flex flex-col justify-end gap-2'>
                <button
                  type='button'
                  className='rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500'
                  onClick={captureCurrentLocation}
                  disabled={capturingLocation}
                >
                  {capturingLocation ? "Capturing..." : "Use Current Location"}
                </button>
              </div>
            </div>

            <div className='mb-4 flex flex-wrap items-center gap-2'>
              {[
                { label: "Road Map", value: "roadmap" },
                { label: "Satellite", value: "satellite" },
              ].map((option) => (
                <button
                  key={option.value}
                  type='button'
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${form.mapView === option.value
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                    }`}
                  onClick={() => handleFieldChange("mapView", option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <FormGrid fields={LOCATION_FIELDS} form={form} onFieldChange={handleFieldChange} />

            <div className='mt-5 overflow-hidden rounded-3xl border border-slate-200'>
              <StaticLocationMap
                latitude={form.location.latitude}
                longitude={form.location.longitude}
                mapMode={form.mapView}
                title='Bajaj property location map'
                className='h-[320px] w-full border-0'
                style={{ border: 0 }}
              />
            </div>
            {!hasCoordinates ? (
              <p className='mt-3 text-sm text-slate-500'>
                Location available hote hi map yahan live show ho jayega.
              </p>
            ) : null}
          </SectionCard>

          <SectionCard title='Property & Boundaries' description='Boundary verification aur occupancy details.'>
            <FormGrid fields={PROPERTY_FIELDS} form={form} onFieldChange={handleFieldChange} />
          </SectionCard>

          <SectionCard title='NDMA Parameters' description='Structural aur disaster-risk observations.'>
            <FormGrid fields={NDMA_FIELDS} form={form} onFieldChange={handleFieldChange} />
          </SectionCard>

          <SectionCard title='Approval Details' description='Plan, layout aur sanction related details.'>
            <FormGrid fields={APPROVAL_FIELDS} form={form} onFieldChange={handleFieldChange} />
          </SectionCard>

          <SectionCard title='Technical Details' description='Construction, floor-wise usage aur site measurements.'>
            <FormGrid fields={TECHNICAL_FIELDS} form={form} onFieldChange={handleFieldChange} />
          </SectionCard>

          <SectionCard title='Planning, Risk & Age' description='Permissible area, demolition risk aur property age.'>
            <FormGrid fields={PLANNING_FIELDS} form={form} onFieldChange={handleFieldChange} />
          </SectionCard>

          <SectionCard title='Valuation Details' description='Land, BUA aur final valuation summary.'>
            <FormGrid fields={VALUATION_FIELDS} form={form} onFieldChange={handleFieldChange} />
          </SectionCard>

          <SectionCard title='Remarks' description='Final report observations aur field notes.'>
            <TextField
              label='Remarks'
              value={form.remarks}
              onChange={(event) => handleFieldChange("remarks", event.target.value)}
              textarea
            />
          </SectionCard>

          <SectionCard
            title='Images & Documents'
            description='Upload, delete, download aur ImageKit cleanup dono yahi se manage honge.'
          >
            <div className='grid gap-5 xl:grid-cols-2'>
              <MediaUploader
                type='image'
                title='Geo-tagged Images'
                items={form.imageUrls}
                reportId={id}
                mapView={form.mapView}
                onChange={(items) => handleFieldChange("imageUrls", items)}
                onLocationCapture={handleLocationUpdate}
              />
              <MediaUploader
                type='document'
                title='Attached Documents'
                items={form.AttachDocuments}
                reportId={id}
                mapView={form.mapView}
                onChange={(items) => handleFieldChange("AttachDocuments", items)}
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default BajajReportPage;
