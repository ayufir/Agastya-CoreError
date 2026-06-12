import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

const API_URL = "/fedral";

// CREATE
export const createFedralBank = createAsyncThunk(
  "FedralBank/create",
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
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// GET ALL
export const getAllFedralBank = createAsyncThunk(
  "FedralBank/getAll",
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
export const getFedralBankById = createAsyncThunk(
  "FedralBank/getById",
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
  "FedralBank/updateDetails",
  
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
  "FedralBank/deleteDetails",
  

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
