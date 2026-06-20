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
    relationshipOfPersonMet: "",
    propertyOwnerName: "",
    howFoundOwnerName: "",
    typeOfLoan: "BT + TopUp",
    dateOfReport: null,
    dateOfVisit: null,
    vendorName: "Unique Engineering and Associate - Bhopal",
    clContractNo: "",
    refNo: "N/A",
    evaluationType: "N/A",
    unitType: undefined,
    propertyCategory: undefined,
    propertyLocation: undefined,
    populationCensus2011: "",
    ruralUrban: undefined,
    zone: undefined,
    propertyAreaLimits: undefined,
    eraApplicable: "",
    projectName: "",
    documentsAvailable: undefined,
    nameOnSocietyBoard: "",
    addressLegal: "",
    addressSite: "",
    nameOnDoor: "",
    nearbyLandmark: "",
    statusOfOccupancy: undefined,
    occupiedBy: undefined,
    usageOfProperty: undefined,
    propertyEasilyIdentifiable: undefined,
  };

  useEffect(() => {
    const currentValues = form.getFieldsValue();
    const merged = { ...isEdit };

    let locCat = "";
    let customerName = isEdit?.customerName || "";
    let statusOfOccupancy = isEdit?.statusOfOccupancy || "Vacant";

    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const addr = p.address || {};
      const bankDet = p.bank_specific_details || {};
      const accom = p.accommodation_details || {};
      const propDet = p.property_details || {};
      const loc = p.location_details || {};

      locCat = extractedData.locationCategory || loc.property_falling_within || "";
      customerName = p.applicant_name || p.owner_name || extractedData.customerName || customerName;
      statusOfOccupancy = propDet.occupancy || loc.occupancy_level || statusOfOccupancy;

      const docPersonMet = p.contact_person || extractedData.personMetDuringVisit || "";
      const docRelation = p.relationship_met_at_site || extractedData.relationshipOfPersonMet || "";
      
      let finalPersonMet = "N/A";
      let finalRelation = "SELF";

      if (statusOfOccupancy === "Vacant" && !docPersonMet) {
        finalPersonMet = "";
        finalRelation = "";
      } else if (docPersonMet && docRelation && docRelation !== "N/A" && docRelation !== "SELF") {
        finalPersonMet = docPersonMet;
        finalRelation = docRelation;
      } else if (docPersonMet) {
        finalPersonMet = docPersonMet;
        finalRelation = "Representative";
      } else {
        finalPersonMet = customerName || "N/A";
        finalRelation = "SELF";
      }

      let finalPropLoc = "Town";
      let finalAreaLim = "Town Planning";

      const normalizedLocCat = String(locCat).toLowerCase();
      if (normalizedLocCat.includes("municipal") || normalizedLocCat.includes("mc") || normalizedLocCat.includes("corporation")) {
        finalPropLoc = "City";
        finalAreaLim = "Municipal";
      } else if (normalizedLocCat.includes("nagar") || normalizedLocCat.includes("palika") || normalizedLocCat.includes("planning") || normalizedLocCat.includes("tp")) {
        finalPropLoc = "Town";
        finalAreaLim = "Town Planning";
      } else if (normalizedLocCat.includes("gram") || normalizedLocCat.includes("panchayat") || normalizedLocCat.includes("gp")) {
        finalPropLoc = "Village";
        finalAreaLim = "Gram Panchayat";
      }

      const addrLegal = addr.full_address || extractedData.addressLegal || "";
      const addrSite = addr.full_address || extractedData.addressSite || addrLegal;

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
        statusOfOccupancy,
        occupiedBy: propDet.occupied_by || "Vacant",
        usageOfProperty: p.property_use || "Residential",
        latitude: p.latitude || extractedData.latitude,
        longitude: p.longitude || extractedData.longitude,
        propertyLocation: finalPropLoc,
        propertyAreaLimits: finalAreaLim,
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
        relationshipOfPersonMet: safeVal("relationshipOfPersonMet", ""),
        propertyOwnerName: safeVal("propertyOwnerName"),
        howFoundOwnerName: safeVal("howFoundOwnerName", ""),
        typeOfLoan: safeVal("typeOfLoan", "BT + TopUp"),
        dateOfReport: parsedDate,
        dateOfVisit: parsedVisitDate,
        vendorName: safeVal("vendorName", "Unique Engineering and Associate - Bhopal"),
        clContractNo: safeVal("clContractNo", ""),
        refNo: safeVal("refNo", "N/A"),
        evaluationType: safeVal("evaluationType", "N/A"),
        unitType: safeVal("unitType") || undefined,
        propertyCategory: safeVal("propertyCategory") || undefined,
        propertyLocation: safeVal("propertyLocation") || undefined,
        populationCensus2011: safeVal("populationCensus2011", ""),
        ruralUrban: safeVal("ruralUrban") || undefined,
        zone: safeVal("zone") || undefined,
        propertyAreaLimits: safeVal("propertyAreaLimits") || undefined,
        eraApplicable: safeVal("eraApplicable", ""),
        projectName: safeVal("projectName", ""),
        documentsAvailable: safeVal("documentsAvailable") || undefined,
        nameOnSocietyBoard: safeVal("nameOnSocietyBoard", ""),
        addressLegal: safeVal("addressLegal"),
        addressSite: safeVal("addressSite") || safeVal("addressLegal"),
        nameOnDoor: safeVal("nameOnDoor", ""),
        nearbyLandmark: safeVal("nearbyLandmark"),
        statusOfOccupancy: safeVal("statusOfOccupancy") || undefined,
        occupiedBy: safeVal("occupiedBy") || undefined,
        usageOfProperty: safeVal("usageOfProperty") || undefined,
        propertyEasilyIdentifiable: safeVal("propertyEasilyIdentifiable") || undefined,
        latitude: safeVal("latitude"),
        longitude: safeVal("longitude"),
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
                    <Form.Item name="projectPinCode" style={{ margin: 0 }}>
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
                  <Form.Item name="latitude" extra={<span style={{ fontSize: "11px", color: "#6b7280" }}>Example: 19.0760</span>} style={{ margin: 0 }}>
                    <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
                  </Form.Item>
                </div>
                <div style={{ position: "relative", marginTop: "6px" }}>
                  <label style={{ position: "absolute", top: "-8px", left: "10px", background: "#fff", padding: "0 6px", fontSize: "11px", color: "#94a3b8", fontWeight: 500, zIndex: 2 }}>
                    Longitude
                  </label>
                  <Form.Item name="longitude" extra={<span style={{ fontSize: "11px", color: "#6b7280" }}>Example: 72.8777</span>} style={{ margin: 0 }}>
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
                    <Option value="PROJECT">Project</Option>
                    <Option value="INDIVIDUAL">Individual</Option>
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
                    <Option value="Row House">Row House</Option>
                    <Option value="Individual House">Individual House</Option>
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
                <Form.Item name="typeOfLoan" style={{ margin: 0 }}>
                  <Input readOnly style={{ height: "40px", borderRadius: "6px", border: "1px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#6b7280", cursor: "not-allowed" }} placeholder="Type of Loan" />
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
                    <Option value="Metro">Metro</Option>
                    <Option value="Town">Town</Option>
                    <Option value="Village">Village</Option>
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
                    <Option value="RURAL">Rural</Option>
                    <Option value="URBAN">Urban</Option>
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
                    <Option value="Residential">Residential</Option>
                    <Option value="Agriculture">Agriculture</Option>
                    <Option value="Industrial">Industrial</Option>
                    <Option value="Mixed">Mixed</Option>
                    <Option value="Commercial">Commercial</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("propertyAreaLimits") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>
                  Property Area Limits
                </label>
                <Form.Item name="propertyAreaLimits" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property Area Limits">
                    <Option value="Municipal-TP">Municipal-TP</Option>
                    <Option value="Collector-ZP">Collector-ZP</Option>
                    <Option value="GP">GP</Option>
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
                <Form.Item name="relationshipOfPersonMet" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="Relationship of person met and property" />
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
                <label>How did you find out property owner's name?</label>
                <Form.Item name="howFoundOwnerName" style={{ margin: 0 }}>
                  <Input style={{ height: "40px", borderRadius: "6px", border: "1px solid #d1d5db" }} placeholder="How did you find out property owner's name?" />
                </Form.Item>
              </div>

              {/* Row 3: Documents Available & Name on Society Board */}
              <div className={`custom-form-item-wrapper ${hasValue("documentsAvailable") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Property Documents Available?</label>
                <Form.Item name="documentsAvailable" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property Documents Available?">
                    <Option value="YES">Yes</Option>
                    <Option value="NO">No</Option>
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
                    <Option value="Vacant">Vacant</Option>
                    <Option value="Occupied">Occupied</Option>
                    <Option value="Partially Occupied">Partially Occupied</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("occupiedBy") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Occupied By</label>
                <Form.Item name="occupiedBy" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Occupied By">
                    <Option value="Self">Self</Option>
                    <Option value="Tenants">Tenants</Option>
                    <Option value="Self + Tenants">Self + Tenants</Option>
                    <Option value="Seller">Seller</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Row 7: Usage of Property & Property easily identifiable */}
              <div className={`custom-form-item-wrapper ${hasValue("usageOfProperty") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Usage of property</label>
                <Form.Item name="usageOfProperty" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Usage of property">
                    <Option value="Residential">Residential</Option>
                    <Option value="Commercial">Commercial</Option>
                    <Option value="Mixed">Mixed</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`custom-form-item-wrapper ${hasValue("propertyEasilyIdentifiable") ? "has-value" : ""}`} style={{ position: "relative", marginTop: "6px" }}>
                <label>Property easily identifiable?</label>
                <Form.Item name="propertyEasilyIdentifiable" style={{ margin: 0 }}>
                  <Select allowClear className="w-full" placeholder="Property easily identifiable?">
                    <Option value="YES">Yes</Option>
                    <Option value="NO">No</Option>
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
