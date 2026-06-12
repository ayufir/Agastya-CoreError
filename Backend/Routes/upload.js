const express = require("express");
const router = express.Router();
// const upload = require("../middleware/upload");
const uploadDocuments = require("../middleware/uploderDocument.js");
const imagekit = require("../config/imagekit");
const modelMap = require("../controllers/modelMap.js");
const Case = require("../model/Banks/homeFirstModel.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.array("files"), async (req, res) => {
  try {
    const uploadedFiles = [];

    console.log(req?.files)

    for (const file of req.files) {
      const result = await imagekit.upload({
        file: file.buffer,        // buffer
        fileName: file.originalname,
        folder: "/uploads",
      });

      uploadedFiles.push({
        url: result.url,
        fileId: result.fileId,   // ⭐ important
        name: result.name,
      });
    }

    res.json({ success: true, urls: uploadedFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});


function toPascalCase(str) {
  return str
    .replace(/\s+/g, "-")
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

router.post("/upload-document", async (req, res) => {
  const { caseId, fileUrl, bankName } = req.body;

  console.log(caseId, fileUrl, bankName);

  if (!caseId || !fileUrl || !bankName) {
    return res.status(400).json({
      error: "caseId, fileUrl, and bankName are required.",
    });
  }

  // const modelKey = toPascalCase(bankName);
  const Model = modelMap[bankName];

  if (!Model) {
    return res.status(400).json({
      error: `Invalid bank name: ${bankName}`,
    });
  }

  // console.log(Model);

  try {
    const updatedCase = await Model.findByIdAndUpdate(
      { _id: caseId },
      { $push: { AttachDocuments: fileUrl } }, // 👈 Push URL directly
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found." });
    }

    return res.json({
      message: "File URL successfully added to documents.",
      updatedCase,
    });
  } catch (err) {
    console.error("Error updating documents:", err.message);
    return res.status(500).json({ error: "Server error while updating case." });
  }
});

// Helper to extract address using Gemini from ATS/Sale Deed document URL
const extractAddressFromPdf = async (fileUrl) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found in env, skipping address extraction.");
      return "";
    }

    const axios = require("axios");
    const { GoogleGenAI } = require("@google/genai");

    console.log(`[ATS Autodetect] Downloading file for address extraction: ${fileUrl}`);
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Determine mime type
    let mimeType = "application/pdf";
    if (fileUrl.toLowerCase().endsWith(".png")) {
      mimeType = "image/png";
    } else if (fileUrl.toLowerCase().endsWith(".jpg") || fileUrl.toLowerCase().endsWith(".jpeg")) {
      mimeType = "image/jpeg";
    }

    console.log(`[ATS Autodetect] Calling Gemini to extract address (mimeType: ${mimeType})...`);
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Extract the full property/site address from this document. 
Return ONLY the raw extracted address string. Do not include JSON formatting, markdown formatting, backticks, or explanations. 
Keep it concise and clear (e.g. "Plot No. 12, Sector 3, Bhopal, Madhya Pradesh"). 
If no address is found, return an empty string.`,
            },
            {
              inlineData: {
                mimeType,
                data: buffer.toString("base64"),
              },
            },
          ],
        },
      ],
    });

    const address = aiResponse.text?.trim() || "";
    console.log(`[ATS Autodetect] Successfully extracted address: "${address}"`);
    return address;
  } catch (error) {
    console.error("[ATS Autodetect] Error extracting address from PDF:", error.message);
    return "";
  }
};

router.post("/upload-ats-document", async (req, res) => {
  const { caseId, document } = req.body;

  if (!caseId || !document) {
    return res.status(400).json({
      error: "caseId and document are required.",
    });
  }

  try {
    const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
    let updatedCase = null;

    // 1. Run AI Address Extraction from the uploaded ATS/Sale Deed document
    let extractedAddress = "";
    if (document.url) {
      extractedAddress = await extractAddressFromPdf(document.url);
    }

    // 2. Prepare case update fields
    const updateObj = {};
    if (extractedAddress) {
      updateObj.addressLegal = extractedAddress;
      updateObj.addressSite = extractedAddress;
      updateObj.propertyAddress = extractedAddress;
      updateObj.address = extractedAddress;
      updateObj.legalAddress = extractedAddress;
      updateObj["locationDetails.propertyAddressAsDocs"] = extractedAddress;
      updateObj["propertyInfo.addressAsPerDocument"] = extractedAddress;
      updateObj["summary.propertyAddress"] = extractedAddress;
    }

    // 3. Search and update case in database across all bank models
    for (const bankConfig of bankRegistry) {
      const Model = bankConfig.model || bankConfig;
      if (Model && Model.findById) {
        const exists = await Model.findById(caseId);
        if (exists) {
          const updateQuery = {
            $push: { atsDocuments: document }
          };
          if (Object.keys(updateObj).length > 0) {
            updateQuery.$set = updateObj;
          }

          updatedCase = await Model.findByIdAndUpdate(
            caseId,
            updateQuery,
            { new: true }
          );

          if (updatedCase) {
            console.log(`Successfully added atsDocument and updated address for case ${caseId} in model ${Model.modelName}`);
            break;
          }
        }
      }
    }

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found." });
    }

    return res.json({
      message: "ATS Document successfully added.",
      updatedCase,
      success: true,
    });
  } catch (err) {
    console.error("Error uploading ATS document:", err.message);
    return res.status(500).json({ error: "Server error while adding ATS document." });
  }
});

router.post("/remove-ats-document", async (req, res) => {
  const { caseId, document } = req.body;

  if (!caseId || !document) {
    return res.status(400).json({
      error: "caseId and document are required.",
    });
  }

  try {
    const fileId = document.fileId || "";
    const assetUrl = document.url || "";

    if (fileId) {
      try {
        await imagekit.deleteFile(fileId);
        console.log(`Successfully deleted file ${fileId} from ImageKit`);
      } catch (ikErr) {
        console.warn(`Failed to delete file ${fileId} from ImageKit:`, ikErr.message);
      }
    }

    const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
    let updatedCase = null;

    const pullQuery = fileId 
      ? { atsDocuments: { fileId: fileId } }
      : { atsDocuments: { url: assetUrl } };

    for (const bankConfig of bankRegistry) {
      const Model = bankConfig.model || bankConfig;
      if (Model && Model.findById) {
        updatedCase = await Model.findByIdAndUpdate(
          caseId,
          { $pull: pullQuery },
          { new: true }
        );
        if (updatedCase) {
          console.log(`Successfully pulled atsDocument from case ${caseId} in model ${Model.modelName}`);
          break;
        }
      }
    }

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found." });
    }

    return res.json({
      message: "ATS Document successfully removed.",
      updatedCase,
      success: true,
    });
  } catch (err) {
    console.error("Error removing ATS document:", err.message);
    return res.status(500).json({ error: "Server error while removing ATS document." });
  }
});

router.delete("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "uploads", filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).json({ error: "File deletion failed" });
    }
    res.json({ message: "File deleted successfully" });
  });
});

module.exports = router;
