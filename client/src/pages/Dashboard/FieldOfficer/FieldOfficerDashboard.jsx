import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptCaseById,
  declineCaseById,
  fetchCases,
} from "../../../redux/features/case/caseThunks";
import { allCaseUserById } from "../../../redux/features/Note/notesSlice";
import { Spin, Table, Button, Modal, Input, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CaseNotes from "../../../components/CaseNotes";
import dayjs from "dayjs";
import { 
  CheckCheck, 
  Eye, 
  FileText, 
  Download, 
  Briefcase, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search as SearchIcon, 
  Phone, 
  MapPin, 
  X, 
  Check, 
  ArrowRight, 
  Calendar, 
  AlertCircle,
  Copy,
  FileSpreadsheet
} from "lucide-react";
import {
  getBankRoute,
  getDisplayAddress,
  getDisplayContact,
  getDisplayCustomerName,
  getDisplayCity,
} from "../../../utils/dashboardRecord";
import socket from "../../../config/socket";
import axiosInstance from "../../../config/axios";
import getBankTagColor from "../getBankTagColor";

const STATUS_TYPES = [
  { title: "New Cases", value: "NEW_CASES", icon: PlusCircle, color: "#2563eb", bg: "rgba(37, 99, 235, 0.05)", border: "#d0e6df" },
  { title: "Pending", value: "PENDING", icon: Clock, color: "#ca8a04", bg: "rgba(202, 138, 4, 0.05)", border: "#d0e6df" },
  { title: "Query Raised", value: "QUERY_RAISED", icon: AlertTriangle, color: "#dc2626", bg: "rgba(220, 38, 38, 0.05)", border: "#d0e6df" },
  { title: "Completed", value: "COMPLETED", icon: CheckCircle2, color: "#16a34a", bg: "rgba(22, 163, 74, 0.05)", border: "#d0e6df" },
  { title: "Total Assigned", value: "TOTAL_ASSIGNED", icon: Briefcase, color: "#0d9488", bg: "rgba(13, 148, 136, 0.05)", border: "#d0e6df" },
];

const formatShortDate = (dateString) => {
  if (!dateString) return "N/A";
  return dayjs(dateString).format("DD MMM YYYY");
};

// ─── Allowance Sheet export helpers ─────────────────────────────────────────

const stripHtml = (html) => {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, "").trim();
};

/**
 * Build a flat row object from a case record for the Allowance Sheet.
 * Columns: Bank | Customer Name | Assign Date | Visit Date | Submitted Date
 *          | Property Address | City | Latitude | Longitude | Distance (km)
 */
const buildAllowanceRow = (record) => ({
  "Bank": record.bankName || "N/A",
  "Customer Name": getDisplayCustomerName(record),
  "Assign Date": record.createdAt ? dayjs(record.createdAt).format("DD/MM/YYYY") : "N/A",
  "Visit Date": record.dateOfVisit || (record.updatedAt ? dayjs(record.updatedAt).format("DD/MM/YYYY") : "N/A"),
  "Submitted Date": record.isReportSubmitted && record.updatedAt
    ? dayjs(record.updatedAt).format("DD/MM/YYYY")
    : "N/A",
  "Property Address": getDisplayAddress(record),
  "City": getDisplayCity(record),
  "Latitude": record.latitude || "N/A",
  "Longitude": record.longitude || "N/A",
  "Distance (km)": record.distance || record.distanceFromCityCentre || "",
  "If Any (Others)": record.othersIfAny || record.others || "",
});

