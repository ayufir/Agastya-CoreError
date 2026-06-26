import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../redux/features/notification/notificationThunk";
import socket from "../config/socket";
import toast from "react-hot-toast";
import React from "react";

const useNotificationSocket = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Create an audio object (make sure the path is correct)
    const notificationSound = new Audio("/notification.mp3");

    // Handle new notifications
    const handleNewNotification = (notif) => {
      dispatch(fetchNotifications());

      // Play audio on notification
      notificationSound.play().catch((err) => {
        console.warn("Audio playback failed:", err);
      });

      // Show a premium toast notification pop-up for logged-in users (especially Admin/SuperAdmin)
      if (user && notif && notif.message) {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-bounce-in" : "animate-fade-out"
              } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-indigo-100 overflow-hidden`}
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <span 
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg"
                      style={{ animation: "pulse 2s infinite" }}
                    >
                      🔔
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                      {notif.bankName ? `${notif.bankName} Case Update` : "System Update"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 leading-snug">
                      {notif.message}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      Just now
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-100">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-bold text-indigo-600 hover:text-indigo-500 hover:bg-indigo-50/50 focus:outline-none transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ),
          { duration: 6000, position: "top-right" }
        );
      }
    };

    socket.on("newNotification", handleNewNotification);

    // Cleanup on unmount
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [dispatch, user]);
};

export default useNotificationSocket;
