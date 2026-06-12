// // import { useState, useEffect } from "react";

// // // ─── Static Data ────────────────────────────────────────────────────────────
// // const STATS = [
// //   {
// //     label: "Total Applications",
// //     value: 0,
// //     icon: (
// //       <svg
// //         viewBox="0 0 24 24"
// //         fill="none"
// //         stroke="currentColor"
// //         strokeWidth={2}
// //         className="w-6 h-6"
// //       >
// //         <path
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
// //         />
// //       </svg>
// //     ),
// //     color: "blue",
// //     bg: "bg-blue-50",
// //     border: "border-blue-200",
// //     iconBg: "bg-blue-600",
// //     textColor: "text-blue-700",
// //   },
// //   {
// //     label: "Completed",
// //     value: 0,
// //     icon: (
// //       <svg
// //         viewBox="0 0 24 24"
// //         fill="none"
// //         stroke="currentColor"
// //         strokeWidth={2}
// //         className="w-6 h-6"
// //       >
// //         <path
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
// //         />
// //       </svg>
// //     ),
// //     color: "green",
// //     bg: "bg-green-50",
// //     border: "border-green-200",
// //     iconBg: "bg-green-600",
// //     textColor: "text-green-700",
// //   },
// //   {
// //     label: "Pending",
// //     value: 0,
// //     icon: (
// //       <svg
// //         viewBox="0 0 24 24"
// //         fill="none"
// //         stroke="currentColor"
// //         strokeWidth={2}
// //         className="w-6 h-6"
// //       >
// //         <path
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //           d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
// //         />
// //       </svg>
// //     ),
// //     color: "yellow",
// //     bg: "bg-yellow-50",
// //     border: "border-yellow-200",
// //     iconBg: "bg-yellow-500",
// //     textColor: "text-yellow-700",
// //   },
// //   {
// //     label: "Working",
// //     value: 0,
// //     icon: (
// //       <svg
// //         viewBox="0 0 24 24"
// //         fill="none"
// //         stroke="currentColor"
// //         strokeWidth={2}
// //         className="w-6 h-6"
// //       >
// //         <path
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //           d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
// //         />
// //       </svg>
// //     ),
// //     color: "red",
// //     bg: "bg-red-50",
// //     border: "border-red-200",
// //     iconBg: "bg-red-600",
// //     textColor: "text-red-700",
// //   },
// // ];

// // const NAV_LINKS = [
// //   { label: "Dashboard", icon: "grid", active: true },
// // ];

// // // ─── Custom hook for responsive design ─────────────────────────────────────
// // function useMediaQuery(query) {
// //   const [matches, setMatches] = useState(false);

// //   useEffect(() => {
// //     const media = window.matchMedia(query);
// //     if (media.matches !== matches) {
// //       setMatches(media.matches);
// //     }
// //     const listener = (e) => setMatches(e.matches);
// //     media.addEventListener("change", listener);
// //     return () => media.removeEventListener("change", listener);
// //   }, [matches, query]);

// //   return matches;
// // }

// // // ─── Icon Helper ─────────────────────────────────────────────────────────────
// // function NavIcon({ type }) {
// //   const icons = {
// //     grid: (
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
// //       />
// //     ),
// //     folder: (
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
// //       />
// //     ),
// //     shield: (
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
// //       />
// //     ),
// //     map: (
// //       <>
// //         <path
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //           d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
// //         />
// //         <path
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //           d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
// //         />
// //       </>
// //     ),
// //     bank: (
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
// //       />
// //     ),
// //     users: (
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
// //       />
// //     ),
// //     chart: (
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
// //       />
// //     ),
// //     settings: (
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
// //       />
// //     ),
// //     bell: (
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
// //       />
// //     ),
// //     menu: (
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M4 6h16M4 12h16M4 18h16"
// //       />
// //     ),
// //     search: (
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
// //       />
// //     ),
// //   };
// //   return (
// //     <svg
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       stroke="currentColor"
// //       strokeWidth={1.8}
// //       className="w-5 h-5"
// //     >
// //       {icons[type]}
// //     </svg>
// //   );
// // }

// // // ─── Status Badge ─────────────────────────────────────────────────────────────
// // function Badge({ status }) {
// //   const map = {
// //     Completed: "bg-green-100 text-green-700 border border-green-200",
// //     FinalSubmitted: "bg-green-100 text-green-700 border border-green-200",
// //     Verified: "bg-green-100 text-green-700 border border-green-200",
// //     Approved: "bg-green-100 text-green-700 border border-green-200",
// //     Pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
// //     "Work in Progress": "bg-blue-100 text-blue-700 border border-blue-200",
// //     "Work in Progress": "bg-blue-100 text-blue-700 border border-blue-200",
// //     Rejected: "bg-red-100 text-red-700 border border-red-200",
// //     Incomplete: "bg-orange-100 text-orange-700 border border-orange-200",
// //     cancelled: "bg-red-100 text-red-700 border border-red-200",
// //   };
// //   const displayStatus = status === "Work in Progress" ? "Work in Progress" : status;
// //   return (
// //     <span
// //       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-600"}`}
// //     >
// //       {displayStatus}
// //     </span>
// //   );
// // }

// // // ─── Sidebar ──────────────────────────────────────────────────────────────────
// // function Sidebar({ open, activeNav, setActiveNav, setSidebarOpen, isMobile }) {
// //   const handleNavClick = (label) => {
// //     setActiveNav(label);
// //     if (isMobile) {
// //       setSidebarOpen(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <aside
// //         className={`fixed top-0 left-0 h-full z-30 bg-white border-r border-gray-100 shadow-sm flex flex-col transition-transform duration-300 w-64 ${open ? "translate-x-0" : "-translate-x-full"
// //           }`}
// //       >
// //         <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
// //           <div className="flex items-center gap-3">
// //             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
// //               U
// //             </div>
// //             <div>
// //               <p className="text-sm font-bold text-gray-900 leading-none">
// //                 Unique
// //               </p>
// //             </div>
// //           </div>
// //           {isMobile && (
// //             <button
// //               onClick={() => setSidebarOpen(false)}
// //               className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
// //             >
// //               <svg
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 strokeWidth={2}
// //                 className="w-5 h-5"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   d="M6 18L18 6M6 6l12 12"
// //                 />
// //               </svg>
// //             </button>
// //           )}
// //         </div>

// //         <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
// //           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
// //             Main Menu
// //           </p>
// //           {NAV_LINKS.map((link) => (
// //             <button
// //               key={link.label}
// //               onClick={() => handleNavClick(link.label)}
// //               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeNav === link.label
// //                 ? "bg-blue-600 text-white shadow-sm"
// //                 : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
// //                 }`}
// //             >
// //               <span
// //                 className={
// //                   activeNav === link.label ? "text-white" : "text-gray-400"
// //                 }
// //               >
// //                 <NavIcon type={link.icon} />
// //               </span>
// //               {link.label}
// //             </button>
// //           ))}
// //         </nav>

// //         <div className="p-4 border-t border-gray-100">
// //           <div className="flex items-center gap-3">
// //             <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
// //               AV
// //             </div>
// //             <div className="flex-1 min-w-0">
// //               <p className="text-sm font-semibold text-gray-900 truncate">
// //                 Amit Verma
// //               </p>
// //               <p className="text-xs text-gray-400 truncate">Senior Verifier</p>
// //             </div>
// //           </div>
// //         </div>
// //       </aside>

// //       {isMobile && open && (
// //         <div
// //           className="fixed inset-0 bg-black/30 z-20 transition-opacity duration-300"
// //           onClick={() => setSidebarOpen(false)}
// //         />
// //       )}
// //     </>
// //   );
// // }

// // // ─── Navbar ───────────────────────────────────────────────────────────────────
// // function Navbar({ sidebarOpen, setSidebarOpen, isMobile }) {
// //   const navbarLeftClass = !isMobile && sidebarOpen ? "left-64" : "left-0";

// //   return (
// //     <header
// //       className={`fixed top-0 right-0 z-10 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 transition-all duration-300 ${navbarLeftClass}`}
// //     >
// //       <div className="flex items-center gap-4">
// //         <button
// //           onClick={() => setSidebarOpen(!sidebarOpen)}
// //           className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
// //         >
// //           <svg
// //             viewBox="0 0 24 24"
// //             fill="none"
// //             stroke="currentColor"
// //             strokeWidth={2}
// //             className="w-5 h-5"
// //           >
// //             <path
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //               d="M4 6h16M4 12h16M4 18h16"
// //             />
// //           </svg>
// //         </button>
// //         <div>
// //           <h1 className="text-base font-bold text-gray-900">Dashboard</h1>
// //         </div>
// //       </div>

// //       <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 gap-2 w-64">
// //         <svg
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth={2}
// //           className="w-4 h-4 text-gray-400 flex-shrink-0"
// //         >
// //           <path
// //             strokeLinecap="round"
// //             strokeLinejoin="round"
// //             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
// //           />
// //         </svg>
// //         <input
// //           className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
// //           placeholder="Search applications..."
// //         />
// //       </div>

// //       <div className="flex items-center gap-2">
// //         <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
// //           <svg
// //             viewBox="0 0 24 24"
// //             fill="none"
// //             stroke="currentColor"
// //             strokeWidth={2}
// //             className="w-5 h-5"
// //           >
// //             <path
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //               d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
// //             />
// //           </svg>
// //           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
// //         </button>
// //         <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
// //           AV
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }

// // // ─── Stat Card ────────────────────────────────────────────────────────────────
// // function StatCard({ stat }) {
// //   return (
// //     <div
// //       className={`bg-white rounded-2xl border ${stat.border} p-5 flex items-start justify-between group hover:shadow-md transition-shadow`}
// //     >
// //       <div>
// //         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
// //           {stat.label}
// //         </p>
// //         <p className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">
// //           {stat.value}
// //         </p>
// //       </div>
// //       <div className={`${stat.iconBg} text-white p-3 rounded-xl`}>
// //         {stat.icon}
// //       </div>
// //     </div>
// //   );
// // }

// // // Helper functions
// // function getAddress(item) {
// //   if (item.addressSite) return item.addressSite;
// //   if (item.addressLegal) return item.addressLegal;
// //   if (item.propertyAddress) return item.propertyAddress;
// //   if (item.address) return item.address;
// //   if (item.location?.address) return item.location.address;
// //   if (item.summary?.propertyAddress) return item.summary.propertyAddress;
// //   return "N/A";
// // }

// // function getDate(item) {
// //   if (item.dateOfReport) {
// //     const date = new Date(item.dateOfReport);
// //     if (!isNaN(date.getTime())) {
// //       return date;
// //     }
// //     return null;
// //   }
// //   if (item.dateOfVisit) {
// //     const date = new Date(item.dateOfVisit);
// //     if (!isNaN(date.getTime())) {
// //       return date;
// //     }
// //     return null;
// //   }
// //   if (item.visitDate) {
// //     const date = new Date(item.visitDate);
// //     if (!isNaN(date.getTime())) {
// //       return date;
// //     }
// //     return null;
// //   }
// //   if (item.createdAt) {
// //     const date = new Date(item.createdAt);
// //     if (!isNaN(date.getTime())) {
// //       return date;
// //     }
// //     return null;
// //   }
// //   return null;
// // }

// // function getFormattedDate(item) {
// //   const date = getDate(item);
// //   if (date) {
// //     return date.toLocaleDateString('en-GB', {
// //       day: '2-digit',
// //       month: 'short',
// //       year: 'numeric'
// //     });
// //   }
// //   return "N/A";
// // }

// // function getCustomerName(item) {
// //   if (item.customerName) return item.customerName;
// //   if (item.applicantName) return item.applicantName;
// //   if (item.propertyInfo?.applicantName) return item.propertyInfo.applicantName;
// //   if (item.header?.valueName) return item.header.valueName;
// //   return "N/A";
// // }

// // function getBankName(item) {
// //   if (item.bankName) return item.bankName;
// //   if (item.bankSlug) {
// //     return item.bankSlug.split('-').map(word =>
// //       word.charAt(0).toUpperCase() + word.slice(1)
// //     ).join(' ');
// //   }
// //   return "N/A";
// // }

// // // Format date for input field (YYYY-MM-DD)
// // function formatDateForInput(date) {
// //   if (!date) return '';
// //   const d = new Date(date);
// //   const year = d.getFullYear();
// //   const month = String(d.getMonth() + 1).padStart(2, '0');
// //   const day = String(d.getDate()).padStart(2, '0');
// //   return `${year}-${month}-${day}`;
// // }

// // // Main Dashboard Component
// // export default function App() {
// //   const [sidebarOpen, setSidebarOpen] = useState(true);
// //   const [activeNav, setActiveNav] = useState("Dashboard");
// //   const [search, setSearch] = useState("");
// //   const [filterStatus, setFilterStatus] = useState("All");
// //   const [selectedBank, setSelectedBank] = useState("All");
// //   const [fromDate, setFromDate] = useState("");
// //   const [toDate, setToDate] = useState("");
// //   const [applications, setApplications] = useState([]);
// //   const [banks, setBanks] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [stats, setStats] = useState([...STATS]);
// //   const isMobile = useMediaQuery("(max-width: 1024px)");

// //   // Fetch data from API
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await fetch('http://localhost:5000/api/case/summary-data', { credentials: 'include' });

// //         if (!response.ok) {
// //           throw new Error(`HTTP error! status: ${response.status}`);
// //         }

// //         const data = await response.json();

// //         // Combine all cases from different statuses
// //         const allCases = [];

// //         if (data.pending && Array.isArray(data.pending)) {
// //           allCases.push(...data.pending.map(case_ => ({ ...case_, statusCategory: 'pending' })));
// //         }
// //         if (data.working && Array.isArray(data.working)) {
// //           allCases.push(...data.working.map(case_ => ({ ...case_, statusCategory: 'working' })));
// //         }
// //         if (data.totalSubmissions && Array.isArray(data.totalSubmissions)) {
// //           allCases.push(...data.totalSubmissions.map(case_ => ({ ...case_, statusCategory: 'totalSubmissions' })));
// //         }
// //         if (data.queryRaised && Array.isArray(data.queryRaised)) {
// //           allCases.push(...data.queryRaised.map(case_ => ({ ...case_, statusCategory: 'queryRaised' })));
// //         }

// //         setApplications(allCases);

// //         // Extract unique bank names for filter
// //         const uniqueBanks = [...new Set(allCases.map(app => getBankName(app)))].sort();
// //         setBanks(uniqueBanks);

// //         // Update stats based on actual data
// //         const pendingCount = data.pending?.length || 0;
// //         const workingCount = data.working?.length || 0;
// //         const completedCount = data.totalSubmissions?.length || 0;
// //         const totalCount = allCases.length;

// //         setStats([
// //           { ...STATS[0], value: totalCount },
// //           { ...STATS[1], value: completedCount },
// //           { ...STATS[2], value: pendingCount },
// //           { ...STATS[3], value: workingCount },
// //         ]);

// //         setLoading(false);
// //       } catch (err) {
// //         console.error("Error fetching data:", err);
// //         setError(err.message);
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   // Close sidebar automatically when switching to desktop
// //   useEffect(() => {
// //     if (isMobile) {
// //       setSidebarOpen(false);
// //     } else {
// //       setSidebarOpen(true);
// //     }
// //   }, [isMobile]);

// //   // Handle escape key to close sidebar on mobile
// //   useEffect(() => {
// //     const handleEsc = (e) => {
// //       if (e.key === "Escape" && isMobile && sidebarOpen) {
// //         setSidebarOpen(false);
// //       }
// //     };
// //     window.addEventListener("keydown", handleEsc);
// //     return () => window.removeEventListener("keydown", handleEsc);
// //   }, [isMobile, sidebarOpen]);

// //   const statuses = ["All", "Pending", "Work in Progress", "FinalSubmitted", "cancelled"];

// //   // Filter applications based on all filters
// //   const filtered = applications.filter((app) => {
// //     // Search filter
// //     const matchSearch = search === "" ||
// //       getCustomerName(app).toLowerCase().includes(search.toLowerCase()) ||
// //       getBankName(app).toLowerCase().includes(search.toLowerCase()) ||
// //       (app.refNo && app.refNo.toLowerCase().includes(search.toLowerCase()));

// //     // Status filter
// //     const matchStatus = filterStatus === "All" || app.status === filterStatus;

// //     // Bank filter
// //     const matchBank = selectedBank === "All" || getBankName(app) === selectedBank;

// //     // Date range filter
// //     let matchDate = true;
// //     const appDate = getDate(app);

// //     if (appDate && (fromDate || toDate)) {
// //       if (fromDate) {
// //         const fromDateTime = new Date(fromDate);
// //         fromDateTime.setHours(0, 0, 0, 0);
// //         if (appDate < fromDateTime) matchDate = false;
// //       }
// //       if (toDate && matchDate) {
// //         const toDateTime = new Date(toDate);
// //         toDateTime.setHours(23, 59, 59, 999);
// //         if (appDate > toDateTime) matchDate = false;
// //       }
// //     } else if (appDate === null && (fromDate || toDate)) {
// //       // If app has no date but date filter is active, exclude it
// //       matchDate = false;
// //     }

// //     return matchSearch && matchStatus && matchBank && matchDate;
// //   });

// //   // Clear all filters
// //   const clearFilters = () => {
// //     setSearch("");
// //     setFilterStatus("All");
// //     setSelectedBank("All");
// //     setFromDate("");
// //     setToDate("");
// //   };

// //   const mainMarginClass = !isMobile && sidebarOpen ? "ml-64" : "ml-0";

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Loading applications...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center bg-red-50 p-6 rounded-xl border border-red-200">
// //           <p className="text-red-600 font-semibold">Error loading data</p>
// //           <p className="text-sm text-red-500 mt-2">{error}</p>
// //           <button
// //             onClick={() => window.location.reload()}
// //             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// //           >
// //             Retry
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 font-sans">
// //       <Sidebar
// //         open={sidebarOpen}
// //         activeNav={activeNav}
// //         setActiveNav={setActiveNav}
// //         setSidebarOpen={setSidebarOpen}
// //         isMobile={isMobile}
// //       />
// //       <Navbar
// //         sidebarOpen={sidebarOpen}
// //         setSidebarOpen={setSidebarOpen}
// //         isMobile={isMobile}
// //       />

// //       <main
// //         className={`transition-all duration-300 pt-16 min-h-screen ${mainMarginClass}`}
// //       >
// //         <div className="p-4 sm:p-6 space-y-6">
// //           {/* Breadcrumb */}
// //           <div className="flex items-center gap-2 text-xs text-gray-400">
// //             <span className="text-blue-600 font-medium cursor-pointer hover:underline">
// //               Home
// //             </span>
// //             <span>/</span>
// //             <span className="text-gray-600 font-medium">Dashboard</span>
// //           </div>

// //           {/* Section Header */}
// //           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
// //             <div>
// //               <h2 className="text-xl font-extrabold text-gray-900">Overview</h2>
// //               <p className="text-sm text-gray-500 mt-0.5">
// //                 Bank application verification summary
// //               </p>
// //             </div>
// //             <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm w-full sm:w-auto">
// //               <svg
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 strokeWidth={2}
// //                 className="w-4 h-4"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   d="M12 4v16m8-8H4"
// //                 />
// //               </svg>
// //               New Application
// //             </button>
// //           </div>

// //           {/* Stats Cards */}
// //           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
// //             {stats.map((stat) => (
// //               <StatCard key={stat.label} stat={stat} />
// //             ))}
// //           </div>

// //           {/* Filters Section */}
// //           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
// //             <div className="flex items-center justify-between">
// //               <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
// //               <button
// //                 onClick={clearFilters}
// //                 className="text-xs text-blue-600 hover:text-blue-700 font-medium"
// //               >
// //                 Clear All
// //               </button>
// //             </div>

// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
// //               {/* Search Filter */}
// //               <div className="lg:col-span-1">
// //                 <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
// //                 <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 gap-2">
// //                   <svg
// //                     viewBox="0 0 24 24"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     strokeWidth={2}
// //                     className="w-4 h-4 text-gray-400 flex-shrink-0"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
// //                     />
// //                   </svg>
// //                   <input
// //                     type="text"
// //                     className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
// //                     placeholder="Customer / Bank / Ref No..."
// //                     value={search}
// //                     onChange={(e) => setSearch(e.target.value)}
// //                   />
// //                 </div>
// //               </div>

// //               {/* Status Filter */}
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
// //                 <select
// //                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400"
// //                   value={filterStatus}
// //                   onChange={(e) => setFilterStatus(e.target.value)}
// //                 >
// //                   {statuses.map((s) => (
// //                     <option key={s} value={s}>{s}</option>
// //                   ))}
// //                 </select>
// //               </div>

// //               {/* Bank Filter */}
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-500 mb-1">Bank</label>
// //                 <select
// //                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400"
// //                   value={selectedBank}
// //                   onChange={(e) => setSelectedBank(e.target.value)}
// //                 >
// //                   <option value="All">All Banks</option>
// //                   {banks.map((bank) => (
// //                     <option key={bank} value={bank}>{bank}</option>
// //                   ))}
// //                 </select>
// //               </div>

// //               {/* From Date Filter */}
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
// //                 <input
// //                   type="date"
// //                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400"
// //                   value={fromDate}
// //                   onChange={(e) => setFromDate(e.target.value)}
// //                 />
// //               </div>

// //               {/* To Date Filter */}
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
// //                 <input
// //                   type="date"
// //                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400"
// //                   value={toDate}
// //                   onChange={(e) => setToDate(e.target.value)}
// //                 />
// //               </div>
// //             </div>

// //             {/* Active Filters Display */}
// //             {(search || filterStatus !== "All" || selectedBank !== "All" || fromDate || toDate) && (
// //               <div className="flex flex-wrap gap-2 pt-2">
// //                 <span className="text-xs text-gray-500">Active filters:</span>
// //                 {search && (
// //                   <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
// //                     Search: {search}
// //                     <button onClick={() => setSearch("")} className="hover:text-blue-900">×</button>
// //                   </span>
// //                 )}
// //                 {filterStatus !== "All" && (
// //                   <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
// //                     Status: {filterStatus}
// //                     <button onClick={() => setFilterStatus("All")} className="hover:text-blue-900">×</button>
// //                   </span>
// //                 )}
// //                 {selectedBank !== "All" && (
// //                   <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
// //                     Bank: {selectedBank}
// //                     <button onClick={() => setSelectedBank("All")} className="hover:text-blue-900">×</button>
// //                   </span>
// //                 )}
// //                 {fromDate && (
// //                   <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
// //                     From: {new Date(fromDate).toLocaleDateString()}
// //                     <button onClick={() => setFromDate("")} className="hover:text-blue-900">×</button>
// //                   </span>
// //                 )}
// //                 {toDate && (
// //                   <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
// //                     To: {new Date(toDate).toLocaleDateString()}
// //                     <button onClick={() => setToDate("")} className="hover:text-blue-900">×</button>
// //                   </span>
// //                 )}
// //               </div>
// //             )}
// //           </div>

