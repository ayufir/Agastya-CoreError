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

    if (req.user?._id) {
      body.createdBy = req.user._id;
    }

    if (req.user?.role === "FieldOfficer") {
      body.assignedTo = req.user._id;
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
    const reports = await IciciBank.find().sort({ createdAt: -1 });
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
    const updateBody = {
      ...req.body,
      bankName: req.body.bankName || "Icici",
      route: req.body.route || "icici",
    };

    // Sanitize createdBy — agar frontend se populated object aaya toh sirf _id lo
    if (updateBody.createdBy && typeof updateBody.createdBy === "object") {
      updateBody.createdBy = updateBody.createdBy._id;
    }

    if (!updateBody.createdBy && req.user?._id) {
      updateBody.createdBy = req.user._id;
    }

    // Sanitize assignedTo — same fix
    if (updateBody.assignedTo && typeof updateBody.assignedTo === "object") {
      updateBody.assignedTo = updateBody.assignedTo._id;
    }

    if (req.user?.role === "FieldOfficer" && !updateBody.assignedTo) {
      updateBody.assignedTo = req.user._id;
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

    if (!updateData.createdBy && req.user?._id) {
      updateData.createdBy = req.user._id;
    }

    if (updateData.assignedTo && typeof updateData.assignedTo === "object") {
      updateData.assignedTo = updateData.assignedTo._id;
    }

    if (req.user?.role === "FieldOfficer" && !updateData.assignedTo) {
      updateData.assignedTo = req.user._id;
    }

    const updated = await IciciBank.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: false,
    });

    if (!updated) {
      return res.status(404).json({ message: "Report not found" });
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
