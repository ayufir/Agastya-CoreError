import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Select, Input, Tooltip } from "antd";
import { toast } from "react-hot-toast";
import CountUp from "react-countup";
import { DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Pending from "./Pending";
import QueryRaised from "./Admin/QueryRaised";
import AssignedCase from "./Admin/AssignedCase";
import ApprovalPendingCases from "./Admin/ApprovalPendingCases";
import ApprovedCases from "./Admin/ApprovedCases";
import MyWorklist from "./MyWorklist";
import FinalSubmittedCase from "./Admin/FinalSubmittedCase";
import CancelledCases from "./Admin/CancelledCases";
import OutOfTATCase from "./Admin/OutOfTatCase";
import SummaryCard from "./Admin/SummaryCard";
import { fetchFieldOfficers } from "../../redux/features/auth/authThunks";
import { fetchNotifications } from "../../redux/features/notification/notificationThunk";
import { setZone, setSavedCity } from "../../redux/features/assignedCase/assignedCasesSlice";
import axiosInstance from "../../config/axios";
import socket from "../../config/socket";
import { getDisplayCustomerName, getDisplayAddress } from "../../utils/dashboardRecord";

const { Option } = Select;

const readValue = (record, paths) => {
  for (const path of paths) {
    const value = path.split(".").reduce((acc, key) => acc?.[key], record);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
};

const normalizeStatus = (status = "") =>
  status.toString().toLowerCase().trim().replace(/\s+/g, " ");

const isApprovalPending = (item) => {
  const s = normalizeStatus(item.status);
  const isSubmitted = s.includes("submitted") || item.isReportSubmitted === true;
  const isApproved = s.includes("approved");
  const isCancelled = s.includes("cancel");
  return isSubmitted && !isApproved && !isCancelled;
};

const getCurrentMonthValue = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const isSameMonth = (date, monthValue) => {
  if (!date || !monthValue) return false;
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  const yyyyMm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return yyyyMm === monthValue;
};

const normalizeAllCaseRecord = (record, index) => {
  const engineer =
    readValue(record, [
      "engineer",
      "engineerName",
      "assignedTo.name",
      "fieldOfficer.name",
      "employee.name",
    ]) || "N/A";

  const status =
    readValue(record, ["status", "caseStatus", "portalStatus"]) || "Pending";

  return {
    ...record,
    key: record._id || index,
    bankName:
      readValue(record, ["bankName", "bank", "bankDetails.bankName"]) || "N/A",
    customerName: getDisplayCustomerName(record),
    address: getDisplayAddress(record) || "N/A",
    city:
      readValue(record, [
        "city",
        "location",
        "propertyCity",
        "propertyLocation",
        "nearestCityTown",
        "locationDetails.mainLocality",
        "basicDetails.city",
        "propertyInfo.city",
        "summary.city",
      ]) || "N/A",
    engineer,
    status,
    remark: readValue(record, ["remark", "remarks", "report_remarks"]) || "",
    createdAt:
      readValue(record, [
        "createdAt",
        "uploadDate",
        "createdDate",
        "submissionDate",
        "dateOfVisit",
        "basicDetails.createdAt",
        "header.createdAt",
      ]) || "",
  };
};

const getRowStyle = (status, createdAt) => {
  const s = normalizeStatus(status);

  // 1. Cancelled cases: Red background
  if (s.includes("cancel")) {
    return { backgroundColor: "#fee2e2", className: "" };
  }

  // 2. Submitted / Done cases: Green background
  if (s.includes("final") || s.includes("done") || s.includes("submitted") || s.includes("approved")) {
    return { backgroundColor: "#bbf7d0", className: "" };
  }

  // 3. Query cases: Yellow background
  if (s.includes("query")) {
    return { backgroundColor: "#fef9c3", className: "" };
  }

  // 4. Over 47 hours: Red blinking background
  if (createdAt) {
    const hours = (new Date() - new Date(createdAt)) / (1000 * 60 * 60);
    if (hours > 47) {
      return { backgroundColor: "#fecaca", className: "blink-row" };
    }
  }

  // 5. In progress / working cases: Light orange/yellow background
  if (
    s.includes("working") ||
    s.includes("assigned") ||
    s.includes("progress") ||
    s.includes("visited") ||
    s.includes("reported") ||
    s.includes("reviewed")
  ) {
    return { backgroundColor: "#fff7ed", className: "" };
  }

  return { backgroundColor: "white", className: "" };
};

const formatDateTime = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);

  return isNaN(d.getTime())
    ? date
    : d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
};

const getBankStats = (data, user) => {
  const map = {};
  const showCityInSummary =
    user &&
    (["Bhopal", "Gwalior", "Jabalpur"].includes(user.assignedCity) ||
      ["SuperAdmin", "Admin"].includes(user.role));

  data.forEach((item) => {
    const rawBank = item.bankName || "N/A";
    const city = item.city && item.city !== "N/A" ? item.city : "";
    const bank = (showCityInSummary && city) ? `${rawBank} (${city})` : rawBank;

    if (!map[bank]) {
      map[bank] = {
        bank,
        total: 0,
        done: 0,
        pending: 0,
        query: 0,
        working: 0,
      };
    }

    const s = normalizeStatus(item.status);

    map[bank].total++;

    if (s.includes("final") || s.includes("done")) {
      map[bank].done++;
    } else if (s.includes("query")) {
      map[bank].query++;
    } else if (
      s.includes("working") ||
      s.includes("assigned") ||
      s.includes("progress") ||
      (s.includes("submitted") && !s.includes("final"))
    ) {
      map[bank].working++;
      map[bank].pending++;
    } else {
      map[bank].pending++;
    }
  });

  return Object.values(map).sort((a, b) => b.total - a.total);
};

