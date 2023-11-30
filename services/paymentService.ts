import requestService, { HandleApiResp } from "../utils/request";

class PaymentService {
  public async getWalletHistory(query: any): Promise<any> {
    return await requestService
      .get(`/WalletHistories/GetAllWalletHistories`, query)
      .then((res) => HandleApiResp(res));
  }

  public async getAllWalletBalances(userId: number): Promise<any> {
    return await requestService
      .get(`/WalletBalances/GetAllWalletBalances?UserId=${userId}`)
      .then((res) => HandleApiResp(res));
  }
}

export default new PaymentService();
