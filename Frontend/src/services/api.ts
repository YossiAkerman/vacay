import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3006/api",
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("🔑 Adding token to request:", config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("⚠️ No token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      url: response.config.url,
      status: response.status,
      method: response.config.method
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("❌ API Error:", {
        url: error.config.url,
        status: error.response.status,
        message: error.response.data?.message || error.message,
        headers: error.response.headers
      });

      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        console.log("🔒 Session expired, clearing local storage");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("id");
        window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
    } else {
      console.error("❌ Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default API;
