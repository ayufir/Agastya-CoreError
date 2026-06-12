import { Spin } from "antd";
import React from "react";

const Spinner = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50'>
      <Spin size='large' />
    </div>
  );
};

export default Spinner;
