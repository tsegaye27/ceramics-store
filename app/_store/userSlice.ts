import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../_types/types";

interface UserState {
  user: IUser | {};
}

const initialState: UserState = {
  user: {},
};

const userSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = {};
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
