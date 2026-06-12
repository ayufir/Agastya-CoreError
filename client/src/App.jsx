import React from "react";
import SideBar from "./layouts/sidebar/SideBar";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import Header from "./components/Navbar";
import Spinner from "./components/Spinner";
import { useSelector } from "react-redux";
import { Spin } from "antd";


const App = () => {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <div className=''>
      {loading && (
        <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50'>
          <Spin size='large' />
        </div>
      )}
      <AppRoutes />
      <Toaster />
    </div>
  );
};

export default App;
