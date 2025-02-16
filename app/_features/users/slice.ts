import axiosInstance from "@/app/_lib/axios";
import { IUser } from "@/app/_types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type UserState = {
  user: IUser;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
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
};

export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (userId: string) => {
    const response = await axiosInstance.get(`/users/getUser`);
    return response.data;
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      });
  },
});

export default userSlice.reducer;
