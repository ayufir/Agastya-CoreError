import { createSlice } from "@reduxjs/toolkit";
import {
  createBankReport,
  getBankReportById,
  updateBankReport,
  getAllBankReports,
} from "./profectusThunks";

const bankReportSlice = createSlice({
  name: "bankReport",
  initialState: {
    data: null,
    allReports: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBankReport: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createBankReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBankReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createBankReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getBankReportById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBankReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getBankReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateBankReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBankReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateBankReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get all
      .addCase(getAllBankReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBankReports.fulfilled, (state, action) => {
        state.loading = false;
        state.allReports = action.payload;
      })
      .addCase(getAllBankReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBankReport } = bankReportSlice.actions;
export default bankReportSlice.reducer;
