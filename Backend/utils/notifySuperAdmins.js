const Notification = require("../model/Notification");
const { getIO } = require("../socket");

const notifySuperAdmins = async (caseId, bankName, message) => {
  try {
    const User = require("../model/auth/authModel");
    const superAdmins = await User.find({ role: "SuperAdmin" });
    if (!superAdmins || superAdmins.length === 0) return;

    const notifications = superAdmins.map((admin) => ({
      userId: admin._id,
      caseId: caseId || null,
      bankName: bankName || "System",
      message: message || "A case was updated.",
    }));

    await Notification.insertMany(notifications);

    const io = getIO();
    if (io) {
      io.emit("newNotification", { message: "New update from system" });
    }
  } catch (error) {
    console.error("Error notifying SuperAdmins:", error.message);
  }
};

module.exports = notifySuperAdmins;
