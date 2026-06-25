import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Table, Button, Tag, Input, Popconfirm, Modal, Select } from "antd";
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
} from "../../../utils/dashboardRecord";

const { Search } = Input;
const { Option } = Select;

const getCaseDate = (item) =>
  item.createdAt ||
  item.uploadDate ||
  item.createdDate ||
  item.submissionDate ||
  item.dateOfVisit ||
  item.dateOfReport ||
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

const ApprovalPendingCases = ({ selectedMonth, onRefresh, onCaseApproved, onCaseDeleted }) => {
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
  const [pageSize, setPageSize] = useState(10);

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

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone, selectedMonth, selectedBanks, debouncedSearch]);

  const filteredCasesList = useMemo(() => {
    return (cases || []).filter((item) => {
      if (!isSameMonth(getCaseDate(item), selectedMonth)) return false;
      return isApprovalPending(item);
    });
  }, [cases, selectedMonth]);

  const handleRemoveAssignment = async (recordId) => {
    try {
      await axiosInstance.put(`/case/unassign-case/${recordId}`);
      toast.success("Assignment removed");
      await fetchList();
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
          to={`/bank/${getBankRoute(record)}/${record._id}`}
          className="text-blue-600 font-semibold hover:underline"
        >
          {getDisplayCustomerName(record)}
        </Link>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: ["assignedTo", "name"],
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <span>{text || "Not Assigned"}</span>
          {record.assignedTo && (user?.role === "Admin" || user?.role === "SuperAdmin") && (
            <Popconfirm
              title="Remove assignment?"
              onConfirm={() => handleRemoveAssignment(record._id)}
            >
              <button className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs hover:bg-red-200">Unassign</button>
            </Popconfirm>
          )}
        </div>
      ),
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
                  await fetchList();
                  if (onRefresh) onRefresh();
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
              await fetchList();
              if (onRefresh) onRefresh();
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
          {(assignedFilterOptions?.banks || []).map((bank) => (
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
              {fieldOfficer.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default ApprovalPendingCases;
