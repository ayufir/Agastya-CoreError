import { createSlice } from "@reduxjs/toolkit";
import {
  createExtendedValuation,
  fetchAllExtendedValuations,
  fetchExtendedValuationById,
} from "./sundaramThunks";

const sundaramSlice = createSlice({
  name: "extendedValuation",
  initialState: {
    allReports: [],
    currentReport: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createExtendedValuation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExtendedValuation.fulfilled, (state, action) => {
        state.loading = false;
        state.allReports.push(action.payload);
      })
      .addCase(createExtendedValuation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All
      .addCase(fetchAllExtendedValuations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExtendedValuations.fulfilled, (state, action) => {
        state.loading = false;
        state.allReports = action.payload;
      })
      .addCase(fetchAllExtendedValuations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchExtendedValuationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExtendedValuationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchExtendedValuationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentReport } = sundaramSlice.actions;
export default sundaramSlice.reducer;
