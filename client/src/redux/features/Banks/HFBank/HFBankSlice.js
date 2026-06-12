import { createSlice } from "@reduxjs/toolkit";
import {
  createHFBanks,
  fetchAllHFBanks,
  fetchHFBankById,
  updateDetails,
} from "./HFBankThunk";

const hfbanksSlice = createSlice({
  name: "hfbanks",
  initialState: {
    allBanks: [],
    singleBank: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBankState: (state) => {
      state.singleBank = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createHFBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHFBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.allBanks.push(action.payload);
      })
      .addCase(createHFBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(fetchAllHFBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllHFBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.allBanks = action.payload;
      })
      .addCase(fetchAllHFBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(fetchHFBankById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHFBankById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleBank = action.payload;
      })
      .addCase(fetchHFBankById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDetails.fulfilled, (state, action) => {
        state.singleBank = action.payload;
      });
  },
});

export const { clearBankState } = hfbanksSlice.actions;

export default hfbanksSlice.reducer;
