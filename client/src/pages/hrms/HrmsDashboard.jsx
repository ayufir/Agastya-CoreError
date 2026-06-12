import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchStats,
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  fetchAttendance,
  checkInCheckOut,
  approveCorrection,
  fetchLeaves,
  applyLeave,
  approveLeave,
  fetchPayroll,
  processPayroll,
  fetchJobs,
  createJob,
  updateCandidate,
  fetchPerformance,
  createReview,
  fetchCompliance,
  assignTraining,
  completeCompliance,
  fetchAssets,
  allocateAsset,
  fetchExpenses,
  createExpense,
  approveExpense,
  fetchTickets,
  createTicket,
  replyTicket,
  fetchAuditLogs,
  logoutHrms
} from "../../redux/features/hrms/hrmsSlice";
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  DollarSign,
  Briefcase,
  TrendingUp,
  MapPin,
  ShieldCheck,
  BookOpen,
  Laptop,
  Receipt,
  HelpCircle,
  Bell,
  FileSpreadsheet,
  LogOut,
  Sun,
  Moon,
  Palette,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Menu,
  ChevronRight,
  Filter,
  Download,
  AlertCircle,
  Award,
  Eye,
  Info,
  Layers,
  ArrowRight,
  UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const themePresets = {
  blue: {
    name: "Corporate Blue",
    accent: "from-blue-600 to-cyan-500",
    accentText: "text-blue-500",
    accentBorder: "border-blue-500/20 focus:border-blue-500",
    accentBg: "bg-blue-500/10",
    glow1: "bg-blue-700/15",
    glow2: "bg-cyan-700/15",
    chartColor: "#2563eb",
    chartColors: ["#2563eb", "#06b6d4", "#10b981", "#f97316", "#a855f7"],
    btnGradient: "from-blue-600 to-cyan-500 hover:shadow-blue-500/20",
    btnPrimary: "bg-blue-600 hover:bg-blue-700",
    iconBg: "bg-blue-600/10 text-blue-500",
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    darkBg: "bg-gradient-to-br from-slate-950 via-slate-950 to-blue-950/40",
    lightBg: "bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/50"
  },
  emerald: {
    name: "Emerald Wealth",
    accent: "from-emerald-600 to-teal-500",
    accentText: "text-emerald-500",
    accentBorder: "border-emerald-500/20 focus:border-emerald-500",
    accentBg: "bg-emerald-500/10",
    glow1: "bg-emerald-700/15",
    glow2: "bg-teal-700/15",
    chartColor: "#10b981",
    chartColors: ["#10b981", "#0d9488", "#3b82f6", "#eab308", "#8b5cf6"],
    btnGradient: "from-emerald-600 to-teal-500 hover:shadow-emerald-500/20",
    btnPrimary: "bg-emerald-600 hover:bg-emerald-700",
    iconBg: "bg-emerald-600/10 text-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    darkBg: "bg-gradient-to-br from-slate-950 via-slate-950 to-emerald-950/40",
    lightBg: "bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/50"
  },
  royal: {
    name: "Royal Platinum",
    accent: "from-purple-600 to-indigo-500",
    accentText: "text-purple-500",
    accentBorder: "border-purple-500/20 focus:border-purple-500",
    accentBg: "bg-purple-500/10",
    glow1: "bg-purple-700/15",
    glow2: "bg-indigo-700/15",
    chartColor: "#8b5cf6",
    chartColors: ["#8b5cf6", "#6366f1", "#ec4899", "#f43f5e", "#10b981"],
    btnGradient: "from-purple-600 to-indigo-500 hover:shadow-purple-500/20",
    btnPrimary: "bg-purple-600 hover:bg-purple-700",
    iconBg: "bg-purple-600/10 text-purple-500",
    badge: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    darkBg: "bg-gradient-to-br from-slate-950 via-slate-950 to-purple-950/40",
    lightBg: "bg-gradient-to-br from-slate-50 via-slate-50 to-purple-50/50"
  },
  sunset: {
    name: "Sunset Premium",
    accent: "from-amber-500 to-rose-500",
    accentText: "text-amber-500",
    accentBorder: "border-amber-500/20 focus:border-amber-500",
    accentBg: "bg-amber-500/10",
    glow1: "bg-amber-700/15",
    glow2: "bg-rose-700/15",
    chartColor: "#f59e0b",
    chartColors: ["#f59e0b", "#f43f5e", "#d97706", "#3b82f6", "#10b981"],
    btnGradient: "from-amber-500 to-rose-500 hover:shadow-amber-500/20",
    btnPrimary: "bg-amber-550 hover:bg-amber-600",
    iconBg: "bg-amber-600/10 text-amber-500",
    badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    darkBg: "bg-gradient-to-br from-slate-950 via-slate-950 to-rose-950/20",
    lightBg: "bg-gradient-to-br from-slate-50 via-slate-50 to-amber-50/50"
  }
};

const HrmsDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Theme & Layout
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("hrmsDarkMode") !== "false";
  });
  const [themePreset, setThemePreset] = useState(() => {
    return localStorage.getItem("hrmsThemePreset") || "blue";
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth >= 768 : true;
  });
  const [activeTab, setActiveTab] = useState("Dashboard");

  const tp = themePresets[themePreset] || themePresets.blue;

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterBranchSearch, setFilterBranchSearch] = useState("");

  // Modals visibility toggles
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);

  // Focus details state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedBranchEmployees, setSelectedBranchEmployees] = useState(null);

  // Forms state
  const [newEmp, setNewEmp] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "Employee",
    department: "Operations",
    branch: "Mumbai Main Branch"
  });

  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    branch: "Mumbai Main Branch",
    description: ""
  });

  const [exitForm, setExitForm] = useState({
    employeeId: "",
    exitDate: "",
    reason: ""
  });

  const [transferForm, setTransferForm] = useState({
    employeeId: "",
    branch: "Connaught Place Branch"
  });

  const [promotionForm, setPromotionForm] = useState({
    employeeId: "",
    role: "BranchManager"
  });

  const [shiftForm, setShiftForm] = useState({
    employeeId: "",
    shift: "General Shift (09:00 AM - 06:00 PM)"
  });

  const [leaveForm, setLeaveForm] = useState({
    employeeId: "",
    type: "Casual",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const [bonusForm, setBonusForm] = useState({
    employeeId: "",
    bonus: "",
    incentives: ""
  });

  const [interviewForm, setInterviewForm] = useState({
    date: "",
    time: "",
    interviewer: ""
  });

  const [complianceForm, setComplianceForm] = useState({
    employeeId: "",
    courseName: "Anti-Money Laundering (AML) 2026"
  });

  const [quizState, setQuizState] = useState({
    courseId: "",
    employeeId: "",
    courseName: "",
    answers: { q1: "", q2: "", q3: "" }
  });

  const [assetForm, setAssetForm] = useState({
    employeeId: "",
    assetType: "Laptop",
    assetSerialNumber: ""
  });

  const [expenseForm, setExpenseForm] = useState({
    employeeId: "",
    type: "Travel",
    amount: "",
    description: ""
  });

  const [ticketForm, setTicketForm] = useState({
    employeeId: "",
    title: "",
    query: ""
  });

  const [reviewForm, setReviewForm] = useState({
    employeeId: "",
    period: "FY 2025-26",
    rating: "5",
    kpis: [
      { kpiName: "Valuation TAT", target: "95% inside 48 hrs", achievement: "96%", score: 9 },
      { kpiName: "NPA Recovery Rate", target: "85% Target Met", achievement: "82%", score: 8 }
    ],
    reviewComments: "",
    promotionRecommended: false
  });

  const [reportConfig, setReportConfig] = useState({
    type: "Employee",
    branch: "All",
    dept: "All"
  });

  const [ticketReply, setTicketReply] = useState({});

  // Redux Selectors
  const {
    user,
    token,
    stats,
    charts,
    employees,
    attendance,
    leaves,
    payroll,
    jobs,
    performance,
    compliance,
    assets,
    expenses,
    tickets,
    auditLogs,
    loading
  } = useSelector((state) => state.hrms);

  // Check Auth and Load initial Data
  useEffect(() => {
    if (!token || !user) {
      navigate("/hrms/login");
    } else {
      dispatch(fetchStats());
      dispatch(fetchEmployees());
      dispatch(fetchAttendance());
      dispatch(fetchLeaves());
      dispatch(fetchPayroll());
      dispatch(fetchJobs());
      dispatch(fetchPerformance());
      dispatch(fetchCompliance());
      dispatch(fetchAssets());
      dispatch(fetchExpenses());
      dispatch(fetchTickets());
      dispatch(fetchAuditLogs());
    }
  }, [token, user, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logoutHrms());
    toast.success("Logged out successfully");
    navigate("/hrms/login");
  };

  // 15 Modules Sidebar Items
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Employee Management", icon: Users },
    { name: "Attendance Management", icon: Clock },
    { name: "Leave Management", icon: CalendarDays },
    { name: "Payroll Management", icon: DollarSign },
    { name: "Recruitment Module", icon: Briefcase },
    { name: "Performance Management", icon: TrendingUp },
    { name: "Branch Management", icon: MapPin },
    { name: "Banking Compliance", icon: ShieldCheck },
    { name: "Training & Learning", icon: BookOpen },
    { name: "Asset Management", icon: Laptop },
    { name: "Travel & Food claim vouchers", icon: Receipt },
    { name: "Ticket & Helpdesk", icon: HelpCircle },
    { name: "Notifications Center", icon: Bell },
    { name: "Reports & Analytics", icon: FileSpreadsheet },
    { name: "Audit Logs", icon: FileSpreadsheet }
  ];

  const isAdmin = user?.role === "HRAdmin" || user?.role === "SuperAdmin" || user?.role === "Admin";
  
  const allowedEmployeeTabs = [
    "Dashboard",
    "Attendance Management",
    "Leave Management",
    "Payroll Management",
    "Travel & Food claim vouchers",
    "Reports & Analytics"
  ];

  const filteredMenuItems = isAdmin 
    ? menuItems 
    : menuItems.filter(item => allowedEmployeeTabs.includes(item.name));

  // Forms Submissions Handlers
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmp.employeeId || !newEmp.firstName || !newEmp.lastName || !newEmp.email) {
      return toast.error("Please fill in all fields");
    }
    dispatch(createEmployee(newEmp)).then((res) => {
      if (!res.error) {
        toast.success("Employee added successfully!");
        setShowAddEmpModal(false);
        setNewEmp({
          employeeId: "",
          firstName: "",
          lastName: "",
          email: "",
          role: "Employee",
          department: "Operations",
          branch: "Mumbai Main Branch"
        });
      }
    });
  };

  const handleExitSubmit = (e) => {
    e.preventDefault();
    if (!exitForm.employeeId || !exitForm.exitDate || !exitForm.reason) {
      return toast.error("Please fill in all fields");
    }
    const emp = employees.find(e => e.employeeId === exitForm.employeeId);
    if (!emp) return toast.error("Employee not found");
    dispatch(updateEmployee({
      id: emp._id,
      data: {
        status: "Terminated",
        exitDetails: { exitDate: exitForm.exitDate, reason: exitForm.reason, status: "Completed" }
      }
    })).then((res) => {
      if (!res.error) {
        toast.success("Exit details logged and profile deactivated");
        setShowExitModal(false);
        setExitForm({ employeeId: "", exitDate: "", reason: "" });
      }
    });
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferForm.employeeId || !transferForm.branch) {
      return toast.error("Please fill in all fields");
    }
    const emp = employees.find(e => e.employeeId === transferForm.employeeId);
    if (!emp) return toast.error("Employee not found");
    dispatch(updateEmployee({
      id: emp._id,
      data: { branch: transferForm.branch }
    })).then((res) => {
      if (!res.error) {
        toast.success(`Transferred employee to ${transferForm.branch}`);
        setShowTransferModal(false);
        setTransferForm({ employeeId: "", branch: "Connaught Place Branch" });
      }
    });
  };

  const handlePromotionSubmit = (e) => {
    e.preventDefault();
    if (!promotionForm.employeeId || !promotionForm.role) {
      return toast.error("Please fill in all fields");
    }
    const emp = employees.find(e => e.employeeId === promotionForm.employeeId);
    if (!emp) return toast.error("Employee not found");
    dispatch(updateEmployee({
      id: emp._id,
      data: { role: promotionForm.role }
    })).then((res) => {
      if (!res.error) {
        toast.success(`Promoted employee to ${promotionForm.role}`);
        setShowPromotionModal(false);
        setPromotionForm({ employeeId: "", role: "BranchManager" });
      }
    });
  };

  const handleShiftSubmit = (e) => {
    e.preventDefault();
    if (!shiftForm.employeeId || !shiftForm.shift) {
      return toast.error("Please fill in all fields");
    }
    toast.success(`Shift scheduled for ${shiftForm.employeeId}: ${shiftForm.shift}`);
    setShowShiftModal(false);
    setShiftForm({ employeeId: "", shift: "General Shift (09:00 AM - 06:00 PM)" });
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveForm.employeeId || !leaveForm.type || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      return toast.error("Please fill in all fields");
    }
    dispatch(applyLeave(leaveForm)).then((res) => {
      if (!res.error) {
        toast.success("Leave applied successfully on behalf of employee!");
        setShowLeaveModal(false);
        setLeaveForm({ employeeId: "", type: "Casual", startDate: "", endDate: "", reason: "" });
      }
    });
  };

  const handleBonusSubmit = (e) => {
    e.preventDefault();
    if (!bonusForm.employeeId) return toast.error("Employee ID is required");
    toast.success(`Bonus/Incentive queued for ${bonusForm.employeeId}. Will apply in next payroll run.`);
    setShowBonusModal(false);
    setBonusForm({ employeeId: "", bonus: "", incentives: "" });
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.department || !newJob.description) {
      return toast.error("Please fill in all fields");
    }
    dispatch(createJob(newJob)).then((res) => {
      if (!res.error) {
        toast.success("Job posting created!");
        setShowAddJobModal(false);
        setNewJob({ title: "", department: "", branch: "Mumbai Main Branch", description: "" });
      }
    });
  };

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    if (!interviewForm.date || !interviewForm.time || !interviewForm.interviewer) {
      return toast.error("Please fill in all fields");
    }
    const feedbackText = `Interview scheduled with ${interviewForm.interviewer} on ${interviewForm.date} at ${interviewForm.time}`;
    dispatch(updateCandidate({
      jobId: selectedJobId,
      candidateId: selectedCandidate._id,
      status: "Interviewing",
      feedback: feedbackText
    })).then((res) => {
      if (!res.error) {
        toast.success("Interview scheduled and updated in pipeline!");
        setShowInterviewModal(false);
        setInterviewForm({ date: "", time: "", interviewer: "" });
      }
    });
  };

  const handleOfferLetterPDF = (candidate, job) => {
    const doc = new jsPDF();
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("BANK OF INDIA GROUP HRMS", 14, 25);
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    const dateStr = new Date().toLocaleDateString();
    doc.text(`Date: ${dateStr}`, 14, 55);
    doc.text("PRIVATE & CONFIDENTIAL", 14, 62);
    
    doc.setFont("helvetica", "bold");
    doc.text(`To: ${candidate.name}`, 14, 75);
    doc.setFont("helvetica", "normal");
    doc.text(`Email: ${candidate.email}`, 14, 81);
    
    doc.setFont("helvetica", "bold");
    doc.text(`Subject: Offer of Employment for ${job.title}`, 14, 95);
    doc.setFont("helvetica", "normal");
    
    const letterText = `We are pleased to offer you employment at the Bank of India Group in the capacity of ${job.title} assigned to our ${job.branch}. You will be positioned in the ${job.department} department.

Your annual compensation package has been structured to meet standard industrial grades. We request you to report for induction on the first business day of next month.

Please review this letter, sign it, and upload it back within 5 working days to confirm your acceptance.`;
    
    const splitText = doc.splitTextToSize(letterText, 180);
    doc.text(splitText, 14, 105);
    
    doc.setFont("helvetica", "bold");
    doc.text("For Bank of India Group", 14, 180);
    doc.text("Human Resources Department", 14, 186);
    
    doc.rect(14, 210, 50, 20);
    doc.text("Candidate Signature", 14, 235);
    
    doc.save(`Offer_Letter_${candidate.name.replace(" ", "_")}.pdf`);
    toast.success("Offer Letter PDF generated successfully!");
  };

  const handlePerformanceSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.employeeId || !reviewForm.reviewComments) {
      return toast.error("Please fill in all fields");
    }
    dispatch(createReview(reviewForm)).then((res) => {
      if (!res.error) {
        toast.success("KPI evaluation review logged successfully");
        setShowPerformanceModal(false);
        setReviewForm({
          employeeId: "",
          period: "FY 2025-26",
          rating: "5",
          kpis: [
            { kpiName: "Valuation TAT", target: "95% inside 48 hrs", achievement: "96%", score: 9 },
            { kpiName: "NPA Recovery Rate", target: "85% Target Met", achievement: "82%", score: 8 }
          ],
          reviewComments: "",
          promotionRecommended: false
        });
      }
    });
  };

  const handleComplianceAssign = (e) => {
    e.preventDefault();
    if (!complianceForm.employeeId || !complianceForm.courseName) {
      return toast.error("Please fill in all fields");
    }
    dispatch(assignTraining(complianceForm)).then((res) => {
      if (!res.error) {
        toast.success("Training certification course assigned!");
        setShowComplianceModal(false);
        setComplianceForm({ employeeId: "", courseName: "Anti-Money Laundering (AML) 2026" });
      }
    });
  };

  const handleAssetAllocate = (e) => {
    e.preventDefault();
    if (!assetForm.employeeId || !assetForm.assetSerialNumber) {
      return toast.error("Please fill in all fields");
    }
    dispatch(allocateAsset(assetForm)).then((res) => {
      if (!res.error) {
        toast.success("Asset allocated successfully to employee!");
        setShowAssetModal(false);
        setAssetForm({ employeeId: "", assetType: "Laptop", assetSerialNumber: "" });
      }
    });
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.employeeId || !expenseForm.amount || !expenseForm.description) {
      return toast.error("Please fill in all fields");
    }
    dispatch(createExpense(expenseForm)).then((res) => {
      if (!res.error) {
        toast.success("Expense claim submitted!");
        setShowExpenseModal(false);
        setExpenseForm({ employeeId: "", type: "Travel", amount: "", description: "" });
      }
    });
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.employeeId || !ticketForm.title || !ticketForm.query) {
      return toast.error("Please fill in all fields");
    }
    dispatch(createTicket(ticketForm)).then((res) => {
      if (!res.error) {
        toast.success("HR Support ticket opened!");
        setShowTicketModal(false);
        setTicketForm({ employeeId: "", title: "", query: "" });
      }
    });
  };

  const handleTicketReply = (ticketId) => {
    const replyText = ticketReply[ticketId];
    if (!replyText) return toast.error("Reply message cannot be empty");
    dispatch(replyTicket({ id: ticketId, message: replyText })).then((res) => {
      if (!res.error) {
        toast.success("Reply submitted successfully!");
        setTicketReply(prev => ({ ...prev, [ticketId]: "" }));
      }
    });
  };

  // Compliance training assessment simulator
  const handleStartQuiz = (compRecord) => {
    setQuizState({
      courseId: compRecord._id,
      employeeId: compRecord.employeeId,
      courseName: compRecord.courseName,
      answers: { q1: "", q2: "", q3: "" }
    });
    setShowQuizModal(true);
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    const { q1, q2, q3 } = quizState.answers;
    if (!q1 || !q2 || !q3) return toast.error("Please answer all questions");
    
    // Simple grading
    let score = 0;
    if (q1 === "A") score += 33;
    if (q2 === "B") score += 33;
    if (q3 === "A") score += 34;

    dispatch(completeCompliance({
      id: quizState.courseId,
      score,
      status: "Completed"
    })).then((res) => {
      if (!res.error) {
        toast.success(`Quiz graded! Score: ${score}%. Compliance training updated.`);
        setShowQuizModal(false);
      }
    });
  };

  // Report Generator Downloads
  const handleExportExcel = () => {
    const data = getFilteredReportData();
    if (data.length === 0) return toast.error("No records found for current filter configuration");

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, reportConfig.type);
    XLSX.writeFile(workbook, `HRMS_${reportConfig.type}_Report.xlsx`);
    toast.success("Excel report exported successfully!");
  };

  const handleExportPDF = () => {
    const data = getFilteredReportData();
    if (data.length === 0) return toast.error("No records found for current filter configuration");

    const doc = new jsPDF();
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 35, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`Bank HRMS - ${reportConfig.type} Report`, 14, 22);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Branch: ${reportConfig.branch} | Department: ${reportConfig.dept}`, 14, 45);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 50);

    const headers = Object.keys(data[0]);
    const body = data.map(row => headers.map(h => typeof row[h] === 'object' ? JSON.stringify(row[h]) : row[h]));

    doc.autoTable({
      head: [headers],
      body: body,
      startY: 58,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 8 }
    });

    doc.save(`HRMS_${reportConfig.type}_Report.pdf`);
    toast.success("PDF report exported successfully!");
  };

  const getFilteredReportData = () => {
    let baseData = [];
    if (reportConfig.type === "Employee") baseData = employees;
    else if (reportConfig.type === "Attendance") baseData = attendance;
    else if (reportConfig.type === "Leave") baseData = leaves;
    else if (reportConfig.type === "Payroll") baseData = payroll;
    else if (reportConfig.type === "Performance") baseData = performance;
    else if (reportConfig.type === "Compliance") baseData = compliance;
    else if (reportConfig.type === "Audit Logs") baseData = auditLogs;

    return baseData.map(item => {
      const clean = { ...item };
      delete clean._id;
      delete clean.__v;
      delete clean.password;
      return clean;
    });
  };

  // Payslip Download logic
  const handlePayslipDownload = (pay) => {
    const doc = new jsPDF();
    
    // Layout Design
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(15, 23, 42); // Dark slate top
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("BANK OF INDIA GROUP", 14, 25);
    doc.setFontSize(10);
    doc.text("Corporate HR & Payroll Services", 14, 32);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text(`PAYSLIP FOR THE MONTH OF ${pay.month.toUpperCase()}`, 14, 55);

    // Metadata grid
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.rect(14, 62, 182, 30);
    doc.line(105, 62, 105, 92);
    
    doc.setFont("helvetica", "bold");
    doc.text("Employee ID:", 18, 69);
    doc.setFont("helvetica", "normal");
    doc.text(pay.employeeId, 45, 69);

    const emp = employees.find(e => e.employeeId === pay.employeeId);
    doc.setFont("helvetica", "bold");
    doc.text("Name:", 18, 77);
    doc.setFont("helvetica", "normal");
    doc.text(emp ? `${emp.firstName} ${emp.lastName}` : "Bank Employee", 45, 77);

    doc.setFont("helvetica", "bold");
    doc.text("Department:", 18, 85);
    doc.setFont("helvetica", "normal");
    doc.text(emp ? emp.department : "Retail Banking", 45, 85);

    doc.setFont("helvetica", "bold");
    doc.text("Branch:", 109, 69);
    doc.setFont("helvetica", "normal");
    doc.text(emp ? emp.branch : "Mumbai Main Branch", 130, 69);

    doc.setFont("helvetica", "bold");
    doc.text("Grade/Role:", 109, 77);
    doc.setFont("helvetica", "normal");
    doc.text(emp ? emp.role : "Officer", 130, 77);

    doc.setFont("helvetica", "bold");
    doc.text("Status:", 109, 85);
    doc.setFont("helvetica", "normal");
    doc.text("Processed & Paid", 130, 85);

    // Earnings vs Deductions Table
    const tableData = [
      ["Basic Salary", `INR ${pay.baseSalary.toLocaleString()}`, "Professional Tax (PT)", `INR ${(pay.taxDeductions * 0.1).toFixed(0)}`],
      ["Allowances (HRA/DA)", `INR ${pay.allowances.toLocaleString()}`, "Income Tax (TDS)", `INR ${(pay.taxDeductions * 0.9).toFixed(0)}`],
      ["Bonus / Incentives", `INR ${pay.bonus.toLocaleString()}`, "-", "-"],
      ["Total Earnings", `INR ${(pay.baseSalary + pay.allowances + pay.bonus).toLocaleString()}`, "Total Deductions", `INR ${pay.taxDeductions.toLocaleString()}`]
    ];

    doc.autoTable({
      head: [["EARNINGS", "AMOUNT", "DEDUCTIONS", "AMOUNT"]],
      body: tableData,
      startY: 102,
      theme: "grid",
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 9 }
    });

    const finalY = doc.lastAutoTable.finalY + 12;
    doc.setFillColor(248, 250, 252);
    doc.rect(14, finalY - 6, 182, 15, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("NET SALARY TRANSFERRED:", 18, finalY + 3);
    doc.setTextColor(37, 99, 235);
    doc.text(`INR ${pay.netPaid.toLocaleString()}`, 110, finalY + 3);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text("This is an electronically generated document. Signatures not required.", 14, 280);

    doc.save(`Payslip_${pay.employeeId}_${pay.month.replace(" ", "_")}.pdf`);
    toast.success(`Payslip PDF downloaded for ${pay.employeeId}!`);
  };

  // Recharts Colors
  const COLORS = tp.chartColors;

  // Mock Notification Alerts Center
  const activeAlerts = [
    { type: "Leave", msg: "EMP-004 Sick Leave request is pending HR approval.", time: "10 mins ago" },
    { type: "Recruitment", msg: "Deepak Rawat (Retail Loan) candidate joined in pipeline.", time: "1 hour ago" },
    { type: "Compliance", msg: "Karan Singh AML 2026 course assessment is pending.", time: "2 hours ago" },
    { type: "Announcement", msg: "RBI regulatory compliance audit scheduled for Aug 2026.", time: "1 day ago" }
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-300 relative overflow-hidden ${darkMode ? tp.darkBg + " text-white" : tp.lightBg + " text-slate-900"}`}>
      {/* Background Glows */}
      <div className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full ${tp.glow1} blur-[120px] pointer-events-none`} />
      <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full ${tp.glow2} blur-[120px] pointer-events-none`} />

      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* ── Left Sidebar Navigation (Vibrant Theme) ── */}
      <aside className={`fixed inset-y-0 left-0 md:relative backdrop-blur-md flex flex-col border-r transition-all duration-300 z-50 ${
        sidebarOpen ? "w-72 translate-x-0" : "w-20 -translate-x-full md:translate-x-0 md:w-20"
      } ${darkMode ? "bg-slate-900/95 md:bg-slate-900/60 border-slate-800" : "bg-white/95 md:bg-white/80 border-slate-200"}`}>
        <div className={`p-6 flex items-center justify-between border-b ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tp.accent} flex items-center justify-center text-white font-black shadow-lg`}>
              B
            </div>
            {sidebarOpen && (
              <div>
                <h1 className={`text-sm font-extrabold tracking-wider bg-gradient-to-r ${tp.accent} bg-clip-text text-transparent`}>
                  BANK HRMS
                </h1>
                <p className="text-[10px] text-slate-400 font-bold">ENTERPRISE ADMIN</p>
              </div>
            )}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
            <Menu size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  // Auto-close sidebar on mobile after tab select
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                  active
                    ? `bg-gradient-to-r ${tp.btnGradient} text-white shadow-md`
                    : darkMode
                      ? "text-slate-400 hover:text-white hover:bg-slate-800/40"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon size={18} className={active ? "text-white" : tp.accentText} />
                {(sidebarOpen || window.innerWidth < 768) && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className={`p-4 border-t ${darkMode ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50"} flex items-center gap-3`}>
          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${tp.accent} flex items-center justify-center text-white font-bold text-xs`}>
            {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "AD"}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.name || "HR Admin"}</p>
              <p className="text-[10px] text-slate-400 font-semibold truncate">{user?.email || "hradmin@bankhrms.com"}</p>
            </div>
          )}
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ── Main Panel Wrapper ── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Navbar */}
        <header className={`backdrop-blur-md border-b px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 ${darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50/80 border-slate-200"}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg hover:bg-slate-800/20 text-slate-400 md:hidden"
            >
              <Menu size={18} />
            </button>
            <h2 className="text-sm font-bold tracking-wider uppercase text-slate-400">{activeTab}</h2>
            {loading && <div className={`w-4 h-4 border-2 ${tp.accentText} border-t-transparent rounded-full animate-spin`} />}
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Select Dropdown */}
            <div className="flex items-center gap-2">
              <Palette size={16} className={darkMode ? "text-slate-400" : "text-slate-650"} />
              <select
                value={themePreset}
                onChange={(e) => {
                  setThemePreset(e.target.value);
                  localStorage.setItem("hrmsThemePreset", e.target.value);
                }}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-bold outline-none transition-all duration-300 ${
                  darkMode
                    ? "bg-slate-900 border-slate-800 text-white focus:border-blue-500"
                    : "bg-white border-slate-200 text-slate-800 shadow-sm focus:border-blue-600"
                }`}
              >
                <option value="blue">Corporate Blue</option>
                <option value="emerald">Emerald Wealth</option>
                <option value="royal">Royal Platinum</option>
                <option value="sunset">Sunset Premium</option>
              </select>
            </div>

            <div className="relative">
              <button
                onClick={() => setActiveTab("Notifications Center")}
                className={`p-2 rounded-lg border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}
              >
                <Bell size={18} className={tp.accentText} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>

            <button
              onClick={() => {
                const nextMode = !darkMode;
                setDarkMode(nextMode);
                localStorage.setItem("hrmsDarkMode", nextMode);
              }}
              className={`p-2 rounded-lg border transition-colors ${darkMode ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-yellow-400" : "bg-white border-slate-200 shadow-sm hover:bg-slate-100 text-slate-850"}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* ── Main Workspace Body ── */}
        <main className="flex-1 p-8 overflow-y-auto z-10 scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* ─────────────────────────────────────────────────────────────────
                  TAB 1: DASHBOARD
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Dashboard" && (
                <div className="space-y-8">
                  {/* Dashboard Counters grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { title: "Total Employees", value: stats?.totalEmployees || 0, icon: Users, color: "from-blue-600 to-indigo-600" },
                      { title: "Active Branches", value: stats?.totalBranches || 0, icon: MapPin, color: "from-cyan-500 to-blue-500" },
                      { title: "Present Today", value: stats?.presentEmployees || 0, icon: Clock, color: "from-emerald-500 to-teal-500" },
                      { title: "On Leave Today", value: stats?.onLeaveEmployees || 0, icon: CalendarDays, color: "from-amber-500 to-orange-500" }
                    ].map((card, idx) => (
                      <div key={idx} className={`backdrop-blur-md rounded-2xl p-6 border shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"} flex items-center justify-between`}>
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">{card.title}</p>
                          <h3 className="text-3xl font-extrabold">{card.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}>
                          <card.icon size={22} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Analytics Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Growth area chart */}
                    <div className={`backdrop-blur-md rounded-2xl p-6 border shadow-lg lg:col-span-2 ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${tp.accentText}`}>Employee Growth Trend</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={charts?.employeeGrowth || []}>
                            <defs>
                              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={tp.chartColor} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={tp.chartColor} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#e2e8f0"} />
                            <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: darkMode ? "#0f172a" : "#ffffff", borderColor: darkMode ? "#1e293b" : "#e2e8f0" }} />
                            <Area type="monotone" dataKey="count" stroke={tp.chartColor} strokeWidth={2} fillOpacity={1} fill="url(#colorGrowth)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Action Items List */}
                    <div className={`backdrop-blur-md rounded-2xl p-6 border shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-orange-500">Active Pipeline & Alerts</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <div className="flex items-center gap-3">
                            <AlertCircle size={18} className="text-blue-500" />
                            <span className="text-xs font-bold">Recruitment Pipeline</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 font-bold text-white">Active</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                          <div className="flex items-center gap-3">
                            <AlertCircle size={18} className="text-orange-500" />
                            <span className="text-xs font-bold">Pending Leaves</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500 font-bold text-white">{stats?.pendingLeaves || 0} Requests</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <div className="flex items-center gap-3">
                            <AlertCircle size={18} className="text-emerald-500" />
                            <span className="text-xs font-bold">Payroll Status</span>
                          </div>
                          <span className="text-xs font-bold text-emerald-500">{stats?.payrollStatus}</span>
                        </div>
                      </div>

                      <div className="mt-8 p-4 rounded-2xl border border-dashed border-blue-500/30 bg-blue-500/5">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Compliance Status</p>
                        <h5 className="text-xs font-bold mt-1">RBI Internal Audits</h5>
                        <p className="text-[11px] text-slate-400 mt-2">Training compliance must be maintained above 90% for AML-PMLA directives. Track course updates.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 2: EMPLOYEE MANAGEMENT
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Employee Management" && (
                <div className="space-y-6">
                  {/* Action buttons and organization tree links */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                    <div className="flex flex-wrap gap-3 items-center">
                      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2">
                        <Search size={14} className="text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search name/ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-transparent border-none outline-none text-xs text-white"
                        />
                      </div>
                      <select
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        className="text-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400"
                      >
                        <option value="">All Departments</option>
                        <option value="Operations">Operations</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Retail Banking">Retail Banking</option>
                        <option value="Credit Valuation">Credit Valuation</option>
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setShowExitModal(true)} className="px-3 py-2 rounded-xl border border-red-500/20 text-xs font-bold text-red-500 bg-red-500/5 hover:bg-red-500/10 transition">
                        Log Exit/Exit Management
                      </button>
                      <button onClick={() => setShowTransferModal(true)} className="px-3 py-2 rounded-xl border border-slate-800 text-xs font-bold bg-slate-900 hover:bg-slate-800 transition">
                        Initiate Branch Transfer
                      </button>
                      <button onClick={() => setShowPromotionModal(true)} className="px-3 py-2 rounded-xl border border-slate-800 text-xs font-bold bg-slate-900 hover:bg-slate-800 transition">
                        Promote Employee
                      </button>
                      <button
                        onClick={() => setShowAddEmpModal(true)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r ${tp.btnGradient} text-white shadow-lg transition flex items-center gap-2`}
                      >
                        <UserPlus size={14} /> Add Profile
                      </button>
                    </div>
                  </div>

                  {/* Employees Grid list */}
                  <div className={`backdrop-blur-md rounded-2xl border overflow-hidden shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b ${darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                          <th className="p-4">ID</th>
                          <th className="p-4">Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Branch</th>
                          <th className="p-4">Department</th>
                          <th className="p-4">KYC Status</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees
                          .filter(emp => {
                            const nameMatch = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
                            const deptMatch = filterDept === "" || emp.department === filterDept;
                            return nameMatch && deptMatch;
                          })
                          .map((emp) => (
                            <tr key={emp._id} className={`border-b transition-colors ${darkMode ? "border-slate-800/60 hover:bg-slate-900/30" : "border-slate-200 hover:bg-slate-50/50"}`}>
                              <td className="p-4 font-mono font-bold text-blue-500">{emp.employeeId}</td>
                              <td className="p-4 font-bold">{emp.firstName} {emp.lastName}</td>
                              <td className="p-4 text-slate-400 font-semibold">{emp.email}</td>
                              <td className="p-4 font-semibold">{emp.role}</td>
                              <td className="p-4 text-slate-400 font-semibold">{emp.branch}</td>
                              <td className="p-4 text-slate-400 font-semibold">{emp.department}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  emp.kycStatus === "Approved" ? "bg-emerald-500/10 text-emerald-550 border border-emerald-500/20" : "bg-amber-500/10 text-amber-550 border border-amber-500/20"
                                }`}>
                                  {emp.kycStatus}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  emp.status === "Active" ? "bg-emerald-500/20 text-emerald-400" :
                                  emp.status === "OnLeave" ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"
                                }`}>
                                  {emp.status}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => { setSelectedEmployee(emp); setShowProfileModal(true); }}
                                    className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 transition"
                                    title="View Profile Details"
                                  >
                                    <Eye size={13} className="text-cyan-500" />
                                  </button>
                                  <button
                                    onClick={() => dispatch(updateEmployee({ id: emp._id, data: { kycStatus: emp.kycStatus === "Approved" ? "Pending" : "Approved" } })).then(() => toast.success("KYC status toggled"))}
                                    className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 transition"
                                    title="Verify KYC Documents"
                                  >
                                    <ShieldCheck size={13} className="text-emerald-500" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if(confirm("Confirm employee record delete?")) {
                                        dispatch(deleteEmployee(emp._id)).then(() => toast.success("Employee profile deleted"));
                                      }
                                    }}
                                    className="p-1.5 rounded-lg border border-red-500/10 hover:bg-red-500/10 text-red-500 transition"
                                    title="Delete Profile"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    </div>
                  </div>

                  {/* Organization Chart Section */}
                  <div className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <h3 className="text-xs font-bold mb-6 uppercase tracking-wider text-blue-500">Corporate Organization Chart</h3>
                    <div className="flex flex-col items-center gap-6">
                      {/* HR Admin node */}
                      <div className="p-4 rounded-xl border border-blue-500 bg-blue-500/10 text-center w-60">
                        <span className="text-[10px] uppercase font-bold text-blue-500">Corporate Head</span>
                        <h4 className="text-xs font-extrabold text-white mt-1">HR Admin</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">hradmin@bankhrms.com</p>
                      </div>

                      <div className="w-1 h-8 bg-blue-500/30" />

                      {/* Branch Managers */}
                      <div className="flex flex-wrap justify-center gap-8">
                        {employees.filter(e => e.role === "BranchManager").map(mgr => (
                          <div key={mgr._id} className="flex flex-col items-center">
                            <div className="p-4 rounded-xl border border-cyan-500 bg-cyan-500/10 text-center w-52">
                              <span className="text-[10px] uppercase font-bold text-cyan-400">Branch Manager</span>
                              <h4 className="text-xs font-extrabold text-white mt-1">{mgr.firstName} {mgr.lastName}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold">{mgr.branch}</p>
                            </div>
                            <div className="w-1 h-6 bg-cyan-500/20" />
                            {/* Branch Team nodes */}
                            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/30 text-center w-44">
                              <span className="text-[9px] uppercase font-bold text-slate-500">Branch Staff Strength</span>
                              <h5 className="text-[11px] font-bold mt-1 text-white">
                                {employees.filter(e => e.branch === mgr.branch && e.role !== "BranchManager").length} Officers
                              </h5>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vertical Employee Timeline */}
                  <div className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <h3 className="text-xs font-bold mb-6 uppercase tracking-wider text-blue-500">Employee Life-Cycle Timeline</h3>
                    <div className="space-y-6 relative border-l border-slate-800 pl-6 ml-4">
                      <div className="relative">
                        <span className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-900" />
                        <h4 className="text-xs font-bold text-white">Employee Profile Creation</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Credentials set up with system grade, department, and initial branch allocation.</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-slate-900" />
                        <h4 className="text-xs font-bold text-white">KYC Verification & Audit Logs</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Aadhaar/PAN validation audit complete. Verification logged with regulatory audit marks.</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
                        <h4 className="text-xs font-bold text-white">Banking Compliance Assesment</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Mandatory anti-money laundering and fair lending tests taken. Scores saved in profile history.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 3: ATTENDANCE MANAGEMENT
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Attendance Management" && (
                <div className="space-y-6">
                  {/* Daily check-in simulator */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                      <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-blue-500">Attendance Simulator</h3>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => dispatch(checkInCheckOut({ employeeId: "EMP-001", type: "checkIn", latitude: 19.076, longitude: 72.877 })).then(() => toast.success("Checked-In successfully at Mumbai Main Branch!"))}
                          className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 font-bold text-xs text-white flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-md shadow-emerald-500/10"
                        >
                          <CheckCircle size={14} /> Simulate Check-In
                        </button>
                        <button
                          onClick={() => dispatch(checkInCheckOut({ employeeId: "EMP-001", type: "checkOut" })).then(() => toast.success("Checked-Out successfully!"))}
                          className="px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 font-bold text-xs text-white flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-md shadow-red-500/10"
                        >
                          <XCircle size={14} /> Simulate Check-Out
                        </button>
                      </div>
                    </div>

                    {/* Shift Allocation settings */}
                    <div className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                      <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-cyan-500">Shift Allocation</h3>
                      <button
                        onClick={() => setShowShiftModal(true)}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition shadow-lg shadow-blue-500/10"
                      >
                        Allocate Shift Schedule
                      </button>
                    </div>
                  </div>

                  {/* Attendance corrections */}
                  <div className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-orange-500">Attendance Correction Requests</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className={`border-b ${darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                            <th className="p-4">Employee ID</th>
                            <th className="p-4">Requested Check-In</th>
                            <th className="p-4">Requested Check-Out</th>
                            <th className="p-4">Reason Details</th>
                            <th className="p-4 text-center">Approve / Reject</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendance.filter(r => r.correctionRequest && r.correctionRequest.status === "Pending").map((record) => (
                            <tr key={record._id} className={`border-b transition-colors ${darkMode ? "border-slate-800/60 hover:bg-slate-900/30" : "border-slate-200 hover:bg-slate-50/50"}`}>
                              <td className="p-4 font-bold text-blue-550">{record.employeeId}</td>
                              <td className="p-4 font-semibold text-emerald-500">{new Date(record.correctionRequest.requestedCheckIn).toLocaleTimeString()}</td>
                              <td className="p-4 font-semibold text-orange-500">{new Date(record.correctionRequest.requestedCheckOut).toLocaleTimeString()}</td>
                              <td className="p-4 text-slate-400 font-semibold">{record.correctionRequest.reason}</td>
                              <td className="p-4 text-center">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => dispatch(approveCorrection({ id: record._id, status: "Approved" })).then(() => toast.success("Correction approved!"))}
                                    className="px-2 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => dispatch(approveCorrection({ id: record._id, status: "Rejected" })).then(() => toast.success("Correction rejected!"))}
                                    className="px-2 py-1 bg-red-650 text-white font-bold text-[10px] rounded"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {attendance.filter(r => r.correctionRequest && r.correctionRequest.status === "Pending").length === 0 && (
                            <tr>
                              <td colSpan="5" className="p-4 text-slate-500 text-center font-bold">No pending correction requests</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Daily Log & Overtime */}
                  <div className={`backdrop-blur-md rounded-2xl border overflow-hidden shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <div className="p-6 border-b border-slate-800/60 flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500">Daily Attendance Logs & Overtime hours</h3>
                    </div>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b ${darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                          <th className="p-4">Employee ID</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Check-In</th>
                          <th className="p-4">Check-Out</th>
                          <th className="p-4">Location Coordinates</th>
                          <th className="p-4 font-bold text-blue-400">Overtime Hours</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((record) => (
                          <tr key={record._id} className={`border-b transition-colors ${darkMode ? "border-slate-800/60 hover:bg-slate-900/30" : "border-slate-200 hover:bg-slate-50/50"}`}>
                            <td className="p-4 font-bold text-blue-500">{record.employeeId}</td>
                            <td className="p-4 font-semibold">{record.date}</td>
                            <td className="p-4 text-emerald-550 font-bold">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "-"}</td>
                            <td className="p-4 text-orange-550 font-bold">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "-"}</td>
                            <td className="p-4 text-slate-400 font-mono">{record.latitude && record.longitude ? `${record.latitude}, ${record.longitude}` : "Biometric Sync"}</td>
                            <td className="p-4 font-bold text-blue-400">{record.overtimeHours || 0} Hrs</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                record.status === "Present" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                              }`}>
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 4: LEAVE MANAGEMENT
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Leave Management" && (
                <div className="space-y-6">
                  {/* Top Apply Button and Balance trackers */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500">Leave Management Hub</h3>
                    <button
                      onClick={() => setShowLeaveModal(true)}
                      className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${tp.btnGradient} text-white font-bold text-xs transition shadow-lg`}
                    >
                      Apply Leave / Emergency request
                    </button>
                  </div>

                  {/* Leaves request lists */}
                  <div className={`backdrop-blur-md rounded-2xl border overflow-hidden shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b ${darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                          <th className="p-4">Employee ID</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Start Date</th>
                          <th className="p-4">End Date</th>
                          <th className="p-4">Reason</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Approve / Reject</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaves.map((leave) => (
                          <tr key={leave._id} className={`border-b transition-colors ${darkMode ? "border-slate-800/60 hover:bg-slate-900/30" : "border-slate-200 hover:bg-slate-50/50"}`}>
                            <td className="p-4 font-bold text-blue-500">{leave.employeeId}</td>
                            <td className="p-4 font-semibold">{leave.type}</td>
                            <td className="p-4">{new Date(leave.startDate).toLocaleDateString()}</td>
                            <td className="p-4">{new Date(leave.endDate).toLocaleDateString()}</td>
                            <td className="p-4 text-slate-400 font-semibold">{leave.reason}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                leave.status === "Approved" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                leave.status === "Rejected" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              }`}>
                                {leave.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              {leave.status === "Pending" ? (
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => dispatch(approveLeave({ id: leave._id, status: "Approved" })).then(() => toast.success("Leave approved!"))}
                                    className="p-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500 transition"
                                  >
                                    <CheckCircle size={14} />
                                  </button>
                                  <button
                                    onClick={() => dispatch(approveLeave({ id: leave._id, status: "Rejected" })).then(() => toast.success("Leave rejected!"))}
                                    className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 transition"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-500 font-bold text-[10px]">Processed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>

                  {/* Leave balance grid tracker & Holiday calendar */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Balanced leaves */}
                    <div className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-cyan-500">Employee Leave Balances</h4>
                      <div className="space-y-4">
                        {employees.slice(0, 3).map((emp) => (
                          <div key={emp._id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 flex justify-between items-center text-xs">
                            <span className="font-bold">{emp.firstName} {emp.lastName} ({emp.employeeId})</span>
                            <div className="flex gap-4 font-mono font-bold">
                              <div>CL: <span className="text-blue-400">12/12</span></div>
                              <div>SL: <span className="text-orange-400">9/10</span></div>
                              <div>PL: <span className="text-emerald-400">14/15</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Holiday calendar */}
                    <div className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-blue-500">2026 Holiday Calendar</h4>
                      <div className="space-y-2 text-xs">
                        {[
                          { date: "Aug 15, 2026", name: "Independence Day" },
                          { date: "Oct 02, 2026", name: "Mahatma Gandhi Jayanti" },
                          { date: "Nov 08, 2026", name: "Diwali Lakshmi Puja" },
                          { date: "Dec 25, 2026", name: "Christmas Day" }
                        ].map((holiday, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-slate-800/40 pb-2">
                            <span className="font-semibold">{holiday.name}</span>
                            <span className="font-mono text-slate-400">{holiday.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 5: PAYROLL MANAGEMENT
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Payroll Management" && (
                <div className="space-y-6">
                  {/* Top processing payroll & Bonus management */}
                  <div className="flex flex-wrap gap-4 justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500">Salary structure & Payroll cycles</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowBonusModal(true)}
                        className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold bg-slate-900 hover:bg-slate-800 transition"
                      >
                        Queue Bonus / Incentive
                      </button>
                      <button
                        onClick={() => dispatch(processPayroll({ month: "June 2026" })).then(() => toast.success("June 2026 Payroll Processed Successfully!"))}
                        className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${tp.btnGradient} font-bold text-xs text-white flex items-center gap-2 transition active:scale-[0.98] shadow-lg`}
                      >
                        <CheckCircle size={14} /> Process June 2026 Payroll
                      </button>
                    </div>
                  </div>

                  {/* Payroll list table */}
                  <div className={`backdrop-blur-md rounded-2xl border overflow-hidden shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b ${darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                          <th className="p-4">Employee ID</th>
                          <th className="p-4">Month</th>
                          <th className="p-4">Base Salary</th>
                          <th className="p-4 font-bold text-emerald-500">Bonus / Allowances</th>
                          <th className="p-4 font-bold text-red-500">Deductions (PT/TDS)</th>
                          <th className="p-4">Net Paid</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Payslip</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payroll.map((pay) => (
                          <tr key={pay._id} className={`border-b transition-colors ${darkMode ? "border-slate-800/60 hover:bg-slate-900/30" : "border-slate-200 hover:bg-slate-50/50"}`}>
                            <td className="p-4 font-bold text-blue-500">{pay.employeeId}</td>
                            <td className="p-4 font-semibold">{pay.month}</td>
                            <td className="p-4 font-bold">₹{pay.baseSalary.toLocaleString()}</td>
                            <td className="p-4 text-emerald-500 font-bold">+₹{(pay.bonus + pay.allowances).toLocaleString()}</td>
                            <td className="p-4 text-red-500 font-bold">-₹{pay.taxDeductions.toLocaleString()}</td>
                            <td className="p-4 font-extrabold text-blue-400">₹{pay.netPaid.toLocaleString()}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                {pay.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handlePayslipDownload(pay)}
                                className="px-2 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 text-[10px] font-bold text-blue-500 transition"
                              >
                                Download PDF
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>

                  {/* Salary Structure Info */}
                  <div className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-cyan-500">Corporate Grade Salary Structure Limits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                      {[
                        { grade: "HRAdmin", basic: "₹1,20,000", hra: "₹18,000", ded: "12% Tax" },
                        { grade: "BranchManager", basic: "₹95,000", hra: "₹14,250", ded: "12% Tax" },
                        { grade: "FieldOfficer", basic: "₹60,000", hra: "₹9,000", ded: "12% Tax" }
                      ].map((sal, idx) => (
                        <div key={idx} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800">
                          <h5 className="font-bold text-white mb-2">{sal.grade}</h5>
                          <p className="text-slate-400">Basic Scale: <span className="text-white font-bold">{sal.basic}</span></p>
                          <p className="text-slate-400">HRA Allowance: <span className="text-white font-bold">{sal.hra}</span></p>
                          <p className="text-slate-400">Deduction Grade: <span className="text-white font-bold">{sal.ded}</span></p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 6: RECRUITMENT MODULE
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Recruitment Module" && (
                <div className="space-y-6">
                  {/* Job Requisition opening */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500">Job Posting & Candidate Pipelines</h3>
                    <button
                      onClick={() => setShowAddJobModal(true)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r ${tp.btnGradient} transition flex items-center gap-2 text-white shadow-lg`}
                    >
                      <Plus size={14} /> Open Job Requisition
                    </button>
                  </div>

                  {/* Recruitment Kanban Boards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                      <div key={job._id} className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-sm font-bold text-white">{job.title}</h4>
                            <p className="text-[10px] text-slate-400 font-bold">{job.department} · {job.branch}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            {job.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">{job.description}</p>

                        <div className="border-t border-slate-800/60 pt-4 space-y-3">
                          <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Candidate Pipeline</h5>
                          {job.candidates.map((cand) => (
                            <div key={cand._id} className="flex justify-between items-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                              <div>
                                <p className="font-bold">{cand.name}</p>
                                <p className="text-[10px] text-slate-400 font-semibold">{cand.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                  cand.status === "Offered" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                }`}>
                                  {cand.status}
                                </span>
                                {cand.status === "Applied" && (
                                  <button
                                    onClick={() => { setSelectedCandidate(cand); setSelectedJobId(job._id); setShowInterviewModal(true); }}
                                    className="px-2 py-1 bg-cyan-600 text-white rounded text-[9px] font-bold"
                                  >
                                    Schedule Interview
                                  </button>
                                )}
                                {cand.status === "Interviewing" && (
                                  <button
                                    onClick={() => dispatch(updateCandidate({ jobId: job._id, candidateId: cand._id, status: "Offered", feedback: "Selected after round 2." })).then(() => toast.success("Candidate marked offered!"))}
                                    className="px-2 py-1 bg-blue-600 text-white rounded text-[9px] font-bold"
                                  >
                                    Mark Offered
                                  </button>
                                )}
                                {cand.status === "Offered" && (
                                  <button
                                    onClick={() => handleOfferLetterPDF(cand, job)}
                                    className="px-2 py-1 bg-emerald-600 text-white rounded text-[9px] font-bold"
                                    title="Generate formal bank offer letter"
                                  >
                                    Offer Letter
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 7: PERFORMANCE MANAGEMENT
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Performance Management" && (
                <div className="space-y-6">
                  {/* Top review evaluator */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500">Employee reviews & KPIs</h3>
                    <button
                      onClick={() => setShowPerformanceModal(true)}
                      className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${tp.btnGradient} text-white font-bold text-xs transition shadow-lg`}
                    >
                      Evaluate KPI & Goals
                    </button>
                  </div>

                  {/* KPI evaluations list */}
                  <div className={`backdrop-blur-md rounded-2xl border overflow-hidden shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b ${darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                          <th className="p-4">Employee ID</th>
                          <th className="p-4">Evaluation Period</th>
                          <th className="p-4">Rating (1-5)</th>
                          <th className="p-4">Promotion Recommended</th>
                          <th className="p-4">Review Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performance.map((perf) => (
                          <tr key={perf._id} className={`border-b transition-colors ${darkMode ? "border-slate-800/60 hover:bg-slate-900/30" : "border-slate-200 hover:bg-slate-50/50"}`}>
                            <td className="p-4 font-bold text-blue-500">{perf.employeeId}</td>
                            <td className="p-4 font-semibold">{perf.period}</td>
                            <td className="p-4 font-black text-amber-500 flex items-center gap-1">
                              <Award size={14} /> {perf.rating} / 5
                            </td>
                            <td className="p-4 font-bold text-blue-400">{perf.promotionRecommended ? "Yes" : "No"}</td>
                            <td className="p-4 text-slate-400 font-semibold">{perf.reviewComments}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>

                  {/* Rewards & Recognition star list */}
                  <div className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-cyan-500">Star Performers - Rewards & Recognition</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {employees.slice(0, 3).map((emp, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-white">{emp.firstName} {emp.lastName}</h5>
                            <p className="text-[10px] text-slate-400">{emp.department} · Outstanding Grade</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 8: BRANCH MANAGEMENT
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Branch Management" && (
                <div className="space-y-6">
                  {/* Branch performance grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {charts?.branchPerformance?.map((branch, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedBranchEmployees(branch.name)}
                        className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg cursor-pointer transition transform hover:scale-[1.01] ${
                          selectedBranchEmployees === branch.name ? "bg-blue-600/10 border-blue-500" : darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-bold text-white">{branch.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            Rating: {branch.rating} / 10
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-semibold mb-2">Staff Strength: <span className="font-bold text-white">{branch.employees} Employees</span></p>
                        
                        <div className="w-full bg-slate-800 rounded-full h-2 mt-4">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${branch.rating * 10}%` }}></div>
                        </div>
                        <p className="text-[10px] text-blue-500 mt-4 font-bold">Click card to view branch roster</p>
                      </div>
                    ))}
                  </div>

                  {/* Branch Employees subview list */}
                  {selectedBranchEmployees && (
                    <div className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500">Roster: {selectedBranchEmployees}</h4>
                        <button onClick={() => setSelectedBranchEmployees(null)} className="text-xs font-bold text-red-500">Close</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {employees.filter(e => e.branch === selectedBranchEmployees).map(emp => (
                          <div key={emp._id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs">
                            <p className="font-bold">{emp.firstName} {emp.lastName}</p>
                            <p className="text-[10px] text-slate-400">{emp.role} · {emp.department}</p>
                            <p className="text-[10px] text-blue-500 font-bold mt-2">{emp.employeeId}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 9: BANKING COMPLIANCE
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Banking Compliance" && (
                <div className="space-y-6">
                  {/* Action buttons and training compliance */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500">Compliance & Regulatory audits</h3>
                    <button
                      onClick={() => setShowComplianceModal(true)}
                      className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${tp.btnGradient} text-white font-bold text-xs transition shadow-lg`}
                    >
                      Assign Compliance Certification
                    </button>
                  </div>

                  {/* Compliance logs */}
                  <div className={`backdrop-blur-md rounded-2xl border overflow-hidden shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b ${darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                          <th className="p-4">Employee ID</th>
                          <th className="p-4">Compliance Certification Course</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Completion Score</th>
                          <th className="p-4 text-center">Simulator Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compliance.map((comp) => (
                          <tr key={comp._id} className={`border-b transition-colors ${darkMode ? "border-slate-800/60 hover:bg-slate-900/30" : "border-slate-200 hover:bg-slate-50/50"}`}>
                            <td className="p-4 font-bold text-blue-500">{comp.employeeId}</td>
                            <td className="p-4 font-semibold">{comp.courseName}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                comp.status === "Completed" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              }`}>
                                {comp.status}
                              </span>
                            </td>
                            <td className="p-4 font-black text-blue-400">{comp.score > 0 ? `${comp.score}%` : "-"}</td>
                            <td className="p-4 text-center">
                              {comp.status !== "Completed" ? (
                                <button
                                  onClick={() => handleStartQuiz(comp)}
                                  className="px-2 py-1 bg-cyan-600 hover:bg-cyan-700 font-bold text-[10px] text-white rounded"
                                >
                                  Take Quiz
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-bold">Passed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 10: TRAINING & LEARNING
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Training & Learning" && (
                <div className="space-y-6">
                  {/* Learning cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: "Prevention of Money Laundering Act (PMLA)", progress: "95% Completed", active: 22, code: "AML-PMLA-1" },
                      { title: "KYC Master Direction RBI Guidelines", progress: "40% In-Progress", active: 15, code: "KYC-RBI-2" },
                      { title: "Information Security Management System", progress: "Not Started", active: 8, code: "ISMS-SEC-3" }
                    ].map((course, idx) => (
                      <div key={idx} className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                            <BookOpen size={20} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">{course.code}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-2">{course.title}</h4>
                        <p className="text-xs text-slate-400 font-semibold mb-4">{course.progress}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{course.active} Employees Assigned</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 11: ASSET MANAGEMENT
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Asset Management" && (
                <div className="space-y-6">
                  {/* Top Allocate Button */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500">Allocated corporate assets</h3>
                    <button
                      onClick={() => setShowAssetModal(true)}
                      className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${tp.btnGradient} text-white font-bold text-xs transition shadow-lg`}
                    >
                      Allocate Asset Profile
                    </button>
                  </div>

                  {/* Asset Allocation table */}
                  <div className={`backdrop-blur-md rounded-2xl border overflow-hidden shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b ${darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                          <th className="p-4">Employee ID</th>
                          <th className="p-4">Asset Type</th>
                          <th className="p-4">Asset Serial Number</th>
                          <th className="p-4">Allocated Date</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets.map((asset) => (
                          <tr key={asset._id} className={`border-b transition-colors ${darkMode ? "border-slate-800/60 hover:bg-slate-900/30" : "border-slate-200 hover:bg-slate-50/50"}`}>
                            <td className="p-4 font-bold text-blue-500">{asset.employeeId}</td>
                            <td className="p-4 font-semibold">{asset.assetType}</td>
                            <td className="p-4 font-mono text-slate-400">{asset.assetSerialNumber}</td>
                            <td className="p-4">{new Date(asset.allocatedDate).toLocaleDateString()}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                {asset.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 12: TRAVEL & FOOD CLAIM VOUCHERS
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Travel & Food claim vouchers" && (
                <div className="space-y-6">
                  {/* Top Submit Button */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500">Travel & Food claim vouchers</h3>
                    <button
                      onClick={() => setShowExpenseModal(true)}
                      className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${tp.btnGradient} text-white font-bold text-xs transition shadow-lg`}
                    >
                      Submit Expense claim
                    </button>
                  </div>

                  {/* Travel and Food claims list */}
                  <div className={`backdrop-blur-md rounded-2xl border overflow-hidden shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b ${darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                          <th className="p-4">Employee ID</th>
                          <th className="p-4">Expense Type</th>
                          <th className="p-4">Claim Amount</th>
                          <th className="p-4">Description</th>
                          <th className="p-4">Claim Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((exp) => (
                          <tr key={exp._id} className={`border-b transition-colors ${darkMode ? "border-slate-800/60 hover:bg-slate-900/30" : "border-slate-200 hover:bg-slate-50/50"}`}>
                            <td className="p-4 font-bold text-blue-550">{exp.employeeId}</td>
                            <td className="p-4 font-semibold">{exp.type}</td>
                            <td className="p-4 font-bold text-blue-400">₹{exp.amount.toLocaleString()}</td>
                            <td className="p-4 text-slate-400 font-semibold">{exp.description}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                exp.status === "Approved" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                exp.status === "Rejected" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              }`}>
                                {exp.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              {exp.status === "Pending" ? (
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => dispatch(approveExpense({ id: exp._id, status: "Approved" })).then(() => toast.success("Expense claim approved!"))}
                                    className="p-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500 transition"
                                  >
                                    <CheckCircle size={14} />
                                  </button>
                                  <button
                                    onClick={() => dispatch(approveExpense({ id: exp._id, status: "Rejected" })).then(() => toast.success("Expense claim rejected!"))}
                                    className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 transition"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-500 font-bold text-[10px]">Settled</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 13: TICKET & HELPDESK
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Ticket & Helpdesk" && (
                <div className="space-y-6">
                  {/* Top Submit Button */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500">Employee helpdesk & Support</h3>
                    <button
                      onClick={() => setShowTicketModal(true)}
                      className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${tp.btnGradient} text-white font-bold text-xs transition shadow-lg`}
                    >
                      Raise Support Ticket
                    </button>
                  </div>

                  {/* Support tickets list */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {tickets.map((ticket) => (
                      <div key={ticket._id} className={`backdrop-blur-md rounded-2xl border p-6 shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">{ticket.employeeId}</span>
                            <h4 className="text-sm font-bold text-white">{ticket.title}</h4>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ticket.status === "Open" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-6">{ticket.query}</p>

                        <div className="space-y-3 pt-4 border-t border-slate-800/60">
                          {ticket.replies.map((rep, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                              <p className="text-[10px] text-slate-400 font-bold mb-1">Reply by {rep.repliedBy}</p>
                              <p className="font-semibold text-slate-200">{rep.message}</p>
                            </div>
                          ))}

                          <div className="flex gap-2 mt-4">
                            <input
                              type="text"
                              placeholder="Type response..."
                              value={ticketReply[ticket._id] || ""}
                              onChange={(e) => setTicketReply({ ...ticketReply, [ticket._id]: e.target.value })}
                              className="flex-1 text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none"
                            />
                            <button
                              onClick={() => handleTicketReply(ticket._id)}
                              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 14: NOTIFICATIONS CENTER
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Notifications Center" && (
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500">Live system alerts & announcements</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Alerts panel */}
                    <div className={`backdrop-blur-md rounded-2xl p-6 border shadow-lg lg:col-span-2 ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-cyan-500">In-App Notifications</h4>
                      <div className="space-y-4">
                        {activeAlerts.map((alert, idx) => (
                          <div key={idx} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/60 flex items-start gap-4 text-xs">
                            <div className="p-2 rounded bg-blue-600/10 text-blue-500">
                              <Bell size={16} />
                            </div>
                            <div className="flex-1">
                              <span className="font-bold text-white">{alert.type} Alert</span>
                              <p className="text-slate-400 mt-1">{alert.msg}</p>
                              <span className="text-[10px] text-slate-500 font-bold block mt-2">{alert.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Announcement card */}
                    <div className={`backdrop-blur-md rounded-2xl p-6 border shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-orange-500">Regulatory Announcements</h4>
                      <div className="space-y-4 text-xs">
                        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold">
                          RBI has published updated guidelines for credit appraisal systems. All field officers must read the document.
                        </div>
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
                          Annual performance ratings process is closing by this month. Fill out review goals.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 15: REPORTS & ANALYTICS
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Reports & Analytics" && (
                <div className="space-y-6">
                  <div className={`backdrop-blur-md rounded-2xl p-6 border shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <h3 className="text-xs font-bold mb-6 uppercase tracking-wider text-blue-500">Corporate reports downloader</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Report Type</label>
                        <select
                          value={reportConfig.type}
                          onChange={(e) => setReportConfig({ ...reportConfig, type: e.target.value })}
                          className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                        >
                          <option value="Employee">Employee Master Directory</option>
                          <option value="Attendance">Attendance Logs & Coordinates</option>
                          <option value="Leave">Leave Balance & Workflows</option>
                          <option value="Payroll">Processed Payroll payslips sheet</option>
                          <option value="Performance">KPI Scores and Goal evaluations</option>
                          <option value="Compliance">Training Assessment Logs</option>
                          <option value="Audit Logs">Admin Action Audit trails</option>
                        </select>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={handleExportExcel}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-xs text-white flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md"
                        >
                          <Download size={14} /> Export to Excel
                        </button>
                        <button
                          onClick={handleExportPDF}
                          className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r ${tp.btnGradient} font-bold text-xs text-white flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg`}
                        >
                          <FileSpreadsheet size={14} /> Export to PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────────
                  TAB 16: AUDIT LOGS
                  ───────────────────────────────────────────────────────────────── */}
              {activeTab === "Audit Logs" && (
                <div className="space-y-6">
                  {/* Audit logs listing table */}
                  <div className={`backdrop-blur-md rounded-2xl border overflow-hidden shadow-lg ${darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200"}`}>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b ${darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                          <th className="p-4">Timestamp</th>
                          <th className="p-4">Action Event</th>
                          <th className="p-4">Performed By</th>
                          <th className="p-4">Context Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.map((log) => (
                          <tr key={log._id} className={`border-b transition-colors ${darkMode ? "border-slate-800/60 hover:bg-slate-900/30" : "border-slate-200 hover:bg-slate-50/50"}`}>
                            <td className="p-4 text-slate-400 font-mono">{new Date(log.createdAt).toLocaleString()}</td>
                            <td className="p-4"><span className="px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-500 font-extrabold uppercase border border-blue-500/20">{log.action}</span></td>
                            <td className="p-4 font-bold">{log.performedBy}</td>
                            <td className="p-4 text-slate-400 font-semibold">{log.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── MODALS SECTION ── */}

      {/* Add Employee Modal */}
      {showAddEmpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className={`text-sm font-bold mb-4 bg-gradient-to-r ${tp.accent} bg-clip-text text-transparent`}>Add Employee Profile</h3>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={newEmp.employeeId}
                    onChange={(e) => setNewEmp({ ...newEmp, employeeId: e.target.value })}
                    placeholder="EMP-102"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    placeholder="email@bankhrms.com"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={newEmp.firstName}
                    onChange={(e) => setNewEmp({ ...newEmp, firstName: e.target.value })}
                    placeholder="Vijay"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newEmp.lastName}
                    onChange={(e) => setNewEmp({ ...newEmp, lastName: e.target.value })}
                    placeholder="Mallya"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Role</label>
                  <select
                    value={newEmp.role}
                    onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Employee">Employee</option>
                    <option value="FieldOfficer">Field Officer</option>
                    <option value="Coordinator">Coordinator</option>
                    <option value="Accountant">Accountant</option>
                    <option value="TechnicalManager">Technical Manager</option>
                    <option value="RegionalManager">Regional Manager</option>
                    <option value="BranchManager">Branch Manager</option>
                    <option value="HRAdmin">HR Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="SuperAdmin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Branch</label>
                  <select
                    value={newEmp.branch}
                    onChange={(e) => setNewEmp({ ...newEmp, branch: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Mumbai Main Branch">Mumbai Main Branch</option>
                    <option value="Connaught Place Branch">Connaught Place Branch</option>
                    <option value="Indiranagar Branch">Indiranagar Branch</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddEmpModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Add Profile</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Exit Management Modal */}
      {showExitModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-red-500">Employee Exit Logging Form</h3>
            <form onSubmit={handleExitSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Employee ID</label>
                <select
                  value={exitForm.employeeId}
                  onChange={(e) => setExitForm({ ...exitForm, employeeId: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Choose Employee</option>
                  {employees.filter(e => e.status !== "Terminated").map(emp => (
                    <option key={emp._id} value={emp.employeeId}>{emp.firstName} {emp.lastName} ({emp.employeeId})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Exit Date</label>
                <input
                  type="date"
                  value={exitForm.exitDate}
                  onChange={(e) => setExitForm({ ...exitForm, exitDate: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Reason for Exit</label>
                <textarea
                  value={exitForm.reason}
                  onChange={(e) => setExitForm({ ...exitForm, reason: e.target.value })}
                  placeholder="Resigned / Retirement / Separation..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white h-20 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowExitModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition">Record Exit</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Branch Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-cyan-500">Employee Branch Transfer Request</h3>
            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Employee</label>
                <select
                  value={transferForm.employeeId}
                  onChange={(e) => setTransferForm({ ...transferForm, employeeId: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Choose Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.employeeId}>{emp.firstName} {emp.lastName} ({emp.branch})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Target Branch</label>
                <select
                  value={transferForm.branch}
                  onChange={(e) => setTransferForm({ ...transferForm, branch: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Mumbai Main Branch">Mumbai Main Branch</option>
                  <option value="Connaught Place Branch">Connaught Place Branch</option>
                  <option value="Indiranagar Branch">Indiranagar Branch</option>
                  <option value="Gachibowli Branch">Gachibowli Branch</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowTransferModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Approve Transfer</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Promote Employee Modal */}
      {showPromotionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-blue-500">Employee Grade & Role Promotion</h3>
            <form onSubmit={handlePromotionSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Employee</label>
                <select
                  value={promotionForm.employeeId}
                  onChange={(e) => setPromotionForm({ ...promotionForm, employeeId: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Choose Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.employeeId}>{emp.firstName} {emp.lastName} ({emp.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">New Corporate Grade</label>
                <select
                  value={promotionForm.role}
                  onChange={(e) => setPromotionForm({ ...promotionForm, role: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Employee">Employee</option>
                  <option value="FieldOfficer">Field Officer</option>
                  <option value="Coordinator">Coordinator</option>
                  <option value="Accountant">Accountant</option>
                  <option value="TechnicalManager">Technical Manager</option>
                  <option value="RegionalManager">Regional Manager</option>
                  <option value="BranchManager">Branch Manager</option>
                  <option value="HRAdmin">HR Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">Super Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowPromotionModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Approve Promotion</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Shift Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-cyan-500">Allocate Shift Schedule</h3>
            <form onSubmit={handleShiftSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Employee ID</label>
                <select
                  value={shiftForm.employeeId}
                  onChange={(e) => setShiftForm({ ...shiftForm, employeeId: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Choose Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.employeeId}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Shift Configuration</label>
                <select
                  value={shiftForm.shift}
                  onChange={(e) => setShiftForm({ ...shiftForm, shift: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="General Shift (09:00 AM - 06:00 PM)">General Shift (09:00 AM - 06:00 PM)</option>
                  <option value="Morning Shift (06:00 AM - 03:00 PM)">Morning Shift (06:00 AM - 03:00 PM)</option>
                  <option value="Night Shift (10:00 PM - 07:00 AM)">Night Shift (10:00 PM - 07:00 AM)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowShiftModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Schedule Shift</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-blue-500">Apply Leave Request</h3>
            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Employee ID</label>
                <select
                  value={leaveForm.employeeId}
                  onChange={(e) => setLeaveForm({ ...leaveForm, employeeId: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Choose Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.employeeId}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Leave Type</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Privilege">Privilege Leave</option>
                  <option value="Emergency">Emergency Leave</option>
                  <option value="HalfDay">Half Day Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Reason for Leave</label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Medical reason / Family event..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white h-20 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowLeaveModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition shadow-lg shadow-blue-500/10">Apply Leave</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Bonus / Incentive Modal */}
      {showBonusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-cyan-500">Queue Bonus & Incentives</h3>
            <form onSubmit={handleBonusSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Employee ID</label>
                <select
                  value={bonusForm.employeeId}
                  onChange={(e) => setBonusForm({ ...bonusForm, employeeId: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Choose Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.employeeId}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Bonus (INR)</label>
                  <input
                    type="number"
                    value={bonusForm.bonus}
                    onChange={(e) => setBonusForm({ ...bonusForm, bonus: e.target.value })}
                    placeholder="5000"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Incentives (INR)</label>
                  <input
                    type="number"
                    value={bonusForm.incentives}
                    onChange={(e) => setBonusForm({ ...bonusForm, incentives: e.target.value })}
                    placeholder="3000"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowBonusModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Queue Rewards</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-cyan-500">Schedule Interview Round</h3>
            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Interview Date</label>
                  <input
                    type="date"
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Time Slot</label>
                  <input
                    type="time"
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Interviewer Name</label>
                <input
                  type="text"
                  value={interviewForm.interviewer}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
                  placeholder="Rohan Sharma (Branch Manager)"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowInterviewModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Schedule</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Assign Compliance Training Modal */}
      {showComplianceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-blue-500">Assign Regulatory Compliance Training</h3>
            <form onSubmit={handleComplianceAssign} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Employee ID</label>
                <select
                  value={complianceForm.employeeId}
                  onChange={(e) => setComplianceForm({ ...complianceForm, employeeId: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Choose Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.employeeId}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Certification Course</label>
                <select
                  value={complianceForm.courseName}
                  onChange={(e) => setComplianceForm({ ...complianceForm, courseName: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Anti-Money Laundering (AML) 2026">Anti-Money Laundering (AML) 2026</option>
                  <option value="RBI Fair Lending Practices Masterclass">RBI Fair Lending Practices Masterclass</option>
                  <option value="Customer Data Security & Privacy (KYC)">Customer Data Security & Privacy (KYC)</option>
                  <option value="Information Security Policy Review">Information Security Policy Review</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowComplianceModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Assign course</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Assessment Quiz Simulator Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-cyan-500">Compliance Assessment: {quizState.courseName}</h3>
            <form onSubmit={handleQuizSubmit} className="space-y-4">
              <div>
                <p className="text-xs font-bold mb-2">Q1. What is the full form of PMLA in banking compliance?</p>
                <select
                  value={quizState.answers.q1}
                  onChange={(e) => setQuizState({ ...quizState, answers: { ...quizState.answers, q1: e.target.value } })}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Select Answer</option>
                  <option value="A">Prevention of Money Laundering Act</option>
                  <option value="B">Prevention of Micro Lending Authority</option>
                </select>
              </div>

              <div>
                <p className="text-xs font-bold mb-2">Q2. What is the maximum cash transaction limit before triggering STR?</p>
                <select
                  value={quizState.answers.q2}
                  onChange={(e) => setQuizState({ ...quizState, answers: { ...quizState.answers, q2: e.target.value } })}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Select Answer</option>
                  <option value="A">5 Lakhs INR</option>
                  <option value="B">10 Lakhs INR</option>
                </select>
              </div>

              <div>
                <p className="text-xs font-bold mb-2">Q3. Which regulatory body oversees KYC master directions in India?</p>
                <select
                  value={quizState.answers.q3}
                  onChange={(e) => setQuizState({ ...quizState, answers: { ...quizState.answers, q3: e.target.value } })}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Select Answer</option>
                  <option value="A">Reserve Bank of India (RBI)</option>
                  <option value="B">Securities and Exchange Board of India (SEBI)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowQuizModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Submit Answers</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Asset Allocation Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-blue-500">Allocate Hardware Asset</h3>
            <form onSubmit={handleAssetAllocate} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Employee ID</label>
                <select
                  value={assetForm.employeeId}
                  onChange={(e) => setAssetForm({ ...assetForm, employeeId: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Choose Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.employeeId}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Asset Category</label>
                  <select
                    value={assetForm.assetType}
                    onChange={(e) => setAssetForm({ ...assetForm, assetType: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Mobile">Mobile Phone</option>
                    <option value="SIM Card">SIM Card</option>
                    <option value="ID Card">ID Badge</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={assetForm.assetSerialNumber}
                    onChange={(e) => setAssetForm({ ...assetForm, assetSerialNumber: e.target.value })}
                    placeholder="LAP-MUM-9910"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAssetModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Allocate Asset</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-cyan-500">Log Expense Claim Voucher</h3>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Claimant Employee</label>
                <select
                  value={expenseForm.employeeId}
                  onChange={(e) => setExpenseForm({ ...expenseForm, employeeId: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Choose Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.employeeId}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Voucher Category</label>
                  <select
                    value={expenseForm.type}
                    onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Travel">Travel Reimbursement</option>
                    <option value="Food">Food / Client Coordination</option>
                    <option value="Reimbursement">General Reimbursement</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Claim Amount (INR)</label>
                  <input
                    type="number"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="1200"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Voucher Description Details</label>
                <textarea
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="Travel to properties valuation site..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white h-20 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Submit claim</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-blue-500">Raise HR Support Ticket</h3>
            <form onSubmit={ticketForm} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Employee ID</label>
                <select
                  value={ticketForm.employeeId}
                  onChange={(e) => setTicketForm({ ...ticketForm, employeeId: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="">Choose Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.employeeId}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Ticket Subject</label>
                <input
                  type="text"
                  value={ticketForm.title}
                  onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                  placeholder="allowance issue / PF transfer..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Description Details</label>
                <textarea
                  value={ticketForm.query}
                  onChange={(e) => setTicketForm({ ...ticketForm, query: e.target.value })}
                  placeholder="Detailed description of Pf issue..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white h-24 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowTicketModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Raise Ticket</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Performance Goal Evaluation Modal */}
      {showPerformanceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className="text-sm font-bold mb-4 text-cyan-500">Log Goal & KPI Review Score</h3>
            <form onSubmit={handlePerformanceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Employee ID</label>
                  <select
                    value={reviewForm.employeeId}
                    onChange={(e) => setReviewForm({ ...reviewForm, employeeId: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="">Choose Employee</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp.employeeId}>{emp.firstName} {emp.lastName}</option>
                  ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Overall Rating Scale</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="5">5 Stars (Excellent Grade)</option>
                    <option value="4">4 Stars (Highly Commendable)</option>
                    <option value="3">3 Stars (Target Met)</option>
                    <option value="2">2 Stars (Needs Improvement)</option>
                    <option value="1">1 Star (Critical performance)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">KPI Goals Remarks / Feedback</label>
                <textarea
                  value={reviewForm.reviewComments}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewComments: e.target.value })}
                  placeholder="Strong credit analysis work, turnaround times are inside limits..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white h-24 resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reviewForm.promotionRecommended}
                  onChange={(e) => setReviewForm({ ...reviewForm, promotionRecommended: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-500"
                />
                <label className="text-xs font-bold text-slate-400">Recommend employee for corporate grade promotion</label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowPerformanceModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Log Review</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* New Job Opening Requisition Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <h3 className={`text-sm font-bold mb-4 bg-gradient-to-r ${tp.accent} bg-clip-text text-transparent`}>New Job Requisition</h3>
            <form onSubmit={handleAddJob} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Job Title</label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="Relationship Officer"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Department</label>
                <input
                  type="text"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                  placeholder="Retail Sales"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Job Description</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Responsible for managing credit files, housing loans evaluation, etc."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white h-24 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddJobModal(false)} className="px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold hover:bg-slate-800 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition">Post Requisition</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Employee Profile Details Modal */}
      {showProfileModal && selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                <p className="text-xs text-blue-500 font-mono mt-0.5">{selectedEmployee.employeeId}</p>
              </div>
              <button onClick={() => { setSelectedEmployee(null); setShowProfileModal(false); }} className="text-xs font-bold text-red-500 hover:underline">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs overflow-y-auto max-h-[450px] scrollbar-thin">
              {/* Profile master metadata */}
              <div className="space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">Corporate Roster Info</h4>
                <p><span className="text-slate-400">Department:</span> {selectedEmployee.department}</p>
                <p><span className="text-slate-400">Grade/Role:</span> {selectedEmployee.role}</p>
                <p><span className="text-slate-400">Branch Name:</span> {selectedEmployee.branch}</p>
                <p><span className="text-slate-400">Roster Email:</span> {selectedEmployee.email}</p>
                <p><span className="text-slate-400">KYC Status:</span> {selectedEmployee.kycStatus}</p>
                <p><span className="text-slate-400">Account status:</span> {selectedEmployee.status}</p>
              </div>

              {/* Document verification status */}
              <div className="space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                <h4 className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">KYC Documents Verification</h4>
                {selectedEmployee.kycDocuments && selectedEmployee.kycDocuments.map((doc, idx) => (
                  <div key={idx} className="p-2 border border-slate-800 bg-slate-900/40 rounded flex justify-between items-center">
                    <div>
                      <span className="font-bold">{doc.docType}</span>
                      <a href={doc.docUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 block hover:underline">View File</a>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-bold">{doc.status}</span>
                  </div>
                ))}
                {(!selectedEmployee.kycDocuments || selectedEmployee.kycDocuments.length === 0) && (
                  <p className="text-slate-500 italic">No KYC documents uploaded yet.</p>
                )}
              </div>

              {/* Transfer History logs */}
              <div className="space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 md:col-span-2">
                <h4 className="font-bold text-orange-400 uppercase tracking-wider text-[10px]">Branch Transfer & Promotion Audits</h4>
                <div className="space-y-2 text-[11px]">
                  <p className="font-bold text-slate-300">Grade Promotion logs:</p>
                  {selectedEmployee.promotionHistory && selectedEmployee.promotionHistory.map((hist, idx) => (
                    <div key={idx} className="border-b border-slate-800/40 pb-2">
                      Promoted from <span className="font-bold">{hist.fromRole}</span> to <span className="font-bold">{hist.toRole}</span> on {new Date(hist.date).toLocaleDateString()} (Approved by: {hist.approvedBy})
                    </div>
                  ))}
                  {(!selectedEmployee.promotionHistory || selectedEmployee.promotionHistory.length === 0) && (
                    <p className="text-slate-500 italic">No promotion history logged.</p>
                  )}

                  <p className="font-bold text-slate-300 mt-4">Branch Transfer logs:</p>
                  {selectedEmployee.transferHistory && selectedEmployee.transferHistory.map((hist, idx) => (
                    <div key={idx} className="border-b border-slate-800/40 pb-2">
                      Transferred from <span className="font-bold">{hist.fromBranch}</span> to <span className="font-bold">{hist.toBranch}</span> on {new Date(hist.date).toLocaleDateString()} (Approved by: {hist.approvedBy})
                    </div>
                  ))}
                  {(!selectedEmployee.transferHistory || selectedEmployee.transferHistory.length === 0) && (
                    <p className="text-slate-500 italic">No branch transfers logged.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HrmsDashboard;
