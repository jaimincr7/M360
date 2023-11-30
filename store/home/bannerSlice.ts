import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import HomeService from "../../services/homeService";
import { RootState } from "../../utils/store";

export interface BannersState {
  value: number;
  status: "idle" | "loading" | "failed";
  data: {
    status: String;
    banners: any;
  };
}

const initialState: BannersState = {
  value: 0,
  status: "idle",
  data: {
    status: "idle",
    banners: [],
  },
};

export const getAllBannersAction = createAsyncThunk(
  "getAllBannersAction",
  async () => {
    const response = await HomeService.getAllBanners();
    return response.data;
  }
);

export const banners = createSlice({
  name: "banners",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data.banners = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBannersAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllBannersAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.banners = action.payload.banners;
      })
      .addCase(getAllBannersAction.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearData } = banners.actions;

export const bannerSelector = (state: RootState) => state.banners;

export default banners.reducer;
