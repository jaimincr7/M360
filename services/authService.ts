import {
  IChangePassword,
  ICreateUser,
  ILoginUser,
  ILoginUserWithOTP,
  IRequestOTP,
  IVerifyOTP,
} from "../commonModules/commonInterfaces";
import requestService, { HandleApiResp } from "../utils/request";

class AuthService {
  public async loginUser(data: ILoginUser): Promise<any> {
    return await requestService
      .post("/Auth/Login", data)
      .then((res) => HandleApiResp(res));
  }

  public async loginWithOTP(data: ILoginUserWithOTP): Promise<any> {
    return await requestService
      .post("/Auth/LoginWithOTP", data)
      .then((res) => HandleApiResp(res));
  }

  public async createUser(data: ICreateUser): Promise<any> {
    return await requestService
      .post("/Users/CreateUser", data)
      .then((res) => HandleApiResp(res));
  }

  public async requestOTP(data: IRequestOTP): Promise<any> {
    return await requestService
      .post("/Auth/RequestOTP", data)
      .then((res) => HandleApiResp(res));
  }

  public async verifyOTP(data: IVerifyOTP): Promise<any> {
    return await requestService
      .post("/Auth/VerifyOTP", data)
      .then((res) => HandleApiResp(res));
  }

  public async changePassword(data: IChangePassword): Promise<any> {
    return await requestService
      .post("/Auth/ChangePassword", data)
      .then((res) => HandleApiResp(res));
  }
}

export default new AuthService();
