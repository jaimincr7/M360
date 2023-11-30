import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICreateHospital } from "../../commonModules/commonInterfaces";
import hospitalsListService from "../../services/hospitalService";
import { RootState } from "../../utils/store";

export interface HospitalsListState {
  value: number;
  status: "idle" | "loading" | "failed";
  breifdata: {
    status: String;
    hospitalsBreifList: any;
  };
  registerHospital: {
    status: String;
    message: any;
  };
  data: {
    status: String;
    hospitalsList: any;
    pagination: any;
  };
}

const initialState: HospitalsListState = {
  value: 0,
  status: "idle",
  data: {
    status: "idle",
    hospitalsList: [],
    pagination: {},
  },
  registerHospital: {
    status: "idle",
    message: [],
  },
  breifdata: {
    status: "idle",
    hospitalsBreifList: [],
  },
};

export const getAllHospitalsListAction = createAsyncThunk(
  "getAllHospitalsListAction",
  async (data?: any) => {
    const { cityId, search, pageNumber, pageSize } = data;
    const response = await hospitalsListService.getAllHospitalsList(
      cityId,
      search,
      pageNumber,
      pageSize
    );
    return response.data;
  }
);

export const registerHospital = createAsyncThunk(
  "registerHospital",
  async (data?: ICreateHospital) => {
    const response = await hospitalsListService.registerHospital(data);
    return response.data;
  }
);

export const getHospitalsBreifListAction = createAsyncThunk(
  "getHospitalsBreifListAction",
  async () => {
    const response = await hospitalsListService.getHospitalsBreifList();
    return response.data;
  }
);

export const hospitalsList = createSlice({
  name: "hospitalsList",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data.hospitalsList = [];
    },
  },
  extraReducers: (builder) => {
    // For All detailed Hospitals
    builder
      .addCase(getAllHospitalsListAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllHospitalsListAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.hospitalsList = action.payload.hospitals;
        state.data.pagination = action.payload.pagination;
      })
      .addCase(getAllHospitalsListAction.rejected, (state) => {
        state.status = "failed";
      });

    // For Register Hospitals
    builder
      .addCase(registerHospital.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerHospital.fulfilled, (state, action) => {
        state.status = "idle";
        state.registerHospital.message = action.payload.messages;
      })
      .addCase(registerHospital.rejected, (state) => {
        state.status = "failed";
      });

    // For All breif Hospitals
    builder
      .addCase(getHospitalsBreifListAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHospitalsBreifListAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.breifdata.hospitalsBreifList = action.payload.hospitals;
      })
      .addCase(getHospitalsBreifListAction.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearData } = hospitalsList.actions;

export const hospitalsListSelector = (state: RootState) => state.hospitalsList;

export default hospitalsList.reducer;
