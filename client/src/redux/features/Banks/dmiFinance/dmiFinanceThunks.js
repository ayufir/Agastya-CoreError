import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

export const createDmiFinanceReport = createAsyncThunk(
  "dmiFinanceReport/create",
  async (reportData, { rejectWithValue, getState }) => {
    try {
      const selectedZone = getState().assignedCases.savedCity;
      let dataToSend = reportData;
      if (reportData instanceof FormData) {
        reportData.set("city", selectedZone || "");
        dataToSend = reportData;
      } else {
        dataToSend = { ...reportData, city: selectedZone || "" };
      }
      const response = await axios.post("/dmi-finance-reports", dataToSend);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getAllDmiFinanceReports = createAsyncThunk(
  "dmiFinanceReport/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/dmi-finance-reports");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getDmiFinanceReportById = createAsyncThunk(
  "dmiFinanceReport/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/dmi-finance-reports/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateDmiFinanceReport = createAsyncThunk(
  "dmiFinanceReport/update",
  async ({ id, reportData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/dmi-finance-reports/${id}`,
        reportData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteDmiFinanceReport = createAsyncThunk(
  "dmiFinanceReport/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/dmi-finance-reports/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);
