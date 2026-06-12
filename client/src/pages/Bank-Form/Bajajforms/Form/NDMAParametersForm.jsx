import React, { useState } from 'react';
import toast from 'react-hot-toast';
const NDMAParametersForm = ({onNext}) => {
  const [formData, setFormData] = useState({
    buildingNature: "Residential",
    planAspectRatio: "YES",
    structureType: "RCC",
    projectedParts: "Yes",
    masonryType: "Brick Masonry",
    expansionJoints: "NO",
    roofType: "Plain",
    steelGrade: "Fe 415",
    mortarType: "Cement Mortar",
    concreteGrade: "M 20",
    environmentExposure: "MILD",
    footingType: "Stepped Footing",
    seismicZone: "II & III",
    soilLiquefiable: "NO",
    coastalRegulatoryZone: "No",
    soilSlope: "NO",
    floodProneArea: "NO",
    groundSlope: "NO",
    fireExit: "No",
    sanctionedPlan: "NA",
    layoutPlan: "NA",
    constructionPlan: "NA",
    sanctionDate: "NA",
    planValidity: "NA",
    approvingAuthority: "NA",
    approvedUsages: "NA",
    numberOfFloors: "NA",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

      const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
    toast.success("saved successfully");
  };


  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="text-lg font-bold">NDMA Parameters</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg shadow-md">
        <div className="flex flex-col">
          <label className="font-bold">Nature of Building/Wing</label>
          <input
            type="text"
            name="buildingNature"
            value={formData.buildingNature}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Plan Aspect Ratio</label>
          <input
            type="text"
            name="planAspectRatio"
            value={formData.planAspectRatio}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Structure Type</label>
          <input
            type="text"
            name="structureType"
            value={formData.structureType}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Projected Parts Available</label>
          <input
            type="text"
            name="projectedParts"
            value={formData.projectedParts}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Type of Masonry</label>
          <input
            type="text"
            name="masonryType"
            value={formData.masonryType}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Expansion Joints Available</label>
          <input
            type="text"
            name="expansionJoints"
            value={formData.expansionJoints}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Roof Type</label>
          <input
            type="text"
            name="roofType"
            value={formData.roofType}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Steel Grade</label>
          <input
            type="text"
            name="steelGrade"
            value={formData.steelGrade}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Mortar Type</label>
          <input
            type="text"
            name="mortarType"
            value={formData.mortarType}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Concrete Grade</label>
          <input
            type="text"
            name="concreteGrade"
            value={formData.concreteGrade}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Environment Exposure Condition</label>
          <input
            type="text"
            name="environmentExposure"
            value={formData.environmentExposure}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Footing Type</label>
          <input
            type="text"
            name="footingType"
            value={formData.footingType}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Seismic Zone</label>
          <input
            type="text"
            name="seismicZone"
            value={formData.seismicZone}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Soil Liquefiable</label>
          <input
            type="text"
            name="soilLiquefiable"
            value={formData.soilLiquefiable}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Coastal Regulatory Zone</label>
          <input
            type="text"
            name="coastalRegulatoryZone"
            value={formData.coastalRegulatoryZone}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Soil Slope</label>
          <input
            type="text"
            name="soilSlope"
            value={formData.soilSlope}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Flood Prone Area</label>
          <input
            type="text"
            name="floodProneArea"
            value={formData.floodProneArea}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Ground Slope</label>
          <input
            type="text"
            name="groundSlope"
            value={formData.groundSlope}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Fire Exit</label>
          <input
            type="text"
            name="fireExit"
            value={formData.fireExit}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Sanctioned Plan</label>
          <input
            type="text"
            name="sanctionedPlan"
            value={formData.sanctionedPlan}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Layout Plan</label>
          <input
            type="text"
            name="layoutPlan"
            value={formData.layoutPlan}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Construction Plan</label>
          <input
            type="text"
            name="constructionPlan"
            value={formData.constructionPlan}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Sanction Date</label>
          <input
            type="text"
            name="sanctionDate"
            value={formData.sanctionDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Plan Validity</label>
          <input
            type="text"
            name="planValidity"
            value={formData.planValidity}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Approving Authority</label>
          <input
            type="text"
            name="approvingAuthority"
            value={formData.approvingAuthority}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Approved Usages</label>
          <input
            type="text"
            name="approvedUsages"
            value={formData.approvedUsages}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold">Number of Floors</label>
          <input
            type="text"
            name="numberOfFloors"
            value={formData.numberOfFloors}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
      </div>

      <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </form>
  );
};

export default NDMAParametersForm;
