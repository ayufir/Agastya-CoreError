import { useSelector } from "react-redux";
import { Card, Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

const LabeledValue = ({ label, value }) => (
  <div className='mb-4'>
    <Text strong>{label}</Text>
    <div className='border rounded-md p-2 bg-gray-50'>{value || "N/A"}</div>
  </div>
);

const PlanApprovalDetails = () => {
  const data = useSelector((state) => state.sundaramBank.currentReport) || [];
  console.log(data, "CURRENT");

  return (
    <div className='max-w-7xl mx-auto p-4'>
      <Title level={3}>Plan Approval Details</Title>

      <Card className='mb-6'>
        <Row gutter={16}>
          <Col span={8}>
            <LabeledValue label='Layout Approval' value={data.layoutApproval} />
          </Col>
          <Col span={8}>
            <LabeledValue label='Planning Permit' value={data.planningPermit} />
          </Col>
          <Col span={8}>
            <LabeledValue label='Building Permit' value={data.buildingPermit} />
          </Col>
        </Row>
      </Card>

      <Title level={4}>Property Aspects</Title>
      <Card className='mb-6'>
        <Row gutter={16}>
          <Col span={8}>
            <LabeledValue label='Civic Status' value={data.civicStatus} />
          </Col>
          <Col span={8}>
            <LabeledValue label='Shape of Land' value={data.shapeOfLand} />
          </Col>
          <Col span={8}>
            <LabeledValue label='Road Width 1' value={data.roadWidth1} />
          </Col>
        </Row>
      </Card>

      <Title level={4}>Legal Aspects</Title>
      <Card className='mb-6'>
        <Row>
          <Col span={24}>
            <LabeledValue
              label='Reported Owner / Tenant'
              value={data.reportedOwner}
            />
          </Col>
        </Row>
      </Card>

      <Title level={4}>Boundaries of the Property</Title>
      <Card className='mb-6'>
        <Row gutter={16}>
          <Col span={12}>
            <Title level={5}>As Per Document</Title>
            <LabeledValue label='North by' value={data.docNorth} />
            <LabeledValue label='South by' value={data.docSouth} />
            <LabeledValue label='East by' value={data.docEast} />
            <LabeledValue label='West by' value={data.docWest} />
          </Col>
          <Col span={12}>
            <Title level={5}>As Per Site</Title>
            <LabeledValue label='North by' value={data.siteNorth} />
            <LabeledValue label='South by' value={data.siteSouth} />
            <LabeledValue label='East by' value={data.siteEast} />
            <LabeledValue label='West by' value={data.siteWest} />
          </Col>
        </Row>
      </Card>

      <Card className='mb-6'>
        <Row gutter={16}>
          <Col span={8}>
            <LabeledValue
              label='Property Identified by'
              value={data.propertyIdentifiedBy}
            />
          </Col>
          <Col span={8}>
            <LabeledValue label='Type of Road 1' value={data.typeOfRoad1} />
          </Col>
          <Col span={8}>
            <LabeledValue label='Type of Road 2' value={data.typeOfRoad2} />
          </Col>
        </Row>
      </Card>

      <Card className='mb-6'>
        <Row gutter={16}>
          <Col span={8}>
            <LabeledValue
              label='Approved Number 1'
              value={data.approvedNumber1}
            />
          </Col>
          <Col span={8}>
            <LabeledValue
              label='Approved Number 2'
              value={data.approvedNumber2}
            />
          </Col>
          <Col span={8}>
            <LabeledValue
              label='Approved Number 3'
              value={data.approvedNumber3}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <LabeledValue
              label='Approved Date 1'
              value={new Date(data.approvedDate1).toLocaleDateString()}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <LabeledValue
              label='Approved Authority 1'
              value={data.approvedAuthority1}
            />
          </Col>
          <Col span={8}>
            <LabeledValue
              label='Approved Authority 2'
              value={data.approvedAuthority2}
            />
          </Col>
          <Col span={8}>
            <LabeledValue
              label='Approved Authority 3'
              value={data.approvedAuthority3}
            />
          </Col>
        </Row>
      </Card>

      <Card className='mb-6'>
        <Row gutter={16}>
          <Col span={8}>
            <LabeledValue
              label='Plot Demarcation'
              value={data.plotDemarcation}
            />
          </Col>
          <Col span={8}>
            <LabeledValue label='Road Width 2' value={data.roadWidth2} />
          </Col>
          <Col span={8}>
            <LabeledValue
              label='Property Characteristic'
              value={data.propCharacteristic}
            />
          </Col>
        </Row>
      </Card>

      <Card className='mb-6'>
        <Row>
          <Col span={24}>
            <LabeledValue label='EB Service No.' value={data.ebServiceNo} />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PlanApprovalDetails;
