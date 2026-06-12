// import React from "react";
// import { Form, Input, Row, Col, Button } from "antd";

// const GeoLocationInput = () => {
//   const form = Form.useFormInstance();

//   const getLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const lat = position.coords.latitude.toFixed(6);
//           const long = position.coords.longitude.toFixed(6);
//           form.setFieldsValue({
//             latitude: lat,
//             longitude: long,
//           });
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   return (
//     <>
//       <Row gutter={8}>
//         <Col span={12}>
//           <Form.Item name='latitude' label='Latitude'>
//             <Input placeholder='Latitude' readOnly disabled />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item name='longitude' label='Longitude'>
//             <Input placeholder='Longitude' readOnly disabled />
//           </Form.Item>
//         </Col>
//       </Row>
//       <Row gutter={8}>
//         <Col span={24}>
//           <Button
//             type='dashed'
//             className='mt-[28px] !bg-gray-200 !font-bold '
//             onClick={getLocation}
//           >
//             Get Current Location
//           </Button>
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default GeoLocationInput;

import React, { forwardRef, useImperativeHandle } from "react";
import { Form, Input, Row, Col } from "antd";

const GeoLocationInput = forwardRef((props, ref) => {
  console.log(ref, "DFGHJ");

  const form = Form.useFormInstance();

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const long = position.coords.longitude.toFixed(6);
          form.setFieldsValue({
            latitude: lat,
            longitude: long,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Expose the getLocation function to parent via ref
  useImperativeHandle(ref, () => ({
    getLocation,
  }));

  return (
    <>
      <Row gutter={8}>
        <Col span={12}>
          <Form.Item name='latitude' label='Latitude'>
            <Input placeholder='Latitude' readOnly disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='longitude' label='Longitude'>
            <Input placeholder='Longitude' readOnly disabled />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
});

export default GeoLocationInput;
