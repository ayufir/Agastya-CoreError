import { Home, List, LogOut } from "lucide-react";
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
    setSelectedZoneLocal(value);
    // Save selected city for report creation only (do NOT change dashboard filter)
    dispatch(setSavedCity(value));
  };

  // Sync Redux zone back to local state on mount
  useEffect(() => {
    if (selectedZone) {
      setSelectedZoneLocal(selectedZone);
    }
  }, [selectedZone]);

  const openInvoice = () => {
    window.open(
      "https://banker-invoice.onrender.com",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/",
      icon: <Home size={iconSize} />,
      isActive: currentPath === "/",
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
      path: "/field/dashboard",
      icon: <Home size={iconSize} />,
      isActive: currentPath === "/field/dashboard",
    },
    { name: "Logout", path: "/logout", icon: <LogOut size={iconSize} /> },
  ];

  const onLogout = () => {
    navigate("/login");
    dispatch(logoutThunk());
    toast.success("Logged Out Successfully");
  };

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // If not SuperAdmin, auto-set the zone to the user's assigned city
    if (user && user.role !== "SuperAdmin") {
      dispatch(setZone(user.assignedCity || ""));
    }
  }, [user, dispatch]);

  const menus = ["SuperAdmin", "Admin"].includes(user?.role) ? adminMenu : fieldOfficerMenu;

  return (
    <div className='h-full w-full'>
      {/* User Avatar Section */}
      <div className='flex-col items-center gap-3 mb-6'>
        <div className='flex gap-2 relative left-2'>
          <div className='h-12 w-12 uppercase bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md'>
            <p>{user?.name.slice(0, 1)}</p>
          </div>
          <div className='mt-1'>
            <h1 className='text-gray-800 font-semibold relative text-xl leading-tight'>
              {user?.name}
            </h1>
            <p className='text-[10px] text-red-600 font-bold uppercase tracking-widest'>
              {user?.role === "SuperAdmin" ? "Super Admin" : user?.role}
            </p>
          </div>
        </div>

        {user?.role === "SuperAdmin" ? (
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
                {cities.map((city, index) => (
                  <Option key={index} value={city}>
                    {city}
                  </Option>
                ))}
              </Select>
            </div>
          </>
        ) : (
          <div className='w-full max-w-sm mx-auto p-2'>
            <div className='px-3 p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-medium'>
              Zone: {user?.assignedCity || "All Zones"}
            </div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className='flex flex-col gap-2'>
        {menus.map((item) => (
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
            className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
              item.isActive
                ? "bg-[#C40C0C] text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            <span className='text-sm font-medium'>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuItems;