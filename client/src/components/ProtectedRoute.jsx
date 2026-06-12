import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/features/auth/authSlice";
import Spinner from "./Spinner";
import { ShowLoading, HideLoading } from "../redux/features/alerts/alertSlice";
import { Spin, message } from "antd";
import toast from "react-hot-toast";

// const ProtectedRoute = ({ children }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       dispatch(ShowLoading());
//       try {
//         const res = await axiosInstance.get("/auth/currentUser");

//         if (res.data && res.data._id) {
//           dispatch(SetUser(res.data));
//         } else {
//           // If user is not valid, handle it
//           handleSessionExpired();
//         }
//       } catch (error) {
//         console.error("Auth check failed:", error);
//         handleSessionExpired(); // Catch errors like 401 Unauthorized
//       } finally {
//         dispatch(HideLoading());
//         setChecking(false);
//       }
//     };

//     const handleSessionExpired = () => {
//       toast.error("Session expired. Please login to access");
//       dispatch(SetUser(null)); // Clear user from Redux
//       navigate("/login", { replace: true }); // Redirect to login
//     };

//     checkAuth();
//   }, [dispatch, navigate]);

//   if (checking) {
//     return (
//       <div className='min-h-screen flex items-center justify-center'>
//         <Spin />
//       </div>
//     );
//   }

//   // You can still keep this fallback, but it will be rare if session is expired
//   if (!user) {
//     return <Navigate to='/login' replace />;
//   }

//   return children;
// };

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(ShowLoading());
      try {
        const res = await axiosInstance.get("/auth/currentUser");

        if (res.data && res.data._id) {
          dispatch(SetUser(res.data));
          setChecking(false); // ✅ success
        } else {
          handleSessionExpired(); // ✅ failed
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        handleSessionExpired(); // ✅ failed
      } finally {
        dispatch(HideLoading());
      }
    };

    const handleSessionExpired = () => {
      dispatch(SetUser(null));
      setChecking(false); // ✅ stop spinner
      toast.error("Session expired. Please login");
      navigate("/login", { replace: true });
    };

    checkAuth();
  }, [dispatch, navigate]);

  if (checking) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

export default ProtectedRoute;
