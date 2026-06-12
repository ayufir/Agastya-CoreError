const IDFCS = require("../../model/Banks/idfcModal");

// Create a new document
const createIDFC = async (req, res) => {
  try {
    const newDoc = await IDFCS.create(req.body);
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ message: "Error creating record", error });
  }
};

// Get all documents
const getAllIDFC = async (req, res) => {
  try {
    const records = await IDFCS.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching records", error });
  }
};

// Get a single document by ID
const getIDFCById = async (req, res) => {
  try {
    const record = await IDFCS.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error fetching record", error });
  }
};

// Update a document
const updateIDFC = async (req, res) => {
  try {
    const updated = await IDFCS.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating record", error });
  }
};

// Delete a document
const deleteIDFC = async (req, res) => {
  try {
    const deleted = await IDFCS.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting record", error });
  }
};
module.exports = {
  createIDFC,
  getAllIDFC,
  getIDFCById,
  updateIDFC,
  deleteIDFC,
};
