import { create } from "zustand";
import axios from "../../axiosConfig";
import Cookie from "js-cookie";

const API_URL = "https://airaware.up.railway.app/api/auth/login";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!Cookie.get("token"),
  token: Cookie.get("token"),

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(API_URL, credentials); // Sending username & password

      // Check if the response was successful
      if (response.data.success) {
        const { user, token } = response.data;

        // Save token in cookies and set it in the store
        Cookie.set("token", token, { expires: 7 });

        set({
          user: user,
          token: token,
          isAuthenticated: true,
          loading: false,
        });

        if (user.role === "admin") {
          window.location.href = "/admin"; // or use a react-router navigation method
        } else {
          window.location.href = "/error"; // Redirect non-admin users to another page
        }
      } else {
        set({ error: response.data.message, loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        "https://airaware.up.railway.app/api/auth/logout"
      ); // Send logout request to backend

      if (response.data.success) {
        // Remove token from cookies and reset the state
        Cookie.remove("token");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },
}));
