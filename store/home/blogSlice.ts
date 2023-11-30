import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import blogService from "../../services/blogService";
import { RootState } from "../../utils/store";

export interface blogsState {
  value: number;
  status: "idle" | "loading" | "failed";
  data: {
    status: String;
    blogs: any;
  };
}

const initialState: blogsState = {
  value: 0,
  status: "idle",
  data: {
    status: "idle",
    blogs: [],
  },
};

export const getAllBlogsAction = createAsyncThunk(
  "getAllBlogsAction",
  async () => {
    const response = await blogService.getAllBlogs();
    return response.data;
  }
);

export const blogs = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data.blogs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBlogsAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllBlogsAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.blogs = action.payload.blogs;
      })
      .addCase(getAllBlogsAction.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearData } = blogs.actions;

export const blogSelector = (state: RootState) => state.blogs;

export default blogs.reducer;