/** Export array of case records (or pre-built row objects) to a .csv file */
const exportAllowanceCSV = (cases, filename = "allowance_sheet.csv", isPrebuilt = false) => {
  if (!cases || cases.length === 0) { return; }
  const rows = isPrebuilt ? cases : cases.map(buildAllowanceRow);
  const headers = Object.keys(rows[0]);
  const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const csvContent = [
    headers.map(escape).join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/** Export array of case records (or pre-built row objects) to a .xlsx file using SheetJS (CDN) */
const exportAllowanceExcel = async (cases, filename = "allowance_sheet.xlsx", isPrebuilt = false) => {
  if (!cases || cases.length === 0) { return; }
  // Dynamically load xlsx from CDN if not already available
  if (!window.XLSX) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js";
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  const XLSX = window.XLSX;
  const rows = isPrebuilt ? cases : cases.map(buildAllowanceRow);
  const ws = XLSX.utils.json_to_sheet(rows);
  // Column widths
  ws["!cols"] = [
    { wch: 20 }, { wch: 26 }, { wch: 14 }, { wch: 14 },
    { wch: 16 }, { wch: 40 }, { wch: 14 }, { wch: 14 },
    { wch: 14 }, { wch: 14 }, { wch: 20 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Allowance Sheet");
  XLSX.writeFile(wb, filename);
};


const FieldOfficerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cases, loading } = useSelector((state) => state.case) || {};
  const foCases = cases;
  const { allCase } = useSelector((state) => state?.notes || {});

  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("TOTAL_ASSIGNED");
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedCaseDocs, setSelectedCaseDocs] = useState([]);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Month filter — default to current month, clear to see all months
  const getCurrentMonthValue = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());

  // Apply month filter on top of all FO cases
  const monthFilteredFoCases = useMemo(() => {
    const all = foCases || [];
    if (!selectedMonth) return all;
    return all.filter((c) => {
      const dateStr = c.createdAt || c.uploadDate || c.createdDate || c.submissionDate || "";
      if (!dateStr) return false;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return false;
      const yyyyMm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return yyyyMm === selectedMonth;
    });
  }, [foCases, selectedMonth]);

  // Deny reason modal state
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const [denyTargetCase, setDenyTargetCase] = useState(null); // { id, bankName }
  const [denyReason, setDenyReason] = useState("");
  const [isDenyLoading, setIsDenyLoading] = useState(false);

  // Default Rate Per KM from settings
  const [defaultRate, setDefaultRate] = useState(3.50);
  useEffect(() => {
    const fetchDefaultRate = async () => {
      try {
        const { data } = await axiosInstance.get("/settings");
        if (data && data.ratePerKm !== undefined) {
          setDefaultRate(Number(data.ratePerKm));
        }
      } catch (err) {
        console.error("Error loading default rate:", err);
      }
    };
    fetchDefaultRate();
  }, []);

  // Save timeout ref for debouncing
  const saveTimeoutRef = useRef({});

  const debouncedSaveAllowance = (id, bankName, distance, othersIfAny, rate) => {
    if (saveTimeoutRef.current[id]) {
      clearTimeout(saveTimeoutRef.current[id]);
    }
    saveTimeoutRef.current[id] = setTimeout(async () => {
      const d = Math.max(0, parseFloat(distance) || 0);
      const o = Math.max(0, parseFloat(othersIfAny) || 0);
      const r = Math.max(0, parseFloat(rate) || 0);
      const total = parseFloat((d * r + o).toFixed(2));

      try {
        await axiosInstance.put(`/case/allowance/${id}`, {
          distance: distance,
          othersIfAny: othersIfAny,
          ratePerKm: r,
          totalAllowance: total,
          bankName,
        });
      } catch (err) {
        console.error("Failed to auto-save allowance:", err);
      }
    }, 800);
  };

  // Allowance Sheet — inline editable fields per row (keyed by record._id)
  const [allowanceEdits, setAllowanceEdits] = useState({});
  const updateAllowanceEdit = (id, bankName, field, value) => {
    setAllowanceEdits((prev) => {
      const updatedRow = {
        ...prev[id],
        [field]: value,
      };

      if (field === "distance" || field === "othersIfAny") {
        const numVal = parseFloat(value);
        if (numVal < 0) {
          updatedRow[field] = "0";
        }
      }

      // Fetch case record to check current values and get rate
      const caseItem = monthFilteredFoCases.find((c) => c._id === id);
      const curDistance = field === "distance" ? value : (updatedRow.distance !== undefined ? updatedRow.distance : (caseItem?.distance || caseItem?.distanceFromCityCentre || ""));
      const curOthers = field === "othersIfAny" ? value : (updatedRow.othersIfAny !== undefined ? updatedRow.othersIfAny : (caseItem?.othersIfAny || caseItem?.others || ""));
      const curRate = caseItem?.ratePerKm || defaultRate;

      debouncedSaveAllowance(id, bankName, curDistance, curOthers, curRate);

      return {
        ...prev,
        [id]: updatedRow,
      };
    });
  };

  // Build a row merging DB data with any user edits
  const buildAllowanceRowWithEdits = (record) => {
    const base = buildAllowanceRow(record);
    const edits = allowanceEdits[record._id] || {};
    
    const distanceStr = edits.distance !== undefined ? edits.distance : (record.distance || record.distanceFromCityCentre || "");
    const othersStr = edits.othersIfAny !== undefined ? edits.othersIfAny : (record.othersIfAny || record.others || "");
    const rateNum = record.ratePerKm || defaultRate;

    const dVal = Math.max(0, parseFloat(distanceStr) || 0);
    const oVal = Math.max(0, parseFloat(othersStr) || 0);
    const totalVal = (dVal * rateNum) + oVal;

    return {
      ...base,
      "Distance (km)": distanceStr,
      "If Any (Others)": othersStr,
      "Total (₹)": totalVal.toFixed(2),
    };
  };

  const downloadFile = async (url, fileName) => {
    try {
      const downloadUrl = url.includes("imagekit.io")
        ? `${url}${url.includes("?") ? "&" : "?"}ik-attachment=true`
        : url;
      
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("Network response was not ok");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn("Blob download failed, falling back to direct link:", err);
      const fallbackUrl = url.includes("imagekit.io")
        ? `${url}${url.includes("?") ? "&" : "?"}ik-attachment=true`
        : url;
      window.open(fallbackUrl, "_blank");
    }
  };

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCases(user._id));
      dispatch(allCaseUserById());
    }
  }, [dispatch, user?._id]);

  const [caseMap, setCaseMap] = useState({});
  const [caseLoading, setCaseLoading] = useState(false);

  // Real-time update subscription for Field Officer dashboard
  useEffect(() => {
    const handleNewNotification = () => {
      if (user?._id) {
        dispatch(fetchCases(user._id));
        dispatch(allCaseUserById());
      }
    };
    socket.on("newNotification", handleNewNotification);
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [dispatch, user?._id]);

  // Load details for query notes
  useEffect(() => {
    const fetchQueryCaseDetails = async () => {
      if (!allCase || allCase.length === 0) return;
      try {
        setCaseLoading(true);
        const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
        const caseIds = [...new Set(allCase.map((note) => note.caseId).filter(Boolean))];
        const validCaseIds = caseIds.filter(isValidObjectId);

        const caseResponses = await Promise.all(
          validCaseIds.map((id) => axiosInstance.get(`/case/${id}`))
        );

        const caseDataMap = {};
        caseResponses.forEach((res, idx) => {
          caseDataMap[validCaseIds[idx]] = res.data;
        });
        setCaseMap(caseDataMap);
      } catch (error) {
        console.error("Error fetching query case details:", error.message);
      } finally {
        setCaseLoading(false);
      }
    };

    fetchQueryCaseDetails();
  }, [allCase]);

  const bankOptions = useMemo(() => {
    return [...new Set(monthFilteredFoCases?.map((caseItem) => caseItem.bankName).filter(Boolean))];
  }, [monthFilteredFoCases]);

  const handleAccept = async (id, bankName) => {
    try {
      await dispatch(acceptCaseById({ id, bankName })).unwrap();
      toast.success("Case accepted successfully");
      navigate(0);
    } catch (err) {
      console.log(err);
      toast.error("Failed to accept case");
    }
  };

  const handleDecline = async (id, bankName, reason) => {
    try {
      await dispatch(declineCaseById({ id, bankName, declineReason: reason })).unwrap();
      toast.success("Case declined successfully");
      navigate(0);
    } catch (err) {
      console.log(err);
      toast.error("Failed to decline case");
    }
  };

  // Opens the Deny Reason modal instead of directly declining
  const openDenyModal = (id, bankName) => {
    setDenyTargetCase({ id, bankName });
    setDenyReason("");
    setIsDenyModalOpen(true);
  };

  // Called when officer confirms the denial with a reason
  const confirmDeny = async () => {
    if (!denyReason.trim()) {
      toast.error("Please provide a reason before denying.");
      return;
    }
    setIsDenyLoading(true);
    try {
      await handleDecline(denyTargetCase.id, denyTargetCase.bankName, denyReason.trim());
      setIsDenyModalOpen(false);
    } finally {
      setIsDenyLoading(false);
    }
  };

  const isToday = (dateString) => {
    return dayjs(dateString).isSame(dayjs(), "day");
  };

  const getCaseStatus = (caseId) => {
    const caseInFo = foCases?.find((c) => c._id === caseId);
    if (caseInFo) return caseInFo.status;
    return caseMap[caseId]?.status;
  };

  const filterCases = () => {
    let filtered = monthFilteredFoCases || [];

    if (selectedStatus !== "TOTAL_ASSIGNED") {
      if (selectedStatus === "QUERY_RAISED") {
        // For query-raised, filter notes whose case is in the month-filtered set and deduplicate by caseId
        const monthCaseIds = new Set((monthFilteredFoCases || []).map((c) => String(c._id)));
        const rawNotes = allCase?.filter((c) => {
          if (c.type === "call_not_attended") return false;
          if (selectedMonth && !monthCaseIds.has(String(c.caseId))) return false;
          const status = getCaseStatus(String(c.caseId));
          return String(status || "").toLowerCase().includes("query");
        }) || [];

        const uniqueNotesByCase = [];
        const seenCaseIds = new Set();
        const sortedNotes = [...rawNotes].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        for (const note of sortedNotes) {
          const cId = String(note.caseId);
          if (!seenCaseIds.has(cId)) {
            seenCaseIds.add(cId);
            uniqueNotesByCase.push(note);
          }
        }
        return uniqueNotesByCase;
      }
      if (selectedStatus === "NEW_CASES") {
        filtered = filtered?.filter(
          (caseItem) =>
            (caseItem.approvalStatus === "Pending" || !caseItem.approvalStatus) &&
            caseItem.approvalStatus !== "Declined" &&
            !caseItem.isReportSubmitted &&
            !String(caseItem.status || "").toLowerCase().includes("query")
        );
      } else if (selectedStatus === "PENDING") {
        filtered = filtered?.filter(
          (caseItem) =>
            (caseItem.approvalStatus === "Accepted" || caseItem.approvalStatus === "Work in Progress") &&
            !caseItem.isReportSubmitted &&
            !String(caseItem.status || "").toLowerCase().includes("query")
        );
      } else if (selectedStatus === "COMPLETED") {
        filtered = filtered?.filter(
          (caseItem) =>
            caseItem.isReportSubmitted === true ||
            ["finalsubmitted", "submitted", "done", "approved"].includes(
              String(caseItem.status || "").toLowerCase().trim()
            )
        );
      }
    }

    if (selectedBank) {
      filtered = filtered?.filter(
        (caseItem) => caseItem.bankName === selectedBank
      );
    }

    return filtered;
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const handleCopyAddress = (address) => {
    if (!address || address === "N/A") return;
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
  };

  const filteredCasesList = useMemo(() => {
    const result = filterCases();
    if (!searchText) return result;

    return result?.filter((caseItem) => {
      // For query cases, get base case item
      const item = selectedStatus === "QUERY_RAISED" 
        ? caseMap[caseItem.caseId] 
        : caseItem;
      
      if (!item) return false;

      return [
        item.bankName,
        getDisplayCustomerName(item),
        getDisplayAddress(item),
        getDisplayContact(item),
        caseItem.message // Search query messages if query tab
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [monthFilteredFoCases, searchText, selectedStatus, selectedBank, allCase, caseMap]);

  const sortedCases = useMemo(() => {
    return [...(filteredCasesList || [])].sort((a, b) => {
      const dateA = a.createdAt;
      const dateB = b.createdAt;
      const aIsToday = dateA ? isToday(dateA) : false;
      const bIsToday = dateB ? isToday(dateB) : false;
      if (aIsToday && !bIsToday) return -1;
      if (!aIsToday && bIsToday) return 1;
      return new Date(dateB || 0).getTime() - new Date(dateA || 0).getTime();
    });
  }, [filteredCasesList, selectedStatus]);

  const summaryCounts = useMemo(() => {
    const items = monthFilteredFoCases || [];
    return {
      TOTAL_ASSIGNED: items.length,
      NEW_CASES: items.filter(
        (c) =>
          (c.approvalStatus === "Pending" || !c.approvalStatus) &&
          c.approvalStatus !== "Declined" &&
          !c.isReportSubmitted &&
          !String(c.status || "").toLowerCase().includes("query")
      ).length,
      PENDING: items.filter(
        (c) =>
          (c.approvalStatus === "Accepted" || c.approvalStatus === "Work in Progress") &&
          !c.isReportSubmitted &&
          !String(c.status || "").toLowerCase().includes("query")
      ).length,
      COMPLETED: items.filter(
        (c) =>
          c.isReportSubmitted === true ||
          ["finalsubmitted", "submitted", "done", "approved"].includes(
            String(c.status || "").toLowerCase().trim()
          )
      ).length,
      QUERY_RAISED: items.filter((c) =>
        String(c.status || "").toLowerCase().includes("query")
      ).length,
    };
  }, [monthFilteredFoCases]);

  const handleResolveAndEdit = async (caseId, caseData) => {
    if (!caseId || !caseData) return;
    try {
      await axiosInstance.put("/case/status", {
        caseId,
        status: "Work in Progress",
        note: "Query resolved by Field Officer.",
        bankName: caseData.bankName
      });
      
      toast.success("Query resolved! Redirecting to form...");
      
      if (user?._id) {
        dispatch(fetchCases(user._id));
        dispatch(allCaseUserById());
      }

      // Navigate directly to the bank edit form
      const bankRoute = getBankRoute(caseData);
      if (bankRoute && caseId) {
        navigate(`/bank/${bankRoute}/edit/${caseId}`);
      }
    } catch (err) {
      console.error("Error resolving query:", err.message);
      toast.error("Failed to resolve query");
    }
  };

  const defaultColumns = [
    {
      title: "Bank",
      dataIndex: "bankName",
      key: "bankName",
      render: (bankName) => {
        const color = getBankTagColor(bankName);
        return (
          <Tag color={color} className="font-extrabold border-none rounded-lg px-3 py-1 text-[10px] uppercase tracking-wider shadow-sm">
            {bankName || "N/A"}
          </Tag>
        );
      },
      sorter: (a, b) => (a.bankName || "").localeCompare(b.bankName || ""),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (_, record) => {
        const customerName = getDisplayCustomerName(record);
        const daysElapsed = dayjs().diff(dayjs(record.createdAt), 'day');
        const isDelayed = daysElapsed >= 3 && !record.isReportSubmitted;
        const isPending = record?.approvalStatus === "Pending";
        const isCreatedByMe =
          record?.createdBy === user?._id ||
          record?.createdBy?._id === user?._id;
        const isNameNA = !customerName || customerName === "N/A";
        // FO-created pending cases should still be clickable to continue filling
        const showEditLink = !isPending || isCreatedByMe;

        return (
          <div className="flex flex-col gap-1 py-0.5 font-outfit">
            <div className="flex items-center gap-2 flex-wrap">
              {/* LED Blinking Light Indicator */}
              {isPending && (
                <span className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${isDelayed ? 'led-red' : 'led-blue'}`} title={isDelayed ? "Delayed Unaccepted Case" : "New Case"} />
              )}
              {!isPending && isDelayed && (
                <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 led-amber" title="Delayed Work In Progress" />
              )}

              {showEditLink ? (
                <Link
                  to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
                  className="text-sm font-extrabold text-[#1b4d3e] hover:text-[#1c2725] hover:underline flex items-center gap-1.5 group transition-all"
                >
                  {isNameNA ? "Unnamed Customer" : customerName}
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#1b4d3e]" />
                </Link>
              ) : (
                <span className={`text-sm tracking-tight ${isNameNA ? 'font-medium text-slate-400 italic' : 'font-extrabold text-[#1c2725]'}`}>
                  {isNameNA ? "Unnamed Customer" : customerName}
                </span>
              )}
            </div>
            
            {/* Status alerts */}
            <div className="flex flex-wrap gap-1 mt-0.5">
              {isDelayed && (
                isPending ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-50 text-rose-600 border border-rose-100 animate-pulse">
                    NEW ALERT ({daysElapsed}d)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-50 text-amber-600 border border-amber-100 animate-pulse">
                    OVERDUE ({daysElapsed}d)
                  </span>
                )
              )}
              {isPending && !isDelayed && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-[#eef7f4] text-[#1b4d3e] border border-[#c8e2da]">
                  NEW CASE
                </span>
              )}
            </div>
          </div>
        );
      },
      sorter: (a, b) => {
        const nameA = getDisplayCustomerName(a) || "";
        const nameB = getDisplayCustomerName(b) || "";
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Assigned Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        const isT = isToday(date);
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold ${
            isT 
              ? "bg-[#eef7f4] text-[#1b4d3e] border border-[#c8e2da]" 
              : "bg-slate-50/80 text-slate-600 border border-slate-100"
          }`}>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {dayjs(date).format("DD/MM/YYYY hh:mm A")}
          </span>
        );
      },
      sorter: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
    },
    {
      title: "Address",
      dataIndex: "addressLegal",
      key: "addressLegal",
      render: (_, record) => {
        const address = getDisplayAddress(record);
        return (
          <span className="text-[#5c706c] text-xs font-semibold max-w-[220px] truncate block" title={address}>
            {address}
          </span>
        );
      },
    },
    {
      title: "Contact",
      dataIndex: "contactNumber",
      key: "contactNumber",
      render: (_, record) => {
        const contact = getDisplayContact(record);
        if (contact && contact !== "N/A") {
          return (
            <a 
              href={`tel:${contact}`} 
              className="text-[#1c2725] hover:text-[#5c706c] font-bold hover:underline inline-flex items-center gap-1.5 text-xs bg-[#f4faf8] px-2.5 py-1 rounded-xl border border-[#d0e6df] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {contact}
            </a>
          );
        }
        return <span className="text-slate-400 text-xs italic">N/A</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_, record) => {
        if (record?.approvalStatus === "Pending") {
          return (
            <div className="flex gap-2">
              <Button
                type="primary"
                onClick={() => handleAccept(record._id, record.bankName)}
                className="bg-[#1c2725] hover:bg-[#243531] border-none font-bold text-xs rounded-xl h-8 px-4 flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition-all text-white"
              >
                Accept
              </Button>
              <Button
                onClick={() => openDenyModal(record._id, record.bankName)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 hover:border-rose-200 font-bold text-xs rounded-xl h-8 px-4 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                Deny
              </Button>
            </div>
          );
        } else {
          return (
            <Link
              to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#eef7f4] hover:bg-[#dceee8] text-[#1b4d3e] border border-[#c8e2da] hover:border-[#a4d4c4] font-bold text-xs rounded-xl transition-all shadow-sm"
              title="Edit Report"
            >
              <Eye className="w-4 h-4 text-[#1b4d3e]" />
              <span>Edit Report</span>
              {record.isReportSubmitted && (
                <CheckCheck className="text-emerald-600 w-4 h-4 ml-0.5" />
              )}
            </Link>
          );
        }
      },
    },
    {
      title: "Paper",
      key: "propertyPaper",
      render: (_, record) => {
        const docs = (record.atsDocuments && record.atsDocuments.length > 0)
          ? record.atsDocuments
          : (record.AttachDocuments || []);
        const hasDocs = docs.length > 0;
        if (hasDocs) {
          return (
            <Button
              type="default"
              onClick={() => {
                setSelectedCaseDocs(docs);
                setIsDocsModalOpen(true);
              }}
              className="text-amber-800 border-amber-250 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-350 flex items-center gap-1.5 font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
              icon={<FileText className="w-3.5 h-3.5 text-amber-600" />}
            >
              Papers
            </Button>
          );
        }
        return <span className="text-slate-400 text-[11px] italic">No Papers</span>;
      },
    },
    {
      title: "Create Query",
      dataIndex: "createQuery",
      key: "createQuery",
      render: (_, record) => (
        <Button
          disabled={record?.isReportSubmitted === true}
          onClick={() => {
            setSelectedCaseId(record._id);
            setIsModalOpen(true);
          }}
          className={`font-bold text-xs rounded-xl h-8 flex items-center justify-center cursor-pointer border ${
            record?.isReportSubmitted === true
              ? "text-slate-400 bg-slate-50 border-slate-200 cursor-not-allowed"
              : "text-[#5c706c] bg-white border-[#d0e6df] hover:border-[#a4d4c4] hover:text-[#1c2725]"
          }`}
        >
          Mark Query
        </Button>
      ),
    },
  ];

  const queryColumns = [
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      render: (_, record) => {
        const bankName = caseMap[record.caseId]?.bankName || "N/A";
        const color = getBankTagColor(bankName);
        return (
          <Tag color={color} className="font-extrabold border-none rounded-lg px-3 py-1 text-[10px] uppercase tracking-wider shadow-sm">
            {bankName}
          </Tag>
        );
      },
      sorter: (a, b) => {
        const aBank = caseMap[a.caseId]?.bankName || "";
        const bBank = caseMap[b.caseId]?.bankName || "";
        return aBank.localeCompare(bBank);
      },
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (_, record) => {
        const caseData = caseMap[record.caseId];
        return caseData ? (
          <span className="font-extrabold text-[#1c2725] text-sm">
            {getDisplayCustomerName(caseData) || "Unnamed Customer"}
          </span>
        ) : "N/A";
      },
      sorter: (a, b) => {
        const aName = caseMap[a.caseId] ? getDisplayCustomerName(caseMap[a.caseId]) : "";
        const bName = caseMap[b.caseId] ? getDisplayCustomerName(caseMap[b.caseId]) : "";
        return aName.localeCompare(bName);
      },
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text) => <span className="text-[#5c706c] font-bold text-xs">{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-[#f4faf8] border border-[#d0e6df] text-[#1c2725]">
          <Calendar size={13} className="text-slate-400" />
          {dayjs(date).format("DD/MM/YYYY hh:mm A")}
        </span>
      ),
      sorter: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const caseData = caseMap[record.caseId];
        return (
          <Button
            type="primary"
            onClick={() => handleResolveAndEdit(record.caseId, caseData)}
            disabled={!caseData}
            className="bg-[#1c2725] hover:bg-[#243531] border-none font-bold text-xs rounded-xl h-8 px-4 flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition-all text-white"
          >
            Resolve & Edit
          </Button>
        );
      },
    },
  ];

  const isEmpty = sortedCases.length === 0;

  // Visual Stepper Render Helper for Mobile Cases
  const renderMobileProgress = (cItem) => {
    const isPending = cItem.approvalStatus === "Pending";
    const isAccepted = !isPending;
    const isCompleted = cItem.isReportSubmitted === true;
    
    // Determine active stage index
    let activeStageIndex = 0;
    if (isCompleted) {
      activeStageIndex = 3;
    } else if (isAccepted) {
      activeStageIndex = cItem.status === "Visited" || cItem.status === "Work in Progress" ? 2 : 1;
    } else {
      activeStageIndex = 0;
    }

    const stages = [
      { label: "Assigned", desc: "Case Assigned" },
      { label: "Accepted", desc: "Case Accepted" },
      { label: "Visited/WIP", desc: "Site Visit / WIP" },
      { label: "Report Done", desc: "Report Submitted" },
    ];

    const currentStatus = stages[activeStageIndex].desc;

    return (
      <div className="bg-[#f4faf8] p-3.5 rounded-2xl border border-[#d0e6df]/60 mt-2.5 mb-4 shadow-sm">
        {/* Top Status Label */}
        <div className="flex justify-between items-center mb-3.5">
          <span className="text-[9px] font-bold text-[#7a928e] uppercase tracking-widest">Progress Status</span>
          <span className={`text-[9.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
            isCompleted 
              ? "bg-[#eef7f4] text-[#1b4d3e] border-[#c8e2da]" 
              : isAccepted 
                ? "bg-[#f4faf8] text-[#1c2725] border-[#d0e6df]" 
                : "bg-blue-50 text-blue-700 border-blue-200"
          }`}>
            {currentStatus}
          </span>
        </div>

        {/* Stepper Dots & Connector Line */}
        <div className="flex items-center justify-between relative px-2.5">
          {stages.map((stage, idx) => {
            const isActive = idx <= activeStageIndex;
            const isLastActive = idx === activeStageIndex;
            
            return (
              <div key={idx} className="flex items-center flex-1 last:flex-none relative">
                {/* Step Circle */}
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all duration-300 relative z-10 ${
                    isActive 
                      ? isLastActive
                        ? "bg-[#1c2725] border-[#1c2725] text-white shadow-sm ring-4 ring-[#1c2725]/10 animate-pulse"
                        : "bg-[#3b6657] border-[#3b6657] text-white shadow-sm"
                      : "bg-white border-[#d0e6df] text-[#7a928e]"
                  }`}
                  title={stage.label}
                >
                  {isActive ? "✓" : idx + 1}
                </div>

                {/* Label below the circle, positioned absolutely so it doesn't stretch the flex item */}
                <div className={`absolute top-7 left-1/2 -translate-x-1/2 text-center text-[7px] sm:text-[8.5px] font-extrabold uppercase tracking-tight w-10 sm:w-16 break-words leading-tight ${
                  isActive ? "text-[#1b4d3e] font-black" : "text-[#7a928e]"
                }`}>
                  {stage.label}
                </div>

                {/* Connector Line */}
                {idx < stages.length - 1 && (
                  <div className="absolute left-6 right-0 top-3 -translate-y-1/2 h-0.5 pointer-events-none z-0">
                    <div className={`h-full w-full transition-all duration-300 ${
                      idx < activeStageIndex ? "bg-[#3b6657]" : "bg-[#d0e6df]"
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Extra spacing to clear the absolute labels */}
        <div className="h-6 sm:h-5" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c7e1d9] via-[#edf4f1] to-[#f4faf7] px-3 py-4 sm:p-4 md:p-6 pb-24 dash-root">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        .dash-root, .dash-root * {
          font-family: 'Outfit', sans-serif;
        }

        /* Custom Table Styling for visual perfection */
        .custom-premium-table .ant-table {
          background: transparent !important;
          font-family: 'Outfit', sans-serif !important;
        }

        .custom-premium-table .ant-table-thead > tr > th {
          background: #eef4f2 !important;
          color: #1c2725 !important;
          font-weight: 800 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.06em !important;
          border-bottom: 2px solid #d0e6df !important;
          padding: 16px 20px !important;
        }

        .custom-premium-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #edf4f1 !important;
          padding: 16px 20px !important;
          background: #ffffff !important;
          color: #1c2725 !important;
          font-weight: 500 !important;
          transition: all 0.2s ease;
        }

        .custom-premium-table .ant-table-tbody > tr:hover > td {
          background: #f4faf8 !important;
        }

        .custom-premium-table .ant-pagination-item {
          border-radius: 12px !important;
          font-weight: 700 !important;
          border-color: #d0e6df !important;
        }

        .custom-premium-table .ant-pagination-item-active {
          background: #1c2725 !important;
          border-color: #1c2725 !important;
        }

        .custom-premium-table .ant-pagination-item-active a {
          color: #ffffff !important;
        }

        .custom-premium-table .ant-pagination-item:hover {
          border-color: #1c2725 !important;
        }
        .custom-premium-table .ant-pagination-item:hover a {
          color: #1c2725 !important;
        }

        @keyframes alert-pulse-red {
          0%, 100% { border-color: rgba(239, 68, 68, 0.15); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.1); }
          50% { border-color: rgba(239, 68, 68, 0.6); box-shadow: 0 0 12px 3px rgba(239, 68, 68, 0.15); }
        }
        @keyframes alert-pulse-amber {
          0%, 100% { border-color: rgba(245, 158, 11, 0.15); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.1); }
          50% { border-color: rgba(245, 158, 11, 0.6); box-shadow: 0 0 12px 3px rgba(245, 158, 11, 0.15); }
        }
        @keyframes alert-pulse-blue {
          0%, 100% { border-color: rgba(59, 130, 246, 0.15); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.1); }
          50% { border-color: rgba(59, 130, 246, 0.6); box-shadow: 0 0 12px 3px rgba(59, 130, 246, 0.15); }
        }
        @keyframes led-blink-red {
          0%, 100% { opacity: 0.5; transform: scale(0.9); box-shadow: 0 0 0px rgba(239, 68, 68, 0); }
          50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 8px 3px rgba(239, 68, 68, 0.65); }
        }
        @keyframes led-blink-amber {
          0%, 100% { opacity: 0.5; transform: scale(0.9); box-shadow: 0 0 0px rgba(245, 158, 11, 0); }
          50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 8px 3px rgba(245, 158, 11, 0.65); }
        }
        @keyframes led-blink-blue {
          0%, 100% { opacity: 0.5; transform: scale(0.9); box-shadow: 0 0 0px rgba(59, 130, 246, 0); }
          50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 8px 3px rgba(59, 130, 246, 0.65); }
        }
        
        .animate-alert-red { animation: alert-pulse-red 1.8s infinite ease-in-out; }
        .animate-alert-amber { animation: alert-pulse-amber 1.8s infinite ease-in-out; }
        .animate-alert-blue { animation: alert-pulse-blue 1.8s infinite ease-in-out; }
        .led-red { background-color: #ef4444; animation: led-blink-red 0.9s infinite ease-in-out; }
        .led-amber { background-color: #f59e0b; animation: led-blink-amber 0.9s infinite ease-in-out; }
        .led-blue { background-color: #3b82f6; animation: led-blink-blue 0.9s infinite ease-in-out; }

        .chip-scroll::-webkit-scrollbar { display: none; }

        /* Mobile layout enhancements */
        @media (max-width: 640px) {
          .dash-root {
            padding-left: 12px !important;
            padding-right: 12px !important;
            padding-bottom: max(6.5rem, calc(20px + env(safe-area-inset-bottom, 16px))) !important;
          }
        }
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .dash-root {
            padding-bottom: max(6.5rem, calc(24px + env(safe-area-inset-bottom))) !important;
          }
        }
        @media (max-width: 767px) {
          .custom-premium-table .ant-table-content {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}} />
      
      {/* Premium Header Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1c2725] via-[#243531] to-[#1c2725] rounded-2xl sm:rounded-[32px] p-4 sm:p-6 md:p-8 text-white mb-6 border border-white/10 shadow-lg">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-44 h-44 bg-[#a4d4c4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-8 w-36 h-36 bg-[#eef68f]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-[#eef68f] text-[#1c2725] text-[10px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                Field Operations
              </span>
              <span className="text-[#a4d4c4] text-xs font-bold">
                • Unique Engineering
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-[#eef68f]">{user?.name || "Officer"}</span>!
            </h1>
            <p className="text-[#7a928e] text-xs md:text-sm mt-1.5 max-w-xl font-bold leading-relaxed">
              {summaryCounts.NEW_CASES > 0 
                ? `You have ${summaryCounts.NEW_CASES} new cases awaiting your acceptance.` 
                : "All caught up! You don't have any new cases pending acceptance."}
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 w-full sm:w-auto shadow-md">
            <div className="p-2.5 bg-white/10 rounded-xl text-[#eef68f]">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[9px] text-[#7a928e] font-bold uppercase tracking-wider leading-none">Current Date</div>
              <div className="text-xs font-bold text-white mt-1">
                {dayjs().format("dddd, D MMMM YYYY")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only Horizontally Scrollable Category Tabs */}
      <div className="md:hidden flex overflow-x-auto gap-2.5 pb-4 pt-0.5 chip-scroll -mx-3 px-3 sm:-mx-4 sm:px-4 mb-5">
        {STATUS_TYPES.map(({ title, value, icon: Icon, color, bg }) => {
          const isSelected = selectedStatus === value;
          const count = summaryCounts[value] || 0;
          const isHighlight = value === "TOTAL_ASSIGNED";
          
          let cardStyle = "bg-white/80 backdrop-blur-sm border-[#d0e6df] text-[#1c2725] hover:bg-[#f4faf8]/50";
          let badgeStyle = "bg-[#f4faf8] border border-[#d0e6df] text-[#5c706c]";
          
          if (isSelected) {
            if (isHighlight) {
              cardStyle = "bg-[#eef68f] border-[#e1ea9a] text-[#1c2725] shadow-md scale-[1.02]";
              badgeStyle = "bg-[#1c2725]/10 text-[#1c2725]";
            } else {
              cardStyle = "bg-[#1c2725] border-[#1c2725] text-white shadow-md scale-[1.02]";
              badgeStyle = "bg-white/20 text-white";
            }
          }
          
          return (
            <button
              key={value}
              onClick={() => setSelectedStatus(value)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold border transition-all shrink-0 active:scale-95 shadow-sm cursor-pointer ${cardStyle}`}
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors"
                style={{ 
                  backgroundColor: isSelected ? (isHighlight ? "rgba(28, 39, 37, 0.1)" : "rgba(255, 255, 255, 0.15)") : bg,
                  color: isSelected ? (isHighlight ? "#1c2725" : "#ffffff") : color
                }}
              >
                <Icon size={12} />
              </div>
              <span className="text-xs whitespace-nowrap tracking-tight">{title}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold leading-none ${badgeStyle}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Modern Interactive Summary Cards (Desktop view) */}
      <div className="hidden md:grid grid-cols-5 gap-4 mb-6">
        {STATUS_TYPES.map(({ title, value, icon: Icon, color, bg }) => {
          const isSelected = selectedStatus === value;
          const count = summaryCounts[value] || 0;
          const isHighlight = value === "TOTAL_ASSIGNED";
          
          let cardStyle = "bg-white border-[#edf4f1] text-[#1c2725] hover:border-[#d0e6df] hover:bg-white";
          let textTitleStyle = "text-[#7a928e]";
          let textCountStyle = "text-[#1c2725]";
          let iconWrapperStyle = "";
          
          if (isSelected) {
            if (isHighlight) {
              cardStyle = "bg-[#eef68f] border-[#e1ea9a] text-[#1c2725] shadow-md hover:border-[#e1ea9a] hover:bg-[#eef68f]";
              textTitleStyle = "text-[#5c706c]";
              textCountStyle = "text-[#1c2725]";
              iconWrapperStyle = "bg-[#1c2725]/10 text-[#1c2725]";
            } else {
              cardStyle = "bg-[#1c2725] border-[#1c2725] text-white shadow-md hover:border-[#1c2725] hover:bg-[#1c2725]";
              textTitleStyle = "text-[#a4d4c4]";
              textCountStyle = "text-white";
              iconWrapperStyle = "bg-white/10 text-white";
            }
          } else {
            iconWrapperStyle = "bg-[#f4faf8] text-[#1c2725]";
          }
          
          return (
            <div
              key={value}
              onClick={() => setSelectedStatus(value)}
              className={`cursor-pointer transition-all duration-300 border rounded-[24px] p-4 md:p-5 relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.98] group flex flex-col justify-between ${cardStyle}`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-[24px]" style={{ backgroundColor: isSelected ? (isHighlight ? "#1c2725" : "#3b6657") : color }} />
              
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className={`text-[10px] md:text-[11px] font-bold tracking-wider uppercase block ${textTitleStyle}`}>
                  {title}
                </span>
                <div 
                  className={`p-2 rounded-xl transition-all duration-350 group-hover:scale-110 shadow-sm shrink-0 ${iconWrapperStyle}`}
                  style={{ 
                    backgroundColor: isSelected ? undefined : bg, 
                    color: isSelected ? undefined : color 
                  }}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-2">
                <span className={`text-2xl md:text-3.5xl font-extrabold tracking-tight ${textCountStyle}`}>
                  {count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Filter and Search Panel */}
      <div className="bg-white rounded-2xl border border-[#d0e6df] p-3.5 sm:p-4 md:p-5 shadow-sm mb-6 flex flex-col gap-4">
        {/* Month Picker Row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest shrink-0">
            <Calendar size={14} className="text-slate-400" />
            <span>Month:</span>
          </div>
          <div className="relative flex items-center gap-2">
            <input
              id="fo-month-picker"
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedStatus("TOTAL_ASSIGNED");
                setSelectedBank(null);
              }}
              className="pl-3 pr-2 py-1.5 bg-[#f4faf8]/80 border border-[#d0e6df] text-[#1c2725] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3b6657]/10 focus:border-[#3b6657] transition-all text-xs font-bold shadow-inner cursor-pointer"
            />

          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5c706c]">
              <SearchIcon size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by customer, address, contact..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-11 pr-10 py-2.5 bg-[#f4faf8]/80 border border-[#d0e6df] text-[#1c2725] placeholder-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#3b6657]/10 focus:border-[#3b6657] transition-all text-xs font-semibold shadow-inner"
            />
            {searchText && (
              <button
                onClick={() => {
                  setSearchText("");
                  handleSearch("");
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full lg:w-auto overflow-x-auto chip-scroll py-0.5">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest shrink-0 mr-1">
              <Briefcase size={14} className="text-slate-400" />
              <span>Banks:</span>
            </div>
            {selectedBank && (
              <button
                onClick={() => setSelectedBank(null)}
                className="text-[10px] text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-100 font-bold flex items-center gap-1 transition-colors shrink-0 cursor-pointer shadow-sm"
              >
                Clear <X size={11} />
              </button>
            )}
            <div className="flex gap-2 shrink-0">
              {bankOptions.map((bank) => {
                const todayCount = monthFilteredFoCases.filter(
                  (item) => item.bankName === bank && isToday(item.createdAt)
                ).length;
                const isBankSelected = selectedBank === bank;
                
                return (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(isBankSelected ? null : bank)}
                    className={`text-[11px] px-4 py-2 rounded-2xl font-bold border transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 ${
                      isBankSelected
                        ? "bg-[#1c2725] border-[#1c2725] text-white shadow-sm"
                        : "bg-white hover:bg-[#f4faf8]/50 border-[#d0e6df] text-[#5c706c] hover:border-[#1c2725]"
                    }`}
                  >
                    {bank}
                    {todayCount > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[8.5px] font-extrabold ${
                        isBankSelected ? "bg-white/20 text-white" : "bg-[#eef7f4] text-[#1b4d3e]"
                      }`}>
                        {todayCount} new
                      </span>
                    )}
                  </button>
                );
              })}
              {bankOptions.length === 0 && (
                <span className="text-slate-400 text-xs italic">No banks available</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Cases Container */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 bg-white rounded-[24px] border border-[#d0e6df] shadow-sm">
          <Spin size="large" />
          <span className="text-[#5c706c] text-xs font-bold mt-4">Loading assigned cases...</span>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-white rounded-[24px] border border-[#d0e6df] shadow-sm">
          <div className="w-16 h-16 bg-[#f4faf8] rounded-full flex items-center justify-center text-[#5c706c] mb-4 border border-[#d0e6df] shadow-inner">
            <Briefcase size={24} className="text-[#5c706c]" />
          </div>
          <h3 className="text-base font-bold text-[#1c2725]">No applications found</h3>
          <p className="text-[#5c706c] text-xs max-w-xs mt-1.5 font-medium leading-relaxed">
            {selectedStatus !== "TOTAL_ASSIGNED" || selectedBank || searchText
              ? "We couldn't find any cases matching your current filters. Try resetting them."
              : "You don't have any cases assigned in this category right now."}
          </p>
          {(selectedStatus !== "TOTAL_ASSIGNED" || selectedBank || searchText) && (
            <button
              onClick={() => {
                setSelectedStatus("TOTAL_ASSIGNED");
                setSelectedBank(null);
                setSearchText("");
              }}
              className="mt-5 px-5 py-2.5 bg-[#1c2725] hover:bg-[#2c3d3a] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95 hover:shadow-lg"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop View (Data Table) */}
          <div className="hidden md:block bg-white rounded-[24px] border border-[#d0e6df] shadow-sm overflow-hidden">
            <Table
              dataSource={sortedCases}
              columns={
                selectedStatus === "QUERY_RAISED" ? queryColumns : defaultColumns
              }
              rowKey={(record) => record._id || record.caseId}
              bordered={false}
              className="custom-premium-table"
              rowClassName={(record) => {
                if (selectedStatus === "QUERY_RAISED") {
                  return "hover:bg-slate-50/50 transition-colors border-l-4 border-l-rose-500";
                }
                const daysElapsed = dayjs().diff(dayjs(record.createdAt), 'day');
                const isDelayed = daysElapsed >= 3 && !record.isReportSubmitted;
                const isPending = record.approvalStatus === "Pending";
                if (isDelayed) {
                  return isPending 
                    ? "bg-rose-50/15 hover:bg-rose-50/25 transition-colors border-l-4 border-l-rose-500 animate-alert-red" 
                    : "bg-amber-50/15 hover:bg-amber-50/25 transition-colors border-l-4 border-l-amber-500 animate-alert-amber";
                }
                if (isPending) {
                  return "bg-blue-50/10 hover:bg-blue-50/20 transition-colors border-l-4 border-l-blue-400 animate-alert-blue";
                }
                return "hover:bg-slate-50/50 transition-colors";
              }}
              scroll={{ x: "max-content" }}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: sortedCases.length,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} cases`,
              }}
              onChange={(pagination) => {
                if (pagination.current !== currentPage) {
                  setCurrentPage(pagination.current);
                }
                if (pagination.pageSize !== pageSize) {
                  setPageSize(pagination.pageSize);
                  setCurrentPage(1);
                }
              }}
            />
          </div>

          {/* Mobile View (Visual Responsive Card List - Native app feel) */}
          <div className="md:hidden space-y-4">
            {sortedCases.map((caseItem) => {
              const customerName = getDisplayCustomerName(caseItem);
              const address = getDisplayAddress(caseItem);
              const contact = getDisplayContact(caseItem);
              const bankRoute = getBankRoute(caseItem);
              const isPending = caseItem.approvalStatus === "Pending";
              const isTodayCase = isToday(caseItem.createdAt);
              const daysElapsed = dayjs().diff(dayjs(caseItem.createdAt), 'day');
              const isDelayed = daysElapsed >= 3 && !caseItem.isReportSubmitted;
              
              const docs = (caseItem.atsDocuments && caseItem.atsDocuments.length > 0)
                ? caseItem.atsDocuments
                : (caseItem.AttachDocuments || []);
              const hasDocs = docs.length > 0;

              if (selectedStatus === "QUERY_RAISED") {
                const cData = caseMap[caseItem.caseId];
                const custName = cData ? getDisplayCustomerName(cData) : "N/A";
                const bName = cData ? cData.bankName : "N/A";
                const dateFormatted = dayjs(caseItem.createdAt).format("DD/MM/YYYY hh:mm A");

                return (
                  <div 
                    key={caseItem._id || caseItem.caseId}
                    className="bg-white rounded-2xl border border-[#d0e6df] p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                    style={{ borderLeft: "4px solid #ef4444" }}
                  >
                    <div className="flex justify-between items-start mb-3 gap-2 flex-wrap">
                      <Tag
                        color={getBankTagColor(bName)}
                        className="font-extrabold border-none rounded-lg px-2.5 py-0.5 text-[9px] uppercase tracking-wider"
                      >
                        {bName}
                      </Tag>
                      <span className="text-[9px] font-extrabold px-2 py-0.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 uppercase tracking-wide">
                        Query Raised
                      </span>
                    </div>
                    <div className="text-[14.5px] font-extrabold text-[#1c2725] mb-1 break-words">
                      {custName}
                    </div>
                    <div className="text-[10px] text-[#5c706c] mb-3 flex items-center gap-1 font-bold">
                      <Calendar size={12} className="text-slate-400" />
                      {dateFormatted}
                    </div>
                    
                    {/* Stepper on Query card */}
                    {cData && renderMobileProgress(cData)}

                    <div className="text-xs text-[#1c2725] bg-[#f4faf8] rounded-2xl p-3 border border-[#d0e6df] min-h-[3.5rem] mb-4 leading-relaxed break-words">
                      <span className="font-extrabold text-[#5c706c] block mb-1 text-[9px] uppercase tracking-wider">Query Message:</span>
                      {caseItem.message || "No detailed query message provided."}
                    </div>
                    
                    <Button
                      type="primary"
                      onClick={() => handleResolveAndEdit(caseItem.caseId, cData)}
                      disabled={!cData}
                      className="bg-[#1c2725] hover:bg-[#2c3d3a] border-none font-bold text-xs rounded-xl h-10 w-full flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-md hover:shadow-lg"
                    >
                      Resolve & Edit Case
                    </Button>
                  </div>
                );
              }

              return (
                <div
                  key={caseItem._id}
                  className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden ${
                    isDelayed 
                      ? (isPending ? "animate-alert-red border-2 border-rose-300" : "animate-alert-amber border-2 border-amber-300")
                      : (isPending ? "animate-alert-blue border-2 border-blue-300" : "border-slate-105")
                  }`}
                  style={{ 
                    borderLeftWidth: "4px",
                    borderLeftColor: isPending 
                      ? "#3b82f6" 
                      : caseItem.isReportSubmitted 
                        ? "#10b981" 
                        : "#f59e0b"
                  }}
                >
                  {/* Mobile Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                      {/* LED Blinking Light Indicator */}
                      {isPending && (
                        <span className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${isDelayed ? 'led-red' : 'led-blue'}`} />
                      )}
                      {!isPending && isDelayed && (
                        <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 led-amber" />
                      )}

                      <Tag
                        color={getBankTagColor(caseItem.bankName)}
                        className="font-extrabold border-none rounded-lg px-2 py-0.5 text-[9px] uppercase tracking-wider truncate"
                      >
                        {caseItem.bankName}
                      </Tag>
                      
                      {isDelayed && (
                        isPending ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse shrink-0">
                            NEW ALERT ({daysElapsed}d)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse shrink-0">
                            OVERDUE ({daysElapsed}d)
                          </span>
                        )
                      )}
                      {isPending && !isDelayed && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                          NEW CASE
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 shrink-0">
                      <Calendar size={12} className="text-slate-400" />
                      {formatShortDate(caseItem.createdAt)}
                    </span>
                  </div>

                  {/* Customer Name info */}
                  <div className="mb-3">
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Customer Name</div>
                    {isPending ? (
                      <div className="text-[15.5px] font-extrabold text-slate-800 leading-snug break-words">
                        {customerName || "Unnamed Customer"}
                      </div>
                    ) : (
                      <Link
                        to={`/bank/${bankRoute}/edit/${caseItem._id}`}
                        className="text-[15.5px] font-extrabold text-[#1b4d3e] hover:text-[#1c2725] hover:underline flex items-center gap-1 group leading-snug break-words"
                      >
                        {customerName || "Unnamed Customer"}
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5 text-[#1b4d3e] shrink-0" />
                      </Link>
                    )}
                  </div>

                  {/* Dynamic Workflow Progress Stepper */}
                  {renderMobileProgress(caseItem)}

                  <div className="border-t border-slate-50 my-3" />

                  {/* Contact & Address Interactive Chips */}
                  <div className="space-y-3 mb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Customer Contact</span>
                      <div className="flex gap-2">
                        {contact && contact !== "N/A" ? (
                          <a 
                            href={`tel:${contact}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#eef7f4] hover:bg-[#dceee8] text-[#1b4d3e] font-extrabold text-[11px] rounded-xl border border-[#c8e2da] transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            <Phone size={12} className="text-[#1b4d3e]" />
                            <span>Call {contact}</span>
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-400 font-bold text-[11px] rounded-xl border border-slate-100">
                            <Phone size={12} />
                            <span>No phone number</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block font-outfit">Property Address</span>
                      <div className="flex gap-2 items-start bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 relative group">
                        <MapPin size={13.5} className="text-slate-400 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[11.5px] text-slate-600 font-medium block leading-normal break-words" title={address}>
                            {address}
                          </span>
                        </div>
                        {address && address !== "N/A" && (
                          <button
                            onClick={() => handleCopyAddress(address)}
                            className="p-1 hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Copy Address"
                          >
                            <Copy size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions block */}
                  <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                    {isPending ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAccept(caseItem._id, caseItem.bankName)}
                          className="py-2.5 px-4 bg-[#1c2725] hover:bg-[#2c3d3a] text-white font-bold text-xs rounded-xl transition-all shadow-sm text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Check size={14} /> Accept
                        </button>
                        <button
                          onClick={() => openDenyModal(caseItem._id, caseItem.bankName)}
                          className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold text-xs rounded-xl border border-rose-100 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <X size={14} /> Deny
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-0.5">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/bank/${bankRoute}/edit/${caseItem._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#eef7f4] text-[#1b4d3e] hover:bg-[#dceee8] font-bold text-xs rounded-xl transition-all border border-[#c8e2da] shrink-0"
                            title="Edit Report"
                          >
                            <Eye size={13.5} className="text-[#1b4d3e]" />
                            <span>Edit Case</span>
                            {caseItem.isReportSubmitted && (
                              <CheckCheck className="text-emerald-600 w-4 h-4 ml-0.5" />
                            )}
                          </Link>

                          {hasDocs && (
                            <button
                              onClick={() => {
                                setSelectedCaseDocs(docs);
                                setIsDocsModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs rounded-xl transition-all border border-amber-200 shrink-0"
                              title="Property Paper"
                            >
                              <FileText size={13} className="text-amber-500" />
                              <span>Papers</span>
                            </button>
                          )}
                        </div>

                        <button
                          disabled={caseItem.isReportSubmitted === true}
                          onClick={() => {
                            setSelectedCaseId(caseItem._id);
                            setIsModalOpen(true);
                          }}
                          className={`inline-flex items-center gap-1 px-3 py-2 font-bold text-xs rounded-xl transition-all border ${
                            caseItem.isReportSubmitted === true
                              ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-white hover:bg-slate-50 border-slate-300 text-slate-700 cursor-pointer active:scale-[0.97]"
                          }`}
                        >
                          Mark Query
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ─── Allowance Sheet Panel ─── shown below completed cases ─── */}
      {!loading && selectedStatus === "COMPLETED" && sortedCases.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
          {/* Panel Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-gradient-to-r from-[#1c2725] to-[#2e4a42] rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#eef68f]/20 rounded-xl flex items-center justify-center shrink-0">
                <FileSpreadsheet size={18} className="text-[#eef68f]" />
              </div>
              <div>
                <div className="text-white font-extrabold text-sm tracking-tight">Allowance Sheet</div>
                <div className="text-[#7a928e] text-[10px] font-semibold mt-0.5">
                  {sortedCases.length} completed {sortedCases.length === 1 ? "case" : "cases"} · Officer: {user?.name || "—"}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => exportAllowanceCSV(
                  sortedCases.map(buildAllowanceRowWithEdits),
                  `allowance_${(user?.name || "officer").replace(/\s+/g, "_")}_${dayjs().format("DDMMYYYY")}.csv`,
                  true
                )}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-400/20 hover:bg-emerald-400/30 text-[#eef68f] border border-emerald-400/30 hover:border-emerald-400/60 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <Download size={13} />
                Export CSV
              </button>
              <button
                onClick={() => exportAllowanceExcel(
                  sortedCases.map(buildAllowanceRowWithEdits),
                  `allowance_${(user?.name || "officer").replace(/\s+/g, "_")}_${dayjs().format("DDMMYYYY")}.xlsx`,
                  true
                )}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-400/20 hover:bg-blue-400/30 text-blue-200 border border-blue-400/30 hover:border-blue-400/60 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <FileSpreadsheet size={13} />
                Export Excel
              </button>
            </div>
          </div>

          {/* Allowance Table — scrollable horizontally */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-outfit border-collapse min-w-[1420px]">
              <thead>
                <tr className="bg-[#f4faf8] border-b-2 border-emerald-100">
                  {[
                    "Bank",
                    "Customer Name",
                    "Assign Date",
                    "Visit Date",
                    "Submitted Date",
                    "Property Address",
                    "City",
                    "Latitude",
                    "Longitude",
                    "Distance (km)",
                    "If Any (Others)",
                    "Total (₹)",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#5c706c] whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedCases.map((record, idx) => {
                  const row = buildAllowanceRowWithEdits(record);
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={record._id || idx}
                      className={`border-b border-slate-50 hover:bg-emerald-50/40 transition-colors ${
                        isEven ? "bg-white" : "bg-[#fafffe]"
                      }`}
                    >
                      {/* Bank */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Tag
                          color={getBankTagColor(row["Bank"])}
                          className="font-extrabold border-none rounded-lg px-2.5 py-0.5 text-[9px] uppercase tracking-wider shadow-sm"
                        >
                          {row["Bank"]}
                        </Tag>
                      </td>
                      {/* Customer Name */}
                      <td className="px-4 py-3 font-extrabold text-[#1c2725] whitespace-nowrap max-w-[160px] truncate">
                        {row["Customer Name"]}
                      </td>
                      {/* Assign Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-50 border border-slate-100 text-slate-600">
                          <Calendar size={10} className="text-slate-400" />
                          {row["Assign Date"]}
                        </span>
                      </td>
                      {/* Visit Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-blue-50 border border-blue-100 text-blue-700">
                          <MapPin size={10} className="text-blue-400" />
                          {row["Visit Date"]}
                        </span>
                      </td>
                      {/* Submitted Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-50 border border-emerald-100 text-emerald-700">
                          <CheckCircle2 size={10} className="text-emerald-500" />
                          {row["Submitted Date"]}
                        </span>
                      </td>
                      {/* Property Address */}
                      <td className="px-4 py-3 max-w-[220px]">
                        <span
                          className="text-[11px] text-slate-600 font-medium block truncate"
                          title={row["Property Address"]}
                        >
                          {row["Property Address"]}
                        </span>
                      </td>
                      {/* City */}
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-[#1b4d3e]">
                        {row["City"]}
                      </td>
                      {/* Latitude */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                          {row["Latitude"]}
                        </span>
                      </td>
                      {/* Longitude */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                          {row["Longitude"]}
                        </span>
                      </td>
                      {/* Distance (km) — editable input */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="text"
                          value={allowanceEdits[record._id]?.distance !== undefined
                            ? allowanceEdits[record._id].distance
                            : (record.distance || record.distanceFromCityCentre || "")}
                          onChange={(e) => updateAllowanceEdit(record._id, record.bankName || record.bank || "system", "distance", e.target.value)}
                          placeholder="km"
                          style={{
                            width: 80,
                            padding: "5px 10px",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#92400e",
                            background: "#fffbeb",
                            border: "1.5px solid #fcd34d",
                            borderRadius: 8,
                            outline: "none",
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#f59e0b"}
                          onBlur={(e) => e.target.style.borderColor = "#fcd34d"}
                        />
                      </td>
                      {/* If Any (Others) — editable input */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="text"
                          value={allowanceEdits[record._id]?.othersIfAny !== undefined
                            ? allowanceEdits[record._id].othersIfAny
                            : (record.othersIfAny || record.others || "")}
                          onChange={(e) => updateAllowanceEdit(record._id, record.bankName || record.bank || "system", "othersIfAny", e.target.value)}
                          placeholder="e.g. toll, parking..."
                          style={{
                            width: 160,
                            padding: "5px 10px",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#5b21b6",
                            background: "#f5f3ff",
                            border: "1.5px solid #c4b5fd",
                            borderRadius: 8,
                            outline: "none",
                          }}
                          onFocus={(e) => e.target.style.borderColor = "#7c3aed"}
                          onBlur={(e) => e.target.style.borderColor = "#c4b5fd"}
                        />
                      </td>
                      {/* Total (₹) — read-only */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="inline-block px-3 py-1.5 rounded-lg text-[11px] font-extrabold"
                          style={{ background: "#f8fafc", color: "#1e293b", border: "1.5px solid #cbd5e1" }}
                        >
                          ₹{row["Total (₹)"]}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* ── Total / Summary Row ── */}
                {(() => {
                  const totalDistanceNum = sortedCases.reduce((acc, record) => {
                    const d = allowanceEdits[record._id]?.distance !== undefined
                      ? allowanceEdits[record._id].distance
                      : (record.distance || record.distanceFromCityCentre || "");
                    const parsed = parseFloat(String(d).replace(/[^\d.]/g, ""));
                    return acc + (isNaN(parsed) ? 0 : parsed);
                  }, 0);
                  const totalAllowanceSum = sortedCases.reduce((acc, record) => {
                    const r = buildAllowanceRowWithEdits(record);
                    const parsed = parseFloat(r["Total (₹)"]);
                    return acc + (isNaN(parsed) ? 0 : parsed);
                  }, 0);
                  return (
                    <tr className="bg-[#1c2725] text-white border-t-2 border-emerald-300">
                      {/* Bank col — "TOTAL" label */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#eef68f]">
                          TOTAL
                        </span>
                      </td>
                      {/* Customer Name col — case count */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[11px] font-extrabold text-white">
                          {sortedCases.length} {sortedCases.length === 1 ? "Case" : "Cases"}
                        </span>
                      </td>
                      {/* Assign / Visit / Submitted Date cols — blank */}
                      <td className="px-4 py-3" />
                      <td className="px-4 py-3" />
                      <td className="px-4 py-3" />
                      {/* Address col — blank */}
                      <td className="px-4 py-3" />
                      {/* City col — blank */}
                      <td className="px-4 py-3" />
                      {/* Lat / Lng cols — blank */}
                      <td className="px-4 py-3" />
                      <td className="px-4 py-3" />
                      {/* Distance total */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="inline-block px-3 py-1.5 rounded-lg text-[11px] font-extrabold"
                          style={{ background: "#fffbeb", color: "#92400e", border: "1.5px solid #fcd34d" }}
                        >
                          {totalDistanceNum > 0 ? `${totalDistanceNum.toFixed(1)} km` : "—"}
                        </span>
                      </td>
                      {/* If Any col — blank */}
                      <td className="px-4 py-3" />
                      {/* Total Allowance sum */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="inline-block px-3 py-1.5 rounded-lg text-[11px] font-extrabold"
                          style={{ background: "#f0fdf4", color: "#166534", border: "1.5px solid #bbf7d0" }}
                        >
                          {totalAllowanceSum > 0 ? `₹${totalAllowanceSum.toFixed(2)}` : "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>

          {/* Panel Footer — clean summary only */}
          <div className="px-4 py-3 bg-[#f4faf8] border-t border-emerald-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center sm:justify-between">
            <span className="text-[10px] text-slate-400 font-semibold">
              Showing all {sortedCases.length} completed {sortedCases.length === 1 ? "case" : "cases"}
              {selectedMonth
                ? ` · ${dayjs(selectedMonth + "-01").format("MMMM YYYY")}`
                : " · All Months"}
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => exportAllowanceCSV(
                  sortedCases.map(buildAllowanceRowWithEdits),
                  `allowance_${(user?.name || "officer").replace(/\s+/g, "_")}_${dayjs().format("DDMMYYYY")}.csv`,
                  true
                )}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <Download size={11} /> CSV
              </button>
              <button
                onClick={() => exportAllowanceExcel(
                  sortedCases.map(buildAllowanceRowWithEdits),
                  `allowance_${(user?.name || "officer").replace(/\s+/g, "_")}_${dayjs().format("DDMMYYYY")}.xlsx`,
                  true
                )}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <FileSpreadsheet size={11} /> Excel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deny Reason Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-3 border-b border-rose-100 font-bold text-rose-700 text-lg">
            <X className="w-5 h-5 text-rose-500" />
            <span>Deny Case — Provide Reason</span>
          </div>
        }
        open={isDenyModalOpen}
        onCancel={() => !isDenyLoading && setIsDenyModalOpen(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '520px' }}
        className="rounded-2xl overflow-hidden font-outfit"
        maskClosable={!isDenyLoading}
      >
        <div className="py-4">
          <p className="text-sm font-semibold text-slate-600 mb-3 leading-relaxed">
            Please fill in a <span className="font-extrabold text-rose-600">reason</span> for declining this case. This will be recorded for review.
          </p>

          <div className="mb-2">
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
              Reason for Denial <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              placeholder="e.g. Property documents incomplete, unable to verify address, customer unreachable..."
              className="w-full border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none outline-none transition-all"
              disabled={isDenyLoading}
            />
            {denyReason.trim().length === 0 && (
              <p className="text-[10px] text-rose-400 font-bold mt-1 ml-1">⚠ Reason is required to proceed.</p>
            )}
          </div>

          <div className="flex gap-2.5 mt-5 justify-end">
            <button
              onClick={() => setIsDenyModalOpen(false)}
              disabled={isDenyLoading}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeny}
              disabled={isDenyLoading || !denyReason.trim()}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 border-none transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDenyLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  Denying...
                </>
              ) : (
                <>
                  <X size={13} /> Confirm Deny
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Notes Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-[#1c2725] text-lg">
            <FileText className="w-5 h-5 text-[#1b4d3e]" />
            <span>Case Notes / Mark Query</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '600px' }}
        className="rounded-2xl overflow-hidden font-outfit"
      >
        <div className="py-2.5">
          {selectedCaseId && (
            <CaseNotes
              caseId={selectedCaseId}
              onSuccess={() => {
                setIsModalOpen(false);
                dispatch(fetchCases(user._id));
                dispatch(allCaseUserById());
              }}
            />
          )}
        </div>
      </Modal>

      {/* Property Papers Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-[#1c2725] text-lg">
            <FileText className="w-5 h-5 text-[#1b4d3e]" />
            <span>Property Papers & Documents</span>
          </div>
        }
        open={isDocsModalOpen}
        onCancel={() => setIsDocsModalOpen(false)}
        footer={[
          <button 
            key="close" 
            onClick={() => setIsDocsModalOpen(false)}
            className="px-5 py-2.5 bg-[#1c2725] hover:bg-[#2c3d3a] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer active:scale-95 shadow-sm"
          >
            Close
          </button>
        ]}
        width="90%"
        style={{ maxWidth: '600px' }}
        className="rounded-2xl overflow-hidden font-outfit"
      >
        <div className="py-2.5">
          {selectedCaseDocs && selectedCaseDocs.length > 0 ? (
            <div className="space-y-3.5">
              {selectedCaseDocs.map((doc, idx) => {
                const url = typeof doc === "string" ? doc : doc.url || "";
                const name = typeof doc === "string" ? doc.split("/").pop() : doc.name || url.split("/").pop() || `Document_${idx + 1}`;
                const downloadUrl = url.includes("imagekit.io")
                  ? `${url}${url.includes("?") ? "&" : "?"}ik-attachment=true`
                  : url;
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row justify-between sm:items-center p-3.5 border border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-all gap-3"
                  >
                    <a 
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-slate-700 hover:text-indigo-600 hover:underline truncate text-xs sm:text-sm max-w-[260px]"
                      title="Click to view document"
                    >
                      {name}
                    </a>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        type="default"
                        href={url}
                        target="_blank"
                        icon={<Eye className="w-4 h-4" />}
                        className="flex items-center justify-center gap-1 text-xs font-bold text-slate-700 border-slate-300 hover:text-indigo-600 hover:border-indigo-500 rounded-xl py-2 px-3 cursor-pointer"
                        title="View Document"
                      >
                        View
                      </Button>
                      <Button
                        type="primary"
                        href={downloadUrl}
                        download={name}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<Download className="w-4 h-4" />}
                        className="flex items-center justify-center gap-1 text-xs font-bold text-white bg-[#1c2725] hover:bg-[#2c3d3a] border-none rounded-xl py-2 px-3 cursor-pointer"
                        title="Download Document"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <span className="font-semibold text-sm">No property papers available for this case.</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FieldOfficerDashboard;
