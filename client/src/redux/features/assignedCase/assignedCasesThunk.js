import axios from "../../../config/axios";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAssignedCases = createAsyncThunk(
  "cases/fetchAssigned",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get("/case/assigned", { params });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch assigned cases"
      );
    }
  }
);

export const fetchPendingCases = createAsyncThunk(
  "cases/fetchPending",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/case/pending", { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch pending cases"
      );
    }
  }
);

export const fetchTotalSubmitCase = createAsyncThunk(
  "cases/FinalSubmittedCase",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/case/total-submit-data", { params });

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch pending cases"
      );
    }
  }
);

export const getCancelledCases = createAsyncThunk(
  "cases/getCancelledCases",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/case/cancelled", { params });

      // console.log(response, "Data");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch cancelled cases"
      );
    }
  }
);

export const getOutOfTatCases = createAsyncThunk(
  "cases/getOutOfTatCases",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/case/out-of-tat", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch Out of TAT cases"
      );
    }
  }
);

export const fetchSummaryData = createAsyncThunk(
  "summary/fetchSummaryData",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/case/summary-data", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching summary data:", error);
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);
