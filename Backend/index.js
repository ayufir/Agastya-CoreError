


require("dotenv").config();

const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const multer = require("multer");
const idfcRoute = require("./Routes/Banks/idfcRoute");
const cholaRoutes = require("./Routes/Banks/cholaRoute");
const FedralRoute = require("./Routes/Banks/FedralRoute");
const ProtiumRoute = require("./Routes/Banks/ProtiumRoute");
const adityaRoutes = require("./Routes/Banks/adityaRoutes");
const piramalRoutes = require("./Routes/Banks/piramalRoute");
const manappuram = require("./Routes/Banks/manappuramRoute");
const icichfcRoutes = require("./Routes/Banks/iciciHFCRoute");
const agriwiseRoutes = require("./Routes/Banks/agriwiseRoutes");
const SamstaflnRoute = require("./Routes/Banks/SamstaflnRoute");
const sundaramRoutes = require("./Routes/Banks/sundaram.routes");
const iciciBankRoutes = require("./Routes/Banks/iciciBankRoutes");
const profectusRoutes = require("./Routes/Banks/profectusRoutes");
const HeroFinCorpRoutes = require("./Routes/Banks/heroFinCopRoutes");
const homeFirstBankRoutes = require("./Routes/Banks/homeFirstBankRoutes");
const piramalFinanceRoutes = require("./Routes/Banks/PriamalFinanceRoutes");

const bajajRoutes = require("./Routes/Banks/bajajRoutes");
const bajajAmeriyaRoutes = require("./Routes/Banks/BajajAmeriyaRoutes");
const dmiFinanceReportRoutes = require("./Routes/Banks/DmiFinanceRoute");
const homeTrenchReportRoutes = require("./Routes/Banks/homeTrenchReportRoutes");
const uploadRoutes = require("./Routes/uploadOllama");
const advancedAutofillRoute = require("./Routes/advancedAutofillRoute");
const authRoutes = require("./Routes/auth/authRoutes");
const hrmsRoutes = require("./Routes/hrmsRoutes");

const aiService = require("./services/ai.service.js");
const imagekit = require("./config/imagekit");

const bodyParser = require("body-parser");

// 1. Require the new route (near other bank routes at the top)
const bajajHousingRoutes = require("./Routes/Banks/bajajHousingRoutes.js");


const app = express();

// ─────────────────────────────────────────────────────────────────────────────
// Multer — accept multiple files, all stored in memory
// Limit raised to 50MB to support Excel files with embedded images
// ─────────────────────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
});

const PORT = process.env.PORT || 5000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "https://banker-invoice.onrender.com", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(morgan("tiny"));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next) => {
  if (global.io) req.io = global.io;
  next();
});

app.use("/api", uploadRoutes);
app.use("/api/advanced-autofill", advancedAutofillRoute);
app.use("/api/image_kit", require("./Routes/uploadRoute"));
app.use("/api/notifications", require("./Routes/notifications"));
app.use("/api/auth", authRoutes);
app.use("/api/hrms", hrmsRoutes);
app.use("/api/idfc", idfcRoute);
app.use("/api/chola", cholaRoutes);
app.use("/api/fedral", FedralRoute);
app.use("/api/aditya", adityaRoutes);
app.use("/api/protium", ProtiumRoute);
app.use("/api/icichfc", icichfcRoutes);
app.use("/api/manappuram", manappuram);
app.use("/api/piramal", piramalRoutes);
app.use("/api/agriwise", agriwiseRoutes);
app.use("/api/sundaram", sundaramRoutes);
app.use("/api/samstafln", SamstaflnRoute);
app.use("/api/profectus", profectusRoutes);
app.use("/api/icici-bank", iciciBankRoutes);
app.use("/api/heroFinCorp", HeroFinCorpRoutes);
app.use("/api/first-bank", homeFirstBankRoutes);
app.use("/api/piramal-finance", piramalFinanceRoutes);
app.use("/api/bajaj", bajajRoutes);
app.use("/api/bajajA", bajajAmeriyaRoutes);
app.use("/api/dmi-finance-reports", dmiFinanceReportRoutes);
app.use("/api/home-trench-reports", homeTrenchReportRoutes);
app.use("/api/case", require("./Routes/User/CaseRoutes"));
app.use("/api/notes", require("./Routes/noteRoutes"));
app.use("/api/assign", require("./Routes/assignmentRoutes"));
app.use("/api/uploads", require("./Routes/upload"));
app.use("/api/remove", require("./Routes/removeRoutes"));
app.use("/api/proxy", require("./Routes/proxyDownload"));
app.use("/api/invoices", require("./Routes/InvoiceRoutes"));


////////////////////
// 2. Register it (near other app.use("/api/...") lines)
app.use("/api/bajaj-housing", bajajHousingRoutes);


const adityaBirlaRoutes = require("./Routes/Banks/adityaBirlaRoutes");


