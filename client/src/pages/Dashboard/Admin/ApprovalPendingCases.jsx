import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Table, Button, Tag, Input, Popconfirm, Modal, Select, Tooltip } from "antd";
import { Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { fetchFieldOfficers } from "../../../redux/features/auth/authThunks";
import { fetchAssignedCases } from "../../../redux/features/assignedCase/assignedCasesThunk";
import { deletedCases } from "../../../redux/features/case/caseThunks";
import axiosInstance from "../../../config/axios";
import getBankTagColor from "../getBankTagColor";
import { selectFieldOfficers } from "../../../redux/selectors";
import Spinner from "../../../components/Spinner";
import {
  getBankRoute,
  getDisplayCustomerName,
  getDisplayCity,
  getCityTagColor,
} from "../../../utils/dashboardRecord";

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
  if (!date || !monthValue) return true;

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

const ApprovalPendingCases = ({ selectedMonth, onRefresh, onCaseApproved, onCaseDeleted, preloadedCases }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const fieldOfficers = useSelector(selectFieldOfficers);

  const {
    data: cases,
    assignedFilterOptions,
    loading,
    selectedZone,
  } = useSelector((state) => state.assignedCases);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [selectedBankName, setSelectedBankName] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const bankFilter = useMemo(() => selectedBanks.join(","), [selectedBanks]);

  const queryParams = useMemo(
    () => ({
      page: 1,
      limit: 1000,
      city: selectedZone || undefined,
      month: selectedMonth || undefined,
      search: debouncedSearch || undefined,
      bankName: bankFilter || undefined,
    }),
    [bankFilter, debouncedSearch, selectedMonth, selectedZone]
  );

  const fetchList = useCallback(async () => {
    try {
      await dispatch(fetchAssignedCases(queryParams)).unwrap();
    } catch (error) {
      console.error("Failed to fetch cases:", error);
      toast.error("Failed to fetch cases");
    }
  }, [dispatch, queryParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    dispatch(fetchFieldOfficers());
  }, [dispatch]);

  const bankOptions = useMemo(() => {
    if (preloadedCases) {
      return [...new Set(preloadedCases.map((item) => item.bankName).filter(Boolean))].sort();
    }
    return assignedFilterOptions?.banks || [];
  }, [preloadedCases, assignedFilterOptions]);

  useEffect(() => {
    if (!preloadedCases) {
      fetchList();
    }
  }, [fetchList, preloadedCases]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone, selectedMonth, selectedBanks, debouncedSearch]);

  const filteredCasesList = useMemo(() => {
    const source = preloadedCases || (cases || []).filter((item) => {
      if (!isSameMonth(getCaseDate(item), selectedMonth)) return false;
      return isApprovalPending(item);
    });

    const getSearchableText = (item) => [
      item.customerName, item.visitedPersonName, item.applicantName,
      item.applicantsName, item.clientName, item.displayCustomerName,
      item.personName, item.contactPersonName, item.contactPersonNumber,
      item.bankName, item.bankSlug, item.status,
      item.propertyAddress, item.addressLegal, item.address, item.displayAddress,
      item.propertyCity, item.city, item.customerNo, item.contactNumber,
      item.mobileNo, item.assignedTo?.name,
    ].filter(Boolean).join(" ").toLowerCase();

    const searchTokens = debouncedSearch
      ? debouncedSearch.trim().toLowerCase().split(/\s+/).filter(Boolean)
      : [];

    return source.filter((item) => {
      if (selectedBanks.length > 0) {
        const bank = (item.bankName || item.bankSlug || "").toLowerCase();
        if (!selectedBanks.some(b => bank.includes(b.toLowerCase()))) return false;
      }
      if (searchTokens.length > 0) {
        const text = getSearchableText(item);
        return searchTokens.every((token) => text.includes(token));
      }
      return true;
    });
  }, [preloadedCases, cases, selectedMonth, debouncedSearch, selectedBanks]);

  const handleRemoveAssignment = async (recordId) => {
    try {
      await axiosInstance.put(`/case/unassign-case/${recordId}`);
      toast.success("Assignment removed");
      if (onRefresh) onRefresh();
      if (!preloadedCases) {
        await fetchList();
      }
    } catch (error) {
      toast.error("Failed to remove assignment");
      console.error(error);
    }
  };

  const handleAssign = async () => {
    if (!selectedOfficer || !selectedCaseId) {
      toast.error("Select field officer");
      return;
    }

    try {
      await axiosInstance.put("/case/change-assignment", {
        caseId: selectedCaseId,
        officerId: selectedOfficer,
        bankName: selectedBankName,
        route: selectedRoute,
      });

      toast.success("Assignment updated successfully!");
      setIsModalOpen(false);
      setSelectedOfficer(null);
      setSelectedBankName(null);
      setSelectedRoute(null);
      setSelectedCaseId(null);

      await fetchList();
    } catch (error) {
      console.error("Assignment error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update assignment");
    }
  };

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "bankName",
      render: (bankName, record) => {
        const color = getBankTagColor(bankName);
        return (
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"
              title="Approval Pending"
            />
            <Tag color={color}>{bankName}</Tag>
          </div>
        );
      },
    },
    {
      title: "Customer",
      render: (record) => (
        <Link
          to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
          className="text-blue-600 font-semibold hover:underline"
        >
          {getDisplayCustomerName(record)}
        </Link>
      ),
    },
    {
      title: "City",
      key: "city",
      width: 110,
      render: (record) => {
        const city = getDisplayCity(record);
        return city && city !== "Other" ? (
          <Tag color={getCityTagColor(city)}>{city}</Tag>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        );
      },
    },
    {
      title: "Assigned To",
      render: (_, record) => {
        const fo = record.assignedTo;
        if (!fo) return <span>Not Assigned</span>;
        return (
          <Tooltip title={
            <div style={{ padding: "4px" }}>
              <p style={{ margin: 0, fontWeight: "bold" }}>{fo.name}</p>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.9 }}>Role: {fo.role || "FieldOfficer"}</p>
              <p style={{ margin: 0, fontSize: "11px", opacity: 0.9 }}>Email: {fo.email || "N/A"}</p>
              {fo.assignedCity && <p style={{ margin: 0, fontSize: "11px", opacity: 0.9 }}>City: {fo.assignedCity}</p>}
            </div>
          }>
            <div className="flex items-center gap-2 cursor-pointer">
              <span>{fo.name}</span>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Created By",
      key: "createdBy",
      render: (_, record) => {
        const creator =
          record.createdBy?.name ||
          record.submittedBy?.name ||
          record.engineer ||
          record.engineerName ||
          record.assignedTo?.name ||
          null;
        const creatorRole =
          record.createdBy?.role ||
          record.submittedBy?.role ||
          null;
        const now = new Date();
        const cDate = new Date(record.createdAt || record.uploadDate || "");
        const isToday =
          !isNaN(cDate.getTime()) &&
          cDate.getDate() === now.getDate() &&
          cDate.getMonth() === now.getMonth() &&
          cDate.getFullYear() === now.getFullYear();
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-sm text-slate-800">
              {creator || <span className="text-gray-400">—</span>}
            </span>
            {creatorRole && (
              <span className="text-xs text-slate-400">{creatorRole}</span>
            )}
            {isToday && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded px-1 inline-block w-fit mt-0.5">📅 Today</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      render: (record) => (
        <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-1 rounded font-semibold text-xs">
          {record.status || "Submitted"}
        </span>
      ),
    },
    {
      title: "Assign Date",
      key: "assignDate",
      render: (_, record) => {
        // createdAt is when the case was first created/assigned
        const raw = record.createdAt || record.uploadDate || record.createdDate || "";
        if (!raw) return <span className="text-gray-400 text-xs">—</span>;
        const d = new Date(raw);
        if (isNaN(d.getTime())) return <span className="text-gray-400 text-xs">—</span>;
        return (
          <div className="text-xs">
            <div className="font-semibold text-slate-700">
              {d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </div>
            <div className="text-slate-400">{d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
          </div>
        );
      },
    },
    {
      title: "Submitted Date",
      key: "submittedDate",
      render: (_, record) => {
        // Find the latest "FinalSubmitted" or "submitted" entry in timeline
        let submittedAt = null;
        if (Array.isArray(record.timeline) && record.timeline.length > 0) {
          const submittedEntry = [...record.timeline]
            .reverse()
            .find(t => {
              const s = (t.status || "").toLowerCase();
              return s.includes("submit") || s.includes("finalsubmit");
            });
          if (submittedEntry) submittedAt = submittedEntry.updatedAt || submittedEntry.createdAt;
        }
        // fallback: dateOfReport or submissionDate
        if (!submittedAt) submittedAt = record.submissionDate || record.dateOfReport || "";
        if (!submittedAt) return <span className="text-gray-400 text-xs">—</span>;
        const d = new Date(submittedAt);
        if (isNaN(d.getTime())) return <span className="text-gray-400 text-xs">—</span>;
        return (
          <div className="text-xs">
            <div className="font-semibold text-emerald-700">
              {d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </div>
            <div className="text-slate-400">{d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
          </div>
        );
      },
    },
    {
      title: "Action",
      render: (record) => (
        <div className="flex gap-3 items-center">
          {user?.role === "SuperAdmin" && (
            <Popconfirm
              title="Are you sure you want to approve this case?"
              onConfirm={async () => {
                try {
                  await axiosInstance.put("/case/status", {
                    caseId: record._id,
                    status: "Approved",
                    bankName: record.bankName,
                    note: "Approved by SuperAdmin",
                  });
                  toast.success("Case approved successfully!");
                  if (onCaseApproved) onCaseApproved(record._id);
                  if (onRefresh) onRefresh();
                  if (!preloadedCases) {
                    await fetchList();
                  }
                } catch (err) {
                  console.error("Approval error:", err);
                  toast.error(err.response?.data?.message || "Failed to approve case");
                }
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold" size="small">
                Approve
              </Button>
            </Popconfirm>
          )}
          <Link to={`/bank/${getBankRoute(record)}/edit/${record._id}`}>
            <Edit3 size={18} className="text-blue-600 hover:text-blue-800" />
          </Link>
          <Popconfirm
            title="Are you sure you want to delete this case?"
            onConfirm={async () => {
              await dispatch(deletedCases(record._id));
              toast.success("Deleted");
              if (onCaseDeleted) onCaseDeleted(record._id);
              if (onRefresh) onRefresh();
              if (!preloadedCases) {
                await fetchList();
              }
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              <Trash2 size={16} />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-rose-700">
        Approval Pending Cases ({filteredCasesList.length})
      </h2>

      <div className="flex gap-4 mb-4 flex-wrap">
        <Select
          mode="multiple"
          placeholder="Filter by Bank"
          style={{ minWidth: 200 }}
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

        <Search
          placeholder="Search customer name..."
          size="large"
          allowClear
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
            setCurrentPage(1);
          }}
          style={{ maxWidth: 300 }}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <Table
          dataSource={filteredCasesList}
          columns={columns}
          rowKey="_id"
          bordered
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredCasesList.length,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
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
      )}

      <Modal
        title="Change Assignment"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAssign}
        okText="Assign"
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select Field Officer"
          onChange={setSelectedOfficer}
        >
          {fieldOfficers?.map((fieldOfficer) => (
            <Option key={fieldOfficer._id} value={fieldOfficer._id}>
              {fieldOfficer.name} ({fieldOfficer.role || "FO"})
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default ApprovalPendingCases;
