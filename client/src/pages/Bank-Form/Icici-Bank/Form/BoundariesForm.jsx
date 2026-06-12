import React, { useState, useEffect } from "react";
import { Input, Radio, Button, Card } from "antd";
import { ChevronDown, ChevronUp } from "lucide-react";

const BoundariesForm = ({ onNext, isEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    propertyAge: "",
    residualAge: "",
    internalMaintenance: "",
    externalMaintenance: "",
    eastDocument: "COLONY ROAD",
    eastSiteVisit: "COLONY ROAD",
    eastDimensions: "",
    westDocument: "PLOT NO. B-1",
    westSiteVisit: "OPEN PLOT",
    westDimensions: "",
    northDocument: "PLOT NO. B-41",
    northSiteVisit: "HOUSE OF ANILCII",
    northDimensions: "",
    southDocument: "COLONY ROAD",
    southSiteVisit: "COLONY ROAD",
    southDimensions: "",
    irregularShape: "No",
    notDemented: "No",
    boundariesMatching: "No",
    remarks: "",
  });

  useEffect(() => {
    if (isEdit) {
      setFormData(isEdit);
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      boundariesMatching: formData.boundariesMatching === "Yes",
      irregularShape: formData.irregularShape === "Yes",
      notDemented: formData.notDemented === "Yes",
    };

    onNext(updatedFormData);
  };

  const renderBoundarySection = (direction, title) => (
    <Card title={title} className='w-full lg:w-[23%]'>
      <div className='mb-2'>
        <p className='font-medium'>As Per Document</p>
        <Input
          name={`${direction}Document`}
          value={formData[`${direction}Document`]}
          onChange={handleChange}
        />
      </div>
      <div className='mb-2'>
        <p className='font-medium'>As Per Site Visit</p>
        <Input
          name={`${direction}SiteVisit`}
          value={formData[`${direction}SiteVisit`]}
          onChange={handleChange}
        />
      </div>
      <div>
        <p className='font-medium'>Linear Dimensions (ft)</p>
        <Input
          name={`${direction}Dimensions`}
          value={formData[`${direction}Dimensions`]}
          onChange={handleChange}
        />
      </div>
    </Card>
  );

  return (
    <div className='w-full px-4 py-4'>
      {/* Toggle Header */}
      <div
        className='flex items-center justify-between bg-red-800 text-white p-4 rounded-lg cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className='text-lg font-semibold'>Boundaries</h2>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </div>

      {/* Collapsible Form */}
      {isOpen && (
        <form onSubmit={handleSubmit} className='mt-4 space-y-6'>
          <div className='flex flex-wrap gap-4 justify-between'>
            {renderBoundarySection("east", "East")}
            {renderBoundarySection("west", "West")}
            {renderBoundarySection("north", "North")}
            {renderBoundarySection("south", "South")}
          </div>

          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <p className='font-medium'>Property Age (yrs)</p>
              <Input
                type='number'
                name='propertyAge'
                value={formData.propertyAge}
                onChange={handleChange}
              />
            </div>
            <div>
              <p className='font-medium'>Residual Age (yrs)</p>
              <Input
                type='number'
                name='residualAge'
                value={formData.residualAge}
                onChange={handleChange}
              />
            </div>
            <div>
              <p className='font-medium'>Internal Maintenance</p>
              <Input
                name='internalMaintenance'
                value={formData.internalMaintenance}
                onChange={handleChange}
              />
            </div>
            <div>
              <p className='font-medium'>External Maintenance</p>
              <Input
                name='externalMaintenance'
                value={formData.externalMaintenance}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='grid md:grid-cols-3 gap-4'>
            <div>
              <p className='font-medium mb-1'>Irregular Shape Plot?</p>
              <Radio.Group
                onChange={(e) =>
                  handleRadioChange("irregularShape", e.target.value)
                }
                value={formData.irregularShape}
              >
                <Radio value='Yes'>Yes</Radio>
                <Radio value='No'>No</Radio>
              </Radio.Group>
            </div>
            <div>
              <p className='font-medium mb-1'>Not Demented?</p>
              <Radio.Group
                onChange={(e) =>
                  handleRadioChange("notDemented", e.target.value)
                }
                value={formData.notDemented}
              >
                <Radio value='Yes'>Yes</Radio>
                <Radio value='No'>No</Radio>
              </Radio.Group>
            </div>
            <div>
              <p className='font-medium mb-1'>Boundaries Are Matching?</p>
              <Radio.Group
                onChange={(e) =>
                  handleRadioChange("boundariesMatching", e.target.value)
                }
                value={formData.boundariesMatching}
              >
                <Radio value='Yes'>Yes</Radio>
                <Radio value='No'>No</Radio>
              </Radio.Group>
            </div>
          </div>

          <div className='flex justify-end'>
            <Button
              type='primary'
              htmlType='submit'
              className='bg-red-800 hover:bg-red-700'
            >
              Next
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BoundariesForm;
