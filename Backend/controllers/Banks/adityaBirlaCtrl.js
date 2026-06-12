const AdityaBirla = require("../../model/Banks/AdityaBirlaModel");
const Notification = require("../../model/Notification");
const imagekit = require("../../config/imagekit");

// ─── HELPER: strip any accidental base64 from imageUrls ──────────────────────
// Sirf valid http/https URLs ko hi save karo
const sanitizeImages = (arr = []) =>
  arr
    .map((img) => (typeof img === "string" ? img : img?.url || ""))
    .filter((url) => url.startsWith("http"));

// ─── CREATE ───────────────────────────────────────────────────────────────────
exports.createReport = async (req, res) => {
  try {
    const body = { ...req.body };

    // Set createdBy and auto-tag city from user's profile
    if (req.user) {
      body.createdBy = req.user._id;
      // Auto-populate city if not provided
      if (req.user.assignedCity && !body.propertyCity) {
        body.propertyCity = req.user.assignedCity;
      }
    }


    if (body.createdAt) {
      body.createdAt = new Date(body.createdAt);
    }

    // Clean images before save (remove any base64 that slipped through)
    if (body.imageUrls) {
      body.imageUrls = sanitizeImages(body.imageUrls).map((url) => ({ url }));
    }

    const newReport = new AdityaBirla(body);
    const saved = await newReport.save();

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("createReport error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── GET ALL ──────────────────────────────────────────────────────────────────
exports.getAllReports = async (req, res) => {
  try {
    let query = {};

    // Ownership logic: Admin only sees their own reports
    // SuperAdmin sees everything
    if (req.user?.role === "Admin") {
      query.createdBy = req.user._id;
    } else if (req.user?.role === "FieldOfficer") {
      query.assignedTo = req.user._id;
    }

    const data = await AdityaBirla.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET BY ID ────────────────────────────────────────────────────────────────
exports.getReportById = async (req, res) => {
  try {
    const data = await AdityaBirla.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
exports.updateReport = async (req, res) => {
  try {
    const { imageUrls, ...rest } = req.body;

    // Flatten nested objects into dot-notation for $set
    // This prevents overwriting entire sub-docs accidentally
    const flatSet = flattenObject(rest);

    // Field officer logic
    if (req.user?.role === "FieldOfficer") {
      flatSet.isReportSubmitted = true;
    }

    const updateQuery = {};

    if (Object.keys(flatSet).length > 0) {
      updateQuery.$set = flatSet;
    }

    // Add new (valid) image URLs without duplicates
    if (imageUrls && imageUrls.length > 0) {
      const cleanUrls = sanitizeImages(imageUrls).map((url) => ({ url }));
      if (cleanUrls.length > 0) {
        updateQuery.$addToSet = { imageUrls: { $each: cleanUrls } };
      }
    }

    const updated = await AdityaBirla.findByIdAndUpdate(
      req.params.id,
      updateQuery,
      { new: true, runValidators: false }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Not found" });

    // Notification
    try {
      const notif = await Notification.create({
        userId: req.user?._id,
        caseId: req.params.id,
        message: "Updated Aditya Birla report",
        bankName: "Aditya Birla",
      });
      if (req.io) req.io.emit("newNotification", notif);
    } catch (_) { /* notification failure shouldn't break update */ }

    res.json({ success: true, updated });
  } catch (err) {
    console.error("updateReport error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE IMAGE ─────────────────────────────────────────────────────────────
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const updated = await AdityaBirla.findByIdAndUpdate(
      id,
      { $pull: { imageUrls: { url: imageUrl } } },
      { new: true }
    );
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── UPLOAD IMAGE TO IMAGEKIT ─────────────────────────────────────────────────
// POST /api/aditya-birla/upload-image
// Form-data: file = <image file>  |  reportId = <optional, to auto-attach>
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file received" });
    }

    const fileName = `aditya_birla_${Date.now()}_${req.file.originalname}`;

    const result = await imagekit.upload({
      file: req.file.buffer,          // Buffer from multer memoryStorage
      fileName,
      folder: "/aditya-birla-reports",
    });

    const latitude = String(req.body.latitude || "").trim();
    const longitude = String(req.body.longitude || "").trim();

    // If reportId is passed, attach URL to the report automatically
    if (req.body.reportId) {
      const updateQuery = {
        $addToSet: { imageUrls: { url: result.url, fileId: result.fileId } },
      };

      if (latitude && longitude) {
        updateQuery.$set = {
          "locationDetails.latitude": latitude,
          "locationDetails.longitude": longitude,
        };
      }

      await AdityaBirla.findByIdAndUpdate(req.body.reportId, updateQuery);
    }

    res.status(200).json({
      success: true,
      url: result.url,
      fileId: result.fileId,
    });
  } catch (err) {
    console.error("uploadImage error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── UTILITY: Flatten nested object to dot-notation keys ─────────────────────
// e.g. { basicDetails: { nameOfValuer: "X" } }  →  { "basicDetails.nameOfValuer": "X" }
function flattenObject(obj, prefix = "", result = {}) {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const full = prefix ? `${prefix}.${key}` : key;

    if (
      val !== null &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      !(val instanceof Date)
    ) {
      flattenObject(val, full, result);
    } else {
      result[full] = val;
    }
  }
  return result;
}


// ... existing code ...

// ─── UPLOAD DOCUMENT ───────────────────────────────────────────────────────
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file received" });
    }

    const fileName = `aditya_birla_doc_${Date.now()}_${req.file.originalname}`;

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName,
      folder: "/aditya-birla-documents",
    });

    // If reportId is passed, attach document to the report automatically
    if (req.body.reportId) {
      await AdityaBirla.findByIdAndUpdate(req.body.reportId, {
        $addToSet: { AttachDocuments: { url: result.url, fileId: result.fileId, name: req.file.originalname } },
      });
    }

    res.status(200).json({
      success: true,
      url: result.url,
      fileId: result.fileId,
      name: req.file.originalname,
    });
  } catch (err) {
    console.error("uploadDocument error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE FILE (IMAGE OR DOCUMENT) FROM IMAGEKIT AND REPORT ───────────────
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params; // report id
    const { fileId, type, url } = req.body;

    if (!fileId) {
      return res.status(400).json({ success: false, message: "fileId is required" });
    }

    // Delete from ImageKit
    await imagekit.deleteFile(fileId);

    // Remove from report
    let updateQuery = {};
    if (type === "image") {
      updateQuery = { $pull: { imageUrls: { fileId: fileId } } };
    } else if (type === "document") {
      updateQuery = { $pull: { AttachDocuments: { fileId: fileId } } };
    } else {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    const updated = await AdityaBirla.findByIdAndUpdate(id, updateQuery, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Report not found" });

    res.json({ success: true, updated });
  } catch (err) {
    console.error("deleteFile error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
