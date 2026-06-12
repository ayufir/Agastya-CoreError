const Bajaj = require("../../model/Banks/BajajModel");
const imagekit = require("../../config/imagekit");

const sanitizeMedia = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => {
      if (typeof item === "string") {
        return item.startsWith("http") ? { url: item } : null;
      }

      if (!item?.url || !String(item.url).startsWith("http")) {
        return null;
      }

      return {
        url: item.url,
        fileId: item.fileId || "",
        name: item.name || "",
        latitude: item.latitude || "",
        longitude: item.longitude || "",
        capturedAt: item.capturedAt || "",
      };
    })
    .filter(Boolean);

const parseLatLongString = (latLong = "") => {
  const [latitude = "", longitude = ""] = String(latLong)
    .split(",")
    .map((value) => value.trim());

  return { latitude, longitude };
};

const buildLocation = (body = {}) => {
  const directLatitude =
    body?.location?.latitude || body?.latitude || body?.imageLatitude || "";
  const directLongitude =
    body?.location?.longitude || body?.longitude || body?.imageLongitude || "";

  if (directLatitude || directLongitude) {
    return {
      latitude: String(directLatitude || "").trim(),
      longitude: String(directLongitude || "").trim(),
    };
  }

  if (body?.latLong) {
    return parseLatLongString(body.latLong);
  }

  return { latitude: "", longitude: "" };
};

const formatLatLong = ({ latitude = "", longitude = "" } = {}) =>
  latitude && longitude ? `${latitude}, ${longitude}` : "";

const createTimelineEntry = (status, updatedBy, note) => ({
  status,
  updatedAt: new Date(),
  updatedBy,
  note,
});

const normalizePayload = (payload = {}, req) => {
  const body = { ...payload };
  const location = buildLocation(body);

  body.location = location;
  body.latLong = body.latLong || formatLatLong(location);
  body.mapView =
    body.mapView === "satellite" || body.mapView === "roadmap"
      ? body.mapView
      : "roadmap";
  body.route = body.route || "bajaj";
  body.bankName = body.bankName || "Bajaj Bank";
  body.imageUrls = sanitizeMedia(body.imageUrls);
  body.AttachDocuments = sanitizeMedia(body.AttachDocuments);

  if (req?.user?._id && !body.createdBy) {
    body.createdBy = req.user._id;
  }

  return body;
};

const getSubmitUpdate = (submitAction, req) => {
  if (submitAction !== "final-submit") {
    return null;
  }

  return {
    status: "FinalSubmitted",
    isReportSubmitted: true,
    reportSubmittedAt: new Date(),
    timelineEntry: createTimelineEntry(
      "FinalSubmitted",
      req?.user?._id,
      req?.user?.role === "FieldOfficer"
        ? "Report submitted by field officer"
        : "Report submitted"
    ),
  };
};