// //           {/* Bank Application List */}
// //           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
// //             <div className="px-4 sm:px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
// //               <div>
// //                 <h3 className="text-base font-bold text-gray-900">
// //                   Bank Applications
// //                 </h3>
// //                 <p className="text-xs text-gray-400 mt-0.5">
// //                   Showing {filtered.length} of {applications.length} applications
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Table */}
// //             <div className="overflow-x-auto">
// //               <table className="w-full min-w-[800px]">
// //                 <thead>
// //                   <tr className="bg-gray-50 text-left">
// //                     <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
// //                       S.No
// //                     </th>
// //                     <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
// //                       Bank Name
// //                     </th>
// //                     <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
// //                       Customer Name
// //                     </th>
// //                     <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
// //                       Address
// //                     </th>
// //                     <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
// //                       Date of Visit/Report
// //                     </th>
// //                     <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
// //                       Status
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-gray-50">
// //                   {filtered.length === 0 ? (
// //                     <tr>
// //                       <td colSpan={6} className="text-center py-12 text-sm text-gray-400">
// //                         No applications found matching the filters.
// //                       </td>
// //                     </tr>
// //                   ) : (
// //                     filtered.map((app, index) => (
// //                       <tr
// //                         key={app._id || index}
// //                         className="hover:bg-gray-50 transition-colors group"
// //                       >
// //                         <td className="px-4 py-3.5">
// //                           <span className="text-xs font-medium text-gray-500">
// //                             {index + 1}
// //                           </span>
// //                         </td>
// //                         <td className="px-4 py-3.5">
// //                           <div className="flex items-center gap-2">
// //                             <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
// //                               <span className="text-xs font-bold text-blue-600">
// //                                 {getBankName(app).charAt(0)}
// //                               </span>
// //                             </div>
// //                             <span className="text-sm font-semibold text-gray-800">
// //                               {getBankName(app)}
// //                             </span>
// //                           </div>
// //                         </td>
// //                         <td className="px-4 py-3.5">
// //                           <div>
// //                             <p className="text-sm font-semibold text-gray-900">
// //                               {getCustomerName(app)}
// //                             </p>
// //                             {app.refNo && (
// //                               <p className="text-xs text-gray-400 mt-0.5">
// //                                 Ref: {app.refNo}
// //                               </p>
// //                             )}
// //                           </div>
// //                         </td>
// //                         <td className="px-4 py-3.5">
// //                           <p className="text-sm text-gray-600 max-w-xs truncate" title={getAddress(app)}>
// //                             {getAddress(app)}
// //                           </p>
// //                         </td>
// //                         <td className="px-4 py-3.5">
// //                           <span className="text-sm text-gray-600 whitespace-nowrap">
// //                             {getFormattedDate(app)}
// //                           </span>
// //                         </td>
// //                         <td className="px-4 py-3.5">
// //                           <Badge status={app.status} />
// //                         </td>
// //                       </tr>
// //                     ))
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>

// //             {/* Table Footer */}
// //             <div className="px-4 sm:px-5 py-3.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
// //               <p className="text-xs text-gray-400">
// //                 Showing{" "}
// //                 <span className="font-semibold text-gray-700">
// //                   {filtered.length}
// //                 </span>{" "}
// //                 of{" "}
// //                 <span className="font-semibold text-gray-700">
// //                   {applications.length}
// //                 </span>{" "}
// //                 applications
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }




// ///////////////////////////////////////////


// import { useState, useEffect, useMemo, useRef } from "react";
// import { loginService } from "./services/loginService";

// const API_URL = "http://localhost:5000/api/case/summary-data";

// // ── helpers ──────────────────────────────────────────────────────────────────
// function getCustomerName(c) {
//   return c.customerName || c.applicantName || c.propertyInfo?.applicantName || c.header?.contactedPerson || c.visitedPersonName || "—";
// }
// function getAddress(c) {
//   return c.addressLegal || c.addressSite || c.propertyAddress || c.propertyInfo?.addressAtSite || c.propertyInfo?.addressAsPerDocument || c.address || "—";
// }
// function getDateOfVisit(c) {
//   return c.dateOfVisit || c.visitDate || c.header?.dateOfVisit || c.dateOfReport || c.inspectionDate || null;
// }
// function formatDate(raw) {
//   if (!raw) return "—";
//   const d = new Date(raw);
//   if (isNaN(d)) return raw;
//   return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
// }
// function parseDate(raw) {
//   if (!raw) return null;
//   const d = new Date(raw);
//   return isNaN(d) ? null : d;
// }
// function normalizeCase(c, section) {
//   return {
//     _id: c._id,
//     bankName: c.bankName || "—",
//     bankSlug: c.bankSlug || "",
//     customerName: getCustomerName(c),
//     address: getAddress(c),
//     dateOfVisitRaw: getDateOfVisit(c),
//     dateOfVisitFormatted: formatDate(getDateOfVisit(c)),
//     status: c.status || section,
//     approvalStatus: c.approvalStatus || "—",
//     isReportSubmitted: c.isReportSubmitted || false,
//     refNo: c.refNo || c.fileNo || c.lanNo || "—",
//     caseType: c.caseType || c.loanType || "—",
//     location: c.city || c.location || c.propertyCity || "—",
//     distance: c.distance || c.distanceKm || null,
//     propertyType: c.propertyType || "—",
//     area: c.area || c.builtUpArea || null,
//     basicFee: c.basicFee || c.profFees || c.baseAmount || null,
//     distanceCharge: c.distanceCharge || c.distCharges || 0,
//     totalFee: c.totalFee || c.feeAmount || c.amount || null,
//     applicationId: c.applicationId || c.appNo || null,
//     dealNo: c.dealNo || null,
//     rawData: c,
//   };
// }

// // ── Default PDF invoice data (fallback when DB has no field) ─────────────────
// const BANK_DEFAULTS = {
//   "Utkarsh Small Finance Bank": {
//     invoiceNo: "116/2025-26",
//     invoiceDate: "04.08.2025",
//     billMonth: "Jul-25",
//     receiverName: "Utkarsh Small Finance Bank",
//     receiverAddress: "Shop No. G-1, G-6, G-9, Ground Floor, Mangal City Mall & Hotel, Plot No -A-1, Scheme No 54, PU -4 Commercial, Indore- 452010",
//     receiverGSTIN: "23AABCU9355J1Z2",
//     receiverStateCode: "23",
//     sacCode: "998331",
//     bankPayment: "ICICI BANK LTD",
//     accountNo: "004105017837",
//     ifscCode: "ICIC0000041",
//     branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
//     taxType: "CGST+SGST",
//     columns: ["srNo", "lanNo", "dateOfVisit", "customerName", "propertyAddress", "distanceKm", "caseType", "baseAmount", "total"],
//     colLabels: ["Sr. No", "LAN. NO.", "Date of Visit", "Customer Name", "Property Address", "Distance IN KM", "Case Type", "Base Amount", "Total"],
//   },
//   "Sundaram Home Finance Limited": {
//     invoiceNo: "126/2025-26",
//     invoiceDate: "05.08.2025",
//     billMonth: "Jul.25",
//     receiverName: "Sundaram Home Finance Limited",
//     receiverAddress: "Plot no. 9/1/3 EMBASSY BUILDING, 3RD FLOOR (NEAR TREASURE IS LAND MALL) M.G. ROAD| INDORE – 452001",
//     receiverGSTIN: "23AADCS4826J1ZC",
//     receiverStateCode: "23",
//     sacCode: "998331",
//     bankPayment: "ICICI BANK LTD",
//     accountNo: "004105017837",
//     ifscCode: "ICIC0000041",
//     branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
//     taxType: "CGST+SGST",
//     columns: ["srNo", "fileNo", "customerName", "propertyAddress", "dateOfVisit", "caseType", "propertyType", "area", "location", "pincode", "amount"],
//     colLabels: ["S. NO", "FILE NO", "NAME OF CUSTOMER", "ADDRESS OF PROPERTY", "DATE OF PROPERTY VISIT", "TYPE OF PROPERTY CASE", "PROPERTY TYPE", "PLOT/BUILT UP AREA (SQFT)", "LOCATION", "PINCODE", "AMOUNT"],
//   },
//   "Profectus Capital Private Limited": {
//     invoiceNo: "121/2025-26",
//     invoiceDate: "05.08.2025",
//     billMonth: "Jul-25",
//     receiverName: "PROFECTUS CAPITAL PRIVATE LIMITED",
//     receiverAddress: "3rd Floor, 305 / 306, Parekh Heights, New Palasia, New Palasia, Indore, Indore, Madhya Pradesh, 452001",
//     receiverGSTIN: "23AAJCP2396N1ZW",
//     receiverStateCode: "23",
//     sacCode: "998331",
//     bankPayment: "ICICI BANK LTD",
//     accountNo: "004105017837",
//     ifscCode: "ICIC0000041",
//     branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
//     taxType: "CGST+SGST",
//     columns: ["srNo", "lanNo", "dateOfVisit", "customerName", "caseType", "propertyAddress", "distanceKm", "area", "propertyType", "feesInRs", "distCharges", "profFeesCharge"],
//     colLabels: ["Sr. No", "LAN. NO.", "Date of Visit", "Customer Name", "Case Type", "Property Address", "Distance In KM", "Plot/Built Up Area", "Property Type", "Fees In (RS)", "Dist. Charges", "Prof. Fees Charge"],
//   },
//   "Piramal Finance Limited": {
//     invoiceNo: "114/2025-26",
//     invoiceDate: "04.08.2025",
//     billMonth: "Jul.25",
//     receiverName: "Piramal Finance Limited",
//     receiverAddress: "F.F-17,16, ORION TOWER,PLOT NO.11, CITY CENTER, NEXT TO LIC BUILDING, GWALIOR, -474011 MADHYA PRADESH",
//     receiverGSTIN: "23AAACD1977A1Z7",
//     receiverStateCode: "23",
//     sacCode: "998331",
//     bankPayment: "ICICI BANK LTD",
//     accountNo: "004105017837",
//     ifscCode: "ICIC0000041",
//     branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
//     taxType: "CGST+SGST",
//     columns: ["srNo", "lanNo", "dateOfVisit", "customerName", "propertyAddress", "caseType", "location", "profFeesCharge"],
//     colLabels: ["Sr. No", "LAN. NO.", "Date of Visit", "Customer Name", "Property Address", "Case Type", "Location", "Prof. Fees Charge"],
//   },
//   "Nido Home Finance Limited": {
//     invoiceNo: "128/2025-26",
//     invoiceDate: "05.08.2025",
//     billMonth: "Jul-25",
//     receiverName: "NIDO HOME FINANCE LIMITED",
//     receiverAddress: "406, 407 D M Tower Fourth Floor, Race course road, Near Janzeer Wala Square, Indore 452001",
//     receiverGSTIN: "23AABCE9808N1ZC",
//     receiverStateCode: "23",
//     sacCode: "00440173",
//     bankPayment: "STATE BANK OF INDIA",
//     accountNo: "36052667013",
//     ifscCode: "SBIN0030450",
//     branchAddress: "SCHEME NO. 54, A.B.ROAD, INDORE",
//     taxType: "CGST+SGST",
//     columns: ["srNo", "branchName", "applicationId", "customerName", "propertyCity", "distanceKm", "caseType", "initiationDate", "basicFee", "totalFees", "propertyAddress"],
//     colLabels: ["Sr.No.", "Branch Name", "Application ID", "Applicant Name", "Property City", "Distance in KM", "Case Type", "Initiation Date", "Basic Fee", "Total Fees", "Property Address"],
//   },
//   "Manappuram Home Finance Limited": {
//     invoiceNo: "135/2025-26",
//     invoiceDate: "12.08.2025",
//     billMonth: "Jun-25",
//     receiverName: "Manappuram Home Finance Limited",
//     receiverAddress: "1st Floor, Shop - 4A, Royal Gold Building, Yaswant Nivas Road, Indore, Indore, Madhya Pradesh - 452001",
//     receiverGSTIN: "23AAGCM7846R1ZP",
//     receiverStateCode: "23",
//     sacCode: "998331",
//     bankPayment: "AU SMALL FINANCE BANK",
//     accountNo: "1821231316314808",
//     ifscCode: "AUBL0002313",
//     branchAddress: "SD ARCADE, UPPER GROUND FLOOR, PLOT PO 3, SCHEME- 54 AB ROAD INDORE 452010 M.P",
//     taxType: "CGST+SGST",
//     columns: ["srNo", "refNo", "dateOfVisit", "customerName", "propertyAddress", "distanceKm", "caseType", "baseAmount", "total"],
//     colLabels: ["Sr. No", "REF. NO.", "Date of Visit", "Customer Name", "Property Address", "Distance IN KM", "Case Type", "Base Amount", "Total"],
//   },
//   "ICICI Bank": {
//     invoiceNo: "129/2025-26",
//     invoiceDate: "08-08-25",
//     billMonth: "Jul-25",
//     receiverName: "ICICI BANK LTD.",
//     receiverAddress: "286 M.G. ROAD GORAKHUND CHAURAHA, INDORE – 452002",
//     receiverGSTIN: "23AAACI1195H1ZU",
//     receiverStateCode: "23",
//     sacCode: "998331",
//     bankPayment: "ICICI BANK",
//     accountNo: "004105017837",
//     ifscCode: "ICIC0000041",
//     branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
//     taxType: "CGST+SGST",
//     columns: ["srNo", "processShop", "applicationNo", "itemsId", "requestId", "customerName", "businessGroup", "costCenter", "requestType", "transactionType", "initiationDate", "totalVisits", "baseRate", "distanceCategory", "distanceCovered", "variableRate", "totalAmount"],
//     colLabels: ["Sr No", "Process Shop/Location", "Application No", "Ilens Id", "Request Id", "Customer Name", "Business Group", "Cost center", "Request Type", "Transaction type", "Initiation Date", "Total Visits", "Base Rate", "Distance Category", "Distance Covered", "Variable Rate", "Total Amount"],
//   },
//   "Home First Housing Finance Limited": {
//     invoiceNo: "131/2025-26",
//     invoiceDate: "08.08.2025",
//     billMonth: "Jun-25",
//     receiverName: "HOME FIRST HOUSING FINANCE LIMITED",
//     receiverAddress: "HOME FIRST HOUSING FINANCE LIMITED INDIA BHOPAL ZONE MADHYA PRADESH-462011",
//     receiverGSTIN: "23AACCH3317E127",
//     receiverStateCode: "MP",
//     sacCode: "998331",
//     bankPayment: "ICICI BANK LTD",
//     accountNo: "004105017837",
//     ifscCode: "ICIC0000041",
//     branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
//     taxType: "CGST+SGST",
//     columns: ["srNo", "customerName", "lanNo", "dateOfVisit", "propertyAddress", "caseType", "location", "profFeesCharge"],
//     colLabels: ["Sr. No", "Customer Name", "LAN. NO.", "Date of Visit", "Property Address", "Case Type", "Location", "Prof. Fees Charge"],
//   },
//   "ICICI Home Finance Company Ltd": {
//     invoiceNo: "130202526",
//     invoiceDate: "08 Aug 2025",
//     billMonth: "Jul-25",
//     receiverName: "ICICI Home Finance Company Ltd",
//     receiverAddress: "301, 3rd Floor, Dehradun-248009-Uttarakhand",
//     receiverGSTIN: "05AAACI6285N1Z6",
//     receiverStateCode: "05",
//     sacCode: "9983",
//     bankPayment: "ICICI BANK",
//     accountNo: "004105017837",
//     ifscCode: "ICIC0000041",
//     branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
//     taxType: "IGST",
//     columns: ["srNo", "agreementNo", "disbursementNo", "disbursedDate", "distanceAmount", "brokerId", "customerName", "loanScheme", "finalPO", "srNoDetails"],
//     colLabels: ["Sr.No", "Agreement No", "Disbursement No/Request No", "Disbursed Date", "Disbursed Amount/Distance Amount", "Broker ID", "Customer Name", "Loan Scheme/Service Type", "Final PO", "SR No/Details"],
//   },
//   "Fedbank Financial Services Limited": {
//     invoiceNo: "118/2025-26",
//     invoiceDate: "04.08.2025",
//     billMonth: "Jul-25",
//     receiverName: "FEDBANK FINANCIAL SERVICES LIMITED",
//     receiverAddress: "BRANCH - BHOPAL",
//     receiverGSTIN: "23AAACF8662J1ZI",
//     receiverStateCode: "23",
//     sacCode: "998399",
//     bankPayment: "ICICI BANK LTD",
//     accountNo: "004105017837",
//     ifscCode: "ICIC0000041",
//     branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
//     taxType: "CGST+SGST",
//     columns: ["srNo", "dateOfVisit", "caseType", "customerName", "propertyAddress", "location", "dealNo", "basicCharges", "distanceCharges", "totalAmount", "cgst9", "sgst9", "total"],
//     colLabels: ["S. NO", "DATE OF PROPERTY VISIT", "TYPE OF PROPERTY CASE", "NAME OF CUSTOMER", "ADDRESS OF PROPERTY", "LOCATION", "Deal No.", "Basic Charges", "Distance Charges", "Total Amount", "CGST 9%", "SGST 9%", "Total"],
//   },
//   "Bajaj Housing Finance Limited": {
//     invoiceNo: "125/2025-26",
//     invoiceDate: "05.08.2025",
//     billMonth: "JULY 2025",
//     receiverName: "BAJAJ HOUSING FINANCE LIMITED",
//     receiverAddress: "Off. Nos. 605, 606, 607-A, 607-B, 6th Floor, Airen Heights, Plot No.13-14, P.U.3, Scheme No. 54, INDORE, Indore, Madhya Pradesh, 452001",
//     receiverGSTIN: "23AADCB6018P1ZL",
//     receiverStateCode: "23",
//     sacCode: "9972",
//     bankPayment: "STATE BANK OF INDIA",
//     accountNo: "36052667013",
//     ifscCode: "SBIN0030450",
//     branchAddress: "SCHEME NO. 54, A.B.ROAD, INDORE",
//     taxType: "CGST+SGST",
//     columns: ["srNo", "applicationId", "customerName", "propertyAddress", "dateOfVisit", "caseType", "location", "transactionAmount", "cgst", "sgst"],
//     colLabels: ["S.NO.", "APPLICATION ID", "CUSTOMER NAME", "ADDRESS", "DATE OF VISIT", "CASE TYPE", "LOCATION", "Transaction Amount", "CGST", "SGST"],
//   },
//   "Aadhar Housing Finance": {
//     invoiceNo: "136/2025-26",
//     invoiceDate: "12.08.2025",
//     billMonth: "Aug-25",
//     receiverName: "Aadhar Housing Finance",
//     receiverAddress: "206 & 207, 2nd floor, Megapolis Square, Above Tanishq Showroom. 579, MG Road Indore",
//     receiverGSTIN: "27AABCV5640B2ZL",
//     receiverStateCode: "27",
//     sacCode: "998331",
//     bankPayment: "STATE BANK OF INDIA",
//     accountNo: "36052667013",
//     ifscCode: "SBIN0030450",
//     branchAddress: "SCHEME NO. 54, A.B.ROAD, INDORE",
//     taxType: "CGST+SGST",
//     columns: ["srNo", "branchName", "appNo", "customerName", "billType", "distanceKm", "dateOfVisit", "baseAmount"],
//     colLabels: ["Sr. No.", "Branch Name", "App NO.", "Customer Name", "Bill type", "Distance From Branch in KM", "Date Of Visit", "Base Amount"],
//   },
// };

// // ── VENDOR INFO (common) ─────────────────────────────────────────────────────
// const VENDOR = {
//   name: "M/s. Unique Engineering & Associates",
//   address: "Office No.102, Plot No.2 Swadesh Bhawan, Indore, Indore, Madhya Pradesh, 452001",
//   gstin: "23BUZPS8733G2ZT",
//   pan: "BUZPS8733G",
//   state: "MADHYA PRADESH",
//   stateCode: "23",
// };

// // ── Map DB bankName → BANK_DEFAULTS key ──────────────────────────────────────
// function getBankDefault(bankName) {
//   const map = {
//     "utkarsh": "Utkarsh Small Finance Bank",
//     "sundaram": "Sundaram Home Finance Limited",
//     "profectus": "Profectus Capital Private Limited",
//     "piramal": "Piramal Finance Limited",
//     "nido": "Nido Home Finance Limited",
//     "manappuram": "Manappuram Home Finance Limited",
//     "icici": "ICICI Bank",
//     "home first": "Home First Housing Finance Limited",
//     "homefirst": "Home First Housing Finance Limited",
//     "hfc": "ICICI Home Finance Company Ltd",
//     "icici home": "ICICI Home Finance Company Ltd",
//     "fedbank": "Fedbank Financial Services Limited",
//     "fed bank": "Fedbank Financial Services Limited",
//     "bajaj": "Bajaj Housing Finance Limited",
//     "aadhar": "Aadhar Housing Finance",
//     "adhar": "Aadhar Housing Finance",
//   };
//   const lower = (bankName || "").toLowerCase();
//   for (const [key, val] of Object.entries(map)) {
//     if (lower.includes(key)) return val;
//   }
//   return null;
// }

// // ── Build default rows for a case based on bank ──────────────────────────────
// function buildDefaultRow(c, bankKey) {
//   const d = BANK_DEFAULTS[bankKey];
//   if (!d) return {};
//   const base = c.basicFee || c.totalFee || 1200;
//   const dist = c.distanceCharge || 0;
//   const total = base + dist;
//   const cgst = Math.round(total * 0.09 * 100) / 100;

