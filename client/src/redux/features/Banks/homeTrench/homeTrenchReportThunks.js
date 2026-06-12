import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

export const createHomeTrenchReport = createAsyncThunk(
  "homeTrenchReport/create",
  async (reportData, { rejectWithValue, getState }) => {
    try {
      const savedCity = getState().assignedCases?.savedCity || "";
      const payload = { ...(reportData || {}), city: savedCity };
      const response = await axios.post("/home-trench-reports", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
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
      return rejectWithValue(error.response.data.error);
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
      return rejectWithValue(error.response.data.error);
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
      return rejectWithValue(error.response.data.error);
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
