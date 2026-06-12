import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

const BASE_URL = "/agriwise"; // Base URL for Agriwise valuation API

// Create Valuation
export const createValuation = createAsyncThunk(
  "propertyValuation/createValuation",
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
      const response = await axios.post(BASE_URL, dataToSend);

      return response.data.savedValuation;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message || "Failed to create valuation"
      );
    }
  }
);

// Fetch All Valuations
export const fetchValuations = createAsyncThunk(
  "propertyValuation/fetchValuations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      // console.log(response, "DATA");
      return response.data.valuations;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message || "Failed to fetch valuations"
      );
    }
  }
);

// Fetch Valuation By ID
export const fetchValuationById = createAsyncThunk(
  "propertyValuation/fetchValuationById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data.savedValuation;
    } catch (err) {
      return rejectWithValue(
        err.response.data.message || "Failed to fetch valuation by ID"
      );
    }
  }
);
