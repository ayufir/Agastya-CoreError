import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
} from "../redux/features/notification/notificationThunk"; // adjust path as needed
import { Bell } from "lucide-react";
import useNotificationSocket from "../hooks/useNotificationSocket";

const BellWithNotifications = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state?.notification);
  const [open, setOpen] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useNotificationSocket();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".notification-bell")) {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  // Handlers
  const handleClearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      dispatch(clearNotifications());
    }
  }, [dispatch]);

  const handleMarkAllRead = useCallback(() => {
    if (unreadCount > 0) {
      dispatch(markAllNotificationsAsRead());
    }
  }, [dispatch, unreadCount]);

  const handleClickNotification = useCallback(
    (id) => {
      dispatch(markNotificationAsRead(id));
    },
    [dispatch]
  );

  return (
    <div className='relative notification-bell'>
      <button
        onClick={() => setOpen(!open)}
        className='relative focus:outline-none'
      >
        <Bell className='h-6 w-6 text-gray-500 hover:text-gray-700' />
        {unreadCount > 0 && (
          <span className='absolute top-0 right-0 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full'>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded-md z-50 max-h-96 overflow-y-auto'>
          <div className='flex justify-between items-center px-4 py-2 border-b'>
            <h4 className='font-semibold text-sm'>Notifications</h4>
            <div className='flex gap-2'>
              {/* <button
                onClick={handleMarkAllRead}
                className='text-sm text-blue-500 hover:underline'
              >
                Mark all as read
              </button> */}
              <button
                onClick={handleClearAll}
                className='text-red-600 hover:text-red-800 text-sm'
              >
                Clear All
              </button>
            </div>
          </div>
          <ul>
            {notifications.length === 0 ? (
              <li className='p-4 text-gray-500 text-sm'>No notifications</li>
            ) : (
              notifications.map((notif) => (
                <li
                  key={notif._id}
                  onClick={() => handleClickNotification(notif._id)}
                  className={`px-4 py-2 cursor-pointer border-b text-sm hover:bg-gray-100 ${
                    notif.isRead ? "text-gray-500" : "text-black font-semibold"
                  }`}
                  title='Click to mark as read'
                >
                  {notif.message}
                  <br />
                  <span className='text-xs text-gray-400'>
                    {notif.bankName || "—"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BellWithNotifications;
