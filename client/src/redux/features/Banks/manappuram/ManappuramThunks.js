import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

// manappuram
export const createDetails = createAsyncThunk(
  "manappuram/create",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post(`/manappuram/create`, formData);
      console.log(res.data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getAllManapuramDetails = createAsyncThunk(
  "manappuram/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`/manappuram/display`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const getDetailsById = createAsyncThunk(
  "manappuram/getById",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`/manappuram/display/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const updateDetails = createAsyncThunk(
  "manappuram/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await axios.put(`/manappuram/update/${id}`, formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const deleteDetails = createAsyncThunk(
  "manappuram/delete",
  async (id, thunkAPI) => {
    try {
      const res = await axios.delete(`/manappuram/delete/${id}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const searchDetails = createAsyncThunk(
  "manappuram/search",
  async (queryParams, thunkAPI) => {
    try {
      const res = await axios.get(`/manappuram/search/search`, {
        params: queryParams,
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);
