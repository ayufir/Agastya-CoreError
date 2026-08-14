import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, Input, Select } from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

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

const formatDate = (val) => {
  if (!val || val === "N/A") return "N/A";
  const d = dayjs(val);
  if (!d.isValid()) return val;
  return d.format("DD/MM/YYYY");
};

const isSameMonth = (date, monthValue) => {
  if (!date || date === "N/A" || !monthValue) return true;

  const d = new Date(date);
  if (isNaN(d.getTime())) return true;

  const yyyyMm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return yyyyMm === monthValue;
};

const normalizeSummaryRecord = (record, index) => {
  const rawVisitDate = readValue(record, [
    "dateOfVisit",
    "dateOfReport",
    "basicDetails.visitDate",
    "basicDetails.visit_date",
    "property.basic_details.visit_date",
    "header.dateOfVisit",
    "createdAt",
    "uploadDate",
    "createdDate",
  ]);

  return {
    ...record,
    key: record._id || index,
    _rawDate: record.createdAt || record.uploadDate || record.dateOfVisit || record.submissionDate,
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
      "percentageCompletion",
      "completionPercentage",
      "technicalDetails.percentCompletion",
      "valuationDetails.percentageCompletion",
      "valuation_details.completion_percentage",
      "property.valuation_details.completion_percentage",
      "accommodation_details.quality_of_construction",
      "property.accommodation_details.quality_of_construction",
    ]),
    dateOfVisit: formatDate(rawVisitDate),
    createdAt: readValue(record, [
      "createdAt",
      "createdDate",
      "submissionDate",
      "dateOfVisit",
      "dateOfReport",
      "basicDetails.createdAt",
      "header.createdAt",
    ]),
  };
};

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

const SummaryCard = ({ selectedMonth, preloadedCases }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
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
    if (preloadedCases && preloadedCases.length > 0) return;
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
          month: selectedMonth || undefined,
        },
      });

      const items = (
        response.data?.totalSubmissions ||
        response.data?.tableItems ||
        []
      ).map(normalizeSummaryRecord);

      setTableData(items);
      setFilterOptions(
        response.data?.filterOptions || { banks: [], statuses: [] }
      );
    } catch (error) {
      console.error("Failed to load summary table:", error);
    } finally {
      setLoading(false);
    }
  }, [bankFilter, debouncedSearch, selectedZone, statusFilter, selectedMonth, preloadedCases]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    if (preloadedCases && preloadedCases.length > 0) {
      setTableData(preloadedCases.map((rec, idx) => normalizeSummaryRecord(rec, idx)));
    } else {
      fetchSummaryTable();
    }
  }, [preloadedCases, fetchSummaryTable]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedZone, selectedMonth, selectedBanks, selectedStatuses, debouncedSearch]);

  const monthFilteredData = useMemo(() => {
    if (preloadedCases) return tableData;
    return tableData.filter((item) => {
      const caseDate =
        item._rawDate ||
        item.createdAt ||
        item.uploadDate ||
        item.createdDate ||
        item.submissionDate;
      return isSameMonth(caseDate, selectedMonth);
    });
  }, [tableData, selectedMonth, preloadedCases]);

  const bankOptions = useMemo(() => {
    const source = tableData || [];
    if (source.length > 0) {
      const set = new Set();
      source.forEach((item) => {
        const bank = item.bankName || item.bankSlug || "";
        if (bank && bank !== "N/A") set.add(bank);
      });
      if (set.size > 0) return Array.from(set).sort();
    }
    return filterOptions?.banks || [];
  }, [tableData, filterOptions]);

  const statusOptions = useMemo(() => {
    const source = tableData || [];
    if (source.length > 0) {
      const set = new Set();
      source.forEach((item) => {
        if (item.status && item.status !== "N/A") set.add(item.status);
      });
      if (set.size > 0) return Array.from(set).sort();
    }
    return filterOptions?.statuses || [];
  }, [tableData, filterOptions]);

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