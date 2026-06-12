import { createSlice } from "@reduxjs/toolkit";
import { assignCase, fetchUserCases, raiseCaseQuery } from "./caseAssignThunks";

const caseSlice = createSlice({
  name: "case",
  initialState: {
    loading: false,
    userCases: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCases.fulfilled, (state, action) => {
        state.loading = false;
        state.userCases = action.payload;
      })
      .addCase(fetchUserCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(assignCase.fulfilled, (state, action) => {
        state.userCases.push(action.payload);
      })
      .addCase(raiseCaseQuery.fulfilled, (state, action) => {
        const index = state.userCases.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.userCases[index] = action.payload;
        }
      });
  },
});

export default caseSlice.reducer;
