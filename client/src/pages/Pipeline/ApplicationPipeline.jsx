import React, { useState, useEffect, useMemo } from "react";
import { Input, Select, Tag, Button, Modal, Spin } from "antd";
import { Search, RotateCw, Calendar, MapPin, User, ArrowRight, Eye, Edit3, HelpCircle } from "lucide-react";
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
    borderColor: "#cbd5e1",
    statusBadgeColor: "default",
  },
  {
    key: "Work in Progress",
    title: "Assigned / Work in Progress",
    color: "#3b82f6", // blue
    bg: "#eff6ff",
    borderColor: "#bfdbfe",
    statusBadgeColor: "processing",
  },
  {
    key: "Query Raised",
    title: "Query Raised",
    color: "#ef4444", // red
    bg: "#fef2f2",
    borderColor: "#fca5a5",
    statusBadgeColor: "error",
  },
  {
    key: "Submitted",
    title: "Report Submitted",
    color: "#f59e0b", // amber
    bg: "#fffbeb",
    borderColor: "#fde68a",
    statusBadgeColor: "warning",
  },
  {
    key: "Done",
    title: "Final Submitted / Closed",
    color: "#10b981", // green
    bg: "#ecfdf5",
    borderColor: "#a7f3d0",
    statusBadgeColor: "success",
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

      // Open modal to input remarks/notes
      setModalData({
        caseId: id,
        bankName,
        targetStatus,
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
    <div className="min-h-screen bg-[#f4f6fb] p-6">
      <style>{`
        .kanban-board-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .kanban-board-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .kanban-board-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .kanban-board-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Header controls section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
            📂 Application Pipeline
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Drag and drop cards across columns to update workflow status
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Input
            prefix={<Search size={16} className="text-gray-400" />}
            placeholder="Search by customer, city, FO..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64 h-9 rounded-lg"
            allowClear
          />

          <Select
            value={selectedBank}
            onChange={setSelectedBank}
            className="w-48 h-9 rounded-lg"
            placeholder="Filter by Bank"
          >
            {bankOptions.map((name) => (
              <Option key={name} value={name}>
                {name === "All" ? "All Banks" : name}
              </Option>
            ))}
          </Select>

          <Button
            icon={<RotateCw size={14} className="mt-0.5 inline-block mr-1" />}
            onClick={fetchCases}
            className="h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-300 transition-all"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 kanban-board-scroll" style={{ minHeight: "calc(100vh - 170px)" }}>
        {PIPELINE_COLUMNS.map((col) => {
          const colCases = casesByColumn[col.key] || [];
          const isOver = activeDragOverCol === col.key;

          return (
            <div
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.key)}
              className="flex-1 min-w-[280px] max-w-[350px] flex flex-col rounded-2xl border transition-all duration-200"
              style={{
                backgroundColor: isOver ? `${col.color}0a` : col.bg,
                borderColor: isOver ? col.color : col.borderColor,
                boxShadow: isOver ? `0 4px 20px ${col.color}18` : "none",
              }}
            >
              {/* Column Header */}
              <div
                className="p-4 flex items-center justify-between border-b"
                style={{ borderColor: col.borderColor }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <h2 className="font-bold text-sm text-gray-800 tracking-tight">
                    {col.title}
                  </h2>
                </div>
                <Tag color={col.statusBadgeColor} className="rounded-full px-2.5 font-bold border-none m-0 shadow-sm">
                  {colCases.length}
                </Tag>
              </div>

              {/* Column Cards Area */}
              <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-250px)] kanban-board-scroll">
                {colCases.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-40 select-none">
                    <span className="text-3xl mb-1">💤</span>
                    <span className="text-xs font-semibold text-gray-500">No cases here</span>
                  </div>
                ) : (
                  colCases.map((item) => (
                    <div
                      key={item._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 cursor-grab active:cursor-grabbing transition-all duration-150 relative group"
                    >
                      {/* Card Header: Bank Tag & Action buttons */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Tag
                          color={getBankTagColor(item.bankName)}
                          className="font-bold border-none rounded px-2 text-[10px] uppercase tracking-wider shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                        >
                          {item.bankName || "N/A"}
                        </Tag>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/bank/${getBankRoute(item)}/${item._id}`}
                            title="View Details"
                            className="p-1 rounded bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            <Eye size={13} />
                          </Link>
                          <Link
                            to={`/bank/${getBankRoute(item)}/edit/${item._id}`}
                            title="Edit Form"
                            className="p-1 rounded bg-gray-50 hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors"
                          >
                            <Edit3 size={13} />
                          </Link>
                        </div>
                      </div>

                      {/* Customer name */}
                      <h3 className="font-extrabold text-sm text-gray-900 leading-tight mb-2 truncate">
                        {getDisplayCustomerName(item) || "Unnamed Customer"}
                      </h3>

                      {/* Location & City */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2.5">
                        <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{getDisplayCity(item)}</span>
                      </div>

                      <div className="border-t border-dashed border-gray-100 pt-2.5 flex items-center justify-between text-[11px] text-gray-400">
                        {/* Assigned To */}
                        <div className="flex items-center gap-1.5 truncate max-w-[60%]">
                          <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-600 font-bold uppercase border border-gray-200">
                            {item.assignedTo?.name ? (
                              item.assignedTo.name.slice(0, 1)
                            ) : (
                              <User size={10} className="text-gray-400" />
                            )}
                          </div>
                          <span className="truncate font-semibold text-gray-600">
                            {item.assignedTo?.name || "Unassigned"}
                          </span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-gray-400" />
                          <span className="font-medium">{formatShortDate(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))
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
        okButtonProps={{ className: "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-500" }}
        className="rounded-2xl overflow-hidden"
      >
        <div className="py-2.5">
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Please provide a remark/note about moving this application to stage{" "}
            <strong className="text-gray-800">"{modalData.targetStatus}"</strong>. This will be added to the case timeline and notifications.
          </p>

          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Remarks / Remarks Note
          </label>
          <Input.TextArea
            rows={4}
            placeholder="E.g., Document upload complete, assigning officer, or query details..."
            value={modalData.note}
            onChange={(e) => setModalData({ ...modalData, note: e.target.value })}
            className="rounded-xl"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ApplicationPipeline;
