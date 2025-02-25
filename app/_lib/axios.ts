import axios from "axios";
import { toast } from "react-hot-toast";

const isProduction = process.env.NODE_ENV === "production";

const baseURL = isProduction
  ? "https://production-api.com"
  : typeof window !== "undefined"
    ? `http://${window.location.hostname}:3000/api`
    : "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
