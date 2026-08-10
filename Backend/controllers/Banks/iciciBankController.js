const IciciBank = require("../../model/Banks/IciciBankModel");

// CREATE new ICICI bank entry
exports.createIciciBank = async (req, res) => {
  try {
    const body = {
      ...req.body,
      bankName: req.body.bankName || "Icici",
      route: req.body.route || "icici",
      status: req.body.status || "Pending",
      approvalStatus: req.body.approvalStatus || "Pending",
    };

    delete body._id;
    delete body.id;

    const dateCandidate =
      req.body.createdAt ||
      req.body.visitDate ||
      req.body.dateOfVisit ||
      req.body.dateOfInspection;

    if (dateCandidate) {
      const parsed = new Date(dateCandidate);
      if (!isNaN(parsed.getTime())) {
        body.createdAt = parsed;
      }
    }

    const newReport = await IciciBank.create(body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create report", error: error.message });
  }
};

// GET all ICICI bank entries
exports.getAllIciciBanks = async (req, res) => {
  try {
    let query = {};
    if (req.user) {
      const userRole = (req.user.role || "").toLowerCase().trim();
      if (userRole === "fieldofficer") {
        query.assignedTo = req.user._id;
      }
    }
    const reports = await IciciBank.find(query).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reports", error: error.message });
  }
};

// GET single ICICI bank entry by ID
exports.getIciciBankById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await IciciBank.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Access control for FieldOfficer
    if (req.user) {
      const userRole = (req.user.role || "").toLowerCase().trim();
      if (userRole === "fieldofficer") {
        const assignedId = report.assignedTo?.toString();
        const createdById = report.createdBy?.toString();
        if (assignedId !== req.user._id.toString() && createdById !== req.user._id.toString()) {
          return res.status(403).json({ message: "Access denied. This case is not assigned to you." });
        }
      }
    }

    res.status(200).json(report);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch report", error: error.message });
  }
};

// UPDATE ICICI bank entry (Save / Save & Next)
exports.updateIciciBank = async (req, res) => {
  console.log(req.body, "ICICI UPDATE controller");
  try {
    const existing = await IciciBank.findById(req.params.id);

    const updateBody = {
      ...req.body,
      bankName: req.body.bankName || "Icici",
      route: req.body.route || "icici",
    };

    // Sanitize createdBy — agar frontend se populated object aaya toh sirf _id lo
    if (updateBody.createdBy && typeof updateBody.createdBy === "object") {
      updateBody.createdBy = updateBody.createdBy._id;
    }

    if (existing && existing.createdBy) {
      updateBody.createdBy = existing.createdBy;
    } else if (!updateBody.createdBy && req.user?._id) {
      updateBody.createdBy = req.user._id;
    }

    // Sanitize assignedTo — same fix
    if (updateBody.assignedTo && typeof updateBody.assignedTo === "object") {
      updateBody.assignedTo = updateBody.assignedTo._id;
    }

    if (existing && existing.assignedTo && !updateBody.assignedTo) {
      updateBody.assignedTo = existing.assignedTo;
    }

    const isFO = (req.user?.role || "").toLowerCase().trim() === "fieldofficer";
    if (isFO) {
      if (!updateBody.assignedTo) {
        updateBody.assignedTo = req.user._id;
      }
      updateBody.isReportSubmitted = req.body.isReportSubmitted === true || req.body.isSubmit === true;
      updateBody.status = "Work in Progress";
    }

    const dateCandidate =
      req.body.createdAt ||
      req.body.visitDate ||
      req.body.dateOfVisit ||
      req.body.dateOfInspection;

    if (dateCandidate) {
      const parsed = new Date(dateCandidate);
      if (!isNaN(parsed.getTime())) {
        updateBody.createdAt = parsed;
      }
    }

    const updatedJob = await IciciBank.findByIdAndUpdate(
      req.params.id,
      updateBody,
      { new: true, runValidators: false }
    );
    if (!updatedJob) return res.status(404).json({ message: "Report not found" });
    res.status(200).json({ message: "Updated successfully", updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Error updating report", error });
  }
};

// SUBMIT ICICI Bank Report (Save Report button)
exports.submitIciciBank = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await IciciBank.findById(id);

    const updateData = {
      ...req.body,
      bankName: req.body.bankName || "Icici",
      route: req.body.route || "icici",
      isReportSubmitted: true,
      approvalStatus: req.body.status === "FinalSubmitted" ? "FinalSubmitted" : "Submitted",
      status: req.body.status === "FinalSubmitted" ? "FinalSubmitted" : "Submitted",
    };

    // Sanitize populated objects — frontend se object aaye to sirf _id save karo
    if (updateData.createdBy && typeof updateData.createdBy === "object") {
      updateData.createdBy = updateData.createdBy._id;
    }

    if (existing && existing.createdBy) {
      updateData.createdBy = existing.createdBy;
    } else if (!updateData.createdBy && req.user?._id) {
      updateData.createdBy = req.user._id;
    }

    if (updateData.assignedTo && typeof updateData.assignedTo === "object") {
      updateData.assignedTo = updateData.assignedTo._id;
    }

    const dateCandidate =
      req.body.createdAt ||
      req.body.visitDate ||
      req.body.dateOfVisit ||
      req.body.dateOfInspection;

    if (dateCandidate) {
      const parsed = new Date(dateCandidate);
      if (!isNaN(parsed.getTime())) {
        updateData.createdAt = parsed;
      }
    }

    const updateQuery = { $set: updateData };

    if (isFO) {
      updateData.status = "Work in Progress";
      updateData.approvalStatus = "Submitted";
      
      const timelineEntry = {
        status: "submitted-by-fo",
        updatedAt: new Date(),
        updatedBy: req.user._id,
        note: "Submitted by field officer"
      };

      // Remove timeline from updateData so it doesn't conflict with $push
      delete updateData.timeline;
      updateQuery.$push = { timeline: timelineEntry };
    }

    const updated = await IciciBank.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: false,
    });

    if (!updated) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Notification to ASSIGNER (createdBy) — non-blocking
    try {
      const Notification = require("../../model/Notification");
      const assignerId = updated.createdBy;  // The person who assigned this case to FO
      const foDisplayName = req.user?.name || req.user?.email || "Field Officer";
      const customerName = updated.customerName || updated.applicantName || "N/A";

      const notif = await Notification.create({
        userId:   assignerId,             // → ASSIGNER gets the notification (not the FO)
        caseId:   id,
        bankName: "ICICI Bank",
        message:  `📋 ${foDisplayName} ne case submit kiya: ${customerName} (ICICI Bank)`,
        type:     "fo_submit",
        route:    `/bank/icici/edit/${id}`,
        foName:   foDisplayName,
        isRead:   false,
      });

      // Emit only to the assigner's personal socket room
      const io = req.io || global.io;
      if (io && assignerId) {
        io.to(assignerId.toString()).emit("newNotification", notif);
      }
    } catch (_) {
      /* notification failure should not break submit */
    }

    res.status(200).json({
      message: "Report submitted successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit report",
      error: error.message,
    });
  }
};
