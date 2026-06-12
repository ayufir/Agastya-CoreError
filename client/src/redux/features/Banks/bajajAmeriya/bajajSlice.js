// src/redux/bajaj/bajajSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createReport,
  fetchAllReports,
  fetchReportById,
  updateReport,
  deleteReport,
} from "./bajajThunks";

const initialState = {
  reports: [],
  selectedReport: null,
  loading: false,
  error: null,
};

const bajajSlice = createSlice({
  name: "bajaj",
  initialState,
  reducers: {
    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReport = action.payload;
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload.data);
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateReport.fulfilled, (state, action) => {
        state.reports = state.reports.map((report) =>
          report._id === action.payload.data._id ? action.payload.data : report
        );
      })

      // Delete
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter((r) => r._id !== action.payload);
      });
  },
});

export const { clearSelectedReport } = bajajSlice.actions;
export default bajajSlice.reducer;
