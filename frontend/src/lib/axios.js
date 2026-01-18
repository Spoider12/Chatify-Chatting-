 import axios from "axios";

 // Use relative API path so Vite dev server proxy handles requests in development.
 // This ensures requests originate from the same origin (dev server) and cookies are set/sent correctly.
 const baseURL = import.meta.env.MODE === "development"
   ? "/api"
   : (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : "/api");

 export const axiosInstance = axios.create({
   baseURL: baseURL,
   withCredentials: true,
});