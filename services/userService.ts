import {
  ICreateUser,
  ILoginUser,
  ILoginUserWithOTP,
  IRequestOTP,
  IResetPassword,
} from "../commonModules/commonInterfaces";
import { UserAddress } from "../store/user/addressSlice";
import {
  IChangeMobNo,
  ICreateUserHealthRecord,
  UserDetails,
} from "../store/user/userDetailsSlice";
import requestService, { HandleApiResp } from "../utils/request";

class UserService {
  public async getUserDetails(userId: number): Promise<any> {
    return await requestService
      .get(`/Users/GetUser/${userId}`)
      .then((res) => HandleApiResp(res));
  }

  public async getUserAddresses(userId: number): Promise<any> {
    return await requestService
      .get(`/Users/GetUserAddresses/${userId}`)
      .then((res) => HandleApiResp(res));
  }

  public async addUserAddress(data: UserAddress): Promise<any> {
    return await requestService
      .post(`/Users/AddUserAddress`, data)
      .then((res) => HandleApiResp(res));
  }

  public async updateUserAddress(data: UserAddress): Promise<any> {
    return await requestService
      .post(`/Users/UpdateUserAddress`, data)
      .then((res) => HandleApiResp(res));
  }

  public async deleteUserAddress(addressId: number): Promise<any> {
    return await requestService
      .delete(`/Users/DeleteUserAddress?id=${addressId}`)
      .then((res) => HandleApiResp(res));
  }

  public async updateUserDetails(data: UserDetails): Promise<any> {
    return await requestService
      .post(`/Users/UpdateUser`, data)
      .then((res) => HandleApiResp(res));
  }

  public async changeMobileNumber(data: IChangeMobNo): Promise<any> {
    return await requestService
      .post(`/Users/ChangeMobileNumber`, data)
      .then((res) => HandleApiResp(res));
  }

  public async changeEmail(data: IChangeMobNo): Promise<any> {
    return await requestService
      .post(`/Users/ChangeEmail`, data)
      .then((res) => HandleApiResp(res));
  }

  public async resetPassword(data: IResetPassword): Promise<any> {
    return await requestService
      .post("/Users/resetPassword", data)
      .then((res) => HandleApiResp(res));
  }

  public async createUserHealthRecord(
    data: ICreateUserHealthRecord
  ): Promise<any> {
    return await requestService
      .post(`/Users/CreateUserHealthRecord`, data)
      .then((res) => HandleApiResp(res));
  }

  public async deleteUserHealthRecordFile(id: number): Promise<any> {
    return await requestService
      .delete(`/Users/DeleteUserHealthRecordFile?id=${id}`)
      .then((res) => HandleApiResp(res));
  }
}

export default new UserService();
