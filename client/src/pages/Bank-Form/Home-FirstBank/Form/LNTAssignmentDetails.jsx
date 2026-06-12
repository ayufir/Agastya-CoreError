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
  
  const initialValues = {
    customerName: "",
    customerNo: "",
    propertyName: "",
    personMetDuringVisit: "N/A",
    personContactNo: "N/A",
    relationshipOfPersonMet: "SELF",
    propertyOwnerName: "",
    howFoundOwnerName: "SALE DEED",
    typeOfLoan: "P+C",
    dateOfReport: null,
    dateOfVisit: null,
    vendorName: "",
    clContractNo: "",
    refNo: "N/A",
    evaluationType: "N/A",
    unitType: "OPEN PLOT",
    propertyCategory: "INDIVIDUAL",
    propertyLocation: "Town",
    populationCensus2011: "Btw 10000 to 1.0 Lac",
    ruralUrban: "URBAN",
    zone: "Residential",
    propertyAreaLimits: "Municipal",
    eraApplicable: "NA",
    projectName: "",
    documentsAvailable: "YES",
    nameOnSocietyBoard: "NA",
    addressLegal: "",
    addressSite: "",
    nameOnDoor: "NA",
    nearbyLandmark: "",
    statusOfOccupancy: "Vacant",
    occupiedBy: "SELF",
    usageOfProperty: "Residential",
    propertyEasilyIdentifiable: "YES",
  };

  useEffect(() => {
    const currentValues = form.getFieldsValue();
    const merged = { ...isEdit };

    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const addr = p.address || {};
      const bankDet = p.bank_specific_details || {};
      const accom = p.accommodation_details || {};
      const propDet = p.property_details || {};
      const loc = p.location_details || {};

      const mapped = {
        customerName: p.applicant_name || p.owner_name || extractedData.customerName,
        customerNo: p.contact_number || p["Mobile No."] || extractedData.customerNo,
        propertyName: p.property_type || accom.type_of_structure,
        personMetDuringVisit: p.contact_person || extractedData.personMetDuringVisit,
        propertyOwnerName: p.owner_name || extractedData.propertyOwnerName,
        dateOfReport: p.dateOfReport || extractedData.dateOfReport || extractedData.reportDate,
        dateOfVisit: p.dateOfVisit || extractedData.dateOfVisit,
        refNo: bankDet.file_no || bankDet.lan_no || extractedData.registration_number || extractedData.refNo,
        addressLegal: addr.full_address || extractedData.addressLegal,
        addressSite: addr.full_address || extractedData.addressSite,
        nearbyLandmark: loc.landmark || extractedData.nearbyLandmark,
        statusOfOccupancy: propDet.occupancy || loc.occupancy_level,
        occupiedBy: propDet.occupied_by,
        usageOfProperty: p.property_use,
        latitude: p.latitude || extractedData.latitude,
        longitude: p.longitude || extractedData.longitude,
      };

      Object.entries(mapped).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== "") {
          merged[key] = val;
        }
      });
    }

    if (merged) {
      const parsedDate = merged.dateOfReport
        ? moment(merged.dateOfReport, moment.ISO_8601, true).isValid()
          ? moment(merged.dateOfReport)
          : moment(merged.dateOfReport, "DD.MM.YYYY")
        : (currentValues.dateOfReport || null);
      const parsedVisitDate = merged.dateOfVisit
        ? moment(merged.dateOfVisit, moment.ISO_8601, true).isValid()
          ? moment(merged.dateOfVisit)
          : moment(merged.dateOfVisit, "DD.MM.YYYY")
        : (currentValues.dateOfVisit || null);

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
        personMetDuringVisit: safeVal("personMetDuringVisit", "N/A"),
        personContactNo: safeVal("personContactNo", "N/A"),
        relationshipOfPersonMet: safeVal("relationshipOfPersonMet", "SELF"),
        propertyOwnerName: safeVal("propertyOwnerName"),
        howFoundOwnerName: safeVal("howFoundOwnerName"),
        typeOfLoan: safeVal("typeOfLoan", "P+C"),
        dateOfReport: parsedDate,
        dateOfVisit: parsedVisitDate,
        vendorName: safeVal("vendorName"),
        clContractNo: safeVal("clContractNo"),
        refNo: safeVal("refNo", "N/A"),
        evaluationType: safeVal("evaluationType", "N/A"),
        unitType: safeVal("unitType", "OPEN PLOT"),
        propertyCategory: safeVal("propertyCategory", "INDIVIDUAL"),
        propertyLocation: safeVal("propertyLocation"),
        populationCensus2011: safeVal("populationCensus2011", "Btw 10000 to 1.0 Lac"),
        ruralUrban: safeVal("ruralUrban"),
        zone: safeVal("zone", "Residential"),
        propertyAreaLimits: safeVal("propertyAreaLimits"),
        eraApplicable: safeVal("eraApplicable", "NA"),
        projectName: safeVal("projectName"),
        documentsAvailable: safeVal("documentsAvailable", "YES"),
        nameOnSocietyBoard: safeVal("nameOnSocietyBoard", "NA"),
        addressLegal: safeVal("addressLegal"),
        addressSite: safeVal("addressSite"),
        nameOnDoor: safeVal("nameOnDoor", "NA"),
        nearbyLandmark: safeVal("nearbyLandmark"),
        statusOfOccupancy: safeVal("statusOfOccupancy"),
        occupiedBy: safeVal("occupiedBy"),
        usageOfProperty: safeVal("usageOfProperty", "Residential"),
        propertyEasilyIdentifiable: safeVal("propertyEasilyIdentifiable", "YES"),
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
        {/* ── SECTION 1: GENERAL DETAILS ── */}
        {showGeneralDetails && (
          <>
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6 text-red-600">GENERAL DETAILS</h2>
            </div>

            {user?.role !== "FieldOfficer" && (
              <>
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2 border-b pb-1">Assignment Info</h3>
                </div>

                <Form.Item name="vendorName" label="Vendor Name">
                  <Input />
                </Form.Item>

                <Form.Item name="clContractNo" label="CL Contract No.">
                  <Input />
                </Form.Item>

                <Form.Item name="dateOfVisit" label="Date of Visit">
                  <DatePicker className="w-full" format="DD.MM.YYYY" />
                </Form.Item>

                <Form.Item name="projectPinCode" label="Pin Code">
                  <Input />
                </Form.Item>

                <Form.Item name="refNo" label="Loan Account No. (LAI)">
                  <Input />
                </Form.Item>

                <Form.Item name="dateOfReport" label="Date of Report">
                  <DatePicker className="w-full" format="DD.MM.YYYY" />
                </Form.Item>
              </>
            )}
          </>
        )}

        {/* ── SECTION 2: Property Overview ── */}
        {showPropertyOverview && (
          <>
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6 text-red-600">Property Overview</h2>
            </div>

            <Form.Item name="propertyCategory" label="Property Category (Project / Individual)">
              <Select allowClear className="w-full">
                <Option value="INDIVIDUAL">Individual</Option>
                <Option value="PROJECT">Project</Option>
              </Select>
            </Form.Item>

            <Form.Item name="unitType" label="Property Type">
              <Select allowClear className="w-full">
                <Option value="Apartment">Apartment</Option>
                <Option value="Row House">Row House</Option>
                <Option value="Individual House">Individual House</Option>
                <Option value="Shop">Shop</Option>
                <Option value="Office">Office</Option>
                <Option value="Industrial">Industrial</Option>
                <Option value="OPEN PLOT">Open Plot</Option>
                <Option value="Flat">Flat</Option>
              </Select>
            </Form.Item>

            <Form.Item name="typeOfLoan" label="Type of Loan">
              <Input />
            </Form.Item>

            <Form.Item name="propertyLocation" label="Property Location">
              <Select allowClear className="w-full">
                <Option value="Town">Town</Option>
                <Option value="Village">Village</Option>
                <Option value="City">City</Option>
              </Select>
            </Form.Item>

            <Form.Item name="populationCensus2011" label="Population as per Census 2011">
              <Select allowClear className="w-full">
                <Option value="Less than 10000">Less than 10000</Option>
                <Option value="Btw 10000 to 1.0 Lac">Btw 10000 to 1.0 Lac</Option>
                <Option value="Above 1.0 Lac">Above 1.0 Lac</Option>
              </Select>
            </Form.Item>

            <Form.Item name="ruralUrban" label="Rural / Urban (>10k = Urban)">
              <Select allowClear className="w-full">
                <Option value="URBAN">Urban</Option>
                <Option value="RURAL">Rural</Option>
              </Select>
            </Form.Item>

            <Form.Item name="zone" label="Zone">
              <Select allowClear className="w-full">
                <Option value="Residential">Residential</Option>
                <Option value="Commercial">Commercial</Option>
                <Option value="Industrial">Industrial</Option>
                <Option value="Agricultural">Agricultural</Option>
                <Option value="Mixed">Mixed</Option>
              </Select>
            </Form.Item>

            <Form.Item name="propertyAreaLimits" label="Property Area Limits">
              <Select allowClear className="w-full">
                <Option value="Municipal">Municipal</Option>
                <Option value="Gram Panchayat">Gram Panchayat</Option>
                <Option value="Town Planning">Town Planning</Option>
                <Option value="Collector">Collector</Option>
              </Select>
            </Form.Item>

            <Form.Item name="eraApplicable" label="RERA No. (If applicable)">
              <Input />
            </Form.Item>

            <Form.Item name="projectName" label="Project Name">
              <Input />
            </Form.Item>
          </>
        )}

        {/* ── SECTION 3: Visit Details ── */}
        {showVisitDetails && (
          <>
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6 text-red-600">Visit Details</h2>
            </div>

            <Form.Item name="customerName" label="Applicant Name">
              <Input />
            </Form.Item>

            <Form.Item name="customerNo" label="Mobile No.">
              <Input />
            </Form.Item>

            <Form.Item name="personMetDuringVisit" label="Person Met At Site">
              <Input />
            </Form.Item>

            <Form.Item name="relationshipOfPersonMet" label="Relationship of Person Met and Property">
              <Select allowClear className="w-full">
                <Option value="SELF">Self</Option>
                <Option value="Owner">Owner</Option>
                <Option value="Tenant">Tenant</Option>
                <Option value="Caretaker">Caretaker</Option>
                <Option value="Neighbor">Neighbor</Option>
              </Select>
            </Form.Item>

            <Form.Item name="propertyOwnerName" label="Property Owner's Name" className="md:col-span-2">
              <TextArea rows={2} />
            </Form.Item>

            <Form.Item name="howFoundOwnerName" label="How did you find out property owner's name?">
              <Select allowClear className="w-full">
                <Option value="SALE DEED">Sale Deed</Option>
                <Option value="Neighbor">Neighbor</Option>
                <Option value="Self">Self</Option>
                <Option value="Municipal Records">Municipal Records</Option>
              </Select>
            </Form.Item>

            <Form.Item name="documentsAvailable" label="Property Documents Available?">
              <Select allowClear className="w-full">
                <Option value="YES">Yes</Option>
                <Option value="NO">No</Option>
              </Select>
            </Form.Item>

            <Form.Item name="nameOnSocietyBoard" label="Name on Society Board / Signage">
              <Input />
            </Form.Item>

            <Form.Item name="addressLegal" label="Address as per Legal Document" className="md:col-span-2">
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item name="addressSite" label="Address of Property (As per Site)" className="md:col-span-2">
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item name="nameOnDoor" label="Name on Door of the Premises">
              <Input />
            </Form.Item>

            <Form.Item name="nearbyLandmark" label="Nearby Landmark (within 500m)">
              <Input />
            </Form.Item>

            <Form.Item name="statusOfOccupancy" label="Occupancy">
              <Select allowClear className="w-full">
                <Option value="Vacant">Vacant</Option>
                <Option value="Occupied">Occupied</Option>
                <Option value="Partially Occupied">Partially Occupied</Option>
              </Select>
            </Form.Item>

            <Form.Item name="occupiedBy" label="Occupied By">
              <Input />
            </Form.Item>

            <Form.Item name="usageOfProperty" label="Usage">
              <Select allowClear className="w-full">
                <Option value="Residential">Residential</Option>
                <Option value="Commercial">Commercial</Option>
                <Option value="Mixed">Mixed</Option>
              </Select>
            </Form.Item>

            <Form.Item name="propertyEasilyIdentifiable" label="Property Easily Identifiable?">
              <Select allowClear className="w-full">
                <Option value="YES">Yes</Option>
                <Option value="NO">No</Option>
              </Select>
            </Form.Item>
          </>
        )}

        {/* ── Geo Location ── */}
        {showGeneralDetails && (
          <div className="md:col-span-2">
            {user.role === "FieldOfficer" ? (
              <div style={{ display: "none" }}>
                <GeoLocationInput ref={geoRef} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="latitude" label="Latitude">
                  <Input placeholder="Latitude" />
                </Form.Item>
                <Form.Item name="longitude" label="Longitude">
                  <Input placeholder="Longitude" />
                </Form.Item>
              </div>
            )}
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
