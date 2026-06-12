const DmiFinanceReport = require("../../model/Banks/DmiFinanceModel");

// Create a new DMI Finance Report
exports.createDmiFinanceReport = async (req, res) => {
  try {
    const report = new DmiFinanceReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all DMI Finance Reports
exports.getAllDmiFinanceReports = async (req, res) => {
  try {
    const reports = await DmiFinanceReport.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single DMI Finance Report by ID
exports.getDmiFinanceReportById = async (req, res) => {
  try {
    const report = await DmiFinanceReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "DMI Finance Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a DMI Finance Report by ID
exports.updateDmiFinanceReport = async (req, res) => {
  try {
    const report = await DmiFinanceReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ error: "DMI Finance Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a DMI Finance Report by ID
exports.deleteDmiFinanceReport = async (req, res) => {
  try {
    const report = await DmiFinanceReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "DMI Finance Report not found" });
    }
    res
      .status(204)
      .json({ message: "DMI Finance Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
