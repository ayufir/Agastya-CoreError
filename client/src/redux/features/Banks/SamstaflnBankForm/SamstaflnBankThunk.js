import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

const API_URL = "/samstafln";

// CREATE
export const createSamstaflnBank = createAsyncThunk(
  "SamstaflnBank/create",
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
export const getAllSamstaflnBank = createAsyncThunk(
  "SamstaflnBank/getAll",
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
export const getSamstaflnBankById = createAsyncThunk(
  "SamstaflnBank/getById",
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
  "SamstaflnBank/updateDetails",
  
  async (id, { rejectWithValue }) => {
    try{
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
    }
    catch(err){
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
);


export const deleteDetails = createAsyncThunk(
  "SamstaflnBank/deleteDetails",
  

  async (id, { rejectWithValue }) => {
    try{
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
    }
    catch(err){
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  }
);
