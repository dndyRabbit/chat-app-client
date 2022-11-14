import axios from "axios";
import { getAccessToken, getRefreshToken } from "../utils/token";

const axiosAPI = axios.create({
  baseURL: "http://localhost:2600/api/",
  headers: {
    // Authorization: `Bearer ${getAccessToken()}`,
    "Content-Type": "application/json;charset=UTF-8",
  },
});

axiosAPI.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default axiosAPI;
