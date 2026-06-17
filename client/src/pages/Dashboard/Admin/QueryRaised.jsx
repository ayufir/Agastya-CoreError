import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../config/axios";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { getDisplayCity } from "../../../utils/dashboardRecord";
import socket from "../../../config/socket";
import toast from "react-hot-toast";

const isSameMonth = (date, monthValue) => {
  if (!date || !monthValue) return true;
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === monthValue;
};

const QueryRaised = ({ selectedMonth }) => {
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState({});
  const [caseMap, setCaseMap] = useState({});
  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);

  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get("/notes/get");
      const noteList = res.data || [];
      setNotes(noteList);

      const userIds = [...new Set(noteList.map((note) => note.addedBy).filter(Boolean))];

      const userResponses = await Promise.all(
        userIds.map((id) => axiosInstance.get(`/auth/currentUser/${id}`))
      );

      const userMap = {};
      userResponses.forEach((res, idx) => {
        userMap[userIds[idx]] = res.data;
      });
      setUsers(userMap);

      const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

      const caseIds = [...new Set(noteList.map((note) => note.caseId).filter(Boolean))];
      const validCaseIds = caseIds.filter(isValidObjectId);

      const caseResponses = await Promise.all(
        validCaseIds.map((id) => axiosInstance.get(`/case/${id}`))
      );

      const caseDataMap = {};
      caseResponses.forEach((res, idx) => {
        caseDataMap[validCaseIds[idx]] = res.data;
      });
      setCaseMap(caseDataMap);
    } catch (error) {
      console.log("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchNotes();

    const handleNewNotification = () => {
      fetchNotes();
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, []);

  const columns = [
    {
      name: "Bank Name",
      selector: (row) => caseMap[row.caseId]?.bankName || "N/A",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => caseMap[row.caseId]?.customerName || "N/A",
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role || "N/A",
      sortable: true,
    },
    {
      name: "User",
      selector: (row) => users[row.addedBy]?.name || "Unknown User",
      sortable: true,
    },
    {
      name: "Message",
      selector: (row) => row.message || "N/A",
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) =>
        new Date(row.createdAt).toLocaleString("en-IN", {
          dateStyle: "short",
          timeStyle: "short",
        }),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => {
        const caseData = caseMap[row.caseId];
        return (
          <button
            onClick={() => handleResolveQuery(row.caseId, caseData?.bankName)}
            disabled={!caseData}
            style={{
              padding: "4px 8px",
              backgroundColor: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              opacity: caseData ? 1 : 0.5
            }}
          >
            Resolve Query
          </button>
        );
      },
    },
  ];

  const handleResolveQuery = async (caseId, bankName) => {
    if (!caseId || !bankName) return;
    try {
      if (window.confirm("Are you sure you want to resolve this query and set the status back to Work in Progress?")) {
        await axiosInstance.put("/case/status", {
          caseId,
          status: "Work in Progress",
          note: "Query resolved by admin.",
          bankName
        });
        toast.success("Query resolved and status changed to Work in Progress.");
        fetchNotes();
      }
    } catch (error) {
      console.error("Error resolving query:", error.message);
      toast.error("Failed to resolve query.");
    }
  };

  const filteredNotes = useMemo(() => {
    const selectedZones = String(selectedZone || "")
      .split(",")
      .map((zone) => zone.trim().toLowerCase())
      .filter(Boolean);

    return notes.filter((note) => {
      const caseData = caseMap[note.caseId];

      if (caseData && caseData.status !== "Query Raised") {
        return false;
      }

      const noteDate =
        note.createdAt ||
        note.createdDate ||
        caseData?.createdAt ||
        caseData?.createdDate ||
        caseData?.basicDetails?.createdAt ||
        caseData?.header?.createdAt;

      if (!isSameMonth(noteDate, selectedMonth)) return false;

      if (selectedZones.length === 0) return true;

      if (!caseData) return true;

      const city = getDisplayCity(caseData);
      const normalizedCity = String(city || "").toLowerCase();

      return selectedZones.some((zone) => normalizedCity.includes(zone));
    });
  }, [notes, caseMap, selectedZone, selectedMonth]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Query Raised ({filteredNotes.length})
      </h2>

      <DataTable
        columns={columns}
        data={filteredNotes}
        pagination
        highlightOnHover
        striped
        dense
      />
    </div>
  );
};

export default QueryRaised;