import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

const BASE_URL = "/profectus";

export const createBankReport = createAsyncThunk(
  "bankReport/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/create`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getBankReportById = createAsyncThunk(
  "bankReport/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateBankReport = createAsyncThunk(
  "bankReport/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllBankReports = createAsyncThunk(
  "bankReport/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}`);
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
