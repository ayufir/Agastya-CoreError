import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Input, Select } from "antd";
import { Link } from "react-router-dom";

import { getOutOfTatCases } from "../../../redux/features/assignedCase/assignedCasesThunk";
import Spinner from "../../../components/Spinner";
import getBankTagColor from "../getBankTagColor";
import {
  getBankRoute,
  getDisplayAddress,
  getDisplayCustomerName,
} from "../../../utils/dashboardRecord";

const { Option } = Select;

const getCaseDate = (item) =>
  item.createdAt ||
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
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` ===
    monthValue
  );
};

const OutOfTATCase = ({ selectedMonth, selectedAgent, preloadedCases }) => {
  const dispatch = useDispatch();

  const {
    loading,
    outOfTatCases,
    outOfTatFilterOptions,
    selectedZone,
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
    [bankFilter, debouncedSearch, selectedMonth, selectedZone, statusFilter]
  );

  const fetchOutOfTatList = useCallback(async () => {
    await dispatch(getOutOfTatCases(queryParams));
  }, [dispatch, queryParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    if (!preloadedCases) {
      fetchOutOfTatList();
    }
  }, [fetchOutOfTatList, preloadedCases]);

  const bankOptions = useMemo(() => {
    const source = preloadedCases || outOfTatCases || [];
    if (source.length > 0) {
      const set = new Set();
      source.forEach((item) => {
        const bank = item.bankName || item.bankSlug || "";
        if (bank && bank !== "N/A") set.add(bank);
      });
      if (set.size > 0) return Array.from(set).sort();
    }
    return outOfTatFilterOptions?.banks || [];
  }, [preloadedCases, outOfTatCases, outOfTatFilterOptions]);

  const statusOptions = useMemo(() => {
    const source = preloadedCases || outOfTatCases || [];
    if (source.length > 0) {
      const set = new Set();
      source.forEach((item) => {
        if (item.status && item.status !== "N/A") set.add(item.status);
      });
      if (set.size > 0) return Array.from(set).sort();
    }
    return outOfTatFilterOptions?.statuses || [];
  }, [preloadedCases, outOfTatCases, outOfTatFilterOptions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone, selectedMonth, selectedBanks, selectedStatuses, debouncedSearch, selectedAgent]);

  const monthFilteredOutOfTatCases = useMemo(() => {
    let list = preloadedCases || outOfTatCases || [];
    if (!preloadedCases) {
      list = list.filter((item) => isSameMonth(getCaseDate(item), selectedMonth));
    }

    if (selectedAgent && selectedAgent !== "All Agents") {
      list = list.filter((item) => {
        const eng =
          item.engineer ||
          item.engineerName ||
          item.assignedTo?.name ||
          item.fieldOfficer?.name ||
          item.employee?.name ||
          "N/A";
        return eng === selectedAgent;
      });
    }

    return list;
  }, [outOfTatCases, selectedMonth, selectedAgent]);

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
      title: "Created At",
      key: "createdAt",
      render: (_, record) => {
        const date = getCaseDate(record);
        if (!date) return "N/A";
        const dObj = new Date(date);
        if (isNaN(dObj.getTime())) return "N/A";

        return dObj.toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className="bg-red-600 text-white px-2 py-1 rounded font-semibold inline-block">
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Out of TAT Cases ({monthFilteredOutOfTatCases.length})
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

        <Input
          placeholder="Search by customer, address, bank or status"
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
            setCurrentPage(1);
          }}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <Table
          dataSource={monthFilteredOutOfTatCases}
          columns={columns}
          rowKey="_id"
          bordered
          pagination={{
            current: currentPage,
            pageSize,
            total: monthFilteredOutOfTatCases.length,
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
    </div>
  );
};

export default OutOfTATCase;