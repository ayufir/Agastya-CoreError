import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  clearNotifications,
} from "../redux/features/notification/notificationThunk";
import { Bell, CheckCheck, Trash2, ExternalLink, Sparkles, Building2, Clock, CheckCircle2 } from "lucide-react";
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
      {/* ── Bell Trigger Button ── */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 border ${
          open
            ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20 scale-105"
            : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200/90 shadow-sm"
        }`}
        title="Notifications"
      >
        <Bell className={`w-5 h-5 transition-transform duration-300 ${unreadCount > 0 ? "animate-[bounce_2s_infinite]" : ""}`} />
        
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black shadow-md shadow-red-500/30 border-2 border-white animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
        )}
      </button>

      {/* ── Notification Dropdown Panel ── */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-900/15 rounded-3xl z-50 max-h-[500px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-sm shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-amber-300 border border-white/10">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-rose-500/90 text-white rounded-full text-[10px] font-black tracking-wide shadow-sm">
                      {unreadCount} NEW
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-slate-300 font-medium">Case updates & submissions</p>
              </div>
            </div>
            
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/80 text-white/90 hover:text-white text-[11px] font-bold transition-all duration-200 border border-white/10 cursor-pointer"
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* List Content */}
          <ul className="divide-y divide-slate-100 overflow-y-auto max-h-[410px] custom-scrollbar p-1.5 space-y-1">
            {notifications.length === 0 ? (
              <li className="py-12 px-4 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-inner">
                  <Sparkles className="w-7 h-7 animate-pulse" />
                </div>
                <h5 className="text-sm font-bold text-slate-800">All caught up!</h5>
                <p className="text-xs text-slate-400 mt-1 font-medium max-w-[200px] mx-auto">
                  You have no new notifications right now.
                </p>
              </li>
            ) : (
              notifications.map((notif) => {
                const isFoSubmit = notif.type === "fo_submit";
                return (
                  <li
                    key={notif._id}
                    onClick={() => handleClickNotification(notif)}
                    className={`group relative p-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${
                      notif.isRead
                        ? "bg-white hover:bg-slate-50/90 text-slate-600"
                        : isFoSubmit
                        ? "bg-gradient-to-r from-emerald-50/90 to-teal-50/50 hover:from-emerald-100/80 hover:to-teal-100/70 text-slate-900 border border-emerald-200/60 shadow-sm"
                        : "bg-gradient-to-r from-indigo-50/90 to-purple-50/50 hover:from-indigo-100/80 hover:to-purple-100/70 text-slate-900 border border-indigo-200/60 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon Badge */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                          isFoSubmit
                            ? "bg-emerald-500 text-white shadow-emerald-500/20"
                            : "bg-indigo-600 text-white shadow-indigo-600/20"
                        }`}
                      >
                        {isFoSubmit ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Bell className="w-5 h-5" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-2">
                        {isFoSubmit && (
                          <div className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1">
                            Field Officer Submission
                          </div>
                        )}

                        <div className={`text-xs leading-relaxed ${notif.isRead ? "font-medium text-slate-600" : "font-extrabold text-slate-900"}`}>
                          {notif.message}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2 pt-1 border-t border-slate-200/40">
                          {notif.bankName && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-slate-700 bg-white/80 px-1.5 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                              <Building2 className="w-3 h-3 text-indigo-500" />
                              {notif.bankName}
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          {notif.route && !notif.isRead && (
                            <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] font-black text-indigo-600 group-hover:translate-x-0.5 transition-transform duration-200">
                              View <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Unread Status Dot */}
                      {!notif.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 shrink-0 mt-1 animate-pulse" />
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
