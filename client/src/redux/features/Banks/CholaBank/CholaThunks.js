import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";
// chola
export const createDetails = createAsyncThunk(
  "chola/create",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post(`/chola/create`, formData);
      // console.log(res.data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const fetchAllDetails = createAsyncThunk(
  "chola/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`/chola/display`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const getDetailsById = createAsyncThunk(
  "chola/getById",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`/chola/display/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const updateDetails = createAsyncThunk(
  "chola/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await axios.put(`/chola/update/${id}`, formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const deleteDetails = createAsyncThunk(
  "chola/delete",
  async (id, thunkAPI) => {
    try {
      const res = await axios.delete(`/chola/delete/${id}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

export const searchDetails = createAsyncThunk(
  "chola/search",
  async (queryParams, thunkAPI) => {
    try {
      const res = await axios.get(`/chola/search/search`, {
        params: queryParams,
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);
