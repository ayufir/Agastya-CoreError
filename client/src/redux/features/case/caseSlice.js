import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCases,
  fetchCaseById,
  assignCase,
  updateCaseStatus,
  finalUpdate,
} from "./caseThunks";

const initialState = {
  cases: [],
  currentCase: null,
  finalUpdate: [],
  loading: false,
  error: null,
  success: false,
  message: "",
};

const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {
    clearCaseState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCases
      .addCase(fetchCases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.loading = false;
        state.cases = action.payload;
        state.error = null;
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchCaseById
      .addCase(fetchCaseById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCase = action.payload;
      })
      .addCase(fetchCaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // assignCase
      .addCase(assignCase.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignCase.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(assignCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateCaseStatus
      .addCase(updateCaseStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCaseStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateCaseStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //final update
      .addCase(finalUpdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(finalUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.finalUpdate = action.payload;
      })
      .addCase(finalUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCaseState } = caseSlice.actions;
export default caseSlice.reducer;
