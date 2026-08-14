import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tag, Input, Select } from "antd";
import { Link } from "react-router-dom";

import { getCancelledCases } from "../../../redux/features/assignedCase/assignedCasesThunk";
import getBankTagColor from "../getBankTagColor";
import Spinner from "../../../components/Spinner";
import {
  getBankRoute,
  getDisplayAddress,
  getDisplayCustomerName,
} from "../../../utils/dashboardRecord";

const { Search } = Input;
const { Option } = Select;

const isSameMonth = (date, monthValue) => {
  if (!date || !monthValue) return true;
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;

  const yyyyMm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return yyyyMm === monthValue;
};

const CancelledCases = ({ selectedMonth, preloadedCases }) => {
  const dispatch = useDispatch();
  const {
    cancelledCases,
    cancelledFilterOptions,
    loading,
    error,
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
      search: debouncedSearch || undefined,
      bankName: bankFilter || undefined,
      status: statusFilter || undefined,
    }),
    [bankFilter, debouncedSearch, selectedZone, statusFilter]
  );

  const fetchCancelledList = useCallback(async () => {
    await dispatch(getCancelledCases(queryParams));
  }, [dispatch, queryParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    if (!preloadedCases) {
      fetchCancelledList();
    }
  }, [fetchCancelledList, preloadedCases]);

  const bankOptions = useMemo(() => {
    const source = preloadedCases || cancelledCases || [];
    if (source.length > 0) {
      const set = new Set();
      source.forEach((item) => {
        const bank = item.bankName || item.bankSlug || "";
        if (bank && bank !== "N/A") set.add(bank);
      });
      if (set.size > 0) return Array.from(set).sort();
    }
    return cancelledFilterOptions?.banks || [];
  }, [preloadedCases, cancelledCases, cancelledFilterOptions]);

  const statusOptions = useMemo(() => {
    const source = preloadedCases || cancelledCases || [];
    if (source.length > 0) {
      const set = new Set();
      source.forEach((item) => {
        if (item.status && item.status !== "N/A") set.add(item.status);
      });
      if (set.size > 0) return Array.from(set).sort();
    }
    return cancelledFilterOptions?.statuses || [];
  }, [preloadedCases, cancelledCases, cancelledFilterOptions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone, selectedMonth, selectedBanks, selectedStatuses, debouncedSearch]);

  const monthFilteredCancelledCases = useMemo(() => {
    const list = preloadedCases || cancelledCases || [];
    if (preloadedCases) return list;
    return list.filter((item) =>
      isSameMonth(
        item.createdAt ||
          item.createdDate ||
          item.submissionDate ||
          item.dateOfVisit ||
          item.dateOfReport ||
          item.basicDetails?.createdAt ||
          item.header?.createdAt,
        selectedMonth
      )
    );
  }, [preloadedCases, cancelledCases, selectedMonth]);

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
          to={getBankRoute(record) === "bajaj" || getBankRoute(record) === "bajaj-housing"
            ? `/bank/${getBankRoute(record)}/view/${record._id}`
            : `/bank/${getBankRoute(record)}/${record._id}`}
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
        All Cancelled Cases ({monthFilteredCancelledCases.length})
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

        <Search
          placeholder="Search by customer name or address"
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
      ) : error ? (
        <div className="text-red-600">There are no records to display</div>
      ) : (
        <Table
          dataSource={monthFilteredCancelledCases}
          columns={columns}
          rowKey="_id"
          bordered
          pagination={{
            current: currentPage,
            pageSize,
            total: monthFilteredCancelledCases.length,
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

export default CancelledCases;