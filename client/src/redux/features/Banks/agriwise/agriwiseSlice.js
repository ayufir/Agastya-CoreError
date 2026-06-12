import { createSlice } from "@reduxjs/toolkit";
import {
  createValuation,
  fetchValuations,
  fetchValuationById,
} from "./agriwiseThunks";

const agriwiseSlice = createSlice({
  name: "propertyValuation",
  initialState: {
    valuations: [],
    selectedValuation: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearSelectedValuation: (state) => {
      state.selectedValuation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Valuation
      .addCase(createValuation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createValuation.fulfilled, (state, action) => {
        state.loading = false;
        state.valuations.push(action.payload);
        state.successMessage = "Valuation created successfully";
      })
      .addCase(createValuation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Valuations
      .addCase(fetchValuations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchValuations.fulfilled, (state, action) => {
        state.loading = false;
        state.valuations = action.payload;
      })
      .addCase(fetchValuations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch By ID
      .addCase(fetchValuationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchValuationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedValuation = action.payload;
      })
      .addCase(fetchValuationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, clearSelectedValuation } = agriwiseSlice.actions;
export default agriwiseSlice.reducer;
