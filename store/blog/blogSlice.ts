import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import blogService from "../../services/blogService";
import { RootState } from "../../utils/store";

export interface BlogState {
  value: number;
  status: "idle" | "loading" | "failed";
  data: {
    status: String;
    blogCat: any;
  };
  blogDetails: {
    status: String;
    blogDetails: any;
  };
  blogs: {
    status: String;
    blogs: any;
  };
}

const initialState: BlogState = {
  value: 0,
  status: "idle",
  data: {
    status: "idle",
    blogCat: [],
  },
  blogDetails: {
    status: "idle",
    blogDetails: [],
  },
  blogs: {
    status: "idle",
    blogs: [],
  },
};

export const getAllBlogCategories = createAsyncThunk(
  "getAllBlogCategories",
  async () => {
    const response = await blogService.getAllBlogCategories();
    return response.data;
  }
);

export const getBlogDetailsById = createAsyncThunk(
  "getBlogDetailsById",
  async (id: number) => {
    const response = await blogService.getBlogById(id);
    return response.data;
  }
);

export const getAllBlogs = createAsyncThunk(
  "getAllBlogs",
  async (data?: any) => {
    const { categoryId, search, pageNumber, pageSize } = data;
    const response = await blogService.getAllBlogs(
      categoryId,
      search,
      pageNumber,
      pageSize
    );
    return response.data;
  }
);

export const blog = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data.blogCat = [];
    },
  },

  extraReducers: (builder) => {
    //Get all Blog Cat.
    builder
      .addCase(getAllBlogCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllBlogCategories.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.blogCat = action.payload.blogCategories;
      })
      .addCase(getAllBlogCategories.rejected, (state) => {
        state.status = "failed";
      });

    //Get Blog by Id
    builder
      .addCase(getBlogDetailsById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBlogDetailsById.fulfilled, (state, action) => {
        state.status = "idle";
        state.blogDetails.blogDetails = action.payload;
      })
      .addCase(getBlogDetailsById.rejected, (state) => {
        state.status = "failed";
      });

    //Get All Blog
    builder
      .addCase(getAllBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.status = "idle";
        state.blogs.blogs = action.payload.blogs;
      })
      .addCase(getAllBlogs.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearData } = blog.actions;

export const blogSelector = (state: RootState) => state.blog;

export default blog.reducer;
