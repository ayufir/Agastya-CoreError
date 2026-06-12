const Profectus = require("../../model/Banks/profectusModel");

// Create a new Bank Report
exports.createReport = async (req, res) => {
  try {
    const ProfectusData = req.body;

    // Create a new bank report from the data sent in the request body
    const newReport = new Profectus(ProfectusData);

    // Save the new report to the database
    const savedReport = await newReport.save();
    return res.status(201).json({
      success: true,
      message: "Bank report created successfully",
      data: savedReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error creating bank report",
      error: error.message,
    });
  }
};

// Get a Bank Report by ID
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the report by ID
    const report = await Profectus.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Bank report not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching bank report",
      error: error.message,
    });
  }
};

// Update a Bank Report by ID
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find and update the bank report by ID
    const updatedReport = await Profectus.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedReport) {
      return res.status(404).json({
        success: false,
        message: "Bank report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bank report updated successfully",
      data: updatedReport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating bank report",
      error: error.message,
    });
  }
};

// Get all Bank Reports (Optional)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Profectus.find();

    // if (reports.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No bank reports found",
    //   });
    // }

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching bank reports",
      error: error.message,
    });
  }
};
