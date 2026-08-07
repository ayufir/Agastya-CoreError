import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

export const createHomeTrenchReport = createAsyncThunk(
  "homeTrenchReport/create",
  async (reportData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const savedCity = state.assignedCases?.savedCity || "";
      const authCity = state.auth?.user?.assignedCity || "";
      const payload = {
        ...(reportData || {}),
        city: reportData?.city || savedCity || authCity || "",
      };
      const response = await axios.post("/home-trench-reports", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create Trench report"
      );
    }
  }
);

export const getAllHomeTrenchReports = createAsyncThunk(
  "homeTrenchReport/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/home-trench-reports");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message
      );
    }
  }
);

export const getHomeTrenchReportById = createAsyncThunk(
  "homeTrenchReport/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/home-trench-reports/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message
      );
    }
  }
);

export const updateHomeTrenchReport = createAsyncThunk(
  "homeTrenchReport/update",
  async ({ id, fullData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/home-trench-reports/${id}`, fullData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update Trench report"
      );
    }
  }
);

export const deleteHomeTrenchReport = createAsyncThunk(
  "homeTrenchReport/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/home-trench-reports/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);
