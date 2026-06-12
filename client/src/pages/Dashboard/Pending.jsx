import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Input, Tag, Select, Modal, Button } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Edit3, Trash2, Plus } from "lucide-react";

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
} from "../../utils/dashboardRecord";

const { Search } = Input;
const { Option } = Select;

const getCaseDate = (item) =>
  item.createdAt ||
  item.uploadDate ||
  item.createdDate ||
  item.submissionDate ||
  item.dateOfVisit ||
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

const Pending = ({ selectedMonth }) => {
  const dispatch = useDispatch();
  const fieldOfficers = useSelector(selectFieldOfficers);

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
  const [pageSize, setPageSize] = useState(10);
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
      setDebouncedSearch(searchText.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    dispatch(fetchFieldOfficers());
  }, [dispatch]);

  useEffect(() => {
    fetchPendingList();
  }, [fetchPendingList]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone, selectedMonth, selectedBanks, selectedStatuses, debouncedSearch]);

  const monthFilteredPendingCases = useMemo(() => {
    return (pendingCases || []).filter((item) =>
      isSameMonth(getCaseDate(item), selectedMonth)
    );
  }, [pendingCases, selectedMonth]);

  const handleDelete = async (recordId) => {
    try {
      await dispatch(deletedCases(recordId)).unwrap();
      toast.success("Case deleted successfully.");
      await fetchPendingList();
    } catch (error) {
      toast.error("Failed to delete case.");
      console.error("Delete Error:", error);
    }
  };

  const assignToFieldOfficer = async () => {
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
  };

  const columns = [
    {
      title: "Bank",
      dataIndex: "bankName",
      key: "bankName",
      render: (bankName) => (
        <Tag color={getBankTagColor(bankName)}>{bankName}</Tag>
      ),
    },
    {
      title: "Customer Name",
      key: "displayCustomerName",
      render: (_, record) => (
        <Link
          to={`/bank/${getBankRoute(record)}/${record._id}`}
          className="text-blue-600 hover:underline"
        >
          {getDisplayCustomerName(record)}
        </Link>
      ),
    },
    {
      title: "Address as per Legal Document",
      key: "addressLegal",
      render: (_, record) => getDisplayAddress(record),
    },
    {
      title: "Contact",
      key: "customerNo",
      render: (_, record) => getDisplayContact(record),
    },
    {
      title: "Date Added",
      key: "createdAt",
      render: (_, record) => {
        const date = getCaseDate(record);
        return date ? dayjs(date).format("DD/MM/YYYY hh:mm A") : "N/A";
      },
    },
    {
      title: "Assigned",
      key: "assigned",
      render: (record) => {
        const assignedFO = fieldOfficers.find(
          (fieldOfficer) => fieldOfficer._id === record.assignedTo
        );

        return record.status === "Work in Progress" ? (
          <div className="text-green-700 font-semibold">
            Assigned to: {assignedFO?.name || "Unknown"}
          </div>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              setCurrentCase(record);
              setIsModalVisible(true);
            }}
          >
            Assign <Plus size={20} />
          </Button>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <div className="flex gap-4 items-center">
          <Link
            to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
            className="!text-green-600 hover:underline border p-1"
          >
            <Edit3 size={38} />
          </Link>

          <Button
            onClick={() => handleDelete(record._id)}
            className="!text-red-600 hover:underline"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ),
    },
    {
      title: "Upload Document",
      key: "upload",
      render: (record) => (
        <ImageUploader
          caseId={record._id}
          bankName={record.bankName}
          fetchData={fetchPendingList}
        />
      ),
    },
    {
      title: "Attachments",
      key: "AttachDocuments",
      render: (record) => {
        const attachments = record.AttachDocuments;

        if (!attachments || attachments.length === 0) return "No Attachments";

        return (
          <div className="flex gap-1">
            {attachments.map((attachment, index) => {
              const attachmentUrl = attachment?.url || attachment;
              const fileName = attachmentUrl?.split("/").pop();

              return (
                <a
                  key={`${attachmentUrl}-${index}`}
                  href={attachmentUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline !flex"
                >
                  📄 {fileName?.slice(0, 12) || `Attachment ${index + 1}`}
                </a>
              );
            })}
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow-md min-h-screen">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Select
          mode="multiple"
          style={{ minWidth: 200 }}
          placeholder="Filter by Bank"
          value={selectedBanks}
          onChange={(values) => {
            setSelectedBanks(values);
            setCurrentPage(1);
          }}
          allowClear
          maxTagCount={2}
        >
          {(pendingFilterOptions?.banks || []).map((bank) => (
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
          {(pendingFilterOptions?.statuses || []).map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>

        <Search
          placeholder="Search customer names, addresses..."
          allowClear
          onChange={(event) => {
            setSearchText(event.target.value);
            setCurrentPage(1);
          }}
          value={searchText}
          style={{ width: 300 }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">All Bank Valuation Reports</h2>
        <span className="text-sm text-gray-500">
          Showing {monthFilteredPendingCases.length} records (newest first)
        </span>
      </div>

      <Table
        columns={columns}
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
        bordered
        className="rounded-xl"
        scroll={{ x: true }}
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
              {fieldOfficer.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default Pending;