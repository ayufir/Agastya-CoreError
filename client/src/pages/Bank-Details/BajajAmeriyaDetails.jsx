import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchReportById } from "../../redux/features/Banks/bajajAmeriya/bajajThunks";
import { Descriptions, Divider, Button } from "antd";
import FileDownload from "../../components/FileDownload";
import { finalUpdate } from "../../redux/features/case/caseThunks";
import toast from "react-hot-toast";

const BajajAmeriyaDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [saving, setSaving] = React.useState(false);

  const data = useSelector((state) => state.bajajA.selectedReport);

  useEffect(() => {
    if (id) dispatch(fetchReportById(id));
  }, [id, dispatch]);

  if (!data) return <div className='text-center p-4'>Loading...</div>;

  const handleFinalSubmit = async () => {
    try {
      setSaving(true);
      await dispatch(finalUpdate({ id, bankName: "bajajAmeriya", updateData: data })).unwrap();
      toast.success("Report Finalized ✅");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Finalization failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='p-0 bg-gray-100 min-h-screen'>
      {/* Action Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 p-2 flex items-center gap-2 print:hidden">
        <div className="flex-1 text-yellow-500 font-bold text-sm ml-4">
          Bajaj Ameriya Finance
        </div>
        
        {(user?.role === "Admin" || user?.role === "SuperAdmin") && (
          <button
            onClick={handleFinalSubmit}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Finalizing..." : "🚀 Final Submit"}
          </button>
        )}
        
        <button
          onClick={() => window.print()}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded text-sm font-medium"
        >
          📄 Download PDF
        </button>
      </div>

      <div className="pt-16 pb-8 px-6">
        <div className='bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto'>
          <FileDownload data={data} tableId='reportTable' name={"BajajAmeriya"} />
      <div className='' id='reportTable'>
        <div className='' id='print-section'>
          <h1 className='text-2xl font-bold text-center mb-6'>
            PROPERTY VALUATION REPORT
          </h1>

          <Descriptions
            title='Agency Details'
            bordered
            column={2}
            size='middle'
          >
            <Descriptions.Item label='Agency Name'>
              {data.agencyName}
            </Descriptions.Item>
            <Descriptions.Item label='File No.'>
              {data.fileNo}
            </Descriptions.Item>
            <Descriptions.Item label='Report Date'>
              {data.reportDate}
            </Descriptions.Item>
            <Descriptions.Item label='Surveyor Username'>
              {data.agencyUsername}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions
            title='Applicant Details'
            bordered
            column={2}
            size='middle'
          >
            <Descriptions.Item label='Applicant Name'>
              {data.applicantName}
            </Descriptions.Item>
            <Descriptions.Item label='Contact Person'>
              {data.contactPerson} ({data.contactNo})
            </Descriptions.Item>
            <Descriptions.Item label='Loan Type'>
              {data.loanType}
            </Descriptions.Item>
            <Descriptions.Item label='Person Met'>
              {data.personMet} ({data.personContact})
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions
            title='Ownership & Documents'
            bordered
            column={2}
            size='middle'
          >
            <Descriptions.Item label='Owner Name'>
              {data.ownerName}
            </Descriptions.Item>
            <Descriptions.Item label='Documents Provided'>
              {data.documentsProvided}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions
            title='Property Address Details'
            bordered
            column={2}
            size='middle'
          >
            <Descriptions.Item label='Postal Address'>
              {data.postalAddress}
            </Descriptions.Item>
            <Descriptions.Item label='Locality'>
              {data.locality}
            </Descriptions.Item>
            <Descriptions.Item label='Landmark'>
              {data.landmark}
            </Descriptions.Item>
            <Descriptions.Item label='Distance from Hub'>
              {data.distanceFromHub}
            </Descriptions.Item>
            <Descriptions.Item label='Legal Address'>
              {data.legalAddress}
            </Descriptions.Item>
            <Descriptions.Item label='Address Matching'>
              {data.addressMatching}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions
            title='Property Description'
            bordered
            column={2}
            size='middle'
          >
            <Descriptions.Item label='Municipal Body'>
              {data.municipalBody}
            </Descriptions.Item>
            <Descriptions.Item label='Holding Type'>
              {data.holdingType}
            </Descriptions.Item>
            <Descriptions.Item label='Marketability'>
              {data.marketability}
            </Descriptions.Item>
            <Descriptions.Item label='Property Type'>
              {data.propertyType}
            </Descriptions.Item>
            <Descriptions.Item label='Occupancy Status'>
              {data.occupancyStatus}
            </Descriptions.Item>
            <Descriptions.Item label='Distance from NH'>
              {data.distanceFromNH}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions
            title='Schedule Details'
            bordered
            column={2}
            size='middle'
          >
            <Descriptions.Item label='Legal East'>
              {data.scheduleLegalEast}
            </Descriptions.Item>
            <Descriptions.Item label='Legal West'>
              {data.scheduleLegalWest}
            </Descriptions.Item>
            <Descriptions.Item label='Legal North'>
              {data.scheduleLegalNorth}
            </Descriptions.Item>
            <Descriptions.Item label='Legal South'>
              {data.scheduleLegalSouth}
            </Descriptions.Item>
            <Descriptions.Item label='Site East'>
              {data.scheduleSiteEast}
            </Descriptions.Item>
            <Descriptions.Item label='Site West'>
              {data.scheduleSiteWest}
            </Descriptions.Item>
            <Descriptions.Item label='Site North'>
              {data.scheduleSiteNorth}
            </Descriptions.Item>
            <Descriptions.Item label='Site South'>
              {data.scheduleSiteSouth}
            </Descriptions.Item>
            <Descriptions.Item label='Plan East'>
              {data.schedulePlanEast}
            </Descriptions.Item>
            <Descriptions.Item label='Plan West'>
              {data.schedulePlanWest}
            </Descriptions.Item>
            <Descriptions.Item label='Plan North'>
              {data.schedulePlanNorth}
            </Descriptions.Item>
            <Descriptions.Item label='Plan South'>
              {data.schedulePlanSouth}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions
            title='Construction & Usage Details'
            bordered
            column={2}
            size='middle'
          >
            <Descriptions.Item label='Boundary Match'>
              {data.boundaryMatch}
            </Descriptions.Item>
            <Descriptions.Item label='Property Identified'>
              {data.propertyIdentified}
            </Descriptions.Item>
            <Descriptions.Item label='Layout Plan Details'>
              {data.layoutPlanDetails}
            </Descriptions.Item>
            <Descriptions.Item label='Construction Plan Details'>
              {data.constructionPlanDetails}
            </Descriptions.Item>
            <Descriptions.Item label='Plan Validity'>
              {data.planValidity}
            </Descriptions.Item>
            <Descriptions.Item label='Approved Authority'>
              {data.approvedAuthority}
            </Descriptions.Item>
            <Descriptions.Item label='Approved Usage'>
              {data.approvedUsage}
            </Descriptions.Item>
            <Descriptions.Item label='Construction Quality'>
              {data.constructionQuality}
            </Descriptions.Item>
            <Descriptions.Item label='No. of Lifts'>
              {data.noOfLifts}
            </Descriptions.Item>
            <Descriptions.Item label='Current Occupant'>
              {data.currentOccupant}
            </Descriptions.Item>
            <Descriptions.Item label='Accommodation Details'>
              {data.accommodationDetails}
            </Descriptions.Item>
            <Descriptions.Item label='Floor Level'>
              {data.floorLevel}
            </Descriptions.Item>
            <Descriptions.Item label='Rooms'>
              {data.noOfRooms}
            </Descriptions.Item>
            <Descriptions.Item label='Kitchens'>
              {data.noOfKitchens}
            </Descriptions.Item>
            <Descriptions.Item label='Bathrooms'>
              {data.noOfBathrooms}
            </Descriptions.Item>
            <Descriptions.Item label='Halls'>
              {data.noOfHalls}
            </Descriptions.Item>
            <Descriptions.Item label='Sanction Usage'>
              {data.sanctionUsage}
            </Descriptions.Item>
            <Descriptions.Item label='Actual Usage'>
              {data.actualUsage}
            </Descriptions.Item>
            <Descriptions.Item label='Additional Structures'>
              {data.additionalStructures}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions
            title='Area and Location Details'
            bordered
            column={2}
            size='middle'
          >
            <Descriptions.Item label='East-West'>
              {data.eastWest}
            </Descriptions.Item>
            <Descriptions.Item label='North-South'>
              {data.northSouth}
            </Descriptions.Item>
            <Descriptions.Item label='Land Area'>
              {data.landArea}
            </Descriptions.Item>
            <Descriptions.Item label='Approach Road'>
              {data.approachRoad}
            </Descriptions.Item>
            <Descriptions.Item label='Surrounding Development'>
              {data.surroundingDevelopment}
            </Descriptions.Item>
            <Descriptions.Item label='Distance from City Centre'>
              {data.distanceCityCentre}
            </Descriptions.Item>
            <Descriptions.Item label='Distance from Corporation Limits'>
              {data.distanceCorpLimits}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions title='Utilities' bordered column={2} size='middle'>
            <Descriptions.Item label='Electricity'>
              {data.electricity}
            </Descriptions.Item>
            <Descriptions.Item label='Electricity Distributor'>
              {data.electricityDistributor}
            </Descriptions.Item>
            <Descriptions.Item label='Water Supply'>
              {data.waterSupply}
            </Descriptions.Item>
            <Descriptions.Item label='Water Distributor'>
              {data.waterDistributor}
            </Descriptions.Item>
            <Descriptions.Item label='Sewer Provision'>
              {data.sewerProvision}
            </Descriptions.Item>
            <Descriptions.Item label='Sewer Line Connected'>
              {data.sewerLineConnected}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Descriptions
            title='Valuation & Compliance'
            bordered
            column={2}
            size='middle'
          >
            <Descriptions.Item label='Demolition Threat'>
              {data.demolitionThreat}
            </Descriptions.Item>
            <Descriptions.Item label='Latitude'>
              {data.latitude}
            </Descriptions.Item>
            <Descriptions.Item label='Longitude'>
              {data.longitude}
            </Descriptions.Item>
            <Descriptions.Item label='Agency Geo Location'>
              {data.agencyGeoLocation}
            </Descriptions.Item>
            <Descriptions.Item label='Permissible Area'>
              {data.permissibleArea}
            </Descriptions.Item>
            <Descriptions.Item label='Land Component'>
              {data.landComponent}
            </Descriptions.Item>
            <Descriptions.Item label='Permissible FSI'>
              {data.permissibleFSI}
            </Descriptions.Item>
            <Descriptions.Item label='Permissible Construction'>
              {data.permissibleConstruction}
            </Descriptions.Item>
            <Descriptions.Item label='140% Construction'>
              {data.construction140Percent}
            </Descriptions.Item>
            <Descriptions.Item label='Actual Construction'>
              {data.actualConstruction}
            </Descriptions.Item>
            <Descriptions.Item label='FSI Violation'>
              {data.fsiViolation}
            </Descriptions.Item>
            <Descriptions.Item label='Risk of Demolition'>
              {data.riskOfDemolition}
            </Descriptions.Item>
            <Descriptions.Item label='Valuation Done'>
              {data.valuationDone}
            </Descriptions.Item>
            <Descriptions.Item label='Status of Property'>
              {data.statusOfProperty}
            </Descriptions.Item>
            <Descriptions.Item label='Completion %'>
              {data.completionPercentage}
            </Descriptions.Item>
            <Descriptions.Item label='Age of Property'>
              {data.currentAgeOfProperty} years
            </Descriptions.Item>
            <Descriptions.Item label='Residual Age'>
              {data.residualAge} years
            </Descriptions.Item>
            <Descriptions.Item label='Land Value'>
              {data.landValue}
            </Descriptions.Item>
            <Descriptions.Item label='BUA Value'>
              {data.buaValue}
            </Descriptions.Item>
            <Descriptions.Item label='Depreciation'>
              {data.depreciation}
            </Descriptions.Item>
            <Descriptions.Item label='Car Parking'>
              {data.carParking}
            </Descriptions.Item>
            <Descriptions.Item label='Amenities Charges'>
              {data.amenitiesCharges}
            </Descriptions.Item>
            <Descriptions.Item label='Fair Market Value'>
              {data.fairMarketValue}
            </Descriptions.Item>
            <Descriptions.Item label='Government Value'>
              {data.govtValue}
            </Descriptions.Item>
            <Descriptions.Item label='Distressed Value'>
              {data.distressedValue}
            </Descriptions.Item>
            <Descriptions.Item label='Valuation Done Earlier'>
              {data.valuationDoneEarlier}
            </Descriptions.Item>
            <Descriptions.Item label='Demolition List'>
              {data.demolitionList}
            </Descriptions.Item>
            <Descriptions.Item label='Negative Area'>
              {data.negativeArea}
            </Descriptions.Item>
            <Descriptions.Item label='Remarks'>
              {data.remarks}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default BajajAmeriyaDetails;
