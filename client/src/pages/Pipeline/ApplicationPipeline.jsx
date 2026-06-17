import React, { useState, useEffect, useMemo } from "react";
import { Input, Select, Tag, Button, Modal, Spin } from "antd";
import { Search, RotateCw, Calendar, MapPin, User, Eye, Edit3, HelpCircle, AlertCircle, CheckCircle, Clock } from "lucide-react";
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
    bg: "#f8fafc",
    borderColor: "#e2e8f0",
    headerBg: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
    statusBadgeColor: "default",
    icon: <Clock size={16} className="text-slate-500" />,
  },
  {
    key: "Work in Progress",
    title: "Assigned / Work in Progress",
    color: "#3b82f6", // blue
    bg: "#f0f7ff",
    borderColor: "#dbeafe",
    headerBg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    statusBadgeColor: "processing",
    icon: <RotateCw size={16} className="text-blue-500 animate-spin-slow" />,
  },
  {
    key: "Query Raised",
    title: "Query Raised",
    color: "#ef4444", // red
    bg: "#fff5f5",
    borderColor: "#fee2e2",
    headerBg: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
    statusBadgeColor: "error",
    icon: <AlertCircle size={16} className="text-red-500" />,
  },
  {
    key: "Submitted",
    title: "Report Submitted",
    color: "#f59e0b", // amber
    bg: "#fffbeb",
    borderColor: "#fef3c7",
    headerBg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    statusBadgeColor: "warning",
    icon: <HelpCircle size={16} className="text-amber-500" />,
  },
  {
    key: "Done",
    title: "Final Submitted / Closed",
    color: "#10b981", // green
    bg: "#f0fdf4",
    borderColor: "#dcfce7",
    headerBg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    statusBadgeColor: "success",
    icon: <CheckCircle size={16} className="text-green-500" />,
  },
];

