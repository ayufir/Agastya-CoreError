import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

const API_URL = "/icichfc";

// CREATE
export const createIciciHFCBank = createAsyncThunk(
  "iciciHFCBank/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// GET ALL
export const getAllIciciHFCBanks = createAsyncThunk(
  "iciciHFCBank/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// GET BY ID
export const getIciciHFCBankById = createAsyncThunk(
  "iciciBankHFC/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateDetails = createAsyncThunk(
  "iciciBankHFC//updateDetails",

  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteDetails = createAsyncThunk(
  "/aditya/deleteDetails",

  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
