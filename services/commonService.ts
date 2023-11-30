import {
  IAddPatient,
  IAddUser,
  IAddUserAddress,
} from "../commonModules/commonInterfaces";
import { DeviceType } from "../utils/constant";
import requestService, {
  HandleApiResp,
  handleRequestError,
} from "../utils/request";

class CommonService {
  public async getAllCities(param?: any): Promise<any> {
    return await requestService
      .get(`/Cities/GetAllCities`, param)
      .then((res) => HandleApiResp(res));
  }

  public async getAllDoctorNames(param?: any): Promise<any> {
    return await requestService
      .get(`/Doctors/GetDoctorNames`, param)
      .then((res) => HandleApiResp(res));
  }

  public async getConfig(): Promise<any> {
    return await requestService
      .get(`/Configs/GetConfig?deviceType=${DeviceType.Web}`)
      .then((res) => HandleApiResp(res));
  }

  public async getAllCountries(): Promise<any> {
    return await requestService
      .get(`/Countries/GetAllCountries`)
      .then((res) => HandleApiResp(res));
  }

  public async getGlobalSearches(search: string): Promise<any> {
    return await requestService
      .get(`/GlobalSearches/GetGlobalSearches/${search}`)
      .then((res) => HandleApiResp(res));
  }

  public async getAllLanguages(): Promise<any> {
    return await requestService
      .get(`/Languages/GetAllLanguages`)
      .then((res) => HandleApiResp(res));
  }

  public async getAllPatients(): Promise<any> {
    return await requestService
      .get(`/Patients/GetPatients`)
      .then((res) => HandleApiResp(res));
  }

  public async getGlobalSearch(param?: any): Promise<any> {
    return await requestService
      .get(`/GlobalSearches/GetGlobalSearches`, param)
      .then((res) => HandleApiResp(res));
  }

  public async addPateint(data: IAddPatient): Promise<any> {
    return await requestService
      .post(`/Patients/AddPatient`, data)
      .then((res) => HandleApiResp(res));
  }

  public async getAllRelations(): Promise<any> {
    return await requestService
      .get(`/Relations/GetAllRelations`)
      .then((res) => HandleApiResp(res));
  }

  public async getAllStates(): Promise<any> {
    return await requestService
      .get(`/States/GetAllStates`)
      .then((res) => HandleApiResp(res));
  }

  public async addUserAddresses(data: IAddUserAddress): Promise<any> {
    return await requestService
      .get(`/Users/AddUserAddress`)
      .then((res) => HandleApiResp(res));
  }

  public async addUser(data: IAddUser): Promise<any> {
    return await requestService
      .post(`/Users/AddUserAddress`, data)
      .then((res) => HandleApiResp(res));
  }

  public async getAllServiceTypes(): Promise<any> {
    return await requestService
      .get(`/ServiceTypes/GetAllServiceTypes`)
      .then((res) => HandleApiResp(res));
  }

  public async getInfoContent(
    contentType: number,
    languageId: number
  ): Promise<any> {
    return await requestService
      .get(
        `/Contents/GetContent?ContentId=${contentType}&LanguageId=${languageId}`
      )
      .then((res) => HandleApiResp(res));
  }

  public async getReferralUrl(
    userId: number,
    deviceType: number
  ): Promise<any> {
    return await requestService
      .get(
        `/ManageReferrals/GetReferralUrl?userId=${userId}&deviceType=${deviceType}`
      )
      .then((res) => HandleApiResp(res));
  }

  public async getReferralDetails(
    userId: number,
    deviceType: number
  ): Promise<any> {
    return await requestService
      .get(
        `/ManageReferrals/GetCurrentManageReferral?userId=${userId}&deviceType=${deviceType}`
      )
      .then((res) => HandleApiResp(res));
  }

  public async getFileUploadDetails(
    files: { fileName: string; fileType: number }[]
  ): Promise<any> {
    // const isForMulti = files?.length > 1 ? true : false;
    return await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL +
        `/AwsS/${
          // isForMulti ? "GetMultipleFileUploadDetails" : "GetFileUploadDetails"
          "GetMultipleFileUploadDetails"
        }`,
      {
        method: "POST",
        body: JSON.stringify({ files }),
        // body: JSON.stringify(isForMulti ? { files } : files[0]),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then(async (response) => {
        if (response.ok) {
          return await response.json();
        } else {
          handleRequestError(await response.json(), response.status);
        }
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.error(`Error uploading image: ${err.message}`);
      });
  }

  public async uploadFile(url: string, file: any): Promise<any> {
    return await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    })
      .then(async (response) => {
        if (response.ok) {
          return response;
        }
      })
      .catch((err) => {
        console.error(`Error uploading image: ${err.message}`);
      });
  }
}

export default new CommonService();
