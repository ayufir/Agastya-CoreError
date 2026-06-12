// src/redux/thunks/formThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

const BASE_URL = "/heroFinCorp";

export const createValuation = createAsyncThunk(
  "valuation/createValuation",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}`, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllValuations = createAsyncThunk(
  "valuation/getAllValuations",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getValuationById = createAsyncThunk(
  "valuation/getValuationById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateValuation = createAsyncThunk(
  "valuation/updateValuation",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${BASE_URL}/${id}`, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteValuation = createAsyncThunk(
  "valuation/deleteValuation",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
