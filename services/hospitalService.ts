import { ICreateHospital } from "../commonModules/commonInterfaces";
import requestService, { HandleApiResp } from "../utils/request";

class HospitalService {
  public async getAllHospitalsList(
    cityId?: number,
    search?: string,
    pageNumber?: number,
    pageSize?: number
  ): Promise<any> {
    let params: any = {};
    if (cityId) {
      params = { ...params, CityId: cityId };
    }
    if (search) {
      params = { ...params, Name: search };
    }
    if (pageNumber) {
      params = { ...params, PageNumber: pageNumber };
    }
    if (pageSize) {
      params = { ...params, PageSize: pageSize };
    }

    return await requestService
      .get("/Hospitals/GetAllHospitals", params)
      .then((res) => HandleApiResp(res));
  }

  public async getHospitalsBreifList(): Promise<any> {
    return await requestService
      .get("/Hospitals/GetHospitalNames")
      .then((res) => HandleApiResp(res));
  }

  public async registerHospital(body?: ICreateHospital): Promise<any> {
    return await requestService
      .post("/Hospitals/CreateHospital", body)
      .then((res) => HandleApiResp(res));
  }
}

export default new HospitalService();
