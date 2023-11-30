import requestService, { HandleApiResp } from "../utils/request";

class UserNotification {
  public async getUserNotifications(params: any): Promise<any> {
    return await requestService
      .get(`/Notifications/GetAllNotifications`, params)
      .then((res) => HandleApiResp(res));
  }

  public async getUserNotificationDetails(
    notificationId: number
  ): Promise<any> {
    return await requestService
      .get(`/Notifications/ViewNotification`, { notificationId })
      .then((res) => HandleApiResp(res));
  }

  public async deleteUserNotificationDetails(
    notificationId: number
  ): Promise<any> {
    return await requestService
      .delete(`/Notifications/DeleteNotification`, { id: notificationId })
      .then((res) => HandleApiResp(res));
  }
}

export default new UserNotification();
