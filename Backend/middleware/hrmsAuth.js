const jwt = require("jsonwebtoken");
const { HrmsEmployee } = require("../model/hrmsModel");

const hrmsProtect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "qwertyuiop");
    
    // Check fallback admin
    if (decoded.email === "hradmin@bankhrms.com") {
      req.user = { email: decoded.email, role: decoded.role, name: decoded.name };
      return next();
    }

    // Check Employee DB
    if (decoded.id) {
      const emp = await HrmsEmployee.findById(decoded.id).select("-password");
      if (emp) {
        req.user = emp;
        return next();
      }
    }

    return res.status(401).json({ success: false, message: "User not found or invalid token" });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { hrmsProtect };
