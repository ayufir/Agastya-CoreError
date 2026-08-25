import React from "react";
import SideBar from "./layouts/sidebar/SideBar";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import Header from "./components/Navbar";
import Spinner from "./components/Spinner";
import { useSelector } from "react-redux";
import { Spin } from "antd";

const DevBadge = () => (
  <div
    style={{
      position: "fixed",
      bottom: "14px",
      right: "16px",
      zIndex: 99999,
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(99,102,241,0.18)",
      borderRadius: "20px",
      padding: "5px 13px 5px 9px",
      boxShadow: "0 2px 16px rgba(99,102,241,0.10)",
      opacity: 0.45,
      transition: "opacity 0.3s ease, box-shadow 0.3s ease",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.opacity = "1";
      e.currentTarget.style.boxShadow = "0 4px 24px rgba(99,102,241,0.30)";
      e.currentTarget.style.pointerEvents = "auto";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.opacity = "0.45";
      e.currentTarget.style.boxShadow = "0 2px 16px rgba(99,102,241,0.10)";
    }}
  >
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "linear-gradient(135deg,#6366f1,#818cf8)",
      fontSize: "11px",
    }}>💻</span>
    <span style={{
      fontSize: "10px",
      fontWeight: "600",
      color: "#64748b",
      letterSpacing: "0.03em",
      fontFamily: "sans-serif",
    }}>
      Dev by{" "}
      <span style={{ color: "#6366f1", fontWeight: "800" }}>Ayush Shrivastava</span>
    </span>
  </div>
);

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
      <DevBadge />
    </div>
  );
};

export default App;
