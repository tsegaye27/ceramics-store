import axiosInstance from "@/app/_lib/axios";
import { ICeramic } from "@/app/_types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/_features/store/store";
import axios from "axios";

type CeramicsState = {
  ceramics: ICeramic[];
  loading: boolean;
  error: string | null;
};

const initialState: CeramicsState = {
  ceramics: [],
  loading: false,
  error: null,
};

export const fetchCeramics = createAsyncThunk(
  "ceramics/fetchCeramics",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const response = await axiosInstance.get("/ceramics/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
);

export const ceramicDetails = createAsyncThunk(
  "ceramics/ceramicDetails",
  async (ceramicId: string, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const response = await axiosInstance.get(
      `/ceramics/getById?ceramicId=${ceramicId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },
);

export const searchCeramics = createAsyncThunk(
  "ceramics/searchCeramics",
  async (query: string, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const response = await axiosInstance.get("/ceramics/search", {
      params: { search: query },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
);

export const uploadImage = createAsyncThunk(
  "ceramics/uploadImage",
  async (file: File, { rejectWithValue }) => {
    const imageFormData = new FormData();
    imageFormData.append("file", file);
    imageFormData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string,
    );

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          process.env.NEXT_PUBLIC_CLOUDINARY_NAME as string
        }/image/upload`,
        imageFormData,
        {
          // onUploadProgress: (progressEvent) => {
          /* }, */
        },
      );
      return response.data.secure_url;
    } catch (err) {
      // console.error("Upload Error:", err);
      // }
      return rejectWithValue("Image upload failed");
    }
  },
);

export const addCeramic = createAsyncThunk(
  "ceramics/addCeramic",
  async (ceramicData: ICeramic, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    try {
      const response = await axiosInstance.post(
        "/ceramics/addNew",
        ceramicData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const updateCeramic = createAsyncThunk(
  "ceramics/updateCeramic",
  async (
    ceramicData: {
      ceramicId: string;
      packetsAdded: number;
      piecesAdded: number;
    },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const response = await axiosInstance.patch(
        `/ceramics/addById?ceramicId=${ceramicData.ceramicId}`,
        {
          packetsAdded: ceramicData.packetsAdded,
          piecesAdded: ceramicData.piecesAdded,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update ceramic",
      );
    }
  },
);

export const sellCeramic = createAsyncThunk(
  "ceramics/sellCeramic",
  async (
    ceramicData: {
      ceramicId: string;
      packetsSold: number;
      piecesSold: number;
      seller: string;
      pricePerArea: number;
    },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const response = await axiosInstance.patch(
        `/ceramics/sell?ceramicId=${ceramicData.ceramicId}`,
        {
          packetsSold: ceramicData.packetsSold,
          piecesSold: ceramicData.piecesSold,
          pricePerArea: ceramicData.pricePerArea,
          seller: ceramicData.seller,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to sell ceramic",
      );
    }
  },
);

const ceramicsSlice = createSlice({
  name: "ceramics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCeramics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCeramics.fulfilled, (state, action) => {
        state.loading = false;
        state.ceramics = action.payload.data;
      })
      .addCase(fetchCeramics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch ceramics";
      })

      .addCase(searchCeramics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCeramics.fulfilled, (state, action) => {
        state.loading = false;
        state.ceramics = action.payload.data;
      })
      .addCase(searchCeramics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to search ceramics";
      })
      .addCase(addCeramic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCeramic.fulfilled, (state, action) => {
        state.loading = false;
        state.ceramics.push(action.payload.data);
      })
      .addCase(addCeramic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add ceramic";
      })
      .addCase(updateCeramic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCeramic.fulfilled, (state, action) => {
        state.loading = false;
        state.ceramics = state.ceramics.map((ceramic) =>
          ceramic._id === action.payload.data.id
            ? action.payload.data
            : ceramic,
        );
      })
      .addCase(updateCeramic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update ceramic";
      })
      .addCase(sellCeramic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellCeramic.fulfilled, (state, action) => {
        state.loading = false;
        state.ceramics = state.ceramics.map((ceramic) =>
          ceramic._id === action.payload.data.id
            ? action.payload.data
            : ceramic,
        );
      })
      .addCase(sellCeramic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to sell ceramic";
      })
      .addCase(uploadImage.pending, (state) => {
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to upload image";
      });
  },
});

export default ceramicsSlice.reducer;
