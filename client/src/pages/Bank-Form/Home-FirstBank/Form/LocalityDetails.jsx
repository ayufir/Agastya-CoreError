
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
import { Form, Input, Button, Select, Divider } from "antd";
import GeneralDetails from "./GeneralDetails";

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

  useEffect(() => {
    const currentValues = form.getFieldsValue();
    const merged = { ...isEdit };

    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const loc = p.location_details || {};
      const struct = p.structural_engineering || {};
      const legal = p.legal_and_compliance || {};
      const infra = p.infrastructure_details || {};

      const mapped = {
        nearestCityTown: loc.main_locality || loc.city || extractedData.nearestCityTown,
        locationCategory: loc.property_falling_within || extractedData.locationCategory,
        localityDevelopment: loc.micro_location || extractedData.localityDevelopment,
        approachRoadType: loc.physical_approach || extractedData.approachRoadType,
        approachRoadWidth: loc.width_approach_road || extractedData.approachRoadWidth,
        distanceFromCityCentre: loc.distance_city_centre || extractedData.distanceFromCityCentre,
        distanceFromRailwayStation: loc.distance_railway_station || extractedData.distanceFromRailwayStation,
        distanceFromBusStand: loc.distance_bus_stop || extractedData.distanceFromBusStand,
        occupancyPercentage: loc.occupancy_level || extractedData.occupancyPercentage,
        nallahRiverHighTension: loc.adverse_factors || extractedData.nallahRiverHighTension,
        seismicZone: struct.seismic_zone || extractedData.seismicZone,
        floodZone: struct.flood_prone_area || extractedData.floodZone,
        demolitionRisk: legal.risk_of_demolition || extractedData.demolitionRisk,
        electricityAvailability: infra.electricity_available || extractedData.electricityAvailability,
        waterAvailability: infra.water_supply || extractedData.waterAvailability,
        drainageAvailability: infra.sewer_line_connected || extractedData.drainageAvailability,
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
        localityDevelopment: safeVal("localityDevelopment"),
        approachRoadType: safeVal("approachRoadType"),
        approachRoadWidth: safeVal("approachRoadWidth", "15ft"),
        distanceFromCityCentre: safeVal("distanceFromCityCentre"),
        distanceFromRailwayStation: safeVal("distanceFromRailwayStation"),
        distanceFromBusStand: safeVal("distanceFromBusStand"),
        distanceFromHospital: safeVal("distanceFromHospital"),
        occupancyPercentage: safeVal("occupancyPercentage"),
        habitationPercentage: safeVal("habitationPercentage"),
        nallahRiverHighTension: safeVal("nallahRiverHighTension", "NA"),
        seismicZone: safeVal("seismicZone", "II"),
        cycloneZone: safeVal("cycloneZone", "NO"),
        landslideProneZone: safeVal("landslideProneZone", "No"),
        floodZone: safeVal("floodZone", "NO"),
        crZone: safeVal("crZone", "NO"),
        demolitionRisk: safeVal("localityDemolitionRisk") || safeVal("demolitionRisk", "LOW"),
        demolitionRiskDetails: safeVal("demolitionRiskDetails", "NA"),
        followsNDMAGuidelines: safeVal("followsNDMAGuidelines", "YES"),
        nearestCityTown: safeVal("nearestCityTown") || safeVal("cityCentreName", "Bhopal"),
        locationCategory: safeVal("locationCategory", "MC"),
        electricityAvailability: safeVal("electricityAvailability", "YES"),
        waterAvailability: safeVal("waterAvailability", "YES"),
        drainageAvailability: safeVal("drainageAvailability", "YES"),
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
      <h2 className="text-2xl font-bold mb-6 text-red-600">
        {showPropertyPlan ? "PROPERTY PLAN" : showNdma ? "NDMA GUIDELINES" : "LOCALITY"}
      </h2>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {showLocality && (
          <>
            <Divider orientation="left" className="md:col-span-2">
              LOCALITY DETAILS
            </Divider>

            <Form.Item label="Nearest City / Town" name="nearestCityTown">
              <Input />
            </Form.Item>

            <Form.Item label="Location Category" name="locationCategory">
              <Select allowClear>
                <Select.Option value="MC">MC</Select.Option>
                <Select.Option value="Municipal Corporation">Municipal Corporation</Select.Option>
                <Select.Option value="Municipality">Municipality</Select.Option>
                <Select.Option value="Gram Panchayat">Gram Panchayat</Select.Option>
                <Select.Option value="Town Planning Authority">Town Planning Authority</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Locality Development" name="localityDevelopment">
              <Select allowClear>
                <Select.Option value="Under Developed">Under Developed</Select.Option>
                <Select.Option value="Developed">Developed</Select.Option>
                <Select.Option value="Semi Developed">Semi Developed</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Approach Road Width (In Feet)" name="approachRoadWidth">
              <Input />
            </Form.Item>

            <Form.Item label="Approach Road Type" name="approachRoadType">
              <Select allowClear>
                <Select.Option value="RCC">RCC</Select.Option>
                <Select.Option value="Kutcha">Kutcha</Select.Option>
                <Select.Option value="Pucca">Pucca</Select.Option>
                <Select.Option value="Mud Road">Mud Road</Select.Option>
                <Select.Option value="Tar Road">Tar Road</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Distance from City Centre (in KM)" name="distanceFromCityCentre">
              <Input />
            </Form.Item>

            <Form.Item label="Distance from Railway Station (in KM)" name="distanceFromRailwayStation">
              <Input />
            </Form.Item>

            <Form.Item label="Distance from Bus Stand (in KM)" name="distanceFromBusStand">
              <Input />
            </Form.Item>

            <Form.Item label="Distance from Hospital (in KM)" name="distanceFromHospital">
              <Input />
            </Form.Item>

            <Form.Item label="Occupancy of Project / Area (%)" name="occupancyPercentage">
              <Input />
            </Form.Item>

            <Form.Item label="Habitation in Surrounding Area" name="habitationPercentage">
              <Input />
            </Form.Item>

            <Form.Item
              label="Negative Markers If Any (HT Wire, Nallah, River, Lake, Road Widening)"
              name="nallahRiverHighTension"
              className="md:col-span-2"
            >
              <Input />
            </Form.Item>

            <Divider orientation="left" className="md:col-span-2">
              AVAILABILITY
            </Divider>

            <Form.Item label="Electricity Supply" name="electricityAvailability">
              <Select allowClear>
                <Select.Option value="YES">Yes</Select.Option>
                <Select.Option value="NO">No</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Water Supply" name="waterAvailability">
              <Select allowClear>
                <Select.Option value="YES">Yes</Select.Option>
                <Select.Option value="NO">No</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Drainage Line / Connection" name="drainageAvailability">
              <Select allowClear>
                <Select.Option value="YES">Yes</Select.Option>
                <Select.Option value="NO">No</Select.Option>
              </Select>
            </Form.Item>
          </>
        )}

        {/* GeneralDetails – full width */}
        {showPropertyPlan && (
          <div className="md:col-span-2">
            <GeneralDetails
              isEdit={isEdit}
              extractedData={extractedData}
              onDocumentsChange={handleDocumentsChange}
            />
          </div>
        )}

        {/* Section 6: NDMA Guidelines */}
        {showNdma && (
          <>
            <Divider orientation="left" className="md:col-span-2">
              <span className="text-red-600 text-2xl font-bold">NDMA GUIDELINES</span>
            </Divider>

            <Form.Item label="Property Falls under Seismic Zone" name="seismicZone">
              <Select allowClear>
                <Select.Option value="I">Zone I</Select.Option>
                <Select.Option value="II">Zone II</Select.Option>
                <Select.Option value="III">Zone III</Select.Option>
                <Select.Option value="IV">Zone IV</Select.Option>
                <Select.Option value="V">Zone V</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Property Falls under Flood Zone" name="floodZone">
              <Select allowClear>
                <Select.Option value="YES">YES</Select.Option>
                <Select.Option value="NO">NO</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Property Falls under Cyclone Zone" name="cycloneZone">
              <Select allowClear>
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Property Falls under Landslide Prone Zone" name="landslideProneZone">
              <Select allowClear>
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Property Falls in CR Zone" name="crZone">
              <Select allowClear>
                <Select.Option value="YES">YES</Select.Option>
                <Select.Option value="NO">NO</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Property Falls under Demolition Risk" name="demolitionRisk">
              <Select allowClear>
                <Select.Option value="LOW">Low</Select.Option>
                <Select.Option value="MEDIUM">Medium</Select.Option>
                <Select.Option value="HIGH">High</Select.Option>
                <Select.Option value="NO">No</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Demolition Risk Details"
              name="demolitionRiskDetails"
              className="md:col-span-2"
            >
              <Input />
            </Form.Item>

            <Form.Item label="Property Follows NDMA Guidelines" name="followsNDMAGuidelines">
              <Select allowClear>
                <Select.Option value="YES">Yes</Select.Option>
                <Select.Option value="NO">No</Select.Option>
              </Select>
            </Form.Item>
          </>
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
