import { ICreateUser } from "./commonInterfaces";

export const CURRENT_USER = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("user") as string) as any;
  }
};

export const CURRENT_LANG_ID = () => {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("languageId") || 1) as string;
  }
};
