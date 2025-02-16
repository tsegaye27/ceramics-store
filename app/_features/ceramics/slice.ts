import axiosInstance from "@/app/_lib/axios";
import { ICeramic } from "@/app/_types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
  async () => {
    const response = await axiosInstance.get("/ceramics");
    return response.data;
  },
);

const ceramicsSlice = createSlice({
  name: "ceramics",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCeramics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCeramics.fulfilled, (state, action) => {
        state.loading = false;
        state.ceramics = action.payload.data;
      })
      .addCase(fetchCeramics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch ceramics";
      });
  },
});

export default ceramicsSlice.reducer;
