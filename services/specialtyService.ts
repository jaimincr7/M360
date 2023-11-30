import requestService, { HandleApiResp } from "../utils/request";

class SpecialtyService {
  public async getAllSpecialitiesList(param?: any): Promise<any> {
    return await requestService
      .get("/Specialities/GetAllSpecialities", param)
      .then((res) => HandleApiResp(res));
  }
}

export default new SpecialtyService();
