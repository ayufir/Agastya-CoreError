
// import React, { useEffect } from "react";
// import { Form, Input, Button, Select, Divider } from "antd";
// import GeneralDetails from "./GeneralDetails";

// const LocalityDetails = ({ isEdit, onNext, onBack, extractedData }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     const merged = { ...extractedData, ...isEdit };
//     if (merged) {
//       form.setFieldsValue({
//         // Section 4 – Locality
//         localityDevelopment: merged.localityDevelopment || "",
//         approachRoadType: merged.approachRoadType || "",
//         approachRoadWidth: merged.approachRoadWidth || "15ft",
//         distanceFromCityCentre: merged.distanceFromCityCentre || "",
//         distanceFromRailwayStation: merged.distanceFromRailwayStation || "",
//         distanceFromBusStand: merged.distanceFromBusStand || "",
//         distanceFromHospital: merged.distanceFromHospital || "",
//         occupancyPercentage: merged.occupancyPercentage || "",
//         habitationPercentage: merged.habitationPercentage || "",
//         nallahRiverHighTension: merged.nallahRiverHighTension || "NA",
//         // Section 6 – NDMA
//         seismicZone: merged.seismicZone || "II",
//         cycloneZone: merged.cycloneZone || "NO",
//         landslideProneZone: merged.landslideProneZone || "No",
//         floodZone: merged.floodZone || "NO",
//         crZone: merged.crZone || "NO",
//         demolitionRisk: merged.localityDemolitionRisk || merged.demolitionRisk || "LOW",
//         demolitionRiskDetails: merged.demolitionRiskDetails || "NA",
//         followsNDMAGuidelines: merged.followsNDMAGuidelines || "YES",
//       });
//     }
//   }, [isEdit, extractedData, form]);

//   const handleSubmit = (values) => {
//     onNext({ ...values });
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-6 text-red-600">LOCALITY</h2>

//       <Form
//         layout="vertical"
//         form={form}
//         onFinish={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4"
//       >
//         {/* ── Section 4: Locality ── */}
//         <Divider orientation="left" className="md:col-span-2">LOCALITY DETAILS</Divider>

//         <Form.Item label="Locality Development" name="localityDevelopment" initialValue="Under Developed">
//           <Select allowClear>
//             <Select.Option value="Under Developed">Under Developed</Select.Option>
//             <Select.Option value="Developed">Developed</Select.Option>
//             <Select.Option value="Semi Developed">Semi Developed</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label="Approach Road Width (In Feet)" name="approachRoadWidth" initialValue="20 ft">
//           <Input />
//         </Form.Item>

//         <Form.Item label="Approach Road Type" name="approachRoadType" initialValue="Mud Road">
//           <Select allowClear>
//             <Select.Option value="RCC">RCC</Select.Option>
//             <Select.Option value="Kutcha">Kutcha</Select.Option>
//             <Select.Option value="Pucca">Pucca</Select.Option>
//             <Select.Option value="Mud Road">Mud Road</Select.Option>
//             <Select.Option value="Tar Road">Tar Road</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label="Distance from City Centre (in KM)" name="distanceFromCityCentre" initialValue="11 Km">
//           <Input />
//         </Form.Item>

//         <Form.Item label="Distance from Railway Station (in KM)" name="distanceFromRailwayStation" initialValue="9 Km">
//           <Input />
//         </Form.Item>

//         <Form.Item label="Distance from Bus Stand (in KM)" name="distanceFromBusStand" initialValue="10 Km">
//           <Input />
//         </Form.Item>

//         <Form.Item label="Distance from Hospital (in KM)" name="distanceFromHospital" initialValue="9 Km">
//           <Input />
//         </Form.Item>

//         <Form.Item label="Occupancy of Project / Area (%)" name="occupancyPercentage" initialValue="50%">
//           <Input />
//         </Form.Item>