//   return {
//     srNo: "",
//     lanNo: c.refNo !== "—" ? c.refNo : "",
//     fileNo: c.refNo !== "—" ? c.refNo : "",
//     dateOfVisit: c.dateOfVisitFormatted !== "—" ? c.dateOfVisitFormatted : "",
//     customerName: c.customerName !== "—" ? c.customerName : "",
//     propertyAddress: c.address !== "—" ? c.address : "",
//     distanceKm: c.distance || "",
//     caseType: c.caseType !== "—" ? c.caseType : "",
//     location: c.location !== "—" ? c.location : "",
//     propertyType: c.propertyType !== "—" ? c.propertyType : "",
//     area: c.area || "",
//     baseAmount: base,
//     distCharges: dist,
//     feesInRs: base,
//     profFeesCharge: base,
//     basicCharges: base,
//     distanceCharges: dist,
//     totalAmount: total,
//     total: total,
//     amount: total,
//     cgst9: cgst,
//     sgst9: cgst,
//     cgst: cgst,
//     sgst: cgst,
//     applicationId: c.applicationId || "",
//     appNo: c.applicationId || "",
//     dealNo: c.dealNo || "",
//     branchName: "",
//     propertyCity: c.location !== "—" ? c.location : "",
//     initiationDate: c.dateOfVisitFormatted !== "—" ? c.dateOfVisitFormatted : "",
//     basicFee: base,
//     totalFees: total,
//     pincode: "",
//     processShop: "",
//     applicationNo: c.applicationId || "",
//     itemsId: "",
//     requestId: "",
//     businessGroup: "",
//     costCenter: "",
//     requestType: "",
//     transactionType: "",
//     totalVisits: 1,
//     baseRate: 1000,
//     distanceCategory: "",
//     distanceCovered: c.distance || "",
//     variableRate: dist,
//     agreementNo: c.refNo !== "—" ? c.refNo : "",
//     disbursementNo: "",
//     disbursedDate: c.dateOfVisitFormatted !== "—" ? c.dateOfVisitFormatted : "",
//     distanceAmount: dist,
//     brokerId: "",
//     loanScheme: c.caseType !== "—" ? c.caseType : "",
//     finalPO: total,
//     srNoDetails: "",
//     billType: "FRESH",
//     refNo: c.refNo !== "—" ? c.refNo : "",
//   };
// }

// // ── NAV ICONS ─────────────────────────────────────────────────────────────────
// function Icon({ type, size = 18 }) {
//   const paths = {
//     grid: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
//     bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
//     search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
//     x: "M6 18L18 6M6 6l12 12",
//     menu: "M4 6h16M4 12h16M4 18h16",
//     chevL: "M15 19l-7-7 7-7",
//     chevR: "M9 5l7 7-7 7",
//     filter: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z",
//     invoice: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
//     print: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z",
//     close: "M6 18L18 6M6 6l12 12",
//     bulkInvoice: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
//   };
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: size, height: size, flexShrink: 0 }}>
//       <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
//     </svg>
//   );
// }

// function StatusBadge({ status }) {
//   const map = {
//     Pending: { bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
//     "Work in Progress": { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
//     FinalSubmitted: { bg: "#dcfce7", color: "#166534", border: "#86efac" },
//     cancelled: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
//   };
//   const s = map[status] || { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" };
//   return (
//     <span style={{ background: s.bg, color: s.color, border: `0.5px solid ${s.border}`, borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>
//       {status || "—"}
//     </span>
//   );
// }

// function useMediaQuery(query) {
//   const [m, setM] = useState(false);
//   useEffect(() => {
//     const media = window.matchMedia(query);
//     setM(media.matches);
//     const l = (e) => setM(e.matches);
//     media.addEventListener("change", l);
//     return () => media.removeEventListener("change", l);
//   }, [query]);
//   return m;
// }

// const PAGE_SIZE = 10;

// // ── LOGIN COMPONENT ───────────────────────────────────────────────────────────
// function LoginPage({ onLogin, error }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onLogin(username, password);
//   };

//   return (
//     <div style={{
//       minHeight: "100vh",
//       background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "20px"
//     }}>
//       <div style={{
//         background: "#fff",
//         borderRadius: "12px",
//         padding: "40px",
//         boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
//         width: "100%",
//         maxWidth: "400px"
//       }}>
//         <div style={{ textAlign: "center", marginBottom: "30px" }}>
//           <div style={{
//             width: "60px",
//             height: "60px",
//             borderRadius: "50%",
//             background: "#2563eb",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             margin: "0 auto 20px",
//             color: "#fff",
//             fontSize: "24px",
//             fontWeight: "bold"
//           }}>
//             U
//           </div>
//           <h2 style={{
//             margin: "0 0 10px",
//             color: "#1a202c",
//             fontSize: "24px",
//             fontWeight: "600"
//           }}>
//             Unique Engineering Invoice
//           </h2>
//           <p style={{
//             margin: 0,
//             color: "#718096",
//             fontSize: "14px"
//           }}>
//             Sign in to your account
//           </p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: "20px" }}>
//             <label style={{
//               display: "block",
//               marginBottom: "8px",
//               color: "#374151",
//               fontSize: "14px",
//               fontWeight: "500"
//             }}>
//               Email Address
//             </label>
//             <input
//               type="email"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="admin@gmail.com"
//               style={{
//                 width: "100%",
//                 padding: "12px 16px",
//                 border: "1px solid #d1d5db",
//                 borderRadius: "8px",
//                 fontSize: "14px",
//                 outline: "none",
//                 transition: "border-color 0.2s",
//                 boxSizing: "border-box"
//               }}
//               onFocus={(e) => e.target.style.borderColor = "#2563eb"}
//               onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
//               required
//             />
//           </div>

//           <div style={{ marginBottom: "24px" }}>
//             <label style={{
//               display: "block",
//               marginBottom: "8px",
//               color: "#374151",
//               fontSize: "14px",
//               fontWeight: "500"
//             }}>
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               style={{
//                 width: "100%",
//                 padding: "12px 16px",
//                 border: "1px solid #d1d5db",
//                 borderRadius: "8px",
//                 fontSize: "14px",
//                 outline: "none",
//                 transition: "border-color 0.2s",
//                 boxSizing: "border-box"
//               }}
//               onFocus={(e) => e.target.style.borderColor = "#2563eb"}
//               onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
//               required
//             />
//           </div>

//           {error && (
//             <div style={{
//               background: "#fef2f2",
//               color: "#dc2626",
//               padding: "12px",
//               borderRadius: "8px",
//               marginBottom: "20px",
//               fontSize: "14px",
//               textAlign: "center"
//             }}>
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             style={{
//               width: "100%",
//               background: "#2563eb",
//               color: "#fff",
//               border: "none",
//               borderRadius: "8px",
//               padding: "12px 16px",
//               fontSize: "14px",
//               fontWeight: "600",
//               cursor: "pointer",
//               transition: "background-color 0.2s"
//             }}
//             onMouseOver={(e) => e.target.style.background = "#1d4ed8"}
//             onMouseOut={(e) => e.target.style.background = "#2563eb"}
//           >
//             Sign In
//           </button>
//         </form>

//         <div style={{
//           textAlign: "center",
//           marginTop: "20px",
//           fontSize: "12px",
//           color: "#9ca3af"
//         }}>
//           Unique Engineering & Associates © 2024
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── INVOICE MODAL ─────────────────────────────────────────────────────────────
// function InvoiceModal({ cases, onClose, isBulk }) {
//   // cases is array: single element for single invoice, multiple for bulk
//   const firstCase = cases[0];
//   const bankKey = getBankDefault(firstCase.bankName) || Object.keys(BANK_DEFAULTS)[0];
//   const defaults = BANK_DEFAULTS[bankKey] || BANK_DEFAULTS["ICICI Bank"];

//   // Build editable rows
//   const buildRows = () =>
//     cases.map((c, i) => {
//       const dr = buildDefaultRow(c, bankKey);
//       const row = {};
//       defaults.columns.forEach((col) => { row[col] = dr[col] !== undefined ? String(dr[col]) : ""; });
//       row._srNo = String(i + 1);
//       row._id = c._id;
//       return row;
//     });

//   const [invoiceMeta, setInvoiceMeta] = useState({
//     invoiceNo: defaults.invoiceNo,
//     invoiceDate: defaults.invoiceDate,
//     billMonth: defaults.billMonth,
//     receiverName: defaults.receiverName,
//     receiverAddress: defaults.receiverAddress,
//     receiverGSTIN: defaults.receiverGSTIN,
//     sacCode: defaults.sacCode,
//   });
//   const [companyMeta, setCompanyMeta] = useState({
//     name: "UNIQUE ENGINEERING AND ASSOCIATE",
//     subtitle1: "CHARTED ENGINEER AND APPROVED VALUER | Reg. AMIE- AM167147-5, IMC- 82-16, IIOV- CAT-I/A-4537",
//     subtitle2: "CONSULTING ENGINEER VALUERS, ARCHITECTS AND DESIGNER WORK, REGISTERED ENGINEER WITH IMC AND T&CP",
//     address: "REG. OFFICE - OFFICE NO. 102, SWADESH BHAWAN PLOT NO. 2 PRESS COMPLEX A.B ROAD INDORE. 452001 M.P | +919993970499",
//   });
//   const [invoiceTitle, setInvoiceTitle] = useState("TAX INVOICE");
//   const [descriptionText, setDescriptionText] = useState("Sub- Professional fees for property valuation");
//   const [sectionTitles, setSectionTitles] = useState({
//     receiverTitle: "Details of Receiver (Billed to)",
//     vendorTitle: "Details Of Vendor",
//     bankTitle: "BANK DETAILS",
//   });
//   const [footerMeta, setFooterMeta] = useState({
//     reverseCharge: "Whether TAX is payable under Reverse Charge - No",
//     signatureText: "Authorized Signature",
//     signatureName: "Bhart Sharma",
//   });
//   const [vendorMeta, setVendorMeta] = useState({
//     name: VENDOR.name,
//     address: VENDOR.address,
//     gstin: VENDOR.gstin,
//     pan: VENDOR.pan,
//     state: VENDOR.state,
//     stateCode: VENDOR.stateCode,
//   });
//   const [bankMeta, setBankMeta] = useState({
//     customerName: "UNIQUE ENGINEERING AND ASSOCIATES",
//     bankName: defaults.bankPayment,
//     accountNo: defaults.accountNo,
//     branchAddress: defaults.branchAddress,
//     ifscCode: defaults.ifscCode,
//     panNumber: VENDOR.pan,
//   });
//   const [taxMeta, setTaxMeta] = useState({
//     cgstRate: 9,
//     sgstRate: 9,
//     igstRate: 18,
//   });
//   const [editableSubTotal, setEditableSubTotal] = useState(null); // null means use calculated value
//   const [rows, setRows] = useState(buildRows);
//   const printRef = useRef(null);

//   const updateMeta = (key, val) => setInvoiceMeta(prev => ({ ...prev, [key]: val }));
//   const updateCompany = (key, val) => setCompanyMeta(prev => ({ ...prev, [key]: val }));
//   const updateFooter = (key, val) => setFooterMeta(prev => ({ ...prev, [key]: val }));
//   const updateVendor = (key, val) => setVendorMeta(prev => ({ ...prev, [key]: val }));
//   const updateBank = (key, val) => setBankMeta(prev => ({ ...prev, [key]: val }));
//   const updateTax = (key, val) => setTaxMeta(prev => ({ ...prev, [key]: val }));
//   const updateCell = (rowIdx, col, val) => {
//     setRows(prev => prev.map((r, i) => i === rowIdx ? { ...r, [col]: val } : r));
//   };
//   const deleteRow = (rowIdx) => {
//     setRows(prev => prev.filter((_, i) => i !== rowIdx));
//   };

//   // Compute totals
//   const calculatedSubTotal = rows.reduce((s, r) => {
//     const t = parseFloat(r.total || r.totalAmount || r.amount || r.profFeesCharge || r.feesInRs || r.baseAmount || 0);
//     return s + (isNaN(t) ? 0 : t);
//   }, 0);
//   const subTotal = editableSubTotal !== null ? editableSubTotal : calculatedSubTotal;
//   const cgstAmt = Math.round(subTotal * (taxMeta.cgstRate / 100) * 100) / 100;
//   const sgstAmt = Math.round(subTotal * (taxMeta.sgstRate / 100) * 100) / 100;
//   const igstAmt = defaults.taxType === "IGST" ? Math.round(subTotal * (taxMeta.igstRate / 100) * 100) / 100 : 0;
//   const grandTotal = subTotal + (defaults.taxType === "IGST" ? igstAmt : cgstAmt + sgstAmt);

//   function handlePrint() {
//     const printContent = printRef.current?.innerHTML;
//     if (!printContent) return;
//     const win = window.open("", "_blank", "width=900,height=700");
//     win.document.write(`<!DOCTYPE html><html><head><title>Invoice</title>
//     <style>
//       *{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;}
//       body{background:#fff;padding:20px;}
//       .logo-area{text-align:center;border-bottom:2px solid #1a3a6b;padding-bottom:10px;margin-bottom:10px;}
//       .logo-area h1{font-size:20px;color:#1a3a6b;font-weight:900;letter-spacing:2px;}
//       .logo-area p{font-size:10px;color:#333;}
//       .invoice-title{text-align:center;font-size:14px;font-weight:700;text-decoration:underline;margin:10px 0;}
//       .meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-bottom:8px;font-size:10px;}
//       .meta-grid .label{font-weight:600;color:#333;}
//       .parties{display:grid;grid-template-columns:1fr 1fr;gap:10px;border:1px solid #ccc;padding:8px;margin-bottom:8px;font-size:10px;}
//       .party-box{}
//       .party-box h3{font-size:10px;font-weight:700;border-bottom:1px solid #ccc;padding-bottom:3px;margin-bottom:4px;}
//       .sub-heading{font-size:10px;font-style:italic;color:#555;margin-bottom:6px;}
//       table{width:100%;border-collapse:collapse;margin-bottom:8px;}
//       th{background:#1a3a6b;color:#fff;padding:4px 6px;text-align:left;font-size:9px;}
//       td{padding:4px 6px;border:0.5px solid #ccc;font-size:9px;vertical-align:top;}
//       tr:nth-child(even) td{background:#f5f8ff;}
//       .totals-box{float:right;width:260px;border:1px solid #ccc;}
//       .totals-box table{margin:0;}
//       .totals-box td{border:0.5px solid #ccc;padding:4px 8px;}
//       .totals-box .grand{background:#1a3a6b;color:#fff;font-weight:700;}
//       .bank-box{margin-top:8px;font-size:9px;border:1px solid #ccc;padding:6px;}
//       .sign-area{text-align:right;margin-top:20px;font-size:10px;}
//       @media print{body{padding:5px;} * {-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
//     </style></head><body>${printContent}</body></html>`);
//     win.document.close();
//     win.focus();
//     setTimeout(() => { win.print(); }, 500);
//   }

//   const editableStyle = {
//     border: "none", background: "transparent", width: "100%", fontSize: "inherit",
//     fontFamily: "inherit", padding: 0, outline: "none", color: "inherit",
//     resize: "none", overflow: "hidden",
//   };

//   const colsToShow = defaults.columns.filter(c => c !== "srNo");

//   return (
//     <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 10px", overflowY: "auto" }}>
//       <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 1100, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}>
//         {/* Modal header */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "#1a3a6b", color: "#fff" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <Icon type="invoice" size={20} />
//             <span style={{ fontWeight: 600, fontSize: 15 }}>
//               {isBulk ? `Bulk Invoice — ${firstCase.bankName} (${cases.length} cases)` : `Invoice — ${firstCase.customerName}`}
//             </span>
//           </div>
//           <div style={{ display: "flex", gap: 8 }}>
//             <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 6, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>
//               <Icon type="print" size={15} /> Print Invoice
//             </button>
//             <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer" }}>
//               <Icon type="close" size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Editable invoice body */}
//         <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: "calc(100vh - 160px)" }}>
//           <div ref={printRef}>
//             {/* Logo + company header */}
//             <div className="logo-area" style={{ textAlign: "center", borderBottom: "2px solid #1a3a6b", paddingBottom: 10, marginBottom: 10 }}>
//               <h1 style={{ fontSize: 22, color: "#1a3a6b", fontWeight: 900, letterSpacing: 2 }}>
//                 <input value={companyMeta.name} onChange={e => updateCompany("name", e.target.value)} style={{ ...editableStyle, textAlign: "center", fontSize: 22, fontWeight: 900, letterSpacing: 2, color: "#1a3a6b" }} />
//               </h1>
//               <p style={{ fontSize: 10 }}>
//                 <input value={companyMeta.subtitle1} onChange={e => updateCompany("subtitle1", e.target.value)} style={{ ...editableStyle, textAlign: "center", fontSize: 10 }} />
//               </p>
//               <p style={{ fontSize: 10 }}>
//                 <input value={companyMeta.subtitle2} onChange={e => updateCompany("subtitle2", e.target.value)} style={{ ...editableStyle, textAlign: "center", fontSize: 10 }} />
//               </p>
//               <p style={{ fontSize: 10, fontWeight: 600 }}>
//                 <input value={companyMeta.address} onChange={e => updateCompany("address", e.target.value)} style={{ ...editableStyle, textAlign: "center", fontSize: 10, fontWeight: 600 }} />
//               </p>
//             </div>

//             {/* Invoice title & meta */}
//             <div style={{ textAlign: "center", fontSize: 14, fontWeight: 700, textDecoration: "underline", marginBottom: 10 }}>
//               <input value={invoiceTitle} onChange={e => setInvoiceTitle(e.target.value)} style={{ ...editableStyle, textAlign: "center", fontSize: 14, fontWeight: 700, textDecoration: "underline" }} />
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 8, fontSize: 11 }}>
//               <div><b>Invoice No:</b> <input value={invoiceMeta.invoiceNo} onChange={e => updateMeta("invoiceNo", e.target.value)} style={{ ...editableStyle, display: "inline", width: 120, fontWeight: 600, color: "#1a3a6b" }} /></div>
//               <div><b>Invoice Date:</b> <input value={invoiceMeta.invoiceDate} onChange={e => updateMeta("invoiceDate", e.target.value)} style={{ ...editableStyle, display: "inline", width: 100 }} /></div>
//               <div><b>Bill Month:</b> <input value={invoiceMeta.billMonth} onChange={e => updateMeta("billMonth", e.target.value)} style={{ ...editableStyle, display: "inline", width: 80 }} /></div>
//             </div>

//             {/* Parties */}
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, border: "1px solid #ccc", padding: 10, marginBottom: 10, fontSize: 11 }}>
//               <div>
//                 <div style={{ fontWeight: 700, borderBottom: "1px solid #ccc", paddingBottom: 4, marginBottom: 6 }}>
//                   <input value={sectionTitles.receiverTitle} onChange={e => setSectionTitles(prev => ({ ...prev, receiverTitle: e.target.value }))} style={{ ...editableStyle, fontWeight: 700 }} />
//                 </div>
//                 <div><b>Name:</b> <input value={invoiceMeta.receiverName} onChange={e => updateMeta("receiverName", e.target.value)} style={{ ...editableStyle, display: "inline", width: "80%" }} /></div>
//                 <div><b>Address:</b> <textarea value={invoiceMeta.receiverAddress} onChange={e => updateMeta("receiverAddress", e.target.value)} rows={2} style={{ ...editableStyle, marginTop: 2 }} /></div>
//                 <div><b>GSTIN:</b> <input value={invoiceMeta.receiverGSTIN} onChange={e => updateMeta("receiverGSTIN", e.target.value)} style={{ ...editableStyle, display: "inline", width: 160 }} /></div>
//                 <div><b>SAC Code:</b> <input value={invoiceMeta.sacCode} onChange={e => updateMeta("sacCode", e.target.value)} style={{ ...editableStyle, display: "inline", width: 80 }} /></div>
//               </div>
//               <div>
//                 <div style={{ fontWeight: 700, borderBottom: "1px solid #ccc", paddingBottom: 4, marginBottom: 6 }}>
//                   <input value={sectionTitles.vendorTitle} onChange={e => setSectionTitles(prev => ({ ...prev, vendorTitle: e.target.value }))} style={{ ...editableStyle, fontWeight: 700 }} />
//                 </div>
//                 <div><b>Name:</b> <input value={vendorMeta.name} onChange={e => updateVendor("name", e.target.value)} style={{ ...editableStyle, display: "inline", width: "80%" }} /></div>
//                 <div><b>Address:</b> <textarea value={vendorMeta.address} onChange={e => updateVendor("address", e.target.value)} rows={2} style={{ ...editableStyle, marginTop: 2 }} /></div>
//                 <div><b>GSTIN:</b> <input value={vendorMeta.gstin} onChange={e => updateVendor("gstin", e.target.value)} style={{ ...editableStyle, display: "inline", width: 160 }} /></div>
//                 <div><b>PAN:</b> <input value={vendorMeta.pan} onChange={e => updateVendor("pan", e.target.value)} style={{ ...editableStyle, display: "inline", width: 100 }} /></div>
//                 <div><b>State:</b> <input value={vendorMeta.state} onChange={e => updateVendor("state", e.target.value)} style={{ ...editableStyle, display: "inline", width: 120 }} /> | Code: <input value={vendorMeta.stateCode} onChange={e => updateVendor("stateCode", e.target.value)} style={{ ...editableStyle, display: "inline", width: 40 }} /></div>
//               </div>
//             </div>

//             <div style={{ fontSize: 11, fontStyle: "italic", color: "#555", marginBottom: 8 }}>
//               <input value={descriptionText} onChange={e => setDescriptionText(e.target.value)} style={{ ...editableStyle, fontSize: 11, fontStyle: "italic", color: "#555" }} />
//             </div>

