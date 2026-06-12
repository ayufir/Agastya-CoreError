const express = require("express");
const multer = require("multer");
const valuationReportController = require("../../controllers/Banks/bajajCtrl");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", protect, valuationReportController.createValuationReport);
router.get("/", protect, valuationReportController.getAllValuationReports);
router.delete(
  "/delete-upload",
  protect,
  valuationReportController.deleteUploadedFile
);
router.post(
  "/upload-image",
  protect,
  upload.single("file"),
  valuationReportController.uploadImage
);
router.post(
  "/upload-document",
  protect,
  upload.single("file"),
  valuationReportController.uploadDocument
);
router.delete("/delete-file/:id", protect, valuationReportController.deleteFile);
router.get("/:id", valuationReportController.getValuationReportById);
router.put("/:id", protect, valuationReportController.updateValuationReport);
router.delete("/:id", protect, valuationReportController.deleteValuationReport);

module.exports = router;
