import React from "react";

const NdmaParameters = () => {
  return (
    <div className="container mx-auto mt-4 p-4 bg-white shadow-lg rounded-lg">
      <div className="bg-[#365069] text-white p-3 rounded mb-4">
        <h2 className="text-xl">NDMA Parameters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        <div className="p-2">
          <h6 className="text-gray-500">Nature of Building/Wing/ Tower</h6>
          <p className="font-semibold">Not Applicable</p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Type of Structure</h6>
          <p className="font-semibold">RCC Framed</p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Function of Use</h6>
          <p className="font-semibold">Residential</p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">
            Height of Building above ground level
          </h6>
          <p className="font-semibold">Not Applicable</p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Type of Foundation</h6>
          <p className="font-semibold">
            Not able to assess since completed property
          </p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Horizontal Floor type</h6>
          <p className="font-semibold">Not Applicable</p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Concrete Grade</h6>
          <p className="font-semibold">
            Not able to assess since completed property
          </p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Steel Grade</h6>
          <p className="font-semibold">
            Not able to assess since completed property
          </p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Seismic Zone</h6>
          <p className="font-semibold">Zone III</p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Soil slope vulnerable to landslide</h6>
          <p className="font-semibold">Very low Hazard zone</p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Flood prone area</h6>
          <p className="font-semibold">No</p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Urban Floods</h6>
          <p className="font-semibold">Upstream</p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Environment Exposure Condition</h6>
          <p className="font-semibold">Mild</p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Tsunami</h6>
          <p className="font-semibold">No</p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Wind/Cyclones</h6>
          <p className="font-semibold">Low Damage Risk Zone</p>
        </div>
        <div className="p-2">
          <h6 className="text-gray-500">Coastal Regulatory Zone</h6>
          <p className="font-semibold">CRZ IV</p>
        </div>
      </div>
    </div>
  );
};

export default NdmaParameters;
