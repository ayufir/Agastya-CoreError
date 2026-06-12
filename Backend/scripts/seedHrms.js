const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  HrmsEmployee,
  HrmsBranch,
  HrmsCompliance,
  HrmsAsset,
  HrmsLeave,
  HrmsPayroll,
  HrmsRecruitmentJob,
  HrmsPerformance,
  HrmsExpense,
  HrmsTicket,
  HrmsAttendance
} = require("../model/hrmsModel");

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bank-hrms";
    console.log("Connecting to MongoDB for seeding:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully. Purging old HRMS tables...");

    // Clear existing HRMS collections
    await HrmsEmployee.deleteMany({});
    await HrmsBranch.deleteMany({});
    await HrmsCompliance.deleteMany({});
    await HrmsAsset.deleteMany({});
    await HrmsLeave.deleteMany({});
    await HrmsPayroll.deleteMany({});
    await HrmsRecruitmentJob.deleteMany({});
    await HrmsPerformance.deleteMany({});
    await HrmsExpense.deleteMany({});
    await HrmsTicket.deleteMany({});
    await HrmsAttendance.deleteMany({});

    console.log("Purge complete. Seeding branches...");

    // 1. Seed Branches
    const branches = [
      { branchCode: "B-MUM01", name: "Mumbai Main Branch", city: "Mumbai", manager: "Rohan Sharma", employeesCount: 12, performanceMetric: 9.2 },
      { branchCode: "B-DEL02", name: "Connaught Place Branch", city: "Delhi", manager: "Priya Patel", employeesCount: 8, performanceMetric: 8.7 },
      { branchCode: "B-BLR03", name: "Indiranagar Branch", city: "Bengaluru", manager: "Karthik Raja", employeesCount: 15, performanceMetric: 9.5 },
      { branchCode: "B-HYD04", name: "Gachibowli Branch", city: "Hyderabad", manager: "Anjali Rao", employeesCount: 6, performanceMetric: 8.1 }
    ];
    await HrmsBranch.insertMany(branches);
    console.log(`Seeded ${branches.length} branches.`);

    // 2. Seed Employees (with hashed passwords)
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("HRAdmin@123", salt);
    const userPassword = await bcrypt.hash("Employee@123", salt);

    const employees = [
      {
        employeeId: "EMP-001",
        firstName: "HR",
        lastName: "Admin",
        email: "hradmin@bankhrms.com",
        password: adminPassword,
        role: "HRAdmin",
        department: "Human Resources",
        branch: "Mumbai Main Branch",
        kycStatus: "Approved",
        kycDocuments: [
          { docType: "PAN Card", docUrl: "https://example.com/pan.pdf", status: "Approved" },
          { docType: "Aadhaar Card", docUrl: "https://example.com/aadhaar.pdf", status: "Approved" }
        ],
        status: "Active"
      },
      {
        employeeId: "EMP-002",
        firstName: "Rohan",
        lastName: "Sharma",
        email: "rohan.sharma@bankhrms.com",
        password: userPassword,
        role: "BranchManager",
        department: "Retail Banking",
        branch: "Mumbai Main Branch",
        kycStatus: "Approved",
        status: "Active"
      },
      {
        employeeId: "EMP-003",
        firstName: "Amit",
        lastName: "Verma",
        email: "amit.verma@bankhrms.com",
        password: userPassword,
        role: "FieldOfficer",
        department: "Credit Valuation",
        branch: "Mumbai Main Branch",
        kycStatus: "Approved",
        status: "Active"
      },
      {
        employeeId: "EMP-004",
        firstName: "Karan",
        lastName: "Singh",
        email: "karan.singh@bankhrms.com",
        password: userPassword,
        role: "Employee",
        department: "Customer Service",
        branch: "Connaught Place Branch",
        kycStatus: "Pending",
        status: "Active"
      },
      {
        employeeId: "EMP-005",
        firstName: "Sneha",
        lastName: "Reddy",
        email: "sneha.reddy@bankhrms.com",
        password: userPassword,
        role: "Employee",
        department: "Operations",
        branch: "Indiranagar Branch",
        kycStatus: "Approved",
        status: "OnLeave"
      }
    ];

    const seededEmployees = await HrmsEmployee.insertMany(employees);
    console.log(`Seeded ${seededEmployees.length} employees.`);

    // 3. Seed Compliance Records
    const compliances = [
      { employeeId: "EMP-002", courseName: "Anti-Money Laundering (AML) 2026", status: "Completed", completedAt: new Date(), score: 95 },
      { employeeId: "EMP-003", courseName: "RBI Fair Practices Code Guidelines", status: "InProgress", score: 0 },
      { employeeId: "EMP-004", courseName: "Customer Data Security & Privacy (KYC)", status: "Assigned", score: 0 },
      { employeeId: "EMP-005", courseName: "Information Security Policy Review", status: "Completed", completedAt: new Date(), score: 88 }
    ];
    await HrmsCompliance.insertMany(compliances);

    // 4. Seed Asset Records
    const assets = [
      { employeeId: "EMP-001", assetType: "Laptop", assetSerialNumber: "LAP-MUM-88392", status: "Allocated" },
      { employeeId: "EMP-002", assetType: "Laptop", assetSerialNumber: "LAP-MUM-90103", status: "Allocated" },
      { employeeId: "EMP-003", assetType: "Mobile", assetSerialNumber: "MOB-MUM-22941", status: "Allocated" },
      { employeeId: "EMP-003", assetType: "SIM Card", assetSerialNumber: "SIM-JIO-987654", status: "Allocated" }
    ];
    await HrmsAsset.insertMany(assets);

    // 5. Seed Attendance Records (past week)
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const attendance = [
      { employeeId: "EMP-001", date: todayStr, checkIn: new Date(), checkOut: null, status: "Present" },
      { employeeId: "EMP-002", date: todayStr, checkIn: new Date(), checkOut: null, status: "Present" },
      { employeeId: "EMP-003", date: todayStr, checkIn: new Date(), checkOut: null, status: "Present" },
      { employeeId: "EMP-004", date: todayStr, checkIn: null, checkOut: null, status: "Absent" },
      { employeeId: "EMP-001", date: yesterdayStr, checkIn: new Date(yesterdayStr + "T09:00:00"), checkOut: new Date(yesterdayStr + "T18:00:00"), status: "Present" },
      { employeeId: "EMP-002", date: yesterdayStr, checkIn: new Date(yesterdayStr + "T09:15:00"), checkOut: new Date(yesterdayStr + "T18:30:00"), status: "Present" }
    ];
    await HrmsAttendance.insertMany(attendance);

    // 6. Seed Leave Requests
    const leaves = [
      { employeeId: "EMP-005", type: "Privilege", startDate: new Date("2026-06-10"), endDate: new Date("2026-06-15"), reason: "Family Event", status: "Approved", approvedBy: "hradmin@bankhrms.com" },
      { employeeId: "EMP-004", type: "Sick", startDate: new Date("2026-06-12"), endDate: new Date("2026-06-13"), reason: "Viral Fever", status: "Pending" }
    ];
    await HrmsLeave.insertMany(leaves);

    // 7. Seed Payroll Records (May 2026)
    const payrolls = [
      { employeeId: "EMP-001", month: "May 2026", baseSalary: 120000, allowances: 15000, bonus: 10000, taxDeductions: 18000, netPaid: 127000, status: "Processed", processedAt: new Date() },
      { employeeId: "EMP-002", month: "May 2026", baseSalary: 95000, allowances: 10000, bonus: 5000, taxDeductions: 12000, netPaid: 98000, status: "Processed", processedAt: new Date() },
      { employeeId: "EMP-003", month: "May 2026", baseSalary: 60000, allowances: 8000, bonus: 4000, taxDeductions: 7000, netPaid: 65000, status: "Processed", processedAt: new Date() }
    ];
    await HrmsPayroll.insertMany(payrolls);

    // 8. Seed Recruitment Jobs
    const jobs = [
      {
        title: "Credit Analyst Officer",
        department: "Credit Risk Management",
        branch: "Mumbai Main Branch",
        description: "Analyze credit limits, loan risk profiles and valuation metrics.",
        status: "Open",
        candidates: [
          { name: "Rahul Deshmukh", email: "rahul.d@gmail.com", status: "Interviewing", interviewTime: new Date() },
          { name: "Sunita Sen", email: "sunita.sen@yahoo.com", status: "Applied" }
        ]
      },
      {
        title: "Retail Loan Officer",
        department: "Retail Sales",
        branch: "Connaught Place Branch",
        description: "Handle retail banking loans, housing finance queries and verification workflows.",
        status: "Open",
        candidates: [
          { name: "Deepak Rawat", email: "deepak.rawat@gmail.com", status: "Offered", feedback: "Strong customer relationship skills, offered salary match." }
        ]
      }
    ];
    await HrmsRecruitmentJob.insertMany(jobs);

    // 9. Seed Performance reviews
    const performance = [
      {
        employeeId: "EMP-002",
        kpis: [
          { kpiName: "NPA Reduction", target: "Reduce under 1%", achievement: "0.85%", score: 9 },
          { kpiName: "Branch Valuation Cases", target: "120 Cases/Month", achievement: "135 Cases/Month", score: 10 }
        ],
        rating: 5,
        reviewComments: "Outstanding performance as branch manager.",
        period: "FY 2025-26",
        promotionRecommended: true
      },
      {
        employeeId: "EMP-003",
        kpis: [
          { kpiName: "Valuation Reports Timely Submission", target: "95% accuracy", achievement: "93%", score: 8 }
        ],
        rating: 4,
        reviewComments: "Good field operation metrics, highly reliable.",
        period: "FY 2025-26"
      }
    ];
    await HrmsPerformance.insertMany(performance);

    // 10. Seed Support Tickets
    const tickets = [
      { employeeId: "EMP-004", title: "Payslip Correction", query: "My allowance was not credited for the month of May.", status: "Open" },
      { employeeId: "EMP-005", title: "Laptop Charging Issue", query: "The laptop charger provided is failing intermittently.", status: "In-Progress", replies: [{ repliedBy: "hradmin@bankhrms.com", message: "Replacement has been ordered and will reach your branch on Monday." }] }
    ];
    await HrmsTicket.insertMany(tickets);

    // 11. Seed Expense claims
    const expenses = [
      { employeeId: "EMP-003", type: "Travel", amount: 2450, description: "Travel to client property valuation site in Outer Mumbai", status: "Pending" },
      { employeeId: "EMP-004", type: "Food", amount: 450, description: "Lunch during branch coordination meet", status: "Approved", approvedBy: "hradmin@bankhrms.com" }
    ];
    await HrmsExpense.insertMany(expenses);

    console.log("Database seeded successfully!");
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exit(1);
  }
};

seedData();
