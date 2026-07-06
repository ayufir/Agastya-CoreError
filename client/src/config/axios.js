import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL || "https://agastya-coreerror-api.onrender.com";

const axiosInstance = axios.create({
  baseURL: `${apiURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Memory cache store
const cacheStore = new Map();
const CACHE_TTL = 30000; // 30 seconds

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = (config.method || "").toLowerCase();

    // Cache Invalidation on data mutation (POST, PUT, DELETE)
    if (method === "post" || method === "put" || method === "delete") {
      cacheStore.clear();
    }

    // Serve from cache for GET requests
    if (method === "get") {
      const cacheKey = config.url + JSON.stringify(config.params || {});
      const cachedEntry = cacheStore.get(cacheKey);

      if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL) {
        // Return a mock adapter that resolves instantly with cached response
        config.adapter = () => {
          return Promise.resolve({
            data: cachedEntry.data,
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          });
        };
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const method = (response.config.method || "").toLowerCase();

    // Cache GET response data
    if (method === "get" && response.status === 200) {
      const cacheKey = response.config.url + JSON.stringify(response.config.params || {});
      cacheStore.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
