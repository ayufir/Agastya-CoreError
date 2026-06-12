const Notification = require("../model/Notification");

// exports.createNotification = async ({ userId, caseId, message, bankName }) => {
//   try {
//     console.log(userId, caseId, message, bankName);
//     const Info = new Notification({
//       userId,
//       caseId,
//       message,
//       bankName,
//     });
//     await Info.save();
//   } catch (err) {
//     console.error("Notification Error:", err);
//   }
// };

// await Notification.create({
//   user: fieldOfficerId,
//   caseId,
//   modelName: modelKey,
//   message: `You have been assigned a new case from ${modelKey}`,
// });

// exports.getAllNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find()
//       .sort({ createdAt: -1 })
//       .limit(50); // limit for performance

//     console.log(notifications);
//     res.json(notifications);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch notifications." });
//   }
// };

exports.getAllNotifications = async (req, res) => {
  try {
    let notifications;

    // Check if user is admin
    if (req.user.role === "Admin") {
      notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .limit(50);
    } else {
      // For regular user, only return their own notifications
      notifications = await Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);
    }

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read." });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark all as read." });
  }
};

exports.clearAllNotifications = async (req, res) => {
  try {
    // For admin: clear all
    if (req.user.role === "Admin") {
      await Notification.deleteMany({});
    } else {
      // For regular users: clear only their notifications
      await Notification.deleteMany({ userId: req.user._id });
    }

    res.json({ message: "Notifications cleared successfully." });
  } catch (err) {
    console.error("Failed to clear notifications:", err);
    res.status(500).json({ error: "Failed to clear notifications." });
  }
};
