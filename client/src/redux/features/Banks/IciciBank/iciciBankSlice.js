import { createSlice } from "@reduxjs/toolkit";
import {
  createIciciBank,
  getAllIciciBanks,
  getIciciBankById,
  updateIciciBank,
} from "./iciciBankThunk";

const initialState = {
  data: [],
  singleData: null,
  loading: false,
  error: null,
};

const iciciBankSlice = createSlice({
  name: "iciciBank",
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
      .addCase(createIciciBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIciciBank.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createIciciBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllIciciBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllIciciBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllIciciBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getIciciBankById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIciciBankById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleData = action.payload;
      })
      .addCase(getIciciBankById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Updated By ID
      .addCase(updateIciciBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIciciBank.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateIciciBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearIciciBankData } = iciciBankSlice.actions;
export default iciciBankSlice.reducer;