//             {/* Cases table */}
//             <div style={{ overflowX: "auto", marginBottom: 10 }}>
//               <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
//                 <thead>
//                   <tr style={{ background: "#1a3a6b" }}>
//                     <th style={{ color: "#fff", padding: "5px 6px", textAlign: "left", whiteSpace: "nowrap", border: "0.5px solid #1a3a6b" }}>#</th>
//                     {colsToShow.map(col => {
//                       const idx = defaults.columns.indexOf(col);
//                       return (
//                         <th key={col} style={{ color: "#fff", padding: "5px 6px", textAlign: "left", whiteSpace: "nowrap", border: "0.5px solid #1a3a6b", minWidth: col.includes("Address") || col.includes("address") ? 180 : undefined }}>
//                           {defaults.colLabels[idx] || col}
//                         </th>
//                       );
//                     })}
//                     <th style={{ color: "#fff", padding: "5px 6px", textAlign: "center", whiteSpace: "nowrap", border: "0.5px solid #1a3a6b", width: 60 }}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rows.map((row, ri) => (
//                     <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#f5f8ff" }}>
//                       <td style={{ border: "0.5px solid #ccc", padding: "4px 6px", color: "#666" }}>{ri + 1}</td>
//                       {colsToShow.map(col => (
//                         <td key={col} style={{ border: "0.5px solid #ccc", padding: "4px 6px" }}>
//                           <textarea
//                             value={row[col] || ""}
//                             onChange={e => updateCell(ri, col, e.target.value)}
//                             rows={1}
//                             style={{ ...editableStyle, minWidth: col.includes("Address") || col.includes("address") ? 170 : 70 }}
//                             onInput={e => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
//                           />
//                         </td>
//                       ))}
//                       <td style={{ border: "0.5px solid #ccc", padding: "4px 6px", textAlign: "center" }}>
//                         <button
//                           onClick={() => deleteRow(ri)}
//                           style={{
//                             background: "#ef4444",
//                             color: "#fff",
//                             border: "none",
//                             borderRadius: 4,
//                             padding: "4px 8px",
//                             cursor: "pointer",
//                             fontSize: 10,
//                             fontWeight: 500
//                           }}
//                           onMouseOver={e => e.target.style.background = "#dc2626"}
//                           onMouseOut={e => e.target.style.background = "#ef4444"}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Bank details + Totals */}
//             <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }}>
//               <div style={{ border: "1px solid #ccc", padding: 10, fontSize: 10 }}>
//                 <div style={{ fontWeight: 700, marginBottom: 4 }}>
//                   <input value={sectionTitles.bankTitle} onChange={e => setSectionTitles(prev => ({ ...prev, bankTitle: e.target.value }))} style={{ ...editableStyle, fontWeight: 700, fontSize: 10 }} />
//                 </div>
//                 <div><b>Customer Name:</b> <input value={bankMeta.customerName} onChange={e => updateBank("customerName", e.target.value)} style={{ ...editableStyle, display: "inline", width: "70%" }} /></div>
//                 <div><b>Bank Name:</b> <input value={bankMeta.bankName} onChange={e => updateBank("bankName", e.target.value)} style={{ ...editableStyle, display: "inline", width: "70%" }} /></div>
//                 <div><b>Account No.:</b> <input value={bankMeta.accountNo} onChange={e => updateBank("accountNo", e.target.value)} style={{ ...editableStyle, display: "inline", width: 120 }} /></div>
//                 <div><b>Branch Address:</b> <textarea value={bankMeta.branchAddress} onChange={e => updateBank("branchAddress", e.target.value)} rows={2} style={{ ...editableStyle, marginTop: 2 }} /></div>
//                 <div><b>IFSC Code:</b> <input value={bankMeta.ifscCode} onChange={e => updateBank("ifscCode", e.target.value)} style={{ ...editableStyle, display: "inline", width: 100 }} /></div>
//                 <div><b>PAN Number:</b> <input value={bankMeta.panNumber} onChange={e => updateBank("panNumber", e.target.value)} style={{ ...editableStyle, display: "inline", width: 100 }} /></div>
//               </div>
//               <div style={{ border: "1px solid #ccc", minWidth: 260, fontSize: 11 }}>
//                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                   <tbody>
//                     <tr><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc", fontWeight: 600 }}>SUB TOTAL</td><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc", textAlign: "right" }}>₹ <input value={(editableSubTotal !== null ? editableSubTotal : calculatedSubTotal).toFixed(2)} onChange={e => { const val = e.target.value; setEditableSubTotal(val === '' ? null : parseFloat(val) || 0); }} style={{ ...editableStyle, display: "inline", width: 80, textAlign: "right", fontWeight: 600 }} /></td></tr>
//                     {defaults.taxType === "IGST" ? (
//                       <tr><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc" }}>IGST @ <input value={taxMeta.igstRate} onChange={e => updateTax("igstRate", parseFloat(e.target.value) || 0)} style={{ ...editableStyle, display: "inline", width: 30, textAlign: "center" }} />%</td><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc", textAlign: "right" }}>₹ {igstAmt.toFixed(2)}</td></tr>
//                     ) : (
//                       <>
//                         <tr><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc" }}>CGST @ <input value={taxMeta.cgstRate} onChange={e => updateTax("cgstRate", parseFloat(e.target.value) || 0)} style={{ ...editableStyle, display: "inline", width: 30, textAlign: "center" }} />%</td><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc", textAlign: "right" }}>₹ {cgstAmt.toFixed(2)}</td></tr>
//                         <tr><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc" }}>SGST @ <input value={taxMeta.sgstRate} onChange={e => updateTax("sgstRate", parseFloat(e.target.value) || 0)} style={{ ...editableStyle, display: "inline", width: 30, textAlign: "center" }} />%</td><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc", textAlign: "right" }}>₹ {sgstAmt.toFixed(2)}</td></tr>
//                       </>
//                     )}
//                     <tr style={{ background: "#1a3a6b", color: "#fff" }}><td style={{ padding: "6px 10px", fontWeight: 700 }}>GRAND TOTAL</td><td style={{ padding: "6px 10px", fontWeight: 700, textAlign: "right" }}>₹ {grandTotal.toFixed(2)}</td></tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <div style={{ marginTop: 20, textAlign: "right", fontSize: 11 }}>
//               <div>
//                 <input value={footerMeta.signatureText} onChange={e => updateFooter("signatureText", e.target.value)} style={{ ...editableStyle, textAlign: "right", fontSize: 11 }} />
//               </div>
//               <div style={{ marginTop: 30, borderTop: "1px solid #333", width: 200, display: "inline-block", paddingTop: 4 }}>
//                 <input value={footerMeta.signatureName} onChange={e => updateFooter("signatureName", e.target.value)} style={{ ...editableStyle, textAlign: "center", fontSize: 11 }} />
//               </div>
//             </div>
//             <div style={{ marginTop: 8, fontSize: 10, color: "#555" }}>
//               <input value={footerMeta.reverseCharge} onChange={e => updateFooter("reverseCharge", e.target.value)} style={{ ...editableStyle, fontSize: 10, color: "#555" }} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── MAIN APP ──────────────────────────────────────────────────────────────────
// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loginError, setLoginError] = useState("");
//   const [cases, setCases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const isMobile = useMediaQuery("(max-width: 1024px)");

//   const [search, setSearch] = useState("");
//   const [bankFilter, setBankFilter] = useState("All");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [page, setPage] = useState(1);

//   const [invoiceModal, setInvoiceModal] = useState(null); // { cases: [], isBulk }

//   const handleLogin = async (username, password) => {
//     const result = await loginService(username, password);

//     if (result.success) {
//       setIsLoggedIn(true);
//       setLoginError("");
//       return true;
//     } else {
//       setLoginError(result.message);
//       return false;
//     }
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setLoginError("");
//   };

//   useEffect(() => {
//     if (isMobile) setSidebarOpen(false);
//     else setSidebarOpen(true);
//   }, [isMobile]);

//   useEffect(() => {
//     setLoading(true);
//     fetch(API_URL, { credentials: "include" })
//       .then(r => r.json())
//       .then(data => {
//         const all = [
//           ...(data.pending || []).map(c => normalizeCase(c, "Pending")),
//           ...(data.working || []).map(c => normalizeCase(c, "Work in Progress")),
//           ...(data.totalSubmissions || []).map(c => normalizeCase(c, "FinalSubmitted")),
//           ...(data.queryRaised || []).map(c => normalizeCase(c, "Query Raised")),
//         ];
//         const seen = new Set();
//         setCases(all.filter(c => { if (seen.has(c._id)) return false; seen.add(c._id); return true; }));
//         setLoading(false);
//       })
//       .catch(e => { setError("Could not connect to API: " + e.message); setLoading(false); });
//   }, []);

//   const banks = useMemo(() => {
//     const s = new Set(cases.map(c => c.bankName).filter(Boolean));
//     return ["All", ...Array.from(s).sort()];
//   }, [cases]);

//   const stats = useMemo(() => ({
//     total: cases.length,
//     pending: cases.filter(c => c.status === "Pending").length,
//     wip: cases.filter(c => c.status === "Work in Progress").length,
//     submitted: cases.filter(c => c.status === "FinalSubmitted").length,
//     cancelled: cases.filter(c => c.status === "cancelled").length,
//   }), [cases]);

//   const filtered = useMemo(() => {
//     setPage(1);
//     return cases.filter(c => {
//       if (bankFilter !== "All" && c.bankName !== bankFilter) return false;
//       const q = search.toLowerCase();
//       if (q && !c.customerName.toLowerCase().includes(q) && !c.bankName.toLowerCase().includes(q) && !c.refNo.toLowerCase().includes(q)) return false;
//       if (fromDate || toDate) {
//         const d = parseDate(c.dateOfVisitRaw);
//         if (!d) return false;
//         if (fromDate && d < new Date(fromDate)) return false;
//         if (toDate) { const to = new Date(toDate); to.setHours(23, 59, 59); if (d > to) return false; }
//       }
//       return true;
//     });
//   }, [cases, search, bankFilter, fromDate, toDate]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
//   const clearFilters = () => { setSearch(""); setBankFilter("All"); setFromDate(""); setToDate(""); setPage(1); };
//   const hasFilters = search || bankFilter !== "All" || fromDate || toDate;
//   const mainML = !isMobile && sidebarOpen ? 256 : 0;

//   // Bulk invoice: when a specific bank is selected
//   const canBulkInvoice = bankFilter !== "All" && filtered.length > 0;

//   // Show login page if not logged in
//   if (!isLoggedIn) {
//     return <LoginPage onLogin={handleLogin} error={loginError} />;
//   }

//   return (
//     <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)", fontFamily: "var(--font-sans)" }}>
//       {invoiceModal && (
//         <InvoiceModal cases={invoiceModal.cases} isBulk={invoiceModal.isBulk} onClose={() => setInvoiceModal(null)} />
//       )}

//       {isMobile && sidebarOpen && (
//         <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 20 }} />
//       )}

//       {/* SIDEBAR */}
//       <aside style={{ position: "fixed", top: 0, left: 0, height: "100%", width: 256, zIndex: 30, background: "var(--color-background-primary)", borderRight: "0.5px solid var(--color-border-tertiary)", display: "flex", flexDirection: "column", transition: "transform 0.25s", transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
//         <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>U</div>
//             <div>
//               <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>Unique</p>
//               <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>Valuation Portal</p>
//             </div>
//           </div>
//           {isMobile && (<button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}><Icon type="x" /></button>)}
//         </div>
//         <nav style={{ flex: 1, padding: "16px 12px" }}>
//           <p style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 12px", marginBottom: 8 }}>Main menu</p>
//           <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--border-radius-md)", border: "none", cursor: "pointer", background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
//             <Icon type="grid" /> Dashboard
//           </button>
//         </nav>
//         <div style={{ padding: 16, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: "#1e40af" }}>AV</div>
//             <div>
//               <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Admin User</p>
//               <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>Valuer</p>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* HEADER */}
//       <header style={{ position: "fixed", top: 0, right: 0, left: mainML, height: 64, zIndex: 10, background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", transition: "left 0.25s" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 6 }}><Icon type="menu" /></button>
//           <div>
//             <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>Dashboard</p>
//             <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>Case Management</p>
//           </div>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", position: "relative", padding: 6 }}>
//             <Icon type="bell" />
//             <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, background: "#ef4444", borderRadius: "50%", border: "2px solid var(--color-background-primary)" }} />
//           </button>
//           <button onClick={handleLogout} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
//             Logout
//           </button>
//           <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 500 }}>AV</div>
//         </div>
//       </header>

//       {/* MAIN */}
//       <main style={{ marginLeft: mainML, paddingTop: 64, minHeight: "100vh", transition: "margin-left 0.25s" }}>
//         <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
//             <span style={{ color: "#2563eb", cursor: "pointer" }}>Home</span>
//             <span>/</span>
//             <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>Dashboard</span>
//           </div>

//           {/* STATS */}
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
//             {[
//               { label: "Total cases", val: stats.total },
//               { label: "Pending", val: stats.pending },
//               { label: "In progress", val: stats.wip },
//               { label: "Submitted", val: stats.submitted },
//               { label: "Cancelled", val: stats.cancelled },
//             ].map(s => (
//               <div key={s.label} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "14px 16px" }}>
//                 <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{s.label}</p>
//                 <p style={{ margin: 0, fontSize: 26, fontWeight: 500, color: "var(--color-text-primary)" }}>{s.val}</p>
//               </div>
//             ))}
//           </div>

//           {/* TABLE CARD */}
//           <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden" }}>
//             <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
//               <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
//                 <div>
//                   <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>All cases</p>
//                   <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
//                     {loading ? "Loading…" : `${filtered.length} of ${cases.length} cases`}
//                   </p>
//                 </div>
//                 <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
//                   {/* BULK INVOICE btn – visible when bank filter active */}
//                   {canBulkInvoice && !loading && (
//                     <button
//                       onClick={() => setInvoiceModal({ cases: filtered, isBulk: true })}
//                       style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#fff", background: "#1a3a6b", border: "none", borderRadius: "var(--border-radius-md)", padding: "7px 14px", cursor: "pointer", fontWeight: 500 }}
//                     >
//                       <Icon type="bulkInvoice" size={14} /> Create Invoice ({filtered.length})
//                     </button>
//                   )}
//                   {hasFilters && (
//                     <button onClick={clearFilters} style={{ fontSize: 12, color: "#2563eb", background: "#eff6ff", border: "0.5px solid #bfdbfe", borderRadius: "var(--border-radius-md)", padding: "5px 12px", cursor: "pointer", fontWeight: 500 }}>
//                       Clear filters
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
//                 {/* Search */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "7px 12px", minWidth: 200, flex: "1 1 200px" }}>
//                   <Icon type="search" />
//                   <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer name…" style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "var(--color-text-primary)", width: "100%" }} />
//                 </div>
//                 {/* Bank filter */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                   <Icon type="filter" />
//                   <select value={bankFilter} onChange={e => { setBankFilter(e.target.value); setPage(1); }}
//                     style={{ fontSize: 13, borderRadius: "var(--border-radius-md)", padding: "7px 12px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer", minWidth: 160 }}>
//                     {banks.map(b => <option key={b} value={b}>{b}</option>)}
//                   </select>
//                 </div>
//                 {/* Date filters */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
//                   <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Visit date:</span>
//                   <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setPage(1); }} style={{ fontSize: 12, borderRadius: "var(--border-radius-md)", padding: "7px 10px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer" }} />
//                   <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>to</span>
//                   <input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setPage(1); }} style={{ fontSize: 12, borderRadius: "var(--border-radius-md)", padding: "7px 10px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer" }} />
//                 </div>
//               </div>
//             </div>

//             <div style={{ overflowX: "auto" }}>
//               {loading ? (
//                 <div style={{ padding: 48, textAlign: "center", color: "var(--color-text-secondary)", fontSize: 14 }}>Loading cases from API…</div>
//               ) : error ? (
//                 <div style={{ padding: 48, textAlign: "center" }}>
//                   <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>{error}</p>
//                   <p style={{ color: "var(--color-text-secondary)", fontSize: 12, marginTop: 8 }}>Make sure your local server is running at localhost:5000</p>
//                 </div>
//               ) : (
//                 <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse" }}>
//                   <thead>
//                     <tr style={{ background: "var(--color-background-secondary)" }}>
//                       {["#", "Bank name", "Customer name", "Ref no.", "Address", "Date of visit", "Status", "Invoice"].map(h => (
//                         <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginated.length === 0 ? (
//                       <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>No cases match the current filters.</td></tr>
//                     ) : paginated.map((c, i) => (
//                       <tr key={c._id} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}
//                         onMouseEnter={e => e.currentTarget.style.background = "var(--color-background-secondary)"}
//                         onMouseLeave={e => e.currentTarget.style.background = ""}>
//                         <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--color-text-secondary)" }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
//                         <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
//                           <span style={{ fontSize: 12, fontWeight: 500, background: "#eff6ff", color: "#1d4ed8", border: "0.5px solid #bfdbfe", borderRadius: "var(--border-radius-md)", padding: "3px 10px" }}>{c.bankName}</span>
//                         </td>
//                         <td style={{ padding: "12px 16px" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                             <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-background-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", flexShrink: 0 }}>
//                               {c.customerName !== "—" ? c.customerName.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join("").toUpperCase() : "—"}
//                             </div>
//                             <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>{c.customerName}</p>
//                           </div>
//                         </td>
//                         <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{c.refNo}</td>
//                         <td style={{ padding: "12px 16px", maxWidth: 260 }}>
//                           <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={c.address}>{c.address}</p>
//                         </td>
//                         <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{c.dateOfVisitFormatted}</td>
//                         <td style={{ padding: "12px 16px" }}><StatusBadge status={c.status} /></td>
//                         <td style={{ padding: "12px 16px" }}>
//                           <button
//                             onClick={() => setInvoiceModal({ cases: [c], isBulk: false })}
//                             title="Open Invoice"
//                             style={{ display: "flex", alignItems: "center", gap: 5, background: "#eff6ff", color: "#1d4ed8", border: "0.5px solid #bfdbfe", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}
//                           >
//                             <Icon type="invoice" size={13} /> Invoice
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>

//             {/* PAGINATION */}
//             {!loading && !error && (
//               <div style={{ padding: "12px 20px", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
//                 <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>
//                   Page <strong style={{ color: "var(--color-text-primary)" }}>{page}</strong> of <strong style={{ color: "var(--color-text-primary)" }}>{totalPages}</strong>{" · "}{filtered.length} result{filtered.length !== 1 ? "s" : ""}
//                 </p>
//                 <div style={{ display: "flex", gap: 4 }}>
//                   <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 32, height: 32, border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: "none", cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-secondary)" }}><Icon type="chevL" /></button>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let p = i + 1;
//                     if (totalPages > 5) { const start = Math.max(1, Math.min(page - 2, totalPages - 4)); p = start + i; }
//                     return (
//                       <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, border: p === page ? "none" : "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: p === page ? "#2563eb" : "none", color: p === page ? "#fff" : "var(--color-text-secondary)", cursor: "pointer", fontSize: 12, fontWeight: p === page ? 500 : 400 }}>{p}</button>
//                     );
//                   })}
//                   <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 32, height: 32, border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: "none", cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-secondary)" }}><Icon type="chevR" /></button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// ///////////////////////////////////////


// // import { useState, useEffect, useMemo } from "react";

// // const API_URL = "http://localhost:5000/api/case/summary-data";

// // function getCustomerName(c) {
// //   return (
// //     c.customerName ||
// //     c.applicantName ||
// //     c.propertyInfo?.applicantName ||
// //     c.header?.contactedPerson ||
// //     c.visitedPersonName ||
// //     "—"
// //   );
// // }

// // function getAddress(c) {
// //   return (
// //     c.addressLegal ||
// //     c.addressSite ||
// //     c.propertyAddress ||
// //     c.propertyInfo?.addressAtSite ||
// //     c.propertyInfo?.addressAsPerDocument ||
// //     c.address ||
// //     "—"
// //   );
// // }

// // function getDateOfVisit(c) {
// //   return (
// //     c.dateOfVisit ||
// //     c.visitDate ||
// //     c.header?.dateOfVisit ||
// //     c.dateOfReport ||
// //     c.inspectionDate ||
// //     null
// //   );
// // }

// // function formatDate(raw) {
// //   if (!raw) return "—";
// //   const d = new Date(raw);
// //   if (isNaN(d)) return raw;
// //   return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
// // }

// // function parseDate(raw) {
// //   if (!raw) return null;
// //   const d = new Date(raw);
// //   return isNaN(d) ? null : d;
// // }

// // function normalizeCase(c, section) {
// //   return {
// //     _id: c._id,
// //     bankName: c.bankName || "—",
// //     bankSlug: c.bankSlug || "",
// //     customerName: getCustomerName(c),
// //     address: getAddress(c),
// //     dateOfVisitRaw: getDateOfVisit(c),
// //     dateOfVisitFormatted: formatDate(getDateOfVisit(c)),
// //     status: c.status || section,
// //     approvalStatus: c.approvalStatus || "—",
// //     isReportSubmitted: c.isReportSubmitted || false,
// //     refNo: c.refNo || c.fileNo || c.lanNo || "—",
// //   };
// // }

// // function StatusBadge({ status }) {
// //   const map = {
// //     Pending: { bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
// //     "Work in Progress": { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
// //     FinalSubmitted: { bg: "#dcfce7", color: "#166534", border: "#86efac" },
// //     cancelled: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
// //   };
// //   const s = map[status] || { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" };
// //   return (
// //     <span style={{
// //       background: s.bg, color: s.color, border: `0.5px solid ${s.border}`,
// //       borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap"
// //     }}>{status || "—"}</span>
// //   );
// // }

// // function NavIcon({ type }) {
// //   const icons = {
// //     grid: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
// //     bell: <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
// //     search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
// //     x: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
// //     menu: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />,
// //     chevL: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />,
// //     chevR: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />,
// //     filter: <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />,
// //   };
// //   return (
// //     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 18, height: 18 }}>
// //       {icons[type]}
// //     </svg>
// //   );
// // }

// // function useMediaQuery(query) {
// //   const [m, setM] = useState(false);
// //   useEffect(() => {
// //     const media = window.matchMedia(query);
// //     setM(media.matches);
// //     const l = (e) => setM(e.matches);
// //     media.addEventListener("change", l);
// //     return () => media.removeEventListener("change", l);
// //   }, [query]);
// //   return m;
// // }

// // const PAGE_SIZE = 10;

// // export default function App() {
// //   const [cases, setCases] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [sidebarOpen, setSidebarOpen] = useState(true);
// //   const isMobile = useMediaQuery("(max-width: 1024px)");

// //   const [search, setSearch] = useState("");
// //   const [bankFilter, setBankFilter] = useState("All");
// //   const [fromDate, setFromDate] = useState("");
// //   const [toDate, setToDate] = useState("");
// //   const [page, setPage] = useState(1);

// //   useEffect(() => {
// //     if (isMobile) setSidebarOpen(false);
// //     else setSidebarOpen(true);
// //   }, [isMobile]);

// //   useEffect(() => {
// //     setLoading(true);
// //     fetch(API_URL, { credentials: 'include' })
// //       .then((r) => r.json())
// //       .then((data) => {
// //         const all = [
// //           ...(data.pending || []).map((c) => normalizeCase(c, "Pending")),
// //           ...(data.working || []).map((c) => normalizeCase(c, "Work in Progress")),
// //           ...(data.totalSubmissions || []).map((c) => normalizeCase(c, "Submitted")),
// //           ...(data.queryRaised || []).map((c) => normalizeCase(c, "Query Raised")),
// //         ];
// //         const seen = new Set();
// //         const unique = all.filter((c) => {
// //           if (seen.has(c._id)) return false;
// //           seen.add(c._id);
// //           return true;
// //         });
// //         setCases(unique);
// //         setLoading(false);
// //       })
// //       .catch((e) => {
// //         setError("Could not connect to API: " + e.message);
// //         setLoading(false);
// //       });
// //   }, []);

// //   const banks = useMemo(() => {
// //     const s = new Set(cases.map((c) => c.bankName).filter(Boolean));
// //     return ["All", ...Array.from(s).sort()];
// //   }, [cases]);

