import { createSlice } from "@reduxjs/toolkit";
import {
  createValuation,
  getAllValuations,
  getValuationById,
  updateValuation,
  deleteValuation,
} from "./HeroFinCorpThunks";

const initialState = {
  valuations: [],
  selectedValuation: null,
  loading: false,
  error: null,
};

const HeroFinCorpSlice = createSlice({
  name: "valuation",
  initialState,
  reducers: {
    clearSelectedValuation: (state) => {
      state.selectedValuation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createValuation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createValuation.fulfilled, (state, action) => {
        state.loading = false;
        state.valuations.push(action.payload);
      })
      .addCase(createValuation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(getAllValuations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllValuations.fulfilled, (state, action) => {
        state.loading = false;
        state.valuations = action.payload;
      })
      .addCase(getAllValuations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get By ID
      .addCase(getValuationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getValuationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedValuation = action.payload;
      })
      .addCase(getValuationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateValuation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateValuation.fulfilled, (state, action) => {
        state.loading = false;
        state.valuations = state.valuations.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateValuation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteValuation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteValuation.fulfilled, (state, action) => {
        state.loading = false;
        state.valuations = state.valuations.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteValuation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedValuation } = HeroFinCorpSlice.actions;
export default HeroFinCorpSlice.reducer;
