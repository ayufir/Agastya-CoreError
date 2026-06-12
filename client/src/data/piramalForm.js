const piramalBankForm = [
  {
    section: "BASIC_DETAIL",
    fields: [
      {
        name: "applicantName",
        label: "Applicant's Name / Owner Name",
        type: "text",
      },
      { name: "propertyCategory", label: "Property Category", type: "text" },
      {
        name: "propertySubCategory",
        label: "Property Sub-Category",
        type: "text",
      },
      {
        name: "certificationType",
        label: "Type and Level of Certification",
        type: "text",
      },
      {
        name: "address",
        label: "Address as per Provided Documents",
        type: "text",
      },
      { name: "flatNo", label: "Flat No/Block No/Shop No", type: "text" },
      { name: "floorWing", label: "Floor Number & Wing Name", type: "text" },
      { name: "buildingName", label: "Building/House/Shop Name", type: "text" },
      { name: "khasraNumber", label: "CTS/Survey/Khasra Number", type: "text" },
      { name: "streetName", label: "Street Name", type: "text" },
      { name: "landmark", label: "Landmark", type: "text" },
      { name: "village", label: "Village/Location", type: "text" },
      { name: "city", label: "City/Taluka/Town", type: "text" },
      { name: "district", label: "District", type: "text" },
      { name: "pincode", label: "Pincode", type: "text" },
      { name: "state", label: "State", type: "text" },
      { name: "country", label: "Country", type: "text" },
      {
        name: "greenHousing",
        label: "If Green Housing",
        type: "select",
        options: ["Yes", "No"],
      },
      {
        name: "addressMatching",
        label: "Address Matching",
        type: "select",
        options: ["Yes", "No"],
      },
      { name: "latitude", label: "Latitude", type: "text", readOnly: true },
      { name: "longitude", label: "Longitude", type: "text", readOnly: true },
      {
        name: "imageUrls",
        label: "Images",
        type: "file",
        multiple: true,
        accept: "image/*",
      },
    ],
  },

  {
    section: "AREA_DETAILS",
    fields: [
      {
        name: "typeOfProperty",
        label: "Type of Property",
        type: "text",
      },
      {
        name: "sanctionedArea",
        label: "Sanctioned Area / Permissible",
        type: "text",
      },
      {
        name: "actualArea",
        label: "Actual Area",
        type: "text",
      },
      {
        name: "finalAreaConsidered",
        label: "Final Area Considered",
        type: "text",
      },
      {
        name: "overallBUA",
        label: "Overall BUA Division wrt Permissible Area",
        type: "text",
      },
    ],
  },



  

];
