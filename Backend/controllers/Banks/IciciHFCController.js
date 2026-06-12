const IciciBank = require("../../model/Banks/IcicihfcModel");

// CREATE new ICICI bank entry
exports.createIciciHFCBank = async (req, res) => {
  try {
    const newReport = await IciciBank.create(req.body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create report", error: error.message });
  }
};

// GET all ICICI bank entries
exports.getAllIciciHFCBanks = async (req, res) => {
  try {
    const reports = await IciciBank.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reports", error: error.message });
  }
};

// GET single ICICI bank entry by ID
exports.getIciciHFCBankById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await IciciBank.findById(id);

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

// exports.updateDetails = async (req, res) => {
//   try {
//     const updatedDetails = await IciciBank.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedDetails) {
//       return res.status(404).json({ message: "Details not found" });
//     }
//     res.status(200).json(updatedDetails);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // DELETE
// exports.deleteDetails = async (req, res) => {
//   try {
//     const deletedDetails = await IciciBank.findByIdAndDelete(req.params.id);
//     if (!deletedDetails) {
//       return res.status(404).json({ message: "Details not found" });
//     }
//     res.status(200).json({ message: "Details deleted successfully" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// const IciciBank = require("../model/Banks/IcicihfcModel");

// // CREATE new ICICI bank entry
// exports.createIciciHFCBank = async (req, res) => {
//   try {
//     const newReport = new IciciBank(req.body);
//     const savedReport = await newReport.save();
//     res.status(201).json({
//       success: true,
//       message: "Report created successfully",
//       data: savedReport
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create report",
//       error: error.message
//     });
//   }
// };

// // GET all ICICI bank entries
// exports.getAllIciciHFCBanks = async (req, res) => {
//   try {
//     const reports = await IciciBank.find().sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       count: reports.length,
//       data: reports
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch reports",
//       error: error.message
//     });
//   }
// };

// // GET single ICICI bank entry by ID
// exports.getIciciHFCBankById = async (req, res) => {
//   try {
//     const report = await IciciBank.findById(req.params.id);

//     if (!report) {
//       return res.status(404).json({
//         success: false,
//         message: "Report not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: report
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch report",
//       error: error.message
//     });
//   }
// };

// UPDATE details
exports.updateDetails = async (req, res) => {
  try {
    const updatedDetails = await IciciBank.findByIdAndUpdate(
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
    const deletedDetails = await IciciBank.findByIdAndDelete(req.params.id);

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
