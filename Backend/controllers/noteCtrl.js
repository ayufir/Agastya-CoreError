const Note = require("../model/noteModel");
const modelMap = require("./modelMap");

exports.addNote = async (req, res) => {
  try {
    const { caseId, message } = req.body;
    
    // Save the note
    const note = await Note.create({
      caseId,
      message,
      addedBy: req.user._id,
      role: req.user.role,
    });

    // Update the case with the remark
    if (caseId && message) {
      const bankRegistry = modelMap.bankRegistry;
      
      for (const bankConfig of bankRegistry) {
        const { model: Model } = bankConfig;
        const caseData = await Model.findByIdAndUpdate(
          caseId,
          { remarks: message },
          { new: true }
        );
        
        if (caseData) {
          break; // Found and updated the case
        }
      }
    }

    res.status(201).json(note);
  } catch (err) {
    console.error("Error in addNote:", err);
    res.status(500).json({ error: "Failed to add note" });
  }
};

exports.getNotesByCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const notes = await Note.find({ caseId }).populate("addedBy", "name");
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

exports.allCaseByUserId = async (req, res, next) => {
  // console.log(req.user, "A");
  try {
    const notes = await Note.find({ addedBy: req.user._id });
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.allNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
