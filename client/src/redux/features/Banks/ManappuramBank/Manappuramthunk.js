import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    createManappuram,
    getAllManappuram,
    getManappuramById,
    updateManappuram,
} from "../../../../api-services/Manappuramapi/Manappuramapi.js";

// CREATE
export const createManappuramReport = createAsyncThunk(
    "manappuram/create",
    async (data, { rejectWithValue, getState }) => {
        try {
            const savedCity = getState().assignedCases?.savedCity || "";
            const payload = { ...(data || {}), city: savedCity };
            const res = await createManappuram(payload);
            return res?.data ?? res;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// GET ALL
export const fetchAllManappuram = createAsyncThunk(
    "manappuram/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getAllManappuram();
            return res?.data ?? res ?? [];
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// GET BY ID
export const fetchManappuramById = createAsyncThunk(
    "manappuram/getById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await getManappuramById(id);
            return res?.data ?? res;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// UPDATE
export const updateManappuramDetails = createAsyncThunk(
    "manappuram/update",
    async ({ id, ...data }, thunkAPI) => {
        try {
            const res = await updateManappuram(id, data);
            return res?.updated ?? res?.data ?? res;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);
