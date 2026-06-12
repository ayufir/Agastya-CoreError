import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
} from "./notificationThunk";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // If you want some local sync reducers, add here
  },
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // markNotificationAsRead
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        // Update the notification in state.notifications
        const updatedNotif = action.payload;
        const index = state.notifications.findIndex(
          (n) => n._id === updatedNotif._id
        );
        if (index !== -1) {
          state.notifications[index] = updatedNotif;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // markAllNotificationsAsRead
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.loading = false;
        // Mark all notifications in state as read
        state.notifications = state.notifications.map((notif) => ({
          ...notif,
          isRead: true,
        }));
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(clearNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearNotifications.fulfilled, (state) => {
        state.loading = false;
        state.notifications = []; // Clear from store too
      })
      .addCase(clearNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
