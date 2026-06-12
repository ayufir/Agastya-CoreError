import { createSlice } from "@reduxjs/toolkit";
import {
    createManappuramReport,
    fetchAllManappuram,
    fetchManappuramById,
    updateManappuramDetails,
} from "./Manappuramthunk.js";

const slice = createSlice({
    name: "manappuram",
    initialState: {
        allReports: [],
        singleReport: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createManappuramReport.pending, (s) => {
                s.loading = true;
            })
            .addCase(createManappuramReport.fulfilled, (s, a) => {
                s.loading = false;
                if (a.payload) s.allReports.unshift(a.payload);
            })
            .addCase(createManappuramReport.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload;
            })

            // GET ALL
            .addCase(fetchAllManappuram.pending, (s) => {
                s.loading = true;
            })
            .addCase(fetchAllManappuram.fulfilled, (s, a) => {
                s.loading = false;
                s.allReports = a.payload || [];
            })
            .addCase(fetchAllManappuram.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload;
            })

            // GET BY ID
            .addCase(fetchManappuramById.pending, (s) => {
                s.loading = true;
            })
            .addCase(fetchManappuramById.fulfilled, (s, a) => {
                s.loading = false;
                s.singleReport = a.payload;
            })
            .addCase(fetchManappuramById.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload;
            })

            // UPDATE
            .addCase(updateManappuramDetails.pending, (s) => {
                s.loading = true;
            })
            .addCase(updateManappuramDetails.fulfilled, (s, a) => {
                s.loading = false;
                s.singleReport = a.payload;
            })
            .addCase(updateManappuramDetails.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload;
            });
    },
});

export default slice.reducer;