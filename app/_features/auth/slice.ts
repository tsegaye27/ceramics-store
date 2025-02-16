import axiosInstance from "@/app/_lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type AuthState = {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  loading: boolean;
  error: string | null;
  token: string;
};
const initialState: AuthState = {
  user: {
    id: "",
    email: "",
    name: "",
    role: "",
    createdAt: "",
    updatedAt: "",
  },
  loading: false,
  error: null,
  token: "",
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (userData: { name: string; email: string; password: string }) => {
    const response = await axiosInstance.post("/auth/signup", userData);
    return response.data;
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData: { email: string; password: string }) => {
    const response = await axiosInstance.post("/auth/login", userData);
    return response.data;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = initialState.user;
      state.token = initialState.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Signup failed. Please try again.";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
