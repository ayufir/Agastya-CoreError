import React from "react";
import DataTable from "react-data-table-component";

const MyWorklist = () => {
  const tatColumns = [
    { name: "Type", selector: (row) => row.type, sortable: true },
    { name: "Total Reports Issued", selector: (row) => row.total, sortable: true },
    { name: "Within TAT", selector: (row) => row.withinTAT, sortable: true },
    { name: "Outside TAT", selector: (row) => row.outsideTAT, sortable: true },
    { name: "Request Sent Back", selector: (row) => row.sentBack, sortable: true },
  ];

  const tatData = [
    { type: "APF", total: 0, withinTAT: 0, outsideTAT: 0, sentBack: 0 },
    { type: "IND", total: 172, withinTAT: 133, outsideTAT: 2, sentBack: 37 },
  ];

  const teamColumns = [
    { name: "Team", selector: (row) => row.name, sortable: true },
    { name: "Request", selector: (row) => row.request, sortable: true },
    { name: "In Progress", selector: (row) => row.inProgress, sortable: true },
    { name: "In Query", selector: (row) => row.inQuery, sortable: true },
    { name: "Pending for Approval", selector: (row) => row.pendingApproval, sortable: true },
    { name: "Request Approaching TAT", selector: (row) => row.approachingTAT, sortable: true },
  ];

  const teamData = [
    { name: "Saket Thakur", request: 54, inProgress: 0, inQuery: 2, pendingApproval: 1, approachingTAT: 0 },
    { name: "Bharat Sharma", request: 43, inProgress: 5, inQuery: 2, pendingApproval: 0, approachingTAT: 3 },
    { name: "Lokesh Sharma", request: 28, inProgress: 1, inQuery: 0, pendingApproval: 1, approachingTAT: 3 },
    { name: "Shubham Rathore", request: 2, inProgress: 0, inQuery: 0, pendingApproval: 0, approachingTAT: 0 },
  ];

  return (
    <div className="p-4">
      {/* Requests Received and Ageing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Requests Received */}
        <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
          <h5 className="text-[#AC2321] text-lg font-semibold mb-4">Requests Received</h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
              Today <br /> <span className="font-semibold">5</span>
            </div>
            <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
              This Week <br /> <span className="font-semibold">13</span>
            </div>
            <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
              This Month <br /> <span className="font-semibold">130</span>
            </div>
            <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
              This Year <br /> <span className="font-semibold">361</span>
            </div>
          </div>
        </div>

        {/* Ageing */}
        <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-200">
          <h5 className="text-[#AC2321] text-lg font-semibold mb-4">Ageing (Work In Progress Requests)</h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
              Breached <br /> 90% <br /> <span className="font-semibold">0</span>
            </div>
            <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
              Critical <br /> 70%-90% <br /> <span className="font-semibold">0</span>
            </div>
            <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
              Warning <br /> 50%-70% <br /> <span className="font-semibold">0</span>
            </div>
            <div className="bg-gray-100 border rounded-lg h-28 flex flex-col items-center justify-center text-base font-medium">
              Safe <br /> 0%-50% <br /> <span className="font-semibold">0</span>
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
    </div>
  );
};

export default MyWorklist;
