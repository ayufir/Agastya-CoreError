const express = require("express");
const router = express.Router();
const Settings = require("../model/SettingsModel");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Get settings
router.get("/", async (req, res) => {
  try {
    const settingsList = await Settings.find({});
    const settingsObj = { ratePerKm: 3.50 }; // Default fallback
    settingsList.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.status(200).json(settingsObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update settings (Admin/SuperAdmin only)
router.put("/", protect, restrictTo("Admin", "SuperAdmin"), async (req, res) => {
  const updates = req.body;
  try {
    for (const [key, value] of Object.entries(updates)) {
      await Settings.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      );
    }
    res.status(200).json({ message: "Settings updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
