import { createSlice } from "@reduxjs/toolkit";
import {
  createDetails,
  getAllManapuramDetails,
  getDetailsById,
  updateDetails,
  deleteDetails,
  searchDetails,
} from "./ManappuramThunks";

const cholaSlice = createSlice({
  name: "manappuram",
  initialState: {
    loading: false,
    error: null,
    details: [],
    singleDetail: null,
    message: "",
  },
  reducers: {
    clearMessage(state) {
      state.message = "";
    },
    clearSingleDetail(state) {
      state.singleDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details.push(action.payload);
        state.message = "Details created successfully";
      })
      .addCase(createDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllManapuramDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllManapuramDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(getAllManapuramDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDetailsById.fulfilled, (state, action) => {
        state.singleDetail = action.payload;
      })

      .addCase(updateDetails.fulfilled, (state, action) => {
        state.details = state.details.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
        state.message = "Details updated successfully";
      })

      .addCase(deleteDetails.fulfilled, (state, action) => {
        state.details = state.details.filter(
          (item) => item._id !== action.payload._id
        );
        state.message = "Details deleted successfully";
      })

      .addCase(searchDetails.fulfilled, (state, action) => {
        state.details = action.payload;
      });
  },
});

export const { clearMessage, clearSingleDetail } = cholaSlice.actions;
export default cholaSlice.reducer;
