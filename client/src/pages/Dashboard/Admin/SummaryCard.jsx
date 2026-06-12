import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Input, Select } from "antd";
import { useSelector } from "react-redux";

import axiosInstance from "../../../config/axios";

const { Option } = Select;

const readValue = (record, paths) => {
  for (const path of paths) {
    const value = path
      .split(".")
      .reduce(
        (accumulator, key) =>
          accumulator && accumulator[key] !== undefined
            ? accumulator[key]
            : undefined,
        record
      );

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return "N/A";
};

const isSameMonth = (date, monthValue) => {
  if (!date || !monthValue) return true;

  const d = new Date(date);
  if (isNaN(d.getTime())) return false;

  const yyyyMm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return yyyyMm === monthValue;
};

const normalizeSummaryRecord = (record, index) => ({
  ...record,
  key: record._id || index,
  customerName: readValue(record, [
    "customerName",
    "visitedPersonName",
    "applicantName",
    "basicDetails.nameOfClient",
    "propertyInfo.applicantName",
    "summary.applicantName",
    "header.contactedPerson",
  ]),
  propertyAddress: readValue(record, [
    "addressLegal",
    "legalAddress",
    "addressSite",
    "propertyAddress",
    "address",
    "locationDetails.propertyAddressAsVisit",
    "locationDetails.propertyAddressAsDocs",
    "propertyInfo.addressAtSite",
    "propertyInfo.addressAsPerDocument",
    "summary.propertyAddress",
  ]),
  constructionStage: readValue(record, [
    "constructionStage",
    "constructionStatus",
    "propertyStatus",
    "percentCompleted",
    "technicalDetails.percentCompletion",
    "valuationDetails.percentageCompletion",
  ]),
  dateOfVisit: readValue(record, [
    "dateOfVisit",
    "dateOfReport",
    "basicDetails.visitDate",
    "header.dateOfVisit",
  ]),
  createdAt: readValue(record, [
    "createdAt",
    "createdDate",
    "submissionDate",
    "dateOfVisit",
    "dateOfReport",
    "basicDetails.createdAt",
    "header.createdAt",
  ]),
});

const columns = [
  {
    title: "Bank",
    dataIndex: "bankName",
    key: "bankName",
  },
  {
    title: "Customer Name",
    dataIndex: "customerName",
    key: "customerName",
  },
  {
    title: "Address",
    dataIndex: "propertyAddress",
    key: "propertyAddress",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Construction Stage",
    dataIndex: "constructionStage",
    key: "constructionStage",
  },
  {
    title: "Date of Visit",
    dataIndex: "dateOfVisit",
    key: "dateOfVisit",
  },
];

const SummaryCard = ({ selectedMonth }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterOptions, setFilterOptions] = useState({
    banks: [],
    statuses: [],
  });

  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);

  const bankFilter = useMemo(() => selectedBanks.join(","), [selectedBanks]);
  const statusFilter = useMemo(
    () => selectedStatuses.join(","),
    [selectedStatuses]
  );

  const fetchSummaryTable = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/case/summary-data", {
        params: {
          page: 1,
          limit: 1000,
          city: selectedZone || undefined,
          search: debouncedSearch || undefined,
          bankName: bankFilter || undefined,
          status: statusFilter || undefined,
        },
      });

      const items = (response.data?.tableItems || []).map(normalizeSummaryRecord);

      setTableData(items);
      setFilterOptions(
        response.data?.filterOptions || { banks: [], statuses: [] }
      );
    } catch (error) {
      console.error("Failed to load summary table:", error);
    } finally {
      setLoading(false);
    }
  }, [bankFilter, debouncedSearch, selectedZone, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchSummaryTable();
  }, [fetchSummaryTable]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone, selectedMonth, selectedBanks, selectedStatuses, debouncedSearch]);

  const monthFilteredData = useMemo(() => {
    return tableData.filter((item) => isSameMonth(item.createdAt, selectedMonth));
  }, [tableData, selectedMonth]);

  return (
    <>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
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
          {(filterOptions?.banks || []).map((bank) => (
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
          {(filterOptions?.statuses || []).map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>

        <Input
          placeholder="Search all fields..."
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
            setCurrentPage(1);
          }}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <h1>Summary</h1>

      <Table
        columns={columns}
        dataSource={monthFilteredData}
        showSorterTooltip={{ target: "sorter-icon" }}
        bordered
        loading={loading}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: monthFilteredData.length,
          showSizeChanger: true,
        }}
        onChange={(tablePagination) => {
          if (tablePagination.current !== currentPage) {
            setCurrentPage(tablePagination.current);
          }

          if (tablePagination.pageSize !== pageSize) {
            setPageSize(tablePagination.pageSize);
            setCurrentPage(1);
          }
        }}
      />
    </>
  );
};

export default SummaryCard;