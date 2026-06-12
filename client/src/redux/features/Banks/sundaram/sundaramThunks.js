import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

const API_URL = "/sundaram";

// Create new report
export const createExtendedValuation = createAsyncThunk(
  "extendedValuation/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, formData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// Fetch all reports
export const fetchAllExtendedValuations = createAsyncThunk(
  "extendedValuation/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// Fetch report by ID
export const fetchExtendedValuationById = createAsyncThunk(
  "extendedValuation/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);
