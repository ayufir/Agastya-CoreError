const Fedral = require("../../model/Banks/FedralModel");

// CREATE new ICICI bank entry
exports.createFedralBank = async (req, res) => {
  try {
    const newReport = await Fedral.create(req.body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create report", error: error.message });
  }
};

// GET all ICICI bank entries
exports.getAllFedralBanks = async (req, res) => {
  try {
    const reports = await Fedral.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reports", error: error.message });
  }
};

// GET single ICICI bank entry by ID
exports.getIciciFedralById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Fedral.findById(id);

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

// UPDATE details
exports.updateDetails = async (req, res) => {
  try {
    const updatedDetails = await Fedral.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDetails) {
      return res.status(404).json({
        success: false,
        message: "Details not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Details updated successfully",
      data: updatedDetails,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE details
exports.deleteDetails = async (req, res) => {
  try {
    const deletedDetails = await Fedral.findByIdAndDelete(req.params.id);

    if (!deletedDetails) {
      return res.status(404).json({
        success: false,
        message: "Details not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Details deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
