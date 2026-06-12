import React, { useEffect } from "react";
import { Card, Descriptions, Typography, Spin } from "antd";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDmiFinanceReportById } from "../../redux/features/Banks/dmiFinance/dmiFinanceThunks";
import * as XLSX from "xlsx"; // top par import
import FileDownload from "../../components/FileDownload";

const { Title } = Typography;

const DmiFinanceDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const d = useSelector((state) => state.dmiFinance.report);
  const loading = useSelector((state) => state.dmiFinance.loading);

  // !
  const handleExport = (type) => {
    const exportData = Object.entries({
      Branch: d.branch,
      "Application Number": d.applicationNumber,
      "Applicant Name": d.applicantName,
      Product: d.product,
      "Property Type": d.propertyType,
      "Report Date": d.reportDate,
      "Date of Visit": d.dateOfVisit,
      "Visited By": d.visitedBy,
      "Property Address As Per Site": d.propertyAddressAsPerSite,
      "Property Address As Per Documents": d.propertyAddressAsPerDocuments,
      "House No": d.houseNo,
      "Floor No": d.floorNo,
      "Wing Name/No": d.wingNameNo,
      "Colony/Project Name": d.colonyProjectName,
      "Khasra/Survey No": d.khasraSurveyNo,
      "Sector/Phase/Ward": d.sectorPhaseWard,
      "Mauza/Police Station": d.mauzaPoliceStation,
      "Village/Location": d.villageLocation,
      District: d.district,
      State: d.state,
      "City/Tehsil/Taluka/Town": d.cityTehsilTalukaTown,
      Pincode: d.pincode,
      "Distance from Nearest DMI Branch": d.distanceFromNearestDmiBranch,
      "Distance from City Centre": d.distanceFromNearestCityCentre,
      "Distance from Landmark": d.distanceFromLandmark,
      "Documents Submitted": d.listOfDocumentsSubmitted,
      "Property Owner": d.propertyOwnerAsPerDocuments,
      "If No, Who Owns": d.ifNoWhoOwnsTheProperty,
      "Person Met": d.nameOfPersonMet,
      "Contact of Person Met": d.contactNoOfPersonMet,
      "Relation With Applicant": d.relationWithApplicant,
      "Contact of Applicant": d.contactNoOfApplicant,
      "Locality Development": d.localityDevelopment,
      "Special Remarks": d.specialRemarks,
      "Report Status": d.reportStatus,
      "Prepared By": d.name,
    }).map(([key, value]) => ({ Field: key, Value: value }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const fileExtension = type === "csv" ? ".csv" : ".xlsx";
    XLSX.writeFile(workbook, `DMI_Formatted_Report${fileExtension}`);
  };

  // !

  const {
    branch,
    applicationNumber,
    applicantName,
    product,
    propertyType,
    reportDate,
    dateOfVisit,
    visitedBy,
    propertyAddressAsPerSite,
    propertyAddressAsPerDocuments,
    houseNo,
    floorNo,
    wingNameNo,
    colonyProjectName,
    khasraSurveyNo,
    sectorPhaseWard,
    mauzaPoliceStation,
    villageLocation,
    district,
    state,
    cityTehsilTalukaTown,
    pincode,
    distanceFromNearestDmiBranch,
    distanceFromNearestCityCentre,
    distanceFromLandmark,
    listOfDocumentsSubmitted,
    propertyOwnerAsPerDocuments,
    ifNoWhoOwnsTheProperty,
    nameOfPersonMet,
    contactNoOfPersonMet,
    relationWithApplicant,
    contactNoOfApplicant,
    localityDevelopment,
    specialRemarks,
    reportStatus,
    name,
    _id,
    __v,
    valuation,
    documents,
  } = d || {};

  useEffect(() => {
    if (id) dispatch(getDmiFinanceReportById(id));
  }, [id, dispatch]);

  if (loading || !d)
    return <Spin className='flex justify-center mt-10' size='large' />;

  return (
    <div className='p-6 space-y-6 bg-gray-100 ' id='print-section'>
      <Title level={3} className='text-center'>
        Full Property Valuation Report
      </Title>
      <div className='flex justify-end gap-4 my-4'>
        <button
          onClick={() => window.print()}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Print / Save as PDF
        </button>

        <button
          onClick={() => handleExport("excel")}
          className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
        >
          Export to Excel
        </button>

        <button
          onClick={() => handleExport("csv")}
          className='bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600'
        >
          Export to CSV
        </button>
      </div>
      {/* <FileDownload data={d} tableId='reportTable' name={"DMI"} /> */}

      <div className='' id='reportTable'>
        {/* Applicant & Loan Details */}
        <Card title='Applicant & Loan Details' bordered>
          <Descriptions column={2}>
            <Descriptions.Item label='Branch'>{branch}</Descriptions.Item>
            <Descriptions.Item label='Application Number'>
              {applicationNumber}
            </Descriptions.Item>
            <Descriptions.Item label='Applicant Name'>
              {applicantName}
            </Descriptions.Item>
            <Descriptions.Item label='Product'>{product}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Property Basic Details */}
        <Card title='Property Basic Details' bordered>
          <Descriptions column={2}>
            <Descriptions.Item label='Property Type'>
              {propertyType}
            </Descriptions.Item>
            <Descriptions.Item label='Report Date'>
              {reportDate}
            </Descriptions.Item>
            <Descriptions.Item label='Date of Visit'>
              {dateOfVisit}
            </Descriptions.Item>
            <Descriptions.Item label='Visited By'>
              {visitedBy}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Property Address Details */}
        <Card title='Property Address Details' bordered>
          <Descriptions column={2}>
            <Descriptions.Item label='Address As Per Site'>
              {propertyAddressAsPerSite}
            </Descriptions.Item>
            <Descriptions.Item label='Address As Per Documents'>
              {propertyAddressAsPerDocuments}
            </Descriptions.Item>
            <Descriptions.Item label='House No'>{houseNo}</Descriptions.Item>
            <Descriptions.Item label='Floor No'>{floorNo}</Descriptions.Item>
            <Descriptions.Item label='Wing Name/No'>
              {wingNameNo}
            </Descriptions.Item>
            <Descriptions.Item label='Colony/Project Name'>
              {colonyProjectName}
            </Descriptions.Item>
            <Descriptions.Item label='Khasra/Survey No'>
              {khasraSurveyNo}
            </Descriptions.Item>
            <Descriptions.Item label='Sector/Phase/Ward'>
              {sectorPhaseWard}
            </Descriptions.Item>
            <Descriptions.Item label='Mauza/Police Station'>
              {mauzaPoliceStation}
            </Descriptions.Item>
            <Descriptions.Item label='Village/Location'>
              {villageLocation}
            </Descriptions.Item>
            <Descriptions.Item label='District'>{district}</Descriptions.Item>
            <Descriptions.Item label='State'>{state}</Descriptions.Item>
            <Descriptions.Item label='City/Tehsil/Taluka/Town'>
              {cityTehsilTalukaTown}
            </Descriptions.Item>
            <Descriptions.Item label='Pincode'>{pincode}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Distance Details */}
        <Card title='Distance Details' bordered>
          <Descriptions column={2}>
            <Descriptions.Item label='From Nearest DMI Branch'>
              {distanceFromNearestDmiBranch}
            </Descriptions.Item>
            <Descriptions.Item label='From Nearest City Centre'>
              {distanceFromNearestCityCentre}
            </Descriptions.Item>
            <Descriptions.Item label='From Landmark'>
              {distanceFromLandmark}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Document & Ownership Details */}
        <Card title='Document & Ownership Details' bordered>
          <Descriptions column={1}>
            <Descriptions.Item label='List of Documents Submitted'>
              {listOfDocumentsSubmitted}
            </Descriptions.Item>
            <Descriptions.Item label='Property Owner As Per Documents'>
              {propertyOwnerAsPerDocuments}
            </Descriptions.Item>
            <Descriptions.Item label='If No, Who Owns The Property'>
              {ifNoWhoOwnsTheProperty || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Person Met */}
        <Card title='Person Met at Property' bordered>
          <Descriptions column={2}>
            <Descriptions.Item label='Name of Person Met'>
              {nameOfPersonMet}
            </Descriptions.Item>
            <Descriptions.Item label='Contact No of Person Met'>
              {contactNoOfPersonMet}
            </Descriptions.Item>
            <Descriptions.Item label='Relation With Applicant'>
              {relationWithApplicant}
            </Descriptions.Item>
            <Descriptions.Item label='Contact No of Applicant'>
              {contactNoOfApplicant}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Locality and Special Remarks */}
        <Card title='Locality and Special Remarks' bordered>
          <Descriptions column={1}>
            <Descriptions.Item label='Locality Development'>
              {localityDevelopment}
            </Descriptions.Item>
            <Descriptions.Item label='Special Remarks'>
              <pre className='whitespace-pre-wrap'>{specialRemarks}</pre>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Report Summary */}
        <Card title='Report Summary' bordered>
          <Descriptions column={2}>
            <Descriptions.Item label='Report Status'>
              {reportStatus}
            </Descriptions.Item>
            <Descriptions.Item label='Report Prepared By'>
              {name}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* System Metadata */}
        <Card title='System Metadata (For Debug)' bordered>
          <Descriptions column={2}>
            <Descriptions.Item label='MongoDB ID'>{_id}</Descriptions.Item>
            <Descriptions.Item label='Version'>{__v}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Valuation Particulars */}
        <Card title='Valuation Particulars (if any)' bordered>
          {valuation?.particulars?.length > 0 ? (
            <ul className='list-disc pl-6'>
              {valuation.particulars.map((item, index) => (
                <li key={index}>{JSON.stringify(item)}</li>
              ))}
            </ul>
          ) : (
            <p>No particulars available.</p>
          )}
        </Card>

        {/* Uploaded Documents */}
        <Card title='Uploaded Documents' bordered>
          {documents?.length > 0 ? (
            <ul className='list-disc pl-6'>
              {documents.map((doc, idx) => (
                <li key={idx}>{doc}</li>
              ))}
            </ul>
          ) : (
            <p>No documents uploaded.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DmiFinanceDetails;
