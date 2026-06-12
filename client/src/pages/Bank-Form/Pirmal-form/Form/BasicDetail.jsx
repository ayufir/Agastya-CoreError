import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ImageUploader from "../../../../components/ImageUploader";
import { useSelector } from "react-redux";

const BasicDetail = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(true);

  const [locationLoaded, setLocationLoaded] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const [images, setImages] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const [formData, setFormData] = useState({
    applicantName: "",
    propertyCategory: "",
    propertySubCategory: "",
    greenHousing: "",
    certificationType: "",
    address: "",
    flatNo: "",
    floorWing: "",
    buildingName: "",
    khasraNumber: "",
    streetName: "",
    landmark: "",
    village: "",
    city: "",
    district: "",
    pincode: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
    addressMatching: "",
  });

  useEffect(() => {
    if (user.role === "FieldOfficer") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          }));
          setLocationLoaded(true); // ✅ Mark as done
        },
        (error) => {
          toast.error("Location access denied or unavailable.");
          console.error(error);
          setLocationLoaded(true); // Still allow isEdit to populate
        }
      );
    } else {
      setLocationLoaded(true); // Not FieldOfficer, no location needed
    }
  }, [user.role]);

  useEffect(() => {
    setFormData((prev) => {
      let newData = { ...prev };

      if (isEdit && locationLoaded) {
        newData = {
          ...newData,
          ...isEdit,
          latitude: isEdit.latitude || newData.latitude,
          longitude: isEdit.longitude || newData.longitude,
        };

        if (isEdit.imageUrls && Array.isArray(isEdit.imageUrls)) {
          const fileListFromServer = isEdit.imageUrls.map((url, index) => ({
            uid: `server-${index}`,
            name: url.split("/").pop(),
            status: "done",
            url,
          }));
          setImages(fileListFromServer);
          setUploadedUrls(isEdit.imageUrls);
        }
      }

      if (extractedData && Object.keys(extractedData).length > 0) {
        const p = extractedData.property || {};
        const addr = p.address || {};
        const loc = p.location_details || {};
        const accom = p.accommodation_details || {};

        newData = {
          ...newData,
          applicantName: p.applicant_name || p.owner_name || extractedData.applicantName || newData.applicantName,
          propertyCategory: p.property_type || extractedData.propertyCategory || newData.propertyCategory,
          propertySubCategory: p.property_sub_type || accom.type_of_structure || extractedData.propertySubCategory || newData.propertySubCategory,
          address: addr.full_address || extractedData.address || newData.address,
          flatNo: addr.flat_no || addr.house_no || extractedData.flatNo || newData.flatNo,
          floorWing: addr.floor_no || accom.flat_configuration || extractedData.floorWing || newData.floorWing,
          buildingName: addr.building_name || addr.project_name || extractedData.buildingName || newData.buildingName,
          khasraNumber: p.survey_no || p.khasra_no || extractedData.khasraNumber || newData.khasraNumber,
          streetName: addr.street_name || addr.colony || extractedData.streetName || newData.streetName,
          landmark: loc.landmark || extractedData.landmark || newData.landmark,
          village: addr.village || addr.locality || extractedData.village || newData.village,
          city: addr.city || addr.taluka || extractedData.city || newData.city,
          district: addr.district || extractedData.district || newData.district,
          pincode: addr.pincode || extractedData.pincode || newData.pincode,
          state: addr.state || extractedData.state || newData.state,
          country: addr.country || extractedData.country || newData.country,
          latitude: addr.latitude || extractedData.latitude || newData.latitude,
          longitude: addr.longitude || extractedData.longitude || newData.longitude,
        };
      }

      return newData;
    });
  }, [isEdit, locationLoaded, extractedData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.role === "FieldOfficer" && uploadedUrls.length === 0) {
      toast.error("Please upload images before submitting");
      return;
    }

    const fullData = {
      ...formData,
      imageUrls: uploadedUrls,
    };

    // console.log(fullData, "fullData");

    onNext(fullData);

    setFormData({
      applicantName: "",
      propertyCategory: "",
      propertySubCategory: "",
      greenHousing: "",
      certificationType: "",
      address: "",
      flatNo: "",
      floorWing: "",
      buildingName: "",
      khasraNumber: "",
      streetName: "",
      landmark: "",
      village: "",
      city: "",
      district: "",
      pincode: "",
      state: "",
      country: "",
      latitude: "",
      longitude: "",
      addressMatching: "",
    });
    toast.success("saved successfully!");
  };

  return (
    <div className=' mx-auto mt-2 px-4 '>
      {/* Header + Edit Button */}
      <div
        className='flex justify-between items-center text-white p-3 rounded-md cursor-pointer bg-[#365069]'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='m-0 text-lg font-semibold'>Address Form</h4>
        <button className='px-3 py-1 bg-white text-[#365069] rounded text-sm font-medium hover:bg-gray-100'>
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {/* Form Accordion */}
      <div className={`mt-3 ${isOpen ? "" : "hidden"}`}>
        <div className='bg-white rounded-md shadow-sm'>
          <div className='p-4'>
            <form onSubmit={handleSubmit}>
              {[
                {
                  label: "Applicant's Name / Owner Name",
                  name: "applicantName",
                },
                { label: "Property Category", name: "propertyCategory" },
                { label: "Property Sub-Category", name: "propertySubCategory" },
                {
                  label: "Type and Level of Certification",
                  name: "certificationType",
                },
                { label: "Address as per Provided Documents", name: "address" },
                { label: "Flat No/Block No/Shop No", name: "flatNo" },
                { label: "Floor Number & Wing Name", name: "floorWing" },
                { label: "Building/House/Shop Name", name: "buildingName" },
                { label: "CTS/Survey/Khasra Number", name: "khasraNumber" },
                { label: "Street Name", name: "streetName" },
                { label: "Landmark", name: "landmark" },
                { label: "Village/Location", name: "village" },
                { label: "City/Taluka/Town", name: "city" },
                { label: "District", name: "district" },
                { label: "Pincode", name: "pincode" },
                { label: "State", name: "state" },
                { label: "Country", name: "country" },
              ].map((field, index) => (
                <div className='mb-4' key={index}>
                  <label className='block text-sm font-semibold mb-1'>
                    {field.label}:
                  </label>
                  <input
                    type='text'
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#365069]'
                    placeholder={`Enter ${field.label}`}
                  />
                </div>
              ))}

              {/* Yes/No Select Dropdown for "If Green Housing" */}
              <div className='mb-4'>
                <label className='block text-sm font-semibold mb-1'>
                  If Green Housing:
                </label>
                <select
                  name='greenHousing'
                  value={formData.greenHousing}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#365069]'
                >
                  <option value=''>Select</option>
                  <option value='Yes'>Yes</option>
                  <option value='No'>No</option>
                </select>
              </div>

              {/* Yes/No Select Dropdown for "Address Matching" */}
              <div className='mb-4'>
                <label className='block text-sm font-semibold mb-1'>
                  Address Matching:
                </label>
                <select
                  name='addressMatching'
                  value={formData.addressMatching}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#365069]'
                >
                  <option value=''>Select</option>
                  <option value='Yes'>Yes</option>
                  <option value='No'>No</option>
                </select>
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-semibold mb-1'>
                  Latitude:
                </label>
                <input
                  type='text'
                  name='latitude'
                  value={formData.latitude}
                  readOnly
                  className='w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed'
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-semibold mb-1'>
                  Longitude:
                </label>
                <input
                  type='text'
                  name='longitude'
                  value={formData.longitude}
                  readOnly
                  className='w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed'
                />
              </div>

              <div className='col-span-1'>
                {/* <ImageUploader images={images} setImages={setImages} /> */}
                <ImageUploader
                  images={images}
                  setImages={setImages}
                  setUploadedUrls={setUploadedUrls}
                  uploadedUrls={uploadedUrls}
                />
              </div>

              <button
                type='submit'
                className='px-4 my-2 py-2 bg-[#365069] text-white font-bold rounded-md hover:bg-[#2a4058]'
              >
                Next
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetail;
