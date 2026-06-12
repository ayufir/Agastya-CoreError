// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   acceptCaseById,
//   fetchCases,
// } from "../../../redux/features/case/caseThunks";
// import { allCaseUserById } from "../../../redux/features/Note/notesSlice";
// import { Card, Spin, Table, Button, Modal, Input, Select, Tag } from "antd";
// import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import CaseNotes from "../../../components/CaseNotes";
// import dayjs from "dayjs";
// import { CheckCheck, Eye } from "lucide-react";

// const { Search } = Input;
// const { Option } = Select;

// const STATUS_TYPES = [
//   { title: "Total Assigned", value: "TOTAL_ASSIGNED" },
//   // { title: "Today Case", value: "TODAY_CASE" },
//   { title: "Pending for Approval", value: "PENDING_FOR_APPROVAL" },
//   { title: "Query Raised", value: "QUERY_RAISED" },
//   { title: "Action Pending", value: "ACTION_PENDING" },
// ];

// const FieldOfficerDashboard = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { cases, loading } = useSelector((state) => state.case) || {};
//   const foCases = cases;
//   const { allCase } = useSelector((state) => state?.notes || {});

//   const [selectedCaseId, setSelectedCaseId] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("TOTAL_ASSIGNED");
//   const [selectedBank, setSelectedBank] = useState(null);

