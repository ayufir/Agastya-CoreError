import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const RemarksForm = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    connectionName: "",
    landRate: "",
    technicallyAcceptable: null,
    demolitionRisk: null,
    constructedAsPerLaw: null,
    lastBillDate: "",
    deviationObserved: null,
    natureOfDeviation: "",
    marketability: null,
    remarks: "",
    declaration: {
      inspectionDate: "08.04.2025",
      noInterest: false,
      informationCorrect: false,
    },
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        connectionName: isEdit.connectionName || "",
        landRate: isEdit.landRate || "",
        technicallyAcceptable: isEdit.technicallyAcceptable || "",
        demolitionRisk: isEdit.demolitionRisk || "",
        constructedAsPerLaw: isEdit.constructedAsPerLaw || "",
        lastBillDate: isEdit.lastBillDate || "",
        deviationObserved: isEdit.deviationObserved || "",
        natureOfDeviation: isEdit.natureOfDeviation || "",
        marketability: isEdit.marketability || "",
        remarks: isEdit.remarks || "",
        declaration: {
          inspectionDate: isEdit.inspectionDate || "",
          noInterest: isEdit.noInterest || "",
          informationCorrect: isEdit.informationCorrect || "",
        },
      });
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in formData.declaration) {
      setFormData((prev) => ({
        ...prev,
        declaration: {
          ...prev.declaration,
          [name]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleOptionSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
    setFormData("");
    toast.success("saved successfully");
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header with toggle */}
      <div
        className="p-4 rounded bg-gray-800 text-white cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-semibold">ELECTRICITY DETAILS</h4>
        <button
          type="button"
          className="bg-white text-black text-sm px-2 py-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="border p-4 mt-2 rounded shadow bg-white space-y-4"
        >
          {/* Connection Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Connection in the name of
            </label>
            <input
              type="text"
              name="connectionName"
              value={formData.connectionName}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Land Rate */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Land Rate in Last 3 Months
            </label>
            <input
              type="text"
              name="landRate"
              value={formData.landRate}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Technically Acceptable */}
          <div>
            <label className="block text-sm font-medium mb-1">
              TECHNICALLY ACCEPTABLE?
            </label>
            <div className="flex gap-2">
              <select
                value={formData.technicallyAcceptable}
                onChange={(e) =>
                  handleOptionSelect("technicallyAcceptable", e.target.value)
                }
                className="border px-4 py-2 rounded"
              >
                <option value={null}>Select</option>
                {["YES", "NO"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Demolition Risk */}
          <div>
            <label className="block text-sm font-medium mb-1">
              DEMOLITION RISK?
            </label>
            <select
              value={formData.demolitionRisk || ""}
              onChange={(e) =>
                handleOptionSelect("demolitionRisk", e.target.value)
              }
              className="px-4 py-2 border rounded"
            >
              <option value="">Select an option</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>

          {/* Constructed As Per Law */}
          <div>
            <label className="block text-sm font-medium mb-1">
              CONSTRUCTED AS PER LAW?
            </label>
            <div className="flex gap-2">
              <select
                value={formData.constructedAsPerLaw || ""}
                onChange={(e) =>
                  handleOptionSelect("constructedAsPerLaw", e.target.value)
                }
                className="px-4 py-2 rounded border"
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
          </div>

          {/* Last Bill Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Last Bill Date
            </label>
            <input
              type="date"
              name="lastBillDate"
              value={formData.lastBillDate}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Deviation Observed */}
          <div>
            <label className="block text-sm font-medium mb-1">
              DEVIATION OBSERVED?
            </label>
            <select
              value={formData.deviationObserved || ""}
              onChange={(e) =>
                handleOptionSelect("deviationObserved", e.target.value)
              }
              className="px-4 py-2 rounded border"
            >
              <option value="" disabled>
                Select an option
              </option>
              {["YES", "NO"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Nature of Deviation */}
          {formData.deviationObserved === "YES" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Nature of Deviation
              </label>
              <input
                type="text"
                name="natureOfDeviation"
                value={formData.natureOfDeviation}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          )}

          {/* Marketability */}
          <div>
            <label className="block text-sm font-medium mb-1">
              MARKETABILITY?
            </label>
            <select
              value={formData.marketability}
              onChange={(e) =>
                handleOptionSelect("marketability", e.target.value)
              }
              className="px-4 py-2 rounded border"
            >
              <option value={null}>Select...</option>
              {["YES", "NO"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Remarks on Property
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows="4"
            />
          </div>

          {/* Declaration */}
          <div>
            <h5 className="text-lg font-semibold">DECLARATION</h5>
            <p className="text-sm">I/We hereby Confirm and declare that:</p>
            <div className="flex flex-col gap-2 mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="noInterest"
                  checked={formData?.declaration?.noInterest}
                  onChange={handleChange}
                  className="mr-2"
                />
                No personal interest in the property
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="informationCorrect"
                  checked={formData?.declaration?.informationCorrect}
                  onChange={handleChange}
                  className="mr-2"
                />
                All information provided is correct
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default RemarksForm;
