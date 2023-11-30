import requestService, { HandleApiResp } from "../utils/request";

class symptomsService {
  public async getAllSymptomsList(): Promise<any> {
    return await requestService
      .get("/Symptoms/GetAllSymptoms")
      .then((res) => HandleApiResp(res));
  }
}

export default new symptomsService();
