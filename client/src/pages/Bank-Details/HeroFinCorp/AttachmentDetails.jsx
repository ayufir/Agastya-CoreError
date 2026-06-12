import React from "react";
import { useSelector } from "react-redux";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const AttachmentDetails = () => {
  const selectedValuation = useSelector(
    (state) => state?.HeroFinCorp?.selectedValuation
  );

  return (
    <Card className='rounded-2xl shadow-md p-4 mb-6'>
      <Title level={4} className='mb-4'>
        Attachments & Comments
      </Title>

      <div className='mb-4'>
        <Text strong>Attachment Description:</Text>
        <p>{selectedValuation?.attachmentDescription || "N/A"}</p>
      </div>

      <div className='mb-4'>
        <Text strong>Attachment File:</Text>
        <p>{selectedValuation?.attachmentFile || "No file uploaded"}</p>
      </div>

      <div className='mb-4'>
        <Text strong>Comment:</Text>
        <p>{selectedValuation?.comment || "No comments available"}</p>
      </div>
    </Card>
  );
};

export default AttachmentDetails;
