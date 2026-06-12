const Bajaj = require("../../model/Banks/BajajAmeriyaModel");

// 📌 Create a new report
exports.createReport = async (req, res) => {
  try {
    const report = new Bajaj(req.body);
    await report.save();
    res
      .status(201)
      .json({ message: "Report created successfully", data: report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Bajaj.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Bajaj.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Update report
exports.updateReport = async (req, res) => {
  try {
    const updatedReport = await Bajaj.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReport)
      return res.status(404).json({ message: "Report not found" });
    res.status(200).json({ message: "Report updated", data: updatedReport });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Delete report
exports.deleteReport = async (req, res) => {
  try {
    const deletedReport = await Bajaj.findByIdAndDelete(req.params.id);
    if (!deletedReport)
      return res.status(404).json({ message: "Report not found" });
    res.status(200).json({ message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
