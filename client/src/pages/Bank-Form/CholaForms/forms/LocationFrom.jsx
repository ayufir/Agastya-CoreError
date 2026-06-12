import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LocationForm = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    propertyOwner: "",
    surveyNo: "",
    suffixName: "",
    suffixContactNo: "",
    doorNo: "",
    projectName: "",
    colonyStreetLocality: "",
    landmark: "",
    pincode: "",
    city: "",
    district: "",
    villageBoundariesMatching: "",
    village: "",
    taluk: "",
    propertyWithin: "",
    boundariesMatching: "",
    saleInLast3Years: "",
    addressLine1: "",
    addressLine2: "",
    latitude: "",
    longitude: "",
    distanceFromCity: "",
    nearestBranch: "",
    eastBoundaryOC: "",
    southBoundaryOC: "",
    westBoundaryOC: "",
    northBoundaryOC: "",
    eastBoundaryActual: "",
    southBoundaryActual: "",
    westBoundaryActual: "",
    northBoundaryActual: "",
    eastDimensionOC: "",
    southDimensionOC: "",
    westDimensionOC: "",
    northDimensionOC: "",
    eastDimensionActual: "",
    southDimensionActual: "",
    westDimensionActual: "",
    northDimensionActual: "",
  });

  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        propertyOwner: isEdit.propertyOwner || "",
        surveyNo: isEdit.surveyNo || "",
        suffixName: isEdit.suffixName || "",
        suffixContactNo: isEdit.suffixContactNo || "",
        doorNo: isEdit.doorNo || "",
        projectName: isEdit.projectName || "",
        colonyStreetLocality: isEdit.colonyStreetLocality || "",
        landmark: isEdit.landmark || "",
        pincode: isEdit.pincode || "",
        city: isEdit.city || "",
        district: isEdit.district || "",
        villageBoundariesMatching: isEdit.villageBoundariesMatching || "",
        village: isEdit.village || "",
        taluk: isEdit.taluk || "",
        propertyWithin: isEdit.propertyWithin || "",
        boundariesMatching: isEdit.boundariesMatching || "",
        saleInLast3Years: isEdit.saleInLast3Years || "",
        addressLine1: isEdit.addressLine1 || "",
        addressLine2: isEdit.addressLine2 || "",
        latitude: isEdit.latitude || "",
        longitude: isEdit.longitude || "",
        distanceFromCity: isEdit.distanceFromCity || "",
        nearestBranch: isEdit.nearestBranch || "",
        eastBoundaryOC: isEdit.eastBoundaryOC || "",
        southBoundaryOC: isEdit.southBoundaryOC || "",
        westBoundaryOC: isEdit.westBoundaryOC || "",
        northBoundaryOC: isEdit.northBoundaryOC || "",
        eastBoundaryActual: isEdit.eastBoundaryActual || "",
        southBoundaryActual: isEdit.southBoundaryActual || "",
        westBoundaryActual: isEdit.westBoundaryActual || "",
        northBoundaryActual: isEdit.northBoundaryActual || "",
        eastDimensionOC: isEdit.eastDimensionOC || "",
        southDimensionOC: isEdit.southDimensionOC || "",
        westDimensionOC: isEdit.westDimensionOC || "",
        northDimensionOC: isEdit.northDimensionOC || "",
        eastDimensionActual: isEdit.eastDimensionActual || "",
        southDimensionActual: isEdit.southDimensionActual || "",
        westDimensionActual: isEdit.westDimensionActual || "",
        northDimensionActual: isEdit.northDimensionActual || "",
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
    toast.success("saved successfully");
  };

  const handleToggle = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  return (
    <div className="max-w-7xl mx-auto my-4 px-4">
      <div
        className="bg-gray-800 text-white p-4 rounded cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-lg font-semibold">Location</h4>
        <div className="flex justify-between items-center text-white">
          <button
            type="button"
            className="bg-white text-gray-800 px-3 py-1 rounded text-sm"
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
        <div className="border rounded p-3 mt-2 bg-white">
          <form onSubmit={handleSubmit}>
            {/* Property Owner Section */}
            <div className="mb-4">
              <h5 className="mb-3 font-bold">PROPERTY DETAILS AS PER SITE</h5>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">
                    Property Owner / Seller Name *
                  </label>
                  <input
                    type="text"
                    name="propertyOwner"
                    value={formData.propertyOwner}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">Survey No *</label>
                  <input
                    type="text"
                    name="surveyNo"
                    value={formData.surveyNo}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">Suffix Name</label>
                  <input
                    type="text"
                    name="suffixName"
                    value={formData.suffixName}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">Suffix Contact No</label>
                  <input
                    type="text"
                    name="suffixContactNo"
                    value={formData.suffixContactNo}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="mb-4">
              <h5 className="mb-3 font-bold">ADDRESS AS PER SITE</h5>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">Door No / Plot No</label>
                  <input
                    type="text"
                    name="doorNo"
                    value={formData.doorNo}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">Project Name</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">
                    Colony / Street / Locality *
                  </label>
                  <input
                    type="text"
                    name="colonyStreetLocality"
                    value={formData.colonyStreetLocality}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/3 px-2 mb-3">
                  <label className="block font-bold">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/3 px-2 mb-3">
                  <label className="block font-bold">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/3 px-2 mb-3">
                  <label className="block font-bold">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/3 px-2 mb-3">
                  <label className="block font-bold">
                    Village Boundaries Matching
                  </label>
                  <input
                    type="text"
                    name="villageBoundariesMatching"
                    value={formData.villageBoundariesMatching}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/3 px-2 mb-3">
                  <label className="block font-bold">Village</label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/3 px-2 mb-3">
                  <label className="block font-bold">Taluk</label>
                  <input
                    type="text"
                    name="taluk"
                    value={formData.taluk}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* RURAL/URBAN and Boundaries Matching Section */}
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold mb-1">
                    Is this Property within?
                  </label>
                  <select
                    value={formData.propertyWithin}
                    onChange={(e) =>
                      handleToggle("propertyWithin", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select...</option>
                    <option value="RURAL">RURAL</option>
                    <option value="URBAN">URBAN</option>
                  </select>
                </div>
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">
                    Whether Boundaries Matching *
                  </label>
                  <select
                    className="border border-blue-500 p-2 rounded"
                    value={formData.boundariesMatching}
                    onChange={(e) =>
                      handleToggle("boundariesMatching", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">
                    Sale in this Property within 3 Years
                  </label>
                  <select
                    value={formData.saleInLast3Years}
                    onChange={(e) =>
                      handleToggle("saleInLast3Years", e.target.value)
                    }
                    className="px-4 py-2 border rounded"
                  >
                    <option value="">Select...</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address as per Document Section */}
            <div className="mb-4">
              <h5 className="mb-3 font-bold">ADDRESS AS PER DOCUMENT</h5>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">Address Line 1*</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">LATITUDE</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="flex-1 border-0 border-b focus:outline-none focus:border-blue-500"
                      placeholder="23.39k4u"
                    />
                    <button
                      className="ml-2 border border-gray-300 px-3 rounded"
                      type="button"
                    >
                      Capture
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">LONGITUDE</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="flex-1 border-0 border-b focus:outline-none focus:border-blue-500"
                      placeholder="77.38k5k6"
                    />
                    <button
                      className="ml-2 border border-gray-300 px-3 rounded"
                      type="button"
                    >
                      Capture
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">
                    Distance from City (km) *
                  </label>
                  <input
                    type="text"
                    name="distanceFromCity"
                    value={formData.distanceFromCity}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-3">
                  <label className="block font-bold">Nearest branch</label>
                  <input
                    type="text"
                    name="nearestBranch"
                    value={formData.nearestBranch}
                    onChange={handleChange}
                    className="w-full border-0 border-b focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Boundaries Section */}
            <div className="mb-4">
              <h5 className="mb-3 font-bold">Boundaries</h5>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2">
                  <h6 className="font-bold">Boundaries as per Document</h6>
                  <div className="space-y-2">
                    {[
                      "eastBoundaryOC",
                      "southBoundaryOC",
                      "westBoundaryOC",
                      "northBoundaryOC",
                    ].map((field, index) => (
                      <div key={field}>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100">
                            {["East", "South", "West", "North"][index]}
                          </span>
                          <input
                            type="text"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="flex-1 border-0 border-b focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-2">
                  <h6 className="font-bold">Boundaries as per Actual Site</h6>
                  <div className="space-y-2">
                    {[
                      "eastBoundaryActual",
                      "southBoundaryActual",
                      "westBoundaryActual",
                      "northBoundaryActual",
                    ].map((field, index) => (
                      <div key={field}>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100">
                            {["East", "South", "West", "North"][index]}
                          </span>
                          <input
                            type="text"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="flex-1 border-0 border-b focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dimensions Section */}
            <div className="mb-4">
              <h5 className="mb-3 font-bold">Dimensions of the site</h5>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2">
                  <h6 className="font-bold">Dimensions as per Document</h6>
                  <div className="space-y-2">
                    {[
                      "eastDimensionOC",
                      "southDimensionOC",
                      "westDimensionOC",
                      "northDimensionOC",
                    ].map((field, index) => (
                      <div key={field}>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100">
                            {["East", "South", "West", "North"][index]}
                          </span>
                          <input
                            type="text"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="flex-1 border-0 border-b focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-2">
                  <h6 className="font-bold">Dimensions as per Actual</h6>
                  <div className="space-y-2">
                    {[
                      "eastDimensionActual",
                      "southDimensionActual",
                      "westDimensionActual",
                      "northDimensionActual",
                    ].map((field, index) => (
                      <div key={field}>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100">
                            {["East", "South", "West", "North"][index]}
                          </span>
                          <input
                            type="text"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="flex-1 border-0 border-b focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                style={{ background: "#30384B" }}
                type="submit"
                className="text-white px-4 py-2 rounded"
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

export default LocationForm;
