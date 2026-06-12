const express = require("express");
const router = express.Router();
const multer = require("multer");
const ctrl = require("../../controllers/Banks/adityaBirlaCtrl");
const { protect } = require("../../middleware/authMiddleware");

// Memory storage — file.buffer available for ImageKit upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per image
    // fileFilter: (_req, file, cb) => {
    //     if (file.mimetype.startsWith("image/")) cb(null, true);
    //     else cb(new Error("Only images allowed"), false);
    // },
});

// ── CRUD ──────────────────────────────────────────────────────────────────────
router.post("/", protect, ctrl.createReport);
router.get("/", protect, ctrl.getAllReports);
router.get("/:id", ctrl.getReportById);
router.put("/:id", protect, ctrl.updateReport);



// ... existing code ...

// ─── DOCUMENT UPLOAD ─────────────────────────────────────────────────────────
router.post("/upload-document", upload.single("file"), ctrl.uploadDocument);

// ─── DELETE FILE (IMAGE / DOCUMENT) ──────────────────────────────────────────
router.delete("/delete-file/:id", ctrl.deleteFile);

// ... existing routes ...


// router.post("/assign", protect, ctrl.assignCaseController);


// ── IMAGE UPLOAD (ImageKit) ───────────────────────────────────────────────────
// POST /api/aditya-birla/upload-image
// Body (multipart/form-data): file, reportId (optional)
router.post("/upload-image", upload.single("file"), ctrl.uploadImage);

// ── DELETE IMAGE ──────────────────────────────────────────────────────────────
router.put("/remove-image/:id", ctrl.deleteImage);

module.exports = router;