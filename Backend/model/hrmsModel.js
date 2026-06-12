const mongoose = require("mongoose");

// 1. Employee Schema
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Employee" },
  department: { type: String, default: "Operations" },
  branch: { type: String, default: "Mumbai Main Branch" },
  kycStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  kycDocuments: [{
    docType: String, // Aadhaar, PAN, Degree
    docUrl: String,
    status: { type: String, default: "Pending" }
  }],
  status: { type: String, enum: ["Active", "Inactive", "OnLeave", "Terminated"], default: "Active" },
  transferHistory: [{
    fromBranch: String,
    toBranch: String,
    date: { type: Date, default: Date.now },
    approvedBy: String
  }],
  promotionHistory: [{
    fromRole: String,
    toRole: String,
    date: { type: Date, default: Date.now },
    approvedBy: String
  }],
  exitDetails: {
    exitDate: Date,
    reason: String,
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" }
  },
  createdAt: { type: Date, default: Date.now }
});

// 2. Attendance Schema
const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  checkIn: { type: Date },
  checkOut: { type: Date },
  status: { type: String, enum: ["Present", "Absent", "OnLeave", "HalfDay"], default: "Absent" },
  latitude: Number,
  longitude: Number,
  overtimeHours: { type: Number, default: 0 },
  correctionRequest: {
    requestedCheckIn: Date,
    requestedCheckOut: Date,
    reason: String,
    status: { type: String, enum: ["None", "Pending", "Approved", "Rejected"], default: "None" }
  }
});

// 3. Leave Schema
const leaveSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  type: { type: String, enum: ["Casual", "Sick", "Privilege", "Emergency", "HalfDay"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  approvedBy: String,
  createdAt: { type: Date, default: Date.now }
});

// 4. Payroll Schema
const payrollSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  month: { type: String, required: true }, // e.g. "June 2026"
  baseSalary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  incentives: { type: Number, default: 0 },
  allowances: { type: Number, default: 0 },
  taxDeductions: { type: Number, default: 0 },
  netPaid: { type: Number, required: true },
  status: { type: String, enum: ["Processed", "Pending"], default: "Pending" },
  processedAt: Date
});

// 5. Recruitment (Job Posting & Candidates) Schema
const recruitmentJobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  branch: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  candidates: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    resumeUrl: String,
    status: { type: String, enum: ["Applied", "Screening", "Interviewing", "Offered", "Rejected"], default: "Applied" },
    feedback: String,
    interviewTime: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

// 6. Performance Schema
const performanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  kpis: [{
    kpiName: String,
    target: String,
    achievement: String,
    score: { type: Number, min: 1, max: 10 }
  }],
  rating: { type: Number, min: 1, max: 5 },
  reviewComments: String,
  period: String, // e.g., "FY 2025-26"
  promotionRecommended: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// 7. Branch Schema
const branchSchema = new mongoose.Schema({
  branchCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  manager: String,
  employeesCount: { type: Number, default: 0 },
  performanceMetric: { type: Number, default: 8.5 } // rating out of 10
});

// 8. Compliance Schema
const complianceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  courseName: { type: String, required: true }, // AML, KYC rules, Information Security
  status: { type: String, enum: ["Assigned", "InProgress", "Completed"], default: "Assigned" },
  completedAt: Date,
  score: Number
});

// 9. Asset Schema
const assetSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  assetType: { type: String, enum: ["Laptop", "Mobile", "SIM Card", "ID Card"], required: true },
  assetSerialNumber: { type: String, required: true },
  allocatedDate: { type: Date, default: Date.now },
  returnDate: Date,
  status: { type: String, enum: ["Allocated", "Returned"], default: "Allocated" }
});

// 10. Expense Schema
const expenseSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  type: { type: String, enum: ["Travel", "Food", "Reimbursement"], required: true },
  amount: { type: Number, required: true },
  description: String,
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  receiptUrl: String,
  approvedBy: String,
  createdAt: { type: Date, default: Date.now }
});

// 11. Ticket Schema
const ticketSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  title: { type: String, required: true },
  query: { type: String, required: true },
  status: { type: String, enum: ["Open", "In-Progress", "Resolved"], default: "Open" },
  replies: [{
    repliedBy: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// 12. Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true }, // User email or ID
  details: String,
  ipAddress: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  HrmsEmployee: mongoose.model("HrmsEmployee", employeeSchema),
  HrmsAttendance: mongoose.model("HrmsAttendance", attendanceSchema),
  HrmsLeave: mongoose.model("HrmsLeave", leaveSchema),
  HrmsPayroll: mongoose.model("HrmsPayroll", payrollSchema),
  HrmsRecruitmentJob: mongoose.model("HrmsRecruitmentJob", recruitmentJobSchema),
  HrmsPerformance: mongoose.model("HrmsPerformance", performanceSchema),
  HrmsBranch: mongoose.model("HrmsBranch", branchSchema),
  HrmsCompliance: mongoose.model("HrmsCompliance", complianceSchema),
  HrmsAsset: mongoose.model("HrmsAsset", assetSchema),
  HrmsExpense: mongoose.model("HrmsExpense", expenseSchema),
  HrmsTicket: mongoose.model("HrmsTicket", ticketSchema),
  HrmsAuditLog: mongoose.model("HrmsAuditLog", auditLogSchema)
};
