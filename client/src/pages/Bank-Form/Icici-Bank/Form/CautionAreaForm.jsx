import React, { useState, useEffect } from "react";
import { Card, Checkbox, Button } from "antd";
import { ChevronDown, ChevronUp } from "lucide-react";

const CautionAreaForm = ({ input = {}, onChange, onNext, isEdit }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    anyChemicalHazard: false,
    nearCrematorium: false,
    probableRoadExtension: false,
    statutoryNoticesOnProperty: false,
    communityDominated: false,
    nearGarbageDump: false,
    propertyAccessIssues: false,
    underHighTensionLine: false,
    floodProne: false,
    nearNalla: false,
    propertyIsLandLocked: false,
    landReservation: false,
    nearToRailTrack: false,
    slumArea: false,
    ...input, // Pre-fill from parent
  });

  useEffect(() => {
    if (isEdit) {
      setFormData(isEdit);
    }
  }, [isEdit]);

  // Update parent whenever local state changes
  useEffect(() => {
    onChange && onChange(formData);
  }, [formData]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const cautionFields = [
    { name: "anyChemicalHazard", label: "Any Chemical Hazard" },
    { name: "nearCrematorium", label: "Near Crematorium" },
    { name: "probableRoadExtension", label: "Probable Road Extension" },
    {
      name: "statutoryNoticesOnProperty",
      label: "Statutory Notices On Property",
    },
    { name: "communityDominated", label: "Community Dominated" },
    { name: "nearGarbageDump", label: "Near Garbage Dump" },
    { name: "propertyAccessIssues", label: "Property Access Issues" },
    { name: "underHighTensionLine", label: "Under High Tension Line" },
    { name: "floodProne", label: "Flood Prone" },
    { name: "nearNalla", label: "Near Nalla" },
    { name: "propertyIsLandLocked", label: "Property Is Land Locked" },
    { name: "landReservation", label: "Land Reservation" },
    { name: "nearToRailTrack", label: "Near To Rail Track" },
    { name: "slumArea", label: "Slum Area" },
  ];

  return (
    <div className="mt-4">
      <Card
        className="rounded-2xl shadow border"
        bodyStyle={{ padding: isOpen ? "1rem" : "0" }}
        title={
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="font-semibold text-white">Caution Area</span>
            {isOpen ? (
              <ChevronUp className="text-white" size={20} />
            ) : (
              <ChevronDown className="text-white" size={20} />
            )}
          </div>
        }
        style={{ backgroundColor: "#98291E" }}
      >
        {isOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onNext && onNext();
            }}
            className="bg-white p-4 rounded-xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {cautionFields.map((item, idx) => (
                <Checkbox
                  key={idx}
                  name={item.name}
                  checked={formData[item.name]}
                  onChange={handleCheckboxChange}
                >
                  {item.label}
                </Checkbox>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#98291E] hover:bg-[#7a1f17]"
              >
                Next
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default CautionAreaForm;
