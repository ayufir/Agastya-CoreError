import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

export const createValuationReport = createAsyncThunk(
  "valuationReport/create",
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/bajaj", reportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getAllValuationReports = createAsyncThunk(
  "valuationReport/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/bajaj");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getValuationReportById = createAsyncThunk(
  "valuationReport/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/bajaj/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateValuationReport = createAsyncThunk(
  "valuationReport/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    // console.log(finalData, "pay");

    try {
      const response = await axios.put(`/bajaj/${id}`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteValuationReport = createAsyncThunk(
  "valuationReport/delete",
  async (id, { rejectWithValue }) => {
    const selectedZone = getState().assignedCases.savedCity;
    try {
      let dataToSend = reportData;
      if (reportData instanceof FormData) {
        reportData.set("city", selectedZone || "");
        dataToSend = reportData;
      } else {
        dataToSend = { ...reportData, city: selectedZone || "" };
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);
