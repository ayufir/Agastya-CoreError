// controllers/Banks/bajajHousingCtrl.js
const BajajHousing = require("../../model/Banks/BajajHousingModel");
const Notification = require("../../model/Notification");
const imagekit = require("../../config/imagekit");

// ─── HELPER: strip any accidental base64 ─────────────────────────────────────
const sanitizeImages = (arr = []) =>
    arr
        .map((img) => (typeof img === "string" ? img : img?.url || ""))
        .filter((url) => url.startsWith("http") || url.startsWith("data:"));

// ─── HELPER: flatten nested object to dot-notation ───────────────────────────
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

// ─── IMAGE GROUPS ─────────────────────────────────────────────────────────────
const IMAGE_FIELDS = [
    "frontElevationImages",
    "kitchenImages",
    "selfieImages",
    "otherImages",
];

// ─── CREATE ───────────────────────────────────────────────────────────────────
exports.createReport = async (req, res) => {
    try {
        const body = { ...req.body };
        // Sanitize image arrays
        IMAGE_FIELDS.forEach((field) => {
            if (body[field]) {
                body[field] = sanitizeImages(body[field]).map((url) => ({ url }));
            }
        });

        // Set createdBy and auto-tag city from user's profile
        if (req.user) {
            body.createdBy = req.user._id;
            // Ensure locationDetails exists and set propertyCity if missing
            if (req.user.assignedCity) {
                if (!body.locationDetails) body.locationDetails = {};
                if (!body.locationDetails.propertyCity) {
                    body.locationDetails.propertyCity = req.user.assignedCity;
                }
            }
        }

        const newReport = new BajajHousing(body);
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
        const data = await BajajHousing.find().sort({ createdAt: -1 });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── GET BY ID ────────────────────────────────────────────────────────────────
exports.getReportById = async (req, res) => {
    try {
        const data = await BajajHousing.findById(req.params.id);
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
        const imageFieldData = {};
        IMAGE_FIELDS.forEach((field) => {
            if (req.body[field]) {
                imageFieldData[field] = req.body[field];
                delete req.body[field];
            }
        });

        const { AttachDocuments, ...rest } = req.body;
        const flatSet = flattenObject(rest);

        if (req.user?.role === "FieldOfficer") {
            flatSet.isReportSubmitted = true;
        }

        const updateQuery = {};
        if (Object.keys(flatSet).length > 0) {
            updateQuery.$set = flatSet;
        }

        // Handle image arrays - add new ones
        IMAGE_FIELDS.forEach((field) => {
            if (imageFieldData[field]?.length > 0) {
                const cleanUrls = sanitizeImages(imageFieldData[field]).map((url) => ({
                    url,
                }));
                if (cleanUrls.length > 0) {
                    if (!updateQuery.$addToSet) updateQuery.$addToSet = {};
                    updateQuery.$addToSet[field] = { $each: cleanUrls };
                }
            }
        });

        const updated = await BajajHousing.findByIdAndUpdate(
            req.params.id,
            updateQuery,
            { new: true, runValidators: false }
        );

        if (!updated)
            return res.status(404).json({ success: false, message: "Not found" });

        // Notification
        try {
            const notif = await Notification.create({
                userId: req.user?._id,
                caseId: req.params.id,
                message: "Updated Bajaj Housing Finance report",
                bankName: "Bajaj Housing Finance",
            });
            if (req.io) req.io.emit("newNotification", notif);
        } catch (_) { }

        res.json({ success: true, updated });
    } catch (err) {
        console.error("updateReport error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── UPLOAD IMAGE ─────────────────────────────────────────────────────────────
// POST /api/bajaj-housing/upload-image
// Body (multipart/form-data): file, reportId (optional), imageType (optional), latitude, longitude
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "No file received" });
        }

        const fileName = `bajaj_housing_${Date.now()}_${req.file.originalname}`;
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName,
            folder: "/bajaj-housing-reports",
        });

        const latitude = String(req.body.latitude || "").trim();
        const longitude = String(req.body.longitude || "").trim();
        const imageType = req.body.imageType || "otherImages"; // frontElevationImages | kitchenImages | selfieImages | otherImages

        if (req.body.reportId) {
            const updateQuery = {
                $addToSet: {
                    [imageType]: { url: result.url, fileId: result.fileId },
                },
            };
            if (latitude && longitude) {
                updateQuery.$set = {
                    "locationDetails.latitude": latitude,
                    "locationDetails.longitude": longitude,
                };
            }
            await BajajHousing.findByIdAndUpdate(req.body.reportId, updateQuery);
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

// ─── UPLOAD DOCUMENT ──────────────────────────────────────────────────────────
exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "No file received" });
        }

        const fileName = `bajaj_housing_doc_${Date.now()}_${req.file.originalname}`;
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName,
            folder: "/bajaj-housing-documents",
        });

        if (req.body.reportId) {
            await BajajHousing.findByIdAndUpdate(req.body.reportId, {
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

// ─── DELETE FILE (IMAGE OR DOCUMENT) ─────────────────────────────────────────
exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const { fileId, type, imageType } = req.body;
        // type: "image" | "document"
        // imageType: "frontElevationImages" | "kitchenImages" | "selfieImages" | "otherImages"

        if (!fileId) {
            return res
                .status(400)
                .json({ success: false, message: "fileId is required" });
        }

        // Delete from ImageKit
        await imagekit.deleteFile(fileId);

        let updateQuery = {};
        if (type === "image") {
            const field = IMAGE_FIELDS.includes(imageType) ? imageType : "otherImages";
            updateQuery = { $pull: { [field]: { fileId } } };
        } else if (type === "document") {
            updateQuery = { $pull: { AttachDocuments: { fileId } } };
        } else {
            return res
                .status(400)
                .json({ success: false, message: "Invalid type" });
        }

        const updated = await BajajHousing.findByIdAndUpdate(id, updateQuery, {
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