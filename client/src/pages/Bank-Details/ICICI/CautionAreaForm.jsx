import React, { useEffect, useState } from "react";
import { Button, Checkbox } from "antd";

const CautionAreaForm = ({ data, editData, extractedData, onSave, onSaveAndNext, saving }) => {
  const [form, setForm] = useState({
    anyChemicalHazard: false,
    communityDominated: false,
    floodProne: false,
    landReservation: false,
    nearCrematorium: false,
    nearGarbageDump: false,
    nearNalla: false,
    nearToRailTrack: false,
    probableRoadExtension: false,
    propertyAccessIssues: false,
    propertyIsLandLocked: false,
    slumArea: false,
    statutoryNoticesOnProperty: false,
    underHighTensionLine: false,
  });

  useEffect(() => {
    const src = (data && Object.keys(data).length > 0) ? data : (editData || {});
    const autofillData = extractedData || {};
    if (Object.keys(src).length === 0 && Object.keys(autofillData).length === 0) return;
    setForm((prev) => ({ ...prev, ...src, ...autofillData }));
  }, [editData, data, extractedData]);

  const handleCheck = (field) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    if (onSave) onSave("cautionArea", form);
  };

  const handleSaveAndNext = () => {
    if (onSaveAndNext) onSaveAndNext("cautionArea", form);
  };

  const items = [
    ["anyChemicalHazard", "Any Chemical Hazard"],
    ["communityDominated", "Community Dominated"],
    ["floodProne", "Flood Prone"],
    ["landReservation", "Land Reservation"],
    ["nearCrematorium", "Near Crematorium"],
    ["nearGarbageDump", "Near Garbage Dump"],
    ["nearNalla", "Near Nalla"],
    ["nearToRailTrack", "Near To Rail Track"],
    ["probableRoadExtension", "Probable Road Extension"],
    ["propertyAccessIssues", "Property Access Issues"],
    ["propertyIsLandLocked", "Property Is Land Locked"],
    ["slumArea", "Slum Area"],
    ["statutoryNoticesOnProperty", "Statutory Notices On Property"],
    ["underHighTensionLine", "Under High Tension Line"],
  ];

  return (
    <div className="pb-6">
      <h3 className="text-[22px] font-semibold text-[#9b0000] mb-10">
        Caution Area
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-5 max-w-[1250px]">
        {items.map(([field, label]) => (
          <Checkbox
            key={field}
            checked={form[field]}
            onChange={() => handleCheck(field)}
            className="text-[18px] text-black leading-7"
          >
            {label}
          </Checkbox>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-10 w-full">
        <Button
          onClick={handleSave}
          loading={saving}
          className="h-[38px] px-6 text-sm font-medium rounded-[4px] border-[#003b70] text-[#003b70] w-full sm:w-auto"
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
          className="h-[38px] px-6 text-sm font-medium rounded-[4px] bg-[#003b70] hover:bg-[#003b70] text-white w-full sm:w-auto"
        >
          Save & Next
        </Button>
      </div>
    </div>
  );
};

export default CautionAreaForm;
