import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/app/_features/users/slice";
import ceramicsReducer from "@/app/_features/ceramics/slice";
import ordersReducer from "@/app/_features/orders/slice";
import authReducer from "@/app/_features/auth/slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import analyticsReducer from "@/app/_features/analytics/slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    ceramics: ceramicsReducer,
    orders: ordersReducer,
    auth: authReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
