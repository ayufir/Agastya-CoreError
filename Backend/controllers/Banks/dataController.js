const { Console } = require("console");
const Formdata = require("../../model/Banks/dataModel");
const multer = require("multer");
const path = require("path");
const { console } = require("inspector/promises");
// const { upload } = require('../middlewares/multer'); // Assuming multer config is in this file

// Set up multer for storing images

// Set storage options for multer

// Set storage options for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Define the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Set file name with timestamp
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Only allow image files (you can change this for other file types)
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
}).array("imageFile", 10); // Accept up to 10 files

// API to save site photos
exports.uploadSitePhotos = [
  upload,
  async (req, res) => {
    try {
      // Check if files are uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Ensure formId is provided
      if (!req.body.formId) {
        return res.status(400).json({ message: "Form ID is required" });
      }

      // Extract file information and create site photo object for each file
      const sitePhotos = req.files.map((file) => ({
        imageFile: file.path,
        fileName: file.originalname,
        uploadDate: Date.now(),
      }));

      // Update the Formdata schema to include the new site photos
      const updatedForm = await Formdata.findOneAndUpdate(
        { _id: req.body.formId }, // Find the form by ID
        { $push: { sitephotos: { $each: sitePhotos } } }, // Add new site photos to array
        { new: true } // Return the updated form
      );

      if (!updatedForm) {
        return res.status(404).json({ message: "Form not found" });
      }

      // Respond with the updated form and site photo details
      res.status(201).json({
        message: "Site photos uploaded successfully",
        sitePhotos,
        updatedForm,
      });
    } catch (error) {
      console.error("Error uploading site photo:", error);
      res.status(500).json({
        message: "Something went wrong while uploading the site photo",
        error: error.message,
      });
    }
  },
];

// API to get all site photos
exports.getSitePhotos = async (req, res) => {
  try {
    // Fetch form by the form ID from the URL parameter
    const form = await Formdata.findById(req.params.formId);

    if (!form || !form.sitephotos || form.sitephotos.length === 0) {
      return res.status(404).json({ message: "No site photos found" });
    }

    // Respond with all the site photos in the form
    res.status(200).json(form.sitephotos);
  } catch (err) {
    console.error("Error fetching site photos:", err);
    res
      .status(500)
      .json({ message: "Error fetching site photos", error: err.message });
  }
};

