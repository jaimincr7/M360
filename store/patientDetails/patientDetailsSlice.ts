import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAddPatient } from "../../commonModules/commonInterfaces";
import PatientService from "../../services/patientService";
import { RootState } from "../../utils/store";

export interface PatientDetails {
  patientId: number;
  fullName: string;
  email: string;
  phoneCode: number;
  mobileNumber: string;
  relationId: number;
  userId: number;
  birthDate: string;
  gender: string;
  uniqueId: string;
  zaloNumber: string;
  relation: string;
}

export interface PatientDetailsState {
  value: number;
  status: "idle" | "loading" | "failed";
  data: {
    status: String;
    patient: any;
  };
  patientAddress: {
    status: String;
    patientAddress: any;
  };
  addPatient: {
    status: String;
    addPatient: any;
  };
  updatePatient: {
    status: String;
    updatePatient: any;
  };
}

const initialState: PatientDetailsState = {
  value: 0,
  status: "idle",
  data: {
    status: "idle",
    patient: [],
  },
  patientAddress: {
    status: "idle",
    patientAddress: [],
  },
  addPatient: {
    status: "idle",
    addPatient: [],
  },
  updatePatient: {
    status: "idle",
    updatePatient: [],
  },
};

export const getPatients = createAsyncThunk(
  "getPatients",
  async (userId: number) => {
    const response = await PatientService.getPatients(userId);
    return response.data;
  }
);

export const updatePatient = createAsyncThunk(
  "updatePatient",
  async (data: IAddPatient) => {
    const response = await PatientService.updatePatient(data);
    return response.data;
  }
);

export const addPatient = createAsyncThunk(
  "addPatient",
  async (data: IAddPatient) => {
    const response = await PatientService.addPatient(data);
    return response.data;
  }
);

export const deletePatient = createAsyncThunk(
  "deletePatient",
  async (userId: number) => {
    const response = await PatientService.deletePatient(userId);
    return response.data;
  }
);

export const patientDetails = createSlice({
  name: "patientDetails",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data.patient = [];
    },
  },

  extraReducers: (builder) => {
    //Get all patientDetails Cat.
    builder
      .addCase(getPatients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.patient = action.payload.patients;
      })
      .addCase(getPatients.rejected, (state) => {
        state.status = "failed";
      });

    //Add patient .
    builder
      .addCase(addPatient.pending, (state) => {
        state.status = "loading";
        state.addPatient.status = "loading";
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.status = "idle";
        state.addPatient.status = "idle";
        state.addPatient.addPatient = action.payload;
      })
      .addCase(addPatient.rejected, (state) => {
        state.status = "failed";
        state.addPatient.status = "failed";
      });

    //Update patient .
    builder
      .addCase(updatePatient.pending, (state) => {
        state.status = "loading";
        state.updatePatient.status = "loading";
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.status = "idle";
        state.updatePatient.status = "idle";
        state.updatePatient.updatePatient = action.payload;
      })
      .addCase(updatePatient.rejected, (state) => {
        state.status = "failed";
        state.updatePatient.status = "failed";
      });
  },
});

export const { clearData } = patientDetails.actions;

export const patientDetailsSelector = (state: RootState) =>
  state.patientDetails;

export default patientDetails.reducer;
