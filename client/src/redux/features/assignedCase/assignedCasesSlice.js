import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAssignedCases,
  fetchPendingCases,
  fetchTotalSubmitCase,
  getCancelledCases,
  getOutOfTatCases,
  fetchSummaryData,
} from "./assignedCasesThunk";

const defaultPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

const defaultFilterOptions = {
  banks: [],
  statuses: [],
};

const assignedCasesSlice = createSlice({
  name: "assignedCases",
  initialState: {
    data: [],
    pendingCases: [],
    cancelledCases: [],
    final: [],
    outOfTatCases: [],
    summary: {},
    assignedPagination: defaultPagination,
    pendingPagination: defaultPagination,
    finalPagination: defaultPagination,
    cancelledPagination: defaultPagination,
    outOfTatPagination: defaultPagination,
    assignedFilterOptions: defaultFilterOptions,
    pendingFilterOptions: defaultFilterOptions,
    finalFilterOptions: defaultFilterOptions,
    cancelledFilterOptions: defaultFilterOptions,
    outOfTatFilterOptions: defaultFilterOptions,
    selectedZone: "", // Used by dashboard filters
    savedCity: "", // City selected in MenuItems for saving reports
    loading: false,
    error: null,
  },
  reducers: {
    setZone: (state, action) => {
      state.selectedZone = action.payload;
    },
    setSavedCity: (state, action) => {
      state.savedCity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch summary data
      .addCase(fetchSummaryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSummaryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch assigned cases
   
      // fetch pending cases
      .addCase(fetchAssignedCases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssignedCases.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.items || [];
        state.assignedPagination =
          action.payload?.pagination || defaultPagination;
        state.assignedFilterOptions =
          action.payload?.filterOptions || defaultFilterOptions;
      })
      .addCase(fetchAssignedCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchPendingCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingCases.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingCases = action.payload?.items || [];
        state.pendingPagination =
          action.payload?.pagination || defaultPagination;
        state.pendingFilterOptions =
          action.payload?.filterOptions || defaultFilterOptions;
      })
      .addCase(fetchPendingCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // fetch total submit
      .addCase(fetchTotalSubmitCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalSubmitCase.fulfilled, (state, action) => {
        state.loading = false;
        state.final = action.payload?.items || [];
        state.finalPagination = action.payload?.pagination || defaultPagination;
        state.finalFilterOptions =
          action.payload?.filterOptions || defaultFilterOptions;
      })
      .addCase(fetchTotalSubmitCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      //! get cancel cases
      .addCase(getCancelledCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCancelledCases.fulfilled, (state, action) => {
        state.loading = false;
        state.cancelledCases = action.payload?.items || [];
        state.cancelledPagination =
          action.payload?.pagination || defaultPagination;
        state.cancelledFilterOptions =
          action.payload?.filterOptions || defaultFilterOptions;
      })
      .addCase(getCancelledCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Out of TAT
      .addCase(getOutOfTatCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOutOfTatCases.fulfilled, (state, action) => {
        state.loading = false;
        state.outOfTatCases = action.payload?.items || [];
        state.outOfTatPagination =
          action.payload?.pagination || defaultPagination;
        state.outOfTatFilterOptions =
          action.payload?.filterOptions || defaultFilterOptions;
      })
      .addCase(getOutOfTatCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setZone, setSavedCity } = assignedCasesSlice.actions;
export default assignedCasesSlice.reducer;
