import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import paymentService from "../../services/paymentService";
import userNotificationService from "../../services/userNotificationService";
import userService from "../../services/userService";
import { RequestStatus } from "../../utils/request";
import { RootState } from "../../utils/store";
import { setStateRequestStatus } from "../commonStoreHelpers";

export interface NotificationDetails {
  notificationId: number;
  userId: number;
  userType: number;
  notificationType: string;
  title: string;
  description: string;
  linkType: number;
  linkId: number;
  isViewed: boolean;
  viewedAt: string;
  createdAt: string;
}

export interface UserNotificationState {
  status: RequestStatus;
  notificationList: NotificationDetails[] | null;
  notificationDetail: NotificationDetails | null;
}

const initialState: UserNotificationState = {
  status: RequestStatus.idle,
  notificationList: [],
  notificationDetail: null,
};

export const getUserNotificationList = createAsyncThunk(
  "getUserNotification",
  async (data: any) => {
    const response = await userNotificationService.getUserNotifications(data);
    return response.data;
  }
);

export const getUserNotificationDetails = createAsyncThunk(
  "getUserNotificationDetails",
  async (notificationId: number) => {
    const response = await userNotificationService.getUserNotificationDetails(
      notificationId
    );
    return response.data;
  }
);

export const deleteUserNotification = createAsyncThunk(
  "deleteUserNotification",
  async (notificationId: number) => {
    const response =
      await userNotificationService.deleteUserNotificationDetails(
        notificationId
      );
    return response.data;
  }
);

export const userNotificationSlice = createSlice({
  name: "userNotification",
  initialState,
  reducers: {
    clearData: (state) => {
      state.notificationList = [];
      state.notificationDetail = null;
      state.status = RequestStatus.idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getUserNotificationList.pending,
        setStateRequestStatus(RequestStatus.loading)
      )
      .addCase(getUserNotificationList.fulfilled, (state, action) => {
        state.status = RequestStatus.idle;
        state.notificationList = action.payload.notifications;
      })
      .addCase(
        getUserNotificationList.rejected,
        setStateRequestStatus(RequestStatus.failed)
      );

    builder
      .addCase(
        getUserNotificationDetails.pending,
        setStateRequestStatus(RequestStatus.loading)
      )
      .addCase(getUserNotificationDetails.fulfilled, (state, action) => {
        state.status = RequestStatus.idle;
        state.notificationDetail = action.payload;
      })
      .addCase(
        getUserNotificationDetails.rejected,
        setStateRequestStatus(RequestStatus.failed)
      );

    builder
      .addCase(
        deleteUserNotification.pending,
        setStateRequestStatus(RequestStatus.loading)
      )
      .addCase(
        deleteUserNotification.fulfilled,
        setStateRequestStatus(RequestStatus.idle)
      )
      .addCase(
        deleteUserNotification.rejected,
        setStateRequestStatus(RequestStatus.failed)
      );
  },
});

export const { clearData } = userNotificationSlice.actions;

export const notificationSelector = (state: RootState) =>
  state.userNotification;

export default userNotificationSlice.reducer;
