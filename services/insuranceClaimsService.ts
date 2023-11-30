import { ICreateInsuranceClaims } from "../store/insurance/insuranceClaimsSlice";
import requestService, { HandleApiResp } from "../utils/request";

class InsuranceClaimService {
  public async getAllInsuranceCompanies(): Promise<any> {
    return await requestService
      .get(`/InsuranceClaims/GetAllInsuranceCompanies`)
      .then((res) => HandleApiResp(res));
  }

  public async createInsuranceClaim(
    data: ICreateInsuranceClaims
  ): Promise<any> {
    return await requestService
      .post(`/InsuranceClaims/CreateInsuranceClaim`, data)
      .then((res) => HandleApiResp(res));
  }
}

export default new InsuranceClaimService();
