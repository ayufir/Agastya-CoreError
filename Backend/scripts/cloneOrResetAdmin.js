const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("../model/auth/authModel");
const { HrmsEmployee } = require("../model/hrmsModel");

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log("Connecting to:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    // Hash the password "123456"
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash("123456", salt);

    // 1. Ensure admin@gmail.com exists with SuperAdmin and correct password
    let adminGmail = await User.findOne({ email: "admin@gmail.com" });
    if (!adminGmail) {
      console.log("Creating admin@gmail.com...");
      adminGmail = await User.create({
        name: "ADMIN",
        email: "admin@gmail.com",
        password: newHashedPassword,
        role: "SuperAdmin",
        isActive: true,
        assignedCity: "Mumbai"
      });
    } else {
      console.log("Updating admin@gmail.com password and role...");
      adminGmail.password = newHashedPassword;
      adminGmail.role = "SuperAdmin";
      await adminGmail.save();
    }

    // 2. Ensure admin@gamil.com exists with SuperAdmin and correct password to handle typo
    let adminGamil = await User.findOne({ email: "admin@gamil.com" });
    if (!adminGamil) {
      console.log("Creating admin@gamil.com (to support user typos)...");
      adminGamil = await User.create({
        name: "ADMIN TYPO SUPPORT",
        email: "admin@gamil.com",
        password: newHashedPassword,
        role: "SuperAdmin",
        isActive: true,
        assignedCity: "Mumbai"
      });
    } else {
      console.log("Updating admin@gamil.com password and role...");
      adminGamil.password = newHashedPassword;
      adminGamil.role = "SuperAdmin";
      await adminGamil.save();
    }

    // 3. Update all other users to have the same password "123456"
    console.log("Updating all other users' passwords to '123456'...");
    const userUpdateResult = await User.updateMany(
      {},
      { $set: { password: newHashedPassword } }
    );
    console.log(`Updated ${userUpdateResult.modifiedCount} users in User collection.`);

    // 4. Update HRMS fallback or other HRMS collection items if necessary
    // Sync employees with users
    const { login } = require("../controllers/hrmsController"); // just importing hrmsController to trigger its methods if needed
    // Let's manually sync HrmsEmployee for both emails to be safe
    for (const email of ["admin@gmail.com", "admin@gamil.com"]) {
      const u = await User.findOne({ email });
      let emp = await HrmsEmployee.findOne({ email });
      const employeeId = "EMP-" + u._id.toString().slice(-4).toUpperCase();
      if (!emp) {
        await HrmsEmployee.create({
          _id: u._id,
          employeeId,
          firstName: "Admin",
          lastName: email.includes("gamil") ? "Typo" : "Main",
          email: u.email,
          password: u.password,
          role: "SuperAdmin",
          department: "Administration",
          branch: "Mumbai",
          kycStatus: "Approved",
          status: "Active"
        });
        console.log(`Created HrmsEmployee for ${email}`);
      } else {
        emp.password = u.password;
        emp.role = "SuperAdmin";
        await emp.save();
        console.log(`Updated HrmsEmployee password for ${email}`);
      }
    }

    // Also update all other employees' passwords to "123456"
    console.log("Updating all other employees' passwords to '123456'...");
    const empUpdateResult = await HrmsEmployee.updateMany(
      {},
      { $set: { password: newHashedPassword } }
    );
    console.log(`Updated ${empUpdateResult.modifiedCount} employees in HrmsEmployee collection.`);

    console.log("All operations completed successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error during operations:", err);
    process.exit(1);
  }
}

run();