// //   const stats = useMemo(() => {
// //     const total = cases.length;
// //     const pending = cases.filter((c) => c.status === "Pending").length;
// //     const wip = cases.filter((c) => c.status === "Work in Progress").length;
// //     const submitted = cases.filter((c) => c.status === "FinalSubmitted").length;
// //     const cancelled = cases.filter((c) => c.status === "cancelled").length;
// //     return { total, pending, wip, submitted, cancelled };
// //   }, [cases]);

// //   const filtered = useMemo(() => {
// //     setPage(1);
// //     return cases.filter((c) => {
// //       if (bankFilter !== "All" && c.bankName !== bankFilter) return false;
// //       const q = search.toLowerCase();
// //       if (q && !c.customerName.toLowerCase().includes(q) &&
// //         !c.bankName.toLowerCase().includes(q) &&
// //         !c.refNo.toLowerCase().includes(q)) return false;
// //       if (fromDate || toDate) {
// //         const d = parseDate(c.dateOfVisitRaw);
// //         if (!d) return false;
// //         if (fromDate && d < new Date(fromDate)) return false;
// //         if (toDate) {
// //           const to = new Date(toDate);
// //           to.setHours(23, 59, 59);
// //           if (d > to) return false;
// //         }
// //       }
// //       return true;
// //     });
// //   }, [cases, search, bankFilter, fromDate, toDate]);

// //   const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
// //   const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

// //   const clearFilters = () => {
// //     setSearch(""); setBankFilter("All"); setFromDate(""); setToDate(""); setPage(1);
// //   };

// //   const hasFilters = search || bankFilter !== "All" || fromDate || toDate;

// //   const mainML = !isMobile && sidebarOpen ? 256 : 0;

// //   return (
// //     <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)", fontFamily: "var(--font-sans)" }}>
// //       {isMobile && sidebarOpen && (
// //         <div onClick={() => setSidebarOpen(false)}
// //           style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 20 }} />
// //       )}

// //       <aside style={{
// //         position: "fixed", top: 0, left: 0, height: "100%", width: 256, zIndex: 30,
// //         background: "var(--color-background-primary)", borderRight: "0.5px solid var(--color-border-tertiary)",
// //         display: "flex", flexDirection: "column", transition: "transform 0.25s",
// //         transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)"
// //       }}>
// //         <div style={{
// //           height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
// //           padding: "0 20px", borderBottom: "0.5px solid var(--color-border-tertiary)"
// //         }}>
// //           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //             <div style={{
// //               width: 32, height: 32, borderRadius: 8, background: "#2563eb",
// //               display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13
// //             }}>U</div>
// //             <div>
// //               <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>Unique</p>
// //               <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>Valuation Portal</p>
// //             </div>
// //           </div>
// //           {isMobile && (
// //             <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}>
// //               <NavIcon type="x" />
// //             </button>
// //           )}
// //         </div>

// //         <nav style={{ flex: 1, padding: "16px 12px" }}>
// //           <p style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 12px", marginBottom: 8 }}>Main menu</p>
// //           {[{ label: "Dashboard", icon: "grid" }].map((l) => (
// //             <button key={l.label} style={{
// //               width: "100%", display: "flex", alignItems: "center", gap: 10,
// //               padding: "10px 12px", borderRadius: "var(--border-radius-md)", border: "none", cursor: "pointer",
// //               background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 500, marginBottom: 2
// //             }}>
// //               <NavIcon type={l.icon} />{l.label}
// //             </button>
// //           ))}
// //         </nav>

// //         <div style={{ padding: 16, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
// //           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //             <div style={{
// //               width: 36, height: 36, borderRadius: "50%", background: "#dbeafe",
// //               display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: "#1e40af"
// //             }}>AV</div>
// //             <div>
// //               <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Admin User</p>
// //               <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>Valuer</p>
// //             </div>
// //           </div>
// //         </div>
// //       </aside>

// //       <header style={{
// //         position: "fixed", top: 0, right: 0, left: mainML, height: 64, zIndex: 10,
// //         background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)",
// //         display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px",
// //         transition: "left 0.25s"
// //       }}>
// //         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
// //           <button onClick={() => setSidebarOpen(!sidebarOpen)}
// //             style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 6 }}>
// //             <NavIcon type="menu" />
// //           </button>
// //           <div>
// //             <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>Dashboard</p>
// //             <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>Case Management</p>
// //           </div>
// //         </div>
// //         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
// //           <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", position: "relative", padding: 6 }}>
// //             <NavIcon type="bell" />
// //             <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, background: "#ef4444", borderRadius: "50%", border: "2px solid var(--color-background-primary)" }} />
// //           </button>
// //           <div style={{
// //             width: 32, height: 32, borderRadius: "50%", background: "#2563eb",
// //             display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 500
// //           }}>AV</div>
// //         </div>
// //       </header>

// //       <main style={{ marginLeft: mainML, paddingTop: 64, minHeight: "100vh", transition: "margin-left 0.25s" }}>
// //         <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

// //           <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
// //             <span style={{ color: "#2563eb", cursor: "pointer" }}>Home</span>
// //             <span>/</span>
// //             <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>Dashboard</span>
// //           </div>

// //           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
// //             {[
// //               { label: "Total cases", val: stats.total, bg: "#eff6ff", color: "#1d4ed8" },
// //               { label: "Pending", val: stats.pending, bg: "#fefce8", color: "#854d0e" },
// //               { label: "In progress", val: stats.wip, bg: "#eff6ff", color: "#1d4ed8" },
// //               { label: "Submitted", val: stats.submitted, bg: "#f0fdf4", color: "#166534" },
// //               { label: "Cancelled", val: stats.cancelled, bg: "#fff1f2", color: "#9f1239" },
// //             ].map((s) => (
// //               <div key={s.label} style={{
// //                 background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)",
// //                 padding: "14px 16px"
// //               }}>
// //                 <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{s.label}</p>
// //                 <p style={{ margin: 0, fontSize: 26, fontWeight: 500, color: "var(--color-text-primary)" }}>{s.val}</p>
// //               </div>
// //             ))}
// //           </div>

// //           <div style={{
// //             background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)",
// //             border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden"
// //           }}>
// //             <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
// //               <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
// //                 <div>
// //                   <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>All cases</p>
// //                   <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
// //                     {loading ? "Loading…" : `${filtered.length} of ${cases.length} cases`}
// //                   </p>
// //                 </div>
// //                 {hasFilters && (
// //                   <button onClick={clearFilters} style={{
// //                     fontSize: 12, color: "#2563eb", background: "#eff6ff", border: "0.5px solid #bfdbfe",
// //                     borderRadius: "var(--border-radius-md)", padding: "5px 12px", cursor: "pointer", fontWeight: 500
// //                   }}>Clear filters</button>
// //                 )}
// //               </div>

// //               <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
// //                 <div style={{
// //                   display: "flex", alignItems: "center", gap: 8, background: "var(--color-background-secondary)",
// //                   border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "7px 12px", minWidth: 200, flex: "1 1 200px"
// //                 }}>
// //                   <NavIcon type="search" />
// //                   <input
// //                     value={search} onChange={(e) => setSearch(e.target.value)}
// //                     placeholder="Search customer name…"
// //                     style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "var(--color-text-primary)", width: "100%" }}
// //                   />
// //                 </div>

// //                 <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
// //                   <NavIcon type="filter" />
// //                   <select value={bankFilter} onChange={(e) => { setBankFilter(e.target.value); setPage(1); }}
// //                     style={{
// //                       fontSize: 13, borderRadius: "var(--border-radius-md)", padding: "7px 12px",
// //                       border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)",
// //                       color: "var(--color-text-primary)", cursor: "pointer", minWidth: 160
// //                     }}>
// //                     {banks.map((b) => <option key={b} value={b}>{b}</option>)}
// //                   </select>
// //                 </div>

// //                 <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
// //                   <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Visit date:</span>
// //                   <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
// //                     style={{
// //                       fontSize: 12, borderRadius: "var(--border-radius-md)", padding: "7px 10px",
// //                       border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)",
// //                       color: "var(--color-text-primary)", cursor: "pointer"
// //                     }} />
// //                   <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>to</span>
// //                   <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }}
// //                     style={{
// //                       fontSize: 12, borderRadius: "var(--border-radius-md)", padding: "7px 10px",
// //                       border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)",
// //                       color: "var(--color-text-primary)", cursor: "pointer"
// //                     }} />
// //                 </div>
// //               </div>
// //             </div>

// //             <div style={{ overflowX: "auto" }}>
// //               {loading ? (
// //                 <div style={{ padding: 48, textAlign: "center", color: "var(--color-text-secondary)", fontSize: 14 }}>
// //                   Loading cases from API…
// //                 </div>
// //               ) : error ? (
// //                 <div style={{ padding: 48, textAlign: "center" }}>
// //                   <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>{error}</p>
// //                   <p style={{ color: "var(--color-text-secondary)", fontSize: 12, marginTop: 8 }}>
// //                     Make sure your local server is running at localhost:5000
// //                   </p>
// //                 </div>
// //               ) : (
// //                 <table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse" }}>
// //                   <thead>
// //                     <tr style={{ background: "var(--color-background-secondary)" }}>
// //                       {["#", "Bank name", "Customer name", "Ref no.", "Address", "Date of visit", "Status"].map((h) => (
// //                         <th key={h} style={{
// //                           padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 500,
// //                           color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em",
// //                           whiteSpace: "nowrap", borderBottom: "0.5px solid var(--color-border-tertiary)"
// //                         }}>{h}</th>
// //                       ))}
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {paginated.length === 0 ? (
// //                       <tr>
// //                         <td colSpan={7} style={{ padding: 40, textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>
// //                           No cases match the current filters.
// //                         </td>
// //                       </tr>
// //                     ) : paginated.map((c, i) => (
// //                       <tr key={c._id} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}
// //                         onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-background-secondary)"}
// //                         onMouseLeave={(e) => e.currentTarget.style.background = ""}>
// //                         <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--color-text-secondary)" }}>
// //                           {(page - 1) * PAGE_SIZE + i + 1}
// //                         </td>
// //                         <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
// //                           <span style={{
// //                             fontSize: 12, fontWeight: 500, background: "#eff6ff", color: "#1d4ed8",
// //                             border: "0.5px solid #bfdbfe", borderRadius: "var(--border-radius-md)", padding: "3px 10px"
// //                           }}>{c.bankName}</span>
// //                         </td>
// //                         <td style={{ padding: "12px 16px" }}>
// //                           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //                             <div style={{
// //                               width: 32, height: 32, borderRadius: "50%", background: "var(--color-background-secondary)",
// //                               display: "flex", alignItems: "center", justifyContent: "center",
// //                               fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", flexShrink: 0
// //                             }}>
// //                               {c.customerName !== "—" ? c.customerName.trim().split(/\s+/).map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "—"}
// //                             </div>
// //                             <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>
// //                               {c.customerName}
// //                             </p>
// //                           </div>
// //                         </td>
// //                         <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
// //                           {c.refNo}
// //                         </td>
// //                         <td style={{ padding: "12px 16px", maxWidth: 260 }}>
// //                           <p style={{
// //                             margin: 0, fontSize: 12, color: "var(--color-text-secondary)",
// //                             overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
// //                           }} title={c.address}>{c.address}</p>
// //                         </td>
// //                         <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
// //                           {c.dateOfVisitFormatted}
// //                         </td>
// //                         <td style={{ padding: "12px 16px" }}>
// //                           <StatusBadge status={c.status} />
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               )}
// //             </div>

// //             {!loading && !error && (
// //               <div style={{
// //                 padding: "12px 20px", borderTop: "0.5px solid var(--color-border-tertiary)",
// //                 display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8
// //               }}>
// //                 <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>
// //                   Page <strong style={{ color: "var(--color-text-primary)" }}>{page}</strong> of <strong style={{ color: "var(--color-text-primary)" }}>{totalPages}</strong>
// //                   {" · "}{filtered.length} result{filtered.length !== 1 ? "s" : ""}
// //                 </p>
// //                 <div style={{ display: "flex", gap: 4 }}>
// //                   <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
// //                     style={{
// //                       width: 32, height: 32, border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)",
// //                       background: "none", cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1,
// //                       display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-secondary)"
// //                     }}><NavIcon type="chevL" /></button>
// //                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
// //                     let p = i + 1;
// //                     if (totalPages > 5) {
// //                       const start = Math.max(1, Math.min(page - 2, totalPages - 4));
// //                       p = start + i;
// //                     }
// //                     return (
// //                       <button key={p} onClick={() => setPage(p)}
// //                         style={{
// //                           width: 32, height: 32, border: p === page ? "none" : "0.5px solid var(--color-border-tertiary)",
// //                           borderRadius: "var(--border-radius-md)", background: p === page ? "#2563eb" : "none",
// //                           color: p === page ? "#fff" : "var(--color-text-secondary)", cursor: "pointer",
// //                           fontSize: 12, fontWeight: p === page ? 500 : 400
// //                         }}>{p}</button>
// //                     );
// //                   })}
// //                   <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
// //                     style={{
// //                       width: 32, height: 32, border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)",
// //                       background: "none", cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1,
// //                       display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-secondary)"
// //                     }}><NavIcon type="chevR" /></button>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }


















































import { useState, useEffect, useMemo, useRef } from "react";
import { loginService, logoutService } from "./services/loginService";
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

const API_URL = "https://banker-backend-8ttk.onrender.com/api/case/summary-data";

// ── helpers ──────────────────────────────────────────────────────────────────
function getCustomerName(c) {
  return c.customerName || c.applicantName || c.propertyInfo?.applicantName || c.header?.contactedPerson || c.visitedPersonName || "—";
}

function getAddress(c) {
  return c.addressLegal || c.addressSite || c.propertyAddress || c.propertyInfo?.addressAtSite || c.propertyInfo?.addressAsPerDocument || c.address || "—";
}

function getDateOfVisit(c) {
  return c.createdAt || c.dateOfVisit || c.visitDate || c.header?.dateOfVisit || c.dateOfReport || c.inspectionDate || null;
}

