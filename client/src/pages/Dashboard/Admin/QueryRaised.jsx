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
      name: "Attachment",
      cell: (row) => {
        if (!row.image?.url) {
          return <span style={{ fontSize: "11px", color: "#a0aec0" }}>No attachment</span>;
        }

        const isAudioUrl = (url) => {
          if (!url) return false;
          const lower = url.toLowerCase();
          return (
            lower.endsWith(".mp3") ||
            lower.endsWith(".wav") ||
            lower.endsWith(".ogg") ||
            lower.endsWith(".m4a") ||
            lower.endsWith(".aac") ||
            lower.includes("audio") ||
            lower.includes("recording")
          );
        };

        if (isAudioUrl(row.image.url)) {
          return (
            <div style={{ padding: "4px 8px", background: "#f0f5ff", border: "1px solid #adc6ff", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "2px", width: "100%", minWidth: "160px" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, color: "#1d39c4" }}>🎙️ Recording</span>
              <audio src={row.image.url} controls style={{ width: "100%", height: "24px" }} />
            </div>
          );
        }

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "2px 0" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: "#276749" }}>📸 Photo</span>
            <a href={row.image.url} target="_blank" rel="noreferrer">
              <img
                src={row.image.url}
                alt="attachment"
                style={{
                  maxHeight: "45px",
                  maxWidth: "80px",
                  borderRadius: "4px",
                  border: "1px solid #cbd5e0",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </a>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      minWidth: "180px",
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