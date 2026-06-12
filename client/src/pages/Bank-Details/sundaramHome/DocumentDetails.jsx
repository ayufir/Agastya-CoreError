import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Tabs, Image, Row, Col } from "antd";

const { TabPane } = Tabs;

const DocumentDetails = () => {
  const data = useSelector((state) => state.sundaramBank?.currentReport || {});

  // Replace these with actual image URLs from data
  const fallbackImage =
    "https://images.unsplash.com/photo-1742943892627-f7e4ddf91224?w=600&auto=format&fit=crop&q=60";

  const imageData = {
    images: {
      "Front Elevation": data.frontElevation?.length
        ? data.frontElevation
        : [fallbackImage],
      "Door / Plot No": data.doorPlotNo?.length
        ? data.doorPlotNo
        : [fallbackImage],
      "Road View": data.roadView?.length ? data.roadView : [fallbackImage],
      Hall: data.hall?.length ? data.hall : [fallbackImage],
      Kitchen: data.kitchen?.length ? data.kitchen : [fallbackImage],
      "Bed Room": data.bedRoom?.length ? data.bedRoom : [fallbackImage],
      Toilet: data.toilet?.length ? data.toilet : [fallbackImage],
      Others: data.others?.length ? data.others : [fallbackImage],
    },
    documents: {
      "Title Deed": [fallbackImage],
      "Tax Receipt": [fallbackImage],
      "Ownership Proof": [fallbackImage],
    },
  };

  const renderSection = (sectionData) =>
    Object.entries(sectionData).map(([label, images]) => (
      <div key={label} className='mb-6'>
        <h4 className='text-lg font-semibold mb-2'>{label}</h4>
        <Row gutter={[16, 16]}>
          {images.map((src, i) => (
            <Col key={i} xs={12} sm={8} md={6} lg={4}>
              <Image
                src={src}
                alt={label}
                height={100}
                style={{ objectFit: "cover", width: "100%" }}
                className='rounded-xl shadow'
              />
            </Col>
          ))}
        </Row>
      </div>
    ));

  return (
    <div className='p-4'>
      <Tabs defaultActiveKey='1' className='mb-4'>
        <TabPane tab='Image Upload' key='1'>
          {renderSection(imageData.images)}
        </TabPane>
        <TabPane tab='Property Documents Upload' key='2'>
          {renderSection(imageData.documents)}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DocumentDetails;
