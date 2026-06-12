import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../config/axios";

export const fetchUserCases = createAsyncThunk(
  "assign/fetchUserCases",
  async () => {
    const res = await axios.get("/assign/my-cases");
    return res.data;
  }
);

export const assignCase = createAsyncThunk("assign/assign", async (payload) => {
  const res = await axios.post("/assign/assign", payload);
  console.log(res, "LLL");
  return res.data.data;
});

export const raiseCaseQuery = createAsyncThunk(
  "assign/raiseQuery",
  async ({ caseId, message }) => {
    const res = await axios.post(`/assign/query/${caseId}`, { message });
    return res.data;
  }
);