const ApplicationPipeline = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedBank, setSelectedBank] = useState("All");
  
  // Drag and Drop active column highlights
  const [activeDragOverCol, setActiveDragOverCol] = useState(null);

  // Status Change Modal State (Specifically for Query / Remarks)
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

  // Unique bank list for filtering dropdown
  const bankOptions = useMemo(() => {
    const names = cases.map((x) => x.bankName).filter(Boolean);
    return ["All", ...new Set(names)].sort();
  }, [cases]);

  // Helper to categorize case status into pipeline column keys
  const getCaseColumnKey = (status) => {
    const s = String(status || "").toLowerCase().trim();
    if (s.includes("pending")) return "Pending";
    if (s.includes("query")) return "Query Raised";
    if (s.includes("submitted") && !s.includes("final")) return "Submitted";
    if (s.includes("final") || s.includes("done") || s.includes("closed") || s.includes("complete")) return "Done";
    // Default fallback to Work in Progress for any other active states (assigned, accepted, visited, reviewed)
    return "Work in Progress";
  };

  // Group cases by pipeline column keys
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

  // HTML5 Drag and Drop Handlers
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

      // Do nothing if dropping in same category
      if (getCaseColumnKey(currentStatus) === targetStatus) return;

      // Map column keys to actual DB statuses
      let dbStatus = targetStatus;
      if (targetStatus === "Pending") dbStatus = "Pending";
      else if (targetStatus === "Work in Progress") dbStatus = "Work in Progress";
      else if (targetStatus === "Query Raised") dbStatus = "Query Raised";
      else if (targetStatus === "Submitted") dbStatus = "Submitted";
      else if (targetStatus === "Done") dbStatus = "Done";

      // Open modal to input remarks/notes
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

      toast.success(`Case updated to ${targetStatus}`);
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

  return (
    <div className="min-h-screen bg-[#f4f6fb] p-6 dash-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        .dash-root, .dash-root * {
          font-family: 'Outfit', sans-serif;
        }

        .kanban-board-scroll::-webkit-scrollbar {
          width: 6px;
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
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pipeline-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgb(0 0 0 / 0.08), 0 4px 12px -4px rgb(0 0 0 / 0.08);
          border-color: #cbd5e1;
        }

        .pipeline-column {
          box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.01);
        }
      `}</style>

      {/* Header controls section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            📂 Application Pipeline
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Track and manage your workflow. Drag-and-drop cards to change statuses seamlessly.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Input
            prefix={<Search size={16} className="text-slate-400" />}
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
            icon={<RotateCw size={14} className="mt-0.5 inline-block mr-1.5" />}
            onClick={fetchCases}
            className="h-10 px-4 flex items-center justify-center rounded-xl border border-slate-200 font-semibold text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50/20 active:scale-95 transition-all"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-5 overflow-x-auto pb-5 kanban-board-scroll" style={{ minHeight: "calc(100vh - 190px)" }}>
        {PIPELINE_COLUMNS.map((col) => {
          const colCases = casesByColumn[col.key] || [];
          const isOver = activeDragOverCol === col.key;

          return (
            <div
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.key)}
              className="flex-1 min-w-[310px] max-w-[360px] flex flex-col rounded-2xl border bg-white/90 backdrop-blur-md shadow-sm transition-all duration-200 pipeline-column"
              style={{
                borderColor: isOver ? col.color : "#e2e8f0",
                boxShadow: isOver ? `0 10px 30px ${col.color}18` : "none",
              }}
            >
              {/* Column Header */}
              <div
                className="p-4 rounded-t-2xl flex items-center justify-between border-b"
                style={{
                  background: col.headerBg,
                  borderColor: col.borderColor,
                }}
              >
                <div className="flex items-center gap-2.5">
                  {col.icon}
                  <h2 className="font-bold text-[13.5px] text-slate-800 tracking-tight uppercase">
                    {col.title}
                  </h2>
                </div>
                <span 
                  className="px-2.5 py-1 text-xs font-extrabold rounded-full shadow-sm"
                  style={{
                    backgroundColor: "#ffffff",
                    color: col.color,
                    border: `1.5px solid ${col.borderColor}`,
                  }}
                >
                  {colCases.length}
                </span>
              </div>

              {/* Column Cards Area */}
              <div 
                className="flex-1 p-3.5 flex flex-col gap-3.5 overflow-y-auto max-h-[calc(100vh-270px)] kanban-board-scroll"
                style={{ backgroundColor: isOver ? `${col.color}05` : "transparent" }}
              >
                {colCases.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-30 select-none">
                    <span className="text-4xl mb-2">💤</span>
                    <span className="text-xs font-bold text-slate-500">No Applications Here</span>
                  </div>
                ) : (
                  colCases.map((item) => {
                    const custName = getDisplayCustomerName(item);
                    const isNameNA = !custName || custName === "N/A";
                    
                    return (
                      <div
                        key={item._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="bg-white p-4 rounded-xl border border-slate-100 cursor-grab active:cursor-grabbing pipeline-card relative group"
                        style={{ borderLeft: `4px solid ${col.color}` }}
                      >
                        {/* Card Header: Bank Tag & Action buttons */}
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <Tag
                            color={getBankTagColor(item.bankName)}
                            className="font-bold border-none rounded px-2.5 py-0.5 text-[9.5px] uppercase tracking-wider shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                          >
                            {item.bankName || "N/A"}
                          </Tag>

                          {/* Action Buttons (Fades in on hover) */}
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Link
                              to={`/bank/${getBankRoute(item)}/${item._id}`}
                              title="View Details"
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 border border-slate-100 hover:border-indigo-100 transition-colors"
                            >
                              <Eye size={13} />
                            </Link>
                            <Link
                              to={`/bank/${getBankRoute(item)}/edit/${item._id}`}
                              title="Edit Form"
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition-colors"
                            >
                              <Edit3 size={13} />
                            </Link>
                          </div>
                        </div>

                        {/* Customer name */}
                        <h3 
                          className={`text-[14px] leading-snug tracking-tight mb-2 truncate ${
                            isNameNA ? "font-medium text-slate-400 italic" : "font-extrabold text-slate-800"
                          }`}
                        >
                          {isNameNA ? "Unnamed Customer" : custName}
                        </h3>

                        {/* Location & City */}
                        <div className="flex items-center gap-2 text-[11.5px] text-slate-500 mb-3.5">
                          <MapPin size={13.5} className="text-slate-400 flex-shrink-0" />
                          <span className="truncate font-medium">{getDisplayCity(item)}</span>
                        </div>

                        {/* Footer: Officer & Date */}
                        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10.5px] text-slate-400">
                          {/* Assigned Officer */}
                          <div className="flex items-center gap-2 truncate max-w-[62%]">
                            <div 
                              className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] text-white font-bold uppercase shadow-sm border border-white"
                              style={{ 
                                backgroundColor: item.assignedTo?.name ? col.color : "#cbd5e1" 
                              }}
                            >
                              {item.assignedTo?.name ? (
                                item.assignedTo.name.slice(0, 1)
                              ) : (
                                <User size={10} className="text-white" />
                              )}
                            </div>
                            <span className={`truncate font-semibold ${item.assignedTo?.name ? "text-slate-700" : "text-slate-400"}`}>
                              {item.assignedTo?.name || "Not Assigned"}
                            </span>
                          </div>

                          {/* Created Date */}
                          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                            <Calendar size={12.5} className="text-slate-400" />
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
          <p className="text-[13.5px] text-slate-500 mb-4 leading-relaxed">
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
