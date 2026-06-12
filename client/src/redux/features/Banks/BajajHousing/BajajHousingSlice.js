// redux/features/Banks/BajajHousing/BajajHousingSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
    createBajajHousing,
    fetchAllBajajHousing,
    fetchBajajHousingById,
    updateBajajHousingDetails,
} from "./BajajHousingThunk";

const slice = createSlice({
    name: "bajajHousing",
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
            .addCase(createBajajHousing.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(createBajajHousing.fulfilled, (s, a) => {
                s.loading = false;
                s.allReports.unshift(a.payload);
            })
            .addCase(createBajajHousing.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

            // GET ALL
            .addCase(fetchAllBajajHousing.pending, (s) => { s.loading = true; })
            .addCase(fetchAllBajajHousing.fulfilled, (s, a) => {
                s.loading = false;
                s.allReports = a.payload;
            })
            .addCase(fetchAllBajajHousing.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

            // GET BY ID
            .addCase(fetchBajajHousingById.pending, (s) => { s.loading = true; })
            .addCase(fetchBajajHousingById.fulfilled, (s, a) => {
                s.loading = false;
                s.singleReport = a.payload;
            })
            .addCase(fetchBajajHousingById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

            // UPDATE
            .addCase(updateBajajHousingDetails.pending, (s) => { s.loading = true; })
            .addCase(updateBajajHousingDetails.fulfilled, (s, a) => {
                s.loading = false;
                s.singleReport = a.payload;
                const idx = s.allReports.findIndex((r) => r._id === a.payload?._id);
                if (idx !== -1) s.allReports[idx] = a.payload;
            })
            .addCase(updateBajajHousingDetails.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    },
});

export default slice.reducer;