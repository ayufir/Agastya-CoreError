import { createSlice } from "@reduxjs/toolkit";
import {
  createSamstaflnBank,
  getAllSamstaflnBank,
  getSamstaflnBankById,
} from "./SamstaflnBankThunk";

const initialState = {
  data: [],
  singleData: null,
  loading: false,
  error: null,
};

const SamstaflnBankSlice = createSlice({
  name: "SamstaflnBank",
  initialState,
  reducers: {
    clearIciciBankData: (state) => {
      state.data = [];
      state.singleData = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createSamstaflnBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSamstaflnBank.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createSamstaflnBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllSamstaflnBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSamstaflnBank.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllSamstaflnBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getSamstaflnBankById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSamstaflnBankById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleData = action.payload;
      })
      .addCase(getSamstaflnBankById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearIciciHFCBankData } = SamstaflnBankSlice.actions;
export default SamstaflnBankSlice.reducer;
