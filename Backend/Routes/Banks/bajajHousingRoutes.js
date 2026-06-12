// Routes/Banks/bajajHousingRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const ctrl = require("../../controllers/Banks/bajajHousingCtrl");
const { protect } = require("../../middleware/authMiddleware");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB per file
});

// ── CRUD ──────────────────────────────────────────────────────────────────────
router.post("/", ctrl.createReport);
router.get("/", ctrl.getAllReports);
router.get("/:id", ctrl.getReportById);
router.put("/:id", protect, ctrl.updateReport);

// ── IMAGE UPLOAD ──────────────────────────────────────────────────────────────
// Body: file (multipart), reportId (optional), imageType, latitude, longitude
router.post("/upload-image", upload.single("file"), ctrl.uploadImage);

// ── DOCUMENT UPLOAD ───────────────────────────────────────────────────────────
router.post("/upload-document", upload.single("file"), ctrl.uploadDocument);

// ── DELETE FILE (IMAGE / DOCUMENT) ───────────────────────────────────────────
router.delete("/delete-file/:id", ctrl.deleteFile);

module.exports = router;