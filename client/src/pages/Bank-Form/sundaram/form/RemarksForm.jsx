import React, { useState } from "react";
import { Card, Input, List, Button, Typography, message } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

const RemarksForm = ({ onNext }) => {
  const initialRemarks = [
    "1. GIVEN XEROX COPY OF SALE DEED...",
    "2. DURING PROPERTY VISIT MR. QAQAM KUMAR JI MET...",
    "3. RATE HAS BEEN CONFIRM FORM MARKET ENQUIRY.",
    "4. PROPERTY IS SITUATED AT SURROUNDING AREA...",
    "5. AT SITE PROPERTY IS UNDER CONST...",
    "6. PROPERTY IS IDENTIFIED BY FOUR SIDE...",
    "7. LAYOUT PLAN, BUILDING PERMISSION...",
  ];

  const [remarks, setRemarks] = useState(initialRemarks);
  const [newRemark, setNewRemark] = useState("");

  const handleAdd = () => {
    if (newRemark.trim()) {
      setRemarks([...remarks, newRemark.trim()]);
      setNewRemark("");
      message.success("Remark added");
    }
  };

  const handleSubmit = () => {
    if (remarks.length === 0) {
      message.warning("Please add at least one remark");
      return;
    }

    onNext({ remarks });
    message.success("Remarks submitted");
  };

  return (
    <Card className='p-6 shadow-md'>
      <Title level={4} className='mb-4 text-blue-600'>
        Remarks and Declaration *
      </Title>

      <List
        size='small'
        bordered
        dataSource={remarks}
        renderItem={(item, index) => <List.Item key={index}>{item}</List.Item>}
        className='mb-4'
      />

      <TextArea
        rows={3}
        value={newRemark}
        onChange={(e) => setNewRemark(e.target.value)}
        placeholder='Type additional remarks here...'
        className='mb-4'
      />

      <div className='flex flex-wrap gap-3'>
        <Button type='primary' onClick={handleAdd}>
          Add Remark
        </Button>
        <Button type='success' onClick={handleSubmit}>
          Submit
        </Button>
        <Button type='default'>Chat</Button>
        <Button danger>Delete Transaction</Button>
      </div>
    </Card>
  );
};

export default RemarksForm;
