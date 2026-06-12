import React from "react";
import { useSelector } from "react-redux";
import { Card, Form, Input, Select, Typography } from "antd";
import moment from "moment";

const { Title } = Typography;

const JobDetailsForm = () => {
  const selectedValuation = useSelector(
    (state) => state?.HeroFinCorp?.selectedValuation
  );



  const formatDate = (date) => {
    return date ? moment(date).format("DD-MM-YYYY hh:mm A") : "";
  };

  return (
    <div className='p-4 space-y-4'>
      {/* Job Details Section */}
      <Card className='shadow rounded-lg'>
        <Title level={5} className='text-[#007b8f]'>
          Job Details
        </Title>
        <Form layout='vertical'>
          <Form.Item label='Estimated Completion (Hours)' required>
            <Input
              defaultValue={selectedValuation.estimatedHours}
              type='text'
            />
          </Form.Item>

          {/* <Form.Item label='Assign To' required>
            <Select defaultValue={selectedValuation?.assignTo ?? ""}>
              <Select.Option value='UEAA'>
                Unique Engineering and Associate Bhopal (Valuer Admin)
                (bhopal@ueaa.co.in)
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label='Assign Form' required>
            <Select defaultValue={selectedValuation?.assignForm ?? ""}>
              <Select.Option value={selectedValuation?.assignForm ?? ""}>
                {selectedValuation?.assignForm || "N/A"}
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label='Report Template' required>
            <Select defaultValue={selectedValuation?.reportTemplate ?? ""}>
              <Select.Option value={selectedValuation?.reportTemplate ?? ""}>
                {selectedValuation?.reportTemplate || "N/A"}
              </Select.Option>
            </Select>
          </Form.Item> */}

          <Form.Item label='Job Created On'>
            <Input
              defaultValue={formatDate(selectedValuation?.jobCreatedOn)}
              readOnly
            />
          </Form.Item>

          <Form.Item label='Estimated Completion Time' required>
            <Input
              defaultValue={formatDate(selectedValuation?.estimatedTime)}
              readOnly
            />
          </Form.Item>

          <Form.Item label='Urgent Completed By'>
            <Input
              defaultValue={formatDate(selectedValuation?.urgentCompletedBy)}
              readOnly
            />
          </Form.Item>

          <Form.Item label='Job Completed Date'>
            <Input
              defaultValue={formatDate(selectedValuation?.jobCompletedDate)}
              readOnly
            />
          </Form.Item>

          <Form.Item label='Status' required>
            <Select defaultValue={selectedValuation?.status ?? ""}>
              <Select.Option value={selectedValuation?.status ?? ""}>
                {selectedValuation?.status || "N/A"}
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>

      {/* Property Access Details Section */}
      <Card className='shadow rounded-lg'>
        <Title level={5} className='text-[#007b8f]'>
          Property Access Details
        </Title>
        <Form layout='vertical'>
          <Form.Item label='Contact Person'>
            <Input
              defaultValue={selectedValuation?.contactPerson ?? "N/A"}
              readOnly
            />
          </Form.Item>

          <Form.Item label='Phone/Mobile No.'>
            <Input defaultValue={selectedValuation?.phone ?? "N/A"} readOnly />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default JobDetailsForm;
