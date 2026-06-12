// DistanceRangeForm.jsx
import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";

const DistanceRangeForm = ({ data, editData, extractedData, onSave, onSaveAndNext, saving }) => {
  const [form, setForm] = useState({
    distanceFromCPC: "",
    distanceFromCityCenter: "",
    distanceFromBank: "",
    latitude: "",
    longitude: "78.18159",
    oneWayDistance: "",
  });

  useEffect(() => {
    const src = (data && Object.keys(data).length > 0) ? data : (editData || {});
    const autofillData = extractedData || {};
    if (src) {
      setForm((prev) => ({ ...prev, ...src, ...autofillData }));
    }
  }, [editData, data, extractedData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onSave) onSave("distanceRange", form);
  };

  const handleSaveAndNext = () => {
    if (onSaveAndNext) onSaveAndNext("distanceRange", form);
  };

  return (
    <div className="space-y-5">
      {/* ===== Distance Range of the Property ===== */}
      <div className="border border-gray-200 rounded-md">
        <div className="bg-red-50 px-4 py-2 border-b border-gray-200 rounded-t-md">
          <h4 className="text-red-600 font-semibold text-base">Distance Range of the property</h4>
        </div>
        <div className="p-4 space-y-4">
          {/* First Row - 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Distance From CPC (kms)</label>
              <Input
                value={form.distanceFromCPC}
                onChange={(e) => handleChange("distanceFromCPC", e.target.value)}
                placeholder="Distance in kms"
                size="large"
                className="border-gray-300"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Distance From City Center (kms)</label>
              <Input
                value={form.distanceFromCityCenter}
                onChange={(e) => handleChange("distanceFromCityCenter", e.target.value)}
                placeholder="Distance in kms"
                size="large"
                className="border-gray-300"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Distance From ICICI Bank Sourcing Branch (kms)</label>
              <Input
                value={form.distanceFromBank}
                onChange={(e) => handleChange("distanceFromBank", e.target.value)}
                placeholder="Distance in kms"
                size="large"
                className="border-gray-300"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Latitude *</label>
              <Input
                value={form.latitude}
                onChange={(e) => handleChange("latitude", e.target.value)}
                placeholder="Latitude"
                size="large"
                className="border-gray-300"
              />
            </div>
          </div>

          {/* Second Row - 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Longitude *</label>
              <Input
                value={form.longitude}
                onChange={(e) => handleChange("longitude", e.target.value)}
                placeholder="78.18159"
                size="large"
                className="border-gray-300"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">One Way Distance From Operating Location (kms)</label>
              <Input
                value={form.oneWayDistance}
                onChange={(e) => handleChange("oneWayDistance", e.target.value)}
                placeholder="Distance in kms"
                size="large"
                className="border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Location Map ===== */}
      <div className="border border-gray-200 rounded-md">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 rounded-t-md">
          <h4 className="text-gray-700 font-semibold text-base">Location Map</h4>
        </div>
        <div className="p-4">
          <div className="bg-white rounded-md overflow-hidden shadow border border-gray-200">
            <iframe
              title="Google Map"
              width="100%"
              height="400"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps?q=${form.latitude || 26.2183},${form.longitude || 78.1816}&z=15&output=embed`}
              allowFullScreen
            />
          </div>
        </div>
      </div>

      {/* ===== Action Buttons ===== */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 w-full">
        <Button
          onClick={handleSave}
          loading={saving}
          className="h-[38px] px-6 text-sm font-medium rounded-[4px] border-blue-600 text-blue-600 w-full sm:w-auto"
        >
          Save
        </Button>
        <Button
          type="primary"
          onClick={handleSaveAndNext}
          loading={saving}
           style={{
              backgroundColor: "#1b3a6b",
              borderColor: "#1b3a6b",
           }}
          className="h-[38px] px-6 text-sm font-medium rounded-[4px] bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
        >
          Save & Next
        </Button>
      </div>
    </div>
  );
};

export default DistanceRangeForm;
