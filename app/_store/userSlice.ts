import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../_types/types";

interface UserState {
  user: IUser | {};
  isLoading: boolean;
}

const initialState: UserState = {
  user: {
    _id: "",
    email: "",
    name: "",
    role: "",
    fullName: "",
    password: "",
    createdAt: "",
    updatedAt: "",
  },
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = {};
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { login, logout, setLoading } = userSlice.actions;
export default userSlice.reducer;
