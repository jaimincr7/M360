import { IApplyPromocode } from "../store/promocode/promocodeSlice";
import requestService, { HandleApiResp } from "../utils/request";

class PromocodeService {
  public async applyPromoCode(data: IApplyPromocode): Promise<any> {
    return await requestService
      .post(`/PromoCodes/ApplyPromoCode`, data)
      .then((res) => HandleApiResp(res));
  }

  public async getAllPromoCodes(): Promise<any> {
    return await requestService
      .get(`/PromoCodes/GetAllPromoCodes`)
      .then((res) => HandleApiResp(res));
  }

  public async getPromoDetails(id:number): Promise<any> {
    return await requestService
      .get(`/PromoCodes/GetPromoDetails/${id}`)
      .then((res) => HandleApiResp(res));
  }
}

export default new PromocodeService();
