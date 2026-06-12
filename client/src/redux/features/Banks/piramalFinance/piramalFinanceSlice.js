import { createSlice } from "@reduxjs/toolkit";
import {
  createPiramalFinanceRecord,
  fetchPiramalFinanceRecordById,
  fetchPiramalFinanceRecords,
  updatePiramalFinanceRecord,
  deletePiramalFinanceRecord,
} from "./piramalFinanceThunks";

const piramalFinanceSlice = createSlice({
  name: "piramalFinance",
  initialState: {
    records: [],
    selectedRecord: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedRecord: (state) => {
      state.selectedRecord = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Record
    builder
      .addCase(createPiramalFinanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPiramalFinanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload.data);
      })
      .addCase(createPiramalFinanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to create record";
      });

    // Fetch All Records
    builder
      .addCase(fetchPiramalFinanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPiramalFinanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
      })
      .addCase(fetchPiramalFinanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch records";
      });

    // Fetch Record by ID
    builder
      .addCase(fetchPiramalFinanceRecordById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPiramalFinanceRecordById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRecord = action.payload.data;
      })
      .addCase(fetchPiramalFinanceRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch record";
      });

    // Update Record
    builder
      .addCase(updatePiramalFinanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePiramalFinanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRecord = action.payload.data;
        state.records = state.records.map((record) =>
          record._id === updatedRecord._id ? updatedRecord : record
        );
        if (state.selectedRecord?._id === updatedRecord._id) {
          state.selectedRecord = updatedRecord;
        }
      })
      .addCase(updatePiramalFinanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to update record";
      });

    // Delete Record
    builder
      .addCase(deletePiramalFinanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePiramalFinanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter(
          (record) => record._id !== action.payload.id
        );
        if (state.selectedRecord?._id === action.payload.id) {
          state.selectedRecord = null;
        }
      })
      .addCase(deletePiramalFinanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to delete record";
      });
  },
});

// Export actions
export const { clearSelectedRecord, clearError } = piramalFinanceSlice.actions;

// Export reducer
export default piramalFinanceSlice.reducer;
