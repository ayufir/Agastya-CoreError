import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../config/axios";
import { setZone } from "../../redux/features/assignedCase/assignedCasesSlice";

const { Option } = Select;

// Static columns configs moved outside component body to prevent recreation on render
const tatColumns = [
  { name: "Type", selector: (row) => row.type, sortable: true },
  { name: "Total Reports Issued", selector: (row) => row.total, sortable: true },
  { name: "Within TAT", selector: (row) => row.withinTAT, sortable: true },
  { name: "Outside TAT", selector: (row) => row.outsideTAT, sortable: true },
  { name: "Request Sent Back", selector: (row) => row.sentBack, sortable: true },
];

const teamColumns = [
  { name: "Team", selector: (row) => row.name, sortable: true },
  { name: "Request", selector: (row) => row.request, sortable: true },
  { name: "In Progress", selector: (row) => row.inProgress, sortable: true },
  { name: "In Query", selector: (row) => row.inQuery, sortable: true },
  { name: "Pending for Approval", selector: (row) => row.pendingApproval, sortable: true },
  { name: "Completed", selector: (row) => row.completed, sortable: true },
  { name: "Request Approaching TAT", selector: (row) => row.approachingTAT, sortable: true },
];

const MyWorklist = () => {
  const dispatch = useDispatch();
  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);
  const { user } = useSelector((state) => state.auth);

  // Allowed cities logic
  const cities = ["Combined BJG", "Bhopal", "Indore", "Jabalpur", "Gwalior", "Dehradun"];
  const isCentralStaff = ["Bhopal", "Gwalior", "Jabalpur", "Combined BJG"].includes(user?.assignedCity) && !["SuperAdmin", "Admin"].includes(user?.role);
  const allowedCities = isCentralStaff ? ["Combined BJG", "Bhopal", "Jabalpur", "Gwalior"] : cities;

  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);

  // Fetch all cases to calculate stats
  const fetchWorklistCases = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/case/summary-data", {
        params: {
          page: 1,
          limit: 1000,
          city: selectedZone || undefined,
        },
      });
      const items = res.data?.totalSubmissions || res.data?.tableItems || [];
      setCases(items);
    } catch (err) {
      console.error("Error fetching worklist cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorklistCases();
  }, [selectedZone]);

  // 1. Requests Received Card stats (Today, Week, Month, Year)
  const requestsStats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Week start (Sunday)
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - todayStart.getDay());
    
    // Month start
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Year start
    const yearStart = new Date(now.getFullYear(), 0, 1);

    let today = 0, week = 0, month = 0, year = 0;

    cases.forEach((item) => {
      const createdStr = item.createdAt || item.uploadDate || item.createdDate || item.submissionDate;
      if (!createdStr) return;
      const d = new Date(createdStr);
      if (isNaN(d.getTime())) return;

      if (d >= todayStart) today++;
      if (d >= weekStart) week++;
      if (d >= monthStart) month++;
      if (d >= yearStart) year++;
    });

    return { today, week, month, year };
  }, [cases]);

  // 2. Ageing stats
  const ageingStats = useMemo(() => {
    let breached = 0; // > 48 hours
    let critical = 0; // 36-48 hours
    let warning = 0;  // 24-36 hours
    let safe = 0;     // 0-24 hours

    cases.forEach((item) => {
      const statusRaw = item.status || item.caseStatus || item.portalStatus || "";
      const s = statusRaw.toString().toLowerCase().trim().replace(/\s+/g, " ");
      
      const isCompleted = s.includes("final") || s.includes("done") || s.includes("approved") || s.includes("cancel");
      if (isCompleted) return;

      const createdStr = item.createdAt || item.uploadDate || item.createdDate || item.submissionDate;
      if (!createdStr) return;
      const d = new Date(createdStr);
      if (isNaN(d.getTime())) return;

      const hours = (new Date() - d) / (1000 * 60 * 60);
      if (hours > 48) breached++;
      else if (hours > 36) critical++;
      else if (hours > 24) warning++;
      else safe++;
    });

    return { breached, critical, warning, safe };
  }, [cases]);



  const tatData = useMemo(() => {
    const stats = {
      APF: { type: "APF", total: 0, withinTAT: 0, outsideTAT: 0, sentBack: 0 },
      IND: { type: "IND", total: 0, withinTAT: 0, outsideTAT: 0, sentBack: 0 },
    };

    cases.forEach((item) => {
      let type = "IND";
      const rawType = (item.caseType || "").toString().toUpperCase();
      if (rawType.includes("APF")) {
        type = "APF";
      }

      stats[type].total++;

      const statusRaw = item.status || item.caseStatus || item.portalStatus || "";
      const s = statusRaw.toString().toLowerCase().trim().replace(/\s+/g, " ");
      const isSentBack = s.includes("query") || item.approvalStatus === "Declined";

      const createdStr = item.createdAt || item.uploadDate || item.createdDate || item.submissionDate;
      let isOutside = false;
      if (createdStr) {
        const d = new Date(createdStr);
        if (!isNaN(d.getTime())) {
          const hours = (new Date() - d) / (1000 * 60 * 60);
          if (hours > 48 && !s.includes("final") && !s.includes("done") && !s.includes("approved") && !s.includes("cancel")) {
            isOutside = true;
          }
        }
      }

      if (isSentBack) {
        stats[type].sentBack++;
      }

      if (isOutside) {
        stats[type].outsideTAT++;
      } else {
        stats[type].withinTAT++;
      }
    });

    return Object.values(stats);
  }, [cases]);



  const teamData = useMemo(() => {
    const map = {};

    cases.forEach((item) => {
      const assignedFO = item.assignedTo;
      // Use the actual assigned user object as the single source of truth
      const engineer = (assignedFO && typeof assignedFO === "object") ? assignedFO.name : "Unassigned";

      if (!map[engineer]) {
        map[engineer] = {
          name: engineer,
          request: 0,
          inProgress: 0,
          inQuery: 0,
          pendingApproval: 0,
          completed: 0,
          approachingTAT: 0,
        };
      }

      const row = map[engineer];

      const statusRaw = item.status || item.caseStatus || item.portalStatus || "";
      const s = statusRaw.toString().toLowerCase().trim().replace(/\s+/g, " ");

      const isCompleted = s.includes("final") || s.includes("done") || s.includes("approved") || s.includes("complete") || s.includes("cancel") || item.approvalStatus === "FinalSubmitted";
      const inQuery = s.includes("query") && !isCompleted;
      const pendingApproval = item.isReportSubmitted === true && !isCompleted && !inQuery;

      const approvalStatusNormalized = (item.approvalStatus || "Pending").trim();
      // New Case Request: Assigned but not accepted yet (approvalStatus is Pending, and not yet submitted, and not in query/completed)
      const isNew = approvalStatusNormalized === "Pending" && !item.isReportSubmitted && !isCompleted && !inQuery;

      // In Progress (WIP): Accepted by FO, not yet submitted, not in query/completed
      const inProgress = (approvalStatusNormalized === "Accepted" || approvalStatusNormalized === "Work in Progress" || s.includes("work in progress") || s.includes("working")) && !item.isReportSubmitted && !isCompleted && !inQuery;

      let approachingTAT = false;
      const createdStr = item.createdAt || item.uploadDate || item.createdDate || item.submissionDate;
      if (createdStr && (inProgress || isNew)) {
        const d = new Date(createdStr);
        if (!isNaN(d.getTime())) {
          const hours = (new Date() - d) / (1000 * 60 * 60);
          if (hours >= 36 && hours <= 48) {
            approachingTAT = true;
          }
        }
      }

      if (isNew) row.request++;
      if (inProgress) row.inProgress++;
      if (inQuery) row.inQuery++;
      if (pendingApproval) row.pendingApproval++;
      if (isCompleted) row.completed++;
      if (approachingTAT) row.approachingTAT++;
    });

    return Object.values(map)
      .filter((eng) => eng.name !== "Unassigned" || (eng.request + eng.inProgress + eng.inQuery + eng.pendingApproval + eng.completed) > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [cases]);

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ width: 24, height: 24, border: "3px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
            <span className="text-gray-500 font-medium">Loading Stats...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Requests Received and Ageing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Requests Received */}
            <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
              <h5 className="text-[#AC2321] text-lg font-semibold mb-4">Requests Received</h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
                  Today <br /> <span className="font-semibold">{requestsStats.today}</span>
                </div>
                <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
                  This Week <br /> <span className="font-semibold">{requestsStats.week}</span>
                </div>
                <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
                  This Month <br /> <span className="font-semibold">{requestsStats.month}</span>
                </div>
                <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
                  This Year <br /> <span className="font-semibold">{requestsStats.year}</span>
                </div>
              </div>
            </div>

            {/* Ageing */}
            <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
              <h5 className="text-[#AC2321] text-lg font-semibold mb-4">Ageing (Work In Progress Requests)</h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
                  Breached <br /> 90% <br /> <span className="font-semibold">{ageingStats.breached}</span>
                </div>
                <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
                  Critical <br /> 70%-90% <br /> <span className="font-semibold">{ageingStats.critical}</span>
                </div>
                <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
                  Warning <br /> 50%-70% <br /> <span className="font-semibold">{ageingStats.warning}</span>
                </div>
                <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
                  Safe <br /> 0%-50% <br /> <span className="font-semibold">{ageingStats.safe}</span>
                </div>
              </div>
            </div>
          </div>

          {/* TAT Table */}
          <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200 mb-6">
            <h5 className="text-[#AC2321] text-lg font-semibold mb-4">TAT</h5>
            <DataTable
              columns={tatColumns}
              data={tatData}
              highlightOnHover
              striped
              customStyles={{
                rows: { style: { minHeight: "48px" } },
                headCells: {
                  style: {
                    backgroundColor: "#F9FAFB",
                    color: "#374151",
                    fontWeight: "bold",
                  },
                },
              }}
            />
          </div>

          {/* Team Activity Table */}
          <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
            <h5 className="text-[#AC2321] text-lg font-semibold mb-4">Team Activity</h5>
            <DataTable
              columns={teamColumns}
              data={teamData}
              pagination
              paginationPerPage={20}
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
              highlightOnHover
              striped
              customStyles={{
                rows: { style: { minHeight: "48px" } },
                headCells: {
                  style: {
                    backgroundColor: "#F9FAFB",
                    color: "#374151",
                    fontWeight: "bold",
                  },
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MyWorklist;
