// controllers/authController.js
const User = require("../../model/auth/authModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");
const { isBJGMember, getCityMongoRegex } = require("../../utils/clusterHelper");

exports.register = async (req, res, next) => {
  console.log("Registering User:", req.body);
  const { name, email, password, role, assignedCity } = req.body;

  try {
    // Hierarchical Check
    if (req.user.role === "Admin") {
      const restrictedRoles = ["SuperAdmin", "Admin"];
      if (restrictedRoles.includes(role)) {
        return res.status(403).json({
          message:
            "Admin can only create Coordinator, FieldOfficer, Accountant, etc.",
        });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      assignedCity,
    });
    res.status(201).json({ user, token: generateToken(user._id, user.role) });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (email && typeof email === "string") {
      email = email.trim().toLowerCase();
      if (email === "admin@gamil.com") {
        email = "admin@gmail.com";
      }
    }
    if (password && typeof password === "string") {
      password = password.trim();
    }
    console.log(email);
    console.log(password);

    let user = await User.findOne({ email });
    console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Temporary promotion logic for the main user
    if (email === "admin@gmail.com" && user.role !== "SuperAdmin") {
      user.role = "SuperAdmin";
      await user.save();
      console.log("User admin@gmail.com promoted to SuperAdmin");
    }

    const token = generateToken(user._id, user.role);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 1 * 60 * 60 * 1000,
      })
      .json({ user, token: token });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  console.log("Updating User:", req.params.id, req.body);
  try {
    const updateData = { ...req.body };

    // If a password update is requested
    if (updateData.password && typeof updateData.password === "string" && updateData.password.trim() !== "") {
      // Security Check: Only non-FieldOfficers can change another employee's password. Users can change their own password.
      if ((req.user.role === "FieldOfficer" || req.user.role === "FIELDOFFICER") && req.user._id.toString() !== req.params.id) {
        return res.status(403).json({ message: "Only non-FieldOfficers can change employee passwords" });
      }
      updateData.password = await bcrypt.hash(updateData.password.trim(), 10);
    } else {
      // Remove empty or undefined password so it does not overwrite the existing password
      delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    // Only non-FieldOfficers are authorized to delete employee accounts
    if (req.user.role === "FieldOfficer" || req.user.role === "FIELDOFFICER") {
      return res.status(403).json({ message: "Only non-FieldOfficers can delete employee accounts" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    res.json({ message: "delete successfully" });
  } catch (error) {
    next(error);
  }
};

exports.currentUser = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};
exports.currentUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.FetchFO = async (req, res, next) => {
  try {
    const fieldOfficers = await User.getFieldOfficers();
    res.status(200).json(fieldOfficers);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.user.role === "FieldOfficer" || req.user.role === "FIELDOFFICER") {
      // Field Officers see only themselves
      query = { _id: req.user._id };
    } else if (req.user.role === "SuperAdmin" || req.user.role === "Admin") {
      // SuperAdmin and Admin see everyone
      query = {};
    } else {
      // Coordinator, TechnicalManager, Accountant, etc. see only Field Officers
      query = {
        role: { $in: ["FieldOfficer", "FIELDOFFICER"] }
      };

      // Apply city filtering if they have an assignedCity
      if (req.user.assignedCity) {
        query.assignedCity = getCityMongoRegex(req.user.assignedCity);
      }
    }

    const users = await User.find(query).select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  let { email, oldPassword, newPassword } = req.body;
  try {
    if (email && typeof email === "string") {
      email = email.trim().toLowerCase();
    }
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "Email, old password, and new password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

