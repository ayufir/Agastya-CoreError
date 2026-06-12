const express = require("express");
const router = express.Router();
const hrmsController = require("../controllers/hrmsController");
const { hrmsProtect } = require("../middleware/hrmsAuth");

// Public routes
router.post("/login", hrmsController.login);

// Protected routes (require hrmsProtect)
router.get("/dashboard", hrmsProtect, hrmsController.getDashboardStats);

// Branches
router.get("/branches", hrmsProtect, hrmsController.getBranches);

// Employee CRUD
router.get("/employees", hrmsProtect, hrmsController.getEmployees);
router.post("/employees", hrmsProtect, hrmsController.addEmployee);
router.put("/employees/:id", hrmsProtect, hrmsController.editEmployee);
router.delete("/employees/:id", hrmsProtect, hrmsController.deleteEmployee);

// Attendance routes
router.get("/attendance", hrmsProtect, hrmsController.getAttendance);
router.post("/attendance/checkin-checkout", hrmsProtect, hrmsController.checkInCheckOut);
router.get("/attendance/corrections", hrmsProtect, hrmsController.getCorrectionRequests);
router.put("/attendance/corrections/:id", hrmsProtect, hrmsController.approveCorrection);

// Leave routes
router.get("/leaves", hrmsProtect, hrmsController.getLeaves);
router.post("/leaves", hrmsProtect, hrmsController.applyLeave);
router.put("/leaves/:id", hrmsProtect, hrmsController.approveLeave);

// Payroll routes
router.get("/payroll", hrmsProtect, hrmsController.getPayroll);
router.post("/payroll/process", hrmsProtect, hrmsController.processPayroll);

// Recruitment routes
router.get("/jobs", hrmsProtect, hrmsController.getJobs);
router.post("/jobs", hrmsProtect, hrmsController.createJob);
router.put("/jobs/:jobId/candidates/:candidateId", hrmsProtect, hrmsController.updateCandidateStatus);

// Performance routes
router.get("/performance", hrmsProtect, hrmsController.getPerformance);
router.post("/performance/review", hrmsProtect, hrmsController.addReview);

// Compliance routes
router.get("/compliance", hrmsProtect, hrmsController.getComplianceLogs);
router.post("/compliance/assign", hrmsProtect, hrmsController.assignComplianceTraining);
router.put("/compliance/:id", hrmsProtect, hrmsController.completeComplianceTraining);

// Asset routes
router.get("/assets", hrmsProtect, hrmsController.getAssets);
router.post("/assets/allocate", hrmsProtect, hrmsController.allocateAsset);

// Expense routes
router.get("/expenses", hrmsProtect, hrmsController.getExpenses);
router.post("/expenses", hrmsProtect, hrmsController.createExpense);
router.put("/expenses/:id", hrmsProtect, hrmsController.approveExpense);

// Support tickets routes
router.get("/tickets", hrmsProtect, hrmsController.getTickets);
router.post("/tickets", hrmsProtect, hrmsController.createTicket);
router.put("/tickets/:id/reply", hrmsProtect, hrmsController.replyTicket);

// Audit logs
router.get("/audit-logs", hrmsProtect, hrmsController.getAuditLogs);

module.exports = router;
