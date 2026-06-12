// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../../../config/axios";

// export const fetchNotes = createAsyncThunk(
//   "notes/fetchNotes",
//   async (caseId) => {
//     const res = await axios.get(`/notes/${caseId}`);
//     return res.data;
//   }
// );

// export const addNote = createAsyncThunk(
//   "notes/addNote",
//   async ({ caseId, message }) => {
//     const res = await axios.post("/notes", { caseId, message });
//     return res.data;
//   }
// );

// export const allCaseUserById = createAsyncThunk(
//   "notes/fetchAllNotes",
//   async () => {
//     const res = await axios.get("/notes/all");
//     return res.data;
//   }
// );

// const notesSlice = createSlice({
//   name: "notes",
//   initialState: { notes: [], allCase: [], loading: false },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchNotes.fulfilled, (state, action) => {
//         state.notes = Array.isArray(action.payload) ? action.payload : [];
//       })
//       .addCase(allCaseUserById.fulfilled, (state, action) => {
//         state.allCase = Array.isArray(action.payload) ? action.payload : [];
//       })
//       .addCase(addNote.fulfilled, (state, action) => {
//         if (!Array.isArray(state.notes)) {
//           state.notes = [];
//         }
//         state.notes.push(action.payload);
//       });
//   },
// });

// export default notesSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../config/axios";

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (caseId) => {
    const res = await axios.get(`/notes/${caseId}`);
    return res.data;
  }
);

export const addNote = createAsyncThunk(
  "notes/addNote",
  async ({ caseId, message }, thunkAPI) => {
    const res = await axios.post("/notes", { caseId, message });

    // After successful addNote, fetch latest notes
    await thunkAPI.dispatch(fetchNotes(caseId));

    return res.data; // returning newly added note is optional
  }
);

export const allCaseUserById = createAsyncThunk(
  "notes/fetchAllNotes",
  async () => {
    const res = await axios.get("/notes/all");
    return res.data;
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState: { notes: [], allCase: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(allCaseUserById.fulfilled, (state, action) => {
        state.allCase = Array.isArray(action.payload) ? action.payload : [];
      })

      .addCase(addNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNote.fulfilled, (state) => {
        state.loading = false;
        // notes updated by fetchNotes dispatch after addNote success
      })
      .addCase(addNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default notesSlice.reducer;
