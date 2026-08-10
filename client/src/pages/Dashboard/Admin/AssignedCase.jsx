import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Table, Button, Tag, Input, Popconfirm, Modal, Select, Tooltip } from "antd";
import { Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

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
  getDisplayAddress,
  getDisplayCity,
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

const AssignedCase = ({ selectedMonth, preloadedCases }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const fieldOfficers = useSelector(selectFieldOfficers);

  const {
    data: cases,
    assignedPagination,
    assignedFilterOptions,
    loading,
    selectedZone,
  } = useSelector((state) => state.assignedCases);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [selectedBankName, setSelectedBankName] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const bankFilter = useMemo(() => selectedBanks.join(","), [selectedBanks]);

  const statusFilter = useMemo(
    () => selectedStatuses.join(","),
    [selectedStatuses]
  );

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
    [bankFilter, debouncedSearch, selectedMonth, selectedZone, statusFilter]
  );

  const fetchAssignedList = useCallback(async () => {
    try {
      await dispatch(fetchAssignedCases(queryParams)).unwrap();
    } catch (error) {
      console.error("Failed to fetch assigned cases:", error);
      toast.error("Failed to fetch assigned cases");
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

  useEffect(() => {
    if (!preloadedCases) {
      fetchAssignedList();
    }
  }, [fetchAssignedList, preloadedCases]);

  const bankOptions = useMemo(() => {
    const source = preloadedCases || cases || [];
    if (source.length > 0) {
      const set = new Set();
      source.forEach((item) => {
        const bank = item.bankName || item.bankSlug || "";
        if (bank && bank !== "N/A") set.add(bank);
      });
      if (set.size > 0) return Array.from(set).sort();
    }
    return assignedFilterOptions?.banks || [];
  }, [preloadedCases, cases, assignedFilterOptions]);

  const statusOptions = useMemo(() => {
    const source = preloadedCases || cases || [];
    if (source.length > 0) {
      const set = new Set();
      source.forEach((item) => {
        if (item.status && item.status !== "N/A") set.add(item.status);
      });
      if (set.size > 0) return Array.from(set).sort();
    }
    return assignedFilterOptions?.statuses || [];
  }, [preloadedCases, cases, assignedFilterOptions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone, selectedMonth, selectedBanks, selectedStatuses, debouncedSearch]);

  const monthFilteredAssignedCases = useMemo(() => {
    let source = preloadedCases || (cases || []).filter((item) => {
      if (!isSameMonth(getCaseDate(item), selectedMonth)) return false;
      const status = (item.status || "").toLowerCase().trim();
      if (
        status.includes("final") ||
        status.includes("done") ||
        status.includes("complete") ||
        status.includes("approved") ||
        status.includes("submit") ||
        item.isReportSubmitted === true ||
        status.includes("cancel")
      ) {
        return false;
      }
      return true;
    });

    if (debouncedSearch) {
      const searchTokens = debouncedSearch.trim().toLowerCase().split(/\s+/);
      source = source.filter((item) => {
        const haystack = [
          item.bankName,
          item.customerName,
          item.address,
          item.city,
          item.engineer || item.assignedTo?.name,
          item.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchTokens.every((token) => haystack.includes(token));
      });
    }

    if (selectedBanks.length) {
      source = source.filter((item) => selectedBanks.includes(item.bankName));
    }

    if (selectedStatuses.length) {
      source = source.filter((item) => selectedStatuses.includes(item.status));
    }

    return source;
  }, [cases, preloadedCases, selectedMonth, debouncedSearch, selectedBanks, selectedStatuses]);

  const handleRemoveAssignment = async (recordId) => {
    try {
      await axiosInstance.put(`/case/unassign-case/${recordId}`);
      toast.success("Assignment removed");
      await fetchAssignedList();
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

      await fetchAssignedList();
    } catch (error) {
      console.error("Assignment error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to update assignment");
    }
  };

  const handleUpdateCustomFields = async (record, field, value) => {
    const trimmed = value.trim();
    if ((record[field] || "") === trimmed) return;

    try {
      await axiosInstance.put(`/case/custom-fields/${record._id}`, {
        bankName: record.bankName || record.bank || record.bankSlug,
        [field]: trimmed
      });
      toast.success("Updated successfully!");
      await fetchAssignedList();
    } catch (error) {
      toast.error("Failed to update");
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "bankName",
      render: (bankName, record) => {
        const color = getBankTagColor(bankName);

        let indicatorColor = "";
        const latestTimelineStatus = record.timeline && record.timeline.length > 0
          ? record.timeline[record.timeline.length - 1]?.status
          : record.timeline?.[0]?.status;

        const isSubmittedByFO = 
          isApprovalPending(record) ||
          latestTimelineStatus === "submitted-by-fo" ||
          (record.approvalStatus || "").toLowerCase().trim() === "submitted" ||
          (record.status || "").toLowerCase().trim() === "submitted";

        if (isSubmittedByFO) {
          indicatorColor = "red";
        } else {
          switch (latestTimelineStatus) {
            case "submitted-by-tm":
              indicatorColor = "yellow";
              break;
            case "complete":
              indicatorColor = "green";
              break;
            default:
              indicatorColor = "gray";
          }
        }

        return (
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: indicatorColor }}
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
          className="text-blue-600"
        >
          {getDisplayCustomerName(record)}
        </Link>
      ),
    },
    {
      title: "Address",
      render: (record) => {
        const address = getDisplayAddress(record) || "N/A";
        return (
          <Tooltip title={address}>
            <div style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {address}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "City",
      render: (record) => getDisplayCity(record) || "N/A",
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
              {record.assignedTo && user.role === "Admin" && (
                <Popconfirm
                  title="Remove assignment?"
                  onConfirm={() => handleRemoveAssignment(record._id)}
                >
                  <button className="bg-red-300 px-2 rounded">R</button>
                </Popconfirm>
              )}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Date & Time",
      key: "createdAt",
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
      render: (_, record) => (
        <Input
          placeholder="Enter Case ID"
          defaultValue={record.customCaseId || ""}
          onBlur={(e) => handleUpdateCustomFields(record, "customCaseId", e.target.value)}
          onPressEnter={(e) => {
            e.target.blur();
          }}
          style={{ width: "120px" }}
        />
      ),
    },
    {
      title: "App ID / Notes",
      key: "appIdNotes",
      render: (_, record) => (
        <Input
          placeholder="Enter App ID / Notes"
          defaultValue={record.appIdNotes || ""}
          onBlur={(e) => handleUpdateCustomFields(record, "appIdNotes", e.target.value)}
          onPressEnter={(e) => {
            e.target.blur();
          }}
          style={{ width: "150px" }}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => {
        const isFOSubmitted = record.isReportSubmitted === true;
        return (
          <span className={`${isFOSubmitted ? "bg-blue-600 animate-pulse" : "bg-green-600"} text-white px-2.5 py-1 rounded text-xs font-semibold`}>
            {isFOSubmitted ? "FO Submitted" : status}
          </span>
        );
      },
    },
    {
      title: "Change Assign",
      render: (record) => (
        <Button
          onClick={() => {
            setSelectedCaseId(record._id);
            setSelectedBankName(record?.bankName);
            setSelectedRoute(record?.route || record?.bankSlug);
            setIsModalOpen(true);
          }}
        >
          Change Assign
        </Button>
      ),
    },
    {
      title: "Action",
      render: (record) => (
        <div className="flex gap-3">
          <Link to={`/bank/${getBankRoute(record)}/${record._id}`}>
            <Edit3 size={18} />
          </Link>

          <Popconfirm
            title="Are you sure you want to delete this case?"
            onConfirm={async () => {
              await dispatch(deletedCases(record._id));
              toast.success("Deleted");
              await fetchAssignedList();
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>
              <Trash2 size={18} />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Assigned Cases ({monthFilteredAssignedCases.length})
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

        <Select
          mode="multiple"
          placeholder="Filter by Status"
          style={{ minWidth: 200 }}
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

        <Search
          placeholder="Search..."
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
          dataSource={monthFilteredAssignedCases}
          columns={columns}
          rowKey="_id"
          bordered
          pagination={{
            current: currentPage,
            pageSize,
            total: monthFilteredAssignedCases.length,
            showSizeChanger: true,
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

export default AssignedCase;