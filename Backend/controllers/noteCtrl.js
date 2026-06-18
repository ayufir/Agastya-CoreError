const Note = require("../model/noteModel");
const modelMap = require("./modelMap");
const Notification = require("../model/Notification");
const imagekit = require("../config/imagekit");
const multer = require("multer");

// Multer in-memory storage for note image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Middleware export so routes can use it
exports.uploadNoteImage = upload.single("image");

exports.addNote = async (req, res) => {
  try {
    const { caseId, message, type } = req.body;
    const noteType = type || "note";

    // Handle optional image upload
    let imageData = { url: null, fileId: null };
    if (req.file) {
      try {
        const isAudio = req.file.mimetype?.startsWith("audio/") || req.file.originalname?.match(/\.(mp3|wav|ogg|m4a|aac)$/i);
        const folderPath = isAudio ? "/notes/call_recordings" : "/notes/images";
        const result = await imagekit.upload({
          file: req.file.buffer,
          fileName: `note_${Date.now()}_${req.file.originalname}`,
          folder: folderPath,
        });
        imageData = { url: result.url, fileId: result.fileId };
      } catch (imgErr) {
        console.warn("Note image upload failed:", imgErr.message);
      }
    }

    // Save the note
    const note = await Note.create({
      caseId,
      message,
      type: noteType,
      image: imageData,
      addedBy: req.user._id,
      role: req.user.role,
    });

    // Update the case with the remark and status
    let updatedCaseData = null;
    let targetBankName = "Unknown Bank";

    if (caseId && message) {
      const bankRegistry = modelMap.bankRegistry;

      const setFields = { remarks: message };
      if (req.user.role === "FieldOfficer" && noteType === "note") {
        setFields.status = "Query Raised";
      }

      for (const bankConfig of bankRegistry) {
        const { model: Model, displayName } = bankConfig;

        const updatePayload = {
          $set: setFields,
        };

        // Push to timeline if model supports it
        if (Model.schema && Model.schema.paths.timeline) {
          updatePayload.$push = {
            timeline: {
              status:
                noteType === "call_not_attended"
                  ? "Call Not Attended"
                  : req.user.role === "FieldOfficer"
                  ? "Query Raised"
                  : "Note Added",
              updatedAt: new Date(),
              updatedBy: req.user._id,
              note: message,
            },
          };
        }

        const caseData = await Model.findByIdAndUpdate(caseId, updatePayload, {
          new: true,
        });

        if (caseData) {
          updatedCaseData = caseData;
          targetBankName = displayName;
          break;
        }
      }
    }

    // Create notification and emit socket event
    if (updatedCaseData) {
      const notifMsg =
        noteType === "call_not_attended"
          ? `${req.user.name || "Field Officer"} logged: Call Not Attended`
          : `${req.user.name || "Field Officer"} raised a query: "${message}"`;

      const notif = await Notification.create({
        userId: req.user._id,
        caseId,
        message: notifMsg,
        bankName: targetBankName,
      });

      const io = req.io || global.io;
      if (io) io.emit("newNotification", notif);
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
