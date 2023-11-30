import { IFilterDoctors } from "../commonModules/commonInterfaces";
import { ICreateDoctor } from "../store/doctorList/doctorListSlice";
import requestService, { HandleApiResp } from "../utils/request";

class DoctorService {
  public async getDoctorFeedbackDetails(id: number,orderType:string): Promise<any> {
    return await requestService
      .get(`/Doctors/GetDoctorFeedbacks?DoctorId=${id}&OrderType=${orderType}`)
      .then((res) => HandleApiResp(res));
  }

  public async getDoctorDetails(id: number): Promise<any> {
    return await requestService
      .get(`/Doctors/GetDoctor/${id}`)
      .then((res) => HandleApiResp(res));
  }

  public async getPromoCodes(
    doctorId: number,
    hospitalId: number,
    serviceTypeId?: number
  ): Promise<any> {
    return await requestService
      .get(`/Doctors/GetDoctorPromocodes`, {
        doctorId,
        hospitalId,
        serviceTypeId,
      })
      .then((res) => HandleApiResp(res));
  }

  public async getDoctorHospital(id: number): Promise<any> {
    return await requestService
      .get(`/Doctors/GetDoctorHospitals/${id}`)
      .then((res) => HandleApiResp(res));
  }

  public async getPateintFeedbacks(id: number): Promise<any> {
    const params = { DoctorId: id };
    return await requestService
      .get("/Doctors/GetDoctorFeedbacks", params)
      .then((res) => HandleApiResp(res));
  }

  public async getAllDoctorsList(data: IFilterDoctors): Promise<any> {
    return await requestService
      .post("/Doctors/FilterDoctors", data)
      .then((res) => HandleApiResp(res));
  }

  public async createDoctor(data: ICreateDoctor): Promise<any> {
    return await requestService
      .post("/Doctors/CreateDoctor", data)
      .then((res) => HandleApiResp(res));
  }
}

export default new DoctorService();
