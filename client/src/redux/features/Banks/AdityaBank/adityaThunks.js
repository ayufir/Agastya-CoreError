import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../../config/axios";

const API_URL = "/aditya";

export const fetchDetails = createAsyncThunk(
  "/aditya/fetchDetails",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const fetchDetailsById = createAsyncThunk(
  "/aditya/fetchDetailsById",
  async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }
);

export const createDetails = createAsyncThunk(
  "/aditya/createDetails",
  async (data, { getState }) => {
    const selectedZone = getState().assignedCases.savedCity;
    let dataToSend = data;
    if (data instanceof FormData) {
      data.set("city", selectedZone || "");
      dataToSend = data;
    } else {
      dataToSend = { ...data, city: selectedZone || "" };
    }
    const response = await axios.post(API_URL, dataToSend);
    return response.data;
  }
);

export const updateDetails = createAsyncThunk(
  "/aditya/updateDetails",
  async ({ id, data }) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  }
);

export const deleteDetails = createAsyncThunk(
  "/aditya/deleteDetails",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);
