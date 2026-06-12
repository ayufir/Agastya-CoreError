import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createHFBank,
  AllHFBank,
  GetHFBankById,
  UpdateHFBankById,
} from "../../../../api-services/HFBank/HFBankApi";
import { ShowLoading, HideLoading } from "../../alerts/alertSlice";

// Create new HF Bank
export const createHFBanks = createAsyncThunk(
  "hfbanks/createHFBank",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createHFBank(data);
      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all HF Banks
export const fetchAllHFBanks = createAsyncThunk(
  "hfbanks/fetchAllHFBanks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AllHFBank();
      return response?.data ?? response ?? [];
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get HF Bank by ID
export const fetchHFBankById = createAsyncThunk(
  "hfbanks/fetchHFBankById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GetHFBankById(id);
      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDetails = createAsyncThunk(
  "hfBanks/update",
  async ({ id, ...finalData }, thunkAPI) => {
    try {
      const res = await UpdateHFBankById(id, finalData);
      return res?.updatedJob ?? res?.data ?? res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);
