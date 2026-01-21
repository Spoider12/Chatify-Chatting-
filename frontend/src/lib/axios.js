 import axios from "axios";

 const API_URL = import.meta.env.VITE_API_URL || "/api";

 // Use relative API path so Vite dev server proxy handles requests in development.
 // This ensures requests originate from the same origin (dev server) and cookies are set/sent correctly.
 export const axiosInstance = axios.create({
   baseURL: API_URL,
   withCredentials: true,
});