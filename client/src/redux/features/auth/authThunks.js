// src/features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../config/axios";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials) => {
    console.log(credentials);

    const res = await axios.post("/auth/login", credentials); // adjust URL
    console.log(res, "res in thunk");

    return res.data;
  }
);
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  const res = await axios.get("/auth/logout"); // adjust URL
  return res.data;
});

// Async thunk to fetch field officers
export const fetchFieldOfficers = createAsyncThunk(
  "fieldOfficers/fetchFieldOfficers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/auth/users");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const addEmployee = createAsyncThunk("employee/add", async (data) => {
  const res = await axios.post(`/auth/add-user`, data);
  return res.data;
});

export const updateEmployee = createAsyncThunk(
  "employee/update",
  async ({ id, data }) => {
    const res = await axios.put(`/auth/${id}`, data);
    return res.data;
  }
);

export const deleteEmployee = createAsyncThunk(
  "employee/delete",
  async (id) => {
    await axios.delete(`/auth/${id}`);
    return id; // for filter
  }
);
