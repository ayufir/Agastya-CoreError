import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../redux/features/auth/authThunks";
import axiosInstance from "../config/axios";
import { getDisplayCustomerName, getBankRoute, getDisplayCity } from "../utils/dashboardRecord";
import toast from "react-hot-toast";
import { useLanguage } from "../context/LanguageContext";
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  Globe,
  Home,
  HelpCircle,
  Layers,
  LogOut,
  RotateCw,
  Building2,
  Check,
  ExternalLink,
  Sparkles,
  FileText
} from "lucide-react";
import BellWithNotifications from "./BellWithNotifications";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lang, setLang, t } = useLanguage();
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGlobeOpen, setIsGlobeOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCases, setAllCases] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const profileRef = useRef(null);
  const globeRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleHardRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (globeRef.current && !globeRef.current.contains(event.target)) {
        setIsGlobeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K to open Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus search input when modal opens & fetch cases
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
      if (allCases.length === 0) {
        setSearchLoading(true);
        axiosInstance
          .get("/case/summary-data")
          .then((res) => {
            const data = Array.isArray(res.data)
              ? res.data
              : res.data?.cases || res.data?.data || [];
            setAllCases(data);
          })
          .catch((err) => {
            console.error("Error loading cases for quick search:", err);
          })
          .finally(() => setSearchLoading(false));
      }
    }
  }, [isSearchOpen]);

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/login");
  };

  const handleLogoClick = () => {
    const role = user?.role;
    if (role === "Admin" || role === "SuperAdmin") {
      navigate("/");
    } else if (role === "FieldOfficer" || role === "FIELDOFFICER") {
      navigate("/field/dashboard");
    } else if (role === "Coordinator") {
      navigate("/coordinator/dashboard");
    } else if (role === "TechnicalManager") {
      navigate("/tm/dashboard");
    } else if (role === "RegionalManager") {
      navigate("/rtm/dashboard");
    } else if (role === "Accountant") {
      navigate("/accountant/dashboard");
    } else {
      if (role?.toLowerCase() === "fieldofficer") {
        navigate("/field/dashboard");
      } else {
        navigate("/");
      }
    }
  };

  const navLinks = [
    { name: "Home", href: "#", icon: <Home size={16} /> },
    ...(["Admin", "SuperAdmin"].includes(user?.role)
      ? [
          {
            name: "Application Pipeline",
            href: "/pipeline",
            icon: <Layers size={16} />,
          },
        ]
      : []),
    { name: "Help/FAQs", href: "/help", icon: <HelpCircle size={16} /> },
  ];

  // Filtered search results
  const filteredCases = searchQuery.trim()
    ? allCases.filter((c) => {
        const query = searchQuery.toLowerCase();
        const custName = (getDisplayCustomerName(c) || "").toLowerCase();
        const fileNo = (c.fileNo || c.lanNo || c.caseId || c._id || "").toLowerCase();
        const bankName = (c.bankName || c.bank || "").toLowerCase();
        const city = (getDisplayCity(c) || "").toLowerCase();

        return (
          custName.includes(query) ||
          fileNo.includes(query) ||
          bankName.includes(query) ||
          city.includes(query)
        );
      }).slice(0, 10)
    : allCases.slice(0, 5);

  const handleSelectCase = (c) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    const bankRoute = getBankRoute(c);
    const targetId = c._id || c.id || c.caseId;
    if (bankRoute && targetId) {
      navigate(`/bank-form/${bankRoute}/${targetId}`);
    } else {
      toast.error("Case route not found.");
    }
  };

  const languages = [
    { id: "English", label: "English (US / Global)", flag: "🇮🇳" },
    { id: "Hinglish", label: "Hinglish (हिन्दी + English)", flag: "🇮🇳" },
    { id: "Hindi", label: "Hindi (हिन्दी)", flag: "🇮🇳" },
  ];

  return (
    <>
      <header className='bg-white shadow-sm sticky top-0 z-50'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16 '>
            {/* Logo + Desktop Nav */}
            <div className='flex items-center'>
              <div className='text-center cursor-pointer select-none' onClick={handleLogoClick}>
                <h1 className='text-[#C40C0C] font-extrabold text-2xl leading-tight'>
                  Unique
                  <span className='text-gray-800 text-lg'> Engineering</span>
                </h1>
              </div>

              <div className='hidden md:ml-6 md:flex md:space-x-8'>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(link.name);
                      if (link.href.startsWith("/")) {
                        navigate(link.href);
                      } else if (link.name === "Home") {
                        handleLogoClick();
                      }
                    }}
                    className={`inline-flex items-center gap-1 px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      activeTab === link.name
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-indigo-300 hover:text-gray-700"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Desktop Icons */}
            <div className='hidden md:flex md:items-center md:space-x-4'>
              {/* 🔍 Global Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                title="Global Case Search (Ctrl+K)"
                className="flex items-center gap-2 p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
              >
                <Search className='h-5 w-5' />
                <span className="hidden lg:inline text-xs font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                  Ctrl+K
                </span>
              </button>

              {/* 🌐 Globe / Language Dropdown Trigger */}
              <div className="relative" ref={globeRef}>
                <button
                  onClick={() => setIsGlobeOpen(!isGlobeOpen)}
                  title="Language & Portal Options"
                  className={`p-2 rounded-xl transition-all ${
                    isGlobeOpen
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  <Globe className='h-5 w-5' />
                </button>

                {isGlobeOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-gray-100 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-2">
                    <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50 rounded-xl mb-1">
                      <p className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-indigo-600" /> Language & Regional Mode
                      </p>
                    </div>

                    <div className="space-y-1">
                      {languages.map((langItem) => (
                        <button
                          key={langItem.id}
                          onClick={() => {
                            setLang(langItem.id);
                            setIsGlobeOpen(false);
                            toast.success(`Language set to ${langItem.id}`);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                            lang === langItem.id
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{langItem.flag}</span>
                            {langItem.label}
                          </span>
                          {lang === langItem.id && <Check className="w-4 h-4 text-indigo-600" />}
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setIsGlobeOpen(false);
                          toast.success("Connected to Agastya Valuation Network");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-indigo-500" />
                        Agastya Portal Network
                        <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <BellWithNotifications />

              <button
                onClick={handleHardRefresh}
                title="Hard Refresh Page & Clear Cache"
                className="p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 focus:outline-none flex items-center justify-center border border-gray-200 shadow-sm"
                style={{ background: "#f8fafc" }}
              >
                <RotateCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
              </button>

              <div className='relative' ref={profileRef}>
                <User 
                  className='h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700' 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                />
                {isProfileOpen && (
                  <div className='absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50'>
                    <div className='py-1' role='menu' aria-orientation='vertical'>
                      <div className='px-4 py-3 border-b border-gray-100'>
                        <p className='text-sm text-gray-500'>Signed in as</p>
                        <p className='text-sm font-medium text-gray-900 truncate'>{user?.name || "User"}</p>
                        <p className='text-xs text-gray-500 truncate'>{user?.email || "No email"}</p>
                        <p className='text-xs font-semibold text-indigo-600 mt-1 uppercase'>{user?.role || "Role"}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2'
                        role='menuitem'
                      >
                        <LogOut size={16} />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className='flex items-center md:hidden'>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none'
              >
                {isMobileMenuOpen ? (
                  <X className='h-6 w-6' />
                ) : (
                  <Menu className='h-6 w-6' />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden bg-white border-t border-gray-200'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(link.name);
                    setIsMobileMenuOpen(false);
                    if (link.href.startsWith("/")) {
                      navigate(link.href);
                    } else if (link.name === "Home") {
                      handleLogoClick();
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    activeTab === link.name
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </a>
              ))}
            </div>
            <div className='pt-4 pb-3 border-t border-gray-200 flex items-center px-5 space-x-4'>
              <button onClick={() => setIsSearchOpen(true)} className="p-1 text-gray-500 hover:text-indigo-600">
                <Search className='h-6 w-6' />
              </button>
              <button onClick={() => setIsGlobeOpen(!isGlobeOpen)} className="p-1 text-gray-500 hover:text-indigo-600">
                <Globe className='h-6 w-6' />
              </button>
              <BellWithNotifications />
              <button onClick={handleHardRefresh} title="Hard Refresh" className="p-1.5 rounded-full text-gray-500 hover:text-indigo-600 border border-gray-200">
                <RotateCw className={`h-5 w-5 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`} />
              </button>
              <div className='flex items-center gap-2 cursor-pointer' onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <User className='h-6 w-6 text-gray-500' />
                <span className='text-sm font-medium text-gray-700'>{user?.name || "Profile"}</span>
              </div>
              <button onClick={handleLogout} className='text-red-500 p-2'>
                <LogOut size={20} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Global Case Quick Search Modal ── */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4 animate-in fade-in duration-150"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-5 py-4 border-b border-slate-150 bg-slate-50/70 gap-3">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases by Customer Name, File No, Bank, City..."
                className="w-full bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-2.5 py-1 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
              >
                ESC
              </button>
            </div>

            {/* Case Results List */}
            <div className="overflow-y-auto p-3 space-y-2 max-h-[450px]">
              {searchLoading ? (
                <div className="py-12 text-center text-slate-400 text-sm font-semibold flex items-center justify-center gap-2">
                  <RotateCw className="w-5 h-5 animate-spin text-indigo-600" />
                  Loading cases...
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm font-medium">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  No cases found matching "{searchQuery}"
                </div>
              ) : (
                filteredCases.map((c) => {
                  const custName = getDisplayCustomerName(c) || "Unnamed Customer";
                  const fileNo = c.fileNo || c.lanNo || c.caseId || c._id;
                  const city = getDisplayCity(c) || "N/A";
                  const bank = c.bankName || c.bank || "Valuation Report";

                  return (
                    <div
                      key={c._id || c.id}
                      onClick={() => handleSelectCase(c)}
                      className="group flex items-center justify-between p-3.5 rounded-2xl border border-slate-150 bg-white hover:bg-indigo-50/70 hover:border-indigo-200 cursor-pointer transition-all duration-150"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100/80 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
                            {bank}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            File: {fileNo}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-900 truncate">
                          {custName}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                          📍 {city}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-3 py-1 rounded-xl bg-slate-100 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white text-xs font-bold transition-colors flex items-center gap-1">
                          View <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

