const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Target directory containing the images to be converted
const targetDir = path.resolve(__dirname, "../../client/public/assets/images");

console.log("Starting WebP Conversion in directory:", targetDir);

async function convertDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await convertDir(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      
      // We only convert jpg, jpeg, and png. Favicon .ico is excluded, as are svgs.
      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
        const dirname = path.dirname(fullPath);
        const basename = path.basename(fullPath, ext);
        const webpPath = path.join(dirname, `${basename}.webp`);

        try {
          console.log(`Converting: ${entry.name} -> ${basename}.webp`);
          
          await sharp(fullPath)
            .webp({ quality: 80 }) // 80 quality is a good trade-off between size and appearance
            .toFile(webpPath);

          console.log(`Successfully created: ${basename}.webp`);
          
          // Delete original file now that the WebP has been generated successfully
          fs.unlinkSync(fullPath);
          console.log(`Deleted original: ${entry.name}`);
        } catch (err) {
          console.error(`Error converting ${entry.name}:`, err.message);
        }
      }
    }
  }
}

convertDir(targetDir)
  .then(() => {
    console.log("WebP Conversion completed successfully!");
  })
  .catch((err) => {
    console.error("WebP Conversion failed:", err);
  });
