import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import HomeService from "../../services/homeService";
import { RootState } from "../../utils/store";

export interface TestimonialsState {
  value: number;
  status: "idle" | "loading" | "failed";
  data: {
    status: String;
    testimonials: any;
  };
}

const initialState: TestimonialsState = {
  value: 0,
  status: "idle",
  data: {
    status: "idle",
    testimonials: [],
  },
};

export const getAllTestimonialsAction = createAsyncThunk(
  "getAllTestimonialsAction",
  async () => {
    const response = await HomeService.getAllTestimonials();
    return response.data;
  }
);

export const testimonials = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data.testimonials = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTestimonialsAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTestimonialsAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.testimonials = action.payload.testimonials;
      })
      .addCase(getAllTestimonialsAction.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearData } = testimonials.actions;

export const testimonialSelector = (state: RootState) => state.testimonials;

export default testimonials.reducer;
