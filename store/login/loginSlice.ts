import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IChangePassword,
  ICreateUser,
  ILoginUser,
  ILoginUserWithOTP,
  IRequestOTP,
  IVerifyOTP,
} from "../../commonModules/commonInterfaces";
import loginService from "../../services/authService";
import { RootState } from "../../utils/store";

export interface LoginState {
  value: number;
  status: "idle" | "loading" | "failed";
  data: {
    status: String;
    loginUser: any;
  };
  loginWithOTP: {
    status: String;
    loginWithOTP: any;
  };
  requestOTP: {
    status: String;
    requestOTP: any;
  };
  createUser: {
    status: String;
    message: String;
    error: String;
    isSuccess: boolean;
    createUser: any;
  };
  verifyOtp: {
    status: string;
    data: any;
  };
  changePassword: {
    status: string;
    data: any;
  };
  showLoginModal: boolean;
  updatedUserData: any;
}

const initialState: LoginState = {
  value: 0,
  status: "idle",
  data: {
    status: "idle",
    loginUser: [],
  },
  loginWithOTP: {
    status: "idle",
    loginWithOTP: [],
  },
  requestOTP: {
    status: "idle",
    requestOTP: [],
  },
  createUser: {
    status: "idle",
    message: "",
    error: "",
    isSuccess: false,
    createUser: [],
  },
  verifyOtp: {
    status: "idle",
    data: {},
  },
  changePassword: {
    status: "idle",
    data: {},
  },
  showLoginModal: false,
  updatedUserData: {},
};

export const loginUserAction = createAsyncThunk(
  "loginUserAction",
  async (data: ILoginUser) => {
    const response = await loginService.loginUser(data);
    return response.data;
  }
);

export const requestOTPAction = createAsyncThunk(
  "requestOTPAction",
  async (data: IRequestOTP) => {
    const response = await loginService.requestOTP(data);
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  "createUser",
  async (data: ICreateUser) => {
    const response = await loginService.createUser(data);
    return response;
  }
);

export const loginUserWithOTPAction = createAsyncThunk(
  "loginUserWithOTPAction",
  async (data: ILoginUserWithOTP) => {
    const response = await loginService.loginWithOTP(data);
    return response.data;
  }
);

export const otpVerifyAction = createAsyncThunk(
  "otpVerifyAction",
  async (data: IVerifyOTP) => {
    const response = await loginService.verifyOTP(data);
    return response.data;
  }
);

export const changePasswordOtpAction = createAsyncThunk(
  "changePasswordOtpAction",
  async (data: IChangePassword) => {
    const response = await loginService.changePassword(data);
    return response.data;
  }
);

export const loginUser = createSlice({
  name: "loginUser",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data.loginUser = [];
    },
    toggleLoginModal: (state) => {
      state.showLoginModal = !state.showLoginModal;
    },
    updateLoggedInData: (state, payload) => {
      state.updatedUserData = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.loginUser = action.payload;
      })
      .addCase(loginUserAction.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(loginUserWithOTPAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUserWithOTPAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.loginWithOTP.loginWithOTP = action.payload;
      })
      .addCase(loginUserWithOTPAction.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(requestOTPAction.pending, (state) => {
        state.requestOTP.status = "loading";
      })
      .addCase(requestOTPAction.fulfilled, (state, action) => {
        state.requestOTP.status = "idle";
        state.requestOTP.requestOTP = action.payload;
      })
      .addCase(requestOTPAction.rejected, (state) => {
        state.requestOTP.status = "failed";
      });

    //Create User
    builder
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload) {
          const { data, message, isSuccess, errors } = action.payload;
          state.createUser.message = message;
          state.createUser.error = errors;
          state.createUser.isSuccess = isSuccess;
          state.createUser.createUser = data;
        }
      })
      .addCase(createUser.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(otpVerifyAction.pending, (state) => {
        state.verifyOtp.status = "loading";
      })
      .addCase(otpVerifyAction.fulfilled, (state, action) => {
        state.verifyOtp.status = "idle";
        state.verifyOtp.data = action.payload;
      })
      .addCase(otpVerifyAction.rejected, (state) => {
        state.verifyOtp.status = "failed";
      });

    builder
      .addCase(changePasswordOtpAction.pending, (state) => {
        state.changePassword.status = "loading";
      })
      .addCase(changePasswordOtpAction.fulfilled, (state, action) => {
        state.changePassword.status = "idle";
        state.changePassword.data = action.payload;
      })
      .addCase(changePasswordOtpAction.rejected, (state) => {
        state.changePassword.status = "failed";
      });
  },
});

export const { clearData, toggleLoginModal, updateLoggedInData } =
  loginUser.actions;

export const loginUserSelector = (state: RootState) => state.loginUser;

export default loginUser.reducer;
