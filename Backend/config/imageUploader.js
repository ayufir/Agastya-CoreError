const fs = require("fs");
const path = require("path");
const ImageKit = require("imagekit");

const { URL } = require("url");
require("dotenv").config();

const useImageKit = process.env.USE_IMAGEKIT === "true";

let imagekit = null;
if (useImageKit) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
}

const uploadToImageKit = async (localFilePath, fileName) => {
  const fileBuffer = fs.readFileSync(localFilePath);

  const result = await imagekit.upload({
    file: fileBuffer,
    fileName,
  });

  return {
    url: result.url,
    fileId: result.fileId,
    storage: "imagekit",
  };
};

const uploadToLocal = async (localFilePath, fileName) => {
  const localUrl = `${process.env.UPLOAD_DOMAIN_URL}/uploads/${fileName}`; // Serve via static route
  return {
    url: localUrl,
    storage: "local",
  };
};

// Main interface
const uploadImage = async (file) => {
  const localPath = file.path;
  const fileName = file.filename;

  try {
    if (useImageKit) {
      return await uploadToImageKit(localPath, fileName);
    } else {
      return await uploadToLocal(localPath, fileName);
    }
  } catch (err) {
    throw new Error("Image upload failed: " + err.message);
  }
};

// 🧹 ImageKit se delete
const deleteFromImageKit = async (fileUrl) => {
  try {
    const fileIdResult = await imagekit.listFiles({
      url: fileUrl,
    });

    if (fileIdResult.length === 0) {
      throw new Error("File not found in ImageKit");
    }

    const fileId = fileIdResult[0].fileId;
    await imagekit.deleteFile(fileId);

    return { success: true, storage: "imagekit" };
  } catch (err) {
    throw new Error("Failed to delete from ImageKit: " + err.message);
  }
};

// 🧼 Local se delete
const deleteFromLocal = async (fileUrl) => {
  try {
    // ✅ Parse pathname from full URL
    const parsed = new URL(fileUrl);
    const pathname = parsed.pathname; // -> "/uploads/abc.png"

    const fileName = pathname.split("/").pop(); // "abc.png"

    // ✅ Point to the actual uploads folder
    const fullPath = path.join(__dirname, "..", "uploads", fileName);

    console.log("Deleting local file:", fullPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return { success: true, storage: "local" };
    } else {
      throw new Error("File does not exist: " + fullPath);
    }
  } catch (err) {
    throw new Error("Failed to delete local file: " + err.message);
  }
};

// ✅ Main delete interface
const deleteImage = async (fileUrl) => {
  if (useImageKit) {
    return await deleteFromImageKit(fileUrl);
  } else {
    return await deleteFromLocal(fileUrl);
  }
};

module.exports = { uploadImage, deleteImage };
