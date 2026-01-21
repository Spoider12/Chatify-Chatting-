 import axios from "axios";

 // Use relative API path so Vite dev server proxy handles requests in development.
 // This ensures requests originate from the same origin (dev server) and cookies are set/sent correctly.
 export const axiosInstance = axios.create({
   baseURL: "/api",
   withCredentials: true,
});