//         <Form.Item label="Habitation in Surrounding Area" name="habitationPercentage" initialValue="Medium">
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Negative Markers If Any (HT Wire, Nallah, River, Lake, Road Widening)"
//           name="nallahRiverHighTension"
//           initialValue="NA"
//           className="md:col-span-2"
//         >
//           <Input />
//         </Form.Item>

//         <GeneralDetails
//           isEdit={isEdit}
//           onNext={onNext}
//           onBack={onBack}
//           extractedData={extractedData}
//         />

//         {/* ── Section 6: NDMA Guidelines ── */}
//         {/* <h2 className="text-2xl font-bold mb-6">LOCALITY</h2> */}

//         <Divider orientation="left" className="md:col-span-2 text-2xl font-bold">
//           <span className="text-red-600 text-2xl font-bold">NDMA GUIDELINES</span>
//         </Divider>
//         <Form.Item label="Property Falls under Seismic Zone" name="seismicZone" initialValue="II">
//           <Select allowClear>
//             <Select.Option value="I">Zone I</Select.Option>
//             <Select.Option value="II">Zone II</Select.Option>
//             <Select.Option value="III">Zone III</Select.Option>
//             <Select.Option value="IV">Zone IV</Select.Option>
//             <Select.Option value="V">Zone V</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label="Property Falls under Flood Zone" name="floodZone" initialValue="NO">
//           <Select allowClear>
//             <Select.Option value="YES">YES</Select.Option>
//             <Select.Option value="NO">NO</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label="Property Falls under Cyclone Zone" name="cycloneZone" initialValue="NO">
//           <Select allowClear>
//             <Select.Option value="Yes">Yes</Select.Option>
//             <Select.Option value="No">No</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label="Property Falls under Landslide Prone Zone" name="landslideProneZone" initialValue="NO">
//           <Select allowClear>
//             <Select.Option value="Yes">Yes</Select.Option>
//             <Select.Option value="No">No</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label="Property Falls in CR Zone" name="crZone" initialValue="NO">
//           <Select allowClear>
//             <Select.Option value="YES">YES</Select.Option>
//             <Select.Option value="NO">NO</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item label="Property Falls under Demolition Risk" name="demolitionRisk" initialValue="LOW">
//           <Select allowClear>
//             <Select.Option value="LOW">Low</Select.Option>
//             <Select.Option value="MEDIUM">Medium</Select.Option>
//             <Select.Option value="HIGH">High</Select.Option>
//             <Select.Option value="NO">No</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item
//           label="Demolition Risk Details"
//           name="demolitionRiskDetails"
//           initialValue="NA"
//           className="md:col-span-2"
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item label="Property Follows NDMA Guidelines" name="followsNDMAGuidelines" initialValue="YES">
//           <Select allowClear>
//             <Select.Option value="YES">Yes</Select.Option>
//             <Select.Option value="NO">No</Select.Option>
//           </Select>
//         </Form.Item>

//         {/* Actions */}
//         <div className="md:col-span-2">
//           <Form.Item className="text-right">
//             {onBack && (
//               <Button type="default" onClick={onBack} className="mr-2 px-4 py-2 bg-gray-500 rounded">
//                 Back
//               </Button>
//             )}
//             <Button type="primary" htmlType="submit">Next</Button>
//           </Form.Item>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default LocalityDetails;




import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Input, Button, Select, Divider } from "antd";
import GeneralDetails from "./GeneralDetails";

const { Option } = Select;

// Dropdown normalization helpers
const normalizeYesNo = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.startsWith("Y") || s === "1" || s === "TRUE") return "YES";
  if (s.startsWith("N") || s === "0" || s === "FALSE") return "NO";
  return undefined;
};

const normalizeLocationCategory = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("GP") || s.includes("GRAM") || s.includes("PANCH")) return "GP";
  if (s.includes("MC") || s.includes("CORP") || s.includes("MUNICIPAL")) return "MC";
  if (s.includes("MUNICIPAL-TP") || s.includes("TP")) return "MUNICIPAL-TP";
  return "OTHER";
};

