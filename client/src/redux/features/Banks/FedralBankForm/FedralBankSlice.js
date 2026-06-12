import { createSlice } from "@reduxjs/toolkit";
import {
  createFedralBank,
  getAllFedralBank,
  getFedralBankById,
} from "./FedralBankThunk";

const initialState = {
  data: [],
  singleData: null,
  loading: false,
  error: null,
};

const FedralBankSlice = createSlice({
  name: "FedralBank",
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
      .addCase(createFedralBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFedralBank.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createFedralBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllFedralBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFedralBank.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllFedralBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getFedralBankById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFedralBankById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleData = action.payload;
      })
      .addCase(getFedralBankById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearIciciHFCBankData } = FedralBankSlice.actions;
export default FedralBankSlice.reducer;
