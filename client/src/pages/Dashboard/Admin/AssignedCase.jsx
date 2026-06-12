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

const AssignedCase = ({ selectedMonth }) => {
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
  const [pageSize, setPageSize] = useState(1000);

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
    fetchAssignedList();
  }, [fetchAssignedList]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone, selectedMonth, selectedBanks, selectedStatuses, debouncedSearch]);

  const monthFilteredAssignedCases = useMemo(() => {
    return (cases || []).filter((item) =>
      isSameMonth(getCaseDate(item), selectedMonth)
    );
  }, [cases, selectedMonth]);

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

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "bankName",
      render: (bankName, record) => {
        const color = getBankTagColor(bankName);

        let indicatorColor = "";
        switch (record.timeline?.[0]?.status) {
          case "submitted-by-fo":
            indicatorColor = "red";
            break;
          case "submitted-by-tm":
            indicatorColor = "yellow";
            break;
          case "complete":
            indicatorColor = "green";
            break;
          default:
            indicatorColor = "gray";
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
          to={`/bank/${getBankRoute(record)}/${record._id}`}
          className="text-blue-600"
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

          {record.assignedTo && user.role === "Admin" && (
            <Popconfirm
              title="Remove assignment?"
              onConfirm={() => handleRemoveAssignment(record._id)}
            >
              <button className="bg-red-300 px-2 rounded">R</button>
            </Popconfirm>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className="bg-green-600 text-white px-2 py-1 rounded">
          {status}
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
        <div className="flex gap-3">
          <Link to={`/bank/${getBankRoute(record)}/edit/${record._id}`}>
            <Edit3 size={18} />
          </Link>

          <Button
            danger
            onClick={async () => {
              await dispatch(deletedCases(record._id));
              toast.success("Deleted");
              await fetchAssignedList();
            }}
          >
            <Trash2 size={18} />
          </Button>
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
          {(assignedFilterOptions?.banks || []).map((bank) => (
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
          {(assignedFilterOptions?.statuses || []).map((status) => (
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
              {fieldOfficer.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default AssignedCase;