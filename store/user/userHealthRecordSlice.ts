import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import patientService from "../../services/patientService";
import userService from "../../services/userService";
import { RequestStatus } from "../../utils/request";
import { RootState } from "../../utils/store";
import {
  addDefaultExtraReducers,
  setStateRequestStatus,
} from "../commonStoreHelpers";

export interface UserHealthRecord {
  userHealthRecordId: number;
  name: string;
  remark: string;
  userId: number;
  healthRecordType: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  userHealthRecordFiles: {
    createdAt: Date;
    filePath: string;
    fileType: 0 | 1;
    name: string;
    userHealthRecordFileId: number;
    userHealthRecordId: number;
  }[];
}

export interface UserHealthRecordState {
  status: RequestStatus;
  userHealthRecordList: {
    pagination: number | null;
    userHealthRecords: UserHealthRecord[];
  } | null;
  userHealthRecordDetails: UserHealthRecord | null;
}

const initialState: UserHealthRecordState = {
  status: RequestStatus.idle,
  userHealthRecordList: { pagination: null, userHealthRecords: [] },
  userHealthRecordDetails: null,
};

export const getUserHealthRecords = createAsyncThunk(
  "getUserHealthRecords",
  async (data: { userId: number; duration: number }) => {
    const response = await patientService.getPatientHealthRecords(
      data.userId,
      data.duration
    );
    return response.data;
  }
);

export const addUserHealthRecord = createAsyncThunk(
  "addUserHealthRecord",
  async (data: UserHealthRecord) => {
    const response = await patientService.createPatientHealthRecord(data);
    return response.data;
  }
);

export const deleteUserHealthRecord = createAsyncThunk(
  "deleteUserHealthRecord",
  async (healthRecordId: number) => {
    const response = await patientService.deleteHealthRecord(healthRecordId);
    return response.data;
  }
);

export const userHealthRecordSlice = createSlice({
  name: "userHealthRecord",
  initialState,
  reducers: {
    clearData: (state) => {
      state.userHealthRecordDetails = null;
      state.userHealthRecordList = { pagination: null, userHealthRecords: [] };
      state.status = RequestStatus.idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getUserHealthRecords.pending,
        setStateRequestStatus(RequestStatus.loading)
      )
      .addCase(getUserHealthRecords.fulfilled, (state, action) => {
        state.status = RequestStatus.idle;
        state.userHealthRecordList = action.payload;
      })
      .addCase(
        getUserHealthRecords.rejected,
        setStateRequestStatus(RequestStatus.failed)
      );

    addDefaultExtraReducers(builder, [
      addUserHealthRecord,
      deleteUserHealthRecord,
    ]);
  },
});

export const { clearData } = userHealthRecordSlice.actions;

export const userHealthRecordSelector = (state: RootState) =>
  state.userHealthRecord;

export default userHealthRecordSlice.reducer;
