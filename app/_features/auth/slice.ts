import axiosInstance from "@/app/_lib/axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  loading: boolean;
  error: string | null;
  token: string | null;
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
  async (
    userData: { name: string; email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.post("/auth/signup", userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    userData: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
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
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Signup failed. Please try again.";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed. Please try again.";
      });
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
