import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Input, Select } from "antd";
import { Link } from "react-router-dom";
import { Edit3, Download } from "lucide-react";

import { fetchTotalSubmitCase } from "../../../redux/features/assignedCase/assignedCasesThunk";
import Spinner from "../../../components/Spinner";
import getBankTagColor from "../getBankTagColor";
import {
  getBankRoute,
  getDisplayAddress,
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
  if (!date || !monthValue) return false;

  const d = new Date(date);
  if (isNaN(d.getTime())) return false;

  return (
    `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}` ===
    monthValue
  );
};

const FinalSubmittedCases = ({ selectedMonth, preloadedCases }) => {
  const dispatch = useDispatch();

  const {
    final,
    loading,
    selectedZone,
    finalFilterOptions,
  } = useSelector((state) => state.assignedCases);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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
  [bankFilter, debouncedSearch, selectedZone, selectedMonth, statusFilter]
);

  const fetchFinalList = useCallback(async () => {
    await dispatch(fetchTotalSubmitCase(queryParams));
  }, [dispatch, queryParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    if (!preloadedCases) {
      fetchFinalList();
    }
  }, [fetchFinalList, preloadedCases]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone, selectedMonth, selectedBanks, selectedStatuses, debouncedSearch]);

  const handleDownloadJson = (record) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(record, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `submission_${record._id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const monthFilteredFinal = useMemo(() => {
    if (!preloadedCases) return final || [];

    let filtered = [...preloadedCases];
    if (debouncedSearch) {
      const searchTokens = debouncedSearch.trim().toLowerCase().split(/\s+/);
      filtered = filtered.filter((item) => {
        const haystack = [
          item.bankName,
          item.customerName,
          item.address,
          item.city,
          item.engineer,
          item.status,
          item.remark,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchTokens.every((token) => haystack.includes(token));
      });
    }
    if (selectedBanks.length) {
      filtered = filtered.filter((item) => selectedBanks.includes(item.bankName));
    }
    if (selectedStatuses.length) {
      filtered = filtered.filter((item) => selectedStatuses.includes(item.status));
    }
    return filtered;
  }, [preloadedCases, final, debouncedSearch, selectedBanks, selectedStatuses]);

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "bankName",
      render: (bankName) => (
        <Tag color={getBankTagColor(bankName)}>{bankName}</Tag>
      ),
    },
    {
      title: "Customer Name",
      render: (_, record) => (
        <Link
          to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
          className="text-blue-600 hover:underline"
        >
          {getDisplayCustomerName(record)}
        </Link>
      ),
    },
    {
      title: "Address as per Legal Document",
      render: (_, record) => getDisplayAddress(record),
    },
    {
      title: "Assigned To",
      dataIndex: ["assignedTo", "name"],
      render: (_, record) => record?.assignedTo?.name || "N/A",
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
      title: "Action",
      key: "action",
      render: (record) => (
        <div className="flex gap-4 items-center">
          <Link
            to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
            className="!text-green-600 hover:underline border p-1"
            title="Edit Case"
          >
            <Edit3 size={18} />
          </Link>
          <button
            onClick={() => handleDownloadJson(record)}
            className="!text-blue-600 hover:underline border p-1"
            title="Download JSON"
          >
            <Download size={18} />
          </button>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className="bg-blue-600 text-white px-2 py-1 rounded font-semibold inline-block">
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Final Submitted Cases ({(final || []).length})
      </h2>

      <div className="flex flex-wrap gap-4 mb-4">
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
          {(finalFilterOptions?.banks || []).map((bank) => (
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
          {(finalFilterOptions?.statuses || []).map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>

        <Search
          placeholder="Search by customer, address or assignee"
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
            setCurrentPage(1);
          }}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      {loading && !preloadedCases ? (
        <Spinner />
      ) : (
        <Table
          dataSource={monthFilteredFinal}
          columns={columns}
          rowKey="_id"
          bordered
          pagination={{
            current: currentPage,
            pageSize,
            total: monthFilteredFinal.length,
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
    </div>
  );
};

export default FinalSubmittedCases;