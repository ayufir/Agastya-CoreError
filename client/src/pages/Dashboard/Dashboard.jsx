import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Select } from "antd";
import CountUp from "react-countup";
import { DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Pending from "./Pending";
import QueryRaised from "./Admin/QueryRaised";
import AssignedCase from "./Admin/AssignedCase";
import MyWorklist from "./MyWorklist";
import FinalSubmittedCase from "./Admin/FinalSubmittedCase";
import CancelledCases from "./Admin/CancelledCases";
import OutOfTATCase from "./Admin/OutOfTatCase";
import SummaryCard from "./Admin/SummaryCard";
import { fetchFieldOfficers } from "../../redux/features/auth/authThunks";
import { fetchNotifications } from "../../redux/features/notification/notificationThunk";
import axiosInstance from "../../config/axios";
import socket from "../../config/socket";
import { getDisplayCustomerName } from "../../utils/dashboardRecord";

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
      ]) || "",
  };
};

const getRowStyle = (status, createdAt) => {
  const s = normalizeStatus(status);

  if (s.includes("final") || s.includes("done")) {
    return { backgroundColor: "#dcfce7", className: "" };
  }

  if (
    s.includes("working") ||
    s.includes("assigned") ||
    s.includes("progress") ||
    (s.includes("submitted") && !s.includes("final"))
  ) {
    return { backgroundColor: "#fef9c3", className: "" };
  }

  if (s.includes("pending")) {
    let isOld = false;
    if (createdAt) {
      const hours = (new Date() - new Date(createdAt)) / (1000 * 60 * 60);
      if (hours > 48) isOld = true;
    }

    return {
      backgroundColor: isOld ? "#fee2e2" : "#fff7ed",
      className: isOld ? "blink-row" : "",
    };
  }

  if (s.includes("query")) return { backgroundColor: "#ffe4e6", className: "" };

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

const getBankStats = (data) => {
  const map = {};

  data.forEach((item) => {
    const bank = item.bankName || "N/A";

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

  const rowsPerPage = 10;

  // Redirect non-admin roles away from the main dashboard
  useEffect(() => {
    if (!user) return;
    if (user.role === "FieldOfficer") {
      navigate("/field/dashboard", { replace: true });
    } else if (user.role === "Coordinator") {
      navigate("/coordinator/dashboard", { replace: true });
    } else if (user.role === "TechnicalManager") {
      navigate("/tm/dashboard", { replace: true });
    } else if (user.role === "RegionalManager") {
      navigate("/rtm/dashboard", { replace: true });
    } else if (user.role === "Accountant") {
      navigate("/accountant/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);

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
      data = data.filter((item) => item.bankName === selectedBankView);
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
      data = data.filter((item) =>
        [
          item.bankName,
          item.customerName,
          item.city,
          item.engineer,
          item.status,
          item.remark,
        ]
          .join(" ")
          .toLowerCase()
          .includes(debouncedSearch)
      );
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
        return s.includes("pending");
      }).length,

      working: filteredCases.filter((item) => {
        const s = normalizeStatus(item.status);
        return (
          s.includes("working") ||
          s.includes("assigned") ||
          s.includes("progress") ||
          s.includes("visited") ||
          s.includes("reported") ||
          s.includes("reviewed") ||
          (s.includes("submitted") && !s.includes("final"))
        );
      }).length,

      finalSubmitted: filteredCases.filter((item) => {
        const s = normalizeStatus(item.status);
        return (
          s.includes("final") ||
          s.includes("done")
        );
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
    () => [
      {
        title: "To Be Assigned / File Generated",
        total: cardCounts.pending,
        component: "Pending",
      },
      {
        title: "Total Assigned / Work in Progress",
        total: cardCounts.working,
        component: "Assigned",
      },
      {
        title: "Total Submission",
        total: cardCounts.finalSubmitted,
        component: "ReportSubmitted",
      },
      {
        title: "Query Raised",
        total: cardCounts.query,
        component: "QueryRaised",
      },
      {
        title: "Cancel Cases",
        total: cardCounts.cancelled,
        component: "CancelCases",
      },
      {
        title: "Out Tat Cases",
        total: cardCounts.outOfTat,
        component: "Out_Tat_Cases",
      },
      {
        title: "All Cases",
        total: cardCounts.allCases,
        component: "Summary",
      },
    ],
    [cardCounts]
  );

  const bankSummary = useMemo(() => getBankStats(filteredCases), [filteredCases]);

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
  const CARD_META = [
    { icon: "📂", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
    { icon: "⚙️", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
    { icon: "✅", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
    { icon: "❓", color: "#ef4444", bg: "#fff1f2", border: "#fecdd3" },
    { icon: "🚫", color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
    { icon: "⏱️", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    { icon: "📊", color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  ];

  return (
    <div style={{ background: "#f4f6fb", padding: "0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .dash-root * { font-family: 'Inter', sans-serif; }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:.35;} }
        .blink-row { animation: blink 1.2s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Tab strip inside dashboard */
        .dash-tab-strip {
          display:flex; gap:4px; padding:0 16px;
          border-bottom:2px solid #e2e8f0;
          background:#fff;
          margin-bottom:0;
        }
        .dash-tab {
          display:inline-flex; align-items:center; gap:7px;
          padding:11px 16px; border-radius:10px 10px 0 0;
          font-weight:600; font-size:13px; cursor:pointer; border:none;
          background:transparent; color:#64748b; transition:all .2s ease;
          border-bottom:3px solid transparent; white-space:nowrap;
          font-family:'Inter',sans-serif;
        }
        .dash-tab:hover { color:#1e293b; background:#f8fafc; }
        .dash-tab.active { color:#B5121B; border-bottom:3px solid #B5121B; background:#fff; }

        /* Stat cards */
        .stat-cards-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(160px,1fr));
          gap:12px; margin-bottom:20px;
        }
        .stat-card {
          border-radius:14px; padding:16px 16px 14px; cursor:pointer;
          transition:all .22s ease; position:relative; overflow:hidden;
          border:2px solid transparent; box-shadow:0 2px 8px rgba(0,0,0,.05);
        }
        .stat-card:hover { transform:translateY(-3px); box-shadow:0 12px 28px rgba(0,0,0,.10); }
        .stat-card.selected { border-width:2px; box-shadow:0 8px 24px rgba(0,0,0,.12); }
        .stat-card-icon { width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; font-size:17px; margin-bottom:10px; }
        .stat-card-title { font-size:9.5px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; color:#64748b; margin-bottom:7px; line-height:1.4; }
        .stat-card-value { font-size:28px; font-weight:800; letter-spacing:-1px; }

        .bst th { font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#64748b; background:#f8fafc; padding:11px 14px; border-bottom:1px solid #e2e8f0; white-space:nowrap; }
        .bst td { padding:11px 14px; border-bottom:1px solid #f1f5f9; font-size:13px; color:#374151; vertical-align:middle; }
        .bst tbody tr { transition:background .15s; cursor:pointer; }
        .bst tbody tr:hover { background:#f8fafc; }
        .bst tbody tr:last-child td { border-bottom:none; }

        .bank-mob-card {
          background:#fff; border-radius:12px; padding:13px 14px;
          border:1px solid #e2e8f0; box-shadow:0 2px 6px rgba(0,0,0,.05);
          cursor:pointer; transition:all .2s; margin-bottom:8px; display:none;
        }
        .bank-mob-card:hover { box-shadow:0 6px 18px rgba(0,0,0,.10); border-color:#6366f1; }

        .status-badge { display:inline-block; padding:2px 9px; border-radius:999px; font-size:10.5px; font-weight:600; letter-spacing:.3px; }

        .filter-bar { background:#fff; border-radius:14px; padding:12px 14px; border:1px solid #e2e8f0; box-shadow:0 2px 6px rgba(0,0,0,.04); margin-bottom:16px; }
        .filter-row { display:flex; flex-wrap:wrap; gap:10px; align-items:flex-end; }
        .filter-label { font-size:9.5px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.6px; margin-bottom:5px; }
        .filter-input { height:36px; padding:0 11px; border:1.5px solid #e2e8f0; border-radius:9px; font-size:13px; font-weight:500; color:#374151; outline:none; transition:border .2s; font-family:'Inter',sans-serif; background:#f8fafc; box-sizing:border-box; }
        .filter-input:focus { border-color:#6366f1; background:#fff; }

        .pag-btn { height:32px; padding:0 13px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:12px; font-weight:600; color:#475569; background:#fff; cursor:pointer; transition:all .18s; }
        .pag-btn:hover:not(:disabled) { border-color:#6366f1; color:#6366f1; }
        .pag-btn:disabled { opacity:.45; cursor:not-allowed; }

        .dash-content { padding:0; }
        .dash-inner { padding:16px 20px 32px; }

        @media (max-width: 768px) {
          .dash-inner { padding:12px 10px 80px; }
          .stat-cards-grid { grid-template-columns:1fr 1fr !important; gap:8px !important; margin-bottom:12px !important; }
          .stat-card { padding:12px 12px 10px !important; border-radius:12px !important; }
          .stat-card-icon { width:32px !important; height:32px !important; font-size:15px !important; margin-bottom:7px !important; }
          .stat-card-title { font-size:8.5px !important; }
          .stat-card-value { font-size:22px !important; }
          .filter-row { flex-direction:column !important; gap:8px !important; }
          .filter-row > div { width:100% !important; }
          .bst-wrap { display:none !important; }
          .bank-mob-card { display:block !important; }
          .pag-row { flex-direction:column !important; gap:8px !important; align-items:flex-start !important; }
          .mob-total { text-align:left !important; margin-left:0 !important; }
          .bank-header-hint { display:none !important; }
        }
        @media (max-width: 400px) {
          .stat-card-value { font-size:19px !important; }
          .dash-tab { padding:9px 12px !important; font-size:12px !important; }
        }
      `}</style>

      {/* TAB STRIP (inside content, no sticky/fixed, works with existing Header) */}
      <div className="dash-tab-strip">
        <button className={`dash-tab ${activeTab==="dashboard"?"active":""}`} onClick={() => { setActiveTab("dashboard"); setActiveComponent(""); clearBankView(); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
          Dashboard
        </button>
        <button className={`dash-tab ${activeTab==="myworklist"?"active":""}`} onClick={() => { setActiveTab("myworklist"); setActiveComponent(""); clearBankView(); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
          My Worklist
        </button>
      </div>

      {/* CONTENT */}
      <div className="dash-content dash-root"><div className="dash-inner">

        {activeTab === "dashboard" && (
          <>
            {/* Filter Bar */}
            {!selectedBankView && (
              <div className="filter-bar" style={{ marginBottom:14 }}>
                {/* Row 1: Month + Total Cases (side by side always) */}
                <div style={{ display:"flex", alignItems:"flex-end", gap:10, marginBottom:10 }}>
                  <div style={{ flex:"0 0 auto" }}>
                    <div className="filter-label">Month</div>
                    <input type="month" value={selectedMonth}
                      onChange={e => { setSelectedMonth(e.target.value); setActiveComponent(""); clearBankView(); }}
                      className="filter-input" style={{ width:150 }} />
                  </div>
                  {/* Total Cases — always on same line as Month */}
                  <div style={{ marginLeft:"auto", textAlign:"right", flex:"0 0 auto" }}>
                    <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:".5px", textTransform:"uppercase", marginBottom:2 }}>Total Cases</div>
                    <div style={{ fontSize:24, fontWeight:800, color:"#1e293b", letterSpacing:"-1px", lineHeight:1 }}>
                      <CountUp end={cardCounts.allCases} duration={1.2} separator="," />
                    </div>
                  </div>
                </div>
                {/* Row 2: Field Officer — full width */}
                <div style={{ width:"100%" }}>
                  <div className="filter-label">Field Officer</div>
                  <Select value={selectedAgent} onChange={setSelectedAgent} style={{ width:"100%" }} size="middle">
                    <Option value="All Agents">All Agents</Option>
                    {fieldOfficers?.map(fo => <Option key={fo._id} value={fo.name}>{fo.name}</Option>)}
                  </Select>
                </div>
              </div>
            )}


            {/* Stat Cards */}
            {!selectedBankView && (
              <div className="stat-cards-grid">
                {reports.map((r, i) => {
                  const m = CARD_META[i] || CARD_META[0];
                  const isActive = activeComponent === r.component;
                  return (
                    <div key={i} className={`stat-card ${isActive?"selected":""}`}
                      style={{ background:m.bg, borderColor:isActive?m.color:m.border, boxShadow:isActive?`0 8px 24px ${m.color}28`:"0 2px 8px rgba(0,0,0,.05)" }}
                      onClick={() => setActiveComponent(r.component)}>
                      <div className="stat-card-icon" style={{ background:`${m.color}18` }}>{m.icon}</div>
                      <div className="stat-card-title">{r.title}</div>
                      <div className="stat-card-value" style={{ color:m.color }}>
                        <CountUp end={Number(r.total)||0} duration={1.2} separator="," />
                      </div>
                      {isActive && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:m.color, borderRadius:"0 0 16px 16px" }} />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bank Summary */}
            {!activeComponent && !selectedBankView && (
              <div style={{ background:"#fff", borderRadius:20, border:"1px solid #e2e8f0", overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,.06)", marginBottom:24 }}>
                <div style={{ padding:"16px 20px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏦</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>Bank Summary</div>
                      <div style={{ fontSize:12, color:"#94a3b8", fontWeight:500 }}>{bankSummary.length} banks · tap to drill down</div>
                    </div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:600, color:"#64748b", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, padding:"4px 10px" }}>Tap a row →</span>
                </div>

                {/* Desktop table */}
                <div className="bst-wrap" style={{ overflowX:"auto" }}>
                  <table className="bst" style={{ minWidth:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign:"left" }}>Bank</th>
                        <th style={{ textAlign:"center" }}>Total</th>
                        <th style={{ textAlign:"center", color:"#10b981" }}>Done</th>
                        <th style={{ textAlign:"center", color:"#f59e0b" }}>Pending</th>
                        <th style={{ textAlign:"center", color:"#ef4444" }}>Query</th>
                        <th style={{ textAlign:"center", color:"#6366f1" }}>Working</th>
                        <th>Completion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="7" style={{ textAlign:"center", padding:"40px", color:"#94a3b8" }}>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                            <div style={{ width:20, height:20, border:"2.5px solid #e2e8f0", borderTopColor:"#6366f1", borderRadius:"50%", animation:"spin .7s linear infinite" }} />Loading...
                          </div>
                        </td></tr>
                      ) : bankSummary.length === 0 ? (
                        <tr><td colSpan="7" style={{ textAlign:"center", padding:"48px", color:"#94a3b8" }}>
                          <div style={{ fontSize:32, marginBottom:8 }}>🏦</div><div style={{ fontWeight:600 }}>No data for this period</div>
                        </td></tr>
                      ) : paginatedBankSummary.map(bank => {
                        const rate = bank.total ? Math.round((bank.done/bank.total)*100) : 0;
                        return (
                          <tr key={bank.bank} onClick={() => setSelectedBankView(bank.bank)}>
                            <td>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <div style={{ width:8, height:8, borderRadius:"50%", background:rate>70?"#10b981":rate>40?"#f59e0b":"#ef4444", flexShrink:0 }} />
                                <span style={{ fontWeight:600, color:"#1e293b", fontSize:14 }}>{bank.bank}</span>
                              </div>
                            </td>
                            <td style={{ textAlign:"center" }}><span style={{ fontWeight:700, color:"#1e293b" }}>{bank.total}</span></td>
                            <td style={{ textAlign:"center" }}><span className="status-badge" style={{ background:"#ecfdf5", color:"#059669" }}>{bank.done}</span></td>
                            <td style={{ textAlign:"center" }}><span className="status-badge" style={{ background:"#fffbeb", color:"#d97706" }}>{bank.pending}</span></td>
                            <td style={{ textAlign:"center" }}><span className="status-badge" style={{ background:"#fff1f2", color:"#e11d48" }}>{bank.query}</span></td>
                            <td style={{ textAlign:"center" }}><span className="status-badge" style={{ background:"#eef2ff", color:"#6366f1" }}>{bank.working}</span></td>
                            <td>
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <span style={{ fontWeight:700, fontSize:13, color:rate>70?"#059669":rate>40?"#d97706":"#dc2626", minWidth:34 }}>{rate}%</span>
                                <div style={{ flex:1, maxWidth:100, height:6, background:"#f1f5f9", borderRadius:999, overflow:"hidden" }}>
                                  <div style={{ height:"100%", width:`${rate}%`, borderRadius:999, background:rate>70?"linear-gradient(90deg,#10b981,#34d399)":rate>40?"linear-gradient(90deg,#f59e0b,#fbbf24)":"linear-gradient(90deg,#ef4444,#f87171)", transition:"width .4s ease" }} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile bank cards */}
                <div style={{ padding:"10px 12px 4px" }}>
                  {loading ? (
                    <div style={{ textAlign:"center", padding:"32px", color:"#94a3b8" }}>Loading...</div>
                  ) : bankSummary.length === 0 ? null : paginatedBankSummary.map(bank => {
                    const rate = bank.total ? Math.round((bank.done/bank.total)*100) : 0;
                    return (
                      <div key={bank.bank} className="bank-mob-card" onClick={() => setSelectedBankView(bank.bank)}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <div style={{ width:8, height:8, borderRadius:"50%", background:rate>70?"#10b981":rate>40?"#f59e0b":"#ef4444" }} />
                            <span style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>{bank.bank}</span>
                          </div>
                          <span style={{ fontSize:13, fontWeight:700, color:rate>70?"#059669":rate>40?"#d97706":"#dc2626" }}>{rate}%</span>
                        </div>
                        <div style={{ height:5, background:"#f1f5f9", borderRadius:999, overflow:"hidden", marginBottom:12 }}>
                          <div style={{ height:"100%", width:`${rate}%`, borderRadius:999, background:rate>70?"linear-gradient(90deg,#10b981,#34d399)":rate>40?"linear-gradient(90deg,#f59e0b,#fbbf24)":"linear-gradient(90deg,#ef4444,#f87171)" }} />
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, textAlign:"center" }}>
                          {[{label:"Total",val:bank.total,bg:"#f8fafc",color:"#1e293b"},{label:"Done",val:bank.done,bg:"#ecfdf5",color:"#059669"},{label:"Pending",val:bank.pending,bg:"#fffbeb",color:"#d97706"},{label:"Query",val:bank.query,bg:"#fff1f2",color:"#e11d48"}].map(s=>(
                            <div key={s.label} style={{ background:s.bg, borderRadius:8, padding:"6px 4px" }}>
                              <div style={{ fontSize:16, fontWeight:800, color:s.color }}>{s.val}</div>
                              <div style={{ fontSize:9, fontWeight:600, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".5px" }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pag-row" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 20px", borderTop:"1px solid #f1f5f9", background:"#fafbfc" }}>
                  <span style={{ fontSize:12, color:"#64748b", fontWeight:500 }}>
                    <b style={{ color:"#1e293b" }}>{Math.min((bankSummaryPage-1)*rowsPerPage+1,bankSummary.length)}–{Math.min(bankSummaryPage*rowsPerPage,bankSummary.length)}</b> of <b style={{ color:"#1e293b" }}>{bankSummary.length}</b> banks
                  </span>
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="pag-btn" disabled={bankSummaryPage<=1} onClick={() => setBankSummaryPage(p=>Math.max(1,p-1))}>← Prev</button>
                    <button className="pag-btn" disabled={bankSummaryPage>=bankSummaryTotalPages} onClick={() => setBankSummaryPage(p=>Math.min(bankSummaryTotalPages,p+1))}>Next →</button>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Drilldown */}
            {!activeComponent && selectedBankView && (
              <div style={{ background:"#fff", borderRadius:20, border:"1px solid #e2e8f0", overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,.06)" }}>
                <div style={{ padding:"14px 16px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <button onClick={clearBankView} style={{ width:36, height:36, borderRadius:10, border:"1.5px solid #e2e8f0", background:"#f8fafc", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>←</button>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>🏦 {selectedBankView}</div>
                      <div style={{ fontSize:11, color:"#94a3b8" }}>{filteredCases.length} cases</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, flex:1, justifyContent:"flex-end" }}>
                    <input type="text" placeholder="Search..." value={searchText} onChange={e => setSearchText(e.target.value)}
                      className="filter-input" style={{ width:150, flex:"0 0 auto" }} />
                    <Select mode="multiple" placeholder="Status" style={{ minWidth:120 }} value={selectedStatuses} onChange={setSelectedStatuses} allowClear size="middle">
                      {statusOptions.map(s => <Option key={s} value={s}>{s}</Option>)}
                    </Select>
                    <Select mode="multiple" placeholder="Engineers" style={{ minWidth:140 }} value={selectedEngineers} onChange={setSelectedEngineers} allowClear size="middle">
                      {engineerOptions.map(e => <Option key={e} value={e}>{e}</Option>)}
                    </Select>
                    <button onClick={resetFilters} style={{ height:32, padding:"0 12px", borderRadius:8, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:12, fontWeight:600, color:"#64748b", cursor:"pointer" }}>Reset</button>
                  </div>
                </div>

                <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
                  <table className="bst" style={{ minWidth:580, borderCollapse:"collapse", width:"100%" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign:"center", width:36 }}>#</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>City</th>
                        <th>Engineer</th>
                        <th>Status</th>
                        <th>Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="7" style={{ textAlign:"center", padding:40, color:"#94a3b8" }}>Loading...</td></tr>
                      ) : paginatedBankCases.length === 0 ? (
                        <tr><td colSpan="7" style={{ textAlign:"center", padding:48, color:"#94a3b8" }}>No data found</td></tr>
                      ) : paginatedBankCases.map((rec, idx) => {
                        const row = getRowStyle(rec.status, rec.createdAt);
                        let bank;
                        switch (selectedBankView) {
                          case "Home First": bank="home-first"; break;
                          case "Home First Trench": bank="home-first-trench"; break;
                          case "Aditya Bank": bank="aditya-birla"; break;
                          case "Manappuram Bank": bank="manappuram"; break;
                          case "ICICI Bank": bank="icici"; break;
                          default: bank="bajaj";
                        }
                        const s = normalizeStatus(rec.status);
                        const badge = s.includes("final") || s.includes("done") ? { background:"#ecfdf5", color:"#059669" }
                          : s.includes("query") ? { background:"#fff1f2", color:"#e11d48" }
                          : s.includes("working")||s.includes("assigned")||s.includes("progress")||(s.includes("submitted") && !s.includes("final")) ? { background:"#eef2ff", color:"#6366f1" }
                          : { background:"#fffbeb", color:"#d97706" };
                        return (
                          <tr key={rec.key} className={row.className} style={{ backgroundColor:row.backgroundColor }}>
                            <td style={{ textAlign:"center", color:"#94a3b8", fontSize:12 }}>{(bankCasesPage-1)*rowsPerPage+idx+1}</td>
                            <td style={{ whiteSpace:"nowrap", color:"#64748b", fontSize:12 }}>{formatDateTime(rec.createdAt)}</td>
                            <td style={{ fontWeight:600, color:"#1e293b", fontSize:13 }}>{rec.customerName}</td>
                            <td style={{ color:"#64748b", fontSize:13 }}>{rec.city}</td>
                            <td><Link to={`/bank/${bank}/${rec?.key}`} style={{ color:"#6366f1", fontWeight:600, textDecoration:"none", fontSize:13 }}>{rec.engineer}</Link></td>
                            <td><span className="status-badge" style={badge}>{rec.status}</span></td>
                            <td style={{ color:"#64748b", fontSize:12, maxWidth:150, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{rec.remark||"—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="pag-row" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderTop:"1px solid #f1f5f9", background:"#fafbfc" }}>
                  <span style={{ fontSize:12, color:"#64748b", fontWeight:500 }}>
                    <b style={{ color:"#1e293b" }}>{Math.min((bankCasesPage-1)*rowsPerPage+1,filteredCases.length)}–{Math.min(bankCasesPage*rowsPerPage,filteredCases.length)}</b> of <b style={{ color:"#1e293b" }}>{filteredCases.length}</b>
                  </span>
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="pag-btn" disabled={bankCasesPage<=1} onClick={() => setBankCasesPage(p=>Math.max(1,p-1))}>← Prev</button>
                    <button className="pag-btn" disabled={bankCasesPage>=bankCasesTotalPages} onClick={() => setBankCasesPage(p=>Math.min(bankCasesTotalPages,p+1))}>Next →</button>
                  </div>
                </div>
              </div>
            )}

            {activeComponent==="Pending"         && <Pending selectedMonth={selectedMonth} />}
            {activeComponent==="Assigned"        && <AssignedCase selectedMonth={selectedMonth} />}
            {activeComponent==="QueryRaised"     && <QueryRaised selectedMonth={selectedMonth} />}
            {activeComponent==="ReportSubmitted" && <FinalSubmittedCase selectedMonth={selectedMonth} />}
            {activeComponent==="CancelCases"     && <CancelledCases selectedMonth={selectedMonth} />}
            {activeComponent==="Out_Tat_Cases"   && <OutOfTATCase selectedMonth={selectedMonth} />}
            {activeComponent==="Summary"         && <SummaryCard selectedMonth={selectedMonth} />}
          </>
        )}

        {activeTab === "myworklist" && (
          <div style={{ background:"#fff", borderRadius:16, padding:"18px", border:"1px solid #e2e8f0", boxShadow:"0 4px 16px rgba(0,0,0,.06)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📋</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>My Worklist</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>Your assigned tasks</div>
              </div>
            </div>
            <MyWorklist />
          </div>
        )}
      </div></div>
    </div>
  );
};

export default Dashboard;
