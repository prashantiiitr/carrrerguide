import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  // if you use Vite proxy: baseURL: "/api"
  baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err.message || "Something went wrong";
    toast.error(msg);
    return Promise.reject(err);
  }
);

export default API;