// porperty deailts Submit form
exports.submitForm = async (req, res) => {
  const {
    pincode,
    state,
    city,
    district,
    locality,
    streetName,
    landmark,
    plotNo,
    propertyType,
    unitType,
    revenueRecordType,
    sanctionUsage,
    actualUsage,
    plotArea,
    propertyJurisdiction,
    sanctionAuthorityName,
    societyRegistered,
    uniquePropertyID,
    propertyEntranceFacing,
    affFlag,
    propertyTransactionType,
    countOfProperties,
    doorPhotoWithNamePlate,
  } = req.body;

  try {
    // Create a new form using the received data
    const user = await Formdata.create({
      property: {
        pincode,
        state,
        city,
        district,
        locality,
        streetName,
        landmark,
        plotNo,
        propertyType,
        unitType,
        revenueRecordType,
        sanctionUsage,
        actualUsage,
        plotArea,
        propertyJurisdiction,
        sanctionAuthorityName,
        societyRegistered,
        uniquePropertyID,
        propertyEntranceFacing,
        affFlag,
        propertyTransactionType,
        countOfProperties,
        doorPhotoWithNamePlate,
      },
    });

    // console.log(req.body);

    // Send a success response with the user data
    res.status(200).json({ message: "Data sent successfully", user });
    // console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error saving form data" });
  }
};
exports.getForm = async (req, res) => {
  try {
    const latestForm = await Formdata.findOne().sort({ _id: -1 });
    console.log("Fetched Data:", latestForm); // Log the data
    res.status(200).json(latestForm);
  } catch (err) {
    console.error("Error fetching form:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.maintenanceForm = async (req, res) => {
  try {
    const {
      propertyAge,
      residualAge,
      internalMaintenance,
      externalMaintenance,
      capturePlotSketch,
      plotDemarcated,
      boundariesMatching,
      remarks,
      irregularShape,
      notDemented,
      eastDocument,
      eastSiteVisit,
      eastDimensions,
      westDocument,
      westSiteVisit,
      westDimensions,
      northDocument,
      northSiteVisit,
      northDimensions,
      southDocument,
      southSiteVisit,
      southDimensions,
    } = req.body;

    // Convert string booleans to actual booleans
    const boundariesMatchingBool =
      boundariesMatching === "true" || boundariesMatching === true;
    const irregularShapeBool =
      irregularShape === "true" || irregularShape === true;
    const notDementedBool = notDemented === "true" || notDemented === true;

    // Save the form data to the database
    const maintForm = await Formdata.create({
      maintenance: {
        propertyAge,
        residualAge,
        internalMaintenance,
        externalMaintenance,
        capturePlotSketch,
        plotDemarcated,
        boundariesMatching: boundariesMatchingBool,
        irregularShape: irregularShapeBool,
        notDemented: notDementedBool,
        remarks,
        boundaries: {
          east: {
            document: eastDocument || "", // Default empty string if no value
            siteVisit: eastSiteVisit || "",
            dimensions: eastDimensions || "",
          },
          west: {
            document: westDocument || "",
            siteVisit: westSiteVisit || "",
            dimensions: westDimensions || "",
          },
          north: {
            document: northDocument || "",
            siteVisit: northSiteVisit || "",
            dimensions: northDimensions || "",
          },
          south: {
            document: southDocument || "",
            siteVisit: southSiteVisit || "",
            dimensions: southDimensions || "",
          },
        },
      },
    });

    console.log(req.body); // This will help in debugging

    res.status(201).json({
      message: "Maintenance form saved successfully",
      maintForm,
    });
  } catch (error) {
    console.error("Error saving maintenance form:", error);
    const errorMessage = error?.response?.data || error.message;
    res.status(500).json({
      message: "Something went wrong while saving the maintenance form",
      error: errorMessage,
    });
  }
};
exports.getMint = async (req, res) => {
  try {
    // Fetch the latest form and only return the maintenance section
    const latestForm = await Formdata.findOne()
      .sort({ _id: -1 })
      .select("maintenance"); // Fetch only 'maintenance' field

    if (!latestForm || !latestForm.maintenance) {
      return res
        .status(404)
        .json({ message: "No maintenance form data found" });
    }

    console.log("Fetched Maintenance Data:", latestForm.maintenance); // For debugging purposes
    res.status(200).json(latestForm.maintenance); // Return only the maintenance data
  } catch (err) {
    console.error("Error fetching maintenance form:", err);
    res.status(500).json({ error: err.message });
  }
};

//
exports.amenitiesForm = async (req, res) => {
  try {
    const {
      airport,
      rickshawStop,
      busStop,
      metroStation,
      railwayStation,
      college,
      school,
      hospital,
      superMarket,
      mall,
      placeOfWorship,
      infra,
      image,
    } = req.body;

    // Convert string booleans to actual booleans
    const airportBool = airport === "true" || airport === true;
    const rickshawStopBool = rickshawStop === "true" || rickshawStop === true;
    const busStopBool = busStop === "true" || busStop === true;
    const metroStationBool = metroStation === "true" || metroStation === true;
    const railwayStationBool =
      railwayStation === "true" || railwayStation === true;
    const collegeBool = college === "true" || college === true;
    const schoolBool = school === "true" || school === true;
    const hospitalBool = hospital === "true" || hospital === true;
    const superMarketBool = superMarket === "true" || superMarket === true;
    const mallBool = mall === "true" || mall === true;
    const placeOfWorshipBool =
      placeOfWorship === "true" || placeOfWorship === true;

    // Save the form data to the database
    const amenitiesForm = await Formdata.create({
      amenities: {
        airport: airportBool,
        rickshawStop: rickshawStopBool,
        busStop: busStopBool,
        metroStation: metroStationBool,
        railwayStation: railwayStationBool,
        college: collegeBool,
        school: schoolBool,
        hospital: hospitalBool,
        superMarket: superMarketBool,
        mall: mallBool,
        placeOfWorship: placeOfWorshipBool,
        infra: infra || "",
        image: image || "",
      },
    });

    console.log(req.body); // Debugging ke liye

    res.status(201).json({
      message: "Amenities form saved successfully",
      amenitiesForm,
    });
  } catch (error) {
    console.error("Error saving amenities form:", error);
    const errorMessage = error?.response?.data || error.message;
    res.status(500).json({
      message: "Something went wrong while saving the amenities form",
      error: errorMessage,
    });
  }
};
exports.getAmenities = async (req, res) => {
  try {
    // Fetch the latest form and only return the amenities section
    const latestForm = await Formdata.findOne()
      .sort({ _id: -1 })
      .select("amenities"); // Fetch only 'amenities' field

    if (!latestForm || !latestForm.amenities) {
      return res.status(404).json({ message: "No amenities form data found" });
    }

    console.log("Fetched Amenities Data:", latestForm.amenities); // For debugging purposes
    res.status(200).json(latestForm.amenities); // Return only the amenities data
  } catch (err) {
    console.error("Error fetching amenities form:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.cautionAreaForm = async (req, res) => {
  try {
    const {
      anyChemicalHazard,
      nearCrematorium,
      probableRoadExtension,
      statutoryNoticesOnProperty,
      communityDominated,
      nearGarbageDump,
      propertyAccessIssues,
      underHighTensionLine,
      floodProne,
      nearNalla,
      propertyIsLandLocked,
      landReservation,
      nearToRailTrack,
      slumArea,
    } = req.body;

    // Convert string booleans to actual booleans
    const anyChemicalHazardBool =
      anyChemicalHazard === "true" || anyChemicalHazard === true;
    const nearCrematoriumBool =
      nearCrematorium === "true" || nearCrematorium === true;
    const probableRoadExtensionBool =
      probableRoadExtension === "true" || probableRoadExtension === true;
    const statutoryNoticesOnPropertyBool =
      statutoryNoticesOnProperty === "true" ||
      statutoryNoticesOnProperty === true;
    const communityDominatedBool =
      communityDominated === "true" || communityDominated === true;
    const nearGarbageDumpBool =
      nearGarbageDump === "true" || nearGarbageDump === true;
    const propertyAccessIssuesBool =
      propertyAccessIssues === "true" || propertyAccessIssues === true;
    const underHighTensionLineBool =
      underHighTensionLine === "true" || underHighTensionLine === true;
    const floodProneBool = floodProne === "true" || floodProne === true;
    const nearNallaBool = nearNalla === "true" || nearNalla === true;
    const propertyIsLandLockedBool =
      propertyIsLandLocked === "true" || propertyIsLandLocked === true;
    const landReservationBool =
      landReservation === "true" || landReservation === true;
    const nearToRailTrackBool =
      nearToRailTrack === "true" || nearToRailTrack === true;
    const slumAreaBool = slumArea === "true" || slumArea === true;

    // Save the form data to the database
    const cautionAreaForm = await Formdata.create({
      cautionArea: {
        anyChemicalHazard: anyChemicalHazardBool,
        nearCrematorium: nearCrematoriumBool,
        probableRoadExtension: probableRoadExtensionBool,
        statutoryNoticesOnProperty: statutoryNoticesOnPropertyBool,
        communityDominated: communityDominatedBool,
        nearGarbageDump: nearGarbageDumpBool,
        propertyAccessIssues: propertyAccessIssuesBool,
        underHighTensionLine: underHighTensionLineBool,
        floodProne: floodProneBool,
        nearNalla: nearNallaBool,
        propertyIsLandLocked: propertyIsLandLockedBool,
        landReservation: landReservationBool,
        nearToRailTrack: nearToRailTrackBool,
        slumArea: slumAreaBool,
      },
    });

    console.log(req.body); // Debugging ke liye

    res.status(201).json({
      message: "Caution Area form saved successfully",
      cautionAreaForm,
    });
  } catch (error) {
    console.error("Error saving caution area form:", error);
    const errorMessage = error?.response?.data || error.message;
    res.status(500).json({
      message: "Something went wrong while saving the caution area form",
      error: errorMessage,
    });
  }
};
exports.getCautionArea = async (req, res) => {
  try {
    // Fetch the latest form and only return the cautionArea section
    const latestForm = await Formdata.findOne()
      .sort({ _id: -1 })
      .select("cautionArea"); // Fetch only 'cautionArea' field

    if (!latestForm || !latestForm.cautionArea) {
      return res
        .status(404)
        .json({ message: "No caution area form data found" });
    }

    console.log("Fetched Caution Area Data:", latestForm.cautionArea); // For debugging purposes
    res.status(200).json(latestForm.cautionArea); // Return only the caution area data
  } catch (err) {
    console.error("Error fetching caution area form:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.valuationForm = async (req, res) => {
  try {
    const {
      valuationMethodology,
      landData = {},
      unitValueData = [],
      totalAppraisedValue,
      roundOffTotal,
      governmentRatesData = {},
      constructionDetails = {},
    } = req.body;

    // Log the request body to ensure it's being received correctly
    console.log("Received data:", req.body);

    // Prepare the valuation data to be saved
    const valuation = {
      valuationMethodology,
      landData: {
        areaSqFt: landData.areaSqFt || 0,
        ratePerSqFt: landData.ratePerSqFt || 0,
        amount: landData.amount || 0,
      },
      unitValueData,
      totalAppraisedValue,
      roundOffTotal,
      governmentRatesData: {
        buildingUsage: governmentRatesData.buildingUsage || "",
        areaSqFt: governmentRatesData.areaSqFt || 0,
        ratePerSqFt: governmentRatesData.ratePerSqFt || 0,
        totalGrossValue: governmentRatesData.totalGrossValue || 0,
      },
      constructionDetails: {
        constructionAreaSqFt: constructionDetails.constructionAreaSqFt || 0,
        approvedCoverageSqFt: constructionDetails.approvedCoverageSqFt || 0,
        costOfConstruction: constructionDetails.costOfConstruction || 0,
      },
    };

    // Save the valuation data into the database
    const valuationForm = await Formdata.create({ valuation });

    res.status(201).json({
      message: "Valuation form saved successfully",
      valuationForm,
    });
  } catch (error) {
    console.error("Error saving valuation form:", error);
    res.status(500).json({
      message: "Something went wrong while saving the valuation form",
      error: error?.response?.data || error.message,
    });
  }
};

exports.getValuation = async (req, res) => {
  try {
    const latestForm = await Formdata.findOne()
      .sort({ _id: -1 })
      .select("valuation");

    if (!latestForm?.valuation) {
      return res.status(404).json({ message: "No valuation form data found" });
    }

    console.log("Fetched Valuation Data:", latestForm.valuation);
    res.status(200).json(latestForm.valuation);
  } catch (error) {
    console.error("Error fetching valuation form:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.constructionForm = async (req, res) => {
  try {
    const {
      typeOfStructure,
      structureConfiguration,
      resolutionAmenities,
      recommendationAmenities,
      amenityCompletion,
      amenityRecommendation,
      structureCompletion,
      structureRecommendation,
      recommendedValue,
      comments,
    } = req.body;

    // Create construction form with new fields
    const constructionForm = await Formdata.create({
      construction: {
        typeOfStructure,
        structureConfiguration,
        resolutionAmenities,
        recommendationAmenities,
        amenityCompletion,
        amenityRecommendation,
        structureCompletion,
        structureRecommendation,
        recommendedValue,
        comments: comments || "", // agar comment na aaye to blank rakh denge
      },
    });

    console.log(constructionForm); // Debugging the incoming request

    res.status(201).json({
      message: "Construction form saved successfully",
      constructionForm,
    });
  } catch (error) {
    console.error("Error saving construction form:", error);
    const errorMessage = error?.response?.data || error.message;
    res.status(500).json({
      message: "Something went wrong while saving the construction form",
      error: errorMessage,
    });
  }
};
exports.getConstruction = async (req, res) => {
  try {
    // Fetch the latest form and only return the construction section
    const latestForm = await Formdata.findOne()
      .sort({ _id: -1 })
      .select("construction");

    if (!latestForm || !latestForm.construction) {
      return res
        .status(404)
        .json({ message: "No construction form data found" });
    }

    console.log("Fetched Construction Data:", latestForm.construction); // Debugging
    res.status(200).json(latestForm.construction);
  } catch (err) {
    console.error("Error fetching construction form:", err);
    res.status(500).json({ error: err.message });
  }
};

// Distance Form Save API
exports.distanceForm = async (req, res) => {
  try {
    const {
      distanceFromCPC,
      longitude,
      distanceFromCityCenter,
      distanceFromICICIBank,
      latitude,
      oneWayDistance,
    } = req.body;

    // Save the distance data to the database
    const distanceData = await Formdata.create({
      distance: {
        distanceFromCPC: distanceFromCPC || 0,
        longitude: longitude || 0,
        distanceFromCityCenter: distanceFromCityCenter || 0,
        distanceFromICICIBank: distanceFromICICIBank || 0,
        latitude: latitude || 0,
        oneWayDistance: oneWayDistance || 0,
      },
    });

    console.log(req.body); // Debugging purpose

    res.status(201).json({
      message: "Distance data saved successfully",
      distanceData,
    });
  } catch (error) {
    console.error("Error saving distance data:", error);
    const errorMessage = error?.response?.data || error.message;
    res.status(500).json({
      message: "Something went wrong while saving distance data",
      error: errorMessage,
    });
  }
};

// Get Latest Distance Data API
exports.getDistance = async (req, res) => {
  try {
    // Fetch the latest form and only return the distance section
    const latestForm = await Formdata.findOne()
      .sort({ _id: -1 })
      .select("distance");

    if (!latestForm || !latestForm.distance) {
      return res.status(404).json({ message: "No distance data found" });
    }

    console.log("Fetched Distance Data:", latestForm.distance); // For debugging
    res.status(200).json(latestForm.distance);
  } catch (err) {
    console.error("Error fetching distance data:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.remarksForm = async (req, res) => {
  try {
    const {
      nfsaCheckRequired,
      generalObservations,
      raleReferences,
      needsFunction,
      documentName,
      documentReference,
      documentDate,
      documentAuthority,
      personName,
      siteVisits,
      personRole,
      evaluationMode,
      personContact,
      rejectionReason,
      verifiedBy,
      verificationType,
      visitDate,
    } = req.body;

    const remarks = {
      nfsaCheckRequired: nfsaCheckRequired || "",
      generalObservations: generalObservations || "",
      raleReferences: raleReferences || "",
      needsFunction: needsFunction || "",
      documentName: documentName || "",
      documentReference: documentReference || "",
      documentDate: documentDate || "",
      documentAuthority: documentAuthority || "",
      personName: personName || "",
      siteVisits: siteVisits || 0,
      personRole: personRole || "",
      evaluationMode: evaluationMode || "",
      personContact: personContact || "",
      rejectionReason: rejectionReason || "",
      verifiedBy: verifiedBy || "",
      verificationType: verificationType || "",
      visitDate: visitDate || "",
    };

    const remarksForm = await Formdata.create({ remarks });
    console.log(remarksForm);

    console.log("Remarks Form Data:", req.body); // Debugging

    res.status(201).json({
      message: "Remarks form saved successfully",
      remarksForm,
    });
  } catch (error) {
    console.error("Error saving remarks form:", error);
    res.status(500).json({
      message: "Something went wrong while saving the remarks form",
      error: error?.response?.data || error.message,
    });
  }
};

exports.getRemarks = async (req, res) => {
  try {
    const latestForm = await Formdata.findOne()
      .sort({ _id: -1 })
      .select("remarks");

    if (!latestForm?.remarks) {
      return res.status(404).json({ message: "No remarks form data found" });
    }

    console.log("Fetched Remarks Data:", latestForm.remarks);
    res.status(200).json(latestForm.remarks);
  } catch (error) {
    console.error("Error fetching remarks form:", error);
    res.status(500).json({ error: error.message });
  }
};
