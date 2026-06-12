import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

export const createDetails = createAsyncThunk(
  "idfc/create",
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
      const response = await axios.post(`/idfc/create`, dataToSend);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const getAllIdfcDetails = createAsyncThunk(
  "idfc/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`/idfc/display`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const getDetailsById = createAsyncThunk(
  "idfc/getById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`/idfc/display/${id}`);
      console.log(response.data, "thunx");
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const updateDetails = createAsyncThunk(
  "idfc/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await axios.put(`/idfc/update/${id}`, formData);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const deleteDetails = createAsyncThunk(
  "idfc/delete",
  async (id, thunkAPI) => {
    try {
      const res = await axios.delete(`/idfc/delete/${id}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const searchDetails = createAsyncThunk(
  "idfc/search",
  async (queryParams, thunkAPI) => {
    try {
      const res = await axios.get(`/idfc/search/search`, {
        params: queryParams,
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);