//   const navigate = useNavigate();

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     if (user?._id) {
//       dispatch(fetchCases(user._id));
//       dispatch(allCaseUserById());
//     }
//   }, [dispatch, user?._id]);

//   // Get unique banks from cases
//   const bankOptions = [
//     ...new Set(foCases?.map((caseItem) => caseItem.bankName)),
//   ];

//   const handleAccept = async (id, bankName) => {
//     try {
//       const res = await dispatch(acceptCaseById({ id, bankName })).unwrap();
//       toast.success("Case accepted successfully");
//       navigate(0);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const filterCases = () => {
//     let filtered = foCases;

//     // Filter by status first
//     if (selectedStatus !== "TOTAL_ASSIGNED") {
//       if (selectedStatus === "QUERY_RAISED") {
//         return allCase?.filter((c) => c.addedBy === user._id);
//       }
//       filtered = filtered?.filter(
//         (caseItem) => caseItem.status === selectedStatus
//       );
//     }

//     // Then filter by selected bank if any
//     if (selectedBank) {
//       filtered = filtered?.filter(
//         (caseItem) => caseItem.bankName === selectedBank
//       );
//     }

//     return filtered;
//   };

//   const handleSearch = (value) => {
//     setSearchText(value.toLowerCase());
//   };

//   const isToday = (dateString) => {
//     return dayjs(dateString).isSame(dayjs(), "day");
//   };

//   const filteredCases = filterCases()?.filter((caseItem) => {
//     if (!searchText) return true;

//     return (
//       caseItem.bankName?.toLowerCase().includes(searchText) ||
//       caseItem.customerName?.toLowerCase().includes(searchText) ||
//       caseItem.applicantName?.toLowerCase().includes(searchText) ||
//       caseItem.addressLegal?.toLowerCase().includes(searchText) ||
//       caseItem.address?.toLowerCase().includes(searchText) ||
//       caseItem.customerNo?.toLowerCase().includes(searchText) ||
//       caseItem.contactPersonNumber?.toLowerCase().includes(searchText)
//     );
//   });

//   // Sort cases - today's cases first
//   const sortedCases = [...(filteredCases || [])].sort((a, b) => {
//     const aIsToday = a.createdAt ? isToday(a.createdAt) : false;
//     const bIsToday = b.createdAt ? isToday(b.createdAt) : false;

//     if (aIsToday && !bIsToday) return -1;
//     if (!aIsToday && bIsToday) return 1;
//     return 0;
//   });

//   const summaryCounts = {
//     TOTAL_ASSIGNED: foCases?.length,
//     PENDING_FOR_APPROVAL: foCases?.filter(
//       (c) => c.status === "PENDING_FOR_APPROVAL"
//     ).length,
//     QUERY_RAISED: allCase?.filter((c) => c.addedBy === user._id).length,
//     ACTION_PENDING: foCases?.filter((c) => c.status === "ACTION_PENDING")
//       .length,
//   };

//   const defaultColumns = [
//     {
//       title: "Bank",
//       dataIndex: "bankName",
//       key: "bankName",
//       sorter: (a, b) => a.bankName.localeCompare(b.bankName),
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Customer Name",
//       dataIndex: "customerName",
//       key: "customerName",
//       render: (_, record) => (
//         <span className='text-blue-600 hover:underline'>
//           {record.customerName || record.applicantName || "N/A"}
//         </span>
//       ),
//       sorter: (a, b) => {
//         const nameA = a.customerName || a.applicantName || "";
//         const nameB = b.customerName || b.applicantName || "";
//         return nameA.localeCompare(nameB);
//       },
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Assigned Date",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       render: (date) => (
//         <Tag color={isToday(date) ? "green" : "default"}>
//           {dayjs(date).format("DD/MM/YYYY")}
//         </Tag>
//       ),
//       sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Address",
//       dataIndex: "addressLegal",
//       key: "addressLegal",
//       render: (_, record) => (
//         <span className='text-blue-600 hover:underline'>
//           {record.addressLegal || record.address || "N/A"}
//         </span>
//       ),
//       sorter: (a, b) => {
//         const addressA = a.addressLegal || a.address || "";
//         const addressB = b.addressLegal || b.address || "";
//         return addressA.localeCompare(addressB);
//       },
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Contact Number",
//       dataIndex: "contactNumber",
//       key: "contactNumber",
//       render: (_, record) => (
//         <span className='text-blue-600 hover:underline'>
//           {record.customerNo || record.contactPersonNumber || "N/A"}
//         </span>
//       ),
//       sorter: (a, b) => {
//         const numA = a.customerNo || a.contactPersonNumber || "";
//         const numB = b.customerNo || b.contactPersonNumber || "";
//         return numA.localeCompare(numB);
//       },
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Action",
//       key: "action",
//       dataIndex: "action",
//       render: (_, record) => {
//         if (record?.approvalStatus === "Pending") {
//           return (
//             <Button
//               type='primary'
//               onClick={() => handleAccept(record._id, record.bankName)}
//             >
//               Accept
//             </Button>
//           );
//         } else {
//           return (
//             <Link
//               to={`${record.route}`}
//               className='flex gap-3 text-5xl text-blue-600 hover:underline items-center group transition-all duration-200'
//             >
//               <Eye className='transition-transform group-hover:scale-110 group-hover:text-blue-800' />

//               {record.isReportSubmitted === true && (
//                 <span className='text-green-500 transition-transform group-hover:scale-110 group-hover:text-green-600'>
//                   <CheckCheck />
//                 </span>
//               )}
//             </Link>
//           );
//         }
//       },
//     },
//     {
//       title: "Create Query",
//       dataIndex: "createQuery",
//       key: "createQuery",
//       render: (_, record) => (
//         <Button
//           disabled={record?.isReportSubmitted === true}
//           type='default'
//           onClick={() => {
//             setSelectedCaseId(record._id);
//             setIsModalOpen(true);
//           }}
//         >
//           Mark Query
//         </Button>
//       ),
//     },
//   ];

//   const queryColumns = [
//     {
//       title: "Case ID",
//       dataIndex: "caseId",
//       key: "caseId",
//       sorter: (a, b) => a.caseId.localeCompare(b.caseId),
//       sortDirections: ["descend", "ascend"],
//     },
//     {
//       title: "Message",
//       dataIndex: "message",
//       key: "message",
//       sorter: (a, b) => a.message.localeCompare(b.message),
//       sortDirections: ["descend", "ascend"],
//     },
//   ];

//   return (
//     <div className='p-4 mb-4'>
//       <h2 className='text-2xl font-bold mb-6'>My Assigned Cases</h2>

//       {/* Summary Cards */}
//       <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6'>
//         {STATUS_TYPES.map(({ title, value }) => (
//           <Card
//             key={value}
//             hoverable
//             onClick={() => setSelectedStatus(value)}
//             className={`text-center cursor-pointer border transition-all duration-300 ${
//               selectedStatus === value ? "border-blue-600 shadow-lg" : ""
//             }`}
//           >
//             <div className='text-gray-500 text-sm'>{title}</div>
//             <div className='text-xl font-bold'>{summaryCounts[value] || 0}</div>
//           </Card>
//         ))}
//       </div>

//       {/* Filters */}
//       <div className='flex flex-col md:flex-row gap-4 mb-6'>
//         <div className='flex-1'>
//           <Search
//             placeholder='Search cases...'
//             allowClear
//             enterButton='Search'
//             size='large'
//             onSearch={handleSearch}
//             onChange={(e) => handleSearch(e.target.value)}
//           />
//         </div>
//         <div className='w-full md:w-64'>
//           <Select
//             placeholder='Filter by Bank'
//             allowClear
//             size='large'
//             style={{ width: "100%" }}
//             onChange={(value) => setSelectedBank(value)}
//           >
//             {bankOptions?.map((bank) => (
//               <Option key={bank} value={bank}>
//                 {bank}
//               </Option>
//             ))}
//           </Select>
//         </div>
//       </div>

//       {/* Table Section */}
//       {loading ? (
//         <div className='flex justify-center mt-10'>
//           <Spin size='large' />
//         </div>
//       ) : (
//         <Table
//           dataSource={sortedCases}
//           columns={
//             selectedStatus === "QUERY_RAISED" ? queryColumns : defaultColumns
//           }
//           rowKey={(record) => record._id || record.caseId}
//           bordered
//           pagination={{
//             pageSize: 10,
//             showSizeChanger: true,
//             pageSizeOptions: ["10", "20", "50"],
//             showTotal: (total, range) =>
//               `${range[0]}-${range[1]} of ${total} items`,
//           }}
//         />
//       )}

//       {/* Notes Modal */}
//       <Modal
//         title='Case Notes'
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         footer={null}
//         width={600}
//       >
//         {selectedCaseId && (
//           <CaseNotes caseId={selectedCaseId} onSuccess={closeModal} />
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default FieldOfficerDashboard;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptCaseById,
  declineCaseById,
  fetchCases,
} from "../../../redux/features/case/caseThunks";
import { allCaseUserById } from "../../../redux/features/Note/notesSlice";
import { Card, Spin, Table, Button, Modal, Input, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CaseNotes from "../../../components/CaseNotes";
import dayjs from "dayjs";
import { CheckCheck, Eye, FileText, Download, Briefcase, PlusCircle, Clock, CheckCircle2, AlertTriangle, Search as SearchIcon, Phone, MapPin, X, Check, ArrowRight, Calendar } from "lucide-react";
import {
  getBankRoute,
  getDisplayAddress,
  getDisplayContact,
  getDisplayCustomerName,
} from "../../../utils/dashboardRecord";

const STATUS_TYPES = [
  { title: "New Cases", value: "NEW_CASES", icon: PlusCircle },
  { title: "Pending", value: "PENDING", icon: Clock },
  { title: "Query Raised", value: "QUERY_RAISED", icon: AlertTriangle },
  { title: "Completed", value: "COMPLETED", icon: CheckCircle2 },
  { title: "Total Assigned", value: "TOTAL_ASSIGNED", icon: Briefcase },
];

const FieldOfficerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cases, loading } = useSelector((state) => state.case) || {};
  const foCases = cases;
  const { allCase } = useSelector((state) => state?.notes || {});

  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("TOTAL_ASSIGNED");
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedCaseDocs, setSelectedCaseDocs] = useState([]);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  const navigate = useNavigate();

  const downloadFile = async (url, fileName) => {
    try {
      const downloadUrl = url.includes("imagekit.io")
        ? `${url}${url.includes("?") ? "&" : "?"}ik-attachment=true`
        : url;
      
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error("Network response was not ok");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn("Blob download failed, falling back to direct link:", err);
      const fallbackUrl = url.includes("imagekit.io")
        ? `${url}${url.includes("?") ? "&" : "?"}ik-attachment=true`
        : url;
      window.open(fallbackUrl, "_blank");
    }
  };

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCases(user._id));
      dispatch(allCaseUserById());
    }
  }, [dispatch, user?._id]);

  const bankOptions = [
    ...new Set(foCases?.map((caseItem) => caseItem.bankName).filter(Boolean)),
  ];

  const handleAccept = async (id, bankName) => {
    try {
      await dispatch(acceptCaseById({ id, bankName })).unwrap();
      toast.success("Case accepted successfully");
      navigate(0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecline = async (id, bankName) => {
    try {
      await dispatch(declineCaseById({ id, bankName })).unwrap();
      toast.success("Case declined successfully");
      navigate(0);
    } catch (err) {
      console.log(err);
      toast.error("Failed to decline case");
    }
  };

  const isToday = (dateString) => {
    return dayjs(dateString).isSame(dayjs(), "day");
  };

  const filterCases = () => {
    let filtered = foCases;

    if (selectedStatus !== "TOTAL_ASSIGNED") {
      if (selectedStatus === "QUERY_RAISED") {
        return allCase?.filter((c) => c.addedBy === user._id);
      }
      if (selectedStatus === "NEW_CASES") {
        filtered = filtered?.filter((caseItem) => caseItem.approvalStatus === "Pending");
      } else if (selectedStatus === "PENDING") {
        filtered = filtered?.filter(
          (caseItem) => caseItem.approvalStatus !== "Pending" && !caseItem.isReportSubmitted
        );
      } else if (selectedStatus === "COMPLETED") {
        filtered = filtered?.filter((caseItem) => caseItem.isReportSubmitted === true);
      }
    }

    if (selectedBank) {
      filtered = filtered?.filter(
        (caseItem) => caseItem.bankName === selectedBank
      );
    }

    return filtered;
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredCases = filterCases()?.filter((caseItem) => {
    if (!searchText) return true;

    return [
      caseItem.bankName,
      getDisplayCustomerName(caseItem),
      getDisplayAddress(caseItem),
      getDisplayContact(caseItem),
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  const sortedCases = [...(filteredCases || [])].sort((a, b) => {
    const aIsToday = a.createdAt ? isToday(a.createdAt) : false;
    const bIsToday = b.createdAt ? isToday(b.createdAt) : false;
    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;
    return 0;
  });

  const summaryCounts = {
    TOTAL_ASSIGNED: foCases?.length || 0,
    NEW_CASES: foCases?.filter((c) => c.approvalStatus === "Pending").length || 0,
    PENDING: foCases?.filter((c) => c.approvalStatus !== "Pending" && !c.isReportSubmitted).length || 0,
    COMPLETED: foCases?.filter((c) => c.isReportSubmitted === true).length || 0,
    QUERY_RAISED: allCase?.filter((c) => c.addedBy === user._id).length || 0,
  };

  const defaultColumns = [
    {
      title: "Bank",
      dataIndex: "bankName",
      key: "bankName",
      sorter: (a, b) => a.bankName.localeCompare(b.bankName),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (_, record) => {
        const customerName = getDisplayCustomerName(record);
        const daysElapsed = dayjs().diff(dayjs(record.createdAt), 'day');
        const isDelayed = daysElapsed >= 3 && !record.isReportSubmitted;
        const isPending = record?.approvalStatus === "Pending";

        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              {/* LED Blinking Light Indicator */}
              {isPending && (
                <span className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${isDelayed ? 'led-red' : 'led-blue'}`} title={isDelayed ? "Delayed Unaccepted Case" : "New Case"} />
              )}
              {!isPending && isDelayed && (
                <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 led-amber" title="Delayed Work In Progress" />
              )}

              {isPending ? (
                <span className="text-slate-855 font-bold">
                  {customerName}
                </span>
              ) : (
                <Link
                  to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
                  className="text-indigo-650 hover:text-indigo-855 hover:underline font-bold flex items-center gap-1 group"
                >
                  {customerName}
                </Link>
              )}
              {isDelayed && (
                isPending ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse shadow-sm">
                    NEW ALERT ({daysElapsed}d)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse shadow-sm">
                    OVERDUE ({daysElapsed}d)
                  </span>
                )
              )}
              {isPending && !isDelayed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-750 border border-blue-200 animate-pulse shadow-sm">
                  NEW CASE
                </span>
              )}
            </div>
          </div>
        );
      },
      sorter: (a, b) => {
        const nameA = getDisplayCustomerName(a);
        const nameB = getDisplayCustomerName(b);
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Assigned Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        const isT = isToday(date);
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold ${
            isT 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
              : "bg-slate-50 text-slate-600 border border-slate-100"
          }`}>
            <Clock className="w-3.5 h-3.5" />
            {dayjs(date).format("DD/MM/YYYY hh:mm A")}
          </span>
        );
      },
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Address",
      dataIndex: "addressLegal",
      key: "addressLegal",
      render: (_, record) => (
        <span className="text-slate-700 max-w-[200px] truncate block" title={getDisplayAddress(record)}>
          {getDisplayAddress(record)}
        </span>
      ),
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
      render: (_, record) => {
        const contact = getDisplayContact(record);
        if (contact && contact !== "N/A") {
          return (
            <a 
              href={`tel:${contact}`} 
              className="text-indigo-650 hover:text-indigo-850 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-slate-400" />
              {contact}
            </a>
          );
        }
        return <span className="text-slate-400">N/A</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_, record) => {
        if (record?.approvalStatus === "Pending") {
          return (
            <div className="flex gap-2">
              <Button
                type="primary"
                onClick={() => handleAccept(record._id, record.bankName)}
                className="bg-indigo-600 hover:bg-indigo-750 border-none font-semibold text-xs rounded-xl"
              >
                Accept
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => handleDecline(record._id, record.bankName)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-650 border border-rose-200 hover:border-rose-300 font-semibold text-xs rounded-xl"
              >
                Deny
              </Button>
            </div>
          );
        } else {
          return (
            <Link
              to={`/bank/${getBankRoute(record)}/edit/${record._id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl transition-all border border-indigo-100"
              title="Edit Report"
            >
              <Eye className="w-4 h-4" />
              <span>Edit Report</span>
              {record.isReportSubmitted && (
                <CheckCheck className="text-emerald-600 w-4 h-4 ml-0.5" />
              )}
            </Link>
          );
        }
      },
    },
    {
      title: "Property Paper",
      key: "propertyPaper",
      render: (_, record) => {
        const docs = (record.atsDocuments && record.atsDocuments.length > 0)
          ? record.atsDocuments
          : (record.AttachDocuments || []);
        const hasDocs = docs.length > 0;
        if (hasDocs) {
          return (
            <Button
              type="default"
              onClick={() => {
                setSelectedCaseDocs(docs);
                setIsDocsModalOpen(true);
              }}
              className="text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-300 flex items-center gap-1 font-semibold text-xs px-2.5 py-1.5 rounded-xl transition-all shadow-sm"
              title="View Property Papers"
              icon={<FileText className="w-4 h-4 text-amber-500" />}
            >
              View Paper
            </Button>
          );
        }
        return <span className="text-slate-400 text-xs italic">No Papers</span>;
      },
    },
    {
      title: "Create Query",
      dataIndex: "createQuery",
      key: "createQuery",
      render: (_, record) => (
        <Button
          disabled={record?.isReportSubmitted === true}
          type="default"
          onClick={() => {
            setSelectedCaseId(record._id);
            setIsModalOpen(true);
          }}
          className={`font-semibold text-xs rounded-xl ${
            record?.isReportSubmitted === true
              ? "text-slate-400 bg-slate-50 border-slate-200"
              : "text-slate-700 bg-white border-slate-300 hover:border-slate-400"
          }`}
        >
          Mark Query
        </Button>
      ),
    },
  ];

  const queryColumns = [
    {
      title: "Case ID",
      dataIndex: "caseId",
      key: "caseId",
      render: (text) => <span className="font-semibold text-slate-800">{text}</span>,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text) => <span className="text-slate-600 font-medium">{text}</span>,
    },
  ];

  const isEmpty = sortedCases.length === 0;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 pb-20">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes alert-pulse-red {
          0%, 100% { border-color: rgba(239, 68, 68, 0.2); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.2); }
          50% { border-color: rgba(239, 68, 68, 0.9); box-shadow: 0 0 12px 4px rgba(239, 68, 68, 0.2); }
        }
        @keyframes alert-pulse-amber {
          0%, 100% { border-color: rgba(245, 158, 11, 0.2); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.2); }
          50% { border-color: rgba(245, 158, 11, 0.9); box-shadow: 0 0 12px 4px rgba(245, 158, 11, 0.2); }
        }
        @keyframes alert-pulse-blue {
          0%, 100% { border-color: rgba(59, 130, 246, 0.2); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2); }
          50% { border-color: rgba(59, 130, 246, 0.9); box-shadow: 0 0 12px 4px rgba(59, 130, 246, 0.2); }
        }
        @keyframes led-blink-red {
          0%, 100% { opacity: 0.35; transform: scale(0.9); box-shadow: 0 0 0px rgba(239, 68, 68, 0); }
          50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 8px 3px rgba(239, 68, 68, 0.85); }
        }
        @keyframes led-blink-amber {
          0%, 100% { opacity: 0.35; transform: scale(0.9); box-shadow: 0 0 0px rgba(245, 158, 11, 0); }
          50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 8px 3px rgba(245, 158, 11, 0.85); }
        }
        @keyframes led-blink-blue {
          0%, 100% { opacity: 0.35; transform: scale(0.9); box-shadow: 0 0 0px rgba(59, 130, 246, 0); }
          50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 8px 3px rgba(59, 130, 246, 0.85); }
        }
        .animate-alert-red {
          animation: alert-pulse-red 1.5s infinite ease-in-out;
        }
        .animate-alert-amber {
          animation: alert-pulse-amber 1.5s infinite ease-in-out;
        }
        .animate-alert-blue {
          animation: alert-pulse-blue 1.5s infinite ease-in-out;
        }
        .led-red {
          background-color: #ef4444;
          animation: led-blink-red 0.8s infinite ease-in-out;
        }
        .led-amber {
          background-color: #f59e0b;
          animation: led-blink-amber 0.8s infinite ease-in-out;
        }
        .led-blue {
          background-color: #3b82f6;
          animation: led-blink-blue 0.8s infinite ease-in-out;
        }
      `}} />
      
      {/* Premium Header Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white mb-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Field Operations
              </span>
              <span className="text-slate-400 text-xs">
                • Unique Engineering
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">{user?.name || "Officer"}</span>!
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              {summaryCounts.NEW_CASES > 0 
                ? `You have ${summaryCounts.NEW_CASES} new cases awaiting your acceptance.` 
                : "All caught up! You don't have any new cases pending acceptance."}
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 self-start md:self-auto shadow-inner">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Current Date</div>
              <div className="text-sm font-semibold text-white">
                {dayjs().format("dddd, D MMMM YYYY")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Interactive Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {STATUS_TYPES.map(({ title, value, icon: Icon }) => {
          const isSelected = selectedStatus === value;
          const count = summaryCounts[value] || 0;
          
          const themes = {
            TOTAL_ASSIGNED: {
              active: "border-indigo-500 ring-2 ring-indigo-500/15 bg-indigo-50/30",
              inactive: "border-slate-200 hover:border-indigo-350 bg-white",
              accent: "bg-indigo-500",
              iconBg: "bg-indigo-50 text-indigo-600",
              text: "text-indigo-950",
            },
            NEW_CASES: {
              active: "border-blue-500 ring-2 ring-blue-500/15 bg-blue-50/30",
              inactive: "border-slate-200 hover:border-blue-350 bg-white",
              accent: "bg-blue-500",
              iconBg: "bg-blue-50 text-blue-600",
              text: "text-blue-950",
            },
            PENDING: {
              active: "border-amber-500 ring-2 ring-amber-500/15 bg-amber-50/30",
              inactive: "border-slate-200 hover:border-amber-350 bg-white",
              accent: "bg-amber-500",
              iconBg: "bg-amber-50 text-amber-600",
              text: "text-amber-950",
            },
            COMPLETED: {
              active: "border-emerald-500 ring-2 ring-emerald-500/15 bg-emerald-50/30",
              inactive: "border-slate-200 hover:border-emerald-350 bg-white",
              accent: "bg-emerald-500",
              iconBg: "bg-emerald-50 text-emerald-600",
              text: "text-emerald-950",
            },
            QUERY_RAISED: {
              active: "border-rose-500 ring-2 ring-rose-500/15 bg-rose-50/30",
              inactive: "border-slate-200 hover:border-rose-350 bg-white",
              accent: "bg-rose-500",
              iconBg: "bg-rose-50 text-rose-600",
              text: "text-rose-950",
            }
          };
          
          const t = themes[value];
          
          return (
            <div
              key={value}
              onClick={() => setSelectedStatus(value)}
              className={`cursor-pointer transition-all duration-300 ease-out border rounded-2xl p-4 relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 group ${
                isSelected ? t.active : t.inactive
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${t.accent}`} />
              
              <div className="flex justify-between items-start gap-2">
                <div className="text-left">
                  <span className="text-slate-400 text-[10px] md:text-xs font-bold tracking-wider uppercase block mb-1">
                    {title}
                  </span>
                  <span className={`text-2xl md:text-3xl font-extrabold tracking-tight ${t.text}`}>
                    {count}
                  </span>
                </div>
                <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-sm ${t.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Filter and Search Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 md:p-5 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <SearchIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by customer, address, contact..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-slate-850 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
            {searchText && (
              <button
                onClick={() => {
                  setSearchText("");
                  handleSearch("");
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-450 font-bold uppercase mr-1">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span>Filter Bank:</span>
            </div>
            {selectedBank && (
              <button
                onClick={() => setSelectedBank(null)}
                className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 font-semibold flex items-center gap-1 transition-colors"
              >
                Clear <X className="w-3 h-3" />
              </button>
            )}
            <div className="flex flex-wrap gap-1.5">
              {bankOptions.map((bank) => {
                const todayCount = foCases.filter(
                  (item) => item.bankName === bank && isToday(item.createdAt)
                ).length;
                const isBankSelected = selectedBank === bank;
                
                return (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(isBankSelected ? null : bank)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all duration-200 cursor-pointer ${
                      isBankSelected
                        ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    {bank}
                    {todayCount > 0 && (
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                        isBankSelected ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
                      }`}>
                        {todayCount} new
                      </span>
                    )}
                  </button>
                );
              })}
              {bankOptions.length === 0 && (
                <span className="text-slate-400 text-xs italic">No banks available</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Cases Container */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Spin size="large" />
          <span className="text-slate-400 text-sm font-semibold mt-4">Loading assigned cases...</span>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-100 shadow-inner">
            <Briefcase className="w-8 h-8 text-slate-350" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No cases found</h3>
          <p className="text-slate-400 text-sm max-w-sm mt-1">
            {selectedStatus !== "TOTAL_ASSIGNED" || selectedBank || searchText
              ? "We couldn't find any cases matching your current filters. Try resetting them."
              : "You don't have any cases assigned in this category right now."}
          </p>
          {(selectedStatus !== "TOTAL_ASSIGNED" || selectedBank || searchText) && (
            <button
              onClick={() => {
                setSelectedStatus("TOTAL_ASSIGNED");
                setSelectedBank(null);
                setSearchText("");
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop View (Data Table) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <Table
              dataSource={sortedCases}
              columns={
                selectedStatus === "QUERY_RAISED" ? queryColumns : defaultColumns
              }
              rowKey={(record) => record._id || record.caseId}
              bordered={false}
              className="custom-premium-table"
              rowClassName={(record) => {
                const daysElapsed = dayjs().diff(dayjs(record.createdAt), 'day');
                const isDelayed = daysElapsed >= 3 && !record.isReportSubmitted;
                const isPending = record.approvalStatus === "Pending";
                if (isDelayed) {
                  return isPending 
                    ? "bg-rose-50/15 hover:bg-rose-50/25 transition-colors border-l-4 border-l-rose-500 animate-alert-red" 
                    : "bg-amber-50/15 hover:bg-amber-50/25 transition-colors border-l-4 border-l-amber-500 animate-alert-amber";
                }
                if (isPending) {
                  return "bg-blue-50/10 hover:bg-blue-50/20 transition-colors border-l-4 border-l-blue-400 animate-alert-blue";
                }
                return "hover:bg-slate-50/50 transition-colors";
              }}
              scroll={{ x: "max-content" }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} cases`,
              }}
            />
          </div>

          {/* Mobile View (Visual Responsive Card List) */}
          <div className="md:hidden space-y-4">
            {sortedCases.map((caseItem) => {
              const customerName = getDisplayCustomerName(caseItem);
              const address = getDisplayAddress(caseItem);
              const contact = getDisplayContact(caseItem);
              const bankRoute = getBankRoute(caseItem);
              const isPending = caseItem.approvalStatus === "Pending";
              const dateFormatted = dayjs(caseItem.createdAt).format("DD/MM/YYYY hh:mm A");
              const isT = isToday(caseItem.createdAt);
              const daysElapsed = dayjs().diff(dayjs(caseItem.createdAt), 'day');
              const isDelayed = daysElapsed >= 3 && !caseItem.isReportSubmitted;
              
              const docs = (caseItem.atsDocuments && caseItem.atsDocuments.length > 0)
                ? caseItem.atsDocuments
                : (caseItem.AttachDocuments || []);
              const hasDocs = docs.length > 0;

              if (selectedStatus === "QUERY_RAISED") {
                return (
                  <div 
                    key={caseItem._id || caseItem.caseId}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all mb-4 relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500" />
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Case ID</span>
                      <span className="text-xs font-bold px-2 py-0.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                        Query
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-800 mb-2 truncate">
                      {caseItem.caseId || "N/A"}
                    </div>
                    <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100 min-h-[4rem]">
                      <span className="font-bold text-slate-400 block mb-1 text-[10px] uppercase">Message:</span>
                      {caseItem.message || "No detailed query message provided."}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={caseItem._id}
                  className={`bg-white rounded-2xl border p-4.5 shadow-sm hover:shadow-md transition-all relative overflow-hidden ${
                    isDelayed 
                      ? (isPending ? "animate-alert-red border-2 border-rose-300" : "animate-alert-amber border-2 border-amber-300")
                      : (isPending ? "animate-alert-blue border-2 border-blue-300" : "border-slate-150")
                  }`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isPending 
                      ? "bg-blue-500" 
                      : caseItem.isReportSubmitted 
                        ? "bg-emerald-500" 
                        : "bg-amber-500"
                  }`} />

                  {/* Mobile Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* LED Blinking Light Indicator */}
                      {isPending && (
                        <span className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${isDelayed ? 'led-red' : 'led-blue'}`} />
                      )}
                      {!isPending && isDelayed && (
                        <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 led-amber" />
                      )}

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white shadow-sm">
                        {caseItem.bankName}
                      </span>
                      {isDelayed && (
                        isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-50 text-rose-700 border border-rose-250 animate-pulse">
                            NEW ALERT ({daysElapsed}d)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-250 animate-pulse">
                            OVERDUE ({daysElapsed}d)
                          </span>
                        )
                      )}
                      {isPending && !isDelayed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-750 border border-blue-200 animate-pulse">
                          NEW CASE
                        </span>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      isT 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "bg-slate-50 text-slate-600 border border-slate-100"
                    }`}>
                      <Clock className="w-3 h-3" />
                      {dateFormatted}
                    </span>
                  </div>

                  {/* Customer Name info */}
                  <div className="mb-3">
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">Customer Name</div>
                    {isPending ? (
                      <div className="text-base font-bold text-slate-850">
                        {customerName}
                      </div>
                    ) : (
                      <Link
                        to={`/bank/${bankRoute}/edit/${caseItem._id}`}
                        className="text-base font-extrabold text-indigo-650 hover:text-indigo-850 hover:underline flex items-center gap-1 group"
                      >
                        {customerName}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 text-indigo-500" />
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-slate-100 my-3" />

                  {/* Contact & Address */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="text-xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase mb-0.5">Contact Number</span>
                        {contact && contact !== "N/A" ? (
                          <a 
                            href={`tel:${contact}`} 
                            className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1.5 mt-0.5"
                          >
                            {contact}
                            <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-extrabold tracking-wide uppercase">Call Now</span>
                          </a>
                        ) : (
                          <span className="text-slate-500">N/A</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="text-xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase mb-0.5">Address</span>
                        <span className="text-slate-700 font-medium line-clamp-2" title={address}>
                          {address}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions block */}
                  <div className="border-t border-slate-100 pt-3.5 flex flex-col gap-2">
                    {isPending ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAccept(caseItem._id, caseItem.bankName)}
                          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs rounded-xl transition-all shadow-sm text-center flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Accept
                        </button>
                        <button
                          onClick={() => handleDecline(caseItem._id, caseItem.bankName)}
                          className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold text-xs rounded-xl border border-rose-100 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4" /> Deny
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                        <div className="flex gap-2">
                          <Link
                            to={`/bank/${bankRoute}/edit/${caseItem._id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs rounded-xl transition-all border border-indigo-100"
                            title="Edit Report"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Edit</span>
                            {caseItem.isReportSubmitted && (
                              <CheckCheck className="text-emerald-600 w-4 h-4 ml-0.5" />
                            )}
                          </Link>

                          {hasDocs && (
                            <button
                              onClick={() => {
                                setSelectedCaseDocs(docs);
                                setIsDocsModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs rounded-xl transition-all border border-amber-150"
                              title="Property Paper"
                            >
                              <FileText className="w-4 h-4 text-amber-500" />
                              <span>Papers</span>
                            </button>
                          )}
                        </div>

                        <button
                          disabled={caseItem.isReportSubmitted === true}
                          onClick={() => {
                            setSelectedCaseId(caseItem._id);
                            setIsModalOpen(true);
                          }}
                          className={`inline-flex items-center gap-1 px-3 py-2 font-bold text-xs rounded-xl transition-all border ${
                            caseItem.isReportSubmitted === true
                              ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-white hover:bg-slate-50 border-slate-300 text-slate-700 cursor-pointer"
                          }`}
                        >
                          Mark Query
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Notes Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 font-bold text-slate-800 text-lg">
            <FileText className="w-5 h-5 text-indigo-650" />
            <span>Case Notes / Mark Query</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
        className="rounded-2xl overflow-hidden"
      >
        <div className="py-4">
          {selectedCaseId && (
            <CaseNotes
              caseId={selectedCaseId}
              onSuccess={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </Modal>

      {/* Property Papers Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 font-bold text-slate-800 text-lg">
            <FileText className="w-5 h-5 text-indigo-655 text-indigo-600" />
            <span>Property Papers & Documents</span>
          </div>
        }
        open={isDocsModalOpen}
        onCancel={() => setIsDocsModalOpen(false)}
        footer={[
          <button 
            key="close" 
            onClick={() => setIsDocsModalOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        ]}
        width={600}
        className="rounded-2xl overflow-hidden animate-fade-in"
      >
        <div className="py-4">
          {selectedCaseDocs && selectedCaseDocs.length > 0 ? (
            <div className="space-y-3">
              {selectedCaseDocs.map((doc, idx) => {
                const url = typeof doc === "string" ? doc : doc.url || "";
                const name = typeof doc === "string" ? doc.split("/").pop() : doc.name || url.split("/").pop() || `Document_${idx + 1}`;
                const downloadUrl = url.includes("imagekit.io")
                  ? `${url}${url.includes("?") ? "&" : "?"}ik-attachment=true`
                  : url;
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row justify-between sm:items-center p-3.5 border border-slate-150 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all gap-3"
                  >
                    <a 
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-slate-700 hover:text-indigo-600 hover:underline truncate text-xs sm:text-sm max-w-[260px]"
                      title="Click to view document"
                    >
                      {name}
                    </a>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        type="default"
                        href={url}
                        target="_blank"
                        icon={<Eye className="w-4 h-4" />}
                        className="flex items-center justify-center gap-1 text-xs font-bold text-slate-700 border-slate-350 hover:text-indigo-600 hover:border-indigo-500 rounded-xl py-1.5 px-3"
                        title="View Document"
                      >
                        View
                      </Button>
                      <Button
                        type="primary"
                        href={downloadUrl}
                        download={name}
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<Download className="w-4 h-4" />}
                        className="flex items-center justify-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 border-none rounded-xl py-1.5 px-3"
                        title="Download Document"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <span className="font-semibold text-sm">No property papers available for this case.</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FieldOfficerDashboard;
