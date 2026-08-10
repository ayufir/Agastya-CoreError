const HomeTrenchReport = require("../../model/Banks/homeTrenchModel");

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

// Create a new Home Trench Report
exports.createHomeTrenchReport = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.user) {
      body.createdBy = req.user._id;
    }
    if (req.body.createdAt) {
      body.createdAt = new Date(req.body.createdAt);
    } else if (req.body.dateOfVisit) {
      body.createdAt = new Date(req.body.dateOfVisit);
    } else if (req.body.dateOfReport) {
      body.createdAt = new Date(req.body.dateOfReport);
    }
    if (!body.bankName) {
      body.bankName = "HomeFirstTrench";
    }

    const report = new HomeTrenchReport(body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error("createHomeTrenchReport error:", error);
    res.status(400).json({ error: error.message, message: error.message });
  }
};



/// delete image
exports.deleteImageFromValuationReport = async (req, res) => {
  try {
    const { id } = req.params; // document ID
    const { imageUrl } = req.body; // URL to remove

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }

    console.log(imageUrl, "POIUYTREWQ")
    console.log(id, "ASDFGHJK")

    const updatedJob = await HomeTrenchReport.findByIdAndUpdate(
      id,
      { $pull: { imageUrls: imageUrl } },
      { new: true }
    );

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

exports.deleteDocumentFromReport = async (req, res) => {
  try {
    const { documentUrl } = req.body;
    if (!documentUrl) {
      return res.status(400).json({ message: "documentUrl is required" });
    }

    const updatedJob = await HomeTrenchReport.findByIdAndUpdate(
      req.params.id,
      buildAssetPullQuery("AttachDocuments", documentUrl),
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      message: "Document removed successfully",
      updatedJob,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting document",
      error: error.message,
    });
  }
};



// Get all Home Trench Reports
exports.getAllHomeTrenchReports = async (req, res) => {
  try {
    const reports = await HomeTrenchReport.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Home Trench Report by ID
exports.getHomeTrenchReportById = async (req, res) => {
  try {
    const report = await HomeTrenchReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Home Trench Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Home Trench Report by ID
exports.updateHomeTrenchReport = async (req, res) => {
  try {
    const { imageUrls, timeline, ...otherFields } = req.body;
    const dateCandidate =
      otherFields.createdAt ||
      otherFields.dateOfVisit ||
      otherFields.dateOfReport ||
      otherFields.dateOfInspection ||
      otherFields.visitDate ||
      otherFields.inspectionDate;

    if (dateCandidate) {
      const parsed = new Date(dateCandidate);
      if (!isNaN(parsed.getTime())) {
        otherFields.createdAt = parsed;
      }
    }

    const updateQuery = {};

    // Set all fields except imageUrls
    if (Object.keys(otherFields).length > 0) {
      updateQuery.$set = otherFields;
    }

    // Append new images without overwriting existing ones
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      updateQuery.$addToSet = {
        imageUrls: { $each: imageUrls },
      };
    }

    // Field Officer auto-status update
    const isFO = (req.user?.role || "").toLowerCase().trim() === "fieldofficer";
    if (isFO) {
      if (!updateQuery.$set) updateQuery.$set = {};
      const isSubmitting = req.body.isReportSubmitted === true || req.body.isSubmit === true;
      updateQuery.$set["isReportSubmitted"] = isSubmitting;
      updateQuery.$set["status"] = "Work in Progress";
      if (isSubmitting) {
        if (!updateQuery.$push) updateQuery.$push = {};
        updateQuery.$push["timeline"] = {
          status: "submitted-by-fo",
          updatedAt: new Date(),
          updatedBy: req.user._id,
          note: "Submitted by field officer",
        };
      }
    }

    const report = await HomeTrenchReport.findByIdAndUpdate(
      req.params.id,
      updateQuery,
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ error: "Home Trench Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    console.error("updateHomeTrenchReport error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a Home Trench Report by ID
exports.deleteHomeTrenchReport = async (req, res) => {
  try {
    const report = await HomeTrenchReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Home Trench Report not found" });
    }
    res
      .status(204)
      .json({ message: "Home Trench Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
