import { createSlice } from "@reduxjs/toolkit";
import {
  fetchFieldOfficers,
  loginThunk,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  logoutThunk,
} from "./authThunks";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    FO: [],
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    SetUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
      })

      .addCase(fetchFieldOfficers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFieldOfficers.fulfilled, (state, action) => {
        state.loading = false;
        state.FO = action.payload;
      })
      .addCase(fetchFieldOfficers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addEmployee.fulfilled, (state, action) => {
        state.FO.push(action.payload);
      })

      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.FO = state.FO.map((emp) =>
          emp._id === action.payload._id ? action.payload : emp
        );
      })

      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.FO = state.FO.filter((emp) => emp._id !== action.payload);
      });
  },
});

export const { logout, SetUser } = authSlice.actions;
export default authSlice.reducer;
