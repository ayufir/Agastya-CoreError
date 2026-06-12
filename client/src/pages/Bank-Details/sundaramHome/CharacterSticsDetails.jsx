import React from "react";
import { useSelector } from "react-redux";
import { Typography, Tag, Card } from "antd";

const { Title, Text } = Typography;

// Utility component to render tags
const TagGroup = ({ items }) => (
  <div className='flex flex-wrap gap-2 mt-2'>
    {(items || []).map((item, index) => (
      <Tag key={index} color='blue' className='px-4 py-1 text-base'>
        {item}
      </Tag>
    ))}
  </div>
);

const CharacterSticsDetails = () => {
  const data = useSelector((state) => state.sundaramBank.currentReport);

  return (
    <div className='max-w-6xl mx-auto p-4'>
      <Title level={3} className='text-center mb-6'>
        Characteristics of Property
      </Title>

      {/* Development Locality */}
      <Card className='mb-6'>
        <Text strong>Development (Locality)</Text>
        <div className='border rounded p-2 mt-2 bg-gray-50'>
          {data?.developmentLocality || "N/A"}
        </div>
      </Card>

      {/* Usage of Surrounding Property */}
      <Card className='mb-6'>
        <Text strong>Usage of Surrounding Property</Text>
        <TagGroup items={data?.surroundingUsage} />
      </Card>

      {/* Classification of Locality */}
      <Card className='mb-6'>
        <Text strong>Classification of Locality</Text>
        <div className='border rounded p-2 mt-2 bg-gray-50'>
          {data?.classification || "N/A"}
        </div>
      </Card>

      {/* Facilities */}
      <Card className='mb-6'>
        <Text strong>Facilities Available</Text>
        <TagGroup items={data?.facilities} />
      </Card>

      {/* Water Supply */}
      <Card className='mb-6'>
        <Text strong>Water Supply</Text>
        <TagGroup items={data?.waterSupply} />
      </Card>

      {/* Sanitary System */}
      <Card className='mb-6'>
        <Text strong>Sanitary System</Text>
        <TagGroup items={data?.sanitarySystem} />
      </Card>

      {/* Usage as per Master Plan */}
      <Card className='mb-6'>
        <Text strong>Usage as per Master Plan</Text>
        <div className='border rounded p-2 mt-2 bg-gray-50'>
          {data?.usage_master_plan || "N/A"}
        </div>
      </Card>

      {/* Usage at Site */}
      <Card className='mb-6'>
        <Text strong>Usage at Site</Text>
        <div className='border rounded p-2 mt-2 bg-gray-50'>
          {data?.usage_site || "N/A"}
        </div>
      </Card>

      {/* Marketability */}
      <Card className='mb-6'>
        <Text strong>Marketability</Text>
        <div className='border rounded p-2 mt-2 bg-gray-50'>
          {data?.marketability || "N/A"}
        </div>
      </Card>

      {/* Rental Value */}
      <Card className='mb-6'>
        <Text strong>Rental Value</Text>
        <div className='border rounded p-2 mt-2 bg-gray-50'>
          {data?.rental_value || "N/A"}
        </div>
      </Card>

      {/* Factors Enhancing Value */}
      <Card className='mb-6'>
        <Text strong>Factor Enhancing Value</Text>
        <div className='border rounded p-2 mt-2 bg-gray-50'>
          {data?.factor_enhancing || "N/A"}
        </div>
      </Card>

      {/* Factors Affecting Value */}
      <Card className='mb-6'>
        <Text strong>Factor Affecting Value</Text>
        <div className='border rounded p-2 mt-2 bg-gray-50'>
          {data?.factor_affecting || "N/A"}
        </div>
      </Card>

      {/* Natural Protection */}
      <Card className='mb-6'>
        <Text strong>Natural Protection</Text>
        <TagGroup items={data?.natural_protection} />
      </Card>

      {/* Flooring */}
      <Card className='mb-6'>
        <Text strong>Flooring</Text>
        <TagGroup items={data?.flooring} />
      </Card>

      {/* Details of Rooms */}
      <Card className='mb-6'>
        <Text strong>Details of Rooms</Text>
        <div className='border rounded p-2 mt-2 bg-gray-50'>
          {data?.details_of_rooms || "N/A"}
        </div>
      </Card>
    </div>
  );
};

export default CharacterSticsDetails;
