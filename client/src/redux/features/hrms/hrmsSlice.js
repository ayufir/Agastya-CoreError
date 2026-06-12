import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/hrms`
  : "http://localhost:5000/api/hrms";

// Setup Axios headers helper
const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token || localStorage.getItem("hrmsToken")}`
  }
});

// Authentication
export const loginHrms = createAsyncThunk("hrms/login", async (credentials, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/login`, credentials);
    if (res.data.success) {
      localStorage.setItem("hrmsToken", res.data.token);
      localStorage.setItem("hrmsUser", JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

// Stats & Charts
export const fetchStats = createAsyncThunk("hrms/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/dashboard`, getAuthConfig());
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch stats");
  }
});

// Employees
export const fetchEmployees = createAsyncThunk("hrms/fetchEmployees", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/employees`, getAuthConfig());
    return res.data.employees;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch employees");
  }
});

export const createEmployee = createAsyncThunk("hrms/createEmployee", async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.post(`${API_URL}/employees`, data, getAuthConfig());
    dispatch(fetchEmployees());
    return res.data.employee;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add employee");
  }
});

export const updateEmployee = createAsyncThunk("hrms/updateEmployee", async ({ id, data }, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.put(`${API_URL}/employees/${id}`, data, getAuthConfig());
    dispatch(fetchEmployees());
    return res.data.employee;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to edit employee");
  }
});

export const deleteEmployee = createAsyncThunk("hrms/deleteEmployee", async (id, { rejectWithValue, dispatch }) => {
  try {
    await axios.delete(`${API_URL}/employees/${id}`, getAuthConfig());
    dispatch(fetchEmployees());
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete employee");
  }
});

// Attendance
export const fetchAttendance = createAsyncThunk("hrms/fetchAttendance", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/attendance`, getAuthConfig());
    return res.data.attendance;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch attendance");
  }
});

export const checkInCheckOut = createAsyncThunk("hrms/checkInCheckOut", async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.post(`${API_URL}/attendance/checkin-checkout`, data, getAuthConfig());
    dispatch(fetchAttendance());
    return res.data.attendance;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Check-in/out failed");
  }
});

export const approveCorrection = createAsyncThunk("hrms/approveCorrection", async ({ id, status }, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.put(`${API_URL}/attendance/corrections/${id}`, { status }, getAuthConfig());
    dispatch(fetchAttendance());
    return res.data.attendance;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update correction");
  }
});

// Leaves
export const fetchLeaves = createAsyncThunk("hrms/fetchLeaves", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/leaves`, getAuthConfig());
    return res.data.leaves;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch leaves");
  }
});

export const applyLeave = createAsyncThunk("hrms/applyLeave", async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.post(`${API_URL}/leaves`, data, getAuthConfig());
    dispatch(fetchLeaves());
    return res.data.leave;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to apply leave");
  }
});

export const approveLeave = createAsyncThunk("hrms/approveLeave", async ({ id, status }, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.put(`${API_URL}/leaves/${id}`, { status }, getAuthConfig());
    dispatch(fetchLeaves());
    return res.data.leave;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update leave");
  }
});

// Payroll
export const fetchPayroll = createAsyncThunk("hrms/fetchPayroll", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/payroll`, getAuthConfig());
    return res.data.payrolls;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch payroll");
  }
});

export const processPayroll = createAsyncThunk("hrms/processPayroll", async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.post(`${API_URL}/payroll/process`, data, getAuthConfig());
    dispatch(fetchPayroll());
    return res.data.payrolls;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to process payroll");
  }
});

// Recruitment
export const fetchJobs = createAsyncThunk("hrms/fetchJobs", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/jobs`, getAuthConfig());
    return res.data.jobs;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch jobs");
  }
});

export const createJob = createAsyncThunk("hrms/createJob", async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.post(`${API_URL}/jobs`, data, getAuthConfig());
    dispatch(fetchJobs());
    return res.data.job;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create job");
  }
});

export const updateCandidate = createAsyncThunk("hrms/updateCandidate", async ({ jobId, candidateId, status, feedback }, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.put(`${API_URL}/jobs/${jobId}/candidates/${candidateId}`, { status, feedback }, getAuthConfig());
    dispatch(fetchJobs());
    return res.data.job;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update candidate status");
  }
});

// Performance
export const fetchPerformance = createAsyncThunk("hrms/fetchPerformance", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/performance`, getAuthConfig());
    return res.data.performance;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch performance scores");
  }
});

export const createReview = createAsyncThunk("hrms/createReview", async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.post(`${API_URL}/performance/review`, data, getAuthConfig());
    dispatch(fetchPerformance());
    return res.data.performance;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to save review");
  }
});

