import { Home, List, LogOut, Layers } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { App, Select } from "antd";
import { MdAdminPanelSettings } from "react-icons/md";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../../redux/features/auth/authThunks";
import { setZone, setSavedCity } from "../../redux/features/assignedCase/assignedCasesSlice.js";
import { useState, useEffect } from "react";

const { Option } = Select;

const MenuItems = () => {
  const selectedZone = useSelector((state) => state.assignedCases.selectedZone);
  const dispatch = useDispatch();

  const cities = ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Dehradun"];

  const iconSize = 20;
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  // Zone selection state (single select)
  const [selectedZoneLocal, setSelectedZoneLocal] = useState("--Select Zone--");

  const handleChange = (value) => {
    setSelectedZoneLocal(value || "--Select Zone--");
    dispatch(setSavedCity(value || ""));
    dispatch(setZone(value || ""));
  };

  // Sync Redux zone back to local state on mount
  useEffect(() => {
    if (selectedZone) {
      setSelectedZoneLocal(selectedZone);
    } else {
      setSelectedZoneLocal("--Select Zone--");
    }
  }, [selectedZone]);

  const openInvoice = () => {
    window.open(
      "https://banker-invoice.onrender.com",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const user = useSelector((state) => state.auth.user);

  let dashboardPath = "/";
  if (user?.role === "FieldOfficer" || user?.role === "FIELDOFFICER") {
    dashboardPath = "/field/dashboard";
  } else if (user?.role === "Coordinator") {
    dashboardPath = "/coordinator/dashboard";
  } else if (user?.role === "TechnicalManager") {
    dashboardPath = "/tm/dashboard";
  } else if (user?.role === "RegionalManager") {
    dashboardPath = "/rtm/dashboard";
  } else if (user?.role === "Accountant") {
    dashboardPath = "/accountant/dashboard";
  }

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/",
      icon: <Home size={iconSize} />,
      isActive: currentPath === "/",
    },
    {
      name: "Application Pipeline",
      path: "/pipeline",
      icon: <Layers size={iconSize} />,
      isActive: currentPath === "/pipeline",
    },
    {
      name: "Banks",
      path: "/bank-logo",
      icon: <Home size={iconSize} />,
      isActive: currentPath === "/bank-logo",
    },
    {
      name: "Invoice All",
      action: openInvoice,
      icon: <List size={iconSize} />,
    },
    {
      name: "Manage Employees",
      path: "/admin/employees",
      icon: <MdAdminPanelSettings size={iconSize} />,
      isActive: currentPath.includes("/admin/employees"),
    },
    { name: "Logout", path: "/logout", icon: <LogOut size={iconSize} /> },
  ];

  const fieldOfficerMenu = [
    {
      name: "Dashboard",
      path: dashboardPath,
      icon: <Home size={iconSize} />,
      isActive: currentPath === dashboardPath,
    },
    { name: "Logout", path: "/logout", icon: <LogOut size={iconSize} /> },
  ];

  const onLogout = () => {
    navigate("/login");
    dispatch(logoutThunk());
    toast.success("Logged Out Successfully");
  };

  const isCentralStaff = ["Coordinator"].includes(user?.role) && ["Bhopal", "Gwalior", "Jabalpur"].includes(user?.assignedCity);
  const showCitySelector = ["SuperAdmin", "Admin"].includes(user?.role) || isCentralStaff;
  const allowedCities = isCentralStaff ? ["Bhopal", "Jabalpur", "Gwalior"] : cities;

  useEffect(() => {
    if (user) {
      const centralCities = ["Bhopal", "Gwalior", "Jabalpur"];
      if (["SuperAdmin", "Admin"].includes(user.role)) {
        // SuperAdmin & Admin see all zones by default
      } else if (["Coordinator"].includes(user.role) && centralCities.includes(user.assignedCity)) {
        // Central staff see Bhopal + Gwalior + Jabalpur combined by default
        dispatch(setZone(""));
      } else {
        dispatch(setZone(user.assignedCity || ""));
      }
    }
  }, [user, dispatch]);

  const menus = ["SuperAdmin", "Admin"].includes(user?.role) ? adminMenu : fieldOfficerMenu;

  const isFieldOfficer = ["FieldOfficer", "FIELDOFFICER"].includes(user?.role);

  return (
    <div className='h-full w-full font-outfit'>
      {/* User Avatar Section */}
      <div className='flex-col items-center gap-3 mb-6'>
        <div className='flex gap-2 relative left-2'>
          <div className={`h-12 w-12 uppercase rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md ${
            isFieldOfficer ? 'bg-[#5c8a7b]' : 'bg-gray-400'
          }`}>
            <p>{user?.name?.slice(0, 1)}</p>
          </div>
          <div className='mt-1'>
            <h1 className='text-gray-800 font-bold relative text-xl leading-tight'>
              {user?.name}
            </h1>
            <p className={`text-[10px] font-extrabold uppercase tracking-widest ${
              isFieldOfficer ? 'text-[#3b6657]' : 'text-red-600'
            }`}>
              {user?.role === "SuperAdmin" ? "Super Admin" : (user?.role === "FIELDOFFICER" ? "Field Officer" : user?.role)}
            </p>
          </div>
        </div>

        {showCitySelector ? (
        <>
          <div className='w-full max-w-sm mx-auto p-2'>
            <label
              htmlFor='city'
              className='block text-sm font-medium text-gray-200 mb-1'
            >
              {/* Select City */}
            </label>
            
            {/* ✅ UPDATED: Multiple Select for Zones */}
            <Select
              id='city'
              value={selectedZoneLocal}
              onChange={handleChange}
              placeholder="--Select Zone--"
              className='w-52'
              allowClear
            >
              {allowedCities.map((city, index) => (
                <Option key={index} value={city}>
                  {city}
                </Option>
              ))}
            </Select>
          </div>
        </>
      ) : (
        <div className='w-full max-w-sm mx-auto p-2'>
          <div className={`px-4.5 py-2 border rounded-2xl text-xs font-bold transition-all ${
            isFieldOfficer 
              ? 'bg-[#eef7f4] border-[#d0e6df] text-[#1c2725]' 
              : 'bg-gray-100 border-gray-300 text-gray-700'
          }`}>
            Zone: {user?.assignedCity || "All Zones"}
          </div>
        </div>
      )}
      </div>

      {/* Menu Items */}
      <div className='flex flex-col gap-2'>
        {menus.map((item) => {
          let activeClass = "bg-[#C40C0C] text-white shadow-md";
          if (isFieldOfficer) {
            activeClass = "bg-[#1c2725] text-white shadow-md shadow-[#1c2725]/15";
          }
          
          return (
            <div
              key={item.name}
              onClick={() => {
                if (item.name === "Logout") {
                  onLogout();
                } else if (item.action) {
                  item.action();
                } else {
                  navigate(item.path);
                }
              }}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                item.isActive
                  ? activeClass
                  : `text-gray-700 hover:bg-gray-100 ${isFieldOfficer ? 'hover:bg-[#eef7f4]/60 hover:text-[#1c2725]' : ''}`
              }`}
            >
              {item.icon}
              <span className='text-sm font-bold'>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuItems;