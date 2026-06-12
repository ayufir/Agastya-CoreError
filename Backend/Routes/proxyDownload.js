// routes/proxyDownload.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

const archiver = require("archiver");

router.post("/", async (req, res) => {
  const { urls } = req.body;

  console.log(urls);

  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: "URLs are required in array" });
  }

  try {
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=images.zip`);

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => {
      console.error("Archiver error:", err);
      res.status(500).send({ error: "Archiver failed" });
    });

    archive.pipe(res);

    for (const url of urls) {
      const filename = decodeURIComponent(url.split("/").pop());

      try {
        const response = await axios({
          method: "GET",
          url,
          responseType: "stream",
        });

        archive.append(response.data, { name: filename });
      } catch (err) {
        console.error(`Failed to fetch ${url}:`, err.message);
        archive.append(Buffer.from(`Failed to fetch ${url}`), {
          name: `${filename}-ERROR.txt`,
        });
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("ZIP download error:", error); // ← print full error
    res.status(500).json({ error: "Failed to create zip" });
  }
});

module.exports = router;
