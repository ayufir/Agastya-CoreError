const fs = require("fs");
const path = require("path");
const imagekit = require("../config/imagekit");

exports.deleteUploadedFile = async (req, res) => {
    try {
        let { filePath } = req.body;

        console.log(filePath)

        if (!filePath) {
            return res.status(400).json({ message: "filePath is required" });
        }
        await imagekit.deleteFile(filePath);
        res.json({
            success: true,
            message: "Image deleted from ImageKit",
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
