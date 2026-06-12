import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ImageUploader from "../../../../components/ImageUploader";
import { useNavigate, useParams } from "react-router-dom";

const BoundaryDetails = ({ isEdit, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImages, setUploadedImagess] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [images, setImages] = useState([]);
  const { id } = useParams();

  const [formData, setFormData] = useState({
    northAsPerDocs: "",
    southAsPerDocs: "",
    eastAsPerDocs: "",
    westAsPerDocs: "",
    northActual: "",
    southActual: "",
    eastActual: "",
    westActual: "",
    northBoundaryMatching: "",
    southBoundaryMatching: "",
    eastBoundaryMatching: "",
    westBoundaryMatching: "",
    northRemarks: "",
    southRemarks: "",
    eastRemarks: "",
    westRemarks: "",
    additionalRemarks: `1. GIVEN XEROX COPY OF TWO SALE DEED IN FAVOUR OF 1) MR.CHOGMAL PATIDAR S.O LT.MR.RA.JARA PATIDAR, 2) MR.AMAN PATIDAR S/O MR.SANTOSH PATIDAR, 3) MR.ANMOJ. PATIDAR S/O MR.SANTOSH PATIDAR.

2. DURING PROPERTY VISIT MR. AMAN JI WAS MET AT THE PROPERTY HE IS CUSTOMER HIS CONTACT NO. 7049804167JIT WAS CLEARLY EXPLAINED TO HIM/HER THAT THE PROPERTY VISIT IS BEING DONE FOR VALUATION PURPOSE IN RELATION WITH LOAN PROPOSAL.

3. RATE HAS BEEN CONFIRM FROM LOCAL MARKET ENQUIRY.

4. PROPERTY IS SITUATED AT SURROUNDING AREA OF LOCALITY IS RESIDENTIAL ZONING.

5. AT SITE PROPERTY IS G+2 RESIDENTIAL HOUSE WHICH IS OCCUPIED BY OWNER

6. OBTAIN T AND CP LAYOUT PLAN MEMO NO. BPULP 8567/JPO4/29 ON DATED 15.03.2022 PROPERTY IS IDENTIFIED BY T AND CP LAYOUT 7.AS PER SITE BUILT UP AREA OF GF IS 2600 SOFT, FF IS 2600 SOFT, SF IS 800 SOFT. TOTAL BUILT UP AREA OF G+2 IS 6000 SOFT.

8. AS PER BOTH DEED AND AT SITE LAND AREA OF THE PROPERTY IS 5000 SOFT.

9. BUILDING PERMISSION AND MAP NOT OBTAIN. SAME IS REQUIRED.

10. LATEST PTR REQUIRED.

11. AS PER DEED LAND USES IS RESIDENTIAL.

12. BUILT-UP IS TAKEN ACTUAL AT SITE`,
    engineerName: "ER.ARBAZ",
    propertyPhotos: [],
  });






  // Initialize formData when editing
  useEffect(() => {
    if (isEdit) {
      setFormData({
        northAsPerDocs: isEdit.northAsPerDocs || "",
        southAsPerDocs: isEdit.southAsPerDocs || "",
        eastAsPerDocs: isEdit.eastAsPerDocs || "",
        westAsPerDocs: isEdit.westAsPerDocs || "",
        northActual: isEdit.northActual || "",
        southActual: isEdit.southActual || "",
        eastActual: isEdit.eastActual || "",
        westActual: isEdit.westActual || "",
        northBoundaryMatching: isEdit.northBoundaryMatching || "",
        southBoundaryMatching: isEdit.southBoundaryMatching || "",
        eastBoundaryMatching: isEdit.eastBoundaryMatching || "",
        westBoundaryMatching: isEdit.westBoundaryMatching || "",
        northRemarks: isEdit.northRemarks || "",
        southRemarks: isEdit.southRemarks || "",
        eastRemarks: isEdit.eastRemarks || "",
        westRemarks: isEdit.westRemarks || "",
        additionalRemarks: isEdit.additionalRemarks || "",
        engineerName: isEdit.engineerName || "",
        propertyPhotos: isEdit.propertyPhotos || "",
      });

      console.log('====================================');
      console.log(isEdit);
      console.log('====================================');

      setUploadedImagess(isEdit?.propertyPhotos)
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleNextClick = () => {
  //   console.log(uploadedUrls)
  //   setFormData(prev => ({
  //     ...prev,
  //     propertyPhotos: uploadedUrls
  //   }));


  //   console.log(formData)

  //   onNext(formData);
  //   toast.success("Saved Successfully");
  // };



  const handleNextClick = () => {

    const updatedFormData = {
      ...formData,
      propertyPhotos: uploadedUrls
    };

    console.log("Uploaded URLs:", uploadedUrls);
    console.log("Updated FormData:", updatedFormData);

    setFormData(updatedFormData);   // update state
    onNext(updatedFormData);        // send correct data

    toast.success("Saved Successfully");
  };


  return (
    <div className='mb-4 border border-gray-300 rounded'>
      <div
        className='p-4 bg-gray-800 text-white cursor-pointer rounded-t flex justify-between items-center'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className='text-lg font-medium'>Boundary Details</h4>
        <button
          type='button'
          className='bg-white text-gray-800 text-sm px-3 py-1 rounded'
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Close" : "Edit"}
        </button>
      </div>

      {isOpen && (
        <div className='p-4 bg-gray-100 border-t rounded-b'>
          <h5 className='mb-3 text-lg font-semibold'>Boundary Detailing</h5>
          <div className='overflow-x-auto mb-4'>
            <table className='min-w-full text-sm border border-gray-300'>
              <thead className='bg-gray-200'>
                <tr>
                  <th className='border px-3 py-2 text-left'>Detailing</th>
                  <th className='border px-3 py-2 text-left'>North</th>
                  <th className='border px-3 py-2 text-left'>South</th>
                  <th className='border px-3 py-2 text-left'>East</th>
                  <th className='border px-3 py-2 text-left'>West</th>
                </tr>
              </thead>
              <tbody>
                {["AsPerDocs", "Actual", "BoundaryMatching", "Remarks"].map(
                  (section, i) => (
                    <tr key={i}>
                      <td className='border px-3 py-2 font-medium'>
                        {section === "AsPerDocs"
                          ? "As per docs."
                          : section === "Actual"
                            ? "As per Actual"
                            : section === "BoundaryMatching"
                              ? "Boundary Matching"
                              : "Remarks:"}
                      </td>
                      {["north", "south", "east", "west"].map((dir) => (
                        <td className='border px-3 py-2' key={dir}>
                          <input
                            type='text'
                            className='w-full border border-gray-300 px-2 py-1 rounded'
                            name={`${dir}${section}`}
                            value={formData[`${dir}${section}`]}
                            onChange={handleChange}
                          />
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className='mb-4'>
            <label className='block mb-1 font-medium'>Additional Remarks</label>
            <textarea
              className='w-full border border-gray-300 px-2 py-2 rounded'
              name='additionalRemarks'
              rows='8'
              value={formData.additionalRemarks}
              onChange={handleChange}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block mb-1 font-medium'>
                Name of the Engineer visited
              </label>
              <input
                type='text'
                className='w-full border border-gray-300 px-2 py-1 rounded'
                name='engineerName'
                value={formData.engineerName}
                onChange={handleChange}
              />
            </div>
            {/* <div>
              <label className='block mb-1 font-medium'>
                PHOTOGRAPHS OF PROPERTY
              </label>
              <input
                type='text'
                className='w-full border border-gray-300 px-2 py-1 rounded'
                name='propertyPhotos'
                value={formData.propertyPhotos}
                onChange={handleChange}
              />
            </div> */}
            <div className='pb-6'>
              <h2 className='bg-blue-100 p-3 font-bold mb-4 rounded-lg'>
                7. SITE PHOTOS
              </h2>
              <ImageUploader
                deleteId={id}
                images={images}
                setImages={setImages}
                setUploadedUrls={setUploadedUrls}
                maxCount={10}
                uploadedImages={uploadedImages}
                url={"aditya"}
                uploadedUrls={uploadedUrls}
              />
            </div>
            <div className=''>
              <button
                onClick={handleNextClick}
                className='bg-[#1E2939]  text-white font-semibold px-6 py-2 rounded'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoundaryDetails;
