import { IAddContactUs } from "../commonModules/commonInterfaces";
import requestService, { HandleApiResp } from "../utils/request";

class ContactUsService {
  public async addContactUsMessage(data: IAddContactUs): Promise<any> {
    return await requestService
      .post("/ContactUsMessages/AddContactUsMessage", data)
      .then((res) => HandleApiResp(res));
  }
}

export default new ContactUsService();
