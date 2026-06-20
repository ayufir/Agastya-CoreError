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

  let Model = modelMap[bankName];
  if (!Model) {
    const normalized = String(bankName).toLowerCase().replace(/\bbank\b/gi, "").replace(/[^a-z0-9]/g, "");
    const modelMapKey = Object.keys(modelMap).find(
      (k) => k.toLowerCase() === bankName.toLowerCase() || k.toLowerCase().replace(/\bbank\b/gi, "").replace(/[^a-z0-9]/g, "") === normalized
    );
    if (modelMapKey) Model = modelMap[modelMapKey];
  }
  if (!Model && modelMap.bankRegistry) {
    const entry = modelMap.bankRegistry.find(
      (b) =>
        b.key.toLowerCase() === bankName.toLowerCase() ||
        (b.displayName && b.displayName.toLowerCase() === bankName.toLowerCase()) ||
        (b.route && b.route.toLowerCase() === bankName.toLowerCase())
    );
    if (entry) Model = entry.model;
  }

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

// Helper to extract address using Claude from ATS/Sale Deed document URL
const extractAddressFromPdf = async (fileUrl) => {
  try {
    const api_key = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (!api_key) {
      console.warn("CLAUDE_API_KEY/ANTHROPIC_API_KEY not found in env, skipping address extraction.");
      return "";
    }

    const axios = require("axios");

    console.log(`[ATS Autodetect] Downloading file for address extraction: ${fileUrl}`);
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    // Determine mime type
    let mimeType = "application/pdf";
    if (fileUrl.toLowerCase().endsWith(".png")) {
      mimeType = "image/png";
    } else if (fileUrl.toLowerCase().endsWith(".jpg") || fileUrl.toLowerCase().endsWith(".jpeg")) {
      mimeType = "image/jpeg";
    }

    const addressPrompt = `Extract the full property/site address from this document. 
Return ONLY the raw extracted address string. Do not include JSON formatting, markdown formatting, backticks, or explanations. 
Keep it concise and clear (e.g. "Plot No. 12, Sector 3, Bhopal, Madhya Pradesh"). 
If no address is found, return an empty string.`;

    let address = "";
    console.log(`[ATS Autodetect] Calling Claude to extract address (mimeType: ${mimeType})...`);
    const isPdf = mimeType === "application/pdf";
    const mediaBlock = {
      type: isPdf ? "document" : "image",
      source: {
        type: "base64",
        media_type: mimeType,
        data: buffer.toString("base64"),
      },
    };

    const headers = {
      "content-type": "application/json",
      "x-api-key": api_key,
      "anthropic-version": "2023-06-01",
    };
    if (isPdf) {
      headers["anthropic-beta"] = "pdfs-2024-09-25";
    }

    const requestBody = {
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            mediaBlock,
            {
              type: "text",
              text: addressPrompt,
            },
          ],
        },
      ],
    };

    const aiResponse = await axios.post("https://api.anthropic.com/v1/messages", requestBody, { headers });
    address = aiResponse.data?.content?.[0]?.text?.trim() || "";

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

    const pullConditions = [];
    if (fileId) {
      pullConditions.push({ fileId: fileId });
      pullConditions.push(fileId);
    }
    if (assetUrl) {
      pullConditions.push({ url: assetUrl });
      pullConditions.push(assetUrl);
    }
    const pullQuery = { atsDocuments: { $or: pullConditions } };

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

router.post("/upload-category-document", async (req, res) => {
  const { caseId, fieldName, document } = req.body;

  if (!caseId || !fieldName || !document) {
    return res.status(400).json({
      error: "caseId, fieldName, and document are required.",
    });
  }

  try {
    const bankRegistry = modelMap.bankRegistry || Object.values(modelMap);
    let updatedCase = null;

    // Search and update case in database across all bank models
    for (const bankConfig of bankRegistry) {
      const Model = bankConfig.model || bankConfig;
      if (Model && Model.findById) {
        const exists = await Model.findById(caseId);
        if (exists) {
          updatedCase = await Model.findByIdAndUpdate(
            caseId,
            { $push: { [fieldName]: document } },
            { new: true }
          );

          if (updatedCase) {
            console.log(`Successfully pushed to ${fieldName} for case ${caseId} in model ${Model.modelName}`);
            break;
          }
        }
      }
    }

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found." });
    }

    return res.json({
      message: `${fieldName} successfully added.`,
      updatedCase,
      success: true,
    });
  } catch (err) {
    console.error(`Error uploading to ${fieldName}:`, err.message);
    return res.status(500).json({ error: `Server error while adding to ${fieldName}.` });
  }
});

router.post("/remove-category-document", async (req, res) => {
  const { caseId, fieldName, document } = req.body;

  if (!caseId || !fieldName || !document) {
    return res.status(400).json({
      error: "caseId, fieldName, and document are required.",
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

    const pullConditions = [];
    if (fileId) {
      pullConditions.push({ fileId: fileId });
      pullConditions.push(fileId);
    }
    if (assetUrl) {
      pullConditions.push({ url: assetUrl });
      pullConditions.push(assetUrl);
    }
    const pullQuery = { [fieldName]: { $or: pullConditions } };

    for (const bankConfig of bankRegistry) {
      const Model = bankConfig.model || bankConfig;
      if (Model && Model.findById) {
        updatedCase = await Model.findByIdAndUpdate(
          caseId,
          { $pull: pullQuery },
          { new: true }
        );
        if (updatedCase) {
          console.log(`Successfully pulled from ${fieldName} in case ${caseId} in model ${Model.modelName}`);
          break;
        }
      }
    }

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found." });
    }

    return res.json({
      message: `${fieldName} successfully removed.`,
      updatedCase,
      success: true,
    });
  } catch (err) {
    console.error(`Error removing from ${fieldName}:`, err.message);
    return res.status(500).json({ error: `Server error while removing from ${fieldName}.` });
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
