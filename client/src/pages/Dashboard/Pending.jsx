import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Input, Tag, Select, Modal, Button, Popconfirm, Tooltip } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Edit3, Trash2, Plus, AlertCircle } from "lucide-react";
import axiosInstance from "../../config/axios";

import { fetchPendingCases } from "../../redux/features/assignedCase/assignedCasesThunk";
import { assignCase, deletedCases } from "../../redux/features/case/caseThunks";
import { fetchFieldOfficers } from "../../redux/features/auth/authThunks";
import { selectFieldOfficers } from "../../redux/selectors";
import ImageUploader from "../../components/ImageUploader";
import getBankTagColor from "./getBankTagColor";
import {
  getBankRoute,
  getDisplayAddress,
  getDisplayContact,
  getDisplayCustomerName,
  getDisplayCity,
  getCityTagColor,
} from "../../utils/dashboardRecord";

const { Search } = Input;
const { Option } = Select;

const getCaseDate = (item) =>
  item.dateOfVisit ||
  item.dateOfReport ||
  item.dateOfInspection ||
  item.visitDate ||
  item.inspectionDate ||
  item.createdAt ||
  item.uploadDate ||
  item.createdDate ||
  item.submissionDate ||
  item.basicDetails?.createdAt ||
  item.header?.createdAt ||
  "";

