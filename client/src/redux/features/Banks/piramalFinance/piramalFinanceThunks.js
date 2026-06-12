import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

// Base URL for the API
const API_URL = "/piramal-finance";

// Async thunk for creating a new record
export const createPiramalFinanceRecord = createAsyncThunk(
  "piramalFinance/createRecord",
  async (recordData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, recordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching all records
export const fetchPiramalFinanceRecords = createAsyncThunk(
  "piramalFinance/fetchRecords",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching a single record by ID
export const fetchPiramalFinanceRecordById = createAsyncThunk(
  "piramalFinance/fetchRecordById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating a record
export const updatePiramalFinanceRecord = createAsyncThunk(
  "piramalFinance/updateRecord",
  async ({ id, recordData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, recordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting a record
export const deletePiramalFinanceRecord = createAsyncThunk(
  "piramalFinance/deleteRecord",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