// ─────────────────────────────────────────────────────────────────────────────
// File type detection helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the category of a file based on its MIME type and original name.
 * @returns {"pdf" | "image" | "excel" | "csv" | "unknown"}
 */
const getFileCategory = (file) => {
  const mime = (file.mimetype || "").toLowerCase();
  const name = (file.originalname || "").toLowerCase();

  // PDF
  if (mime === "application/pdf" || name.endsWith(".pdf")) return "pdf";

  // Images
  const imageMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
  ];
  if (imageMimes.includes(mime)) return "image";
  if (/\.(jpg|jpeg|png|webp|gif|bmp|tiff?)$/i.test(name)) return "image";

  // Excel
  const excelMimes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel",                                           // .xls
    "application/msexcel",
    "application/x-msexcel",
    "application/x-excel",
  ];
  if (excelMimes.includes(mime)) return "excel";
  if (/\.(xlsx|xls|xlsm|xlsb)$/i.test(name)) return "excel";

  // CSV
  if (mime === "text/csv" || mime === "text/plain" || mime === "application/csv") {
    if (name.endsWith(".csv")) return "csv";
  }
  if (name.endsWith(".csv")) return "csv";

  return "unknown";
};

/**
 * Process a single file → extract registry data
 * Returns null if file type is unsupported.
 */
const processFile = async (file) => {
  const category = getFileCategory(file);

  console.log(
    `Processing: ${file.originalname} | type: ${category} | size: ${(file.size / 1024).toFixed(1)}KB`
  );

  switch (category) {
    case "pdf": {
      const base64 = file.buffer.toString("base64");
      return await aiService.extractRegistryDetails(base64, "application/pdf");
    }

    case "image": {
      const base64 = file.buffer.toString("base64");
      // Use the actual MIME type for images (jpg, png, etc.)
      const mimeType = file.mimetype || "image/jpeg";
      return await aiService.extractRegistryDetails(base64, mimeType);
    }

    case "excel": {
      return await aiService.extractFromExcel(file.buffer);
    }

    case "csv": {
      return await aiService.extractFromCsv(file.buffer);
    }

    default:
      console.warn(`Unsupported file type: ${file.originalname} (${file.mimetype})`);
      return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// /api/pdf — Universal document extraction endpoint
//
// Accepts: PDF, images (jpg/png/webp/gif/bmp), Excel (.xlsx/.xls), CSV
// Method: POST multipart/form-data
// Field name: "file" (supports multiple files)
//
// Response: { success: true, data: { ...extractedFields }, filesProcessed: [...] }
// ─────────────────────────────────────────────────────────────────────────────
app.post(
  "/api/pdf",
  upload.array("file", 10), // Accept up to 10 files at once
  async (req, res) => {
    try {
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Koi file upload nahi ki gayi. PDF, image, Excel ya CSV upload karein.",
        });
      }

      // Process all files in parallel
      const processingResults = await Promise.allSettled(
        files.map((file) => processFile(file))
      );

      // Separate successes and failures
      const successfulExtractions = [];
      const failedFiles = [];

      processingResults.forEach((result, index) => {
        const file = files[index];
        if (result.status === "fulfilled" && result.value !== null) {
          successfulExtractions.push(result.value);
          console.log(`✅ Extracted: ${file.originalname}`);
        } else {
          const reason =
            result.status === "rejected"
              ? result.reason?.message
              : "Unsupported file type";
          failedFiles.push({ name: file.originalname, reason });
          console.warn(`❌ Failed: ${file.originalname} — ${reason}`);
        }
      });

      if (successfulExtractions.length === 0) {
        return res.status(422).json({
          success: false,
          message: "Kisi bhi file se data extract nahi ho saka.",
          failedFiles,
        });
      }

      // Merge results from multiple files (first non-null value wins per field)
      const mergedData =
        successfulExtractions.length === 1
          ? successfulExtractions[0]
          : aiService.mergeExtractionResults(successfulExtractions);

      return res.status(200).json({
        success: true,
        data: mergedData,
        filesProcessed: files.map((f, i) => ({
          name: f.originalname,
          type: getFileCategory(f),
          status:
            processingResults[i].status === "fulfilled" &&
              processingResults[i].value !== null
              ? "success"
              : "failed",
        })),
        // Include partial failure info if some files failed
        ...(failedFiles.length > 0 && { partialFailures: failedFiles }),
      });
    } catch (error) {
      console.error("Extraction Error:", error);
      return res.status(500).json({
        success: false,
        message: "Document se data extract karne mein error aaya.",
        error: error.message,
      });
    }
  }
);

app.use("/api/aditya-birla", adityaBirlaRoutes);


app.get("/", (req, res) => {
  res.send("Server is running at Home!");
});

app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.url}`);
  err.status = 404;
  next(err);
});

module.exports = app;
