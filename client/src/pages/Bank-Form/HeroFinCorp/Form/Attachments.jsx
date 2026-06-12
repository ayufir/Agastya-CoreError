// import React, { useState } from "react";
// import { Button, Collapse, Input, Upload, List, Typography } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const { Panel } = Collapse;
// const { TextArea } = Input;
// const { Text } = Typography;

// const Attachments = ({ onNext }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   const [comment, setComment] = useState("");
//   const [attachments, setAttachments] = useState([]);
//   const [comments, setComments] = useState([
//     {
//       text: "The property type determined during valuation differs from the property type set in the order.",
//       author: "Unique Engineering and Associate Bhopal",
//       date: "Mar 22, 2025 3:40 PM",
//     },
//   ]);

//   const handleFileUpload = (info) => {
//     const file = info.file;
//     if (file.status === "done") {
//       setAttachments([...attachments, { name: file.name, type: file.type }]);
//     }
//   };

//   const handleCommentSubmit = () => {
//     if (comment.trim()) {
//       setComments([
//         ...comments,
//         {
//           text: comment,
//           author: "Unique Engineering and Associate Bhopal",
//           date: new Date().toLocaleString(),
//         },
//       ]);
//       setComment("");
//     }
//   };

//   const handleDeleteAttachment = (index) => {
//     const updated = attachments.filter((_, i) => i !== index);
//     setAttachments(updated);
//   };

//   const handleFinish = () => {
//     onNext({ attachments, comments }); // send data to parent HeroFinCorp
//   };

//   return (
//     <Collapse defaultActiveKey={["1"]} className='mb-4'>
//       <Panel header='Attachments & Comments' key='1'>
//         <div className='p-4'>
//           <h5 className='font-bold text-xl'>Attachments</h5>
//           <Upload
//             customRequest={handleFileUpload}
//             showUploadList={false}
//             accept='.pdf,.doc,.jpg,.png'
//           >
//             <Button icon={<UploadOutlined />} className='mb-3'>
//               Upload Attachment
//             </Button>
//           </Upload>
//           <List
//             dataSource={attachments}
//             renderItem={(item, index) => (
//               <List.Item>
//                 <div className='flex justify-between items-center'>
//                   <Text>{item.name}</Text>
//                   <Button
//                     type='text'
//                     danger
//                     onClick={() => handleDeleteAttachment(index)}
//                   >
//                     🗑️
//                   </Button>
//                 </div>
//               </List.Item>
//             )}
//           />

//           <h5 className='font-bold text-xl mt-4'>Comments</h5>
//           <TextArea
//             rows={4}
//             placeholder='Add a new comment...'
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             className='mb-3'
//           />
//           <Button
//             style={{ backgroundColor: "#16828E" }}
//             type='primary'
//             onClick={handleCommentSubmit}
//             className='mb-3'
//           >
//             Save Comment
//           </Button>

//           <List
//             dataSource={comments}
//             renderItem={(item, idx) => (
//               <List.Item key={idx} className='border rounded p-3 mb-2'>
//                 <Text className='block'>{item.text}</Text>
//                 <Text className='text-gray-500'>
//                   On {item.date} by <strong>{item.author}</strong>
//                 </Text>
//               </List.Item>
//             )}
//           />

//           <Button
//             type='primary'
//             onClick={handleFinish}
//             className='mt-4'
//             style={{ backgroundColor: "#16828E" }}
//           >
//             Save & Continue
//           </Button>
//         </div>
//       </Panel>
//     </Collapse>
//   );
// };

// export default Attachments;

import React, { useState, useEffect } from "react";
import { Button, Collapse, Input, Upload, List, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { TextArea } = Input;
const { Text } = Typography;

const Attachments = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [comment, setComment] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [comments, setComments] = useState([
    {
      text: "The property type determined during valuation differs from the property type set in the order.",
      author: "Unique Engineering and Associate Bhopal",
      date: "Mar 22, 2025 3:40 PM",
    },
  ]);

  useEffect(() => {
    if (isEdit) {
      setAttachments(isEdit.attachments);
      setComments(isEdit.comments);
    }
  }, [isEdit]);

  const handleFileUpload = (info) => {
    const file = info.file;
    if (file.status === "done") {
      setAttachments([...attachments, { name: file.name, type: file.type }]);
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          text: comment,
          author: "Unique Engineering and Associate Bhopal",
          date: new Date().toLocaleString(),
        },
      ]);
      setComment("");
    }
  };

  const handleDeleteAttachment = (index) => {
    const updated = attachments.filter((_, i) => i !== index);
    setAttachments(updated);
  };

  const handleFinish = () => {
    onNext({ attachments, comments }); // send data to parent HeroFinCorp
  };

  return (
    <Collapse defaultActiveKey={["1"]} className='mb-4'>
      <Panel header='Attachments & Comments' key='1'>
        <div className='p-4'>
          <h5 className='font-bold text-xl'>Attachments</h5>
          <Upload
            customRequest={handleFileUpload}
            showUploadList={false}
            accept='.pdf,.doc,.jpg,.png'
          >
            <Button icon={<UploadOutlined />} className='mb-3'>
              Upload Attachment
            </Button>
          </Upload>
          <List
            dataSource={attachments}
            renderItem={(item, index) => (
              <List.Item>
                <div className='flex justify-between items-center'>
                  <Text>{item.name}</Text>
                  <Button
                    type='text'
                    danger
                    onClick={() => handleDeleteAttachment(index)}
                  >
                    🗑️
                  </Button>
                </div>
              </List.Item>
            )}
          />

          <h5 className='font-bold text-xl mt-4'>Comments</h5>
          <TextArea
            rows={4}
            placeholder='Add a new comment...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='mb-3'
          />
          <Button
            style={{ backgroundColor: "#16828E" }}
            type='primary'
            onClick={handleCommentSubmit}
            className='mb-3'
          >
            Save Comment
          </Button>

          <List
            dataSource={comments}
            renderItem={(item, idx) => (
              <List.Item key={idx} className='border rounded p-3 mb-2'>
                <Text className='block'>{item.text}</Text>
                <Text className='text-gray-500'>
                  On {item.date} by <strong>{item.author}</strong>
                </Text>
              </List.Item>
            )}
          />

          <Button
            type='primary'
            onClick={handleFinish}
            className='mt-4'
            style={{ backgroundColor: "#16828E" }}
          >
            Save & Continue
          </Button>
        </div>
      </Panel>
    </Collapse>
  );
};

export default Attachments;
