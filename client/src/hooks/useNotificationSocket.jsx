import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../redux/features/notification/notificationThunk";
import socket from "../config/socket";
import toast from "react-hot-toast";
import React from "react";
import { useNavigate } from "react-router-dom";

const useNotificationSocket = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Join personal notification room so server can emit only to this user
    if (user?._id) {
      socket.emit("joinRoom", user._id);
    }

    const notificationSound = new Audio("/notification.mp3");

    const handleNewNotification = (notif) => {
      dispatch(fetchNotifications());

      notificationSound.play().catch(() => {});

      if (user && notif && notif.message) {
        const isFoSubmit = notif.type === "fo_submit";

        toast.custom(
          (t) => (
            <div
              className={`${t.visible ? "animate-bounce-in" : "animate-fade-out"} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border overflow-hidden`}
              style={{
                background: isFoSubmit
                  ? "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)",
                borderColor: isFoSubmit ? "#bbf7d0" : "#e0e7ff",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <span
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full font-bold text-lg"
                      style={{
                        background: isFoSubmit ? "#dcfce7" : "#e0e7ff",
                        color: isFoSubmit ? "#16a34a" : "#4f46e5",
                      }}
                    >
                      {isFoSubmit ? "📋" : "🔔"}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: isFoSubmit ? "#16a34a" : "#6366f1" }}
                    >
                      {isFoSubmit
                        ? "✅ Field Officer Submission"
                        : notif.bankName
                        ? `${notif.bankName} Update`
                        : "System Update"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 leading-snug">
                      {notif.message}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-400">Abhi</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border-l border-gray-100">
                {isFoSubmit && notif.route && (
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      navigate(notif.route);
                    }}
                    className="flex-1 border-b border-gray-100 p-3 flex items-center justify-center text-xs font-bold text-green-600 hover:bg-green-50 transition-colors"
                  >
                    👁 View Case
                  </button>
                )}
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="flex-1 p-3 flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ),
          { duration: 8000, position: "top-right" }
        );
      }
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [dispatch, user, navigate]);
};

export default useNotificationSocket;
