import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import specialitiesListService from "../../services/specialtyService";
import { RootState } from "../../utils/store";

export interface SpecialitiesListState {
  value: number;
  status: "idle" | "loading" | "failed";
  data: {
    status: String;
    specialitiesList: any;
  };
}

const initialState: SpecialitiesListState = {
  value: 0,
  status: "idle",
  data: {
    status: "idle",
    specialitiesList: [],
  },
};

export const getAllSpecialitiesListAction = createAsyncThunk(
  "getAllSpecialitiesListAction",
  async () => {
    const response = await specialitiesListService.getAllSpecialitiesList();
    return response.data;
  }
);

export const specialitiesList = createSlice({
  name: "specialitiesList",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data.specialitiesList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSpecialitiesListAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllSpecialitiesListAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.specialitiesList = action.payload.specialities;
      })
      .addCase(getAllSpecialitiesListAction.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearData } = specialitiesList.actions;

export const specialitiesListSelector = (state: RootState) =>
  state.specialitiesList;

export default specialitiesList.reducer;
