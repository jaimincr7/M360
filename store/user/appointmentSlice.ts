import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IAddAppointmentReview,
  IFilterDoctors,
  IMakeAppointment,
} from "../../commonModules/commonInterfaces";
import appointmentService from "../../services/appointmentService";
import { RootState } from "../../utils/store";

export enum PartOfDay {
  Morning,
  AfterNoon,
  Evening,
}

export enum DoctorServiceType {
  HospitalVisit,
  VideoConsulting,
  HomeVisit,
}

export interface ICancelAppointment {
  appointmentId: number;
  appointmentCancelledByUserId: number;
  appointmentCancelledByUserType: number;
  remark: string;
}

export interface IRescheduleAppointment {
  appointmentId: number;
  rescheduledByUserId: number;
  rescheduledByUserType: number;
  remark: string;
  oldServiceTypeId: number;
  newServiceTypeId: number;
  oldAppointmentDate: Date;
  newAppointmentDate: Date;
}

export interface IRescheduleAppointmentRes {
  appointmentId: number;
  message: string;
  isSuccess: boolean;
}

export interface IGetAllAppointmentReq {
  userId: number;
  feedbackSortingType?: number;
  mobileAppointmentSortingType?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface DoctorScheduleTimingSlotsQueryResult {
  doctorScheduleTimingId: number;
  doctorId: number;
  serviceTypeId: number;
  walletBalance: number;
  daySlots: DaySlot[];
}

export interface DaySlot {
  date: string;
  shortDate: string;
  shortDayName: string;
  dayOfWeek: number;
  day: number;
  year: number;
  partOfDaySlots: PartOfDaySlot[] | null;
}

export interface PartOfDaySlot {
  dayOfWeek: number;
  partOfDay: PartOfDay;
  partOfDayName: string | null;
  hospitalName: string | null;
  hospitalAddress: string | null;
  hospitalId: number;
  serviceCharge: number;
  displayServiceCharge: string | null;
  isFreeService: boolean;
  timeSlotDurationInMinutes: number;
  startTime: string;
  endTime: string;
  timeSlots: TimeSlot[] | null;
}

export interface TimeSlot {
  time: string;
  slotDateTime: string;
}

export interface AppointmenttState {
  value: number;
  status: "idle" | "loading" | "failed";
  data: {
    status: String;
    appointment: any;
  };
  makeAppointment: {
    status: String;
    selectedDoctorForAppointment: number | null | undefined;
    selectedSlot: TimeSlot | null;
    appointmentSlots: DoctorScheduleTimingSlotsQueryResult | null;
    serviceType: number;
  };
  addAppointment: {
    status: String;
    addappointment: any;
  };
  pastAppointments: {
    status: string;
    pastAppointments: any;
  };
  bookedAppointmentDetail: any;
  appointmentDetail: {
    status: string;
    data: any;
  };
  cancelAppointmentDetail: {
    status: string;
    data: any;
  };
  rescheduleAppointment: {
    status: string;
  };
}

const initialState: AppointmenttState = {
  value: 0,
  status: "idle",
  data: {
    status: "idle",
    appointment: [],
  },
  makeAppointment: {
    status: "idle",
    appointmentSlots: null,
    selectedSlot: null,
    selectedDoctorForAppointment: null,
    serviceType: DoctorServiceType.HospitalVisit,
  },
  addAppointment: {
    status: "idle",
    addappointment: [],
  },
  pastAppointments: {
    status: "idle",
    pastAppointments: [],
  },
  bookedAppointmentDetail: {},
  appointmentDetail: {
    status: "idle",
    data: {},
  },
  cancelAppointmentDetail: {
    status: "idle",
    data: {},
  },
  rescheduleAppointment: {
    status: "idle",
  },
};

export const getAllAppointmentAction = createAsyncThunk(
  "getAllAppointmentAction",
  async (data: IGetAllAppointmentReq) => {
    const response = await appointmentService.getAllAppointment(data);
    return response.data;
  }
);

export const makeAppointmentAction = createAsyncThunk(
  "makeAppointmentAction",
  async (data: IMakeAppointment) => {
    const response = await appointmentService.makeAppointment(data);
    return response.data;
  }
);

export const addAppointmentReviewAction = createAsyncThunk(
  "addAppointmentReviewAction",
  async (data: IAddAppointmentReview) => {
    const response = await appointmentService.addAppointmentReview(data);
    return response.data;
  }
);

export const getDoctorSlotsAction = createAsyncThunk(
  "getDoctorSlotsAction",
  async (data: {
    doctorId: number;
    userId: number;
    timeZoneOffSet: string;
    serviceTypeId: number;
  }) => {
    if (!data.doctorId) {
      return null;
    }

    const response = await appointmentService.getDoctorScheduleTimingSlots(
      data
    );
    return response.data;
  }
);

export const getPastConsultations = createAsyncThunk(
  "getPastConsultations",
  async (userId: number) => {
    const response = await appointmentService.getPastConsultations(userId);
    return response.data;
  }
);

export const cancelAppointmentAction = createAsyncThunk(
  "cancelAppointment",
  async (data: ICancelAppointment) => {
    const response = await appointmentService.cancelAppointment(data);
    return response.data;
  }
);

export const getAppointmentAction = createAsyncThunk(
  "getAppointment",
  async (id: number) => {
    const response = await appointmentService.getAppointment(id);
    return response.data;
  }
);

export const rescheduleAppointmentAction = createAsyncThunk(
  "rescheduleAppointmentAction",
  async (data: IRescheduleAppointment) => {
    const response = await appointmentService.rescheduleAppointment(data);
    return response.data;
  }
);

export const appointment = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearData: (state) => {
      state.data.appointment = [];
    },
    clearMakeAppointmentState: (state) => {
      state.makeAppointment = {
        appointmentSlots: null,
        selectedDoctorForAppointment: null,
        selectedSlot: null,
        serviceType: DoctorServiceType.HospitalVisit,
        status: "idle",
      };
    },
    setBookedAppointmentData: (state, { payload }) => {
      state.bookedAppointmentDetail = payload;
    },
    clearBookedAppointmentData: (state) => {
      state.bookedAppointmentDetail = {};
    },
  },
  extraReducers: (builder) => {
    //To get All appointment
    builder
      .addCase(getAllAppointmentAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllAppointmentAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.appointment = action.payload;
      })
      .addCase(getAllAppointmentAction.rejected, (state) => {
        state.status = "failed";
      });

    //To add appointment review
    builder
      .addCase(addAppointmentReviewAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAppointmentReviewAction.fulfilled, (state, action) => {
        state.status = "idle";
        state.addAppointment.addappointment = action.payload;
      })
      .addCase(addAppointmentReviewAction.rejected, (state) => {
        state.status = "failed";
      });

    //To add appointment review
    builder
      .addCase(getDoctorSlotsAction.pending, (state) => {
        state.makeAppointment.status = "loading";
      })
      .addCase(getDoctorSlotsAction.fulfilled, (state, action) => {
        state.makeAppointment.status = "idle";
        state.makeAppointment.appointmentSlots = action.payload;
      })
      .addCase(getDoctorSlotsAction.rejected, (state) => {
        state.status = "failed";
      });

    //To get Past Consultations
    builder
      .addCase(getPastConsultations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPastConsultations.fulfilled, (state, action) => {
        state.status = "idle";
        state.pastAppointments = action.payload;
      })
      .addCase(getPastConsultations.rejected, (state) => {
        state.status = "failed";
      });

    //get appointment
    builder
      .addCase(getAppointmentAction.pending, (state) => {
        state.appointmentDetail.status = "loading";
      })
      .addCase(getAppointmentAction.fulfilled, (state, action) => {
        state.appointmentDetail.status = "idle";
        state.appointmentDetail.data = action.payload;
      })
      .addCase(getAppointmentAction.rejected, (state) => {
        state.appointmentDetail.status = "failed";
      });

    //cancel appointment
    builder
      .addCase(cancelAppointmentAction.pending, (state) => {
        state.cancelAppointmentDetail.status = "loading";
      })
      .addCase(cancelAppointmentAction.fulfilled, (state, action) => {
        state.cancelAppointmentDetail.status = "idle";
        state.cancelAppointmentDetail.data = action.payload;
      })
      .addCase(cancelAppointmentAction.rejected, (state) => {
        state.cancelAppointmentDetail.status = "failed";
      });

    //reschedule appointment
    builder
      .addCase(rescheduleAppointmentAction.pending, (state) => {
        state.rescheduleAppointment.status = "loading";
      })
      .addCase(rescheduleAppointmentAction.fulfilled, (state, action) => {
        state.rescheduleAppointment.status = "idle";
      })
      .addCase(rescheduleAppointmentAction.rejected, (state) => {
        state.rescheduleAppointment.status = "failed";
      });
  },
});

export const {
  clearData,
  setBookedAppointmentData,
  clearBookedAppointmentData,
} = appointment.actions;

export const appointmentStateSelector = (state: RootState) => state.appointment;

export default appointment.reducer;
