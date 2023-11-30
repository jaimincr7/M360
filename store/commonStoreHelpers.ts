import { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit";
import { RequestStatus } from "../utils/request";

export const setStateRequestStatus = (status: RequestStatus) => (state) => {
  state.status = status;
};

export const addDefaultExtraReducers = <T>(
  builder: ActionReducerMapBuilder<T>,
  thunks: AsyncThunk<any, any, any>[]
) => {
  thunks.forEach((t) => {
    builder
      .addCase(t.pending, setStateRequestStatus(RequestStatus.loading))
      .addCase(t.fulfilled, setStateRequestStatus(RequestStatus.idle))
      .addCase(t.rejected, setStateRequestStatus(RequestStatus.failed));
  });
};
