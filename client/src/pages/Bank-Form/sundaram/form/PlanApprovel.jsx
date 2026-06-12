import React, { useState } from "react";
import { Form, Input, DatePicker, Button } from "antd";
import toast from "react-hot-toast";

const { TextArea } = Input;

const PlanApprovalForm = ({ extractedData, onNext }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (extractedData && Object.keys(extractedData).length > 0) {
      const p = extractedData.property || {};
      const bounds = p.boundaries || {};
      const propDet = p.property_details || {};
      const loc = p.location_details || {};

      form.setFieldsValue({
        layoutApproval: p.layout_plan_approval || extractedData.layoutApproval || form.getFieldValue("layoutApproval"),
        approvedNumber1: p.approval_no || extractedData.approvedNumber1 || form.getFieldValue("approvedNumber1"),
        // antd DatePicker needs dayjs/moment object, handle string date elsewhere or map raw if possible. For now leaving dates to manual or string if it works
        approvedAuthority1: p.approval_authority || extractedData.approvedAuthority1 || form.getFieldValue("approvedAuthority1"),
        civicStatus: loc.civic_amenities || extractedData.civicStatus || form.getFieldValue("civicStatus"),
        propertyIdentifiedBy: propDet.property_identification_through || extractedData.propertyIdentifiedBy || form.getFieldValue("propertyIdentifiedBy"),
        plotDemarcation: propDet.property_demarcated || extractedData.plotDemarcation || form.getFieldValue("plotDemarcation"),
        propCharacteristic: p.property_type || extractedData.propCharacteristic || form.getFieldValue("propCharacteristic"),
        shapeOfLand: p.shape_of_land || extractedData.shapeOfLand || form.getFieldValue("shapeOfLand"),
        reportedOwner: p.owner_name || p.property_owner || extractedData.reportedOwner || form.getFieldValue("reportedOwner"),
        docNorth: bounds.north_as_per_deed || extractedData.docNorth || form.getFieldValue("docNorth"),
        docSouth: bounds.south_as_per_deed || extractedData.docSouth || form.getFieldValue("docSouth"),
        docEast: bounds.east_as_per_deed || extractedData.docEast || form.getFieldValue("docEast"),
        docWest: bounds.west_as_per_deed || extractedData.docWest || form.getFieldValue("docWest"),
        siteNorth: bounds.north_actual || extractedData.siteNorth || form.getFieldValue("siteNorth"),
        siteSouth: bounds.south_actual || extractedData.siteSouth || form.getFieldValue("siteSouth"),
        siteEast: bounds.east_actual || extractedData.siteEast || form.getFieldValue("siteEast"),
        siteWest: bounds.west_actual || extractedData.siteWest || form.getFieldValue("siteWest"),
        matchesDoc: extractedData.matchesDoc || form.getFieldValue("matchesDoc"),
      });
    }
  }, [extractedData, form]);

  const handleFinish = (values) => {
    onNext(values);
    toast.success("saved successfully!");
  };

  return (
    <div className='bg-white p-6 rounded shadow-md'>
      <h2 className='text-xl font-semibold mb-4'>Plan Approval Details</h2>
      <Form
        layout='vertical'
        form={form}
        onFinish={handleFinish}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
      >
        {/* Layout Approval */}
        <Form.Item name='layoutApproval' label='Layout Approval'>
          <Input />
        </Form.Item>
        <Form.Item name='approvedNumber1' label='Approved Number'>
          <Input />
        </Form.Item>
        <Form.Item name='approvedDate1' label='Approved Date'>
          <DatePicker className='w-full' />
        </Form.Item>
        <Form.Item name='approvedAuthority1' label='Approved Authority'>
          <Input />
        </Form.Item>

        {/* Planning Permit */}
        <Form.Item name='planningPermit' label='Planning Permit'>
          <Input />
        </Form.Item>
        <Form.Item name='approvedNumber2' label='Approved Number'>
          <Input />
        </Form.Item>
        <Form.Item name='approvedDate2' label='Approved Date'>
          <DatePicker className='w-full' />
        </Form.Item>
        <Form.Item name='approvedAuthority2' label='Approved Authority'>
          <Input />
        </Form.Item>

        {/* Building Permit */}
        <Form.Item name='buildingPermit' label='Building Permit'>
          <Input />
        </Form.Item>
        <Form.Item name='approvedNumber3' label='Approved Number'>
          <Input />
        </Form.Item>
        <Form.Item name='approvedDate3' label='Approved Date'>
          <DatePicker className='w-full' />
        </Form.Item>
        <Form.Item name='approvedAuthority3' label='Approved Authority'>
          <Input />
        </Form.Item>

        <Form.Item name='civicStatus' label='Civic Status'>
          <Input />
        </Form.Item>
        <Form.Item name='propertyIdentifiedBy' label='Property Identified By'>
          <Input />
        </Form.Item>
        <Form.Item name='plotDemarcation' label='Plot Demarcation'>
          <Input />
        </Form.Item>
        <Form.Item name='propCharacteristic' label='Property Characteristic'>
          <Input />
        </Form.Item>
        <Form.Item name='shapeOfLand' label='Shape of Land'>
          <Input />
        </Form.Item>
        <Form.Item name='typeOfRoad1' label='Type of Road 1'>
          <Input />
        </Form.Item>
        <Form.Item name='roadWidth1' label='Road Width 1'>
          <Input />
        </Form.Item>
        <Form.Item name='typeOfRoad2' label='Type of Road 2'>
          <Input />
        </Form.Item>
        <Form.Item name='roadWidth2' label='Road Width 2'>
          <Input />
        </Form.Item>

        <Form.Item name='reportedOwner' label='Reported Owner/Tenant'>
          <Input />
        </Form.Item>
        <Form.Item name='ebServiceNo' label='EB Service No / Property ID No'>
          <Input />
        </Form.Item>

        {/* Boundaries by Doc */}
        <Form.Item name='docNorth' label='North by (Doc)'>
          <Input />
        </Form.Item>
        <Form.Item name='docSouth' label='South by (Doc)'>
          <Input />
        </Form.Item>
        <Form.Item name='docEast' label='East by (Doc)'>
          <Input />
        </Form.Item>
        <Form.Item name='docWest' label='West by (Doc)'>
          <Input />
        </Form.Item>

        {/* Boundaries by Site */}
        <Form.Item name='siteNorth' label='North by (Site)'>
          <Input />
        </Form.Item>
        <Form.Item name='siteSouth' label='South by (Site)'>
          <Input />
        </Form.Item>
        <Form.Item name='siteEast' label='East by (Site)'>
          <Input />
        </Form.Item>
        <Form.Item name='siteWest' label='West by (Site)'>
          <Input />
        </Form.Item>

        <Form.Item
          name='matchesDoc'
          label='Matches with Documents (If No, input reason)'
          className='md:col-span-2 lg:col-span-4'
        >
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item className='md:col-span-2 lg:col-span-4 text-right'>
          <Button type='primary' htmlType='submit'>
            Next
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PlanApprovalForm;
