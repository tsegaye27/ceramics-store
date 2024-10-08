import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "",
  isLoading: false,
  error: "",
};

const userSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = "";
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { login, logout, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
