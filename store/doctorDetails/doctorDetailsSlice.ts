import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import doctorDetailsService from "../../services/doctorService";
import { RootState } from "../../utils/store";

export interface DoctorsDetailsState {
  value: number;
  status: "idle" | "loading" | "failed";
  data: {
    status: String;
    doctorDetails: any;
  };
  promoCodes: {
    status: String;
    promoCodes: any;
  };
  doctorFeedbacks: {
    status: String;
    doctorFeedbacks: any;
  };
  doctorHospital: {
    status: String;
    doctorHospital: any;
  };
  promoCodeDetails: any;
}

const initialState: DoctorsDetailsState = {
  value: 0,
  status: "idle",
  data: {
    status: "idle",
    doctorDetails: {},
  },
  promoCodes: {
    status: "idle",
    promoCodes: {},
  },
  doctorFeedbacks: {
    status: "idle",
    doctorFeedbacks: {},
  },
  doctorHospital: {
    status: "idle",
    doctorHospital: {},
  },
  promoCodeDetails: {},
};

//For getting Doctor Details
export const getDoctorsDetailsAction = createAsyncThunk(
  "getDoctorsDetailsAction",
  async (id: number) => {
    const response = await doctorDetailsService.getDoctorDetails(id);
    return response.data;
  }
);

//For Getting doctors Feedback
export const getDoctorFeedbackAction = createAsyncThunk(
  "getDoctorFeedbackAction",
  async (payload:{id: number,orderType:string}) => {
    const response = await doctorDetailsService.getDoctorFeedbackDetails(payload.id,payload.orderType);
    return response.data;
  }
);

export const getPromoCodesAction = createAsyncThunk(
  "getPromoCodesAction",
  async (payload: { drId: number; serviceTypeId?: number,hpId?:number }) => {
    const response = await doctorDetailsService.getPromoCodes(
      payload.drId,
      payload.hpId ? payload.hpId : 0,
      payload.serviceTypeId
    );
    return response.data;
  }
);

//For Getting particular Doctor's Hospital
export const getDoctorHospitalAction = createAsyncThunk(
  "getDoctorHospitalAction",
  async (id: number) => {
    const response = await doctorDetailsService.getDoctorHospital(id);
    return response.data;
  }
);

export const doctorDetails = createSlice({
  name: "doctorDetails",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data.doctorDetails = {};
    },
    setPromoCodeDetail: (state, { payload }) => {
      state.promoCodeDetails = payload;
    },
    clearPromoCodeDetail: (state, { payload }) => {
      state.promoCodeDetails = {};
    },
  },
  extraReducers: (builder) => {
    //For Get Doctor Details by Id.
    builder
      .addCase(getDoctorsDetailsAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDoctorsDetailsAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.doctorDetails = action.payload;
      })
      .addCase(getDoctorsDetailsAction.rejected, (state) => {
        state.status = "failed";
      });

    //For Get Promo Codes by Id.
    builder
      .addCase(getPromoCodesAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPromoCodesAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.promoCodes.promoCodes = action.payload.promoCodes;
      })
      .addCase(getPromoCodesAction.rejected, (state) => {
        state.status = "failed";
      });

    //For Getting Doctor Feedback by Id.
    builder
      .addCase(getDoctorFeedbackAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDoctorFeedbackAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.doctorFeedbacks.doctorFeedbacks = action.payload.feedbacks;
      })
      .addCase(getDoctorFeedbackAction.rejected, (state) => {
        state.status = "failed";
      });

    //For Getting Doctor Hospital by Id.
    builder
      .addCase(getDoctorHospitalAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDoctorHospitalAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.doctorHospital.doctorHospital = action.payload.hospitals;
      })
      .addCase(getDoctorHospitalAction.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearData, setPromoCodeDetail, clearPromoCodeDetail } =
  doctorDetails.actions;

export const doctorDetailsSelector = (state: RootState) => state.doctorDetails;

export default doctorDetails.reducer;