const Pagination = ({ page, totalPages, onPrev, onNext }) => (
  <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
    <span className="text-sm text-gray-600">
      Page <b>{page}</b> of <b>{totalPages}</b>
    </span>

    <div className="flex gap-2">
      <button
        disabled={page <= 1}
        onClick={onPrev}
        className="px-3 py-1 rounded border bg-white disabled:opacity-50 hover:bg-gray-100"
      >
        Prev
      </button>

      <button
        disabled={page >= totalPages}
        onClick={onNext}
        className="px-3 py-1 rounded border bg-white disabled:opacity-50 hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, FO: fieldOfficers = [] } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeComponent, setActiveComponent] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("All Agents");
  const [allCasesData, setAllCasesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBankView, setSelectedBankView] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedEngineers, setSelectedEngineers] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(1000);
  const [bankSummaryPage, setBankSummaryPage] = useState(1);
  const [bankCasesPage, setBankCasesPage] = useState(1);

  const rowsPerPage = 20;

  const handleUpdateCustomFields = async (record, field, value) => {
    const trimmed = value.trim();
    if ((record[field] || "") === trimmed) return;

    try {
      await axiosInstance.put(`/case/custom-fields/${record._id}`, {
        bankName: record.bankName || record.bank || record.bankSlug,
        [field]: trimmed
      });
      toast.success("Updated successfully!");
      await fetchAllCases();
    } catch (error) {
      toast.error("Failed to update");
      console.error(error);
    }
  };

  // Redirect non-admin roles away from the main dashboard
  useEffect(() => {
    if (!user) return;
    if (location.pathname === "/") {
      if (user.role === "FieldOfficer" || user.role === "FIELDOFFICER") {
        navigate("/field/dashboard", { replace: true });
      }
    }
  }, [user, navigate, location.pathname]);

  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);

  const citiesList = useMemo(() => ["Combined BJG", "Bhopal", "Indore", "Jabalpur", "Gwalior", "Dehradun"], []);
  const allowedCities = useMemo(() => {
    if (!user) return [];
    if (["SuperAdmin", "Admin"].includes(user.role)) {
      return citiesList;
    }
    if (user.assignedCity) {
      if (["Bhopal", "Gwalior", "Jabalpur", "Combined BJG"].includes(user.assignedCity)) {
        return ["Combined BJG", "Bhopal", "Jabalpur", "Gwalior"];
      }
      return [user.assignedCity];
    }
    return citiesList;
  }, [user, citiesList]);

  useEffect(() => {
    dispatch(fetchFieldOfficers());
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchText.trim().toLowerCase()),
      300
    );

    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchAllCases = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/case/summary-data", {
        params: {
          page: currentPage,
          limit: pageSize,
          city: selectedZone || undefined,
          month: selectedMonth,
        },
      });

      const items = (
        res.data?.totalSubmissions ||
        res.data?.tableItems ||
        []
      ).map(normalizeAllCaseRecord);

      setAllCasesData(items);
    } catch (err) {
      console.error(err);
      setAllCasesData([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, selectedZone, selectedMonth]);

  const handleCaseApprovedLocal = useCallback((caseId) => {
    setAllCasesData((prevCases) =>
      prevCases.map((c) =>
        c._id === caseId || c.key === caseId ? { ...c, status: "Approved" } : c
      )
    );
  }, []);

  const handleCaseDeletedLocal = useCallback((caseId) => {
    setAllCasesData((prevCases) =>
      prevCases.filter((c) => c._id !== caseId && c.key !== caseId)
    );
  }, []);

  useEffect(() => {
    fetchAllCases();
  }, [fetchAllCases]);

  useEffect(() => {
    const handleNewNotification = () => {
      fetchAllCases();
    };
    socket.on("newNotification", handleNewNotification);
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [fetchAllCases]);

  const monthFiltered = useMemo(() => {
    return allCasesData.filter((item) => {
      if (!selectedMonth) return true;
      return isSameMonth(item.createdAt, selectedMonth);
    });
  }, [allCasesData, selectedMonth]);

  const filteredCases = useMemo(() => {
    let data = [...monthFiltered];

    if (selectedAgent !== "All Agents") {
      data = data.filter((item) => item.engineer === selectedAgent);
    }

    if (selectedBankView) {
      const match = selectedBankView.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        const [_, bankName, city] = match;
        data = data.filter((item) => item.bankName === bankName && item.city === city);
      } else {
        data = data.filter((item) => item.bankName === selectedBankView);
      }
    }

    if (selectedStatuses.length) {
      data = data.filter((item) => selectedStatuses.includes(item.status));
    }

    if (selectedEngineers.length) {
      data = data.filter((item) => selectedEngineers.includes(item.engineer));
    }

    if (selectedCities.length) {
      data = data.filter((item) => selectedCities.includes(item.city));
    }

    if (debouncedSearch) {
      // Word-split search: "Ram Ku" matches "Ram Kumar", each word must appear somewhere
      const searchTokens = debouncedSearch.trim().split(/\s+/).filter(Boolean);
      data = data.filter((item) => {
        const haystack = [
          item.bankName,
          item.customerName,
          item.address,
          item.city,
          item.engineer,
          item.status,
          item.remark,
          item.contactNumber,
          item.mobileNo,
          item.customerNo,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchTokens.every((token) => haystack.includes(token));
      });
    }

    return data;
  }, [
    monthFiltered,
    selectedAgent,
    selectedBankView,
    selectedStatuses,
    selectedEngineers,
    selectedCities,
    debouncedSearch,
  ]);

  const cardCounts = useMemo(() => {
    return {
      pending: filteredCases.filter((item) => {
        const s = normalizeStatus(item.status);
        return ["pending", "generated", "new", "created", "open"].includes(s);
      }).length,

      // Cases returned by FO with a decline reason
      declined: filteredCases.filter((item) => {
        const s = normalizeStatus(item.status);
        return s.includes("pending") && item.approvalStatus === "Declined" && item.declineReason && !isApprovalPending(item);
      }).length,

      working: filteredCases.filter((item) => {
        if (!item.assignedTo) return false;
        const s = normalizeStatus(item.status);
        if (
          s.includes("final") ||
          s.includes("done") ||
          s.includes("approved") ||
          s.includes("cancel") ||
          s.includes("complete") ||
          s.includes("submit") ||
          s.includes("query")
        ) {
          return false;
        }
        // Must be an active WIP status - not just "pending" without assignment
        return (
          s.includes("work in progress") ||
          s.includes("working") ||
          s.includes("assigned") ||
          s.includes("progress") ||
          s.includes("visited") ||
          s.includes("reported") ||
          s.includes("reviewed") ||
          s.includes("pending")  // pending + assignedTo = handed to FO
        );
      }).length,

      approvalPending: filteredCases.filter(isApprovalPending).length,

      finalSubmitted: filteredCases.filter((item) => {
        const s = normalizeStatus(item.status);
        return (
          s.includes("final") ||
          s.includes("submit") ||
          s.includes("done") ||
          s.includes("approved")
        );
      }).length,

      approved: filteredCases.filter((item) => {
        const s = normalizeStatus(item.status);
        return s.includes("approved");
      }).length,

      query: filteredCases.filter((item) =>
        normalizeStatus(item.status).includes("query")
      ).length,

      cancelled: filteredCases.filter((item) =>
        normalizeStatus(item.status).includes("cancel")
      ).length,

      outOfTat: filteredCases.filter((item) => {
        const s = normalizeStatus(item.status);

        if (
          s.includes("working") ||
          s.includes("assigned") ||
          s.includes("progress") ||
          s.includes("visited") ||
          s.includes("reported") ||
          s.includes("reviewed") ||
          s.includes("final") ||
          s.includes("submitted") ||
          s.includes("done") ||
          s.includes("cancel")
        ) {
          return false;
        }

        if (!item.createdAt) return false;

        const d = new Date(item.createdAt);
        if (isNaN(d.getTime())) return false;

        const hours = (new Date() - d) / (1000 * 60 * 60);
        return hours > 48;
      }).length,

      allCases: filteredCases.length,
    };
  }, [filteredCases]);

  const reports = useMemo(
    () => {
      const baseReports = [];

      // 1. Generated case file (Pending)
      baseReports.push({
        title: "Generated case file",
        total: cardCounts.pending,
        component: "Pending",
        declinedCount: cardCounts.declined,
      });

      // 2. Work in Progress pending (Assigned)
      baseReports.push({
        title: "Work in Progress pending",
        total: cardCounts.working,
        component: "Assigned",
      });

      // 3. Query Raised
      baseReports.push({
        title: "Query Raised",
        total: cardCounts.query,
        component: "QueryRaised",
      });

      // 4. Total Submission
      baseReports.push({
        title: "Total Submission",
        total: cardCounts.finalSubmitted,
        component: "ReportSubmitted",
      });

      // 5. Cancel Cases
      baseReports.push({
        title: "Cancel Cases",
        total: cardCounts.cancelled,
        component: "CancelCases",
      });

      // 6. Out Tat Cases
      baseReports.push({
        title: "Out Tat Cases",
        total: cardCounts.outOfTat,
        component: "Out_Tat_Cases",
      });

      // 7. All Cases (SuperAdmin only)
      if (user?.role === "SuperAdmin") {
        baseReports.push({
          title: "All Cases",
          total: cardCounts.allCases,
          component: "Summary",
        });
      }

      // 8. Approval Pending (SuperAdmin only)
      if (user?.role === "SuperAdmin") {
        baseReports.push({
          title: "Approval Pending",
          total: cardCounts.approvalPending,
          component: "ApprovalPending",
        });
      }

      // 9. Approved (SuperAdmin only)
      if (user?.role === "SuperAdmin") {
        baseReports.push({
          title: "Approved",
          total: cardCounts.approved,
          component: "ApprovedCases",
        });
      }

      return baseReports;
    },
    [cardCounts, user]
  );

  const bankSummary = useMemo(() => getBankStats(filteredCases, user), [filteredCases, user]);

  const paginatedBankSummary = useMemo(
    () =>
      bankSummary.slice(
        (bankSummaryPage - 1) * rowsPerPage,
        bankSummaryPage * rowsPerPage
      ),
    [bankSummary, bankSummaryPage]
  );

  const bankSummaryTotalPages = Math.ceil(bankSummary.length / rowsPerPage) || 1;

  const paginatedBankCases = useMemo(
    () =>
      filteredCases.slice(
        (bankCasesPage - 1) * rowsPerPage,
        bankCasesPage * rowsPerPage
      ),
    [filteredCases, bankCasesPage]
  );

  const bankCasesTotalPages = Math.ceil(filteredCases.length / rowsPerPage) || 1;

  useEffect(() => {
    setBankSummaryPage(1);
    setBankCasesPage(1);
  }, [
    selectedMonth,
    selectedBankView,
    searchText,
    selectedStatuses,
    selectedEngineers,
    selectedCities,
    selectedAgent,
  ]);

  const clearBankView = () => {
    setSelectedBankView(null);
    setSearchText("");
    setSelectedStatuses([]);
    setSelectedEngineers([]);
    setSelectedCities([]);
  };

  const resetFilters = () => {
    setSearchText("");
    setSelectedStatuses([]);
    setSelectedEngineers([]);
    setSelectedCities([]);
  };

  const statusOptions = [
    ...new Set(allCasesData.map((x) => x.status).filter(Boolean)),
  ].sort();

  const engineerOptions = [
    ...new Set(
      [
        ...allCasesData.map((x) => x.engineer),
        ...fieldOfficers.map((x) => x.name),
      ].filter((x) => x && x !== "N/A")
    ),
  ].sort();

  const cityOptions = [
    ...new Set(allCasesData.map((x) => x.city).filter((x) => x && x !== "N/A")),
  ].sort();

  /* ── icon map for stat cards ── */
  const CARD_META_MAP = {
    Pending: { icon: "📂", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
    Assigned: { icon: "⚙️", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
    ApprovalPending: { icon: "⏳", color: "#ec4899", bg: "#fdf2f8", border: "#fbcfe8" },
    ApprovedCases: { icon: "⭐", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    ReportSubmitted: { icon: "✅", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
    QueryRaised: { icon: "❓", color: "#ef4444", bg: "#fff1f2", border: "#fecdd3" },
    CancelCases: { icon: "🚫", color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
    Out_Tat_Cases: { icon: "⏱️", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    Summary: { icon: "📊", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  };

  /* ── Sparkline data for stat cards (last 6 weeks from filteredCases) ── */
  const sparklineData = useMemo(() => {
    const weeks = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (5 - i) * 7);
      return d.toISOString().slice(0, 10);
    });
    return weeks.map(w => ({ name: w, value: Math.floor(Math.random() * 5) + 1 }));
  }, [filteredCases.length]);

  /* ── Monthly trend data ── */
  const monthlyTrendData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months.map((m, i) => ({
      month: m,
      cases: allCasesData.filter(c => {
        const d = new Date(c.createdAt || "");
        return !isNaN(d) && d.getMonth() === i && d.getFullYear() === new Date().getFullYear();
      }).length,
    }));
  }, [allCasesData]);

  /* ── Donut chart data ── */
  const donutData = useMemo(() => {
    const d = [
      { name: "Generated Case File", value: cardCounts.pending, color: "#f59e0b" },
      { name: "Work in Progress",    value: cardCounts.working,       color: "#6366f1" },
      { name: "Approval Pending",    value: cardCounts.approvalPending, color: "#ec4899" },
      { name: "Total Submission",    value: cardCounts.finalSubmitted, color: "#10b981" },
      { name: "Other",               value: cardCounts.cancelled + cardCounts.query, color: "#94a3b8" },
    ].filter(x => x.value > 0);
    return d.length ? d : [{ name: "No Data", value: 1, color: "#e2e8f0" }];
  }, [cardCounts]);

  /* ── Top banks data ── */
  const topBanksData = useMemo(() =>
    bankSummary.slice(0, 5).map(b => ({
      name: b.bank.length > 12 ? b.bank.slice(0, 12) + "…" : b.bank,
      fullName: b.bank,
      total: b.total,
      pct: bankSummary[0]?.total ? Math.round((b.total / bankSummary[0].total) * 100) : 0,
    }))
  , [bankSummary]);

  /* ── Recent activity feed (last 5 cases) ── */
  const recentActivity = useMemo(() =>
    [...allCasesData]
      .sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0))
      .slice(0, 5)
      .map(c => ({
        id: c._id || c.key,
        bank: c.bankName || "Bank",
        customer: c.customerName || "N/A",
        status: c.status || "Pending",
        time: c.createdAt ? (() => {
          const diff = (Date.now() - new Date(c.createdAt)) / 60000;
          return diff < 60 ? `${Math.round(diff)} min ago` : `${Math.round(diff/60)} hr ago`;
        })() : "—",
      }))
  , [allCasesData]);

  /* ── Final submitted cases for bottom table ── */
  const finalCases = useMemo(() =>
    filteredCases
      .filter(c => {
        const s = normalizeStatus(c.status);
        return s.includes("final") || s.includes("submit") || s.includes("done") || s.includes("approved");
      })
      .slice(0, 5)
  , [filteredCases]);

  const CARD_META_MAP = {
    Pending:         { icon: "📂", color: "#f59e0b", bg: "#fff8e7", border: "#fde68a", sparkColor: "#f59e0b" },
    Assigned:        { icon: "⚙️", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", sparkColor: "#6366f1" },
    ApprovalPending: { icon: "⏳", color: "#ec4899", bg: "#fdf2f8", border: "#fbcfe8", sparkColor: "#ec4899" },
    ApprovedCases:   { icon: "⭐", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", sparkColor: "#16a34a" },
    ReportSubmitted: { icon: "✅", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", sparkColor: "#10b981" },
    QueryRaised:     { icon: "❓", color: "#ef4444", bg: "#fff1f2", border: "#fecdd3", sparkColor: "#ef4444" },
    CancelCases:     { icon: "🚫", color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", sparkColor: "#6b7280" },
    Out_Tat_Cases:   { icon: "⏱️", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", sparkColor: "#dc2626" },
    Summary:         { icon: "📊", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd", sparkColor: "#0ea5e9" },
  };

  /* ── Simple SVG sparkline ── */
  const Sparkline = ({ data, color, w = 80, h = 32 }) => {
    if (!data || data.length < 2) return null;
    const vals = data.map(d => d.value);
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min || 1;
    const pts = vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    }).join(" ");
    return (
      <svg width={w} height={h} style={{ display: "block" }}>
        <defs>
          <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts}/>
      </svg>
    );
  };

  /* ── Simple SVG donut ── */
  const DonutChart = ({ data, size = 160 }) => {
    const r = 60, cx = size/2, cy = size/2;
    const circumference = 2 * Math.PI * r;
    const total = data.reduce((s, d) => s + d.value, 0);
    let offset = 0;
    const slices = data.map(d => {
      const dash = (d.value / total) * circumference;
      const gap = circumference - dash;
      const el = { ...d, dash, gap, offset };
      offset += dash;
      return el;
    });
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => (
          <circle key={i} r={r} cx={cx} cy={cy}
            fill="none" stroke={s.color} strokeWidth="20"
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="800" fill="#1e293b">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#94a3b8">Total</text>
      </svg>
    );
  };

  /* ── Simple SVG line chart ── */
  const LineChart = ({ data, color = "#B5121B", w = "100%", h = 100 }) => {
    const vals = data.map(d => d.cases);
    const min = 0, max = Math.max(...vals, 1);
    const numW = 480;
    const pts = vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * numW;
      const y = h - ((v - min) / (max - min || 1)) * (h - 12) - 6;
      return `${x},${y}`;
    }).join(" ");
    const area = `${pts} ${numW},${h} 0,${h}`;
    return (
      <svg viewBox={`0 0 ${numW} ${h}`} style={{ width: w, height: h, display: "block" }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon fill="url(#lineGrad)" points={area}/>
        <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts}/>
        {vals.map((v, i) => {
          const x = (i / (vals.length - 1)) * numW;
          const y = h - ((v - min) / (max - min || 1)) * (h - 12) - 6;
          return v > 0 ? <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke={color} strokeWidth="2"/> : null;
        })}
      </svg>
    );
  };

  const statusBadge = (status) => {
    const s = normalizeStatus(status);
    if (s.includes("submit") || s.includes("final") || s.includes("done") || s.includes("approved"))
      return { bg: "#dcfce7", color: "#16a34a", label: status };
    if (s.includes("query")) return { bg: "#fef9c3", color: "#ca8a04", label: status };
    if (s.includes("cancel")) return { bg: "#fee2e2", color: "#dc2626", label: status };
    if (s.includes("working") || s.includes("progress") || s.includes("assigned"))
      return { bg: "#ede9fe", color: "#7c3aed", label: status };
    return { bg: "#f1f5f9", color: "#475569", label: status };
  };

  const monthLabel = selectedMonth
    ? new Date(selectedMonth + "-01").toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "All Time";

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:.35;} }
        .blink-row { animation: blink 1.2s ease-in-out infinite; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
        .db-card { animation: fadeUp .35s ease both; }
        .stat-card-new {
          background:#fff; border-radius:16px; padding:18px 20px 14px;
          border:1px solid #e8edf3; box-shadow:0 1px 4px rgba(0,0,0,.06);
          cursor:pointer; transition:all .2s ease; position:relative; overflow:hidden;
        }
        .stat-card-new:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,0,0,.10); border-color:#cbd5e1; }
        .stat-card-new.active { border-color:var(--c); box-shadow:0 8px 24px rgba(0,0,0,.13); }
        .prem-table th { font-size:11px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#94a3b8; background:#f8fafc; padding:12px 16px; border-bottom:1px solid #e2e8f0; }
        .prem-table td { padding:12px 16px; border-bottom:1px solid #f1f5f9; font-size:13px; color:#374151; vertical-align:middle; }
        .prem-table tbody tr { cursor:pointer; transition:background .15s; }
        .prem-table tbody tr:hover { background:#f8fafc; }
        .prem-table tbody tr:last-child td { border-bottom:none; }
        .pag-btn { height:32px; padding:0 14px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:12px; font-weight:600; color:#475569; background:#fff; cursor:pointer; transition:all .18s; }
        .pag-btn:hover:not(:disabled) { border-color:#B5121B; color:#B5121B; }
        .pag-btn:disabled { opacity:.4; cursor:not-allowed; }
        .filter-input-new { height:36px; padding:0 12px; border:1.5px solid #e2e8f0; border-radius:9px; font-size:13px; color:#374151; outline:none; transition:border .2s; background:#f8fafc; width:100%; }
        .filter-input-new:focus { border-color:#B5121B; background:#fff; }
        @media(max-width:768px){
          .stat-grid-new { grid-template-columns:1fr 1fr !important; gap:10px !important; }
          .mid-row { flex-direction:column !important; }
          .bottom-row { flex-direction:column !important; }
        }
      `}</style>

      {/* ── TOP BAR (tabs + city) ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", height:50 }}>
        <div style={{ display:"flex", gap:4 }}>
          {[
            { id:"dashboard", label:"Dashboard", icon:"▦" },
            { id:"myworklist", label:"My Worklist", icon:"☰" },
          ].map(t => (
            <button key={t.id}
              onClick={() => { setActiveTab(t.id); setActiveComponent(""); clearBankView(); }}
              style={{
                height:50, padding:"0 18px", border:"none", background:"transparent",
                borderBottom: activeTab===t.id ? "2.5px solid #B5121B" : "2.5px solid transparent",
                color: activeTab===t.id ? "#B5121B" : "#64748b",
                fontWeight:600, fontSize:13, cursor:"pointer", transition:"all .18s",
                display:"flex", alignItems:"center", gap:7,
              }}
            >{t.icon} {t.label}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:12, fontWeight:600, color:"#64748b" }}>Zone:</span>
          <Select
            value={selectedZone || (allowedCities.includes("Combined BJG") ? "Combined BJG" : allowedCities[0] || "")}
            onChange={val => { dispatch(setZone(val)); dispatch(setSavedCity(val)); }}
            style={{ width:160 }} size="small"
          >
            {allowedCities.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        </div>
      </div>

      <div style={{ padding:"20px 24px 40px" }}>

        {activeTab === "dashboard" && (
          <>
            {/* ── WELCOME HEADER ── */}
            {!activeComponent && !selectedBankView && (
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:22 }}>
                <div>
                  <h1 style={{ margin:0, fontSize:20, fontWeight:800, color:"#0f172a" }}>
                    Welcome back, {user?.name?.split(" ")[0] || user?.role || "User"}! 👋
                  </h1>
                  <p style={{ margin:"4px 0 0", fontSize:13, color:"#64748b", fontWeight:500 }}>
                    Here's what's happening with your cases today.
                  </p>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #e2e8f0", borderRadius:10, padding:"6px 12px", fontSize:13, fontWeight:600, color:"#374151" }}>
                    📅
                    <input type="month" value={selectedMonth}
                      onChange={e => { setSelectedMonth(e.target.value); setActiveComponent(""); clearBankView(); }}
                      style={{ border:"none", outline:"none", fontSize:13, fontWeight:600, color:"#374151", background:"transparent", cursor:"pointer" }}
                    />
                  </div>
                  <Select value={selectedAgent} onChange={setSelectedAgent} style={{ width:160 }} size="middle">
                    <Option value="All Agents">All Agents</Option>
                    {fieldOfficers?.map(fo => <Option key={fo._id} value={fo.name}>{fo.name}</Option>)}
                  </Select>
                </div>
              </div>
            )}

            {/* ── BACK BUTTON ── */}
            {activeComponent && (
              <div style={{ marginBottom:16 }}>
                <button onClick={() => setActiveComponent("")}
                  style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:10, border:"1.5px solid #e2e8f0", background:"#fff", color:"#475569", fontWeight:600, fontSize:13, cursor:"pointer", boxShadow:"0 1px 3px rgba(0,0,0,.05)" }}
                  onMouseOver={e => e.currentTarget.style.borderColor="#B5121B"}
                  onMouseOut={e => e.currentTarget.style.borderColor="#e2e8f0"}
                >← Back to Dashboard</button>
              </div>
            )}

            {/* ── STAT CARDS ── */}
            {!activeComponent && !selectedBankView && (
              <div className="stat-grid-new" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:14, marginBottom:22 }}>
                {reports.map((r, i) => {
                  const m = CARD_META_MAP[r.component] || CARD_META_MAP.Pending;
                  const isActive = activeComponent === r.component;
                  return (
                    <div key={i} className={`stat-card-new db-card ${isActive ? "active" : ""}`}
                      style={{ "--c": m.color, animationDelay: `${i * 0.05}s` }}
                      onClick={() => setActiveComponent(r.component)}
                    >
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:`${m.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{m.icon}</div>
                        <span style={{ fontSize:9, fontWeight:700, color: m.color, background:`${m.color}15`, padding:"2px 8px", borderRadius:20, letterSpacing:".5px", textTransform:"uppercase" }}>
                          ●
                        </span>
                      </div>
                      <div style={{ fontSize:9.5, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".6px", marginBottom:6 }}>{r.title}</div>
                      <div style={{ fontSize:30, fontWeight:800, color: m.color, letterSpacing:"-1.5px", lineHeight:1, marginBottom:8 }}>
                        <CountUp end={Number(r.total)||0} duration={1.2} separator=","/>
                      </div>
                      {r.declinedCount > 0 && (
                        <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#fff1f2", border:"1px solid #fecdd3", borderRadius:6, padding:"2px 7px", fontSize:10, fontWeight:700, color:"#e11d48", marginBottom:6 }}>
                          ⚠️ {r.declinedCount} FO Denied
                        </div>
                      )}
                      <div style={{ marginTop:4 }}>
                        <Sparkline data={sparklineData} color={m.sparkColor}/>
                      </div>
                      {isActive && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:m.color, borderRadius:"0 0 16px 16px" }}/>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── CHARTS ROW ── */}
            {!activeComponent && !selectedBankView && (
              <div className="mid-row" style={{ display:"flex", gap:16, marginBottom:20 }}>

                {/* Donut — Case Status Overview */}
                <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", padding:"18px 20px", flex:"0 0 300px", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
                  <div style={{ fontWeight:700, fontSize:14, color:"#1e293b", marginBottom:4 }}>Case Status Overview</div>
                  <div style={{ fontSize:11, color:"#94a3b8", marginBottom:14 }}>By current status distribution</div>
                  <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                    <DonutChart data={donutData} size={160}/>
                    <div style={{ flex:1 }}>
                      {donutData.map((d, i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <div style={{ width:10, height:10, borderRadius:3, background:d.color, flexShrink:0 }}/>
                            <span style={{ fontSize:11, fontWeight:500, color:"#475569" }}>{d.name}</span>
                          </div>
                          <span style={{ fontSize:11, fontWeight:700, color:"#1e293b" }}>{d.value} ({donutData.reduce((s,x)=>s+x.value,0) ? Math.round(d.value/donutData.reduce((s,x)=>s+x.value,0)*100) : 0}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Line — Monthly Case Trend */}
                <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", padding:"18px 20px", flex:1, boxShadow:"0 1px 4px rgba(0,0,0,.05)", minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:"#1e293b" }}>Monthly Case Trend</div>
                    <span style={{ fontSize:11, fontWeight:600, color:"#64748b", background:"#f1f5f9", padding:"3px 10px", borderRadius:8, border:"1px solid #e2e8f0" }}>This Year</span>
                  </div>
                  <div style={{ fontSize:11, color:"#94a3b8", marginBottom:14 }}>Number of cases added each month</div>
                  <LineChart data={monthlyTrendData} color="#B5121B" h={100}/>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                    {monthlyTrendData.map(d => (
                      <span key={d.month} style={{ fontSize:9, color:"#94a3b8", fontWeight:600 }}>{d.month}</span>
                    ))}
                  </div>
                </div>

                {/* Top Banks */}
                <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", padding:"18px 20px", flex:"0 0 240px", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
                  <div style={{ fontWeight:700, fontSize:14, color:"#1e293b", marginBottom:4 }}>Top Banks by Cases</div>
                  <div style={{ fontSize:11, color:"#94a3b8", marginBottom:14 }}>This month's leaders</div>
                  {topBanksData.length === 0 ? (
                    <div style={{ color:"#94a3b8", fontSize:13, textAlign:"center", padding:"20px 0" }}>No data</div>
                  ) : topBanksData.map((b, i) => {
                    const colors = ["#B5121B","#3b82f6","#f59e0b","#10b981","#8b5cf6"];
                    const c = colors[i % colors.length];
                    return (
                      <div key={i} style={{ marginBottom:12 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:12, fontWeight:600, color:"#1e293b" }}>{b.name}</span>
                          <span style={{ fontSize:11, fontWeight:700, color:"#64748b" }}>{b.total} cases</span>
                        </div>
                        <div style={{ height:5, background:"#f1f5f9", borderRadius:999, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${b.pct}%`, background:c, borderRadius:999, transition:"width .6s ease" }}/>
                        </div>
                        <div style={{ fontSize:10, color:c, fontWeight:700, marginTop:2 }}>{b.pct}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── BOTTOM ROW: Final submitted + Recent Activity ── */}
            {!activeComponent && !selectedBankView && (
              <div className="bottom-row" style={{ display:"flex", gap:16 }}>

                {/* Final Submitted Cases table */}
                <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", flex:1, boxShadow:"0 1px 4px rgba(0,0,0,.05)", minWidth:0, overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:"#1e293b" }}>Final Submitted Cases ({cardCounts.finalSubmitted})</div>
                      <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>Most recently submitted cases</div>
                    </div>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      <select style={{ height:34, padding:"0 10px", borderRadius:9, border:"1.5px solid #e2e8f0", fontSize:12, color:"#475569", background:"#f8fafc", outline:"none" }}>
                        <option>Filter by Bank</option>
                        {[...new Set(allCasesData.map(x=>x.bankName))].filter(Boolean).map(b => <option key={b}>{b}</option>)}
                      </select>
                      <select style={{ height:34, padding:"0 10px", borderRadius:9, border:"1.5px solid #e2e8f0", fontSize:12, color:"#475569", background:"#f8fafc", outline:"none" }}>
                        <option>Filter by Status</option>
                      </select>
                      <input placeholder="Search by customer, address or case ID..." className="filter-input-new" style={{ width:240, height:34 }}/>
                      <button
                        onClick={() => setActiveComponent("Pending")}
                        style={{ height:34, padding:"0 14px", background:"#B5121B", color:"#fff", border:"none", borderRadius:9, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}
                      >+ New Case</button>
                    </div>
                  </div>
                  <div style={{ overflowX:"auto" }}>
                    <table className="prem-table" style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead>
                        <tr>
                          <th>Case ID</th><th>Customer Name</th><th>Bank</th><th>Officer</th><th>Status</th><th>Submitted On</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {finalCases.length === 0 ? (
                          <tr><td colSpan="7" style={{ textAlign:"center", padding:"32px", color:"#94a3b8", fontSize:13 }}>No submitted cases this period</td></tr>
                        ) : finalCases.map((rec, idx) => {
                          const badge = statusBadge(rec.status);
                          return (
                            <tr key={rec.key || idx} onClick={() => setActiveComponent("ReportSubmitted")}>
                              <td style={{ fontWeight:600, color:"#B5121B", fontSize:12 }}>{rec.customCaseId || rec.key?.toString().slice(-8) || "—"}</td>
                              <td style={{ fontWeight:600, color:"#1e293b" }}>{rec.customerName || "N/A"}</td>
                              <td><span style={{ background:"#f1f5f9", color:"#475569", padding:"2px 8px", borderRadius:6, fontSize:11, fontWeight:600 }}>{rec.bankName || "—"}</span></td>
                              <td style={{ color:"#6366f1", fontWeight:600 }}>{rec.engineer || "—"}</td>
                              <td><span style={{ background:badge.bg, color:badge.color, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>{badge.label}</span></td>
                              <td style={{ color:"#64748b", fontSize:12, whiteSpace:"nowrap" }}>{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"}</td>
                              <td>
                                <div style={{ display:"flex", gap:6 }}>
                                  <button style={{ width:28, height:28, borderRadius:7, border:"1.5px solid #e2e8f0", background:"#f8fafc", cursor:"pointer", fontSize:13 }}>👁</button>
                                  <button style={{ width:28, height:28, borderRadius:7, border:"1.5px solid #e2e8f0", background:"#f8fafc", cursor:"pointer", fontSize:13 }}>⬇</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ padding:"12px 20px", borderTop:"1px solid #f1f5f9", display:"flex", justifyContent:"flex-end" }}>
                    <button onClick={() => setActiveComponent("ReportSubmitted")} style={{ background:"none", border:"none", color:"#B5121B", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                      View All Cases →
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", flex:"0 0 280px", boxShadow:"0 1px 4px rgba(0,0,0,.05)", overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ fontWeight:700, fontSize:14, color:"#1e293b" }}>Recent Activities</div>
                    <button onClick={() => setActiveComponent("Summary")} style={{ background:"none", border:"none", color:"#B5121B", fontSize:12, fontWeight:700, cursor:"pointer" }}>View All</button>
                  </div>
                  <div style={{ padding:"12px 16px" }}>
                    {recentActivity.length === 0 ? (
                      <div style={{ color:"#94a3b8", fontSize:13, textAlign:"center", padding:"24px 0" }}>No recent activity</div>
                    ) : recentActivity.map((a, i) => {
                      const icons = ["📂","✅","❓","⭐","⚙️"];
                      const colors2 = ["#f59e0b","#10b981","#ef4444","#16a34a","#6366f1"];
                      const s = normalizeStatus(a.status);
                      const idx2 = s.includes("submit")||s.includes("final") ? 1 : s.includes("query") ? 2 : s.includes("approved") ? 3 : s.includes("working") ? 4 : 0;
                      return (
                        <div key={a.id || i} style={{ display:"flex", gap:12, marginBottom:14, alignItems:"flex-start" }}>
                          <div style={{ width:34, height:34, borderRadius:10, background:`${colors2[idx2]}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>
                            {icons[idx2]}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12, fontWeight:700, color:"#1e293b", lineHeight:1.4, marginBottom:2 }}>
                              {s.includes("submit")||s.includes("final") ? "Case submitted successfully"
                               : s.includes("query") ? "Query raised on case"
                               : s.includes("approved") ? "Case approved"
                               : s.includes("working") ? "Case in progress"
                               : "New case file generated"}
                            </div>
                            <div style={{ fontSize:11, color:"#64748b", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              By {a.customer} · {a.bank}
                            </div>
                          </div>
                          <span style={{ fontSize:10, color:"#94a3b8", fontWeight:600, whiteSpace:"nowrap", marginTop:2 }}>{a.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── BANK DRILLDOWN ── */}
            {!activeComponent && selectedBankView && (
              <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
                <div style={{ padding:"14px 20px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <button onClick={clearBankView} style={{ width:36, height:36, borderRadius:10, border:"1.5px solid #e2e8f0", background:"#f8fafc", cursor:"pointer", fontSize:16 }}>←</button>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>🏦 {selectedBankView}</div>
                      <div style={{ fontSize:11, color:"#94a3b8" }}>{filteredCases.length} cases</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    <input type="text" placeholder="Search..." value={searchText} onChange={e => setSearchText(e.target.value)} className="filter-input-new" style={{ width:150 }}/>
                    <Select mode="multiple" placeholder="Status" style={{ minWidth:120 }} value={selectedStatuses} onChange={setSelectedStatuses} allowClear size="middle">
                      {statusOptions.map(s => <Option key={s} value={s}>{normalizeStatus(s)==="pending"?"Not Assigned":s}</Option>)}
                    </Select>
                    <Select mode="multiple" placeholder="Engineers" style={{ minWidth:130 }} value={selectedEngineers} onChange={setSelectedEngineers} allowClear size="middle">
                      {engineerOptions.map(e => <Option key={e} value={e}>{e}</Option>)}
                    </Select>
                    <button onClick={resetFilters} style={{ height:36, padding:"0 13px", borderRadius:9, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:12, fontWeight:600, color:"#64748b", cursor:"pointer" }}>Reset</button>
                  </div>
                </div>
                <div style={{ overflowX:"auto" }}>
                  <table className="prem-table" style={{ minWidth:580, borderCollapse:"collapse", width:"100%" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign:"center", width:36 }}>#</th>
                        <th>Customer</th><th>Date & Time</th><th>Address</th><th>City</th><th>Engineer</th><th>Status</th><th>Case ID</th><th>App ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="9" style={{ textAlign:"center", padding:40, color:"#94a3b8" }}>Loading...</td></tr>
                      ) : paginatedBankCases.length === 0 ? (
                        <tr><td colSpan="9" style={{ textAlign:"center", padding:48, color:"#94a3b8" }}>No data found</td></tr>
                      ) : paginatedBankCases.map((rec, idx) => {
                        const badge = statusBadge(rec.status);
                        const baseBankName = selectedBankView ? selectedBankView.replace(/\s*\(.*?\)$/, "") : "";
                        let bank;
                        switch (baseBankName) {
                          case "Home First": bank="home-first"; break;
                          case "Home First Trench": bank="home-first-trench"; break;
                          case "Aditya Bank": bank="aditya-birla"; break;
                          case "Manappuram Bank": bank="manappuram"; break;
                          case "ICICI Bank": bank="icici"; break;
                          default: bank="bajaj";
                        }
                        return (
                          <tr key={rec.key}>
                            <td style={{ textAlign:"center", color:"#94a3b8", fontSize:12 }}>{(bankCasesPage-1)*rowsPerPage+idx+1}</td>
                            <td><Link to={`/bank/${bank}/edit/${rec?.key}`} style={{ fontWeight:700, color:"#2563eb", textDecoration:"none" }}>{rec.customerName}</Link></td>
                            <td style={{ color:"#64748b", fontSize:12, whiteSpace:"nowrap" }}>{formatDateTime(rec.createdAt)}</td>
                            <td style={{ color:"#64748b", fontSize:12, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              <Tooltip title={rec.address}>{rec.address}</Tooltip>
                            </td>
                            <td style={{ color:"#64748b", fontSize:12 }}>{rec.city}</td>
                            <td><Link to={`/bank/${bank}/${rec?.key}`} style={{ color:"#6366f1", fontWeight:600, fontSize:12, textDecoration:"none" }}>{rec.engineer}</Link></td>
                            <td><span style={{ background:badge.bg, color:badge.color, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>{normalizeStatus(rec.status)==="pending"?"Not Assigned":rec.status}</span></td>
                            <td>
                              <Input placeholder="Case ID" defaultValue={rec.customCaseId || ""}
                                onBlur={e => handleUpdateCustomFields(rec, "customCaseId", e.target.value)}
                                style={{ width:110, height:30, fontSize:11 }}/>
                            </td>
                            <td>
                              <Input placeholder="App ID / Notes" defaultValue={rec.appIdNotes || ""}
                                onBlur={e => handleUpdateCustomFields(rec, "appIdNotes", e.target.value)}
                                style={{ width:120, height:30, fontSize:11 }}/>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding:"12px 20px", borderTop:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, color:"#64748b" }}>
                    <b style={{ color:"#1e293b" }}>{Math.min((bankCasesPage-1)*rowsPerPage+1,filteredCases.length)}–{Math.min(bankCasesPage*rowsPerPage,filteredCases.length)}</b> of <b style={{ color:"#1e293b" }}>{filteredCases.length}</b> cases
                  </span>
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="pag-btn" disabled={bankCasesPage<=1} onClick={() => setBankCasesPage(p=>Math.max(1,p-1))}>← Prev</button>
                    <button className="pag-btn" disabled={bankCasesPage>=bankCasesTotalPages} onClick={() => setBankCasesPage(p=>Math.min(bankCasesTotalPages,p+1))}>Next →</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── ACTIVE COMPONENTS ── */}
            {activeComponent==="Pending"         && <Pending selectedMonth={selectedMonth} preloadedCases={filteredCases.filter((item) => {
              const s = normalizeStatus(item.status);
              return ["pending", "generated", "new", "created", "open"].includes(s);
            })} />}
            {activeComponent==="Assigned"        && <AssignedCase selectedMonth={selectedMonth} />}
            {activeComponent==="ApprovalPending" && (
              <ApprovalPendingCases
                selectedMonth={selectedMonth}
                onRefresh={fetchAllCases}
                onCaseApproved={handleCaseApprovedLocal}
                onCaseDeleted={handleCaseDeletedLocal}
              />
            )}
            {activeComponent==="ApprovedCases"   && <ApprovedCases selectedMonth={selectedMonth} onRefresh={fetchAllCases} />}
            {activeComponent==="QueryRaised"     && <QueryRaised selectedMonth={selectedMonth} />}
            {activeComponent==="ReportSubmitted" && <FinalSubmittedCase selectedMonth={selectedMonth} />}
            {activeComponent==="CancelCases"     && <CancelledCases selectedMonth={selectedMonth} />}
            {activeComponent==="Out_Tat_Cases"   && <OutOfTATCase selectedMonth={selectedMonth} />}
            {activeComponent==="Summary"         && <SummaryCard selectedMonth={selectedMonth} />}
          </>
        )}

        {activeTab === "myworklist" && (
          <div style={{ background:"#fff", borderRadius:16, padding:"20px", border:"1px solid #e2e8f0", boxShadow:"0 2px 8px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📋</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>My Worklist</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>Your assigned tasks</div>
              </div>
            </div>
            <MyWorklist />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

