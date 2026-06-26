import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../redux/features/auth/authThunks";
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
  LogOut
} from "lucide-react";
import BellWithNotifications from "./BellWithNotifications";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <div className=' mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 '>
          {/* Logo + Desktop Nav */}
          <div className='flex items-center'>
            <div className='text-center cursor-pointer select-none' onClick={handleLogoClick}>
              <h1 className='text-[#C40C0C] font-extrabold text-2xl leading-tight'>
                Unique
                <span className='text-gray-800 text-lg'> Engineering</span>
              </h1>
              {/* <p className="text-xs text-gray-500 mt-1">Admin Panel</p> */}
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
            <Search className='h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700' />
            <Globe className='h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700' />
            {/* <Bell className='h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700' /> */}
            <BellWithNotifications />
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
            <Search className='h-6 w-6 text-gray-500' />
            <Globe className='h-6 w-6 text-gray-500' />
            <Bell className='h-6 w-6 text-gray-500' />
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
  );
};

export default Header;
