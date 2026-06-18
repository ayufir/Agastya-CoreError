import { useEffect, useState, useMemo } from "react";
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
  Copy
} from "lucide-react";
import {
  getBankRoute,
  getDisplayAddress,
  getDisplayContact,
  getDisplayCustomerName,
} from "../../../utils/dashboardRecord";
import socket from "../../../config/socket";
import axiosInstance from "../../../config/axios";
import getBankTagColor from "../getBankTagColor";

const STATUS_TYPES = [
  { title: "New Cases", value: "NEW_CASES", icon: PlusCircle, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.07)", border: "#bfdbfe" },
  { title: "Pending", value: "PENDING", icon: Clock, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.07)", border: "#fef3c7" },
  { title: "Query Raised", value: "QUERY_RAISED", icon: AlertTriangle, color: "#ef4444", bg: "rgba(239, 68, 68, 0.07)", border: "#fee2e2" },
  { title: "Completed", value: "COMPLETED", icon: CheckCircle2, color: "#10b981", bg: "rgba(16, 185, 129, 0.07)", border: "#dcfce7" },
  { title: "Total Assigned", value: "TOTAL_ASSIGNED", icon: Briefcase, color: "#6366f1", bg: "rgba(99, 102, 241, 0.07)", border: "#c7d2fe" },
];

const formatShortDate = (dateString) => {
  if (!dateString) return "N/A";
  return dayjs(dateString).format("DD MMM YYYY");
};

