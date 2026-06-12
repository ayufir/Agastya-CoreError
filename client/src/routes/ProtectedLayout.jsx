// // src/layouts/ProtectedLayout.jsx
// import React from "react";
// import { Outlet } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";
// import Header from "../components/Navbar";
// import SideBar from "../layouts/sidebar/SideBar";

// const ProtectedLayout = () => {
//   return (
//     <ProtectedRoute>
//       <Header />
//       <div className='h-screen flex overflow-hidden'>
//         <div className='   md:w-64 h-full bg-gray-100'>
//           <SideBar />
//         </div>
//         <div className='flex-1 overflow-y-auto h-full'>
//           <Outlet /> {/* Nested page render hoga yahan */}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default ProtectedLayout;

// ! abhishek code
import { useState } from "react";
// import { ProtectedRoute, Header, SideBar, Outlet } from './your-components';
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Header from "../components/Navbar";
import SideBar from "../layouts/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setZone } from "../redux/features/assignedCase/assignedCasesSlice.js";

const ProtectedLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user?.role !== "SuperAdmin" && user?.assignedCity) {
      dispatch(setZone(user.assignedCity));
    }
  }, [user, dispatch]);

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - using your existing component */}
          <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

          {/* Main content area */}
          <div
            className={`flex-1 overflow-y-auto h-full transition-all duration-300 ${isCollapsed ? "lg:ml-[20px] ml-0" : "lg:ml-6 ml-0"
              }`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProtectedLayout;