const isSameMonth = (date, monthValue) => {
  if (!date || !monthValue) return false;

  const d = new Date(date);
  if (isNaN(d.getTime())) return false;

  return (
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` ===
    monthValue
  );
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

const Pending = ({ selectedMonth, preloadedCases }) => {
  const dispatch = useDispatch();
  const fieldOfficers = useSelector(selectFieldOfficers);
  const user = useSelector((state) => state.auth.user);

  const {
    pendingCases,
    pendingFilterOptions,
    loading,
    selectedZone,
  } = useSelector((state) => state.assignedCases);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);
  const [selectedFO, setSelectedFO] = useState(null);

  const bankFilter = useMemo(() => selectedBanks.join(","), [selectedBanks]);
  const statusFilter = useMemo(() => selectedStatuses.join(","), [selectedStatuses]);

  const queryParams = useMemo(
  () => ({
    page: 1,
    limit: 1000,
    city: selectedZone || undefined,
    month: selectedMonth || undefined,
    search: debouncedSearch || undefined,
    bankName: bankFilter || undefined,
    status: statusFilter || undefined,
  }),
  [bankFilter, debouncedSearch, selectedZone, selectedMonth, statusFilter]
);

  const fetchPendingList = useCallback(async () => {
    try {
      await dispatch(fetchPendingCases(queryParams)).unwrap();
    } catch (error) {
      console.error("Failed to fetch pending cases:", error);
      toast.error("Failed to fetch pending cases");
    }
  }, [dispatch, queryParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Lowercase so backend case-insensitive comparison works correctly
      setDebouncedSearch(searchText.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    dispatch(fetchFieldOfficers());
  }, [dispatch]);

  useEffect(() => {
    // Only fetch from API if no preloaded cases are supplied by Dashboard
    if (!preloadedCases) {
      fetchPendingList();
    }
  }, [fetchPendingList, preloadedCases]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone, selectedMonth, selectedBanks, selectedStatuses, debouncedSearch]);

  const bankOptions = useMemo(() => {
    const source = preloadedCases || pendingCases || [];
    if (source.length > 0) {
      const set = new Set();
      source.forEach((item) => {
        const bank = item.bankName || item.bankSlug || "";
        if (bank && bank !== "N/A") set.add(bank);
      });
      if (set.size > 0) return Array.from(set).sort();
    }
    return pendingFilterOptions?.banks || [];
  }, [preloadedCases, pendingCases, pendingFilterOptions]);

  const statusOptions = useMemo(() => {
    const source = preloadedCases || pendingCases || [];
    if (source.length > 0) {
      const set = new Set();
      source.forEach((item) => {
        if (item.status && item.status !== "N/A") set.add(item.status);
      });
      if (set.size > 0) return Array.from(set).sort();
    }
    return pendingFilterOptions?.statuses || [];
  }, [preloadedCases, pendingCases, pendingFilterOptions]);

  const monthFilteredPendingCases = useMemo(() => {
    const getSearchableText = (item) => [
      item.customerName, item.visitedPersonName, item.applicantName,
      item.applicantsName, item.clientName, item.displayCustomerName,
      item.personName, item.contactPersonName, item.contactedPerson,
      item.bankName, item.bankSlug, item.status,
      item.propertyAddress, item.addressLegal, item.address, item.displayAddress,
      item.propertyCity, item.city, item.customerNo, item.contactNumber,
      item.mobileNo, item.assignedTo?.name,
    ].filter(Boolean).join(" ").toLowerCase();

    const searchTokens = debouncedSearch
      ? debouncedSearch.trim().toLowerCase().split(/\s+/).filter(Boolean)
      : [];

    // Use preloadedCases from Dashboard (matches card count exactly) or fall back to API data
    const source = preloadedCases
      ? [...preloadedCases].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      : (pendingCases || []);

    return source.filter((item) => {
      const s = (item.status || "").toLowerCase();
      if (s.includes("cancel")) return false;

      // Local bank filter
      if (selectedBanks.length > 0) {
        const bank = (item.bankName || item.bankSlug || "").toLowerCase();
        if (!selectedBanks.some(b => bank.includes(b.toLowerCase()) || b.toLowerCase().includes(bank))) return false;
      }
      // Local status filter
      if (selectedStatuses.length > 0) {
        if (!selectedStatuses.includes(item.status)) return false;
      }
      // Local search filter
      if (searchTokens.length > 0) {
        const text = getSearchableText(item);
        return searchTokens.every((token) => text.includes(token));
      }
      return true;
    });
  }, [preloadedCases, pendingCases, debouncedSearch, selectedBanks, selectedStatuses]);


  const handleDelete = useCallback(async (recordId) => {
    try {
      await dispatch(deletedCases(recordId)).unwrap();
      toast.success("Case deleted successfully.");
      await fetchPendingList();
    } catch (error) {
      toast.error("Failed to delete case.");
      console.error("Delete Error:", error);
    }
  }, [dispatch, fetchPendingList]);

  const assignToFieldOfficer = useCallback(async () => {
    if (!selectedFO || !currentCase) {
      toast.error("Please select a Field Officer.");
      return;
    }

    try {
      await dispatch(
        assignCase({
          caseId: currentCase._id,
          fieldOfficerId: selectedFO,
          route: `/bank/${getBankRoute(currentCase)}/edit/${currentCase._id}`,
        })
      ).unwrap();

      toast.success("Assigned successfully!");
      setIsModalVisible(false);
      setSelectedFO(null);
      setCurrentCase(null);
      await fetchPendingList();
    } catch (error) {
      console.error("Assignment failed:", error);
      toast.error("Failed to assign case.");
    }
  }, [selectedFO, currentCase, dispatch, fetchPendingList]);

  const handleUpdateCustomFields = useCallback(async (record, field, value) => {
    const trimmed = value.trim();
    if ((record[field] || "") === trimmed) return;

    try {
      await axiosInstance.put(`/case/custom-fields/${record._id}`, {
        bankName: record.bankName || record.bank || record.bankSlug,
        [field]: trimmed
      });
      toast.success("Updated successfully!");
      await fetchPendingList();
    } catch (error) {
      toast.error("Failed to update");
      console.error(error);
    }
  }, [fetchPendingList]);

  const columns = useMemo(() => [
    {
      title: "Bank",
      dataIndex: "bankName",
      key: "bankName",
      width: 120,
      render: (bankName) => (
        <Tag color={getBankTagColor(bankName)}>{bankName}</Tag>
      ),
    },
    {
      title: "Customer Name",
      key: "displayCustomerName",
      width: 180,
      render: (_, record) => (
        <Link
          to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
          className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
        >
          {getDisplayCustomerName(record)}
        </Link>
      ),
    },
    {
      title: "City",
      key: "city",
      width: 110,
      render: (_, record) => {
        const city = getDisplayCity(record);
        return city && city !== "Other" ? (
          <Tag color={getCityTagColor(city)}>{city}</Tag>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        );
      },
    },
    {
      title: "Address as per Legal Document",
      key: "addressLegal",
      width: 250,
      render: (_, record) => (
        <div style={{ wordBreak: "break-word", whiteSpace: "normal", fontSize: "12px", color: "#475569", lineHeight: "1.4" }}>
          {getDisplayAddress(record)}
        </div>
      ),
    },
    {
      title: "Contact",
      key: "customerNo",
      width: 130,
      render: (_, record) => (
        <span style={{ fontSize: "12px", color: "#334155", fontWeight: 500 }}>
          {getDisplayContact(record)}
        </span>
      ),
    },
    {
      title: "Date Added",
      key: "createdAt",
      width: 130,
      render: (_, record) => {
        const date = getCaseDate(record);
        return date ? (
          <div style={{ fontSize: "12px", color: "#475569" }}>
            <div style={{ fontWeight: 500 }}>{dayjs(date).format("DD/MM/YYYY")}</div>
            <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "2px" }}>{dayjs(date).format("hh:mm A")}</div>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        );
      },
    },
    {
      title: "Case ID",
      key: "customCaseId",
      width: 130,
      render: (_, record) => (
        <Input
          placeholder="Enter Case ID"
          defaultValue={record.customCaseId || ""}
          onBlur={(e) => handleUpdateCustomFields(record, "customCaseId", e.target.value)}
          onPressEnter={(e) => {
            e.target.blur();
          }}
          style={{ width: "110px" }}
        />
      ),
    },
    {
      title: "App ID / Notes",
      key: "appIdNotes",
      width: 160,
      render: (_, record) => (
        <Input
          placeholder="Enter App ID / Notes"
          defaultValue={record.appIdNotes || ""}
          onBlur={(e) => handleUpdateCustomFields(record, "appIdNotes", e.target.value)}
          onPressEnter={(e) => {
            e.target.blur();
          }}
          style={{ width: "140px" }}
        />
      ),
    },
    {
      title: "FO Declined",
      key: "declineReason",
      width: 220,
      render: (_, record) => {
        const isDeclined = record.approvalStatus === "Declined";
        if (!isDeclined || !record.declineReason) {
          return <span className="text-gray-400 text-xs italic">—</span>;
        }
        return (
          <div
            style={{
              background: "#fff1f2",
              border: "1px solid #ffe4e6",
              borderRadius: 8,
              padding: "8px 12px",
              maxWidth: 200,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.02)"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 4,
              }}
            >
              <AlertCircle size={13} color="#e11d48" />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#e11d48",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                FO Denied
              </span>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#9f1239",
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.4,
                wordBreak: "break-word",
                whiteSpace: "normal",
                overflowWrap: "anywhere",
              }}
            >
              {record.declineReason}
            </p>
          </div>
        );
      },
    },
    {
      title: "Assigned",
      key: "assigned",
      width: 170,
      render: (_, record) => {
        const assignedFO = fieldOfficers.find(
          (fieldOfficer) => fieldOfficer._id === record.assignedTo
        );

        return record.status === "Work in Progress" ? (
          <Tooltip title={
            <div style={{ padding: "4px" }}>
              <p style={{ margin: 0, fontWeight: "bold" }}>{assignedFO?.name || "Unknown"}</p>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.9 }}>Role: {assignedFO?.role || "FieldOfficer"}</p>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.9 }}>Email: {assignedFO?.email || "N/A"}</p>
              {assignedFO?.assignedCity && <p style={{ margin: 0, fontSize: "11px", opacity: 0.9 }}>City: {assignedFO.assignedCity}</p>}
            </div>
          }>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1 text-xs cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>FO: {assignedFO?.name || "Unknown"}</span>
            </div>
          </Tooltip>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              setCurrentCase(record);
              setIsModalVisible(true);
            }}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 border-none rounded-lg shadow-sm font-medium text-xs h-8"
          >
            Assign <Plus size={14} />
          </Button>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
          <Link
            to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "1px solid #a7f3d0",
              background: "#ecfdf5",
              color: "#059669",
              flexShrink: 0,
            }}
            title="Edit Case"
          >
            <Edit3 size={15} />
          </Link>

          <Popconfirm
            title="Case delete ho jayega!"
            description="Kya aap sure hain?"
            onConfirm={() => handleDelete(record._id)}
            okText="Haan, Delete Karo"
            cancelText="Nahi"
            okButtonProps={{ danger: true }}
          >
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "1px solid #fecaca",
                background: "#fff1f2",
                color: "#dc2626",
                cursor: "pointer",
                flexShrink: 0,
              }}
              title="Delete Case"
            >
              <Trash2 size={15} />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ], [fieldOfficers, handleDelete, handleUpdateCustomFields]);

  const filteredColumns = useMemo(() => {
    const isFO = user?.role === "FieldOfficer" || user?.role === "FIELDOFFICER";
    if (isFO) {
      return columns.filter((col) => col.key !== "action");
    }
    return columns;
  }, [columns, user]);

  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-sm min-h-screen">
      <style>{`
        /* Premium Antd Table Styles */
        .premium-table .ant-table {
          background: #ffffff !important;
          border-radius: 12px !important;
        }
        .premium-table .ant-table-thead > tr > th {
          background: #f8fafc !important;
          color: #475569 !important;
          font-weight: 600 !important;
          font-size: 13px !important;
          border-bottom: 1px solid #e2e8f0 !important;
          padding: 12px 14px !important;
          white-space: nowrap;
        }
        .premium-table .ant-table-tbody > tr > td {
          padding: 10px 10px !important;
          border-bottom: 1px solid #f1f5f9 !important;
          vertical-align: middle !important;
        }
        .premium-table .ant-table-tbody > tr:hover > td {
          background: #f8fafc !important;
        }
        .premium-table .ant-table-container {
          border-radius: 12px !important;
          overflow: hidden;
          border: 1px solid #e2e8f0 !important;
        }
        .premium-table .ant-table-pagination.ant-pagination {
          margin: 16px 0 !important;
        }
        .compact-uploader .image-uploader-container {
          padding: 0 !important;
          margin: 0 !important;
        }
        .compact-uploader .ant-btn {
          height: 32px !important;
          padding: 4px 12px !important;
          font-size: 12px !important;
          border-radius: 6px !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
        }
      `}</style>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            mode="multiple"
            style={{ minWidth: 220 }}
            placeholder="Filter by Bank"
            value={selectedBanks}
            onChange={(values) => {
              setSelectedBanks(values);
              setCurrentPage(1);
            }}
            allowClear
            maxTagCount={2}
          >
            {bankOptions.map((bank) => (
              <Option key={bank} value={bank}>
                {bank}
              </Option>
            ))}
          </Select>

          <Select
            mode="multiple"
            style={{ minWidth: 200 }}
            placeholder="Filter by Status"
            value={selectedStatuses}
            onChange={(values) => {
              setSelectedStatuses(values);
              setCurrentPage(1);
            }}
            allowClear
            maxTagCount={2}
          >
            {statusOptions.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </div>

        <Search
          placeholder="Search customer names, addresses..."
          allowClear
          onChange={(event) => {
            setSearchText(event.target.value);
            setCurrentPage(1);
          }}
          value={searchText}
          style={{ width: 320 }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">All Bank Valuation Reports</h2>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {monthFilteredPendingCases.length} records (newest first)
        </span>
      </div>

      <Table
        columns={filteredColumns}
        dataSource={monthFilteredPendingCases}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total: monthFilteredPendingCases.length,
          showSizeChanger: true,
        }}
        onChange={(pagination) => {
          if (pagination.current !== currentPage) setCurrentPage(pagination.current);

          if (pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrentPage(1);
          }
        }}
        className="premium-table"
        scroll={{ x: 1600 }}
      />

      <Modal
        title="Assign Field Officer"
        open={isModalVisible}
        onOk={assignToFieldOfficer}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedFO(null);
        }}
        okText="Assign"
        cancelText="Cancel"
      >
        <div className="mb-4">
          <p className="font-semibold">
            Case: {currentCase ? getDisplayCustomerName(currentCase) : "N/A"}
          </p>
          <p className="text-gray-600">Bank: {currentCase?.bankName || "N/A"}</p>
        </div>

        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Select Field Officer"
          optionFilterProp="children"
          onChange={(value) => setSelectedFO(value)}
          filterOption={(input, option) =>
            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
          }
        >
          {fieldOfficers.map((fieldOfficer) => (
            <Option key={fieldOfficer._id} value={fieldOfficer._id}>
              {fieldOfficer.name} ({fieldOfficer.role || "FO"})
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default Pending;