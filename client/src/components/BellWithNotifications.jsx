import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  clearNotifications,
} from "../redux/features/notification/notificationThunk";
import { Bell } from "lucide-react";
import useNotificationSocket from "../hooks/useNotificationSocket";
import { useNavigate } from "react-router-dom";

const BellWithNotifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications } = useSelector((state) => state?.notification);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useNotificationSocket();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".notification-bell")) {
        setOpen(false);
      }
    };
    if (open) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [open]);

  const handleClearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      dispatch(clearNotifications());
    }
  }, [dispatch]);

  const handleClickNotification = useCallback(
    (notif) => {
      dispatch(markNotificationAsRead(notif._id));
      if (notif.route) {
        setOpen(false);
        navigate(notif.route);
      }
    },
    [dispatch, navigate]
  );

  return (
    <div className="relative notification-bell">
      <button onClick={() => setOpen(!open)} className="relative focus:outline-none">
        <Bell className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        {unreadCount > 0 ? (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
            {unreadCount}
          </span>
        ) : (
          <span className="absolute top-1 right-1 bg-gray-400 w-2 h-2 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border shadow-xl rounded-xl z-50 max-h-[420px] overflow-y-auto">
          <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50 rounded-t-xl">
            <h4 className="font-bold text-sm text-gray-800">
              🔔 Notifications{" "}
              {unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-extrabold">
                  {unreadCount} new
                </span>
              )}
            </h4>
            <button onClick={handleClearAll} className="text-red-500 hover:text-red-700 text-xs font-semibold">
              Clear All
            </button>
          </div>
          <ul>
            {notifications.length === 0 ? (
              <li className="p-6 text-center text-gray-400 text-sm">
                <div className="text-3xl mb-2">🔔</div>
                No notifications yet
              </li>
            ) : (
              notifications.map((notif) => {
                const isFoSubmit = notif.type === "fo_submit";
                return (
                  <li
                    key={notif._id}
                    onClick={() => handleClickNotification(notif)}
                    className={`px-4 py-3 border-b cursor-pointer transition-colors ${
                      notif.isRead
                        ? "bg-white hover:bg-gray-50 text-gray-500"
                        : isFoSubmit
                        ? "bg-green-50 hover:bg-green-100 text-gray-800"
                        : "bg-indigo-50 hover:bg-indigo-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base mt-0.5">{isFoSubmit ? "📋" : "🔔"}</span>
                      <div className="flex-1 min-w-0">
                        {isFoSubmit && (
                          <div className="text-[10px] font-extrabold text-green-600 uppercase tracking-wider mb-0.5">
                            ✅ Field Officer Submission
                          </div>
                        )}
                        <div className={`text-sm leading-snug ${notif.isRead ? "font-normal" : "font-semibold"}`}>
                          {notif.message}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-gray-400">
                            {notif.bankName || "—"} •{" "}
                            {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {notif.route && !notif.isRead && (
                            <span className="text-[10px] text-indigo-500 font-bold">Click to view →</span>
                          )}
                        </div>
                      </div>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BellWithNotifications;
