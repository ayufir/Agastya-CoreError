import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

const API_URL = "/icici-bank";

// CREATE
export const createIciciBank = createAsyncThunk(
  "iciciBank/create",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const selectedZone = getState().assignedCases.savedCity;
      let dataToSend = formData;
      if (formData instanceof FormData) {
        formData.set("city", selectedZone || "");
        dataToSend = formData;
      } else {
        dataToSend = { ...formData, city: selectedZone || "" };
      }
      const response = await axios.post(API_URL, dataToSend);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message);
    }
  }
);

// GET ALL
export const getAllIciciBanks = createAsyncThunk(
  "iciciBank/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message);
    }
  }
);

// GET BY ID
export const getIciciBankById = createAsyncThunk(
  "iciciBank/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message);
    }
  }
);

// UPDATE (Save / Save & Next)
export const updateIciciBank = createAsyncThunk(
  "iciciBank/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message);
    }
  }
);

// SUBMIT (Save Report: sets isReportSubmitted=true and status=Submitted)
export const submitIciciBank = createAsyncThunk(
  "iciciBank/submit",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/submit`, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message);
    }
  }
);