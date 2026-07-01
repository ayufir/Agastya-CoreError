import axios from "../../../config/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "/case"; // backend route

// Get all cases by role
export const fetchCases = createAsyncThunk(
  "case/fetchCases",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get single case by ID
export const fetchCaseById = createAsyncThunk(
  "case/fetchCaseById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Assign a case to Field Officer
export const assignCase = createAsyncThunk(
  "case/assignCase",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/assign`, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// Accept a case to Field Officer
export const acceptCaseById = createAsyncThunk(
  "case/acceptCase",
  async ({ id, bankName }, { rejectWithValue }) => {
    console.log(id, bankName, "RES");
    try {
      const { data } = await axios.put(`${API_URL}/accept/${id}`, { bankName });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Decline/Deny a case for Field Officer
export const declineCaseById = createAsyncThunk(
  "case/declineCase",
  async ({ id, bankName, declineReason }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/decline/${id}`, { bankName, declineReason });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update case status
export const updateCaseStatus = createAsyncThunk(
  "case/updateCaseStatus",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/status`, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllAssignedCases = createAsyncThunk(
  "case/getAllAssignedCases",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/status`, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deletedCases = createAsyncThunk(
  "case/deletedCases",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${API_URL}/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// !final update

// Accept a case to Field Officer
export const finalUpdate = createAsyncThunk(
  "case/finalUpdate",
  async ({ id, bankName, updateData }, { rejectWithValue }) => {
    // console.log(id, bankName, updateData, "RES");
    try {
      const { data } = await axios.put(`${API_URL}/final-update/${id}`, {
        bankName,
        updateData,
      });

      console.log(data, "FINAL THUNKS");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
