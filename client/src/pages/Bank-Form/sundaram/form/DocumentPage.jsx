import React, { useState } from "react";
import {
  Button,
  Upload,
  Tabs,
  Typography,
  Row,
  Col,
  Image,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;

const DocumentPage = ({ onNext }) => {
  const [uploadedImages, setUploadedImages] = useState({
    "Front Elevation": [],
    "Door / Plot No": [],
    "Road View": [],
    Hall: [],
    Kitchen: [],
    "Bed Room": [],
    Toilet: [],
    Others: [],
  });

  const [uploadedDocuments, setUploadedDocuments] = useState({
    "Title Deed": [],
    "Tax Receipt": [],
    "Ownership Proof": [],
  });

  const handleUploadChange = (info, type, category) => {
    const files = info.fileList
      .map((file) => file.originFileObj)
      .filter(Boolean);
    if (type === "image") {
      setUploadedImages((prev) => ({ ...prev, [category]: files }));
    } else {
      setUploadedDocuments((prev) => ({ ...prev, [category]: files }));
    }
  };

  const renderUploadSection = (data, type) =>
    Object.entries(data).map(([label, files]) => (
      <div key={label} className='mb-6'>
        <Title level={5}>{label}</Title>
        <Upload
          multiple
          listType={type === "image" ? "picture" : "text"}
          beforeUpload={() => false}
          onChange={(info) => handleUploadChange(info, type, label)}
        >
          <Button icon={<UploadOutlined />}>
            Upload {type === "image" ? "Image" : "Document"}
          </Button>
        </Upload>

        {type === "image" && (
          <Row gutter={[16, 16]} className='mt-2'>
            {files.map((file, idx) => (
              <Col key={idx} xs={12} sm={6} md={4}>
                <Image
                  src={URL.createObjectURL(file)}
                  height={100}
                  style={{ objectFit: "cover" }}
                />
              </Col>
            ))}
          </Row>
        )}

        {type === "document" && (
          <ul className='text-sm text-gray-700 mt-2'>
            {files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    ));

  const handleNextClick = () => {
    onNext({ uploadedImages, uploadedDocuments });
  };

  return (
    <div className='p-4'>
      <Tabs defaultActiveKey='1' className='mb-6'>
        <TabPane tab='Image Uploads' key='1'>
          {renderUploadSection(uploadedImages, "image")}
        </TabPane>
        <TabPane tab='Document Uploads' key='2'>
          {renderUploadSection(uploadedDocuments, "document")}
        </TabPane>
      </Tabs>

      <Button type='primary' onClick={handleNextClick}>
        Next
      </Button>
    </div>
  );
};

export default DocumentPage;
