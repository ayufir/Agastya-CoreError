// const express = require("express");
// const router = express.Router();
// const {
//   createForm,
//   getAllForms,
//   getFormById,
//   updateForm,
//   deleteForm,
// } = require("../../controllers/Banks/manappuramCtrl");

// // POST - Create
// router.post("/create", createForm);

// // GET - All
// router.get("/display", getAllForms);

// // GET - By ID
// router.get("/display/:id", getFormById);

// // PUT - Update by ID
// router.put("/update/:id", updateForm);

// // DELETE - By ID
// router.delete("/delete/:id", deleteForm);

// module.exports = router;



const express = require("express");
const router = express.Router();
const multer = require("multer");
const ctrl = require("../../controllers/Banks/manappuramCtrl");
const { protect } = require("../../middleware/authMiddleware");

// Memory storage — file.buffer available for ImageKit upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});

// ── CRUD ──────────────────────────────────────────────────────────────────────
router.post("/", protect, ctrl.createReport);
router.get("/", protect, ctrl.getAllReports);
router.get("/:id", ctrl.getReportById);
router.put("/:id", protect, ctrl.updateReport);
router.delete("/:id", protect, ctrl.deleteReport);

// ── IMAGE UPLOAD (ImageKit) ───────────────────────────────────────────────────
// POST /api/manappuram/upload-image
// Body (multipart/form-data): file, reportId (optional)
router.post("/upload-image", upload.single("file"), ctrl.uploadImage);

// ── DOCUMENT UPLOAD (ImageKit) ────────────────────────────────────────────────
// POST /api/manappuram/upload-document
// Body (multipart/form-data): file, reportId (optional)
router.post("/upload-document", upload.single("file"), ctrl.uploadDocument);

// ── DELETE FILE (IMAGE / DOCUMENT) ────────────────────────────────────────────
// DELETE /api/manappuram/delete-file/:id
// Body: { fileId, type: "image" | "document" }
router.delete("/delete-file/:id", ctrl.deleteFile);

module.exports = router;
