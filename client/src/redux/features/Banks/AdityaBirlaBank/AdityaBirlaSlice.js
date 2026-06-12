import { createSlice } from "@reduxjs/toolkit";
import {
  createAditya,
  fetchAllAditya,
  fetchAdityaById,
  updateAdityaDetails,
} from "./AdityaBirlaThunk";

const slice = createSlice({
  name: "aditya",
  initialState: {
    allReports: [],
    singleReport: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAditya.pending, (s) => {
        s.loading = true;
      })
      .addCase(createAditya.fulfilled, (s, a) => {
        s.loading = false;
        s.allReports.push(a.payload);
      })
      .addCase(fetchAllAditya.fulfilled, (s, a) => {
        s.allReports = a.payload;
      })
      .addCase(fetchAdityaById.fulfilled, (s, a) => {
        s.singleReport = a.payload;
      })
      .addCase(updateAdityaDetails.fulfilled, (s, a) => {
        s.singleReport = a.payload;
      });
  },
});

export default slice.reducer;