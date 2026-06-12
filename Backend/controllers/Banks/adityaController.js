const adityaModel = require("../../model/Banks/adityaModel");

// CREATE
exports.createDetails = async (req, res) => {
  console.log("Received data:", req.body);

  try {
    const body = req.body;
    if (body.previousValuation === "") delete body.previousValuation;
    if (body.locality === "") delete body.locality;

    const newDetails = await adityaModel.create(body);
    // await newDetails.save();
    res.status(201).json(newDetails);
    console.log(newDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ ALL
exports.getAllDetails = async (req, res) => {
  try {
    const details = await adityaModel.find().sort({ _id: -1 }).limit(1);
    res.status(200).json(details);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ ONE
exports.getDetailsById = async (req, res) => {
  try {
    const details = await adityaModel.findById(req.params.id);
    if (!details) {
      return res.status(404).json({ message: "Details not found" });
    }
    res.status(200).json(details);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE
exports.updateDetails = async (req, res) => {
  try {
    const updatedDetails = await adityaModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDetails) {
      return res.status(404).json({ message: "Details not found" });
    }
    res.status(200).json(updatedDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
exports.deleteDetails = async (req, res) => {
  try {
    const deletedDetails = await adityaModel.findByIdAndDelete(req.params.id);
    if (!deletedDetails) {
      return res.status(404).json({ message: "Details not found" });
    }
    res.status(200).json({ message: "Details deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteImageFromValuationReport = async (req, res) => {
  try {
    const { id } = req.params; // document ID
    const { imageUrl } = req.body; // URL to remove

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required" });
    }

    const updatedJob = await adityaModel.findByIdAndUpdate(
      id,
      { $pull: { propertyPhotos: imageUrl } },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Image URL deleted successfully",
      updatedJob,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting image",
      error,
    });
  }
};