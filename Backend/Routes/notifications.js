const express = require("express");
const {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
} = require("../controllers/Notification.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", protect, getAllNotifications);
router.delete("/clear", protect, clearAllNotifications);
router.put("/read-all", protect, markAllAsRead);
router.put("/read/:id", protect, markAsRead);

module.exports = router;
