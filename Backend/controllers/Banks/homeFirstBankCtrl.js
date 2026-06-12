const ValuationReport = require("../../model/Banks/homeFirstModel");
const Notification = require("../../model/Notification");
const { deleteImage } = require("../../config/imageUploader");

const getAssetUrl = (asset) =>
  typeof asset === "string" ? asset : asset?.url || "";

const buildAssetPullQuery = (fieldName, asset) => {
  if (typeof asset === "string") {
    return { $pull: { [fieldName]: asset } };
  }

  if (asset?.fileId) {
    return { $pull: { [fieldName]: { fileId: asset.fileId } } };
  }

  if (asset?.url) {
    return { $pull: { [fieldName]: { url: asset.url } } };
  }

  return { $pull: { [fieldName]: asset } };
};

// Create a new valuation report
exports.createValuationReport = async (req, res) => {
  console.log(req.body);
  try {
    const body = { ...req.body };
    if (req.user) {
      body.createdBy = req.user._id;
    }



    if (req.body.createdAt) {
      body.createdAt = new Date(req.body.createdAt);
    }


    const newReport = new ValuationReport(body);
    const savedReport = await newReport.save();
    res.status(201).json({
      success: true,
      message: "Valuation report created successfully",
      data: savedReport,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating valuation report",
      error: error.message,
    });
  }
};

// Get all valuation reports
exports.getAllValuationReports = async (req, res) => {
  try {
    let query = {};
    if (req.user?.role === "Admin") {
      query.createdBy = req.user._id;
    } else if (req.user?.role === "FieldOfficer") {
      query.assignedTo = req.user._id;
    }

    const reports = await ValuationReport.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching valuation reports",
      error: error.message,
    });
  }
};

// Get a single valuation report by ID
exports.getValuationReportById = async (req, res) => {
  try {
    const report = await ValuationReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Valuation report not found",
      });
    }
    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching valuation report",
      error: error.message,
    });
  }
};

exports.updateValuationReportById = async (req, res) => {
  try {
    console.log("UPDATE VALUATION REPORT REQ BODY:", req.body);
    const fs = require("fs");
    const path = require("path");
    fs.writeFileSync(
      path.join(__dirname, "../../backend-debug.json"),
      JSON.stringify({ timestamp: new Date().toISOString(), body: req.body }, null, 2)
    );
    const { imageUrls, timeline, ...otherFields } = req.body;
    const caseId = req.params.id;

    const updateQuery = {};

    if (Object.keys(otherFields).length > 0) {
      updateQuery.$set = otherFields;
    }

    if (imageUrls && imageUrls.length > 0) {
      updateQuery.$addToSet = {
        imageUrls: { $each: imageUrls },
      };
    }

    // Add timeline entry if user is a field officer
    if (req.user.role === "FieldOfficer") {
      if (!updateQuery.$set) updateQuery.$set = {};
      updateQuery.$set["isReportSubmitted"] = true;
      updateQuery.$set["status"] = "Work in Progress";

      if (!updateQuery.$push) updateQuery.$push = {};
      updateQuery.$push["timeline"] = {
        status: "submitted-by-fo",
        updatedAt: new Date(),
        updatedBy: req.user._id,
        note: "Updated by field officer",
      };
    }


    const updatedJob = await ValuationReport.findByIdAndUpdate(
      caseId,
      updateQuery,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const notif = await Notification.create({
      userId: req.user._id,
      caseId,
      message: `Updated by ${req.user.name || "User"}`,
      bankName: "Home First",
    });

    if (req.io) {
      console.log(req.io, "HOME FIRS CTRL");
      req.io.emit("newNotification", notif);
    }

    res.status(200).json({
      message: "Updated successfully",
      updatedJob,
    });
  } catch (error) {
    console.log(error.message);
    const fs = require("fs");
    const path = require("path");
    fs.writeFileSync(
      path.join(__dirname, "../../error-log.txt"),
      JSON.stringify({ timestamp: new Date().toISOString(), message: error.message, stack: error.stack }, null, 2)
    );
    res.status(500).json({
      message: "Error updating Job Assignment",
      error,
    });
  }
};

exports.deleteImageFromValuationReport = async (req, res) => {
  try {
    const { id } = req.params; // document ID
    const { imageUrl, fieldName = "imageUrls" } = req.body; // URL to remove

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }

    const assetUrl = getAssetUrl(imageUrl);
    if (assetUrl) {
      try {
        await deleteImage(assetUrl);
      } catch (storageError) {
        console.warn("Home First image storage delete failed:", storageError.message);
      }
    }

    const updatedJob = await ValuationReport.findByIdAndUpdate(id, buildAssetPullQuery(fieldName, imageUrl), {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Image URL deleted successfully",
      updatedJob,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting image",
      error,
    });
  }
};

exports.unassignFieldOfficer = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id; // assuming you use auth middleware

  try {
    const updatedBank = await ValuationReport.findByIdAndUpdate(
      id,
      {
        assignedTo: null,
        status: "Pending",
        $push: {
          timeline: {
            status: "Pending",
            updatedAt: new Date(),
            updatedBy: userId,
            note: "Unassigned due to unavailability",
          },
        },
      },
      { new: true }
    );

    if (!updatedBank) {
      return res.status(404).json({ message: "Valuation report not found" });
    }

    res.status(200).json({
      message: "Field Officer unassigned and status reset to Pending",
      data: updatedBank,
    });
  } catch (err) {
    console.error("Unassignment failed:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


// Delete document from AttachDocuments array
exports.deleteDocumentFromValuationReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentUrl } = req.body;

    if (!documentUrl) {
      return res.status(400).json({ message: "documentUrl is required" });
    }

    const assetUrl = getAssetUrl(documentUrl);
    if (assetUrl) {
      try {
        await deleteImage(assetUrl);
      } catch (storageError) {
        console.warn("Home First document storage delete failed:", storageError.message);
      }
    }

    const updatedJob = await ValuationReport.findByIdAndUpdate(
      id,
      buildAssetPullQuery("AttachDocuments", documentUrl),
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Document URL deleted successfully",
      updatedJob,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting document",
      error,
    });
  }
};
