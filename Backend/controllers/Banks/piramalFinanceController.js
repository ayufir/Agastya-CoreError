const PiramalFinanceModel = require("../../model/Banks/priamalFinanceModel");

// Create a new Piramal Finance record
exports.createRecord = async (req, res) => {
  try {
    // Create a new document from the model
    const newPiramalFinanceData = new PiramalFinanceModel(req.body);

    // Save to the database
    await newPiramalFinanceData.save();

    // Return a success response
    res.status(201).json({
      message: "Data saved successfully",
      data: newPiramalFinanceData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error saving data",
      error: error.message,
    });
  }
};

// exports.createRecord = async (req, res) => {
//   try {
//     console.log("Received req.body:", req.body);

//     // Directly use req.body as it matches the schema structure
//     const propertyData = req.body;

//     console.log("Property data to save:", propertyData);

//     // Create a new instance of the model with the provided data
//     const newProperty = new PiramalFinanceModel(propertyData);

//     // Save the new property to the database
//     const savedProperty = await newProperty.save();
//     console.log("Saved property:", savedProperty);

//     // Send back the saved property in the response
//     res.status(201).json(savedProperty);
//   } catch (error) {
//     console.error("Error saving property:", error);
//     if (error.name === "ValidationError") {
//       console.log("Validation errors:", error.errors);
//     }
//     // Send an error response
//     res
//       .status(500)
//       .json({ message: "Failed to save property", error: error.message });
//   }
// };

// Get all Piramal Finance records
exports.getAllRecords = async (req, res) => {
  try {
    const records = await PiramalFinanceModel.find();
    res.status(200).json({
      success: true,
      data: records,
      message: "Records retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving records",
      error: error.message,
    });
  }
};

// Get a single Piramal Finance record by ID
exports.getRecordById = async (req, res) => {
  try {
    const record = await PiramalFinanceModel.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }
    res.status(200).json({
      success: true,
      data: record,
      message: "Record retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving record",
      error: error.message,
    });
  }
};

// Update a Piramal Finance record by ID
exports.updateRecord = async (req, res) => {
  try {
    const record = await PiramalFinanceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure schema validations are applied
      }
    );
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }
    res.status(200).json({
      success: true,
      data: record,
      message: "Record updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating record",
      error: error.message,
    });
  }
};

// Delete a Piramal Finance record by ID
exports.deleteRecord = async (req, res) => {
  try {
    const record = await PiramalFinanceModel.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting record",
      error: error.message,
    });
  }
};
