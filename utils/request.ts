import { toast } from "react-toastify";
import { CURRENT_LANG_ID, CURRENT_USER } from "../commonModules/localStorege";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const handleRequestError = (errorData, status) => {
  switch (status) {
    case 401:
      toast.error("Session expired. Please login");
      window.location.href = "/";
      break;
    case 400:
      toast.error(
        errorData.errors?.length
          ? errorData.errors.join(", ")
          : errorData.message || "Server error.Please try again after sometime."
      );
      break;
    default:
      toast.error(
        errorData.errors?.length
          ? errorData.errors.join(", ")
          : errorData.isSuccess === false && errorData.message
          ? errorData.message
          : "Server error.Please try again after sometime."
      );
      break;
  }
};

// If token is not there in local storage, its considered as valid session
const isAuthExpired = () => {
  const token = CURRENT_USER()?.token;
  if (token) {
    const tokenInfo = JSON.parse(atob(token.split(".")[1]));
    const isExpired = tokenInfo.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.clear();
      window.location.href = "/";
    }

    return isExpired;
  }

  return false;
};

const getHeaders = () => {
  return new Headers({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${CURRENT_USER()?.token}`,
    "x-accept-language": CURRENT_LANG_ID(),
    "x-timezone-offset": new Date().getTimezoneOffset().toString()
  });
};

class requestService {
  get = async (url: string, params: any = null) => {
    if (isAuthExpired()) return;

    if (params) {
      const keys = Object.keys(params);
      const urlParams = keys.map((paramName) => {
        return `${paramName}=${params[paramName]}`;
      });

      if (urlParams.length) {
        url = `${url}?${urlParams.join("&")}`;
      }
    }

    return fetch(BASE_URL + url, {
      headers: getHeaders(),
    });
  };

  post = async (url: string, body: any = null) => {
    if (isAuthExpired()) return;

    return fetch(BASE_URL + url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
  };

  put = async (url: string, body = null) => {
    if (isAuthExpired()) return;

    return fetch(BASE_URL + url, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
  };

  delete = async (url: string, params: any = null) => {
    if (isAuthExpired()) return;

    if (params) {
      const keys = Object.keys(params);
      const urlParams = keys.map((paramName) => {
        return `${paramName}=${params[paramName]}`;
      });

      if (urlParams.length) {
        url = `${url}?${urlParams.join("&")}`;
      }
    }

    return fetch(BASE_URL + url, {
      method: "DELETE",
      headers: getHeaders(),
    });
  };
}

export default new requestService();

export const HandleApiResp = async (resp) => {
  if (resp.ok) {
    const resJson = await resp.json();
    if (resJson.hasOwnProperty("isSuccess") && !resJson.isSuccess) {
      return toast.error(resJson.message);
    } else {
      return resJson;
    }
  } else {
    try {
      const errorData = resp.status === 401 ? null : await resp.json();
      handleRequestError(errorData, resp.status);
    } catch (error) {
      toast.error("Server error.Please try again after sometime.");
    }
  }
};

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string | null;
  errors: string[] | null;
  data: T | null;
}

export interface PaginationFilter {
  pageNumber: number;
  pageSize: number;
}

export enum RequestStatus {
  idle,
  loading,
  failed,
}
