import React, { useState, useEffect } from "react";

import toast from "react-hot-toast";

const Specifications = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [propertyData, setPropertyData] = useState({
    totalFloors: 2,
    noOfUnits: 1,
    totalMarketValue: 2580000,
    fsuFar: 2,
    achieved: 2,
    distress: 80,
    distressValue: 2064000,
    carpetArea: 980,
    carpetAreaInSqMtr: 89.283,
    areaType: [
      {
        type: "Land",
        plan: 600,
        site: 600,
        rate: 1500,
        valuationPlan: 800000,
        valuationMarket: 900000,
      },
      {
        type: "Ground floor",
        plan: 600,
        site: 600,
        rate: 1400,
        valuationPlan: 840000,
        valuationMarket: 840000,
      },
      {
        type: "Floor 1",
        plan: 600,
        site: 600,
        rate: 1400,
        valuationPlan: 840000,
        valuationMarket: 840000,
      },
    ],
    builtUpArea: 1200,
    guidelineValue: 474,
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setPropertyData({
        totalFloors: isEdit.totalFloors || "",
        noOfUnits: isEdit.noOfUnits || "",
        totalMarketValue: isEdit.totalMarketValue || "",
        fsuFar: isEdit.fsuFar || "",
        achieved: isEdit.achieved || "",
        distress: isEdit.distress || "",
        distressValue: isEdit.distressValue || "",
        carpetArea: isEdit.carpetArea || "",
        carpetAreaInSqMtr: isEdit.carpetAreaInSqMtr || "",
        areaType: [
          {
            type: "Land",
            plan: isEdit.plan || "",
            site: isEdit.site || "",
            rate: isEdit.rate || "",
            valuationPlan: isEdit.valuationPlan || "",
            valuationMarket: isEdit.valuationMarket || "",
          },
          {
            type: "Ground floor",
            plan: isEdit.plan || "",
            site: isEdit.site || "",
            rate: isEdit.rate || "",
            valuationPlan: isEdit.valuationPlan || "",
            valuationMarket: isEdit.valuationMarket || "",
          },
          {
            type: "Floor 1",
            plan: isEdit.plan || "",
            site: isEdit.site || "",
            rate: isEdit.rate || "",
            valuationPlan: isEdit.valuationPlan || "",
            valuationMarket: isEdit.valuationMarket || "",
          },
        ],
        builtUpArea: isEdit.builtUpArea || "",
        guidelineValue: isEdit.guidelineValue || "",
      });
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData({ ...propertyData, [name]: value });
  };

  const handleAreaTypeChange = (index, field, value) => {
    const updatedAreaType = [...propertyData.areaType];
    updatedAreaType[index] = { ...updatedAreaType[index], [field]: value };
    setPropertyData({ ...propertyData, areaType: updatedAreaType });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(propertyData);
    onNext(propertyData);

    toast.success("saved successfully");
  };

  return (
    <div className='max-w-7xl mx-auto my-4 px-4'>
      <div
        className='p-3 border rounded bg-gray-800 cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex justify-between items-center text-white'>
          <h4 className='m-0'>Specification</h4>
          <button
            type='button'
            className='bg-white text-gray-800 px-3 py-1 rounded text-sm'
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className='mt-4 p-4 border rounded bg-white text-black'>
          <div className='area-type'>
            <h5>Area Type</h5>
            <table className='table-auto w-full'>
              <thead>
                <tr>
                  <th className='px-2 py-1'>Area Type</th>
                  <th className='px-2 py-1'>As per Plan (In SqFt)</th>
                  <th className='px-2 py-1'>As per Site (In SqFt)</th>
                  <th className='px-2 py-1'>Rate Per Sq/Ft</th>
                  <th className='px-2 py-1'>Valuation as per Plan</th>
                  <th className='px-2 py-1'>
                    Valuation as per Site Market value
                  </th>
                </tr>
              </thead>
              <tbody>
                {propertyData.areaType.map((area, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type='text'
                        name='type'
                        value={area.type}
                        onChange={(e) =>
                          handleAreaTypeChange(index, "type", e.target.value)
                        }
                        className='form-input w-full'
                      />
                    </td>
                    <td>
                      <input
                        type='number'
                        name='plan'
                        value={area.plan}
                        onChange={(e) =>
                          handleAreaTypeChange(index, "plan", e.target.value)
                        }
                        className='form-input w-full'
                      />
                    </td>
                    <td>
                      <input
                        type='number'
                        name='site'
                        value={area.site}
                        onChange={(e) =>
                          handleAreaTypeChange(index, "site", e.target.value)
                        }
                        className='form-input w-full'
                      />
                    </td>
                    <td>
                      <input
                        type='number'
                        name='rate'
                        value={area.rate}
                        onChange={(e) =>
                          handleAreaTypeChange(index, "rate", e.target.value)
                        }
                        className='form-input w-full'
                      />
                    </td>
                    <td>
                      <input
                        type='number'
                        name='valuationPlan'
                        value={area.valuationPlan}
                        onChange={(e) =>
                          handleAreaTypeChange(
                            index,
                            "valuationPlan",
                            e.target.value
                          )
                        }
                        className='form-input w-full'
                      />
                    </td>
                    <td>
                      <input
                        type='number'
                        name='valuationMarket'
                        value={area.valuationMarket}
                        onChange={(e) =>
                          handleAreaTypeChange(
                            index,
                            "valuationMarket",
                            e.target.value
                          )
                        }
                        className='form-input w-full'
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan='6' className='text-right px-2 py-1'>
                    Built up Area: {propertyData.builtUpArea}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 mt-4'>
            <div>
              <label>Total No of Floors</label>
              <input
                type='number'
                name='totalFloors'
                value={propertyData.totalFloors}
                onChange={handleChange}
                className='form-input w-full'
              />
            </div>
            <div>
              <label>No.of Units</label>
              <input
                type='number'
                name='noOfUnits'
                value={propertyData.noOfUnits}
                onChange={handleChange}
                className='form-input w-full'
              />
            </div>
            <div>
              <label>Total Market Value</label>
              <input
                type='number'
                name='totalMarketValue'
                value={propertyData.totalMarketValue}
                onChange={handleChange}
                className='form-input w-full'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3'>
            <div>
              <label>FSU/FAR</label>
              <input
                type='number'
                name='fsuFar'
                value={propertyData.fsuFar}
                onChange={handleChange}
                className='form-input w-full'
              />
            </div>
            <div>
              <label>Achieved</label>
              <input
                type='number'
                name='achieved'
                value={propertyData.achieved}
                onChange={handleChange}
                className='form-input w-full'
              />
            </div>
          </div>

          <div className='mb-3'>
            <h5>AMENITIES</h5>
            <input
              type='text'
              name='amenity'
              value={propertyData.amenity}
              onChange={handleChange}
              placeholder='Amount 1'
              className='form-input w-full'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3'>
            <div>
              <label>Distressed Value (In %)</label>
              <input
                type='number'
                name='distress'
                value={propertyData.distress}
                onChange={handleChange}
                className='form-input w-full'
              />
            </div>
            <div>
              <label>Distress Value</label>
              <input
                type='number'
                name='distressValue'
                value={propertyData.distressValue}
                onChange={handleChange}
                className='form-input w-full'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3'>
            <div>
              <label>Carpet Area (sq feet)</label>
              <input
                type='number'
                name='carpetArea'
                value={propertyData.carpetArea}
                onChange={handleChange}
                className='form-input w-full'
              />
            </div>
            <div>
              <label>Carpet Area (sq meter)</label>
              <input
                type='number'
                name='carpetAreaInSqMtr'
                value={propertyData.carpetAreaInSqMtr}
                onChange={handleChange}
                className='form-input w-full'
              />
            </div>
          </div>

          <div className='mb-3'>
            <h5>RENTAL DETAILS</h5>
            <textarea
              placeholder='Gross Rent Received For Similar Properties In Locality'
              className='form-input w-full'
            ></textarea>
          </div>

          <div className='flex justify-end'>
            <button
              type='submit'
              onClick={handleSubmit}
              className='bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700'
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Specifications;
