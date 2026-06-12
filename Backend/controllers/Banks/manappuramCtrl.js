// const Manapuram = require("../../model/Banks/manappuramModel");

// // Create new record
// const createForm = async (req, res) => {
//   try {
//     const form = await Manapuram.create(req.body);
//     res.status(201).json(form);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get all records
// const getAllForms = async (req, res) => {
//   try {
//     const forms = await Manapuram.find();
//     res.status(200).json(forms);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get a single record by ID
// const getFormById = async (req, res) => {
//   try {
//     const form = await Manapuram.findById(req.params.id);
//     if (!form) {
//       return res.status(404).json({ message: "Form not found" });
//     }
//     res.status(200).json(form);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a record by ID
// const updateForm = async (req, res) => {
//   try {
//     const updatedForm = await Manapuram.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedForm) {
//       return res.status(404).json({ message: "Form not found" });
//     }
//     res.status(200).json(updatedForm);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a record by ID
// const deleteForm = async (req, res) => {
//   try {
//     const deletedForm = await Manapuram.findByIdAndDelete(req.params.id);
//     if (!deletedForm) {
//       return res.status(404).json({ message: "Form not found" });
//     }
//     res.status(200).json({ message: "Form deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// module.exports = {
//   createForm,
//   getAllForms,
//   getFormById,
//   updateForm,
//   deleteForm,
// };



const Manappuram = require("../../model/Banks/manappuramModel");
const Notification = require("../../model/Notification");
const imagekit = require("../../config/imagekit");

// ─── HELPER: sanitize images — only valid http URLs ───────────────────────────
const sanitizeImages = (arr = []) =>
  arr
    .map((img) => (typeof img === "string" ? img : img?.url || ""))
    .filter((url) => url.startsWith("http"));

// ─── UTILITY: flatten nested object to dot-notation keys ─────────────────────
// e.g. { header: { valueName: "X" } }  →  { "header.valueName": "X" }
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

// ─── CREATE ───────────────────────────────────────────────────────────────────
exports.createReport = async (req, res) => {
  try {
    const body = { ...req.body };

    // Set createdBy
    if (req.user) {
      body.createdBy = req.user._id;
    }



    if (body.imageUrls) {
      body.imageUrls = sanitizeImages(body.imageUrls).map((url) => ({ url }));
    }

    // if admin sends createdAt manually
    if (body.createdAt) {
      body.createdAt = new Date(req.body.createdAt);
    }


    const newReport = new Manappuram(body);
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
    if (req.user?.role === "Admin") {
      query.createdBy = req.user._id;
    } else if (req.user?.role === "FieldOfficer") {
      query.assignedTo = req.user._id;
    }

    const data = await Manappuram.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET BY ID ────────────────────────────────────────────────────────────────
exports.getReportById = async (req, res) => {
  try {
    const data = await Manappuram.findById(req.params.id);
    if (!data)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
exports.updateReport = async (req, res) => {
  try {
    const { imageUrls, ...rest } = req.body;

    const flatSet = flattenObject(rest);

    // Field Officer auto-submit
    if (req.user?.role === "FieldOfficer") {
      flatSet.isReportSubmitted = true;
    }

    const updateQuery = {};

    if (Object.keys(flatSet).length > 0) {
      updateQuery.$set = flatSet;
    }

    // Add new valid image URLs without duplicates
    if (imageUrls && imageUrls.length > 0) {
      const cleanUrls = sanitizeImages(imageUrls).map((url) => ({ url }));
      if (cleanUrls.length > 0) {
        updateQuery.$addToSet = { imageUrls: { $each: cleanUrls } };
      }
    }

    const updated = await Manappuram.findByIdAndUpdate(
      req.params.id,
      updateQuery,
      { new: true, runValidators: false }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });

    // Notification (non-blocking)
    try {
      const notif = await Notification.create({
        userId: req.user?._id,
        caseId: req.params.id,
        message: "Updated Manappuram report",
        bankName: "Manappuram Finance",
      });
      if (req.io) req.io.emit("newNotification", notif);
    } catch (_) {
      /* notification failure should not break update */
    }

    res.json({ success: true, updated });
  } catch (err) {
    console.error("updateReport error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── UPLOAD IMAGE TO IMAGEKIT ─────────────────────────────────────────────────
// POST /api/manappuram/upload-image
// Form-data: file = <image>  |  reportId = <optional>
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file received" });
    }

    const fileName = `manappuram_${Date.now()}_${req.file.originalname}`;

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName,
      folder: "/manappuram-reports",
    });

    const latitude = String(req.body.latitude || "").trim();
    const longitude = String(req.body.longitude || "").trim();

    // Auto-attach to report if reportId is provided
    if (req.body.reportId) {
      const updateQuery = {
        $addToSet: {
          imageUrls: { url: result.url, fileId: result.fileId },
        },
      };

      if (latitude && longitude) {
        updateQuery.$set = {
          "summary.coordinates": `${latitude}, ${longitude}`,
        };
      }

      await Manappuram.findByIdAndUpdate(req.body.reportId, updateQuery);
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

// ─── UPLOAD DOCUMENT TO IMAGEKIT ──────────────────────────────────────────────
// POST /api/manappuram/upload-document
// Form-data: file = <any file>  |  reportId = <optional>
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file received" });
    }

    const fileName = `manappuram_doc_${Date.now()}_${req.file.originalname}`;

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName,
      folder: "/manappuram-documents",
    });

    // Auto-attach to report if reportId is provided
    if (req.body.reportId) {
      await Manappuram.findByIdAndUpdate(req.body.reportId, {
        $addToSet: {
          AttachDocuments: {
            url: result.url,
            fileId: result.fileId,
            name: req.file.originalname,
          },
        },
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

// ─── DELETE FILE (IMAGE OR DOCUMENT) FROM IMAGEKIT + DB ───────────────────────
// DELETE /api/manappuram/delete-file/:id
// Body: { fileId, type: "image" | "document", url }
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileId, type } = req.body;

    if (!fileId) {
      return res
        .status(400)
        .json({ success: false, message: "fileId is required" });
    }

    // Remove from ImageKit
    await imagekit.deleteFile(fileId);

    // Remove from MongoDB
    let updateQuery = {};
    if (type === "image") {
      updateQuery = { $pull: { imageUrls: { fileId } } };
    } else if (type === "document") {
      updateQuery = { $pull: { AttachDocuments: { fileId } } };
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid type. Use 'image' or 'document'" });
    }

    const updated = await Manappuram.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });

    res.json({ success: true, updated });
  } catch (err) {
    console.error("deleteFile error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── DELETE REPORT ────────────────────────────────────────────────────────────
exports.deleteReport = async (req, res) => {
  try {
    const deleted = await Manappuram.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
