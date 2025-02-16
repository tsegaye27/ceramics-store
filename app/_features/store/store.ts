import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/app/_features/users/slice";
import ceramicsReducer from "@/app/_features/ceramics/slice";
import ordersReducer from "@/app/_features/orders/slice";
import authReducer from "@/app/_features/auth/slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    ceramics: ceramicsReducer,
    orders: ordersReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
