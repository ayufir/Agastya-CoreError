import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Spin,
} from "antd";
import GeoLocationInput from "../../../../components/GeoLocationInput";
import { useSelector } from "react-redux";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

const LNTAssignmentDetails = ({
  isEdit,
  onNext,
  registerSectionSubmitter,
  sectionId,
  showActionButtons = true,
  extractedData,
  visibleSection = "general",
}) => {
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const formValues = Form.useWatch([], form) || {};
  const propertyCategory = formValues.propertyCategory;
  const hasValue = (name) => formValues[name] !== undefined && formValues[name] !== null && formValues[name] !== "";
  const initialValues = {
    personMetDuringVisit: "",
    personContactNo: "",
    relationshipOfPersonMet: "SELF",
    propertyOwnerName: "",
    howFoundOwnerName: "SALE DEED",
    typeOfLoan: "OWN PLOT + SECO",
    dateOfReport: null,
    dateOfVisit: null,
    vendorName: "UNIQUE ENGINEERING AND ASSOCIATE",
    clContractNo: "",
    refNo: "N/A",
    evaluationType: "N/A",
    unitType: "Row House",
    propertyCategory: "INDIVIDUAL",
    propertyLocation: undefined,
    populationCensus2011: "",
    ruralUrban: undefined,
    zone: undefined,
    propertyAreaLimits: undefined,
    eraApplicable: "",
    projectName: "",
    documentsAvailable: "YES",
    nameOnSocietyBoard: "",
    addressLegal: "",
    addressSite: "",
    nameOnDoor: "NA",
    nearbyLandmark: "",
    statusOfOccupancy: "VACANT",
    occupiedBy: "NA",
    usageOfProperty: "RESIDENTIAL",
    propertyEasilyIdentifiable: "YES",
    projectPinCode: "",
  };

  const addressLegal = formValues.addressLegal;
  const ruralUrban = formValues.ruralUrban;
  const statusOfOccupancy = formValues.statusOfOccupancy;

  // Sync addressLegal to addressSite automatically and extract pin code
  useEffect(() => {
    if (addressLegal) {
      const updates = { addressSite: addressLegal };
      const pinCodeMatch = addressLegal.match(/\b\d{6}\b/);
      if (pinCodeMatch) {
        updates.projectPinCode = pinCodeMatch[0];
      }
      form.setFieldsValue(updates);
    }
  }, [addressLegal, form]);

  // Sync ruralUrban to populationCensus2011 automatically
  useEffect(() => {
    if (ruralUrban === "URBAN") {
      form.setFieldsValue({ populationCensus2011: "100000" });
    } else if (ruralUrban === "RURAL") {
      form.setFieldsValue({ populationCensus2011: "10000" });
    }
  }, [ruralUrban, form]);

  // Sync statusOfOccupancy to occupiedBy automatically
  useEffect(() => {
    if (statusOfOccupancy === "VACANT") {
      form.setFieldsValue({ occupiedBy: "NA" });
    }
  }, [statusOfOccupancy, form]);

  useEffect(() => {
    const currentValues = form.getFieldsValue();
    const merged = { ...isEdit };

    let locCat = "";
    let customerName = isEdit?.customerName || "";
    let statusOfOccupancyVal = isEdit?.statusOfOccupancy || "VACANT";

    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const addr = p.address || {};
      const bankDet = p.bank_specific_details || {};
      const accom = p.accommodation_details || {};
      const propDet = p.property_details || {};
      const loc = p.location_details || {};

      locCat = extractedData.locationCategory || loc.property_falling_within || "";
      customerName = p.applicant_name || p.owner_name || extractedData.customerName || customerName;
      statusOfOccupancyVal = propDet.occupancy || loc.occupancy_level || statusOfOccupancyVal;
      if (statusOfOccupancyVal) statusOfOccupancyVal = statusOfOccupancyVal.toUpperCase();

      const docPersonMet = p.contact_person || extractedData.personMetDuringVisit || "";
      const docRelation = p.relationship_met_at_site || extractedData.relationshipOfPersonMet || "";
      
      let finalPersonMet = "N/A";
      let finalRelation = "SELF";

      if (statusOfOccupancyVal === "VACANT" && !docPersonMet) {
        finalPersonMet = "";
        finalRelation = "";
      } else if (docPersonMet && docRelation && docRelation !== "N/A" && docRelation !== "SELF") {
        finalPersonMet = docPersonMet;
        finalRelation = docRelation.toUpperCase();
      } else if (docPersonMet) {
        finalPersonMet = docPersonMet;
        finalRelation = "REPRESENTATIVE";
      } else {
        finalPersonMet = customerName || "N/A";
        finalRelation = "SELF";
      }

      let finalPropLoc = "TOWN";
      let finalAreaLim = "MUNICIPAL-TP";
      let finalRuralUrban = "URBAN";

      const village = addr.village_name || extractedData.villageName || "";
      const normalizedVillage = String(village).toLowerCase();
      const normalizedLocCat = String(locCat).toLowerCase();

      if (normalizedVillage && normalizedVillage !== "na" && normalizedVillage !== "n/a") {
        finalPropLoc = "VILLAGE";
        finalAreaLim = "GP";
        finalRuralUrban = "RURAL";
      } else if (normalizedLocCat.includes("municipal") || normalizedLocCat.includes("mc") || normalizedLocCat.includes("corporation")) {
        finalPropLoc = "CITY";
        finalAreaLim = "MUNICIPAL";
        finalRuralUrban = "URBAN";
      } else if (normalizedLocCat.includes("nagar") || normalizedLocCat.includes("palika") || normalizedLocCat.includes("planning") || normalizedLocCat.includes("tp")) {
        finalPropLoc = "TOWN";
        finalAreaLim = "MUNICIPAL-TP";
        finalRuralUrban = "URBAN";
      } else if (normalizedLocCat.includes("gram") || normalizedLocCat.includes("panchayat") || normalizedLocCat.includes("gp")) {
        finalPropLoc = "VILLAGE";
        finalAreaLim = "GP";
        finalRuralUrban = "RURAL";
      }

      const addrLegal = extractedData.addressLegal || addr.full_address || "";
      const addrSite = extractedData.addressSite || addr.full_address || addrLegal;

      const mapped = {
        customerName,
        customerNo: p.contact_number || p["Mobile No."] || extractedData.customerNo,
        propertyName: p.property_type || accom.type_of_structure,
        personMetDuringVisit: finalPersonMet,
        relationshipOfPersonMet: finalRelation,
        propertyOwnerName: p.owner_name || extractedData.propertyOwnerName || customerName,
        dateOfReport: p.dateOfReport || extractedData.dateOfReport || extractedData.reportDate,
        dateOfVisit: p.dateOfVisit || extractedData.dateOfVisit,
        refNo: bankDet.file_no || bankDet.lan_no || extractedData.registration_number || extractedData.refNo,
        addressLegal: addrLegal,
        addressSite: addrSite,
        nearbyLandmark: loc.landmark || extractedData.nearbyLandmark,
        statusOfOccupancy: statusOfOccupancyVal,
        occupiedBy: (propDet.occupied_by || "NA").toUpperCase(),
        usageOfProperty: (p.property_use || "RESIDENTIAL").toUpperCase(),
        latitude: p.latitude || extractedData.latitude,
        longitude: p.longitude || extractedData.longitude,
        propertyLocation: finalPropLoc,
        propertyAreaLimits: finalAreaLim,
        ruralUrban: finalRuralUrban,
        projectPinCode: extractedData.projectPinCode || extractedData.pincode || addr.pincode || "",
        nameOnDoor: extractedData.nameOnDoor || propDet.name_on_door || p.name_on_door || isEdit?.nameOnDoor || "NA",
        nameOnSocietyBoard: extractedData.nameOnSocietyBoard || propDet.name_on_society_board || p.name_on_society_board || isEdit?.nameOnSocietyBoard || "",
      };

      Object.entries(mapped).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== "") {
          merged[key] = val;
        }
      });
    }

    if (merged) {
      const getValidMoment = (val) => {
        if (!val || val === "N/A" || val === "undefined" || val === "null" || val === "") return null;
        let m = moment(val, moment.ISO_8601, true);
        if (m.isValid()) return m;
        m = moment(val, "DD.MM.YYYY", true);
        if (m.isValid()) return m;
        m = moment(val, "YYYY-MM-DD", true);
        if (m.isValid()) return m;
        m = moment(val);
        if (m.isValid()) return m;
        return null;
      };

      const parsedDate = getValidMoment(merged.dateOfReport) || currentValues.dateOfReport || moment();
      const parsedVisitDate = getValidMoment(merged.dateOfVisit) || currentValues.dateOfVisit || moment();

      const safeVal = (key, fallback = "") => {
        if (merged[key] !== undefined && merged[key] !== null && merged[key] !== "") {
          return merged[key];
        }
        return currentValues[key] !== undefined && currentValues[key] !== null ? currentValues[key] : fallback;
      };

      form.setFieldsValue({
        customerName: safeVal("customerName"),
        customerNo: safeVal("customerNo"),
        propertyName: safeVal("propertyName"),
        personMetDuringVisit: safeVal("personMetDuringVisit", ""),
        personContactNo: safeVal("personContactNo", ""),
        relationshipOfPersonMet: safeVal("relationshipOfPersonMet", "SELF"),
        propertyOwnerName: safeVal("propertyOwnerName"),
        howFoundOwnerName: safeVal("howFoundOwnerName", "SALE DEED"),
        typeOfLoan: safeVal("typeOfLoan", "OWN PLOT + SECO"),
        dateOfReport: parsedDate,
        dateOfVisit: parsedVisitDate,
        vendorName: safeVal("vendorName", "UNIQUE ENGINEERING AND ASSOCIATE"),
        clContractNo: safeVal("clContractNo", ""),
        refNo: safeVal("refNo", "N/A"),
        evaluationType: safeVal("evaluationType", "N/A"),
        unitType: safeVal("unitType", "Row House") || undefined,
        propertyCategory: safeVal("propertyCategory", "INDIVIDUAL") || undefined,
        propertyLocation: safeVal("propertyLocation") || undefined,
        populationCensus2011: safeVal("populationCensus2011", ""),
        ruralUrban: safeVal("ruralUrban") || undefined,
        zone: safeVal("zone") || undefined,
        propertyAreaLimits: safeVal("propertyAreaLimits") || undefined,
        eraApplicable: safeVal("eraApplicable", ""),
        projectName: safeVal("projectName", ""),
        documentsAvailable: safeVal("documentsAvailable", "YES"),
        nameOnSocietyBoard: safeVal("nameOnSocietyBoard", ""),
        addressLegal: safeVal("addressLegal"),
        addressSite: safeVal("addressSite") || safeVal("addressLegal"),
        nameOnDoor: safeVal("nameOnDoor", "NA"),
        nearbyLandmark: safeVal("nearbyLandmark"),
        statusOfOccupancy: safeVal("statusOfOccupancy", "VACANT"),
        occupiedBy: safeVal("occupiedBy", "NA"),
        usageOfProperty: safeVal("usageOfProperty", "RESIDENTIAL"),
        propertyEasilyIdentifiable: safeVal("propertyEasilyIdentifiable", "YES"),
        latitude: safeVal("latitude"),
        longitude: safeVal("longitude"),
        projectPinCode: safeVal("projectPinCode"),
      });
    }
  }, [isEdit, extractedData, form]);

  const geoRef = useRef();

  useEffect(() => {
    if (user.role === "FieldOfficer") {
      const timeout = setTimeout(() => {
        geoRef.current?.getLocation();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [user.role]);

  const buildSubmissionData = (values) => ({ ...values });

  useEffect(() => {
    if (!registerSectionSubmitter || !sectionId) return;

    registerSectionSubmitter(sectionId, async () => {
      const values = await form.validateFields();
      return buildSubmissionData(values);
    });

    return () => {
      registerSectionSubmitter(sectionId, null);
    };
  }, [registerSectionSubmitter, sectionId, form]);

  const handleSubmit = async (values) => {
    if (!onNext) return;
    setLoading(true);
    try {
      await onNext(buildSubmissionData(values));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const showGeneralDetails = visibleSection === "general";
  const showPropertyOverview = visibleSection === "propertyOverview";
  const showVisitDetails = visibleSection === "visitDetails";

  if (loading) return <Spin />;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded shadow">
      
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
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
            color: #94a3b8;
            font-weight: 500;
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
        {/* ── SECTION 1: GENERAL DETAILS ── */}
        {showGeneralDetails && (
          <div className="md:col-span-2">
            {user?.role !== "FieldOfficer" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                {/* Row 1: Vendor Name */}
                <div className="md:col-span-2" style={{ maxWidth: "50%" }}>
                  <div style={{ position: "relative", marginTop: "6px" }}>
                    <label style={{ position: "absolute", top: "-8px", left: "10px", background: "#fff", padding: "0 6px", fontSize: "11px", color: "#94a3b8", fontWeight: 500, zIndex: 2 }}>
                      Vendor Name
                    </label>
                    <Form.Item name="vendorName" style={{ margin: 0 }}>
                      <Input readOnly style={{ height: "40px", borderRadius: "6px", border: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#6b7280", cursor: "not-allowed" }} />
                    </Form.Item>
                  </div>
                </div>

                {/* Row 2: Date of Visit & CL Contract No */}
                <div style={{ position: "relative", marginTop: "6px" }}>
                  <label style={{ position: "absolute", top: "-8px", left: "10px", background: "#fff", padding: "0 6px", fontSize: "11px", color: "#94a3b8", fontWeight: 500, zIndex: 2 }}>
                    Date of Visit
                  </label>
                  <Form.Item name="dateOfVisit" style={{ margin: 0 }}>
                    <DatePicker className="w-full" format="DD.MM.YYYY" style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
                  </Form.Item>
                </div>
                <div style={{ position: "relative", marginTop: "6px" }}>
                  <label style={{ position: "absolute", top: "-8px", left: "10px", background: "#fff", padding: "0 6px", fontSize: "11px", color: "#94a3b8", fontWeight: 500, zIndex: 2 }}>
                    CL Contract No
                  </label>
                  <Form.Item name="clContractNo" style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
                  </Form.Item>
                </div>

                {/* Row 3: Project Pin Code */}
                <div style={{ maxWidth: "100%" }}>
                  <div style={{ position: "relative", marginTop: "6px" }}>
                    <label style={{ position: "absolute", top: "-8px", left: "10px", background: "#fff", padding: "0 6px", fontSize: "11px", color: "#94a3b8", fontWeight: 500, zIndex: 2 }}>
                      Project Pin Code
                    </label>
                    <Form.Item
                      name="projectPinCode"
                      rules={[
                        { required: true, message: "Pin Code is required" },
                        { pattern: /^[0-9]{6}$/, message: "Pin Code must be exactly 6 digits" }
                      ]}
                      style={{ margin: 0 }}
                    >
                      <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
                    </Form.Item>
                  </div>
                </div>
                <div></div>

                {/* GEO COORDINATES SUBTITLE */}
                <div className="md:col-span-2" style={{ marginTop: "12px" }}>
                  <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#0056b3", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px 0" }}>
                    GEO COORDINATES
                  </h4>
                </div>

                {/* Row 4: Latitude & Longitude */}
                <div style={{ position: "relative", marginTop: "6px" }}>
                  <label style={{ position: "absolute", top: "-8px", left: "10px", background: "#fff", padding: "0 6px", fontSize: "11px", color: "#94a3b8", fontWeight: 500, zIndex: 2 }}>
                    Latitude
                  </label>
                  <Form.Item
                    name="latitude"
                    rules={[
                      { required: true, message: "Latitude is required" },
                      {
                        validator: (_, value) => {
                          const num = parseFloat(value);
                          if (isNaN(num) || num < -90 || num > 90) {
                            return Promise.reject("Latitude must be between -90 and 90");
                          }
                          return Promise.resolve();
                        }
                      }
                    ]}
                    extra={<span style={{ fontSize: "11px", color: "#6b7280" }}>Example: 19.0760</span>}
                    style={{ margin: 0 }}
                  >
                    <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
                  </Form.Item>
                </div>
                <div style={{ position: "relative", marginTop: "6px" }}>
                  <label style={{ position: "absolute", top: "-8px", left: "10px", background: "#fff", padding: "0 6px", fontSize: "11px", color: "#94a3b8", fontWeight: 500, zIndex: 2 }}>
                    Longitude
                  </label>
                  <Form.Item
                    name="longitude"
                    rules={[
                      { required: true, message: "Longitude is required" },
                      {
                        validator: (_, value) => {
                          const num = parseFloat(value);
                          if (isNaN(num) || num < -180 || num > 180) {
                            return Promise.reject("Longitude must be between -180 and 180");
                          }
                          const lat = parseFloat(form.getFieldValue("latitude"));
                          if (!isNaN(lat) && num === lat) {
                            return Promise.reject("Longitude cannot equal Latitude");
                          }
                          return Promise.resolve();
                        }
                      }
                    ]}
                    extra={<span style={{ fontSize: "11px", color: "#6b7280" }}>Example: 72.8777</span>}
                    style={{ margin: 0 }}
                  >
                    <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
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
            )}
          </div>
        )}

        {/* ── SECTION 2: Property Overview ── */}
        {showPropertyOverview && (
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {/* Row 1: Property Category & Property Type */}
              <div className={`custom-form-item-wrapper ${hasValue("propertyCategory") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>
                  Property Category
                </label>
                <Form.Item
                  name="propertyCategory"
                  rules={[{ required: true, message: "Property Category is required" }]}
                  style={{ margin: 0 }}
                >
                  <Select allowClear className="w-full" placeholder="Property Category">
                    <Option value="PROJECT">PROJECT</Option>
                    <Option value="INDIVIDUAL">INDIVIDUAL</Option>
                    <Option value="OTHER">OTHER</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("unitType") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>
                  Property Type
                </label>
                <Form.Item
                  name="unitType"
                  rules={[{ required: true, message: "Property Type is required" }]}
                  style={{ margin: 0 }}
                >
                  <Select allowClear className="w-full" placeholder="Property Type">
                    <Option value="Apartment">Apartment</Option>
                    <Option value="Flat">Flat</Option>
                    <Option value="Row House">Row House</Option>
                    <Option value="Individual House">Individual House</Option>
                    <Option value="Open Plot">Open Plot</Option>
                    <Option value="Shop">Shop</Option>
                    <Option value="Office">Office</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Row 2: Type of Loan & Property Location */}
              <div className={`custom-form-item-wrapper ${hasValue("typeOfLoan") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>
                  Type of Loan
                </label>
                <Form.Item
                  name="typeOfLoan"
                  rules={[{ required: true, message: "Type of Loan is required" }]}
                  style={{ margin: 0 }}
                >
                  <Select allowClear className="w-full" placeholder="Type of Loan">
                    <Option value="PLOT + SECO">PLOT + SECO</Option>
                    <Option value="OWN PLOT + SECO">OWN PLOT + SECO</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("propertyLocation") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>
                  Property Location
                </label>
                <Form.Item
                  name="propertyLocation"
                  style={{ margin: 0 }}
                >
                  <Select allowClear className="w-full" placeholder="Property Location">
                    <Option value="CITY">CITY</Option>
                    <Option value="TOWN">TOWN</Option>
                    <Option value="VILLAGE">VILLAGE</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Row 3: Population as per Census 2011 & Rural / Urban */}
              <div className={`custom-form-item-wrapper ${hasValue("populationCensus2011") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>
                  Population as per Census 2011
                </label>
                <Form.Item
                  name="populationCensus2011"
                  rules={[{ required: true, message: "Population is required" }]}
                  style={{ margin: 0 }}
                >
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Population as per Census 2011" />
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("ruralUrban") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>
                  {"Rural / Urban (>10K = Urban)"}
                </label>
                <Form.Item
                  name="ruralUrban"
                  rules={[{ required: true, message: "Please select Rural or Urban" }]}
                  style={{ margin: 0 }}
                >
                  <Select allowClear className="w-full" placeholder="Rural / Urban (>10K = Urban)">
                    <Option value="RURAL">RURAL</Option>
                    <Option value="URBAN">URBAN</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Row 4: Zone & Property Area Limits */}
              <div className={`custom-form-item-wrapper ${hasValue("zone") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>
                  Zone
                </label>
                <Form.Item
                  name="zone"
                  rules={[{ required: true, message: "Zone is required" }]}
                  style={{ margin: 0 }}
                >
                  <Select allowClear className="w-full" placeholder="Zone">
                    <Option value="RESIDENTIAL">RESIDENTIAL</Option>
                    <Option value="COMMERCIAL">COMMERCIAL</Option>
                    <Option value="INDUSTRIAL">INDUSTRIAL</Option>
                    <Option value="AGRICULTURAL">AGRICULTURAL</Option>
                    <Option value="MIXED">MIXED</Option>
                    <Option value="OTHER">OTHER</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("propertyAreaLimits") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>
                  Property Area Limits
                </label>
                <Form.Item name="propertyAreaLimits" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property Area Limits">
                    <Option value="GP">GP</Option>
                    <Option value="MUNICIPAL">MUNICIPAL</Option>
                    <Option value="MUNICIPAL-TP">MUNICIPAL-TP</Option>
                    <Option value="ZP">ZP</Option>
                    <Option value="OTHER">OTHER</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Row 5: RERA Approval No & Project Name */}
              <div className={`custom-form-item-wrapper ${hasValue("eraApplicable") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>
                  RERA Approval No
                </label>
                <Form.Item
                  name="eraApplicable"
                  rules={[{ required: true, message: "RERA Approval Number is required" }]}
                  style={{ margin: 0 }}
                >
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="RERA Approval No" />
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("projectName") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>
                  Project Name
                </label>
                <Form.Item name="projectName" style={{ margin: 0 }}>
                  <Input
                    disabled={propertyCategory !== "PROJECT"}
                    style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                    placeholder="Project Name"
                  />
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

        {/* ── SECTION 3: Visit Details ── */}
        {showVisitDetails && (
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {/* Row 1: Person Met & Relationship */}
              <div className={`custom-form-item-wrapper ${hasValue("personMetDuringVisit") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Person Met</label>
                <Form.Item name="personMetDuringVisit" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Person Met" />
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("relationshipOfPersonMet") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Relationship of person met and property</label>
                <Form.Item
                  name="relationshipOfPersonMet"
                  rules={[{ required: true, message: "Relationship is required" }]}
                  style={{ margin: 0 }}
                >
                  <Select allowClear className="w-full" placeholder="Relationship of person met and property">
                    <Option value="SELF">SELF</Option>
                    <Option value="SPOUSE">SPOUSE</Option>
                    <Option value="RELATIVE">RELATIVE</Option>
                    <Option value="SELLER">SELLER</Option>
                    <Option value="BUYER">BUYER</Option>
                    <Option value="COLONISER">COLONISER</Option>
                    <Option value="BROKER">BROKER</Option>
                    <Option value="OTHER">OTHER</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Row 2: Current Owner & How did you find out */}
              <div className={`custom-form-item-wrapper ${hasValue("propertyOwnerName") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Current Owner of the Property</label>
                <Form.Item name="propertyOwnerName" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Current Owner of the Property" />
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("howFoundOwnerName") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Owner Name Source</label>
                <Form.Item
                  name="howFoundOwnerName"
                  rules={[{ required: true, message: "Owner Name Source is required" }]}
                  style={{ margin: 0 }}
                >
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Owner Name Source" />
                </Form.Item>
              </div>

              {/* Row 3: Documents Available & Name on Society Board */}
              <div className={`custom-form-item-wrapper ${hasValue("documentsAvailable") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Property Documents Available?</label>
                <Form.Item name="documentsAvailable" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property Documents Available?">
                    <Option value="YES">YES</Option>
                    <Option value="NO">NO</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("nameOnSocietyBoard") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Name on Society Board / Signage</label>
                <Form.Item name="nameOnSocietyBoard" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Name on Society Board / Signage" />
                </Form.Item>
              </div>

              {/* Row 4: Address Legal & Address Site */}
              <div className={`custom-form-item-wrapper ${hasValue("addressLegal") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Address as per legal document (Sale Deed)</label>
                <Form.Item name="addressLegal" style={{ margin: 0 }}>
                  <TextArea rows={3} style={{ borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Address as per legal document (Sale Deed)" />
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("addressSite") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Address of Property (As per site)</label>
                <Form.Item name="addressSite" style={{ margin: 0 }}>
                  <TextArea rows={3} style={{ borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Address of Property (As per site)" />
                </Form.Item>
              </div>

              {/* Row 5: Name on Door & Nearby Landmark */}
              <div className={`custom-form-item-wrapper ${hasValue("nameOnDoor") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Name on door of the premises</label>
                <Form.Item name="nameOnDoor" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Name on door of the premises" />
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("nearbyLandmark") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Nearby landmark (within 500m)</label>
                <Form.Item name="nearbyLandmark" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Nearby landmark (within 500m)" />
                </Form.Item>
              </div>

              {/* Row 6: Occupancy Status & Occupied By */}
              <div className={`custom-form-item-wrapper ${hasValue("statusOfOccupancy") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Occupancy Status</label>
                <Form.Item name="statusOfOccupancy" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Occupancy Status">
                    <Option value="VACANT">VACANT</Option>
                    <Option value="OCCUPIED">OCCUPIED</Option>
                    <Option value="PARTLY OCCUPIED">PARTLY OCCUPIED</Option>
                    <Option value="OTHER">OTHER</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("occupiedBy") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Occupied By</label>
                <Form.Item
                  name="occupiedBy"
                  rules={[
                    {
                      validator: (_, value) => {
                        const occStatus = form.getFieldValue("statusOfOccupancy");
                        if (occStatus !== "VACANT" && (!value || value === "NA")) {
                          return Promise.reject("Required when occupancy is not VACANT");
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                  style={{ margin: 0 }}
                >
                  <Select allowClear className="w-full" placeholder="Occupied By">
                    <Option value="OWNER">OWNER</Option>
                    <Option value="TENANT">TENANT</Option>
                    <Option value="THIRD PARTY">THIRD PARTY</Option>
                    <Option value="ENCROACHER">ENCROACHER</Option>
                    <Option value="OTHER">OTHER</Option>
                    <Option value="NA">NA</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Row 7: Usage of Property & Property easily identifiable */}
              <div className={`custom-form-item-wrapper ${hasValue("usageOfProperty") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Usage of property</label>
                <Form.Item name="usageOfProperty" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Usage of property">
                    <Option value="VACANT PLOT">VACANT PLOT</Option>
                    <Option value="RESIDENTIAL">RESIDENTIAL</Option>
                    <Option value="COMMERCIAL">COMMERCIAL</Option>
                    <Option value="AGRICULTURAL">AGRICULTURAL</Option>
                    <Option value="MIXED">MIXED</Option>
                    <Option value="OTHER">OTHER</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("propertyEasilyIdentifiable") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Property easily identifiable?</label>
                <Form.Item name="propertyEasilyIdentifiable" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property easily identifiable?">
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

        {/* ── Geo Location for FieldOfficer ── */}
        {showGeneralDetails && user?.role === "FieldOfficer" && (
          <div style={{ display: "none" }}>
            <GeoLocationInput ref={geoRef} />
          </div>
        )}

        {showActionButtons && (
          <Form.Item className="md:col-span-2 text-end">
            <Button type="primary" htmlType="submit" className="mt-4" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default LNTAssignmentDetails;
