const PiramalModel = require("../../model/Banks/piramalModel"); // Adjust path as needed

// Create new details record
const createDetails = async (req, res) => {
  try {
    const newDetails = new PiramalModel(req.body);
    const savedDetails = await newDetails.save();
    res.status(201).json({
      success: true,
      message: "Details record created successfully",
      data: savedDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create details record",
      error: error.message,
    });
  }
};

// Get all details records
const getAllDetailss = async (req, res) => {
  try {
    const detailss = await PiramalModel.find();
    res.status(200).json({
      success: true,
      message: "All details records retrieved",
      data: detailss,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve details records",
      error: error.message,
    });
  }
};

// Get single details by ID
const getDetailsById = async (req, res) => {
  try {
    const details = await PiramalModel.findById(req.params.id);
    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Details record not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Details record retrieved",
      data: details,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve details record",
      error: error.message,
    });
  }
};

// Update details record
const updateDetails = async (req, res) => {
  try {
    const updatedDetails = await PiramalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedDetails) {
      return res.status(404).json({
        success: false,
        message: "Details record not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Details record updated successfully",
      data: updatedDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update details record",
      error: error.message,
    });
  }
};

// Delete details record
const deleteDetails = async (req, res) => {
  try {
    const deletedDetails = await PiramalModel.findByIdAndDelete(req.params.id);
    if (!deletedDetails) {
      return res.status(404).json({
        success: false,
        message: "Details record not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Details record deleted successfully",
      data: deletedDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete details record",
      error: error.message,
    });
  }
};

// Search detailss with filters
const searchDetailss = async (req, res) => {
  try {
    const { applicantName, city, detailsReportStatus, ...otherFilters } =
      req.query;
    const query = {};

    if (applicantName)
      query.applicantName = { $regex: applicantName, $options: "i" };
    if (city) query.city = { $regex: city, $options: "i" };
    if (detailsReportStatus) query.detailsReportStatus = detailsReportStatus;

    // Add other filters
    Object.keys(otherFilters).forEach((key) => {
      if (otherFilters[key]) query[key] = otherFilters[key];
    });

    const detailss = await PiramalModel.find(query);
    res.status(200).json({
      success: true,
      message: "Detailss retrieved with filters",
      data: detailss,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search details records",
      error: error.message,
    });
  }
};

module.exports = {
  createDetails,
  getAllDetailss,
  getDetailsById,
  updateDetails,
  deleteDetails,
  searchDetailss,
};
