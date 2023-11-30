import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import symptomsListService from "../../services/symptomsService";
import { RootState } from "../../utils/store";

export interface SymptomsListState {
  value: number;
  status: "idle" | "loading" | "failed";
  data: {
    status: String;
    symptomsList: any;
  };
}

const initialState: SymptomsListState = {
  value: 0,
  status: "idle",
  data: {
    status: "idle",
    symptomsList: [],
  },
};

export const getAllSymptomsListAction = createAsyncThunk(
  "getAllSymptomsListAction",
  async () => {
    const response = await symptomsListService.getAllSymptomsList();
    return response.data;
  }
);

export const symptomsList = createSlice({
  name: "symptomsList",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data.symptomsList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSymptomsListAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllSymptomsListAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.symptomsList = action.payload.symptoms;
      })
      .addCase(getAllSymptomsListAction.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearData } = symptomsList.actions;

export const symptomsListSelector = (state: RootState) => state.symptomsList;

export default symptomsList.reducer;
