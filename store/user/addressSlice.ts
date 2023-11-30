import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../../services/userService";
import { RequestStatus } from "../../utils/request";
import { RootState } from "../../utils/store";
import {
  addDefaultExtraReducers,
  setStateRequestStatus,
} from "../commonStoreHelpers";

export interface UserAddress {
  userAddressId: number;
  userId: number;
  fullName: string;
  countryId: number;
  phoneCode: number;
  mobileNumber: string;
  email: string;
  address: string;
  ward: string;
  district: string;
  state?: string;
  city?: string;
  country?: string;
  stateId: number;
  cityId: number;
  isDefaultAddress: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface UserAddressState {
  status: RequestStatus;
  userAddressList: UserAddress[] | null;
  userAddressDetails: UserAddress | null;
}

const initialState: UserAddressState = {
  status: RequestStatus.idle,
  userAddressList: [],
  userAddressDetails: null,
};

export const getUserAddresses = createAsyncThunk(
  "getUserAddresses",
  async (userId: number) => {
    const response = await userService.getUserAddresses(userId);
    return response.data;
  }
);

export const addUserAddress = createAsyncThunk(
  "addUserAddress",
  async (data: UserAddress) => {
    const response = await userService.addUserAddress(data);
    return response.data;
  }
);

export const updateUserAddress = createAsyncThunk(
  "updateUserAddress",
  async (data: UserAddress) => {
    const response = await userService.updateUserAddress(data);
    return response.data;
  }
);

export const deleteUserAddress = createAsyncThunk(
  "deleteUserAddress",
  async (addressId: number) => {
    const response = await userService.deleteUserAddress(addressId);
    return response.data;
  }
);

export const userAddressSlice = createSlice({
  name: "userAddress",
  initialState,
  reducers: {
    clearData: (state) => {
      state.userAddressDetails = null;
      state.userAddressList = [];
      state.status = RequestStatus.idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getUserAddresses.pending,
        setStateRequestStatus(RequestStatus.loading)
      )
      .addCase(getUserAddresses.fulfilled, (state, action) => {
        state.status = RequestStatus.idle;
        state.userAddressList = action.payload?.userAddresses || [];
      })
      .addCase(
        getUserAddresses.rejected,
        setStateRequestStatus(RequestStatus.failed)
      );

    addDefaultExtraReducers(builder, [
      addUserAddress,
      deleteUserAddress,
      updateUserAddress,
    ]);
  },
});

export const { clearData } = userAddressSlice.actions;

export const userAddressSelector = (state: RootState) => state.userAddress;

export default userAddressSlice.reducer;
