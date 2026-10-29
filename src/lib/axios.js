import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "https://e-commerce-backend-complete.onrender.com/api/v1",
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});
