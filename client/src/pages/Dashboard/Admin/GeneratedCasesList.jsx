import React, { useState } from "react";
import { Table, Button, Modal, Select, Tag, Space } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import axiosInstance from "../../../config/axios";
import { getBankRoute, getDisplayCustomerName } from "../../../utils/dashboardRecord";
import getBankTagColor from "../getBankTagColor";

const { Option } = Select;

const GeneratedCasesList = ({ allCases = [], refreshData, fieldOfficers = [] }) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);

  // Filter cases that are generated / unassigned pending
  const generatedCases = allCases.filter((item) => {
    const s = String(item.status || "").toLowerCase().trim();
    if (s.includes("cancel") || s.includes("query") || item.approvalStatus === "Declined") return false;
    const isSubmitted = s.includes("final") || s.includes("submit") || item.isReportSubmitted === true || s.includes("done") || s.includes("approved");
    if (isSubmitted) return false;
    const isWip = s.includes("work in progress") || s.includes("working") || s.includes("assigned") || s.includes("progress") || s.includes("visited") || s.includes("reported") || s.includes("reviewed") || (s.includes("pending") && !!item.assignedTo);
    if (isWip) return false;
    return ["pending", "generated", "new", "created", "open"].includes(s) || !item.assignedTo;
  });

  const openAssignModal = (record) => {
    setSelectedCase(record);
    setSelectedOfficer(null);
    setIsAssignModalOpen(true);
  };

  const handleAssignConfirm = async () => {
    if (!selectedOfficer) {
      toast.error("Please select a Field Officer.");
      return;
    }
    if (!selectedCase) return;

    setAssignLoading(true);
    try {
      const bankSlug = getBankRoute(selectedCase);
      const caseRoute = `/bank/${bankSlug}/edit/${selectedCase._id}`;

      await axiosInstance.put("/case/assign", {
        caseId: selectedCase._id,
        fieldOfficerId: selectedOfficer,
        route: caseRoute,
      });

      toast.success("Case assigned to Field Officer successfully!");
      setIsAssignModalOpen(false);
      setSelectedCase(null);
      setSelectedOfficer(null);
      if (refreshData) {
        await refreshData();
      }
    } catch (err) {
      console.error("Assignment error:", err);
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to assign case");
    } finally {
      setAssignLoading(false);
    }
  };

  const columns = [
    {
      title: "Case ID",
      dataIndex: "customCaseId",
      key: "customCaseId",
      render: (text, record) => (
        <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "12px" }}>
          {text || String(record._id).slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      title: "Customer Name",
      key: "customerName",
      render: (_, record) => (
        <span style={{ fontWeight: 500, color: "#334155" }}>
          {getDisplayCustomerName(record)}
        </span>
      ),
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      render: (text) => (
        <Tag color={getBankTagColor(text)} style={{ fontWeight: 600, borderRadius: 4 }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Generated Date",
      key: "createdAt",
      render: (_, record) => {
        const date = record.createdAt || record.dateOfVisit || record.dateOfReport || record.dateOfInspection || record.visitDate;
        return (
          <span style={{ color: "#64748b", fontSize: "12px" }}>
            {date && dayjs(date).isValid() ? dayjs(date).format("DD MMM YYYY, hh:mm A") : "N/A"}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color="blue" style={{ fontWeight: 600, textTransform: "uppercase" }}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const bankSlug = getBankRoute(record);
        return (
          <Space size="middle">
            <Link to={`/bank/${bankSlug}/${record._id}`}>
              <Button type="link" size="small" style={{ fontWeight: 600 }}>
                View
              </Button>
            </Link>
            <Link to={`/bank/${bankSlug}/edit/${record._id}`}>
              <Button type="link" size="small" style={{ fontWeight: 600, color: "#4f46e5" }}>
                Edit
              </Button>
            </Link>
            <Button
              type="primary"
              size="small"
              onClick={() => openAssignModal(record)}
              style={{
                background: "#0f766e",
                borderColor: "#0f766e",
                fontWeight: 600,
                fontSize: "12px",
                borderRadius: "4px",
              }}
            >
              Assign Officer
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Table
        dataSource={generatedCases}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        locale={{ emptyText: "No generated cases found." }}
        className="custom-premium-table"
      />

      <Modal
        title="Assign Case to Field Officer"
        open={isAssignModalOpen}
        onOk={handleAssignConfirm}
        onCancel={() => setIsAssignModalOpen(false)}
        okText="Assign"
        confirmLoading={assignLoading}
        destroyOnClose
        style={{ maxWidth: "min(450px, 95vw)" }}
      >
        <div style={{ margin: "20px 0" }}>
          <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>
            Select a Field Officer to assign case for{" "}
            <strong>{selectedCase ? getDisplayCustomerName(selectedCase) : ""}</strong>:
          </p>
          <Select
            placeholder="Select Field Officer"
            style={{ width: "100%" }}
            onChange={setSelectedOfficer}
            value={selectedOfficer}
            showSearch
            optionFilterProp="children"
          >
            {fieldOfficers.map((fo) => (
              <Option key={fo._id} value={fo._id}>
                {fo.name} ({fo.assignedCity || "No City"})
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default GeneratedCasesList;
