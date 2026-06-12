import React, { useState, useEffect } from "react";
// import React, { useState } from "react";
import { Input, Card, Button, Radio } from "antd";
import { ChevronDown, ChevronUp } from "lucide-react";

const ValuationForm = ({ onNext, isEdit }) => {
  const [isEditOpen, setIsEditOpen] = useState(true);
  const [valuationMethodology, setValuationMethodology] =
    useState("saleComparison");

  const [formData, setFormData] = useState({
    landData: {
      area: 1275,
      ratePerSqFt: 0,
      amount: 0,
    },
    unitValueData: [
      {
        floorDescription: "",
        shortCode: "",
        carpetAreaSqFt: 0,
        saleableAreaSqFt: 0,
        ratePerSqFt: 0,
        amount: 0,
      },
    ],
    totalAppraisedValue: 0,
    roundOffTotal: 0,
    governmentRatesData: {
      landRate: 0,
      landArea: 0,
      landAmount: 0,
      constructionRate: 0,
      constructionArea: 0,
      constructionAmount: 0,
    },
    constructionDetails: {
      constructionAreaSqFt: 0,
      approvedCoverageSqFt: 0,
      costOfConstruction: 0,
    },
  });

  useEffect(() => {
    if (isEdit) {
      setFormData(isEdit);
    }
  }, [isEdit]);

  const handleLandChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      landData: { ...prev.landData, [name]: value },
    }));
  };

  const handleUnitValueChange = (index, e) => {
    const { name, value } = e.target;
    const updatedUnitValueData = [...formData.unitValueData];
    updatedUnitValueData[index] = {
      ...updatedUnitValueData[index],
      [name]: value,
    };
    setFormData((prev) => ({
      ...prev,
      unitValueData: updatedUnitValueData,
    }));
  };

  const handleGovRatesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      governmentRatesData: { ...prev.governmentRatesData, [name]: value },
    }));
  };

  const handleConstructionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      constructionDetails: { ...prev.constructionDetails, [name]: value },
    }));
  };

  const handleValuationMethodologyChange = (e) => {
    setValuationMethodology(e.target.value);
    setFormData((prev) => ({
      ...prev,
      valuationMethodology: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({
      ...formData,
      valuationMethodology,
    });
  };
  const toggleEdit = () => {
    setIsEditOpen(!isEditOpen);
  };

  return (
    <div className="w-full ">
      {/* Toggle Header */}
      <div
        className="p-3 border rounded cursor-pointer"
        style={{ backgroundColor: "#98291E" }}
        onClick={toggleEdit}
      >
        <div className="flex justify-between items-center text-white">
          <h4 className="m-0 text-lg font-semibold">Valuation Report</h4>
          <button
            type="button"
            className="bg-white text-gray-800 px-3 py-1 rounded text-sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleEdit();
            }}
          >
            {isEditOpen ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      {/* Collapsible Form */}
      {isEditOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="mb-4">
            <label className="block font-bold mb-2">
              Valuation Methodology
            </label>
            <select
              className="w-full p-2 border rounded"
              value={valuationMethodology}
              onChange={handleValuationMethodologyChange}
            >
              <option value="saleComparison">Sale Comparison</option>
              <option value="incomeApproach">Income Approach</option>
              <option value="costApproach">Cost Approach</option>
            </select>
          </div>

          <Card title="Land/Existing Structure Value" className="w-full">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Area (Sq.Ft)</th>
                    <th className="border p-2">Rate Per Sq.Ft (₹)</th>
                    <th className="border p-2">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Plot Area (Sq.Ft)</td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={formData?.landData?.area}
                        onChange={handleLandChange}
                        name="area"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={formData?.landData?.ratePerSqFt}
                        onChange={handleLandChange}
                        name="ratePerSqFt"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={formData?.landData?.amount}
                        onChange={handleLandChange}
                        name="amount"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Unit Value Data" className="w-full">
            {formData?.unitValueData?.map((unit, index) => (
              <div key={index} className="overflow-x-auto mb-4">
                <table className="w-full border-collapse border">
                  {console.log(unit, "UNIT")},
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Floor Description</th>
                      <th className="border p-2">Short Code</th>
                      <th className="border p-2">Carpet Area (Sq.Ft)</th>
                      <th className="border p-2">Saleable Area (Sq.Ft)</th>
                      <th className="border p-2">Rate Per Sq.Ft (₹)</th>
                      <th className="border p-2">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border rounded"
                          value={unit?.floorDescription}
                          onChange={(e) => handleUnitValueChange(index, e)}
                          name="floorDescription"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border rounded"
                          value={unit.shortCode}
                          onChange={(e) => handleUnitValueChange(index, e)}
                          name="shortCode"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          className="w-full p-1 border rounded"
                          value={unit.carpetAreaSqFt}
                          onChange={(e) => handleUnitValueChange(index, e)}
                          name="carpetAreaSqFt"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          className="w-full p-1 border rounded"
                          value={unit.saleableAreaSqFt}
                          onChange={(e) => handleUnitValueChange(index, e)}
                          name="saleableAreaSqFt"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          className="w-full p-1 border rounded"
                          value={unit.ratePerSqFt}
                          onChange={(e) => handleUnitValueChange(index, e)}
                          name="ratePerSqFt"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          className="w-full p-1 border rounded"
                          value={unit.amount}
                          onChange={(e) => handleUnitValueChange(index, e)}
                          name="amount"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </Card>

          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-1/2">
              <label className="font-medium">Total Appraised Value:</label>
              <Input
                type="number"
                value={formData.totalAppraisedValue}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    totalAppraisedValue: e.target.value,
                  }))
                }
                className="border-0 border-b w-full"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="font-medium">Round Off Total:</label>
              <Input
                type="number"
                value={formData.roundOffTotal}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    roundOffTotal: e.target.value,
                  }))
                }
                className="border-0 border-b w-full"
              />
            </div>
          </div>

          <Card title="Valuation As Per Government Rates" className="w-full">
            <div className="mb-4">
              <Radio.Group className="mb-4">
                <Radio value="commercial">Commercial</Radio>
                <Radio value="residential" defaultChecked>
                  Residential
                </Radio>
              </Radio.Group>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Description</th>
                      <th className="border p-2">Area (Sq.Ft)</th>
                      <th className="border p-2">Rate Per Sq.Ft (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Land/BU/SBU</td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={formData?.governmentRatesData?.landArea}
                          onChange={handleGovRatesChange}
                          name="landArea"
                          className="border-0 border-b w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={formData?.governmentRatesData?.landRate}
                          onChange={handleGovRatesChange}
                          name="landRate"
                          className="border-0 border-b w-full"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">Construction</td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={
                            formData?.governmentRatesData?.constructionArea
                          }
                          onChange={handleGovRatesChange}
                          name="constructionArea"
                          className="border-0 border-b w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={
                            formData?.governmentRatesData?.constructionRate
                          }
                          onChange={handleGovRatesChange}
                          name="constructionRate"
                          className="border-0 border-b w-full"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          <div className="mb-4">
            <label className="font-medium">Construction Details:</label>
            <Input
              type="number"
              value={formData?.constructionDetails?.costOfConstruction}
              onChange={handleConstructionChange}
              name="costOfConstruction"
              className="border-0 border-b w-full"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-red-800 hover:bg-red-700"
            >
              Save & Next
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ValuationForm;
