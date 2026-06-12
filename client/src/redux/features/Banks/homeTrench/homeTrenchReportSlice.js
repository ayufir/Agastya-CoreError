import { createSlice } from "@reduxjs/toolkit";
import {
  createHomeTrenchReport,
  getAllHomeTrenchReports,
  getHomeTrenchReportById,
  updateHomeTrenchReport,
  deleteHomeTrenchReport,
} from "./homeTrenchReportThunks";

const initialState = {
  reports: [],
  report: null,
  loading: false,
  error: null,
};

const homeTrenchReportSlice = createSlice({
  name: "homeTrenchReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Home Trench Report
      .addCase(createHomeTrenchReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHomeTrenchReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload);
      })
      .addCase(createHomeTrenchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Home Trench Reports
      .addCase(getAllHomeTrenchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHomeTrenchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(getAllHomeTrenchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Home Trench Report by ID
      .addCase(getHomeTrenchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHomeTrenchReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(getHomeTrenchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Home Trench Report
      .addCase(updateHomeTrenchReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHomeTrenchReport.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex(
          (report) => report._id === action.payload._id
        );
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      .addCase(updateHomeTrenchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Home Trench Report
      .addCase(deleteHomeTrenchReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHomeTrenchReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = state.reports.filter(
          (report) => report._id !== action.payload
        );
      })
      .addCase(deleteHomeTrenchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default homeTrenchReportSlice.reducer;
