import { IAddPatient } from "../commonModules/commonInterfaces";
import { PatientDetails } from "../store/patientDetails/patientDetailsSlice";
import { UserHealthRecord } from "../store/user/userHealthRecordSlice";
import requestService, { ApiResponse, HandleApiResp } from "../utils/request";

class PatientService {
  public async getPatients(userId: number): Promise<any> {
    return await requestService
      .get(`/Patients/GetPatients?UserId=${userId}`)
      .then((res) => HandleApiResp(res));
  }

  public async getPatientDetails(
    patientId: number
  ): Promise<ApiResponse<PatientDetails>> {
    return await requestService
      .get(`/Patients/GetPatient/${patientId}`)
      .then((res) => HandleApiResp(res));
  }

  public async getPatientHealthRecords(
    userId: number,
    duration: number
  ): Promise<any> {
    return await requestService
      .get(`/Users/GetUserHealthRecords/${userId}?duration=${duration}`)
      .then((res) => HandleApiResp(res));
  }

  public async getPatientHealthRecordDetails(
    patientId: number,
    healthRecordId: number
  ): Promise<any> {
    return await requestService
      .get(`/Users/GetUserHealthRecord/${patientId}/${healthRecordId}`)
      .then((res) => HandleApiResp(res));
  }

  public async createPatientHealthRecord(data: UserHealthRecord): Promise<any> {
    return await requestService
      .get("/Users/CreateUserHealthRecord")
      .then((res) => HandleApiResp(res));
  }

  public async deleteHealthRecord(healthRecordId: number): Promise<any> {
    return await requestService
      .delete("/Users/DeleteUserHealthRecord", { id: healthRecordId })
      .then((res) => HandleApiResp(res));
  }

  public async updatePatient(data: IAddPatient): Promise<any> {
    return await requestService
      .post("/Patients/UpdatePatient", data)
      .then((res) => HandleApiResp(res));
  }
  public async addPatient(data: IAddPatient): Promise<any> {
    return await requestService
      .post("/Patients/AddPatient", data)
      .then((res) => HandleApiResp(res));
  }

  public async deletePatient(id: number): Promise<any> {
    return await requestService
      .delete(`/Patients/DeletePatient?id=${id}`)
      .then((res) => HandleApiResp(res));
  }
}

export default new PatientService();