function formatDate(raw) {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function parseDate(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  const time = d.getTime();
  return isNaN(time) ? null : d;
}

function normalizeCase(c, section) {
  const vDate = c.dateOfVisit || c.visitDate || c.header?.dateOfVisit || c.dateOfReport || c.inspectionDate || null;
  return {
    _id: c._id,
    bankName: c.bankName || "—",
    bankSlug: c.bankSlug || "",
    customerName: getCustomerName(c),
    address: getAddress(c),
    // createdDateRaw is used for filtering by Created Date
    createdDateRaw: c.createdAt || null,
    // visitDateRaw is used for the Date Range filter
    visitDateRaw: vDate,
    dateOfVisitRaw: c.createdAt || vDate,
    // Formatted dates for display
    createdDateFormatted: formatDate(c.createdAt),
    dateOfVisitFormatted: formatDate(vDate),
    status: c.status || section,
    approvalStatus: c.approvalStatus || "—",
    isReportSubmitted: c.isReportSubmitted || false,
    refNo: c.refNo || c.fileNo || c.lanNo || "—",
    caseType: c.caseType || c.loanType || "—",
    location: c.city || c.location || c.propertyCity || "—",
    distance: c.distance || c.distanceKm || null,
    propertyType: c.propertyType || "—",
    area: c.area || c.builtUpArea || null,
    basicFee: c.basicFee || c.profFees || c.baseAmount || null,
    distanceCharge: c.distanceCharge || c.distCharges || 0,
    totalFee: c.totalFee || c.feeAmount || c.amount || null,
    applicationId: c.applicationId || c.appNo || null,
    dealNo: c.dealNo || null,
    rawData: c,
  };
}

// ── Default PDF invoice data (fallback when DB has no field) ─────────────────
const BANK_DEFAULTS = {
  "Utkarsh Small Finance Bank": {
    invoiceNo: "116/2025-26",
    invoiceDate: "04.08.2025",
    billMonth: "Jul-25",
    receiverName: "Utkarsh Small Finance Bank",
    receiverAddress: "Shop No. G-1, G-6, G-9, Ground Floor, Mangal City Mall & Hotel, Plot No -A-1, Scheme No 54, PU -4 Commercial, Indore- 452010",
    receiverGSTIN: "23AABCU9355J1Z2",
    receiverStateCode: "23",
    sacCode: "998331",
    bankPayment: "ICICI BANK LTD",
    accountNo: "004105017837",
    ifscCode: "ICIC0000041",
    branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
    taxType: "CGST+SGST",
    columns: ["srNo", "lanNo", "dateOfVisit", "customerName", "propertyAddress", "distanceKm", "caseType", "baseAmount", "total"],
    colLabels: ["Sr. No", "LAN. NO.", "Date of Visit", "Customer Name", "Property Address", "Distance IN KM", "Case Type", "Base Amount", "Total"],
  },
  "Sundaram Home Finance Limited": {
    invoiceNo: "126/2025-26",
    invoiceDate: "05.08.2025",
    billMonth: "Jul.25",
    receiverName: "Sundaram Home Finance Limited",
    receiverAddress: "Plot no. 9/1/3 EMBASSY BUILDING, 3RD FLOOR (NEAR TREASURE IS LAND MALL) M.G. ROAD| INDORE – 452001",
    receiverGSTIN: "23AADCS4826J1ZC",
    receiverStateCode: "23",
    sacCode: "998331",
    bankPayment: "ICICI BANK LTD",
    accountNo: "004105017837",
    ifscCode: "ICIC0000041",
    branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
    taxType: "CGST+SGST",
    columns: ["srNo", "fileNo", "customerName", "propertyAddress", "dateOfVisit", "caseType", "propertyType", "area", "location", "pincode", "amount"],
    colLabels: ["S. NO", "FILE NO", "NAME OF CUSTOMER", "ADDRESS OF PROPERTY", "DATE OF PROPERTY VISIT", "TYPE OF PROPERTY CASE", "PROPERTY TYPE", "PLOT/BUILT UP AREA (SQFT)", "LOCATION", "PINCODE", "AMOUNT"],
  },
  "Profectus Capital Private Limited": {
    invoiceNo: "121/2025-26",
    invoiceDate: "05.08.2025",
    billMonth: "Jul-25",
    receiverName: "PROFECTUS CAPITAL PRIVATE LIMITED",
    receiverAddress: "3rd Floor, 305 / 306, Parekh Heights, New Palasia, New Palasia, Indore, Indore, Madhya Pradesh, 452001",
    receiverGSTIN: "23AAJCP2396N1ZW",
    receiverStateCode: "23",
    sacCode: "998331",
    bankPayment: "ICICI BANK LTD",
    accountNo: "004105017837",
    ifscCode: "ICIC0000041",
    branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
    taxType: "CGST+SGST",
    columns: ["srNo", "lanNo", "dateOfVisit", "customerName", "caseType", "propertyAddress", "distanceKm", "area", "propertyType", "feesInRs", "distCharges", "profFeesCharge"],
    colLabels: ["Sr. No", "LAN. NO.", "Date of Visit", "Customer Name", "Case Type", "Property Address", "Distance In KM", "Plot/Built Up Area", "Property Type", "Fees In (RS)", "Dist. Charges", "Prof. Fees Charge"],
  },
  "Piramal Finance Limited": {
    invoiceNo: "114/2025-26",
    invoiceDate: "04.08.2025",
    billMonth: "Jul.25",
    receiverName: "Piramal Finance Limited",
    receiverAddress: "F.F-17,16, ORION TOWER,PLOT NO.11, CITY CENTER, NEXT TO LIC BUILDING, GWALIOR, -474011 MADHYA PRADESH",
    receiverGSTIN: "23AAACD1977A1Z7",
    receiverStateCode: "23",
    sacCode: "998331",
    bankPayment: "ICICI BANK LTD",
    accountNo: "004105017837",
    ifscCode: "ICIC0000041",
    branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
    taxType: "CGST+SGST",
    columns: ["srNo", "lanNo", "dateOfVisit", "customerName", "propertyAddress", "caseType", "location", "profFeesCharge"],
    colLabels: ["Sr. No", "LAN. NO.", "Date of Visit", "Customer Name", "Property Address", "Case Type", "Location", "Prof. Fees Charge"],
  },
  "Nido Home Finance Limited": {
    invoiceNo: "128/2025-26",
    invoiceDate: "05.08.2025",
    billMonth: "Jul-25",
    receiverName: "NIDO HOME FINANCE LIMITED",
    receiverAddress: "406, 407 D M Tower Fourth Floor, Race course road, Near Janzeer Wala Square, Indore 452001",
    receiverGSTIN: "23AABCE9808N1ZC",
    receiverStateCode: "23",
    sacCode: "00440173",
    bankPayment: "STATE BANK OF INDIA",
    accountNo: "36052667013",
    ifscCode: "SBIN0030450",
    branchAddress: "SCHEME NO. 54, A.B.ROAD, INDORE",
    taxType: "CGST+SGST",
    columns: ["srNo", "branchName", "applicationId", "customerName", "propertyCity", "distanceKm", "caseType", "initiationDate", "basicFee", "totalFees", "propertyAddress"],
    colLabels: ["Sr.No.", "Branch Name", "Application ID", "Applicant Name", "Property City", "Distance in KM", "Case Type", "Initiation Date", "Basic Fee", "Total Fees", "Property Address"],
  },
  "Manappuram Home Finance Limited": {
    invoiceNo: "135/2025-26",
    invoiceDate: "12.08.2025",
    billMonth: "Jun-25",
    receiverName: "Manappuram Home Finance Limited",
    receiverAddress: "1st Floor, Shop - 4A, Royal Gold Building, Yaswant Nivas Road, Indore, Indore, Madhya Pradesh - 452001",
    receiverGSTIN: "23AAGCM7846R1ZP",
    receiverStateCode: "23",
    sacCode: "998331",
    bankPayment: "AU SMALL FINANCE BANK",
    accountNo: "1821231316314808",
    ifscCode: "AUBL0002313",
    branchAddress: "SD ARCADE, UPPER GROUND FLOOR, PLOT PO 3, SCHEME- 54 AB ROAD INDORE 452010 M.P",
    taxType: "CGST+SGST",
    columns: ["srNo", "refNo", "dateOfVisit", "customerName", "propertyAddress", "distanceKm", "caseType", "baseAmount", "total"],
    colLabels: ["Sr. No", "REF. NO.", "Date of Visit", "Customer Name", "Property Address", "Distance IN KM", "Case Type", "Base Amount", "Total"],
  },
  "ICICI Bank": {
    invoiceNo: "129/2025-26",
    invoiceDate: "08-08-25",
    billMonth: "Jul-25",
    receiverName: "ICICI BANK LTD.",
    receiverAddress: "286 M.G. ROAD GORAKHUND CHAURAHA, INDORE – 452002",
    receiverGSTIN: "23AAACI1195H1ZU",
    receiverStateCode: "23",
    sacCode: "998331",
    bankPayment: "ICICI BANK",
    accountNo: "004105017837",
    ifscCode: "ICIC0000041",
    branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
    taxType: "CGST+SGST",
    columns: ["srNo", "processShop", "applicationNo", "itemsId", "requestId", "customerName", "businessGroup", "costCenter", "requestType", "transactionType", "initiationDate", "totalVisits", "baseRate", "distanceCategory", "distanceCovered", "variableRate", "totalAmount"],
    colLabels: ["Sr No", "Process Shop/Location", "Application No", "Ilens Id", "Request Id", "Customer Name", "Business Group", "Cost center", "Request Type", "Transaction type", "Initiation Date", "Total Visits", "Base Rate", "Distance Category", "Distance Covered", "Variable Rate", "Total Amount"],
  },
  "Home First Housing Finance Limited": {
    invoiceNo: "131/2025-26",
    invoiceDate: "08.08.2025",
    billMonth: "Jun-25",
    receiverName: "HOME FIRST HOUSING FINANCE LIMITED",
    receiverAddress: "HOME FIRST HOUSING FINANCE LIMITED INDIA BHOPAL ZONE MADHYA PRADESH-462011",
    receiverGSTIN: "23AACCH3317E127",
    receiverStateCode: "MP",
    sacCode: "998331",
    bankPayment: "ICICI BANK LTD",
    accountNo: "004105017837",
    ifscCode: "ICIC0000041",
    branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
    taxType: "CGST+SGST",
    columns: ["srNo", "customerName", "lanNo", "dateOfVisit", "propertyAddress", "caseType", "location", "profFeesCharge"],
    colLabels: ["Sr. No", "Customer Name", "LAN. NO.", "Date of Visit", "Property Address", "Case Type", "Location", "Prof. Fees Charge"],
  },
  "ICICI Home Finance Company Ltd": {
    invoiceNo: "130202526",
    invoiceDate: "08 Aug 2025",
    billMonth: "Jul-25",
    receiverName: "ICICI Home Finance Company Ltd",
    receiverAddress: "301, 3rd Floor, Dehradun-248009-Uttarakhand",
    receiverGSTIN: "05AAACI6285N1Z6",
    receiverStateCode: "05",
    sacCode: "9983",
    bankPayment: "ICICI BANK",
    accountNo: "004105017837",
    ifscCode: "ICIC0000041",
    branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
    taxType: "IGST",
    columns: ["srNo", "agreementNo", "disbursementNo", "disbursedDate", "distanceAmount", "brokerId", "customerName", "loanScheme", "finalPO", "srNoDetails"],
    colLabels: ["Sr.No", "Agreement No", "Disbursement No/Request No", "Disbursed Date", "Disbursed Amount/Distance Amount", "Broker ID", "Customer Name", "Loan Scheme/Service Type", "Final PO", "SR No/Details"],
  },
  "Fedbank Financial Services Limited": {
    invoiceNo: "118/2025-26",
    invoiceDate: "04.08.2025",
    billMonth: "Jul-25",
    receiverName: "FEDBANK FINANCIAL SERVICES LIMITED",
    receiverAddress: "BRANCH - BHOPAL",
    receiverGSTIN: "23AAACF8662J1ZI",
    receiverStateCode: "23",
    sacCode: "998399",
    bankPayment: "ICICI BANK LTD",
    accountNo: "004105017837",
    ifscCode: "ICIC0000041",
    branchAddress: "Malav Parisar Branch Indore M.P Pincode- 452008",
    taxType: "CGST+SGST",
    columns: ["srNo", "dateOfVisit", "caseType", "customerName", "propertyAddress", "location", "dealNo", "basicCharges", "distanceCharges", "totalAmount", "cgst9", "sgst9", "total"],
    colLabels: ["S. NO", "DATE OF PROPERTY VISIT", "TYPE OF PROPERTY CASE", "NAME OF CUSTOMER", "ADDRESS OF PROPERTY", "LOCATION", "Deal No.", "Basic Charges", "Distance Charges", "Total Amount", "CGST 9%", "SGST 9%", "Total"],
  },
  "Bajaj Housing Finance Limited": {
    invoiceNo: "125/2025-26",
    invoiceDate: "05.08.2025",
    billMonth: "JULY 2025",
    receiverName: "BAJAJ HOUSING FINANCE LIMITED",
    receiverAddress: "Off. Nos. 605, 606, 607-A, 607-B, 6th Floor, Airen Heights, Plot No.13-14, P.U.3, Scheme No. 54, INDORE, Indore, Madhya Pradesh, 452001",
    receiverGSTIN: "23AADCB6018P1ZL",
    receiverStateCode: "23",
    sacCode: "9972",
    bankPayment: "STATE BANK OF INDIA",
    accountNo: "36052667013",
    ifscCode: "SBIN0030450",
    branchAddress: "SCHEME NO. 54, A.B.ROAD, INDORE",
    taxType: "CGST+SGST",
    columns: ["srNo", "applicationId", "customerName", "propertyAddress", "dateOfVisit", "caseType", "location", "transactionAmount", "cgst", "sgst"],
    colLabels: ["S.NO.", "APPLICATION ID", "CUSTOMER NAME", "ADDRESS", "DATE OF VISIT", "CASE TYPE", "LOCATION", "Transaction Amount", "CGST", "SGST"],
  },
  "Aadhar Housing Finance": {
    invoiceNo: "136/2025-26",
    invoiceDate: "12.08.2025",
    billMonth: "Aug-25",
    receiverName: "Aadhar Housing Finance",
    receiverAddress: "206 & 207, 2nd floor, Megapolis Square, Above Tanishq Showroom. 579, MG Road Indore",
    receiverGSTIN: "27AABCV5640B2ZL",
    receiverStateCode: "27",
    sacCode: "998331",
    bankPayment: "STATE BANK OF INDIA",
    accountNo: "36052667013",
    ifscCode: "SBIN0030450",
    branchAddress: "SCHEME NO. 54, A.B.ROAD, INDORE",
    taxType: "CGST+SGST",
    columns: ["srNo", "branchName", "appNo", "customerName", "billType", "distanceKm", "dateOfVisit", "baseAmount"],
    colLabels: ["Sr. No.", "Branch Name", "App NO.", "Customer Name", "Bill type", "Distance From Branch in KM", "Date Of Visit", "Base Amount"],
  },
};

// ── VENDOR INFO (common) ─────────────────────────────────────────────────────
const VENDOR = {
  name: "M/s. Unique Engineering & Associates",
  address: "Office No.102, Plot No.2 Swadesh Bhawan, Indore, Indore, Madhya Pradesh, 452001",
  gstin: "23BUZPS8733G2ZT",
  pan: "BUZPS8733G",
  state: "MADHYA PRADESH",
  stateCode: "23",
};

// ── Map DB bankName → BANK_DEFAULTS key ──────────────────────────────────────
function getBankDefault(bankName) {
  const map = {
    "utkarsh": "Utkarsh Small Finance Bank",
    "sundaram": "Sundaram Home Finance Limited",
    "profectus": "Profectus Capital Private Limited",
    "piramal": "Piramal Finance Limited",
    "nido": "Nido Home Finance Limited",
    "manappuram": "Manappuram Home Finance Limited",
    "icici": "ICICI Bank",
    "home first": "Home First Housing Finance Limited",
    "homefirst": "Home First Housing Finance Limited",
    "hfc": "ICICI Home Finance Company Ltd",
    "icici home": "ICICI Home Finance Company Ltd",
    "fedbank": "Fedbank Financial Services Limited",
    "fed bank": "Fedbank Financial Services Limited",
    "bajaj": "Bajaj Housing Finance Limited",
    "aadhar": "Aadhar Housing Finance",
    "adhar": "Aadhar Housing Finance",
  };
  const lower = (bankName || "").toLowerCase();
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

// ── Build default rows for a case based on bank ──────────────────────────────
function buildDefaultRow(c, bankKey) {
  const d = BANK_DEFAULTS[bankKey];
  if (!d) return {};
  const base = c.basicFee || c.totalFee || 1200;
  const dist = c.distanceCharge || 0;
  const total = base + dist;
  const cgst = Math.round(total * 0.09 * 100) / 100;

  return {
    srNo: "",
    lanNo: c.refNo !== "—" ? c.refNo : "",
    fileNo: c.refNo !== "—" ? c.refNo : "",
    dateOfVisit: c.dateOfVisitFormatted !== "—" ? c.dateOfVisitFormatted : "",
    customerName: c.customerName !== "—" ? c.customerName : "",
    propertyAddress: c.address !== "—" ? c.address : "",
    distanceKm: c.distance || "",
    caseType: c.caseType !== "—" ? c.caseType : "",
    location: c.location !== "—" ? c.location : "",
    propertyType: c.propertyType !== "—" ? c.propertyType : "",
    area: c.area || "",
    baseAmount: base,
    distCharges: dist,
    feesInRs: base,
    profFeesCharge: base,
    basicCharges: base,
    distanceCharges: dist,
    totalAmount: total,
    total: total,
    amount: total,
    cgst9: cgst,
    sgst9: cgst,
    cgst: cgst,
    sgst: cgst,
    applicationId: c.applicationId || "",
    appNo: c.applicationId || "",
    dealNo: c.dealNo || "",
    branchName: "",
    propertyCity: c.location !== "—" ? c.location : "",
    initiationDate: c.dateOfVisitFormatted !== "—" ? c.dateOfVisitFormatted : "",
    basicFee: base,
    totalFees: total,
    pincode: "",
    processShop: "",
    applicationNo: c.applicationId || "",
    itemsId: "",
    requestId: "",
    businessGroup: "",
    costCenter: "",
    requestType: "",
    transactionType: "",
    totalVisits: 1,
    baseRate: 1000,
    distanceCategory: "",
    distanceCovered: c.distance || "",
    variableRate: dist,
    agreementNo: c.refNo !== "—" ? c.refNo : "",
    disbursementNo: "",
    disbursedDate: c.dateOfVisitFormatted !== "—" ? c.dateOfVisitFormatted : "",
    distanceAmount: dist,
    brokerId: "",
    loanScheme: c.caseType !== "—" ? c.caseType : "",
    finalPO: total,
    srNoDetails: "",
    billType: "FRESH",
    refNo: c.refNo !== "—" ? c.refNo : "",
  };
}

// ── NAV ICONS ─────────────────────────────────────────────────────────────────
function Icon({ type, size = 18 }) {
  const paths = {
    grid: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    x: "M6 18L18 6M6 6l12 12",
    menu: "M4 6h16M4 12h16M4 18h16",
    chevL: "M15 19l-7-7 7-7",
    chevR: "M9 5l7 7-7 7",
    filter: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z",
    invoice: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    print: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z",
    close: "M6 18L18 6M6 6l12 12",
    bulkInvoice: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: size, height: size, flexShrink: 0 }}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
    </svg>
  );
}

