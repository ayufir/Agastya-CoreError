import { createSlice } from "@reduxjs/toolkit";
import {
  createDmiFinanceReport,
  getAllDmiFinanceReports,
  getDmiFinanceReportById,
  updateDmiFinanceReport,
  deleteDmiFinanceReport,
} from "./dmiFinanceThunks";

const initialState = {
  reports: [],
  report: null,
  loading: false,
  error: null,
};

const dmiFinanceReportSlice = createSlice({
  name: "dmiFinanceReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create DMI Finance Report
      .addCase(createDmiFinanceReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDmiFinanceReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload);
      })
      .addCase(createDmiFinanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All DMI Finance Reports
      .addCase(getAllDmiFinanceReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDmiFinanceReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(getAllDmiFinanceReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get DMI Finance Report by ID
      .addCase(getDmiFinanceReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDmiFinanceReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(getDmiFinanceReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update DMI Finance Report
      .addCase(updateDmiFinanceReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDmiFinanceReport.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex(
          (report) => report._id === action.payload._id
        );
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
      })
      .addCase(updateDmiFinanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete DMI Finance Report
      .addCase(deleteDmiFinanceReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDmiFinanceReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = state.reports.filter(
          (report) => report._id !== action.payload
        );
      })
      .addCase(deleteDmiFinanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dmiFinanceReportSlice.reducer;
