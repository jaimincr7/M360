import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IResetPassword } from "../../commonModules/commonInterfaces";
import userService from "../../services/userService";
import { RequestStatus } from "../../utils/request";
import { RootState } from "../../utils/store";

export interface UserDetails {
  userId: number;
  fullName: string;
  email: string;
  countryId: number;
  countryCode?: number;
  phoneCode: number;
  mobileNumber: string;
  birthDate?: string;
  gender?: string;
  uniqueId?: string;
  zaloNumber?: string;
  facebookId?: string;
  googleId?: string;
}

export interface IChangeMobNo {
  userId: string;
  mobileNumber?: string;
  email?: string;
  otp: string;
}

export interface IHealthRecordFileType {
  name: string;
  filePath: string;
  fileType: number;
}

export interface ICreateUserHealthRecord {
  name: string;
  remark: string;
  userId: number;
  healthRecordType: number;
  files: IHealthRecordFileType[];
}
export interface UserState {
  status: RequestStatus;
  userDetails: UserDetails | null;
}

const initialState: UserState = {
  status: RequestStatus.idle,
  userDetails: null,
};

export const getUserDetails = createAsyncThunk(
  "getUserDetails",
  async (data?: any) => {
    const { userId } = data;
    const response = await userService.getUserDetails(userId);
    return response.data;
  }
);

export const updateUserDetails = createAsyncThunk(
  "updateUserDetails",
  async (data: UserDetails) => {
    const response = await userService.updateUserDetails(data);
    return response.data;
  }
);

export const changeMobileNumber = createAsyncThunk(
  "changeMobileNumber",
  async (data: IChangeMobNo) => {
    const response = await userService.changeMobileNumber(data);
    return response;
  }
);

export const changeEmail = createAsyncThunk(
  "changeEmail",
  async (data: IChangeMobNo) => {
    const response = await userService.changeEmail(data);
    return response;
  }
);

export const resetPassword = createAsyncThunk(
  "IResetPassword",
  async (data: IResetPassword) => {
    const response = await userService.resetPassword(data);
    return response;
  }
);

export const createUserHealthRecord = createAsyncThunk(
  "createUserHealthRecord",
  async (data: ICreateUserHealthRecord) => {
    const response = await userService.createUserHealthRecord(data);
    return response;
  }
);

export const deleteUserHealthRecordFile = createAsyncThunk(
  "deleteUserHealthRecordFile",
  async (id: number) => {
    const response = await userService.deleteUserHealthRecordFile(id);
    return response;
  }
);

export const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    clearData: (state) => {
      state.userDetails = null;
      state.status = RequestStatus.idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.status = RequestStatus.loading;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.status = RequestStatus.idle;
        state.userDetails = action.payload;
      })
      .addCase(getUserDetails.rejected, (state) => {
        state.status = RequestStatus.failed;
      });

    // For update user detailed
    builder
      .addCase(updateUserDetails.pending, (state) => {
        state.status = RequestStatus.loading;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.status = RequestStatus.idle;
        state.userDetails = action.payload;
      })
      .addCase(updateUserDetails.rejected, (state) => {
        state.status = RequestStatus.failed;
      });
  },
});

export const { clearData } = userDetailsSlice.actions;

export const userDetailDetailsSelector = (state: RootState) =>
  state.userDetails;

export default userDetailsSlice.reducer;
