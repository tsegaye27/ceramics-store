import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/app/_lib/axios";
import { RootState } from "@/app/_features/store/store";

type AnalyticsState = {
  mostSold: {
    today: any[];
    thisWeek: any[];
    thisMonth: any[];
  };
  totalItems: any[];
  loading: boolean;
  error: string | null;
};

const initialState: AnalyticsState = {
  mostSold: { today: [], thisWeek: [], thisMonth: [] },
  totalItems: [],
  loading: false,
  error: null,
};

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetch",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const [mostSold, totalItems] = await Promise.all([
      axiosInstance.get("/analytics/most-sold", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axiosInstance.get("/analytics/total-items", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const fixedTotalItems = totalItems.data.data.map((item: any) => ({
      ...item,
      totalArea: parseFloat(item.totalArea.toFixed(2)),
    }));

    return {
      mostSold: mostSold.data.data,
      totalItems: fixedTotalItems,
    };
  },
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.mostSold = action.payload.mostSold;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch analytics";
      });
  },
});

export default analyticsSlice.reducer;
