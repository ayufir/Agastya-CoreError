const express = require("express");
const multer = require("multer");
const { advancedAutofill } = require("../controllers/advancedAutofillController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB — supports large PDFs
});

router.post(
  "/",
  upload.fields([
    { name: "gpsFiles",        maxCount: 8  },
    { name: "atsFiles",        maxCount: 8  },
    { name: "emailFiles",      maxCount: 8  },
    { name: "fieldFormFiles",  maxCount: 8  },
    { name: "additionalFiles", maxCount: 12 },
    { name: "siteVisitPhotos", maxCount: 15 }, // NEW — site visit photos for photo fields
    { name: "siteVisitVideo",  maxCount: 5  }, // NEW — site visit video
  ]),
  advancedAutofill
);

module.exports = router;
