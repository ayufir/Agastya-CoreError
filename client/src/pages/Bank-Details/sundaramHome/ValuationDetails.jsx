import React from "react";
import { Form, Input, Button, Typography } from "antd";
import { useSelector } from "react-redux";

const { Title } = Typography;

const ReadOnlyField = ({ label, value }) => (
  <Form.Item label={<span className='font-semibold'>{label}</span>}>
    <Input value={value || "—"} readOnly className='bg-gray-50 text-gray-700' />
  </Form.Item>
);

const ButtonGroupField = ({ label, options, selected = [] }) => (
  <Form.Item label={<span className='font-semibold'>{label}</span>}>
    <div className='flex flex-wrap gap-2'>
      {options.map((opt, idx) => (
        <Button
          key={idx}
          type={selected.includes(opt) ? "primary" : "default"}
          className='cursor-default'
          disabled
        >
          {opt}
        </Button>
      ))}
    </div>
  </Form.Item>
);

const ValuationDetails = () => {
  const data = useSelector((state) => state.sundaramBank.currentReport);

  return (
    <div className='p-4'>
      <Title level={3} className='text-center mb-6'>
        Valuation Details
      </Title>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <ReadOnlyField
          label='Caution Property'
          value={data?.caution_property}
        />
        <ReadOnlyField label='Marketability' value={data?.marketability} />
        <ReadOnlyField
          label='Usage Master Plan'
          value={data?.usage_master_plan}
        />
        <ReadOnlyField label='Usage Site' value={data?.usage_site} />
        <ReadOnlyField
          label='Factor Enhancing Value'
          value={data?.factor_enhancing}
        />
        <ReadOnlyField
          label='Factor Affecting Value'
          value={data?.factor_affecting}
        />
        <ReadOnlyField label='Building Spec 1' value={data?.building_spec_1} />
        <ReadOnlyField label='Building Spec 2' value={data?.building_spec_2} />
        <ReadOnlyField
          label='Details of Rooms'
          value={data?.details_of_rooms}
        />
      </div>

      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
        <ButtonGroupField
          label='Flooring'
          options={[
            "Cement",
            "Ceramic Tiles",
            "Granite",
            "Marble",
            "Mosaic",
            "Stone",
            "Tiles",
            "Under Construction",
            "Vitrified Tiles",
          ]}
          selected={data?.flooring || []}
        />

        <ButtonGroupField
          label='Natural Protection'
          options={[
            "Fire Fighting System",
            "Earthquake Protection",
            "Floods Protection",
            "Landslide Protection",
            "Tsunami Protection",
            "Volcanic Eruption Protection",
          ]}
          selected={data?.natural_protection || []}
        />

        <ButtonGroupField
          label='Facilities'
          options={[
            "CCTV",
            "Club House",
            "Community Hall",
            "Covered Car Park",
            "Gym",
            "Intercom Facility",
            "Kids Play Area",
            "Lift",
            "No Additional Amenities",
            "Power Backup - For Common Areas",
            "Power Backup - For Limited Points & Common Area",
            "Power Backup - For Entire Building",
            "Security",
            "Swimming Pool",
          ]}
          selected={data?.facilities || []}
        />

        <ButtonGroupField
          label='Water Supply'
          options={[
            "Bore Well",
            "Corporation",
            "Open Well",
            "Panchayat",
            "Tank",
          ]}
          selected={data?.waterSupply || []}
        />

        <ButtonGroupField
          label='Sanitary System'
          options={["Septic Tank", "Sewer Line"]}
          selected={data?.sanitarySystem || []}
        />

        <ButtonGroupField
          label='Surrounding Usage'
          options={[
            "Residential",
            "Commercial",
            "Industrial",
            "Institutional",
            "Agricultural",
          ]}
          selected={data?.surroundingUsage || []}
        />
      </div>
    </div>
  );
};

export default ValuationDetails;
