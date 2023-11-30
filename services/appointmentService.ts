import {
  IAddAppointmentReview,
  IApiResponse,
  IMakeAppointment,
} from "../commonModules/commonInterfaces";
import {
  DoctorScheduleTimingSlotsQueryResult,
  ICancelAppointment,
  IGetAllAppointmentReq,
  IRescheduleAppointment,
  IRescheduleAppointmentRes,
} from "../store/user/appointmentSlice";
import { IApplyWalletBalance } from "../store/user/userWalletSlice";
import requestService, { ApiResponse, HandleApiResp } from "../utils/request";
import { ZoomAuthToken } from "./models/zooomAuthToken";

class AppointmentService {
  public async getAllAppointment(data: IGetAllAppointmentReq): Promise<any> {
    return await requestService
      .get("/Appointments/GetAllAppointments", data)
      .then((res) => HandleApiResp(res));
  }

  public async getPastConsultations(userId: number): Promise<any> {
    return await requestService
      .get(`/Appointments/GetPastConsulations/${userId}`)
      .then((res) => HandleApiResp(res));
  }

  public async makeAppointment(data: IMakeAppointment): Promise<any> {
    return await requestService
      .post("/Appointments/MakeAppointment", data)
      .then((res) => HandleApiResp(res));
  }

  public async addAppointmentReview(data: IAddAppointmentReview): Promise<any> {
    return await requestService
      .post("/Appointments/AddAppointmentReview", data)
      .then((res) => HandleApiResp(res));
  }

  public async getAppointmentReviewes(params: {
    UserId: number;
    feedbackSortingType?: number;
  }): Promise<any> {
    return await requestService
      .get("/Appointments/GetUserFeedbacks", params)
      .then((res) => HandleApiResp(res));
  }

  public async getDoctorScheduleTimingSlots(params: {
    doctorId: number;
    userId?: number;
    timeZoneOffSet: string;
    serviceTypeId: number;
  }): Promise<ApiResponse<DoctorScheduleTimingSlotsQueryResult>> {
    return await requestService
      .get("/Appointments/GetDoctorScheduleTimingSlots", params)
      .then((res) => HandleApiResp(res));
  }

  public async applyWalletBalance(data: IApplyWalletBalance): Promise<any> {
    return await requestService
      .post(`/Appointments/ApplyWalletBalance/`, data)
      .then((res) => HandleApiResp(res));
  }

  public async getAppointment(id: number): Promise<any> {
    return await requestService
      .get(
        `/Appointments/GetAppointment/${id}?timeZoneOffset=${new Date().getTimezoneOffset()}`
      )
      .then((res) => HandleApiResp(res));
  }

  public async cancelAppointment(data: ICancelAppointment): Promise<any> {
    return await requestService
      .post(`/Appointments/CancelAppintment/`, data)
      .then((res) => HandleApiResp(res));
  }

  public async rescheduleAppointment(
    data: IRescheduleAppointment
  ): Promise<IApiResponse<IRescheduleAppointmentRes>> {
    return await requestService
      .post(`/Appointments/rescheduleAppointment/`, data)
      .then((res) => HandleApiResp(res));
  }

  public async getZoomAuthToken(data: {
    appointmentId: number;
    isDoctor: boolean;
    userName: string;
  }): Promise<IApiResponse<ZoomAuthToken>> {
    return await requestService
      .post(`/Appointments/GetZoomCallAuthToken`, data)
      .then((res) => HandleApiResp(res));
  }
}

export default new AppointmentService();
