import React, { useState, useEffect, useMemo } from "react";
import { Input, Select, Tag, Button, Modal, Tooltip, Progress } from "antd";
import { Search, RotateCw, Calendar, MapPin, User, Eye, Edit3, HelpCircle, AlertCircle, CheckCircle, Clock, FileText, Image, Video, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../config/axios";
import getBankTagColor from "../Dashboard/getBankTagColor";
import { getDisplayCustomerName, getDisplayAddress, getDisplayCity, getBankRoute } from "../../utils/dashboardRecord";

const { Option } = Select;

const PIPELINE_COLUMNS = [
  {
    key: "Pending",
    title: "Pending / To Be Assigned",
    color: "#64748b", // slate
    bg: "rgba(248, 250, 252, 0.7)",
    borderColor: "#e2e8f0",
    glowColor: "rgba(100, 116, 139, 0.15)",
    icon: <Clock size={15} className="text-slate-500" />,
  },
  {
    key: "Work in Progress",
    title: "Assigned / In Progress",
    color: "#3b82f6", // blue
    bg: "rgba(240, 247, 255, 0.7)",
    borderColor: "#dbeafe",
    glowColor: "rgba(59, 130, 246, 0.15)",
    icon: <RotateCw size={15} className="text-blue-500 animate-spin-slow" />,
  },
  {
    key: "Query Raised",
    title: "Query Raised",
    color: "#ef4444", // red
    bg: "rgba(255, 245, 245, 0.7)",
    borderColor: "#fee2e2",
    glowColor: "rgba(239, 68, 68, 0.15)",
    icon: <AlertCircle size={15} className="text-red-500" />,
  },
  {
    key: "Submitted",
    title: "Report Submitted",
    color: "#f59e0b", // amber
    bg: "rgba(255, 251, 235, 0.7)",
    borderColor: "#fef3c7",
    glowColor: "rgba(245, 158, 11, 0.15)",
    icon: <HelpCircle size={15} className="text-amber-500" />,
  },
  {
    key: "Done",
    title: "Final Submitted / Closed",
    color: "#10b981", // green
    bg: "rgba(240, 253, 244, 0.7)",
    borderColor: "#dcfce7",
    glowColor: "rgba(16, 185, 129, 0.15)",
    icon: <CheckCircle size={15} className="text-green-500" />,
  },
];

const ApplicationPipeline = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedBank, setSelectedBank] = useState("All");
  
  // Drag and Drop active column highlights
  const [activeDragOverCol, setActiveDragOverCol] = useState(null);

  // Status Change Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    caseId: null,
    bankName: null,
    targetStatus: null,
    note: "",
  });

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/case");
      setCases(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch cases for pipeline:", error);
      toast.error("Failed to load pipeline cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Filter cases based on search and selected bank
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const customerName = (getDisplayCustomerName(item) || "").toLowerCase();
      const address = (getDisplayAddress(item) || "").toLowerCase();
      const bankName = (item.bankName || "").toLowerCase();
      const city = (getDisplayCity(item) || "").toLowerCase();
      const officerName = (item.assignedTo?.name || "").toLowerCase();
      const queryStr = searchText.toLowerCase().trim();

      const matchesSearch =
        customerName.includes(queryStr) ||
        address.includes(queryStr) ||
        bankName.includes(queryStr) ||
        city.includes(queryStr) ||
        officerName.includes(queryStr);

      const matchesBank =
        selectedBank === "All" ||
        (item.bankName || "").toLowerCase() === selectedBank.toLowerCase() ||
        (item.bankSlug || "").toLowerCase() === selectedBank.toLowerCase();

      return matchesSearch && matchesBank;
    });
  }, [cases, searchText, selectedBank]);

  // Unique bank options
  const bankOptions = useMemo(() => {
    const names = cases.map((x) => x.bankName).filter(Boolean);
    return ["All", ...new Set(names)].sort();
  }, [cases]);

  // Status mapping to pipeline columns
  const getCaseColumnKey = (status) => {
    const s = String(status || "").toLowerCase().trim();
    if (s.includes("pending")) return "Pending";
    if (s.includes("query")) return "Query Raised";
    if (s.includes("submitted") && !s.includes("final")) return "Submitted";
    if (s.includes("final") || s.includes("done") || s.includes("closed") || s.includes("complete")) return "Done";
    return "Work in Progress";
  };

  // Group cases by pipeline columns
  const casesByColumn = useMemo(() => {
    const groups = {
      Pending: [],
      "Work in Progress": [],
      "Query Raised": [],
      Submitted: [],
      Done: [],
    };

    filteredCases.forEach((item) => {
      const colKey = getCaseColumnKey(item.status);
      if (groups[colKey]) {
        groups[colKey].push(item);
      } else {
        groups["Work in Progress"].push(item);
      }
    });

    return groups;
  }, [filteredCases]);

  // Calculations for pipeline stats
  const pipelineStats = useMemo(() => {
    const total = filteredCases.length || 1;
    const pending = filteredCases.filter((x) => getCaseColumnKey(x.status) === "Pending").length;
    const active = filteredCases.filter((x) => getCaseColumnKey(x.status) === "Work in Progress").length;
    const done = filteredCases.filter((x) => getCaseColumnKey(x.status) === "Done").length;
    
    return {
      completionRate: Math.round((done / total) * 100),
      activeCases: active,
      pendingAllocation: pending,
    };
  }, [filteredCases]);

  // Drag and Drop Handlers
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        id: item._id,
        bankName: item.bankName,
        currentStatus: item.status,
      })
    );
  };

  const handleDragOver = (e, columnKey) => {
    e.preventDefault();
    setActiveDragOverCol(columnKey);
  };

  const handleDragLeave = () => {
    setActiveDragOverCol(null);
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setActiveDragOverCol(null);

    try {
      const rawData = e.dataTransfer.getData("application/json");
      if (!rawData) return;

      const { id, bankName, currentStatus } = JSON.parse(rawData);

      if (getCaseColumnKey(currentStatus) === targetStatus) return;

      let dbStatus = targetStatus;
      if (targetStatus === "Pending") dbStatus = "Pending";
      else if (targetStatus === "Work in Progress") dbStatus = "Work in Progress";
      else if (targetStatus === "Query Raised") dbStatus = "Query Raised";
      else if (targetStatus === "Submitted") dbStatus = "Submitted";
      else if (targetStatus === "Done") dbStatus = "Done";

      setModalData({
        caseId: id,
        bankName,
        targetStatus: dbStatus,
        note: "",
      });
      setIsStatusModalOpen(true);
    } catch (err) {
      console.error("Error parsing dropped card data:", err);
    }
  };

  const submitStatusChange = async () => {
    const { caseId, bankName, targetStatus, note } = modalData;
    if (!caseId || !targetStatus || !bankName) return;

    try {
      setLoading(true);
      await axiosInstance.put("/case/status", {
        caseId,
        status: targetStatus,
        bankName,
        note: note || `Status updated to ${targetStatus} via Pipeline`,
      });

      toast.success(`Case status updated to "${targetStatus}"`);
      setIsStatusModalOpen(false);
      fetchCases();
    } catch (error) {
      console.error("Failed to update case status:", error);
      toast.error("Failed to update case status");
    } finally {
      setLoading(false);
    }
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper to compute how long case has been active (returns badge class if older than 48 hours)
  const getAgeIndicator = (dateString) => {
    if (!dateString) return null;
    const diffTime = Math.abs(new Date() - new Date(dateString));
    const diffHours = diffTime / (1000 * 60 * 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours > 48) {
      return {
        label: `Active ${diffDays}d ago`,
        bg: "bg-red-50 text-red-600 border-red-100",
        urgent: true,
      };
    }
    return {
      label: diffDays === 0 ? "Today" : `Active ${diffDays}d ago`,
      bg: "bg-slate-50 text-slate-500 border-slate-100",
      urgent: false,
    };
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 dash-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        .dash-root, .dash-root * {
          font-family: 'Outfit', sans-serif;
        }

        .kanban-board-scroll::-webkit-scrollbar {
          width: 5px;
          height: 6px;
        }
        .kanban-board-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .kanban-board-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 99px;
        }
        .kanban-board-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .pipeline-card {
          box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.02);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pipeline-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.08), 0 5px 15px -5px rgba(0, 0, 0, 0.04);
          border-color: #cbd5e1;
        }

        .pipeline-column-body {
          background-image: radial-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 0);
          background-size: 16px 16px;
        }
      `}</style>

      {/* Top dashboard metric insights bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completion Rate</div>
            <div className="text-2xl font-extrabold text-slate-800 mt-1">{pipelineStats.completionRate}%</div>
          </div>
          <div className="w-24">
            <Progress percent={pipelineStats.completionRate} size="small" strokeColor="#10b981" showInfo={false} />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Assignments</div>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{pipelineStats.activeCases}</div>
          </div>
          <span className="p-2.5 bg-blue-50 rounded-xl text-blue-500 font-bold text-xs">Processing</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Allocation</div>
            <div className="text-2xl font-extrabold text-slate-500 mt-1">{pipelineStats.pendingAllocation}</div>
          </div>
          <span className="p-2.5 bg-slate-50 rounded-xl text-slate-500 font-bold text-xs">Unassigned</span>
        </div>
      </div>

      {/* Main Header / Filters section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            📂 Case Application Pipeline
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Interactive SaaS board for managing and routing active evaluation reports.
          </p>
        </div>

        {/* Filters and Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          <Input
            prefix={<Search size={15} className="text-slate-400" />}
            placeholder="Search by customer, city, officer..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-72 h-10 rounded-xl border-slate-200/80 hover:border-slate-300 focus:border-red-500"
            allowClear
          />

          <Select
            value={selectedBank}
            onChange={setSelectedBank}
            className="w-52 h-10 rounded-xl"
            placeholder="Filter by Bank"
          >
            {bankOptions.map((name) => (
              <Option key={name} value={name}>
                {name === "All" ? "All Banks" : name}
              </Option>
            ))}
          </Select>

          <Button
            icon={<RotateCw size={13} className="mt-0.5 inline-block mr-1.5" />}
            onClick={fetchCases}
            className="h-10 px-4.5 flex items-center justify-center rounded-xl border border-slate-200 font-bold text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50/20 active:scale-95 transition-all"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Kanban Board Layout */}
      <div className="flex gap-5 overflow-x-auto pb-5 kanban-board-scroll" style={{ minHeight: "calc(100vh - 270px)" }}>
        {PIPELINE_COLUMNS.map((col) => {
          const colCases = casesByColumn[col.key] || [];
          const isOver = activeDragOverCol === col.key;

          return (
            <div
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.key)}
              className="flex-1 min-w-[325px] max-w-[370px] flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/50 backdrop-blur-md shadow-sm transition-all duration-200"
              style={{
                borderColor: isOver ? col.color : "#e2e8f0",
                backgroundColor: isOver ? col.glowColor : "rgba(241, 245, 249, 0.40)",
                boxShadow: isOver ? `0 12px 30px ${col.color}18` : "none",
              }}
            >
              {/* Header block */}
              <div
                className="p-4 rounded-t-2xl flex items-center justify-between border-b bg-white"
                style={{ borderBottomColor: col.borderColor }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-lg flex items-center justify-center bg-slate-50 shadow-sm border border-slate-100">
                    {col.icon}
                  </span>
                  <h2 className="font-bold text-[12.5px] text-slate-800 tracking-wider uppercase">
                    {col.title}
                  </h2>
                </div>
                <span 
                  className="px-2.5 py-0.5 text-xs font-extrabold rounded-full border shadow-sm"
                  style={{
                    backgroundColor: "#ffffff",
                    color: col.color,
                    borderColor: col.borderColor,
                  }}
                >
                  {colCases.length}
                </span>
              </div>

              {/* Cards scroll area */}
              <div className="flex-1 p-3.5 flex flex-col gap-3.5 overflow-y-auto max-h-[calc(100vh-320px)] kanban-board-scroll pipeline-column-body">
                {colCases.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-30 select-none">
                    <span className="text-4xl mb-2">💤</span>
                    <span className="text-xs font-bold text-slate-400">Empty Stage</span>
                  </div>
                ) : (
                  colCases.map((item) => {
                    const custName = getDisplayCustomerName(item);
                    const isNameNA = !custName || custName === "N/A";
                    const age = getAgeIndicator(item.createdAt);
                    
                    return (
                      <div
                        key={item._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="bg-white p-4.5 rounded-xl border border-slate-150 cursor-grab active:cursor-grabbing pipeline-card relative group flex flex-col gap-2.5"
                      >
                        {/* Upper line: tags & actions */}
                        <div className="flex items-center justify-between gap-2">
                          <Tag
                            color={getBankTagColor(item.bankName)}
                            className="font-bold border-none rounded px-2.5 py-0.5 text-[9.5px] uppercase tracking-wider shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                          >
                            {item.bankName || "N/A"}
                          </Tag>

                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Link
                              to={`/bank/${getBankRoute(item)}/${item._id}`}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-100 transition-all"
                              title="View Case Details"
                            >
                              <Eye size={12.5} />
                            </Link>
                            <Link
                              to={`/bank/${getBankRoute(item)}/edit/${item._id}`}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition-all"
                              title="Edit Form"
                            >
                              <Edit3 size={12.5} />
                            </Link>
                          </div>
                        </div>

                        {/* Middle Block: Ref No & Customer */}
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 font-mono tracking-tight mb-1">
                            Ref: #{item.refNo || item.basicDetails?.caseReferenceNumber || "N/A"}
                          </div>
                          <h3 
                            className={`text-[14px] leading-snug tracking-tight truncate ${
                              isNameNA ? "font-medium text-slate-400 italic" : "font-bold text-slate-800"
                            }`}
                          >
                            {isNameNA ? "Unnamed Customer" : custName}
                          </h3>
                        </div>

                        {/* Location Details */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <MapPin size={12.5} className="text-slate-400 flex-shrink-0" />
                          <span className="truncate">{getDisplayCity(item)}</span>
                        </div>

                        {/* Extra indicators: attachment counts & active age */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Active Age Tag */}
                          {age && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border shadow-sm ${age.bg}`}>
                              {age.urgent && <ShieldAlert size={10} className="animate-pulse" />}
                              {age.label}
                            </span>
                          )}

                          {/* File indicators */}
                          {item.imageUrls?.length > 0 && (
                            <Tooltip title={`${item.imageUrls.length} photos uploaded`}>
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] text-slate-500 font-bold font-mono">
                                <Image size={10.5} className="text-slate-400" />
                                {item.imageUrls.length}
                              </span>
                            </Tooltip>
                          )}
                        </div>

                        {/* Lower block: Officer Avatar & Date */}
                        <div className="border-t border-slate-100 pt-3 mt-1 flex items-center justify-between text-[10.5px]">
                          {/* Officer info */}
                          <div className="flex items-center gap-2 truncate max-w-[62%]">
                            <div 
                              className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] text-white font-bold uppercase shadow-sm border border-white"
                              style={{ 
                                backgroundColor: item.assignedTo?.name ? col.color : "#94a3b8" 
                              }}
                            >
                              {item.assignedTo?.name ? (
                                item.assignedTo.name.slice(0, 1)
                              ) : (
                                <User size={9} className="text-white" />
                              )}
                            </div>
                            <span className={`truncate font-bold ${item.assignedTo?.name ? "text-slate-700" : "text-slate-400"}`}>
                              {item.assignedTo?.name || "Not Assigned"}
                            </span>
                          </div>

                          {/* Created Date */}
                          <div className="flex items-center gap-1 text-slate-400 font-semibold">
                            <Calendar size={11.5} className="text-slate-400" />
                            <span>{formatShortDate(item.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Remarks/Note entry */}
      <Modal
        title="📝 Update Case Remarks"
        open={isStatusModalOpen}
        onCancel={() => setIsStatusModalOpen(false)}
        onOk={submitStatusChange}
        okText="Update Status"
        confirmLoading={loading}
        okButtonProps={{ className: "bg-red-600 border-red-600 text-white hover:bg-red-500 rounded-lg h-9 font-semibold" }}
        cancelButtonProps={{ className: "rounded-lg h-9" }}
        className="rounded-2xl overflow-hidden font-outfit"
      >
        <div className="py-2.5 font-outfit">
          <p className="text-[13.5px] text-slate-500 mb-4 leading-relaxed font-medium">
            Please provide a remark/note about moving this application to stage{" "}
            <strong className="text-slate-800">"{modalData.targetStatus}"</strong>. This will be added to the case timeline and notifications.
          </p>

          <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Remarks / Remarks Note
          </label>
          <Input.TextArea
            rows={4}
            placeholder="E.g., Document verification done, field officer assigned, or query details..."
            value={modalData.note}
            onChange={(e) => setModalData({ ...modalData, note: e.target.value })}
            className="rounded-xl border-slate-200/80 hover:border-slate-300 focus:border-red-500"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ApplicationPipeline;
