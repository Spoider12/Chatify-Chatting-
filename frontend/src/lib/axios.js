import axios from "axios";
const API_URL =
  import.meta.env.MODE === "development"
    ? "/api"
    : import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
});