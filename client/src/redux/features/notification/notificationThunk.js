import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../config/axios";

// Get all notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/notifications");

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Mark one notification as read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/notifications/read/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.put("/notifications/read-all");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const clearNotifications = createAsyncThunk(
  "notifications/clearAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete("/notifications/clear");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
