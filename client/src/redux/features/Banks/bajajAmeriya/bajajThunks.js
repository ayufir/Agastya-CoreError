// src/redux/property/propertyThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

const BASE_URL = "/bajajA";

// 📌 Create
export const createReport = createAsyncThunk(
  "property/createReport",
  async (data, { rejectWithValue, getState }) => {
    try {
      const selectedZone = getState().assignedCases.savedCity;
      let dataToSend = data;
      if (data instanceof FormData) {
        data.set("city", selectedZone || "");
        dataToSend = data;
      } else {
        dataToSend = { ...data, city: selectedZone || "" };
      }
      const response = await axios.post(BASE_URL, dataToSend);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 📌 Get all
export const fetchAllReports = createAsyncThunk(
  "property/fetchAllReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 📌 Get by ID
export const fetchReportById = createAsyncThunk(
  "property/fetchReportById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 📌 Update
export const updateReport = createAsyncThunk(
  "property/updateReport",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 📌 Delete
export const deleteReport = createAsyncThunk(
  "property/deleteReport",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