const normalizeApproachRoadType = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("RCC")) return "RCC ROAD";
  if (s.includes("TAR") || s.includes("PUCCA") || s.includes("ASPHALT")) return "TAR ROAD";
  if (s.includes("PAVER") || s.includes("BLOCK")) return "PAVER BLOCK ROAD";
  if (s.includes("SOIL") || s.includes("MUD") || s.includes("KUTCHA") || s.includes("DIRT")) return "SOIL ROAD";
  if (s.includes("GRAVEL") || s.includes("WBM")) return "GRAVEL ROAD";
  return "OTHER";
};

const normalizeOccupancyPercentage = (val) => {
  if (!val) return undefined;
  const s = String(val);
  if (s.includes("100")) return "100%";
  if (s.includes("25")) return "25%";
  if (s.includes("50")) return "50%";
  return "50%";
};

const normalizeHabitation = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("LOW") || s.includes("POOR")) return "LOW";
  if (s.includes("DENSE") || s.includes("HIGH")) return "DENSE";
  return "MEDIUM";
};

const normalizeSeismicZone = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("I")) {
    if (s.includes("II")) {
      if (s.includes("III")) {
        if (s.includes("IV")) {
          if (s.includes("V")) return "V";
          return "IV";
        }
        return "III";
      }
      return "II";
    }
    return "I";
  }
  return "II";
};

const normalizeDemolitionRisk = (val) => {
  if (!val) return undefined;
  const s = String(val).toUpperCase();
  if (s.includes("HIGH")) return "HIGH";
  if (s.includes("MED")) return "MEDIUM";
  if (s.includes("LOW")) return "LOW";
  if (s.includes("NO")) return "NO";
  return "LOW";
};

const normalizeDemolitionRiskDetails = (val) => {
  if (!val) return undefined;
  const s = String(val).toLowerCase();
  if (s.includes("forest")) return "Forest Land";
  if (s.includes("govt land") || s.includes("government land")) return "Govt Land";
  if (s.includes("notification")) return "Govt Notification";
  if (s.includes("widening")) return "Road Widening";
  if (s.includes("demolition")) return "Demolition List";
  return "NA";
};

