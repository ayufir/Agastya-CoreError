// controllers/cholaController.js
const CholaModel = require("../../model/Banks/cholaModel"); // Importing the Chola Model

// Save Chola data
const saveCholaData = async (req, res) => {
  console.log(req.body);

  try {
    const newCholaData = new CholaModel(req.body); // Create a new document from request body
    await newCholaData.save(); // Save the data to MongoDB

    res.status(201).json({
      message: "Chola data saved successfully!",
      newCholaData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error saving Chola data.",
      error: error.message,
    });
  }
};

// Get all Chola data
const getAllCholaData = async (req, res) => {
  try {
    const allCholaData = await CholaModel.find(); // Fetch all documents from the database
    res.status(200).json(allCholaData); // Send the retrieved data back to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving Chola data.",
      error: error.message,
    });
  }
};
const getCholaDataById = async (req, res) => {
  try {
    const details = await CholaModel.findById(req.params.id);
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

module.exports = { saveCholaData, getAllCholaData, getCholaDataById };
