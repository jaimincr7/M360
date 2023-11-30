import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appointmentService from "../../services/appointmentService";
import paymentService from "../../services/paymentService";
import { RequestStatus } from "../../utils/request";
import { RootState } from "../../utils/store";
import { setStateRequestStatus } from "../commonStoreHelpers";

export interface WalletTransaction {
  walletHistoryId: number;
  walletBalanceId: number;
  amount: number;
  transactionMessage: string;
  creditDebit: string;
  closingAmount: number;
  remark: string;
  createdAt: string;
  createdBy: number;
}
export interface IApplyWalletBalance {
  promocodeId?: number;
  userId: number;
  mobileNumber: string;
  doctorId: number;
  hospitalId: number;
  serviceTypeId: number;
  isApply: boolean;
}

export interface UserWalletState {
  status: RequestStatus;
  walletHistory: WalletTransaction[] | null;
  walletBalance: any;
  walletAllBalance: any;
}

const initialState: UserWalletState = {
  status: RequestStatus.idle,
  walletHistory: [],
  walletBalance: {},
  walletAllBalance: {},
};

export const applyWalletBalance = createAsyncThunk(
  "applyWalletBalance",
  async (data: IApplyWalletBalance) => {
    const response = await appointmentService.applyWalletBalance(data);
    return response.data;
  }
);

export const getWalletHistory = createAsyncThunk(
  "getWalletHistory",
  async (data: any) => {
    const response = await paymentService.getWalletHistory(data);
    return response.data;
  }
);

export const getAllWalletBalances = createAsyncThunk(
  "getAllWalletBalances",
  async (data: number) => {
    const response = await paymentService.getAllWalletBalances(data);
    return response.data;
  }
);

export const userWalletSlice = createSlice({
  name: "appointmentReview",
  initialState,
  reducers: {
    clearData: (state) => {
      state.walletBalance = 0;
      state.walletHistory = [];
      state.status = RequestStatus.idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        applyWalletBalance.pending,
        setStateRequestStatus(RequestStatus.loading)
      )
      .addCase(applyWalletBalance.fulfilled, (state, action) => {
        state.status = RequestStatus.idle;
        if (action.payload) {
          state.walletBalance = action.payload;
        }
      })
      .addCase(
        applyWalletBalance.rejected,
        setStateRequestStatus(RequestStatus.failed)
      );

    //For Wallet History
    builder
      .addCase(
        getWalletHistory.pending,
        setStateRequestStatus(RequestStatus.loading)
      )
      .addCase(getWalletHistory.fulfilled, (state, action) => {
        state.status = RequestStatus.idle;
        state.walletHistory = action.payload.walletHistories;
      })
      .addCase(
        getWalletHistory.rejected,
        setStateRequestStatus(RequestStatus.failed)
      );

    //For All Wallet balance
    builder
      .addCase(
        getAllWalletBalances.pending,
        setStateRequestStatus(RequestStatus.loading)
      )
      .addCase(getAllWalletBalances.fulfilled, (state, action) => {
        state.status = RequestStatus.idle;
        state.walletAllBalance = action.payload;
      })
      .addCase(
        getAllWalletBalances.rejected,
        setStateRequestStatus(RequestStatus.failed)
      );
  },
});

export const { clearData } = userWalletSlice.actions;

export const walletSelector = (state: RootState) => state.userWallet;

export default userWalletSlice.reducer;
