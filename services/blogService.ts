import requestService, { HandleApiResp } from "../utils/request";

class BlogService {
  public async getAllBlogCategories(): Promise<any> {
    return await requestService
      .get("/BlogCategories/GetAllBlogCategories")
      .then((res) => res.json());
  }

  public async getAllBlogs(
    categoryId?: number,
    search?: string,
    PageNumber?: number,
    PageSize?: number
  ): Promise<any> {
    let params: any = {};
    if (categoryId && search) {
      params = { BlogCategoryId: categoryId, Title: search };
    } else if (categoryId) {
      params = { BlogCategoryId: categoryId };
    } else if (search) {
      params = { Title: search };
    }
    if (PageNumber) {
      params = { ...params, PageNumber };
    }
    if (PageSize) {
      params = { ...params, PageSize };
    }

    return await requestService
      .get("/Blogs/GetAllBlogs", params)
      .then((res) => HandleApiResp(res));
  }

  public async getBlogById(id: number): Promise<any> {
    return await requestService
      .get(`/Blogs/GetBlog/${id}`)
      .then((res) => HandleApiResp(res));
  }
}

export default new BlogService();
