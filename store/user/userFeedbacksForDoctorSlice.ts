import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appointmentService from "../../services/appointmentService";
import { RequestStatus } from "../../utils/request";
import { RootState } from "../../utils/store";
import { setStateRequestStatus } from "../commonStoreHelpers";

export interface AppointmentReview {
  appointmentReviewId: number;
  appointmentId: number;
  userId: number;
  doctorId: number;
  doctorName: string;
  ratings: number;
  comment: string | null;
  isActive: boolean | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface AppointmentReviewParams {
  UserId: number;
  feedBackSortingType?: number;
}

export interface AppointmentReviewState {
  status: RequestStatus;
  reviewList: AppointmentReview[] | null;
}

const initialState: AppointmentReviewState = {
  status: RequestStatus.idle,
  reviewList: [],
};

export const getAppointmentReviewes = createAsyncThunk(
  "getAppointmentReviewes",
  async (data: AppointmentReviewParams) => {
    const response = await appointmentService.getAppointmentReviewes(data);
    return response.data;
  }
);

export const appointmentReviewSlice = createSlice({
  name: "appointmentReview",
  initialState,
  reducers: {
    clearData: (state) => {
      state.reviewList = [];
      state.status = RequestStatus.idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getAppointmentReviewes.pending,
        setStateRequestStatus(RequestStatus.loading)
      )
      .addCase(getAppointmentReviewes.fulfilled, (state, action) => {
        state.status = RequestStatus.idle;
        state.reviewList = action.payload.appointmentReviews;
      })
      .addCase(
        getAppointmentReviewes.rejected,
        setStateRequestStatus(RequestStatus.failed)
      );
  },
});

export const { clearData } = appointmentReviewSlice.actions;

export const appointmentReviewSelector = (state: RootState) =>
  state.userAppointmentReview;

export default appointmentReviewSlice.reducer;
