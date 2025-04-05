import axios from "axios";
import Cookie from "js-cookie";

// Add a request interceptor to include token in headers
axios.interceptors.request.use(
  (config) => {
    const token = Cookie.get("token"); // Get the token from cookies
    if (token) {
      // If the token exists, include it in the Authorization header
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
