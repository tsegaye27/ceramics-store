import axiosInstance from "@/app/_lib/axios";
import { IOrder } from "@/app/_types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type OrderState = {
  orders: IOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const response = await axiosInstance.get("/orders");
  return response.data;
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      });
  },
});

export default ordersSlice.reducer;
