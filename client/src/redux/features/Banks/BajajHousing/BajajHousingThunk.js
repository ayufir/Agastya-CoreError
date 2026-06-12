// redux/features/Banks/BajajHousing/BajajHousingThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../config/axios";

const BASE = "/bajaj-housing";

// CREATE
export const createBajajHousing = createAsyncThunk(
    "bajajHousing/create",
    async (data, { rejectWithValue, getState }) => {
        try {
            const savedCity = getState().assignedCases?.savedCity || "";
            const payload = {
                ...(data || {}),
                locationDetails: {
                    ...(data?.locationDetails || {}),
                    city: savedCity
                }
            };
            const res = await axiosInstance.post(BASE, payload);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// GET ALL
export const fetchAllBajajHousing = createAsyncThunk(
    "bajajHousing/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(BASE);
            return res.data?.data ?? res.data ?? [];
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// GET BY ID
export const fetchBajajHousingById = createAsyncThunk(
    "bajajHousing/getById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`${BASE}/${id}`);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// UPDATE
export const updateBajajHousingDetails = createAsyncThunk(
    "bajajHousing/update",
    async ({ id, ...data }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`${BASE}/${id}`, data);
            return res.data?.updated ?? res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);