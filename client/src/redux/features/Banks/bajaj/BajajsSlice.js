import { createSlice } from "@reduxjs/toolkit";
import {
  createValuationReport,
  getAllValuationReports,
  getValuationReportById,
  updateValuationReport,
  deleteValuationReport,
} from "./BajajAsyncThunks";

const initialState = {
  reports: [],
  report: null,
  loading: false,
  error: null,
};

const BajajSlice = createSlice({
  name: "valuationReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Valuation Report
      .addCase(createValuationReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createValuationReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload);
        state.report = action.payload;
      })
      .addCase(createValuationReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Valuation Reports
      .addCase(getAllValuationReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllValuationReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(getAllValuationReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Valuation Report by ID
      .addCase(getValuationReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getValuationReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(getValuationReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Valuation Report
      .addCase(updateValuationReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateValuationReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
        const index = state.reports.findIndex(
          (report) => report._id === action.payload._id
        );
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      .addCase(updateValuationReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Valuation Report
      .addCase(deleteValuationReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteValuationReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = state.reports.filter(
          (report) => report._id !== action.payload
        );
      })
      .addCase(deleteValuationReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default BajajSlice.reducer;