const FieldOfficerDashboard = () => {
  const dispatch = useDispatch();
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

  const navigate = useNavigate();

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
    return [...new Set(foCases?.map((caseItem) => caseItem.bankName).filter(Boolean))];
  }, [foCases]);

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

  const handleDecline = async (id, bankName) => {
    try {
      await dispatch(declineCaseById({ id, bankName })).unwrap();
      toast.success("Case declined successfully");
      navigate(0);
    } catch (err) {
      console.log(err);
      toast.error("Failed to decline case");
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
    let filtered = foCases || [];

    if (selectedStatus !== "TOTAL_ASSIGNED") {
      if (selectedStatus === "QUERY_RAISED") {
        return allCase?.filter((c) => {
          if (c.type === "call_not_attended") return false;
          const status = getCaseStatus(String(c.caseId));
          return status === "Query Raised";
        }) || [];
      }
      if (selectedStatus === "NEW_CASES") {
        filtered = filtered?.filter(
          (caseItem) =>
            !caseItem.isReportSubmitted &&
            caseItem.status !== "Query Raised" &&
            !caseItem.queryResolved
        );
      } else if (selectedStatus === "PENDING") {
        filtered = filtered?.filter(
          (caseItem) =>
            caseItem.queryResolved === true &&
            !caseItem.isReportSubmitted &&
            caseItem.status !== "Query Raised"
        );
      } else if (selectedStatus === "COMPLETED") {
        filtered = filtered?.filter((caseItem) => caseItem.isReportSubmitted === true);
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
  }, [foCases, searchText, selectedStatus, selectedBank, allCase, caseMap]);

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
    const items = foCases || [];
    return {
      TOTAL_ASSIGNED: items.length,
      NEW_CASES: items.filter(
        (c) =>
          !c.isReportSubmitted &&
          c.status !== "Query Raised" &&
          !c.queryResolved
      ).length,
      PENDING: items.filter(
        (c) =>
          c.queryResolved === true &&
          !c.isReportSubmitted &&
          c.status !== "Query Raised"
      ).length,
      COMPLETED: items.filter((c) => c.isReportSubmitted === true).length,
      QUERY_RAISED: allCase?.filter((c) => {
        if (c.type === "call_not_attended") return false;
        const status = getCaseStatus(String(c.caseId));
        return status === "Query Raised";
      }).length || 0,
    };
  }, [foCases, allCase, caseMap]);

  const handleResolveAndEdit = async (caseId, caseData) => {
    if (!caseId || !caseData) return;
    try {
      await axiosInstance.put("/case/status", {
        caseId,
        status: "Work in Progress",
        note: "Query resolved by Field Officer.",
        bankName: caseData.bankName
      });
      
      toast.success("Query resolved! Case moved to Pending list.");
      
      if (user?._id) {
        dispatch(fetchCases(user._id));
        dispatch(allCaseUserById());
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
        const isNameNA = !customerName || customerName === "N/A";

        return (
          <div className="flex flex-col gap-1 py-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              {/* LED Blinking Light Indicator */}
              {isPending && (
                <span className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${isDelayed ? 'led-red' : 'led-blue'}`} title={isDelayed ? "Delayed Unaccepted Case" : "New Case"} />
              )}
              {!isPending && isDelayed && (
                <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 led-amber" title="Delayed Work In Progress" />
              )}

              {isPending ? (
                <span className={`text-sm tracking-tight ${isNameNA ? 'font-medium text-slate-400 italic' : 'font-extrabold text-slate-800'}`}>
                  {isNameNA ? "Unnamed Customer" : customerName}
                </span>
              ) : (
                <Link
                  to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
                  className="text-sm font-extrabold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1.5 group transition-all"
                >
                  {isNameNA ? "Unnamed Customer" : customerName}
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-500" />
                </Link>
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
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100">
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
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
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
          <span className="text-slate-600 text-xs font-medium max-w-[220px] truncate block" title={address}>
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
              className="text-indigo-650 hover:text-indigo-800 font-bold hover:underline inline-flex items-center gap-1.5 text-xs bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {contact}
            </a>
          );
        }
        return <span className="text-slate-405 text-xs italic">N/A</span>;
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
                className="bg-indigo-600 hover:bg-indigo-700 border-none font-bold text-xs rounded-xl h-8 px-4 flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition-all"
              >
                Accept
              </Button>
              <Button
                onClick={() => handleDecline(record._id, record.bankName)}
                className="bg-rose-50 hover:bg-rose-105 text-rose-605 hover:text-rose-700 border border-rose-100 hover:border-rose-200 font-bold text-xs rounded-xl h-8 px-4 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                Deny
              </Button>
            </div>
          );
        } else {
          return (
            <Link
              to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 hover:border-indigo-200 font-bold text-xs rounded-xl transition-all shadow-sm"
              title="Edit Report"
            >
              <Eye className="w-4 h-4 text-indigo-500" />
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
              className="text-amber-700 border-amber-200 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-350 flex items-center gap-1.5 font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
              icon={<FileText className="w-3.5 h-3.5 text-amber-500" />}
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
              : "text-slate-600 bg-white border-slate-200 hover:border-slate-300 hover:text-slate-800"
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
          <Tag color={color} className="font-extrabold border-none rounded-lg px-3 py-1 text-[10px] uppercase tracking-wider">
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
          <span className="font-extrabold text-slate-800 text-sm">
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
      render: (text) => <span className="text-slate-600 font-semibold text-xs">{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-100 text-slate-600">
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
            className="bg-indigo-600 hover:bg-indigo-700 border-none font-bold text-xs rounded-xl h-8 px-4 flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition-all"
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
      <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 mt-2.5 mb-4 shadow-inner">
        {/* Top Status Label */}
        <div className="flex justify-between items-center mb-3.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Progress Status</span>
          <span className={`text-[9.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
            isCompleted 
              ? "bg-emerald-50 text-emerald-700 border-emerald-250" 
              : isAccepted 
                ? "bg-indigo-50 text-indigo-700 border-indigo-250" 
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
                        ? "bg-indigo-650 border-indigo-650 text-white shadow-sm ring-4 ring-indigo-100 animate-pulse"
                        : "bg-indigo-500 border-indigo-500 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                  title={stage.label}
                >
                  {isActive ? "✓" : idx + 1}
                </div>

                {/* Label below the circle, positioned absolutely so it doesn't stretch the flex item */}
                <div className={`absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8.5px] font-extrabold uppercase tracking-tight ${
                  isActive ? "text-indigo-600 font-black" : "text-slate-400"
                }`}>
                  {stage.label}
                </div>

                {/* Connector Line */}
                {idx < stages.length - 1 && (
                  <div className="absolute left-6 right-0 top-3 -translate-y-1/2 h-0.5 pointer-events-none z-0">
                    <div className={`h-full w-full transition-all duration-300 ${
                      idx < activeStageIndex ? "bg-indigo-500" : "bg-slate-200"
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Extra spacing to clear the absolute labels */}
        <div className="h-5" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 pb-24 dash-root">
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
          background: #f8fafc !important;
          color: #475569 !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.06em !important;
          border-bottom: 2px solid #e2e8f0 !important;
          padding: 16px 20px !important;
        }

        .custom-premium-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9 !important;
          padding: 16px 20px !important;
          transition: all 0.2s ease;
        }

        .custom-premium-table .ant-pagination-item {
          border-radius: 10px !important;
          font-weight: 600 !important;
        }

        .custom-premium-table .ant-pagination-item-active {
          background: #4f46e5 !important;
          border-color: #4f46e5 !important;
        }

        .custom-premium-table .ant-pagination-item-active a {
          color: #ffffff !important;
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
      `}} />
      
      {/* Premium Header Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-955 to-slate-900 rounded-3xl p-6 md:p-8 text-white mb-6 border border-white/5 shadow-2xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-8 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/30">
                Field Operations
              </span>
              <span className="text-slate-400 text-xs font-semibold">
                • Unique Engineering
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-slate-200">{user?.name || "Officer"}</span>!
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1.5 max-w-xl font-medium leading-relaxed">
              {summaryCounts.NEW_CASES > 0 
                ? `You have ${summaryCounts.NEW_CASES} new cases awaiting your acceptance.` 
                : "All caught up! You don't have any new cases pending acceptance."}
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 self-start md:self-auto shadow-lg">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Current Date</div>
              <div className="text-xs font-bold text-white mt-1">
                {dayjs().format("dddd, D MMMM YYYY")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only Horizontally Scrollable Category Tabs */}
      <div className="md:hidden flex overflow-x-auto gap-2.5 pb-4.5 pt-0.5 chip-scroll -mx-4 px-4 mb-5">
        {STATUS_TYPES.map(({ title, value, icon: Icon, color, bg }) => {
          const isSelected = selectedStatus === value;
          const count = summaryCounts[value] || 0;
          
          return (
            <button
              key={value}
              onClick={() => setSelectedStatus(value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold border transition-all shrink-0 active:scale-95 shadow-sm cursor-pointer ${
                isSelected 
                  ? "bg-slate-900 border-slate-950 text-white shadow-md shadow-indigo-100" 
                  : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon size={14} style={{ color: isSelected ? "#ffffff" : color }} />
              <span className="text-xs whitespace-nowrap tracking-tight">{title}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold leading-none ${
                isSelected ? "bg-white/20 text-white" : "bg-slate-50 border border-slate-150 text-slate-600"
              }`}>
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
          
          return (
            <div
              key={value}
              onClick={() => setSelectedStatus(value)}
              className={`cursor-pointer transition-all duration-300 border rounded-2xl p-4 md:p-5 relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-[0.98] group flex flex-col justify-between ${
                isSelected 
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg ring-2 ring-indigo-500/20" 
                  : "bg-white border-slate-100 hover:border-slate-300 text-slate-800"
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ backgroundColor: isSelected ? "#4f46e5" : color }} />
              
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className={`text-[10px] md:text-[11px] font-bold tracking-wider uppercase block ${
                  isSelected ? "text-indigo-200" : "text-slate-400"
                }`}>
                  {title}
                </span>
                <div 
                  className="p-2 rounded-xl transition-all duration-350 group-hover:scale-110 shadow-sm shrink-0"
                  style={{ 
                    backgroundColor: isSelected ? "rgba(255,255,255,0.1)" : bg, 
                    color: isSelected ? "#ffffff" : color 
                  }}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-2">
                <span className={`text-2xl md:text-3.5xl font-extrabold tracking-tight ${
                  isSelected ? "text-white" : "text-slate-800"
                }`}>
                  {count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Filter and Search Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 md:p-5 shadow-sm mb-6 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <SearchIcon size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by customer, address, contact..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-xs font-semibold shadow-inner"
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
                const todayCount = foCases.filter(
                  (item) => item.bankName === bank && isToday(item.createdAt)
                ).length;
                const isBankSelected = selectedBank === bank;
                
                return (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(isBankSelected ? null : bank)}
                    className={`text-[11px] px-4 py-2 rounded-2xl font-bold border transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 ${
                      isBankSelected
                        ? "bg-slate-900 border-slate-900 text-white shadow-indigo-100"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {bank}
                    {todayCount > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[8.5px] font-extrabold ${
                        isBankSelected ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
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
        <div className="flex flex-col items-center justify-center py-28 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Spin size="large" />
          <span className="text-slate-400 text-xs font-bold mt-4">Loading assigned cases...</span>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-100 shadow-inner">
            <Briefcase size={24} className="text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-700">No applications found</h3>
          <p className="text-slate-400 text-xs max-w-xs mt-1.5 font-medium leading-relaxed">
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
              className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95 hover:shadow-lg"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop View (Data Table) */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
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
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} cases`,
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
                    className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                    style={{ borderLeft: "4px solid #ef4444" }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <Tag
                        color={getBankTagColor(bName)}
                        className="font-extrabold border-none rounded-lg px-2.5 py-0.5 text-[9px] uppercase tracking-wider"
                      >
                        {bName}
                      </Tag>
                      <span className="text-[9px] font-extrabold px-2 py-0.5 bg-rose-50 text-rose-655 rounded-lg border border-rose-100 uppercase tracking-wide">
                        Query Raised
                      </span>
                    </div>
                    <div className="text-[14.5px] font-extrabold text-slate-800 mb-1">
                      {custName}
                    </div>
                    <div className="text-[10px] text-slate-405 mb-3 flex items-center gap-1 font-bold">
                      <Calendar size={12} className="text-slate-400" />
                      {dateFormatted}
                    </div>
                    
                    {/* Stepper on Query card */}
                    {cData && renderMobileProgress(cData)}

                    <div className="text-xs text-slate-600 bg-slate-50 rounded-2xl p-3.5 border border-slate-100 min-h-[3.5rem] mb-4 leading-relaxed">
                      <span className="font-extrabold text-slate-400 block mb-1 text-[9px] uppercase tracking-wider">Query Message:</span>
                      {caseItem.message || "No detailed query message provided."}
                    </div>
                    
                    <Button
                      type="primary"
                      onClick={() => handleResolveAndEdit(caseItem.caseId, cData)}
                      disabled={!cData}
                      className="bg-indigo-600 hover:bg-indigo-700 border-none font-bold text-xs rounded-xl h-10 w-full flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-md hover:shadow-lg"
                    >
                      Resolve & Edit Case
                    </Button>
                  </div>
                );
              }

              return (
                <div
                  key={caseItem._id}
                  className={`bg-white rounded-2xl border p-4.5 shadow-sm hover:shadow-md transition-all relative overflow-hidden ${
                    isDelayed 
                      ? (isPending ? "animate-alert-red border-2 border-rose-350" : "animate-alert-amber border-2 border-amber-350")
                      : (isPending ? "animate-alert-blue border-2 border-blue-300" : "border-slate-100")
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
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* LED Blinking Light Indicator */}
                      {isPending && (
                        <span className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${isDelayed ? 'led-red' : 'led-blue'}`} />
                      )}
                      {!isPending && isDelayed && (
                        <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 led-amber" />
                      )}

                      <Tag
                        color={getBankTagColor(caseItem.bankName)}
                        className="font-extrabold border-none rounded-lg px-2.5 py-0.5 text-[9px] uppercase tracking-wider"
                      >
                        {caseItem.bankName}
                      </Tag>
                      
                      {isDelayed && (
                        isPending ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[8.5px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                            NEW ALERT ({daysElapsed}d)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[8.5px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                            OVERDUE ({daysElapsed}d)
                          </span>
                        )
                      )}
                      {isPending && !isDelayed && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[8.5px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                          NEW CASE
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 shrink-0">
                      <Calendar size={12} className="text-slate-355" />
                      {formatShortDate(caseItem.createdAt)}
                    </span>
                  </div>

                  {/* Customer Name info */}
                  <div className="mb-3.5">
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Customer Name</div>
                    {isPending ? (
                      <div className="text-[15.5px] font-extrabold text-slate-800 leading-snug">
                        {customerName || "Unnamed Customer"}
                      </div>
                    ) : (
                      <Link
                        to={`/bank/${bankRoute}/edit/${caseItem._id}`}
                        className="text-[15.5px] font-extrabold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 group leading-snug"
                      >
                        {customerName || "Unnamed Customer"}
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5 text-indigo-500 shrink-0" />
                      </Link>
                    )}
                  </div>

                  {/* Dynamic Workflow Progress Stepper */}
                  {renderMobileProgress(caseItem)}

                  <div className="border-t border-slate-50 my-3" />

                  {/* Contact & Address Interactive Chips */}
                  <div className="space-y-3 mb-4.5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Customer Contact</span>
                      <div className="flex gap-2">
                        {contact && contact !== "N/A" ? (
                          <a 
                            href={`tel:${contact}`}
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-700 font-extrabold text-[11px] rounded-xl border border-indigo-100 transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            <Phone size={12} className="text-indigo-500" />
                            <span>Call {contact}</span>
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 text-slate-400 font-bold text-[11px] rounded-xl border border-slate-100">
                            <Phone size={12} />
                            <span>No phone number</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
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
                  <div className="border-t border-slate-100 pt-3.5 flex flex-col gap-2">
                    {isPending ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAccept(caseItem._id, caseItem.bankName)}
                          className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Check size={14} /> Accept
                        </button>
                        <button
                          onClick={() => handleDecline(caseItem._id, caseItem.bankName)}
                          className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold text-xs rounded-xl border border-rose-100 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <X size={14} /> Deny
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-2.5 mt-0.5">
                        <div className="flex gap-2">
                          <Link
                            to={`/bank/${bankRoute}/edit/${caseItem._id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs rounded-xl transition-all border border-indigo-100"
                            title="Edit Report"
                          >
                            <Eye size={13.5} className="text-indigo-500" />
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
                              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs rounded-xl transition-all border border-amber-200"
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
                          className={`inline-flex items-center gap-1 px-3.5 py-2.5 font-bold text-xs rounded-xl transition-all border ${
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

      {/* Notes Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-800 text-lg">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Case Notes / Mark Query</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
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
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-800 text-lg">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Property Papers & Documents</span>
          </div>
        }
        open={isDocsModalOpen}
        onCancel={() => setIsDocsModalOpen(false)}
        footer={[
          <button 
            key="close" 
            onClick={() => setIsDocsModalOpen(false)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer active:scale-95 shadow-sm"
          >
            Close
          </button>
        ]}
        width={600}
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
                        className="flex items-center justify-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 border-none rounded-xl py-2 px-3 cursor-pointer"
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
