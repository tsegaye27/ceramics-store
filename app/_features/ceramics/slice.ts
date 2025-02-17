import axiosInstance from "@/app/_lib/axios";
import { ICeramic } from "@/app/_types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/_features/store/store";

type CeramicsState = {
  ceramics: ICeramic[];
  loading: boolean;
  error: string | null;
};

const initialState: CeramicsState = {
  ceramics: [],
  loading: false,
  error: null,
};

export const fetchCeramics = createAsyncThunk(
  "ceramics/fetchCeramics",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const response = await axiosInstance.get("/ceramics/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
);

export const searchCeramics = createAsyncThunk(
  "ceramics/searchCeramics",
  async (query: string, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const response = await axiosInstance.get("/ceramics/search", {
      params: { search: query },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
);

const ceramicsSlice = createSlice({
  name: "ceramics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCeramics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCeramics.fulfilled, (state, action) => {
        state.loading = false;
        state.ceramics = action.payload.data;
      })
      .addCase(fetchCeramics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch ceramics";
      })

      .addCase(searchCeramics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCeramics.fulfilled, (state, action) => {
        state.loading = false;
        state.ceramics = action.payload.data;
      })
      .addCase(searchCeramics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search ceramics";
      });
  },
});

export default ceramicsSlice.reducer;
