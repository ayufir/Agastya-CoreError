import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

export const createDetails = createAsyncThunk(
  "piramal/create",
  async (formData, thunkAPI) => {
    try {
      const selectedZone = thunkAPI.getState().assignedCases.savedCity;
      let dataToSend = formData;
      if (formData instanceof FormData) {
        formData.set("city", selectedZone || "");
        dataToSend = formData;
      } else {
        dataToSend = { ...formData, city: selectedZone || "" };
      }
      const res = await axios.post(`/piramal/create`, dataToSend);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const getAllDetails = createAsyncThunk(
  "piramal/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`/piramal/display`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const getDetailsById = createAsyncThunk(
  "piramal/getById",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`/piramal/display/${id}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const updateDetails = createAsyncThunk(
  "piramal/update",
  async ({ id, ...payload }, thunkAPI) => {
    try {
      const res = await axios.put(`/piramal/update/${id}`, payload);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const deleteDetails = createAsyncThunk(
  "piramal/delete",
  async (id, thunkAPI) => {
    try {
      const res = await axios.delete(`/piramal/delete/${id}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const searchDetails = createAsyncThunk(
  "piramal/search",
  async (queryParams, thunkAPI) => {
    try {
      const res = await axios.get(`/piramal/search/search`, {
        params: queryParams,
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);