function StatusBadge({ status }) {
  const map = {
    Pending: { bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
    "Work in Progress": { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
    FinalSubmitted: { bg: "#dcfce7", color: "#166534", border: "#86efac" },
    cancelled: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
  };
  const s = map[status] || { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" };
  return (
    <span style={{ background: s.bg, color: s.color, border: `0.5px solid ${s.border}`, borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>
      {status || "—"}
    </span>
  );
}

function useMediaQuery(query) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setM(media.matches);
    const l = (e) => setM(e.matches);
    media.addEventListener("change", l);
    return () => media.removeEventListener("change", l);
  }, [query]);
  return m;
}

const PAGE_SIZE = 10;

// ── LOGIN COMPONENT ───────────────────────────────────────────────────────────
function LoginPage({ onLogin, error, loading }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "40px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            color: "#fff",
            fontSize: "24px",
            fontWeight: "bold"
          }}>
            U
          </div>
          <h2 style={{
            margin: "0 0 10px",
            color: "#1a202c",
            fontSize: "24px",
            fontWeight: "600"
          }}>
            Unique Engineering Invoice
          </h2>
          <p style={{
            margin: 0,
            color: "#718096",
            fontSize: "14px"
          }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@gmail.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              required
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              required
            />
          </div>

          {error && (
            <div style={{
              background: "#fef2f2",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#9ca3af" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => !loading && (e.target.style.background = "#1d4ed8")}
            onMouseOut={(e) => !loading && (e.target.style.background = "#2563eb")}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "12px",
          color: "#9ca3af"
        }}>
          Unique Engineering & Associates © 2024
        </div>
      </div>
    </div>
  );
}

// ── HELPERS FOR DYNAMIC DEFAULTS ──────────────────────────────────────────────
const getTodayDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
};

const getCurrentBillMonth = () => {
  const d = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]}-${String(d.getFullYear()).slice(-2)}`;
};

const getFiscalYear = () => {
  const d = new Date();
  const year = d.getFullYear();
  return (d.getMonth() + 1) >= 4 ? `${year}-${String(year + 1).slice(-2)}` : `${year - 1}-${String(year).slice(-2)}`;
};

const getDynamicInvoiceNo = (bankName = "") => {
  const fy = getFiscalYear();
  const cleanBank = (bankName || "GEN").replace(/\s+/g, "").toUpperCase();
  const storageKey = `lastNo_${cleanBank}_${fy}`;
  const lastNo = localStorage.getItem(storageKey) || "000";
  const newNo = String(Number(lastNo) + 1).padStart(3, '0');
  return `${newNo}-${cleanBank}-${fy}`;
};

// ── INVOICE MODAL ─────────────────────────────────────────────────────────────
function InvoiceModal({ cases, onClose, isBulk, existingInvoice }) {
  const firstCase = cases ? cases[0] : null;
  const bankName = existingInvoice ? existingInvoice.bankName : (firstCase ? firstCase.bankName : "");
  const bankKey = getBankDefault(bankName) || Object.keys(BANK_DEFAULTS)[0];
  const defaults = BANK_DEFAULTS[bankKey] || BANK_DEFAULTS["ICICI Bank"];

  const buildRows = () => {
    const fy = getFiscalYear();
    const cleanBank = (bankName || "GEN").replace(/\s+/g, "").toUpperCase();
    const storageKey = `lastNo_${cleanBank}_${fy}`;
    const nextNo = String(Number(localStorage.getItem(storageKey) || "0") + 1).padStart(3, '0');
    const invoiceNo = `${nextNo}-${cleanBank}-${fy}`;

    return (cases || []).map((c, i) => {
      const dr = buildDefaultRow(c, bankKey);
      const row = {};
      defaults.columns.forEach((col) => { row[col] = dr[col] !== undefined ? String(dr[col]) : ""; });
      row.invoiceNo = invoiceNo; // Same number for all rows in this invoice
      row._srNo = String(i + 1);
      row._id = c._id;
      return row;
    });
  };

  const [rows, setRows] = useState(existingInvoice ? (existingInvoice.rows || []) : buildRows);

  const [invoiceMeta, setInvoiceMeta] = useState((existingInvoice && existingInvoice.meta) ? existingInvoice.meta.invoice : {
    invoiceNo: getDynamicInvoiceNo(bankName),
    invoiceDate: getTodayDate(),
    billMonth: getCurrentBillMonth(),
    receiverName: defaults.receiverName,
    receiverAddress: defaults.receiverAddress,
    receiverGSTIN: defaults.receiverGSTIN,
    sacCode: defaults.sacCode,
  });
  const [companyMeta, setCompanyMeta] = useState((existingInvoice && existingInvoice.meta) ? existingInvoice.meta.company : {
    name: "UNIQUE ENGINEERING AND ASSOCIATE",
    subtitle1: "CHARTED ENGINEER AND APPROVED VALUER | Reg. AMIE- AM167147-5, IMC- 82-16, IIOV- CAT-I/A-4537",
    subtitle2: "CONSULTING ENGINEER VALUERS, ARCHITECTS AND DESIGNER WORK, REGISTERED ENGINEER WITH IMC AND T&CP",
    address: "REG. OFFICE - OFFICE NO. 102, SWADESH BHAWAN PLOT NO. 2 PRESS COMPLEX A.B ROAD INDORE. 452001 M.P | +919993970499",
  });
  const [invoiceTitle, setInvoiceTitle] = useState((existingInvoice && existingInvoice.meta) ? existingInvoice.meta.title : "TAX INVOICE");
  const [descriptionText, setDescriptionText] = useState((existingInvoice && existingInvoice.meta) ? existingInvoice.meta.description : "Sub- Professional fees for property valuation");
  const [sectionTitles, setSectionTitles] = useState((existingInvoice && existingInvoice.meta) ? existingInvoice.meta.sections : {
    receiverTitle: "Details of Receiver (Billed to)",
    vendorTitle: "Details Of Vendor",
    bankTitle: "BANK DETAILS",
  });
  const [footerMeta, setFooterMeta] = useState((existingInvoice && existingInvoice.meta) ? existingInvoice.meta.footer : {
    reverseCharge: "Whether TAX is payable under Reverse Charge - No",
    signatureText: "Authorized Signature",
    signatureName: "Bhart Sharma",
  });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [refreshInvoices, setRefreshInvoices] = useState(0);
  const [vendorMeta, setVendorMeta] = useState((existingInvoice && existingInvoice.meta) ? existingInvoice.meta.vendor : {
    name: VENDOR.name,
    address: VENDOR.address,
    gstin: VENDOR.gstin,
    pan: VENDOR.pan,
    state: VENDOR.state,
    stateCode: VENDOR.stateCode,
  });
  const [bankMeta, setBankMeta] = useState((existingInvoice && existingInvoice.meta) ? existingInvoice.meta.bank : {
    customerName: "UNIQUE ENGINEERING AND ASSOCIATES",
    bankName: defaults.bankPayment,
    accountNo: defaults.accountNo,
    branchAddress: defaults.branchAddress,
    ifscCode: defaults.ifscCode,
    panNumber: VENDOR.pan,
  });
  const [taxMeta, setTaxMeta] = useState((existingInvoice && existingInvoice.meta) ? existingInvoice.meta.tax : {
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
  });
  const [editableSubTotal, setEditableSubTotal] = useState(null);
  const [hiddenCols, setHiddenCols] = useState((existingInvoice && existingInvoice.meta) ? (existingInvoice.meta.hiddenCols || []) : []);
  const [customCols, setCustomCols] = useState((existingInvoice && existingInvoice.meta) ? (existingInvoice.meta.customCols || []) : []);
  const [colOrder, setColOrder] = useState((existingInvoice && existingInvoice.meta) ? (existingInvoice.meta.colOrder || [...defaults.columns]) : [...defaults.columns]);
  const [newColName, setNewColName] = useState("");
  const [showColPicker, setShowColPicker] = useState(false);
  const printRef = useRef(null);

  const updateMeta = (key, val) => setInvoiceMeta(prev => ({ ...prev, [key]: val }));
  const updateCompany = (key, val) => setCompanyMeta(prev => ({ ...prev, [key]: val }));
  const updateFooter = (key, val) => setFooterMeta(prev => ({ ...prev, [key]: val }));
  const updateVendor = (key, val) => setVendorMeta(prev => ({ ...prev, [key]: val }));
  const updateBank = (key, val) => setBankMeta(prev => ({ ...prev, [key]: val }));
  const updateTax = (key, val) => setTaxMeta(prev => ({ ...prev, [key]: val }));
  const updateCell = (rowIdx, col, val) => {
    setRows(prev => prev.map((r, i) => i === rowIdx ? { ...r, [col]: val } : r));
  };
  const deleteRow = (rowIdx) => {
    setRows(prev => prev.filter((_, i) => i !== rowIdx));
  };
  const addRow = () => {
    const newRow = {};
    defaults.columns.forEach(col => newRow[col] = "");
    newRow.invoiceNo = "NEW";
    setRows(prev => [...prev, newRow]);
  };

  const toggleCol = (col) => {
    setHiddenCols(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
  };

  const addCustomCol = () => {
    if (!newColName.trim()) return;
    if (defaults.columns.includes(newColName) || customCols.includes(newColName)) {
      alert("Column already exists");
      return;
    }
    setCustomCols(prev => [...prev, newColName]);
    setColOrder(prev => [...prev, newColName]);
    setRows(prev => prev.map(r => ({ ...r, [newColName]: "" })));
    setNewColName("");
  };

  const moveCol = (col, direction) => {
    setColOrder(prev => {
      const idx = prev.indexOf(col);
      if (idx === -1) return prev;
      const newOrder = [...prev];
      if (direction === "left" && idx > 0) {
        [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
      } else if (direction === "right" && idx < newOrder.length - 1) {
        [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
      }
      return newOrder;
    });
  };

  const removeCustomCol = (col) => {
    setCustomCols(prev => prev.filter(c => c !== col));
    setColOrder(prev => prev.filter(c => c !== col));
    setRows(prev => {
      return prev.map(r => {
        const newR = { ...r };
        delete newR[col];
        return newR;
      });
    });
  };

  const calculatedSubTotal = rows.reduce((s, r) => {
    const t = parseFloat(r.total || r.totalAmount || r.amount || r.profFeesCharge || r.feesInRs || r.baseAmount || 0);
    return s + (isNaN(t) ? 0 : t);
  }, 0);
  const subTotal = editableSubTotal !== null ? editableSubTotal : calculatedSubTotal;
  const cgstAmt = Math.round(subTotal * (taxMeta.cgstRate / 100) * 100) / 100;
  const sgstAmt = Math.round(subTotal * (taxMeta.sgstRate / 100) * 100) / 100;
  const igstAmt = defaults.taxType === "IGST" ? Math.round(subTotal * (taxMeta.igstRate / 100) * 100) / 100 : 0;
  const grandTotal = subTotal + (defaults.taxType === "IGST" ? igstAmt : cgstAmt + sgstAmt);

  async function handleSave() {
    setSaving(true);
    setSaveStatus(null);
    try {
      const payload = {
        bankName: firstCase ? firstCase.bankName : (existingInvoice ? existingInvoice.bankName : ""),
        invoiceNo: invoiceMeta.invoiceNo,
        invoiceDate: invoiceMeta.invoiceDate,
        billMonth: invoiceMeta.billMonth,
        totalAmount: grandTotal,
        rows: rows,
        meta: {
          invoice: invoiceMeta,
          company: companyMeta,
          vendor: vendorMeta,
          bank: bankMeta,
          tax: taxMeta,
          footer: footerMeta,
          title: invoiceTitle,
          description: descriptionText,
          sections: sectionTitles,
          customCols: customCols,
          hiddenCols: hiddenCols,
          colOrder: colOrder
        }
      };

      const response = await fetch("https://banker-backend-8ttk.onrender.com/api/invoices/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        setSaveStatus({ type: "success", msg: "Invoice saved successfully!" });

        // Update bank-specific counter
        const fy = getFiscalYear();
        const cleanBank = (bankName || "GEN").replace(/\s+/g, "").toUpperCase();
        const storageKey = `lastNo_${cleanBank}_${fy}`;
        const currentInvoiceNo = invoiceMeta.invoiceNo;
        if (currentInvoiceNo) {
          const noPart = currentInvoiceNo.split('-')[0];
          localStorage.setItem(storageKey, noPart);
        }

        setTimeout(() => {
          onClose();
          window.location.reload(); // Quick way to refresh all data after save
        }, 1500);
      } else {
        setSaveStatus({ type: "error", msg: result.message || "Failed to save invoice" });
      }
    } catch (error) {
      setSaveStatus({ type: "error", msg: "Network error while saving" });
    } finally {
      setSaving(false);
    }
  }

  function handlePrint() {
    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;
    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;}
      body{background:#fff;padding:20px;}
      .logo-area{width:100%;margin-bottom:15px;border-bottom:1px solid #1a3a6b;padding-bottom:5px;}
      .logo-area img{width:100%;height:auto;display:block;}
      .invoice-title{text-align:center;font-size:14px;font-weight:700;text-decoration:underline;margin:10px 0;}
      .meta-box{float:right;border:1px solid #ccc;padding:8px;margin-bottom:10px;min-width:200px;}
      .meta-box div{margin-bottom:2px;}
      .meta-box b{display:inline-block;width:90px;}
      .parties{display:grid;grid-template-columns:1fr 1fr;gap:10px;border:1px solid #ccc;padding:8px;margin-bottom:8px;font-size:10px;clear:both;}
      .party-box{}
      .party-box h3{font-size:10px;font-weight:700;border-bottom:1px solid #ccc;padding-bottom:3px;margin-bottom:4px;}
      .sub-heading{font-size:10px;font-style:italic;color:#555;margin-bottom:6px;}
      table{width:100%;border-collapse:collapse;margin-bottom:8px;}
      th{background:#1a3a6b;color:#fff;padding:4px 6px;text-align:left;font-size:9px;}
      td{padding:4px 6px;border:0.5px solid #ccc;font-size:9px;vertical-align:top;}
      tr:nth-child(even) td{background:#f5f8ff;}
      .totals-box{float:right;width:260px;border:1px solid #ccc;}
      .totals-box table{margin:0;}
      .totals-box td{border:0.5px solid #ccc;padding:4px 8px;}
      .totals-box .grand{background:#1a3a6b;color:#fff;font-weight:700;}
      .bank-box{margin-top:8px;font-size:9px;border:1px solid #ccc;padding:6px;clear:both;}
      .sign-area{text-align:right;margin-top:20px;font-size:10px;}
      .no-print{display:none !important;}
      @media print{body{padding:5px;} * {-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
    </style></head><body>${printContent}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 500);
  }

  async function handleExportExcel() {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Invoice');

      // 1. Add Logo Image
      try {
        const resp = await fetch("/logo.png");
        const blob = await resp.blob();
        const buffer = await blob.arrayBuffer();
        const imageId = workbook.addImage({
          buffer: buffer,
          extension: 'png',
        });
        // Placing logo in the first few rows with even larger size
        worksheet.addImage(imageId, {
          tl: { col: 0, row: 0 },
          ext: { width: 1000, height: 140 }
        });
        // Set row heights for the header area to fit larger logo
        for (let i = 1; i <= 8; i++) {
          worksheet.getRow(i).height = 25;
        }
      } catch (imgErr) {
        console.error("Logo fetch error:", imgErr);
      }

      // Offset everything by 8 rows for the logo
      const startRow = 9;

      // 2. Title & Meta (Row 6)
      worksheet.getRow(startRow).values = [invoiceTitle];
      worksheet.getRow(startRow).font = { bold: true, size: 14, underline: true };
      worksheet.getRow(startRow).alignment = { horizontal: 'center' };
      worksheet.mergeCells(`A${startRow}:G${startRow}`);

      // Row 7 & 8: Invoice Meta
      worksheet.getRow(startRow + 1).values = ["Invoice No:", invoiceMeta.invoiceNo, "", "Date:", invoiceMeta.invoiceDate];
      worksheet.getRow(startRow + 2).values = ["Bill Month:", invoiceMeta.billMonth];

      // 3. Parties (Row 10)
      const partyRow = startRow + 4;
      worksheet.getRow(partyRow).values = [sectionTitles.receiverTitle.toUpperCase(), "", "", sectionTitles.vendorTitle.toUpperCase()];
      worksheet.getRow(partyRow).font = { bold: true };

      worksheet.getRow(partyRow + 1).values = ["Name:", invoiceMeta.receiverName, "", "Name:", vendorMeta.name];
      worksheet.getRow(partyRow + 2).values = ["Address:", invoiceMeta.receiverAddress, "", "Address:", vendorMeta.address];
      worksheet.getRow(partyRow + 3).values = ["GSTIN:", invoiceMeta.receiverGSTIN, "", "GSTIN:", vendorMeta.gstin];
      worksheet.getRow(partyRow + 4).values = ["SAC Code:", invoiceMeta.sacCode, "", "PAN:", vendorMeta.pan];

      // 4. Table Header (Row 16)
      const tableStartRow = partyRow + 6;
      const headerRow = ["Sr No", ...colsToShow.map(col => {
        const idx = defaults.columns.indexOf(col);
        return col === "invoiceNo" ? "Invoice No" : (defaults.colLabels[idx] || col);
      })];
      const header = worksheet.getRow(tableStartRow);
      header.values = headerRow;
      header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A3A6B' } };

      // 5. Table Rows
      rows.forEach((r, i) => {
        const rowData = [r._srNo];
        colsToShow.forEach(col => rowData.push(r[col]));
        worksheet.getRow(tableStartRow + 1 + i).values = rowData;
      });

      // 6. Totals
      const totalsRow = tableStartRow + rows.length + 2;
      worksheet.getRow(totalsRow).values = ["", "", "", "SUB TOTAL:", subTotal];
      if (defaults.taxType === "IGST") {
        worksheet.getRow(totalsRow + 1).values = ["", "", "", `IGST (${taxMeta.igstRate}%):`, igstAmt];
      } else {
        worksheet.getRow(totalsRow + 1).values = ["", "", "", `CGST (${taxMeta.cgstRate}%):`, cgstAmt];
        worksheet.getRow(totalsRow + 2).values = ["", "", "", `SGST (${taxMeta.sgstRate}%):`, sgstAmt];
      }
      const grandRowIndex = totalsRow + (defaults.taxType === "IGST" ? 2 : 3);
      const grandRow = worksheet.getRow(grandRowIndex);
      grandRow.values = ["", "", "", "GRAND TOTAL:", grandTotal];
      grandRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      grandRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A3A6B' } };

      // Formatting
      worksheet.getColumn(1).width = 8;
      worksheet.getColumn(2).width = 25;
      worksheet.getColumn(3).width = 30;
      worksheet.getColumn(4).width = 20;
      worksheet.getColumn(5).width = 20;

      // Download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `Invoice_${invoiceMeta.invoiceNo || "Export"}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ExcelJS Export Error:", err);
      alert("Failed to export Excel with Logo: " + err.message);
    }
  }

  const editableStyle = {
    border: "none", background: "transparent", width: "100%", fontSize: "inherit",
    fontFamily: "inherit", padding: 0, outline: "none", color: "inherit",
    resize: "none", overflow: "hidden",
  };

  const colsToShow = useMemo(() => {
    const base = colOrder.filter(c => c !== "srNo" && !hiddenCols.includes(c));
    if (isBulk && !base.includes("invoiceNo") && !hiddenCols.includes("invoiceNo")) {
      return ["invoiceNo", ...base];
    }
    return base;
  }, [colOrder, isBulk, hiddenCols]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 10px", overflowY: "auto" }}>
      <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 1100, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "#1a3a6b", color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon type="invoice" size={20} />
            <span style={{ fontWeight: 600, fontSize: 15 }}>
              {existingInvoice ? `Saved Invoice — ${existingInvoice.invoiceNo}` : (isBulk ? `Bulk Invoice — ${firstCase.bankName} (${cases.length} cases)` : `Invoice — ${firstCase.customerName}`)}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {saveStatus && (
              <span style={{ fontSize: 12, background: saveStatus.type === "success" ? "#dcfce7" : "#fee2e2", color: saveStatus.type === "success" ? "#166534" : "#991b1b", padding: "4px 10px", borderRadius: 6, fontWeight: 500 }}>
                {saveStatus.msg}
              </span>
            )}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowColPicker(!showColPicker)}
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "7px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <Icon type="filter" size={14} /> Columns
              </button>
              {showColPicker && (
                <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: "#fff", border: "1px solid #ddd", borderRadius: 8, boxShadow: "0 10px 25px rgba(0,0,0,0.2)", zIndex: 110, padding: 12, minWidth: 180 }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: 11, fontWeight: 700, color: "#1a3a6b", borderBottom: "1px solid #eee", paddingBottom: 6 }}>Show/Hide Columns</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {defaults.columns.filter(c => c !== "srNo").map(col => {
                      const idx = defaults.columns.indexOf(col);
                      const label = col === "invoiceNo" ? "Invoice No" : (defaults.colLabels[idx] || col);
                      const isHidden = hiddenCols.includes(col);
                      return (
                        <div key={col} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#333", cursor: "pointer", flex: 1 }}>
                            <input type="checkbox" checked={!isHidden} onChange={() => toggleCol(col)} />
                            {label}
                          </label>
                          <div style={{ display: "flex", gap: 2 }}>
                            <button onClick={() => moveCol(col, "left")} style={{ padding: "2px 6px", fontSize: 10, cursor: "pointer", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 4, color: "#374151", fontWeight: "bold" }}>←</button>
                            <button onClick={() => moveCol(col, "right")} style={{ padding: "2px 6px", fontSize: 10, cursor: "pointer", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 4, color: "#374151", fontWeight: "bold" }}>→</button>
                          </div>
                        </div>
                      );
                    })}
                    {customCols.map(col => (
                      <div key={col} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#2563eb", cursor: "pointer", fontWeight: 600, flex: 1 }}>
                          <input type="checkbox" checked={!hiddenCols.includes(col)} onChange={() => toggleCol(col)} />
                          {col}
                        </label>
                        <div style={{ display: "flex", gap: 2 }}>
                          <button onClick={() => moveCol(col, "left")} style={{ padding: "2px 6px", fontSize: 10, cursor: "pointer", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 4, color: "#374151", fontWeight: "bold" }}>←</button>
                          <button onClick={() => moveCol(col, "right")} style={{ padding: "2px 6px", fontSize: 10, cursor: "pointer", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 4, color: "#374151", fontWeight: "bold" }}>→</button>
                          <button onClick={() => removeCustomCol(col)} style={{ padding: "2px 4px", fontSize: 10, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}>×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #eee" }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: 10, fontWeight: 700, color: "#666" }}>Add New Column</p>
                    <div style={{ display: "flex", gap: 4 }}>
                      <input
                        value={newColName}
                        onChange={e => setNewColName(e.target.value)}
                        placeholder="Column name..."
                        style={{ flex: 1, fontSize: 11, padding: "4px 6px", border: "1px solid #ddd", borderRadius: 4, color: "#333", background: "#fff" }}
                      />
                      <button
                        onClick={addCustomCol}
                        style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px", fontSize: 10, cursor: "pointer", fontWeight: 600 }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {!existingInvoice && (
              <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, background: "#10b981", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 500, fontSize: 13, opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving..." : <><Icon type="bulkInvoice" size={15} /> Save Invoice</>}
              </button>
            )}
            <button onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: 6, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>
              <Icon type="print" size={15} /> Print
            </button>
            <button onClick={handleExportExcel} style={{ display: "flex", alignItems: "center", gap: 6, background: "#059669", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>
              <Icon type="excel" size={15} /> Excel
            </button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer" }}>
              <Icon type="close" size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: "calc(100vh - 160px)" }}>
          <div ref={printRef}>
            <div className="logo-area" style={{ width: "100%", marginBottom: "15px", borderBottom: "1px solid #1a3a6b", paddingBottom: "5px" }}>
              <img src="/logo.png?t=1" alt="UNIQUE ENGINEERING AND ASSOCIATE" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>

            <div style={{ textAlign: "center", fontSize: 14, fontWeight: 700, textDecoration: "underline", marginBottom: 10 }}>
              <input value={invoiceTitle} onChange={e => setInvoiceTitle(e.target.value)} style={{ ...editableStyle, textAlign: "center", fontSize: 14, fontWeight: 700, textDecoration: "underline" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}></div> {/* Placeholder for left side if needed */}
              <div style={{ textAlign: "left", fontSize: 11, border: "1px solid #eee", padding: "8px 12px", borderRadius: 8, background: "#fcfcfc" }}>
                <div style={{ marginBottom: 4 }}><b>Invoice Date:</b> <input value={invoiceMeta.invoiceDate} onChange={e => updateMeta("invoiceDate", e.target.value)} style={{ ...editableStyle, display: "inline", width: 100, marginLeft: 5 }} /></div>
                <div style={{ marginBottom: 4 }}><b>Invoice No:</b> <input value={invoiceMeta.invoiceNo} onChange={e => updateMeta("invoiceNo", e.target.value)} style={{ ...editableStyle, display: "inline", width: 120, fontWeight: 600, color: "#1a3a6b", marginLeft: 13 }} /></div>
                <div><b>Bill Month:</b> <input value={invoiceMeta.billMonth} onChange={e => updateMeta("billMonth", e.target.value)} style={{ ...editableStyle, display: "inline", width: 80, marginLeft: 15 }} /></div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20, fontSize: 11 }}>
              <div style={{ background: "#fff", border: "1.5px solid #1a3a6b", borderRadius: 10, padding: 18, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ fontWeight: 800, color: "#1a3a6b", borderBottom: "1.5px solid #1a3a6b", paddingBottom: 8, marginBottom: 12, fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 4, height: 16, background: "#1a3a6b", borderRadius: 2 }}></div>
                  <input value={sectionTitles.receiverTitle} onChange={e => setSectionTitles(prev => ({ ...prev, receiverTitle: e.target.value }))} style={{ ...editableStyle, fontWeight: 800, color: "#1a3a6b", border: "1px solid transparent" }} />
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center" }}><b style={{ color: "#333", width: 75, flexShrink: 0 }}>Name:</b> <input value={invoiceMeta.receiverName} onChange={e => updateMeta("receiverName", e.target.value)} style={{ ...editableStyle, flex: 1, fontWeight: 600, border: "1px solid #d1d5db", padding: "4px 8px", background: "#f9fafb" }} /></div>
                  <div style={{ display: "flex", alignItems: "start" }}><b style={{ color: "#333", width: 75, flexShrink: 0, marginTop: 8 }}>Address:</b> <textarea value={invoiceMeta.receiverAddress} onChange={e => updateMeta("receiverAddress", e.target.value)} rows={2} style={{ ...editableStyle, flex: 1, lineHeight: "1.4", border: "1px solid #d1d5db", padding: "6px 8px", background: "#f9fafb" }} /></div>
                  <div style={{ display: "flex", alignItems: "center" }}><b style={{ color: "#333", width: 75, flexShrink: 0 }}>GSTIN:</b> <input value={invoiceMeta.receiverGSTIN} onChange={e => updateMeta("receiverGSTIN", e.target.value)} style={{ ...editableStyle, flex: 1, border: "1px solid #d1d5db", padding: "4px 8px", background: "#f9fafb" }} /></div>
                  <div style={{ display: "flex", alignItems: "center" }}><b style={{ color: "#333", width: 75, flexShrink: 0 }}>SAC Code:</b> <input value={invoiceMeta.sacCode} onChange={e => updateMeta("sacCode", e.target.value)} style={{ ...editableStyle, flex: 1, border: "1px solid #d1d5db", padding: "4px 8px", background: "#f9fafb" }} /></div>
                </div>
              </div>
              <div style={{ background: "#fff", border: "1.5px solid #1a3a6b", borderRadius: 10, padding: 18, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ fontWeight: 800, color: "#1a3a6b", borderBottom: "1.5px solid #1a3a6b", paddingBottom: 8, marginBottom: 12, fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 4, height: 16, background: "#1a3a6b", borderRadius: 2 }}></div>
                  <input value={sectionTitles.vendorTitle} onChange={e => setSectionTitles(prev => ({ ...prev, vendorTitle: e.target.value }))} style={{ ...editableStyle, fontWeight: 800, color: "#1a3a6b", border: "1px solid transparent" }} />
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center" }}><b style={{ color: "#333", width: 75, flexShrink: 0 }}>Name:</b> <input value={vendorMeta.name} onChange={e => updateVendor("name", e.target.value)} style={{ ...editableStyle, flex: 1, fontWeight: 600, border: "1px solid #d1d5db", padding: "4px 8px", background: "#f9fafb" }} /></div>
                  <div style={{ display: "flex", alignItems: "start" }}><b style={{ color: "#333", width: 75, flexShrink: 0, marginTop: 8 }}>Address:</b> <textarea value={vendorMeta.address} onChange={e => updateVendor("address", e.target.value)} rows={2} style={{ ...editableStyle, flex: 1, lineHeight: "1.4", border: "1px solid #d1d5db", padding: "6px 8px", background: "#f9fafb" }} /></div>
                  <div style={{ display: "flex", alignItems: "center" }}><b style={{ color: "#333", width: 75, flexShrink: 0 }}>GSTIN:</b> <input value={vendorMeta.gstin} onChange={e => updateVendor("gstin", e.target.value)} style={{ ...editableStyle, flex: 1, border: "1px solid #d1d5db", padding: "4px 8px", background: "#f9fafb" }} /></div>
                  <div style={{ display: "flex", alignItems: "center" }}><b style={{ color: "#333", width: 75, flexShrink: 0 }}>PAN:</b> <input value={vendorMeta.pan} onChange={e => updateVendor("pan", e.target.value)} style={{ ...editableStyle, flex: 1, border: "1px solid #d1d5db", padding: "4px 8px", background: "#f9fafb" }} /></div>
                  <div style={{ display: "flex", alignItems: "center" }}><b style={{ color: "#333", width: 75, flexShrink: 0 }}>State:</b> <input value={vendorMeta.state} onChange={e => updateVendor("state", e.target.value)} style={{ ...editableStyle, flex: 1, border: "1px solid #d1d5db", padding: "4px 8px", background: "#f9fafb" }} /> <span style={{ color: "#ccc", margin: "0 4px" }}>|</span> <b style={{ color: "#333" }}>Code:</b> <input value={vendorMeta.stateCode} onChange={e => updateVendor("stateCode", e.target.value)} style={{ ...editableStyle, width: 35, border: "1px solid #d1d5db", padding: "4px 4px", background: "#f9fafb" }} /></div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontStyle: "italic", color: "#555" }}>
                <input value={descriptionText} onChange={e => setDescriptionText(e.target.value)} style={{ ...editableStyle, fontSize: 11, fontStyle: "italic", color: "#555" }} />
              </div>
              <button
                onClick={addRow}
                className="no-print"
                style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: 4, padding: "3px 10px", fontSize: 10, fontWeight: 600, cursor: "pointer" }}
              >
                + Add Row
              </button>
            </div>

            <div style={{ overflowX: "auto", marginBottom: 10 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead>
                  <tr style={{ background: "#1a3a6b" }}>
                    <th style={{ color: "#fff", padding: "5px 6px", textAlign: "left", whiteSpace: "nowrap", border: "0.5px solid #1a3a6b" }}>#</th>
                    {colsToShow.map(col => {
                      const idx = defaults.columns.indexOf(col);
                      return (
                        <th key={col} style={{ color: "#fff", padding: "5px 6px", textAlign: "left", whiteSpace: "nowrap", border: "0.5px solid #1a3a6b", minWidth: col.includes("Address") || col.includes("address") ? 180 : undefined }}>
                          {col === "invoiceNo" ? "Invoice No" : (defaults.colLabels[idx] || col)}
                        </th>
                      );
                    })}
                    <th className="no-print" style={{ color: "#fff", padding: "5px 6px", textAlign: "center", whiteSpace: "nowrap", border: "0.5px solid #1a3a6b", width: 60 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#f5f8ff" }}>
                      <td style={{ border: "0.5px solid #ccc", padding: "4px 6px", color: "#666" }}>{ri + 1}</td>
                      {colsToShow.map(col => (
                        <td key={col} style={{ border: "0.5px solid #ccc", padding: "4px 6px" }}>
                          <textarea
                            value={row[col] || ""}
                            onChange={e => updateCell(ri, col, e.target.value)}
                            rows={1}
                            style={{ ...editableStyle, minWidth: col.includes("Address") || col.includes("address") ? 170 : 70 }}
                            onInput={e => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
                          />
                        </td>
                      ))}
                      <td className="no-print" style={{ border: "0.5px solid #ccc", padding: "4px 6px", textAlign: "center" }}>
                        <button
                          onClick={() => deleteRow(ri)}
                          className="no-print"
                          style={{
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 8px",
                            cursor: "pointer",
                            fontSize: 10,
                            fontWeight: 500
                          }}
                          onMouseOver={e => e.target.style.background = "#dc2626"}
                          onMouseOut={e => e.target.style.background = "#ef4444"}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }}>
              <div style={{ border: "1px solid #ccc", padding: 10, fontSize: 10 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  <input value={sectionTitles.bankTitle} onChange={e => setSectionTitles(prev => ({ ...prev, bankTitle: e.target.value }))} style={{ ...editableStyle, fontWeight: 700, fontSize: 10 }} />
                </div>
                <div><b>Customer Name:</b> <input value={bankMeta.customerName} onChange={e => updateBank("customerName", e.target.value)} style={{ ...editableStyle, display: "inline", width: "70%" }} /></div>
                <div><b>Bank Name:</b> <input value={bankMeta.bankName} onChange={e => updateBank("bankName", e.target.value)} style={{ ...editableStyle, display: "inline", width: "70%" }} /></div>
                <div><b>Account No.:</b> <input value={bankMeta.accountNo} onChange={e => updateBank("accountNo", e.target.value)} style={{ ...editableStyle, display: "inline", width: 120 }} /></div>
                <div><b>Branch Address:</b> <textarea value={bankMeta.branchAddress} onChange={e => updateBank("branchAddress", e.target.value)} rows={2} style={{ ...editableStyle, marginTop: 2 }} /></div>
                <div><b>IFSC Code:</b> <input value={bankMeta.ifscCode} onChange={e => updateBank("ifscCode", e.target.value)} style={{ ...editableStyle, display: "inline", width: 100 }} /></div>
                <div><b>PAN Number:</b> <input value={bankMeta.panNumber} onChange={e => updateBank("panNumber", e.target.value)} style={{ ...editableStyle, display: "inline", width: 100 }} /></div>
              </div>
              <div style={{ border: "1px solid #ccc", minWidth: 260, fontSize: 11 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc", fontWeight: 600 }}>SUB TOTAL</td><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc", textAlign: "right" }}>₹ <input value={(editableSubTotal !== null ? editableSubTotal : calculatedSubTotal).toFixed(2)} onChange={e => { const val = e.target.value; setEditableSubTotal(val === '' ? null : parseFloat(val) || 0); }} style={{ ...editableStyle, display: "inline", width: 80, textAlign: "right", fontWeight: 600 }} /></td></tr>
                    {defaults.taxType === "IGST" ? (
                      <tr><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc" }}>IGST @ <input value={taxMeta.igstRate} onChange={e => updateTax("igstRate", parseFloat(e.target.value) || 0)} style={{ ...editableStyle, display: "inline", width: 30, textAlign: "center" }} />%</td><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc", textAlign: "right" }}>₹ {igstAmt.toFixed(2)}</td></tr>
                    ) : (
                      <>
                        <tr><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc" }}>CGST @ <input value={taxMeta.cgstRate} onChange={e => updateTax("cgstRate", parseFloat(e.target.value) || 0)} style={{ ...editableStyle, display: "inline", width: 30, textAlign: "center" }} />%</td><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc", textAlign: "right" }}>₹ {cgstAmt.toFixed(2)}</td></tr>
                        <tr><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc" }}>SGST @ <input value={taxMeta.sgstRate} onChange={e => updateTax("sgstRate", parseFloat(e.target.value) || 0)} style={{ ...editableStyle, display: "inline", width: 30, textAlign: "center" }} />%</td><td style={{ padding: "5px 10px", borderBottom: "0.5px solid #ccc", textAlign: "right" }}>₹ {sgstAmt.toFixed(2)}</td></tr>
                      </>
                    )}
                    <tr style={{ background: "#1a3a6b", color: "#fff" }}><td style={{ padding: "6px 10px", fontWeight: 700 }}>GRAND TOTAL</td><td style={{ padding: "6px 10px", fontWeight: 700, textAlign: "right" }}>₹ {grandTotal.toFixed(2)}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginTop: 20, textAlign: "right", fontSize: 11 }}>
              <div>
                <input value={footerMeta.signatureText} onChange={e => updateFooter("signatureText", e.target.value)} style={{ ...editableStyle, textAlign: "right", fontSize: 11 }} />
              </div>
              <div style={{ marginTop: 30, borderTop: "1px solid #333", width: 200, display: "inline-block", paddingTop: 4 }}>
                <input value={footerMeta.signatureName} onChange={e => updateFooter("signatureName", e.target.value)} style={{ ...editableStyle, textAlign: "center", fontSize: 11 }} />
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: "#555" }}>
              <input value={footerMeta.reverseCharge} onChange={e => updateFooter("reverseCharge", e.target.value)} style={{ ...editableStyle, fontSize: 10, color: "#555" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const [search, setSearch] = useState("");
  const [bankFilter, setBankFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [invoiceModal, setInvoiceModal] = useState(null);
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (username, password) => {
    setLoginLoading(true);
    setLoginError("");
    const result = await loginService(username, password);
    setLoginLoading(false);

    if (result.success) {
      setIsLoggedIn(true);
      return true;
    } else {
      setLoginError(result.message);
      return false;
    }
  };

  const handleLogout = async () => {
    await logoutService();
    setIsLoggedIn(false);
  };

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  useEffect(() => {
    if (!isLoggedIn) return;

    setLoading(true);
    fetch(API_URL, { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        // Include ALL case types so every card shows the correct count.
        // Specific-status arrays come first so their status wins on dedup (first-seen wins).
        const all = [
          ...(data.pending || []).map(c => normalizeCase(c, "Pending")),
          ...(data.working || []).map(c => normalizeCase(c, "Work in Progress")),
          ...(data.queryRaised || []).map(c => normalizeCase(c, "Query Raised")),
          ...(data.cancelled || []).map(c => normalizeCase(c, "cancelled")),
          ...(data.finalSubmitted || []).map(c => normalizeCase(c, "FinalSubmitted")),
          ...(data.totalSubmissions || []).map(c => normalizeCase(c, c.status || "Submitted")),
        ];
        const seen = new Set();
        setCases(all.filter(c => { if (seen.has(String(c._id))) return false; seen.add(String(c._id)); return true; }));
        setLoading(false);
      })
      .catch(e => { setError("Could not connect to API: " + e.message); setLoading(false); });

    // Fetch saved invoices
    setLoadingInvoices(true);
    fetch("https://banker-backend-8ttk.onrender.com/api/invoices", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      credentials: "include"
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setSavedInvoices(data.data);
      })
      .catch(e => console.error("Error fetching invoices:", e))
      .finally(() => setLoadingInvoices(false));
  }, [isLoggedIn, activeTab]);

  const banks = useMemo(() => {
    const s = new Set(cases.map(c => c.bankName).filter(Boolean));
    return ["All", ...Array.from(s).sort()];
  }, [cases]);

  const stats = useMemo(() => ({
    total: cases.length,
    pending: cases.filter(c => c.status === "Pending").length,
    wip: cases.filter(c => c.status === "Work in Progress").length,
    submitted: cases.filter(c => c.status === "FinalSubmitted").length,
    cancelled: cases.filter(c => c.status === "cancelled").length,
  }), [cases]);

  useEffect(() => {
    setPage(1);
  }, [search, bankFilter, fromDate, toDate, monthFilter, yearFilter]);

  const filtered = useMemo(() => {
    return cases.filter(c => {
      if (bankFilter !== "All" && c.bankName !== bankFilter) return false;
      const q = search.toLowerCase();
      if (q && !c.customerName.toLowerCase().includes(q) && !c.bankName.toLowerCase().includes(q) && !c.refNo.toLowerCase().includes(q)) return false;

      // Primary filter for Month/Year is now Created Date
      const dCreated = parseDate(c.createdDateRaw);
      const dVisit = parseDate(c.visitDateRaw);

      if (monthFilter !== "All") {
        if (!dCreated) return false;
        const selectedMonth = Number(monthFilter);

        if (dCreated.getMonth() !== selectedMonth) return false;
        if (yearFilter !== "All" && dCreated.getFullYear() !== Number(yearFilter)) return false;
      }

      if (yearFilter !== "All") {
        if (!dCreated) return false;
        if (dCreated.getFullYear() !== Number(yearFilter)) return false;
      }

      if (statusFilter !== "All") {
        if (!c.status) return false;
        if (c.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      if (fromDate || toDate) {
        if (!dVisit) return false;
        if (fromDate && dVisit < new Date(fromDate)) return false;
        if (toDate) { const to = new Date(toDate); to.setHours(23, 59, 59); if (dVisit > to) return false; }
      }
      return true;
    });
  }, [cases, search, bankFilter, fromDate, toDate, monthFilter, yearFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const clearFilters = () => { setSearch(""); setBankFilter("All"); setFromDate(""); setToDate(""); setMonthFilter("All"); setYearFilter("All"); setStatusFilter("All"); setPage(1); };
  const hasFilters = search || bankFilter !== "All" || fromDate || toDate || monthFilter !== "All" || yearFilter !== "All" || statusFilter !== "All";

  const exportSavedInvoicesToExcel = () => {
    try {
      if (savedInvoices.length === 0) return alert("No data to export");
      const data = savedInvoices.map(inv => ({
        "Invoice No": inv.invoiceNo,
        "Bank Name": inv.bankName,
        "Bill Month": inv.billMonth,
        "Date": formatDate(inv.invoiceDate),
        "Amount": inv.totalAmount,
        "Status": inv.status || "Submitted"
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Saved Invoices");
      XLSX.writeFile(wb, "Saved_Invoices_List.xlsx");
    } catch (err) {
      console.error("Dashboard Excel Export Error:", err);
    }
  };

  const mainML = !isMobile && sidebarOpen ? 256 : 0;
  const canBulkInvoice = bankFilter !== "All" && filtered.length > 0;

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} error={loginError} loading={loginLoading} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)", fontFamily: "var(--font-sans)" }}>


      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 20 }} />
      )}

      {/* SIDEBAR */}
      <aside style={{ position: "fixed", top: 0, left: 0, height: "100%", width: 256, zIndex: 30, background: "var(--color-background-primary)", borderRight: "0.5px solid var(--color-border-tertiary)", display: "flex", flexDirection: "column", transition: "transform 0.25s", transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>U</div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>Unique</p>
              <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>Valuation Portal</p>
            </div>
          </div>
          {isMobile && (<button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}><Icon type="x" /></button>)}
        </div>
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <p style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 12px", marginBottom: 8 }}>Main menu</p>
          <button
            onClick={() => setActiveTab("Dashboard")}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--border-radius-md)", border: "none", cursor: "pointer", background: activeTab === "Dashboard" ? "#2563eb" : "transparent", color: activeTab === "Dashboard" ? "#fff" : "var(--color-text-secondary)", fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
            <Icon type="grid" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("Invoice")}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--border-radius-md)", border: "none", cursor: "pointer", background: activeTab === "Invoice" ? "#2563eb" : "transparent", color: activeTab === "Invoice" ? "#fff" : "var(--color-text-secondary)", fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
            <Icon type="invoice" /> Invoice
          </button>
        </nav>
        <div style={{ padding: 16, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: "#1e40af" }}>AV</div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Admin User</p>
              <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>Valuer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* HEADER */}
      <header style={{ position: "fixed", top: 0, right: 0, left: mainML, height: 64, zIndex: 10, background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", transition: "left 0.25s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 6 }}><Icon type="menu" /></button>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>{activeTab}</p>
            <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)" }}>{activeTab === "Dashboard" ? "Overview" : "Case Management"}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={handleLogout} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
            Logout
          </button>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 500 }}>AV</div>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ marginLeft: mainML, paddingTop: 64, minHeight: "100vh", transition: "margin-left 0.25s" }}>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
            <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={() => setActiveTab("Dashboard")}>Home</span>
            <span>/</span>
            <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{activeTab}</span>
          </div>
          {activeTab === "Dashboard" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                {[
                  { label: "Total cases", val: stats.total },
                  { label: "Pending", val: stats.pending },
                  { label: "In progress", val: stats.wip },
                  { label: "Submitted", val: stats.submitted },
                  { label: "Cancelled", val: stats.cancelled },
                ].map(s => (
                  <div key={s.label} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "14px 16px" }}>
                    <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{s.label}</p>
                    <p style={{ margin: 0, fontSize: 26, fontWeight: 500, color: "var(--color-text-primary)" }}>{s.val}</p>
                  </div>
                ))}
              </div>

              {/* SAVED INVOICES SECTION (Moved back to Dashboard) */}
              <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden", marginTop: 24 }}>
                <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)" }}>Saved Invoices (Database)</p>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>Retrieve and view invoices already saved to the database</p>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      onClick={exportSavedInvoicesToExcel}
                      style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer", color: "var(--color-text-primary)" }}
                    >
                      <Icon type="excel" size={14} /> Export Excel
                    </button>
                    {/* Bank Filter for Saved Invoices */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Bank:</span>
                      <select
                        id="savedBankFilter"
                        onChange={e => {
                          const bank = e.target.value;
                          const month = document.getElementById("savedMonthFilter").value;
                          const year = document.getElementById("savedYearFilter").value;
                          const status = document.getElementById("savedStatusFilter")?.value || "All";
                          fetch(`https://banker-backend-8ttk.onrender.com/api/invoices?bank=${bank === "All" ? "" : bank}&month=${month === "All" ? "" : month}&year=${year === "All" ? "" : year}&status=${status === "All" ? "" : status}`, {
                            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                            credentials: "include"
                          })
                            .then(r => r.json())
                            .then(data => data.success && setSavedInvoices(data.data));
                        }}
                        style={{ fontSize: 12, borderRadius: 6, padding: "5px 10px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }}
                      >
                        {banks.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>

                    {/* Month Filter for Saved Invoices */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Month:</span>
                      <select
                        id="savedMonthFilter"
                        onChange={e => {
                          const month = e.target.value;
                          const bank = document.getElementById("savedBankFilter").value;
                          const year = document.getElementById("savedYearFilter").value;
                          const status = document.getElementById("savedStatusFilter")?.value || "All";
                          fetch(`https://banker-backend-8ttk.onrender.com/api/invoices?bank=${bank === "All" ? "" : bank}&month=${month === "All" ? "" : month}&year=${year === "All" ? "" : year}&status=${status === "All" ? "" : status}`, {
                            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                            credentials: "include"
                          })
                            .then(r => r.json())
                            .then(data => data.success && setSavedInvoices(data.data));
                        }}
                        style={{ fontSize: 12, borderRadius: 6, padding: "5px 10px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }}
                      >
                        <option value="All">All Months</option>
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, idx) => (
                          <option key={m} value={idx}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Year Filter for Saved Invoices */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Year:</span>
                      <select
                        id="savedYearFilter"
                        onChange={e => {
                          const year = e.target.value;
                          const bank = document.getElementById("savedBankFilter").value;
                          const month = document.getElementById("savedMonthFilter").value;
                          const status = document.getElementById("savedStatusFilter")?.value || "All";
                          fetch(`https://banker-backend-8ttk.onrender.com/api/invoices?bank=${bank === "All" ? "" : bank}&month=${month === "All" ? "" : month}&year=${year === "All" ? "" : year}&status=${status === "All" ? "" : status}`, {
                            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                            credentials: "include"
                          })
                            .then(r => r.json())
                            .then(data => data.success && setSavedInvoices(data.data));
                        }}
                        style={{ fontSize: 12, borderRadius: 6, padding: "5px 10px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }}
                      >
                        <option value="All">All Years</option>
                        {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>

                    {/* Status Filter for Saved Invoices */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Status:</span>
                      <select
                        id="savedStatusFilter"
                        onChange={e => {
                          const status = e.target.value;
                          const bank = document.getElementById("savedBankFilter").value;
                          const month = document.getElementById("savedMonthFilter").value;
                          const year = document.getElementById("savedYearFilter").value;
                          fetch(`https://banker-backend-8ttk.onrender.com/api/invoices?bank=${bank === "All" ? "" : bank}&month=${month === "All" ? "" : month}&year=${year === "All" ? "" : year}&status=${status === "All" ? "" : status}`, {
                            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                            credentials: "include"
                          })
                            .then(r => r.json())
                            .then(data => data.success && setSavedInvoices(data.data));
                        }}
                        style={{ fontSize: 12, borderRadius: 6, padding: "5px 10px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }}
                      >
                        <option value="All">All Status</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Paid">Paid</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--color-background-secondary)" }}>
                        {["Invoice No", "Bank Name", "Bill Month", "Date", "Amount", "Status", "Action"].map(h => (
                          <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loadingInvoices ? (
                        <tr><td colSpan={6} style={{ padding: 30, textAlign: "center", color: "var(--color-text-secondary)" }}>Loading saved data...</td></tr>
                      ) : savedInvoices.length === 0 ? (
                        <tr><td colSpan={6} style={{ padding: 30, textAlign: "center", color: "var(--color-text-secondary)" }}>No saved invoices in database.</td></tr>
                      ) : savedInvoices.map((inv, idx) => (
                        <tr key={inv._id} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                          <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#2563eb" }}>{inv.invoiceNo}</td>
                          <td style={{ padding: "12px 16px", fontSize: 12 }}>{inv.bankName}</td>
                          <td style={{ padding: "12px 16px", fontSize: 12 }}>{inv.billMonth}</td>
                          <td style={{ padding: "12px 16px", fontSize: 12 }}>{formatDate(inv.invoiceDate)}</td>
                          <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>₹{inv.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 600,
                              background: inv.status === "Paid" ? "#dcfce7" : (inv.status === "Cancelled" ? "#fee2e2" : "#fef9c3"),
                              color: inv.status === "Paid" ? "#166534" : (inv.status === "Cancelled" ? "#991b1b" : "#854d0e")
                            }}>
                              {inv.status || "Submitted"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <button
                              onClick={() => setInvoiceModal({ existingInvoice: inv })}
                              style={{ background: "#eff6ff", color: "#1d4ed8", border: "0.5px solid #bfdbfe", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 500, cursor: "pointer" }}
                            >
                              View & Print
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* INVOICE TAB - Show only cases table */}
          {activeTab === "Invoice" && (
            <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden" }}>


              <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>All cases</p>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
                      {loading ? "Loading…" : `${filtered.length} of ${cases.length} cases`}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    {canBulkInvoice && !loading && (
                      <button
                        onClick={() => setInvoiceModal({ cases: filtered, isBulk: true })}
                        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#fff", background: "#1a3a6b", border: "none", borderRadius: "var(--border-radius-md)", padding: "7px 14px", cursor: "pointer", fontWeight: 500 }}
                      >
                        <Icon type="bulkInvoice" size={14} /> Create Invoice ({filtered.length})
                      </button>
                    )}
                    {hasFilters && (
                      <button onClick={clearFilters} style={{ fontSize: 12, color: "#2563eb", background: "#eff6ff", border: "0.5px solid #bfdbfe", borderRadius: "var(--border-radius-md)", padding: "5px 12px", cursor: "pointer", fontWeight: 500 }}>
                        Clear filters
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "7px 12px", minWidth: 200, flex: "1 1 200px" }}>
                    <Icon type="search" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer name…" style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "var(--color-text-primary)", width: "100%" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon type="filter" />
                    <select value={bankFilter} onChange={e => { setBankFilter(e.target.value); setPage(1); }}
                      style={{ fontSize: 13, borderRadius: "var(--border-radius-md)", padding: "7px 12px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer", minWidth: 160 }}>
                      {banks.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon type="calendar" size={16} />
                    <select value={monthFilter} onChange={e => { setMonthFilter(e.target.value); setPage(1); }}
                      style={{ fontSize: 13, borderRadius: "var(--border-radius-md)", padding: "7px 12px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer", minWidth: 130 }}>
                      <option value="All">All Months (Created)</option>
                      {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, idx) => (
                        <option key={m} value={idx}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <select value={yearFilter} onChange={e => { setYearFilter(e.target.value); setPage(1); }}
                      style={{ fontSize: 13, borderRadius: "var(--border-radius-md)", padding: "7px 12px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer", minWidth: 100 }}>
                      <option value="All">All Years</option>
                      {Array.from({ length: 5 }, (_, i) => 2024 + i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                      style={{ fontSize: 13, borderRadius: "var(--border-radius-md)", padding: "7px 12px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer", minWidth: 100 }}>
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Work in Progress">In Progress</option>
                      <option value="FinalSubmitted">Submitted</option>
                      <option value="Query Raised">Query Raised</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Visit date:</span>
                    <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setPage(1); }} style={{ fontSize: 12, borderRadius: "var(--border-radius-md)", padding: "7px 10px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer" }} />
                    <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>to</span>
                    <input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setPage(1); }} style={{ fontSize: 12, borderRadius: "var(--border-radius-md)", padding: "7px 10px", border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer" }} />
                  </div>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                {loading ? (
                  <div style={{ padding: 48, textAlign: "center", color: "var(--color-text-secondary)", fontSize: 14 }}>Loading cases from API…</div>
                ) : error ? (
                  <div style={{ padding: 48, textAlign: "center" }}>
                    <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>{error}</p>
                    <p style={{ color: "var(--color-text-secondary)", fontSize: 12, marginTop: 8 }}>Make sure your local server is running at localhost:5000</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--color-background-secondary)" }}>
                        {["#", "Bank name", "Customer name", "Ref no.", "Address", "Created Date", "Date of visit", "Status", "Invoice"].map(h => (
                          <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.length === 0 ? (
                        <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>No cases match the current filters.</td></tr>
                      ) : paginated.map((c, i) => (
                        <tr key={c._id} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--color-background-secondary)"}
                          onMouseLeave={e => e.currentTarget.style.background = ""}>
                          <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--color-text-secondary)" }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                          <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                            <span style={{ fontSize: 12, fontWeight: 500, background: "#eff6ff", color: "#1d4ed8", border: "0.5px solid #bfdbfe", borderRadius: "var(--border-radius-md)", padding: "3px 10px" }}>{c.bankName}</span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-background-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", flexShrink: 0 }}>
                                {c.customerName !== "—" ? c.customerName.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join("").toUpperCase() : "—"}
                              </div>
                              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>{c.customerName}</p>
                            </div>
                          </td>
                          <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{c.refNo}</td>
                          <td style={{ padding: "12px 16px", maxWidth: 260 }}>
                            <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={c.address}>{c.address}</p>
                          </td>
                          <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{c.createdDateFormatted}</td>
                          <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{c.dateOfVisitFormatted}</td>
                          <td style={{ padding: "12px 16px" }}><StatusBadge status={c.status} /></td>
                          <td style={{ padding: "12px 16px" }}>
                            <button
                              onClick={() => setInvoiceModal({ cases: [c], isBulk: false })}
                              title="Open Invoice"
                              style={{ display: "flex", alignItems: "center", gap: 5, background: "#eff6ff", color: "#1d4ed8", border: "0.5px solid #bfdbfe", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}
                            >
                              <Icon type="invoice" size={13} /> Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* PAGINATION */}
              {!loading && !error && (
                <div style={{ padding: "12px 20px", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>
                    Page <strong style={{ color: "var(--color-text-primary)" }}>{page}</strong> of <strong style={{ color: "var(--color-text-primary)" }}>{totalPages}</strong>{" · "}{filtered.length} result{filtered.length !== 1 ? "s" : ""}
                  </p>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 32, height: 32, border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: "none", cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-secondary)" }}><Icon type="chevL" /></button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let p = i + 1;
                      if (totalPages > 5) { const start = Math.max(1, Math.min(page - 2, totalPages - 4)); p = start + i; }
                      return (
                        <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, border: p === page ? "none" : "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: p === page ? "#2563eb" : "none", color: p === page ? "#fff" : "var(--color-text-secondary)", cursor: "pointer", fontSize: 12, fontWeight: p === page ? 500 : 400 }}>{p}</button>
                      );
                    })}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 32, height: 32, border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", background: "none", cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-secondary)" }}><Icon type="chevR" /></button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {invoiceModal && (
        <InvoiceModal
          cases={invoiceModal.cases}
          isBulk={invoiceModal.isBulk}
          existingInvoice={invoiceModal.existingInvoice}
          onClose={() => setInvoiceModal(null)}
        />
      )}
    </div>
  );
}