const LocalityDetails = ({
  isEdit,
  onNext,
  onBack,
  registerSectionSubmitter,
  sectionId,
  showActionButtons = true,
  extractedData,
  visibleSection = "locality",
}) => {
  const [form] = Form.useForm();
  const [documents, setDocuments] = useState([]); // will be filled by GeneralDetails
  const savedCity = useSelector((state) => state.assignedCases?.savedCity || "");
  const formValues = Form.useWatch([], form) || {};
  const hasValue = (name) => formValues[name] !== undefined && formValues[name] !== null && formValues[name] !== "";

  useEffect(() => {
    const currentValues = form.getFieldsValue();
    const merged = { ...isEdit };

    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const addr = p.address || {};
      const loc = p.location_details || {};
      const struct = p.structural_engineering || {};
      const legal = p.legal_and_compliance || {};
      const infra = p.infrastructure_details || {};

      const mapped = {
        nearestCityTown: String(
          extractedData.nearestCityTown ||
          extractedData.city ||
          extractedData.tehsil ||
          addr.tehsil ||
          addr.district ||
          loc.main_locality ||
          loc.city ||
          isEdit?.nearestCityTown ||
          savedCity ||
          isEdit?.city ||
          ""
        ).toUpperCase(),
        locationCategory: normalizeLocationCategory(loc.property_falling_within || extractedData.locationCategory || isEdit?.locationCategory),
        localityDevelopment: normalizeHabitation(loc.micro_location || extractedData.localityDevelopment || isEdit?.localityDevelopment || "Under Developed"),
        approachRoadType: normalizeApproachRoadType(loc.physical_approach || extractedData.approachRoadType || isEdit?.approachRoadType),
        approachRoadWidth: extractedData.approachRoadWidth || loc.width_approach_road || isEdit?.approachRoadWidth,
        distanceFromCityCentre: extractedData.distanceFromCityCentre || loc.distance_city_centre || isEdit?.distanceFromCityCentre,
        distanceFromRailwayStation: extractedData.distanceFromRailwayStation || loc.distance_railway_station || isEdit?.distanceFromRailwayStation,
        distanceFromBusStand: extractedData.distanceFromBusStand || loc.distance_bus_stop || isEdit?.distanceFromBusStand,
        occupancyPercentage: normalizeOccupancyPercentage(loc.occupancy_level || extractedData.occupancyPercentage || isEdit?.occupancyPercentage),
        habitationPercentage: normalizeHabitation(extractedData.habitationPercentage || isEdit?.habitationPercentage || "MEDIUM"),
        nallahRiverHighTension: loc.adverse_factors || extractedData.nallahRiverHighTension || isEdit?.nallahRiverHighTension,
        seismicZone: normalizeSeismicZone(struct.seismic_zone || extractedData.seismicZone || isEdit?.seismicZone),
        floodZone: normalizeYesNo(struct.flood_prone_area || extractedData.floodZone || isEdit?.floodZone),
        demolitionRisk: normalizeDemolitionRisk(legal.risk_of_demolition || extractedData.demolitionRisk || isEdit?.demolitionRisk),
        electricityAvailability: normalizeYesNo(infra.electricity_available || extractedData.electricityAvailability || isEdit?.electricityAvailability),
        waterAvailability: normalizeYesNo(infra.water_supply || extractedData.waterAvailability || isEdit?.waterAvailability),
        drainageAvailability: normalizeYesNo(infra.sewer_line_connected || extractedData.drainageAvailability || isEdit?.drainageAvailability),
      };

      Object.entries(mapped).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== "") {
          merged[key] = val;
        }
      });
    }

    if (merged) {
      const safeVal = (key, fallback = "") => {
        if (merged[key] !== undefined && merged[key] !== null && merged[key] !== "") {
          return merged[key];
        }
        return currentValues[key] !== undefined && currentValues[key] !== null ? currentValues[key] : fallback;
      };

      form.setFieldsValue({
        localityDevelopment: safeVal("localityDevelopment") || undefined,
        approachRoadType: safeVal("approachRoadType") || undefined,
        approachRoadWidth: safeVal("approachRoadWidth", ""),
        distanceFromCityCentre: safeVal("distanceFromCityCentre"),
        distanceFromRailwayStation: safeVal("distanceFromRailwayStation"),
        distanceFromBusStand: safeVal("distanceFromBusStand"),
        distanceFromHospital: safeVal("distanceFromHospital"),
        occupancyPercentage: safeVal("occupancyPercentage") || undefined,
        habitationPercentage: safeVal("habitationPercentage") || undefined,
        nallahRiverHighTension: safeVal("nallahRiverHighTension", ""),
        seismicZone: safeVal("seismicZone") || undefined,
        cycloneZone: safeVal("cycloneZone") || undefined,
        landslideProneZone: safeVal("landslideProneZone") || undefined,
        floodZone: safeVal("floodZone") || undefined,
        crZone: safeVal("crZone") || undefined,
        demolitionRisk: safeVal("localityDemolitionRisk") || safeVal("demolitionRisk") || undefined,
        demolitionRiskDetails: safeVal("demolitionRiskDetails", ""),
        followsNDMAGuidelines: safeVal("followsNDMAGuidelines") || undefined,
        nearestCityTown: safeVal("nearestCityTown", (savedCity || isEdit?.city || "").toUpperCase()),
        locationCategory: safeVal("locationCategory") || undefined,
        electricityAvailability: safeVal("electricityAvailability") || undefined,
        waterAvailability: safeVal("waterAvailability") || undefined,
        drainageAvailability: safeVal("drainageAvailability") || undefined,
      });
      if (merged.documents) setDocuments(merged.documents);
    }
  }, [isEdit, extractedData, form]);

  const handleDocumentsChange = (docs) => {
    setDocuments(docs);
  };

  const buildSectionData = useCallback((values) => ({
    ...values,
    documents: documents.map((doc) => ({
      key: doc.key,
      type: doc.type,
      approvingAuthority: doc.selectedApprovingAuthority || "",
      approvalDate: doc.approvalDate,
      approvalDetails: doc.approvalDetails,
    })),
  }), [documents]);

  useEffect(() => {
    if (!registerSectionSubmitter || !sectionId) return;

    registerSectionSubmitter(sectionId, async () => {
      const values = await form.validateFields();
      return buildSectionData(values);
    });

    return () => {
      registerSectionSubmitter(sectionId, null);
    };
  }, [registerSectionSubmitter, sectionId, form, buildSectionData]);

  const handleSubmit = (values) => {
    if (!onNext) return;
    onNext(buildSectionData(values));
  };

  const showLocality = visibleSection === "locality";
  const showPropertyPlan = visibleSection === "propertyPlan";
  const showNdma = visibleSection === "ndma";

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-slate-800">
        {showPropertyPlan ? "PROPERTY PLAN" : showNdma ? "NDMA GUIDELINES" : "LOCALITY"}
      </h2>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <style>{`
          .custom-form-item-wrapper label {
            position: absolute;
            top: -8px;
            left: 10px;
            background: #fff;
            padding: 0 6px;
            font-size: 11px;
            color: #475569;
            font-weight: 600;
            z-index: 2;
            opacity: 0;
            transform: translateY(12px);
            transition: opacity 0.15s ease, transform 0.15s ease;
            pointer-events: none;
          }
          .custom-form-item-wrapper:focus-within label,
          .custom-form-item-wrapper:has(.ant-form-item-has-error) label,
          .custom-form-item-wrapper.has-value label {
            opacity: 1;
            transform: translateY(0);
          }
          .custom-form-item-wrapper .ant-select-selector {
            height: 40px !important;
            border-radius: 6px !important;
            display: flex !important;
            align-items: center !important;
            border: 1px solid #d1d5db !important;
            box-shadow: none !important;
          }
          .custom-form-item-wrapper .ant-select-selection-placeholder {
            line-height: 38px !important;
          }
          .custom-form-item-wrapper .ant-select-selection-item {
            line-height: 38px !important;
            color: #0f172a !important;
            font-weight: 500 !important;
          }
          .custom-form-item-wrapper .ant-input {
            color: #0f172a !important;
            font-weight: 500 !important;
          }
          .custom-form-item-wrapper:has(.ant-form-item-has-error) label {
            color: #ff4d4f !important;
          }
          .custom-form-item-wrapper:has(.ant-form-item-has-error) .ant-select-selector,
          .custom-form-item-wrapper:has(.ant-form-item-has-error) .ant-input,
          .custom-form-item-wrapper:has(.ant-form-item-has-error) .ant-input-affix-wrapper {
            border-color: #ff4d4f !important;
          }
          .custom-form-item-wrapper .ant-form-item-explain-error {
            color: #ff4d4f !important;
            font-size: 12px;
            margin-top: 4px;
          }
        `}</style>
        {showLocality && (
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {/* Row 1: Nearest City / Town & Location Category */}
              <div className={`custom-form-item-wrapper ${hasValue("nearestCityTown") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Nearest City / Town</label>
                <Form.Item name="nearestCityTown" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Nearest City / Town" />
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("locationCategory") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Location Category</label>
                <Form.Item name="locationCategory" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Location Category">
                    <Option value="GP">GP</Option>
                    <Option value="MC">MC</Option>
                    <Option value="MUNICIPAL-TP">MUNICIPAL-TP</Option>
                    <Option value="OTHER">OTHER</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* DISTANCES Subtitle */}
              <div className="md:col-span-2" style={{ marginTop: "12px" }}>
                <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#0056b3", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0" }}>
                  DISTANCES
                </h4>
              </div>

              {/* Row 2: Distance from City Centre & Railway Station */}
              <div className={`custom-form-item-wrapper ${hasValue("distanceFromCityCentre") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Distance From City Centre (in Km)</label>
                <Form.Item name="distanceFromCityCentre" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Distance From City Centre (in Km)" />
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("distanceFromRailwayStation") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Railway Station (in Km)</label>
                <Form.Item name="distanceFromRailwayStation" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Railway Station (in Km)" />
                </Form.Item>
              </div>

              {/* Row 3: Bus Stand & Hospital */}
              <div className={`custom-form-item-wrapper ${hasValue("distanceFromBusStand") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Bus Stand (in Km)</label>
                <Form.Item name="distanceFromBusStand" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Bus Stand (in Km)" />
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("distanceFromHospital") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Hospital (in Km)</label>
                <Form.Item name="distanceFromHospital" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Hospital (in Km)" />
                </Form.Item>
              </div>

              {/* Row 4: Approach Road Width & Approach Road Type */}
              <div className={`custom-form-item-wrapper ${hasValue("approachRoadWidth") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Approach Road Width (in ft)</label>
                <Form.Item name="approachRoadWidth" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Approach Road Width (in ft)" />
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("approachRoadType") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Approach Road Type</label>
                <Form.Item name="approachRoadType" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Approach Road Type">
                    <Option value="RCC ROAD">RCC ROAD</Option>
                    <Option value="TAR ROAD">TAR ROAD</Option>
                    <Option value="PAVER BLOCK ROAD">PAVER BLOCK ROAD</Option>
                    <Option value="SOIL ROAD">SOIL ROAD</Option>
                    <Option value="GRAVEL ROAD">GRAVEL ROAD</Option>
                    <Option value="OTHER">OTHER</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Row 5: Occupancy percentage & Habitation percentage */}
              <div className={`custom-form-item-wrapper ${hasValue("occupancyPercentage") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Occupancy in Project</label>
                <Form.Item name="occupancyPercentage" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Occupancy in Project">
                    <Option value="25%">25%</Option>
                    <Option value="50%">50%</Option>
                    <Option value="100%">100%</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("habitationPercentage") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Habitation of nearby area</label>
                <Form.Item name="habitationPercentage" rules={[{ required: true, message: "Required!" }]} style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Habitation of nearby area">
                    <Option value="LOW">LOW</Option>
                    <Option value="MEDIUM">MEDIUM</Option>
                    <Option value="DENSE">DENSE</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Row 6: Negative Markers (Full Width) */}
              <div className={`custom-form-item-wrapper md:col-span-2 ${hasValue("nallahRiverHighTension") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Negative Markers (if any)</label>
                <Form.Item name="nallahRiverHighTension" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Negative Markers (if any)" />
                </Form.Item>
              </div>

              {/* AVAILABILITY Subtitle */}
              <div className="md:col-span-2" style={{ marginTop: "12px" }}>
                <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#0056b3", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0" }}>
                  AVAILABILITY
                </h4>
              </div>

              {/* Row 7: Electricity Supply & Water Supply */}
              <div className={`custom-form-item-wrapper ${hasValue("electricityAvailability") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Electricity Supply</label>
                <Form.Item name="electricityAvailability" rules={[{ required: true, message: "Required!" }]} style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Electricity Supply">
                    <Option value="YES">YES</Option>
                    <Option value="NO">NO</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("waterAvailability") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Water Supply</label>
                <Form.Item name="waterAvailability" rules={[{ required: true, message: "Required!" }]} style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Water Supply">
                    <Option value="YES">YES</Option>
                    <Option value="NO">NO</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Row 8: Drainage Line / Connection */}
              <div className={`custom-form-item-wrapper ${hasValue("drainageAvailability") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Drainage Line / Connection</label>
                <Form.Item name="drainageAvailability" rules={[{ required: true, message: "Required!" }]} style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Drainage Line / Connection">
                    <Option value="YES">YES</Option>
                    <Option value="NO">NO</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Save & Proceed Button */}
              <div className="md:col-span-2" style={{ marginTop: "24px" }}>
                <Button
                  htmlType="submit"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 24px",
                    borderRadius: "999px",
                    border: "2px solid #0056b3",
                    background: "transparent",
                    color: "#0056b3",
                    fontWeight: 600,
                    fontSize: "14px",
                    height: "42px",
                    cursor: "pointer",
                    boxShadow: "none"
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save & Proceed
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* GeneralDetails – full width */}
        {showPropertyPlan && (
          <div className="md:col-span-2">
            <GeneralDetails
              isEdit={isEdit}
              extractedData={extractedData}
              onDocumentsChange={handleDocumentsChange}
            />
            {/* Save & Proceed Button */}
            <div style={{ marginTop: "24px" }}>
              <Button
                htmlType="submit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 24px",
                  borderRadius: "999px",
                  border: "2px solid #0056b3",
                  background: "transparent",
                  color: "#0056b3",
                  fontWeight: 600,
                  fontSize: "14px",
                  height: "42px",
                  cursor: "pointer",
                  boxShadow: "none"
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save & Proceed
              </Button>
            </div>
          </div>
        )}

        {/* Section 6: NDMA Guidelines */}
        {showNdma && (
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <div className={`custom-form-item-wrapper ${hasValue("seismicZone") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Property Falls under Seismic Zone</label>
                <Form.Item name="seismicZone" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property Falls under Seismic Zone">
                    <Option value="I">I</Option>
                    <Option value="II">II</Option>
                    <Option value="III">III</Option>
                    <Option value="IV">IV</Option>
                    <Option value="V">V</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("floodZone") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Property Falls under Flood Zone</label>
                <Form.Item name="floodZone" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property Falls under Flood Zone">
                    <Option value="YES">YES</Option>
                    <Option value="NO">NO</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("cycloneZone") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Property Falls under Cyclone Zone</label>
                <Form.Item name="cycloneZone" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property Falls under Cyclone Zone">
                    <Option value="YES">YES</Option>
                    <Option value="NO">NO</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("landslideProneZone") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Property Falls under Landslide Prone Zone</label>
                <Form.Item name="landslideProneZone" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property Falls under Landslide Prone Zone">
                    <Option value="YES">YES</Option>
                    <Option value="NO">NO</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("crZone") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Property Falls in CR Zone</label>
                <Form.Item name="crZone" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property Falls in CR Zone">
                    <Option value="YES">YES</Option>
                    <Option value="NO">NO</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("demolitionRisk") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Property Falls under Demolition Risk</label>
                <Form.Item name="demolitionRisk" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property Falls under Demolition Risk">
                    <Option value="HIGH">HIGH</Option>
                    <Option value="MEDIUM">MEDIUM</Option>
                    <Option value="LOW">LOW</Option>
                    <Option value="NO">NO</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("demolitionRiskDetails") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Demolition Risk Details</label>
                <Form.Item name="demolitionRiskDetails" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Demolition Risk Details">
                    <Option value="Demolition List">Demolition List</Option>
                    <Option value="Forest Land">Forest Land</Option>
                    <Option value="Govt Land">Govt Land</Option>
                    <Option value="Govt Notification">Govt Notification</Option>
                    <Option value="Road Widening">Road Widening</Option>
                    <Option value="NA">NA</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("followsNDMAGuidelines") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Property Follows NDMA Guidelines</label>
                <Form.Item name="followsNDMAGuidelines" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property Follows NDMA Guidelines">
                    <Option value="YES">YES</Option>
                    <Option value="NO">NO</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Save & Proceed Button */}
              <div className="md:col-span-2" style={{ marginTop: "24px" }}>
                <Button
                  htmlType="submit"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 24px",
                    borderRadius: "999px",
                    border: "2px solid #0056b3",
                    background: "transparent",
                    color: "#0056b3",
                    fontWeight: 600,
                    fontSize: "14px",
                    height: "42px",
                    cursor: "pointer",
                    boxShadow: "none"
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save & Proceed
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {showActionButtons && (
          <div className="md:col-span-2 text-right">
            {onBack && (
              <Button onClick={onBack} className="mr-2">
                Back
              </Button>
            )}
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default LocalityDetails;
