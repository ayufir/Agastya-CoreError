const express = require("express");
const router = express.Router();
const {
  submitForm,
  remarksForm,
  getRemarks,
  uploadSitePhotos,
  getSitePhotos,
  getForm,
  distanceForm,
  getDistance,
  maintenanceForm,
  getMint,
  amenitiesForm,
  getAmenities,
  cautionAreaForm,
  getCautionArea,
  valuationForm,
  getValuation,
  constructionForm,
  getConstruction,
} = require("../../controllers/Banks/dataController");

router.post("/form-submit", submitForm);
router.post("/maintenance-from", maintenanceForm);
router.post("/amenities-from", amenitiesForm);
router.post("/caution-from", cautionAreaForm);
router.post("/valuation-from", valuationForm);
router.post("/construction-from", constructionForm);
router.post("/distance-from", distanceForm);
router.post("/upload-from", uploadSitePhotos);
router.post("/remarks-from", remarksForm);

router.get("/form-data", getForm);
router.get("/form-mint", getMint);
router.get("/form-amenities", getAmenities);
router.get("/get-caution", getCautionArea);
router.get("/get-valuation", getValuation);
router.get("/get-construction", getConstruction);
router.get("/get-Distance", getDistance);
router.get("/get-sitephoto", getSitePhotos);
router.get("/get-Remarks", getRemarks);

module.exports = router;
