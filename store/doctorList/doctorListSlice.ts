import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFilterDoctors } from "../../commonModules/commonInterfaces";
import { PageSizeConstant } from "../../components/pagination";
import doctorService from "../../services/doctorService";
import { RootState } from "../../utils/store";
export interface ICreateDoctor {
  namePrefix: string;
  fullName: string;
  userName: string;
  email: string;
  photoPath: string;
  countryId: number;
  phoneCode: number;
  mobileNumber: string;
  birthDate: string | Date;
  gender: string;
  passwordHash?: string;
  licenseNumber: string;
  biography: string;
  languages: {
    doctorId: number;
    languageId: number;
  }[];
  address: string;
  ward: string;
  district: string;
  cityId: number;
  stateId: number;
  files: {
    doctorId: number;
    name: string;
    filePath: string;
    doctorFileType: number;
  }[];
}

export interface DoctorsListState {
  value: number;
  status: "idle" | "loading" | "failed";
  data: {
    status: String;
    doctorsList: any;
    pagination: any;
    lastFilters: any;
  };
}

const initialState: DoctorsListState = {
  value: 0,
  status: "idle",
  data: {
    status: "idle",
    doctorsList: [],
    pagination: {},
    lastFilters: {},
  },
};

export let lastFiltersForDrList: IFilterDoctors = {
  cityId: 0,
  pageNumber: 1,
  pageSize: PageSizeConstant,
  gender: [],
  orderBy: "DESC",
  doctorId: 0,
  hospitals: [],
  languages: [],
  specialities: [],
  symptoms: [],
  serviceTypes: [],
  experiences: [],
};

export const getAllDoctorsListAction = createAsyncThunk(
  "getAllDoctorsListAction",
  async (data: IFilterDoctors) => {
    lastFiltersForDrList = data;
    const response = await doctorService.getAllDoctorsList(data);
    return response.data;
  }
);

export const createDoctor = createAsyncThunk(
  "createDoctor",
  async (data: ICreateDoctor) => {
    const response = await doctorService.createDoctor(data);
    return response;
  }
);

export const doctorsList = createSlice({
  name: "doctorsList",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data.doctorsList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllDoctorsListAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllDoctorsListAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.doctorsList = action.payload.doctors;
        state.data.pagination = action.payload.pagination;
      })
      .addCase(getAllDoctorsListAction.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearData } = doctorsList.actions;

export const doctorListSelector = (state: RootState) => state.doctorsList;

export default doctorsList.reducer;