// Compliance
export const fetchCompliance = createAsyncThunk("hrms/fetchCompliance", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/compliance`, getAuthConfig());
    return res.data.compliance;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch compliance logs");
  }
});

export const assignTraining = createAsyncThunk("hrms/assignTraining", async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.post(`${API_URL}/compliance/assign`, data, getAuthConfig());
    dispatch(fetchCompliance());
    return res.data.course;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to assign compliance course");
  }
});

export const completeCompliance = createAsyncThunk("hrms/completeCompliance", async ({ id, score, status }, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.put(`${API_URL}/compliance/${id}`, { score, status }, getAuthConfig());
    dispatch(fetchCompliance());
    return res.data.course;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to complete compliance training");
  }
});

// Assets
export const fetchAssets = createAsyncThunk("hrms/fetchAssets", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/assets`, getAuthConfig());
    return res.data.assets;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch assets");
  }
});

export const allocateAsset = createAsyncThunk("hrms/allocateAsset", async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.post(`${API_URL}/assets/allocate`, data, getAuthConfig());
    dispatch(fetchAssets());
    return res.data.asset;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to allocate asset");
  }
});

// Expenses
export const fetchExpenses = createAsyncThunk("hrms/fetchExpenses", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/expenses`, getAuthConfig());
    return res.data.expenses;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch expenses");
  }
});

export const approveExpense = createAsyncThunk("hrms/approveExpense", async ({ id, status }, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.put(`${API_URL}/expenses/${id}`, { status }, getAuthConfig());
    dispatch(fetchExpenses());
    return res.data.expense;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update expense status");
  }
});

export const createExpense = createAsyncThunk("hrms/createExpense", async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.post(`${API_URL}/expenses`, data, getAuthConfig());
    dispatch(fetchExpenses());
    return res.data.expense;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to submit expense claim");
  }
});

// Tickets
export const fetchTickets = createAsyncThunk("hrms/fetchTickets", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/tickets`, getAuthConfig());
    return res.data.tickets;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch tickets");
  }
});

export const replyTicket = createAsyncThunk("hrms/replyTicket", async ({ id, message }, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.put(`${API_URL}/tickets/${id}/reply`, { message }, getAuthConfig());
    dispatch(fetchTickets());
    return res.data.ticket;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to reply to ticket");
  }
});

export const createTicket = createAsyncThunk("hrms/createTicket", async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await axios.post(`${API_URL}/tickets`, data, getAuthConfig());
    dispatch(fetchTickets());
    return res.data.ticket;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create support ticket");
  }
});

// Branches
export const fetchBranches = createAsyncThunk("hrms/fetchBranches", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/branches`, getAuthConfig());
    return res.data.branches;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch branches");
  }
});

// Audit Logs
export const fetchAuditLogs = createAsyncThunk("hrms/fetchAuditLogs", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/audit-logs`, getAuthConfig());
    return res.data.logs;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch audit logs");
  }
});

// Slice definition
const hrmsSlice = createSlice({
  name: "hrms",
  initialState: {
    user: localStorage.getItem("hrmsUser") ? JSON.parse(localStorage.getItem("hrmsUser")) : null,
    token: localStorage.getItem("hrmsToken") || null,
    stats: null,
    charts: null,
    employees: [],
    branches: [],
    attendance: [],
    leaves: [],
    payroll: [],
    jobs: [],
    performance: [],
    compliance: [],
    assets: [],
    expenses: [],
    tickets: [],
    auditLogs: [],
    loading: false,
    error: null
  },
  reducers: {
    logoutHrms: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("hrmsToken");
      localStorage.removeItem("hrmsUser");
    },
    clearHrmsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginHrms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginHrms.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginHrms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Dashboard Stats
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.charts = action.payload.charts;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Employees
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
      })
      // Attendance
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.attendance = action.payload;
      })
      // Leaves
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.leaves = action.payload;
      })
      // Payroll
      .addCase(fetchPayroll.fulfilled, (state, action) => {
        state.payroll = action.payload;
      })
      // Recruitment Jobs
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      // Performance Reviews
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.performance = action.payload;
      })
      // Compliance Logs
      .addCase(fetchCompliance.fulfilled, (state, action) => {
        state.compliance = action.payload;
      })
      // Assets
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.assets = action.payload;
      })
      // Expenses
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expenses = action.payload;
      })
      // Tickets
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
      })
      // Branches
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.branches = action.payload;
      })
      // Audit Logs
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLogs = action.payload;
      });
  }
});

export const { logoutHrms, clearHrmsError } = hrmsSlice.actions;
export default hrmsSlice.reducer;