exports.createValuationReport = async (req, res) => {
  try {
    const { submitAction, ...rest } = req.body;
    const body = normalizePayload(rest, req);
    const submitUpdate = getSubmitUpdate(submitAction, req);

    if (submitUpdate) {
      body.status = submitUpdate.status;
      body.isReportSubmitted = submitUpdate.isReportSubmitted;
      body.reportSubmittedAt = submitUpdate.reportSubmittedAt;
      body.timeline = [...(body.timeline || []), submitUpdate.timelineEntry];
    } else if (!body.timeline?.length) {
      body.timeline = [
        createTimelineEntry("Pending", req?.user?._id, "Bajaj case created"),
      ];
    }


    if (req.body.createdAt) {
      body.createdAt = new Date(req.body.createdAt);
    }


    const report = await Bajaj.create(body);
    res.status(201).json(report);
  } catch (error) {
    console.error("Error creating Bajaj valuation report:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllValuationReports = async (req, res) => {
  try {
    let query = {};
    if (req.user?.role === "Admin") {
      query.createdBy = req.user._id;
    } else if (req.user?.role === "FieldOfficer") {
      query.assignedTo = req.user._id;
    }

    const reports = await Bajaj.find(query).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getValuationReportById = async (req, res) => {
  try {
    const report = await Bajaj.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Valuation report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateValuationReport = async (req, res) => {
  try {
    const { submitAction, ...rest } = req.body;
    const updateData = normalizePayload(rest, req);
    const submitUpdate = getSubmitUpdate(submitAction, req);

    if (submitUpdate) {
      updateData.status = submitUpdate.status;
      updateData.isReportSubmitted = submitUpdate.isReportSubmitted;
      updateData.reportSubmittedAt = submitUpdate.reportSubmittedAt;
    }

    const updateQuery = {
      $set: updateData,
    };

    if (submitUpdate?.timelineEntry) {
      updateQuery.$push = {
        timeline: submitUpdate.timelineEntry,
      };
    }

    const report = await Bajaj.findByIdAndUpdate(req.params.id, updateQuery, {
      new: true,
      runValidators: true,
    });

    if (!report) {
      return res.status(404).json({ error: "Valuation report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error updating Bajaj valuation report:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteValuationReport = async (req, res) => {
  try {
    const report = await Bajaj.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Valuation report not found" });
    }

    res.status(204).json({ message: "Valuation report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file received" });
    }

    const fileName = `bajaj_${Date.now()}_${req.file.originalname}`;
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName,
      folder: "/bajaj-reports",
    });

    const latitude = String(req.body.latitude || "").trim();
    const longitude = String(req.body.longitude || "").trim();
    const mapView =
      req.body.mapView === "satellite" || req.body.mapView === "roadmap"
        ? req.body.mapView
        : undefined;

    if (req.body.reportId) {
      const imageEntry = {
        url: result.url,
        fileId: result.fileId,
        latitude,
        longitude,
        capturedAt: new Date().toISOString(),
      };

      const updateQuery = {
        $addToSet: {
          imageUrls: imageEntry,
        },
      };

      if (latitude && longitude) {
        updateQuery.$set = {
          "location.latitude": latitude,
          "location.longitude": longitude,
          latLong: `${latitude}, ${longitude}`,
        };

        if (mapView) {
          updateQuery.$set.mapView = mapView;
        }
      } else if (mapView) {
        updateQuery.$set = { mapView };
      }

      await Bajaj.findByIdAndUpdate(req.body.reportId, updateQuery);
    }

    res.status(200).json({
      success: true,
      url: result.url,
      fileId: result.fileId,
      latitude,
      longitude,
      capturedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Bajaj image upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file received" });
    }

    const fileName = `bajaj_doc_${Date.now()}_${req.file.originalname}`;
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName,
      folder: "/bajaj-documents",
    });

    const documentEntry = {
      url: result.url,
      fileId: result.fileId,
      name: req.file.originalname,
      capturedAt: new Date().toISOString(),
    };

    if (req.body.reportId) {
      await Bajaj.findByIdAndUpdate(req.body.reportId, {
        $addToSet: {
          AttachDocuments: documentEntry,
        },
      });
    }

    res.status(200).json({
      success: true,
      ...documentEntry,
    });
  } catch (error) {
    console.error("Bajaj document upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileId, type } = req.body;

    if (!fileId) {
      return res.status(400).json({ success: false, message: "fileId is required" });
    }

    await imagekit.deleteFile(fileId);

    let updateQuery = null;
    if (type === "image") {
      updateQuery = { $pull: { imageUrls: { fileId } } };
    } else if (type === "document") {
      updateQuery = { $pull: { AttachDocuments: { fileId } } };
    }

    if (!updateQuery) {
      return res.status(400).json({ success: false, message: "Invalid file type" });
    }

    const report = await Bajaj.findByIdAndUpdate(id, updateQuery, { new: true });
    if (!report) {
      return res.status(404).json({ success: false, message: "Valuation report not found" });
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("Bajaj file delete error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUploadedFile = async (req, res) => {
  try {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({ success: false, message: "fileId is required" });
    }

    await imagekit.deleteFile(fileId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Bajaj temp file delete error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
