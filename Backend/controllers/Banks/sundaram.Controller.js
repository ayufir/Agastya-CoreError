const ExtendedValuationReport = require("../../model/Banks/sundaram.Model.js");

// Create a new valuation report
exports.createExtendedValuation = async (req, res) => {
  try {
    const newReport = new ExtendedValuationReport(req.body);
    const savedReport = await newReport.save();
    res.status(201).json({
      message: "Valuation report created successfully",
      data: savedReport,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating report", error: error.message });
  }
};

// Get all valuation reports
exports.getAllExtendedValuations = async (req, res) => {
  try {
    const reports = await ExtendedValuationReport.find();
    res.status(200).json({ message: "Fetched all reports", data: reports });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
};

// Get a report by ID
exports.getExtendedValuationById = async (req, res) => {
  try {
    const report = await ExtendedValuationReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Valuation report not found" });
    }
    res.status(200).json({ message: "Fetched report by ID", data: report });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching report by ID", error: error.message });
  }
};
