import { createSlice } from "@reduxjs/toolkit";
import {
  createProtiumBank,
  getAllProtiumBanks,
  getProtiumBankById,
} from "./ProtiumBankThunk";

const initialState = {
  data: [],
  singleData: null,
  loading: false,
  error: null,
};

const ProtiumBankSlice = createSlice({
  name: "ProtiumBank",
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
      .addCase(createProtiumBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProtiumBank.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createProtiumBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllProtiumBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProtiumBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllProtiumBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getProtiumBankById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProtiumBankById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleData = action.payload;
      })
      .addCase(getProtiumBankById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProtiumBankData } = ProtiumBankSlice.actions;
export default ProtiumBankSlice.reducer;
