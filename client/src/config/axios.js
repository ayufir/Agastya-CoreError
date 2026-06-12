import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL || "https://agastya-coreerror-api.onrender.com";

const axiosInstance = axios.create({
  baseURL: `${apiURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
