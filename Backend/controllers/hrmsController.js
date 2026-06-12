const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  HrmsEmployee,
  HrmsBranch,
  HrmsAttendance,
  HrmsCompliance,
  HrmsAsset,
  HrmsLeave,
  HrmsPayroll,
  HrmsRecruitmentJob,
  HrmsPerformance,
  HrmsExpense,
  HrmsTicket,
  HrmsAuditLog
} = require("../model/hrmsModel");
const User = require("../model/auth/authModel");

// Helpers
const logAudit = async (action, email, details) => {
  try {
    await HrmsAuditLog.create({ action, performedBy: email, details });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
};

const getDepartmentForRole = (role) => {
  switch (role) {
    case "SuperAdmin":
    case "Admin":
      return "Administration";
    case "Coordinator":
      return "Operations";
    case "FieldOfficer":
      return "Credit Valuation";
    case "TechnicalManager":
      return "Technical Risk";
    case "RegionalManager":
      return "Regional Operations";
    case "Accountant":
      return "Finance";
    default:
      return "Operations";
  }
};

const syncEmployeesWithUsers = async () => {
  try {
    const users = await User.find({});
    for (const user of users) {
      let emp = await HrmsEmployee.findOne({ $or: [{ email: user.email }, { _id: user._id }] });

      const nameParts = user.name ? user.name.split(" ") : ["Field", "Officer"];
      const firstName = nameParts[0] || "Field";
      const lastName = nameParts.slice(1).join(" ") || "Officer";
      const employeeId = "EMP-" + user._id.toString().slice(-4).toUpperCase();
      const hrmsRole = user.role || "Employee";

      if (!emp) {
        await HrmsEmployee.create({
          _id: user._id,
          employeeId,
          firstName,
          lastName,
          email: user.email,
          password: user.password,
          role: hrmsRole,
          department: getDepartmentForRole(user.role),
          branch: user.assignedCity || "Mumbai Main Branch",
          kycStatus: "Approved",
          status: user.isActive ? "Active" : "Inactive"
        });
      } else {
        let changed = false;
        if (emp.email !== user.email) { emp.email = user.email; changed = true; }
        if (emp.firstName !== firstName) { emp.firstName = firstName; changed = true; }
        if (emp.lastName !== lastName) { emp.lastName = lastName; changed = true; }
        if (emp.role !== hrmsRole) { emp.role = hrmsRole; changed = true; }
        if (user.assignedCity && emp.branch !== user.assignedCity) { emp.branch = user.assignedCity; changed = true; }
        if (emp.password !== user.password) { emp.password = user.password; changed = true; }
        
        const targetStatus = user.isActive ? "Active" : "Inactive";
        if (user.isActive !== undefined && emp.status !== targetStatus && emp.status !== "OnLeave") {
          emp.status = targetStatus;
          changed = true;
        }

        if (changed) {
          await emp.save();
        }
      }
    }

    const userEmails = users.map(u => u.email);
    await HrmsEmployee.deleteMany({
      email: { $nin: [...userEmails, "hradmin@bankhrms.com"] }
    });
  } catch (err) {
    console.error("Syncing employees with users failed:", err);
  }
};

// 1. Authentication
exports.login = async (req, res) => {
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
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    await syncEmployeesWithUsers();

    // Default HR Admin fallback check
    if (email === "hradmin@bankhrms.com" && password === "HRAdmin@123") {
      const token = jwt.sign(
        { email, role: "HRAdmin", name: "HR Admin" },
        process.env.JWT_SECRET || "qwertyuiop",
        { expiresIn: "7d" }
      );
      await logAudit("LOGIN", email, "HR Admin login successful via fallback");
      return res.status(200).json({
        success: true,
        token,
        user: { email, role: "HRAdmin", name: "HR Admin", employeeId: "EMP-001" }
      });
    }

    // Check DB employee
    const employee = await HrmsEmployee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: employee._id, email: employee.email, role: employee.role, name: `${employee.firstName} ${employee.lastName}` },
      process.env.JWT_SECRET || "qwertyuiop",
      { expiresIn: "7d" }
    );

    await logAudit("LOGIN", employee.email, `${employee.role} login successful`);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: employee._id,
        email: employee.email,
        role: employee.role,
        name: `${employee.firstName} ${employee.lastName}`,
        employeeId: employee.employeeId,
        branch: employee.branch
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Dashboard Analytics
exports.getDashboardStats = async (req, res) => {
  try {
    await syncEmployeesWithUsers();

    const totalEmployees = await HrmsEmployee.countDocuments({});
    const totalBranches = await HrmsBranch.countDocuments({});
    const activeEmployees = await HrmsEmployee.countDocuments({ status: "Active" });
    const onLeaveEmployees = await HrmsEmployee.countDocuments({ status: "OnLeave" });

    // Present count today
    const todayStr = new Date().toISOString().split("T")[0];
    const presentEmployees = await HrmsAttendance.countDocuments({ date: todayStr, status: "Present" });

    // New Joiners (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newJoiners = await HrmsEmployee.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Pending actions
    const pendingLeaves = await HrmsLeave.countDocuments({ status: "Pending" });
    const pendingExpenses = await HrmsExpense.countDocuments({ status: "Pending" });
    const pendingKYC = await HrmsEmployee.countDocuments({ kycStatus: "Pending" });
    const pendingApprovals = pendingLeaves + pendingExpenses + pendingKYC;

    // Recruitment statistics
    const jobs = await HrmsRecruitmentJob.find({});
    let totalCandidates = 0;
    let hiredCandidates = 0;
    jobs.forEach(job => {
      totalCandidates += job.candidates.length;
      hiredCandidates += job.candidates.filter(c => c.status === "Offered").length;
    });

    // Performance overview
    const perfRecords = await HrmsPerformance.find({});
    const avgRating = perfRecords.length > 0
      ? (perfRecords.reduce((sum, p) => sum + (p.rating || 0), 0) / perfRecords.length).toFixed(1)
      : 0;

    // Mock analytical charts data
    const employeeGrowth = [
      { month: "Jan", count: Math.max(0, totalEmployees - 5) },
      { month: "Feb", count: Math.max(0, totalEmployees - 4) },
      { month: "Mar", count: Math.max(0, totalEmployees - 3) },
      { month: "Apr", count: Math.max(0, totalEmployees - 2) },
      { month: "May", count: Math.max(0, totalEmployees - 1) },
      { month: "Jun", count: totalEmployees }
    ];

    const branchData = await HrmsBranch.find({});
    const branchPerformance = branchData.map(b => ({
      name: b.name,
      rating: b.performanceMetric,
      employees: b.employeesCount || 5
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalEmployees,
        totalBranches,
        activeEmployees,
        presentEmployees,
        onLeaveEmployees,
        newJoiners,
        pendingApprovals,
        pendingLeaves,
        pendingExpenses,
        pendingKYC,
        recruitmentStats: { totalCandidates, hiredCandidates, openJobs: jobs.filter(j => j.status === "Open").length },
        payrollStatus: "Processed (May 2026)",
        performanceOverview: { avgRating, totalReviews: perfRecords.length }
      },
      charts: {
        employeeGrowth,
        branchPerformance
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2b. Get Branches
exports.getBranches = async (req, res) => {
  try {
    const branches = await HrmsBranch.find({});
    return res.status(200).json({ success: true, branches });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Employee Management
exports.getEmployees = async (req, res) => {
  try {
    await syncEmployeesWithUsers();
    const employees = await HrmsEmployee.find({}).select("-password");
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const { employeeId, firstName, lastName, email, password, role, department, branch } = req.body;
    
    // Check if user already exists in either collection
    const existingUser = await User.findOne({ email });
    const existingEmp = await HrmsEmployee.findOne({ $or: [{ email }, { employeeId }] });
    if (existingUser || existingEmp) {
      return res.status(400).json({ success: false, message: "Employee ID or Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || "Employee@123", salt);

    // 1. Create core User
    const newUser = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      role: role || "FieldOfficer",
      assignedCity: branch || "Mumbai Main Branch",
      isActive: true
    });

    // 2. Create corresponding HrmsEmployee with same _id
    const finalEmpId = employeeId || ("EMP-" + newUser._id.toString().slice(-4).toUpperCase());
    const newEmp = await HrmsEmployee.create({
      _id: newUser._id,
      employeeId: finalEmpId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "FieldOfficer",
      department: department || getDepartmentForRole(role),
      branch: branch || "Mumbai Main Branch",
      status: "Active",
      kycStatus: "Approved"
    });

    await logAudit("ADD_EMPLOYEE", req.user?.email || "HRAdmin", `Added employee ${finalEmpId}`);
    return res.status(201).json({ success: true, employee: newEmp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, role, department, branch, status, kycStatus } = req.body;

    const emp = await HrmsEmployee.findById(id);
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });

    // Track transfers or promotions
    if (branch && branch !== emp.branch) {
      emp.transferHistory.push({
        fromBranch: emp.branch,
        toBranch: branch,
        approvedBy: req.user?.email || "HRAdmin"
      });
      emp.branch = branch;
    }

    if (role && role !== emp.role) {
      emp.promotionHistory.push({
        fromRole: emp.role,
        toRole: role,
        approvedBy: req.user?.email || "HRAdmin"
      });
      emp.role = role;
    }

    emp.firstName = firstName || emp.firstName;
    emp.lastName = lastName || emp.lastName;
    emp.department = department || emp.department;
    emp.status = status || emp.status;
    emp.kycStatus = kycStatus || emp.kycStatus;

    await emp.save();

    // Sync to User collection
    const user = await User.findOne({ email: emp.email });
    if (user) {
      user.name = `${emp.firstName} ${emp.lastName}`;
      user.role = emp.role;
      user.assignedCity = emp.branch;
      if (emp.status === "Inactive" || emp.status === "Terminated") {
        user.isActive = false;
      } else {
        user.isActive = true;
      }
      await user.save();
    }

    await logAudit("EDIT_EMPLOYEE", req.user?.email || "HRAdmin", `Updated employee ${emp.employeeId}`);

    return res.status(200).json({ success: true, employee: emp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const emp = await HrmsEmployee.findByIdAndDelete(id);
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });

    // Delete matching User
    await User.findOneAndDelete({ email: emp.email });

    await logAudit("DELETE_EMPLOYEE", req.user?.email || "HRAdmin", `Deleted employee ${emp.employeeId}`);
    return res.status(200).json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Attendance
exports.getAttendance = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "HRAdmin" || req.user?.role === "SuperAdmin" || req.user?.role === "Admin" || req.user?.email === "hradmin@bankhrms.com";
    const query = isAdmin ? {} : { employeeId: req.user?.employeeId };
    const attendance = await HrmsAttendance.find(query);
    return res.status(200).json({ success: true, attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkInCheckOut = async (req, res) => {
  try {
    const { employeeId, type, latitude, longitude } = req.body; // type = "checkIn" or "checkOut"
    const dateStr = new Date().toISOString().split("T")[0];

    let attendance = await HrmsAttendance.findOne({ employeeId, date: dateStr });
    if (!attendance) {
      attendance = new HrmsAttendance({
        employeeId,
        date: dateStr,
        status: "Present",
        latitude,
        longitude
      });
    }

    if (type === "checkIn") {
      attendance.checkIn = new Date();
      attendance.status = "Present";
    } else {
      attendance.checkOut = new Date();
      if (attendance.checkIn) {
        const diffMs = attendance.checkOut - attendance.checkIn;
        const diffHrs = diffMs / (1000 * 60 * 60);
        if (diffHrs > 9) {
          attendance.overtimeHours = Math.max(0, parseFloat((diffHrs - 9).toFixed(2)));
        }
      }
    }

    await attendance.save();
    return res.status(200).json({ success: true, attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCorrectionRequests = async (req, res) => {
  try {
    const corrections = await HrmsAttendance.find({ "correctionRequest.status": "Pending" });
    return res.status(200).json({ success: true, corrections });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveCorrection = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"
    const attendance = await HrmsAttendance.findById(id);
    if (!attendance) return res.status(404).json({ success: false, message: "Attendance record not found" });

    attendance.correctionRequest.status = status;
    if (status === "Approved") {
      if (attendance.correctionRequest.requestedCheckIn) attendance.checkIn = attendance.correctionRequest.requestedCheckIn;
      if (attendance.correctionRequest.requestedCheckOut) attendance.checkOut = attendance.correctionRequest.requestedCheckOut;
    }
    await attendance.save();

    await logAudit("APPROVE_ATTENDANCE_CORRECTION", req.user?.email || "HRAdmin", `Approved/Rejected correction for record ID ${id}`);
    return res.status(200).json({ success: true, attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Leaves
exports.getLeaves = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "HRAdmin" || req.user?.role === "SuperAdmin" || req.user?.role === "Admin" || req.user?.email === "hradmin@bankhrms.com";
    const query = isAdmin ? {} : { employeeId: req.user?.employeeId };
    const leaves = await HrmsLeave.find(query);
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.applyLeave = async (req, res) => {
  try {
    const { employeeId, type, startDate, endDate, reason } = req.body;
    const leave = await HrmsLeave.create({
      employeeId,
      type,
      startDate,
      endDate,
      reason,
      status: "Pending"
    });
    return res.status(201).json({ success: true, leave });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"
    const leave = await HrmsLeave.findById(id);
    if (!leave) return res.status(404).json({ success: false, message: "Leave request not found" });

    leave.status = status;
    leave.approvedBy = req.user?.email || "HRAdmin";
    await leave.save();

    // If approved, update Employee status
    if (status === "Approved") {
      await HrmsEmployee.findOneAndUpdate({ employeeId: leave.employeeId }, { status: "OnLeave" });
    }

    await logAudit("APPROVE_LEAVE", req.user?.email || "HRAdmin", `Leave status set to ${status} for request ID ${id}`);
    return res.status(200).json({ success: true, leave });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Payroll
exports.getPayroll = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "HRAdmin" || req.user?.role === "SuperAdmin" || req.user?.role === "Admin" || req.user?.email === "hradmin@bankhrms.com";
    const query = isAdmin ? {} : { employeeId: req.user?.employeeId };
    const payrolls = await HrmsPayroll.find(query);
    return res.status(200).json({ success: true, payrolls });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.processPayroll = async (req, res) => {
  try {
    const { month } = req.body; // e.g. "June 2026"
    const employees = await HrmsEmployee.find({ status: { $ne: "Terminated" } });

    const processedPayrolls = [];
    for (let emp of employees) {
      // Basic mock formula
      let base = 50000;
      if (emp.role === "BranchManager") base = 95000;
      if (emp.role === "HRAdmin") base = 120000;
      if (emp.role === "FieldOfficer") base = 60000;

      const allowances = Math.floor(base * 0.15);
      const bonus = 0;
      const taxDeductions = Math.floor(base * 0.12);
      const netPaid = base + allowances + bonus - taxDeductions;

      // Update or create payroll
      const payroll = await HrmsPayroll.findOneAndUpdate(
        { employeeId: emp.employeeId, month },
        {
          baseSalary: base,
          allowances,
          bonus,
          taxDeductions,
          netPaid,
          status: "Processed",
          processedAt: new Date()
        },
        { upsert: true, new: true }
      );
      processedPayrolls.push(payroll);
    }

    await logAudit("PROCESS_PAYROLL", req.user?.email || "HRAdmin", `Processed payroll for ${month}`);
    return res.status(200).json({ success: true, payrolls: processedPayrolls });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Recruitment
exports.getJobs = async (req, res) => {
  try {
    const jobs = await HrmsRecruitmentJob.find({});
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { title, department, branch, description } = req.body;
    const job = await HrmsRecruitmentJob.create({ title, department, branch, description });
    return res.status(201).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCandidateStatus = async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;
    const { status, feedback } = req.body;

    const job = await HrmsRecruitmentJob.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const candidate = job.candidates.id(candidateId);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

    candidate.status = status;
    if (feedback) candidate.feedback = feedback;
    await job.save();

    return res.status(200).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Performance
exports.getPerformance = async (req, res) => {
  try {
    const performance = await HrmsPerformance.find({});
    return res.status(200).json({ success: true, performance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { employeeId, kpis, rating, reviewComments, period, promotionRecommended } = req.body;
    const performance = await HrmsPerformance.create({
      employeeId,
      kpis,
      rating,
      reviewComments,
      period,
      promotionRecommended
    });
    return res.status(201).json({ success: true, performance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Compliance
exports.getComplianceLogs = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "HRAdmin" || req.user?.role === "SuperAdmin" || req.user?.role === "Admin" || req.user?.email === "hradmin@bankhrms.com";
    const query = isAdmin ? {} : { employeeId: req.user?.employeeId };
    const compliance = await HrmsCompliance.find(query);
    return res.status(200).json({ success: true, compliance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignComplianceTraining = async (req, res) => {
  try {
    const { employeeId, courseName } = req.body;
    const course = await HrmsCompliance.create({ employeeId, courseName, status: "Assigned" });
    return res.status(201).json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeComplianceTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, status } = req.body;
    const course = await HrmsCompliance.findByIdAndUpdate(
      id,
      { score, status, completedAt: new Date() },
      { new: true }
    );
    return res.status(200).json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 10. Assets
exports.getAssets = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "HRAdmin" || req.user?.role === "SuperAdmin" || req.user?.role === "Admin" || req.user?.email === "hradmin@bankhrms.com";
    const query = isAdmin ? {} : { employeeId: req.user?.employeeId };
    const assets = await HrmsAsset.find(query);
    return res.status(200).json({ success: true, assets });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.allocateAsset = async (req, res) => {
  try {
    const { employeeId, assetType, assetSerialNumber } = req.body;
    const asset = await HrmsAsset.create({ employeeId, assetType, assetSerialNumber });
    return res.status(201).json({ success: true, asset });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 11. Expenses
exports.getExpenses = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "HRAdmin" || req.user?.role === "SuperAdmin" || req.user?.role === "Admin" || req.user?.email === "hradmin@bankhrms.com";
    const query = isAdmin ? {} : { employeeId: req.user?.employeeId };
    const expenses = await HrmsExpense.find(query);
    return res.status(200).json({ success: true, expenses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"
    const expense = await HrmsExpense.findById(id);
    if (!expense) return res.status(404).json({ success: false, message: "Expense claim not found" });

    expense.status = status;
    expense.approvedBy = req.user?.email || "HRAdmin";
    await expense.save();

    await logAudit("APPROVE_EXPENSE", req.user?.email || "HRAdmin", `Approved/Rejected expense claim ID ${id}`);
    return res.status(200).json({ success: true, expense });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { employeeId, type, amount, description } = req.body;
    const expense = await HrmsExpense.create({ employeeId, type, amount, description, status: "Pending" });
    await logAudit("CREATE_EXPENSE", req.user?.email || "HRAdmin", `Submitted expense claim of ₹${amount} for ${employeeId}`);
    return res.status(201).json({ success: true, expense });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 12. Helpdesk Tickets
exports.getTickets = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "HRAdmin" || req.user?.role === "SuperAdmin" || req.user?.role === "Admin" || req.user?.email === "hradmin@bankhrms.com";
    const query = isAdmin ? {} : { employeeId: req.user?.employeeId };
    const tickets = await HrmsTicket.find(query);
    return res.status(200).json({ success: true, tickets });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.replyTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const ticket = await HrmsTicket.findById(id);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });

    ticket.replies.push({
      repliedBy: req.user?.email || "HRAdmin",
      message
    });
    ticket.status = "In-Progress";
    await ticket.save();

    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { employeeId, title, query } = req.body;
    const ticket = await HrmsTicket.create({ employeeId, title, query, status: "Open" });
    await logAudit("CREATE_TICKET", req.user?.email || "HRAdmin", `Opened support ticket: ${title} for ${employeeId}`);
    return res.status(201).json({ success: true, ticket });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 13. Audit logs
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await HrmsAuditLog.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
