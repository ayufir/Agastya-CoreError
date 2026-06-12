const PropertyValuation = require("../../model/Banks/agriwiseModel");

// @desc    Create new property valuation

exports.createPropertyValuation = async (req, res) => {
  try {
    const newValuation = new PropertyValuation(req.body);
    const savedValuation = await newValuation.save();
    res.status(201).json({ success: true, savedValuation });
  } catch (error) {
    console.error("Error creating valuation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create property valuation",
      error: error.message,
    });
  }
};

// @desc    Get all property valuations
exports.getAllPropertyValuations = async (req, res) => {
  try {
    const valuations = await PropertyValuation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, valuations });
  } catch (error) {
    console.error("Error fetching valuations:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch property valuations" });
  }
};

// @desc    Get a single property valuation by ID

exports.getPropertyValuationById = async (req, res) => {
  try {
    const valuation = await PropertyValuation.findById(req.params.id);
    if (!valuation) {
      return res
        .status(404)
        .json({ success: false, message: "Valuation not found" });
    }
    res.status(200).json({ success: true, valuation });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch valuation",
      error: error.message,
    });
  }
};
