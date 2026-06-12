import { createSlice } from "@reduxjs/toolkit";
import {
  createIciciHFCBank,
  getAllIciciHFCBanks,
  getIciciHFCBankById,
} from "./IciciHFCBankThunk";

const initialState = {
  data: [],
  singleData: null,
  loading: false,
  error: null,
};

const iciciHFCBankSlice = createSlice({
  name: "iciciHFCBank",
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
      .addCase(createIciciHFCBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIciciHFCBank.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createIciciHFCBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllIciciHFCBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllIciciHFCBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllIciciHFCBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getIciciHFCBankById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIciciHFCBankById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleData = action.payload;
      })
      .addCase(getIciciHFCBankById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearIciciHFCBankData } = iciciHFCBankSlice.actions;
export default iciciHFCBankSlice.reducer;
