// import React from "react";
// import { Button, Collapse, Form, Input, Select, DatePicker } from "antd";

// const { Panel } = Collapse;
// const { Option } = Select;

// const JobInfoForm = ({ onNext }) => {
//   const [form] = Form.useForm();

//   const handleFinish = (values) => {
//     onNext(values); // send data to parent HeroFinCorp
//   };

//   return (
//     <Collapse defaultActiveKey={["1"]} className='mb-4'>
//       <Panel header='Job & Property Access Details' key='1'>
//         <Form
//           layout='vertical'
//           form={form}
//           onFinish={handleFinish}
//           className='grid grid-cols-1 md:grid-cols-2 gap-4'
//         >
//           <Form.Item label='Estimated Completion (Hours)' name='estimatedHours'>
//             <Input type='number' />
//           </Form.Item>

//           <Form.Item label='Assign To' name='assignTo'>
//             <Select placeholder='Select'>
//               <Option value='UEAA'>
//                 Unique Engineering and Associate Bhopal
//               </Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label='Assign Form' name='assignForm'>
//             <Select placeholder='Select'>
//               <Option value='Fincorp Final_New'>Fincorp Final_New</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label='Report Template' name='reportTemplate'>
//             <Select placeholder='Select'>
//               <Option value='v1.1 Fincorp Report Template'>
//                 v1.1 Fincorp Report Template
//               </Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label='Job Created on' name='jobCreatedOn'>
//             <DatePicker showTime className='w-full' />
//           </Form.Item>

//           <Form.Item label='Estimated Completion Time' name='estimatedTime'>
//             <DatePicker showTime className='w-full' />
//           </Form.Item>

//           <Form.Item label='Urgent Completed By' name='urgentCompletedBy'>
//             <DatePicker className='w-full' />
//           </Form.Item>

//           <Form.Item label='Job Completed Date' name='jobCompletedDate'>
//             <DatePicker showTime className='w-full' />
//           </Form.Item>

//           <Form.Item label='Status' name='status'>
//             <Select placeholder='Select'>
//               <Option value='Completed'>Completed</Option>
//               <Option value='In Progress'>In Progress</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label='Contact Person' name='contactPerson'>
//             <Input />
//           </Form.Item>

//           <Form.Item label='Phone/Mobile No.' name='phone'>
//             <Input />
//           </Form.Item>

//           <div className='col-span-2'>
//             <Button type='primary' htmlType='submit' className='bg-[#16828E]'>
//               Save & Continue
//             </Button>
//           </div>
//         </Form>
//       </Panel>
//     </Collapse>
//   );
// };

// export default JobInfoForm;

import React, { useEffect } from "react";
import { Button, Collapse, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";

const { Panel } = Collapse;
const { Option } = Select;

const JobInfoForm = ({ isEdit, onNext }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit) {
      const transformedValues = {
        ...isEdit,
        jobCreatedOn: isEdit.jobCreatedOn ? dayjs(isEdit.jobCreatedOn) : null,
        estimatedTime: isEdit.estimatedTime
          ? dayjs(isEdit.estimatedTime)
          : null,
        urgentCompletedBy: isEdit.urgentCompletedBy
          ? dayjs(isEdit.urgentCompletedBy)
          : null,
        jobCompletedDate: isEdit.jobCompletedDate
          ? dayjs(isEdit.jobCompletedDate)
          : null,
      };
      form.setFieldsValue(transformedValues);
    }
  }, [isEdit]);

  const handleFinish = (values) => {
    onNext(values); // send data to parent HeroFinCorp
  };

  return (
    <Collapse defaultActiveKey={["1"]} className='mb-4'>
      <Panel header='Job & Property Access Details' key='1'>
        <Form
          layout='vertical'
          form={form}
          onFinish={handleFinish}
          className='grid grid-cols-1 md:grid-cols-2 gap-4'
        >
          <Form.Item label='Estimated Completion (Hours)' name='estimatedHours'>
            <Input type='number' />
          </Form.Item>

          <Form.Item label='Assign To' name='assignTo'>
            <Select placeholder='Select'>
              <Option value='UEAA'>
                Unique Engineering and Associate Bhopal
              </Option>
            </Select>
          </Form.Item>

          <Form.Item label='Assign Form' name='assignForm'>
            <Select placeholder='Select'>
              <Option value='Fincorp Final_New'>Fincorp Final_New</Option>
            </Select>
          </Form.Item>

          <Form.Item label='Report Template' name='reportTemplate'>
            <Select placeholder='Select'>
              <Option value='v1.1 Fincorp Report Template'>
                v1.1 Fincorp Report Template
              </Option>
            </Select>
          </Form.Item>

          <Form.Item label='Job Created on' name='jobCreatedOn'>
            <DatePicker showTime className='w-full' />
          </Form.Item>

          <Form.Item label='Estimated Completion Time' name='estimatedTime'>
            <DatePicker showTime className='w-full' />
          </Form.Item>

          <Form.Item label='Urgent Completed By' name='urgentCompletedBy'>
            <DatePicker className='w-full' />
          </Form.Item>

          <Form.Item label='Job Completed Date' name='jobCompletedDate'>
            <DatePicker showTime className='w-full' />
          </Form.Item>

          <Form.Item label='Status' name='status'>
            <Select placeholder='Select'>
              <Option value='Completed'>Completed</Option>
              <Option value='In Progress'>In Progress</Option>
            </Select>
          </Form.Item>

          <Form.Item label='Contact Person' name='contactPerson'>
            <Input />
          </Form.Item>

          <Form.Item label='Phone/Mobile No.' name='phone'>
            <Input />
          </Form.Item>

          <div className='col-span-2'>
            <Button type='primary' htmlType='submit' className='bg-[#16828E]'>
              Save & Continue
            </Button>
          </div>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default JobInfoForm;
