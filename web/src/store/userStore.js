import { create } from "zustand";
import axios from "axios";
import Cookie from "js-cookie";

export const useUserStore = create((set) => ({
  users: [], // Initial state for users
  isLoading: false,
  error: null,

  // Action to fetch all users
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        "https://airaware.up.railway.app/api/users",
        {
          headers: {
            Authorization: `Bearer ${Cookie.get("token")}`, // Include the token here
          },
        }
      );
      set({ users: response.data.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data.message || "An error occurred",
        isLoading: false,
      });
    }
  },

  // Action to fetch a single user
  fetchUserById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(
        `https://airaware.up.railway.app/api/users/${id}`
      ); // API endpoint for a single user
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data.message || "An error occurred",
        isLoading: false,
      });
      return null;
    }
  },

  // Action to edit a user
  editUser: async (id, userData) => {
    set({ isLoading: true, error: null });

    try {
      const token = Cookie.get("token"); // Get the token from cookies

      if (!token) {
        throw new Error("No token found, please log in.");
      }

      const response = await axios.patch(
        `https://airaware.up.railway.app/api/users/${id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token to the request
          },
        }
      ); // API endpoint for editing user
      set((state) => {
        // Update the user in the store
        const updatedUsers = state.users.map((user) =>
          user._id === id ? response.data.data : user
        );
        return { users: updatedUsers, isLoading: false };
      });
    } catch (error) {
      set({
        error: error.response?.data.message || "Failed to edit user",
        isLoading: false,
      });
    }
  },

  // Action to delete a user
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const token = Cookie.get("token"); // Get the token from cookies

      if (!token) {
        throw new Error("No token found, please log in.");
      }

      console.log("Deleting user with ID:", id);

      await axios.delete(`https://airaware.up.railway.app/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token to the request
        },
      }); // API endpoint for deleting user

      set((state) => ({
        users: state.users.filter((user) => user._id !== id), // Remove the user from the state
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error.response?.data.message ||
          error.message ||
          "Failed to delete user",
        isLoading: false,
      });
    }
  },
  createUser: async (userData) => {
    set({ isLoading: true, error: null, successMessage: null });

    try {
      const response = await axios.post(
        "https://airaware.up.railway.app/api/users",
        userData
      );

      // Store the success message upon successful user creation
      set({
        successMessage: response.data.message,
        isLoading: false,
      });

      return response.data; // Optionally return the new user data
    } catch (error) {
      set({
        error: error.response?.data.message || "Failed to create user",
        isLoading: false,
      });
    }
  },
}));
