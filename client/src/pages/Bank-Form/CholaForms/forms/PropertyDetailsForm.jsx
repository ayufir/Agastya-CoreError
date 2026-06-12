import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const PropertyDetailsForm = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    authorityLimit: "MUNICIPAL CORPORATION",
    approvingAuthority: "NAGAR NIGAM",
    basementApplicable: "",
    occupiedBy: "",
    sellerName: "SYNTHAPITAL TYAGI WO HR DE DEEPAK",
    personMustAtSite: "",
    approachRoad: "20 FT WBM ROAD",
    liftBackground: "",
    residualAge: "57",
    propertyAge: "3",
    refinanceAge: "36",
    latestSaleDeedRegistrationDate: "",
    levelType: "RESIDENTIAL",
    propertyUnitType: "G+ RESI HOUSE",
    isReraApproved: "",
    structureType: "STANDALONE",
    briefOnConditions: "G+ RESI HOUSE",
    propertyUsage: "",
    // New simplified amenity fields
    propertyDistance1: "",
    propertyName1: "",
    propertyDistance2: "1-3 KM",
    propertyName2: "BUS STOP",
    propertyDistance3: "",
    propertyName3: "",
    propertyDistance4: "3-5 KM",
    propertyName4: "CHITRANSH PUBLIC HR. SEC SCHOOL",
    propertyDistance5: "> 5 KM",
    propertyName5: "BHOPAL JN",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        authorityLimit: isEdit.authorityLimit || "",
        approvingAuthority: isEdit.approvingAuthority || "",
        basementApplicable: isEdit.basementApplicable || "",
        occupiedBy: isEdit.occupiedBy || "",
        sellerName: isEdit.sellerName || "",
        personMustAtSite: isEdit.personMustAtSite || "",
        approachRoad: isEdit.approachRoad || "",
        liftBackground: isEdit.liftBackground || "",
        residualAge: isEdit.residualAge || "",
        propertyAge: isEdit.propertyAge || "",
        refinanceAge: isEdit.refinanceAge || "",
        latestSaleDeedRegistrationDate:
          isEdit.latestSaleDeedRegistrationDate || "",
        levelType: isEdit.levelType || "",
        propertyUnitType: isEdit.propertyUnitType || "",
        isReraApproved: isEdit.isReraApproved || "",
        structureType: isEdit.structureType || "",
        briefOnConditions: isEdit.briefOnConditions || "",
        propertyUsage: isEdit.propertyUsage || "",
        // NisEdit.authorityLimit || "",
        propertyDistance1: isEdit.propertyDistance1 || "",
        propertyName1: isEdit.propertyName1 || "",
        propertyDistance2: isEdit.propertyDistance2 || "",
        propertyName2: isEdit.propertyName2 || "",
        propertyDistance3: isEdit.propertyDistance3 || "",
        propertyName3: isEdit.propertyName3 || "",
        propertyDistance4: isEdit.propertyDistance4 || "",
        propertyName4: isEdit.propertyName4 || "",
        propertyDistance5: isEdit.propertyDistance5 || "",
        propertyName5: isEdit.propertyName5 || "",
      });
    }
  }, [isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Submitted Data:", formData);
    onNext(formData);
    setFormData("");
    toast.success("saved successfully");
  };

  return (
    <div className='max-w-7xl mx-auto my-4 px-4'>
      <div
        className='bg-gray-800 text-white p-4 rounded cursor-pointer flex justify-between items-center'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-lg font-semibold'>Conditions</h4>
        <div className='flex justify-between items-center text-white'>
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
        <div className='border rounded p-3 mt-2 bg-white'>
          <form onSubmit={handleSubmit}>
            {/* Authority Section */}
            <div className='mb-4'>
              <h5 className='font-bold'>Authority Details *</h5>
              <div className='flex flex-wrap -mx-2'>
                <div className='w-full md:w-1/3 px-2 mb-3'>
                  <label className='block font-bold'>Authority Limit</label>
                  <input
                    type='text'
                    name='authorityLimit'
                    value={formData.authorityLimit}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                    placeholder='MUNICIPAL CORPORATION'
                  />
                </div>
                <div className='w-full md:w-1/3 px-2 mb-3'>
                  <label className='block font-bold'>Approving Authority</label>
                  <input
                    type='text'
                    name='approvingAuthority'
                    value={formData.approvingAuthority}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                    placeholder='NAGAR NIGAM'
                  />
                </div>
                <div className='w-full md:w-1/3 px-2 mb-3'>
                  <label className='block font-bold'>Basement Applicable</label>
                  <div className='flex gap-2'>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='basementApplicable'
                        value='YES'
                        checked={formData.basementApplicable === "YES"}
                        onChange={handleChange}
                        className='mr-1'
                      />
                      <label>YES</label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='basementApplicable'
                        value='NO'
                        checked={formData.basementApplicable === "NO"}
                        onChange={handleChange}
                        className='mr-1'
                      />
                      <label>NO</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Occupied By Section */}
            <div className='mb-4'>
              <h5 className='font-bold'>Occupied by</h5>
              <div className='flex flex-wrap gap-4'>
                <div>
                  <div className='flex items-center'>
                    <input
                      type='radio'
                      name='occupiedBy'
                      value='TENANT'
                      checked={formData.occupiedBy === "TENANT"}
                      onChange={handleChange}
                      className='mr-1'
                    />
                    <label>TENANT</label>
                  </div>
                  <div className='flex items-center ml-3'>
                    <input
                      type='radio'
                      name='occupiedBy'
                      value='SELLER_OCCUPIED'
                      checked={formData.occupiedBy === "SELLER_OCCUPIED"}
                      onChange={handleChange}
                      className='mr-1'
                    />
                    <label>SELF-OCCUPIED</label>
                  </div>
                  <div className='flex items-center ml-3'>
                    <input
                      type='radio'
                      name='occupiedBy'
                      value='VACANT'
                      checked={formData.occupiedBy === "VACANT"}
                      onChange={handleChange}
                      className='mr-1'
                    />
                    <label>VACANT</label>
                  </div>
                </div>
                <div>
                  <div className='flex items-center'>
                    <input
                      type='radio'
                      name='occupiedBy'
                      value='NA'
                      checked={formData.occupiedBy === "NA"}
                      onChange={handleChange}
                      className='mr-1'
                    />
                    <label>NA</label>
                  </div>
                  <div className='flex items-center ml-3'>
                    <input
                      type='radio'
                      name='occupiedBy'
                      value='SELLER_TENANT'
                      checked={formData.occupiedBy === "SELLER_TENANT"}
                      onChange={handleChange}
                      className='mr-1'
                    />
                    <label>SELF + TENANT</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Details */}
            <div className='mb-4'>
              <div className='flex flex-wrap -mx-2'>
                <div className='w-full md:w-1/2 px-2 mb-3'>
                  <label className='block font-bold'>
                    Seller Name/Owner Name *
                  </label>
                  <input
                    type='text'
                    name='sellerName'
                    value={formData.sellerName}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                    placeholder='SYNTHAPITAL TYAGI WO HR DE DEEPAK'
                  />
                </div>
                <div className='w-full md:w-1/2 px-2 mb-3'>
                  <label className='block font-bold'>
                    Person must at Site *
                  </label>
                  <div className='flex gap-3'>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='personMustAtSite'
                        value='YES'
                        checked={formData.personMustAtSite === "YES"}
                        onChange={handleChange}
                        className='mr-1'
                      />
                      <label>YES</label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='personMustAtSite'
                        value='NO'
                        checked={formData.personMustAtSite === "NO"}
                        onChange={handleChange}
                        className='mr-1'
                      />
                      <label>NO</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-wrap -mx-2'>
                <div className='w-full md:w-1/2 px-2 mb-3'>
                  <label className='block font-bold'>
                    Conditions to Approach Route *
                  </label>
                  <input
                    type='text'
                    name='approachRoad'
                    value={formData.approachRoad}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                    placeholder='20 FT WBM ROAD'
                  />
                </div>
                <div className='w-full md:w-1/2 px-2 mb-3'>
                  <label className='block font-bold'>Lift/Background *</label>
                  <div className='flex gap-3'>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='liftBackground'
                        value='YES'
                        checked={formData.liftBackground === "YES"}
                        onChange={handleChange}
                        className='mr-1'
                      />
                      <label>YES</label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='liftBackground'
                        value='NO'
                        checked={formData.liftBackground === "NO"}
                        onChange={handleChange}
                        className='mr-1'
                      />
                      <label>NO</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Age Section */}
            <div className='mb-4'>
              <div className='flex flex-wrap -mx-2'>
                <div className='w-full md:w-1/4 px-2 mb-3'>
                  <label className='block font-bold'>
                    Residual Age of the Property *
                  </label>
                  <input
                    type='number'
                    name='residualAge'
                    value={formData.residualAge}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                    placeholder='57'
                  />
                </div>
                <div className='w-full md:w-1/4 px-2 mb-3'>
                  <label className='block font-bold'>
                    Age of the Property *
                  </label>
                  <input
                    type='number'
                    name='propertyAge'
                    value={formData.propertyAge}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                    placeholder='3'
                  />
                </div>
                <div className='w-full md:w-1/4 px-2 mb-3'>
                  <label className='block font-bold'>
                    Age of Refinance Property
                  </label>
                  <input
                    type='number'
                    name='refinanceAge'
                    value={formData.refinanceAge}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                    placeholder='36'
                  />
                </div>
                <div className='w-full md:w-1/4 px-2 mb-3'>
                  <label className='block font-bold'>
                    Latest Sale Deed Registration Date
                  </label>
                  <input
                    type='text'
                    name='latestSaleDeedRegistrationDate'
                    value={formData.latestSaleDeedRegistrationDate}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                    placeholder=''
                  />
                </div>
              </div>
            </div>

            {/* Property Type Section */}
            <div className='mb-4'>
              <div className='flex flex-wrap -mx-2'>
                <div className='w-full md:w-1/4 px-2 mb-3'>
                  <label className='block font-bold'>Level Type *</label>
                  <input
                    type='text'
                    name='levelType'
                    value={formData.levelType}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                    placeholder='RESIDENTIAL'
                  />
                </div>
                <div className='w-full md:w-1/4 px-2 mb-3'>
                  <label className='block font-bold'>
                    Property / Omitting unit type
                  </label>
                  <input
                    type='text'
                    name='propertyUnitType'
                    value={formData.propertyUnitType}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                    placeholder='G+ RESI HOUSE'
                  />
                </div>
                <div className='w-full md:w-1/4 px-2 mb-3'>
                  <label className='block font-bold'>Structure Type *</label>
                  <select
                    name='structureType'
                    value={formData.structureType}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                  >
                    <option value=''>Select</option>
                    <option value='STANDALONE'>STANDALONE</option>
                    <option value='MULTISTOREY'>MULTISTOREY</option>
                  </select>
                </div>
                <div className='w-full md:w-1/4 px-2 mb-3'>
                  <label className='block font-bold'>
                    Is Property RERA Approved *
                  </label>
                  <div className='flex gap-3'>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='isReraApproved'
                        value='YES'
                        checked={formData.isReraApproved === "YES"}
                        onChange={handleChange}
                        className='mr-1'
                      />
                      <label>YES</label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='radio'
                        name='isReraApproved'
                        value='NO'
                        checked={formData.isReraApproved === "NO"}
                        onChange={handleChange}
                        className='mr-1'
                      />
                      <label>NO</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brief on Conditions */}
            <div className='mb-4'>
              <div className='flex flex-wrap -mx-2'>
                <div className='w-full md:w-1/2 px-2 mb-3'>
                  <label className='block font-bold'>Brief On Conditions</label>
                  <input
                    type='text'
                    name='briefOnConditions'
                    value={formData.briefOnConditions}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                    placeholder='G+ RESI HOUSE'
                  />
                </div>
                <div className='w-full md:w-1/2 px-2 mb-3'>
                  <label className='block font-bold'>Usage of Property *</label>
                  <select
                    name='propertyUsage'
                    value={formData.propertyUsage}
                    onChange={handleChange}
                    className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                  >
                    <option value=''>Select</option>
                    <option value='RESIDENTIAL'>RESIDENTIAL</option>
                    <option value='COMMERCIAL'>COMMERCIAL</option>
                    <option value='MIXED_USAGE'>MIXED USAGE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Amenities Table */}
            <div className='mb-4'>
              <h5 className='font-bold mb-3'>SURROUNDING EXTERNAL AMENITIES</h5>
              {Array.from({ length: 5 }, (_, i) => {
                const index = i + 1;
                return (
                  <div key={index} className='flex flex-wrap -mx-2 mb-3'>
                    <div className='w-full md:w-1/2 px-2'>
                      <label className='block font-bold'>
                        Name of Premises {index}
                      </label>
                      <input
                        type='text'
                        name={`propertyName${index}`}
                        value={formData[`propertyName${index}`]}
                        onChange={handleChange}
                        className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                        placeholder='e.g., BUS STOP'
                      />
                    </div>
                    <div className='w-full md:w-1/2 px-2'>
                      <label className='block font-bold'>
                        Approx. Distance from Property {index}
                      </label>
                      <input
                        type='text'
                        name={`propertyDistance${index}`}
                        value={formData[`propertyDistance${index}`]}
                        onChange={handleChange}
                        className='w-full border-0 border-b focus:outline-none focus:border-blue-500'
                        placeholder='e.g., 1-3 KM'
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className='flex justify-end'>
              <button
                style={{ background: "#30384B" }}
                type='submit'
                className='text-white px-4 py-2 rounded'
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsForm;
