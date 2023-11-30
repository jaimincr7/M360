import requestService, { HandleApiResp } from "../utils/request";

class HomeService {
  public async getAllBanners(): Promise<any> {
    return requestService
      .get("/Banners/GetAllBanners")
      .then((res) => HandleApiResp(res));
  }

  public async getAllPromotionals(): Promise<any> {
    return requestService
      .get("/Promotionals/GetAllPromotionals")
      .then((res) => HandleApiResp(res));
  }

  public async getAllTestimonials(): Promise<any> {
    return requestService
      .get("/Testimonials/GetAllTestimonials")
      .then((res) => HandleApiResp(res));
  }
}

export default new HomeService();
